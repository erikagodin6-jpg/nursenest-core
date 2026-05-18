import type {
  CasperResponseEvaluation,
  CasperSessionEvaluation,
} from "@/lib/casper/casper-feedback";

export type CasperAiEvaluationInput = {
  sessionId: string;
  learnerId: string;
  responses: Array<{
    scenarioId: string;
    response: string;
  }>;
};

export type CasperAiEvaluationProvider = {
  providerKey: string;
  evaluateSession(
    input: CasperAiEvaluationInput,
  ): Promise<CasperSessionEvaluation>;
};

export type CasperAiResponseRewrite = {
  originalResponse: string;
  improvedResponse: string;
  rationale: string[];
};

export async function buildPlaceholderCasperAiEvaluation(
  input: CasperAiEvaluationInput,
): Promise<CasperSessionEvaluation> {
  const responseEvaluations: CasperResponseEvaluation[] = input.responses.map(
    (response) => ({
      scenarioId: response.scenarioId,
      category: "communication",
      wordCount: response.response.trim().split(/\s+/).length,
      domains: {
        professionalism: "solid",
        empathy: "developing",
        "ethical-reasoning": "solid",
        "stakeholder-awareness": "developing",
        "communication-clarity": "developing",
        "conflict-deescalation": "developing",
        "patient-centeredness": "solid",
      },
      strengths: [
        "Shows reflective thinking.",
        "Avoids extreme punitive language.",
      ],
      improvementTargets: [
        "Name the stakeholders earlier.",
        "State the immediate priority more directly.",
      ],
      missedConsiderations: [
        "Consider escalation pathways.",
      ],
      suggestedRewrite:
        "I would first acknowledge the concern calmly, gather context respectfully, and identify the immediate safety or professionalism issue before deciding on the next step.",
    }),
  );

  return {
    sessionId: input.sessionId,
    completedAtIso: new Date().toISOString(),
    overallRating: "solid",
    responseEvaluations,
    nextSteps: [
      "Practice shorter opening statements.",
      "Increase stakeholder visibility in conflict scenarios.",
    ],
    premiumLockedInsights: [
      "Percentile benchmarking",
      "Advanced communication pattern analysis",
    ],
  };
}
