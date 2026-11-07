import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Monitor, Router as RouterIcon, Server, Trash2, Link2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { ipToInt, sameSubnet } from "@/lib/network";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "مختبر المحاكاة — Network Master" },
      { name: "description", content: "ابنِ شبكتك بالأجهزة والكابلات واضبط العناوين واختبر الاتصال بـ ping." },
      { property: "og:title", content: "Network Lab — Network Master" },
      { property: "og:description", content: "Build a network, configure IPs and test connectivity with ping." },
    ],
  }),
  component: Lab,
});

type Kind = "pc" | "switch" | "router";
type Dev = { id: string; kind: Kind; name: string; x: number; y: number; ip: string; mask: string; gw: string; ip2?: string };
type LinkT = { a: string; b: string };

const initial: Dev[] = [
  { id: "d1", kind: "pc", name: "PC1", x: 80, y: 80, ip: "192.168.1.10", mask: "255.255.255.0", gw: "192.168.1.1" },
  { id: "d2", kind: "pc", name: "PC2", x: 80, y: 260, ip: "192.168.1.11", mask: "255.255.255.0", gw: "192.168.1.1" },
  { id: "d3", kind: "switch", name: "SW1", x: 260, y: 170, ip: "", mask: "", gw: "" },
  { id: "d4", kind: "router", name: "R1", x: 440, y: 170, ip: "192.168.1.1", mask: "255.255.255.0", gw: "", ip2: "10.0.0.1" },
  { id: "d5", kind: "pc", name: "PC3", x: 600, y: 170, ip: "10.0.0.20", mask: "255.255.255.0", gw: "10.0.0.1" },
];
const initialLinks: LinkT[] = [{ a: "d1", b: "d3" }, { a: "d2", b: "d3" }, { a: "d3", b: "d4" }, { a: "d4", b: "d5" }];
const icons = { pc: Monitor, switch: Server, router: RouterIcon };

