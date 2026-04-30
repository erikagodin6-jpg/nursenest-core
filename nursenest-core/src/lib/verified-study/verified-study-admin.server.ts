import "server-only";

import { prisma } from "@/lib/db";
import { publicCommunityDeckIsPublishable } from "@/lib/verified-study/verified-study-deck-access";

export async function listPendingPublicVerifiedStudyDecks(take = 40) {
  return prisma.verifiedStudyDeck.findMany({
    where: {
      visibility: "PUBLIC",
      moderationStatus: "PENDING",
    },
    orderBy: { updatedAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      pathwayId: true,
      ownerId: true,
      verificationStatus: true,
      moderationStatus: true,
      updatedAt: true,
      _count: { select: { cards: true } },
    },
  });
}

export async function adminApprovePublicVerifiedStudyDeck(deckId: string) {
  const deck = await prisma.verifiedStudyDeck.findUnique({
    where: { id: deckId },
    include: {
      cards: { select: { verificationStatus: true, referencesJson: true } },
    },
  });
  if (!deck) return { ok: false as const, code: "not_found" as const };

  const pub = publicCommunityDeckIsPublishable(deck, deck.cards);
  if (!pub.ok) return { ok: false as const, code: "publish_gate_failed" as const, reasons: pub.reasons };

  await prisma.verifiedStudyDeck.update({
    where: { id: deckId },
    data: {
      moderationStatus: "APPROVED",
      verificationStatus: "VERIFIED",
      publishedAt: new Date(),
    },
  });
  return { ok: true as const };
}

export async function adminRejectPublicVerifiedStudyDeck(deckId: string) {
  await prisma.verifiedStudyDeck.updateMany({
    where: { id: deckId, visibility: "PUBLIC", moderationStatus: "PENDING" },
    data: { moderationStatus: "REJECTED", publishedAt: null },
  });
  return { ok: true as const };
}

export async function adminVerifyVerifiedStudyCard(cardId: string) {
  await prisma.verifiedStudyCard.update({
    where: { id: cardId },
    data: {
      verificationStatus: "VERIFIED",
      lastVerifiedAt: new Date(),
    },
  });
  return { ok: true as const };
}

export async function adminUnpublishPublicVerifiedStudyDeck(deckId: string) {
  await prisma.verifiedStudyDeck.updateMany({
    where: { id: deckId, visibility: "PUBLIC" },
    data: {
      moderationStatus: "PENDING",
      publishedAt: null,
    },
  });
  return { ok: true as const };
}
