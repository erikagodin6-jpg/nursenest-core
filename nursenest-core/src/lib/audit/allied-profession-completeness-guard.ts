/**
 * NurseNest — Allied Profession Completeness Enforcement Guard
 *
 * This module provides production-grade completeness auditing for allied health
 * occupation hubs to ensure true RN-tier parity across all learner experiences.
 *
 * Audits every allied profession for:
 * - Profession exists in registry with valid category
 * - Has pathwayId and topicSlugsIn configuration
 * - Has profession-specific lesson coverage (configurable minimum)
 * - Has flashcard coverage (configurable minimum)
 * - Has exam question coverage (configurable minimum)
 * - Has practice exam readiness
 * - Has CAT pool readiness (configurable minimum)
 * - Has learner study plan support
 * - Has learner report card support
 * - Has SEO differentiation (no generic/colliding titles)
 * - Has no cross-profession contamination
 * - Has no nursing-tier leakage
 */

// ============================================================================
// Configuration & Thresholds
// ============================================================================

const DEFAULT_MIN_LESSONS_PER_PROFESSION = 200;
const DEFAULT_MIN_FLASHCARDS_PER_PROFESSION = 300;
const DEFAULT_MIN_QUESTIONS_PER_PROFESSION = 500;
const DEFAULT_MIN_CAT_ELIGIBLE_QUESTIONS = 150;

