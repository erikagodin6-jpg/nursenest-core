import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import { isPrescribingSafetyTopic, topicDangerLevel } from "@/lib/remediation/topic-taxonomy";

export type LongTermMasteryStat = {
  topic: string;
  correctCount: number;
  wrongCount: number;
  wrongStreak: number;
  lastWrongAt: Date | null;
  lastAttemptAt: Date | null;
  remediationEvents?: Array<{
    mistakeType: string;
    createdAt: Date;
  }>;
};

export type LongTermMasterySignal = {
  topic: string;
  topicKey: string;
  attempts: number;
  accuracyPct: number;
  reasoningDurability: number;
  conceptDecayRisk: number;
  prioritizationConsistency: number;
  pharmacologyRetention: number | null;
  unsafeRelapseRisk: number;
  priorityScore: number;
  recommendedReviewAt: Date;
  riskLevel: "critical" | "high" | "standard";
  focus: "medication_safety" | "prioritization" | "delegation" | "deterioration" | "general";
  reasons: string[];
};

const DAY_MS = 86_400_000;
const PRIORITY_RE = /\b(priority|priorit\w*|first|unstable|stable|acute|chronic|abc|airway|breathing|circulation)\b/i;
const DELEGATION_RE = /\b(delegat\w*|assignment|scope|uap|lpn|rpn|pn)\b/i;
const DETERIORATION_RE = /\b(sepsis|shock|deterior\w*|unstable|hypoxia|respiratory distress|stroke|chest pain|rapid response|escalat\w*)\b/i;

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function daysSince(date: Date | null, now: Date): number {
  if (!date) return 999;
  return Math.max(0, (now.getTime() - date.getTime()) / DAY_MS);
}

function focusForTopic(topic: string): LongTermMasterySignal["focus"] {
  if (isPrescribingSafetyTopic(topic) || /\b(pharm|med|drug|insulin|heparin|warfarin|opioid|anticoag)\b/i.test(topic)) {
    return "medication_safety";
  }
  if (DELEGATION_RE.test(topic)) return "delegation";
  if (DETERIORATION_RE.test(topic)) return "deterioration";
  if (PRIORITY_RE.test(topic)) return "prioritization";
  return "general";
}

function masteryDecayWindowDays(signal: Pick<LongTermMasterySignal, "riskLevel" | "focus">): number {
  if (signal.riskLevel === "critical" || signal.focus === "medication_safety") return 7;
  if (signal.riskLevel === "high" || signal.focus === "deterioration" || signal.focus === "delegation") return 10;
  if (signal.focus === "prioritization") return 12;
  return 21;
}

export function computeLongTermMasterySignals(
  stats: readonly LongTermMasteryStat[],
  now: Date = new Date(),
): LongTermMasterySignal[] {
  return stats
    .map((stat) => {
      const topic = stat.topic.trim();
      const topicKey = normalizeTopicKey(topic);
      const attempts = Math.max(0, stat.correctCount + stat.wrongCount);
      const accuracy = attempts > 0 ? stat.correctCount / attempts : 0;
      const accuracyPct = Math.round(accuracy * 1000) / 10;
      const focus = focusForTopic(topic);
      const taxonomyRisk = topicDangerLevel(topic);
      const riskLevel =
        taxonomyRisk === "standard" && focus === "medication_safety"
          ? "critical"
          : taxonomyRisk === "standard" && (focus === "deterioration" || focus === "delegation")
            ? "high"
            : taxonomyRisk;
      const lastAttemptDays = daysSince(stat.lastAttemptAt, now);
      const lastWrongDays = daysSince(stat.lastWrongAt, now);
      const events = stat.remediationEvents ?? [];
      const recentUnsafeEvents = events.filter(
        (event) =>
          now.getTime() - event.createdAt.getTime() <= 30 * DAY_MS &&
          ["safety", "prioritization", "pharmacology", "delegation"].includes(event.mistakeType),
      ).length;
      const recentEvents = events.filter((event) => now.getTime() - event.createdAt.getTime() <= 30 * DAY_MS).length;

      const decayWindow = masteryDecayWindowDays({ riskLevel, focus });
      const maturedTopic = attempts >= 5 && accuracy >= 0.7;
      const conceptDecayRisk = clamp(
        (maturedTopic ? ((lastAttemptDays - decayWindow) / Math.max(4, decayWindow)) * 55 : 0) +
          (riskLevel === "critical" ? 18 : riskLevel === "high" ? 10 : 0) +
          (focus === "medication_safety" || focus === "deterioration" ? 10 : 0),
      );

      const unsafeRelapseRisk = clamp(
        (accuracy >= 0.72 && stat.wrongStreak > 0 ? 28 + stat.wrongStreak * 14 : 0) +
          (lastWrongDays <= 14 ? 16 : 0) +
          recentUnsafeEvents * 14,
      );

      const prioritizationConsistency = clamp(
        100 -
          (focus === "prioritization" || focus === "delegation" || focus === "deterioration" ? stat.wrongStreak * 18 : stat.wrongStreak * 10) -
          (1 - accuracy) * 45 -
          recentUnsafeEvents * 12,
      );

      const pharmacologyRetention =
        focus === "medication_safety"
          ? clamp(100 - conceptDecayRisk * 0.55 - stat.wrongStreak * 16 - recentUnsafeEvents * 12)
          : null;

      const reasoningDurability = clamp(
        accuracy * 100 -
          conceptDecayRisk * 0.4 -
          unsafeRelapseRisk * 0.5 -
          stat.wrongStreak * 8 -
          Math.min(18, recentEvents * 4),
      );

      const priorityScore = clamp(
        100 - reasoningDurability +
          conceptDecayRisk * 0.65 +
          unsafeRelapseRisk * 0.8 +
          (riskLevel === "critical" ? 20 : riskLevel === "high" ? 12 : 0) +
          (focus === "medication_safety" || focus === "deterioration" || focus === "delegation" ? 12 : 0),
      );

      const reviewSoonerDays =
        priorityScore >= 85 ? 0 : priorityScore >= 70 ? 1 : priorityScore >= 55 ? 3 : priorityScore >= 40 ? 7 : 14;
      const recommendedReviewAt = new Date(now.getTime() + reviewSoonerDays * DAY_MS);
      const reasons: string[] = [];
      if (conceptDecayRisk >= 45) reasons.push("mastery may decay before the next exam-style exposure");
      if (unsafeRelapseRisk >= 35) reasons.push("recent answers suggest relapse into unsafe reasoning");
      if (prioritizationConsistency < 70) reasons.push("prioritization consistency is not stable yet");
      if (pharmacologyRetention !== null && pharmacologyRetention < 75) reasons.push("medication-safety retention needs reinforcement");
      if (riskLevel !== "standard") reasons.push(`${riskLevel} safety topic`);
      if (reasons.length === 0) reasons.push("retention check recommended for long-term durability");

      return {
        topic,
        topicKey,
        attempts,
        accuracyPct,
        reasoningDurability: Math.round(reasoningDurability),
        conceptDecayRisk: Math.round(conceptDecayRisk),
        prioritizationConsistency: Math.round(prioritizationConsistency),
        pharmacologyRetention: pharmacologyRetention == null ? null : Math.round(pharmacologyRetention),
        unsafeRelapseRisk: Math.round(unsafeRelapseRisk),
        priorityScore: Math.round(priorityScore),
        recommendedReviewAt,
        riskLevel,
        focus,
        reasons,
      };
    })
    .filter((signal) => signal.attempts >= 3 && signal.priorityScore >= 35)
    .sort((a, b) => b.priorityScore - a.priorityScore || a.topic.localeCompare(b.topic));
}
