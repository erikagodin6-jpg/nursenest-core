/**
 * Single source for the public production hostname used in sitemaps, robots, and absolute SEO URLs.
 *
 * Production crawl surfaces must never inherit a misconfigured `NEXT_PUBLIC_APP_URL` such as:
 * - `http://www.nursenest.ca`
 * - `https://nursenest.ca`
 * - `https://allied.nursenest.ca`
 *
 * Google Search Console treats those as different fetch/canonical surfaces. The public canonical is always the
 * HTTPS www host; localhost is allowed only for local development/test renders.
 */
export const CANONICAL_PRODUCTION_ORIGIN = "https://www.nursenest.ca";

function isLocalDevelopmentOrigin(raw: string): boolean {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    return url.protocol === "http:" && (host === "localhost" || host === "127.0.0.1" || host.endsWith(".local"));
  } catch {
    return false;
  }
}

export function resolveCanonicalSiteOrigin(): string {
  try {
    const raw = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") ?? "";
    if (raw && isLocalDevelopmentOrigin(raw)) return raw;
    return CANONICAL_PRODUCTION_ORIGIN;
  } catch {
    return CANONICAL_PRODUCTION_ORIGIN;
  }
}