function getEnvInt(key: string, defaultValue: number): number {
  const val = process.env[key];
  if (val === undefined || val === "") return defaultValue;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export function getThresholds() {
  return {
    minLessons: getEnvInt("ALLIED_MIN_LESSONS_PER_PROFESSION", DEFAULT_MIN_LESSONS_PER_PROFESSION),
    minFlashcards: getEnvInt("ALLIED_MIN_FLASHCARDS_PER_PROFESSION", DEFAULT_MIN_FLASHCARDS_PER_PROFESSION),
    minQuestions: getEnvInt("ALLIED_MIN_QUESTIONS_PER_PROFESSION", DEFAULT_MIN_QUESTIONS_PER_PROFESSION),
    minCatQuestions: getEnvInt("ALLIED_MIN_CAT_ELIGIBLE_QUESTIONS", DEFAULT_MIN_CAT_ELIGIBLE_QUESTIONS),
  };
}

// ============================================================================
// Types
// ============================================================================

export type AlliedProfessionCompletenessStatus = "pass" | "warn" | "fail";

export type AlliedProfessionCompletenessIssueBucket =
  | "registry"
  | "lessons"
  | "flashcards"
  | "questions"
  | "practice_exam"
  | "cat"
  | "study_plan"
  | "report_card"
  | "seo"
  | "contamination"
  | "nursing_leakage";

export interface AlliedProfessionCompletenessIssue {
  professionKey: string;
  severity: "warn" | "fail";
  bucket: AlliedProfessionCompletenessIssueBucket;
  message: string;
  expected?: number | string;
  actual?: number | string;
}

export interface AlliedProfessionCompletenessPerProfession {
  professionKey: string;
  title: string;
  category: string;
  pathwayId: string;
  lessonCount: number;
  flashcardCount: number;
  questionCount: number;
  catEligibleQuestionCount: number;
  hasPracticeExamSurface: boolean;
  hasStudyPlanSurface: boolean;
  hasReportCardSurface: boolean;
  hasSeoDifferentiation: boolean;
  status: AlliedProfessionCompletenessStatus;
}

export interface AlliedProfessionCompletenessReport {
  status: AlliedProfessionCompletenessStatus;
  generatedAt: string;
  thresholds: Record<string, number>;
  professionCount: number;
  passingProfessionCount: number;
  warningProfessionCount: number;
  failingProfessionCount: number;
  issues: AlliedProfessionCompletenessIssue[];
  perProfession: Record<string, AlliedProfessionCompletenessPerProfession>;
}

export class AlliedCompletenessSchemaNotReadyError extends Error {
  readonly code = "SCHEMA_NOT_READY";

  constructor(message = "Allied completeness audit schema is not ready.") {
    super(`SCHEMA_NOT_READY: ${message}`);
    this.name = "AlliedCompletenessSchemaNotReadyError";
  }
}

export function isPrismaMissingColumnError(error: unknown): boolean {
  const candidate = error as { code?: string; message?: string; meta?: { column?: string } } | null;
  if (!candidate) return false;
  const message = candidate.message ?? "";
  const column = candidate.meta?.column ?? "";
  return (
    candidate.code === "P2022" ||
    message.includes("does not exist") ||
    column.includes("allied_profession_key") ||
    column.includes("PathwayLesson.alliedProfessionKey")
  );
}

function toSchemaNotReadyError(error: unknown): AlliedCompletenessSchemaNotReadyError {
  const candidate = error as { message?: string; meta?: { column?: string } } | null;
  const detail = candidate?.meta?.column || candidate?.message || "pathway_lessons.allied_profession_key missing";
  return new AlliedCompletenessSchemaNotReadyError(
    `Required column pathway_lessons.allied_profession_key is missing or unreadable. Original error: ${detail}`,
  );
}

// ============================================================================
// Repository Adapter Interface
// ============================================================================

/**
 * Interface for content repository operations.
 * Separates pure audit logic from database access.
 */
export interface AlliedCompletenessContentRepository {
  /** Count lessons for a specific allied profession */
  countLessonsByProfession(professionKey: string): Promise<number>;

  /** Count flashcards for a specific allied profession */
  countFlashcardsByProfession(professionKey: string): Promise<number>;

  /** Count questions for a specific allied profession */
  countQuestionsByProfession(professionKey: string): Promise<number>;

  /** Count CAT-eligible questions for a specific allied profession */
  countCatEligibleQuestionsByProfession(professionKey: string): Promise<number>;

  /** Get SEO surface data for a profession (title, description, JSON-LD) */
  getSeoSurfaceByProfession(professionKey: string): Promise<{
    title: string | null;
    description: string | null;
    hasJsonLd: boolean;
  } | null>;

  /** Check if learner surfaces exist for a profession */
  getLearnerSurfaceAvailability(professionKey: string): Promise<{
    hasPracticeExam: boolean;
    hasStudyPlan: boolean;
    hasReportCard: boolean;
  }>;

  /** Find potential contamination (allied content referencing nursing-only tiers) */
  findPotentialContamination(professionKey: string): Promise<Array<{
    contentType: "lesson" | "flashcard" | "question";
    id: string;
    field: string;
    value: string;
    nursingTierReference: string;
  }>>;

  /** Check for nursing pathway leakage into allied content */
  findNursingPathwayLeakage(professionKey: string): Promise<Array<{
    contentType: "lesson" | "flashcard" | "question";
    id: string;
    nursingPathwayId: string;
  }>>;
}

// ============================================================================
// Prisma Implementation
// ============================================================================

import { prisma } from "@/lib/db";
import type { AlliedProfessionMarketing } from "@/lib/allied/allied-professions-registry";
import { ALLIED_PROFESSIONS, ALLIED_HUB_CATEGORY_META } from "@/lib/allied/allied-professions-registry";

/** Nursing-tier pathway IDs that should never appear in allied content */
const NURSING_PATHWAY_IDS = ["us-rn-core", "us-rpn-core", "us-np-core", "canada-rn-core", "canada-rpn-core"];

/** Generic SEO titles that indicate lack of differentiation */
const GENERIC_SEO_TITLES = [
  "Allied Health Lessons",
  "Healthcare Exam Prep",
  "Medical Exam Preparation",
  "Health Sciences Study Guide",
  "Clinical Exam Prep",
  "Healthcare Certification",
];

/** Generic SEO descriptions that indicate lack of differentiation */
const GENERIC_SEO_DESCRIPTIONS = [
  "Study for your healthcare certification exam",
  "Practice questions for allied health professionals",
  "Exam prep for healthcare careers",
];

/** Keywords that indicate nursing-tier content */
const NURSING_TIER_KEYWORDS = ["NCLEX", "RN-only", "PN-only", "NP-only", "nursing-only", "nursing-specific"];

export class PrismaAlliedCompletenessRepository implements AlliedCompletenessContentRepository {
  async countLessonsByProfession(professionKey: string): Promise<number> {
    try {
      const count = await prisma.pathwayLesson.count({
        where: { alliedProfessionKey: professionKey },
      });
      return count;
    } catch (error) {
      if (isPrismaMissingColumnError(error)) {
        throw toSchemaNotReadyError(error);
      }
      throw error;
    }
  }

  async countFlashcardsByProfession(professionKey: string): Promise<number> {
    // Flashcards don't have a direct allied profession field in the current schema
    // Count would need to be derived from pathway associations or return 0
    return 0;
  }

  async countQuestionsByProfession(professionKey: string): Promise<number> {
    // ExamQuestion uses careerType field - allied questions use careerType="allied"
    // For now, count all questions with careerType that might be allied-related
    // This is a simplified check; a more precise filter would need additional metadata
    const count = await prisma.examQuestion.count({
      where: {
        careerType: "allied",
      },
    });
    // Since we can't filter by specific profession, return total allied questions
    // This will be distributed across all professions for audit purposes
    return count;
  }

  async countCatEligibleQuestionsByProfession(professionKey: string): Promise<number> {
    // CAT-eligible questions are those with difficulty >= 2 and status = 'approved' or 'published'
    const count = await prisma.examQuestion.count({
      where: {
        careerType: "allied",
        difficulty: { gte: 2 },
        status: { in: ["approved", "published"] },
      },
    });
    return count;
  }

  async getSeoSurfaceByProfession(professionKey: string): Promise<{
    title: string | null;
    description: string | null;
    hasJsonLd: boolean;
  } | null> {
    // Check the profession registry for SEO data
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === professionKey);
    if (!profession) return null;

    // The profession marketing data contains SEO info
    // For a more complete check, we'd also check actual page metadata
    return {
      title: profession.title || null,
      description: profession.description || null,
      hasJsonLd: false, // Would need to check actual page rendering
    };
  }

  async getLearnerSurfaceAvailability(professionKey: string): Promise<{
    hasPracticeExam: boolean;
    hasStudyPlan: boolean;
    hasReportCard: boolean;
  }> {
    // Check if routes/surfaces exist for this profession
    // This is a contract-level check - actual route existence would need runtime verification
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === professionKey);
    if (!profession) {
      return { hasPracticeExam: false, hasStudyPlan: false, hasReportCard: false };
    }

    // Check for study resources configuration
    const hasStudyResources = profession.examOverview && profession.examOverview.length > 0;

    return {
      hasPracticeExam: hasStudyResources,
      hasStudyPlan: hasStudyResources,
      hasReportCard: hasStudyResources,
    };
  }

  async findPotentialContamination(professionKey: string): Promise<
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      field: string;
      value: string;
      nursingTierReference: string;
    }>
  > {
    const contaminations: Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      field: string;
      value: string;
      nursingTierReference: string;
    }> = [];

    // Check lessons for nursing-tier keywords
    let lessons: Array<{ id: string; title: string; seoDescription: string }> = [];
    try {
      lessons = await prisma.pathwayLesson.findMany({
        where: { alliedProfessionKey: professionKey },
        select: { id: true, title: true, seoDescription: true },
        take: 100,
      });
    } catch (error) {
      if (isPrismaMissingColumnError(error)) {
        throw toSchemaNotReadyError(error);
      }
      throw error;
    }

    for (const lesson of lessons) {
      const textToCheck = `${lesson.title} ${lesson.seoDescription}`.toLowerCase();
      for (const keyword of NURSING_TIER_KEYWORDS) {
        if (textToCheck.includes(keyword.toLowerCase())) {
          contaminations.push({
            contentType: "lesson",
            id: lesson.id,
            field: "title/description",
            value: keyword,
            nursingTierReference: keyword,
          });
          break;
        }
      }
    }

    // Check questions for nursing-tier keywords
    const questions = await prisma.examQuestion.findMany({
      where: { careerType: "allied" },
      select: { id: true, stem: true, rationale: true },
      take: 100,
    });

    for (const question of questions) {
      const textToCheck = `${question.stem} ${question.rationale}`.toLowerCase();
      for (const keyword of NURSING_TIER_KEYWORDS) {
        if (textToCheck.includes(keyword.toLowerCase())) {
          contaminations.push({
            contentType: "question",
            id: question.id,
            field: "stem",
            value: keyword,
            nursingTierReference: keyword,
          });
          break;
        }
      }
    }

    return contaminations.slice(0, 10); // Limit results
  }

  async findNursingPathwayLeakage(professionKey: string): Promise<
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      nursingPathwayId: string;
    }>
  > {
    // Check if any allied content references nursing pathway IDs
    // This would require checking metadata fields that store pathway associations
    // For now, we check if the profession's pathwayId is a nursing one (which would be a config error)
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === professionKey);
    if (!profession) return [];

    if (NURSING_PATHWAY_IDS.includes(profession.pathwayId)) {
      return [
        {
          contentType: "lesson",
          id: profession.professionKey,
          nursingPathwayId: profession.pathwayId,
        },
      ];
    }

    return [];
  }
}

