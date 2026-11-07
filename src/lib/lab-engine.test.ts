import { describe, expect, it } from "vitest";
import { createTopology, diagnose, segment, simulatePing } from "./lab-engine";

describe("network lab simulator", () => {
  it("pings hosts directly on the same LAN", () => {
    const { devs, links } = createTopology("lan");
    expect(simulatePing(devs, links, "d1", "192.168.1.11").ok).toBe(true);
  });

  it("routes traffic between the router's two LANs", () => {
    const { devs, links } = createTopology("routed");
    const result = simulatePing(devs, links, "d1", "10.0.0.20");
    expect(result.ok).toBe(true);
    expect(result.code).toBe("routed");
    expect(result.path).toEqual(["PC1", "R1", "PC3"]);
  });

  it("rejects an unreachable default gateway", () => {
    const { devs, links } = createTopology("gateway");
    const result = simulatePing(devs, links, "d1", "10.0.0.20");
    expect(result.ok).toBe(false);
    expect(result.code).toBe("gateway");
  });

  it("detects duplicate IP addresses in the same VLAN", () => {
    const { devs, links } = createTopology("duplicate");
    expect(diagnose(devs, links).some((f) => f.code === "duplicate_ip")).toBe(true);
  });

  it("keeps separate VLANs isolated unless routed through the router", () => {
    const { devs, links } = createTopology("routed");
    expect(segment(devs, links, "d4", 2)).toContain("d5");
    expect(segment(devs, links, "d4", 1)).not.toContain("d5");
  });

  it("routes between VLANs through separate access switches and router interfaces", () => {
    const { devs, links } = createTopology("vlan");
    const result = simulatePing(devs, links, "d1", "10.0.0.30");
    expect(result.ok).toBe(true);
    expect(result.code).toBe("routed");
    expect(segment(devs, links, "d1", 1)).not.toContain("d2");
  });

  it("blocks hosts assigned to a different VLAN on an access switch", () => {
    const { devs, links } = createTopology("lan");
    devs.find((d) => d.id === "d2")!.vlan = 20;
    expect(segment(devs, links, "d1", 1)).not.toContain("d2");
    expect(simulatePing(devs, links, "d1", "192.168.1.11").ok).toBe(false);
  });

  it("does not forward a VLAN through a switch assigned to another VLAN", () => {
    const { devs, links } = createTopology("lan");
    devs.find((d) => d.id === "d3")!.vlan = 20;
    expect(segment(devs, links, "d1", 1)).not.toContain("d3");
  });

  it("does not traverse a disabled cable", () => {
    const { devs, links } = createTopology("cable");
    const result = simulatePing(devs, links, "d1", "10.0.0.20");
    expect(result.ok).toBe(false);
  });

  it("does not traverse a disabled device", () => {
    const { devs, links } = createTopology("routed");
    devs.find((d) => d.id === "d5")!.enabled = false;
    expect(simulatePing(devs, links, "d1", "10.0.0.20").ok).toBe(false);
  });

  it("rejects invalid source addresses and masks", () => {
    const { devs, links } = createTopology("routed");
    devs[0]!.ip = "999.1.1.1";
    expect(simulatePing(devs, links, "d1", "10.0.0.20").code).toBe("invalid_address");
    devs[0]!.ip = "192.168.1.10";
    devs[0]!.mask = "255.0.255.0";
    expect(simulatePing(devs, links, "d1", "10.0.0.20").code).toBe("invalid_address");
  });
});
