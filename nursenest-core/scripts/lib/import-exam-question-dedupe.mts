/**
 * Scoped dedupe for exam_questions imports: same stem text can legitimately differ by exam/tier/country.
 */
import type { PrismaClient } from "@prisma/client";

import { examQuestionNaturalKey } from "../../src/lib/content-pipeline/stable-ids";

export type ExamQuestionScopeFields = {
  stemHash: string;
  exam: string;
  tier: string;
  countryCode: string | null;
};

export function examQuestionScopedDedupeKey(row: ExamQuestionScopeFields): string {
  return examQuestionNaturalKey({
    exam: row.exam,
    tier: row.tier,
    countryCode: row.countryCode,
    stemHash: row.stemHash,
  });
}

import { IMPORT_SCOPED_KEY_OR_CHUNK } from "../../src/lib/content-pipeline/import-safeguards";

const OR_CHUNK = IMPORT_SCOPED_KEY_OR_CHUNK;

/**
 * Returns which scoped keys already exist in the database (batched).
 */
export async function loadExistingScopedKeys(
  prisma: PrismaClient,
  keys: ExamQuestionScopeFields[],
): Promise<Set<string>> {
  const out = new Set<string>();
  for (let i = 0; i < keys.length; i += OR_CHUNK) {
    const slice = keys.slice(i, i + OR_CHUNK);
    const rows = await prisma.examQuestion.findMany({
      where: {
        OR: slice.map((k) => ({
          stemHash: k.stemHash,
          exam: k.exam,
          tier: k.tier,
          countryCode: k.countryCode,
        })),
      },
      select: { stemHash: true, exam: true, tier: true, countryCode: true },
    });
    for (const r of rows) {
      if (!r.stemHash) continue;
      out.add(
        examQuestionScopedDedupeKey({
          stemHash: r.stemHash,
          exam: r.exam,
          tier: r.tier,
          countryCode: r.countryCode,
        }),
      );
    }
  }
  return out;
}
