/**
 * In-process rate limit buckets (auth, password, list cost).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { checkRateLimit, consumeRateLimit, peekRateLimitWindow } from "@/lib/http/rate-limit-in-memory";

describe("peekRateLimitWindow", () => {
  it("returns count without mutating", () => {
    const key = `peek-${Date.now()}`;
    const opts = { windowMs: 60_000, max: 10 };
    consumeRateLimit(key, 3, opts);
    assert.deepEqual(peekRateLimitWindow(key, opts).count, 3);
    assert.deepEqual(peekRateLimitWindow(key, opts).count, 3);
  });
});

describe("checkRateLimit", () => {
  it("allows up to max calls per window then denies", () => {
    const key = `rl-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      const r = checkRateLimit(key, { windowMs: 60_000, max: 3 });
      assert.equal(r.ok, true);
    }
    const blocked = checkRateLimit(key, { windowMs: 60_000, max: 3 });
    assert.equal(blocked.ok, false);
    assert.equal(blocked.remaining, 0);
  });
});

describe("consumeRateLimit", () => {
  it("reserves cost against shared max (pagination abuse)", () => {
    const key = `rl-cost-${Date.now()}`;
    const a = consumeRateLimit(key, 8, { windowMs: 60_000, max: 20 });
    assert.equal(a.ok, true);
    const b = consumeRateLimit(key, 8, { windowMs: 60_000, max: 20 });
    assert.equal(b.ok, true);
    const c = consumeRateLimit(key, 8, { windowMs: 60_000, max: 20 });
    assert.equal(c.ok, false);
  });
});
