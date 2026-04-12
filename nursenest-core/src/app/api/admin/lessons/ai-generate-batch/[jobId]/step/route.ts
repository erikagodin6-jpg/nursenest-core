import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  abortLessonBatchForSafety,
  BATCH_ABORT_ERROR_THRESHOLD,
  batchControlSchema,
  consecutiveFailuresLessonItems,
  mergeBatchControl,
} from "@/lib/ai/controlled-ai-batch";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import {
  ADMIN_LESSON_BATCH_TOOL,
  loadLessonBatchSummaryWithHydration,
  claimNextLessonBatchItem,
  resolveLessonBatchDerived,
  syncJobResultSummaryJson,
} from "@/lib/lessons/admin-ai-lesson-batch";
import { executeLessonBatchItemForClaimedRow } from "@/lib/lessons/admin-ai-lesson-batch-step-handler";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 180;

type Props = { params: Promise<{ jobId: string }> };

const stepBodySchema = z.object({
  batchControl: batchControlSchema.optional(),
});

export async function POST(req: Request, ctx: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) return NextResponse.json({ error: keyCheck.message }, { status: 503 });

  const rl = checkAdminAiGenerateLimit(gate.admin.userId);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" }, { status: 429 });
  }

  const { jobId } = await ctx.params;
  const bodyParsed = stepBodySchema.safeParse(await req.json().catch(() => ({})));
  const requestControl = bodyParsed.success ? bodyParsed.data.batchControl : undefined;

  const jobCheck = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!jobCheck) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (jobCheck.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (jobCheck.tool !== ADMIN_LESSON_BATCH_TOOL) {
    return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
  }

  const control = mergeBatchControl(jobCheck.inputPayload, requestControl);
  let processedInRequest = 0;
  let lastPayload: Record<string, unknown> | null = null;

  while (processedInRequest < control.maxItemsPerRun) {
    const requestId = randomUUID();
    const claim = await claimNextLessonBatchItem(prisma, jobId, requestId);

    if (claim.kind === "job_not_runnable") {
      await syncJobResultSummaryJson(prisma, jobId);
      const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
      const derived = summary ? resolveLessonBatchDerived(summary) : null;
      const j = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
      const payload: Record<string, unknown> = {
        done: true,
        stopped: true,
        reason: j?.status === JobStatus.CANCELLED ? "canceled" : "job_not_running",
        summary,
        derived,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      };
      if (processedInRequest > 0 && lastPayload) payload.lastItemResult = lastPayload;
      return NextResponse.json(payload);
    }

    if (claim.kind === "idle") {
      await syncJobResultSummaryJson(prisma, jobId);
      const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
      const derived = summary ? resolveLessonBatchDerived(summary) : null;
      const done = derived?.allTerminal ?? true;
      const payload = {
        done,
        idle: true,
        message: done ? "Batch finished" : "No claimable pending items",
        summary,
        derived,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      };
      if (processedInRequest > 0 && lastPayload) {
        return NextResponse.json({ ...payload, lastItemResult: lastPayload });
      }
      return NextResponse.json(payload);
    }

    const row = claim.row;
    const job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const inputPayload = job.inputPayload as Record<string, unknown>;
    const itemPayload = await executeLessonBatchItemForClaimedRow({
      db: prisma,
      jobId,
      row,
      jobInputPayload: inputPayload,
      gate: gate.admin,
    });

    processedInRequest += 1;
    lastPayload = itemPayload;

    const jobAfter = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
    if (jobAfter?.status === JobStatus.FAILED) {
      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_chunk_stopped",
          detail: { processedInRequest, reason: "job_failed" },
        },
      });
      return NextResponse.json({
        ...itemPayload,
        stopped: true,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      });
    }

    if (control.maxConsecutiveFailures > 0) {
      const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
      if (summary) {
        const streak = consecutiveFailuresLessonItems(summary.items);
        if (streak >= control.maxConsecutiveFailures) {
          await abortLessonBatchForSafety(prisma, jobId, BATCH_ABORT_ERROR_THRESHOLD);
          await syncJobResultSummaryJson(prisma, jobId);
          const summaryAfter = await loadLessonBatchSummaryWithHydration(prisma, jobId);
          const derivedAfter = summaryAfter ? resolveLessonBatchDerived(summaryAfter) : null;
          await prisma.aiGenerationLog.create({
            data: {
              jobId,
              step: "batch_chunk_stopped",
              detail: {
                processedInRequest,
                reason: "error_threshold",
                consecutiveFailures: streak,
                maxConsecutiveFailures: control.maxConsecutiveFailures,
              },
            },
          });
          return NextResponse.json({
            stopped: true,
            reason: "error_threshold",
            summary: summaryAfter,
            derived: derivedAfter,
            lastItemResult: itemPayload,
            batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
          });
        }
      }
    }

    const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
    const derived = summary ? resolveLessonBatchDerived(summary) : null;
    if (derived?.allTerminal) {
      await prisma.aiGenerationLog.create({
        data: {
          jobId,
          step: "batch_chunk_completed",
          detail: { processedInRequest, terminal: true },
        },
      });
      return NextResponse.json({
        ...itemPayload,
        batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
      });
    }
  }

  await prisma.aiGenerationLog.create({
    data: {
      jobId,
      step: "batch_chunk_completed",
      detail: { processedInRequest, terminal: false },
    },
  });

  return NextResponse.json({
    ...(lastPayload ?? {}),
    batchChunk: { processedInRequest, maxItemsPerRun: control.maxItemsPerRun },
  });
}
