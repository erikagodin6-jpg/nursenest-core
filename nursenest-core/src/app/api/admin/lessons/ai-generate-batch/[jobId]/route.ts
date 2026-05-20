import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_LESSON_BATCH_TOOL,
  isTerminalBatchStatus,
  loadLessonBatchSummaryWithHydration,
  parseBatchSummary,
  resolveLessonBatchDerived,
  reviveStaleGeneratingItems,
  reviveStaleLessonBatchQueueItems,
  reconcileGeneratingItemsWithDrafts,
  syncJobResultSummaryJson,
  toAdminLessonBatchJobSnapshot,
} from "@/lib/lessons/admin-ai-lesson-batch";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ jobId: string }> };

export async function GET(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { jobId } = await ctx.params;
  let job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (job.tool !== ADMIN_LESSON_BATCH_TOOL) {
    return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
  }

  /** Heavy DB reconciliation — only when `?repair=1` (e.g. after `/step`); plain GET is read-only. */
  const wantsRepair = new URL(req.url).searchParams.get("repair") === "1";

  const hasQueue = await prisma.lessonBatchQueueItem.count({ where: { jobId } });
  if (hasQueue > 0 && wantsRepair) {
    await reviveStaleLessonBatchQueueItems(prisma, jobId);
    const reconciled = await reconcileGeneratingItemsWithDrafts(prisma, jobId);
    if (reconciled) {
      await syncJobResultSummaryJson(prisma, jobId);
    }
    job = (await prisma.aiGenerationJob.findUnique({ where: { id: jobId } })) ?? job;
  } else if (hasQueue === 0 && wantsRepair) {
    let summary = parseBatchSummary(job.resultSummary);
    if (summary) {
      const { summary: revived, mutated } = reviveStaleGeneratingItems(summary);
      if (mutated) {
        const allDone = revived.items.every((i) => isTerminalBatchStatus(i.status));
        const preserveTerminalJob =
          job.status === JobStatus.CANCELLED || job.status === JobStatus.FAILED;
        let nextJobStatus: JobStatus = job.status;
        if (!preserveTerminalJob) {
          nextJobStatus = allDone ? JobStatus.COMPLETED : JobStatus.RUNNING;
        }
        await prisma.aiGenerationJob.update({
          where: { id: jobId },
          data: {
            resultSummary: revived as object,
            status: nextJobStatus,
          },
        });
        job = (await prisma.aiGenerationJob.findUnique({ where: { id: jobId } })) ?? job;
      }
    }
  }

  const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
  const derived = summary ? resolveLessonBatchDerived(summary) : null;

  const latest = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!latest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    job: toAdminLessonBatchJobSnapshot(latest),
    summary,
    derived,
    inputPayload: latest.inputPayload,
  });
}
