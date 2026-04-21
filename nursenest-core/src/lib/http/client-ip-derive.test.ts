import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  deriveTrustedClientIp,
  isNonRoutableOrPrivateIpv4,
  pickClientIpFromXForwardedFor,
} from "@/lib/http/client-ip-derive";

describe("pickClientIpFromXForwardedFor", () => {
  it("returns first public hop when internal LB is leftmost", () => {
    assert.equal(pickClientIpFromXForwardedFor("10.0.0.1, 198.51.100.2"), "198.51.100.2");
  });

  it("returns first public when already ordered client-first", () => {
    assert.equal(pickClientIpFromXForwardedFor("198.51.100.2, 10.0.0.1"), "198.51.100.2");
  });

  it("returns null when every hop is private", () => {
    assert.equal(pickClientIpFromXForwardedFor("10.0.0.1, 172.16.0.5"), null);
  });
});

describe("isNonRoutableOrPrivateIpv4", () => {
  it("detects RFC1918", () => {
    assert.equal(isNonRoutableOrPrivateIpv4([10, 1, 2, 3]), true);
    assert.equal(isNonRoutableOrPrivateIpv4([192, 168, 0, 1]), true);
    assert.equal(isNonRoutableOrPrivateIpv4([203, 0, 113, 1]), false);
  });
});

describe("deriveTrustedClientIp", () => {
  it("prefers cf-connecting-ip over misordered x-forwarded-for", () => {
    const h = new Headers({
      "cf-connecting-ip": "198.51.100.9",
      "x-forwarded-for": "10.0.0.1, 10.0.0.2",
    });
    const d = deriveTrustedClientIp({ headers: h });
    assert.equal(d.ip, "198.51.100.9");
    assert.equal(d.source, "cf-connecting-ip");
  });

  it("uses first public from x-forwarded-for when no CF header", () => {
    const h = new Headers({ "x-forwarded-for": "10.0.0.1, 198.51.100.2" });
    const d = deriveTrustedClientIp({ headers: h });
    assert.equal(d.ip, "198.51.100.2");
    assert.equal(d.source, "x-forwarded-for");
  });

  it("returns unknown when only private xff and no trusted single-ip headers", () => {
    const h = new Headers({ "x-forwarded-for": "10.0.0.1" });
    assert.equal(deriveTrustedClientIp({ headers: h }).ip, "unknown");
  });
});
