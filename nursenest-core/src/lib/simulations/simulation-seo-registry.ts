/**
 * Clinical Simulation + NGN / OSCE / virtual patient — SEO + learning registry (single source of truth).
 *
 * Planned marketing URLs under `/clinical-simulation` (post-Figma). Do not sitemap until `status === "published"`.
 * Free vs premium is **layered access**; entitlements stay server-enforced — this registry documents intent only.
 */

export type SimulationSeoId =
  | "nursing-simulation-cases"
  | "ngn-clinical-judgment-scenarios"
  | "nclex-case-studies"
  | "osce-practice-scenarios"
  | "clinical-decision-making-simulations"
  | "virtual-patient-cases"
  | "next-gen-nclex-scenarios";

export type SimulationScenarioType =
  | "branching_clinical"
  | "ngn_judgment"
  | "nclex_case_study"
  | "osce_station"
  | "decision_simulation"
  | "virtual_patient"
  | "next_gen_nclex";

export type SimulationSpecialty =
  | "med_surg"
  | "icu"
  | "emergency"
  | "cardiac"
  | "respiratory"
  | "pediatric"
  | "maternal_newborn"
  | "psychiatric"
  | "electrolyte"
  | "endocrine"
  | "sepsis"
  | "renal"
  | "trauma"
  | "burns"
  | "general";

export type ExamRelevanceTag =
  | "nclex_rn"
  | "nclex_pn"
  | "np"
  | "new_grad"
  | "clinical_practice";

export type SimulationSeoStatus = "figma_pending" | "draft" | "published";

export type SimulationSchemaProfile = {
  faqEligible: boolean;
  learningResourceEligible: boolean;
  /** BreadcrumbList + FAQ where reviewed */
  breadcrumbEligible: boolean;
};

export type SimulationSegmentation = {
  freeHighlights: string[];
  premiumHighlights: string[];
};

export type SimulationCapabilityFlags = {
  /** Bowtie, matrix, SATA, drag/drop, trend, prioritization (editorial — actual item bank elsewhere) */
  ngnModalities: readonly string[];
  /** Stations, rubrics, handoff, escalation */
  osceFeatures: readonly string[];
  branching: boolean;
  adaptiveDifficulty: boolean;
  dynamicVitals: boolean;
};

export type SimulationRelatedLinks = {
  lessonSlugs: string[];
  topicSlugs: string[];
  appToolHrefs: readonly string[];
  /** `/modules/*`, planned `/clinical-*` hubs, or other stable marketing targets */
  marketingHrefs: readonly string[];
};

export type SimulationSeoEntry = {
  id: SimulationSeoId;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  scenarioTypes: SimulationScenarioType[];
  specialties: SimulationSpecialty[];
  capabilities: SimulationCapabilityFlags;
  segmentation: SimulationSegmentation;
  examRelevance: ExamRelevanceTag[];
  related: SimulationRelatedLinks;
  schema: SimulationSchemaProfile;
  status: SimulationSeoStatus;
  targetQueries: string[];
};

export const SIMULATION_SEO_HUB_PATH = "/clinical-simulation" as const;

export function simulationSeoPagePath(slug: string): string {
  const s = slug.trim();
  if (!s || s.includes("..")) return SIMULATION_SEO_HUB_PATH;
  return `${SIMULATION_SEO_HUB_PATH}/${encodeURIComponent(s)}`;
}

export function isSimulationSeoIndexable(entry: SimulationSeoEntry): boolean {
  return entry.status === "published";
}

export function simulationSeoRobots(entry: SimulationSeoEntry): "index,follow" | "noindex,follow" {
  return isSimulationSeoIndexable(entry) ? "index,follow" : "noindex,follow";
}

export const DEFAULT_SIMULATION_PATHWAY_ID = "us-rn-nclex-rn" as const;

