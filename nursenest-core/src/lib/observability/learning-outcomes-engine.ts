/**
 * Learning Outcomes Engine
 *
 * Measures concrete learning gains from platform usage:
 *   - Before/after accuracy per topic
 *   - Knowledge gain (accuracy improvement)
 *   - Confidence gain (calibration improvement)
 *   - Retention gain (accuracy held across time)
 *   - Topic improvement leaderboard
 *   - Remediation effectiveness reports
 *
 * Data inputs:
 *   - UserTopicStat rows (correctCount, wrongCount per topic)
 *   - PracticeTest results (before/after quiz scores)
 *   - RemediationEvent records (topic → remediation → outcome)
 *
 * This engine transforms raw performance data into actionable learning insights.
 * It answers: "Are learners actually improving from platform use?"
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LearningGainCategory = "breakthrough" | "strong" | "moderate" | "minimal" | "regression";

export type TopicLearningOutcome = {
  topic: string;
  tier?: string;
  beforeAccuracy: number;  // 0–100
  afterAccuracy: number;   // 0–100
  accuracyGain: number;    // can be negative for regression
  category: LearningGainCategory;
  sampleSize: number;
  improvementRank?: number;
};

export type LearnerOutcomeProfile = {
  userId: string;
  tier: string;
  overallBeforeAccuracy: number;
  overallAfterAccuracy: number;
  totalGain: number;
  topImprovedTopics: TopicLearningOutcome[];
  topWeakTopics: TopicLearningOutcome[];
  remediationSuccessRate: number | null;
  studyStreakDays: number;
};

// ─── Outcome categorization ───────────────────────────────────────────────────

export function categorizeGain(gain: number): LearningGainCategory {
  if (gain >= 20) return "breakthrough";
  if (gain >= 10) return "strong";
  if (gain >= 5)  return "moderate";
  if (gain >= 0)  return "minimal";
  return "regression";
}

// ─── In-process outcome store ─────────────────────────────────────────────────

type TopicOutcomeSample = {
  topic: string;
  beforeAccuracy: number;
  afterAccuracy: number;
  tier?: string;
  recordedAt: number;
};

const MAX_SAMPLES = 1000;
const outcomeSamples: TopicOutcomeSample[] = [];

/** Record a before/after accuracy measurement for a topic. */
export function recordTopicOutcome(sample: TopicOutcomeSample): void {
  outcomeSamples.push(sample);
  if (outcomeSamples.length > MAX_SAMPLES) outcomeSamples.shift();

  const gain = sample.afterAccuracy - sample.beforeAccuracy;
  if (Math.abs(gain) >= 10) {
    safeServerLog("learner", "learning_outcome_significant", {
      topic: sample.topic.slice(0, 80),
      gain: Math.round(gain),
      category: categorizeGain(gain),
      tier: sample.tier,
    });
  }
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

/** Aggregate topic outcomes into improvement leaderboard. */
export function getTopicImprovementLeaderboard(
  opts: { minSamples?: number; tier?: string; topN?: number } = {},
): TopicLearningOutcome[] {
  const { minSamples = 3, tier, topN = 20 } = opts;

  // Group by topic
  const byTopic = new Map<
    string,
    { before: number[]; after: number[]; tier?: string }
  >();

  for (const s of outcomeSamples) {
    if (tier && s.tier !== tier) continue;
    const key = s.topic;
    const group = byTopic.get(key) ?? { before: [], after: [], tier: s.tier };
    group.before.push(s.beforeAccuracy);
    group.after.push(s.afterAccuracy);
    byTopic.set(key, group);
  }

  const outcomes: TopicLearningOutcome[] = [];
  for (const [topic, data] of byTopic) {
    if (data.before.length < minSamples) continue;
    const avgBefore = data.before.reduce((a, b) => a + b, 0) / data.before.length;
    const avgAfter = data.after.reduce((a, b) => a + b, 0) / data.after.length;
    const gain = avgAfter - avgBefore;
    outcomes.push({
      topic,
      tier: data.tier,
      beforeAccuracy: Math.round(avgBefore),
      afterAccuracy: Math.round(avgAfter),
      accuracyGain: Math.round(gain * 10) / 10,
      category: categorizeGain(gain),
      sampleSize: data.before.length,
    });
  }

  // Rank by gain (highest first)
  outcomes.sort((a, b) => b.accuracyGain - a.accuracyGain);
  outcomes.forEach((o, i) => { o.improvementRank = i + 1; });

  return outcomes.slice(0, topN);
}

/** Get topics that are regressing (getting worse over time). */
export function getRegressingTopics(minSamples = 5): TopicLearningOutcome[] {
  return getTopicImprovementLeaderboard({ minSamples, topN: 100 })
    .filter((o) => o.category === "regression")
    .sort((a, b) => a.accuracyGain - b.accuracyGain);
}

/** Platform-level: what % of topics are showing improvement? */
export function getPlatformImprovementRate(): {
  improvingTopics: number;
  totalMeasuredTopics: number;
  improvementRate: number | null;
  avgGain: number | null;
} {
  const outcomes = getTopicImprovementLeaderboard({ minSamples: 2, topN: 1000 });
  if (outcomes.length === 0) {
    return { improvingTopics: 0, totalMeasuredTopics: 0, improvementRate: null, avgGain: null };
  }
  const improving = outcomes.filter((o) => o.accuracyGain > 0).length;
  const avgGain = outcomes.reduce((s, o) => s + o.accuracyGain, 0) / outcomes.length;
  return {
    improvingTopics: improving,
    totalMeasuredTopics: outcomes.length,
    improvementRate: improving / outcomes.length,
    avgGain: Math.round(avgGain * 10) / 10,
  };
}

/** Format a topic improvement report as a human-readable table. */
export function formatImprovementLeaderboard(outcomes: TopicLearningOutcome[]): string {
  if (outcomes.length === 0) return "No topic improvement data yet.";

  const header = `${"#".padEnd(4)} ${"Topic".padEnd(36)} ${"Before".padEnd(8)} ${"After".padEnd(8)} ${"Gain".padEnd(8)} Category`;
  const rows = outcomes.slice(0, 10).map((o) => {
    const gain = o.accuracyGain >= 0 ? `+${o.accuracyGain}` : `${o.accuracyGain}`;
    return (
      `${String(o.improvementRank ?? "?").padEnd(4)} ` +
      `${o.topic.slice(0, 34).padEnd(36)} ` +
      `${o.beforeAccuracy}%`.padEnd(8) +
      `${o.afterAccuracy}%`.padEnd(8) +
      `${gain}%`.padEnd(8) +
      o.category
    );
  });

  return [header, "─".repeat(header.length), ...rows].join("\n");
}

export function resetLearningOutcomes(): void {
  outcomeSamples.length = 0;
}
