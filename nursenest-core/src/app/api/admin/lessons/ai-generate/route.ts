import { DraftReviewStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { assertOpenAiKeyConfigured, getOpenAiChatModel } from "@/lib/ai/openai-env";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { checkAdminAiGenerateLimit } from "@/lib/ai/admin-rate-limit";
import {
  adminAiLessonPathwaySchema,
  adminAiLessonTypeSchema,
  adminAiLessonDifficultySchema,
} from "@/lib/lessons/admin-ai-lesson-schema";
import { lessonBatchTopicKey } from "@/lib/lessons/admin-ai-lesson-batch";
import {
  ADMIN_AI_LESSON_GENERATOR_TOOL,
  buildDraftNormalized,
  generateAdminAiLesson,
} from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  topic: z.string().min(4).max(400),
  pathway: adminAiLessonPathwaySchema,
  country: z.enum(["CA", "US"]),
  topicDomain: z.string().min(2).max(200),
  lessonType: adminAiLessonTypeSchema,
  difficulty: adminAiLessonDifficultySchema,
  relatedCategoryIds: z.array(z.string().min(5)).max(12).optional(),
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

  const rl = checkAdminAiGenerateLimit(gate.admin.userId);
  if (!rl.ok) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later.", code: "RATE_LIMIT" }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  let relatedCategoryLabels: string[] = [];
  if (d.relatedCategoryIds?.length) {
    const cats = await prisma.category.findMany({
      where: { id: { in: d.relatedCategoryIds } },
      select: { name: true, slug: true },
    });
    relatedCategoryLabels = cats.map((c) => c.name || c.slug);
  }

  const input = {
    topic: d.topic,
    pathway: d.pathway,
    country: d.country,
    topicDomain: d.topicDomain,
    lessonType: d.lessonType,
    difficulty: d.difficulty,
    relatedCategoryLabels,
  };

  try {
    const { lesson, rawTokens } = await generateAdminAiLesson(input);
    const normalized = buildDraftNormalized(input, lesson);
    const model = getOpenAiChatModel();

    const batchTopicKey = lessonBatchTopicKey(d.topic, d.pathway, d.country, d.lessonType);

    const draft = await prisma.generatedLessonDraft.create({
      data: {
        tool: ADMIN_AI_LESSON_GENERATOR_TOOL,
        payloadJson: {
          topic: d.topic,
          pathway: d.pathway,
          country: d.country,
          topicDomain: d.topicDomain,
          lessonType: d.lessonType,
          difficulty: d.difficulty ?? null,
          relatedCategoryIds: d.relatedCategoryIds ?? [],
          batchTopicKey,
        },
        normalizedJson: normalized as object,
        validationJson: {
          ok: true,
          model,
          totalTokens: rawTokens ?? null,
        },
        reviewStatus: DraftReviewStatus.PENDING_REVIEW,
        titlePreview: lesson.title.slice(0, 500),
        sourcePrompt: `topic=${d.topic}; pathway=${d.pathway}; country=${d.country}; type=${d.lessonType}`,
        model,
        createdById: gate.admin.userId,
      },
      select: { id: true, titlePreview: true, createdAt: true, reviewStatus: true },
    });

    return NextResponse.json({ ok: true, draftId: draft.id, draft, lesson, normalized });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: "Generation failed", message }, { status: 502 });
  }
}
