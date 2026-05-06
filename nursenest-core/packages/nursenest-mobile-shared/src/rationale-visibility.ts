/**
 * Mirrors server logic in `src/app/api/practice-tests/[id]/question/route.ts`
 * for when teaching/rationale payloads are stripped before they reach the client.
 */
export type PracticeTestConfigLike = {
  selectionMode?: string;
  catPresentationMode?: string | null;
  catExamFeedbackMode?: string | null;
  linearDeliveryMode?: string | null;
  linearRationaleVisibility?: string | null;
};

export function practiceQuestionTeachingExposure(cfg: PracticeTestConfigLike): "none" | "full" {
  const isCat = cfg.selectionMode === "cat";
  const catStripTeaching =
    isCat &&
    (cfg.catPresentationMode === "exam_simulation" || (cfg.catExamFeedbackMode ?? "test") === "test");
  const linearExamHideTeaching =
    !isCat &&
    cfg.linearDeliveryMode === "exam" &&
    (cfg.linearRationaleVisibility ?? "end_of_exam") === "end_of_exam";
  return catStripTeaching || linearExamHideTeaching ? "none" : "full";
}

export function shouldRequestQuestionRationaleQuery(cfg: PracticeTestConfigLike): boolean {
  return practiceQuestionTeachingExposure(cfg) === "full";
}
