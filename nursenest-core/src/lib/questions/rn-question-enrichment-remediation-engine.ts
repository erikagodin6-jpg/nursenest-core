import {
  auditQuestionEnrichment,
  summarizeQuestionEnrichment,
  type QuestionEnrichmentAuditResult,
  type QuestionEnrichmentAuditRow,
  type QuestionEnrichmentMissingField,
  type QuestionEnrichmentRemediationDraft,
} from "./question-enrichment-governance";

export type RnQuestionEnrichmentScope =
  | "NCLEX_RN_US"
  | "NCLEX_RN_CANADA"
  | "NEW_GRAD_RN"
  | "ECG_RN_CONTENT"
  | "LAB_INTERPRETATION_RN_CONTENT"
  | "CLINICAL_SKILLS_RN_CONTENT";

export type RnEnrichmentComponentDrafts = {
  readonly correctRationaleDraft?: string;
  readonly distractorRationaleDraft?: string;
  readonly hintDraft?: string;
  readonly clinicalPearlDraft?: string;
  readonly memoryAnchorDraft?: string;
  readonly blueprintMappingDraft?: string;
  readonly metadataDraft?: {
    readonly exam: string;
    readonly bodySystem: string;
    readonly topic: string;
    readonly questionType: string;
  };
  readonly flashcardOutputDraft?: {
    readonly front: string;
    readonly back: string;
    readonly clinicalPearl: string;
    readonly memoryAnchor: string;
    readonly examRelevance: string;
  };
  readonly publishable: false;
};

export type RnQuestionEnrichmentAuditResult = QuestionEnrichmentAuditResult & {
  readonly rnScopes: readonly RnQuestionEnrichmentScope[];
  readonly rnPublicationBlocked: boolean;
  readonly rnRemediationDrafts: RnEnrichmentComponentDrafts;
};

export type RnQuestionEnrichmentSummary = {
  readonly totalRnQuestions: number;
  readonly missingRationales: number;
  readonly missingHints: number;
  readonly missingPearls: number;
  readonly missingMetadata: number;
  readonly missingDistractorRationales: number;
  readonly missingMemoryAnchors: number;
  readonly missingBlueprintMapping: number;
  readonly missingFlashcardGeneration: number;
  readonly catEligible: number;
  readonly adaptiveEligible: number;
  readonly publicationReadinessPercent: number;
  readonly monetizationReadinessPercent: number;
  readonly scopeCounts: Record<RnQuestionEnrichmentScope, number>;
  readonly remediationPlan: readonly string[];
};

const RN_SCOPE_ORDER: readonly RnQuestionEnrichmentScope[] = [
  "NCLEX_RN_US",
  "NCLEX_RN_CANADA",
  "NEW_GRAD_RN",
  "ECG_RN_CONTENT",
  "LAB_INTERPRETATION_RN_CONTENT",
  "CLINICAL_SKILLS_RN_CONTENT",
] as const;

function plain(value: unknown): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

function normalizedSearchText(row: QuestionEnrichmentAuditRow): string {
  return [
    row.exam,
    row.tier,
    row.countryCode,
    row.languageCode,
    row.questionType,
    row.stem,
    row.bodySystem,
    row.topic,
    row.subtopic,
    row.nclexClientNeedsCategory,
    row.nclexClientNeedsSubcategory,
    ...(row.tags ?? []),
  ]
    .map(plain)
    .join(" ")
    .toLowerCase();
}

