/**
 * NurseNest Content Pipeline Schema — v1
 *
 * Machine-readable TypeScript definitions for all 10 stages of the
 * production content pipeline. Covers:
 *   RN · RPN/LPN · NP · Allied Health · Pre-nursing · New Grad
 *
 * Pipeline stages:
 *   A. blueprint_design          — authoritative topic inventory
 *   B. topic_list                — per-run topic work queue
 *   C. lesson_generation         — AI-drafted lesson records
 *   D. question_generation       — AI-drafted exam questions
 *   E. validation                — per-item error/warning ledger
 *   F. deduplication             — exact + near-duplicate detection
 *   G. normalization             — canonical field coercion
 *   H. internal_linking          — cross-lesson / cross-question metadata
 *   I. prisma_import             — DB-ready upsert payloads
 *   J. coverage_report           — blueprint gap analysis
 *
 * Aligned with:
 *   - Prisma: PathwayLesson, ExamQuestion, ContentItem, GeneratedLessonDraft,
 *             GeneratedQuestionDraft, AlliedBlueprint
 *   - TS types: BlueprintDocument, BlueprintTopic, PathwayLessonRecord,
 *               AdminAiGeneratedLesson, AdminAiLessonDraftNormalized
 *
 * Stability rules:
 *   - `pipelineId` is generated once (at topic-list stage) and travels through
 *     all stages unchanged.
 *   - `topicSlug` is the cross-stage join key; must match blueprint entry.
 *   - Stage outputs are append-only; existing records are never silently replaced.
 *
 * @module pipeline-schema
 */

// ─── Shared Enums ─────────────────────────────────────────────────────────────

/** All NurseNest program tracks. Aligned with BlueprintProgram. */
export type PipelineProgram =
  | "rn"
  | "rpn"
  | "lpn"
  | "np"
  | "allied"
  | "pre-nursing"
  | "new-grad";

/** Country/region scope. Aligned with BlueprintCountry. */
export type PipelineCountry = "us" | "ca" | "both";

/** Exam codes accepted across all programs. */
export type PipelineExamCode =
  | "NCLEX-RN"
  | "Canadian-RN"
  | "NCLEX-PN"
  | "REx-PN"
  | "AANP-FNP"
  | "ANCC-FNP"
  | "ANCC-AGPCNP"
  | "ANCC-PMHNP"
  | "CNPLE-NP"
  | "NBRC-TMC"
  | "NPTE-PT"
  | "NBCOT-OT"
  | "ASCP-MLT"
  | "NREMT-EMT"
  | "NREMT-P"
  | string;

/** Canonical body-system keys. Aligned with PATHWAY_LESSON_SYSTEM_ORDER + cat-inference-maps. */
export type PipelineBodySystem =
  | "cardiovascular"
  | "respiratory"
  | "neurological"
  | "musculoskeletal"
  | "gastrointestinal"
  | "endocrine"
  | "genitourinary"
  | "reproductive-health"
  | "dermatology"
  | "behavioral-health"
  | "infectious-disease"
  | "hematology-oncology"
  | "pharmacology"
  | "multisystem"
  | "vital-signs"
  | "clinical-deterioration"
  | "infection-immunity"
  | "maternal-newborn"
  | "pediatrics"
  | "mental-health"
  | "special-populations"
  | "communication"
  | "safety"
  | "fundamentals"
  | "general"
  | string;

/** Difficulty keys for entry-level programs. */
export type EntryDifficultyKey = "easy" | "moderate" | "hard";

/** Difficulty keys for advanced programs (NP). */
export type AdvancedDifficultyKey = "medium" | "hard" | "expert";

/** Question format codes. Aligned with BlueprintQuestionType + ExamQuestion.questionType. */
export type PipelineQuestionType =
  | "MCQ"
  | "SATA"
  | "Priority"
  | "Exhibit"
  | "Fill-in"
  | "Drag-drop"
  | "Hot-spot"
  | "Bowtie"
  | "Matrix"
  | "Trend"
  | "Case-study"
  | string;

/** Content archetype. Aligned with AdminAiLessonType + PathwayLessonContentDomain. */
export type PipelineContentDomain =
  | "disease"
  | "syndrome"
  | "medication"
  | "safety"
  | "prioritization"
  | "delegation"
  | "diagnostics_labs"
  | "intervention_procedure"
  | "case_study"
  | "other";

/** Pipeline item lifecycle status. */
export type PipelineItemStatus =
  | "pending"
  | "in_progress"
  | "generated"
  | "validated"
  | "deduplicated"
  | "normalized"
  | "linked"
  | "import_ready"
  | "imported"
  | "skipped"
  | "failed";

/** Content publication status. Aligned with ContentStatus enum + PathwayLesson.status. */
export type PipelineContentStatus = "draft" | "review" | "published" | "archived";

// ─── Stage Envelope ────────────────────────────────────────────────────────────

/**
 * Metadata wrapper present on every stage output document.
 * Enables re-runs to detect staleness and merge safely.
 */
