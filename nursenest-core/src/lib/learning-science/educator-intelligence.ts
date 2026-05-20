import type { AuthorityConcept } from "@/lib/learning-science/authority-taxonomy";
import type { CognitiveFailureAnalysis } from "@/lib/learning-science/cognitive-failure-analysis";

export type CohortInsight = {
  conceptId: string;
  riskLevel: "low" | "moderate" | "high" | "critical";
  learnerCountAffected: number;
  dominantFailureMode: string;
  instructionalRisk: string;
  recommendedIntervention: string;
};

export type CurriculumGapAnalysis = {
  domain: string;
  issue: string;
  likelyCause: string;
  evidence: readonly string[];
  recommendation: readonly string[];
};

export function generateCohortInsights(input: {
  concept: AuthorityConcept;
  analyses: readonly CognitiveFailureAnalysis[];
  learnerCountAffected?: number;
}): CohortInsight {
  const learnerCountAffected = input.learnerCountAffected ?? analysesWeight(input.analyses);

  const highSeverityCount = input.analyses.filter(
    (analysis) => analysis.severity === "critical" || analysis.severity === "high",
  ).length;

  const riskLevel: CohortInsight["riskLevel"] =
    highSeverityCount >= 3 ? "critical" : highSeverityCount >= 2 ? "high" : highSeverityCount >= 1 ? "moderate" : "low";

  return {
    conceptId: input.concept.id,
    riskLevel,
    learnerCountAffected,
    dominantFailureMode:
      input.analyses[0]?.failureType.replaceAll("_", " ") ?? "No dominant failure mode detected",
    instructionalRisk:
      riskLevel === "critical"
        ? "Learners are likely carrying dangerous misconceptions into clinical reasoning."
        : "This concept is producing measurable cognitive instability.",
    recommendedIntervention:
      riskLevel === "critical"
        ? "Inject mandatory remediation and comparison drills before learners continue."
        : "Increase retrieval practice and discrimination training frequency.",
  };
}

export function buildCurriculumGapAnalysis(input: {
  domain: string;
  concepts: readonly AuthorityConcept[];
  analyses: readonly CognitiveFailureAnalysis[];
}): readonly CurriculumGapAnalysis[] {
  const issues: CurriculumGapAnalysis[] = [];

  const overconfidenceRate = input.analyses.filter(
    (analysis) => analysis.failureType === "overconfidence",
  ).length;

  if (overconfidenceRate > 0) {
    issues.push({
      domain: input.domain,
      issue: "Recognition without reasoning",
      likelyCause:
        "Learners are being exposed to patterns repeatedly but are not forced to explain ruling-out logic.",
      evidence: [
        `${overconfidenceRate} overconfidence analyses detected`,
        "Learners answer quickly but fail discrimination tasks",
      ],
      recommendation: [
        "Add comparison drills",
        "Delay answer reveal until justification is entered",
        "Increase transfer-based questioning",
      ],
    });
  }

  const transferFailures = input.analyses.filter(
    (analysis) => analysis.failureType === "poor_transfer",
  ).length;

  if (transferFailures > 0) {
    issues.push({
      domain: input.domain,
      issue: "Weak clinical transfer",
      likelyCause:
        "Learners are trained in isolated facts rather than changing bedside contexts.",
      evidence: [
        `${transferFailures} transfer-related analyses detected`,
        "Learners succeed in recall but fail simulations",
      ],
      recommendation: [
        "Increase branching case simulations",
        "Add instability escalation scenarios",
        "Use dynamic patient variables instead of static prompts",
      ],
    });
  }

  return issues;
}

function analysesWeight(analyses: readonly CognitiveFailureAnalysis[]): number {
  return analyses.reduce((score, analysis) => {
    const severityWeight = {
      low: 1,
      moderate: 3,
      high: 6,
      critical: 10,
    } as const;

    return score + severityWeight[analysis.severity];
  }, 0);
}
