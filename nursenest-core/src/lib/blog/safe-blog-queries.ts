import type { BlogPost, Prisma } from "@prisma/client";
import { BlogPostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { blogLiveWhere, blogPostIsLive, isBlogPostMarketingMetaVisible } from "@/lib/blog/blog-visibility";
import {
  getStaticBlogPost,
  listStaticBlogPostsForIndex,
  publishedBlogPostFromStaticRecord,
} from "@/lib/blog/static-blog-posts";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";

/** @deprecated Use `isDatabaseUrlConfigured` from `@/lib/db/safe-database`. */
export const isBlogDatabaseConfigured = isDatabaseUrlConfigured;

/**
 * Cold-start / pooled Prisma can be slow; empty `/blog` after a transient timeout is worse than
 * waiting longer on list/detail reads (bounded by `take` / pagination).
 */
const BLOG_PUBLIC_QUERY_TIMEOUT_MS = 12_000;
/** Batched slug walk for sitemap — one outer budget for many small `findMany` pages. */
const BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS = 35_000;

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

/**
 * True when the bundled static corpus may back `/blog` lists and slug metadata because Postgres has
 * **no live posts** (same {@link blogLiveWhere} contract as public lists). On probe timeout/error we
 * return false so a slow DB cannot be mistaken for an empty library (which would hide hundreds of rows).
 */
export async function canUseStaticBlogFallback(): Promise<boolean> {
  if (listStaticBlogPostsForIndex().length === 0) return false;
  if (shouldSkipBlogDbForProductionBuild()) return true;
  if (!isDatabaseUrlConfigured()) return true;
  const now = new Date();
  const probe = await withBlogTimeoutFallback(
    async () => ({ ok: true as const, liveCount: await prisma.blogPost.count({ where: blogLiveWhere(now) }) }),
    { ok: false as const },
    "blog_static_fallback_probe",
    BLOG_PUBLIC_QUERY_TIMEOUT_MS,
  );
  if (!probe.ok) return false;
  return probe.liveCount === 0;
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

/**
 * Default page size for `/blog` and `/blog/tag/*` lists.
 * Uses {@link API_LIST_PAGE_SIZE_HARD_MAX} as ceiling (defense-in-depth for list APIs).
 */
export const BLOG_LIST_PAGE_SIZE = 50;

/** Opt-in: set `BLOG_INDEX_DIAGNOSTICS=1` in production to log index health (counts + slugs) on each `/blog` data load. */
async function logBlogIndexDiagnosticsIfEnabled(args: {
  posts: BlogIndexPost[];
  totalMatchingLiveFilter: number;
  page: number;
  pageSize: number;
  usedStaticFallback: boolean;
  scope?: BlogQueryScope;
}): Promise<void> {
  if (process.env.BLOG_INDEX_DIAGNOSTICS !== "1") return;
  const statusesBreakdownPageSlice = args.posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.postStatus] = (acc[p.postStatus] ?? 0) + 1;
    return acc;
  }, {});
  type StatusAgg = { postStatus: BlogPostStatus; _count: { _all: number } };
  const dbAllStatuses = await withBlogTimeoutFallback<StatusAgg[]>(
    () => prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
    [],
    "blog_index_diag_groupby_all",
  );
  const statusesBreakdownDbAll = Object.fromEntries(dbAllStatuses.map((r) => [r.postStatus, r._count._all])) as Record<
    string,
    number
  >;
  const liveRowCount = await withBlogTimeoutFallback(
    () => prisma.blogPost.count({ where: blogLiveWhere(new Date()) }),
    -1,
    "blog_index_diag_live_total",
  );
  safeServerLog("blog", "BLOG_INDEX_DIAGNOSTICS", {
    totalPostsReturned: args.posts.length,
    totalMatchingLiveFilter: args.totalMatchingLiveFilter,
    liveRowCountUnderBlogLiveWhere: liveRowCount,
    statusesBreakdownPageSlice,
    statusesBreakdownDbAll,
    first20Slugs: args.posts.slice(0, 20).map((p) => p.slug),
    page: args.page,
    pageSize: args.pageSize,
    usedStaticFallback: args.usedStaticFallback ? "1" : "0",
    scoped: Boolean(args.scope?.locale || args.scope?.careerSlug || args.scope?.exam),
  });
}

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
    const built = blogIndexPostsFromStaticCorpusOnly(safePage, safeSize);
    await logBlogIndexDiagnosticsIfEnabled({
      posts: built.posts,
      totalMatchingLiveFilter: built.total,
      page: built.page,
      pageSize: built.pageSize,
      usedStaticFallback: true,
      scope,
    });
    return built;
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
          /** Newest activity first; slug tie-breaker keeps order stable (e.g. pathophysiology series). */
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
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
            orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
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
    if (process.env.BLOG_INDEX_COUNTS === "1") {
      safeServerLog("seo", "BLOG_INDEX_COUNTS", {
        scope: "getPublishedBlogPostsPage_locale_fallback",
        page: String(safePage),
        pageSize: String(safeSize),
        returnedRows: String(sourcePosts.length),
        totalCount: String(sourceTotal),
        firstTenSlugs: sourcePosts
          .slice(0, 10)
          .map((p) => p.slug)
          .join(","),
        usedStaticFallback: "0",
      });
    }
    await logBlogIndexDiagnosticsIfEnabled({
      posts: sourcePosts,
      totalMatchingLiveFilter: sourceTotal,
      page: safePage,
      pageSize: safeSize,
      usedStaticFallback: false,
      scope,
    });
    return { posts: sourcePosts, total: sourceTotal, page: safePage, pageSize: safeSize };
  }
  /** Never replace a successful DB page with static when this request already saw live inventory. */
  const fallbackAllowed = await canUseStaticBlogFallback();
  if (!fallbackAllowed || dbTotal > 0 || dbPosts.length > 0) {
    if (process.env.BLOG_INDEX_COUNTS === "1") {
      safeServerLog("seo", "BLOG_INDEX_COUNTS", {
        scope: "getPublishedBlogPostsPage",
        page: String(safePage),
        pageSize: String(safeSize),
        returnedRows: String(dbPosts.length),
        totalCount: String(dbTotal),
        firstTenSlugs: dbPosts
          .slice(0, 10)
          .map((p) => p.slug)
          .join(","),
        usedStaticFallback: "0",
      });
    }
    await logBlogIndexDiagnosticsIfEnabled({
      posts: dbPosts,
      totalMatchingLiveFilter: dbTotal,
      page: safePage,
      pageSize: safeSize,
      usedStaticFallback: false,
      scope,
    });
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
  if (process.env.BLOG_INDEX_COUNTS === "1") {
    safeServerLog("seo", "BLOG_INDEX_COUNTS", {
      scope: "getPublishedBlogPostsPage",
      page: String(safePage),
      pageSize: String(safeSize),
      returnedRows: String(posts.length),
      totalCount: String(total),
      firstTenSlugs: posts
        .slice(0, 10)
        .map((p) => p.slug)
        .join(","),
      usedStaticFallback: "1",
    });
  }
  await logBlogIndexDiagnosticsIfEnabled({
    posts,
    totalMatchingLiveFilter: total,
    page: safePage,
    pageSize: safeSize,
    usedStaticFallback: true,
    scope,
  });
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
  return isBlogPostMarketingMetaVisible({
    postStatus: meta.postStatus,
    publishAt: meta.publishAt,
    scheduledAt: meta.scheduledAt,
  });
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
          orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
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
const SITEMAP_BLOG_SLUG_PAGE_SIZE = 2_000;

export async function getSitemapPublishedBlogSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  const now = new Date();
  return withBlogTimeoutFallback(
    async () => {
      const out: { slug: string; updatedAt: Date }[] = [];
      let cursor: { slug: string } | undefined;
      for (;;) {
        const page = await prisma.blogPost.findMany({
          where: blogLiveWhere(now),
          select: { slug: true, updatedAt: true },
          orderBy: { slug: "asc" },
          take: SITEMAP_BLOG_SLUG_PAGE_SIZE,
          ...(cursor ? { cursor, skip: 1 } : {}),
        });
        if (page.length === 0) break;
        for (const r of page) {
          const s = r.slug?.trim();
          if (s) out.push({ slug: s, updatedAt: r.updatedAt });
        }
        if (out.length >= SITEMAP_BLOG_ROW_CAP) break;
        if (page.length < SITEMAP_BLOG_SLUG_PAGE_SIZE) break;
        const last = page[page.length - 1];
        if (!last?.slug) break;
        cursor = { slug: last.slug };
      }
      return out.slice(0, SITEMAP_BLOG_ROW_CAP);
    },
    [],
    "blog_sitemap.slugs_batched",
    BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS,
  );
}

export async function getSitemapBlogTagRows(): Promise<{ tags: string[] }[]> {
  const now = new Date();
  return withBlogTimeoutFallback(
    async () => {
      const out: { tags: string[] }[] = [];
      let cursor: { slug: string } | undefined;
      for (;;) {
        const page = await prisma.blogPost.findMany({
          where: blogLiveWhere(now),
          select: { tags: true, slug: true },
          orderBy: { slug: "asc" },
          take: SITEMAP_BLOG_SLUG_PAGE_SIZE,
          ...(cursor ? { cursor, skip: 1 } : {}),
        });
        if (page.length === 0) break;
        out.push(...page.map((r) => ({ tags: r.tags })));
        if (out.length >= SITEMAP_BLOG_ROW_CAP) break;
        if (page.length < SITEMAP_BLOG_SLUG_PAGE_SIZE) break;
        const last = page[page.length - 1];
        if (!last?.slug) break;
        cursor = { slug: last.slug };
      }
      return out.slice(0, SITEMAP_BLOG_ROW_CAP);
    },
    [],
    "blog_sitemap.tags_batched",
    BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS,
  );
}
