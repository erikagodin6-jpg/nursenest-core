import type { LessonBatchResultSummaryV1 } from "@/lib/lessons/admin-ai-lesson-batch";

/**
 * Browser-side helpers for **async** lesson AI: queue a batch job (no OpenAI in that request),
 * then call `/step` until the job reports done. Keeps long model work off a single HTTP round-trip.
 */

export type LessonAiBatchCreatePayload = {
  topicsRaw: string;
  pathway: string;
  country: "CA" | "US";
  topicDomain: string;
  lessonType: string;
  difficulty?: string;
  relatedCategoryIds?: string[];
  allowDuplicates?: boolean;
};

export async function createLessonAiBatch(payload: LessonAiBatchCreatePayload) {
  const res = await fetch("/api/admin/lessons/ai-generate-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = (await res.json()) as {
    error?: string;
    jobId?: string;
    summary?: LessonBatchResultSummaryV1;
  };
  if (!res.ok) {
    throw new Error(typeof j.error === "string" ? j.error : "Create batch failed");
  }
  if (!j.jobId) throw new Error("Missing jobId");
  return { jobId: j.jobId, summary: j.summary };
}

export async function runLessonAiBatchSteps(
  jobId: string,
  opts?: { pollMs?: number; onSummary?: (s: LessonBatchResultSummaryV1) => void },
): Promise<LessonBatchResultSummaryV1> {
  const pollMs = opts?.pollMs ?? 200;
  let done = false;
  let lastSummary: LessonBatchResultSummaryV1 | null = null;
  while (!done) {
    const res = await fetch(`/api/admin/lessons/ai-generate-batch/${jobId}/step`, { method: "POST" });
    const j = (await res.json()) as {
      error?: string;
      done?: boolean;
      message?: string;
      summary?: LessonBatchResultSummaryV1;
    };
    if (!res.ok) {
      throw new Error(j.error ?? `Step failed (${res.status})`);
    }
    if (j.summary) {
      lastSummary = j.summary;
      opts?.onSummary?.(j.summary);
    }
    if (j.done) {
      done = true;
      break;
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
  if (!lastSummary) throw new Error("No summary after batch run");
  return lastSummary;
}

export function pickLessonDraftIdFromBatchSummary(summary: LessonBatchResultSummaryV1): string {
  const completed = summary.items.find((i) => i.status === "completed" && i.draftId);
  if (completed?.draftId) return completed.draftId;
  const dup = summary.items.find((i) => i.status === "skipped_duplicate" && i.existingDraftId);
  if (dup?.existingDraftId) return dup.existingDraftId;
  const failed = summary.items.find((i) => i.status === "failed");
  if (failed?.error) throw new Error(failed.error);
  throw new Error("No draft id in batch result");
}
