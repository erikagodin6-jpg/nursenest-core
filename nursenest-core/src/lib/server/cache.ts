import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getRedisClient, type RedisJsonClient } from "@/lib/server/redis";

type JsonCacheOptions = {
  ttlSeconds: number;
  redis?: Pick<RedisJsonClient, "get" | "set"> | null;
};

function normalizeCacheTtlSeconds(ttlSeconds: number): number {
  return Math.min(300, Math.max(60, Math.floor(ttlSeconds)));
}

export async function getOrSetJsonCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: JsonCacheOptions,
): Promise<T> {
  const redis = options.redis === undefined ? getRedisClient() : options.redis;
  if (!redis) {
    return fetcher();
  }

  try {
    const cached = await redis.get<string | null>(key);
    if (typeof cached === "string" && cached.length > 0) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    safeServerLog("cache", "redis_json_cache_read_failed", {
      keyPrefix: key.slice(0, 64),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return fetcher();
  }

  const value = await fetcher();

  try {
    await redis.set(key, JSON.stringify(value), {
      ex: normalizeCacheTtlSeconds(options.ttlSeconds),
    });
  } catch (error) {
    safeServerLog("cache", "redis_json_cache_write_failed", {
      keyPrefix: key.slice(0, 64),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
  }

  return value;
}
