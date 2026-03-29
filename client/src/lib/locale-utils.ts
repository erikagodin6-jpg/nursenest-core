import {
  localizeSlug as _localizeSlug,
  deLocalizeSlug as _deLocalizeSlug,
  LOCALIZED_SLUGS,
} from "@shared/localized-slugs";
import { normalizeCanonicalUrl } from "@shared/canonical-url";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale, getMainSiteDomain } from "@shared/locales";
export type { SupportedLocale } from "@shared/locales";

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, isValidLocale };

export function getLocaleFromPath(path: string): { locale: SupportedLocale; pathWithoutLocale: string } {
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const locale = segments[0] as SupportedLocale;
    const rest = "/" + segments.slice(1).join("/");
    return { locale, pathWithoutLocale: rest === "/" ? "/" : rest };
  }
  return { locale: DEFAULT_LOCALE, pathWithoutLocale: path || "/" };
}

export function buildLocalePath(locale: SupportedLocale | string, path: string): string {
  const cleanPath = path.startsWith("/") ? path : "/" + path;
  const localizedPath = localizeSlug(locale, cleanPath);
  const raw = `/${locale}${localizedPath === "/" ? "" : localizedPath}`;
  return raw.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

export function localizeSlug(locale: string, englishPath: string): string {
  return _localizeSlug(locale, englishPath);
}

export function deLocalizeSlug(locale: string, localizedPath: string): string {
  return _deLocalizeSlug(locale, localizedPath);
}

export { LOCALIZED_SLUGS };

export function getMainSiteUrl(path: string = "/", locale?: string): string {
  const domain = getMainSiteDomain();
  const isProduction = window.location.hostname.includes("nursenest.ca");
  const cleanPath = path.startsWith("/") ? path : "/" + path;

  const hashIndex = cleanPath.indexOf("#");
  const pathBeforeHash = hashIndex >= 0 ? cleanPath.slice(0, hashIndex) : cleanPath;
  const hashPart = hashIndex >= 0 ? cleanPath.slice(hashIndex) : "";

  if (isProduction) {
    const effectiveLocale = locale || "en";
    return normalizeCanonicalUrl(pathBeforeHash, effectiveLocale, domain) + hashPart;
  }

  const localeParam = locale && locale !== "en" ? `&locale=${locale}` : "";
  if (pathBeforeHash === "/") {
    return `/?mode=nursing${localeParam}${hashPart}`;
  }
  const separator = pathBeforeHash.includes("?") ? "&" : "?";
  return `${pathBeforeHash}${separator}mode=nursing${localeParam}${hashPart}`;
}
