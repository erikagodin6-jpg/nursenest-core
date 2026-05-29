/**
 * Adaptive Learning Telemetry
 *
 * Tracks the complete remediation loop:
 *   Weakness detected → Remediation recommended → Opened → Completed → Outcome
 *
 * Metrics generated:
 *   - Remediation success rate (weakness → improvement)
 *   - Topic improvement scores (before/after)
 *   - Knowledge gain per remediation type
 *   - Retention gain (improvement that holds across sessions)
 *   - Confidence gain
 *
 * Remediation types:
 *   flashcards   — active recall for topic
 *   lesson       — full lesson review
 *   questions    — targeted question drill
 *   study-plan   — structured multi-day plan
 *   smart-review — confidence-grouped review
 *
 * Usage:
 *   recordWeaknessDetected({ userId, topic: "Cardiac Assessment", score: 42, tier: "RN" });
 *   recordRemediationRecommended({ userId, topic: "Cardiac Assessment", type: "flashcards" });
 *   recordRemediationOpened({ userId, topic: "Cardiac Assessment", type: "flashcards" });
 *   recordRemediationCompleted({ userId, topic: "Cardiac Assessment", type: "flashcards", durationMs: 180_000 });
 *   recordLearningOutcome({ userId, topic: "Cardiac Assessment", beforeScore: 42, afterScore: 61 });
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RemediationType = "flashcards" | "lesson" | "questions" | "study-plan" | "smart-review";

export type WeaknessRecord = {
  userId: string;
  topic: string;
  /** Accuracy score 0–100 at time of weakness detection. */
  score: number;
  tier: string;
  pathwayId?: string;
  detectedAt: string;
};

export type RemediationRecord = {
  userId: string;
  topic: string;
  type: RemediationType;
  tier?: string;
};

export type LearningOutcomeRecord = {
  userId: string;
  topic: string;
  remediationType?: RemediationType;
  beforeScore: number;
  afterScore: number;
  /** How many days between before and after measurement. */
  daysBetween?: number;
};

// ─── In-process metrics store ─────────────────────────────────────────────────

type TopicBucket = {
  weaknessDetections: number;
  remediationsRecommended: number;
  remediationsOpened: number;
  remediationsCompleted: number;
  outcomeImprovements: number;
  outcomeRegressions: number;
  totalScoreGain: number;
  outcomeSamples: number;
  remediationDurationMs: number;
  durationSamples: number;
};

const topicStore = new Map<string, TopicBucket>();
const typeStore = new Map<RemediationType, { opened: number; completed: number; totalGain: number; gainSamples: number }>();

function topicBucket(topic: string): TopicBucket {
  let b = topicStore.get(topic);
  if (!b) {
    b = {
      weaknessDetections: 0,
      remediationsRecommended: 0,
      remediationsOpened: 0,
      remediationsCompleted: 0,
      outcomeImprovements: 0,
      outcomeRegressions: 0,
      totalScoreGain: 0,
      outcomeSamples: 0,
      remediationDurationMs: 0,
      durationSamples: 0,
    };
    topicStore.set(topic, b);
  }
  return b;
}

function typeBucket(type: RemediationType) {
  let b = typeStore.get(type);
  if (!b) {
    b = { opened: 0, completed: 0, totalGain: 0, gainSamples: 0 };
    typeStore.set(type, b);
  }
  return b;
}

// ─── Recording ────────────────────────────────────────────────────────────────

export function recordWeaknessDetected(record: WeaknessRecord): void {
  topicBucket(record.topic).weaknessDetections++;
  safeServerLog("learner", "weakness_detected", {
    topic: record.topic.slice(0, 80),
    score: record.score,
    tier: record.tier,
    pathwayId: record.pathwayId?.slice(0, 80),
  });
}

export function recordRemediationRecommended(record: RemediationRecord): void {
  topicBucket(record.topic).remediationsRecommended++;
  safeServerLog("learner", "remediation_recommended", {
    topic: record.topic.slice(0, 80),
    type: record.type,
    tier: record.tier,
  });
}

