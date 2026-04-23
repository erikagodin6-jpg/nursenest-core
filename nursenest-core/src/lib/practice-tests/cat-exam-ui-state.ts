/**
 * Client-side UI phases for CAT **exam / test** mode (not study mode).
 * Server scoring + advance remains a single `cat_advance` PATCH; this models explicit
 * submit → lock → advance UX and in-flight guards.
 */
export type CatExamUiPhase = "answering" | "submitted_locked" | "advancing";

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
  return controlsBusy || phase === "advancing";
}