export interface PipelineStageEnvelope {
  /** Pipeline schema version. Must be 1. */
  schemaVersion: 1;
  /** Stage identifier (A–J). */
  stage:
    | "blueprint_design"
    | "topic_list"
    | "lesson_generation"
    | "question_generation"
    | "validation"
    | "deduplication"
    | "normalization"
    | "internal_linking"
    | "prisma_import"
    | "coverage_report";
  /** UUID for this specific pipeline run. Links related stage outputs. */
  runId: string;
  /** ISO-8601 timestamp when this stage output was written. */
  generatedAt: string;
  /** Program tracks included in this run. */
  programs: PipelineProgram[];
  /** Country scope for this run. */
  country: PipelineCountry;
  /** Human note about what changed in this run (audit log). */
  runNote?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE A — Blueprint Design
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage A output: the canonical authoritative blueprint document.
 *
 * This stage does not generate content — it defines the topic inventory and
 * exam-weight targets that all downstream stages consume.
 *
 * Maps directly to: BlueprintDocument (exam-blueprint-schema.ts)
 * Stored at: data/blueprints/<program>-content-blueprint.json
 *
 * Safeguard: Never overwrite an existing blueprint without bumping `generatedDate`
 * and archiving the prior version to data/blueprints/archive/.
 */
export interface StageBlueprintDesign extends PipelineStageEnvelope {
  stage: "blueprint_design";
  blueprint: {
    $schema: "https://nursenest.io/schemas/exam-blueprint/v1";
    version: 1;
    label: string;
    description: string;
    generatedDate: string;
    program: PipelineProgram[];
    targetExams: PipelineExamCode[];
    priorityWeightKey: Record<"1" | "2" | "3" | "4" | "5", string>;
    difficultyScale: Record<string, string>;
    questionTypeKey?: Record<string, string>;
    topics: BlueprintTopicEntry[];
  };
}

/** Single topic entry in a blueprint. Aligned with BlueprintTopic. */
export interface BlueprintTopicEntry {
  /** Human-readable topic name (title-cased). */
  topic: string;
  /** URL-safe slug: lowercase letters, digits, hyphens. */
  topicSlug: string;
  /** Program track(s). */
  program: PipelineProgram | PipelineProgram[];
  /** Country scope. */
  country: PipelineCountry;
  /** Target exam codes ([] allowed for pre-nursing / new-grad). */
  exam: PipelineExamCode[];
  /** Top-level content domain (e.g. "Adult Health / Med-Surg"). */
  domain: string;
  /** Subdomain (e.g. "Cardiovascular Disorders"). */
  subdomain: string;
  /** Canonical body system. */
  bodySystem: PipelineBodySystem;
  /** Exam frequency weight 1–5. 5 = critical. */
  priorityWeight: 1 | 2 | 3 | 4 | 5;
  /** Minimum lesson count target for this topic. */
  lessonTargetCount: number;
  /** Minimum question count target for this topic. */
  questionTargetCount: number;
  /** Difficulty distribution summing to 100. */
  difficultyMix: Partial<Record<EntryDifficultyKey | AdvancedDifficultyKey, number>>;
  /** Searchable tags for filtering and generation prompts. */
  tags: string[];
  complexity?: "foundational" | "entry-level" | "advanced" | "expert";
  recommendedQuestionTypes?: PipelineQuestionType[];
  populationTags?: string[];
  contentDomain?: PipelineContentDomain;
  status?: "planned" | "in_progress" | "published" | "archived";
  sequenceOrder?: number;
  generationNotes?: string;
  countryApplicability?: "us" | "ca" | "both" | "canada-only" | "us-only";
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE B — Topic List Generation
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage B output: per-run work queue derived from the blueprint.
 *
 * Each topic that needs new lessons or questions becomes a `TopicWorkItem`.
 * The stable `pipelineId` is assigned here and propagated to all downstream stages.
 *
 * Maps to: LessonBatchQueueItem (lesson_batch_queue_item table)
 * Generation scripts: run-blueprint-lesson-expansion.ts, run-content-batch-pipeline.mjs
 *
 * Safeguard: Topics already at target counts are emitted with status "skipped";
 * do not re-generate them unless `forceRegenerate: true` is set on the run config.
 */
export interface StageTopicList extends PipelineStageEnvelope {
  stage: "topic_list";
  /** Source blueprint file path (relative to repo root). */
  blueprintSource: string;
  /** Ordered topic work items for this run. */
  topics: TopicWorkItem[];
  /** Totals for auditing. */
  summary: {
    total: number;
    pending: number;
    skipped: number;
    lessonTargetTotal: number;
    questionTargetTotal: number;
  };
}

export interface TopicWorkItem {
  /** Stable UUID assigned at topic-list stage. Travels unchanged through all stages. */
  pipelineId: string;
  /** Slug matching BlueprintTopicEntry.topicSlug. Primary join key. */
  topicSlug: string;
  /** Human topic name from blueprint. */
  topic: string;
  program: PipelineProgram | PipelineProgram[];
  country: PipelineCountry;
  exam: PipelineExamCode[];
  domain: string;
  subdomain: string;
  bodySystem: PipelineBodySystem;
  priorityWeight: 1 | 2 | 3 | 4 | 5;
  difficultyMix: Partial<Record<EntryDifficultyKey | AdvancedDifficultyKey, number>>;
  tags: string[];
  recommendedQuestionTypes?: PipelineQuestionType[];
  contentDomain?: PipelineContentDomain;
  /** Lessons needed to reach blueprint target. */
  lessonsNeeded: number;
  /** Questions needed to reach blueprint target. */
  questionsNeeded: number;
  /** Existing lesson slugs for this topic (dedup reference). */
  existingLessonSlugs: string[];
  /** Existing question stemHashes for this topic (dedup reference). */
  existingQuestionHashes: string[];
  status: "pending" | "skipped";
  /** Why this item was skipped (if status === "skipped"). */
  skipReason?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE C — Lesson Generation
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage C output: AI-drafted lesson records before validation.
 *
 * Maps to: GeneratedLessonDraft.payloadJson (before promotion)
 *          PathwayLesson (pathway_lessons table) after promotion
 *
 * Each lesson carries full `pipelineId` → `topicSlug` → `pathwayId` traceability.
 *
 * Safeguard: Lessons are written to GeneratedLessonDraft with status "pending_review"
 * before any PathwayLesson row is created or updated. Promotion is a separate step (Stage I).
 */
export interface StageLessonGeneration extends PipelineStageEnvelope {
  stage: "lesson_generation";
  /** Source topic list run ID (links back to Stage B). */
  topicListRunId: string;
  lessons: LessonDraft[];
  summary: {
    total: number;
    byProgram: Partial<Record<PipelineProgram, number>>;
    byBodySystem: Partial<Record<string, number>>;
    failedCount: number;
  };
}

export interface LessonDraft {
  /** Stable pipelineId from Stage B TopicWorkItem. */
  pipelineId: string;
  /** Sequential position within this run (for resumable batch imports). */
  batchPosition: number;
  topicSlug: string;
  topic: string;
  program: PipelineProgram | PipelineProgram[];
  country: PipelineCountry;
  exam: PipelineExamCode[];
  domain: string;
  subdomain: string;
  bodySystem: PipelineBodySystem;
  contentDomain?: PipelineContentDomain;
  priorityWeight: 1 | 2 | 3 | 4 | 5;

