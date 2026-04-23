import { ExamDatePlanType, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  getLearnerDurabilityObservabilityFields,
  shouldSkipNonCriticalLearnerWork,
} from "@/lib/durability/durability-flags";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { catPathwayExamCodeLabel, catPathwayRegionalExamLine } from "@/lib/exam-pathways/cat-pathway-labels";
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
import {
  loadSessionGradingAggregate,
  type SessionGradingAggregate,
} from "@/lib/learner/session-grading-aggregate";
import {
  loadUnifiedTopicPerformance,
  type TopicPerformanceSnapshot,
  type TopicTrendRow,
} from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { logLearnerStudyLoadDiagnostics, type LearnerStudyLoadOutcome } from "@/lib/learner/learner-study-load-diagnostics";
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
 * inventory (one **User** read including exam/planner scalars + capped metadata `findMany` + chunked
 * `Progress` for synthetic lesson ids). Composite loaders (readiness API, report card, progress page,
 * study planner, premium snapshot) should call it once and thread the result through optional preloads below.
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
 *
 * ## Dashboard load graph (core vs optional)
 *
 * | Layer | Functions | What it does | Cost drivers |
 * |------|-----------|--------------|----------------|
 * | **Core** | `loadLearnerDashboardCore` | Scope counts, 14d mock question aggregate, lesson completion, continue-lesson, recent mock cards (from preload or bounded fetch). No topic JSON, no bank session hydration. | `contentItem.count` + `pathwayLesson.count` + scoped progress resolution + `examAttempt` aggregate + optional `examAttempt`×5 |
 * | **Analytics** | `loadLearnerDashboardAnalytics` | `loadUnifiedTopicPerformance` (weak/strong/trends, recommended quiz). | Topic perf queries + transforms |
 * | **Practice details (grading)** | `loadLearnerDashboardPracticeDetails` | `loadSessionGradingAggregate` unless preloaded — recent **completed** exam sessions + question rows for grading. | Session + question fetch (bounded) |
 * | **Pathway summaries** | `loadPathwayStudySummaries` / `buildPathwayStudySummariesFromLessonInventory` | Per-pathway lesson totals + completion; when bundle preloads are present, **in-memory tally** avoids `groupBy`. | DB path: `groupBy` + progress; fast path: CPU only |
 *
 * Report card adds its own **practice hydration** (bank sessions + `loadBatchedBankGradingQuestionMap`) in `load-report-card-data.ts` — optional when durability skips non-critical work.
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
  /**
   * When false, {@link sessionGrading} numeric fields are not trustworthy (load failed).
   * UI and copy must not treat zeros as real “no activity”.
   */
  sessionGradingReliable: boolean;
  /**
   * When false, weak/strong/trends/topicPerformance failed — empty arrays do **not** mean “no weak areas”.
   */
  topicPerformanceReliable: boolean;
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
   * When set (including an empty array), skips `examAttempt.findMany` in the dashboard core batch.
   * Callers that load a larger mock slice elsewhere (e.g. report card) should pass the first five here.
   */
  recentMocksPreload?: RecentMock[];
  /**
   * When set, skips {@link loadSessionGradingAggregate} (duplicate examSession + question fetch).
   * Report card builds this from the same hydrated sessions as the bank panels (first 8 rows, `updatedAt` desc).
   */
  sessionGradingPreload?: SessionGradingAggregate;
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

/** Maps graded exam attempt rows to dashboard “recent mock” cards (same shape as {@link loadLearnerDashboard} batch). */
export function mapExamAttemptRowsToRecentMocks(
  rows: Array<{
    id: string;
    score: number;
    total: number;
    createdAt: Date;
    exam: { title: string };
  }>,
): RecentMock[] {
  return rows.map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));
}

