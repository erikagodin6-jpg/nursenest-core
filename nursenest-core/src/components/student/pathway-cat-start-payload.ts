import type { CatPresentationMode } from "@/lib/practice-tests/types";
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
