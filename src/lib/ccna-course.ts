import type { Lesson } from "./lesson-types";

export const ccnaDomains = [
  { id: "fundamentals", version: "v1.1", ar: "أساسيات الشبكات", en: "Network Fundamentals", weight: 20, objectives: "1.1–1.13" },
  { id: "access", version: "v1.1", ar: "الوصول إلى الشبكة", en: "Network Access", weight: 20, objectives: "2.1–2.9" },
  { id: "connectivity", version: "v1.1", ar: "اتصال IP والتوجيه", en: "IP Connectivity", weight: 25, objectives: "3.1–3.5" },
  { id: "services", version: "v1.1", ar: "خدمات IP", en: "IP Services", weight: 10, objectives: "4.1–4.9" },
  { id: "security", version: "v1.1", ar: "أساسيات أمن الشبكات", en: "Security Fundamentals", weight: 15, objectives: "5.1–5.10" },
  { id: "automation", version: "v1.1", ar: "الأتمتة والبرمجة", en: "Automation & Programmability", weight: 10, objectives: "6.1–6.7" },
  { id: "v2-infrastructure", version: "v2.0", ar: "البنية التحتية والاتصال", en: "Network Infrastructure and Connectivity", weight: 25, objectives: "1.1–1.7" },
  { id: "v2-switching", version: "v2.0", ar: "التحويل والوصول إلى الشبكة", en: "Switching and Network Access", weight: 25, objectives: "2.1–2.5" },
  { id: "v2-routing", version: "v2.0", ar: "توجيه IP", en: "IP Routing", weight: 20, objectives: "3.1–3.4" },
  { id: "v2-services", version: "v2.0", ar: "خدمات الشبكة والأمن", en: "Network Services and Security", weight: 20, objectives: "4.1–4.7" },
  { id: "v2-operations", version: "v2.0", ar: "الذكاء الاصطناعي وتشغيل الشبكات", en: "AI, Network Operations and Management", weight: 10, objectives: "5.1–5.6" },
] as const;

