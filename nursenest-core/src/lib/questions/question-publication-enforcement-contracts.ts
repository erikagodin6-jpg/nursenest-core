import { auditQuestionEditorialStandardization } from "@/lib/questions/question-editorial-standardization";
import {
  auditQuestionEnrichment,
  type QuestionEnrichmentAuditRow,
} from "@/lib/questions/question-enrichment-governance";

export type QuestionGovernanceStatus =
  | "PUBLICATION_ELIGIBLE"
  | "BLOCKED_FROM_PUBLICATION"
  | "RATIONALE_REWRITE_REQUIRED"
  | "HINT_REWRITE_REQUIRED"
  | "PEARL_REWRITE_REQUIRED"
  | "FLASHCARD_REWRITE_REQUIRED"
  | "DUPLICATE_REVIEW_REQUIRED"
  | "TRANSLATION_REWRITE_REQUIRED"
  | "NOT_CAT_ELIGIBLE"
  | "NOT_PRACTICE_EXAM_ELIGIBLE"
  | "NOT_ADAPTIVE_READY";

export type QuestionSimilaritySignals = {
  questionSimilarity?: number | null;
  rationaleSimilarity?: number | null;
  clinicalPearlSimilarity?: number | null;
  flashcardSimilarity?: number | null;
};

export type QuestionGovernanceScores = {
  clinicalAccuracy: number;
  educationalValue: number;
  examRealism: number;
  flashcardValue: number;
  practiceExamValue: number;
  catValue: number;
  adaptiveValue: number;
  translationReadiness: number;
  publicationReadiness: number;
  overallEcosystemScore: number;
};

export type QuestionGovernanceEnforcementResult = {
  id: string;
  statuses: QuestionGovernanceStatus[];
  publicationEligible: boolean;
  flashcardReady: boolean;
  practiceExamEligible: boolean;
  catEligible: boolean;
  adaptiveReady: boolean;
  translationReady: boolean;
  scores: QuestionGovernanceScores;
  blockers: string[];
};

export const QUESTION_ENFORCEMENT_SCORE_THRESHOLDS = {
  clinicalAccuracy: 95,
  educationalValue: 90,
  examRealism: 90,
  publicationReadiness: 90,
  overallEcosystemScore: 90,
} as const;

export const QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS = {
  questionSimilarity: 0.85,
  rationaleSimilarity: 0.9,
  clinicalPearlSimilarity: 0.9,
  flashcardSimilarity: 0.9,
} as const;

const DIRECT_ANSWER_HINT_RE = /\b(answer is|correct answer|option\s+[a-f]|choose\s+[a-f]|eliminate|not option)\b/i;
const GENERIC_PEARL_RE = /\b(think critically|safe care|remember this|review the material|study this topic|use nursing process)\b/i;
const RESTATES_ANSWER_RE = /\b(is correct because|correct because it is correct|the answer is correct|this is the correct answer)\b/i;
const IDIOM_OR_SLANG_RE =
  /\b(rule of thumb|red herring|slam dunk|curveball|low-hanging fruit|bread and butter|back to square one|on the fly|watch out for)\b/i;

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

function hintText(row: QuestionEnrichmentAuditRow): string {
  const tagHint = (row.tags ?? []).find((tag) => /^hint:/i.test(tag));
  if (tagHint) return tagHint.replace(/^hint:/i, "").trim();
  const strategy = plain(row.examStrategy);
  return /\bhint\s*:/i.test(strategy) ? strategy.replace(/^.*?\bhint\s*:/i, "").trim() : "";
}

function rationaleText(row: QuestionEnrichmentAuditRow): string {
  return [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning].map(plain).filter(Boolean).join(" ");
}

function flashcardAnswerText(row: QuestionEnrichmentAuditRow): string {
  return [row.correctAnswer, row.clinicalPearl, row.memoryHook, row.mnemonic].flatMap(textList).join(" ");
}

function addStatus(statuses: Set<QuestionGovernanceStatus>, blockers: string[], status: QuestionGovernanceStatus, blocker: string): void {
  statuses.add(status);
  blockers.push(blocker);
}

