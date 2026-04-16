import { TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  getLearnerDurabilityObservabilityFields,
  shouldSkipNonCriticalLearnerWork,
} from "@/lib/durability/durability-flags";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayLessonsAppListWhere } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { syntheticPathwayLessonId } from "@/lib/lessons/pathway-lesson-progress";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  filterTopicRowsForAlliedProfession,
  filterWeakTopicsForAlliedProfession,
} from "@/lib/allied/allied-weak-topic-filter";
import { computeReadiness, type ReadinessResult } from "@/lib/learner/readiness-score";
import { loadSessionGradingAggregate, type SessionGradingAggregate } from "@/lib/learner/session-grading-aggregate";
import {
  loadUnifiedTopicPerformance,
  type TopicPerformanceSnapshot,
  type TopicTrendRow,
} from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { PATHWAY_LESSON_METADATA_LIST_SELECT } from "@/lib/lessons/pathway-lesson-metadata-select";
import {
  buildVisibleLessonScopeForLearner,
  countScopedLessonsCompleted,
  findLatestIncompleteProgressLessonId,
  type PathwayLessonKeyRow,
  type VisibleLessonScope,
} from "@/lib/learner/learner-visible-lesson-scope";

/**
 * ## Learner pathway catalog — who may query Prisma directly
 *
 * **`loadPathwayLessonProgressBundle`** is the canonical entry for one request’s scoped pathway
 * inventory (user row + capped metadata `findMany` + chunked `Progress` for synthetic lesson ids).
 * Composite loaders (report card, progress page, study planner, premium snapshot) should call it
 * once and thread the result through optional preloads below.
 *
 * **`loadLearnerDashboard`** may always run its own queries: it needs an uncapped
 * `pathwayLesson.count` for `lessonsAvailable` (bundle uses a capped list for progress joins only).
 * Pass `preload.userProfile` from the bundle user to skip a duplicate **User** read.
 *
 * **`loadPathwayStudySummaries`** still runs `pathwayLesson.groupBy` for per-pathway totals (uncapped).
 * When the caller already ran the bundle, pass `lessonRows`, `pathwayProgress`, and **`learnerPath`**
 * so this helper skips both the extra User lookup and the fallback `findMany({ select: slug })` used
 * only to derive progress keys.
 *
 * Helpers that resolve a **single** lesson or adaptive row (`resolvePathwayNextLesson`, remediation,
 * etc.) are allowed to query `pathwayLesson` directly; they are not part of the dashboard catalog bundle.
 */
function timedLearnerCatalogPhase<T>(event: string, detail: Record<string, unknown>, run: () => Promise<T>): Promise<T> {
  const t0 = performance.now();
  return run().finally(() => {
    safeServerLog("learner_catalog_timing", event, {
      ...detail,
      durationMs: Math.round(performance.now() - t0),
    });
  });
}

export type ContinueLesson = {
  title: string;
  href: string;
  kind: "content" | "pathway" | "pre_nursing";
};

export type RecentMock = {
  id: string;
  examTitle: string;
  score: number;
  total: number;
  pct: number;
  at: string;
};

export type LearnerDashboardModel = {
  scope: { tier: string; country: string };
  /** Saved exam pathway on the user profile (for deep links). */
  learnerPath: string | null;
  lessonsCompleted: number;
  lessonsAvailable: number;
  questionsInMocksLast14d: number;
  recentMocks: RecentMock[];
  weakTopics: WeakTopicRow[];
  /** Highest-accuracy topics (≥3 attempts) for reinforcement copy. */
  strongTopics: WeakTopicRow[];
  /** Momentum heuristics for planner + adaptive copy. */
  topicTrends: TopicTrendRow[];
  /** Full snapshot when topic perf loaded (optional for callers that need breakdown). */
  topicPerformance: TopicPerformanceSnapshot | null;
  continueLesson: ContinueLesson | null;
  recommendedQuizTopic: string | null;
  readiness: ReadinessResult;
  /** Recent completed exam-session grading (tier-scoped); reused by premium snapshot. */
  sessionGrading: SessionGradingAggregate;
};

/**
 * Row shape for dashboard + pathway summaries.
 * **Does not include `sections` JSON** — inventory uses metadata only to keep learner loads bounded (see fetch).
 */
