import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Terminal, RotateCcw, CheckCircle2 } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "CLI Practice — Network Master" },
      { property: "og:title", content: "CLI Practice — Network Master" },
      { property: "og:description", content: "Practice common Cisco IOS networking commands in a guided terminal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        name: "description",
        content: "Practice common Cisco IOS networking commands in a guided terminal.",
      },
    ],
  }),
  component: PracticePage,
});
const tasks = [
  {
    ar: "اعرض ملخص عناوين IP وحالة جميع الواجهات.",
    en: "Show a summary of IP addresses and interface status.",
    cmd: "show ip interface brief",
    hint: "ابدأ بـ show ip ثم interface brief.",
    out: "Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0      192.168.1.1     YES manual up                    up\nGigabitEthernet0/1      unassigned      YES unset  administratively down down",
  },
  {
    ar: "اعرض جدول التوجيه IPv4.",
    en: "Display the IPv4 routing table.",
    cmd: "show ip route",
    hint: "الأمر يبدأ بـ show ip route.",
    out: "Gateway of last resort is 192.168.1.254\nC 192.168.1.0/24 is directly connected, GigabitEthernet0/0\nS* 0.0.0.0/0 [1/0] via 192.168.1.254",
  },
  {
    ar: "اعرض إعدادات VLAN على السويتش.",
    en: "Display VLAN information on the switch.",
    cmd: "show vlan brief",
    hint: "استخدم show vlan brief.",
    out: "VLAN Name                             Status    Ports\n1    default                          active    Gi0/1, Gi0/2\n10   SALES                            active    Gi0/3, Gi0/4\n20   IT                               active    Gi0/5",
  },
  {
    ar: "اعرض جدول عناوين MAC.",
    en: "Display the MAC address table.",
    cmd: "show mac address-table",
    hint: "الأمر يعرض MAC address-table.",
    out: "Vlan    Mac Address       Type        Ports\n10      00aa.11bb.22cc    DYNAMIC     Gi0/3\n20      00dd.33ee.44ff    DYNAMIC     Gi0/5",
  },
  {
    ar: "احفظ الإعدادات الحالية في إعدادات الإقلاع.",
    en: "Save the running configuration to startup configuration.",
    cmd: "copy running-config startup-config",
    hint: "انسخ running-config إلى startup-config.",
    out: "Destination filename [startup-config]?\nBuilding configuration...\n[OK]",
  },
  {
    ar: "اختبر الوصول إلى 8.8.8.8.",
    en: "Test reachability to 8.8.8.8.",
    cmd: "ping 8.8.8.8",
    hint: "استخدم ping متبوعاً بعنوان IP.",
    out: "!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 12/15/20 ms",
  },
];
function PracticePage() {
  const { t } = useLang();
  const [index, setIndex] = useState(0);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const task = tasks[index];
  const submit = () => {
    const ok = command.trim().replace(/\s+/g, " ").toLowerCase() === task.cmd.toLowerCase();
    setFeedback(ok ? "correct" : "wrong");
    setHistory((h) => [
      `R1# ${command}`,
      ok ? task.out : `% Invalid or incomplete command. Hint: ${task.hint}`,
      ...h,
    ]);
  };
  const next = () => {
    setIndex((i) => (i + 1) % tasks.length);
    setCommand("");
    setFeedback(null);
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">
        {t("مختبر أوامر Cisco IOS", "Cisco IOS Command Lab")}
      </h1>
      <p className="mt-2 leading-7 text-muted-foreground">
        {t(
          "تدرب على أوامر شائعة في بيئة تعليمية آمنة. هذه محاكاة تدريبية وليست جهاز Cisco حقيقياً أو مفسراً كاملاً لنظام IOS.",
          "Practice common commands in a safe learning environment. This is a guided trainer, not a real Cisco device or a full IOS interpreter.",
        )}
      </p>
      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-primary">
            TASK {index + 1} / {tasks.length}
          </span>
          <button
            onClick={() => {
              setCommand("");
              setFeedback(null);
              setHistory([]);
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground"
          >
            <RotateCcw className="h-4 w-4" />
            {t("إعادة", "Reset")}
          </button>
        </div>
        <h2 className="mt-3 text-lg font-semibold">{t(task.ar, task.en)}</h2>
        <div className="mt-4 rounded-xl bg-slate-950 p-4 text-green-300" dir="ltr">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Terminal className="h-4 w-4" /> Cisco IOS — Training console
          </div>
          <div className="mt-4 font-mono text-sm">R1# {command}</div>
          <div className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap font-mono text-xs leading-6">
            {history.slice(0, 6).join("\n")}
          </div>
        </div>
        <label className="mt-4 block text-sm font-semibold">
          {t("اكتب الأمر المطلوب", "Enter the command")}
          <input
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setFeedback(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && command.trim()) submit();
            }}
            placeholder="show ip interface brief"
            className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm"
            dir="ltr"
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={submit}
            disabled={!command.trim()}
            className="rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground disabled:opacity-40"
          >
            {t("تنفيذ الأمر", "Run command")}
          </button>
          <button
            onClick={next}
            className="rounded-lg border border-border px-5 py-2 font-semibold hover:bg-secondary"
          >
            {t("المهمة التالية", "Next task")}
          </button>
        </div>
        {feedback && (
          <p
            className={`mt-4 flex items-center gap-2 text-sm font-semibold ${feedback === "correct" ? "text-primary" : "text-destructive"}`}
          >
            {feedback === "correct" ? <CheckCircle2 className="h-4 w-4" /> : null}
            {feedback === "correct"
              ? t("صحيح! أحسنت.", "Correct! Well done.")
              : t(
                  "راجع صيغة الأمر والتلميح ثم حاول مجدداً.",
                  "Check the command syntax and hint, then try again.",
                )}
          </p>
        )}
      </section>
    </main>
  );
}
