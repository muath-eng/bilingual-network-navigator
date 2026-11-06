import { describe, expect, it } from "vitest";
import { sameSubnet, subnetInfo } from "./network";

describe("network math", () => {
  it("computes /24 subnet", () => {
    const s = subnetInfo("192.168.1.77", 24)!;
    expect(s.network).toBe("192.168.1.0");
    expect(s.broadcast).toBe("192.168.1.255");
    expect(s.hosts).toBe(254);
  });
  it("detects different subnets", () => {
    expect(sameSubnet("10.0.0.1", "10.0.1.1", "255.255.255.0")).toBe(false);
    expect(sameSubnet("10.0.0.1", "10.0.0.9", "255.255.255.0")).toBe(true);
  });
});
