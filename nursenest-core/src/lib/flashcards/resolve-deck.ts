import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";

export async function findPublishedDeckByRef(ref: string) {
  return withDatabaseFallback(
    () =>
      prisma.flashcardDeck.findFirst({
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
      }),
    null,
  );
}

export async function findDeckByRefAdmin(ref: string) {
  return withDatabaseFallback(
    () =>
      prisma.flashcardDeck.findFirst({
        where: { OR: [{ id: ref }, { slug: ref }] },
        select: { id: true, slug: true, status: true, visibility: true, cardCount: true },
      }),
    null,
  );
}
