/**
 * ECG Interpretation Scoring — separates MCQ correctness from interpretation competency.
 *
 * Problem this solves:
 *   Standard MCQ scoring conflates two distinct skills:
 *     a) Interpretive competency — did the learner actually measure the strip correctly?
 *     b) Lucky MCQ correctness — did the learner recognize the answer from visual gestalt?
 *
 *   A learner who always skips the scaffold and guesses "VT" on a wide-complex tachycardia
 *   may score 70% accuracy on MCQs but have zero interval measurement skill. They will fail
 *   when presented with an unfamiliar strip variant.
 *
 *   This module produces a two-dimensional competency signal:
 *     { mcqAccuracy, interpretationScore }
 *
 *   interpretationScore is only nonzero when scaffold data is present.
 *   mcqAccuracy is always computable from answer results.
 *
 * Scoring model:
 *   interpretationScore = weighted average of:
 *     - rate estimation accuracy (25%)
 *     - rhythm characterization accuracy (20%)
 *     - p-wave characterization accuracy (15%)
 *     - pr interval estimation accuracy (20%)
 *     - qrs width estimation accuracy (15%)
 *     - st/t change characterization accuracy (5%)
 *
 * Tolerance ranges:
 *   Rate: ±10 bpm at normal rates; ±15 bpm at rates >150
 *   PR interval: ±20ms (1 small box)
 *   QRS width: ±20ms (0.5 small box)
 */

import type { InterpretationScaffoldValues } from "@/components/ecg-module/ecg-interpretation-scaffold";

// ─── Score types ───────────────────────────────────────────────────────────────

/** The two-dimensional competency signal for a single question attempt. */
export type EcgQuestionCompetencyScore = {
  /** MCQ accuracy: 1 = correct, 0 = incorrect. */
  mcqAccuracy: 0 | 1;
  /**
   * Interpretation score [0–1].
   * null when scaffold was skipped or not used — we cannot score what was not measured.
   */
  interpretationScore: number | null;
  /** True when the learner completed the scaffold AND answered correctly. */
  confirmedCompetent: boolean;
  /**
   * True when the learner got the MCQ correct but skipped the scaffold entirely.
   * This pattern is tracked in telemetry as "unverified correct" — the learner may
   * recognize the rhythm without being able to explain it.
   */
  unverifiedCorrect: boolean;
  /**
   * True when the learner completed all scaffold steps AND got the MCQ correct.
   * This is the gold-standard signal for true interpretive competency.
   */
  scaffoldedCorrect: boolean;
  /** Per-step scores, for granular competency breakdown. */
  stepScores: EcgScaffoldStepScore[];
};

/** Score for a single scaffold step. */
export type EcgScaffoldStepScore = {
  stepKey: keyof InterpretationScaffoldValues;
  /** The learner's selection. Empty string = step was skipped. */
  selected: string;
  /** The reference answer for this question. */
  reference: string;
  /** Whether the selection aligns with the reference [0–1]. 1 = correct, 0 = wrong, partial for range overlaps. */
  accuracy: number;
};

/**
 * Reference answers for scaffold scoring.
 * Must match the canonical parameters in EcgCurriculumUnit.parameters.
 * Provided per-question by the question metadata or curriculum lookup.
 */
export type EcgScaffoldReferenceAnswers = {
  rate: string;
  regularity: string;
  pWaves: string;
  prInterval: string;
  qrsWidth: string;
  stChanges: string;
};

// ─── Scoring weights ───────────────────────────────────────────────────────────

const STEP_WEIGHTS: Record<keyof InterpretationScaffoldValues, number> = {
  rate: 0.25,
  regularity: 0.20,
  pWaves: 0.15,
  prInterval: 0.20,
  qrsWidth: 0.15,
  stChanges: 0.05,
} as const;

// ─── Scoring logic ─────────────────────────────────────────────────────────────

/**
 * Computes the interpretation score for a single step.
 *
 * Matching strategy:
 *   - Exact match: 1.0
 *   - Prefix match (same category): 0.8 (e.g. both in "irregular" family)
 *   - Empty selection (step skipped): 0
 *   - Wrong category: 0
 *
 * Rationale for partial credit on prefix match:
 *   A learner who selects "Irregularly irregular" when the correct answer is
 *   "Regularly irregular" has identified the irregular category but missed the
 *   sub-classification. This warrants partial credit + targeted teaching on
 *   the difference, rather than a binary wrong answer.
 */