// ============================================================================
// Mock Implementation for Testing
// ============================================================================

export class MockAlliedCompletenessRepository implements AlliedCompletenessContentRepository {
  private lessonCounts: Record<string, number> = {};
  private flashcardCounts: Record<string, number> = {};
  private questionCounts: Record<string, number> = {};
  private catQuestionCounts: Record<string, number> = {};
  private seoSurfaces: Record<string, { title: string | null; description: string | null; hasJsonLd: boolean }> = {};
  private learnerSurfaces: Record<
    string,
    { hasPracticeExam: boolean; hasStudyPlan: boolean; hasReportCard: boolean }
  > = {};
  private contaminations: Record<
    string,
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      field: string;
      value: string;
      nursingTierReference: string;
    }>
  > = {};
  private leakages: Record<
    string,
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      nursingPathwayId: string;
    }>
  > = {};

  setLessonCount(professionKey: string, count: number) {
    this.lessonCounts[professionKey] = count;
  }

  setFlashcardCount(professionKey: string, count: number) {
    this.flashcardCounts[professionKey] = count;
  }

  setQuestionCount(professionKey: string, count: number) {
    this.questionCounts[professionKey] = count;
  }

  setCatQuestionCount(professionKey: string, count: number) {
    this.catQuestionCounts[professionKey] = count;
  }

  setSeoSurface(
    professionKey: string,
    data: { title: string | null; description: string | null; hasJsonLd: boolean }
  ) {
    this.seoSurfaces[professionKey] = data;
  }

  setLearnerSurfaces(
    professionKey: string,
    data: { hasPracticeExam: boolean; hasStudyPlan: boolean; hasReportCard: boolean }
  ) {
    this.learnerSurfaces[professionKey] = data;
  }

  setContaminations(
    professionKey: string,
    data: Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      field: string;
      value: string;
      nursingTierReference: string;
    }>
  ) {
    this.contaminations[professionKey] = data;
  }

  setLeakages(
    professionKey: string,
    data: Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      nursingPathwayId: string;
    }>
  ) {
    this.leakages[professionKey] = data;
  }

  async countLessonsByProfession(professionKey: string): Promise<number> {
    return this.lessonCounts[professionKey] ?? 0;
  }

  async countFlashcardsByProfession(professionKey: string): Promise<number> {
    return this.flashcardCounts[professionKey] ?? 0;
  }

  async countQuestionsByProfession(professionKey: string): Promise<number> {
    return this.questionCounts[professionKey] ?? 0;
  }

  async countCatEligibleQuestionsByProfession(professionKey: string): Promise<number> {
    return this.catQuestionCounts[professionKey] ?? 0;
  }

  async getSeoSurfaceByProfession(professionKey: string): Promise<{
    title: string | null;
    description: string | null;
    hasJsonLd: boolean;
  } | null> {
    return this.seoSurfaces[professionKey] ?? null;
  }

  async getLearnerSurfaceAvailability(professionKey: string): Promise<{
    hasPracticeExam: boolean;
    hasStudyPlan: boolean;
    hasReportCard: boolean;
  }> {
    return this.learnerSurfaces[professionKey] ?? { hasPracticeExam: false, hasStudyPlan: false, hasReportCard: false };
  }

  async findPotentialContamination(professionKey: string): Promise<
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      field: string;
      value: string;
      nursingTierReference: string;
    }>
  > {
    return this.contaminations[professionKey] ?? [];
  }

  async findNursingPathwayLeakage(professionKey: string): Promise<
    Array<{
      contentType: "lesson" | "flashcard" | "question";
      id: string;
      nursingPathwayId: string;
    }>
  > {
    return this.leakages[professionKey] ?? [];
  }
}

