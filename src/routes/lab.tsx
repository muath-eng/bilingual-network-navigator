import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Monitor, Router as RouterIcon, Server, Trash2, Link2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import {
  createRouterOsState,
  runRouterOsCommand,
  type RouterOsState,
  type RouterOsStep,
} from "@/lib/routeros-simulator";
import {
  createTopology,
  diagnose,
  labTemplates,
  simulatePing,
  type Cable,
  type Device,
} from "@/lib/lab-engine";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "مختبر المحاكاة — Network Master" },
      {
        name: "description",
        content: "ابنِ شبكتك بالأجهزة والكابلات واضبط العناوين واختبر الاتصال بـ ping.",
      },
      { property: "og:title", content: "Network Lab — Network Master" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Build a network, configure IPs and test connectivity with ping.",
      },
    ],
  }),
  component: Lab,
});

type Kind = Device["kind"];
type Dev = Device;
type LinkT = Cable;
const initialTopology = { devs: [] as Device[], links: [] as Cable[], target: "" };
const icons: Record<Device["kind"], typeof Monitor> = {
  pc: Monitor,
  switch: Server,
  router: RouterIcon,
  server: Server,
};

function Lab() {
  const { t } = useLang();
  const [devs, setDevs] = useState<Dev[]>(initialTopology.devs);
  const [links, setLinks] = useState<LinkT[]>(initialTopology.links);
  const [sel, setSel] = useState<string | null>(null);
  const [linking, setLinking] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [target, setTarget] = useState(initialTopology.target);
  const [template, setTemplate] = useState("custom");
  const [trace, setTrace] = useState<{ deviceId: string; title: string; detail: string }[]>([]);
  const [traceIndex, setTraceIndex] = useState(0);
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [fileMessage, setFileMessage] = useState("");
  const [routerStates, setRouterStates] = useState<Record<string, RouterOsState>>({});
  const [routerCommand, setRouterCommand] = useState("");
  const [routerOutput, setRouterOutput] = useState<string[]>([]);
  const [routerSteps, setRouterSteps] = useState<RouterOsStep[]>([]);
  const [routerStepIndex, setRouterStepIndex] = useState(0);

  const selected = devs.find((d) => d.id === sel);
  const activeTemplate = labTemplates.find((item) => item.id === template);
  const loadTemplate = (id: string) => {
    const topology = id === "custom" ? initialTopology : createTopology(id);
    setTemplate(id);
    setDevs(topology.devs);
    setLinks(topology.links);
    setTarget(topology.target);
    setSel(null);
    setSelectedLink(null);
    setLinking(null);
    setLog([]);
    setTrace([]);
    setTraceIndex(0);
  };
  const update = (patch: Partial<Dev>) =>
    setDevs(devs.map((d) => (d.id === sel ? { ...d, ...patch } : d)));
  const exportTopology = () => {
    const payload = {
      app: "Network Master Lab",
      version: 1,
      exportedAt: new Date().toISOString(),
      target,
      devices: devs,
      cables: links,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "network-master-topology.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setFileMessage(t("تم تصدير تصميم الشبكة.", "Network topology exported."));
  };

  const importTopology = async (file?: File) => {
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text()) as {
        app?: string;
        version?: number;
        target?: string;
        devices?: unknown;
        cables?: unknown;
      };
      if (
        payload.app !== "Network Master Lab" ||
        payload.version !== 1 ||
        !Array.isArray(payload.devices) ||
        !Array.isArray(payload.cables) ||
        payload.devices.length < 1 ||
        payload.devices.length > 100 ||
        payload.cables.length > 300
      )
        throw new Error("Invalid topology");
      const kinds = new Set(["pc", "switch", "router", "server"]);
      const imported = payload.devices.map((raw) => {
        if (!raw || typeof raw !== "object") throw new Error("Invalid device");
        const d = raw as Record<string, unknown>;
        if (
          typeof d.id !== "string" ||
          typeof d.name !== "string" ||
          typeof d.kind !== "string" ||
          !kinds.has(d.kind) ||
          typeof d.x !== "number" ||
          typeof d.y !== "number"
        )
          throw new Error("Invalid device");
        return {
          id: d.id.slice(0, 80),
          name: d.name.slice(0, 40),
          kind: d.kind as Kind,
          x: Math.max(30, Math.min(670, d.x)),
          y: Math.max(30, Math.min(330, d.y)),
          ip: typeof d.ip === "string" ? d.ip.slice(0, 40) : "",
          mask: typeof d.mask === "string" ? d.mask.slice(0, 40) : "255.255.255.0",
          gw: typeof d.gw === "string" ? d.gw.slice(0, 40) : "",
          ip2: typeof d.ip2 === "string" ? d.ip2.slice(0, 40) : undefined,
          mask2: typeof d.mask2 === "string" ? d.mask2.slice(0, 40) : undefined,
          vlan: typeof d.vlan === "number" ? Math.max(1, Math.min(4094, Math.floor(d.vlan))) : 1,
          vlan2:
            typeof d.vlan2 === "number"
              ? Math.max(1, Math.min(4094, Math.floor(d.vlan2)))
              : undefined,
          enabled: d.enabled !== false,
        } satisfies Dev;
      });
      const ids = new Set(imported.map((d) => d.id));
      if (ids.size !== imported.length) throw new Error("Duplicate device IDs");
      const importedLinks = payload.cables.map((raw) => {
        if (!raw || typeof raw !== "object") throw new Error("Invalid cable");
        const link = raw as Record<string, unknown>;
        if (
          typeof link.a !== "string" ||
          typeof link.b !== "string" ||
          !ids.has(link.a) ||
          !ids.has(link.b) ||
          link.a === link.b
        )
          throw new Error("Invalid cable endpoints");
        return { a: link.a, b: link.b, enabled: link.enabled !== false };
      });
      setDevs(imported);
      setLinks(importedLinks);
      setTarget(typeof payload.target === "string" ? payload.target.slice(0, 40) : "");
      setTemplate("custom");
      setSel(null);
      setSelectedLink(null);
      setTrace([]);
      setTraceIndex(0);
      setLinking(null);
      setLog([]);
      setFileMessage(t("تم استيراد الشبكة بنجاح.", "Network topology imported successfully."));
    } catch {
      setFileMessage(
        t(
          "تعذر قراءة الملف. اختر نسخة تصدير صحيحة من مختبر Network Master.",
          "Could not read this file. Choose a valid Network Master Lab export.",
        ),
      );
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  };

  const add = (kind: Kind) => {
    const n = devs.filter((d) => d.kind === kind).length + 1;
    const id = "d" + Date.now();
    const prefix =
      kind === "pc" ? "PC" : kind === "switch" ? "SW" : kind === "router" ? "R" : "SRV";
    setDevs([
      ...devs,
      {
        id,
        kind,
        name: prefix + n,
        x: 120 + Math.random() * 400,
        y: 60 + Math.random() * 260,
        ip: "",
        mask: "255.255.255.0",
        gw: "",
        vlan: 1,
        enabled: true,
      },
    ]);
    setSel(id);
    setTrace([]);
    setTraceIndex(0);
    window.__lovableEvents?.track?.("project.lab_used", {
      action: "add_device",
      device_kind: kind,
    });
  };

  const pt = (e: React.PointerEvent) => {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 700, y: ((e.clientY - r.top) / r.height) * 360 };
  };

  const clickDev = (id: string) => {
    if (linking && linking !== id) {
      if (!links.some((l) => (l.a === linking && l.b === id) || (l.b === linking && l.a === id))) {
        setLinks([...links, { a: linking, b: id, enabled: true }]);
        window.__lovableEvents?.track?.("project.lab_used", { action: "connect_cable" });
      }
      setLinking(null);
    } else {
      setSel(id);
      setSelectedLink(null);
    }
  };

  const ping = () => {
    window.__lovableEvents?.track?.("project.lab_used", { action: "ping" });
    const destination = devs.find(
      (d) => (d.kind === "pc" || d.kind === "server") && d.ip === target,
    );
    const result = simulatePing(devs, links, sel, target);
    const out = ["> ping " + target + " (" + (selected?.name ?? "—") + ")"];
    if (result.ok && selected && destination) {
      const queue = [selected.id],
        previous = new Map<string, string | null>([[selected.id, null]]);
      while (queue.length) {
        const current = queue.shift()!;
        if (current === destination.id) break;
        for (const cable of links.filter(
          (l) => l.enabled && (l.a === current || l.b === current),
        )) {
          const next = cable.a === current ? cable.b : cable.a;
          const device = devs.find((d) => d.id === next);
          if (device?.enabled && !previous.has(next)) {
            previous.set(next, current);
            queue.push(next);
          }
        }
      }
      const ids: string[] = [];
      if (previous.has(destination.id)) {
        let cursor: string | null = destination.id;
        while (cursor) {
          ids.unshift(cursor);
          cursor = previous.get(cursor) ?? null;
        }
      }
      const steps: { deviceId: string; title: string; detail: string }[] = [
        {
          deviceId: selected.id,
          title: "ARP Request",
          detail: t(
            "يبحث الجهاز عن عنوان MAC للوجهة أو البوابة.",
            "The host resolves the destination or gateway MAC address.",
          ),
        },
      ];
      ids.forEach((id) => {
        const device = devs.find((d) => d.id === id)!;
        steps.push({
          deviceId: id,
          title: device.kind === "router" ? "IP routing" : "ICMP Echo Request",
          detail:
            device.kind === "router"
              ? t(
                  "يفحص الراوتر جدول التوجيه ويمرر الحزمة للواجهة المناسبة.",
                  "The router checks its routing table and forwards the packet.",
                )
              : t("تمر الحزمة عبر هذا الجهاز.", "The packet passes through this device."),
        });
      });
      [...ids].reverse().forEach((id) =>
        steps.push({
          deviceId: id,
          title: "ICMP Echo Reply",
          detail: t(
            "يعود رد ICMP باتجاه جهاز المصدر.",
            "The ICMP reply travels back toward the source.",
          ),
        }),
      );
      setTrace(steps);
      setTraceIndex(0);
      out.push(
        "Reply from " + target + ": bytes=32 time<1ms",
        "✓ " + t(result.ar, result.en),
        "Path: " + ids.map((id) => devs.find((d) => d.id === id)?.name).join(" → "),
      );
    } else {
      setTrace([]);
      setTraceIndex(0);
      out.push("Request timed out.", "✗ " + t(result.ar, result.en) + " [" + result.code + "]");
    }
    setLog(out);
  };

  const runRouterCommand = () => {
    if (!selected || selected.kind !== "router" || !routerCommand.trim()) return;
    const current = routerStates[selected.id] ?? createRouterOsState(selected.name);
    const result = runRouterOsCommand(current, routerCommand);
    setRouterStates((states) => ({ ...states, [selected.id]: result.state }));
    if (result.devicePatch) {
      setDevs((devices) =>
        devices.map((device) =>
          device.id === selected.id ? { ...device, ...result.devicePatch } : device,
        ),
      );
    }
    setRouterOutput(["> " + routerCommand, ...result.output]);
    setRouterSteps(result.steps);
    setRouterStepIndex(0);
    setRouterCommand("");
    window.__lovableEvents?.track?.("project.lab_used", {
      action: "routeros_command",
      command_group: routerCommand.split(" ").slice(0, 2).join(" "),
    });
  };

  const runDiagnostics = () => {
    const findings = diagnose(devs, links);
    setLog(
      findings.length
        ? findings.map((f) => `[${f.code}] ${f.device}: ${t(f.ar, f.en)}`)
        : [t("لم يتم العثور على أعطال واضحة في الشبكة.", "No obvious network issues found.")],
    );
  };

  const byId = (id: string) => devs.find((d) => d.id === id)!;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">{t("مختبر المحاكاة", "Simulation lab")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t(
          "اسحب الأجهزة، اربطها بالكابل، اضبط العناوين ثم جرّب ping.",
          "Drag devices, connect cables, set addresses, then try ping.",
        )}
      </p>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <label className="block text-sm font-semibold">
          {t("اختر سيناريو تدريبياً", "Choose a lab scenario")}
          <select
            value={template}
            onChange={(e) => loadTemplate(e.target.value)}
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-normal"
          >
            <option value="custom">
              {t("شبكة فارغة — ابنها بنفسك", "Blank network — build it yourself")}
            </option>
            {labTemplates.map((item) => (
              <option key={item.id} value={item.id}>
                {t(item.ar, item.en)}
              </option>
            ))}
          </select>
        </label>
        {activeTemplate && (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t(activeTemplate.goalAr, activeTemplate.goalEn)}
          </p>
        )}
        {template === "custom" && (
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "ابدأ بمساحة فارغة، أضف الأجهزة التي تريدها ثم اربطها بنفسك.",
              "Start with an empty canvas, add only the devices you need, then connect them yourself.",
            )}
          </p>
        )}
      </section>
      <section className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
        <button
          onClick={exportTopology}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          <Download className="h-4 w-4" />
          {t("تصدير الشبكة", "Export topology")}
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
        >
          <Upload className="h-4 w-4" />
          {t("استيراد شبكة", "Import topology")}
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => void importTopology(e.target.files?.[0])}
        />
        {fileMessage && (
          <p role="status" className="w-full text-xs text-muted-foreground">
            {fileMessage}
          </p>
        )}
      </section>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => add("pc")}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <Monitor className="h-4 w-4" /> PC
        </button>
        <button
          onClick={() => add("switch")}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <Server className="h-4 w-4" /> Switch
        </button>
        <button
          onClick={() => add("router")}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <RouterIcon className="h-4 w-4" /> Router
        </button>
        <button
          onClick={() => add("server")}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
        >
          <Server className="h-4 w-4" /> Server
        </button>
        {sel && (
          <button
            onClick={() => setLinking(linking ? null : sel)}
            className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm ${linking ? "border-primary bg-primary/15" : "border-border hover:bg-secondary"}`}
          >
            <Link2 className="h-4 w-4" />{" "}
            {linking
              ? t("اختر الجهاز الآخر…", "Pick the other device…")
              : t("وصل كابل", "Connect cable")}
          </button>
        )}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div dir="ltr" className="grid-bg overflow-hidden rounded-xl border border-border">
          <svg
            ref={svgRef}
            viewBox="0 0 700 360"
            className="h-auto w-full touch-none select-none"
            onPointerMove={(e) => {
              if (!drag.current) return;
              const p = pt(e);
              const { id, dx, dy } = drag.current;
              setDevs((ds) =>
                ds.map((d) =>
                  d.id === id
                    ? {
                        ...d,
                        x: Math.max(30, Math.min(670, p.x - dx)),
                        y: Math.max(30, Math.min(330, p.y - dy)),
                      }
                    : d,
                ),
              );
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerLeave={() => (drag.current = null)}
          >
            {links.map((l, i) => {
              const a = byId(l.a),
                b = byId(l.b);
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  className={
                    selectedLink === i
                      ? "stroke-primary"
                      : l.enabled
                        ? "stroke-primary/70"
                        : "stroke-destructive"
                  }
                  strokeWidth={selectedLink === i ? 4 : 2.5}
                  strokeDasharray={l.enabled ? undefined : "7 5"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLink(i);
                    setSel(null);
                  }}
                  onDoubleClick={() => {
                    setLinks(links.filter((_, j) => j !== i));
                    setSelectedLink(null);
                    window.__lovableEvents?.track?.("project.lab_used", { action: "delete_cable" });
                  }}
                />
              );
            })}
            {devs.map((d) => {
              const Icon = icons[d.kind];
              const activeTraceDevice = trace[traceIndex]?.deviceId === d.id;
              return (
                <g
                  key={d.id}
                  transform={`translate(${d.x},${d.y})`}
                  className={d.enabled ? "cursor-pointer" : "cursor-pointer opacity-40"}
                  onPointerDown={(e) => {
                    const p = pt(e);
                    drag.current = { id: d.id, dx: p.x - d.x, dy: p.y - d.y };
                    clickDev(d.id);
                  }}
                >
                  <circle
                    r={26}
                    className={
                      activeTraceDevice
                        ? "fill-amber-400/30 stroke-amber-500"
                        : sel === d.id
                          ? "fill-primary/25 stroke-primary"
                          : "fill-card stroke-border"
                    }
                    strokeWidth={activeTraceDevice ? 4 : 2}
                  />
                  <Icon x={-12} y={-12} width={24} height={24} className="text-foreground" />
                  <text
                    y={42}
                    textAnchor="middle"
                    className="fill-foreground font-mono text-[11px]"
                  >
                    {d.name}
                  </text>
                  {d.ip && (
                    <text
                      y={55}
                      textAnchor="middle"
                      className="fill-muted-foreground font-mono text-[9px]"
                    >
                      {d.ip}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="space-y-4">
          {selected ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <input
                  value={selected.name}
                  onChange={(e) => update({ name: e.target.value })}
                  className="w-32 rounded bg-transparent font-display font-semibold"
                />
                <button
                  onClick={() => {
                    setDevs(devs.filter((d) => d.id !== sel));
                    setLinks(links.filter((l) => l.a !== sel && l.b !== sel));
                    setSel(null);
                    setSelectedLink(null);
                    window.__lovableEvents?.track?.("project.lab_used", {
                      action: "delete_device",
                      device_kind: selected.kind,
                    });
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
                <label className="text-sm font-medium">{t("تشغيل الجهاز", "Device enabled")}</label>
                <input
                  type="checkbox"
                  checked={selected.enabled}
                  onChange={(e) => update({ enabled: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </div>
              {selected.kind === "switch" ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t(
                    "السويتش يمرر الإطارات وفق VLAN ولا يحتاج عنوان IP في هذا المختبر.",
                    "The switch forwards frames by VLAN and needs no IP in this lab.",
                  )}
                </p>
              ) : (
                <div dir="ltr" className="mt-3 space-y-2 text-sm">
                  {(
                    [
                      ["ip", selected.kind === "router" ? "IP (Gi0/0)" : "IP"],
                      ...(selected.kind === "router"
                        ? [
                            ["ip2", "IP (Gi0/1)"],
                            ["mask2", "Mask (Gi0/1)"],
                          ]
                        : []),
                      ["mask", "Mask"],
                      ...(selected.kind === "pc" || selected.kind === "server"
                        ? [["gw", "Gateway"]]
                        : []),
                    ] as [keyof Dev, string][]
                  ).map(([k, label]) => (
                    <label key={k} className="block">
                      <span className="text-muted-foreground">{label}</span>
                      <input
                        value={(selected[k] as string) ?? ""}
                        onChange={(e) => {
                          update({ [k]: e.target.value });
                          window.__lovableEvents?.track?.("project.lab_used", {
                            action: "configure_device",
                            device_kind: selected.kind,
                          });
                        }}
                        className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono"
                      />
                    </label>
                  ))}
                </div>
              )}
              <div dir="ltr" className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <label className="block">
                  <span className="text-muted-foreground">
                    {selected.kind === "router" ? "VLAN (Gi0/0)" : "VLAN"}
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={4094}
                    value={selected.vlan}
                    onChange={(e) =>
                      update({ vlan: Math.max(1, Math.min(4094, Number(e.target.value) || 1)) })
                    }
                    className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono"
                  />
                </label>
                {selected.kind === "router" && (
                  <label className="block">
                    <span className="text-muted-foreground">VLAN (Gi0/1)</span>
                    <input
                      type="number"
                      min={1}
                      max={4094}
                      value={selected.vlan2 ?? 1}
                      onChange={(e) =>
                        update({ vlan2: Math.max(1, Math.min(4094, Number(e.target.value) || 1)) })
                      }
                      className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono"
                    />
                  </label>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("اختر جهازاً لإعداده", "Select a device to configure")}
            </p>
          )}
          {selectedLink !== null && links[selectedLink] && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{t("إعدادات الكابل", "Cable settings")}</p>
                <button
                  onClick={() => setSelectedLink(null)}
                  className="text-xs text-muted-foreground"
                >
                  {t("إغلاق", "Close")}
                </button>
              </div>
              <p dir="ltr" className="mt-2 font-mono text-xs text-muted-foreground">
                {byId(links[selectedLink].a)?.name} ↔ {byId(links[selectedLink].b)?.name}
              </p>
              <label className="mt-3 flex items-center justify-between text-sm">
                <span>{t("الكابل فعال", "Cable enabled")}</span>
                <input
                  type="checkbox"
                  checked={links[selectedLink].enabled}
                  onChange={(e) =>
                    setLinks(
                      links.map((link, index) =>
                        index === selectedLink ? { ...link, enabled: e.target.checked } : link,
                      ),
                    )
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>
              <button
                onClick={() => {
                  setLinks(links.filter((_, index) => index !== selectedLink));
                  setSelectedLink(null);
                }}
                className="mt-3 w-full rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive"
              >
                {t("حذف الكابل", "Delete cable")}
              </button>
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="block text-xs font-medium text-muted-foreground">
              {t(
                "حدد المصدر بالنقر على PC أو Server، ثم اختر الوجهة:",
                "Select the source by clicking a PC or Server, then choose the destination:",
              )}
            </label>
            <div className="mt-2 flex gap-2">
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-2 font-mono text-sm"
                dir="ltr"
              >
                <option value="">{t("اختر جهاز الوجهة", "Choose destination")}</option>
                {devs
                  .filter((d) => (d.kind === "pc" || d.kind === "server") && d.ip)
                  .map((d) => (
                    <option key={d.id} value={d.ip}>
                      {d.name} — {d.ip}
                    </option>
                  ))}
              </select>
              <button
                onClick={ping}
                disabled={!sel || !target}
                className="rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                ping
              </button>
            </div>
            {selected && (
              <p className="mt-2 text-xs text-muted-foreground">
                {t("المصدر المحدد:", "Selected source:")} <b>{selected.name}</b> (
                {selected.ip || t("لم يضبط IP", "No IP configured")})
              </p>
            )}
            <button
              onClick={runDiagnostics}
              className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              {t("تشخيص الشبكة", "Diagnose network")}
            </button>
            {trace.length > 0 && (
              <div className="mt-3 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <b className="text-sm">{t("تتبع الحزمة", "Packet trace")}</b>
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {traceIndex + 1} / {trace.length}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm text-primary">{trace[traceIndex]?.title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {trace[traceIndex]?.detail}
                </p>
                <p className="mt-1 text-xs" dir="ltr">
                  {t("الجهاز الحالي:", "Current device:")}{" "}
                  {devs.find((d) => d.id === trace[traceIndex]?.deviceId)?.name}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setTraceIndex((i) => Math.max(0, i - 1))}
                    disabled={traceIndex === 0}
                    className="rounded border border-border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    {t("السابق", "Previous")}
                  </button>
                  <button
                    onClick={() => setTraceIndex((i) => Math.min(trace.length - 1, i + 1))}
                    disabled={traceIndex >= trace.length - 1}
                    className="rounded border border-border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    {t("الخطوة التالية", "Next step")}
                  </button>
                  <button
                    onClick={() => setTraceIndex(0)}
                    className="rounded border border-border px-3 py-1 text-xs"
                  >
                    {t("إعادة", "Replay")}
                  </button>
                </div>
              </div>
            )}
            <pre
              dir="ltr"
              className="mt-3 min-h-24 whitespace-pre-wrap rounded-md bg-background p-3 font-mono text-xs text-primary"
            >
              {log.join("\n") || "_"}
            </pre>
          </div>
          {selected?.kind === "router" && (
            <section className="rounded-xl border border-primary/30 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">RouterOS CLI</p>
                  <p className="text-xs text-muted-foreground">
                    {t("طرفية تدريبية للراوتر المحدد", "Training terminal for the selected router")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                  {routerStates[selected.id]?.identity ?? selected.name}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {t(
                  "محاكاة تعليمية محلية وليست اتصالاً بجهاز حقيقي. الأوامر المدعومة تظهر أدناه.",
                  "Local educational simulation, not a connection to a real device. Supported commands are listed below.",
                )}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  "/system identity print",
                  "/interface print",
                  "/ip address print",
                  "/ip route print",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setRouterCommand(example)}
                    className="rounded border border-border px-2 py-1 font-mono text-[10px] hover:bg-secondary"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  runRouterCommand();
                }}
              >
                <input
                  aria-label="RouterOS command"
                  value={routerCommand}
                  onChange={(event) => setRouterCommand(event.target.value)}
                  placeholder="/ip address add address=192.168.10.1/24 interface=ether1"
                  className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-2 font-mono text-xs"
                  dir="ltr"
                />
                <button
                  type="submit"
                  disabled={!routerCommand.trim()}
                  className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
                >
                  {t("تنفيذ", "Run")}
                </button>
              </form>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  "/ip address add address=192.168.10.1/24 interface=ether1",
                  "/ip route add dst-address=0.0.0.0/0 gateway=192.168.10.254",
                  "/ping 192.168.10.20",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => setRouterCommand(example)}
                    className="rounded border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground hover:bg-secondary"
                  >
                    {example}
                  </button>
                ))}
              </div>
              <pre
                dir="ltr"
                className="mt-3 min-h-20 whitespace-pre-wrap rounded-md bg-background p-3 font-mono text-xs text-primary"
              >
                {routerOutput.join("\n") || "_"}
              </pre>
              {routerSteps.length > 0 && (
                <div className="mt-3 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <b className="text-sm">{t("شرح التنفيذ", "Execution walkthrough")}</b>
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {routerStepIndex + 1} / {routerSteps.length}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">
                    {routerSteps[routerStepIndex]?.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {routerSteps[routerStepIndex]?.detail}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setRouterStepIndex((index) => Math.max(0, index - 1))}
                      disabled={routerStepIndex === 0}
                      className="rounded border border-border px-3 py-1 text-xs disabled:opacity-40"
                    >
                      {t("السابق", "Previous")}
                    </button>
                    <button
                      onClick={() =>
                        setRouterStepIndex((index) => Math.min(routerSteps.length - 1, index + 1))
                      }
                      disabled={routerStepIndex >= routerSteps.length - 1}
                      className="rounded border border-border px-3 py-1 text-xs disabled:opacity-40"
                    >
                      {t("التالي", "Next")}
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
          <p className="text-xs text-muted-foreground">
            {t(
              "اختر الكابل لفتح إعداداته، أو انقر عليه مرتين لحذفه.",
              "Select a cable to edit it, or double-click it to delete.",
            )}
          </p>
        </aside>
      </div>
    </main>
  );
}
