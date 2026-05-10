#!/usr/bin/env npx tsx
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

type Topic = {
  slug: string;
  title: string;
  seoTitle: string;
  excerpt: string;
  category: string;
  tags: string[];
  focus: string;
  contrast?: string;
  assessments: string[];
  priorities: string[];
  traps: string[];
  internalLinks: string[];
  faqs: [string, string][];
  references: string[];
};

const today = "2026-05-10";
const disclaimer =
  "This article is for nursing education and exam preparation only and is not individualized medical advice. Follow local policy, provider orders, and current clinical guidelines in patient care.";

const topics: Topic[] = [
  {
    slug: "siadh-vs-diabetes-insipidus-nursing-comparison",
    title: "SIADH vs Diabetes Insipidus Explained for Nursing Students",
    seoTitle: "SIADH vs diabetes insipidus nursing comparison | NurseNest",
    excerpt:
      "Compare SIADH and diabetes insipidus by urine output, sodium direction, osmolality, neuro risk, and nursing priorities for NCLEX-RN and REx-PN exams.",
    category: "Endocrine Disorders",
    tags: ["SIADH", "Diabetes Insipidus", "Sodium", "Endocrine", "NCLEX-RN", "REx-PN", "Fluid Balance"],
    focus:
      "SIADH retains too much water through excess antidiuretic hormone effect, while diabetes insipidus loses too much free water because antidiuretic hormone is absent or ineffective. The exam pattern is water retention with dilutional hyponatremia versus water loss with hypernatremia risk.",
    contrast: "SIADH is concentrated urine with low serum sodium; DI is dilute high-volume urine with rising serum sodium and thirst.",
    assessments: ["daily weight and strict intake-output", "serum sodium and serum osmolality trends", "urine specific gravity and urine osmolality", "mental status, seizure risk, thirst, mucous membranes", "medication and neuro history, including head injury or surgery"],
    priorities: ["protect the airway if severe neurologic symptoms occur", "implement prescribed fluid restriction for SIADH", "replace water carefully and administer desmopressin when prescribed for central DI", "monitor correction speed to avoid neurologic injury", "teach patients to report confusion, weakness, extreme thirst, or sudden urine changes"],
    traps: ["assuming all low sodium means sodium tablets before assessing volume", "missing that DI can cause shock from water loss", "treating urine output alone without matching sodium and osmolality", "forgetting seizure precautions in severe hyponatremia"],
    internalLinks: ["/blog/hyponatremia-symptoms-causes-nursing-priorities", "/blog/hypernatremia-causes-symptoms-nursing-care", "/blog/seizure-disorders-treatment-nursing-care"],
    faqs: [
      ["Which has high urine output, SIADH or DI?", "Diabetes insipidus usually causes very high urine output because free water is not retained."],
      ["Why is SIADH dangerous?", "Severe SIADH can lower sodium enough to cause cerebral edema, confusion, seizures, and airway risk."],
    ],
    references: ["Verbalis, J. G. (2024). Disorders of water balance. In Endotext.", "National Institute of Diabetes and Digestive and Kidney Diseases. (2024). Diabetes insipidus.", "Sterns, R. H. (2023). Treatment of hyponatremia. Kidney International Reports."],
  },
  {
    slug: "dka-vs-hhs-nursing-priorities",
    title: "DKA vs HHS Explained: Nursing Priorities, Labs, and NCLEX Differences",
    seoTitle: "DKA vs HHS nursing priorities and NCLEX differences | NurseNest",
    excerpt:
      "Separate diabetic ketoacidosis from hyperosmolar hyperglycemic state using ketones, acidosis, osmolality, dehydration, mental status, and safe nursing priorities.",
    category: "Endocrine Disorders",
    tags: ["DKA", "HHS", "Diabetes", "Endocrine", "NCLEX-RN", "REx-PN", "Insulin", "Fluid Resuscitation"],
    focus:
      "DKA is an insulin-deficiency state with ketosis and metabolic acidosis. HHS is a severe hyperglycemic dehydration syndrome with very high osmolality and little or no ketoacidosis. Both are emergencies, but the lab story and likely patient presentation differ.",
    contrast: "DKA often has Kussmaul respirations, abdominal pain, ketones, and acidosis; HHS often has profound dehydration, neurologic changes, and higher glucose/osmolality.",
    assessments: ["airway, work of breathing, and perfusion", "point-of-care glucose and serum chemistry trends", "potassium before and during insulin therapy", "urine or serum ketones, anion gap, and venous pH", "mental status, dehydration signs, and infection triggers"],
    priorities: ["anticipate isotonic fluid resuscitation before or with insulin per protocol", "place on cardiac monitoring when potassium is abnormal", "monitor for cerebral edema risk during rapid shifts", "identify infection, missed insulin, myocardial infarction, or steroid triggers", "teach sick-day rules and when to seek urgent care"],
    traps: ["giving insulin without considering potassium", "assuming HHS is safer because ketones are absent", "missing Kussmaul respirations as compensation for acidosis", "choosing education before stabilization"],
    internalLinks: ["/blog/metabolic-acidosis-vs-metabolic-alkalosis", "/blog/hypernatremia-causes-symptoms-nursing-care", "/blog/sepsis-pathophysiology-early-nursing-recognition"],
    faqs: [
      ["Which condition has ketones?", "DKA has clinically important ketone production; HHS usually has minimal or absent ketoacidosis."],
      ["What electrolyte matters most before insulin?", "Potassium is a major safety check because insulin shifts potassium into cells and can worsen hypokalemia."],
    ],
    references: ["American Diabetes Association Professional Practice Committee. (2026). Standards of care in diabetes-2026. Diabetes Care.", "Umpierrez, G. E., & Korytkowski, M. (2024). Diabetic emergencies. Endocrinology and Metabolism Clinics.", "Joint British Diabetes Societies. (2023). The management of diabetic ketoacidosis in adults."],
  },
  {
    slug: "acute-kidney-injury-prerenal-intrinsic-postrenal",
    title: "Acute Kidney Injury Explained: Prerenal vs Intrinsic vs Postrenal",
    seoTitle: "Acute kidney injury prerenal vs intrinsic vs postrenal | NurseNest",
    excerpt:
      "Map AKI causes to perfusion, kidney tissue injury, or obstruction, then connect labs, urine output, potassium, and nursing escalation priorities.",
    category: "Renal Disorders",
    tags: ["AKI", "Renal", "Prerenal", "Postrenal", "NCLEX-RN", "REx-PN", "Potassium"],
    focus:
      "Acute kidney injury is a sudden decline in kidney filtration. Nursing exams usually organize causes into prerenal hypoperfusion, intrinsic kidney tissue injury, and postrenal obstruction. The category matters because it changes what assessment clue you should chase next.",
    contrast: "Prerenal means not enough blood flow to the kidney, intrinsic means kidney structure is injured, and postrenal means urine cannot drain.",
    assessments: ["hourly or strict urine output", "creatinine, BUN, potassium, bicarbonate, and fluid balance", "blood pressure, volume status, sepsis signs, and nephrotoxin exposure", "bladder distention, catheter patency, flank pain, or prostate history", "edema, crackles, ECG changes, and uremic symptoms"],
    priorities: ["report oliguria with rising potassium promptly", "avoid nephrotoxins and clarify contrast or NSAID exposure", "support ordered fluids when hypoperfusion is suspected", "prepare for obstruction relief when postrenal clues appear", "monitor dialysis indications such as refractory hyperkalemia, acidosis, overload, or uremic complications"],
    traps: ["assuming all AKI patients need more fluid", "ignoring obstruction because creatinine is a blood test", "missing ECG monitoring with hyperkalemia", "waiting for anuria before escalating"],
    internalLinks: ["/blog/hyperkalemia-ecg-changes-nursing-students", "/blog/why-potassium-changes-are-dangerous-in-acute-kidney-injury-nursing-exams", "/blog/metabolic-acidosis-vs-metabolic-alkalosis"],
    faqs: [
      ["What is the earliest nursing clue in AKI?", "A falling urine output trend is often an early bedside clue, especially when paired with rising creatinine or potassium."],
      ["Can AKI be postrenal with a normal-looking assessment?", "Yes. Obstruction can be missed unless the nurse checks urine output pattern, bladder distention, catheter function, and relevant history."],
    ],
    references: ["Kidney Disease: Improving Global Outcomes. (2024). KDIGO clinical practice guideline for acute kidney injury public review materials.", "National Institute for Health and Care Excellence. (2024). Acute kidney injury: prevention, detection and management.", "Ostermann, M., et al. (2023). Acute kidney injury. The Lancet."],
  },
  {
    slug: "left-sided-vs-right-sided-heart-failure",
    title: "Left-Sided vs Right-Sided Heart Failure: Symptoms and Nursing Care",
    seoTitle: "Left-sided vs right-sided heart failure nursing care | NurseNest",
    excerpt:
      "Compare pulmonary congestion with systemic venous congestion and connect dyspnea, edema, daily weights, oxygenation, medications, and escalation cues.",
    category: "Cardiovascular Disorders",
    tags: ["Heart Failure", "Cardiac", "NCLEX-RN", "REx-PN", "Edema", "Pulmonary Congestion", "Daily Weights"],
    focus:
      "Heart failure means the heart cannot meet body demands without abnormal pressures. Left-sided failure backs pressure into the lungs; right-sided failure backs pressure into the systemic venous circulation. Patients may have both, but exam stems often emphasize one side first.",
    contrast: "Left-sided failure sounds wet in the lungs; right-sided failure swells the body and raises venous congestion clues.",
    assessments: ["dyspnea, orthopnea, crackles, oxygen saturation, and pink frothy sputum", "jugular venous distention, dependent edema, ascites, and hepatomegaly", "daily weights and intake-output", "blood pressure, heart rate, renal function, and electrolyte trends", "response to diuretics, vasodilators, and guideline-directed therapy"],
    priorities: ["sit the patient upright for acute respiratory distress", "administer oxygen and prescribed diuretics or vasodilators safely", "monitor potassium and renal function with diuretic therapy", "teach daily weights and when to report rapid gain", "escalate new confusion, severe dyspnea, hypotension, or chest pain"],
    traps: ["calling ankle edema a left-sided-only symptom", "ignoring renal labs during diuresis", "teaching sodium restriction before stabilizing acute pulmonary edema", "missing that right-sided failure can follow chronic lung disease"],
    internalLinks: ["/blog/why-shortness-of-breath-after-iv-fluids-matters-on-nclex-style-questions", "/blog/copd-symptoms-treatment-nursing-care", "/blog/digoxin-toxicity-nursing-priorities"],
    faqs: [
      ["Which side causes crackles?", "Left-sided heart failure classically causes pulmonary congestion, crackles, and dyspnea."],
      ["Why are daily weights emphasized?", "Daily weights detect fluid retention earlier than visible edema for many patients."],
    ],
    references: ["Heidenreich, P. A., et al. (2022). AHA/ACC/HFSA guideline for the management of heart failure. Circulation.", "McDonagh, T. A., et al. (2023). Focused update of the ESC heart failure guideline. European Heart Journal.", "American Heart Association. (2024). Heart failure signs and symptoms."],
  },
  {
    slug: "sepsis-pathophysiology-early-nursing-recognition",
    title: "Sepsis Pathophysiology and Early Nursing Recognition",
    seoTitle: "Sepsis pathophysiology and early nursing recognition | NurseNest",
    excerpt:
      "Trace infection-triggered dysregulation to hypoperfusion, organ dysfunction, lactate themes, antibiotics, fluids, vasopressors, and nursing escalation.",
    category: "Critical Care",
    tags: ["Sepsis", "Septic Shock", "Critical Care", "NCLEX-RN", "REx-PN", "Lactate", "Perfusion"],
    focus:
      "Sepsis is not simply infection plus fever. It is life-threatening organ dysfunction from a dysregulated host response to infection. Nursing recognition depends on seeing the pattern early: infection risk, abnormal vital signs, altered perfusion, worsening mentation, decreasing urine output, and rising organ stress.",
    contrast: "Localized infection may be stable; sepsis shows systemic deterioration and organ dysfunction.",
    assessments: ["temperature, heart rate, respiratory rate, blood pressure, and oxygenation trends", "mental status and new confusion", "urine output and skin perfusion", "lactate, cultures, white blood cell trend, creatinine, bilirubin, and platelets", "source clues such as pneumonia, urinary infection, wounds, lines, or abdominal symptoms"],
    priorities: ["escalate suspected sepsis promptly using facility protocol", "anticipate cultures and timely antibiotics without delaying stabilization", "support ordered fluid resuscitation and reassess response", "monitor for shock and vasopressor need", "trend lactate, urine output, mental status, and respiratory status"],
    traps: ["waiting for fever when older or immunocompromised patients may be hypothermic", "treating lactate as the diagnosis instead of a perfusion marker", "missing respiratory rate as an early warning sign", "documenting deterioration without escalation"],
    internalLinks: ["/blog/dka-vs-hhs-nursing-priorities", "/blog/respiratory-acidosis-vs-respiratory-alkalosis", "/blog/acute-kidney-injury-prerenal-intrinsic-postrenal"],
    faqs: [
      ["What is the nurse's first priority in suspected sepsis?", "Recognize deterioration, escalate promptly, support ABCs, and initiate protocol-driven diagnostics and treatment."],
      ["Does every septic patient have a fever?", "No. Some high-risk patients are afebrile or hypothermic, so trends and perfusion matter."],
    ],
    references: ["Evans, L., et al. (2021). Surviving Sepsis Campaign guidelines. Intensive Care Medicine.", "Singer, M., et al. (2016). The third international consensus definitions for sepsis and septic shock. JAMA.", "Society of Critical Care Medicine. (2024). Surviving Sepsis Campaign resources."],
  },
  {
    slug: "digoxin-toxicity-nursing-priorities",
    title: "Digoxin Toxicity: Nursing Priorities, Risk Factors, and Exam Recognition",
    seoTitle: "Digoxin toxicity nursing priorities and NCLEX signs | NurseNest",
    excerpt:
      "Recognize digoxin toxicity by GI, neurologic, visual, rhythm, renal, and potassium clues, then apply safe monitoring and escalation priorities.",
    category: "Pharmacology",
    tags: ["Digoxin", "Cardiac Glycoside", "Toxicity", "Pharmacology", "NCLEX-RN", "REx-PN", "Potassium", "Heart Failure"],
    focus:
      "Digoxin increases cardiac contractility and slows conduction through the AV node. The safety problem is its narrow therapeutic range. Toxicity becomes more likely with renal impairment, older age, interacting medications, and electrolyte disturbances, especially low potassium.",
    assessments: ["apical pulse before administration per policy", "nausea, vomiting, anorexia, fatigue, confusion, and visual halos", "heart rate, rhythm strips, AV block, or ectopy", "serum digoxin when ordered plus potassium, magnesium, creatinine, and BUN", "medication list for diuretics, amiodarone, verapamil, macrolides, or renal-dose concerns"],
    priorities: ["hold and clarify administration when pulse or toxicity criteria are unsafe", "place symptomatic or high-risk patients on cardiac monitoring", "correct contributing electrolyte abnormalities as prescribed", "prepare for digoxin immune Fab in severe toxicity per provider order", "teach consistent dosing, pulse checks if taught by the program, and toxicity reporting"],
    traps: ["focusing only on the digoxin level and ignoring symptoms", "forgetting that hypokalemia increases toxicity risk", "giving the next dose when new nausea and bradycardia appear", "assuming visual halos are harmless"],
    internalLinks: ["/blog/left-sided-vs-right-sided-heart-failure", "/blog/hypokalemia-pathophysiology-nursing-priorities", "/blog/beta-blockers-mechanism-side-effects-nursing-teaching"],
    faqs: [
      ["What electrolyte increases digoxin toxicity risk?", "Hypokalemia is a classic risk factor because it increases digoxin effect at the myocardial cell."],
      ["What symptoms suggest digoxin toxicity?", "GI upset, confusion, visual changes, bradycardia, and dysrhythmias are high-yield warning clues."],
    ],
    references: ["American Heart Association. (2024). Heart failure medications.", "Lexicomp. (2025). Digoxin: Drug information.", "Heidenreich, P. A., et al. (2022). AHA/ACC/HFSA guideline for heart failure. Circulation."],
  },
  {
    slug: "warfarin-vs-heparin-nursing-comparison",
    title: "Warfarin vs Heparin for Nursing Students: Monitoring, Reversal, and Safety",
    seoTitle: "Warfarin vs heparin nursing comparison | NurseNest",
    excerpt:
      "Compare anticoagulant onset, route, labs, reversal, bleeding precautions, HIT risk, pregnancy considerations, and NCLEX nursing safety priorities.",
    category: "Pharmacology",
    tags: ["Warfarin", "Heparin", "Anticoagulation", "INR", "aPTT", "NCLEX-RN", "REx-PN", "Bleeding"],
    focus:
      "Warfarin and heparin both reduce clotting risk, but they are not interchangeable in route, onset, monitoring, or reversal. Exams test whether you know which lab belongs to which medication and what bleeding or clotting complication requires escalation.",
    contrast: "Heparin acts quickly and is often parenteral; warfarin is oral, slower, and monitored with INR.",
    assessments: ["baseline bleeding history, fall risk, pregnancy status, and current medications", "INR for warfarin; aPTT or anti-Xa for unfractionated heparin per protocol", "platelets for heparin-induced thrombocytopenia risk", "hematuria, melena, bruising, neuro changes, hypotension, and tachycardia", "diet pattern, alcohol use, antibiotics, and supplement interactions for warfarin"],
    priorities: ["use bleeding precautions and avoid unnecessary IM injections", "verify dose, route, pump settings, and double-check requirements", "hold and notify for critical labs or active bleeding per policy", "anticipate vitamin K or PCC concepts for warfarin reversal and protamine for heparin reversal", "teach consistent vitamin K intake rather than avoiding all greens"],
    traps: ["mixing up INR and aPTT", "telling patients to stop all leafy greens", "missing platelet drop on heparin", "choosing ambulation teaching over active bleeding escalation"],
    internalLinks: ["/blog/deep-vein-thrombosis-nursing-guide", "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care"],
    faqs: [
      ["Which lab monitors warfarin?", "Warfarin is commonly monitored with INR."],
      ["Which reversal agent is associated with heparin?", "Protamine sulfate is the classic heparin reversal medication taught for nursing exams."],
    ],
    references: ["American Society of Hematology. (2021). Guidelines for management of venous thromboembolism.", "CHEST. (2021). Antithrombotic therapy for VTE disease guideline update.", "Lexicomp. (2025). Warfarin and heparin drug information."],
  },
  {
    slug: "beta-blockers-mechanism-side-effects-nursing-teaching",
    title: "Beta Blockers: Mechanism, Side Effects, and Nursing Teaching Points",
    seoTitle: "Beta blockers nursing teaching, side effects, and NCLEX priorities | NurseNest",
    excerpt:
      "Learn how beta blockers reduce sympathetic cardiac effects, why bradycardia and hypotension matter, and what patient teaching NCLEX items reward.",
    category: "Pharmacology",
    tags: ["Beta Blockers", "Pharmacology", "Cardiovascular", "NCLEX-RN", "REx-PN", "Bradycardia", "Patient Teaching"],
    focus:
      "Beta blockers reduce beta-adrenergic stimulation. In plain language, they slow heart rate, reduce contractility, and lower the workload of the heart. Some also affect bronchial smooth muscle or mask adrenergic symptoms of hypoglycemia, which is why assessment matters before teaching.",
    assessments: ["heart rate, blood pressure, dizziness, fatigue, and orthostasis", "asthma or COPD history for nonselective agents", "blood glucose pattern and hypoglycemia awareness in diabetes", "heart failure status and signs of worsening fluid overload", "medication reconciliation for duplicate rate-control therapy"],
    priorities: ["check pulse and blood pressure before administration per policy", "hold and clarify unsafe bradycardia or hypotension parameters", "teach not to stop abruptly unless directed", "teach slow position changes and fall precautions", "explain that hypoglycemia may present with sweating rather than palpitations"],
    traps: ["assuming all beta blockers are unsafe in every respiratory patient", "missing masked hypoglycemia teaching", "stopping abruptly after side effects", "giving another rate-control drug without checking the trend"],
    internalLinks: ["/blog/left-sided-vs-right-sided-heart-failure", "/blog/asthma-pathophysiology-emergency-nursing-interventions", "/blog/digoxin-toxicity-nursing-priorities"],
    faqs: [
      ["Why do nurses check pulse before beta blockers?", "Beta blockers can cause or worsen bradycardia, so pulse trends help determine if administration is safe under policy."],
      ["What diabetic teaching matters with beta blockers?", "They may mask palpitations or tremor during hypoglycemia, so sweating, confusion, and glucose checks remain important."],
    ],
    references: ["Whelton, P. K., et al. (2018). Guideline for high blood pressure in adults. Hypertension.", "Heidenreich, P. A., et al. (2022). AHA/ACC/HFSA heart failure guideline. Circulation.", "Lexicomp. (2025). Beta-adrenergic blocking agents."],
  },
  {
    slug: "hyponatremia-symptoms-causes-nursing-priorities",
    title: "Hyponatremia: Symptoms, Causes, and Nursing Priorities for NCLEX",
    seoTitle: "Hyponatremia symptoms, causes, and nursing priorities | NurseNest",
    excerpt:
      "Connect low sodium to cerebral edema risk, volume status clues, seizure precautions, correction safety, and nursing exam priorities.",
    category: "Electrolyte Disorders",
    tags: ["Hyponatremia", "Sodium", "Electrolytes", "NCLEX-RN", "REx-PN", "SIADH", "Seizures", "Fluid Balance"],
    focus:
      "Hyponatremia means serum sodium is low relative to body water. The danger is not the number by itself; it is water shifting into brain cells, especially when sodium drops quickly. Nursing priorities change when headache becomes confusion, seizure, or decreased level of consciousness.",
    assessments: ["mental status, headache, nausea, weakness, gait changes, and seizures", "volume status: dry, overloaded, or euvolemic", "medications such as thiazides, SSRIs, carbamazepine, and diuretics", "serum and urine osmolality, urine sodium, and glucose context", "intake-output, daily weights, and fall risk"],
    priorities: ["protect airway and safety during severe neurologic symptoms", "initiate seizure precautions when indicated", "follow prescribed fluid restriction, saline, or hypertonic saline protocol carefully", "monitor sodium correction speed", "teach patients to report confusion, severe headache, vomiting, or seizure activity"],
    traps: ["correcting sodium too rapidly", "assuming every case needs free water", "missing medication causes", "treating mild fatigue and active seizure as the same priority level"],
    internalLinks: ["/blog/siadh-vs-diabetes-insipidus-nursing-comparison", "/blog/seizure-disorders-treatment-nursing-care", "/blog/hypernatremia-causes-symptoms-nursing-care"],
    faqs: [
      ["What symptom makes hyponatremia urgent?", "Seizure, severe confusion, decreased consciousness, or airway compromise makes it urgent."],
      ["Why is rapid correction dangerous?", "Overly rapid sodium correction can injure the brain, so protocols control the rate carefully."],
    ],
    references: ["Sterns, R. H. (2023). Treatment of hyponatremia. Kidney International Reports.", "Verbalis, J. G. (2024). Disorders of water balance. Endotext.", "National Institute for Health and Care Excellence. (2024). Intravenous fluid therapy in adults."],
  },
  {
    slug: "hypernatremia-causes-symptoms-nursing-care",
    title: "Hypernatremia: Causes, Symptoms, and Nursing Care for Clinical Exams",
    seoTitle: "Hypernatremia causes, symptoms, and nursing care | NurseNest",
    excerpt:
      "Understand water deficit, neurologic symptoms, dehydration assessment, correction safety, and high-yield NCLEX/REx-PN nursing interventions.",
    category: "Electrolyte Disorders",
    tags: ["Hypernatremia", "Sodium", "Dehydration", "NCLEX-RN", "REx-PN", "Fluid Balance", "Osmolality"],
    focus:
      "Hypernatremia usually reflects too little water relative to sodium. It is common in patients who cannot access water, have impaired thirst, lose free water, or receive excessive sodium. The brain adapts slowly, so correction must also be controlled.",
    assessments: ["thirst, dry mucous membranes, poor skin turgor, fever, and orthostasis", "confusion, irritability, twitching, seizures, or coma", "urine output, urine concentration, and diabetes insipidus clues", "tube feeding, osmotic diuresis, diarrhea, sweating, or impaired access to water", "serum sodium trend and glucose-corrected interpretation when needed"],
    priorities: ["restore circulating volume first if shock is present", "administer prescribed hypotonic fluids or enteral water carefully", "monitor neurologic status during correction", "prevent falls and injury from confusion or weakness", "build hydration access plans for older adults and dependent patients"],
    traps: ["giving rapid free water without considering cerebral edema risk", "missing that altered mental status may be dehydration-related", "assuming sodium excess is always dietary", "ignoring DI when urine output is extreme"],
    internalLinks: ["/blog/siadh-vs-diabetes-insipidus-nursing-comparison", "/blog/dka-vs-hhs-nursing-priorities", "/blog/seizure-disorders-treatment-nursing-care"],
    faqs: [
      ["What is the most common concept behind hypernatremia?", "A water deficit relative to sodium is the core concept for most exam stems."],
      ["Why correct hypernatremia carefully?", "Rapid shifts can cause cerebral edema, especially when hypernatremia is chronic."],
    ],
    references: ["Verbalis, J. G. (2024). Disorders of water balance. Endotext.", "National Institute for Health and Care Excellence. (2024). Intravenous fluid therapy in adults.", "Sterns, R. H. (2023). Hypernatremia in adults. Kidney International Reports."],
  },
  {
    slug: "hypocalcemia-vs-hypercalcemia-nclex-guide",
    title: "Hypocalcemia vs Hypercalcemia: NCLEX Guide for Nursing Students",
    seoTitle: "Hypocalcemia vs hypercalcemia NCLEX guide | NurseNest",
    excerpt:
      "Contrast tetany and QT prolongation with stones, bones, groans, confusion, dehydration, and calcium-focused nursing priorities.",
    category: "Electrolyte Disorders",
    tags: ["Calcium", "Hypocalcemia", "Hypercalcemia", "NCLEX-RN", "REx-PN", "ECG", "Parathyroid"],
    focus:
      "Calcium stabilizes nerves, muscles, bone, and cardiac conduction. Low calcium makes excitable tissues more irritable; high calcium slows many systems and can impair kidneys, bones, bowel, and mentation.",
    contrast: "Hypocalcemia is twitchy and seizure-prone; hypercalcemia is weak, dehydrated, constipated, and mentally slowed.",
    assessments: ["numbness, tingling, tetany, cramps, laryngospasm, and seizures", "Chvostek and Trousseau signs when taught by the program", "constipation, polyuria, kidney stones, bone pain, and confusion", "QT interval changes and dysrhythmia symptoms", "albumin, magnesium, phosphate, renal function, and parathyroid history"],
    priorities: ["protect airway for laryngospasm or seizure risk", "institute seizure precautions for symptomatic hypocalcemia", "encourage prescribed hydration and mobility for hypercalcemia when appropriate", "monitor ECG and calcium replacement safety", "teach vitamin D, calcium, and medication instructions as prescribed"],
    traps: ["mixing up QT prolongation and shortened QT", "forgetting magnesium can affect calcium correction", "ignoring dehydration in hypercalcemia", "choosing diet teaching before acute airway symptoms"],
    internalLinks: ["/blog/seizure-disorders-treatment-nursing-care", "/blog/pancreatitis-symptoms-causes-nursing-priorities", "/blog/metabolic-acidosis-vs-metabolic-alkalosis"],
    faqs: [
      ["Which calcium problem causes tetany?", "Hypocalcemia is associated with tetany, paresthesias, and seizure risk."],
      ["Which calcium problem causes kidney stones?", "Hypercalcemia is classically associated with stones, constipation, bone pain, and confusion."],
    ],
    references: ["Bilezikian, J. P. (2022). Primary hyperparathyroidism. Journal of Clinical Endocrinology & Metabolism.", "Endocrine Society. (2024). Calcium and vitamin D patient resources.", "Merck Manual Professional Edition. (2025). Disorders of calcium concentration."],
  },
  {
    slug: "metabolic-acidosis-vs-metabolic-alkalosis",
    title: "Metabolic Acidosis vs Metabolic Alkalosis: Nursing Pathophysiology Review",
    seoTitle: "Metabolic acidosis vs metabolic alkalosis nursing review | NurseNest",
    excerpt:
      "Use bicarbonate direction, compensation, anion gap clues, potassium shifts, respiratory patterns, and nursing priorities to decode ABG questions.",
    category: "Acid-Base Disorders",
    tags: ["ABG", "Metabolic Acidosis", "Metabolic Alkalosis", "NCLEX-RN", "REx-PN", "Bicarbonate", "Anion Gap"],
    focus:
      "Metabolic acid-base disorders begin with bicarbonate or nonrespiratory acid burden. The lungs try to compensate by changing ventilation, but compensation does not erase the underlying problem. Nursing exams reward identifying the cause and the immediate safety threat.",
    contrast: "Metabolic acidosis has low bicarbonate and often deep rapid compensation; metabolic alkalosis has high bicarbonate and often hypoventilatory compensation.",
    assessments: ["pH, bicarbonate, PaCO2, and whether compensation is appropriate", "anion gap, lactate, ketones, renal function, and salicylate context", "vomiting, gastric suction, diuretics, diarrhea, renal failure, or shock", "potassium shifts and ECG risk", "mental status, respiratory effort, perfusion, and fluid balance"],
    priorities: ["support airway and breathing if compensation is failing", "treat the underlying cause per orders such as fluids, insulin, sepsis care, or electrolyte replacement", "monitor potassium closely", "avoid suppressing compensatory respirations without a plan", "trend ABGs or venous gases as ordered"],
    traps: ["calling compensation the primary disorder", "forgetting diarrhea causes bicarbonate loss", "missing vomiting and suction as alkalosis risks", "ignoring potassium because the question says acid-base"],
    internalLinks: ["/blog/dka-vs-hhs-nursing-priorities", "/blog/sepsis-pathophysiology-early-nursing-recognition", "/blog/respiratory-acidosis-vs-respiratory-alkalosis"],
    faqs: [
      ["What lab defines metabolic acidosis?", "Low bicarbonate with acidemia is the central ABG pattern."],
      ["Why does potassium matter?", "Acid-base changes and treatments can shift potassium, creating dysrhythmia risk."],
    ],
    references: ["Kraut, J. A., & Madias, N. E. (2018). Metabolic acidosis. New England Journal of Medicine.", "Berend, K. (2018). Diagnostic use of base excess in acid-base disorders. New England Journal of Medicine.", "American Association for Respiratory Care. (2022). Blood gas analysis clinical resources."],
  },
  {
    slug: "respiratory-acidosis-vs-respiratory-alkalosis",
    title: "Respiratory Acidosis vs Respiratory Alkalosis: ABG Patterns for Nurses",
    seoTitle: "Respiratory acidosis vs respiratory alkalosis ABG guide | NurseNest",
    excerpt:
      "Anchor PaCO2 to ventilation: hypoventilation causes respiratory acidosis, hyperventilation causes respiratory alkalosis. Learn priorities and traps.",
    category: "Acid-Base Disorders",
    tags: ["ABG", "Respiratory Acidosis", "Respiratory Alkalosis", "PaCO2", "NCLEX-RN", "REx-PN", "Ventilation"],
    focus:
      "Respiratory acid-base disorders start with carbon dioxide. CO2 behaves like an acid in the body. Too little ventilation retains CO2 and causes respiratory acidosis; too much ventilation blows off CO2 and causes respiratory alkalosis.",
    contrast: "Respiratory acidosis is hypoventilation or impaired gas exchange; respiratory alkalosis is excessive ventilation relative to CO2 production.",
    assessments: ["pH, PaCO2, bicarbonate, oxygenation, and trend timing", "respiratory rate, depth, fatigue, and airway obstruction", "COPD exacerbation, opioid/sedative exposure, neuromuscular weakness, or chest trauma", "anxiety, pain, pregnancy, fever, sepsis, or early hypoxemia", "mental status changes from CO2 narcosis or alkalosis symptoms"],
    priorities: ["support airway and ventilation first", "reverse opioid effect when prescribed and clinically indicated", "treat bronchospasm, infection, pain, or anxiety triggers", "monitor for respiratory fatigue", "avoid paper-bag style unsafe advice for hyperventilation"],
    traps: ["using oxygen saturation alone to judge ventilation", "missing rising CO2 in a tiring patient", "assuming fast breathing always means alkalosis when sepsis can progress", "forgetting chronic compensation in COPD"],
    internalLinks: ["/blog/copd-symptoms-treatment-nursing-care", "/blog/asthma-pathophysiology-emergency-nursing-interventions", "/blog/sepsis-pathophysiology-early-nursing-recognition"],
    faqs: [
      ["Which value moves first in respiratory disorders?", "PaCO2 is the primary respiratory value."],
      ["Can oxygen saturation be normal with ventilation problems?", "Yes. A patient can oxygenate while retaining CO2, so ventilation assessment matters."],
    ],
    references: ["American Association for Respiratory Care. (2022). Blood gas analysis clinical resources.", "Global Initiative for Chronic Obstructive Lung Disease. (2026). Global strategy for prevention, diagnosis and management of COPD.", "O'Driscoll, B. R., et al. (2017). BTS guideline for oxygen use in adults. Thorax."],
  },
  {
    slug: "copd-symptoms-treatment-nursing-care",
    title: "COPD: Symptoms, Treatment Themes, and Nursing Care for Exams",
    seoTitle: "COPD nursing care symptoms treatment and NCLEX priorities | NurseNest",
    excerpt:
      "Translate chronic airflow limitation into dyspnea patterns, exacerbation recognition, inhaler teaching, oxygen safety, infection prevention, and priorities.",
    category: "Respiratory Disorders",
    tags: ["COPD", "Chronic Bronchitis", "Emphysema", "NCLEX-RN", "REx-PN", "Oxygen Therapy", "Inhalers"],
    focus:
      "COPD is persistent airflow limitation, commonly from emphysema, chronic bronchitis, or both. Nursing exams emphasize how chronic baseline symptoms differ from acute exacerbation, and how oxygenation, ventilation, infection, and medication teaching fit together.",
    assessments: ["baseline dyspnea, cough, sputum, exercise tolerance, and accessory muscle use", "oxygen saturation target range ordered for the patient", "wheezing, diminished breath sounds, fever, increased sputum, or color change", "CO2 retention symptoms such as drowsiness, headache, and confusion", "inhaler technique, smoking exposure, vaccines, and pulmonary rehab participation"],
    priorities: ["position upright and reduce work of breathing", "administer bronchodilators, corticosteroids, antibiotics, or oxygen as prescribed", "titrate oxygen according to orders rather than withholding it from a hypoxemic patient", "encourage pursed-lip breathing and energy conservation", "teach smoking cessation resources and exacerbation action plans"],
    traps: ["withholding oxygen from severe hypoxemia because of COPD", "missing CO2 retention when mental status changes", "teaching inhalers without watching technique", "confusing chronic productive cough with normal aging"],
    internalLinks: ["/blog/respiratory-acidosis-vs-respiratory-alkalosis", "/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", "/blog/left-sided-vs-right-sided-heart-failure"],
    faqs: [
      ["Should nurses withhold oxygen in COPD?", "No. Oxygen is given as prescribed and titrated carefully; untreated hypoxemia is dangerous."],
      ["What suggests COPD exacerbation?", "Increased dyspnea, sputum volume or purulence, wheeze, fever, fatigue, or oxygenation change can signal exacerbation."],
    ],
    references: ["Global Initiative for Chronic Obstructive Lung Disease. (2026). Global strategy for prevention, diagnosis and management of COPD.", "O'Driscoll, B. R., et al. (2017). BTS guideline for oxygen use in adults. Thorax.", "Centers for Disease Control and Prevention. (2024). COPD basics."],
  },
  {
    slug: "asthma-pathophysiology-emergency-nursing-interventions",
    title: "Asthma Emergency Nursing Interventions: Pathophysiology and Priorities",
    seoTitle: "Asthma emergency nursing interventions and NCLEX priorities | NurseNest",
    excerpt:
      "Move from bronchial inflammation and bronchospasm to severity clues, medication sequencing, oxygen, escalation, and status asthmaticus safety.",
    category: "Respiratory Disorders",
    tags: ["Asthma", "Bronchospasm", "Albuterol", "NCLEX-RN", "REx-PN", "Emergency Nursing", "Status Asthmaticus"],
    focus:
      "Asthma is chronic airway inflammation with episodic bronchoconstriction, edema, and mucus. In emergencies, the question is not just whether the patient is wheezing; it is whether airflow is worsening, fatigue is developing, or oxygenation and ventilation are failing.",
    assessments: ["ability to speak, respiratory rate, accessory muscles, retractions, and posture", "wheezing versus silent chest", "oxygen saturation and peak flow when appropriate", "trigger exposure, infection symptoms, and medication use before arrival", "mental status, exhaustion, cyanosis, and rising CO2 clues"],
    priorities: ["position upright and administer oxygen when hypoxemic", "give rapid bronchodilator therapy as prescribed", "anticipate systemic corticosteroids for significant exacerbation", "prepare for escalation if poor response or silent chest occurs", "teach controller versus rescue inhaler roles after stabilization"],
    traps: ["treating silent chest as improvement", "teaching trigger avoidance before emergency treatment", "assuming anxiety is the cause without respiratory assessment", "forgetting spacer technique and adherence education"],
    internalLinks: ["/blog/respiratory-acidosis-vs-respiratory-alkalosis", "/blog/beta-blockers-mechanism-side-effects-nursing-teaching", "/blog/copd-symptoms-treatment-nursing-care"],
    faqs: [
      ["What is a silent chest in asthma?", "It can mean severely reduced airflow and impending respiratory failure, not improvement."],
      ["Which inhaler is the rescue medication concept?", "Short-acting bronchodilators such as albuterol are the classic rescue therapy concept."],
    ],
    references: ["Global Initiative for Asthma. (2025). Global strategy for asthma management and prevention.", "National Heart, Lung, and Blood Institute. (2020). Focused updates to the asthma management guidelines.", "Centers for Disease Control and Prevention. (2024). Asthma clinical information."],
  },
  {
    slug: "pulmonary-embolism-signs-symptoms-nursing-priorities",
    title: "Pulmonary Embolism: Signs, Symptoms, and Nursing Priorities",
    seoTitle: "Pulmonary embolism nursing signs symptoms and priorities | NurseNest",
    excerpt:
      "Recognize PE through sudden dyspnea, pleuritic chest pain, tachycardia, hypoxemia, DVT risk, anticoagulation safety, and emergency escalation.",
    category: "Cardiovascular Disorders",
    tags: ["Pulmonary Embolism", "VTE", "DVT", "NCLEX-RN", "REx-PN", "Anticoagulation", "Hypoxemia"],
    focus:
      "Pulmonary embolism occurs when thrombotic material, often from a deep vein thrombosis, obstructs pulmonary circulation. Nursing exams treat PE as a rapid recognition problem because gas exchange and right-heart strain can deteriorate quickly.",
    assessments: ["sudden dyspnea, pleuritic chest pain, tachypnea, tachycardia, cough, or hemoptysis", "oxygen saturation, work of breathing, blood pressure, and syncope", "DVT clues such as unilateral swelling or pain", "recent surgery, immobility, cancer, pregnancy, estrogen therapy, or prior VTE", "anticoagulant use and bleeding risk"],
    priorities: ["apply oxygen and call for rapid evaluation when PE is suspected", "keep the patient safe and reduce exertion during acute symptoms", "prepare for diagnostics and anticoagulation as ordered", "monitor for shock or right ventricular strain", "teach anticoagulant adherence and bleeding precautions before discharge"],
    traps: ["massaging a painful swollen calf", "assuming normal lung sounds rule out PE", "delaying escalation for education", "missing PE after surgery or prolonged immobility"],
    internalLinks: ["/blog/deep-vein-thrombosis-nursing-guide", "/blog/warfarin-vs-heparin-nursing-comparison", "/blog/copd-symptoms-treatment-nursing-care"],
    faqs: [
      ["What symptom pattern suggests PE?", "Sudden dyspnea with pleuritic chest pain, tachycardia, hypoxemia, or syncope in a risk context is concerning."],
      ["Why is DVT linked to PE?", "A clot from a deep vein can travel to the pulmonary circulation and obstruct blood flow."],
    ],
    references: ["CHEST. (2021). Antithrombotic therapy for VTE disease guideline update.", "European Society of Cardiology. (2019). Guidelines for diagnosis and management of acute pulmonary embolism.", "Centers for Disease Control and Prevention. (2024). Venous thromboembolism."],
  },
  {
    slug: "deep-vein-thrombosis-nursing-guide",
    title: "Deep Vein Thrombosis (DVT): Nursing Assessment, Prevention, and Care",
    seoTitle: "Deep vein thrombosis nursing assessment prevention and care | NurseNest",
    excerpt:
      "Master unilateral swelling, prevention bundles, anticoagulation teaching, PE warning signs, and exam-safe DVT nursing priorities.",
    category: "Cardiovascular Disorders",
    tags: ["DVT", "VTE", "Anticoagulation", "NCLEX-RN", "REx-PN", "Immobility", "Compression"],
    focus:
      "Deep vein thrombosis is clot formation in a deep vein, often in the leg. The nursing significance is twofold: prevent clot formation in high-risk patients and recognize symptoms before embolization causes pulmonary compromise.",
    assessments: ["unilateral calf or leg swelling, warmth, pain, tenderness, or redness", "risk factors such as surgery, trauma, immobility, cancer, pregnancy, estrogen therapy, or prior VTE", "pedal pulses, skin color, and neurovascular status as appropriate", "bleeding risk before anticoagulation", "shortness of breath or chest pain suggesting PE"],
    priorities: ["do not massage the affected leg", "promote early ambulation and ordered mechanical prophylaxis", "administer anticoagulation safely and monitor labs per medication", "teach bleeding precautions and adherence", "escalate sudden dyspnea, chest pain, hemoptysis, or syncope"],
    traps: ["using Homan sign as a reliable diagnostic test", "forgetting PE symptoms in a DVT question", "massaging calf pain", "assuming compression devices are used on an untreated suspected DVT without orders"],
    internalLinks: ["/blog/pulmonary-embolism-signs-symptoms-nursing-priorities", "/blog/warfarin-vs-heparin-nursing-comparison", "/blog/stroke-ischemic-vs-hemorrhagic-nursing-care"],
    faqs: [
      ["Should nurses massage a suspected DVT?", "No. Massage is avoided because of embolization concern."],
      ["What PE symptoms should a DVT patient report?", "Sudden shortness of breath, chest pain, coughing blood, fainting, or rapid heart rate require urgent evaluation."],
    ],
    references: ["American Society of Hematology. (2021). Guidelines for management of venous thromboembolism.", "CHEST. (2021). Antithrombotic therapy for VTE disease guideline update.", "Centers for Disease Control and Prevention. (2024). Blood clots."],
  },
  {
    slug: "stroke-ischemic-vs-hemorrhagic-nursing-care",
    title: "Stroke: Ischemic vs Hemorrhagic Nursing Care and Exam Priorities",
    seoTitle: "Ischemic vs hemorrhagic stroke nursing care and priorities | NurseNest",
    excerpt:
      "Separate clot-related ischemic stroke from bleeding-related hemorrhagic stroke while prioritizing time, neuro checks, airway, glucose, and safety.",
    category: "Neurological Disorders",
    tags: ["Stroke", "Ischemic Stroke", "Hemorrhagic Stroke", "NCLEX-RN", "REx-PN", "Neuro Assessment", "tPA"],
    focus:
      "Stroke is sudden neurologic dysfunction from interrupted brain blood flow or bleeding. Ischemic stroke is usually vascular occlusion; hemorrhagic stroke is bleeding into or around brain tissue. Nursing priorities begin before the type is confirmed: recognize symptoms, note last known well, protect ABCs, and activate stroke response.",
    contrast: "Ischemic stroke centers on reperfusion eligibility; hemorrhagic stroke centers on bleeding control, pressure management, and neurosurgical evaluation.",
    assessments: ["FAST symptoms, vision changes, ataxia, severe headache, or speech difficulty", "last known well time and anticoagulant use", "blood glucose to rule out mimic", "blood pressure, airway protection, swallowing safety, and oxygenation", "pupil changes, worsening headache, vomiting, or declining consciousness"],
    priorities: ["activate stroke protocol immediately", "keep NPO until swallow screen is complete", "prepare for noncontrast CT or imaging pathway", "monitor neurologic status and prevent aspiration/falls", "do not give thrombolytic therapy concepts until hemorrhage is excluded and eligibility is confirmed"],
    traps: ["waiting to see if symptoms resolve", "giving oral medications before swallow screening", "assuming severe headache always means migraine", "forgetting glucose check in stroke-like symptoms"],
    internalLinks: ["/blog/warfarin-vs-heparin-nursing-comparison", "/blog/increased-intracranial-pressure-nursing-priorities", "/blog/seizure-disorders-treatment-nursing-care"],
    faqs: [
      ["What time matters in suspected stroke?", "Last known well time matters because it affects treatment eligibility."],
      ["Why is CT important before thrombolytic therapy?", "Bleeding must be excluded before reperfusion treatment is considered."],
    ],
    references: ["Powers, W. J., et al. (2019). Guidelines for early management of acute ischemic stroke. Stroke.", "Greenberg, S. M., et al. (2022). Guideline for spontaneous intracerebral hemorrhage. Stroke.", "American Heart Association/American Stroke Association. (2024). Stroke warning signs and treatment resources."],
  },
  {
    slug: "increased-intracranial-pressure-nursing-priorities",
    title: "Increased Intracranial Pressure: Nursing Priorities and Monitoring",
    seoTitle: "Increased intracranial pressure nursing priorities | NurseNest",
    excerpt:
      "Use neuro trends, Cushing triad, pupil changes, positioning, airway protection, seizure precautions, and osmotherapy concepts to answer ICP items.",
    category: "Neurological Disorders",
    tags: ["ICP", "Cushing Triad", "Neuro Checks", "NCLEX-RN", "REx-PN", "Traumatic Brain Injury", "Mannitol"],
    focus:
      "Increased intracranial pressure means pressure inside the skull is rising enough to threaten brain perfusion. Because the skull is rigid, swelling, blood, tumor, hydrocephalus, or trauma can reduce perfusion and lead to herniation if not treated.",
    assessments: ["level of consciousness and new restlessness or confusion", "pupil size, equality, reactivity, and motor response", "headache, vomiting, seizure activity, and Cushing triad", "blood pressure, bradycardia, irregular respirations, and oxygenation", "drain output or ICP monitor values if present"],
    priorities: ["protect airway and oxygenation", "elevate head of bed as ordered and keep neck midline", "reduce clustered stimulation when appropriate", "prepare for osmotic therapy, imaging, or surgical intervention as ordered", "avoid hypotension and hypoxia because both worsen brain injury"],
    traps: ["waiting for full Cushing triad before acting", "placing the neck flexed or obstructing venous drainage", "treating agitation as behavioral before neuro assessment", "forgetting seizure precautions"],
    internalLinks: ["/blog/stroke-ischemic-vs-hemorrhagic-nursing-care", "/blog/seizure-disorders-treatment-nursing-care", "/blog/hyponatremia-symptoms-causes-nursing-priorities"],
    faqs: [
      ["What is Cushing triad?", "Hypertension with widening pulse pressure, bradycardia, and irregular respirations is a late sign of increased ICP."],
      ["What early change can signal ICP?", "A change in level of consciousness is often one of the most important early warning signs."],
    ],
    references: ["Brain Trauma Foundation. (2016). Guidelines for the management of severe traumatic brain injury.", "Greenberg, S. M., et al. (2022). Guideline for spontaneous intracerebral hemorrhage. Stroke.", "Neurocritical Care Society. (2020). Guidelines for acute treatment of cerebral edema."],
  },
  {
    slug: "seizure-disorders-treatment-nursing-care",
    title: "Seizure Disorders: Treatment Themes and Nursing Care",
    seoTitle: "Seizure disorders nursing care treatment and NCLEX priorities | NurseNest",
    excerpt:
      "Differentiate seizure types, protect patients during events, recognize status epilepticus, support medication adherence, and apply exam-safe priorities.",
    category: "Neurological Disorders",
    tags: ["Seizures", "Epilepsy", "Status Epilepticus", "NCLEX-RN", "REx-PN", "Airway", "Anticonvulsants"],
    focus:
      "A seizure is abnormal excessive neuronal activity. Epilepsy means recurrent unprovoked seizures, but exams also include provoked seizures from fever, sodium disorders, hypoglycemia, alcohol withdrawal, infection, or brain injury. The nurse's first job is safety and observation, not forcing control of movement.",
    assessments: ["onset, duration, movements, gaze, awareness, incontinence, cyanosis, and recovery", "airway, breathing, oxygenation, injury, and aspiration risk", "glucose, sodium, medication levels, infection, pregnancy, or withdrawal triggers", "postictal confusion and return to baseline", "adherence, sleep deprivation, alcohol use, and driving/work safety teaching needs"],
    priorities: ["protect from injury and ease the patient to the floor if needed", "turn side-lying when possible and maintain airway safety", "do not put anything in the mouth or restrain limbs", "time the seizure and call for help if prolonged or repeated", "administer rescue benzodiazepine or antiseizure medication as prescribed"],
    traps: ["putting a tongue blade in the mouth", "restraining movement", "leaving the patient alone to get supplies", "missing status epilepticus as an emergency"],
    internalLinks: ["/blog/hyponatremia-symptoms-causes-nursing-priorities", "/blog/hypocalcemia-vs-hypercalcemia-nclex-guide", "/blog/increased-intracranial-pressure-nursing-priorities"],
    faqs: [
      ["What should the nurse do during a seizure?", "Protect the patient from injury, maintain airway safety, time the event, and avoid restraining or placing objects in the mouth."],
      ["When is a seizure an emergency?", "A prolonged seizure, repeated seizures without recovery, injury, pregnancy, diabetes, or airway compromise requires urgent escalation."],
    ],
    references: ["International League Against Epilepsy. (2022). Epilepsy classification and clinical resources.", "National Institute for Health and Care Excellence. (2022). Epilepsies in children, young people and adults.", "Epilepsy Foundation. (2024). Seizure first aid."],
  },
];

