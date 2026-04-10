import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  EMPTY_QUESTION_SNAPSHOT,
  ZERO_LESSON_COUNT,
  emptyPathwayLessonsPageResult,
} from "@/lib/exam-pathways/marketing-hub-fallbacks";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import {
  countPathwayLessons,
  getPathwayLessonsPage,
  listTopicClusters,
  resolvePathwayLaunchBundle,
  type PathwayLessonsPageResult,
  type ResolvedPathwayLaunchBundle,
  type TopicCluster,
} from "@/lib/lessons/pathway-lesson-loader";
import { loadNpCanadaInventoryGate } from "@/lib/np/np-pathway-inventory-gate";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type MarketingHubDataLoadContext = {
  pathname: string;
  /** URL segment: `us` | `canada` (not UI language). */
  locale: string;
  country: string;
  examCode: string;
  pathwayId: string;
  roleTrack?: string;
};

function logHubDataLoadFailed(
  ctx: MarketingHubDataLoadContext,
  dependencyName: string,
  err: unknown,
): void {
  const message = err instanceof Error ? err.message : String(err);
  const isTimeout = message.includes("hub_optional_task_timeout");
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

const HUB_OPTIONAL_TASK_TIMEOUT_MS = 14_000;

async function runHubOptionalTask<T>(p: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("hub_optional_task_timeout")), HUB_OPTIONAL_TASK_TIMEOUT_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type MarketingExamHubOptionalBlocks = {
  npInventory: Awaited<ReturnType<typeof loadNpCanadaInventoryGate>>;
  questionSnapshot: PathwayQuestionBankSnapshot;
  pathwayLessonCount: number;
};

/**
 * Loads non-critical hub aggregates with `Promise.allSettled` — never throws; maps failures to safe defaults.
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
    { name: "lesson_count", run: () => countPathwayLessons(pathway.id) },
  ];

  const settled = await Promise.allSettled(tasks.map((t) => runHubOptionalTask(t.run())));

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

export type PathwayLessonsHubAggregates = {
  pageResult: PathwayLessonsPageResult;
  questionSnapshot: PathwayQuestionBankSnapshot;
  pathwayLessonTotal: number;
  launchBundle: ResolvedPathwayLaunchBundle | null;
  topics: TopicCluster[];
};

/**
 * Lessons hub: parallel optional loads with per-dependency fallbacks (never throws).
 */
export async function loadPathwayLessonsHubAggregates(
  pathway: ExamPathwayDefinition,
  args: {
    pageRequested: number;
    pageSizeRequested: number;
    lessonContentLocale: string;
    listOpts: { q?: string } | undefined;
    qEffective: string;
    skipLaunchBundle: boolean;
  },
  ctx: MarketingHubDataLoadContext,
): Promise<PathwayLessonsHubAggregates> {
  const { pageRequested, pageSizeRequested, lessonContentLocale, listOpts, qEffective, skipLaunchBundle } = args;

  const tasks: { name: string; run: () => Promise<unknown> }[] = [
    {
      name: "lessons_page",
      run: () => getPathwayLessonsPage(pathway.id, pageRequested, pageSizeRequested, lessonContentLocale, listOpts),
    },
    { name: "question_snapshot", run: () => loadPathwayQuestionBankSnapshot(pathway.id) },
    { name: "lesson_count", run: () => countPathwayLessons(pathway.id) },
    {
      name: "launch_bundle",
      run: () =>
        skipLaunchBundle ? Promise.resolve(null) : resolvePathwayLaunchBundle(pathway.id, lessonContentLocale),
    },
    { name: "topic_clusters", run: () => listTopicClusters(pathway.id, lessonContentLocale) },
  ];

  const settled = await Promise.allSettled(tasks.map((t) => runHubOptionalTask(t.run())));

  let pageResult: PathwayLessonsPageResult = emptyPathwayLessonsPageResult(pageRequested, pageSizeRequested);
  let questionSnapshot: PathwayQuestionBankSnapshot = EMPTY_QUESTION_SNAPSHOT;
  let pathwayLessonTotal = ZERO_LESSON_COUNT;
  let launchBundle: ResolvedPathwayLaunchBundle | null = null;
  let topics: TopicCluster[] = [];

  settled.forEach((result, i) => {
    const { name } = tasks[i]!;
    if (result.status === "rejected") {
      logHubDataLoadFailed(ctx, name, result.reason);
      return;
    }
    const val = result.value;
    if (name === "lessons_page") {
      pageResult =
        val && typeof val === "object" && "items" in val && "total" in val
          ? (val as PathwayLessonsPageResult)
          : emptyPathwayLessonsPageResult(pageRequested, pageSizeRequested);
    } else if (name === "question_snapshot") {
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
  if (lessonCountRejected) {
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
  if (topicClusterRejected) {
    recordRouteRenderFallback({
      fallbackType: "topic_cluster_ui_degraded",
      pathname: ctx.pathname,
      pathwayId: ctx.pathwayId,
      examCode: ctx.examCode,
      country: ctx.country,
    });
  }

  return { pageResult, questionSnapshot, pathwayLessonTotal, launchBundle, topics };
}
