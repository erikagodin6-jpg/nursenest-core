import {
  auditQuestionEnrichment,
  type QuestionEnrichmentAuditResult,
  type QuestionEnrichmentAuditRow,
  type QuestionEnrichmentPathwayGroup,
} from "@/lib/questions/question-enrichment-governance";

export type FlashcardGenerationStatus =
  | "GENERATED_FROM_VALIDATED_CONTENT"
  | "BLOCKED_SOURCE_NOT_VALIDATED"
  | "FLASHCARD_REWRITE_REQUIRED"
  | "DUPLICATE_REVIEW_REQUIRED";

export type TranslationReadiness = {
  readonly ready: boolean;
  readonly blockers: readonly string[];
};

export type StandardizedQuestionFlashcard = {
  readonly id: string;
  readonly sourceQuestionId: string;
  readonly front: string;
  readonly back: string;
  readonly clinicalPearl: string;
  readonly memoryAnchor: string;
  readonly examRelevance: string;
  readonly commonMistake: string;
  readonly roleScope: QuestionEnrichmentPathwayGroup;
  readonly examMapping: string;
  readonly countryMapping: string;
  readonly translationReadiness: TranslationReadiness;
  readonly contentKey: string;
};

export type FlashcardRegenerationResult = {
  readonly questionId: string;
  readonly pathwayGroup: QuestionEnrichmentPathwayGroup;
  readonly status: FlashcardGenerationStatus;
  readonly flashcard?: StandardizedQuestionFlashcard;
  readonly sourceValidation: {
    readonly publicationReady: boolean;
    readonly flashcardReady: boolean;
    readonly practiceExamReady: boolean;
    readonly catReady: boolean;
    readonly adaptiveLearningReady: boolean;
    readonly monetizationReady: boolean;
  };
  readonly issues: readonly string[];
};

export type FlashcardDuplicateFinding = {
  readonly primaryQuestionId: string;
  readonly duplicateQuestionId: string;
  readonly similarity: number;
  readonly reason: "exact_normalized_match" | "near_duplicate";
};

export type FlashcardReadinessDashboard = {
  readonly totalQuestions: number;
  readonly generatedFlashcards: number;
  readonly blockedSources: number;
  readonly weakFlashcards: number;
  readonly definitionOnlyFlashcards: number;
  readonly missingClinicalApplication: number;
  readonly translationReady: number;
  readonly readinessPercent: number;
  readonly monetizationReadinessPercent: number;
};

