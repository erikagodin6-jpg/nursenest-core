export type ChurnRiskStatus = "Healthy" | "Watch" | "At Risk" | "High Risk" | "Critical";

export type ChurnSignalSeverity = "low" | "medium" | "high" | "critical";

export type RetentionFeature =
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical_skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft";

export type RetentionWindowMetrics = {
  logins: number;
  studyDays: number;
  sessions: number;
  sessionMinutes: number;
  questionsAnswered: number;
  flashcardsReviewed: number;
  lessonsCompleted: number;
  catExamsTaken: number;
  loftSimulationsCompleted: number;
  clinicalSkillsActivity: number;
  pharmacologyActivity: number;
  ecgActivity: number;
};

export type ChurnSubscriptionSignals = {
  status?: string | null;
  renewalDate?: string | null;
  cancelAtPeriodEnd?: boolean;
  failedPaymentCount?: number;
  cancellationAttemptedAt?: string | null;
  billingPortalVisits30d?: number;
  downgradeScheduled?: boolean;
};

export type ChurnLearnerInput = {
  userId: string;
  pathway: string;
  tier?: string | null;
  createdAt?: string | null;
  lastLoginAt?: string | null;
  lastActivityAt?: string | null;
  onboardingCompleted?: boolean;
  readinessAssessmentCompleted?: boolean;
  studyPlanProgressPct?: number | null;
  confidenceTrend?: "improving" | "stable" | "declining" | "unknown";
  frustrationEvents7d?: number;
  purchasedFeatures?: RetentionFeature[];
  launchedFeatures?: RetentionFeature[];
  current7d: RetentionWindowMetrics;
  previous7d?: RetentionWindowMetrics;
  current30d: RetentionWindowMetrics;
  previous30d?: RetentionWindowMetrics;
  current60d?: RetentionWindowMetrics;
  current90d?: RetentionWindowMetrics;
  subscription?: ChurnSubscriptionSignals;
};

export type ChurnRiskSignal = {
  code: string;
  label: string;
  severity: ChurnSignalSeverity;
  detail: string;
  points: number;
};

export type RetentionIntervention =
  | "study_reminder"
  | "progress_report"
  | "weak_topic_recommendation"
  | "resume_where_left_off"
  | "study_streak_recovery"
  | "personalized_study_plan"
  | "billing_recovery"
  | "support_check_in";

export type ChurnRiskProfile = {
  userId: string;
  pathway: string;
  tier: string | null;
  retentionRiskScore: number;
  status: ChurnRiskStatus;
  engagementScore: number;
  learningConsistencyScore: number;
  studyMomentumScore: number;
  featureAdoptionScore: number;
  contentConsumptionScore: number;
  progressCompletionScore: number;
  daysSinceLastLogin: number | null;
  daysSinceLastActivity: number | null;
  signals: ChurnRiskSignal[];
  interventions: RetentionIntervention[];
  winBackActions: string[];
  likelyToCancel: boolean;
};

export type FeatureRetentionContribution = {
  feature: RetentionFeature;
  activeLearners: number;
  retainedLearners: number;
  retentionContributionScore: number;
};

export type ChurnPredictionReport = {
  generatedAt: string;
  totalLearners: number;
  retentionRate: number | null;
  churnRate: number | null;
  renewalRate: number | null;
  averageEngagementScore: number;
  atRiskLearners: number;
  highRiskLearners: number;
  criticalLearners: number;
  profiles: ChurnRiskProfile[];
  riskByPathway: Record<string, { learners: number; averageRiskScore: number; highOrCritical: number }>;
  featureRetentionScores: FeatureRetentionContribution[];
  predictiveSummary: {
    likelyToCancelUserIds: string[];
    pathwaysWithMostRisk: string[];
    recommendedInterventions: Array<{ intervention: RetentionIntervention; learnerCount: number }>;
  };
};

const EMPTY_WINDOW: RetentionWindowMetrics = {
  logins: 0,
  studyDays: 0,
  sessions: 0,
  sessionMinutes: 0,
  questionsAnswered: 0,
  flashcardsReviewed: 0,
  lessonsCompleted: 0,
  catExamsTaken: 0,
  loftSimulationsCompleted: 0,
  clinicalSkillsActivity: 0,
  pharmacologyActivity: 0,
  ecgActivity: 0,
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function daysSince(date: string | null | undefined, now: Date): number | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 86400000));
}