/** Single `User` row slice from {@link loadPathwayLessonProgressBundle} (no duplicate reads for dashboard + planner + premium). */
export type PathwayLessonBundleUserProfile = {
  learnerPath: string | null;
  tier: TierCode | null;
  alliedProfessionKey: string | null;
  examDate: Date | null;
  examDatePlanType: ExamDatePlanType | null;
  dailyStudyMinutes: number | null;
  examFocus: string | null;
  studyGoal: string | null;
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

/** One row per entitled pathway — shared by {@link loadPathwayStudySummaries} and bundle-fast-path builders. */
export type PathwayStudySummariesRow = {
  pathwayId: string;
  label: string;
  shortLabel: string;
  /** Precomputed for dashboard/CAT chrome without client-side catalog imports. */
  catPathwayExamLabel: string;
  catPathwayRegionalExamLine: string;
  lessonsTotal: number;
  lessonsCompleted: number;
  lessonsInProgress: number;
};

export type PathwayStudySummariesLoadResult = {
  rows: PathwayStudySummariesRow[];
  status: "ok" | "error";
  reason?: string;
};

/**
 * Pathway completion table from **already-loaded** capped inventory + progress (e.g. pathway bundle).
 * Avoids an extra `pathwayLesson.groupBy` round-trip when totals can be derived from the same rows used for progress keys.
 */
export async function buildPathwayStudySummariesFromLessonInventory(
  entitlement: AccessScope,
  lessonRows: PathwayLessonDashboardRow[],
  pathwayProgress: { lessonId: string; completed: boolean }[],
): Promise<PathwayStudySummariesRow[]> {
  const pathways = await listPathwaysCompatibleWithSubscription(entitlement);
  if (pathways.length === 0) return [];

  const totalsByPathway = new Map<string, number>();
  for (const r of lessonRows) {
    totalsByPathway.set(r.pathwayId, (totalsByPathway.get(r.pathwayId) ?? 0) + 1);
  }

  const progressByPathway = new Map<string, { completed: number; inProgress: number }>();
  for (const r of pathwayProgress) {
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
    catPathwayExamLabel: catPathwayExamCodeLabel(p),
    catPathwayRegionalExamLine: catPathwayRegionalExamLine(p),
    lessonsTotal: totalsByPathway.get(p.id) ?? 0,
    lessonsCompleted: progressByPathway.get(p.id)?.completed ?? 0,
    lessonsInProgress: progressByPathway.get(p.id)?.inProgress ?? 0,
  }));
}

/**
 * Lowest-cost dashboard slice: counts, continue-lesson, recent mock cards — no topic perf and no bank grading aggregate.
 * See module header “Dashboard load graph”.
 */
export type LearnerDashboardCoreModel = {
  scope: { tier: string; country: string };
  learnerPath: string | null;
  userTier: TierCode | null;
  alliedProfessionKey: string | null;
  lessonsCompleted: number;
  lessonsAvailable: number;
  questionsInMocksLast14d: number;
  recentMocks: RecentMock[];
  continueLesson: ContinueLesson | null;
  coreParallelBatchMs: number;
  exam14dAggregateMs: number;
};

