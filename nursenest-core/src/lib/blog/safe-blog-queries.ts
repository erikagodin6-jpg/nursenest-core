import type { BlogPost, Prisma } from "@prisma/client";
import { BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  isDatabaseUrlConfigured,
  withDatabaseFallbackTimeout,
  withDatabaseFallbackTimeoutOrThrow,
} from "@/lib/db/safe-database";
import { logRouteDataPipeline } from "@/lib/observability/route-data-pipeline-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import {
  blogLiveWhere,
  blogPostIsLive,
  buildBlogPublicListWhere,
  isBlogPostMarketingMetaVisible,
  isBlogPublicE2eTestArtifact,
} from "@/lib/blog/blog-visibility";
import { describeCanonicalBlogNotLiveReason } from "@/lib/blog/blog-public-pipeline-trace";
import {
  BLOG_INDEX_MERGE_DB_MAX,
  blogStaticLongtailRecordToBlogIndexMergeRow,
  mergeBlogIndexRows,
  sliceBlogIndexPage,
  staticRecordToBlogIndexMergeRow,
  type BlogIndexMergeRow,
} from "@/lib/blog/blog-public-merge";
import { getBlogStaticLongtailRecord, listBlogStaticLongtailRecords } from "@/lib/blog/blog-static-longtail-load";
import type { BlogPostPublicListSource, BlogStaticLongtailRecord } from "@/lib/blog/blog-static-longtail-types";
import {
  allSupplementSlugsForOverlapQuery,
  buildSupplementBlogIndexRowsExcludingLiveSlugs,
  supplementBlogIndexMergeRowsForCategory,
  supplementBlogIndexMergeRowsForTag,
  supplementSlugsForCategoryOverlapQuery,
  supplementSlugsForTagOverlapQuery,
} from "@/lib/blog/blog-static-supplement";
import {
  getStaticBlogPost,
  listStaticBlogPostsForIndex,
  publishedBlogPostFromLongtailRecord,
  publishedBlogPostFromStaticRecord,
} from "@/lib/blog/static-blog-posts";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";
import { shouldSkipDbBackedSitemapUrlsForBuild } from "@/lib/seo/sitemap-build-skip";
import {
  blogPublicDbReadAttempt,
  type BlogPublicDbReadAttemptResult,
} from "@/lib/blog/blog-public-db-read-attempt";

/** @deprecated Use `isDatabaseUrlConfigured` from `@/lib/db/safe-database`. */
export const isBlogDatabaseConfigured = isDatabaseUrlConfigured;

/**
 * Cold-start / pooled Prisma can be slow; empty `/blog` after a transient timeout is worse than
 * waiting longer on list/detail reads (bounded by `take` / pagination).
 *
 * **TEMP trace:** `BLOG_PUBLIC_SKIP_TRACE=1` logs `[BLOG_PUBLIC_SKIP]` when a slug resolves in DB but the
 * public body loader (`getPublishedBlogPostBySlug`) returns null (career mismatch, not “live”, or scope miss).
 */
const BLOG_PUBLIC_QUERY_TIMEOUT_MS = 12_000;
/** Second pass when first list+count both empty — avoids caching/static fallback on cold Prisma timeouts. */
const BLOG_INDEX_EMPTY_RETRY_TIMEOUT_MS = 24_000;
/** Batched slug walk for sitemap — one outer budget for many small `findMany` pages. */
const BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS = 35_000;
const BLOG_PUBLIC_DB_CONCURRENCY = Math.min(
  8,
  Math.max(1, Number(process.env.BLOG_PUBLIC_DB_CONCURRENCY ?? "4") || 4),
);

type BlogDbQueueItem<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

let activeBlogDbReads = 0;
const blogDbReadQueue: BlogDbQueueItem<unknown>[] = [];

function drainBlogDbReadQueue(): void {
  while (activeBlogDbReads < BLOG_PUBLIC_DB_CONCURRENCY) {
    const next = blogDbReadQueue.shift();
    if (!next) return;
    activeBlogDbReads += 1;
    void next
      .run()
      .then(next.resolve, next.reject)
      .finally(() => {
        activeBlogDbReads -= 1;
        drainBlogDbReadQueue();
      });
  }
}

function runBlogDbRead<T>(run: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    blogDbReadQueue.push({
      run,
      resolve: resolve as (value: unknown) => void,
      reject,
    });
    drainBlogDbReadQueue();
  });
}

async function withBlogTimeoutFallback<T>(
  run: () => Promise<T>,
  fallback: T,
  label: string,
  timeoutMs: number = BLOG_PUBLIC_QUERY_TIMEOUT_MS,
): Promise<T> {
  return withDatabaseFallbackTimeout(() => runBlogDbRead(run), fallback, timeoutMs, {
    scope: "blog",
    label,
  });
}

function shouldRetryBlogIndexAfterTransientEmpty(): boolean {
  return isDatabaseUrlConfigured() && !shouldSkipBlogDbForProductionBuild() && !isRuntimeSafeMode();
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

function shouldUseStaticBlogIndexOnDbError(): boolean {
  return process.env.BLOG_INDEX_STATIC_ON_DB_ERROR?.trim() !== "0";
}

function blogIndexPostsFromStaticCorpusOnly(
  safePage: number,
  safeSize: number,
): { posts: BlogIndexPostWithSource[]; total: number; page: number; pageSize: number } {
  const supplement = buildSupplementBlogIndexRowsExcludingLiveSlugs(new Set());
  const merged = mergeBlogIndexRows([], supplement);
  const sliced = sliceBlogIndexPage(merged, safePage, safeSize);
  const posts = sliced.map((r) => mergeRowToBlogIndexPost(r, "static"));
  return { posts, total: merged.length, page: safePage, pageSize: safeSize };
}

type BlogStaticFallbackProbeResult =
  | { kind: "use_static" }
  | { kind: "deny_no_static_corpus" }
  | { kind: "deny_has_live_posts"; liveCount: number }
  | { kind: "deny_probe_failed" };

/**
 * Resolves whether the bundled static blog corpus may be used for **public** reads (index, meta, slug body).
 * Failed live-count probes **deny** static so we do not mask DB outages as an empty library; callers that
 * need a retry surface should use {@link getPublishedBlogPostsPage} `listLoad` after explicit DB attempts.
 */
async function resolveBlogStaticFallbackProbe(): Promise<BlogStaticFallbackProbeResult> {
  if (listStaticBlogPostsForIndex().length === 0 && listBlogStaticLongtailRecords().length === 0) {
    return { kind: "deny_no_static_corpus" };
  }
  if (shouldSkipBlogDbForProductionBuild()) return { kind: "use_static" };
  if (!isDatabaseUrlConfigured()) return { kind: "use_static" };
  const now = new Date();
  const probe = await withBlogTimeoutFallback<{ ok: true; liveCount: number } | { ok: false }>(
    async () => ({ ok: true as const, liveCount: await prisma.blogPost.count({ where: blogLiveWhere(now) }) }),
    { ok: false as const },
    "blog_static_fallback_probe",
    BLOG_PUBLIC_QUERY_TIMEOUT_MS,
  );
  if (!probe.ok) return { kind: "deny_probe_failed" };
  if (probe.liveCount > 0) return { kind: "deny_has_live_posts", liveCount: probe.liveCount };
  return { kind: "use_static" };
}

/**
 * True when the bundled static corpus may back `/blog` lists and slug metadata because Postgres has
 * **no live posts** (same {@link blogLiveWhere} contract as public lists). Probe timeout/error returns false.
 */
export async function canUseStaticBlogFallback(): Promise<boolean> {
  const probe = await resolveBlogStaticFallbackProbe();
  return probe.kind === "use_static";
}

const indexSelect = {
  slug: true,
  title: true,
  excerpt: true,
  category: true,
  coverImage: true,
  createdAt: true,
  updatedAt: true,
  publishAt: true,
  postStatus: true,
} satisfies Prisma.BlogPostSelect;

export type BlogIndexPost = Prisma.BlogPostGetPayload<{ select: typeof indexSelect }>;
/** Hybrid index row: `source` and `publicSource` mirror the same CMS vs supplement discriminator. */
export type BlogIndexPostWithSource = BlogIndexPost & {
  publicSource?: BlogPostPublicListSource;
  source?: BlogPostPublicListSource;
};
export type { BlogPostPublicListSource } from "@/lib/blog/blog-static-longtail-types";

function mergeRowToBlogIndexPost(row: BlogIndexMergeRow, source: BlogPostPublicListSource): BlogIndexPostWithSource {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    coverImage: null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishAt: row.publishAt,
    postStatus: row.postStatus,
    publicSource: source,
    source,
  };
}

