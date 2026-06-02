export type RationaleQualityDimension =
  | "clinicalReasoningDepth"
  | "whyIncorrectDepth"
  | "safetyTeaching"
  | "clinicalApplication"
  | "examRelevance"
  | "transferableLearning";

export type RationaleQualityGate = "fail" | "review" | "publish_eligible" | "flagship";

export type RationaleContractField =
  | "correctAnswer"
  | "whyCorrect"
  | "whyIncorrect"
  | "clinicalReasoning"
  | "patientSafetyImplications"
  | "clinicalApplication"
  | "examStrategy"
  | "clinicalPearl"
  | "relatedContent";

export type RationaleRepetitionFinding = {
  patternId: string;
  severity: "low" | "medium" | "high";
  message: string;
  excerpt?: string;
};

export type RationaleQualityInput = {
  id?: string;
  pathway?: string | null;
  topic?: string | null;
  stem?: unknown;
  correctAnswer?: unknown;
  rationale?: unknown;
  optionRationales?: unknown;
  clinicalPearl?: unknown;
  examStrategy?: unknown;
  relatedContent?: unknown;
  repeatCount?: number;
};

export type RationaleQualityResult = {
  id?: string;
  score: number;
  gate: RationaleQualityGate;
  dimensions: Record<RationaleQualityDimension, number>;
  missingContractFields: RationaleContractField[];
  repetitionFindings: RationaleRepetitionFinding[];
  recommendations: string[];
  wordCount: number;
};

export const RATIONALE_PUBLISH_GATES: Record<RationaleQualityGate, { min: number; max: number; label: string; publishAllowed: boolean }> = {
  fail: { min: 1, max: 69, label: "Fail", publishAllowed: false },
  review: { min: 70, max: 84, label: "Review", publishAllowed: false },
  publish_eligible: { min: 85, max: 94, label: "Publish Eligible", publishAllowed: true },
  flagship: { min: 95, max: 100, label: "Flagship", publishAllowed: true },
};

const DIMENSION_WEIGHTS: Record<RationaleQualityDimension, number> = {
  clinicalReasoningDepth: 0.24,
  whyIncorrectDepth: 0.18,
  safetyTeaching: 0.18,
  clinicalApplication: 0.16,
  examRelevance: 0.12,
  transferableLearning: 0.12,
};

const CLINICAL_REASONING_PATTERNS = [
  /\b(cue|finding|trend|pattern|suggests|indicates|because|therefore|leads to|results in)\b/i,
  /\b(pathophysiology|mechanism|perfusion|oxygenation|ventilation|hemodynamic|inflammatory|metabolic)\b/i,
  /\b(priorit|unstable|stable|acute|chronic|expected|unexpected|reassess|escalat|intervene)\b/i,
  /\b(airway|breathing|circulation|ABCs|Maslow|clinical judgment|differential)\b/i,
];

const SAFETY_PATTERNS = [
  /\b(safety|harm|risk|complication|deteriorat|warning|red flag|emergency|critical)\b/i,
  /\b(hypox|bleeding|sepsis|shock|fall|aspiration|arrhythmia|stroke|overdose|toxicity)\b/i,
  /\b(notify|escalat|rapid response|hold|monitor|reassess|urgent|immediate)\b/i,
];

const APPLICATION_PATTERNS = [
  /\b(patient|client|bedside|clinical|practice|placement|shift|handoff|documentation)\b/i,
  /\b(assess|monitor|administer|teach|educat|position|delegate|collaborat|communicat)\b/i,
  /\b(vital signs|lab|medication|dose|oxygen|wound|ECG|ABG|care plan)\b/i,
];

const EXAM_PATTERNS = [
  /\b(NCLEX|NGN|REx-PN|CNPLE|CAT|SATA|bowtie|matrix|case study|exam)\b/i,
  /\b(first|best|priority|most appropriate|initial|next|delegation|scope|eliminate|trap)\b/i,
];

const TRANSFER_PATTERNS = [
  /\b(remember|pearl|takeaway|rule|principle|in similar questions|when you see|common mistake)\b/i,
  /\b(red flag|early sign|late sign|pattern recognition|experienced|novice|what happens if)\b/i,
  /\b(related lesson|related content|flashcard|simulation|skill|study plan|remediation)\b/i,
];

