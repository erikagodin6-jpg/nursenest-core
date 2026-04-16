/**
 * Unified rate limiting for horizontal scale (nn-db-final-004):
 *
 * - **Active store:** {@link getPostgresRateLimitStore} when {@link shouldUsePostgresRateLimitStore}; otherwise
 *   {@link getInMemoryRateLimitStoreSingleton} (dev/tests/Edge).
 * - **Edge runtime:** Prisma unavailable — in-memory only (per region/instance; unavoidable).
 * - **Production Node with Postgres:** if the shared store throws (DB down, migration missing, etc.),
 *   we **fail closed** (`ok: false` → callers typically map to HTTP 429). We do **not** fall back to
 *   in-memory there — that would diverge per instance. Non-production still falls back to in-memory
 *   so local dev keeps working when Postgres is stopped.
 *
 * @see RateLimitStore — abstraction for future Redis/KV backends
 */
import {
  getInMemoryRateLimitStoreSingleton,
  getPostgresRateLimitStore,
  logRateLimitPgUnavailableOnce,
  shouldUsePostgresRateLimitStore,
} from "@/lib/http/rate-limit-store-resolve";

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
