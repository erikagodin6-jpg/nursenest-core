/** @file Re-exports — prefer `perf-log-core` from `db.ts` to avoid pulling `node:fs` into Edge graphs. */
export {
  ALERT_API_PAYLOAD_BYTES,
  HIGH_HEAP_BYTES,
  LARGE_API_RESPONSE_BYTES,
  SLOW_PRISMA_QUERY_MS,
  SLOW_QUERY_CRITICAL_MS,
  SLOW_QUERY_WARN_MS,
  logApiPayloadAlert,
  logHighMemory,
  logLargeApiResponse,
  logSlowPrismaQuery,
} from "@/lib/observability/perf-log-core";
export { logMemoryPressureSample } from "@/lib/observability/perf-log-host-memory";
