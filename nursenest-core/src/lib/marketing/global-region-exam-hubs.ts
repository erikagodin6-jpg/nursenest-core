/**
 * Maps global region slugs (country selector / `nn_global_region` cookie) to
 * marketing exam hub URLs and default locales for post-switch navigation.
 */

import { REGION_CONFIG, type GlobalLocaleCode, type GlobalRegionSlug } from "@/lib/i18n/global-regions";

export type GlobalRegionExamHub = {
  /** English canonical path; localize with `withMarketingLocale`. */
  hubPath: `/${string}`;
  /** Suggested marketing locale after switching to this region (cookie + redirect). */
  defaultLocale: GlobalLocaleCode;
};

/** Shipped `/exams/…` hubs by region — exported for route-aware header defaults. */
export const HUB_BY_REGION: Partial<Record<GlobalRegionSlug, GlobalRegionExamHub>> = {
  china: { hubPath: "/exams/china", defaultLocale: "zh" },
  germany: { hubPath: "/exams/germany", defaultLocale: "de" },
  france: { hubPath: "/exams/france", defaultLocale: "fr" },
  italy: { hubPath: "/exams/italy", defaultLocale: "it" },
  hungary: { hubPath: "/exams/hungary", defaultLocale: "hu" },
  portugal: { hubPath: "/exams/portugal", defaultLocale: "pt" },
  mexico: { hubPath: "/exams/mexico", defaultLocale: "es" },
  japan: { hubPath: "/exams/japan", defaultLocale: "ja" },
  "south-korea": { hubPath: "/exams/korea", defaultLocale: "ko" },
  india: { hubPath: "/exams/india", defaultLocale: "en" },
  aus: { hubPath: "/exams/australia", defaultLocale: "en" },
  philippines: { hubPath: "/exams/philippines", defaultLocale: "en" },
  uk: { hubPath: "/exams/uk", defaultLocale: "en" },
  uae: { hubPath: "/exams/middle-east", defaultLocale: "en" },
  "saudi-arabia": { hubPath: "/exams/middle-east", defaultLocale: "en" },
};

/**
 * Returns exam hub info when the region has a shipped marketing hub; otherwise undefined.
 */
export function getExamHubForGlobalRegion(region: GlobalRegionSlug): GlobalRegionExamHub | undefined {
  return HUB_BY_REGION[region];
}

/** Regions with a shipped `/exams/…` marketing implementation (admin launch workflow). */
export function listExpansionHubRegions(): GlobalRegionSlug[] {
  return Object.keys(HUB_BY_REGION) as GlobalRegionSlug[];
}

/**
 * Preferred locale after switching country: hub default if user’s current locale
 * is not allowed for the new region.
 */
export function localeAfterRegionSwitch(
  region: GlobalRegionSlug,
  currentLocale: GlobalLocaleCode,
): GlobalLocaleCode {
  const cfg = REGION_CONFIG[region];
  if (cfg.allowedLocales.includes(currentLocale)) return currentLocale;
  return cfg.defaultLocale;
}
