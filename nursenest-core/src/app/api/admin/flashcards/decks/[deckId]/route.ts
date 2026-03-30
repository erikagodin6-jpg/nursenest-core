import { NextResponse } from "next/server";
import { ContentStatus, FlashcardDeckVisibility } from "@prisma/client";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

const patchSchema = z.object({
  status: z.nativeEnum(ContentStatus).optional(),
  visibility: z.nativeEnum(FlashcardDeckVisibility).optional(),
  sortOrder: z.number().int().optional(),
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
});

type Props = { params: Promise<{ deckId: string }> };

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: Props) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const { deckId } = await params;
  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const deck = await prisma.flashcardDeck.findFirst({
    where: { OR: [{ id: deckId }, { slug: deckId }] },
    select: { id: true },
  });
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  try {
    const { status, visibility, sortOrder, title, description } = parsed.data;
    const updated = await prisma.flashcardDeck.update({
      where: { id: deck.id },
      data: {
        ...(status !== undefined && { status }),
        ...(visibility !== undefined && { visibility }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
      select: {
        id: true,
        slug: true,
        title: true,
        status: true,
        visibility: true,
        sortOrder: true,
        cardCount: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ deck: updated });
  } catch (e) {
    safeServerLogCritical("admin_flashcards_deck_patch", "update_failed", { deckId: deck.id.slice(0, 12) }, e);
    return NextResponse.json({ error: "Update failed" }, { status: 503 });
  }
}
