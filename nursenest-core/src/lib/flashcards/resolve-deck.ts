import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

export async function findPublishedDeckByRef(ref: string) {
  return prisma.flashcardDeck.findFirst({
    where: {
      OR: [{ id: ref }, { slug: ref }],
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      country: true,
      tier: true,
      examFamily: true,
      pathwayId: true,
      visibility: true,
      status: true,
      cardCount: true,
    },
  });
}

export async function findDeckByRefAdmin(ref: string) {
  return prisma.flashcardDeck.findFirst({
    where: { OR: [{ id: ref }, { slug: ref }] },
    select: { id: true, slug: true, status: true, visibility: true, cardCount: true },
  });
}
