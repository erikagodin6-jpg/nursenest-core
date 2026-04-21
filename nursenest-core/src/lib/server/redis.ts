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

let redisClientSingleton: RedisJsonClient | null | undefined;

function createRedisClient(): RedisJsonClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const r = new Redis({ url, token });
  return {
    get: (key) => r.get(key),
    set: (key, value, options) => r.set(key, value as never, options),
    incr: (key) => r.incr(key),
    expire: (key, seconds) => r.expire(key, seconds),
    del: (key) => r.del(key),
  };
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
