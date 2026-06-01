import { ContentStatus, TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import {
  filterTopicRowsForAlliedEntitlement,
  filterWeakTopicsForAlliedEntitlement,
} from "@/lib/allied/allied-weak-topic-filter";
import { resolvePathwayLessonForWeakTopic, resolvePathwayNextLesson, type PathwayNextLesson } from "@/lib/learner/resolve-pathway-next-lesson";
import { shouldSkipNonCriticalLearnerWork } from "@/lib/durability/durability-flags";
import {
  loadUnifiedTopicPerformance,
  type TopicPerformanceSnapshot,
  type TopicTrendRow,
} from "@/lib/learner/topic-performance";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import { loadWithLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache.server";
import {
  DASHBOARD_ANALYTICS_TTL_SECONDS,
  learnerPrivateReadAccessScopeKey,
} from "@/lib/cache/learner-private-read-cache-keying";

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
  /** Recent completed practice tests include at least one incorrect question id. */
  hasMissedPracticeQuestions: boolean;
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

async function learnerHasMissedQuestionInRecentTests(userId: string): Promise<boolean> {
  const rows = await prisma.practiceTest.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { completedAt: "desc" },
    take: 12,
    select: { results: true },
  });
  for (const r of rows) {
    const inc = (r.results as PracticeTestResultsJson | null)?.incorrectQuestionIds;
    if (Array.isArray(inc) && inc.some((x) => typeof x === "string" && x.length > 4)) return true;
  }
  return false;
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
  /**
   * When set with threaded `topicPerformance`, skips a duplicate `User` read (same pathway bundle as premium snapshot).
   */
  studyBootstrap?: {
    alliedProfessionKey: string | null;
    tier: TierCode | null;
    learnerPath: string | null;
  };
};

/**
 * Uncached implementation — called by the cached wrapper below.
 * Direct callers that need a fresh read (e.g. topic-performance invalidation)
 * may import this and call it directly.
 */
export async function buildLearnerStudySnapshotUncached(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  options?: BuildLearnerStudySnapshotOptions | null,
): Promise<LearnerStudySnapshot | null> {
  if (!userId || !entitlement.hasAccess || !isDatabaseUrlConfigured()) return null;

  /**
   * When durability mode skips topic perf in {@link loadLearnerDashboard}, `topicPerformance` is null.
   * Do **not** run a second {@link loadUnifiedTopicPerformance} here — that would undo degraded-mode savings.
   */
  if (options?.topicPerformance == null && shouldSkipNonCriticalLearnerWork()) {
    return {
      weakTopics: [],
      topicPerformanceSource: "fallback",
      topicTrends: [],
      strongTopicsHighlight: [],
      recommendedFocusTopic: null,
      topWeak: null,
      pathwayNext: null,
      weakTopicPathwayLesson: null,
      hasWeakTopicFlashcards: false,
      hasMissedPracticeQuestions: false,
      weakTopicCodes: [],
    };
  }

  let perf: TopicPerformanceSnapshot;
  if (options?.topicPerformance != null) {
    perf = options.topicPerformance;
  } else {
    perf = await loadUnifiedTopicPerformance(userId, entitlement, 8);
  }
  let weakTopics = perf.weakTopics;

  const userRow = options?.studyBootstrap
    ? {
        alliedProfessionKey: options.studyBootstrap.alliedProfessionKey,
        tier: options.studyBootstrap.tier,
        learnerPath: options.studyBootstrap.learnerPath,
      }
    : await prisma.user.findUnique({
        where: { id: userId },
        select: { alliedProfessionKey: true, tier: true, learnerPath: true },
      });

  const learnerPathResolved = (learnerPath ?? userRow?.learnerPath ?? null)?.trim() || null;

  let topicTrends = perf.trends.slice(0, 3);
  let strongTopicsHighlight = perf.strongTopics.slice(0, 3);

  if (entitlement.tier === TierCode.ALLIED && entitlement.hasAccess) {
    weakTopics = filterWeakTopicsForAlliedEntitlement(weakTopics, entitlement, learnerPathResolved);
    topicTrends = filterTopicRowsForAlliedEntitlement(topicTrends, entitlement, learnerPathResolved).slice(0, 3);
    strongTopicsHighlight = filterTopicRowsForAlliedEntitlement(
      strongTopicsHighlight,
      entitlement,
      learnerPathResolved,
    ).slice(0, 3);
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
  const [hasWeakTopicFlashcards, hasMissedPracticeQuestions] = await Promise.all([
    weakTopicCodes.length > 0 ? hasFlashcardsForTopicCodes(entitlement, weakTopicCodes) : Promise.resolve(false),
    learnerHasMissedQuestionInRecentTests(userId),
  ]);

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
    hasMissedPracticeQuestions,
    weakTopicCodes,
  };
}

/**
 * 15-minute cached wrapper for buildLearnerStudySnapshot.
 *
 * The cache is keyed on userId + entitlement scope. It is bypassed when:
 *   - topicPerformance is supplied (caller has fresh data from the same request)
 *   - durability mode is active (degraded state returns the fast empty shape)
 *   - the learner has no access
 *
 * Invalidation: call `invalidateLearnerPrivateReadCache(userId, ["weak-area-summary"])`
 * after a question answer, CAT completion, or practice completion.
 */
export async function buildLearnerStudySnapshot(
  userId: string,
  entitlement: AccessScope,
  learnerPath: string | null | undefined,
  options?: BuildLearnerStudySnapshotOptions | null,
): Promise<LearnerStudySnapshot | null> {
  // When the caller threads freshly-fetched topicPerformance from the same
  // request, bypass the cache — the data is already as fresh as it can be.
  const bypassCache =
    !entitlement.hasAccess ||
    options?.topicPerformance != null ||
    shouldSkipNonCriticalLearnerWork();

  return loadWithLearnerPrivateReadCache(
    {
      surface: "weak-area-summary",
      userId,
      ttlSeconds: DASHBOARD_ANALYTICS_TTL_SECONDS,
      keyParts: [learnerPrivateReadAccessScopeKey(entitlement)],
      bypass: bypassCache,
    },
    () => buildLearnerStudySnapshotUncached(userId, entitlement, learnerPath, options),
  );
}
