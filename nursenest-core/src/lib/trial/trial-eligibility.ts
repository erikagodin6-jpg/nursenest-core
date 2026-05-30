import { emailDomain, isDisposableEmailDomain } from "@/lib/trial/trial-email-controls";

export type TrialRiskLevel = "low" | "medium" | "high";

export type TrialEligibilitySignals = {
  email: string;
  emailVerified: boolean;
  deviceAlreadyTrialed: boolean;
  trialAlreadyUsed: boolean;
  hasSubscriptionHistory: boolean;
  stripeEmailHasSubscriptionHistory: boolean;
  accountCreationCountForIp: number;
  noPaymentHistory: boolean;
};

export type TrialEligibilityDecision = {
  eligible: boolean;
  riskLevel: TrialRiskLevel;
  score: number;
  code: string;
  reasons: string[];
  userMessage: string;
};

function riskLevel(score: number): TrialRiskLevel {
  if (score >= 70) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function push(reasons: string[], reason: string, score: { value: number }, points: number) {
  reasons.push(reason);
  score.value += points;
}

export function assessTrialEligibility(signals: TrialEligibilitySignals): TrialEligibilityDecision {
  const reasons: string[] = [];
  const score = { value: 0 };
  const domain = emailDomain(signals.email);

  if (!signals.emailVerified) push(reasons, "email_not_verified", score, 45);
  if (isDisposableEmailDomain(domain)) push(reasons, "disposable_email_domain", score, 85);
  if (signals.deviceAlreadyTrialed) push(reasons, "device_already_trialed", score, 85);
  if (signals.trialAlreadyUsed) push(reasons, "trial_already_used", score, 100);
  if (signals.hasSubscriptionHistory) push(reasons, "has_subscription_history", score, 75);
  if (signals.stripeEmailHasSubscriptionHistory) push(reasons, "stripe_email_subscription_history", score, 75);
  if (signals.accountCreationCountForIp >= 8) push(reasons, "ip_account_cluster_high", score, 35);
  else if (signals.accountCreationCountForIp >= 4) push(reasons, "ip_account_cluster_medium", score, 30);
  if (signals.noPaymentHistory) push(reasons, "no_payment_history", score, 8);

  const level = riskLevel(score.value);

  if (!signals.emailVerified) {
    return {
      eligible: false,
      riskLevel: level,
      score: score.value,
      code: "email_not_verified",
      reasons,
      userMessage: "Verify your email before starting a free trial. Check your inbox for a verification link.",
    };
  }

  if (reasons.includes("disposable_email_domain")) {
    return {
      eligible: false,
      riskLevel: "high",
      score: score.value,
      code: "disposable_email_domain",
      reasons,
      userMessage: "Use a permanent email address to start a free trial.",
    };
  }

  for (const code of ["device_already_trialed", "trial_already_used", "has_subscription_history", "stripe_email_subscription_history"]) {
    if (reasons.includes(code)) {
      return {
        eligible: false,
        riskLevel: "high",
        score: score.value,
        code,
        reasons,
        userMessage:
          code === "device_already_trialed"
            ? "This device already used a free trial. You can still subscribe below."
            : code === "trial_already_used"
              ? "You already used your free trial."
              : "Trial is for new members only. Use checkout to subscribe.",
      };
    }
  }

  if (level === "high") {
    return {
      eligible: false,
      riskLevel: level,
      score: score.value,
      code: "trial_review_required",
      reasons,
      userMessage: "We could not activate a free trial automatically. You can still subscribe or contact support.",
    };
  }

  return {
    eligible: true,
    riskLevel: level,
    score: score.value,
    code: "eligible",
    reasons,
    userMessage: "",
  };
}
