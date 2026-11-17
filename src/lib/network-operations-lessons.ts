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
];
