/**
 * Safe public queries for localized blog articles.
 *
 * Follows the same fallback pattern as `safe-blog-queries.ts`:
 * - Wraps Prisma calls in `withDatabaseFallback` so missing DB doesn't crash SSR.
 * - Returns lightweight projections for list/card views.
 * - Enforces visibility rules (only PUBLISHED or SCHEDULED-past-publishAt).
 */

import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";

// ── Visibility ───────────────────────────────────────────────────────────────

function localizedBlogLiveWhere(now: Date = new Date()): Prisma.LocalizedBlogArticleWhereInput {
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
} satisfies Prisma.LocalizedBlogArticleSelect;

export type LocalizedBlogIndexPost = Prisma.LocalizedBlogArticleGetPayload<{ select: typeof indexSelect }>;

export const LOCALIZED_BLOG_LIST_PAGE_SIZE = 24;

/**
 * Get a paginated list of published localized blog articles for a specific
 * locale/region/profession/exam combination.
 */
export async function getPublishedLocalizedBlogPostsPage(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string;
  exam: string;
  page: number;
  pageSize?: number;
}): Promise<{ posts: LocalizedBlogIndexPost[]; total: number; page: number; pageSize: number }> {
  const safePage = Math.max(1, params.page);
  const safeSize = Math.min(100, Math.max(1, Math.floor(params.pageSize ?? LOCALIZED_BLOG_LIST_PAGE_SIZE)));
  const now = new Date();

  const where: Prisma.LocalizedBlogArticleWhereInput = {
    AND: [
      localizedBlogLiveWhere(now),
      { locale: params.locale },
      { region: params.region },
      { profession: params.profession },
      { exam: params.exam },
    ],
  };

  const [posts, total] = await Promise.all([
    withDatabaseFallback(
      () =>
        prisma.localizedBlogArticle.findMany({
          where,
          orderBy: { createdAt: "desc" },
          select: indexSelect,
          skip: (safePage - 1) * safeSize,
          take: safeSize,
        }),
      [],
    ),
    withDatabaseFallback(() => prisma.localizedBlogArticle.count({ where }), 0),
  ]);

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
} satisfies Prisma.LocalizedBlogArticleSelect;

export type LocalizedBlogFullPost = Prisma.LocalizedBlogArticleGetPayload<{ select: typeof fullSelect }>;

/**
 * Get a published localized blog article by its slug within a specific route family.
 */
export async function getPublishedLocalizedBlogBySlug(params: {
  locale: string;
  region: string;
  profession: string;
  exam: string;
  slug: string;
}): Promise<LocalizedBlogFullPost | null> {
  const now = new Date();
  const rows = await withDatabaseFallback(
    () =>
      prisma.localizedBlogArticle.findMany({
        where: {
          localizedSlug: params.slug,
          locale: params.locale,
          region: params.region,
          profession: params.profession,
          exam: params.exam,
        },
        select: fullSelect,
        take: 1,
      }),
    [],
  );

  const row = rows[0] ?? null;
  if (!row) return null;
  if (!localizedBlogIsLive({ contentStatus: row.contentStatus, scheduledAt: row.scheduledAt }, now)) return null;
  return row;
}

/**
 * Get all published variants of a canonical article (for hreflang generation).
 */
export async function getPublishedVariantsForCanonical(canonicalArticleId: string): Promise<
  { locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string }[]
> {
  const now = new Date();
  return withDatabaseFallback(
    () =>
      prisma.localizedBlogArticle.findMany({
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
      }),
    [],
  );
}

// ── Sitemap helpers ──────────────────────────────────────────────────────────

const SITEMAP_CAP = 50_000;

export async function getSitemapLocalizedBlogRows(): Promise<
  { locale: string; region: string; profession: string | null; exam: string | null; localizedSlug: string; updatedAt: Date }[]
> {
  const now = new Date();
  return withDatabaseFallback(
    () =>
      prisma.localizedBlogArticle.findMany({
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
      }),
    [],
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
} satisfies Prisma.LocalizedBlogArticleSelect;

export type LocalizedBlogAdminListRow = Prisma.LocalizedBlogArticleGetPayload<{ select: typeof adminListSelect }>;

export async function getAdminLocalizedBlogList(params: {
  canonicalArticleId?: string;
  region?: string;
  locale?: string;
  contentStatus?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: LocalizedBlogAdminListRow[]; total: number }> {
  const safePage = Math.max(1, params.page ?? 1);
  const safeSize = Math.min(100, Math.max(1, params.pageSize ?? 50));

  const where: Prisma.LocalizedBlogArticleWhereInput = {};
  if (params.canonicalArticleId) where.canonicalArticleId = params.canonicalArticleId;
  if (params.region) where.region = params.region;
  if (params.locale) where.locale = params.locale;
  if (params.contentStatus) where.contentStatus = params.contentStatus as never;

  const [rows, total] = await Promise.all([
    prisma.localizedBlogArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: adminListSelect,
      skip: (safePage - 1) * safeSize,
      take: safeSize,
    }),
    prisma.localizedBlogArticle.count({ where }),
  ]);

  return { rows, total };
}
