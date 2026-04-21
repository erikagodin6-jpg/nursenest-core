/**
 * Programmatic SEO definitions: single source for routes, metadata, sitemap, and internal links.
 * Page payloads live in `programmatic-registry-pages-part-1.ts` and `programmatic-registry-pages-part-2.ts`
 * (concatenated here in stable order). Add entries there to scale indexable pages without new route files.
 *
 * **Rendering:** Routes use on-demand ISR (`generateStaticParams` returns `[]`, `revalidate` set on the page).
 * Do not prerender a full slug×locale matrix at build time.
 *
 * **Sitemap:** `MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS` bounds bulk URL emission (see `sitemap-static-xml.ts`).
 *
 * **Scaling content (no thin/duplicate pages):**
 * - Each entry must stand alone: distinct H1, meta description, and multiple substantive sections and/or FAQ.
 * - Prefer **topic guides** and **study plans** with actionable structure; avoid near-duplicates of existing slugs.
 * - AI-assisted drafts should be validated with `npm run validate:programmatic-seo` before merge.
 * - Per-question marketing URLs at huge scale belong in a separate, data-backed system (exam items + allowlists),
 *   not copy-pasted templates — see product architecture docs.
 *
 * **Public URLs:** `/{slug}` (rewritten to `/seo/[slug]`). Localized: `/{locale}/{slug}`. Canonical + hreflang via
 * `buildProgrammaticMetadata`. JSON-LD: `ProgrammaticPageJsonLd` (LearningResource + optional FAQPage).
 */
import { PROGRAMMATIC_SEO_AUTHORITY_BATCH } from "./programmatic-seo-authority-batch";
import type { SeoCluster, SeoPageDefinition } from "./programmatic-seo-definitions";
import { PROGRAMMATIC_SEO_PAGES_PART_1 } from "./programmatic-registry-pages-part-1";
import { PROGRAMMATIC_SEO_PAGES_PART_2 } from "./programmatic-registry-pages-part-2";


export type { SeoCluster, SeoPageDefinition };

/** Matches `revalidate` on `/seo/[slug]` and `/[locale]/[slug]` programmatic pages (24h ISR). */
export const PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS = 86_400;

/** Internal “related” / cross-cluster links per page (bounded; no full-registry scans in UI). */
export const MAX_RELATED_PROGRAMMATIC_LINKS = 6;
export const MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS = 6;

/** Hard cap for sitemap + locale sitemap loops over programmatic slugs (safety rail if the array grows). */
export const MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS = 2_000;

export const PROGRAMMATIC_SEO_AUTHORITY_BATCH_SLUGS: string[] = PROGRAMMATIC_SEO_AUTHORITY_BATCH.map((p) => p.slug);


export const PROGRAMMATIC_SEO_PAGES: SeoPageDefinition[] = [
  ...PROGRAMMATIC_SEO_PAGES_PART_1,
  ...PROGRAMMATIC_SEO_PAGES_PART_2,
  ...PROGRAMMATIC_SEO_AUTHORITY_BATCH,
];


export function getAllProgrammaticSeoPages(): SeoPageDefinition[] {
  return PROGRAMMATIC_SEO_PAGES;
}

export function getProgrammaticSeoPage(slug: string): SeoPageDefinition | undefined {
  return PROGRAMMATIC_SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return PROGRAMMATIC_SEO_PAGES.map((p) => p.slug);
}

export function getRelatedProgrammaticPages(
  slug: string,
  limit = MAX_RELATED_PROGRAMMATIC_LINKS,
): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export function getCrossClusterLinks(slug: string): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex", "study-guide"];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(
    0,
    MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS,
  );
}

export function isProgrammaticSeoSlug(slug: string): boolean {
  return PROGRAMMATIC_SEO_PAGES.some((p) => p.slug === slug);
}
