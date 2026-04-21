import { type NextRequest, NextResponse } from "next/server";
import { CACHE_HEADER_PRICING_OPTIONS } from "@/lib/cache/public-edge-cache";
import { recordApiRouteTelemetry } from "@/lib/observability/api-route-telemetry";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildPricingOptionsPayload,
  getCachedPricingOptionsPayload,
  type PricingOptionsPayload,
} from "@/lib/pricing/pricing-options-cached-payload";

export const runtime = "nodejs";

/**
 * Anonymous display pricing — **no cookies / no user headers** in cache key.
 * Payload cached via `getCachedPricingOptionsPayload` (Next Data Cache) + CDN `Cache-Control`.
 */
export async function GET(req: NextRequest) {
  const startedAt = performance.now();
  let body: PricingOptionsPayload;
  try {
    body = await getCachedPricingOptionsPayload();
  } catch (error) {
    const message = (error instanceof Error ? error.message : String(error)).slice(0, 400);
    safeServerLog("billing", "pricing_options_cache_unavailable", { message });
    body = buildPricingOptionsPayload();
  }

  const nursingCount = body.plans.length;
  const alliedCount = body.alliedPlans.length;
  if (nursingCount === 0 && alliedCount === 0) {
    safeServerLog("billing", "pricing_options_empty_payload", {
      source: "buildPricingOptionsPayload",
      pricingCountry: "CA",
    });
  }
  if (process.env.NN_PRICING_OPTIONS_DEBUG?.trim() === "1") {
    safeServerLog("billing", "pricing_options_debug", {
      nursingPlans: nursingCount,
      alliedPlans: alliedCount,
      source: "display_catalog_plus_stripe_checkout_flags",
      pricingCountry: "CA",
    });
  }

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
