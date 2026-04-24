import "@/lib/db/env-bootstrap";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

/**
 * Shared guards for Prisma when `DATABASE_URL` may be unset (e.g. `next build`, local CI).
 * Skipping queries avoids Prisma client validation error logs; `withDatabaseFallback` also
 * swallows connection/query failures for read paths that should degrade gracefully.
 *
 * Only `DATABASE_URL` counts — `PROD_DATABASE_URL` is not used (see `env-bootstrap.ts`).
 */
export function isDatabaseUrlConfigured(): boolean {
  return typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.trim().length > 0;
}

export async function withDatabaseFallback<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseUrlConfigured()) return fallback;
  if (isRuntimeSafeMode()) return fallback;
  try {
    return await run();
  } catch {
    /* Optional tables / schema drift: callers return empty defaults; avoid throwing from marketing paths. */
    return fallback;
  }
}

/**
 * Same as `withDatabaseFallback`, but rejects long-running queries so request paths cannot hang on huge scans.
 * Use on hot marketing / SEO paths; keep timeouts conservative to avoid false negatives on cold DBs.
 */
export type DatabaseTimeoutLogContext = {
  scope?: string;
  label?: string;
};

export type DatabaseFallbackKind = "db_timeout" | "db_unreachable" | "db_auth_failure" | "db_error";

/** Superset for ops scripts + lessons hub (missing URL and Prisma invocation shape). */
export type HubDbFailureCategory =
  | DatabaseFallbackKind
  | "db_missing_url"
  | "db_query_shape_failure";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

export function classifyDatabaseFallbackKind(e: unknown): DatabaseFallbackKind {
  const msg = errorMessage(e);
  const code = typeof e === "object" && e !== null && "code" in e ? String((e as { code?: string }).code ?? "") : "";
  const haystack = `${code} ${msg}`.toLowerCase();

  if (
    haystack.includes("database_timeout") ||
    /timeout|timed out|statement timeout|deadline exceeded|read deadline/i.test(haystack)
  ) {
    return "db_timeout";
  }

  if (
    /p1000|authentication failed|password authentication failed|auth failed|permission denied|role .* does not exist/i.test(
      haystack,
    )
  ) {
    return "db_auth_failure";
  }

  if (
    /p1001|can't reach database server|cannot reach database server|connection refused|econnrefused|enotfound|ehostunreach|server closed the connection unexpectedly|connection terminated|connection reset|econnreset/i.test(
      haystack,
    )
  ) {
    return "db_unreachable";
  }

  return "db_error";
}

/**
 * Classify DB/connectivity failures for **lessons hub** and `db:connectivity-check` (includes URL + Prisma shape).
 * Prisma often wraps auth/network errors as `Invalid \`prisma.*\` invocation` — peel those first.
 */
export function classifyHubDbFailure(e: unknown): HubDbFailureCategory {
  if (!isDatabaseUrlConfigured()) return "db_missing_url";
  const msg = errorMessage(e);
  const lower = msg.toLowerCase();
  if (
    /password authentication failed|authentication failed|p1000\b|role .* does not exist|permission denied for/i.test(
      lower,
    )
  ) {
    return "db_auth_failure";
  }
  const kind = classifyDatabaseFallbackKind(e);
  if (kind !== "db_error") return kind;
  if (/invalid `prisma\.|invalid `prismaclient/i.test(msg)) return "db_query_shape_failure";
  return kind;
}

export async function withDatabaseFallbackTimeout<T>(
  run: () => Promise<T>,
  fallback: T,
  timeoutMs: number,
  logCtx?: DatabaseTimeoutLogContext,
): Promise<T> {
  if (!isDatabaseUrlConfigured()) return fallback;
  if (isRuntimeSafeMode()) return fallback;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("database_timeout")), timeoutMs);
      }),
    ]);
  } catch (e) {
    if (logCtx?.label) {
      const kind = classifyDatabaseFallbackKind(e);
      safeServerLog(logCtx.scope ?? "database", kind, {
        label: logCtx.label,
        timeout_ms: timeoutMs,
        ...(kind === "db_timeout" ? {} : { detail: errorMessage(e).slice(0, 200) }),
      });
      safeServerLog(logCtx.scope ?? "database", "fallback_used", {
        label: logCtx.label,
        reason: kind,
        timeout_ms: timeoutMs,
      });
    }
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
