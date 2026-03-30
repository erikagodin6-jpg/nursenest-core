import "@/lib/db/env-bootstrap";

/**
 * Shared guards for Prisma when `DATABASE_URL` may be unset (e.g. `next build`, local CI).
 * Skipping queries avoids Prisma client validation error logs; `withDatabaseFallback` also
 * swallows connection/query failures for read paths that should degrade gracefully.
 *
 * After `env-bootstrap`, production may populate `DATABASE_URL` from `PROD_DATABASE_URL` only when `DATABASE_URL` is unset.
 */
export function isDatabaseUrlConfigured(): boolean {
  const direct = typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.trim().length > 0;
  if (direct) return true;
  return (
    process.env.NODE_ENV === "production" &&
    typeof process.env.PROD_DATABASE_URL === "string" &&
    process.env.PROD_DATABASE_URL.trim().length > 0
  );
}

export async function withDatabaseFallback<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseUrlConfigured()) return fallback;
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
export async function withDatabaseFallbackTimeout<T>(
  run: () => Promise<T>,
  fallback: T,
  timeoutMs: number,
): Promise<T> {
  if (!isDatabaseUrlConfigured()) return fallback;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      run(),
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("database_timeout")), timeoutMs);
      }),
    ]);
  } catch {
    return fallback;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
