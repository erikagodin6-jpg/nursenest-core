import type { LinearDeliveryMode } from "@/lib/practice-tests/types";

export type LinearRationaleVisibilitySetting = "after_each" | "end_of_exam" | string;

/**
 * Whether the linear runner should render {@link PracticeTestPerItemRationale} for the current item.
 * Kept in a pure helper so exam delivery and inconsistent resume flags cannot surface tutor rationale.
 */
export function shouldShowLinearPerItemRationale(args: {
  isLinearEngine: boolean;
  linearDeliveryMode: LinearDeliveryMode | null | undefined;
  linearRationaleVisibility: LinearRationaleVisibilitySetting;
  currentCommitted: boolean;
  /** Feedback for `currentQuestionId` only (runner uses `linearPracticeFeedback[current.id]`). */
  linearFeedbackForCurrent: unknown;
}): boolean {
  const linearIsExamShell = Boolean(args.isLinearEngine && args.linearDeliveryMode === "exam");
  return (
    args.isLinearEngine &&
    !linearIsExamShell &&
    args.linearRationaleVisibility === "after_each" &&
    args.currentCommitted &&
    Boolean(args.linearFeedbackForCurrent)
  );
}
