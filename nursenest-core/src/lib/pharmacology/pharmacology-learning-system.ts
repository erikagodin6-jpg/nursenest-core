export type PharmacologyCategory = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  topicSlug: string;
  lessonTopic: string;
  estimatedCards: number;
  masteryPct: number;
  safetyFocus: string;
  accentVar: string;
  icon: "pill" | "heart" | "droplet" | "brain" | "wind" | "shield" | "leaf" | "syringe" | "baby" | "activity";
  commonMedications: string[];
  highRiskSituations: string[];
  tierDepth: readonly ("rn" | "pn" | "np" | "allied" | "new_grad" | "pre_nursing")[];
};

export type PharmacologyModeKey =
  | "learn"
  | "flashcards"
  | "practice"
  | "case_studies"
  | "medication_safety"
  | "administration"
  | "exam"
  | "review";

export type PharmacologyMasteryMode = {
  key: PharmacologyModeKey;
  label: string;
  outcome: string;
  href: string;
};

export type PharmacologyClassSection = {
  label: string;
  body: string;
};

export type PharmacologySafetyModule = {
  id: string;
  title: string;
  risk: string;
  linkedCategoryIds: string[];
};

export type PharmacologyCalculationModule = {
  slug: string;
  title: string;
  href: string;
};

export type PharmacologyMasteryProfile = {
  category: PharmacologyCategory;
  sections: PharmacologyClassSection[];
  modes: PharmacologyMasteryMode[];
  questionTypes: string[];
  questionBlueprintCount: number;
  safetyModules: PharmacologySafetyModule[];
  calculationModules: PharmacologyCalculationModule[];
  relationshipMap: Array<{ type: string; examples: string[] }>;
  analytics: string[];
};

const ALL_TIER_DEPTH = ["rn", "pn", "np", "allied", "new_grad", "pre_nursing"] as const;
const NURSING_ADVANCED_DEPTH = ["rn", "pn", "np", "new_grad"] as const;
const NP_ADVANCED_DEPTH = ["np", "rn", "new_grad"] as const;

