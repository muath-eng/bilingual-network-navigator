import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Award, Printer, RefreshCw } from "lucide-react";
import { lessons } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/exam")({
  head: () => ({
    meta: [
      { title: "Practice Exam & Certificate — Network Master" },
      {
        name: "description",
        content:
          "Take a bilingual networking practice exam and earn a course completion certificate.",
      },
    ],
  }),
  component: ExamPage,
});
function ExamPage() {
  const { t, lang } = useLang();
  const questions = useMemo(
    () =>
      lessons
        .flatMap((l) =>
          (Array.isArray(l.quiz) ? l.quiz : [])
            .filter(
              (q) =>
                q &&
                typeof q.qAr === "string" &&
                typeof q.qEn === "string" &&
                Array.isArray(q.options) &&
                q.options.length > 1 &&
                Number.isInteger(q.answer) &&
                q.answer >= 0 &&
                q.answer < q.options.length,
            )
            .map((q, i) => ({
              id: l.id + "-" + i,
              lesson: l.titleAr,
              lessonEn: l.titleEn,
              ...q,
            })),
        )
        .slice(0, 30),
    [],
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [student, setStudent] = useState("");
  const [certId, setCertId] = useState("");
  const score = questions.filter((q) => answers[q.id] === q.answer).length;
  const pct = Math.round((score / Math.max(questions.length, 1)) * 100);
  const progress = questions.length
    ? (Object.keys(answers).length / questions.length) * 100
    : 0;
  const passed = submitted && pct >= 70;
  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setCertId("");
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">
        {t("الاختبار التجريبي الشامل", "Comprehensive Practice Exam")}
      </h1>
      <p className="mt-2 leading-7 text-muted-foreground">
        {t(
          "اختبر معلوماتك في أساسيات الشبكات وموضوعات CCNA. يتكون الاختبار من أسئلة مختارة من الدروس المتاحة. النجاح التدريبي يبدأ من 70%.",
          "Assess your networking and CCNA knowledge. Questions are drawn from the available lessons. The practice pass mark is 70%.",
        )}
      </p>
      {!submitted ? (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <span className="font-semibold">
              {questions.length} {t("سؤالاً", "questions")}
            </span>
            <span className="text-sm text-muted-foreground">
              {Object.keys(answers).length}/{questions.length}{" "}
              {t("تمت الإجابة", "answered")}
            </span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          {questions.length > 0 ? (
            <div className="mt-5 space-y-4">
              {questions.map((q, i) => (
                <section
                  key={q.id}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <p className="font-mono text-xs text-primary">
                    QUESTION {i + 1} / {questions.length}
                  </p>
                  <p className="mt-2 font-semibold">{t(q.qAr, q.qEn)}</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {q.options.map((o, j) => (
                      <button
                        key={j}
                        onClick={() => setAnswers((a) => ({ ...a, [q.id]: j }))}
                        className={`rounded-lg border p-3 text-start text-sm ${
                          answers[q.id] === j
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-xl border border-border bg-card p-5 text-muted-foreground">
              {t(
                "لا توجد أسئلة صالحة حالياً. يرجى مراجعة محتوى الدروس.",
                "No valid questions are available yet. Please review the lesson content.",
              )}
            </p>
          )}
          <button
            disabled={
              questions.length === 0 ||
              Object.keys(answers).length !== questions.length
            }
            onClick={() => setSubmitted(true)}
            className="mt-6 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground disabled:opacity-40"
          >
            {t("إنهاء الاختبار وعرض النتيجة", "Submit exam and view result")}
          </button>
        </>
      ) : (
        <>
          <section className="mt-6 rounded-xl border border-border bg-card p-6 text-center">
            <Award className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">{t("نتيجتك", "Your result")}</p>
            <p className="mt-1 font-mono text-4xl font-bold">
              {score}/{questions.length}
            </p>
            <p className="mt-2 text-xl font-semibold">{pct}%</p>
            <p className="mt-2 font-semibold">
              {passed
                ? t("اجتزت الاختبار التدريبي!", "Practice exam passed!")
                : t(
                    "لم تصل إلى درجة النجاح بعد. راجع الدروس وحاول مجدداً.",
                    "Not passed yet. Review the lessons and try again.",
                  )}
            </p>
          </section>
          {passed && (
            <section className="print-certificate mt-6 rounded-xl border-2 border-primary bg-card p-8 text-center">
              <div className="text-xs font-mono tracking-[.25em] text-primary">
                NETWORK MASTER · CERTIFICATE
              </div>
              <Award className="mx-auto my-4 h-12 w-12 text-primary" />
              <h2 className="font-display text-2xl font-bold">
                {t("شهادة اجتياز اختبار تدريبي", "Practice Exam Achievement Certificate")}
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("تشهد منصة Network Master بأن", "Network Master recognizes that")}
              </p>
              <label className="mx-auto mt-3 block max-w-sm text-start text-sm">
                {t("اسم المتعلم", "Learner name")}
                <input
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  placeholder={t("اكتب اسمك هنا", "Enter your name")}
                  className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-center text-lg font-semibold"
                />
              </label>
              <p className="mt-4">
                {t(
                  "اجتاز الاختبار التجريبي للشبكات بنسبة",
                  "passed the networking practice exam with a score of",
                )}{" "}
                <strong>{pct}%</strong>
              </p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                NM-
                {new Date().toISOString().slice(0, 10).replaceAll("-", "")}-
                {questions.length}-{score}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                {t(
                  "هذه شهادة إنجاز تدريبية صادرة عن المنصة، وليست شهادة Cisco أو اعتماداً مهنياً رسمياً.",
                  "This is a platform-issued learning achievement, not a Cisco certification or formal professional accreditation.",
                )}
              </p>
              <button
                onClick={() => window.print()}
                className="no-print mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground"
              >
                <Printer className="h-4 w-4" />
                {t("طباعة / حفظ PDF", "Print / Save PDF")}
              </button>
            </section>
          )}
          <button
            onClick={reset}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" />
            {t("إعادة الاختبار", "Retake exam")}
          </button>
        </>
      )}
      <div className="mt-8">
        <Link to="/learn" className="text-sm font-semibold text-primary hover:underline">
          {t("العودة إلى الدروس ←", "← Back to lessons")}
        </Link>
      </div>
      <style>{`@media print { body * { visibility: hidden; } .print-certificate, .print-certificate * { visibility: visible; } .print-certificate { position: absolute; inset: 0; width: 100%; border: 2px solid #111; } .no-print { display: none !important; } }`}</style>
    </main>
  );
}
