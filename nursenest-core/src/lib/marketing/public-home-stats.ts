import { ContentStatus, UserRole } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PUBLIC_HOME_STATS } from "@/lib/cache/cache-tags";
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
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import {
  getHomeStatsMemoryState,
  setHomeStatsMemorySnapshot,
} from "@/lib/marketing/public-home-stats-memory";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { recordPaywallProofNeutral } from "@/lib/observability/production-signal-metrics";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const publicHomeStatsSentryRuntimePromise = import("@/lib/observability/sentry-runtime");
import { shouldBypassPublicHomeStatsDbAtStartup } from "@/lib/marketing/public-home-stats-startup";
import { safePrismaCountTimeout, withPrismaReadFallbackTimeout } from "@/lib/prisma/safe-reads";

const HOME_STATS_SLOW_MS = 2500;
const HOME_STATS_DB_DEADLINE_MS = 800;
const HOME_STATS_HOMEPAGE_MEMORY_TTL_MS = 5 * 60_000;
const HOME_STATS_HOMEPAGE_SHARED_CACHE_BUDGET_MS = 75;
const HOME_STATS_HOMEPAGE_REFRESH_BUDGET_MS = 1200;
const HOME_STATS_HOMEPAGE_REFRESH_COOLDOWN_MS = 15_000;

const HOME_STATS_CACHE_TIMEOUT = Symbol("home_stats_cache_timeout");

function hasMeaningfulPublicHomeStats(payload: PublicHomeStatsPayload): boolean {
  return payload.questionCount > 0 || payload.totalLessons > 0 || payload.registeredLearners > 0;
}

function isHomeStatsSnapshotFresh(cachedAtMs: number, nowMs = Date.now()): boolean {
  return nowMs - cachedAtMs < HOME_STATS_HOMEPAGE_MEMORY_TTL_MS;
}

