export type PsychometricIssueCode =
  | "TOO_FEW_OPTIONS"
  | "OPTION_LENGTH_IMBALANCE"
  | "CORRECT_ANSWER_LENGTH_OUTLIER"
  | "REPETITIVE_OPTION_PREFIX"
  | "ABSOLUTE_LANGUAGE_DISTRACTOR"
  | "ALL_OF_THE_ABOVE_PATTERN"
  | "NONE_OF_THE_ABOVE_PATTERN"
  | "BINARY_ELIMINATION_RISK"
  | "DISTRACTOR_TOO_SIMILAR"
  | "DISTRACTOR_TOO_IMPLAUSIBLE";

export type PsychometricIssue = {
  code: PsychometricIssueCode;
  severity: "low" | "moderate" | "high";
  message: string;
};

export type PsychometricAnalysisResult = {
  guessingRiskScore: number;
  distractorQualityScore: number;
  structuralQualityScore: number;
  overallScore: number;
  issues: PsychometricIssue[];
};

export type PsychometricQuestionInput = {
  stem?: string | null;
  options?: unknown;
  correctAnswer?: unknown;
  rationale?: string | null;
};

function normalizeOptions(options: unknown): string[] {
  if (!Array.isArray(options)) return [];

  return options
    .map((option) => {
      if (typeof option === "string") return option;
      if (option && typeof option === "object") {
        const candidate = (option as Record<string, unknown>).text;
        if (typeof candidate === "string") return candidate;
      }
      return "";
    })
    .map((option) => option.trim())
    .filter(Boolean);
}

function normalizeCorrectAnswer(correctAnswer: unknown): string[] {
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.map((value) => String(value).trim().toLowerCase());
  }
  if (typeof correctAnswer === "string") {
    return [correctAnswer.trim().toLowerCase()];
  }
  return [];
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function similarity(a: string, b: string): number {
  const aw = new Set(a.toLowerCase().split(/\s+/));
  const bw = new Set(b.toLowerCase().split(/\s+/));
  const overlap = [...aw].filter((word) => bw.has(word)).length;
  return overlap / Math.max(1, Math.min(aw.size, bw.size));
}

export function analyzePsychometricQuestion(
  input: PsychometricQuestionInput,
): PsychometricAnalysisResult {
  const options = normalizeOptions(input.options);
  const correctAnswers = normalizeCorrectAnswer(input.correctAnswer);
  const issues: PsychometricIssue[] = [];

  let guessingRiskScore = 100;
  let distractorQualityScore = 100;
  let structuralQualityScore = 100;

  if (options.length < 4) {
    issues.push({
      code: "TOO_FEW_OPTIONS",
      severity: "high",
      message: "Question has fewer than four options, increasing guessing probability.",
    });
    guessingRiskScore -= 35;
    structuralQualityScore -= 30;
  }

  const lengths = options.map((option) => option.length);
  const avgLength = average(lengths);

  for (const option of options) {
    if (avgLength > 0 && option.length > avgLength * 1.9) {
      issues.push({
        code: "OPTION_LENGTH_IMBALANCE",
        severity: "moderate",
        message: "One option is substantially longer than peers.",
      });
      structuralQualityScore -= 10;
      break;
    }
  }

  const correctOption = options.find((option) =>
    correctAnswers.includes(option.trim().toLowerCase()),
  );

  if (correctOption && avgLength > 0 && correctOption.length > avgLength * 1.8) {
    issues.push({
      code: "CORRECT_ANSWER_LENGTH_OUTLIER",
      severity: "moderate",
      message: "Correct answer may be guessable because it is disproportionately detailed.",
    });
    guessingRiskScore -= 18;
  }

  const prefixes = options.map((option) => option.split(" ")[0]?.toLowerCase() ?? "");
  const repeatedPrefixes = new Set(prefixes.filter((prefix, index) => prefixes.indexOf(prefix) !== index));
  if (repeatedPrefixes.size >= 2) {
    issues.push({
      code: "REPETITIVE_OPTION_PREFIX",
      severity: "low",
      message: "Multiple options share repetitive phrasing or structure.",
    });
    distractorQualityScore -= 8;
  }

  if (options.some((option) => /\b(always|never|all|none)\b/i.test(option))) {
    issues.push({
      code: "ABSOLUTE_LANGUAGE_DISTRACTOR",
      severity: "moderate",
      message: "Absolute wording may create implausible distractors.",
    });
    distractorQualityScore -= 12;
  }

  if (options.some((option) => /all of the above/i.test(option))) {
    issues.push({
      code: "ALL_OF_THE_ABOVE_PATTERN",
      severity: "moderate",
      message: "'All of the above' weakens psychometric quality.",
    });
    guessingRiskScore -= 15;
  }

  if (options.some((option) => /none of the above/i.test(option))) {
    issues.push({
      code: "NONE_OF_THE_ABOVE_PATTERN",
      severity: "moderate",
      message: "'None of the above' weakens distractor analysis value.",
    });
    distractorQualityScore -= 12;
  }

  const shortOptions = options.filter((option) => option.length < 12).length;
  if (shortOptions >= Math.max(2, Math.floor(options.length / 2))) {
    issues.push({
      code: "BINARY_ELIMINATION_RISK",
      severity: "moderate",
      message: "Several distractors are extremely short/simple and may be eliminated rapidly.",
    });
    guessingRiskScore -= 14;
  }

  for (let i = 0; i < options.length; i += 1) {
    for (let j = i + 1; j < options.length; j += 1) {
      const overlap = similarity(options[i], options[j]);
      if (overlap >= 0.85) {
        issues.push({
          code: "DISTRACTOR_TOO_SIMILAR",
          severity: "low",
          message: "Two distractors are nearly identical.",
        });
        distractorQualityScore -= 8;
        break;
      }
    }
  }

  const implausibleDistractors = options.filter(
    (option) => option.length < 8 || /^yes$|^no$/i.test(option.trim()),
  ).length;

  if (implausibleDistractors >= 1) {
    issues.push({
      code: "DISTRACTOR_TOO_IMPLAUSIBLE",
      severity: "moderate",
      message: "One or more distractors may be implausible or non-clinical.",
    });
    distractorQualityScore -= 14;
  }

  guessingRiskScore = Math.max(0, Math.min(100, Math.round(guessingRiskScore)));
  distractorQualityScore = Math.max(0, Math.min(100, Math.round(distractorQualityScore)));
  structuralQualityScore = Math.max(0, Math.min(100, Math.round(structuralQualityScore)));

  const overallScore = Math.round(
    guessingRiskScore * 0.35 +
      distractorQualityScore * 0.4 +
      structuralQualityScore * 0.25,
  );

  return {
    guessingRiskScore,
    distractorQualityScore,
    structuralQualityScore,
    overallScore,
    issues,
  };
}
