/**
 * Generates nclex-seo-100.manifest.json + .csv from the approved 100-topic SEO list.
 * Run from nursenest-core: node scripts/blog/generate-nclex-seo-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../../data/blog-manifest");

const RN_LESSON = (slug) => [`/us/rn/nclex-rn/lessons/${slug}`];
const RN_MULTI = (...slugs) => slugs.map((s) => `/us/rn/nclex-rn/lessons/${s}`);

/** Pattern-based lesson links (real slugs from pathway inventory where possible). */
function lessonPathsForCategory(cat) {
  const map = {
    Cardiac: RN_MULTI("heart-failure-nclex-rn", "cardiac-tamponade-nclex-rn", "milrinone-nclex-rn"),
    Endocrine: RN_MULTI("metformin-nclex-rn", "newborn-hypoglycemia-nclex-rn"),
    "Med-Surg": RN_MULTI("sepsis-nclex-rn", "pulmonary-embolism-nclex-rn", "ards-nclex-rn"),
    Respiratory: RN_MULTI("positive-pressure-ventilation-nclex-rn", "chest-tubes-nclex-rn"),
    Pharmacology: RN_MULTI("digoxin-nclex-rn", "heparin-and-aptt-monitoring-nclex-rn", "ace-inhibitors-nclex-rn"),
    Neuro: RN_MULTI("abnormal-neurological-assessment-findings-nclex-rn", "memantine-nclex-rn"),
    Pediatrics: RN_MULTI("bronchiolitis-and-rsv-nclex-rn", "febrile-seizures-nclex-rn", "newborn-hypoglycemia-nclex-rn"),
    "OB/Maternity": RN_LESSON("oxytocin-nclex-rn"),
    "Mental Health": RN_MULTI("neuroleptic-malignant-syndrome-nclex-rn", "ziprasidone-and-qt-prolongation-nclex-rn"),
    "Nursing Skills": RN_MULTI("chest-tubes-nclex-rn"),
    "NCLEX Strategy": RN_MULTI("sepsis-nclex-rn"),
    "Lab Values": RN_MULTI("iron-deficiency-anemia-nclex-rn"),
    "Dosage Calculations": RN_LESSON("heparin-and-aptt-monitoring-nclex-rn"),
  };
  return map[cat] || RN_LESSON("sepsis-nclex-rn");
}

function toolsFor(cat, intent) {
  const t = new Set();
  if (["Dosage Calculations", "Pharmacology", "Endocrine"].includes(cat) || intent.includes("calculation")) {
    t.add("med-math");
    t.add("iv-infusion");
  }
  if (["Lab Values", "Endocrine", "Med-Surg"].includes(cat)) t.add("lab-values");
  if (["Respiratory", "Med-Surg", "Cardiac"].includes(cat)) t.add("electrolyte-abg");
  if (t.size === 0) t.add("lab-values");
  return [...t];
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 72);
}