const REPETITION_PATTERNS: Array<{ id: string; re: RegExp; severity: RationaleRepetitionFinding["severity"]; message: string }> = [
  {
    id: "is_correct_because",
    re: /\bis correct because\b/i,
    severity: "high",
    message: "Circular or templated correct-answer phrasing detected.",
  },
  {
    id: "option_is_incorrect_because",
    re: /\boption\s+[a-f]\s+is\s+incorrect\s+because\b/i,
    severity: "high",
    message: "Template wrong-option phrasing detected.",
  },
  {
    id: "this_option_is_incorrect",
    re: /\bthis option is incorrect\b/i,
    severity: "medium",
    message: "Generic wrong-option phrasing detected.",
  },
  {
    id: "not_the_best_answer",
    re: /\bnot\s+the\s+best\s+answer\b/i,
    severity: "high",
    message: "Weak distractor explanation detected.",
  },
  {
    id: "less_appropriate",
    re: /\bless\s+appropriate\b/i,
    severity: "medium",
    message: "Low-specificity distractor language detected.",
  },
  {
    id: "supports_safe_care",
    re: /\bsupports?\s+safe\s+care\b/i,
    severity: "medium",
    message: "Generic safety phrasing detected.",
  },
  {
    id: "use_nursing_process",
    re: /\b(use|using)\s+the\s+nursing\s+process\b/i,
    severity: "high",
    message: "Generic nursing-process template detected.",
  },
  {
    id: "clinical_reasoning_is",
    re: /\bthe\s+clinical\s+reasoning\s+is\b/i,
    severity: "high",
    message: "Template clinical-reasoning sentence detected.",
  },
];

const STOP_WORDS = new Set([
  "the",
  "and",
  "that",
  "with",
  "this",
  "from",
  "have",
  "should",
  "client",
  "patient",
  "nurse",
  "which",
  "what",
  "when",
  "where",
  "because",
]);

function clamp(value: number): number {
  return Math.max(1, Math.min(100, Math.round(value)));
}

function plain(text: unknown): string {
  if (text == null) return "";
  return String(text)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function flattenText(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const normalized = plain(value);
    return normalized ? [normalized] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenText(item));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
      const nestedText = flattenText(nested);
      return nestedText.map((text) => `${key}: ${text}`);
    });
  }
  return [];
}

