import type { BlogPost, Prisma } from "@prisma/client";
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { blogLiveWhere, blogPostIsLive } from "@/lib/blog/blog-visibility";
import {
  getStaticBlogPost,
  listStaticBlogPostsForIndex,
  publishedBlogPostFromStaticRecord,
} from "@/lib/blog/static-blog-posts";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";

/** @deprecated Use `isDatabaseUrlConfigured` from `@/lib/db/safe-database`. */
export const isBlogDatabaseConfigured = isDatabaseUrlConfigured;

const BLOG_PUBLIC_QUERY_TIMEOUT_MS = 1000;
const BLOG_SITEMAP_QUERY_TIMEOUT_MS = 800;

async function withBlogTimeoutFallback<T>(
  run: () => Promise<T>,
  fallback: T,
  label: string,
  timeoutMs: number = BLOG_PUBLIC_QUERY_TIMEOUT_MS,
): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, timeoutMs, {
    scope: "blog",
    label,
  });
}

const MARKETING_BUILD_PHASE = "phase-production-build";

/**
 * Skip Prisma for public blog reads during `next build` (mirrors homepage optional-DB guard).
 * Uses bundled static posts only. Set `MARKETING_BLOG_SKIP_DB_FOR_BUILD=false` when CI must
 * compile blog HTML from Postgres.
 */
function shouldSkipBlogDbForProductionBuild(): boolean {
  const raw = process.env.MARKETING_BLOG_SKIP_DB_FOR_BUILD?.trim().toLowerCase();
  if (raw === "true") return true;
  if (raw === "false") return false;
  return process.env.NEXT_PHASE === MARKETING_BUILD_PHASE;
}

function blogIndexPostsFromStaticCorpusOnly(
  safePage: number,
  safeSize: number,
): { posts: BlogIndexPost[]; total: number; page: number; pageSize: number } {
  const all = listStaticBlogPostsForIndex().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    createdAt: new Date(`${p.createdAt}T12:00:00Z`),
    publishAt: null,
    postStatus: BlogPostStatus.PUBLISHED,
  }));
  const total = all.length;
  const posts = all.slice((safePage - 1) * safeSize, (safePage - 1) * safeSize + safeSize);
  return { posts, total, page: safePage, pageSize: safeSize };
}

export async function canUseStaticBlogFallback(): Promise<boolean> {
  if (listStaticBlogPostsForIndex().length === 0) return false;
  if (shouldSkipBlogDbForProductionBuild()) return true;
  const totalRows = await withBlogTimeoutFallback(() => prisma.blogPost.count(), 0, "blog_static_fallback_probe");
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
  if (shouldSkipBlogDbForProductionBuild()) {
    return listStaticBlogPostsForIndex().length;
  }
  const now = new Date();
  return withBlogTimeoutFallback(
    () => prisma.blogPost.count({ where: blogLiveWhere(now) }),
    0,
    "blog_posts_published_count",
  );
}

