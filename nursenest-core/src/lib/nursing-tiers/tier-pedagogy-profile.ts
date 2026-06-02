import type { TierCode } from "@prisma/client";
import type { RoleTrackSlug } from "@/lib/exam-pathways/types";
import type { AlliedCareerKey } from "@/lib/pricing/display-catalog";

export type HealthcareProgramTier = "RPN" | "RN" | "NP" | "ALLIED";
export type NursingProgramTier = Exclude<HealthcareProgramTier, "ALLIED">;
export type HintDepth = "foundational" | "clinical-judgment" | "advanced-clinical-reasoning";
export type RationaleDepth =
  | "bedside-safety"
  | "integrated-rn-judgment"
  | "advanced-diagnostic-management"
  | "profession-specific-clinical-reasoning";

export type TierPedagogyProfile = {
  tier: HealthcareProgramTier;
  uiPattern: "rn-reference";
  scopeSummary: string;
  questionComplexity: "foundational" | "moderate-high" | "advanced";
  hintDepth: HintDepth;
  rationaleDepth: RationaleDepth;
  flashcardDepth: HintDepth;
  supportedInteractions: readonly [
    "multiple-choice",
    "select-all-that-apply",
    "case-study",
    "prioritization",
    "medication-safety",
    "professional-ethics",
    "scope-of-practice",
    "patient-communication",
    "documentation",
    "interprofessional-collaboration",
    "emergency-recognition",
    "diagnostic-interpretation",
    "progressive-hints",
    "expandable-rationales",
    "flashcard-review",
    "practice-exam",
  ];
  contentPriorities: readonly string[];
  avoid: readonly string[];
  hintProgression: readonly [string, string, string];
  rationaleSections: readonly [
    "why-correct",
    "why-incorrect-options-are-tempting",
    "clinical-reasoning",
    "safety-implications",
    "common-exam-traps",
    "tier-specific-teaching",
  ];
};

export type AlliedOccupationPedagogyProfile = {
  careerKey: AlliedCareerKey | "general";
  professionKeys: readonly string[];
  displayName: string;
  scopeSummary: string;
  reasoningFocus: readonly string[];
  safetyPriorities: readonly string[];
  commonQuestionContexts: readonly string[];
};

const SHARED_INTERACTIONS = [
  "multiple-choice",
  "select-all-that-apply",
  "case-study",
  "prioritization",
  "medication-safety",
  "professional-ethics",
  "scope-of-practice",
  "patient-communication",
  "documentation",
  "interprofessional-collaboration",
  "emergency-recognition",
  "diagnostic-interpretation",
  "progressive-hints",
  "expandable-rationales",
  "flashcard-review",
  "practice-exam",
] as const;

const SHARED_RATIONALE_SECTIONS = [
  "why-correct",
  "why-incorrect-options-are-tempting",
  "clinical-reasoning",
  "safety-implications",
  "common-exam-traps",
  "tier-specific-teaching",
] as const;

