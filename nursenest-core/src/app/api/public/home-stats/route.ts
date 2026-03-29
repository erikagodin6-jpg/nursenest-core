import { NextResponse } from "next/server";
import {
  publicMarketingExamQuestionWhere,
  publicMarketingLessonWhere,
} from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safePrismaCount } from "@/lib/prisma/safe-reads";

/** Public marketing stats — freemium-visible scope only. Tolerates missing `content_items` / `exam_questions` in prod. */
export async function GET() {
  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({
      totalLessons: 0,
      questionCount: 0,
      totalFlashcards: 0,
      totalDecks: 0,
      storeProductCount: 0,
      degraded: true,
    });
  }

  const lessonsR = await safePrismaCount("home_stats.content_items", () =>
    prisma.contentItem.count({ where: publicMarketingLessonWhere() }),
  );
  const questionsR = await safePrismaCount("home_stats.exam_questions", () =>
    prisma.examQuestion.count({ where: publicMarketingExamQuestionWhere() }),
  );

  if (lessonsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "content_items" });
  }
  if (questionsR.warning) {
    safeServerLog("prisma", "home_stats_optional_read_failed", { target: "exam_questions" });
  }

  const degraded = Boolean(lessonsR.warning || questionsR.warning);

  return NextResponse.json({
    totalLessons: lessonsR.value,
    questionCount: questionsR.value,
    totalFlashcards: 0,
    totalDecks: 0,
    storeProductCount: 0,
    ...(degraded ? { degraded: true } : {}),
  });
}
