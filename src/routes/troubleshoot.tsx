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
    </main>
  );
}
