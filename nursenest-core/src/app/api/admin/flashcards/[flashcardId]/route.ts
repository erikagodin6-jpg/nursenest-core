/**
 * Admin flashcard GET / PATCH / DELETE for a single card.
 *
 * GET semantics:
 *   - Returns core flashcard fields, exam JSON fields, and resolved options.
 *   - Options prefer canonical FlashcardOption rows; fallback to JSON fields for legacy cards.
 *   - SATA correctLetters is derived from canonical rows (or comma-split correctAnswer).
 *   - optionsSource: "canonical" | "json_fallback" | "none" lets the UI know which path was used.
 *
 * PATCH semantics:
 *   - Partial update: only fields present in the payload are changed.
 *   - If any exam-style field is present, ALL exam fields must be present and valid.
 *   - Canonical FlashcardOption rows are REPLACED atomically (delete-all + create-new)
 *     whenever exam fields are provided, so orphaned option keys are never left behind.
 *   - Legacy JSON fields (answerOptions, correctAnswer, rationaleIncorrect) are always
 *     kept in sync for rollback/backward compatibility.
 *   - When both correctLetters and correctAnswer are provided, correctLetters takes priority
 *     and a structured warning is included in the response metadata.
 *
 * DELETE semantics:
 *   - Hard-deletes the flashcard and cascades to FlashcardOption rows (DB onDelete: Cascade).
 *   - Only allowed for DRAFT cards; published cards require a status change first.
 */

import { NextResponse } from "next/server";
import { ContentStatus, FlashcardItemKind, type Prisma, type TierCode } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import {
  correctAnswerLine,
  validateExamMicroQuestionInput,
  type ExamMicroQuestionPayload,
} from "@/lib/flashcards/flashcard-exam-style";
import {
  buildCanonicalOptionsFromAdminPayload,
  buildSataBackField,
} from "@/lib/flashcards/flashcard-admin-option-write";
import { hydrateFlashcardOptions, replaceCanonicalOptions } from "@/lib/flashcards/flashcard-option-hydrate.server";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";
import { detectOptionInputConflict } from "@/lib/flashcards/flashcard-admin-option-write";

// ── Schema ────────────────────────────────────────────────────────────────────

const OPTION_ITEM = z.object({ letter: z.string().min(1).max(1), text: z.string().min(2) });
const RATIONALE_ITEM = z.object({ letter: z.string().min(1).max(1), rationale: z.string().min(4) });

const patchSchema = z.object({
  front: z.string().min(4).optional(),
  back: z.string().min(4).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  lessonId: z.string().min(8).max(64).nullable().optional(),
  deckId: z.string().min(3).nullable().optional(),
  positionInDeck: z.number().int().min(0).optional(),
  // Exam-style fields — all-or-nothing when any one is present
  examItemKind: z.nativeEnum(FlashcardItemKind).optional(),
  questionStem: z.string().min(8).optional(),
  answerOptions: z.array(OPTION_ITEM).min(3).max(6).optional(),
  correctAnswer: z.string().min(1).optional(),
  correctLetters: z.array(z.string().min(1).max(1)).min(2).max(5).optional(),
  rationaleCorrect: z.string().min(8).optional(),
  rationaleIncorrect: z.array(RATIONALE_ITEM).optional(),
});

type Props = { params: Promise<{ flashcardId: string }> };

// ── GET ───────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/flashcards/[flashcardId]
 *
 * Returns the full card for admin edit forms.
 *
 * Response shape:
 * ```json
 * {
 *   "flashcard": { ...all core + exam fields... },
 *   "options": [ { optionKey, content, isCorrect, rationale, displayOrder } ],
 *   "optionsSource": "canonical" | "json_fallback" | "none",
 *   "correctLetters": ["A","C","D"] | null   // null for MCQ cards
 * }
 * ```
 */
