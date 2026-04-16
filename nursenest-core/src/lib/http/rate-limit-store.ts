/**
 * Pluggable storage for fixed-window rate limits (`nn-db-final-004`).
 *
 * **Implementations**
 * - {@link createInMemoryRateLimitStore} — single Node/Edge instance (Map); default when Postgres is off or Edge.
 * - {@link createPostgresRateLimitStore} in `rate-limit-distributed.ts` — shared via `AppRateLimitBucket` (multi-instance today).
 *
 * **Future: Redis / Vercel KV / Upstash**
 * Implement `RateLimitStore` with atomic INCR + EXPIRE (fixed window) or a Lua script for strict windows:
 * - Keys: `rl:{sha256(logicalKey)}` with TTL = `windowMs` (ms as seconds rounded up), or store `count|expiresAt` in a hash.
 * - Edge-safe: prefer HTTP Redis (Upstash) over `ioredis` TCP from edge middleware.
 * - Register in `getActiveRateLimitStore` (`rate-limit-store-resolve.ts`) when `RATE_LIMIT_STORE=redis` | `vercel_kv`.
 *
 * @see rate-limit-unified.ts — production routing and fail-closed behavior
 */

/** Single fixed window: first request starts the window; counts reset when `expiresAt` elapses. */
export type RateLimitWindowOpts = {
  windowMs: number;
  max: number;
};

export type RateLimitCheckResult = {
  ok: boolean;
  /** Remaining quota in the current window after this operation (best-effort). */
  remaining: number;
};

/**
 * Async storage backend for rate limits — shared across instances when backed by Postgres/Redis/KV.
 */
export interface RateLimitStore {
  check(key: string, opts: RateLimitWindowOpts): Promise<RateLimitCheckResult>;
  consume(key: string, cost: number, opts: RateLimitWindowOpts): Promise<RateLimitCheckResult>;
}
