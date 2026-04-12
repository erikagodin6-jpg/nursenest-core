/**
 * Resolve whether the smart exam selector should show and provide geo-based
 * defaults for the selector UI.
 *
 * Called on first-visit pages (root "/", generic landing pages) to determine
 * if we should guide the user through profession + country selection.
 *
 * The selector is suppressed when the user already has saved preferences,
 * is logged in, has entitlements, or has landed on a fully scoped route.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG, isGlobalRegionSlug } from "@/lib/i18n/global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type SelectorEligibility = {
  shouldShow: boolean;
  reason: string;
  geoRegion: GlobalRegionSlug | null;
  geoLocale: GlobalLocaleCode | null;
};

export type SelectorEligibilityInput = {
  isLoggedIn: boolean;
  hasPreferenceCookie: boolean;
  hasDismissedSelector: boolean;
  isScopedRoute: boolean;
  geoCountryCode: string | null;
};

// ── Country code → region mapping ────────────────────────────────────────────

const COUNTRY_TO_REGION = buildCountryToRegionMap();

function buildCountryToRegionMap(): Map<string, GlobalRegionSlug> {
  const map = new Map<string, GlobalRegionSlug>();
  for (const [slug, cfg] of Object.entries(REGION_CONFIG)) {
    for (const cc of cfg.countryCodes) {
      map.set(cc.toUpperCase(), slug as GlobalRegionSlug);
    }
  }
  return map;
}

export function geoCountryToRegion(countryCode: string | null): GlobalRegionSlug | null {
  if (!countryCode) return null;
  return COUNTRY_TO_REGION.get(countryCode.toUpperCase()) ?? null;
}

// ── Eligibility resolver ─────────────────────────────────────────────────────

/**
 * Determine whether to show the smart exam selector.
 *
 * Pure function — no side effects.
 */
export function resolveSelectorEligibility(
  input: SelectorEligibilityInput,
): SelectorEligibility {
  if (input.isLoggedIn) {
    return { shouldShow: false, reason: "logged_in", geoRegion: null, geoLocale: null };
  }

  if (input.hasPreferenceCookie) {
    return { shouldShow: false, reason: "has_preferences", geoRegion: null, geoLocale: null };
  }

  if (input.hasDismissedSelector) {
    return { shouldShow: false, reason: "dismissed", geoRegion: null, geoLocale: null };
  }

  if (input.isScopedRoute) {
    return { shouldShow: false, reason: "scoped_route", geoRegion: null, geoLocale: null };
  }

  const geoRegion = geoCountryToRegion(input.geoCountryCode);
  const geoLocale = geoRegion
    ? REGION_CONFIG[geoRegion].defaultLocale
    : null;

  return {
    shouldShow: true,
    reason: "eligible",
    geoRegion,
    geoLocale,
  };
}

// ── Defaults for the selector ────────────────────────────────────────────────

export type SelectorDefaults = {
  suggestedRegion: GlobalRegionSlug | null;
  suggestedLocale: GlobalLocaleCode | null;
  suggestedProfession: string;
};

/**
 * Build intelligent defaults for the selector steps based on geo-detection.
 */
export function buildSelectorDefaults(
  geoRegion: GlobalRegionSlug | null,
): SelectorDefaults {
  return {
    suggestedRegion: geoRegion,
    suggestedLocale: geoRegion ? REGION_CONFIG[geoRegion].defaultLocale : null,
    suggestedProfession: "rn",
  };
}

// ── Cookie name constants ────────────────────────────────────────────────────

export const SELECTOR_DISMISSED_KEY = "nn_selector_dismissed";
