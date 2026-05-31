import { GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE } from "@/lib/content-quality/global-content-quality-governance";
import {
  scoreDistractorSetQuality,
  type DistractorQualityInput,
} from "@/lib/questions/distractor-quality-score";
import {
  scoreQuestionQuality,
  type QuestionQualityInput,
} from "@/lib/questions/question-quality-score";
import {
  scoreRationaleQuality,
} from "@/lib/questions/rationale-quality-score";

export type QuestionEnrichmentPathwayGroup = "RN" | "RPN_PN" | "NP";

export const RN_QUESTION_ENRICHMENT_EXAMS = ["NCLEX-RN", "NCLEX_RN", "US_NCLEX_RN", "CA_NCLEX_RN"] as const;
export const RPN_PN_QUESTION_ENRICHMENT_EXAMS = ["REx-PN", "REX_PN", "NCLEX-PN", "NCLEX_PN"] as const;
export const NP_QUESTION_ENRICHMENT_EXAMS = [
  "CNPLE",
  "FNP",
  "AGPCNP",
  "PMHNP",
  "PNP-PC",
  "PNP_PC",
  "WHNP",
  "ENP",
] as const;

export const QUESTION_ENRICHMENT_TARGET_EXAMS = [
  ...RN_QUESTION_ENRICHMENT_EXAMS,
  ...RPN_PN_QUESTION_ENRICHMENT_EXAMS,
  ...NP_QUESTION_ENRICHMENT_EXAMS,
] as const;

export type QuestionEnrichmentMissingField =
  | "correct_answer"
  | "correct_rationale"
  | "distractor_rationales"
  | "hint"
  | "clinical_pearl"
  | "exam_trap"
  | "memory_anchor"
  | "flashcard_output"
  | "metadata"
  | "blueprint_mapping"
  | "difficulty_rating"
  | "cognitive_classification";

export type QuestionEnrichmentAuditRow = {
  id: string;
  exam?: string | null;
  tier?: string | null;
  countryCode?: string | null;
  languageCode?: string | null;
  status?: string | null;
  questionType?: string | null;
  stem?: string | null;
  options?: unknown;
  correctAnswer?: unknown;
  rationale?: string | null;
  correctAnswerExplanation?: string | null;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
  clinicalReasoning?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  clinicalTrap?: string | null;
  memoryHook?: string | null;
  mnemonic?: string | null;
  keyTakeaway?: string | null;
  difficulty?: number | string | null;
  cognitiveLevel?: string | null;
  bodySystem?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  nclexClientNeedsCategory?: string | null;
  nclexClientNeedsSubcategory?: string | null;
  tags?: readonly string[] | null;
  isMockExamEligible?: boolean | null;
  isAdaptiveEligible?: boolean | null;
  isFlashcardSource?: boolean | null;
  blueprintWeight?: number | null;
};

export type QuestionEnrichmentScores = {
  clinicalAccuracy: number;
  educationalQuality: number;
  examRealism: number;
  adaptiveValue: number;
  publicationReadiness: number;
  overallQuality: number;
  rationaleQuality: number;
  distractorQuality: number;
  flashcardReusability: number;
  practiceExamReadiness: number;
  catReadiness: number;
};

export type QuestionEnrichmentRemediationDraft = {
  flashcardFront?: string;
  flashcardBack?: string;
  clinicalPearl?: string;
  memoryAnchor?: string;
  examRelevance?: string;
  authoringTasks: string[];
  publishable: false;
};

export type QuestionEnrichmentAuditResult = {
  id: string;
  pathwayGroup: QuestionEnrichmentPathwayGroup;
  exam: string;
  missingFields: QuestionEnrichmentMissingField[];
  scores: QuestionEnrichmentScores;
  qualityBand: "excellent" | "needs_improvement" | "major_revision";
  publicationReady: boolean;
  flashcardReady: boolean;
  practiceExamReady: boolean;
  catReady: boolean;
  adaptiveLearningReady: boolean;
  monetizationReady: boolean;
  remediationDraft: QuestionEnrichmentRemediationDraft;
  issues: string[];
};

export type QuestionEnrichmentSummary = {
  totalQuestionsAudited: number;
  questionsMissingRationales: number;
  questionsMissingHints: number;
  questionsMissingClinicalPearls: number;
  questionsMissingMetadata: number;
  questionsMissingFlashcardOutputs: number;
  questionsMissingDifficultyRatings: number;
  questionsMissingBlueprintMapping: number;
  questionsRequiringMajorRevision: number;
  byPathwayGroup: Record<QuestionEnrichmentPathwayGroup, { total: number; publicationReady: number; averageScore: number }>;
};

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