function daysUntil(date: string | null | undefined, now: Date): number | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return Math.ceil((parsed.getTime() - now.getTime()) / 86400000);
}

function activityTotal(window: RetentionWindowMetrics): number {
  return (
    window.questionsAnswered +
    window.flashcardsReviewed +
    window.lessonsCompleted * 8 +
    window.catExamsTaken * 25 +
    window.loftSimulationsCompleted * 25 +
    window.clinicalSkillsActivity * 5 +
    window.pharmacologyActivity * 5 +
    window.ecgActivity * 5
  );
}

function declinePct(current: number, previous: number): number {
  if (previous <= 0) return current <= 0 ? 0 : -100;
  return Math.round(((previous - current) / previous) * 1000) / 10;
}

function scoreLearningConsistency(current30d: RetentionWindowMetrics): number {
  return clamp((current30d.studyDays / 20) * 100);
}

function scoreStudyMomentum(current7d: RetentionWindowMetrics, previous7d?: RetentionWindowMetrics): number {
  const previous = previous7d ?? EMPTY_WINDOW;
  const currentActivity = activityTotal(current7d);
  const previousActivity = activityTotal(previous);
  const base = clamp((current7d.sessions / 7) * 55 + (current7d.sessionMinutes / 210) * 45);
  const decline = declinePct(currentActivity, previousActivity);
  return clamp(base - Math.max(0, decline) * 0.45);
}

function scoreFeatureAdoption(input: ChurnLearnerInput): number {
  const purchased = new Set(input.purchasedFeatures ?? []);
  const launched = new Set(input.launchedFeatures ?? []);
  if (purchased.size === 0) return 75;
  let used = 0;
  for (const feature of purchased) if (launched.has(feature)) used += 1;
  return clamp((used / purchased.size) * 100);
}

function scoreContentConsumption(current30d: RetentionWindowMetrics): number {
  return clamp(
    (current30d.questionsAnswered / 120) * 28 +
      (current30d.flashcardsReviewed / 220) * 24 +
      (current30d.lessonsCompleted / 10) * 18 +
      (current30d.catExamsTaken / 2) * 12 +
      (current30d.clinicalSkillsActivity / 8) * 8 +
      (current30d.pharmacologyActivity / 8) * 5 +
      (current30d.ecgActivity / 8) * 5,
  );
}

function scoreProgressCompletion(input: ChurnLearnerInput): number {
  let score = 70;
  if (input.onboardingCompleted === false) score -= 28;
  if (input.readinessAssessmentCompleted === false) score -= 16;
  if (input.studyPlanProgressPct != null) score = Math.round((score + clamp(input.studyPlanProgressPct)) / 2);
  return clamp(score);
}

export function calculateEngagementScore(input: ChurnLearnerInput): Pick<
  ChurnRiskProfile,
  "engagementScore" | "learningConsistencyScore" | "studyMomentumScore" | "featureAdoptionScore" | "contentConsumptionScore" | "progressCompletionScore"
> {
  const learningConsistencyScore = scoreLearningConsistency(input.current30d);
  const studyMomentumScore = scoreStudyMomentum(input.current7d, input.previous7d);
  const featureAdoptionScore = scoreFeatureAdoption(input);
  const contentConsumptionScore = scoreContentConsumption(input.current30d);
  const progressCompletionScore = scoreProgressCompletion(input);
  const engagementScore = clamp(
    learningConsistencyScore * 0.22 +
      studyMomentumScore * 0.24 +
      featureAdoptionScore * 0.18 +
      contentConsumptionScore * 0.2 +
      progressCompletionScore * 0.16,
  );

  return {
    engagementScore,
    learningConsistencyScore,
    studyMomentumScore,
    featureAdoptionScore,
    contentConsumptionScore,
    progressCompletionScore,
  };
}

function addSignal(signals: ChurnRiskSignal[], signal: ChurnRiskSignal): void {
  signals.push(signal);
}

