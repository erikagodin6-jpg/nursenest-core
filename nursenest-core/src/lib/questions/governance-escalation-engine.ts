export type GovernanceEscalationSignal = {
  questionId?: string | null;
  clinicalQualityScore?: number | null;
  psychometricScore?: number | null;
  evidenceScore?: number | null;
  contradictionScore?: number | null;
  clinicalRiskFlags?: number | null;
  staleGuideline?: boolean | null;
  negativeDiscrimination?: boolean | null;
  publishEligible?: boolean | null;
};

export type GovernanceEscalationLevel =
  | "monitor"
  | "review"
  | "priority-review"
  | "critical-remediation"
  | "retire";

export type GovernanceEscalationResult = {
  escalationLevel: GovernanceEscalationLevel;
  escalationScore: number;
  remediationRequired: boolean;
  autoRetireRecommended: boolean;
  reasons: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function evaluateGovernanceEscalation(
  input: GovernanceEscalationSignal,
): GovernanceEscalationResult {
  let score = 0;
  const reasons: string[] = [];

  if ((input.clinicalQualityScore ?? 100) < 70) {
    score += 18;
    reasons.push("Clinical quality score below release threshold.");
  }

  if ((input.psychometricScore ?? 100) < 65) {
    score += 16;
    reasons.push("Psychometric quality degradation detected.");
  }

  if ((input.evidenceScore ?? 100) < 70) {
    score += 14;
    reasons.push("Evidence governance confidence is low.");
  }

  if ((input.contradictionScore ?? 100) < 75) {
    score += 24;
    reasons.push("Clinical contradiction risk detected.");
  }

  if ((input.clinicalRiskFlags ?? 0) >= 2) {
    score += 20;
    reasons.push("Multiple clinical risk flags detected.");
  }

  if (input.staleGuideline) {
    score += 14;
    reasons.push("Guideline freshness review required.");
  }

  if (input.negativeDiscrimination) {
    score += 18;
    reasons.push("Negative discrimination detected from learner telemetry.");
  }

  if (input.publishEligible === false) {
    score += 22;
    reasons.push("Item is not publish eligible.");
  }

  score = clamp(Math.round(score), 0, 100);

  let escalationLevel: GovernanceEscalationLevel = "monitor";

  if (score >= 75) {
    escalationLevel = "retire";
  } else if (score >= 55) {
    escalationLevel = "critical-remediation";
  } else if (score >= 35) {
    escalationLevel = "priority-review";
  } else if (score >= 15) {
    escalationLevel = "review";
  }

  return {
    escalationLevel,
    escalationScore: score,
    remediationRequired: score >= 15,
    autoRetireRecommended: escalationLevel === "retire",
    reasons,
  };
}
