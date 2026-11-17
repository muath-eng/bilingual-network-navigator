import type { Lesson } from "./lesson-types";

export const networkOperationsLessons: Lesson[] = [
  {
    id: "dhcp-fundamentals",
    level: "beginner",
    titleAr: "DHCP: كيف يحصل الجهاز على عنوان IP؟",
    titleEn: "DHCP: How devices receive an IP address",
    bodyAr: [
      "DHCP اختصار Dynamic Host Configuration Protocol، وهو بروتوكول يوزع إعدادات الشبكة تلقائياً على الأجهزة بدلاً من ضبط عنوان IP يدوياً لكل جهاز. تشمل الإعدادات المعتادة عنوان IP وقناع الشبكة والبوابة الافتراضية وخوادم DNS ومدة الإيجار.",
      "تتم عملية DHCP IPv4 غالباً بأربع مراحل تعرف باسم DORA: Discover يرسل العميل طلب اكتشاف، Offer يعرض الخادم عنواناً وإعدادات، Request يطلب العميل استخدام العرض، ثم Acknowledge يؤكد الخادم الحجز. تبدأ الرسائل عادةً ببث محلي لأن العميل لا يملك عنواناً صالحاً بعد.",
      "يستخدم عميل DHCP المنفذ UDP 68 ويستخدم الخادم UDP 67. عند وجود العميل والخادم في شبكتين مختلفتين، لا تمر رسائل البث العادية عبر الراوتر؛ لذلك قد تحتاج الشبكة إلى DHCP Relay مثل ip helper-address على Cisco أو إعداد relay المناسب على MikroTik.",
      "نطاق DHCP Scope يحدد مجموعة العناوين التي يمكن توزيعها. استثنِ العناوين المستخدمة للأجهزة الثابتة، وتأكد من عدم وجود تداخل بين النطاقات، وحدد مدة إيجار مناسبة. يمكن إنشاء حجز Reservation لربط عنوان محدد بعنوان MAC لجهاز معين.",
      "مثال: شبكة المكتب 192.168.10.0/24، والبوابة 192.168.10.1، ونطاق التوزيع 192.168.10.100 إلى 192.168.10.200، وDNS هو 1.1.1.1. يجب ألا توزع DHCP عنوان البوابة أو عناوين الخوادم الثابتة على أجهزة أخرى.",
      "في Windows استخدم ipconfig /all لمراجعة العنوان والبوابة وDNS وخادم DHCP، وipconfig /release ثم ipconfig /renew لطلب إعدادات جديدة. على Linux استخدم ip address وNetworkManager أو عميل DHCP المعتمد في التوزيعة. لا تنفذ release على اتصال بعيد تعتمد عليه دون وسيلة استعادة.",
      "في Cisco IOS يمكن إعداد pool بأوامر مثل ip dhcp excluded-address 192.168.10.1 192.168.10.20 ثم ip dhcp pool OFFICE ثم network 192.168.10.0 255.255.255.0 ثم default-router 192.168.10.1 وdns-server 1.1.1.1. تحقق باستخدام show ip dhcp binding وshow ip dhcp pool.",
      "في MikroTik RouterOS أنشئ DHCP Server عبر DHCP Setup أو اضبط pool وnetwork وserver يدوياً. راجع /ip pool print و/ip dhcp-server print و/ip dhcp-server lease print. تختلف تفاصيل الإعداد حسب bridge وVLAN وتصميم الشبكة.",
      "إذا حصل الجهاز على عنوان 169.254.x.x فهذا غالباً عنوان APIPA ذاتي وليس دليلاً على أن DHCP يعمل. افحص اتصال المنفذ وVLAN ونطاق العناوين وحالة الخادم وDHCP Relay، ثم تحقق من عدم وجود خادم DHCP غير مصرح به يوزع إعدادات خاطئة.",
      "أفضل طريقة للتشخيص: قارن إعدادات جهاز يعمل بآخر متعطل، تحقق من وجود عنوان صالح ومن خادم DHCP الصحيح، افحص امتلاء النطاق وVLAN ومسار relay، ثم جدّد الإيجار واختبر الوصول إلى البوابة. غيّر سبباً واحداً في كل مرة وسجل النتيجة."
    ],
    bodyEn: [
      "DHCP means Dynamic Host Configuration Protocol. It automatically provides network settings instead of requiring an administrator to configure every host manually. Common options include an IP address, subnet mask, default gateway, DNS servers and lease time.",
      "The familiar IPv4 exchange is called DORA: Discover is the client's search, Offer is the server's proposed configuration, Request is the client's selection, and Acknowledge confirms the lease. The initial messages are normally local broadcasts because the client has no usable address yet.",
      "A DHCP client uses UDP port 68 and a server uses UDP port 67. When clients and the server are on different subnets, ordinary local broadcasts do not cross a router; configure a DHCP relay such as Cisco ip helper-address or the appropriate MikroTik relay.",
      "A DHCP scope defines the addresses available for leases. Exclude addresses used by gateways and statically configured devices, avoid overlapping scopes, and choose a suitable lease duration. A reservation can associate a predictable address with a device's MAC address.",
      "Example: an office subnet is 192.168.10.0/24, its gateway is 192.168.10.1, the lease pool is 192.168.10.100–192.168.10.200, and DNS is 1.1.1.1. Do not lease the gateway or static server addresses to other clients.",
      "On Windows, use ipconfig /all to inspect the address, gateway, DNS and DHCP server. Use ipconfig /release and ipconfig /renew to request a new lease. On Linux, inspect ip address and use the distribution's network manager or DHCP client. Avoid releasing a remote connection without a recovery path.",
      "A Cisco IOS example uses ip dhcp excluded-address 192.168.10.1 192.168.10.20, then ip dhcp pool OFFICE, network 192.168.10.0 255.255.255.0, default-router 192.168.10.1 and dns-server 1.1.1.1. Verify with show ip dhcp binding and show ip dhcp pool.",
      "On MikroTik RouterOS, create a DHCP server with DHCP Setup or configure the pool, network and server manually. Inspect /ip pool print, /ip dhcp-server print and /ip dhcp-server lease print. Exact settings depend on the bridge, VLAN and topology.",
      "A 169.254.x.x address is usually an APIPA self-assigned address, not proof that DHCP succeeded. Check the link, VLAN, address pool, server state and relay path. Also look for an unauthorized DHCP server providing incorrect settings.",
      "A reliable troubleshooting sequence is to compare a working client with the failed one, confirm the assigned address and server, inspect scope exhaustion, VLAN and relay path, renew the lease, and test the gateway. Change one variable at a time and record the result."
    ],
    quiz: [
      { qAr: "ما الترتيب الصحيح لمراحل DORA؟", qEn: "What is the correct DORA sequence?", options: ["Discover, Offer, Request, Acknowledge", "Request, Discover, Offer, Acknowledge", "Offer, Request, Discover, Acknowledge"], answer: 0 },
      { qAr: "ما منفذ DHCP Server في IPv4؟", qEn: "Which UDP port is used by an IPv4 DHCP server?", options: ["UDP 53", "UDP 67", "TCP 80"], answer: 1 },
      { qAr: "ماذا يشير عنوان 169.254.x.x غالباً؟", qEn: "What does a 169.254.x.x address usually indicate?", options: ["نجاح DHCP", "عنوان APIPA عند غياب استجابة DHCP", "عنوان DNS"], answer: 1 },
      { qAr: "لماذا نستخدم DHCP Relay؟", qEn: "Why is DHCP relay used?", options: ["لتمرير طلبات DHCP بين الشبكات", "لتشفير Wi-Fi", "لتحويل أسماء النطاقات"], answer: 0 }
    ]
  },
  {
    id: "dns-fundamentals",
    level: "beginner",
    titleAr: "DNS: كيف تتحول أسماء المواقع إلى عناوين IP؟",
    titleEn: "DNS: How domain names resolve to IP addresses",
    bodyAr: [
      "DNS اختصار Domain Name System، وهو نظام موزع يحول أسماء النطاقات سهلة التذكر مثل example.com إلى سجلات يمكن للأجهزة استخدامها، وأشهرها عناوين IPv4 من نوع A وعناوين IPv6 من نوع AAAA. من دونه سيضطر المستخدم إلى تذكر عناوين IP للخدمات.",
      "عندما يطلب جهاز اسم نطاق، يفحص أولاً ذاكرة التخزين المؤقت المحلية، ثم يسأل محلل DNS Recursive Resolver الذي قد يكون تابعاً لمزود الإنترنت أو مؤسسة أو خدمة عامة. إذا لم يجد الإجابة مخزنة، يتتبع الاستعلام التسلسل الهرمي من Root إلى TLD ثم خادم النطاق Authoritative.",
      "أهم السجلات: A لعنوان IPv4، وAAAA لعنوان IPv6، وCNAME لاسم مستعار، وMX لخوادم البريد، وNS لخوادم الأسماء، وTXT للنصوص والتحقق وسياسات البريد، وPTR للبحث العكسي. لا تستخدم CNAME في موضع يتطلب سجلاً آخر وفق قواعد DNS.",
      "TTL هو الوقت الذي يمكن خلاله تخزين الإجابة مؤقتاً قبل إعادة الاستعلام. تقليل TTL قد يسرّع انتشار التغييرات لكنه يزيد عدد الاستعلامات؛ ورفع TTL يقلل الاستعلامات لكنه قد يجعل التغييرات تستغرق وقتاً أطول لتظهر لدى بعض المستخدمين.",
      "يستخدم DNS عادةً UDP/53 للاستعلامات التقليدية، ويمكنه استخدام TCP/53 أيضاً، مثل بعض الردود الكبيرة ونقل المناطق. توجد تقنيات مشفرة مثل DNS over TLS وDNS over HTTPS، لكنها لا تغير الحاجة إلى إعداد محلل موثوق وسياسات مناسبة.",
      "على Windows أو Linux استخدم nslookup example.com أو dig example.com لعرض الإجابة. جرّب تحديد خادم بعينه مثل nslookup example.com 1.1.1.1 أو dig @1.1.1.1 example.com، وقارن النتيجة بمحلل الشبكة المحلي.",
      "إذا نجح ping إلى عنوان IP وفشل الوصول باستخدام اسم النطاق، فافحص DNS أولاً. تحقق من خادم DNS الموزع عبر DHCP، وإعدادات العميل، وملف hosts، والذاكرة المؤقتة، وقواعد الجدار الناري التي قد تمنع UDP/TCP 53.",
      "على Windows يمكن استخدام ipconfig /displaydns لعرض الذاكرة المؤقتة وipconfig /flushdns لمسحها عند الحاجة. لا تمسحها كخطوة عشوائية؛ سجل نتيجة nslookup أولاً لتعرف هل المشكلة في المحلل أم في التخزين المؤقت.",
      "على شبكة مؤسسة، قد تستخدم DNS داخلياً لأسماء الخوادم والأجهزة، مع Forwarders للاستعلامات الخارجية. احرص على عدم كشف السجلات الداخلية للعامة، واضبط صلاحيات التحديث الديناميكي وسجلات المنطقة وعمليات النسخ الاحتياطي.",
      "تذكر أن نجاح تحليل DNS لا يضمن أن الموقع يعمل؛ فهو يثبت الحصول على إجابة فقط. بعد ذلك قد يفشل الاتصال بسبب التوجيه أو المنفذ أو TLS أو الخادم نفسه. افصل بين مشكلة الاسم ومشكلة الوصول إلى الخدمة."
    ],
    bodyEn: [
      "DNS stands for Domain Name System. It is a distributed system that maps memorable domain names such as example.com to records clients can use, most commonly IPv4 A and IPv6 AAAA records. Without DNS, users would need to remember service IP addresses.",
      "A client first checks its local cache, then asks a recursive DNS resolver, which may be operated by an ISP, an organization or a public DNS provider. If the answer is not cached, the resolver follows the hierarchy from root servers to the TLD and then the domain's authoritative name servers.",
      "Common records include A for IPv4, AAAA for IPv6, CNAME for an alias, MX for mail exchangers, NS for name servers, TXT for text and verification or mail policies, and PTR for reverse lookup. A CNAME cannot be used where DNS rules require another record type.",
      "TTL is the time a DNS answer may remain cached before it should be queried again. A shorter TTL can make changes visible sooner but increases query volume; a longer TTL reduces queries but may delay the visibility of changes.",
      "DNS commonly uses UDP port 53 and can also use TCP port 53, including for some large responses and zone transfers. Encrypted options such as DNS over TLS and DNS over HTTPS protect the client-to-resolver exchange but still require a trusted resolver and suitable policies.",
      "On Windows or Linux, use nslookup example.com or dig example.com to inspect an answer. Query a specific resolver with nslookup example.com 1.1.1.1 or dig @1.1.1.1 example.com, then compare it with the resolver configured on the network.",
      "If a ping to an IP address succeeds but a domain name fails, inspect DNS first. Check the DNS server supplied by DHCP, client settings, the hosts file, cache, and firewall rules that may block UDP or TCP port 53.",
      "On Windows, ipconfig /displaydns displays the cache and ipconfig /flushdns clears it when appropriate. Do not flush it blindly; capture an nslookup result first to distinguish resolver problems from stale cached data.",
      "An organization may use internal DNS for server and device names, with forwarders for external queries. Avoid exposing internal records publicly, and secure dynamic updates, zone records and backups.",
      "A successful DNS lookup does not prove that a website is operational; it only proves that a DNS answer was obtained. Routing, ports, TLS or the destination server may still fail. Separate name-resolution faults from service-reachability faults."
    ],
    quiz: [
      { qAr: "أي سجل يربط الاسم بعنوان IPv4؟", qEn: "Which record maps a name to an IPv4 address?", options: ["AAAA", "A", "MX"], answer: 1 },
      { qAr: "ما وظيفة TTL؟", qEn: "What does TTL control?", options: ["مدة تخزين إجابة DNS مؤقتاً", "سرعة منفذ Ethernet", "مدة تشغيل DHCP"], answer: 0 },
      { qAr: "ما الأداة المناسبة لفحص استعلام DNS؟", qEn: "Which tool is suitable for inspecting DNS queries?", options: ["nslookup أو dig", "tracert فقط", "show vlan brief"], answer: 0 },
      { qAr: "هل نجاح DNS يعني أن الموقع يعمل بالتأكيد؟", qEn: "Does successful DNS resolution guarantee the website works?", options: ["نعم دائماً", "لا، قد تفشل طبقات أو خدمات أخرى", "فقط عند استخدام Wi-Fi"], answer: 1 }
    ]
  },
  {
    id: "subnetting-practical",
    level: "intermediate",
    titleAr: "Subnetting عملي: تقسيم شبكات IPv4 وحساب العناوين",
    titleEn: "Practical IPv4 subnetting and address calculations",
    bodyAr: [
      "Subnetting هو تقسيم شبكة IP كبيرة إلى شبكات فرعية أصغر لتوزيع العناوين وتنظيم البث وتطبيق سياسات الأمان. يحدد Prefix Length عدد بتات الشبكة؛ فمثلاً /24 يعني أن أول 24 بت للشبكة ويتبقى 8 بتات للأجهزة.",
      "قناع /24 هو 255.255.255.0، وقناع /25 هو 255.255.255.128، و/26 هو 255.255.255.192، و/27 هو 255.255.255.224. كلما زاد رقم prefix قل عدد بتات الأجهزة وصغر عدد العناوين في الشبكة الفرعية.",
      "في الشبكات التقليدية التي لا تستخدم /31 أو /32، عدد عناوين الأجهزة القابلة للاستخدام يساوي 2 مرفوعة لعدد بتات الأجهزة ناقص 2، لأن عنوان الشبكة وعنوان البث محجوزان. لذلك /24 يوفر 254 عنوان جهاز، و/26 يوفر 62، و/27 يوفر 30.",
      "مثال: الشبكة 192.168.10.0/26 حجم كتلتها 64 عنواناً. عنوان الشبكة 192.168.10.0، وعنوان البث 192.168.10.63، والمدى المعتاد للأجهزة من 192.168.10.1 إلى 192.168.10.62.",
      "طريقة سريعة: حدد الأوكتت الذي يتغير فيه القناع، ثم احسب حجم الكتلة = 256 ناقص قيمة القناع في ذلك الأوكتت. في /26 القناع 192 في الأوكتت الأخير، إذن حجم الكتلة 64، وتبدأ الشبكات عند 0 و64 و128 و192.",
      "مثال آخر: العنوان 192.168.10.77/26 يقع ضمن كتلة 64 إلى 127. لذلك Network ID هو 192.168.10.64، وBroadcast هو 192.168.10.127، والمدى المعتاد للأجهزة 192.168.10.65 إلى 192.168.10.126.",
      "عند تقسيم شبكة حسب احتياجات الأقسام، ابدأ بأكبر عدد أجهزة ثم الأصغر إذا كنت تستخدم VLSM. خصص لكل قسم شبكة مناسبة مع مساحة نمو، ولا تكرر الشبكات أو تتداخل الأقنعة. سجل الشبكة والبوابة والمدى والبث في جدول توثيق.",
      "مثال VLSM مبسط من 192.168.20.0/24: قسم يحتاج 100 جهاز قد يأخذ /25، وقسم يحتاج 50 جهازاً قد يأخذ /26، وقسم يحتاج 20 جهازاً قد يأخذ /27. يجب اختيار الحدود المتوافقة والتأكد من عدم تداخل الكتل قبل اعتماد التصميم.",
      "على Cisco IOS تحقق من الواجهات باستخدام show ip interface brief ومن جدول التوجيه باستخدام show ip route. اضبط العنوان والقناع الصحيحين على الواجهة، ثم اختبر البوابة والاتصال بين الشبكات. على MikroTik راجع /ip address print و/ip route print.",
      "أخطاء شائعة: استخدام قناع غير متطابق، وضع عنوان شبكة أو Broadcast على جهاز، نسيان البوابة الافتراضية، تداخل نطاق DHCP مع عناوين ثابتة، أو افتراض أن جهازين في شبكتين مختلفتين سيتواصلان دون راوتر أو توجيه Layer 3.",
      "تمرين: لديك 192.168.50.0/24 وتريد تقسيمها إلى أربع شبكات متساوية. استعِر بتّين من جزء الأجهزة فيصبح القناع /26، وتحصل على أربع كتل: .0/26 و.64/26 و.128/26 و.192/26، وكل واحدة توفر 62 عنواناً تقليدياً للأجهزة.",
      "ملاحظة: /31 يستخدم عادةً لوصلات point-to-point وفق RFC 3021 ولا يحجز عنواني الشبكة والبث بالطريقة التقليدية، و/32 يمثل عنوان مضيف واحد أو مسار host. لا تطبق قاعدة ناقص 2 على كل الحالات دون فهم السياق."
    ],
    bodyEn: [
      "Subnetting divides a larger IP network into smaller subnets to allocate addresses, limit broadcast domains and apply security policies. The prefix length tells how many bits identify the network; /24 means 24 network bits and 8 host bits.",
      "A /24 mask is 255.255.255.0, /25 is 255.255.255.128, /26 is 255.255.255.192 and /27 is 255.255.255.224. As the prefix number increases, fewer bits remain for hosts and each subnet becomes smaller.",
      "For traditional subnets other than /31 and /32, usable host addresses are 2 raised to the number of host bits minus 2, because the network and broadcast addresses are reserved. Thus /24 provides 254 usable host addresses, /26 provides 62 and /27 provides 30.",
      "Example: 192.168.10.0/26 has a block size of 64 addresses. The network address is 192.168.10.0, the broadcast is 192.168.10.63, and the usual host range is 192.168.10.1 through 192.168.10.62.",
      "A quick method is to find the mask octet that changes, then calculate block size as 256 minus that octet's mask value. For /26, the final mask octet is 192, so the block size is 64 and subnet boundaries are 0, 64, 128 and 192.",
      "Another example: 192.168.10.77/26 belongs to the 64–127 block. Its Network ID is 192.168.10.64, broadcast is 192.168.10.127, and the usual host range is 192.168.10.65 through 192.168.10.126.",
      "When allocating subnets to departments, use VLSM by starting with the largest host requirement and then assigning smaller blocks. Leave room for growth, avoid overlaps and document each subnet, gateway, host range and broadcast address.",
      "A simple VLSM example from 192.168.20.0/24 might allocate /25 to a department needing 100 hosts, /26 to one needing 50 and /27 to one needing 20. Choose valid boundaries and verify that no blocks overlap before deployment.",
      "On Cisco IOS, inspect interfaces with show ip interface brief and routes with show ip route. Configure the correct address and mask, then test the gateway and inter-network reachability. On MikroTik, inspect /ip address print and /ip route print.",
      "Common mistakes include mismatched masks, assigning a network or broadcast address to a host, forgetting the default gateway, overlapping DHCP pools with static addresses, or expecting different subnets to communicate without a router or Layer 3 routing.",
      "Exercise: divide 192.168.50.0/24 into four equal subnets. Borrow two host bits to make /26, producing .0/26, .64/26, .128/26 and .192/26. Each traditional subnet provides 62 usable host addresses.",
      "Note: /31 is commonly used on point-to-point links under RFC 3021 and does not reserve network and broadcast addresses in the traditional way. /32 represents one host address or a host route. Do not apply the minus-two rule without considering the prefix and context."
    ],
    quiz: [
      { qAr: "كم عدد عناوين الأجهزة المعتادة في /26؟", qEn: "How many traditional usable host addresses are in a /26?", options: ["30", "62", "126"], answer: 1 },
      { qAr: "ما قناع /27؟", qEn: "What is the subnet mask for /27?", options: ["255.255.255.192", "255.255.255.224", "255.255.255.240"], answer: 1 },
      { qAr: "ما Network ID للعنوان 192.168.10.77/26؟", qEn: "What is the Network ID for 192.168.10.77/26?", options: ["192.168.10.0", "192.168.10.64", "192.168.10.77"], answer: 1 },
      { qAr: "ما حجم كتلة /26 في الأوكتت الأخير؟", qEn: "What is the /26 block size in the final octet?", options: ["32", "64", "128"], answer: 1 }
    ]
  },
  {
    id: "wlan-wifi-fundamentals",
    level: "beginner",
    titleAr: "أساسيات WLAN وWi-Fi: الترددات والقنوات والتغطية",
    titleEn: "WLAN and Wi-Fi fundamentals: bands, channels and coverage",
    bodyAr: [
      "WLAN هي شبكة محلية لاسلكية تربط الأجهزة عبر موجات الراديو بدلاً من كابل Ethernet. تستخدم تقنيات Wi-Fi المبنية على عائلة معايير IEEE 802.11، وتحتاج عادةً إلى نقطة وصول Access Point تربط العملاء اللاسلكيين بالشبكة المحلية.",
      "تعمل شبكات Wi-Fi الشائعة على نطاقي 2.4 GHz و5 GHz، وتتوفر أجهزة وتقنيات أحدث تدعم 6 GHz حيث تسمح الأنظمة والتنظيمات المحلية. لا يعني الرقم الأعلى دائماً تغطية أفضل؛ فالترددات الأعلى غالباً تتأثر أكثر بالجدران والمسافة.",
      "نطاق 2.4 GHz يوفر عادةً مدى أفضل نسبياً وقدرة أعلى على اختراق بعض العوائق، لكنه مزدحم ويتأثر بأجهزة أخرى. نطاق 5 GHz يوفر قنوات أكثر وسرعات أعلى في ظروف مناسبة، لكن مداه داخل المباني قد يكون أقصر. اختر النطاق وفق الموقع والأجهزة والتداخل.",
      "القناة Channel جزء من الطيف اللاسلكي تستخدمه نقطة الوصول. في 2.4 GHz تكون القنوات متداخلة جزئياً؛ في كثير من البيئات تستخدم القنوات 1 و6 و11 بعرض 20 MHz لتقليل التداخل، مع مراعاة القنوات المسموح بها محلياً. في 5 GHz تتوفر خيارات أكثر لكن بعض القنوات تخضع لمتطلبات DFS.",
      "عرض القناة 20 أو 40 أو 80 أو 160 MHz يؤثر في السرعة المحتملة واستهلاك الطيف. القنوات الأوسع قد ترفع معدل النقل في بيئة نظيفة، لكنها تستهلك مساحة أكبر وقد تزيد التداخل في المناطق المزدحمة. لا تجعل العرض الأوسع الخيار الافتراضي لكل شبكة.",
      "SSID هو اسم الشبكة الذي يراه المستخدم. يمكن استخدام شبكات منفصلة للموظفين والضيوف، وربطها بـVLAN وسياسات جدار ناري مناسبة. إخفاء SSID ليس بديلاً عن التشفير والمصادقة القوية.",
      "استخدم WPA2-AES أو WPA3 بحسب دعم الأجهزة، وتجنب WEP وWPA القديمين. استخدم كلمة مرور طويلة وفريدة، وحدّث Firmware لنقطة الوصول، وعطّل WPS إذا لم تكن بحاجة إليه، وافصل شبكة الضيوف عن الأجهزة الحساسة.",
      "التغطية تتأثر بمكان نقطة الوصول وارتفاعها والجدران المعدنية والخرسانة والتداخل من الشبكات المجاورة والأجهزة الإلكترونية. ضع نقطة الوصول في مكان مركزي ومفتوح نسبياً، ولا تحشرها داخل خزانة أو خلف عوائق كثيفة.",
      "عند التخطيط لمكتب، ابدأ بمخطط للمكان وحدد عدد المستخدمين والأجهزة والتطبيقات، ثم نفذ Site Survey لقياس قوة الإشارة والتداخل. قد تحتاج إلى عدة نقاط وصول مع قنوات وقدرات إرسال مخططة، لكن زيادة عدد نقاط الوصول دون تخطيط قد تسبب تداخلاً إضافياً.",
      "عند ضعف Wi-Fi، قارن المشكلة في أماكن وأجهزة مختلفة، وتحقق من RSSI ومعدل الاتصال والقناة والتداخل والازدحام، ثم اختبر الاتصال بالبوابة والإنترنت. إذا كانت الشبكة بطيئة على جهاز واحد فقط، افحص تعريف بطاقة Wi-Fi وإعداداتها قبل تغيير الشبكة كلها.",
      "في MikroTik راجع واجهات Wi-Fi وإعداداتها وفق إصدار RouterOS والجهاز؛ تختلف أسماء القوائم والأوامر بين حزم wireless وwifi. في أجهزة المؤسسات استخدم أدوات تحليل الطيف وخرائط التغطية عند توفرها، ولا تعتمد على عدد أشرطة الإشارة وحده لتقييم جودة الشبكة."
    ],
    bodyEn: [
      "A WLAN is a wireless local area network that connects devices using radio waves instead of Ethernet cables. Wi-Fi is based on the IEEE 802.11 family of standards, and an access point usually bridges wireless clients into the local network.",
      "Common Wi-Fi bands include 2.4 GHz and 5 GHz. Newer equipment may also support 6 GHz where local regulations and devices allow it. A higher frequency does not automatically provide better coverage; higher bands are generally more affected by walls and distance.",
      "The 2.4 GHz band often provides relatively longer range and better obstacle penetration, but it is crowded and shares spectrum with other devices. The 5 GHz band offers more channel options and higher potential throughput in suitable conditions, but indoor range may be shorter. Choose based on the site, clients and interference.",
      "A channel is a portion of radio spectrum used by an access point. 2.4 GHz channels overlap; many deployments use 1, 6 and 11 at 20 MHz to reduce overlap, subject to local channel rules. 5 GHz offers more options, although some channels are subject to DFS requirements.",
      "Channel widths such as 20, 40, 80 or 160 MHz affect potential throughput and spectrum use. Wider channels can increase data rates in clean environments, but consume more spectrum and may increase interference in dense areas. Wider is not always better.",
      "An SSID is the network name users see. Separate employee and guest SSIDs can be mapped to VLANs and suitable firewall policies. Hiding an SSID is not a substitute for encryption and strong authentication.",
      "Use WPA2-AES or WPA3 according to client support, and avoid obsolete WEP and original WPA. Choose a long unique passphrase, keep access-point firmware updated, disable WPS if it is not needed, and isolate guest clients from sensitive devices.",
      "Coverage depends on access-point placement, height, metal and concrete walls, neighboring networks and electronic interference. Place APs in relatively central, open locations rather than inside cabinets or behind dense obstacles.",
      "For an office, begin with a floor plan and identify users, devices and applications. Perform a site survey to measure signal and interference. Multiple APs may be required with planned channels and transmit power; adding APs without planning can create more interference.",
      "When Wi-Fi is poor, compare different locations and clients, inspect RSSI, link rate, channel, interference and congestion, then test the gateway and Internet path. If only one device is slow, inspect its Wi-Fi adapter driver and settings before changing the entire WLAN.",
      "On MikroTik, inspect wireless interfaces and settings for the specific RouterOS release and device; menu names and commands differ between the wireless and wifi packages. Enterprise deployments can use spectrum analysis and coverage maps when available; signal bars alone do not measure network quality."
    ],
    quiz: [
      { qAr: "ما المعيار المرتبط بتقنيات Wi-Fi؟", qEn: "Which standard family is associated with Wi-Fi?", options: ["IEEE 802.11", "IEEE 802.3", "IEEE 802.1Q"], answer: 0 },
      { qAr: "أي نطاق يكون مزدحماً غالباً بسبب قلة القنوات غير المتداخلة؟", qEn: "Which band is often crowded because it has fewer non-overlapping channels?", options: ["2.4 GHz", "5 GHz", "كل النطاقات دائماً بالتساوي"], answer: 0 },
      { qAr: "هل إخفاء SSID يغني عن التشفير؟", qEn: "Does hiding an SSID replace encryption?", options: ["نعم", "لا"], answer: 1 },
      { qAr: "ما الخطوة الأفضل قبل توزيع نقاط وصول كثيرة في مكتب؟", qEn: "What is a good step before deploying many office access points?", options: ["Site Survey", "تعطيل كلمة المرور", "اختيار أعلى قدرة إرسال لكل الأجهزة"], answer: 0 }
    ]
  }
  ,
  {
    id: "static-routing-default-route",
    level: "advanced",
    titleAr: "التوجيه الثابت والمسار الافتراضي",
    titleEn: "Static routing and the default route",
    bodyAr: [
      "التوجيه Routing هو اختيار الطريق الذي تسلكه حزمة IP للوصول إلى شبكة وجهة. يعتمد الراوتر على جدول التوجيه، ويختار عادةً أطول Prefix مطابق للوجهة (Longest Prefix Match)، ثم يستخدم Administrative Distance وMetric عند المفاضلة بين المسارات المناسبة.",
      "المسار الثابت Static Route يضيفه المهندس يدوياً لتحديد شبكة وجهة وNext Hop أو واجهة خروج. يفيد في الشبكات الصغيرة والمسارات المحددة، لكنه يحتاج إلى تحديث يدوي عند تغير التصميم ما لم تستخدم آليات إضافية.",
      "مثال Cisco IOS: ip route 192.168.20.0 255.255.255.0 10.0.0.2 يضيف مساراً إلى 192.168.20.0/24 عبر الجار 10.0.0.2. تحقق باستخدام show ip route وshow ip route 192.168.20.10.",
      "المسار الافتراضي Default Route هو 0.0.0.0/0 في IPv4، ويستخدم عندما لا يوجد مسار أكثر تحديداً. على Cisco: ip route 0.0.0.0 0.0.0.0 10.0.0.1. لا تضع بوابة غير قابلة للوصول؛ يجب أن يستطيع الراوتر حل Next Hop عبر واجهة فعالة.",
      "على MikroTik RouterOS يمكن إضافة مسار افتراضي باستخدام /ip route add dst-address=0.0.0.0/0 gateway=10.0.0.1، ثم مراجعة /ip route print detail وping 10.0.0.1. تختلف تفاصيل التحقق حسب إصدار RouterOS ونوع المسار.",
      "المسار في اتجاه واحد لا يكفي دائماً؛ يجب أن يعرف الطرف البعيد طريق العودة إلى شبكة المصدر. افحص المسارين ذهاباً وإياباً، وعناوين الواجهات، وحالة الرابط، والبوابة، وقواعد Firewall.",
      "تمرين: R1 متصل بشبكة LAN 192.168.10.0/24 وبـR2 عبر 10.0.0.1/30، وعنوان R2 على الوصلة 10.0.0.2. أضف على R1 مساراً إلى 192.168.20.0/24 عبر 10.0.0.2، وعلى R2 مسار عودة إلى 192.168.10.0/24 عبر 10.0.0.1. اختبر أولاً الجار ثم عنواناً في الشبكة البعيدة.",
      "لا تستخدم مساراً ثابتاً لمجرد إخفاء مشكلة Layer 2 أو عنوان IP خاطئ. ابدأ بفحص الواجهات والاتصال بالـNext Hop، ثم جدول التوجيه، ثم ACL/Firewall، واختبر بعد كل تغيير."
    ],
    bodyEn: [
      "Routing selects the path an IP packet uses to reach a destination network. Routers consult a routing table and generally use longest-prefix match, then administrative distance and metrics when choosing among eligible routes.",
      "A static route is manually configured for a destination network and a next hop or exit interface. It is useful in small or predictable networks, but it requires manual maintenance when the topology changes unless additional mechanisms are used.",
      "Cisco IOS example: ip route 192.168.20.0 255.255.255.0 10.0.0.2 adds a route to 192.168.20.0/24 through neighbor 10.0.0.2. Verify with show ip route and show ip route 192.168.20.10.",
      "An IPv4 default route is 0.0.0.0/0 and is used when no more-specific route matches. On Cisco: ip route 0.0.0.0 0.0.0.0 10.0.0.1. The next hop must be reachable through an active interface.",
      "On MikroTik RouterOS, add a default route with /ip route add dst-address=0.0.0.0/0 gateway=10.0.0.1, then inspect /ip route print detail and test with ping 10.0.0.1. Verification details vary by RouterOS version and route type.",
      "A forward route alone may not be enough; the remote side also needs a return path to the source network. Check both directions, interface addresses, link state, gateways and firewall rules.",
      "Exercise: R1 has LAN 192.168.10.0/24 and connects to R2 over 10.0.0.1/30; R2 uses 10.0.0.2 on that link. Add a route on R1 to 192.168.20.0/24 via 10.0.0.2, and a return route on R2 to 192.168.10.0/24 via 10.0.0.1. Test the neighbor before testing a remote host.",
      "Do not add a static route to hide a Layer 2 fault or an incorrect IP address. Check interfaces and next-hop reachability first, then the routing table and firewall policy, testing after each change."
    ],
    quiz: [
      { qAr: "ما المسار الذي يستخدم عند عدم وجود مسار أكثر تحديداً؟", qEn: "Which route is used when no more-specific route matches?", options: ["Default route", "Host route فقط", "Connected route دائماً"], answer: 0 },
      { qAr: "ما عنوان المسار الافتراضي في IPv4؟", qEn: "What is the IPv4 default-route prefix?", options: ["255.255.255.255/32", "0.0.0.0/0", "127.0.0.1/8"], answer: 1 },
      { qAr: "لماذا نحتاج مسار العودة؟", qEn: "Why is a return route needed?", options: ["لإكمال الاتصال ثنائي الاتجاه", "لتغيير MAC", "لتوزيع DNS"], answer: 0 }
    ]
  },
  {
    id: "nat-pat-fundamentals",
    level: "advanced",
    titleAr: "NAT وPAT: ترجمة عناوين الشبكة",
    titleEn: "NAT and PAT: Network address translation",
    bodyAr: [
      "NAT يترجم عناوين IP بين نطاقين، ويستخدم كثيراً لربط عناوين الشبكات الخاصة بالإنترنت. NAT ليس بديلاً عن Firewall؛ الترجمة وتصفية الحركة وظيفتان مختلفتان ويجب ضبط سياسات الأمان بشكل مستقل.",
      "Static NAT يربط عنواناً داخلياً بعنوان عام ثابت غالباً بنسبة 1:1. Dynamic NAT يختار عنواناً من Pool. أما PAT أو NAT Overload فيسمح لعدة أجهزة بمشاركة عنوان عام واحد باستخدام أرقام المنافذ لتمييز الجلسات.",
      "في Cisco IOS مثال PAT: access-list 1 permit 192.168.10.0 0.0.0.255 ثم interface g0/0 مع ip nat inside، وواجهة WAN مع ip nat outside، ثم ip nat inside source list 1 interface g0/1 overload. أسماء الواجهات واتجاهها يجب أن تطابق تصميمك الفعلي.",
      "على MikroTik RouterOS مثال masquerade: /ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade. استخدم masquerade عادةً عندما يكون عنوان WAN متغيراً؛ إذا كان العنوان ثابتاً يمكن استخدام src-nat مع to-addresses وفق التصميم.",
      "Port Forwarding هو Destination NAT يوجه اتصالات واردة إلى خدمة داخلية محددة. افتح فقط البروتوكول والمنفذ المطلوبين، وحدد عنوان الوجهة الداخلي، وقيّد مصادر الاتصال عند الإمكان، وتأكد من وجود مسار عودة وقواعد Firewall مناسبة.",
      "للتشخيص، تحقق من عنوان WAN والبوابة والمسار الافتراضي، ثم قاعدة NAT وترتيبها، ثم عدادات القواعد وجدول الاتصالات. في Cisco استخدم show ip nat translations وshow ip nat statistics. في MikroTik راجع /ip firewall nat print و/ip firewall connection print.",
      "إذا كان الراوتر خلف CGNAT لدى مزود الخدمة، فقد لا يكون لديه عنوان IPv4 عام قابل للوصول مباشرة؛ عندها قد لا يعمل Port Forwarding التقليدي حتى لو كانت القاعدة صحيحة. اسأل المزود عن عنوان عام أو استخدم حلاً مناسباً مثل VPN ذي نقطة خروج عامة.",
      "تمرين: شبكة 192.168.10.0/24 تصل إلى الإنترنت عبر WAN. تأكد أولاً من نجاح ping من الراوتر إلى بوابة المزود، ثم أضف PAT للشبكة الداخلية، واختبر من جهاز عميل، ثم افحص جدول الترجمة. لا تنشر خدمة داخلية على الإنترنت في المختبر دون ضوابط."
    ],
    bodyEn: [
      "NAT translates IP addresses between address realms and is commonly used to connect private networks to the Internet. NAT is not a firewall replacement: translation and traffic filtering are separate functions and security policy must be configured independently.",
      "Static NAT maps an inside address to a fixed outside address, often one-to-one. Dynamic NAT selects an address from a pool. PAT, also called NAT overload, lets multiple hosts share one public address by distinguishing sessions with transport ports.",
      "Cisco IOS PAT example: access-list 1 permit 192.168.10.0 0.0.0.255; configure ip nat inside on the LAN interface and ip nat outside on the WAN interface; then use ip nat inside source list 1 interface g0/1 overload. Interface names and roles must match the actual topology.",
      "On MikroTik RouterOS, a masquerade example is /ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade. Masquerade is commonly used with dynamic WAN addresses; for a fixed address, src-nat with to-addresses may be more appropriate.",
      "Port forwarding is destination NAT that directs an inbound connection to a specific internal service. Expose only the required protocol and port, specify the internal destination, restrict source networks where possible, and verify return routing and firewall policy.",
      "For troubleshooting, verify the WAN address, gateway and default route, then NAT rule matching and order, counters and the connection table. Cisco commands include show ip nat translations and show ip nat statistics. On MikroTik inspect /ip firewall nat print and /ip firewall connection print.",
      "If the router is behind carrier-grade NAT, it may not have a publicly reachable IPv4 address. Traditional port forwarding may therefore fail even when the local rule is correct. Ask the ISP about a public address or use an appropriate solution such as a VPN with a public endpoint.",
      "Exercise: a 192.168.10.0/24 LAN reaches the Internet through a WAN interface. First verify that the router can ping the ISP gateway, then configure PAT for the LAN, test from a client and inspect translations. Do not expose a lab service publicly without safeguards."
    ],
    quiz: [
      { qAr: "ما الذي يميز PAT عن Static NAT؟", qEn: "What distinguishes PAT from static NAT?", options: ["مشاركة عنوان مع تمييز الجلسات بالمنافذ", "تغيير DNS فقط", "تشفير كل الحزم"], answer: 0 },
      { qAr: "هل NAT يغني عن Firewall؟", qEn: "Does NAT replace a firewall?", options: ["نعم", "لا"], answer: 1 },
      { qAr: "ما سبب شائع لفشل Port Forwarding رغم صحة القاعدة؟", qEn: "What can prevent port forwarding even when the rule is correct?", options: ["CGNAT لدى المزود", "وجود DNS فقط", "استخدام كابل قصير"], answer: 0 }
    ]
  },
  {
    id: "firewall-acl-fundamentals",
    level: "advanced",
    titleAr: "أساسيات Firewall وACL والتحكم بالوصول",
    titleEn: "Firewall and ACL fundamentals",
    bodyAr: [
      "الجدار الناري Firewall يطبق سياسة تسمح أو تمنع حركة المرور وفق معايير مثل عنوان المصدر والوجهة والبروتوكول والمنفذ وحالة الاتصال. الهدف هو السماح بالحد الأدنى اللازم من الاتصالات وتقليل سطح الهجوم.",
      "قائمة التحكم بالوصول ACL مجموعة قواعد مرتبة؛ في كثير من المنصات تتوقف المعالجة عند أول قاعدة مطابقة. قد توجد قاعدة منع ضمنية في نهاية ACL، لذلك غياب تصريح صريح قد يؤدي إلى إسقاط الحركة.",
      "في Cisco IOS يمكن إنشاء Extended ACL مثل: ip access-list extended USERS-TO-SERVER ثم permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443 ثم deny ip any any. طبّق ACL على الواجهة والاتجاه المناسبين بعد تحليل التدفق؛ المثال توضيحي وقد يمنع خدمات أخرى إذا نُفذ كما هو.",
      "على MikroTik RouterOS راجع chain=input للحركة الموجهة إلى الراوتر نفسه، وchain=forward للحركة العابرة خلال الراوتر، وchain=output للحركة التي ينشئها الراوتر. افهم ترتيب القواعد وحالة connection tracking قبل إضافة قواعد إسقاط.",
      "استخدم سياسة افتراضية واضحة، واسمح بخدمات الإدارة من شبكات موثوقة فقط، ولا تعرض Winbox أو SSH أو RDP للعالم دون حاجة وحماية. احتفظ بمسار إدارة بديل أو جلسة محلية عند تعديل Firewall عن بعد.",
      "عند التشخيص، حدد المصدر والوجهة والمنفذ والاتجاه أولاً، ثم افحص عدادات القواعد والسجلات وحالة الاتصال. اختبر من المصدر الفعلي، ولا تعطل الجدار الناري بالكامل كحل دائم.",
      "مبدأ Least Privilege يعني السماح بما يحتاجه العمل فقط. وثّق سبب كل قاعدة ومالكها وتاريخ مراجعتها، وأزل القواعد القديمة أو الواسعة بعد التأكد من عدم اعتماد خدمات عليها.",
      "تمرين: اسمح لأجهزة VLAN 10 بالوصول إلى خادم HTTPS في VLAN 20 على 192.168.20.10:443، وامنع بقية الاتصالات بين الشبكتين مع الإبقاء على DNS وDHCP الضروريين وفق مكان تشغيلهما. اكتب مصفوفة التدفق قبل تحويلها إلى ACL."
    ],
    bodyEn: [
      "A firewall enforces traffic policy using attributes such as source and destination addresses, protocol, ports and connection state. The goal is to allow only required communication and reduce the attack surface.",
      "An access control list is an ordered set of rules. On many platforms, processing stops at the first matching rule. An implicit deny may exist at the end, so traffic without an explicit permit can be dropped.",
      "A Cisco IOS extended ACL example is: ip access-list extended USERS-TO-SERVER; permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443; deny ip any any. Apply it to the correct interface and direction after mapping the traffic flow. This illustrative example may block other services if used unchanged.",
      "On MikroTik RouterOS, chain=input handles traffic destined to the router, chain=forward handles traffic routed through it, and chain=output handles traffic generated by the router. Understand rule order and connection tracking before adding drop rules.",
      "Use an explicit default policy, and allow management services only from trusted networks. Do not expose Winbox, SSH or RDP to the Internet without a clear need and strong safeguards. Keep an alternate management path or local session when changing a remote firewall.",
      "For troubleshooting, identify source, destination, port and direction first, then inspect rule counters, logs and connection state. Test from the actual source; do not disable the firewall entirely as a permanent fix.",
      "Least privilege means allowing only what operations require. Document each rule's purpose, owner and review date, and remove obsolete or overly broad rules only after confirming that no service depends on them.",
      "Exercise: allow VLAN 10 clients to reach HTTPS on server 192.168.20.10 in VLAN 20, while blocking other inter-VLAN traffic and preserving required DNS and DHCP flows according to where those services run. Write a traffic matrix before translating it into an ACL."
    ],
    quiz: [
      { qAr: "ما المقصود بـ implicit deny؟", qEn: "What does implicit deny mean?", options: ["رفض الحركة التي لا تطابق سماحاً صريحاً", "السماح بكل الحركة", "تشفير الحزم"], answer: 0 },
      { qAr: "أي chain في MikroTik تعالج الحركة العابرة عبر الراوتر؟", qEn: "Which MikroTik chain handles traffic passing through the router?", options: ["input", "forward", "output"], answer: 1 },
      { qAr: "ما أفضل ممارسة عند تعديل Firewall عن بعد؟", qEn: "What is a safer practice when changing a remote firewall?", options: ["إبقاء مسار إدارة بديل", "حذف كل القواعد أولاً", "تعطيل تسجيل الدخول"], answer: 0 }
    ]
  },
  {
    id: "packet-capture-troubleshooting",
    level: "advanced",
    titleAr: "تحليل الحزم وبناء منهجية استكشاف الأعطال",
    titleEn: "Packet capture and structured troubleshooting",
    bodyAr: [
      "تحليل الحزم Packet Capture يسجل حركة الشبكة لفهم ما يحدث فعلياً بين العميل والخادم. أداة Wireshark تعرض البروتوكولات والاتصالات والتوقيت وإعادة الإرسال وأخطاء DNS وTCP، بينما يمكن استخدام tcpdump في الأنظمة التي توفره.",
      "ابدأ بسؤال محدد: هل يفشل DNS أم TCP handshake أم TLS أم التطبيق؟ حدد جهاز المصدر والوجهة والوقت والمنفذ، ثم التقط أقل قدر من الحركة اللازمة لإجابة السؤال. الالتقاط العشوائي الكبير يصعب تحليله وقد يحتوي بيانات حساسة.",
      "مرشحات العرض في Wireshark أمثلة: dns لإظهار DNS، tcp.port == 443 لحركة HTTPS عبر TCP، icmp لرسائل ICMP، وip.addr == 192.168.1.10 لحركة عنوان محدد. مرشحات الالتقاط تختلف عن مرشحات العرض وتطبق أثناء التسجيل.",
      "في TCP راقب SYN ثم SYN-ACK ثم ACK لإكمال المصافحة. تكرار SYN دون رد قد يشير إلى مسار أو Firewall أو خدمة لا تستجيب؛ ووجود RST يعني أن الطرف أو وسيطاً رفض الاتصال أو أغلقه. لا تستنتج السبب من حزمة واحدة دون مقارنة الطرفين.",
      "في DNS راقب الاستعلام والرد ورمز النتيجة والوقت. NXDOMAIN يعني أن الاسم غير موجود وفق الخادم الذي أجاب، بينما SERVFAIL يشير إلى فشل في المعالجة. تأخر الرد أو غيابه قد يكون بسبب Resolver أو مسار أو Firewall.",
      "على Linux يمكن استخدام sudo tcpdump -ni any host 192.168.1.10 and port 53 لالتقاط DNS مرتبط بعنوان محدد. احفظ الالتقاط بصيغة pcap عند الحاجة، واحمِ الملف لأنه قد يحتوي أسماء مستخدمين أو عناوين أو بيانات تطبيق.",
      "اتبع منهجية منظمة: عرّف الأثر، اجمع خط أساس، حدد نطاق المشكلة، اختبر من الأقرب إلى الأبعد، غيّر عاملاً واحداً، وثّق النتيجة ثم تحقق من عودة الخدمة. قارن جهازاً متأثراً بآخر يعمل على VLAN ومسار مماثلين.",
      "انتبه إلى حدود الرؤية: الالتقاط على جهاز العميل قد لا يعرض كل ما يحدث داخل السويتش أو نقطة الوصول، وميزات مثل hardware offload قد تؤثر في الالتقاط على الراوتر. استخدم SPAN أو port mirroring أو نقطة التقاط مناسبة بموافقة مسؤول الشبكة.",
      "الخصوصية والسلامة: التقط حركة تملك تصريحاً بتحليلها فقط، وقلل البيانات والمدة، وخزن الملفات بأمان واحذفها وفق سياسة المؤسسة. لا تشارك ملفات pcap عامة لأنها قد تكشف معلومات حساسة."
    ],
    bodyEn: [
      "Packet capture records network traffic so you can see what actually happens between a client and a server. Wireshark displays protocols, conversations, timing, retransmissions, DNS errors and TCP behavior; tcpdump is useful on systems where it is available.",
      "Start with a focused question: is DNS, the TCP handshake, TLS or the application failing? Identify source, destination, time and port, then capture only the traffic needed. Large unfocused captures are difficult to analyze and may contain sensitive data.",
      "Wireshark display-filter examples include dns for DNS, tcp.port == 443 for HTTPS over TCP, icmp for ICMP, and ip.addr == 192.168.1.10 for traffic involving a host. Capture filters differ from display filters and apply while recording.",
      "For TCP, inspect SYN, SYN-ACK and ACK during the handshake. Repeated SYN packets without a reply may indicate a path, firewall or unresponsive-service issue; an RST means an endpoint or intermediary rejected or closed the connection. Do not infer the root cause from one packet alone.",
      "For DNS, inspect the query, response, result code and timing. NXDOMAIN means the responding server says the name does not exist; SERVFAIL indicates processing failure. A delayed or missing response may involve the resolver, path or firewall.",
      "On Linux, sudo tcpdump -ni any host 192.168.1.10 and port 53 can capture DNS traffic associated with a host. Save a pcap file when needed and protect it because it may contain usernames, addresses or application data.",
      "Use a structured workflow: define impact, collect a baseline, scope the fault, test from nearest to farthest, change one variable, record the result and verify service recovery. Compare an affected device with a working device on a similar VLAN and path.",
      "Understand visibility limits: a client-side capture may not show everything inside a switch or access point, and hardware offload can affect router captures. Use SPAN, port mirroring or an appropriate capture point with network-owner authorization.",
      "Privacy and safety: capture only traffic you are authorized to inspect, minimize data and duration, store files securely and delete them according to policy. Do not publicly share pcap files because they may expose sensitive information."
    ],
    quiz: [
      { qAr: "ما تسلسل TCP handshake؟", qEn: "What is the TCP handshake sequence?", options: ["SYN, SYN-ACK, ACK", "ACK, FIN, SYN", "DNS, ARP, ICMP"], answer: 0 },
      { qAr: "أي مرشح عرض يظهر استعلامات DNS في Wireshark؟", qEn: "Which Wireshark display filter shows DNS traffic?", options: ["dns", "http only", "vlan.id"], answer: 0 },
      { qAr: "ماذا يعني NXDOMAIN غالباً؟", qEn: "What does NXDOMAIN usually mean?", options: ["الاسم غير موجود وفق رد DNS", "نجاح TLS", "انقطاع كابل"], answer: 0 }
    ]
  }

];