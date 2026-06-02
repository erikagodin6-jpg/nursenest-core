import {
  BlogCampaignItemStatus,
  BlogPostStatus,
  DraftReviewStatus,
  JobStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { checkDatabaseReadiness } from "@/lib/db/prisma-readiness";

export type AdminWorkspaceStripData = {
  generatedAt: string;
  dbOk: boolean;
  recentJobs: Array<{
    id: string;
    type: string;
    status: JobStatus;
    attempts: number;
    maxAttempts: number;
    lastError: string | null;
    createdAt: string;
  }>;
  blog: {
    campaignQueuedOrGenerating: number;
    campaignFailed: number;
    overdueScheduled: number;
    nextScheduledTitle: string | null;
    nextScheduledAt: string | null;
  };
  aiDraftsPending: {
    questions: number;
    flashcards: number;
    lessons: number;
  };
};

export async function loadAdminWorkspaceStrip(): Promise<AdminWorkspaceStripData | null> {
  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) return null;
  const generatedAt = new Date().toISOString();
  try {
    const readiness = await checkDatabaseReadiness();
    const dbOk = readiness.ok;

    const [
      recentJobs,
      campaignQueuedOrGenerating,
      campaignFailed,
      overdueScheduled,
      nextScheduled,
      qPending,
      fPending,
      lPending,
    ] = await Promise.all([
      prisma.backgroundJob.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          type: true,
          status: true,
          attempts: true,
          maxAttempts: true,
          lastError: true,
          createdAt: true,
        },
      }),
      prisma.blogCampaignItem.count({
        where: { status: { in: [BlogCampaignItemStatus.QUEUED, BlogCampaignItemStatus.GENERATING] } },
      }),
      prisma.blogCampaignItem.count({ where: { status: BlogCampaignItemStatus.FAILED } }),
      prisma.blogPost.count({
        where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { lt: new Date() } },
      }),
      prisma.blogPost.findFirst({
        where: { postStatus: BlogPostStatus.SCHEDULED, publishAt: { gte: new Date() } },
        orderBy: { publishAt: "asc" },
        select: { title: true, publishAt: true },
      }),
      prisma.generatedQuestionDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
      prisma.generatedFlashcardDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
      prisma.generatedLessonDraft.count({ where: { reviewStatus: DraftReviewStatus.PENDING_REVIEW } }),
    ]);

    return {
      generatedAt,
      dbOk,
      recentJobs: recentJobs.map((j) => ({
        id: j.id,
        type: j.type,
        status: j.status,
        attempts: j.attempts,
        maxAttempts: j.maxAttempts,
        lastError: j.lastError,
        createdAt: j.createdAt.toISOString(),
      })),
      blog: {
        campaignQueuedOrGenerating,
        campaignFailed,
        overdueScheduled,
        nextScheduledTitle: nextScheduled?.title ?? null,
        nextScheduledAt: nextScheduled?.publishAt?.toISOString() ?? null,
      },
      aiDraftsPending: {
        questions: qPending,
        flashcards: fPending,
        lessons: lPending,
      },
    };
  } catch (e) {
    console.error("[loadAdminWorkspaceStrip]", e);
    return null;
  }
}
