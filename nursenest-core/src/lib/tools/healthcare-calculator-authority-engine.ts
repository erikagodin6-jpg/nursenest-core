import type { ConversionProfession } from "@/lib/conversion/healthcare-learner-conversion-architecture";

export type ClinicalToolProfession = ConversionProfession | "Multiple";

export type ClinicalToolCategory =
  | "nursing_calculator"
  | "respiratory_therapy"
  | "paramedic"
  | "lab_interpretation"
  | "np_clinical_tool"
  | "pre_nursing"
  | "assessment_scale"
  | "medication_math";

export type ClinicalToolMode = "calculator_mode" | "learning_mode";

export type ClinicalToolPageBlock =
  | "what_it_is"
  | "why_it_matters"
  | "how_it_is_used"
  | "clinical_interpretation"
  | "common_mistakes"
  | "practice_examples"
  | "educational_explanation"
  | "related_lessons"
  | "related_questions"
  | "related_flashcards"
  | "related_simulations";

export type LearningModeBlock = "formula" | "explanation" | "clinical_significance" | "interpretation" | "examples";

export type AccountRequiredToolAction = "saved_calculations" | "history" | "study_notes" | "bookmarks" | "advanced_reports";

export type ToolInternalLinkGroup =
  | "related_diseases"
  | "related_lessons"
  | "related_skills"
  | "related_questions"
  | "related_simulations"
  | "related_care_plans"
  | "related_study_guides";

export type ClinicalToolBacklinkUse = "reference_resource" | "educational_resource" | "faculty_resource" | "student_resource" | "shareable_resource";

export type HealthcareCalculatorTool = {
  slug: string;
  title: string;
  profession: ClinicalToolProfession;
  category: ClinicalToolCategory;
  hub: ClinicalToolHubKey;
  modes: readonly ClinicalToolMode[];
  learningModeBlocks: readonly LearningModeBlock[];
  pageBlocks: readonly ClinicalToolPageBlock[];
  freeVisitorUse: true;
  accountRequiredActions: readonly AccountRequiredToolAction[];
  internalLinkGroups: readonly ToolInternalLinkGroup[];
  backlinkUses: readonly ClinicalToolBacklinkUse[];
  relatedLessons: readonly string[];
  relatedQuestions: readonly string[];
  relatedFlashcards: readonly string[];
  relatedSimulations: readonly string[];
  seoKeywords: readonly string[];
};

export type ClinicalToolHubKey = "nursing_tools" | "rt_tools" | "paramedic_tools" | "np_tools" | "lab_tools" | "pre_nursing_tools";

export type ClinicalToolHub = {
  key: ClinicalToolHubKey;
  title: string;
  profession: ClinicalToolProfession;
  canonicalPath: string;
  toolSlugs: readonly string[];
};

export type ClinicalToolAuthorityDashboard = {
  totalTools: number;
  toolsByHub: Record<ClinicalToolHubKey, number>;
  toolsByCategory: Record<ClinicalToolCategory, number>;
  toolsByProfession: Record<string, number>;
  freeUseTools: number;
  learningModeCoverage: number;
  accountConversionActions: readonly AccountRequiredToolAction[];
  yearOneTarget: 100;
  yearTwoTarget: 250;
  yearThreeTarget: 500;
  remainingToYearOneTarget: number;
};

const pageBlocks = [
  "what_it_is",
  "why_it_matters",
  "how_it_is_used",
  "clinical_interpretation",
  "common_mistakes",
  "practice_examples",
  "educational_explanation",
  "related_lessons",
  "related_questions",
  "related_flashcards",
  "related_simulations",
] as const satisfies readonly ClinicalToolPageBlock[];

const learningBlocks = ["formula", "explanation", "clinical_significance", "interpretation", "examples"] as const satisfies readonly LearningModeBlock[];
const accountActions = ["saved_calculations", "history", "study_notes", "bookmarks", "advanced_reports"] as const satisfies readonly AccountRequiredToolAction[];
const internalLinks = ["related_diseases", "related_lessons", "related_skills", "related_questions", "related_simulations", "related_care_plans", "related_study_guides"] as const satisfies readonly ToolInternalLinkGroup[];
const backlinkUses = ["reference_resource", "educational_resource", "faculty_resource", "student_resource", "shareable_resource"] as const satisfies readonly ClinicalToolBacklinkUse[];

