import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";

/** Bounded counts for admin QA / operations dashboard (no row bodies). */
export type AdminQaIssueSnapshot = {
  questionsEmptyOrSuspiciousRationale: number;
  questionsFlaggedNeedsReview: number;
  draftQuestionsVeryShortStem: number;
  duplicateStemHashGroups: number;
  lessonsInDraft: number;
};

export async function loadAdminQaIssueSnapshot(): Promise<AdminQaIssueSnapshot> {
  const empty: AdminQaIssueSnapshot = {
    questionsEmptyOrSuspiciousRationale: -1,
    questionsFlaggedNeedsReview: -1,
    draftQuestionsVeryShortStem: -1,
    duplicateStemHashGroups: -1,
    lessonsInDraft: -1,
  };
  if (!isDatabaseUrlConfigured()) return empty;

  const [missingRationale, needsReview, draftWithShortStem, lessonsDraft] = await withDatabaseFallback(
    () =>
      Promise.all([
        prisma.examQuestion.count({
          where: {
            OR: [{ rationale: "" }, { rationale: { startsWith: " " } }],
          },
        }),
        prisma.examQuestion.count({ where: { status: "draft" } }),
        prisma.examQuestion.count({
          where: { status: "draft", stem: { lte: "__________" } },
        }),
        prisma.contentItem.count({ where: { type: "lesson", status: "draft" } }),
      ]),
    [0, 0, 0, 0],
  );

  let duplicateStemHashGroups = 0;
  try {
    const rows = await prisma.$queryRaw<{ n: bigint }[]>`
      SELECT COUNT(*)::bigint AS n FROM (
        SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL
        GROUP BY stem_hash HAVING COUNT(*) > 1
      ) t`;
    duplicateStemHashGroups = Number(rows[0]?.n ?? 0);
  } catch {
    duplicateStemHashGroups = -1;
  }

  return {
    questionsEmptyOrSuspiciousRationale: missingRationale,
    questionsFlaggedNeedsReview: needsReview,
    draftQuestionsVeryShortStem: draftWithShortStem,
    duplicateStemHashGroups,
    lessonsInDraft: lessonsDraft,
  };
}
