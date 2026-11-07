import { ccnaLessons } from "./ccna-course";
import type { Lesson } from "./lesson-types";
export type { Lesson } from "./lesson-types";
export { ccnaDomains } from "./ccna-course";

const foundationLessons: Lesson[] = [
  {
    id: "what-is-network",
    level: "beginner",
    titleAr: "ما هي الشبكة؟",
    titleEn: "What is a network?",
    bodyAr: [
      "الشبكة هي مجموعة من الأجهزة المتصلة ببعضها لتبادل البيانات والموارد مثل الملفات والطابعات والإنترنت.",
      "أنواع الشبكات حسب الحجم: LAN (شبكة محلية في منزل أو مكتب)، MAN (مدينة)، WAN (واسعة مثل الإنترنت).",
      "المكونات الأساسية: الأجهزة الطرفية (كمبيوتر، هاتف)، أجهزة الشبكة (سويتش، راوتر)، ووسائط النقل (كابلات أو لاسلكي).",
    ],
    bodyEn: [
      "A network is a group of connected devices that share data and resources such as files, printers and Internet access.",
      "Networks by size: LAN (home or office), MAN (city), WAN (wide, like the Internet).",
      "Core components: end devices (PC, phone), network devices (switch, router), and media (cables or wireless).",
    ],
    quiz: [
      { qAr: "ما نوع شبكة المنزل؟", qEn: "What type is a home network?", options: ["LAN", "WAN", "MAN"], answer: 0 },
      { qAr: "الإنترنت مثال على:", qEn: "The Internet is an example of:", options: ["LAN", "WAN", "PAN"], answer: 1 },
    ],
  },
  {
    id: "osi-model",
    level: "beginner",
    titleAr: "نموذج OSI والطبقات السبع",
    titleEn: "The OSI model's 7 layers",
    bodyAr: [
      "نموذج OSI يقسم الاتصال إلى 7 طبقات: الفيزيائية، ربط البيانات، الشبكة، النقل، الجلسة، العرض، التطبيقات.",
      "السويتش يعمل غالباً في الطبقة الثانية (عناوين MAC)، والراوتر في الطبقة الثالثة (عناوين IP).",
      "TCP و UDP يعملان في طبقة النقل. HTTP و DNS في طبقة التطبيقات.",
    ],
    bodyEn: [
      "OSI splits communication into 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.",
      "Switches mostly work at Layer 2 (MAC addresses), routers at Layer 3 (IP addresses).",
      "TCP and UDP live in the Transport layer. HTTP and DNS are in the Application layer.",
    ],
    quiz: [
      { qAr: "الراوتر يعمل في الطبقة:", qEn: "A router works at layer:", options: ["1", "2", "3"], answer: 2 },
      { qAr: "TCP ينتمي لطبقة:", qEn: "TCP belongs to:", options: ["Transport", "Network", "Physical"], answer: 0 },
    ],
  },
  {
    id: "ip-addressing",
    level: "intermediate",
    titleAr: "عناوين IP وأقنعة الشبكة",
    titleEn: "IP addresses & subnet masks",
    bodyAr: [
      "عنوان IPv4 يتكون من 32 بت مكتوبة كأربعة أرقام بين 0 و255 مثل 192.168.1.10.",
      "قناع الشبكة يحدد جزء الشبكة وجزء الجهاز. مثلاً 255.255.255.0 = /24 ويعطي 254 جهازاً.",
      "جهازان في نفس الشبكة الفرعية يتواصلان مباشرة، وإلا يحتاجان إلى بوابة افتراضية (راوتر).",
      "العناوين الخاصة: 10.0.0.0/8، 172.16.0.0/12، 192.168.0.0/16.",
    ],
    bodyEn: [
      "An IPv4 address is 32 bits written as four numbers 0–255, e.g. 192.168.1.10.",
      "The subnet mask separates network and host parts. 255.255.255.0 = /24 giving 254 hosts.",
      "Two hosts in the same subnet talk directly; otherwise they need a default gateway (router).",
      "Private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.",
    ],
    quiz: [
      { qAr: "كم جهازاً في /24؟", qEn: "How many hosts in a /24?", options: ["256", "254", "128"], answer: 1 },
      { qAr: "أي عنوان خاص؟", qEn: "Which is private?", options: ["8.8.8.8", "192.168.5.1", "1.1.1.1"], answer: 1 },
    ],
  },
  {
    id: "switching-vlan",
    level: "intermediate",
    titleAr: "السويتشات و VLAN",
    titleEn: "Switching & VLANs",
    bodyAr: [
      "السويتش يتعلم عناوين MAC للأجهزة في جدول ويرسل الإطارات للمنفذ الصحيح فقط.",
      "VLAN تقسم السويتش الواحد إلى شبكات منطقية منفصلة لزيادة الأمان وتقليل البث.",
      "منفذ Trunk ينقل عدة VLANs بين السويتشات باستخدام وسم 802.1Q.",
    ],
    bodyEn: [
      "A switch learns device MAC addresses in a table and forwards frames only to the right port.",
      "VLANs split one switch into separate logical networks for security and less broadcast.",
      "A trunk port carries multiple VLANs between switches using 802.1Q tags.",
    ],
    quiz: [
      { qAr: "السويتش يعتمد على:", qEn: "A switch forwards using:", options: ["MAC", "IP", "DNS"], answer: 0 },
      { qAr: "معيار وسم VLAN:", qEn: "VLAN tagging standard:", options: ["802.11", "802.1Q", "802.3af"], answer: 1 },
    ],
  },
  {
    id: "routing",
    level: "advanced",
    titleAr: "التوجيه: ثابت وديناميكي",
    titleEn: "Routing: static & dynamic",
    bodyAr: [
      "الراوتر يربط شبكات مختلفة ويقرر مسار الحزم باستخدام جدول التوجيه.",
      "التوجيه الثابت يُضاف يدوياً، والديناميكي يتعلم المسارات تلقائياً عبر بروتوكولات مثل OSPF و BGP.",
      "OSPF يستخدم داخل المؤسسات، و BGP يربط مزودي الإنترنت ببعضهم.",
    ],
    bodyEn: [
      "A router connects different networks and picks packet paths using its routing table.",
      "Static routes are added manually; dynamic routing learns paths via protocols like OSPF and BGP.",
      "OSPF is used inside organisations; BGP connects Internet providers.",
    ],
    quiz: [
      { qAr: "بروتوكول بين مزودي الإنترنت:", qEn: "Protocol between ISPs:", options: ["OSPF", "BGP", "RIP"], answer: 1 },
    ],
  },
  {
    id: "troubleshooting",
    level: "advanced",
    titleAr: "منهجية إصلاح الأعطال",
    titleEn: "Troubleshooting methodology",
    bodyAr: [
      "ابدأ من الأسفل: هل الكابل موصول؟ هل الضوء يعمل؟ ثم تحقق من عنوان IP والقناع والبوابة.",
      "أدوات مهمة: ping لاختبار الوصول، tracert/traceroute لتتبع المسار، ipconfig/ip a لعرض الإعدادات، nslookup لاختبار DNS.",
      "إذا عمل ping لعنوان IP ولم يعمل للاسم، فالمشكلة غالباً في DNS.",
    ],
    bodyEn: [
      "Start bottom-up: is the cable plugged in? Link light on? Then check IP, mask and gateway.",
      "Key tools: ping for reachability, tracert/traceroute for path, ipconfig/ip a for settings, nslookup for DNS.",
      "If ping to an IP works but not to a name, the issue is usually DNS.",
    ],
    quiz: [
      { qAr: "ping للـIP يعمل وللاسم لا:", qEn: "Ping IP works, name fails:", options: ["Cable", "DNS", "Switch"], answer: 1 },
    ],
  },
];

