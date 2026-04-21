/**
 * Country switcher listing + strict US/CA publish gate — depends on {@link evaluateGlobalRegionLaunchReadiness}
 * (pathway catalog + snapshot). Keep separate from {@link ./market-readiness-config} so client pricing/checkout
 * code does not pull that graph.
 */

import { GLOBAL_REGION_SLUGS, REGION_CONFIG, type GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { getExamHubForGlobalRegion } from "@/lib/marketing/global-region-exam-hubs";
import { MARKET_READINESS } from "./market-readiness-data";
import { DEFAULT_PUBLIC_GLOBAL_REGION } from "./market-readiness-config";
import { evaluateGlobalRegionLaunchReadiness } from "./country-exam-launch-readiness";

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

/**
 * Canonical ordered list for marketing / onboarding country UIs (same filter as {@link isGlobalRegionListedInCountrySwitcher}).
 * Order matches `getRegionGroups` / `getCountryChoices` (context-routing): US, Canada, then international A–Z by display name.
 */
export function listGlobalRegionsListedInCountrySwitcher(): GlobalRegionSlug[] {
  const listed = (GLOBAL_REGION_SLUGS as readonly GlobalRegionSlug[]).filter((slug) =>
    isGlobalRegionListedInCountrySwitcher(slug),
  );
  const rank = (slug: GlobalRegionSlug) => (slug === "us" ? 0 : slug === "canada" ? 1 : 2);
  listed.sort((a, b) => {
    const d = rank(a) - rank(b);
    if (d !== 0) return d;
    return REGION_CONFIG[a].displayName.localeCompare(REGION_CONFIG[b].displayName, "en", { sensitivity: "base" });
  });
  return listed;
}

export function coerceToPublicCountrySwitcherRegion(region: GlobalRegionSlug): GlobalRegionSlug {
  return isGlobalRegionListedInCountrySwitcher(region) ? region : DEFAULT_PUBLIC_GLOBAL_REGION;
}
