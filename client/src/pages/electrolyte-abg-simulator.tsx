import { LocaleLink } from "@/lib/LocaleLink";
import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type CountryMode, type UnitMode, getDefaultUnitMode, convertGlucose } from "@/lib/unit-conversion";
import {
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Activity,
  Beaker,
  Heart,
  Brain,
  Zap,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { AdminEditButton } from "@/components/admin-edit-button";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { electrolyteCasesBatch1 } from "@/data/electrolyte-cases-batch-1";
import { electrolyteCasesBatch2 } from "@/data/electrolyte-cases-batch-2";
import { abgCasesBatch1 } from "@/data/abg-cases-batch-1";
import { abgCasesBatch2 } from "@/data/abg-cases-batch-2";

import { useI18n } from "@/lib/i18n";
const paidTiers = ["rpn", "rn", "np", "admin", "all_access"];

interface ElectrolyteCase {
  id: string;
  title: string;
  labValues: { name: string; value: string; unit: string; reference: string; abnormal: boolean }[];
  symptoms: string[];
  ecgHint: string;
  glucoseMmol?: number;
  abnormalityOptions: string[];
  correctAbnormality: string;
  priorityOptions: string[];
  correctPriority: string;
  rationale: string;
  examTrap: string;
}

interface ABGCase {
  id: string;
  title: string;
  scenario: string;
  values: { pH: number; PaCO2: number; HCO3: number; PaO2: number };
  glucoseMmol?: number;
  stepwise: { step: string; finding: string }[];
  disorderOptions: string[];
  correctDisorder: string;
  compensationOptions: string[];
  correctCompensation: string;
  actionOptions: string[];
  correctAction: string;
  rationale: string;
  examTrap: string;
}

const baseElectrolyteCases: ElectrolyteCase[] = [
  {
    id: "hyperkalemia",
    title: "Case 1: Muscle Weakness & Cardiac Changes",
    labValues: [
      { name: "Potassium (K⁺)", value: "6.8", unit: "mEq/L", reference: "3.5-5.0", abnormal: true },
      { name: "Sodium (Na⁺)", value: "139", unit: "mEq/L", reference: "136-145", abnormal: false },
      { name: "Creatinine", value: "4.2", unit: "mg/dL", reference: "0.7-1.3", abnormal: true },
      { name: "BUN", value: "42", unit: "mg/dL", reference: "7-20", abnormal: true },
    ],
    symptoms: ["Generalized muscle weakness", "Paresthesias in extremities", "Nausea and abdominal cramping", "Fatigue and lethargy"],
    ecgHint: "ECG shows peaked, tall T waves with widened QRS complex. PR interval is prolonged.",
    abnormalityOptions: ["Hyperkalemia", "Hypokalemia", "Hypernatremia", "Hypocalcemia"],
    correctAbnormality: "Hyperkalemia",
    priorityOptions: [
      "Place on continuous cardiac monitoring and prepare calcium gluconate",
      "Administer oral potassium supplements",
      "Restrict fluids to 1000 mL/day",
      "Prepare for dialysis immediately without stabilization",
    ],
    correctPriority: "Place on continuous cardiac monitoring and prepare calcium gluconate",
    rationale: "K⁺ of 6.8 mEq/L is critically elevated. Peaked T waves and wide QRS indicate cardiac toxicity. Immediate cardiac monitoring is essential. IV calcium gluconate stabilizes the cardiac membrane while insulin/dextrose and kayexalate help lower K⁺. Restrict potassium intake. The elevated creatinine suggests renal failure as the cause.",
    examTrap: "Don't confuse peaked T waves (hyperkalemia) with tall T waves in acute MI. In hyperkalemia, the T waves are narrow and symmetric ('tented'), while MI T waves are broad-based. Always check K⁺ before attributing ECG changes to ischemia.",
  },
  {
    id: "hypokalemia",
    title: "Case 2: Leg Cramps & ECG Abnormalities",
    labValues: [
      { name: "Potassium (K⁺)", value: "2.6", unit: "mEq/L", reference: "3.5-5.0", abnormal: true },
      { name: "Magnesium (Mg²⁺)", value: "1.4", unit: "mg/dL", reference: "1.7-2.2", abnormal: true },
      { name: "Sodium (Na⁺)", value: "141", unit: "mEq/L", reference: "136-145", abnormal: false },
      { name: "Digoxin level", value: "1.8", unit: "ng/mL", reference: "0.8-2.0", abnormal: false },
    ],
    symptoms: ["Bilateral leg cramps", "Muscle weakness and fatigue", "Constipation", "Heart palpitations"],
    ecgHint: "ECG shows flattened T waves, prominent U waves after the T wave, and ST segment depression.",
    abnormalityOptions: ["Hypokalemia", "Hyperkalemia", "Hypomagnesemia", "Hypercalcemia"],
    correctAbnormality: "Hypokalemia",
    priorityOptions: [
      "Replace K⁺ IV (never push) and hold digoxin until K⁺ is corrected; monitor ECG continuously",
      "Administer IV calcium gluconate",
      "Restrict potassium in the diet",
      "Give rapid IV potassium bolus to correct quickly",
    ],
    correctPriority: "Replace K⁺ IV (never push) and hold digoxin until K⁺ is corrected; monitor ECG continuously",
    rationale: "K⁺ of 2.6 mEq/L is critically low. Flat T waves and U waves are classic ECG findings. Hypokalemia potentiates digoxin toxicity even at therapeutic levels  -  always replace K⁺ before continuing digoxin. Also correct concurrent hypomagnesemia, as low Mg²⁺ makes K⁺ refractory to replacement. IV potassium must NEVER be pushed  -  always infuse slowly with cardiac monitoring.",
    examTrap: "Exam trap: A patient on digoxin with a 'therapeutic' level can still develop digoxin toxicity if K⁺ is low. Hypokalemia increases myocardial sensitivity to digoxin. Always check K⁺ AND Mg²⁺ in patients on digoxin.",
  },
  {
    id: "hypernatremia",
    title: "Case 3: Confusion & Extreme Thirst",
    labValues: [
      { name: "Sodium (Na⁺)", value: "158", unit: "mEq/L", reference: "136-145", abnormal: true },
      { name: "Serum osmolality", value: "330", unit: "mOsm/kg", reference: "275-295", abnormal: true },
      { name: "BUN", value: "32", unit: "mg/dL", reference: "7-20", abnormal: true },
      { name: "Urine specific gravity", value: "1.035", unit: "", reference: "1.005-1.030", abnormal: true },
    ],
    symptoms: ["Intense thirst", "Confusion and agitation", "Dry, sticky mucous membranes", "Decreased skin turgor", "Low-grade fever"],
    ecgHint: "ECG shows sinus tachycardia. No specific waveform changes related to sodium.",
    abnormalityOptions: ["Hypernatremia", "Hyponatremia", "Hyperkalemia", "Hypercalcemia"],
    correctAbnormality: "Hypernatremia",
    priorityOptions: [
      "Administer slow IV free water replacement (D5W or hypotonic saline); correct Na⁺ no faster than 10-12 mEq/L per 24 hours",
      "Administer 3% hypertonic saline IV bolus",
      "Restrict all fluid intake",
      "Give normal saline rapid bolus 1 L/hr",
    ],
    correctPriority: "Administer slow IV free water replacement (D5W or hypotonic saline); correct Na⁺ no faster than 10-12 mEq/L per 24 hours",
    rationale: "Na⁺ of 158 mEq/L indicates severe hypernatremia, likely from dehydration (high BUN, concentrated urine). The brain cells have adapted by generating idiogenic osmoles. Correcting too rapidly causes cerebral edema as water shifts into brain cells. Free water replacement must be SLOW  -  no more than 10-12 mEq/L drop in 24 hours. Monitor Na⁺ every 2-4 hours.",
    examTrap: "Don't confuse the treatment: Hypernatremia needs FREE WATER (hypotonic), while hyponatremia with seizures needs HYPERTONIC saline. Rapid correction of hypernatremia → cerebral edema. Rapid correction of hyponatremia → osmotic demyelination syndrome (ODS).",
  },
  {
    id: "hyponatremia",
    title: "Case 4: Headache, Confusion & Seizure Risk",
    labValues: [
      { name: "Sodium (Na⁺)", value: "118", unit: "mEq/L", reference: "136-145", abnormal: true },
      { name: "Serum osmolality", value: "248", unit: "mOsm/kg", reference: "275-295", abnormal: true },
      { name: "Urine sodium", value: "45", unit: "mEq/L", reference: "<20 if volume depleted", abnormal: true },
      { name: "Urine osmolality", value: "520", unit: "mOsm/kg", reference: "300-900", abnormal: false },
    ],
    symptoms: ["Severe headache", "Confusion and lethargy", "Nausea and vomiting", "Muscle cramps", "Risk of seizures at this level"],
    ecgHint: "ECG shows no specific changes directly from hyponatremia. Sinus rhythm with normal intervals.",
    abnormalityOptions: ["Hyponatremia", "Hypernatremia", "Hypokalemia", "Hypocalcemia"],
    correctAbnormality: "Hyponatremia",
    priorityOptions: [
      "Institute fluid restriction; monitor Na⁺ correction rate (no more than 8-10 mEq/L in 24 hours); seizure precautions",
      "Administer free water IV bolus rapidly",
      "Give furosemide 80 mg IV push immediately",
      "Restrict sodium in the diet further",
    ],
    correctPriority: "Institute fluid restriction; monitor Na⁺ correction rate (no more than 8-10 mEq/L in 24 hours); seizure precautions",
    rationale: "Na⁺ of 118 mEq/L is dangerously low with neurological symptoms. SIADH is suspected (euvolemic, concentrated urine, high urine Na⁺). Primary intervention is fluid restriction. If seizures occur, small boluses of 3% hypertonic saline may be given. CRITICAL: Do not correct faster than 8-10 mEq/L in 24 hours  -  rapid correction causes osmotic demyelination syndrome (central pontine myelinolysis), which is irreversible.",
    examTrap: "The biggest exam trap: Correcting hyponatremia TOO FAST is more dangerous than the hyponatremia itself. Osmotic demyelination syndrome (ODS) causes permanent neurological damage. Always monitor the RATE of correction, not just the target.",
  },
  {
    id: "hypercalcemia",
    title: "Case 5: Stones, Bones, Groans & Moans",
    labValues: [
      { name: "Calcium (Ca²⁺)", value: "13.8", unit: "mg/dL", reference: "8.5-10.5", abnormal: true },
      { name: "Phosphorus", value: "2.0", unit: "mg/dL", reference: "2.5-4.5", abnormal: true },
      { name: "PTH", value: "185", unit: "pg/mL", reference: "10-65", abnormal: true },
      { name: "Albumin", value: "4.0", unit: "g/dL", reference: "3.5-5.0", abnormal: false },
    ],
    symptoms: ["Kidney stones (renal colic)", "Bone pain and pathologic fractures", "Abdominal groans (constipation, nausea, vomiting)", "Psychiatric moans (confusion, depression, lethargy)", "Polyuria and polydipsia"],
    ecgHint: "ECG shows shortened QT interval. Possible Osborn (J) waves if severe.",
    abnormalityOptions: ["Hypercalcemia", "Hypocalcemia", "Hypermagnesemia", "Hyperkalemia"],
    correctAbnormality: "Hypercalcemia",
    priorityOptions: [
      "Aggressive IV normal saline hydration followed by loop diuretics (furosemide) to promote calcium excretion",
      "Administer IV calcium gluconate",
      "Give thiazide diuretics to increase calcium reabsorption",
      "Restrict all IV fluids and give oral phosphorus",
    ],
    correctPriority: "Aggressive IV normal saline hydration followed by loop diuretics (furosemide) to promote calcium excretion",
    rationale: "Ca²⁺ of 13.8 mg/dL is critically elevated. The mnemonic 'Stones, Bones, Groans, and Moans' captures the multi-system effects. Elevated PTH with low phosphorus suggests primary hyperparathyroidism. Treatment: First hydrate aggressively with NS (dilutes calcium and promotes renal excretion), then loop diuretics (furosemide blocks calcium reabsorption). NEVER give thiazides  -  they INCREASE calcium reabsorption. Calcitonin or bisphosphonates may be added.",
    examTrap: "NEVER give thiazide diuretics for hypercalcemia  -  thiazides INCREASE calcium reabsorption and worsen the condition. Use LOOP diuretics (furosemide). This is a classic exam distractor. Also, don't confuse: hypercalcemia → short QT; hypocalcemia → long QT.",
  },
  {
    id: "hypocalcemia",
    title: "Case 6: Tetany & Positive Chvostek Sign",
    labValues: [
      { name: "Calcium (Ca²⁺)", value: "6.2", unit: "mg/dL", reference: "8.5-10.5", abnormal: true },
      { name: "Phosphorus", value: "6.8", unit: "mg/dL", reference: "2.5-4.5", abnormal: true },
      { name: "Albumin", value: "3.8", unit: "g/dL", reference: "3.5-5.0", abnormal: false },
      { name: "Magnesium (Mg²⁺)", value: "1.5", unit: "mg/dL", reference: "1.7-2.2", abnormal: true },
      { name: "PTH", value: "8", unit: "pg/mL", reference: "10-65", abnormal: true },
    ],
    symptoms: ["Positive Chvostek sign (facial twitching when tapping facial nerve)", "Positive Trousseau sign (carpal spasm with BP cuff inflation)", "Muscle tetany and cramping", "Numbness and tingling (perioral, fingers, toes)", "Hyperactive deep tendon reflexes"],
    ecgHint: "ECG shows prolonged QT interval. Risk of torsades de pointes if severe.",
    abnormalityOptions: ["Hypocalcemia", "Hypercalcemia", "Hypokalemia", "Hypomagnesemia"],
    correctAbnormality: "Hypocalcemia",
    priorityOptions: [
      "Administer IV calcium gluconate slowly with cardiac monitoring; keep crash cart at bedside",
      "Give rapid IV calcium chloride push",
      "Administer oral calcium carbonate only",
      "Give IV magnesium sulfate as sole treatment",
    ],
    correctPriority: "Administer IV calcium gluconate slowly with cardiac monitoring; keep crash cart at bedside",
    rationale: "Ca²⁺ of 6.2 mg/dL is critically low. Chvostek and Trousseau signs are pathognomonic for hypocalcemia. Low PTH suggests hypoparathyroidism (post-thyroidectomy is the most common cause). IV calcium GLUCONATE is preferred over calcium chloride for peripheral IV  -  chloride is caustic and causes tissue necrosis if it infiltrates. Always infuse slowly with cardiac monitoring (rapid infusion → cardiac arrest). Also correct the concurrent hypomagnesemia.",
    examTrap: "Calcium GLUCONATE vs calcium CHLORIDE: Gluconate is safer for peripheral IV. Chloride is 3x more concentrated and reserved for central lines or cardiac arrest. If the exam asks about a peripheral IV, the answer is always gluconate. Also remember: post-thyroidectomy patients need calcium monitoring  -  parathyroid removal is the most common cause.",
  },
  {
    id: "hypomagnesemia",
    title: "Case 7: Tremors & Cardiac Arrhythmias",
    labValues: [
      { name: "Magnesium (Mg²⁺)", value: "0.8", unit: "mg/dL", reference: "1.7-2.2", abnormal: true },
      { name: "Potassium (K⁺)", value: "3.0", unit: "mEq/L", reference: "3.5-5.0", abnormal: true },
      { name: "Calcium (Ca²⁺)", value: "7.6", unit: "mg/dL", reference: "8.5-10.5", abnormal: true },
      { name: "Phosphorus", value: "2.3", unit: "mg/dL", reference: "2.5-4.5", abnormal: true },
    ],
    symptoms: ["Coarse tremors", "Cardiac arrhythmias (PVCs, torsades)", "Hyperactive reflexes", "Tetany and muscle spasms", "Seizure risk", "History of chronic alcoholism and malnutrition"],
    ecgHint: "ECG shows prolonged QT interval, premature ventricular contractions (PVCs), and risk of torsades de pointes.",
    abnormalityOptions: ["Hypomagnesemia", "Hypermagnesemia", "Hypokalemia", "Hypocalcemia"],
    correctAbnormality: "Hypomagnesemia",
    priorityOptions: [
      "Administer IV magnesium sulfate with continuous cardiac monitoring; also correct K⁺ and Ca²⁺",
      "Give oral magnesium oxide tablets only",
      "Administer IV potassium first, ignore magnesium",
      "Restrict magnesium intake further",
    ],
    correctPriority: "Administer IV magnesium sulfate with continuous cardiac monitoring; also correct K⁺ and Ca²⁺",
    rationale: "Mg²⁺ of 0.8 mg/dL is critically low. Magnesium is the 'forgotten electrolyte'  -  its deficiency causes refractory hypokalemia and hypocalcemia. You CANNOT correct K⁺ or Ca²⁺ until Mg²⁺ is replaced first. IV magnesium sulfate is given for severe deficiency with cardiac monitoring (risk of arrhythmias). Common causes: alcoholism, malnutrition, loop diuretics, proton pump inhibitors.",
    examTrap: "The classic exam trap: A patient with hypokalemia that won't correct despite aggressive K⁺ replacement. The answer is ALWAYS 'check and replace magnesium first.' Mg²⁺ is required for the Na⁺/K⁺-ATPase pump to function. Without Mg²⁺, potassium leaks out of cells continuously.",
  },
  {
    id: "hypermagnesemia",
    title: "Case 8: Hypotension & Respiratory Depression",
    labValues: [
      { name: "Magnesium (Mg²⁺)", value: "5.6", unit: "mg/dL", reference: "1.7-2.2", abnormal: true },
      { name: "Creatinine", value: "5.1", unit: "mg/dL", reference: "0.7-1.3", abnormal: true },
      { name: "Calcium (Ca²⁺)", value: "8.8", unit: "mg/dL", reference: "8.5-10.5", abnormal: false },
      { name: "Potassium (K⁺)", value: "5.2", unit: "mEq/L", reference: "3.5-5.0", abnormal: true },
    ],
    symptoms: ["Hypotension (BP 82/50)", "Bradycardia (HR 48)", "Respiratory depression (RR 8)", "Loss of deep tendon reflexes", "Lethargy progressing to obtundation", "History of renal failure with Mg²⁺-containing antacid use"],
    ecgHint: "ECG shows bradycardia, prolonged PR interval, and widened QRS complex.",
    abnormalityOptions: ["Hypermagnesemia", "Hypomagnesemia", "Hyperkalemia", "Hypercalcemia"],
    correctAbnormality: "Hypermagnesemia",
    priorityOptions: [
      "Administer IV calcium gluconate as antidote; support airway and breathing; stop all Mg²⁺-containing products",
      "Give additional magnesium sulfate IV",
      "Administer furosemide alone without calcium",
      "Give IV normal saline bolus only",
    ],
    correctPriority: "Administer IV calcium gluconate as antidote; support airway and breathing; stop all Mg²⁺-containing products",
    rationale: "Mg²⁺ of 5.6 mg/dL is critically elevated. Hypermagnesemia is almost always iatrogenic in renal failure patients (Mg²⁺-containing antacids, laxatives, or excessive IV MgSO₄ in eclampsia treatment). Calcium gluconate is the direct antidote  -  it antagonizes magnesium at the neuromuscular junction. Loss of DTRs is the earliest sign; respiratory arrest can follow. Stop ALL magnesium sources immediately. Dialysis may be needed if renal function is impaired.",
    examTrap: "In obstetrics: MgSO₄ is given for pre-eclampsia/eclampsia. The nurse MUST check deep tendon reflexes (DTRs) before each dose. If DTRs are absent → HOLD the magnesium and notify the provider. Always have calcium gluconate at bedside as the antidote. Respiratory rate < 12 = hold MgSO₄.",
  },
];

const electrolyteCases: ElectrolyteCase[] = [
  ...baseElectrolyteCases,
  ...(electrolyteCasesBatch1 as ElectrolyteCase[]),
  ...(electrolyteCasesBatch2 as ElectrolyteCase[]),
];

const baseAbgCases: ABGCase[] = [
  {
    id: "copd-retention",
    title: "Case 1: COPD with CO₂ Retention",
    scenario: "A 68-year-old patient with a 40-year smoking history and known COPD presents with worsening dyspnea over 3 days. Uses home O₂ at 2 L/min. SpO₂ is 87% on room air. Appears barrel-chested with pursed-lip breathing.",
    values: { pH: 7.35, PaCO2: 58, HCO3: 32, PaO2: 55 },
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.35  -  low-normal (acidotic side), but within normal range" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 58 mmHg  -  elevated (normal 35-45). Indicates CO₂ retention (respiratory acidosis)" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 32 mEq/L  -  elevated (normal 22-26). Kidneys are retaining bicarbonate to compensate" },
      { step: "Compensation", finding: "FULLY COMPENSATED  -  pH is near normal because kidneys have had time to raise HCO₃⁻ to buffer the chronic CO₂ retention" },
    ],
    disorderOptions: [
      "Compensated respiratory acidosis (chronic CO₂ retention)",
      "Acute respiratory acidosis",
      "Metabolic alkalosis",
      "Mixed respiratory and metabolic acidosis",
    ],
    correctDisorder: "Compensated respiratory acidosis (chronic CO₂ retention)",
    compensationOptions: [
      "Renal compensation  -  kidneys retain HCO₃⁻ over days to weeks to normalize pH",
      "Respiratory compensation  -  lungs blow off CO₂",
      "No compensation expected",
      "Hepatic compensation",
    ],
    correctCompensation: "Renal compensation  -  kidneys retain HCO₃⁻ over days to weeks to normalize pH",
    actionOptions: [
      "Maintain low-flow O₂ (1-2 L/min via nasal cannula); do NOT over-oxygenate; monitor for worsening CO₂ retention",
      "Apply 100% non-rebreather mask immediately",
      "Administer IV sodium bicarbonate",
      "Hyperventilate the patient with bag-valve mask",
    ],
    correctAction: "Maintain low-flow O₂ (1-2 L/min via nasal cannula); do NOT over-oxygenate; monitor for worsening CO₂ retention",
    rationale: "This is CHRONIC compensated respiratory acidosis. The high HCO₃⁻ tells you this is NOT acute  -  the kidneys take 3-5 days to compensate. The near-normal pH confirms full compensation. These patients rely on hypoxic drive to breathe. High-flow O₂ removes this drive → apnea and death. Always use low-flow O₂ and monitor closely.",
    examTrap: "The #1 COPD exam trap: Don't mistake compensated respiratory acidosis for metabolic alkalosis just because HCO₃⁻ is high. The PRIMARY problem is the high CO₂ (respiratory). The high HCO₃⁻ is the COMPENSATION, not the problem. Also: NEVER give high-flow O₂ to a chronic CO₂ retainer  -  it removes hypoxic drive.",
  },
  {
    id: "dka",
    title: "Case 2: Diabetic Ketoacidosis (DKA)",
    scenario: "A 22-year-old Type 1 diabetic presents with nausea, vomiting, abdominal pain, and fruity breath odor. Kussmaul respirations (deep, rapid breathing) observed. Blood glucose is critically elevated.",
    values: { pH: 7.18, PaCO2: 22, HCO3: 8, PaO2: 98 },
    glucoseMmol: 28.0,
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.18  -  critically acidotic (normal 7.35-7.45)" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 22 mmHg  -  low (normal 35-45). Lungs are hyperventilating to blow off CO₂ (compensating)" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 8 mEq/L  -  critically low (normal 22-26). This is the PRIMARY problem  -  metabolic acidosis" },
      { step: "Compensation", finding: "PARTIALLY COMPENSATED  -  lungs are trying (low CO₂) but pH is still very acidotic. Kussmaul breathing is the respiratory compensation attempt" },
    ],
    disorderOptions: [
      "Partially compensated metabolic acidosis",
      "Respiratory alkalosis",
      "Compensated respiratory acidosis",
      "Uncompensated metabolic alkalosis",
    ],
    correctDisorder: "Partially compensated metabolic acidosis",
    compensationOptions: [
      "Respiratory compensation  -  Kussmaul breathing blows off CO₂ to raise pH",
      "Renal compensation  -  kidneys excrete acid",
      "No compensation occurring",
      "Buffer system only",
    ],
    correctCompensation: "Respiratory compensation  -  Kussmaul breathing blows off CO₂ to raise pH",
    actionOptions: [
      "Start IV insulin drip and aggressive IV normal saline; monitor K⁺ closely (replace when < 5.3); check glucose hourly",
      "Administer IV sodium bicarbonate immediately",
      "Give subcutaneous insulin and oral fluids",
      "Administer 50% dextrose IV push",
    ],
    correctAction: "Start IV insulin drip and aggressive IV normal saline; monitor K⁺ closely (replace when < 5.3); check glucose hourly",
    rationale: "DKA produces ketoacids (beta-hydroxybutyrate, acetoacetate) that consume HCO₃⁻. The body compensates with Kussmaul breathing to blow off CO₂. Treatment priorities: 1) IV fluids (patients are severely dehydrated), 2) IV insulin drip (corrects ketoacidosis), 3) Potassium monitoring (insulin drives K⁺ into cells  -  hypokalemia can cause fatal arrhythmias). Do NOT give bicarb unless pH < 6.9.",
    examTrap: "DKA exam trap: Serum K⁺ may appear NORMAL or HIGH on admission despite total body potassium depletion. Acidosis shifts K⁺ OUT of cells. Once insulin is given, K⁺ crashes into cells → fatal hypokalemia. ALWAYS check K⁺ before and during insulin therapy. If K⁺ < 3.3, hold insulin and replace K⁺ first.",
  },
  {
    id: "vomiting-alkalosis",
    title: "Case 3: Prolonged Vomiting",
    scenario: "A 34-year-old pregnant woman at 10 weeks gestation has had severe hyperemesis gravidarum for 5 days with intractable vomiting. She is dehydrated with poor skin turgor, dry mucous membranes, and orthostatic hypotension.",
    values: { pH: 7.52, PaCO2: 48, HCO3: 38, PaO2: 92 },
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.52  -  alkalotic (normal 7.35-7.45)" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 48 mmHg  -  slightly elevated (normal 35-45). Lungs are hypoventilating to retain CO₂ (compensating)" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 38 mEq/L  -  elevated (normal 22-26). This is the PRIMARY problem  -  metabolic alkalosis" },
      { step: "Compensation", finding: "PARTIALLY COMPENSATED  -  lungs retain CO₂ by breathing slower/shallower, but pH remains alkalotic" },
    ],
    disorderOptions: [
      "Partially compensated metabolic alkalosis",
      "Respiratory acidosis",
      "Uncompensated metabolic acidosis",
      "Compensated respiratory alkalosis",
    ],
    correctDisorder: "Partially compensated metabolic alkalosis",
    compensationOptions: [
      "Respiratory compensation  -  lungs hypoventilate to retain CO₂ and lower pH",
      "Renal compensation  -  kidneys excrete HCO₃⁻",
      "No compensation present",
      "Metabolic compensation through lactate production",
    ],
    correctCompensation: "Respiratory compensation  -  lungs hypoventilate to retain CO₂ and lower pH",
    actionOptions: [
      "Replace fluids with IV normal saline; replace chloride and potassium; administer antiemetics",
      "Administer IV sodium bicarbonate",
      "Encourage oral intake despite vomiting",
      "Hyperventilate with supplemental O₂",
    ],
    correctAction: "Replace fluids with IV normal saline; replace chloride and potassium; administer antiemetics",
    rationale: "Prolonged vomiting causes loss of HCl (hydrochloric acid) from the stomach → metabolic alkalosis. Loss of chloride triggers the kidneys to retain HCO₃⁻ instead (contraction alkalosis). Hypokalemia develops as kidneys excrete K⁺ to retain H⁺. Treatment: NS provides chloride to break the cycle. Replace K⁺. Antiemetics stop further acid loss. The lungs compensate by slowing respiration, but this is limited because hypoventilation also lowers O₂.",
    examTrap: "Metabolic alkalosis from vomiting is 'chloride-responsive'  -  giving NS (with chloride) corrects it. NG suction causes the same pattern. Remember: the respiratory compensation for metabolic alkalosis is LIMITED because the body won't hypoventilate enough to cause dangerous hypoxia.",
  },
  {
    id: "sepsis-lactic",
    title: "Case 4: Sepsis with Lactic Acidosis",
    scenario: "A 58-year-old patient with a UTI progressed to sepsis. She is febrile (39.8°C), tachycardic (HR 128), hypotensive (BP 76/42), with mottled skin and altered mental status. Lactate is critically elevated.",
    values: { pH: 7.22, PaCO2: 24, HCO3: 10, PaO2: 88 },
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.22  -  severely acidotic (normal 7.35-7.45)" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 24 mmHg  -  low (normal 35-45). Lungs are hyperventilating to compensate" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 10 mEq/L  -  critically low (normal 22-26). PRIMARY problem is metabolic acidosis" },
      { step: "Compensation", finding: "PARTIALLY COMPENSATED  -  respiratory system is attempting compensation but pH remains dangerously acidotic" },
    ],
    disorderOptions: [
      "Partially compensated metabolic acidosis (lactic acidosis from sepsis)",
      "Acute respiratory acidosis",
      "Compensated respiratory alkalosis",
      "Uncompensated metabolic alkalosis",
    ],
    correctDisorder: "Partially compensated metabolic acidosis (lactic acidosis from sepsis)",
    compensationOptions: [
      "Respiratory compensation  -  tachypnea blows off CO₂ to attempt pH correction",
      "Renal compensation  -  kidneys retain bicarbonate",
      "No compensation is occurring",
      "Hepatic lactate clearance compensation",
    ],
    correctCompensation: "Respiratory compensation  -  tachypnea blows off CO₂ to attempt pH correction",
    actionOptions: [
      "Aggressive IV fluid resuscitation (30 mL/kg crystalloid within first hour); obtain blood cultures; administer broad-spectrum antibiotics within 1 hour",
      "Administer IV sodium bicarbonate drip",
      "Start vasopressors before IV fluids",
      "Give oral antibiotics and monitor outpatient",
    ],
    correctAction: "Aggressive IV fluid resuscitation (30 mL/kg crystalloid within first hour); obtain blood cultures; administer broad-spectrum antibiotics within 1 hour",
    rationale: "Sepsis causes tissue hypoperfusion → anaerobic metabolism → lactic acid production → metabolic acidosis. The Surviving Sepsis Campaign guidelines (Hour-1 Bundle): 1) Measure lactate, 2) Blood cultures before antibiotics, 3) Broad-spectrum antibiotics within 1 hour, 4) 30 mL/kg crystalloid for hypotension or lactate ≥ 4. Fix the underlying infection to resolve the acidosis. Bicarb is NOT recommended unless pH < 7.15.",
    examTrap: "Sepsis exam trap: Do NOT give vasopressors BEFORE adequate fluid resuscitation. Fluids FIRST, then vasopressors if MAP remains < 65 despite fluids. Also: elevated lactate in sepsis = tissue hypoperfusion, NOT liver failure. Serial lactate measurements guide resuscitation effectiveness.",
  },
  {
    id: "panic-hyperventilation",
    title: "Case 5: Panic Attack Hyperventilation",
    scenario: "A 25-year-old presents to the ED with acute onset of tingling in hands and feet, lightheadedness, chest tightness, and a feeling of 'not being able to get enough air.' She is breathing rapidly at 32 breaths/min. She reports a stressful work event triggered her symptoms.",
    values: { pH: 7.58, PaCO2: 22, HCO3: 23, PaO2: 110 },
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.58  -  significantly alkalotic (normal 7.35-7.45)" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 22 mmHg  -  critically low (normal 35-45). Patient is blowing off too much CO₂  -  this is the PRIMARY problem" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 23 mEq/L  -  normal (22-26). Kidneys have NOT had time to compensate" },
      { step: "Compensation", finding: "UNCOMPENSATED  -  this is an ACUTE event. Renal compensation takes days, so HCO₃⁻ is still normal" },
    ],
    disorderOptions: [
      "Uncompensated (acute) respiratory alkalosis",
      "Metabolic alkalosis",
      "Compensated respiratory alkalosis",
      "Mixed alkalosis",
    ],
    correctDisorder: "Uncompensated (acute) respiratory alkalosis",
    compensationOptions: [
      "No compensation yet  -  renal compensation (HCO₃⁻ excretion) takes 24-48 hours to begin",
      "Respiratory compensation is occurring",
      "Full metabolic compensation achieved",
      "Buffer compensation only",
    ],
    correctCompensation: "No compensation yet  -  renal compensation (HCO₃⁻ excretion) takes 24-48 hours to begin",
    actionOptions: [
      "Coach slow breathing techniques; provide calm reassurance; address anxiety; do NOT use paper bag rebreathing",
      "Intubate and mechanically ventilate",
      "Administer IV sodium bicarbonate",
      "Apply 100% O₂ via non-rebreather",
    ],
    correctAction: "Coach slow breathing techniques; provide calm reassurance; address anxiety; do NOT use paper bag rebreathing",
    rationale: "Hyperventilation from anxiety blows off excessive CO₂ → respiratory alkalosis. The low CO₂ causes cerebral vasoconstriction (lightheadedness) and shifts calcium into albumin binding (perioral/extremity tingling mimics hypocalcemia). Treatment is coaching slow, controlled breathing. Paper bag rebreathing is NO LONGER recommended  -  it can cause dangerous hypoxia if the underlying cause is actually PE or pneumothorax. Rule out organic causes first.",
    examTrap: "Critical exam trap: NEVER assume hyperventilation is 'just anxiety' without ruling out pulmonary embolism, pneumothorax, or DKA (which also causes tachypnea). Paper bag rebreathing is outdated and dangerous. Also: the tingling and numbness mimic hypocalcemia but it's actually alkalosis shifting ionized calcium, not true calcium deficiency.",
  },
  {
    id: "mixed-disorder",
    title: "Case 6: Mixed Acid-Base Disorder",
    scenario: "A 72-year-old patient with COPD (chronic CO₂ retainer) develops severe pneumonia with sepsis. He is febrile, tachypneic, and hypoxic. He has been chronically compensated but is now acutely decompensating.",
    values: { pH: 7.18, PaCO2: 70, HCO3: 18, PaO2: 48 },
    stepwise: [
      { step: "pH Assessment", finding: "pH 7.18  -  severely acidotic (normal 7.35-7.45)" },
      { step: "PaCO₂ Assessment", finding: "PaCO₂ 70 mmHg  -  markedly elevated. Worsening respiratory acidosis (baseline was ~58)" },
      { step: "HCO₃⁻ Assessment", finding: "HCO₃⁻ 18 mEq/L  -  LOW-normal/slightly low. In a compensated COPD patient, HCO₃⁻ should be ~32. This drop indicates a CONCURRENT metabolic acidosis" },
      { step: "Compensation", finding: "MIXED DISORDER  -  both respiratory acidosis (high CO₂ from COPD exacerbation) AND metabolic acidosis (low HCO₃⁻ from sepsis/lactic acidosis) are occurring simultaneously" },
    ],
    disorderOptions: [
      "Mixed respiratory acidosis AND metabolic acidosis",
      "Simple acute respiratory acidosis",
      "Compensated metabolic acidosis",
      "Respiratory alkalosis with metabolic compensation",
    ],
    correctDisorder: "Mixed respiratory acidosis AND metabolic acidosis",
    compensationOptions: [
      "No effective compensation  -  both acid-base systems are contributing to acidosis, making this immediately life-threatening",
      "Renal compensation is correcting the problem",
      "Respiratory compensation through increased ventilation",
      "Full compensation expected within hours",
    ],
    correctCompensation: "No effective compensation  -  both acid-base systems are contributing to acidosis, making this immediately life-threatening",
    actionOptions: [
      "Prepare for potential intubation/mechanical ventilation; treat sepsis aggressively with antibiotics and fluids; monitor in ICU",
      "Apply high-flow O₂ via non-rebreather only",
      "Administer IV sodium bicarbonate as primary treatment",
      "Increase home O₂ flow rate and discharge",
    ],
    correctAction: "Prepare for potential intubation/mechanical ventilation; treat sepsis aggressively with antibiotics and fluids; monitor in ICU",
    rationale: "This is the most dangerous ABG pattern  -  MIXED disorder with BOTH systems causing acidosis simultaneously. The clue: In a known COPD patient with baseline CO₂ ~58 and HCO₃⁻ ~32, a drop in HCO₃⁻ to 18 means something ELSE is consuming bicarb (sepsis → lactic acidosis). Neither system can compensate for the other. This patient needs ICU management: likely intubation for respiratory failure, plus sepsis treatment for the metabolic component.",
    examTrap: "Mixed disorder exam trap: Always compare the CURRENT ABG to the patient's BASELINE. A COPD patient with HCO₃⁻ of 18 is NOT normal  -  their baseline should be ~30-32. The drop in HCO₃⁻ reveals the hidden metabolic acidosis. Without knowing the baseline, you'd miss the mixed disorder and call it 'simple respiratory acidosis.'",
  },
];

