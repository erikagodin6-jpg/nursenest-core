/**
 * Learner-facing adaptive practice session lengths (question bank setup).
 * Fixed counts use guided practice (`catAdaptiveSessionType: "practice"`).
 * Unlimited uses true CAT advance with a high cap until the learner ends the session.
 */

export const ADAPTIVE_PRACTICE_FIXED_LENGTHS = [10, 20, 30, 50, 75, 100, 150] as const;

/** API + guided practice ceiling; unlimited mode requests this cap. */
export const ADAPTIVE_PRACTICE_UNLIMITED_CAP = 200;

export type AdaptivePracticeFixedLength = (typeof ADAPTIVE_PRACTICE_FIXED_LENGTHS)[number];

export type AdaptivePracticeSessionLength = AdaptivePracticeFixedLength | "unlimited";

export const ADAPTIVE_PRACTICE_DEFAULT_LENGTH: AdaptivePracticeFixedLength = 30;

/** Learner-facing label — avoids ambiguous “Unlimited” wording. */
export const CONTINUOUS_PRACTICE_LABEL = "Continuous review";

/** Segmented control short label */
export const CONTINUOUS_PRACTICE_SEGMENT_LABEL = "Continuous";

const MINUTES_PER_QUESTION_ESTIMATE = 1.1;

export function estimateAdaptivePracticeDuration(
  length: AdaptivePracticeSessionLength,
): { label: string; detail: string } {
  if (length === "unlimited") {
    return {
      label: "Open-ended",
      detail: "Adaptive questions continue until you choose to end the session.",
    };
  }
  const minutes = Math.max(5, Math.round(length * MINUTES_PER_QUESTION_ESTIMATE));
  return {
    label: `~${minutes} min`,
    detail: `About ${minutes} minutes at a steady pace with rationales.`,
  };
}

export function isAdaptivePracticeSessionLength(value: number): value is AdaptivePracticeFixedLength {
  return (ADAPTIVE_PRACTICE_FIXED_LENGTHS as readonly number[]).includes(value);
}

export function resolveAdaptivePracticeLaunchLength(length: AdaptivePracticeSessionLength): {
  questionCount: number;
  unlimited: boolean;
  catAdaptiveSessionType: "cat" | "practice";
} {
  if (length === "unlimited") {
    return {
      questionCount: ADAPTIVE_PRACTICE_UNLIMITED_CAP,
      unlimited: true,
      catAdaptiveSessionType: "cat",
    };
  }
  return {
    questionCount: length,
    unlimited: false,
    catAdaptiveSessionType: "practice",
  };
}
