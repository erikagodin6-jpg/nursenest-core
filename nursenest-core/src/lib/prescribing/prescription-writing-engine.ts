import {
  PRESCRIPTION_WRITING_SCENARIOS
} from "./prescription-writing-scenarios";

import type {
  PrescriptionOrder,
  PrescriptionOrderEvaluation,
  PrescriptionWritingScenario
} from "./prescription-writing-types";

export function evaluatePrescriptionOrder(
  scenario: PrescriptionWritingScenario,
  order: PrescriptionOrder,
  completedSafetyChecks: string[]
): PrescriptionOrderEvaluation {
  const matchedOrder = scenario.acceptableOrders.find(
    (candidate) =>
      candidate.medication.toLowerCase() ===
      order.medication.toLowerCase()
  );

  const missingSafetyChecks = scenario.requiredSafetyChecks.filter(
    (requiredCheck) => !completedSafetyChecks.includes(requiredCheck)
  );

  const warnings: string[] = [];

  if (
    scenario.unsafeOrders.some((unsafe) =>
      order.medication.toLowerCase().includes(unsafe.toLowerCase())
    )
  ) {
    warnings.push(
      "This regimen may represent unnecessary broad-spectrum escalation."
    );
  }

  if (!matchedOrder) {
    warnings.push(
      "The selected therapy is not aligned with the preferred prescribing pathway."
    );
  }

  return {
    safe:
      Boolean(matchedOrder) && missingSafetyChecks.length === 0,
    matchedOrder,
    missingSafetyChecks,
    warnings,
    teachingPoints: scenario.teachingPoints
  };
}

export function getPrescriptionWritingScenario(id: string) {
  return PRESCRIPTION_WRITING_SCENARIOS.find(
    (scenario) => scenario.id === id
  );
}
