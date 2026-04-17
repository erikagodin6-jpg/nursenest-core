import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { ensureDailyBlogQueue, processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { CronAdvisoryLock, releaseCronAdvisoryLock, tryAcquireCronAdvisoryLock } from "@/lib/cron/cron-advisory-lock";
import { safeServerLog } from "@/lib/observability/safe-server-log";

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
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  const lockId = CronAdvisoryLock.blogBatchSchedule;
  const acquired = await tryAcquireCronAdvisoryLock(lockId);
  if (!acquired) {
    safeServerLog("cron", "blog_batch_schedule_skipped_overlap", {});
    return NextResponse.json({ ok: true, skipped: true, reason: "advisory_lock_held" });
  }

  const started = Date.now();
  try {
    const [queue, result, promoted] = await Promise.all([
      ensureDailyBlogQueue(),
      processDueBlogBatchScheduleItems(),
      promoteScheduledBlogPosts(),
    ]);
    revalidatePath("/blog");
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    safeServerLog("cron", "blog_batch_schedule_complete", {
      durationMs: Date.now() - started,
      promoted: promoted.count,
      processedItems: result.processedItems,
    });
    return NextResponse.json({
    ok: true,
    dailyPublishingConfirmed: queue.dailyCadence >= 1 && queue.dailyCadence <= 3,
    dailyCadence: queue.dailyCadence,
    queueSize: queue.queueSize,
    queueTargetMin: queue.queueTargetMin,
    queueTargetMax: queue.queueTargetMax,
    generationTriggered: queue.generationTriggered,
    generatedTopicsAdded: queue.generatedTopicsAdded,
    queueNotes: queue.notes,
    queueContentTypes: queue.contentTypes,
    queueScheduleId: queue.activeScheduleId,
    queueNextPublishAt: queue.nextPublishAt,
    ...result,
    promotedScheduled: promoted.count,
    publishFailedCount: promoted.failures.length,
    publishFailures: promoted.failures,
    publishSkippedMaxRetries: promoted.skippedMaxRetries,
    });
  } finally {
    await releaseCronAdvisoryLock(lockId);
  }
}
