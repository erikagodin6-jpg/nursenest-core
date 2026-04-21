import assert from "node:assert/strict";
import test from "node:test";
import { checkRedisFixedWindowLimit } from "@/lib/server/credentials-login-rate-limit";

test("checkRedisFixedWindowLimit allows requests within the window", async () => {
  const expireCalls: Array<[string, number]> = [];
  const redis = {
    async incr() {
      return 1;
    },
    async expire(key: string, seconds: number) {
      expireCalls.push([key, seconds]);
      return 1;
    },
  };

  const result = await checkRedisFixedWindowLimit("ratelimit:test:allow", {
    max: 3,
    windowMs: 60_000,
    redis,
  });

  assert.deepEqual(result, { ok: true, remaining: 2 });
  assert.deepEqual(expireCalls, [["ratelimit:test:allow", 60]]);
});

test("checkRedisFixedWindowLimit denies after the fixed-window max", async () => {
  let expireCalls = 0;
  const redis = {
    async incr() {
      return 5;
    },
    async expire() {
      expireCalls += 1;
      return 1;
    },
  };

  const result = await checkRedisFixedWindowLimit("ratelimit:test:deny", {
    max: 4,
    windowMs: 60_000,
    redis,
  });

  assert.deepEqual(result, { ok: false, remaining: 0 });
  assert.equal(expireCalls, 0);
});

test("checkRedisFixedWindowLimit fails open when redis is unavailable", async () => {
  const redis = {
    async incr() {
      throw new Error("redis unavailable");
    },
    async expire() {
      throw new Error("redis unavailable");
    },
  };

  const result = await checkRedisFixedWindowLimit("ratelimit:test:fail-open", {
    max: 4,
    windowMs: 60_000,
    redis,
  });

  assert.deepEqual(result, { ok: true, remaining: 4 });
});