function optionTexts(options: unknown): string[] {
  const values = textList(options);
  return values.filter((value) => value.length > 0);
}

function correctAnswerText(correctAnswer: unknown): string {
  return textList(correctAnswer).join("; ");
}

function pathwayGroupFor(row: Pick<QuestionEnrichmentAuditRow, "exam" | "tier">): QuestionEnrichmentPathwayGroup {
  const text = `${row.exam ?? ""} ${row.tier ?? ""}`.toUpperCase();
  if (/\b(CNPLE|FNP|AGPCNP|PMHNP|PNP|WHNP|ENP|NP)\b/.test(text)) return "NP";
  if (/\b(REX[-_ ]?PN|NCLEX[-_ ]?PN|RPN|LPN|PN)\b/.test(text)) return "RPN_PN";
  return "RN";
}

function hasHint(row: QuestionEnrichmentAuditRow): boolean {
  const tags = row.tags ?? [];
  const hintTag = tags.find((tag) => /^hint:/i.test(tag));
  return Boolean(hintTag) || /\bhint\s*:/i.test([row.examStrategy, row.keyTakeaway].map(plain).join(" "));
}

function hasExamTrap(row: QuestionEnrichmentAuditRow): boolean {
  return wordCount(row.clinicalTrap) >= 8 || /\btrap|mistake|avoid|miss|tempt/i.test(plain(row.examStrategy));
}

function hasMemoryAnchor(row: QuestionEnrichmentAuditRow): boolean {
  return wordCount(row.memoryHook) >= 4 || wordCount(row.mnemonic) >= 4;
}

function hasMetadata(row: QuestionEnrichmentAuditRow): boolean {
  return Boolean(row.exam && row.bodySystem && row.topic && row.questionType);
}

function hasBlueprintMapping(row: QuestionEnrichmentAuditRow): boolean {
  return Boolean(row.nclexClientNeedsCategory || row.blueprintWeight || row.tags?.some((tag) => /blueprint:/i.test(tag)));
}

function hasFlashcardOutput(row: QuestionEnrichmentAuditRow): boolean {
  return Boolean(row.isFlashcardSource) && wordCount(row.clinicalPearl) >= 8 && hasMemoryAnchor(row);
}

function rationaleText(row: QuestionEnrichmentAuditRow): string {
  return [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning].map(plain).filter(Boolean).join(" ");
}

function incorrectRationales(row: QuestionEnrichmentAuditRow): string[] {
  return [...textList(row.distractorRationales), ...textList(row.incorrectAnswerRationale)].filter(Boolean);
}

function missingFields(row: QuestionEnrichmentAuditRow): QuestionEnrichmentMissingField[] {
  const missing: QuestionEnrichmentMissingField[] = [];
  const rationaleWords = wordCount(rationaleText(row));
  const distractors = incorrectRationales(row);

  if (!correctAnswerText(row.correctAnswer)) missing.push("correct_answer");
  if (rationaleWords < 75) missing.push("correct_rationale");
  if (distractors.length === 0 || distractors.some((item) => wordCount(item) < 25)) missing.push("distractor_rationales");
  if (!hasHint(row)) missing.push("hint");
  if (wordCount(row.clinicalPearl) < 8) missing.push("clinical_pearl");
  if (!hasExamTrap(row)) missing.push("exam_trap");
  if (!hasMemoryAnchor(row)) missing.push("memory_anchor");
  if (!hasFlashcardOutput(row)) missing.push("flashcard_output");
  if (!hasMetadata(row)) missing.push("metadata");
  if (!hasBlueprintMapping(row)) missing.push("blueprint_mapping");
  if (row.difficulty == null || plain(row.difficulty).length === 0) missing.push("difficulty_rating");
  if (!row.cognitiveLevel) missing.push("cognitive_classification");
  return missing;
}