export type PathwayLessonDashboardRow = {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  locale: string;
  structuralPublicComplete: boolean;
};

export type LearnerDashboardPreload = {
  /** When provided, avoids a duplicate `user` query for learnerPath / tier. */
  userProfile?: {
    learnerPath: string | null;
    tier: TierCode | null;
    alliedProfessionKey: string | null;
  };
  /**
   * Call-site id for `learner_dashboard_perf` logs (e.g. `loadPremiumDashboardSnapshot`, `api:GET:learner/readiness`).
   * Avoids PII; use stable builder/route identifiers only.
   */
  source?: string;
  /** From {@link loadPathwayLessonProgressBundle} — metadata pathway rows (sections never loaded). */
  pathwayMetadataRowCount?: number;
  /** From bundle — scoped synthetic progress rows. */
  pathwayProgressRowCount?: number;
  /**
   * When provided with {@link pathwayRowsForScope}, scopes `Progress` aggregates to visible content + pathway
   * lessons (avoids full-table scans). Usually built via {@link buildVisibleLessonScopeForLearner}.
   */
  visibleLessonScope?: VisibleLessonScope;
  /** Pathway catalog rows used for split counts when the content pool exceeds the id cap. */
  pathwayRowsForScope?: PathwayLessonKeyRow[];
};

/** Options for {@link loadPathwayLessonProgressBundle} observability only. */
export type PathwayLessonProgressBundleOptions = {
  source?: string;
};

export type PathwayStudySummariesPreload = {
  lessonRows?: PathwayLessonDashboardRow[];
  pathwayProgress?: { lessonId: string; completed: boolean }[];
  /**
   * From {@link loadPathwayLessonProgressBundle}’s user — avoids a duplicate `User` read for `learnerPath`
   * when building `pathwayLessonsAppListWhere`. Pass together with `lessonRows` + `pathwayProgress` when threading a bundle.
   */
  learnerPath?: string | null;
};

/**
 * Single pathway-lesson list for learner dashboard scope (bounded, same cap as catalog hub math).
 * Loads **metadata only** (no `sections` JSON) so RN full-content runs do not materialize huge lesson bodies.
 */
export async function fetchPathwayLessonRowsForDashboard(
  where: import("@prisma/client").Prisma.PathwayLessonWhereInput,
): Promise<PathwayLessonDashboardRow[]> {
  const rows = await prisma.pathwayLesson.findMany({
    where,
    select: PATHWAY_LESSON_METADATA_LIST_SELECT,
    take: PATHWAY_CATALOG_LIST_HARD_CAP,
  });
  return rows as PathwayLessonDashboardRow[];
}

/**
 * Progress rows only for synthetic ids present in the current pathway lesson inventory (not unbounded `pathway:%`).
 */
const PROGRESS_IN_CHUNK = 350;

export async function fetchProgressForPathwayLessonRows(
  userId: string,
  rows: Pick<PathwayLessonDashboardRow, "pathwayId" | "slug">[],
): Promise<{ lessonId: string; completed: boolean }[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => syntheticPathwayLessonId(r.pathwayId, r.slug));
  const out: { lessonId: string; completed: boolean }[] = [];
  for (let i = 0; i < ids.length; i += PROGRESS_IN_CHUNK) {
    const chunk = ids.slice(i, i + PROGRESS_IN_CHUNK);
    const part = await prisma.progress.findMany({
      where: { userId, lessonId: { in: chunk } },
      select: { lessonId: true, completed: true },
    });
    out.push(...part);
  }
  return out;
}

/**
 * One user read + pathway inventory + scoped progress — reuse across dashboard + summaries to avoid duplicate heavy queries.
 * Emits `learner_dashboard_perf` / `pathway_bundle_complete` (one line per call; grep `pathway_bundle_complete`).
 */
