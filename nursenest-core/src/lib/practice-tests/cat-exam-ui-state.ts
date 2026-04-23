/**
 * Client-side UI phases for CAT **exam / test** mode (not study mode).
 * Server scoring + advance remains a single `cat_advance` PATCH; this models explicit
 * submit → lock → advance UX and in-flight guards.
 *
 * `completed` is set only while the runner is still mounted and the server has returned
 * `catCompleted` (brief handoff before results layout replaces the question shell).
 */
export type CatExamUiPhase = "answering" | "submitted_locked" | "advancing" | "completed";

export function catExamOptionsInteractionLocked(phase: CatExamUiPhase): boolean {
  return phase !== "answering";
}

export function catExamCanChangeAnswer(phase: CatExamUiPhase): boolean {
  return phase === "answering";
}

export function catExamCanLockAnswer(phase: CatExamUiPhase, hasMeaningfulAnswer: boolean): boolean {
  return phase === "answering" && hasMeaningfulAnswer;
}

/** Only from submitted_locked may the client call `cat_advance` in exam mode. */
export function catExamCanRequestCatAdvance(phase: CatExamUiPhase): boolean {
  return phase === "submitted_locked";
}

export function catExamFooterPrimaryBusy(phase: CatExamUiPhase, controlsBusy: boolean): boolean {
  return controlsBusy || phase === "advancing" || phase === "completed";
}

/**
 * CAT adaptive sessions keep the cursor on the **last delivered** question (`cursor === ids.length - 1`).
 * UI must not use `idx < total - 1` to choose between “next” vs “finish” — that branch is always false.
 * Instead, use configured max length as a conservative hint for the **final buffer item** label only;
 * the server still decides completion on `cat_advance`.
 */
export type CatExamAdvancePrimaryIntent = "next_item" | "finish_session";

export function catExamAdvancePrimaryIntentFromSessionShape(args: {
  /** `questionIds.length` while on the live item (always `idx + 1` in valid CAT runs). */
  deliveredQuestionCount: number;
  catMaxQuestions: number | null | undefined;
}): CatExamAdvancePrimaryIntent {
  const max = args.catMaxQuestions;
  if (max != null && max > 0 && args.deliveredQuestionCount >= max) return "finish_session";
  return "next_item";
}

/** True if a PATCH response should be ignored (navigation, item change, or unmount). */
export function catExamCatAdvanceResponseIsStale(args: {
  advanceIdx: number;
  advanceQuestionId: string;
  currentIdx: number;
  currentQuestionId: string | undefined;
}): boolean {
  if (args.currentIdx !== args.advanceIdx) return true;
  if (!args.currentQuestionId || args.currentQuestionId !== args.advanceQuestionId) return true;
  return false;
}
