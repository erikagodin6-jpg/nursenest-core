/**
 * Safe public queries for localized blog articles.
 *
 * Follows the same fallback pattern as `safe-blog-queries.ts`:
 * - Wraps Prisma calls in `withDatabaseFallback` so missing DB doesn't crash SSR.
 * - Returns lightweight projections for list/card views.
 * - Enforces visibility rules (only PUBLISHED or SCHEDULED-past-publishAt).
 *
 * NOTE: This file keeps lightweight manual view types and a narrow model accessor
 * so localized blog reads stay robust even when broader Prisma typing changes.
 */

import "server-only";

import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { API_LIST_PAGE_SIZE_HARD_MAX } from "@/lib/api/api-pagination-limits";

const LOCALIZED_BLOG_PUBLIC_QUERY_TIMEOUT_MS = 1000;
const LOCALIZED_BLOG_SITEMAP_TIMEOUT_MS = 20_000;

async function withLocalizedBlogFallback<T>(run: () => Promise<T>, fallback: T, label: string, timeoutMs = LOCALIZED_BLOG_PUBLIC_QUERY_TIMEOUT_MS): Promise<T> {
  return withDatabaseFallbackTimeout(run, fallback, timeoutMs, {
    scope: "localized_blog",
    label,
  });
}

// ── Manual types (replace with Prisma imports after prisma generate) ─────────

export type LocalizedBlogIndexPost = {
  id: string;
  localizedTitle: string;
  localizedExcerpt: string;
  localizedSlug: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  contentStatus: string;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  canonicalArticleId: string;
};

