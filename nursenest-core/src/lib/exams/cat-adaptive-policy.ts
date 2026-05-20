/**
 * NurseNest practice CAT — adaptive policy (readable spec)
 *
 * **Pool (per session)** — `fetchCatPracticePool`:
 * - Tier, region, and publish gates from `questionAccessWhere` / entitlement.
 * - **Pathway isolation**: when `pathwayId` is set, `questionAccessWhereWithPathway` ANDs
 *   `exam IN pathway.contentExamKeys` so RN CAT never draws PN/NP items (and vice versa).
 * - Optional topic / difficulty filters from the learner’s build settings.
 *
 * **Start** — `createInitialAdaptiveState` in `cat-engine.ts`:
 * - Ability proxy `theta = 0` (mid ability).
 * - Next-item difficulty target `targetDifficulty = 3` (medium on the 1–5 bank scale).
 *
 * **After each scored answer** — `appendScoredResult`:
 * - `theta` nudges up/down with **capped** steps; early items allow slightly larger target-difficulty moves, then smooth ±1 progression.
 * - `targetDifficulty`: calibration allows ±2 on hard wins / easy misses; later phases use ±1 to avoid jumpy runs.
 * - `se` shrinks with `~2.1/sqrt(n)` (precision proxy), a bit faster when `theta` sits near the passing cutoff.
 * - Append `results[]` with `questionId`, `correct`, `categoryKey`, `difficulty` (question history + audit).
 * - Append `difficultyHistory[]` for the delivered item difficulty.
 *
 * **Next item** — `selectNextQuestion`:
 * - Candidates = pool minus `usedIds` (no repeats in-session).
 * - Score each unused row: distance to `targetDifficulty`, blueprint balance (deficit vs expected mix),
 *   minus optional boosts (weak areas, session misses, high-yield tilt in practice).
 * - With `CatSelectContext`, adds information-value bias near the cutoff, session-seeded jitter, and anti-repeat buckets.
 * - Prefer closest difficulty band; relax band if needed.
 *
 * **Stop** — `shouldStopAfterAnswer` (`CatStopBounds.terminationMode`):
 * - `fixed_full_length` (NP exam sim): only `max_length` — no CI or streak early exit.
 * - `adaptive_exam_ci` (NCLEX exam sim): after `min`, stop when **95% CI** (`theta ± 1.96·SE`) is entirely above or below `passingThreshold`; always at `max`.
 * - `adaptive_practice`: legacy streak + theta/SE bands after `min` and confidence floor.
 *
 * Exam simulation keeps blueprint weights dominant; practice CAT adds weak + high-yield boosts only.
 */

import type { CatPoolRow, CatSelectOptions } from "@/lib/exams/cat-engine";

/** Substrings matched on topic, body system, and category key (case-insensitive). */
const HIGH_YIELD_TOPIC_FRAGMENTS = [
  "cardio",
  "cardiac",
  "heart",
  "respir",
  "pulmon",
  "lung",
  "airway",
  "endocrine",
  "diabetes",
  "thyroid",
  "fluid",
  "electrolyte",
  "acid-base",
  "acid base",
  "renal",
  "kidney",
  "pharm",
  "medication",
  "medication administration",
  "dosage",
  "shock",
  "sepsis",
  "prioritization",
  "delegation",
  "safety",
  "infection",
] as const;

const HIGH_YIELD_BOOST_PER_HIT = 2;
const HIGH_YIELD_BOOST_CAP = 12;

/**
 * Light tilt toward clinically dense / exam-heavy themes without starving other blueprint areas.
 * Applied only in **practice** CAT (not exam simulation).
 */
export function highYieldBoostForPoolRow(row: CatPoolRow, categoryKey: string): number {
  const hay = `${categoryKey} ${row.topic ?? ""} ${row.bodySystem ?? ""}`.toLowerCase();
  let n = 0;
  for (const frag of HIGH_YIELD_TOPIC_FRAGMENTS) {
    if (hay.includes(frag)) n += HIGH_YIELD_BOOST_PER_HIT;
  }
  return Math.min(HIGH_YIELD_BOOST_CAP, n);
}

export function catHighYieldPracticeBoost(): CatSelectOptions {
  return {
    categoryPriorityBoost: (cat, row) => highYieldBoostForPoolRow(row, cat),
  };
}
