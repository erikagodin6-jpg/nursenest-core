import type { StructuredClinicalInsight } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { RN_REASONING_ONTOLOGY } from "@/lib/learner/rn-coaching-intelligence/rn-reasoning-ontology";

export type ReasoningInsightSummary = {
  patternLabel: string;
  domain: string;
  guidance: string;
  emphasis: "strength" | "focus";
  nclexLayer?: string;
};

export function summarizeReasoningForUi(insights: StructuredClinicalInsight[]): ReasoningInsightSummary[] {
  return insights.map((i) => {
    const def = RN_REASONING_ONTOLOGY.find((d) => d.pattern === i.pattern);
    return {
      patternLabel: i.patternLabel,
      domain: i.domain,
      guidance: i.guidance,
      emphasis: i.emphasis,
      nclexLayer: def?.nclexLayer.replace(/_/g, " "),
    };
  });
}

export function groupReasoningByEmphasis(insights: ReasoningInsightSummary[]): {
  strengths: ReasoningInsightSummary[];
  focusAreas: ReasoningInsightSummary[];
} {
  return {
    strengths: insights.filter((i) => i.emphasis === "strength"),
    focusAreas: insights.filter((i) => i.emphasis === "focus"),
  };
}
