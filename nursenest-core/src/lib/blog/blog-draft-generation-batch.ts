import {
  BlogDraftGenerationBatchItemStatus,
  BlogDraftGenerationBatchStatus,
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostTemplate,
} from "@prisma/client";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { generateAutomatedBlogPost } from "@/lib/blog/blog-automation-engine";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { logDraftBatchItemRun } from "@/lib/admin/blog-content-automation-log";
import { prisma } from "@/lib/db";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";
const STALE_GENERATING_MS = 25 * 60 * 1000;

export async function refreshDraftGenerationBatchStats(batchId: string): Promise<void> {
  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id: batchId },
    select: { id: true, status: true },
  });
  if (!batch) return;

  const counts = await prisma.blogDraftGenerationBatchItem.groupBy({
    by: ["status"],
    where: { batchId },
    _count: { id: true },
  });
  const map = Object.fromEntries(counts.map((c) => [c.status, c._count.id])) as Record<string, number>;
  const completed = map.COMPLETED ?? 0;
  const failed = map.FAILED ?? 0;
  const skipped = map.SKIPPED ?? 0;
  const pending = map.PENDING ?? 0;
  const generating = map.GENERATING ?? 0;

  let nextStatus = batch.status;
  if (batch.status === BlogDraftGenerationBatchStatus.ACTIVE && pending === 0 && generating === 0) {
    nextStatus = BlogDraftGenerationBatchStatus.COMPLETED;
  }

  await prisma.blogDraftGenerationBatch.update({
    where: { id: batchId },
    data: {
      completedCount: completed,
      failedCount: failed,
      skippedCount: skipped,
      status: nextStatus,
    },
  });
}

async function resetStaleGeneratingItems(batchId: string, now: Date): Promise<void> {
  const threshold = new Date(now.getTime() - STALE_GENERATING_MS);
  await prisma.blogDraftGenerationBatchItem.updateMany({
    where: {
      batchId,
      status: BlogDraftGenerationBatchItemStatus.GENERATING,
      updatedAt: { lt: threshold },
    },
    data: {
      status: BlogDraftGenerationBatchItemStatus.FAILED,
      error: "stale_generating_timeout",
    },
  });
}

export type ProcessDraftBatchItemsResult = {
  processed: number;
  results: Array<{
    itemId: string;
    ordinal: number;
    topicRaw: string;
    outcome: "completed" | "failed" | "skipped";
    slug?: string;
    postId?: string;
    message?: string;
  }>;
  errors: string[];
};

/**
 * Processes up to `limit` PENDING items: one failure does not stop siblings in this chunk.
 */
