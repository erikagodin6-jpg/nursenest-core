import { CANONICAL_PRODUCTION_ORIGIN } from "@/lib/seo/canonical-site";

/** Canonical marketing origin for SEO (sitemaps, JSON-LD, metadata). */
export const MARKETING_SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || CANONICAL_PRODUCTION_ORIGIN
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${MARKETING_SITE_ORIGIN}${p}`;
}
