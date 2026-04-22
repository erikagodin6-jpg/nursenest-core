import {
  BlogDraftGenerationBatchItemStatus,
  BlogDraftGenerationBatchStatus,
  BlogFunnelStage,
  BlogPostIntent,
  BlogPostStatus,
  BlogPostTemplate,
} from "@prisma/client";
import { generateAutomatedBlogPost } from "@/lib/blog/blog-automation-engine";
import { getAdminAiGenerationGate } from "@/lib/ai/admin-ai-policy";
import { logDraftBatchItemRun } from "@/lib/admin/blog-content-automation-log";
import { findExistingBlogByCanonicalIntent, normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";
import { isRnTopicMapShellGenerationBatch, RN_TOPIC_MAP_SHELL_MAX_ITEMS } from "@/lib/blog/blog-topic-map-shell-batch-constants";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const STALE_GENERATING_MS = 25 * 60 * 1000;

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Heuristic for OpenAI / upstream overload — used to slow the batch loop (no retry storm). */
export function isLikelyTransientProviderOverload(errorText: string): boolean {
  const m = errorText.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("rate limit") ||
    m.includes("too many requests") ||
    m.includes("throttl") ||
    m.includes("overloaded") ||
    m.includes("slow down") ||
    m.includes("resource exhausted") ||
    m.includes("temporarily unavailable") ||
    m.includes("econnreset") ||
    m.includes("socket hang up") ||
    m.includes("timed out")
  );
}

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

