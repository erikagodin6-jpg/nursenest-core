export type QuestionQualityReviewFlag =
  | "critical_care"
  | "pediatric"
  | "np"
  | "pharmacology"
  | "emergency"
  | "complex_ecg";

export type QuestionQualityDimension =
  | "clinicalAccuracy"
  | "educationalValue"
  | "reasoningQuality"
  | "distractorQuality"
  | "rationaleQuality"
  | "hintQuality"
  | "pearlQuality"
  | "examRelevance";

export type QuestionQualityIssue = {
  readonly dimension: QuestionQualityDimension;
  readonly severity: "info" | "warning" | "error" | "critical";
  readonly code: string;
  readonly message: string;
};

export type QuestionQualityInput = {
  readonly id: string;
  readonly stem?: string | null;
  readonly options?: readonly string[] | null;
  readonly correctAnswer?: string | readonly string[] | null;
  readonly rationale?: string | null;
  readonly whyCorrect?: string | null;
  readonly whyIncorrect?: readonly string[] | Record<string, string> | null;
  readonly clinicalReasoning?: string | null;
  readonly patientSafetyImplications?: string | null;
  readonly examStrategy?: string | null;
  readonly clinicalApplication?: string | null;
  readonly clinicalPearl?: string | null;
  readonly hint?: string | null;
  readonly relatedTopics?: readonly string[] | null;
  readonly topic?: string | null;
  readonly pathway?: string | null;
  readonly profession?: string | null;
  readonly questionType?: string | null;
  readonly duplicateCount?: number | null;
};

export type QuestionQualityScore = {
  readonly id: string;
  readonly score: number;
  readonly status: "publish_ready" | "needs_review" | "do_not_publish";
  readonly dimensions: Record<QuestionQualityDimension, number>;
  readonly issues: readonly QuestionQualityIssue[];
  readonly reviewFlags: readonly QuestionQualityReviewFlag[];
};

export const QUESTION_QUALITY_REVIEW_THRESHOLD = 85;
export const QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD = 70;

const PLACEHOLDER_PATTERN = /\b(todo|tbd|placeholder|lorem ipsum|coming soon|insert|draft stub|rationale unavailable|answer shown)\b/i;
const GENERIC_RATIONALE_PATTERN =
  /\b(is correct because it is correct|because it is correct|not the best answer|less appropriate|not priority|review the material|study this topic|clinical reasoning is to choose|responds to the priority cue)\b/i;
const ANSWER_REVEALING_HINT_PATTERN = /\b(option\s+[a-f]|answer\s+is|correct answer|choose\s+[a-f]|focuses on\s+[a-z])/i;
const CLINICAL_CUE_PATTERN =
  /\b(airway|breathing|circulation|oxygen|spo2|perfusion|hypotension|tachycardia|bradycardia|fever|sepsis|shock|stroke|bleeding|glucose|potassium|sodium|creatinine|hemoglobin|platelet|ecg|stemi|arrhythmia|medication|dose|contraindicat|monitor|delegate|scope|sbar|documentation)\b/i;
const REASONING_PATTERN =
  /\b(because|therefore|indicates|suggests|reflects|causes|leads to|risk|priority|first|before|after|unstable|deteriorat|escalat|evaluate|reassess|mechanism|pathophysiology)\b/i;
const EXAM_PATTERN = /\b(nclex|rex-pn|cpnre|cnple|ngn|cat|sata|bowtie|matrix|case study|priority|delegation|clinical judgment|exam)\b/i;

