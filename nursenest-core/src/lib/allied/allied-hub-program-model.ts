import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  ALLIED_PROFESSIONS,
  type AlliedProfessionMarketing,
} from "@/lib/allied/allied-professions-registry";
import {
  buildPremiumMarketingModuleCards,
  type PremiumHubModuleKey,
} from "@/lib/marketing/exam-pathway-hub-premium-modules";
import { alliedHubCatSurfaceUnlocked } from "@/lib/marketing/allied-hub-premium-module-policy";

/** US canonical allied pathway id for marketing + inventory (Canada uses `ca-allied-core` for regional SEO). */
export const US_ALLIED_CORE_PATHWAY_ID = "us-allied-core" as const;

/**
 * Product minimums per Allied occupation (enforced in QA reports; wire bounded DB inventory before CI gates).
 * Skills refresher is tracked as a **content** expectation — the public premium grid may surface tools under other keys.
 */
export const ALLIED_MINIMUM_CONTENT_PER_OCCUPATION = {
  lessons: 60,
  flashcards: 300,
  practiceQuestions: 300,
  practiceExamsOrSets: 2,
  catSessionsIfSupported: 1,
  scenarioCaseStudyQuestions: 20,
  skillsRefresherItems: 25,
  labDiagnosticItems: 20,
  medCalculationItems: 20,
  readinessProgressStudyPlanModules: 1,
  weakStrongAreaReportingModules: 1,
} as const;

/** Curated checklist rows for Part 2 “occupation-specific expectations” (not a runtime gate). */
export const ALLIED_OCCUPATION_CONTENT_FOCUS: Record<string, readonly string[]> = {
  mlt: [
    "Labs & diagnostics reasoning",
    "Specimen handling & chain-of-custody",
    "Quality control",
    "Hematology / chemistry / microbiology framing",
    "Transfusion safety awareness",
    "Pre-analytical & analytical error prevention",
  ],
  "lab-assistant": ["Specimen collection", "Pre-analytical handling", "QC awareness", "Safety & escalation"],
  paramedic: [
    "Emergency assessment",
    "Trauma & medical priorities",
    "Airway & ventilation judgment",
    "Field pharmacology & med calculations",
    "ECG only where profession-appropriate (not RN-only depth)",
    "Scenario-heavy prioritization",
  ],
  emt: ["Scene safety", "Primary assessment", "Airway basics", "Transport decisions", "Scope boundaries"],
  respiratory: [
    "Airway & ventilation",
    "ABGs & oxygen therapy",
    "Cardiopulmonary diagnostics",
    "Equipment & escalation",
    "Scenario drills",
  ],
  physiotherapy: ["Anatomy & mobility", "MSK assessment", "Rehab progression", "Safety & red flags", "Case scenarios"],
  pta: ["Therapeutic exercise", "Mobility assistance", "Delegation within PTA scope", "Safety judgment"],
  "occupational-therapy": [
    "Functional assessment",
    "ADLs & occupation-based plans",
    "Cognitive / perceptual screening",
    "Assistive devices & training",
    "Case scenarios",
  ],
  ota: ["Activity analysis", "ADLs", "Safety sequencing", "Documentation support within OTA scope"],
  "social-work": [
    "Ethics & boundaries",
    "Crisis intervention framing",
    "Documentation",
    "Community resources & case management",
    "Scenario questions",
  ],
  psychotherapy: [
    "Therapeutic communication",
    "Ethics & risk assessment",
    "Modalities & formulation",
    "Documentation",
    "Case scenarios",
  ],
  "mental-health-addictions": ["Safety", "De-escalation", "Boundaries", "Documentation", "Community linkage"],
  "psw-hca": [
    "Safety & infection control",
    "ADLs & mobility",
    "Communication with dignity",
    "Documentation & reporting",
    "Care scenarios",
  ],
  "community-health-worker": ["Outreach", "Teaching", "Navigation", "Ethics", "Population-health basics"],
  "pharmacy-tech": ["Calculations", "High-alert meds", "Sterile technique", "Regulatory edges"],
  "medical-assistant": ["Clinical workflows", "Vitals", "Office safety", "Scope & delegation"],
  "dental-assistant": ["Infection control", "Chairside flow", "Radiography basics", "Communication"],
  "dental-hygiene": ["Periodontal assessment", "Prevention teaching", "Radiographic judgment", "Ethics"],
  "dietetic-technician": ["MNT support", "Screening", "Documentation", "Food-service safety"],
  imaging: ["ALARA", "Contrast safety", "Positioning", "Protocol communication"],
  sonography: ["Image optimization", "Safety", "Anatomy correlation", "Handoffs"],
  radiography: ["Positioning", "Contrast safety", "Physics judgment", "Patient communication"],
};

export function listAlliedOccupationsFromRegistry(): AlliedProfessionMarketing[] {
  return [...ALLIED_PROFESSIONS];
}

export type AlliedPremiumModuleMatrix = {
  studyToolKeys: PremiumHubModuleKey[];
  readinessKeys: PremiumHubModuleKey[];
  /** Study-tool cards with `locked: true` after {@link applyAlliedOccupationPremiumModuleLocks}. */
  lockedStudyToolKeys: PremiumHubModuleKey[];
  catMarketingUnlocked: boolean;
};

export function alliedPremiumModuleMatrixForOccupation(
  pathway: ExamPathwayDefinition,
  professionKey: string,
  opts: { clinicalScenariosPublic: boolean; oscePublic: boolean },
): AlliedPremiumModuleMatrix {
  const m = buildPremiumMarketingModuleCards(pathway, {
    clinicalScenariosPublic: opts.clinicalScenariosPublic,
    oscePublic: opts.oscePublic,
    alliedProfessionKey: professionKey,
  });
  return {
    studyToolKeys: m.studyTools.map((c) => c.key),
    readinessKeys: m.readiness.map((c) => c.key),
    lockedStudyToolKeys: m.studyTools.filter((c) => c.locked).map((c) => c.key),
    catMarketingUnlocked: alliedHubCatSurfaceUnlocked(professionKey),
  };
}

export function usAlliedPathwayOrThrow(): ExamPathwayDefinition {
  const p = getExamPathwayById(US_ALLIED_CORE_PATHWAY_ID);
  if (!p) throw new Error(`Missing pathway ${US_ALLIED_CORE_PATHWAY_ID}`);
  return p;
}