export const HEALTHCARE_CALCULATOR_TOOLS: readonly HealthcareCalculatorTool[] = [
  nursing("iv-flow-rate-calculator", "IV Flow Rate Calculator", "medication_math", ["iv flow rate calculator", "nursing IV rate calculator"]),
  nursing("medication-dosage-calculator", "Medication Dosage Calculator", "medication_math", ["medication dosage calculator", "nursing dosage calculator"]),
  nursing("weight-based-medication-calculator", "Weight-Based Medication Calculator", "medication_math", ["weight based dose calculator", "mg/kg calculator"]),
  nursing("pediatric-dosage-calculator", "Pediatric Dosage Calculator", "medication_math", ["pediatric dosage calculator", "safe pediatric dose calculator"]),
  nursing("drip-rate-calculator", "Drip Rate Calculator", "medication_math", ["drip rate calculator", "gtt per minute calculator"]),
  nursing("infusion-rate-calculator", "Infusion Rate Calculator", "medication_math", ["infusion rate calculator", "mL per hour calculator"]),
  nursing("fluid-balance-calculator", "Fluid Balance Calculator", "nursing_calculator", ["fluid balance calculator", "intake output calculator"]),
  nursing("burn-surface-area-calculator", "Burn Surface Area Calculator", "assessment_scale", ["burn surface area calculator", "rule of nines calculator"]),
  nursing("bmi-calculator", "BMI Calculator", "assessment_scale", ["BMI calculator healthcare", "body mass index calculator nursing"]),
  nursing("pain-assessment-tool", "Pain Assessment Tool", "assessment_scale", ["pain assessment tool", "pain scale nursing"]),
  nursing("braden-scale-calculator", "Braden Scale Calculator", "assessment_scale", ["Braden scale calculator", "pressure injury risk calculator"]),
  nursing("morse-fall-scale-calculator", "Morse Fall Scale Calculator", "assessment_scale", ["Morse fall scale calculator", "fall risk calculator nursing"]),
  nursing("glasgow-coma-scale-calculator", "Glasgow Coma Scale Calculator", "assessment_scale", ["GCS calculator", "Glasgow Coma Scale calculator"]),
  nursing("apgar-calculator", "APGAR Calculator", "assessment_scale", ["APGAR calculator", "newborn APGAR score calculator"]),
  rt("abg-interpretation-tool", "ABG Interpretation Tool", ["ABG interpretation tool", "arterial blood gas calculator"]),
  rt("aa-gradient-calculator", "A-a Gradient Calculator", ["A-a gradient calculator", "alveolar arterial gradient"]),
  rt("pao2-fio2-ratio-calculator", "PaO2/FiO2 Ratio Calculator", ["P/F ratio calculator", "PaO2 FiO2 ratio"]),
  rt("ventilator-settings-calculator", "Ventilator Settings Calculator", ["ventilator settings calculator", "mechanical ventilation calculator"]),
  rt("ideal-body-weight-calculator", "Ideal Body Weight Calculator", ["ideal body weight calculator", "IBW calculator ventilator"]),
  rt("tidal-volume-calculator", "Tidal Volume Calculator", ["tidal volume calculator", "lung protective ventilation calculator"]),
  rt("oxygen-delivery-calculator", "Oxygen Delivery Calculator", ["oxygen delivery calculator", "oxygen flow calculator"]),
  rt("alveolar-gas-equation-calculator", "Alveolar Gas Equation Calculator", ["alveolar gas equation calculator", "PAO2 calculator"]),
  paramedic("shock-index-calculator", "Shock Index Calculator", ["shock index calculator", "trauma shock index"]),
  paramedic("trauma-score-calculator", "Trauma Score Calculator", ["trauma score calculator", "trauma assessment score"]),
  paramedic("paramedic-gcs-calculator", "GCS Calculator", ["GCS calculator paramedic", "Glasgow Coma Scale EMS"]),
  paramedic("paramedic-burn-calculator", "Burn Calculator", ["burn calculator paramedic", "rule of nines EMS"]),
  paramedic("pediatric-weight-estimator", "Pediatric Weight Estimator", ["pediatric weight estimator", "Broselow weight estimator"]),
  paramedic("paramedic-drug-dose-calculator", "Drug Dose Calculators", ["paramedic drug dose calculator", "EMS medication dose calculator"]),
  lab("anion-gap-calculator", "Anion Gap Calculator", ["anion gap calculator", "metabolic acidosis calculator"]),
  lab("corrected-sodium-calculator", "Corrected Sodium Calculator", ["corrected sodium calculator", "hyperglycemia sodium correction"]),
  lab("corrected-calcium-calculator", "Corrected Calcium Calculator", ["corrected calcium calculator", "albumin corrected calcium"]),
  lab("creatinine-clearance-calculator", "Creatinine Clearance Calculator", ["creatinine clearance calculator", "CrCl calculator"]),
  lab("egfr-calculator", "eGFR Calculator", ["eGFR calculator", "kidney function calculator"]),
  lab("osmolality-calculator", "Osmolality Calculator", ["serum osmolality calculator", "osmolar gap calculator"]),
  lab("meld-calculator", "MELD Calculator", ["MELD calculator", "liver disease score calculator"]),
  lab("child-pugh-calculator", "Child-Pugh Calculator", ["Child Pugh calculator", "cirrhosis score calculator"]),
  np("ascvd-risk-calculator", "ASCVD Risk Calculator", ["ASCVD risk calculator", "cardiovascular risk calculator"]),
  np("cha2ds2-vasc-calculator", "CHA2DS2-VASc Calculator", ["CHA2DS2 VASc calculator", "atrial fibrillation stroke risk"]),
  np("wells-score", "Wells Score", ["Wells score calculator", "pulmonary embolism probability calculator"]),
  np("perc-rule", "PERC Rule", ["PERC rule calculator", "PE rule out criteria"]),
  np("curb-65", "CURB-65", ["CURB 65 calculator", "pneumonia severity calculator"]),
  np("centor-score", "Centor Score", ["Centor score calculator", "strep throat score"]),
  np("stop-bang", "STOP-BANG", ["STOP BANG calculator", "sleep apnea risk calculator"]),
  np("phq-9", "PHQ-9", ["PHQ-9 calculator", "depression screening score"]),
  np("gad-7", "GAD-7", ["GAD-7 calculator", "anxiety screening score"]),
  np("cage", "CAGE", ["CAGE questionnaire", "alcohol screening tool"]),
  preNursing("unit-conversion-calculator", "Unit Conversion Calculator", ["unit conversion calculator nursing", "metric conversion healthcare"]),
  preNursing("dosage-foundations-calculator", "Dosage Foundations Calculator", ["dosage foundations calculator", "nursing math calculator"]),
  preNursing("metric-conversion-practice-tool", "Metric Conversion Practice Tool", ["metric conversion practice", "nursing metric practice"]),
  preNursing("fraction-ratio-tool", "Fraction & Ratio Tool", ["fraction ratio calculator", "ratio proportion nursing"]),
  preNursing("medication-math-practice-generator", "Medication Math Practice Generator", ["medication math practice generator", "dosage calculation practice"]),
] as const;

