import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";

/**
 * Generates and schedules blog posts from **active** topic batch schedules.
 *
 * **DigitalOcean App Platform:** add a Scheduled Job (Cron) component that POSTs to this URL every 5-10 minutes:
 * `Authorization: Bearer $CRON_SECRET` (same as `/api/cron/blog-publish` and `/api/cron/jobs`).
 *
 * Flow: finds `BlogBatchScheduleItem` rows with `status=PENDING` and `plannedPublishAt <= now` (schedule active),
 * runs up to 12 items per invocation via existing `generateBlogAiDraft` + canonical intent dedupe.
 */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const [result, promoted] = await Promise.all([
    processDueBlogBatchScheduleItems(),
    promoteScheduledBlogPosts(),
  ]);
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/sitemaps/blog.xml");
  revalidatePath("/sitemaps/localized-blog.xml");
  return NextResponse.json({
    ok: true,
    ...result,
    promotedScheduled: promoted.count,
    publishFailedCount: promoted.failures.length,
    publishFailures: promoted.failures,
    publishSkippedMaxRetries: promoted.skippedMaxRetries,
  });
}
