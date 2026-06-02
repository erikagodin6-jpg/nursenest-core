import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";
import { BLOG_AUTOMATION_LOG_JOB_TYPES } from "@/lib/admin/blog-content-automation-log";
import { canUseStaticBlogFallback } from "@/lib/blog/safe-blog-queries";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";

type ActivityPoint = {
  createdAt: Date;
  status: ContentAutomationLogStatus;
  summary: string | null;
  error: string | null;
};

async function getLatestActivity(where: Record<string, unknown>): Promise<ActivityPoint | null> {
  return withDatabaseFallback(
    () =>
      prisma.contentAutomationLog.findFirst({
        where,
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          status: true,
          summary: true,
          error: true,
        },
      }),
    null,
  );
}

function generationJobTypeWhere(): Record<string, unknown> {
  return {
    in: [
      BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_AI,
      BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_AI_LEGACY,
      BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_LOCALIZED,
    ],
  };
}

export type AdminBlogOperationsStatus = {
  canonicalBlogPostCount: number;
  localizedVariantCount: number | null;
  staticFallbackEnabled: boolean;
  productionMode: boolean;
  translationGenerationAvailable: boolean;
  recentActivity: {
    lastGenerationAttempt: ActivityPoint | null;
    lastGenerationSuccess: ActivityPoint | null;
    lastGenerationFailure: ActivityPoint | null;
    lastWeakUpgradeRun: ActivityPoint | null;
  };
};

export async function getAdminBlogOperationsStatus(): Promise<AdminBlogOperationsStatus> {
  const aiGate = getAdminAiGenerationGate();
  const translationGenerationAvailable = aiGate.runnable;

  const [canonicalBlogPostCount, localizedVariantCount, staticFallbackEnabled, lastGenerationAttempt, lastGenerationSuccess, lastGenerationFailure, lastWeakUpgradeRun] =
    await Promise.all([
      withDatabaseFallback(() => prisma.blogPost.count({ where: { canonicalPostId: null } }), 0),
      withDatabaseFallback(
        () => prisma.localizedBlogArticle.count(),
        null as number | null,
      ),
      canUseStaticBlogFallback(),
      getLatestActivity({
        OR: [
          { category: ContentAutomationLogCategory.BLOG_AI_SIMPLE, jobType: generationJobTypeWhere() },
          {
            category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
            jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_LOCALIZED,
          },
        ],
      }),
      getLatestActivity({
        OR: [
          { category: ContentAutomationLogCategory.BLOG_AI_SIMPLE, jobType: generationJobTypeWhere() },
          {
            category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
            jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_LOCALIZED,
          },
        ],
        status: ContentAutomationLogStatus.SUCCEEDED,
      }),
      getLatestActivity({
        OR: [
          { category: ContentAutomationLogCategory.BLOG_AI_SIMPLE, jobType: generationJobTypeWhere() },
          {
            category: ContentAutomationLogCategory.BLOG_CONTROL_PANEL_PIPELINE,
            jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.GENERATE_LOCALIZED,
          },
        ],
        status: ContentAutomationLogStatus.FAILED,
      }),
      getLatestActivity({
        category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
        jobType: BLOG_AUTOMATION_LOG_JOB_TYPES.UPGRADE_WEAK,
      }),
    ]);

  return {
    canonicalBlogPostCount,
    localizedVariantCount,
    staticFallbackEnabled,
    productionMode: process.env.NODE_ENV === "production",
    translationGenerationAvailable,
    recentActivity: {
      lastGenerationAttempt,
      lastGenerationSuccess,
      lastGenerationFailure,
      lastWeakUpgradeRun,
    },
  };
}
