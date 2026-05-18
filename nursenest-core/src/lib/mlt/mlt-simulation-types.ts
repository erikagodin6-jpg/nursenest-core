export type MltBenchArea =
  | "hematology"
  | "blood-bank"
  | "chemistry"
  | "microbiology"
  | "coagulation"
  | "urinalysis"
  | "quality-control";

export type MltAnalyzerStatus = "ready" | "warning" | "qc-failed" | "maintenance-required" | "offline";

export type MltSpecimenIntegrity = "acceptable" | "hemolyzed" | "clotted" | "underfilled" | "contaminated" | "delayed";

export type MltEscalationPriority = "routine" | "urgent" | "critical";

export interface MltAnalyzerState {
  analyzerId: string;
  benchArea: MltBenchArea;
  status: MltAnalyzerStatus;
  qcState: "acceptable" | "trend-high" | "trend-low" | "rule-violation";
  maintenanceOverdue: boolean;
  affectedAssays: string[];
}

export interface MltSimulationSpecimen {
  specimenId: string;
  source: string;
  integrity: MltSpecimenIntegrity;
  benchArea: MltBenchArea;
  collectedMinutesAgo: number;
  analyzerFlags: string[];
}

export interface MltCriticalValueEvent {
  eventId: string;
  analyte: string;
  value: string;
  escalationPriority: MltEscalationPriority;
  requiresReadback: boolean;
  linkedSpecimenId: string;
}

export interface MltWorkflowDecision {
  decisionId: string;
  category:
    | "verify-result"
    | "hold-result"
    | "recollect-specimen"
    | "critical-escalation"
    | "qc-troubleshooting"
    | "emergency-release"
    | "smear-review";
  rationaleExpectation: string;
  patientSafetyImpact: "low" | "moderate" | "high";
}

export interface MltSimulationState {
  simulationId: string;
  activeBenchAreas: MltBenchArea[];
  analyzers: MltAnalyzerState[];
  activeSpecimens: MltSimulationSpecimen[];
  criticalEvents: MltCriticalValueEvent[];
  pendingDecisions: MltWorkflowDecision[];
  staffingPressure: "stable" | "busy" | "critical-shortage";
  turnaroundPressure: "stable" | "delayed" | "critical-delay";
}

export const MLT_SIMULATION_STARTER_STATE: MltSimulationState = {
  simulationId: "mlt-starter-sim",
  activeBenchAreas: ["hematology", "chemistry", "blood-bank"],
  analyzers: [
    {
      analyzerId: "chem-1",
      benchArea: "chemistry",
      status: "warning",
      qcState: "trend-high",
      maintenanceOverdue: false,
      affectedAssays: ["potassium", "AST"],
    },
    {
      analyzerId: "heme-1",
      benchArea: "hematology",
      status: "ready",
      qcState: "acceptable",
      maintenanceOverdue: false,
      affectedAssays: ["CBC", "platelets"],
    },
  ],
  activeSpecimens: [
    {
      specimenId: "spec-001",
      source: "Emergency Department",
      integrity: "hemolyzed",
      benchArea: "chemistry",
      collectedMinutesAgo: 54,
      analyzerFlags: ["hemolysis-index-high", "critical-potassium"],
    },
    {
      specimenId: "spec-002",
      source: "ICU",
      integrity: "acceptable",
      benchArea: "hematology",
      collectedMinutesAgo: 12,
      analyzerFlags: ["blast-flag"],
    },
  ],
  criticalEvents: [
    {
      eventId: "critical-k",
      analyte: "Potassium",
      value: "6.9 mmol/L",
      escalationPriority: "critical",
      requiresReadback: true,
      linkedSpecimenId: "spec-001",
    },
  ],
  pendingDecisions: [
    {
      decisionId: "decision-001",
      category: "verify-result",
      rationaleExpectation: "Evaluate specimen integrity before releasing critical potassium.",
      patientSafetyImpact: "high",
    },
    {
      decisionId: "decision-002",
      category: "smear-review",
      rationaleExpectation: "Correlate analyzer blast flag with morphology review and escalation policy.",
      patientSafetyImpact: "high",
    },
  ],
  staffingPressure: "busy",
  turnaroundPressure: "delayed",
};