/** RN topic-map shells — DB only; caller already ran stale reset. */
async function processRnTopicMapShellBatchItems(batchId: string, limit: number): Promise<ProcessDraftBatchItemsResult> {
  const errors: string[] = [];
  const results: ProcessDraftBatchItemsResult["results"] = [];

  const safeLimit = Math.max(1, Math.min(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS, limit));
  const items = await prisma.blogDraftGenerationBatchItem.findMany({
    where: { batchId, status: BlogDraftGenerationBatchItemStatus.PENDING },
    orderBy: { ordinal: "asc" },
    take: safeLimit,
  });

  const { loadRnTopicMapBatchRows } = await import("@/lib/admin/blog-topic-map-batch");
  const allRows = loadRnTopicMapBatchRows(RN_TOPIC_MAP_SHELL_MAX_ITEMS);
  const slugToRow = new Map(allRows.map((r) => [r.slug, r]));
  if (allRows.length === 0) {
    errors.push("master-topic-map.json missing or has no RN topics");
    return { processed: 0, results: [], errors };
  }

  const throttleBase = Math.min(
    60_000,
    Math.max(2000, Number(process.env.BLOG_BG_DRAFT_THROTTLE_BACKOFF_MS?.trim()) || 10_000),
  );
  let throttleBackoffMs = throttleBase;
  const seenTopicKeys = new Set<string>();

  for (const item of items) {
    try {
      await prisma.blogDraftGenerationBatchItem.update({
        where: { id: item.id },
        data: { status: BlogDraftGenerationBatchItemStatus.GENERATING, error: null },
      });

      const row = slugToRow.get(item.topicRaw);
      if (!row) {
        await prisma.blogDraftGenerationBatchItem.update({
          where: { id: item.id },
          data: { status: BlogDraftGenerationBatchItemStatus.FAILED, error: "map_row_missing" },
        });
        results.push({
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "failed",
          message: "map_row_missing",
        });
        await refreshDraftGenerationBatchStats(batchId);
        continue;
      }

      const exists = await prisma.blogPost.findUnique({ where: { slug: row.slug }, select: { id: true } });
      if (exists) {
        await prisma.blogDraftGenerationBatchItem.update({
          where: { id: item.id },
          data: {
            status: BlogDraftGenerationBatchItemStatus.SKIPPED,
            error: "already_exists",
            blogPostId: exists.id,
          },
        });
        results.push({
          itemId: item.id,
          ordinal: item.ordinal,
          topicRaw: item.topicRaw,
          outcome: "skipped",
          message: "already_exists",
        });
        await refreshDraftGenerationBatchStats(batchId);
        continue;
      }

      const normalizedTopic = normalizeBlogTopicKey(row.tags[1] ?? row.title);
      if (normalizedTopic) {
        if (seenTopicKeys.has(normalizedTopic)) {
          await prisma.blogDraftGenerationBatchItem.update({
            where: { id: item.id },
            data: { status: BlogDraftGenerationBatchItemStatus.SKIPPED, error: "topic_duplicate_in_tick" },
          });
          results.push({
            itemId: item.id,
            ordinal: item.ordinal,
            topicRaw: item.topicRaw,
            outcome: "skipped",
            message: "topic_duplicate_in_tick",
          });
          await refreshDraftGenerationBatchStats(batchId);
          continue;
        }
        const dupTopic = await findExistingBlogByCanonicalIntent({ exam: row.exam, normalizedTopic });
        if (dupTopic) {
          await prisma.blogDraftGenerationBatchItem.update({
            where: { id: item.id },
            data: { status: BlogDraftGenerationBatchItemStatus.SKIPPED, error: "topic_duplicate" },
          });
          results.push({
            itemId: item.id,
            ordinal: item.ordinal,
            topicRaw: item.topicRaw,
            outcome: "skipped",
            message: "topic_duplicate",
          });
          await refreshDraftGenerationBatchStats(batchId);
          continue;
        }
        seenTopicKeys.add(normalizedTopic);
      }

      const created = await prisma.blogPost.create({
        data: {
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          body: row.body,
          exam: row.exam,
          category: row.category,
          tags: row.tags,
          postTemplate: row.postTemplate,
          postStatus: BlogPostStatus.DRAFT,
          relatedLessonPaths: [row.relatedLessonPath],
          seoTitle: row.title.slice(0, 200),
          seoDescription: row.excerpt.slice(0, 480),
          targetKeyword: normalizedTopic || null,
        },
      });

      await prisma.blogDraftGenerationBatchItem.update({
        where: { id: item.id },
        data: { status: BlogDraftGenerationBatchItemStatus.COMPLETED, blogPostId: created.id, error: null },
      });
      results.push({
        itemId: item.id,
        ordinal: item.ordinal,
        topicRaw: item.topicRaw,
        outcome: "completed",
        slug: created.slug,
        postId: created.id,
      });
      await refreshDraftGenerationBatchStats(batchId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${item.id}: ${msg}`);
      await prisma.blogDraftGenerationBatchItem
        .update({
          where: { id: item.id },
          data: { status: BlogDraftGenerationBatchItemStatus.FAILED, error: msg.slice(0, 4000) },
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
      if (isLikelyTransientProviderOverload(msg)) {
        safeServerLog("blog", "shell_batch_db_throttle_backoff", {
          batchId,
          itemOrdinal: item.ordinal,
          backoffMs: throttleBackoffMs,
        });
        await sleepMs(throttleBackoffMs);
        throttleBackoffMs = Math.min(60_000, Math.floor(throttleBackoffMs * 1.5));
      }
    }
  }

  return { processed: results.length, results, errors };
}

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

  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id: batchId },
  });
  if (!batch) {
    return { processed: 0, results: [], errors: ["batch_not_found"] };
  }
  if (batch.status === BlogDraftGenerationBatchStatus.CANCELLED) {
    return { processed: 0, results: [], errors: ["batch_cancelled"] };
  }

  if (isRnTopicMapShellGenerationBatch(batch)) {
    return processRnTopicMapShellBatchItems(batchId, limit);
  }

  const aiGate = getAdminAiGenerationGate();
  if (!aiGate.runnable) {
    return { processed: 0, results: [], errors: [aiGate.summaryLine] };
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

  const throttleBase = Math.min(
    60_000,
    Math.max(2000, Number(process.env.BLOG_BG_DRAFT_THROTTLE_BACKOFF_MS?.trim()) || 10_000),
  );
  let providerThrottleBackoffMs = throttleBase;

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
        if (isLikelyTransientProviderOverload(result.error)) {
          safeServerLog("blog", "draft_batch_provider_throttle_backoff", {
            batchId,
            itemOrdinal: item.ordinal,
            backoffMs: providerThrottleBackoffMs,
          });
          await sleepMs(providerThrottleBackoffMs);
          providerThrottleBackoffMs = Math.min(60_000, Math.floor(providerThrottleBackoffMs * 1.5));
        }
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
      if (isLikelyTransientProviderOverload(msg)) {
        safeServerLog("blog", "draft_batch_provider_throttle_backoff", {
          batchId,
          itemOrdinal: item.ordinal,
          backoffMs: providerThrottleBackoffMs,
        });
        await sleepMs(providerThrottleBackoffMs);
        providerThrottleBackoffMs = Math.min(60_000, Math.floor(providerThrottleBackoffMs * 1.5));
      }
    }
  }

  return { processed: results.length, results, errors };
}
