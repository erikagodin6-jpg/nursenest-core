import { safeServerLog } from "@/lib/observability/safe-server-log";

type RedisFixedWindowClient = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

type RedisWithDel = RedisFixedWindowClient & { del: (key: string) => Promise<unknown> };

// ─── Process-local fallback limiter ──────────────────────────────────────────
// Active when Redis is unavailable. Uses fixed-window semantics identical to the
// Redis path. Bounded to prevent unbounded memory growth under attack traffic.
//
// Design constraints:
//   - MAX_BUCKETS limits total memory regardless of attacker IP diversity
//   - When at capacity, oldest bucket is evicted (LRU via Map insertion order)
//   - Fallback limit is 60 % of the Redis limit — deliberately MORE conservative
//     so an outage does not silently relax protection
//   - Intentionally NOT shared with the Redis path; the two are independent

const FALLBACK_MAX_BUCKETS = parseEnvPositiveInt(
  "NN_RL_FALLBACK_MAX_BUCKETS",
  2_000,
);

// Ratio applied to the Redis max when computing the fallback ceiling.
// 0.6 = 60 % of the configured Redis limit. Configurable but capped at 1.0.
function fallbackLimitRatio(): number {
  const raw = process.env.NN_RL_FALLBACK_RATIO?.trim();
  if (!raw) return 0.6;
  const n = Number.parseFloat(raw);
  if (!Number.isFinite(n) || n <= 0) return 0.6;
  return Math.min(1.0, n);
}

type FallbackBucket = { count: number; resetsAt: number };
const fallbackStore = new Map<string, FallbackBucket>();

// Rolling count of fallback activations since process start (read by dashboard)
let fallbackEventCount = 0;
let fallbackLastActivatedAt: number | null = null;

/** Snapshot of process-local fallback limiter state — safe to expose to admin dashboard. */
export type FallbackLimiterStats = {
  active: boolean;
  bucketCount: number;
  bucketCapacity: number;
  eventCountSinceStart: number;
  lastActivatedAt: string | null;
  limitRatio: number;
};

export function getFallbackLimiterStats(): FallbackLimiterStats {
  return {
    active: fallbackEventCount > 0 || fallbackStore.size > 0,
    bucketCount: fallbackStore.size,
    bucketCapacity: FALLBACK_MAX_BUCKETS,
    eventCountSinceStart: fallbackEventCount,
    lastActivatedAt: fallbackLastActivatedAt
      ? new Date(fallbackLastActivatedAt).toISOString()
      : null,
    limitRatio: fallbackLimitRatio(),
  };
}

function fallbackEvictOldestIfNeeded(): void {
  if (fallbackStore.size < FALLBACK_MAX_BUCKETS) return;
  // Map iterates in insertion order — first key is the oldest
  const oldest = fallbackStore.keys().next().value as string | undefined;
  if (oldest !== undefined) fallbackStore.delete(oldest);
}

function checkFallbackFixedWindow(
  key: string,
  windowMs: number,
  max: number,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const effectiveMax = Math.max(1, Math.floor(max * fallbackLimitRatio()));
  const existing = fallbackStore.get(key);

  fallbackEventCount += 1;
  fallbackLastActivatedAt = now;

  if (existing && now < existing.resetsAt) {
    existing.count += 1;
    const ok = existing.count <= effectiveMax;
    return { ok, remaining: Math.max(0, effectiveMax - existing.count) };
  }

  // New or expired window — evict oldest if at cap before inserting
  if (!existing) fallbackEvictOldestIfNeeded();
  fallbackStore.set(key, { count: 1, resetsAt: now + windowMs });
  return { ok: true, remaining: effectiveMax - 1 };
}

function parseEnvPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

function fixedWindowTtlSeconds(windowMs: number): number {
  return Math.max(1, Math.ceil(windowMs / 1000));
}

/** Brute-force throttle inside `authorize` — per (IP partition + login identifier hash) only (hotfix: no shared-IP burst). */
const CREDENTIALS_LOGIN_COMBO_WINDOW_MS = 60_000;

/** Redis key prefix for credentials RL rows — operator / SCAN scripts must stay aligned. */
export const CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX = "ratelimit:auth:credentials_login:" as const;

function credentialsLoginComboMax(): number {
  if (process.env.NODE_ENV !== "production") {
    return parseEnvPositiveInt("NN_CREDENTIALS_RL_COMBO_MAX", 80);
  }
  /** Production hotfix: generous window so legitimate retries + NAT office never mirror a brute-force profile. */
  return parseEnvPositiveInt("NN_CREDENTIALS_RL_COMBO_MAX", 80);
}

/** Staff/admin accounts: separate Redis key + higher ceiling — not shared with public learner combo buckets. */
function credentialsLoginComboMaxStaff(): number {
  if (process.env.NODE_ENV !== "production") {
    return parseEnvPositiveInt("NN_CREDENTIALS_RL_STAFF_COMBO_MAX", 480);
  }
  return parseEnvPositiveInt("NN_CREDENTIALS_RL_STAFF_COMBO_MAX", 480);
}

export function credentialsLoginBurstRedisKey(ipKey: string): string {
  return `${CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX}burst:ip:${ipKey}`;
}

