export type RouterOsAddress = { address: string; interface: "ether1" | "ether2" };
export type RouterOsRoute = { destination: string; gateway: string };
export type RouterOsState = {
  identity: string;
  addresses: RouterOsAddress[];
  routes: RouterOsRoute[];
};
export type RouterOsStep = { title: string; detail: string };
export type RouterOsResult = {
  state: RouterOsState;
  output: string[];
  steps: RouterOsStep[];
  devicePatch?: { ip?: string; mask?: string; ip2?: string; mask2?: string };
};

export const createRouterOsState = (identity = "MikroTik"): RouterOsState => ({
  identity,
  addresses: [],
  routes: [],
});

const validIPv4 = (value: string) => {
  const parts = value.split(".");
  return (
    parts.length === 4 &&
    parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255)
  );
};

const prefixMask = (prefix: number) => {
  const mask = (0xffffffff << (32 - prefix)) >>> 0;
  return [24, 16, 8, 0].map((shift) => (mask >>> shift) & 255).join(".");
};

const parseAddress = (value: string) => {
  const [ip, prefixText] = value.split("/");
  const prefix = Number(prefixText);
  if (!ip || !validIPv4(ip) || !/^\d{1,2}$/.test(prefixText ?? "") || prefix < 1 || prefix > 32)
    return null;
  return { ip, prefix, mask: prefixMask(prefix) };
};

const parseArgs = (command: string) =>
  Object.fromEntries(
    [...command.matchAll(/([a-z-]+)=([^\s]+)/gi)].map((match) => [
      match[1]!.toLowerCase(),
      match[2]!,
    ]),
  );

const ipToNumber = (ip: string) =>
  ip.split(".").reduce((value, part) => value * 256 + Number(part), 0);

