import type { ConversionFeature, ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type GlossaryProfession = ConversionProfession | "Multiple";

export type HealthcareTermCategory =
  | "nursing"
  | "respiratory"
  | "paramedic"
  | "laboratory"
  | "medication"
  | "assessment"
  | "clinical_skill"
  | "pre_nursing"
  | "advanced_practice";

export type GlossaryDifficulty = "foundational" | "intermediate" | "advanced";

export type GlossarySystem =
  | "cardiovascular"
  | "respiratory"
  | "neurologic"
  | "renal"
  | "endocrine"
  | "gastrointestinal"
  | "hematology"
  | "pharmacology"
  | "professional_practice"
  | "emergency"
  | "mobility"
  | "laboratory"
  | "general";

export type GlossarySearchIntentPattern =
  | "what_is"
  | "what_does_mean"
  | "difference_between"
  | "why_is_important"
  | "how_is_used"
  | "when_is_used";

export type GlossaryPageBlock =
  | "definition"
  | "pronunciation"
  | "meaning"
  | "clinical_relevance"
  | "why_it_matters"
  | "examples"
  | "common_mistakes"
  | "exam_relevance"
  | "related_terms"
  | "related_lessons"
  | "related_questions";

export type VisualTerminologyAsset = "diagram" | "illustration" | "flowchart" | "table" | "clinical_example";

export type HealthcareGlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  pronunciation?: string;
  profession: GlossaryProfession;
  category: HealthcareTermCategory;
  difficulty: GlossaryDifficulty;
  system: GlossarySystem;
  relatedTerms: readonly string[];
  relatedDiseases: readonly string[];
  relatedSkills: readonly string[];
  relatedMedications: readonly string[];
  relatedLessons: readonly string[];
  visualAssets: readonly VisualTerminologyAsset[];
  searchIntentPatterns: readonly GlossarySearchIntentPattern[];
};

export type GlossaryHub = {
  title: string;
  profession: GlossaryProfession;
  canonicalPath: string;
  termSlugs: readonly string[];
};

export type GlossaryPageContract = {
  termSlug: string;
  requiredBlocks: readonly GlossaryPageBlock[];
  requiredInternalLinks: readonly [
    "diseases",
    "labs",
    "skills",
    "questions",
    "lessons",
    "simulations",
    "care_plans",
    "medication_pages",
  ];
  conversionFeatures: readonly ConversionFeature[];
  createAccountCta: string;
  premiumPreviewCta: string;
};

export type GlossaryAuthorityDashboard = {
  totalTerms: number;
  termsByProfession: Record<string, number>;
  termsByCategory: Record<HealthcareTermCategory, number>;
  termsBySystem: Record<GlossarySystem, number>;
  visualTerminologyTerms: number;
  hubs: readonly GlossaryHub[];
  yearOneTargetMin: 5000;
  yearOneTargetMax: 10000;
  remainingToMinimumTarget: number;
};

const requiredPageBlocks = [
  "definition",
  "pronunciation",
  "meaning",
  "clinical_relevance",
  "why_it_matters",
  "examples",
  "common_mistakes",
  "exam_relevance",
  "related_terms",
  "related_lessons",
  "related_questions",
] as const satisfies readonly GlossaryPageBlock[];

