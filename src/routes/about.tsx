import { createFileRoute } from "@tanstack/react-router";
import { Mail, Network, UserRound } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "حول Network Master" },
      {
        name: "description",
        content: "About Network Master and its developer.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useLang();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid-bg border-b border-border p-7 md:p-10">
          <div className="flex items-center gap-3 text-primary">
            <Network className="h-8 w-8" />
            <span className="font-mono text-xs tracking-widest">NETWORK MASTER / ABOUT</span>
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold md:text-4xl">
            {t("حول المنصة", "About the platform")}
          </h1>
          <p className="mt-3 max-w-2xl leading-8 text-muted-foreground">
            {t(
              "منصة تعليمية عربية وإنجليزية لتعلّم شبكات الحاسوب ومحاكاتها، تجمع بين الدروس النظرية والتطبيق العملي والتدريب على استكشاف الأعطال.",
              "A bilingual learning platform for studying and simulating computer networks, combining guided lessons, hands-on labs and troubleshooting practice.",
            )}
          </p>
        </div>

        <div className="p-7 md:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <UserRound className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t("تطوير المنصة", "Platform developer")}
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {t("تم تطويره بواسطة المهندس:", "Developed by Engineer:")}
              </h2>
            </div>
          </div>

          <p className="mt-5 text-2xl font-bold text-primary">
            {t("معاذ الصالحي", "Muath Al-Salhi")}
          </p>

          <a
            href="mailto:muathalsalhi775089399@gmail.com"
            className="mt-5 inline-flex max-w-full items-center gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm transition hover:border-primary"
          >
            <Mail className="h-5 w-5 shrink-0 text-primary" />
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">Email address</span>
              <span className="break-all font-medium" dir="ltr">
                muathalsalhi775089399@gmail.com
              </span>
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
