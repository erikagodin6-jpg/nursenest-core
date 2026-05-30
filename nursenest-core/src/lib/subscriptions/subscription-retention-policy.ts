export type SubscriptionHealthStatus = "Engaged" | "At Risk" | "Inactive";

export type SubscriptionHealthInput = {
  activeDays30d: number;
  daysSinceLastActivity: number | null;
  readinessDeltaPct: number | null;
  featureAdoptionPct: number;
  failedPaymentCount: number;
  cancelAtPeriodEnd: boolean;
};

export type SubscriptionHealthProfile = {
  status: SubscriptionHealthStatus;
  score: number;
  reasons: string[];
  recommendedActions: string[];
};

export type RetentionProgressSnapshot = {
  questionsCompleted: number;
  flashcardsReviewed: number;
  lessonsCompleted: number;
  catExamsCompleted: number;
  readinessStartPct: number | null;
  readinessCurrentPct: number | null;
  studyStreakDays: number;
};

export const RENEWAL_REMINDER_OFFSETS_DAYS = [7, 3, 0] as const;

export const SUBSCRIPTION_TRANSPARENCY_FIELDS = [
  "Current Plan",
  "Renewal Date",
  "Billing Amount",
  "Next Charge Date",
  "Subscription Status",
  "Payment Method",
] as const;

export const SUBSCRIPTION_SUMMARY_SURFACES = [
  "Dashboard",
  "Account Settings",
  "Billing Page",
] as const;

export const FEATURE_DISCOVERY_CAMPAIGNS = [
  { key: "ecg", headline: "Try ECG Detective Mode", href: "/app/ecg" },
  { key: "labs", headline: "Explore Clinical Lab Workstation", href: "/app/labs" },
  { key: "medication_math", headline: "Start Medication Math Practice", href: "/app/med-calculations" },
  { key: "clinical_skills", headline: "Practice Clinical Skills", href: "/app/clinical-skills" },
  { key: "simulations", headline: "Run A Patient Simulation", href: "/app/simulations" },
  { key: "study_plans", headline: "Open Your Study Plan", href: "/app/study-plan" },
  { key: "analytics", headline: "Review Readiness Analytics", href: "/app/account/readiness" },
] as const;

export const UPGRADE_TRIGGER_SURFACES = [
  "Locked ECG",
  "Locked Labs",
  "Locked Simulations",
  "Locked CAT",
  "Locked Analytics",
] as const;

export const CHARGEBACK_EVIDENCE_FIELDS = [
  "Account Creation",
  "Email Verification",
  "Trial Redemption",
  "Subscription Activation",
  "Login History",
  "Usage History",
  "Feature Usage",
  "Activity Completion",
  "Invoice Delivery",
  "Terms Acceptance",
] as const;

export const REFUND_POLICY_SURFACES = [
  "Pricing",
  "Checkout",
  "Billing",
  "Receipts",
  "Account Settings",
] as const;

export const REVENUE_ANALYTICS_METRICS = [
  "Trial Conversion %",
  "Monthly Retention %",
  "Annual Retention %",
  "Upgrade Rate %",
  "Cancellation Rate %",
  "Chargeback Rate %",
  "Referral Conversion %",
  "Feature Adoption %",
] as const;

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function evaluateSubscriptionHealth(input: SubscriptionHealthInput): SubscriptionHealthProfile {
  const reasons: string[] = [];
  let score = 55;

  score += Math.min(input.activeDays30d, 20) * 2;
  score += Math.round(input.featureAdoptionPct * 0.18);
  if (input.readinessDeltaPct != null) score += Math.max(-18, Math.min(18, Math.round(input.readinessDeltaPct * 0.6)));

  if (input.daysSinceLastActivity == null) {
    score -= 32;
    reasons.push("No recorded learning activity.");
  } else if (input.daysSinceLastActivity >= 14) {
    score -= 34;
    reasons.push("No learning activity in 14+ days.");
  } else if (input.daysSinceLastActivity >= 7) {
    score -= 20;
    reasons.push("No learning activity in 7+ days.");
  }

  if (input.failedPaymentCount > 0) {
    score -= Math.min(24, input.failedPaymentCount * 12);
    reasons.push("Payment recovery is needed.");
  }
  if (input.cancelAtPeriodEnd) {
    score -= 30;
    reasons.push("Subscription is scheduled to cancel.");
  }
  if (input.featureAdoptionPct < 35) {
    score -= 12;
    reasons.push("Several paid features have not been explored.");
  }

  const normalized = clamp(score);
  const status: SubscriptionHealthStatus = normalized >= 70 ? "Engaged" : normalized >= 35 ? "At Risk" : "Inactive";
  const recommendedActions =
    status === "Engaged"
      ? ["Send progress digest", "Offer annual upgrade"]
      : status === "At Risk"
        ? ["Send study reminder", "Surface unused features", "Show progress value"]
        : ["Send win-back reminder", "Recommend a 10-minute restart session", "Offer support contact"];

  return {
    status,
    score: normalized,
    reasons,
    recommendedActions,
  };
}

export function buildAccomplishmentLines(snapshot: RetentionProgressSnapshot): string[] {
  const lines = [
    `${snapshot.questionsCompleted.toLocaleString()} Questions Completed`,
    `${snapshot.flashcardsReviewed.toLocaleString()} Flashcards Reviewed`,
    `${snapshot.lessonsCompleted.toLocaleString()} Lessons Completed`,
    `${snapshot.catExamsCompleted.toLocaleString()} CAT Exams Completed`,
  ];
  if (snapshot.readinessStartPct != null && snapshot.readinessCurrentPct != null) {
    lines.push(`Readiness Improved: ${snapshot.readinessStartPct}% -> ${snapshot.readinessCurrentPct}%`);
  }
  if (snapshot.studyStreakDays > 0) {
    lines.push(`${snapshot.studyStreakDays}-Day Study Streak`);
  }
  return lines;
}

export function buildRenewalReminderSchedule(renewalDate: Date): Array<{ offsetDays: number; sendAt: Date }> {
  return RENEWAL_REMINDER_OFFSETS_DAYS.map((offsetDays) => ({
    offsetDays,
    sendAt: new Date(renewalDate.getTime() - offsetDays * 24 * 60 * 60 * 1000),
  }));
}
