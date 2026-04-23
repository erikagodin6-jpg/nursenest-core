import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";
import {
  loadPathwayLessonsHubPageWithTelemetry,
  type PathwayLessonsHubPageLoadState,
} from "@/lib/exam-pathways/marketing-hub-lessons-page-fetch";
import {
  EMPTY_QUESTION_SNAPSHOT,
  ZERO_LESSON_COUNT,
  emptyPathwayLessonsPageResult,
} from "@/lib/exam-pathways/marketing-hub-fallbacks";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import {
  countPathwayLessonsPublic,
  getPathwayLessonsPageFresh,
  listTopicClustersForPublicNavigation,
  resolvePathwayLaunchBundle,
  type PathwayLessonsPageResult,
  type ResolvedPathwayLaunchBundle,
  type TopicCluster,
} from "@/lib/lessons/pathway-lesson-loader";
import { loadNpCanadaInventoryGate } from "@/lib/np/np-pathway-inventory-gate";
import { describeRejectedTask } from "@/lib/loading/critical-load-outcome";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type { MarketingHubDataLoadContext } from "@/lib/exam-pathways/marketing-hub-data-context";

function logHubDataLoadFailed(
  ctx: MarketingHubDataLoadContext,
  dependencyName: string,
  err: unknown,
): void {
  const message = err instanceof Error ? err.message : String(err);
  const isTimeout = /timeout|ETIMEDOUT/i.test(message);
  safeServerLog("exam_pathway_hub", isTimeout ? "hub_data_load_timeout" : "hub_data_load_failed", {
    event: isTimeout ? "hub_data_load_timeout" : "hub_data_load_failed",
    pathname: ctx.pathname,
    locale: ctx.locale,
    country: ctx.country,
    examCode: ctx.examCode,
    pathway_id: ctx.pathwayId,
    role_track: ctx.roleTrack,
    dependency_name: dependencyName,
    error_message: message.slice(0, 500),
  });
  if (!isTimeout) {
    recordRouteRenderFallback({
      fallbackType: "hub_data_load_failed",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
      dependencyName: dependencyName,
    });
  }
}

export type MarketingExamHubOptionalBlocks = {
  npInventory: Awaited<ReturnType<typeof loadNpCanadaInventoryGate>>;
  questionSnapshot: PathwayQuestionBankSnapshot;
  pathwayLessonCount: number;
};

/**
 * Loads hub aggregates with `Promise.allSettled` — never throws; logs each rejection; applies defaults only for
 * rejected segments so callers can still render (marketing shell). For lessons pages, use
 * {@link loadPathwayLessonsHubAggregates} rejection flags — do not treat defaults as “verified empty”.
 */