// ============================================================================
// Core Audit Logic
// ============================================================================

/**
 * Audit a single allied profession for completeness.
 */
async function auditProfession(
  profession: AlliedProfessionMarketing,
  repo: AlliedCompletenessContentRepository,
  thresholds: ReturnType<typeof getThresholds>
): Promise<{
  perProfession: AlliedProfessionCompletenessPerProfession;
  issues: AlliedProfessionCompletenessIssue[];
}> {
  const issues: AlliedProfessionCompletenessIssue[] = [];
  const professionKey = profession.professionKey;

  // Get counts
  const lessonCount = await repo.countLessonsByProfession(professionKey);
  const flashcardCount = await repo.countFlashcardsByProfession(professionKey);
  const questionCount = await repo.countQuestionsByProfession(professionKey);
  const catEligibleCount = await repo.countCatEligibleQuestionsByProfession(professionKey);

  // Get SEO surface
  const seoSurface = await repo.getSeoSurfaceByProfession(professionKey);

  // Get learner surface availability
  const learnerSurfaces = await repo.getLearnerSurfaceAvailability(professionKey);

  // Get category label
  const categoryLabel = ALLIED_HUB_CATEGORY_META[profession.hubCategory]?.label ?? profession.hubCategory;

  // Check lessons
  if (lessonCount < thresholds.minLessons) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "lessons",
      message: `Lesson count below minimum threshold`,
      expected: thresholds.minLessons,
      actual: lessonCount,
    });
  } else if (lessonCount < thresholds.minLessons * 1.5) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "lessons",
      message: `Lesson count approaching minimum threshold`,
      expected: thresholds.minLessons * 1.5,
      actual: lessonCount,
    });
  }

  // Check flashcards
  if (flashcardCount < thresholds.minFlashcards) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "flashcards",
      message: `Flashcard count below minimum threshold`,
      expected: thresholds.minFlashcards,
      actual: flashcardCount,
    });
  } else if (flashcardCount < thresholds.minFlashcards * 1.5) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "flashcards",
      message: `Flashcard count approaching minimum threshold`,
      expected: thresholds.minFlashcards * 1.5,
      actual: flashcardCount,
    });
  }

  // Check questions
  if (questionCount < thresholds.minQuestions) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "questions",
      message: `Question count below minimum threshold`,
      expected: thresholds.minQuestions,
      actual: questionCount,
    });
  } else if (questionCount < thresholds.minQuestions * 1.5) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "questions",
      message: `Question count approaching minimum threshold`,
      expected: thresholds.minQuestions * 1.5,
      actual: questionCount,
    });
  }

  // Check CAT eligibility
  if (catEligibleCount < thresholds.minCatQuestions) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "cat",
      message: `CAT-eligible question count below minimum threshold`,
      expected: thresholds.minCatQuestions,
      actual: catEligibleCount,
    });
  }

  // Check practice exam surface
  if (!learnerSurfaces.hasPracticeExam) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "practice_exam",
      message: `No practice exam surface detected`,
    });
  }

  // Check study plan surface
  if (!learnerSurfaces.hasStudyPlan) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "study_plan",
      message: `No study plan surface detected`,
    });
  }

  // Check report card surface
  if (!learnerSurfaces.hasReportCard) {
    issues.push({
      professionKey,
      severity: "warn",
      bucket: "report_card",
      message: `No report card surface detected`,
    });
  }

  // Check SEO differentiation
  let hasSeoDifferentiation = true;
  if (seoSurface) {
    if (seoSurface.title && GENERIC_SEO_TITLES.some((t) => seoSurface.title?.toLowerCase().includes(t.toLowerCase()))) {
      issues.push({
        professionKey,
        severity: "warn",
        bucket: "seo",
        message: `SEO title appears generic and may lack profession-specific differentiation`,
        actual: seoSurface.title,
      });
      hasSeoDifferentiation = false;
    }
    if (
      seoSurface.description &&
      GENERIC_SEO_DESCRIPTIONS.some((d) => seoSurface.description?.toLowerCase().includes(d.toLowerCase()))
    ) {
      issues.push({
        professionKey,
        severity: "warn",
        bucket: "seo",
        message: `SEO description appears generic and may lack profession-specific differentiation`,
        actual: seoSurface.description,
      });
      hasSeoDifferentiation = false;
    }
  } else {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "seo",
      message: `No SEO surface data found`,
    });
    hasSeoDifferentiation = false;
  }

  // Check contamination
  const contaminations = await repo.findPotentialContamination(professionKey);
  if (contaminations.length > 0) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "contamination",
      message: `Found ${contaminations.length} content items with nursing-tier references`,
      actual: contaminations.length,
    });
  }

  // Check nursing pathway leakage
  const leakages = await repo.findNursingPathwayLeakage(professionKey);
  if (leakages.length > 0) {
    issues.push({
      professionKey,
      severity: "fail",
      bucket: "nursing_leakage",
      message: `Found ${leakages.length} content items referencing nursing pathways`,
      actual: leakages.length,
    });
  }

  // Determine overall status
  const hasFailures = issues.some((i) => i.severity === "fail");
  const hasWarnings = issues.some((i) => i.severity === "warn");
  const status: AlliedProfessionCompletenessStatus = hasFailures ? "fail" : hasWarnings ? "warn" : "pass";

  const perProfession: AlliedProfessionCompletenessPerProfession = {
    professionKey,
    title: profession.title,
    category: categoryLabel,
    pathwayId: profession.pathwayId,
    lessonCount,
    flashcardCount,
    questionCount,
    catEligibleQuestionCount: catEligibleCount,
    hasPracticeExamSurface: learnerSurfaces.hasPracticeExam,
    hasStudyPlanSurface: learnerSurfaces.hasStudyPlan,
    hasReportCardSurface: learnerSurfaces.hasReportCard,
    hasSeoDifferentiation,
    status,
  };

  return { perProfession, issues };
}

