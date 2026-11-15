import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/terms")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "شروط الاستخدام | Network Master" },
      { name: "description", content: "شروط استخدام منصة Network Master التعليمية والدروس والمختبرات والمحاكاة." },
      { property: "og:title", content: "شروط الاستخدام | Network Master" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://alsalhi-network-master.lovable.app/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <article className="rounded-2xl border border-border bg-card p-6 leading-8 md:p-10">
        <p className="font-mono text-xs text-primary">NETWORK MASTER / TERMS</p>
        <h1 className="mt-3 text-3xl font-bold">{t("شروط الاستخدام", "Terms of Use")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("آخر تحديث: 15 نوفمبر 2026", "Last updated: 15 November 2026")}</p>
        <p className="mt-6">{t(
          "باستخدامك منصة Network Master فإنك توافق على هذه الشروط. إذا لم توافق عليها، يرجى التوقف عن استخدام الموقع.",
          "By using Network Master, you agree to these terms. If you do not agree, please stop using the website."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("1. طبيعة الخدمة", "1. Nature of the service")}</h2>
        <p>{t(
          "Network Master منصة تعليمية تقدم محتوى ودروساً وأدوات تدريب ومحاكاة للشبكات. المحتوى متاح مجاناً لأغراض التعلم والتدريب، وقد تتغير الميزات أو تتوقف مؤقتاً لتحسين الخدمة أو صيانتها.",
          "Network Master is an educational platform providing networking lessons, learning tools and simulations. Content is available free of charge for learning and practice. Features may change or be temporarily unavailable for maintenance or improvement."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("2. الحساب والاستخدام المقبول", "2. Accounts and acceptable use")}</h2>
        <p>{t(
          "أنت مسؤول عن دقة المعلومات التي تقدمها وعن الحفاظ على سرية بيانات الدخول إلى حسابك. استخدم المنصة بطريقة قانونية وتعليمية، ولا تحاول تعطيل الموقع أو الوصول غير المصرح به إلى حسابات أو أنظمة أو بيانات الآخرين.",
          "You are responsible for the accuracy of information you provide and for keeping your account credentials secure. Use the platform lawfully and for educational purposes. Do not disrupt the website or attempt unauthorized access to other users' accounts, systems or data."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("3. المحاكاة والتنبيهات الفنية", "3. Simulations and technical disclaimers")}</h2>
        <p>{t(
          "أدوات المختبر وتدريب Cisco وMikroTik محاكاة تعليمية مبسطة، وليست بديلاً عن الأجهزة الحقيقية أو بيئات الإنتاج أو الوثائق الرسمية. قد تختلف النتائج عن سلوك الأجهزة الفعلية. تحقق دائماً من الأوامر والإعدادات قبل تطبيقها على شبكة حقيقية.",
          "The lab and Cisco/MikroTik practice tools are simplified educational simulations. They are not substitutes for real devices, production environments or official documentation. Results may differ from actual device behavior. Always verify commands and configurations before applying them to a live network."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("4. الملكية الفكرية", "4. Intellectual property")}</h2>
        <p>{t(
          "تعود حقوق تصميم المنصة وعناصرها ومحتواها الأصلي إلى أصحابها، ولا يجوز نسخها أو إعادة نشرها أو استغلالها تجارياً دون إذن، باستثناء الاستخدام الشخصي والتعليمي المسموح به بموجب القانون.",
          "Rights in the platform's design, components and original content belong to their respective owners. You may not copy, republish or commercially exploit them without permission, except for personal and educational uses permitted by law."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("5. الإعلانات والروابط الخارجية", "5. Advertising and external links")}</h2>
        <p>{t(
          "قد تعرض المنصة إعلانات من أطراف ثالثة للمساعدة في تغطية تكاليف التشغيل مع إبقاء المحتوى التعليمي مجانياً. لا نتحكم في محتوى المواقع الخارجية أو خدماتها، ويكون استخدامك لها وفق شروط وسياسات الجهات التابعة لها. لا تنقر على إعلان إلا إذا كنت مهتماً به فعلاً.",
          "The platform may display third-party advertisements to help support operating costs while keeping learning content free. We do not control external websites or services; your use of them is subject to their own terms and policies. Do not click an advertisement unless you are genuinely interested in it."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("6. حدود المسؤولية", "6. Limitation of responsibility")}</h2>
        <p>{t(
          "تُقدم المنصة والمحتويات والأدوات كما هي ولأغراض تعليمية. نبذل جهداً معقولاً للحفاظ على دقتها وتوفرها، لكننا لا نقدم ضماناً بأن الخدمة ستكون متواصلة أو خالية من الأخطاء، ولا نتحمل مسؤولية الأضرار الناتجة عن تطبيق إعدادات أو أوامر دون تحقق مستقل، بالقدر الذي يسمح به القانون.",
          "The platform, content and tools are provided as-is for educational purposes. We make reasonable efforts to maintain accuracy and availability, but do not warrant uninterrupted or error-free service. To the extent permitted by law, we are not responsible for damage resulting from applying configurations or commands without independent verification."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("7. التعديلات والتواصل", "7. Changes and contact")}</h2>
        <p>{t(
          "قد نحدّث هذه الشروط من وقت لآخر. استمرارك في استخدام المنصة بعد نشر التعديلات يعني قبولك للشروط المحدّثة. للاستفسارات:",
          "We may update these terms from time to time. Continued use of the platform after changes are published means you accept the updated terms. For questions:"
        )}</p>
        <a className="font-medium text-primary underline" href="mailto:muathalsalhi775089399@gmail.com">muathalsalhi775089399@gmail.com</a>
      </article>
    </main>
  );
}
