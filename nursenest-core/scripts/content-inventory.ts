/**
 * Run: npx tsx scripts/content-inventory.ts
 * Requires DATABASE_URL. Outputs JSON inventory for gap analysis (no auto-publish).
 */
import { ContentStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PUBLISHED = "published";
const DRAFT = "draft";

async function main() {
  const tiers = ["rpn", "lvn", "rn", "np", "allied"] as const;
  const exams = ["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"] as const;

  const byTier = await Promise.all(
    tiers.map(async (tier) => ({
      tier,
      published: await prisma.examQuestion.count({ where: { status: PUBLISHED, tier } }),
      draft: await prisma.examQuestion.count({ where: { status: DRAFT, tier } }),
    })),
  );

  const byExam = await Promise.all(
    exams.map(async (exam) => ({
      exam,
      published: await prisma.examQuestion.count({ where: { status: PUBLISHED, exam } }),
    })),
  );

  const rationaleMissing = await prisma.examQuestion.count({
    where: { status: PUBLISHED, OR: [{ rationale: null }, { rationale: "" }] },
  });

  const examsPublished = await prisma.exam.count({ where: { status: ContentStatus.PUBLISHED } });

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      questionsPublished: await prisma.examQuestion.count({ where: { status: PUBLISHED } }),
      questionsDraft: await prisma.examQuestion.count({ where: { status: DRAFT } }),
      lessonsPublished: await prisma.contentItem.count({ where: { status: PUBLISHED, type: "lesson" } }),
      flashcardsPublished: await prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
      examsPublished,
    },
    byTier,
    byExamColumn: byExam,
    dataQuality: {
      publishedQuestionsWithEmptyRationale: rationaleMissing,
    },
    risk: {
      categoriesWithUnder5Questions: [] as { id: string; name: string; slug: string; publishedQuestions: number }[],
    },
    notes: [
      "Tier / exam columns map to `exam_questions.tier` and `exam_questions.exam` (lowercase tier strings in DB).",
      "Category ↔ question counts require a join table in production; this script reports global totals only.",
    ],
  };

  console.log(JSON.stringify(report, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
