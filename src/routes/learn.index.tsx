import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ccnaDomains, lessons } from "@/lib/content";
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

function Learn() {
  const { t } = useLang();
  const { done } = useProgress();
  const foundations = lessons.filter((lesson) => !lesson.domain);
  const ccnaLessons = lessons.filter((lesson) => lesson.domain);
  const completed = ccnaLessons.filter((lesson) => done.includes(lesson.id)).length;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">{t("أكاديمية الشبكات وCCNA", "Networking Academy & CCNA")}</h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
        {t(
          "مسار منظم يغطي مجالات اختبار Cisco CCNA 200-301 v1.1 الستة، مع دروس عربية وإنجليزية واختبارات قصيرة وأمثلة أوامر Cisco IOS.",
          "A structured path across all six Cisco CCNA 200-301 v1.1 exam domains, with bilingual lessons, quizzes and Cisco IOS examples."
        )}
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">{t("تقدمك في منهج CCNA", "Your CCNA progress")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{completed} / {ccnaLessons.length} {t("درس مكتمل", "lessons completed")}</p>
          </div>
          <span className="font-mono text-lg font-semibold text-primary">{Math.round((completed / Math.max(ccnaLessons.length, 1)) * 100)}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completed / Math.max(ccnaLessons.length, 1)) * 100}%` }} />
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          {t("تنبيه للمتقدمين للاختبار: منهج v1.1 هو المعتمد حتى 2 فبراير 2027، ويبدأ إصدار v2.0 في 3 فبراير 2027. سنحدّث المسار عند الانتقال.", "Exam note: v1.1 remains the active blueprint through February 2, 2027; v2.0 begins February 3, 2027. The curriculum will be updated for that transition.")}
        </p>
      </section>

      <div className="mt-8 space-y-5">
        {ccnaDomains.map((domain, index) => {
          const domainLessons = lessons.filter((lesson) => lesson.domain === domain.id);
          const domainDone = domainLessons.filter((lesson) => done.includes(lesson.id)).length;
          return (
            <section key={domain.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-primary">DOMAIN 0{index + 1} · {domain.objectives}</p>
                  <h2 className="mt-1 text-xl font-semibold">{t(domain.ar, domain.en)}</h2>
                </div>
                <div className="text-end">
                  <p className="font-mono text-lg font-semibold">{domain.weight}%</p>
                  <p className="text-xs text-muted-foreground">{domainDone}/{domainLessons.length} {t("مكتمل", "done")}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {domainLessons.map((lesson, lessonIndex) => (
                  <Link
                    key={lesson.id}
                    to="/learn/$id"
                    params={{ id: lesson.id }}
                    onClick={() => window.__lovableEvents?.track?.("project.lesson_started", { lesson_id: lesson.id })}
                    className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary"
                  >
                    <span className="font-mono text-xs text-muted-foreground">{String(lessonIndex + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{t(lesson.titleAr, lesson.titleEn)}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">{t("أهداف الاختبار", "Exam objectives")}: {lesson.objective}</span>
                    </span>
                    {done.includes(lesson.id) && <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">{t("الأساسيات التمهيدية", "Foundation lessons")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("ابدأ بهذه الدروس إذا كنت جديداً على الشبكات، ثم انتقل إلى مجالات CCNA الستة.", "Start here if you are new to networking, then continue through the six CCNA domains.")}</p>
        <div className="mt-4 grid gap-2">
          {foundations.map((lesson, index) => (
            <Link
              key={lesson.id}
              to="/learn/$id"
              params={{ id: lesson.id }}
              onClick={() => window.__lovableEvents?.track?.("project.lesson_started", { lesson_id: lesson.id })}
              className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:border-primary"
            >
              <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex-1 font-medium">{t(lesson.titleAr, lesson.titleEn)}</span>
              {done.includes(lesson.id) && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
