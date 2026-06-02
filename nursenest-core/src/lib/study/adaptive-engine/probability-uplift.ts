/**
 * Probability Uplift Analysis
 *
 * Ranks weak topics by their estimated impact on readiness if the learner
 * improves accuracy in that area to the target threshold (70%).
 *
 * This gives learners a clear, prioritised answer to:
 *   "What should I study to improve my readiness score the most?"
 *
 * Model rationale:
 *   - Each wrong-streak topic applies "drag" on the blended readiness score.
 *   - Drag magnitude depends on: wrongStreak severity, miss rate, attempt count.
 *   - Estimated readiness gain = projected drag lift if accuracy reaches 70%.
 *   - Effort classification based on wrongStreak + total attempts.
 *
 * Pure function — no DB access. Deterministic and testable.
 */

import type { UserTopicStat } from "@prisma/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UpliftEffort = "quick" | "medium" | "intensive";

export type UpliftOpportunity = {
  /** Display topic name. */
  topic: string;
  /** Current accuracy percentage (0–100). */
  currentAccuracyPct: number;
  /** Target accuracy threshold (always 70 in this model). */
  targetAccuracyPct: number;
  /** Estimated readiness score gain (integer points, 1–10). */
  estimatedReadinessGain: number;
  /** Effort level based on how entrenched the weakness is. */
  effort: UpliftEffort;
  /** Study action that would have the highest impact for this topic. */
  recommendedAction: "drill_questions" | "review_lesson" | "do_both";
  /** Href for the recommended action. */
  href: string;
};

export type ProbabilityUpliftResult = {
  /** Ranked from highest to lowest estimated gain. */
  opportunities: UpliftOpportunity[];
  /** Sum of all potential gains (what could be achieved if all gaps are closed). */
  totalPotentialGain: number;
  /** The single action that would have the highest individual impact. */
  topRecommendation: UpliftOpportunity | null;
};

// ── Internal helpers ──────────────────────────────────────────────────────────

const TARGET_ACCURACY = 70;
const MAX_DRAG_PER_TOPIC = 10;

/**
 * Drag score: how much this topic is currently limiting readiness.
 * Returns 0–10, higher = more limiting.
 */
function computeDrag(stat: UserTopicStat): number {
  const total = stat.correctCount + stat.wrongCount;
  if (total < 2) return 0; // too little data to assert a gap

  const accuracyPct = (stat.correctCount / total) * 100;
  if (accuracyPct >= TARGET_ACCURACY) return 0; // not a weakness

  // Base drag from accuracy deficit
  const accuracyDeficit = Math.min(TARGET_ACCURACY - accuracyPct, 40);
  const accuracyDrag = (accuracyDeficit / 40) * 5; // 0–5 pts

  // Streak amplifier: repeated wrong answers signal deeper gap
  const streakMultiplier = Math.min(1 + stat.wrongStreak * 0.4, 2.5);

  // Evidence weight: more attempts = more reliable signal
  const evidenceWeight = Math.min(total / 10, 1.2);

  const drag = accuracyDrag * streakMultiplier * evidenceWeight;
  return Math.min(MAX_DRAG_PER_TOPIC, Math.round(drag * 10) / 10);
}

/** Estimated readiness gain if this topic is brought to 70% accuracy. */
function estimatedGain(drag: number, total: number): number {
  if (drag < 0.5) return 0;
  // Gain is the drag that would be removed, scaled for realism
  const raw = drag * 0.85; // conservative: reaching target still leaves some residual
  // Small sample → smaller claimed gain
  const samplePenalty = total < 5 ? 0.7 : 1;
  return Math.max(1, Math.min(MAX_DRAG_PER_TOPIC, Math.round(raw * samplePenalty)));
}

function classifyEffort(stat: UserTopicStat): UpliftEffort {
  const total = stat.correctCount + stat.wrongCount;
  if (stat.wrongStreak >= 4 || total > 20) return "intensive";
  if (stat.wrongStreak >= 2 || total > 8) return "medium";
  return "quick";
}

function recommendedAction(stat: UserTopicStat): UpliftOpportunity["recommendedAction"] {
  const total = stat.correctCount + stat.wrongCount;
  if (stat.wrongStreak >= 3 || total < 5) return "do_both";
  if (stat.wrongStreak >= 1) return "drill_questions";
  return "review_lesson";
}

function buildHref(stat: UserTopicStat): string {
  const action = recommendedAction(stat);
  const encoded = encodeURIComponent(stat.topic);
  if (action === "review_lesson") {
    return `/app/lessons?topic=${encoded}`;
  }
  return `/app/questions?preset=topic_drill&topic=${encoded}`;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function computeProbabilityUplift(args: {
  topicStats: UserTopicStat[];
  /** Limit returned opportunities (default 8). */
  limit?: number;
}): ProbabilityUpliftResult {
  const limit = args.limit ?? 8;

  const opportunities: UpliftOpportunity[] = [];
  for (const stat of args.topicStats) {
    const total = stat.correctCount + stat.wrongCount;
    if (total < 2) continue; // skip very sparse topics

    const drag = computeDrag(stat);
    if (drag < 0.5) continue; // no meaningful gap

    const accuracyPct = total > 0 ? Math.round((stat.correctCount / total) * 100) : 0;
    const gain = estimatedGain(drag, total);
    if (gain < 1) continue;

    opportunities.push({
      topic: stat.topic,
      currentAccuracyPct: accuracyPct,
      targetAccuracyPct: TARGET_ACCURACY,
      estimatedReadinessGain: gain,
      effort: classifyEffort(stat),
      recommendedAction: recommendedAction(stat),
      href: buildHref(stat),
    });
  }

  // Sort: highest gain first; tie-break by effort (quick before intensive)
  const effortOrder: Record<UpliftEffort, number> = { quick: 0, medium: 1, intensive: 2 };
  opportunities.sort((a, b) => {
    if (b.estimatedReadinessGain !== a.estimatedReadinessGain) {
      return b.estimatedReadinessGain - a.estimatedReadinessGain;
    }
    return effortOrder[a.effort] - effortOrder[b.effort];
  });

  const limited = opportunities.slice(0, limit);
  const totalPotentialGain = Math.min(
    30,
    limited.reduce((sum, o) => sum + o.estimatedReadinessGain, 0),
  );

  return {
    opportunities: limited,
    totalPotentialGain,
    topRecommendation: limited[0] ?? null,
  };
}
