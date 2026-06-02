/**
 * ------------------------------
 * CONSTANTS
 * ------------------------------
 */

const DIFFICULTY_SCALING: Record<number, number> = {
  1: 0.5,
  2: 0.8,
  3: 1.0,
  4: 1.3,
  5: 1.6,
};

const EXPECTED_ACCURACY: Record<number, [number, number]> = {
  1: [0.80, 0.90],
  2: [0.65, 0.80],
  3: [0.50, 0.65],
  4: [0.35, 0.50],
  5: [0.20, 0.35],
};

/**
 * ------------------------------
 * TYPES
 * ------------------------------
 */

export interface QuestionResponse {
  questionId: string;
  difficulty: number;
  correct: boolean;
  timeSpent: number;
  blueprintCategory?: string;
  discriminationIndex?: number;
}

export interface AbilityEstimate {
  ability: number;
  confidenceInterval: number;
  trajectory: number[];
  stabilityIndex: number;
  questionCount: number;
  earlyStop: boolean;
  antiGamingFlags: string[];
}

export interface CandidateItem {
  id: string;
  difficulty: number;
  blueprintCategory: string;
  discriminationIndex: number;
  attemptCount: number;
  exposureCount: number;
  isCaseSet: boolean;
  formatType?: string;
}

/**
 * ------------------------------
 * NGN FORMATS
 * ------------------------------
 */

export const NGN_FORMAT_TYPES = [
  "DRAG_DROP_CLOZE",
  "DRAG_DROP_RATIONALE",
  "DROPDOWN_CLOZE",
  "DROPDOWN_RATIONALE",
  "DROPDOWN_TABLE",
  "MATRIX_SINGLE",
  "MATRIX_MULTI",
  "MULTI_RESPONSE_GROUPING",
  "TREND",
  "HIGHLIGHT_TEXT",
  "BOWTIE",
  "CASE_STUDY_SERIES",
  "LAB_INTERPRETATION",
  "IMAGE_HOTSPOT",
  "CALCULATION_NUMERIC",
  "MATCHING_GRID",
] as const;

export type NGNFormatType = typeof NGN_FORMAT_TYPES[number];

/**
 * ------------------------------
 * ABILITY ESTIMATION
 * ------------------------------
 */

export function computeAbilityEstimate(responses: QuestionResponse[]): AbilityEstimate {
  let ability = 0;
  const trajectory: number[] = [0];
  const antiGamingFlags: string[] = [];

  const attemptMap = new Map<string, number>();
  let fastGuessCount = 0;

  for (const r of responses) {
    const attempts = (attemptMap.get(r.questionId) || 0) + 1;
    attemptMap.set(r.questionId, attempts);

    // Ignore excessive repeats
    if (attempts > 2) continue;

    // Fast guessing detection
    if (r.timeSpent < 5) {
      fastGuessCount++;
      if (fastGuessCount > 5) {
        antiGamingFlags.push("fast_guessing_pattern");
      }
      continue;
    }

    const scale = DIFFICULTY_SCALING[r.difficulty] ?? 1.0;
    ability += r.correct ? scale : -scale;

    trajectory.push(ability);
  }

  if (responses.length < 50) {
    antiGamingFlags.push("below_minimum_items");
  }

  /**
   * Stability calculation
   */
  const recent = trajectory.slice(-10);
  const mean = recent.reduce((a, b) => a + b, 0) / Math.max(recent.length, 1);
  const variance =
    recent.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(recent.length, 1);

  const stabilityIndex = Math.max(0, 1 - Math.sqrt(variance) / 5);

  /**
   * Confidence interval
   */
  const difficulties = responses.map(r => r.difficulty);
  const spread =
    difficulties.length > 0
      ? Math.max(...difficulties) - Math.min(...difficulties)
      : 0;

  const confidenceInterval = Math.max(
    0.5,
    3 - responses.length * 0.02 - spread * 0.3
  );

  /**
   * Early stopping rule
   */
  const earlyStop =
    responses.length >= 75 &&
    confidenceInterval < 1.0 &&
    stabilityIndex > 0.7;

  return {
    ability,
    confidenceInterval,
    trajectory,
    stabilityIndex,
    questionCount: responses.length,
    earlyStop,
    antiGamingFlags,
  };
}

/**
 * ------------------------------
 * ITEM SELECTION (CAT LOGIC)
 * ------------------------------
 */

export function selectNextItem(
  currentAbility: number,
  candidates: CandidateItem[],
  answeredCategories: Record<string, number>,
  blueprintWeights: Record<string, number>,
  totalAnswered: number,
  lastCaseSetIndex: number,
  answeredFormats: Record<string, number> = {}
): CandidateItem | null {

  if (!candidates.length) return null;

  const targetDifficulty = Math.min(
    5,
    Math.max(1, Math.round(3 + currentAbility / 2))
  );

  const avgPerFormat =
    totalAnswered > 0 ? totalAnswered / NGN_FORMAT_TYPES.length : 0;

  const scored = candidates.map(item => {
    /**
     * Difficulty targeting
     */
    const proximity =
      1 - Math.abs(item.difficulty - targetDifficulty) / 4;

    /**
     * Blueprint balancing
     */
    const weight = blueprintWeights[item.blueprintCategory] || 0.1;
    const answered = answeredCategories[item.blueprintCategory] || 0;
    const target = weight * totalAnswered;

    const blueprintScore =
      target > 0
        ? Math.max(0, 1 - answered / Math.max(target, 1))
        : 0.5;

    /**
     * Discrimination
     */
    const discrimination = Math.min(
      1,
      (item.discriminationIndex || 0.3) / 0.5
    );

    /**
     * Exposure penalty
     */
    const exposurePenalty = Math.min(
      1,
      (item.exposureCount || 0) / 10
    );

    /**
     * Case set spacing
     */
    const caseBonus =
      item.isCaseSet && totalAnswered - lastCaseSetIndex >= 15
        ? 0.2
        : 0;

    /**
     * Format diversity
     */
    let formatBonus = 0;
    if (item.formatType && totalAnswered > 0) {
      const count = answeredFormats[item.formatType] || 0;
      if (count < avgPerFormat) {
        formatBonus =
          0.15 *
          Math.max(0, 1 - count / Math.max(avgPerFormat, 1));
      }
    }

    /**
     * Final score
     */
    const score =
      proximity * 0.35 +
      blueprintScore * 0.25 +
      discrimination * 0.15 -
      exposurePenalty * 0.1 +
      caseBonus +
      formatBonus;

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored[0]?.item || null;
}

/**
 * ------------------------------
 * DIFFICULTY CALIBRATION
 * ------------------------------
 */

export function checkDifficultyCalibration(
  stats: { level: number; correct: number; total: number }[]
) {
  return stats.map(stat => {
    const actual = stat.total > 0 ? stat.correct / stat.total : 0;

    const [low, high] = EXPECTED_ACCURACY[stat.level] || [0.5, 0.65];

    const deviation =
      actual < low - 0.05 || actual > high + 0.05;

    let adjustment = "none";

    if (actual > high + 0.05) {
      adjustment = "increase_difficulty_weight";
    } else if (actual < low - 0.05) {
      adjustment = "decrease_difficulty_weight";
    }

    return {
      level: stat.level,
      actualPercent: Math.round(actual * 100),
      expectedLow: Math.round(low * 100),
      expectedHigh: Math.round(high * 100),
      deviation,
      suggestedAdjustment: adjustment,
    };
  });
}