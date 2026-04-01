import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getWeakTopicTargetsForPractice, loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { confidenceFromSignal, type RecommendationConfidence } from "@/lib/learner/topic-linking";
import { shuffleIdsStableSeed } from "@/lib/flashcards/study-queue";

const MAX_WEAK_TOPIC_TERMS = 8;
const FETCH_CAP = 96;
const RETURN_CAP = 48;

export type WeakFlashcardRow = {
  id: string;
  front: string;
  back: string;
  deckSlug: string;
  topic: string;
  subtopic: string | null;
  confidence: RecommendationConfidence;
};

/**
 * Pulls published cards in-scope for the learner whose category label overlaps weak topics from practice stats.
 */
export async function loadWeakAreaFlashcardsForUser(
  userId: string,
  entitlement: AccessScope,
): Promise<{ weakTopics: string[]; topicCodes: string[]; cards: WeakFlashcardRow[] }> {
  const perf = await loadUnifiedTopicPerformance(userId, entitlement, MAX_WEAK_TOPIC_TERMS);
  const topics = perf.weakTopics.map((w) => w.topic.trim()).filter((t) => t.length > 1);
  const targets = await getWeakTopicTargetsForPractice(userId, entitlement, MAX_WEAK_TOPIC_TERMS);
  const highSignalTopicCodes = targets.filter((t) => t.confidence !== "low").map((t) => t.topicCode);
  const topicCodes = (highSignalTopicCodes.length > 0 ? highSignalTopicCodes : targets.map((t) => t.topicCode)).slice(
    0,
    MAX_WEAK_TOPIC_TERMS,
  );
  if (topics.length === 0 || topicCodes.length === 0) {
    return { weakTopics: [], topicCodes: [], cards: [] };
  }
  const confidenceByCode = new Map(targets.map((t) => [t.topicCode, t.confidence]));
  const or: Prisma.FlashcardWhereInput[] = topicCodes.map((code) => ({ category: { topicCode: code } }));

  const rows = await prisma.flashcard.findMany({
    where: {
      AND: [
        { status: ContentStatus.PUBLISHED, deckId: { not: null } },
        { deck: { status: ContentStatus.PUBLISHED } },
        flashcardAccessWhere(entitlement),
        { OR: or },
      ],
    },
    select: {
      id: true,
      front: true,
      back: true,
      deck: { select: { slug: true } },
      category: { select: { name: true, topicCode: true } },
    },
    take: FETCH_CAP,
  });

  const shuffled = shuffleIdsStableSeed(rows.map((r) => r.id));
  const byId = new Map(rows.map((r) => [r.id, r]));
  const cards: WeakFlashcardRow[] = [];
  for (const id of shuffled) {
    const c = byId.get(id);
    if (!c?.deck?.slug) continue;
    cards.push({
      id: c.id,
      front: c.front,
      back: c.back,
      deckSlug: c.deck.slug,
      topic: c.category.name,
      subtopic: c.category.topicCode,
      confidence: confidenceByCode.get(c.category.topicCode ?? "") ?? "low",
    });
    if (cards.length >= RETURN_CAP) break;
  }

  return { weakTopics: topics, topicCodes, cards };
}