function plain(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(value: unknown): number {
  const text = plain(value);
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function optionList(options: readonly string[] | null | undefined): string[] {
  return (options ?? []).map(plain).filter(Boolean);
}

function incorrectRationales(input: QuestionQualityInput): string[] {
  const raw = input.whyIncorrect;
  if (Array.isArray(raw)) return raw.map(plain).filter(Boolean);
  if (raw && typeof raw === "object") return Object.values(raw).map(plain).filter(Boolean);
  return [];
}

function combinedTeachingText(input: QuestionQualityInput): string {
  return [
    input.stem,
    input.rationale,
    input.whyCorrect,
    ...incorrectRationales(input),
    input.clinicalReasoning,
    input.patientSafetyImplications,
    input.examStrategy,
    input.clinicalApplication,
    input.clinicalPearl,
    input.hint,
    ...(input.relatedTopics ?? []),
  ]
    .map(plain)
    .filter(Boolean)
    .join(" ");
}

function hasCorrectAnswer(input: QuestionQualityInput): boolean {
  if (Array.isArray(input.correctAnswer)) return input.correctAnswer.some((answer) => plain(answer).length > 0);
  return plain(input.correctAnswer).length > 0;
}

function addIssue(
  issues: QuestionQualityIssue[],
  dimension: QuestionQualityDimension,
  severity: QuestionQualityIssue["severity"],
  code: string,
  message: string,
): void {
  issues.push({ dimension, severity, code, message });
}

function scoreClinicalAccuracy(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 88;
  if (PLACEHOLDER_PATTERN.test(combined)) {
    score -= 45;
    addIssue(issues, "clinicalAccuracy", "critical", "placeholder_content", "Placeholder or unpublished-stub language is present.");
  }
  if (/\b(always|never|guaranteed|only intervention|cure)\b/i.test(combined)) {
    score -= 18;
    addIssue(issues, "clinicalAccuracy", "error", "unsafe_absolute_language", "Unsafe absolute clinical language requires review.");
  }
  if (!CLINICAL_CUE_PATTERN.test(combined)) score -= 12;
  return clamp(score);
}

function scoreEducationalValue(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  let score = 100;
  if (wordCount(input.stem) < 12) {
    score -= 25;
    addIssue(issues, "educationalValue", "error", "thin_stem", "Question stem is too short to create a meaningful clinical decision.");
  }
  if (wordCount(input.rationale) < 50) score -= 20;
  if (!plain(input.clinicalApplication)) score -= 15;
  if (!plain(input.relatedTopics?.join(" "))) score -= 10;
  return clamp(score);
}

function scoreReasoningQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!REASONING_PATTERN.test(combined)) {
    score -= 35;
    addIssue(issues, "reasoningQuality", "error", "missing_reasoning_language", "Teaching text does not explain why the answer follows from the cue.");
  }
  if (!plain(input.clinicalReasoning)) score -= 20;
  if (!plain(input.patientSafetyImplications)) score -= 15;
  return clamp(score);
}

function scoreDistractorQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const options = optionList(input.options);
  const distractors = incorrectRationales(input);
  let score = 100;
  if (options.length > 0 && options.length < 4 && !/bowtie|matrix|trend|case/i.test(plain(input.questionType))) {
    score -= 25;
    addIssue(issues, "distractorQuality", "error", "too_few_options", "MCQ-style items should include at least four plausible options.");
  }
  if (distractors.length === 0) {
    score -= 35;
    addIssue(issues, "distractorQuality", "error", "missing_distractor_analysis", "Wrong-answer rationales are missing.");
  }
  const weak = distractors.filter((item) => wordCount(item) < 12 || GENERIC_RATIONALE_PATTERN.test(item)).length;
  if (weak > 0) {
    score -= weak * 15;
    addIssue(issues, "distractorQuality", "warning", "weak_distractors", "One or more distractor rationales are shallow or generic.");
  }
  return clamp(score);
}

function scoreRationaleQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const rationale = [input.rationale, input.whyCorrect, input.clinicalReasoning, input.clinicalApplication].map(plain).join(" ");
  let score = 100;
  if (wordCount(rationale) < 80) {
    score -= 28;
    addIssue(issues, "rationaleQuality", "error", "thin_rationale", "Rationale is too short for premium clinical teaching.");
  }
  if (GENERIC_RATIONALE_PATTERN.test(rationale)) {
    score -= 35;
    addIssue(issues, "rationaleQuality", "critical", "generic_rationale", "Rationale contains generic or template-like explanation.");
  }
  if (!plain(input.whyCorrect)) score -= 12;
  if (!plain(input.clinicalApplication)) score -= 12;
  return clamp(score);
}

function scoreHintQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const hint = plain(input.hint);
  let score = 100;
  if (!hint) {
    score -= 35;
    addIssue(issues, "hintQuality", "error", "missing_hint", "Hint is missing.");
  } else {
    if (wordCount(hint) < 8) score -= 18;
    if (ANSWER_REVEALING_HINT_PATTERN.test(hint)) {
      score -= 45;
      addIssue(issues, "hintQuality", "critical", "answer_revealing_hint", "Hint appears to disclose the answer instead of guiding reasoning.");
    }
    if (!/\b(consider|think|which|what|greatest|immediate|underlying|priority|cue|risk|mechanism|pathophysiology|scope)\b/i.test(hint)) {
      score -= 12;
    }
  }
  return clamp(score);
}

