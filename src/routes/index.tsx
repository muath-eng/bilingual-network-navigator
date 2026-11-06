import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Cpu, Wrench, Calculator } from "lucide-react";
import { useLang, useProgress } from "@/lib/i18n";
import { lessons } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Network Master — تعلّم الشبكات من الصفر حتى الاحتراف" },
      { name: "description", content: "منصة عربية وإنجليزية لتعلم الشبكات ومحاكاتها: دروس، مختبر تفاعلي، وإصلاح أعطال." },
      { property: "og:title", content: "Network Master" },
      { property: "og:description", content: "Learn networking from zero to pro with lessons, a live lab and troubleshooting drills." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const { done } = useProgress();
  const pct = Math.round((done.length / lessons.length) * 100);
  const cards = [
    { to: "/learn", icon: BookOpen, ar: "دروس متدرجة", en: "Step-by-step lessons", dAr: "من أساسيات الشبكات حتى التوجيه المتقدم.", dEn: "From basics to advanced routing." },
    { to: "/lab", icon: Cpu, ar: "مختبر المحاكاة", en: "Simulation lab", dAr: "ابنِ شبكتك، اضبط العناوين، واختبر ping.", dEn: "Build a network, set IPs, test ping." },
    { to: "/troubleshoot", icon: Wrench, ar: "إصلاح الأعطال", en: "Troubleshooting", dAr: "سيناريوهات واقعية لتشخيص المشاكل.", dEn: "Real scenarios to diagnose faults." },
    { to: "/subnet", icon: Calculator, ar: "حاسبة الشبكات الفرعية", en: "Subnet calculator", dAr: "احسب الشبكة والبث وعدد الأجهزة.", dEn: "Compute network, broadcast, hosts." },
  ] as const;
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
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
        <div className="mt-8 max-w-sm">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("تقدمك", "Your progress")}</span><span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-secondary">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="rounded-xl border border-border bg-card p-6 transition hover:border-primary">
            <c.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-display text-lg font-semibold">{t(c.ar, c.en)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(c.dAr, c.dEn)}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
