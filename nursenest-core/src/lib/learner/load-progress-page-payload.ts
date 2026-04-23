import "server-only";

import { PracticeTestStatus } from "@prisma/client";
import { learnerPrivateReadAccessScopeKey, loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import {
  buildPathwayStudySummariesFromLessonInventory,
  loadPathwayLessonProgressBundle,
  loadPathwayStudySummaries,
  type PathwayStudySummariesRow,
} from "@/lib/learner/load-learner-dashboard";
import {
  buildVisibleLessonScopeForLearner,
  countProgressInProgressForLessonIds,
  countScopedLessonsCompleted,
  findLatestIncompleteProgressLessonId,
} from "@/lib/learner/learner-visible-lesson-scope";
import type { RecentMock } from "@/lib/learner/load-learner-dashboard";
import { resolveLessonRefFromProgressId } from "@/lib/lessons/lesson-progress-resolver";
import type { LearnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { learnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { logLearnerStudyLoadDiagnostics } from "@/lib/learner/learner-study-load-diagnostics";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { loadSessionGradingAggregate } from "@/lib/learner/session-grading-aggregate";
import { loadPathwayTopicCoverageBatch, type PathwayTopicCoverage } from "@/lib/lessons/pathway-topic-coverage";

const PRACTICE_RECENT_LIMIT = 6;
const MOCK_RECENT_LIMIT = 5;

export type LessonsPoolProgress = {
  /** Content + pathway lessons available in plan scope (same basis as dashboard). */
  available: number;
  completed: number;
  inProgress: number;
  notStarted: number;
};

export type QuestionBankProgress = {
  /** Sum of graded attempts in topic ledger (question bank + graded flows that write stats). */
  ledgerAttempted: number;
  ledgerAccuracyPct: number | null;
  /** Distinct topics this user has attempted at least one question in. */
  topicsPracticed: number;
  /** Recent completed exam sessions, tier-scoped graded items. */
  recentGraded: {
    correct: number;
    total: number;
    sessionCount: number;
    accuracyPct: number | null;
  };
};

export type PracticeExamProgress = {
  completedPracticeTests: number;
  recentPracticeTests: Array<{
    id: string;
    title: string | null;
    completedAt: Date;
    accuracyPct: number | null;
    isCat: boolean;
  }>;
  recentMocks: RecentMock[];
};

export type PathwayProgressTrackKey = "rn" | "rpn_lpn" | "np" | "allied" | "other";

export type PathwayProgressCardModel = {
  pathwayId: string;
  shortLabel: string;
  trackKey: PathwayProgressTrackKey;
  lessonsTotal: number;
  lessonsCompleted: number;
  lessonsInProgress: number;
  notStarted: number;
  /** Lesson-completion % (0–100). */
  pct: number;
  /** Distinct topics with at least one completed lesson (0 if not yet computed). */
  topicsCovered: number;
  /** Total distinct published topics in this pathway (0 = unknown / catalog-only). */
  topicsTotal: number;
  /** topicsCovered / topicsTotal expressed as 0–100 integer. */
  topicCoveragePct: number;
};

/** Per-segment trust: when false, zeros/empties in that column must not be read as real learner state. */
export type ProgressPageSegmentReliability = {
  pathwaySummaries: boolean;
  contentLessonInventoryCount: boolean;
  scopedLessonProgress: boolean;
  topicLedgerAggregate: boolean;
  topicLedgerTopicCount: boolean;
  recentGradedSessions: boolean;
  examMockHistory: boolean;
  practiceTestHistory: boolean;
  pathwayTopicCoverage: boolean;
};

export type ProgressPagePayload = {
  lessonsPool: LessonsPoolProgress;
  pathways: PathwayProgressCardModel[];
  questionBank: QuestionBankProgress;
  exams: PracticeExamProgress;
  continueLesson: { title: string; href: string } | null;
  degraded?: LearnerAggregateDegradedState;
  segmentReliability: ProgressPageSegmentReliability;
};

const TRACK_ORDER: RoleTrackSlug[] = ["rn", "rpn", "lpn", "np", "allied"];

function pathwayTrackKey(roleTrack: RoleTrackSlug | undefined): PathwayProgressTrackKey {
  switch (roleTrack) {
    case "rn":
      return "rn";
    case "rpn":
    case "lpn":
      return "rpn_lpn";
    case "np":
      return "np";
    case "allied":
      return "allied";
    default:
      return "other";
  }
}

const ALL_SEGMENTS_RELIABLE: ProgressPageSegmentReliability = {
  pathwaySummaries: true,
  contentLessonInventoryCount: true,
  scopedLessonProgress: true,
  topicLedgerAggregate: true,
  topicLedgerTopicCount: true,
  recentGradedSessions: true,
  examMockHistory: true,
  practiceTestHistory: true,
  pathwayTopicCoverage: true,
};

function sortPathways(a: PathwayProgressCardModel, b: PathwayProgressCardModel): number {
  const defA = getExamPathwayById(a.pathwayId);
  const defB = getExamPathwayById(b.pathwayId);
  const ia = defA ? TRACK_ORDER.indexOf(defA.roleTrack) : 99;
  const ib = defB ? TRACK_ORDER.indexOf(defB.roleTrack) : 99;
  if (ia !== ib) return ia - ib;
  return a.shortLabel.localeCompare(b.shortLabel);
}

/**
 * Focused aggregates for the Progress page — avoids full learner dashboard (readiness, topic perf, etc.).
 *
 * **Pathway catalog:** one {@link loadPathwayLessonProgressBundle} per request; pathway summaries reuse that bundle
 * via `loadPathwayStudySummaries` preload (same entitlement scope as dashboard).
 */
async function loadProgressPagePayloadUncached(userId: string, entitlement: AccessScope): Promise<ProgressPagePayload | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;
  if (shouldSkipNonCriticalLearnerWork()) {
    return {
      lessonsPool: { available: 0, completed: 0, inProgress: 0, notStarted: 0 },
      pathways: [],
      questionBank: {
        ledgerAttempted: 0,
        ledgerAccuracyPct: null,
        topicsPracticed: 0,
        recentGraded: { correct: 0, total: 0, sessionCount: 0, accuracyPct: null },
      },
      exams: {
        completedPracticeTests: 0,
        recentPracticeTests: [],
        recentMocks: [],
      },
      continueLesson: null,
      degraded: learnerAggregateDegradedState("durability_degraded", [
        "lessons_pool",
        "pathways",
        "question_bank",
        "recent_exams",
      ]),
      segmentReliability: {
        ...ALL_SEGMENTS_RELIABLE,
        pathwaySummaries: false,
        contentLessonInventoryCount: false,
        scopedLessonProgress: false,
        topicLedgerAggregate: false,
        topicLedgerTopicCount: false,
        recentGradedSessions: false,
        examMockHistory: false,
        practiceTestHistory: false,
        pathwayTopicCoverage: false,
      },
    };
  }
  const tPage = performance.now();
  let reliability: ProgressPageSegmentReliability = { ...ALL_SEGMENTS_RELIABLE };
  const degradedPanels: string[] = [];

  try {
  const bundle = await loadPathwayLessonProgressBundle(userId, entitlement, { source: "loadProgressPagePayload" });
  if (!bundle) return null;

  const learnerPath = bundle.user.learnerPath ?? null;
  const lessonWhere = lessonAccessWhere(entitlement);

  const visibleLessonScope = await buildVisibleLessonScopeForLearner(userId, entitlement, {
    learnerPath: bundle.user.learnerPath,
    pathwayLessonRows: bundle.pathwayLessonRows,
  });

  const tSummaries = performance.now();
  const pathwaySummariesResult = await loadPathwayStudySummaries(userId, entitlement, {
    lessonRows: bundle.pathwayLessonRows,
    pathwayProgress: bundle.pathwayProgressScoped,
    learnerPath: bundle.user.learnerPath,
  });
  let pathwayRows: PathwayStudySummariesRow[] = pathwaySummariesResult.rows;
  let pathwaysReliable = pathwaySummariesResult.status === "ok";
  if (!pathwaysReliable) {
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      duration_ms: Math.round(performance.now() - tSummaries),
      outcome: "error",
      segment: "pathway_study_summaries",
      user_id_prefix: userId.slice(0, 8),
      reason: pathwaySummariesResult.reason ?? "pathway_summaries_failed",
      fallback_used: "false",
    });
    if (bundle.pathwayLessonRows.length > 0) {
      const tRec = performance.now();
      try {
        pathwayRows = await buildPathwayStudySummariesFromLessonInventory(
          entitlement,
          bundle.pathwayLessonRows,
          bundle.pathwayProgressScoped,
        );
        pathwaysReliable = true;
        logLearnerStudyLoadDiagnostics({
          operation: "loadProgressPagePayload",
          feature_surface: "progress_page",
          duration_ms: Math.round(performance.now() - tRec),
          outcome: "degraded",
          segment: "pathway_summaries_bundle_rebuild",
          user_id_prefix: userId.slice(0, 8),
          source_row_count: String(bundle.pathwayLessonRows.length),
          fallback_used: "true",
        });
        degradedPanels.push("pathway_inventory_bundle_fallback");
      } catch (e) {
        logLearnerStudyLoadDiagnostics({
          operation: "loadProgressPagePayload",
          feature_surface: "progress_page",
          duration_ms: Math.round(performance.now() - tRec),
          outcome: "error",
          segment: "pathway_summaries_bundle_rebuild",
          user_id_prefix: userId.slice(0, 8),
          reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
          fallback_used: "false",
        });
      }
    }
    if (!pathwaysReliable) {
      degradedPanels.push("pathway_summaries");
    }
  }
  reliability.pathwaySummaries = pathwaysReliable;

  const tParallel = performance.now();
  const [
    contentLessonTotalResult,
    lessonsCompletedResult,
    lessonsInProgressResult,
    topicSumsResult,
    questionTopicsPracticedResult,
    recentGradedResult,
    mocksRawResult,
    practiceCompletedResult,
    practiceRecentResult,
    incompleteProgressResult,
  ] = await Promise.allSettled([
    prisma.contentItem.count({ where: { ...lessonWhere, type: "lesson" } }),
    countScopedLessonsCompleted(userId, entitlement, visibleLessonScope, bundle.pathwayLessonRows),
    countProgressInProgressForLessonIds(userId, visibleLessonScope.lessonIds),
    prisma.userTopicStat.aggregate({
      where: { userId },
      _sum: { correctCount: true, wrongCount: true },
    }),
    prisma.userTopicStat.count({ where: { userId } }),
    loadSessionGradingAggregate(userId, entitlement, 8),
    prisma.examAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true,
        score: true,
        total: true,
        createdAt: true,
        exam: { select: { title: true } },
      },
    }),
    prisma.practiceTest.count({ where: { userId, status: PracticeTestStatus.COMPLETED } }),
    prisma.practiceTest.findMany({
      where: { userId, status: PracticeTestStatus.COMPLETED, completedAt: { not: null } },
      orderBy: [{ completedAt: "desc" }, { createdAt: "desc" }],
      take: 12,
      select: { id: true, title: true, completedAt: true, config: true, results: true },
    }),
    findLatestIncompleteProgressLessonId(userId, visibleLessonScope.lessonIds),
  ]);

  let contentLessonTotal = 0;
  if (contentLessonTotalResult.status === "fulfilled") {
    contentLessonTotal = contentLessonTotalResult.value;
  } else {
    reliability.contentLessonInventoryCount = false;
    degradedPanels.push("content_lesson_inventory");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      duration_ms: Math.round(performance.now() - tParallel),
      outcome: "error",
      segment: "content_lesson_count",
      user_id_prefix: userId.slice(0, 8),
      reason:
        contentLessonTotalResult.reason instanceof Error
          ? contentLessonTotalResult.reason.message.slice(0, 400)
          : String(contentLessonTotalResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let lessonsCompleted = 0;
  if (lessonsCompletedResult.status === "fulfilled") {
    lessonsCompleted = lessonsCompletedResult.value;
  } else {
    reliability.scopedLessonProgress = false;
    degradedPanels.push("lessons_completed");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "scoped_lessons_completed",
      user_id_prefix: userId.slice(0, 8),
      reason:
        lessonsCompletedResult.reason instanceof Error
          ? lessonsCompletedResult.reason.message.slice(0, 400)
          : String(lessonsCompletedResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let lessonsInProgressCount = 0;
  if (lessonsInProgressResult.status === "fulfilled") {
    lessonsInProgressCount = lessonsInProgressResult.value;
  } else {
    reliability.scopedLessonProgress = false;
    degradedPanels.push("lessons_in_progress");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "lessons_in_progress_count",
      user_id_prefix: userId.slice(0, 8),
      reason:
        lessonsInProgressResult.reason instanceof Error
          ? lessonsInProgressResult.reason.message.slice(0, 400)
          : String(lessonsInProgressResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let topicSums = { _sum: { correctCount: null as number | null, wrongCount: null as number | null } };
  if (topicSumsResult.status === "fulfilled") {
    topicSums = topicSumsResult.value;
  } else {
    reliability.topicLedgerAggregate = false;
    degradedPanels.push("topic_ledger_aggregate");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "user_topic_stat_aggregate",
      user_id_prefix: userId.slice(0, 8),
      reason:
        topicSumsResult.reason instanceof Error
          ? topicSumsResult.reason.message.slice(0, 400)
          : String(topicSumsResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let questionTopicsPracticed = 0;
  if (questionTopicsPracticedResult.status === "fulfilled") {
    questionTopicsPracticed = questionTopicsPracticedResult.value;
  } else {
    reliability.topicLedgerTopicCount = false;
    degradedPanels.push("topic_ledger_topics");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "user_topic_stat_count",
      user_id_prefix: userId.slice(0, 8),
      reason:
        questionTopicsPracticedResult.reason instanceof Error
          ? questionTopicsPracticedResult.reason.message.slice(0, 400)
          : String(questionTopicsPracticedResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let recentGraded = { correct: 0, total: 0, sessionCount: 0 };
  if (recentGradedResult.status === "fulfilled") {
    recentGraded = recentGradedResult.value;
  } else {
    reliability.recentGradedSessions = false;
    degradedPanels.push("recent_graded_sessions");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "session_grading_aggregate",
      user_id_prefix: userId.slice(0, 8),
      reason:
        recentGradedResult.reason instanceof Error
          ? recentGradedResult.reason.message.slice(0, 400)
          : String(recentGradedResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  type MockAttemptRow = {
    id: string;
    score: number;
    total: number;
    createdAt: Date;
    exam: { title: string };
  };
  let mocksRaw: MockAttemptRow[] = [];
  if (mocksRawResult.status === "fulfilled") {
    mocksRaw = mocksRawResult.value as MockAttemptRow[];
  } else {
    reliability.examMockHistory = false;
    degradedPanels.push("exam_mock_history");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "exam_attempt_recent",
      user_id_prefix: userId.slice(0, 8),
      reason:
        mocksRawResult.reason instanceof Error
          ? mocksRawResult.reason.message.slice(0, 400)
          : String(mocksRawResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  let practiceCompletedCount = 0;
  if (practiceCompletedResult.status === "fulfilled") {
    practiceCompletedCount = practiceCompletedResult.value;
  } else {
    reliability.practiceTestHistory = false;
    degradedPanels.push("practice_test_completed_count");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "practice_test_count",
      user_id_prefix: userId.slice(0, 8),
      reason:
        practiceCompletedResult.reason instanceof Error
          ? practiceCompletedResult.reason.message.slice(0, 400)
          : String(practiceCompletedResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  type PracticeRecentRow = {
    id: string;
    title: string | null;
    completedAt: Date | null;
    config: unknown;
    results: unknown;
  };
  let practiceRecent: PracticeRecentRow[] = [];
  if (practiceRecentResult.status === "fulfilled") {
    practiceRecent = practiceRecentResult.value as PracticeRecentRow[];
  } else {
    reliability.practiceTestHistory = false;
    degradedPanels.push("practice_test_recent");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "error",
      duration_ms: 0,
      segment: "practice_test_recent_list",
      user_id_prefix: userId.slice(0, 8),
      reason:
        practiceRecentResult.reason instanceof Error
          ? practiceRecentResult.reason.message.slice(0, 400)
          : String(practiceRecentResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  const incompleteProgress =
    incompleteProgressResult.status === "fulfilled" ? incompleteProgressResult.value : null;
  if (incompleteProgressResult.status === "rejected") {
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      outcome: "degraded",
      segment: "continue_lesson_progress_lookup",
      user_id_prefix: userId.slice(0, 8),
      reason:
        incompleteProgressResult.reason instanceof Error
          ? incompleteProgressResult.reason.message.slice(0, 400)
          : String(incompleteProgressResult.reason).slice(0, 400),
      fallback_used: "false",
    });
  }

  const pathwayLessonTotal = pathwayRows.reduce((sum, row) => sum + row.lessonsTotal, 0);
  const lessonsAvailable = contentLessonTotal + pathwayLessonTotal;
  const notStartedPool = Math.max(0, lessonsAvailable - lessonsCompleted - lessonsInProgressCount);

  const correctSum = topicSums._sum.correctCount ?? 0;
  const wrongSum = topicSums._sum.wrongCount ?? 0;
  const ledgerAttempted =
    reliability.topicLedgerAggregate && topicSums._sum.correctCount != null && topicSums._sum.wrongCount != null
      ? correctSum + wrongSum
      : 0;
  const ledgerAccuracyPct =
    reliability.topicLedgerAggregate && ledgerAttempted > 0
      ? Math.round((correctSum / ledgerAttempted) * 100)
      : null;

  const recentMocks: RecentMock[] = mocksRaw.slice(0, MOCK_RECENT_LIMIT).map((a) => ({
    id: a.id,
    examTitle: a.exam.title,
    score: a.score,
    total: a.total,
    pct: a.total > 0 ? Math.round((a.score / a.total) * 100) : 0,
    at: a.createdAt.toISOString(),
  }));

  const recentPracticeTests = practiceRecent.slice(0, PRACTICE_RECENT_LIMIT).map((row) => {
    const cfg = row.config as PracticeTestConfigJson | null;
    const res = row.results as PracticeTestResultsJson | null;
    const isCat = cfg?.selectionMode === "cat";
    const accuracyPct =
      res && typeof res.accuracyPct === "number" && Number.isFinite(res.accuracyPct)
        ? Math.round(res.accuracyPct)
        : res && res.scoreTotal > 0
          ? Math.round((res.scoreCorrect / res.scoreTotal) * 100)
          : null;
    return {
      id: row.id,
      title: row.title,
      completedAt: row.completedAt!,
      accuracyPct,
      isCat,
    };
  });

  let continueLesson: ProgressPagePayload["continueLesson"] = null;
  if (incompleteProgress?.lessonId) {
    try {
      const ref = await resolveLessonRefFromProgressId({
        lessonId: incompleteProgress.lessonId,
        entitlement,
        learnerPath,
      });
      if (ref) continueLesson = { title: ref.title, href: ref.href };
    } catch {
      continueLesson = null;
    }
  }

  const pathwayIdList = pathwayRows.map((p) => p.pathwayId);
  let topicCoverageMap = new Map<string, PathwayTopicCoverage>();
  const tCov = performance.now();
  try {
    topicCoverageMap = await loadPathwayTopicCoverageBatch(userId, pathwayIdList);
  } catch (e) {
    reliability.pathwayTopicCoverage = false;
    degradedPanels.push("pathway_topic_coverage");
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      duration_ms: Math.round(performance.now() - tCov),
      outcome: "error",
      segment: "pathway_topic_coverage_batch",
      user_id_prefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      fallback_used: "false",
    });
  }

  const pathways: PathwayProgressCardModel[] = pathwayRows.map((p) => {
    const def = getExamPathwayById(p.pathwayId);
    const notStarted = Math.max(0, p.lessonsTotal - p.lessonsCompleted - p.lessonsInProgress);
    const pct = p.lessonsTotal > 0 ? Math.round((p.lessonsCompleted / p.lessonsTotal) * 100) : 0;
    const coverage = topicCoverageMap.get(p.pathwayId);
    return {
      pathwayId: p.pathwayId,
      shortLabel: p.shortLabel,
      trackKey: pathwayTrackKey(def?.roleTrack),
      lessonsTotal: p.lessonsTotal,
      lessonsCompleted: p.lessonsCompleted,
      lessonsInProgress: p.lessonsInProgress,
      notStarted,
      pct,
      topicsCovered: coverage?.topicsCovered ?? 0,
      topicsTotal: coverage?.topicsTotal ?? 0,
      topicCoveragePct: coverage?.coveragePct ?? 0,
    };
  });
  pathways.sort(sortPathways);

  const degraded =
    degradedPanels.length > 0 ? learnerAggregateDegradedState("temporarily_unavailable", degradedPanels) : undefined;
  logLearnerStudyLoadDiagnostics({
    operation: "loadProgressPagePayload",
    feature_surface: "progress_page",
    duration_ms: Math.round(performance.now() - tPage),
    outcome: degraded ? "degraded" : "ok",
    user_id_prefix: userId.slice(0, 8),
    fallback_used: degradedPanels.some((p) => p.includes("fallback")) ? "true" : "false",
    final_outcome: degraded ? "degraded" : "ok",
  });

  return {
    lessonsPool: {
      available: lessonsAvailable,
      completed: lessonsCompleted,
      inProgress: lessonsInProgressCount,
      notStarted: notStartedPool,
    },
    pathways,
    questionBank: {
      ledgerAttempted,
      ledgerAccuracyPct,
      topicsPracticed: reliability.topicLedgerTopicCount ? questionTopicsPracticed : 0,
      recentGraded: {
        correct: recentGraded.correct,
        total: recentGraded.total,
        sessionCount: recentGraded.sessionCount,
        accuracyPct: recentGraded.total > 0 ? Math.round((recentGraded.correct / recentGraded.total) * 100) : null,
      },
    },
    exams: {
      completedPracticeTests: practiceCompletedCount,
      recentPracticeTests,
      recentMocks,
    },
    continueLesson,
    degraded,
    segmentReliability: reliability,
  };
  } catch (e) {
    logLearnerStudyLoadDiagnostics({
      operation: "loadProgressPagePayload",
      feature_surface: "progress_page",
      duration_ms: Math.round(performance.now() - tPage),
      outcome: "error",
      segment: "uncaught",
      user_id_prefix: userId.slice(0, 8),
      reason: e instanceof Error ? e.message.slice(0, 400) : String(e).slice(0, 400),
      fallback_used: "false",
    });
    return {
      lessonsPool: { available: 0, completed: 0, inProgress: 0, notStarted: 0 },
      pathways: [],
      questionBank: {
        ledgerAttempted: 0,
        ledgerAccuracyPct: null,
        topicsPracticed: 0,
        recentGraded: { correct: 0, total: 0, sessionCount: 0, accuracyPct: null },
      },
      exams: { completedPracticeTests: 0, recentPracticeTests: [], recentMocks: [] },
      continueLesson: null,
      degraded: learnerAggregateDegradedState("temporarily_unavailable", ["progress_page_uncaught"]),
      segmentReliability: {
        ...ALL_SEGMENTS_RELIABLE,
        pathwaySummaries: false,
        contentLessonInventoryCount: false,
        scopedLessonProgress: false,
        topicLedgerAggregate: false,
        topicLedgerTopicCount: false,
        recentGradedSessions: false,
        examMockHistory: false,
        practiceTestHistory: false,
        pathwayTopicCoverage: false,
      },
    };
  }
}

export async function loadProgressPagePayload(userId: string, entitlement: AccessScope): Promise<ProgressPagePayload | null> {
  return loadWithLearnerPrivateReadCache(
    {
      surface: "progress-page",
      userId,
      ttlSeconds: 45,
      keyParts: [learnerPrivateReadAccessScopeKey(entitlement)],
      bypass: !entitlement.hasAccess || entitlement.reason === "admin_override",
    },
    () => loadProgressPagePayloadUncached(userId, entitlement),
  );
}
