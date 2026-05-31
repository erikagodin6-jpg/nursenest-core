export type NewZealandRnBlueprintDomain = {
  readonly domain: string;
  readonly lessons: number;
  readonly questions: number;
  readonly flashcards: number;
  readonly simulations: number;
};

export const NEW_ZEALAND_RN_PATHWAY_READINESS_METADATA = {
  country: "New Zealand",
  countryCode: "NZ",
  regulator: "Nursing Council of New Zealand (NCNZ)",
  registrationPathway: "NCNZ RN Registration",
  profession: "Registered Nurse",
  globalRegistryId: "global-nz-rn-ncnz",
  pathwayId: null,
  internalHub: "/admin/global-expansion/hubs/nz/rn",
  reservedPublicRoute: "/nz/rn",
  visibility: "hidden",
  publicationStatus: "draft",
  indexing: "noindex",
} as const;

export const NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS = {
  lessons: 500,
  flashcards: 7_000,
  questions: 4_000,
  simulations: 120,
  ngnStyleCases: 200,
  bowties: 125,
  matrixCases: 125,
} as const;

export const NEW_ZEALAND_RN_CORE_BLUEPRINT_DOMAINS: readonly NewZealandRnBlueprintDomain[] = [
  { domain: "NCNZ Competencies", lessons: 60, questions: 400, flashcards: 600, simulations: 10 },
  { domain: "Professional Responsibility", lessons: 50, questions: 300, flashcards: 500, simulations: 8 },
  { domain: "Te Tiriti o Waitangi", lessons: 60, questions: 450, flashcards: 700, simulations: 12 },
  { domain: "Cultural Safety", lessons: 60, questions: 450, flashcards: 700, simulations: 12 },
  { domain: "Interpersonal Relationships", lessons: 40, questions: 250, flashcards: 400, simulations: 8 },
  { domain: "Interprofessional Practice", lessons: 35, questions: 225, flashcards: 350, simulations: 8 },
  { domain: "Medication Administration", lessons: 70, questions: 550, flashcards: 900, simulations: 15 },
  { domain: "Clinical Assessment", lessons: 70, questions: 550, flashcards: 850, simulations: 15 },
  { domain: "Community and Primary Care", lessons: 45, questions: 300, flashcards: 500, simulations: 10 },
  { domain: "Adult Health", lessons: 70, questions: 500, flashcards: 850, simulations: 12 },
  { domain: "Mental Health", lessons: 45, questions: 300, flashcards: 500, simulations: 6 },
  { domain: "Documentation and Communication", lessons: 25, questions: 175, flashcards: 300, simulations: 4 },
] as const;

export const NEW_ZEALAND_RN_NCNZ_COMPETENCY_MAPPING = [
  "Professional responsibility",
  "Management of nursing care",
  "Interpersonal relationships",
  "Interprofessional healthcare and quality improvement",
] as const;

export const NEW_ZEALAND_RN_COMPETENCY_METADATA_CONTENT_TYPES = [
  "Lessons",
  "Questions",
  "Flashcards",
  "Simulations",
  "Practice Exams",
  "CAT Exams",
] as const;

export const NEW_ZEALAND_RN_TE_TIRITI_REQUIREMENTS = [
  "Partnership",
  "Participation",
  "Protection",
  "Equity",
  "Maori health outcomes",
  "Health system obligations",
  "Culturally safe care",
] as const;

export const NEW_ZEALAND_RN_CULTURAL_SAFETY_REQUIREMENTS = [
  "Reflective practice",
  "Bias awareness",
  "Power dynamics",
  "Person-centred care",
  "Equity-focused care",
  "Indigenous health perspectives",
  "Communication considerations",
] as const;

export const NEW_ZEALAND_RN_COMMUNITY_AND_PRIMARY_CARE_REQUIREMENTS = [
  "General practice nursing",
  "Public health nursing",
  "Chronic disease management",
  "Health promotion",
  "Community assessment",
  "Rural healthcare",
  "Home care",
] as const;

export const NEW_ZEALAND_RN_MEDICATION_GOVERNANCE_REQUIREMENTS = [
  "Safe administration",
  "Documentation",
  "Monitoring",
  "Medication incidents",
  "High-risk medications",
  "Controlled medication practices",
] as const;

