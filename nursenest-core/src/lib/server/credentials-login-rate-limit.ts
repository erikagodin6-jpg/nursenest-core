import { safeServerLog } from "@/lib/observability/safe-server-log";

type RedisFixedWindowClient = {
  incr: (key: string) => Promise<number>;
  expire: (key: string, seconds: number) => Promise<number>;
};

type RedisWithDel = RedisFixedWindowClient & { del: (key: string) => Promise<unknown> };

function fixedWindowTtlSeconds(windowMs: number): number {
  return Math.max(1, Math.ceil(windowMs / 1000));
}

/** Brute-force throttle inside `authorize` — burst per IP + stricter per (IP + login identifier hash). */
const CREDENTIALS_LOGIN_BURST_WINDOW_MS = 60_000;
const CREDENTIALS_LOGIN_COMBO_WINDOW_MS = 60_000;

function credentialsLoginBurstMax(): number {
  if (process.env.NODE_ENV !== "production") return 120;
  return 48;
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

/**
 * Fixed-window limits for credential `authorize` (Redis). Returns false when either bucket is exhausted.
 */
export async function assertCredentialsLoginRateLimits(
  ipKey: string,
  acctHash: string,
): Promise<{ ok: boolean }> {
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