export function classifyRnQuestionScopes(row: QuestionEnrichmentAuditRow): readonly RnQuestionEnrichmentScope[] {
  const text = normalizedSearchText(row);
  const scopes = new Set<RnQuestionEnrichmentScope>();

  if (/us[_ -]?nclex[_ -]?rn|nclex[_ -]?rn.*\bus\b|\bus\b.*nclex[_ -]?rn/.test(text) || (/\bnclex[_ -]?rn\b/.test(text) && /\bus|united states/.test(text))) {
    scopes.add("NCLEX_RN_US");
  }
  if (/ca[_ -]?nclex[_ -]?rn|canadian nclex|canada.*nclex[_ -]?rn|nclex[_ -]?rn.*canada|\bca\b.*nclex[_ -]?rn/.test(text)) {
    scopes.add("NCLEX_RN_CANADA");
  }
  if (/new grad|transition to practice|first job|clinical transition/.test(text)) {
    scopes.add("NEW_GRAD_RN");
  }
  if (/\becg\b|electrocardiogram|telemetry|rhythm|stemi|dysrhythmia|atrial fibrillation|heart block/.test(text)) {
    scopes.add("ECG_RN_CONTENT");
  }
  if (/\blab\b|laboratory|cbc|electrolyte|abg|troponin|bnp|creatinine|potassium|sodium|calcium/.test(text)) {
    scopes.add("LAB_INTERPRETATION_RN_CONTENT");
  }
  if (/clinical skill|skills|iv therapy|wound care|central line|tracheostomy|chest tube|blood transfusion|medication administration/.test(text)) {
    scopes.add("CLINICAL_SKILLS_RN_CONTENT");
  }
  if (/\bnclex[_ -]?rn\b/.test(text) && scopes.size === 0) {
    scopes.add(row.countryCode === "CA" ? "NCLEX_RN_CANADA" : "NCLEX_RN_US");
  }

  return RN_SCOPE_ORDER.filter((scope) => scopes.has(scope));
}

export function isRnQuestion(row: QuestionEnrichmentAuditRow): boolean {
  if (classifyRnQuestionScopes(row).length > 0) return true;
  const text = normalizedSearchText(row);
  return /\brn\b|registered nurse|nclex[_ -]?rn/.test(text) && !/\bnclex[_ -]?pn\b|\brex[_ -]?pn\b|\brpn\b|\blpn\b|\bnp\b|fnp|agpcnp|pmhnp|cnple/.test(text);
}

function componentDraft(row: QuestionEnrichmentAuditRow, base: QuestionEnrichmentRemediationDraft, missingFields: readonly QuestionEnrichmentMissingField[]): RnEnrichmentComponentDrafts {
  const topic = plain(row.topic) || plain(row.subtopic) || plain(row.bodySystem) || "the tested concept";
  const stem = plain(row.stem);
  const answer = plain(row.correctAnswer);
  const exam = plain(row.exam) || "NCLEX-RN";
  const bodySystem = plain(row.bodySystem) || "RN clinical judgment";
  const questionType = plain(row.questionType) || "multiple_choice";
  const pearl = plain(row.clinicalPearl) || `${topic}: connect the cue cluster to the safest RN action before choosing routine care.`;
  const memory = plain(row.memoryHook || row.mnemonic) || `${topic}: unstable cues first, routine care second.`;
  const examRelevance = base.examRelevance || `${exam} / ${bodySystem} / ${topic}`;

  return {
    correctRationaleDraft: missingFields.includes("correct_rationale")
      ? `Draft for review: The correct answer should be explained by linking the stem cues to ${topic}, RN scope, patient safety, and the priority framework. The rationale must identify why ${answer || "the correct option"} addresses the most urgent risk, what assessment data support that choice, and what complication could occur if the cue is missed. This draft is an authoring scaffold only and requires clinical review before publication.`
      : undefined,
    distractorRationaleDraft: missingFields.includes("distractor_rationales")
      ? "Draft for review: For each incorrect option, explain why a learner may find it tempting, why it is unsafe or lower priority for this stem, and which cue should redirect future reasoning. Each distractor rationale must be specific to timing, assessment priority, safety risk, scope, or clinical interpretation."
      : undefined,
    hintDraft: missingFields.includes("hint")
      ? `Draft for review: Identify the cue in the stem that changes urgency before choosing an action. Do not choose based on the diagnosis label alone.`
      : undefined,
    clinicalPearlDraft: missingFields.includes("clinical_pearl") ? pearl : undefined,
    memoryAnchorDraft: missingFields.includes("memory_anchor") ? memory : undefined,
    blueprintMappingDraft: missingFields.includes("blueprint_mapping") ? `${exam}: map to the closest client-needs or clinical judgment blueprint domain for ${topic}.` : undefined,
    metadataDraft: missingFields.includes("metadata")
      ? {
          exam,
          bodySystem,
          topic,
          questionType,
        }
      : undefined,
    flashcardOutputDraft: missingFields.includes("flashcard_output")
      ? {
          front: base.flashcardFront || `What is the high-yield RN judgment for this scenario? ${stem}`,
          back: base.flashcardBack || `Answer: ${answer || "Requires reviewed correct answer."}`,
          clinicalPearl: pearl,
          memoryAnchor: memory,
          examRelevance,
        }
      : undefined,
    publishable: false,
  };
}