/** Public (learner) credentials failures — per (ip partition, identifier hash). */
export function credentialsLoginComboRedisKey(ipKey: string, acctHash: string): string {
  return `${CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX}combo:ip:${ipKey}:acct:${acctHash}`;
}

/** Staff/admin credentials failures — isolated from public combo so ops traffic does not collide. */
export function credentialsLoginComboRedisKeyStaff(ipKey: string, acctHash: string): string {
  return `${CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX}combo:staff:ip:${ipKey}:acct:${acctHash}`;
}

/**
 * **Hotfix (2026-04):** always `false`.
 *
 * Preflight reads of the combo counter interacted badly with stale Redis state and gave false
 * "Too many sign-in attempts" before password verification. Brute-force protection now relies only on
 * {@link consumeCredentialsLoginFailure} after **confirmed** failed outcomes, with a high per-(IP, id)
 * threshold.
 */
export async function isCredentialsLoginRateLimited(_ipKey: string, _acctHash: string): Promise<boolean> {
  return false;
}

/**
 * Increment fixed-window counter after a **failed** credential authentication outcome only.
 * Successful password checks must not call this (and should call {@link resetCredentialsLoginRateLimitKeys}).
 *
 * **Hotfix:** no longer uses a per-IP-only "burst" bucket — that counter was shared by everyone behind
 * the same NAT partition and caused false positives when unrelated accounts exhausted the IP window.
 * Only the per-(ipKey, acctHash) combo counter is incremented here.
 */
export async function consumeCredentialsLoginFailure(
  ipKey: string,
  acctHash: string,
  opts?: { staffAccount?: boolean },
): Promise<{ ok: boolean }> {
  if (!acctHash) return { ok: true };
  const staff = Boolean(opts?.staffAccount);
  const key = staff ? credentialsLoginComboRedisKeyStaff(ipKey, acctHash) : credentialsLoginComboRedisKey(ipKey, acctHash);
  const max = staff ? credentialsLoginComboMaxStaff() : credentialsLoginComboMax();
  const combo = await checkRedisFixedWindowLimit(key, {
    windowMs: CREDENTIALS_LOGIN_COMBO_WINDOW_MS,
    max,
  });
  return { ok: combo.ok };
}

/** After a successful password check — clears windows so the same user is not punished on next navigation. */
export async function resetCredentialsLoginRateLimitKeys(ipKey: string, acctHash: string): Promise<void> {
  try {
    const { getRedisClient } = await import("@/lib/server/redis");
    const redis = getRedisClient() as RedisWithDel | null;
    if (!redis) return;
    await Promise.all([
      redis.del(credentialsLoginBurstRedisKey(ipKey)),
      redis.del(credentialsLoginComboRedisKey(ipKey, acctHash)),
      redis.del(credentialsLoginComboRedisKeyStaff(ipKey, acctHash)),
    ]);
  } catch (error) {
    safeServerLog("security", "credentials_login_rl_reset_failed", {
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
  }
}

/** Operator/debug: clear only the per-IP-partition burst bucket (NAT-wide noise), leaving per-account combo intact. */
export async function resetCredentialsLoginBurstKeyOnly(ipKey: string): Promise<void> {
  try {
    const { getRedisClient } = await import("@/lib/server/redis");
    const redis = getRedisClient() as RedisWithDel | null;
    if (!redis) return;
    await redis.del(credentialsLoginBurstRedisKey(ipKey));
  } catch (error) {
    safeServerLog("security", "credentials_login_rl_reset_failed", {
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
      surface: "burst_only",
    });
  }
}

export async function checkRedisFixedWindowLimit(
  key: string,
  opts: { windowMs: number; max: number; redis?: RedisFixedWindowClient | null },
): Promise<{ ok: boolean; remaining: number }> {
  let redis: RedisFixedWindowClient | null | undefined = opts.redis;
  if (redis === undefined) {
    try {
      const { getRedisClient } = await import("@/lib/server/redis");
      redis = getRedisClient();
    } catch {
      redis = null;
    }
  }

  // Redis unavailable — engage process-local fallback limiter.
  // The fallback applies a stricter ceiling (60 % of the Redis max by default)
  // so protection remains active rather than silently bypassing limits.
  if (!redis) {
    safeServerLog("security", "rl_fallback_active", {
      keyPrefix: key.slice(0, 48),
      reason: "redis_unavailable",
    });
    return checkFallbackFixedWindow(key, opts.windowMs, opts.max);
  }

  try {
    const rawCount = await redis.incr(key);
    const count = typeof rawCount === "bigint" ? Number(rawCount) : Number(rawCount);
    const safeCount = Number.isFinite(count) ? count : 0;
    if (safeCount === 1) {
      await redis.expire(key, fixedWindowTtlSeconds(opts.windowMs));
    }

    return {
      ok: safeCount <= opts.max,
      remaining: Math.max(0, opts.max - safeCount),
    };
  } catch (error) {
    // Redis call failed mid-flight — engage fallback rather than failing open.
    safeServerLog("security", "rl_fallback_active", {
      keyPrefix: key.slice(0, 48),
      reason: "redis_error",
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return checkFallbackFixedWindow(key, opts.windowMs, opts.max);
  }
}