export async function loadLearnerDashboardCore(
  userId: string,
  entitlement: AccessScope,
  preload?: LearnerDashboardPreload | null,
): Promise<LearnerDashboardCoreModel | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return null;
  }

  const t0 = performance.now();
  const source = preload?.source?.trim() || "unspecified";

  const tier = String(entitlement.tier ?? "");
  const country = String(entitlement.country ?? "");

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

  const userPromise =
    preload?.userProfile !== undefined
      ? Promise.resolve(preload.userProfile)
      : prisma.user.findUnique({
          where: { id: userId },
          select: { learnerPath: true, tier: true, alliedProfessionKey: true },
        });

  const user = await userPromise;
  const learnerPath = user?.learnerPath ?? null;

  const lessonWhere = lessonAccessWhere(entitlement);
  const pathwayWhere = await pathwayLessonsAppListWhere(entitlement, learnerPath);

  let visibleLessonScope = preload?.visibleLessonScope;
  let pathwayRowsForScope = preload?.pathwayRowsForScope ?? preload?.visibleLessonScope?.pathwayLessonRows;
  const contentLessonTotalPromise = prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } });
  const pathwayLessonPublishedCountPromise = prisma.pathwayLesson.count({ where: pathwayWhere });
  const recentMocksPromise =
    preload?.recentMocksPreload !== undefined
      ? Promise.resolve(preload.recentMocksPreload.slice(0, 5))
      : prisma.examAttempt
          .findMany({
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
          })
          .then((raw) => mapExamAttemptRowsToRecentMocks(raw));

  if (!visibleLessonScope) {
    visibleLessonScope = await buildVisibleLessonScopeForLearner(userId, entitlement, {
      learnerPath,
      pathwayLessonRows: pathwayRowsForScope,
    });
    pathwayRowsForScope = visibleLessonScope.pathwayLessonRows;
  } else if (!pathwayRowsForScope || pathwayRowsForScope.length === 0) {
    pathwayRowsForScope = visibleLessonScope.pathwayLessonRows;
  }

  const tParallel = performance.now();
  const [contentLessonTotal, pathwayLessonPublishedCount, lessonsCompleted, incompleteProgress, exam14dPacked, recentMocks] =
    await Promise.all([
      contentLessonTotalPromise,
      pathwayLessonPublishedCountPromise,
      countScopedLessonsCompleted(userId, entitlement, visibleLessonScope, pathwayRowsForScope ?? []),
      findLatestIncompleteProgressLessonId(userId, visibleLessonScope.lessonIds),
      exam14dTimed,
      recentMocksPromise,
    ]);
  const coreParallelBatchMs = Math.round(performance.now() - tParallel);
  const exam14dAggregateMs = exam14dPacked.durationMs;
  const exam14dSum = exam14dPacked.sum;

  const lessonsAvailable = contentLessonTotal + pathwayLessonPublishedCount;

  const questionsInMocksLast14d = exam14dSum._sum.total ?? 0;

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

  const durationMsTotal = Math.round(performance.now() - t0);
  safeServerLog("learner_dashboard_perf", "dashboard_core_complete", {
    source,
    userIdPrefix: userId.slice(0, 8),
    durationMsTotal,
    durationMsCoreParallelBatch: coreParallelBatchMs,
    exam14dAggregateDurationMs: exam14dAggregateMs,
    userPreload: Boolean(preload?.userProfile),
    visibleScopeFromPreload: Boolean(preload?.visibleLessonScope),
    recentMocksFromPreload: preload?.recentMocksPreload !== undefined,
    pathwayMetadataRowCount: preload?.pathwayMetadataRowCount ?? 0,
    pathwayProgressRowCount: preload?.pathwayProgressRowCount ?? 0,
    pathwaySectionsJsonLoaded: false,
    ...getLearnerDurabilityObservabilityFields(),
  });

  return {
    scope: { tier, country },
    learnerPath,
    userTier: user?.tier ?? null,
    alliedProfessionKey: user?.alliedProfessionKey ?? null,
    lessonsCompleted,
    lessonsAvailable,
    questionsInMocksLast14d,
    recentMocks,
    continueLesson,
    coreParallelBatchMs,
    exam14dAggregateMs,
  };
}

