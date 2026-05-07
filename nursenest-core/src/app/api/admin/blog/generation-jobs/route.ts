import { BlogPostTemplate } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import {
  getBlogGenerationModelLabelForLogs,
  getBlogGenerationProviderLabelForLogs,
} from "@/lib/ai/openai-env";
import {
  assertRnTopicMapShellRowCount,
  assertTopicsWithinBatchLimit,
  blogGenerationJobCreateBodySchema,
} from "@/lib/blog/blog-draft-generation-batch-create-body";
import { parseDraftBatchTopicLines } from "@/lib/blog/blog-draft-generation-batch-parse";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";
import {
  RN_TOPIC_MAP_SHELL_BATCH_EXAM,
  RN_TOPIC_MAP_SHELL_MAX_ITEMS,
} from "@/lib/blog/blog-topic-map-shell-batch-constants";
import {
  listBlogGenerationJobsForAdmin,
  type BlogGenerationJobPhase,
} from "@/lib/blog/blog-generation-jobs";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
/** Job create only writes DB rows (no inline AI). Keep headroom for large paste batches + slow DB. */
export const maxDuration = 120;

const IDEMPOTENCY_WINDOW_MS = 120_000;

function getSafeBlogAiLogSelection() {
  const provider = getBlogGenerationProviderLabelForLogs();
  try {
    return {
      provider,
      model: getBlogGenerationModelLabelForLogs(),
    };
  } catch (e) {
    return {
      provider,
      model: "(unavailable)",
      modelSelectionError: e instanceof Error ? e.message : String(e),
    };
  }
}