const SCENARIOS_APP = "/app/clinical-scenarios";
const PRACTICE_TESTS = "/app/practice-tests";
const QUESTIONS = "/app/questions";
const FLASHCARDS = "/app/flashcards";
const LABS = "/app/labs";
const REPORT = "/app/account/report";
const MED_CALC = "/app/med-calculations";
const CLINICAL_SKILLS = "/app/clinical-skills";
const INTERPRETATION_HUB = "/clinical-interpretation";
const ECG_MODULE = "/modules/ecg";
const LAB_VALUES_MODULE = "/modules/lab-values";

export const SIMULATION_SEO_REGISTRY: readonly SimulationSeoEntry[] = [
  {
    id: "nursing-simulation-cases",
    slug: "nursing-simulation-cases",
    seoTitle: "Nursing Simulation Cases | Clinical Judgment & Interactive Patient Scenarios",
    metaDescription:
      "Practice premium nursing simulation cases with branching decisions, safety prioritization, and realistic clinical judgment workflows — mapped to lessons, practice, and adaptive study loops.",
    h1: "Nursing Simulation Cases",
    scenarioTypes: ["branching_clinical", "virtual_patient", "decision_simulation"],
    specialties: ["med_surg", "icu", "emergency", "general"],
    capabilities: {
      ngnModalities: ["prioritization", "matrix", "sata"],
      osceFeatures: ["assessment_workflow"],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: true,
    },
    segmentation: {
      freeHighlights: [
        "Overview scenarios with authentic nursing judgment framing",
        "Partial cases and preview branches with limited rationales",
        "Introductory prioritization and safety examples",
        "Educational walkthroughs of decision points",
      ],
      premiumHighlights: [
        "Full branching with evolving patient states and deterioration logic",
        "Adaptive difficulty and remediation pathways",
        "Telemetry and lab trend integration where clinically wired",
        "Report-card and weak-area targeting across study surfaces",
      ],
    },
    examRelevance: ["nclex_rn", "nclex_pn", "new_grad"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["prioritization", "fluids-electrolytes"],
      appToolHrefs: [SCENARIOS_APP, PRACTICE_TESTS, QUESTIONS, FLASHCARDS, REPORT],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["nursing simulation", "clinical simulation", "nursing simulation cases", "patient care simulation"],
  },
  {
    id: "ngn-clinical-judgment-scenarios",
    slug: "ngn-clinical-judgment-scenarios",
    seoTitle: "NGN Clinical Judgment Scenarios | Next Gen NCLEX-Style Case Practice",
    metaDescription:
      "Train clinical judgment with NGN-style scenarios: bowtie, matrix, trends, and prioritization — connected to NurseNest practice, CAT-aligned drills, and remediation — without shallow quiz spam.",
    h1: "NGN Clinical Judgment Scenarios",
    scenarioTypes: ["ngn_judgment", "branching_clinical"],
    specialties: ["cardiac", "respiratory", "electrolyte", "sepsis", "renal", "general"],
    capabilities: {
      ngnModalities: ["bowtie", "matrix", "trend", "sata", "drag_drop", "cloze", "prioritization"],
      osceFeatures: [],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: true,
    },
    segmentation: {
      freeHighlights: [
        "Sample NGN interactions and introductory judgment stems",
        "Limited rationales with explicit distractor logic",
        "Beginner clinical judgment walkthroughs",
        "Preview difficulty ladder",
      ],
      premiumHighlights: [
        "Full NGN case studies with evolving states",
        "Advanced drag/drop and matrix mastery tracks",
        "CAT-linked simulation sessions and analytics",
        "Weak-area remediation tied to report cards",
      ],
    },
    examRelevance: ["nclex_rn", "nclex_pn"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["prioritization", "nclex-nursing-priorities-safety"],
      appToolHrefs: [PRACTICE_TESTS, QUESTIONS, SCENARIOS_APP, FLASHCARDS, REPORT],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["NGN scenarios", "clinical judgment nursing", "next gen nclex scenarios", "NCLEX clinical judgment"],
  },
  {
    id: "nclex-case-studies",
    slug: "nclex-case-studies",
    seoTitle: "NCLEX Case Studies | Integrated Scenarios, Rationales & Prioritization",
    metaDescription:
      "Work through NCLEX-oriented case studies with integrated lessons, prioritization practice, and safety-focused rationales — progressive complexity without isolated trivia drills.",
    h1: "NCLEX Case Studies",
    scenarioTypes: ["nclex_case_study", "branching_clinical"],
    specialties: ["med_surg", "maternal_newborn", "pediatric", "psychiatric", "general"],
    capabilities: {
      ngnModalities: ["prioritization", "sata", "matrix"],
      osceFeatures: [],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: false,
    },
    segmentation: {
      freeHighlights: [
        "Introductory case stems with clear learning objectives",
        "Partial case arcs with visible rationales",
        "Delegation and safety preview items",
        "Linked lesson previews",
      ],
      premiumHighlights: [
        "Full progressive case libraries with integrated remediation",
        "Delegation and prioritization mastery circuits",
        "CAT-adjacent timed sets where product wiring allows",
        "Cross-links to flashcards and topic drills",
      ],
    },
    examRelevance: ["nclex_rn", "nclex_pn"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["prioritization", "pharmacology"],
      appToolHrefs: [PRACTICE_TESTS, QUESTIONS, FLASHCARDS, REPORT],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["NCLEX case studies", "nursing case studies NCLEX", "prioritization cases"],
  },
  {
    id: "osce-practice-scenarios",
    slug: "osce-practice-scenarios",
    seoTitle: "OSCE Practice Scenarios | Stations, Communication & Clinical Skills",
    metaDescription:
      "Structured OSCE-style practice: timed stations, assessment and intervention workflows, communication scoring, and escalation judgment — aligned with NurseNest clinical skills and scenarios.",
    h1: "OSCE Practice Scenarios",
    scenarioTypes: ["osce_station"],
    specialties: ["emergency", "med_surg", "maternal_newborn", "psychiatric", "general"],
    capabilities: {
      ngnModalities: [],
      osceFeatures: ["timed_stations", "communication", "rubric", "handoff", "escalation"],
      branching: true,
      adaptiveDifficulty: false,
      dynamicVitals: false,
    },
    segmentation: {
      freeHighlights: [
        "Basic station previews and structured checklists",
        "Introductory communication and safety framing",
        "Limited scoring visibility",
        "Sample rubric dimensions",
      ],
      premiumHighlights: [
        "Full timed circuits with rubric scoring",
        "Handoff and escalation pathways",
        "Advanced assessment workflows",
        "Integration with clinical skills tracking where enabled",
      ],
    },
    examRelevance: ["nclex_rn", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["prioritization"],
      appToolHrefs: [CLINICAL_SKILLS, SCENARIOS_APP, PRACTICE_TESTS, REPORT],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["OSCE practice", "nursing OSCE scenarios", "clinical skills stations"],
  },
  {
    id: "clinical-decision-making-simulations",
    slug: "clinical-decision-making-simulations",
    seoTitle: "Clinical Decision-Making Simulations | Triage, Rapid Response & Prioritization",
    metaDescription:
      "Simulate triage, rapid response, shock, respiratory distress, sepsis, and electrolyte emergencies with branching consequences — tied to interpretation tools, labs, and remediation.",
    h1: "Clinical Decision-Making Simulations",
    scenarioTypes: ["decision_simulation", "branching_clinical"],
    specialties: ["emergency", "icu", "cardiac", "respiratory", "electrolyte", "sepsis"],
    capabilities: {
      ngnModalities: ["prioritization", "matrix", "trend"],
      osceFeatures: ["escalation"],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: true,
    },
    segmentation: {
      freeHighlights: [
        "Introductory triage and escalation stems",
        "Static vitals summaries for orientation",
        "Simple decision trees with teaching rationales",
        "Preview deterioration cues",
      ],
      premiumHighlights: [
        "Full deterioration/improvement timelines",
        "Dynamic vitals and intervention consequences",
        "Timed rapid-response modes",
        "Linked hemodynamic and telemetry interpretation tracks",
      ],
    },
    examRelevance: ["nclex_rn", "np", "new_grad", "clinical_practice"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["sepsis", "shock", "fluids-electrolytes"],
      appToolHrefs: [SCENARIOS_APP, PRACTICE_TESTS, LABS, MED_CALC, REPORT],
      marketingHrefs: [INTERPRETATION_HUB, ECG_MODULE, LAB_VALUES_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["clinical decision making nursing", "nursing triage simulation", "rapid response simulation"],
  },
  {
    id: "virtual-patient-cases",
    slug: "virtual-patient-cases",
    seoTitle: "Virtual Patient Cases | Branching Care Paths & Clinical Updates",
    metaDescription:
      "Virtual patient cases with labs, imaging cues, medication branches, and ICU progression models — premium adaptive pathways with free previews that show real simulation depth.",
    h1: "Virtual Patient Cases",
    scenarioTypes: ["virtual_patient", "branching_clinical"],
    specialties: ["icu", "cardiac", "respiratory", "renal", "trauma", "burns"],
    capabilities: {
      ngnModalities: ["prioritization", "trend", "drag_drop"],
      osceFeatures: [],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: true,
    },
    segmentation: {
      freeHighlights: [
        "Patient summary and scenario premise previews",
        "Limited branches with teaching checkpoints",
        "Static chart review introductions",
        "Sample medication decision framing",
      ],
      premiumHighlights: [
        "Full branching with labs/imaging updates",
        "ICU progression and discharge pathway arcs",
        "Medication timing and consequence modeling",
        "Integration with interpretation and calculator surfaces",
      ],
    },
    examRelevance: ["nclex_rn", "np", "new_grad"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["fluids-electrolytes", "cardiovascular", "respiratory"],
      appToolHrefs: [SCENARIOS_APP, LABS, MED_CALC, PRACTICE_TESTS, REPORT],
      marketingHrefs: [LAB_VALUES_MODULE, ECG_MODULE],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["virtual patient cases", "nursing virtual patient", "interactive patient simulation"],
  },
  {
    id: "next-gen-nclex-scenarios",
    slug: "next-gen-nclex-scenarios",
    seoTitle: "Next Gen NCLEX Scenarios | NGN Item Practice & Judgment Training",
    metaDescription:
      "Prepare for the Next Gen NCLEX with scenario-based practice: trends, bowtie, matrix, and clinical judgment emphasis — connected to CAT sessions, flashcards, and study analytics.",
    h1: "Next Gen NCLEX Scenarios",
    scenarioTypes: ["next_gen_nclex", "ngn_judgment"],
    specialties: ["general", "med_surg", "cardiac", "respiratory"],
    capabilities: {
      ngnModalities: ["bowtie", "matrix", "trend", "sata", "drag_drop", "cloze", "prioritization"],
      osceFeatures: [],
      branching: true,
      adaptiveDifficulty: true,
      dynamicVitals: true,
    },
    segmentation: {
      freeHighlights: [
        "Representative NGN item previews",
        "Introductory trend and matrix examples",
        "Beginner judgment rationales",
        "Exam relevance orientation",
      ],
      premiumHighlights: [
        "Full adaptive NGN libraries",
        "CAT-linked simulation and analytics",
        "Advanced trend and bowtie mastery",
        "Weak-area targeting across practice and report cards",
      ],
    },
    examRelevance: ["nclex_rn", "nclex_pn"],
    related: {
      lessonSlugs: [],
      topicSlugs: ["prioritization"],
      appToolHrefs: [PRACTICE_TESTS, QUESTIONS, FLASHCARDS, REPORT],
      marketingHrefs: [],
    },
    schema: { faqEligible: true, learningResourceEligible: true, breadcrumbEligible: true },
    status: "figma_pending",
    targetQueries: ["next gen nclex", "NGN practice", "NCLEX scenarios", "clinical judgment NCLEX"],
  },
] as const;

export function getSimulationSeoBySlug(slug: string): SimulationSeoEntry | undefined {
  const key = slug.trim();
  return SIMULATION_SEO_REGISTRY.find((e) => e.slug === key);
}

export function getSimulationSeoById(id: SimulationSeoId): SimulationSeoEntry | undefined {
  return SIMULATION_SEO_REGISTRY.find((e) => e.id === id);
}