function blogIndexPostsWithDbSource(posts: BlogIndexPost[]): BlogIndexPostWithSource[] {
  return posts.map((p) => ({ ...p, publicSource: "db" as const, source: "db" as const }));
}

/** Map merged hub row to {@link BlogIndexPost} (pathophysiology spotlight). */
function blogIndexPostFromMergeRow(row: BlogIndexMergeRow): BlogIndexPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    coverImage: null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publishAt: row.publishAt,
    postStatus: row.postStatus,
  };
}

function blogIndexPostToMergeRowFromDb(p: BlogIndexPost): BlogIndexMergeRow {
  return {
    slug: p.slug.trim(),
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishAt: p.publishAt,
    postStatus: p.postStatus,
  };
}

type BlogQueryScope = {
  locale?: string;
  sourceLocale?: string;
  careerSlug?: string;
  exam?: string;
  allowSourceLocaleFallback?: boolean;
};

function isGlobalUnscopedBlogIndexScope(scope?: BlogQueryScope): boolean {
  return !scope?.locale && !scope?.careerSlug && !scope?.exam;
}

/** Bounded `IN` list: bundled static + long-tail slugs; live CMS wins on overlap. */
async function fetchLiveBlogSlugsOverlappingSupplementSlugs(now: Date): Promise<Set<string>> {
  const supplementSlugs = allSupplementSlugsForOverlapQuery();
  if (supplementSlugs.length === 0) return new Set();
  const rows = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where: { AND: [blogLiveWhere(now), { slug: { in: supplementSlugs } }] },
        select: { slug: true },
      }),
    [],
    "blog_index.merge_live_slugs_overlapping_supplement",
  );
  return new Set(rows.map((r) => r.slug.trim()).filter(Boolean));
}

/** Bounded overlap `IN` for tag hubs: supplement slugs that may collide with live CMS. */
async function fetchLiveBlogSlugsOverlappingTagSupplementSlugs(tag: string, now: Date): Promise<Set<string>> {
  const slugs = supplementSlugsForTagOverlapQuery(tag);
  if (slugs.length === 0) return new Set();
  const rows = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where: { AND: [blogLiveWhere(now), { slug: { in: slugs } }] },
        select: { slug: true },
      }),
    [],
    "blog_tag.merge_live_overlap",
  );
  return new Set(rows.map((r) => r.slug.trim()).filter(Boolean));
}

/** Bounded overlap `IN` for category hubs. */
async function fetchLiveBlogSlugsOverlappingCategorySupplementSlugs(category: string, now: Date): Promise<Set<string>> {
  const slugs = supplementSlugsForCategoryOverlapQuery(category);
  if (slugs.length === 0) return new Set();
  const rows = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where: { AND: [blogLiveWhere(now), { slug: { in: slugs } }] },
        select: { slug: true },
      }),
    [],
    "blog_category.merge_live_overlap",
  );
  return new Set(rows.map((r) => r.slug.trim()).filter(Boolean));
}

export type BlogIndexListLoadSource = "live_db" | "static_fallback" | "degraded" | "error";

export type BlogIndexListLoadMeta = {
  querySucceeded: boolean;
  source: BlogIndexListLoadSource;
  /** Total rows matching the list filter in DB when the read succeeded; null when unknown. */
  rawCount: number | null;
  /** Rows in the returned page slice (before pathophysiology de-dup on the page). */
  filteredCount: number | null;
  finalCount: number;
  reasonFailed?: string;
  reasonDropped?: string;
};

/**
 * Default page size for `/blog` and `/blog/tag/*` lists.
 * Uses {@link API_LIST_PAGE_SIZE_HARD_MAX} as ceiling (defense-in-depth for list APIs).
 */
export const BLOG_LIST_PAGE_SIZE = 50;

/** Matches `import-pathophysiology-nursing-blog-seeds.mts` upserts. */
export const PATHOPHYSIOLOGY_SEED_LEGACY_SOURCE = "pathophysiology-nursing-blog-seed" as const;
/** Matches `scripts/blog/seed-long-tail-patho-blog-posts.mts` published rows. */
export const PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE = "pathophysiology-long-tail-200-seed" as const;
/** Primary tag on seeded pathophysiology posts; powers `/blog/tag/pathophysiology`. */
export const PATHOPHYSIOLOGY_HUB_PRIMARY_TAG = "pathophysiology" as const;
const PATHOPHYSIOLOGY_HUB_DEFAULT_TAKE = 12;

/**
 * Live posts for the `/blog` pathophysiology spotlight (seed corpus, `pp-*` slugs, or primary tag).
 * No locale/career/exam filters — same contract as the main index {@link blogLiveWhere}.
 */
