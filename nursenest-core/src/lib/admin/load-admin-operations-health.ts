/**
 * Bounded aggregates for /admin/operations — jobs, automation logs, AI drafts, billing signals.
 * No Stripe API calls; webhook receipt counts are DB-only.
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

const WINDOW_7D_MS = 7 * 24 * 60 * 60 * 1000;
const WINDOW_24H_MS = 24 * 60 * 60 * 1000;

export type AdminOperationsHealth = {
  generatedAt: string;
  safeMode: boolean;
  database: {
    configured: boolean;
    status: "ok" | "skipped" | "error";
    latencyMs?: number;
    error?: string;
  };
  dataNotes: string[];
  backgroundJobs: {
    byStatus: Record<string, number>;
    pendingReady: number;
    pendingScheduledFuture: number;
    recentFailed: Array<{
      id: string;
      type: string;
      status: string;
      attempts: number;
      maxAttempts: number;
      lastError: string | null;
      scheduledFor: string;
      updatedAt: string;
    }>;
  };
  contentAutomation: {
    windowDays: number;
    failedByCategory: Array<{ category: string; count: number }>;
    warningsByCategory: Array<{ category: string; count: number }>;
    linkCheckWarnings7d: number;
    recentFailures: Array<{
      id: string;
      category: string;
      jobType: string;
      status: string;
      summary: string | null;
      error: string | null;
      createdAt: string;
      blogPostId: string | null;
    }>;
  };
  aiGenerationJobs: {
    windowDays: number;
    failedByTool7d: Array<{ tool: string; count: number }>;
    runningCount: number;
    recentFailures: Array<{
      id: string;
      tool: string;
      status: string;
      error: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  draftReview: {
    questionDrafts: { pending: number; rejected: number };
    lessonDrafts: { pending: number; rejected: number };
    flashcardDrafts: { pending: number; rejected: number };
  };
  blogAndPublish: {
    postsFailed: number;
    draftBatchItemsFailed7d: number;
    scheduleItemsFailed: number;
    scheduleItemsOverdue: number;
  };
  subscriptionsBilling: {
    pastDue: number;
    grace: number;
    stripeWebhookEvents24h: number;
  };
};

function emptyHealth(generatedAt: string): AdminOperationsHealth {
  return {
    generatedAt,
    safeMode: isRuntimeSafeMode(),
    database: { configured: false, status: "skipped" },
    dataNotes: ["Database URL not configured — operational metrics unavailable."],
    backgroundJobs: {
      byStatus: {},
      pendingReady: 0,
      pendingScheduledFuture: 0,
      recentFailed: [],
    },
    contentAutomation: {
      windowDays: 7,
      failedByCategory: [],
      warningsByCategory: [],
      linkCheckWarnings7d: 0,
      recentFailures: [],
    },
    aiGenerationJobs: {
      windowDays: 7,
      failedByTool7d: [],
      runningCount: 0,
      recentFailures: [],
    },
    draftReview: {
      questionDrafts: { pending: -1, rejected: -1 },
      lessonDrafts: { pending: -1, rejected: -1 },
      flashcardDrafts: { pending: -1, rejected: -1 },
    },
    blogAndPublish: {
      postsFailed: -1,
      draftBatchItemsFailed7d: -1,
      scheduleItemsFailed: -1,
      scheduleItemsOverdue: -1,
    },
    subscriptionsBilling: {
      pastDue: -1,
      grace: -1,
      stripeWebhookEvents24h: -1,
    },
  };
}

export async function loadAdminOperationsHealth(): Promise<AdminOperationsHealth> {
  const generatedAt = new Date().toISOString();
  if (!isDatabaseUrlConfigured()) {
    return emptyHealth(generatedAt);
  }

  const now = new Date();
  const since7d = new Date(now.getTime() - WINDOW_7D_MS);
  const since24h = new Date(now.getTime() - WINDOW_24H_MS);

  const dataNotes: string[] = [];
  if (isRuntimeSafeMode()) {
    dataNotes.push("Safe mode is ON — some writes and metrics may be reduced.");
  }

  const dbProbe = await checkDatabaseReadiness(4000);
  let database: AdminOperationsHealth["database"];
  if (!dbProbe.ok) {
    database = { configured: true, status: "error", error: dbProbe.error };
  } else if ("skipped" in dbProbe && dbProbe.skipped) {
    database = { configured: true, status: "skipped" };
  } else {
    database = { configured: true, status: "ok", latencyMs: dbProbe.latencyMs };
  }

  if (database.status === "error") {
    dataNotes.push("Database probe failed — counts below may be incomplete.");
  }

  const result = await withDatabaseFallback(
    async () => {
      const [
        bgGroups,
        pendingReady,
        pendingFuture,
        bgFailed,
        autoFailedGroups,
        autoWarnGroups,
        linkWarnings,
        autoRecent,
        aiFailedTools,
        aiRunning,
        aiRecentFailed,
        qPending,
        qRejected,
        lPending,
        lRejected,
        fPending,
        fRejected,
        blogFailed,
        batchItemsFailed,
        schedFailed,
        schedOverdue,
        subPastDue,
        subGrace,
        stripe24h,
      ] = await Promise.all([
        prisma.backgroundJob.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.backgroundJob.count({
          where: {
            status: JobStatus.PENDING,
            scheduledFor: { lte: now },
          },
        }),
        prisma.backgroundJob.count({
          where: {
            status: JobStatus.PENDING,
            scheduledFor: { gt: now },
          },
        }),
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
            updatedAt: true,
          },
        }),
        prisma.contentAutomationLog.groupBy({
          by: ["category"],
          where: {
            status: ContentAutomationLogStatus.FAILED,
            createdAt: { gte: since7d },
          },
          _count: { _all: true },
        }),
        prisma.contentAutomationLog.groupBy({
          by: ["category"],
          where: {
            status: ContentAutomationLogStatus.WARNING,
            createdAt: { gte: since7d },
          },
          _count: { _all: true },
        }),
        prisma.contentAutomationLog.count({
          where: {
            category: ContentAutomationLogCategory.BLOG_INTERNAL_LINK_CHECK,
            status: ContentAutomationLogStatus.WARNING,
            createdAt: { gte: since7d },
          },
        }),
        prisma.contentAutomationLog.findMany({
          where: {
            status: ContentAutomationLogStatus.FAILED,
            createdAt: { gte: since7d },
          },
          orderBy: { createdAt: "desc" },
          take: 40,
          select: {
            id: true,
            category: true,
            jobType: true,
            status: true,
            summary: true,
            error: true,
            createdAt: true,
            blogPostId: true,
          },
        }),
        prisma.aiGenerationJob.groupBy({
          by: ["tool"],
          where: {
            status: JobStatus.FAILED,
            createdAt: { gte: since7d },
          },
          _count: { _all: true },
        }),
        prisma.aiGenerationJob.count({
          where: { status: JobStatus.RUNNING },
        }),
        prisma.aiGenerationJob.findMany({
          where: {
            status: JobStatus.FAILED,
            createdAt: { gte: since7d },
          },
          orderBy: { updatedAt: "desc" },
          take: 20,
          select: {
            id: true,
            tool: true,
            status: true,
            error: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.generatedQuestionDraft.count({
          where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW },
        }),
        prisma.generatedQuestionDraft.count({
          where: { reviewStatus: DraftReviewStatus.REJECTED },
        }),
        prisma.generatedLessonDraft.count({
          where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW },
        }),
        prisma.generatedLessonDraft.count({
          where: { reviewStatus: DraftReviewStatus.REJECTED },
        }),
        prisma.generatedFlashcardDraft.count({
          where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW },
        }),
        prisma.generatedFlashcardDraft.count({
          where: { reviewStatus: DraftReviewStatus.REJECTED },
        }),
        prisma.blogPost.count({
          where: { postStatus: BlogPostStatus.FAILED },
        }),
        prisma.blogDraftGenerationBatchItem.count({
          where: {
            status: "FAILED",
            updatedAt: { gte: since7d },
          },
        }),
        prisma.blogBatchScheduleItem.count({
          where: { status: "FAILED" },
        }),
        prisma.blogBatchScheduleItem.count({
          where: {
            status: "PENDING",
            plannedPublishAt: { lt: now },
          },
        }),
        prisma.subscription.count({
          where: { status: SubscriptionStatus.PAST_DUE },
        }),
        prisma.subscription.count({
          where: { status: SubscriptionStatus.GRACE },
        }),
        prisma.stripeWebhookEvent.count({
          where: { createdAt: { gte: since24h } },
        }),
      ]);

      const byStatus: Record<string, number> = {};
      for (const g of bgGroups) {
        byStatus[g.status] = g._count._all;
      }

      return {
        backgroundJobs: {
          byStatus,
          pendingReady,
          pendingScheduledFuture: pendingFuture,
          recentFailed: bgFailed.map((j) => ({
            ...j,
            scheduledFor: j.scheduledFor.toISOString(),
            updatedAt: j.updatedAt.toISOString(),
          })),
        },
        contentAutomation: {
          windowDays: 7,
          failedByCategory: autoFailedGroups.map((g) => ({
            category: g.category,
            count: g._count._all,
          })),
          warningsByCategory: autoWarnGroups.map((g) => ({
            category: g.category,
            count: g._count._all,
          })),
          linkCheckWarnings7d: linkWarnings,
          recentFailures: autoRecent.map((r) => ({
            id: r.id,
            category: r.category,
            jobType: r.jobType,
            status: r.status,
            summary: r.summary,
            error: r.error,
            createdAt: r.createdAt.toISOString(),
            blogPostId: r.blogPostId,
          })),
        },
        aiGenerationJobs: {
          windowDays: 7,
          failedByTool7d: aiFailedTools.map((g) => ({
            tool: g.tool,
            count: g._count._all,
          })),
          runningCount: aiRunning,
          recentFailures: aiRecentFailed.map((j) => ({
            id: j.id,
            tool: j.tool,
            status: j.status,
            error: j.error,
            createdAt: j.createdAt.toISOString(),
            updatedAt: j.updatedAt.toISOString(),
          })),
        },
        draftReview: {
          questionDrafts: { pending: qPending, rejected: qRejected },
          lessonDrafts: { pending: lPending, rejected: lRejected },
          flashcardDrafts: { pending: fPending, rejected: fRejected },
        },
        blogAndPublish: {
          postsFailed: blogFailed,
          draftBatchItemsFailed7d: batchItemsFailed,
          scheduleItemsFailed: schedFailed,
          scheduleItemsOverdue: schedOverdue,
        },
        subscriptionsBilling: {
          pastDue: subPastDue,
          grace: subGrace,
          stripeWebhookEvents24h: stripe24h,
        },
      };
    },
    null,
  );

  if (!result) {
    dataNotes.push("Database read failed — showing empty operational snapshot.");
    return {
      ...emptyHealth(generatedAt),
      safeMode: isRuntimeSafeMode(),
      database,
      dataNotes: [...dataNotes, ...emptyHealth(generatedAt).dataNotes],
    };
  }

  dataNotes.push(
    "MRR, renewal dates, and Stripe Dashboard–only disputes are not queried here — use Stripe for billing detail.",
  );

  return {
    generatedAt,
    safeMode: isRuntimeSafeMode(),
    database,
    dataNotes,
    ...result,
  };
}
