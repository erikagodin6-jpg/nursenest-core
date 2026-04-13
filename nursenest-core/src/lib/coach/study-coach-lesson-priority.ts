import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { rankStudyPriorities } from "@/lib/coach/study-coach-priorities";
import type { CoachContextInput } from "@/lib/coach/study-coach-types";

/** Minimal context for lesson page priority match when dashboard snapshot is not loaded. */
export function buildMinimalCoachContextFromStudySnapshot(snap: LearnerStudySnapshot): CoachContextInput {
  return {
    recentAccuracyPct: null,
    weakTopicCount: snap.weakTopics.length,
    weakTopics: snap.weakTopics.slice(0, 20).map((w) => ({
      topic: w.topic,
      topicSlug: (w.normalizedTopic ?? normalizeTopicKey(w.topic)).trim() || normalizeTopicKey(w.topic),
      missRate: w.missRate,
      attempted: w.attempted,
      wrongStreak: w.wrongStreak,
    })),
    topicsImproving: snap.topicTrends.filter((t) => t.momentum === "improving").map((t) => t.topic),
    topicsDeclining: snap.topicTrends.filter((t) => t.momentum === "declining").map((t) => t.topic),
    recentSessionsSample: 0,
    mockExamAvgPct: null,
    catOrPracticeAvgPct: null,
    reviewCompletionRate: null,
    daysSinceLastActivity: null,
    difficultyGapScore: null,
    appReadinessScore: null,
    practiceTrend: null,
    lessonsCompletedRatio: null,
  };
}

export function lessonTopicMatchesTopPriority(
  topicSlug: string | null | undefined,
  snap: LearnerStudySnapshot,
): boolean {
  if (!topicSlug?.trim()) return false;
  const ranked = rankStudyPriorities(buildMinimalCoachContextFromStudySnapshot(snap), 3);
  const key = normalizeTopicKey(topicSlug);
  return ranked.some((r) => r.topicSlug === key);
}
