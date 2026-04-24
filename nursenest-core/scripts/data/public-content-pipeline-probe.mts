#!/usr/bin/env npx tsx
/**
 * Read-only probe: `SELECT 1` + row counts for blog index, pathway lessons hub, and public flashcard scope.
 * Run from `nursenest-core/` with `DATABASE_URL` set (same semantics as the app).
 *
 *   npm run data:public-content-pipeline-probe
 *   npm run data:public-content-pipeline-probe:strict   # exit 1 if DB unreachable or all public counts are zero
 */
import { ContentStatus, PrismaClient } from "@prisma/client";

import "../../src/lib/db/script-env-bootstrap";
import { blogLiveWhere } from "../../src/lib/blog/blog-visibility";
import { publicMarketingFlashcardDeckWhere } from "../../src/lib/entitlements/content-access-scope";

const CANADA_RN_PATHWAY_ID = "ca-rn-nclex-rn";
const strict = process.argv.includes("--strict");

async function main(): Promise<void> {
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

    const dbProbe = {
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
    };

    console.log(JSON.stringify({ dbProbe, strict }, null, 2));

    if (strict) {
      if (!select1Ok) {
        console.error("[public-content-pipeline-probe] strict: select1Ok is false");
        process.exit(1);
      }
      const sumPublic =
        blogLiveTotal +
        pathwayLessonPublishedTotal +
        flashcardDeckPublic +
        flashcardTagPublic +
        flashcardRowPublic;
      if (sumPublic === 0) {
        console.error(
          "[public-content-pipeline-probe] strict: all primary public content counts are zero (blog live + pathway lessons + flashcard public scope)",
        );
        process.exit(1);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