  // ── Core lesson fields (will become PathwayLesson columns) ─────────────────

  /** Proposed DB slug. Must be unique per pathwayId + locale. */
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  /** Target pathwayId (e.g. "nclex-rn", "rex-pn", "aanp-fnp", "allied-rt"). */
  pathwayId: string;
  locale: string;

  /**
   * Lesson sections (PathwayLessonSection[]).
   * Use premium section kinds where applicable:
   *   introduction, pathophysiology_overview, signs_symptoms, red_flags,
   *   labs_diagnostics, nursing_assessment_interventions, clinical_pearls,
   *   client_education, tier_specific_relevance, country_specific_notes,
   *   related_next_steps
   */
  sections: LessonDraftSection[];

  /** Optional inline pre/post quiz items (PathwayLessonQuizItem[]). */
  preTest?: LessonDraftQuizItem[];
  postTest?: LessonDraftQuizItem[];

  /** How many sections are freely visible (non-premium). */
  previewSectionCount: number;

  /** Tier access gate. Aligned with TierCode enum. */
  tierCode?: "FREE" | "BASIC" | "PREMIUM" | "PRO";
  /** CountryCode enum value (null = both). */
  countryCode?: "US" | "CA" | null;

  // ── Metadata ───────────────────────────────────────────────────────────────

  tags: string[];
  audienceTiers?: Array<"rn" | "pn" | "np">;
  countryScope?: PipelineCountry;
  examRelevance?: "high_yield" | "core" | "specialty";
  relatedLessonSlugs?: string[];

  /** Clinical pearl for AI-generated metadata block. */
  clinicalPearl?: string;
  /** Safety note flagged by generation. */
  safetyNote?: string;

  // ── Pipeline provenance ────────────────────────────────────────────────────

  status: PipelineItemStatus;
  /** ISO-8601. */
  generatedAt: string;
  /** AI model used for generation. */
  model: string;
  /** Hash of (title + topicSlug + slug) for dedup. */
  contentHash?: string;
  generationError?: string;
}

export interface LessonDraftSection {
  /** Stable section ID within this lesson (e.g. "introduction", "pathophysiology_overview"). */
  id: string;
  heading: string;
  kind:
    | "introduction"
    | "pathophysiology_overview"
    | "signs_symptoms"
    | "red_flags"
    | "labs_diagnostics"
    | "nursing_assessment_interventions"
    | "clinical_pearls"
    | "client_education"
    | "tier_specific_relevance"
    | "country_specific_notes"
    | "related_next_steps"
    | "core_concept"
    | "clinical_application"
    | "exam_tips"
    | "exam_focus"
    | "takeaways";
  body: string;
  examFocus?: {
    howTested?: string;
    commonTraps?: string;
    prioritizationCues?: string;
  };
}

export interface LessonDraftQuizItem {
  question: string;
  options: string[];
  /** Zero-based index of correct option. */
  correct: number;
  rationale?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE D — Question Generation
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage D output: AI-drafted exam questions before validation.
 *
 * Maps to: GeneratedQuestionDraft.payloadJson (before promotion)
 *          ExamQuestion (exam_questions table) after promotion
 *
 * Safeguard: stemHash is computed before insert; duplicate hashes must not be promoted.
 * Questions targeting NCLEX-RN must include nclexClientNeedsCategory.
 */
export interface StageQuestionGeneration extends PipelineStageEnvelope {
  stage: "question_generation";
  topicListRunId: string;
  questions: QuestionDraft[];
  summary: {
    total: number;
    byProgram: Partial<Record<PipelineProgram, number>>;
    byBodySystem: Partial<Record<string, number>>;
    byQuestionType: Partial<Record<PipelineQuestionType, number>>;
    failedCount: number;
  };
}

export interface QuestionDraft {
  /** Stable pipelineId from Stage B TopicWorkItem. */
  pipelineId: string;
  batchPosition: number;
  topicSlug: string;
  topic: string;
  subtopic?: string;
  program: PipelineProgram | PipelineProgram[];
  country: PipelineCountry;
  exam: PipelineExamCode[];
  domain: string;
  subdomain: string;
  bodySystem: PipelineBodySystem;
  contentDomain?: PipelineContentDomain;

  // ── Core question fields (will become ExamQuestion columns) ────────────────

  /** Target exam family (e.g. "NCLEX-RN", "REx-PN", "AANP-FNP"). */
  examFamily: string;
  /** Tier for entitlement gate. */
  tier: string;
  questionType: PipelineQuestionType;

