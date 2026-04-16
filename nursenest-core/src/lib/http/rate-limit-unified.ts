/**
 * Unified rate limiting for horizontal scale (nn-db-final-004):
 *
 * - **Active store:** {@link getPostgresRateLimitStore} when {@link shouldUsePostgresRateLimitStore}; otherwise
 *   {@link getInMemoryRateLimitStoreSingleton} (dev/tests/Edge).
 * - **Edge runtime:** Prisma unavailable — in-memory only (per region/instance). App `proxy.ts` defaults to **Node** in Next.js 16+, so production global API limits use Postgres.
 * - **Production Node with Postgres:** if the shared store throws (DB down, migration missing, etc.),
 *   we **fail closed** (`ok: false` → callers typically map to HTTP 429). We do **not** fall back to
 *   in-memory there — that would diverge per instance. Non-production still falls back to in-memory
 *   so local dev keeps working when Postgres is stopped.
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
      return { ok: false, remaining: 0 };
    }
    return getInMemoryRateLimitStoreSingleton().check(key, opts);
  }
  try {
    return await pg.check(key, opts);
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      return { ok: false, remaining: 0 };
    }
    return getInMemoryRateLimitStoreSingleton().check(key, opts);
  }
}

/**
 * Read current window usage for `key` without mutating. Used for distributed abuse metadata (strike counts).
 * When Postgres is required but unavailable in production, returns **fail-closed** `count: opts.max` so callers
 * can treat anonymous caps as fully tightened.
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
        action: "fail_closed_count_max",
        keyPrefix: key.slice(0, 48),
      });
      return { count: opts.max };
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
        action: "fail_closed_count_max",
        keyPrefix: key.slice(0, 48),
      });
      return { count: opts.max };
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
      return { ok: false, remaining: 0 };
    }
    return getInMemoryRateLimitStoreSingleton().consume(key, cost, opts);
  }
  try {
    return await pg.consume(key, cost, opts);
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      return { ok: false, remaining: 0 };
    }
    return getInMemoryRateLimitStoreSingleton().consume(key, cost, opts);
  }
}