export async function loadPathwayLessonProgressBundle(
  userId: string,
  entitlement: AccessScope,
  options?: PathwayLessonProgressBundleOptions | null,
): Promise<{
  user: {
    learnerPath: string | null;
    tier: TierCode | null;
    alliedProfessionKey: string | null;
  };
  pathwayLessonRows: PathwayLessonDashboardRow[];
  pathwayProgressScoped: { lessonId: string; completed: boolean }[];
} | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  const t0 = performance.now();
  const source = options?.source?.trim() || "unspecified";

  let durationMsUser = 0;
  const tUser = performance.now();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { learnerPath: true, tier: true, alliedProfessionKey: true },
  });
  durationMsUser = Math.round(performance.now() - tUser);

  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, user?.learnerPath ?? null);

  let durationMsInventory = 0;
  const tInv = performance.now();
  const pathwayLessonRows = await fetchPathwayLessonRowsForDashboard(pathwayWhere);
  durationMsInventory = Math.round(performance.now() - tInv);

  let durationMsProgress = 0;
  const tProg = performance.now();
  const pathwayProgressScoped = await fetchProgressForPathwayLessonRows(userId, pathwayLessonRows);
  durationMsProgress = Math.round(performance.now() - tProg);

  const durationMsTotal = Math.round(performance.now() - t0);

  safeServerLog("learner_dashboard_perf", "pathway_bundle_complete", {
    source,
    userIdPrefix: userId.slice(0, 8),
    durationMsTotal,
    durationMsUser,
    durationMsInventory,
    durationMsProgress,
    pathwayMetadataRowCount: pathwayLessonRows.length,
    pathwaySectionsJsonLoaded: false,
    progressRowCount: pathwayProgressScoped.length,
    ...getLearnerDurabilityObservabilityFields(),
  });

  if (process.env.PATHWAY_LESSON_METADATA_DIAGNOSTIC === "1") {
    const n = pathwayLessonRows.length;
    safeServerLog("learner_dashboard", "pathway_metadata_payload_diag", {
      metadataRows: n,
      approxMetadataBytesPerRow: 900,
      approxSectionsJsonAvoidedBytes: n * 48_000,
    });
  }

  return {
    user: {
      learnerPath: user?.learnerPath ?? null,
      tier: user?.tier ?? null,
      alliedProfessionKey: user?.alliedProfessionKey ?? null,
    },
    pathwayLessonRows,
    pathwayProgressScoped,
  };
}