export function auditRnQuestionEnrichment(row: QuestionEnrichmentAuditRow): RnQuestionEnrichmentAuditResult | null {
  if (!isRnQuestion(row)) return null;
  const base = auditQuestionEnrichment(row);
  const rnScopes = classifyRnQuestionScopes(row);

  return {
    ...base,
    pathwayGroup: "RN",
    rnScopes,
    rnPublicationBlocked: !base.publicationReady || !base.flashcardReady || !base.practiceExamReady || !base.catReady || !base.adaptiveLearningReady,
    rnRemediationDrafts: componentDraft(row, base.remediationDraft, base.missingFields),
  };
}

export function auditRnQuestionEnrichmentBatch(rows: readonly QuestionEnrichmentAuditRow[]): readonly RnQuestionEnrichmentAuditResult[] {
  return rows.map(auditRnQuestionEnrichment).filter((result): result is RnQuestionEnrichmentAuditResult => Boolean(result));
}

export function summarizeRnQuestionEnrichment(results: readonly RnQuestionEnrichmentAuditResult[]): RnQuestionEnrichmentSummary {
  const baseSummary = summarizeQuestionEnrichment(results);
  const scopeCounts = Object.fromEntries(RN_SCOPE_ORDER.map((scope) => [scope, results.filter((result) => result.rnScopes.includes(scope)).length])) as Record<RnQuestionEnrichmentScope, number>;

  return {
    totalRnQuestions: results.length,
    missingRationales: baseSummary.questionsMissingRationales,
    missingHints: baseSummary.questionsMissingHints,
    missingPearls: baseSummary.questionsMissingClinicalPearls,
    missingMetadata: baseSummary.questionsMissingMetadata,
    missingDistractorRationales: results.filter((result) => result.missingFields.includes("distractor_rationales")).length,
    missingMemoryAnchors: results.filter((result) => result.missingFields.includes("memory_anchor")).length,
    missingBlueprintMapping: baseSummary.questionsMissingBlueprintMapping,
    missingFlashcardGeneration: baseSummary.questionsMissingFlashcardOutputs,
    catEligible: results.filter((result) => result.catReady).length,
    adaptiveEligible: results.filter((result) => result.adaptiveLearningReady).length,
    publicationReadinessPercent: pct(results.filter((result) => result.publicationReady).length, results.length),
    monetizationReadinessPercent: pct(results.filter((result) => result.monetizationReady).length, results.length),
    scopeCounts,
    remediationPlan: [
      "Block all RN questions missing rationale, distractor rationale, hint, clinical pearl, memory anchor, blueprint mapping, flashcard output, CAT eligibility, or adaptive eligibility.",
      "Generate non-publishable remediation drafts for missing components and route them to clinical and educational review.",
      "Prioritize questions missing correct rationales or distractor rationales before metadata-only cleanup.",
      "Promote reviewed questions only after flashcard, practice exam, CAT, and adaptive-learning readiness all pass.",
    ],
  };
}
