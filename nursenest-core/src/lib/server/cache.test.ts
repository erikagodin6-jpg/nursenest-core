import assert from "node:assert/strict";
import test from "node:test";
import { getOrSetJsonCache } from "@/lib/server/cache";

test("getOrSetJsonCache returns cached JSON when present", async () => {
  const calls: string[] = [];
  const redis = {
    async get(key: string) {
      calls.push(`get:${key}`);
      return JSON.stringify({ ok: true, source: "cache" });
    },
    async set() {
      calls.push("set");
      throw new Error("should not write on hit");
    },
  };

  const result = await getOrSetJsonCache("cache:test:hit", async () => {
    throw new Error("fetcher should not run on hit");
  }, { ttlSeconds: 120, redis });

  assert.deepEqual(result, { ok: true, source: "cache" });
  assert.deepEqual(calls, ["get:cache:test:hit"]);
});

test("getOrSetJsonCache populates cache on miss", async () => {
  const calls: string[] = [];
  const redis = {
    async get(key: string) {
      calls.push(`get:${key}`);
      return null;
    },
    async set(key: string, value: string, options: { ex: number }) {
      calls.push(`set:${key}:${options.ex}:${value}`);
      return "OK";
    },
  };

  const result = await getOrSetJsonCache("cache:test:miss", async () => ({ ok: true, source: "db" }), {
    ttlSeconds: 90,
    redis,
  });

  assert.deepEqual(result, { ok: true, source: "db" });
  assert.equal(calls[0], "get:cache:test:miss");
  assert.match(calls[1] ?? "", /^set:cache:test:miss:90:/);
});

test("getOrSetJsonCache fails open when redis throws", async () => {
  let fetches = 0;
  const redis = {
    async get() {
      throw new Error("redis unavailable");
    },
    async set() {
      throw new Error("redis unavailable");
    },
  };

  const result = await getOrSetJsonCache("cache:test:open", async () => {
    fetches += 1;
    return { ok: true, source: "origin" };
  }, { ttlSeconds: 60, redis });

  assert.deepEqual(result, { ok: true, source: "origin" });
  assert.equal(fetches, 1);
});
