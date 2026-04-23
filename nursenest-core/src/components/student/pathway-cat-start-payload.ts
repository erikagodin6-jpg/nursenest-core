import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";
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
  const bounded = Math.max(10, Math.min(150, input.configuredMaxQuestions));
  if (input.catPresentationMode !== "exam_simulation") return bounded;
  if (input.examFamily === "NP") return bounded;
  return Math.min(145, bounded);
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
  const readinessConfig = readinessConfigForPathway(pathwayMeta);
  const publicCopy = publicCopyForReadinessConfig(readinessConfig);
  const questionCount = resolveReadinessStartQuestionCount({
    configuredMaxQuestions: readinessConfig.maxQuestions,
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
    timeLimitSec: readinessConfig.timeLimitMinutes * 60,
  };
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
