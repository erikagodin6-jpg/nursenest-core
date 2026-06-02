export type UkRnBlueprintDomain = {
  readonly domain: string;
  readonly lessons: number;
  readonly questions: number;
  readonly flashcards: number;
  readonly simulations: number;
};

export type UkRnOsceDomain = {
  readonly domain: string;
  readonly requirements: readonly string[];
};

export const UK_RN_PATHWAY_READINESS_METADATA = {
  country: "United Kingdom",
  countryCode: "GB",
  regulator: "Nursing and Midwifery Council (NMC)",
  examination: "CBT + OSCE",
  profession: "Registered Nurse",
  pathwayId: "uk-rn-nmc-test-of-competence",
  internalHub: "/admin/global-expansion/hubs/uk/rn",
  reservedPublicRoute: "/uk/rn",
  visibility: "hidden",
  publicationStatus: "draft",
  indexing: "noindex",
} as const;

export const UK_RN_MATURE_INVENTORY_TARGETS = {
  lessons: 750,
  flashcards: 10_000,
  questions: 5_000,
  simulations: 200,
  osceStations: 250,
  ngnStyleCases: 250,
  bowties: 150,
  matrixCases: 150,
} as const;

export const UK_RN_CORE_BLUEPRINT_DOMAINS: readonly UkRnBlueprintDomain[] = [
  { domain: "NHS Structure and Pathways", lessons: 40, questions: 200, flashcards: 300, simulations: 8 },
  { domain: "NMC Code and Professional Practice", lessons: 40, questions: 200, flashcards: 300, simulations: 8 },
  { domain: "Duty of Candour", lessons: 30, questions: 150, flashcards: 250, simulations: 6 },
  { domain: "NEWS2 and Deterioration", lessons: 60, questions: 400, flashcards: 700, simulations: 18 },
  { domain: "SBAR Communication", lessons: 30, questions: 175, flashcards: 300, simulations: 10 },
  { domain: "Safeguarding Adults", lessons: 35, questions: 200, flashcards: 350, simulations: 8 },
  { domain: "Safeguarding Children", lessons: 35, questions: 200, flashcards: 350, simulations: 8 },
  { domain: "Medicines Management", lessons: 80, questions: 600, flashcards: 1_000, simulations: 18 },
  { domain: "Infection Prevention and Control", lessons: 40, questions: 250, flashcards: 400, simulations: 8 },
  { domain: "Adult Nursing", lessons: 150, questions: 1_000, flashcards: 1_600, simulations: 35 },
  { domain: "Mental Health Nursing", lessons: 70, questions: 450, flashcards: 800, simulations: 12 },
  { domain: "Children's Nursing", lessons: 60, questions: 400, flashcards: 700, simulations: 12 },
  { domain: "Leadership and Delegation", lessons: 60, questions: 350, flashcards: 600, simulations: 10 },
  { domain: "Documentation and Record Keeping", lessons: 20, questions: 125, flashcards: 250, simulations: 6 },
  { domain: "End-of-Life Care", lessons: 20, questions: 125, flashcards: 250, simulations: 6 },
] as const;

export const UK_RN_OSCE_BLUEPRINT_DOMAINS: readonly UkRnOsceDomain[] = [
  {
    domain: "Assessment",
    requirements: ["Vital signs", "Focused assessments", "Escalation"],
  },
  {
    domain: "Communication",
    requirements: ["Patient interactions", "Family interactions", "Difficult conversations", "Capacity and consent"],
  },
  {
    domain: "Medication Administration",
    requirements: ["Rights of medication administration", "Safety checks", "Documentation"],
  },
  {
    domain: "Clinical Skills",
    requirements: ["Wound care", "Catheters", "Injections", "Oxygen therapy", "Specimen collection"],
  },
  {
    domain: "Documentation",
    requirements: ["Nursing notes", "Escalation records", "Safety reporting"],
  },
] as const;

export const UK_RN_TERMINOLOGY_EXPECTATIONS = {
  use: ["A&E", "NEWS2", "SBAR", "Duty of Candour", "Registered Nurse Associate references when applicable", "NHS pathways"],
  avoid: ["Excessive American terminology"],
} as const;

export const UK_RN_MEDICATION_GOVERNANCE_REQUIREMENTS = [
  "Controlled Drugs",
  "Patient Group Directions",
  "Medicines Reconciliation",
  "Double-Checking Processes",
  "Medication Error Reporting",
] as const;

