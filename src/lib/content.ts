import { ccnaLessons } from "./ccna-course";
import { networkOperationsLessons } from "./network-operations-lessons";
import type { Lesson, TroubleshootingScenario } from "./lesson-types";
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
      {
        qAr: "ما نوع شبكة المنزل؟",
        qEn: "What type is a home network?",
        options: ["LAN", "WAN", "MAN"],
        answer: 0,
      },
      {
        qAr: "الإنترنت مثال على:",
        qEn: "The Internet is an example of:",
        options: ["LAN", "WAN", "PAN"],
        answer: 1,
      },
    ],
  },
  {
    id: "osi-model",
    level: "beginner",
    titleAr: "نموذج OSI والطبقات السبع",
    titleEn: "The OSI model's 7 layers",
    bodyAr: [
      "نموذج OSI هو نموذج مرجعي من سبع طبقات يساعد مهندس الشبكات على فهم انتقال البيانات وتقسيم المشكلة إلى أجزاء. هو إطار تعليمي للتفكير والتشخيص، وليس شرطاً أن تكون كل بروتوكولات الإنترنت مطابقة له حرفياً.",
      "الطبقة 1 الفيزيائية Physical: تنقل البتات عبر الوسط المادي أو اللاسلكي. أمثلتها الكابل النحاسي والألياف وإشارات الراديو. عند انقطاع الرابط افحص الطاقة والكابل والموصلات والمنفذ وسرعة/ازدواجية الاتصال.",
      "الطبقة 2 ربط البيانات Data Link: تنظم الإطارات داخل الوصلة المحلية وتستخدم عناوين MAC. يعمل السويتش التقليدي هنا ويتعلم MAC من عنوان المصدر ثم يمرر الإطار وفق جدول MAC. أمثلة: Ethernet و802.1Q وVLAN.",
      "الطبقة 3 الشبكة Network: مسؤولة عن العنونة المنطقية واختيار المسار بين الشبكات. IPv4 وIPv6 وعمليات التوجيه أمثلة عليها. الراوتر يقرأ عنوان IP الوجهة ويبحث عن أفضل مسار في جدول التوجيه.",
      "الطبقة 4 النقل Transport: توفر اتصالاً من طرف إلى طرف باستخدام المنافذ. TCP يوفر اتصالاً موثوقاً وترتيباً وإعادة إرسال، بينما UDP أخف ولا يضمن التسليم. أمثلة المنافذ: HTTP غالباً TCP/80 وHTTPS TCP/443 وDNS غالباً UDP/53 وقد يستخدم TCP أيضاً.",
      "الطبقة 5 الجلسة Session: تدير إنشاء جلسات الاتصال واستمرارها وإنهاءها في النموذج المرجعي. في الأنظمة الحديثة قد تتوزع وظائف الجلسات بين التطبيقات والبروتوكولات بدلاً من ظهورها كطبقة مستقلة.",
      "الطبقة 6 العرض Presentation: تهتم بصيغة البيانات وترميزها والضغط والتشفير. أمثلة مفاهيمية: UTF-8 وJPEG وعمليات التشفير TLS التي تتداخل وظائفها مع طبقات أخرى في نماذج الإنترنت.",
      "الطبقة 7 التطبيقات Application: أقرب طبقة للمستخدم وتوفر خدمات الشبكة للتطبيقات، مثل HTTP وDNS وSMTP وDHCP وSSH. فشل فتح اسم موقع قد يرتبط بـDNS، بينما فشل اتصال HTTPS قد يرتبط بالخدمة أو المنفذ أو TLS.",
      "طريقة سهلة للحفظ من الأسفل إلى الأعلى: Physical ثم Data Link ثم Network ثم Transport ثم Session ثم Presentation ثم Application. وحدات البيانات الشائعة: Bits في الطبقة 1، Frames في الطبقة 2، Packets في الطبقة 3، وSegments في TCP أو Datagrams في UDP بالطبقة 4.",
      "مثال تشخيص عملي: إذا لم يضئ مؤشر منفذ السويتش ابدأ بالطبقة 1. إذا كان الرابط يعمل لكن الجهاز لا يتعلم MAC أو توجد VLAN خاطئة افحص الطبقة 2. إذا كان الجهاز يصل إلى شبكته ولا يصل إلى شبكة أخرى افحص IP والبوابة والتوجيه في الطبقة 3.",
      "إذا نجح ping إلى عنوان IP وفشل الوصول إلى اسم النطاق، افحص DNS وأدوات مثل nslookup. وإذا نجح الاتصال بالخادم لكن تطبيقاً معيناً لا يعمل، افحص المنفذ والخدمة والجدار الناري بدلاً من تغيير إعدادات الكابل عشوائياً.",
      "تذكر أن الطبقات وسيلة منظمة للتشخيص وليست حدوداً صارمة؛ فقد يؤثر إعداد واحد مثل MTU أو جدار ناري في أكثر من طبقة. سجّل الأعراض، غيّر عاملاً واحداً كل مرة، ثم اختبر النتيجة.",
    ],
    bodyEn: [
      "The OSI model is a seven-layer reference model that helps network engineers understand data communication and break faults into manageable areas. It is a troubleshooting and learning framework, not a claim that every Internet protocol maps perfectly to one layer.",
      "Layer 1 Physical moves raw bits over a physical or wireless medium. Copper, fiber and radio signals are examples. For a down link, check power, cable, connectors, port state and speed/duplex.",
      "Layer 2 Data Link organizes frames on a local link and uses MAC addresses. A traditional switch learns source MAC addresses and forwards frames using its MAC table. Ethernet, 802.1Q and VLANs are examples.",
      "Layer 3 Network handles logical addressing and paths between networks. IPv4, IPv6 and routing belong here. A router checks the destination IP and selects a route from its routing table.",
      "Layer 4 Transport provides end-to-end communication using port numbers. TCP offers reliable ordered delivery and retransmission; UDP has less overhead but no delivery guarantee. HTTP commonly uses TCP/80, HTTPS TCP/443 and DNS commonly UDP/53, though DNS can also use TCP.",
      "Layer 5 Session represents the establishment, maintenance and termination of communication sessions. In modern systems, session functions may be distributed across applications and protocols rather than implemented as a distinct layer.",
      "Layer 6 Presentation concerns data representation, encoding, compression and encryption. UTF-8, JPEG and TLS encryption are useful examples, although real implementations can span multiple layers.",
      "Layer 7 Application provides network services closest to user applications, including HTTP, DNS, SMTP, DHCP and SSH. A hostname lookup failure may point to DNS; an HTTPS failure may involve the service, port or TLS.",
      "Remember the layers bottom-up: Physical, Data Link, Network, Transport, Session, Presentation and Application. Common data units are bits at Layer 1, frames at Layer 2, packets at Layer 3, and TCP segments or UDP datagrams at Layer 4.",
      "Troubleshooting example: if a switch-port link light is off, start at Layer 1. If the link is up but MAC learning or VLAN membership is wrong, inspect Layer 2. If a host reaches its local subnet but not another network, inspect IP addressing, gateways and routing at Layer 3.",
      "If a ping to an IP address succeeds but a hostname fails, test DNS with tools such as nslookup. If the server is reachable but one application fails, inspect its port, service and firewall rather than randomly replacing cables.",
      "Layers are a diagnostic guide, not rigid boundaries. A setting such as MTU or a firewall rule can affect more than one layer. Record symptoms, change one variable at a time and verify the result.",
    ],
    quiz: [
      {
        qAr: "الراوتر يعمل في الطبقة:",
        qEn: "A router works at layer:",
        options: ["1", "2", "3"],
        answer: 2,
      },
      {
        qAr: "TCP ينتمي لطبقة:",
        qEn: "TCP belongs to:",
        options: ["Transport", "Network", "Physical"],
        answer: 0,
      },
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
      {
        qAr: "كم جهازاً في /24؟",
        qEn: "How many hosts in a /24?",
        options: ["256", "254", "128"],
        answer: 1,
      },
      {
        qAr: "أي عنوان خاص؟",
        qEn: "Which is private?",
        options: ["8.8.8.8", "192.168.5.1", "1.1.1.1"],
        answer: 1,
      },
    ],
  },
  {
    id: "switching-vlan",
    level: "intermediate",
    titleAr: "السويتشات و VLAN",
    titleEn: "Switching & VLANs",
    bodyAr: [
      "السويتش Switch يربط الأجهزة داخل الشبكة المحلية ويحوّل إطارات Ethernet اعتماداً على عناوين MAC. يتعلم عنوان المصدر على المنفذ الذي وصل منه الإطار، ثم يستخدم جدول MAC لاتخاذ قرار التمرير.",
      "عندما تكون وجهة MAC معروفة يرسل السويتش الإطار إلى المنفذ المناسب. وإذا كانت الوجهة غير معروفة أو كان الإطار Broadcast فإنه يوزعه ضمن VLAN نفسها، مع استثناء منفذ الدخول.",
      "VLAN هي شبكة محلية افتراضية تقسم سويتشاً واحداً أو مجموعة سويتشات إلى نطاقات بث منطقية منفصلة. تفيد في فصل أقسام الشركة مثل الإدارة والضيوف والكاميرات، لكنها لا تغني وحدها عن سياسات الجدار الناري والتحكم بالوصول.",
      "كل VLAN تمثل نطاق بث منفصلاً، وغالباً تخصص لها شبكة IP مستقلة وبوابة افتراضية. مثال: VLAN 10 للإدارة بشبكة 192.168.10.0/24 وVLAN 20 للضيوف بشبكة 192.168.20.0/24.",
      "منفذ Access يخصص عادةً لجهاز نهائي واحد ضمن VLAN واحدة. أما Trunk فيحمل حركة عدة VLANs بين السويتشات أو إلى راوتر/سويتش طبقة ثالثة، ويستخدم غالباً معيار IEEE 802.1Q لتمييز الإطارات.",
      "مثال إعداد Cisco IOS على سويتش: enable ثم configure terminal، ثم vlan 10، ثم name ADMIN. كرر ذلك لـVLAN 20 باسم GUEST. لإسناد منفذ: interface gigabitEthernet 0/1 ثم switchport mode access ثم switchport access vlan 10.",
      "لإعداد trunk على منفذ الربط بين السويتشات: interface gigabitEthernet 0/24 ثم switchport mode trunk. يمكن تحديد VLANs المسموح بها باستخدام switchport trunk allowed vlan 10,20. تحقق بالأمر show vlan brief وshow interfaces trunk.",
      "على MikroTik RouterOS، أنشئ VLAN interface على واجهة الربط المناسبة، مثال: /interface vlan add name=vlan10 vlan-id=10 interface=ether2. ثم عيّن عنوان البوابة إن كان الجهاز سيقوم بالتوجيه، مثال: /ip address add address=192.168.10.1/24 interface=vlan10. يجب إعداد bridge وVLAN filtering ومنافذ tagged/untagged بما يتوافق مع تصميم الجهاز وإصدار RouterOS؛ لا تفعّل vlan-filtering قبل التأكد من إدراج منفذ الإدارة لتجنب فقدان الوصول.",
      "الأجهزة في VLANs مختلفة لا تتواصل عبر السويتش Layer 2 وحده. تحتاج إلى Inter-VLAN Routing عبر راوتر أو سويتش Layer 3، مع بوابة صحيحة لكل شبكة وقواعد أمان تسمح فقط بالحركة المطلوبة.",
      "اختبار عملي: ضع PC1 على VLAN 10 بعنوان 192.168.10.10/24 وبوابة 192.168.10.1، وPC2 على VLAN 20 بعنوان 192.168.20.10/24 وبوابة 192.168.20.1. افحص الاتصال داخل كل VLAN أولاً، ثم اختبر الاتصال بينهما بعد إعداد التوجيه.",
      "عند فشل الاتصال، تحقق بالترتيب من حالة المنفذ، عضوية VLAN، تطابق إعدادات trunk على الطرفين، قائمة VLANs المسموحة، عناوين IP والأقنعة والبوابات، ثم جدول التوجيه وACL. أوامر مفيدة: show vlan brief وshow interfaces trunk وshow mac address-table وshow ip interface brief.",
      "تنبيه: الأوامر أمثلة تعليمية وقد تختلف أسماء المنافذ وبنية bridge وإعدادات VLAN حسب طراز الجهاز وإصدار النظام. اختبر في المختبر أو نافذة صيانة قبل تطبيقها على شبكة إنتاج.",
    ],
    bodyEn: [
      "A switch connects devices in a LAN and forwards Ethernet frames using MAC addresses. It learns the source MAC on the ingress port and consults its MAC table when forwarding.",
      "When the destination MAC is known, the switch sends the frame to the matching port. Unknown unicast and broadcast traffic is flooded within the same VLAN, except the ingress port.",
      "A VLAN is a virtual LAN that separates one switch or a group of switches into logical broadcast domains. It can separate departments such as administration, guests and cameras, but VLANs alone do not replace firewall and access-control policies.",
      "Each VLAN is a separate broadcast domain and is commonly assigned its own IP subnet and default gateway. Example: VLAN 10 for administration uses 192.168.10.0/24 and VLAN 20 for guests uses 192.168.20.0/24.",
      "An access port is normally assigned to one end-device VLAN. A trunk carries multiple VLANs between switches or to a router/Layer 3 switch, commonly using IEEE 802.1Q tags.",
      "Cisco IOS example: enable, configure terminal, vlan 10, name ADMIN. Repeat for VLAN 20 with name GUEST. To assign an access port: interface gigabitEthernet 0/1, switchport mode access, switchport access vlan 10.",
      "To configure the inter-switch trunk: interface gigabitEthernet 0/24, switchport mode trunk. Restrict it with switchport trunk allowed vlan 10,20. Verify with show vlan brief and show interfaces trunk.",
      "On MikroTik RouterOS, create a VLAN interface on the appropriate parent link, for example: /interface vlan add name=vlan10 vlan-id=10 interface=ether2. If the device routes this VLAN, add its gateway address: /ip address add address=192.168.10.1/24 interface=vlan10. Configure bridge VLAN filtering and tagged/untagged ports for the actual topology and RouterOS version; do not enable vlan-filtering before including the management path or you may lose access.",
      "Hosts in different VLANs cannot communicate through a Layer 2 switch alone. They need inter-VLAN routing through a router or Layer 3 switch, correct gateways and security rules that permit only required traffic.",
      "Lab example: put PC1 in VLAN 10 with 192.168.10.10/24 and gateway 192.168.10.1; put PC2 in VLAN 20 with 192.168.20.10/24 and gateway 192.168.20.1. Test within each VLAN first, then test between VLANs after routing is configured.",
      "When connectivity fails, check port state, VLAN membership, trunk configuration on both ends, allowed VLAN lists, IP addresses, masks and gateways, then routing tables and ACLs. Useful commands include show vlan brief, show interfaces trunk, show mac address-table and show ip interface brief.",
      "These are teaching examples. Port names, bridge/VLAN design and commands may vary by hardware and software version. Test in a lab or maintenance window before applying changes to a production network.",
    ],
    quiz: [
      {
        qAr: "السويتش يعتمد على:",
        qEn: "A switch forwards using:",
        options: ["MAC", "IP", "DNS"],
        answer: 0,
      },
      {
        qAr: "معيار وسم VLAN:",
        qEn: "VLAN tagging standard:",
        options: ["802.11", "802.1Q", "802.3af"],
        answer: 1,
      },
    ],
  },
  {
    id: "router-switch-access-point",
    level: "beginner",
    titleAr: "الفرق بين الراوتر والسويتش ونقطة الوصول",
    titleEn: "Router vs Switch vs Access Point",
    bodyAr: [
      "الراوتر Router يربط شبكات IP مختلفة ويوجه الحزم بينها. في المنزل يربط شبكتك المحلية بمزود الإنترنت، ويكون غالباً البوابة الافتراضية للأجهزة. قد يتضمن NAT وDHCP وجداراً نارياً حسب الطراز والإعداد.",
      "السويتش Switch يربط عدة أجهزة سلكية داخل LAN واحدة ويمرر إطارات Ethernet اعتماداً على عناوين MAC. السويتش التقليدي Layer 2 لا يوجّه بين شبكات IP المختلفة، بينما يستطيع سويتش Layer 3 تنفيذ التوجيه بين VLANs.",
      "نقطة الوصول Access Point توفر اتصال Wi-Fi للأجهزة اللاسلكية وتربطها عادةً بالشبكة المحلية السلكية. هي ليست بالضرورة راوتراً؛ ففي وضع Bridge تمرر حركة العملاء إلى الشبكة، بينما قد تجمع بعض الأجهزة المنزلية بين وظائف الراوتر والسويتش ونقطة الوصول في صندوق واحد.",
      "مثال منزلي: يتصل خط مزود الخدمة بمنفذ WAN في الراوتر. يتصل حاسوب مكتبي وتلفاز بالسويتش عبر Ethernet، وتتصل الهواتف واللابتوبات بنقطة الوصول عبر Wi-Fi. يحصل كل جهاز على عنوان من DHCP ويستخدم عنوان LAN للراوتر كبوابة افتراضية.",
      "مثال مكتب صغير: راوتر للاتصال بالإنترنت والتوجيه، وسويتش مُدار لتوصيل أجهزة الموظفين والطابعات، ونقاط وصول موزعة لتغطية Wi-Fi. يمكن فصل شبكة الضيوف عن شبكة الموظفين باستخدام VLAN وسياسات وصول مناسبة.",
      "كيف تختار؟ تحتاج راوتراً عندما تريد ربط شبكات مختلفة أو الاتصال بمزود الخدمة. تحتاج سويتشاً عندما تنفد منافذ Ethernet أو تريد توصيل أجهزة سلكية كثيرة. تحتاج Access Point عندما تريد تغطية لاسلكية إضافية أو تحسين توزيع Wi-Fi.",
      "لا تخلط بين المودم والراوتر: المودم أو جهاز ONT ينهي وصلة مزود الخدمة بحسب التقنية، بينما الراوتر يربط شبكة المنزل بالشبكات الأخرى. قد يدمج مزود الخدمة هذه الوظائف في جهاز واحد.",
      "تشخيص سريع: إذا كانت الأجهزة السلكية واللاسلكية كلها بلا إنترنت، افحص وصلة WAN والراوتر والبوابة. إذا تعطل جهاز واحد على منفذ سلكي، افحص الكابل والمنفذ وVLAN. إذا كانت المشكلة في Wi-Fi فقط، افحص تغطية نقطة الوصول والقناة والتداخل والمصادقة.",
      "اختبار فهم: إذا أردت إضافة أربعة أجهزة سلكية إلى شبكة فيها منفذ LAN واحد متاح، فالحل المعتاد إضافة Switch. وإذا أردت تغطية لاسلكية في طابق آخر، ففكر في Access Point مع وصلة رجوع مناسبة. وإذا أردت ربط شبكتين فرعيتين، فأنت تحتاج إلى وظيفة Routing.",
    ],
    bodyEn: [
      "A router connects different IP networks and forwards packets between them. At home, it connects the local network to the Internet provider and is usually the hosts' default gateway. Depending on the device, it may also provide NAT, DHCP and firewall functions.",
      "A switch connects wired devices within a LAN and forwards Ethernet frames using MAC addresses. A traditional Layer 2 switch does not route between different IP networks, while a Layer 3 switch can route between VLANs.",
      "An access point provides Wi-Fi connectivity and usually bridges wireless clients into the wired LAN. It is not necessarily a router. Some home devices combine router, switch and access-point functions in one box.",
      "Home example: the ISP connection enters the router's WAN port. A desktop and TV connect to a switch over Ethernet, while phones and laptops join an access point over Wi-Fi. DHCP assigns addresses and the router's LAN address is the default gateway.",
      "Small-office example: a router provides Internet connectivity and routing, a managed switch connects employee devices and printers, and access points provide Wi-Fi coverage. A guest network can be separated from employee devices using VLANs and suitable access policies.",
      "Choose a router to connect different networks or the ISP. Choose a switch when you need more Ethernet ports or wired connections. Choose an access point when you need additional wireless coverage or better Wi-Fi placement.",
      "Do not confuse a modem with a router. A modem or ONT terminates the provider access technology, while the router connects the home network to other networks. An ISP device may combine these functions.",
      "Quick troubleshooting: if all wired and wireless clients lose Internet access, inspect the WAN link, router and gateway. If one wired device fails, check its cable, port and VLAN. If only Wi-Fi is affected, inspect AP coverage, channel interference and authentication.",
      "Knowledge check: to add four wired devices when only one LAN port is free, add a switch. To provide Wi-Fi on another floor, consider an access point with a suitable backhaul. To connect two IP subnets, you need routing.",
    ],
    quiz: [
      {
        qAr: "أي جهاز يمرر الإطارات داخل LAN اعتماداً على MAC؟",
        qEn: "Which device forwards frames inside a LAN using MAC addresses?",
        options: ["Router", "Layer 2 Switch", "Access Point only"],
        answer: 1,
      },
      {
        qAr: "ما الوظيفة الأساسية لنقطة الوصول؟",
        qEn: "What is the primary role of an access point?",
        options: ["توفير اتصال Wi-Fi", "توزيع مسارات BGP", "استبدال عنوان IP"],
        answer: 0,
      },
      {
        qAr: "ما الذي يربط شبكتين IP مختلفتين؟",
        qEn: "What connects two different IP networks?",
        options: ["Routing", "MAC learning only", "SSID"],
        answer: 0,
      },
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
      {
        qAr: "بروتوكول بين مزودي الإنترنت:",
        qEn: "Protocol between ISPs:",
        options: ["OSPF", "BGP", "RIP"],
        answer: 1,
      },
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
      {
        qAr: "ping للـIP يعمل وللاسم لا:",
        qEn: "Ping IP works, name fails:",
        options: ["Cable", "DNS", "Switch"],
        answer: 1,
      },
    ],
  },
];

