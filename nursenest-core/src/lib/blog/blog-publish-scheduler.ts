import { BlogCampaignItemStatus, BlogPostStatus, BlogWorkflowStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Promotes SCHEDULED rows whose publishAt has passed to PUBLISHED.
 * Idempotent; safe to run from cron every hour. Request-path visibility already
 * treats SCHEDULED + publishAt <= now as live; this flips status for analytics and clarity.
 */
export async function promoteScheduledBlogPosts(now: Date = new Date()): Promise<{ count: number }> {
  if (!isDatabaseUrlConfigured()) {
    return { count: 0 };
  }
  try {
    const candidates = await prisma.blogPost.findMany({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: { lte: now },
      },
      select: { id: true },
      take: 500,
    });
    if (candidates.length === 0) return { count: 0 };
    const ids = candidates.map((c) => c.id);
    const res = await prisma.blogPost.updateMany({
      where: { id: { in: ids } },
      data: { postStatus: BlogPostStatus.PUBLISHED, workflowStatus: BlogWorkflowStatus.PUBLISHED },
    });
    await prisma.blogCampaignItem.updateMany({
      where: { postId: { in: ids } },
      data: { status: BlogCampaignItemStatus.PUBLISHED },
    });
    if (res.count > 0) {
      safeServerLog("blog_scheduler", "promoted_scheduled_posts", { count: res.count });
    }
    return { count: res.count };
  } catch (e) {
    safeServerLog("blog_scheduler", "promote_failed", { error: String(e) });
    return { count: 0 };
  }
}
