import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  Cpu,
  GraduationCap,
  Target,
  Wrench,
} from "lucide-react";
import { lessons } from "@/lib/content";
import { useLang, useProgress } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

type DashboardProfile = {
  displayName: string;
  goal: string;
  weeklyTarget: number;
};

const goalLabels: Record<string, { ar: string; en: string }> = {
  ccna: { ar: "CCNA", en: "CCNA" },
  mikrotik: { ar: "MikroTik / RouterOS", en: "MikroTik / RouterOS" },
  "network-admin": { ar: "إدارة الشبكات", en: "Network administration" },
  troubleshooting: { ar: "صيانة وإصلاح الأعطال", en: "Troubleshooting" },
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة تحكم الطالب — Network Master" },
      {
        name: "description",
        content: "لوحة الطالب لمتابعة تقدم التعلم والدروس والأهداف التعليمية.",
      },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { t } = useLang();
  const { done } = useProgress();
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<DashboardProfile>({
    displayName: "",
    goal: "ccna",
    weeklyTarget: 5,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadDashboardProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!active) return;
      if (user) {
        setEmail(user.email ?? null);
        const metadataName =
          typeof user.user_metadata?.display_name === "string"
            ? user.user_metadata.display_name
            : "";
        const { data: cloudProfile } = await supabase
          .from("profiles")
          .select("display_name, learning_goal, weekly_target")
          .eq("id", user.id)
          .maybeSingle();
        if (!active) return;
        setProfile({
          displayName: cloudProfile?.display_name || metadataName,
          goal: cloudProfile?.learning_goal || "ccna",
          weeklyTarget: cloudProfile?.weekly_target || 5,
        });
      }
      if (active) setLoading(false);
    };
    void loadDashboardProfile();
    return () => {
      active = false;
    };
  }, []);

  const completedLessons = useMemo(
    () => lessons.filter((lesson) => done.includes(lesson.id)),
    [done],
  );
  const completedCount = completedLessons.length;
  const remainingCount = Math.max(lessons.length - completedCount, 0);
  const completion = Math.round((completedCount / Math.max(lessons.length, 1)) * 100);
  const nextLesson = lessons.find((lesson) => !done.includes(lesson.id));
  const levelStats = useMemo(
    () =>
      (["beginner", "intermediate", "advanced"] as const).map((level) => {
        const levelLessons = lessons.filter((lesson) => lesson.level === level);
        const levelDone = levelLessons.filter((lesson) => done.includes(lesson.id)).length;
        return {
          level,
          completed: levelDone,
          total: levelLessons.length,
          percent: Math.round((levelDone / Math.max(levelLessons.length, 1)) * 100),
        };
      }),
    [done],
  );
  const goalLabel = goalLabels[profile.goal] ?? goalLabels.ccna;

  const quickLinks = [
    {
      to: "/learn",
      icon: BookOpen,
      titleAr: "مكتبة الدروس",
      titleEn: "Lesson library",
      descriptionAr: "تابع الدروس المنظمة من الأساسيات إلى المستوى المتقدم.",
      descriptionEn: "Continue structured lessons from fundamentals to advanced topics.",
    },
    {
      to: "/lab",
      icon: Cpu,
      titleAr: "المختبر العملي",
      titleEn: "Hands-on lab",
      descriptionAr: "طبّق المفاهيم وابنِ شبكات افتراضية.",
      descriptionEn: "Apply concepts and build virtual networks.",
    },
    {
      to: "/exam",
      icon: ClipboardCheck,
      titleAr: "الاختبارات",
      titleEn: "Practice exams",
      descriptionAr: "اختبر فهمك واستعد للخطوة التالية.",
      descriptionEn: "Check your understanding and prepare for the next step.",
    },
    {
      to: "/troubleshoot",
      icon: Wrench,
      titleAr: "تحديات الأعطال",
      titleEn: "Troubleshooting",
      descriptionAr: "تدرّب على تشخيص مشكلات الشبكات وحلها.",
      descriptionEn: "Practice diagnosing and solving network issues.",
    },
  ] as const;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
      <section className="grid-bg overflow-hidden rounded-2xl border border-border p-6 md:p-9">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-6 w-6" />
              <span className="font-mono text-xs tracking-widest">NETWORK MASTER / STUDENT</span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold md:text-4xl">
              {t("لوحة تحكم الطالب", "Student dashboard")}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
              {loading
                ? t("جارٍ تحميل بيانات حسابك...", "Loading your account details...")
                : email
                  ? t(
                      `مرحباً بعودتك، ${profile.displayName || email.split("@")[0]}. تابع رحلتك في تعلم الشبكات.`,
                      `Welcome back, ${profile.displayName || email.split("@")[0]}. Keep building your networking skills.`,
                    )
                  : t(
                      "تابع تقدمك التعليمي من مكان واحد، وسجّل الدخول لمزامنة بياناتك.",
                      "Track your learning in one place and sign in to sync your progress.",
                    )}
            </p>
            {email && (
              <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground" dir="ltr">
                <CircleUserRound className="h-4 w-4" />
                {email}
              </p>
            )}
          </div>
          <Link
            to={email ? "/profile" : "/auth"}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            <CircleUserRound className="h-4 w-4" />
            {email ? t("إعدادات ملفي", "My profile") : t("تسجيل الدخول", "Sign in")}
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {t("الدروس المكتملة", "Completed lessons")}
          </div>
          <p className="mt-3 font-mono text-3xl font-bold">{completedCount}<span className="text-base font-medium text-muted-foreground"> / {lessons.length}</span></p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            {t("نسبة الإنجاز", "Completion")}
          </div>
          <p className="mt-3 font-mono text-3xl font-bold">{completion}%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            {t("الدروس المتبقية", "Lessons remaining")}
          </div>
          <p className="mt-3 font-mono text-3xl font-bold">{remainingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 text-primary" />
            {t("هدفك الأسبوعي", "Weekly target")}
          </div>
          <p className="mt-3 font-mono text-3xl font-bold">{profile.weeklyTarget}<span className="ms-2 text-sm font-medium text-muted-foreground">{t("دروس", "lessons")}</span></p>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">{t("رحلتك التعليمية", "Your learning journey")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("تقدمك في مستويات المنهج", "Your progress across the curriculum levels")}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{completion}%</span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label={t("التقدم الكلي", "Overall progress")} aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
          <div className="mt-6 space-y-5">
            {levelStats.map((item) => {
              const levelName = item.level === "beginner"
                ? t("مبتدئ", "Beginner")
                : item.level === "intermediate"
                  ? t("متوسط", "Intermediate")
                  : t("متقدم", "Advanced");
              return (
                <div key={item.level}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{levelName}</span>
                    <span className="font-mono text-muted-foreground">{item.completed}/{item.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary/80" style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            <h2 className="font-display text-xl font-bold text-foreground">{t("هدفك التعليمي", "Your learning goal")}</h2>
          </div>
          <p className="mt-4 text-2xl font-bold">{t(goalLabel.ar, goalLabel.en)}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("يمكنك تعديل هدفك وعدد الدروس الأسبوعي من صفحة ملفك التعليمي.", "You can change your goal and weekly lesson target from your learning profile.")}
          </p>
          <Link to="/profile" className="mt-5 inline-flex rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
            {t("تعديل الهدف", "Edit goal")}
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">{t("خطوتك التالية", "Your next step")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("استمر من حيث وصلت.", "Pick up where you left off.")}</p>
          </div>
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        {nextLesson ? (
          <div className="mt-5 flex flex-col gap-4 rounded-xl bg-secondary/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold text-primary">{t("الدرس التالي في المنهج", "NEXT LESSON IN THE CURRICULUM")}</p>
              <h3 className="mt-2 text-lg font-bold">{t(nextLesson.titleAr, nextLesson.titleEn)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("أكمل هذا الدرس لزيادة تقدمك.", "Complete this lesson to move your progress forward.")}</p>
            </div>
            <Link to="/learn/$id" params={{ id: nextLesson.id }} className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
              {t("متابعة الدرس", "Continue lesson")}
            </Link>
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-secondary/50 p-5">
            <p className="font-semibold">{t("أكملت جميع الدروس المتاحة!", "You completed all available lessons!")}</p>
            <Link to="/lab" className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">{t("انتقل إلى المختبر", "Go to the lab")}</Link>
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-4">
          <h2 className="font-display text-xl font-bold">{t("الوصول السريع", "Quick access")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("أدواتك التعليمية الأساسية في مكان واحد.", "Your essential learning tools in one place.")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="rounded-xl border border-border bg-card p-5 transition hover:border-primary">
              <item.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-semibold">{t(item.titleAr, item.titleEn)}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(item.descriptionAr, item.descriptionEn)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">{t("إنجازاتك", "Your achievements")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("تظهر الإنجازات تلقائياً مع تقدمك في المنهج.", "Achievements unlock as you progress through the curriculum.")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { threshold: 1, ar: "أول خطوة", en: "First step" },
            { threshold: 5, ar: "متعلم نشط", en: "Active learner" },
            { threshold: 10, ar: "مثابر", en: "Consistent learner" },
            { threshold: Math.ceil(lessons.length / 2), ar: "نصف الطريق", en: "Halfway there" },
            { threshold: lessons.length, ar: "إتمام المنهج", en: "Curriculum complete" },
          ].map((achievement) => {
            const unlocked = completedCount >= achievement.threshold;
            return (
              <span key={achievement.threshold} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${unlocked ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                <Award className="h-4 w-4" />
                {t(achievement.ar, achievement.en)}
                {unlocked ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}
