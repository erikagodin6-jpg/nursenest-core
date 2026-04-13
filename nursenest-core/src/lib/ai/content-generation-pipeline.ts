/**
 * Controlled **lesson + question** AI generation pipeline — shared contract and reporting.
 *
 * Implemented by admin HTTP handlers (batch create + stepped workers):
 *
 * | Feature | Lessons | Questions |
 * |--------|---------|-----------|
 * | Batch size limit (`maxItemsPerRun`) | `POST .../lessons/ai-generate-batch/[jobId]/step` body `batchControl` | same under `.../exam-questions/generate-batch/[jobId]/step` |
 * | Resume (skip completed / terminal items) | DB queue `LessonBatchQueueItem` + claim | `resultSummary.items` status |
 * | Logging | `AiGenerationLog` per step + batch chunk | same |
 * | Idempotent job create | `idempotencyKey` on `POST .../lessons/ai-generate-batch` | same on `.../generate-batch` |
 * | Error threshold abort | `maxConsecutiveFailures` → {@link abortLessonBatchForSafety} | {@link abortQuestionBatchForSafety} |
 *
 * Per-item idempotency: `lessonBatchTopicKey` / `questionBatchTopicKey` + draft lookups; stem-hash dedup for questions.
 */
import {
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  isTerminalQuestionBatchStatus,
  parseQuestionBatchSummary,
  type QuestionBatchResultSummaryV1,
} from "@/lib/ai/admin-ai-question-batch";
import {
  ADMIN_LESSON_BATCH_TOOL,
  isTerminalBatchStatus,
  parseBatchSummary,
  resolveLessonBatchDerived,
  type LessonBatchItem,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";

/** Re-export for callers that gate on `AiGenerationJob.tool`. */
export { ADMIN_LESSON_BATCH_TOOL } from "@/lib/lessons/admin-ai-lesson-batch";
export { ADMIN_QUESTION_BATCH_JOB_TOOL } from "@/lib/ai/admin-ai-question-batch";

export {
  abortLessonBatchForSafety,
  abortQuestionBatchForSafety,
  BATCH_ABORT_ERROR_THRESHOLD,
  batchControlSchema,
  consecutiveFailuresLessonItems,
  consecutiveFailuresQuestionItems,
  DEFAULT_BATCH_CONTROL,
  findJobByIdempotencyKey,
  idempotencyKeySchema,
  mergeBatchControl,
  type BatchControl,
} from "@/lib/ai/controlled-ai-batch";

/** Where operators drive batch workers (relative to app origin). */
export const CONTENT_GENERATION_BATCH_API = {
  lessonBatchCreate: "/api/admin/lessons/ai-generate-batch",
  lessonBatchStep: (jobId: string) => `/api/admin/lessons/ai-generate-batch/${jobId}/step`,
  questionBatchCreate: "/api/admin/ai/exam-questions/generate-batch",
  questionBatchStep: (jobId: string) => `/api/admin/ai/exam-questions/generate-batch/${jobId}/step`,
} as const;

export type ContentGenerationBatchKind = "lesson" | "question";

/** Serializable progress for dashboards, logs, and CLI wrappers. */
export type ContentGenerationBatchProgress = {
  kind: ContentGenerationBatchKind;
  tool: typeof ADMIN_LESSON_BATCH_TOOL | typeof ADMIN_QUESTION_BATCH_JOB_TOOL;
  total: number;
  pending: number;
  generating: number;
  completed: number;
  failed: number;
  skippedDuplicate: number;
  /** Question batches only — near-duplicate stem within bank/drafts. */
  skippedDuplicateStem: number;
  /** Lesson batches only — user cancel. */
  canceled: number;
  allTerminal: boolean;
};

/** Progress from a hydrated lesson batch summary (uses persisted `derived` when present). */
export function lessonBatchProgress(summary: LessonBatchResultSummaryV1): ContentGenerationBatchProgress {
  const d = resolveLessonBatchDerived(summary);
  return {
    kind: "lesson",
    tool: ADMIN_LESSON_BATCH_TOOL,
    total: d.total,
    pending: d.pending,
    generating: d.generating,
    completed: d.completed,
    failed: d.failed,
    skippedDuplicate: d.skipped_duplicate,
    skippedDuplicateStem: 0,
    canceled: d.canceled,
    allTerminal: d.allTerminal,
  };
}

/** Progress from an in-memory question batch summary (`AiGenerationJob.resultSummary`). */
export function questionBatchProgress(summary: QuestionBatchResultSummaryV1): ContentGenerationBatchProgress {
  const items = summary.items;
  const total = items.length;
  let pending = 0;
  let generating = 0;
  let completed = 0;
  let failed = 0;
  let skippedDuplicate = 0;
  let skippedDuplicateStem = 0;
  for (const it of items) {
    switch (it.status) {
      case "pending":
        pending += 1;
        break;
      case "generating":
        generating += 1;
        break;
      case "completed":
        completed += 1;
        break;
      case "failed":
        failed += 1;
        break;
      case "skipped_duplicate":
        skippedDuplicate += 1;
        break;
      case "skipped_duplicate_stem":
        skippedDuplicateStem += 1;
        break;
      default:
        break;
    }
  }
  const allTerminal = items.length > 0 && items.every((i) => isTerminalQuestionBatchStatus(i.status));
  return {
    kind: "question",
    tool: ADMIN_QUESTION_BATCH_JOB_TOOL,
    total,
    pending,
    generating,
    completed,
    failed,
    skippedDuplicate,
    skippedDuplicateStem,
    canceled: 0,
    allTerminal,
  };
}

/** Parse `AiGenerationJob.resultSummary` JSON into a unified progress view when possible. */
export function progressFromJobResultSummary(
  tool: string,
  raw: unknown,
): ContentGenerationBatchProgress | null {
  if (tool === ADMIN_LESSON_BATCH_TOOL) {
    const s = parseBatchSummary(raw);
    if (!s) return null;
    return lessonBatchProgress(s);
  }
  if (tool === ADMIN_QUESTION_BATCH_JOB_TOOL) {
    const s = parseQuestionBatchSummary(raw);
    if (!s) return null;
    return questionBatchProgress(s);
  }
  return null;
}

/** True if every queue item is finished (success, failure, skip, or cancel). */
export function allLessonItemsTerminal(items: LessonBatchItem[]): boolean {
  return items.length > 0 && items.every((i) => isTerminalBatchStatus(i.status));
}

/** Counts suitable for structured logs (single object per chunk). */
export function batchProgressLogDetail(progress: ContentGenerationBatchProgress): Record<string, unknown> {
  return {
    kind: progress.kind,
    tool: progress.tool,
    totals: {
      total: progress.total,
      pending: progress.pending,
      generating: progress.generating,
      completed: progress.completed,
      failed: progress.failed,
      skippedDuplicate: progress.skippedDuplicate,
      skippedDuplicateStem: progress.skippedDuplicateStem,
      canceled: progress.canceled,
    },
    allTerminal: progress.allTerminal,
  };
}