  /** Question stem. May include a clinical vignette. */
  stem: string;
  /** Options as string array. MCQ = 4 options; SATA = 4–6. */
  options: string[];
  /**
   * Correct answer(s).
   * MCQ: single string matching one option.
   * SATA: string[] of all correct options.
   * Priority: string[] in correct order.
   * Fill-in: string (numeric with unit).
   */
  correctAnswer: string | string[];
  rationale: string;
  /** Per-distractor explanations keyed by option text or index. */
  distractorRationales?: Record<string, string>;

  difficulty: 1 | 2 | 3 | 4 | 5;
  cognitiveLevel?: "recall" | "comprehension" | "application" | "analysis" | "synthesis";

  // ── Clinical enrichment ────────────────────────────────────────────────────

  clinicalPearl?: string;
  examStrategy?: string;
  memoryHook?: string;
  clinicalTrap?: string;
  mnemonic?: string;
  keyTakeaway?: string;
  scenario?: string;
  caseContext?: string;
  clinicalReasoning?: string;

  // ── Optional exhibit data (Exhibit/Bowtie/Matrix question types) ───────────

  exhibitData?: {
    kind: "labs" | "chart" | "vitals" | "medication_record" | "history" | string;
    content: Record<string, unknown>;
  };
  vitals?: Record<string, unknown>;
  labs?: Record<string, unknown>;

  // ── NCLEX-specific metadata ────────────────────────────────────────────────

  /** Required when examFamily includes "NCLEX-RN" or "NCLEX-PN". Max 64 chars. */
  nclexClientNeedsCategory?: string;
  nclexClientNeedsSubcategory?: string;

  // ── Region / licensing body ────────────────────────────────────────────────

  countryCode?: "US" | "CA";
  regionCode?: string;
  licensingBody?: string;
  languageCode?: string;
  labUnitVariant?: "SI" | "conventional" | "both";
  medicationNamingVariant?: "generic" | "trade" | "both";

  // ── Eligibility flags (align with ExamQuestion booleans) ──────────────────

  isMockExamEligible?: boolean;
  isAdaptiveEligible?: boolean;
  isFlashcardSource?: boolean;
  isStudyGuideLinked?: boolean;
  isTutorReady?: boolean;
  isScenario?: boolean;

  // ── Blueprint weight ───────────────────────────────────────────────────────

  blueprintWeight?: number;
  tags: string[];

  // ── Pipeline provenance ────────────────────────────────────────────────────

