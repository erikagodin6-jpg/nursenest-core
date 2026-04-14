import { BlogCampaignItemStatus, BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";
import { appendBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

const MIN_BODY_CHARS_FOR_FAILED_RECOVERY = 200;

function overdueGate(now: Date) {
  return {
    OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
  } as const;
}

/** Scheduled / approved / draft rows that should already be public but never left `PUBLISHED`. */
export function missedScheduledBlogWhere(now: Date = new Date()): Prisma.BlogPostWhereInput {
  return {
    AND: [
      overdueGate(now),
      {
        postStatus: {
          in: [BlogPostStatus.SCHEDULED, BlogPostStatus.DRAFT, BlogPostStatus.APPROVED],
        },
      },
    ],
  };
}

/**
 * Failed publish/generation rows that still look like usable HTML articles.
 * Conservative: body length only (no AI re-run).
 */
export function missedFailedBlogWhere() {
  return {
    postStatus: BlogPostStatus.FAILED,
    NOT: { body: "" },
  };
}

export async function countMissedBlogPostBacklog(now: Date = new Date()): Promise<number> {
  if (!isDatabaseUrlConfigured()) return 0;
  const scheduledLike = await prisma.blogPost.count({ where: missedScheduledBlogWhere(now) });
  const failedHeavyRows = await prisma.$queryRaw<{ c: bigint }[]>`
    SELECT COUNT(*)::bigint AS c
    FROM "BlogPost"
    WHERE "postStatus" = 'FAILED'
      AND char_length("body") >= ${MIN_BODY_CHARS_FOR_FAILED_RECOVERY}
  `;
  const failedHeavy = Number(failedHeavyRows[0]?.c ?? 0);
  return scheduledLike + failedHeavy;
}

export type RecoverMissedBlogPostsBatchResult = {
  recovered: number;
  ids: string[];
  slugs: string[];
  backlogAfter: number;
};

/**
 * Publishes up to `limit` missed posts. Sets `publishAt` to `now` (SEO go-live time) and does **not** clear `scheduledAt`.
 * Idempotent per row: only updates non-`PUBLISHED` rows. No new rows → no slug duplicates.
 */
export async function recoverMissedBlogPostsBatch(
  now: Date = new Date(),
  limit: number = 5,
): Promise<RecoverMissedBlogPostsBatchResult> {
  if (!isDatabaseUrlConfigured()) {
    return { recovered: 0, ids: [], slugs: [], backlogAfter: 0 };
  }
  const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));

  const scheduledCandidates = await prisma.blogPost.findMany({
    where: missedScheduledBlogWhere(now),
    select: { id: true, slug: true, postStatus: true, publishAt: true, scheduledAt: true, adminPublishLog: true },
    orderBy: [{ publishAt: "asc" }, { scheduledAt: "asc" }, { updatedAt: "asc" }],
    take: safeLimit,
  });

  const need = safeLimit - scheduledCandidates.length;
  const failedFetch =
    need > 0
      ? await prisma.blogPost.findMany({
          where: missedFailedBlogWhere(),
          select: { id: true, slug: true, body: true, postStatus: true, adminPublishLog: true },
          orderBy: { updatedAt: "asc" },
          take: need * 3,
        })
      : [];

  const failedCandidates = failedFetch
    .filter((r) => r.body.length >= MIN_BODY_CHARS_FOR_FAILED_RECOVERY)
    .slice(0, need);

  const merged = [...scheduledCandidates, ...failedCandidates];
  const seen = new Set<string>();
  const targets = merged.filter((r) => {
    if (seen.has(r.id)) return false;
    seen.add(r.id);
    return true;
  });

  let recovered = 0;
  const ids: string[] = [];
  const slugs: string[] = [];

  for (const row of targets) {
    const log = appendBlogAdminPublishLog(row.adminPublishLog ?? [], {
      level: "info",
      event: "missed_publish_recovered",
      message: "Recovered missed publish: set live with publishAt=now; scheduledAt preserved when present.",
      detail: {
        previousStatus: row.postStatus,
        slug: row.slug,
      },
    });
    const res = await prisma.blogPost.updateMany({
      where: { id: row.id, postStatus: { not: BlogPostStatus.PUBLISHED } },
      data: {
        postStatus: BlogPostStatus.PUBLISHED,
        workflowStatus: BlogWorkflowStatus.PUBLISHED,
        publishAt: now,
        adminPublishLog: log,
      },
    });
    if (res.count > 0) {
      recovered += 1;
      ids.push(row.id);
      slugs.push(row.slug);
    }
  }

  if (ids.length > 0) {
    await prisma.blogCampaignItem.updateMany({
      where: { postId: { in: ids } },
      data: { status: BlogCampaignItemStatus.PUBLISHED },
    });
  }

  const backlogAfter = await countMissedBlogPostBacklog(now);
  return { recovered, ids, slugs, backlogAfter };
}
