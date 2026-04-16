import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { ContentStatus, QuestionType } from "@prisma/client";
import { governExamQuestionPublish } from "@/lib/content/editorial-publish-policy";
import { assertExamQuestionContextForPublish } from "@/lib/content-quality/exam-question-context-validation";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { contentStatusToDb } from "@/lib/prisma/content-status";

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_status"),
    ids: z.array(z.string()).min(1).max(500),
    status: z.nativeEnum(ContentStatus),
  }),
  z.object({
    action: z.literal("tag"),
    ids: z.array(z.string()).min(1).max(500),
    tags: z.array(z.string()),
    mode: z.enum(["replace", "append"]).default("replace"),
  }),
  z.object({
    action: z.literal("delete"),
    ids: z.array(z.string()).min(1).max(200),
  }),
]);

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const body = parsed.data;
  if (body.action === "delete") {
    const res = await prisma.examQuestion.deleteMany({ where: { id: { in: body.ids } } });
    return NextResponse.json({ deleted: res.count });
  }

  if (body.action === "set_status") {
    if (body.status === ContentStatus.PUBLISHED) {
      const rows = await prisma.examQuestion.findMany({
        where: { id: { in: body.ids } },
        select: {
          id: true,
          stem: true,
          rationale: true,
          questionType: true,
          options: true,
          correctAnswer: true,
          correctAnswerExplanation: true,
          clinicalReasoning: true,
          keyTakeaway: true,
          tier: true,
          exam: true,
          countryCode: true,
        },
      });
      const blocked: { id: string; reasons: string[] }[] = [];
      for (const row of rows) {
        try {
          assertExamQuestionContextForPublish({
            tier: row.tier,
            exam: row.exam,
            countryCode: row.countryCode,
          });
        } catch (error) {
          blocked.push({
            id: row.id,
            reasons: [error instanceof Error ? error.message : "Exam context required for publish"],
          });
          continue;
        }
        const gov = governExamQuestionPublish(
          {
            stem: row.stem,
            rationale: row.rationale ?? "",
            correctAnswerExplanation: row.correctAnswerExplanation,
            clinicalReasoning: row.clinicalReasoning,
            keyTakeaway: row.keyTakeaway,
            questionType: row.questionType as QuestionType,
            options: row.options as unknown[],
            answerKey: row.correctAnswer as unknown[],
          },
          { acknowledgeBelowQualityBar: false },
        );
        if (!gov.ok) blocked.push({ id: row.id, reasons: gov.reasons });
      }
      if (blocked.length > 0) {
        return NextResponse.json(
          {
            error: "Bulk publish blocked: some rows fail editorial policy",
            blocked,
            hint: "Fix rationales or publish individually with acknowledgeBelowQualityBar.",
          },
          { status: 422 },
        );
      }
    }
    const res = await prisma.examQuestion.updateMany({
      where: { id: { in: body.ids } },
      data: { status: contentStatusToDb(body.status) },
    });
    return NextResponse.json({ updated: res.count });
  }

  const rows = await prisma.examQuestion.findMany({
    where: { id: { in: body.ids } },
    select: { id: true, tags: true },
    take: takeForIdIn(body.ids, 500),
  });

  let updated = 0;
  for (const r of rows) {
    const next =
      body.mode === "replace" ? body.tags : Array.from(new Set([...r.tags, ...body.tags]));
    await prisma.examQuestion.update({ where: { id: r.id }, data: { tags: next } });
    updated += 1;
  }

  return NextResponse.json({ updated });
}
