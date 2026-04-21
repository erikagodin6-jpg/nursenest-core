/**
 * Market readiness config — defines what level of product support each
 * region has, so the UI, SEO, and conversion systems can make honest claims.
 *
 * Four support tiers:
 *   1. full          — adapted questions, localized content, full conversion funnel
 *   2. partial       — some adapted content, basic SEO, limited conversion
 *   3. marketing     — SEO pages and blog, but no adapted questions yet
 *   4. planned       — in roadmap, no public pages
 *
 * This module re-exports from {@link ./market-readiness-config} (data-only, client-safe) and
 * {@link ./market-readiness-country-switcher} (strict launch gate — pulls pathway catalog). Import from the
 * submodules directly when you need to keep the client bundle free of launch-readiness.
 */

export type { MarketSupportTier, MarketReadinessConfig, SubRegionConfig } from "./market-readiness-config";
export { MARKET_READINESS } from "./market-readiness-config";
export {
  getMarketReadiness,
  isMarketFullySupported,
  DEFAULT_PUBLIC_GLOBAL_REGION,
  canShowPricing,
  canPublishSeo,
  regionsWithFullSupport,
  regionsWithSeoEnabled,
  marketAdminSupportLabel,
  marketSupportLabel,
} from "./market-readiness-config";

export {
  isPublicCountrySwitcherReady,
  isGlobalRegionListedInCountrySwitcher,
  listGlobalRegionsListedInCountrySwitcher,
  coerceToPublicCountrySwitcherRegion,
} from "./market-readiness-country-switcher";