  status: PipelineItemStatus;
  generatedAt: string;
  model: string;
  /** SHA-256 of normalized stem (lowercase, punctuation stripped). Used for dedup. */
  stemHash?: string;
  generationError?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE E — Validation
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage E output: per-item error and warning ledger.
 *
 * Validation is non-blocking: items with errors are flagged "failed" but
 * not removed — they can be corrected and re-validated without re-running
 * generation.
 *
 * Validation rules applied:
 *   Lessons:
 *     - slug is valid kebab-case and unique within pathwayId+locale
 *     - seoTitle ≤ 70 chars, seoDescription ≤ 160 chars
 *     - sections ≥ 3, each body ≥ 40 chars
 *     - premium section kinds are used when program is "rn", "np", or "rpn"
 *     - countryCode matches program (rpn/lpn → Canada/US respectively)
 *     - clinicalSafetyReview flag is NOT set (must be human-reviewed before publish)
 *   Questions:
 *     - stem ≥ 20 chars
 *     - options ≥ 2 (MCQ ≥ 4, SATA 4–6)
 *     - correctAnswer references valid option(s)
 *     - rationale ≥ 40 chars
 *     - NCLEX questions have nclexClientNeedsCategory
 *     - difficultyMix sum = 100 when provided
 *     - stemHash is present and not in existingQuestionHashes
 */
export interface StageValidation extends PipelineStageEnvelope {
  stage: "validation";
  lessonResults: ValidationResult[];
  questionResults: ValidationResult[];
  summary: {
    lessonsTotal: number;
    lessonsValid: number;
    lessonsFailed: number;
    questionsTotal: number;
    questionsValid: number;
    questionsFailed: number;
  };
}

export interface ValidationResult {
  pipelineId: string;
  topicSlug: string;
  slug?: string;
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface ValidationIssue {
  code: string;
  field?: string;
  message: string;
  /** Suggested fix for automated correction passes. */
  autoFixHint?: string;
}

/** Named validation rule codes for machine processing. */
export const VALIDATION_RULE_CODES = {
  // Lessons
  LESSON_SLUG_INVALID: "LESSON_SLUG_INVALID",
  LESSON_SLUG_DUPLICATE: "LESSON_SLUG_DUPLICATE",
  LESSON_SEO_TITLE_TOO_LONG: "LESSON_SEO_TITLE_TOO_LONG",
  LESSON_SEO_DESC_TOO_LONG: "LESSON_SEO_DESC_TOO_LONG",
  LESSON_SECTIONS_TOO_FEW: "LESSON_SECTIONS_TOO_FEW",
  LESSON_SECTION_BODY_TOO_SHORT: "LESSON_SECTION_BODY_TOO_SHORT",
  LESSON_COUNTRY_MISMATCH: "LESSON_COUNTRY_MISMATCH",
  LESSON_TOPIC_SLUG_MISSING: "LESSON_TOPIC_SLUG_MISSING",
  LESSON_NO_BLUEPRINT_MAPPING: "LESSON_NO_BLUEPRINT_MAPPING",
  // Questions
  QUESTION_STEM_TOO_SHORT: "QUESTION_STEM_TOO_SHORT",
  QUESTION_TOO_FEW_OPTIONS: "QUESTION_TOO_FEW_OPTIONS",
  QUESTION_ANSWER_NOT_IN_OPTIONS: "QUESTION_ANSWER_NOT_IN_OPTIONS",
  QUESTION_RATIONALE_TOO_SHORT: "QUESTION_RATIONALE_TOO_SHORT",
  QUESTION_NCLEX_MISSING_CLIENT_NEEDS: "QUESTION_NCLEX_MISSING_CLIENT_NEEDS",
  QUESTION_STEM_HASH_MISSING: "QUESTION_STEM_HASH_MISSING",
  QUESTION_STEM_HASH_DUPLICATE: "QUESTION_STEM_HASH_DUPLICATE",
  QUESTION_DIFFICULTY_MIX_INVALID: "QUESTION_DIFFICULTY_MIX_INVALID",
  QUESTION_NO_BLUEPRINT_MAPPING: "QUESTION_NO_BLUEPRINT_MAPPING",
  // Shared
  TOPIC_SLUG_NOT_IN_BLUEPRINT: "TOPIC_SLUG_NOT_IN_BLUEPRINT",
  BODY_SYSTEM_UNKNOWN: "BODY_SYSTEM_UNKNOWN",
  REGION_SCOPE_MISMATCH: "REGION_SCOPE_MISMATCH",
} as const;

export type ValidationRuleCode = (typeof VALIDATION_RULE_CODES)[keyof typeof VALIDATION_RULE_CODES];

// ══════════════════════════════════════════════════════════════════════════════
// STAGE F — Deduplication
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage F output: duplicate detection report + resolution decisions.
 *
 * Dedup strategy:
 *   Exact duplicates:
 *     Lessons: identical (slug, pathwayId, locale) → keep first, drop rest.
 *     Questions: identical stemHash → keep highest qualityScore, drop rest.
 *   Near-duplicates:
 *     Lessons: title similarity ≥ 0.85 within same topicSlug + pathwayId → flag for review.
 *     Questions: stem similarity ≥ 0.80 within same topic + examFamily → flag for review.
 *
 * Resolution actions:
 *   "keep"   — retain as-is.
 *   "drop"   — exclude from downstream stages.
 *   "merge"  — human must merge and re-validate.
 *   "review" — flagged; pipeline continues but item is excluded from import.
 *
 * Maps to: GeneratedLessonDraft/GeneratedQuestionDraft.reviewStatus
 */
export interface StageDeduplication extends PipelineStageEnvelope {
  stage: "deduplication";
  lessonDedupResults: DedupResult[];
  questionDedupResults: DedupResult[];
  summary: {
    lessonsKept: number;
    lessonsDropped: number;
    lessonsFlaggedForReview: number;
    questionsKept: number;
    questionsDropped: number;
    questionsFlaggedForReview: number;
  };
}

export interface DedupResult {
  pipelineId: string;
  topicSlug: string;
  slug?: string;
  /** "exact" = hash collision; "near" = similarity threshold crossed. */
  duplicateKind: "exact" | "near" | "none";
  /** pipelineIds of the items this one collides with. */
  collidesWithPipelineIds?: string[];
  /** Similarity score 0–1 (only present for near duplicates). */
  similarityScore?: number;
  resolution: "keep" | "drop" | "merge" | "review";
  resolutionReason?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE G — Normalization
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage G output: canonical field coercion applied to all kept items.
 *
 * Normalization rules:
 *   - Trim all string fields.
 *   - bodySystem → canonical PipelineBodySystem value via BODY_SYSTEM_ALIASES map.
 *   - slug → enforce kebab-case; strip double-hyphens.
 *   - seoTitle → truncate to 70 chars with "…" suffix if needed.
 *   - seoDescription → truncate to 160 chars.
 *   - tags → lowercase, deduplicate, sort.
 *   - regionScope → "US" | "CA" | "BOTH" (uppercase, aligned with ContentItem.regionScope).
 *   - countryCode → "US" | "CA" | null.
 *   - tierCode → "FREE" | "BASIC" | "PREMIUM" | "PRO".
 *   - difficulty → clamp to 1–5.
 *   - stemHash → recompute if absent.
 *   - contentHash → recompute as SHA-256(slug + topicSlug + pathwayId).
 *
 * Maps to: GeneratedLessonDraft.normalizedJson, GeneratedQuestionDraft.normalizedJson
 */
export interface StageNormalization extends PipelineStageEnvelope {
  stage: "normalization";
  normalizedLessons: NormalizedLesson[];
  normalizedQuestions: NormalizedQuestion[];
  summary: {
    lessonsNormalized: number;
    questionsNormalized: number;
    fieldCorrectionsApplied: number;
  };
}

/**
 * Normalized lesson — ready for internal linking (Stage H) and import (Stage I).
 * Field names match PathwayLesson Prisma model column semantics.
 */
export interface NormalizedLesson {
  pipelineId: string;
  topicSlug: string;
  slug: string;
  title: string;
  topic: string;
  bodySystem: string;
  pathwayId: string;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  sections: LessonDraftSection[];
  preTest?: LessonDraftQuizItem[];
  postTest?: LessonDraftQuizItem[];
  previewSectionCount: number;
  tierCode: "FREE" | "BASIC" | "PREMIUM" | "PRO";
  countryCode: "US" | "CA" | null;
  /** "US" | "CA" | "BOTH" */
  regionScope: string;
  tags: string[];
  audienceTiers?: Array<"rn" | "pn" | "np">;
  examRelevance?: "high_yield" | "core" | "specialty";
  relatedLessonSlugs?: string[];
  clinicalPearl?: string;
  safetyNote?: string;
  contentHash: string;
  program: PipelineProgram | PipelineProgram[];
  country: PipelineCountry;
  exam: PipelineExamCode[];
  domain: string;
  subdomain: string;
  priorityWeight: 1 | 2 | 3 | 4 | 5;
  contentDomain?: PipelineContentDomain;
  model: string;
  generatedAt: string;
}

/**
 * Normalized question — ready for internal linking (Stage H) and import (Stage I).
 * Field names match ExamQuestion Prisma model column semantics.
 */
export interface NormalizedQuestion {
  pipelineId: string;
  topicSlug: string;
  examFamily: string;
  tier: string;
  questionType: PipelineQuestionType;
  stem: string;
  options: string[];
  correctAnswer: string | string[];
  rationale: string;
  distractorRationales?: Record<string, string>;
  difficulty: 1 | 2 | 3 | 4 | 5;
  cognitiveLevel?: "recall" | "comprehension" | "application" | "analysis" | "synthesis";
  bodySystem: string;
  topic: string;
  subtopic?: string;
  tags: string[];
  regionScope: string;
  countryCode: "US" | "CA" | null;
  regionCode?: string;
  licensingBody?: string;
  languageCode: string;
  labUnitVariant?: "SI" | "conventional" | "both";
  medicationNamingVariant?: "generic" | "trade" | "both";
  nclexClientNeedsCategory?: string;
  nclexClientNeedsSubcategory?: string;
  clinicalPearl?: string;
  examStrategy?: string;
  memoryHook?: string;
  clinicalTrap?: string;
  mnemonic?: string;
  keyTakeaway?: string;
  clinicalReasoning?: string;
  scenario?: string;
  caseContext?: string;
  exhibitData?: QuestionDraft["exhibitData"];
  vitals?: Record<string, unknown>;
  labs?: Record<string, unknown>;
  isMockExamEligible: boolean;
  isAdaptiveEligible: boolean;
  isFlashcardSource: boolean;
  isStudyGuideLinked: boolean;
  isTutorReady: boolean;
  isScenario: boolean;
  blueprintWeight?: number;
  stemHash: string;
  program: PipelineProgram | PipelineProgram[];
  country: PipelineCountry;
  exam: PipelineExamCode[];
  domain: string;
  subdomain: string;
  priorityWeight: 1 | 2 | 3 | 4 | 5;
  contentDomain?: PipelineContentDomain;
  model: string;
  generatedAt: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE H — Internal Linking Metadata
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage H output: cross-lesson and lesson↔question link maps.
 *
 * Linking strategy:
 *   - Same topicSlug → automatically linked (related lessons, bridged questions).
 *   - Same domain / bodySystem → suggested (not automatic).
 *   - Question → lesson link: question.topicSlug must match a lesson slug in the same pathwayId.
 *   - Lesson → question bridge: maps to rn-nclex-lesson-question-bank-bridge.ts pattern.
 *
 * Maps to:
 *   - PathwayLesson.sections (relatedLessonRefs in section body)
 *   - NormalizedLesson.relatedLessonSlugs
 *   - lesson-question-cross-links.ts
 */
export interface StageInternalLinking extends PipelineStageEnvelope {
  stage: "internal_linking";
  lessonLinks: LessonLinkEntry[];
  questionLessonBridges: QuestionLessonBridge[];
  summary: {
    lessonLinksTotal: number;
    bridgesTotal: number;
    orphanedLessons: string[];
    orphanedQuestions: string[];
  };
}

export interface LessonLinkEntry {
  pipelineId: string;
  slug: string;
  topicSlug: string;
  pathwayId: string;
  /** Confirmed related slugs (same topicSlug or authored cross-link). */
  relatedLessonSlugs: string[];
  /** Suggested slugs from same domain/bodySystem (pending human review). */
  suggestedRelatedSlugs: string[];
  /** Blueprint topic entry this lesson maps to. */
  blueprintTopicSlug: string;
}

export interface QuestionLessonBridge {
  questionPipelineId: string;
  questionTopicSlug: string;
  /** Lesson slug(s) this question is associated with. */
  linkedLessonSlugs: string[];
  /** pathwayId shared by the question and its linked lessons. */
  pathwayId: string;
  /** Confidence of the bridge: "exact" (same slug), "topic" (same topicSlug), "inferred". */
  bridgeConfidence: "exact" | "topic" | "inferred";
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE I — Prisma Import Formatting
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage I output: DB-ready upsert payloads for Prisma.
 *
 * Maps directly to:
 *   - pathway_lessons (PathwayLesson) — primary lesson target
 *   - exam_questions (ExamQuestion)
 *   - content_items (ContentItem) — optional; for study guide / blog style
 *
 * Import scripts:
 *   - seed-pathway-lessons-from-catalog.ts
 *   - import-allied-pathway-lessons-batched.ts
 *   - apply-materialized-rn-pn-batch.ts
 *
 * Safeguard: Each payload includes a `upsertKey` and `conflictStrategy`:
 *   "skip"   — do not overwrite if key exists.
 *   "update" — overwrite non-protected fields.
 *   "error"  — hard-fail if key exists (use for high-confidence net-new imports).
 *
 * Protected fields (never overwritten on update):
 *   - PathwayLesson: none by default (all fields from pipeline are canonical).
 *   - ExamQuestion: stemHash, correctAnswer (require explicit human unlock).
 */
export interface StagePrismaImport extends PipelineStageEnvelope {
  stage: "prisma_import";
  pathwayLessonUpserts: PathwayLessonUpsert[];
  examQuestionUpserts: ExamQuestionUpsert[];
  summary: {
    pathwayLessonsTotal: number;
    examQuestionsTotal: number;
    byConflictStrategy: {
      skip: number;
      update: number;
      error: number;
    };
  };
}

/** DB-ready upsert payload for pathway_lessons. */
export interface PathwayLessonUpsert {
  pipelineId: string;
  /**
   * Prisma upsert key: { pathwayId, slug, locale }.
   * Matches @@unique([pathwayId, slug, locale]) constraint.
   */
  upsertKey: { pathwayId: string; slug: string; locale: string };
  conflictStrategy: "skip" | "update" | "error";
  data: {
    pathwayId: string;
    slug: string;
    title: string;
    topic: string;
    topicSlug: string;
    bodySystem: string;
    seoTitle: string;
    seoDescription: string;
    sections: LessonDraftSection[];
    previewSectionCount: number;
    countryCode: "US" | "CA" | null;
    tierCode: "FREE" | "BASIC" | "PREMIUM" | "PRO" | null;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    sortOrder: number;
    locale: string;
    /** ISO-8601 for createdAt/updatedAt — Prisma will set; include for audit. */
    generatedAt: string;
  };
}

/** DB-ready upsert payload for exam_questions. */
export interface ExamQuestionUpsert {
  pipelineId: string;
  /**
   * Prisma upsert key: { stemHash }.
   * stemHash is unique by convention; add DB unique index if not present.
   */
  upsertKey: { stemHash: string };
  conflictStrategy: "skip" | "update" | "error";
  data: {
    tier: string;
    exam: string;
    questionType: string;
    status: "draft" | "published";
    stem: string;
    options: Array<{ label: string; text: string }> | string[];
    correctAnswer: string | string[];
    rationale: string;
    distractorRationales?: Record<string, string>;
    difficulty: number;
    discrimination?: number;
    tags: string[];
    bodySystem: string;
    topic: string;
    subtopic?: string;
    regionScope: string;
    stemHash: string;
    careerType: string;
    scenario?: string;
    clinicalPearl?: string;
    examStrategy?: string;
    memoryHook?: string;
    frameworkUsed?: string;
    clinicalTrap?: string;
    qualityScores?: Record<string, number>;
    countryCode?: string;
    regionCode?: string;
    licensingBody?: string;
    languageCode: string;
    cognitiveLevel?: string;
    questionFormat?: string;
    isScenario: boolean;
    isMockExamEligible: boolean;
    isAdaptiveEligible: boolean;
    isFlashcardSource: boolean;
    isStudyGuideLinked: boolean;
    isTutorReady: boolean;
    correctAnswerExplanation?: string;
    incorrectAnswerRationale?: Record<string, string>;
    clinicalReasoning?: string;
    keyTakeaway?: string;
    mnemonic?: string;
    labUnitVariant?: string;
    medicationNamingVariant?: string;
    caseContext?: string;
    vitals?: Record<string, unknown>;
    labs?: Record<string, unknown>;
    blueprintWeight?: number;
    nclexClientNeedsCategory?: string;
    nclexClientNeedsSubcategory?: string;
    sourceVersion: number;
    generatedAt: string;
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// STAGE J — Coverage Report
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Stage J output: blueprint gap analysis against DB state + this run's output.
 *
 * Coverage metrics:
 *   - Actual lesson count vs lessonTargetCount per topic.
 *   - Actual question count vs questionTargetCount per topic.
 *   - Priority-weight-adjusted coverage score (high-weight gaps penalized more).
 *   - Program × bodySystem cross-tabulation.
 *   - Region coverage: US-only, CA-only, both.
 *
 * Scripts: report-lesson-blueprint-coverage.ts, report-exam-blueprint-coverage.ts
 */
export interface StageCoverageReport extends PipelineStageEnvelope {
  stage: "coverage_report";
  /** ISO date of DB snapshot used. */
  dbSnapshotDate: string;
  topics: TopicCoverageEntry[];
  programSummary: ProgramCoverageSummary[];
  overallScore: {
    /** 0–100 weighted coverage score. */
    weightedScore: number;
    lessonsAtTarget: number;
    lessonsBelowTarget: number;
    questionsAtTarget: number;
    questionsBelowTarget: number;
    criticalGaps: TopicCoverageEntry[];
  };
}

export interface TopicCoverageEntry {
  topicSlug: string;
  topic: string;
  program: PipelineProgram | PipelineProgram[];
  domain: string;
  subdomain: string;
  bodySystem: PipelineBodySystem;
  priorityWeight: 1 | 2 | 3 | 4 | 5;
  country: PipelineCountry;
  exam: PipelineExamCode[];

  // ── Lesson coverage ────────────────────────────────────────────────────────

  lessonTarget: number;
  lessonCountDb: number;
  lessonCountThisRun: number;
  lessonTotal: number;
  lessonGap: number;
  lessonCoverageStatus: "at_target" | "below_target" | "over_target";

  // ── Question coverage ──────────────────────────────────────────────────────

  questionTarget: number;
  questionCountDb: number;
  questionCountThisRun: number;
  questionTotal: number;
  questionGap: number;
  questionCoverageStatus: "at_target" | "below_target" | "over_target";

  // ── Quality flags ──────────────────────────────────────────────────────────

  hasNclexMapping: boolean;
  hasRegionCoverage: { us: boolean; ca: boolean };
  hasDifficultySpread: boolean;
}

export interface ProgramCoverageSummary {
  program: PipelineProgram;
  totalTopics: number;
  topicsAtLessonTarget: number;
  topicsAtQuestionTarget: number;
  weightedLessonScore: number;
  weightedQuestionScore: number;
  criticalGapTopicSlugs: string[];
}

// ══════════════════════════════════════════════════════════════════════════════
// Pipeline Run Config (cross-stage)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Top-level run configuration consumed by all pipeline stage executors.
 *
 * Write to: data/pipeline/pipeline-config.json
 */
export interface PipelineRunConfig {
  schemaVersion: 1;
  runId: string;
  programs: PipelineProgram[];
  country: PipelineCountry;
  blueprintPaths: Partial<Record<PipelineProgram, string>>;
  outputDir: string;
  /** How many topics to process per batch before checkpoint. Default: 10. */
  batchSize: number;
  /** Re-generate topics already at target count. Default: false. */
  forceRegenerate: boolean;
  /** Stage execution order. Run in this exact sequence. */
  stageOrder: Array<PipelineStageEnvelope["stage"]>;
  /** Stages to skip in this run. */
  skipStages?: Array<PipelineStageEnvelope["stage"]>;
  /** AI model name for generation stages (C, D). */
  generationModel: string;
  /** Max concurrent AI requests. Keep ≤ 5 to avoid rate limits. */
  generationConcurrency: number;
  /** Minimum similarity score (0–1) to flag near-duplicate lessons. */
  lessonSimilarityThreshold: number;
  /** Minimum similarity score (0–1) to flag near-duplicate questions. */
  questionSimilarityThreshold: number;
  /** Conflict strategy for Prisma upserts. */
  defaultConflictStrategy: "skip" | "update" | "error";
  failureMode: "halt" | "continue";
  runNote?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// Failure Safeguards (runtime contract)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Failure safeguards enforced by pipeline stage executors.
 *
 * These are runtime contracts; the schema types above define structure,
 * but executor scripts must also enforce:
 *
 *   1. CHECKPOINT BEFORE WRITE
 *      Each stage writes a checkpoint file (<runId>-<stage>-checkpoint.json)
 *      before mutating any DB rows or overwriting output files.
 *      A crashed run can resume from the last checkpoint.
 *
 *   2. DRY-RUN MODE
 *      Pass `--dry-run` to any executor to validate output without writing.
 *      Dry-run produces the same stage JSON but skips Prisma imports.
 *
 *   3. BLUEPRINT LOCK
 *      The blueprint_design stage output is treated as immutable once published.
 *      Overwriting an existing blueprint file requires `--allow-blueprint-overwrite`
 *      flag and auto-archives the prior version.
 *
 *   4. TOPIC SLUG STABILITY
 *      TopicWorkItem.topicSlug must match an entry in the active BlueprintDocument.
 *      If not found → hard error; do not proceed to generation.
 *
 *   5. STEM HASH BEFORE INSERT
 *      ExamQuestion stemHash must be computed and unique before any insert.
 *      Duplicate stemHash → drop silently and record in dedup report.
 *
 *   6. CLINICAL SAFETY FLAG
 *      PathwayLesson.clinicalSafetyReview remains false on all AI-generated imports.
 *      Human reviewers must explicitly set it to true before lessons are published.
 *
 *   7. PAYWALL PRESERVATION
 *      tierCode and countryCode must be set per the blueprint topic before import.
 *      Executor must not default tierCode to "FREE" without explicit blueprint instruction.
 *
 *   8. BATCH SIZE LIMIT
 *      No single Prisma transaction should exceed 100 rows.
 *      Use chunked inserts aligned with batchSize in PipelineRunConfig.
 *
 *   9. N+1 PREVENTION
 *      Stage J (coverage_report) must use aggregation queries (COUNT, GROUP BY)
 *      not per-lesson hydration.
 *
 *  10. RPN/LPN REGION GUARD
 *      - rpn lessons → countryCode: "CA", examFamily must include "REx-PN".
 *      - lpn lessons → countryCode: "US", examFamily must include "NCLEX-PN".
 *      Violation → REGION_SCOPE_MISMATCH validation error; block import.
 */
export type PipelineFailureSafeguards = typeof PIPELINE_FAILURE_SAFEGUARDS;
export const PIPELINE_FAILURE_SAFEGUARDS = [
  "CHECKPOINT_BEFORE_WRITE",
  "DRY_RUN_MODE",
  "BLUEPRINT_LOCK",
  "TOPIC_SLUG_STABILITY",
  "STEM_HASH_BEFORE_INSERT",
  "CLINICAL_SAFETY_FLAG",
  "PAYWALL_PRESERVATION",
  "BATCH_SIZE_LIMIT",
  "NO_N_PLUS_ONE_HYDRATION",
  "RPN_LPN_REGION_GUARD",
] as const;

// ══════════════════════════════════════════════════════════════════════════════
// Execution Order
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Canonical stage execution order.
 *
 * Dependencies:
 *   A → B  (blueprint must exist before topic list)
 *   B → C  (topics must be queued before lesson generation)
 *   B → D  (topics must be queued before question generation)
 *   C,D → E  (both content types validated together)
 *   E → F  (only validated items are deduplicated)
 *   F → G  (only kept items are normalized)
 *   G → H  (only normalized items are linked)
 *   H → I  (only linked items are import-formatted)
 *   I → J  (coverage report runs after import payloads are known)
 *
 * C and D may run in parallel (no dependency between lesson and question generation).
 * J may run independently of I for status checks without a full run.
 */
export const PIPELINE_STAGE_ORDER: Array<PipelineStageEnvelope["stage"]> = [
  "blueprint_design",   // A — defines scope
  "topic_list",         // B — derives work queue
  "lesson_generation",  // C — generates lesson drafts (parallelizable with D)
  "question_generation",// D — generates question drafts (parallelizable with C)
  "validation",         // E — validates C + D outputs
  "deduplication",      // F — removes duplicates from E-valid items
  "normalization",      // G — coerces fields on F-kept items
  "internal_linking",   // H — computes cross-content links on G items
  "prisma_import",      // I — formats DB upserts from H-linked items
  "coverage_report",    // J — blueprint gap analysis against DB + I output
];

/** Stages that may run in parallel within a single pipeline execution. */
export const PIPELINE_PARALLEL_PAIRS: Array<[PipelineStageEnvelope["stage"], PipelineStageEnvelope["stage"]]> = [
  ["lesson_generation", "question_generation"],
];
