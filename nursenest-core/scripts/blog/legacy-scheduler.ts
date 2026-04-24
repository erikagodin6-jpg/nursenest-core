#!/usr/bin/env npx tsx
/**
 * Production-safe scheduler runner: mirrors `/api/cron/blog-batch-schedule` **without** Next.js `revalidatePath`
 * (run from cron or ops host with `DATABASE_URL` + optional `CRON_SECRET` for HTTP wrapper elsewhere).
 *
 * - Refills autopilot queue (`ensureDailyBlogQueue`)
 * - Processes due `BlogBatchScheduleItem` rows (`processDueBlogBatchScheduleItems`, max per invocation in lib)
 * - Promotes due `BlogPost` rows (`promoteScheduledBlogPosts` with retry / FAILED semantics)
 *
 * Usage (from `nursenest-core/`):
 *   npx tsx scripts/blog/legacy-scheduler.ts
 *   npx tsx scripts/blog/legacy-scheduler.ts --dry-run   (logs only; still hits DB read paths — use sparingly)
 *
 * Idempotent: safe on a schedule (e.g. every 5–10 minutes) alongside the HTTP cron route — **do not** run two
 * writers that duplicate topics; this script does not create duplicate schedules, only processes pending work.
 */
import "../../src/lib/db/script-env-bootstrap";
import { isDatabaseUrlConfigured } from "../../src/lib/db/safe-database";
import { ensureDailyBlogQueue, processDueBlogBatchScheduleItems } from "../../src/lib/blog/blog-batch-schedule";
import { promoteScheduledBlogPosts } from "../../src/lib/blog/blog-publish-scheduler";

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  if (!isDatabaseUrlConfigured()) {
    console.log(JSON.stringify({ ok: false, error: "DATABASE_URL not configured" }, null, 2));
    process.exit(1);
  }

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          message: "No database calls executed. Remove --dry-run to run ensureDailyBlogQueue + batch processing + promoteScheduled.",
        },
        null,
        2,
      ),
    );
    return;
  }

  const startedAt = Date.now();
  const [queue, batchResult, promoted] = await Promise.all([
    ensureDailyBlogQueue(),
    processDueBlogBatchScheduleItems(),
    promoteScheduledBlogPosts(),
  ]);

  const elapsedMs = Date.now() - startedAt;
  console.log(
    JSON.stringify(
      {
        ok: true,
        elapsedMs,
        queue,
        batchSchedule: batchResult,
        promotedScheduled: promoted.count,
        publishFailures: promoted.failures,
        skippedMaxRetries: promoted.skippedMaxRetries,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }));
  process.exit(1);
});