async function readSharedHomeStatsWithinBudget(timeoutMs: number): Promise<PublicHomeStatsPayload | typeof HOME_STATS_CACHE_TIMEOUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      getCachedPublicHomeStats(),
      new Promise<typeof HOME_STATS_CACHE_TIMEOUT>((resolve) => {
        timer = setTimeout(() => resolve(HOME_STATS_CACHE_TIMEOUT), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function scheduleHomepageHomeStatsRefresh(trigger: string): void {
  const state = getHomeStatsMemoryState();
  const nowMs = Date.now();
  if (state.inflightRefresh) {
    return;
  }
  if (
    state.lastRefreshStartedAtMs &&
    nowMs - state.lastRefreshStartedAtMs < HOME_STATS_HOMEPAGE_REFRESH_COOLDOWN_MS
  ) {
    return;
  }

  state.lastRefreshStartedAtMs = nowMs;
  state.inflightRefresh = (async () => {
    try {
      const payload = await readSharedHomeStatsWithinBudget(HOME_STATS_HOMEPAGE_REFRESH_BUDGET_MS);
      if (payload === HOME_STATS_CACHE_TIMEOUT) {
        safeServerLog("marketing", "home_stats_fail_soft", {
          reason: "background_refresh_timeout",
          trigger,
          timeout_ms: HOME_STATS_HOMEPAGE_REFRESH_BUDGET_MS,
        });
        return;
      }
      if (hasMeaningfulPublicHomeStats(payload)) {
        setHomeStatsMemorySnapshot(payload);
        return;
      }
      safeServerLog("marketing", "home_stats_fail_soft", {
        reason: payload.degraded ? "background_refresh_degraded" : "background_refresh_empty",
        trigger,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      safeServerLog("marketing", "home_stats_fail_soft", {
        reason: "background_refresh_exception",
        trigger,
        message: message.slice(0, 200),
      });
    } finally {
      getHomeStatsMemoryState().inflightRefresh = undefined;
    }
  })();
}

/**
 * Public marketing stats — same scope as `/api/public/home-stats`.
 * Use `getCachedPublicHomeStats` on the homepage / paywall to avoid duplicate DB work and “0 → value” flashes.
 */
export async function getPublicHomeStats(): Promise<PublicHomeStatsPayload> {
  const { withSentryRuntimeSpan, captureSentryRuntimeSoftError } = await publicHomeStatsSentryRuntimePromise;
  return withSentryRuntimeSpan(
    {
      name: "marketing.home.public_stats",
      op: "db.query",
      attributes: { route: "/" },
    },
    async () => {
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

      if (shouldBypassPublicHomeStatsDbAtStartup()) {
        return getDegradedPublicHomeStatsFallback("startup_window_optional_db_skipped", { silent: true });
      }

      const t0 = Date.now();
      try {
        return await computePublicHomeStats(t0);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        safeServerLog("prisma", "home_stats_threw", { message: msg.slice(0, 300) });
        captureSentryRuntimeSoftError({
          scope: "marketing_home",
          event: "public_stats_failed",
          error: e,
          route: "/",
          feature: "marketing_home",
          meta: { message: msg.slice(0, 200) },
        });
        return getDegradedPublicHomeStatsFallback("exception");
      }
    },
  );
}

/**
 * Homepage-only stats path: prefer fast in-process stale data, then a tiny shared-cache budget,
 * and otherwise fail soft immediately while a bounded refresh happens off the critical path.
 */
export async function getHomepagePublicHomeStats(): Promise<PublicHomeStatsPayload> {
  const nowMs = Date.now();
  const memorySnapshot = getHomeStatsMemoryState().snapshot;
  if (memorySnapshot) {
    const stale = !isHomeStatsSnapshotFresh(memorySnapshot.cachedAtMs, nowMs);
    safeServerLog("marketing", "home_stats_cache_hit", {
      source: "memory",
      stale,
      age_ms: nowMs - memorySnapshot.cachedAtMs,
    });
    if (stale) {
      scheduleHomepageHomeStatsRefresh("memory_stale");
    }
    return memorySnapshot.payload;
  }

  const sharedCachePayload = await readSharedHomeStatsWithinBudget(HOME_STATS_HOMEPAGE_SHARED_CACHE_BUDGET_MS);
  if (sharedCachePayload !== HOME_STATS_CACHE_TIMEOUT) {
    if (hasMeaningfulPublicHomeStats(sharedCachePayload)) {
      setHomeStatsMemorySnapshot(sharedCachePayload, nowMs);
      safeServerLog("marketing", "home_stats_cache_hit", {
        source: "shared_cache",
        stale: false,
      });
      return sharedCachePayload;
    }
    safeServerLog("marketing", "home_stats_fail_soft", {
      reason: sharedCachePayload.degraded ? "shared_cache_degraded" : "shared_cache_empty",
    });
    return getDegradedPublicHomeStatsFallback(
      sharedCachePayload.degraded ? "shared_cache_degraded" : "shared_cache_empty",
      { silent: true },
    );
  }

  safeServerLog("marketing", "home_stats_cache_miss", {
    source: "shared_cache",
    timeout_ms: HOME_STATS_HOMEPAGE_SHARED_CACHE_BUDGET_MS,
  });

  if (shouldBypassPublicHomeStatsDbAtStartup()) {
    safeServerLog("marketing", "home_stats_fail_soft", {
      reason: "startup_window_optional_db_skipped",
    });
    return getDegradedPublicHomeStatsFallback("startup_window_optional_db_skipped", { silent: true });
  }

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    const reason = !isDatabaseUrlConfigured() ? "database_url_missing" : "runtime_safe_mode";
    safeServerLog("marketing", "home_stats_fail_soft", { reason });
    return getDegradedPublicHomeStatsFallback(reason, { silent: true });
  }

  scheduleHomepageHomeStatsRefresh("shared_cache_miss");
  safeServerLog("marketing", "home_stats_fail_soft", {
    reason: "shared_cache_timeout",
    timeout_ms: HOME_STATS_HOMEPAGE_SHARED_CACHE_BUDGET_MS,
  });
  return getDegradedPublicHomeStatsFallback("shared_cache_timeout", { silent: true });
}


async function computePublicHomeStats(t0: number): Promise<PublicHomeStatsPayload> {
  /** Parallelize independent counts/aggregates to cut wall time under concurrent load (semaphore may still serialize). */
  const [
    lessonsR,
    pathwayLessonsR,
    flashcardsR,
    decksR,
    learnersR,
    questionsR,
    tierAgg,
    scenariosR,
    topicGroupsR,
  ] = await Promise.all([
    safePrismaCountTimeout("home_stats.content_items", () =>
      prisma.contentItem.count({ where: publicMarketingLessonWhere() }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.pathway_lessons", () =>
      prisma.pathwayLesson.count({
        where: { status: ContentStatus.PUBLISHED, locale: "en" },
      }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.flashcards", () =>
      prisma.flashcard.count({ where: publicMarketingFlashcardWhere() }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.flashcard_decks", () =>
      prisma.flashcardDeck.count({ where: publicMarketingFlashcardDeckWhere() }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.users", () =>
      prisma.user.count({ where: { role: UserRole.LEARNER } }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.exam_questions", () =>
      prisma.examQuestion.count({ where: publicMarketingExamQuestionWhere() }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    withPrismaReadFallbackTimeout(
      "home_stats.exam_questions_by_tier",
      () =>
        prisma.examQuestion.groupBy({
          by: ["tier"],
          where: { status: DB_PUBLISHED },
          _count: { _all: true },
        }),
      [],
      HOME_STATS_DB_DEADLINE_MS,
    ),
    safePrismaCountTimeout("home_stats.exam_questions_scenarios", () =>
      prisma.examQuestion.count({
        where: { status: DB_PUBLISHED, isScenario: true },
      }),
      HOME_STATS_DB_DEADLINE_MS,
    ),
    withPrismaReadFallbackTimeout(
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
      HOME_STATS_DB_DEADLINE_MS,
    ),
  ]);

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
  if (proofDisplay === "neutral") {
    recordPaywallProofNeutral("partial_stats");
  }

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
export {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";

/** Cached — single source for marketing homepage + public API + paywall layout (no duplicate DB fanout). */
export const getCachedPublicHomeStats = unstable_cache(
  async () => getPublicHomeStats(),
  [
    "public-home-stats",
    "v5",
    "region:global",
    "locale:neutral",
    `rev:${cacheDeploymentRevision()}`,
    String(PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC),
  ],
  {
    revalidate: PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PUBLIC_HOME_STATS],
  },
);
