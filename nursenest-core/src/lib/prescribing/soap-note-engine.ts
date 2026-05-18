import type {
  PrescribingSoapEvaluation,
  PrescribingSoapNote,
  PrescribingSoapScenario
} from "./soap-note-types";

export function evaluateSoapNote(
  scenario: PrescribingSoapScenario,
  note: PrescribingSoapNote
): PrescribingSoapEvaluation {
  const planText = note.plan.join(" ").toLowerCase();
  const objectiveText = note.objective.join(" ").toLowerCase();

  const missingPlanElements = scenario.requiredPlanElements.filter(
    (requiredElement) => !planText.includes(requiredElement.toLowerCase())
  );

  const missedRedFlags = scenario.redFlags.filter(
    (redFlag) => !objectiveText.includes(redFlag.toLowerCase())
  );

  return {
    complete:
      missingPlanElements.length === 0 &&
      missedRedFlags.length === 0,
    missingPlanElements,
    missedRedFlags,
    feedback: [
      missingPlanElements.length > 0
        ? "Clinical plan is incomplete."
        : "Plan addresses major prescribing priorities.",
      missedRedFlags.length > 0
        ? "Important escalation or admission criteria may have been missed."
        : "Red flag assessment documented appropriately."
    ]
  };
}