export async function getPathophysiologyBlogHubPosts(take: number = PATHOPHYSIOLOGY_HUB_DEFAULT_TAKE): Promise<BlogIndexPost[]> {
  const safeTake = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(take)));
  const tag = PATHOPHYSIOLOGY_HUB_PRIMARY_TAG.toLowerCase();
  const matchesPatho = (p: { slug: string; tags?: string[] }) =>
    p.slug.startsWith("pp-") || (p.tags ?? []).some((t) => t.toLowerCase() === tag);

  if (shouldSkipBlogDbForProductionBuild()) {
    const staticRows = listStaticBlogPostsForIndex().filter(matchesPatho).map(staticRecordToBlogIndexMergeRow);
    const longRows = listBlogStaticLongtailRecords()
      .filter((r) => matchesPatho(r) && r.slug.trim())
      .map(blogStaticLongtailRecordToBlogIndexMergeRow);
    const merged = mergeBlogIndexRows([], [...staticRows, ...longRows]);
    return sliceBlogIndexPage(merged, 1, safeTake).map(blogIndexPostFromMergeRow);
  }
  const now = new Date();
  const where = {
    AND: [
      blogLiveWhere(now),
      {
        OR: [
          { legacySource: PATHOPHYSIOLOGY_SEED_LEGACY_SOURCE },
          { legacySource: PATHOPHYSIOLOGY_LONG_TAIL_200_LEGACY_SOURCE },
          { slug: { startsWith: "pp-" } },
          { tags: { has: PATHOPHYSIOLOGY_HUB_PRIMARY_TAG } },
        ],
      },
    ],
  } satisfies Prisma.BlogPostWhereInput;
  const dbCap = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(safeTake * 4, safeTake + 40));
  const dbPosts = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { slug: "asc" }],
        take: dbCap,
        select: indexSelect,
      }),
    [],
    "blog_pathophysiology_hub.posts",
  );
  const liveOverlap = await fetchLiveBlogSlugsOverlappingSupplementSlugs(now);
  const staticPatho = listStaticBlogPostsForIndex()
    .filter((p) => matchesPatho(p) && p.slug.trim() && !liveOverlap.has(p.slug.trim()))
    .map(staticRecordToBlogIndexMergeRow);
  const staticSlugSet = new Set(listStaticBlogPostsForIndex().map((p) => p.slug.trim()).filter(Boolean));
  const longtailPatho = listBlogStaticLongtailRecords()
    .filter(
      (r) =>
        matchesPatho(r) &&
        r.slug.trim() &&
        !liveOverlap.has(r.slug.trim()) &&
        !staticSlugSet.has(r.slug.trim()),
    )
    .map(blogStaticLongtailRecordToBlogIndexMergeRow);
  const merged = mergeBlogIndexRows(
    dbPosts.map((p) => blogIndexPostToMergeRowFromDb(p)),
    [...staticPatho, ...longtailPatho],
  );
  return sliceBlogIndexPage(merged, 1, safeTake).map(blogIndexPostFromMergeRow);
}

/**
 * Opt-in deep diagnostics: `BLOG_INDEX_DIAGNOSTICS=1` logs groupBy + live counts (extra DB work).
 * Lightweight: `BLOG_INDEX_COUNTS=1` logs returned row count + first 10 slugs only (`seo` / `BLOG_INDEX_COUNTS`).
 */
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
    async () => (await prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } })) as unknown as StatusAgg[],
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
    statusesBreakdownPageSlice: JSON.stringify(statusesBreakdownPageSlice),
    statusesBreakdownDbAll: JSON.stringify(statusesBreakdownDbAll),
    first20Slugs: args.posts.slice(0, 20).map((p) => p.slug).join(","),
    page: args.page,
    pageSize: args.pageSize,
    usedStaticFallback: args.usedStaticFallback ? "1" : "0",
    scoped: Boolean(args.scope?.locale || args.scope?.careerSlug || args.scope?.exam),
  });
}

async function loadBlogIndexWhereSlice(
  where: Prisma.BlogPostWhereInput,
  safePage: number,
  safeSize: number,
  includeTotal: boolean,
  labelPrefix: string,
  timeoutMs: number,
): Promise<{
  postsAttempt: BlogPublicDbReadAttemptResult<BlogIndexPost[]>;
  totalAttempt: BlogPublicDbReadAttemptResult<number>;
}> {
  const postsAttempt = await blogPublicDbReadAttempt(
    `${labelPrefix}.posts`,
    () =>
      prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
        select: indexSelect,
        skip: (safePage - 1) * safeSize,
        take: safeSize,
      }),
    timeoutMs,
  );
  const totalAttempt = includeTotal
    ? await blogPublicDbReadAttempt(`${labelPrefix}.total`, () => prisma.blogPost.count({ where }), timeoutMs)
    : ({ ok: true as const, value: 0 });
  return { postsAttempt, totalAttempt };
}

function blogIndexListLoadFromAttempts(
  postsAttempt: BlogPublicDbReadAttemptResult<BlogIndexPost[]>,
  totalAttempt: BlogPublicDbReadAttemptResult<number>,
  reasonPrefix: string,
): BlogIndexListLoadMeta {
  const fail = !postsAttempt.ok ? postsAttempt : totalAttempt;
  return {
    querySucceeded: false,
    source: "error",
    rawCount: null,
    filteredCount: null,
    finalCount: 0,
    reasonFailed: fail.ok ? `${reasonPrefix}:unknown` : `${reasonPrefix}:${fail.kind}:${fail.reason}`,
  };
}

/**
 * Loads paginated index rows + optional total with timeout/retry semantics. Never returns synthetic empty
 * on Prisma failure — callers surface {@link BlogIndexListLoadMeta} `error` instead.
 */
async function loadBlogIndexPageFromDb(
  where: Prisma.BlogPostWhereInput,
  safePage: number,
  safeSize: number,
  includeTotal: boolean,
  labelPrefix: string,
): Promise<
  | { ok: true; posts: BlogIndexPost[]; total: number }
  | { ok: false; listLoad: BlogIndexListLoadMeta }
> {
  let { postsAttempt, totalAttempt } = await loadBlogIndexWhereSlice(
    where,
    safePage,
    safeSize,
    includeTotal,
    labelPrefix,
    BLOG_PUBLIC_QUERY_TIMEOUT_MS,
  );
  if ((!postsAttempt.ok || !totalAttempt.ok) && shouldRetryBlogIndexAfterTransientEmpty()) {
    const r2 = await loadBlogIndexWhereSlice(
      where,
      safePage,
      safeSize,
      includeTotal,
      `${labelPrefix}_retry`,
      BLOG_INDEX_EMPTY_RETRY_TIMEOUT_MS,
    );
    if (r2.postsAttempt.ok && r2.totalAttempt.ok) {
      postsAttempt = r2.postsAttempt;
      totalAttempt = r2.totalAttempt;
    }
  }
  if (!postsAttempt.ok || !totalAttempt.ok) {
    safeServerLog("blog", "blog_index_list_db_failed", {
      labelPrefix,
      posts_ok: postsAttempt.ok ? "1" : "0",
      total_ok: totalAttempt.ok ? "1" : "0",
    });
    return { ok: false, listLoad: blogIndexListLoadFromAttempts(postsAttempt, totalAttempt, labelPrefix) };
  }
  let posts = postsAttempt.value;
  let total = totalAttempt.value;
  if (
    shouldRetryBlogIndexAfterTransientEmpty() &&
    posts.length === 0 &&
    (!includeTotal || total === 0)
  ) {
    const r2 = await loadBlogIndexWhereSlice(
      where,
      safePage,
      safeSize,
      includeTotal,
      `${labelPrefix}_empty_retry`,
      BLOG_INDEX_EMPTY_RETRY_TIMEOUT_MS,
    );
    if (!r2.postsAttempt.ok || !r2.totalAttempt.ok) {
      safeServerLog("blog", "blog_index_list_db_failed_empty_retry", { labelPrefix });
      return { ok: false, listLoad: blogIndexListLoadFromAttempts(r2.postsAttempt, r2.totalAttempt, `${labelPrefix}_empty_retry`) };
    }
    if (r2.postsAttempt.value.length > 0 || (includeTotal && r2.totalAttempt.value > 0)) {
      safeServerLog("blog", "blog_index_page_recovered_after_timeout_retry", {
        recoveredPosts: String(r2.postsAttempt.value.length),
        recoveredTotal: String(r2.totalAttempt.value),
        retryTimeoutMs: String(BLOG_INDEX_EMPTY_RETRY_TIMEOUT_MS),
      });
      posts = r2.postsAttempt.value;
      total = r2.totalAttempt.value;
    } else {
      logRouteDataPipeline({
        route: "/blog",
        stage: "blog_index_empty_after_expand_timeout_retry",
        meta: {
          firstPassTimeoutMs: BLOG_PUBLIC_QUERY_TIMEOUT_MS,
          retryTimeoutMs: BLOG_INDEX_EMPTY_RETRY_TIMEOUT_MS,
          reasonCode: "TIMEOUT_OR_TRUE_EMPTY",
          includeTotal: includeTotal ? 1 : 0,
          labelPrefix,
        },
      });
    }
  }
  return { ok: true, posts, total };
}

