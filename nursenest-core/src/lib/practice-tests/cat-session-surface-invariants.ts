/**
 * Client-side CAT session guards (no engine changes).
 * Hydration and advance responses must never collapse corrupt server state into a silent "done" UX.
 */

export type CatHydrateInvariantResult =
  | { ok: true }
  | { ok: false; code: "cat_in_progress_no_questions"; message: string };

/**
 * Block clearly corrupt hydrates before the runner wires timers / advance flows.
 */
export function assessCatPracticeHydrateInvariants(input: {
  catMode: boolean;
  status: string;
  questionIds: string[];
}): CatHydrateInvariantResult {
  if (input.catMode && input.status === "IN_PROGRESS" && input.questionIds.length === 0) {
    return {
      ok: false,
      code: "cat_in_progress_no_questions",
      message:
        "This adaptive session is missing question data on load. Return to Practice tests and start a new session, or contact support — we will not fabricate items client-side.",
    };
  }
  return { ok: true };
}
