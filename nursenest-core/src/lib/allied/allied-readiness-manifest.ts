export type AlliedReadinessStatus = "complete" | "near_complete" | "mature";

export type AlliedReadinessDomain =
  | "coreCurriculum"
  | "dedicatedCatalog"
  | "seoCoverage"
  | "assessmentReadiness"
  | "simulationReadiness"
  | "remediationReadiness";

export type AlliedReadinessEntry = {
  professionKey: string;
  label: string;
  percentComplete: number;
  status: AlliedReadinessStatus;
  dedicatedCatalogFile?: string;
  strengths: string[];
  remainingGaps: string[];
  domains: Record<AlliedReadinessDomain, number>;
};

export const ALLIED_READINESS_MANIFEST: AlliedReadinessEntry[] = [
  {
    professionKey: "respiratory",
    label: "Respiratory Therapy",
    percentComplete: 100,
    status: "complete",
    dedicatedCatalogFile: "respiratory-therapy",
    strengths: ["ABGs", "mechanical ventilation", "waveforms", "ICU respiratory escalation"],
    remainingGaps: ["interactive ventilator visuals", "advanced simulation UI"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 100, assessmentReadiness: 100, simulationReadiness: 98, remediationReadiness: 100 },
  },
  {
    professionKey: "pharmacy-tech",
    label: "Pharmacy Technician",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "pharmacy-technician",
    strengths: ["calculations", "Top 200 drugs", "medication safety", "law", "compounding"],
    remainingGaps: ["interactive calculation drills"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "mlt",
    label: "MLT / MLS",
    percentComplete: 98,
    status: "near_complete",
    dedicatedCatalogFile: "medical-laboratory-technology",
    strengths: ["specimen integrity", "hematology", "chemistry", "microbiology", "transfusion", "QC"],
    remainingGaps: ["advanced morphology visuals", "interactive lab-result simulations"],
    domains: { coreCurriculum: 99, dedicatedCatalog: 100, seoCoverage: 98, assessmentReadiness: 98, simulationReadiness: 95, remediationReadiness: 98 },
  },
  {
    professionKey: "imaging",
    label: "Imaging / Radiography",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "medical-imaging",
    strengths: ["ALARA", "positioning", "contrast safety", "modalities", "image quality"],
    remainingGaps: ["image interpretation visuals", "modality-specific simulations"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "sonography",
    label: "Sonography",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "sonography",
    strengths: ["ultrasound physics", "Doppler", "OB/GYN", "vascular", "small parts"],
    remainingGaps: ["interactive probe-position visuals", "image bank expansion"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "emt",
    label: "EMT",
    percentComplete: 98,
    status: "near_complete",
    dedicatedCatalogFile: "emergency-medical-services",
    strengths: ["scene safety", "primary assessment", "airway", "shock", "trauma"],
    remainingGaps: ["timed scenario engine", "pediatric drill expansion"],
    domains: { coreCurriculum: 99, dedicatedCatalog: 100, seoCoverage: 98, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 98 },
  },
  {
    professionKey: "paramedic",
    label: "Paramedic",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "emergency-medical-services",
    strengths: ["cardiology", "trauma", "airway", "transport decisions", "shock"],
    remainingGaps: ["ACLS-style interactive cases", "medication protocol simulator"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 97, remediationReadiness: 99 },
  },
  {
    professionKey: "medical-assistant",
    label: "Medical Assistant",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "medical-assistant",
    strengths: ["rooming", "vitals", "infection control", "procedures", "medication safety", "admin triage"],
    remainingGaps: ["clinic workflow simulations", "telehealth branch cases"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "dental-hygiene",
    label: "Dental Hygiene",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "dental-hygiene",
    strengths: ["periodontology", "instrumentation", "radiography", "prevention", "ethics", "emergencies"],
    remainingGaps: ["periodontal charting simulator", "radiograph visual bank"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "dental-assistant",
    label: "Dental Assistant",
    percentComplete: 98,
    status: "near_complete",
    strengths: ["chairside assisting", "sterilization", "radiography support", "materials", "procedure setup"],
    remainingGaps: ["dedicated catalog shard", "instrument-transfer simulation"],
    domains: { coreCurriculum: 98, dedicatedCatalog: 92, seoCoverage: 98, assessmentReadiness: 98, simulationReadiness: 94, remediationReadiness: 98 },
  },
  {
    professionKey: "physiotherapy",
    label: "Physiotherapy",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "physiotherapy-rehab",
    strengths: ["movement assessment", "therapeutic exercise", "gait", "neuro rehab", "cardiopulmonary rehab"],
    remainingGaps: ["exercise-video media", "return-to-sport simulations"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 97, remediationReadiness: 99 },
  },
  {
    professionKey: "pta",
    label: "Physical Therapist Assistant",
    percentComplete: 97,
    status: "near_complete",
    dedicatedCatalogFile: "physiotherapy-rehab",
    strengths: ["gait", "transfers", "exercise progression", "documentation", "scope"],
    remainingGaps: ["PTA-specific route copy", "skills-check simulations"],
    domains: { coreCurriculum: 98, dedicatedCatalog: 100, seoCoverage: 96, assessmentReadiness: 98, simulationReadiness: 94, remediationReadiness: 97 },
  },
  {
    professionKey: "occupational-therapy",
    label: "Occupational Therapy",
    percentComplete: 98,
    status: "near_complete",
    dedicatedCatalogFile: "occupational-therapy",
    strengths: ["ADLs", "IADLs", "cognition", "upper extremity", "psychosocial", "pediatrics"],
    remainingGaps: ["home-modification media", "hand-therapy advanced visuals"],
    domains: { coreCurriculum: 99, dedicatedCatalog: 100, seoCoverage: 98, assessmentReadiness: 98, simulationReadiness: 96, remediationReadiness: 98 },
  },
  {
    professionKey: "ota",
    label: "Occupational Therapy Assistant",
    percentComplete: 97,
    status: "near_complete",
    dedicatedCatalogFile: "occupational-therapy",
    strengths: ["ADL intervention", "cueing", "adaptive equipment", "scope", "documentation"],
    remainingGaps: ["OTA-specific route copy", "skills-check simulations"],
    domains: { coreCurriculum: 98, dedicatedCatalog: 100, seoCoverage: 96, assessmentReadiness: 98, simulationReadiness: 94, remediationReadiness: 97 },
  },
  {
    professionKey: "social-work",
    label: "Social Work",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "mental-health-social-work",
    strengths: ["ethics", "advocacy", "social determinants", "mandatory reporting", "risk escalation"],
    remainingGaps: ["case-management simulations", "jurisdiction-specific law overlays"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "psychotherapy",
    label: "Psychotherapy",
    percentComplete: 100,
    status: "complete",
    dedicatedCatalogFile: "mental-health-social-work",
    strengths: ["therapeutic communication", "trauma-informed care", "risk assessment", "crisis intervention", "boundaries"],
    remainingGaps: ["modality-specific advanced case library"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 100, assessmentReadiness: 100, simulationReadiness: 98, remediationReadiness: 100 },
  },
  {
    professionKey: "mental-health-addictions",
    label: "Mental Health & Addictions",
    percentComplete: 100,
    status: "complete",
    dedicatedCatalogFile: "mental-health-social-work",
    strengths: ["suicide risk", "harm reduction", "withdrawal", "de-escalation", "trauma-informed care"],
    remainingGaps: ["live branching crisis simulator"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 100, assessmentReadiness: 100, simulationReadiness: 98, remediationReadiness: 100 },
  },
  {
    professionKey: "psw-hca",
    label: "PSW / HCA / CCA",
    percentComplete: 97,
    status: "near_complete",
    strengths: ["mobility", "hygiene", "dementia care", "palliative support", "reporting"],
    remainingGaps: ["dedicated catalog shard", "home-care scenario library"],
    domains: { coreCurriculum: 98, dedicatedCatalog: 92, seoCoverage: 97, assessmentReadiness: 97, simulationReadiness: 94, remediationReadiness: 97 },
  },
  {
    professionKey: "community-health-worker",
    label: "Community Health Worker",
    percentComplete: 99,
    status: "near_complete",
    strengths: ["outreach", "public health", "screening", "social determinants", "prevention"],
    remainingGaps: ["dedicated catalog shard", "outbreak-response simulations"],
    domains: { coreCurriculum: 99, dedicatedCatalog: 94, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "dietetic-technician",
    label: "Dietetic Technician",
    percentComplete: 99,
    status: "near_complete",
    dedicatedCatalogFile: "dietetic-technician",
    strengths: ["nutrition assessment", "MNT support", "food safety", "teach-back", "lifecycle nutrition"],
    remainingGaps: ["interactive menu-building tools", "nutrition calculation drills"],
    domains: { coreCurriculum: 100, dedicatedCatalog: 100, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
  {
    professionKey: "lab-assistant",
    label: "Lab Assistant",
    percentComplete: 99,
    status: "near_complete",
    strengths: ["specimen collection", "pre-analytical errors", "infection control", "POCT", "chain of custody"],
    remainingGaps: ["dedicated catalog shard", "phlebotomy visual simulator"],
    domains: { coreCurriculum: 99, dedicatedCatalog: 94, seoCoverage: 99, assessmentReadiness: 99, simulationReadiness: 96, remediationReadiness: 99 },
  },
];

export function getAlliedReadinessByProfessionKey(professionKey: string): AlliedReadinessEntry | undefined {
  return ALLIED_READINESS_MANIFEST.find((entry) => entry.professionKey === professionKey);
}

export function getAlliedReadinessAverage(): number {
  const total = ALLIED_READINESS_MANIFEST.reduce((sum, entry) => sum + entry.percentComplete, 0);
  return Math.round(total / ALLIED_READINESS_MANIFEST.length);
}

export function listAlliedReadinessBelow(threshold: number): AlliedReadinessEntry[] {
  return ALLIED_READINESS_MANIFEST.filter((entry) => entry.percentComplete < threshold).sort(
    (a, b) => a.percentComplete - b.percentComplete,
  );
}