export const ccnaLessons: Lesson[] = [
  {
    id: "ccna-network-components",
    level: "beginner", domain: "fundamentals", objective: "1.1–1.2",
    titleAr: "مكونات الشبكة وتصميم البنية",
    titleEn: "Network components and architecture",
    bodyAr: [
      "الراوتر Router يربط شبكات IP مختلفة ويتخذ قرار تمرير الحزم. سويتش Layer 2 يمرر إطارات Ethernet اعتماداً على MAC، بينما سويتش Layer 3 يستطيع تنفيذ التوجيه بين شبكات VLAN.",
      "الجدار الناري Firewall يطبق سياسات السماح والمنع، وأنظمة IPS تفحص الحركة لاكتشاف الهجمات ومنعها. نقطة الوصول AP تربط العملاء لاسلكياً، ويتولى WLC أو Cisco DNA Center إدارة الشبكات اللاسلكية أو مركزية الشبكة. الخوادم تقدم خدمات مثل DNS وDHCP والملفات، وPoE يمد بعض الأجهزة بالطاقة عبر كابل Ethernet.",
      "التصميم Two-tier يجمع طبقتي التوزيع والوصول، وThree-tier يفصل Core وDistribution وAccess. Spine-leaf شائع في مراكز البيانات. WAN تربط المواقع البعيدة، وSOHO يناسب المنزل والمكتب الصغير. يمكن استضافة الخدمات On-premises محلياً أو في Cloud.",
      "اختر التصميم وفق الحجم والتوسع والاعتمادية والتكلفة؛ لا يوجد تصميم واحد مناسب لكل مؤسسة."
    ],
    bodyEn: [
      "A router connects different IP networks and forwards packets. A Layer 2 switch forwards Ethernet frames using MAC addresses; a Layer 3 switch can route between VLANs.",
      "A firewall enforces traffic policy, while an IPS inspects traffic to detect and prevent attacks. An access point connects wireless clients; a WLC or Cisco DNA Center provides centralized management. Servers provide services such as DNS, DHCP and file sharing. PoE supplies power over Ethernet cabling.",
      "Two-tier combines distribution and access, while three-tier separates core, distribution and access. Spine-leaf is common in data centers. WAN connects distant sites; SOHO serves small offices. Services may run on-premises or in the cloud.",
      "Choose an architecture based on scale, growth, resilience and cost; no single design fits every organization."
    ],
    quiz: [
      { qAr: "أي جهاز يربط شبكات IP مختلفة؟", qEn: "Which device connects different IP networks?", options: ["Router", "Layer 2 switch", "Access point"], answer: 0 },
      { qAr: "ما وظيفة PoE؟", qEn: "What does PoE provide?", options: ["Power over Ethernet", "IP routing", "Wireless encryption"], answer: 0 }
    ]
  },
  {
    id: "ccna-cabling-interfaces",
    level: "beginner", domain: "fundamentals", objective: "1.3–1.4",
    titleAr: "الكابلات والواجهات ومشكلات الطبقة الفيزيائية",
    titleEn: "Cabling, interfaces and physical-layer faults",
    bodyAr: [
      "النحاس Twisted Pair مناسب لوصلات Ethernet الشائعة داخل المباني، والألياف الضوئية تقاوم التداخل الكهرومغناطيسي وتناسب المسافات الأعلى. Single-mode يستخدم لمدى أطول ونواة أدق، وMultimode شائع للمسافات الأقصر داخل المباني ومراكز البيانات.",
      "Ethernet point-to-point يربط طرفين عبر وصلة مخصصة. Shared media يجعل عدة أجهزة تتشارك الوسط؛ وتقل التصادمات في Ethernet الحديثة المعتمدة على السويتش والاتصال Full-duplex.",
      "Half-duplex يسمح بالإرسال في اتجاه واحد في اللحظة نفسها، أما Full-duplex فيسمح بالإرسال والاستقبال معاً. اختلاف السرعة أو Duplex بين الطرفين قد يسبب بطئاً وأخطاء وLate collisions.",
      "افحص حالة المنفذ والكابل والطرفين، ثم استخدم show interfaces لقراءة السرعة وDuplex والعدادات مثل CRC وinput errors. لا تستبدل الكابل قبل تحديد الدليل."
    ],
    bodyEn: [
      "Twisted-pair copper is common for in-building Ethernet. Fiber resists electromagnetic interference and supports longer distances. Single-mode has a narrow core for longer reach; multimode is common for shorter building and data-center links.",
      "A point-to-point Ethernet link connects two endpoints over a dedicated link. Shared media is used by multiple devices; modern switched full-duplex Ethernet avoids collisions.",
      "Half-duplex transmits in one direction at a time; full-duplex sends and receives simultaneously. Speed or duplex mismatches can cause poor performance and errors.",
      "Check link state, cable and both endpoints. Use show interfaces to inspect speed, duplex, CRC and input-error counters. Diagnose before replacing hardware."
    ],
    quiz: [
      { qAr: "أي نوع ألياف يناسب المسافات الأطول غالباً؟", qEn: "Which fiber is generally used for longer distances?", options: ["Single-mode", "Multimode", "Copper"], answer: 0 },
      { qAr: "ما الذي قد يسببه اختلاف Duplex؟", qEn: "What can a duplex mismatch cause?", options: ["Interface errors", "More IP addresses", "DNS resolution"], answer: 0 }
    ]
  },
  {
    id: "ccna-tcp-udp",
    level: "beginner", domain: "fundamentals", objective: "1.5",
    titleAr: "TCP وUDP والمنافذ",
    titleEn: "TCP, UDP and transport ports",
    bodyAr: [
      "TCP بروتوكول اتصالي موثوق: ينشئ جلسة عبر Three-way handshake (SYN, SYN-ACK, ACK)، ويرقم البيانات ويعيد الإرسال عند الفقد ويتحكم بالتدفق والازدحام.",
      "UDP لا ينشئ جلسة ولا يضمن التسليم أو الترتيب؛ ترويساته أخف ويستخدم عندما تكون السرعة أو البساطة مهمة مثل DNS وVoIP والبث.",
      "رقم المنفذ يحدد التطبيق على الجهاز. أمثلة مهمة: HTTP 80، HTTPS 443، SSH 22، DNS 53، DHCP 67/68، FTP 20/21، NTP 123، SNMP 161/162.",
      "تذكر أن IP يحدد الجهاز/الواجهة، والمنفذ يحدد الخدمة، وTCP أو UDP يحدد طريقة النقل."
    ],
    bodyEn: [
      "TCP is connection-oriented and reliable. It establishes a session with the three-way handshake (SYN, SYN-ACK, ACK), sequences data, retransmits loss and provides flow and congestion control.",
      "UDP is connectionless and does not guarantee delivery or order. Its smaller header is useful when low latency or simplicity matters, such as DNS queries, VoIP and streaming.",
      "A port identifies an application service. Common ports: HTTP 80, HTTPS 443, SSH 22, DNS 53, DHCP 67/68, FTP 20/21, NTP 123 and SNMP 161/162.",
      "IP identifies the host/interface, the port identifies the service, and TCP or UDP defines the transport behavior."
    ],
    quiz: [
      { qAr: "أي بروتوكول ينفذ Three-way handshake؟", qEn: "Which protocol uses a three-way handshake?", options: ["TCP", "UDP", "ICMP"], answer: 0 },
      { qAr: "المنفذ الافتراضي لـ HTTPS؟", qEn: "Default HTTPS port?", options: ["22", "53", "443"], answer: 2 }
    ]
  },
  {
    id: "ccna-ipv4-subnetting",
    level: "intermediate", domain: "fundamentals", objective: "1.6–1.7",
    titleAr: "IPv4 وتقسيم الشبكات والعناوين الخاصة",
    titleEn: "IPv4 addressing, subnetting and private ranges",
    bodyAr: [
      "IPv4 عنوان من 32 بت. قناع الشبكة أو Prefix يحدد بتات الشبكة وبتات المضيف. مثال /24 يساوي 255.255.255.0 ويحتوي 256 عنواناً إجمالياً، عادةً 254 عنوان مضيف قابل للاستخدام في شبكة تقليدية.",
      "لحساب الشبكات: حدد حجم الكتلة من قيمة الأوكتت المتغير (256 ناقص قيمة القناع)، ثم استخرج Network ID وBroadcast وأول وآخر عنوان مضيف. لا تفترض أن كل الشبكات تستخدم /24.",
      "النطاقات الخاصة RFC1918 هي 10.0.0.0/8 و172.16.0.0/12 و192.168.0.0/16، ولا تُوجّه مباشرة عبر الإنترنت العام. غالباً تستخدم NAT للوصول إلى الإنترنت.",
      "أوامر Cisco للتحقق: show ip interface brief وshow running-config interface، وعلى الأجهزة الطرفية ipconfig /all في Windows أو ip addr في Linux."
    ],
    bodyEn: [
      "IPv4 is a 32-bit address. The subnet mask or prefix separates network bits from host bits. A /24 equals 255.255.255.0 and has 256 total addresses, typically 254 usable host addresses on a traditional subnet.",
      "To subnet, find the block size in the changing octet (256 minus the mask value), then identify the network ID, broadcast address and usable host range. Not every subnet is /24.",
      "RFC1918 private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. They are not routed directly across the public Internet and commonly use NAT for Internet access.",
      "Verify with Cisco show ip interface brief and show running-config interface; use ipconfig /all on Windows or ip addr on Linux clients."
    ],
    quiz: [
      { qAr: "كم عدد عناوين المضيف القابلة للاستخدام عادة في /24؟", qEn: "How many usable host addresses are typically in a /24?", options: ["254", "256", "128"], answer: 0 },
      { qAr: "أي نطاق خاص؟", qEn: "Which range is private?", options: ["10.0.0.0/8", "9.0.0.0/8", "200.1.1.0/24"], answer: 0 }
    ]
  },
  {
    id: "ccna-ipv6",
    level: "intermediate", domain: "fundamentals", objective: "1.8–1.9",
    titleAr: "IPv6 والعناوين والبادئات",
    titleEn: "IPv6 addressing and address types",
    bodyAr: [
      "IPv6 يستخدم 128 بت ويكتب في ثمانية مقاطع Hexadecimal. يمكن حذف الأصفار البادئة داخل المقطع واستخدام :: مرة واحدة فقط لاختصار سلسلة مقاطع صفرية.",
      "Global Unicast قابل للتوجيه عالمياً، وUnique Local للاستخدام الخاص داخل المؤسسات، وLink-local من FE80::/10 ويستخدم على الوصلة المحلية. Multicast يرسل إلى مجموعة، وAnycast يوجه إلى أقرب عضو من مجموعة تشترك في العنوان.",
      "Modified EUI-64 طريقة لتوليد Interface ID من MAC في بعض السيناريوهات، مع إدخال FF:FE وتعديل بت U/L؛ لكن أنظمة حديثة قد تستخدم عناوين عشوائية للخصوصية.",
      "على Cisco: ipv6 unicast-routing لتفعيل التوجيه، ثم ipv6 address 2001:db8:1::1/64 على الواجهة، والتحقق عبر show ipv6 interface brief وshow ipv6 route."
    ],
    bodyEn: [
      "IPv6 uses 128 bits and is written as eight hexadecimal groups. Leading zeros in a group may be omitted, and :: may compress one consecutive run of zero groups only once.",
      "Global Unicast is globally routable; Unique Local is private to an organization; Link-local uses FE80::/10 on the local link. Multicast targets a group, while Anycast delivers to the nearest member sharing an address.",
      "Modified EUI-64 can derive an interface ID from a MAC address by inserting FF:FE and changing the U/L bit. Modern systems may instead use privacy/randomized addresses.",
      "On Cisco IOS, enable routing with ipv6 unicast-routing, configure ipv6 address 2001:db8:1::1/64, and verify with show ipv6 interface brief and show ipv6 route."
    ],
    quiz: [
      { qAr: "ما طول عنوان IPv6؟", qEn: "What is the length of an IPv6 address?", options: ["32 bits", "64 bits", "128 bits"], answer: 2 },
      { qAr: "ما نطاق Link-local؟", qEn: "Which prefix is IPv6 link-local?", options: ["FE80::/10", "2000::/3", "FC00::/7"], answer: 0 }
    ]
  },
  {
    id: "ccna-wireless-virtual-switching",
    level: "intermediate", domain: "fundamentals", objective: "1.10–1.13",
    titleAr: "اللاسلكي والافتراضية ومفاهيم التحويل",
    titleEn: "Wireless, virtualization and switching concepts",
    bodyAr: [
      "تحقق من إعدادات العميل: IP والقناع والبوابة وDNS. في Windows استخدم ipconfig /all وroute print، وفي Linux استخدم ip addr وip route وresolvectl status.",
      "SSID هو اسم WLAN. تتأثر Wi-Fi بالتردد والقناة والتداخل وقوة الإشارة. في 2.4GHz القنوات غير المتداخلة الشائعة 1 و6 و11 في كثير من البيئات التنظيمية؛ أما 5 و6GHz فتتوفر قنوات أكثر وفق الدولة والجهاز.",
      "Server virtualization تشغل عدة آلات افتراضية على Hypervisor واحد، والحاويات تشارك نواة نظام التشغيل، وVRF تنشئ جداول توجيه منفصلة منطقياً على الجهاز نفسه.",
      "السويتش يتعلم Source MAC من الإطارات الواردة ويبني MAC address table مع مؤقت Aging. يمرر الإطار للمنفذ المعروف، ويعمل Flooding للـUnknown unicast أو Broadcast ضمن VLAN، مع عدم إرساله عادةً إلى منفذ الدخول."
    ],
    bodyEn: [
      "Verify client IP, mask, gateway and DNS. On Windows use ipconfig /all and route print; on Linux use ip addr, ip route and resolvectl status.",
      "SSID is the WLAN name. Wi-Fi is affected by band, channel, interference and signal strength. In many regulatory domains, 2.4-GHz non-overlapping channels are 1, 6 and 11; 5 and 6 GHz provide more channel options depending on country and device.",
      "Server virtualization runs multiple virtual machines on a hypervisor. Containers share the host OS kernel. VRFs maintain logically separate routing tables on one device.",
      "A switch learns the source MAC of incoming frames and maintains a MAC address table with aging. It forwards known unicast to the learned port and floods unknown unicast or broadcast within the VLAN, excluding the ingress port."
    ],
    quiz: [
      { qAr: "ما وظيفة MAC aging؟", qEn: "What is MAC aging for?", options: ["Remove stale MAC entries", "Assign IP addresses", "Encrypt Wi-Fi"], answer: 0 },
      { qAr: "ما الذي يفصل جداول التوجيه منطقياً؟", qEn: "What logically separates routing tables?", options: ["VRF", "SSID", "PoE"], answer: 0 }
    ]
  },
  {
    id: "ccna-vlans-intervlan",
    level: "intermediate", domain: "access", objective: "2.1–2.2",
    titleAr: "VLAN وTrunk وInter-VLAN Routing",
    titleEn: "VLANs, trunks and inter-VLAN routing",
    bodyAr: [
      "VLAN تقسم مجال البث Layer 2 إلى شبكات منطقية. منفذ Access ينتمي عادة إلى VLAN بيانات واحدة، ويمكن إعداد Voice VLAN لهاتف IP. VLAN 1 هي الافتراضية في كثير من إعدادات Cisco، لكن الأفضل نقل الإدارة والبيانات إلى VLANs مخططة.",
      "أنشئ VLAN ثم اربط المنفذ: vlan 10 ثم interface gi0/1 ثم switchport mode access ثم switchport access vlan 10. تحقق باستخدام show vlan brief.",
      "Trunk يحمل عدة VLANs بين السويتشات أو إلى الراوتر، ويستخدم 802.1Q لإضافة Tag للإطارات. Native VLAN تمر دون Tag على trunk؛ يجب أن تتطابق على الطرفين لتجنب مشكلات أمنية واتصالية.",
      "الاتصال بين VLANs يحتاج Layer 3: Router-on-a-stick مع subinterfaces وencapsulation dot1Q، أو SVI على سويتش Layer 3 مع ip routing. تحقق من show interfaces trunk وshow ip interface brief."
    ],
    bodyEn: [
      "A VLAN divides a Layer 2 broadcast domain into logical networks. An access port normally belongs to one data VLAN and may also carry a voice VLAN for an IP phone. VLAN 1 is the common Cisco default, but management and user traffic should be planned into appropriate VLANs.",
      "Create a VLAN and assign a port: vlan 10, interface gi0/1, switchport mode access, switchport access vlan 10. Verify with show vlan brief.",
      "A trunk carries multiple VLANs between switches or to a router, using 802.1Q tags. Native VLAN frames are sent untagged; native VLAN settings should match on both ends.",
      "Inter-VLAN connectivity requires Layer 3 routing: router-on-a-stick subinterfaces with encapsulation dot1Q, or Layer 3 switch SVIs with ip routing. Verify with show interfaces trunk and show ip interface brief."
    ],
    quiz: [
      { qAr: "ما المنفذ الذي يحمل عدة VLANs؟", qEn: "Which port carries multiple VLANs?", options: ["Trunk", "Access", "Console"], answer: 0 },
      { qAr: "ما معيار الوسم المستخدم في trunk؟", qEn: "Which tagging standard is used on trunks?", options: ["802.1Q", "802.11ax", "802.3af"], answer: 0 }
    ]
  },
  {
    id: "ccna-discovery-etherchannel",
    level: "intermediate", domain: "access", objective: "2.3–2.4",
    titleAr: "CDP وLLDP وEtherChannel",
    titleEn: "CDP, LLDP and EtherChannel",
    bodyAr: [
      "CDP بروتوكول اكتشاف خاص بسيسكو، وLLDP معيار مفتوح IEEE 802.1AB. يعرضان معلومات الجيران مثل اسم الجهاز والمنفذ والمنصة، ويساعدان في توثيق التوصيلات.",
      "أوامر التحقق: show cdp neighbors detail وshow lldp neighbors detail. عطّل بروتوكولات الاكتشاف على المنافذ غير الموثوقة إذا كانت سياسة الأمن تتطلب ذلك.",
      "EtherChannel يجمع عدة وصلات في Port-Channel منطقي لزيادة السعة والاعتمادية. LACP معيار مفتوح؛ وضعا التفاوض Active وPassive، ويلزم توافق السرعة وDuplex وVLAN/trunk والإعدادات بين الأعضاء.",
      "مثال: interface range gi0/1-2 ثم channel-group 1 mode active. تحقق عبر show etherchannel summary وshow interfaces port-channel 1."
    ],
    bodyEn: [
      "CDP is Cisco proprietary; LLDP is the open IEEE 802.1AB discovery protocol. Both reveal neighbor details such as device name, port and platform, helping validate cabling and documentation.",
      "Verify with show cdp neighbors detail and show lldp neighbors detail. Disable discovery on untrusted ports when required by security policy.",
      "EtherChannel bundles multiple physical links into one logical Port-Channel for capacity and resilience. LACP is an open standard with Active and Passive negotiation. Member links must have compatible speed, duplex, VLAN/trunk and other settings.",
      "Example: interface range gi0/1-2, then channel-group 1 mode active. Verify with show etherchannel summary and show interfaces port-channel 1."
    ],
    quiz: [
      { qAr: "أي بروتوكول اكتشاف مفتوح؟", qEn: "Which discovery protocol is open standard?", options: ["LLDP", "CDP", "VTP"], answer: 0 },
      { qAr: "ما الوضع الذي يبدأ تفاوض LACP؟", qEn: "Which LACP mode initiates negotiation?", options: ["Active", "Passive", "Shutdown"], answer: 0 }
    ]
  },
  {
    id: "ccna-spanning-tree",
    level: "advanced", domain: "access", objective: "2.5",
    titleAr: "Rapid PVST+ وSpanning Tree",
    titleEn: "Rapid PVST+ and spanning tree",
    bodyAr: [
      "وجود وصلات Layer 2 زائدة قد يصنع حلقات Broadcast Storm وتكرار الإطارات. STP يمنع الحلقة من خلال اختيار Root Bridge وحجب بعض المسارات مع إبقاء مسار منطقي خالٍ من الحلقات.",
      "يُختار Root Bridge حسب أقل Bridge ID (الأولوية ثم MAC). Root Port هو أفضل مسار نحو الجذر على السويتش غير الجذر، وDesignated Port يمرر على القطاع، والمنفذ البديل قد يبقى غير ممرر.",
      "Rapid PVST+ يشغل نسخة مستقلة لكل VLAN ويوفر تقارباً أسرع. PortFast يسرع انتقال منافذ الأجهزة الطرفية إلى Forwarding، ولا يستخدم على وصلات السويتشات العادية.",
      "BPDU Guard يحمي منفذ PortFast بإغلاقه عند استقبال BPDU. Root Guard يمنع جهازاً آخر من فرض نفسه جذراً، وLoop Guard يحمي من فقدان BPDUs، وBPDU Filter يوقف إرسال/استقبال BPDUs ويجب استخدامه بحذر."
    ],
    bodyEn: [
      "Redundant Layer 2 links can create loops, broadcast storms and duplicate frames. STP prevents loops by electing a root bridge and blocking selected paths while preserving a loop-free logical topology.",
      "The lowest Bridge ID wins (priority, then MAC). A root port is the best path toward the root on a non-root switch; a designated port forwards for a segment; an alternate port can remain non-forwarding.",
      "Rapid PVST+ runs an instance per VLAN and converges faster. PortFast moves edge ports quickly to forwarding and should not be enabled on ordinary switch-to-switch links.",
      "BPDU Guard protects PortFast ports by shutting them when BPDUs arrive. Root Guard prevents another switch from becoming root; Loop Guard protects against missing BPDUs. BPDU Filter suppresses BPDUs and must be used carefully."
    ],
    quiz: [
      { qAr: "ما الهدف الأساسي من STP؟", qEn: "What is the main purpose of STP?", options: ["Prevent Layer 2 loops", "Assign IP addresses", "Encrypt frames"], answer: 0 },
      { qAr: "أين يستخدم PortFast عادة؟", qEn: "Where is PortFast normally used?", options: ["Edge host ports", "Inter-switch trunks", "WAN serial links"], answer: 0 }
    ]
  },
  {
    id: "ccna-wireless-management",
    level: "intermediate", domain: "access", objective: "2.6–2.9",
    titleAr: "معمارية WLAN وإدارة أجهزة الشبكة",
    titleEn: "WLAN architecture and network device management",
    bodyAr: [
      "قد تكون نقاط الوصول Autonomous وتدار منفردة، أو Lightweight تتواصل مع WLC مركزياً. من أنماط AP: Local لخدمة العملاء، وMonitor للمراقبة، وSniffer لالتقاط الإطارات، وتختلف الأنماط حسب المنصة.",
      "تتصل AP بالسويتش عبر Access أو Trunk حسب تصميم عدة WLAN/VLANs. قد يستخدم WLC منافذ متعددة مجمعة عبر LAG. افهم مسار VLAN من العميل إلى AP ثم السويتش ثم WLC والشبكة السلكية.",
      "إدارة الأجهزة تكون عبر Console للوصول المحلي، SSH للوصول المشفر، Telnet غير مشفر ويُتجنب، وHTTP/HTTPS لواجهات الويب. TACACS+ وRADIUS يقدمان خدمات AAA مركزية، كما توجد إدارة Cloud-managed.",
      "في واجهة WLC راجع إنشاء WLAN وربط SSID بالـVLAN، وسياسة الأمان، وQoS profile، والإعدادات المتقدمة مثل السياسات والتجوال. اختبر اتصال العميل والتحقق من عنوانه وبوابته."
    ],
    bodyEn: [
      "Access points may be autonomous and managed individually, or lightweight and centrally managed by a WLC. AP modes include Local for client service, Monitor for monitoring and Sniffer for packet capture, depending on platform.",
      "An AP connects to a switch using an access or trunk port depending on the WLAN/VLAN design. A WLC may bundle multiple interfaces with LAG. Understand the client-to-AP-to-switch-to-WLC traffic path.",
      "Device management options include local Console, encrypted SSH, insecure Telnet, and HTTP/HTTPS web interfaces. TACACS+ and RADIUS provide centralized AAA; cloud-managed platforms provide hosted management.",
      "In a WLC GUI, review WLAN creation, SSID-to-VLAN mapping, security policy, QoS profile and advanced settings. Validate client association, addressing and gateway reachability."
    ],
    quiz: [
      { qAr: "أي بروتوكول يوفر وصولاً مشفراً لسطر الأوامر؟", qEn: "Which protocol provides encrypted CLI access?", options: ["SSH", "Telnet", "HTTP"], answer: 0 },
      { qAr: "ما الجهاز الذي يدير Lightweight AP مركزياً؟", qEn: "What centrally manages lightweight APs?", options: ["WLC", "DHCP relay", "Layer 2 hub"], answer: 0 }
    ]
  },
  {
    id: "ccna-routing-table-forwarding",
    level: "advanced", domain: "connectivity", objective: "3.1–3.2",
    titleAr: "جدول التوجيه وقرار تمرير الحزم",
    titleEn: "Routing table and packet-forwarding decisions",
    bodyAr: [
      "يحتوي جدول التوجيه على مصدر المسار ورمز البروتوكول والبادئة والقناع وNext Hop والواجهة الخارجة. الرموز الشائعة: C متصل مباشرة، L عنوان محلي للواجهة، S ثابت، O تعلم عبر OSPF.",
      "Administrative Distance تقارن موثوقية مصادر المسارات المختلفة؛ الأقل أفضل. Metric تقارن المسارات داخل البروتوكول نفسه وفق خوارزميته. لا تخلط بين AD وMetric.",
      "يختار الراوتر أولاً أطول Prefix Match للوجهة. إذا تطابقت البادئة نفسها من مصادر مختلفة، تدخل Administrative Distance ثم Metric في الاختيار. Gateway of last resort هو المسار الافتراضي عند عدم وجود مسار أكثر تحديداً.",
      "استخدم show ip route وshow ipv6 route لقراءة الجدول، وshow ip protocols لمعلومات بروتوكولات التوجيه."
    ],
    bodyEn: [
      "A routing table includes route source/code, prefix and mask, next hop and outgoing interface. Common codes include C connected, L local, S static and O OSPF.",
      "Administrative Distance compares the trustworthiness of different route sources; lower is preferred. A metric compares paths within a routing protocol according to its algorithm. Do not confuse AD with metric.",
      "A router first selects the longest prefix match for the destination. When the prefix is equal across sources, administrative distance and then metric influence selection. The gateway of last resort is the default route.",
      "Use show ip route and show ipv6 route to inspect routes, and show ip protocols for routing-protocol information."
    ],
    quiz: [
      { qAr: "ما الذي يفضله الراوتر أولاً؟", qEn: "What does a router prefer first?", options: ["Longest prefix match", "Highest metric", "Oldest route"], answer: 0 },
      { qAr: "أي قيمة أقل تكون أفضل عند مقارنة AD؟", qEn: "Which AD value is preferred?", options: ["Lower", "Higher", "Always 255"], answer: 0 }
    ]
  },
  {
    id: "ccna-static-routing",
    level: "advanced", domain: "connectivity", objective: "3.3",
    titleAr: "التوجيه الثابت وDefault Route",
    titleEn: "Static routes and default routing",
    bodyAr: [
      "المسار الثابت يضيفه مسؤول الشبكة يدوياً. Network route يصل إلى شبكة، وHost route يصل إلى مضيف واحد (/32 في IPv4 أو /128 في IPv6)، وDefault route يستخدم عند عدم وجود تطابق أدق.",
      "مثال IPv4: ip route 10.10.20.0 255.255.255.0 192.168.1.2. المسار الافتراضي: ip route 0.0.0.0 0.0.0.0 192.168.1.2. IPv6: ipv6 route 2001:db8:20::/64 2001:db8:1::2.",
      "Floating static route هو مسار احتياطي تضبط له AD أعلى من المسار الأساسي؛ لا يستخدم عادة إلا عند اختفاء المسار الأفضل.",
      "تحقق من next-hop قابل للوصول ومن وجود مسار عودة Return Route. استخدم show ip route static وping وtraceroute لتشخيص المسار."
    ],
    bodyEn: [
      "A static route is manually configured. A network route reaches a network, a host route reaches one host (/32 in IPv4 or /128 in IPv6), and a default route is used when no more-specific match exists.",
      "IPv4 example: ip route 10.10.20.0 255.255.255.0 192.168.1.2. Default route: ip route 0.0.0.0 0.0.0.0 192.168.1.2. IPv6: ipv6 route 2001:db8:20::/64 2001:db8:1::2.",
      "A floating static route is a backup configured with a higher administrative distance than the primary route, so it is used when the preferred route disappears.",
      "Verify next-hop reachability and the return route. Use show ip route static, ping and traceroute to troubleshoot."
    ],
    quiz: [
      { qAr: "ما Prefix لمسار مضيف IPv4؟", qEn: "What is an IPv4 host-route prefix?", options: ["/32", "/24", "/0"], answer: 0 },
      { qAr: "كيف تجعل Static Route احتياطياً؟", qEn: "How do you make a static route floating?", options: ["Set higher AD", "Set lower AD", "Remove next hop"], answer: 0 }
    ]
  },
  {
    id: "ccna-ospf",
    level: "advanced", domain: "connectivity", objective: "3.4",
    titleAr: "OSPFv2 في منطقة واحدة",
    titleEn: "Single-area OSPFv2",
    bodyAr: [
      "OSPF بروتوكول توجيه Link-State داخلي يستخدم Cost كمقياس ويكوّن قاعدة بيانات LSDB ثم يشغل SPF لحساب أفضل المسارات. في منهج CCNA ركز على OSPFv2 ضمن Area 0 واحدة.",
      "يجب أن تتطابق إعدادات الجيران الأساسية مثل Area ID وHello/Dead timers ونوع الشبكة والمصادقة إن وجدت، وأن تكون الواجهات متصلة وقابلة للوصول.",
      "Router ID معرف 32 بت وفريد داخل نطاق OSPF. على شبكات Broadcast قد ينتخب OSPF DR وBDR لتقليل عدد علاقات الجوار الكاملة؛ أما Point-to-point فلا يحتاج انتخابهما.",
      "مثال: router ospf 1 ثم router-id 1.1.1.1 ثم network 10.0.0.0 0.0.0.255 area 0. تحقق عبر show ip ospf neighbor وshow ip route ospf."
    ],
    bodyEn: [
      "OSPF is an interior link-state routing protocol. It uses cost, builds a link-state database and runs SPF to calculate best paths. The CCNA focus is single-area OSPFv2 in Area 0.",
      "Neighbor settings must agree on key parameters such as Area ID, hello/dead timers, network type and authentication when configured. Interfaces must be up and reachable.",
      "The Router ID is a unique 32-bit identifier within the OSPF domain. On broadcast networks, OSPF elects a DR and BDR to reduce full adjacencies; point-to-point links do not need that election.",
      "Example: router ospf 1, router-id 1.1.1.1, network 10.0.0.0 0.0.0.255 area 0. Verify with show ip ospf neighbor and show ip route ospf."
    ],
    quiz: [
      { qAr: "ما المقياس الأساسي في OSPF؟", qEn: "What is OSPF's metric?", options: ["Cost", "Hop count only", "Bandwidth reservation"], answer: 0 },
      { qAr: "ما المنطقة الأساسية في تصميم OSPF؟", qEn: "What is the backbone OSPF area?", options: ["Area 0", "Area 10", "Area 255"], answer: 0 }
    ]
  },
  {
    id: "ccna-first-hop-redundancy",
    level: "advanced", domain: "connectivity", objective: "3.5",
    titleAr: "بروتوكولات التكرار للبوابة الأولى",
    titleEn: "First-hop redundancy protocols",
    bodyAr: [
      "إذا كانت أجهزة المستخدمين تعتمد على راوتر واحد كبوابة افتراضية، فإن تعطله يقطع الاتصال خارج الشبكة المحلية. First Hop Redundancy Protocols توفر بوابة افتراضية مشتركة بين عدة راوترات.",
      "تشارك الأجهزة عنوان IP افتراضياً وعنوان MAC افتراضياً؛ يكون أحدها Active أو Master ويستلم الآخر عند فشل الجهاز أو المسار حسب البروتوكول.",
      "أمثلة: HSRP من Cisco، وVRRP معيار مفتوح، وGLBP من Cisco يوفر توزيعاً للتحميل إضافة إلى التكرار. المطلوب فهم الغرض والمفاهيم وليس الخلط بينها وبين بروتوكولات التوجيه.",
      "اختبر توافر البوابة الافتراضية وحالة Active/Standby بعد فصل الواجهة أو تغيير الأولوية في مختبر آمن."
    ],
    bodyEn: [
      "If clients use one router as their default gateway, its failure cuts off off-subnet connectivity. First-hop redundancy protocols provide a shared virtual gateway across multiple routers.",
      "Routers share a virtual IP and virtual MAC. One device is Active or Master while another takes over after a failure, according to the protocol.",
      "Examples include Cisco HSRP, open-standard VRRP and Cisco GLBP, which can also provide load balancing. Understand their purpose and concepts; do not confuse them with routing protocols.",
      "Test virtual-gateway reachability and Active/Standby state after a controlled interface failure or priority change in a lab."
    ],
    quiz: [
      { qAr: "ما الهدف من FHRP؟", qEn: "What is the purpose of FHRP?", options: ["Redundant default gateway", "Encrypt DNS", "Assign VLAN IDs"], answer: 0 },
      { qAr: "أي خيار معيار مفتوح؟", qEn: "Which option is an open standard?", options: ["VRRP", "HSRP", "GLBP"], answer: 0 }
    ]
  },
  {
    id: "ccna-nat-dhcp-dns",
    level: "intermediate", domain: "services", objective: "4.1–4.3, 4.6",
    titleAr: "NAT وDHCP وDNS",
    titleEn: "NAT, DHCP and DNS",
    bodyAr: [
      "NAT يترجم عناوين IP بين الشبكات. Static NAT يربط عنواناً خاصاً بعام بصورة ثابتة، وDynamic NAT يستخدم Pool من العناوين العامة، وPAT/Overload يشارك عنواناً عاماً عبر أرقام المنافذ.",
      "DHCP يوزع إعدادات العميل تلقائياً مثل IP والقناع والبوابة وDNS. تسلسل DORA هو Discover وOffer وRequest وAcknowledge. DHCP Relay يمرر طلبات العملاء إلى خادم في شبكة أخرى باستخدام ip helper-address على واجهة Layer 3.",
      "DNS يحول أسماء النطاقات إلى عناوين IP. عند فشل الوصول بالاسم مع نجاح الوصول إلى IP، افحص DNS والبوابة وخادم الأسماء قبل اتهام الكابل.",
      "تحقق من NAT باستخدام show ip nat translations وshow ip nat statistics، ومن DHCP باستخدام show ip dhcp binding وshow ip dhcp pool."
    ],
    bodyEn: [
      "NAT translates IP addresses between networks. Static NAT maps one private address to one public address; dynamic NAT uses a public pool; PAT/overload shares one public address using transport ports.",
      "DHCP automatically assigns client settings such as IP, mask, gateway and DNS. DORA means Discover, Offer, Request and Acknowledge. A DHCP relay forwards client broadcasts to a server on another network using ip helper-address on a Layer 3 interface.",
      "DNS resolves domain names to IP addresses. If IP reachability works but name access fails, inspect DNS settings and the resolver before blaming the cable.",
      "Verify NAT with show ip nat translations and show ip nat statistics; inspect DHCP with show ip dhcp binding and show ip dhcp pool."
    ],
    quiz: [
      { qAr: "ما معنى DORA في DHCP؟", qEn: "What does DORA stand for in DHCP?", options: ["Discover Offer Request Acknowledge", "Data Open Route Access", "Domain Option Relay Address"], answer: 0 },
      { qAr: "ما الذي يتيح مشاركة عنوان عام واحد؟", qEn: "What allows many hosts to share one public IP?", options: ["PAT", "Static NAT only", "DNS"], answer: 0 }
    ]
  },
  {
    id: "ccna-ntp-monitoring-qos",
    level: "intermediate", domain: "services", objective: "4.2, 4.4–4.5, 4.7",
    titleAr: "NTP وSNMP وSyslog وQoS",
    titleEn: "NTP, SNMP, Syslog and QoS",
    bodyAr: [
      "NTP يزامن الوقت بين الأجهزة؛ التوقيت الدقيق مهم لتحليل السجلات وربط الأحداث. يمكن للجهاز العمل كعميل NTP أو خادم/مصدر وقت حسب التصميم.",
      "SNMP يستخدم للمراقبة والإدارة عبر Manager وAgent وMIB. المنافذ المعتادة UDP 161 للاستعلامات و162 للـTraps. يفضل SNMPv3 لأنه يدعم المصادقة والتشفير.",
      "Syslog يجمع رسائل الأحداث. مستويات الخطورة من 0 Emergency إلى 7 Debug؛ الرقم الأقل أشد خطورة. Facility يحدد مصدر الرسالة أو نوعها.",
      "QoS يصنف الحركة ويضع علامات مثل DSCP، ثم يستخدم Queuing لإدارة الازدحام. Policing يحد المعدل وقد يسقط أو يعيد وسم الحركة، بينما Shaping يؤخر الحركة لتنعيم معدل الإرسال."
    ],
    bodyEn: [
      "NTP synchronizes device clocks. Accurate time is essential for log analysis and event correlation. A device may operate as an NTP client or provide time to other devices.",
      "SNMP monitors and manages devices using a manager, agent and MIB. Common ports are UDP 161 for queries and 162 for traps. SNMPv3 is preferred because it supports authentication and encryption.",
      "Syslog collects event messages. Severity levels range from 0 Emergency to 7 Debug; lower numbers mean greater severity. Facility identifies the message source/type.",
      "QoS classifies traffic and marks it, for example with DSCP, then uses queuing to manage congestion. Policing enforces a rate and may drop or remark traffic; shaping buffers and smooths traffic."
    ],
    quiz: [
      { qAr: "أي SNMP version يدعم التشفير؟", qEn: "Which SNMP version supports encryption?", options: ["SNMPv3", "SNMPv1", "SNMPv2c only"], answer: 0 },
      { qAr: "ما الفرق الأساسي بين Shaping وPolicing؟", qEn: "What is a key difference between shaping and policing?", options: ["Shaping buffers traffic", "Policing always buffers", "They are identical"], answer: 0 }
    ]
  },
  {
    id: "ccna-ssh-file-transfer",
    level: "intermediate", domain: "services", objective: "4.8–4.9",
    titleAr: "إدارة الأجهزة عبر SSH وFTP وTFTP",
    titleEn: "SSH, FTP and TFTP for device management",
    bodyAr: [
      "SSH يوفر جلسة CLI مشفرة، بينما Telnet يرسل البيانات بما فيها كلمات المرور دون تشفير. لتجهيز SSH على Cisco: hostname، ip domain-name، crypto key generate rsa، username، ثم line vty مع login local وtransport input ssh.",
      "استخدم SSH version 2 وسياسات كلمات مرور قوية، وقيّد مصادر الإدارة عبر ACL أو شبكة إدارة مخصصة. لا تفتح الوصول الإداري من الإنترنت بلا حاجة.",
      "TFTP بروتوكول بسيط لنقل الملفات دون مصادقة أو تشفير مدمجين، ويستخدم غالباً في بيئات موثوقة لنسخ ملفات الإعداد أو الصور. FTP يدعم جلسة تحكم ونقل بيانات لكنه غير مشفر افتراضياً؛ استخدم بدائل آمنة عند نقل بيانات حساسة.",
      "تحقق من الوصول باستخدام show ip ssh وshow users، واختبر نقل الملفات مع التأكد من المسار والصلاحيات والاتصال."
    ],
    bodyEn: [
      "SSH provides an encrypted CLI session, while Telnet sends data, including passwords, without encryption. On Cisco, configure hostname and domain name, generate RSA keys, create a user, then configure VTY lines with login local and transport input ssh.",
      "Use SSH version 2, strong credentials and restrict management sources with an ACL or dedicated management network. Avoid exposing administrative access to the Internet unnecessarily.",
      "TFTP is a simple file-transfer protocol without built-in authentication or encryption and is often used in trusted environments for configuration or image transfers. FTP has separate control and data channels but is not encrypted by default; use secure alternatives for sensitive data.",
      "Verify with show ip ssh and show users, and test file transfer while checking path, permissions and reachability."
    ],
    quiz: [
      { qAr: "أي بروتوكول مشفر لإدارة CLI؟", qEn: "Which protocol encrypts CLI management?", options: ["SSH", "Telnet", "TFTP"], answer: 0 },
      { qAr: "هل TFTP يوفر تشفيراً مدمجاً؟", qEn: "Does TFTP provide built-in encryption?", options: ["No", "Yes, always", "Only over IPv6"], answer: 0 }
    ]
  },
  {
    id: "ccna-security-concepts",
    level: "beginner", domain: "security", objective: "5.1–5.2",
    titleAr: "مفاهيم الأمن والتهديدات والسياسات",
    titleEn: "Security concepts, threats and policies",
    bodyAr: [
      "Threat تهديد قد يسبب ضرراً، Vulnerability ثغرة أو ضعف، Exploit طريقة تستغل الضعف، وMitigation إجراء يقلل الاحتمال أو الأثر. أمثلة التهديدات: Malware وPhishing وDoS وRogue AP.",
      "مبادئ CIA هي Confidentiality السرية، Integrity السلامة، Availability التوافر. طبّق أقل صلاحية، التقسيم الشبكي، النسخ الاحتياطي والتحديثات.",
      "برنامج الأمن يشمل توعية المستخدمين والتدريب، إدارة الحسابات، سياسات الاستخدام، التحكم المادي بالدخول، حماية غرف الخوادم، وإجراءات الاستجابة للحوادث.",
      "الأمن عملية مستمرة: حدّد الأصول والمخاطر، طبّق الضوابط، راقب، اختبر، ثم حسّن."
    ],
    bodyEn: [
      "A threat can cause harm; a vulnerability is a weakness; an exploit takes advantage of that weakness; mitigation reduces likelihood or impact. Threat examples include malware, phishing, DoS and rogue access points.",
      "The CIA triad is Confidentiality, Integrity and Availability. Apply least privilege, segmentation, backups and timely patching.",
      "A security program includes user awareness and training, account management, acceptable-use policies, physical access controls for server rooms and incident-response procedures.",
      "Security is continuous: identify assets and risks, apply controls, monitor, test and improve."
    ],
    quiz: [
      { qAr: "ما المقصود بالثغرة؟", qEn: "What is a vulnerability?", options: ["A weakness", "A security update", "A network cable"], answer: 0 },
      { qAr: "أي مبدأ يعني بقاء الخدمة متاحة؟", qEn: "Which CIA principle means services remain available?", options: ["Availability", "Confidentiality", "Integrity"], answer: 0 }
    ]
  },
  {
    id: "ccna-device-access-aaa",
    level: "intermediate", domain: "security", objective: "5.3–5.4, 5.8",
    titleAr: "حماية الدخول وكلمات المرور وAAA",
    titleEn: "Device access, password policy and AAA",
    bodyAr: [
      "احمِ Console وVTY وPrivileged EXEC بكلمات مرور قوية، واستخدم enable secret بدلاً من enable password. فعّل service password-encryption كحماية شكلية للبيانات النصية القديمة، لكنه ليس بديلاً عن التشفير الحديث.",
      "سياسة كلمة المرور تشمل الطول والتعقيد وعدم إعادة الاستخدام والتخزين الآمن ومدير كلمات مرور. بدائل/عوامل التحقق تشمل MFA والشهادات والقياسات الحيوية.",
      "AAA تعني Authentication التحقق من الهوية، Authorization تحديد ما يسمح للمستخدم بفعله، وAccounting تسجيل ما قام به. يمكن تنفيذها محلياً أو عبر RADIUS/TACACS+.",
      "RADIUS شائع للوصول الشبكي ويجمع Authentication وAuthorization غالباً، بينما TACACS+ يفصل الوظائف ويشفّر معظم محتوى الحزم، ويستخدم كثيراً لإدارة أجهزة الشبكة."
    ],
    bodyEn: [
      "Protect Console, VTY and privileged EXEC with strong credentials. Prefer enable secret over enable password. service password-encryption is only obfuscation for legacy plain-text passwords, not a substitute for modern encryption.",
      "Password policy includes length, complexity, avoiding reuse and secure storage with a password manager. Alternative authentication factors include MFA, certificates and biometrics.",
      "AAA means Authentication (identity verification), Authorization (permitted actions) and Accounting (activity records). It may be local or centralized with RADIUS/TACACS+.",
      "RADIUS is common for network access and commonly combines authentication and authorization. TACACS+ separates the functions and encrypts most packet contents; it is widely used for network-device administration."
    ],
    quiz: [
      { qAr: "ما وظيفة Accounting في AAA؟", qEn: "What does Accounting do in AAA?", options: ["Records activity", "Verifies identity", "Assigns IP addresses"], answer: 0 },
      { qAr: "أي أمر يحفظ سر enable بصورة أفضل؟", qEn: "Which command better protects the enable secret?", options: ["enable secret", "enable password", "no service password-encryption"], answer: 0 }
    ]
  },
  {
    id: "ccna-vpn-acl",
    level: "advanced", domain: "security", objective: "5.5–5.6",
    titleAr: "VPN وIPsec وقوائم التحكم ACL",
    titleEn: "VPN, IPsec and access control lists",
    bodyAr: [
      "VPN تنشئ اتصالاً منطقياً آمناً عبر شبكة غير موثوقة. Remote-access VPN يربط مستخدمًا بعيداً بالمؤسسة، وSite-to-site VPN يربط شبكتين أو موقعين.",
      "IPsec يوفر خدمات أمنية على طبقة IP مثل السرية والتكامل والمصادقة ومقاومة إعادة الإرسال. مفاهيمه تشمل IKE للتفاوض وESP لحماية حركة البيانات؛ تفاصيل التنفيذ تعتمد على المنصة.",
      "ACL قائمة قواعد مرتبة تسمح أو تمنع الحركة وفق المصدر والوجهة والبروتوكول والمنافذ. يوجد Standard ACL غالباً حسب المصدر، وExtended ACL تسمح بفحص عناصر أكثر.",
      "تُفحص ACL من الأعلى للأسفل، وأول تطابق يطبق، وفي النهاية يوجد implicit deny. ضع القاعدة الأقرب للتحديد أولاً، وراجع اتجاه التطبيق In/Out باستخدام show access-lists وshow ip interface."
    ],
    bodyEn: [
      "A VPN creates a logical secure connection over an untrusted network. A remote-access VPN connects an individual user to an organization; a site-to-site VPN connects two networks or sites.",
      "IPsec provides IP-layer security services such as confidentiality, integrity, authentication and anti-replay. Concepts include IKE for negotiation and ESP for protecting data traffic; implementation details vary by platform.",
      "An ACL is an ordered set of permit/deny rules matching source, destination, protocol and ports. Standard ACLs commonly match source addresses; extended ACLs can match more fields.",
      "ACLs are evaluated top-down; the first match applies, followed by an implicit deny. Order specific rules carefully and verify direction with show access-lists and show ip interface."
    ],
    quiz: [
      { qAr: "ما نوع VPN الذي يربط موقعين؟", qEn: "Which VPN connects two sites?", options: ["Site-to-site", "Remote-access", "Clientless DNS"], answer: 0 },
      { qAr: "ماذا يحدث إذا لم تطابق الحزمة أي ACE؟", qEn: "What happens if no ACL entry matches?", options: ["Implicit deny", "Implicit permit", "Packet is encrypted"], answer: 0 }
    ]
  },
  {
    id: "ccna-layer2-security",
    level: "advanced", domain: "security", objective: "5.7",
    titleAr: "أمن الطبقة الثانية: Port Security وDHCP Snooping",
    titleEn: "Layer 2 security: port security and DHCP snooping",
    bodyAr: [
      "Port Security يقيّد عناوين MAC المسموح بها على منفذ Access. يمكن تعلم العناوين يدوياً أو Sticky، وتحدد سياسة المخالفة مثل protect أو restrict أو shutdown حسب النظام.",
      "DHCP Snooping يميز منافذ Trusted وUntrusted ويمنع رسائل DHCP Server غير المصرح بها من المنافذ غير الموثوقة، ويبني Binding Table.",
      "Dynamic ARP Inspection يستخدم قاعدة DHCP Snooping للتحقق من رسائل ARP ومنع ARP spoofing. يجب ضبط Trust على وصلات الخوادم/السويتشات الموثوقة وفق التصميم.",
      "فعّل الميزات تدريجياً بعد فهم الطوبولوجيا حتى لا تمنع DHCP أو ARP الصحيح. تحقق عبر show port-security interface وshow ip dhcp snooping وshow ip arp inspection."
    ],
    bodyEn: [
      "Port Security limits the MAC addresses allowed on an access port. Addresses may be configured statically or learned with sticky learning; violation actions include protect, restrict or shutdown depending on platform.",
      "DHCP Snooping distinguishes trusted and untrusted ports and blocks unauthorized DHCP server messages from untrusted ports while building a binding table.",
      "Dynamic ARP Inspection uses DHCP Snooping bindings to validate ARP messages and mitigate ARP spoofing. Configure trust on legitimate server/switch uplinks according to the topology.",
      "Enable these features carefully so legitimate DHCP and ARP are not blocked. Verify with show port-security interface, show ip dhcp snooping and show ip arp inspection."
    ],
    quiz: [
      { qAr: "أي ميزة تمنع DHCP Server غير المصرح به؟", qEn: "Which feature blocks unauthorized DHCP servers?", options: ["DHCP Snooping", "PortFast", "NTP"], answer: 0 },
      { qAr: "ما الذي يساعد DAI على التحقق منه؟", qEn: "What does DAI help validate?", options: ["ARP messages", "DNS records", "TCP windows"], answer: 0 }
    ]
  },
  {
    id: "ccna-wireless-security",
    level: "intermediate", domain: "security", objective: "5.9–5.10",
    titleAr: "أمن Wi-Fi وWPA2 وWPA3",
    titleEn: "Wireless security: WPA2 and WPA3",
    bodyAr: [
      "WEP قديم وضعيف ويجب عدم استخدامه. WPA حسّن الحماية، وWPA2 مع AES-CCMP أصبح معياراً واسع الاستخدام، بينما WPA3 يقدم حماية أقوى مثل SAE في Personal mode.",
      "استخدم كلمة مرور طويلة وفريدة، وحدث Firmware، وعطّل WPS إذا لم تكن هناك حاجة موثوقة، وافصل شبكة الضيوف عن شبكة الإدارة والأجهزة الداخلية.",
      "في WPA2-Personal يستخدم PSK مشتركاً بين المستخدمين. في Enterprise يستخدم 802.1X مع خادم RADIUS للتحقق الفردي من المستخدمين.",
      "في WLC GUI أنشئ WLAN/SSID، اربطه بالـVLAN الصحيحة، اختر WPA2-PSK/AES وفق المطلوب، أدخل مفتاحاً قوياً، ثم اختبر انضمام عميل والتحقق من حصوله على إعدادات IP."
    ],
    bodyEn: [
      "WEP is obsolete and insecure. WPA improved security; WPA2 with AES-CCMP became widely deployed; WPA3 adds stronger protection such as SAE in Personal mode.",
      "Use a long unique passphrase, update firmware, disable WPS when not needed, and isolate guest wireless from management and internal networks.",
      "WPA2-Personal uses a shared pre-shared key. Enterprise mode uses 802.1X with a RADIUS server for individual user authentication.",
      "In the WLC GUI, create a WLAN/SSID, map it to the correct VLAN, select WPA2-PSK/AES as required, set a strong key and test client association and IP configuration."
    ],
    quiz: [
      { qAr: "أي معيار لاسلكي حديث يستخدم SAE؟", qEn: "Which modern Wi-Fi security standard uses SAE?", options: ["WPA3", "WEP", "WPA"], answer: 0 },
      { qAr: "ما الذي يستخدمه WPA2 Enterprise عادة؟", qEn: "What does WPA2 Enterprise commonly use?", options: ["802.1X and RADIUS", "Shared PSK only", "TFTP"], answer: 0 }
    ]
  },
  {
    id: "ccna-automation-controller",
    level: "intermediate", domain: "automation", objective: "6.1–6.4",
    titleAr: "الأتمتة والشبكات المعتمدة على Controllers والذكاء الاصطناعي",
    titleEn: "Automation, controller-based networking and AI",
    bodyAr: [
      "الأتمتة تقلل الأعمال اليدوية المتكررة وتدعم الاتساق والسرعة وتقليل الأخطاء، لكنها تحتاج قوالب واختبارات وصلاحيات ومراجعة للتغييرات.",
      "الشبكة التقليدية تدار جهازاً بجهاز عبر CLI غالباً. الشبكة المعتمدة على Controller تستخدم إدارة وسياسات مركزية ورؤية موحدة، وقد تفصل Control Plane عن Data Plane.",
      "في SDN، Underlay هي شبكة النقل الأساسية، وOverlay شبكة منطقية مبنية فوقها، وFabric بنية مترابطة تقدم خدمات وسياسات متناسقة. Northbound APIs تربط التطبيقات بالـController، وSouthbound APIs تربطه بالأجهزة.",
      "الذكاء الاصطناعي التنبؤي يتوقع الأعطال أو الحمل من البيانات، والتوليدي يساعد في تلخيص السجلات واقتراح إعدادات أو تحليلها. يجب مراجعة مخرجاته والتحقق منها قبل تطبيق تغييرات على الشبكة."
    ],
    bodyEn: [
      "Automation reduces repetitive manual work and improves consistency, speed and error reduction, but requires templates, tests, permissions and change review.",
      "Traditional networks are often managed device by device through CLI. Controller-based networks use centralized policy and visibility and may separate the control plane from the data plane.",
      "In SDN, the underlay is the transport network, the overlay is a logical network built on top, and a fabric provides consistent connectivity and policy. Northbound APIs connect applications to the controller; southbound APIs connect it to devices.",
      "Predictive AI forecasts faults or load from data. Generative AI can summarize logs, suggest configurations and analyze issues. Always validate outputs before applying network changes."
    ],
    quiz: [
      { qAr: "ما وظيفة Underlay؟", qEn: "What is the underlay?", options: ["Physical transport network", "Application API", "Wireless password"], answer: 0 },
      { qAr: "أي ذكاء اصطناعي يتوقع الأعطال من الأنماط؟", qEn: "Which AI approach forecasts faults from patterns?", options: ["Predictive AI", "Only generative AI", "Neither"], answer: 0 }
    ]
  },
  {
    id: "ccna-rest-json",
    level: "intermediate", domain: "automation", objective: "6.5, 6.7",
    titleAr: "REST API وHTTP وJSON",
    titleEn: "REST APIs, HTTP and JSON",
    bodyAr: [
      "REST أسلوب لبناء واجهات API فوق HTTP. أشهر الأفعال: GET للقراءة، POST للإنشاء أو الإجراء، PUT للاستبدال، PATCH للتعديل الجزئي، وDELETE للحذف.",
      "CRUD تعني Create وRead وUpdate وDelete. قد تستخدم APIs المصادقة عبر Token أو API key أو OAuth 2.0. لا تضع الأسرار في الشيفرة أو المستودعات العامة.",
      "JSON صيغة بيانات تتكون من Objects بين أقواس معقوفة، Arrays بين أقواس مربعة، وأزواج key/value. القيم قد تكون نصاً أو رقماً أو Boolean أو null أو كائناً أو مصفوفة.",
      'مثال JSON: {"hostname":"SW1","enabled":true,"vlans":[10,20]}. انتبه إلى علامات الاقتباس المزدوجة والفواصل وصحة البنية.'
    ],
    bodyEn: [
      "REST is an architectural style for APIs over HTTP. Common methods: GET reads, POST creates or triggers an action, PUT replaces, PATCH partially updates and DELETE removes.",
      "CRUD means Create, Read, Update and Delete. APIs may authenticate with tokens, API keys or OAuth 2.0. Never place secrets in source code or public repositories.",
      "JSON contains objects in curly braces, arrays in square brackets and key/value pairs. Values may be strings, numbers, booleans, null, objects or arrays.",
      'Example JSON: {"hostname":"SW1","enabled":true,"vlans":[10,20]}. Pay attention to double quotes, commas and valid structure.'
    ],
    quiz: [
      { qAr: "أي HTTP method يقرأ البيانات؟", qEn: "Which HTTP method reads data?", options: ["GET", "DELETE", "PATCH"], answer: 0 },
      { qAr: "أي صيغة تستخدم أقواساً مربعة للمصفوفات؟", qEn: "Which format uses square brackets for arrays?", options: ["JSON", "CSV only", "Plain text"], answer: 0 }
    ]
  },
  {
    id: "ccna-ansible-terraform",
    level: "advanced", domain: "automation", objective: "6.6",
    titleAr: "Ansible وTerraform وإدارة الإعدادات",
    titleEn: "Ansible, Terraform and configuration management",
    bodyAr: [
      "Ansible أداة أتمتة تعتمد عادة على Playbooks مكتوبة بصيغة YAML وتنفذ مهاماً على أجهزة متعددة، وغالباً عبر SSH دون Agent دائم على الهدف.",
      "Terraform أداة Infrastructure as Code تصف الموارد المطلوبة بصورة تصريحية، وتستخدم Providers للتعامل مع منصات سحابية أو خدمات وبنى تحتية مدعومة.",
      "الفرق المبسط: Ansible قوي في إدارة الإعدادات وتنفيذ المهام، وTerraform قوي في إنشاء الموارد والبنية وإدارة حالتها. قد تتكامل الأداتان في سير عمل واحد.",
      "استخدم Version Control، ومراجعة التغييرات، وبيئات اختبار، وأسراراً مخزنة بأمان، وخططاً قابلة للمراجعة قبل التطبيق. الأتمتة الخاطئة قد تنشر خطأً على عدد كبير من الأجهزة بسرعة."
    ],
    bodyEn: [
      "Ansible is an automation tool commonly using YAML playbooks to run tasks across devices, often over SSH without a permanent agent on the target.",
      "Terraform is an Infrastructure as Code tool that declaratively describes desired resources and uses providers to manage supported cloud and infrastructure platforms.",
      "In simple terms, Ansible is strong for configuration management and task execution; Terraform is strong for provisioning and managing infrastructure resources. They can be combined.",
      "Use version control, peer review, test environments, secure secret storage and reviewable plans before applying changes. Incorrect automation can spread a mistake across many devices quickly."
    ],
    quiz: [
      { qAr: "أي أداة تستخدم Playbooks بصيغة YAML؟", qEn: "Which tool commonly uses YAML playbooks?", options: ["Ansible", "Terraform only", "Wireshark"], answer: 0 },
      { qAr: "ما مفهوم Infrastructure as Code؟", qEn: "What does Infrastructure as Code mean?", options: ["Describe infrastructure in files", "Configure only by console cable", "Replace IP addressing"], answer: 0 }
    ]
  }

,
  {
    id: "ccna-v2-infrastructure",
    level: "intermediate", domain: "v2-infrastructure", objective: "1.1–1.7",
    titleAr: "منهج v2.0: تشخيص البنية التحتية والاتصال",
    titleEn: "v2.0: Infrastructure and connectivity troubleshooting",
    bodyAr: [
      "يركز إصدار v2.0 على تشخيص الأعطال عملياً: افحص الكابلات النحاسية والضوئية، المسافة ومستوى الإشارة والـpinout، وسرعة الواجهة وDuplex وأخطاء CRC والتصادمات.",
      "راجع إعداد IPv4 وIPv6 وتخصيص العناوين والـPrefix، ثم اختبر الاتصال من العميل إلى البوابة والوجهة. استخدم أدوات نظام التشغيل لقراءة IP وRoute وDNS، وميّز بين فشل الربط وفشل التوجيه وفشل تحليل الأسماء.",
      "في Wi-Fi راجع نطاق التردد والقناة وخصائص RF والتداخل وبروتوكول الأمان. افحص إعدادات العميل السلكية واللاسلكية على Windows وmacOS وLinux.",
      "تعامل مع DHCPv4 من منظور العميل والخادم وRelay على IOS: تحقق من نطاق العناوين، الاستثناءات، Binding، ip helper-address، وإمكانية الوصول إلى الخادم."
    ],
    bodyEn: [
      "v2.0 emphasizes practical troubleshooting: inspect copper and fiber cabling, distance, signal levels and pinout, as well as interface speed, duplex, CRC errors and collisions.",
      "Verify IPv4 and IPv6 addressing, assignment and prefix sizing. Test from client to gateway and destination. Use OS tools to inspect IP, routes and DNS, distinguishing link, routing and name-resolution failures.",
      "For Wi-Fi, review band, channel, RF characteristics, interference and security protocol. Inspect wired and wireless client settings on Windows, macOS and Linux.",
      "Troubleshoot DHCPv4 clients, servers and IOS relay: verify scopes, exclusions, bindings, ip helper-address and reachability to the DHCP server."
    ],
    quiz: [
      { qAr: "أي قيمة تساعد في اكتشاف أخطاء الطبقة الفيزيائية؟", qEn: "Which counter helps identify physical-layer errors?", options: ["CRC", "DNS TTL", "HTTP status"], answer: 0 },
      { qAr: "ما الأمر الذي يربط DHCP relay بخادم بعيد على IOS؟", qEn: "Which IOS command points a DHCP relay to a remote server?", options: ["ip helper-address", "ip route-cache", "switchport voice vlan"], answer: 0 }
    ]
  },
  {
    id: "ccna-v2-switching",
    level: "advanced", domain: "v2-switching", objective: "2.1–2.5",
    titleAr: "منهج v2.0: إعداد السويتشات والوصول وتشخيص Layer 2",
    titleEn: "v2.0: Switching, network access and Layer 2 troubleshooting",
    bodyAr: [
      "تدرّب على إعداد وصلات Switch-to-Switch وSwitch-to-Router، وواجهات Layer 2/Layer 3، وTrunk 802.1Q، وEtherChannel/LACP، وواجهات SVI لإدارة السويتش أو توجيه VLANs.",
      "اضبط منافذ الحافة للأجهزة مثل الحواسيب والطابعات وأجهزة IoT وهواتف VoIP ونقاط الوصول والخوادم الافتراضية وأجهزة الشبكة. راجع VLAN وPoE وPort-Channel وLACP.",
      "استخدم CDP وLLDP لمقارنة التوصيلات الفعلية مع مخطط الشبكة. اقرأ مخرجات show وshow logging، واختبر ping وextended ping وtraceroute، وافهم متى يفيد Packet Capture.",
      "في Rapid PVST+ حدد Root Bridge وRoot Port وDesignated Port وحالات المنافذ، واضبط PortFast وRoot Guard وLoop Guard وBPDU Guard وفق دور المنفذ."
    ],
    bodyEn: [
      "Configure switch-to-switch and switch-to-router connectivity, Layer 2/Layer 3 interfaces, 802.1Q trunks, EtherChannel/LACP and SVIs for switch management or inter-VLAN routing.",
      "Configure edge ports for desktops, printers, IoT, VoIP phones, access points, virtualized hosts and network appliances. Review VLAN, PoE, Port-Channel and LACP settings.",
      "Use CDP and LLDP to validate physical connections against documentation. Interpret show and show logging output, test with ping, extended ping and traceroute, and understand packet-capture output.",
      "For Rapid PVST+, identify the root bridge, root and designated ports and port states. Apply PortFast, Root Guard, Loop Guard and BPDU Guard according to port role."
    ],
    quiz: [
      { qAr: "ما واجهة Layer 3 الافتراضية على السويتش؟", qEn: "What is a Layer 3 virtual interface on a switch?", options: ["SVI", "Console", "Access Point"], answer: 0 },
      { qAr: "أي أمر يفيد في قراءة سجل أحداث الجهاز؟", qEn: "Which command displays device log messages?", options: ["show logging", "show vlan brief only", "copy running-config"], answer: 0 }
    ]
  },
  {
    id: "ccna-v2-routing",
    level: "advanced", domain: "v2-routing", objective: "3.1–3.4",
    titleAr: "منهج v2.0: توجيه IPv4 وIPv6 وOSPFv3",
    titleEn: "v2.0: IPv4/IPv6 routing and OSPFv3",
    bodyAr: [
      "اقرأ جدول التوجيه لتحديد البروتوكول والبادئة والقناع وAdministrative Distance وMetric والبوابة الافتراضية، ثم استنتج Next Hop الصحيح للحزمة.",
      "شخّص المسارات الثابتة لـIPv4 وIPv6: Default Route وNetwork Route وHost Route وFloating Static. افحص صحة الـNext Hop ومسار العودة والواجهة الخارجة.",
      "إصدار v2.0 يوسع OSPF ليشمل OSPFv2 لـIPv4 وOSPFv3 لـIPv6 ضمن منطقة واحدة. راجع تكوين الجوار، Point-to-point وBroadcast وانتخاب DR/BDR وRouter ID.",
      "افهم حالة التشغيل لبروتوكولات First Hop Redundancy، خصوصاً HSRP وVRRP، وتحقق من الجهاز Active/Master والبوابة الافتراضية عند فشل رابط."
    ],
    bodyEn: [
      "Read the routing table to identify protocol, prefix/mask, administrative distance, metric and default route, then determine the correct next hop for a packet.",
      "Troubleshoot IPv4 and IPv6 static routes: default, network, host and floating static routes. Check next-hop validity, return path and outgoing interface.",
      "v2.0 expands OSPF to include OSPFv2 for IPv4 and OSPFv3 for IPv6 in a single area. Review neighbor adjacencies, point-to-point and broadcast networks, DR/BDR election and Router ID.",
      "Interpret operational state of first-hop redundancy protocols, especially HSRP and VRRP, and verify the Active/Master device and virtual gateway after a link failure."
    ],
    quiz: [
      { qAr: "أي بروتوكول يضيف دعم توجيه IPv6 في منهج v2.0؟", qEn: "Which OSPF version supports IPv6 in v2.0?", options: ["OSPFv3", "OSPFv2 only", "RIPng only"], answer: 0 },
      { qAr: "ما الذي يجب التحقق منه في HSRP؟", qEn: "What should you verify in HSRP?", options: ["Active/Standby state", "DNS MX record", "Wi-Fi channel width"], answer: 0 }
    ]
  },
  {
    id: "ccna-v2-services-security",
    level: "advanced", domain: "v2-services", objective: "4.1–4.7",
    titleAr: "منهج v2.0: خدمات الشبكة والأمن",
    titleEn: "v2.0: Network services and security",
    bodyAr: [
      "اضبط حسابات محلية على أجهزة الشبكة واستخدمها مع AAA client للاتصال بخوادم TACACS+ أو RADIUS لإدارة الدخول والصلاحيات والتدقيق.",
      "تعلم نقل ملفات الإعدادات والبرمجيات بأمان باستخدام SFTP وSCP بدلاً من بروتوكولات نقل غير مشفرة. تحقق من هوية الخادم والصلاحيات ومسار الملف.",
      "اضبط NAT/PAT على IOS XE، وشخّص سجلات DNS من الأنواع A وAAAA وCNAME وMX وNS وPTR عندما يتعذر الوصول إلى خدمة باسمها.",
      "راجع VPN باستخدام IPsec للوصول عن بعد أو Site-to-site، وأنواع البروتوكولات وTransport Mode. اضبط IPv4 Standard وExtended ACLs المرقمة والمسماة.",
      "ميزات Layer 2 Security في v2.0 تشمل DHCP Snooping وDynamic ARP Inspection وStorm Control وRA Guard وPort Security. طبّقها على المنافذ الصحيحة وتحقق من عدم تعطيل الحركة الشرعية."
    ],
    bodyEn: [
      "Configure local usernames on network devices and use them with an AAA client to connect to TACACS+ or RADIUS servers for access, authorization and accounting.",
      "Securely transfer configuration and software files using SFTP and SCP instead of unencrypted transfer protocols. Verify server identity, permissions and file paths.",
      "Configure NAT/PAT on IOS XE and troubleshoot DNS record types A, AAAA, CNAME, MX, NS and PTR when services cannot be reached by name.",
      "Review remote-access and site-to-site IPsec VPNs, protocol choices and transport mode. Configure numbered and named IPv4 standard and extended ACLs.",
      "v2.0 Layer 2 security includes DHCP Snooping, Dynamic ARP Inspection, Storm Control, RA Guard and Port Security. Apply each feature to the correct ports and verify legitimate traffic remains available."
    ],
    quiz: [
      { qAr: "ما البروتوكولان الآمنان لنقل الملفات في v2.0؟", qEn: "Which secure file-transfer protocols are covered in v2.0?", options: ["SFTP and SCP", "TFTP and Telnet", "HTTP and FTP"], answer: 0 },
      { qAr: "ما سجل DNS المستخدم لربط اسم بريد بخادم البريد؟", qEn: "Which DNS record maps a mail domain to its mail server?", options: ["MX", "PTR", "AAAA"], answer: 0 }
    ]
  },
  {
    id: "ccna-v2-ai-operations",
    level: "intermediate", domain: "v2-operations", objective: "5.1–5.6",
    titleAr: "منهج v2.0: الذكاء الاصطناعي وتشغيل الشبكات",
    titleEn: "v2.0: AI and network operations",
    bodyAr: [
      "Agentic AI قد يخطط وينفذ سلسلة إجراءات تشغيلية عبر أدوات متصلة، مثل جمع معلومات الأجهزة وتحليلها واقتراح إجراء. يجب تقييد صلاحياته ومراجعة العمليات الحساسة قبل التنفيذ.",
      "عند اختيار Prompt لنظام توليدي، حدد تصنيف البيانات المسموح مشاركتها، ودور المساعد، والسياق، والتعليمات، وشكل المخرجات المطلوب. لا ترسل كلمات مرور أو أسراراً أو بيانات حساسة.",
      "أساليب إدارة الشبكة تشمل الإدارة المباشرة لكل جهاز، والإدارة السحابية Cloud-based، والمتحكم Controller-based، والأتمتة Automation-based، وInfrastructure as Code.",
      "SNMP يجمع معلومات المراقبة، وSyslog يوفر رسائل الأحداث ومستويات الخطورة والـFacility. ويمكن استخدام Ansible لتنفيذ أوامر وإعدادات متكررة على أجهزة متعددة.",
      "تعامل مع نتائج AI وملفات الإعداد كاقتراحات تحتاج تحققاً: قارن المخرجات بالحالة الفعلية، اختبر في بيئة آمنة، واحتفظ بخطة رجوع."
    ],
    bodyEn: [
      "Agentic AI may plan and execute multi-step operational tasks through connected tools, such as collecting device data, analyzing it and proposing actions. Restrict its permissions and review sensitive operations before execution.",
      "When selecting a prompt for generative AI, specify allowed data classification, persona, context, instructions and output format. Never send passwords, secrets or sensitive information.",
      "Network management approaches include device-based, cloud-based, controller-based, automation-based and infrastructure as code.",
      "SNMP collects monitoring data; Syslog provides event messages, severity and facility. Ansible can execute repeated commands and configurations across multiple devices.",
      "Treat AI output and configuration files as proposals that require validation: compare results with the real state, test safely and keep a rollback plan."
    ],
    quiz: [
      { qAr: "ما الذي يجب تحديده في Prompt تشغيلي جيد؟", qEn: "What should a good operational prompt specify?", options: ["Data classification and output format", "Passwords and private keys", "Only a device name"], answer: 0 },
      { qAr: "أي أداة تنفذ أوامر متكررة عبر أجهزة متعددة؟", qEn: "Which tool can execute repeated tasks across many devices?", options: ["Ansible", "DNS", "STP"], answer: 0 }
    ]
  }
];