function statusFromRisk(score: number): ChurnRiskStatus {
  if (score >= 85) return "Critical";
  if (score >= 70) return "High Risk";
  if (score >= 50) return "At Risk";
  if (score >= 30) return "Watch";
  return "Healthy";
}

function buildInterventions(signals: ChurnRiskSignal[], input: ChurnLearnerInput): RetentionIntervention[] {
  const interventions = new Set<RetentionIntervention>();
  if (signals.some((s) => s.code.includes("inactive") || s.code === "never_active")) {
    interventions.add("study_reminder");
    interventions.add("resume_where_left_off");
    interventions.add("study_streak_recovery");
  }
  if (signals.some((s) => s.code.includes("decline") || s.code === "low_confidence_trend")) {
    interventions.add("progress_report");
    interventions.add("weak_topic_recommendation");
    interventions.add("personalized_study_plan");
  }
  if (signals.some((s) => s.code.includes("billing") || s.code.includes("payment") || s.code.includes("cancellation"))) {
    interventions.add("billing_recovery");
  }
  if (signals.some((s) => s.code === "high_friction")) interventions.add("support_check_in");
  if (input.studyPlanProgressPct != null && input.studyPlanProgressPct < 35) interventions.add("personalized_study_plan");
  return [...interventions];
}

function buildWinBackActions(input: ChurnLearnerInput): string[] {
  const actions = ["Resume Study Plan"];
  const launched = new Set(input.launchedFeatures ?? []);
  if (launched.has("lessons")) actions.push("Continue Last Lesson");
  if (launched.has("flashcards")) actions.push("Continue Last Flashcard Session");
  if (launched.has("cat")) actions.push("Resume CAT");
  if (launched.has("ecg")) actions.push("Resume ECG");
  if (actions.length === 1) actions.push("Start a 10-minute recommended session");
  return actions;
}

