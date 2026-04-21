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

function parseEnvPositiveInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 1 ? n : fallback;
}

function credentialsLoginBurstMax(): number {
  if (process.env.NODE_ENV !== "production") {
    return parseEnvPositiveInt("NN_CREDENTIALS_RL_BURST_MAX", 120);
  }
  return parseEnvPositiveInt("NN_CREDENTIALS_RL_BURST_MAX", 60);
}

function credentialsLoginComboMax(): number {
  if (process.env.NODE_ENV !== "production") {
    return parseEnvPositiveInt("NN_CREDENTIALS_RL_COMBO_MAX", 24);
  }
  return parseEnvPositiveInt("NN_CREDENTIALS_RL_COMBO_MAX", 10);
}

export function credentialsLoginBurstRedisKey(ipKey: string): string {
  return `ratelimit:auth:credentials_login:burst:ip:${ipKey}`;
}

export function credentialsLoginComboRedisKey(ipKey: string, acctHash: string): string {
  return `ratelimit:auth:credentials_login:combo:ip:${ipKey}:acct:${acctHash}`;
}

function parseRedisCounterValue(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "bigint") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof v === "string") {
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
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
    const n = parseRedisCounterValue(v);
    return n > 0 ? n : 0;
  } catch (error) {
    safeServerLog("security", "redis_fixed_window_read_fail_open", {
      keyPrefix: key.slice(0, 48),
      detail: error instanceof Error ? error.message.slice(0, 160) : "unknown",
    });
    return 0;
  }
}

/**
 * Read-only guard before expensive DB work.
 *
 * **Preflight uses the combo counter only** (per trusted IP partition + login identifier hash). The
 * burst counter is shared by **all** identifiers behind the same `ipKey` (NAT, mobile gateways, VPN
 * exit nodes). Using burst in preflight caused false "Too many sign-in attempts" for first-time
 * logins after unrelated traffic exhausted the IP bucket. Burst is still enforced in
 * {@link consumeCredentialsLoginFailure} on each attributed failure.
 *
 * Successful logins do not increment counters (see {@link consumeCredentialsLoginFailure} /
 * {@link resetCredentialsLoginRateLimitKeys}).
 */
export async function isCredentialsLoginRateLimited(ipKey: string, acctHash: string): Promise<boolean> {
  if (!acctHash) return false;
  const combo = await readRedisWindowCount(credentialsLoginComboRedisKey(ipKey, acctHash));
  return combo >= credentialsLoginComboMax();
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