function scorePearlQuality(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const pearl = plain(input.clinicalPearl);
  let score = 100;
  if (!pearl) {
    score -= 35;
    addIssue(issues, "pearlQuality", "error", "missing_clinical_pearl", "Clinical pearl is missing.");
  } else {
    if (wordCount(pearl) < 10) score -= 18;
    if (!CLINICAL_CUE_PATTERN.test(pearl) && !REASONING_PATTERN.test(pearl)) score -= 15;
    if (GENERIC_RATIONALE_PATTERN.test(pearl)) score -= 25;
  }
  return clamp(score);
}

function scoreExamRelevance(input: QuestionQualityInput, issues: QuestionQualityIssue[]): number {
  const combined = combinedTeachingText(input);
  let score = 100;
  if (!plain(input.examStrategy)) {
    score -= 24;
    addIssue(issues, "examRelevance", "warning", "missing_exam_strategy", "Exam strategy is missing.");
  }
  if (!EXAM_PATTERN.test([combined, input.pathway, input.questionType].map(plain).join(" "))) score -= 16;
  if ((input.duplicateCount ?? 1) > 1) {
    score -= Math.min(30, ((input.duplicateCount ?? 1) - 1) * 10);
    addIssue(issues, "examRelevance", "warning", "possible_duplicate", "Question appears duplicated or near-duplicated.");
  }
  return clamp(score);
}

export function getProfessionalReviewFlags(input: Pick<QuestionQualityInput, "topic" | "pathway" | "profession" | "questionType" | "stem">): QuestionQualityReviewFlag[] {
  const text = [input.topic, input.pathway, input.profession, input.questionType, input.stem].map(plain).join(" ");
  const flags: QuestionQualityReviewFlag[] = [];
  if (/\b(icu|critical care|shock|ventilator|hemodynamic|vasopressor)\b/i.test(text)) flags.push("critical_care");
  if (/\b(pediatric|paediatric|infant|child|newborn|neonate|nicu|picu)\b/i.test(text)) flags.push("pediatric");
  if (/\b(np|nurse practitioner|cnple|fnp|agpcnp|pmhnp|whnp|pnp)\b/i.test(text)) flags.push("np");
  if (/\b(pharmacology|medication|drug|dose|insulin|opioid|anticoagulant|antibiotic|prescrib)\b/i.test(text)) flags.push("pharmacology");
  if (/\b(emergency|trauma|stroke|sepsis|acs|code blue|rapid response|respiratory failure|acute respiratory|anaphylaxis)\b/i.test(text)) flags.push("emergency");
  if (/\b(ecg|ekg|stemi|arrhythmia|heart block|ventricular tachycardia|vfib|telemetry)\b/i.test(text)) flags.push("complex_ecg");
  return [...new Set(flags)];
}

export function scoreQuestionQuality(input: QuestionQualityInput): QuestionQualityScore {
  const issues: QuestionQualityIssue[] = [];
  const dimensions = {
    clinicalAccuracy: scoreClinicalAccuracy(input, issues),
    educationalValue: scoreEducationalValue(input, issues),
    reasoningQuality: scoreReasoningQuality(input, issues),
    distractorQuality: scoreDistractorQuality(input, issues),
    rationaleQuality: scoreRationaleQuality(input, issues),
    hintQuality: scoreHintQuality(input, issues),
    pearlQuality: scorePearlQuality(input, issues),
    examRelevance: scoreExamRelevance(input, issues),
  } satisfies Record<QuestionQualityDimension, number>;

  if (!hasCorrectAnswer(input)) {
    addIssue(issues, "educationalValue", "critical", "missing_correct_answer", "Correct answer is missing.");
  }

  const score = clamp(
    dimensions.clinicalAccuracy * 0.15 +
      dimensions.educationalValue * 0.14 +
      dimensions.reasoningQuality * 0.16 +
      dimensions.distractorQuality * 0.13 +
      dimensions.rationaleQuality * 0.16 +
      dimensions.hintQuality * 0.1 +
      dimensions.pearlQuality * 0.08 +
      dimensions.examRelevance * 0.08,
  );
  const hasCritical = issues.some((issue) => issue.severity === "critical");
  const effectiveScore = hasCritical ? Math.min(score, QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD - 1) : score;

  return {
    id: input.id,
    score: effectiveScore,
    status:
      effectiveScore < QUESTION_QUALITY_DO_NOT_PUBLISH_THRESHOLD
        ? "do_not_publish"
        : effectiveScore < QUESTION_QUALITY_REVIEW_THRESHOLD
          ? "needs_review"
          : "publish_ready",
    dimensions,
    issues,
    reviewFlags: getProfessionalReviewFlags(input),
  };
}
