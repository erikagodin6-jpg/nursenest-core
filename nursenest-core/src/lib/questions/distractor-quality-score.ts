export type DistractorTaxonomy =
  | "priority_error"
  | "timing_error"
  | "assessment_error"
  | "safety_error"
  | "interpretation_error"
  | "scope_error"
  | "communication_error"
  | "documentation_error";

export type DistractorQualityDimension =
  | "plausibility"
  | "clinicalRealism"
  | "educationalValue"
  | "differentiation"
  | "safetyRelevance";

export type DistractorQualityGate = "fail" | "review" | "publish_eligible" | "flagship";

export type DistractorQualityInput = {
  id?: string;
  distractor: string | null | undefined;
  stem?: string | null;
  correctAnswer?: string | null;
  rationale?: string | null;
  whyTempting?: string | null;
  whyIncorrect?: string | null;
  riskIntroduced?: string | null;
  pathway?: string | null;
  questionType?: string | null;
};

export type DistractorQualityResult = {
  id?: string;
  score: number;
  gate: DistractorQualityGate;
  publishAllowed: boolean;
  taxonomy: DistractorTaxonomy[];
  dimensions: Record<DistractorQualityDimension, number>;
  issues: string[];
  strengths: string[];
  whyTemptingComplete: boolean;
  safetyAnalysisPresent: boolean;
};

export type DistractorSetInput = {
  id?: string;
  stem?: string | null;
  correctAnswer?: string | null;
  distractors: readonly DistractorQualityInput[];
};

export type DistractorSetQualityResult = {
  id?: string;
  score: number;
  gate: DistractorQualityGate;
  publishAllowed: boolean;
  distractors: DistractorQualityResult[];
  issues: string[];
};

export const DISTRACTOR_MIN_PUBLISH_SCORE = 70;

const TAXONOMY_PATTERNS: Array<{ type: DistractorTaxonomy; patterns: RegExp[] }> = [
  {
    type: "priority_error",
    patterns: [/\b(priority|first|initial|before|after|stable|unstable|ABCs|airway|breathing|circulation)\b/i],
  },
  {
    type: "timing_error",
    patterns: [/\b(delay|wait|later|immediate|scheduled|routine|after|before|recheck|next)\b/i],
  },
  {
    type: "assessment_error",
    patterns: [/\b(assess|reassess|monitor|vital|SpO2|SpO₂|lung sounds|pain|neuro|urine output|sensor)\b/i],
  },
  {
    type: "safety_error",
    patterns: [/\b(safety|unsafe|risk|harm|fall|aspiration|bleeding|hypox|shock|sepsis|contraindicat|toxicity)\b/i],
  },
  {
    type: "interpretation_error",
    patterns: [/\b(interpret|trend|lab|ECG|ABG|CBC|potassium|sodium|glucose|troponin|BNP|creatinine)\b/i],
  },
  {
    type: "scope_error",
    patterns: [/\b(delegate|scope|prescribe|diagnos|provider|RN|RPN|LPN|UAP|assistant|RT|NP)\b/i],
  },
  {
    type: "communication_error",
    patterns: [/\b(notify|report|SBAR|handoff|clarify|communicat|teach|reassure|therapeutic)\b/i],
  },
  {
    type: "documentation_error",
    patterns: [/\b(document|chart|record|note|incident report|flow sheet)\b/i],
  },
];

const CLINICAL_ACTION_PATTERN =
  /\b(assess|monitor|reassess|administer|hold|position|suction|oxygen|notify|delegate|document|teach|clarify|prepare|obtain|check|report)\b/i;
const SAFETY_PATTERN =
  /\b(unsafe|risk|harm|delay|worsen|deteriorat|hypox|bleeding|shock|sepsis|fall|aspiration|toxicity|contraindicat|failure|emergency|cannot wait)\b/i;
const WHY_TEMPTING_PATTERN = /\b(tempt|seem|reasonable|because|may choose|appears|sounds|looks|common)\b/i;
const WHY_INCORRECT_PATTERN = /\b(incorrect|wrong|unsafe|does not|fails to|misses|delays|ignores|instead)\b/i;
const THROWAWAY_PATTERN =
  /\b(all of the above|none of the above|do nothing|ignore|irrelevant|unrelated|not applicable|obviously|random|guess)\b/i;
