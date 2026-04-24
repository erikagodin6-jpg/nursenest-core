/**
 * Deterministic long-tail RN pathophysiology / pharmacology topic catalog.
 * Titles follow mechanism-driven patterns only — no generic “overview / introduction / what is …” posts.
 */

export type LongTailTopic = {
  title: string;
  bodySystem: string;
  conditionOrDrug: string;
  pharm: boolean;
};

const BODY_SYSTEMS = [
  "Cardiovascular",
  "Respiratory",
  "Renal",
  "Endocrine",
  "Neurologic",
  "Gastrointestinal",
  "Hematologic",
  "Immune",
  "Hepatic",
  "Electrolyte",
  "Musculoskeletal",
] as const;

/** [condition or context, finding / symptom / lab] */
const WHY_CAUSE_PAIRS: ReadonlyArray<[string, string]> = [
  ["DKA", "hyperkalemia"],
  ["sepsis", "hypotension"],
  ["renal failure", "hyperkalemia"],
  ["COPD", "CO2 retention"],
  ["hypocalcemia", "tetany"],
  ["SIADH", "hyponatremia"],
  ["heart failure", "peripheral edema"],
  ["pneumonia", "hypoxemia"],
  ["pulmonary embolism", "sudden hypoxia"],
  ["acute kidney injury", "metabolic acidosis"],
  ["liver failure", "coagulopathy"],
  ["anaphylaxis", "bronchospasm"],
  ["tension pneumothorax", "hypotension"],
  ["hypovolemic shock", "tachycardia"],
  ["ARDS", "refractory hypoxemia"],
  ["meningitis", "photophobia"],
  ["cholecystitis", "Murphy sign pain"],
  ["pancreatitis", "hypocalcemia"],
  ["GI bleeding", "orthostatic hypotension"],
  ["hyperthyroidism", "heat intolerance"],
  ["hypothyroidism", "bradycardia"],
  ["fluid overload", "crackles"],
  ["pericarditis", "positional chest pain"],
  ["asthma exacerbation", "accessory muscle use"],
  ["bronchiectasis", "purulent sputum"],
  ["UTI in older adults", "acute confusion"],
  ["pyelonephritis", "costovertebral tenderness"],
  ["cellulitis", "spreading erythema"],
  ["acute stroke", "focal neurologic deficits"],
  ["increased ICP", "widening pulse pressure"],
  ["diabetic ketoacidosis", "Kussmaul respirations"],
  ["hyperosmolar hyperglycemic state", "altered mental status"],
  ["acute liver failure", "coagulopathy"],
  ["cirrhosis", "ascites"],
  ["nephrotic syndrome", "edema"],
  ["rhabdomyolysis", "tea-colored urine"],
  ["transfusion reaction", "fever and chills"],
  ["thyroid storm", "hyperthermia"],
  ["myxedema coma", "hypothermia"],
  ["Addisonian crisis", "refractory hypotension"],
  ["pheochromocytoma", "paroxysmal hypertension"],
  ["hypernatremia", "altered mental status"],
  ["hyponatremia", "seizures"],
  ["hypokalemia", "U waves on ECG"],
  ["hyperkalemia", "peaked T waves"],
  ["hypomagnesemia", "ventricular arrhythmias"],
  ["respiratory acidosis", "confusion"],
  ["metabolic alkalosis", "hypokalemia"],
  ["diabetic neuropathy", "loss of protective sensation"],
  ["autonomic dysreflexia", "hypertension"],
  ["neurogenic shock", "bradycardia"],
  ["cardiogenic shock", "cool extremities"],
  ["distributive shock", "warm shock"],
  ["obstructive shock", "distended neck veins"],
  ["acute coronary syndrome", "diaphoresis"],
  ["aortic stenosis", "syncope with exertion"],
  ["mitral regurgitation", "fatigue"],
  ["atrial fibrillation", "irregular pulse"],
  ["VT storm", "palpitations"],
  ["long QT syndrome", "syncope"],
  ["WPW", "tachyarrhythmia"],
  ["peripheral artery disease", "claudication"],
  ["deep vein thrombosis", "unilateral leg swelling"],
  ["pulmonary hypertension", "exertional dyspnea"],
  ["cor pulmonale", "peripheral edema"],
  ["sleep apnea", "daytime somnolence"],
  ["obesity hypoventilation", "hypercapnia"],
  ["aspiration risk", "post-prandial cough"],
  ["esophageal varices", "hematemesis"],
  ["bowel obstruction", "high-pitched bowel sounds"],
  ["Crohn flare", "cramping abdominal pain"],
  ["ulcerative colitis", "bloody diarrhea"],
  ["acute pancreatitis", "epigastric radiation to back"],
  ["biliary colic", "post-fatty meal pain"],
  ["hepatorenal syndrome", "oliguria"],
  ["spontaneous bacterial peritonitis", "fever in cirrhosis"],
  ["hepatic encephalopathy", "asterixis"],
  ["acute glomerulonephritis", "cola-colored urine"],
  ["nephrolithiasis", "flank pain"],
  ["hypovolemia", "narrow pulse pressure"],
  ["third spacing", "intravascular depletion"],
  ["SIADH from SSRIs", "hyponatremia"],
  ["diabetes insipidus", "polyuria"],
  ["Cushing syndrome", "central obesity"],
  ["primary hyperaldosteronism", "hypokalemia"],
  ["pheochromocytoma crisis", "hypertensive emergency"],
  ["thyrotoxicosis", "thyroid bruit"],
  ["myasthenic crisis", "respiratory muscle weakness"],
  ["Guillain-Barré", "ascending weakness"],
  ["multiple sclerosis relapse", "internuclear ophthalmoplegia"],
  ["status epilepticus", "prolonged seizure activity"],
  ["alcohol withdrawal", "autonomic hyperactivity"],
  ["opioid overdose", "respiratory depression"],
  ["benzodiazepine toxicity", "oversedation"],
  ["TCA toxicity", "anticholinergic signs"],
  ["salicylate toxicity", "respiratory alkalosis then acidosis"],
  ["acetaminophen toxicity", "right upper quadrant pain"],
  ["iron toxicity", "gastrointestinal bleeding"],
  ["beta-blocker overdose", "bradycardia"],
  ["calcium channel blocker overdose", "shock"],
  ["digoxin toxicity", "nausea and vision changes"],
  ["lithium toxicity", "tremor"],
  ["valproate toxicity", "hyperammonemia"],
  ["carbamazepine toxicity", "ataxia"],
  ["isoniazid toxicity", "seizures"],
  ["ethylene glycol poisoning", "anion gap acidosis"],
  ["methanol poisoning", "visual changes"],
  ["carbon monoxide poisoning", "cherry red skin"],
  ["cyanide poisoning", "lactic acidosis"],
  ["heat stroke", "core temperature elevation"],
  ["hypothermia", "bradycardia"],
  ["fat embolism", "petechial rash"],
  ["fat embolism syndrome", "hypoxemia"],
  ["ARDS from pancreatitis", "hypoxemia"],
  ["TRALI", "acute hypoxia after transfusion"],
  ["TACO", "acute pulmonary edema after transfusion"],
  ["HELLP syndrome", "elevated liver enzymes"],
  ["preeclampsia", "proteinuria"],
  ["eclampsia", "seizures in pregnancy"],
  ["postpartum hemorrhage", "tachycardia"],
  ["amniotic fluid embolism", "sudden cardiovascular collapse"],
  ["disseminated intravascular coagulation", "bleeding and thrombosis"],
  ["tumor lysis syndrome", "hyperuricemia"],
  ["syndrome of inappropriate antidiuresis", "hyponatremia"],
  ["cerebral salt wasting", "hyponatremia with volume depletion"],
  ["diabetes with gastroparesis", "early satiety"],
  ["autonomic neuropathy", "orthostatic hypotension"],
];

