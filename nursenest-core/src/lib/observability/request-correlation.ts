/** Re-exports — prefer importing from `correlation-id` in Edge / proxy to avoid `next/headers` in the bundle. */
export { NN_CORRELATION_HEADER, correlationIdFromRequest } from "@/lib/observability/correlation-id";
export { correlationIdFromHeaders } from "@/lib/observability/request-correlation-headers";
