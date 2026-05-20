import "server-only";

import { cookies } from "next/headers";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { MARKETING_REGION_COOKIE, parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";

const STATIC_GENERATION_PHASE = "phase-production-build";

/** Raw cookie presence: undefined means "no preference" (use Canada-first fallback), not US. */
export async function readOptionalMarketingRegionToggleForCountry(): Promise<MarketingRegionToggle | undefined> {
  if (process.env.NEXT_PHASE === STATIC_GENERATION_PHASE) return undefined;
  const jar = await cookies();
  const raw = jar.get(MARKETING_REGION_COOKIE)?.value;
  if (raw === undefined || raw === "") return undefined;
  return parseMarketingRegionCookieValue(raw);
}
