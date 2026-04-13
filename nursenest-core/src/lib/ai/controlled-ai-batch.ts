/**
 * Shared controls for admin AI batch jobs (lessons + questions):
 * chunk size per HTTP request, resume-safe processing, failure threshold abort, idempotent creates.
 *
 * @see {@link module:@/lib/ai/content-generation-pipeline} — unified progress types, API paths, re-exports.
 */
import { JobStatus, type PrismaClient } from "@prisma/client";
import { z } from "zod";
import { parseQuestionBatchSummary } from "@/lib/ai/admin-ai-question-batch";

export const batchControlSchema = z.object({
  /** Max items to process in one POST /step (1–25). Default 1. */
  maxItemsPerRun: z.coerce.number().int().min(1).max(25).optional(),
  /** Stop batch after this many consecutive item failures (0 = disabled). Default 5. */
  maxConsecutiveFailures: z.coerce.number().int().min(0).max(50).optional(),
});

export type BatchControl = {
  maxItemsPerRun: number;
  maxConsecutiveFailures: number;
};

export const DEFAULT_BATCH_CONTROL: BatchControl = {
  maxItemsPerRun: 1,
  maxConsecutiveFailures: 5,
};

export const idempotencyKeySchema = z
  .string()
  .trim()
  .min(8)
  .max(200)
  .optional();

export function mergeBatchControl(
  stored: unknown,
  requestOverride: unknown,
): BatchControl {
  const fromStored = batchControlSchema.safeParse(
    stored && typeof stored === "object" ? (stored as Record<string, unknown>) : {},
  );
  const fromReq = batchControlSchema.safeParse(
    requestOverride && typeof requestOverride === "object" ? (requestOverride as Record<string, unknown>) : {},
  );
  const maxItems =
    fromReq.success && fromReq.data.maxItemsPerRun != null
      ? fromReq.data.maxItemsPerRun
      : fromStored.success && fromStored.data.maxItemsPerRun != null
        ? fromStored.data.maxItemsPerRun
        : DEFAULT_BATCH_CONTROL.maxItemsPerRun;
  const maxFails =
    fromReq.success && fromReq.data.maxConsecutiveFailures != null
      ? fromReq.data.maxConsecutiveFailures
      : fromStored.success && fromStored.data.maxConsecutiveFailures != null
        ? fromStored.data.maxConsecutiveFailures
        : DEFAULT_BATCH_CONTROL.maxConsecutiveFailures;
  return {
    maxItemsPerRun: maxItems,
    maxConsecutiveFailures: maxFails,
  };
}

/** Ordered lesson batch items: count consecutive failures from the start until we hit pending/generating. */
export function consecutiveFailuresLessonItems(
  items: Array<{ status: string; position: number }>,
): number {
  const sorted = [...items].sort((a, b) => a.position - b.position);
  let streak = 0;
  for (const it of sorted) {
    if (it.status === "pending" || it.status === "generating") break;
    if (it.status === "failed") streak += 1;
    else streak = 0;
  }
  return streak;
}

/** Question batch items are already in processing order. */
export function consecutiveFailuresQuestionItems(items: Array<{ status: string }>): number {
  let streak = 0;
  for (const it of items) {
    if (it.status === "pending" || it.status === "generating") break;
    if (it.status === "failed") streak += 1;
    else streak = 0;
  }
  return streak;
}

export const BATCH_ABORT_ERROR_THRESHOLD = "BATCH_ABORTED: consecutive failure threshold exceeded";

export async function abortLessonBatchForSafety(
  db: PrismaClient,
  jobId: string,
  reason: string,
): Promise<void> {
  const now = new Date();
  await db.lessonBatchQueueItem.updateMany({
    where: { jobId, status: "PENDING" },
    data: {
      status: "CANCELLED",
      canceledAt: now,
      lastError: reason.slice(0, 500),
      claimedByRequestId: null,
      startedAt: null,
    },
  });
  await db.aiGenerationJob.update({
    where: { id: jobId },
    data: { status: JobStatus.FAILED, error: reason.slice(0, 2000) },
  });
  await db.aiGenerationLog.create({
    data: {
      jobId,
      step: "batch_aborted_error_threshold",
      detail: { reason: reason.slice(0, 500) },
    },
  });
}

export async function abortQuestionBatchForSafety(
  db: PrismaClient,
  jobId: string,
  reason: string,
): Promise<void> {
  const job = await db.aiGenerationJob.findUnique({ where: { id: jobId } });
  const s = parseQuestionBatchSummary(job?.resultSummary);
  if (!s) return;
  const msg = reason.slice(0, 2000);
  const items = s.items.map((it) =>
    it.status === "pending" || it.status === "generating"
      ? { ...it, status: "failed" as const, error: msg, startedAt: null }
      : it,
  );
  await db.aiGenerationJob.update({
    where: { id: jobId },
    data: {
      resultSummary: { ...s, items } as object,
      status: JobStatus.FAILED,
      error: msg,
    },
  });
  await db.aiGenerationLog.create({
    data: {
      jobId,
      step: "batch_aborted_error_threshold",
      detail: { reason: reason.slice(0, 500), tool: "question_batch" },
    },
  });
}

export async function findJobByIdempotencyKey(
  db: PrismaClient,
  params: { createdById: string; tool: string; idempotencyKey: string; lookback?: number },
): Promise<{ id: string } | null> {
  const lookback = params.lookback ?? 80;
  const rows = await db.aiGenerationJob.findMany({
    where: { createdById: params.createdById, tool: params.tool },
    orderBy: { createdAt: "desc" },
    take: lookback,
    select: { id: true, inputPayload: true },
  });
  for (const r of rows) {
    const p = r.inputPayload as Record<string, unknown> | null;
    if (p && typeof p.idempotencyKey === "string" && p.idempotencyKey === params.idempotencyKey) {
      return { id: r.id };
    }
  }
  return null;
}
