import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  assertTopicsWithinBatchLimit,
  blogGenerationJobCreateBodySchema,
} from "@/lib/blog/blog-draft-generation-batch-create-body";
import { parseDraftBatchTopicLines } from "@/lib/blog/blog-draft-generation-batch-parse";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";
import {
  loadBlogGenerationJobForAdmin,
  listBlogGenerationJobsForAdmin,
  type BlogGenerationJobPhase,
} from "@/lib/blog/blog-generation-jobs";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const IDEMPOTENCY_WINDOW_MS = 120_000;

/** Create one durable background job (returns immediately; cron advances items). */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const raw = await req.json();
  const parsed = blogGenerationJobCreateBodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;
  const { topics, droppedShortLines } = parseDraftBatchTopicLines(d.topicsText);
  if (topics.length === 0) {
    return NextResponse.json(
      { error: "No valid topics (each line must be at least 3 characters after trim)." },
      { status: 400 },
    );
  }
  const overLimit = assertTopicsWithinBatchLimit(topics.length);
  if (overLimit) {
    return NextResponse.json({ error: overLimit }, { status: 400 });
  }

  if (d.idempotencyKey && gate.admin.userId) {
    const existing = await prisma.blogDraftGenerationBatch.findFirst({
      where: {
        createdById: gate.admin.userId,
        idempotencyKey: d.idempotencyKey,
        createdAt: { gte: new Date(Date.now() - IDEMPOTENCY_WINDOW_MS) },
      },
      orderBy: { createdAt: "desc" },
    });
    if (existing) {
      const job = await loadBlogGenerationJobForAdmin(existing.id);
      return NextResponse.json({
        ok: true,
        jobId: existing.id,
        idempotentReplay: true,
        droppedShortLines,
        job,
      });
    }
  }

  const country = d.country ?? "unspecified";
  const batch = await prisma.blogDraftGenerationBatch.create({
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
      allowDuplicateCanonicalTopic: d.allowDuplicateCanonicalTopic ?? false,
      totalItems: topics.length,
      createdById: gate.admin.userId,
      backgroundProcessing: true,
      idempotencyKey: d.idempotencyKey ?? null,
      items: {
        create: topics.map((topicRaw, ordinal) => ({
          ordinal,
          topicRaw,
          canonicalTopicKey: normalizeBlogTopicKey(topicRaw) || null,
        })),
      },
    },
    select: { id: true, totalItems: true },
  });

  safeServerLog("admin", "blog_generation_job_created", {
    jobId: batch.id,
    totalItems: batch.totalItems,
    droppedShortLines,
  });

  const job = await loadBlogGenerationJobForAdmin(batch.id);
  return NextResponse.json({
    ok: true,
    jobId: batch.id,
    droppedShortLines,
    job,
  });
}

/** List recent generation jobs (background batches). */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));
  const phaseRaw = searchParams.get("status")?.trim().toLowerCase();
  const all = searchParams.get("all") === "1";
  const phase =
    phaseRaw === "queued" || phaseRaw === "running" || phaseRaw === "completed" || phaseRaw === "cancelled" || phaseRaw === "partial"
      ? (phaseRaw as BlogGenerationJobPhase)
      : undefined;

  const jobs = await listBlogGenerationJobsForAdmin({
    limit,
    phase,
    backgroundOnly: !all,
  });

  return NextResponse.json({ ok: true, jobs });
}
