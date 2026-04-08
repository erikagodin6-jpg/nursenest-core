import "server-only";

import { cookies } from "next/headers";
import { MARKETING_REGION_COOKIE, parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

/** Same Canada/US toggle as the marketing header; defaults to US when the cookie is absent. */
export async function getMarketingRegionFromCookies(): Promise<MarketingRegionToggle> {
  const jar = await cookies();
  return parseMarketingRegionCookieValue(jar.get(MARKETING_REGION_COOKIE)?.value);
}
