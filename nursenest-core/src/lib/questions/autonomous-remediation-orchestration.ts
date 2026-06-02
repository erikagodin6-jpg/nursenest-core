export type RemediationQueue =
  | "clinical-review"
  | "psychometric-review"
  | "evidence-refresh"
  | "contradiction-resolution"
  | "editorial-review"
  | "retirement-candidate";

export type AutonomousRemediationInput = {
  questionId?: string | null;
  escalationLevel:
    | "monitor"
    | "review"
    | "priority-review"
    | "critical-remediation"
    | "retire";
  clinicalQualityScore?: number | null;
  psychometricScore?: number | null;
  evidenceScore?: number | null;
  contradictionScore?: number | null;
  staleGuideline?: boolean | null;
  negativeDiscrimination?: boolean | null;
  publishEligible?: boolean | null;
};

export type AutonomousRemediationResult = {
  queues: RemediationQueue[];
  priority: "low" | "moderate" | "high" | "critical";
  autoSuppressed: boolean;
  slaHours: number;
  recommendations: string[];
};

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function orchestrateAutonomousRemediation(
  input: AutonomousRemediationInput,
): AutonomousRemediationResult {
  const queues: RemediationQueue[] = [];
  const recommendations: string[] = [];

  if ((input.clinicalQualityScore ?? 100) < 75) {
    queues.push("clinical-review");
    recommendations.push("Assign clinician remediation review.");
  }

  if ((input.psychometricScore ?? 100) < 70 || input.negativeDiscrimination) {
    queues.push("psychometric-review");
    recommendations.push("Assign psychometric recalibration review.");
  }

  if ((input.evidenceScore ?? 100) < 75 || input.staleGuideline) {
    queues.push("evidence-refresh");
    recommendations.push("Refresh guideline evidence and source provenance.");
  }

  if ((input.contradictionScore ?? 100) < 80) {
    queues.push("contradiction-resolution");
    recommendations.push("Resolve rationale/answer contradiction risk.");
  }

  if (input.publishEligible === false) {
    queues.push("editorial-review");
    recommendations.push("Block publication pending governance resolution.");
  }

  if (input.escalationLevel === "retire") {
    queues.push("retirement-candidate");
    recommendations.push("Remove item from active adaptive rotation.");
  }

  const dedupedQueues = unique(queues);

  let priority: AutonomousRemediationResult["priority"] = "low";
  let slaHours = 168;

  if (input.escalationLevel === "review") {
    priority = "moderate";
    slaHours = 72;
  }

  if (input.escalationLevel === "priority-review") {
    priority = "high";
    slaHours = 24;
  }

  if (
    input.escalationLevel === "critical-remediation" ||
    input.escalationLevel === "retire"
  ) {
    priority = "critical";
    slaHours = 4;
  }

  return {
    queues: dedupedQueues,
    priority,
    autoSuppressed:
      input.escalationLevel === "critical-remediation" ||
      input.escalationLevel === "retire",
    slaHours,
    recommendations,
  };
}