export const HEALTHCARE_GLOSSARY_TERMS: readonly HealthcareGlossaryTerm[] = [
  term("preload", "Preload", "The stretch on the ventricle before contraction, closely related to ventricular filling volume.", "RN", "nursing", "intermediate", "cardiovascular", ["afterload", "cardiac-output", "perfusion"], ["heart-failure", "shock"], [], [], ["heart-failure"], ["diagram", "clinical_example"]),
  term("afterload", "Afterload", "The resistance the ventricle must overcome to eject blood, influencing workload, blood pressure response, and heart failure management.", "RN", "nursing", "intermediate", "cardiovascular", ["preload", "cardiac-output"], ["heart-failure", "hypertension"], [], [], ["heart-failure"], ["diagram", "clinical_example"]),
  term("perfusion", "Perfusion", "Blood flow through tissues that delivers oxygen and nutrients and removes waste products.", "Multiple", "assessment", "foundational", "cardiovascular", ["cardiac-output", "shock-index"], ["shock", "sepsis"], ["capillary-refill-assessment"], [], ["shock"], ["flowchart", "clinical_example"]),
  term("cardiac-output", "Cardiac Output", "The volume of blood pumped by the heart each minute, calculated as stroke volume multiplied by heart rate.", "RN", "nursing", "intermediate", "cardiovascular", ["preload", "afterload", "perfusion"], ["heart-failure", "shock"], [], [], ["heart-failure"], ["diagram", "table"]),
  term("auscultation", "Auscultation", "Listening to internal body sounds with a stethoscope during assessment.", "Multiple", "assessment", "foundational", "general", ["crackles", "wheezes"], ["pneumonia", "heart-failure"], ["respiratory-assessment"], [], ["assessment-foundations"], ["clinical_example"]),
  term("delegation", "Delegation", "Assigning a task to another team member while retaining accountability for appropriate supervision.", "RN", "nursing", "intermediate", "professional_practice", ["prioritization", "scope-of-practice"], [], [], [], ["delegation"], ["flowchart", "table"]),
  term("prioritization", "Prioritization", "Ordering clinical actions by urgency, safety risk, instability, and expected patient outcome.", "RN", "nursing", "intermediate", "professional_practice", ["delegation", "abc-framework"], [], [], [], ["prioritization"], ["flowchart", "clinical_example"]),
  term("hypoxia", "Hypoxia", "Inadequate oxygen at the tissue level, which can cause confusion, chest pain, cyanosis, tachycardia, and urgent deterioration.", "Multiple", "assessment", "foundational", "respiratory", ["hypoxemia", "dyspnea"], ["copd", "pneumonia", "respiratory-failure"], ["oxygen-administration"], [], ["respiratory-assessment"], ["diagram", "clinical_example"]),
  term("dyspnea", "Dyspnea", "Subjective sensation of difficult or uncomfortable breathing.", "Multiple", "assessment", "foundational", "respiratory", ["orthopnea", "hypoxia"], ["heart-failure", "copd", "asthma"], ["respiratory-assessment"], [], ["respiratory-assessment"], ["clinical_example"]),
  term("orthopnea", "Orthopnea", "Shortness of breath that worsens when lying flat and improves when sitting upright.", "RN", "nursing", "intermediate", "respiratory", ["dyspnea", "edema"], ["heart-failure"], [], [], ["heart-failure"], ["clinical_example"]),
  term("edema", "Edema", "Swelling caused by fluid accumulation in tissues, often assessed by location, symmetry, pitting depth, and change over time.", "Multiple", "assessment", "foundational", "cardiovascular", ["ascites", "fluid-volume-excess"], ["heart-failure", "kidney-disease"], ["fluid-assessment"], [], ["fluid-balance"], ["illustration", "clinical_example"]),
  term("ascites", "Ascites", "Abnormal fluid accumulation in the peritoneal cavity that can signal liver disease, malignancy, heart failure, or severe fluid imbalance.", "RN", "nursing", "intermediate", "gastrointestinal", ["edema", "fluid-volume-excess"], ["cirrhosis", "heart-failure"], [], [], ["gastrointestinal"], ["illustration"]),
  term("peep", "PEEP", "Positive end-expiratory pressure that helps keep alveoli open at the end of exhalation.", "RT", "respiratory", "advanced", "respiratory", ["cpap", "tidal-volume", "fio2"], ["ards", "respiratory-failure"], ["ventilator-management"], [], ["mechanical-ventilation"], ["diagram", "table"]),
  term("cpap", "CPAP", "Continuous positive airway pressure delivered throughout the breathing cycle.", "RT", "respiratory", "intermediate", "respiratory", ["peep", "bipap"], ["sleep-apnea", "respiratory-failure"], ["oxygen-therapy"], [], ["oxygen-therapy"], ["diagram"]),
  term("bipap", "BiPAP", "Bilevel positive airway pressure using separate inspiratory and expiratory pressure levels.", "RT", "respiratory", "advanced", "respiratory", ["cpap", "peep"], ["copd", "respiratory-failure"], ["noninvasive-ventilation"], [], ["mechanical-ventilation"], ["diagram", "table"]),
  term("tidal-volume", "Tidal Volume", "The volume of air moved in or out of the lungs with each breath.", "RT", "respiratory", "intermediate", "respiratory", ["minute-ventilation", "peep"], ["ards"], ["ventilator-management"], [], ["mechanical-ventilation"], ["diagram", "table"]),
  term("minute-ventilation", "Minute Ventilation", "The total volume of air moved in or out of the lungs each minute.", "RT", "respiratory", "advanced", "respiratory", ["tidal-volume", "respiratory-rate"], ["hypercapnia"], ["ventilator-management"], [], ["mechanical-ventilation"], ["table"]),
  term("fio2", "FiO2", "Fraction of inspired oxygen, or the percentage of oxygen delivered in the gas mixture.", "RT", "respiratory", "foundational", "respiratory", ["peep", "hypoxemia"], ["copd", "respiratory-failure"], ["oxygen-therapy"], [], ["oxygen-therapy"], ["table"]),
  term("abg", "ABG", "Arterial blood gas test measuring pH, PaCO2, PaO2, bicarbonate, and oxygenation status.", "Multiple", "laboratory", "intermediate", "laboratory", ["hypercapnia", "hypoxemia"], ["copd", "dka", "respiratory-failure"], ["abg-interpretation"], [], ["abg-interpretation"], ["flowchart", "table"]),
  term("hypercapnia", "Hypercapnia", "Elevated carbon dioxide in the blood, often from hypoventilation.", "RT", "respiratory", "advanced", "respiratory", ["abg", "minute-ventilation"], ["copd", "respiratory-failure"], ["ventilator-management"], [], ["abg-interpretation"], ["clinical_example"]),
  term("hypoxemia", "Hypoxemia", "Low oxygen level in arterial blood, commonly identified through pulse oximetry trends, ABGs, symptoms, and respiratory assessment.", "RT", "respiratory", "intermediate", "respiratory", ["hypoxia", "fio2"], ["pneumonia", "pulmonary-embolism"], ["oxygen-therapy"], [], ["respiratory-assessment"], ["clinical_example"]),
  term("primary-survey", "Primary Survey", "A rapid first assessment focused on immediate life threats, typically organized around airway, breathing, circulation, disability, and exposure.", "Paramedic", "paramedic", "foundational", "emergency", ["secondary-survey", "scene-size-up"], ["trauma", "shock"], ["trauma-assessment"], [], ["paramedic-assessment"], ["flowchart"]),
  term("secondary-survey", "Secondary Survey", "A more detailed assessment completed after immediate life threats are addressed.", "Paramedic", "paramedic", "foundational", "emergency", ["primary-survey", "rapid-trauma-assessment"], ["trauma"], ["trauma-assessment"], [], ["paramedic-assessment"], ["flowchart"]),
  term("scene-size-up", "Scene Size-Up", "Initial assessment of scene safety, hazards, mechanism, patient count, and resources needed.", "Paramedic", "paramedic", "foundational", "emergency", ["primary-survey", "triage"], ["trauma"], ["scene-assessment"], [], ["paramedic-assessment"], ["flowchart"]),
  term("rapid-trauma-assessment", "Rapid Trauma Assessment", "A fast head-to-toe assessment used to identify life-threatening traumatic injuries.", "Paramedic", "paramedic", "intermediate", "emergency", ["primary-survey", "secondary-survey"], ["trauma", "shock"], ["trauma-assessment"], [], ["trauma"], ["clinical_example"]),
  term("gcs", "GCS", "Glasgow Coma Scale, a standardized score for eye, verbal, and motor response.", "Paramedic", "paramedic", "intermediate", "neurologic", ["level-of-consciousness"], ["stroke", "traumatic-brain-injury"], ["neurologic-assessment"], [], ["neurologic"], ["table"]),
  term("shock-index", "Shock Index", "Heart rate divided by systolic blood pressure, used as a quick marker of circulatory instability.", "Paramedic", "paramedic", "advanced", "emergency", ["perfusion", "shock"], ["trauma", "sepsis"], ["trauma-assessment"], [], ["shock"], ["table"]),
  term("hemolysis", "Hemolysis", "Rupture of red blood cells that can alter laboratory results and indicate sample quality issues.", "MLT", "laboratory", "intermediate", "laboratory", ["specimen-integrity"], [], [], [], ["specimen-collection"], ["illustration"]),
  term("anisocytosis", "Anisocytosis", "Variation in red blood cell size seen on blood smear or reflected by RDW.", "MLT", "laboratory", "advanced", "hematology", ["rdw", "cbc"], ["anemia"], [], [], ["cbc-interpretation"], ["illustration"]),
  term("leukocytosis", "Leukocytosis", "Elevated white blood cell count that may reflect infection, inflammation, stress response, medication effect, or hematologic disease.", "MLT", "laboratory", "foundational", "hematology", ["cbc", "neutrophilia"], ["infection", "sepsis"], [], [], ["cbc-interpretation"], ["table"]),
  term("thrombocytopenia", "Thrombocytopenia", "Low platelet count that increases bleeding risk and may require medication review, bleeding precautions, and trend monitoring.", "MLT", "laboratory", "intermediate", "hematology", ["platelets", "cbc"], ["bleeding-disorders"], [], [], ["cbc-interpretation"], ["table"]),
  term("creatinine-clearance", "Creatinine Clearance", "Estimate of kidney filtration based on creatinine handling, commonly used to adjust medication dosing and evaluate renal function.", "Multiple", "laboratory", "advanced", "renal", ["creatinine", "egfr"], ["ckd", "aki"], [], ["vancomycin"], ["renal-labs"], ["table"]),
  term("troponin", "Troponin", "Cardiac biomarker released with myocardial injury and interpreted alongside symptoms, ECG findings, timing, and serial trends.", "Multiple", "laboratory", "intermediate", "cardiovascular", ["myocardial-infarction", "ecg"], ["acs", "myocardial-infarction"], [], [], ["cardiac-markers"], ["table"]),
  term("bnp", "BNP", "B-type natriuretic peptide, a biomarker associated with ventricular stretch and heart failure.", "Multiple", "laboratory", "intermediate", "cardiovascular", ["heart-failure", "edema"], ["heart-failure"], [], ["furosemide"], ["heart-failure"], ["table"]),
  term("lactate", "Lactate", "A marker associated with anaerobic metabolism and tissue hypoperfusion.", "Multiple", "laboratory", "advanced", "laboratory", ["sepsis", "perfusion"], ["sepsis", "shock"], [], [], ["sepsis"], ["flowchart"]),
  term("half-life", "Half-Life", "Time required for the body to reduce a drug concentration by half.", "NP", "medication", "intermediate", "pharmacology", ["peak", "trough"], [], [], ["vancomycin"], ["pharmacology"], ["table"]),
  term("bioavailability", "Bioavailability", "Proportion of a drug dose that reaches systemic circulation.", "NP", "medication", "advanced", "pharmacology", ["first-pass-metabolism"], [], [], [], ["pharmacology"], ["diagram"]),
  term("peak", "Peak", "Highest serum drug concentration after administration, used for select medications to evaluate efficacy and avoid toxicity.", "Multiple", "medication", "intermediate", "pharmacology", ["trough", "therapeutic-range"], [], [], ["vancomycin"], ["therapeutic-drug-monitoring"], ["table"]),
  term("trough", "Trough", "Lowest serum drug concentration before the next dose, used to monitor accumulation, safety, and therapeutic adequacy.", "Multiple", "medication", "intermediate", "pharmacology", ["peak", "therapeutic-range"], [], [], ["vancomycin"], ["therapeutic-drug-monitoring"], ["table"]),
  term("therapeutic-range", "Therapeutic Range", "Drug concentration range expected to provide benefit while limiting toxicity.", "Multiple", "medication", "intermediate", "pharmacology", ["peak", "trough"], [], [], ["digoxin", "vancomycin"], ["therapeutic-drug-monitoring"], ["table"]),
  term("loading-dose", "Loading Dose", "Initial higher dose used to reach a therapeutic concentration faster.", "NP", "medication", "advanced", "pharmacology", ["maintenance-dose", "half-life"], [], [], ["vancomycin"], ["pharmacology"], ["flowchart"]),
  term("maintenance-dose", "Maintenance Dose", "Ongoing dose intended to maintain a therapeutic drug concentration.", "NP", "medication", "intermediate", "pharmacology", ["loading-dose", "half-life"], [], [], [], ["pharmacology"], ["flowchart"]),
  term("adl-assessment", "ADL Assessment", "Evaluation of a person's ability to perform activities of daily living such as bathing, dressing, toileting, feeding, and mobility.", "OT", "assessment", "foundational", "mobility", ["functional-assessment", "home-safety-assessment"], [], ["adl-assessment"], [], ["occupational-therapy-foundations"], ["table", "clinical_example"]),
  term("functional-assessment", "Functional Assessment", "Assessment of how a person performs meaningful daily tasks in their real environment.", "OT", "assessment", "intermediate", "mobility", ["adl-assessment", "home-safety-assessment"], [], ["functional-assessment"], [], ["occupational-therapy-foundations"], ["clinical_example"]),
  term("gait-assessment", "Gait Assessment", "Evaluation of walking pattern, balance, stride, assistive device use, and fall risk.", "PT", "assessment", "foundational", "mobility", ["mobility-assessment", "fall-risk"], [], ["gait-assessment"], [], ["physiotherapy-foundations"], ["illustration", "clinical_example"]),
  term("mobility-assessment", "Mobility Assessment", "Assessment of movement, transfers, walking ability, endurance, balance, and safety during functional activity.", "PT", "assessment", "foundational", "mobility", ["gait-assessment", "transfer-technique"], [], ["mobility-assessment"], [], ["physiotherapy-foundations"], ["clinical_example"]),
  term("transfer-technique", "Transfer Technique", "Safe method for moving a person between surfaces such as bed, chair, wheelchair, or toilet.", "PSW", "clinical_skill", "foundational", "mobility", ["mobility-assessment", "fall-risk"], [], ["safe-transfers"], [], ["psw-care-foundations"], ["illustration", "clinical_example"]),
  term("personal-care-documentation", "Personal Care Documentation", "Recording care provided, resident response, safety concerns, and changes from baseline.", "PSW", "clinical_skill", "foundational", "professional_practice", ["scope-of-practice", "delegation"], [], ["documentation"], [], ["psw-care-foundations"], ["table"]),
  term("medical-terminology", "Medical Terminology", "Healthcare language built from word roots, prefixes, suffixes, abbreviations, and clinical context.", "Pre-Nursing", "pre_nursing", "foundational", "general", ["prefix", "suffix", "anatomical-position"], [], [], [], ["medical-terminology"], ["table"]),
  term("anatomical-position", "Anatomical Position", "Standard reference posture used to describe body directions and locations consistently.", "Pre-Nursing", "pre_nursing", "foundational", "general", ["medical-terminology", "directional-terms"], [], [], [], ["medical-terminology"], ["illustration"]),
] as const;

