import type { CountryCode, TierCode } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/resilience/with-retry";
import {
  excludeQuestionIdsSql,
  profileTierExamQuestionWhereSql,
} from "@/lib/questions/exam-question-access-sql";
import { BASELINE_QUESTION_COUNT } from "@/lib/baseline/baseline-assessment-constants";

export { BASELINE_QUESTION_COUNT } from "@/lib/baseline/baseline-assessment-constants";

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    const temp = arr[i];
    arr[i] = arr[j] as T;
    arr[j] = temp as T;
  }

  return arr;
}

/**
 * Picks baseline question ids: one random item per distinct topic when topics exist,
 * then fills to `count` while avoiding duplicate `stem_hash` when possible.
 * Tier + country filtering matches {@link profileTierExamQuestionWhereSql}.
 */
export async function pickRandomBaselineQuestionIds(
  country: CountryCode,
  tier: TierCode,
  count: number = BASELINE_QUESTION_COUNT,
): Promise<string[]> {
  const whereSql = profileTierExamQuestionWhereSql(country, tier);

  const spreadRows = await withRetry(() =>
    prisma.$queryRaw<{ id: string; stem_hash: string | null }[]>`
      SELECT DISTINCT ON (lower(trim(topic)))
        id,
        stem_hash
      FROM exam_questions
      WHERE ${whereSql}
        AND topic IS NOT NULL
        AND trim(topic) <> ''
      ORDER BY lower(trim(topic)), random()
    `,
  );

  const selected: string[] = [];
  const usedStemHashes = new Set<string>();

  const tryAdd = (id: string, stemHash: string | null): boolean => {
    if (selected.length >= count) return false;
    if (stemHash && usedStemHashes.has(stemHash)) return false;

    if (stemHash) {
      usedStemHashes.add(stemHash);
    }

    selected.push(id);
    return true;
  };

  shuffleInPlace(spreadRows);

  for (const row of spreadRows) {
    tryAdd(row.id, row.stem_hash);
  }

  let guard = 0;

  while (selected.length < count && guard < 24) {
    guard += 1;

    const need = count - selected.length;
    const exclude = excludeQuestionIdsSql(selected);
    const stemExclude =
      usedStemHashes.size > 0
        ? Prisma.sql`AND (stem_hash IS NULL OR stem_hash NOT IN (${Prisma.join([...usedStemHashes])}))`
        : Prisma.empty;

    const fill = await withRetry(() =>
      prisma.$queryRaw<{ id: string; stem_hash: string | null }[]>`
        SELECT id, stem_hash
        FROM exam_questions
        WHERE ${whereSql}
        ${exclude}
        ${stemExclude}
        ORDER BY random()
        LIMIT ${need}
      `,
    );

    if (fill.length === 0) break;

    let added = 0;

    for (const row of fill) {
      if (selected.length >= count) break;
      if (row.stem_hash && usedStemHashes.has(row.stem_hash)) continue;

      if (row.stem_hash) {
        usedStemHashes.add(row.stem_hash);
      }

      selected.push(row.id);
      added += 1;
    }

    if (added === 0) break;
  }

  if (selected.length < count) {
    const need = count - selected.length;
    const exclude = excludeQuestionIdsSql(selected);

    const fallback = await withRetry(() =>
      prisma.$queryRaw<{ id: string }[]>`
        SELECT id
        FROM exam_questions
        WHERE ${whereSql}
        ${exclude}
        ORDER BY random()
        LIMIT ${need}
      `,
    );

    for (const row of fallback) {
      if (selected.length >= count) break;
      selected.push(row.id);
    }
  }

  return selected;
}

export function userShouldSeeBaselinePrompt(row: {
  baselineAssessmentSkippedAt: Date | null;
  baselineAssessmentCompletedAt: Date | null;
}): boolean {
  return row.baselineAssessmentSkippedAt == null && row.baselineAssessmentCompletedAt == null;
}