export async function countPublishedBlogPosts(): Promise<number> {
  if (shouldSkipBlogDbForProductionBuild()) {
    return buildSupplementBlogIndexRowsExcludingLiveSlugs(new Set()).length;
  }
  if (!isDatabaseUrlConfigured()) {
    return buildSupplementBlogIndexRowsExcludingLiveSlugs(new Set()).length;
  }
  const now = new Date();
  const dbCount = await withBlogTimeoutFallback(
    () => prisma.blogPost.count({ where: blogLiveWhere(now) }),
    0,
    "blog_posts_published_count",
  );
  const overlap = await fetchLiveBlogSlugsOverlappingSupplementSlugs(now);
  const staticOnly = buildSupplementBlogIndexRowsExcludingLiveSlugs(overlap).length;
  if (dbCount > BLOG_INDEX_MERGE_DB_MAX) {
    return dbCount;
  }
  return dbCount + staticOnly;
}

export async function getPublishedBlogPostsPage(
  page: number,
  pageSize: number,
  scope?: BlogQueryScope,
  options?: { includeTotal?: boolean },
): Promise<{
  posts: BlogIndexPostWithSource[];
  total: number;
  page: number;
  pageSize: number;
  listLoad: BlogIndexListLoadMeta;
}> {
  const safePage = Math.max(1, page);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(pageSize)));
  const includeTotal = options?.includeTotal !== false;

  if (shouldSkipBlogDbForProductionBuild()) {
    const built = blogIndexPostsFromStaticCorpusOnly(safePage, safeSize);
    const listLoad: BlogIndexListLoadMeta = {
      querySucceeded: true,
      source: "static_fallback",
      rawCount: built.total,
      filteredCount: built.posts.length,
      finalCount: built.posts.length,
      reasonDropped: "build_phase_skip_db",
    };
    await logBlogIndexDiagnosticsIfEnabled({
      posts: built.posts,
      totalMatchingLiveFilter: built.total,
      page: built.page,
      pageSize: built.pageSize,
      usedStaticFallback: true,
      scope,
    });
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_static_build_phase",
      meta: {
        finalRowCount: built.posts.length,
        finalTotal: built.total,
        cacheSource: "static_bundle_build_skip_db",
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoad),
      },
    });
    return { ...built, listLoad };
  }

  if (!isDatabaseUrlConfigured()) {
    const built = blogIndexPostsFromStaticCorpusOnly(safePage, safeSize);
    const listLoad: BlogIndexListLoadMeta = {
      querySucceeded: true,
      source: "static_fallback",
      rawCount: built.total,
      filteredCount: built.posts.length,
      finalCount: built.posts.length,
      reasonDropped: "database_url_missing_static_bundle",
    };
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_static_no_database_url",
      meta: {
        finalRowCount: built.posts.length,
        finalTotal: built.total,
        cacheSource: "static_bundle_no_db_url",
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoad),
      },
    });
    return { ...built, listLoad };
  }

  const now = new Date();
  /** Align with tag list / sitemap / {@link blogPostIsLive} — include due SCHEDULED rows, not only PUBLISHED. */
  const where = buildBlogPublicListWhere(now, scope);

  const primary = await loadBlogIndexPageFromDb(where, safePage, safeSize, includeTotal, "blog_posts_page");
  if (!primary.ok) {
    const staticOnFailure =
      isGlobalUnscopedBlogIndexScope(scope) &&
      (listStaticBlogPostsForIndex().length > 0 || listBlogStaticLongtailRecords().length > 0) &&
      shouldUseStaticBlogIndexOnDbError();
    if (staticOnFailure) {
      const built = blogIndexPostsFromStaticCorpusOnly(safePage, safeSize);
      const listLoad: BlogIndexListLoadMeta = {
        querySucceeded: false,
        source: "degraded",
        rawCount: null,
        filteredCount: built.posts.length,
        finalCount: built.posts.length,
        reasonFailed: primary.listLoad.reasonFailed,
        reasonDropped: "db_error_static_seed_page",
      };
      await logBlogIndexDiagnosticsIfEnabled({
        posts: built.posts,
        totalMatchingLiveFilter: built.total,
        page: safePage,
        pageSize: safeSize,
        usedStaticFallback: true,
        scope,
      });
      logRouteDataPipeline({
        route: "/blog",
        stage: "blog_index_return_degraded_static_on_db_error",
        meta: {
          page: safePage,
          pageSize: safeSize,
          listLoad: JSON.stringify(listLoad),
        },
      });
      return { ...built, listLoad };
    }
    await logBlogIndexDiagnosticsIfEnabled({
      posts: [],
      totalMatchingLiveFilter: 0,
      page: safePage,
      pageSize: safeSize,
      usedStaticFallback: false,
      scope,
    });
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_db_error",
      meta: {
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(primary.listLoad),
      },
    });
    return {
      posts: [],
      total: 0,
      page: safePage,
      pageSize: safeSize,
      listLoad: primary.listLoad,
    };
  }

  let dbPosts = primary.posts;
  let dbTotal = primary.total;

  if (
    scope?.locale &&
    scope.locale !== (scope.sourceLocale ?? "en") &&
    scope.allowSourceLocaleFallback !== false &&
    dbTotal === 0
  ) {
    const sourceLocale = scope.sourceLocale ?? "en";
    const sourceWhere = buildBlogPublicListWhere(now, {
      locale: sourceLocale,
      careerSlug: scope.careerSlug,
      exam: scope.exam,
    });
    const localeRead = await loadBlogIndexPageFromDb(
      sourceWhere,
      safePage,
      safeSize,
      includeTotal,
      "blog_posts_page_locale_fallback",
    );
    if (!localeRead.ok) {
      await logBlogIndexDiagnosticsIfEnabled({
        posts: [],
        totalMatchingLiveFilter: 0,
        page: safePage,
        pageSize: safeSize,
        usedStaticFallback: false,
        scope,
      });
      logRouteDataPipeline({
        route: "/blog",
        stage: "blog_index_locale_fallback_db_error",
        meta: { page: safePage, pageSize: safeSize, listLoad: JSON.stringify(localeRead.listLoad) },
      });
      return {
        posts: [],
        total: 0,
        page: safePage,
        pageSize: safeSize,
        listLoad: localeRead.listLoad,
      };
    }
    dbPosts = localeRead.posts;
    dbTotal = localeRead.total;
    if (process.env.BLOG_INDEX_COUNTS === "1") {
      safeServerLog("seo", "BLOG_INDEX_COUNTS", {
        scope: "getPublishedBlogPostsPage_locale_fallback",
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
    const listLoadLocale: BlogIndexListLoadMeta = {
      querySucceeded: true,
      source: "live_db",
      rawCount: dbTotal,
      filteredCount: dbPosts.length,
      finalCount: dbPosts.length,
    };
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_live_db_locale_fallback",
      meta: {
        finalRowCount: dbPosts.length,
        finalTotal: dbTotal,
        cacheSource: "live_prisma_locale_fallback",
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoadLocale),
      },
    });
    return {
      posts: blogIndexPostsWithDbSource(dbPosts),
      total: dbTotal,
      page: safePage,
      pageSize: safeSize,
      listLoad: listLoadLocale,
    };
  }

  /**
   * Global `/blog` index: merge live CMS rows with bundled static posts.
   * Slug dedupe: live CMS wins; static rows whose slug exists on a live CMS row are dropped.
   * Sort: {@link mergeBlogIndexRows} (newest primary timestamp first, then slug asc).
   * Above {@link BLOG_INDEX_MERGE_DB_MAX} live rows, pagination stays DB-only (static still resolves at `/blog/[slug]`).
   */
  const overlap = isGlobalUnscopedBlogIndexScope(scope)
    ? await fetchLiveBlogSlugsOverlappingSupplementSlugs(now)
    : new Set<string>();
  const staticOnlyRows = isGlobalUnscopedBlogIndexScope(scope)
    ? buildSupplementBlogIndexRowsExcludingLiveSlugs(overlap)
    : [];

  let postsOut: BlogIndexPostWithSource[] = blogIndexPostsWithDbSource(dbPosts);
  let totalOut = dbTotal;
  let listLoadOut: BlogIndexListLoadMeta;
  let usedStaticFallbackDiag = false;

  if (isGlobalUnscopedBlogIndexScope(scope) && dbTotal <= BLOG_INDEX_MERGE_DB_MAX) {
    const fullAttempt = await blogPublicDbReadAttempt(
      "blog_posts_page.merge_fetch_all_live",
      () =>
        dbTotal === 0
          ? Promise.resolve([] as BlogIndexPost[])
          : prisma.blogPost.findMany({
              where,
              orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
              select: indexSelect,
              take: Math.min(dbTotal, BLOG_INDEX_MERGE_DB_MAX),
            }),
      BLOG_PUBLIC_QUERY_TIMEOUT_MS,
    );
    const allDb =
      dbTotal === 0
        ? ([] as BlogIndexPost[])
        : fullAttempt.ok && fullAttempt.value.length === dbTotal
          ? fullAttempt.value
          : null;
    if (allDb !== null) {
      const merged = mergeBlogIndexRows(allDb.map(blogIndexPostToMergeRowFromDb), staticOnlyRows);
      const dbSlugSet = new Set(allDb.map((p) => p.slug.trim()).filter(Boolean));
      postsOut = sliceBlogIndexPage(merged, safePage, safeSize).map((r) =>
        mergeRowToBlogIndexPost(r, dbSlugSet.has(r.slug.trim()) ? "db" : "static"),
      );
      totalOut = merged.length;
      usedStaticFallbackDiag = staticOnlyRows.length > 0;
      listLoadOut = {
        querySucceeded: true,
        source: "live_db",
        rawCount: dbTotal,
        filteredCount: postsOut.length,
        finalCount: postsOut.length,
        ...(usedStaticFallbackDiag
          ? { reasonDropped: "merged_static_seed_slugs_not_in_live_cms" }
          : {}),
      };
      logRouteDataPipeline({
        route: "/blog",
        stage: "blog_index_return_merged_cms_static",
        meta: {
          finalRowCount: postsOut.length,
          finalTotal: totalOut,
          cmsLiveCount: String(dbTotal),
          staticMergedCount: String(staticOnlyRows.length),
          page: safePage,
          pageSize: safeSize,
          listLoad: JSON.stringify(listLoadOut),
        },
      });
    } else {
      postsOut = blogIndexPostsWithDbSource(dbPosts);
      totalOut = dbTotal;
      listLoadOut = {
        querySucceeded: true,
        source: "live_db",
        rawCount: dbTotal,
        filteredCount: dbPosts.length,
        finalCount: dbPosts.length,
        reasonDropped: "merge_full_fetch_mismatch_db_page_only",
      };
      logRouteDataPipeline({
        route: "/blog",
        stage: "blog_index_return_live_db_merge_fetch_failed",
        meta: {
          page: safePage,
          pageSize: safeSize,
          listLoad: JSON.stringify(listLoadOut),
        },
      });
    }
  } else if (isGlobalUnscopedBlogIndexScope(scope) && dbTotal > BLOG_INDEX_MERGE_DB_MAX) {
    postsOut = blogIndexPostsWithDbSource(dbPosts);
    totalOut = dbTotal;
    listLoadOut = {
      querySucceeded: true,
      source: "live_db",
      rawCount: dbTotal,
      filteredCount: dbPosts.length,
      finalCount: dbPosts.length,
      reasonDropped: `cms_live_count_gt_${BLOG_INDEX_MERGE_DB_MAX}_index_static_not_interleaved`,
    };
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_live_db_over_merge_cap",
      meta: {
        finalRowCount: dbPosts.length,
        finalTotal: dbTotal,
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoadOut),
      },
    });
  } else {
    postsOut = blogIndexPostsWithDbSource(dbPosts);
    totalOut = dbTotal;
    listLoadOut = {
      querySucceeded: true,
      source: "live_db",
      rawCount: dbTotal,
      filteredCount: dbPosts.length,
      finalCount: dbPosts.length,
    };
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_live_db_scoped",
      meta: {
        finalRowCount: dbPosts.length,
        finalTotal: dbTotal,
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoadOut),
      },
    });
  }

  if (totalOut === 0) {
    const listLoadTrueEmpty: BlogIndexListLoadMeta = {
      querySucceeded: true,
      source: "live_db",
      rawCount: 0,
      filteredCount: 0,
      finalCount: 0,
      reasonDropped: "db_empty_static_corpus_empty",
    };
    logRouteDataPipeline({
      route: "/blog",
      stage: "blog_index_return_true_empty",
      meta: {
        finalRowCount: 0,
        finalTotal: 0,
        cacheSource: "live_prisma_no_static_rows",
        page: safePage,
        pageSize: safeSize,
        listLoad: JSON.stringify(listLoadTrueEmpty),
      },
    });
    return {
      posts: postsOut,
      total: totalOut,
      page: safePage,
      pageSize: safeSize,
      listLoad: listLoadTrueEmpty,
    };
  }

  if (process.env.BLOG_INDEX_COUNTS === "1") {
    safeServerLog("seo", "BLOG_INDEX_COUNTS", {
      scope: "getPublishedBlogPostsPage",
      page: String(safePage),
      pageSize: String(safeSize),
      returnedRows: String(postsOut.length),
      totalCount: String(totalOut),
      firstTenSlugs: postsOut
        .slice(0, 10)
        .map((p) => p.slug)
        .join(","),
      usedStaticFallback: usedStaticFallbackDiag ? "1" : "0",
    });
  }
  await logBlogIndexDiagnosticsIfEnabled({
    posts: postsOut,
    totalMatchingLiveFilter: totalOut,
    page: safePage,
    pageSize: safeSize,
    usedStaticFallback: usedStaticFallbackDiag,
    scope,
  });
  return { posts: postsOut, total: totalOut, page: safePage, pageSize: safeSize, listLoad: listLoadOut };
}

