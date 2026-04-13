import type { BlogPost, Prisma } from "@prisma/client";
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";
import { blogLiveWhere, blogPostIsLive } from "@/lib/blog/blog-visibility";
import {
  getStaticBlogPost,
  listStaticBlogPostsForIndex,
} from "@/lib/blog/static-blog-posts";

/** @deprecated Use `isDatabaseUrlConfigured` from `@/lib/db/safe-database`. */
export const isBlogDatabaseConfigured = isDatabaseUrlConfigured;

async function withBlogFallback<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  return withDatabaseFallback(run, fallback);
}

function isDevMode(): boolean {
  return process.env.NODE_ENV !== "production";
}

export async function canUseStaticBlogFallback(): Promise<boolean> {
  if (!isDevMode()) return false;
  const totalRows = await withBlogFallback(() => prisma.blogPost.count(), 0);
  return totalRows === 0;
}

const indexSelect = {
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  createdAt: true,
  publishAt: true,
  postStatus: true,
} satisfies Prisma.BlogPostSelect;

export type BlogIndexPost = Prisma.BlogPostGetPayload<{ select: typeof indexSelect }>;
type BlogQueryScope = {
  locale?: string;
  sourceLocale?: string;
  careerSlug?: string;
  exam?: string;
  allowSourceLocaleFallback?: boolean;
};

/** Default page size for `/blog` and `/blog/tag/*` lists (bounded memory per request). */
export const BLOG_LIST_PAGE_SIZE = 24;

export async function countPublishedBlogPosts(): Promise<number> {
  const now = new Date();
  return withBlogFallback(
    () => prisma.blogPost.count({ where: blogLiveWhere(now) }),
    0,
  );
}

export async function getPublishedBlogPostsPage(
  page: number,
  pageSize: number,
  scope?: BlogQueryScope,
): Promise<{ posts: BlogIndexPost[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const where = {
    AND: [
      { postStatus: BlogPostStatus.PUBLISHED },
      scope?.locale ? { locale: scope.locale } : {},
      scope?.careerSlug ? { careerSlug: scope.careerSlug } : {},
      scope?.exam ? { exam: scope.exam } : {},
    ],
  } satisfies Prisma.BlogPostWhereInput;
  const [dbPosts, dbTotal] = await Promise.all([
    withBlogFallback(
      () =>
        prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: indexSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }),
      [],
    ),
    withBlogFallback(() => prisma.blogPost.count({ where }), 0),
  ]);
  if (
    scope?.locale &&
    scope.locale !== (scope.sourceLocale ?? "en") &&
    scope.allowSourceLocaleFallback !== false &&
    dbTotal === 0
  ) {
    const sourceLocale = scope.sourceLocale ?? "en";
    const sourceWhere = {
      AND: [
        { postStatus: BlogPostStatus.PUBLISHED },
        { locale: sourceLocale },
        scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
        scope.exam ? { exam: scope.exam } : {},
      ],
    } satisfies Prisma.BlogPostWhereInput;
    const [sourcePosts, sourceTotal] = await Promise.all([
      withBlogFallback(
        () =>
          prisma.blogPost.findMany({
            where: sourceWhere,
            orderBy: { createdAt: "desc" },
            select: indexSelect,
            skip: (safePage - 1) * safeSize,
            take: safeSize,
          }),
        [],
      ),
      withBlogFallback(() => prisma.blogPost.count({ where: sourceWhere }), 0),
    ]);
    return { posts: sourcePosts, total: sourceTotal, page: safePage, pageSize: safeSize };
  }
  const fallbackAllowed = await canUseStaticBlogFallback();
  if (!fallbackAllowed) {
    return { posts: dbPosts, total: dbTotal, page: safePage, pageSize: safeSize };
  }
  const all = listStaticBlogPostsForIndex().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    createdAt: new Date(p.createdAt + "T12:00:00Z"),
    publishAt: null,
    postStatus: BlogPostStatus.PUBLISHED,
  }));
  const total = all.length;
  const posts = all.slice((safePage - 1) * safeSize, (safePage - 1) * safeSize + safeSize);
  if (total === 0) return { posts: dbPosts, total: dbTotal, page: safePage, pageSize: safeSize };
  return { posts, total, page: safePage, pageSize: safeSize };
}

const metaSelect = {
  title: true,
  excerpt: true,
  postStatus: true,
  publishAt: true,
  scheduledAt: true,
  seoTitle: true,
  seoDescription: true,
  createdAt: true,
  internalLinkPlan: true,
  tags: true,
  category: true,
} satisfies Prisma.BlogPostSelect;

export type BlogPostMeta = Prisma.BlogPostGetPayload<{ select: typeof metaSelect }>;

