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
  const client = {
    get: (key: string) => r.get(key),
    set: (key: string, value: unknown, options?: { ex?: number }) =>
      r.set(key, value as never, options as never),
    incr: (key: string) => r.incr(key),
    expire: (key: string, seconds: number) => r.expire(key, seconds),
    del: (key: string) => r.del(key),
  };
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
