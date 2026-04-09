import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { ADMIN_API_RUNTIME_NODE } from "@/lib/admin/admin-api-route-config";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import {
  ADMIN_LESSON_BATCH_TOOL,
  lessonBatchTopicKey,
  parseTopicList,
  type LessonBatchResultSummaryV1,
} from "@/lib/lessons/admin-ai-lesson-batch";
import {
  adminAiLessonPathwaySchema,
  adminAiLessonTypeSchema,
  adminAiLessonDifficultySchema,
} from "@/lib/lessons/admin-ai-lesson-schema";
import { prisma } from "@/lib/db";

export const runtime = ADMIN_API_RUNTIME_NODE;

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
});

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  if (!isAdminAiGenerationEnabled()) {
    return NextResponse.json(
      { error: "Admin AI generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
      { status: 403 },
    );
  }
  const keyCheck = assertOpenAiKeyConfigured();
  if (!keyCheck.ok) return NextResponse.json({ error: keyCheck.message }, { status: 503 });

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
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
  const summary: LessonBatchResultSummaryV1 = {
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
    items: topics.map((topic) => ({
      itemId: randomUUID(),
      topic,
      batchTopicKey: lessonBatchTopicKey(topic, d.pathway, d.country, d.lessonType),
      status: "pending" as const,
    })),
  };

  const job = await prisma.aiGenerationJob.create({
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
      } as object,
      resultSummary: summary as object,
      createdById: gate.admin.userId,
    },
  });

  await prisma.aiGenerationLog.create({
    data: {
      jobId: job.id,
      step: "batch_created",
      detail: { topicCount: topics.length },
    },
  });

  return NextResponse.json({
    ok: true,
    jobId: job.id,
    summary,
  });
}
