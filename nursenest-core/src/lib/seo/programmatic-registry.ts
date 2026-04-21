/**
 * Programmatic SEO definitions: single source for routes, metadata, sitemap, and internal links.
 * Page payloads live in `programmatic-registry-pages-part-1.ts`, `programmatic-registry-pages-part-2.ts`,
 * and `programmatic-seo-authority-batch.ts`. Those modules are **lazy-loaded** on first registry access
 * (same pattern as {@link ./programmatic-question-topic-registry}) so importing this file for constants
 * or types does not eagerly evaluate megabytes of page objects at module init or during unrelated builds.
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
import { createRequire } from "node:module";
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

const require = createRequire(import.meta.url);

type PagesPart1 = typeof import("./programmatic-registry-pages-part-1");
type PagesPart2 = typeof import("./programmatic-registry-pages-part-2");
type AuthorityBatch = typeof import("./programmatic-seo-authority-batch");

let mergedProgrammaticSeoPages: SeoPageDefinition[] | null = null;

function getMergedProgrammaticSeoPages(): SeoPageDefinition[] {
  if (!mergedProgrammaticSeoPages) {
    const p1 = require("./programmatic-registry-pages-part-1") as PagesPart1;
    const p2 = require("./programmatic-registry-pages-part-2") as PagesPart2;
    const auth = require("./programmatic-seo-authority-batch") as AuthorityBatch;
    mergedProgrammaticSeoPages = [
      ...p1.PROGRAMMATIC_SEO_PAGES_PART_1,
      ...p2.PROGRAMMATIC_SEO_PAGES_PART_2,
      ...auth.PROGRAMMATIC_SEO_AUTHORITY_BATCH,
    ];
  }
  return mergedProgrammaticSeoPages;
}

/** Full merged page list — lazy-loads part modules on first call. */
export function getProgrammaticSeoPages(): SeoPageDefinition[] {
  return getMergedProgrammaticSeoPages();
}

export function getAllProgrammaticSeoPages(): SeoPageDefinition[] {
  return getMergedProgrammaticSeoPages();
}

export function getProgrammaticSeoPage(slug: string): SeoPageDefinition | undefined {
  return getMergedProgrammaticSeoPages().find((p) => p.slug === slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return getMergedProgrammaticSeoPages().map((p) => p.slug);
}

export function getRelatedProgrammaticPages(
  slug: string,
  limit = MAX_RELATED_PROGRAMMATIC_LINKS,
): SeoPageDefinition[] {
  const pages = getMergedProgrammaticSeoPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return [];
  return pages.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export function getCrossClusterLinks(slug: string): SeoPageDefinition[] {
  const pages = getMergedProgrammaticSeoPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex", "study-guide"];
  return pages.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(0, MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS);
}

export function isProgrammaticSeoSlug(slug: string): boolean {
  return getMergedProgrammaticSeoPages().some((p) => p.slug === slug);
}