export type LocalizedBlogFullPost = {
  id: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  sourceLanguage: string;
  adaptationType: string;
  contentStatus: string;
  aiModelVersion: string | null;
  localizedTitle: string;
  localizedExcerpt: string;
  localizedBody: string;
  canonicalSlug: string;
  localizedSlug: string;
  localizedMetaTitle: string | null;
  localizedMetaDescription: string | null;
  seoKeywordPrimary: string | null;
  seoKeywordSecondary: string[];
  searchIntent: string | null;
  hreflangJson: unknown;
  canonicalUrl: string | null;
  targetAudience: string | null;
  ctaVariant: string | null;
  ctaText: string | null;
  ctaHref: string | null;
  internalLinkTargets: unknown;
  complianceReviewRequired: boolean;
  medicalReviewRequired: boolean;
  editorialReviewRequired: boolean;
  reviewFlags: string[];
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalizedBlogAdminListRow = {
  id: string;
  canonicalArticleId: string;
  locale: string;
  region: string;
  profession: string | null;
  exam: string | null;
  localizedTitle: string;
  localizedSlug: string;
  contentStatus: string;
  adaptationType: string;
  complianceReviewRequired: boolean;
  medicalReviewRequired: boolean;
  editorialReviewRequired: boolean;
  reviewFlags: string[];
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// ── Visibility ───────────────────────────────────────────────────────────────

function localizedBlogLiveWhere(now: Date = new Date()): Record<string, unknown> {
  return {
    OR: [
      { contentStatus: "PUBLISHED" },
      { contentStatus: "SCHEDULED", scheduledAt: { lte: now } },
    ],
  };
}

export function localizedBlogIsLive(
  row: { contentStatus: string; scheduledAt: Date | null },
  now: Date = new Date(),
): boolean {
  if (row.contentStatus === "PUBLISHED") return true;
  if (row.contentStatus === "SCHEDULED" && row.scheduledAt && row.scheduledAt.getTime() <= now.getTime()) return true;
  return false;
}

export function shouldFallbackToEnglishLocale(
  requestedLocale: string,
  primaryMatchCount: number,
): boolean {
  return requestedLocale !== "en" && primaryMatchCount === 0;
}

export function buildLocalizedEnglishFallbackWhere(params: {
  slug: string;
  region: string;
  profession: string;
  exam: string;
}): Record<string, unknown> {
  return {
    OR: [{ localizedSlug: params.slug }, { canonicalSlug: params.slug }],
    locale: "en",
    region: params.region,
    profession: params.profession,
    exam: params.exam,
  };
}

// ── Prisma model accessor (typed escape hatch before prisma generate) ────────

function localizedModel(): {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown>;
  count: (args: Record<string, unknown>) => Promise<number>;
} {
  return prisma.localizedBlogArticle as unknown as {
    findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: Record<string, unknown>) => Promise<unknown>;
    count: (args: Record<string, unknown>) => Promise<number>;
  };
}

// ── List / index queries ─────────────────────────────────────────────────────

const indexSelect = {
  id: true,
  localizedTitle: true,
  localizedExcerpt: true,
  localizedSlug: true,
  locale: true,
  region: true,
  profession: true,
  exam: true,
  contentStatus: true,
  publishedAt: true,
  scheduledAt: true,
  createdAt: true,
  canonicalArticleId: true,
};

export const LOCALIZED_BLOG_LIST_PAGE_SIZE = 24;

export async function getPublishedLocalizedBlogPostsPage(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  page: number;
  pageSize?: number;
}): Promise<{ posts: LocalizedBlogIndexPost[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, params.page);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, Math.floor(params.pageSize ?? LOCALIZED_BLOG_LIST_PAGE_SIZE)));
  const now = new Date();

  const where = {
    AND: [
      localizedBlogLiveWhere(now),
      { locale: params.locale },
      { region: params.region },
      { profession: params.profession },
      { exam: params.exam },
    ],
  };

  const m = localizedModel();

  const [posts, total] = await Promise.all([
    withLocalizedBlogFallback(
      () =>
        m.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: indexSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }) as Promise<LocalizedBlogIndexPost[]>,
      [] as LocalizedBlogIndexPost[],
      "localized_blog_index.posts",
    ),
    withLocalizedBlogFallback(() => m.count({ where }), 0, "localized_blog_index.total"),
  ]);

  if (shouldFallbackToEnglishLocale(params.locale, posts.length)) {
    const fallbackWhere = {
      AND: [
        localizedBlogLiveWhere(now),
        { locale: "en" },
        { region: params.region },
        { profession: params.profession },
        { exam: params.exam },
      ],
    };
    const [fallbackPosts, fallbackTotal] = await Promise.all([
      withLocalizedBlogFallback(
        () =>
          m.findMany({
            where: fallbackWhere,
            orderBy: { createdAt: "desc" },
            select: indexSelect,
            skip: (safePage - 1) * safeSize,
            take: safeSize,
          }) as Promise<LocalizedBlogIndexPost[]>,
        [] as LocalizedBlogIndexPost[],
        "localized_blog_index.english_fallback_posts",
      ),
      withLocalizedBlogFallback(() => m.count({ where: fallbackWhere }), 0, "localized_blog_index.english_fallback_total"),
    ]);
    return { posts: fallbackPosts, total: fallbackTotal, page: safePage, pageSize: safeSize };
  }

  return { posts, total, page: safePage, pageSize: safeSize };
}

// ── Single article queries ───────────────────────────────────────────────────

const fullSelect = {
  id: true,
  canonicalArticleId: true,
  locale: true,
  region: true,
  profession: true,
  exam: true,
  sourceLanguage: true,
  adaptationType: true,
  contentStatus: true,
  aiModelVersion: true,
  localizedTitle: true,
  localizedExcerpt: true,
  localizedBody: true,
  canonicalSlug: true,
  localizedSlug: true,
  localizedMetaTitle: true,
  localizedMetaDescription: true,
  seoKeywordPrimary: true,
  seoKeywordSecondary: true,
  searchIntent: true,
  hreflangJson: true,
  canonicalUrl: true,
  targetAudience: true,
  ctaVariant: true,
  ctaText: true,
  ctaHref: true,
  internalLinkTargets: true,
  complianceReviewRequired: true,
  medicalReviewRequired: true,
  editorialReviewRequired: true,
  reviewFlags: true,
  publishedAt: true,
  scheduledAt: true,
  createdAt: true,
  updatedAt: true,
};

