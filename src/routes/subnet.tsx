import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { subnetInfo } from "@/lib/network";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/subnet")({
  head: () => ({
    meta: [
      { title: "حاسبة الشبكات الفرعية — Network Master" },
      { name: "description", content: "احسب عنوان الشبكة والبث وعدد الأجهزة لأي عنوان IP." },
      { property: "og:title", content: "Subnet Calculator — Network Master" },
      { property: "og:description", content: "Compute network, broadcast and host range for any IPv4 address." },
    ],
  }),
  component: Subnet,
});

function Subnet() {
  const { t } = useLang();
  const [ip, setIp] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);
  const info = subnetInfo(ip, prefix);
  const rows = info && [
    [t("القناع", "Mask"), info.mask],
    [t("عنوان الشبكة", "Network"), info.network],
    [t("عنوان البث", "Broadcast"), info.broadcast],
    [t("أول جهاز", "First host"), info.first],
    [t("آخر جهاز", "Last host"), info.last],
    [t("عدد الأجهزة", "Usable hosts"), String(info.hosts)],
  ];
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{t("حاسبة الشبكات الفرعية", "Subnet calculator")}</h1>
      <div dir="ltr" className="mt-6 flex gap-2">
        <input value={ip} onChange={(e) => setIp(e.target.value)} className="flex-1 rounded-lg border border-input bg-card px-4 py-3 font-mono" />
        <select value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} className="rounded-lg border border-input bg-card px-3 font-mono">
          {Array.from({ length: 25 }, (_, i) => i + 8).map((p) => <option key={p} value={p}>/{p}</option>)}
        </select>
      </div>
      {rows ? (
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between px-5 py-3">
              <span className="text-muted-foreground">{k}</span>
              <span dir="ltr" className="font-mono">{v}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-destructive">{t("عنوان IP غير صالح", "Invalid IP address")}</p>
      )}
    </main>
  );
}
