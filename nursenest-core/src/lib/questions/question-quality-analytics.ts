export type QuestionQualityFlag =
  | "too_easy"
  | "too_difficult"
  | "ambiguous"
  | "poor_discrimination"
  | "frequently_reported"
  | "non_functional_distractor"
  | "misleading_distractor"
  | "possible_answer_key_issue";

export type QuestionQualitySeverity = "none" | "low" | "medium" | "high" | "critical";

export type DistractorPerformance = {
  optionKey: string;
  selectionCount: number;
  selectionRate: number;
  isCorrectOption: boolean;
  status: "correct" | "functional" | "non_functional" | "dominant_wrong";
};

export type QuestionQualityAnalyticsInput = {
  totalAttempts: number;
  correctAttempts: number;
  correctOptionKeys: string[];
  optionSelections: Array<{ optionKey: string; selectionCount: number }>;
  discriminationIndex?: number | null;
  averageResponseTimeMs?: number | null;
  reportCount?: number;
};

export type QuestionQualityAnalytics = {
  difficultyIndex: number | null;
  correctResponseRate: number | null;
  discriminationIndex: number | null;
  averageResponseTimeMs: number | null;
  distractors: DistractorPerformance[];
  mostSelectedWrongAnswer: string | null;
  mostSelectedWrongAnswerRate: number | null;
  reportFrequency: number;
  flags: QuestionQualityFlag[];
  severity: QuestionQualitySeverity;
  healthScore: number;
  retirementCandidate: boolean;
  reviewPriority: "monitor" | "review" | "urgent" | "retire";
};

const MIN_ATTEMPTS_FOR_QUALITY = 50;

function round(n: number, places = 3): number {
  const factor = 10 ** places;
  return Math.round(n * factor) / factor;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function computeQuestionQualityAnalytics(input: QuestionQualityAnalyticsInput): QuestionQualityAnalytics {
  const totalAttempts = Math.max(0, input.totalAttempts);
  const correctAttempts = Math.max(0, input.correctAttempts);
  const correctKeys = new Set(input.correctOptionKeys.map((k) => k.trim()).filter(Boolean));
  const correctResponseRate = totalAttempts > 0 ? round(correctAttempts / totalAttempts) : null;
  const difficultyIndex = correctResponseRate;
  const discriminationIndex =
    typeof input.discriminationIndex === "number" && Number.isFinite(input.discriminationIndex)
      ? round(input.discriminationIndex)
      : null;
  const reportFrequency = Math.max(0, input.reportCount ?? 0);

  const distractors = input.optionSelections.map((option) => {
    const selectionCount = Math.max(0, option.selectionCount);
    const selectionRate = totalAttempts > 0 ? round(selectionCount / totalAttempts) : 0;
    const isCorrectOption = correctKeys.has(option.optionKey);
    let status: DistractorPerformance["status"] = "functional";
    if (isCorrectOption) status = "correct";
    else if (selectionRate < 0.05 && totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY) status = "non_functional";
    else if (selectionRate > 0.45 && totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY) status = "dominant_wrong";
    return { optionKey: option.optionKey, selectionCount, selectionRate, isCorrectOption, status };
  });

  const wrongOptions = distractors.filter((d) => !d.isCorrectOption);
  const mostSelectedWrong = wrongOptions.sort((a, b) => b.selectionCount - a.selectionCount)[0] ?? null;
  const mostSelectedWrongAnswer = mostSelectedWrong?.optionKey ?? null;
  const mostSelectedWrongAnswerRate = mostSelectedWrong ? mostSelectedWrong.selectionRate : null;

  const flags: QuestionQualityFlag[] = [];
  if (totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY && correctResponseRate != null && correctResponseRate > 0.9) {
    flags.push("too_easy");
  }
  if (totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY && correctResponseRate != null && correctResponseRate < 0.25) {
    flags.push("too_difficult");
  }
  if (totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY && discriminationIndex != null && discriminationIndex < 0.15) {
    flags.push("poor_discrimination");
  }
  if (reportFrequency >= 3) {
    flags.push("frequently_reported");
  }
  if (wrongOptions.some((d) => d.status === "non_functional")) {
    flags.push("non_functional_distractor");
  }
  if (wrongOptions.some((d) => d.status === "dominant_wrong")) {
    flags.push("misleading_distractor");
  }
  if (
    totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY &&
    mostSelectedWrongAnswerRate != null &&
    correctResponseRate != null &&
    mostSelectedWrongAnswerRate >= correctResponseRate * 0.9 &&
    mostSelectedWrongAnswerRate >= 0.3
  ) {
    flags.push("ambiguous");
  }
  if (totalAttempts >= 20 && correctResponseRate === 0) {
    flags.push("possible_answer_key_issue");
  }

  const activeFlags = unique(flags);
  let healthScore = 100;
  if (activeFlags.includes("possible_answer_key_issue")) healthScore -= 55;
  if (activeFlags.includes("poor_discrimination")) healthScore -= 28;
  if (activeFlags.includes("ambiguous")) healthScore -= 24;
  if (activeFlags.includes("misleading_distractor")) healthScore -= 22;
  if (activeFlags.includes("too_difficult")) healthScore -= 18;
  if (activeFlags.includes("frequently_reported")) healthScore -= 18;
  if (activeFlags.includes("too_easy")) healthScore -= 12;
  if (activeFlags.includes("non_functional_distractor")) healthScore -= 10;

  if (correctResponseRate != null && correctResponseRate >= 0.45 && correctResponseRate <= 0.8) healthScore += 4;
  if (discriminationIndex != null && discriminationIndex >= 0.25) healthScore += 4;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const severity: QuestionQualitySeverity =
    activeFlags.includes("possible_answer_key_issue") || healthScore < 35
      ? "critical"
      : healthScore < 55
        ? "high"
        : healthScore < 75
          ? "medium"
          : activeFlags.includes("too_easy") && activeFlags.includes("non_functional_distractor")
            ? "medium"
          : activeFlags.length > 0
            ? "low"
            : "none";

  const retirementCandidate =
    severity === "critical" ||
    (totalAttempts >= MIN_ATTEMPTS_FOR_QUALITY &&
      (activeFlags.includes("poor_discrimination") || activeFlags.includes("ambiguous")) &&
      (activeFlags.includes("frequently_reported") || activeFlags.includes("misleading_distractor")));

  const reviewPriority: QuestionQualityAnalytics["reviewPriority"] = retirementCandidate
    ? "retire"
    : severity === "high"
      ? "urgent"
      : severity === "medium" || severity === "low"
        ? "review"
        : "monitor";

  return {
    difficultyIndex,
    correctResponseRate,
    discriminationIndex,
    averageResponseTimeMs: input.averageResponseTimeMs ?? null,
    distractors,
    mostSelectedWrongAnswer,
    mostSelectedWrongAnswerRate,
    reportFrequency,
    flags: activeFlags,
    severity,
    healthScore,
    retirementCandidate,
    reviewPriority,
  };
}
