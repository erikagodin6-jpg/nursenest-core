import "server-only";

import { unstable_cache } from "next/cache";
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PRICING_OPTIONS } from "@/lib/cache/cache-tags";
import { PRICING_OPTIONS_DATA_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";

export type {
  AlliedPlanRowPayload as AlliedPlanRow,
  NursingPlanRowPayload as NursingPlanRow,
  PricingOptionsPayload,
} from "@/lib/pricing/pricing-options-payload-types";

export { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";

/** Display catalog is CA-only today; keep explicit so future US rows never share a cache line. */
const PRICING_OPTIONS_COUNTRY = "CA" as const;

/**
 * Anonymous display-only pricing JSON — **never** include user id, session, or entitlement.
 * Checkout remains the authority for real charges (`POST /api/subscriptions/checkout`).
 */
export const getCachedPricingOptionsPayload = unstable_cache(
  async () => buildPricingOptionsPayload(),
  [
    "pricing-options",
    `country:${PRICING_OPTIONS_COUNTRY}`,
    `rev:${cacheDeploymentRevision()}`,
    String(PRICING_OPTIONS_DATA_REVALIDATE_SEC),
  ],
  {
    revalidate: PRICING_OPTIONS_DATA_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PRICING_OPTIONS],
  },
);
