/**
 * Path-only regional hints for hooks and content (not for header shortcut rows).
 *
 * Country switching in the marketing chrome uses the `CountrySelector` dropdown only.
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

/**
 * Path-only strip id for legacy consumers (header does not render regional shortcut strips).
 * Cookie/locale intentionally ignored — use {@link resolveRegionalMarketingStrip}'s path-only behavior.
 */
export function resolveRegionalMarketingStrip(
  strippedPath: string,
  _locale: string,
  _globalRegionCookie: GlobalRegionSlug | null | undefined,
): RegionalMarketingStrip {
  return pathStrip(strippedPath);
}