const DRUG_EFFECT_PAIRS: ReadonlyArray<[string, string]> = [
  ["metoprolol", "bradycardia"],
  ["warfarin", "bleeding"],
  ["heparin", "bleeding"],
  ["furosemide", "hypokalemia"],
  ["digoxin", "nausea and arrhythmias"],
  ["ACE inhibitors", "hyperkalemia"],
  ["ARBs", "acute kidney injury risk"],
  ["spironolactone", "hyperkalemia"],
  ["amiodarone", "pulmonary fibrosis"],
  ["nitroglycerin", "hypotension"],
  ["morphine", "respiratory depression"],
  ["hydromorphone", "sedation"],
  ["albuterol", "tachycardia"],
  ["ipratropium", "dry mouth"],
  ["prednisone", "hyperglycemia"],
  ["insulin", "hypoglycemia"],
  ["vancomycin", "nephrotoxicity"],
  ["aminoglycosides", "ototoxicity"],
  ["fluoroquinolones", "tendon rupture risk"],
  ["SSRIs", "hyponatremia"],
  ["SNRIs", "elevated blood pressure"],
  ["lithium", "tremor"],
  ["valproate", "thrombocytopenia"],
  ["levothyroxine", "iatrogenic hyperthyroidism"],
  ["propylthiouracil", "hepatotoxicity"],
  ["methimazole", "agranulocytosis"],
  ["clopidogrel", "bleeding"],
  ["ticagrelor", "dyspnea"],
  ["apixaban", "bleeding"],
  ["rivaroxaban", "bleeding"],
  ["dabigatran", "bleeding"],
  ["dabigatran", "dyspepsia"],
  ["enoxaparin", "bleeding"],
  ["potassium chloride IV", "extravasation injury"],
  ["calcium gluconate", "tissue necrosis if extravasated"],
  ["phenytoin", "gingival hyperplasia"],
  ["carbamazepine", "hyponatremia"],
  ["gabapentin", "sedation"],
  ["pregabalin", "peripheral edema"],
  ["baclofen", "withdrawal seizures if stopped abruptly"],
  ["haloperidol", "QT prolongation"],
  ["quetiapine", "orthostasis"],
  ["olanzapine", "metabolic syndrome"],
  ["benzodiazepines", "respiratory depression"],
  ["zolpidem", "complex sleep behaviors"],
  ["ondansetron", "QT prolongation"],
  ["promethazine", "sedation"],
  ["metoclopramide", "tardive dyskinesia risk"],
  ["proton pump inhibitors", "hypomagnesemia"],
  ["NSAIDs", "acute kidney injury"],
  ["acetaminophen", "hepatotoxicity in overdose"],
  ["aspirin", "Reye syndrome risk in children"],
  ["colchicine", "GI toxicity"],
  ["allopurinol", "severe cutaneous adverse reactions"],
  ["hydrochlorothiazide", "hyponatremia"],
  ["chlorthalidone", "hypokalemia"],
  ["spironolactone", "gynecomastia"],
  ["eplerenone", "hyperkalemia"],
  ["diltiazem", "heart block"],
  ["verapamil", "constipation"],
  ["amlodipine", "peripheral edema"],
  ["lisinopril", "cough"],
  ["losartan", "hyperkalemia"],
  ["carvedilol", "hypotension"],
  ["labetalol", "bronchospasm in asthma"],
  ["esmolol", "hypotension"],
  ["nitroprusside", "cyanide toxicity risk"],
  ["dopamine", "tachyarrhythmias"],
  ["norepinephrine", "tissue necrosis if extravasated"],
  ["epinephrine", "tachycardia"],
  ["phenylephrine", "reflex bradycardia"],
  ["isoproterenol", "tachyarrhythmias"],
  ["milrinone", "hypotension"],
  ["dobutamine", "tachyarrhythmias"],
  ["amiodarone", "thyroid dysfunction"],
  ["sotalol", "torsades risk"],
  ["procainamide", "drug-induced lupus"],
  ["lidocaine", "CNS toxicity"],
  ["adenosine", "transient heart block"],
  ["atropine", "urinary retention"],
  ["neostigmine", "bradycardia"],
  ["succinylcholine", "hyperkalemia risk"],
  ["rocuronium", "prolonged paralysis if not reversed"],
  ["propofol", "propofol infusion syndrome"],
  ["ketamine", "emergence reactions"],
  ["dexmedetomidine", "bradycardia"],
  ["midazolam", "respiratory depression"],
  ["lorazepam", "oversedation"],
  ["fentanyl", "chest wall rigidity with rapid bolus"],
  ["hydromorphone PCA", "respiratory depression"],
  ["tramadol", "seizure risk"],
  ["methadone", "QT prolongation"],
  ["buprenorphine", "precipitated withdrawal"],
  ["naloxone", "acute withdrawal symptoms"],
  ["flumazenil", "seizure risk"],
  ["physostigmine", "bradycardia"],
  ["glucagon", "hyperglycemia"],
  ["octreotide", "gallstones"],
  ["vasopressin", "hyponatremia"],
  ["terlipressin", "ischemia"],
  ["desmopressin", "hyponatremia"],
  ["DDAVP", "hyponatremia"],
  ["tranexamic acid", "thrombosis risk"],
  ["vitamin K", "anaphylaxis rare"],
  ["protamine", "hypotension"],
  ["idarucizumab", "reversal bleeding"],
  ["andexanet alfa", "thrombosis risk"],
  ["calcium carbonate", "hypercalcemia"],
  ["sevelamer", "constipation"],
  ["ferrous sulfate", "GI upset"],
  ["erythropoietin", "hypertension"],
  ["filgrastim", "bone pain"],
  ["pegfilgrastim", "splenic rupture rare"],
  ["tumor necrosis factor inhibitors", "infection risk"],
];

