/**
 * Deterministic adaptive recommendation engine — pure functions, injectable time (`nowMs`).
 * Reads existing pathway + lesson types; does not persist or call external services.
 */
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import {
  deriveCanonicalStudyTopicSlug,
  pathwayCatPoolSurfaceAvailable,
} from "@/lib/lessons/pathway-lesson-linked-learning-assets";
import type {
  AdaptiveRecommendationBundle,
  AdaptiveRecommendationContext,
  FlashcardStudyRecommendation,
  LessonRecommendationCandidate,
  LessonStudyRecommendation,
  PracticeCatCategoryHint,
  RankedWeakTopic,
  TopicWeaknessSignalInput,
} from "@/lib/adaptive-learning/adaptive-learning-types";

const FOURTEEN_D_MS = 14 * 24 * 60 * 60 * 1000;
/** Topics at or above this mastery estimate are treated as mastered for ranking. */
export const ADAPTIVE_MASTERED_TOPIC_THRESHOLD = 0.88;
const MAX_LESSON_RECS = 5;
const MAX_WEAK_TOPIC_RANK = 12;

function topicKeyForLesson(c: LessonRecommendationCandidate): string {
  if (c.linkedLearningSignals?.bidirectionalTopicKey)
    return c.linkedLearningSignals.bidirectionalTopicKey;
  return deriveCanonicalStudyTopicSlug({
    topicSlug: c.topicSlug,
    topic: c.bodySystem,
    slug: c.slug,
  });
}

/**
 * Composite urgency: misses × recency boost × (1 − mastery).
 * Tie-break: lexicographic `topicKey` applied after sort (stable).
 */
export function computeTopicUrgencyScore(s: TopicWeaknessSignalInput, nowMs: number): number {
  const misses = Math.max(0, s.missCount);
  let recencyBoost = 0;
  if (s.lastAttemptMs != null && Number.isFinite(s.lastAttemptMs)) {
    const age = Math.max(0, nowMs - s.lastAttemptMs);
    recencyBoost = Math.max(0, 1 - age / FOURTEEN_D_MS) * 0.75;
  }
  const mastery = Math.min(1, Math.max(0, s.masteryEstimate ?? 0));
  const masteryFactor = 0.15 + (1 - mastery) * 0.85;
  return misses * (1 + recencyBoost) * masteryFactor;
}

export function rankWeakTopics(signals: TopicWeaknessSignalInput[], nowMs: number): RankedWeakTopic[] {
  const filtered = signals.filter((s) => {
    const k = s.topicKey.trim();
    if (!k) return false;
    return (s.masteryEstimate ?? 0) < ADAPTIVE_MASTERED_TOPIC_THRESHOLD;
  });

  const scored = filtered.map((s) => ({
    ...s,
    urgencyScore: computeTopicUrgencyScore(s, nowMs),
  }));

  scored.sort((a, b) => {
    if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
    return a.topicKey.localeCompare(b.topicKey);
  });

  return scored.slice(0, MAX_WEAK_TOPIC_RANK).map(({ urgencyScore, ...rest }) => ({
    ...rest,
    urgencyScore,
  }));
}

export function recommendLessonsForWeakTopics(
  ranked: RankedWeakTopic[],
  candidates: LessonRecommendationCandidate[],
  maxResults: number = MAX_LESSON_RECS,
): LessonStudyRecommendation[] {
  const weakKeys = new Set(ranked.map((r) => r.topicKey.trim()).filter(Boolean));
  if (weakKeys.size === 0 || candidates.length === 0) return [];

  const out: LessonStudyRecommendation[] = [];
  const seen = new Set<string>();

  for (const topic of ranked) {
    const tk = topic.topicKey.trim();
    if (!tk) continue;
    for (const c of candidates) {
      if (out.length >= maxResults) return out;
      const slug = c.slug.trim();
      if (!slug || seen.has(slug)) continue;
      const lessonKey = topicKeyForLesson(c);
      if (lessonKey !== tk) continue;
      seen.add(slug);
      out.push({ slug, title: c.title, topicKey: tk, reason: "weak_topic_match" });
    }
  }
  return out;
}