export const GLOSSARY_HUBS: readonly GlossaryHub[] = [
  hub("Nursing Glossary", "RN"),
  hub("RT Glossary", "RT"),
  hub("Paramedic Glossary", "Paramedic"),
  hub("OT Glossary", "OT"),
  hub("PT Glossary", "PT"),
  hub("MLT Glossary", "MLT"),
  hub("NP Glossary", "NP"),
  hub("Pre-Nursing Glossary", "Pre-Nursing"),
  hub("PSW Glossary", "PSW"),
] as const;

export function buildGlossaryPageContract(termItem: HealthcareGlossaryTerm): GlossaryPageContract {
  return {
    termSlug: termItem.slug,
    requiredBlocks: requiredPageBlocks,
    requiredInternalLinks: ["diseases", "labs", "skills", "questions", "lessons", "simulations", "care_plans", "medication_pages"],
    conversionFeatures: conversionFeaturesFor(termItem),
    createAccountCta: "Create a free account to save this term and add it to your study notebook.",
    premiumPreviewCta: "Preview related lessons, flashcards, questions, and study guides.",
  };
}

export function buildGlossaryAuthorityDashboard(terms: readonly HealthcareGlossaryTerm[] = HEALTHCARE_GLOSSARY_TERMS): GlossaryAuthorityDashboard {
  const termsByProfession: Record<string, number> = {};
  const termsByCategory = blankCategoryCounts();
  const termsBySystem = blankSystemCounts();
  for (const termItem of terms) {
    termsByProfession[termItem.profession] = (termsByProfession[termItem.profession] ?? 0) + 1;
    termsByCategory[termItem.category] += 1;
    termsBySystem[termItem.system] += 1;
  }
  return {
    totalTerms: terms.length,
    termsByProfession,
    termsByCategory,
    termsBySystem,
    visualTerminologyTerms: terms.filter((termItem) => termItem.visualAssets.length > 0).length,
    hubs: GLOSSARY_HUBS,
    yearOneTargetMin: 5000,
    yearOneTargetMax: 10000,
    remainingToMinimumTarget: Math.max(0, 5000 - terms.length),
  };
}

