import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import {
  resolveRnCompetencyForTopic,
  type RnCompetencyId,
} from "@/lib/educational-graph/rn-competency-ontology";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import type { ClinicalJudgmentPattern, TimingIntelligenceResult } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { deriveTimingCognitionSignals } from "@/lib/learner/rn-coaching-intelligence/timing-cognition";
import { analyzeTimingIntelligenceV2 } from "@/lib/learner/rn-coaching-intelligence/timing-intelligence-v2";
import {
  EMPTY_LEARNER_STATE,
  type CompetencyVolatility,
  type HesitationProfile,
  type PacingProfile,
  type RnCompetencyMasteryState,
  type RnLearnerStateSnapshot,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

const MEASUREMENT_TOPIC_TAGS: Record<string, string> = {
  "abg-interpretation": "abg_interpretation",
  "acid-base": "abg_interpretation",
  electrolytes: "electrolyte_trend",
  hyperkalemia: "potassium_trend",
  "fluid-balance": "electrolyte_trend",
  sepsis: "lactate_trend",
  pharmacology: "medication_monitoring",
};

function volatilityFromTrend(momentum: TopicTrendRow["momentum"], missRate: number): CompetencyVolatility {
  if (momentum === "improving" && missRate >= 45) return "volatile";
  if (momentum === "improving") return "improving";
  if (momentum === "declining") return "declining";
  if (missRate >= 50 && momentum === "stable") return "plateau";
  return "stable";
}

function masteryFromWeakRow(row: WeakTopicRow | undefined, sessionWeak: boolean): number {
  if (!row) return sessionWeak ? 35 : 55;
  const rate = row.missRate ?? 50;
  return Math.max(0, Math.min(100, Math.round(100 - rate)));
}

export function buildCompetencyStatesFromPerformance(args: {
  topicTrends: TopicTrendRow[];
  weakTopics: WeakTopicRow[];
  sessionWeakLabels: string[];
}): RnCompetencyMasteryState[] {
  const { topicTrends, weakTopics, sessionWeakLabels } = args;
  const weakSet = new Set(sessionWeakLabels.map((l) => l.toLowerCase()));
  const byTopic = new Map(weakTopics.map((w) => [w.topic.toLowerCase(), w]));
  const now = new Date().toISOString();
  const byCompetency = new Map<RnCompetencyId, RnCompetencyMasteryState>();

  const topics = new Set<string>();
  for (const t of topicTrends) topics.add(t.topic);
  for (const w of weakTopics) topics.add(w.topic);
  for (const s of sessionWeakLabels) topics.add(s);

  for (const topic of topics) {
    const node = resolveRnCompetencyForTopic(topic);
    if (!node) continue;
    const trend = topicTrends.find((r) => r.topic === topic);
    const weakRow = byTopic.get(topic.toLowerCase());
    const sessionWeak = weakSet.has(topic.toLowerCase());
    const missRate = weakRow?.missRate ?? (sessionWeak ? 55 : 40);
    const mastery = masteryFromWeakRow(weakRow, sessionWeak);
    const volatility = volatilityFromTrend(trend?.momentum ?? "stable", missRate);

    const existing = byCompetency.get(node.id);
    if (existing && existing.masteryScore <= mastery) continue;

    byCompetency.set(node.id, {
      competencyId: node.id,
      masteryScore: mastery,
      volatility,
      sessionEvidenceCount: (weakRow?.attempted ?? 0) + (sessionWeak ? 1 : 0),
      persistentWeak: sessionWeak && (weakRow?.wrongStreak ?? 0) >= 2,
      remediationResponsive: null,
      lastUpdatedAt: now,
    });
  }

  return [...byCompetency.values()].sort((a, b) => a.masteryScore - b.masteryScore);
}

export function deriveMeasurementWeaknesses(topicLabels: string[]): string[] {
  const out = new Set<string>();
  for (const label of topicLabels) {
    const key = normalizeTopicKey(label) ?? label.toLowerCase();
    const tag = MEASUREMENT_TOPIC_TAGS[key];
    if (tag) out.add(tag);
  }
  return [...out];
}

export function derivePacingProfile(timing: TimingIntelligenceResult | null, avgSec: number | null): PacingProfile {
  if (!timing && avgSec == null) return "balanced";
  if (timing?.rapidGuessTopics.length && timing.hesitationClusterTopics.length) return "volatile";
  if (timing?.rapidGuessTopics.length || (avgSec != null && avgSec < 45)) return "fast";
  if (timing?.hesitationClusterTopics.length || (avgSec != null && avgSec > 150)) return "deliberate";
  return "balanced";
}

export function deriveHesitationProfile(timing: TimingIntelligenceResult | null): HesitationProfile {
  if (!timing) return "moderate";
  if (timing.hesitationClusterTopics.length >= 2) return "high";
  if (timing.hesitationClusterTopics.length === 0) return "low";
  return "moderate";
}

export function readinessMomentumFromTrajectory(scores: number[]): number {
  if (scores.length < 2) return 0;
  const recent = scores.slice(-4);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const variance =
    recent.reduce((acc, s) => acc + (s - mean) ** 2, 0) / Math.max(1, recent.length - 1);
  const slope = recent[recent.length - 1] - recent[0];
  return Math.max(0, Math.min(1, Math.abs(slope) / 40 + Math.sqrt(variance) / 50));
}

export function hydrateLearnerState(args: {
  pathwayId: string | null;
  topicTrends: TopicTrendRow[];
  weakTopics: WeakTopicRow[];
  sessionWeakLabels: string[];
  sessionReadinessScore: number;
  timing: TimingIntelligenceResult | null;
  reasoningPatterns: ClinicalJudgmentPattern[];
  priorState?: RnLearnerStateSnapshot | null;
  remediationExposureCount?: number;
  confidenceInstability?: number;
}): RnLearnerStateSnapshot {
  const base = args.priorState ?? EMPTY_LEARNER_STATE(args.pathwayId);
  const trajectory = [...base.readinessTrajectory, args.sessionReadinessScore].slice(-12);
  const competencyStates = buildCompetencyStatesFromPerformance({
    topicTrends: args.topicTrends,
    weakTopics: args.weakTopics,
    sessionWeakLabels: args.sessionWeakLabels,
  });
  const measurementWeaknesses = deriveMeasurementWeaknesses([
    ...args.sessionWeakLabels,
    ...args.weakTopics.map((w) => w.topic),
  ]);

  const exposureFatigue = Math.min(1, (args.remediationExposureCount ?? 0) / 12);

  const draft: RnLearnerStateSnapshot = {
    version: 1,
    updatedAt: new Date().toISOString(),
    pathwayId: args.pathwayId,
    readinessTrajectory: trajectory,
    pacingProfile: derivePacingProfile(args.timing, args.timing?.avgSecPerQuestion ?? null),
    hesitationProfile: deriveHesitationProfile(args.timing),
    reasoningPatterns: [...new Set([...base.reasoningPatterns, ...args.reasoningPatterns])].slice(-8),
    measurementWeaknesses: [...new Set([...base.measurementWeaknesses, ...measurementWeaknesses])].slice(-6),
    focusAreaSlugs: [
      ...new Set([
        ...base.focusAreaSlugs,
        ...args.sessionWeakLabels,
        ...args.weakTopics.map((w) => w.normalizedTopic ?? w.topic),
      ]),
    ].slice(-12),
    competencyStates,
    remediationFatigueScore: Math.min(1, Math.max(base.remediationFatigueScore * 0.85, exposureFatigue)),
    confidenceInstability: Math.max(base.confidenceInstability, args.confidenceInstability ?? 0),
    readinessMomentum: readinessMomentumFromTrajectory(trajectory),
  };

  if (args.timing && args.timing.signals.length >= 4) {
    const timingV2 = analyzeTimingIntelligenceV2({
      totalQuestions: args.timing.signals.length,
      elapsedMs: null,
      outcomes: args.timing.signals.map((s) => ({
        questionId: s.questionId,
        isCorrect: s.isCorrect,
        topic: s.topic,
        questionType: s.questionType,
      })),
    });
    const signals = deriveTimingCognitionSignals({ learnerState: draft, timingV2 });
    draft.timingCognition = {
      riskBand: signals.riskBand,
      fatigueTrajectory: signals.fatigueTrajectory,
      hesitationClusterCount: signals.hesitationClusterCount,
      unstablePatientRecognition: args.reasoningPatterns.includes("delayed_escalation"),
    };
  }

  return draft;
}