export async function loadMarketingExamHubOptionalBlocks(
  pathway: ExamPathwayDefinition,
  ctx: MarketingHubDataLoadContext,
): Promise<MarketingExamHubOptionalBlocks> {
  const tasks: { name: string; run: () => Promise<unknown> }[] = [
    {
      name: "np_inventory",
      run: () => (pathway.id === "ca-np-cnple" ? loadNpCanadaInventoryGate() : Promise.resolve(null)),
    },
    { name: "question_snapshot", run: () => loadPathwayQuestionBankSnapshot(pathway.id) },
    { name: "lesson_count", run: () => countPathwayLessonsPublic(pathway.id) },
  ];

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));

  let npInventory: Awaited<ReturnType<typeof loadNpCanadaInventoryGate>> = null;
  let questionSnapshot: PathwayQuestionBankSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let pathwayLessonCount = ZERO_LESSON_COUNT;

  settled.forEach((result, i) => {
    const { name } = tasks[i]!;
    if (result.status === "rejected") {
      logHubDataLoadFailed(ctx, name, result.reason);
      return;
    }
    const val = result.value;
    if (name === "np_inventory") {
      npInventory = val as typeof npInventory;
    } else if (name === "question_snapshot") {
      questionSnapshot =
        val && typeof val === "object" && "status" in val
          ? (val as PathwayQuestionBankSnapshot)
          : EMPTY_QUESTION_SNAPSHOT;
    } else if (name === "lesson_count") {
      pathwayLessonCount = typeof val === "number" && Number.isFinite(val) ? val : ZERO_LESSON_COUNT;
    }
  });

  const questionSnapRejected = settled.some(
    (result, i) => tasks[i]!.name === "question_snapshot" && result.status === "rejected",
  );
  if (questionSnapRejected || questionSnapshot.status === "unavailable") {
    recordRouteRenderFallback({
      fallbackType: "empty_question_snapshot",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }
  const lessonCountRejected = settled.some(
    (result, i) => tasks[i]!.name === "lesson_count" && result.status === "rejected",
  );
  if (lessonCountRejected) {
    recordRouteRenderFallback({
      fallbackType: "zero_lesson_count_fallback",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }

  return { npInventory, questionSnapshot, pathwayLessonCount };
}

export type { PathwayLessonsHubPageLoadState } from "@/lib/exam-pathways/marketing-hub-lessons-page-fetch";

export type PathwayLessonsHubAggregates = {
  pageResult: PathwayLessonsPageResult;
  /** Explicit outcome for the paginated lesson list — never infer “empty inventory” from `pageResult` alone. */
  lessonsPageLoad: PathwayLessonsHubPageLoadState;
  questionSnapshot: PathwayQuestionBankSnapshot;
  pathwayLessonTotal: number;
  launchBundle: ResolvedPathwayLaunchBundle | null;
  topics: TopicCluster[];
  /** True when the primary lesson list failed or returned an unusable payload — same as `lessonsPageLoad.status === "error"`. */
  lessonsPageLoadRejected: boolean;
  /** True when the question bank snapshot task failed — do not infer “no adaptive pool” from defaults alone. */
  questionSnapshotLoadRejected: boolean;
  /** True when `countPathwayLessonsPublic` failed (only when that task ran). */
  pathwayLessonCountLoadRejected: boolean;
  /** True when topic cluster navigation query failed (only when that task ran). */
  topicClustersLoadRejected: boolean;
};

/**
 * Lessons hub: **await the paginated lesson list first** (no `Promise.race` timeouts, no silent empty).
 * Satellites run via `Promise.allSettled` and may degrade independently.
 */
export async function loadPathwayLessonsHubAggregates(
  pathway: ExamPathwayDefinition,
  args: {
    pageRequested: number;
    pageSizeRequested: number;
    lessonContentLocale: string;
    listOpts: { q?: string; topicSlugsIn?: string[] } | undefined;
    qEffective: string;
    skipLaunchBundle: boolean;
    includeLessonCount?: boolean;
    includeLaunchBundle?: boolean;
    includeTopics?: boolean;
  },
  ctx: MarketingHubDataLoadContext,
  deps?: { fetchLessonsPageFresh?: typeof getPathwayLessonsPageFresh },
): Promise<PathwayLessonsHubAggregates> {
  const {
    pageRequested,
    pageSizeRequested,
    lessonContentLocale,
    listOpts,
    skipLaunchBundle,
    includeLessonCount = true,
    includeLaunchBundle = true,
    includeTopics = true,
  } = args;

  const fetchLessons = deps?.fetchLessonsPageFresh ?? getPathwayLessonsPageFresh;
  const { pageResult, lessonsPageLoad } = await loadPathwayLessonsHubPageWithTelemetry(
    pathway.id,
    { pageRequested, pageSizeRequested, lessonContentLocale, listOpts },
    ctx,
    fetchLessons,
  );
  const lessonsPageLoadRejected = lessonsPageLoad.status === "error";

  const tasks: { name: string; run: () => Promise<unknown> }[] = [
    { name: "question_snapshot", run: () => loadPathwayQuestionBankSnapshot(pathway.id) },
    { name: "lesson_count", run: () => (includeLessonCount ? countPathwayLessonsPublic(pathway.id) : Promise.resolve(ZERO_LESSON_COUNT)) },
    {
      name: "launch_bundle",
      run: () =>
        !includeLaunchBundle || skipLaunchBundle ? Promise.resolve(null) : resolvePathwayLaunchBundle(pathway.id, lessonContentLocale),
    },
    {
      name: "topic_clusters",
      run: () => (includeTopics ? listTopicClustersForPublicNavigation(pathway.id, lessonContentLocale) : Promise.resolve([])),
    },
  ];

  const settled = await Promise.allSettled(tasks.map((t) => t.run()));

  let questionSnapshot: PathwayQuestionBankSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let pathwayLessonTotal = ZERO_LESSON_COUNT;
  let launchBundle: ResolvedPathwayLaunchBundle | null = null;
  let topics: TopicCluster[] = [];

  settled.forEach((result, i) => {
    const { name } = tasks[i]!;
    if (result.status === "rejected") {
      logHubDataLoadFailed(ctx, name, result.reason);
      const { reason, retryable } = describeRejectedTask(name, result.reason);
      safeServerLog("exam_pathway_hub", "hub_aggregate_task_outcome", {
        pathway_id: ctx.pathwayId,
        pathname: ctx.pathname,
        task: name,
        outcome: "error",
        retryable: retryable ? "1" : "0",
        reason: reason.slice(0, 500),
      });
      return;
    }
    const val = result.value;
    if (name === "question_snapshot") {
      questionSnapshot =
        val && typeof val === "object" && "status" in val
          ? (val as PathwayQuestionBankSnapshot)
          : EMPTY_QUESTION_SNAPSHOT;
    } else if (name === "lesson_count") {
      pathwayLessonTotal = typeof val === "number" && Number.isFinite(val) ? val : ZERO_LESSON_COUNT;
    } else if (name === "launch_bundle") {
      launchBundle = val as ResolvedPathwayLaunchBundle | null;
    } else if (name === "topic_clusters") {
      topics = Array.isArray(val) ? (val as TopicCluster[]) : [];
    }
  });

  const questionSnapRejected = settled.some(
    (result, i) => tasks[i]!.name === "question_snapshot" && result.status === "rejected",
  );
  if (questionSnapRejected || questionSnapshot.status === "unavailable") {
    recordRouteRenderFallback({
      fallbackType: "empty_question_snapshot",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }
  const lessonCountRejected = settled.some(
    (result, i) => tasks[i]!.name === "lesson_count" && result.status === "rejected",
  );
  if (includeLessonCount && lessonCountRejected) {
    recordRouteRenderFallback({
      fallbackType: "zero_lesson_count_fallback",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }
  const topicClusterRejected = settled.some(
    (result, i) => tasks[i]!.name === "topic_clusters" && result.status === "rejected",
  );
  if (includeTopics && topicClusterRejected) {
    recordRouteRenderFallback({
      fallbackType: "topic_cluster_ui_degraded",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }

  const questionSnapIndex = tasks.findIndex((t) => t.name === "question_snapshot");
  const questionSnapshotLoadRejected = questionSnapIndex >= 0 && settled[questionSnapIndex]?.status === "rejected";

  const lessonCountIndex = tasks.findIndex((t) => t.name === "lesson_count");
  const pathwayLessonCountLoadRejected =
    includeLessonCount && lessonCountIndex >= 0 && settled[lessonCountIndex]?.status === "rejected";

  const topicClusterIndex = tasks.findIndex((t) => t.name === "topic_clusters");
  const topicClustersLoadRejected =
    includeTopics && topicClusterIndex >= 0 && settled[topicClusterIndex]?.status === "rejected";

  return {
    pageResult,
    lessonsPageLoad,
    questionSnapshot,
    pathwayLessonTotal,
    launchBundle,
    topics,
    lessonsPageLoadRejected,
    questionSnapshotLoadRejected,
    pathwayLessonCountLoadRejected,
    topicClustersLoadRejected,
  };
}
