/**
 * Edge/route-safe correlation helpers only — no `next/headers`.
 * For RSC / `headers()`, import {@link correlationIdFromHeaders} from `@/lib/observability/request-correlation-headers.server`.
 */
export { NN_CORRELATION_HEADER, correlationIdFromRequest } from "@/lib/observability/correlation-id";
