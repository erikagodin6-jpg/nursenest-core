import { ContentStatus, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getAlliedProfessionByProfessionKey } from "@/lib/allied/allied-professions-registry";
import {
  filterTopicRowsForAlliedProfession,
  filterWeakTopicsForAlliedProfession,
} from "@/lib/allied/allied-weak-topic-filter";
import { resolvePathwayLessonForWeakTopic, resolvePathwayNextLesson, type PathwayNextLesson } from "@/lib/learner/resolve-pathway-next-lesson";
import {
  loadUnifiedTopicPerformance,
  type TopicPerformanceSnapshot,
  type TopicTrendRow,
} from "@/lib/learner/topic-performance";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

export type LearnerStudySnapshot = {
  weakTopics: WeakTopicRow[];
  topicPerformanceSource: TopicPerformanceSnapshot["source"];
  /** Trajectory hints from scored history (declining → improving sort). */
  topicTrends: TopicTrendRow[];
  /** Topics with solid accuracy for reinforcement copy. */
  strongTopicsHighlight: WeakTopicRow[];
  /** Primary weak topic label for CTAs (null when none). */
  recommendedFocusTopic: string | null;
  /** Strongest weak row after allied filtering (if any). */
  topWeak: WeakTopicRow | null;
  pathwayNext: PathwayNextLesson | null;
  /** Pathway lesson aligned to top weak topic (topic / topicSlug match), if any. */
  weakTopicPathwayLesson: { title: string; href: string; pathwayId: string } | null;
  /** At least one published in-scope flashcard exists for a weak-topic code. */
  hasWeakTopicFlashcards: boolean;
  /** Topic codes derived from weak rows (for flashcard OR match). */
  weakTopicCodes: string[];
};

function weakTopicCodesFromRows(weak: WeakTopicRow[], max = 6): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const w of weak) {
    const code = (w.normalizedTopic ?? normalizeTopicKey(w.topic)).trim();
    if (code.length < 2 || seen.has(code)) continue;
    seen.add(code);
    out.push(code);
    if (out.length >= max) break;
  }
  return out;
}

async function hasFlashcardsForTopicCodes(
  entitlement: AccessScope,
  topicCodes: string[],
): Promise<boolean> {
  if (topicCodes.length === 0) return false;
  const or = topicCodes.map((code) => ({ category: { topicCode: code } }));
  const row = await prisma.flashcard.findFirst({
    where: {
      AND: [
        { status: ContentStatus.PUBLISHED, deckId: { not: null } },
        { deck: { status: ContentStatus.PUBLISHED } },
        flashcardAccessWhere(entitlement),
        { OR: or },
      ],
    },
    select: { id: true },
  });
  return row != null;
}

export type BuildLearnerStudySnapshotOptions = {
  /**
   * When set, skips {@link loadUnifiedTopicPerformance} — pass {@link loadPremiumDashboardSnapshot}'s
   * `topicPerformance` after {@link loadLearnerDashboard} has already computed it.
   */
  topicPerformance?: TopicPerformanceSnapshot | null;
};

/**
 * Bounded read-through snapshot for Study Next (no new persistence).
 */
export async function buildLearnerStudySnapshot(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  options?: BuildLearnerStudySnapshotOptions | null,
): Promise<LearnerStudySnapshot | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  let perf: TopicPerformanceSnapshot;
  if (options?.topicPerformance != null) {
    perf = options.topicPerformance;
  } else {
    perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
  }
  let weakTopics = perf.weakTopics;

  const userRow = await prisma.user.findUnique({
    where: { id: userId },
    select: { alliedProfessionKey: true, tier: true, learnerPath: true },
  });

  const learnerPathResolved = (learnerPath ?? userRow?.learnerPath ?? null)?.trim() || null;

  let topicTrends = perf.trends.slice(0, 3);
  let strongTopicsHighlight = perf.strongTopics.slice(0, 3);

  if (userRow?.tier === TierCode.ALLIED && userRow.alliedProfessionKey) {
    const ap = getAlliedProfessionByProfessionKey(userRow.alliedProfessionKey);
    weakTopics = filterWeakTopicsForAlliedProfession(weakTopics, ap);
    topicTrends = filterTopicRowsForAlliedProfession(topicTrends, ap).slice(0, 3);
    strongTopicsHighlight = filterWeakTopicsForAlliedProfession(strongTopicsHighlight, ap).slice(0, 3);
    perf = {
      ...perf,
      weakTopics,
    };
  }

  const topWeak = weakTopics[0] ?? null;
  const recommendedFocusTopic = topWeak?.topic?.trim() || null;

  const pathwayNext = await resolvePathwayNextLesson(userId, entitlement, learnerPathResolved);

  const weakKey = topWeak ? (topWeak.normalizedTopic ?? normalizeTopicKey(topWeak.topic)) : "";
  const weakTopicPathwayLesson =
    topWeak && weakKey.length > 1
      ? await resolvePathwayLessonForWeakTopic(userId, entitlement, learnerPathResolved, weakKey)
      : null;

  const weakTopicCodes = weakTopicCodesFromRows(weakTopics);
  const hasWeakTopicFlashcards =
    weakTopicCodes.length > 0 ? await hasFlashcardsForTopicCodes(entitlement, weakTopicCodes) : false;

  return {
    weakTopics,
    topicPerformanceSource: perf.source,
    topicTrends,
    strongTopicsHighlight,
    recommendedFocusTopic,
    topWeak,
    pathwayNext,
    weakTopicPathwayLesson,
    hasWeakTopicFlashcards,
    weakTopicCodes,
  };
}
