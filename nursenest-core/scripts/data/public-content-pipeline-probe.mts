#!/usr/bin/env npx tsx
/**
 * Read-only probe: `SELECT 1` + row counts for blog index, pathway lessons hub, and public flashcard scope.
 * Run from `nursenest-core/` with `DATABASE_URL` set (same semantics as the app).
 *
 *   npm run data:public-content-pipeline-probe
 */
import { ContentStatus, PrismaClient } from "@prisma/client";

import "../../src/lib/db/env-bootstrap";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { publicMarketingFlashcardDeckWhere } from "../../src/lib/entitlements/content-access-scope";

const CANADA_RN_PATHWAY_ID = "ca-rn-nclex-rn";

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  const prisma = new PrismaClient();
  const now = new Date();
  const liveBlogWhere = blogLiveWhere(now);
  const deckWhere = publicMarketingFlashcardDeckWhere();

  try {
    const ping = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1::int as ok`;
    const select1Ok = Array.isArray(ping) && ping[0]?.ok === 1;

    const blogLiveTotal = await prisma.blogPost.count({ where: liveBlogWhere });
    const pathwayLessonPublishedTotal = await prisma.pathwayLesson.count({
      where: { status: ContentStatus.PUBLISHED },
    });
    const pathwayLessonCanadaRn = await prisma.pathwayLesson.count({
      where: { pathwayId: CANADA_RN_PATHWAY_ID, status: ContentStatus.PUBLISHED },
    });
    const flashcardDeckPublic = await prisma.flashcardDeck.count({ where: deckWhere });
    const flashcardTagPublic = await prisma.flashcardTag.count({
      where: { decks: { some: { deck: deckWhere } } },
    });
    const flashcardRowPublic = await prisma.flashcard.count({
      where: { deck: deckWhere },
    });
    const flashcardPublishedAll = await prisma.flashcard.count({
      where: { status: ContentStatus.PUBLISHED },
    });
    const flashcardDeckPublicCardCountPositive = await prisma.flashcardDeck.count({
      where: { ...deckWhere, cardCount: { gt: 0 } },
    });

    console.log(
      JSON.stringify(
        {
          dbProbe: {
            select1Ok,
            blogPostLiveUnderBlogLiveWhere: blogLiveTotal,
            pathwayLessonPublishedAllPathways: pathwayLessonPublishedTotal,
            pathwayLessonPublishedCanadaRnHub: pathwayLessonCanadaRn,
            pathwayLessonCanadaRnPathwayId: CANADA_RN_PATHWAY_ID,
            flashcardDeckPublishedNonHidden: flashcardDeckPublic,
            flashcardTagLinkedToPublicDeck: flashcardTagPublic,
            flashcardRowUnderPublicDeck: flashcardRowPublic,
            flashcardPublishedAllStatusesPublished: flashcardPublishedAll,
            flashcardDeckPublicMarketingWithCardCountGt0: flashcardDeckPublicCardCountPositive,
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
