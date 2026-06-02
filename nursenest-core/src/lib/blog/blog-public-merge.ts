/**
 * Public blog index merge: Postgres (CMS) is primary; bundled static posts fill gaps.
 *
 * Merge rules (deterministic):
 * - Slug dedupe: any live CMS row for a slug wins; static entries with the same slug are omitted.
 * - Ordering: descending by primary timestamp (CMS `updatedAt`, static corpus `createdAt` at noon UTC),
 *   then ascending `slug` as tie-breaker so order is stable across runs.
 * - In-memory merge is used only when the live CMS row count for the current filter is at most
 *   {@link BLOG_INDEX_MERGE_DB_MAX}; above that, the index stays DB-paginated only (static remains
 *   reachable at `/blog/[slug]` when the CMS has no live row for that slug).
 */
import type { BlogPostStatus } from "@prisma/client";
import { BlogPostStatus as BlogPostStatusValue } from "@prisma/client";
import type { StaticBlogPostRecord } from "@/content/blog-static-posts";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";
import { parseBlogPostCreatedAt } from "@/lib/blog/safe-blog-post-date";

/** Upper bound for full in-memory merge of CMS + static index rows (list queries stay bounded). */
export const BLOG_INDEX_MERGE_DB_MAX = 5000;

export type BlogIndexMergeRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt: Date;
  publishAt: Date | null;
  postStatus: BlogPostStatus;
  updatedAt: Date;
};

export function staticRecordToBlogIndexMergeRow(s: StaticBlogPostRecord): BlogIndexMergeRow {
  const createdAt = parseBlogPostCreatedAt(s.createdAt);
  return {
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt,
    category: s.category ?? null,
    createdAt,
    publishAt: null,
    postStatus: BlogPostStatusValue.PUBLISHED,
    updatedAt: createdAt,
  };
}

export function blogStaticLongtailRecordToBlogIndexMergeRow(r: BlogStaticLongtailRecord): BlogIndexMergeRow {
  const createdAt = parseBlogPostCreatedAt(r.createdAt);
  const updatedAt = parseBlogPostCreatedAt(r.updatedAt || r.createdAt);
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category ?? null,
    createdAt,
    publishAt: null,
    postStatus: BlogPostStatusValue.PUBLISHED,
    updatedAt,
  };
}

export function blogIndexPrimarySortMs(p: BlogIndexMergeRow): number {
  return Math.max(p.updatedAt.getTime(), p.publishAt?.getTime() ?? 0, p.createdAt.getTime());
}

export function compareBlogIndexMergeRowsDesc(a: BlogIndexMergeRow, b: BlogIndexMergeRow): number {
  const tb = blogIndexPrimarySortMs(b);
  const ta = blogIndexPrimarySortMs(a);
  if (tb !== ta) return tb - ta;
  return a.slug.localeCompare(b.slug);
}

/**
 * Merge live CMS rows with supplement (bundled static + long-tail) rows.
 * **DB wins on slug:** supplement entries whose slug exists on any CMS row are dropped; result is sorted
 * for stable public `/blog` ordering.
 */
export function mergeBlogIndexRows(dbRows: BlogIndexMergeRow[], supplementRows: BlogIndexMergeRow[]): BlogIndexMergeRow[] {
  const dbSlugs = new Set(dbRows.map((row) => row.slug.trim()).filter(Boolean));
  const extras = supplementRows.filter((row) => {
    const s = row.slug.trim();
    return Boolean(s) && !dbSlugs.has(s);
  });
  const combined = [...dbRows, ...extras];
  combined.sort(compareBlogIndexMergeRowsDesc);
  return combined;
}

export function sliceBlogIndexPage(rows: BlogIndexMergeRow[], page: number, pageSize: number): BlogIndexMergeRow[] {
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safeSize;
  return rows.slice(start, start + safeSize);
}
