import { type NextRequest, NextResponse } from "next/server";
import { CACHE_HEADER_PRICING_OPTIONS } from "@/lib/cache/public-edge-cache";
import { recordApiRouteTelemetry } from "@/lib/observability/api-route-telemetry";
import { getCachedPricingOptionsPayload } from "@/lib/pricing/pricing-options-cached-payload";

/**
 * Anonymous display pricing — **no cookies / no user headers** in cache key.
 * Payload cached via `getCachedPricingOptionsPayload` (Next Data Cache) + CDN `Cache-Control`.
 */
export async function GET(req: NextRequest) {
  const startedAt = performance.now();
  const body = await getCachedPricingOptionsPayload();
  const res = NextResponse.json(body, { headers: CACHE_HEADER_PRICING_OPTIONS });
  recordApiRouteTelemetry({
    req,
    routeId: "GET /api/pricing/options",
    startedAt,
    response: res,
    flow: "billing",
  });
  return res;
}
