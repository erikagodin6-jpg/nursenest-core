/**
 * Policy constants for programmatic SEO — **no page payload imports**.
 * Pathway-topic registry and other modules can import from here without pulling the large page arrays.
 */

/** Matches `revalidate` on `/seo/[slug]` and `/[locale]/[slug]` programmatic pages (24h ISR). */
export const PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS = 86_400;

/** Internal “related” / cross-cluster links per page (bounded; no full-registry scans in UI). */
export const MAX_RELATED_PROGRAMMATIC_LINKS = 6;
export const MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS = 6;

/** Hard cap for sitemap + locale sitemap loops over programmatic slugs (safety rail if the array grows). */
export const MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS = 2_000;
