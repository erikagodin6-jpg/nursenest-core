/**
 * Resolves which {@link RateLimitStore} implementation to use (nn-db-final-004).
 *
 * **Env**
 * - `RATE_LIMIT_STORE=memory` — force in-memory (ignored in **production** when `DATABASE_URL` is set unless `NN_RATE_LIMIT_ALLOW_MEMORY_IN_PRODUCTION=1`).
 * - `RATE_LIMIT_STORE=postgres` — force Postgres (Node + `DATABASE_URL`); creation may fail → see {@link getPostgresRateLimitStore}.
 * - Unset / `auto` — Postgres when {@link shouldUsePostgresRateLimitStore} is true (same as historical `RATE_LIMIT_DISTRIBUTED` rules).
 *
 * **Future:** `RATE_LIMIT_STORE=redis` | `vercel_kv` — add an adapter module and branch here; prefer Upstash REST from Edge.
 */
import type { RateLimitStore } from "@/lib/http/rate-limit-store";
import { createInMemoryRateLimitStore } from "@/lib/http/rate-limit-in-memory";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

let rateLimitMemoryForcedIgnoredInProdLogged = false;

function logRateLimitMemoryForcedIgnoredOnce(): void {
  if (rateLimitMemoryForcedIgnoredInProdLogged) return;
  rateLimitMemoryForcedIgnoredInProdLogged = true;
  safeServerLogCritical(
    "security",
    "rate_limit_store_memory_ignored_in_production",
    {
      hint: "RATE_LIMIT_STORE=memory is unsafe for multi-instance production when DATABASE_URL is set. Using Postgres unless NN_RATE_LIMIT_ALLOW_MEMORY_IN_PRODUCTION=1.",
    },
    new Error("RATE_LIMIT_STORE=memory ignored in production"),
  );
}

let rateLimitFalseIgnoredInProdLogged = false;

function logRateLimitDistributedFalseIgnoredOnce(): void {
  if (rateLimitFalseIgnoredInProdLogged) return;
  rateLimitFalseIgnoredInProdLogged = true;
  safeServerLogCritical(
    "security",
    "rate_limit_distributed_false_ignored_in_production",
    { hint: "Per-instance buckets are disabled when DATABASE_URL is set (Node runtime)." },
    new Error("RATE_LIMIT_DISTRIBUTED=false ignored in production"),
  );
}

/**
 * Whether to target Postgres buckets (Node + DB, not Edge, not test — unless overridden by `RATE_LIMIT_STORE`).
 */
export function shouldUsePostgresRateLimitStore(): boolean {
  const forced = process.env.RATE_LIMIT_STORE?.trim().toLowerCase();
  if (forced === "memory") {
    const memAllow = process.env.NN_RATE_LIMIT_ALLOW_MEMORY_IN_PRODUCTION?.trim();
    const allowProdMemory = memAllow === "1" || memAllow?.toLowerCase() === "true";
    if (
      process.env.NODE_ENV === "production" &&
      isDatabaseUrlConfigured() &&
      process.env.NEXT_RUNTIME !== "edge" &&
      !allowProdMemory
    ) {
      logRateLimitMemoryForcedIgnoredOnce();
      /* fall through — use Postgres like `auto` */
    } else {
      return false;
    }
  }
  if (forced === "postgres") return isDatabaseUrlConfigured() && process.env.NEXT_RUNTIME !== "edge";

  if (process.env.NEXT_RUNTIME === "edge") return false;
  if (!isDatabaseUrlConfigured()) return false;
  if (process.env.NODE_ENV === "test") return false;
  if (process.env.RATE_LIMIT_DISTRIBUTED === "true") return true;
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.RATE_LIMIT_DISTRIBUTED === "false") {
    logRateLimitDistributedFalseIgnoredOnce();
  }
  return true;
}

let inMemorySingleton: RateLimitStore | null = null;
let postgresSingleton: RateLimitStore | null = null;

export function resetRateLimitStoreSingletonsForTests(): void {
  inMemorySingleton = null;
  postgresSingleton = null;
}

export function getInMemoryRateLimitStoreSingleton(): RateLimitStore {
  if (!inMemorySingleton) inMemorySingleton = createInMemoryRateLimitStore();
  return inMemorySingleton;
}

/**
 * Lazily constructs the Postgres-backed store. Returns `null` if dynamic import fails (missing Prisma, etc.).
 * {@link checkRateLimitUnified} / {@link consumeRateLimitUnified} then fail open in production Node (see there).
 */
export async function getPostgresRateLimitStore(): Promise<RateLimitStore | null> {
  if (postgresSingleton) return postgresSingleton;
  try {
    const { createPostgresRateLimitStore } = await import("@/lib/http/rate-limit-distributed");
    postgresSingleton = createPostgresRateLimitStore();
    return postgresSingleton;
  } catch {
    return null;
  }
}

let rateLimitPgUnavailableLogged = false;

export function logRateLimitPgUnavailableOnce(): void {
  if (rateLimitPgUnavailableLogged) return;
  rateLimitPgUnavailableLogged = true;
  safeServerLog("security", "rate_limit_unified_pg_unavailable", {
    action: "degraded_fail_open_checks",
    hint: "check/consume return ok:true; meta reads return count:0 until Postgres store is reachable",
  });
}
