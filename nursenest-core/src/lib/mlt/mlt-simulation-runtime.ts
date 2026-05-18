import type { MltSimulationState } from "./mlt-simulation-types";
import { evaluateMltWorkflowDecision, type MltDecisionAction, type MltLearnerDecisionInput } from "./mlt-simulation-evaluator";

export interface MltRuntimeStepResult {
  decisionId: string;
  action: MltDecisionAction;
  correct: boolean;
  safetyScore: number;
  nextState: MltSimulationState;
  stateChanges: string[];
}

function clearDecision(state: MltSimulationState, decisionId: string): MltSimulationState {
  return {
    ...state,
    pendingDecisions: state.pendingDecisions.filter((decision) => decision.decisionId !== decisionId),
  };
}

function markSpecimensForReview(state: MltSimulationState, marker: string): MltSimulationState {
  return {
    ...state,
    activeSpecimens: state.activeSpecimens.map((specimen) => ({
      ...specimen,
      analyzerFlags: Array.from(new Set([...specimen.analyzerFlags, marker])),
    })),
  };
}

function markAnalyzerReview(state: MltSimulationState): MltSimulationState {
  return {
    ...state,
    analyzers: state.analyzers.map((analyzer) =>
      analyzer.qcState === "acceptable"
        ? analyzer
        : { ...analyzer, status: "maintenance-required", maintenanceOverdue: false },
    ),
  };
}

function increaseOperationalPressure(state: MltSimulationState): MltSimulationState {
  return {
    ...state,
    staffingPressure: state.staffingPressure === "stable" ? "busy" : "critical-shortage",
    turnaroundPressure: state.turnaroundPressure === "stable" ? "delayed" : "critical-delay",
  };
}

export function applyMltRuntimeDecision(
  state: MltSimulationState,
  input: MltLearnerDecisionInput,
): MltRuntimeStepResult {
  const evaluation = evaluateMltWorkflowDecision(state, input);

  if (!evaluation.correct) {
    return {
      decisionId: input.decisionId,
      action: input.action,
      correct: false,
      safetyScore: evaluation.safetyScore,
      nextState: increaseOperationalPressure(state),
      stateChanges: ["Decision left unresolved and increased simulated workload pressure."],
    };
  }

  let nextState = clearDecision(state, input.decisionId);
  const stateChanges: string[] = [];

  if (input.action === "request-recollection") {
    nextState = markSpecimensForReview(nextState, "recollection-requested");
    stateChanges.push("Specimen marked for recollection workflow.");
  }

  if (input.action === "hold-and-review") {
    nextState = markSpecimensForReview(nextState, "held-for-review");
    stateChanges.push("Result held for review before reporting workflow.");
  }

  if (input.action === "initiate-qc-troubleshooting") {
    nextState = markAnalyzerReview(nextState);
    stateChanges.push("Analyzer moved into review workflow.");
  }

  if (input.action === "perform-smear-review") {
    nextState = markSpecimensForReview(nextState, "smear-review-performed");
    stateChanges.push("Smear review completed for analyzer correlation.");
  }

  if (input.action === "escalate-critical") {
    stateChanges.push("Priority communication workflow activated.");
  }

  if (stateChanges.length === 0) {
    stateChanges.push("Decision completed without additional state markers.");
  }

  return {
    decisionId: input.decisionId,
    action: input.action,
    correct: true,
    safetyScore: evaluation.safetyScore,
    nextState,
    stateChanges,
  };
}

export function runMltRuntimeSimulation(
  initialState: MltSimulationState,
  inputs: MltLearnerDecisionInput[],
): { finalState: MltSimulationState; steps: MltRuntimeStepResult[]; averageSafetyScore: number; passed: boolean } {
  const steps: MltRuntimeStepResult[] = [];
  let currentState = initialState;

  for (const input of inputs) {
    const step = applyMltRuntimeDecision(currentState, input);
    steps.push(step);
    currentState = step.nextState;
  }

  const averageSafetyScore = steps.length
    ? Math.round(steps.reduce((sum, step) => sum + step.safetyScore, 0) / steps.length)
    : 0;

  return {
    finalState: currentState,
    steps,
    averageSafetyScore,
    passed: steps.length > 0 && steps.every((step) => step.correct) && averageSafetyScore >= 85,
  };
}
