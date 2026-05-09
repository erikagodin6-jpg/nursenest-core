/**
 * Hybrid blog (DB primary + static longtail supplement).
 *
 * **Slug collision (public):** any live {@link blogLiveWhere} DB row wins; matching static longtail
 * slugs are excluded from merge, tag/category hubs, and sitemap supplements.
 *
 * **Index pagination:** when `dbTotal + supplementCount` exceeds {@link BLOG_HYBRID_FULL_MERGE_MAX},
 * list routes stay **DB-paginated only** (supplement still serves `/blog/[slug]` + sitemap). See report.
 */
import type { BlogPostStatus } from "@prisma/client";
import { BlogPostStatus as BlogPostStatusEnum } from "@prisma/client";
import type { BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";
import type { BlogPostPublicListSource } from "@/lib/blog/blog-static-longtail-types";

export const BLOG_HYBRID_FULL_MERGE_MAX = 800;

/** Mirrors `BlogIndexPost` list select; keeps this module free of `safe-blog-queries` import cycles. */
export type BlogIndexPostWithSource = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt: Date;
  publishAt: Date | null;
  postStatus: BlogPostStatus;
  source: BlogPostPublicListSource;
};

export type BlogTagListPostWithSource = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  createdAt: Date;
  publishAt: Date | null;
  source: BlogPostPublicListSource;
};

function compareIndex(a: { createdAt: Date; slug: string }, b: { createdAt: Date; slug: string }): number {
  const dt = b.createdAt.getTime() - a.createdAt.getTime();
  if (dt !== 0) return dt;
  return a.slug.localeCompare(b.slug);
}

export function longtailToIndexPost(r: BlogStaticLongtailRecord): BlogIndexPostWithSource {
  const createdAt = new Date(`${r.updatedAt}T12:00:00Z`);
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    createdAt,
    publishAt: null,
    postStatus: BlogPostStatusEnum.PUBLISHED,
    source: "static",
  };
}

export function longtailToTagListPost(r: BlogStaticLongtailRecord): BlogTagListPostWithSource {
  const createdAt = new Date(`${r.updatedAt}T12:00:00Z`);
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category ?? null,
    createdAt,
    publishAt: null,
    source: "static",
  };
}

export function filterLongtailByLiveDbSlugs(
  records: BlogStaticLongtailRecord[],
  liveSlugs: ReadonlySet<string>,
): BlogStaticLongtailRecord[] {
  return records.filter((r) => r.slug && !liveSlugs.has(r.slug));
}

export function mergeBlogIndexPage(args: {
  dbPosts: BlogIndexPostWithSource[];
  dbTotal: number;
  supplement: BlogStaticLongtailRecord[];
  page: number;
  pageSize: number;
}): { posts: BlogIndexPostWithSource[]; total: number } {
  const { dbPosts, dbTotal, supplement, page, pageSize } = args;
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safeSize;
  const suppPosts = supplement.map(longtailToIndexPost);
  const merged = [...dbPosts, ...suppPosts].sort(compareIndex);
  const total = dbTotal + supplement.length;
  const slice = merged.slice(skip, skip + safeSize);
  return { posts: slice, total };
}

export function mergeBlogTagOrCategoryPage(args: {
  dbPosts: BlogTagListPostWithSource[];
  dbTotal: number;
  supplement: BlogStaticLongtailRecord[];
  page: number;
  pageSize: number;
}): { posts: BlogTagListPostWithSource[]; total: number } {
  const { dbPosts, dbTotal, supplement, page, pageSize } = args;
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safeSize;
  const suppPosts = supplement.map(longtailToTagListPost);
  const merged = [...dbPosts, ...suppPosts].sort(compareIndex);
  const total = dbTotal + supplement.length;
  const slice = merged.slice(skip, skip + safeSize);
  return { posts: slice, total };
}

/** When false, callers should use DB-only pagination (supplement still available on slug + sitemap). */
export function shouldFullMergeHybridLists(dbTotal: number, supplementLen: number): boolean {
  return dbTotal + supplementLen <= BLOG_HYBRID_FULL_MERGE_MAX;
}

export type BlogSitemapSlugRowInput = {
  slug: string;
  careerSlug: string | null;
  updatedAt: Date;
};

export function mergeSitemapSlugRows(
  dbRows: BlogSitemapSlugRowInput[],
  supplement: BlogStaticLongtailRecord[],
): BlogSitemapSlugRowInput[] {
  const dbSlugs = new Set(dbRows.map((r) => r.slug.trim()).filter(Boolean));
  const extra = supplement
    .filter((s) => s.slug && !dbSlugs.has(s.slug))
    .map((s) => ({
      slug: s.slug.trim(),
      careerSlug: null as string | null,
      updatedAt: new Date(`${s.updatedAt}T12:00:00Z`),
    }));
  const merged = [...dbRows, ...extra];
  merged.sort((a, b) => a.slug.localeCompare(b.slug));
  return merged;
}
