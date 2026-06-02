import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

/** Canonical marketing origin for SEO (sitemaps, JSON-LD, metadata). */
export const MARKETING_SITE_ORIGIN = resolveCanonicalSiteOrigin().replace(/\/$/, "");

/** Query params that must never appear in canonical URLs — they are tracking/session artefacts. */
const CANONICAL_STRIP_PARAMS = new Set(["ref", "pathwayId", "checkout", "friendCode", "callbackUrl"]);

/**
 * Build an absolute canonical URL, stripping any tracking / session query params that would
 * create duplicate-URL issues in Google Search Console (2,037+ reported "Duplicate without canonical").
 */
export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const full = `${MARKETING_SITE_ORIGIN}${p}`;
  try {
    const u = new URL(full);
    for (const key of Array.from(u.searchParams.keys())) {
      if (CANONICAL_STRIP_PARAMS.has(key)) u.searchParams.delete(key);
    }
    // Preserve ? only when params remain
    return u.searchParams.size > 0
      ? `${u.origin}${u.pathname}?${u.searchParams.toString()}`
      : `${u.origin}${u.pathname}`;
  } catch {
    return full;
  }
}
