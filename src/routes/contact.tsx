import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    links: [{ rel: "canonical", href: "https://alsalhi-network-master.lovable.app/contact" }],
    meta: [
      { title: "اتصل بنا | Network Master" },
      { name: "description", content: "تواصل مع فريق Network Master للاستفسارات والملاحظات والدعم." },
      { property: "og:title", content: "اتصل بنا | Network Master" },
      { property: "og:url", content: "https://alsalhi-network-master.lovable.app/contact" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <section className="rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><MessageCircle className="h-6 w-6" /></div>
        <h1 className="mt-5 font-display text-3xl font-bold">{t("تواصل معنا", "Contact us")}</h1>
        <p className="mt-3 leading-8 text-muted-foreground">{t("يسعدنا استقبال أسئلتك وملاحظاتك حول الدروس والمختبرات وتجربة الاستخدام، كما يمكنك التواصل لطلبات الخصوصية أو الإبلاغ عن مشكلة تقنية.", "We welcome your questions and feedback about lessons, labs and the learning experience. You can also contact us with privacy requests or to report a technical issue.")}</p>
        <a href="mailto:muathalsalhi775089399@gmail.com" className="mt-7 flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-4 transition hover:border-primary">
          <Mail className="h-6 w-6 text-primary" />
          <span><span className="block text-sm text-muted-foreground">{t("البريد الإلكتروني", "Email")}</span><span className="font-medium text-foreground" dir="ltr">muathalsalhi775089399@gmail.com</span></span>
        </a>
        <p className="mt-5 text-sm text-muted-foreground">{t("يرجى وصف المشكلة وإرفاق رابط الصفحة المعنية، ولا ترسل كلمات مرور أو بيانات دخول حساسة.", "Please describe the issue and include the relevant page URL. Do not send passwords or sensitive login credentials.")}</p>
      </section>
    </main>
  );
}
