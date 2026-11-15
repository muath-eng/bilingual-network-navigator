import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

const updatedAt = "15 November 2026";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | Network Master" },
      { name: "description", content: "تعرف على البيانات التي قد تجمعها منصة Network Master وكيفية استخدامها وحمايتها، وخياراتك المتعلقة بها." },
      { property: "og:title", content: "سياسة الخصوصية | Network Master" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://alsalhi-network-master.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <article className="rounded-2xl border border-border bg-card p-6 leading-8 md:p-10">
        <p className="font-mono text-xs text-primary">NETWORK MASTER / PRIVACY</p>
        <h1 className="mt-3 text-3xl font-bold">{t("سياسة الخصوصية", "Privacy Policy")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t(`آخر تحديث: ${updatedAt}`, `Last updated: ${updatedAt}`)}</p>
        <p className="mt-6">{t(
          "توضح هذه السياسة كيف تتعامل منصة Network Master مع المعلومات عند استخدام الموقع. المنصة تعليمية وتوفر الدروس وأدوات التدريب مجاناً.",
          "This policy explains how Network Master handles information when you use the website. The platform provides its lessons and learning tools free of charge."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("1. المعلومات التي قد نجمعها", "1. Information we may collect")}</h2>
        <p>{t(
          "عند إنشاء حساب أو استخدام ميزات الحساب، قد نعالج عنوان البريد الإلكتروني وبيانات الملف الشخصي التي تقدمها. وقد نحفظ بيانات تقدمك في الدروس ونتائج الاختبارات والإعدادات المرتبطة بحسابك حتى تتمكن من متابعة التعلم.",
          "When you create an account or use account features, we may process your email address and profile details you provide. Lesson progress, quiz results and account-related preferences may also be stored so you can continue learning."
        )}</p>
        <p>{t(
          "قد يستخدم الموقع التخزين المحلي في متصفحك لحفظ بعض التفضيلات أو التقدم مؤقتاً وتحسين تجربة الاستخدام.",
          "The website may use your browser's local storage to retain certain preferences or learning progress and improve your experience."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("2. كيف نستخدم المعلومات", "2. How information is used")}</h2>
        <p>{t(
          "تُستخدم المعلومات لتشغيل الموقع، وتسجيل الدخول، ومزامنة تقدمك، وعرض نتائجك، وتحسين موثوقية الخدمات، والرد على استفسارات الدعم. لا نطلب منك إدخال كلمات مرور خدمات أخرى أو بيانات مالية داخل المنصة.",
          "Information is used to operate the website, authenticate accounts, sync learning progress, show results, maintain service reliability and respond to support requests. You should not enter passwords for other services or financial credentials into the platform."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("3. خدمات الأطراف الثالثة", "3. Third-party services")}</h2>
        <p>{t(
          "تستخدم المنصة خدمات استضافة وقاعدة بيانات ومصادقة لتشغيل الحسابات وحفظ البيانات. وقد تُضاف إعلانات من Google AdSense أو شركاء إعلانيين آخرين مستقبلاً. عند تفعيل الإعلانات، قد تستخدم Google أو شركاؤها ملفات تعريف الارتباط أو تقنيات مشابهة لعرض الإعلانات وقياسها وفق إعداداتك والقوانين المعمول بها. راجع سياسات Google لمعرفة كيفية استخدام البيانات.",
          "The platform relies on hosting, database and authentication services to operate accounts and store data. Google AdSense or other advertising partners may be added in the future. If advertising is enabled, Google or its partners may use cookies or similar technologies to serve and measure ads according to your settings and applicable laws. Review Google's policies for details about their data practices."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("4. ملفات تعريف الارتباط والاختيارات", "4. Cookies and choices")}</h2>
        <p>{t(
          "قد تستخدم الخدمات الأساسية تقنيات تخزين ضرورية لتسجيل الدخول وحفظ التفضيلات. وإذا فُعّلت الإعلانات، فقد تتوفر إعدادات إضافية للتحكم في الإعلانات المخصصة وملفات تعريف الارتباط بحسب بلدك ومتطلبات Google.",
          "Core services may use storage technologies needed for sign-in and preferences. If ads are enabled, additional controls for personalized advertising and cookies may be available depending on your location and Google's requirements."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("5. حماية المعلومات والاحتفاظ بها", "5. Data security and retention")}</h2>
        <p>{t(
          "نتخذ تدابير تقنية وتنظيمية معقولة لحماية المعلومات، لكن لا يمكن ضمان أمان أي خدمة عبر الإنترنت بصورة مطلقة. نحتفظ بالبيانات ما دامت لازمة لتقديم ميزات المنصة أو للامتثال للالتزامات ذات الصلة، وقد تُحذف أو تُحدّث عند طلب ذلك حيثما أمكن.",
          "We use reasonable technical and organizational measures to protect information, but no online service can guarantee absolute security. Data is retained while needed to provide platform features or meet relevant obligations, and may be deleted or updated upon request where feasible."
        )}</p>

        <h2 className="mt-8 text-xl font-bold">{t("6. حقوقك والتواصل", "6. Your rights and contact")}</h2>
        <p>{t(
          "يمكنك التواصل لطلب معرفة المعلومات المرتبطة بحسابك أو تصحيحها أو حذفها، مع مراعاة المتطلبات القانونية والتقنية. للاستفسارات المتعلقة بالخصوصية:",
          "You may contact us to ask about, correct or request deletion of information associated with your account, subject to legal and technical requirements. For privacy questions:"
        )}</p>
        <a className="font-medium text-primary underline" href="mailto:muathalsalhi775089399@gmail.com">muathalsalhi775089399@gmail.com</a>

        <h2 className="mt-8 text-xl font-bold">{t("7. تحديثات السياسة", "7. Policy updates")}</h2>
        <p>{t(
          "قد نحدّث هذه السياسة عند إضافة ميزات أو خدمات جديدة. سننشر النسخة الأحدث في هذه الصفحة مع تحديث تاريخ المراجعة.",
          "We may update this policy when new features or services are introduced. The latest version will be published on this page with a revised date."
        )}</p>
      </article>
    </main>
  );
}