const PATH_STEP_CONDITIONS = [
  "left-sided heart failure",
  "right-sided heart failure",
  "septic shock",
  "cardiogenic shock",
  "acute tubular necrosis",
  "hepatic encephalopathy",
  "acute respiratory distress syndrome",
  "status asthmaticus",
  "thyroid storm",
  "acute pancreatitis",
  "ascending cholangitis",
  "necrotizing fasciitis",
  "toxic megacolon",
  "pulmonary edema",
  "hypertensive emergency",
] as const;

const LAB_IN_CONDITION: ReadonlyArray<[string, string]> = [
  ["hyperkalemia", "acute kidney injury"],
  ["hyponatremia", "heart failure"],
  ["anion gap acidosis", "DKA"],
  ["lactic acidosis", "sepsis"],
  ["elevated troponin", "demand ischemia"],
  ["elevated BNP", "volume overload"],
  ["elevated ammonia", "hepatic encephalopathy"],
  ["elevated lipase", "acute pancreatitis"],
  ["elevated INR", "liver failure"],
  ["low platelets", "HELLP syndrome"],
];

const NURSING_IMPL_DRUGS = [
  "amiodarone",
  "vancomycin",
  "heparin",
  "insulin infusion",
  "norepinephrine",
  "furosemide",
  "morphine PCA",
  "digoxin",
  "warfarin",
  "apixaban",
] as const;