export const ALLIED_OCCUPATION_PEDAGOGY_PROFILES: readonly AlliedOccupationPedagogyProfile[] = [
  {
    careerKey: "rrt",
    professionKeys: ["respiratory", "respiratory-therapy", "ecg-tech", "cardiology-technologist", "anesthesia-assistant", "perfusionist"],
    displayName: "Respiratory and cardiopulmonary care",
    scopeSummary: "Airway, oxygenation, ventilation support, cardiopulmonary testing, and escalation within credentialed allied scope.",
    reasoningFocus: ["respiratory assessment", "oxygen delivery", "airway safety", "cardiopulmonary monitoring", "equipment checks"],
    safetyPriorities: ["recognize respiratory deterioration", "verify devices and settings", "communicate urgent changes", "follow protocol boundaries"],
    commonQuestionContexts: ["ABG interpretation", "oxygen therapy", "airway emergencies", "ECG workflow", "perioperative support"],
  },
  {
    careerKey: "paramedic",
    professionKeys: ["paramedic", "emt"],
    displayName: "Prehospital and emergency response",
    scopeSummary: "Scene safety, rapid assessment, triage, transport decisions, protocol-based emergency care, and communication.",
    reasoningFocus: ["primary survey", "triage", "protocol selection", "transport priority", "handoff communication"],
    safetyPriorities: ["scene safety", "airway and circulation threats", "rapid escalation", "medication and equipment checks"],
    commonQuestionContexts: ["trauma", "cardiac symptoms", "respiratory distress", "shock recognition", "mass casualty basics"],
  },
  {
    careerKey: "mlt",
    professionKeys: ["mlt", "medical-laboratory-technology", "lab-assistant", "clinical-research"],
    displayName: "Laboratory and research diagnostics",
    scopeSummary: "Specimen integrity, quality control, lab safety, result validity, and communication of critical findings.",
    reasoningFocus: ["pre-analytic errors", "quality control", "specimen handling", "critical values", "infection prevention"],
    safetyPriorities: ["patient identification", "biohazard safety", "timely critical-result communication", "documentation accuracy"],
    commonQuestionContexts: ["hematology", "chemistry", "microbiology", "phlebotomy", "research protocol safety"],
  },
  {
    careerKey: "imaging",
    professionKeys: ["imaging", "medical-radiation-technology", "radiography", "sonography", "diagnostic-sonography", "dental-hygiene", "dental-assistant"],
    displayName: "Imaging and procedural diagnostics",
    scopeSummary: "Patient positioning, radiation and procedure safety, image quality, contraindication checks, and patient communication.",
    reasoningFocus: ["modality safety", "positioning", "contraindications", "image quality", "patient preparation"],
    safetyPriorities: ["identity and consent checks", "radiation protection", "contrast/allergy screening", "urgent finding escalation"],
    commonQuestionContexts: ["x-ray workflow", "sonography preparation", "dental hygiene safety", "contrast precautions", "infection control"],
  },
  {
    careerKey: "ota_pta",
    professionKeys: ["ota", "pta", "occupational-therapy", "physiotherapy", "physical-therapy", "speech-language-pathology"],
    displayName: "Therapy, rehabilitation, and communication",
    scopeSummary: "Functional assessment, safe mobility, ADLs, communication support, progression, and documentation within therapy scope.",
    reasoningFocus: ["functional goals", "mobility safety", "activity tolerance", "communication strategies", "progression and regression cues"],
    safetyPriorities: ["fall prevention", "safe transfers", "aspiration or communication barriers", "scope-appropriate escalation"],
    commonQuestionContexts: ["rehab progression", "ADL support", "speech/swallow screening cues", "assistive devices", "home safety"],
  },
  {
    careerKey: "pharmtech",
    professionKeys: ["pharmtech", "pharmacy-technician", "dietetic-technician", "dietetics", "nutrition"],
    displayName: "Medication and nutrition support",
    scopeSummary: "Medication safety support, calculations/checks, inventory, patient communication, nutrition screening, and escalation.",
    reasoningFocus: ["medication safety", "dose and label checks", "drug-food considerations", "nutrition risk cues", "workflow accuracy"],
    safetyPriorities: ["high-alert medication checks", "allergy verification", "documentation accuracy", "refer clinical decisions appropriately"],
    commonQuestionContexts: ["prescription processing", "insulin and anticoagulant safety", "enteral nutrition basics", "patient counseling boundaries"],
  },
  {
    careerKey: "socialwork",
    professionKeys: ["socialwork", "social-work", "psw-hca", "personal-support-worker", "health-care-aide", "community-health-worker", "mental-health-addictions", "medical-office-assistant", "health-information-management"],
    displayName: "Support, community, administration, and health information",
    scopeSummary: "Patient support, communication, documentation, privacy, psychosocial needs, care coordination, and reporting.",
    reasoningFocus: ["communication", "privacy", "safety reporting", "supportive care", "care coordination"],
    safetyPriorities: ["abuse or neglect reporting", "falls and infection prevention", "confidentiality", "timely escalation"],
    commonQuestionContexts: ["PSW/HCA care", "social work scenarios", "medical office workflow", "health information privacy", "community support"],
  },
  {
    careerKey: "general",
    professionKeys: ["allied", "allied-health"],
    displayName: "Allied Health",
    scopeSummary: "Profession-specific allied practice using shared safety, communication, documentation, and scope reasoning.",
    reasoningFocus: ["scope of practice", "patient safety", "communication", "documentation", "interprofessional collaboration"],
    safetyPriorities: ["recognize deterioration", "stay within scope", "document clearly", "escalate urgent concerns"],
    commonQuestionContexts: ["safety", "ethics", "documentation", "communication", "team-based care"],
  },
] as const;

