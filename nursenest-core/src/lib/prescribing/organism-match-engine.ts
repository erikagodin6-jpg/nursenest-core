import type {
  OrganismMatchPrompt,
  OrganismMatchResult
} from "./organism-coverage-types";

export function evaluateOrganismMatch(
  prompt: OrganismMatchPrompt,
  selectedAntibioticId: string
): OrganismMatchResult {
  if (prompt.correctAntibioticIds.includes(selectedAntibioticId)) {
    return {
      correct: true,
      selectedAntibioticId,
      rationale: prompt.rationale
    };
  }

  if (prompt.unsafeAntibioticIds.includes(selectedAntibioticId)) {
    return {
      correct: false,
      selectedAntibioticId,
      rationale:
        "This selection demonstrates unnecessary broad-spectrum escalation or poor organism targeting.",
      remediationTopic: "antibiotic-stewardship"
    };
  }

  return {
    correct: false,
    selectedAntibioticId,
    rationale:
      "The selected therapy does not appropriately align with the likely organism profile.",
    remediationTopic: "organism-coverage"
  };
}