export async function getPublishedLocalizedBlogBySlug(params: {
  locale: string;
  region: string;
  profession: string;
  exam: string;
  slug: string;
}): Promise<LocalizedBlogFullPost | null> {
  const now = new Date();
  const m = localizedModel();
  const rows = await withLocalizedBlogFallback(
    () =>
      m.findMany({
        where: {
          localizedSlug: params.slug,
          locale: params.locale,
          region: params.region,
          profession: params.profession,
          exam: params.exam,
        },
        select: fullSelect,
        take: 1,
      }) as Promise<LocalizedBlogFullPost[]>,
    [] as LocalizedBlogFullPost[],
    "localized_blog_post.primary",
  );

  const row = rows[0] ?? null;
  if (shouldFallbackToEnglishLocale(params.locale, row ? 1 : 0)) {
    const fallbackRows = await withLocalizedBlogFallback(
      () =>
        m.findMany({
          where: buildLocalizedEnglishFallbackWhere({
            slug: params.slug,
            region: params.region,
            profession: params.profession,
            exam: params.exam,
          }),
          select: fullSelect,
          take: 1,
        }) as Promise<LocalizedBlogFullPost[]>,
      [] as LocalizedBlogFullPost[],
      "localized_blog_post.english_fallback",
    );
    const fallback = fallbackRows[0] ?? null;
    if (!fallback) return null;
    if (
      !localizedBlogIsLive(
        { contentStatus: fallback.contentStatus, scheduledAt: fallback.scheduledAt },
        now,
      )
    ) {
      return null;
    }
    return fallback;
  }
  if (!row) return null;
  if (!localizedBlogIsLive({ contentStatus: row.contentStatus, scheduledAt: row.scheduledAt }, now)) return null;
  return row;
}

export async function getPublishedVariantsForCanonical(canonicalArticleId: string): Promise<
  { locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string }[]
> {
  const now = new Date();
  const m = localizedModel();
  return withLocalizedBlogFallback(
    () =>
      m.findMany({
        where: {
          canonicalArticleId,
          ...localizedBlogLiveWhere(now),
        },
        select: {
          locale: true,
          region: true,
          profession: true,
          exam: true,
          localizedSlug: true,
        },
      }) as Promise<{ locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string }[]>,
    [],
    "localized_blog_post.variants",
  );
}

// ── Sitemap helpers ──────────────────────────────────────────────────────────

const SITEMAP_CAP = 50_000;

export async function getSitemapLocalizedBlogRows(): Promise<
  { locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string; updatedAt: Date }[]
> {
  const now = new Date();
  const m = localizedModel();
  return withLocalizedBlogFallback(
    () =>
      m.findMany({
        where: localizedBlogLiveWhere(now),
        select: {
          locale: true,
          region: true,
          profession: true,
          exam: true,
          localizedSlug: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: SITEMAP_CAP,
      }) as Promise<{ locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string; updatedAt: Date }[]>,
    [],
    "localized_blog_sitemap.rows",
    LOCALIZED_BLOG_SITEMAP_TIMEOUT_MS,
  );
}

// ── Admin queries ────────────────────────────────────────────────────────────

const adminListSelect = {
  id: true,
  canonicalArticleId: true,
  locale: true,
  region: true,
  profession: true,
  exam: true,
  localizedTitle: true,
  localizedSlug: true,
  contentStatus: true,
  adaptationType: true,
  complianceReviewRequired: true,
  medicalReviewRequired: true,
  editorialReviewRequired: true,
  reviewFlags: true,
  publishedAt: true,
  scheduledAt: true,
  createdAt: true,
  updatedAt: true,
};

export async function getAdminLocalizedBlogList(params: {
  canonicalArticleId?: string;
  region?: string;
  locale?: string;
  contentStatus?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: LocalizedBlogAdminListRow[]; total: number }> {
  const safePage = Math.max(1, params.page ?? 1);
  const safeSize = Math.min(API_LIST_PAGE_SIZE_HARD_MAX, Math.max(1, params.pageSize ?? 50));

  const where: Record<string, unknown> = {};
  if (params.canonicalArticleId) where.canonicalArticleId = params.canonicalArticleId;
  if (params.region) where.region = params.region;
  if (params.locale) where.locale = params.locale;
  if (params.contentStatus) where.contentStatus = params.contentStatus;

  const m = localizedModel();

  const [rows, total] = await Promise.all([
    m.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: adminListSelect,
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }) as Promise<LocalizedBlogAdminListRow[]>,
    m.count({ where }),
  ]);

  return { rows, total };
}
