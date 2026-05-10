import { BlogPostStatus } from "@prisma/client";
import type { StaticBlogPostRecord } from "@/content/blog-static-posts";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";

/** When live CMS row count exceeds this, `/blog` stays DB-only (no static interleave) for list cost. */
export const BLOG_INDEX_MERGE_DB_MAX = 200;

export type BlogIndexMergeRow = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishAt: Date | null;
  postStatus: typeof BlogPostStatus[keyof typeof BlogPostStatus];
};

function effectiveSortTime(row: BlogIndexMergeRow): number {
  return (row.publishAt ?? row.updatedAt ?? row.createdAt).getTime();
}

export function staticRecordToBlogIndexMergeRow(p: StaticBlogPostRecord): BlogIndexMergeRow {
  const createdAt = new Date(`${p.createdAt}T12:00:00Z`);
  return {
    slug: p.slug.trim(),
    title: p.title,
    excerpt: p.excerpt,
    category: p.category ?? null,
    createdAt,
    updatedAt: createdAt,
    publishAt: null,
    postStatus: BlogPostStatus.PUBLISHED,
  };
}

export function blogStaticLongtailRecordToBlogIndexMergeRow(r: BlogStaticLongtailRecord): BlogIndexMergeRow {
  const createdAt = new Date(`${r.createdAt}T12:00:00Z`);
  const updatedAt = new Date(`${r.updatedAt}T12:00:00Z`);
  return {
    slug: r.slug.trim(),
    title: r.title,
    excerpt: r.excerpt,
    category: r.category?.trim() || null,
    createdAt,
    updatedAt,
    publishAt: createdAt,
    postStatus: BlogPostStatus.PUBLISHED,
  };
}

/**
 * Merge live DB index rows with supplement rows. **DB wins on slug:** supplement entries whose slug
 * exists in `dbRows` are dropped; combined list is sorted by publish/update/create time descending.
 */
export function mergeBlogIndexRows(dbRows: BlogIndexMergeRow[], supplementRows: BlogIndexMergeRow[]): BlogIndexMergeRow[] {
  const dbBySlug = new Map(dbRows.map((row) => [row.slug.trim(), row]));
  const dbSlugs = new Set(dbBySlug.keys());
  const extras = supplementRows.filter((row) => {
    const s = row.slug.trim();
    return Boolean(s) && !dbSlugs.has(s);
  });
  const combined = [...dbRows, ...extras];
  combined.sort((a, b) => effectiveSortTime(b) - effectiveSortTime(a));
  return combined;
}

export function sliceBlogIndexPage(rows: BlogIndexMergeRow[], page: number, pageSize: number): BlogIndexMergeRow[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}
