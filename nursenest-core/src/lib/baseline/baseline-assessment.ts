import { randomInt } from "node:crypto";
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

async function pickBaselineRowsByRandomOffset(
  whereSql: Prisma.Sql,
  take: number,
): Promise<{ id: string; stem_hash: string | null }[]> {
  const boundedTake = Math.max(0, Math.floor(take));
  if (boundedTake <= 0) return [];

  const countRows = await withRetry(
    () =>
      prisma.$queryRaw<{ count: bigint | number | string }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM exam_questions
      WHERE ${whereSql}
    `,
  );
  const total = Number(countRows[0]?.count ?? 0);
  if (!Number.isFinite(total) || total <= 0) return [];

  const limit = Math.min(boundedTake, total);
  const offset = randomInt(0, total);
  const firstRows = await withRetry(
    () =>
      prisma.$queryRaw<{ id: string; stem_hash: string | null }[]>`
      SELECT id, stem_hash
      FROM exam_questions
      WHERE ${whereSql}
      ORDER BY id ASC
      OFFSET ${offset}
      LIMIT ${limit}
    `,
  );

  if (firstRows.length >= limit || offset === 0)
    return shuffleInPlace(firstRows).slice(0, limit);

  const wrapRows = await withRetry(
    () =>
      prisma.$queryRaw<{ id: string; stem_hash: string | null }[]>`
      SELECT id, stem_hash
      FROM exam_questions
      WHERE ${whereSql}
      ORDER BY id ASC
      LIMIT ${limit - firstRows.length}
    `,
  );
  return shuffleInPlace([...firstRows, ...wrapRows]).slice(0, limit);
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

  const topicRows = await withRetry(
    () =>
      prisma.$queryRaw<{ topic_norm: string }[]>`
      SELECT DISTINCT lower(trim(topic)) AS topic_norm
      FROM exam_questions
      WHERE ${whereSql}
        AND topic IS NOT NULL
        AND trim(topic) <> ''
      ORDER BY topic_norm ASC
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

  const shuffledTopics = shuffleInPlace(
    topicRows.map((row) => row.topic_norm).filter(Boolean),
  );

  for (const topicNorm of shuffledTopics) {
    const [row] = await pickBaselineRowsByRandomOffset(
      Prisma.sql`${whereSql} AND topic IS NOT NULL AND lower(trim(topic)) = ${topicNorm}`,
      1,
    );
    if (row) tryAdd(row.id, row.stem_hash);
    if (selected.length >= count) break;
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

    const fill = await pickBaselineRowsByRandomOffset(
      Prisma.sql`${whereSql} ${exclude} ${stemExclude}`,
      need,
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

    const fallback = await pickBaselineRowsByRandomOffset(
      Prisma.sql`${whereSql} ${exclude}`,
      need,
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
  return (
    row.baselineAssessmentSkippedAt == null &&
    row.baselineAssessmentCompletedAt == null
  );
}