function Lab() {
  const { t } = useLang();
  const [devs, setDevs] = useState(initial);
  const [links, setLinks] = useState(initialLinks);
  const [sel, setSel] = useState<string | null>("d1");
  const [linking, setLinking] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [target, setTarget] = useState("10.0.0.20");
  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selected = devs.find((d) => d.id === sel);
  const update = (patch: Partial<Dev>) => setDevs(devs.map((d) => (d.id === sel ? { ...d, ...patch } : d)));

  const add = (kind: Kind) => {
    const n = devs.filter((d) => d.kind === kind).length + 1;
    const id = "d" + Date.now();
    const prefix = kind === "pc" ? "PC" : kind === "switch" ? "SW" : "R";
    setDevs([...devs, { id, kind, name: prefix + n, x: 120 + Math.random() * 400, y: 60 + Math.random() * 260, ip: "", mask: "255.255.255.0", gw: "" }]);
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
        setLinks([...links, { a: linking, b: id }]);
        window.__lovableEvents?.track?.("project.lab_used", { action: "connect_cable" });
      }
      setLinking(null);
    } else setSel(id);
  };

  // Simulation: BFS over L2 (stop at routers), then route through router interfaces
  const neighbors = (id: string) => links.flatMap((l) => (l.a === id ? [l.b] : l.b === id ? [l.a] : []));
  const l2Domain = (start: string) => {
    const seen = new Set([start]);
    const q = [start];
    while (q.length) {
      const c = q.shift()!;
      for (const n of neighbors(c)) {
        if (seen.has(n)) continue;
        seen.add(n);
        if (devs.find((d) => d.id === n)?.kind === "switch") q.push(n);
      }
    }
    return [...seen].map((i) => devs.find((d) => d.id === i)!).filter(Boolean);
  };
  const ifaces = (d: Dev) => [d.ip, d.ip2].filter((x): x is string => !!x && ipToInt(x) !== null);

  const ping = () => {
    window.__lovableEvents?.track?.("project.lab_used", { action: "ping" });
    const src = selected;
    const out: string[] = [`> ping ${target} (${src?.name})`];
    if (!src || src.kind !== "pc") { setLog([...out, t("اختر جهاز PC كمصدر", "Select a PC as source")]); return; }
    if (ipToInt(src.ip) === null) { setLog([...out, t("عنوان IP المصدر غير صالح", "Source IP is invalid")]); return; }
    const domain = l2Domain(src.id);
    const direct = domain.find((d) => d.id !== src.id && ifaces(d).includes(target));
    if (direct && sameSubnet(src.ip, target, src.mask)) {
      setLog([...out, `Reply from ${target}: bytes=32 time<1ms TTL=128`, t("✓ نجح (نفس الشبكة)", "✓ Success (same subnet)")]);
      return;
    }
    if (sameSubnet(src.ip, target, src.mask)) { setLog([...out, "Request timed out.", t("✗ الجهاز غير موجود أو غير متصل بنفس السويتش", "✗ Host not found on this segment")]); return; }
    const gw = domain.find((d) => d.kind === "router" && ifaces(d).includes(src.gw));
    if (!gw) { setLog([...out, "Destination host unreachable.", t("✗ البوابة الافتراضية غير صحيحة أو غير متصلة", "✗ Default gateway wrong or not reachable")]); return; }
    // search other router-connected segments
    for (const n of neighbors(gw.id)) {
      const seg = l2Domain(n).concat(devs.find((d) => d.id === n)!);
      const host = seg.find((d) => d.kind === "pc" && d.ip === target);
      if (host) {
        const back = ifaces(gw).includes(host.gw);
        if (!back) { setLog([...out, "Request timed out.", t(`✗ ${host.name} لا يملك بوابة صحيحة للرد`, `✗ ${host.name} has no valid gateway to reply`)]); return; }
        setLog([...out, `Reply from ${target}: bytes=32 time=2ms TTL=127`, t(`✓ نجح عبر ${gw.name}`, `✓ Success via ${gw.name}`)]);
        return;
      }
    }
    setLog([...out, "Request timed out.", t("✗ لا يوجد مسار إلى الوجهة", "✗ No route to destination")]);
  };

  const byId = (id: string) => devs.find((d) => d.id === id)!;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">{t("مختبر المحاكاة", "Simulation lab")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("اسحب الأجهزة، اربطها بالكابل، اضبط العناوين ثم جرّب ping.", "Drag devices, connect cables, set addresses, then try ping.")}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => add("pc")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Monitor className="h-4 w-4" /> PC</button>
        <button onClick={() => add("switch")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Server className="h-4 w-4" /> Switch</button>
        <button onClick={() => add("router")} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><RouterIcon className="h-4 w-4" /> Router</button>
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
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="stroke-primary" strokeWidth={2.5}
                  onDoubleClick={() => {
                    setLinks(links.filter((_, j) => j !== i));
                    window.__lovableEvents?.track?.("project.lab_used", { action: "delete_cable" });
                  }} />
              );
            })}
            {devs.map((d) => {
              const Icon = icons[d.kind];
              return (
                <g key={d.id} transform={`translate(${d.x},${d.y})`} className="cursor-pointer"
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
                <button onClick={() => { setDevs(devs.filter((d) => d.id !== sel)); setLinks(links.filter((l) => l.a !== sel && l.b !== sel)); setSel(null); window.__lovableEvents?.track?.("project.lab_used", { action: "delete_device", device_kind: selected.kind }); }} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              {selected.kind === "switch" ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("السويتش لا يحتاج عنوان IP؛ يمرر الإطارات داخل الشبكة.", "Switches need no IP; they forward frames within the LAN.")}</p>
              ) : (
                <div dir="ltr" className="mt-3 space-y-2 text-sm">
                  {([["ip", selected.kind === "router" ? "IP (Gi0/0)" : "IP"], ...(selected.kind === "router" ? [["ip2", "IP (Gi0/1)"]] : []), ["mask", "Mask"], ...(selected.kind === "pc" ? [["gw", "Gateway"]] : [])] as [keyof Dev, string][]).map(([k, label]) => (
                    <label key={k} className="block">
                      <span className="text-muted-foreground">{label}</span>
                      <input value={(selected[k] as string) ?? ""} onChange={(e) => update({ [k]: e.target.value })} onBlur={(e) => {
                        if (e.target.value !== e.target.defaultValue) {
                          window.__lovableEvents?.track?.("project.lab_used", { action: "configure_device", device_kind: selected.kind });
                        }
                      }} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 font-mono" />
                    </label>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{t("اختر جهازاً لإعداده", "Select a device to configure")}</p>
          )}
          <div className="rounded-xl border border-border bg-card p-4">
            <div dir="ltr" className="flex gap-2">
              <input value={target} onChange={(e) => setTarget(e.target.value)} className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 font-mono text-sm" />
              <button onClick={ping} className="rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">ping</button>
            </div>
            <pre dir="ltr" className="mt-3 min-h-24 whitespace-pre-wrap rounded-md bg-background p-3 font-mono text-xs text-primary">{log.join("\n") || "_"}</pre>
          </div>
          <p className="text-xs text-muted-foreground">{t("نقر مزدوج على الكابل لحذفه.", "Double-click a cable to delete it.")}</p>
        </aside>
      </div>
    </main>
  );
}