export async function loadLearnerDashboard(
  userId: string,
  entitlement: AccessScope,
  preload?: LearnerDashboardPreload | null,
): Promise<LearnerDashboardModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return null;
  }

  const tDashboard = performance.now();
  const source = preload?.source?.trim() || "unspecified";
  const userPreload = Boolean(preload?.userProfile);

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");

  const user =
    preload?.userProfile ??
    (await prisma.user.findUnique({
      where: { id: userId },
      select: { learnerPath: true, tier: true, alliedProfessionKey: true },
    }));
  const learnerPath = user?.learnerPath ?? null;

  const lessonWhere = lessonAccessWhere(entitlement);

  const pathwayWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const exam14dWindowStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const exam14dTimed = (async () => {
    const t = performance.now();
    const sum = await prisma.examAttempt.aggregate({
      where: {
        userId,
        createdAt: { gte: exam14dWindowStart },
      },
      _sum: { total: true },
    });
    return { sum, durationMs: Math.round(performance.now() - t) };
  })();

  let visibleLessonScope = preload?.visibleLessonScope;
  let pathwayRowsForScope = preload?.pathwayRowsForScope;
  if (!visibleLessonScope) {
    const pathwayKeys = await prisma.pathwayLesson.findMany({
      where: pathwayWhere,
      select: { pathwayId: true, slug: true },
      take: PATHWAY_CATALOG_LIST_HARD_CAP,
    });
    visibleLessonScope = await buildVisibleLessonScopeForLearner(entitlement, pathwayKeys);
    pathwayRowsForScope = pathwayKeys;
  } else if (visibleLessonScope.contentTruncated && (!pathwayRowsForScope || pathwayRowsForScope.length === 0)) {
    pathwayRowsForScope = await prisma.pathwayLesson.findMany({
      where: pathwayWhere,
      select: { pathwayId: true, slug: true },
      take: PATHWAY_CATALOG_LIST_HARD_CAP,
    });
  }

  const tParallel = performance.now();
  const [contentLessonTotal, pathwayLessonPublishedCount, lessonsCompleted, incompleteProgress, exam14dPacked, recentMocksRaw] =
    await Promise.all([
      prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
      prisma.pathwayLesson.count({ where: pathwayWhere }),
      countScopedLessonsCompleted(userId, entitlement, visibleLessonScope, pathwayRowsForScope ?? []),
      findLatestIncompleteProgressLessonId(userId, visibleLessonScope.lessonIds),
      exam14dTimed,
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          score: true,
          total: true,
          createdAt: true,
          exam: { select: { title: true } },
        },
      }),
    ]);
  const durationMsCoreParallelBatch = Math.round(performance.now() - tParallel);
  const exam14dSum = exam14dPacked.sum;
  const exam14dAggregateDurationMs = exam14dPacked.durationMs;

  /** Matches published in-scope pathway rows (same filter as hub); avoids per-row structural JSON parsing. */
  const lessonsAvailable = contentLessonTotal + pathwayLessonPublishedCount;

  const questionsInMocksLast14d = exam14dSum._sum.total ?? 0;

  const recentMocks: RecentMock[] = recentMocksRaw.map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));

  const skipHeavy = shouldSkipNonCriticalLearnerWork();

  let weakTopics: WeakTopicRow[] = [];
  let strongTopics: WeakTopicRow[] = [];
  let topicTrends: TopicTrendRow[] = [];
  let topicPerformance: TopicPerformanceSnapshot | null = null;
  let recommendedQuizTopic: string | null = null;
  let practiceAgg = { correct: 0, total: 0, sessionCount: 0 };

  if (skipHeavy) {
    safeServerLog("learner_dashboard", "optional_aggregates_skipped", {
      reason: "durability_degraded",
      surface: "topic_performance_and_session_grading",
    });
  } else {
    try {
      const perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
      topicPerformance = perf;
      weakTopics = perf.weakTopics;
      strongTopics = perf.strongTopics;
      topicTrends = perf.trends;
      recommendedQuizTopic = perf.recommendedQuizTopic ?? perf.weakTopics[0]?.topic ?? null;
    } catch {
      weakTopics = [];
      strongTopics = [];
      topicTrends = [];
      topicPerformance = null;
      recommendedQuizTopic = null;
    }

    if (user?.tier === TierCode.ALLIED && user.alliedProfessionKey) {
      const ap = getAlliedProfessionByProfessionKey(user.alliedProfessionKey);
      weakTopics = filterWeakTopicsForAlliedProfession(weakTopics, ap);
      strongTopics = filterWeakTopicsForAlliedProfession(strongTopics, ap);
      topicTrends = filterTopicRowsForAlliedProfession(topicTrends, ap);
      recommendedQuizTopic = weakTopics[0]?.topic ?? null;
      if (topicPerformance) {
        topicPerformance = {
          ...topicPerformance,
          weakTopics,
          strongTopics,
          trends: topicTrends,
        };
      }
    }
    try {
      practiceAgg = await loadSessionGradingAggregate(userId, entitlement, 8);
    } catch {
      practiceAgg = { correct: 0, total: 0, sessionCount: 0 };
    }
  }

  let continueLesson: ContinueLesson | null = null;
  if (incompleteProgress?.lessonId) {
    try {
      continueLesson = await resolveLessonRefFromProgressId({
        lessonId: incompleteProgress.lessonId,
        entitlement,
        learnerPath,
      });
    } catch {
      continueLesson = null;
    }
  }

  const readiness = computeReadiness({
    practiceCorrect: practiceAgg.correct,
    practiceTotal: practiceAgg.total,
    recentMocks: recentMocks.map((m) => ({ score: m.score, total: m.total })),
    weakTopics,
    lessonsCompleted,
    lessonsAvailable,
    scope: { tier, country },
  });

  const durationMsTotal = Math.round(performance.now() - tDashboard);
  safeServerLog("learner_dashboard_perf", "dashboard_load_complete", {
    source,
    userIdPrefix: userId.slice(0, 8),
    tier,
    country,
    durationMsTotal,
    durationMsCoreParallelBatch,
    exam14dAggregateDurationMs,
    userPreload,
    pathwayCountsFromPreload: Boolean(
      preload?.pathwayMetadataRowCount != null || preload?.pathwayProgressRowCount != null,
    ),
    pathwayMetadataRowCount: preload?.pathwayMetadataRowCount ?? 0,
    pathwayProgressRowCount: preload?.pathwayProgressRowCount ?? 0,
    pathwaySectionsJsonLoaded: false,
    optionalAggregatesSkipped: skipHeavy,
    ...getLearnerDurabilityObservabilityFields(),
  });

  return {
    scope: { tier, country },
    learnerPath,
    lessonsCompleted,
    lessonsAvailable,
    questionsInMocksLast14d,
    recentMocks,
    weakTopics,
    strongTopics,
    topicTrends,
    topicPerformance,
    continueLesson,
    recommendedQuizTopic,
    readiness,
    sessionGrading: practiceAgg,
  };
}

