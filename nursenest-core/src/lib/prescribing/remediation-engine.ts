export interface RemediationSignal {
  topic: string;
  misses: number;
  stewardshipPenalty: number;
}

export interface PrescribingRemediationRecommendation {
  topic: string;
  priority: "low" | "moderate" | "high";
  recommendation: string;
  recommendedModules: string[];
}

export function buildPrescribingRemediationPlan(
  signals: RemediationSignal[]
): PrescribingRemediationRecommendation[] {
  return signals.map((signal) => {
    const severityScore = signal.misses + Math.abs(signal.stewardshipPenalty);

    const priority =
      severityScore >= 15
        ? "high"
        : severityScore >= 8
        ? "moderate"
        : "low";

    return {
      topic: signal.topic,
      priority,
      recommendation:
        priority === "high"
          ? "Immediate remediation recommended before progressing to advanced prescribing cases."
          : priority === "moderate"
          ? "Additional targeted practice recommended."
          : "Continue spaced reinforcement and review.",
      recommendedModules:
        signal.topic === "antibiotic-stewardship"
          ? [
              "gram-positive-vs-negative",
              "pseudomonas-coverage",
              "culture-sensitivity"
            ]
          : signal.topic === "organism-coverage"
          ? ["coverage-drills", "mrsa-coverage"]
          : ["renal-dosing", "prescription-writing"]
    };
  });
}
