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
 * This config is consumed by:
 *   - Context switcher (controls messaging when switching to unsupported markets)
 *   - Blog generator (gates claims about product support)
 *   - SEO helpers (controls which country pages get indexed)
 *   - Pricing pages (controls which markets show pricing)
 *
 * **Public country/exam launch** also requires {@link evaluateGlobalRegionLaunchReadiness} — see
 * `country-exam-launch-readiness.ts` (pathway inventory + editorial approval).
 */

export type { MarketSupportTier, MarketReadinessConfig, SubRegionConfig } from "./market-readiness-data";
export { MARKET_READINESS } from "./market-readiness-data";

import { MARKET_READINESS } from "./market-readiness-data";
import type { MarketReadinessConfig } from "./market-readiness-data";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { evaluateGlobalRegionLaunchReadiness } from "./country-exam-launch-readiness";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getMarketReadiness(region: GlobalRegionSlug): MarketReadinessConfig {
  return MARKET_READINESS[region];
}

export function isMarketFullySupported(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].supportTier === "full";
}

/**
 * **Public marketing / learner UI gate:** regions that appear in the country switcher, onboarding,
 * and account region lists for non-staff users. Requires market prep **and** pathway launch readiness
 * (committed snapshot + required NCLEX hubs + editorial approval). See `country-exam-launch-readiness.ts`.
 */
export function isPublicCountrySwitcherReady(region: GlobalRegionSlug): boolean {
  return evaluateGlobalRegionLaunchReadiness(region).status === "published";
}

/** Default when a legacy cookie/path points at a non-published market — keeps dropdown selection valid. */
export const DEFAULT_PUBLIC_GLOBAL_REGION: GlobalRegionSlug = "us";

export function coerceToPublicCountrySwitcherRegion(region: GlobalRegionSlug): GlobalRegionSlug {
  return isPublicCountrySwitcherReady(region) ? region : DEFAULT_PUBLIC_GLOBAL_REGION;
}

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
 * **Do not use in public marketing chrome** — use {@link isPublicCountrySwitcherReady} to hide
 * incomplete regions instead of showing "coming soon" in the live dropdown.
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
