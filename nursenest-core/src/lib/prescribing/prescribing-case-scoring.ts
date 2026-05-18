import type {
  PrescribingCase,
  PrescribingCaseDecisionOption,
  PrescribingCaseScore
} from "./prescribing-case-types";

export function scorePrescribingCase(
  prescribingCase: PrescribingCase,
  selectedOptionIds: string[]
): PrescribingCaseScore {
  let correctSteps = 0;
  let stewardshipScore = 0;

  const missedSafetyIssues: string[] = [];
  const remediationTopics = new Set<string>();

  for (const step of prescribingCase.steps) {
    const selected = step.options.find((option) =>
      selectedOptionIds.includes(option.id)
    );

    if (!selected) {
      remediationTopics.add(step.type);
      continue;
    }

    stewardshipScore += selected.stewardshipImpact;

    if (selected.correct) {
      correctSteps += 1;
    } else {
      missedSafetyIssues.push(selected.rationale);
      remediationTopics.add(step.type);
    }
  }

  return {
    totalSteps: prescribingCase.steps.length,
    correctSteps,
    stewardshipScore,
    missedSafetyIssues,
    remediationTopics: Array.from(remediationTopics)
  };
}