export const PHARMACOLOGY_CATEGORIES: PharmacologyCategory[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular Medications",
    shortTitle: "Cardiac",
    description: "Antihypertensives, diuretics, antianginals, antidysrhythmics, and heart failure safety.",
    topicSlug: "cardiovascular-pharmacology",
    lessonTopic: "cardiovascular medications",
    estimatedCards: 96,
    masteryPct: 68,
    safetyFocus: "Vitals, potassium, pulse checks, orthostatic risk",
    accentVar: "--semantic-chart-1",
    icon: "heart",
    commonMedications: ["lisinopril", "metoprolol", "furosemide", "amlodipine", "digoxin"],
    highRiskSituations: ["hypotension", "bradycardia", "hyperkalemia", "digoxin toxicity", "orthostatic falls"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "endocrine",
    title: "Endocrine Medications",
    shortTitle: "Endocrine",
    description: "Insulin, oral diabetes agents, thyroid medications, corticosteroids, and glucose safety.",
    topicSlug: "endocrine-pharmacology",
    lessonTopic: "endocrine medications insulin diabetes thyroid steroids",
    estimatedCards: 82,
    masteryPct: 61,
    safetyFocus: "Hypoglycemia, sick-day teaching, timing with meals",
    accentVar: "--semantic-chart-3",
    icon: "droplet",
    commonMedications: ["regular insulin", "insulin glargine", "metformin", "levothyroxine", "prednisone"],
    highRiskSituations: ["hypoglycemia", "steroid hyperglycemia", "sick-day dosing", "thyroid overreplacement"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "neurology",
    title: "Neurology Medications",
    shortTitle: "Neuro",
    description: "Antiseizure medications, Parkinson medications, migraine therapy, sedation, and neurotoxicity risks.",
    topicSlug: "neurology-pharmacology",
    lessonTopic: "neurology medications seizure parkinson migraine sedation",
    estimatedCards: 88,
    masteryPct: 55,
    safetyFocus: "Seizure control, sedation, phenytoin toxicity, Parkinson medication timing",
    accentVar: "--semantic-chart-5",
    icon: "brain",
    commonMedications: ["phenytoin", "levetiracetam", "carbidopa/levodopa", "sumatriptan", "benzodiazepines"],
    highRiskSituations: ["breakthrough seizure", "sedation", "ataxia", "missed Parkinson doses", "respiratory depression"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "psychiatry",
    title: "Psychiatry Medications",
    shortTitle: "Psych",
    description: "Antidepressants, antipsychotics, mood stabilizers, anxiolytics, and safety monitoring.",
    topicSlug: "psychiatric-pharmacology",
    lessonTopic: "psychiatric medications antidepressants antipsychotics mood stabilizers",
    estimatedCards: 86,
    masteryPct: 54,
    safetyFocus: "Suicide risk, serotonin syndrome, EPS, lithium toxicity",
    accentVar: "--semantic-chart-5",
    icon: "brain",
    commonMedications: ["sertraline", "venlafaxine", "haloperidol", "lithium", "lorazepam"],
    highRiskSituations: ["serotonin syndrome", "neuroleptic malignant syndrome", "lithium toxicity", "QT prolongation"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "respiratory",
    title: "Respiratory Medications",
    shortTitle: "Respiratory",
    description: "Bronchodilators, inhaled steroids, oxygen-adjacent medication teaching, and COPD/asthma safety.",
    topicSlug: "respiratory-pharmacology",
    lessonTopic: "respiratory medications bronchodilators inhaled steroids",
    estimatedCards: 64,
    masteryPct: 72,
    safetyFocus: "Inhaler sequence, tremor, tachycardia, rescue vs controller",
    accentVar: "--semantic-info",
    icon: "wind",
    commonMedications: ["albuterol", "ipratropium", "fluticasone", "prednisone", "montelukast"],
    highRiskSituations: ["rescue vs controller confusion", "tachycardia", "oral thrush", "COPD oxygen caution"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "anti-infectives",
    title: "Infectious Disease / Antibiotics",
    shortTitle: "Antibiotics",
    description: "Antibiotic classes, culture timing, allergic reactions, C. difficile risk, and patient teaching.",
    topicSlug: "anti-infective-pharmacology",
    lessonTopic: "antibiotics anti infective medications",
    estimatedCards: 78,
    masteryPct: 64,
    safetyFocus: "Allergy, anaphylaxis, superinfection, renal considerations",
    accentVar: "--semantic-success",
    icon: "shield",
    commonMedications: ["amoxicillin", "ceftriaxone", "vancomycin", "gentamicin", "metronidazole"],
    highRiskSituations: ["anaphylaxis", "C. difficile", "renal dosing", "peak/trough toxicity"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "pain-sedation",
    title: "Pain Management",
    shortTitle: "Pain",
    description: "Opioids, non-opioids, NSAIDs, acetaminophen safety, reversal agents, and reassessment.",
    topicSlug: "pain-management-pharmacology",
    lessonTopic: "pain medications opioids nsaids acetaminophen",
    estimatedCards: 72,
    masteryPct: 58,
    safetyFocus: "Respirations, sedation scale, falls, acetaminophen limits",
    accentVar: "--semantic-warning",
    icon: "pill",
    commonMedications: ["morphine", "hydromorphone", "naloxone", "acetaminophen", "ibuprofen"],
    highRiskSituations: ["respiratory depression", "sedation", "falls", "GI bleeding", "acetaminophen overdose"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "high-alert",
    title: "High-Alert + Emergency Medications",
    shortTitle: "High-alert",
    description: "Insulin, anticoagulants, opioids, emergency medications, and medication-error prevention.",
    topicSlug: "high-alert-emergency-pharmacology",
    lessonTopic: "high alert medications emergency medications",
    estimatedCards: 104,
    masteryPct: 49,
    safetyFocus: "Independent double checks, antidotes, hold parameters",
    accentVar: "--semantic-danger",
    icon: "syringe",
    commonMedications: ["insulin", "heparin", "warfarin", "morphine", "potassium chloride"],
    highRiskSituations: ["wrong dose", "wrong concentration", "antidote delay", "independent double-check miss"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "maternal-peds",
    title: "Maternal, Newborn + Pediatric Pharmacology",
    shortTitle: "Maternal + Peds",
    description: "Pregnancy safety, newborn medications, pediatric dose checks, and family teaching.",
    topicSlug: "maternal-pediatric-pharmacology",
    lessonTopic: "maternal newborn pediatric pharmacology",
    estimatedCards: 58,
    masteryPct: 52,
    safetyFocus: "Weight-based dosing, pregnancy contraindications, parent teaching",
    accentVar: "--semantic-chart-4",
    icon: "baby",
    commonMedications: ["oxytocin", "magnesium sulfate", "vitamin K", "erythromycin eye ointment", "pediatric acetaminophen"],
    highRiskSituations: ["weight-based dose error", "magnesium toxicity", "pregnancy contraindication", "parent teaching gap"],
    tierDepth: ["rn", "pn", "np", "new_grad", "pre_nursing"],
  },
  {
    id: "natural-supplements",
    title: "Natural Supplements + Herbal Medicine",
    shortTitle: "Supplements",
    description: "Herbal interactions, contraindications, integrative medicine teaching, and safe disclosure.",
    topicSlug: "natural-supplements-herbal-medicine",
    lessonTopic: "natural supplements herbal medicine interactions",
    estimatedCards: 46,
    masteryPct: 44,
    safetyFocus: "Warfarin, surgery holds, pregnancy, liver risk, disclosure",
    accentVar: "--semantic-chart-2",
    icon: "leaf",
    commonMedications: ["St. John's wort", "ginkgo", "ginseng", "vitamin D", "iron"],
    highRiskSituations: ["warfarin interaction", "serotonin syndrome", "surgery bleeding risk", "pregnancy contraindication", "liver toxicity"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "med-surg",
    title: "Med-Surg Pharmacology",
    shortTitle: "Med-Surg",
    description: "Common medication decisions across GI, renal, fluids, electrolytes, and chronic disease.",
    topicSlug: "med-surg-pharmacology",
    lessonTopic: "med surg pharmacology renal gi electrolytes",
    estimatedCards: 92,
    masteryPct: 66,
    safetyFocus: "Labs, renal dosing cues, dehydration, adverse-effect recognition",
    accentVar: "--semantic-brand",
    icon: "activity",
    commonMedications: ["omeprazole", "ondansetron", "lactulose", "potassium chloride", "spironolactone"],
    highRiskSituations: ["renal dosing", "electrolyte shifts", "QT prolongation", "dehydration", "polypharmacy"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "gi",
    title: "GI Medications",
    shortTitle: "GI",
    description: "Antiemetics, PPIs, laxatives, antidiarrheals, liver medications, and GI bleeding risk.",
    topicSlug: "gi-pharmacology",
    lessonTopic: "gastrointestinal medications antiemetics ppi laxatives liver",
    estimatedCards: 74,
    masteryPct: 59,
    safetyFocus: "QT risk, constipation, GI bleed, liver function",
    accentVar: "--semantic-brand",
    icon: "activity",
    commonMedications: ["omeprazole", "ondansetron", "metoclopramide", "lactulose", "loperamide"],
    highRiskSituations: ["QT prolongation", "GI bleeding", "hepatic encephalopathy", "bowel obstruction"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "critical-care",
    title: "Critical Care Medications",
    shortTitle: "Critical Care",
    description: "Vasoactive drips, sedation, paralytics, emergency infusions, and ICU monitoring.",
    topicSlug: "critical-care-pharmacology",
    lessonTopic: "critical care medications vasoactive sedation paralytic icu",
    estimatedCards: 110,
    masteryPct: 47,
    safetyFocus: "Titration, line tracing, hemodynamics, sedation scale",
    accentVar: "--semantic-danger",
    icon: "syringe",
    commonMedications: ["norepinephrine", "propofol", "fentanyl", "midazolam", "potassium chloride"],
    highRiskSituations: ["wrong pump channel", "extravasation", "hypotension", "oversedation", "rapid deterioration"],
    tierDepth: ["rn", "np", "new_grad"],
  },
  {
    id: "emergency",
    title: "Emergency Medications",
    shortTitle: "Emergency",
    description: "Code medications, anaphylaxis treatment, reversal agents, and first-response medication decisions.",
    topicSlug: "emergency-pharmacology",
    lessonTopic: "emergency medications code anaphylaxis reversal agents",
    estimatedCards: 98,
    masteryPct: 50,
    safetyFocus: "Right drug, right route, rapid reassessment, antidotes",
    accentVar: "--semantic-danger",
    icon: "syringe",
    commonMedications: ["epinephrine", "atropine", "naloxone", "dextrose", "adenosine"],
    highRiskSituations: ["wrong route epinephrine", "delayed naloxone", "hypoglycemia", "unstable rhythm"],
    tierDepth: ["rn", "pn", "np", "new_grad"],
  },
  {
    id: "iv-medications",
    title: "IV Medications",
    shortTitle: "IV Meds",
    description: "IV push, compatibility, dilution, pump programming, infiltration, and monitoring after administration.",
    topicSlug: "iv-medication-safety",
    lessonTopic: "iv medications compatibility iv push pump administration",
    estimatedCards: 102,
    masteryPct: 51,
    safetyFocus: "Compatibility, dilution, rate, extravasation, pump checks",
    accentVar: "--semantic-info",
    icon: "syringe",
    commonMedications: ["ceftriaxone", "furosemide IV", "potassium chloride", "vancomycin", "morphine IV"],
    highRiskSituations: ["IV push too fast", "incompatible line", "extravasation", "wrong pump rate"],
    tierDepth: ["rn", "np", "new_grad"],
  },
  {
    id: "controlled-substances",
    title: "Controlled Substances",
    shortTitle: "Controlled",
    description: "Opioids, benzodiazepines, stimulant safety, documentation, wasting, diversion prevention, and monitoring.",
    topicSlug: "controlled-substances-pharmacology",
    lessonTopic: "controlled substances opioids benzodiazepines diversion documentation",
    estimatedCards: 68,
    masteryPct: 56,
    safetyFocus: "Sedation, wasting, count accuracy, diversion risk",
    accentVar: "--semantic-warning",
    icon: "pill",
    commonMedications: ["morphine", "hydromorphone", "fentanyl", "lorazepam", "methylphenidate"],
    highRiskSituations: ["respiratory depression", "incorrect wasting", "diversion signal", "duplicate sedation"],
    tierDepth: NURSING_ADVANCED_DEPTH,
  },
  {
    id: "antimicrobials",
    title: "Antimicrobials",
    shortTitle: "Antimicrobials",
    description: "Antibiotics, antivirals, antifungals, stewardship, cultures, allergies, and therapeutic monitoring.",
    topicSlug: "antimicrobial-pharmacology",
    lessonTopic: "antimicrobials antibiotics antivirals antifungals stewardship",
    estimatedCards: 112,
    masteryPct: 60,
    safetyFocus: "Culture timing, allergy, renal dose, resistance",
    accentVar: "--semantic-success",
    icon: "shield",
    commonMedications: ["vancomycin", "piperacillin-tazobactam", "acyclovir", "fluconazole", "azithromycin"],
    highRiskSituations: ["red man reaction", "nephrotoxicity", "anaphylaxis", "missed cultures"],
    tierDepth: ALL_TIER_DEPTH,
  },
  {
    id: "oncology",
    title: "Oncology Medications",
    shortTitle: "Oncology",
    description: "Chemotherapy precautions, extravasation, immunotherapy reactions, antiemetics, and neutropenia risk.",
    topicSlug: "oncology-pharmacology",
    lessonTopic: "oncology medications chemotherapy immunotherapy neutropenia",
    estimatedCards: 84,
    masteryPct: 46,
    safetyFocus: "Extravasation, PPE, neutropenia, infusion reaction",
    accentVar: "--semantic-danger",
    icon: "shield",
    commonMedications: ["doxorubicin", "cisplatin", "paclitaxel", "pembrolizumab", "ondansetron"],
    highRiskSituations: ["extravasation", "febrile neutropenia", "infusion reaction", "PPE breach"],
    tierDepth: ["rn", "np", "new_grad"],
  },
  {
    id: "immunology-transplant",
    title: "Immunology + Transplant Medications",
    shortTitle: "Immunology",
    description: "Immunosuppressants, biologics, transplant rejection prevention, infection risk, and monitoring.",
    topicSlug: "immunology-transplant-pharmacology",
    lessonTopic: "immunology transplant medications biologics immunosuppressants",
    estimatedCards: 76,
    masteryPct: 48,
    safetyFocus: "Infection risk, trough levels, rejection cues, vaccine teaching",
    accentVar: "--semantic-chart-2",
    icon: "shield",
    commonMedications: ["tacrolimus", "cyclosporine", "mycophenolate", "adalimumab", "prednisone"],
    highRiskSituations: ["opportunistic infection", "rejection symptoms", "toxic trough", "live vaccine exposure"],
    tierDepth: NP_ADVANCED_DEPTH,
  },
  {
    id: "vitamins-minerals",
    title: "Vitamins + Minerals",
    shortTitle: "Vitamins",
    description: "Iron, vitamin D, B12, electrolytes, fat-soluble vitamins, toxicity, and supplement teaching.",
    topicSlug: "vitamins-minerals-pharmacology",
    lessonTopic: "vitamins minerals iron b12 vitamin d electrolyte supplements",
    estimatedCards: 62,
    masteryPct: 53,
    safetyFocus: "Toxicity, deficiency, absorption, interactions",
    accentVar: "--semantic-chart-2",
    icon: "leaf",
    commonMedications: ["iron", "vitamin B12", "vitamin D", "potassium", "magnesium"],
    highRiskSituations: ["iron overdose", "hyperkalemia", "fat-soluble vitamin toxicity", "renal impairment"],
    tierDepth: ALL_TIER_DEPTH,
  },
];

export const PHARMACOLOGY_SAFETY_MODULES: PharmacologySafetyModule[] = [
  { id: "lasa", title: "Look-alike / sound-alike medications", risk: "Wrong medication selection or transcription.", linkedCategoryIds: ["high-alert", "controlled-substances"] },
  { id: "insulin-errors", title: "Insulin errors", risk: "Wrong insulin, timing, meal coordination, or concentration.", linkedCategoryIds: ["endocrine", "high-alert"] },
  { id: "anticoagulant-errors", title: "Anticoagulant errors", risk: "Bleeding, missed labs, duplicate therapy, or reversal delay.", linkedCategoryIds: ["cardiovascular", "high-alert"] },
  { id: "opioid-safety", title: "Opioid safety", risk: "Sedation, respiratory depression, falls, and naloxone delay.", linkedCategoryIds: ["pain-sedation", "controlled-substances"] },
  { id: "pediatric-dosing", title: "Pediatric dosing", risk: "Weight-based dosing and concentration errors.", linkedCategoryIds: ["maternal-peds", "high-alert"] },
  { id: "iv-push", title: "IV push medications", risk: "Wrong dilution, rate, compatibility, or monitoring.", linkedCategoryIds: ["iv-medications", "critical-care"] },
  { id: "chemo-precautions", title: "Chemotherapy precautions", risk: "Extravasation, PPE breach, and neutropenic complications.", linkedCategoryIds: ["oncology"] },
  { id: "blood-products", title: "Blood product administration", risk: "Wrong product, reaction recognition, and transfusion stop criteria.", linkedCategoryIds: ["high-alert", "critical-care"] },
  { id: "controlled-substances", title: "Controlled substances", risk: "Diversion prevention, wasting, documentation, and oversedation.", linkedCategoryIds: ["controlled-substances"] },
  { id: "med-rec", title: "Medication reconciliation", risk: "Duplicate therapy, omissions, contraindications, and transition-of-care harm.", linkedCategoryIds: ["med-surg", "natural-supplements"] },
];

export const PHARMACOLOGY_CALCULATION_MODULES: PharmacologyCalculationModule[] = [
  { slug: "tablets", title: "Tablet calculations", href: "/app/med-calculations/tablets/tablet-dose-fractions" },
  { slug: "liquid-medications", title: "Liquid calculations", href: "/app/med-calculations/liquid-medications/liquid-dose-volumes" },
  { slug: "weight-based-dosing", title: "Weight-based dosing", href: "/app/med-calculations/weight-based-dosing/weight-based-adult-doses" },
  { slug: "pediatric-dosing", title: "Pediatric dosing", href: "/app/med-calculations/pediatric-dosing/pediatric-safe-dose-range" },
  { slug: "iv-flow-rates", title: "IV flow rates", href: "/app/med-calculations/iv-flow-rates/gravity-iv-flow-rates" },
  { slug: "drip-factor-gtt-min", title: "Drip factors", href: "/app/med-calculations/drip-factor-gtt-min/drip-factor-whole-drops" },
  { slug: "iv-pump-ml-hr", title: "mL/hr pump rates", href: "/app/med-calculations/iv-pump-ml-hr/iv-pump-ml-hr" },
  { slug: "insulin-dosing", title: "Insulin dosage safety", href: "/app/med-calculations/insulin-dosing/insulin-correction-scales" },
  { slug: "heparin-protocols", title: "mcg/kg/min and heparin protocols", href: "/app/med-calculations/heparin-protocols/heparin-weight-based-protocols" },
];

export const PHARMACOLOGY_QUESTION_TYPES = [
  "MCQ",
  "SATA",
  "Bowtie",
  "Matrix",
  "Hotspot",
  "Cloze",
  "Case studies",
  "Prioritization",
  "Delegation",
  "Medication calculations",
  "Dosage safety",
  "Medication reconciliation",
  "Clinical judgment",
] as const;

export function getPharmacologyCategory(id: string | null | undefined): PharmacologyCategory | null {
  const normalized = id?.trim().toLowerCase();
  if (!normalized) return null;
  return PHARMACOLOGY_CATEGORIES.find((category) => category.id === normalized || category.topicSlug === normalized) ?? null;
}

export function pharmacologyFlashcardsHref(pathwayId: string, category?: PharmacologyCategory | null, cardLimit = 20): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("includeCards", "1");
  q.set("shuffle", "1");
  q.set("cardLimit", String(cardLimit));
  q.set("topic", category?.topicSlug ?? "pharmacology");
  return `/app/flashcards/custom?${q.toString()}`;
}

export function pharmacologyLessonsHref(pathwayId: string, category?: PharmacologyCategory | null): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("topic", category?.lessonTopic ?? "pharmacology");
  return `/app/lessons?${q.toString()}`;
}

export function pharmacologyPracticeHref(pathwayId: string, category?: PharmacologyCategory | null): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("studyMode", "weak");
  q.set("topic", category?.topicSlug ?? "pharmacology");
  return `/app/questions?${q.toString()}`;
}

export function pharmacologyCaseStudyHref(pathwayId: string, category?: PharmacologyCategory | null): string {
  const q = new URLSearchParams();
  q.set("pathwayId", pathwayId);
  q.set("preset", "case_study");
  q.set("topic", category?.topicSlug ?? "pharmacology");
  return `/app/questions?${q.toString()}`;
}

export function buildPharmacologyMasteryProfile(
  pathwayId: string,
  category: PharmacologyCategory,
): PharmacologyMasteryProfile {
  const flashcardsHref = pharmacologyFlashcardsHref(pathwayId, category, category.id === "high-alert" ? 25 : 20);
  const lessonsHref = pharmacologyLessonsHref(pathwayId, category);
  const practiceHref = pharmacologyPracticeHref(pathwayId, category);
  const caseHref = pharmacologyCaseStudyHref(pathwayId, category);
  const safetyModules = PHARMACOLOGY_SAFETY_MODULES.filter((module) =>
    module.linkedCategoryIds.includes(category.id),
  );
  const calculationModules = PHARMACOLOGY_CALCULATION_MODULES.filter((module) => {
    if (category.id === "endocrine") return module.slug === "insulin-dosing" || module.slug === "pediatric-dosing";
    if (category.id === "maternal-peds") return module.slug === "pediatric-dosing" || module.slug === "weight-based-dosing";
    if (category.id === "iv-medications" || category.id === "critical-care") return module.slug.includes("iv") || module.slug.includes("drip") || module.slug === "heparin-protocols";
    if (category.id === "high-alert") return ["insulin-dosing", "heparin-protocols", "weight-based-dosing"].includes(module.slug);
    return ["tablets", "liquid-medications", "weight-based-dosing"].includes(module.slug);
  });

  return {
    category,
    sections: [
      { label: "Overview", body: category.description },
      { label: "Mechanism of action", body: `Understand what this class changes in the body and why that mechanism produces both therapeutic effects and predictable adverse effects.` },
      { label: "Common medications", body: category.commonMedications.join(", ") },
      { label: "Indications", body: `Used when the patient problem matches ${category.lessonTopic}; learners connect the indication to the mechanism before memorizing names.` },
      { label: "Contraindications", body: `Screen allergies, pregnancy status when relevant, organ function, interacting drugs, and condition-specific hold parameters before administration.` },
      { label: "Adverse effects", body: `Highest-yield risks: ${category.highRiskSituations.join(", ")}.` },
      { label: "Nursing implications", body: `Assess baseline status, verify orders, monitor response, identify deterioration, and escalate unsafe medication patterns.` },
      { label: "Patient teaching", body: "Teach purpose, timing, what to avoid, side effects to report, missed-dose guidance, and when to seek urgent help." },
      { label: "Monitoring", body: category.safetyFocus },
      { label: "Lab considerations", body: "Connect labs to mechanism: renal clearance, liver injury, electrolytes, anticoagulation, glucose, trough levels, or CBC risk depending on class." },
      { label: "Exam tips", body: "Exam items reward safety, contraindication recognition, monitoring, patient teaching, prioritization, and delegation boundaries." },
      { label: "Clinical pearls", body: "Prototype drugs make unfamiliar names easier: identify suffixes, mechanism family, expected response, and the major harm pattern." },
      { label: "Memory aids", body: "Study mechanism → monitoring → major adverse effect → patient teaching as one chain instead of isolated drug facts." },
      { label: "Safety alerts", body: safetyModules.length ? safetyModules.map((module) => module.title).join(", ") : "Medication reconciliation and adverse-effect monitoring." },
      { label: "High-risk situations", body: category.highRiskSituations.join(", ") },
    ],
    modes: [
      { key: "learn", label: "Learn Mode", outcome: "Mechanism, indications, contraindications, monitoring, pearls, and memory aids.", href: lessonsHref },
      { key: "flashcards", label: "Flashcard Mode", outcome: "Spaced recall for class prototypes, adverse effects, and teaching.", href: flashcardsHref },
      { key: "practice", label: "Practice Questions", outcome: "Medication reasoning, safety, prioritization, and delegation items.", href: practiceHref },
      { key: "case_studies", label: "Case Studies", outcome: "Patient scenarios that connect medication decisions to changing status.", href: caseHref },
      { key: "medication_safety", label: "Medication Safety", outcome: "High-alert, contraindication, interaction, and error-prevention drills.", href: practiceHref },
      { key: "administration", label: "Medication Administration", outcome: "Rights, route, timing, compatibility, response monitoring, and documentation.", href: "/app/clinical-skills" },
      { key: "exam", label: "Exam Mode", outcome: "Timed NCLEX/REx-PN style medication questions.", href: `/app/questions?pathwayId=${encodeURIComponent(pathwayId)}&topic=${encodeURIComponent(category.topicSlug)}&timed=1` },
      { key: "review", label: "Review Mode", outcome: "Retest weak classes and keep high-risk medication readiness from decaying.", href: flashcardsHref },
    ],
    questionTypes: [...PHARMACOLOGY_QUESTION_TYPES],
    questionBlueprintCount: 100,
    safetyModules,
    calculationModules,
    relationshipMap: [
      { type: "Drug class relationships", examples: [`${category.shortTitle} prototypes`, "suffix patterns", "prototype-to-class transfer"] },
      { type: "Mechanism relationships", examples: ["mechanism → intended response", "mechanism → adverse effect", "mechanism → monitoring"] },
      { type: "Side-effect relationships", examples: category.highRiskSituations.slice(0, 4) },
      { type: "Contraindication relationships", examples: ["allergy", "pregnancy or pediatric caution", "renal/hepatic impairment", "interacting medications"] },
      { type: "Clinical-use relationships", examples: ["indication", "first nursing action", "patient teaching", "when to hold and clarify"] },
    ],
    analytics: [
      "Drug class mastery",
      "Medication safety score",
      "Calculation score",
      "Retention score",
      "High-risk medication readiness",
      "Weak medication classes",
      "Medication confidence",
    ],
  };
}

export function pharmacologyCategoriesForTier(
  tier: "rn" | "pn" | "np" | "allied" | "new_grad" | "pre_nursing",
): PharmacologyCategory[] {
  return PHARMACOLOGY_CATEGORIES.filter((category) => category.tierDepth.includes(tier));
}