function qualityInput(row: QuestionEnrichmentAuditRow): QuestionQualityInput {
  return {
    id: row.id,
    stem: row.stem,
    options: optionTexts(row.options),
    correctAnswer: correctAnswerText(row.correctAnswer),
    rationale: row.rationale,
    whyCorrect: row.correctAnswerExplanation,
    whyIncorrect: incorrectRationales(row),
    clinicalReasoning: row.clinicalReasoning,
    patientSafetyImplications: [row.clinicalTrap, row.clinicalPearl].map(plain).filter(Boolean).join(" "),
    examStrategy: row.examStrategy,
    clinicalApplication: row.keyTakeaway,
    clinicalPearl: row.clinicalPearl,
    hint: hasHint(row) ? row.tags?.find((tag) => /^hint:/i.test(tag))?.replace(/^hint:/i, "") ?? row.examStrategy : "",
    relatedTopics: [row.topic, row.subtopic, row.bodySystem].map(plain).filter(Boolean),
    topic: row.topic,
    pathway: row.exam,
    profession: row.tier,
    questionType: row.questionType,
  };
}

function scoreDistractors(row: QuestionEnrichmentAuditRow): number {
  const distractors = incorrectRationales(row);
  const options = optionTexts(row.options);
  const correct = correctAnswerText(row.correctAnswer);
  const distractorInputs: DistractorQualityInput[] = (distractors.length ? distractors : options.filter((option) => option !== correct)).map((distractor, index) => ({
    id: `${row.id}:d${index + 1}`,
    distractor,
    stem: row.stem,
    correctAnswer: correct,
    rationale: distractors[index] ?? "",
    whyTempting: distractors[index] ?? "",
    whyIncorrect: distractors[index] ?? "",
    riskIntroduced: row.clinicalTrap,
    pathway: row.exam,
    questionType: row.questionType,
  }));
  if (distractorInputs.length === 0) return 0;
  return scoreDistractorSetQuality({ id: row.id, stem: row.stem, correctAnswer: correct, distractors: distractorInputs }).score;
}

function scoreEnrichment(row: QuestionEnrichmentAuditRow, missing: QuestionEnrichmentMissingField[]): QuestionEnrichmentScores {
  const questionQuality = scoreQuestionQuality(qualityInput(row));
  const rationaleQuality = scoreRationaleQuality({
    id: row.id,
    pathway: row.exam,
    topic: row.topic,
    stem: row.stem,
    correctAnswer: row.correctAnswer,
    rationale: rationaleText(row),
    optionRationales: incorrectRationales(row),
    clinicalPearl: row.clinicalPearl,
    examStrategy: row.examStrategy,
    relatedContent: [row.topic, row.subtopic, row.bodySystem].filter(Boolean),
  });
  const distractorQuality = scoreDistractors(row);

  const metadataCompleteness = 100 - missing.filter((field) => ["metadata", "blueprint_mapping", "difficulty_rating", "cognitive_classification"].includes(field)).length * 22;
  const flashcardReusability = 100 - missing.filter((field) => ["clinical_pearl", "memory_anchor", "flashcard_output"].includes(field)).length * 28;
  const practiceExamReadiness = row.isMockExamEligible === false ? 45 : 100 - missing.filter((field) => ["correct_rationale", "distractor_rationales", "hint", "clinical_pearl"].includes(field)).length * 18;
  const catReadiness = row.isAdaptiveEligible === false ? 35 : 100 - missing.filter((field) => ["blueprint_mapping", "difficulty_rating", "cognitive_classification"].includes(field)).length * 24;
  const adaptiveValue = 100 - missing.filter((field) => ["blueprint_mapping", "metadata", "flashcard_output"].includes(field)).length * 22;

  const scores = {
    clinicalAccuracy: questionQuality.dimensions.clinicalAccuracy,
    educationalQuality: Math.round((questionQuality.dimensions.educationalValue + questionQuality.dimensions.reasoningQuality) / 2),
    examRealism: questionQuality.dimensions.examRelevance,
    adaptiveValue: clamp(adaptiveValue),
    publicationReadiness: questionQuality.score,
    overallQuality: 0,
    rationaleQuality: rationaleQuality.score,
    distractorQuality,
    flashcardReusability: clamp(flashcardReusability),
    practiceExamReadiness: clamp(practiceExamReadiness),
    catReadiness: clamp(catReadiness),
  };
  scores.overallQuality = clamp(
    scores.clinicalAccuracy * 0.18 +
      scores.educationalQuality * 0.16 +
      scores.examRealism * 0.12 +
      scores.rationaleQuality * 0.16 +
      scores.distractorQuality * 0.12 +
      scores.flashcardReusability * 0.08 +
      scores.practiceExamReadiness * 0.08 +
      scores.catReadiness * 0.06 +
      scores.adaptiveValue * 0.04,
  );
  return scores;
}

function qualityBand(overallQuality: number): QuestionEnrichmentAuditResult["qualityBand"] {
  if (overallQuality >= GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE) return "excellent";
  if (overallQuality >= 80) return "needs_improvement";
  return "major_revision";
}

