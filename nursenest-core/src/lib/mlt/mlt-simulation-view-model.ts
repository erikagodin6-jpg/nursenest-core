import type { MltAnalyzerState, MltCriticalValueEvent, MltSimulationSpecimen, MltSimulationState } from "./mlt-simulation-types";

export type MltSimulationSeverity = "stable" | "watch" | "urgent" | "critical";

export interface MltSimulationCockpitCard {
  id: string;
  label: string;
  value: string;
  severity: MltSimulationSeverity;
  detail: string;
}

export interface MltSimulationCockpitViewModel {
  simulationId: string;
  summaryCards: MltSimulationCockpitCard[];
  analyzerCards: MltSimulationCockpitCard[];
  specimenCards: MltSimulationCockpitCard[];
  criticalEventCards: MltSimulationCockpitCard[];
  pendingDecisionCards: MltSimulationCockpitCard[];
  overallSeverity: MltSimulationSeverity;
}

function severityRank(severity: MltSimulationSeverity): number {
  return { stable: 0, watch: 1, urgent: 2, critical: 3 }[severity];
}

function maxSeverity(severities: MltSimulationSeverity[]): MltSimulationSeverity {
  return severities.reduce<MltSimulationSeverity>(
    (current, candidate) => (severityRank(candidate) > severityRank(current) ? candidate : current),
    "stable",
  );
}

function analyzerSeverity(analyzer: MltAnalyzerState): MltSimulationSeverity {
  if (analyzer.status === "offline" || analyzer.status === "qc-failed") return "critical";
  if (analyzer.status === "maintenance-required" || analyzer.qcState === "rule-violation") return "urgent";
  if (analyzer.status === "warning" || analyzer.qcState === "trend-high" || analyzer.qcState === "trend-low") return "watch";
  return "stable";
}

function specimenSeverity(specimen: MltSimulationSpecimen): MltSimulationSeverity {
  if (specimen.analyzerFlags.some((flag) => /critical|blast/i.test(flag))) return "critical";
  if (["hemolyzed", "clotted", "underfilled", "contaminated"].includes(specimen.integrity)) return "urgent";
  if (specimen.integrity === "delayed" || specimen.collectedMinutesAgo > 90) return "watch";
  return "stable";
}

function criticalEventSeverity(event: MltCriticalValueEvent): MltSimulationSeverity {
  if (event.escalationPriority === "critical") return "critical";
  if (event.escalationPriority === "urgent") return "urgent";
  return "watch";
}

export function buildMltSimulationCockpitViewModel(state: MltSimulationState): MltSimulationCockpitViewModel {
  const analyzerCards = state.analyzers.map<MltSimulationCockpitCard>((analyzer) => ({
    id: analyzer.analyzerId,
    label: `${analyzer.benchArea} analyzer`,
    value: analyzer.status,
    severity: analyzerSeverity(analyzer),
    detail: `QC: ${analyzer.qcState}; affected assays: ${analyzer.affectedAssays.join(", ") || "none"}`,
  }));

  const specimenCards = state.activeSpecimens.map<MltSimulationCockpitCard>((specimen) => ({
    id: specimen.specimenId,
    label: `${specimen.benchArea} specimen`,
    value: specimen.integrity,
    severity: specimenSeverity(specimen),
    detail: `${specimen.source}; collected ${specimen.collectedMinutesAgo} min ago; flags: ${specimen.analyzerFlags.join(", ") || "none"}`,
  }));

  const criticalEventCards = state.criticalEvents.map<MltSimulationCockpitCard>((event) => ({
    id: event.eventId,
    label: event.analyte,
    value: event.value,
    severity: criticalEventSeverity(event),
    detail: `Priority: ${event.escalationPriority}; readback: ${event.requiresReadback ? "required" : "not required"}; specimen: ${event.linkedSpecimenId}`,
  }));

  const pendingDecisionCards = state.pendingDecisions.map<MltSimulationCockpitCard>((decision) => ({
    id: decision.decisionId,
    label: decision.category,
    value: decision.patientSafetyImpact,
    severity: decision.patientSafetyImpact === "high" ? "critical" : decision.patientSafetyImpact === "moderate" ? "urgent" : "watch",
    detail: decision.rationaleExpectation,
  }));

  const summaryCards: MltSimulationCockpitCard[] = [
    {
      id: "active-benches",
      label: "Active benches",
      value: String(state.activeBenchAreas.length),
      severity: "stable",
      detail: state.activeBenchAreas.join(", "),
    },
    {
      id: "staffing-pressure",
      label: "Staffing pressure",
      value: state.staffingPressure,
      severity: state.staffingPressure === "critical-shortage" ? "critical" : state.staffingPressure === "busy" ? "watch" : "stable",
      detail: "Simulated workload pressure affecting workflow prioritization.",
    },
    {
      id: "turnaround-pressure",
      label: "Turnaround pressure",
      value: state.turnaroundPressure,
      severity: state.turnaroundPressure === "critical-delay" ? "critical" : state.turnaroundPressure === "delayed" ? "urgent" : "stable",
      detail: "Simulated reporting pressure affecting decision timing.",
    },
  ];

  const allSeverities = [
    ...summaryCards,
    ...analyzerCards,
    ...specimenCards,
    ...criticalEventCards,
    ...pendingDecisionCards,
  ].map((card) => card.severity);

  return {
    simulationId: state.simulationId,
    summaryCards,
    analyzerCards,
    specimenCards,
    criticalEventCards,
    pendingDecisionCards,
    overallSeverity: maxSeverity(allSeverities),
  };
}
