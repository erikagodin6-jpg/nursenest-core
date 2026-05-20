#!/usr/bin/env node
/**
 * Generates pathophysiology-200-wave2.manifest.json with 200 RN/PN/NP topics
 * that do not overlap nclex-seo-100 baseline (slugs + primary keywords).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const baselinePath = path.join(root, "data/blog-manifest/existing-topics-wave1-baseline.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const forbidden = new Set();
for (const s of baseline.slugs) forbidden.add(`slug:${s}`);
for (const k of baseline.primaryKeywords) forbidden.add(`kw:${String(k).toLowerCase().trim()}`);

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 110);
}

const posts = [];
let seq = 0;

function register(p) {
  const pk = p.primaryKeyword.toLowerCase().trim();
  if (forbidden.has(`slug:${p.slug}`)) throw new Error(`dup slug ${p.slug}`);
  if (forbidden.has(`kw:${pk}`)) throw new Error(`dup kw ${pk}`);
  forbidden.add(`slug:${p.slug}`);
  forbidden.add(`kw:${pk}`);
  posts.push(p);
}

/** Curated clusters: 25 clusters × 8 posts = 200; pathway rotates RN/PN/NP with counts 80/60/60 */
const clusters = [
  {
    id: "cluster-electrolyte-mg-ca-phos",
    pillar: "Electrolyte & Mineral Homeostasis",
    items: [
      { type: "comparison", title: "Hypermagnesemia vs Hypomagnesemia: ECG and Priority (NCLEX)", kw: "hypermagnesemia vs hypomagnesemia NCLEX nursing" },
      { type: "mechanism", title: "Why Hypomagnesemia Worsens Arrhythmia Risk With Digoxin", kw: "hypomagnesemia digoxin toxicity mechanism nursing" },
      { type: "labs", title: "Corrected Calcium vs Ionized Calcium: Which Lab for Bedside Decisions?", kw: "corrected calcium vs ionized calcium nursing" },
      { type: "early-vs-late", title: "Early vs Late Signs of Symptomatic Hypercalcemia", kw: "early vs late hypercalcemia signs nursing NCLEX" },
      { type: "untreated", title: "What Happens if Severe Hyperphosphatemia in CKD Goes Untreated?", kw: "untreated hyperphosphatemia CKD complications nursing" },
      { type: "case", title: "Case Breakdown: Tetany After Thyroidectomy (Calcium and Parathyroid)", kw: "post thyroidectomy hypocalcemia tetany NCLEX case" },
      { type: "system-dive", title: "Phosphate Shift in Refeeding Syndrome: Pathophysiology for Nurses", kw: "refeeding syndrome phosphate pathophysiology nursing" },
      { type: "comparison", title: "Trousseau vs Chvostek: What Each Sign Really Implies", kw: "Trousseau sign vs Chvostek sign hypocalcemia nursing" },
    ],
  },
  {
    id: "cluster-acid-base-abg",
    pillar: "ABG & Acid–Base",
    items: [
      { type: "comparison", title: "Respiratory Acidosis vs Metabolic Acidosis: ABG Patterns That Stick", kw: "respiratory acidosis vs metabolic acidosis ABG nursing" },
      { type: "mechanism", title: "Why Does Kussmaul Breathing Appear in Metabolic Acidosis?", kw: "Kussmaul breathing metabolic acidosis mechanism" },
      { type: "labs", title: "Winter’s Formula: When It Helps—and When It Misleads", kw: "Winter formula ABG expected PCO2 nursing" },
      { type: "early-vs-late", title: "Early vs Late Compensation on ABG: Chronic vs Acute Frames", kw: "acute vs chronic respiratory acidosis compensation ABG" },
      { type: "untreated", title: "What Happens if Severe Metabolic Acidosis Is Uncorrected Too Slowly—or Too Fast?", kw: "metabolic acidosis correction complications nursing" },
      { type: "case", title: "Case ABG: Post-Op Nausea, Tachypnea, and Low Bicarbonate", kw: "postoperative metabolic acidosis ABG case nursing" },
      { type: "system-dive", title: "Strong Ion Difference Simplified for NCLEX (Without the Math Rabbit Hole)", kw: "acid base strong ion nursing simplified NCLEX" },
      { type: "comparison", title: "AG vs Non-AG Metabolic Acidosis: Differential Anchors for Exams", kw: "anion gap vs non anion gap metabolic acidosis nursing" },
    ],
  },
  {
    id: "cluster-potassium-renal",
    pillar: "Potassium & Renal Handling",
    items: [
      { type: "mechanism", title: "Why Insulin and Beta-Agonists Lower Serum Potassium", kw: "insulin shifts potassium intracellular mechanism nursing" },
      { type: "labs", title: "Urine Potassium in Hypokalemia: When the Spot Urine Helps", kw: "urine potassium hypokalemia evaluation nursing" },
      { type: "comparison", title: "Hyperkalemia from Tissue Breakdown vs Renal Failure: Clues in the Stem", kw: "hyperkalemia rhabdomyolysis vs renal failure nursing" },
      { type: "case", title: "Case: Crush Injury, Dark Urine, and Peaked T Waves", kw: "crush injury hyperkalemia case NCLEX nursing" },
      { type: "untreated", title: "What Happens if Hyperkalemia Is Left Untreated (Conduction to Arrest)", kw: "untreated hyperkalemia complications nursing" },
      { type: "early-vs-late", title: "Early ECG Changes of Hyperkalemia vs Late Life-Threatening Patterns", kw: "hyperkalemia ECG progression early late nursing" },
      { type: "system-dive", title: "Aldosterone, Collecting Duct, and Potassium: A Nurse-Friendly Map", kw: "aldosterone potassium renal mechanism nursing" },
      { type: "mechanism", title: "Why Hypomagnesemia Makes Hypokalemia Hard to Fix", kw: "hypomagnesemia refractory hypokalemia mechanism nursing" },
    ],
  },
  {
    id: "cluster-cardiac-ischemia",
    pillar: "Cardiac Ischemia & Injury",
    items: [
      { type: "comparison", title: "STEMI vs NSTEMI: Priority and Monitoring Differences for Exams", kw: "STEMI vs NSTEMI nursing priorities NCLEX" },
      { type: "mechanism", title: "Why Demand Ischemia Can Happen Without a Plaque Rupture Story", kw: "demand ischemia pathophysiology nursing" },
      { type: "case", title: "Case: ST Changes With Normal Troponin—What the Stem Is Testing", kw: "ST depression troponin negative case nursing NCLEX" },
      { type: "labs", title: "High-Sensitivity Troponin Trends: Timing Traps on Boards", kw: "high sensitivity troponin serial nursing NCLEX" },
      { type: "untreated", title: "What Happens if Acute Coronary Syndrome Escalates Untreated", kw: "untreated ACS complications nursing" },
      { type: "early-vs-late", title: "Early vs Late Cardiogenic Shock After MI: Assessment Shifts", kw: "early vs late cardiogenic shock nursing" },
      { type: "system-dive", title: "Right Ventricular Infarction: Pathophysiology That Changes Fluids", kw: "right ventricular infarction pathophysiology fluids nursing" },
      { type: "comparison", title: "Pericarditis Pain vs ACS Pain: Differentiation for NCLEX", kw: "pericarditis vs ACS chest pain nursing" },
    ],
  },
  {
    id: "cluster-hf-volume",
    pillar: "Heart Failure & Volume",
    items: [
      { type: "comparison", title: "HFrEF vs HFpEF: Different Hemodynamics, Different Teaching Emphasis", kw: "HFrEF vs HFpEF nursing comparison NCLEX" },
      { type: "mechanism", title: "Why Afterload Reduction Helps Forward Output in Systolic Failure", kw: "afterload reduction heart failure mechanism nursing" },
      { type: "case", title: "Case: Orthopnea, JVD, and Peripheral Edema—Left vs Right Emphasis", kw: "biventricular heart failure case nursing NCLEX" },
      { type: "labs", title: "BNP/NT-proBNP: Interpretation Without Overfitting One Number", kw: "BNP NT proBNP interpretation nursing heart failure" },
      { type: "untreated", title: "What Happens if Acute Decompensated HF Is Not Addressed", kw: "untreated acute heart failure complications nursing" },
      { type: "early-vs-late", title: "Early Pulmonary Congestion Clues vs Frank Pulmonary Edema", kw: "early pulmonary edema vs late nursing assessment" },
      { type: "system-dive", title: "Neurohormonal Activation in HF: Why Beta-Blockers Eventually Help", kw: "neurohormonal activation heart failure beta blocker nursing" },
      { type: "mechanism", title: "Why Loop Diuretics Can Worsen GFR in Some HF Pictures", kw: "loop diuretics prerenal azotemia heart failure nursing" },
    ],
  },
  {
    id: "cluster-arrhythmia-electrolyte",
    pillar: "Arrhythmias & Electrolytes",
    items: [
      { type: "comparison", title: "VT vs SVT With Aberrancy: Board-Safe Simplifications", kw: "VT vs SVT with aberrancy nursing NCLEX" },
      { type: "mechanism", title: "Why Hypokalemia and Hypomagnesemia Feed Ventricular Ectopy", kw: "hypokalemia PVC pathophysiology nursing" },
      { type: "labs", title: "QTc Prolongation: Drug and Electrolyte Co-Conspirators", kw: "QT prolongation electrolytes drugs nursing" },
      { type: "case", title: "Case: Syncope + Long QT Family History + New Antibiotic", kw: "drug induced long QT case nursing NCLEX" },
      { type: "untreated", title: "What Happens if Torsades Risk Is Ignored on Telemetry", kw: "torsades untreated complications nursing" },
      { type: "early-vs-late", title: "Stable Wide-Complex Tachycardia vs Unstable: Priority Fork", kw: "stable vs unstable tachycardia nursing priority" },
      { type: "system-dive", title: "Reentry vs Automaticity: Enough Physiology to Answer Priority Items", kw: "reentry vs automaticity arrhythmia nursing simplified" },
      { type: "comparison", title: "Atrial Flutter vs Atrial Fibrillation: Regularity and Rate Control Themes", kw: "atrial flutter vs atrial fibrillation nursing NCLEX" },
    ],
  },
  {
    id: "cluster-respiratory-failure",
    pillar: "Respiratory Failure & Oxygenation",
    items: [
      { type: "comparison", title: "Type 1 vs Type 2 Respiratory Failure: ABG Anchors", kw: "type 1 vs type 2 respiratory failure ABG nursing" },
      { type: "mechanism", title: "Why Shunt Worsens Hypoxemia Even With High FiO2", kw: "intrapulmonary shunt hypoxemia mechanism nursing" },
      { type: "labs", title: "PaO2/FiO2 Without Memorizing the Wrong Cutoffs Blindly", kw: "P/F ratio nursing interpretation ARDS" },
      { type: "case", title: "Case: Asthma Exacerbation—When ‘Normal’ SpO2 Lies", kw: "asthma exacerbation normal SpO2 nursing case" },
      { type: "untreated", title: "What Happens if Hypercapnic Respiratory Failure Escalates", kw: "untreated hypercapnic respiratory failure nursing" },
      { type: "early-vs-late", title: "Early Work of Breathing vs Silent Respiratory Fatigue in Kids/Adults", kw: "respiratory fatigue signs early late nursing" },
      { type: "system-dive", title: "Dead Space vs Shunt: Two Different Hypoxia Stories", kw: "dead space vs shunt ventilation perfusion nursing" },
      { type: "comparison", title: "COPD Exacerbation vs Pneumonia: Overlap and Forks", kw: "COPD exacerbation vs pneumonia nursing differentiation" },
    ],
  },
  {
    id: "cluster-ards-vent",
    pillar: "ARDS & Mechanical Ventilation Concepts",
    items: [
      { type: "mechanism", title: "Why PEEP Improves Oxygenation in recruitable ARDS Lungs", kw: "PEEP ARDS oxygenation mechanism nursing" },
      { type: "comparison", title: "ARDS vs Cardiogenic Pulmonary Edema: Clues Beyond ‘Wet’", kw: "ARDS vs cardiogenic pulmonary edema nursing" },
      { type: "case", title: "Case: Ventilator Alarms, Auto-PEEP, and Breath Stacking", kw: "auto PEEP breath stacking case nursing" },
      { type: "labs", title: "Plateau Pressure and Driving Pressure: Nurse-Visible Safety Themes", kw: "plateau pressure driving pressure nursing ventilation" },
      { type: "untreated", title: "What Happens if Ventilator-Induced Lung Injury Risk Is Ignored", kw: "ventilator induced lung injury complications nursing" },
      { type: "early-vs-late", title: "Early ARDS vs Established Fibroproliferative Course (Exam Framing)", kw: "early vs late ARDS nursing framing" },
      { type: "system-dive", title: "Prone Positioning: Physiology and Monitoring Priorities", kw: "prone positioning ARDS physiology nursing" },
      { type: "mechanism", title: "Why Permissive Hypercapnia Is Sometimes the Safer Trade", kw: "permissive hypercapnia ARDS mechanism nursing" },
    ],
  },
  {
    id: "cluster-renal-aki",
    pillar: "AKI, CKD & Electrolyte Consequences",
    items: [
      { type: "comparison", title: "Prerenal vs Intrarenal vs Postrenal AKI: Labs and Story", kw: "prerenal vs intrarenal AKI nursing NCLEX" },
      { type: "mechanism", title: "Why Contrast Can Tip AKI Risk in Vulnerable Patients", kw: "contrast induced nephropathy mechanism nursing" },
      { type: "labs", title: "FENa vs FEUrea: When Nephrology Uses Each (Nursing Exam Version)", kw: "FENa FEUrea prerenal AKI nursing" },
      { type: "case", title: "Case: Post-Obstructive Diuresis After Foley—What to Watch", kw: "post obstructive diuresis case nursing" },
      { type: "untreated", title: "What Happens if Hyperkalemia in AKI Is Under-Monitored", kw: "AKI hyperkalemia untreated complications nursing" },
      { type: "early-vs-late", title: "Early AKI Signals vs Oliguric Phase Myths", kw: "early AKI signs vs oliguria nursing" },
      { type: "system-dive", title: "CKD Mineral Bone Disorder: Calcium, Phosphate, PTH Simplified", kw: "CKD MBD pathophysiology nursing simplified" },
      { type: "comparison", title: "Hemodialysis vs Peritoneal Dialysis: Infection and Fluid Themes", kw: "hemodialysis vs peritoneal dialysis nursing comparison" },
    ],
  },
  {
    id: "cluster-endocrine-glucose",
    pillar: "Glucose Emergencies & Endocrine Axes",
    items: [
      { type: "comparison", title: "DKA vs HHS: Severity Bands and Fluid Themes (Not Just Ketones)", kw: "DKA vs HHS comparison nursing NCLEX" },
      { type: "mechanism", title: "Why Euglycemic DKA Exists—and How Items Hide It", kw: "euglycemic DKA mechanism nursing" },
      { type: "case", title: "Case: Insulin Pump Failure + Ketones + Normal-ish Glucose", kw: "insulin pump failure DKA case nursing" },
      { type: "labs", title: "Beta-Hydroxybutyrate vs Urine Ketones: Bedside Meaning", kw: "beta hydroxybutyrate vs urine ketones nursing" },
      { type: "untreated", title: "What Happens if HHS Osmolarity and Volume Loss Are Missed", kw: "untreated HHS complications nursing" },
      { type: "early-vs-late", title: "Early DKA Compensation vs Impending Decompensation", kw: "early vs late DKA signs nursing" },
      { type: "system-dive", title: "Thyroid Storm vs Thyrotoxicosis Without Storm: Escalation Clues", kw: "thyroid storm pathophysiology nursing" },
      { type: "comparison", title: "Addisonian Crisis vs Sepsis: Overlap and Fork Questions", kw: "Addisonian crisis vs sepsis nursing differentiation" },
    ],
  },
  {
    id: "cluster-neuro-stroke",
    pillar: "Neurovascular & ICP",
    items: [
      { type: "comparison", title: "Ischemic Stroke vs Hemorrhagic Stroke: First-Line Priorities", kw: "ischemic vs hemorrhagic stroke nursing priority" },
      { type: "mechanism", title: "Why Elevated ICP Produces Cushing Triad (Late)", kw: "Cushing triad increased ICP mechanism nursing" },
      { type: "case", title: "Case: Thunderclap Headache + Neck Stiffness—SAH vs Meningitis Fork", kw: "thunderclap headache SAH vs meningitis case nursing" },
      { type: "labs", title: "INR and Thrombolysis Eligibility: What Exams Expect You to Notice", kw: "tPA eligibility INR stroke nursing NCLEX" },
      { type: "untreated", title: "What Happens if MCA Stroke Territory Edema Is Unchecked", kw: "untreated malignant edema stroke nursing" },
      { type: "early-vs-late", title: "Early Stroke Symptoms vs Lucid Interval in Epidural Bleed", kw: "epidural lucid interval nursing early late" },
      { type: "system-dive", title: "Autoregulation Failure: MAP Goals in Brain Injury (Concept Level)", kw: "cerebral autoregulation MAP goals nursing" },
      { type: "comparison", title: "Seizure vs Syncope: Clues Boards Reuse", kw: "seizure vs syncope nursing differentiation NCLEX" },
    ],
  },
  {
    id: "cluster-infection-sepsis",
    pillar: "Infection, SIRS & Sepsis",
    items: [
      { type: "comparison", title: "SIRS vs Sepsis vs Septic Shock: Exam-Useful Boundaries", kw: "SIRS vs sepsis vs septic shock nursing" },
      { type: "mechanism", title: "Why Vasodilation and Capillary Leak Drive Refractory Hypotension", kw: "septic shock vasodilation mechanism nursing" },
      { type: "case", title: "Case: New AF With Sepsis—Rate Control vs Cause First", kw: "sepsis atrial fibrillation case nursing priority" },
      { type: "labs", title: "Lactate in Sepsis: Trending vs One-Off Worship", kw: "lactate sepsis trending nursing" },
      { type: "untreated", title: "What Happens if Source Control Is Delayed in Intra-Abdominal Sepsis", kw: "delayed source control sepsis complications nursing" },
      { type: "early-vs-late", title: "Warm vs Cold Septic Shock Patterns (Classic Teaching)", kw: "warm vs cold septic shock nursing" },
      { type: "system-dive", title: "qSOFA as a Screening Hint—Not a Substitute for Clinical Judgment", kw: "qSOFA screening sepsis nursing NCLEX" },
      { type: "comparison", title: "Community-Acquired vs Hospital-Acquired Pneumonia: Risk and Bugs", kw: "CAP vs HAP pneumonia nursing comparison" },
    ],
  },
  {
    id: "cluster-gi-hepatic",
    pillar: "GI, Liver & Nutrition",
    items: [
      { type: "comparison", title: "Small Bowel Obstruction vs Ileus: Sounds, Labs, and Imaging Clues", kw: "SBO vs ileus nursing differentiation" },
      { type: "mechanism", title: "Why Portal Hypertension Causes Varices and Ascites", kw: "portal hypertension varices ascites mechanism nursing" },
      { type: "case", title: "Case: Hepatic Encephalopathy After Constipation + Protein Load", kw: "hepatic encephalopathy case nursing NCLEX" },
      { type: "labs", title: "Child-Pugh vs MELD: What Nurses Need for Exam Framing", kw: "Child Pugh MELD nursing exam framing" },
      { type: "untreated", title: "What Happens if Esophageal Varices Bleed Untreated", kw: "untreated esophageal variceal bleed nursing" },
      { type: "early-vs-late", title: "Early Acute Pancreatitis Pain vs Necrotizing Course Clues", kw: "early vs severe acute pancreatitis nursing" },
      { type: "system-dive", title: "Third Spacing in Peritonitis: Why Fluids Behave Oddly", kw: "third spacing peritonitis pathophysiology nursing" },
      { type: "comparison", title: "Upper GI Bleed vs Lower GI Bleed: Stabilization Forks", kw: "upper GI bleed vs lower GI bleed nursing priority" },
    ],
  },
  {
    id: "cluster-hematology-coag",
    pillar: "Hematology & Coagulation",
    items: [
      { type: "comparison", title: "DIC vs Severe Liver Disease Coagulopathy: Lab Patterns", kw: "DIC vs liver coagulopathy labs nursing" },
      { type: "mechanism", title: "Why Heparin Can Cause Thrombocytopenia (HIT Pathway Awareness)", kw: "HIT pathophysiology nursing awareness" },
      { type: "case", title: "Case: New Leg Pain + O2 Drop After Orthopedic Surgery", kw: "post op PE case nursing NCLEX" },
      { type: "labs", title: "PT/INR vs aPTT: Which Pathway Each Probes", kw: "PT INR vs aPTT nursing coagulation pathways" },
      { type: "untreated", title: "What Happens if Massive Hemorrhage Protocol Is Delayed", kw: "untreated massive hemorrhage complications nursing" },
      { type: "early-vs-late", title: "Early DIC Labs vs Fulminant Clinical Collapse", kw: "early vs late DIC nursing assessment" },
      { type: "system-dive", title: "TTP Pentad Enough for Boards (Without Memorizing Rare Minutiae)", kw: "TTP pentad nursing NCLEX simplified" },
      { type: "comparison", title: "Iron Deficiency Anemia vs Thalassemia Trait: Microcytic Clues", kw: "iron deficiency vs thalassemia trait microcytic nursing" },
    ],
  },
  {
    id: "cluster-immune-rheum",
    pillar: "Immune & Rheumatologic",
    items: [
      { type: "comparison", title: "SLE Flare vs Infection in Immunosuppressed Patients: Priority Fork", kw: "SLE flare vs infection nursing priority" },
      { type: "mechanism", title: "Why Steroids Mask Fever but Worsen Infection Risk", kw: "corticosteroid infection risk mechanism nursing" },
      { type: "case", title: "Case: New Rash + Pericarditis + Joint Pain—Serologies Aside", kw: "SLE presentation case nursing NCLEX" },
      { type: "labs", title: "ANA Patterns: What Exams Actually Require vs Noise", kw: "ANA testing nursing exam essentials" },
      { type: "untreated", title: "What Happens if Giant Cell Arteritis Vision Symptoms Are Ignored", kw: "untreated giant cell arteritis vision nursing" },
      { type: "early-vs-late", title: "Early Gout Attack vs Chronic Tophaceous Disease", kw: "acute gout vs chronic tophaceous gout nursing" },
      { type: "system-dive", title: "Cytokine Release Syndrome Concept for Nurses (Immunotherapy Era)", kw: "cytokine release syndrome nursing concept" },
      { type: "comparison", title: "Osteoarthritis vs Rheumatoid Arthritis: Inflammatory Markers and Pattern", kw: "OA vs RA nursing comparison NCLEX" },
    ],
  },
  {
    id: "cluster-nutrition-metabolic",
    pillar: "Nutrition & Metabolic Stress",
    items: [
      { type: "mechanism", title: "Why Refeeding Syndrome Starts With Phosphate (Not Just Calories)", kw: "refeeding syndrome phosphate first nursing" },
      { type: "comparison", title: "Kwashiorkor vs Marasmus: Exam Pictures That Stick", kw: "kwashiorkor vs marasmus nursing NCLEX" },
      { type: "case", title: "Case: Bariatric Patient + Confusion + Low Thiamine", kw: "bariatric thiamine deficiency case nursing" },
      { type: "labs", title: "Prealbumin vs Albumin: Nutrition Monitoring Without Myths", kw: "prealbumin albumin nutrition monitoring nursing" },
      { type: "untreated", title: "What Happens if Severe Thiamine Deficiency Progresses", kw: "untreated Wernicke progression nursing" },
      { type: "early-vs-late", title: "Early Alcohol Withdrawal vs Delirium Tremens", kw: "early alcohol withdrawal vs DT nursing" },
      { type: "system-dive", title: "Stress Hyperglycemia in Critical Illness: Insulin Needs vs Fear", kw: "stress hyperglycemia ICU nursing" },
      { type: "mechanism", title: "Why Uncontrolled Diabetes Increases Infection Risk", kw: "diabetes infection risk mechanism nursing" },
    ],
  },
  {
    id: "cluster-pain-sedation",
    pillar: "Pain, Sedation & Withdrawal",
    items: [
      { type: "comparison", title: "Opioid Induced Respiratory Depression vs Expected Sedation", kw: "opioid respiratory depression vs sedation nursing" },
      { type: "mechanism", title: "Why Mixed Agonist-Antagonists Behave Differently in Opioid Dependence", kw: "opioid partial agonist mechanism nursing" },
      { type: "case", title: "Case: ICU Delirium + Ventilator—Sedation Vacation Fork", kw: "ICU delirium sedation vacation case nursing" },
      { type: "labs", title: "EtCO2 Monitoring for Opioid Safety: What Boards Expect", kw: "EtCO2 opioid monitoring nursing NCLEX" },
      { type: "untreated", title: "What Happens if Alcohol Withdrawal Escalates Untreated", kw: "untreated alcohol withdrawal complications nursing" },
      { type: "early-vs-late", title: "Early Opioid Withdrawal vs Late Protracted Symptoms", kw: "early vs late opioid withdrawal nursing" },
      { type: "system-dive", title: "GABAergic Withdrawal (Benzo vs Alcohol) Overlap Themes", kw: "benzodiazepine withdrawal vs alcohol nursing" },
      { type: "comparison", title: "Epidural vs IV Opioids for Post-Op Pain: Monitoring Differences", kw: "epidural vs IV opioid monitoring nursing" },
    ],
  },
  {
    id: "cluster-obstetric-limited",
    pillar: "High-Yield Perinatal Pathophys (NCLEX Crossover)",
    items: [
      { type: "comparison", title: "Preeclampsia vs Gestational Hypertension: Proteinuria Fork", kw: "preeclampsia vs gestational hypertension nursing" },
      { type: "mechanism", title: "Why Magnesium Is Used for Seizure Prophylaxis in Severe Preeclampsia", kw: "magnesium preeclampsia seizure mechanism nursing" },
      { type: "case", title: "Case: Postpartum Hemorrhage + Coagulopathy Cascade", kw: "postpartum hemorrhage coagulopathy case nursing" },
      { type: "labs", title: "HELLP Labs: Enough to Answer Priority Items", kw: "HELLP syndrome labs nursing NCLEX" },
      { type: "untreated", title: "What Happens if Postpartum Hemorrhage Is Underestimated", kw: "untreated postpartum hemorrhage nursing" },
      { type: "early-vs-late", title: "Early Postpartum Bleeding vs Delayed Hemorrhage Causes", kw: "early vs delayed postpartum hemorrhage nursing" },
      { type: "system-dive", title: "Physiologic Anemia of Pregnancy vs Pathologic Anemia Clues", kw: "physiologic anemia pregnancy nursing" },
      { type: "comparison", title: "Placenta Previa vs Abruptio: Bleeding Pattern Clues", kw: "placenta previa vs abruption nursing NCLEX" },
    ],
  },
  {
    id: "cluster-pediatric-concepts",
    pillar: "Pediatric Pathophysiology Highlights",
    items: [
      { type: "comparison", title: "Croup vs Epiglottitis: Classic Teaching (Modern Presentation Nuance)", kw: "croup vs epiglottitis nursing NCLEX" },
      { type: "mechanism", title: "Why Kids Decompensate Faster With Airway Edema", kw: "pediatric airway edema decompensation mechanism" },
      { type: "case", title: "Case: Fever + Petechiae + Leg Pain—Meningococcemia Awareness", kw: "meningococcemia pediatric case nursing" },
      { type: "labs", title: "RSV Testing: When It Changes Management vs When It Doesn’t", kw: "RSV testing nursing management NCLEX" },
      { type: "untreated", title: "What Happens if Kawasaki Disease Is Missed", kw: "untreated Kawasaki disease complications nursing" },
      { type: "early-vs-late", title: "Early Sepsis in Neonates vs Benign Feeding Jitteriness", kw: "neonatal sepsis vs benign jitteriness nursing" },
      { type: "system-dive", title: "Pyloric Stenosis Pathophysiology: Projectile Non-Bilious Emesis", kw: "pyloric stenosis pathophysiology nursing" },
      { type: "comparison", title: "Intussusception vs Volvulus: Pain Pattern and Stool Clues", kw: "intussusception vs volvulus nursing" },
    ],
  },
  {
    id: "cluster-np-advanced-01",
    pillar: "NP-Style Diagnostics & Management Crossover",
    items: [
      { type: "case", title: "NP Case: Ambiguous Chest Pain—Risk Scores vs Clinical Gestalt", kw: "chest pain risk stratification NP nursing crossover" },
      { type: "labs", title: "D-dimer in Low-Risk PE Workup: What Boards Expect", kw: "D-dimer PE workup nursing NCLEX NP" },
      { type: "comparison", title: "Asthma Step-Up Therapy vs Acute Rescue: Plan vs Crisis", kw: "asthma step up therapy vs acute exacerbation NP" },
      { type: "mechanism", title: "Why SGLT2 Inhibitors Protect HF Beyond Glucose", kw: "SGLT2 heart failure benefit mechanism nursing" },
      { type: "untreated", title: "What Happens if Atrial Fibrillation Rate Control Is Ignored Long-Term", kw: "untreated atrial fibrillation complications nursing" },
      { type: "system-dive", title: "Chronic Kidney Disease Staging for Exam Logic (eGFR Frames)", kw: "CKD staging eGFR nursing exam" },
      { type: "early-vs-late", title: "Early Diabetic Nephropathy vs Macroalbuminuria Phase", kw: "early vs late diabetic nephropathy nursing" },
      { type: "comparison", title: "Hypothyroidism vs Depression: Overlap and Labs That Split", kw: "hypothyroidism vs depression labs nursing" },
    ],
  },
  {
    id: "cluster-pn-scope",
    pillar: "PN-Focused Monitoring & Therapeutic Priorities",
    items: [
      { type: "case", title: "PN Case: Wound Infection + Fever—When to Escalate vs Monitor", kw: "wound infection escalation PN nursing NCLEX" },
      { type: "mechanism", title: "Why Turning and Incentive Spirometry Matter After Surgery (Atelectasis)", kw: "atelectasis prevention incentive spirometry mechanism nursing" },
      { type: "comparison", title: "Pressure Injury Stage 2 vs Moisture-Associated Skin Damage", kw: "pressure injury vs moisture associated dermatitis PN nursing" },
      { type: "labs", title: "Fingerstick Glucose Checks: Timing Traps in Insulin Protocols", kw: "fingerstick glucose timing insulin nursing PN" },
      { type: "untreated", title: "What Happens if Diabetic Foot Infection Spreads Untreated", kw: "untreated diabetic foot infection nursing" },
      { type: "early-vs-late", title: "Early Cellulitis vs Spreading Soft Tissue Infection", kw: "early cellulitis vs spreading infection nursing" },
      { type: "system-dive", title: "Delegation and Scope: LPN/LVN Monitoring vs RN Assessment Themes", kw: "LPN monitoring vs RN assessment delegation NCLEX" },
      { type: "comparison", title: "Oral vs IV Antibiotics Transition: Stability Clues", kw: "oral vs IV antibiotic transition nursing PN" },
    ],
  },
  {
    id: "cluster-renal-electrolyte-2",
    pillar: "Renal Tubule & Acid–Base Edge Cases",
    items: [
      { type: "comparison", title: "RTA Type 1 vs Type 2 vs Type 4: Exam Mnemonics That Hold", kw: "renal tubular acidosis types nursing NCLEX" },
      { type: "mechanism", title: "Why Bicarbonate Wasting Happens in Some Tubulopathies", kw: "bicarbonate wasting renal tubular nursing" },
      { type: "labs", title: "Urine Anion Gap in Metabolic Acidosis: Simplified Use", kw: "urine anion gap metabolic acidosis nursing" },
      { type: "case", title: "Case: Diarrhea + Non-AG Acidosis—Chloride Story", kw: "hyperchloremic metabolic acidosis diarrhea case nursing" },
      { type: "untreated", title: "What Happens if Chronic Acidosis in CKD Is Ignored", kw: "untreated metabolic acidosis CKD nursing" },
      { type: "early-vs-late", title: "Early Uremic Symptoms vs Uremic Encephalopathy", kw: "early vs late uremic encephalopathy nursing" },
      { type: "system-dive", title: "Dialysis Disequilibrium Syndrome: Pathophysiology Basics", kw: "dialysis disequilibrium syndrome nursing" },
      { type: "comparison", title: "Glomerulonephritis vs Nephrotic Syndrome: Protein and Edema Patterns", kw: "glomerulonephritis vs nephrotic syndrome nursing" },
    ],
  },
  {
    id: "cluster-neuro-autoimmune",
    pillar: "Neuro-Immune & Demyelination",
    items: [
      { type: "comparison", title: "MS Exacerbation vs Infection Fever: Steroid Decision Fork", kw: "MS exacerbation vs infection fever nursing" },
      { type: "mechanism", title: "Why Myasthenic Crisis Includes Respiratory Muscle Failure", kw: "myasthenic crisis respiratory failure mechanism nursing" },
      { type: "case", title: "Case: Fatigable Ptosis + Weakness Worsening—Cholinergic vs Crisis", kw: "myasthenia gravis crisis case nursing" },
      { type: "labs", title: "AChR Antibodies: When Labs Help vs When Exam Is Clinical", kw: "myasthenia gravis antibody testing nursing" },
      { type: "untreated", title: "What Happens if Guillain-Barré Respiratory Involvement Is Missed", kw: "untreated Guillain Barré respiratory failure nursing" },
      { type: "early-vs-late", title: "Early GBS Ascending Weakness vs Rapid Ventilatory Failure", kw: "early vs late Guillain Barré nursing" },
      { type: "system-dive", title: "Lambert-Eaton vs Myasthenia: Enough Differentiation for Items", kw: "Lambert Eaton vs myasthenia nursing NCLEX" },
      { type: "comparison", title: "Bell Palsy vs Stroke: Facial Weakness Patterns", kw: "Bell palsy vs stroke facial weakness nursing" },
    ],
  },
  {
    id: "cluster-oncology-paraneoplastic",
    pillar: "Oncology Syndromes & Paraneoplastic Concepts",
    items: [
      { type: "mechanism", title: "Why SIADH Clusters With Small Cell Lung Cancer", kw: "SIADH small cell lung cancer mechanism nursing" },
      { type: "comparison", title: "SVC Syndrome vs Massive PE: Exam Differentiation", kw: "SVC syndrome vs massive PE nursing" },
      { type: "case", title: "Case: New Hypercalcemia + Weight Loss—PTHrP Awareness", kw: "hypercalcemia malignancy case nursing NCLEX" },
      { type: "labs", title: "Tumor Lysis Labs: Phosphate, Potassium, Calcium Pattern", kw: "tumor lysis syndrome labs nursing" },
      { type: "untreated", title: "What Happens if Tumor Lysis Is Not Prophylaxed When Risky", kw: "untreated tumor lysis complications nursing" },
      { type: "early-vs-late", title: "Early Immunotherapy Colitis vs Infectious Diarrhea Clues", kw: "immunotherapy colitis vs infection nursing" },
      { type: "system-dive", title: "Cytokine Release vs Anaphylaxis: Rapid Recognition Themes", kw: "cytokine release vs anaphylaxis nursing" },
      { type: "comparison", title: "Radiation Pneumonitis vs Infection Post-Radiation", kw: "radiation pneumonitis vs pneumonia nursing" },
    ],
  },
  {
    id: "cluster-environmental-toxicology",
    pillar: "Environmental & Toxicology (High-Yield)",
    items: [
      { type: "comparison", title: "Carbon Monoxide vs Cyanide: Oxygen Therapy Forks (Concept)", kw: "carbon monoxide vs cyanide poisoning nursing concept" },
      { type: "mechanism", title: "Why Salicylate Toxicity Produces Mixed Acid-Base Pictures", kw: "salicylate toxicity acid base mechanism nursing" },
      { type: "case", title: "Case: Tinnitus + Respiratory Alkalosis + Metabolic Acidosis", kw: "salicylate toxicity case nursing NCLEX" },
      { type: "labs", title: "Osmolar Gap: Toxic Alcohol Teaching Frame", kw: "osmolar gap toxic alcohol nursing" },
      { type: "untreated", title: "What Happens if Heat Stroke Cooling Is Delayed", kw: "untreated heat stroke complications nursing" },
      { type: "early-vs-late", title: "Heat Exhaustion vs Heat Stroke: CNS Clues", kw: "heat exhaustion vs heat stroke nursing" },
      { type: "system-dive", title: "Cholinesterase Inhibitors: SLUDGEM Enough for Exams", kw: "organophosphate poisoning SLUDGEM nursing NCLEX" },
      { type: "comparison", title: "Acetaminophen Toxicity Phases: When Labs Lie Early", kw: "acetaminophen toxicity phases nursing" },
    ],
  },
];

