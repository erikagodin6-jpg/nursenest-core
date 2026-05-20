import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import { createContentAutomationLogSafe } from "@/lib/admin/content-automation-log";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function runSitemapRevalidateBulkJob(opts: {
  correlationId: string;
  createdById: string;
}): Promise<void> {
  const { correlationId, createdById } = opts;
  safeServerLog("content_bulk", "sitemap_revalidate_start", { correlationId });
  try {
    revalidateBlogPublishingSurfaces();
    await createContentAutomationLogSafe({
      category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
      jobType: "bulk_sitemap_revalidate",
      status: ContentAutomationLogStatus.SUCCEEDED,
      topic: "sitemap / publishing cache",
      summary: "revalidateBlogPublishingSurfaces()",
      metadata: { correlationId },
      correlationId,
      createdById,
    });
    safeServerLog("content_bulk", "sitemap_revalidate_done", { correlationId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await createContentAutomationLogSafe({
      category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PERSIST,
      jobType: "bulk_sitemap_revalidate",
      status: ContentAutomationLogStatus.FAILED,
      topic: "sitemap / publishing cache",
      summary: "revalidate failed",
      error: msg.slice(0, 4000),
      metadata: { correlationId },
      correlationId,
      createdById,
    });
    throw e;
  }
}
