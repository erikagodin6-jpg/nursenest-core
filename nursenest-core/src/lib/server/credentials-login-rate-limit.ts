import { safeServerLog } from "@/lib/observability/safe-server-log";

type RedisFixedWindowClient = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

type RedisWithDel = RedisFixedWindowClient & { del: (key: string) => Promise<unknown> };

type RedisReadClient = { get: (key: string) => Promise<unknown> };

function fixedWindowTtlSeconds(windowMs: number): number {
  return Math.max(1, Math.ceil(windowMs / 1000));
}

/** Brute-force throttle inside `authorize` — burst per IP + stricter per (IP + login identifier hash). */
const CREDENTIALS_LOGIN_BURST_WINDOW_MS = 60_000;
const CREDENTIALS_LOGIN_COMBO_WINDOW_MS = 60_000;

function credentialsLoginBurstMax(): number {
  if (process.env.NODE_ENV !== "production") return 120;
  return 60;
}

function credentialsLoginComboMax(): number {
  if (process.env.NODE_ENV !== "production") return 24;
  return 10;
}

export function credentialsLoginBurstRedisKey(ipKey: string): string {
  return `ratelimit:auth:credentials_login:burst:ip:${ipKey}`;
}

export function credentialsLoginComboRedisKey(ipKey: string, acctHash: string): string {
  return `ratelimit:auth:credentials_login:combo:ip:${ipKey}:acct:${acctHash}`;
}

async function readRedisWindowCount(key: string, redis?: RedisReadClient | null): Promise<number> {
  let client: RedisReadClient | null | undefined = redis;
  if (client === undefined) {
    try {
      const { getRedisClient } = await import("@/lib/server/redis");
      client = getRedisClient();
    } catch {
      client = null;
    }
  }
  if (!client) return 0;
  try {
    const v = await client.get(key);
    const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseInt(v, 10) : Number.NaN;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch (error) {
    safeServerLog("security", "redis_fixed_window_read_fail_open", {
      keyPrefix: key.slice(0, 48),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return 0;
  }
}

/**
 * Read-only guard: if a prior burst of failures already exhausted windows, reject before expensive work.
 * Successful logins do not increment these keys (see {@link consumeCredentialsLoginFailure}).
 */
export async function isCredentialsLoginRateLimited(ipKey: string, acctHash: string): Promise<boolean> {
  if (!acctHash) return false;
  const burst = await readRedisWindowCount(credentialsLoginBurstRedisKey(ipKey));
  const combo = await readRedisWindowCount(credentialsLoginComboRedisKey(ipKey, acctHash));
  return burst >= credentialsLoginBurstMax() || combo >= credentialsLoginComboMax();
}

/**
 * Increment fixed-window counters after a **failed** credential authentication outcome only.
 * Successful password checks must not call this (and should call {@link resetCredentialsLoginRateLimitKeys}).
 */
export async function consumeCredentialsLoginFailure(ipKey: string, acctHash: string): Promise<{ ok: boolean }> {
  if (!acctHash) return { ok: true };
  const burst = await checkRedisFixedWindowLimit(credentialsLoginBurstRedisKey(ipKey), {
    windowMs: CREDENTIALS_LOGIN_BURST_WINDOW_MS,
    max: credentialsLoginBurstMax(),
  });
  if (!burst.ok) return { ok: false };
  const combo = await checkRedisFixedWindowLimit(credentialsLoginComboRedisKey(ipKey, acctHash), {
    windowMs: CREDENTIALS_LOGIN_COMBO_WINDOW_MS,
    max: credentialsLoginComboMax(),
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
    ]);
  } catch (error) {
    safeServerLog("security", "credentials_login_rl_reset_failed", {
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
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
    const count = Number(await redis.incr(key));
    if (count === 1) {
      await redis.expire(key, fixedWindowTtlSeconds(opts.windowMs));
    }

    return {
      ok: count <= opts.max,
      remaining: Math.max(0, opts.max - count),
    };
  } catch (error) {
    safeServerLog("security", "redis_fixed_window_fail_open", {
      keyPrefix: key.slice(0, 48),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return { ok: true, remaining: opts.max };
  }
}
