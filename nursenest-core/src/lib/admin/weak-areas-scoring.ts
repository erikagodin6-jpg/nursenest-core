/**
 * Weak-area scoring — transparent, configurable weights.
 *
 * ## Model (high level)
 *
 * Each entity (lesson, page, learner section, topic, conversion URL) is scored on **0–100**
 * where **higher = weaker / more urgent to review**. Scores are **not** probabilities; they are
 * weighted sums of **normalized pain signals** (0–1 each), clamped.
 *
 * ### Normalization
 * - Rates (completion, revisit) are already 0–1.
 * - **Feedback density** = frictionReports / max(8, sqrt(touchingLearnersOrViews)) so busy surfaces
 *   need more reports before maxing out (avoids punishing high-traffic noise).
 * - **Accuracy pain** = clamp(0, 1, (0.55 - accuracy) / 0.35) so topics at 55%+ accuracy contribute little.
 *
 * ### Classification (separate from score)
 * - **underperforming**: meaningful volume **and** at least one strong pain signal (e.g. low completion
 *   with enough learners, or heavy friction density).
 * - **low_exposure**: volume below floor — could be new/unseen; **do not** treat as “users avoid” yet.
 * - **active_decline**: volume or engagement **dropped materially** vs prior window while pain stayed
 *   or rose — different from a niche feature with stable low traffic.
 * - **mixed**: borderline / multiple weak but sub-threshold signals.
 *
 * Weights are exported so ops can tune in code or later via admin config.
 */

export type WeakAreaClassification = "underperforming" | "low_exposure" | "active_decline" | "mixed";

export type WeakAreaTrend = "improving" | "worsening" | "flat" | "unknown";

/** Tunable weights — must stay in sync with `compute*` functions below. */
export const DEFAULT_WEAK_AREA_WEIGHTS = {
  lesson: {
    /** Penalize incomplete journeys (1 - completionRate). */
    lowCompletion: 0.38,
    /** Opened but never engaged (bounce proxy). */
    neverEngaged: 0.3,
    /** 1 - revisitRate among learners touching in-window. */
    lowRevisit: 0.16,
    /**
     * Friction reports tied to a specific lesson (needs stable `lessonId`/`slug` in feedback meta).
     * Kept at 0 until feedback rows reliably carry lesson keys — pathway-level friction appears in the
     * “Friction surfaces” list instead.
     */
    feedbackFriction: 0,
    /** Practice-test abandonment share in-window (cohort slice). */
    practiceAbandonment: 0.16,
  },
  page: {
    frictionDensity: 0.48,
    /** Relative drop in unique visitors vs prior window (capped). */
    trafficDecline: 0.32,
    /** Reserved for future “high traffic, no checkout” gaps (PostHog checkout events). */
    engagementGap: 0.2,
  },
  feature: {
    /** Decline in section views vs prior window. */
    usageDecline: 0.38,
    /** How far below cohort median (0–1). */
    belowMedian: 0.28,
    /** Tail rank in current window (0 = top, 1 = bottom). */
    tailRank: 0.22,
    /** Flat absolute low counts — dampens “avoidance” claims. */
    lowAbsoluteDampen: 0.12,
  },
  topic: {
    lowAccuracy: 0.55,
    highWrongStreak: 0.45,
  },
  conversionPage: {
    trafficDecline: 0.3,
    frictionDensity: 0.45,
    checkoutStartGap: 0.25,
  },
} as const;

export type WeakAreaWeights = typeof DEFAULT_WEAK_AREA_WEIGHTS;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Friction reports normalized by scale of audience (learners or PostHog UV). */
export function normalizeFrictionDensity(frictionReports: number, scale: number): number {
  const denom = Math.max(8, Math.sqrt(Math.max(1, scale)));
  return clamp01(frictionReports / denom);
}

export function accuracyPain(accuracy: number): number {
  return clamp01((0.55 - accuracy) / 0.35);
}

export function streakPain(frustratedLearners: number, topicLearners: number): number {
  if (topicLearners <= 0) return 0;
  return clamp01(frustratedLearners / Math.max(6, topicLearners * 0.35));
}

export function thinDataFactor(attempts: number, minAttempts = 24): number {
  return clamp01(attempts / minAttempts);
}