export function evaluateChurnRisk(input: ChurnLearnerInput, now = new Date()): ChurnRiskProfile {
  const daysSinceLastLogin = daysSince(input.lastLoginAt, now);
  const daysSinceLastActivity = daysSince(input.lastActivityAt, now);
  const renewalDays = daysUntil(input.subscription?.renewalDate, now);
  const signals: ChurnRiskSignal[] = [];

  if (daysSinceLastActivity === null) {
    addSignal(signals, {
      code: "never_active",
      label: "Never active",
      severity: "critical",
      detail: "No learning activity has been recorded.",
      points: 34,
    });
  } else if (daysSinceLastActivity >= 14) {
    addSignal(signals, {
      code: "inactive_14d",
      label: "14-day inactivity",
      severity: "critical",
      detail: `Last learning activity was ${daysSinceLastActivity} days ago.`,
      points: 32,
    });
  } else if (daysSinceLastActivity >= 7) {
    addSignal(signals, {
      code: "inactive_7d",
      label: "7-day inactivity",
      severity: "high",
      detail: `Last learning activity was ${daysSinceLastActivity} days ago.`,
      points: 22,
    });
  } else if (daysSinceLastActivity >= 5 && (input.previous30d?.studyDays ?? 0) >= 20) {
    addSignal(signals, {
      code: "habit_break_after_daily_study",
      label: "Habit break",
      severity: "high",
      detail: "Learner had strong recent consistency, then stopped for 5+ days.",
      points: 20,
    });
  }

  const activityDecline7d = declinePct(activityTotal(input.current7d), activityTotal(input.previous7d ?? EMPTY_WINDOW));
  const sessionDecline30d = declinePct(input.current30d.sessions, input.previous30d?.sessions ?? 0);
  if (activityDecline7d >= 60) {
    addSignal(signals, {
      code: "activity_decline_7d",
      label: "Weekly activity decline",
      severity: "high",
      detail: `Weighted study activity declined ${activityDecline7d}% from the prior 7-day window.`,
      points: 20,
    });
  }
  if (sessionDecline30d >= 50) {
    addSignal(signals, {
      code: "session_decline_30d",
      label: "Monthly session decline",
      severity: "medium",
      detail: `Study sessions declined ${sessionDecline30d}% from the prior 30-day window.`,
      points: 13,
    });
  }
  if ((input.previous30d?.catExamsTaken ?? 0) >= 3 && input.current30d.catExamsTaken === 0) {
    addSignal(signals, {
      code: "cat_abandonment",
      label: "CAT activity stopped",
      severity: "high",
      detail: "Learner previously used CAT exams but has no CAT attempts in the current 30-day window.",
      points: 18,
    });
  }
  if (input.onboardingCompleted === false) {
    addSignal(signals, {
      code: "incomplete_onboarding",
      label: "Incomplete onboarding",
      severity: "medium",
      detail: "Learner has not completed onboarding, which reduces personalization and early success.",
      points: 12,
    });
  }
  if (input.readinessAssessmentCompleted === false) {
    addSignal(signals, {
      code: "incomplete_readiness",
      label: "Incomplete readiness assessment",
      severity: "medium",
      detail: "Learner has not completed a readiness baseline.",
      points: 9,
    });
  }
  if (input.studyPlanProgressPct != null && input.studyPlanProgressPct < 25) {
    addSignal(signals, {
      code: "unfinished_study_plan",
      label: "Unfinished study plan",
      severity: "medium",
      detail: `Study plan progress is ${input.studyPlanProgressPct}%.`,
      points: 10,
    });
  }
  if (input.confidenceTrend === "declining") {
    addSignal(signals, {
      code: "low_confidence_trend",
      label: "Declining confidence",
      severity: "medium",
      detail: "Recent confidence trend is declining.",
      points: 10,
    });
  }
  if ((input.frustrationEvents7d ?? 0) >= 3) {
    addSignal(signals, {
      code: "high_friction",
      label: "Repeated frustration events",
      severity: "high",
      detail: `${input.frustrationEvents7d} frustration events recorded in the last 7 days.`,
      points: 18,
    });
  }

  const purchased = new Set(input.purchasedFeatures ?? []);
  const launched = new Set(input.launchedFeatures ?? []);
  for (const feature of purchased) {
    if (!launched.has(feature)) {
      addSignal(signals, {
        code: `purchased_${feature}_not_launched`,
        label: `${feature.replace(/_/g, " ")} not launched`,
        severity: feature === "ecg" || feature === "loft" ? "high" : "medium",
        detail: `Learner purchased access to ${feature.replace(/_/g, " ")} but has not launched it.`,
        points: feature === "ecg" || feature === "loft" ? 16 : 10,
      });
    }
  }

  if (input.subscription?.cancelAtPeriodEnd || input.subscription?.cancellationAttemptedAt) {
    addSignal(signals, {
      code: "cancellation_intent",
      label: "Cancellation intent",
      severity: "critical",
      detail: "Learner has cancelled or attempted cancellation.",
      points: 35,
    });
  }
  if ((input.subscription?.failedPaymentCount ?? 0) > 0 || String(input.subscription?.status ?? "").toLowerCase().includes("past_due")) {
    addSignal(signals, {
      code: "payment_risk",
      label: "Payment risk",
      severity: "high",
      detail: `${input.subscription?.failedPaymentCount ?? 1} failed payment signal(s) recorded.`,
      points: 20,
    });
  }
  if ((input.subscription?.billingPortalVisits30d ?? 0) >= 2) {
    addSignal(signals, {
      code: "billing_portal_repeat_visits",
      label: "Repeated billing portal visits",
      severity: "medium",
      detail: "Learner has visited billing repeatedly in the last 30 days.",
      points: 10,
    });
  }
  if (input.subscription?.downgradeScheduled) {
    addSignal(signals, {
      code: "downgrade_scheduled",
      label: "Downgrade scheduled",
      severity: "high",
      detail: "Learner has scheduled a downgrade.",
      points: 18,
    });
  }
  if (renewalDays !== null && renewalDays >= 0 && renewalDays <= 7 && input.current30d.studyDays <= 2) {
    addSignal(signals, {
      code: "renewal_without_engagement",
      label: "Renewal near with low engagement",
      severity: "high",
      detail: `Renewal is in ${renewalDays} day(s), but recent study activity is low.`,
      points: 19,
    });
  }

  const engagement = calculateEngagementScore(input);
  const signalPoints = signals.reduce((sum, signal) => sum + signal.points, 0);
  const retentionRiskScore = clamp(signalPoints + (100 - engagement.engagementScore) * 0.35);
  const status = statusFromRisk(retentionRiskScore);

  return {
    userId: input.userId,
    pathway: input.pathway,
    tier: input.tier ?? null,
    retentionRiskScore,
    status,
    ...engagement,
    daysSinceLastLogin,
    daysSinceLastActivity,
    signals,
    interventions: buildInterventions(signals, input),
    winBackActions: buildWinBackActions(input),
    likelyToCancel: retentionRiskScore >= 70 || signals.some((signal) => signal.code === "cancellation_intent"),
  };
}

