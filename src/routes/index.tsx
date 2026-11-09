import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Target,
  Trophy,
  Wrench,
  Calculator,
} from "lucide-react";
import { useLang, useProgress } from "@/lib/i18n";
import { lessons } from "@/lib/content";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Network Master | تعلّم الشبكات عملياً" },
      {
        name: "description",
        content:
          "تعلم الشبكات من الصفر بالعربية: أساسيات الشبكات وCCNA وWLAN وCisco وMikroTik، مع دروس تفاعلية ومختبر محاكاة وتدريب عملي على الأوامر وإصلاح الأعطال.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const { done } = useProgress();
  const completedCount = lessons.filter((lesson) => done.includes(lesson.id)).length;
  const remainingCount = Math.max(lessons.length - completedCount, 0);
  const pct = Math.round((completedCount / Math.max(lessons.length, 1)) * 100);
  const nextLesson = lessons.find((lesson) => !done.includes(lesson.id));

  const cards = [
    { to: "/learn", icon: BookOpen, ar: "دروس متدرجة", en: "Step-by-step lessons", dAr: "من أساسيات الشبكات حتى التوجيه المتقدم.", dEn: "From basics to advanced routing." },
    { to: "/lab", icon: Cpu, ar: "مختبر المحاكاة", en: "Simulation lab", dAr: "ابنِ شبكتك، اضبط العناوين، واختبر ping.", dEn: "Build a network, set IPs, test ping." },
    { to: "/troubleshoot", icon: Wrench, ar: "إصلاح الأعطال", en: "Troubleshooting", dAr: "سيناريوهات واقعية لتشخيص المشاكل.", dEn: "Real scenarios to diagnose faults." },
    { to: "/subnet", icon: Calculator, ar: "حاسبة الشبكات الفرعية", en: "Subnet calculator", dAr: "احسب الشبكة والبث وعدد الأجهزة.", dEn: "Compute network, broadcast, hosts." },
  ] as const;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <section className="grid-bg rounded-2xl border border-border p-8 md:p-14">
        <p className="font-mono text-sm text-primary">$ ping network-master ✓</p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
          {t("تعلّم الشبكات", "Learn networking")}
          <span className="block text-primary">{t("من الصفر حتى الاحتراف", "from zero to pro")}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          {t(
            "دروس تفاعلية، مختبر لبناء الشبكات ومحاكاتها، وتدريب عملي على الإدارة والصيانة وإصلاح الأعطال — على الكمبيوتر والهاتف.",
            "Interactive lessons, a lab to build and simulate networks, and hands-on practice in management, maintenance and troubleshooting — on desktop and mobile.",
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/learn" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90">
            {t("ابدأ التعلم", "Start learning")}
          </Link>
          <Link to="/lab" className="rounded-lg border border-border px-6 py-3 font-semibold hover:bg-secondary">
            {t("افتح المختبر", "Open the lab")}
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{t("لوحة تقدمك التعليمية", "Your learning dashboard")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("تابع إنجازك واعرف خطوتك التالية في رحلة الشبكات.", "Track your progress and see the next step in your networking journey.")}
              </p>
            </div>
          </div>
          <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            {t("عرض المنهج", "View curriculum")} <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-secondary/60 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {t("دروس مكتملة", "Completed lessons")}
            </div>
            <p className="mt-2 font-mono text-3xl font-bold">{completedCount}<span className="text-base font-medium text-muted-foreground"> / {lessons.length}</span></p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              {t("الدروس المتبقية", "Lessons remaining")}
            </div>
            <p className="mt-2 font-mono text-3xl font-bold">{remainingCount}</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-primary" />
              {t("نسبة الإنجاز", "Completion rate")}
            </div>
            <p className="mt-2 font-mono text-3xl font-bold">{pct}%</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("التقدم في جميع الدروس", "Overall lesson progress")}</span>
            <span className="font-mono">{completedCount}/{lessons.length}</span>
          </div>
          <div
            className="mt-2 h-3 overflow-hidden rounded-full bg-secondary"
            role="progressbar"
            aria-label={t("نسبة إكمال الدروس", "Lesson completion")}
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">{t("خطوتك التالية", "YOUR NEXT STEP")}</p>
            {nextLesson ? (
              <>
                <p className="mt-1 truncate font-semibold">{t(nextLesson.titleAr, nextLesson.titleEn)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("أكمل الدرس التالي لتحافظ على تقدمك.", "Continue with the next lesson to keep moving forward.")}</p>
              </>
            ) : (
              <>
                <p className="mt-1 font-semibold">{t("أكملت جميع الدروس!", "You completed every lesson!")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("انتقل إلى المختبر لتطبيق ما تعلمته.", "Head to the lab and put your knowledge into practice.")}</p>
              </>
            )}
          </div>
          {nextLesson ? (
            <Link
              to="/learn/$id"
              params={{ id: nextLesson.id }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              {t("تابع التعلم", "Continue learning")} <ArrowLeft className="h-4 w-4" />
            </Link>
          ) : (
            <Link to="/lab" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">
              {t("ابدأ التطبيق", "Start practicing")} <Cpu className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4">
          <h2 className="font-display text-2xl font-bold">{t("مسارات وأدوات التعلم", "Learning paths & tools")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("اختر المجال الذي تريد تطوير مهاراتك فيه.", "Choose the area where you want to build your skills.")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.to} to={c.to} className="rounded-xl border border-border bg-card p-6 transition hover:border-primary">
              <c.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-display text-lg font-semibold">{t(c.ar, c.en)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(c.dAr, c.dEn)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
