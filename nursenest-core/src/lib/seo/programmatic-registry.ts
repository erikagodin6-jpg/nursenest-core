/**
 * Programmatic SEO definitions: single source for routes, metadata, sitemap, and internal links.
 * Page payloads live in `programmatic-registry-pages-part-1.ts`, `programmatic-registry-pages-part-2.ts`,
 * and `programmatic-seo-authority-batch.ts`. Those modules are **lazy-loaded** via `import()` on first
 * registry access (same dynamic `import()` pattern as {@link ./programmatic-question-topic-registry}) so importing this file
 * for constants, types, or slug checks does not eagerly evaluate megabytes of page objects during webpack
 * analysis of client/server shared graphs (e.g. footer → marketing routes).
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
import type { SeoCluster, SeoPageDefinition } from "./programmatic-seo-definitions";
import {
  MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS,
  MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS,
  MAX_RELATED_PROGRAMMATIC_LINKS,
  PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS,
} from "./programmatic-registry-constants";

export type { SeoCluster, SeoPageDefinition };

export {
  MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS,
  MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS,
  MAX_RELATED_PROGRAMMATIC_LINKS,
  PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS,
};

export { getAllProgrammaticSlugs, isProgrammaticSeoSlug } from "./programmatic-registry-slugs";

let mergedProgrammaticSeoPagesPromise: Promise<SeoPageDefinition[]> | null = null;

function loadMergedProgrammaticSeoPages(): Promise<SeoPageDefinition[]> {
  if (!mergedProgrammaticSeoPagesPromise) {
    mergedProgrammaticSeoPagesPromise = (async () => {
      const [p1, p2, auth] = await Promise.all([
        import("./programmatic-registry-pages-part-1"),
        import("./programmatic-registry-pages-part-2"),
        import("./programmatic-seo-authority-batch"),
      ]);
      return [
        ...p1.PROGRAMMATIC_SEO_PAGES_PART_1,
        ...p2.PROGRAMMATIC_SEO_PAGES_PART_2,
        ...auth.PROGRAMMATIC_SEO_AUTHORITY_BATCH,
      ];
    })();
  }
  return mergedProgrammaticSeoPagesPromise;
}

/** Full merged page list — lazy-loads part modules on first call. */
export async function getProgrammaticSeoPages(): Promise<SeoPageDefinition[]> {
  return loadMergedProgrammaticSeoPages();
}

export async function getAllProgrammaticSeoPages(): Promise<SeoPageDefinition[]> {
  return loadMergedProgrammaticSeoPages();
}

export async function getProgrammaticSeoPage(slug: string): Promise<SeoPageDefinition | undefined> {
  const pages = await loadMergedProgrammaticSeoPages();
  return pages.find((p) => p.slug === slug);
}

export async function getRelatedProgrammaticPages(
  slug: string,
  limit = MAX_RELATED_PROGRAMMATIC_LINKS,
): Promise<SeoPageDefinition[]> {
  const pages = await loadMergedProgrammaticSeoPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return [];
  return pages.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export async function getCrossClusterLinks(slug: string): Promise<SeoPageDefinition[]> {
  const pages = await loadMergedProgrammaticSeoPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex", "study-guide"];
  return pages.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(0, MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS);
}
