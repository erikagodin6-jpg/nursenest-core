import {
  evaluateDistractorOptimization,
  type DistractorOptimizationInput,
  type DistractorOptimizationIssue,
} from "@/lib/questions/distractor-optimization-standards";

export type QuestionBankDistractorAuditItem = {
  id: string;
  input: DistractorOptimizationInput;
};

export type QuestionBankDistractorAuditFailure = {
  id: string;
  score: number;
  issues: DistractorOptimizationIssue[];
};

export type QuestionBankDistractorAuditResult = {
  total: number;
  failures: QuestionBankDistractorAuditFailure[];
};

export function auditQuestionBankDistractors(
  items: readonly QuestionBankDistractorAuditItem[],
): QuestionBankDistractorAuditResult {
  const failures = items.flatMap((item): QuestionBankDistractorAuditFailure[] => {
    const result = evaluateDistractorOptimization(item.input);
    return result.pass ? [] : [{ id: item.id, score: result.score, issues: result.issues }];
  });

  return {
    total: items.length,
    failures,
  };
}

export function optionRationaleMap(
  options: readonly { id: string; correct?: boolean; rationale?: string | null }[],
): Record<string, string> {
  return Object.fromEntries(
    options
      .filter((option) => option.correct !== true && typeof option.rationale === "string")
      .map((option) => [option.id, option.rationale ?? ""]),
  );
}