const GENERIC_RATIONALE_PATTERN =
  /\b(not the priority|less appropriate|incorrect because|wrong because|not best|review the topic|study the material)\b/i;
const ABSOLUTE_GIVEAWAY_PATTERN = /\b(always|never|only|all patients|no patients|guaranteed)\b/i;

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

function words(value: string): string[] {
  return value.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

function wordOverlap(a: string, b: string): number {
  const aw = new Set(words(a).filter((word) => word.length > 3));
  const bw = new Set(words(b).filter((word) => word.length > 3));
  if (aw.size === 0 || bw.size === 0) return 0;
  return [...aw].filter((word) => bw.has(word)).length / Math.min(aw.size, bw.size);
}

function taxonomyFor(text: string): DistractorTaxonomy[] {
  return TAXONOMY_PATTERNS.flatMap(({ type, patterns }) =>
    patterns.some((pattern) => pattern.test(text)) ? [type] : [],
  );
}

function gateFor(score: number): DistractorQualityGate {
  if (score < 70) return "fail";
  if (score < 85) return "review";
  if (score < 95) return "publish_eligible";
  return "flagship";
}

function hasWhyTempting(input: DistractorQualityInput): boolean {
  const text = [input.whyTempting, input.rationale].map(plain).join(" ");
  return wordCount(text) >= 8 && WHY_TEMPTING_PATTERN.test(text);
}

function hasWhyIncorrect(input: DistractorQualityInput): boolean {
  const text = [input.whyIncorrect, input.rationale].map(plain).join(" ");
  return wordCount(text) >= 8 && WHY_INCORRECT_PATTERN.test(text);
}

function hasSafetyAnalysis(input: DistractorQualityInput): boolean {
  const text = [input.riskIntroduced, input.whyIncorrect, input.rationale, input.stem].map(plain).join(" ");
  return SAFETY_PATTERN.test(text);
}

export function normalizeDistractorForDuplicateDetection(value: unknown): string {
  return plain(value).toLowerCase().replace(/["'“”‘’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreDistractorQuality(input: DistractorQualityInput): DistractorQualityResult {
  const distractor = plain(input.distractor);
  const stem = plain(input.stem);
  const correctAnswer = plain(input.correctAnswer);
  const rationale = plain(input.rationale);
  const combined = [distractor, rationale, input.whyTempting, input.whyIncorrect, input.riskIntroduced, stem].map(plain).join(" ");
  const issues: string[] = [];
  const strengths: string[] = [];
  const taxonomy = taxonomyFor(combined);
  const whyTemptingComplete = hasWhyTempting(input);
  const whyIncorrectComplete = hasWhyIncorrect(input);
  const safetyAnalysisPresent = hasSafetyAnalysis(input);

  let plausibility = 82;
  let clinicalRealism = 78;
  let educationalValue = 72;
  let differentiation = 80;
  let safetyRelevance = 70;

  if (!distractor) {
    issues.push("Distractor text is missing.");
    plausibility = 0;
    clinicalRealism = 0;
    differentiation = 0;
  }
  if (wordCount(distractor) < 3) {
    issues.push("Distractor is too short to be clinically plausible.");
    plausibility -= 30;
    educationalValue -= 20;
  }
  if (THROWAWAY_PATTERN.test(distractor)) {
    issues.push("Throwaway or non-clinical distractor pattern detected.");
    plausibility -= 45;
    educationalValue -= 35;
  }
  if (ABSOLUTE_GIVEAWAY_PATTERN.test(distractor) && !/\b(if|when|unless|except|usually|often|policy)\b/i.test(distractor)) {
    issues.push("Absolute-language giveaway detected.");
    plausibility -= 18;
  }
  if (!CLINICAL_ACTION_PATTERN.test(combined)) {
    issues.push("Distractor lacks realistic clinical action, assessment, or workflow language.");
    clinicalRealism -= 25;
  } else {
    strengths.push("Clinical workflow or action language present.");
    clinicalRealism += 8;
  }
  if (taxonomy.length === 0) {
    issues.push("Distractor does not map to a defined misconception taxonomy.");
    educationalValue -= 20;
  } else {
    strengths.push(`Maps to ${taxonomy.map((item) => item.replace(/_/g, " ")).join(", ")}.`);
    educationalValue += 10;
  }
  if (!whyTemptingComplete) {
    issues.push("Why-tempting analysis is missing or too implicit.");
    educationalValue -= 18;
  } else {
    strengths.push("Why-tempting analysis present.");
    educationalValue += 10;
  }
  if (!whyIncorrectComplete) {
    issues.push("Why-incorrect analysis is missing or too implicit.");
    educationalValue -= 18;
  } else {
    strengths.push("Why-incorrect analysis present.");
    educationalValue += 10;
  }
  if (!safetyAnalysisPresent) {
    issues.push("Safety risk or consequence analysis is missing.");
    safetyRelevance -= 28;
  } else {
    strengths.push("Safety consequence signal present.");
    safetyRelevance += 14;
  }
  if (GENERIC_RATIONALE_PATTERN.test(rationale)) {
    issues.push("Generic distractor rationale language detected.");
    educationalValue -= 18;
  }
  const correctSimilarity = correctAnswer ? wordOverlap(distractor, correctAnswer) : 0;
  if (correctSimilarity > 0.75) {
    issues.push("Distractor is too similar to the correct answer.");
    differentiation -= 35;
  } else if (correctSimilarity >= 0.18) {
    strengths.push("Distractor shares enough surface features to feel plausible.");
    plausibility += 8;
  }
  if (stem && wordOverlap(distractor, stem) < 0.05 && wordOverlap(rationale, stem) < 0.05) {
    issues.push("Distractor appears weakly connected to the stem.");
    plausibility -= 18;
  }

  const dimensions = {
    plausibility: clamp(plausibility),
    clinicalRealism: clamp(clinicalRealism),
    educationalValue: clamp(educationalValue),
    differentiation: clamp(differentiation),
    safetyRelevance: clamp(safetyRelevance),
  };

  let score = clamp(
    dimensions.plausibility * 0.24 +
      dimensions.clinicalRealism * 0.2 +
      dimensions.educationalValue * 0.24 +
      dimensions.differentiation * 0.14 +
      dimensions.safetyRelevance * 0.18,
  );

  if (!whyTemptingComplete || !safetyAnalysisPresent) score = Math.min(score, 69);
  if (issues.some((issue) => /missing|throwaway|too similar/i.test(issue))) score = Math.min(score, 78);

  const gate = gateFor(score);
  return {
    id: input.id,
    score,
    gate,
    publishAllowed: score >= DISTRACTOR_MIN_PUBLISH_SCORE && whyTemptingComplete && safetyAnalysisPresent,
    taxonomy,
    dimensions,
    issues,
    strengths,
    whyTemptingComplete,
    safetyAnalysisPresent,
  };
}

export function scoreDistractorSetQuality(input: DistractorSetInput): DistractorSetQualityResult {
  const seen = new Map<string, number>();
  const distractors = input.distractors.map((distractor) =>
    scoreDistractorQuality({
      ...distractor,
      stem: distractor.stem ?? input.stem,
      correctAnswer: distractor.correctAnswer ?? input.correctAnswer,
    }),
  );
  const issues: string[] = [];

  for (const distractor of input.distractors) {
    const key = normalizeDistractorForDuplicateDetection(distractor.distractor);
    if (!key) continue;
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  const duplicateCount = [...seen.values()].filter((count) => count > 1).length;
  if (duplicateCount > 0) issues.push(`${duplicateCount} duplicate distractor text group(s) detected.`);
  if (distractors.length < 3) issues.push("MCQ-style item has fewer than three distractors.");

  const minScore = distractors.length ? Math.min(...distractors.map((distractor) => distractor.score)) : 0;
  const average = distractors.length
    ? Math.round(distractors.reduce((sum, distractor) => sum + distractor.score, 0) / distractors.length)
    : 0;
  let score = Math.min(average, minScore);
  if (duplicateCount > 0) score = Math.min(score, 69);
  const publishAllowed = distractors.length >= 3 && duplicateCount === 0 && distractors.every((distractor) => distractor.publishAllowed);

  return {
    id: input.id,
    score,
    gate: gateFor(score),
    publishAllowed,
    distractors,
    issues,
  };
}

