import type {
  QuestionEnrichmentAuditRow,
  QuestionEnrichmentPathwayGroup,
} from "@/lib/questions/question-enrichment-governance";

export type EditorialStandardizationDimension =
  | "rationaleConsistency"
  | "distractorConsistency"
  | "hintConsistency"
  | "clinicalPearlConsistency"
  | "memoryAnchorConsistency"
  | "difficultyCalibration"
  | "cognitiveClassification"
  | "flashcardConsistency"
  | "dailyQuestionReadiness"
  | "adaptiveLearningReadiness"
  | "ngnConsistency"
  | "translationReadiness"
  | "editorialStyle";

export type EditorialCognitiveLevel =
  | "recall"
  | "application"
  | "analysis"
  | "prioritization"
  | "delegation"
  | "clinical_judgment"
  | "management"
  | "leadership"
  | "diagnostic_reasoning";

export type EditorialDifficultyBand = "easy" | "moderate" | "hard" | "advanced" | "expert";

export type EditorialStandardizationIssue = {
  dimension: EditorialStandardizationDimension;
  severity: "critical" | "high" | "medium" | "low";
  code: string;
  message: string;
};

export type EditorialStandardizationResult = {
  id: string;
  pathwayGroup: QuestionEnrichmentPathwayGroup;
  exam: string;
  score: number;
  standardized: boolean;
  dimensions: Record<EditorialStandardizationDimension, number>;
  difficultyBand: EditorialDifficultyBand;
  cognitiveLevel: EditorialCognitiveLevel | "unclassified";
  issues: EditorialStandardizationIssue[];
};

export type EditorialStandardizationSummary = {
  totalQuestionsAudited: number;
  ecosystemQualityScore: number;
  standardizedQuestions: number;
  byPathwayGroup: Record<QuestionEnrichmentPathwayGroup, { total: number; standardized: number; averageScore: number }>;
  byDimension: Record<EditorialStandardizationDimension, number>;
};

const DIMENSIONS = [
  "rationaleConsistency",
  "distractorConsistency",
  "hintConsistency",
  "clinicalPearlConsistency",
  "memoryAnchorConsistency",
  "difficultyCalibration",
  "cognitiveClassification",
  "flashcardConsistency",
  "dailyQuestionReadiness",
  "adaptiveLearningReadiness",
  "ngnConsistency",
  "translationReadiness",
  "editorialStyle",
] as const satisfies readonly EditorialStandardizationDimension[];

const AI_CLICHE_RE =
  /\b(delves? into|unlock|game[- ]changer|robust|comprehensive understanding|it is important to note|in today's healthcare landscape|this question tests your ability)\b/i;
const OVERLY_ACADEMIC_RE =
  /\b(utilize|aforementioned|therein|heretofore|facilitate the implementation|subsequent to|prior to the initiation)\b/i;
const GENERIC_ADVICE_RE =
  /\b(study hard|review the material|remember this topic|be careful|think critically|use nursing process|safe care)\b/i;
const ANSWER_REVEAL_RE = /\b(answer is|correct answer|option\s+[a-f]|choose\s+[a-f]|eliminate option|not option)\b/i;
const IDIOM_RE =
  /\b(rule of thumb|red herring|slam dunk|curveball|low-hanging fruit|bread and butter|back to square one|on the fly|watch out for)\b/i;
const REGION_LOCK_RE = /\b(911|999|111|state board|province-specific|CNO|NMC|AHPRA|HIPAA|PHIPA|A&E|ER)\b/i;

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

function textList(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      return textList(JSON.parse(trimmed));
    } catch {
      return [trimmed];
    }
  }
  if (Array.isArray(value)) return value.flatMap(textList).filter(Boolean);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(textList).filter(Boolean);
  return [plain(value)].filter(Boolean);
}

