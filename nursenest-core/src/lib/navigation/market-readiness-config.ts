/**
 * Market readiness helpers that depend only on {@link MARKET_READINESS} — safe for client bundles
 * without pulling exam pathway catalogs or `country-exam-launch-readiness` machinery.
 */

export type { MarketSupportTier, MarketReadinessConfig, SubRegionConfig } from "./market-readiness-data";
export { MARKET_READINESS } from "./market-readiness-data";

import { MARKET_READINESS } from "./market-readiness-data";
import type { MarketReadinessConfig } from "./market-readiness-data";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

export function getMarketReadiness(region: GlobalRegionSlug): MarketReadinessConfig {
  return MARKET_READINESS[region];
}

export function isMarketFullySupported(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].supportTier === "full";
}

/** Default when a legacy cookie/path points at a non-selectable market — keeps dropdown selection valid. */
export const DEFAULT_PUBLIC_GLOBAL_REGION: GlobalRegionSlug = "us";

export function canShowPricing(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].pricingConfigured;
}

export function canPublishSeo(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].seoEnabled;
}

/** Regions where the full conversion funnel is available. */
export function regionsWithFullSupport(): GlobalRegionSlug[] {
  return (Object.keys(MARKET_READINESS) as GlobalRegionSlug[]).filter(
    (r) => MARKET_READINESS[r].supportTier === "full",
  );
}

/** Regions where at least marketing/SEO pages should exist. */
export function regionsWithSeoEnabled(): GlobalRegionSlug[] {
  return (Object.keys(MARKET_READINESS) as GlobalRegionSlug[]).filter(
    (r) => MARKET_READINESS[r].seoEnabled,
  );
}

/**
 * Internal / admin label for market support tier (draft, SEO-only, etc.).
 * **Do not use in public marketing chrome** for listing — use {@link isGlobalRegionListedInCountrySwitcher}
 * from `./market-readiness-country-switcher`.
 */
export function marketAdminSupportLabel(region: GlobalRegionSlug): string {
  const tier = MARKET_READINESS[region].supportTier;
  switch (tier) {
    case "full":
      return "Full exam prep";
    case "partial":
      return "Partial / in development";
    case "marketing":
      return "Marketing & SEO only";
    case "planned":
      return "Planned — not launched";
  }
}

/** @deprecated Use {@link marketAdminSupportLabel}; kept for admin panels still importing the old name. */
export const marketSupportLabel = marketAdminSupportLabel;
