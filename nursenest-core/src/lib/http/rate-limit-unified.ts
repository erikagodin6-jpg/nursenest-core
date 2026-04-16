import { checkRateLimit, consumeRateLimit } from "@/lib/http/rate-limit-in-memory";
import {
  checkRateLimitDistributed,
  consumeRateLimitDistributed,
  isDistributedRateLimitEnabled,
} from "@/lib/http/rate-limit-distributed";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

let distributedFallbackLogged = false;

function logDistributedFallbackOnce(err: unknown): void {
  if (distributedFallbackLogged) return;
  distributedFallbackLogged = true;
  const msg = err instanceof Error ? err.message : String(err);
  safeServerLogCritical(
    "security",
    "rate_limit_unified_pg_fallback",
    { detail: msg.slice(0, 200) },
    err instanceof Error ? err : new Error(msg),
    { flow: "rate_limit" },
  );
}

/**
 * Fixed-window limiter: uses Postgres when {@link isDistributedRateLimitEnabled} is true; otherwise in-memory (dev / tests).
 * On Postgres errors, falls back once to in-memory limits for the process (degraded protection — still non-zero).
 */
export async function checkRateLimitUnified(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean; remaining: number }> {
  if (!isDistributedRateLimitEnabled()) {
    return checkRateLimit(key, opts);
  }
  try {
    const r = await checkRateLimitDistributed(key, opts);
    return { ok: r.ok, remaining: r.ok ? opts.max : 0 };
  } catch (e) {
    logDistributedFallbackOnce(e);
    return checkRateLimit(key, opts);
  }
}

export async function consumeRateLimitUnified(
  key: string,
  cost: number,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean; remaining: number }> {
  if (!isDistributedRateLimitEnabled()) {
    return consumeRateLimit(key, cost, opts);
  }
  try {
    const r = await consumeRateLimitDistributed(key, cost, opts);
    return { ok: r.ok, remaining: r.ok ? 0 : 0 };
  } catch (e) {
    logDistributedFallbackOnce(e);
    return consumeRateLimit(key, cost, opts);
  }
}
