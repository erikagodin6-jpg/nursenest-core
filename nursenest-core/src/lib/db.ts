import "./db/env-bootstrap";
import { PrismaClient } from "@prisma/client";
import { createDbQuerySemaphore } from "@/lib/server/db-query-semaphore";
import { logSlowPrismaQuery } from "@/lib/observability/perf-log-core";
import { recordPrismaClientQueryError } from "@/lib/observability/production-signal-metrics";

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
          } catch (e) {
            recordPrismaClientQueryError(e);
            throw e;
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
 * Pooling / resilience: `env-bootstrap` injects `connection_limit`, `pool_timeout`, `connect_timeout`, and
 * (unless disabled) `options=-c statement_timeout=…` — override via `PRISMA_*` env vars in `./db/env-bootstrap`.
 * Per-instance concurrency is capped by `createDbQuerySemaphore` (`NN_DB_MAX_CONCURRENT_QUERIES`).
 * Hot API routes wrap reads with `withRetry` from `@/lib/resilience/with-retry` (transient errors only).
 *
 * Slow queries over 500ms emit `slow_query_detected` (warn) and legacy `slow_prisma_query` (see {@link logSlowPrismaQuery}); over 1000ms uses severity `critical`. When the handler runs inside {@link runWithApiTelemetry} or {@link runWithPrismaQueryContextFromRequest}, logs include `route` and `correlationId`.
 *
 * **Horizontal scale:** one Prisma client per process avoids duplicate pools. Size `connection_limit` × concurrent
 * instances against Postgres `max_connections`. See `docs/backend-scale-architecture.md`.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

/** Single PrismaClient per Node process (Next.js dev HMR + production workers). Avoids duplicate pools / RSS spikes. */
globalForPrisma.prisma = prisma;