export function recommendFlashcardsForTopics(
  pathwayId: string,
  ranked: RankedWeakTopic[],
  linked: AdaptiveRecommendationContext["linkedLearning"],
): FlashcardStudyRecommendation[] {
  const top = ranked.slice(0, 6);
  return top.map((r) => {
    const topicKey = r.topicKey.trim();
    const linkedOk = Boolean(linked?.flashcardsLinked && linked.bidirectionalTopicKey === topicKey);
    return {
      topicKey,
      allowed: linkedOk,
      reason: linkedOk ? "linked_surface_available" : "linked_surface_blocked",
    };
  });
}

export function buildPracticeCatHints(
  pathwayId: string,
  ranked: RankedWeakTopic[],
  linked: AdaptiveRecommendationContext["linkedLearning"],
): PracticeCatCategoryHint {
  const topicKeys = ranked.slice(0, 8).map((r) => r.topicKey.trim()).filter(Boolean);
  const catPoolSurfaceAvailable = pathwayCatPoolSurfaceAvailable(pathwayId);
  const suggestStudyModeReview =
    Boolean(linked?.adaptiveLearningReadiness) && catPoolSurfaceAvailable && topicKeys.length > 0;
  return { topicKeys, catPoolSurfaceAvailable, suggestStudyModeReview };
}

/**
 * Role-track branch for copy / prioritization hints — does not change pool IDs.
 * Uses catalog `roleTrack` + `examFamily` only (no invented product tiers).
 */
export function adaptiveRoleTrackStudyNotes(roleTrack: RoleTrackSlug): {
  track: RoleTrackSlug;
  questionBankBias: "pn_style" | "rn_style" | "np_advanced" | "allied_general";
} {
  switch (roleTrack) {
    case "rpn":
    case "lpn":
      return { track: roleTrack, questionBankBias: "pn_style" };
    case "np":
      return { track: roleTrack, questionBankBias: "np_advanced" };
    case "allied":
      return { track: roleTrack, questionBankBias: "allied_general" };
    case "rn":
    default:
      return { track: roleTrack, questionBankBias: "rn_style" };
  }
}

export function pathwayMetadataForAdaptive(pathwayId: string): {
  pathwayId: string;
  found: boolean;
  roleTrack: RoleTrackSlug | null;
  examKey: string | null;
} {
  const def = getExamPathwayById(pathwayId.trim());
  if (!def) return { pathwayId, found: false, roleTrack: null, examKey: null };
  return {
    pathwayId: def.id,
    found: true,
    roleTrack: def.roleTrack,
    examKey: def.examKey,
  };
}

export function buildAdaptiveRecommendationBundle(ctx: AdaptiveRecommendationContext): AdaptiveRecommendationBundle {
  const rankedWeakTopics = rankWeakTopics(ctx.weakTopicSignals, ctx.nowMs);
  const flashcards = recommendFlashcardsForTopics(ctx.pathwayId, rankedWeakTopics, ctx.linkedLearning);
  const practiceCat = buildPracticeCatHints(ctx.pathwayId, rankedWeakTopics, ctx.linkedLearning);

  const usedEmptyFallback = rankedWeakTopics.length === 0;
  let fallbackReason: AdaptiveRecommendationBundle["fallbackReason"];
  if (ctx.weakTopicSignals.length === 0) fallbackReason = "no_weak_signals";
  else if (rankedWeakTopics.length === 0) fallbackReason = "all_topics_mastered";

  return {
    rankedWeakTopics,
    lessons: [],
    flashcards,
    practiceCat,
    usedEmptyFallback,
    fallbackReason,
  };
}

/**
 * Same as {@link buildAdaptiveRecommendationBundle} but supplies lesson candidates
 * for weak-topic lesson rows (still deterministic; capped).
 */
export function buildAdaptiveRecommendationBundleWithLessons(
  ctx: AdaptiveRecommendationContext,
  lessonCandidates: LessonRecommendationCandidate[],
): AdaptiveRecommendationBundle {
  const base = buildAdaptiveRecommendationBundle(ctx);
  const lessons = recommendLessonsForWeakTopics(base.rankedWeakTopics, lessonCandidates, MAX_LESSON_RECS);
  let fallbackReason = base.fallbackReason;
  if (
    base.rankedWeakTopics.length > 0 &&
    lessons.length === 0 &&
    lessonCandidates.length > 0
  ) {
    fallbackReason = "no_lesson_candidates";
  }
  const usedEmptyFallback = base.rankedWeakTopics.length === 0;
  return { ...base, lessons, usedEmptyFallback, fallbackReason };
}