const metaSelect = {
  title: true,
  excerpt: true,
  postStatus: true,
  workflowStatus: true,
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

function blogMetaFromLongtailRecord(lt: BlogStaticLongtailRecord): BlogPostMeta {
  return {
    title: lt.title,
    excerpt: lt.excerpt,
    postStatus: BlogPostStatus.PUBLISHED,
    workflowStatus: BlogWorkflowStatus.PUBLISHED,
    publishAt: null,
    scheduledAt: null,
    seoTitle: lt.seoTitle?.trim() || null,
    seoDescription: lt.seoDescription?.trim() || null,
    createdAt: new Date(`${lt.createdAt}T12:00:00Z`),
    internalLinkPlan: null,
    tags: lt.tags ?? [],
    category: lt.category ?? null,
    exam: null,
    countryTarget: null,
    coverImage: null,
  };
}

function getStaticBlogMetaFallback(slug: string): BlogPostMeta | null {
  const s = getStaticBlogPost(slug);
  if (s && !isBlogPublicE2eTestArtifact(s.slug, s.title)) {
    return {
      title: s.title,
      excerpt: s.excerpt,
      postStatus: BlogPostStatus.PUBLISHED,
      workflowStatus: BlogWorkflowStatus.PUBLISHED,
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
  const lt = getBlogStaticLongtailRecord(slug);
  return lt && !isBlogPublicE2eTestArtifact(lt.slug, lt.title) ? blogMetaFromLongtailRecord(lt) : null;
}

function getStaticBlogPostFallback(slug: string): BlogPost | null {
  const s = getStaticBlogPost(slug);
  if (s && !isBlogPublicE2eTestArtifact(s.slug, s.title)) return publishedBlogPostFromStaticRecord(s);
  const lt = getBlogStaticLongtailRecord(slug);
  return lt && !isBlogPublicE2eTestArtifact(lt.slug, lt.title) ? publishedBlogPostFromLongtailRecord(lt) : null;
}

function shouldPreferStaticBlogDetailFallback(): boolean {
  return process.env.BLOG_DETAIL_STATIC_FIRST?.trim() !== "0";
}

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
    return getStaticBlogMetaFallback(slug);
  }
  if (!isDatabaseUrlConfigured()) {
    return getStaticBlogMetaFallback(slug);
  }
  if (shouldPreferStaticBlogDetailFallback()) {
    const staticMeta = getStaticBlogMetaFallback(slug);
    if (staticMeta) return staticMeta;
  }
  const db = await resolveScopedBlogPostBySlug(slug, scope);
  if (db && !isBlogPublicE2eTestArtifact(db.slug, db.title)) {
    return {
      title: db.title,
      excerpt: db.excerpt,
      postStatus: db.postStatus,
      workflowStatus: db.workflowStatus,
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
  return getStaticBlogMetaFallback(slug);
}

/** True when slug should receive public metadata (SEO) and indexing. */
export async function isBlogPostMetaVisible(slug: string, scope?: BlogQueryScope): Promise<boolean> {
  const meta = await getBlogPostMetaBySlug(slug, scope);
  if (!meta) return false;
  return isBlogPostMarketingMetaVisible({
    postStatus: meta.postStatus,
    publishAt: meta.publishAt,
    scheduledAt: meta.scheduledAt,
    workflowStatus: meta.workflowStatus,
  });
}

export async function getPublishedBlogPostBySlug(slug: string, scope?: BlogQueryScope): Promise<BlogPost | null> {
  const now = new Date();
  if (shouldSkipBlogDbForProductionBuild()) {
    return getStaticBlogPostFallback(slug);
  }
  if (!isDatabaseUrlConfigured()) {
    return getStaticBlogPostFallback(slug);
  }
  if (shouldPreferStaticBlogDetailFallback()) {
    const staticPost = getStaticBlogPostFallback(slug);
    if (staticPost) return staticPost;
  }
  const rawRow = await resolveScopedBlogPostBySlug(slug, scope);
  const row = rawRow && !isBlogPublicE2eTestArtifact(rawRow.slug, rawRow.title) ? rawRow : null;
  if (!row) {
    if (process.env.BLOG_PUBLIC_SKIP_TRACE === "1") {
      const bare = await withBlogTimeoutFallback(
        () =>
          prisma.blogPost.findUnique({
            where: { slug },
            select: {
              slug: true,
              postStatus: true,
              workflowStatus: true,
              publishAt: true,
              scheduledAt: true,
              locale: true,
              careerSlug: true,
              exam: true,
            },
          }),
        null,
        "blog_public_skip_trace_bare_slug",
      );
      if (bare) {
        safeServerLog("blog", "[BLOG_PUBLIC_SKIP]", {
          context: "getPublishedBlogPostBySlug",
          slug,
          scopeLocale: scope?.locale ?? "",
          scopeCareerSlug: scope?.careerSlug ?? "",
          scopeExam: scope?.exam ?? "",
          reason: "scoped_resolve_miss_db_row_exists",
          postStatus: bare.postStatus,
          workflowStatus: bare.workflowStatus ?? "",
          locale: bare.locale ?? "",
          careerSlug: bare.careerSlug ?? "",
          exam: bare.exam ?? "",
        });
      } else {
        safeServerLog("blog", "[BLOG_PUBLIC_SKIP]", {
          context: "getPublishedBlogPostBySlug",
          slug,
          reason: "no_db_row_for_slug",
        });
      }
    }
    if (process.env.BLOG_PUBLIC_SKIP_TRACE === "1" && rawRow && isBlogPublicE2eTestArtifact(rawRow.slug, rawRow.title)) {
      safeServerLog("blog", "[BLOG_PUBLIC_SKIP]", {
        context: "getPublishedBlogPostBySlug",
        slug,
        reason: "e2e_test_artifact_excluded_from_public",
      });
    }
    return getStaticBlogPostFallback(slug);
  }
  if (
    scope?.careerSlug &&
    row.careerSlug &&
    row.careerSlug !== scope.careerSlug
  ) {
    if (process.env.BLOG_PUBLIC_SKIP_TRACE === "1") {
      safeServerLog("blog", "[BLOG_PUBLIC_SKIP]", {
        context: "getPublishedBlogPostBySlug",
        slug,
        reason: "career_slug_mismatch",
        rowCareerSlug: row.careerSlug ?? "",
        scopeCareerSlug: scope.careerSlug,
      });
    }
    return null;
  }
  /** Align with {@link blogLiveWhere} on index/tag routes: live SCHEDULED rows, not only PUBLISHED. */
  if (
    !blogPostIsLive(
      {
        postStatus: row.postStatus,
        publishAt: row.publishAt,
        scheduledAt: row.scheduledAt,
        workflowStatus: row.workflowStatus,
      },
      now,
    )
  ) {
    if (process.env.BLOG_PUBLIC_SKIP_TRACE === "1") {
      safeServerLog("blog", "[BLOG_PUBLIC_SKIP]", {
        context: "getPublishedBlogPostBySlug",
        slug,
        reason: "not_live_for_public_body",
        detail: describeCanonicalBlogNotLiveReason(row, now),
        postStatus: row.postStatus,
        workflowStatus: row.workflowStatus ?? "",
        publishAt: row.publishAt?.toISOString() ?? "",
        scheduledAt: row.scheduledAt?.toISOString() ?? "",
      });
    }
    return getStaticBlogPostFallback(slug);
  }
  return row;
}

export async function countPublishedPostsWithTag(tag: string): Promise<number> {
  const t = tag.trim();
  if (!t) return 0;
  if (shouldSkipBlogDbForProductionBuild()) {
    return mergeBlogIndexRows([], supplementBlogIndexMergeRowsForTag(t, new Set())).length;
  }
  const now = new Date();
  const dbCount = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.count({
        where: { AND: [blogLiveWhere(now), { tags: { has: t } }] },
      }),
    0,
    "blog_posts_by_tag.count",
  );
  if (dbCount > BLOG_INDEX_MERGE_DB_MAX) return dbCount;
  const overlap = await fetchLiveBlogSlugsOverlappingTagSupplementSlugs(t, now);
  return dbCount + supplementBlogIndexMergeRowsForTag(t, overlap).length;
}

const tagListSelect = {
  slug: true,
  title: true,
  excerpt: true,
  createdAt: true,
  updatedAt: true,
  publishAt: true,
  category: true,
} satisfies Prisma.BlogPostSelect;

export type BlogTagListPost = Prisma.BlogPostGetPayload<{ select: typeof tagListSelect }>;

function blogIndexMergeRowToTagListPost(row: BlogIndexMergeRow): BlogTagListPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    createdAt: row.createdAt,
    publishAt: row.publishAt,
    updatedAt: row.updatedAt,
  };
}

