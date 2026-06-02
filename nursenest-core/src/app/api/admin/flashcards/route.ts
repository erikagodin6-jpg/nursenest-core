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
import {
  buildCanonicalOptionsFromAdminPayload,
  buildSataBackField,
  detectOptionInputConflict,
} from "@/lib/flashcards/flashcard-admin-option-write";
import { writeCanonicalOptions } from "@/lib/flashcards/flashcard-option-hydrate.server";
import {
  classifyFlashcardCorpus,
  collectClassificationViolations,
  isPublishBlockedByTaxonomy,
  resolveFlashcardCategoryIdFromClassification,
} from "@/lib/taxonomy/content-write-taxonomy";

// ── Schema ────────────────────────────────────────────────────────────────────

const OPTION_ITEM = z.object({ letter: z.string().min(1).max(1), text: z.string().min(2) });
const RATIONALE_ITEM = z.object({ letter: z.string().min(1).max(1), rationale: z.string().min(4) });

const createSchema = z.object({
  front: z.string().min(4),
  back: z.string().min(4),
  /** Optional canonical pathway lesson id — ties the card into the lesson graph. */
  lessonId: z.string().min(8).max(64).optional(),
  country: z.enum(["CA", "US"]),
  tier: z.enum(["RPN", "LVN_LPN", "RN", "NP", "ALLIED", "PRE_NURSING", "NEW_GRAD"]),
  categoryId: z.string().min(3),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.DRAFT),
  examFamily: z.enum(["NCLEX_RN", "NCLEX_PN", "REX_PN", "NP", "ALLIED", "GENERIC"]).optional(),
  deckId: z.string().min(3).optional(),
  positionInDeck: z.number().int().min(0).optional(),
  examItemKind: z.nativeEnum(FlashcardItemKind).optional(),
  questionStem: z.string().min(8).optional(),
  // MCQ: 3–4 options. SATA: 3–6 options. Max extended for SATA support.
  answerOptions: z.array(OPTION_ITEM).min(3).max(6).optional(),
  // MCQ: single letter "B". SATA-legacy: comma-separated "A,C,D". Prefer correctLetters for SATA.
  correctAnswer: z.string().min(1).optional(),
  // SATA preferred: explicit array ["A","C","D"]. Takes priority over correctAnswer.
  correctLetters: z.array(z.string().min(1).max(1)).min(2).max(5).optional(),
  rationaleCorrect: z.string().min(8).optional(),
  rationaleIncorrect: z.array(RATIONALE_ITEM).optional(),
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
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;

  // ── Lesson reference check ────────────────────────────────────────────────
  if (d.lessonId?.trim()) {
    const pw = await prisma.pathwayLesson.findUnique({
      where: { id: d.lessonId.trim() },
      select: { id: true },
    });
    if (!pw) {
      return NextResponse.json({ error: "lessonId must reference an existing PathwayLesson row", code: "lesson_not_found" }, { status: 400 });
    }
  }

  // ── Exam-style detection ──────────────────────────────────────────────────
  const examTouched =
    d.examItemKind != null ||
    d.questionStem != null ||
    d.answerOptions != null ||
    d.correctAnswer != null ||
    d.correctLetters != null ||
    d.rationaleCorrect != null ||
    (d.rationaleIncorrect != null && d.rationaleIncorrect.length > 0);

  // MCQ path (non-SATA): uses existing validateExamMicroQuestionInput.
  // SATA path: validated by buildCanonicalOptionsFromAdminPayload.
  let examPayload: ExamMicroQuestionPayload | null = null;
  let canonicalOptions: import("@/lib/flashcards/flashcard-option-normalize").CanonicalOption[] | null = null;
  let isSataCard = false;

  if (examTouched) {
    if (!d.examItemKind || !d.questionStem || !d.answerOptions || !d.rationaleCorrect) {
      return NextResponse.json(
        {
          error:
            "Exam-style cards require: examItemKind, questionStem, answerOptions (3–6), rationaleCorrect, " +
            "and either correctAnswer (MCQ) or correctLetters (SATA) with rationaleIncorrect for each wrong option.",
          code: "exam_fields_incomplete",
        },
        { status: 400 },
      );
    }

    isSataCard = d.examItemKind === "SATA";

    if (isSataCard) {
      // ── SATA path ─────────────────────────────────────────────────────────
      const result = buildCanonicalOptionsFromAdminPayload({
        examItemKind: d.examItemKind,
        answerOptions: d.answerOptions,
        correctAnswer: d.correctAnswer,
        correctLetters: d.correctLetters,
        rationaleIncorrect: d.rationaleIncorrect ?? [],
        rationaleCorrect: d.rationaleCorrect,
      });
      if (!result.ok) {
        return NextResponse.json({ error: result.error, code: result.code }, { status: 400 });
      }
      canonicalOptions = result.options;
    } else {
      // ── MCQ path (preserves existing behaviour exactly) ───────────────────
      if (!d.correctAnswer || !d.rationaleIncorrect?.length) {
        return NextResponse.json(
          {
            error:
              "MCQ exam cards require correctAnswer (single letter) and rationaleIncorrect for each distractor.",
            code: "exam_fields_incomplete",
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
        return NextResponse.json({ error: v.error, code: "exam_validation_failed" }, { status: 400 });
      }
      examPayload = v.payload;
      // Also build canonical options for dual-write
      const optResult = buildCanonicalOptionsFromAdminPayload({
        examItemKind: d.examItemKind,
        answerOptions: d.answerOptions,
        correctAnswer: d.correctAnswer,
        rationaleIncorrect: d.rationaleIncorrect,
        rationaleCorrect: d.rationaleCorrect,
      });
      if (optResult.ok) canonicalOptions = optResult.options;
    }
  }

  // ── Published guard ───────────────────────────────────────────────────────
  if (d.status === ContentStatus.PUBLISHED && !examPayload && !isSataCard) {
    return NextResponse.json(
      {
        error:
          "Published flashcards must include a complete exam-style micro-question. " +
          "Definition-only or legacy front/back cards cannot be published.",
        code: "publish_requires_exam_payload",
      },
      { status: 400 },
    );
  }

  // ── front / back derivation ───────────────────────────────────────────────
  const {
    deckId,
    positionInDeck,
    examFamily,
    examItemKind: _ek,
    questionStem: _qs,
    answerOptions: _ao,
    correctAnswer: _ca,
    correctLetters: _cl,
    rationaleCorrect: _rc,
    rationaleIncorrect: _ri,
    ...restCard
  } = parsed.data;
  void _ek; void _qs; void _ao; void _ca; void _cl; void _rc; void _ri;

  let front: string;
  let back: string;
  let examCreateData: Record<string, unknown> = {};

  if (isSataCard && d.questionStem && d.answerOptions) {
    // SATA: persist JSON fields for legacy fallback, derive front/back
    const resolvedCorrectLetters =
      d.correctLetters ?? (d.correctAnswer?.split(",").map((l) => l.trim().toUpperCase()) ?? []);
    front = d.questionStem;
    back = buildSataBackField(resolvedCorrectLetters, d.rationaleCorrect ?? "");
    examCreateData = {
      examItemKind: d.examItemKind,
      questionStem: d.questionStem,
      answerOptions: d.answerOptions as unknown as Prisma.InputJsonValue,
      // Store comma-separated in correctAnswer for legacy readability
      correctAnswer: resolvedCorrectLetters.sort().join(","),
      rationaleCorrect: d.rationaleCorrect,
      rationaleIncorrect: (d.rationaleIncorrect ?? []) as unknown as Prisma.InputJsonValue,
    };
  } else if (examPayload) {
    front = examPayload.questionStem;
    back = correctAnswerLine(examPayload);
    examCreateData = {
      examItemKind: examPayload.itemKind,
      questionStem: examPayload.questionStem,
      answerOptions: examPayload.answerOptions as unknown as Prisma.InputJsonValue,
      correctAnswer: examPayload.correctLetter,
      rationaleCorrect: examPayload.rationaleCorrect,
      rationaleIncorrect: examPayload.rationaleIncorrect as unknown as Prisma.InputJsonValue,
    };
  } else {
    front = restCard.front;
    back = restCard.back;
  }

  // ── Creation guardrails + taxonomy ────────────────────────────────────────
  const examSliceForGuard = examPayload
    ? {
        itemKind: examPayload.itemKind,
        questionStem: examPayload.questionStem,
        answerOptions: examPayload.answerOptions,
        rationaleCorrect: examPayload.rationaleCorrect,
        rationaleIncorrect: examPayload.rationaleIncorrect,
      }
    : null;
  const guard = validateFlashcardCreationGuardrails({
    tier: d.tier as TierCode,
    front,
    back,
    exam: examSliceForGuard,
  });
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error, code: guard.code }, { status: 400 });
  }

  const extraCorpus = canonicalOptions
    ? [
        d.rationaleCorrect ?? "",
        ...(d.rationaleIncorrect ?? []).map((r) => r.rationale),
        ...(d.answerOptions ?? []).map((o) => o.text),
      ].join("\n")
    : null;
  const flashClassification = classifyFlashcardCorpus({ front, back, extra: extraCorpus });
  const flashViolations = collectClassificationViolations(flashClassification);
  if (flashViolations.length > 0) {
    return NextResponse.json(
      { error: "Taxonomy classification invalid", violations: flashViolations, code: "taxonomy_invalid" },
      { status: 422 },
    );
  }
  if (d.status === ContentStatus.PUBLISHED && isPublishBlockedByTaxonomy(flashClassification)) {
    return NextResponse.json(
      {
        error: "Publish blocked — taxonomy could not resolve a publishable category for this card",
        code: "taxonomy_publish_blocked",
        classification: { domain: flashClassification.domain, category: flashClassification.category },
      },
      { status: 422 },
    );
  }

  const resolvedCategory = await resolveFlashcardCategoryIdFromClassification(prisma, flashClassification);
  if (!resolvedCategory.ok) {
    return NextResponse.json({ error: resolvedCategory.error, code: "taxonomy_invalid" }, { status: 422 });
  }
  if (d.categoryId !== resolvedCategory.categoryId) {
    return NextResponse.json(
      {
        error: "categoryId does not match taxonomy classifier output",
        code: "taxonomy_override_mismatch",
        expectedCategoryId: resolvedCategory.categoryId,
      },
      { status: 422 },
    );
  }

  // ── Persist: flashcard + canonical options (dual-write, atomic) ───────────
  const card = await prisma.$transaction(async (tx) => {
    const nextPos =
      positionInDeck ??
      (deckId
        ? ((await tx.flashcard.aggregate({ where: { deckId }, _max: { positionInDeck: true } }))._max.positionInDeck ?? -1) + 1
        : 0);

    const created = await tx.flashcard.create({
      data: {
        ...restCard,
        lessonId: d.lessonId?.trim() ? d.lessonId.trim() : null,
        categoryId: resolvedCategory.categoryId,
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

    // Dual-write: persist canonical option rows alongside JSON fields
    if (canonicalOptions && canonicalOptions.length >= 3) {
      await writeCanonicalOptions(created.id, canonicalOptions, tx);
    }

    return created;
  });

  const conflict = detectOptionInputConflict(d.correctLetters, d.correctAnswer);

  return NextResponse.json(
    {
      flashcard: card,
      canonicalOptionsWritten: canonicalOptions?.length ?? 0,
      ...(conflict ? { _meta: { warning: conflict } } : {}),
    },
    { status: 201 },
  );
}
