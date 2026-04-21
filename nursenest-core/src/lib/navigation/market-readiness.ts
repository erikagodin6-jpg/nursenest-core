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
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import { evaluateGlobalRegionLaunchReadiness } from "./country-exam-launch-readiness";

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getMarketReadiness(region: GlobalRegionSlug): MarketReadinessConfig {
  return MARKET_READINESS[region];
}

export function isMarketFullySupported(region: GlobalRegionSlug): boolean {
  return MARKET_READINESS[region].supportTier === "full";
}

/**
 * **Strict product-launch gate (US/CA + expansion):** `published` in `country-exam-launch-readiness.ts`.
 * Use for surfaces that require the full pathway + market bar (e.g. treating a region as “fully live”).
 */
export function isPublicCountrySwitcherReady(region: GlobalRegionSlug): boolean {
  return evaluateGlobalRegionLaunchReadiness(region).status === "published";
}

/**
 * **Public country switcher listing** (marketing header, onboarding country step, learner region prefs).
 *
 * - **United States & Canada:** must pass {@link isPublicCountrySwitcherReady} (unchanged NCLEX launch bar).
 * - **International:** `MARKET_READINESS` row is SEO-enabled, not `planned`, and a **shipped** `/exams/…`
 *   hub exists in {@link getExamHubForGlobalRegion} so {@link applyGlobalRegionSelection} never no-ops into a dead route.
 */
export function isGlobalRegionListedInCountrySwitcher(region: GlobalRegionSlug): boolean {
  if (region === "us" || region === "canada") {
    return isPublicCountrySwitcherReady(region);
  }
  const m = MARKET_READINESS[region];
  if (!m?.seoEnabled) return false;
  if (m.supportTier === "planned") return false;
  return getExamHubForGlobalRegion(region) != null;
}

/** Default when a legacy cookie/path points at a non-selectable market — keeps dropdown selection valid. */
export const DEFAULT_PUBLIC_GLOBAL_REGION: GlobalRegionSlug = "us";

export function coerceToPublicCountrySwitcherRegion(region: GlobalRegionSlug): GlobalRegionSlug {
  return isGlobalRegionListedInCountrySwitcher(region) ? region : DEFAULT_PUBLIC_GLOBAL_REGION;
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
 * **Do not use in public marketing chrome** for listing — use {@link isGlobalRegionListedInCountrySwitcher}.
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