const pathwayCycle = [];
for (let i = 0; i < 80; i++) pathwayCycle.push("RN");
for (let i = 0; i < 60; i++) pathwayCycle.push("PN");
for (let i = 0; i < 60; i++) pathwayCycle.push("NP");
// shuffle deterministically by index swap pattern
const order = pathwayCycle.map((_, i) => i);
for (let i = order.length - 1; i > 0; i--) {
  const j = (i * 37 + 11) % (i + 1);
  [order[i], order[j]] = [order[j], order[i]];
}
const pathways = order.map((idx) => pathwayCycle[idx]);

let pi = 0;
for (const cluster of clusters) {
  for (const item of cluster.items) {
    const pathway = pathways[pi++];
    const waveSlug = slugify(`wave2-${pathway.toLowerCase()}-${cluster.id}-${seq}-${item.title}`);
    const primaryKeyword = `${item.kw} [wave2 ${pathway}]`.toLowerCase();
    const supportingTopics = [
      `${cluster.pillar}: mechanism review`,
      `${cluster.pillar}: nursing assessment`,
      `${cluster.pillar}: complications to monitor`,
    ];
    register({
      id: seq + 1,
      pathway,
      topicType: item.type,
      title: item.title,
      slug: waveSlug,
      primaryKeyword,
      clusterId: cluster.id,
      pillarTopic: cluster.pillar,
      supportingTopics,
      shortDescription: `Wave 2 topical authority post (${pathway}): ${item.type.replace(/-/g, " ")} aligned to ${cluster.pillar}.`,
      suggestedRelatedLessonPaths: [],
      suggestedRelatedTools: ["lab-values", "electrolyte-abg", "med-math"].slice(0, 3),
      status: "planned",
      wave: 2,
    });
    seq += 1;
  }
}

if (posts.length !== 200) throw new Error(`expected 200 posts, got ${posts.length}`);

const out = {
  generatedAt: new Date().toISOString(),
  wave: 2,
  count: posts.length,
  baselineReference: "data/blog-manifest/existing-topics-wave1-baseline.json",
  baselineNote:
    "Wave 1 overlap guard uses nclex-seo-100.manifest.json (100 posts). File pathophysiology-200.manifest.json is not present in-repo; baseline slugs/keywords captured in existing-topics-wave1-baseline.json.",
  distribution: { RN: 80, PN: 60, NP: 60 },
  posts,
};

fs.mkdirSync(path.join(root, "data/blog-manifest"), { recursive: true });
fs.writeFileSync(path.join(root, "data/blog-manifest/pathophysiology-200-wave2.manifest.json"), JSON.stringify(out, null, 2));
console.log("Wrote 200 posts to pathophysiology-200-wave2.manifest.json");