const abgCases: ABGCase[] = [
  ...baseAbgCases,
  ...(abgCasesBatch1 as ABGCase[]),
  ...(abgCasesBatch2 as ABGCase[]),
];

function ElectrolyteSection({ country }: { country: CountryMode }) {
  const { t } = useI18n();
  const unitMode = getDefaultUnitMode(country);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAbnormality, setSelectedAbnormality] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showAbnormalityResult, setShowAbnormalityResult] = useState(false);
  const [showPriorityResult, setShowPriorityResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completedCases, setCompletedCases] = useState<Set<string>>(new Set());

  const currentCase = electrolyteCases[currentIndex];

  const handleCheckAbnormality = () => {
    setShowAbnormalityResult(true);
  };

  const handleCheckPriority = () => {
    setShowPriorityResult(true);
    const abnormalityCorrect = selectedAbnormality === currentCase.correctAbnormality;
    const priorityCorrect = selectedPriority === currentCase.correctPriority;
    const points = (abnormalityCorrect ? 1 : 0) + (priorityCorrect ? 1 : 0);
    if (!completedCases.has(currentCase.id)) {
      setScore((prev) => ({ correct: prev.correct + points, total: prev.total + 2 }));
      setCompletedCases((prev) => new Set(prev).add(currentCase.id));
    }
  };

  const handleNext = () => {
    if (currentIndex < electrolyteCases.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetCase();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetCase();
    }
  };

  const resetCase = () => {
    setSelectedAbnormality(null);
    setSelectedPriority(null);
    setShowAbnormalityResult(false);
    setShowPriorityResult(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setCompletedCases(new Set());
    resetCase();
  };

  return (
    <div className="space-y-6" data-testid="section-electrolyte">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Case {currentIndex + 1} of {electrolyteCases.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary" data-testid="text-electrolyte-score">{score.correct}/{score.total}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1" onClick={handleReset} data-testid="button-reset-electrolyte">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="border border-gray-100 bg-white">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900" data-testid={`text-electrolyte-title-${currentCase.id}`}>{currentCase.title}</h3>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("pages.electrolyteAbgSimulator.labValues")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {currentCase.labValues.map((lab, i) => (
                <div key={i} className={`p-3 rounded-lg border ${lab.abnormal ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`} data-testid={`lab-value-${currentCase.id}-${i}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{lab.name}</p>
                  <p className={`text-lg font-bold ${lab.abnormal ? "text-red-700" : "text-gray-900"}`}>
                    {lab.value} <span className="text-xs font-normal text-gray-400">{lab.unit}</span>
                  </p>
                  <p className="text-[10px] text-gray-400">Ref: {lab.reference}</p>
                </div>
              ))}
            </div>
            {currentCase.glucoseMmol && (
              <div className="mt-2 p-3 rounded-lg border bg-amber-50 border-amber-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{t("pages.electrolyteAbgSimulator.bloodGlucose")}</p>
                <p className="text-lg font-bold text-amber-700">{convertGlucose(currentCase.glucoseMmol, unitMode)}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{t("pages.electrolyteAbgSimulator.presentingSymptoms")}</p>
            <div className="space-y-1.5">
              {currentCase.symptoms.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Activity className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">{t("pages.electrolyteAbgSimulator.ecgFindings")}</p>
                <p className="text-sm text-blue-800 leading-relaxed">{currentCase.ecgHint}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-bold text-gray-900 mb-3">{t("pages.electrolyteAbgSimulator.1IdentifyTheElectrolyteAbnormality")}</p>
            <div className="space-y-2">
              {currentCase.abnormalityOptions.map((opt) => {
                const isSelected = selectedAbnormality === opt;
                const isCorrect = opt === currentCase.correctAbnormality;
                let optStyle = "border-gray-100 hover:border-primary/30 cursor-pointer";
                if (showAbnormalityResult && isSelected && isCorrect) optStyle = "border-emerald-300 bg-emerald-50/50";
                else if (showAbnormalityResult && isSelected && !isCorrect) optStyle = "border-red-300 bg-red-50/50";
                else if (showAbnormalityResult && isCorrect) optStyle = "border-emerald-200 bg-emerald-50/30";
                else if (isSelected) optStyle = "border-primary bg-primary/5";

                return (
                  <div
                    key={opt}
                    className={`p-3 rounded-lg border-2 transition-all ${optStyle} ${showAbnormalityResult ? "" : "cursor-pointer"}`}
                    onClick={() => !showAbnormalityResult && setSelectedAbnormality(opt)}
                    data-testid={`option-abnormality-${opt.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3">
                      {showAbnormalityResult ? (
                        isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4 h-4" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                      )}
                      <span className="text-sm text-gray-700">{opt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedAbnormality && !showAbnormalityResult && (
              <Button className="mt-3 rounded-full bg-primary text-white hover:brightness-110" onClick={handleCheckAbnormality} data-testid="button-check-abnormality">
                Check Answer
              </Button>
            )}
          </div>

          {showAbnormalityResult && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm font-bold text-gray-900 mb-3">{t("pages.electrolyteAbgSimulator.2WhatIsTheFirst")}</p>
              <div className="space-y-2">
                {currentCase.priorityOptions.map((opt) => {
                  const isSelected = selectedPriority === opt;
                  const isCorrect = opt === currentCase.correctPriority;
                  let optStyle = "border-gray-100 hover:border-primary/30 cursor-pointer";
                  if (showPriorityResult && isSelected && isCorrect) optStyle = "border-emerald-300 bg-emerald-50/50";
                  else if (showPriorityResult && isSelected && !isCorrect) optStyle = "border-red-300 bg-red-50/50";
                  else if (showPriorityResult && isCorrect) optStyle = "border-emerald-200 bg-emerald-50/30";
                  else if (isSelected) optStyle = "border-primary bg-primary/5";

                  return (
                    <div
                      key={opt}
                      className={`p-3 rounded-lg border-2 transition-all ${optStyle} ${showPriorityResult ? "" : "cursor-pointer"}`}
                      onClick={() => !showPriorityResult && setSelectedPriority(opt)}
                      data-testid={`option-priority-${currentCase.id}`}
                    >
                      <div className="flex items-center gap-3">
                        {showPriorityResult ? (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4 h-4" />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                        )}
                        <span className="text-sm text-gray-700">{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedPriority && !showPriorityResult && (
                <Button className="mt-3 rounded-full bg-primary text-white hover:brightness-110" onClick={handleCheckPriority} data-testid="button-check-priority">
                  Check Answer
                </Button>
              )}
            </div>
          )}

          {showPriorityResult && (
            <div className="space-y-4">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-bold text-gray-900">{t("pages.electrolyteAbgSimulator.clinicalRationale")}</h4>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentCase.rationale}</p>
                </CardContent>
              </Card>

              <Card className="border border-amber-200 bg-amber-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h4 className="text-sm font-bold text-amber-800">{t("pages.electrolyteAbgSimulator.examTrap")}</h4>
                  </div>
                  <p className="text-sm text-amber-900 leading-relaxed">{currentCase.examTrap}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" className="rounded-full gap-1" onClick={handlePrev} disabled={currentIndex === 0} data-testid="button-prev-electrolyte">
          ← Previous
        </Button>
        <Button variant="outline" className="rounded-full gap-1" onClick={handleNext} disabled={currentIndex === electrolyteCases.length - 1} data-testid="button-next-electrolyte">
          Next →
        </Button>
      </div>
    </div>
  );
}

function ABGSection({ country }: { country: CountryMode }) {
  const unitMode = getDefaultUnitMode(country);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [selectedDisorder, setSelectedDisorder] = useState<string | null>(null);
  const [selectedCompensation, setSelectedCompensation] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showDisorderResult, setShowDisorderResult] = useState(false);
  const [showCompensationResult, setShowCompensationResult] = useState(false);
  const [showActionResult, setShowActionResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [completedCases, setCompletedCases] = useState<Set<string>>(new Set());

  const currentCase = abgCases[currentIndex];

  const handleCheckDisorder = () => {
    setShowDisorderResult(true);
  };

  const handleCheckCompensation = () => {
    setShowCompensationResult(true);
  };

  const handleCheckAction = () => {
    setShowActionResult(true);
    const d = selectedDisorder === currentCase.correctDisorder ? 1 : 0;
    const c = selectedCompensation === currentCase.correctCompensation ? 1 : 0;
    const a = selectedAction === currentCase.correctAction ? 1 : 0;
    if (!completedCases.has(currentCase.id)) {
      setScore((prev) => ({ correct: prev.correct + d + c + a, total: prev.total + 3 }));
      setCompletedCases((prev) => new Set(prev).add(currentCase.id));
    }
  };

  const resetCase = () => {
    setStep(0);
    setSelectedDisorder(null);
    setSelectedCompensation(null);
    setSelectedAction(null);
    setShowDisorderResult(false);
    setShowCompensationResult(false);
    setShowActionResult(false);
  };

  const handleNext = () => {
    if (currentIndex < abgCases.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetCase();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      resetCase();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setCompletedCases(new Set());
    resetCase();
  };

  const pHStatus = currentCase.values.pH < 7.35 ? "Acidotic" : currentCase.values.pH > 7.45 ? "Alkalotic" : "Normal";
  const co2Status = currentCase.values.PaCO2 > 45 ? "Elevated (Acidotic)" : currentCase.values.PaCO2 < 35 ? "Low (Alkalotic)" : "Normal";
  const hco3Status = currentCase.values.HCO3 > 26 ? "Elevated (Alkalotic)" : currentCase.values.HCO3 < 22 ? "Low (Acidotic)" : "Normal";

  return (
    <div className="space-y-6" data-testid="section-abg">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-gray-500">Case {currentIndex + 1} of {abgCases.length}</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/5 px-3 py-1.5 rounded-full">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary" data-testid="text-abg-score">{score.correct}/{score.total}</span>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1" onClick={handleReset} data-testid="button-reset-abg">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <Card className="border border-gray-100 bg-white">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <h3 className="text-lg font-bold text-gray-900" data-testid={`text-abg-title-${currentCase.id}`}>{currentCase.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{currentCase.scenario}</p>

          {currentCase.glucoseMmol && (
            <div className="p-3 rounded-lg border bg-amber-50 border-amber-200 inline-block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{t("pages.electrolyteAbgSimulator.bloodGlucose2")}</p>
              <p className="text-lg font-bold text-amber-700">{convertGlucose(currentCase.glucoseMmol, unitMode)}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t("pages.electrolyteAbgSimulator.abgValues")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className={`p-3 rounded-lg border ${currentCase.values.pH < 7.35 || currentCase.values.pH > 7.45 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`} data-testid={`abg-ph-${currentCase.id}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">pH</p>
                <p className={`text-xl font-bold ${currentCase.values.pH < 7.35 || currentCase.values.pH > 7.45 ? "text-red-700" : "text-emerald-700"}`}>{currentCase.values.pH.toFixed(2)}</p>
                <p className="text-[10px] text-gray-400">{t("pages.electrolyteAbgSimulator.normal735745")}</p>
              </div>
              <div className={`p-3 rounded-lg border ${currentCase.values.PaCO2 > 45 || currentCase.values.PaCO2 < 35 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`} data-testid={`abg-paco2-${currentCase.id}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t("pages.electrolyteAbgSimulator.paco")}</p>
                <p className={`text-xl font-bold ${currentCase.values.PaCO2 > 45 || currentCase.values.PaCO2 < 35 ? "text-red-700" : "text-emerald-700"}`}>{currentCase.values.PaCO2} <span className="text-xs font-normal">mmHg</span></p>
                <p className="text-[10px] text-gray-400">{t("pages.electrolyteAbgSimulator.normal3545")}</p>
              </div>
              <div className={`p-3 rounded-lg border ${currentCase.values.HCO3 > 26 || currentCase.values.HCO3 < 22 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`} data-testid={`abg-hco3-${currentCase.id}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t("pages.electrolyteAbgSimulator.hco")}</p>
                <p className={`text-xl font-bold ${currentCase.values.HCO3 > 26 || currentCase.values.HCO3 < 22 ? "text-red-700" : "text-emerald-700"}`}>{currentCase.values.HCO3} <span className="text-xs font-normal">{t("pages.electrolyteAbgSimulator.meql")}</span></p>
                <p className="text-[10px] text-gray-400">{t("pages.electrolyteAbgSimulator.normal2226")}</p>
              </div>
              <div className={`p-3 rounded-lg border ${currentCase.values.PaO2 < 80 ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`} data-testid={`abg-pao2-${currentCase.id}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{t("pages.electrolyteAbgSimulator.pao")}</p>
                <p className={`text-xl font-bold ${currentCase.values.PaO2 < 80 ? "text-red-700" : "text-emerald-700"}`}>{currentCase.values.PaO2} <span className="text-xs font-normal">mmHg</span></p>
                <p className="text-[10px] text-gray-400">{t("pages.electrolyteAbgSimulator.normal80100")}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t("pages.electrolyteAbgSimulator.stepwiseInterpretation")}</p>
            <div className="space-y-2">
              {currentCase.stepwise.map((s, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${step >= i ? "bg-primary/5 border-primary/20" : "bg-gray-50 border-gray-100 opacity-50"}`}
                  onClick={() => step < i && setStep(i)}
                  data-testid={`step-${currentCase.id}-${i}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.step}</span>
                  </div>
                  {step >= i && <p className="text-sm text-gray-700 leading-relaxed ml-8">{s.finding}</p>}
                </div>
              ))}
              {step < currentCase.stepwise.length - 1 && (
                <Button variant="outline" size="sm" className="rounded-full ml-8" onClick={() => setStep((s) => s + 1)} data-testid="button-next-step">
                  Reveal Next Step <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {step >= currentCase.stepwise.length - 1 && (
            <div className="border-t border-gray-100 pt-5 space-y-5">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">{t("pages.electrolyteAbgSimulator.1IdentifyThePrimaryDisorder")}</p>
                <div className="space-y-2">
                  {currentCase.disorderOptions.map((opt) => {
                    const isSelected = selectedDisorder === opt;
                    const isCorrect = opt === currentCase.correctDisorder;
                    let s = "border-gray-100 hover:border-primary/30 cursor-pointer";
                    if (showDisorderResult && isSelected && isCorrect) s = "border-emerald-300 bg-emerald-50/50";
                    else if (showDisorderResult && isSelected && !isCorrect) s = "border-red-300 bg-red-50/50";
                    else if (showDisorderResult && isCorrect) s = "border-emerald-200 bg-emerald-50/30";
                    else if (isSelected) s = "border-primary bg-primary/5";
                    return (
                      <div key={opt} className={`p-3 rounded-lg border-2 transition-all ${s}`} onClick={() => !showDisorderResult && setSelectedDisorder(opt)} data-testid={`option-disorder-${currentCase.id}`}>
                        <div className="flex items-center gap-3">
                          {showDisorderResult ? (
                            isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4 h-4" />
                          ) : (
                            <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                          )}
                          <span className="text-sm text-gray-700">{opt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {selectedDisorder && !showDisorderResult && (
                  <Button className="mt-3 rounded-full bg-primary text-white hover:brightness-110" onClick={handleCheckDisorder} data-testid="button-check-disorder">{t("pages.electrolyteAbgSimulator.checkAnswer")}</Button>
                )}
              </div>

              {showDisorderResult && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">{t("pages.electrolyteAbgSimulator.2WhatCompensationIsExpected")}</p>
                  <div className="space-y-2">
                    {currentCase.compensationOptions.map((opt) => {
                      const isSelected = selectedCompensation === opt;
                      const isCorrect = opt === currentCase.correctCompensation;
                      let s = "border-gray-100 hover:border-primary/30 cursor-pointer";
                      if (showCompensationResult && isSelected && isCorrect) s = "border-emerald-300 bg-emerald-50/50";
                      else if (showCompensationResult && isSelected && !isCorrect) s = "border-red-300 bg-red-50/50";
                      else if (showCompensationResult && isCorrect) s = "border-emerald-200 bg-emerald-50/30";
                      else if (isSelected) s = "border-primary bg-primary/5";
                      return (
                        <div key={opt} className={`p-3 rounded-lg border-2 transition-all ${s}`} onClick={() => !showCompensationResult && setSelectedCompensation(opt)} data-testid={`option-compensation-${currentCase.id}`}>
                          <div className="flex items-center gap-3">
                            {showCompensationResult ? (
                              isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4 h-4" />
                            ) : (
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                            )}
                            <span className="text-sm text-gray-700">{opt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedCompensation && !showCompensationResult && (
                    <Button className="mt-3 rounded-full bg-primary text-white hover:brightness-110" onClick={handleCheckCompensation} data-testid="button-check-compensation">{t("pages.electrolyteAbgSimulator.checkAnswer2")}</Button>
                  )}
                </div>
              )}

              {showCompensationResult && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-3">{t("pages.electrolyteAbgSimulator.3WhatIsThePriority")}</p>
                  <div className="space-y-2">
                    {currentCase.actionOptions.map((opt) => {
                      const isSelected = selectedAction === opt;
                      const isCorrect = opt === currentCase.correctAction;
                      let s = "border-gray-100 hover:border-primary/30 cursor-pointer";
                      if (showActionResult && isSelected && isCorrect) s = "border-emerald-300 bg-emerald-50/50";
                      else if (showActionResult && isSelected && !isCorrect) s = "border-red-300 bg-red-50/50";
                      else if (showActionResult && isCorrect) s = "border-emerald-200 bg-emerald-50/30";
                      else if (isSelected) s = "border-primary bg-primary/5";
                      return (
                        <div key={opt} className={`p-3 rounded-lg border-2 transition-all ${s}`} onClick={() => !showActionResult && setSelectedAction(opt)} data-testid={`option-action-${currentCase.id}`}>
                          <div className="flex items-center gap-3">
                            {showActionResult ? (
                              isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : isSelected ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4 h-4" />
                            ) : (
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${isSelected ? "border-primary bg-primary" : "border-gray-300"}`} />
                            )}
                            <span className="text-sm text-gray-700">{opt}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedAction && !showActionResult && (
                    <Button className="mt-3 rounded-full bg-primary text-white hover:brightness-110" onClick={handleCheckAction} data-testid="button-check-action">{t("pages.electrolyteAbgSimulator.checkAnswer3")}</Button>
                  )}
                </div>
              )}

              {showActionResult && (
                <div className="space-y-4">
                  <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-primary" />
                        <h4 className="text-sm font-bold text-gray-900">{t("pages.electrolyteAbgSimulator.clinicalRationale2")}</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentCase.rationale}</p>
                    </CardContent>
                  </Card>
                  <Card className="border border-amber-200 bg-amber-50/50">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <h4 className="text-sm font-bold text-amber-800">{t("pages.electrolyteAbgSimulator.examTrap2")}</h4>
                      </div>
                      <p className="text-sm text-amber-900 leading-relaxed">{currentCase.examTrap}</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" className="rounded-full gap-1" onClick={handlePrev} disabled={currentIndex === 0} data-testid="button-prev-abg">
          ← Previous
        </Button>
        <Button variant="outline" className="rounded-full gap-1" onClick={handleNext} disabled={currentIndex === abgCases.length - 1} data-testid="button-next-abg">
          Next →
        </Button>
      </div>
    </div>
  );
}

export default function ElectrolyteABGSimulatorPage() {
  const { user, effectiveTier } = useAuth();
  const [activeTab, setActiveTab] = useState<"electrolyte" | "abg">("electrolyte");
  const [country, setCountry] = useState<CountryMode>("US");

  const hasPaidAccess = paidTiers.includes(effectiveTier);

  return (
    <div className={`min-h-screen bg-warmwhite flex flex-col font-sans ${user?.tier !== "admin" ? "select-none" : ""}`} onContextMenu={user?.tier !== "admin" ? (e) => e.preventDefault() : undefined}>
      <SEO
        title={t("pages.electrolyteAbgSimulator.electrolyteImbalanceAbgInterpretationEngine")}
        description={t("pages.electrolyteAbgSimulator.masterElectrolyteImbalancesAndArterial")}
        keywords="electrolyte imbalance nursing, ABG interpretation, arterial blood gas, hyperkalemia nursing, hyponatremia, metabolic acidosis, respiratory alkalosis, nursing exam prep"
        canonicalPath="/electrolyte-abg-simulator"
        ogType="website"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <BreadcrumbNav />
        {!hasPaidAccess ? (
          <div className="text-center py-16">
            <div className="max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary/60" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3" data-testid="text-page-title">{t("pages.electrolyteAbgSimulator.electrolyteAbgInterpreter")}</h1>
              <p className="text-lg text-gray-600 mb-2">{t("pages.electrolyteAbgSimulator.premiumInteractiveTool")}</p>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                Master electrolyte imbalances and arterial blood gas interpretation with stepwise clinical cases. Available exclusively for RPN, RN, and NP subscribers.
              </p>
              <LocaleLink href="/pricing">
                <Button className="rounded-full px-8 h-12 gap-2 bg-primary text-white hover:brightness-110 shadow-lg" data-testid="button-upgrade-electrolyte-abg">
                  <Sparkles className="w-4 h-4" />
                  View Subscription Plans
                </Button>
              </LocaleLink>
              {!user && (
                <p className="text-xs text-gray-400 mt-4">
                  Already subscribed? <LocaleLink href="/login" className="text-primary hover:underline">{t("pages.electrolyteAbgSimulator.signIn")}</LocaleLink> to access.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                    Electrolyte & ABG Interpreter
                  </h1>
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider mt-0.5">
                    Interactive Clinical Engine
                  </p>
                </div>
              </div>
              <p className="text-gray-600 max-w-3xl leading-relaxed mt-2">
                Identify electrolyte imbalances from lab values, symptoms, and ECG clues. Interpret ABGs using the stepwise method. Build the pattern recognition that prevents dangerous clinical errors.
              </p>
            </div>

            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex bg-gray-100 rounded-full p-1" data-testid="tabs-section">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "electrolyte" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("electrolyte")}
                  data-testid="tab-electrolyte"
                >
                  <Zap className="w-3.5 h-3.5 inline mr-1.5" />
                  Electrolyte Challenge
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "abg" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  onClick={() => setActiveTab("abg")}
                  data-testid="tab-abg"
                >
                  <Activity className="w-3.5 h-3.5 inline mr-1.5" />
                  ABG Interpreter
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{t("pages.electrolyteAbgSimulator.units")}</span>
                <div className="flex bg-gray-100 rounded-full p-0.5">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${country === "US" ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
                    onClick={() => setCountry("US")}
                    data-testid="button-units-us"
                  >
                    US
                  </button>
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${country === "CA" ? "bg-white text-primary shadow-sm" : "text-gray-500"}`}
                    onClick={() => setCountry("CA")}
                    data-testid="button-units-ca"
                  >
                    CA
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "electrolyte" ? (
              <ElectrolyteSection country={country} />
            ) : (
              <ABGSection country={country} />
            )}
          </div>
        )}
      </main>
      <AdminEditButton pageName="electrolyte-abg-simulator" />
      <Footer />
    </div>
  );
}