export const lessons: Lesson[] = [...foundationLessons, ...ccnaLessons];

export const scenarios = [
  {
    id: "s1",
    titleAr: "الجهاز لا يصل للإنترنت",
    titleEn: "PC can't reach the Internet",
    infoAr: "PC: IP 192.168.1.20 / 255.255.255.0 / Gateway 192.168.2.1 — الراوتر: 192.168.1.1",
    infoEn: "PC: IP 192.168.1.20 / 255.255.255.0 / Gateway 192.168.2.1 — Router: 192.168.1.1",
    optionsAr: ["الكابل مفصول", "البوابة الافتراضية خاطئة", "DNS معطل"],
    optionsEn: ["Cable unplugged", "Wrong default gateway", "DNS down"],
    answer: 1,
    explainAr: "البوابة يجب أن تكون 192.168.1.1 أي في نفس شبكة الجهاز.",
    explainEn: "The gateway must be 192.168.1.1, in the same subnet as the PC.",
  },
  {
    id: "s2",
    titleAr: "المواقع لا تفتح لكن ping 8.8.8.8 يعمل",
    titleEn: "Websites fail but ping 8.8.8.8 works",
    infoAr: "ping 8.8.8.8 ناجح، ping google.com يعطي: could not find host",
    infoEn: "ping 8.8.8.8 succeeds, ping google.com: could not find host",
    optionsAr: ["مشكلة DNS", "مشكلة كابل", "قناع خاطئ"],
    optionsEn: ["DNS problem", "Cable problem", "Wrong mask"],
    answer: 0,
    explainAr: "الاتصال يعمل، لكن ترجمة الأسماء فشلت = DNS.",
    explainEn: "Connectivity works but name resolution fails = DNS.",
  },
  {
    id: "s3",
    titleAr: "جهازان على نفس السويتش لا يتواصلان",
    titleEn: "Two PCs on the same switch can't talk",
    infoAr: "PC1: 10.0.0.5/24 في VLAN 10 — PC2: 10.0.0.6/24 في VLAN 20",
    infoEn: "PC1: 10.0.0.5/24 on VLAN 10 — PC2: 10.0.0.6/24 on VLAN 20",
    optionsAr: ["عناوين متضاربة", "الأجهزة في VLANs مختلفة", "السويتش معطل"],
    optionsEn: ["IP conflict", "Devices on different VLANs", "Switch is broken"],
    answer: 1,
    explainAr: "VLANs مختلفة تعني شبكات منفصلة؛ ضعهما في نفس VLAN أو أضف توجيه بين VLANs.",
    explainEn: "Different VLANs are separate networks; put them in one VLAN or add inter-VLAN routing.",
  },
  {
    id: "s4",
    titleAr: "رسالة تعارض عنوان IP",
    titleEn: "IP address conflict warning",
    infoAr: "جهازان مضبوطان يدوياً على 192.168.1.50",
    infoEn: "Two devices manually set to 192.168.1.50",
    optionsAr: ["غيّر عنوان أحدهما أو استخدم DHCP", "أعد تشغيل الراوتر فقط", "غيّر DNS"],
    optionsEn: ["Change one IP or use DHCP", "Just reboot router", "Change DNS"],
    answer: 0,
    explainAr: "كل جهاز يحتاج عنواناً فريداً في الشبكة.",
    explainEn: "Each device needs a unique address on the network.",
  },
];
