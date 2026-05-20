/**
 * Single source for the public production hostname used in sitemaps, robots, and absolute SEO URLs.
 *
 * Production crawl surfaces must never inherit a misconfigured `NEXT_PUBLIC_APP_URL` such as:
 * - `http://nursenest.ca`
 * - `https://www.nursenest.ca`
 * - `https://allied.nursenest.ca`
 *
 * Google Search Console treats those as different fetch/canonical surfaces. The public canonical is always the
 * HTTPS apex host; localhost is allowed only when `NN_ALLOW_LOCAL_CANONICAL_ORIGIN=1` is set for local tooling.
 */
export const CANONICAL_PRODUCTION_ORIGIN = "https://nursenest.ca";

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
    if (raw && process.env.NN_ALLOW_LOCAL_CANONICAL_ORIGIN === "1" && isLocalDevelopmentOrigin(raw)) return raw;
    return CANONICAL_PRODUCTION_ORIGIN;
  } catch {
    return CANONICAL_PRODUCTION_ORIGIN;
  }
}