export const lessons: Lesson[] = [
  ...foundationLessons,
  ...networkOperationsLessons,
  ...ccnaLessons,
];

export const scenarios: TroubleshootingScenario[] = [
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
    explainEn:
      "Different VLANs are separate networks; put them in one VLAN or add inter-VLAN routing.",
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
  {
    id: "s5",
    titleAr: "لا يمكن الوصول إلى جهاز في VLAN أخرى",
    titleEn: "Cannot reach a host in another VLAN",
    infoAr:
      "افحص عنوان IP وVLAN لكل جهاز. وجود الجهازين في VLANs مختلفة يعني أنهما في نطاقي بث منفصلين.\nما المطلوب لتمكين الاتصال بين VLAN 10 وVLAN 20؟",
    infoEn:
      "Check each device's IP address and VLAN. Different VLANs are separate broadcast domains.\nWhat is required for communication between VLAN 10 and VLAN 20?",
    optionsAr: ["توجيه بين VLANs", "تغيير DNS فقط", "كابل متقاطع"],
    optionsEn: ["Inter-VLAN routing", "Changing DNS only", "A crossover cable"],
    answer: 0,
    explainAr:
      "الحل هو إعداد توجيه بين VLANs عبر SVI أو Router-on-a-stick، مع التحقق من trunk والبوابات الافتراضية.",
    explainEn:
      "Configure inter-VLAN routing using SVIs or router-on-a-stick, and verify trunks and default gateways.",
  },
  {
    id: "s6",
    titleAr: "واجهة الراوتر في حالة administratively down",
    titleEn: "Router interface is administratively down",
    infoAr:
      "يعرض الأمر show ip interface brief حالة الواجهة administratively down/down، وهذا يدل على إيقافها من الإعدادات.\nما الأمر الذي يعيد تشغيل الواجهة المغلقة إدارياً؟",
    infoEn:
      "show ip interface brief reports administratively down/down, indicating that the interface is disabled by configuration.\nWhich command re-enables an administratively shut interface?",
    optionsAr: ["no shutdown", "ip helper-address", "shutdown"],
    optionsEn: ["no shutdown", "ip helper-address", "shutdown"],
    answer: 0,
    explainAr:
      "بعد التأكد من المنفذ والطرف الآخر، ادخل إلى إعداد الواجهة ونفّذ no shutdown ثم أعد فحص الحالة.",
    explainEn:
      "After checking the port and far end, enter interface configuration, run no shutdown and verify the state again.",
  },
  {
    id: "s7",
    titleAr: "المنفذ يعمل لكن أخطاء CRC تتزايد",
    titleEn: "Link is up but CRC errors keep increasing",
    infoAr:
      "حالة Link up لا تعني أن جودة الإشارة سليمة. راقب عدادات CRC وinput errors في show interfaces.\nما السبب الأكثر احتمالاً لزيادة أخطاء CRC؟",
    infoEn:
      "A link-up state does not guarantee a clean physical connection. Inspect CRC and input-error counters with show interfaces.\nWhat is a likely cause of increasing CRC errors?",
    optionsAr: ["مشكلة في الكابل أو المنفذ", "بوابة افتراضية خاطئة", "DHCP معطل"],
    optionsEn: ["Physical cable or port issue", "Wrong default gateway", "Disabled DHCP"],
    answer: 0,
    explainAr:
      "افحص الكابل والموصلات والطرفين واحتمال وجود تشويش أو منفذ معيب، ثم قارن العدادات بعد الإصلاح.",
    explainEn:
      "Check the cable, connectors, both endpoints, possible interference and faulty ports, then compare counters after remediation.",
  },
  {
    id: "s8",
    titleAr: "الأجهزة تحصل على عنوان 169.254.x.x",
    titleEn: "Clients receive a 169.254.x.x address",
    infoAr:
      "العنوان 169.254.x.x هو APIPA، ويظهر غالباً عندما لا يتلقى الجهاز استجابة من خادم DHCP.\nما أول خدمة يجب فحصها عند ظهور APIPA؟",
    infoEn:
      "A 169.254.x.x address is APIPA and commonly appears when a client receives no DHCP response.\nWhich service should be checked first when APIPA appears?",
    optionsAr: ["DHCP", "DNS", "NTP"],
    optionsEn: ["DHCP", "DNS", "NTP"],
    answer: 0,
    explainAr:
      "تحقق من تشغيل الخادم ونطاق العناوين وVLAN وDHCP relay وإمكانية وصول رسائل DHCP إلى الخادم.",
    explainEn:
      "Check the DHCP server and scope, VLAN, DHCP relay and whether DHCP messages can reach the server.",
  },
  {
    id: "s9",
    titleAr: "الاتصال بعنوان IP يعمل لكن التصفح بطيء أو يفشل",
    titleEn: "IP connectivity works but browsing is slow or fails",
    infoAr:
      "نجاح ping إلى عنوان IP مع فشل أسماء النطاقات يشير غالباً إلى مشكلة DNS وليس إلى انقطاع الاتصال بالكامل.\nما الأداة المناسبة لاختبار تحليل أسماء النطاقات؟",
    infoEn:
      "Successful pings to IP addresses while domain names fail usually indicate a DNS issue rather than total connectivity loss.\nWhich tool is suitable for testing DNS name resolution?",
    optionsAr: ["nslookup", "traceroute فقط", "show vlan brief"],
    optionsEn: ["nslookup", "traceroute only", "show vlan brief"],
    answer: 0,
    explainAr:
      "استخدم nslookup لفحص خادم DNS، وتحقق من إعداد DNS على العميل ومن القيمة التي يوزعها DHCP.",
    explainEn:
      "Use nslookup to test the DNS server and verify the client's DNS configuration and DHCP-provided settings.",
  },
  {
    id: "s10",
    titleAr: "المسار موجود لكن الاتصال لا يكتمل",
    titleEn: "Route exists but end-to-end connectivity fails",
    infoAr:
      "وجود مسار في اتجاه الذهاب لا يضمن اكتمال الاتصال؛ يجب أن يعرف الطرف البعيد طريق العودة إلى المصدر.\nما الذي يجب فحصه عندما يوجد مسار ذهاب لكن الاتصال يفشل؟",
    infoEn:
      "A forward route alone does not guarantee end-to-end connectivity; the remote side must know how to return traffic to the source.\nWhat should be checked when a forward route exists but connectivity fails?",
    optionsAr: ["مسار العودة وقواعد ACL", "عنوان MAC فقط", "Spanning Tree فقط"],
    optionsEn: ["Return route and ACLs", "MAC address only", "Spanning Tree only"],
    answer: 0,
    explainAr:
      "افحص جداول التوجيه في الطرفين والبوابات الافتراضية وقواعد ACL أو Firewall التي قد تمنع حركة المرور.",
    explainEn:
      "Inspect routing tables on both ends, default gateways and ACL or firewall rules that may block traffic.",
  },
  ,
  {
    id: "s11",
    titleAr: "NAT مضبوط لكن أجهزة LAN لا تصل إلى الإنترنت",
    titleEn: "NAT is configured but LAN clients cannot reach the Internet",
    infoAr:
      "الراوتر يصل إلى بوابة مزود الخدمة بنجاح. جهاز LAN عنوانه 192.168.10.25/24 والبوابة 192.168.10.1. قاعدة PAT موجودة، لكن واجهة LAN مضبوطة nat outside وواجهة WAN مضبوطة nat inside.",
    infoEn:
      "The router can reach the ISP gateway. A LAN client is 192.168.10.25/24 with gateway 192.168.10.1. A PAT rule exists, but the LAN interface is marked nat outside and the WAN interface nat inside.",
    optionsAr: ["عكس أدوار inside وoutside", "تغيير DNS إلى 8.8.8.8 فقط", "زيادة DHCP lease time"],
    optionsEn: [
      "Reverse the inside and outside roles",
      "Only change DNS to 8.8.8.8",
      "Increase the DHCP lease time",
    ],
    answer: 0,
    explainAr:
      "يجب تحديد واجهة الشبكة الداخلية بـ ip nat inside وواجهة WAN بـ ip nat outside. بعد التصحيح افحص show ip nat translations وعدادات NAT، وتأكد من المسار الافتراضي وسياسة ACL.",
    explainEn:
      "Mark the LAN interface with ip nat inside and the WAN interface with ip nat outside. Then inspect show ip nat translations and NAT counters, and verify the default route and ACL policy.",
  },
  {
    id: "s12",
    titleAr: "اتصال VLAN 10 بـ VLAN 20 يفشل رغم وجود مسار",
    titleEn: "VLAN 10 cannot reach VLAN 20 although a route exists",
    infoAr:
      "السويتش يعرض trunk بينه وبين الراوتر. الأمر show interfaces trunk يبين أن VLAN 10 مسموحة، لكن VLAN 20 غير موجودة ضمن allowed VLANs. عناوين البوابات على الراوتر صحيحة.",
    infoEn:
      "A trunk connects the switch to the router. show interfaces trunk shows VLAN 10 allowed, but VLAN 20 is missing from the allowed VLAN list. Router gateway addresses are correct.",
    optionsAr: [
      "إضافة VLAN 20 إلى قائمة VLANs المسموحة على trunk والتحقق من وجودها",
      "تغيير خادم DNS",
      "إيقاف STP",
    ],
    optionsEn: [
      "Allow VLAN 20 on the trunk and verify the VLAN exists",
      "Change the DNS server",
      "Disable STP",
    ],
    answer: 0,
    explainAr:
      "يجب أن تكون VLAN موجودة ومسموحة على مسار trunk، وأن تكون إعدادات native VLAN متوافقة عند استخدامها. افحص show vlan brief وshow interfaces trunk ثم اختبر الاتصال.",
    explainEn:
      "The VLAN must exist and be allowed across the trunk, with matching native VLAN settings where applicable. Check show vlan brief and show interfaces trunk, then retest.",
  },
  {
    id: "s13",
    titleAr: "خادم HTTPS لا يستجيب بعد إضافة ACL",
    titleEn: "HTTPS server stopped responding after an ACL was added",
    infoAr:
      "المستخدمون في 192.168.10.0/24 لا يصلون إلى الخادم 192.168.20.10 على TCP/443. أضيفت قاعدة permit tcp إلى ACL، لكنها جاءت بعد deny ip any any.",
    infoEn:
      "Users in 192.168.10.0/24 cannot reach server 192.168.20.10 on TCP/443. A permit tcp rule was added to the ACL, but it appears after deny ip any any.",
    optionsAr: [
      "نقل قاعدة السماح قبل قاعدة المنع مع التحقق من اتجاه تطبيق ACL",
      "إضافة DNS آخر",
      "إعادة تشغيل جميع السويتشات",
    ],
    optionsEn: [
      "Move the permit rule before the deny and verify ACL direction",
      "Add another DNS server",
      "Reboot all switches",
    ],
    answer: 0,
    explainAr:
      "تُعالج قواعد ACL المرتبة من الأعلى إلى الأسفل، وغالباً يتوقف الفحص عند أول تطابق. قاعدة المنع سبقت السماح فأسقطت الحركة. راجع ترتيب القواعد والواجهة والاتجاه قبل التعديل.",
    explainEn:
      "Ordered ACL entries are evaluated top-down, commonly stopping at the first match. The earlier deny drops the traffic before the permit is reached. Review rule order, interface and direction before changing it.",
  },
  {
    id: "s14",
    titleAr: "المسار الثابت موجود لكن الوصول إلى الشبكة البعيدة يفشل",
    titleEn: "Static route exists but the remote network remains unreachable",
    infoAr:
      "R1 لديه مسار إلى 192.168.20.0/24 عبر 10.0.0.2، ويمكنه ping إلى 10.0.0.2. لكن R2 لا يحتوي على مسار عودة إلى شبكة R1 وهي 192.168.10.0/24.",
    infoEn:
      "R1 has a route to 192.168.20.0/24 via 10.0.0.2 and can ping 10.0.0.2. R2 has no return route to R1's 192.168.10.0/24 network.",
    optionsAr: [
      "إضافة مسار عودة على R2 والتحقق من ACL",
      "تغيير عنوان MAC على R1",
      "تغيير DNS على أجهزة الشبكتين",
    ],
    optionsEn: [
      "Add a return route on R2 and check ACLs",
      "Change R1's MAC address",
      "Change DNS on both networks",
    ],
    answer: 0,
    explainAr:
      "نجاح الوصول إلى Next Hop يثبت جزءاً من الاتصال فقط. يجب أن يعرف R2 طريق العودة إلى مصدر الحزم، وإلا قد تصل الطلبات ولا تعود الردود. افحص جدول التوجيه في الطرفين.",
    explainEn:
      "Reaching the next hop proves only part of the path. R2 needs a route back to the source, or requests may arrive while replies cannot return. Inspect routing tables on both routers.",
  },
  {
    id: "s15",
    titleAr: "Port Forwarding لا يعمل من الإنترنت",
    titleEn: "Port forwarding does not work from the Internet",
    infoAr:
      "قاعدة dst-nat تحول TCP/8443 إلى خادم داخلي، والخادم يستجيب من شبكة LAN. عنوان WAN في الراوتر هو 100.72.15.8، بينما يظهر موقع فحص عنوان الإنترنت عنواناً عاماً مختلفاً.",
    infoEn:
      "A dst-nat rule forwards TCP/8443 to an internal server, which responds on the LAN. The router WAN address is 100.72.15.8, while an external IP-check site reports a different public address.",
    optionsAr: [
      "التحقق من CGNAT وطلب IPv4 عام أو استخدام VPN مناسب",
      "فتح كل منافذ الراوتر",
      "تعطيل Firewall بالكامل",
    ],
    optionsEn: [
      "Check for CGNAT and request a public IPv4 or use an appropriate VPN",
      "Open every router port",
      "Disable the firewall entirely",
    ],
    answer: 0,
    explainAr:
      "العنوان 100.72.15.8 يقع ضمن نطاق 100.64.0.0/10 المخصص لـ Shared Address Space ويشير غالباً إلى CGNAT لدى المزود. لا يكفي إعداد Port Forwarding على راوتر العميل وحده؛ تحقق مع المزود من إمكانية الحصول على عنوان عام.",
    explainEn:
      "100.72.15.8 is within 100.64.0.0/10 shared address space and commonly indicates ISP CGNAT. Port forwarding on the customer router alone is insufficient; ask the ISP whether a public address is available.",
  },
];
