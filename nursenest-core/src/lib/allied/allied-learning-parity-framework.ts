import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { ALLIED_READINESS_MANIFEST } from "@/lib/allied/allied-readiness-manifest";

export const ALLIED_PREMIUM_LAYOUT_REQUIREMENTS = [
  "Theme-Aware Design",
  "Canonical Navigation",
  "Shared Learning Shell",
  "Progress Tracking",
  "Report Cards",
  "Analytics",
  "Subscription Gating",
  "Shared Card Layouts",
  "Accessibility Standards",
] as const;

export const ALLIED_RATIONALE_TEMPLATE_SECTIONS = [
  "Correct Answer",
  "Why It Is Correct",
  "Why The Other Options Are Incorrect",
  "Clinical Application",
  "Exam Strategy",
  "Clinical Pearl",
  "Related Topics",
] as const;

export const ALLIED_MARKETING_SCREENSHOT_REQUIREMENTS = [
  "Question Bank Screenshot",
  "Flashcard Screenshot",
  "Lesson Screenshot",
  "Simulation Screenshot",
  "Clinical Skills Screenshot",
  "Readiness Dashboard Screenshot",
] as const;

export type AlliedLearningParityProfession =
  | "respiratory"
  | "paramedic"
  | "mlt"
  | "occupational-therapy"
  | "physiotherapy"
  | "social-work"
  | "psychotherapy"
  | "psw-hca";

export type AlliedLearningParityProfile = {
  professionKey: AlliedLearningParityProfession;
  label: string;
  hintExample: string;
  clinicalPearlExample: string;
  rationaleFocus: string[];
  simulationExamples: string[];
  clinicalSkills: string[];
  readinessDomains: string[];
};

