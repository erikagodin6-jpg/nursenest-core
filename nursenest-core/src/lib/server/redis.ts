import "server-only";

import { Redis } from "@upstash/redis";

export type RedisJsonClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, options?: { ex?: number }) => Promise<unknown>;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
  /** Clear fixed-window counters (e.g. after successful credential login). */
  del: (key: string) => Promise<unknown>;
};

// ─── Health state ─────────────────────────────────────────────────────────────

export type RedisHealthState =
  | "unchecked"    // client not yet created
  | "misconfigured" // env vars present but URL/token shape is wrong
  | "unavailable"   // env vars absent — Redis is explicitly not configured
  | "reachable"     // ping succeeded
  | "unreachable";  // env vars present but connection / ping failed

let healthState: RedisHealthState = "unchecked";
let healthCheckedAt: number | null = null;

export function getRedisHealthState(): RedisHealthState {
  return healthState;
}

export function getRedisHealthSnapshot(): { state: RedisHealthState; checkedAt: number | null } {
  return { state: healthState, checkedAt: healthCheckedAt };
}

// ─── Client singleton ─────────────────────────────────────────────────────────

let redisClientSingleton: RedisJsonClient | null | undefined;

function validateRedisUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "rediss:" || u.protocol === "redis:";
  } catch {
    return false;
  }
}

function createRedisClient(): RedisJsonClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (!url && !token) {
    healthState = "unavailable";
    console.log("[nursenest-core] redis: unavailable — UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set");
    return null;
  }

  if (!url || !token) {
    healthState = "misconfigured";
    console.error("[nursenest-core] redis: misconfigured — one of UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN is missing");
    return null;
  }

  if (!validateRedisUrl(url)) {
    healthState = "misconfigured";
    console.error("[nursenest-core] redis: misconfigured — UPSTASH_REDIS_REST_URL does not look like a valid URL");
    return null;
  }

  const r = new Redis({ url, token });
  const client = {
    get: (key: string) => r.get(key),
    set: (key: string, value: unknown, options?: { ex?: number }) =>
      r.set(key, value as never, options as never),
    incr: (key: string) => r.incr(key),
    expire: (key: string, seconds: number) => r.expire(key, seconds),
    del: (key: string) => r.del(key),
  };

  // Non-blocking background ping — does not delay client creation or first request
  Promise.resolve().then(async () => {
    try {
      await r.ping();
      healthState = "reachable";
      healthCheckedAt = Date.now();
      console.log("[nursenest-core] redis: reachable — ping OK");
    } catch (err) {
      healthState = "unreachable";
      healthCheckedAt = Date.now();
      const detail = err instanceof Error ? err.message.slice(0, 160) : String(err);
      console.error(`[nursenest-core] redis: unreachable — ping failed: ${detail}`);
    }
  });

  return client as unknown as RedisJsonClient;
}

export function getRedisClient(): RedisJsonClient | null {
  if (redisClientSingleton === undefined) {
    redisClientSingleton = createRedisClient();
  }
  return redisClientSingleton;
}

export function isRedisConfigured(): boolean {
  return getRedisClient() !== null;
}
