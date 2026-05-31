import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";

export type HospitalResidencyTrack =
  | "new_graduate_nurse_residency"
  | "critical_care_residency"
  | "emergency_residency"
  | "telemetry_residency"
  | "specialty_orientation";

export type HospitalResidencyProgram = Readonly<{
  id: string;
  track: HospitalResidencyTrack;
  progressMetrics: readonly string[];
  competencies: readonly string[];
  readinessDomains: readonly string[];
  clearances: readonly string[];
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export const HOSPITAL_RESIDENCY_PROGRAMS: readonly HospitalResidencyProgram[] = [
  {
    id: "new-grad-nurse-residency",
    track: "new_graduate_nurse_residency",
    progressMetrics: ["lessons", "case studies", "simulations", "documentation exercises"],
    competencies: ["new_grad_shift_organization", "new_grad_escalation_readiness", "new_grad_documentation_excellence"],
    readinessDomains: ["patient safety", "delegation", "communication", "documentation"],
    clearances: ["new_graduate_ready", "medication_safety_ready"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "critical-care-residency",
    track: "critical_care_residency",
    progressMetrics: ["ECG", "labs", "simulations", "clinical skills"],
    competencies: ["rn_ecg_foundations", "rn_abg_lab_interpretation"],
    readinessDomains: ["critical care readiness", "emergency response", "lab interpretation"],
    clearances: ["critical_care_ready", "telemetry_ready"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
];
