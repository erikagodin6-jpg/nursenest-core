import { BlogCampaignItemStatus, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { appendBlogAdminPublishLog, parseBlogAdminPublishLog } from "@/lib/blog/blog-admin-publish-log";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Promotes due rows whose publishAt/scheduledAt has passed to PUBLISHED.
 * Idempotent; safe to run from cron every 5-10 minutes. Request-path visibility already
 * treats SCHEDULED + publishAt/scheduledAt <= now as live; this flips status for analytics and clarity.
 */
const MAX_AUTO_PUBLISH_RETRIES = 3;

export type PromoteScheduledBlogPostsResult = {
  count: number;
  considered: number;
  skippedMaxRetries: number;
  failures: Array<{ id: string; slug: string; attempt: number; error: string; exhausted: boolean }>;
};

function autoPublishFailureCount(adminPublishLog: unknown): number {
  return parseBlogAdminPublishLog(adminPublishLog).filter((entry) => entry.event === "auto_publish_failed").length;
}

export async function promoteScheduledBlogPosts(now: Date = new Date()): Promise<PromoteScheduledBlogPostsResult> {
  if (!isDatabaseUrlConfigured()) {
    return { count: 0, considered: 0, skippedMaxRetries: 0, failures: [] };
  }
  try {
    const candidates = await prisma.blogPost.findMany({
      where: {
        postStatus: { not: BlogPostStatus.PUBLISHED },
        OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
      },
      select: { id: true, slug: true, publishAt: true, scheduledAt: true, postStatus: true, adminPublishLog: true },
      orderBy: [{ publishAt: "asc" }, { scheduledAt: "asc" }, { updatedAt: "asc" }],
      take: 500,
    });
    if (candidates.length === 0) return { count: 0, considered: 0, skippedMaxRetries: 0, failures: [] };
    let promotedCount = 0;
    let skippedMaxRetries = 0;
    const failures: PromoteScheduledBlogPostsResult["failures"] = [];
    const promotedIds: string[] = [];

    for (const c of candidates) {
      const priorFailures = autoPublishFailureCount(c.adminPublishLog);
      if (priorFailures >= MAX_AUTO_PUBLISH_RETRIES) {
        skippedMaxRetries += 1;
        const exhaustedLog = appendBlogAdminPublishLog(c.adminPublishLog, {
          level: "error",
          event: "auto_publish_retries_exhausted",
          message: `Skipped auto-publish after ${MAX_AUTO_PUBLISH_RETRIES} failed attempts.`,
          detail: { retries: priorFailures },
        });
        await prisma.blogPost
          .update({
            where: { id: c.id },
            data: {
              postStatus: BlogPostStatus.FAILED,
              workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
              adminPublishLog: exhaustedLog,
            },
          })
          .catch(() => undefined);
        continue;
      }

      const canonicalPublishAt = c.publishAt ?? c.scheduledAt ?? now;
      try {
        const nextLog = appendBlogAdminPublishLog(c.adminPublishLog, {
          level: "info",
          event: "auto_published",
          message: "Published by scheduled auto-publish job.",
          detail: { previousStatus: c.postStatus, publishAt: canonicalPublishAt.toISOString() },
        });
        const res = await prisma.blogPost.updateMany({
          where: { id: c.id, postStatus: { not: BlogPostStatus.PUBLISHED } },
          data: {
            postStatus: BlogPostStatus.PUBLISHED,
            workflowStatus: BlogWorkflowStatus.PUBLISHED,
            publishAt: canonicalPublishAt,
            adminPublishLog: nextLog,
          },
        });
        promotedCount += res.count;
        if (res.count > 0) promotedIds.push(c.id);
      } catch (error) {
        const attempt = priorFailures + 1;
        const exhausted = attempt >= MAX_AUTO_PUBLISH_RETRIES;
        const errorText = error instanceof Error ? error.message : String(error);
        failures.push({
          id: c.id,
          slug: c.slug,
          attempt,
          error: errorText,
          exhausted,
        });
        safeServerLog("blog_scheduler", "auto_publish_failed", {
          id: c.id,
          slug: c.slug,
          attempt,
          exhausted,
          error: errorText,
        });
        const failedLog = appendBlogAdminPublishLog(c.adminPublishLog, {
          level: "error",
          event: "auto_publish_failed",
          message: `Auto-publish attempt ${attempt}/${MAX_AUTO_PUBLISH_RETRIES} failed.`,
          detail: { error: errorText, exhausted },
        });
        await prisma.blogPost
          .update({
            where: { id: c.id },
            data: {
              adminPublishLog: failedLog,
              ...(exhausted
                ? {
                    postStatus: BlogPostStatus.FAILED,
                    workflowStatus: BlogWorkflowStatus.FAILED_GENERATION,
                  }
                : {}),
            },
          })
          .catch(() => undefined);
      }
    }
    if (promotedIds.length > 0) {
      await prisma.blogCampaignItem.updateMany({
        where: { postId: { in: promotedIds } },
        data: { status: BlogCampaignItemStatus.PUBLISHED },
      });
    }
    if (promotedCount > 0) {
      safeServerLog("blog_scheduler", "promoted_scheduled_posts", { count: promotedCount });
    }
    return { count: promotedCount, considered: candidates.length, skippedMaxRetries, failures };
  } catch (e) {
    safeServerLog("blog_scheduler", "promote_failed", { error: String(e) });
    return { count: 0, considered: 0, skippedMaxRetries: 0, failures: [] };
  }
}

export async function recoverOverdueBlogPosts(
  now: Date = new Date(),
  limit = 10,
): Promise<{ count: number; ids: string[] }> {
  if (!isDatabaseUrlConfigured()) {
    return { count: 0, ids: [] };
  }
  const safeLimit = Math.max(1, Math.min(50, limit));
  try {
    const rows = await prisma.blogPost.findMany({
      where: {
        postStatus: { in: [BlogPostStatus.SCHEDULED, BlogPostStatus.DRAFT, BlogPostStatus.APPROVED] },
        OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
      },
      select: { id: true, publishAt: true, scheduledAt: true },
      orderBy: [{ publishAt: "asc" }, { scheduledAt: "asc" }, { updatedAt: "asc" }],
      take: safeLimit,
    });
    if (rows.length === 0) return { count: 0, ids: [] };

    let count = 0;
    const ids: string[] = [];
    for (const row of rows) {
      const publishAt = row.publishAt ?? row.scheduledAt ?? now;
      const res = await prisma.blogPost.updateMany({
        where: { id: row.id, postStatus: { in: [BlogPostStatus.SCHEDULED, BlogPostStatus.DRAFT, BlogPostStatus.APPROVED] } },
        data: {
          postStatus: BlogPostStatus.PUBLISHED,
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
          publishAt,
        },
      });
      if (res.count > 0) {
        count += 1;
        ids.push(row.id);
      }
    }
    if (count > 0) {
      safeServerLog("blog_scheduler", "recovered_overdue_posts", { count, ids });
    }
    return { count, ids };
  } catch (e) {
    safeServerLog("blog_scheduler", "recover_overdue_failed", { error: String(e) });
    return { count: 0, ids: [] };
  }
}