function pathwayGroupFor(row: Pick<QuestionEnrichmentAuditRow, "exam" | "tier">): QuestionEnrichmentPathwayGroup {
  const text = `${row.exam ?? ""} ${row.tier ?? ""}`.toUpperCase();
  if (/\b(CNPLE|FNP|AGPCNP|PMHNP|PNP|WHNP|ENP|NP)\b/.test(text)) return "NP";
  if (/\b(REX[-_ ]?PN|NCLEX[-_ ]?PN|RPN|LPN|PN)\b/.test(text)) return "RPN_PN";
  return "RN";
}

function addIssue(
  issues: EditorialStandardizationIssue[],
  dimension: EditorialStandardizationDimension,
  severity: EditorialStandardizationIssue["severity"],
  code: string,
  message: string,
): void {
  issues.push({ dimension, severity, code, message });
}

function combinedRationale(row: QuestionEnrichmentAuditRow): string {
  return [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning].map(plain).filter(Boolean).join(" ");
}

function hintText(row: QuestionEnrichmentAuditRow): string {
  const tagHint = (row.tags ?? []).find((tag) => /^hint:/i.test(tag));
  if (tagHint) return tagHint.replace(/^hint:/i, "").trim();
  const strategy = plain(row.examStrategy);
  return /\bhint\s*:/i.test(strategy) ? strategy.replace(/^.*?\bhint\s*:/i, "").trim() : "";
}

function rationaleScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const rationale = combinedRationale(row);
  let score = 100;
  if (wordCount(rationale) < 75) {
    score -= 28;
    addIssue(issues, "rationaleConsistency", "high", "rationale_too_short", "Rationale does not meet the shared 75-word minimum.");
  }
  if (!/\b(because|therefore|indicates|suggests|priority|first|risk|unsafe|safety|deteriorat|reassess|escalat)\b/i.test(rationale)) {
    score -= 22;
    addIssue(issues, "rationaleConsistency", "high", "missing_clinical_reasoning", "Rationale lacks explicit clinical reasoning or priority logic.");
  }
  if (!/\b(pathophysiology|mechanism|perfusion|oxygenation|ventilation|inflammation|metabolic|cardiac|renal|respiratory|neurologic)\b/i.test(rationale)) {
    score -= 16;
  }
  if (!plain(row.examStrategy)) {
    score -= 14;
    addIssue(issues, "rationaleConsistency", "medium", "missing_exam_relevance", "Rationale set is missing exam relevance or strategy.");
  }
  return clamp(score);
}

function distractorScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const distractors = [...textList(row.distractorRationales), ...textList(row.incorrectAnswerRationale)];
  let score = 100;
  if (distractors.length === 0) {
    addIssue(issues, "distractorConsistency", "critical", "missing_distractors", "Distractor rationales are missing.");
    return 35;
  }
  const weak = distractors.filter((text) => wordCount(text) < 25).length;
  if (weak > 0) {
    score -= weak * 18;
    addIssue(issues, "distractorConsistency", "high", "thin_distractors", "One or more distractor rationales are under 25 words.");
  }
  if (!distractors.some((text) => /\b(seems|choose|may choose|tempt|appears|reasonable|common mistake)\b/i.test(text))) {
    score -= 18;
    addIssue(issues, "distractorConsistency", "medium", "missing_why_attractive", "Distractors should explain why learners choose them.");
  }
  if (!distractors.some((text) => /\b(instead|avoid|future|think|approach|cue|priority|risk)\b/i.test(text))) {
    score -= 18;
    addIssue(issues, "distractorConsistency", "medium", "missing_better_thinking", "Distractors should teach the better thinking process.");
  }
  return clamp(score);
}

function hintScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const hint = hintText(row);
  let score = 100;
  if (!hint) {
    addIssue(issues, "hintConsistency", "high", "missing_hint", "Hint is missing.");
    return 45;
  }
  if (ANSWER_REVEAL_RE.test(hint)) {
    score -= 50;
    addIssue(issues, "hintConsistency", "critical", "answer_revealing_hint", "Hint reveals or directly eliminates an answer.");
  }
  if (!/\b(assessment|safety|priority|cue|risk|mechanism|scope|unstable|expected|unexpected|first)\b/i.test(hint)) {
    score -= 22;
    addIssue(issues, "hintConsistency", "medium", "missing_hint_cue_type", "Hint should use an assessment, safety, priority, or reasoning cue.");
  }
  return clamp(score);
}

function pearlScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const pearl = plain(row.clinicalPearl);
  let score = 100;
  if (wordCount(pearl) < 8) {
    addIssue(issues, "clinicalPearlConsistency", "high", "missing_or_thin_pearl", "Clinical pearl is missing or too thin.");
    return 45;
  }
  if (GENERIC_ADVICE_RE.test(pearl)) {
    score -= 28;
    addIssue(issues, "clinicalPearlConsistency", "high", "generic_pearl", "Clinical pearl sounds generic rather than practice-changing.");
  }
  if (!/\b(safety|priority|delegate|medication|warning|risk|pattern|when you see|red flag|escalat|monitor|oxygen|deteriorat)\b/i.test(pearl)) {
    score -= 18;
  }
  return clamp(score);
}

function memoryAnchorScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const anchor = [row.memoryHook, row.mnemonic].map(plain).filter(Boolean).join(" ");
  if (wordCount(anchor) < 4) {
    addIssue(issues, "memoryAnchorConsistency", "medium", "missing_memory_anchor", "Memory anchor is missing.");
    return 55;
  }
  let score = 100;
  if (wordCount(anchor) > 22) score -= 12;
  if (!/\b(remember|when|if|plus|equals|before|after|first|rule|pattern|cue)\b/i.test(anchor)) score -= 12;
  return clamp(score);
}

function normalizeDifficulty(row: QuestionEnrichmentAuditRow): EditorialDifficultyBand {
  const raw = plain(row.difficulty).toLowerCase();
  const cognitive = plain(row.cognitiveLevel).toLowerCase();
  if (/\bexpert\b/.test(raw) || /\bexpert\b/.test(cognitive)) return "expert";
  if (/\badvanced\b/.test(raw) || /\bdiagnostic|management\b/.test(cognitive)) return "advanced";
  const numeric = Number(raw);
  if (Number.isFinite(numeric)) {
    if (numeric <= 2) return "easy";
    if (numeric === 3) return "moderate";
    if (numeric === 4) return "hard";
    return "advanced";
  }
  if (/easy|recall|knowledge/.test(raw)) return "easy";
  if (/moderate|application/.test(raw)) return "moderate";
  if (/hard|analysis|judgment|priorit/.test(raw)) return "hard";
  return "moderate";
}

function normalizeCognitiveLevel(value: unknown): EditorialCognitiveLevel | "unclassified" {
  const text = plain(value).toLowerCase().replace(/[\s-]+/g, "_");
  if (/recall|remember|knowledge/.test(text)) return "recall";
  if (/application|apply/.test(text)) return "application";
  if (/analysis|analyze/.test(text)) return "analysis";
  if (/priorit/.test(text)) return "prioritization";
  if (/delegat/.test(text)) return "delegation";
  if (/clinical_judgment|judgment|judgement|ngn/.test(text)) return "clinical_judgment";
  if (/management|manage/.test(text)) return "management";
  if (/leadership|leader/.test(text)) return "leadership";
  if (/diagnostic|diagnosis|differential/.test(text)) return "diagnostic_reasoning";
  return "unclassified";
}

function difficultyScore(row: QuestionEnrichmentAuditRow, level: EditorialCognitiveLevel | "unclassified", issues: EditorialStandardizationIssue[]): number {
  if (row.difficulty == null || plain(row.difficulty) === "") {
    addIssue(issues, "difficultyCalibration", "high", "missing_difficulty", "Difficulty rating is missing.");
    return 45;
  }
  const band = normalizeDifficulty(row);
  if ((band === "easy" && !["recall", "application"].includes(level)) || (band === "expert" && pathwayGroupFor(row) !== "NP")) {
    addIssue(issues, "difficultyCalibration", "medium", "difficulty_cognitive_mismatch", "Difficulty band may not match cognitive level or pathway.");
    return 78;
  }
  return 95;
}

