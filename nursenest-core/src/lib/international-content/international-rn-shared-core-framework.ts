export type SharedCoreAssetKind =
  | "lesson"
  | "flashcard"
  | "question"
  | "simulation"
  | "ngn_case";

export type SharedCoreFrameworkArea = {
  readonly id: string;
  readonly title: string;
  readonly reusableGlobally: true;
  readonly countryOverlayRequired: boolean;
  readonly roleOverlayRequired: boolean;
  readonly examOverlayRequired: boolean;
};

export type CountryOverlay = {
  readonly country: string;
  readonly countryCode: string;
  readonly overlayId: string;
  readonly appliesToPathways: readonly string[];
  readonly requiredDomains: readonly string[];
};

export type ContentArchitectureLayer = {
  readonly layer: "core_content" | "country_overlay" | "language_overlay" | "exam_overlay" | "role_overlay";
  readonly purpose: string;
  readonly mayDuplicateSourceContent: false;
  readonly examples: readonly string[];
};

export type ReuseSavingsEstimate = {
  readonly area: string;
  readonly baselineCountryCopies: number;
  readonly sourceItems: number;
  readonly duplicatedItemsAvoided: number;
  readonly reusePercent: number;
  readonly maintenanceReductionPercent: number;
  readonly translationSavingsPercent: number;
  readonly seoExpansionSavingsPercent: number;
};

export type SharedCoreOverlayExample = {
  readonly coreId: string;
  readonly coreTitle: string;
  readonly bodySystem: string;
  readonly sourceLayer: "GLOBAL_SHARED_CORE";
  readonly roleOverlays: readonly {
    readonly role: "PN" | "RN" | "NP";
    readonly focus: readonly string[];
  }[];
  readonly countryOverlays: readonly string[];
  readonly languageOverlays: readonly string[];
  readonly duplicateCountryLessonsRequired: false;
  readonly publicationLocks: typeof GLOBAL_SHARED_CORE_PUBLICATION_LOCKS;
};

export const GLOBAL_SHARED_CORE_PUBLICATION_LOCKS = {
  status: "draft",
  published: false,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  adminOnly: true,
  noindex: true,
  readyForPublication: false,
  defaultState: "DRAFT_ONLY",
} as const;

export const GLOBAL_SHARED_CORE_INVENTORY_TARGETS: Record<SharedCoreAssetKind, number> = {
  lesson: 2_000,
  flashcard: 25_000,
  question: 40_000,
  simulation: 500,
  ngn_case: 1_000,
} as const;

export const GLOBAL_SHARED_CORE_AUDIENCES = [
  "RN",
  "RPN/PN",
  "NP",
  "International RN",
] as const;

export const GLOBAL_SHARED_CORE_FOUNDATION_AREAS: readonly SharedCoreFrameworkArea[] = [
  { id: "anatomy", title: "Anatomy", reusableGlobally: true, countryOverlayRequired: false, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "physiology", title: "Physiology", reusableGlobally: true, countryOverlayRequired: false, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "pathophysiology", title: "Pathophysiology", reusableGlobally: true, countryOverlayRequired: false, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "pharmacology-principles", title: "Pharmacology Principles", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "laboratory-interpretation", title: "Laboratory Interpretation", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "ecg-interpretation", title: "ECG Interpretation", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "clinical-assessment", title: "Clinical Assessment", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "infection-prevention", title: "Infection Prevention", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "wound-care", title: "Wound Care", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "iv-therapy", title: "IV Therapy", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "medication-administration-principles", title: "Medication Administration Principles", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "documentation-principles", title: "Documentation Principles", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "clinical-judgment", title: "Clinical Judgment", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "prioritization", title: "Prioritization", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "delegation", title: "Delegation", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "communication-fundamentals", title: "Communication Fundamentals", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "patient-safety", title: "Patient Safety", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
  { id: "quality-improvement", title: "Quality Improvement", reusableGlobally: true, countryOverlayRequired: true, roleOverlayRequired: true, examOverlayRequired: true },
] as const;

export const GLOBAL_SHARED_BODY_SYSTEM_FRAMEWORK: readonly SharedCoreFrameworkArea[] = [
  "Cardiovascular",
  "Respiratory",
  "Neurological",
  "Gastrointestinal",
  "Endocrine",
  "Renal",
  "Musculoskeletal",
  "Hematology",
  "Oncology",
  "Immunology",
  "Dermatology",
  "Infectious Disease",
  "Mental Health",
  "Maternal-Newborn",
  "Pediatrics",
  "Geriatrics",
].map((title) => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title,
  reusableGlobally: true,
  countryOverlayRequired: true,
  roleOverlayRequired: true,
  examOverlayRequired: true,
}));