const bySlug = new Map(topics.map((t) => [t.slug, t]));
const targetSlugs = process.argv.filter((a) => a.startsWith("--slug=")).map((a) => a.slice("--slug=".length));
const selected = targetSlugs.length ? targetSlugs.map((s) => bySlug.get(s)).filter((x): x is Topic => Boolean(x)) : topics;
const publish = process.argv.includes("--publish");

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function list(items: string[]): string {
  return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function proseList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function article(t: Topic): string {
  const cta =
    "Practice this topic inside NurseNest premium lessons with adaptive rationales, priority-setting drills, and mixed clinical judgment questions. Use the article as your concept map, then move into timed questions so recognition becomes automatic under exam pressure.";
  const paragraphs = [
    `<p>${esc(t.focus)} This guide is written for RN and RPN learners preparing for NCLEX-RN or REx-PN style questions. The goal is not to replace local policy or provider judgment; it is to help you recognize the clinical pattern, choose the safest nursing priority, and avoid distractors that sound familiar but do not match the patient in front of you.</p>`,
    `<p>${esc(t.contrast ?? "The key exam move is to separate the underlying mechanism from the visible symptom.")} When a stem gives you labs, medications, vital signs, and a short patient story, pause long enough to ask what problem is threatening oxygenation, perfusion, neurologic safety, or medication safety first.</p>`,
    `<h2>Pathophysiology in nursing language</h2>`,
    `<p>The pathophysiology matters because it predicts what will change next. In this topic, the highest-yield concept is: ${esc(t.focus)} A nurse does not need to make a medical diagnosis independently on an exam item, but the nurse does need to notice when the pattern is becoming unstable and communicate that change clearly.</p>`,
    `<p>Think in paired questions: What is the body failing to regulate, and what bedside sign would prove the problem is getting worse? For ${esc(t.title.toLowerCase())}, useful clues include ${esc(proseList(t.assessments.slice(0, 4)))}. These findings are stronger together than alone. One abnormal value may be a distractor; a trend that matches the story is usually the exam writer's signal.</p>`,
    `<h2>Assessment cues that should change your priority</h2>`,
    `<p>Start with airway, breathing, circulation, disability, and exposure, then narrow to the disorder. High-quality nursing questions often include one stable finding and one dangerous finding. Your job is to choose the finding that can harm the patient soonest.</p>`,
    list(t.assessments),
    `<p>For NCLEX-RN and REx-PN, assessment is not passive data collection. It is how you decide whether to call the provider, activate a protocol, hold a medication, prepare equipment, institute precautions, or keep teaching. If the patient has new confusion, respiratory distress, shock signs, seizure activity, active bleeding, or a rapidly worsening trend, the safest answer usually moves toward immediate assessment and escalation.</p>`,
    `<h2>Nursing priorities</h2>`,
    `<p>Once the pattern is recognized, prioritize the intervention that protects life and prevents predictable harm. In many stems, the correct answer is not the most advanced treatment; it is the nursing action that keeps the patient safe while the team evaluates and treats the cause.</p>`,
    list(t.priorities),
    `<p>Notice the verbs in strong nursing answers: assess, monitor, hold, clarify, report, prepare, protect, administer as prescribed, and teach after stabilization. Avoid answer choices that ask the nurse to diagnose beyond scope, independently change a high-risk therapy, or delay urgent escalation for routine education.</p>`,
    `<h2>NCLEX nursing priorities and clinical judgment</h2>`,
    `<p>Use the clinical judgment sequence: recognize cues, analyze cues, prioritize hypotheses, generate solutions, take action, and evaluate outcomes. For this topic, the most testable cues are ${esc(proseList(t.assessments.slice(0, 3)))}. The most testable actions are ${esc(proseList(t.priorities.slice(0, 3)))}.</p>`,
    `<p>Evaluation is where many students stop too early. After an intervention, ask what should improve and what could worsen. Oxygen saturation, mental status, urine output, pain, blood pressure, rhythm, lab trends, and patient understanding may all be relevant depending on the scenario. A safe nurse reassesses, documents the response, and escalates if the patient does not improve.</p>`,
    `<h2>Common exam traps</h2>`,
    `<p>Distractors usually contain a true fact applied at the wrong time. A diet teaching point can be true and still be wrong if the patient is unstable. A medication fact can be true and still be unsafe if the relevant vital sign or lab has not been checked.</p>`,
    list(t.traps),
    `<p>When two answer choices both look reasonable, compare immediacy. Which option prevents the worst likely complication in the next few minutes to hours? Which option stays inside nursing scope? Which option matches the actual data in the stem rather than a memorized association?</p>`,
    `<h2>How to study this topic without memorizing isolated facts</h2>`,
    `<p>Build a one-page comparison table with four columns: mechanism, expected assessment cues, labs or monitoring, and first nursing response. Fill it from memory, then check it against the article. This forces you to connect cause and consequence instead of collecting disconnected facts. For ${esc(t.title.toLowerCase())}, start the table with ${esc(proseList(t.assessments.slice(0, 2)))} and then add the action that would keep the patient safest if those cues worsened.</p>`,
    `<p>Next, write two short clinical stems: one stable patient who needs teaching and one unstable patient who needs immediate assessment or escalation. The stable stem should reward education, adherence, follow-up, and risk reduction. The unstable stem should reward airway, breathing, circulation, neurologic safety, medication safety, or rapid communication. Practicing both prevents a common exam mistake: choosing a correct teaching point when the patient is already showing a priority problem.</p>`,
    `<h2>RN and RPN scope reminders</h2>`,
    `<p>RN/RPN exam questions expect safe delegation and escalation. The nurse can recognize risk, collect focused data, initiate standing protocols within policy, administer prescribed therapy, hold and clarify unsafe medications, and teach the patient. The nurse should not independently diagnose the disorder, prescribe a new medication, change a high-risk infusion without an order or protocol, or delay urgent care while completing routine tasks.</p>`,
    `<p>When delegation appears, keep unstable assessment, first-time teaching, clinical judgment, and evaluation with the nurse. Tasks such as obtaining routine vital signs or helping with hygiene may be delegated only when the patient is stable and the task fits the team member's role. If a delegated finding returns abnormal, the nurse reassesses and decides the next safe action.</p>`,
    `<h2>Suggested internal links</h2>`,
    `<ul>${t.internalLinks.map((href) => `<li><a href="${href}">${href.replace("/blog/", "").replace(/-/g, " ")}</a></li>`).join("")}</ul>`,
    `<h2>Premium lesson CTA</h2>`,
    `<p>${cta}</p>`,
    `<h2>FAQ schema questions</h2>`,
    ...t.faqs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`),
    `<h2>APA-7 references</h2>`,
    `<ul>${t.references.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>`,
    `<p><strong>Clinical safety note:</strong> This content supports exam preparation and clinical reasoning practice. It does not provide individualized diagnosis, treatment, or medication instructions. In practice, follow current orders, facility policy, and escalation pathways.</p>`,
  ];
  return paragraphs.join("\n\n");
}

function md(t: Topic): string {
  return `---
slug: ${t.slug}
title: ${t.title}
excerpt: ${t.excerpt}
category: ${t.category}
tags: ${t.tags.join(", ")}
publishedAt: ${today}
createdAt: ${today}
updatedAt: ${today}
seoTitle: ${t.seoTitle}
seoDescription: ${t.excerpt}
canonicalUrl: /blog/${t.slug}
medicalDisclaimer: ${disclaimer}
authorDisplayName: NurseNest Editorial Team
medicalReviewerName: NurseNest Clinical Review
draft: ${publish ? "false" : "true"}
---

${article(t)}
`;
}

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const dir = join(appRoot, "src", "content", "blog-static-longtail");
mkdirSync(dir, { recursive: true });
for (const t of selected) {
  writeFileSync(join(dir, `${t.slug}.md`), md(t), "utf8");
  console.log(`${publish ? "published" : "draft"} ${t.slug}`);
}
