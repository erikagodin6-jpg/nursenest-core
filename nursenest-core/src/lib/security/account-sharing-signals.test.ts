/**
 * Pure logic for soft account-sharing heuristics (no DB).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateAccountSharingSignals, hmacHex } from "@/lib/security/account-sharing-signals";

describe("account sharing signals (pure)", () => {
  it("flags when distinct IPs exceed soft threshold", () => {
    const ev = evaluateAccountSharingSignals({
      distinctIps24h: 6,
      activeDeviceSlots7d: 1,
      multiRegionShortWindow: false,
      maxIps: 5,
      maxDevices: 4,
    });
    assert.ok(ev.reasons.includes("many_distinct_ips_24h"));
  });

  it("flags when device slots exceed soft threshold", () => {
    const ev = evaluateAccountSharingSignals({
      distinctIps24h: 1,
      activeDeviceSlots7d: 5,
      multiRegionShortWindow: false,
      maxIps: 5,
      maxDevices: 4,
    });
    assert.ok(ev.reasons.includes("many_device_slots_7d"));
  });

  it("flags multi-region short window", () => {
    const ev = evaluateAccountSharingSignals({
      distinctIps24h: 1,
      activeDeviceSlots7d: 1,
      multiRegionShortWindow: true,
      maxIps: 5,
      maxDevices: 4,
    });
    assert.ok(ev.reasons.includes("multi_region_short_window"));
  });

  it("hmacHex is deterministic for the same input and secret", () => {
    process.env.AUTH_SECRET = "unit-test-secret-account-sharing";
    const a = hmacHex("ip:203.0.113.7");
    const b = hmacHex("ip:203.0.113.7");
    assert.equal(a, b);
    assert.equal(a.length, 64);
  });
});
