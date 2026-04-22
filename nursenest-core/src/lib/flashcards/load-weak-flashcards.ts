import { ContentStatus, type Prisma, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { getWeakTopicTargetsForPractice, loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import type { RecommendationConfidence } from "@/lib/learner/topic-linking";
import {
  resolveSubscribedQuestionBankPathways,
  type ResolvedQuestionBankPathways,
} from "@/lib/learner/tier-scoped-study-routes";
import { shuffleIdsStableSeed } from "@/lib/flashcards/study-queue";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";

const MAX_WEAK_TOPIC_TERMS = 8;
const FETCH_CAP = 96;
const RETURN_CAP = 48;

export type WeakFlashcardRow = {
  id: string;
  front: string;
  back: string;
  deckSlug: string;
  pathwayId: string | null;
  sourceKey: string | null;
  topic: string;
  subtopic: string | null;
  confidence: RecommendationConfidence;
};

const PRE_NURSING_PATHWAY_SENTINEL = "pre-nursing" as const;

/**
 * Resolves a single exam track for weak-area flashcards — same ladder as practice questions / custom-session:
 * URL `pathwayId` wins when entitled, else `User.learnerPath` when it matches a compatible pathway, else a sole
 * compatible pathway. No silent cross-tier pool when multiple pathways are entitled but none is selected.
 */
export async function resolveSubscriberWeakQueuePathwayId(
  userId: string,
  entitlement: AccessScope,
  requestedPathwayId: string | null | undefined,
): Promise<
  | { ok: true; pathwayId: string; resolution: Extract<ResolvedQuestionBankPathways, { state: "scoped" }> }
  | { ok: false; resolution: Exclude<ResolvedQuestionBankPathways, { state: "scoped" }> }
> {
  const compatibleDefs = await listPathwaysCompatibleWithSubscription(entitlement);
  const compatible = compatibleDefs.map((p) => ({ id: p.id, shortName: p.shortName }));
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
  const learnerPath = u?.learnerPath?.trim() ?? null;

  const resolution = resolveSubscribedQuestionBankPathways({
    requestedPathwayId: requestedPathwayId?.trim() || null,
    compatible,
    learnerPath,
  });

  if (resolution.state === "scoped") {
    return { ok: true, pathwayId: resolution.defaultPathwayId, resolution };
  }

  if (resolution.state === "invalid_requested") {
    return { ok: false, resolution };
  }

  /** Pre-nursing subscribers are not on EXAM_PATHWAYS; lock weak flashcards to the foundational sentinel. */
  if (entitlement.tier === TierCode.PRE_NURSING) {
    const scoped: Extract<ResolvedQuestionBankPathways, { state: "scoped" }> = {
      state: "scoped",
      defaultPathwayId: PRE_NURSING_PATHWAY_SENTINEL,
      pathwayOptions: [{ id: PRE_NURSING_PATHWAY_SENTINEL, shortName: "Pre-Nursing" }],
    };
    return { ok: true, pathwayId: PRE_NURSING_PATHWAY_SENTINEL, resolution: scoped };
  }

  return { ok: false, resolution };
}

/**
 * Pulls published cards in-scope for the learner whose category label overlaps weak topics from practice stats.
 *
 * @param pathwayId - Required non-empty: passed to {@link flashcardPathwayAccessOptionsFromPathwayId}
 *   and then {@link flashcardAccessWhere} so tier/country/deck pathway gates match the learner's selected exam path
 *   (intersection cap — no broader tier expansion beyond the pathway ladder). Callers must resolve via
 *   {@link resolveSubscriberWeakQueuePathwayId} first — do not pass null to widen the pool.
 */
export async function loadWeakAreaFlashcardsForUser(
  userId: string,
  entitlement: AccessScope,
  pathwayId: string | null = null,
): Promise<{ weakTopics: string[]; topicCodes: string[]; cards: WeakFlashcardRow[] }> {
  const scopedPathwayId = pathwayId?.trim() ?? "";
  if (!scopedPathwayId) {
    return { weakTopics: [], topicCodes: [], cards: [] };
  }

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

  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(scopedPathwayId);
  const accessWhere = flashcardAccessWhere(entitlement, pathwayOpts);

  const rows = await prisma.flashcard.findMany({
    where: {
      AND: [
        { status: ContentStatus.PUBLISHED, deckId: { not: null } },
        { deck: { status: ContentStatus.PUBLISHED } },
        accessWhere,
        { OR: or },
      ],
    },
    select: {
      id: true,
      front: true,
      back: true,
      deck: { select: { slug: true, pathwayId: true } },
      sourceKey: true,
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
      pathwayId: c.deck.pathwayId,
      sourceKey: c.sourceKey,
      topic: c.category.name,
      subtopic: c.category.topicCode,
      confidence: confidenceByCode.get(c.category.topicCode ?? "") ?? "low",
    });
    if (cards.length >= RETURN_CAP) break;
  }

  return { weakTopics: topics, topicCodes, cards };
}
