import { createClient } from "redis";
import { emitStructuredLog } from "./log-sink";

export const ACTIVE_BUILD_PRIORITY = "AI_TUTORING_ASSISTANT";

const ENABLE_AI_AUTOGEN = process.env.ENABLE_AI_AUTOGEN === "true";
const MAX_AI_ITEMS_PER_DAY = parseInt(process.env.MAX_AI_ITEMS_PER_DAY || "200", 10);
const MAX_AI_TOKENS_PER_DAY = parseInt(process.env.MAX_AI_TOKENS_PER_DAY || "300000", 10);
const FREE_TIER_DAILY_LIMIT = parseInt(process.env.FREE_TIER_DAILY_LIMIT || "3", 10);
const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "5", 10);
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

interface DailyUsage {
  date: string;
  itemsGenerated: number;
  tokensUsed: number;
}

interface AiCallLog {
  timestamp: number;
  userId?: string;
  endpoint?: string;
  tokens: number;
  success: boolean;
}

export type CheckAiLimitsResult = {
  allowed: boolean;
  reason?: string;
  code?: string;
};

type RecordAiUsageOptions = {
  userId?: string;
  endpoint?: string;
  success?: boolean;
};

type CheckAiLimitsOptions = {
  role?: string;
  userId?: string;
};

type RuntimeAiConfig = {
  enabled: boolean;
  maxItemsPerDay: number;
  maxTokensPerDay: number;
  freeTierDailyLimit: number;
  rateLimitPerMinute: number;
};

let runtimeEnabled = ENABLE_AI_AUTOGEN;
let runtimeMaxItems = MAX_AI_ITEMS_PER_DAY;
let runtimeMaxTokens = MAX_AI_TOKENS_PER_DAY;
let runtimeFreeTierLimit = FREE_TIER_DAILY_LIMIT;
let runtimeRateLimit = RATE_LIMIT_PER_MINUTE;

/** Concrete client type from `createClient` (avoids default `RedisClientType` vs module augmentation mismatches). */
type AiRedisClient = ReturnType<typeof createClient>;

let redisClient: AiRedisClient | null = null;
let redisConnectPromise: Promise<AiRedisClient> | null = null;

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUnixNow(): number {
  return Date.now();
}

