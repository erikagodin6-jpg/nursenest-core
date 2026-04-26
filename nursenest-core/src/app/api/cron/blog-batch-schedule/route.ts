import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import { ensureDailyBlogQueue, processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";
import { verifyBlogPublishSchemaColumns } from "@/lib/blog/blog-publish-db-guard";
import { promoteScheduledBlogPosts } from "@/lib/blog/blog-publish-scheduler";
import { revalidateBlogPublishingSurfaces } from "@/lib/blog/blog-revalidate-publishing";
import { CronAdvisoryLock, releaseCronAdvisoryLock, tryAcquireCronAdvisoryLock } from "@/lib/cron/cron-advisory-lock";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Generates and schedules blog posts from active topic batch schedules.
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
      const missingColumns = schema.missing.join(",");

      safeServerLog("cron", "blog_batch_schedule_schema_blocked", {
        missingColumns,
        reason: schema.reason ?? undefined,
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

    revalidateBlogPublishingSurfaces({ promotedSlugs: promoted.promotedSlugs });

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