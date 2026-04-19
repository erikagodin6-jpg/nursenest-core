import "server-only";

import { cookies } from "next/headers";
import { MARKETING_REGION_COOKIE, parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/** Next sets this during `next build` static prerender; same default as a missing cookie (US). */
const STATIC_GENERATION_PHASE = "phase-production-build";

/** Same Canada/US toggle as the marketing header; defaults to US when the cookie is absent. */
export async function getMarketingRegionFromCookies(): Promise<MarketingRegionToggle> {
  if (process.env.NEXT_PHASE === STATIC_GENERATION_PHASE) {
    return parseMarketingRegionCookieValue(undefined);
  }
  const jar = await cookies();
  return parseMarketingRegionCookieValue(jar.get(MARKETING_REGION_COOKIE)?.value);
}
