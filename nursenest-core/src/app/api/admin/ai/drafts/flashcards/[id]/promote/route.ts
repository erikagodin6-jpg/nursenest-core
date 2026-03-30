import { ContentStatus, DraftReviewStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import type { NormalizedFlashcardDraft } from "@/lib/content/ai-draft-validation";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  categoryId: z.string().min(5).optional(),
  deckId: z.string().min(3).optional(),
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

  const cat = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!cat) return NextResponse.json({ error: "Invalid categoryId" }, { status: 400 });

  if (!draft.normalizedJson || typeof draft.normalizedJson !== "object") {
    return NextResponse.json({ error: "Draft has no normalized content" }, { status: 400 });
  }

  const n = draft.normalizedJson as unknown as NormalizedFlashcardDraft;

  const deckId = parsed.data.deckId;

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
        categoryId,
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
