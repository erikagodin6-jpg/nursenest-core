/**
 * Public marketing / monolith asset origin (matches `legacy-marketing-routes` / `marketingAssetUrl`).
 * Kept separate so chrome can link off-Core without importing the full legacy route table.
 */
export function marketingPublicSiteOrigin(): string {
  return process.env.NEXT_PUBLIC_NURSENEST_ASSETS_BASE?.replace(/\/$/, "") ?? "https://www.nursenest.ca";
}

/** Off-Core languages landing — same URL as `mapLegacyMarketingHref("/languages")`. */
export function externalMarketingLanguagesHref(): string {
  return `${marketingPublicSiteOrigin()}/languages`;
}