export async function GET(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { flashcardId } = await ctx.params;

  const card = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    select: {
      id: true,
      front: true,
      back: true,
      status: true,
      tier: true,
      country: true,
      categoryId: true,
      examFamily: true,
      examItemKind: true,
      questionStem: true,
      answerOptions: true,
      correctAnswer: true,
      rationaleCorrect: true,
      rationaleIncorrect: true,
      lessonId: true,
      deckId: true,
      positionInDeck: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Flashcard not found", code: "not_found" }, { status: 404 });
  }

  // Hydrate options: canonical rows preferred, JSON fallback for legacy cards.
  const { options, source } = await hydrateFlashcardOptions(card.id, {
    answerOptions: card.answerOptions,
    correctAnswer: card.correctAnswer,
    rationaleIncorrect: card.rationaleIncorrect,
  });

  // Derive correctLetters for SATA cards so the edit form can pre-populate the
  // multi-select without parsing correctAnswer strings.
  let correctLetters: string[] | null = null;
  if (card.examItemKind === "SATA" || options.filter((o) => o.isCorrect).length >= 2) {
    correctLetters = options.filter((o) => o.isCorrect).map((o) => o.optionKey).sort();
  }

  return NextResponse.json({
    flashcard: card,
    options,
    optionsSource: source,
    correctLetters,
  });
}

// ── PATCH ─────────────────────────────────────────────────────────────────────