function secondsUntilTomorrowUtc(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(now.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return Math.max(1, Math.ceil((tomorrow.getTime() - now.getTime()) / 1000));
}

function getRedis(): Promise<AiRedisClient> {
  if (redisClient?.isOpen) {
    return Promise.resolve(redisClient);
  }

  if (redisConnectPromise) {
    return redisConnectPromise;
  }

  const pending = (async () => {
    const client = createClient({ url: REDIS_URL });

    client.on("error", (err) => {
      console.error("[ai-limits] Redis error:", err);
    });

    await client.connect();
    redisClient = client;
    return client;
  })();

  redisConnectPromise = pending;
  return pending.finally(() => {
    redisConnectPromise = null;
  });
}

function getGlobalItemsKey(date: string): string {
  return `ai:usage:${date}:items`;
}

function getGlobalTokensKey(date: string): string {
  return `ai:usage:${date}:tokens`;
}

function getUserDailyCountKey(date: string, userId: string): string {
  return `ai:user:${userId}:${date}:count`;
}

function getUserRateLimitKey(userId: string): string {
  return `ai:user:${userId}:ratelimit`;
}

function getRecentCallsLogKey(): string {
  return "ai:recent_calls";
}

function getRuntimeConfigKey(): string {
  return "ai:runtime_config";
}

async function loadRuntimeOverrides(): Promise<void> {
  const redis = await getRedis();
  const config = await redis.hGetAll(getRuntimeConfigKey());

  if (!config || Object.keys(config).length === 0) return;

  if (config.enabled !== undefined) {
    runtimeEnabled = config.enabled === "true";
  }
  if (config.maxItemsPerDay !== undefined) {
    const value = parseInt(config.maxItemsPerDay, 10);
    if (Number.isFinite(value) && value > 0) runtimeMaxItems = value;
  }
  if (config.maxTokensPerDay !== undefined) {
    const value = parseInt(config.maxTokensPerDay, 10);
    if (Number.isFinite(value) && value > 0) runtimeMaxTokens = value;
  }
  if (config.freeTierDailyLimit !== undefined) {
    const value = parseInt(config.freeTierDailyLimit, 10);
    if (Number.isFinite(value) && value > 0) runtimeFreeTierLimit = value;
  }
  if (config.rateLimitPerMinute !== undefined) {
    const value = parseInt(config.rateLimitPerMinute, 10);
    if (Number.isFinite(value) && value > 0) runtimeRateLimit = value;
  }
}

async function getGlobalUsage(date: string): Promise<DailyUsage> {
  const redis = await getRedis();
  const [itemsRaw, tokensRaw] = await Promise.all([
    redis.get(getGlobalItemsKey(date)),
    redis.get(getGlobalTokensKey(date)),
  ]);

  return {
    date,
    itemsGenerated: parseInt(itemsRaw || "0", 10),
    tokensUsed: parseInt(tokensRaw || "0", 10),
  };
}

async function incrementWithExpiry(key: string, amount: number, expirySeconds: number): Promise<number> {
  const redis = await getRedis();
  const tx = redis.multi();
  tx.incrBy(key, amount);
  tx.expire(key, expirySeconds, "NX");
  const result = await tx.exec();

  if (!result || !result[0]) {
    throw new Error(`Failed to increment Redis key: ${key}`);
  }

  return Number(result[0]);
}

async function appendRecentCall(log: AiCallLog): Promise<void> {
  const redis = await getRedis();
  const timestampScore = log.timestamp;
  const member = JSON.stringify(log);
  const oneHourAgo = timestampScore - 60 * 60 * 1000;

  const tx = redis.multi();
  tx.zAdd(getRecentCallsLogKey(), { score: timestampScore, value: member });
  tx.zRemRangeByScore(getRecentCallsLogKey(), 0, oneHourAgo);
  tx.expire(getRecentCallsLogKey(), 2 * 60 * 60);
  await tx.exec();
}

async function getRecentCallCountLastHour(): Promise<number> {
  const redis = await getRedis();
  const now = getUnixNow();
  const oneHourAgo = now - 60 * 60 * 1000;
  return redis.zCount(getRecentCallsLogKey(), oneHourAgo, now);
}

async function getUserRateLimitCountLastMinute(userId: string): Promise<number> {
  const redis = await getRedis();
  const key = getUserRateLimitKey(userId);
  const now = getUnixNow();
  const oneMinuteAgo = now - 60 * 1000;

  const tx = redis.multi();
  tx.zRemRangeByScore(key, 0, oneMinuteAgo);
  tx.zCount(key, oneMinuteAgo, now);
  tx.expire(key, 120);
  const result = await tx.exec();

  if (!result || !result[1]) {
    throw new Error(`Failed to read rate limit count for user ${userId}`);
  }

  return Number(result[1]);
}

async function addUserRateLimitHit(userId: string): Promise<void> {
  const redis = await getRedis();
  const key = getUserRateLimitKey(userId);
  const now = getUnixNow();
  const member = `${now}:${Math.random().toString(36).slice(2, 10)}`;

  const tx = redis.multi();
  tx.zAdd(key, { score: now, value: member });
  tx.zRemRangeByScore(key, 0, now - 60 * 1000);
  tx.expire(key, 120);
  await tx.exec();
}

export async function checkAiLimits(opts?: CheckAiLimitsOptions): Promise<CheckAiLimitsResult> {
  await loadRuntimeOverrides();

  const role = opts?.role || "";
  const userId = opts?.userId;
  const isAdmin = role === "admin";
  const today = getTodayKey();

  const globalUsage = await getGlobalUsage(today);

  if (isAdmin) {
    if (globalUsage.tokensUsed >= runtimeMaxTokens) {
      return {
        allowed: false,
        reason: `Daily token budget exhausted (${runtimeMaxTokens} tokens). Resets at midnight UTC.`,
        code: "AI_QUOTA_EXCEEDED",
      };
    }
    return { allowed: true };
  }

  if (!runtimeEnabled) {
    return {
      allowed: false,
      reason: "AI generation is currently disabled.",
      code: "AI_DISABLED",
    };
  }

  if (globalUsage.itemsGenerated >= runtimeMaxItems) {
    return {
      allowed: false,
      reason: `Daily AI item cap reached (${runtimeMaxItems} items). Resets at midnight UTC.`,
      code: "AI_QUOTA_EXCEEDED",
    };
  }

  if (globalUsage.tokensUsed >= runtimeMaxTokens) {
    return {
      allowed: false,
      reason: `Daily AI token cap reached (${runtimeMaxTokens} tokens). Resets at midnight UTC.`,
      code: "AI_QUOTA_EXCEEDED",
    };
  }

  if (!userId) {
    return {
      allowed: false,
      reason: "User not identified.",
      code: "AI_USER_REQUIRED",
    };
  }

  const redis = await getRedis();
  const userCountRaw = await redis.get(getUserDailyCountKey(today, userId));
  const userCount = parseInt(userCountRaw || "0", 10);

  if (userCount >= runtimeFreeTierLimit) {
    return {
      allowed: false,
      reason: `Free-tier daily limit reached (${runtimeFreeTierLimit} generations). Upgrade for unlimited.`,
      code: "AI_QUOTA_EXCEEDED",
    };
  }

  const recentUserCalls = await getUserRateLimitCountLastMinute(userId);
  if (recentUserCalls >= runtimeRateLimit) {
    return {
      allowed: false,
      reason: `Rate limit: max ${runtimeRateLimit} requests per minute. Please wait.`,
      code: "AI_RATE_LIMIT",
    };
  }

  return { allowed: true };
}

export async function recordAiUsage(
  items: number = 1,
  tokens: number = 0,
  opts?: RecordAiUsageOptions,
): Promise<void> {
  await loadRuntimeOverrides();

  const today = getTodayKey();
  const expirySeconds = secondsUntilTomorrowUtc();
  const now = getUnixNow();
  const success = opts?.success !== false;

  const globalResults = await Promise.allSettled([
    incrementWithExpiry(getGlobalItemsKey(today), items, expirySeconds),
    incrementWithExpiry(getGlobalTokensKey(today), tokens, expirySeconds),
  ]);
  for (let i = 0; i < globalResults.length; i++) {
    const r = globalResults[i];
    if (r.status === "rejected") {
      emitStructuredLog(
        {
          level: "error",
          type: "ai_usage_global_increment_failed",
          provider: "redis",
          index: i,
          msg: r.reason instanceof Error ? r.reason.message : String(r.reason),
        },
        "error",
      );
    }
  }

  if (opts?.userId) {
    const userResults = await Promise.allSettled([
      incrementWithExpiry(getUserDailyCountKey(today, opts.userId), items, expirySeconds),
      addUserRateLimitHit(opts.userId),
    ]);
    for (let i = 0; i < userResults.length; i++) {
      const r = userResults[i];
      if (r.status === "rejected") {
        emitStructuredLog(
          {
            level: "error",
            type: "ai_usage_user_increment_failed",
            provider: "redis",
            userId: opts.userId,
            index: i,
            msg: r.reason instanceof Error ? r.reason.message : String(r.reason),
          },
          "error",
        );
      }
    }
  }

  await appendRecentCall({
    timestamp: now,
    userId: opts?.userId,
    endpoint: opts?.endpoint,
    tokens,
    success,
  });
}

/** Optional context for structured logs when Redis append of usage totals fails. */
export type AiUsageLogContext = {
  route?: string;
  job?: string;
  batch?: number;
  requestId?: string;
  userId?: string;
  provider?: string;
};

/**
 * Fire-and-forget usage accounting for HTTP handlers. Failures are logged (do not fail the request).
 */
export function recordAiUsageFireAndForget(
  items: number = 1,
  tokens: number = 0,
  opts?: RecordAiUsageOptions,
  ctx?: AiUsageLogContext,
): void {
  void recordAiUsage(items, tokens, opts).catch((err: unknown) => {
    emitStructuredLog(
      {
        level: "error",
        type: "ai_usage_record_failed",
        provider: ctx?.provider ?? "openai",
        route: ctx?.route,
        job: ctx?.job,
        batch: ctx?.batch,
        requestId: ctx?.requestId,
        userId: ctx?.userId,
        msg: err instanceof Error ? err.message : String(err),
      },
      "error",
    );
  });
}

export async function getAiConfig() {
  await loadRuntimeOverrides();

  const today = getTodayKey();
  const usage = await getGlobalUsage(today);
  const recentCallCount = await getRecentCallCountLastHour();

  return {
    enabled: runtimeEnabled,
    maxItemsPerDay: runtimeMaxItems,
    maxTokensPerDay: runtimeMaxTokens,
    freeTierDailyLimit: runtimeFreeTierLimit,
    rateLimitPerMinute: runtimeRateLimit,
    usage,
    recentCallCount,
    model: process.env.AI_MODEL || "gpt-4o-mini",
  };
}

export async function pruneUserDailyCounts(): Promise<void> {
  const redis = await getRedis();
  const stream = redis.scanIterator({
    MATCH: "ai:user:*:*:count",
    COUNT: 500,
  });

  const today = getTodayKey();
  const todaySuffix = `:${today}:count`;

  for await (const key of stream) {
    const k = Array.isArray(key) ? key.join("") : key;
    if (!k.endsWith(todaySuffix)) {
      await redis.del(k);
    }
  }

  const streamRate = redis.scanIterator({
    MATCH: "ai:user:*:ratelimit",
    COUNT: 500,
  });

  for await (const key of streamRate) {
    const k = Array.isArray(key) ? key.join("") : key;
    const ttl = await redis.ttl(k);
    if (ttl < 0) {
      await redis.expire(k, 120);
    }
  }

  const recentKey = getRecentCallsLogKey();
  const oneHourAgo = getUnixNow() - 60 * 60 * 1000;
  await redis.zRemRangeByScore(recentKey, 0, oneHourAgo);
  await redis.expire(recentKey, 2 * 60 * 60);
}

export async function setAiConfig(config: {
  enabled?: boolean;
  maxItemsPerDay?: number;
  maxTokensPerDay?: number;
  freeTierDailyLimit?: number;
  rateLimitPerMinute?: number;
}): Promise<void> {
  const redis = await getRedis();
  const updates: Record<string, string> = {};

  if (typeof config.enabled === "boolean") {
    runtimeEnabled = config.enabled;
    updates.enabled = String(config.enabled);
  }

  if (typeof config.maxItemsPerDay === "number" && config.maxItemsPerDay > 0) {
    runtimeMaxItems = config.maxItemsPerDay;
    updates.maxItemsPerDay = String(config.maxItemsPerDay);
  }

  if (typeof config.maxTokensPerDay === "number" && config.maxTokensPerDay > 0) {
    runtimeMaxTokens = config.maxTokensPerDay;
    updates.maxTokensPerDay = String(config.maxTokensPerDay);
  }

  if (typeof config.freeTierDailyLimit === "number" && config.freeTierDailyLimit > 0) {
    runtimeFreeTierLimit = config.freeTierDailyLimit;
    updates.freeTierDailyLimit = String(config.freeTierDailyLimit);
  }

  if (typeof config.rateLimitPerMinute === "number" && config.rateLimitPerMinute > 0) {
    runtimeRateLimit = config.rateLimitPerMinute;
    updates.rateLimitPerMinute = String(config.rateLimitPerMinute);
  }

  if (Object.keys(updates).length > 0) {
    await redis.hSet(getRuntimeConfigKey(), updates);
  }
}

export async function closeAiRedisConnection(): Promise<void> {
  if (redisClient?.isOpen) {
    await redisClient.quit();
    redisClient = null;
  }
}