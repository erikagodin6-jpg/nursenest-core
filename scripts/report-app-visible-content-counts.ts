#!/usr/bin/env npx tsx
/**
 * Counts matching learner-facing filters (US + RN subscriber). Run with DATABASE_URL set.
 */
import "../src/lib/db/env-bootstrap";
import { PrismaClient, ContentStatus } from "@prisma/client";
import {
  lessonAccessWhere,
  questionAccessWhere,
  flashcardAccessWhere,
} from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const prisma = new PrismaClient();

const usRnSubscriber: AccessScope = {
  hasAccess: true,
  reason: "active_subscription",
  country: "US",
  tier: "RN",
};

async function main() {
  const contentByType = await prisma.contentItem.groupBy({ by: ["type", "status"], _count: true });
  const lessonsPublished = await prisma.contentItem.count({ where: { type: "lesson", status: "published" } });
  const lessonsApp = await prisma.contentItem.count({ where: lessonAccessWhere(usRnSubscriber) });
  const examPub = await prisma.examQuestion.count({ where: { status: "published" } });
  const examApp = await prisma.examQuestion.count({ where: questionAccessWhere(usRnSubscriber) });
  const decksPub = await prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } });
  const decksAll = await prisma.flashcardDeck.count();
  const fcPub = await prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } });
  const fcApp = await prisma.flashcard.count({ where: flashcardAccessWhere(usRnSubscriber) });
  const pathwayPub = await prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } });

  console.log(
    JSON.stringify(
      {
        content_items_groupBy_type_status: contentByType,
        published_app_lessons_content_items: lessonsPublished,
        visible_to_us_rn_subscriber_content_items: lessonsApp,
        published_exam_questions: examPub,
        visible_to_us_rn_subscriber_exam_questions: examApp,
        published_flashcard_decks: decksPub,
        total_flashcard_decks: decksAll,
        published_flashcards: fcPub,
        visible_to_us_rn_subscriber_flashcards: fcApp,
        published_pathway_lessons: pathwayPub,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
