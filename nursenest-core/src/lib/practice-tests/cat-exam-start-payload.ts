import type { CatSelectionBasis, StudyLaunchPayload } from "@/lib/practice-tests/types";

export const CAT_EXAM_QUESTION_COUNT = 85;
export const CAT_EXAM_TIME_LIMIT_SEC = 300 * 60;

export type BuildCatExamStartPayloadInput = {
  pathwayId: string;
  catSelectionBasis: CatSelectionBasis;
  studyLaunchPayload: StudyLaunchPayload;
};

export function buildCatExamStartPayload(input: BuildCatExamStartPayloadInput) {
  const pathwayId = input.pathwayId.trim();

  return {
    title: "CAT Exam Simulation",
    questionCount: CAT_EXAM_QUESTION_COUNT,
    topicNames: [],
    difficultyMin: null,
    difficultyMax: null,
    selectionMode: "cat" as const,
    catSelectionBasis: input.catSelectionBasis,
    catPresentationMode: "exam_simulation" as const,
    catExamFeedbackMode: "test" as const,
    pathwayId,
    timedMode: true,
    timeLimitSec: CAT_EXAM_TIME_LIMIT_SEC,
    studyLaunchPayload: {
      ...input.studyLaunchPayload,
      pathwayId,
      mode: "cat_exam",
      count: CAT_EXAM_QUESTION_COUNT,
    },
  };
}
