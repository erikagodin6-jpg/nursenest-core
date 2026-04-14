/**
 * Single regional strip for marketing header: pathname beats cookie beats locale hints.
 * Prevents multiple country strips from appearing at once.
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";

export type RegionalMarketingStrip =
  | "philippines"
  | "middle_east"
  | "australia"
  | "china"
  | "korea"
  | "japan"
  | "germany"
  | "france"
  | "italy"
  | "hungary"
  | "portugal"
  | "mexico"
  | "india"
  | null;

function p(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function pathStrip(strippedPath: string): RegionalMarketingStrip {
  const path = p(strippedPath);
  if (path === "/exams/philippines" || path.startsWith("/exams/philippines/")) {
    return "philippines";
  }
  if (path === "/exams/middle-east" || path.startsWith("/exams/middle-east/") || path.startsWith("/middle-east/")) {
    return "middle_east";
  }
  if (path === "/exams/australia" || path.startsWith("/exams/australia/") || path.startsWith("/australia/")) {
    return "australia";
  }
  if (path === "/exams/china" || path.startsWith("/exams/china/") || path.startsWith("/china/")) {
    return "china";
  }
  if (path === "/exams/korea" || path.startsWith("/exams/korea/") || path.startsWith("/korea/")) {
    return "korea";
  }
  if (path === "/exams/japan" || path.startsWith("/exams/japan/") || path.startsWith("/japan/")) {
    return "japan";
  }
  if (path === "/exams/germany" || path.startsWith("/exams/germany/") || path.startsWith("/germany/")) {
    return "germany";
  }
  if (path === "/exams/france" || path.startsWith("/exams/france/") || path.startsWith("/france/")) {
    return "france";
  }
  if (path === "/exams/italy" || path.startsWith("/exams/italy/") || path.startsWith("/italy/")) {
    return "italy";
  }
  if (path === "/exams/hungary" || path.startsWith("/exams/hungary/") || path.startsWith("/hungary/")) {
    return "hungary";
  }
  if (path === "/exams/portugal" || path.startsWith("/exams/portugal/") || path.startsWith("/portugal/")) {
    return "portugal";
  }
  if (path === "/exams/mexico" || path.startsWith("/exams/mexico/") || path.startsWith("/mexico/")) {
    return "mexico";
  }
  if (path === "/exams/india" || path.startsWith("/exams/india/") || path.startsWith("/india/")) {
    return "india";
  }
  return null;
}

function cookieStrip(globalRegion: GlobalRegionSlug | null | undefined): RegionalMarketingStrip {
  if (!globalRegion) return null;
  if (globalRegion === "philippines") return "philippines";
  if (globalRegion === "uae" || globalRegion === "saudi-arabia") return "middle_east";
  if (globalRegion === "aus") return "australia";
  if (globalRegion === "china") return "china";
  if (globalRegion === "south-korea") return "korea";
  if (globalRegion === "japan") return "japan";
  if (globalRegion === "germany") return "germany";
  if (globalRegion === "france") return "france";
  if (globalRegion === "italy") return "italy";
  if (globalRegion === "hungary") return "hungary";
  if (globalRegion === "portugal") return "portugal";
  if (globalRegion === "mexico") return "mexico";
  if (globalRegion === "india") return "india";
  return null;
}

/** Locales that imply India exam nav when no path/cookie strip is set. */
const INDIA_LOCALES = new Set(["hi", "ta", "te", "bn", "mr", "gu"]);

/** Locales that imply Middle East nav when no path/cookie strip is set. */
const MIDDLE_EAST_LOCALES = new Set(["ar", "ur"]);

function localeStrip(locale: string): RegionalMarketingStrip {
  if (locale === "tl") return "philippines";
  if (locale === "zh" || locale === "zh-tw") return "china";
  if (locale === "ko") return "korea";
  if (locale === "ja") return "japan";
  if (locale === "de") return "germany";
  if (locale === "fr") return "france";
  if (locale === "it") return "italy";
  if (locale === "hu") return "hungary";
  if (locale === "pt") return "portugal";
  if (INDIA_LOCALES.has(locale)) return "india";
  if (MIDDLE_EAST_LOCALES.has(locale)) return "middle_east";
  return null;
}

/**
 * Which regional shortcut strip to show in the marketing header (desktop tier row + mobile block).
 */
export function resolveRegionalMarketingStrip(
  strippedPath: string,
  locale: string,
  globalRegionCookie: GlobalRegionSlug | null | undefined,
): RegionalMarketingStrip {
  const fromPath = pathStrip(strippedPath);
  if (fromPath) return fromPath;
  const fromCookie = cookieStrip(globalRegionCookie);
  if (fromCookie) return fromCookie;
  return localeStrip(locale);
}