async function resolveScopedBlogPostBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPost | null> {
  const db = await withBlogFallback(() => prisma.blogPost.findUnique({ where: { slug } }), null);
  if (db) {
    const careerMatches = !scope?.careerSlug || !db.careerSlug || db.careerSlug === scope.careerSlug;
    const examMatches = !scope?.exam || db.exam === scope.exam;
    if (!scope?.locale && careerMatches && examMatches) return db;
    if (scope?.locale && db.locale === scope.locale && careerMatches && examMatches) return db;
    if (scope?.locale && db.translationGroupId) {
      const localizedVariant = await withBlogFallback(
        () =>
          prisma.blogPost.findFirst({
            where: {
              AND: [
                { translationGroupId: db.translationGroupId! },
                { locale: scope.locale! },
                scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
                scope.exam ? { exam: scope.exam } : {},
              ],
            },
            orderBy: { updatedAt: "desc" },
          }),
        null,
      );
      if (localizedVariant) return localizedVariant;
    }
    if (careerMatches && examMatches) return db;
  }
  if (!scope?.locale) return null;
  const sourceLocale = scope.sourceLocale ?? "en";
  const byLocalizedSlug = await withBlogFallback(
    () =>
      prisma.blogPost.findFirst({
        where: {
          AND: [
            { slug },
            { locale: scope.locale },
            scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
            scope.exam ? { exam: scope.exam } : {},
          ],
        },
      }),
    null,
  );
  if (byLocalizedSlug) return byLocalizedSlug;
  const canonical = await withBlogFallback(
    () =>
      prisma.blogPost.findFirst({
        where: {
          AND: [
            { slug },
            sourceLocale ? { locale: sourceLocale } : {},
            scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
            scope.exam ? { exam: scope.exam } : {},
          ],
        },
      }),
    null,
  );
  if (!canonical) return null;
  if (!canonical.translationGroupId) return canonical;
  const localizedVariant = await withBlogFallback(
    () =>
      prisma.blogPost.findFirst({
        where: {
          AND: [
            { translationGroupId: canonical.translationGroupId },
            { locale: scope.locale! },
            scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
            scope.exam ? { exam: scope.exam } : {},
          ],
        },
        orderBy: { updatedAt: "desc" },
      }),
    null,
  );
  return localizedVariant ?? canonical;
}

export async function getBlogPostMetaBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPostMeta | null> {
  const db = await resolveScopedBlogPostBySlug(slug, scope);
  if (db) {
    return {
      title: db.title,
      excerpt: db.excerpt,
      postStatus: db.postStatus,
      publishAt: db.publishAt,
      scheduledAt: db.scheduledAt,
      seoTitle: db.seoTitle,
      seoDescription: db.seoDescription,
      createdAt: db.createdAt,
      internalLinkPlan: db.internalLinkPlan,
      tags: db.tags,
      category: db.category,
    };
  }
  if (!(await canUseStaticBlogFallback())) return null;
  const s = getStaticBlogPost(slug);
  if (!s) return null;
  return {
    title: s.title,
    excerpt: s.excerpt,
    postStatus: BlogPostStatus.PUBLISHED,
    publishAt: null,
    scheduledAt: null,
    seoTitle: null,
    seoDescription: null,
    createdAt: new Date(s.createdAt + "T12:00:00Z"),
    internalLinkPlan: null,
    tags: [],
    category: s.category ?? null,
  };
}

/** True when slug should receive public metadata (SEO) and indexing. */
export async function isBlogPostMetaVisible(slug: string, scope?: BlogQueryScope): Promise<boolean> {
  const meta = await getBlogPostMetaBySlug(slug, scope);
  if (!meta) return false;
  if (
    meta.postStatus === BlogPostStatus.DRAFT ||
    meta.postStatus === BlogPostStatus.NEEDS_REVIEW ||
    meta.postStatus === BlogPostStatus.APPROVED ||
    meta.postStatus === BlogPostStatus.FAILED
  ) {
    return false;
  }
  return blogPostIsLive({ postStatus: meta.postStatus, publishAt: meta.publishAt, scheduledAt: meta.scheduledAt });
}

export async function getPublishedBlogPostBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPost | null> {
  const now = new Date();
  const row = await resolveScopedBlogPostBySlug(slug, scope);
  if (!row) {
    if (!(await canUseStaticBlogFallback())) return null;
    return null;
  }
  if (row.postStatus !== BlogPostStatus.PUBLISHED) return null;
  if (
    scope?.careerSlug &&
    row.careerSlug &&
    row.careerSlug !== scope.careerSlug
  ) {
    return null;
  }
  if (!blogPostIsLive({ postStatus: row.postStatus, publishAt: row.publishAt, scheduledAt: row.scheduledAt }, now)) return null;
  return row;
}

export async function countPublishedPostsWithTag(tag: string): Promise<number> {
  const now = new Date();
  return withBlogFallback(
    () =>
      prisma.blogPost.count({
        where: { AND: [blogLiveWhere(now), { tags: { has: tag } }] },
      }),
    0,
  );
}

const tagListSelect = {
  slug: true,
  title: true,
  excerpt: true,
  createdAt: true,
  publishAt: true,
} satisfies Prisma.BlogPostSelect;

export type BlogTagListPost = Prisma.BlogPostGetPayload<{ select: typeof tagListSelect }>;

export async function getPublishedBlogPostsByTagPage(
  tag: string,
  page: number,
  pageSize: number,
): Promise<{ posts: BlogTagListPost[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const now = new Date();
  const where = { AND: [blogLiveWhere(now), { tags: { has: tag } }] };
  const [posts, total] = await Promise.all([
    withBlogFallback(
      () =>
        prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: tagListSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }),
      [],
    ),
    withBlogFallback(() => prisma.blogPost.count({ where }), 0),
  ]);
  return { posts, total, page: safePage, pageSize: safeSize };
}

/** Sitemap helpers: hard cap per sitemap spec (~50k URLs); split indexes if you exceed this. */
const SITEMAP_BLOG_ROW_CAP = 50_000;

export async function getSitemapPublishedBlogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const now = new Date();
  return withBlogFallback(
    () =>
      prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        select: { slug: true, updatedAt: true },
        orderBy: { slug: "asc" },
        take: SITEMAP_BLOG_ROW_CAP,
      }),
    [],
  );
}

export async function getSitemapBlogTagRows(): Promise<{ tags: string[] }[]> {
  const now = new Date();
  return withBlogFallback(
    () =>
      prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        select: { tags: true },
        orderBy: { slug: "asc" },
        take: SITEMAP_BLOG_ROW_CAP,
      }),
    [],
  );
}
