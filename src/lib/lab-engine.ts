import { ipToInt, maskToPrefix, sameSubnet, subnetInfo } from './network';
export type Kind = 'pc' | 'switch' | 'router' | 'server';
export type Device = { id: string; kind: Kind; name: string; x: number; y: number; ip: string; mask: string; gw: string; ip2?: string; mask2?: string; vlan: number; vlan2?: number; enabled: boolean };
export type Cable = { a: string; b: string; enabled: boolean };
export type Finding = { code: string; device: string; ar: string; en: string };
export type PingResult = { ok: boolean; code: string; ar: string; en: string; path: string[] };
const host = (d: Device) => d.kind === 'pc' || d.kind === 'server';
const interfaces = (d: Device) => [{ ip: d.ip, mask: d.mask, vlan: d.vlan }, ...(d.kind === 'router' && d.ip2 ? [{ ip: d.ip2, mask: d.mask2 || d.mask, vlan: d.vlan2 ?? 1 }] : [])];
function usable(ip: string, mask: string) {
 const prefix = maskToPrefix(mask);
 if (ipToInt(ip) === null || prefix === null) return false;
 const info = subnetInfo(ip, prefix);
 return !!info && (prefix >= 31 || (ip !== info.network && ip !== info.broadcast));
}
export function segment(devs: Device[], links: Cable[], start: string, vlan: number): string[] {
 const seen = new Set<string>(); const q = [start];
 while (q.length) {
  const id = q.shift(); if (!id || seen.has(id)) continue;
  const d = devs.find(x => x.id === id); if (!d?.enabled) continue;
  if (id !== start && !interfaces(d).some(i => i.vlan === vlan) && d.kind !== 'switch') continue;
  seen.add(id);
  if (d.kind === 'switch' || (id === start && d.kind !== 'router')) {
   for (const l of links.filter(x => x.enabled && (x.a === id || x.b === id))) q.push(l.a === id ? l.b : l.a);
  } else if (id === start && d.kind === 'router' && interfaces(d).some(i => i.vlan === vlan)) {
   // A router is a boundary between broadcast domains: only traverse links
   // whose directly attached endpoint belongs to the requested VLAN.
   for (const l of links.filter(x => x.enabled && (x.a === id || x.b === id))) {
    const otherId = l.a === id ? l.b : l.a;
    const other = devs.find(x => x.id === otherId);
    if (other && ((other.kind === 'switch' && other.vlan === vlan) || interfaces(other).some(i => i.vlan === vlan))) q.push(otherId);
   }
  }
 }
 return [...seen];
}
export function diagnose(devs: Device[], links: Cable[]): Finding[] {
 const out: Finding[] = [];
 for (const d of devs) {
  const add = (code: string, ar: string, en: string) => out.push({ code, device: d.name, ar, en });
  if (!d.enabled) { add('device_down','الجهاز متوقف؛ فعّل الجهاز.','Device is off; enable it.'); continue; }
  if (!links.some(l => l.enabled && (l.a === d.id || l.b === d.id))) add('link_down','لا يوجد كابل فعال؛ تحقق من الوصلة.','No active cable; check the link.');
  if (d.kind === 'switch') continue;
  for (const i of interfaces(d)) if (!usable(i.ip, i.mask)) add('invalid_address','عنوان أو قناع غير صالح، أو عنوان شبكة/بث.','Invalid IP/mask, or a network/broadcast address.');
  const domain = segment(devs, links, d.id, d.vlan);
  if (host(d) && devs.some(x => x.id !== d.id && domain.includes(x.id) && interfaces(x).some(i => i.vlan === d.vlan && i.ip === d.ip))) add('duplicate_ip','عنوان IP مكرر في نفس VLAN؛ خصص عنواناً فريداً.','Duplicate IP on this VLAN; assign a unique address.');
  if (host(d) && d.gw && (!sameSubnet(d.ip,d.gw,d.mask) || !devs.some(x => x.kind === 'router' && domain.includes(x.id) && interfaces(x).some(i => i.ip === d.gw && i.vlan === d.vlan)))) add('gateway','البوابة غير متاحة في شبكة الجهاز؛ راجع العنوان وVLAN والكابل.','Gateway is not reachable on this subnet; check address, VLAN and cable.');
 }
 return out;
}
export function simulatePing(devs: Device[], links: Cable[], source: string | null, target: string): PingResult {
 const fail = (code: string, ar: string, en: string): PingResult => ({ok:false,code,ar,en,path:[]});
 const src = devs.find(d => d.id === source);
 if (!src || !host(src)) return fail('source','اختر حاسوباً أو خادماً كمصدر.','Select a PC or server as source.');
 if (!src.enabled) return fail('device_down','جهاز المصدر متوقف.','Source device is off.');
 if (!usable(src.ip,src.mask) || ipToInt(target) === null) return fail('invalid_address','عنوان أو قناع غير صالح.','Invalid address or subnet mask.');
 const domain = segment(devs,links,src.id,src.vlan);
 if (diagnose(devs,links).some(f => f.device === src.name && f.code === 'duplicate_ip')) return fail('duplicate_ip','تعارض عنوان المصدر؛ صحح العنوان أولاً.','Source IP conflict; correct the address first.');
 const dest = devs.find(d => d.enabled && interfaces(d).some(i => i.ip === target));
 if (!dest) return fail('host_missing','الوجهة غير موجودة أو متوقفة.','Destination is absent or off.');
 if (src.id === dest.id && src.ip === target) return {ok:true,code:'local',ar:'نجح محلياً',en:'Local success',path:[src.name]};
 if (sameSubnet(src.ip,target,src.mask)) {
  const iface = interfaces(dest).find(i => i.ip === target);
  if (!iface || !domain.includes(dest.id) || iface.vlan !== src.vlan) return fail('segment','الوجهة معزولة؛ افحص الكابل وVLAN.','Destination is isolated; check cable and VLAN.');
  if (!usable(iface.ip,iface.mask) || !sameSubnet(target,src.ip,iface.mask)) return fail('return_mask','قناع الوجهة يمنع مسار الرد.','Destination mask prevents the return path.');
  return {ok:true,code:'direct',ar:'نجح (نفس الشبكة)',en:'Success (same subnet)',path:[src.name,dest.name]};
 }
 const gw = devs.find(d => d.kind === 'router' && domain.includes(d.id) && interfaces(d).some(i => i.ip === src.gw && i.vlan === src.vlan && usable(i.ip,i.mask) && sameSubnet(src.ip,i.ip,src.mask) && sameSubnet(src.ip,i.ip,i.mask)));
 if (!gw) return fail('gateway','البوابة الافتراضية غير صحيحة أو غير متصلة.','Default gateway wrong or not reachable.');
 const exit = interfaces(gw).filter(i => usable(i.ip,i.mask) && sameSubnet(i.ip,target,i.mask)).sort((a,b)=>(maskToPrefix(b.mask)??0)-(maskToPrefix(a.mask)??0))[0];
 if (!exit || !segment(devs,links,gw.id,exit.vlan).includes(dest.id) || dest.vlan !== exit.vlan) return fail('no_route','لا يوجد مسار متصل إلى الوجهة؛ راجع واجهة الراوتر وVLAN.','No connected route to destination; check router interface and VLAN.');
 if (!usable(dest.ip,dest.mask) || !sameSubnet(dest.ip,exit.ip,dest.mask) || dest.gw !== exit.ip) return fail('return_gateway','الوجهة لا تملك بوابة أو قناعاً صحيحاً للرد.','Destination has no valid gateway or mask to reply.');
 return {ok:true,code:'routed',ar:`نجح عبر ${gw.name}`,en:`Success via ${gw.name}`,path:[src.name,gw.name,dest.name]};
}
export const labTemplates = [
 {id:'routed',ar:'شبكتان وراوتر',en:'Two LANs and a router',goalAr:'أوصل PC1 إلى PC3 عبر الراوتر، ثم اختبر مسار الرد.',goalEn:'Reach PC3 from PC1 through the router and verify the return path.'},
 {id:'lan',ar:'شبكة محلية',en:'Local network',goalAr:'تحقق من اتصال PC1 وPC2 في نفس الشبكة دون بوابة.',goalEn:'Verify PC1 to PC2 connectivity on the same subnet without a gateway.'},
 {id:'vlan',ar:'عزل VLAN والتوجيه',en:'VLAN isolation and routing',goalAr:'PC2 في VLAN 20؛ اضبط عنوانه 10.0.0.30 وبوابته 10.0.0.1 للوصول إلى PC1.',goalEn:'PC2 is on VLAN 20; set its IP to 10.0.0.30 and gateway to 10.0.0.1 to reach PC1.'},
 {id:'gateway',ar:'عطل البوابة',en:'Gateway fault',goalAr:'شخّص فشل PC1 إلى PC3، ثم صحح بوابة PC1.',goalEn:'Diagnose PC1 to PC3 failure, then correct PC1’s gateway.'},
 {id:'duplicate',ar:'تعارض العناوين',en:'IP conflict',goalAr:'اكتشف العنوان المكرر وخصص عنواناً فريداً لـPC2.',goalEn:'Find the duplicate IP and give PC2 a unique address.'},
 {id:'cable',ar:'كابل متوقف',en:'Link outage',goalAr:'افحص الوصلات وأعد تشغيل كابل PC1 إلى SW1.',goalEn:'Inspect links and enable the PC1 to SW1 cable.'},
 {id:'mask',ar:'قناع خاطئ',en:'Wrong subnet mask',goalAr:'صحح قناع PC3 إلى /24 ثم اختبر الوصول من PC1.',goalEn:'Correct PC3’s mask to /24, then test reachability from PC1.'},
] as const;
export function createTopology(template = 'routed'): {devs:Device[];links:Cable[];target:string} {
 const devs:Device[] = [
 {id:'d1',kind:'pc',name:'PC1',x:80,y:80,ip:'192.168.1.10',mask:'255.255.255.0',gw:'192.168.1.1',vlan:1,enabled:true},
 {id:'d2',kind:'pc',name:'PC2',x:80,y:260,ip:'192.168.1.11',mask:'255.255.255.0',gw:'192.168.1.1',vlan:1,enabled:true},
 {id:'d3',kind:'switch',name:'SW1',x:260,y:170,ip:'',mask:'',gw:'',vlan:1,enabled:true},
 {id:'d4',kind:'router',name:'R1',x:440,y:170,ip:'192.168.1.1',mask:'255.255.255.0',gw:'',ip2:'10.0.0.1',mask2:'255.255.255.0',vlan:1,vlan2:2,enabled:true},
 {id:'d5',kind:'pc',name:'PC3',x:600,y:170,ip:'10.0.0.20',mask:'255.255.255.0',gw:'10.0.0.1',vlan:2,enabled:true},
 ];
 const links:Cable[] = [{a:'d1',b:'d3',enabled:true},{a:'d2',b:'d3',enabled:true},{a:'d3',b:'d4',enabled:true},{a:'d4',b:'d5',enabled:true}];
 const pc1=devs[0],pc2=devs[1],r=devs[3],pc3=devs[4];
 if (!pc1 || !pc2 || !r || !pc3) throw new Error('Missing topology devices');
 if(template==='gateway') pc1.gw='192.168.2.1';
 if(template==='duplicate') pc2.ip=pc1.ip;
 if(template==='cable' && links[0]) links[0].enabled=false;
 if(template==='mask') pc3.mask='255.255.255.240';
 if(template==='vlan') {pc2.vlan=20;r.vlan2=20;pc3.vlan=20;}
 if(template==='lan') return {devs:devs.slice(0,3).map(d=>({...d,gw:''})),links:links.slice(0,2),target:'192.168.1.11'};
 return {devs,links,target:'10.0.0.20'};
}
