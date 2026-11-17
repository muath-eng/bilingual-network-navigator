import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ccnaDomains, lessons } from "@/lib/content";
import { useLang, useProgress } from "@/lib/i18n";

const networkDescription =
  "تعرف على شبكة الحاسوب من الصفر: تعريف الشبكة وطريقة عملها وأنواع LAN وWAN ومكونات الشبكات والفرق بين الراوتر والسويتش مع أمثلة واختبار مجاني.";

export const Route = createFileRoute("/learn/$id")({
  staticData: { sitemap: true },
  loader: ({ params }) => {
    const lesson = lessons.find((l) => l.id === params.id);
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => {
    const lesson = loaderData?.lesson;
    const isBasics = lesson?.id === "what-is-network";
    const isIpAddressing = lesson?.id === "ip-addressing";
    const lessonSummary = lesson?.bodyAr.slice(0, 2).join(" ").replace(/\\s+/g, " ").trim();
    const description = isBasics
      ? networkDescription
      : isIpAddressing
        ? "شرح عناوين IPv4 وSubnet Mask وCIDR وتقسيم الشبكات Subnetting مع أمثلة محلولة وحساب عدد الأجهزة ونطاق العناوين، وتدريب عملي مجاني."
        : lesson
          ? `${lesson.titleAr}: ${lessonSummary}`.slice(0, 155).replace(/[،,؛;:.!?؟\\s]+$/, "")
          : "درس تفاعلي لتعلم الشبكات بالعربية والإنجليزية على Network Master.";
    const canonical = lesson
      ? `https://alsalhi-network-master.lovable.app/learn/${lesson.id}`
      : "https://alsalhi-network-master.lovable.app/learn";
    const title = isBasics
      ? "ما هي شبكة الحاسوب؟ تعريفها وأنواعها ومكوناتها | Network Master"
      : isIpAddressing
        ? "شرح IP Address وSubnet Mask وتقسيم الشبكات Subnetting | Network Master"
        : lesson
          ? `${lesson.titleAr} — شرح مبسط واختبار | Network Master`
          : "دروس الشبكات — Network Master";
    return {
      links: [{ rel: "canonical", href: canonical }],
      meta: [
        { property: "og:url", content: canonical },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:type", content: "article" },
        { property: "og:description", content: description },
        { property: "og:site_name", content: "Network Master" },
        { property: "og:locale", content: "ar_QA" },
        {
          property: "og:image",
          content: "https://alsalhi-network-master.lovable.app/network-master-social.svg",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:image",
          content: "https://alsalhi-network-master.lovable.app/network-master-social.svg",
        },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      scripts: lesson
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: title,
                description,
                inLanguage: "ar",
                mainEntityOfPage: canonical,
                publisher: {
                  "@type": "Organization",
                  name: "Network Master",
                  url: "https://alsalhi-network-master.lovable.app/",
                },
                isPartOf: {
                  "@type": "Course",
                  name: "تعلم الشبكات وCCNA بالعربية",
                  url: "https://alsalhi-network-master.lovable.app/learn",
                },
              }),
            },
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "الرئيسية",
                    item: "https://alsalhi-network-master.lovable.app/",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "دروس الشبكات",
                    item: "https://alsalhi-network-master.lovable.app/learn",
                  },
                  { "@type": "ListItem", position: 3, name: lesson.titleAr, item: canonical },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lesson } = Route.useLoaderData();
  const { t, lang } = useLang();
  const { done, mark } = useProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const score = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[idx + 1];
  const relatedLessons = lessons
    .filter(
      (candidate) =>
        candidate.id !== lesson.id &&
        candidate.id !== next?.id &&
        (lesson.domain ? candidate.domain === lesson.domain : candidate.level === lesson.level),
    )
    .slice(0, 3);
  const domain = lesson.domain ? ccnaDomains.find((item) => item.id === lesson.domain) : undefined;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/learn" className="text-sm text-muted-foreground hover:text-primary">
        ← {t("الدروس", "Lessons")}
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{t(lesson.titleAr, lesson.titleEn)}</h1>
      {domain && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
            {domain.version} · {t(domain.ar, domain.en)} · {domain.weight}%
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-muted-foreground">
            {t("أهداف الاختبار", "Exam objectives")}: {lesson.objective}
          </span>
        </div>
      )}
      <div className="mt-6 space-y-4 text-lg leading-relaxed">
        {(lang === "ar" ? lesson.bodyAr : lesson.bodyEn).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {lesson.id === "what-is-network" && <NetworkBasicsSupplement />}
      {lesson.id === "ip-addressing" && <IpAddressingSupplement />}
      <section className="mt-10 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-semibold">{t("اختبر نفسك", "Quick quiz")}</h2>
        {lesson.quiz.map((q, i) => (
          <div key={i} className="mt-5">
            <p className="font-medium">{t(q.qAr, q.qEn)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.options.map((o, j) => {
                const sel = answers[i] === j;
                const state = checked
                  ? j === q.answer
                    ? "border-primary bg-primary/15"
                    : sel
                      ? "border-destructive bg-destructive/15"
                      : "border-border"
                  : sel
                    ? "border-primary"
                    : "border-border";
                return (
                  <button
                    key={j}
                    onClick={() => !checked && setAnswers({ ...answers, [i]: j })}
                    className={`rounded-lg border px-4 py-2 ${state}`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-6 flex items-center gap-4">
          {!checked ? (
            <button
              disabled={Object.keys(answers).length < lesson.quiz.length}
              onClick={() => {
                setChecked(true);
                window.__lovableEvents?.track?.("project.quiz_submitted", {
                  lesson_id: lesson.id,
                  score,
                  question_count: lesson.quiz.length,
                  passed: score === lesson.quiz.length,
                });
                if (score === lesson.quiz.length) {
                  mark(lesson.id);
                  if (!done.includes(lesson.id)) {
                    window.__lovableEvents?.track?.("project.lesson_completed", {
                      lesson_id: lesson.id,
                    });
                  }
                }
              }}
              className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-40"
            >
              {t("تحقق", "Check")}
            </button>
          ) : (
            <>
              <span className="font-mono">
                {score}/{lesson.quiz.length}
              </span>
              {score === lesson.quiz.length ? (
                <span className="text-primary">
                  {t("ممتاز! تم إكمال الدرس ✓", "Great! Lesson completed ✓")}
                </span>
              ) : (
                <button
                  onClick={() => {
                    setChecked(false);
                    setAnswers({});
                  }}
                  className="underline"
                >
                  {t("حاول مجدداً", "Try again")}
                </button>
              )}
            </>
          )}
        </div>
      </section>
      {next && (
        <Link
          to="/learn/$id"
          params={{ id: next.id }}
          onClick={() =>
            window.__lovableEvents?.track?.("project.lesson_started", { lesson_id: next.id })
          }
          className="mt-6 inline-block text-primary hover:underline"
        >
          {t("الدرس التالي:", "Next:")} {t(next.titleAr, next.titleEn)} →
        </Link>
      )}
      {relatedLessons.length > 0 && (
        <section className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">
            {t("دروس مرتبطة بهذا الموضوع", "Related networking lessons")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "تابع هذه الدروس لفهم الموضوع بصورة أعمق وربط المفاهيم ببعضها.",
              "Continue with these lessons to build a deeper, connected understanding.",
            )}
          </p>
          <ul className="mt-4 grid gap-2">
            {relatedLessons.map((related) => (
              <li key={related.id}>
                <Link
                  to="/learn/$id"
                  params={{ id: related.id }}
                  className="block rounded-lg border border-border px-4 py-3 font-medium hover:border-primary hover:text-primary"
                >
                  {t(related.titleAr, related.titleEn)} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function IpAddressingSupplement() {
  const { t } = useLang();

  return (
    <article className="mt-10 space-y-8 leading-8">
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("ما هو عنوان IPv4؟", "What is an IPv4 address?")}
        </h2>
        <p className="mt-3">
          {t(
            "عنوان IPv4 هو معرّف منطقي من 32 بت يُكتب عادةً بأربع خانات عشرية تفصل بينها نقاط، مثل 192.168.10.25. كل خانة تمثل 8 بت وتتراوح قيمتها من 0 إلى 255. يستخدم الجهاز العنوان لمعرفة مصدر الحزم ووجهتها داخل الشبكات.",
            "An IPv4 address is a 32-bit logical identifier, usually written as four decimal octets separated by dots, such as 192.168.10.25. Each octet represents 8 bits and ranges from 0 to 255. Devices use addresses to identify packet sources and destinations.",
          )}
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("ما وظيفة Subnet Mask؟", "What does a subnet mask do?")}
        </h2>
        <p className="mt-3">
          {t(
            "قناع الشبكة يحدد أي بتات تنتمي إلى جزء الشبكة وأيها مخصصة للأجهزة. في الشبكة 192.168.10.0/24 يكون القناع 255.255.255.0؛ أول 24 بت للشبكة والـ8 بت المتبقية للأجهزة. الرمز /24 يسمى CIDR Prefix Length.",
            "A subnet mask identifies which bits belong to the network portion and which are available for hosts. In 192.168.10.0/24, the mask is 255.255.255.0: the first 24 bits identify the network and the remaining 8 bits are for hosts. The /24 notation is the CIDR prefix length.",
          )}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-start text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3">{t("البادئة", "Prefix")}</th>
                <th className="p-3">{t("قناع الشبكة", "Subnet mask")}</th>
                <th className="p-3">{t("الأجهزة المعتادة", "Usable hosts")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["/24", "255.255.255.0", "254"],
                ["/25", "255.255.255.128", "126"],
                ["/26", "255.255.255.192", "62"],
                ["/27", "255.255.255.224", "30"],
                ["/28", "255.255.255.240", "14"],
                ["/30", "255.255.255.252", "2"],
              ].map(([prefix, mask, hosts]) => (
                <tr key={prefix} className="border-t border-border">
                  <td className="p-3 font-mono">{prefix}</td>
                  <td className="p-3 font-mono" dir="ltr">
                    {mask}
                  </td>
                  <td className="p-3">{hosts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          {t(
            "الأعداد أعلاه للشبكات التقليدية التي تحجز عنوان الشبكة والبث؛ توجد استثناءات مثل /31 لوصلات point-to-point وفق RFC 3021.",
            "Host counts above follow the traditional convention of reserving network and broadcast addresses; /31 point-to-point links are a special case defined by RFC 3021.",
          )}
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("كيف نحسب عدد الأجهزة؟", "How do you calculate usable hosts?")}
        </h2>
        <p className="mt-3">
          {t(
            "في IPv4، عدد بتات الأجهزة يساوي 32 ناقص طول البادئة. في الشبكات التقليدية نحسب عدد العناوين القابلة للاستخدام بالمعادلة: 2 مرفوعة لعدد بتات الأجهزة، ثم نطرح 2 لعنوان الشبكة وعنوان البث.",
            "For IPv4, the number of host bits is 32 minus the prefix length. Under the traditional subnetting convention, usable hosts equal 2 raised to the number of host bits, minus 2 for the network and broadcast addresses.",
          )}
        </p>
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="font-semibold">{t("مثال: شبكة /26", "Example: a /26 network")}</p>
          <p className="mt-2 font-mono text-sm" dir="ltr">
            32 - 26 = 6 host bits
          </p>
          <p className="font-mono text-sm" dir="ltr">
            2⁶ - 2 = 62 usable hosts
          </p>
          <p className="mt-2 text-sm">
            {t(
              "إذن الشبكة /26 تحتوي 64 عنواناً إجمالياً، منها 62 عنواناً تقليدياً للأجهزة.",
              "A /26 subnet contains 64 total addresses, with 62 traditionally usable by hosts.",
            )}
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("مثال محلول على Subnetting", "Worked subnetting example")}
        </h2>
        <p className="mt-3">
          {t(
            "لدينا العنوان 192.168.10.70/26. حجم الكتلة في الخانة الأخيرة هو 256 ناقص 192، أي 64. لذلك تبدأ الشبكات عند 0 ثم 64 ثم 128 ثم 192. يقع الرقم 70 ضمن المجال من 64 إلى 127.",
            "Consider 192.168.10.70/26. The block size in the final octet is 256 minus 192, which equals 64. Subnets therefore start at 0, 64, 128 and 192. The value 70 belongs to the 64–127 block.",
          )}
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-start text-sm">
            <tbody>
              {[
                [t("عنوان الشبكة", "Network address"), "192.168.10.64"],
                [t("أول عنوان جهاز", "First usable host"), "192.168.10.65"],
                [t("آخر عنوان جهاز", "Last usable host"), "192.168.10.126"],
                [t("عنوان البث", "Broadcast address"), "192.168.10.127"],
                [t("القناع", "Subnet mask"), "255.255.255.192"],
                [t("عدد الأجهزة", "Usable hosts"), "62"],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <th className="p-3 text-start font-medium">{label}</th>
                  <td className="p-3 font-mono" dir="ltr">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("متى نحتاج إلى تقسيم الشبكة؟", "Why subnet a network?")}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-6">
          <li>
            {t(
              "توزيع العناوين بما يناسب عدد الأجهزة في كل قسم.",
              "Allocate address space according to each department's host count.",
            )}
          </li>
          <li>
            {t(
              "تقليل نطاقات البث وتنظيم الشبكات الكبيرة.",
              "Reduce broadcast domains and organize larger networks.",
            )}
          </li>
          <li>
            {t(
              "فصل الأقسام وتطبيق سياسات التوجيه والتحكم بالوصول.",
              "Separate departments and apply routing and access-control policies.",
            )}
          </li>
          <li>
            {t(
              "تسهيل التوثيق واستكشاف أعطال الاتصال.",
              "Make documentation and connectivity troubleshooting easier.",
            )}
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("أخطاء شائعة عند حساب Subnetting", "Common subnetting mistakes")}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-6">
          <li>
            {t(
              "الخلط بين عدد العناوين الكلي وعدد عناوين الأجهزة القابلة للاستخدام.",
              "Confusing total addresses with usable host addresses.",
            )}
          </li>
          <li>
            {t(
              "اختيار عنوان الشبكة أو البث لجهاز نهائي في الشبكات التقليدية.",
              "Assigning the network or broadcast address to an end device under the traditional model.",
            )}
          </li>
          <li>
            {t(
              "استخدام قناع مختلف بين أجهزة يفترض أنها في الشبكة الفرعية نفسها.",
              "Using inconsistent subnet masks among devices expected to share a subnet.",
            )}
          </li>
          <li>
            {t(
              "نسيان ضبط البوابة الافتراضية عند الحاجة إلى الوصول لشبكات أخرى.",
              "Forgetting the default gateway when communication with other networks is required.",
            )}
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-xl font-semibold">
          {t("طبّق بنفسك: حاسبة الشبكات الفرعية", "Practice: subnet calculator")}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {t(
            "بعد فهم المثال، أدخل عنوان IP والبادئة في الحاسبة لمعرفة عنوان الشبكة والبث ونطاق الأجهزة. جرّب 192.168.10.70/26 وتحقق من مطابقة النتائج للجدول أعلاه.",
            "After studying the example, enter an IP address and prefix in the calculator to find the network, broadcast and host range. Try 192.168.10.70/26 and compare the results with the table above.",
          )}
        </p>
        <Link
          to="/subnet"
          className="mt-4 inline-flex rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          {t("افتح حاسبة Subnetting", "Open subnet calculator")} →
        </Link>
      </section>
    </article>
  );
}

function NetworkBasicsSupplement() {
  const { t } = useLang();
  return (
    <article className="mt-10 space-y-8 leading-8">
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("ما المقصود بشبكة الحاسوب؟", "What is a computer network?")}
        </h2>
        <p className="mt-3">
          {t(
            "شبكة الحاسوب هي اتصال بين جهازين أو أكثر لتبادل البيانات ومشاركة الموارد وفق قواعد تسمى بروتوكولات. يمكن أن يكون الاتصال عبر كابل Ethernet أو لاسلكياً باستخدام Wi‑Fi. وقد تضم الشبكة حواسيب وهواتف وطابعات وخوادم وكاميرات وأجهزة ذكية.",
            "A computer network connects two or more devices to exchange data and share resources using rules called protocols. Devices may connect through Ethernet cables or wirelessly over Wi‑Fi. A network can include computers, phones, printers, servers, cameras and smart devices.",
          )}
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("مثال مرئي لشبكة منزلية", "A visual example of a home network")}
        </h2>
        <p className="mt-3">
          {t(
            "يتصل الهاتف والحاسوب والتلفاز بنقطة الوصول أو السويتش، ويربط الراوتر الشبكة المحلية بالإنترنت عبر مزود الخدمة.",
            "Phones, computers and televisions connect to an access point or switch; the router connects the local network to the Internet provider.",
          )}
        </p>
        <figure
          role="img"
          aria-label={t(
            "الإنترنت متصل بالراوتر ثم بالسويتش أو نقطة الوصول ومنها إلى الحاسوب والهاتف والطابعة.",
            "Internet connects to a router, then a switch or access point, then computers, phones and printers.",
          )}
          className="mt-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-full max-w-xs rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 font-semibold">
              {t("الإنترنت", "Internet")}
            </div>
            <span aria-hidden="true">↕</span>
            <div className="w-full max-w-xs rounded-lg border border-border px-4 py-3 font-semibold">
              {t("الراوتر", "Router")}
            </div>
            <span aria-hidden="true">↕</span>
            <div className="w-full max-w-xs rounded-lg border border-border px-4 py-3 font-semibold">
              {t("السويتش أو نقطة الوصول", "Switch or access point")}
            </div>
            <span aria-hidden="true">↙ ↓ ↘</span>
            <div className="grid w-full grid-cols-3 gap-2 text-sm">
              {[t("حاسوب", "Computer"), t("هاتف", "Phone"), t("طابعة", "Printer")].map((device) => (
                <div key={device} className="rounded-lg bg-secondary px-2 py-3 font-medium">
                  {device}
                </div>
              ))}
            </div>
          </div>
          <figcaption className="mt-3 text-center text-xs text-muted-foreground">
            {t(
              "رسم تعليمي مبسط، وقد يختلف ترتيب الأجهزة حسب تصميم الشبكة.",
              "A simplified teaching diagram; actual network layouts vary.",
            )}
          </figcaption>
        </figure>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("لماذا نستخدم الشبكات؟", "Why do we use networks?")}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-6">
          <li>
            {t("مشاركة الملفات والطابعات ووحدات التخزين.", "Share files, printers and storage.")}
          </li>
          <li>
            {t(
              "الوصول إلى الإنترنت والخدمات والتطبيقات المركزية.",
              "Access the Internet and centrally hosted services.",
            )}
          </li>
          <li>
            {t(
              "تسهيل إدارة الأجهزة والنسخ الاحتياطي والصلاحيات.",
              "Simplify device management, backups and permissions.",
            )}
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("المكونات الأساسية للشبكة", "Core network components")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            [
              t("الأجهزة الطرفية", "End devices"),
              t(
                "حواسيب وهواتف وخوادم وطابعات ترسل البيانات أو تستقبلها.",
                "Computers, phones, servers and printers that send or receive data.",
              ),
            ],
            [
              t("بطاقة الشبكة", "Network interface"),
              t(
                "واجهة سلكية أو لاسلكية تمكّن الجهاز من الاتصال.",
                "A wired or wireless interface that connects a device.",
              ),
            ],
            [
              t("السويتش", "Switch"),
              t(
                "يربط الأجهزة داخل LAN ويمرر إطارات Ethernet اعتماداً على MAC.",
                "Connects LAN devices and forwards Ethernet frames using MAC addresses.",
              ),
            ],
            [
              t("الراوتر", "Router"),
              t(
                "يربط شبكات IP مختلفة ويوجه الحزم بينها.",
                "Connects different IP networks and routes packets between them.",
              ),
            ],
            [
              t("وسائط النقل", "Transmission media"),
              t(
                "كابلات النحاس والألياف الضوئية وموجات Wi‑Fi.",
                "Copper cables, fiber optics and Wi‑Fi radio waves.",
              ),
            ],
            [
              t("البروتوكولات", "Protocols"),
              t(
                "قواعد الاتصال مثل Ethernet وIP وTCP وUDP وDNS وHTTP.",
                "Communication rules such as Ethernet, IP, TCP, UDP, DNS and HTTP.",
              ),
            ],
          ].map(([heading, detail]) => (
            <div key={heading} className="rounded-xl border border-border p-4">
              <h3 className="font-semibold">{heading}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("أنواع الشبكات حسب النطاق", "Network types by scope")}
        </h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">LAN — {t("شبكة محلية", "Local Area Network")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "تغطي مساحة محدودة مثل المنزل أو المكتب أو معمل المدرسة.",
                "Covers a limited area such as a home, office or school lab.",
              )}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">WLAN — {t("شبكة محلية لاسلكية", "Wireless LAN")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "شبكة محلية تستخدم Wi‑Fi لربط الأجهزة دون كابلات.",
                "A local network that uses Wi‑Fi to connect devices wirelessly.",
              )}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">MAN — {t("شبكة المدن", "Metropolitan Area Network")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "تربط مواقع متعددة ضمن مدينة أو نطاق حضري.",
                "Connects multiple sites across a city or metropolitan area.",
              )}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">WAN — {t("شبكة واسعة النطاق", "Wide Area Network")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "تربط شبكات متباعدة بين مدن أو دول؛ والإنترنت أشهر مثال عالمي.",
                "Connects networks across cities or countries; the Internet is the best-known global example.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("الفرق بين الراوتر والسويتش", "Router vs. switch")}
        </h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[18rem] text-start text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="p-3">{t("الجهاز", "Device")}</th>
                <th className="p-3">{t("الوظيفة", "Role")}</th>
                <th className="p-3">{t("النطاق", "Scope")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <th className="p-3">Switch</th>
                <td className="p-3">
                  {t("تمرير إطارات Ethernet باستخدام MAC.", "Forwards Ethernet frames using MAC.")}
                </td>
                <td className="p-3">{t("داخل الشبكة المحلية.", "Within a LAN.")}</td>
              </tr>
              <tr className="border-t border-border">
                <th className="p-3">Router</th>
                <td className="p-3">
                  {t("توجيه حزم IP بين الشبكات.", "Routes IP packets between networks.")}
                </td>
                <td className="p-3">{t("بين شبكات مختلفة.", "Between different networks.")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("كيف تنتقل البيانات؟", "How does data travel?")}
        </h2>
        <ol className="mt-3 list-decimal space-y-2 ps-6">
          <li>
            {t(
              "ينشئ التطبيق البيانات، مثل رسالة أو طلب فتح موقع.",
              "An application creates data, such as a message or web request.",
            )}
          </li>
          <li>
            {t(
              "تجهّز البيانات للإرسال وفق بروتوكولات الاتصال.",
              "Data is prepared for transmission according to network protocols.",
            )}
          </li>
          <li>
            {t(
              "تنقل وسيلة الاتصال الإشارات إلى الجهاز التالي.",
              "The transmission medium carries signals to the next device.",
            )}
          </li>
          <li>
            {t(
              "يمرر السويتش الحركة محلياً، ويوجه الراوتر الحزم إلى الشبكات الأخرى.",
              "A switch forwards local traffic; a router routes packets to other networks.",
            )}
          </li>
          <li>
            {t(
              "يستقبل الجهاز الهدف البيانات ويقدمها للتطبيق المناسب.",
              "The destination device receives the data and delivers it to the application.",
            )}
          </li>
        </ol>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("السلكية أم اللاسلكية؟", "Wired or wireless?")}
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">Ethernet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "اتصال ثابت غالباً وزمن تأخير منخفض، لكنه يحتاج إلى كابلات.",
                "Usually stable with low latency, but requires cables.",
              )}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="font-semibold">Wi‑Fi</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t(
                "يوفر حرية الحركة، لكن الأداء يتأثر بالمسافة والعوائق والتداخل.",
                "Provides mobility, but performance can be affected by distance, obstacles and interference.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("مثال عملي: شبكة منزلية", "Practical example: a home network")}
        </h2>
        <p className="mt-3">
          {t(
            "لنفترض أن الراوتر عنوانه 192.168.1.1 وأن الهاتف والحاسوب متصلان به. يحصل كل جهاز غالباً على عنوان IP تلقائياً عبر DHCP. عندما يفتح الحاسوب موقعاً، يرسل الحركة إلى البوابة الافتراضية (الراوتر)، الذي يوجهها إلى مزود الخدمة. ويمكن للأجهزة مشاركة طابعة أو ملفات محلياً وفق الصلاحيات.",
            "Suppose the router is 192.168.1.1 and a phone and computer are connected. Each device usually receives an IP address automatically through DHCP. When the computer opens a website, it sends traffic to its default gateway (the router), which forwards it to the provider. Devices may also share a printer or files locally, subject to permissions.",
          )}
        </p>
      </section>
      <section>
        <h2 className="font-display text-2xl font-bold">
          {t("أساسيات حماية الشبكة", "Network security basics")}
        </h2>
        <ul className="mt-3 list-disc space-y-2 ps-6">
          <li>
            {t(
              "غيّر كلمة مرور إدارة الراوتر الافتراضية.",
              "Change the router's default administrator password.",
            )}
          </li>
          <li>
            {t(
              "استخدم تشفير Wi‑Fi مثل WPA2-AES أو WPA3 عند توفره.",
              "Use Wi‑Fi encryption such as WPA2-AES or WPA3 when available.",
            )}
          </li>
          <li>
            {t("حدّث البرامج الثابتة والأجهزة بانتظام.", "Update firmware and devices regularly.")}
          </li>
          <li>
            {t(
              "استخدم شبكة ضيوف منفصلة عند الحاجة ولا تشارك بيانات الدخول.",
              "Use a separate guest network when appropriate and do not share credentials.",
            )}
          </li>
        </ul>
      </section>
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-2xl font-bold">
          {t("أسئلة شائعة عن شبكات الحاسوب", "Computer networking FAQs")}
        </h2>
        <div className="mt-4 space-y-5">
          <div>
            <h3 className="font-semibold">
              {t(
                "هل الإنترنت هو نفسه شبكة الحاسوب؟",
                "Is the Internet the same as a computer network?",
              )}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "لا. قد تكون الشبكة محلية وغير متصلة بالإنترنت، أما الإنترنت فهو شبكة عالمية تربط شبكات كثيرة.",
                "No. A network can be local and offline; the Internet is a global network connecting many networks.",
              )}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              {t("هل تعمل الشبكة المحلية دون إنترنت؟", "Can a LAN work without Internet?")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "نعم، يمكن للأجهزة تبادل الملفات والطباعة محلياً إذا كانت الشبكة معدّة لذلك.",
                "Yes. Devices can share files and printers locally when configured to do so.",
              )}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              {t("ما الفرق بين LAN وWAN؟", "What is the difference between LAN and WAN?")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "LAN تغطي مساحة محدودة، بينما WAN تربط شبكات عبر مسافات جغرافية كبيرة.",
                "A LAN covers a limited area; a WAN connects networks across large distances.",
              )}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">
              {t(
                "هل الراوتر والسويتش يؤديان الوظيفة نفسها؟",
                "Do routers and switches do the same job?",
              )}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "لا. السويتش يربط الأجهزة داخل LAN، والراوتر يوجه الحزم بين شبكات IP مختلفة.",
                "No. A switch connects devices within a LAN; a router routes packets between IP networks.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <h2 className="font-display text-xl font-bold">
          {t("تابع التعلم بالتطبيق", "Continue learning by doing")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "انتقل إلى نموذج OSI، ثم جرّب تقسيم الشبكات وبناء طوبولوجيا بنفسك. جميع الدروس والأدوات مجانية.",
            "Continue to the OSI model, then practise subnetting and build a topology yourself. All lessons and tools are free.",
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
          <Link
            to="/learn/$id"
            params={{ id: "osi-model" }}
            className="text-primary hover:underline"
          >
            {t("نموذج OSI", "OSI model")} →
          </Link>
          <Link to="/subnet" className="text-primary hover:underline">
            {t("حاسبة تقسيم الشبكات", "Subnet calculator")} →
          </Link>
          <Link to="/lab" className="text-primary hover:underline">
            {t("مختبر الشبكات", "Network lab")} →
          </Link>
        </div>
      </section>
    </article>
  );
}
