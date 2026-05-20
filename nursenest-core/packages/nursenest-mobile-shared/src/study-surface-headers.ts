/**
 * Matches `src/lib/learner/study-product-route-contract.ts` — mobile must send
 * `x-nn-study-launch-surface` because Referer is absent; mismatched header vs route returns 403.
 */
export type NnStudyLaunchSurface = "flashcards" | "practice_exams" | "cat";

export function studyLaunchHeaders(surface: NnStudyLaunchSurface): Record<string, string> {
  return { "x-nn-study-launch-surface": surface };
}
