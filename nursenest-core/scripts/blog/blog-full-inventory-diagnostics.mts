#!/usr/bin/env npx tsx
/**
 * Read-only inventory: total BlogPost rows, status histogram, publish-schedule gaps, `blogLiveWhere` exclusion
 * count, and 25 sample rows **not** matching public live list semantics (same filter as `/blog` lists).
 *
 * Prisma `BlogPostStatus` uses **NEEDS_REVIEW** (there is no `REVIEW_REQUIRED` enum value) — reported as
 * `REVIEW_REQUIRED` in JSON for product language alignment with editorial "review queue" posts.
 *
 * Usage (from nursenest-core/, requires DATABASE_URL):
 *   npx tsx scripts/blog/blog-full-inventory-diagnostics.mts
 */
import { BlogPostStatus, PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";

const prisma = new PrismaClient();

const SAMPLE_LIMIT = 25;

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

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("[blog-full-inventory-diagnostics] DATABASE_URL is not set.");
    process.exit(1);
  }

  const now = new Date();
  const liveWhere = blogLiveWhere(now);

  const total = await prisma.blogPost.count();

  const grouped = await prisma.blogPost.groupBy({
    by: ["postStatus"],
    _count: { _all: true },
  });
  const byStatus: Record<string, number> = {};
  for (const s of STATUS_ORDER) byStatus[statusLabelForReport(s)] = 0;
  for (const row of grouped) {
    byStatus[statusLabelForReport(row.postStatus)] = row._count._all;
  }

  const publishedPublishAtNull = await prisma.blogPost.count({
    where: { postStatus: BlogPostStatus.PUBLISHED, publishAt: null },
  });

  const scheduledPublishAtFuture = await prisma.blogPost.count({
    where: {
      postStatus: BlogPostStatus.SCHEDULED,
      publishAt: { not: null, gt: now },
    },
  });

  const approvedWithoutPublishAt = await prisma.blogPost.count({
    where: { postStatus: BlogPostStatus.APPROVED, publishAt: null },
  });

  const excludedFromLiveList = await prisma.blogPost.count({
    where: { NOT: liveWhere },
  });

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
      category: true,
      postTemplate: true,
      legacySource: true,
    },
  });

  const report = {
    generatedAt: now.toISOString(),
    totalBlogPostCount: total,
    countByPostStatus: byStatus,
    note:
      "REVIEW_REQUIRED count maps to Prisma enum BlogPostStatus.NEEDS_REVIEW (editorial review queue before publish).",
    scheduleAnomalies: {
      PUBLISHED_with_publishAt_null: publishedPublishAtNull,
      SCHEDULED_with_publishAt_in_future: scheduledPublishAtFuture,
      APPROVED_without_publishAt: approvedWithoutPublishAt,
    },
    excludedFromBlogLiveWhereCount: excludedFromLiveList,
    blogLiveWhereSemantics: "Same OR as src/lib/blog/blog-visibility.ts blogLiveWhere(now).",
    sampleMissingPosts: samples.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title.slice(0, 200),
      postStatus: statusLabelForReport(r.postStatus),
      postStatusRaw: r.postStatus,
      publishAt: r.publishAt?.toISOString() ?? null,
      category: r.category,
      template: r.postTemplate,
      legacySource: r.legacySource,
    })),
  };

  console.log(JSON.stringify(report, null, 2));

  console.error("\n--- summary (human) ---");
  console.error(`total: ${total}`);
  console.error("by status (REVIEW_REQUIRED = NEEDS_REVIEW):");
  for (const s of STATUS_ORDER) {
    const label = statusLabelForReport(s);
    console.error(`  ${label}: ${byStatus[label] ?? 0}`);
  }
  console.error(`excluded from blogLiveWhere(now): ${excludedFromLiveList}`);
  console.error(
    `anomalies — PUBLISHED publishAt null: ${publishedPublishAtNull}; SCHEDULED publishAt>now: ${scheduledPublishAtFuture}; APPROVED publishAt null: ${approvedWithoutPublishAt}`,
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
