/**
 * Unified rate limiting for horizontal scale (nn-db-final-004):
 *
 * - **Active store:** {@link getPostgresRateLimitStore} when {@link shouldUsePostgresRateLimitStore}; otherwise
 *   {@link getInMemoryRateLimitStoreSingleton} (dev/tests/Edge).
 * - **Edge runtime:** Prisma unavailable — in-memory only (per region/instance). App `proxy.ts` defaults to **Node** in Next.js 16+, so production global API limits use Postgres.
 * - **Production Node when Postgres is unavailable or errors:** we **fail open** (`ok: true`) for
 *   {@link checkRateLimitUnified} / {@link consumeRateLimitUnified} so auth, checkout, and admin flows are
 *   not falsely 429’d when the limiter store is degraded. Abuse paths still have route-level and
 *   application guards (credentials combo RL, login lockout, `requireAdmin`, etc.). Meta reads return
 *   `count: 0` so abuse-strike tightening does not punish everyone when the store is down.
 *
 * @see RateLimitStore — abstraction for future Redis/KV backends
 */
import { peekRateLimitWindow } from "@/lib/http/rate-limit-in-memory";
import {
  getInMemoryRateLimitStoreSingleton,
  getPostgresRateLimitStore,
  logRateLimitPgUnavailableOnce,
  shouldUsePostgresRateLimitStore,
} from "@/lib/http/rate-limit-store-resolve";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export {
  shouldUsePostgresRateLimitStore,
  shouldUsePostgresRateLimitStore as isDistributedRateLimitEnabled,
} from "@/lib/http/rate-limit-store-resolve";

/**
 * Fixed-window limiter: Postgres-backed {@link RateLimitStore} when enabled; otherwise in-memory (dev/tests only).
 */
export async function checkRateLimitUnified(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean; remaining: number }> {
  if (!shouldUsePostgresRateLimitStore()) {
    return getInMemoryRateLimitStoreSingleton().check(key, opts);
  }
  const pg = await getPostgresRateLimitStore();
  if (!pg) {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_unified_store_degraded", {
        action: "check_fail_open",
        keyPrefix: key.slice(0, 64),
      });
      return { ok: true, remaining: opts.max };
    }
    return getInMemoryRateLimitStoreSingleton().check(key, opts);
  }
  try {
    return await pg.check(key, opts);
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_unified_store_degraded", {
        action: "check_throw_fail_open",
        keyPrefix: key.slice(0, 64),
      });
      return { ok: true, remaining: opts.max };
    }
    return getInMemoryRateLimitStoreSingleton().check(key, opts);
  }
}

/**
 * Read current window usage for `key` without mutating. Used for distributed abuse metadata (strike counts).
 * When Postgres is unavailable in production, returns `count: 0` (fail-open) so anonymous caps are not
 * globally tightened for every visitor during store outages.
 */
export async function readRateLimitWindowCountUnified(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ count: number }> {
  if (!shouldUsePostgresRateLimitStore()) {
    return { count: peekRateLimitWindow(key, opts).count };
  }
  const pg = await getPostgresRateLimitStore();
  if (!pg) {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_meta_read_degraded", {
        action: "fail_open_count_zero",
        keyPrefix: key.slice(0, 48),
      });
      return { count: 0 };
    }
    return { count: peekRateLimitWindow(key, opts).count };
  }
  try {
    const { readPostgresRateLimitWindowCount } = await import("@/lib/http/rate-limit-distributed");
    return await readPostgresRateLimitWindowCount(key);
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_meta_read_degraded", {
        action: "fail_open_count_zero",
        keyPrefix: key.slice(0, 48),
      });
      return { count: 0 };
    }
    return { count: peekRateLimitWindow(key, opts).count };
  }
}

export async function consumeRateLimitUnified(
  key: string,
  cost: number,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean; remaining: number }> {
  if (!shouldUsePostgresRateLimitStore()) {
    return getInMemoryRateLimitStoreSingleton().consume(key, cost, opts);
  }
  const pg = await getPostgresRateLimitStore();
  if (!pg) {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_unified_store_degraded", {
        action: "consume_fail_open",
        keyPrefix: key.slice(0, 64),
      });
      return { ok: true, remaining: opts.max };
    }
    return getInMemoryRateLimitStoreSingleton().consume(key, cost, opts);
  }
  try {
    return await pg.consume(key, cost, opts);
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      safeServerLog("security", "rate_limit_unified_store_degraded", {
        action: "consume_throw_fail_open",
        keyPrefix: key.slice(0, 64),
      });
      return { ok: true, remaining: opts.max };
    }
    return getInMemoryRateLimitStoreSingleton().consume(key, cost, opts);
  }
}
