import { ContentStatus, DraftReviewStatus, FlashcardItemKind, type Prisma, type TierCode } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import type { NormalizedFlashcardDraft } from "@/lib/content/ai-draft-validation";
import { prisma } from "@/lib/db";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";
import {
  buildCanonicalOptionsFromAdminPayload,
  buildSataBackField,
} from "@/lib/flashcards/flashcard-admin-option-write";
import { writeCanonicalOptions } from "@/lib/flashcards/flashcard-option-hydrate.server";
import { correctAnswerLine, validateExamMicroQuestionInput } from "@/lib/flashcards/flashcard-exam-style";
import {
  classifyFlashcardCorpus,
  collectClassificationViolations,
  resolveFlashcardCategoryIdFromClassification,
} from "@/lib/taxonomy/content-write-taxonomy";

const bodySchema = z.object({
  categoryId: z.string().min(5).optional(),
  deckId: z.string().min(3).optional(),
});

type Props = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.generatedFlashcardDraft.findUnique({ where: { id } });
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

  const catOk = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!catOk) return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });

  if (!draft.normalizedJson || typeof draft.normalizedJson !== "object") {
    return NextResponse.json({ error: "Draft has no normalized content" }, { status: 400 });
  }

  const n = draft.normalizedJson as unknown as NormalizedFlashcardDraft;

  const deckId = parsed.data.deckId;

  // ── Attempt to build canonical options from embedded exam question ─────────
  // `examQuestion` is present only when the AI generation run included a full
  // micro-question alongside front/back. Gracefully skipped when absent.
  type CanonicalOpt = import("@/lib/flashcards/flashcard-option-normalize").CanonicalOption;
  let canonicalOptions: CanonicalOpt[] | null = null;
  let examCreateData: Record<string, unknown> = {};
  let promotedFront = n.front;
  let promotedBack = n.back;

  if (n.examQuestion) {
    const eq = n.examQuestion;
    const isSata = eq.examItemKind === "SATA";

    if (isSata) {
      const result = buildCanonicalOptionsFromAdminPayload({
        examItemKind: FlashcardItemKind.SATA,
        answerOptions: eq.answerOptions,
        correctAnswer: eq.correctAnswer,
        correctLetters: eq.correctLetters,
        rationaleIncorrect: eq.rationaleIncorrect,
        rationaleCorrect: eq.rationaleCorrect,
      });
      if (result.ok) {
        canonicalOptions = result.options;
        const resolvedCorrectLetters =
          eq.correctLetters ?? (eq.correctAnswer?.split(",").map((l) => l.trim().toUpperCase()) ?? []);
        promotedFront = eq.questionStem;
        promotedBack = buildSataBackField(resolvedCorrectLetters, eq.rationaleCorrect);
        examCreateData = {
          examItemKind: FlashcardItemKind.SATA,
          questionStem: eq.questionStem,
          answerOptions: eq.answerOptions as unknown as Prisma.InputJsonValue,
          correctAnswer: resolvedCorrectLetters.sort().join(","),
          rationaleCorrect: eq.rationaleCorrect,
          rationaleIncorrect: eq.rationaleIncorrect as unknown as Prisma.InputJsonValue,
        };
      }
      // Non-fatal: if canonical build fails, fall through to front/back only promotion
    } else {
      // MCQ path — validate through existing pipeline
      const itemKind = FlashcardItemKind[eq.examItemKind as keyof typeof FlashcardItemKind];
      if (itemKind && eq.correctAnswer && eq.rationaleIncorrect.length) {
        const v = validateExamMicroQuestionInput({
          examItemKind: itemKind,
          questionStem: eq.questionStem,
          answerOptions: eq.answerOptions,
          correctAnswer: eq.correctAnswer,
          rationaleCorrect: eq.rationaleCorrect,
          rationaleIncorrect: eq.rationaleIncorrect,
        });
        if (v.ok) {
          promotedFront = v.payload.questionStem;
          promotedBack = correctAnswerLine(v.payload);
          examCreateData = {
            examItemKind: v.payload.itemKind,
            questionStem: v.payload.questionStem,
            answerOptions: v.payload.answerOptions as unknown as Prisma.InputJsonValue,
            correctAnswer: v.payload.correctLetter,
            rationaleCorrect: v.payload.rationaleCorrect,
            rationaleIncorrect: v.payload.rationaleIncorrect as unknown as Prisma.InputJsonValue,
          };
          const optResult = buildCanonicalOptionsFromAdminPayload({
            examItemKind: itemKind,
            answerOptions: eq.answerOptions,
            correctAnswer: eq.correctAnswer,
            rationaleIncorrect: eq.rationaleIncorrect,
            rationaleCorrect: eq.rationaleCorrect,
          });
          if (optResult.ok) canonicalOptions = optResult.options;
        }
      }
    }
  }

  const guard = validateFlashcardCreationGuardrails({
    tier: draft.tier as TierCode,
    front: promotedFront,
    back: promotedBack,
    exam: null,
  });
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error, code: guard.code }, { status: 400 });
  }

  const flashClassification = classifyFlashcardCorpus({ front: promotedFront, back: promotedBack, extra: null });
  const viol = collectClassificationViolations(flashClassification);
  if (viol.length > 0) {
    return NextResponse.json({ error: "Taxonomy classification invalid", violations: viol, code: "taxonomy_invalid" }, { status: 422 });
  }
  const resolved = await resolveFlashcardCategoryIdFromClassification(prisma, flashClassification);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error, code: "taxonomy_invalid" }, { status: 422 });
  }
  if (categoryId !== resolved.categoryId) {
    return NextResponse.json(
      {
        error: "categoryId does not match taxonomy classifier output",
        code: "taxonomy_override_mismatch",
        expectedCategoryId: resolved.categoryId,
      },
      { status: 422 },
    );
  }

  const fc = await prisma.$transaction(async (tx) => {
    const nextPos = deckId
      ? ((await tx.flashcard.aggregate({ where: { deckId }, _max: { positionInDeck: true } }))._max.positionInDeck ?? -1) + 1
      : 0;

    const created = await tx.flashcard.create({
      data: {
        front: promotedFront,
        back: promotedBack,
        country: draft.country,
        tier: draft.tier,
        status: ContentStatus.DRAFT,
        examFamily: draft.examFamily,
        categoryId: resolved.categoryId,
        deckId: deckId ?? null,
        positionInDeck: deckId ? nextPos : 0,
        ...examCreateData,
      },
    });

    if (deckId) {
      await tx.flashcardDeck.update({
        where: { id: deckId },
        data: { cardCount: { increment: 1 } },
      });
    }

    // Dual-write canonical options when exam question was embedded in the draft
    if (canonicalOptions && canonicalOptions.length >= 3) {
      await writeCanonicalOptions(created.id, canonicalOptions, tx);
    }

    await tx.generatedFlashcardDraft.update({
      where: { id },
      data: {
        reviewStatus: DraftReviewStatus.PROMOTED,
        promotedEntityId: created.id,
        promotedAt: new Date(),
      },
    });

    return created;
  });

  return NextResponse.json({
    ok: true,
    flashcardId: fc.id,
    canonicalOptionsWritten: canonicalOptions?.length ?? 0,
  });
}
