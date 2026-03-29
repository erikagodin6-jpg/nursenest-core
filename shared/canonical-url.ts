const DEFAULT_SITE_BASE = "https://www.nursenest.ca";

export function normalizeCanonicalUrl(
  path: string,
  locale: string = "en",
  siteBase: string = DEFAULT_SITE_BASE
): string {
  let normalized = path.split("?")[0].split("#")[0];

  normalized = normalized.replace(/\/index\.html$/i, "/");

  normalized = normalized.replace(/\/+/g, "/");

  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.replace(/\/+$/, "");
  }

  normalized = normalized.toLowerCase();

  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  const localePrefix = `/${locale}`;
  const fullPath = normalized === "/" ? localePrefix : `${localePrefix}${normalized}`;

  return `${siteBase}${fullPath}`;
}

export function stripIndexHtml(path: string): string {
  return path.replace(/\/index\.html$/i, "/").replace(/\/+$/, "") || "/";
}

export function normalizePathSegment(path: string): string {
  let normalized = path.split("?")[0].split("#")[0];
  normalized = normalized.replace(/\/index\.html$/i, "/");
  normalized = normalized.replace(/\/+/g, "/");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.replace(/\/+$/, "");
  }
  return normalized || "/";
}

export const TIMESTAMP_SLUG_PATTERN = /-\d{10,13}$/;

export function hasTimestampSuffix(slug: string): boolean {
  return TIMESTAMP_SLUG_PATTERN.test(slug);
}

export function stripTimestampSuffix(slug: string): string {
  return slug.replace(TIMESTAMP_SLUG_PATTERN, "");
}

export const LOW_VALUE_TRANSLATED_PATHS = new Set([
  "/privacy",
  "/terms",
  "/disclaimer",
  "/refund-policy",
  "/faq",
  "/contact",
  "/about",
]);

export function isLowValueTranslatedPage(path: string, locale: string): boolean {
  if (locale === "en") return false;
  return LOW_VALUE_TRANSLATED_PATHS.has(path);
}
