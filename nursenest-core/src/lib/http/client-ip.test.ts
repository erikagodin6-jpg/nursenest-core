import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTrustedClientIp, rateLimitClientPartition } from "@/lib/http/client-ip";

describe("rateLimitClientPartition", () => {
  it("returns real IP unchanged", () => {
    const h = new Headers();
    assert.equal(rateLimitClientPartition({ headers: h }, "203.0.113.1"), "203.0.113.1");
  });

  it("partitions unknown IPs by coarse headers", () => {
    const a = new Headers({ "user-agent": "Mozilla/5.0 Test", "accept-language": "en-CA" });
    const b = new Headers({ "user-agent": "Chrome/120", "accept-language": "fr-FR" });
    const ua = rateLimitClientPartition({ headers: a }, "unknown");
    const ub = rateLimitClientPartition({ headers: b }, "unknown");
    assert.notEqual(ua, "unknown");
    assert.notEqual(ub, "unknown");
    assert.notEqual(ua, ub);
  });
});

describe("getTrustedClientIp", () => {
  it("reads first public x-forwarded-for hop (skips leading internal LB)", () => {
    const h = new Headers({ "x-forwarded-for": "10.0.0.1, 198.51.100.2" });
    assert.equal(getTrustedClientIp({ headers: h }), "198.51.100.2");
  });

  it("still returns client-first ordering when already correct", () => {
    const h = new Headers({ "x-forwarded-for": "198.51.100.2, 10.0.0.1" });
    assert.equal(getTrustedClientIp({ headers: h }), "198.51.100.2");
  });
});