function createTimeoutSafeJobResponse(params: {
  jobId: string;
  totalItems: number;
  droppedShortLines: number;
  jobKind: "ai_topics" | "rn_topic_map_shell";
  idempotentReplay?: boolean;
}) {
  const selection = getSafeBlogAiLogSelection();
  const status = "queued" satisfies BlogGenerationJobPhase;
  const message = params.idempotentReplay
    ? "Returned existing blog generation job. Poll status or process a chunk to continue."
    : "Blog generation job queued. Poll status or process a chunk to continue.";

  safeServerLog("admin", "blog_generation_job_first_chunk_queued", {
    jobId: params.jobId,
    pendingItems: params.totalItems,
    jobKind: params.jobKind,
    provider: selection.provider,
    model: selection.model,
  });

  safeServerLog("admin", "blog_generation_job_timeout_safe_return", {
    jobId: params.jobId,
    status,
    jobKind: params.jobKind,
    provider: selection.provider,
    model: selection.model,
    idempotentReplay: params.idempotentReplay === true,
  });

  return NextResponse.json(
    {
      ok: true,
      jobId: params.jobId,
      status,
      message,
      droppedShortLines: params.droppedShortLines,
      idempotentReplay: params.idempotentReplay === true,
    },
    { status: 202 },
  );
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const raw = await req.json();
  const parsed = blogGenerationJobCreateBodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;

  const isShell =
    "jobKind" in d && d.jobKind === "rn_topic_map_shell";

  const tryIdempotentReplay = async (
    idempotencyKey: string | null | undefined,
    droppedShortLines: number
  ) => {
    if (!idempotencyKey || !gate.admin.userId) return null;

    const existing =
      await prisma.blogDraftGenerationBatch.findFirst({
        where: {
          createdById: gate.admin.userId,
          idempotencyKey,
          createdAt: {
            gte: new Date(Date.now() - IDEMPOTENCY_WINDOW_MS),
          },
        },
        orderBy: { createdAt: "desc" },
      });

    if (!existing) return null;

    safeServerLog("admin", "blog_generation_job_idempotent_replay", {
      jobId: existing.id,
      totalItems: existing.totalItems,
      jobKind: isShell ? "rn_topic_map_shell" : "ai_topics",
    });

    return createTimeoutSafeJobResponse({
      jobId: existing.id,
      totalItems: existing.totalItems,
      droppedShortLines,
      jobKind: isShell ? "rn_topic_map_shell" : "ai_topics",
      idempotentReplay: true,
    });
  };

  // =========================
  // SHELL JOB
  // =========================
  if (isShell) {
    const replay = await tryIdempotentReplay(d.idempotencyKey, 0);
    if (replay) return replay;

    const { loadRnTopicMapBatchRows } = await import(
      "@/lib/admin/blog-topic-map-batch"
    );

    const rows = loadRnTopicMapBatchRows(
      RN_TOPIC_MAP_SHELL_MAX_ITEMS
    );

    const shellErr = assertRnTopicMapShellRowCount(rows.length);
    if (shellErr) {
      return NextResponse.json({ error: shellErr }, { status: 400 });
    }

    const batch = await prisma.$transaction(async (tx) => {
      const b = await tx.blogDraftGenerationBatch.create({
        data: {
          exam: RN_TOPIC_MAP_SHELL_BATCH_EXAM,
          country: "unspecified",
          defaultTemplate: BlogPostTemplate.TOPIC_EXPLAINED,
          defaultIntent: null,
          funnelStage: null,
          tone: "professional",
          keywords: null,
          keywordCluster: null,
          countryTarget: null,
          includeImage: true,
          includeAiImage: false,
          allowDuplicateCanonicalTopic: false,
          totalItems: rows.length,
          createdById: gate.admin.userId,
          backgroundProcessing: true,
          idempotencyKey: d.idempotencyKey ?? null,
        },
        select: { id: true, totalItems: true },
      });
      await tx.blogDraftGenerationBatchItem.createMany({
        data: rows.map((row, ordinal) => ({
          batchId: b.id,
          ordinal,
          topicRaw: row.slug,
          canonicalTopicKey:
            normalizeBlogTopicKey(row.tags[1] ?? row.title) ||
            null,
        })),
      });
      return b;
    });

    safeServerLog("admin", "blog_generation_job_created", {
      jobId: batch.id,
      totalItems: batch.totalItems,
      droppedShortLines: 0,
      jobKind: "rn_topic_map_shell",
      itemsInserted: rows.length,
      ...getSafeBlogAiLogSelection(),
    });

    return createTimeoutSafeJobResponse({
      jobId: batch.id,
      totalItems: batch.totalItems,
      droppedShortLines: 0,
      jobKind: "rn_topic_map_shell",
    });
  }

  // =========================
  // AI JOB (FIXED)
  // =========================

  const aiBlock = adminAiGenerationHttpBlock({ pipeline: "blog" });
  if (aiBlock) return aiBlock;

  // ✅ CRITICAL FIX: type narrowing
  if (!("topicsText" in d)) {
    return NextResponse.json(
      { error: "topicsText is required for this job type" },
      { status: 400 }
    );
  }

  const { topics, droppedShortLines } =
    parseDraftBatchTopicLines(d.topicsText);

  if (topics.length === 0) {
    return NextResponse.json(
      {
        error:
          "No valid topics (each line must be at least 3 characters after trim).",
      },
      { status: 400 }
    );
  }

  const overLimit = assertTopicsWithinBatchLimit(topics.length);
  if (overLimit) {
    return NextResponse.json({ error: overLimit }, { status: 400 });
  }

  const replayAi = await tryIdempotentReplay(
    d.idempotencyKey,
    droppedShortLines
  );
  if (replayAi) return replayAi;

  const country = d.country ?? "unspecified";

  const batch = await prisma.$transaction(async (tx) => {
    const b = await tx.blogDraftGenerationBatch.create({
      data: {
        exam: d.exam,
        country,
        defaultTemplate: d.template,
        defaultIntent: d.intent ?? null,
        funnelStage: d.funnelStage ?? null,
        tone: d.tone ?? "professional",
        keywords: d.keywords ?? null,
        keywordCluster: d.keywordCluster ?? null,
        countryTarget: d.countryTarget ?? null,
        includeImage: d.includeImage ?? true,
        includeAiImage: d.includeAiImage ?? false,
        allowDuplicateCanonicalTopic:
          d.allowDuplicateCanonicalTopic ?? false,
        totalItems: topics.length,
        createdById: gate.admin.userId,
        backgroundProcessing: true,
        idempotencyKey: d.idempotencyKey ?? null,
      },
      select: { id: true, totalItems: true },
    });
    await tx.blogDraftGenerationBatchItem.createMany({
      data: topics.map((topicRaw, ordinal) => ({
        batchId: b.id,
        ordinal,
        topicRaw,
        canonicalTopicKey:
          normalizeBlogTopicKey(topicRaw) || null,
      })),
    });
    return b;
  });

  safeServerLog("admin", "blog_generation_job_created", {
    jobId: batch.id,
    totalItems: batch.totalItems,
    droppedShortLines,
    jobKind: "ai_topics",
    itemsInserted: topics.length,
    ...getSafeBlogAiLogSelection(),
  });

  return createTimeoutSafeJobResponse({
    jobId: batch.id,
    totalItems: batch.totalItems,
    droppedShortLines,
    jobKind: "ai_topics",
  });
}

export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);

  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? "20") || 20)
  );

  const phaseRaw = searchParams.get("status")?.trim().toLowerCase();
  const all = searchParams.get("all") === "1";

  const phase =
    phaseRaw === "queued" ||
    phaseRaw === "running" ||
    phaseRaw === "completed" ||
    phaseRaw === "cancelled" ||
    phaseRaw === "partial"
      ? (phaseRaw as BlogGenerationJobPhase)
      : undefined;

  const jobs = await listBlogGenerationJobsForAdmin({
    limit,
    phase,
    backgroundOnly: !all,
  });

  return NextResponse.json({ ok: true, jobs });
}
