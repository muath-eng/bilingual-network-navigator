import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  BookOpen,
  Download,
  FileUp,
  GraduationCap,
  ShieldCheck,
  Target,
} from "lucide-react";
import { lessons } from "@/lib/content";
import { useLang, useProgress } from "@/lib/i18n";

type LearnerProfile = { name: string; goal: string; weeklyTarget: number };
type BackupFile = {
  app: "Network Master";
  version: 1;
  exportedAt: string;
  profile: LearnerProfile;
  progressIds: string[];
};
const PROFILE_KEY = "nm-profile";
const defaults: LearnerProfile = { name: "", goal: "ccna", weeklyTarget: 5 };

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "ملفي التعليمي — Network Master" },
      { property: "og:title", content: "Learning Profile — Network Master" },
      { property: "og:description", content: "Manage your learner profile and back up your local learning progress." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        name: "description",
        content: "Manage your learner profile and back up your local learning progress.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useLang();
  const { done } = useProgress();
  const [profile, setProfile] = useState<LearnerProfile>(defaults);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<LearnerProfile>;
        setProfile({
          name: typeof parsed.name === "string" ? parsed.name : "",
          goal: typeof parsed.goal === "string" ? parsed.goal : "ccna",
          weeklyTarget:
            typeof parsed.weeklyTarget === "number"
              ? Math.min(20, Math.max(1, parsed.weeklyTarget))
              : 5,
        });
      }
    } catch {
      localStorage.removeItem(PROFILE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  const completed = useMemo(
    () => lessons.filter((lesson) => done.includes(lesson.id)).length,
    [done],
  );
  const percent = Math.round((completed / Math.max(lessons.length, 1)) * 100);
  const levels = ["beginner", "intermediate", "advanced"].filter((level) =>
    lessons.some((lesson) => lesson.level === level && done.includes(lesson.id)),
  ).length;

  const exportBackup = () => {
    const data: BackupFile = {
      app: "Network Master",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      progressIds: lessons.filter((lesson) => done.includes(lesson.id)).map((lesson) => lesson.id),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "network-master-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(
      t(
        "تم تجهيز نسخة احتياطية من ملفك وتقدمك.",
        "Your profile and progress backup has been prepared.",
      ),
    );
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Partial<BackupFile>;
      if (
        parsed.app !== "Network Master" ||
        parsed.version !== 1 ||
        !Array.isArray(parsed.progressIds)
      )
        throw new Error("invalid backup");
      const validIds = new Set(lessons.map((lesson) => lesson.id));
      const restored = [
        ...new Set(
          parsed.progressIds.filter(
            (id): id is string => typeof id === "string" && validIds.has(id),
          ),
        ),
      ];
      const p = parsed.profile;
      const restoredProfile: LearnerProfile = {
        name: typeof p?.name === "string" ? p.name.slice(0, 60) : "",
        goal: typeof p?.goal === "string" ? p.goal : "ccna",
        weeklyTarget:
          typeof p?.weeklyTarget === "number" ? Math.min(20, Math.max(1, p.weeklyTarget)) : 5,
      };
      localStorage.setItem("nm-progress", JSON.stringify(restored));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(restoredProfile));
      setMessage(
        t(
          "تم استيراد النسخة. سيتم تحديث الصفحة لاستعادة تقدمك.",
          "Backup imported. The page will reload to restore your progress.",
        ),
      );
      window.setTimeout(() => window.location.reload(), 900);
    } catch {
      setMessage(
        t(
          "تعذر استيراد الملف. تأكد أنه نسخة Network Master صحيحة.",
          "Could not import this file. Please choose a valid Network Master backup.",
        ),
      );
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <div className="flex items-center gap-3 text-primary">
          <GraduationCap className="h-8 w-8" />
          <span className="font-mono text-xs">NETWORK MASTER / LEARNER</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold">
          {t("ملفي التعليمي", "My learning profile")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
          {t(
            "خصص هدفك التعليمي وتابع إنجازك واحتفظ بنسخة احتياطية من تقدمك لنقله إلى جهاز آخر.",
            "Set your learning goal, track achievements and back up your progress to move it to another device.",
          )}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-secondary/60 p-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t("الدروس المكتملة", "Completed lessons")}
            </p>
            <p className="font-mono text-2xl font-bold">
              {completed}/{lessons.length}
            </p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-4">
            <Target className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">{t("نسبة الإنجاز", "Completion")}</p>
            <p className="font-mono text-2xl font-bold">{percent}%</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-4">
            <Award className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">
              {t("مستويات أنجزت فيها", "Levels with progress")}
            </p>
            <p className="font-mono text-2xl font-bold">{levels}/3</p>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">{t("بيانات المتعلم", "Learner details")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            {t("اسم العرض (اختياري)", "Display name (optional)")}
            <input
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value.slice(0, 60) }))}
              placeholder={t("اكتب اسمك", "Enter your name")}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium">
            {t("هدفك التعليمي", "Learning goal")}
            <select
              value={profile.goal}
              onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value }))}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ccna">CCNA</option>
              <option value="mikrotik">MikroTik / RouterOS</option>
              <option value="network-admin">{t("إدارة الشبكات", "Network administration")}</option>
              <option value="troubleshooting">
                {t("صيانة وإصلاح الأعطال", "Troubleshooting")}
              </option>
            </select>
          </label>
          <label className="text-sm font-medium sm:col-span-2">
            {t("هدف الدروس الأسبوعي", "Weekly lesson target")}
            <select
              value={profile.weeklyTarget}
              onChange={(e) => setProfile((p) => ({ ...p, weeklyTarget: Number(e.target.value) }))}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2"
            >
              {[3, 5, 7, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} {t("دروس أسبوعياً", "lessons per week")}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          {t(
            "هذه البيانات والتقدم محفوظة محلياً في هذا المتصفح فقط حالياً. لا يوجد حساب سحابي أو مزامنة تلقائية بين الأجهزة بعد.",
            "This profile and progress are currently stored only in this browser. Cloud accounts and automatic cross-device sync are not enabled yet.",
          )}
        </p>
      </section>
      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 className="font-display text-xl font-bold">
            {t("النسخ الاحتياطي والاستعادة", "Backup and restore")}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {t(
            "نزّل ملف النسخة الاحتياطية واحتفظ به. عند استخدام جهاز آخر، افتح ملفك التعليمي واختر استعادة النسخة لإرجاع الدروس المكتملة وبيانات ملفك.",
            "Download and keep your backup file. On another device, open this profile and restore the file to recover completed lessons and profile details.",
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={exportBackup}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Download className="h-4 w-4" />
            {t("تنزيل نسخة احتياطية", "Download backup")}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-secondary"
          >
            <FileUp className="h-4 w-4" />
            {t("استعادة نسخة احتياطية", "Restore backup")}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void importBackup(e.target.files?.[0])}
          />
        </div>
        {message && (
          <p role="status" className="mt-4 rounded-lg bg-secondary p-3 text-sm">
            {message}
          </p>
        )}
      </section>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/learn"
          className="rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-secondary"
        >
          {t("متابعة الدروس", "Continue lessons")}
        </Link>
        <Link
          to="/exam"
          className="rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:bg-secondary"
        >
          {t("اختبر مستواك", "Test your knowledge")}
        </Link>
      </div>
    </main>
  );
}
