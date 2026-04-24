import { BlogCampaignItemStatus, BlogPostStatus, BlogWorkflowStatus, type Prisma } from "@prisma/client";
import { appendBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { blogPrePublishValidationSelect, validateBlogPrePublish } from "@/lib/blog/blog-pre-publish-validation";
import { publishBlogPostCanonical } from "@/lib/blog/publish-blog-post-canonical";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const MIN_BODY_CHARS_FOR_FAILED_RECOVERY = 200;

function overdueGate(now: Date): Prisma.BlogPostWhereInput {
  return {
    OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
  };
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
    const preRow = await prisma.blogPost.findUnique({
      where: { id: row.id },
      select: blogPrePublishValidationSelect,
    });
    if (!preRow) continue;
    const prePublish = await validateBlogPrePublish(preRow, row.id);
    if (!prePublish.okToPublish) {
      const blockedLog = appendBlogAdminPublishLog(row.adminPublishLog ?? [], {
        level: "error",
        event: "missed_publish_blocked_pre_publish",
        message: "Missed-publish recovery skipped — pre-publish validation failed (includes taxonomy gate).",
        detail: { blocking: prePublish.blocking.slice(0, 12) },
      });
      await prisma.blogPost
        .update({ where: { id: row.id }, data: { adminPublishLog: blockedLog } })
        .catch(() => undefined);
      continue;
    }
    try {
      await publishBlogPostCanonical({
        postId: row.id,
        publishAt: now,
        clearScheduledAt: false,
        context: "recover_missed_blog_batch",
        acknowledgePrePublishWarnings: true,
        skipRevalidate: true,
        extraLogEntries: [
          {
            level: "info",
            event: "missed_publish_recovered",
            message: "Recovered missed publish via canonical helper; scheduledAt preserved when present.",
            detail: { previousStatus: row.postStatus, slug: row.slug },
          },
        ],
      });
      recovered += 1;
      ids.push(row.id);
      slugs.push(row.slug);
    } catch (e) {
      safeServerLog("blog_recover", "missed_publish_canonical_failed", {
        postId: row.id,
        slug: row.slug,
        error: e instanceof Error ? e.message : String(e),
      });
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