export const NEW_ZEALAND_RN_CLINICAL_ASSESSMENT_REQUIREMENTS = [
  "Deterioration recognition",
  "Escalation",
  "Vital signs interpretation",
  "Clinical judgment",
  "Documentation",
  "Interprofessional communication",
] as const;

export const NEW_ZEALAND_RN_IQN_STREAM_REQUIREMENTS = [
  "NCNZ registration pathways",
  "Competency assessment expectations",
  "Documentation standards",
  "Clinical communication",
  "Cultural safety expectations",
] as const;

export const NEW_ZEALAND_RN_CLINICAL_JUDGMENT_REQUIREMENTS = {
  minimumCaseStudies: 200,
  categories: [
    "Cultural safety scenarios",
    "Te Tiriti applications",
    "Deterioration recognition",
    "Medication safety",
    "Community care",
    "Primary care",
    "Documentation issues",
    "Escalation decisions",
  ],
} as const;

export const NEW_ZEALAND_RN_PUBLICATION_LOCKS = {
  status: "draft",
  published: false,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  adminOnly: true,
  noindex: true,
  country: "nz",
  exam: "ncnz-rn",
  readyForPublication: false,
  defaultState: "DRAFT_ONLY",
} as const;

export const NEW_ZEALAND_RN_REQUIRED_GOVERNANCE_REVIEWS = [
  "NCNZ competency review completed",
  "Cultural safety review completed",
  "Te Tiriti review completed",
  "Clinical review completed",
  "Editorial review completed",
  "SEO localization review completed",
] as const;

export function summarizeNewZealandRnCoreBlueprintDomains() {
  return NEW_ZEALAND_RN_CORE_BLUEPRINT_DOMAINS.reduce(
    (totals, domain) => ({
      lessons: totals.lessons + domain.lessons,
      questions: totals.questions + domain.questions,
      flashcards: totals.flashcards + domain.flashcards,
      simulations: totals.simulations + domain.simulations,
    }),
    { lessons: 0, questions: 0, flashcards: 0, simulations: 0 },
  );
}

export function buildNewZealandRnBlueprintGapSummary() {
  const allocated = summarizeNewZealandRnCoreBlueprintDomains();
  return {
    allocated,
    remaining: {
      lessons: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.lessons - allocated.lessons,
      questions: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.questions - allocated.questions,
      flashcards: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.flashcards - allocated.flashcards,
      simulations: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.simulations - allocated.simulations,
      ngnStyleCases: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases,
      bowties: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.bowties,
      matrixCases: NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.matrixCases,
    },
  } as const;
}

export function validateNewZealandRnBlueprintReadinessFramework(): readonly string[] {
  const issues: string[] = [];
  const totals = summarizeNewZealandRnCoreBlueprintDomains();

  if (totals.simulations !== NEW_ZEALAND_RN_MATURE_INVENTORY_TARGETS.simulations) {
    issues.push("New Zealand RN core simulation allocation must equal mature target");
  }

  if (NEW_ZEALAND_RN_CORE_BLUEPRINT_DOMAINS.length < 12) {
    issues.push("New Zealand RN framework must include all core blueprint domains");
  }

  if (NEW_ZEALAND_RN_NCNZ_COMPETENCY_MAPPING.length !== 4) {
    issues.push("New Zealand RN framework must include all four NCNZ competency domains");
  }

  if (NEW_ZEALAND_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies < 200) {
    issues.push("New Zealand RN clinical judgment requirement must include at least 200 case studies");
  }

  if (
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.status !== "draft" ||
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.published ||
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.visibleInNavigation ||
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.learnerAccessible ||
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.launchReady ||
    !NEW_ZEALAND_RN_PUBLICATION_LOCKS.adminOnly ||
    !NEW_ZEALAND_RN_PUBLICATION_LOCKS.noindex ||
    NEW_ZEALAND_RN_PUBLICATION_LOCKS.readyForPublication
  ) {
    issues.push("New Zealand RN publication locks must keep the pathway draft-only, admin-only, hidden, and noindex");
  }

  return issues;
}
