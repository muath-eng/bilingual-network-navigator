import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { lessons } from "@/lib/content";
import { useLang, useProgress } from "@/lib/i18n";

export const Route = createFileRoute("/learn/")({
  head: () => ({
    meta: [
      { title: "الدروس — Network Master" },
      { name: "description", content: "مسار تعليمي متدرج في الشبكات: مبتدئ، متوسط، متقدم." },
      { property: "og:title", content: "Lessons — Network Master" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:description", content: "A graded networking curriculum: beginner, intermediate, advanced." },
    ],
  }),
  component: Learn,
});

const levels = [
  { id: "beginner", ar: "مبتدئ", en: "Beginner" },
  { id: "intermediate", ar: "متوسط", en: "Intermediate" },
  { id: "advanced", ar: "متقدم", en: "Advanced" },
] as const;

function Learn() {
  const { t } = useLang();
  const { done } = useProgress();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{t("المسار التعليمي", "Learning path")}</h1>
      {levels.map((lv) => (
        <section key={lv.id} className="mt-8">
          <h2 className="mb-3 font-mono text-sm uppercase text-primary">{t(lv.ar, lv.en)}</h2>
          <div className="grid gap-3">
            {lessons.filter((l) => l.level === lv.id).map((l, i) => (
              <Link
                key={l.id}
                to="/learn/$id"
                params={{ id: l.id }}
                onClick={() => window.__lovableEvents?.track?.("project.lesson_started", { lesson_id: l.id })}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary"
              >
                <span className="font-mono text-muted-foreground">0{i + 1}</span>
                <span className="flex-1 font-semibold">{t(l.titleAr, l.titleEn)}</span>
                {done.includes(l.id) && <CheckCircle2 className="h-5 w-5 text-primary" />}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
