import { NextResponse } from "next/server";
import { ContentStatus, UserRole } from "@prisma/client";
import {
  DB_PUBLISHED,
  publicMarketingExamQuestionWhere,
  publicMarketingFlashcardDeckWhere,
  publicMarketingFlashcardWhere,
  publicMarketingLessonWhere,
} from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safePrismaCount, withPrismaReadFallback } from "@/lib/prisma/safe-reads";

/** Public marketing stats — freemium-visible scope only. Tolerates missing `content_items` / `exam_questions` in prod. */
export async function GET() {
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({
      totalLessons: 0,
      pathwayLessonsPublished: 0,
      contentItemsLessonCount: 0,
      questionCount: 0,
      totalFlashcards: 0,
      totalDecks: 0,
      storeProductCount: 0,
      registeredLearners: 0,
      questionsByTier: {} as Record<string, number>,
      scenarioCount: 0,
      topicCategoryCount: 0,
      degraded: true,
    });
  }

  const lessonsR = await safePrismaCount("home_stats.content_items", () =>
    prisma.contentItem.count({ where: publicMarketingLessonWhere() }),
  );
  const pathwayLessonsR = await safePrismaCount("home_stats.pathway_lessons", () =>
    prisma.pathwayLesson.count({
      where: { status: ContentStatus.PUBLISHED, locale: "en" },
    }),
  );
  const flashcardsR = await safePrismaCount("home_stats.flashcards", () =>
    prisma.flashcard.count({ where: publicMarketingFlashcardWhere() }),
  );
  const decksR = await safePrismaCount("home_stats.flashcard_decks", () =>
    prisma.flashcardDeck.count({ where: publicMarketingFlashcardDeckWhere() }),
  );
  const learnersR = await safePrismaCount("home_stats.users", () =>
    prisma.user.count({ where: { role: UserRole.LEARNER } }),
  );
  const questionsR = await safePrismaCount("home_stats.exam_questions", () =>
    prisma.examQuestion.count({ where: publicMarketingExamQuestionWhere() }),
  );

  const tierAgg = await withPrismaReadFallback(
    "home_stats.exam_questions_by_tier",
    () =>
      prisma.examQuestion.groupBy({
        by: ["tier"],
        where: { status: DB_PUBLISHED },
        _count: { _all: true },
      }),
    [],
  );

  const scenariosR = await safePrismaCount("home_stats.exam_questions_scenarios", () =>
    prisma.examQuestion.count({
      where: { status: DB_PUBLISHED, isScenario: true },
    }),
  );

  const topicGroupsR = await withPrismaReadFallback(
    "home_stats.exam_questions_topics_distinct",
    () =>
      prisma.examQuestion.groupBy({
        by: ["topic"],
        where: {
          ...publicMarketingExamQuestionWhere(),
          topic: { not: null },
          NOT: { topic: "" },
        },
        _count: { _all: true },
      }),
    [],
  );

  if (lessonsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "content_items" });
  }
  if (pathwayLessonsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "pathway_lessons" });
  }
  if (flashcardsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "flashcards" });
  }
  if (decksR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "flashcard_decks" });
  }
  if (learnersR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "users" });
  }
  if (questionsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "exam_questions" });
  }
  if (tierAgg.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "exam_questions_by_tier" });
  }
  if (scenariosR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "exam_questions_scenarios" });
  }

  const questionsByTier: Record<string, number> = {};
  for (const row of tierAgg.value) {
    const k = String(row.tier).trim().toLowerCase();
    if (!k) continue;
    questionsByTier[k] = (questionsByTier[k] ?? 0) + row._count._all;
  }

  const degraded = Boolean(
    lessonsR.warning ||
      pathwayLessonsR.warning ||
      flashcardsR.warning ||
      decksR.warning ||
      learnersR.warning ||
      questionsR.warning ||
      tierAgg.warning ||
      scenariosR.warning ||
      topicGroupsR.warning,
  );

  if (topicGroupsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "exam_questions_topics_distinct" });
  }

  const topicCategoryCount = topicGroupsR.value.length;

  const pathwayLessonsPublished = pathwayLessonsR.value;
  const contentItemsLessonCount = lessonsR.value;
  const totalLessons =
    pathwayLessonsPublished > 0 ? pathwayLessonsPublished : contentItemsLessonCount;

  return NextResponse.json({
    totalLessons,
    pathwayLessonsPublished,
    contentItemsLessonCount,
    questionCount: questionsR.value,
    totalFlashcards: flashcardsR.value,
    totalDecks: decksR.value,
    storeProductCount: 0,
    registeredLearners: learnersR.value,
    questionsByTier,
    scenarioCount: scenariosR.value,
    topicCategoryCount,
    ...(degraded ? { degraded: true } : {}),
  });
}
