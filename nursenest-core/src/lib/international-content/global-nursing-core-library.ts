export type GlobalNursingCoreScope = "global" | "country_specific" | "exam_specific";
export type GlobalNursingCoreSystem =
  | "adult-health"
  | "cardiovascular"
  | "respiratory"
  | "endocrine"
  | "renal"
  | "neurological"
  | "maternal-newborn"
  | "pediatrics"
  | "mental-health"
  | "pharmacology"
  | "labs"
  | "ecg"
  | "clinical-skills"
  | "leadership"
  | "health-system";

export type GlobalNursingCoreTopic = {
  readonly id: string;
  readonly title: string;
  readonly system: GlobalNursingCoreSystem;
  readonly scope: GlobalNursingCoreScope;
  readonly reusableAcrossCountries: boolean;
  readonly countryOverlays: readonly string[];
  readonly examOverlays: readonly string[];
  readonly draftOnly: true;
  readonly published: false;
  readonly visibleInNavigation: false;
  readonly learnerAccessible: false;
  readonly launchReady: false;
};

export const GLOBAL_NURSING_CORE_LIBRARY: readonly GlobalNursingCoreTopic[] = [
  {
    id: "heart-failure",
    title: "Heart Failure",
    system: "cardiovascular",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["documentation expectations", "discharge resources", "scope and escalation language"],
    examOverlays: ["NCLEX clinical judgment", "NMC CBT safe practice", "NMBA professional practice", "NCNZ cultural safety"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "copd",
    title: "COPD",
    system: "respiratory",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["community respiratory supports", "smoking cessation pathways"],
    examOverlays: ["oxygen safety", "ABG interpretation", "deterioration recognition"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "diabetes",
    title: "Diabetes",
    system: "endocrine",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["screening programs", "medication access", "patient education resources"],
    examOverlays: ["hypoglycemia priority", "sick-day rules", "insulin safety"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "sepsis",
    title: "Sepsis",
    system: "adult-health",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["local escalation tools", "NEWS2 in UK", "facility rapid response policies"],
    examOverlays: ["early recognition", "fluid resuscitation", "antibiotic timing", "clinical deterioration"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "shock",
    title: "Shock",
    system: "adult-health",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["role-specific escalation expectations"],
    examOverlays: ["hypovolemic", "cardiogenic", "septic", "anaphylactic", "neurogenic"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "electrolytes",
    title: "Electrolyte Imbalances",
    system: "labs",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["unit conventions", "critical result reporting"],
    examOverlays: ["potassium ECG changes", "sodium neuro assessment", "calcium safety"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "ecg-basics",
    title: "ECG Interpretation Basics",
    system: "ecg",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["scope of interpretation", "notification pathways"],
    examOverlays: ["atrial fibrillation", "heart block", "VT/VF", "ischemia recognition"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "abgs",
    title: "ABG Interpretation",
    system: "respiratory",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["oxygen delivery policies", "critical reporting"],
    examOverlays: ["respiratory acidosis", "metabolic acidosis", "compensation", "ventilation vs oxygenation"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "pharmacology-safety",
    title: "Pharmacology Safety",
    system: "pharmacology",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["drug names", "controlled medication rules", "scope of prescribing"],
    examOverlays: ["high-alert medications", "rights of medication administration", "adverse effects"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "lab-interpretation",
    title: "Lab Interpretation",
    system: "labs",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["reference ranges", "critical value workflows"],
    examOverlays: ["CBC", "renal function", "liver enzymes", "coagulation", "infection markers"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "clinical-assessment",
    title: "Clinical Assessment",
    system: "clinical-skills",
    scope: "global",
    reusableAcrossCountries: true,
    countryOverlays: ["documentation standards", "professional accountability"],
    examOverlays: ["focused assessment", "deterioration", "handoff", "safety checks"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "delegation",
    title: "Delegation",
    system: "leadership",
    scope: "country_specific",
    reusableAcrossCountries: false,
    countryOverlays: ["Canada regulated roles", "U.S. UAP/LPN scope", "UK accountability", "Australia enrolled nurse context"],
    examOverlays: ["NCLEX delegation", "NMC professional accountability", "NMBA standards", "NCNZ competencies"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
  {
    id: "health-system-structure",
    title: "Health System Structure",
    system: "health-system",
    scope: "country_specific",
    reusableAcrossCountries: false,
    countryOverlays: ["Medicare", "Medicaid", "NHS", "AHPRA/NMBA", "NCNZ", "Te Tiriti", "Aboriginal health"],
    examOverlays: ["professional standards", "legal responsibilities", "equity and access"],
    draftOnly: true,
    published: false,
    visibleInNavigation: false,
    learnerAccessible: false,
    launchReady: false,
  },
] as const;

export function listGlobalReusableNursingCoreTopics(): readonly GlobalNursingCoreTopic[] {
  return GLOBAL_NURSING_CORE_LIBRARY.filter((topic) => topic.reusableAcrossCountries);
}

export function listCountrySpecificNursingCoreTopics(): readonly GlobalNursingCoreTopic[] {
  return GLOBAL_NURSING_CORE_LIBRARY.filter((topic) => topic.scope === "country_specific");
}

export function validateGlobalNursingCoreLibrary(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const topic of GLOBAL_NURSING_CORE_LIBRARY) {
    if (ids.has(topic.id)) issues.push(`Duplicate global nursing core topic: ${topic.id}`);
    ids.add(topic.id);
    if (!topic.draftOnly || topic.published || topic.visibleInNavigation || topic.learnerAccessible || topic.launchReady) {
      issues.push(`${topic.id} must remain draft-only, unpublished, hidden, inaccessible, and not launch-ready`);
    }
    if (topic.scope === "global" && !topic.reusableAcrossCountries) {
      issues.push(`${topic.id} is global but not reusable`);
    }
  }
  return issues;
}