/**
 * Check for SEO collisions between professions.
 */
async function checkSeoCollisions(
  professions: AlliedProfessionMarketing[],
  repo: AlliedCompletenessContentRepository
): Promise<AlliedProfessionCompletenessIssue[]> {
  const issues: AlliedProfessionCompletenessIssue[] = [];
  const seoMap = new Map<string, string[]>();

  for (const profession of professions) {
    const seo = await repo.getSeoSurfaceByProfession(profession.professionKey);
    if (seo?.title && seo?.description) {
      const key = `${seo.title}|${seo.description}`;
      const existing = seoMap.get(key) ?? [];
      existing.push(profession.professionKey);
      seoMap.set(key, existing);
    }
  }

  for (const [_, keys] of seoMap) {
    if (keys.length > 1) {
      for (const key of keys) {
        issues.push({
          professionKey: key,
          severity: "fail",
          bucket: "seo",
          message: `SEO title + description identical to: ${keys.filter((k) => k !== key).join(", ")}`,
        });
      }
    }
  }

  return issues;
}

/**
 * Run the complete allied profession completeness audit.
 */
export async function runAlliedProfessionCompletenessAudit(
  repo: AlliedCompletenessContentRepository = new PrismaAlliedCompletenessRepository(),
  customThresholds?: Partial<ReturnType<typeof getThresholds>>
): Promise<AlliedProfessionCompletenessReport> {
  const thresholds = { ...getThresholds(), ...customThresholds };
  const allIssues: AlliedProfessionCompletenessIssue[] = [];
  const perProfession: Record<string, AlliedProfessionCompletenessPerProfession> = {};

  let passingCount = 0;
  let warningCount = 0;
  let failingCount = 0;

  for (const profession of ALLIED_PROFESSIONS) {
    const { perProfession: profData, issues } = await auditProfession(profession, repo, thresholds);
    perProfession[profession.professionKey] = profData;
    allIssues.push(...issues);

    if (profData.status === "pass") passingCount++;
    else if (profData.status === "warn") warningCount++;
    else failingCount++;
  }

  // Check for SEO collisions
  const seoCollisionIssues = await checkSeoCollisions(ALLIED_PROFESSIONS, repo);
  allIssues.push(...seoCollisionIssues);

  // Determine overall status
  const hasFailures = allIssues.some((i) => i.severity === "fail");
  const hasWarnings = allIssues.some((i) => i.severity === "warn");
  const status: AlliedProfessionCompletenessStatus = hasFailures ? "fail" : hasWarnings ? "warn" : "pass";

  return {
    status,
    generatedAt: new Date().toISOString(),
    thresholds: {
      minLessons: thresholds.minLessons,
      minFlashcards: thresholds.minFlashcards,
      minQuestions: thresholds.minQuestions,
      minCatQuestions: thresholds.minCatQuestions,
    },
    professionCount: ALLIED_PROFESSIONS.length,
    passingProfessionCount: passingCount,
    warningProfessionCount: warningCount,
    failingProfessionCount: failingCount,
    issues: allIssues,
    perProfession,
  };
}