export const UK_RN_SAFEGUARDING_REQUIREMENTS = [
  "Adults at Risk",
  "Child Protection",
  "Domestic Abuse",
  "Modern Slavery Awareness",
  "Mental Capacity Considerations",
] as const;

export const UK_RN_CLINICAL_JUDGMENT_REQUIREMENTS = {
  minimumCaseStudies: 250,
  categories: [
    "Deterioration recognition",
    "Escalation",
    "Medication safety",
    "Safeguarding",
    "Communication failures",
    "Documentation failures",
  ],
} as const;

export const UK_RN_PUBLICATION_LOCKS = {
  status: "draft",
  published: false,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  adminOnly: true,
  noindex: true,
  country: "uk",
  exam: "nmc-cbt-osce",
  readyForPublication: false,
  defaultState: "DRAFT_ONLY",
} as const;

export const UK_RN_REQUIRED_GOVERNANCE_REVIEWS = [
  "NMC blueprint review completed",
  "UK terminology audit completed",
  "Clinical review completed",
  "Editorial review completed",
  "SEO localization review completed",
  "Translation review completed (future)",
] as const;

export function summarizeUkRnCoreBlueprintDomains() {
  return UK_RN_CORE_BLUEPRINT_DOMAINS.reduce(
    (totals, domain) => ({
      lessons: totals.lessons + domain.lessons,
      questions: totals.questions + domain.questions,
      flashcards: totals.flashcards + domain.flashcards,
      simulations: totals.simulations + domain.simulations,
    }),
    { lessons: 0, questions: 0, flashcards: 0, simulations: 0 },
  );
}

export function buildUkRnBlueprintGapSummary() {
  const allocated = summarizeUkRnCoreBlueprintDomains();
  return {
    allocated,
    remaining: {
      lessons: UK_RN_MATURE_INVENTORY_TARGETS.lessons - allocated.lessons,
      questions: UK_RN_MATURE_INVENTORY_TARGETS.questions - allocated.questions,
      flashcards: UK_RN_MATURE_INVENTORY_TARGETS.flashcards - allocated.flashcards,
      simulations: UK_RN_MATURE_INVENTORY_TARGETS.simulations - allocated.simulations,
      osceStations: UK_RN_MATURE_INVENTORY_TARGETS.osceStations,
      ngnStyleCases: UK_RN_MATURE_INVENTORY_TARGETS.ngnStyleCases,
      bowties: UK_RN_MATURE_INVENTORY_TARGETS.bowties,
      matrixCases: UK_RN_MATURE_INVENTORY_TARGETS.matrixCases,
    },
  } as const;
}

export function validateUkRnBlueprintReadinessFramework(): readonly string[] {
  const issues: string[] = [];
  const totals = summarizeUkRnCoreBlueprintDomains();

  for (const key of ["questions", "flashcards", "simulations"] as const) {
    if (totals[key] > UK_RN_MATURE_INVENTORY_TARGETS[key]) {
      issues.push(`UK RN core ${key} allocation exceeds mature target`);
    }
  }

  if (UK_RN_CORE_BLUEPRINT_DOMAINS.length < 15) {
    issues.push("UK RN framework must include all core blueprint domains");
  }

  if (UK_RN_OSCE_BLUEPRINT_DOMAINS.length < 5) {
    issues.push("UK RN framework must include all OSCE blueprint domains");
  }

  if (UK_RN_CLINICAL_JUDGMENT_REQUIREMENTS.minimumCaseStudies < 250) {
    issues.push("UK RN clinical judgment requirement must include at least 250 case studies");
  }

  if (
    UK_RN_PUBLICATION_LOCKS.status !== "draft" ||
    UK_RN_PUBLICATION_LOCKS.published ||
    UK_RN_PUBLICATION_LOCKS.visibleInNavigation ||
    UK_RN_PUBLICATION_LOCKS.learnerAccessible ||
    UK_RN_PUBLICATION_LOCKS.launchReady ||
    !UK_RN_PUBLICATION_LOCKS.adminOnly ||
    !UK_RN_PUBLICATION_LOCKS.noindex ||
    UK_RN_PUBLICATION_LOCKS.readyForPublication
  ) {
    issues.push("UK RN publication locks must keep the pathway draft-only, admin-only, hidden, and noindex");
  }

  return issues;
}
