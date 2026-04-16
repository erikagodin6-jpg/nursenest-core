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
      const timeout = e instanceof Error && e.message === "database_timeout";
      safeServerLog(logCtx.scope ?? "database", timeout ? "database_read_timeout" : "database_read_error", {
        label: logCtx.label,
        timeout_ms: timeoutMs,
        ...(timeout ? {} : { detail: (e instanceof Error ? e.message : String(e)).slice(0, 200) }),
      });
    }
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
