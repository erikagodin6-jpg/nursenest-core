import "./db/env-bootstrap";
import { PrismaClient } from "@prisma/client";
import { createDbQuerySemaphore } from "@/lib/server/db-query-semaphore";
import { logSlowPrismaQuery } from "@/lib/observability/perf-log";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const dbQuerySemaphore = createDbQuerySemaphore();

function createPrismaClient(): PrismaClient {
  const base = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = performance.now();
          await dbQuerySemaphore.acquire();
          try {
            return await query(args);
          } finally {
            dbQuerySemaphore.release();
            const durationMs = Math.round(performance.now() - start);
            logSlowPrismaQuery({
              model: typeof model === "string" && model.length > 0 ? model : "unknown",
              operation,
              durationMs,
            });
          }
        },
      },
    },
  }) as unknown as PrismaClient;
}

/**
 * Connection pool sizing: prefer `DATABASE_URL` query params, e.g.
 * `postgresql://...?connection_limit=15&pool_timeout=20&statement_timeout=30000` (values depend on host + traffic).
 * `statement_timeout` (ms) caps runaway queries at the server — pair with app-level retries/timeouts on hot paths.
 * Prisma does not set a universal default; tune alongside your Postgres max_connections.
 *
 * Slow queries over 500ms emit `slow_query_detected` (warn) and legacy `slow_prisma_query` (see {@link logSlowPrismaQuery}); over 1000ms uses severity `critical`.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
