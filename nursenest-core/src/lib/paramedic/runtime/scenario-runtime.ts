import type { EmsPatientState } from "./patient-state";
import type { EmsEcgState } from "./ecg-runtime";
import type { EmsTransportState } from "./transport-runtime";

export type EmsScenarioEnvironment = {
  rural: boolean;
  weather?: string;
  hazards?: string[];
  bystandersPresent?: boolean;
  backupEtaMinutes?: number;
};

export type EmsScenarioEventType =
  | "assessment"
  | "reassessment"
  | "intervention"
  | "deterioration"
  | "transport"
  | "ecg-change"
  | "handoff";

export interface EmsScenarioTimelineEvent {
  timestampSeconds: number;
  type: EmsScenarioEventType;
  title: string;
  description: string;
  physiologicImpact?: string;
}

export interface EmsScenarioInterventionRecord {
  timestampSeconds: number;
  intervention:
    | "oxygen"
    | "cpap"
    | "bvm"
    | "nitroglycerin"
    | "aspirin"
    | "fluid-bolus"
    | "tourniquet"
    | "epinephrine"
    | "naloxone"
    | "defibrillation"
    | "cpr"
    | "transport-initiation";
  successful: boolean;
  notes?: string;
}

export interface EmsScenarioDebrief {
  recognitionScore: number;
  prioritizationScore: number;
  reassessmentScore: number;
  transportScore: number;
  escalationScore: number;
  strengths: string[];
  improvementAreas: string[];
}

export interface EmsScenarioRuntime {
  slug: string;
  title: string;
  category:
    | "cardiology"
    | "airway"
    | "trauma"
    | "operations"
    | "pediatrics"
    | "toxicology";
  environment: EmsScenarioEnvironment;
  patient: EmsPatientState;
  ecg?: EmsEcgState;
  transport: EmsTransportState;
  timeline: EmsScenarioTimelineEvent[];
  interventions: EmsScenarioInterventionRecord[];
  activeRisks: string[];
  debrief?: EmsScenarioDebrief;
}

export function appendScenarioEvent(
  scenario: EmsScenarioRuntime,
  event: EmsScenarioTimelineEvent,
): EmsScenarioRuntime {
  return {
    ...scenario,
    timeline: [...scenario.timeline, event].sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds,
    ),
  };
}

export function appendScenarioIntervention(
  scenario: EmsScenarioRuntime,
  intervention: EmsScenarioInterventionRecord,
): EmsScenarioRuntime {
  return {
    ...scenario,
    interventions: [...scenario.interventions, intervention].sort(
      (a, b) => a.timestampSeconds - b.timestampSeconds,
    ),
  };
}

export function calculateScenarioOperationalRisk(
  scenario: Pick<EmsScenarioRuntime, "patient" | "ecg" | "transport">,
): number {
  const patientRisk = scenario.patient.deteriorationRisk;
  const ecgRisk = scenario.ecg?.perfusionRisk ?? 0;
  const transportRisk = scenario.transport.urgency === "immediate"
    ? 100
    : scenario.transport.urgency === "critical"
      ? 75
      : scenario.transport.urgency === "urgent"
        ? 45
        : 10;

  return Math.round((patientRisk * 0.45) + (ecgRisk * 0.35) + (transportRisk * 0.20));
}

export function buildEmptyDebrief(): EmsScenarioDebrief {
  return {
    recognitionScore: 0,
    prioritizationScore: 0,
    reassessmentScore: 0,
    transportScore: 0,
    escalationScore: 0,
    strengths: [],
    improvementAreas: [],
  };
}
