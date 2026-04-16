import { headers } from "next/headers";
import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";

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
