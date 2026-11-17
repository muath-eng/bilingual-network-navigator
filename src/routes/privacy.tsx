import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  staticData: { sitemap: true },
  head: () => ({
    links: [{ rel: "canonical", href: "https://alsalhi-network-master.lovable.app/privacy" }],
    meta: [
      { title: "سياسة الخصوصية | Network Master" },
      { name: "description", content: "تعرف على البيانات التي تستخدمها منصة Network Master وكيفية تخزينها وحمايتها وحقوق المستخدم." },
      { property: "og:title", content: "سياسة الخصوصية | Network Master" },
      { property: "og:url", content: "https://alsalhi-network-master.lovable.app/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <article className="rounded-2xl border border-border bg-card p-6 md:p-10">
        <p className="font-mono text-xs tracking-widest text-primary">NETWORK MASTER / PRIVACY</p>
        <h1 className="mt-3 font-display text-3xl font-bold">{t("سياسة الخصوصية", "Privacy Policy")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("آخر تحديث: 17 نوفمبر 2026", "Last updated: November 17, 2026")}</p>
        <div className="mt-8 space-y-7 leading-8 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("1. من نحن", "1. Who we are")}</h2>
            <p>{t("Network Master منصة تعليمية مستقلة لتعلم أساسيات شبكات الحاسوب ومفاهيم CCNA وCisco وMikroTik. للاستفسارات المتعلقة بالخصوصية يمكنك التواصل عبر البريد الموضح في أسفل هذه الصفحة.", "Network Master is an independent educational platform for computer networking fundamentals and Cisco, CCNA and MikroTik learning. For privacy questions, contact us using the email at the bottom of this page.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("2. البيانات التي قد نجمعها", "2. Information we may collect")}</h2>
            <ul className="list-disc space-y-2 ps-6">
              <li>{t("بيانات الحساب التي تقدمها عند التسجيل، مثل البريد الإلكتروني والاسم المعروض.", "Account details you provide when registering, such as your email address and display name.")}</li>
              <li>{t("بيانات الملف التعليمي، مثل هدف التعلم والهدف الأسبوعي وتقدم إكمال الدروس، عند استخدام الحساب.", "Learning profile information such as your learning goal, weekly target and lesson-completion progress when you use an account.")}</li>
              <li>{t("إعدادات تحفظ محلياً في متصفحك، مثل اللغة والملف الشخصي والتقدم، وقد تشمل نسخة احتياطية تنشئها بنفسك.", "Settings stored locally in your browser, such as language, profile and progress; you may also create your own backup file.")}</li>
              <li>{t("معلومات تقنية أساسية قد يعالجها مزود الاستضافة عند زيارة الموقع، مثل عنوان IP ونوع المتصفح وسجلات الخادم لأغراض التشغيل والأمان.", "Basic technical information that the hosting provider may process when you visit, such as IP address, browser type and server logs for operation and security.")}</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("3. كيف نستخدم البيانات", "3. How we use information")}</h2>
            <p>{t("نستخدم البيانات لإنشاء الحساب وتسجيل الدخول، وحفظ الملف التعليمي والتقدم ومزامنتهما، وتشغيل ميزات المنصة، وحماية الخدمة ومعالجة الأعطال. لا نطلب منك إدخال كلمات مرور أجهزة الشبكات أو بيانات حساسة داخل التمارين.", "We use information to create accounts and sign users in, save and sync learning profiles and progress, operate platform features, secure the service and troubleshoot issues. Do not enter network-device passwords or sensitive credentials into exercises.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("4. التخزين ومقدمو الخدمات", "4. Storage and service providers")}</h2>
            <p>{t("تستخدم المنصة Supabase لخدمات المصادقة وقاعدة البيانات ومزامنة بعض بيانات الحساب والتقدم. كما تُستضاف المنصة عبر مزود استضافة الموقع. قد يعالج هؤلاء المزودون البيانات بالقدر اللازم لتقديم خدماتهم وفق سياساتهم وشروطهم.", "The platform uses Supabase for authentication, database services and syncing some account and learning-progress data. The website is also hosted by a hosting provider. These providers may process information as needed to deliver their services under their own terms and policies.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("5. ملفات تعريف الارتباط والإعلانات", "5. Cookies and advertising")}</h2>
            <p>{t("قد تستخدم المنصة ملفات تخزين محلية لحفظ تفضيلاتك وتقدمك. إذا فُعّلت إعلانات Google AdSense مستقبلاً، فقد تستخدم Google وشركاؤها ملفات تعريف الارتباط أو تقنيات مشابهة لعرض الإعلانات وقياسها وتخصيصها وفق إعداداتك والقوانين المعمول بها. سنحدّث هذه السياسة عند تفعيل الإعلانات ونوفر آليات الموافقة المطلوبة بحسب المنطقة.", "The platform may use local browser storage to remember your preferences and progress. If Google AdSense ads are enabled in the future, Google and its partners may use cookies or similar technologies to serve, measure and personalize ads according to your settings and applicable laws. We will update this policy when ads are enabled and provide consent mechanisms required for the relevant regions.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("6. مشاركة البيانات", "6. Sharing information")}</h2>
            <p>{t("لا نبيع بياناتك الشخصية. قد تتم معالجة البيانات لدى مزودي الخدمات المذكورين، أو الإفصاح عنها إذا تطلب القانون ذلك أو لحماية أمن المنصة وحقوق مستخدميها.", "We do not sell your personal information. Information may be processed by the service providers described above, or disclosed when legally required or necessary to protect the platform and its users.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("7. الاحتفاظ بالبيانات والتحكم فيها", "7. Data retention and your choices")}</h2>
            <p>{t("يمكنك التوقف عن استخدام الموقع ومسح بيانات المتصفح المحلية من إعدادات جهازك. قد تبقى بيانات الحساب التي خُزنت لدى مزودي الخدمة حتى تُحذف وفق الإجراءات المتاحة لديهم. لطلب المساعدة بشأن بيانات الحساب، تواصل معنا من البريد المرتبط بالحساب.", "You can stop using the site and clear local browser data through your device settings. Account data stored with service providers may remain until deleted through the procedures they make available. To request help with account data, contact us from the email associated with your account.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("8. خصوصية الأطفال", "8. Children's privacy")}</h2>
            <p>{t("المنصة موجهة للتعلم العام وليست مصممة لجمع بيانات الأطفال دون السن المسموح به قانوناً دون موافقة ولي الأمر. إذا اعتقدت أن طفلاً قدم بيانات شخصية بشكل غير مناسب، يرجى التواصل معنا.", "The platform is intended for general learning and is not designed to collect personal information from children below the applicable age without parental consent. If you believe a child has provided personal information inappropriately, please contact us.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("9. تحديثات السياسة", "9. Policy updates")}</h2>
            <p>{t("قد نحدّث هذه السياسة عند إضافة ميزات أو خدمات جديدة. سننشر النسخة المعدلة في هذه الصفحة مع تحديث تاريخ المراجعة.", "We may update this policy when new features or services are added. The revised version will be posted on this page with an updated review date.")}</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-foreground">{t("10. التواصل", "10. Contact")}</h2>
            <p>{t("للاستفسارات والطلبات المتعلقة بالخصوصية:", "For privacy questions and requests:")}</p>
            <a className="font-medium text-primary underline" href="mailto:muathalsalhi775089399@gmail.com" dir="ltr">muathalsalhi775089399@gmail.com</a>
          </section>
        </div>
      </article>
    </main>
  );
}