function tagListPostToMergeRow(p: BlogTagListPost): BlogIndexMergeRow {
  return {
    slug: p.slug.trim(),
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    publishAt: p.publishAt,
    postStatus: BlogPostStatus.PUBLISHED,
  };
}

export async function getPublishedBlogPostsByTagPage(
  tag: string,
  page: number,
  pageSize: number,
): Promise<{ posts: BlogTagListPost[]; total: number; page: number; pageSize: number }> {
  const t = tag.trim();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(pageSize)));
  if (!t) return { posts: [], total: 0, page: safePage, pageSize: safeSize };
  if (shouldSkipBlogDbForProductionBuild()) {
    const merged = mergeBlogIndexRows([], supplementBlogIndexMergeRowsForTag(t, new Set()));
    const slice = sliceBlogIndexPage(merged, safePage, safeSize);
    return {
      posts: slice.map(blogIndexMergeRowToTagListPost),
      total: merged.length,
      page: safePage,
      pageSize: safeSize,
    };
  }
  const now = new Date();
  const where = { AND: [blogLiveWhere(now), { tags: { has: t } }] };
  const dbTotal = await withBlogTimeoutFallback(() => prisma.blogPost.count({ where }), 0, "blog_posts_by_tag.total");
  if (dbTotal > BLOG_INDEX_MERGE_DB_MAX) {
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
      Promise.resolve(dbTotal),
    ]);
    return { posts, total, page: safePage, pageSize: safeSize };
  }
  const overlap = await fetchLiveBlogSlugsOverlappingTagSupplementSlugs(t, now);
  const supplement = supplementBlogIndexMergeRowsForTag(t, overlap);
  const dbAll = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
        select: tagListSelect,
        take: BLOG_INDEX_MERGE_DB_MAX,
      }),
    [],
    "blog_posts_by_tag.hybrid_fetch",
  );
  const merged = mergeBlogIndexRows(dbAll.map(tagListPostToMergeRow), supplement);
  const slice = sliceBlogIndexPage(merged, safePage, safeSize);
  const hybridTotal = dbTotal + supplement.length;
  return {
    posts: slice.map(blogIndexMergeRowToTagListPost),
    total: hybridTotal,
    page: safePage,
    pageSize: safeSize,
  };
}

