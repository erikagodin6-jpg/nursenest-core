export type AustraliaRnBlueprintDomain = {
  readonly domain: string;
  readonly lessons: number;
  readonly questions: number;
  readonly flashcards: number;
  readonly simulations: number;
};

export const AUSTRALIA_RN_PATHWAY_READINESS_METADATA = {
  country: "Australia",
  countryCode: "AU",
  regulator: "Nursing and Midwifery Board of Australia (NMBA)",
  registrationAuthority: "Ahpra",
  pathway: "Australian RN / IQNM",
  profession: "Registered Nurse",
  pathwayId: "au-rn-iqnm-pathway",
  internalHub: "/admin/global-expansion/hubs/au/rn",
  reservedPublicRoute: "/au/rn",
  visibility: "hidden",
  publicationStatus: "draft",
  indexing: "noindex",
} as const;

export const AUSTRALIA_RN_MATURE_INVENTORY_TARGETS = {
  lessons: 600,
  flashcards: 8_000,
  questions: 5_000,
  simulations: 150,
  ngnStyleCases: 250,
  bowties: 150,
  matrixCases: 150,
} as const;

export const AUSTRALIA_RN_CORE_BLUEPRINT_DOMAINS: readonly AustraliaRnBlueprintDomain[] = [
  { domain: "NMBA Standards for Practice", lessons: 50, questions: 300, flashcards: 500, simulations: 8 },
  { domain: "Professional Practice", lessons: 50, questions: 300, flashcards: 500, simulations: 8 },
  { domain: "Ahpra Registration and Conduct", lessons: 20, questions: 125, flashcards: 200, simulations: 4 },
  { domain: "Medication Safety and Governance", lessons: 80, questions: 600, flashcards: 1_000, simulations: 18 },
  { domain: "Clinical Assessment and Deterioration", lessons: 70, questions: 500, flashcards: 800, simulations: 18 },
  { domain: "Adult Health", lessons: 150, questions: 1_100, flashcards: 1_700, simulations: 35 },
  { domain: "Mental Health", lessons: 60, questions: 400, flashcards: 700, simulations: 12 },
  { domain: "Maternal and Child Health", lessons: 50, questions: 350, flashcards: 600, simulations: 10 },
  { domain: "Rural and Remote Healthcare", lessons: 45, questions: 275, flashcards: 450, simulations: 12 },
  { domain: "Aboriginal and Torres Strait Islander Health", lessons: 60, questions: 400, flashcards: 700, simulations: 12 },
  { domain: "Leadership and Escalation", lessons: 55, questions: 350, flashcards: 600, simulations: 8 },
  { domain: "Documentation and Communication", lessons: 30, questions: 200, flashcards: 350, simulations: 5 },
] as const;

export const AUSTRALIA_RN_NMBA_STANDARDS_MAPPING = [
  "Thinks critically and analyses nursing practice",
  "Engages in therapeutic and professional relationships",
  "Maintains capability for practice",
  "Comprehensively conducts assessments",
  "Develops plans for nursing practice",
  "Provides safe, appropriate, responsive practice",
  "Evaluates outcomes to inform practice",
] as const;

export const AUSTRALIA_RN_CLINICAL_REQUIREMENTS = [
  "Australian healthcare terminology",
  "Ahpra professional expectations",
  "NMBA standards",
  "Medication governance",
  "Rural health realities",
  "Escalation pathways",
  "Cultural safety principles",
] as const;

export const AUSTRALIA_RN_TERMINOLOGY_AVOID = ["Excessive American terminology"] as const;

export const AUSTRALIA_RN_ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_REQUIREMENTS = [
  "Cultural safety",
  "Health inequities",
  "Community engagement",
  "Communication approaches",
  "Historical context affecting healthcare",
  "Rural and remote service delivery",
] as const;

export const AUSTRALIA_RN_RURAL_AND_REMOTE_REQUIREMENTS = [
  "Limited-resource environments",
  "Retrieval services",
  "Telehealth",
  "Geographic barriers",
  "Emergency stabilization",
  "Community nursing",
] as const;