export async function loadLearnerDashboardAnalytics(
  userId: string,
  entitlement: AccessScope,
  user: { tier: TierCode | null; alliedProfessionKey: string | null } | null | undefined,
): Promise<{
  weakTopics: WeakTopicRow[];
  strongTopics: WeakTopicRow[];
  topicTrends: TopicTrendRow[];
  topicPerformance: TopicPerformanceSnapshot | null;
  recommendedQuizTopic: string | null;
  loadFailed: boolean;
}> {
  const t0 = performance.now();
  let weakTopics: WeakTopicRow[] = [];
  let strongTopics: WeakTopicRow[] = [];
  let topicTrends: TopicTrendRow[] = [];
  let topicPerformance: TopicPerformanceSnapshot | null = null;
  let recommendedQuizTopic: string | null = null;
  let loadFailed = false;
  try {
    const perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
    topicPerformance = perf;
    weakTopics = perf.weakTopics;
    strongTopics = perf.strongTopics;
    topicTrends = perf.trends;
    recommendedQuizTopic = perf.recommendedQuizTopic ?? perf.weakTopics[0]?.topic ?? null;
  } catch (e) {
    loadFailed = true;
    safeServerLog("learner_dashboard_perf", "dashboard_analytics_failed", {
      userIdPrefix: userId.slice(0, 8),
      durationMs: Math.round(performance.now() - t0),
      ...getLearnerDurabilityObservabilityFields(),
    });
    logLearnerStudyLoadDiagnostics({
      operation: "loadLearnerDashboardAnalytics",
      feature_surface: "learner_dashboard",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "error",
      segment: "topic_performance",
      user_id_prefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      fallback_used: "false",
    });
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

  safeServerLog("learner_dashboard_perf", "dashboard_analytics_complete", {
    userIdPrefix: userId.slice(0, 8),
    durationMs: Math.round(performance.now() - t0),
    weakTopicCount: weakTopics.length,
    analytics_failed: loadFailed ? "1" : "0",
    ...getLearnerDurabilityObservabilityFields(),
  });

  return { weakTopics, strongTopics, topicTrends, topicPerformance, recommendedQuizTopic, loadFailed };
}

/**
 * Bank/exam-session grading aggregate for readiness + premium snapshot — bounded session/question read unless preloaded.
 */
export async function loadLearnerDashboardPracticeDetails(
  userId: string,
  entitlement: AccessScope,
  preload?: SessionGradingAggregate | null,
): Promise<{ aggregate: SessionGradingAggregate; loadFailed: boolean }> {
  const t0 = performance.now();
  if (preload) {
    return { aggregate: preload, loadFailed: false };
  }
  try {
    const practiceAgg = await loadSessionGradingAggregate(userId, entitlement, 8);
    safeServerLog("learner_dashboard_perf", "dashboard_practice_grading_complete", {
      userIdPrefix: userId.slice(0, 8),
      durationMs: Math.round(performance.now() - t0),
      sessionGradingFromPreload: false,
      ...getLearnerDurabilityObservabilityFields(),
    });
    return { aggregate: practiceAgg, loadFailed: false };
  } catch (e) {
    safeServerLog("learner_dashboard_perf", "dashboard_practice_grading_complete", {
      userIdPrefix: userId.slice(0, 8),
      durationMs: Math.round(performance.now() - t0),
      sessionGradingFromPreload: false,
      failed: true,
      ...getLearnerDurabilityObservabilityFields(),
    });
    logLearnerStudyLoadDiagnostics({
      operation: "loadLearnerDashboardPracticeDetails",
      feature_surface: "learner_dashboard",
      duration_ms: Math.round(performance.now() - t0),
      outcome: "error",
      segment: "session_grading",
      user_id_prefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      fallback_used: "false",
    });
    /** Placeholder only when load failed — never interpret as real zeros; use `loadFailed`. */
    return { aggregate: { correct: 0, total: 0, sessionCount: 0 }, loadFailed: true };
  }
}

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
  user: PathwayLessonBundleUserProfile;
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
    select: {
      learnerPath: true,
      tier: true,
      alliedProfessionKey: true,
      examDate: true,
      examDatePlanType: true,
      dailyStudyMinutes: true,
      examFocus: true,
      studyGoal: true,
    },
  });
  durationMsUser = Math.round(performance.now() - tUser);

  const pathwayWhere = await pathwayLessonsAppListWhere(entitlement, user?.learnerPath ?? null);

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
      examDate: user?.examDate ?? null,
      examDatePlanType: user?.examDatePlanType ?? null,
      dailyStudyMinutes: user?.dailyStudyMinutes ?? null,
      examFocus: user?.examFocus ?? null,
      studyGoal: user?.studyGoal ?? null,
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
  const tDashboard = performance.now();
  const source = preload?.source?.trim() || "unspecified";
  const userPreload = Boolean(preload?.userProfile);

  const core = await loadLearnerDashboardCore(userId, entitlement, preload);
  if (!core) return null;

  const skipHeavy = shouldSkipNonCriticalLearnerWork();

  let weakTopics: WeakTopicRow[] = [];
  let strongTopics: WeakTopicRow[] = [];
  let topicTrends: TopicTrendRow[] = [];
  let topicPerformance: TopicPerformanceSnapshot | null = null;
  let recommendedQuizTopic: string | null = null;
  let practiceAgg: SessionGradingAggregate = { correct: 0, total: 0, sessionCount: 0 };
  let topicPerformanceReliable = true;
  let sessionGradingReliable = true;

  if (!skipHeavy) {
    const [analytics, grading] = await Promise.all([
      loadLearnerDashboardAnalytics(userId, entitlement, {
        tier: core.userTier,
        alliedProfessionKey: core.alliedProfessionKey,
      }),
      loadLearnerDashboardPracticeDetails(userId, entitlement, preload?.sessionGradingPreload ?? null),
    ]);
    weakTopics = analytics.weakTopics;
    strongTopics = analytics.strongTopics;
    topicTrends = analytics.topicTrends;
    topicPerformance = analytics.topicPerformance;
    recommendedQuizTopic = analytics.recommendedQuizTopic;
    topicPerformanceReliable = !analytics.loadFailed;
    practiceAgg = grading.aggregate;
    sessionGradingReliable = !grading.loadFailed;
  } else {
    topicPerformanceReliable = false;
    if (preload?.sessionGradingPreload) {
      practiceAgg = preload.sessionGradingPreload;
      sessionGradingReliable = true;
    } else {
      sessionGradingReliable = false;
    }
  }

  const readiness = computeReadiness({
    practiceCorrect: practiceAgg.correct,
    practiceTotal: practiceAgg.total,
    recentMocks: core.recentMocks.map((m) => ({ score: m.score, total: m.total })),
    weakTopics,
    lessonsCompleted: core.lessonsCompleted,
    lessonsAvailable: core.lessonsAvailable,
    scope: core.scope,
    practiceSignalReliable: sessionGradingReliable,
    topicPerformanceSignalReliable: topicPerformanceReliable,
  });

  const durationMsTotal = Math.round(performance.now() - tDashboard);
  safeServerLog("learner_dashboard_perf", "dashboard_load_complete", {
    source,
    userIdPrefix: userId.slice(0, 8),
    tier: core.scope.tier,
    country: core.scope.country,
    durationMsTotal,
    durationMsCoreParallelBatch: core.coreParallelBatchMs,
    exam14dAggregateDurationMs: core.exam14dAggregateMs,
    userPreload,
    pathwayCountsFromPreload: Boolean(
      preload?.pathwayMetadataRowCount != null || preload?.pathwayProgressRowCount != null,
    ),
    visibleScopeFromPreload: Boolean(preload?.visibleLessonScope),
    pathwayMetadataRowCount: preload?.pathwayMetadataRowCount ?? 0,
    pathwayProgressRowCount: preload?.pathwayProgressRowCount ?? 0,
    pathwaySectionsJsonLoaded: false,
    recentMocksFromPreload: preload?.recentMocksPreload !== undefined,
    sessionGradingFromPreload: Boolean(preload?.sessionGradingPreload),
    optionalAggregatesSkipped: skipHeavy,
    ...getLearnerDurabilityObservabilityFields(),
  });

  return {
    scope: core.scope,
    learnerPath: core.learnerPath,
    lessonsCompleted: core.lessonsCompleted,
    lessonsAvailable: core.lessonsAvailable,
    questionsInMocksLast14d: core.questionsInMocksLast14d,
    recentMocks: core.recentMocks,
    weakTopics,
    strongTopics,
    topicTrends,
    topicPerformance,
    continueLesson: core.continueLesson,
    recommendedQuizTopic,
    readiness,
    sessionGrading: practiceAgg,
    sessionGradingReliable,
    topicPerformanceReliable,
  };
}

