/**
 * Bounded aggregates for /admin/operations — jobs, automation logs, AI drafts, billing signals.
 * No placeholder metrics; omits or notes unavailable data.
 */
import {
  BlogBatchScheduleItemStatus,
  BlogDraftGenerationBatchItemStatus,
  BlogPostStatus,
  ContentAutomationLogCategory,
  ContentAutomationLogStatus,
  DraftReviewStatus,
  JobStatus,
  SubscriptionStatus,
} from "@prisma/client";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallback } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";

export const OPERATIONS_LOG_WINDOW_HOURS_DEFAULT = 24 * 7;

export type AdminOperationsHealth = {
  generatedAt: string;
  safeMode: boolean;
  database: {
    configured: boolean;
    status: "ok" | "skipped" | "error";
    latencyMs?: number;
    error?: string;
  };
  windows: { automationLogHours: number; aiJobHours: number };
  backgroundJobs: {
    byStatus: Record<string, number>;
    pendingReady: number;
    pendingScheduledFuture: number;
    running: number;
    recentFailed: Array<{
      id: string;
      type: string;
      status: JobStatus;
      attempts: number;
      maxAttempts: number;
      lastError: string | null;
      scheduledFor: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  contentAutomation: {
    failedByCategory: Array<{ category: string; count: number }>;
    warningsByCategory: Array<{ category: string; count: number }>;
    linkCheckWarnings: number;
    publishFailures: number;
    recentFailures: Array<{
      id: string;
      category: string;
      jobType: string;
      summary: string | null;
      error: string | null;
      createdAt: string;
      blogPostId: string | null;
    }>;
  };
  aiGeneration: {
    failedByTool: Array<{ tool: string; count: number }>;
    running: number;
    recentFailures: Array<{
      id: string;
      tool: string;
      error: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  blogPublishing: {
    postsFailed: number;
    draftBatchItemsFailedWindow: number;
    scheduleItemsFailed: number;
    scheduleItemsOverdue: number;
  };
  draftReview: {
    questionPending: number;
    questionRejected: number;
    lessonPending: number;
    lessonRejected: number;
    flashcardPending: number;
    flashcardRejected: number;
  };
  subscriptionsBilling: {
    pastDue: number;
    grace: number;
    stripeWebhookEvents24h: number;
  };
  dataNotes: string[];
};

function emptyHealth(generatedAt: string): AdminOperationsHealth {
  return {
    generatedAt,
    safeMode: isRuntimeSafeMode(),
    database: { configured: false, status: "skipped" },
    windows: { automationLogHours: OPERATIONS_LOG_WINDOW_HOURS_DEFAULT, aiJobHours: OPERATIONS_LOG_WINDOW_HOURS_DEFAULT },
    backgroundJobs: {
      byStatus: {},
      pendingReady: 0,
      pendingScheduledFuture: 0,
      running: 0,
      recentFailed: [],
    },
    contentAutomation: {
      failedByCategory: [],
      warningsByCategory: [],
      linkCheckWarnings: 0,
      publishFailures: 0,
      recentFailures: [],
    },
    aiGeneration: { failedByTool: [], running: 0, recentFailures: [] },
    blogPublishing: {
      postsFailed: 0,
      draftBatchItemsFailedWindow: 0,
      scheduleItemsFailed: 0,
      scheduleItemsOverdue: 0,
    },
    draftReview: {
      questionPending: 0,
      questionRejected: 0,
      lessonPending: 0,
      lessonRejected: 0,
      flashcardPending: 0,
      flashcardRejected: 0,
    },
    subscriptionsBilling: { pastDue: 0, grace: 0, stripeWebhookEvents24h: 0 },
    dataNotes: ["Database URL not configured — operational metrics unavailable."],
  };
}

export async function loadAdminOperationsHealth(): Promise<AdminOperationsHealth> {
  const generatedAt = new Date().toISOString();
  const safeMode = isRuntimeSafeMode();
  const dataNotes: string[] = [];

  if (!isDatabaseUrlConfigured()) {
    const h = emptyHealth(generatedAt);
    h.safeMode = safeMode;
    return h;
  }

  const dbProbe = await checkDatabaseReadiness(4000);
  const database =
    dbProbe.ok && "latencyMs" in dbProbe
      ? { configured: true, status: "ok" as const, latencyMs: dbProbe.latencyMs }
      : dbProbe.ok && "skipped" in dbProbe
        ? { configured: true, status: "skipped" as const }
        : {
            configured: true,
            status: "error" as const,
            error: "error" in dbProbe ? dbProbe.error : "unavailable",
          };

  if (database.status === "error") {
    dataNotes.push("Database probe failed — counts below may be incomplete.");
  }

  const automationLogHours = OPERATIONS_LOG_WINDOW_HOURS_DEFAULT;
  const aiJobHours = OPERATIONS_LOG_WINDOW_HOURS_DEFAULT;
  const sinceAuto = new Date(Date.now() - automationLogHours * 60 * 60 * 1000);
  const sinceAi = new Date(Date.now() - aiJobHours * 60 * 60 * 1000);
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const now = new Date();

  const [
    bgGroup,
    pendingReady,
    pendingFuture,
    bgRunning,
    bgFailedRecent,
    autoFailedGroup,
    autoWarnGroup,
    linkWarn,
    publishFailCount,
    autoRecentFail,
    aiFailGroup,
    aiRunning,
    aiFailRecent,
    blogFailedPosts,
    batchItemsFailed,
    schedFailed,
    schedOverdue,
    qPending,
    qRej,
    lPending,
    lRej,
    fPending,
    fRej,
    subPastDue,
    subGrace,
    stripeEv,
  ] = await withDatabaseFallback(
    () =>
      Promise.all([
        prisma.backgroundJob.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.backgroundJob.count({
          where: { status: JobStatus.PENDING, scheduledFor: { lte: now } },
        }),
        prisma.backgroundJob.count({
          where: { status: JobStatus.PENDING, scheduledFor: { gt: now } },
        }),
        prisma.backgroundJob.count({ where: { status: JobStatus.RUNNING } }),
        prisma.backgroundJob.findMany({
          where: { status: JobStatus.FAILED },
          orderBy: { updatedAt: "desc" },
          take: 25,
          select: {
            id: true,
            type: true,
            status: true,
            attempts: true,
            maxAttempts: true,
            lastError: true,
            scheduledFor: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.contentAutomationLog.groupBy({
          by: ["category"],
          where: {
            status: ContentAutomationLogStatus.FAILED,
            createdAt: { gte: sinceAuto },
          },
          _count: { _all: true },
        }),
        prisma.contentAutomationLog.groupBy({
          by: ["category"],
          where: {
            status: ContentAutomationLogStatus.WARNING,
            createdAt: { gte: sinceAuto },
          },
          _count: { _all: true },
        }),
        prisma.contentAutomationLog.count({
          where: {
            category: ContentAutomationLogCategory.BLOG_INTERNAL_LINK_CHECK,
            status: ContentAutomationLogStatus.WARNING,
            createdAt: { gte: sinceAuto },
          },
        }),
        prisma.contentAutomationLog.count({
          where: {
            category: { in: [ContentAutomationLogCategory.BLOG_PUBLISH, ContentAutomationLogCategory.BLOG_MARK_FAILED] },
            status: ContentAutomationLogStatus.FAILED,
            createdAt: { gte: sinceAuto },
          },
        }),
        prisma.contentAutomationLog.findMany({
          where: { status: ContentAutomationLogStatus.FAILED, createdAt: { gte: sinceAuto } },
          orderBy: { createdAt: "desc" },
          take: 40,
          select: {
            id: true,
            category: true,
            jobType: true,
            summary: true,
            error: true,
            createdAt: true,
            blogPostId: true,
          },
        }),
        prisma.aiGenerationJob.groupBy({
          by: ["tool"],
          where: { status: JobStatus.FAILED, createdAt: { gte: sinceAi } },
          _count: { _all: true },
        }),
        prisma.aiGenerationJob.count({ where: { status: JobStatus.RUNNING } }),
        prisma.aiGenerationJob.findMany({
          where: { status: JobStatus.FAILED, createdAt: { gte: sinceAi } },
          orderBy: { updatedAt: "desc" },
          take: 25,
          select: { id: true, tool: true, error: true, createdAt: true, updatedAt: true },
        }),
        prisma.blogPost.count({ where: { postStatus: BlogPostStatus.FAILED } }),
        prisma.blogDraftGenerationBatchItem.count({
          where: { status: BlogDraftGenerationBatchItemStatus.FAILED, updatedAt: { gte: sinceAuto } },
        }),
        prisma.blogBatchScheduleItem.count({ where: { status: BlogBatchScheduleItemStatus.FAILED } }),
        prisma.blogBatchScheduleItem.count({
          where: { status: BlogBatchScheduleItemStatus.PENDING, plannedPublishAt: { lt: now } },
        }),
        prisma.generatedQuestionDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
        prisma.generatedQuestionDraft.count({ where: { reviewStatus: DraftReviewStatus.REJECTED } }),
        prisma.generatedLessonDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
        prisma.generatedLessonDraft.count({ where: { reviewStatus: DraftReviewStatus.REJECTED } }),
        prisma.generatedFlashcardDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
        prisma.generatedFlashcardDraft.count({ where: { reviewStatus: DraftReviewStatus.REJECTED } }),
        prisma.subscription.count({ where: { status: SubscriptionStatus.PAST_DUE } }),
        prisma.subscription.count({ where: { status: SubscriptionStatus.GRACE } }),
        prisma.stripeWebhookEvent.count({ where: { createdAt: { gte: since24h } } }),
      ]),
    [
      [],
      0,
      0,
      0,
      [],
      [],
      [],
      0,
      0,
      [],
      [],
      0,
      [],
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
  );

  const byStatus: Record<string, number> = {};
  for (const row of bgGroup) {
    byStatus[row.status] = row._count._all;
  }

  dataNotes.push(
    `Automation log aggregates: last ${automationLogHours}h. AI job failures: last ${aiJobHours}h. Stripe webhook count is a 24h delivery dedupe signal, not revenue.`,
  );

  return {
    generatedAt,
    safeMode,
    database,
    windows: { automationLogHours, aiJobHours },
    backgroundJobs: {
      byStatus,
      pendingReady,
      pendingScheduledFuture,
      running: bgRunning,
      recentFailed: bgFailedRecent.map((j) => ({
        ...j,
        scheduledFor: j.scheduledFor.toISOString(),
        createdAt: j.createdAt.toISOString(),
        updatedAt: j.updatedAt.toISOString(),
      })),
    },
    contentAutomation: {
      failedByCategory: autoFailedGroup
        .map((r) => ({ category: r.category, count: r._count._all }))
        .sort((a, b) => b.count - a.count),
      warningsByCategory: autoWarnGroup
        .map((r) => ({ category: r.category, count: r._count._all }))
        .sort((a, b) => b.count - a.count),
      linkCheckWarnings: linkWarn,
      publishFailures: publishFailCount,
      recentFailures: autoRecentFail.map((r) => ({
        id: r.id,
        category: r.category,
        jobType: r.jobType,
        summary: r.summary,
        error: r.error,
        createdAt: r.createdAt.toISOString(),
        blogPostId: r.blogPostId,
      })),
    },
    aiGeneration: {
      failedByTool: aiFailGroup
        .map((r) => ({ tool: r.tool, count: r._count._all }))
        .sort((a, b) => b.count - a.count),
      running: aiRunning,
      recentFailures: aiFailRecent.map((r) => ({
        id: r.id,
        tool: r.tool,
        error: r.error,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    },
    blogPublishing: {
      postsFailed: blogFailedPosts,
      draftBatchItemsFailedWindow: batchItemsFailed,
      scheduleItemsFailed: schedFailed,
      scheduleItemsOverdue: schedOverdue,
    },
    draftReview: {
      questionPending: qPending,
      questionRejected: qRej,
      lessonPending: lPending,
      lessonRejected: lRej,
      flashcardPending: fPending,
      flashcardRejected: fRej,
    },
    subscriptionsBilling: {
      pastDue: subPastDue,
      grace: subGrace,
      stripeWebhookEvents24h: stripeEv,
    },
    dataNotes,
  };
}
