import type { CasperScenarioCategory } from "@/lib/casper/casper-scenarios";

export type CasperFeedbackDomain =
  | "professionalism"
  | "empathy"
  | "ethical-reasoning"
  | "stakeholder-awareness"
  | "communication-clarity"
  | "conflict-deescalation"
  | "patient-centeredness";

export type CasperFeedbackRating = "needs-focus" | "developing" | "solid" | "strong";

export type CasperResponseEvaluation = {
  scenarioId: string;
  category: CasperScenarioCategory;
  wordCount: number;
  domains: Record<CasperFeedbackDomain, CasperFeedbackRating>;
  strengths: string[];
  improvementTargets: string[];
  missedConsiderations: string[];
  suggestedRewrite: string;
};

export type CasperSessionEvaluation = {
  sessionId: string;
  completedAtIso: string;
  overallRating: CasperFeedbackRating;
  responseEvaluations: CasperResponseEvaluation[];
  nextSteps: string[];
  premiumLockedInsights: string[];
};

const DEFAULT_DOMAIN_RATINGS: Record<CasperFeedbackDomain, CasperFeedbackRating> = {
  professionalism: "solid",
  empathy: "developing",
  "ethical-reasoning": "solid",
  "stakeholder-awareness": "solid",
  "communication-clarity": "developing",
  "conflict-deescalation": "developing",
  "patient-centeredness": "solid",
};

export function buildRuleBasedCasperResponseEvaluation(input: {
  scenarioId: string;
  category: CasperScenarioCategory;
  response: string;
}): CasperResponseEvaluation {
  const normalized = input.response.trim();
  const wordCount = normalized.length === 0 ? 0 : normalized.split(/\s+/).length;

  return {
    scenarioId: input.scenarioId,
    category: input.category,
    wordCount,
    domains: DEFAULT_DOMAIN_RATINGS,
    strengths: [
      "Uses a reflective approach instead of jumping straight to punishment.",
      "Shows awareness that professionalism includes both empathy and accountability.",
    ],
    improvementTargets: [
      "Name the key stakeholders earlier in the response.",
      "State the immediate safety or integrity priority before explaining context.",
    ],
    missedConsiderations: [
      "What information would you verify before acting?",
      "Who should be involved if the issue cannot be resolved directly?",
    ],
    suggestedRewrite:
      "I would first respond calmly and gather enough context to understand what is happening. I would acknowledge the person’s stress while clearly naming the professional or ethical concern, then encourage a safe and accountable next step. If the concern remained unresolved or involved risk to others, I would escalate through the appropriate channel.",
  };
}
