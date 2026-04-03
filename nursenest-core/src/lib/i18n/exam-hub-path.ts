import type { CountrySlug } from "@/lib/exam-pathways/types";

/** First URL segment for marketing exam pathway hubs (`/{country}/{role}/{exam}/…`). */
export function isExamPathwayCountrySlug(segment: string): segment is CountrySlug {
  return segment === "us" || segment === "canada";
}

/**
 * True when the pathname is an exam hub path (country slug first), not a BCP marketing locale prefix.
 * Uses the raw pathname (e.g. from `usePathname()`), including any leading `/fr` if present.
 */
export function isExamHubMarketingPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  const first = parts[0];
  if (!first) return false;
  if (isExamPathwayCountrySlug(first)) return true;
  return false;
}