export const AUSTRALIA_RN_MEDICATION_GOVERNANCE_REQUIREMENTS = [
  "Schedule classifications",
  "High-risk medications",
  "Medication reconciliation",
  "Documentation requirements",
  "Medication incident reporting",
  "Safe administration practices",
] as const;

export const AUSTRALIA_RN_CLINICAL_JUDGMENT_REQUIREMENTS = {
  minimumCaseStudies: 250,
  categories: [
    "Deterioration recognition",
    "Escalation",
    "Medication safety",
    "Rural scenarios",
    "Mental health presentations",
    "Cultural safety situations",
    "Documentation concerns",
  ],
} as const;

export const AUSTRALIA_RN_IQNM_STREAM_REQUIREMENTS = [
  "Registration pathways",
  "Professional expectations",
  "Australian documentation",
  "Communication standards",
  "Clinical adaptation",
] as const;

export const AUSTRALIA_RN_PUBLICATION_LOCKS = {
  status: "draft",
  published: false,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  adminOnly: true,
  noindex: true,
  country: "au",
  exam: "nmba-rn",
  readyForPublication: false,
  defaultState: "DRAFT_ONLY",
} as const;

export const AUSTRALIA_RN_REQUIRED_GOVERNANCE_REVIEWS = [
  "NMBA standards review completed",
  "Ahpra review completed",
  "Australian terminology review completed",
  "Clinical review completed",
  "Editorial review completed",
  "SEO localization review completed",
] as const;

export function summarizeAustraliaRnCoreBlueprintDomains() {
  return AUSTRALIA_RN_CORE_BLUEPRINT_DOMAINS.reduce(
    (totals, domain) => ({
      lessons: totals.lessons + domain.lessons,
      questions: totals.questions + domain.questions,
      flashcards: totals.flashcards + domain.flashcards,
      simulations: totals.simulations + domain.simulations,
    }),
    { lessons: 0, questions: 0, flashcards: 0, simulations: 0 },
  );
}

export function buildAustraliaRnBlueprintGapSummary() {
  const allocated = summarizeAustraliaRnCoreBlueprintDomains();
  return {
    allocated,
    remaining: {
      lessons: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.lessons - allocated.lessons,
      questions: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.questions - allocated.questions,
      flashcards: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.flashcards - allocated.flashcards,
      simulations: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.simulations - allocated.simulations,
      ngnStyleCases: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases,
      bowties: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.bowties,
      matrixCases: AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.matrixCases,
    },
  } as const;
}

export function validateAustraliaRnBlueprintReadinessFramework(): readonly string[] {
  const issues: string[] = [];
  const totals = summarizeAustraliaRnCoreBlueprintDomains();

  if (totals.questions > AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.questions) {
    issues.push("Australia RN core question allocation exceeds mature target");
  }

  if (totals.simulations !== AUSTRALIA_RN_MATURE_INVENTORY_TARGETS.simulations) {
    issues.push("Australia RN core simulation allocation must equal mature target");
  }

  if (AUSTRALIA_RN_CORE_BLUEPRINT_DOMAINS.length < 12) {
    issues.push("Australia RN framework must include all core blueprint domains");
  }

  if (AUSTRALIA_RN_NMBA_STANDARDS_MAPPING.length !== 7) {
    issues.push("Australia RN framework must include all seven NMBA standards");
  }

  if (AUSTRALIA_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies < 250) {
    issues.push("Australia RN clinical judgment requirement must include at least 250 case studies");
  }

  if (
    AUSTRALIA_RN_PUBLICATION_LOCKS.status !== "draft" ||
    AUSTRALIA_RN_PUBLICATION_LOCKS.published ||
    AUSTRALIA_RN_PUBLICATION_LOCKS.visibleInNavigation ||
    AUSTRALIA_RN_PUBLICATION_LOCKS.learnerAccessible ||
    AUSTRALIA_RN_PUBLICATION_LOCKS.launchReady ||
    !AUSTRALIA_RN_PUBLICATION_LOCKS.adminOnly ||
    !AUSTRALIA_RN_PUBLICATION_LOCKS.noindex ||
    AUSTRALIA_RN_PUBLICATION_LOCKS.readyForPublication
  ) {
    issues.push("Australia RN publication locks must keep the pathway draft-only, admin-only, hidden, and noindex");
  }

  return issues;
}