const isUsableGateway = (state: RouterOsState, gateway: string) =>
  state.addresses.some((item) => {
    const parsed = parseAddress(item.address);
    if (!parsed) return false;
    const mask = parsed.prefix === 32 ? 0xffffffff : (0xffffffff << (32 - parsed.prefix)) >>> 0;
    const own = ipToNumber(parsed.ip) >>> 0;
    const target = ipToNumber(gateway) >>> 0;
    const network = (own & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    if (parsed.prefix <= 30 && (target === network || target === broadcast)) return false;
    return target !== own && (target & mask) >>> 0 === network;
  });

export function runRouterOsCommand(current: RouterOsState, rawCommand: string): RouterOsResult {
  const command = rawCommand.trim().replace(/\s+/g, " ");
  const lower = command.toLowerCase();
  const state: RouterOsState = {
    identity: current.identity,
    addresses: current.addresses.map((item) => ({ ...item })),
    routes: current.routes.map((item) => ({ ...item })),
  };
  const result = (
    output: string[],
    steps: RouterOsStep[] = [],
    devicePatch?: RouterOsResult["devicePatch"],
  ): RouterOsResult => ({ state, output, steps, ...(devicePatch ? { devicePatch } : {}) });

  if (!command) return result([""]);
  if (lower === "/system identity print")
    return result(
      ["name: " + state.identity],
      [{ title: "قراءة الهوية", detail: "يعرض RouterOS اسم الجهاز الحالي دون تغيير أي إعداد." }],
    );

  if (lower.startsWith("/system identity set ")) {
    const name = command
      .slice("/system identity set ".length)
      .match(/name=(?:"([^"]+)"|([^\s]+))/i);
    if (!name) return result(["expected: /system identity set name=Router1"]);
    state.identity = (name[1] ?? name[2] ?? "").slice(0, 32);
    return result(
      ["identity changed to " + state.identity],
      [{ title: "تغيير اسم الراوتر", detail: "تم تحديث هوية الراوتر داخل المحاكاة فقط." }],
    );
  }

  if (lower === "/interface print")
    return result(
      [
        "Flags: X - disabled, R - running",
        " #   NAME      TYPE      STATUS",
        " 0 R ether1    ethernet  running",
        " 1 R ether2    ethernet  running",
      ],
      [
        {
          title: "عرض الواجهات",
          detail: "يعرض هذا الأمر واجهتي Ethernet المتاحتين في نموذج التدريب.",
        },
      ],
    );

  if (lower === "/ip address print") {
    const rows = state.addresses.map(
      (item, index) => index + "   " + item.address + "   " + item.interface,
    );
    return result(
      [
        " #   ADDRESS           INTERFACE",
        ...(rows.length ? rows : ["(no IP addresses configured)"]),
      ],
      [
        {
          title: "جدول عناوين IP",
          detail: "يعرض العناوين المرتبطة بواجهات الراوتر في هذه الجلسة.",
        },
      ],
    );
  }

  if (lower.startsWith("/ip address add ")) {
    const args = parseArgs(command);
    const parsed = parseAddress(args.address ?? "");
    const iface = args.interface;
    if (!parsed || (iface !== "ether1" && iface !== "ether2"))
      return result([
        "invalid input. Example: /ip address add address=192.168.10.1/24 interface=ether1",
      ]);
    if (state.addresses.some((item) => item.interface === iface))
      return result(["failure: an address is already assigned to " + iface + " in this simulator"]);
    state.addresses.push({ address: parsed.ip + "/" + parsed.prefix, interface: iface });
    const devicePatch =
      iface === "ether1"
        ? { ip: parsed.ip, mask: parsed.mask }
        : { ip2: parsed.ip, mask2: parsed.mask };
    return result(
      ["address " + parsed.ip + "/" + parsed.prefix + " added to " + iface],
      [
        { title: "تحليل الأمر", detail: "تحقق المحاكي من صيغة IPv4 والبادئة واسم الواجهة." },
        {
          title: "تطبيق الإعداد",
          detail: "أضيف العنوان إلى " + iface + "، وسيظهر على إعدادات الراوتر في لوحة المختبر.",
        },
      ],
      devicePatch,
    );
  }

  if (lower === "/ip route print") {
    const rows = state.routes.map(
      (item, index) => index + "   " + item.destination + "   " + item.gateway + "   active",
    );
    return result(
      [
        " #   DST-ADDRESS       GATEWAY       STATUS",
        ...(rows.length ? rows : ["(no routes configured)"]),
      ],
      [{ title: "جدول التوجيه", detail: "يعرض المسارات التي أضفتها إلى الراوتر الافتراضي." }],
    );
  }

  if (lower.startsWith("/ip route add ")) {
    const args = parseArgs(command);
    const destination = args["dst-address"];
    const gateway = args.gateway;
    if (!destination || !gateway || !validIPv4(gateway) || !/^0\.0\.0\.0\/0$/.test(destination))
      return result([
        "supported example: /ip route add dst-address=0.0.0.0/0 gateway=192.168.10.254",
      ]);
    if (state.routes.some((item) => item.destination === destination))
      return result(["failure: route " + destination + " already exists"]);
    if (!isUsableGateway(state, gateway))
      return result(
        ["failure: gateway " + gateway + " is unreachable from the router's configured interfaces"],
        [
          {
            title: "تعذر الوصول إلى البوابة",
            detail:
              "يجب أن تقع البوابة ضمن شبكة متصلة مباشرة بإحدى واجهات الراوتر، وألا تكون عنوان الشبكة أو البث أو عنوان الراوتر نفسه.",
          },
        ],
      );
    state.routes.push({ destination, gateway });
    return result(
      ["route " + destination + " via " + gateway + " added (gateway reachable)"],
      [
        { title: "فحص المسار", detail: "تحقق المحاكي من الوجهة والبوابة بصيغة IPv4." },
        {
          title: "فحص قابلية الوصول",
          detail: "تأكد المحاكي أن عنوان البوابة يقع ضمن إحدى الشبكات المتصلة مباشرة بالراوتر.",
        },
        { title: "إضافة المسار", detail: "أضيف المسار الافتراضي بعد نجاح فحص البوابة." },
      ],
    );
  }

  if (lower.startsWith("/ping ")) {
    const destination = command.slice(6).trim();
    if (!validIPv4(destination)) return result(["invalid address"]);
    const toNumber = (ip: string) =>
      ip.split(".").reduce((n, part) => (n * 256 + Number(part)) >>> 0, 0);
    const onConnectedNetwork = state.addresses.some((item) => {
      const parsed = parseAddress(item.address);
      if (!parsed) return false;
      const mask = parsed.prefix === 32 ? 0xffffffff : (0xffffffff << (32 - parsed.prefix)) >>> 0;
      return (toNumber(parsed.ip) & mask) === (toNumber(destination) & mask);
    });
    const defaultRoute = state.routes.find((route) => route.destination === "0.0.0.0/0");
    const reachable =
      onConnectedNetwork || (!!defaultRoute && isUsableGateway(state, defaultRoute.gateway));
    return result(
      [
        "PING " + destination,
        reachable ? "seq=0 ttl=64 time=1ms" : "timeout",
        reachable ? "1 packets transmitted, 1 received" : "1 packets transmitted, 0 received",
      ],
      [
        { title: "تحديد مسار الوجهة", detail: "يفحص المحاكي الشبكات المتصلة والمسار الافتراضي." },
        {
          title: "نتيجة ICMP",
          detail: reachable
            ? onConnectedNetwork
              ? "الوجهة ضمن شبكة متصلة مباشرة؛ الاستجابة افتراضية وليست حزمة حقيقية."
              : "المسار الافتراضي وبوابته صالحان؛ يفترض النموذج استجابة افتراضية للوجهة الخارجية."
            : defaultRoute
              ? "المسار الافتراضي موجود لكن بوابته غير قابلة للوصول من واجهات الراوتر."
              : "لا يوجد مسار تدريبي مناسب، لذلك انتهى الاختبار بمهلة.",
        },
      ],
    );
  }

  return result([
    "bad command name or unsupported command",
    "Try: /system identity print | /interface print | /ip address print | /ip route print",
  ]);
}
