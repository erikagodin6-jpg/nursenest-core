import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { LearnerCompetencyTrend, PostExamCoachingContext } from "@/lib/learner/post-exam-coaching/types";

export function buildLearnerCompetencyTrends(
  topicTrends: TopicTrendRow[],
  weakTopics: WeakTopicRow[],
  sessionWeakLabels: string[],
): LearnerCompetencyTrend[] {
  const weakSet = new Set(sessionWeakLabels.map((t) => t.toLowerCase()));
  const weakRowByTopic = new Map(weakTopics.map((w) => [w.topic.toLowerCase(), w]));

  const topics = new Set<string>();
  for (const t of topicTrends) topics.add(t.topic);
  for (const w of sessionWeakLabels) topics.add(w);

  return [...topics].map((topic) => {
    const trend = topicTrends.find((r) => r.topic === topic);
    const weakRow = weakRowByTopic.get(topic.toLowerCase());
    const momentum = trend?.momentum ?? "stable";
    const persistentWeak =
      weakSet.has(topic.toLowerCase()) &&
      (weakRow?.wrongStreak ?? 0) >= 2 &&
      (weakRow?.strength === "weak" || (weakRow?.missRate ?? 0) >= 50);
    const recurringTimingIssue = false;

    let narrative: string;
    if (momentum === "improving" && persistentWeak) {
      narrative = `${topic} accuracy has improved over recent sessions, but misses in this run suggest the gain is not stable yet — keep short remediation sets before reassessing.`;
    } else if (momentum === "improving") {
      narrative = `${topic} is trending up across your recent study — maintain with mixed practice, not volume alone.`;
    } else if (momentum === "declining" || persistentWeak) {
      narrative = `${topic} remains a recurring gap across sessions. Prioritize mechanism review, then timed drills in this domain.`;
    } else {
      narrative = trend?.summary ?? `Keep sampling ${topic} to confirm whether it stays a priority.`;
    }

    return {
      topic,
      momentum,
      sessionCount: weakRow?.attempted ?? 0,
      narrative,
      persistentWeak,
      recurringTimingIssue,
    };
  }).slice(0, 8);
}

export function buildLongitudinalContext(args: {
  topicTrends: TopicTrendRow[];
  weakTopics: WeakTopicRow[];
  sessionWeakLabels: string[];
  recentCompletedSessions?: number;
}): { context: PostExamCoachingContext; narratives: string[] } {
  const trends = buildLearnerCompetencyTrends(
    args.topicTrends,
    args.weakTopics,
    args.sessionWeakLabels,
  );
  const persistentWeakTopics = trends.filter((t) => t.persistentWeak || t.momentum === "declining").map((t) => t.topic);
  const narratives = trends
    .filter((t) => t.persistentWeak || t.momentum !== "stable")
    .map((t) => t.narrative)
    .slice(0, 3);

  return {
    context: {
      topicTrends: trends,
      persistentWeakTopics,
      recentSessionCount: args.recentCompletedSessions ?? 0,
    },
    narratives,
  };
}
