export function ipToInt(ip: string): number | null {
  const p = ip.trim().split(".");
  if (p.length !== 4) return null;
  let n = 0;
  for (const s of p) {
    if (!/^\d{1,3}$/.test(s)) return null;
    const v = Number(s);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function maskToPrefix(mask: string): number | null {
  const n = ipToInt(mask);
  if (n === null) return null;
  const bin = n.toString(2).padStart(32, "0");
  if (!/^1*0*$/.test(bin)) return null;
  return bin.indexOf("0") === -1 ? 32 : bin.indexOf("0");
}

export function sameSubnet(a: string, b: string, mask: string): boolean {
  const x = ipToInt(a), y = ipToInt(b), m = ipToInt(mask);
  if (x === null || y === null || m === null) return false;
  return ((x & m) >>> 0) === ((y & m) >>> 0);
}

export function intToIp(n: number) {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}

export function subnetInfo(ip: string, prefix: number) {
  const n = ipToInt(ip);
  if (n === null || prefix < 0 || prefix > 32) return null;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = (n & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const hosts = prefix >= 31 ? 0 : Math.pow(2, 32 - prefix) - 2;
  return {
    mask: intToIp(mask),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    first: hosts ? intToIp(network + 1) : "-",
    last: hosts ? intToIp(broadcast - 1) : "-",
    hosts,
  };
}
