export const SITE_BASE = "https://www.nursenest.ca";
export const ALLIED_SITE_BASE = "https://allied.nursenest.ca";

export const NOINDEX_UTILITY_PAGES = new Set([
  "/privacy",
  "/terms",
  "/disclaimer",
  "/refund-policy",
  "/faq",
  "/about",
  "/contact",
]);

export function buildCanonicalUrl(path: string, locale: string = "en", base: string = SITE_BASE): string {
  let cleanPath = path.split("?")[0].split("#")[0];
  cleanPath = cleanPath.replace(/\/index\.html$/, "");
  cleanPath = cleanPath.replace(/\/+$/, "") || "/";
  cleanPath = cleanPath.toLowerCase();

  const localePrefix = `/${locale}`;
  const pathSuffix = cleanPath === "/" ? "" : cleanPath;
  return `${base}${localePrefix}${pathSuffix}`;
}

export function isUtilityPage(path: string): boolean {
  const cleanPath = path.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  return NOINDEX_UTILITY_PAGES.has(cleanPath);
}

export function shouldNoindexForLocale(path: string, locale: string): boolean {
  if (locale === "en") return false;
  return isUtilityPage(path);
}

export function getIndexableLocalesForPage(path: string, allIndexableLocales: string[]): string[] {
  if (!isUtilityPage(path)) return allIndexableLocales;
  return allIndexableLocales.filter(l => l === "en");
}

const TIMESTAMP_SLUG_PATTERN = /^(.+)-(\d{13,})$/;
const KNOWN_TIMESTAMP_SLUGS = new Set(["test-publish-flow-1772145129698"]);

export function isTimestampSlug(slug: string): boolean {
  if (TIMESTAMP_SLUG_PATTERN.test(slug)) return true;
  if (KNOWN_TIMESTAMP_SLUGS.has(slug)) return true;
  return false;
}

export function getCanonicalSlugFromTimestamp(slug: string): string | null {
  const match = slug.match(TIMESTAMP_SLUG_PATTERN);
  if (match) return match[1];
  return null;
}

export function generateUniqueSlugSuffix(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = new Uint8Array(6);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  for (let i = 0; i < 6; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
}
