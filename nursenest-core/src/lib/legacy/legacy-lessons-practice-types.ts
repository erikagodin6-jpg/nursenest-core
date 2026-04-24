/**
 * JSON export shape for `scripts/legacy/*-legacy-lessons-and-practice.mts`.
 * Version 2 bundles pathway lessons (same rows as public-content v1) plus `exam_questions` recovery rows.
 */

import type {
  LegacyAuditReport,
  LegacyChangeLogEntry,
  LegacyFlashcardExportBundle,
  LegacyLessonExportRow,
  LegacyPipelineOptions,
  LegacyPublicContentExportV1,
} from "@/lib/legacy/legacy-public-content-types";

/** One legacy exam-question row targeting a marketing pathway; maps into `exam_questions`. */
export type LegacyExamQuestionExportRow = {
  /** Stable id from legacy DB — preferred match key when present */
  legacyId?: string;
  pathwayId: string;
  stem: string;
  /** Human-readable options (same order as legacy UI) */
  options: unknown[];
  /** Option label(s) matching `options` entries, or legacy letter keys resolved upstream */
  correctAnswer: unknown;
  /** `MCQ`, `SATA`, etc. */
  questionType: string;
  rationale?: string;
  topic?: string;
  bodySystem?: string;
  difficulty?: number;
  /** `draft` | `published` (lowercase in DB) */
  status?: string;
  legacyUrl?: string;
  /** When set, must still fall within pathway pool (`contentExamKeys` / registry exam) */
  exam?: string;
  /** When set, must match pathway tier ladder (e.g. rn, rpn) */
  tier?: string;
  /** Public / demo vs paid — maps to published vs draft when unset */
  access?: "public" | "demo" | "subscriber";
};

/** Optional curated practice test definitions from legacy (audit against DB session rows). */
export type LegacyPracticeTestExportRow = {
  legacyKey: string;
  title?: string;
  /** Legacy exam question ids this test referenced */
  questionLegacyIds: string[];
};

export type LegacyContentExportV2 = {
  version: 2;
  lessons?: LegacyLessonExportRow[];
  flashcards?: LegacyFlashcardExportBundle;
  questions?: LegacyExamQuestionExportRow[];
  practiceTests?: LegacyPracticeTestExportRow[];
};

export type LegacyLessonsPracticeAuditReport = {
  lessons: LegacyAuditReport;
  legacyQuestionsFound: number;
  currentQuestionsMatchedById: number;
  currentQuestionsMatchedByStemHash: number;
  currentQuestionsMissing: number;
  duplicateQuestionCandidatesInExport: number;
  questionsCrossScopeRejected: number;
  questionsByPathway: Record<string, number>;
  questionsByBodySystem: Record<string, number>;
  questionsByType: Record<string, number>;
  questionsByStatus: Record<string, number>;
  /** Export `practiceTests` rows with any unresolved legacy question ids */
  exportPracticeTestsWithMissingQuestions: number;
  /** DB `practice_tests` rows (bounded scan) with fewer than `minQuestionsResolved` linked `exam_questions` */
  dbPracticeTestsWithTooFewQuestions: number;
  dbPracticeTestsScanned: number;
};

export type LegacyLessonsPracticePipelineOptions = LegacyPipelineOptions & {
  overwriteRationale: boolean;
};

export type LegacyLessonsPracticeImportResult = {
  dryRun: boolean;
  changes: LegacyChangeLogEntry[];
  errors: string[];
  audit: LegacyLessonsPracticeAuditReport;
};

export function parseLegacyContentExportV2Json(text: string): LegacyContentExportV2 {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch (e) {
    throw new Error(`Invalid JSON: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!parsed || typeof parsed !== "object") throw new Error("Export root must be an object");
  const root = parsed as Record<string, unknown>;
  const ver = root.version;
  if (ver !== 2) throw new Error('Export "version" must be 2 for lessons+practice pipeline');
  const lessons = Array.isArray(root.lessons) ? (root.lessons as LegacyLessonExportRow[]) : [];
  const flashcards =
    root.flashcards && typeof root.flashcards === "object"
      ? (root.flashcards as LegacyFlashcardExportBundle)
      : undefined;
  const questions = Array.isArray(root.questions) ? (root.questions as LegacyExamQuestionExportRow[]) : [];
  const practiceTests = Array.isArray(root.practiceTests)
    ? (root.practiceTests as LegacyPracticeTestExportRow[])
    : [];
  return { version: 2, lessons, flashcards, questions, practiceTests };
}

/** Adapt v2 → v1 shape for the existing public-content lesson + flashcard pipeline. */
export function toLegacyPublicContentExportV1(v2: LegacyContentExportV2): LegacyPublicContentExportV1 {
  return {
    version: 1,
    lessons: v2.lessons ?? [],
    flashcards: v2.flashcards ?? {},
  };
}
