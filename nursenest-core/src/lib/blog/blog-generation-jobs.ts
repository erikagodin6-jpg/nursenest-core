import {
  BlogDraftGenerationBatchItemStatus,
  BlogDraftGenerationBatchStatus,
  type BlogDraftGenerationBatch,
  type BlogDraftGenerationBatchItem,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { processDraftGenerationBatchItems } from "@/lib/blog/blog-draft-generation-batch";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { isRnTopicMapShellGenerationBatch } from "@/lib/blog/blog-topic-map-shell-batch-constants";

/** UI + API job phase (maps from persisted batch + item states). */
export type BlogGenerationJobPhase = "queued" | "running" | "completed" | "cancelled" | "partial";

const CRON_ITEMS_DEFAULT = 2;
const CRON_MAX_BATCHES_DEFAULT = 4;

function itemsPerCronTick(): number {
  const raw = process.env.BLOG_BG_DRAFT_ITEMS_PER_CRON_TICK?.trim();
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 1) return CRON_ITEMS_DEFAULT;
  return Math.min(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS, Math.floor(n));
}

function maxBatchesPerCron(): number {
  const raw = process.env.BLOG_BG_DRAFT_MAX_BATCHES_PER_CRON?.trim();
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 1) return CRON_MAX_BATCHES_DEFAULT;
  return Math.min(20, Math.floor(n));
}

export function mapBlogDraftBatchToJobPhase(
  batch: Pick<BlogDraftGenerationBatch, "status" | "completedCount" | "failedCount" | "totalItems">,
  pending: number,
  generating: number,
): BlogGenerationJobPhase {
  if (batch.status === BlogDraftGenerationBatchStatus.CANCELLED) return "cancelled";
  if (batch.status === BlogDraftGenerationBatchStatus.COMPLETED) {
    if (batch.failedCount > 0 || batch.completedCount + batch.failedCount < batch.totalItems) {
      return "partial";
    }
    return "completed";
  }
  if (generating > 0) return "running";
  if (pending > 0) return "queued";
  return "completed";
}

export type BlogGenerationJobItemPayload = Pick<
  BlogDraftGenerationBatchItem,
  "id" | "ordinal" | "topicRaw" | "status" | "blogPostId" | "error"
> & {
  blogPost: { id: string; slug: string; title: string } | null;
};

export type BlogGenerationJobPayload = {
  id: string;
  phase: BlogGenerationJobPhase;
  backgroundProcessing: boolean;
  batchStatus: BlogDraftGenerationBatchStatus;
  exam: string;
  country: string;
  defaultTemplate: BlogDraftGenerationBatch["defaultTemplate"];
  defaultIntent: BlogDraftGenerationBatch["defaultIntent"];
  funnelStage: BlogDraftGenerationBatch["funnelStage"];
  tone: string;
  keywords: string | null;
  keywordCluster: string | null;
  countryTarget: BlogDraftGenerationBatch["countryTarget"];
  includeImage: boolean;
  includeAiImage: boolean;
  allowDuplicateCanonicalTopic: boolean;
  totalItems: number;
  completedItems: number;
  failedItems: number;
  skippedItems: number;
  pendingItems: number;
  generatingItems: number;
  processorStartedAt: string | null;
  lastProcessorError: string | null;
  createdAt: string;
  updatedAt: string;
  /** True when this job creates RN topic-map DRAFT shells (no AI). */
  rnTopicMapShellJob: boolean;
  items: BlogGenerationJobItemPayload[];
};

function serializeJob(
  batch: BlogDraftGenerationBatch & {
    items: Array<
      Pick<BlogDraftGenerationBatchItem, "id" | "ordinal" | "topicRaw" | "status" | "blogPostId" | "error"> & {
        blogPost: { id: string; slug: string; title: string } | null;
      }
    >;
  },
): BlogGenerationJobPayload {
  const pending = batch.items.filter((i) => i.status === BlogDraftGenerationBatchItemStatus.PENDING).length;
  const generating = batch.items.filter((i) => i.status === BlogDraftGenerationBatchItemStatus.GENERATING).length;
  const phase = mapBlogDraftBatchToJobPhase(batch, pending, generating);
  const rnTopicMapShellJob = isRnTopicMapShellGenerationBatch(batch);
  return {
    id: batch.id,
    phase,
    backgroundProcessing: batch.backgroundProcessing,
    batchStatus: batch.status,
    exam: batch.exam,
    country: batch.country,
    defaultTemplate: batch.defaultTemplate,
    defaultIntent: batch.defaultIntent,
    funnelStage: batch.funnelStage,
    tone: batch.tone,
    keywords: batch.keywords,
    keywordCluster: batch.keywordCluster,
    countryTarget: batch.countryTarget,
    includeImage: batch.includeImage,
    includeAiImage: batch.includeAiImage,
    allowDuplicateCanonicalTopic: batch.allowDuplicateCanonicalTopic,
    totalItems: batch.totalItems,
    completedItems: batch.completedCount,
    failedItems: batch.failedCount,
    skippedItems: batch.skippedCount,
    pendingItems: pending,
    generatingItems: generating,
    processorStartedAt: batch.processorStartedAt?.toISOString() ?? null,
    lastProcessorError: batch.lastProcessorError,
    createdAt: batch.createdAt.toISOString(),
    updatedAt: batch.updatedAt.toISOString(),
    rnTopicMapShellJob,
    items: batch.items.map((i) => ({
      id: i.id,
      ordinal: i.ordinal,
      topicRaw: i.topicRaw,
      status: i.status,
      blogPostId: i.blogPostId,
      error: i.error,
      blogPost: i.blogPost,
    })),
  };
}

