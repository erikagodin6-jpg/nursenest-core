/**
 * Central knobs for study session diversity: recency windows, fallbacks, and debug logging.
 * Mode-specific behavior (weak / targeted / missed) is documented inline — callers opt in via params.
 */

/** How many prior practice/CAT sessions (same pathway) to scan for recent question IDs. */
export const STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT = 14;

/** Weak-topic sessions use a shorter lookback so high-priority weak items are not over-suppressed. */
export const STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_WEAK = 8;

/** Missed-review sessions use a moderate lookback — repeats are intentional, but we still vary order. */
export const STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_MISSED = 10;

/** Cap on recent question IDs collected for exclusion (most recent first). */
export const STUDY_DIVERSITY_PRACTICE_RECENT_MAX_IDS = 120;

/**
 * When excluding recent IDs, require at least this many rows left in the pool to apply exclusion.
 * Linear practice passes `questionCount` as the floor so small sessions still get variety when possible.
 */
export const STUDY_DIVERSITY_PRACTICE_RECENT_MIN_REMAINING_DEFAULT = 8;

/** CAT session step uses a larger recent window for diversity (see `cat-session.ts`). */
export const STUDY_DIVERSITY_CAT_STEP_RECENT_SESSION_LOOKBACK = 20;

/**
 * Linear personalized pick: shuffle happens inside a band of at most `questionCount * multiplier` ids
 * (capped by pool size) so session order stays fresh without ignoring weak/missed prioritization.
 */
export const STUDY_LINEAR_PRIORITIZE_CANDIDATE_MULTIPLIER = 5;

/** Minimum extra ids beyond `questionCount` included in the candidate band when the pool is large enough. */
export const STUDY_LINEAR_PRIORITIZE_MIN_SPARE = 22;

/** Env flag: set `STUDY_DIVERSITY_DEBUG=1` for extra server logs (admin/dev only; no learner-facing leakage). */
export function studyDiversityDebugEnabled(): boolean {
  return process.env.STUDY_DIVERSITY_DEBUG === "1" || process.env.STUDY_DIVERSITY_DEBUG === "true";
}

export function practiceRecentSessionLookback(
  selectionMode: "random" | "weak" | "targeted" | "missed",
): number {
  if (selectionMode === "weak") return STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_WEAK;
  if (selectionMode === "missed") return STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_MISSED;
  return STUDY_DIVERSITY_PRACTICE_RECENT_SESSION_LOOKBACK_DEFAULT;
}