const MECHANISM_SIGN_DISEASE: ReadonlyArray<[string, string, string]> = [
  ["Kussmaul respirations", "metabolic acidosis", "DKA"],
  ["JVD elevation", "fluid overload", "heart failure"],
  ["split S2 with loud P2", "pulmonary hypertension", "COPD"],
  ["perioral numbness", "respiratory alkalosis", "anxiety hyperventilation"],
  ["flapping tremor", "ammonia elevation", "hepatic encephalopathy"],
];

const TREATMENT_SIDE: ReadonlyArray<[string, string]> = [
  ["rapid IV fluids", "pulmonary edema risk"],
  ["high-dose steroids", "hyperglycemia"],
  ["aggressive diuresis", "acute kidney injury"],
  ["blood transfusion", "volume overload"],
  ["potassium repletion", "rebound hyperkalemia"],
];

const SYSTEM_PAIR_FAILURES: ReadonlyArray<[string, string, string]> = [
  ["renal failure", "pulmonary edema", "fluid overload"],
  ["liver dysfunction", "coagulopathy", "clotting factor loss"],
  ["heart failure", "renal hypoperfusion", "prerenal azotemia"],
  ["sepsis", "acute confusion", "delirium"],
  ["COPD", "cor pulmonale", "right heart strain"],
];

const ELECTROLYTE_DISEASE: ReadonlyArray<[string, string]> = [
  ["hypokalemia", "DKA during treatment"],
  ["hypercalcemia", "malignancy"],
  ["hypophosphatemia", "refeeding syndrome"],
  ["hypomagnesemia", "alcohol withdrawal"],
  ["hypermagnesemia", "renal failure"],
];

const MONITOR_DRUGS = [
  "vancomycin",
  "digoxin",
  "lithium",
  "aminoglycosides",
  "heparin infusion",
  "nitroprusside",
  "insulin drip",
  "norepinephrine",
  "phenytoin",
  "magnesium sulfate",
] as const;

function systemForSeed(i: number): string {
  return BODY_SYSTEMS[i % BODY_SYSTEMS.length]!;
}

function bannedTitle(t: string): boolean {
  const s = t.trim();
  return /^overview of\b/i.test(s) || /^introduction to\b/i.test(s) || /^what is\b/i.test(s);
}

/**
 * Build up to `targetCount` unique mechanism-driven titles.
 */
