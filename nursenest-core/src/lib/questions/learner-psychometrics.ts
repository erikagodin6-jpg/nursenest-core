export type LearnerPsychometricInput = {
  questionId?: string | null;
  totalAttempts: number;
  correctAttempts: number;
  optionSelectionCounts?: Record<string, number> | null;
  correctOptionKeys?: string[] | null;
  averageResponseTimeMs?: number | null;
  medianResponseTimeMs?: number | null;
  highPerformerCorrectRate?: number | null;
  lowPerformerCorrectRate?: number | null;
};

export type LearnerPsychometricIssueCode =
  | "INSUFFICIENT_SAMPLE"
  | "TOO_EASY"
  | "TOO_HARD"
  | "LOW_DISCRIMINATION"
  | "NEGATIVE_DISCRIMINATION"
  | "NONFUNCTIONAL_DISTRACTOR"
  | "DOMINANT_WRONG_DISTRACTOR"
  | "FAST_GUESSING_PATTERN"
  | "SLOW_CONFUSION_PATTERN";

export type LearnerPsychometricIssue = {
  code: LearnerPsychometricIssueCode;
  severity: "info" | "review" | "high";
  message: string;
};

export type LearnerPsychometricResult = {
  sampleSize: number;
  difficultyIndex: number;
  discriminationIndex: number | null;
  nonfunctionalDistractors: string[];
  dominantWrongDistractors: string[];
  averageResponseTimeSec: number | null;
  calibrationBand: "insufficient-data" | "too-easy" | "too-hard" | "healthy" | "review";
  confidence: "low" | "moderate" | "high";
  issues: LearnerPsychometricIssue[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Number(value.toFixed(3));
}

function optionShare(count: number, total: number): number {
  return total > 0 ? count / total : 0;
}

function normalizeKeys(keys: string[] | null | undefined): Set<string> {
  return new Set((keys ?? []).map((key) => key.trim().toLowerCase()).filter(Boolean));
}

export function analyzeLearnerPsychometrics(
  input: LearnerPsychometricInput,
): LearnerPsychometricResult {
  const issues: LearnerPsychometricIssue[] = [];
  const sampleSize = Math.max(0, input.totalAttempts);
  const correctAttempts = clamp(input.correctAttempts, 0, sampleSize);
  const difficultyIndex = sampleSize > 0 ? round(correctAttempts / sampleSize) : 0;
  const confidence: LearnerPsychometricResult["confidence"] =
    sampleSize >= 400 ? "high" : sampleSize >= 100 ? "moderate" : "low";

  if (sampleSize < 50) {
    issues.push({
      code: "INSUFFICIENT_SAMPLE",
      severity: "info",
      message: "Question has too few attempts for reliable psychometric interpretation.",
    });
  }

  let calibrationBand: LearnerPsychometricResult["calibrationBand"] =
    sampleSize < 50 ? "insufficient-data" : "healthy";

  if (sampleSize >= 50 && difficultyIndex >= 0.9) {
    calibrationBand = "too-easy";
    issues.push({
      code: "TOO_EASY",
      severity: "review",
      message: "Item may be too easy to provide adaptive precision.",
    });
  }

  if (sampleSize >= 50 && difficultyIndex <= 0.2) {
    calibrationBand = "too-hard";
    issues.push({
      code: "TOO_HARD",
      severity: "review",
      message: "Item may be too hard, unclear, or under-taught.",
    });
  }

  const hasPerformanceBands =
    typeof input.highPerformerCorrectRate === "number" &&
    typeof input.lowPerformerCorrectRate === "number";
  const discriminationIndex = hasPerformanceBands
    ? round(clamp(input.highPerformerCorrectRate! - input.lowPerformerCorrectRate!, -1, 1))
    : null;

  if (discriminationIndex !== null && sampleSize >= 100) {
    if (discriminationIndex < 0) {
      calibrationBand = "review";
      issues.push({
        code: "NEGATIVE_DISCRIMINATION",
        severity: "high",
        message: "Lower-performing learners are outperforming higher-performing learners on this item.",
      });
    } else if (discriminationIndex < 0.12) {
      calibrationBand = "review";
      issues.push({
        code: "LOW_DISCRIMINATION",
        severity: "review",
        message: "Item has weak discrimination and may not separate ability levels well.",
      });
    }
  }

  const selections = input.optionSelectionCounts ?? {};
  const correctKeys = normalizeKeys(input.correctOptionKeys);
  const nonfunctionalDistractors: string[] = [];
  const dominantWrongDistractors: string[] = [];

  for (const [key, count] of Object.entries(selections)) {
    const normalizedKey = key.trim().toLowerCase();
    if (correctKeys.has(normalizedKey)) continue;
    const share = optionShare(count, sampleSize);
    if (sampleSize >= 100 && share < 0.03) {
      nonfunctionalDistractors.push(key);
    }
    if (sampleSize >= 100 && share > 0.45 && difficultyIndex < 0.55) {
      dominantWrongDistractors.push(key);
    }
  }

  if (nonfunctionalDistractors.length > 0) {
    issues.push({
      code: "NONFUNCTIONAL_DISTRACTOR",
      severity: "review",
      message: "One or more distractors are rarely selected and may be implausible.",
    });
  }

  if (dominantWrongDistractors.length > 0) {
    issues.push({
      code: "DOMINANT_WRONG_DISTRACTOR",
      severity: "high",
      message: "A wrong option is attracting many learners and may reflect ambiguity or a high-value misconception.",
    });
  }

  const averageResponseTimeSec =
    typeof input.averageResponseTimeMs === "number"
      ? Number((input.averageResponseTimeMs / 1000).toFixed(1))
      : null;

  if (averageResponseTimeSec !== null && sampleSize >= 100) {
    if (averageResponseTimeSec < 12 && difficultyIndex <= 0.35) {
      issues.push({
        code: "FAST_GUESSING_PATTERN",
        severity: "review",
        message: "Learners are answering quickly and incorrectly, suggesting guessing or poor stem engagement.",
      });
    }

    if (averageResponseTimeSec > 150 && difficultyIndex <= 0.45) {
      issues.push({
        code: "SLOW_CONFUSION_PATTERN",
        severity: "review",
        message: "Learners spend a long time but still miss the item, suggesting ambiguity or cognitive overload.",
      });
    }
  }

  return {
    sampleSize,
    difficultyIndex,
    discriminationIndex,
    nonfunctionalDistractors,
    dominantWrongDistractors,
    averageResponseTimeSec,
    calibrationBand,
    confidence,
    issues,
  };
}
