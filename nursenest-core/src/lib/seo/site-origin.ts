import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";

/** Canonical marketing origin for SEO (sitemaps, JSON-LD, metadata). */
export const MARKETING_SITE_ORIGIN = resolveCanonicalSiteOrigin().replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MARKETING_SITE_ORIGIN}${p}`;
}
