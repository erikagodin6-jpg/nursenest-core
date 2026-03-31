import { BlogPostStatus } from "@prisma/client";
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
    const res = await prisma.blogPost.updateMany({
      where: {
        postStatus: BlogPostStatus.SCHEDULED,
        publishAt: { lte: now },
      },
      data: { postStatus: BlogPostStatus.PUBLISHED },
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