export type LessonWeakSignals = {
  completionRate: number;
  neverEngagedRate: number;
  revisitRate: number;
  frictionDensity: number;
  practiceAbandonRate: number;
  learners: number;
  /** Prior-window completion for trend */
  prevCompletionRate: number | null;
  prevNeverEngagedRate: number | null;
};

export function computeLessonWeakScore(s: LessonWeakSignals, w = DEFAULT_WEAK_AREA_WEIGHTS.lesson): number {
  const parts =
    w.lowCompletion * clamp01(1 - s.completionRate) +
    w.neverEngaged * clamp01(s.neverEngagedRate) +
    w.lowRevisit * clamp01(1 - s.revisitRate) +
    w.feedbackFriction * clamp01(s.frictionDensity) +
    w.practiceAbandonment * clamp01(s.practiceAbandonRate);
  return Math.round(Math.min(100, parts * 100) * 10) / 10;
}

export function lessonTrend(s: LessonWeakSignals): { trend: WeakAreaTrend; deltaCompletionPts: number | null } {
  if (s.prevCompletionRate == null || s.prevNeverEngagedRate == null) {
    return { trend: "unknown", deltaCompletionPts: null };
  }
  const delta = Math.round((s.completionRate - s.prevCompletionRate) * 1000) / 10;
  const bounceWorse = s.neverEngagedRate - (s.prevNeverEngagedRate ?? 0);
  if (delta <= -5 || bounceWorse >= 0.08) return { trend: "worsening", deltaCompletionPts: delta };
  if (delta >= 5 && bounceWorse <= -0.05) return { trend: "improving", deltaCompletionPts: delta };
  return { trend: "flat", deltaCompletionPts: delta };
}

export function classifyLesson(
  s: LessonWeakSignals,
  score: number,
): { classification: WeakAreaClassification; reasons: string[] } {
  const reasons: string[] = [];
  const vol = s.learners;
  const lowVolume = vol < 6 && s.completionRate < 0.5;
  const strongPain =
    s.neverEngagedRate >= 0.35 ||
    s.completionRate <= 0.38 ||
    s.frictionDensity >= 0.55 ||
    s.practiceAbandonRate >= 0.45;

  const { trend, deltaCompletionPts } = lessonTrend(s);
  if (trend === "worsening" && vol >= 8) {
    reasons.push(
      deltaCompletionPts != null
        ? `Completion slipped vs prior window (${deltaCompletionPts >= 0 ? "+" : ""}${deltaCompletionPts} pts).`
        : "Engagement quality worsened vs prior window.",
    );
  }

  if (lowVolume && !strongPain) {
    reasons.push("Low sample size — treat as discovery signal, not proof learners avoid this lesson.");
    return { classification: "low_exposure", reasons };
  }

  if (trend === "worsening" && vol >= 10 && score >= 42) {
    reasons.push("Material decline vs previous period while traffic exists — prioritize regression checks.");
    return { classification: "active_decline", reasons };
  }

  if (vol >= 8 && strongPain) {
    if (s.neverEngagedRate >= 0.3) reasons.push("Many learners never reach engaged state after opening.");
    if (s.completionRate <= 0.42) reasons.push("Completion rate is low relative to touched learners.");
    if (s.revisitRate < 0.18 && vol >= 12) reasons.push("Few returning learners relative to reach — weak stickiness.");
    if (s.frictionDensity >= 0.45) reasons.push("Feedback friction density is elevated for this lesson.");
    return { classification: "underperforming", reasons };
  }

  if (score >= 48) {
    reasons.push("Multiple moderate signals — review content flow and instrumentation.");
    return { classification: "mixed", reasons };
  }

  reasons.push("Below urgency thresholds for auto-classification.");
  return { classification: "mixed", reasons };
}

export type PageWeakSignals = {
  frictionDensity: number;
  visitorDropoff: number;
  /** 0–1 placeholder for future checkout linkage */
  engagementGap: number;
  uniqueVisitors: number;
  prevUniqueVisitors: number | null;
};

