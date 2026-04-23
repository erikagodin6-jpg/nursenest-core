/**
 * Visual row state for {@link AnswerOptionRow} on linear + legacy practice surfaces.
 * Mirrors linear reveal rules: correctness only after commit with per-item feedback — never on mere selection.
 */
export type PracticeMcqOptionRowState =
  | "default"
  | "selected"
  | "correct"
  | "incorrect"
  | "dim";

/**
 * Whether the learner's current answer value selects a given canonical option key.
 * Matches CAT / linear / legacy MCQ + SATA conventions (`string` vs `string[]`).
 */
export function mcqAnswerSelectsCanonical(answer: unknown, canonical: string): boolean {
  if (answer === undefined || answer === null) return false;
  if (Array.isArray(answer)) return answer.includes(canonical);
  return answer === canonical;
}

/**
 * Row highlight state for legacy + linear MCQ (not CAT adaptive — use catOptState there).
 * - With `linearEngineActive` + committed + `after_each` + `feedback`: show correct / incorrect / dim (post-reveal).
 * - With `linearEngineActive` + committed + `end_of_exam`: selected vs dim only (no correctness leakage).
 * - Otherwise: selected vs default (no reveal).
 */
export function computePracticeMcqOptionRowState(params: {
  answer: unknown;
  canonical: string;
  /** When false, only selected/default (legacy free-navigation sessions). */
  linearEngineActive: boolean;
  currentCommitted: boolean;
  rationaleVisibility: "after_each" | "end_of_exam";
  feedback?: { correctKeys: string[] } | null;
}): PracticeMcqOptionRowState {
  const isSelected = mcqAnswerSelectsCanonical(params.answer, params.canonical);

  if (
    params.linearEngineActive &&
    params.currentCommitted &&
    params.rationaleVisibility === "after_each" &&
    params.feedback
  ) {
    const ck = new Set(params.feedback.correctKeys);
    if (ck.has(params.canonical)) return "correct";
    if (isSelected) return "incorrect";
    return "dim";
  }
  if (params.linearEngineActive && params.currentCommitted && params.rationaleVisibility === "end_of_exam") {
    return isSelected ? "selected" : "dim";
  }
  return isSelected ? "selected" : "default";
}
