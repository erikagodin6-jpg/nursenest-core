import { ContentStatus } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";
import { deriveTopicCode } from "@/lib/learner/topic-linking";
import { resolveRationaleLessonLinksForQuestion } from "@/lib/learner/rationale-lesson-link-resolve";

export type RemediationResolvedLinks = {
  lessonHref: string | null;
  flashcardsHref: string | null;
  practiceQuestionsHref: string | null;
  topicCode: string | null;
};

/**
 * Reuses the same pathway/topic/body resolution strategy as `/api/questions/grade`
 * (rationale lesson links + topicCode drill + flashcard deck lookup).
 */
export async function resolveRemediationContentLinks(
  prisma: PrismaClient,
  args: {
    pathwayId: string | null;
    topic: string | null;
    subtopic: string | null;
    bodySystem: string | null;
    tags: string[];
    stem?: string | null;
  },
): Promise<RemediationResolvedLinks> {
  const topicCode = deriveTopicCode({
    topic: args.topic,
    subtopic: args.subtopic,
    bodySystem: args.bodySystem,
  });

  try {
    const rationaleLessonLinks = await resolveRationaleLessonLinksForQuestion(prisma, {
      pathwayId: args.pathwayId,
      topic: args.topic,
      subtopic: args.subtopic,
      bodySystem: args.bodySystem,
      tags: args.tags,
      stem: args.stem ?? null,
    });

    const [linkedContentLesson, linkedDeck] = topicCode
      ? await Promise.all([
          prisma.contentItem.findFirst({
            where: { type: "lesson", status: "published", bodySystem: topicCode },
            select: { id: true },
            orderBy: { updatedAt: "desc" },
          }),
          prisma.flashcardDeck.findFirst({
            where: {
              status: ContentStatus.PUBLISHED,
              cards: {
                some: {
                  status: ContentStatus.PUBLISHED,
                  category: { topicCode },
                },
              },
            },
            select: { slug: true },
            orderBy: { sortOrder: "asc" },
          }),
        ])
      : [null, null];

    const lessonHrefFromRationale = rationaleLessonLinks[0]?.href ?? null;
    const lessonHrefFromContent = linkedContentLesson ? `/app/lessons/${linkedContentLesson.id}` : null;
    const lessonHref = lessonHrefFromRationale ?? lessonHrefFromContent;

    const flashcardsHref = topicCode
      ? linkedDeck
        ? `/app/flashcards/${linkedDeck.slug}/study?topicCode=${encodeURIComponent(topicCode)}`
        : `/app/flashcards?topicCode=${encodeURIComponent(topicCode)}`
      : args.topic
        ? `/app/flashcards?q=${encodeURIComponent(args.topic)}`
        : "/app/flashcards";

    const topicDrillQs = new URLSearchParams();
    topicDrillQs.set("preset", "topic_drill");
    if (args.pathwayId) topicDrillQs.set("pathwayId", args.pathwayId);
    if (topicCode && args.topic) {
      topicDrillQs.set("topic", args.topic);
    } else if (topicCode) {
      topicDrillQs.set("topic", topicCode);
    } else if (args.topic) {
      topicDrillQs.set("topic", args.topic);
    }
    if (topicCode) topicDrillQs.set("topicCode", topicCode);

    const practiceQuestionsHref =
      topicDrillQs.has("topic") || topicDrillQs.has("topicCode")
        ? `/app/questions?${topicDrillQs.toString()}`
        : args.pathwayId
          ? `/app/questions?pathwayId=${encodeURIComponent(args.pathwayId)}`
          : "/app/questions";

    return {
      lessonHref,
      flashcardsHref,
      practiceQuestionsHref,
      topicCode,
    };
  } catch {
    return {
      lessonHref: null,
      flashcardsHref: args.topic ? `/app/flashcards?q=${encodeURIComponent(args.topic)}` : "/app/flashcards",
      practiceQuestionsHref: args.pathwayId
        ? `/app/questions?pathwayId=${encodeURIComponent(args.pathwayId)}`
        : "/app/questions",
      topicCode,
    };
  }
}
