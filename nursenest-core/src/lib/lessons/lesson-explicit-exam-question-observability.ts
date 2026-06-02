import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { ExplicitExamQuestionIdLoadDiagnostics, ExplicitIdDropReason } from "@/lib/lessons/lesson-explicit-exam-question-resolution-pipeline";

const DEBUG_FLAG = "NN_DEBUG_EXPLICIT_QUESTION_IDS";

export function isExplicitQuestionIdsDebugLoggingEnabled(): boolean {
  return process.env[DEBUG_FLAG] === "true";
}

/** Alias for call sites that use the singular `Id` spelling (assessment selection, tooling). */
export function isExplicitQuestionIdDebugLoggingEnabled(): boolean {
  return isExplicitQuestionIdsDebugLoggingEnabled();
}

function countByReason(dropped: ReadonlyArray<{ id: string; reason: ExplicitIdDropReason }>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of dropped) {
    out[d.reason] = (out[d.reason] ?? 0) + 1;
  }
  return out;
}

function idPrefix(id: string): string {
  return id.length >= 8 ? `${id.slice(0, 8)}…` : id;
}

export type ExplicitExamQuestionFallbackSurface = "assessment_merge" | "study_loop_topic_bank" | "none";

/**
 * Internal-only observability for explicit lesson `ExamQuestion` id resolution.
 * Never attach full diagnostics to learner responses.
 */
export function logExplicitExamQuestionLoadOutcome(opts: {
  scope: string;
  pathwayId?: string;
  lessonSlug?: string;
  phase: "pre" | "post" | "study_loop_combined";
  hadConfiguredUniqIds: boolean;
  hadSubscriberAccess: boolean;
  diagnostics: ExplicitExamQuestionIdLoadDiagnostics;
  fallbackSurface: ExplicitExamQuestionFallbackSurface;
}): void {
  if (!opts.hadConfiguredUniqIds || !opts.hadSubscriberAccess) return;

  const zero = opts.diagnostics.resolvedExamQuestionIds.length === 0;
  const c = countByReason(opts.diagnostics.dropped);

  if (zero) {
    const idPreview = opts.diagnostics.orderedUniqRequestedIds
      .slice(0, 3)
      .map(idPrefix)
      .join("|");
    safeServerLog(opts.scope, "explicit_exam_question_ids_zero_resolved_fallback", {
      phase: opts.phase,
      pathwayId: opts.pathwayId ?? "",
      lessonSlug: opts.lessonSlug ?? "",
      fallback: opts.fallbackSurface,
      requestedUniq: opts.diagnostics.orderedUniqRequestedIds.length,
      idPreview: idPreview || "(none)",
      droppedTotal: opts.diagnostics.dropped.length,
      d_missing: c.missing ?? 0,
      d_inaccessible: c.inaccessible ?? 0,
      d_wrong_region: c.wrong_region ?? 0,
      d_non_mcq: c.non_mcq ?? 0,
      d_duplicate: c.duplicate ?? 0,
      d_finalize: c.finalize_rejected ?? 0,
      d_malformed: c.malformed ?? 0,
    });
  }

  if (!isExplicitQuestionIdsDebugLoggingEnabled()) return;

  const sample = opts.diagnostics.dropped.slice(0, 12).map((d) => `${idPrefix(d.id)}:${d.reason}`);
  safeServerLog(opts.scope, "explicit_exam_question_ids_debug", {
    phase: opts.phase,
    pathwayId: opts.pathwayId ?? "",
    lessonSlug: opts.lessonSlug ?? "",
    requestedUniq: opts.diagnostics.orderedUniqRequestedIds.length,
    resolved: opts.diagnostics.resolvedExamQuestionIds.length,
    fallback: opts.fallbackSurface,
    droppedSample: sample.join("|").slice(0, 900),
  });
}
