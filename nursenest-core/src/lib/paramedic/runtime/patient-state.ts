export type EmsInstabilityLevel = "stable" | "escalating" | "critical" | "peri-arrest";

export type EmsAirwayState = "patent" | "threatened" | "obstructed" | "contaminated";

export type EmsBreathingState = "adequate" | "distressed" | "failing" | "apneic";

export type EmsCirculationState = "stable" | "shock" | "peri-arrest" | "arrest";

export type EmsNeurologicState = "alert" | "confused" | "lethargic" | "unresponsive";

export type EmsPerfusionState = "adequate" | "compensated-shock" | "decompensated-shock" | "no-pulse";

export interface EmsPatientVitals {
  hr: number;
  rr: number;
  bp: string;
  spo2: number;
  etco2?: number;
  tempC?: number;
  gcs?: number;
}

export interface EmsPatientAssessmentFindings {
  skinSigns?: string[];
  workOfBreathing?: string[];
  lungSounds?: string[];
  pulseQuality?: string;
  mentalStatusNotes?: string[];
  bleedingFindings?: string[];
  painDescription?: string;
}

export interface EmsPatientState {
  airway: EmsAirwayState;
  breathing: EmsBreathingState;
  circulation: EmsCirculationState;
  neurologic: EmsNeurologicState;
  perfusion: EmsPerfusionState;
  vitals: EmsPatientVitals;
  findings: EmsPatientAssessmentFindings;
  instabilityLevel: EmsInstabilityLevel;
  deteriorationRisk: number;
  lastReassessedAtSeconds?: number;
}

export function clampDeteriorationRisk(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function inferInstabilityLevel(patient: Pick<EmsPatientState, "airway" | "breathing" | "circulation" | "neurologic" | "perfusion" | "deteriorationRisk">): EmsInstabilityLevel {
  if (
    patient.airway === "obstructed" ||
    patient.breathing === "apneic" ||
    patient.circulation === "arrest" ||
    patient.perfusion === "no-pulse" ||
    patient.neurologic === "unresponsive"
  ) {
    return "peri-arrest";
  }

  if (
    patient.airway === "contaminated" ||
    patient.breathing === "failing" ||
    patient.circulation === "peri-arrest" ||
    patient.perfusion === "decompensated-shock" ||
    patient.deteriorationRisk >= 75
  ) {
    return "critical";
  }

  if (
    patient.airway === "threatened" ||
    patient.breathing === "distressed" ||
    patient.circulation === "shock" ||
    patient.perfusion === "compensated-shock" ||
    patient.neurologic === "confused" ||
    patient.neurologic === "lethargic" ||
    patient.deteriorationRisk >= 35
  ) {
    return "escalating";
  }

  return "stable";
}

export function normalizePatientState(patient: EmsPatientState): EmsPatientState {
  const deteriorationRisk = clampDeteriorationRisk(patient.deteriorationRisk);
  return {
    ...patient,
    deteriorationRisk,
    instabilityLevel: inferInstabilityLevel({ ...patient, deteriorationRisk }),
  };
}
