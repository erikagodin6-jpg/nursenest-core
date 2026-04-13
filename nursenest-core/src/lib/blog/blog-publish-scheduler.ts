import { BlogCampaignItemStatus, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Promotes SCHEDULED rows whose publishAt/scheduledAt has passed to PUBLISHED.
 * Idempotent; safe to run from cron every hour. Request-path visibility already
 * treats SCHEDULED + publishAt/scheduledAt <= now as live; this flips status for analytics and clarity.
 */
export async function promoteScheduledBlogPosts(now: Date = new Date()): Promise<{ count: number }> {
  if (!isDatabaseUrlConfigured()) {
    return { count: 0 };
  }
  try {
    const candidates = await prisma.blogPost.findMany({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        OR: [{ publishAt: { lte: now } }, { scheduledAt: { lte: now } }],
      },
      select: { id: true, publishAt: true, scheduledAt: true },
      take: 500,
    });
    if (candidates.length === 0) return { count: 0 };
    const ids = candidates.map((c) => c.id);
    let promotedCount = 0;
    for (const c of candidates) {
      const canonicalPublishAt = c.publishAt ?? c.scheduledAt ?? now;
      const res = await prisma.blogPost.updateMany({
        where: { id: c.id, postStatus: BlogPostStatus.SCHEDULED },
        data: {
          postStatus: BlogPostStatus.PUBLISHED,
          workflowStatus: BlogWorkflowStatus.PUBLISHED,
          publishAt: canonicalPublishAt,
        },
      });
      promotedCount += res.count;
    }
    await prisma.blogCampaignItem.updateMany({
      where: { postId: { in: ids } },
      data: { status: BlogCampaignItemStatus.PUBLISHED },
    });
    if (promotedCount > 0) {
      safeServerLog("blog_scheduler", "promoted_scheduled_posts", { count: promotedCount });
    }
    return { count: promotedCount };
  } catch (e) {
    safeServerLog("blog_scheduler", "promote_failed", { error: String(e) });
    return { count: 0 };
  }
}
