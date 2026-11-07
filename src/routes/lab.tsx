import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Monitor, Router as RouterIcon, Server, Trash2, Link2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { createTopology, diagnose, labTemplates, simulatePing, type Cable, type Device } from "@/lib/lab-engine";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "مختبر المحاكاة — Network Master" },
      { name: "description", content: "ابنِ شبكتك بالأجهزة والكابلات واضبط العناوين واختبر الاتصال بـ ping." },
      { property: "og:title", content: "Network Lab — Network Master" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:description", content: "Build a network, configure IPs and test connectivity with ping." },
    ],
  }),
  component: Lab,
});

type Kind = Device["kind"];
type Dev = Device;
type LinkT = Cable;
const initialTopology = createTopology();
const icons: Record<Device["kind"], typeof Monitor> = { pc: Monitor, switch: Server, router: RouterIcon, server: Server };

function Lab() {
  const { t } = useLang();
  const [devs, setDevs] = useState<Dev[]>(initialTopology.devs);
  const [links, setLinks] = useState<LinkT[]>(initialTopology.links);
  const [sel, setSel] = useState<string | null>("d1");
  const [linking, setLinking] = useState<string | null>(null);
  const [selectedLink, setSelectedLink] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [target, setTarget] = useState(initialTopology.target);
  const [template, setTemplate] = useState("routed");
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selected = devs.find((d) => d.id === sel);
  const activeTemplate = labTemplates.find((item) => item.id === template);
  const loadTemplate = (id: string) => {
    const topology = createTopology(id);
    setTemplate(id);
    setDevs(topology.devs);
    setLinks(topology.links);
    setTarget(topology.target);
    setSel("d1");
    setSelectedLink(null);
    setLinking(null);
    setLog([]);
  };
  const update = (patch: Partial<Dev>) => setDevs(devs.map((d) => (d.id === sel ? { ...d, ...patch } : d)));

  const add = (kind: Kind) => {
    const n = devs.filter((d) => d.kind === kind).length + 1;
    const id = "d" + Date.now();
    const prefix = kind === "pc" ? "PC" : kind === "switch" ? "SW" : kind === "router" ? "R" : "SRV";
    setDevs([...devs, { id, kind, name: prefix + n, x: 120 + Math.random() * 400, y: 60 + Math.random() * 260, ip: "", mask: "255.255.255.0", gw: "", vlan: 1, enabled: true }]);
    setSel(id);
    window.__lovableEvents?.track?.("project.lab_used", { action: "add_device", device_kind: kind });
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
    } else { setSel(id); setSelectedLink(null); }
  };

  const ping = () => {
    window.__lovableEvents?.track?.("project.lab_used", { action: "ping" });
    const result = simulatePing(devs, links, sel, target);
    const out = [`> ping ${target} (${selected?.name ?? "—"})`];
    if (result.ok) {
      out.push(`Reply from ${target}: bytes=32 time<1ms`, `✓ ${t(result.ar, result.en)}`, `Path: ${result.path.join(" → ")}`);
    } else {
      out.push("Request timed out.", `✗ ${t(result.ar, result.en)} [${result.code}]`);
    }
    setLog(out);
  };

  const runDiagnostics = () => {
    const findings = diagnose(devs, links);
    setLog(findings.length
      ? findings.map((f) => `[${f.code}] ${f.device}: ${t(f.ar, f.en)}`)
      : [t("لم يتم العثور على أعطال واضحة في الشبكة.", "No obvious network issues found.")]);
  };

  const byId = (id: string) => devs.find((d) => d.id === id)!;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">{t("مختبر المحاكاة", "Simulation lab")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("اسحب الأجهزة، اربطها بالكابل، اضبط العناوين ثم جرّب ping.", "Drag devices, connect cables, set addresses, then try ping.")}
      </p>
      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <label className="block text-sm font-semibold">
          {t("اختر سيناريو تدريبياً", "Choose a lab scenario")}
          <select value={template} onChange={(e) => loadTemplate(e.target.value)} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 font-normal">
            {labTemplates.map((item) => <option key={item.id} value={item.id}>{t(item.ar, item.en)}</option>)}
          </select>
        </label>
        {activeTemplate && <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(activeTemplate.goalAr, activeTemplate.goalEn)}</p>}
      </section>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => add("pc")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Monitor className="h-4 w-4" /> PC</button>
        <button onClick={() => add("switch")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Server className="h-4 w-4" /> Switch</button>
        <button onClick={() => add("router")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><RouterIcon className="h-4 w-4" /> Router</button>
        <button onClick={() => add("server")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Server className="h-4 w-4" /> Server</button>
        {sel && (
          <button onClick={() => setLinking(linking ? null : sel)} className={`flex items-center gap-1 rounded-lg border px-3 py-2 text-sm ${linking ? "border-primary bg-primary/15" : "border-border hover:bg-secondary"}`}>
            <Link2 className="h-4 w-4" /> {linking ? t("اختر الجهاز الآخر…", "Pick the other device…") : t("وصل كابل", "Connect cable")}
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
              setDevs((ds) => ds.map((d) => (d.id === id ? { ...d, x: Math.max(30, Math.min(670, p.x - dx)), y: Math.max(30, Math.min(330, p.y - dy)) } : d)));
            }}
            onPointerUp={() => (drag.current = null)}
            onPointerLeave={() => (drag.current = null)}
          >
            {links.map((l, i) => {
              const a = byId(l.a), b = byId(l.b);
              if (!a || !b) return null;
              return (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  className={selectedLink === i ? "stroke-primary" : l.enabled ? "stroke-primary/70" : "stroke-destructive"}
                  strokeWidth={selectedLink === i ? 4 : 2.5} strokeDasharray={l.enabled ? undefined : "7 5"}
                  onClick={(e) => { e.stopPropagation(); setSelectedLink(i); setSel(null); }}
                  onDoubleClick={() => {
                    setLinks(links.filter((_, j) => j !== i));
                    setSelectedLink(null);
                    window.__lovableEvents?.track?.("project.lab_used", { action: "delete_cable" });
                  }} />
              );
            })}
            {devs.map((d) => {
              const Icon = icons[d.kind];
              return (
                <g key={d.id} transform={`translate(${d.x},${d.y})`} className={d.enabled ? "cursor-pointer" : "cursor-pointer opacity-40"}
                  onPointerDown={(e) => { const p = pt(e); drag.current = { id: d.id, dx: p.x - d.x, dy: p.y - d.y }; clickDev(d.id); }}>
                  <circle r={26} className={sel === d.id ? "fill-primary/25 stroke-primary" : "fill-card stroke-border"} strokeWidth={2} />
                  <Icon x={-12} y={-12} width={24} height={24} className="text-foreground" />
                  <text y={42} textAnchor="middle" className="fill-foreground font-mono text-[11px]">{d.name}</text>
                  {d.ip && <text y={55} textAnchor="middle" className="fill-muted-foreground font-mono text-[9px]">{d.ip}</text>}
                </g>
              );
            })}
          </svg>
        </div>
        <aside className="space-y-4">
          {selected ? (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <input value={selected.name} onChange={(e) => update({ name: e.target.value })} className="w-32 rounded bg-transparent font-display font-semibold" />
                <button onClick={() => { setDevs(devs.filter((d) => d.id !== sel)); setLinks(links.filter((l) => l.a !== sel && l.b !== sel)); setSel(null); setSelectedLink(null); window.__lovableEvents?.track?.("project.lab_used", { action: "delete_device", device_kind: selected.kind }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
                <label className="text-sm font-medium">{t("تشغيل الجهاز", "Device enabled")}</label>
                <input type="checkbox" checked={selected.enabled} onChange={(e) => update({ enabled: e.target.checked })} className="h-4 w-4 accent-primary" />
              </div>
              {selected.kind === "switch" ? (
                <p className="mt-2 text-xs text-muted-foreground">{t("السويتش يمرر الإطارات وفق VLAN ولا يحتاج عنوان IP في هذا المختبر.", "The switch forwards frames by VLAN and needs no IP in this lab.")}</p>
              ) : (
                <div dir="ltr" className="mt-3 space-y-2 text-sm">
                  {([[ "ip", selected.kind === "router" ? "IP (Gi0/0)" : "IP"], ...(selected.kind === "router" ? [["ip2", "IP (Gi0/1)"], ["mask2", "Mask (Gi0/1)"]] : []), ["mask", "Mask"], ...(selected.kind === "pc" || selected.kind === "server" ? [["gw", "Gateway"]] : [])] as [keyof Dev, string][]).map(([k, label]) => (
                    <label key={k} className="block">
                      <span className="text-muted-foreground">{label}</span>
                      <input value={(selected[k] as string) ?? ""} onChange={(e) => {
                        update({ [k]: e.target.value });
                        window.__lovableEvents?.track?.("project.lab_used", { action: "configure_device", device_kind: selected.kind });
                      }} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono" />
                    </label>
                  ))}
                </div>
              )}
              <div dir="ltr" className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <label className="block">
                  <span className="text-muted-foreground">{selected.kind === "router" ? "VLAN (Gi0/0)" : "VLAN"}</span>
                  <input type="number" min={1} max={4094} value={selected.vlan} onChange={(e) => update({ vlan: Math.max(1, Math.min(4094, Number(e.target.value) || 1)) })} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono" />
                </label>
                {selected.kind === "router" && (
                  <label className="block">
                    <span className="text-muted-foreground">VLAN (Gi0/1)</span>
                    <input type="number" min={1} max={4094} value={selected.vlan2 ?? 1} onChange={(e) => update({ vlan2: Math.max(1, Math.min(4094, Number(e.target.value) || 1)) })} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono" />
                  </label>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("اختر جهازاً لإعداده", "Select a device to configure")}</p>
          )}
          {selectedLink !== null && links[selectedLink] && (
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{t("إعدادات الكابل", "Cable settings")}</p>
                <button onClick={() => setSelectedLink(null)} className="text-xs text-muted-foreground">{t("إغلاق", "Close")}</button>
              </div>
              <p dir="ltr" className="mt-2 font-mono text-xs text-muted-foreground">{byId(links[selectedLink].a)?.name} ↔ {byId(links[selectedLink].b)?.name}</p>
              <label className="mt-3 flex items-center justify-between text-sm">
                <span>{t("الكابل فعال", "Cable enabled")}</span>
                <input type="checkbox" checked={links[selectedLink].enabled} onChange={(e) => setLinks(links.map((link, index) => index === selectedLink ? { ...link, enabled: e.target.checked } : link))} className="h-4 w-4 accent-primary" />
              </label>
              <button onClick={() => { setLinks(links.filter((_, index) => index !== selectedLink)); setSelectedLink(null); }} className="mt-3 w-full rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive">{t("حذف الكابل", "Delete cable")}</button>
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-4">
            <div dir="ltr" className="flex gap-2">
              <input value={target} onChange={(e) => setTarget(e.target.value)} className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 font-mono text-sm" />
              <button onClick={ping} className="rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">ping</button>
            </div>
            <button onClick={runDiagnostics} className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary">{t("تشخيص الشبكة", "Diagnose network")}</button>
            <pre dir="ltr" className="mt-3 min-h-24 whitespace-pre-wrap rounded-md bg-background p-3 font-mono text-xs text-primary">{log.join("\n") || "_"}</pre>
          </div>
          <p className="text-xs text-muted-foreground">{t("اختر الكابل لفتح إعداداته، أو انقر عليه مرتين لحذفه.", "Select a cable to edit it, or double-click it to delete.")}</p>
        </aside>
      </div>
    </main>
  );
}