const TOPICS = [
  // WHY 1-20
  { title: "Why Does Heart Failure Cause Pulmonary Edema? (Pathophysiology for NCLEX)", primaryKeyword: "why does heart failure cause pulmonary edema NCLEX", category: "Cardiac", intentType: "explanation-pathophysiology", shortDescription: "Links pump failure to pulmonary congestion so exam items on crackles, orthopnea, and priority make sense." },
  { title: "Why Does K+ Rise in DKA Before Insulin? (NCLEX Trap Explained)", primaryKeyword: "why potassium increases in DKA nursing", category: "Endocrine", intentType: "explanation-pathophysiology", shortDescription: "Explains intracellular shift and dehydration themes behind insulin and potassium safety items." },
  { title: "Why Does SIADH Cause Hyponatremia but “Wet” on Exam Questions?", primaryKeyword: "why SIADH causes hyponatremia NCLEX", category: "Endocrine", intentType: "explanation-pathophysiology", shortDescription: "Connects ADH, water retention, and sodium dilution to fluid priority answers." },
  { title: "Why Does Left-Sided HF Show Crackles Before Peripheral Edema?", primaryKeyword: "left sided heart failure pulmonary edema why", category: "Cardiac", intentType: "explanation-pathophysiology", shortDescription: "Separates pulmonary congestion patterns from systemic congestion for L vs R failure stems." },
  { title: "Why Does Hypoalbuminemia Cause Edema? (Fluid Shifts NCLEX)", primaryKeyword: "why low albumin causes edema nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Oncotic pressure logic for edema and third-spacing questions." },
  { title: "Why Does Fever Tachycardia Happen in Sepsis (Not “Just Anxiety”)?", primaryKeyword: "why tachycardia in sepsis nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Inflammation and perfusion framing for early recognition items." },
  { title: "Why Does Hyperventilation Lower CO2 on the ABG (Quick NCLEX Logic)?", primaryKeyword: "why hyperventilation decreases CO2 ABG", category: "Respiratory", intentType: "explanation-pathophysiology", shortDescription: "Minute ventilation and acid-base ties for ABG interpretation drills." },
  { title: "Why Does COPD Sometimes Show High CO2 While “Satting OK”?", primaryKeyword: "why COPD retain CO2 oxygen saturation", category: "Respiratory", intentType: "explanation-pathophysiology", shortDescription: "Ventilation and oxygenation mismatch for respiratory exam traps." },
  { title: "Why Does Digoxin Toxicity Cause Vision Changes and Bradycardia?", primaryKeyword: "why digoxin toxicity symptoms nursing", category: "Pharmacology", intentType: "explanation-pathophysiology", shortDescription: "Mechanism-linked assessment for polypharmacy and hold-parameter stems." },
  { title: "Why Does Mannitol Lower ICP but Risk Fluid/Electrolyte Chaos?", primaryKeyword: "why mannitol for increased intracranial pressure nursing", category: "Neuro", intentType: "explanation-pathophysiology", shortDescription: "Osmotic diuresis and monitoring priorities for neuro scenarios." },
  { title: "Why Does TPN Increase Infection Risk (Besides the Line)?", primaryKeyword: "why TPN infection risk nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Line care, glucose, and immune context for infection control items." },
  { title: "Why Does Acute Kidney Injury Raise Potassium Fast?", primaryKeyword: "why AKI causes hyperkalemia nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Renal excretion failure and emergent rhythm implications." },
  { title: "Why Does Liver Failure Cause Bleeding and Low Platelets?", primaryKeyword: "why liver failure bleeding nursing coagulation", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Clotting and portal themes for bleed-risk teaching questions." },
  { title: "Why Does Pregnancy Lower Blood Pressure Early but Raise Risk Later?", primaryKeyword: "why blood pressure changes pregnancy nursing", category: "OB/Maternity", intentType: "explanation-pathophysiology", shortDescription: "Physiology vs preeclampsia cues on timelines." },
  { title: "Why Does Insulin Drop K+ Even When You’re Treating Hyperglycemia?", primaryKeyword: "why insulin lowers potassium nursing", category: "Endocrine", intentType: "explanation-pathophysiology", shortDescription: "Shift mechanism for DKA and infusion safety." },
  { title: "Why Does Sympathetic Surge Raise Blood Sugar in Stress and Shock?", primaryKeyword: "why stress increases blood glucose nursing", category: "Endocrine", intentType: "explanation-pathophysiology", shortDescription: "Stress hyperglycemia in acute illness stems." },
  { title: "Why Does Bed Rest Increase DVT Risk (Even With “Stable” Vitals)?", primaryKeyword: "why immobility causes DVT nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Stasis and Virchow framing for prevention items." },
  { title: "Why Does Dialysis Cause Cramping and Hypotension Mid-Treatment?", primaryKeyword: "why muscle cramps during dialysis nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Fluid shift and electrolyte themes for HD scenarios." },
  { title: "Why Does SSRI Withdrawal Feel Like “Brain Zaps” (Patient Teaching)?", primaryKeyword: "SSRI discontinuation syndrome nursing explained", category: "Mental Health", intentType: "explanation-pathophysiology", shortDescription: "Safe taper and symptom reporting for psych med teaching." },
  { title: "Why Does Fever Spike After Blood Transfusion (Not Always “Allergic”)?", primaryKeyword: "febrile nonhemolytic transfusion reaction why nursing", category: "Med-Surg", intentType: "explanation-pathophysiology", shortDescription: "Reaction-type differentiation for stop, notify, monitor paths." },
  // PRACTICE 21-40
  { title: "NCLEX Practice Questions: Acute Kidney Injury (With Rationales)", primaryKeyword: "NCLEX practice questions acute kidney injury with answers", category: "Med-Surg", intentType: "practice-exam-prep", shortDescription: "Scenario AKI items with rationales focused on labs and priority." },
  { title: "NCLEX Questions About Pulmonary Embolism (Practice + Answers)", primaryKeyword: "NCLEX questions about pulmonary embolism practice", category: "Respiratory", intentType: "practice-exam-prep", shortDescription: "O2, anticoagulation safety, instability patterns with explained answers." },
  { title: "NCLEX Practice Questions: Heart Failure Exacerbation (With Rationales)", primaryKeyword: "NCLEX heart failure exacerbation practice questions", category: "Cardiac", intentType: "practice-exam-prep", shortDescription: "Diuretics, weights, and escalation teaching in item form." },
  { title: "NCLEX Questions on Digoxin Toxicity (Practice Items + Answers)", primaryKeyword: "NCLEX digoxin toxicity practice questions", category: "Pharmacology", intentType: "practice-exam-prep", shortDescription: "Classic assessment traps with hold and lab rationales." },
  { title: "NCLEX Practice Questions: DKA vs HHS Clues (With Answers)", primaryKeyword: "NCLEX DKA vs HHS practice questions", category: "Endocrine", intentType: "practice-exam-prep", shortDescription: "Side-by-side recognition drills before memorizing cutoffs." },
  { title: "NCLEX Questions About SIADH vs Diabetes Insipidus (Practice + Rationales)", primaryKeyword: "NCLEX SIADH vs diabetes insipidus questions", category: "Endocrine", intentType: "practice-exam-prep", shortDescription: "Sodium and urine concentration patterns with wrong-answer review." },
  { title: "NCLEX Practice Questions: Sepsis Recognition (With Answers)", primaryKeyword: "NCLEX sepsis practice questions with rationales", category: "Med-Surg", intentType: "practice-exam-prep", shortDescription: "Escalation vs distractor tasks for recognition stems." },
  { title: "NCLEX Questions About Pressure Injuries Staging (Practice + Answers)", primaryKeyword: "NCLEX pressure injury staging practice questions", category: "Nursing Skills", intentType: "practice-exam-prep", shortDescription: "Staging scenarios with documentation and prevention." },
  { title: "NCLEX Practice Questions: Post-Op Fever Causes (With Rationales)", primaryKeyword: "NCLEX postoperative fever practice questions", category: "Med-Surg", intentType: "practice-exam-prep", shortDescription: "Timing-based differential for prioritization drills." },
  { title: "NCLEX Questions on Anticoagulation Teaching (Warfarin vs DOAC Themes)", primaryKeyword: "NCLEX anticoagulation teaching questions", category: "Pharmacology", intentType: "practice-exam-prep", shortDescription: "Bleeding precautions and follow-up teaching in MCQ form." },
  { title: "NCLEX Practice Questions: Pediatric Dehydration (With Answers)", primaryKeyword: "NCLEX pediatric dehydration practice questions", category: "Pediatrics", intentType: "practice-exam-prep", shortDescription: "Clinical dehydration cues and therapy priorities for PN/RN." },
  { title: "NCLEX Questions About Preeclampsia vs Gestational Hypertension", primaryKeyword: "NCLEX preeclampsia practice questions", category: "OB/Maternity", intentType: "practice-exam-prep", shortDescription: "Proteinuria and BP thresholds in scenario form." },
  { title: "NCLEX Practice Questions: Suicide Risk Assessment (With Rationales)", primaryKeyword: "NCLEX suicide risk assessment practice questions", category: "Mental Health", intentType: "practice-exam-prep", shortDescription: "Safety planning and scope-appropriate nursing actions." },
  { title: "NCLEX Questions on Restraint Use and Alternatives (Practice + Answers)", primaryKeyword: "NCLEX restraint use nursing questions", category: "Mental Health", intentType: "practice-exam-prep", shortDescription: "Legal and ethical guardrails with frequent distractors explained." },
  { title: "NCLEX Practice Questions: IV Infiltration vs Phlebitis", primaryKeyword: "NCLEX IV complications practice questions", category: "Nursing Skills", intentType: "practice-exam-prep", shortDescription: "Site assessment and escalation versus watch-and-wait." },
  { title: "NCLEX Questions About Chest Tube Air Leaks (With Rationales)", primaryKeyword: "NCLEX chest tube nursing questions", category: "Respiratory", intentType: "practice-exam-prep", shortDescription: "Bubbling, suction, and escalation in acute care stems." },
  { title: "NCLEX Practice Questions: Wound Infection Signs (With Answers)", primaryKeyword: "NCLEX wound infection practice questions", category: "Nursing Skills", intentType: "practice-exam-prep", shortDescription: "Erythema, drainage, fever combos with culture priorities." },
  { title: "NCLEX Questions About Insulin Mixing and Timing (Practice + Rationales)", primaryKeyword: "NCLEX insulin administration practice questions", category: "Pharmacology", intentType: "practice-exam-prep", shortDescription: "Draw order and meal timing traps in items." },
  { title: "NCLEX Practice Questions: Stroke NIHSS/Neuro Checks (Simplified for RN)", primaryKeyword: "NCLEX stroke assessment practice questions", category: "Neuro", intentType: "practice-exam-prep", shortDescription: "Sudden deficits and escalation without over-testing detail." },
  { title: "NCLEX Practice Questions: Catheter-Associated UTI Prevention", primaryKeyword: "NCLEX CAUTI prevention practice questions", category: "Med-Surg", intentType: "practice-exam-prep", shortDescription: "Indication, maintenance, removal timing with infection control rationales." },
  // COMPARISON 41-60
  { title: "Gastric vs Duodenal Ulcer Pain: What’s the Difference for NCLEX?", primaryKeyword: "gastric vs duodenal ulcer nursing difference NCLEX", category: "Med-Surg", intentType: "comparison", shortDescription: "Timing and food-relief patterns for “which statement fits” items." },
  { title: "COPD vs Asthma on the NCLEX: Overlap, Clues, and Wrong Answers", primaryKeyword: "COPD vs asthma NCLEX comparison", category: "Respiratory", intentType: "comparison", shortDescription: "Reversible versus chronic framing with exacerbation priorities." },
  { title: "Hypovolemic vs Cardiogenic Shock: How to Tell Fast on an Exam Stem", primaryKeyword: "hypovolemic vs cardiogenic shock nursing difference", category: "Cardiac", intentType: "comparison", shortDescription: "Preload and clinical picture cues for fluid versus inotrope thinking." },
  { title: "Arterial vs Venous Ulcers: Bedside Clues NCLEX Loves", primaryKeyword: "arterial vs venous ulcer nursing comparison", category: "Med-Surg", intentType: "comparison", shortDescription: "Location, pulses, pain patterns without relying on photos." },
  { title: "Crohn’s Disease vs UC: NCLEX Comparison (Complications + Teaching)", primaryKeyword: "Crohn's vs ulcerative colitis NCLEX nursing", category: "Med-Surg", intentType: "comparison", shortDescription: "Distribution, stool patterns, and surgery risk themes." },
  { title: "Rheumatic Fever vs Kawasaki in Kids: Comparison for PN/RN Exams", primaryKeyword: "Kawasaki vs rheumatic fever nursing comparison", category: "Pediatrics", intentType: "comparison", shortDescription: "Fever duration, criteria mnemonics, and priority actions." },
  { title: "Placenta Previa vs Abruptio Placentae: OB Emergency Differentiation", primaryKeyword: "placenta previa vs abruptio placentae NCLEX", category: "OB/Maternity", intentType: "comparison", shortDescription: "Bleeding pain patterns and immediate nursing priorities." },
  { title: "Epidural vs Spinal Anesthesia: What NCLEX Expects You to Monitor", primaryKeyword: "epidural vs spinal nursing monitoring NCLEX", category: "OB/Maternity", intentType: "comparison", shortDescription: "BP, motor block, and headache themes for procedure-adjacent safety." },
  { title: "Schizophrenia vs Schizoaffective: High-Yield Exam Differences (Nursing Focus)", primaryKeyword: "schizophrenia vs schizoaffective nursing difference", category: "Mental Health", intentType: "comparison", shortDescription: "Mood episode criteria affecting communication and safety planning." },
  { title: "Delirium vs Dementia: Quick Comparison for Clinical Judgment Questions", primaryKeyword: "delirium vs dementia nursing comparison NCLEX", category: "Neuro", intentType: "comparison", shortDescription: "Onset, attention, reversibility for priority splits." },
  { title: "MI vs Pericarditis Pain: ECG/Story Clues Students Miss", primaryKeyword: "MI vs pericarditis nursing comparison", category: "Cardiac", intentType: "comparison", shortDescription: "Positional pain and friction rub hints with safe escalation." },
  { title: "Osteoarthritis vs Rheumatoid Arthritis: NCLEX Comparison (Symptoms + Teaching)", primaryKeyword: "OA vs RA nursing comparison NCLEX", category: "Med-Surg", intentType: "comparison", shortDescription: "Morning stiffness length, joint pattern, systemic signs." },
  { title: "Left vs Right Heart Failure: Comparison Table + NCLEX Traps", primaryKeyword: "left vs right heart failure nursing comparison", category: "Cardiac", intentType: "comparison", shortDescription: "Congestion mapping you can reuse on mixed stems." },
  { title: "Ulcerative Colitis Flare vs Infectious Diarrhea: Nursing Differentiation", primaryKeyword: "UC flare vs infectious diarrhea nursing", category: "Med-Surg", intentType: "comparison", shortDescription: "Isolation versus chronic disease management split." },
  { title: "Contact vs Airborne Precautions: NCLEX Scenario Comparison", primaryKeyword: "contact vs airborne precautions nursing NCLEX", category: "Nursing Skills", intentType: "comparison", shortDescription: "PPE and room rules with common mix-ups." },
  { title: "Warfarin vs Heparin: Monitoring and Reversal Themes for Exams", primaryKeyword: "warfarin vs heparin nursing monitoring NCLEX", category: "Pharmacology", intentType: "comparison", shortDescription: "Labs, onset, bridging concepts without pharmacy rabbit holes." },
  { title: "Levothyroxine Timing vs “Anytime Meds”: What Exams Test", primaryKeyword: "levothyroxine administration nursing NCLEX tips", category: "Pharmacology", intentType: "comparison", shortDescription: "Absorption interactions and teaching beats flashcards alone." },
  { title: "Central vs Peripheral Cyanosis: What Each Implies on a Stem", primaryKeyword: "central vs peripheral cyanosis nursing difference", category: "Respiratory", intentType: "comparison", shortDescription: "Oxygenation versus perfusion framing for answers." },
  { title: "Type 1 vs Type 2 Diabetes Priorities in Acute vs Chronic Stems", primaryKeyword: "type 1 vs type 2 diabetes nursing priorities NCLEX", category: "Endocrine", intentType: "comparison", shortDescription: "DKA frequency versus hyperosmolar patterns and home care contrast." },
  { title: "Assault vs Battery in Nursing Documentation/Ethics Questions (Simplified)", primaryKeyword: "assault vs battery nursing ethics NCLEX", category: "NCLEX Strategy", intentType: "comparison", shortDescription: "Legal vocabulary as tested in leadership and ethics items." },
  // CALC 61-80
  { title: "IV Drip Rate Calculation Nursing: Step-by-Step (gtt/min) With NCLEX Logic", primaryKeyword: "IV drip rate calculation nursing step by step", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Drop factor, unit cancellation, and sanity checks exam writers expect." },
  { title: "mL/hr from “Infuse Over X Hours”: Step-by-Step Pump Math", primaryKeyword: "mL per hour infusion calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Time conversion traps between minutes and hours." },
  { title: "Weight-Based Drug Math (mg/kg): Nursing Steps That Stop Silly Errors", primaryKeyword: "mg kg dosage calculation nursing step by step", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Rounding and double-check patterns for high-stakes meds." },
  { title: "Heparin Units to mL: Step-by-Step From a Vial Label", primaryKeyword: "heparin dosage calculation nursing mL", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Concentration reads and protocol safety checks." },
  { title: "Insulin Units Only: Drawing Up and Double-Checking (Exam-Style Walkthrough)", primaryKeyword: "insulin unit calculation nursing U-100", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Syringe selection and U-100 guardrails." },
  { title: "Tablet Splitting and Dose Conversion (mg ↔ mcg) Step-by-Step", primaryKeyword: "mg to mcg conversion nursing dosage", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Metric ladder with cancellation exam style." },
  { title: "IV Bolus “Push Over X Minutes”: Rate Math Nurses Actually Use", primaryKeyword: "IV push rate calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "mL per minute to syringe timing with stability caveats." },
  { title: "Fluid Replacement Math: Maintenance vs Deficit (Simplified for Exams)", primaryKeyword: "IV fluid calculation nursing step by step", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Structured setup when stems give losses or maintenance goals." },
  { title: "Pediatric Dose by Weight: Step-by-Step With a Safety Ceiling Check", primaryKeyword: "pediatric dosage calculation nursing step by step", category: "Pediatrics", intentType: "calculation-how-to", shortDescription: "kg conversions and “does this dose make sense” habits." },
  { title: "Reconstitution Math: Mixing Powdered Antibiotics (Label Walkthrough)", primaryKeyword: "reconstitution medication calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Final concentration and mL to draw for pump programming items." },
  { title: "Titration Tables: Converting “Increase by X units/hr” to Pump Settings", primaryKeyword: "insulin drip titration nursing calculation", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Stepwise titration interpretation without ICU overload." },
  { title: "mEq Dosing for Electrolytes: What NCLEX Tests (and What It Doesn’t)", primaryKeyword: "mEq medication calculation nursing", category: "Pharmacology", intentType: "calculation-how-to", shortDescription: "Practical setup for replacement scenarios with monitoring pairs." },
  { title: "Percentage-Based Solutions: Step-by-Step (Dextrose Math)", primaryKeyword: "percentage solution calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Percent to usable concentration reasoning for stems." },
  { title: "Body Surface Area (BSA) Dosing: When the Stem Gives Height/Weight", primaryKeyword: "BSA medication calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Formula plus exam simplifications and policy reality." },
  { title: "IV Piggyback Timing: “Run Over 30 Minutes” Math + Line Patency Checks", primaryKeyword: "IV piggyback infusion time calculation nursing", category: "Nursing Skills", intentType: "calculation-how-to", shortDescription: "Secondary line math paired with medication safety." },
  { title: "Syringe Pump mL/hr for Small Volumes (Peds/NICU-Style Practice)", primaryKeyword: "syringe pump rate calculation nursing", category: "Pediatrics", intentType: "calculation-how-to", shortDescription: "Micro-volume rates with rounding discipline." },
  { title: "Oxygen FiO2 Changes vs L/min: What the NCLEX Wants (Concept + Math Hygiene)", primaryKeyword: "oxygen flow rate nursing calculation NCLEX", category: "Respiratory", intentType: "calculation-how-to", shortDescription: "Device limits and false precision traps." },
  { title: "Dilution Math for IV Meds: “Add to 100 mL NS” Step-by-Step", primaryKeyword: "IV medication dilution calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Final concentration linked to pump rate stems." },
  { title: "gtt/min When You Already Know mL/hr (Drop Factor Shortcut)", primaryKeyword: "gtt min from mL hr calculation nursing", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Two-step bridge for gravity tubing items." },
  { title: "“How Many Tablets?” Dose-Finding With Fractional Tabs (NCLEX-Style)", primaryKeyword: "tablet dose calculation nursing half tablet", category: "Dosage Calculations", intentType: "calculation-how-to", shortDescription: "Rounding boundaries and when to verify orders." },
  // PRIORITY 81-100
  { title: "What to Do First When K+ Is 6.2 and the Patient Looks “Stable” (NCLEX Priority)", primaryKeyword: "hyperkalemia priority nursing action NCLEX", category: "Med-Surg", intentType: "prioritization-traps", shortDescription: "Rhythm risk versus busywork answers on electrolyte stems." },
  { title: "ABC vs Nursing Process: When NCLEX Wants Airway Before “Assess More”", primaryKeyword: "ABC priority nursing NCLEX first action", category: "NCLEX Strategy", intentType: "prioritization-traps", shortDescription: "When to stop collecting data and act on airway threat." },
  { title: "New Onset Confusion Post-Op: Infection vs Opioids vs Hypoxia (Pick First)", primaryKeyword: "post op confusion priority nursing NCLEX", category: "Med-Surg", intentType: "prioritization-traps", shortDescription: "Elimination order for common post-op change scenarios." },
  { title: "Chest Pain in the Clinic: Who Goes to the ED First (Judgment Drill)", primaryKeyword: "chest pain priority nursing assessment NCLEX", category: "Cardiac", intentType: "prioritization-traps", shortDescription: "Red-flag clustering versus benign explanations." },
  { title: "Sudden Shortness of Breath With Unilateral Leg Swelling: First Nursing Moves", primaryKeyword: "DVT PE priority nursing actions NCLEX", category: "Respiratory", intentType: "prioritization-traps", shortDescription: "Safety, monitoring, and escalation patterns." },
  { title: "Hypoglycemia Symptoms but Glucose “Borderline”: What NCLEX Is Testing", primaryKeyword: "hypoglycemia priority nursing intervention NCLEX", category: "Endocrine", intentType: "prioritization-traps", shortDescription: "Treat symptoms versus chase numbers trap." },
  { title: "“Patient Refuses Meds”: Priority Is Not Arguing—It’s Assessment First", primaryKeyword: "patient refuses medication nursing priority NCLEX", category: "NCLEX Strategy", intentType: "prioritization-traps", shortDescription: "Rights, capacity, and therapeutic communication sequence." },
  { title: "Bleeding After Heparin: What to Check Before You Panic-Click Answers", primaryKeyword: "heparin bleeding nursing priority NCLEX", category: "Pharmacology", intentType: "prioritization-traps", shortDescription: "Assessment sequence with labs and protocol language." },
  { title: "Fall Risk vs Impulsive Behavior: Which Safety Action Comes First?", primaryKeyword: "fall risk nursing priority mental health NCLEX", category: "Mental Health", intentType: "prioritization-traps", shortDescription: "Environment, 1:1, and least restrictive effective options." },
  { title: "Postpartum Bleeding: First-Line Nursing Actions Before “More Fluids”", primaryKeyword: "postpartum hemorrhage nursing priority NCLEX", category: "OB/Maternity", intentType: "prioritization-traps", shortDescription: "Fundus, bleeding quantification, activation cues." },
  { title: "Pediatric Fever + Petechial Rash: Priority Actions Parents (and Exams) Need", primaryKeyword: "petechial rash fever pediatric nursing priority NCLEX", category: "Pediatrics", intentType: "prioritization-traps", shortDescription: "Escalation framing without diagnosing in nursing scope." },
  { title: "Stroke Symptoms <10 Minutes Ago: What NCLEX Wants You to Prioritize", primaryKeyword: "stroke nursing priority NCLEX first action", category: "Neuro", intentType: "prioritization-traps", shortDescription: "Time-sensitive pathway thinking versus documentation rabbit holes." },
  { title: "Anaphylaxis vs Mild Allergy: Epi First or Assessment First?", primaryKeyword: "anaphylaxis nursing priority epinephrine NCLEX", category: "Med-Surg", intentType: "prioritization-traps", shortDescription: "Clears “call provider before med” traps on airway items." },
  { title: "Suicidal Ideation Disclosed in Passing: Immediate Nursing Priority", primaryKeyword: "suicidal ideation nursing priority NCLEX", category: "Mental Health", intentType: "prioritization-traps", shortDescription: "Safety assessment hierarchy and therapeutic response patterns." },
  { title: "Digoxin + Low K+: Which Problem Do You Address First on the Exam?", primaryKeyword: "digoxin toxicity hypokalemia priority nursing NCLEX", category: "Pharmacology", intentType: "prioritization-traps", shortDescription: "Electrolyte versus drug hold sequencing with rationales." },
  { title: "“Patient Pulling at Lines”: Behavioral vs Safety Priority in Med-Surg", primaryKeyword: "patient pulling IV line nursing priority NCLEX", category: "Med-Surg", intentType: "prioritization-traps", shortDescription: "De-escalation and injury prevention without restraint-first answers." },
  { title: "Post-Extubation Stridor: Nursing Priorities in the First Minutes", primaryKeyword: "post extubation stridor nursing priority NCLEX", category: "Respiratory", intentType: "prioritization-traps", shortDescription: "Airway-focused actions versus sedating traps." },
  { title: "Suspected Child Abuse: Reporting vs Rapport—What Comes First Legally and Clinically", primaryKeyword: "suspected child abuse nursing priority NCLEX", category: "Pediatrics", intentType: "prioritization-traps", shortDescription: "Safety, documentation, and mandated reporting sequence." },
  { title: "Transfusion Reaction: Stop the Line vs Call the Provider (NCLEX Order)", primaryKeyword: "transfusion reaction nursing priority first action NCLEX", category: "Med-Surg", intentType: "prioritization-traps", shortDescription: "Immediate patient safety sequencing with reaction nuances." },
  { title: "“Which Patient Do You See First?” Charge Nurse Triage (4 Patients, 1 Nurse)", primaryKeyword: "nursing prioritization multiple patients NCLEX", category: "NCLEX Strategy", intentType: "prioritization-traps", shortDescription: "Acuity habits for leadership and multi-patient items." },
];

if (TOPICS.length !== 100) {
  console.error("Expected 100 topics, got", TOPICS.length);
  process.exit(1);
}

function translationPriorityRow(index) {
  // high: first 40 posts (mechanism + practice) get fr/es sooner after EN approval
  if (index < 40) return { tier: "high", localesNext: ["fr", "es"], note: "After English approval, translate to fr and es first." };
  if (index < 70) return { tier: "medium", localesNext: ["tl", "hi"], note: "Queue Tagalog and Hindi after high-tier backlog is reviewed." };
  return { tier: "deferred", localesNext: ["zh", "zh-tw", "ar", "ko", "pt", "pa", "ja", "vi", "de", "th", "tr", "id", "it", "ru", "fa", "ht", "ur"], note: "Defer until medical localization QA capacity exists." };
}

function publicationPriority(index) {
  if (index < 10) return { wave: 1, rank: index + 1 };
  if (index < 30) return { wave: 2, rank: index + 1 };
  if (index < 60) return { wave: 3, rank: index + 1 };
  return { wave: 4, rank: index + 1 };
}

const manifest = TOPICS.map((t, i) => {
  const id = i + 1;
  const tail = slugify(t.title).slice(0, 70) || slugify(t.primaryKeyword).slice(0, 70);
  const slug = `nclex-seo-${String(id).padStart(3, "0")}-${tail}`.slice(0, 96);
  const tp = translationPriorityRow(i);
  const pub = publicationPriority(i);
  return {
    id,
    title: t.title,
    slug: `${slug}`.slice(0, 96),
    primaryKeyword: t.primaryKeyword,
    category: t.category,
    intentType: t.intentType,
    shortDescription: t.shortDescription,
    targetAudience: "Nursing students (PN, RN), NCLEX candidates, new grads, clinical rotation students",
    suggestedRelatedLessonPaths: lessonPathsForCategory(t.category),
    suggestedRelatedTools: toolsFor(t.category, t.intentType),
    translationPriority: tp.tier,
    translationLocalesPlanned: tp,
    publicationPriority: pub,
    translationGroupId: `nclex-seo-2026-${String(id).padStart(3, "0")}`,
    status: "planned",
  };
});

fs.mkdirSync(OUT_DIR, { recursive: true });
const jsonPath = path.join(OUT_DIR, "nclex-seo-100.manifest.json");
fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, posts: manifest }, null, 2));

const headers = [
  "id",
  "title",
  "slug",
  "primaryKeyword",
  "category",
  "intentType",
  "shortDescription",
  "targetAudience",
  "suggestedRelatedLessonPaths",
  "suggestedRelatedTools",
  "translationPriority",
  "publicationWave",
  "publicationRank",
  "translationGroupId",
  "status",
];
function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
const csvLines = [headers.join(",")];
for (const m of manifest) {
  csvLines.push(
    [
      m.id,
      m.title,
      m.slug,
      m.primaryKeyword,
      m.category,
      m.intentType,
      m.shortDescription,
      m.targetAudience,
      m.suggestedRelatedLessonPaths.join("|"),
      m.suggestedRelatedTools.join("|"),
      m.translationPriority,
      m.publicationPriority.wave,
      m.publicationPriority.rank,
      m.translationGroupId,
      m.status,
    ]
      .map(csvEscape)
      .join(","),
  );
}
fs.writeFileSync(path.join(OUT_DIR, "nclex-seo-100.manifest.csv"), csvLines.join("\n"));
console.log("Wrote", jsonPath);
console.log("Wrote", path.join(OUT_DIR, "nclex-seo-100.manifest.csv"));
