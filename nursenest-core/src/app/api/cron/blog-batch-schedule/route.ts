import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { ensureDailyBlogQueue, processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";
import { verifyBlogPublishSchemaColumns } from "@/lib/blog/blog-publish-db-guard";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
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
 * Fails closed with **503** (like `/api/cron/blog-publish`) when `BlogPost` columns required for publishing are missing.
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
    const schema = await verifyBlogPublishSchemaColumns();
    if (!schema.ok) {
      safeServerLog("cron", "blog_batch_schedule_schema_blocked", {
        missingColumns: schema.missing,
        reason: schema.reason ?? null,
      });
      return NextResponse.json(
        {
          ok: false,
          error: "Blog publish schema mismatch",
          missingColumns: schema.missing,
          checkedAt: schema.checkedAt,
          reason: schema.reason ?? null,
        },
        { status: 503 },
      );
    }

    const [queue, result, promoted] = await Promise.all([
      ensureDailyBlogQueue(),
      processDueBlogBatchScheduleItems(),
      promoteScheduledBlogPosts(),
    ]);
    revalidateBlogPublishingSurfaces();
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
