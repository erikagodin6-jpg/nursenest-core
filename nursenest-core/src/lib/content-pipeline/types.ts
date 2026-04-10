/**
 * Shared types for the NurseNest content generation pipeline.
 *
 * Lessons  → PathwayLesson schema (pathwayId + slug + locale = unique)
 * Questions → ExamQuestion schema (stemHash = dedup key)
 *
 * Batch output is Prisma-importable: strip `_meta` fields before `createMany`.
 */

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export type PipelineExamCode = "RN" | "RPN" | "LPN" | "NP" | "Allied";
export type PipelineCountry = "US" | "CA";
export type PipelineDifficulty = "easy" | "medium" | "hard";

export type TopicSpec = {
  /** Kebab-case stable identifier, matches PathwayLesson.topicSlug. */
  topicSlug: string;
  /** Human-readable label used in AI prompts. */
  topicLabel: string;
  /**
   * Body system / organ system label (e.g. "cardiovascular", "respiratory").
   * Stored in PathwayLesson.bodySystem and ExamQuestion.bodySystem.
   */
  bodySystem: string;
  /** Classification tags (e.g. ["pharmacology", "priority-setting"]). */
  tags: string[];
  difficulty: PipelineDifficulty;
  /** Override the batch-level exam code for this topic. */
  exam?: PipelineExamCode;
  /** Override the batch-level country for this topic. */
  country?: PipelineCountry;
  /** How many exam questions to generate for this topic. Default 5. */
  questionCount?: number;
};

export type ContentBatchInput = {
  /** PathwayLesson.pathwayId — must match the pathway registry (e.g. "rn-us"). */
  pathwayId: string;
  /** BCP-47 locale tag. Default "en". */
  locale?: string;
  /** Default exam scope applied to every topic unless overridden. */
  exam: PipelineExamCode;
  /** Default country context. */
  country: PipelineCountry;
  /** When false (default), topics with existing slug+pathwayId or stemHash are skipped. */
  allowDuplicates?: boolean;
  topics: TopicSpec[];
};

// ---------------------------------------------------------------------------
// Lesson output (PathwayLesson-shaped)
// ---------------------------------------------------------------------------

export type LessonSectionKind =
  | "overview"
  | "pathophysiology"
  | "assessment"
  | "interventions"
  | "exam_tips";

export type GeneratedLessonSection = {
  /** Stable section id — used by the renderer (e.g. "section-overview"). */
  id: string;
  heading: string;
  kind: LessonSectionKind;
  /** HTML-safe teaching content (paragraphs, bullet lists). No <script>. */
  body: string;
};

export type GeneratedPathwayLesson = {
  // ── Core fields (required by Prisma @@unique and NOT NULL) ──────────────
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  /** Array of { id, heading, kind, body } — five canonical sections. */
  sections: GeneratedLessonSection[];
  status: "DRAFT";
  sortOrder: number;
  previewSectionCount: number;
  // ── Optional scope overrides ─────────────────────────────────────────────
  tierCode: string | null;
  countryCode: string | null;
  // ── Pipeline metadata (strip before prisma.pathwayLesson.createMany) ─────
  _meta: {
    /** Hash used for dedup — SHA-256 of pathwayId|topicSlug|locale. */
    dedupeKey: string;
    difficulty: PipelineDifficulty;
    tags: string[];
    exam: PipelineExamCode;
    country: PipelineCountry;
    /** AI-suggested internal link targets for post-import linking. */
    internalLinkHints: Array<{ label: string; suggestedPath: string; rationale: string }>;
  };
};

// ---------------------------------------------------------------------------
// Question output (ExamQuestion-shaped)
// ---------------------------------------------------------------------------

export type CognitiveLevel = "remember" | "understand" | "apply" | "analyze";

export type GeneratedExamQuestion = {
  // ── Core identifiers ─────────────────────────────────────────────────────
  tier: string;
  exam: string;
  questionType: "MCQ" | "SATA";
  status: "draft";
  // ── Question content ─────────────────────────────────────────────────────
  stem: string;
  /**
   * Answer choices as plain strings (4 for MCQ, 5 for SATA).
   * Stored as JSON in ExamQuestion.options.
   */
  options: string[];
  /**
   * For MCQ: index of correct option (0-based, as string for JSON compat).
   * For SATA: array of correct indices.
   * Stored in ExamQuestion.correctAnswer.
   */
  correctAnswer: string | string[];
  /** Step-by-step rationale (≥90 words). Maps to ExamQuestion.rationale. */
  rationale: string;
  /** Per-option wrong-answer explanations. Maps to ExamQuestion.distractorRationales. */
  distractorRationales: Record<string, string>;
  // ── Teaching enrichment ─────────────────────────────────────────────────
  clinicalPearl: string | null;
  keyTakeaway: string | null;
  examStrategy: string | null;
  cognitiveLevel: CognitiveLevel;
  // ── Classification ───────────────────────────────────────────────────────
  /** 1=easiest … 5=hardest. Maps to ExamQuestion.difficulty. */
  difficulty: number;
  tags: string[];
  bodySystem: string;
  topic: string;
  /** Must match TopicSpec.topicSlug. */
  topicSlug: string;
  countryCode: string;
  regionScope: "US" | "CA" | "BOTH";
  // ── Dedup / lineage ──────────────────────────────────────────────────────
  /** Deterministic hash of the normalized stem — ExamQuestion.stemHash. */
  stemHash: string;
  careerType: "nursing";
  // ── Eligibility flags ────────────────────────────────────────────────────
  isAdaptiveEligible: boolean;
  isMockExamEligible: boolean;
  languageCode: "en";
  sourceVersion: number;
};

// ---------------------------------------------------------------------------
// Batch output (Prisma-importable)
// ---------------------------------------------------------------------------

export type ContentBatchOutput = {
  generatedAt: string;
  input: {
    pathwayId: string;
    exam: string;
    country: string;
    topicCount: number;
  };
  stats: {
    lessonsGenerated: number;
    lessonsDuplicateSkipped: number;
    questionsGenerated: number;
    questionsDuplicateSkipped: number;
    errors: number;
  };
  /**
   * PathwayLesson rows ready for:
   *   `prisma.pathwayLesson.createMany({ data: pathwayLessons.map(stripMeta) })`
   *
   * `_meta` must be removed before insertion — it is pipeline-only.
   */
  pathwayLessons: GeneratedPathwayLesson[];
  /**
   * ExamQuestion rows ready for:
   *   `prisma.examQuestion.createMany({ data: examQuestions })`
   */
  examQuestions: GeneratedExamQuestion[];
  errors: Array<{
    topicSlug: string;
    type: "lesson" | "question";
    message: string;
  }>;
};