export function getTermsForHub(hubItem: GlossaryHub, terms: readonly HealthcareGlossaryTerm[] = HEALTHCARE_GLOSSARY_TERMS): readonly HealthcareGlossaryTerm[] {
  return terms.filter((termItem) => hubItem.termSlugs.includes(termItem.slug));
}

export function validateGlossaryTerm(termItem: HealthcareGlossaryTerm): readonly string[] {
  const issues: string[] = [];
  if (termItem.definition.length < 60) issues.push("Definition is too thin.");
  if (termItem.relatedTerms.length === 0) issues.push("At least one related term is required.");
  if (termItem.relatedLessons.length === 0) issues.push("At least one related lesson is required.");
  if (termItem.searchIntentPatterns.length < 4) issues.push("Search intent coverage is incomplete.");
  return issues;
}

export function glossaryPriorityScore(termItem: HealthcareGlossaryTerm): number {
  const difficultyBoost = termItem.difficulty === "foundational" ? 18 : termItem.difficulty === "intermediate" ? 12 : 8;
  const visualBoost = termItem.visualAssets.length > 0 ? 10 : 0;
  const linkBoost = Math.min(20, termItem.relatedTerms.length * 3 + termItem.relatedDiseases.length * 2 + termItem.relatedSkills.length * 2 + termItem.relatedMedications.length * 2);
  const professionBoost = termItem.profession === "Multiple" ? 20 : ["RN", "RT", "Paramedic", "MLT", "NP"].includes(termItem.profession) ? 16 : 12;
  return Math.min(100, difficultyBoost + visualBoost + linkBoost + professionBoost + 30);
}

