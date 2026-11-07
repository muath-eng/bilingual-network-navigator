import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { lessons } from "@/lib/content";
import { useLang, useProgress } from "@/lib/i18n";

export const Route = createFileRoute("/learn/$id")({
  loader: ({ params }) => {
    const lesson = lessons.find((l) => l.id === params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.lesson.titleAr} — Network Master` : "Network Master" },
      { name: "description", content: loaderData?.lesson.bodyAr[0] ?? "" },
      { property: "og:title", content: loaderData?.lesson.titleEn ?? "Lesson" },
      { property: "og:description", content: loaderData?.lesson.bodyEn[0] ?? "" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const { t, lang } = useLang();
  const { done, mark } = useProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-primary">← {t("الدروس", "Lessons")}</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{t(lesson.titleAr, lesson.titleEn)}</h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed">
        {(lang === "ar" ? lesson.bodyAr : lesson.bodyEn).map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-semibold">{t("اختبر نفسك", "Quick quiz")}</h2>
        {lesson.quiz.map((q, i) => (
          <div key={i} className="mt-5">
            <p className="font-medium">{t(q.qAr, q.qEn)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o, j) => {
                const sel = answers[i] === j;
                const state = checked ? (j === q.answer ? "border-primary bg-primary/15" : sel ? "border-destructive bg-destructive/15" : "border-border") : sel ? "border-primary" : "border-border";
                return (
                  <button key={j} onClick={() => !checked && setAnswers({ ...answers, [i]: j })} className={`rounded-lg border px-4 py-2 ${state}`}>
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-6 flex items-center gap-4">
          {!checked ? (
            <button
              disabled={Object.keys(answers).length < lesson.quiz.length}
              onClick={() => {
                setChecked(true);
                window.__lovableEvents?.track?.("project.quiz_submitted", {
                  lesson_id: lesson.id, score, question_count: lesson.quiz.length,
                  passed: score === lesson.quiz.length,
                });
                if (score === lesson.quiz.length) {
                  mark(lesson.id);
                  if (!done.includes(lesson.id)) {
                    window.__lovableEvents?.track?.("project.lesson_completed", { lesson_id: lesson.id });
                  }
                }
              }}
              className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-40"
            >
              {t("تحقق", "Check")}
            </button>
          ) : (
            <>
              <span className="font-mono">{score}/{lesson.quiz.length}</span>
              {score === lesson.quiz.length ? (
                <span className="text-primary">{t("ممتاز! تم إكمال الدرس ✓", "Great! Lesson completed ✓")}</span>
              ) : (
                <button onClick={() => { setChecked(false); setAnswers({}); }} className="underline">{t("حاول مجدداً", "Try again")}</button>
              )}
            </>
          )}
        </div>
      </section>
      {next && (
        <Link to="/learn/$id" params={{ id: next.id }} onClick={() => window.__lovableEvents?.track?.("project.lesson_started", { lesson_id: next.id })} className="mt-6 inline-block text-primary hover:underline">
          {t("الدرس التالي:", "Next:")} {t(next.titleAr, next.titleEn)} →
        </Link>
      )}
    </main>
  );
}
