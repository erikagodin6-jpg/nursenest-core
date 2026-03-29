/**
 * Single source for the public production hostname used in sitemaps, robots, and absolute SEO URLs.
 * `NEXT_PUBLIC_APP_URL` wins when set; otherwise production default (GSC canonical).
 */
export const CANONICAL_PRODUCTION_ORIGIN = "https://www.nursenest.ca";

export function resolveCanonicalSiteOrigin(): string {
  try {
    const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!raw) return CANONICAL_PRODUCTION_ORIGIN;
    return raw.replace(/\/$/, "") || CANONICAL_PRODUCTION_ORIGIN;
  } catch {
    return CANONICAL_PRODUCTION_ORIGIN;
  }
}