export const GLOBAL_SHARED_CLINICAL_SKILLS_FRAMEWORK: readonly SharedCoreFrameworkArea[] = [
  "Medication Administration",
  "IV Therapy",
  "Central Lines",
  "PICC Care",
  "Wound Care",
  "Tracheostomy Care",
  "Oxygen Therapy",
  "Chest Tubes",
  "Blood Administration",
  "Isolation Precautions",
  "Specimen Collection",
].map((title) => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title,
  reusableGlobally: true,
  countryOverlayRequired: true,
  roleOverlayRequired: true,
  examOverlayRequired: true,
}));

export const GLOBAL_SHARED_PHARMACOLOGY_FRAMEWORK: readonly SharedCoreFrameworkArea[] = [
  "Cardiovascular Medications",
  "Endocrine Medications",
  "Respiratory Medications",
  "Psychiatric Medications",
  "Antimicrobials",
  "Oncology Agents",
  "Emergency Medications",
  "Critical Care Medications",
].map((title) => ({
  id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  title,
  reusableGlobally: true,
  countryOverlayRequired: true,
  roleOverlayRequired: true,
  examOverlayRequired: true,
}));

export const GLOBAL_SHARED_CLINICAL_JUDGMENT_FRAMEWORK = [
  "Bowties",
  "Matrix Questions",
  "Trend Interpretation",
  "Case Studies",
  "Prioritization",
  "Delegation",
  "Documentation",
  "Simulation Logic",
  "Adaptive Learning Metadata",
  "Remediation Metadata",
  "Analytics Metadata",
] as const;

export const GLOBAL_SHARED_FLASHCARD_OUTPUT_FRAMEWORK = [
  "Flashcards",
  "Clinical Pearls",
  "Memory Anchors",
  "Exam Relevance",
  "Common Mistakes",
] as const;

export const INTERNATIONAL_RN_COUNTRY_OVERLAYS: readonly CountryOverlay[] = [
  {
    country: "Canada",
    countryCode: "CA",
    overlayId: "canada-rn-overlay",
    appliesToPathways: ["ca-rn-nclex-rn"],
    requiredDomains: ["Provincial Regulation", "CNO", "BCCNM", "CLPNA", "CRNNL"],
  },
  {
    country: "United States",
    countryCode: "US",
    overlayId: "united-states-rn-overlay",
    appliesToPathways: ["us-rn-nclex-rn"],
    requiredDomains: ["State Boards", "NCLEX-Specific Regulation", "US Documentation Expectations"],
  },
  {
    country: "United Kingdom",
    countryCode: "GB",
    overlayId: "united-kingdom-rn-overlay",
    appliesToPathways: ["uk-rn-nmc-test-of-competence"],
    requiredDomains: ["NHS Structure", "NMC Code", "Duty of Candour", "NEWS2", "Safeguarding"],
  },
  {
    country: "Australia",
    countryCode: "AU",
    overlayId: "australia-rn-overlay",
    appliesToPathways: ["au-rn-iqnm-pathway"],
    requiredDomains: ["NMBA Standards", "Ahpra Requirements", "Rural Healthcare", "Aboriginal and Torres Strait Islander Health"],
  },
  {
    country: "New Zealand",
    countryCode: "NZ",
    overlayId: "new-zealand-rn-overlay",
    appliesToPathways: ["global-nz-rn-ncnz"],
    requiredDomains: ["NCNZ Competencies", "Te Tiriti o Waitangi", "Cultural Safety"],
  },
] as const;

