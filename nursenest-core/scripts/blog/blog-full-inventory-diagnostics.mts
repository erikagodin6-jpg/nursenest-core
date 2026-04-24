#!/usr/bin/env npx tsx
/**
 * Read-only blog inventory: totals, histograms, live vs excluded (blogLiveWhere), schedule buckets,
 * and sample rows excluded from public live lists.
 *
 * Prisma uses BlogPostStatus.NEEDS_REVIEW — reported as REVIEW_REQUIRED for editorial language.
 *
 *   npx tsx scripts/blog/blog-full-inventory-diagnostics.mts
 */
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BlogPostStatus, PrismaClient } from "@prisma/client";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env.local") });

import "../../src/lib/db/env-bootstrap";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";

const prisma = new PrismaClient();
const SAMPLE_LIMIT = 50;

const STATUS_ORDER: BlogPostStatus[] = [
  BlogPostStatus.DRAFT,
  BlogPostStatus.APPROVED,
  BlogPostStatus.NEEDS_REVIEW,
  BlogPostStatus.SCHEDULED,
  BlogPostStatus.PUBLISHED,
  BlogPostStatus.FAILED,
];

function statusLabelForReport(status: BlogPostStatus): string {
  if (status === BlogPostStatus.NEEDS_REVIEW) return "REVIEW_REQUIRED";
  return status;
}

function histogramFromGroupBy<K extends string>(
  rows: Array<Record<K, string | null> & { _count: { _all: number } }>,
  key: K,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const raw = row[key];
    const label = raw === null || raw === "" ? "(null)" : String(raw);
    out[label] = (out[label] ?? 0) + row._count._all;
  }
  return out;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[blog-full-inventory-diagnostics] DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const liveWhere = blogLiveWhere(now);

  const [
    total,
    groupedStatus,
    groupedTemplate,
    groupedCategory,
    groupedLegacy,
    visibleCount,
    excludedCount,
    publishedPublishAtNull,
    approvedTotal,
    scheduledFuture,
    needsReviewTotal,
    scheduledStuckNoDates,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.groupBy({ by: ["postStatus"], _count: { _all: true } }),
    prisma.blogPost.groupBy({ by: ["postTemplate"], _count: { _all: true } }),
    prisma.blogPost.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.blogPost.groupBy({ by: ["legacySource"], _count: { _all: true } }),
    prisma.blogPost.count({ where: liveWhere }),
    prisma.blogPost.count({ where: { NOT: liveWhere } }),
    prisma.blogPost.count({
      where: { postStatus: BlogPostStatus.PUBLISHED, publishAt: null },
    }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.APPROVED } }),
    prisma.blogPost.count({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        NOT: {
          OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
        },
      },
    }),
    prisma.blogPost.count({ where: { postStatus: BlogPostStatus.NEEDS_REVIEW } }),
    prisma.blogPost.count({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: null,
        scheduledAt: null,
      },
    }),
  ]);

  const byStatus: Record<string, number> = {};
  for (const s of STATUS_ORDER) byStatus[statusLabelForReport(s)] = 0;
  for (const row of groupedStatus) {
    byStatus[statusLabelForReport(row.postStatus)] = row._count._all;
  }

  const samples = await prisma.blogPost.findMany({
    where: { NOT: liveWhere },
    take: SAMPLE_LIMIT,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      postStatus: true,
      publishAt: true,
      scheduledAt: true,
      category: true,
      postTemplate: true,
      legacySource: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const report = {
    generatedAt: now.toISOString(),
    totalBlogPostCount: total,
    countByPostStatus: byStatus,
    countByTemplate: histogramFromGroupBy(groupedTemplate, "postTemplate"),
    countByCategory: histogramFromGroupBy(groupedCategory, "category"),
    countByLegacySource: histogramFromGroupBy(groupedLegacy, "legacySource"),
    visibleByBlogLiveWhereCount: visibleCount,
    excludedFromBlogLiveWhereCount: excludedCount,
    blogLiveWhereNote:
      "Aligned with src/lib/blog/blog-visibility.ts blogLiveWhere(now): PUBLISHED, APPROVED, or SCHEDULED with publishAt<=now OR scheduledAt<=now.",
    keyCounts: {
      PUBLISHED_with_publishAt_null: publishedPublishAtNull,
      APPROVED_total: approvedTotal,
      SCHEDULED_not_yet_live_future_gate: scheduledFuture,
      SCHEDULED_stuck_no_publishAt_or_scheduledAt: scheduledStuckNoDates,
      REVIEW_REQUIRED_total_maps_NEEDS_REVIEW: needsReviewTotal,
    },
    note:
      "REVIEW_REQUIRED maps to Prisma BlogPostStatus.NEEDS_REVIEW. Histogram keys (null) mean empty DB null.",
    sampleExcludedPosts: samples.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title.slice(0, 200),
      postStatus: statusLabelForReport(r.postStatus),
      postStatusRaw: r.postStatus,
      publishAt: r.publishAt?.toISOString() ?? null,
      scheduledAt: r.scheduledAt?.toISOString() ?? null,
      category: r.category,
      template: r.postTemplate,
      legacySource: r.legacySource,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  };

  console.log(JSON.stringify(report, null, 2));

  console.error("\n--- summary (human) ---");
  console.error(`total: ${total}`);
  console.error(`visible (blogLiveWhere): ${visibleCount}`);
  console.error(`excluded: ${excludedCount}`);
  console.error("by status (REVIEW_REQUIRED = NEEDS_REVIEW):");
  for (const s of STATUS_ORDER) {
    const label = statusLabelForReport(s);
    console.error(`  ${label}: ${byStatus[label] ?? 0}`);
  }
  console.error(
    `PUBLISHED publishAt null: ${publishedPublishAtNull}; APPROVED: ${approvedTotal}; SCHEDULED future gate: ${scheduledFuture}; SCHEDULED no dates: ${scheduledStuckNoDates}; REVIEW_REQUIRED: ${needsReviewTotal}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
