import { describe, expect, it } from "vitest";
import { createRouterOsState, runRouterOsCommand } from "./routeros-simulator";

describe("RouterOS command simulator", () => {
  it("prints and changes the simulated router identity", () => {
    const initial = createRouterOsState();
    const changed = runRouterOsCommand(initial, "/system identity set name=Lab-R1");
    expect(changed.state.identity).toBe("Lab-R1");
    expect(runRouterOsCommand(changed.state, "/system identity print").output).toContain(
      "name: Lab-R1",
    );
  });

  it("adds an address and returns a patch for the lab router", () => {
    const result = runRouterOsCommand(
      createRouterOsState(),
      "/ip address add address=192.168.10.1/24 interface=ether1",
    );
    expect(result.state.addresses).toEqual([{ address: "192.168.10.1/24", interface: "ether1" }]);
    expect(result.devicePatch).toEqual({ ip: "192.168.10.1", mask: "255.255.255.0" });
    expect(result.steps).toHaveLength(2);
  });

  it("rejects invalid addresses and duplicate interface assignments", () => {
    const initial = createRouterOsState();
    expect(
      runRouterOsCommand(initial, "/ip address add address=999.1.1.1/24 interface=ether1")
        .output[0],
    ).toContain("invalid input");
    const added = runRouterOsCommand(
      initial,
      "/ip address add address=192.168.1.1/24 interface=ether1",
    );
    expect(
      runRouterOsCommand(added.state, "/ip address add address=192.168.2.1/24 interface=ether1")
        .output[0],
    ).toContain("already assigned");
  });

  it("rejects an unreachable gateway and adds a reachable default route", () => {
    const address = runRouterOsCommand(
      createRouterOsState(),
      "/ip address add address=192.168.10.1/24 interface=ether1",
    );
    const rejected = runRouterOsCommand(
      address.state,
      "/ip route add dst-address=0.0.0.0/0 gateway=192.168.20.254",
    );
    expect(rejected.output.join(" ")).toContain("gateway 192.168.20.254 is unreachable");
    expect(rejected.state.routes).toHaveLength(0);

    const added = runRouterOsCommand(
      address.state,
      "/ip route add dst-address=0.0.0.0/0 gateway=192.168.10.254",
    );
    expect(added.state.routes).toEqual([{ destination: "0.0.0.0/0", gateway: "192.168.10.254" }]);
    expect(added.output.join(" ")).toContain("gateway reachable");
    expect(runRouterOsCommand(added.state, "/ip route print").output[1]).toContain("0.0.0.0/0");
  });

  it("rejects the router address, network address, and broadcast address as gateways", () => {
    const address = runRouterOsCommand(
      createRouterOsState(),
      "/ip address add address=192.168.10.1/24 interface=ether1",
    );
    for (const gateway of ["192.168.10.1", "192.168.10.0", "192.168.10.255"]) {
      const result = runRouterOsCommand(
        address.state,
        "/ip route add dst-address=0.0.0.0/0 gateway=" + gateway,
      );
      expect(result.output.join(" ")).toContain("is unreachable");
      expect(result.state.routes).toHaveLength(0);
    }
  });

  it("simulates ping only when a connected network or reachable default gateway exists", () => {
    const address = runRouterOsCommand(
      createRouterOsState(),
      "/ip address add address=192.168.10.1/24 interface=ether1",
    );
    expect(runRouterOsCommand(address.state, "/ping 192.168.10.20").output.join(" ")).toContain(
      "1 received",
    );
    expect(runRouterOsCommand(address.state, "/ping 10.0.0.1").output.join(" ")).toContain(
      "0 received",
    );

    const route = runRouterOsCommand(
      address.state,
      "/ip route add dst-address=0.0.0.0/0 gateway=192.168.10.254",
    );
    expect(runRouterOsCommand(route.state, "/ping 10.0.0.1").output.join(" ")).toContain(
      "1 received",
    );
  });
});
