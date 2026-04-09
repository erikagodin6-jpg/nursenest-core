import { ContentStatus, DraftReviewStatus, QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import type { NormalizedQuestionDraft } from "@/lib/content/ai-draft-validation";
import { governExamQuestionPublish } from "@/lib/content/editorial-publish-policy";
import { stemHash } from "@/lib/content/stem-hash";
import { prisma } from "@/lib/db";
import { contentStatusToDb } from "@/lib/prisma/content-status";
import {
  adminQuestionTypeToDb,
  difficultyBandToInt,
  examFamilyToExamColumn,
  tierCodeToExamDbTier,
} from "@/lib/prisma/exam-question-maps";

const bodySchema = z.object({
  categoryId: z.string().min(5).optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedQuestionDraft.findUnique({ where: { id } });
  if (!draft) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (draft.reviewStatus !== DraftReviewStatus.APPROVED) {
    return NextResponse.json({ error: "Only APPROVED drafts can be promoted" }, { status: 400 });
  }
  if (draft.promotedEntityId) {
    return NextResponse.json({ error: "Already promoted" }, { status: 400 });
  }

  const categoryId = parsed.data.categoryId ?? draft.categoryId;
  if (!categoryId) {
    return NextResponse.json({ error: "categoryId required (on draft or in request)" }, { status: 400 });
  }

  const cat = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!cat) return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });

  if (!draft.normalizedJson || typeof draft.normalizedJson !== "object") {
    return NextResponse.json({ error: "Draft has no normalized content" }, { status: 400 });
  }

  const n = draft.normalizedJson as unknown as NormalizedQuestionDraft;
  const meta = n.metadata;
  const wrongLines = meta?.wrongAnswerRationales?.filter((x) => String(x).trim().length > 0);
  const distractorRationales = wrongLines && wrongLines.length > 0 ? wrongLines : undefined;
  const draftTags = meta?.tags?.length ? meta.tags : [];
  const diffLabel = meta?.difficultyLabel?.toUpperCase();
  const difficultyInt =
    diffLabel === "FOUNDATION" || diffLabel === "INTERMEDIATE" || diffLabel === "ADVANCED"
      ? difficultyBandToInt(diffLabel)
      : undefined;

  const gov = governExamQuestionPublish(
    {
      stem: n.stem,
      rationale: n.rationale,
      questionType: n.questionType as QuestionType,
      options: n.options,
      answerKey: n.answerKey,
    },
    { acknowledgeBelowQualityBar: false },
  );
  if (!gov.ok) {
    return NextResponse.json(
      {
        error: "Draft fails editorial quality bar for promotion",
        reasons: gov.reasons,
        quality: gov,
        hint: "Expand rationale/teaching fields in the draft, or promote manually after editing in the question admin.",
      },
      { status: 422 },
    );
  }

  const hash = stemHash(n.stem);
  const topic = [cat.name, n.topicTag].filter(Boolean).join(" · ") || cat.slug;

  const q = await prisma.examQuestion.create({
    data: {
      stem: n.stem,
      rationale: n.rationale,
      options: n.options,
      correctAnswer: n.answerKey,
      questionType: adminQuestionTypeToDb(String(n.questionType)),
      countryCode: draft.country,
      tier: tierCodeToExamDbTier(draft.tier),
      status: contentStatusToDb(ContentStatus.DRAFT),
      exam: examFamilyToExamColumn(draft.examFamily),
      topic,
      careerType: "nursing",
      regionScope: "BOTH",
      stemHash: hash,
      tags: draftTags,
      ...(difficultyInt !== undefined ? { difficulty: difficultyInt } : {}),
      ...(distractorRationales ? { distractorRationales } : {}),
    },
  });

  await prisma.generatedQuestionDraft.update({
    where: { id },
    data: {
      reviewStatus: DraftReviewStatus.PROMOTED,
      promotedEntityId: q.id,
      promotedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, questionId: q.id });
}