function remediationDraft(row: QuestionEnrichmentAuditRow, missing: QuestionEnrichmentMissingField[]): QuestionEnrichmentRemediationDraft {
  const front = plain(row.stem);
  const answer = correctAnswerText(row.correctAnswer);
  const pearl = plain(row.clinicalPearl);
  const memory = plain(row.memoryHook || row.mnemonic);
  const examRelevance = [row.exam, row.nclexClientNeedsCategory, row.topic].map(plain).filter(Boolean).join(" / ");

  return {
    flashcardFront: front ? `What is the key nursing judgment in this scenario? ${front}` : undefined,
    flashcardBack: answer ? `Answer: ${answer}${pearl ? `\nClinical pearl: ${pearl}` : ""}` : undefined,
    clinicalPearl: pearl || undefined,
    memoryAnchor: memory || undefined,
    examRelevance: examRelevance || undefined,
    authoringTasks: missing.map((field) => `Author and clinically review missing ${field.replace(/_/g, " ")}.`),
    publishable: false,
  };
}

export function auditQuestionEnrichment(row: QuestionEnrichmentAuditRow): QuestionEnrichmentAuditResult {
  const missing = missingFields(row);
  const scores = scoreEnrichment(row, missing);
  const band = qualityBand(scores.overallQuality);
  const publicationReady = missing.length === 0 && scores.overallQuality >= GLOBAL_CONTENT_QUALITY_MINIMUM_SCORE;
  const flashcardReady = !missing.some((field) => ["flashcard_output", "clinical_pearl", "memory_anchor"].includes(field));
  const practiceExamReady = !missing.some((field) => ["correct_rationale", "distractor_rationales", "hint", "clinical_pearl"].includes(field)) && scores.practiceExamReadiness >= 90;
  const catReady = !missing.some((field) => ["blueprint_mapping", "difficulty_rating", "cognitive_classification"].includes(field)) && scores.catReadiness >= 90;
  const adaptiveLearningReady = catReady && flashcardReady && scores.adaptiveValue >= 90;

  return {
    id: row.id,
    pathwayGroup: pathwayGroupFor(row),
    exam: plain(row.exam) || "UNKNOWN",
    missingFields: missing,
    scores,
    qualityBand: band,
    publicationReady,
    flashcardReady,
    practiceExamReady,
    catReady,
    adaptiveLearningReady,
    monetizationReady: publicationReady && practiceExamReady && adaptiveLearningReady,
    remediationDraft: remediationDraft(row, missing),
    issues: missing.map((field) => `Missing or incomplete ${field.replace(/_/g, " ")}.`),
  };
}

function average(values: number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function summarizeQuestionEnrichment(results: readonly QuestionEnrichmentAuditResult[]): QuestionEnrichmentSummary {
  const byPathwayGroup = {
    RN: { total: 0, publicationReady: 0, averageScore: 0 },
    RPN_PN: { total: 0, publicationReady: 0, averageScore: 0 },
    NP: { total: 0, publicationReady: 0, averageScore: 0 },
  } satisfies QuestionEnrichmentSummary["byPathwayGroup"];

  for (const group of Object.keys(byPathwayGroup) as QuestionEnrichmentPathwayGroup[]) {
    const rows = results.filter((result) => result.pathwayGroup === group);
    byPathwayGroup[group] = {
      total: rows.length,
      publicationReady: rows.filter((result) => result.publicationReady).length,
      averageScore: average(rows.map((result) => result.scores.overallQuality)),
    };
  }

  return {
    totalQuestionsAudited: results.length,
    questionsMissingRationales: results.filter((result) => result.missingFields.includes("correct_rationale")).length,
    questionsMissingHints: results.filter((result) => result.missingFields.includes("hint")).length,
    questionsMissingClinicalPearls: results.filter((result) => result.missingFields.includes("clinical_pearl")).length,
    questionsMissingMetadata: results.filter((result) => result.missingFields.includes("metadata")).length,
    questionsMissingFlashcardOutputs: results.filter((result) => result.missingFields.includes("flashcard_output")).length,
    questionsMissingDifficultyRatings: results.filter((result) => result.missingFields.includes("difficulty_rating")).length,
    questionsMissingBlueprintMapping: results.filter((result) => result.missingFields.includes("blueprint_mapping")).length,
    questionsRequiringMajorRevision: results.filter((result) => result.qualityBand === "major_revision").length,
    byPathwayGroup,
  };
}