export const CLINICAL_TOOL_HUBS: readonly ClinicalToolHub[] = [
  hub("nursing_tools", "Nursing Tools", "RN"),
  hub("rt_tools", "RT Tools", "RT"),
  hub("paramedic_tools", "Paramedic Tools", "Paramedic"),
  hub("np_tools", "NP Tools", "NP"),
  hub("lab_tools", "Lab Tools", "MLT"),
  hub("pre_nursing_tools", "Pre-Nursing Tools", "Pre-Nursing"),
] as const;

export function buildClinicalToolAuthorityDashboard(tools: readonly HealthcareCalculatorTool[] = HEALTHCARE_CALCULATOR_TOOLS): ClinicalToolAuthorityDashboard {
  const toolsByHub = blankHubCounts();
  const toolsByCategory = blankCategoryCounts();
  const toolsByProfession: Record<string, number> = {};

  for (const tool of tools) {
    toolsByHub[tool.hub] += 1;
    toolsByCategory[tool.category] += 1;
    toolsByProfession[tool.profession] = (toolsByProfession[tool.profession] ?? 0) + 1;
  }

  return {
    totalTools: tools.length,
    toolsByHub,
    toolsByCategory,
    toolsByProfession,
    freeUseTools: tools.filter((tool) => tool.freeVisitorUse).length,
    learningModeCoverage: tools.filter((tool) => tool.modes.includes("learning_mode")).length,
    accountConversionActions: accountActions,
    yearOneTarget: 100,
    yearTwoTarget: 250,
    yearThreeTarget: 500,
    remainingToYearOneTarget: Math.max(0, 100 - tools.length),
  };
}

export function getToolsForHub(hubKey: ClinicalToolHubKey, tools: readonly HealthcareCalculatorTool[] = HEALTHCARE_CALCULATOR_TOOLS): readonly HealthcareCalculatorTool[] {
  return tools.filter((tool) => tool.hub === hubKey);
}

export function validateClinicalToolPage(tool: HealthcareCalculatorTool): readonly string[] {
  const issues: string[] = [];
  for (const block of pageBlocks) {
    if (!tool.pageBlocks.includes(block)) issues.push(`Missing ${block} SEO block.`);
  }
  for (const block of learningBlocks) {
    if (!tool.learningModeBlocks.includes(block)) issues.push(`Missing ${block} learning-mode block.`);
  }
  for (const action of accountActions) {
    if (!tool.accountRequiredActions.includes(action)) issues.push(`Missing ${action} account conversion action.`);
  }
  for (const linkGroup of internalLinks) {
    if (!tool.internalLinkGroups.includes(linkGroup)) issues.push(`Missing ${linkGroup} internal link group.`);
  }
  if (!tool.freeVisitorUse) issues.push("Visitor calculator use must remain free.");
  if (tool.seoKeywords.length < 2) issues.push("At least two SEO keywords are required.");
  return issues;
}