export function buildLongTailTopicCatalog(targetCount: number): LongTailTopic[] {
  const seen = new Set<string>();
  const out: LongTailTopic[] = [];

  const add = (title: string, bodySystem: string, tag: string, pharm: boolean) => {
    const k = title.trim().toLowerCase();
    if (seen.has(k) || bannedTitle(title)) return;
    seen.add(k);
    out.push({ title, bodySystem, conditionOrDrug: tag, pharm });
  };

  let rot = 0;
  for (const [c, f] of WHY_CAUSE_PAIRS) {
    if (out.length >= targetCount) break;
    add(`Why does ${c} cause ${f}?`, systemForSeed(rot++), c, false);
  }

  for (const [d, e] of DRUG_EFFECT_PAIRS) {
    if (out.length >= targetCount) break;
    add(`How does ${d} cause ${e}?`, systemForSeed(rot++), d, true);
  }

  for (const cond of PATH_STEP_CONDITIONS) {
    if (out.length >= targetCount) break;
    add(`What happens in ${cond} pathophysiology step by step?`, systemForSeed(rot++), cond, false);
  }

  for (const [lab, cond] of LAB_IN_CONDITION) {
    if (out.length >= targetCount) break;
    add(`Why does ${lab} occur in ${cond}?`, systemForSeed(rot++), cond, false);
  }

  for (const drug of NURSING_IMPL_DRUGS) {
    if (out.length >= targetCount) break;
    add(`Nursing implications of ${drug} mechanism`, systemForSeed(rot++), drug, true);
  }

  for (const [sign, , dis] of MECHANISM_SIGN_DISEASE) {
    if (out.length >= targetCount) break;
    add(`Mechanism behind ${sign} in ${dis}: nursing-focused explanation`, systemForSeed(rot++), dis, false);
  }

  for (const [tx, side] of TREATMENT_SIDE) {
    if (out.length >= targetCount) break;
    add(`Why does ${tx} cause ${side}?`, systemForSeed(rot++), tx, false);
  }

  for (const drug of MONITOR_DRUGS) {
    if (out.length >= targetCount) break;
    add(`What should nurses monitor in ${drug} and why?`, systemForSeed(rot++), drug, true);
  }

  for (const [a, b, c] of SYSTEM_PAIR_FAILURES) {
    if (out.length >= targetCount) break;
    add(`How does ${a} affect ${b} during ${c}?`, systemForSeed(rot++), c, false);
  }

  for (const [elec, dis] of ELECTROLYTE_DISEASE) {
    if (out.length >= targetCount) break;
    add(`Why does ${elec} happen in ${dis}?`, systemForSeed(rot++), dis, false);
  }

  // Expand with permuted “why does” pairs (second pass with synonyms) until full
  const extraConditions = [
    "hyperglycemia",
    "hypoglycemia",
    "metabolic acidosis",
    "respiratory acidosis",
    "hypoxia",
    "fever",
    "tachypnea",
    "oliguria",
    "jaundice",
    "pruritus",
    "ascites",
    "splenomegaly",
    "lymphadenopathy",
    "petechiae",
    "purpura",
    "clubbing",
    "cyanosis",
    "clubbing with cyanosis",
    "wheezing",
    "stridor",
    "hemoptysis",
    "melena",
    "hematemesis",
    "syncope",
    "seizures",
    "weakness",
    "numbness",
    "aphasia",
    "dysarthria",
    "ataxia",
    "tremor",
    "myoclonus",
    "rigidity",
    "spasticity",
    "pain crisis",
    "rebound tenderness",
    "guarding",
    "distension",
    "ileus",
    "ileus signs",
    "ileus on imaging",
  ];
  const extraFindings = [
    "tachycardia",
    "bradycardia",
    "hypotension",
    "hypertension",
    "tachypnea",
    "bradypnea",
    "hypoxemia",
    "hypercapnia",
    "acidosis",
    "alkalosis",
    "hypernatremia",
    "hypocalcemia",
    "hyperphosphatemia",
    "elevated creatinine",
    "elevated lactate",
    "elevated bilirubin",
    "coagulopathy",
    "thrombocytopenia",
    "leukocytosis",
    "leukopenia",
    "anemia",
    "electrolyte shifts",
    "volume overload",
    "dehydration",
    "altered mental status",
    "agitation",
    "lethargy",
    "coma",
    "focal deficits",
    "cranial nerve deficits",
  ];

  let ei = 0;
  let ej = 0;
  while (out.length < targetCount) {
    const c = extraConditions[ei % extraConditions.length]!;
    const f = extraFindings[ej % extraFindings.length]!;
    ei += 1;
    ej += 7;
    add(`Why does ${c} cause ${f}?`, systemForSeed(rot++), c, false);
  }

  return out.slice(0, targetCount);
}