export function recordRemediationOpened(record: RemediationRecord): void {
  topicBucket(record.topic).remediationsOpened++;
  typeBucket(record.type).opened++;
  safeServerLog("learner", "remediation_opened", {
    topic: record.topic.slice(0, 80),
    type: record.type,
  });
}

export function recordRemediationCompleted(
  record: RemediationRecord & { durationMs: number },
): void {
  const b = topicBucket(record.topic);
  b.remediationsCompleted++;
  b.remediationDurationMs += record.durationMs;
  b.durationSamples++;
  typeBucket(record.type).completed++;

  safeServerLog("learner", "remediation_completed", {
    topic: record.topic.slice(0, 80),
    type: record.type,
    durationMs: record.durationMs,
  });
}

export function recordLearningOutcome(record: LearningOutcomeRecord): void {
  const b = topicBucket(record.topic);
  const gain = record.afterScore - record.beforeScore;

  b.outcomeSamples++;
  b.totalScoreGain += gain;
  if (gain > 0) b.outcomeImprovements++;
  else if (gain < -3) b.outcomeRegressions++; // Allow ±3 as noise

  if (record.remediationType) {
    const tb = typeBucket(record.remediationType);
    tb.totalGain += Math.max(0, gain);
    tb.gainSamples++;
  }

  safeServerLog("learner", "learning_outcome", {
    topic: record.topic.slice(0, 80),
    beforeScore: record.beforeScore,
    afterScore: record.afterScore,
    gain,
    remediationType: record.remediationType,
    daysBetween: record.daysBetween,
    improved: gain > 3,
  });
}

// ─── Statistics ───────────────────────────────────────────────────────────────

export type TopicImprovementReport = {
  topic: string;
  weaknessDetections: number;
  remediationFunnelRate: number | null;  // recommended / detected
  completionRate: number | null;         // completed / opened
  successRate: number | null;            // improved / outcomes measured
  avgScoreGain: number | null;
  avgDurationMs: number | null;
};

export function getTopicImprovementReports(): TopicImprovementReport[] {
  return [...topicStore.entries()].map(([topic, b]) => ({
    topic,
    weaknessDetections: b.weaknessDetections,
    remediationFunnelRate: b.weaknessDetections > 0
      ? b.remediationsRecommended / b.weaknessDetections : null,
    completionRate: b.remediationsOpened > 0
      ? b.remediationsCompleted / b.remediationsOpened : null,
    successRate: b.outcomeSamples > 0
      ? b.outcomeImprovements / b.outcomeSamples : null,
    avgScoreGain: b.outcomeSamples > 0
      ? Math.round((b.totalScoreGain / b.outcomeSamples) * 10) / 10 : null,
    avgDurationMs: b.durationSamples > 0
      ? Math.round(b.remediationDurationMs / b.durationSamples) : null,
  }));
}

export type RemediationTypeStats = {
  type: RemediationType;
  opened: number;
  completed: number;
  completionRate: number | null;
  avgScoreGain: number | null;
};

export function getRemediationTypeStats(): RemediationTypeStats[] {
  const allTypes: RemediationType[] = ["flashcards", "lesson", "questions", "study-plan", "smart-review"];
  return allTypes.map((type) => {
    const b = typeStore.get(type) ?? { opened: 0, completed: 0, totalGain: 0, gainSamples: 0 };
    return {
      type,
      opened: b.opened,
      completed: b.completed,
      completionRate: b.opened > 0 ? b.completed / b.opened : null,
      avgScoreGain: b.gainSamples > 0
        ? Math.round((b.totalGain / b.gainSamples) * 10) / 10 : null,
    };
  });
}

/** Overall platform remediation success rate. */
export function getPlatformRemediationSuccessRate(): number | null {
  let totalOutcomes = 0;
  let totalImprovements = 0;
  for (const b of topicStore.values()) {
    totalOutcomes += b.outcomeSamples;
    totalImprovements += b.outcomeImprovements;
  }
  return totalOutcomes > 0 ? totalImprovements / totalOutcomes : null;
}

export function resetAdaptiveLearningObservability(): void {
  topicStore.clear();
  typeStore.clear();
}
