import { describe, expect, it } from "vitest";
import { createRouterOsState, runRouterOsCommand } from "./routeros-simulator";

describe("RouterOS command simulator", () => {
  it("prints and changes the simulated router identity", () => {
    const initial = createRouterOsState();
    const changed = runRouterOsCommand(initial, "/system identity set name=Lab-R1");
    expect(changed.state.identity).toBe("Lab-R1");
    expect(runRouterOsCommand(changed.state, "/system identity print").output).toContain("name: Lab-R1");
  });

  it("adds an address and returns a patch for the lab router", () => {
    const result = runRouterOsCommand(createRouterOsState(), "/ip address add address=192.168.10.1/24 interface=ether1");
    expect(result.state.addresses).toEqual([{ address: "192.168.10.1/24", interface: "ether1" }]);
    expect(result.devicePatch).toEqual({ ip: "192.168.10.1", mask: "255.255.255.0" });
    expect(result.steps).toHaveLength(2);
  });

  it("rejects invalid addresses and duplicate interface assignments", () => {
    const initial = createRouterOsState();
    expect(runRouterOsCommand(initial, "/ip address add address=999.1.1.1/24 interface=ether1").output[0]).toContain("invalid input");
    const added = runRouterOsCommand(initial, "/ip address add address=192.168.1.1/24 interface=ether1");
    expect(runRouterOsCommand(added.state, "/ip address add address=192.168.2.1/24 interface=ether1").output[0]).toContain("already assigned");
  });

  it("adds and prints a default route", () => {
    const added = runRouterOsCommand(createRouterOsState(), "/ip route add dst-address=0.0.0.0/0 gateway=192.168.10.254");
    expect(added.state.routes).toEqual([{ destination: "0.0.0.0/0", gateway: "192.168.10.254" }]);
    expect(runRouterOsCommand(added.state, "/ip route print").output[1]).toContain("0.0.0.0/0");
  });

  it("simulates ping based on connected networks or a default route", () => {
    const address = runRouterOsCommand(createRouterOsState(), "/ip address add address=192.168.10.1/24 interface=ether1");
    expect(runRouterOsCommand(address.state, "/ping 192.168.10.20").output.join(" ")).toContain("1 received");
    expect(runRouterOsCommand(address.state, "/ping 10.0.0.1").output.join(" ")).toContain("0 received");
  });
});
