import type { DataResult } from "@/lib/loading/critical-load-outcome";
import type { ProgressPagePayload } from "@/lib/learner/load-progress-page-payload";

/**
 * Map the progress page aggregate payload to the shared {@link DataResult} shape for tests and diagnostics.
 * Callers still render from {@link ProgressPagePayload.segmentReliability} — this helper is the typed summary.
 */
export function progressPagePayloadToDataResult(
  payload: ProgressPagePayload,
  durationMs: number,
): DataResult<ProgressPagePayload> {
  if (payload.loadOutcome === "error") {
    return {
      status: "error",
      error:
        "Progress aggregates could not be loaded. Retry shortly — numeric zeros on this screen are placeholders, not real activity.",
      retryable: true,
      durationMs,
    };
  }

  if (payload.loadOutcome === "degraded") {
    const reason =
      payload.degraded?.panels?.length ? payload.degraded.panels.join("; ").slice(0, 400) : "partial_segments_failed";
    return {
      status: "degraded",
      data: payload,
      reason,
      durationMs,
    };
  }

  const allSegmentsReliable = Object.values(payload.segmentReliability).every(Boolean);
  const looksLikeNewSubscriber =
    allSegmentsReliable &&
    payload.pathways.length === 0 &&
    payload.lessonsPool.available === 0 &&
    payload.lessonsPool.completed === 0 &&
    payload.questionBank.ledgerAttempted === 0 &&
    payload.exams.completedPracticeTests === 0 &&
    payload.exams.recentMocks.length === 0 &&
    payload.exams.recentPracticeTests.length === 0;

  if (looksLikeNewSubscriber) {
    return { status: "empty", data: payload, durationMs };
  }

  return { status: "ok", data: payload, durationMs };
}
