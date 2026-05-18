import type { MltSimulationState, MltWorkflowDecision } from "./mlt-simulation-types";

export type MltDecisionAction =
  | "release-result"
  | "hold-and-review"
  | "request-recollection"
  | "escalate-critical"
  | "initiate-qc-troubleshooting"
  | "perform-smear-review"
  | "document-and-monitor";

export interface MltLearnerDecisionInput {
  decisionId: string;
  action: MltDecisionAction;
  rationaleKeywords?: string[];
}

export interface MltDecisionEvaluation {
  decisionId: string;
  action: MltDecisionAction;
  correct: boolean;
  safetyScore: number;
  feedback: string;
  missedSafetyConcepts: string[];
}

const HIGH_RISK_SPECIMEN_INTEGRITY = new Set(["hemolyzed", "clotted", "underfilled", "contaminated", "delayed"]);

function findDecision(state: MltSimulationState, decisionId: string): MltWorkflowDecision | undefined {
  return state.pendingDecisions.find((decision) => decision.decisionId === decisionId);
}

function hasUnsafeSpecimenLinkedToCriticalEvent(state: MltSimulationState): boolean {
  return state.criticalEvents.some((event) => {
    const specimen = state.activeSpecimens.find((candidate) => candidate.specimenId === event.linkedSpecimenId);
    return specimen ? HIGH_RISK_SPECIMEN_INTEGRITY.has(specimen.integrity) : false;
  });
}

function hasAnalyzerQcConcern(state: MltSimulationState): boolean {
  return state.analyzers.some(
    (analyzer) => analyzer.status === "qc-failed" || analyzer.qcState === "trend-high" || analyzer.qcState === "trend-low" || analyzer.qcState === "rule-violation",
  );
}

function expectedActionsForDecision(state: MltSimulationState, decision: MltWorkflowDecision): Set<MltDecisionAction> {
  if (decision.category === "verify-result" && hasUnsafeSpecimenLinkedToCriticalEvent(state)) {
    return new Set(["hold-and-review", "request-recollection"]);
  }

  if (decision.category === "qc-troubleshooting" || hasAnalyzerQcConcern(state)) {
    return new Set(["initiate-qc-troubleshooting", "hold-and-review"]);
  }

  if (decision.category === "smear-review") {
    return new Set(["perform-smear-review", "escalate-critical"]);
  }

  if (decision.category === "critical-escalation") {
    return new Set(["escalate-critical"]);
  }

  if (decision.category === "recollect-specimen") {
    return new Set(["request-recollection"]);
  }

  if (decision.category === "hold-result") {
    return new Set(["hold-and-review"]);
  }

  if (decision.category === "emergency-release") {
    return new Set(["escalate-critical", "document-and-monitor"]);
  }

  return new Set(["document-and-monitor"]);
}

function scoreForDecision(decision: MltWorkflowDecision, correct: boolean): number {
  if (correct) return decision.patientSafetyImpact === "high" ? 100 : decision.patientSafetyImpact === "moderate" ? 85 : 75;
  return decision.patientSafetyImpact === "high" ? 20 : decision.patientSafetyImpact === "moderate" ? 40 : 55;
}

export function evaluateMltWorkflowDecision(
  state: MltSimulationState,
  input: MltLearnerDecisionInput,
): MltDecisionEvaluation {
  const decision = findDecision(state, input.decisionId);

  if (!decision) {
    return {
      decisionId: input.decisionId,
      action: input.action,
      correct: false,
      safetyScore: 0,
      feedback: "Decision not found in the active MLS/MLT simulation state.",
      missedSafetyConcepts: ["simulation-state-integrity"],
    };
  }

  const expectedActions = expectedActionsForDecision(state, decision);
  const correct = expectedActions.has(input.action);
  const missedSafetyConcepts: string[] = [];

  if (!correct && hasUnsafeSpecimenLinkedToCriticalEvent(state)) {
    missedSafetyConcepts.push("specimen-integrity-before-release");
  }
  if (!correct && hasAnalyzerQcConcern(state)) {
    missedSafetyConcepts.push("qc-status-before-reporting");
  }
  if (!correct && decision.category === "smear-review") {
    missedSafetyConcepts.push("morphology-review-escalation");
  }

  return {
    decisionId: decision.decisionId,
    action: input.action,
    correct,
    safetyScore: scoreForDecision(decision, correct),
    feedback: correct
      ? `Safe decision. ${decision.rationaleExpectation}`
      : `Unsafe or incomplete decision. Expected one of: ${Array.from(expectedActions).join(", ")}. ${decision.rationaleExpectation}`,
    missedSafetyConcepts,
  };
}

export function evaluateMltWorkflowSession(
  state: MltSimulationState,
  inputs: MltLearnerDecisionInput[],
): { evaluations: MltDecisionEvaluation[]; averageSafetyScore: number; passed: boolean } {
  const evaluations = inputs.map((input) => evaluateMltWorkflowDecision(state, input));
  const averageSafetyScore = evaluations.length
    ? Math.round(evaluations.reduce((sum, evaluation) => sum + evaluation.safetyScore, 0) / evaluations.length)
    : 0;

  return {
    evaluations,
    averageSafetyScore,
    passed: evaluations.length > 0 && evaluations.every((evaluation) => evaluation.correct) && averageSafetyScore >= 85,
  };
}
