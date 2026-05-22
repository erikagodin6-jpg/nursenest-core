import { ExamFamily } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
import {
  examSimulationConfigForPathway,
  examSimulationTimeLimitSecForConfig,
  nclexRnSimulationBoundsFromConfig,
} from "@/lib/exams/cat-exam-simulation";
import type { CatPresentationMode, PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import type { CatPracticeReadinessResult } from "@/lib/practice-tests/cat-practice-readiness";
import {
  ADAPTIVE_PRACTICE_DEFAULT_LENGTH,
  ADAPTIVE_PRACTICE_UNLIMITED_CAP,
  resolveAdaptivePracticeLaunchLength,
  type AdaptivePracticeSessionLength,
} from "@/lib/practice-tests/adaptive-practice-session-length";
import { PRACTICE_TEST_CAT_CREATE_CODE } from "@/lib/practice-tests/practice-test-cat-create-codes";

type ResolveReadinessStartQuestionCountInput = {
  configuredMaxQuestions: number;
  catPresentationMode: CatPresentationMode;
  examFamily?: string;
};

export function resolveReadinessStartQuestionCount(
  input: ResolveReadinessStartQuestionCountInput,
): number {
  if (input.catPresentationMode !== "exam_simulation") {
    return Math.max(10, Math.min(150, input.configuredMaxQuestions));
  }
  const cap = input.examFamily === ExamFamily.NP ? 175 : 145;
  return Math.max(10, Math.min(cap, input.configuredMaxQuestions));
}

export function isHardBlockingReadinessCode(code: string | null | undefined): boolean {
  return (
    code === PRACTICE_TEST_CAT_CREATE_CODE.pathway_not_entitled ||
    code === PRACTICE_TEST_CAT_CREATE_CODE.cat_pool_invalid
  );
}

export function normalizePathwaySelection(pathwayId: string | null | undefined): string {
  const value = typeof pathwayId === "string" ? pathwayId.trim() : "";
  return value;
}

/** Shared POST body for pathway CAT exam simulation (used by setup page and direct launch). */
export function buildCatExamSimulationCreatePayload(pathwayMeta: PracticeTestPathwayClientShell): {
  title: string;
  questionCount: number;
  topicNames: string[];
  difficultyMin: null;
  difficultyMax: null;
  selectionMode: "cat";
  catSelectionBasis: "random";
  catPresentationMode: "exam_simulation";
  catExamFeedbackMode: "test";
  pathwayId: string;
  timedMode: boolean;
  timeLimitSec: number;
} {
  const pathwayFull = getExamPathwayById(pathwayMeta.id);
  const examCfg = examSimulationConfigForPathway(
    pathwayFull ?? null,
    pathwayFull?.examFamily === ExamFamily.NP ? { npBoard: "AANP" } : undefined,
  );
  const simMax = nclexRnSimulationBoundsFromConfig(examCfg).max;
  const readinessConfig = readinessConfigForPathway(pathwayMeta);
  const publicCopy = publicCopyForReadinessConfig(readinessConfig, pathwayFull ?? pathwayMeta);
  const questionCount = resolveReadinessStartQuestionCount({
    configuredMaxQuestions: simMax,
    catPresentationMode: "exam_simulation",
    examFamily: pathwayMeta.examFamily,
  });
  return {
    title: publicCopy.title,
    questionCount,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat",
    catSelectionBasis: "random",
    catPresentationMode: "exam_simulation",
    catExamFeedbackMode: "test",
    pathwayId: pathwayMeta.id,
    timedMode: true,
    timeLimitSec: examSimulationTimeLimitSecForConfig(examCfg),
  };
}

export type PracticeAdaptiveSelectionBasis = "random" | "weak" | "missed" | "starred";

/**
 * Controls server-side pool widening when filters produce too few CAT-eligible items.
 * Practice hub defaults to `"soft"`; exam simulation always uses `"strict"` on the server.
 */
export type PracticeAdaptiveSelectionStrictness = "soft" | "strict";

/** Echoes marketing / hub launch context; validated by `POST /api/practice-tests` when present. */
export type PracticeAdaptiveStudyLaunchPayload = {
  pathwayId?: string | null;
  mode?: string;
  selectedCategories?: string[];
  filters?: Record<string, string | number | boolean | null>;
  count?: number;
  shuffle?: boolean;
  /** True when the learner chose unlimited practice (CAT advance until manual end). */
  unlimited?: boolean;
};

export type PracticeAdaptiveCreatePayload = {
  title: string;
  questionCount: number;
  topicNames: string[];
  difficultyMin: null;
  difficultyMax: null;
  selectionMode: "cat";
  catSelectionBasis: PracticeAdaptiveSelectionBasis;
  catPresentationMode: "practice";
  catExamFeedbackMode: "study";
  /** Practice adaptive sessions may use the CAT adapter while retaining practice presentation/feedback. */
  catAdaptiveSessionType: "practice" | "cat";
  pathwayId: string;
  timedMode: false;
  timeLimitSec: null;
  selectionStrictness: PracticeAdaptiveSelectionStrictness;
  studyLaunchPayload?: PracticeAdaptiveStudyLaunchPayload;
};

/**
 * POST body for adaptive practice sessions launched from the Practice Questions hub.
 *
 * Key differences from exam simulation:
 * - `catPresentationMode: "practice"` — not timed, shorter runs
 * - `catExamFeedbackMode: "study"` — rationale shown after each question
 * - `timedMode: false` — no countdown timer
 * - `topicNames` — biases the pool toward selected body systems (empty = all systems)
 * - `catSelectionBasis` — weak / missed / starred prioritization (combined with topics when set)
 * - `selectionStrictness` — `"soft"` widens the pool server-side when the narrow slice is too small
 */
export function buildPracticeAdaptiveCreatePayload(opts: {
  pathwayId: string;
  topicNames: string[];
  catSelectionBasis: PracticeAdaptiveSelectionBasis;
  /** Fixed count (10–150) or unlimited drilling cap. */
  sessionLength?: AdaptivePracticeSessionLength;
  /** @deprecated Prefer `sessionLength`; kept for callers passing a raw count. */
  questionCount?: number;
  selectionStrictness?: PracticeAdaptiveSelectionStrictness;
  studyLaunchPayload?: PracticeAdaptiveStudyLaunchPayload;
}): PracticeAdaptiveCreatePayload {
  const sessionLength: AdaptivePracticeSessionLength =
    opts.sessionLength ??
    (typeof opts.questionCount === "number" && opts.questionCount > 0
      ? (Math.max(10, Math.min(150, Math.floor(opts.questionCount))) as AdaptivePracticeSessionLength)
      : ADAPTIVE_PRACTICE_DEFAULT_LENGTH);
  const launch = resolveAdaptivePracticeLaunchLength(sessionLength);
  const questionCount = Math.max(10, Math.min(ADAPTIVE_PRACTICE_UNLIMITED_CAP, launch.questionCount));
  const studyLaunchPayload: PracticeAdaptiveStudyLaunchPayload = {
    ...opts.studyLaunchPayload,
    pathwayId: opts.studyLaunchPayload?.pathwayId ?? opts.pathwayId,
    mode: launch.unlimited ? "adaptive_practice_unlimited" : (opts.studyLaunchPayload?.mode ?? "adaptive_practice"),
    count: questionCount,
    shuffle: opts.studyLaunchPayload?.shuffle ?? true,
    ...(launch.unlimited ? { unlimited: true } : {}),
  };
  return {
    title: launch.unlimited ? "Unlimited Adaptive Practice" : "Adaptive Practice Session",
    questionCount,
    topicNames: opts.topicNames,
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat",
    catSelectionBasis: opts.catSelectionBasis,
    catPresentationMode: "practice",
    catExamFeedbackMode: "study",
    catAdaptiveSessionType: launch.catAdaptiveSessionType,
    pathwayId: opts.pathwayId,
    timedMode: false,
    timeLimitSec: null,
    selectionStrictness: opts.selectionStrictness ?? "soft",
    studyLaunchPayload,
  };
}

/**
 * Returns true if the API error code indicates the question pool was too small
 * for the requested filter combination.  Used by the soft-filter fallback in
 * `PracticeQuestionSessionSetupClient`.
 */
export function isPracticePoolExhaustedCode(code: string | null | undefined): boolean {
  return (
    code === "cat_pool_invalid" ||
    code === "cat_weak_areas_empty" ||
    code === "cat_missed_items_empty" ||
    code === "cat_starred_items_empty"
  );
}

export function resolveCatStartUiState(input: {
  pathwayId: string | null | undefined;
  pathwayChoiceRequired: boolean;
  readinessLoading: boolean;
  readiness: CatPracticeReadinessResult | null;
}): {
  startDisabled: boolean;
  showPathwayRequiredMessage: boolean;
  showReadinessMessage: boolean;
  readinessCode: string | null;
} {
  const pathwayId = normalizePathwaySelection(input.pathwayId);
  const showPathwayRequiredMessage = input.pathwayChoiceRequired && pathwayId.length === 0;
  const readinessCode = input.readiness && !input.readiness.ok ? input.readiness.code : null;
  const readinessFailed = Boolean(input.readiness && !input.readiness.ok);
  const startDisabled = input.readinessLoading || showPathwayRequiredMessage || readinessFailed;
  return {
    startDisabled,
    showPathwayRequiredMessage,
    showReadinessMessage: readinessFailed,
    readinessCode,
  };
}