export async function getPublishedBlogPostsPage(
  page: number,
  pageSize: number,
  scope?: BlogQueryScope,
  options?: { includeTotal?: boolean },
): Promise<{ posts: BlogIndexPost[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(pageSize)));
  if (shouldSkipBlogDbForProductionBuild()) {
    return blogIndexPostsFromStaticCorpusOnly(safePage, safeSize);
  }
  const includeTotal = options?.includeTotal !== false;
  const now = new Date();
  /** Align with tag list / sitemap / {@link blogPostIsLive} — include due SCHEDULED rows, not only PUBLISHED. */
  const where = {
    AND: [
      blogLiveWhere(now),
      scope?.locale ? { locale: scope.locale } : {},
      scope?.careerSlug ? { careerSlug: scope.careerSlug } : {},
      scope?.exam ? { exam: scope.exam } : {},
    ],
  } satisfies Prisma.BlogPostWhereInput;
  const [dbPosts, dbTotal] = await Promise.all([
    withBlogTimeoutFallback(
      () =>
        prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: indexSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }),
      [],
      "blog_posts_page.posts",
    ),
    includeTotal
      ? withBlogTimeoutFallback(() => prisma.blogPost.count({ where }), 0, "blog_posts_page.total")
      : Promise.resolve(0),
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
        blogLiveWhere(now),
        { locale: sourceLocale },
        scope.careerSlug ? { careerSlug: scope.careerSlug } : {},
        scope.exam ? { exam: scope.exam } : {},
      ],
    } satisfies Prisma.BlogPostWhereInput;
    const [sourcePosts, sourceTotal] = await Promise.all([
      withBlogTimeoutFallback(
        () =>
          prisma.blogPost.findMany({
            where: sourceWhere,
            orderBy: { createdAt: "desc" },
            select: indexSelect,
            skip: (safePage - 1) * safeSize,
            take: safeSize,
          }),
        [],
        "blog_posts_page.source_posts",
      ),
      includeTotal
        ? withBlogTimeoutFallback(() => prisma.blogPost.count({ where: sourceWhere }), 0, "blog_posts_page.source_total")
        : Promise.resolve(0),
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
  exam: true,
  countryTarget: true,
  coverImage: true,
} satisfies Prisma.BlogPostSelect;

export type BlogPostMeta = Prisma.BlogPostGetPayload<{ select: typeof metaSelect }>;

async function resolveScopedBlogPostBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPost | null> {
  const db = await withBlogTimeoutFallback(() => prisma.blogPost.findUnique({ where: { slug } }), null, "blog_post.by_slug");
  if (db) {
    const careerMatches = !scope?.careerSlug || !db.careerSlug || db.careerSlug === scope.careerSlug;
    const examMatches = !scope?.exam || db.exam === scope.exam;
    if (!scope?.locale && careerMatches && examMatches) return db;
    if (scope?.locale && db.locale === scope.locale && careerMatches && examMatches) return db;
    if (scope?.locale && db.translationGroupId) {
      const localizedVariant = await withBlogTimeoutFallback(
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
        "blog_post.localized_variant",
      );
      if (localizedVariant) return localizedVariant;
    }
    if (careerMatches && examMatches) return db;
  }
  if (!scope?.locale) return null;
  const sourceLocale = scope.sourceLocale ?? "en";
  const byLocalizedSlug = await withBlogTimeoutFallback(
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
    "blog_post.by_localized_slug",
  );
  if (byLocalizedSlug) return byLocalizedSlug;
  const canonical = await withBlogTimeoutFallback(
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
    "blog_post.canonical",
  );
  if (!canonical) return null;
  if (!canonical.translationGroupId) return canonical;
  const localizedVariant = await withBlogTimeoutFallback(
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
    "blog_post.canonical_localized_variant",
  );
  return localizedVariant ?? canonical;
}

export async function getBlogPostMetaBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPostMeta | null> {
  if (shouldSkipBlogDbForProductionBuild()) {
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
      createdAt: new Date(`${s.createdAt}T12:00:00Z`),
      internalLinkPlan: null,
      tags: s.tags ?? [],
      category: s.category ?? null,
      exam: null,
      countryTarget: null,
      coverImage: null,
    };
  }
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
      exam: db.exam,
      countryTarget: db.countryTarget,
      coverImage: db.coverImage,
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
    tags: s.tags ?? [],
    category: s.category ?? null,
    exam: null,
    countryTarget: null,
    coverImage: null,
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
  if (shouldSkipBlogDbForProductionBuild()) {
    const s = getStaticBlogPost(slug);
    if (!s) return null;
    return publishedBlogPostFromStaticRecord(s);
  }
  const row = await resolveScopedBlogPostBySlug(slug, scope);
  if (!row) {
    if (!(await canUseStaticBlogFallback())) return null;
    const s = getStaticBlogPost(slug);
    if (!s) return null;
    return publishedBlogPostFromStaticRecord(s);
  }
  if (
    scope?.careerSlug &&
    row.careerSlug &&
    row.careerSlug !== scope.careerSlug
  ) {
    return null;
  }
  /** Align with {@link blogLiveWhere} on index/tag routes: live SCHEDULED rows, not only PUBLISHED. */
  if (!blogPostIsLive({ postStatus: row.postStatus, publishAt: row.publishAt, scheduledAt: row.scheduledAt }, now)) return null;
  return row;
}

export async function countPublishedPostsWithTag(tag: string): Promise<number> {
  if (shouldSkipBlogDbForProductionBuild()) {
    return listStaticBlogPostsForIndex().filter((p) => (p.tags ?? []).includes(tag)).length;
  }
  const now = new Date();
  return withBlogTimeoutFallback(
    () =>
      prisma.blogPost.count({
        where: { AND: [blogLiveWhere(now), { tags: { has: tag } }] },
      }),
    0,
    "blog_posts_by_tag.count",
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
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(pageSize)));
  if (shouldSkipBlogDbForProductionBuild()) {
    const all = listStaticBlogPostsForIndex()
      .filter((p) => (p.tags ?? []).includes(tag))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        createdAt: new Date(`${p.createdAt}T12:00:00Z`),
        publishAt: null as Date | null,
      }));
    const total = all.length;
    const posts = all.slice((safePage - 1) * safeSize, (safePage - 1) * safeSize + safeSize);
    return { posts, total, page: safePage, pageSize: safeSize };
  }
  const now = new Date();
  const where = { AND: [blogLiveWhere(now), { tags: { has: tag } }] };
  const [posts, total] = await Promise.all([
    withBlogTimeoutFallback(
      () =>
        prisma.blogPost.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: tagListSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }),
      [],
      "blog_posts_by_tag.posts",
    ),
    withBlogTimeoutFallback(() => prisma.blogPost.count({ where }), 0, "blog_posts_by_tag.total"),
  ]);
  return { posts, total, page: safePage, pageSize: safeSize };
}

/** Sitemap helpers: hard cap per sitemap spec (~50k URLs); split indexes if you exceed this. */
const SITEMAP_BLOG_ROW_CAP = 50_000;

export async function getSitemapPublishedBlogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const now = new Date();
  return withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        select: { slug: true, updatedAt: true },
        orderBy: { slug: "asc" },
        take: SITEMAP_BLOG_ROW_CAP,
      }),
    [],
    "blog_sitemap.slugs",
    BLOG_SITEMAP_QUERY_TIMEOUT_MS,
  );
}

export async function getSitemapBlogTagRows(): Promise<{ tags: string[] }[]> {
  const now = new Date();
  return withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where: blogLiveWhere(now),
        select: { tags: true },
        orderBy: { slug: "asc" },
        take: SITEMAP_BLOG_ROW_CAP,
      }),
    [],
    "blog_sitemap.tags",
    BLOG_SITEMAP_QUERY_TIMEOUT_MS,
  );
}
