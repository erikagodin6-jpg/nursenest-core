import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { getOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  ADMIN_LESSON_BATCH_TOOL,
  lessonBatchTopicKey,
  normalizeBatchTopic,
  parseTopicList,
  queueRowToLessonBatchItem,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";
import {
  adminAiLessonPathwaySchema,
  adminAiLessonTypeSchema,
  adminAiLessonDifficultySchema,
} from "@/lib/lessons/admin-ai-lesson-schema";
import { prisma } from "@/lib/db";
import {
  batchControlSchema,
  findJobByIdempotencyKey,
  idempotencyKeySchema,
} from "@/lib/ai/controlled-ai-batch";
import { loadLessonBatchSummaryWithHydration } from "@/lib/lessons/admin-ai-lesson-batch";

export const dynamic = "force-dynamic";

export const runtime = "nodejs";

const MAX_TOPICS = 35;

const bodySchema = z.object({
  /** One topic or many (newline / comma / semicolon separated) */
  topicsRaw: z.string().min(2).max(20_000),
  pathway: adminAiLessonPathwaySchema,
  country: z.enum(["CA", "US"]),
  topicDomain: z.string().min(2).max(200),
  lessonType: adminAiLessonTypeSchema,
  difficulty: adminAiLessonDifficultySchema,
  relatedCategoryIds: z.array(z.string().min(5)).max(12).optional(),
  allowDuplicates: z.boolean().default(false),
  /** Same key + user within lookback returns existing job (idempotent create). */
  idempotencyKey: idempotencyKeySchema,
  batchControl: batchControlSchema.optional(),
});

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  if (d.idempotencyKey) {
    const existing = await findJobByIdempotencyKey(prisma, {
      createdById: gate.admin.userId,
      tool: ADMIN_LESSON_BATCH_TOOL,
      idempotencyKey: d.idempotencyKey,
    });
    if (existing) {
      const summary = await loadLessonBatchSummaryWithHydration(prisma, existing.id);
      return NextResponse.json({
        ok: true,
        jobId: existing.id,
        summary,
        idempotentReplay: true,
      });
    }
  }

  const topics = parseTopicList(d.topicsRaw);
  if (topics.length === 0) {
    return NextResponse.json({ error: "No topics parsed from input" }, { status: 400 });
  }
  if (topics.length > MAX_TOPICS) {
    return NextResponse.json(
      { error: `Too many topics (max ${MAX_TOPICS}). Split into multiple batches.` },
      { status: 400 },
    );
  }

  const model = getOpenAiChatModel();

  const { jobId, summary } = await prisma.$transaction(async (tx) => {
    const job = await tx.aiGenerationJob.create({
      data: {
        tool: ADMIN_LESSON_BATCH_TOOL,
        status: JobStatus.RUNNING,
        model,
        sourcePrompt: `Batch lesson generation: ${topics.length} topics (${d.pathway}, ${d.country}, ${d.lessonType})`,
        inputPayload: {
          topics,
          pathway: d.pathway,
          country: d.country,
          topicDomain: d.topicDomain,
          lessonType: d.lessonType,
          difficulty: d.difficulty ?? null,
          relatedCategoryIds: d.relatedCategoryIds ?? [],
          allowDuplicates: d.allowDuplicates,
          ...(d.idempotencyKey ? { idempotencyKey: d.idempotencyKey } : {}),
          ...(d.batchControl ? { batchControl: d.batchControl } : {}),
        } as object,
        resultSummary: {} as object,
        createdById: gate.admin.userId,
      },
    });

    const rows = topics.map((topic, position) => {
      const publicItemId = randomUUID();
      const normalizedTopic = normalizeBatchTopic(topic);
      const batchTopicKey = lessonBatchTopicKey(topic, d.pathway, d.country, d.lessonType);
      return {
        jobId: job.id,
        position,
        publicItemId,
        topic,
        normalizedTopic,
        batchTopicKey,
      };
    });

    await tx.lessonBatchQueueItem.createMany({ data: rows });

    const created = await tx.lessonBatchQueueItem.findMany({
      where: { jobId: job.id },
      orderBy: { position: "asc" },
      take: topics.length,
    });

    const built: LessonBatchResultSummaryV1 = {
      version: 1,
      allowDuplicates: d.allowDuplicates,
      settings: {
        pathway: d.pathway,
        country: d.country,
        topicDomain: d.topicDomain,
        lessonType: d.lessonType,
        difficulty: d.difficulty,
        relatedCategoryIds: d.relatedCategoryIds ?? [],
      },
      items: created.map(queueRowToLessonBatchItem),
    };

    await tx.aiGenerationJob.update({
      where: { id: job.id },
      data: { resultSummary: built as object },
    });

    await tx.aiGenerationLog.create({
      data: {
        jobId: job.id,
        step: "batch_created",
        detail: { topicCount: topics.length, queue: "db" },
      },
    });

    return { jobId: job.id, summary: built };
  });

  return NextResponse.json({
    ok: true,
    jobId,
    summary,
  });
}
