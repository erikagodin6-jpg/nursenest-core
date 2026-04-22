import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, FlashcardItemKind, type Prisma, type TierCode } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { ADMIN_API_LIST_PAGE, parseBoundedPageSize, parseListPage } from "@/lib/api/api-pagination-limits";
import {
  correctAnswerLine,
  validateExamMicroQuestionInput,
  type ExamMicroQuestionPayload,
} from "@/lib/flashcards/flashcard-exam-style";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";

const createSchema = z.object({
  front: z.string().min(4),
  back: z.string().min(4),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED", "PRE_NURSING", "NEW_GRAD"]),
  categoryId: z.string().min(3),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  deckId: z.string().min(3).optional(),
  positionInDeck: z.number().int().min(0).optional(),
  examItemKind: z.nativeEnum(FlashcardItemKind).optional(),
  questionStem: z.string().min(8).optional(),
  answerOptions: z
    .array(z.object({ letter: z.string().min(1), text: z.string().min(2) }))
    .min(3)
    .max(4)
    .optional(),
  correctAnswer: z.string().min(1).optional(),
  rationaleCorrect: z.string().min(8).optional(),
  rationaleIncorrect: z
    .array(z.object({ letter: z.string().min(1), rationale: z.string().min(4) }))
    .optional(),
});

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const sp = req.nextUrl.searchParams;
  const pageParsed = parseListPage(sp.get("page"));
  if (!pageParsed.ok) {
    return NextResponse.json({ error: pageParsed.error, code: "invalid_page" }, { status: 400 });
  }
  const sizeParsed = parseBoundedPageSize(sp.get("pageSize"), ADMIN_API_LIST_PAGE);
  if (!sizeParsed.ok) {
    return NextResponse.json(
      {
        error: sizeParsed.error.message,
        code: sizeParsed.error.code,
        ...(sizeParsed.error.maxPageSize !== undefined ? { maxPageSize: sizeParsed.error.maxPageSize } : {}),
      },
      { status: 400 },
    );
  }
  const page = pageParsed.page;
  const pageSize = sizeParsed.pageSize;

  const where = {};
  const [total, flashcards] = await Promise.all([
    prisma.flashcard.count({ where }),
    prisma.flashcard.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { id: true, front: true, status: true, tier: true, country: true, updatedAt: true },
    }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return NextResponse.json({ page, pageSize, total, pageCount, flashcards });
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;
  const parsed = createSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const d = parsed.data;
  const examTouched =
    d.examItemKind != null ||
    d.questionStem != null ||
    d.answerOptions != null ||
    d.correctAnswer != null ||
    d.rationaleCorrect != null ||
    (d.rationaleIncorrect != null && d.rationaleIncorrect.length > 0);

  let examPayload: ExamMicroQuestionPayload | null = null;
  if (examTouched) {
    if (
      !d.examItemKind ||
      !d.questionStem ||
      !d.answerOptions ||
      !d.correctAnswer ||
      !d.rationaleCorrect ||
      !d.rationaleIncorrect?.length
    ) {
      return NextResponse.json(
        {
          error:
            "Exam-style cards require examItemKind, questionStem, answerOptions (3–4), correctAnswer, rationaleCorrect, and rationaleIncorrect for each distractor.",
        },
        { status: 400 },
      );
    }
    const v = validateExamMicroQuestionInput({
      examItemKind: d.examItemKind,
      questionStem: d.questionStem,
      answerOptions: d.answerOptions,
      correctAnswer: d.correctAnswer,
      rationaleCorrect: d.rationaleCorrect,
      rationaleIncorrect: d.rationaleIncorrect,
    });
    if (!v.ok) {
      return NextResponse.json({ error: v.error }, { status: 400 });
    }
    examPayload = v.payload;
  }

  if (parsed.data.status === ContentStatus.PUBLISHED) {
    if (!examPayload) {
      return NextResponse.json(
        {
          error:
            "Published flashcards must include a complete exam-style micro-question: examItemKind, questionStem, answerOptions (3–4), correctAnswer, rationaleCorrect, and rationaleIncorrect for each distractor. Definition-only or legacy front/back cards cannot be published.",
        },
        { status: 400 },
      );
    }
  }

  const {
    deckId,
    positionInDeck,
    examFamily,
    examItemKind: _ek,
    questionStem: _qs,
    answerOptions: _ao,
    correctAnswer: _ca,
    rationaleCorrect: _rc,
    rationaleIncorrect: _ri,
    ...restCard
  } = parsed.data;
  void _ek;
  void _qs;
  void _ao;
  void _ca;
  void _rc;
  void _ri;

  const front = examPayload ? examPayload.questionStem : restCard.front;
  const back = examPayload ? correctAnswerLine(examPayload) : restCard.back;

  const examSlice = examPayload
    ? {
        itemKind: examPayload.itemKind,
        questionStem: examPayload.questionStem,
        answerOptions: examPayload.answerOptions,
        rationaleCorrect: examPayload.rationaleCorrect,
        rationaleIncorrect: examPayload.rationaleIncorrect,
      }
    : null;
  const guard = validateFlashcardCreationGuardrails({
    tier: parsed.data.tier as TierCode,
    front,
    back,
    exam: examSlice,
  });
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error, code: guard.code }, { status: 400 });
  }

  const examCreateData = examPayload
    ? {
        examItemKind: examPayload.itemKind,
        questionStem: examPayload.questionStem,
        answerOptions: examPayload.answerOptions as unknown as Prisma.InputJsonValue,
        correctAnswer: examPayload.correctLetter,
        rationaleCorrect: examPayload.rationaleCorrect,
        rationaleIncorrect: examPayload.rationaleIncorrect as unknown as Prisma.InputJsonValue,
      }
    : {};

  const card = await prisma.$transaction(async (tx) => {
    const nextPos =
      positionInDeck ??
      (deckId
        ? ((await tx.flashcard.aggregate({ where: { deckId }, _max: { positionInDeck: true } }))._max.positionInDeck ?? -1) + 1
        : 0);

    const created = await tx.flashcard.create({
      data: {
        ...restCard,
        front,
        back,
        ...examCreateData,
        examFamily: examFamily ?? "GENERIC",
        deckId: deckId ?? null,
        positionInDeck: deckId ? nextPos : 0,
      },
    });

    if (deckId) {
      await tx.flashcardDeck.update({
        where: { id: deckId },
        data: { cardCount: { increment: 1 } },
      });
    }

    return created;
  });

  return NextResponse.json({ flashcard: card }, { status: 201 });
}
