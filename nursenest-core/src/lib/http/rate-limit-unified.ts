import { checkRateLimit, consumeRateLimit } from "@/lib/http/rate-limit-in-memory";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

let rateLimitFalseIgnoredInProdLogged = false;
/** One-shot: Postgres unavailable for distributed rate limits (production fail-closed). */
let rateLimitPgUnavailableLogged = false;

function logRateLimitPgUnavailableOnce(): void {
  if (rateLimitPgUnavailableLogged) return;
  rateLimitPgUnavailableLogged = true;
  safeServerLog("security", "rate_limit_unified_pg_unavailable", { action: "fail_closed" });
}

/**
 * Postgres-backed limits are disabled on the Edge runtime because Prisma is Node-only (in-memory there only).
 * In Node production with `DATABASE_URL`, limits use Postgres; `RATE_LIMIT_DISTRIBUTED=false` is ignored in production.
 */
export function isDistributedRateLimitEnabled(): boolean {
  if (process.env.NEXT_RUNTIME === "edge") return false;
  if (!isDatabaseUrlConfigured()) return false;
  if (process.env.NODE_ENV === "test") return false;
  if (process.env.RATE_LIMIT_DISTRIBUTED === "true") return true;
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.RATE_LIMIT_DISTRIBUTED === "false" && !rateLimitFalseIgnoredInProdLogged) {
    rateLimitFalseIgnoredInProdLogged = true;
    safeServerLogCritical(
      "security",
      "rate_limit_distributed_false_ignored_in_production",
      { hint: "Per-instance buckets are disabled when DATABASE_URL is set (Node runtime)." },
      new Error("RATE_LIMIT_DISTRIBUTED=false ignored in production"),
    );
  }
  return true;
}

/**
 * Fixed-window limiter: Postgres when {@link isDistributedRateLimitEnabled}; otherwise in-memory (dev/tests only).
 * Dynamic-imports the distributed module so Edge bundles never load Prisma.
 *
 * Production must not fall back to in-memory rate limiting because it breaks consistency across instances.
 * If Postgres fails in production, returns `ok: false` (same deny on every instance — fail closed).
 */
export async function checkRateLimitUnified(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ ok: boolean; remaining: number }> {
  if (!isDistributedRateLimitEnabled()) {
    return checkRateLimit(key, opts);
  }
  try {
    const { checkRateLimitDistributed } = await import("@/lib/http/rate-limit-distributed");
    const r = await checkRateLimitDistributed(key, opts);
    return { ok: r.ok, remaining: r.ok ? opts.max : 0 };
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      return { ok: false, remaining: 0 };
    }
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
    const { consumeRateLimitDistributed } = await import("@/lib/http/rate-limit-distributed");
    const r = await consumeRateLimitDistributed(key, cost, opts);
    return { ok: r.ok, remaining: r.ok ? 0 : 0 };
  } catch {
    if (process.env.NODE_ENV === "production") {
      logRateLimitPgUnavailableOnce();
      return { ok: false, remaining: 0 };
    }
    return consumeRateLimit(key, cost, opts);
  }
}
