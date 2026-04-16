/**
 * {@link RateLimitStore} contract — in-memory adapter (nn-db-final-004).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createInMemoryRateLimitStore } from "@/lib/http/rate-limit-in-memory";

describe("RateLimitStore (in-memory)", () => {
  it("check allows up to max then denies with remaining 0", async () => {
    const store = createInMemoryRateLimitStore();
    const key = `rl-store-${Date.now()}`;
    const opts = { windowMs: 60_000, max: 2 };
    assert.deepEqual(await store.check(key, opts), { ok: true, remaining: 1 });
    assert.deepEqual(await store.check(key, opts), { ok: true, remaining: 0 });
    assert.deepEqual(await store.check(key, opts), { ok: false, remaining: 0 });
  });

  it("consume subtracts cost from remaining", async () => {
    const store = createInMemoryRateLimitStore();
    const key = `rl-consume-${Date.now()}`;
    const opts = { windowMs: 60_000, max: 10 };
    assert.deepEqual(await store.consume(key, 4, opts), { ok: true, remaining: 6 });
    assert.deepEqual(await store.consume(key, 7, opts), { ok: false, remaining: 6 });
  });
});