function normalizeForDuplicateDetection(text: string): string {
  return text
    .toLowerCase()
    .replace(/["'“”‘’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function patternCoverage(text: string, patterns: RegExp[]): number {
  return patterns.reduce((count, pattern) => count + (pattern.test(text) ? 1 : 0), 0);
}

function hasStemTransfer(stem: string, combined: string): boolean {
  const keywords = plain(stem)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 5 && !STOP_WORDS.has(term));
  const unique = [...new Set(keywords)].slice(0, 18);
  if (unique.length === 0) return true;
  const normalized = combined.toLowerCase();
  return unique.some((term) => normalized.includes(term));
}

function extractRepeatedSentenceFindings(texts: string[]): RationaleRepetitionFinding[] {
  const sentenceCounts = new Map<string, { count: number; original: string }>();
  for (const text of texts) {
    const sentences = plain(text).split(/(?<=[.!?])\s+/).filter((sentence) => wordCount(sentence) >= 6);
    for (const sentence of sentences) {
      const normalized = normalizeForDuplicateDetection(sentence);
      if (wordCount(normalized) < 6) continue;
      const existing = sentenceCounts.get(normalized);
      sentenceCounts.set(normalized, {
        count: (existing?.count ?? 0) + 1,
        original: existing?.original ?? sentence,
      });
    }
  }

  return [...sentenceCounts.entries()]
    .filter(([, value]) => value.count > 1)
    .slice(0, 5)
    .map(([normalized, value]) => ({
      patternId: "repeated_sentence",
      severity: value.count >= 3 ? "high" : "medium",
      message: `Repeated rationale sentence appears ${value.count} times in the same item.`,
      excerpt: value.original || normalized,
    }));
}

export function collectRationaleTexts(input: RationaleQualityInput): string[] {
  return [
    ...flattenText(input.correctAnswer),
    ...flattenText(input.rationale),
    ...flattenText(input.optionRationales),
    ...flattenText(input.clinicalPearl),
    ...flattenText(input.examStrategy),
    ...flattenText(input.relatedContent),
  ].filter(Boolean);
}

export function detectRationaleRepetition(texts: string[], repeatCount = 1): RationaleRepetitionFinding[] {
  const combined = texts.join(" ");
  const findings: RationaleRepetitionFinding[] = [];

  for (const pattern of REPETITION_PATTERNS) {
    const match = combined.match(pattern.re);
    if (match) {
      findings.push({
        patternId: pattern.id,
        severity: pattern.severity,
        message: pattern.message,
        excerpt: match[0],
      });
    }
  }

  findings.push(...extractRepeatedSentenceFindings(texts));

  if (repeatCount > 1) {
    findings.push({
      patternId: "cross_item_reuse",
      severity: repeatCount >= 4 ? "high" : "medium",
      message: `Rationale text appears reused across ${repeatCount} items.`,
    });
  }

  return findings;
}

export function rationaleQualityGate(score: number): RationaleQualityGate {
  if (score < 70) return "fail";
  if (score < 85) return "review";
  if (score < 95) return "publish_eligible";
  return "flagship";
}

export function canPublishRationale(scoreOrResult: number | Pick<RationaleQualityResult, "score" | "gate">): boolean {
  const gate = typeof scoreOrResult === "number" ? rationaleQualityGate(scoreOrResult) : scoreOrResult.gate;
  return RATIONALE_PUBLISH_GATES[gate].publishAllowed;
}

function scoreClinicalReasoning(combined: string, stem: string): number {
  const words = wordCount(combined);
  let score = 36 + patternCoverage(combined, CLINICAL_REASONING_PATTERNS) * 16;
  if (words >= 120) score += 12;
  if (words >= 180) score += 8;
  if (stem && hasStemTransfer(stem, combined)) score += 8;
  return clamp(score);
}

function scoreWhyIncorrect(texts: string[], optionTexts: string[]): number {
  const combined = texts.join(" ");
  const optionCount = optionTexts.length;
  const explicitWrongOptionSignals = (combined.match(/\b(option\s+[a-f]|incorrect|wrong|distractor|not appropriate|lower priority|outside scope)\b/gi) ?? []).length;
  let score = 28 + Math.min(4, optionCount) * 12 + Math.min(5, explicitWrongOptionSignals) * 8;
  const detailedOptionCount = optionTexts.filter((text) => wordCount(text) >= 14).length;
  score += detailedOptionCount * 5;
  if (optionCount === 0) score -= 30;
  return clamp(score);
}

function scoreSafetyTeaching(combined: string): number {
  let score = 34 + patternCoverage(combined, SAFETY_PATTERNS) * 17;
  if (/\b(if|delayed|missed|without|failure to|can lead to|may result in)\b/i.test(combined)) score += 12;
  if (/\bpatient safety implications?\b/i.test(combined)) score += 10;
  if (/\b(risk for deterioration|may worsen|increase cardiac workload|requires? escalation)\b/i.test(combined)) score += 8;
  return clamp(score);
}

function scoreClinicalApplication(combined: string): number {
  let score = 32 + patternCoverage(combined, APPLICATION_PATTERNS) * 17;
  if (/\b(reassess|document|teach|notify|monitor|administer|hold|delegate)\b/i.test(combined)) score += 10;
  return clamp(score);
}

function scoreExamRelevance(combined: string, pathway: string): number {
  let score = 48 + patternCoverage(`${combined} ${pathway}`, EXAM_PATTERNS) * 15;
  if (/\bexam strategy\b/i.test(combined)) score += 10;
  if (/\b(compare|choose|eliminate|tempting|trap|priority framework|scope)\b/i.test(combined)) score += 10;
  return clamp(score);
}

function scoreTransferableLearning(combined: string, hasPearl: boolean, hasRelatedContent: boolean): number {
  let score = 34 + patternCoverage(combined, TRANSFER_PATTERNS) * 15;
  if (hasPearl) score += 16;
  if (hasRelatedContent) score += 16;
  return clamp(score);
}

function inferMissingFields(input: RationaleQualityInput, combined: string, optionTexts: string[]): RationaleContractField[] {
  const missing: RationaleContractField[] = [];
  if (!plain(input.correctAnswer) && !/\bcorrect answer\b/i.test(combined)) missing.push("correctAnswer");
  if (!/\b(why correct|correct because|is correct|because|indicates|addresses)\b/i.test(combined)) missing.push("whyCorrect");
  if (optionTexts.length === 0 && !/\b(why incorrect|incorrect|wrong|distractor|lower priority|not appropriate|outside scope)\b/i.test(combined)) {
    missing.push("whyIncorrect");
  }
  if (patternCoverage(combined, CLINICAL_REASONING_PATTERNS) < 2) missing.push("clinicalReasoning");
  if (patternCoverage(combined, SAFETY_PATTERNS) < 1) missing.push("patientSafetyImplications");
  if (patternCoverage(combined, APPLICATION_PATTERNS) < 1) missing.push("clinicalApplication");
  if (!plain(input.examStrategy) && patternCoverage(combined, EXAM_PATTERNS) < 1) missing.push("examStrategy");
  if (!plain(input.clinicalPearl) && !/\b(clinical pearl|pearl|takeaway|remember)\b/i.test(combined)) missing.push("clinicalPearl");
  if (!plain(input.relatedContent) && !/\b(related lesson|related content|flashcard|simulation|skill|study plan)\b/i.test(combined)) {
    missing.push("relatedContent");
  }
  return missing;
}

export function scoreRationaleQuality(input: RationaleQualityInput): RationaleQualityResult {
  const texts = collectRationaleTexts(input);
  const combined = texts.join(" ");
  const stem = flattenText(input.stem).join(" ");
  const pathway = plain(input.pathway);
  const optionTexts = flattenText(input.optionRationales);
  const clinicalPearl = plain(input.clinicalPearl);
  const relatedContent = plain(input.relatedContent);
  const repetitionFindings = detectRationaleRepetition(texts, input.repeatCount ?? 1);

  const dimensions: Record<RationaleQualityDimension, number> = {
    clinicalReasoningDepth: scoreClinicalReasoning(combined, stem),
    whyIncorrectDepth: scoreWhyIncorrect(texts, optionTexts),
    safetyTeaching: scoreSafetyTeaching(combined),
    clinicalApplication: scoreClinicalApplication(combined),
    examRelevance: scoreExamRelevance(combined, pathway),
    transferableLearning: scoreTransferableLearning(combined, Boolean(clinicalPearl), Boolean(relatedContent)),
  };

  let score = Object.entries(dimensions).reduce((total, [dimension, value]) => {
    return total + value * DIMENSION_WEIGHTS[dimension as RationaleQualityDimension];
  }, 0);

  const wordTotal = wordCount(combined);
  if (wordTotal < 80) score -= 18;
  if (wordTotal < 40) score -= 18;
  if (wordTotal === 0) score = 1;

  const highSeverityRepetition = repetitionFindings.filter((finding) => finding.severity === "high").length;
  const mediumSeverityRepetition = repetitionFindings.filter((finding) => finding.severity === "medium").length;
  score -= highSeverityRepetition * 8 + mediumSeverityRepetition * 4;

  const missingContractFields = inferMissingFields(input, combined, optionTexts);
  score -= Math.min(24, missingContractFields.length * 4);

  const finalScore = clamp(score);
  const recommendations = buildRecommendations(dimensions, missingContractFields, repetitionFindings, wordTotal);

  return {
    id: input.id,
    score: finalScore,
    gate: rationaleQualityGate(finalScore),
    dimensions,
    missingContractFields,
    repetitionFindings,
    recommendations,
    wordCount: wordTotal,
  };
}

function buildRecommendations(
  dimensions: Record<RationaleQualityDimension, number>,
  missingFields: RationaleContractField[],
  repetitionFindings: RationaleRepetitionFinding[],
  wordTotal: number,
): string[] {
  const recommendations: string[] = [];
  if (wordTotal < 120) recommendations.push("Expand rationale depth to at least 120 words of meaningful teaching.");
  if (dimensions.clinicalReasoningDepth < 75) recommendations.push("Add cue interpretation and reasoning from finding to priority action.");
  if (dimensions.whyIncorrectDepth < 75) recommendations.push("Explain each plausible distractor with specific clinical or scope-based reasoning.");
  if (dimensions.safetyTeaching < 75) recommendations.push("Name the patient safety risk or deterioration consequence if the cue is missed.");
  if (dimensions.clinicalApplication < 75) recommendations.push("Add bedside, placement, documentation, or professional-practice application.");
  if (dimensions.examRelevance < 75) recommendations.push("Add an exam strategy for priority, delegation, NGN, or pathway-specific reasoning.");
  if (dimensions.transferableLearning < 75) recommendations.push("Add a clinical pearl and related remediation resources.");
  if (missingFields.length > 0) recommendations.push(`Complete missing contract fields: ${missingFields.join(", ")}.`);
  if (repetitionFindings.length > 0) recommendations.push("Rewrite templated or repeated language so the rationale is question-specific.");
  return [...new Set(recommendations)];
}
