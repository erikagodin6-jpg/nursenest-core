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
  pathwayId: string;
  timedMode: false;
  timeLimitSec: 0;
  selectionStrictness: PracticeAdaptiveSelectionStrictness;
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
  questionCount: number;
  selectionStrictness?: PracticeAdaptiveSelectionStrictness;
}): PracticeAdaptiveCreatePayload {
  return {
    title: "Adaptive Practice Session",
    questionCount: Math.max(10, Math.min(200, opts.questionCount)),
    topicNames: opts.topicNames,
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat",
    catSelectionBasis: opts.catSelectionBasis,
    catPresentationMode: "practice",
    catExamFeedbackMode: "study",
    pathwayId: opts.pathwayId,
    timedMode: false,
    timeLimitSec: 0,
    selectionStrictness: opts.selectionStrictness ?? "soft",
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
