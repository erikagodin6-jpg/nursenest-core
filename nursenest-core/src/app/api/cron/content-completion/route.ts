import { NextResponse } from "next/server";
import { enforceCronSecretOrResponse } from "@/lib/cron/enforce-cron-secret";
import {
  estimatePathwayContentCompleteness,
  runLessonCompletionBatch,
} from "@/lib/lessons/lesson-batch-completion";
import { CronAdvisoryLock, releaseCronAdvisoryLock, tryAcquireCronAdvisoryLock } from "@/lib/cron/cron-advisory-lock";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function parsePathwayIds(): string[] {
  const raw = process.env.CONTENT_COMPLETION_CRON_PATHWAY_IDS?.trim();
  if (!raw) return ["us-rn-nclex-rn"];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Optional automated lesson completion batches. Enable with `CONTENT_COMPLETION_CRON_ENABLED=true`.
 * Uses `CONTENT_COMPLETION_CRON_PATHWAY_IDS` (comma-separated, default `us-rn-nclex-rn`).
 * Writes: controlled by `CONTENT_COMPLETION_CRON_WRITE=true` (default dry-run metrics only).
 */
export async function POST(req: Request) {
  const denied = enforceCronSecretOrResponse(req);
  if (denied) return denied;

  if (process.env.CONTENT_COMPLETION_CRON_ENABLED?.trim() !== "true") {
    return NextResponse.json({ ok: true, skipped: true, reason: "CONTENT_COMPLETION_CRON_ENABLED not true" });
  }

  const lockId = CronAdvisoryLock.contentCompletion;
  const acquired = await tryAcquireCronAdvisoryLock(lockId);
  if (!acquired) {
    safeServerLog("cron", "content_completion_skipped_overlap", {});
    return NextResponse.json({ ok: true, skipped: true, reason: "advisory_lock_held" });
  }

  const write = process.env.CONTENT_COMPLETION_CRON_WRITE?.trim() === "true";
  const batchSize = Math.min(
    20,
    Math.max(10, Number.parseInt(process.env.CONTENT_COMPLETION_CRON_BATCH_SIZE?.trim() ?? "15", 10) || 15),
  );
  const offset = Math.max(0, Number.parseInt(process.env.CONTENT_COMPLETION_CRON_OFFSET?.trim() ?? "0", 10) || 0);

  const started = Date.now();
  try {
    const pathways = parsePathwayIds();
    const results: Array<{
      pathwayId: string;
      beforePct: number;
      afterPct: number;
      report: Awaited<ReturnType<typeof runLessonCompletionBatch>>;
    }> = [];

    for (const pathwayId of pathways) {
      const beforeSnap = await estimatePathwayContentCompleteness(pathwayId);
      const report = await runLessonCompletionBatch({
        pathwayId,
        batchSize,
        offset,
        write,
        mode: "complete",
        onlyNotComplete: true,
      });
      const afterSnap = await estimatePathwayContentCompleteness(pathwayId);
      results.push({
        pathwayId,
        beforePct: beforeSnap.completenessApproxPct,
        afterPct: afterSnap.completenessApproxPct,
        report,
      });
    }

    const durationMs = Date.now() - started;
    safeServerLog("cron", "content_completion_batch", {
      durationMs,
      write,
      pathways: pathways.join(","),
      batchSize,
      offset,
      summary: JSON.stringify(
        results.map((r) => ({
          pathwayId: r.pathwayId,
          lessonsUpdated: r.report.lessonsUpdated,
          lessonsCompleted: r.report.lessonsCompleted,
        })),
      ),
    });

    return NextResponse.json({
      ok: true,
      durationMs,
      write,
      batchSize,
      offset,
      results,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("cron", "content_completion_failed", { message: msg });
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  } finally {
    await releaseCronAdvisoryLock(lockId);
  }
}