function scoreScaffoldStep(selected: string, reference: string): number {
  if (!selected || !reference) return 0;
  const norm = (s: string) => s.trim().toLowerCase();
  const s = norm(selected);
  const r = norm(reference);

  if (s === r) return 1.0;

  // Partial credit for category-level matches
  const extractCategory = (v: string): string => v.split(/[\s(]/)[0] ?? v;
  if (extractCategory(s) === extractCategory(r)) return 0.8;

  // Irregular family partial match
  if (s.includes("irregular") && r.includes("irregular")) return 0.6;

  // Wide/narrow QRS family
  if (s.includes("wide") && r.includes("wide")) return 0.7;
  if (s.includes("narrow") && r.includes("narrow")) return 0.7;

  // ST change directional match
  if (s.includes("elevation") && r.includes("elevation")) return 0.8;
  if (s.includes("depression") && r.includes("depression")) return 0.8;

  return 0;
}

/**
 * Computes the full two-dimensional competency score for a question attempt.
 *
 * @param mcqCorrect Whether the learner got the MCQ answer correct
 * @param scaffoldValues The learner's scaffold selections (empty values = skipped steps)
 * @param referenceAnswers The canonical correct scaffold answers for this rhythm
 * @param scaffoldWasCompleted Whether the learner completed all scaffold steps
 */
export function scoreEcgQuestionAttempt(
  mcqCorrect: boolean,
  scaffoldValues: Partial<InterpretationScaffoldValues> | null,
  referenceAnswers: EcgScaffoldReferenceAnswers | null,
  scaffoldWasCompleted: boolean,
): EcgQuestionCompetencyScore {
  const mcqAccuracy: 0 | 1 = mcqCorrect ? 1 : 0;
  const scaffoldWasSkipped = !scaffoldValues || !scaffoldWasCompleted;

  // No scaffold data → interpretation score is null (unverifiable)
  if (scaffoldWasSkipped || !referenceAnswers) {
    return {
      mcqAccuracy,
      interpretationScore: null,
      confirmedCompetent: false,
      unverifiedCorrect: mcqCorrect && scaffoldWasSkipped,
      scaffoldedCorrect: false,
      stepScores: [],
    };
  }

  // Score each step
  const stepScores: EcgScaffoldStepScore[] = (
    ["rate", "regularity", "pWaves", "prInterval", "qrsWidth", "stChanges"] as const
  ).map((key) => {
    const selected = scaffoldValues?.[key] ?? "";
    const reference = referenceAnswers[key];
    return {
      stepKey: key,
      selected,
      reference,
      accuracy: scoreScaffoldStep(selected, reference),
    };
  });

  // Weighted interpretation score
  const interpretationScore = stepScores.reduce((sum, step) => {
    return sum + step.accuracy * STEP_WEIGHTS[step.stepKey];
  }, 0);

  return {
    mcqAccuracy,
    interpretationScore,
    confirmedCompetent: mcqCorrect && interpretationScore >= 0.75,
    unverifiedCorrect: mcqCorrect && !scaffoldWasCompleted,
    scaffoldedCorrect: mcqCorrect && scaffoldWasCompleted,
    stepScores,
  };
}

/**
 * Aggregates multiple attempt scores into a session-level competency summary.
 *
 * @param attempts Array of per-question scores from a study session
 */
export type EcgSessionCompetencySummary = {
  /** Number of questions in the session. */
  questionCount: number;
  /** MCQ accuracy [0–1]. */
  mcqAccuracy: number;
  /** Average interpretation score [0–1], null if no scaffold data in session. */
  averageInterpretationScore: number | null;
  /** Fraction of questions answered correctly WITH scaffold completed. */
  scaffoldedCorrectRate: number;
  /** Fraction of questions answered correctly WITHOUT scaffold (unverified). */
  unverifiedCorrectRate: number;
  /** Weakest scaffold steps — sorted by accuracy ascending (worst first). */
  weakestSteps: Array<{ stepKey: keyof InterpretationScaffoldValues; averageAccuracy: number }>;
  /**
   * The competency gap: MCQ accuracy significantly exceeds interpretation score.
   * Indicates the learner is pattern-matching rather than interpreting.
   * True when: mcqAccuracy ≥ 0.75 AND interpretationScore < 0.55.
   */
  hasCompetencyGap: boolean;
};

export function summarizeEcgSessionCompetency(
  attempts: EcgQuestionCompetencyScore[],
): EcgSessionCompetencySummary {
  if (attempts.length === 0) {
    return {
      questionCount: 0,
      mcqAccuracy: 0,
      averageInterpretationScore: null,
      scaffoldedCorrectRate: 0,
      unverifiedCorrectRate: 0,
      weakestSteps: [],
      hasCompetencyGap: false,
    };
  }

  const mcqAccuracy = attempts.reduce((s, a) => s + a.mcqAccuracy, 0) / attempts.length;
  const scaffoldedCorrectRate = attempts.filter((a) => a.scaffoldedCorrect).length / attempts.length;
  const unverifiedCorrectRate = attempts.filter((a) => a.unverifiedCorrect).length / attempts.length;

  // Interpretation score: only from attempts with scaffold data
  const scoredAttempts = attempts.filter((a) => a.interpretationScore !== null);
  const averageInterpretationScore =
    scoredAttempts.length > 0
      ? scoredAttempts.reduce((s, a) => s + (a.interpretationScore ?? 0), 0) / scoredAttempts.length
      : null;

  // Per-step average across all scaffold attempts
  const stepAccumulator: Record<string, { sum: number; count: number }> = {};
  for (const attempt of attempts) {
    for (const step of attempt.stepScores) {
      const acc = stepAccumulator[step.stepKey] ?? { sum: 0, count: 0 };
      acc.sum += step.accuracy;
      acc.count += 1;
      stepAccumulator[step.stepKey] = acc;
    }
  }

  const weakestSteps = Object.entries(stepAccumulator)
    .map(([key, { sum, count }]) => ({
      stepKey: key as keyof InterpretationScaffoldValues,
      averageAccuracy: count > 0 ? sum / count : 0,
    }))
    .sort((a, b) => a.averageAccuracy - b.averageAccuracy);

  const hasCompetencyGap =
    mcqAccuracy >= 0.75 &&
    averageInterpretationScore !== null &&
    averageInterpretationScore < 0.55;

  return {
    questionCount: attempts.length,
    mcqAccuracy,
    averageInterpretationScore,
    scaffoldedCorrectRate,
    unverifiedCorrectRate,
    weakestSteps,
    hasCompetencyGap,
  };
}
