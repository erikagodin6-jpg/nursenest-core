import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_LESSON_BATCH_TOOL,
  resolveLessonBatchDerived,
  loadLessonBatchSummaryWithHydration,
  parseBatchSummary,
  syncJobResultSummaryJson,
} from "@/lib/lessons/admin-ai-lesson-batch";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type Props = { params: Promise<{ jobId: string }> };

export async function POST(_req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { jobId } = await ctx.params;
  const job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (job.tool !== ADMIN_LESSON_BATCH_TOOL) {
    return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
  }

  if (job.status === JobStatus.CANCELLED) {
    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    return NextResponse.json({ ok: true, alreadyCanceled: true, summary, derived });
  }

  if (job.status !== JobStatus.RUNNING && job.status !== JobStatus.PENDING) {
    return NextResponse.json(
      { error: "Job is not active; cancel applies to running batches only.", code: "NOT_ACTIVE" },
      { status: 409 },
    );
  }

  const queueCount = await prisma.lessonBatchQueueItem.count({ where: { jobId } });

  const canceledAtIso = new Date().toISOString();

  if (queueCount > 0) {
    const now = new Date();
    await prisma.$transaction([
      prisma.aiGenerationJob.update({
        where: { id: jobId },
        data: { status: JobStatus.CANCELLED, error: null, lessonBatchCanceledAt: now },
      }),
      prisma.lessonBatchQueueItem.updateMany({
        where: { jobId, status: "PENDING" },
        data: { status: "CANCELLED", canceledAt: now },
      }),
    ]);
    await syncJobResultSummaryJson(prisma, jobId);
  } else {
    const s = parseBatchSummary(job.resultSummary);
    const nextSummary = s
      ? {
          ...s,
          items: s.items.map((it) =>
            it.status === "pending"
              ? {
                  ...it,
                  status: "canceled" as const,
                  startedAt: null,
                  canceledAt: canceledAtIso,
                }
              : it,
          ),
        }
      : null;
    await prisma.aiGenerationJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.CANCELLED,
        error: null,
        lessonBatchCanceledAt: new Date(),
        ...(nextSummary ? { resultSummary: nextSummary as object } : {}),
      },
    });
  }

  const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
  const derived = summary ? resolveLessonBatchDerived(summary) : null;

  await prisma.aiGenerationLog.create({
    data: { jobId, step: "batch_canceled", detail: {} },
  });

  return NextResponse.json({ ok: true, summary, derived });
}
