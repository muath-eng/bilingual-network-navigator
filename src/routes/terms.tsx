import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => ({
    links: [{ rel: "canonical", href: "https://alsalhi-network-master.lovable.app/terms" }],
    meta: [
      { title: "شروط الاستخدام | Network Master" },
      { name: "description", content: "شروط استخدام منصة Network Master التعليمية وحدود المسؤولية وحقوق المحتوى." },
      { property: "og:title", content: "شروط الاستخدام | Network Master" },
      { property: "og:url", content: "https://alsalhi-network-master.lovable.app/terms" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <article className="rounded-2xl border border-border bg-card p-6 md:p-10">
        <p className="font-mono text-xs tracking-widest text-primary">NETWORK MASTER / TERMS</p>
        <h1 className="mt-3 font-display text-3xl font-bold">{t("شروط الاستخدام", "Terms of Use")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("آخر تحديث: 17 نوفمبر 2026", "Last updated: November 17, 2026")}</p>
        <div className="mt-8 space-y-7 leading-8 text-muted-foreground">
          <section><h2 className="text-xl font-semibold text-foreground">{t("1. قبول الشروط", "1. Acceptance")}</h2><p>{t("باستخدامك منصة Network Master فإنك توافق على هذه الشروط وسياسة الخصوصية. إذا لم توافق عليها، يرجى عدم استخدام الميزات التي تتطلب حساباً.", "By using Network Master, you agree to these terms and the Privacy Policy. If you do not agree, do not use account-based features.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("2. طبيعة الخدمة", "2. Educational service")}</h2><p>{t("توفر المنصة دروساً واختبارات وأدوات ومختبرات محاكاة تعليمية في مجال الشبكات. جميع المواد التعليمية متاحة مجاناً حالياً، وقد تتغير الميزات أو تتوقف مؤقتاً لأغراض الصيانة أو التطوير.", "The platform provides networking lessons, quizzes, tools and educational simulation labs. Learning materials are currently free. Features may change or be temporarily unavailable for maintenance or development.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("3. الحساب والاستخدام المسؤول", "3. Accounts and responsible use")}</h2><p>{t("أدخل معلومات صحيحة، وحافظ على سرية بيانات دخولك. أنت مسؤول عن النشاط الذي يتم من خلال حسابك. يحظر إساءة استخدام المنصة أو محاولة تعطيلها أو الوصول غير المصرح به إلى حسابات أو أنظمة الآخرين.", "Provide accurate information and keep your login credentials confidential. You are responsible for activity through your account. Do not misuse, disrupt or attempt unauthorized access to the platform, other accounts or systems.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("4. المحاكاة والنتائج", "4. Simulations and results")}</h2><p>{t("بعض أوامر Cisco وRouterOS ومسارات الحزم ونتائج ping داخل المختبر محاكاة تعليمية وليست أجهزة أو شبكات حقيقية. قد تختلف النتائج عن بيئات الإنتاج. لا تعتمد على المحاكاة وحدها لتغيير شبكة حقيقية، واختبر أي إعداد في بيئة آمنة أولاً.", "Some Cisco and RouterOS commands, packet paths and ping results in the lab are educational simulations, not real devices or networks. Results may differ from production environments. Do not rely on simulations alone when changing a live network; test configurations safely first.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("5. الشهادات والعلامات التجارية", "5. Certificates and trademarks")}</h2><p>{t("أي شهادة إنجاز تصدرها المنصة هي شهادة تدريبية داخلية وليست اعتماداً مهنياً أو شهادة رسمية من Cisco أو MikroTik. الأسماء والعلامات التجارية تعود إلى أصحابها، ولا تعني الإشارة إليها وجود شراكة أو اعتماد رسمي.", "Any achievement certificate issued by the platform is an internal learning certificate, not a professional accreditation or official Cisco or MikroTik certification. Trademarks belong to their respective owners; references do not imply partnership or endorsement.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("6. الملكية الفكرية", "6. Intellectual property")}</h2><p>{t("لا يجوز نسخ محتوى المنصة أو إعادة نشره تجارياً دون إذن، كما يجب عليك امتلاك الحقوق اللازمة لأي محتوى تقوم بإرساله أو مشاركته. لا تستخدم المنصة لانتهاك حقوق الآخرين.", "You may not commercially copy or republish platform content without permission. You must own or have permission to use any content you submit or share. Do not use the platform to infringe others' rights.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("7. الإعلانات والروابط الخارجية", "7. Ads and external links")}</h2><p>{t("قد تعرض المنصة إعلانات أو روابط لخدمات خارجية. لا نتحكم في محتوى المواقع الخارجية أو ممارساتها، ويجب التعامل معها وفق شروطها وسياسات الخصوصية الخاصة بها. لا تنقر على إعلان إلا إذا كنت مهتماً به فعلاً.", "The platform may display advertisements or links to external services. We do not control external websites or their practices; use them subject to their own terms and privacy policies. Click an ad only if you are genuinely interested in it.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("8. إخلاء المسؤولية", "8. Disclaimer")}</h2><p>{t("تقدم المنصة كما هي ولأغراض تعليمية، دون ضمان خلوها من الأخطاء أو ملاءمتها لغرض محدد. إلى الحد الذي يسمح به القانون، لا نتحمل مسؤولية الأضرار الناتجة عن الاعتماد على المعلومات أو استخدام الأدوات والمحاكاة.", "The platform is provided as is for educational purposes, without a guarantee that it is error-free or fit for a particular purpose. To the extent permitted by law, we are not liable for damages arising from reliance on information or use of tools and simulations.")}</p></section>
          <section><h2 className="text-xl font-semibold text-foreground">{t("9. التعديلات والتواصل", "9. Changes and contact")}</h2><p>{t("قد نحدّث هذه الشروط عند تطوير المنصة. استمرارك في الاستخدام بعد نشر التعديلات يعني قبولك لها. للاستفسارات تواصل عبر:", "We may update these terms as the platform develops. Continued use after changes are posted means you accept them. For questions, contact:")}</p><a className="font-medium text-primary underline" href="mailto:muathalsalhi775089399@gmail.com" dir="ltr">muathalsalhi775089399@gmail.com</a></section>
        </div>
      </article>
    </main>
  );
}