export const FUTURE_INTERNATIONAL_RN_OVERLAY_MARKETS = [
  "Ireland",
  "UAE DHA",
  "UAE HAAD",
  "UAE MOH",
  "Saudi Arabia",
  "Qatar",
  "Oman",
  "Singapore",
  "India",
  "Philippines",
  "Additional future countries",
] as const;

export const INTERNATIONAL_RN_LANGUAGE_OVERLAY_FRAMEWORK = [
  "French",
  "Spanish",
  "Hindi",
  "Portuguese",
  "Tagalog",
  "Arabic",
  "German",
  "Japanese",
  "Korean",
  "Chinese",
  "Future languages",
] as const;

export const INTERNATIONAL_RN_EXAM_OVERLAY_FRAMEWORK = [
  "NCLEX-RN",
  "REx-PN",
  "NMC CBT",
  "NMC OSCE",
  "NMBA / IQNM",
  "NCNZ RN Registration",
  "Future international exams",
] as const;

export const INTERNATIONAL_RN_ROLE_OVERLAY_FRAMEWORK = [
  "RN",
  "RPN/PN",
  "NP",
  "International RN",
] as const;

export const INTERNATIONAL_RN_CONTENT_ARCHITECTURE_LAYERS: readonly ContentArchitectureLayer[] = [
  {
    layer: "core_content",
    purpose: "Clinical science, clinical reasoning, safety principles, and reusable learning assets authored once.",
    mayDuplicateSourceContent: false,
    examples: ["Heart failure pathophysiology", "ABG interpretation", "Medication administration principles"],
  },
  {
    layer: "country_overlay",
    purpose: "Regulation, documentation, scope, medication governance, health system, terminology, and local guideline differences.",
    mayDuplicateSourceContent: false,
    examples: ["NEWS2", "NMBA Standards", "Te Tiriti", "Provincial regulation"],
  },
  {
    layer: "language_overlay",
    purpose: "Translation and localization derived from GLOBAL_SHARED_CORE, not copied country pages.",
    mayDuplicateSourceContent: false,
    examples: ["French", "Spanish", "Hindi", "Arabic"],
  },
  {
    layer: "exam_overlay",
    purpose: "Blueprint mapping, item style, scoring rules, and exam-specific strategy.",
    mayDuplicateSourceContent: false,
    examples: ["NCLEX NGN", "NMC CBT safe practice", "NCNZ competency mapping"],
  },
  {
    layer: "role_overlay",
    purpose: "Scope, depth, and decision authority differences across RN, PN, NP, and internationally qualified RN use cases.",
    mayDuplicateSourceContent: false,
    examples: ["RN prioritization", "PN scope", "NP diagnostic reasoning"],
  },
] as const;

export const INTERNATIONAL_RN_DUPLICATE_CONTENT_AUDIT = {
  evidenceSources: [
    "docs/global-content-reuse-map.md",
    "docs/duplicate-content-opportunity-report.md",
    "docs/RN-95-roadmap.md",
    "docs/reports/lesson-inventory-audit.md",
  ],
  existingSignals: [
    { signal: "Heart Failure / CHF", filesWithMatches: 984, reuseClassification: "Global Core" },
    { signal: "COPD", filesWithMatches: 1_176, reuseClassification: "Global Core" },
    { signal: "Shock", filesWithMatches: 1_151, reuseClassification: "Global Core" },
    { signal: "Sepsis", filesWithMatches: 4_414, reuseClassification: "Global Core" },
    { signal: "ABG / Arterial Blood Gas", filesWithMatches: 626, reuseClassification: "Global Core" },
    { signal: "ECG / Telemetry", filesWithMatches: 3_011, reuseClassification: "Global Core" },
    { signal: "Pharmacology / Medication Safety", filesWithMatches: 2_850, reuseClassification: "Global Core + Country Supplements" },
    { signal: "Lab Interpretation / Labs", filesWithMatches: 2_638, reuseClassification: "Global Core + Country Supplements" },
    { signal: "Clinical Skills / Assessment", filesWithMatches: 4_409, reuseClassification: "Global Core + Country Supplements" },
  ],
  knownDuplicateFindings: [
    "RN lesson quality audit reported 250 near-duplicate lesson pairs queued for review.",
    "Lesson inventory audit reports repeated unit-pattern duplicates in allied and practical exam prep batches.",
    "Duplicate content opportunity report estimates high reuse potential for UK, Australia, and New Zealand overlays.",
  ],
} as const;

