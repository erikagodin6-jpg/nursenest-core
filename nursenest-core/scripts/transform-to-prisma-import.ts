#!/usr/bin/env npx tsx
/**
 * transform-to-prisma-import.ts
 *
 * Stage I — Prisma Import Formatter
 *
 * Reads all generated content from data/phase2/ and data/blueprints/foundations/generated/
 * and data/pilots/foundations/, normalises every record to the exact field set required by
 * PathwayLesson and ExamQuestion, then writes Stage-I import JSON files to
 * data/pipeline/runs/<output-name>-prisma-import.json.
 *
 * Guarantees:
 *   - PathwayLesson.status  = "PUBLISHED"    (pipeline-config: status_pathway_lesson default_PUBLISHED)
 *   - ExamQuestion.status   = "published"    (publishable = true per user requirement)
 *   - NP content: countryCode = null (both US + CA), PathwayLesson.tierCode = "NP" (TierCode enum), ExamQuestion.tier = "premium"
 *   - Pre-nursing content: countryCode = null, PathwayLesson.tierCode = null (no enum value), ExamQuestion.tier = "basic"
 *   - regionScope = "BOTH" for all content that spans both countries
 *   - stemHash computed before every question insert
 *   - Batch size ≤ 100 rows per chunk (pipeline safeguard)
 *
 * Usage:
 *   # All sources → data/pipeline/runs/
 *   npx tsx scripts/transform-to-prisma-import.ts
 *
 *   # Single source directory
 *   npx tsx scripts/transform-to-prisma-import.ts --dir=data/phase2
 *
 *   # Dry-run (print counts only, do not write files)
 *   npx tsx scripts/transform-to-prisma-import.ts --dry-run
 */

import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { normalizeImportedQuestionShape } from "./stage-prisma-import-normalize";

// ─── Types (Stage I schema) ───────────────────────────────────────────────────

interface LessonSection {
  id: string;
  heading: string;
  kind: string;
  body: string;
}

interface PathwayLessonUpsert {
  pipelineId: string;
  upsertKey: { pathwayId: string; slug: string; locale: string };
  conflictStrategy: "skip" | "update";
  data: {
    pathwayId: string;
    slug: string;
    title: string;
    topic: string;
    topicSlug: string;
    bodySystem: string;
    seoTitle: string;
    seoDescription: string;
    sections: LessonSection[];
    previewSectionCount: number;
    countryCode: "US" | "CA" | null;
    tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    sortOrder: number;
    locale: string;
    generatedAt: string;
  };
}

interface ExamQuestionUpsert {
  pipelineId: string;
  upsertKey: { stemHash: string };
  conflictStrategy: "skip" | "update";
  data: {
    tier: string;
    exam: string;
    questionType: string;
    status: "published" | "draft";
    stem: string;
    options: Record<string, string> | string[];
    correctAnswer: string | string[];
    rationale: string;
    difficulty: number;
    tags: string[];
    bodySystem: string;
    topic: string | null;
    subtopic: string | null;
    regionScope: string;
    stemHash: string;
    careerType: string;
    countryCode: string | null;
    languageCode: string;
    cognitiveLevel: string | null;
    incorrectAnswerRationale: Record<string, string> | null;
    nclexClientNeedsCategory: string | null;
    isScenario: boolean;
    isMockExamEligible: boolean;
    isAdaptiveEligible: boolean;
    isFlashcardSource: boolean;
    isStudyGuideLinked: boolean;
    isTutorReady: boolean;
    publishedAt: string;
    sourceVersion: number;
    generatedAt: string;
  };
}

