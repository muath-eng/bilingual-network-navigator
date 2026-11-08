import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, CircleHelp, Lightbulb, RotateCcw, Terminal, Trophy } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/practice")({
  head: () => ({ meta: [{ title: "CLI Practice — Network Master" }, { name: "description", content: "Interactive Cisco IOS command training." }] }),
  component: PracticePage,
});

type Category = "basics" | "switching" | "routing" | "services" | "security" | "diagnostics";
type Challenge = {
  id: string; category: Category; level: "Beginner" | "Intermediate" | "Advanced";
  ar: string; en: string; goalAr: string; goalEn: string; command: string; accepted?: string[];
  hintAr: string; hintEn: string; explanationAr: string; explanationEn: string; output: string;
};

const categories: { id: Category; ar: string; en: string; descAr: string; descEn: string }[] = [
  { id: "basics", ar: "الأساسيات", en: "Fundamentals", descAr: "فحص الجهاز والواجهات", descEn: "Inspect device and interfaces" },
  { id: "switching", ar: "السويتش وVLAN", en: "Switching & VLANs", descAr: "المنافذ والشبكات المحلية", descEn: "Ports and local networks" },
  { id: "routing", ar: "التوجيه", en: "Routing", descAr: "المسارات وجدول التوجيه", descEn: "Routes and routing table" },
  { id: "services", ar: "خدمات الشبكة", en: "Network services", descAr: "DHCP وIP", descEn: "DHCP and IP services" },
  { id: "security", ar: "الحماية", en: "Security", descAr: "ACL وحماية المنافذ", descEn: "ACL and port security" },
  { id: "diagnostics", ar: "استكشاف الأعطال", en: "Troubleshooting", descAr: "اختبار الاتصال والأخطاء", descEn: "Connectivity and error checks" },
];