export const INTERNATIONAL_RN_REUSE_SAVINGS_ESTIMATES: readonly ReuseSavingsEstimate[] = [
  {
    area: "Core adult health and pathophysiology",
    baselineCountryCopies: 5,
    sourceItems: 10_000,
    duplicatedItemsAvoided: 40_000,
    reusePercent: 80,
    maintenanceReductionPercent: 72,
    translationSavingsPercent: 65,
    seoExpansionSavingsPercent: 60,
  },
  {
    area: "Labs, ECG, pharmacology, and clinical skills",
    baselineCountryCopies: 5,
    sourceItems: 8_000,
    duplicatedItemsAvoided: 32_000,
    reusePercent: 78,
    maintenanceReductionPercent: 70,
    translationSavingsPercent: 68,
    seoExpansionSavingsPercent: 55,
  },
  {
    area: "Clinical judgment and simulation logic",
    baselineCountryCopies: 5,
    sourceItems: 1_500,
    duplicatedItemsAvoided: 6_000,
    reusePercent: 70,
    maintenanceReductionPercent: 66,
    translationSavingsPercent: 58,
    seoExpansionSavingsPercent: 50,
  },
] as const;

export const INTERNATIONAL_RN_GENERATION_GOVERNANCE_RULES = [
  "No duplicate lesson creation when shared core content exists.",
  "No duplicate flashcard creation when shared core content exists.",
  "No duplicate question creation when shared core content exists.",
  "No duplicate simulation creation when shared core content exists.",
  "Country-specific generation is allowed only when regulation, documentation, scope, medication governance, or clinical guideline differences exist.",
] as const;

export const GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE: SharedCoreOverlayExample = {
  coreId: "global-heart-failure-core",
  coreTitle: "Heart Failure",
  bodySystem: "Cardiovascular",
  sourceLayer: "GLOBAL_SHARED_CORE",
  roleOverlays: [
    {
      role: "PN",
      focus: ["Recognition", "Assessment", "Monitoring", "Basic medications", "Escalation"],
    },
    {
      role: "RN",
      focus: [
        "Advanced assessment",
        "Medication titration concepts",
        "Prioritization",
        "Clinical judgment",
        "Interprofessional collaboration",
      ],
    },
    {
      role: "NP",
      focus: ["Diagnostics", "Differential diagnosis", "Guideline-directed therapy", "Prescribing", "Longitudinal management"],
    },
  ],
  countryOverlays: ["UK Overlay", "Australia Overlay", "Canada Overlay", "US Overlay"],
  languageOverlays: ["French Overlay", "Spanish Overlay"],
  duplicateCountryLessonsRequired: false,
  publicationLocks: GLOBAL_SHARED_CORE_PUBLICATION_LOCKS,
} as const;

