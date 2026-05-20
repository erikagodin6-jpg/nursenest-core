import type { CoachContextInput, LearnerPatternSnapshot } from "./study-coach-types";

/**
 * Compact, non-conversational pattern summary from learner signals.
 * Deterministic only. No freeform storage.
 */
export function buildLearnerPatternSnapshot(input: CoachContextInput): LearnerPatternSnapshot {
  const repeatedWeakTopics: string[] = [];
  const improvingTopics = [...input.topicsImproving];
  const timingPatterns: string[] = [];
  const confidencePatterns: string[] = [];
  const reviewHabits: string[] = [];
  const summarySignals: string[] = [];

  for (const w of input.weakTopics) {
    if ((w.wrongStreak ?? 0) >= 2 || w.missRate >= 60) {
      repeatedWeakTopics.push(w.topic);
    }
  }

  if (input.recentAccuracyPct != null && input.recentAccuracyPct < 58) {
    confidencePatterns.push("Recent scored work shows accuracy below a typical passing band.");
  }
  if (input.recentAccuracyPct != null && input.recentAccuracyPct >= 78) {
    confidencePatterns.push("Recent scored work shows solid accuracy on attempted items.");
  }

  if (input.reviewCompletionRate != null && input.reviewCompletionRate < 0.3) {
    reviewHabits.push("Review completion looks light compared with practice volume.");
  } else if (input.reviewCompletionRate != null && input.reviewCompletionRate >= 0.55) {
    reviewHabits.push("Review completion looks steady.");
  }

  if (input.daysSinceLastActivity != null && input.daysSinceLastActivity > 5 && input.weakTopicCount > 0) {
    timingPatterns.push("Return after a gap with weak topics still flagged.");
  }

  if (input.difficultyGapScore != null && input.difficultyGapScore >= 60) {
    timingPatterns.push("Harder-tagged items show more misses than easier-tagged items in aggregate.");
  }

  if (improvingTopics.length > 0) {
    summarySignals.push("At least one topic shows an improving trend in recent data.");
  }
  if (input.topicsDeclining.length > 0) {
    summarySignals.push("Some topics show more misses than in the prior window.");
  }
  if (repeatedWeakTopics.length > 0) {
    summarySignals.push("Repeated misses cluster on one or more topics.");
  }
  if (summarySignals.length === 0 && input.weakTopicCount === 0) {
    summarySignals.push("Limited weak-topic signal so far. More practice will sharpen patterns.");
  }

  return {
    repeatedWeakTopics: [...new Set(repeatedWeakTopics)].slice(0, 8),
    improvingTopics: [...new Set(improvingTopics)].slice(0, 8),
    timingPatterns,
    confidencePatterns,
    reviewHabits,
    summarySignals: summarySignals.slice(0, 5),
  };
}
