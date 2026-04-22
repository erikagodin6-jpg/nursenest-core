import "server-only";

import type { CountryCode, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import { examRowToLessonBankItem, type LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";

const MAX_IDS = 40;

type ExamRow = {
  id: string;
  stem: string;
  options: Prisma.JsonValue;
  correctAnswer: Prisma.JsonValue;
  questionType: string;
  rationale: string | null;
  difficulty: number | null;
};

function regionWhereForCountry(country: CountryCode): Prisma.ExamQuestionWhereInput {
  return {
    OR: [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }],
  };
}

/**
 * Load MCQ-shaped bank items for explicit `ExamQuestion` ids (lesson pre/post / study loop).
 * Preserves caller order; skips ids the subscriber cannot access or that are not MCQ-mappable.
 */
export async function loadLessonBankQuizItemsByExamIds(args: {
  entitlement: AccessScope;
  countryCode: CountryCode;
  ids: string[];
}): Promise<LessonBankQuizItem[]> {
  const uniq: string[] = [];
  const seen = new Set<string>();
  for (const raw of args.ids) {
    const id = typeof raw === "string" ? raw.trim() : "";
    if (id.length < 8 || id.length > 80 || seen.has(id)) continue;
    seen.add(id);
    uniq.push(id);
    if (uniq.length >= MAX_IDS) break;
  }
  if (!uniq.length || !args.entitlement.hasAccess) return [];

  const rows = await withDatabaseFallback(
    () =>
      prisma.examQuestion.findMany({
        where: {
          AND: [questionAccessWhere(args.entitlement), { id: { in: uniq } }, regionWhereForCountry(args.countryCode)],
        },
        select: {
          id: true,
          stem: true,
          options: true,
          correctAnswer: true,
          questionType: true,
          rationale: true,
          difficulty: true,
        },
      }),
    [] as ExamRow[],
  );

  const byId = new Map(rows.map((r) => [r.id, r]));
  const out: LessonBankQuizItem[] = [];
  for (const id of uniq) {
    const r = byId.get(id);
    if (!r) continue;
    const item = examRowToLessonBankItem(r);
    if (item) out.push(item);
  }
  return out;
}
