/**
 * Edge-safe correlation helpers (no `next/headers`). Use {@link correlationIdFromHeaders} from
 * `request-correlation-headers` in Server Components / async server contexts only.
 */
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
