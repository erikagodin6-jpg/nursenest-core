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
  const [
    contentByType,
    lessonsPublished,
    lessonsApp,
    examPub,
    examApp,
    decksPub,
    decksAll,
    fcPub,
    fcApp,
    pathwayPub,
  ] = await Promise.all([
    prisma.contentItem.groupBy({ by: ["type", "status"], _count: true }),
    prisma.contentItem.count({ where: { type: "lesson", status: "published" } }),
    prisma.contentItem.count({ where: lessonAccessWhere(usRnSubscriber) }),
    prisma.examQuestion.count({ where: { status: "published" } }),
    prisma.examQuestion.count({ where: questionAccessWhere(usRnSubscriber) }),
    prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.flashcardDeck.count(),
    prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.flashcard.count({ where: flashcardAccessWhere(usRnSubscriber) }),
    prisma.pathwayLesson.count({ where: { status: ContentStatus.PUBLISHED } }),
  ]);

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