function conversionFeaturesFor(termItem: HealthcareGlossaryTerm): readonly ConversionFeature[] {
  if (termItem.category === "medication") return ["Lessons", "Flashcards", "Questions", "Medication Math", "Study Plans"];
  if (termItem.category === "laboratory") return ["Lessons", "Questions", "Labs", "Flashcards", "Readiness"];
  if (termItem.category === "respiratory") return ["Lessons", "Questions", "Labs", "Clinical Skills", "Simulations"];
  if (termItem.category === "paramedic") return ["Lessons", "Questions", "Clinical Skills", "Simulations"];
  if (termItem.category === "clinical_skill") return ["Lessons", "Clinical Skills", "Questions", "Simulations"];
  return ["Lessons", "Flashcards", "Questions", "Study Plans"];
}

function term(
  slug: string,
  termName: string,
  definition: string,
  profession: GlossaryProfession,
  category: HealthcareTermCategory,
  difficulty: GlossaryDifficulty,
  system: GlossarySystem,
  relatedTerms: readonly string[],
  relatedDiseases: readonly string[],
  relatedSkills: readonly string[],
  relatedMedications: readonly string[],
  relatedLessons: readonly string[],
  visualAssets: readonly VisualTerminologyAsset[],
): HealthcareGlossaryTerm {
  return {
    slug,
    term: termName,
    definition,
    profession,
    category,
    difficulty,
    system,
    relatedTerms,
    relatedDiseases,
    relatedSkills,
    relatedMedications,
    relatedLessons,
    visualAssets,
    searchIntentPatterns: ["what_is", "what_does_mean", "why_is_important", "how_is_used", "when_is_used"],
  };
}

function hub(title: string, profession: GlossaryProfession): GlossaryHub {
  const professionTerms = HEALTHCARE_GLOSSARY_TERMS.filter((termItem) => termItem.profession === profession || termItem.profession === "Multiple");
  return {
    title,
    profession,
    canonicalPath: `/glossary/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    termSlugs: professionTerms.map((termItem) => termItem.slug),
  };
}

function blankCategoryCounts(): Record<HealthcareTermCategory, number> {
  return {
    nursing: 0,
    respiratory: 0,
    paramedic: 0,
    laboratory: 0,
    medication: 0,
    assessment: 0,
    clinical_skill: 0,
    pre_nursing: 0,
    advanced_practice: 0,
  };
}

function blankSystemCounts(): Record<GlossarySystem, number> {
  return {
    cardiovascular: 0,
    respiratory: 0,
    neurologic: 0,
    renal: 0,
    endocrine: 0,
    gastrointestinal: 0,
    hematology: 0,
    pharmacology: 0,
    professional_practice: 0,
    emergency: 0,
    mobility: 0,
    laboratory: 0,
    general: 0,
  };
}
