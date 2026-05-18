export type LoftSimulationSessionCopy = {
  simulationTitle: string;
  simulationSubtitle: string;
  remainingQuestionsLabel: string;
  answeredQuestionsLabel: string;
  flaggedQuestionsLabel: string;
  reviewFlaggedLabel: string;
  sectionProgressLabel: string;
  exhibitRailLabel: string;
  resumeSimulationLabel: string;
  reviewBeforeSubmitLabel: string;
  submitSimulationLabel: string;
  lockedRationaleLabel: string;
};

export const DEFAULT_LOFT_SIMULATION_SESSION_COPY: LoftSimulationSessionCopy = {
  simulationTitle: "Linear simulation",
  simulationSubtitle: "Fixed-form licensing exam practice with reviewable questions and persistent exhibits.",
  remainingQuestionsLabel: "Remaining questions",
  answeredQuestionsLabel: "Answered questions",
  flaggedQuestionsLabel: "Flagged questions",
  reviewFlaggedLabel: "Review flagged questions",
  sectionProgressLabel: "Section progress",
  exhibitRailLabel: "Clinical exhibits",
  resumeSimulationLabel: "Resume simulation",
  reviewBeforeSubmitLabel: "Review before final submission",
  submitSimulationLabel: "Submit simulation",
  lockedRationaleLabel: "Rationales unlock after the simulation is submitted.",
};

export const CNPLE_LOFT_SIMULATION_SESSION_COPY: LoftSimulationSessionCopy = {
  ...DEFAULT_LOFT_SIMULATION_SESSION_COPY,
  simulationTitle: "CNPLE simulation",
  simulationSubtitle: "Linear NP licensing simulation with case context, flagged review, and fixed-session pacing.",
};

export function resolveLoftSimulationSessionCopy(args?: {
  examCode?: string | null;
}): LoftSimulationSessionCopy {
  const examCode = String(args?.examCode ?? "").trim().toLowerCase();
  if (examCode === "cnple") return CNPLE_LOFT_SIMULATION_SESSION_COPY;
  return DEFAULT_LOFT_SIMULATION_SESSION_COPY;
}