function cognitiveScore(level: EditorialCognitiveLevel | "unclassified", issues: EditorialStandardizationIssue[]): number {
  if (level === "unclassified") {
    addIssue(issues, "cognitiveClassification", "high", "missing_cognitive_level", "Cognitive level is missing or unsupported.");
    return 45;
  }
  return 100;
}

function flashcardScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  let score = 100;
  if (!row.isFlashcardSource) {
    score -= 26;
    addIssue(issues, "flashcardConsistency", "medium", "not_flashcard_source", "Question is not marked as a flashcard source.");
  }
  if (wordCount(row.clinicalPearl) < 8) score -= 22;
  if (wordCount(row.memoryHook || row.mnemonic) < 4) score -= 22;
  if (!plain(row.examStrategy)) score -= 14;
  return clamp(score);
}

function dailyQuestionScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  let score = 100;
  if (wordCount(row.stem) < 12 || wordCount(row.stem) > 180) score -= 20;
  if (!plain(row.clinicalPearl)) score -= 20;
  if (!plain(row.examStrategy)) score -= 16;
  if (REGION_LOCK_RE.test(plain(row.stem)) && !row.countryCode) {
    score -= 12;
    addIssue(issues, "dailyQuestionReadiness", "low", "region_context_needed", "Region-specific wording should include region metadata before distribution.");
  }
  return clamp(score);
}

function adaptiveScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  let score = 100;
  if (row.isAdaptiveEligible === false) {
    addIssue(issues, "adaptiveLearningReadiness", "high", "adaptive_ineligible", "Question is not adaptive eligible.");
    return 40;
  }
  if (!row.nclexClientNeedsCategory && !row.blueprintWeight) score -= 25;
  if (!row.topic || !row.subtopic) score -= 18;
  if (!row.difficulty) score -= 18;
  return clamp(score);
}

function ngnScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const type = plain(row.questionType).toLowerCase();
  const isNgn = /bowtie|matrix|case|trend|delegation|documentation|prioritization|sata|select_all|ordered|highlight|chart/.test(type);
  if (!isNgn) return 100;
  let score = 100;
  if (!/\b(cue|trend|priority|monitor|action|assessment|documentation|delegate)\b/i.test(combinedRationale(row))) {
    score -= 24;
    addIssue(issues, "ngnConsistency", "high", "missing_ngn_reasoning_language", "NGN rationale should explicitly teach cue/action/monitoring or workflow reasoning.");
  }
  if (!row.clinicalReasoning) score -= 20;
  if (!row.isAdaptiveEligible) score -= 16;
  return clamp(score);
}

function translationScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const combined = [row.stem, row.rationale, row.examStrategy, row.clinicalPearl, row.memoryHook, row.mnemonic].map(plain).join(" ");
  let score = 100;
  if (IDIOM_RE.test(combined)) {
    score -= 24;
    addIssue(issues, "translationReadiness", "medium", "idiom_translation_risk", "Question contains idiomatic wording that may not translate cleanly.");
  }
  if (/\b(they're|can't|won't|don't|isn't|shouldn't)\b/i.test(combined)) score -= 8;
  if (REGION_LOCK_RE.test(combined) && !row.countryCode) score -= 14;
  return clamp(score);
}

function styleScore(row: QuestionEnrichmentAuditRow, issues: EditorialStandardizationIssue[]): number {
  const combined = [row.stem, row.rationale, row.examStrategy, row.clinicalPearl, row.memoryHook].map(plain).join(" ");
  let score = 100;
  if (AI_CLICHE_RE.test(combined)) {
    score -= 25;
    addIssue(issues, "editorialStyle", "high", "ai_cliche_language", "AI-like or promotional phrasing detected.");
  }
  if (OVERLY_ACADEMIC_RE.test(combined)) {
    score -= 14;
    addIssue(issues, "editorialStyle", "medium", "overly_academic_language", "Question uses avoidable academic wording.");
  }
  if (GENERIC_ADVICE_RE.test(combined)) score -= 12;
  return clamp(score);
}