function average(values: number[]): number {
  return values.length > 0 ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0;
}

export function calculateFeatureRetentionContribution(inputs: ChurnLearnerInput[]): FeatureRetentionContribution[] {
  const features: RetentionFeature[] = ["questions", "flashcards", "lessons", "clinical_skills", "pharmacology", "ecg", "cat", "loft"];
  return features.map((feature) => {
    const active = inputs.filter((input) => input.launchedFeatures?.includes(feature));
    const retained = active.filter((input) => evaluateChurnRisk(input).retentionRiskScore < 50);
    return {
      feature,
      activeLearners: active.length,
      retainedLearners: retained.length,
      retentionContributionScore: active.length > 0 ? clamp((retained.length / active.length) * 100) : 0,
    };
  });
}

export function buildChurnPredictionReport(
  inputs: ChurnLearnerInput[],
  generatedAt = new Date().toISOString(),
): ChurnPredictionReport {
  const now = new Date(generatedAt);
  const profiles = inputs.map((input) => evaluateChurnRisk(input, now)).sort((a, b) => b.retentionRiskScore - a.retentionRiskScore);
  const retained = profiles.filter((profile) => profile.retentionRiskScore < 50).length;
  const renewed = inputs.filter((input) => String(input.subscription?.status ?? "").toLowerCase().includes("active") && !input.subscription?.cancelAtPeriodEnd).length;
  const riskByPathway: ChurnPredictionReport["riskByPathway"] = {};
  for (const profile of profiles) {
    const row = (riskByPathway[profile.pathway] ??= { learners: 0, averageRiskScore: 0, highOrCritical: 0 });
    row.learners += 1;
    if (profile.status === "High Risk" || profile.status === "Critical") row.highOrCritical += 1;
  }
  for (const pathway of Object.keys(riskByPathway)) {
    riskByPathway[pathway].averageRiskScore = average(profiles.filter((profile) => profile.pathway === pathway).map((profile) => profile.retentionRiskScore));
  }
  const interventionCounts = new Map<RetentionIntervention, number>();
  for (const profile of profiles) {
    for (const intervention of profile.interventions) {
      interventionCounts.set(intervention, (interventionCounts.get(intervention) ?? 0) + 1);
    }
  }

  return {
    generatedAt,
    totalLearners: profiles.length,
    retentionRate: profiles.length > 0 ? clamp((retained / profiles.length) * 100) : null,
    churnRate: profiles.length > 0 ? clamp(((profiles.length - retained) / profiles.length) * 100) : null,
    renewalRate: profiles.length > 0 ? clamp((renewed / profiles.length) * 100) : null,
    averageEngagementScore: average(profiles.map((profile) => profile.engagementScore)),
    atRiskLearners: profiles.filter((profile) => profile.status === "At Risk").length,
    highRiskLearners: profiles.filter((profile) => profile.status === "High Risk").length,
    criticalLearners: profiles.filter((profile) => profile.status === "Critical").length,
    profiles,
    riskByPathway,
    featureRetentionScores: calculateFeatureRetentionContribution(inputs).sort((a, b) => b.retentionContributionScore - a.retentionContributionScore),
    predictiveSummary: {
      likelyToCancelUserIds: profiles.filter((profile) => profile.likelyToCancel).map((profile) => profile.userId),
      pathwaysWithMostRisk: Object.entries(riskByPathway)
        .sort((a, b) => b[1].averageRiskScore - a[1].averageRiskScore)
        .map(([pathway]) => pathway)
        .slice(0, 5),
      recommendedInterventions: [...interventionCounts.entries()]
        .map(([intervention, learnerCount]) => ({ intervention, learnerCount }))
        .sort((a, b) => b.learnerCount - a.learnerCount),
    },
  };
}

