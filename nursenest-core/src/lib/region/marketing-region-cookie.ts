/** Persisted with `useNursenestRegion` so server components and SEO can read the same preference. */
export const MARKETING_REGION_COOKIE = "nn_marketing_region";

export type MarketingRegionCookieValue = "US" | "CA";

export function parseMarketingRegionCookieValue(raw: string | undefined): MarketingRegionCookieValue {
  return raw === "CA" ? "CA" : "US";
}
