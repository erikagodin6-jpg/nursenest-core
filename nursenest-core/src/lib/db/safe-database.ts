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