export async function countPublishedPostsWithCategory(category: string): Promise<number> {
  const cat = category.trim();
  if (!cat) return 0;
  if (shouldSkipBlogDbForProductionBuild()) {
    return mergeBlogIndexRows([], supplementBlogIndexMergeRowsForCategory(cat, new Set())).length;
  }
  const now = new Date();
  const dbCount = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.count({
        where: { AND: [blogLiveWhere(now), { category: cat }] },
      }),
    0,
    "blog_posts_by_category.count",
  );
  if (dbCount > BLOG_INDEX_MERGE_DB_MAX) return dbCount;
  const overlap = await fetchLiveBlogSlugsOverlappingCategorySupplementSlugs(cat, now);
  return dbCount + supplementBlogIndexMergeRowsForCategory(cat, overlap).length;
}

export async function getPublishedBlogPostsByCategoryPage(
  category: string,
  page: number,
  pageSize: number,
): Promise<{ posts: BlogTagListPost[]; total: number; page: number; pageSize: number }> {
  const cat = category.trim();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(pageSize)));
  if (!cat) {
    return { posts: [], total: 0, page: safePage, pageSize: safeSize };
  }
  if (shouldSkipBlogDbForProductionBuild()) {
    const merged = mergeBlogIndexRows([], supplementBlogIndexMergeRowsForCategory(cat, new Set()));
    const slice = sliceBlogIndexPage(merged, safePage, safeSize);
    return {
      posts: slice.map(blogIndexMergeRowToTagListPost),
      total: merged.length,
      page: safePage,
      pageSize: safeSize,
    };
  }
  const now = new Date();
  const where = { AND: [blogLiveWhere(now), { category: cat }] };
  const dbTotal = await withBlogTimeoutFallback(() => prisma.blogPost.count({ where }), 0, "blog_posts_by_category.total");
  if (dbTotal > BLOG_INDEX_MERGE_DB_MAX) {
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
        "blog_posts_by_category.posts",
      ),
      Promise.resolve(dbTotal),
    ]);
    return { posts, total, page: safePage, pageSize: safeSize };
  }
  const overlap = await fetchLiveBlogSlugsOverlappingCategorySupplementSlugs(cat, now);
  const supplement = supplementBlogIndexMergeRowsForCategory(cat, overlap);
  const dbAll = await withBlogTimeoutFallback(
    () =>
      prisma.blogPost.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }, { slug: "asc" }],
        select: tagListSelect,
        take: BLOG_INDEX_MERGE_DB_MAX,
      }),
    [],
    "blog_posts_by_category.hybrid_fetch",
  );
  const merged = mergeBlogIndexRows(dbAll.map(tagListPostToMergeRow), supplement);
  const slice = sliceBlogIndexPage(merged, safePage, safeSize);
  const hybridTotal = dbTotal + supplement.length;
  return {
    posts: slice.map(blogIndexMergeRowToTagListPost),
    total: hybridTotal,
    page: safePage,
    pageSize: safeSize,
  };
}

/** Sitemap helpers: hard cap per sitemap spec (~50k URLs); split indexes if you exceed this. */
const SITEMAP_BLOG_ROW_CAP = 50_000;
const SITEMAP_BLOG_SLUG_PAGE_SIZE = 2_000;

export type BlogSitemapSlugRow = {
  slug: string;
  careerSlug: string | null;
  updatedAt: Date;
};

