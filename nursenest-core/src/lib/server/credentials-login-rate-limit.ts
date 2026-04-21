import { safeServerLog } from "@/lib/observability/safe-server-log";

type RedisFixedWindowClient = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

type RedisWithDel = RedisFixedWindowClient & { del: (key: string) => Promise<unknown> };

function fixedWindowTtlSeconds(windowMs: number): number {
  return Math.max(1, Math.ceil(windowMs / 1000));
}

/** Brute-force throttle inside `authorize` — per (IP partition + login identifier hash) only (hotfix: no shared-IP burst). */
const CREDENTIALS_LOGIN_COMBO_WINDOW_MS = 60_000;

/** Redis key prefix for credentials RL rows — operator / SCAN scripts must stay aligned. */
export const CREDENTIALS_LOGIN_RATE_LIMIT_KEY_PREFIX = "ratelimit:auth:credentials_login:" as const;

function parseEnvPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

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
  if (!redis) {
    return { ok: true, remaining: opts.max };
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
    safeServerLog("security", "redis_fixed_window_fail_open", {
      keyPrefix: key.slice(0, 48),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return { ok: true, remaining: opts.max };
  }
}
