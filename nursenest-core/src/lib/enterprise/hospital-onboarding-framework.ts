import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";

export type HospitalOnboardingTrack =
  | "medical_surgical"
  | "emergency"
  | "critical_care"
  | "telemetry"
  | "pediatrics"
  | "maternal_child"
  | "mental_health"
  | "community";

export type HospitalOnboardingProgram = Readonly<{
  id: string;
  track: HospitalOnboardingTrack;
  name: string;
  lessons: readonly string[];
  skills: readonly string[];
  simulations: readonly string[];
  competencies: readonly string[];
  clearances: readonly string[];
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export const HOSPITAL_ONBOARDING_PROGRAMS: readonly HospitalOnboardingProgram[] = [
  {
    id: "hospital-telemetry-onboarding",
    track: "telemetry",
    name: "Telemetry Onboarding",
    lessons: ["ecg-interpretation", "arrhythmia-escalation"],
    skills: ["telemetry-monitoring", "sbar-escalation"],
    simulations: ["telemetry-shift", "vt-deterioration"],
    competencies: ["rn_ecg_foundations", "rn_clinical_judgment_prioritization"],
    clearances: ["telemetry_ready"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "hospital-med-surg-onboarding",
    track: "medical_surgical",
    name: "Medical-Surgical Onboarding",
    lessons: ["prioritization", "medication-safety", "documentation"],
    skills: ["focused-assessment", "medication-administration"],
    simulations: ["shift-management-simulator", "patient-deterioration"],
    competencies: ["rn_medication_safety", "rn_delegation_supervision"],
    clearances: ["medication_safety_ready", "new_graduate_ready"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "hospital-critical-care-onboarding",
    track: "critical_care",
    name: "Critical Care Onboarding",
    lessons: ["shock", "abg-interpretation", "vasopressors"],
    skills: ["rapid-assessment", "code-response"],
    simulations: ["sepsis-shock", "critical-care-deterioration"],
    competencies: ["rn_abg_lab_interpretation", "rn_clinical_judgment_prioritization"],
    clearances: ["critical_care_ready"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
];

export function listHospitalOnboardingPrograms(track?: HospitalOnboardingTrack): readonly HospitalOnboardingProgram[] {
  return track ? HOSPITAL_ONBOARDING_PROGRAMS.filter((program) => program.track === track) : HOSPITAL_ONBOARDING_PROGRAMS;
}