export async function getSitemapPublishedBlogSlugs(): Promise<BlogSitemapSlugRow[]> {
  const now = new Date();
  return withBlogTimeoutFallback(
    async () => {
      const out: BlogSitemapSlugRow[] = [];
      let cursor: { slug: string } | undefined;
      for (;;) {
        const page = await prisma.blogPost.findMany({
          where: blogLiveWhere(now),
          select: { slug: true, updatedAt: true, careerSlug: true },
          orderBy: { slug: "asc" },
          take: SITEMAP_BLOG_SLUG_PAGE_SIZE,
          ...(cursor ? { cursor, skip: 1 } : {}),
        });
        if (page.length === 0) break;
        for (const r of page) {
          const s = r.slug?.trim();
          if (s) out.push({ slug: s, careerSlug: r.careerSlug?.trim() ?? null, updatedAt: r.updatedAt });
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

/**
 * Batched live blog slugs for `/sitemap.xml`. **Throws** on DB timeout, auth, or connectivity errors
 * when a database URL is configured (so sitemap generation cannot silently omit every `/blog/{slug}` row).
 * Returns `[]` only when DB-backed sitemap queries are intentionally skipped (build / no URL / static-only blog build).
 */
export async function getSitemapPublishedBlogSlugsStrict(): Promise<BlogSitemapSlugRow[]> {
  if (!isDatabaseUrlConfigured() || shouldSkipBlogDbForProductionBuild() || shouldSkipDbBackedSitemapUrlsForBuild()) {
    return [];
  }
  const now = new Date();
  return withDatabaseFallbackTimeoutOrThrow(
    async () => {
      const out: BlogSitemapSlugRow[] = [];
      let cursor: { slug: string } | undefined;
      for (;;) {
        const page = await prisma.blogPost.findMany({
          where: blogLiveWhere(now),
          select: { slug: true, updatedAt: true, careerSlug: true },
          orderBy: { slug: "asc" },
          take: SITEMAP_BLOG_SLUG_PAGE_SIZE,
          ...(cursor ? { cursor, skip: 1 } : {}),
        });
        if (page.length === 0) break;
        for (const r of page) {
          const s = r.slug?.trim();
          if (s) out.push({ slug: s, careerSlug: r.careerSlug?.trim() ?? null, updatedAt: r.updatedAt });
        }
        if (out.length >= SITEMAP_BLOG_ROW_CAP) break;
        if (page.length < SITEMAP_BLOG_SLUG_PAGE_SIZE) break;
        const last = page[page.length - 1];
        if (!last?.slug) break;
        cursor = { slug: last.slug };
      }
      return out.slice(0, SITEMAP_BLOG_ROW_CAP);
    },
    BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS,
    { scope: "blog", label: "blog_sitemap.slugs_batched_strict" },
  );
}

function blogSitemapDateFromYmdOrIso(value: string): Date {
  const v = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(`${v}T12:00:00Z`);
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

/**
 * Bundled static plus long-tail markdown for sitemap and static-only builds; deduped (static wins on slug).
 */
export function staticBlogSitemapSlugRows(): BlogSitemapSlugRow[] {
  const bySlug = new Map<string, BlogSitemapSlugRow>();
  for (const p of listStaticBlogPostsForIndex()) {
    const slug = p.slug?.trim();
    if (!slug) continue;
    bySlug.set(slug, { slug, careerSlug: null, updatedAt: new Date(`${p.createdAt}T12:00:00Z`) });
  }
  for (const r of listBlogStaticLongtailRecords()) {
    const slug = r.slug?.trim();
    if (!slug || bySlug.has(slug)) continue;
    bySlug.set(slug, { slug, careerSlug: null, updatedAt: blogSitemapDateFromYmdOrIso(r.updatedAt) });
  }
  return [...bySlug.values()];
}

/** DB rows first; supplement URLs only when no live row exists for that slug. */
export function mergeBlogSitemapRowsDbPrimary(
  dbRows: BlogSitemapSlugRow[],
  supplementRows: BlogSitemapSlugRow[],
): BlogSitemapSlugRow[] {
  const dbBySlug = new Map(dbRows.map((r) => [r.slug.trim(), r]));
  const dbSlugs = new Set(dbBySlug.keys());
  const extras = supplementRows.filter((r) => {
    const s = r.slug.trim();
    return Boolean(s) && !dbSlugs.has(s);
  });
  return [...dbRows, ...extras];
}

export async function getMergedBlogSitemapSlugRows(): Promise<BlogSitemapSlugRow[]> {
  if (!isDatabaseUrlConfigured() || shouldSkipBlogDbForProductionBuild() || shouldSkipDbBackedSitemapUrlsForBuild()) {
    return staticBlogSitemapSlugRows();
  }
  try {
    const dbRows = await getSitemapPublishedBlogSlugsStrict();
    if (dbRows.length > 0) {
      return mergeBlogSitemapRowsDbPrimary(dbRows, staticBlogSitemapSlugRows());
    }
    if (await canUseStaticBlogFallback()) return staticBlogSitemapSlugRows();
    return [];
  } catch (e) {
    if (await canUseStaticBlogFallback()) return staticBlogSitemapSlugRows();
    throw e;
  }
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

/**
 * Unique published tags and categories for sitemap hub pages.
 * DB rows merged with static corpus; deduped and sorted for deterministic output.
 * Tag hub: `/blog/tag/{tag}` — Category hub: `/blog/category/{category}`.
 */
export async function getSitemapBlogTagsAndCategories(): Promise<{
  tags: string[];
  categories: string[];
}> {
  const tagSet = new Set<string>();
  const categorySet = new Set<string>();

  // Seed from static corpus (always available, no DB timeout risk).
  for (const p of listStaticBlogPostsForIndex()) {
    for (const t of p.tags ?? []) { const v = t.trim(); if (v) tagSet.add(v); }
    const c = (p.category ?? "").trim(); if (c) categorySet.add(c);
  }
  for (const r of listBlogStaticLongtailRecords()) {
    for (const t of r.tags ?? []) { const v = t.trim(); if (v) tagSet.add(v); }
    const c = (r.category ?? "").trim(); if (c) categorySet.add(c);
  }

  if (!isDatabaseUrlConfigured() || shouldSkipBlogDbForProductionBuild()) {
    return { tags: [...tagSet].sort(), categories: [...categorySet].sort() };
  }

  const now = new Date();
  const dbRows = await withBlogTimeoutFallback(
    async () => {
      const out: { tags: string[]; category: string | null }[] = [];
      let cursor: { slug: string } | undefined;
      for (;;) {
        const page = await prisma.blogPost.findMany({
          where: blogLiveWhere(now),
          select: { tags: true, category: true, slug: true },
          orderBy: { slug: "asc" },
          take: SITEMAP_BLOG_SLUG_PAGE_SIZE,
          ...(cursor ? { cursor, skip: 1 } : {}),
        });
        if (page.length === 0) break;
        out.push(...page.map((r) => ({ tags: r.tags, category: r.category })));
        if (out.length >= SITEMAP_BLOG_ROW_CAP) break;
        if (page.length < SITEMAP_BLOG_SLUG_PAGE_SIZE) break;
        const last = page[page.length - 1];
        if (!last?.slug) break;
        cursor = { slug: last.slug };
      }
      return out;
    },
    [] as { tags: string[]; category: string | null }[],
    "blog_sitemap.tags_categories_batched",
    BLOG_SITEMAP_SLUG_LIST_TIMEOUT_MS,
  );

  for (const row of dbRows) {
    for (const t of row.tags ?? []) { const v = t.trim(); if (v) tagSet.add(v); }
    const c = (row.category ?? "").trim(); if (c) categorySet.add(c);
  }

  return { tags: [...tagSet].sort(), categories: [...categorySet].sort() };
}