/** Pathway summaries for study planner (same tier/country scope). */
export async function loadPathwayStudySummaries(
  userId: string,
  entitlement: AccessScope,
  preload?: PathwayStudySummariesPreload | null,
): Promise<
  {
    pathwayId: string;
    label: string;
    shortLabel: string;
    lessonsTotal: number;
    lessonsCompleted: number;
    lessonsInProgress: number;
  }[]
> {
  if (!entitlement.hasAccess || !isDatabaseUrlConfigured()) return [];

  const pathways = listPathwaysCompatibleWithSubscription(entitlement);
  if (pathways.length === 0) return [];

  const usedLearnerPathPreload = preload?.learnerPath !== undefined;
  const learnerPath = usedLearnerPathPreload
    ? preload!.learnerPath ?? null
    : (
        await timedLearnerCatalogPhase(
          "pathway_study_summaries_user",
          { userIdPrefix: userId.slice(0, 8) },
          () => prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } }),
        )
      )?.learnerPath ?? null;
  const baseWhere = pathwayLessonsAppListWhere(entitlement, learnerPath);

  const [counts, allPathwayProgress] = await timedLearnerCatalogPhase(
    "pathway_study_summaries_parallel",
    {
      userIdPrefix: userId.slice(0, 8),
      usedLearnerPathPreload,
      fromBundleProgress: Boolean(preload?.lessonRows && preload?.pathwayProgress),
    },
    () =>
      Promise.all([
        prisma.pathwayLesson
          .groupBy({
            by: ["pathwayId"],
            where: baseWhere,
            _count: { _all: true },
          })
          .catch(() => [] as { pathwayId: string; _count: { _all: number } }[]),
        (async (): Promise<{ lessonId: string; completed: boolean }[]> => {
          if (preload?.lessonRows && preload.pathwayProgress) {
            return preload.pathwayProgress;
          }
          const slugRows = preload?.lessonRows
            ? preload.lessonRows.map((r) => ({ pathwayId: r.pathwayId, slug: r.slug }))
            : await prisma.pathwayLesson
                .findMany({
                  where: baseWhere,
                  select: { pathwayId: true, slug: true },
                  take: PATHWAY_CATALOG_LIST_HARD_CAP,
                })
                .catch(() => [] as { pathwayId: string; slug: string }[]);
          safeServerLog("learner_dashboard", "pathway_study_summaries_progress_keys", {
            slugRows: slugRows.length,
            fromPreloadLessonRows: Boolean(preload?.lessonRows),
          });
          return fetchProgressForPathwayLessonRows(userId, slugRows).catch(
            () => [] as { lessonId: string; completed: boolean }[],
          );
        })(),
      ])
  );

  const totalsByPathway = new Map(counts.map((c) => [c.pathwayId, c._count._all]));

  const progressByPathway = new Map<string, { completed: number; inProgress: number }>();
  for (const r of allPathwayProgress) {
    const rest = r.lessonId.slice("pathway:".length);
    const colonIdx = rest.indexOf(":");
    if (colonIdx < 0) continue;
    const pid = rest.slice(0, colonIdx);
    if (!progressByPathway.has(pid)) progressByPathway.set(pid, { completed: 0, inProgress: 0 });
    const entry = progressByPathway.get(pid)!;
    if (r.completed) entry.completed++;
    else entry.inProgress++;
  }

  return pathways.map((p) => ({
    pathwayId: p.id,
    label: p.displayName,
    shortLabel: p.shortName || p.displayName,
    lessonsTotal: totalsByPathway.get(p.id) ?? 0,
    lessonsCompleted: progressByPathway.get(p.id)?.completed ?? 0,
    lessonsInProgress: progressByPathway.get(p.id)?.inProgress ?? 0,
  }));
}
