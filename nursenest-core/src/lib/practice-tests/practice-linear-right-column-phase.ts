/**
 * Pure helpers for practice linear tutor/review right-column UX (flashcard exam board parity).
 * Keeps branching testable without mounting the full runner.
 */

export type PracticeLinearRightColumnPhase = "pre_submit" | "post_submit";

export function resolvePracticeLinearRightColumnPhase(args: {
  /** `linearDeliveryMode === "exam"` — no rationale column. */
  linearIsExamShell: boolean;
  /** Server / client has scored feedback for the current item. */
  hasRationalePayload: boolean;
  /** Current question id is in `committedQuestionIds`. */
  currentCommitted: boolean;
  /** `linearRationaleVisibility === "after_each"` */
  rationaleAfterEach: boolean;
}): PracticeLinearRightColumnPhase | null {
  if (args.linearIsExamShell) return null;
  if (!args.currentCommitted) return "pre_submit";
  if (args.rationaleAfterEach && args.hasRationalePayload) return "post_submit";
  return "pre_submit";
}
