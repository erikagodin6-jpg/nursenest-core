import { ContentStatus, DraftReviewStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ensureUniqueContentItemSlug } from "@/lib/admin/ensure-unique-content-slug";
import type { AdminAiLessonDraftNormalized } from "@/lib/lessons/admin-ai-lesson-schema";
import {
  adminAiLessonPlainTextBody,
  adminAiLessonToContentBlocks,
  adminLessonPathwayToTierCode,
} from "@/lib/lessons/admin-ai-lesson-to-content-item";
import { ADMIN_AI_LESSON_GENERATOR_TOOL } from "@/lib/lessons/admin-ai-lesson-pipeline";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import { tierCodeToContentItemTier } from "@/lib/prisma/exam-question-maps";

const bodySchema = z.object({
  categoryId: z.string().min(5),
  /** Override slug if the AI slug collides after other edits */
  slugOverride: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedLessonDraft.findFirst({
    where: { id, tool: ADMIN_AI_LESSON_GENERATOR_TOOL },
  });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (draft.promotedEntityId) {
    return NextResponse.json({ error: "Already promoted", contentItemId: draft.promotedEntityId }, { status: 400 });
  }

  const normalized = draft.normalizedJson as unknown as AdminAiLessonDraftNormalized;
  if (!normalized?.lesson || normalized.version !== 1) {
    return NextResponse.json({ error: "Draft has no valid normalized lesson" }, { status: 400 });
  }

  const cat = await prisma.category.findUnique({ where: { id: parsed.data.categoryId } });
  if (!cat) return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });

  const { lesson, inputs } = normalized;
  const tierCode = adminLessonPathwayToTierCode(inputs.pathway);
  const regionScope = inputs.country === "CA" ? "CA_ONLY" : "US_ONLY";
  const slugBase = parsed.data.slugOverride ?? lesson.slug;
  const slug = await ensureUniqueContentItemSlug(slugBase);
  const content = adminAiLessonToContentBlocks(lesson);
  const bodyPlain = adminAiLessonPlainTextBody(lesson);

  if (bodyPlain.length < 20) {
    return NextResponse.json({ error: "Lesson body too short after assembly" }, { status: 400 });
  }

  const lessonRow = await prisma.contentItem.create({
    data: {
      title: lesson.title.slice(0, 220),
      slug,
      summary: lesson.shortDescription.slice(0, 2000),
      type: "lesson",
      content,
      tier: tierCodeToContentItemTier(tierCode),
      status: contentStatusToDb(ContentStatus.DRAFT),
      regionScope,
      tags: [...lesson.metadata.suggestedTags, `ai-lesson:${inputs.lessonType}`].slice(0, 40),
      category: cat.name ?? cat.slug,
      bodySystem: lesson.metadata.suggestedBodySystem ?? inputs.topicDomain.slice(0, 120),
      versionKey: `ai-draft:${id}`,
    },
  });

  await prisma.generatedLessonDraft.update({
    where: { id },
    data: {
      promotedEntityId: lessonRow.id,
      promotedAt: new Date(),
      reviewStatus: DraftReviewStatus.PROMOTED,
    },
  });

  return NextResponse.json({
    ok: true,
    contentItem: lessonRow,
    editUrl: `/admin/lessons/${lessonRow.id}`,
  });
}