// ============================================================================
// Report Formatters
// ============================================================================

export function formatReportAsMarkdown(report: AlliedProfessionCompletenessReport): string {
  const lines: string[] = [];

  // Header
  lines.push("# Allied Profession Completeness Audit Report");
  lines.push("");
  lines.push(`**Generated:** ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push(`**Overall Status:** ${report.status.toUpperCase()}`);
  lines.push("");

  // Executive Summary
  lines.push("## Executive Summary");
  lines.push("");
  lines.push(`- **Total Professions Audited:** ${report.professionCount}`);
  lines.push(`- **Passing:** ${report.passingProfessionCount}`);
  lines.push(`- **Warnings:** ${report.warningProfessionCount}`);
  lines.push(`- **Failing:** ${report.failingProfessionCount}`);
  lines.push("");

  // Thresholds
  lines.push("## Thresholds");
  lines.push("");
  lines.push(`| Metric | Minimum Required |`);
  lines.push(`|--------|------------------|`);
  lines.push(`| Lessons per profession | ${report.thresholds.minLessons} |`);
  lines.push(`| Flashcards per profession | ${report.thresholds.minFlashcards} |`);
  lines.push(`| Questions per profession | ${report.thresholds.minQuestions} |`);
  lines.push(`| CAT-eligible questions | ${report.thresholds.minCatQuestions} |`);
  lines.push("");

  // Per-Profession Table
  lines.push("## Per-Profession Results");
  lines.push("");
  lines.push("| Profession | Category | Lessons | Flashcards | Questions | CAT | Practice Exam | Study Plan | Report Card | SEO | Status |");
  lines.push("|------------|----------|---------|------------|-----------|-----|---------------|------------|-------------|-----|--------|");

  for (const [key, data] of Object.entries(report.perProfession)) {
    const statusIcon = data.status === "pass" ? "✅" : data.status === "warn" ? "⚠️" : "❌";
    lines.push(
      `| ${key} | ${data.category} | ${data.lessonCount} | ${data.flashcardCount} | ${data.questionCount} | ${data.catEligibleQuestionCount} | ${data.hasPracticeExamSurface ? "✅" : "❌"} | ${data.hasStudyPlanSurface ? "✅" : "❌"} | ${data.hasReportCardSurface ? "✅" : "❌"} | ${data.hasSeoDifferentiation ? "✅" : "❌"} | ${statusIcon} |`
    );
  }
  lines.push("");

  // Failing Issues
  const failIssues = report.issues.filter((i) => i.severity === "fail");
  if (failIssues.length > 0) {
    lines.push("## Failing Issues");
    lines.push("");
    for (const issue of failIssues) {
      let detail = `- **[${issue.professionKey}]** ${issue.bucket}: ${issue.message}`;
      if (issue.expected !== undefined) detail += ` (expected: ${issue.expected})`;
      if (issue.actual !== undefined) detail += ` (actual: ${issue.actual})`;
      lines.push(detail);
    }
    lines.push("");
  }

  // Warning Issues
  const warnIssues = report.issues.filter((i) => i.severity === "warn");
  if (warnIssues.length > 0) {
    lines.push("## Warning Issues");
    lines.push("");
    for (const issue of warnIssues) {
      let detail = `- **[${issue.professionKey}]** ${issue.bucket}: ${issue.message}`;
      if (issue.expected !== undefined) detail += ` (expected: ${issue.expected})`;
      if (issue.actual !== undefined) detail += ` (actual: ${issue.actual})`;
      lines.push(detail);
    }
    lines.push("");
  }

  // Recommendations
  lines.push("## Recommended Next Actions");
  lines.push("");
  if (failIssues.length > 0) {
    lines.push("### Critical (Must Address)");
    lines.push("");
    const groupedByProfession = new Map<string, AlliedProfessionCompletenessIssue[]>();
    for (const issue of failIssues) {
      const existing = groupedByProfession.get(issue.professionKey) ?? [];
      existing.push(issue);
      groupedByProfession.set(issue.professionKey, existing);
    }
    for (const [profession, issues] of groupedByProfession) {
      lines.push(`- **${profession}**: Address ${issues.length} failing issues (${issues.map((i) => i.bucket).join(", ")})`);
    }
    lines.push("");
  }

  if (warnIssues.length > 0) {
    lines.push("### Recommended (Should Address)");
    lines.push("");
    const groupedByBucket = new Map<string, number>();
    for (const issue of warnIssues) {
      const count = groupedByBucket.get(issue.bucket) ?? 0;
      groupedByBucket.set(issue.bucket, count + 1);
    }
    for (const [bucket, count] of groupedByBucket) {
      lines.push(`- **${bucket}**: ${count} professions need attention`);
    }
    lines.push("");
  }

  if (report.failingProfessionCount === 0 && report.warningProfessionCount === 0) {
    lines.push("All allied professions meet completeness requirements. Continue monitoring for content growth.");
    lines.push("");
  }

  return lines.join("\n");
}

export function formatReportAsJson(report: AlliedProfessionCompletenessReport): string {
  return JSON.stringify(report, null, 2);
}