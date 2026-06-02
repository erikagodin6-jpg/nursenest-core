/**
 * Unified RL: meta read + consume share the same in-memory buckets in test (Postgres disabled).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resetRateLimitStoreSingletonsForTests } from "@/lib/http/rate-limit-store-resolve";
import {
  consumeRateLimitUnified,
  readRateLimitWindowCountUnified,
} from "@/lib/http/rate-limit-unified";

describe("readRateLimitWindowCountUnified (in-memory test mode)", () => {
  it("reads strike-style window count without incrementing on read", async () => {
    resetRateLimitStoreSingletonsForTests();
    const key = `ratelimit:test:abuse:${Date.now()}`;
    const opts = { windowMs: 120_000, max: 4096 };
    assert.deepEqual(await readRateLimitWindowCountUnified(key, opts), { count: 0 });
    await consumeRateLimitUnified(key, 5, opts);
    assert.deepEqual(await readRateLimitWindowCountUnified(key, opts), { count: 5 });
    assert.deepEqual(await readRateLimitWindowCountUnified(key, opts), { count: 5 });
  });
});
