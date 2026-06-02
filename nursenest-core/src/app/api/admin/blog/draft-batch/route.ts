import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  assertTopicsWithinBatchLimit,
  blogDraftGenerationBatchCreateBodySchema,
} from "@/lib/blog/blog-draft-generation-batch-create-body";
import { parseDraftBatchTopicLines } from "@/lib/blog/blog-draft-generation-batch-parse";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";

/** Create a persisted draft-generation batch from a newline-separated topic list. */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = blogDraftGenerationBatchCreateBodySchema.safeParse(await req.json());
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
      items: {
        create: topics.map((topicRaw, ordinal) => ({
          ordinal,
          topicRaw,
          canonicalTopicKey: normalizeBlogTopicKey(topicRaw) || null,
        })),
      },
    },
    select: {
      id: true,
      totalItems: true,
      createdAt: true,
      items: {
        orderBy: { ordinal: "asc" },
        select: { id: true, ordinal: true, topicRaw: true, status: true },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    batch,
    droppedShortLines,
  });
}

/** Recent draft batches (newest first). */
export async function GET(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));

  const rows = await prisma.blogDraftGenerationBatch.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      exam: true,
      country: true,
      totalItems: true,
      completedCount: true,
      failedCount: true,
      skippedCount: true,
      allowDuplicateCanonicalTopic: true,
      backgroundProcessing: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, batches: rows });
}