/** Pathway summaries for study planner (same tier/country scope). */
export async function loadPathwayStudySummaries(
  userId: string,
  entitlement: AccessScope,
  preload?: PathwayStudySummariesPreload | null,
): Promise<PathwayStudySummariesLoadResult> {
  if (!entitlement.hasAccess || !isDatabaseUrlConfigured()) {
    return { rows: [], status: "error", reason: "no_access_or_db_unset" };
  }

  const pathways = await listPathwaysCompatibleWithSubscription(entitlement);
  if (pathways.length === 0) {
    return { rows: [], status: "ok" };
  }

  if (preload?.lessonRows?.length && preload.pathwayProgress) {
    const t0 = performance.now();
    try {
      const rows = await buildPathwayStudySummariesFromLessonInventory(
        entitlement,
        preload.lessonRows,
        preload.pathwayProgress,
      );
      safeServerLog("learner_dashboard_perf", "pathway_study_summaries_inventory_only", {
        userIdPrefix: userId.slice(0, 8),
        pathwayCount: rows.length,
        lessonInventoryRows: preload.lessonRows.length,
        durationMs: Math.round(performance.now() - t0),
        ...getLearnerDurabilityObservabilityFields(),
      });
      return { rows, status: "ok" };
    } catch (e) {
      logLearnerStudyLoadDiagnostics({
        operation: "loadPathwayStudySummaries",
        feature_surface: "pathway_study_summaries",
        duration_ms: Math.round(performance.now() - t0),
        outcome: "error",
        segment: "inventory_fast_path",
        user_id_prefix: userId.slice(0, 8),
        reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
        fallback_used: "false",
      });
      return { rows: [], status: "error", reason: "inventory_fast_path_failed" };
    }
  }

  const usedLearnerPathPreload = preload?.learnerPath !== undefined;
  const tPath = performance.now();
  try {
    const scopeForSummaries = await timedLearnerCatalogPhase(
      "pathway_study_summaries_scope",
      {
        userIdPrefix: userId.slice(0, 8),
        usedLearnerPathPreload,
        usedLessonRowsPreload: Boolean(preload?.lessonRows),
      },
      () =>
        buildVisibleLessonScopeForLearner(userId, entitlement, {
          learnerPath: preload?.learnerPath,
          pathwayLessonRows: preload?.lessonRows?.map((r) => ({ pathwayId: r.pathwayId, slug: r.slug })),
        }),
    );
    const baseWhere = await pathwayLessonsAppListWhere(entitlement, scopeForSummaries.learnerPath);

    const [counts, allPathwayProgress] = await timedLearnerCatalogPhase(
      "pathway_study_summaries_parallel",
      {
        userIdPrefix: userId.slice(0, 8),
        usedLearnerPathPreload,
        fromBundleProgress: Boolean(preload?.lessonRows && preload?.pathwayProgress),
      },
      () =>
        Promise.all([
          prisma.pathwayLesson.groupBy({
            by: ["pathwayId"],
            where: baseWhere,
            _count: { _all: true },
          }),
          (async (): Promise<{ lessonId: string; completed: boolean }[]> => {
            if (preload?.lessonRows && preload.pathwayProgress) {
              return preload.pathwayProgress;
            }
            safeServerLog("learner_dashboard", "pathway_study_summaries_progress_keys", {
              slugRows: scopeForSummaries.pathwayLessonRows.length,
              fromPreloadLessonRows: Boolean(preload?.lessonRows),
            });
            return fetchProgressForPathwayLessonRows(userId, scopeForSummaries.pathwayLessonRows);
          })(),
        ]),
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

    const rows = pathways.map((p) => ({
      pathwayId: p.id,
      label: p.displayName,
      shortLabel: p.shortName || p.displayName,
      catPathwayExamLabel: catPathwayExamCodeLabel(p),
      catPathwayRegionalExamLine: catPathwayRegionalExamLine(p),
      lessonsTotal: totalsByPathway.get(p.id) ?? 0,
      lessonsCompleted: progressByPathway.get(p.id)?.completed ?? 0,
      lessonsInProgress: progressByPathway.get(p.id)?.inProgress ?? 0,
    }));
    return { rows, status: "ok" };
  } catch (e) {
    logLearnerStudyLoadDiagnostics({
      operation: "loadPathwayStudySummaries",
      feature_surface: "pathway_study_summaries",
      duration_ms: Math.round(performance.now() - tPath),
      outcome: "error",
      segment: "db_path",
      user_id_prefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      fallback_used: "false",
    });
    return { rows: [], status: "error", reason: "pathway_study_summaries_db_failed" };
  }
}
