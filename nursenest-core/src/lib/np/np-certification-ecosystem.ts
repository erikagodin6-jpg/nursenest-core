export type NpCertificationTag =
  | "NP_CORE"
  | "FNP"
  | "AGPCNP"
  | "PMHNP"
  | "WHNP"
  | "PNP_PC"
  | "PNP_AC"
  | "ACNPC_AG"
  | "ENP"
  | "CNPLE";

export type NpCertificationLifecycle = "active" | "hidden_development";

export type NpCoreLibraryDomain = {
  readonly id: string;
  readonly title: string;
  readonly contentTag: "NP_CORE";
  readonly lessonTarget: number;
  readonly flashcardTarget: number;
  readonly questionTarget: number;
  readonly caseTarget: number;
  readonly sharedBy: readonly NpCertificationTag[];
};

export type NpCertificationSpecialtyPathway = {
  readonly id: string;
  readonly tag: Exclude<NpCertificationTag, "NP_CORE">;
  readonly label: string;
  readonly certification: string;
  readonly lifecycle: NpCertificationLifecycle;
  readonly existingExamPathwayId: string | null;
  readonly focusAreas: readonly string[];
  readonly readinessDomains: readonly string[];
  readonly specialtyLessonTarget: number;
  readonly specialtyQuestionTarget: number;
  readonly sharedCoreTags: readonly ["NP_CORE"];
  readonly published: boolean;
  readonly visibleInNavigation: boolean;
  readonly launchReady: boolean;
  readonly indexable: boolean;
  readonly adminOnly: boolean;
};

export const NP_CORE_LIBRARY_TARGETS = {
  lessons: 500,
  flashcards: 5000,
  questions: 3000,
  clinicalCases: 200,
} as const;

const ALL_NP_CERTIFICATION_TAGS: readonly Exclude<NpCertificationTag, "NP_CORE">[] = [
  "FNP",
  "AGPCNP",
  "PMHNP",
  "WHNP",
  "PNP_PC",
  "PNP_AC",
  "ACNPC_AG",
  "ENP",
  "CNPLE",
] as const;

