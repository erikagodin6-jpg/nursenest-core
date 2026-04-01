import { NextResponse } from "next/server";
import { ContentStatus, QuestionType } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { stemHash } from "@/lib/content/stem-hash";
import { governExamQuestionPublish } from "@/lib/content/editorial-publish-policy";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import {
  adminQuestionTypeToDb,
  difficultyBandToInt,
  examFamilyToExamColumn,
  tierCodeToExamDbTier,
} from "@/lib/prisma/exam-question-maps";

const patchSchema = z
  .object({
    stem: z.string().min(10).optional(),
    rationale: z.string().min(10).optional(),
    options: z.array(z.union([z.string(), z.number()])).optional(),
    answerKey: z.array(z.union([z.string(), z.number()])).optional(),
    questionType: z.enum(["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"]).optional(),
    country: z.enum(["CA", "US"]).optional(),
    tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]).optional(),
    categoryId: z.string().optional(),
    status: z.nativeEnum(ContentStatus).optional(),
    examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
    difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
    topicTag: z.string().nullable().optional(),
    systemTag: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
    acknowledgeBelowQualityBar: z.boolean().optional(),
  })
  .strict();

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  const q = await prisma.examQuestion.findUnique({ where: { id } });
  if (!q) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ question: q });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const existing = await prisma.examQuestion.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  const qtDb = d.questionType ? adminQuestionTypeToDb(d.questionType) : existing.questionType;
  const qtForValidation = (d.questionType ?? existing.questionType) as QuestionType;

  const merged = {
    stem: d.stem ?? existing.stem,
    rationale: d.rationale ?? existing.rationale ?? "",
    questionType: qtForValidation,
    options: d.options ?? (existing.options as unknown[]),
    answerKey: d.answerKey ?? (existing.correctAnswer as unknown[]),
  };

  const nextStatusDb = d.status ? contentStatusToDb(d.status) : existing.status;
  let publishGov: ReturnType<typeof governExamQuestionPublish> | null = null;
  if (d.status === ContentStatus.PUBLISHED) {
    publishGov = governExamQuestionPublish(
      {
        stem: merged.stem,
        rationale: merged.rationale,
        correctAnswerExplanation: existing.correctAnswerExplanation,
        clinicalReasoning: existing.clinicalReasoning,
        keyTakeaway: existing.keyTakeaway,
        questionType: merged.questionType,
        options: merged.options,
        answerKey: merged.answerKey,
      },
      { acknowledgeBelowQualityBar: d.acknowledgeBelowQualityBar === true },
    );
    if (!publishGov.ok) {
      return NextResponse.json(
        { error: "Publish blocked by editorial policy", reasons: publishGov.reasons, quality: publishGov },
        { status: 422 },
      );
    }
  }

  let topic = existing.topic;
  if (d.categoryId) {
    const cat = await prisma.category.findUnique({ where: { id: d.categoryId } });
    topic = [cat?.name, d.topicTag ?? undefined].filter(Boolean).join(" — ") || cat?.slug || topic;
  } else if (d.topicTag !== undefined) {
    topic = d.topicTag ?? existing.topic;
  }

  const question = await prisma.examQuestion.update({
    where: { id },
    data: {
      stem: d.stem,
      rationale: d.rationale,
      options: d.options,
      correctAnswer: d.answerKey,
      questionType: d.questionType ? qtDb : undefined,
      countryCode: d.country,
      tier: d.tier ? tierCodeToExamDbTier(d.tier) : undefined,
      status: d.status ? nextStatusDb : undefined,
      exam: d.examFamily ? examFamilyToExamColumn(d.examFamily) : undefined,
      difficulty: d.difficulty !== undefined ? difficultyBandToInt(d.difficulty) : undefined,
      topic: topic ?? undefined,
      subtopic: d.systemTag ?? undefined,
      tags: d.tags,
      ...(d.stem !== undefined ? { stemHash: stemHash(d.stem) } : {}),
    },
  });

  return NextResponse.json({
    question,
    ...(publishGov && publishGov.warnings.length ? { publishWarnings: publishGov.warnings, quality: publishGov } : {}),
  });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { id } = await ctx.params;
  try {
    await prisma.examQuestion.delete({ where: { id } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