function hasDuplicateSignal(similarity: QuestionSimilaritySignals): boolean {
  return (
    Number(similarity.questionSimilarity ?? 0) > QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS.questionSimilarity ||
    Number(similarity.rationaleSimilarity ?? 0) > QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS.rationaleSimilarity ||
    Number(similarity.clinicalPearlSimilarity ?? 0) > QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS.clinicalPearlSimilarity ||
    Number(similarity.flashcardSimilarity ?? 0) > QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS.flashcardSimilarity
  );
}

export function enforceQuestionPublicationGovernance(
  row: QuestionEnrichmentAuditRow,
  similarity: QuestionSimilaritySignals = {},
): QuestionGovernanceEnforcementResult {
  const enrichment = auditQuestionEnrichment(row);
  const editorial = auditQuestionEditorialStandardization(row);
  const statuses = new Set<QuestionGovernanceStatus>();
  const blockers: string[] = [];

  if (enrichment.missingFields.length > 0) {
    addStatus(
      statuses,
      blockers,
      "BLOCKED_FROM_PUBLICATION",
      `Missing required fields: ${enrichment.missingFields.join(", ")}.`,
    );
  }

  const rationale = rationaleText(row);
  if (
    wordCount(rationale) < 75 ||
    RESTATES_ANSWER_RE.test(rationale) ||
    !/\b(because|therefore|indicates|suggests|priority|risk|mechanism|pathophysiology|reassess|escalat)\b/i.test(rationale) ||
    !/\b(safety|harm|risk|unstable|deteriorat|urgent|priority|complication)\b/i.test(rationale)
  ) {
    addStatus(statuses, blockers, "RATIONALE_REWRITE_REQUIRED", "Rationale fails length, reasoning, safety, or teaching requirements.");
  }

  const hint = hintText(row);
  const answerTerms = textList(row.correctAnswer).filter((term) => term.length >= 5);
  if (
    !hint ||
    DIRECT_ANSWER_HINT_RE.test(hint) ||
    answerTerms.some((term) => hint.toLowerCase().includes(term.toLowerCase()))
  ) {
    addStatus(statuses, blockers, "HINT_REWRITE_REQUIRED", "Hint is missing or reveals answer terminology/options.");
  }

  const pearl = plain(row.clinicalPearl);
  if (
    wordCount(pearl) < 8 ||
    GENERIC_PEARL_RE.test(pearl) ||
    (pearl && rationale.toLowerCase().includes(pearl.toLowerCase()))
  ) {
    addStatus(statuses, blockers, "PEARL_REWRITE_REQUIRED", "Clinical pearl is generic, repeated, non-actionable, or missing.");
  }

  const flashcardText = flashcardAnswerText(row);
  if (
    !row.isFlashcardSource ||
    wordCount(flashcardText) < 10 ||
    !/\b(patient|client|clinical|safety|priority|risk|assessment|monitor|exam|cue|pattern)\b/i.test(flashcardText)
  ) {
    addStatus(statuses, blockers, "FLASHCARD_REWRITE_REQUIRED", "Flashcard output is missing, definition-only, duplicate-prone, or lacks clinical application.");
  }

  if (hasDuplicateSignal(similarity)) {
    addStatus(statuses, blockers, "DUPLICATE_REVIEW_REQUIRED", "Similarity thresholds exceeded for question, rationale, pearl, or flashcard content.");
  }

  const translationText = [row.stem, row.rationale, row.examStrategy, row.clinicalPearl, row.memoryHook, row.mnemonic].map(plain).join(" ");
  if (IDIOM_OR_SLANG_RE.test(translationText) || editorial.dimensions.translationReadiness < 90) {
    addStatus(statuses, blockers, "TRANSLATION_REWRITE_REQUIRED", "Translation readiness failed due to idiom, slang, ambiguity, or locale-sensitive wording.");
  }

  if (
    !row.difficulty ||
    !row.nclexClientNeedsCategory && !row.blueprintWeight ||
    enrichment.scores.distractorQuality < 65 ||
    !row.subtopic ||
    editorial.dimensions.adaptiveLearningReadiness < 90
  ) {
    addStatus(statuses, blockers, "NOT_CAT_ELIGIBLE", "CAT eligibility failed due to missing difficulty, blueprint, distractor strength, discrimination, or remediation mapping.");
  }

  if (!enrichment.practiceExamReady) {
    addStatus(statuses, blockers, "NOT_PRACTICE_EXAM_ELIGIBLE", "Practice exam eligibility failed due to missing rationale, hint, pearl, or flashcard output.");
  }

  if (!enrichment.adaptiveLearningReady || !row.topic || !row.subtopic) {
    addStatus(statuses, blockers, "NOT_ADAPTIVE_READY", "Adaptive eligibility failed due to missing weak-area, related-topic, or remediation mapping.");
  }

  const scores: QuestionGovernanceScores = {
    clinicalAccuracy: enrichment.scores.clinicalAccuracy,
    educationalValue: enrichment.scores.educationalQuality,
    examRealism: enrichment.scores.examRealism,
    flashcardValue: enrichment.scores.flashcardReusability,
    practiceExamValue: enrichment.scores.practiceExamReadiness,
    catValue: enrichment.scores.catReadiness,
    adaptiveValue: enrichment.scores.adaptiveValue,
    translationReadiness: editorial.dimensions.translationReadiness,
    publicationReadiness: enrichment.scores.publicationReadiness,
    overallEcosystemScore: clamp((enrichment.scores.overallQuality * 0.7) + (editorial.score * 0.3)),
  };

  const clinicalAccuracyPass =
    scores.clinicalAccuracy >= QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.clinicalAccuracy ||
    (scores.clinicalAccuracy >= 88 &&
      /\b(oxygen|airway|breathing|circulation|safety|risk|deteriorat|priority|reassess|escalat|hypox|bleeding|shock|sepsis)\b/i.test(
        [row.stem, row.rationale, row.clinicalReasoning, row.clinicalPearl].map(plain).join(" "),
      ));

  if (!clinicalAccuracyPass) {
    blockers.push(`Clinical accuracy score below ${QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.clinicalAccuracy}.`);
    statuses.add("BLOCKED_FROM_PUBLICATION");
  }
  if (scores.educationalValue < QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.educationalValue) {
    blockers.push(`Educational value score below ${QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.educationalValue}.`);
    statuses.add("BLOCKED_FROM_PUBLICATION");
  }
  if (scores.examRealism < QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.examRealism) {
    blockers.push(`Exam realism score below ${QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.examRealism}.`);
    statuses.add("BLOCKED_FROM_PUBLICATION");
  }
  if (scores.publicationReadiness < QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.publicationReadiness) {
    blockers.push(`Publication readiness score below ${QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.publicationReadiness}.`);
    statuses.add("BLOCKED_FROM_PUBLICATION");
  }
  if (scores.overallEcosystemScore < QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.overallEcosystemScore) {
    blockers.push(`Overall ecosystem score below ${QUESTION_ENFORCEMENT_SCORE_THRESHOLDS.overallEcosystemScore}.`);
    statuses.add("BLOCKED_FROM_PUBLICATION");
  }

  const blockingStatuses = [...statuses].filter((status) => status !== "NOT_CAT_ELIGIBLE" && status !== "NOT_PRACTICE_EXAM_ELIGIBLE" && status !== "NOT_ADAPTIVE_READY");
  const publicationEligible = blockingStatuses.length === 0;
  if (publicationEligible) statuses.add("PUBLICATION_ELIGIBLE");

  return {
    id: row.id,
    statuses: [...statuses],
    publicationEligible,
    flashcardReady: !statuses.has("FLASHCARD_REWRITE_REQUIRED"),
    practiceExamEligible: !statuses.has("NOT_PRACTICE_EXAM_ELIGIBLE"),
    catEligible: !statuses.has("NOT_CAT_ELIGIBLE"),
    adaptiveReady: !statuses.has("NOT_ADAPTIVE_READY"),
    translationReady: !statuses.has("TRANSLATION_REWRITE_REQUIRED"),
    scores,
    blockers,
  };
}
