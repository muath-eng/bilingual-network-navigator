import { Link } from "@tanstack/react-router";
import { Network } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const { t, lang, setLang } = useLang();
  const links = [
    { to: "/learn", ar: "الدروس", en: "Lessons" },
    { to: "/lab", ar: "المختبر", en: "Lab" },
    { to: "/troubleshoot", ar: "الأعطال", en: "Troubleshoot" },
    { to: "/subnet", ar: "حاسبة الشبكات", en: "Subnet calc" },
    { to: "/mikrotik", ar: "MikroTik", en: "MikroTik" },
    { to: "/practice", ar: "تدريب الأوامر", en: "CLI practice" },
    { to: "/exam", ar: "الاختبارات", en: "Exams" },
    { to: "/profile", ar: "ملفي", en: "Profile" },
    { to: "/auth", ar: "حساب الطالب", en: "Student account" },
    { to: "/about", ar: "حول", en: "About" },
  ] as const;
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <Network className="h-6 w-6 text-primary" /> Network Master
        </Link>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto text-sm md:order-none md:w-auto md:ms-6">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {t(l.ar, l.en)}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          className="ms-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
        >
          {lang === "ar" ? "English" : "العربية"}
        </button>
      </div>
    </header>
  );
}