export const NP_CORE_LIBRARY_DOMAINS: readonly NpCoreLibraryDomain[] = [
  {
    id: "advanced-assessment",
    title: "Advanced Assessment",
    contentTag: "NP_CORE",
    lessonTarget: 70,
    flashcardTarget: 650,
    questionTarget: 400,
    caseTarget: 25,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    contentTag: "NP_CORE",
    lessonTarget: 60,
    flashcardTarget: 600,
    questionTarget: 375,
    caseTarget: 24,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "clinical-decision-making",
    title: "Clinical Decision-Making",
    contentTag: "NP_CORE",
    lessonTarget: 70,
    flashcardTarget: 650,
    questionTarget: 450,
    caseTarget: 30,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "evidence-based-practice",
    title: "Evidence-Based Practice",
    contentTag: "NP_CORE",
    lessonTarget: 45,
    flashcardTarget: 450,
    questionTarget: 250,
    caseTarget: 12,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "advanced-pharmacology",
    title: "Advanced Pharmacology",
    contentTag: "NP_CORE",
    lessonTarget: 80,
    flashcardTarget: 900,
    questionTarget: 550,
    caseTarget: 38,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "advanced-pathophysiology",
    title: "Advanced Pathophysiology",
    contentTag: "NP_CORE",
    lessonTarget: 75,
    flashcardTarget: 850,
    questionTarget: 500,
    caseTarget: 34,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "health-promotion",
    title: "Health Promotion",
    contentTag: "NP_CORE",
    lessonTarget: 45,
    flashcardTarget: 450,
    questionTarget: 250,
    caseTarget: 14,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
  {
    id: "professional-issues",
    title: "Professional Issues, Ethics, Leadership, And Research",
    contentTag: "NP_CORE",
    lessonTarget: 55,
    flashcardTarget: 500,
    questionTarget: 225,
    caseTarget: 23,
    sharedBy: ALL_NP_CERTIFICATION_TAGS,
  },
] as const;

export const NP_CERTIFICATION_SPECIALTY_PATHWAYS: readonly NpCertificationSpecialtyPathway[] = [
  {
    id: "fnp",
    tag: "FNP",
    label: "Family Nurse Practitioner",
    certification: "FNP",
    lifecycle: "active",
    existingExamPathwayId: "us-np-fnp",
    focusAreas: ["Primary Care", "Family Medicine", "Women's Health", "Pediatrics", "Adult Health", "Geriatrics", "Preventive Care", "Chronic Disease Management"],
    readinessDomains: ["Health Promotion", "Primary Care", "Diagnostics", "Management"],
    specialtyLessonTarget: 350,
    specialtyQuestionTarget: 2500,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
  {
    id: "agpcnp",
    tag: "AGPCNP",
    label: "Adult-Gerontology Primary Care Nurse Practitioner",
    certification: "AGPCNP",
    lifecycle: "active",
    existingExamPathwayId: "us-np-agpcnp",
    focusAreas: ["Adult Medicine", "Geriatrics", "Complex Chronic Disease", "Polypharmacy", "Functional Assessment", "Long-Term Care", "Palliative Care"],
    readinessDomains: ["Adult Medicine", "Geriatrics", "Complex Chronic Disease", "Polypharmacy", "Functional Assessment"],
    specialtyLessonTarget: 300,
    specialtyQuestionTarget: 2000,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
  {
    id: "pmhnp",
    tag: "PMHNP",
    label: "Psychiatric-Mental Health Nurse Practitioner",
    certification: "PMHNP",
    lifecycle: "active",
    existingExamPathwayId: "us-np-pmhnp",
    focusAreas: ["Mood Disorders", "Anxiety Disorders", "Psychotic Disorders", "Substance Use", "Therapeutic Communication", "Psychotherapy", "Psychopharmacology", "Crisis Intervention", "Behavioral Health"],
    readinessDomains: ["Assessment", "Diagnosis", "Treatment", "Medication Management"],
    specialtyLessonTarget: 350,
    specialtyQuestionTarget: 2200,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
  {
    id: "whnp",
    tag: "WHNP",
    label: "Women's Health Nurse Practitioner",
    certification: "WHNP",
    lifecycle: "active",
    existingExamPathwayId: "us-np-whnp",
    focusAreas: ["Gynecology", "Prenatal Care", "Postpartum Care", "Contraception", "Menopause", "Reproductive Endocrinology", "Women's Preventive Care"],
    readinessDomains: ["Gynecology", "Prenatal Care", "Reproductive Health", "Women's Preventive Care"],
    specialtyLessonTarget: 250,
    specialtyQuestionTarget: 1600,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
  {
    id: "pnp-pc",
    tag: "PNP_PC",
    label: "Pediatric Primary Care Nurse Practitioner",
    certification: "PNP-PC",
    lifecycle: "active",
    existingExamPathwayId: "us-np-pnp-pc",
    focusAreas: ["Growth & Development", "Pediatric Assessment", "Common Pediatric Conditions", "Preventive Care", "Vaccinations", "Pediatric Pharmacology", "Family-Centered Care"],
    readinessDomains: ["Growth & Development", "Pediatric Assessment", "Preventive Care", "Pediatric Pharmacology"],
    specialtyLessonTarget: 275,
    specialtyQuestionTarget: 1800,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
  {
    id: "pnp-ac",
    tag: "PNP_AC",
    label: "Pediatric Acute Care Nurse Practitioner",
    certification: "PNP-AC",
    lifecycle: "hidden_development",
    existingExamPathwayId: null,
    focusAreas: ["Pediatric Critical Care", "Acute Illness", "Emergency Pediatrics", "Complex Care", "Hospital-Based Management"],
    readinessDomains: ["Pediatric Acute Illness", "Emergency Pediatrics", "Complex Care", "Hospital Management"],
    specialtyLessonTarget: 250,
    specialtyQuestionTarget: 1600,
    sharedCoreTags: ["NP_CORE"],
    published: false,
    visibleInNavigation: false,
    launchReady: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "acnpc-ag",
    tag: "ACNPC_AG",
    label: "Adult-Gerontology Acute Care Nurse Practitioner",
    certification: "ACNPC-AG",
    lifecycle: "hidden_development",
    existingExamPathwayId: null,
    focusAreas: ["Critical Care", "Hemodynamics", "Ventilation", "Shock", "Trauma", "Cardiac Emergencies", "ICU Management", "Hospital Medicine"],
    readinessDomains: ["Critical Care", "Hemodynamics", "Ventilation", "Shock", "Hospital Medicine"],
    specialtyLessonTarget: 300,
    specialtyQuestionTarget: 2000,
    sharedCoreTags: ["NP_CORE"],
    published: false,
    visibleInNavigation: false,
    launchReady: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "enp",
    tag: "ENP",
    label: "Emergency Nurse Practitioner",
    certification: "ENP",
    lifecycle: "hidden_development",
    existingExamPathwayId: null,
    focusAreas: ["Trauma", "Emergency Procedures", "Resuscitation", "Urgent Care", "Emergency Diagnostics", "Toxicology", "Disaster Preparedness"],
    readinessDomains: ["Emergency Assessment", "Resuscitation", "Trauma", "Emergency Diagnostics", "Urgent Care"],
    specialtyLessonTarget: 250,
    specialtyQuestionTarget: 1700,
    sharedCoreTags: ["NP_CORE"],
    published: false,
    visibleInNavigation: false,
    launchReady: false,
    indexable: false,
    adminOnly: true,
  },
  {
    id: "cnple",
    tag: "CNPLE",
    label: "Canadian Nurse Practitioner Licensure Examination",
    certification: "CNPLE",
    lifecycle: "active",
    existingExamPathwayId: "ca-np-cnple",
    focusAreas: ["Canadian NP Competencies", "Clinical Leadership", "Health Promotion", "Population Health", "Advanced Assessment", "Diagnostics", "Prescribing", "Professional Practice"],
    readinessDomains: ["Canadian NP Competencies", "Clinical Decision-Making", "Leadership", "Health Promotion", "Professional Practice"],
    specialtyLessonTarget: 350,
    specialtyQuestionTarget: 2200,
    sharedCoreTags: ["NP_CORE"],
    published: true,
    visibleInNavigation: true,
    launchReady: true,
    indexable: true,
    adminOnly: false,
  },
] as const;

export function summarizeNpCoreLibraryTargets() {
  return NP_CORE_LIBRARY_DOMAINS.reduce(
    (acc, domain) => ({
      lessons: acc.lessons + domain.lessonTarget,
      flashcards: acc.flashcards + domain.flashcardTarget,
      questions: acc.questions + domain.questionTarget,
      clinicalCases: acc.clinicalCases + domain.caseTarget,
    }),
    { lessons: 0, flashcards: 0, questions: 0, clinicalCases: 0 },
  );
}

export function listHiddenDevelopmentNpPathways(): readonly NpCertificationSpecialtyPathway[] {
  return NP_CERTIFICATION_SPECIALTY_PATHWAYS.filter((pathway) => pathway.lifecycle === "hidden_development");
}

export function validateNpCertificationEcosystem(): readonly string[] {
  const issues: string[] = [];
  const coreTargets = summarizeNpCoreLibraryTargets();
  if (coreTargets.lessons < NP_CORE_LIBRARY_TARGETS.lessons) issues.push("NP core lesson target is below 500");
  if (coreTargets.flashcards < NP_CORE_LIBRARY_TARGETS.flashcards) issues.push("NP core flashcard target is below 5,000");
  if (coreTargets.questions < NP_CORE_LIBRARY_TARGETS.questions) issues.push("NP core question target is below 3,000");
  if (coreTargets.clinicalCases < NP_CORE_LIBRARY_TARGETS.clinicalCases) issues.push("NP core clinical case target is below 200");

  const pathwayIds = new Set<string>();
  const tags = new Set<NpCertificationTag>();
  for (const pathway of NP_CERTIFICATION_SPECIALTY_PATHWAYS) {
    if (pathwayIds.has(pathway.id)) issues.push(`Duplicate NP pathway id: ${pathway.id}`);
    pathwayIds.add(pathway.id);
    if (tags.has(pathway.tag)) issues.push(`Duplicate NP certification tag: ${pathway.tag}`);
    tags.add(pathway.tag);
    if (!pathway.sharedCoreTags.includes("NP_CORE")) issues.push(`${pathway.id} must include NP_CORE`);
    if (pathway.readinessDomains.length < 4) issues.push(`${pathway.id} must define at least four readiness domains`);
    if (pathway.lifecycle === "hidden_development") {
      if (pathway.published || pathway.visibleInNavigation || pathway.launchReady || pathway.indexable || !pathway.adminOnly) {
        issues.push(`${pathway.id} hidden development pathway must remain unpublished, hidden, noindex, not launch-ready, and admin-only`);
      }
    }
  }

  for (const domain of NP_CORE_LIBRARY_DOMAINS) {
    if (domain.contentTag !== "NP_CORE") issues.push(`${domain.id} must use NP_CORE tag`);
    if (domain.sharedBy.length < ALL_NP_CERTIFICATION_TAGS.length) issues.push(`${domain.id} must be shared by every NP certification tag`);
  }
  return issues;
}
