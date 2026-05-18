import type {
  CnplePatientStateSignal,
  CnpleSimulationDecisionTrace,
} from "@/lib/cnple/cnple-simulation-intelligence";

export type CnpleLongitudinalPatientState = {
  clinicalRiskScore: number;
  deteriorationRisk: "low" | "moderate" | "high" | "critical";
  unresolvedSafetyRisks: string[];
  resolvedRisks: string[];
  longitudinalWarnings: string[];
  patientTrajectory: "recovering" | "fragile" | "unstable" | "deteriorating";
  continuityFlags: string[];
};

const SEVERITY_WEIGHT: Record<CnplePatientStateSignal["severity"], number> = {
  low: 1,
  moderate: 2,
  high: 4,
  critical: 7,
};

export function buildCnpleLongitudinalPatientState(
  traces: CnpleSimulationDecisionTrace[],
): CnpleLongitudinalPatientState {
  let risk = 0;

  const unresolvedSafetyRisks = new Set<string>();
  const resolvedRisks = new Set<string>();
  const continuityFlags = new Set<string>();
  const longitudinalWarnings = new Set<string>();

  for (const trace of traces) {
    if (trace.consequenceTrajectory === "harmful") {
      risk += 8;
      longitudinalWarnings.add("Unsafe decision caused patient deterioration risk.");
    }

    if (trace.consequenceTrajectory === "suboptimal") {
      risk += 3;
    }

    for (const signal of trace.patientStateSignals) {
      const weight = SEVERITY_WEIGHT[signal.severity];

      switch (signal.direction) {
        case "improved":
        case "resolved":
          risk -= weight;
          resolvedRisks.add(signal.label);
          break;

        case "worsened":
        case "new-risk":
          risk += weight;
          unresolvedSafetyRisks.add(signal.label);
          break;

        case "unchanged":
          risk += Math.max(1, weight - 1);
          unresolvedSafetyRisks.add(signal.label);
          break;
      }

      if (signal.severity === "critical") {
        continuityFlags.add("Critical-risk event occurred during longitudinal management.");
      }

      if (
        signal.label.toLowerCase().includes("follow-up") ||
        signal.label.toLowerCase().includes("monitor") ||
        signal.label.toLowerCase().includes("adherence")
      ) {
        continuityFlags.add("Longitudinal monitoring vulnerability identified.");
      }
    }
  }

  const clinicalRiskScore = Math.max(0, Math.min(100, risk * 2));

  const deteriorationRisk: CnpleLongitudinalPatientState["deteriorationRisk"] =
    clinicalRiskScore >= 75
      ? "critical"
      : clinicalRiskScore >= 50
        ? "high"
        : clinicalRiskScore >= 25
          ? "moderate"
          : "low";

  const patientTrajectory: CnpleLongitudinalPatientState["patientTrajectory"] =
    deteriorationRisk === "critical"
      ? "deteriorating"
      : deteriorationRisk === "high"
        ? "unstable"
        : deteriorationRisk === "moderate"
          ? "fragile"
          : "recovering";

  if (clinicalRiskScore >= 50) {
    longitudinalWarnings.add("Simulation suggests elevated risk of preventable deterioration if patterns continue.");
  }

  if (unresolvedSafetyRisks.size >= 3) {
    continuityFlags.add("Multiple unresolved safety issues remain active across encounters.");
  }

  return {
    clinicalRiskScore,
    deteriorationRisk,
    unresolvedSafetyRisks: Array.from(unresolvedSafetyRisks),
    resolvedRisks: Array.from(resolvedRisks),
    longitudinalWarnings: Array.from(longitudinalWarnings),
    patientTrajectory,
    continuityFlags: Array.from(continuityFlags),
  };
}
