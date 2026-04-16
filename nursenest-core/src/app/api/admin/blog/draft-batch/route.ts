import { BlogFunnelStage, BlogPostIntent, BlogPostTemplate, CountryCode } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { DRAFT_BATCH_MAX_TOPICS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { parseDraftBatchTopicLines } from "@/lib/blog/blog-draft-generation-batch-parse";
import { normalizeBlogTopicKey } from "@/lib/blog/blog-intent-dedupe";
import { prisma } from "@/lib/db";

const createSchema = z.object({
  topicsText: z.string().min(1).max(500_000),
  exam: z.string().min(2).max(80),
  country: z.enum(["US", "CA", "unspecified"]).optional(),
  template: z.nativeEnum(BlogPostTemplate),
  intent: z.nativeEnum(BlogPostIntent).optional(),
  funnelStage: z.nativeEnum(BlogFunnelStage).optional(),
  tone: z.enum(["professional", "supportive", "direct"]).optional(),
  keywords: z.string().max(400).optional(),
  keywordCluster: z.string().max(200).optional(),
  countryTarget: z.nativeEnum(CountryCode).optional(),
  includeImage: z.boolean().optional(),
  includeAiImage: z.boolean().optional(),
  allowDuplicateCanonicalTopic: z.boolean().optional(),
});

/** Create a persisted draft-generation batch from a newline-separated topic list. */
export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json());
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
  if (topics.length > DRAFT_BATCH_MAX_TOPICS) {
    return NextResponse.json(
      { error: `Too many topics (max ${DRAFT_BATCH_MAX_TOPICS}). Split into multiple batches.` },
      { status: 400 },
    );
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
      createdAt: true,
    },
  });

  return NextResponse.json({ ok: true, batches: rows });
}
