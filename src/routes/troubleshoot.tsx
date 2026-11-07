import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { scenarios } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/troubleshoot")({
  head: () => ({
    meta: [
      { title: "إصلاح الأعطال — Network Master" },
      { name: "description", content: "سيناريوهات واقعية لتشخيص أعطال الشبكات وحلها." },
      { property: "og:title", content: "Troubleshooting — Network Master" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:description", content: "Real-world network fault scenarios to diagnose and fix." },
    ],
  }),
  component: Troubleshoot,
});

function Troubleshoot() {
  const { t, lang } = useLang();
  const [picked, setPicked] = useState<Record<string, number>>({});
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{t("تدريب إصلاح الأعطال", "Troubleshooting drills")}</h1>
      <p className="mt-2 text-muted-foreground">{t("اقرأ المعطيات واختر السبب الأرجح.", "Read the details and pick the most likely cause.")}</p>
      <div className="mt-8 space-y-5">
        {scenarios.map((s) => {
          const p = picked[s.id];
          const opts = lang === "ar" ? s.optionsAr : s.optionsEn;
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold">{t(s.titleAr, s.titleEn)}</h2>
              <pre dir="ltr" className="mt-3 whitespace-pre-wrap rounded-md bg-secondary p-3 font-mono text-sm">{t(s.infoAr, s.infoEn)}</pre>
              <div className="mt-4 flex flex-wrap gap-2">
                {opts.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => setPicked({ ...picked, [s.id]: i })}
                    className={`rounded-lg border px-4 py-2 text-sm ${p === undefined ? "border-border hover:border-primary" : i === s.answer ? "border-primary bg-primary/15" : p === i ? "border-destructive bg-destructive/15" : "border-border opacity-60"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {p !== undefined && (
                <p className={`mt-3 text-sm ${p === s.answer ? "text-primary" : "text-destructive"}`}>
                  {p === s.answer ? t("صحيح! ", "Correct! ") : t("ليس تماماً. ", "Not quite. ")}
                  {t(s.explainAr, s.explainEn)}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">{t("منهجية تشخيص الأعطال خطوة بخطوة","A step-by-step troubleshooting method")}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("لا تبدأ بتغيير الإعدادات عشوائياً. اجمع الأدلة وانتقل من الطبقة الفيزيائية إلى التطبيق، ثم اختبر بعد كل تغيير.","Avoid changing settings at random. Gather evidence from the physical layer upward, then retest after every change.")}</p>
        <ol className="mt-4 space-y-3">
          {[
            ["تحقق من الطاقة والكابل وحالة Link وSpeed/Duplex.","Check power, cabling, link state and speed/duplex."],
            ["تحقق من IP والقناع والبوابة وDNS على العميل.","Check client IP, subnet mask, gateway and DNS."],
            ["اختبر بالترتيب: loopback، ثم IP المحلي، ثم البوابة، ثم وجهة بعيدة.","Test in order: loopback, local IP, gateway, then a remote destination."],
            ["استخدم traceroute لتحديد نقطة توقف المسار، وnslookup لعزل DNS.","Use traceroute to locate the failing hop and nslookup to isolate DNS."],
            ["راجع VLAN وTrunk وSTP وواجهات الراوتر وجدول التوجيه وACL.","Review VLANs, trunks, STP, router interfaces, routing tables and ACLs."],
            ["وثّق السبب والتغيير والنتيجة، ثم تحقق من عودة الخدمة.","Record the cause, change and result, then verify service recovery."],
          ].map((step,i)=><li key={i} className="flex gap-3 rounded-lg bg-secondary/50 p-3 text-sm leading-6"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-primary">{i+1}</span><span>{t(step[0],step[1])}</span></li>)}
        </ol>
        <div className="mt-5 rounded-lg border border-border p-4">
          <p className="font-semibold">{t("أوامر تشخيص سريعة","Quick diagnostic commands")}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {["show ip interface brief","show interfaces","show vlan brief","show interfaces trunk","show ip route","show access-lists","ping 192.168.1.1","traceroute 8.8.8.8","ipconfig /all","nslookup example.com"].map(cmd=><code key={cmd} dir="ltr" className="rounded bg-secondary px-3 py-2 text-xs">{cmd}</code>)}
          </div>
        </div>
      </section>
    </main>
  );