const challenges: Challenge[] = [
  { id: "version", category: "basics", level: "Beginner", ar: "اعرف إصدار IOS ومعلومات الجهاز.", en: "Identify IOS version and device information.", goalAr: "اعرض معلومات النظام.", goalEn: "Display system information.", command: "show version", hintAr: "ابدأ بـ show ثم version.", hintEn: "Start with show, then version.", explanationAr: "يعرض إصدار IOS ومدة التشغيل والذاكرة والعتاد.", explanationEn: "Displays IOS version, uptime, memory and hardware.", output: "Cisco IOS Software, Version 15.2(4)M\nRouter uptime is 2 weeks, 3 days\nSystem image file is flash:c2900-universalk9-mz.SPA.bin" },
  { id: "interfaces", category: "basics", level: "Beginner", ar: "اعرض ملخص عناوين IP وحالة الواجهات.", en: "Show IP addresses and interface status.", goalAr: "اعرض عناوين IP وحالة Status وProtocol.", goalEn: "Display IP addresses, Status and Protocol.", command: "show ip interface brief", hintAr: "الأمر يبدأ بـ show ip interface.", hintEn: "Start with show ip interface.", explanationAr: "يعرض ملخصاً سريعاً لكل الواجهات وعناوينها وحالتها.", explanationEn: "Shows a quick summary of interfaces, addresses and status.", output: "Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0      192.168.1.1     YES manual up                    up\nGigabitEthernet0/1      unassigned      YES unset  administratively down down" },
  { id: "running", category: "basics", level: "Beginner", ar: "اعرض الإعدادات الحالية العاملة.", en: "Display the active running configuration.", goalAr: "اعرض الإعدادات الموجودة في الذاكرة الحالية.", goalEn: "Display the active configuration in memory.", command: "show running-config", accepted: ["show run"], hintAr: "يمكن اختصار running-config إلى run.", hintEn: "running-config can be abbreviated to run.", explanationAr: "يعرض الإعدادات الفعالة حالياً، وقد تختلف عن إعدادات الإقلاع المحفوظة.", explanationEn: "Displays active settings, which may differ from the saved startup configuration.", output: "Building configuration...\nCurrent configuration : 1248 bytes\n!\nhostname R1\ninterface GigabitEthernet0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown" },
  { id: "vlan", category: "switching", level: "Beginner", ar: "اعرض قائمة VLAN الموجودة.", en: "Display the VLAN database.", goalAr: "اعرض أرقام VLAN وأسماءها والمنافذ التابعة لها.", goalEn: "List VLAN IDs, names and member ports.", command: "show vlan brief", hintAr: "استخدم show vlan ثم brief.", hintEn: "Use show vlan followed by brief.", explanationAr: "يعرض VLAN وحالتها والمنافذ المنتمية لكل VLAN.", explanationEn: "Lists VLANs, status and member ports.", output: "VLAN Name                             Status    Ports\n1    default                          active    Gi0/1, Gi0/2\n10   SALES                            active    Gi0/3, Gi0/4\n20   IT                               active    Gi0/5" },
  { id: "mac", category: "switching", level: "Intermediate", ar: "اعرض جدول عناوين MAC.", en: "Display the MAC address table.", goalAr: "اعرف عناوين MAC والمنافذ التي تعلمها السويتش.", goalEn: "Find learned MAC addresses and switch ports.", command: "show mac address-table", hintAr: "ابحث عن mac address-table بعد show.", hintEn: "Look for mac address-table after show.", explanationAr: "يربط السويتش عنوان MAC بالمنفذ وVLAN التي تعلم العنوان عليها.", explanationEn: "Maps learned MAC addresses to switch ports and VLANs.", output: "Vlan    Mac Address       Type        Ports\n10      00aa.11bb.22cc    DYNAMIC     Gi0/3\n20      00dd.33ee.44ff    DYNAMIC     Gi0/5" },
  { id: "trunk", category: "switching", level: "Intermediate", ar: "تحقق من منافذ Trunk والـ VLAN المسموح بها.", en: "Inspect trunk ports and allowed VLANs.", goalAr: "اعرض حالة منافذ Trunk.", goalEn: "Display trunk port status.", command: "show interfaces trunk", hintAr: "ابدأ بـ show interfaces ثم trunk.", hintEn: "Start with show interfaces, then trunk.", explanationAr: "يساعدك على التأكد من أن وصلة Trunk تنقل شبكات VLAN المطلوبة.", explanationEn: "Verifies that trunk links carry the intended VLANs.", output: "Port        Mode         Encapsulation  Status        Native vlan\nGi0/1       on           802.1q         trunking      1\nVlans allowed on trunk\nGi0/1       1-1005" },
  { id: "route", category: "routing", level: "Beginner", ar: "اعرض جدول التوجيه IPv4.", en: "Display the IPv4 routing table.", goalAr: "اعرف الشبكات المتصلة والمسارات الثابتة والافتراضية.", goalEn: "Inspect connected, static and default routes.", command: "show ip route", hintAr: "الأمر هو show ip route.", hintEn: "The command is show ip route.", explanationAr: "يعرض المسارات التي يستخدمها الراوتر لاتخاذ قرار تمرير الحزم.", explanationEn: "Shows routes used by the router to forward packets.", output: "Gateway of last resort is 192.168.1.254\nC 192.168.1.0/24 is directly connected, GigabitEthernet0/0\nS* 0.0.0.0/0 [1/0] via 192.168.1.254" },
  { id: "default-route", category: "routing", level: "Intermediate", ar: "أضف مساراً افتراضياً عبر 192.168.1.254.", en: "Configure a default route through 192.168.1.254.", goalAr: "وجّه الوجهات غير المعروفة إلى البوابة المحددة.", goalEn: "Forward unknown destinations to the specified next hop.", command: "ip route 0.0.0.0 0.0.0.0 192.168.1.254", hintAr: "استخدم ip route ثم 0.0.0.0 والقناع ثم البوابة.", hintEn: "Use ip route, the 0.0.0.0 network and mask, then the gateway.", explanationAr: "المسار 0.0.0.0/0 يستخدم عند عدم وجود مسار أكثر تحديداً. ينفذ في وضع الإعداد العام.", explanationEn: "The 0.0.0.0/0 route is used when no more-specific route exists. Enter it in global configuration mode.", output: "R1(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.254\n% Default route configured (training simulation)" },
  { id: "dhcp", category: "services", level: "Intermediate", ar: "اعرض عناوين DHCP الموزعة للعملاء.", en: "Display DHCP addresses leased to clients.", goalAr: "اعرض جدول DHCP bindings.", goalEn: "Display the DHCP binding table.", command: "show ip dhcp binding", hintAr: "الأمر يحتوي على show ip dhcp binding.", hintEn: "The command includes show ip dhcp binding.", explanationAr: "يعرض عناوين IP الممنوحة وعناوين Hardware ومدة الإيجار.", explanationEn: "Displays leased IPs, hardware addresses and lease expiration.", output: "IP address       Client-ID/Hardware address     Lease expiration\n192.168.10.11    0100.1122.3344.55               Apr 12 2026 08:00 AM\n192.168.10.12    0100.aabb.ccdd.ee               Apr 12 2026 08:15 AM" },
  { id: "helper", category: "services", level: "Advanced", ar: "أضف DHCP relay إلى الخادم 192.168.20.10.", en: "Configure DHCP relay to server 192.168.20.10.", goalAr: "أدخل أمر ip helper-address مع عنوان الخادم.", goalEn: "Enter ip helper-address with the server IP.", command: "ip helper-address 192.168.20.10", hintAr: "الأمر يبدأ بـ ip helper-address.", hintEn: "The command starts with ip helper-address.", explanationAr: "يمرر DHCP relay طلبات العملاء إلى خادم في شبكة أخرى. ينفذ ضمن إعداد الواجهة.", explanationEn: "A DHCP relay forwards client requests to a server on another network. Enter in interface configuration mode.", output: "R1(config-if)# ip helper-address 192.168.20.10\n% DHCP relay configured (training simulation)" },
  { id: "acl", category: "security", level: "Intermediate", ar: "اعرض قوائم التحكم بالوصول ACL.", en: "Display access control lists.", goalAr: "اعرض قواعد ACL وإحصاءات المطابقة.", goalEn: "Display ACL entries and match counters.", command: "show access-lists", hintAr: "استخدم show access-lists.", hintEn: "Use show access-lists.", explanationAr: "تعرض القواعد التي تسمح أو تمنع حركة المرور وفق شروط محددة.", explanationEn: "Displays rules that permit or deny traffic based on defined conditions.", output: "Extended IP access list 101\n 10 permit tcp 192.168.10.0 0.0.0.255 any eq 443 (24 matches)\n 20 deny ip any any (3 matches)" },
  { id: "port-security", category: "security", level: "Advanced", ar: "اعرض إعدادات Port Security.", en: "Inspect Port Security settings.", goalAr: "تحقق من حالة حماية المنافذ وعناوين MAC الآمنة.", goalEn: "Check port-security state and secure MAC addresses.", command: "show port-security", hintAr: "اكتب show port-security.", hintEn: "Enter show port-security.", explanationAr: "يساعد Port Security على الحد من الأجهزة المسموح لها باستخدام منفذ السويتش.", explanationEn: "Port Security limits which devices may use a switch port.", output: "Secure Port  MaxSecureAddr  CurrentAddr  SecurityViolation  Action\nGi0/3        2              1            0                  Shutdown\nGi0/4        1              1            0                  Restrict" },
  { id: "ping", category: "diagnostics", level: "Beginner", ar: "اختبر الوصول إلى 8.8.8.8.", en: "Test connectivity to 8.8.8.8.", goalAr: "نفّذ اختبار Ping للعنوان المحدد.", goalEn: "Run a ping test to the specified IP.", command: "ping 8.8.8.8", hintAr: "اكتب ping ثم عنوان IP.", hintEn: "Type ping followed by an IP address.", explanationAr: "يرسل ICMP Echo Requests ويتحقق من وصول الردود.", explanationEn: "Sends ICMP Echo Requests and checks replies.", output: "Sending 5, 100-byte ICMP Echos to 8.8.8.8\n!!!!!\nSuccess rate is 100 percent (5/5), round-trip min/avg/max = 12/15/20 ms" },
  { id: "trace", category: "diagnostics", level: "Intermediate", ar: "تتبع المسار إلى 8.8.8.8.", en: "Trace the route to 8.8.8.8.", goalAr: "اعرف القفزات التي تمر بها الحزم حتى الوجهة.", goalEn: "Identify the hops packets take to the destination.", command: "traceroute 8.8.8.8", hintAr: "استخدم traceroute ثم عنوان الوجهة.", hintEn: "Use traceroute followed by the destination IP.", explanationAr: "يكشف Traceroute أجهزة الطبقة الثالثة التي تمر بها الحزم.", explanationEn: "Traceroute reveals Layer 3 hops along the path.", output: "Tracing the route to 8.8.8.8\n1  192.168.1.254  2 msec  2 msec  1 msec\n2  10.10.0.1      8 msec  7 msec  8 msec\n3  8.8.8.8       14 msec 13 msec 15 msec" },
  { id: "errors", category: "diagnostics", level: "Advanced", ar: "افحص عدادات الأخطاء على الواجهات.", en: "Inspect interface error counters.", goalAr: "اعرض أخطاء CRC والإطارات على الواجهات.", goalEn: "Display CRC and frame errors on interfaces.", command: "show interfaces counters errors", hintAr: "ابدأ بـ show interfaces counters.", hintEn: "Start with show interfaces counters.", explanationAr: "يساعد على اكتشاف أخطاء CRC والإطارات ومشكلات الطبقة الفيزيائية.", explanationEn: "Helps identify CRC, frame and physical-layer issues.", output: "Port   Align-Err  FCS-Err  Xmit-Err  Rcv-Err\nGi0/1  0          0        0         0\nGi0/2  0          4        0         4" },
];