export function auditQuestionEditorialStandardization(row: QuestionEnrichmentAuditRow): EditorialStandardizationResult {
  const issues: EditorialStandardizationIssue[] = [];
  const cognitiveLevel = normalizeCognitiveLevel(row.cognitiveLevel);
  const difficultyBand = normalizeDifficulty(row);
  const dimensions = {
    rationaleConsistency: rationaleScore(row, issues),
    distractorConsistency: distractorScore(row, issues),
    hintConsistency: hintScore(row, issues),
    clinicalPearlConsistency: pearlScore(row, issues),
    memoryAnchorConsistency: memoryAnchorScore(row, issues),
    difficultyCalibration: difficultyScore(row, cognitiveLevel, issues),
    cognitiveClassification: cognitiveScore(cognitiveLevel, issues),
    flashcardConsistency: flashcardScore(row, issues),
    dailyQuestionReadiness: dailyQuestionScore(row, issues),
    adaptiveLearningReadiness: adaptiveScore(row, issues),
    ngnConsistency: ngnScore(row, issues),
    translationReadiness: translationScore(row, issues),
    editorialStyle: styleScore(row, issues),
  } satisfies Record<EditorialStandardizationDimension, number>;

  const score = clamp(
    dimensions.rationaleConsistency * 0.15 +
      dimensions.distractorConsistency * 0.12 +
      dimensions.hintConsistency * 0.1 +
      dimensions.clinicalPearlConsistency * 0.1 +
      dimensions.memoryAnchorConsistency * 0.07 +
      dimensions.difficultyCalibration * 0.07 +
      dimensions.cognitiveClassification * 0.07 +
      dimensions.flashcardConsistency * 0.07 +
      dimensions.dailyQuestionReadiness * 0.05 +
      dimensions.adaptiveLearningReadiness * 0.08 +
      dimensions.ngnConsistency * 0.05 +
      dimensions.translationReadiness * 0.04 +
      dimensions.editorialStyle * 0.03,
  );

  return {
    id: row.id,
    pathwayGroup: pathwayGroupFor(row),
    exam: plain(row.exam) || "UNKNOWN",
    score,
    standardized:
      score >= 90 &&
      Object.values(dimensions).every((dimensionScore) => dimensionScore >= 90) &&
      issues.every((issue) => issue.severity !== "critical" && issue.severity !== "high"),
    dimensions,
    difficultyBand,
    cognitiveLevel,
    issues,
  };
}

function average(values: number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function summarizeEditorialStandardization(
  results: readonly EditorialStandardizationResult[],
): EditorialStandardizationSummary {
  const byPathwayGroup = {
    RN: { total: 0, standardized: 0, averageScore: 0 },
    RPN_PN: { total: 0, standardized: 0, averageScore: 0 },
    NP: { total: 0, standardized: 0, averageScore: 0 },
  } satisfies EditorialStandardizationSummary["byPathwayGroup"];

  for (const group of Object.keys(byPathwayGroup) as QuestionEnrichmentPathwayGroup[]) {
    const rows = results.filter((result) => result.pathwayGroup === group);
    byPathwayGroup[group] = {
      total: rows.length,
      standardized: rows.filter((result) => result.standardized).length,
      averageScore: average(rows.map((result) => result.score)),
    };
  }

  const byDimension = Object.fromEntries(
    DIMENSIONS.map((dimension) => [
      dimension,
      average(results.map((result) => result.dimensions[dimension])),
    ]),
  ) as Record<EditorialStandardizationDimension, number>;

  return {
    totalQuestionsAudited: results.length,
    ecosystemQualityScore: average(results.map((result) => result.score)),
    standardizedQuestions: results.filter((result) => result.standardized).length,
    byPathwayGroup,
    byDimension,
  };
}
