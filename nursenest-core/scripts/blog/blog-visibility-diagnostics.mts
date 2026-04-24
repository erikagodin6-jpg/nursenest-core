#!/usr/bin/env npx tsx
/**
 * Read-only blog visibility audit: compares DB rows to `blogLiveWhere` / `blogPostIsLive` semantics.
 *
 * Usage (from nursenest-core/, requires DATABASE_URL):
 *   npx tsx scripts/blog/blog-visibility-diagnostics.mts
 *   npx tsx scripts/blog/blog-visibility-diagnostics.mts --sample-excluded 20
 *
 * Prints `dbProbe`: SELECT 1, legacySource seed counts, postStatus / workflowStatus / publishAt slices,
 * and `blogLiveWhere` live count for production triage (same DB URL the app uses).
 */
import { BlogPostStatus, BlogWorkflowStatus, PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";

import { blogLiveWhere, blogPostIsLive } from "../../src/lib/blog/blog-visibility";

function parseArgs(argv: string[]): { excludedSampleLimit: number } {
  let excludedSampleLimit = 12;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--sample-excluded" && argv[i + 1]) {
      excludedSampleLimit = Math.max(0, Math.min(200, parseInt(argv[i + 1]!, 10) || 0));
      i++;
    }
  }
  return { excludedSampleLimit };
}

function exclusionReason(row: {
  postStatus: BlogPostStatus;
  publishAt: Date | null;
  scheduledAt: Date | null;
}): string {
  const { postStatus, publishAt, scheduledAt } = row;
  if (postStatus === BlogPostStatus.DRAFT) return "status=DRAFT (not live)";
  if (postStatus === BlogPostStatus.NEEDS_REVIEW) return "status=NEEDS_REVIEW";
  if (postStatus === BlogPostStatus.APPROVED) return "unexpected: APPROVED matches blogLiveWhere (public-ready)";
  if (postStatus === BlogPostStatus.FAILED) return "status=FAILED";
  if (postStatus === BlogPostStatus.PUBLISHED) return "unexpected: PUBLISHED should match blogLiveWhere";
  if (postStatus === BlogPostStatus.SCHEDULED) {
    const gate = publishAt ?? scheduledAt;
    if (!gate) return "status=SCHEDULED but publishAt and scheduledAt are null";
    if (gate.getTime() > Date.now()) return `status=SCHEDULED, gate ${gate.toISOString()} is in the future`;
    return "status=SCHEDULED (unexpected)";
  }
  return `status=${postStatus}`;
}

function isControlPanelAiDraftLog(adminPublishLog: unknown): boolean {
  if (!Array.isArray(adminPublishLog)) return false;
  for (const e of adminPublishLog) {
    if (!e || typeof e !== "object") continue;
    const r = e as Record<string, unknown>;
    if (r.event === "draft_created" && typeof r.message === "string" && r.message.includes("control panel")) {
      return true;
    }
  }
  return false;
}

async function main(): Promise<void> {
  const { excludedSampleLimit } = parseArgs(process.argv);

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();
  const liveWhere = blogLiveWhere(now);

  try {
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1::int as ok`;
    const select1Ok = Array.isArray(ping) && ping[0]?.ok === 1;

    const total = await prisma.blogPost.count();
    const liveCount = await prisma.blogPost.count({ where: liveWhere });

    const PATHO_SEED = "pathophysiology-nursing-blog-seed";
    const legacySeedTotal = await prisma.blogPost.count({ where: { legacySource: PATHO_SEED } });
    const legacySeedLive = await prisma.blogPost.count({
      where: { AND: [liveWhere, { legacySource: PATHO_SEED }] },
    });
    const postStatusApproved = await prisma.blogPost.count({
      where: { postStatus: BlogPostStatus.APPROVED },
    });
    const postStatusPublished = await prisma.blogPost.count({
      where: { postStatus: BlogPostStatus.PUBLISHED },
    });
    const workflowStatusPublished = await prisma.blogPost.count({
      where: { workflowStatus: BlogWorkflowStatus.PUBLISHED },
    });
    const publishAtLteNow = await prisma.blogPost.count({
      where: { publishAt: { lte: now } },
    });
    const byStatus = await prisma.blogPost.groupBy({
      by: ["postStatus"],
      _count: { _all: true },
    });
    const statusMap = Object.fromEntries(byStatus.map((g) => [g.postStatus, g._count._all])) as Record<string, number>;

    const scheduledFuture = await prisma.blogPost.count({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        NOT: {
          OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
        },
      },
    });

    const recentDrafts = await prisma.blogPost.findMany({
      where: { postStatus: BlogPostStatus.DRAFT },
      orderBy: { createdAt: "desc" },
      take: 5000,
      select: { adminPublishLog: true },
    });
    let controlPanelStyleDraftsInRecent = 0;
    for (const r of recentDrafts) {
      if (isControlPanelAiDraftLog(r.adminPublishLog)) controlPanelStyleDraftsInRecent++;
    }

    const excludedRows = await prisma.blogPost.findMany({
      where: { NOT: liveWhere },
      orderBy: { updatedAt: "desc" },
      take: excludedSampleLimit,
      select: {
        id: true,
        slug: true,
        title: true,
        locale: true,
        postStatus: true,
        publishAt: true,
        scheduledAt: true,
        updatedAt: true,
        adminPublishLog: true,
      },
    });

    const excludedSamples = excludedRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title.slice(0, 120),
      locale: r.locale,
      postStatus: r.postStatus,
      publishAt: r.publishAt?.toISOString() ?? null,
      scheduledAt: r.scheduledAt?.toISOString() ?? null,
      updatedAt: r.updatedAt.toISOString(),
      exclusionReason: exclusionReason(r),
      matchesControlPanelDraftLog: isControlPanelAiDraftLog(r.adminPublishLog),
      liveByPredicate: blogPostIsLive(
        {
          postStatus: r.postStatus,
          publishAt: r.publishAt,
          scheduledAt: r.scheduledAt,
        },
        now,
      ),
    }));

    console.log(
      JSON.stringify(
        {
          at: now.toISOString(),
          dbProbe: {
            select1Ok,
            legacySourcePathophysiologySeedTotal: legacySeedTotal,
            legacySourcePathophysiologySeedMatchingBlogLiveWhere: legacySeedLive,
            postStatusPublishedTotal: postStatusPublished,
            workflowStatusPublishedTotal: workflowStatusPublished,
            publishAtLteNowTotal: publishAtLteNow,
            blogLiveWhereCount: liveCount,
          },
          totals: {
            allPosts: total,
            liveQueryMatch: liveCount,
            excludedFromLive: Math.max(0, total - liveCount),
            byPostStatus: statusMap,
            approvedCount: postStatusApproved,
            publishedCount: postStatusPublished,
            legacySourcePathophysiologySeed: legacySeedTotal,
            scheduledNotYetDue: scheduledFuture,
            recentDraftsScanned: recentDrafts.length,
            controlPanelStyleDraftsAmongRecentDrafts: controlPanelStyleDraftsInRecent,
          },
          livePrismaWhere: liveWhere,
          excludedSamples,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