export async function loadBlogGenerationJobForAdmin(id: string): Promise<BlogGenerationJobPayload | null> {
  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { ordinal: "asc" },
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          status: true,
          blogPostId: true,
          error: true,
          blogPost: { select: { id: true, slug: true, title: true } },
        },
      },
    },
  });
  if (!batch) return null;
  return serializeJob(batch);
}

export type ListBlogGenerationJobsParams = {
  limit: number;
  /** Filter by mapped phase; omit for all (newest first). */
  phase?: BlogGenerationJobPhase;
  /** When true, only batches created as background jobs. */
  backgroundOnly?: boolean;
};

export async function listBlogGenerationJobsForAdmin(
  params: ListBlogGenerationJobsParams,
): Promise<BlogGenerationJobPayload[]> {
  const take = Math.min(50, Math.max(1, params.limit));
  const rows = await prisma.blogDraftGenerationBatch.findMany({
    where: params.backgroundOnly === false ? undefined : { backgroundProcessing: true },
    orderBy: { createdAt: "desc" },
    take: take * 3,
    include: {
      items: {
        orderBy: { ordinal: "asc" },
        select: {
          id: true,
          ordinal: true,
          topicRaw: true,
          status: true,
          blogPostId: true,
          error: true,
          blogPost: { select: { id: true, slug: true, title: true } },
        },
      },
    },
  });
  const mapped = rows.map(serializeJob);
  if (!params.phase) return mapped.slice(0, take);
  return mapped.filter((j) => j.phase === params.phase).slice(0, take);
}

export type PumpBackgroundBlogDraftBatchesResult = {
  batchesTouched: number;
  itemsProcessed: number;
  errors: string[];
};

/**
 * Cron-safe: processes a few pending items across background batches (bounded work per invocation).
 */
export async function pumpBackgroundBlogDraftBatches(): Promise<PumpBackgroundBlogDraftBatchesResult> {
  const itemsPerTick = itemsPerCronTick();
  const maxBatches = maxBatchesPerCron();
  const errors: string[] = [];
  let batchesTouched = 0;
  let itemsProcessed = 0;

  const batches = await prisma.blogDraftGenerationBatch.findMany({
    where: {
      backgroundProcessing: true,
      status: BlogDraftGenerationBatchStatus.ACTIVE,
      items: { some: { status: BlogDraftGenerationBatchItemStatus.PENDING } },
    },
    orderBy: { updatedAt: "asc" },
    take: maxBatches,
    select: { id: true },
  });

  for (const b of batches) {
    batchesTouched += 1;
    await prisma.blogDraftGenerationBatch.updateMany({
      where: { id: b.id, processorStartedAt: null },
      data: { processorStartedAt: new Date() },
    });

    const out = await processDraftGenerationBatchItems(b.id, itemsPerTick);
    itemsProcessed += out.processed;

    if (out.errors.length > 0) {
      const joined = out.errors.join("; ").slice(0, 480);
      errors.push(`${b.id}:${joined}`);
      await prisma.blogDraftGenerationBatch
        .update({
          where: { id: b.id },
          data: { lastProcessorError: joined },
        })
        .catch(() => {});
    }

    safeServerLog("cron", "blog_draft_generation_batch_tick", {
      batchId: b.id,
      processed: out.processed,
      errorCount: out.errors.length,
    });
  }

  if (batchesTouched > 0) {
    safeServerLog("cron", "blog_draft_generation_pump_summary", {
      batchesTouched,
      itemsProcessed,
      pumpErrors: errors.length,
    });
  }

  return { batchesTouched, itemsProcessed, errors };
}