export function computePageWeakScore(s: PageWeakSignals, w = DEFAULT_WEAK_AREA_WEIGHTS.page): number {
  const parts =
    w.frictionDensity * clamp01(s.frictionDensity) +
    w.trafficDecline * clamp01(s.visitorDropoff) +
    w.engagementGap * clamp01(s.engagementGap);
  return Math.round(Math.min(100, parts * 100) * 10) / 10;
}

export function pageTrend(prev: number | null, cur: number): WeakAreaTrend {
  if (prev == null || prev < 5) return "unknown";
  const ch = (cur - prev) / prev;
  if (ch <= -0.18) return "worsening";
  if (ch >= 0.15) return "improving";
  return "flat";
}

export type FeatureWeakSignals = {
  views: number;
  prevViews: number | null;
  medianViews: number;
  /** 0–1 rank in cohort (higher = weaker / more tail) */
  tailRank: number;
};

export function computeFeatureWeakScore(s: FeatureWeakSignals, w = DEFAULT_WEAK_AREA_WEIGHTS.feature): number {
  const decline =
    s.prevViews != null && s.prevViews >= 12 ? clamp01((s.prevViews - s.views) / s.prevViews) : 0;
  const belowMed =
    s.medianViews > 0 ? clamp01((s.medianViews - Math.min(s.views, s.medianViews)) / s.medianViews) : 0;
  const lowAbs = s.views < 10 ? 0.35 : 0;
  const parts =
    w.usageDecline * decline + w.belowMedian * belowMed + w.tailRank * clamp01(s.tailRank) + w.lowAbsoluteDampen * lowAbs;
  return Math.round(Math.min(100, parts * 100) * 10) / 10;
}

export function classifyFeature(
  s: FeatureWeakSignals,
  score: number,
): { classification: WeakAreaClassification; reasons: string[] } {
  const reasons: string[] = [];
  const prev = s.prevViews ?? 0;
  if (s.views < 8 && prev < 8) {
    reasons.push("Very low authenticated views in both windows — likely new/low-exposure, not proven avoidance.");
    return { classification: "low_exposure", reasons };
  }
  if (prev >= 30 && s.views < prev * 0.55) {
    reasons.push("Section views dropped sharply vs prior window while other areas still receive traffic.");
    return { classification: "active_decline", reasons };
  }
  if (s.medianViews > 0 && s.views < s.medianViews * 0.2 && s.views >= 20) {
    reasons.push("Persistently far below median learner section traffic — discoverability or value issue.");
    return { classification: "underperforming", reasons };
  }
  if (score >= 45) {
    reasons.push("Tail usage or moderate decline — monitor and pair with qualitative feedback.");
    return { classification: "mixed", reasons };
  }
  reasons.push("Within normal variance for this cohort.");
  return { classification: "mixed", reasons };
}

export type TopicWeakSignals = {
  accuracy: number;
  streakPain: number;
  attempts: number;
};

export function computeTopicWeakScore(s: TopicWeakSignals, w = DEFAULT_WEAK_AREA_WEIGHTS.topic): number {
  const thin = thinDataFactor(s.attempts, 28);
  const core = w.lowAccuracy * accuracyPain(s.accuracy) + w.highWrongStreak * clamp01(s.streakPain);
  /** Pull score down when attempt volume is thin so we do not over-rank niche topics. */
  const blended = core * thin + (1 - thin) * 0.12;
  return Math.round(Math.min(100, blended * 100) * 10) / 10;
}

export type ConversionWeakSignals = {
  frictionDensity: number;
  visitorDropoff: number;
  /** checkout_started / unique visitors if available */
  checkoutGap: number;
};

export function computeConversionPageScore(
  s: ConversionWeakSignals,
  w = DEFAULT_WEAK_AREA_WEIGHTS.conversionPage,
): number {
  const parts =
    w.frictionDensity * clamp01(s.frictionDensity) +
    w.trafficDecline * clamp01(s.visitorDropoff) +
    w.checkoutStartGap * clamp01(s.checkoutGap);
  return Math.round(Math.min(100, parts * 100) * 10) / 10;
}

export function severityFromScore(score: number): "critical" | "high" | "medium" | "watch" {
  if (score >= 72) return "critical";
  if (score >= 56) return "high";
  if (score >= 40) return "medium";
  return "watch";
}