export async function PATCH(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { flashcardId } = await ctx.params;

  const existing = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    select: { id: true, tier: true, status: true, examItemKind: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Flashcard not found", code: "not_found" }, { status: 404 });
  }

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
  }
  const d = parsed.data;

  // ── Exam-field detection ──────────────────────────────────────────────────
  const examTouched =
    d.examItemKind != null ||
    d.questionStem != null ||
    d.answerOptions != null ||
    d.correctAnswer != null ||
    d.correctLetters != null ||
    d.rationaleCorrect != null ||
    (d.rationaleIncorrect != null && d.rationaleIncorrect.length > 0);

  let examPayload: ExamMicroQuestionPayload | null = null;
  let canonicalOptions: import("@/lib/flashcards/flashcard-option-normalize").CanonicalOption[] | null = null;
  let isSataCard = false;
  let examUpdateData: Record<string, unknown> = {};

  if (examTouched) {
    // All exam fields must be present when any one is touched
    if (!d.examItemKind || !d.questionStem || !d.answerOptions || !d.rationaleCorrect) {
      return NextResponse.json(
        {
          error:
            "When updating exam fields, all are required: examItemKind, questionStem, answerOptions, rationaleCorrect, " +
            "and either correctAnswer (MCQ) or correctLetters (SATA) with rationaleIncorrect for each wrong option.",
          code: "exam_fields_incomplete",
        },
        { status: 400 },
      );
    }

    isSataCard = d.examItemKind === "SATA";

    if (isSataCard) {
      // ── SATA update path ──────────────────────────────────────────────────
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

      const resolvedCorrectLetters =
        d.correctLetters ?? (d.correctAnswer?.split(",").map((l) => l.trim().toUpperCase()) ?? []);

      examUpdateData = {
        examItemKind: d.examItemKind,
        questionStem: d.questionStem,
        answerOptions: d.answerOptions as unknown as Prisma.InputJsonValue,
        correctAnswer: resolvedCorrectLetters.sort().join(","),
        rationaleCorrect: d.rationaleCorrect,
        rationaleIncorrect: (d.rationaleIncorrect ?? []) as unknown as Prisma.InputJsonValue,
      };
    } else {
      // ── MCQ update path ───────────────────────────────────────────────────
      if (!d.correctAnswer || !d.rationaleIncorrect?.length) {
        return NextResponse.json(
          {
            error: "MCQ exam cards require correctAnswer (single letter) and rationaleIncorrect for each distractor.",
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

      const optResult = buildCanonicalOptionsFromAdminPayload({
        examItemKind: d.examItemKind,
        answerOptions: d.answerOptions,
        correctAnswer: d.correctAnswer,
        rationaleIncorrect: d.rationaleIncorrect,
        rationaleCorrect: d.rationaleCorrect,
      });
      if (optResult.ok) canonicalOptions = optResult.options;

      examUpdateData = {
        examItemKind: examPayload.itemKind,
        questionStem: examPayload.questionStem,
        answerOptions: examPayload.answerOptions as unknown as Prisma.InputJsonValue,
        correctAnswer: examPayload.correctLetter,
        rationaleCorrect: examPayload.rationaleCorrect,
        rationaleIncorrect: examPayload.rationaleIncorrect as unknown as Prisma.InputJsonValue,
      };
    }
  }

  // ── Derive front/back if exam fields changed ──────────────────────────────
  let derivedFront: string | undefined;
  let derivedBack: string | undefined;

  if (isSataCard && d.questionStem && d.answerOptions) {
    const resolvedCorrectLetters =
      d.correctLetters ?? (d.correctAnswer?.split(",").map((l) => l.trim().toUpperCase()) ?? []);
    derivedFront = d.questionStem;
    derivedBack = buildSataBackField(resolvedCorrectLetters, d.rationaleCorrect ?? "");
  } else if (examPayload) {
    derivedFront = examPayload.questionStem;
    derivedBack = correctAnswerLine(examPayload);
  }

  // ── Guardrail check (when exam fields are touched) ────────────────────────
  if (examTouched && derivedFront) {
    const guard = validateFlashcardCreationGuardrails({
      tier: (existing.tier as TierCode | null) ?? ("RN" as TierCode),
      front: derivedFront,
      back: derivedBack ?? "",
      exam: examPayload
        ? {
            itemKind: examPayload.itemKind,
            questionStem: examPayload.questionStem,
            answerOptions: examPayload.answerOptions,
            rationaleCorrect: examPayload.rationaleCorrect,
            rationaleIncorrect: examPayload.rationaleIncorrect,
          }
        : null,
    });
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error, code: guard.code }, { status: 400 });
    }
  }

  // ── Atomic update ─────────────────────────────────────────────────────────
  const updated = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = {};

    // Non-exam scalar fields
    if (d.front !== undefined) updateData.front = d.front;
    if (d.back !== undefined) updateData.back = d.back;
    if (d.status !== undefined) updateData.status = d.status;
    if ("lessonId" in d) updateData.lessonId = d.lessonId ?? null;
    if ("deckId" in d) updateData.deckId = d.deckId ?? null;
    if (d.positionInDeck !== undefined) updateData.positionInDeck = d.positionInDeck;

    // Derived front/back from exam fields
    if (derivedFront !== undefined) updateData.front = derivedFront;
    if (derivedBack !== undefined) updateData.back = derivedBack;

    // Exam JSON fields (legacy persistence + canonical write below)
    Object.assign(updateData, examUpdateData);

    const card = await (tx as typeof prisma).flashcard.update({
      where: { id: flashcardId },
      data: updateData,
    });

    // Replace canonical options when exam fields changed
    if (canonicalOptions && canonicalOptions.length >= 3) {
      await replaceCanonicalOptions(flashcardId, canonicalOptions, tx);
    }

    return card;
  });

  const conflict = examTouched ? detectOptionInputConflict(d.correctLetters, d.correctAnswer) : null;

  return NextResponse.json({
    flashcard: updated,
    canonicalOptionsReplaced: canonicalOptions?.length ?? 0,
    ...(conflict ? { _meta: { warning: conflict } } : {}),
  });
}

// ── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { flashcardId } = await ctx.params;

  const existing = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    select: { id: true, status: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Flashcard not found", code: "not_found" }, { status: 404 });
  }
  if (existing.status === ContentStatus.PUBLISHED) {
    return NextResponse.json(
      {
        error: "Published flashcards cannot be deleted directly. Change status to DRAFT or ARCHIVED first.",
        code: "delete_published_blocked",
      },
      { status: 409 },
    );
  }

  // FlashcardOption rows cascade via DB onDelete: Cascade
  await prisma.flashcard.delete({ where: { id: flashcardId } });

  return NextResponse.json({ ok: true, deleted: flashcardId });
}
