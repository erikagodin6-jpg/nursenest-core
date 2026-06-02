import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  certaintyTierFromReliability,
  longitudinalClaimPrefix,
} from "@/lib/learner/rn-coaching-intelligence/coaching-claim-governance";
import type {
  LearnerCompetencyTrend,
  PostExamCoachingContext,
  ReadinessReliability,
  TimingIntelligenceV2Result,
} from "@/lib/learner/rn-coaching-intelligence/coaching-types";

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

  return [...topics]
    .map((topic) => {
      const trend = topicTrends.find((r) => r.topic === topic);
      const weakRow = weakRowByTopic.get(topic.toLowerCase());
      const momentum = trend?.momentum ?? "stable";
      const persistentWeak =
        weakSet.has(topic.toLowerCase()) &&
        (weakRow?.wrongStreak ?? 0) >= 2 &&
        (weakRow?.strength === "weak" || (weakRow?.missRate ?? 0) >= 50);

      let narrative: string;
      if (momentum === "improving" && persistentWeak) {
        narrative = `${topic}: improving but inconsistent — recent gains are not stable yet.`;
      } else if (momentum === "improving") {
        narrative = `${topic} is trending up — maintain with mixed practice.`;
      } else if (momentum === "declining" || persistentWeak) {
        narrative = `${topic} remains a recurring gap — mechanism review, then timed drills.`;
      } else {
        narrative = trend?.summary ?? `Keep sampling ${topic} to confirm priority.`;
      }

      return {
        topic,
        momentum,
        sessionCount: weakRow?.attempted ?? 0,
        narrative,
        persistentWeak,
        recurringTimingIssue: false,
      };
    })
    .slice(0, 8);
}

export function buildLongitudinalContextV2(args: {
  topicTrends: TopicTrendRow[];
  weakTopics: WeakTopicRow[];
  sessionWeakLabels: string[];
  recentCompletedSessions?: number;
  learnerState?: RnLearnerStateSnapshot | null;
  timing?: TimingIntelligenceV2Result | null;
  readinessReliability?: ReadinessReliability;
}): { context: PostExamCoachingContext; narratives: string[] } {
  const trends = buildLearnerCompetencyTrends(
    args.topicTrends,
    args.weakTopics,
    args.sessionWeakLabels,
  );
  const persistentWeakTopics = trends
    .filter((t) => t.persistentWeak || t.momentum === "declining")
    .map((t) => t.topic);

  const prefix = longitudinalClaimPrefix(
    certaintyTierFromReliability(args.readinessReliability ?? "moderate"),
  );
  const narratives = trends
    .filter((t) => t.persistentWeak || t.momentum !== "stable")
    .map((t) => `${prefix} ${t.narrative}`)
    .slice(0, 3);

  const state = args.learnerState;
  const timing = args.timing;

  if (state) {
    const plateau = state.competencyStates.filter((c) => c.volatility === "plateau");
    if (plateau.length) {
      narratives.push(
        `${prefix} ${plateau[0].competencyId.replace(/_/g, " ")} looks plateaued — rotate modality instead of repeating the same lesson.`,
      );
    }
    if (state.remediationFatigueScore >= 0.65) {
      narratives.push("Similar remediation steps appeared recently — rotate flashcards, drills, and interpretation.");
    }
  }

  if (timing?.cognitive) {
    if (timing.cognitive.confidenceInstability >= 0.35) {
      narratives.push("Persistent hesitation despite some correct outcomes — confidence is unstable under pressure.");
    }
    if (timing.cognitive.fatigueDetected) {
      narratives.push("Late-session deterioration — use shorter timed blocks and place hardest domains earlier.");
    }
    if (timing.rapidGuessTopics.length) {
      narratives.push("Fast responder pattern with elevated unsafe misses — add a stabilization check before submit.");
    }
  }

  for (const t of trends) {
    if (timing?.hesitationClusterTopics.some((h) => h.toLowerCase() === t.topic.toLowerCase())) {
      t.recurringTimingIssue = true;
    }
  }

  return {
    context: {
      topicTrends: trends,
      persistentWeakTopics,
      recentSessionCount: args.recentCompletedSessions ?? 0,
    },
    narratives: [...new Set(narratives)].slice(0, 5),
  };
}
