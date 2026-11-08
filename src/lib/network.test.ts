import { describe, expect, it } from "vitest";
import { sameSubnet, subnetInfo } from "./network";

describe("network math", () => {
  it("computes /24 subnet", () => {
    const s = subnetInfo("192.168.1.77", 24)!;
    expect(s.network).toBe("192.168.1.0");
    expect(s.broadcast).toBe("192.168.1.255");
    expect(s.hosts).toBe(254);
  });
  it("supports both usable addresses on an RFC 3021 /31 point-to-point link", () => {
    const s = subnetInfo("192.168.1.10", 31)!;
    expect(s.network).toBe("192.168.1.10");
    expect(s.broadcast).toBe("-");
    expect(s.first).toBe("192.168.1.10");
    expect(s.last).toBe("192.168.1.11");
    expect(s.hosts).toBe(2);
  });
  it("treats /32 as a single-host route", () => {
    const s = subnetInfo("192.168.1.10", 32)!;
    expect(s.network).toBe("192.168.1.10");
    expect(s.broadcast).toBe("-");
    expect(s.first).toBe("192.168.1.10");
    expect(s.last).toBe("192.168.1.10");
    expect(s.hosts).toBe(1);
  });
  it("detects different subnets", () => {
    expect(sameSubnet("10.0.0.1", "10.0.1.1", "255.255.255.0")).toBe(false);
    expect(sameSubnet("10.0.0.1", "10.0.0.9", "255.255.255.0")).toBe(true);
  });
});
