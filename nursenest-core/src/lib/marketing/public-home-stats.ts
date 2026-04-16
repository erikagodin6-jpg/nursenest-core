import { ContentStatus, UserRole } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";
import {
  DB_PUBLISHED,
  publicMarketingExamQuestionWhere,
  publicMarketingFlashcardDeckWhere,
  publicMarketingFlashcardWhere,
  publicMarketingLessonWhere,
} from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { safePrismaCount, withPrismaReadFallback } from "@/lib/prisma/safe-reads";

/** Full payload returned by `GET /api/public/home-stats` — shared with the marketing homepage (SSR). */
export type PublicHomeStatsPayload = {
  totalLessons: number;
  pathwayLessonsPublished: number;
  contentItemsLessonCount: number;
  questionCount: number;
  totalFlashcards: number;
  totalDecks: number;
  storeProductCount: number;
  registeredLearners: number;
  questionsByTier: Record<string, number>;
  scenarioCount: number;
  topicCategoryCount: number;
  degraded?: boolean;
  runtimeSafeMode?: boolean;
  /**
   * When `neutral`, UIs should show explanatory copy instead of numeric proof (avoids “empty/broken” zeros).
   */
  proofDisplay?: "full" | "neutral";
};

const HOME_STATS_SLOW_MS = 2500;

/** Safe structured fallback when DB throws or routes need a 200 — never crashes callers. */
export function getDegradedPublicHomeStatsFallback(
  reason: string,
  opts?: { silent?: boolean },
): PublicHomeStatsPayload {
  if (!opts?.silent) {
    safeServerLog("marketing", "public_home_stats_degraded", { reason: reason.slice(0, 120) });
  }
  return {
    totalLessons: 0,
    pathwayLessonsPublished: 0,
    contentItemsLessonCount: 0,
    questionCount: 0,
    totalFlashcards: 0,
    totalDecks: 0,
    storeProductCount: 0,
    registeredLearners: 0,
    questionsByTier: {},
    scenarioCount: 0,
    topicCategoryCount: 0,
    degraded: true,
    proofDisplay: "neutral",
  };
}

/**
 * Public marketing stats — same scope as `/api/public/home-stats`.
 * Use `getCachedPublicHomeStats` on the homepage / paywall to avoid duplicate DB work and “0 → value” flashes.
 */
export async function getPublicHomeStats(): Promise<PublicHomeStatsPayload> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return {
      totalLessons: 0,
      pathwayLessonsPublished: 0,
      contentItemsLessonCount: 0,
      questionCount: 0,
      totalFlashcards: 0,
      totalDecks: 0,
      storeProductCount: 0,
      registeredLearners: 0,
      questionsByTier: {},
      scenarioCount: 0,
      topicCategoryCount: 0,
      degraded: true,
      runtimeSafeMode: isRuntimeSafeMode(),
      proofDisplay: "neutral",
    };
  }

  const t0 = Date.now();
  try {
    return await computePublicHomeStats(t0);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("prisma", "home_stats_threw", { message: msg.slice(0, 300) });
    return getDegradedPublicHomeStatsFallback("exception");
  }
}


async function computePublicHomeStats(t0: number): Promise<PublicHomeStatsPayload> {
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

  const elapsed = Date.now() - t0;
  if (elapsed > HOME_STATS_SLOW_MS) {
    safeServerLog("performance", "home_stats_slow", { ms: elapsed });
  }

  const hasNumericProof =
    questionsR.value > 0 || totalLessons > 0 || learnersR.value > 0;
  const proofDisplay: "neutral" | undefined = degraded && !hasNumericProof ? "neutral" : undefined;

  return {
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
    ...(proofDisplay ? { proofDisplay } : {}),
  };
}

/** Re-export for pages importing from `@/lib/marketing/public-home-stats`. */
export { PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";

/** Cached — single source for marketing homepage + public API + paywall layout (no duplicate DB fanout). */
export const getCachedPublicHomeStats = unstable_cache(
  async () => getPublicHomeStats(),
  ["public-home-stats-v3", String(PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC)],
  {
    revalidate: PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC,
    tags: ["marketing:public-home-stats"],
  },
);
