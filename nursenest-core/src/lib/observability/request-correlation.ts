import { headers } from "next/headers";

/**
 * Extracts a stable request correlation id from edge / platform headers for log drains.
 * Prefer passing the incoming `Request` in Route Handlers; use {@link correlationIdFromHeaders}
 * when only `headers()` is available (e.g. shared helpers without `Request`).
 */
/** Set by `src/proxy.ts` for cross-service log correlation (preferred over platform ids). */
export const NN_CORRELATION_HEADER = "x-nn-correlation-id";

export function correlationIdFromRequest(req?: Request): string | undefined {
  if (!req) return undefined;
  const h = req.headers;
  return (
    h.get(NN_CORRELATION_HEADER) ??
    h.get("x-vercel-id") ??
    h.get("x-request-id") ??
    h.get("cf-ray") ??
    h.get("x-correlation-id") ??
    h.get("x-amzn-trace-id") ??
    undefined
  )
    ?.trim()
    .slice(0, 128);
}

/** Async variant for Server Components / helpers that only have access to `headers()`. */
export async function correlationIdFromHeaders(): Promise<string | undefined> {
  const h = await headers();
  return (
    h.get(NN_CORRELATION_HEADER) ??
    h.get("x-vercel-id") ??
    h.get("x-request-id") ??
    h.get("cf-ray") ??
    h.get("x-correlation-id") ??
    h.get("x-amzn-trace-id") ??
    undefined
  )
    ?.trim()
    .slice(0, 128);
}