export const TIER_PEDAGOGY_PROFILES: Record<HealthcareProgramTier, TierPedagogyProfile> = {
  RPN: {
    tier: "RPN",
    uiPattern: "rn-reference",
    scopeSummary: "Stable and predictable clients, foundational bedside care, recognition, reporting, and safety.",
    questionComplexity: "foundational",
    hintDepth: "foundational",
    rationaleDepth: "bedside-safety",
    flashcardDepth: "foundational",
    supportedInteractions: SHARED_INTERACTIONS,
    contentPriorities: [
      "stable and predictable patients",
      "basic assessment",
      "standard nursing interventions",
      "recognition and reporting",
      "safety-focused bedside care",
      "expected vs unexpected findings",
    ],
    avoid: [
      "independent diagnosis",
      "advanced pharmacologic management",
      "unstable multi-system decision ownership",
      "high-acuity specialty procedures",
    ],
    hintProgression: [
      "Broad concept: identify the patient safety issue or expected care pattern.",
      "Focused reasoning: compare expected findings with what should be reported.",
      "Near-answer support: choose the safest bedside action within practical-nurse scope.",
    ],
    rationaleSections: SHARED_RATIONALE_SECTIONS,
  },
  RN: {
    tier: "RN",
    uiPattern: "rn-reference",
    scopeSummary: "Complex prioritization, delegation, trends, care planning, pathophysiology, and clinical judgment.",
    questionComplexity: "moderate-high",
    hintDepth: "clinical-judgment",
    rationaleDepth: "integrated-rn-judgment",
    flashcardDepth: "clinical-judgment",
    supportedInteractions: SHARED_INTERACTIONS,
    contentPriorities: [
      "patient safety",
      "prioritization",
      "delegation",
      "recognition of deterioration",
      "nursing interventions",
      "education",
      "pharmacology safety",
      "expected vs unexpected findings",
      "foundational clinical judgment",
    ],
    avoid: [
      "highly specialized ICU management",
      "advanced ventilator management",
      "physician-level decision-making",
      "respiratory therapist-specific interventions",
      "rare specialty procedures",
      "obscure disease states",
      "overly technical lab interpretation beyond NCLEX scope",
    ],
    hintProgression: [
      "Broad concept: identify the major clinical priority or safety risk.",
      "Focused reasoning: connect the cues to ABCs, trends, delegation, or nursing process.",
      "Near-answer support: choose the intervention that prevents harm or addresses deterioration first.",
    ],
    rationaleSections: SHARED_RATIONALE_SECTIONS,
  },
  NP: {
    tier: "NP",
    uiPattern: "rn-reference",
    scopeSummary: "Advanced assessment, differential diagnosis, diagnostics, pharmacologic decisions, and management plans.",
    questionComplexity: "advanced",
    hintDepth: "advanced-clinical-reasoning",
    rationaleDepth: "advanced-diagnostic-management",
    flashcardDepth: "advanced-clinical-reasoning",
    supportedInteractions: SHARED_INTERACTIONS,
    contentPriorities: [
      "differential diagnoses",
      "advanced assessment",
      "diagnostic interpretation",
      "pharmacologic decision-making",
      "independent management",
      "evidence-based treatment plans",
      "advanced complications",
    ],
    avoid: [
      "RN-only delegation framing as the final endpoint",
      "superficial recall without diagnostic reasoning",
      "treatment plans without monitoring or follow-up logic",
    ],
    hintProgression: [
      "Broad concept: identify the diagnostic or management category being tested.",
      "Focused reasoning: narrow the differential using risk, exam findings, diagnostics, and contraindications.",
      "Near-answer support: choose the evidence-aligned management step with appropriate follow-up or escalation.",
    ],
    rationaleSections: SHARED_RATIONALE_SECTIONS,
  },
  ALLIED: {
    tier: "ALLIED",
    uiPattern: "rn-reference",
    scopeSummary: "Profession-specific allied health practice with shared safety, scope, communication, and clinical reasoning structure.",
    questionComplexity: "moderate-high",
    hintDepth: "clinical-judgment",
    rationaleDepth: "profession-specific-clinical-reasoning",
    flashcardDepth: "clinical-judgment",
    supportedInteractions: SHARED_INTERACTIONS,
    contentPriorities: [
      "profession-specific terminology",
      "scope-of-practice reasoning",
      "patient communication",
      "documentation",
      "diagnostic interpretation where applicable",
      "emergency recognition",
      "interprofessional collaboration",
      "safety priorities",
      "real-world workflow judgment",
    ],
    avoid: [
      "RN-only care planning as the default frame",
      "generic healthcare trivia",
      "scope-inappropriate diagnosis or treatment ownership",
      "profession-agnostic explanations that ignore real workflow",
    ],
    hintProgression: [
      "Broad concept: identify the profession-specific safety, workflow, or communication issue.",
      "Focused reasoning: connect the cues to scope, protocol, diagnostic logic, or interprofessional escalation.",
      "Near-answer support: choose the safest action that matches the allied role and real clinical workflow.",
    ],
    rationaleSections: SHARED_RATIONALE_SECTIONS,
  },
};

export function resolveNursingProgramTier(input: {
  roleTrack?: RoleTrackSlug | string | null;
  stripeTier?: TierCode | string | null;
}): HealthcareProgramTier {
  const role = String(input.roleTrack ?? "").trim().toLowerCase();
  const tier = String(input.stripeTier ?? "").trim().toUpperCase();

  if (role === "allied" || tier === "ALLIED") return "ALLIED";
  if (role === "np" || tier === "NP") return "NP";
  if (role === "rpn" || role === "lpn" || tier === "RPN" || tier === "LVN_LPN") return "RPN";
  return "RN";
}

export function resolveTierPedagogyProfile(input: {
  roleTrack?: RoleTrackSlug | string | null;
  stripeTier?: TierCode | string | null;
}): TierPedagogyProfile {
  return TIER_PEDAGOGY_PROFILES[resolveNursingProgramTier(input)];
}

export function resolveAlliedOccupationPedagogyProfile(
  professionKeyOrCareer: AlliedCareerKey | string | null | undefined,
): AlliedOccupationPedagogyProfile {
  const key = String(professionKeyOrCareer ?? "").trim().toLowerCase();
  if (!key) {
    return ALLIED_OCCUPATION_PEDAGOGY_PROFILES.find((p) => p.careerKey === "general")!;
  }
  return (
    ALLIED_OCCUPATION_PEDAGOGY_PROFILES.find(
      (profile) => profile.careerKey === key || profile.professionKeys.includes(key),
    ) ?? ALLIED_OCCUPATION_PEDAGOGY_PROFILES.find((p) => p.careerKey === "general")!
  );
}