export type GlobalFlashcardStandardizationReport = {
  readonly rnFlashcardReadiness: FlashcardReadinessDashboard;
  readonly pnFlashcardReadiness: FlashcardReadinessDashboard;
  readonly npFlashcardReadiness: FlashcardReadinessDashboard;
  readonly duplicateReductionReport: {
    readonly duplicatePairs: number;
    readonly exactDuplicates: number;
    readonly nearDuplicates: number;
    readonly estimatedReductionCount: number;
    readonly estimatedReductionPercent: number;
    readonly findings: readonly FlashcardDuplicateFinding[];
  };
  readonly results: readonly FlashcardRegenerationResult[];
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

function normalize(value: unknown): string {
  return plain(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function correctAnswerText(row: QuestionEnrichmentAuditRow): string {
  return textList(row.correctAnswer).join("; ");
}

function rationaleText(row: QuestionEnrichmentAuditRow): string {
  return [row.rationale, row.correctAnswerExplanation, row.clinicalReasoning].map(plain).filter(Boolean).join(" ");
}

function memoryAnchor(row: QuestionEnrichmentAuditRow): string {
  return plain(row.memoryHook || row.mnemonic);
}

function examMapping(row: QuestionEnrichmentAuditRow): string {
  return [
    row.exam,
    row.nclexClientNeedsCategory,
    row.nclexClientNeedsSubcategory,
    row.bodySystem,
    row.topic,
    row.subtopic,
  ]
    .map(plain)
    .filter(Boolean)
    .join(" / ");
}

function countryMapping(row: QuestionEnrichmentAuditRow): string {
  return plain(row.countryCode) || "GLOBAL";
}

function translationReadinessFor(cardText: string): TranslationReadiness {
  const blockers: string[] = [];
  if (/\bpiece of cake|red herring|slam dunk|no-brainer|zebra\b/i.test(cardText)) {
    blockers.push("idiomatic_language");
  }
  if (/\bER\b|\bA&E\b|\bSTAT\b/.test(cardText)) {
    blockers.push("region_specific_terminology_requires_localization_review");
  }
  if (/[“”‘’]/.test(cardText)) {
    blockers.push("smart_punctuation_normalization_required");
  }
  return { ready: blockers.length === 0, blockers };
}

function commonMistake(row: QuestionEnrichmentAuditRow): string {
  const trap = plain(row.clinicalTrap);
  if (wordCount(trap) >= 4) return trap;
  const strategy = plain(row.examStrategy);
  if (/\btrap|mistake|avoid|tempt|miss/i.test(strategy)) return strategy;
  const topic = plain(row.topic) || "the clinical cue";
  return `Do not stop at recognition; connect ${topic} to the safest action, timing, and scope.`;
}

function buildFlashcard(row: QuestionEnrichmentAuditRow, enrichment: QuestionEnrichmentAuditResult): StandardizedQuestionFlashcard {
  const answer = correctAnswerText(row);
  const rationale = rationaleText(row);
  const pearl = plain(row.clinicalPearl);
  const memory = memoryAnchor(row);
  const mapping = examMapping(row);
  const mistake = commonMistake(row);
  const front = `What is the key clinical judgment for this scenario?\n\n${plain(row.stem)}`;
  const back = [
    `Answer: ${answer}`,
    `Rationale: ${rationale}`,
    `Clinical application: ${plain(row.keyTakeaway) || pearl}`,
  ]
    .filter((part) => plain(part).length > 0)
    .join("\n\n");
  const text = [front, back, pearl, memory, mapping, mistake].join("\n");

  return {
    id: `qflash:${row.id}`,
    sourceQuestionId: row.id,
    front,
    back,
    clinicalPearl: pearl,
    memoryAnchor: memory,
    examRelevance: mapping || plain(row.exam) || "Exam mapped question",
    commonMistake: mistake,
    roleScope: enrichment.pathwayGroup,
    examMapping: mapping || plain(row.exam) || "UNMAPPED_EXAM",
    countryMapping: countryMapping(row),
    translationReadiness: translationReadinessFor(text),
    contentKey: `question_enriched_flashcard:${row.id}`,
  };
}

function isDefinitionOnly(card: StandardizedQuestionFlashcard): boolean {
  const combined = normalize(`${card.front} ${card.back}`);
  return (
    /\bwhat is\b|\bdefine\b|\bdefinition\b/.test(combined) &&
    !/\bscenario|patient|client|safety|priority|risk|assessment|intervention|monitor|escalat|clinical judgment\b/.test(combined)
  );
}

function missingClinicalApplication(card: StandardizedQuestionFlashcard): boolean {
  const combined = normalize(`${card.back} ${card.clinicalPearl} ${card.commonMistake}`);
  return !/\bpatient|client|clinical|safety|priority|risk|assessment|intervention|monitor|escalat|follow up|scope\b/.test(combined);
}

function isWeakFlashcard(card: StandardizedQuestionFlashcard): boolean {
  return (
    wordCount(card.front) < 8 ||
    wordCount(card.back) < 45 ||
    wordCount(card.clinicalPearl) < 8 ||
    wordCount(card.memoryAnchor) < 4 ||
    wordCount(card.commonMistake) < 8 ||
    missingClinicalApplication(card)
  );
}

export function regenerateFlashcardFromEnrichedQuestion(row: QuestionEnrichmentAuditRow): FlashcardRegenerationResult {
  const enrichment = auditQuestionEnrichment(row);
  const sourceValidation = {
    publicationReady: enrichment.publicationReady,
    flashcardReady: enrichment.flashcardReady,
    practiceExamReady: enrichment.practiceExamReady,
    catReady: enrichment.catReady,
    adaptiveLearningReady: enrichment.adaptiveLearningReady,
    monetizationReady: enrichment.monetizationReady,
  };

  if (!enrichment.publicationReady || !enrichment.flashcardReady) {
    return {
      questionId: row.id,
      pathwayGroup: enrichment.pathwayGroup,
      status: "BLOCKED_SOURCE_NOT_VALIDATED",
      sourceValidation,
      issues: [
        ...enrichment.issues,
        "Flashcard was not generated because the source question is not publication-ready and flashcard-ready.",
      ],
    };
  }

  const flashcard = buildFlashcard(row, enrichment);
  const issues: string[] = [];
  if (isWeakFlashcard(flashcard)) issues.push("weak_flashcard");
  if (isDefinitionOnly(flashcard)) issues.push("definition_only_flashcard");
  if (missingClinicalApplication(flashcard)) issues.push("missing_clinical_application");
  if (!flashcard.translationReadiness.ready) issues.push(...flashcard.translationReadiness.blockers);

  return {
    questionId: row.id,
    pathwayGroup: enrichment.pathwayGroup,
    status: issues.length > 0 ? "FLASHCARD_REWRITE_REQUIRED" : "GENERATED_FROM_VALIDATED_CONTENT",
    flashcard,
    sourceValidation,
    issues,
  };
}

function tokens(value: string): Set<string> {
  return new Set(
    normalize(value)
      .split(/\s+/)
      .filter((token) => token.length >= 4),
  );
}

function jaccard(a: string, b: string): number {
  const aTokens = tokens(a);
  const bTokens = tokens(b);
  if (aTokens.size === 0 || bTokens.size === 0) return 0;
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return Number((intersection / union).toFixed(3));
}

function duplicateText(card: StandardizedQuestionFlashcard): string {
  return `${card.front}\n${card.back}\n${card.clinicalPearl}\n${card.memoryAnchor}`;
}

export function detectRegeneratedFlashcardDuplicates(results: readonly FlashcardRegenerationResult[]): readonly FlashcardDuplicateFinding[] {
  const generated = results
    .map((result) => result.flashcard)
    .filter((card): card is StandardizedQuestionFlashcard => Boolean(card));
  const findings: FlashcardDuplicateFinding[] = [];

  for (let i = 0; i < generated.length; i += 1) {
    for (let j = i + 1; j < generated.length; j += 1) {
      const a = generated[i]!;
      const b = generated[j]!;
      const aText = normalize(duplicateText(a));
      const bText = normalize(duplicateText(b));
      if (aText === bText) {
        findings.push({
          primaryQuestionId: a.sourceQuestionId,
          duplicateQuestionId: b.sourceQuestionId,
          similarity: 1,
          reason: "exact_normalized_match",
        });
        continue;
      }
      const similarity = jaccard(aText, bText);
      if (similarity >= 0.86) {
        findings.push({
          primaryQuestionId: a.sourceQuestionId,
          duplicateQuestionId: b.sourceQuestionId,
          similarity,
          reason: "near_duplicate",
        });
      }
    }
  }

  return findings;
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function readinessFor(results: readonly FlashcardRegenerationResult[], group: QuestionEnrichmentPathwayGroup): FlashcardReadinessDashboard {
  const scoped = results.filter((result) => result.pathwayGroup === group);
  const generated = scoped.filter((result) => result.flashcard);
  const weak = generated.filter((result) => result.flashcard && isWeakFlashcard(result.flashcard));
  const definitionOnly = generated.filter((result) => result.flashcard && isDefinitionOnly(result.flashcard));
  const noClinicalApplication = generated.filter((result) => result.flashcard && missingClinicalApplication(result.flashcard));
  const translationReady = generated.filter((result) => result.flashcard?.translationReadiness.ready).length;
  return {
    totalQuestions: scoped.length,
    generatedFlashcards: generated.length,
    blockedSources: scoped.filter((result) => result.status === "BLOCKED_SOURCE_NOT_VALIDATED").length,
    weakFlashcards: weak.length,
    definitionOnlyFlashcards: definitionOnly.length,
    missingClinicalApplication: noClinicalApplication.length,
    translationReady,
    readinessPercent: pct(scoped.filter((result) => result.status === "GENERATED_FROM_VALIDATED_CONTENT").length, scoped.length),
    monetizationReadinessPercent: pct(scoped.filter((result) => result.sourceValidation.monetizationReady && result.status === "GENERATED_FROM_VALIDATED_CONTENT").length, scoped.length),
  };
}

export function buildGlobalFlashcardStandardizationReport(rows: readonly QuestionEnrichmentAuditRow[]): GlobalFlashcardStandardizationReport {
  const results = rows.map(regenerateFlashcardFromEnrichedQuestion);
  const duplicateFindings = detectRegeneratedFlashcardDuplicates(results);
  const generatedCount = results.filter((result) => result.flashcard).length;
  const duplicateQuestionIds = new Set(duplicateFindings.map((finding) => finding.duplicateQuestionId));

  return {
    rnFlashcardReadiness: readinessFor(results, "RN"),
    pnFlashcardReadiness: readinessFor(results, "RPN_PN"),
    npFlashcardReadiness: readinessFor(results, "NP"),
    duplicateReductionReport: {
      duplicatePairs: duplicateFindings.length,
      exactDuplicates: duplicateFindings.filter((finding) => finding.reason === "exact_normalized_match").length,
      nearDuplicates: duplicateFindings.filter((finding) => finding.reason === "near_duplicate").length,
      estimatedReductionCount: duplicateQuestionIds.size,
      estimatedReductionPercent: pct(duplicateQuestionIds.size, generatedCount),
      findings: duplicateFindings,
    },
    results,
  };
}
