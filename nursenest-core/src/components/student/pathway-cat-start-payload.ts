import type { CatPresentationMode } from "@/lib/practice-tests/types";

type ResolveReadinessStartQuestionCountInput = {
  configuredMaxQuestions: number;
  catPresentationMode: CatPresentationMode;
  examFamily?: string;
};

export function resolveReadinessStartQuestionCount(
  input: ResolveReadinessStartQuestionCountInput,
): number {
  if (input.catPresentationMode !== "exam_simulation") return input.configuredMaxQuestions;
  if (input.examFamily === "NP") return input.configuredMaxQuestions;
  return Math.min(145, input.configuredMaxQuestions);
}
