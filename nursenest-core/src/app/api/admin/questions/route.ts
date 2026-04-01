import { NextRequest, NextResponse } from "next/server";
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

const tierEnum = z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED"]);
const qTypeEnum = z.enum(["MCQ", "SATA", "NGN_CASE", "ORDERING", "FIB_NUMERIC"]);

const createSchema = z.object({
  stem: z.string().min(10),
  rationale: z.string().min(10),
  options: z.array(z.union([z.string(), z.number()])).min(1),
  answerKey: z.array(z.union([z.string(), z.number()])).min(1),
  questionType: qTypeEnum,
  country: z.enum(["CA", "US"]),
  tier: tierEnum,
  categoryId: z.string().min(5),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  difficulty: z.enum(["FOUNDATION", "INTERMEDIATE", "ADVANCED"]).optional(),
  topicTag: z.string().optional(),
  systemTag: z.string().optional(),
  tags: z.array(z.string()).optional(),
  lessonId: z.string().optional(),
  sourceNotes: z.string().optional(),
  generationBatchId: z.string().optional(),
  /** Required when rationale is below the premium word-count bar but you still need to publish. */
  acknowledgeBelowQualityBar: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(10, Number(sp.get("pageSize") ?? "50")));
  const statusParam = sp.get("status") as ContentStatus | null;
  const topicFilter = sp.get("topic");

  const where = {
    ...(statusParam ? { status: contentStatusToDb(statusParam) } : {}),
    ...(topicFilter ? { topic: topicFilter } : {}),
  };

  const [total, questions] = await Promise.all([
    prisma.examQuestion.count({ where }),
    prisma.examQuestion.findMany({
      where,
      select: {
        id: true,
        stem: true,
        status: true,
        tier: true,
        countryCode: true,
        questionType: true,
        exam: true,
        topic: true,
        tags: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const questionsTrimmed = questions.map((q) => ({
    ...q,
    stem: q.stem.length > 360 ? `${q.stem.slice(0, 360).trim()}…` : q.stem,
  }));

  return NextResponse.json({ page, pageSize, total, questions: questionsTrimmed });
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  let publishGov: ReturnType<typeof governExamQuestionPublish> | null = null;
  if (data.status === ContentStatus.PUBLISHED) {
    publishGov = governExamQuestionPublish(
      {
        stem: data.stem,
        rationale: data.rationale,
        questionType: data.questionType as QuestionType,
        options: data.options,
        answerKey: data.answerKey,
      },
      { acknowledgeBelowQualityBar: data.acknowledgeBelowQualityBar === true },
    );
    if (!publishGov.ok) {
      return NextResponse.json(
        { error: "Publish blocked by editorial policy", reasons: publishGov.reasons, quality: publishGov },
        { status: 422 },
      );
    }
  }

  const hash = stemHash(data.stem);
  const cat = await prisma.category.findUnique({ where: { id: data.categoryId } });
  const topic = [cat?.name, data.topicTag].filter(Boolean).join(" — ") || cat?.slug;

  const question = await prisma.examQuestion.create({
    data: {
      stem: data.stem,
      rationale: data.rationale,
      options: data.options,
      correctAnswer: data.answerKey,
      questionType: adminQuestionTypeToDb(data.questionType),
      countryCode: data.country,
      tier: tierCodeToExamDbTier(data.tier),
      status: contentStatusToDb(data.status),
      exam: examFamilyToExamColumn(data.examFamily),
      difficulty: difficultyBandToInt(data.difficulty) ?? 3,
      topic: topic ?? undefined,
      subtopic: data.systemTag,
      tags: data.tags ?? [],
      careerType: "nursing",
      regionScope: "BOTH",
      stemHash: hash,
    },
  });

  return NextResponse.json(
    {
      question,
      ...(publishGov && publishGov.warnings.length ? { publishWarnings: publishGov.warnings, quality: publishGov } : {}),
    },
    { status: 201 },
  );
}