interface StagePrismaImport {
  schemaVersion: 1;
  stage: "prisma_import";
  runId: string;
  generatedAt: string;
  programs: string[];
  country: string;
  sourceFiles: string[];
  pathwayLessonUpserts: PathwayLessonUpsert[];
  examQuestionUpserts: ExamQuestionUpsert[];
  summary: {
    pathwayLessonsTotal: number;
    examQuestionsTotal: number;
    byConflictStrategy: { skip: number; update: number };
    byPathwayId: Record<string, number>;
    byExam: Record<string, number>;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GENERATED_AT = new Date().toISOString();
const DEFAULT_LOCALE = "en";

// Program → pathway/tier/country mapping
// tierCode maps to Prisma TierCode enum: RPN | LVN_LPN | RN | NP | ALLIED | null
const PROGRAM_MAP: Record<
  string,
  { pathwayId: string; exam: string; tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null; questionTier: string; countryCode: null | "US" | "CA"; programs: string[] }
> = {
  "np": {
    pathwayId: "aanp-fnp",
    exam: "AANP-FNP",
    tierCode: "NP",
    questionTier: "premium",
    countryCode: null,
    programs: ["np"],
  },
  "pre-nursing": {
    pathwayId: "pre-nursing",
    exam: "",
    tierCode: null,
    questionTier: "basic",
    countryCode: null,
    programs: ["pre-nursing"],
  },
  "foundations-pilot": {
    pathwayId: "pre-nursing",
    exam: "",
    tierCode: null,
    questionTier: "basic",
    countryCode: null,
    programs: ["pre-nursing"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeStemHash(stem: string): string {
  return createHash("sha256")
    .update(stem.trim().toLowerCase().replace(/\s+/g, " ").replace(/[^\w\s]/g, ""))
    .digest("hex")
    .slice(0, 32);
}

function kebab(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

// Canonical body-system inference from topic slug
const BODY_SYSTEM_MAP: Record<string, string> = {
  knee: "musculoskeletal",
  msk: "musculoskeletal",
  ortho: "musculoskeletal",
  uti: "genitourinary",
  urinary: "genitourinary",
  diabetes: "endocrine",
  t2dm: "endocrine",
  copd: "respiratory",
  pulmonary: "respiratory",
  asthma: "respiratory",
  smoking: "respiratory",
  headache: "neurological",
  neuro: "neurological",
  syncope: "neurological",
  hypertension: "cardiovascular",
  cardiac: "cardiovascular",
  heart: "cardiovascular",
  hiv: "infectious-disease",
  prep: "infectious-disease",
  infection: "infectious-disease",
  microbio: "infection-immunity",
  geriatric: "general",
  frailty: "general",
  deprescribing: "pharmacology",
  polypharmacy: "pharmacology",
  pharm: "pharmacology",
  psoriasis: "dermatology",
  dermatitis: "dermatology",
  skin: "dermatology",
  cancer: "hematology-oncology",
  anatomy: "general",
  dosage: "pharmacology",
  math: "pharmacology",
  fraction: "pharmacology",
  decimal: "pharmacology",
  measurement: "pharmacology",
  terminology: "general",
  direction: "general",
  positional: "general",
  "vital-signs": "vital-signs",
  deterioration: "clinical-deterioration",
  chemistry: "general",
  cell: "general",
  tissue: "general",
  transport: "general",
};

function inferBodySystem(topicSlug: string): string {
  const lower = topicSlug.toLowerCase();
  for (const [key, system] of Object.entries(BODY_SYSTEM_MAP)) {
    if (lower.includes(key)) return system;
  }
  return "general";
}

const BLOOM_MAP: Record<string, string> = {
  L1: "recall",
  L2: "application",
  L3: "analysis",
  "foundational-recall": "recall",
  "conceptual-understanding": "comprehension",
  "early-application": "application",
  easy: "recall",
  moderate: "comprehension",
  hard: "analysis",
};

const DIFFICULTY_NUM: Record<string, number> = {
  easy: 2,
  medium: 3,
  moderate: 3,
  hard: 4,
  expert: 5,
  "very_hard": 5,
  foundational: 1,
  "foundational-recall": 1,
  "conceptual-understanding": 2,
  "early-application": 3,
};

function normDifficulty(raw: unknown): number {
  if (typeof raw === "number") return Math.min(5, Math.max(1, Math.round(raw)));
  if (typeof raw === "string") return DIFFICULTY_NUM[raw.toLowerCase().trim()] ?? 3;
  return 3;
}

// ─── Lesson section builders ──────────────────────────────────────────────────

/** NP batch-01 shape: flat named fields under raw.lesson */
function sectionsFromNpBatch01(lessonData: Record<string, unknown>): LessonSection[] {
  const sections: LessonSection[] = [];
  function add(heading: string, body: unknown, kind: string) {
    if (!body) return;
    const text = typeof body === "string" ? body : JSON.stringify(body, null, 2);
    if (!text.trim()) return;
    sections.push({ id: kebab(heading), heading, kind, body: text });
  }
  // Map to canonical PathwayLessonSectionKind so the render pipeline resolves content correctly.
  // exam_tips takes priority over exam_relevance in the exam slot, so Red Flags renders there.
  // exam_relevance (Population Considerations) is stored in DB for future premium migration.
  add("Clinical Framing", lessonData.clinicalFraming, "clinical_meaning");
  add("Core Concepts & Differential", lessonData.coreConceptsAndDifferential, "core_concept");
  add("Management Approach", lessonData.managementApproach, "clinical_scenario");
  add("Red Flags & Escalation", lessonData.redFlagsEscalation, "exam_tips");
  add("Population Considerations", lessonData.populationConsiderations, "exam_relevance");
  add("Follow-Up & Monitoring", lessonData.followUpAndMonitoring, "takeaways");
  return sections;
}

/** NP batch-02 shape: conceptBlocks array */
function sectionsFromNpBatch02(lessonData: Record<string, unknown>): LessonSection[] {
  // Assign canonical PathwayLessonSectionKind by position so the render pipeline resolves content.
  // Slot order: clinical_meaning (0), core_concept (1), clinical_scenario (2), exam_tips (3),
  // exam_relevance (4+, stored but not rendered in standard 5-slot layout), takeaways (teaching notes).
  const CONCEPT_BLOCK_KINDS: string[] = [
    "clinical_meaning",
    "core_concept",
    "clinical_scenario",
    "exam_tips",
    "exam_relevance",
  ];
  const sections: LessonSection[] = [];
  if (lessonData.objectives) {
    // Objectives serve as the intro/clinical framing block
    sections.push({
      id: "learning-objectives",
      heading: "Learning Objectives",
      kind: "clinical_meaning",
      body: typeof lessonData.objectives === "string"
        ? lessonData.objectives
        : JSON.stringify(lessonData.objectives, null, 2),
    });
  }
  let blockIndex = lessonData.objectives ? 1 : 0;
  for (const block of (lessonData.conceptBlocks ?? []) as Array<{ blockTitle?: string; keyPoints?: unknown }>) {
    if (!block) continue;
    const heading = block.blockTitle ?? "Concept";
    const body = block.keyPoints;
    if (!body) continue;
    const kind = CONCEPT_BLOCK_KINDS[blockIndex] ?? "exam_relevance";
    sections.push({
      id: kebab(heading),
      heading,
      kind,
      body: typeof body === "string" ? body : JSON.stringify(body, null, 2),
    });
    blockIndex += 1;
  }
  if (lessonData.teachingNotes) {
    sections.push({
      id: "teaching-notes",
      heading: "Teaching Notes",
      kind: "takeaways",
      body: typeof lessonData.teachingNotes === "string"
        ? lessonData.teachingNotes
        : JSON.stringify(lessonData.teachingNotes, null, 2),
    });
  }
  return sections;
}

/** Foundations generated shape: structuredContent fields */
function sectionsFromFoundationsGenerated(sc: Record<string, unknown>): LessonSection[] {
  const sections: LessonSection[] = [];
  // Map to canonical PathwayLessonSectionKind. The 5 primary slots:
  //   clinical_meaning (Overview), core_concept (Mental Model), clinical_scenario (Step by Step),
  //   exam_tips (Common Mistakes — exam_tips > exam_relevance, so this slot renders), takeaways (Worked Example).
  // Remaining fields stored in DB with secondary kinds for future premium migration.
  function add(id: string, heading: string, body: unknown, kind: string) {
    if (!body) return;
    const text = typeof body === "string" ? body : JSON.stringify(body, null, 2);
    if (!text.trim()) return;
    sections.push({ id, heading, kind, body: text });
  }
  add("overview", "Overview", sc.overview, "clinical_meaning");
  add("mental-model", "Mental Model", sc.mentalModel, "core_concept");
  add("step-by-step", "Step by Step", sc.stepByStep, "clinical_scenario");
  add("common-mistakes", "Common Mistakes", sc.commonMistakes, "exam_tips");
  add("clinical-relevance", "Clinical Relevance", sc.clinicalRelevanceLight ?? sc.clinicalRelevance, "exam_relevance");
  add("worked-example", "Worked Example", sc.workedExample, "takeaways");
  add("why-it-matters", "Why It Matters", sc.whyItMatters, "intro");
  add("nursing-connection", "Nursing Connection", sc.nursingConnection, "clinical_application");
  add("exam-ready-summary", "Exam-Ready Summary", sc.examReadySummary, "core");
  add("practice-tip", "Practice Tip", sc.practiceTip, "exam_focus");
  return sections;
}

/** Pilot format (batch-01, batch-02, batch-03): conceptBlocks with heading+body */
function sectionsFromPilot(lesson: Record<string, unknown>): LessonSection[] {
  // Assign canonical kinds by position so the 5-slot render pipeline resolves content.
  const PILOT_BLOCK_KINDS: string[] = [
    "clinical_meaning",
    "core_concept",
    "clinical_scenario",
    "exam_tips",
    "exam_relevance",
  ];
  const sections: LessonSection[] = [];
  let idx = 0;
  for (const block of (lesson.conceptBlocks ?? []) as Array<{ heading?: string; body?: string }>) {
    if (!block?.body) continue;
    const heading = block.heading ?? "Concept";
    const kind = PILOT_BLOCK_KINDS[idx] ?? "exam_relevance";
    sections.push({ id: kebab(heading), heading, kind, body: block.body });
    idx += 1;
  }
  if (lesson.teachingNotes) {
    sections.push({
      id: "teaching-notes",
      heading: "Teaching Notes",
      kind: "takeaways",
      body: lesson.teachingNotes as string,
    });
  }
  return sections;
}

// ─── NP Phase2 batch-01 lessons ───────────────────────────────────────────────

interface NpBatch01RawLesson {
  topicSlug: string;
  topicName?: string;
  caseAxis?: string;
  clinicalPriority?: string;
  careComplexity?: string;
  populationTags?: string[];
  domain?: string;
  lesson?: Record<string, unknown>;
}

function transformNpBatch01Lesson(
  raw: NpBatch01RawLesson,
  pathwayId: string,
  batchId: string,
  sortOrder: number,
  tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null,
  countryCode: null | "US" | "CA",
): PathwayLessonUpsert {
  const lessonData = raw.lesson ?? {};
  const sections = lessonData.clinicalFraming
    ? sectionsFromNpBatch01(lessonData)
    : sectionsFromNpBatch02(lessonData);

  const slug = `${raw.topicSlug}--${batchId}`;
  const title = raw.topicName ?? raw.topicSlug.replace(/-+/g, " ");
  const seoTitle = truncate(`${title} | NP Clinical Review`, 70);
  const complexity = raw.careComplexity ?? "";
  const seoDescription = truncate(
    `Advanced NP clinical review: ${title}. ${complexity === "advanced"
      ? "Advanced prescribing, management, and decision-making for NP boards."
      : "Clinical reasoning and management for NP primary care practice."}`,
    160,
  );

  return {
    pipelineId: randomUUID(),
    upsertKey: { pathwayId, slug, locale: DEFAULT_LOCALE },
    conflictStrategy: "skip",
    data: {
      pathwayId,
      slug,
      title,
      topic: raw.topicSlug.replace(/-+/g, " "),
      topicSlug: raw.topicSlug,
      bodySystem: inferBodySystem(raw.topicSlug),
      seoTitle,
      seoDescription,
      sections,
      previewSectionCount: 1,
      countryCode,
      tierCode,
      status: "PUBLISHED",
      sortOrder,
      locale: DEFAULT_LOCALE,
      generatedAt: GENERATED_AT,
    },
  };
}

// ─── NP Phase2 batch-02 lessons (topics[].lessons[]) ─────────────────────────

interface NpBatch02RawLesson {
  lessonSlug?: string;
  lessonTitle?: string;
  topicSlug: string;
  topicName?: string;
  objectives?: unknown;
  conceptBlocks?: Array<{ blockTitle?: string; keyPoints?: unknown }>;
  teachingNotes?: unknown;
  _complexity?: string;
}

function transformNpBatch02Lesson(
  raw: NpBatch02RawLesson,
  pathwayId: string,
  batchId: string,
  sortOrder: number,
  tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null,
  countryCode: null | "US" | "CA",
): PathwayLessonUpsert {
  const lessonData: Record<string, unknown> = {
    objectives: raw.objectives,
    conceptBlocks: raw.conceptBlocks,
    teachingNotes: raw.teachingNotes,
  };
  const sections = sectionsFromNpBatch02(lessonData);
  const effectiveSlug = raw.lessonSlug ?? raw.topicSlug;
  const slug = `${effectiveSlug}--${batchId}`;
  const title = raw.lessonTitle ?? raw.topicName ?? raw.topicSlug.replace(/-+/g, " ");
  const seoTitle = truncate(`${title} | NP Clinical Review`, 70);
  const complexity = raw._complexity ?? "";
  const seoDescription = truncate(
    `NP advanced review: ${title}. ${complexity === "advanced"
      ? "Prescribing, management, and decision-making for NP boards."
      : "Clinical reasoning for NP primary care practice."}`,
    160,
  );

  return {
    pipelineId: randomUUID(),
    upsertKey: { pathwayId, slug, locale: DEFAULT_LOCALE },
    conflictStrategy: "skip",
    data: {
      pathwayId,
      slug,
      title,
      topic: raw.topicSlug.replace(/-+/g, " "),
      topicSlug: raw.topicSlug,
      bodySystem: inferBodySystem(raw.topicSlug),
      seoTitle,
      seoDescription,
      sections,
      previewSectionCount: 1,
      countryCode,
      tierCode,
      status: "PUBLISHED",
      sortOrder,
      locale: DEFAULT_LOCALE,
      generatedAt: GENERATED_AT,
    },
  };
}

// ─── Foundations generated lessons ───────────────────────────────────────────

interface FoundationsGeneratedLesson {
  title: string;
  structuredContent?: Record<string, unknown>;
  // pilot shapes also have conceptBlocks
  conceptBlocks?: Array<{ heading?: string; body?: string }>;
  teachingNotes?: string;
  lessonId?: string;
  objectives?: unknown;
}

interface FoundationsGeneratedTopic {
  topicSlug: string;
  topicName?: string;
  domain?: string;
  readinessWeight?: string;
  cognitiveLevel?: string;
  lessons?: FoundationsGeneratedLesson[];
}

function transformFoundationsLesson(
  lesson: FoundationsGeneratedLesson,
  topic: FoundationsGeneratedTopic,
  pathwayId: string,
  batchId: string,
  sortOrder: number,
  tierCode: "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED" | null,
  countryCode: null | "US" | "CA",
): PathwayLessonUpsert {
  const lessonSlug = lesson.lessonId
    ? kebab(lesson.lessonId)
    : `${topic.topicSlug}-${kebab(lesson.title).slice(0, 40)}`;
  const slug = `${lessonSlug}--${batchId}`;
  const title = lesson.title;
  const seoTitle = truncate(`${title} | Pre-Nursing Foundations`, 70);
  const seoDescription = truncate(
    `Pre-nursing foundational lesson: ${title}. Build core knowledge for nursing school success.`,
    160,
  );

  let sections: LessonSection[];
  if (lesson.structuredContent) {
    sections = sectionsFromFoundationsGenerated(lesson.structuredContent);
  } else if (lesson.conceptBlocks) {
    sections = sectionsFromPilot(lesson as Record<string, unknown>);
  } else {
    sections = [];
  }

  // Add objectives if present and not already in sections
  if (lesson.objectives && !sections.find((s) => s.id === "learning-objectives")) {
    sections.unshift({
      id: "learning-objectives",
      heading: "Learning Objectives",
      kind: "clinical_meaning",
      body: Array.isArray(lesson.objectives)
        ? JSON.stringify(lesson.objectives, null, 2)
        : String(lesson.objectives),
    });
  }

  return {
    pipelineId: randomUUID(),
    upsertKey: { pathwayId, slug, locale: DEFAULT_LOCALE },
    conflictStrategy: "skip",
    data: {
      pathwayId,
      slug,
      title,
      topic: topic.topicName ?? topic.topicSlug.replace(/-+/g, " "),
      topicSlug: topic.topicSlug,
      bodySystem: inferBodySystem(topic.topicSlug),
      seoTitle,
      seoDescription,
      sections,
      previewSectionCount: 1,
      countryCode,
      tierCode,
      status: "PUBLISHED",
      sortOrder,
      locale: DEFAULT_LOCALE,
      generatedAt: GENERATED_AT,
    },
  };
}

// ─── Question transformers ────────────────────────────────────────────────────

interface RawQuestion {
  id?: string;
  questionId?: string;
  topicSlug?: string;
  lessonSlug?: string;
  caseAxis?: string;
  clinicalPriority?: string;
  careComplexity?: string;
  cognitiveLayer?: string;
  difficulty?: string | number;
  stem: string;
  options: Record<string, string> | string[];
  correctAnswer: string | string[];
  rationale?: string;
  incorrectOptionExplanations?: Record<string, string>;
  keyConceptTested?: string;
  dispositionTag?: string | null;
  populationTags?: string[] | null;
  tags?: string[];
}

function transformQuestion(
  raw: RawQuestion,
  exam: string,
  tier: string,
  batchId: string,
  countryCode: null | "US" | "CA",
): ExamQuestionUpsert {
  const stem = raw.stem.trim();
  const stemHash = computeStemHash(stem);
  const normalizedQuestion = normalizeImportedQuestionShape(raw.options, raw.correctAnswer);

  const tags: string[] = [
    ...(raw.tags ?? []),
    ...(raw.clinicalPriority ? [raw.clinicalPriority] : []),
    ...(raw.careComplexity ? [raw.careComplexity] : []),
    ...(raw.dispositionTag ? [raw.dispositionTag] : []),
    ...(raw.populationTags ?? []),
    ...(raw.cognitiveLayer ? [raw.cognitiveLayer] : []),
    ...(raw.topicSlug ? [raw.topicSlug] : []),
    batchId,
  ]
    .filter(Boolean)
    .map((t) => t.toLowerCase())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  const cognitiveLevel =
    raw.cognitiveLayer ? (BLOOM_MAP[raw.cognitiveLayer] ?? null) : null;

  const nclexMap: Record<string, string> = {
    "high-risk": "safety-and-infection-control",
    core: "physiological-adaptation",
    "special-population": "health-promotion-and-maintenance",
    supporting: "basic-care-and-comfort",
  };
  const nclexClientNeedsCategory = raw.clinicalPriority
    ? (nclexMap[raw.clinicalPriority] ?? null)
    : null;

  return {
    pipelineId: randomUUID(),
    upsertKey: { stemHash },
    conflictStrategy: "skip",
    data: {
      tier,
      exam,
      questionType: "mcq",
      status: "published",
      stem,
      options: normalizedQuestion.options,
      correctAnswer: normalizedQuestion.correctAnswer,
      rationale: raw.rationale?.trim() ?? "",
      difficulty: normDifficulty(raw.difficulty),
      tags,
      bodySystem: inferBodySystem(raw.topicSlug ?? ""),
      topic: raw.topicSlug ?? null,
      subtopic: null,
      regionScope: countryCode === "US" ? "US" : countryCode === "CA" ? "CA" : "BOTH",
      stemHash,
      careerType: "nursing",
      countryCode,
      languageCode: "en",
      cognitiveLevel,
      incorrectAnswerRationale: raw.incorrectOptionExplanations ?? null,
      nclexClientNeedsCategory,
      isScenario: false,
      isMockExamEligible: true,
      isAdaptiveEligible: true,
      isFlashcardSource: false,
      isStudyGuideLinked: false,
      isTutorReady: false,
      publishedAt: GENERATED_AT,
      sourceVersion: 1,
      generatedAt: GENERATED_AT,
    },
  };
}

// ─── File processors ──────────────────────────────────────────────────────────

function processNpPhase2LessonsFile(
  filePath: string,
  programConfig: typeof PROGRAM_MAP["np"],
  sortOrderStart: number,
): { lessons: PathwayLessonUpsert[]; nextSortOrder: number } {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const batchId: string = raw.batchId ?? path.basename(filePath, ".json");
  const lessons: PathwayLessonUpsert[] = [];
  let sortOrder = sortOrderStart;

  // batch-01 shape: root.lessons[]
  if (Array.isArray(raw.lessons)) {
    for (const lesson of raw.lessons as NpBatch01RawLesson[]) {
      lessons.push(
        transformNpBatch01Lesson(
          lesson,
          programConfig.pathwayId,
          batchId,
          sortOrder++,
          programConfig.tierCode,
          programConfig.countryCode,
        ),
      );
    }
  }
  // batch-02 shape: root.topics[].lessons[]
  else if (Array.isArray(raw.topics)) {
    for (const topic of raw.topics as Array<{
      topicSlug: string;
      topicTitle?: string;
      complexity?: string;
      axisTags?: string[];
      lessons?: NpBatch02RawLesson[];
    }>) {
      for (const lesson of topic.lessons ?? []) {
        lessons.push(
          transformNpBatch02Lesson(
            { ...lesson, topicSlug: topic.topicSlug, topicName: topic.topicTitle, _complexity: topic.complexity },
            programConfig.pathwayId,
            batchId,
            sortOrder++,
            programConfig.tierCode,
            programConfig.countryCode,
          ),
        );
      }
    }
  }

  return { lessons, nextSortOrder: sortOrder };
}

function processNpPhase2QbankFile(
  filePath: string,
  programConfig: typeof PROGRAM_MAP["np"],
): ExamQuestionUpsert[] {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const batchId: string = raw.batchId ?? path.basename(filePath, ".json");
  const rawQuestions: RawQuestion[] = raw.questions ?? [];
  return rawQuestions.map((q) =>
    transformQuestion(q, programConfig.exam, programConfig.questionTier, batchId, programConfig.countryCode),
  );
}

function processFoundationsGeneratedFile(
  filePath: string,
  programConfig: typeof PROGRAM_MAP["pre-nursing"],
  batchId: string,
  sortOrderStart: number,
): { lessons: PathwayLessonUpsert[]; nextSortOrder: number } {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const lessons: PathwayLessonUpsert[] = [];
  let sortOrder = sortOrderStart;

  const topics: FoundationsGeneratedTopic[] = raw.topics ?? [];
  for (const topic of topics) {
    for (const lesson of topic.lessons ?? []) {
      lessons.push(
        transformFoundationsLesson(
          lesson,
          topic,
          programConfig.pathwayId,
          batchId,
          sortOrder++,
          programConfig.tierCode,
          programConfig.countryCode,
        ),
      );
    }
  }

  return { lessons, nextSortOrder: sortOrder };
}

function processPilotFile(
  filePath: string,
  programConfig: typeof PROGRAM_MAP["foundations-pilot"],
  batchId: string,
  sortOrderStart: number,
): { lessons: PathwayLessonUpsert[]; nextSortOrder: number } {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const lessons: PathwayLessonUpsert[] = [];
  let sortOrder = sortOrderStart;

  const topic: FoundationsGeneratedTopic = {
    topicSlug: raw.topicSlug ?? path.basename(filePath, ".json"),
    topicName: raw.topicName,
    domain: raw.domain,
  };

  for (const lesson of (raw.lessons ?? []) as FoundationsGeneratedLesson[]) {
    lessons.push(
      transformFoundationsLesson(
        lesson,
        topic,
        programConfig.pathwayId,
        batchId,
        sortOrder++,
        programConfig.tierCode,
        programConfig.countryCode,
      ),
    );
  }

  return { lessons, nextSortOrder: sortOrder };
}

// ─── Standalone lesson files (recognizing-clinical-deterioration, etc.) ───────

function processStandaloneLessonFile(
  filePath: string,
  programConfig: typeof PROGRAM_MAP["np"],
  sortOrderStart: number,
): { lessons: PathwayLessonUpsert[]; nextSortOrder: number } {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const batchId = path.basename(filePath, ".json");
  const lessons: PathwayLessonUpsert[] = [];
  let sortOrder = sortOrderStart;

  // These files may have a conceptBlocks array at root or under a "lesson" key
  const topicSlug: string = raw.topicSlug ?? batchId;
  const topicName: string = raw.topicName ?? raw.title ?? topicSlug.replace(/-+/g, " ");

  let sections: LessonSection[];
  if (Array.isArray(raw.conceptBlocks)) {
    sections = sectionsFromPilot(raw);
  } else if (raw.lesson) {
    sections = sectionsFromNpBatch01(raw.lesson);
  } else {
    sections = sectionsFromNpBatch02(raw);
  }

  if (sections.length === 0 && raw.content) {
    sections = [{ id: "content", heading: "Content", kind: "clinical_meaning", body: String(raw.content) }];
  }

  if (sections.length > 0) {
    const slug = `${topicSlug}--${batchId}`;
    const title = topicName;
    const seoTitle = truncate(`${title} | NP Clinical Review`, 70);
    const seoDescription = truncate(`NP clinical review: ${title}.`, 160);

    lessons.push({
      pipelineId: randomUUID(),
      upsertKey: { pathwayId: programConfig.pathwayId, slug, locale: DEFAULT_LOCALE },
      conflictStrategy: "skip",
      data: {
        pathwayId: programConfig.pathwayId,
        slug,
        title,
        topic: topicSlug.replace(/-+/g, " "),
        topicSlug,
        bodySystem: inferBodySystem(topicSlug),
        seoTitle,
        seoDescription,
        sections,
        previewSectionCount: 1,
        countryCode: programConfig.countryCode,
        tierCode: programConfig.tierCode,
        status: "PUBLISHED",
        sortOrder: sortOrder++,
        locale: DEFAULT_LOCALE,
        generatedAt: GENERATED_AT,
      },
    });
  }

  return { lessons, nextSortOrder: sortOrder };
}

// ─── Output writer ────────────────────────────────────────────────────────────

function writePrismaImport(
  outputPath: string,
  lessons: PathwayLessonUpsert[],
  questions: ExamQuestionUpsert[],
  sourceFiles: string[],
  programs: string[],
  dryRun: boolean,
): void {
  // Deduplicate lessons by upsert key
  const lessonKeySeen = new Set<string>();
  const dedupLessons = lessons.filter((l) => {
    const key = `${l.data.pathwayId}:${l.data.slug}:${l.data.locale}`;
    if (lessonKeySeen.has(key)) return false;
    lessonKeySeen.add(key);
    return true;
  });

  // Deduplicate questions by stemHash
  const hashSeen = new Set<string>();
  const dedupQuestions = questions.filter((q) => {
    if (hashSeen.has(q.data.stemHash)) return false;
    hashSeen.add(q.data.stemHash);
    return true;
  });

  const byPathwayId: Record<string, number> = {};
  for (const l of dedupLessons) {
    byPathwayId[l.data.pathwayId] = (byPathwayId[l.data.pathwayId] ?? 0) + 1;
  }

  const byExam: Record<string, number> = {};
  for (const q of dedupQuestions) {
    byExam[q.data.exam] = (byExam[q.data.exam] ?? 0) + 1;
  }

  const output: StagePrismaImport = {
    schemaVersion: 1,
    stage: "prisma_import",
    runId: randomUUID(),
    generatedAt: GENERATED_AT,
    programs,
    country: "both",
    sourceFiles: sourceFiles.map((f) => path.relative(process.cwd(), f)),
    pathwayLessonUpserts: dedupLessons,
    examQuestionUpserts: dedupQuestions,
    summary: {
      pathwayLessonsTotal: dedupLessons.length,
      examQuestionsTotal: dedupQuestions.length,
      byConflictStrategy: {
        skip: dedupLessons.length + dedupQuestions.length,
        update: 0,
      },
      byPathwayId,
      byExam,
    },
  };

  if (dryRun) {
    process.stdout.write(
      `[DRY-RUN] ${path.basename(outputPath)}: ${dedupLessons.length} lessons, ${dedupQuestions.length} questions\n`,
    );
    return;
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");
  process.stdout.write(
    `[WRITTEN] ${outputPath}\n  lessons: ${dedupLessons.length}  questions: ${dedupQuestions.length}\n`,
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const dirArg = argv.find((a) => a.startsWith("--dir="))?.slice("--dir=".length);

  const repoRoot = path.resolve(__dirname, "..");
  const outputDir = path.join(repoRoot, "data", "pipeline", "runs");
  const npPhase2Dir = path.join(repoRoot, "data", "phase2");
  const foundationsGenDir = path.join(repoRoot, "data", "blueprints", "foundations", "generated");
  const pilotsFoundationsDir = path.join(repoRoot, "data", "pilots", "foundations");

  process.stdout.write(`
NurseNest Prisma Import Transformer (Stage I)
  dry-run : ${dryRun}
  output  : ${outputDir}
`);

  // ── NP Phase2 ─────────────────────────────────────────────────────────────

  if (!dirArg || dirArg.includes("phase2")) {
    const npConfig = PROGRAM_MAP["np"];
    const allNpLessons: PathwayLessonUpsert[] = [];
    const allNpQuestions: ExamQuestionUpsert[] = [];
    const npSourceFiles: string[] = [];
    let sortOrder = 1000;

    const phase2Files = fs.readdirSync(npPhase2Dir).map((f) => path.join(npPhase2Dir, f));
    const lessonFiles = phase2Files.filter((f) => f.endsWith("-lessons.json"));
    const qbankFiles = phase2Files.filter((f) => f.endsWith("-qbank.json"));

    // Standalone lesson files (not following -lessons.json convention)
    const standaloneFiles = phase2Files.filter(
      (f) =>
        f.endsWith(".json") &&
        !f.endsWith("-lessons.json") &&
        !f.endsWith("-qbank.json") &&
        !f.endsWith("-report.json"),
    );

    for (const f of lessonFiles) {
      npSourceFiles.push(f);
      const result = processNpPhase2LessonsFile(f, npConfig, sortOrder);
      allNpLessons.push(...result.lessons);
      sortOrder = result.nextSortOrder;
    }

    for (const f of standaloneFiles) {
      npSourceFiles.push(f);
      const result = processStandaloneLessonFile(f, npConfig, sortOrder);
      allNpLessons.push(...result.lessons);
      sortOrder = result.nextSortOrder;
    }

    for (const f of qbankFiles) {
      npSourceFiles.push(f);
      allNpQuestions.push(...processNpPhase2QbankFile(f, npConfig));
    }

    writePrismaImport(
      path.join(outputDir, "np-phase2-prisma-import.json"),
      allNpLessons,
      allNpQuestions,
      npSourceFiles,
      ["np"],
      dryRun,
    );
  }

  // ── Pre-nursing Foundations (generated) ───────────────────────────────────

  if (!dirArg || dirArg.includes("foundations")) {
    const foundConfig = PROGRAM_MAP["pre-nursing"];
    const allFoundLessons: PathwayLessonUpsert[] = [];
    const foundSourceFiles: string[] = [];
    let foundSortOrder = 100;

    if (fs.existsSync(foundationsGenDir)) {
      const genFiles = fs
        .readdirSync(foundationsGenDir)
        .filter((f) => f.endsWith(".json"))
        .map((f) => path.join(foundationsGenDir, f));

      for (const f of genFiles) {
        foundSourceFiles.push(f);
        const batchId = path.basename(f, ".json").replace("pre-nursing-", "").replace("-batch-", "-b");
        const result = processFoundationsGeneratedFile(f, foundConfig, batchId, foundSortOrder);
        allFoundLessons.push(...result.lessons);
        foundSortOrder = result.nextSortOrder;
      }
    }

    // Pilot files
    if (fs.existsSync(pilotsFoundationsDir)) {
      const batchDirs = fs
        .readdirSync(pilotsFoundationsDir)
        .filter((d) => d.startsWith("batch-") && fs.statSync(path.join(pilotsFoundationsDir, d)).isDirectory());

      for (const batchDir of batchDirs) {
        const batchPath = path.join(pilotsFoundationsDir, batchDir);
        const pilotFiles = fs
          .readdirSync(batchPath)
          .filter((f) => f.endsWith(".json"))
          .map((f) => path.join(batchPath, f));

        for (const f of pilotFiles) {
          if (f.includes("report") || f.includes("overlap")) continue;
          foundSourceFiles.push(f);
          const result = processPilotFile(f, foundConfig, `foundations-${batchDir}`, foundSortOrder);
          allFoundLessons.push(...result.lessons);
          foundSortOrder = result.nextSortOrder;
        }
      }
    }

    if (allFoundLessons.length > 0 || foundSourceFiles.length > 0) {
      writePrismaImport(
        path.join(outputDir, "pre-nursing-foundations-prisma-import.json"),
        allFoundLessons,
        [],
        foundSourceFiles,
        ["pre-nursing"],
        dryRun,
      );
    }
  }

  process.stdout.write("\nDone.\n");
}

main();
