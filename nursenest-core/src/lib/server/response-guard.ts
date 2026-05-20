/**
 * Guards against oversized JSON responses that risk memory pressure or slow clients.
 * Complements {@link logLargeApiResponse} in `@/lib/observability/perf-log`.
 */
import { isResponseGuardEnabled } from "@/lib/config/production-safety-flags";
import { NextResponse } from "next/server";
import { LARGE_API_RESPONSE_BYTES } from "@/lib/observability/perf-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";

export { LARGE_API_RESPONSE_BYTES };

export type JsonGuardResult =
  | { ok: true; approxUtf8Bytes: number }
  | { ok: false; approxUtf8Bytes: number; reason: "too_large" };

/**
 * Returns `ok: false` when the serialized JSON would exceed ~500KB (UTF-8 estimate).
 * Logs `large_response_detected` (non-PII).
 */
export function guardJsonResponseSize(body: unknown, route: string): JsonGuardResult {
  const approxUtf8Bytes = estimateJsonUtf8Bytes(body);
  if (approxUtf8Bytes <= LARGE_API_RESPONSE_BYTES) {
    return { ok: true, approxUtf8Bytes };
  }
  safeServerLog("response_guard", "large_response_detected", {
    route: route.slice(0, 120),
    approxUtf8Bytes,
    threshold: LARGE_API_RESPONSE_BYTES,
  });
  return { ok: false, approxUtf8Bytes, reason: "too_large" };
}

/** JSON helper: rejects with 413 when estimated body exceeds {@link LARGE_API_RESPONSE_BYTES}. */
export function jsonResponseGuarded<T extends Record<string, unknown>>(
  route: string,
  body: T,
  init?: ResponseInit,
): NextResponse {
  if (!isResponseGuardEnabled()) {
    return NextResponse.json(body, init);
  }
  const g = guardJsonResponseSize(body, route);
  if (!g.ok) {
    return NextResponse.json(
      { error: "Response too large", code: "payload_limit_exceeded", maxBytes: LARGE_API_RESPONSE_BYTES },
      { status: 413 },
    );
  }
  return NextResponse.json(body, init);
}
