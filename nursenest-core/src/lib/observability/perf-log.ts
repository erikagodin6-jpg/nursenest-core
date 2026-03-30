import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Log Prisma operations slower than this (ms). */
export const SLOW_PRISMA_QUERY_MS = 500;

/** Log JSON API bodies estimated above this (UTF-8 bytes). */
export const LARGE_API_RESPONSE_BYTES = 500_000;

/** Earlier warning threshold (still below `LARGE_API_RESPONSE_BYTES`) for noisy routes. */
export const ALERT_API_PAYLOAD_BYTES = 250_000;

export function logApiPayloadAlert(route: string, approxUtf8Bytes: number): void {
  if (approxUtf8Bytes <= ALERT_API_PAYLOAD_BYTES) return;
  safeServerLog("perf", "api_payload_alert", {
    route: route.slice(0, 120),
    approxUtf8Bytes,
  });
}

/** When heap exceeds this during a slow query or interval sample, emit high_memory. */
export const HIGH_HEAP_BYTES = 768 * 1024 * 1024;

export function logSlowPrismaQuery(meta: { model: string; operation: string; durationMs: number }): void {
  if (meta.durationMs <= SLOW_PRISMA_QUERY_MS) return;
  const mem = process.memoryUsage();
  const heapHigh = mem.heapUsed >= HIGH_HEAP_BYTES;
  safeServerLog("perf", "slow_prisma_query", {
    model: meta.model.slice(0, 64),
    operation: meta.operation.slice(0, 64),
    durationMs: meta.durationMs,
    heapHigh: heapHigh ? 1 : 0,
    heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
  });
  if (heapHigh) {
    logHighMemory("with_slow_prisma_query");
  }
}

export function logLargeApiResponse(route: string, approxUtf8Bytes: number): void {
  if (approxUtf8Bytes <= LARGE_API_RESPONSE_BYTES) return;
  safeServerLog("perf", "large_api_response", {
    route: route.slice(0, 120),
    approxUtf8Bytes,
  });
}

export function logHighMemory(context: string): void {
  const m = process.memoryUsage();
  safeServerLog("perf", "high_memory", {
    context: context.slice(0, 80),
    heapUsedMb: Math.round(m.heapUsed / 1024 / 1024),
    rssMb: Math.round(m.rss / 1024 / 1024),
    externalMb: Math.round((m.external ?? 0) / 1024 / 1024),
  });
}