const norm = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

function PracticePage() {
  const { t } = useLang();
  const [category, setCategory] = useState<Category>("basics");
  const [index, setIndex] = useState(0);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>(["Cisco IOS Training Console", "Type help to see supported commands.", "R1>"]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | "info" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [progressLoaded, setProgressLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("network-master-cli-progress");
      if (saved) {
        const parsed = JSON.parse(saved) as { completed?: string[] };
        if (Array.isArray(parsed.completed)) setCompleted(parsed.completed.filter((id) => challenges.some((item) => item.id === id)));
      }
    } catch { /* Storage is optional. */ }
    setProgressLoaded(true);
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try { window.localStorage.setItem("network-master-cli-progress", JSON.stringify({ completed })); }
    catch { /* Keep the current session usable if storage is unavailable. */ }
  }, [completed, progressLoaded]);

  const tasks = useMemo(() => challenges.filter((item) => item.category === category), [category]);
  const task = tasks[index] ?? tasks[0];
  const percent = Math.round((completed.length / challenges.length) * 100);

  const changeCategory = (id: Category) => {
    setCategory(id); setIndex(0); setCommand(""); setFeedback(null); setShowHint(false);
  };
  const reset = () => { setCommand(""); setFeedback(null); setShowHint(false); setHistory(["R1>"]); };
  const next = (step: number) => {
    setIndex((value) => (value + step + tasks.length) % tasks.length);
    setCommand(""); setFeedback(null); setShowHint(false);
  };

  const run = () => {
    if (!command.trim() || !task) return;
    const entered = command.trim();
    const value = norm(entered);
    const correct = [task.command, ...(task.accepted ?? [])].some((candidate) => norm(candidate) === value);
    const known = challenges.find((item) => [item.command, ...(item.accepted ?? [])].some((candidate) => norm(candidate) === value));
    const modes: Record<string, string> = {
      enable: "R1# Privileged EXEC mode (training simulation)",
      "conf t": "R1(config)# Global configuration mode (training simulation)",
      "configure terminal": "R1(config)# Global configuration mode (training simulation)",
      exit: "Returned to the previous command mode (training simulation)",
      end: "Returned to privileged EXEC mode (training simulation)",
      disable: "R1> User EXEC mode (training simulation)",
      "show clock": "*12:00:00.000 UTC Mon Nov 8 2026",
      "show users": "Line       User       Host(s)       Idle\n* 0 con 0  -          idle          00:00:00",
      help: "Supported: show version | show ip interface brief | show ip route | show vlan brief | show interfaces trunk | ping 8.8.8.8 | traceroute 8.8.8.8 | clear",
    };
    let output = "";
    let status: "correct" | "wrong" | "info" = "wrong";
    if (correct) {
      output = task.output; status = "correct";
      setCompleted((items) => items.includes(task.id) ? items : [...items, task.id]);
    } else if (known) {
      output = known.output; status = "info";
    } else if (modes[value]) {
      output = modes[value]; status = "info";
    } else if (value === "clear") {
      setHistory(["R1>"]); setCommand(""); setFeedback(null); return;
    } else {
      output = "% Invalid or incomplete command.\nCheck the syntax, use the hint, or type help.";
    }
    setAttempts((count) => count + 1);
    setHistory((items) => [ "R1# " + entered, output, ...items ].slice(0, 20));
    setFeedback(status);
    setCommand("");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><Terminal className="h-4 w-4" /> Cisco IOS • Interactive trainer</div>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{t("تدريب أوامر الشبكات", "Network Command Training")}</h1>
          <p className="mt-2 max-w-2xl leading-7 text-muted-foreground">{t("تعلّم أوامر Cisco IOS بالتدرج، اكتب الأوامر بنفسك، وشاهد النتائج والتصحيح داخل طرفية تدريبية.", "Learn Cisco IOS step by step, enter commands yourself, and review simulated output and feedback in a training terminal.")}</p>
        </div>
        <div className="min-w-36 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Trophy className="h-4 w-4 text-primary" />{t("إنجازك", "Your progress")}</div>
          <div className="mt-1 text-2xl font-bold tabular-nums">{completed.length}/{challenges.length}</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: percent + "%" }} /></div>
          <div className="mt-1 text-xs text-muted-foreground">{percent}%</div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{t("التحديات المكتملة", "Completed challenges")}</div><div className="mt-1 text-2xl font-bold">{completed.length}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{t("المحاولات", "Attempts")}</div><div className="mt-1 text-2xl font-bold">{attempts}</div></div>
        <div className="rounded-xl border border-border bg-card p-4"><div className="text-xs text-muted-foreground">{t("التحديات المتاحة", "Available challenges")}</div><div className="mt-1 text-2xl font-bold">{challenges.length}</div></div>
      </div>

      <section className="mt-7">
        <h2 className="mb-3 text-lg font-bold">{t("اختر مسار التدريب", "Choose a training path")}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => {
            const count = challenges.filter((challenge) => challenge.category === item.id).length;
            const done = challenges.filter((challenge) => challenge.category === item.id && completed.includes(challenge.id)).length;
            return <button key={item.id} onClick={() => changeCategory(item.id)} className={"rounded-xl border p-4 text-start transition-colors " + (category === item.id ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border bg-card hover:bg-secondary/50")}>
              <div className="flex items-center justify-between gap-2"><span className="font-semibold">{t(item.ar, item.en)}</span><span className="text-xs tabular-nums text-muted-foreground">{done}/{count}</span></div>
              <p className="mt-1 text-xs text-muted-foreground">{t(item.descAr, item.descEn)}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: (count ? done / count * 100 : 0) + "%" }} /></div>
            </button>;
          })}
        </div>
      </section>

      <div className="mt-7 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("التحدي", "Challenge")} {index + 1} / {tasks.length}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">{task?.level}</span></div>
          <h2 className="mt-4 text-xl font-bold">{task ? t(task.ar, task.en) : ""}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{task ? t(task.goalAr, task.goalEn) : ""}</p>
          <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-3"><div className="flex items-center gap-2 text-sm font-semibold"><BookOpen className="h-4 w-4 text-primary" />{t("شرح الأمر", "Command concept")}</div><p className="mt-2 text-sm leading-6">{task ? t(task.explanationAr, task.explanationEn) : ""}</p></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setShowHint((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><Lightbulb className="h-4 w-4" />{showHint ? t("إخفاء التلميح", "Hide hint") : t("إظهار تلميح", "Show hint")}</button>
            <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"><RotateCcw className="h-4 w-4" />{t("إعادة", "Reset")}</button>
          </div>
          {showHint && task && <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm leading-6"><div className="mb-1 flex items-center gap-2 font-semibold"><CircleHelp className="h-4 w-4" />{t("تلميح", "Hint")}</div>{t(task.hintAr, task.hintEn)}</div>}
          {task && completed.includes(task.id) && <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary"><CheckCircle2 className="h-4 w-4" />{t("أنجزت هذا التحدي سابقاً", "You have completed this challenge")}</div>}
          <div className="mt-5 flex gap-2"><button onClick={() => next(1)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">{t("التالي", "Next challenge")}</button><button onClick={() => next(-1)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">{t("السابق", "Previous")}</button></div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div className="flex items-center gap-2 text-sm font-semibold"><Terminal className="h-4 w-4 text-emerald-400" />Cisco IOS Terminal</div><span className="rounded bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">SIMULATED</span></div>
          <div className="min-h-64 space-y-2 overflow-auto p-4 font-mono text-xs leading-6 sm:text-sm" dir="ltr">
            {history.map((line, position) => <pre key={position} className={"whitespace-pre-wrap break-words " + (line.startsWith("%") ? "text-rose-300" : line.startsWith("R1") ? "text-emerald-300" : "text-slate-300")}>{line}</pre>)}
            <div className="flex items-center gap-2 text-emerald-300"><span>R1#</span><input value={command} onChange={(event) => { setCommand(event.target.value); setFeedback(null); }} onKeyDown={(event) => { if (event.key === "Enter") run(); }} placeholder="Enter IOS command..." aria-label="Enter Cisco IOS command" className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:ring-0" /></div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-800 p-3"><button onClick={run} disabled={!command.trim()} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40">{t("تنفيذ", "Run command")}</button><button onClick={() => { setCommand("help"); setHistory((items) => ["R1# help", "Supported: show version | show ip interface brief | show ip route | show vlan brief | ping 8.8.8.8 | traceroute 8.8.8.8", ...items].slice(0, 20)); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">help</button><button onClick={() => { setHistory(["R1>"]); setFeedback(null); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">clear</button></div>
          {feedback && <div className={"border-t px-4 py-3 text-sm leading-6 " + (feedback === "correct" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : feedback === "info" ? "border-sky-500/30 bg-sky-500/10 text-sky-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200")}>{feedback === "correct" ? t("صحيح! تم تنفيذ الأمر وإكمال التحدي.", "Correct! Command executed and challenge completed.") : feedback === "info" ? t("تم تنفيذ الأمر في المحاكاة. تابع هدف التحدي الحالي.", "Command simulated. Continue the current challenge.") : t("لم يتعرف المدرب على هذا الأمر. راجع الصيغة أو استخدم التلميح.", "The trainer did not recognize this command. Check syntax or use the hint.")}</div>}
        </section>
      </div>

      <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground"><p className="font-semibold text-foreground">{t("ملاحظة مهمة", "Important note")}</p>{t("هذه محاكاة تعليمية بأوامر ومخرجات محددة، وليست جهاز Cisco حقيقياً أو مفسراً كاملاً لـ IOS. يُحفظ التقدم محلياً على هذا المتصفح.", "This is a learning simulation with predefined commands and outputs, not a real Cisco device or a full IOS interpreter. Progress is saved locally in this browser.")}</div>
    </main>
  );
}
