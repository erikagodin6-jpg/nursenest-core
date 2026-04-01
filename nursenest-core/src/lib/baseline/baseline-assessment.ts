import type { CountryCode, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/resilience/with-retry";
import { profileTierExamQuestionWhereSql } from "@/lib/questions/exam-question-access-sql";

/** Short baseline set (spec: 5–15). */
export const BASELINE_QUESTION_COUNT = 10;

export async function pickRandomBaselineQuestionIds(
  country: CountryCode,
  tier: TierCode,
  count: number = BASELINE_QUESTION_COUNT,
): Promise<string[]> {
  const whereSql = profileTierExamQuestionWhereSql(country, tier);
  const rows = await withRetry(() =>
    prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM exam_questions
      WHERE ${whereSql}
      ORDER BY random()
      LIMIT ${count}
    `,
  );
  return rows.map((r) => r.id);
}

export function userShouldSeeBaselinePrompt(row: {
  baselineAssessmentSkippedAt: Date | null;
  baselineAssessmentCompletedAt: Date | null;
}): boolean {
  return row.baselineAssessmentSkippedAt == null && row.baselineAssessmentCompletedAt == null;
}