export async function processDraftGenerationBatchItems(
  batchId: string,
  limit: number,
  now: Date = new Date(),
): Promise<ProcessDraftBatchItemsResult> {
  const errors: string[] = [];
  const results: ProcessDraftBatchItemsResult["results"] = [];

  await resetStaleGeneratingItems(batchId, now);

  const aiEnabled = isAdminAiGenerationEnabled();
  const keyCheck = assertOpenAiKeyConfigured();
  if (!aiEnabled || !keyCheck.ok) {
    const hint = !keyCheck.ok ? keyCheck.message : "AI_ADMIN_GENERATION_ENABLED=false";
    return { processed: 0, results: [], errors: [hint] };
  }

  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id: batchId },
  });
  if (!batch) {
    return { processed: 0, results: [], errors: ["batch_not_found"] };
  }
  if (batch.status === BlogDraftGenerationBatchStatus.CANCELLED) {
    return { processed: 0, results: [], errors: ["batch_cancelled"] };
  }

  const safeLimit = Math.max(1, Math.min(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS, limit));
  const items = await prisma.blogDraftGenerationBatchItem.findMany({
    where: {
      batchId,
      status: BlogDraftGenerationBatchItemStatus.PENDING,
    },
    orderBy: { ordinal: "asc" },
    take: safeLimit,
  });

  const country =
    batch.country === "US" || batch.country === "CA" ? batch.country : ("unspecified" as const);
  const tone: "professional" | "supportive" | "direct" =
    batch.tone === "supportive" || batch.tone === "direct" || batch.tone === "professional" ? batch.tone : "professional";

  for (const item of items) {
    try {
      await prisma.blogDraftGenerationBatchItem.update({
        where: { id: item.id },
        data: { status: BlogDraftGenerationBatchItemStatus.GENERATING, error: null },
      });

      const result = await generateAutomatedBlogPost({
        topic: item.topicRaw,
        keywords: batch.keywords ?? undefined,
        exam: batch.exam,
        country,
        template: batch.defaultTemplate ?? BlogPostTemplate.TOPIC_EXPLAINED,
        intent: batch.defaultIntent ?? BlogPostIntent.EXAM_PREP,
        funnelStage: batch.funnelStage ?? BlogFunnelStage.CONSIDERATION,
        tone,
        includeImage: batch.includeImage,
        includeAiImage: batch.includeAiImage,
        targetKeyword: item.topicRaw,
        keywordCluster: batch.keywordCluster ?? undefined,
        autoPublish: true,
      });

      if (!result.ok) {
        await prisma.blogDraftGenerationBatchItem.update({
          where: { id: item.id },
          data: {
            status: BlogDraftGenerationBatchItemStatus.FAILED,
            error: result.error.slice(0, 4000),
          },
        });
        results.push({
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "failed",
          message: result.error,
        });
        await refreshDraftGenerationBatchStats(batchId);
        await logDraftBatchItemRun({
          batchId,
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "failed",
          message: result.error,
          createdById: batch.createdById,
        });
        continue;
      }

      if (result.skipped) {
        const reason = result.reason;
        const detail =
          reason === "duplicate_topic" ?
            `duplicate_topic:existing=${result.existingSlug ?? "?"}`
          : `${reason}${result.slug ? `:${result.slug}` : ""}`;
        const existingId =
          reason === "duplicate_topic" && result.existingSlug ?
            await prisma.blogPost.findUnique({ where: { slug: result.existingSlug }, select: { id: true } })
          : null;
        await prisma.blogDraftGenerationBatchItem.update({
          where: { id: item.id },
          data: {
            status: BlogDraftGenerationBatchItemStatus.SKIPPED,
            error: detail.slice(0, 4000),
            blogPostId: existingId?.id ?? null,
          },
        });
        results.push({
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "skipped",
          message: detail,
        });
        await refreshDraftGenerationBatchStats(batchId);
        await logDraftBatchItemRun({
          batchId,
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "skipped",
          message: detail,
          blogPostId: existingId?.id ?? null,
          createdById: batch.createdById,
        });
        continue;
      }

      await prisma.blogDraftGenerationBatchItem.update({
        where: { id: item.id },
        data: {
          status: BlogDraftGenerationBatchItemStatus.COMPLETED,
          blogPostId: result.post.id,
          error: null,
        },
      });
      results.push({
        itemId: item.id,
        ordinal: item.ordinal,
        topicRaw: item.topicRaw,
        outcome: "completed",
        slug: result.post.slug,
        postId: result.post.id,
      });
      await refreshDraftGenerationBatchStats(batchId);
      await logDraftBatchItemRun({
        batchId,
        itemId: item.id,
        ordinal: item.ordinal,
        topicRaw: item.topicRaw,
        outcome: "completed",
        blogPostId: result.post.id,
        createdById: batch.createdById,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${item.id}: ${msg}`);
      await prisma.blogDraftGenerationBatchItem
        .update({
          where: { id: item.id },
          data: {
            status: BlogDraftGenerationBatchItemStatus.FAILED,
            error: msg.slice(0, 4000),
          },
        })
        .catch(() => {});
      results.push({
        itemId: item.id,
        ordinal: item.ordinal,
        topicRaw: item.topicRaw,
        outcome: "failed",
        message: msg,
      });
      await refreshDraftGenerationBatchStats(batchId);
      await logDraftBatchItemRun({
        batchId,
        itemId: item.id,
        ordinal: item.ordinal,
        topicRaw: item.topicRaw,
        outcome: "failed",
        message: msg,
        createdById: batch.createdById,
      });
    }
  }

  return { processed: results.length, results, errors };
}