export function clinicalToolPriorityScore(tool: HealthcareCalculatorTool): number {
  const hubWeight = tool.hub === "nursing_tools" || tool.hub === "lab_tools" ? 18 : 15;
  const backlinkWeight = tool.backlinkUses.length * 4;
  const seoWeight = Math.min(25, tool.seoKeywords.length * 8);
  const learningWeight = tool.modes.includes("learning_mode") ? 15 : 0;
  const conversionWeight = tool.accountRequiredActions.length * 3;
  return Math.min(100, hubWeight + backlinkWeight + seoWeight + learningWeight + conversionWeight);
}

function nursing(slug: string, title: string, category: ClinicalToolCategory, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "RN", category, "nursing_tools", seoKeywords, ["medication-math", "clinical-skills"], ["dosage-calculations"], ["medication-math-flashcards"], ["medication-safety-simulation"]);
}

function rt(slug: string, title: string, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "RT", "respiratory_therapy", "rt_tools", seoKeywords, ["abg-interpretation", "mechanical-ventilation"], ["abg-practice"], ["respiratory-flashcards"], ["respiratory-deterioration-simulation"]);
}

function paramedic(slug: string, title: string, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "Paramedic", "paramedic", "paramedic_tools", seoKeywords, ["trauma-assessment", "emergency-pharmacology"], ["ems-practice"], ["paramedic-flashcards"], ["trauma-simulation"]);
}

function lab(slug: string, title: string, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "MLT", "lab_interpretation", "lab_tools", seoKeywords, ["lab-interpretation", "advanced-labs"], ["lab-practice"], ["lab-flashcards"], ["lab-deterioration-simulation"]);
}

function np(slug: string, title: string, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "NP", "np_clinical_tool", "np_tools", seoKeywords, ["diagnostic-reasoning", "advanced-assessment"], ["np-practice"], ["np-flashcards"], ["np-case-simulation"]);
}

function preNursing(slug: string, title: string, seoKeywords: readonly string[]): HealthcareCalculatorTool {
  return tool(slug, title, "Pre-Nursing", "pre_nursing", "pre_nursing_tools", seoKeywords, ["dosage-foundations", "medical-terminology"], ["pre-nursing-practice"], ["pre-nursing-flashcards"], ["dosage-practice-simulation"]);
}

function tool(
  slug: string,
  title: string,
  profession: ClinicalToolProfession,
  category: ClinicalToolCategory,
  hubKey: ClinicalToolHubKey,
  seoKeywords: readonly string[],
  relatedLessons: readonly string[],
  relatedQuestions: readonly string[],
  relatedFlashcards: readonly string[],
  relatedSimulations: readonly string[],
): HealthcareCalculatorTool {
  return {
    slug,
    title,
    profession,
    category,
    hub: hubKey,
    modes: ["calculator_mode", "learning_mode"],
    learningModeBlocks: learningBlocks,
    pageBlocks,
    freeVisitorUse: true,
    accountRequiredActions: accountActions,
    internalLinkGroups: internalLinks,
    backlinkUses,
    relatedLessons,
    relatedQuestions,
    relatedFlashcards,
    relatedSimulations,
    seoKeywords,
  };
}

function hub(key: ClinicalToolHubKey, title: string, profession: ClinicalToolProfession): ClinicalToolHub {
  return {
    key,
    title,
    profession,
    canonicalPath: `/tools/${key.replace(/_/g, "-")}`,
    toolSlugs: HEALTHCARE_CALCULATOR_TOOLS.filter((toolItem) => toolItem.hub === key).map((toolItem) => toolItem.slug),
  };
}

function blankHubCounts(): Record<ClinicalToolHubKey, number> {
  return {
    nursing_tools: 0,
    rt_tools: 0,
    paramedic_tools: 0,
    np_tools: 0,
    lab_tools: 0,
    pre_nursing_tools: 0,
  };
}

function blankCategoryCounts(): Record<ClinicalToolCategory, number> {
  return {
    nursing_calculator: 0,
    respiratory_therapy: 0,
    paramedic: 0,
    lab_interpretation: 0,
    np_clinical_tool: 0,
    pre_nursing: 0,
    assessment_scale: 0,
    medication_math: 0,
  };
}
