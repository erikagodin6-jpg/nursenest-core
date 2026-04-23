import { ContentStatus, DraftReviewStatus, type TierCode } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import type { NormalizedFlashcardDraft } from "@/lib/content/ai-draft-validation";
import { prisma } from "@/lib/db";
import { validateFlashcardCreationGuardrails } from "@/lib/flashcards/flashcard-creation-guardrails";
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

  const guard = validateFlashcardCreationGuardrails({
    tier: draft.tier as TierCode,
    front: n.front,
    back: n.back,
    exam: null,
  });
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error, code: guard.code }, { status: 400 });
  }

  const flashClassification = classifyFlashcardCorpus({ front: n.front, back: n.back, extra: null });
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
        front: n.front,
        back: n.back,
        country: draft.country,
        tier: draft.tier,
        status: ContentStatus.DRAFT,
        examFamily: draft.examFamily,
        categoryId: resolved.categoryId,
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

  return NextResponse.json({ ok: true, flashcardId: fc.id });
}