export function calculateInternationalRnAggregateSavings() {
  const totals = INTERNATIONAL_RN_REUSE_SAVINGS_ESTIMATES.reduce(
    (acc, row) => ({
      sourceItems: acc.sourceItems + row.sourceItems,
      duplicatedItemsAvoided: acc.duplicatedItemsAvoided + row.duplicatedItemsAvoided,
      reusePercent: acc.reusePercent + row.reusePercent,
      maintenanceReductionPercent: acc.maintenanceReductionPercent + row.maintenanceReductionPercent,
      translationSavingsPercent: acc.translationSavingsPercent + row.translationSavingsPercent,
      seoExpansionSavingsPercent: acc.seoExpansionSavingsPercent + row.seoExpansionSavingsPercent,
    }),
    {
      sourceItems: 0,
      duplicatedItemsAvoided: 0,
      reusePercent: 0,
      maintenanceReductionPercent: 0,
      translationSavingsPercent: 0,
      seoExpansionSavingsPercent: 0,
    },
  );
  const count = INTERNATIONAL_RN_REUSE_SAVINGS_ESTIMATES.length;
  return {
    sourceItems: totals.sourceItems,
    duplicatedItemsAvoided: totals.duplicatedItemsAvoided,
    averageReusePercent: Math.round(totals.reusePercent / count),
    averageMaintenanceReductionPercent: Math.round(totals.maintenanceReductionPercent / count),
    averageTranslationSavingsPercent: Math.round(totals.translationSavingsPercent / count),
    averageSeoExpansionSavingsPercent: Math.round(totals.seoExpansionSavingsPercent / count),
  } as const;
}

export function validateInternationalRnSharedCoreFramework(): readonly string[] {
  const issues: string[] = [];

  if (GLOBAL_SHARED_CORE_INVENTORY_TARGETS.lesson < 2_000) issues.push("GLOBAL_SHARED_CORE must target at least 2,000 lessons");
  if (GLOBAL_SHARED_CORE_INVENTORY_TARGETS.flashcard < 25_000) issues.push("GLOBAL_SHARED_CORE must target at least 25,000 flashcards");
  if (GLOBAL_SHARED_CORE_INVENTORY_TARGETS.question < 40_000) issues.push("GLOBAL_SHARED_CORE must target at least 40,000 questions");
  if (GLOBAL_SHARED_CORE_INVENTORY_TARGETS.simulation < 500) issues.push("GLOBAL_SHARED_CORE must target at least 500 simulations");
  if (GLOBAL_SHARED_CORE_INVENTORY_TARGETS.ngn_case < 1_000) issues.push("GLOBAL_SHARED_CORE must target at least 1,000 NGN cases");

  if (GLOBAL_SHARED_BODY_SYSTEM_FRAMEWORK.length < 16) issues.push("Shared body system framework must cover all required systems");
  if (GLOBAL_SHARED_CLINICAL_SKILLS_FRAMEWORK.length < 11) issues.push("Shared clinical skills framework must cover all required skills");
  if (GLOBAL_SHARED_PHARMACOLOGY_FRAMEWORK.length < 8) issues.push("Shared pharmacology framework must cover all required medication groups");
  if (GLOBAL_SHARED_CLINICAL_JUDGMENT_FRAMEWORK.length < 11) issues.push("Shared clinical judgment framework must include adaptive and analytics metadata");
  if (GLOBAL_SHARED_FLASHCARD_OUTPUT_FRAMEWORK.length < 5) issues.push("Shared flashcard framework must include generated educational outputs");

  if (GLOBAL_HEART_FAILURE_CORE_OVERLAY_EXAMPLE.duplicateCountryLessonsRequired !== false) {
    issues.push("Global heart failure example must not require duplicate country lessons");
  }

  for (const layer of INTERNATIONAL_RN_CONTENT_ARCHITECTURE_LAYERS) {
    if (layer.mayDuplicateSourceContent !== false) issues.push(`${layer.layer} must not duplicate source content`);
  }

  for (const overlay of INTERNATIONAL_RN_COUNTRY_OVERLAYS) {
    if (overlay.requiredDomains.length === 0) issues.push(`${overlay.overlayId} must define required domains`);
  }

  if (
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.status !== "draft" ||
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.published ||
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.visibleInNavigation ||
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.learnerAccessible ||
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.launchReady ||
    !GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.adminOnly ||
    !GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.noindex ||
    GLOBAL_SHARED_CORE_PUBLICATION_LOCKS.readyForPublication
  ) {
    issues.push("GLOBAL_SHARED_CORE must remain draft-only, admin-only, hidden, and noindex");
  }

  return issues;
}