export const ALLIED_LEARNING_PARITY_PROFILES: AlliedLearningParityProfile[] = [
  {
    professionKey: "respiratory",
    label: "Respiratory Therapy",
    hintExample: "Consider how oxygenation differs from ventilation before choosing the priority action.",
    clinicalPearlExample: "Rising CO2 often appears before oxygen saturation declines.",
    rationaleFocus: ["Ventilation", "Oxygenation", "ABGs", "Ventilator Settings"],
    simulationExamples: ["Ventilator Management", "ABG Interpretation", "Airway Emergencies"],
    clinicalSkills: ["Ventilator Setup", "Suctioning", "Airway Management"],
    readinessDomains: ["Airway Management", "Ventilation", "Oxygenation", "ABG Interpretation"],
  },
  {
    professionKey: "paramedic",
    label: "Paramedicine",
    hintExample: "Prioritize the most immediate life-threatening concern using scene safety and ABCs.",
    clinicalPearlExample: "Scene safety is always the first intervention.",
    rationaleFocus: ["Scene Management", "Prioritization", "Transport Decisions", "Emergency Interventions"],
    simulationExamples: ["Trauma Calls", "Cardiac Arrest", "Pediatric Emergencies"],
    clinicalSkills: ["IV Insertion", "Cardiac Monitoring", "Trauma Assessment"],
    readinessDomains: ["Scene Management", "Trauma Care", "Medical Emergencies", "Cardiac Care"],
  },
  {
    professionKey: "mlt",
    label: "Medical Laboratory Technology",
    hintExample: "Review which laboratory value is most clinically significant and whether it requires urgent communication.",
    clinicalPearlExample: "Critical values require prompt communication regardless of shift timing.",
    rationaleFocus: ["Laboratory Interpretation", "Specimen Handling", "Quality Assurance"],
    simulationExamples: ["Critical Value Reporting", "Specimen Rejection", "Laboratory Troubleshooting"],
    clinicalSkills: ["Specimen Collection", "Quality Control", "Instrument Maintenance"],
    readinessDomains: ["Specimen Integrity", "Lab Interpretation", "Quality Control"],
  },
  {
    professionKey: "physiotherapy",
    label: "Physical Therapy",
    hintExample: "Consider which intervention promotes the greatest functional improvement while respecting safety limits.",
    clinicalPearlExample: "Early mobilization often reduces complications and improves outcomes.",
    rationaleFocus: ["Mobility", "Functional Outcomes", "Rehabilitation Principles"],
    simulationExamples: ["Mobility Assessments", "Fall Prevention", "Stroke Rehabilitation"],
    clinicalSkills: ["Gait Assessment", "Transfer Techniques", "Range Of Motion Assessment"],
    readinessDomains: ["Mobility", "Rehabilitation", "Functional Outcomes"],
  },
  {
    professionKey: "occupational-therapy",
    label: "Occupational Therapy",
    hintExample: "Focus on activities of daily living, independence, and the environment where the task occurs.",
    clinicalPearlExample: "Functional independence is often a more meaningful outcome than strength alone.",
    rationaleFocus: ["Occupational Performance", "Adaptive Strategies", "ADL Optimization"],
    simulationExamples: ["Home Safety", "ADL Planning", "Cognitive Assessment"],
    clinicalSkills: ["Functional Assessment", "Adaptive Equipment", "Cognitive Screening"],
    readinessDomains: ["ADLs", "Cognitive Function", "Adaptive Strategies"],
  },
  {
    professionKey: "social-work",
    label: "Social Work",
    hintExample: "Consider safety, consent, social determinants, and the least restrictive supportive intervention.",
    clinicalPearlExample: "Effective advocacy connects immediate needs with sustainable supports.",
    rationaleFocus: ["Ethics", "Advocacy", "Case Management", "Risk Escalation"],
    simulationExamples: ["Discharge Barriers", "Mandatory Reporting", "Resource Navigation"],
    clinicalSkills: ["Risk Screening", "Support Planning", "Interprofessional Communication"],
    readinessDomains: ["Ethics", "Advocacy", "Risk Assessment", "Case Management"],
  },
  {
    professionKey: "psychotherapy",
    label: "Psychotherapy",
    hintExample: "Focus on therapeutic alliance, risk, boundaries, and the intervention that fits the client's readiness.",
    clinicalPearlExample: "Therapeutic alliance is one of the strongest predictors of psychotherapy outcomes.",
    rationaleFocus: ["Therapeutic Communication", "Risk Assessment", "Boundaries", "Treatment Planning"],
    simulationExamples: ["Crisis Intervention", "Trauma-Informed Response", "Therapeutic Rupture Repair"],
    clinicalSkills: ["Mental Status Assessment", "Safety Planning", "Reflective Listening"],
    readinessDomains: ["Therapeutic Communication", "Risk Assessment", "Ethics", "Treatment Planning"],
  },
  {
    professionKey: "psw-hca",
    label: "Personal Support Worker",
    hintExample: "Think about dignity, safety, reporting changes, and supporting independence within role scope.",
    clinicalPearlExample: "Small changes in baseline function can be the earliest sign that a client is deteriorating.",
    rationaleFocus: ["Personal Care", "Mobility Support", "Dementia Care", "Change Reporting"],
    simulationExamples: ["Home Care Safety", "Falls Prevention", "Dementia Communication"],
    clinicalSkills: ["Safe Transfers", "Hygiene Support", "Observation And Reporting"],
    readinessDomains: ["Personal Care", "Mobility", "Dementia Support", "Safety Reporting"],
  },
] as const;

export function getAlliedLearningParityProfile(professionKey: string): AlliedLearningParityProfile | null {
  return ALLIED_LEARNING_PARITY_PROFILES.find((profile) => profile.professionKey === professionKey) ?? null;
}

export function listMissingAlliedParityProfiles(): string[] {
  const covered = new Set(ALLIED_LEARNING_PARITY_PROFILES.map((profile) => profile.professionKey));
  return ALLIED_PROFESSIONS.filter((profession) => {
    const required = ALLIED_READINESS_MANIFEST.some((entry) => entry.professionKey === profession.professionKey);
    return required && !covered.has(profession.professionKey as AlliedLearningParityProfession);
  }).map((profession) => profession.professionKey);
}

export function buildAlliedRationaleSectionHeadings(): string[] {
  return [...ALLIED_RATIONALE_TEMPLATE_SECTIONS];
}
