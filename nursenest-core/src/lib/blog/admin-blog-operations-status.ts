import { ContentAutomationLogCategory, ContentAutomationLogStatus } from "@prisma/client";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
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
  const key = assertOpenAiKeyConfigured();
  const translationGenerationAvailable = isAdminAiGenerationEnabled() && key.ok;

  const [canonicalBlogPostCount, localizedVariantCount, staticFallbackEnabled, lastGenerationAttempt, lastGenerationSuccess, lastGenerationFailure, lastWeakUpgradeRun] =
    await Promise.all([
      withDatabaseFallback(() => prisma.blogPost.count({ where: { canonicalPostId: null } }), 0),
      withDatabaseFallback(
        () => prisma.localizedBlogArticle.count(),
        null as number | null,
      ),
      canUseStaticBlogFallback(),
      getLatestActivity({
        category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
        jobType: "legacy_generate_ai",
      }),
      getLatestActivity({
        category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
        jobType: "legacy_generate_ai",
        status: ContentAutomationLogStatus.SUCCEEDED,
      }),
      getLatestActivity({
        category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
        jobType: "legacy_generate_ai",
        status: ContentAutomationLogStatus.FAILED,
      }),
      getLatestActivity({
        category: ContentAutomationLogCategory.BLOG_AI_SIMPLE,
        jobType: "upgrade_weak",
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
