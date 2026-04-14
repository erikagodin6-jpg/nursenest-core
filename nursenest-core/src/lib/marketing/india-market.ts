/**
 * India-focused marketing surfaces: exams hub, topic guides, and Indian-language locales.
 * Used by header navigation ordering and India SEO routes.
 */

/** Locales where we prioritize India exam navigation (Indian languages). */
export const INDIA_PRIORITY_LOCALES = new Set(["hi", "ta", "te", "bn", "mr", "gu"]);

export function shouldPrioritizeIndiaNavigation(pathname: string, locale: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p === "/exams/india" || p.startsWith("/exams/india/")) return true;
  if (p.startsWith("/india/")) return true;
  if (INDIA_PRIORITY_LOCALES.has(locale)) return true;
  return false;
}
