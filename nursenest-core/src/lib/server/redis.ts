import "server-only";

import { Redis } from "@upstash/redis";

export type RedisJsonClient = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, options?: { ex?: number }) => Promise<unknown>;
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

let redisClientSingleton: RedisJsonClient | null | undefined;

function createRedisClient(): RedisJsonClient | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  return new Redis({ url, token });
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
