import type { FlashcardData } from "./flashcards-rpn";

export const rnPathoCardioNeuroFlashcards: FlashcardData[] = [
  // ============================================================
  // MYOCARDIAL INFARCTION (25 cards)
  // ============================================================
  {
    id: "rn-pcn-mi-1",
    type: "question",
    question: "A patient with acute STEMI develops hypotension and JVD after nitroglycerin. ECG shows ST elevation in II, III, aVF. What should the nurse do FIRST?",
    options: ["Administer another dose of nitroglycerin", "Stop nitroglycerin and give IV normal saline bolus", "Prepare for pericardiocentesis", "Administer furosemide IV"],
    correctIndex: 1,
    answer: "Inferior STEMI with hypotension and JVD after NTG suggests right ventricular infarction. The RV is preload-dependent; NTG reduces preload causing severe hypotension. IV fluid resuscitation is the priority. Always check V4R in inferior MI.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-2",
    type: "question",
    question: "Which troponin pattern indicates acute MI versus chronic elevation?",
    options: ["Any troponin above normal", "A rise and/or fall pattern with at least one value above the 99th percentile", "Troponin I above 10 ng/mL", "CK-MB elevation alone"],
    correctIndex: 1,
    answer: "The universal definition of MI requires a dynamic rise and/or fall pattern in troponin with at least one value above the 99th percentile URL, plus clinical evidence of ischemia. Chronic conditions (CKD, HF) can cause stable elevated troponin without dynamic change.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-3",
    type: "question",
    question: "A nurse notes a new holosystolic murmur with a thrill at the left sternal border on day 4 post-MI. What complication is suspected?",
    options: ["Dressler syndrome", "Ventricular septal defect", "Pulmonary embolism", "Mitral valve prolapse"],
    correctIndex: 1,
    answer: "A new holosystolic murmur with a thrill at the left sternal border 3-5 days post-MI suggests ventricular septal rupture. Necrotic septum ruptures creating a left-to-right shunt requiring emergent surgical repair.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-4",
    type: "question",
    question: "What is the target door-to-balloon time for STEMI patients undergoing primary PCI?",
    options: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    correctIndex: 2,
    answer: "The target door-to-balloon time for STEMI is less than 90 minutes. This is the time from arrival to balloon inflation during PCI. Delays beyond 90 minutes significantly increase mortality and infarct size.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-5",
    type: "question",
    question: "Why should aspirin 325 mg be chewed rather than swallowed whole during acute MI?",
    options: ["It tastes better", "Buccal absorption provides faster antiplatelet effect", "It prevents nausea", "It reduces GI bleeding risk"],
    correctIndex: 1,
    answer: "Chewing aspirin allows rapid buccal absorption, achieving antiplatelet effect within 15-20 minutes versus 60+ minutes if swallowed whole. In acute MI, every minute of platelet inhibition delay matters. Aspirin reduces MI mortality by 23%.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-6",
    type: "question",
    question: "A patient is 2 hours post-PCI for STEMI. The nurse notes accelerated idioventricular rhythm (AIVR) at 72 bpm. BP is 118/74. What action is appropriate?",
    options: ["Prepare for cardioversion", "Administer amiodarone", "Continue monitoring — AIVR is a reperfusion arrhythmia", "Call a rapid response"],
    correctIndex: 2,
    answer: "AIVR at 60-100 bpm is a benign reperfusion arrhythmia indicating successful PCI. It does not require treatment if the patient is hemodynamically stable. It results from re-energized but transiently electrically unstable myocardium.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-7",
    type: "question",
    question: "Which cardiac biomarker rises earliest after myocardial infarction?",
    options: ["Troponin I", "CK-MB", "Myoglobin", "BNP"],
    correctIndex: 2,
    answer: "Myoglobin rises within 1-2 hours of MI onset, making it the earliest biomarker. However, it is nonspecific (released from any skeletal muscle damage). Troponin rises at 3-4 hours and is the preferred diagnostic marker due to cardiac specificity.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-8",
    type: "question",
    question: "ST elevation in leads V1-V4 indicates infarction in which coronary artery territory?",
    options: ["Right coronary artery", "Left anterior descending artery", "Left circumflex artery", "Posterior descending artery"],
    correctIndex: 1,
    answer: "ST elevation in V1-V4 indicates an anterior wall MI involving the left anterior descending (LAD) artery territory. Anterior MIs are the most dangerous due to large myocardial territory — they carry the highest risk of cardiogenic shock and death.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-9",
    type: "question",
    question: "A patient on ticagrelor asks why they must take aspirin 81 mg instead of 325 mg. What is the correct explanation?",
    options: ["Cost savings", "Higher aspirin doses reduce ticagrelor effectiveness", "325 mg causes more headaches", "81 mg works faster"],
    correctIndex: 1,
    answer: "Ticagrelor's effectiveness is reduced when combined with aspirin doses >100 mg. The PLATO trial demonstrated inferior outcomes with higher aspirin doses. The recommended combination is ticagrelor with low-dose aspirin (81 mg).",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-10",
    type: "question",
    question: "What is the antidote for heparin overdose?",
    options: ["Vitamin K", "Protamine sulfate", "Fresh frozen plasma", "Aminocaproic acid"],
    correctIndex: 1,
    answer: "Protamine sulfate is the specific antidote for heparin. It binds heparin to form an inactive complex. Dose: 1 mg protamine per 100 units of heparin given in the last 2-3 hours. Vitamin K reverses warfarin, not heparin.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-11",
    type: "question",
    question: "A patient post-MI develops sudden pulseless electrical activity (PEA) on day 5. What mechanical complication should be suspected?",
    options: ["Papillary muscle rupture", "Left ventricular free wall rupture", "Ventricular aneurysm", "Pericardial effusion from Dressler syndrome"],
    correctIndex: 1,
    answer: "Sudden PEA arrest 3-7 days post-MI strongly suggests left ventricular free wall rupture with cardiac tamponade. The weakened necrotic wall ruptures, filling the pericardium with blood and causing immediate hemodynamic collapse.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-12",
    type: "question",
    question: "When should oxygen be administered to a patient with acute MI?",
    options: ["Routinely to all MI patients at 4 L/min", "Only if SpO2 is below 94%", "Only if the patient requests it", "Never during acute MI"],
    correctIndex: 1,
    answer: "Current AHA guidelines recommend supplemental oxygen only when SpO2 is <94%. Routine oxygen in normoxemic MI patients may cause coronary vasoconstriction through reactive oxygen species and does not improve outcomes.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-13",
    type: "question",
    question: "The Killip classification system for MI categorizes patients based on what finding?",
    options: ["ECG changes", "Troponin levels", "Signs of heart failure severity", "Coronary anatomy"],
    correctIndex: 2,
    answer: "Killip classification predicts MI mortality based on heart failure severity: I (no HF signs), II (crackles, S3), III (frank pulmonary edema), IV (cardiogenic shock). Higher Killip class = higher mortality.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-14",
    type: "question",
    question: "Which medication should be avoided within 24 hours of taking sildenafil (Viagra) in a patient with chest pain?",
    options: ["Aspirin", "Nitroglycerin", "Metoprolol", "Heparin"],
    correctIndex: 1,
    answer: "Nitroglycerin is absolutely contraindicated within 24-48 hours of PDE5 inhibitor use (sildenafil, tadalafil). The combination causes severe, potentially fatal hypotension through synergistic vasodilation via the nitric oxide-cGMP pathway.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-15",
    type: "question",
    question: "At the cellular level, what causes myocyte death during MI?",
    options: ["Excess oxygen supply", "ATP depletion from anaerobic metabolism leading to calcium overload and enzyme activation", "Increased cardiac output", "Enhanced mitochondrial function"],
    correctIndex: 1,
    answer: "Ischemia forces anaerobic metabolism, dropping ATP from 36 to 2 per glucose. The Na+/K+ pump fails, calcium floods the cell, activating phospholipases and proteases that digest cellular membranes and contractile proteins, causing irreversible necrosis.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-16",
    type: "question",
    question: "What does reperfusion injury refer to after PCI for STEMI?",
    options: ["Injury from the catheter during PCI", "Additional damage from reactive oxygen species when blood flow is restored", "Bleeding at the puncture site", "Contrast-induced nephropathy"],
    correctIndex: 1,
    answer: "Reperfusion injury occurs when restored blood flow generates reactive oxygen species (superoxide, hydroxyl radicals) that cause additional oxidative damage. Calcium overload worsens, and activated neutrophils release inflammatory mediators causing further tissue damage.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-17",
    type: "question",
    question: "A patient with chest pain describes it as sharp, worsening with deep breathing and relieved by sitting forward. This is most consistent with:",
    options: ["Acute MI", "Pericarditis", "Pulmonary embolism", "Aortic dissection"],
    correctIndex: 1,
    answer: "Pleuritic chest pain that worsens with breathing and improves with sitting forward is classic for pericarditis, not MI. MI pain is typically pressure-like, radiating to arm/jaw, and not positional. Dressler syndrome (post-MI pericarditis) occurs days to weeks after MI.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-18",
    type: "question",
    question: "Which monitoring site should the nurse assess post-cardiac catheterization via the femoral artery?",
    options: ["Bilateral radial pulses", "The puncture site, distal pulses, and neurovascular status of the affected leg", "Chest X-ray only", "Abdominal assessment"],
    correctIndex: 1,
    answer: "Post-femoral catheterization requires monitoring the puncture site for bleeding/hematoma, distal pulses (pedal, posterior tibial), and neurovascular checks (color, temperature, sensation, motor function) of the affected extremity to detect vascular complications.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-19",
    type: "question",
    question: "What is the ischemic penumbra in the context of MI?",
    options: ["The area of complete necrosis", "Borderline viable tissue surrounding the infarct core that can be salvaged with reperfusion", "The coronary artery plaque", "The pericardial space"],
    correctIndex: 1,
    answer: "The ischemic penumbra is tissue surrounding the infarct core that receives marginal blood flow from collateral circulation. It is functionally impaired but structurally intact and potentially salvageable with timely reperfusion — this is the target of emergent PCI.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-20",
    type: "question",
    question: "A patient on morphine for MI pain develops nausea, hypotension (BP 82/56), and respiratory depression. What is the priority action?",
    options: ["Administer another dose of morphine", "Stop morphine, support airway, administer naloxone if needed", "Position flat and reassess", "Administer ondansetron only"],
    correctIndex: 1,
    answer: "Morphine can cause hypotension (vasodilation) and respiratory depression. Current guidelines caution against routine morphine use in ACS. Priority: stop the drug, support airway/breathing, administer naloxone for respiratory depression, and IV fluids for hypotension.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-21",
    type: "question",
    question: "An ACE inhibitor should be started within 24 hours of MI in which specific situations?",
    options: ["All MI patients regardless of location", "Anterior MI or ejection fraction <40%", "Only if blood pressure is elevated", "Only posterior MI"],
    correctIndex: 1,
    answer: "ACE inhibitors are specifically indicated within 24 hours for anterior MI (largest infarct territory) or when EF <40%. They prevent adverse ventricular remodeling by blocking angiotensin II-mediated fibrosis and hypertrophy.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-22",
    type: "question",
    question: "What does the wavefront phenomenon describe in MI pathophysiology?",
    options: ["ECG wave pattern changes", "Necrosis progressing from endocardium to epicardium over 3-6 hours", "Blood flow through collateral vessels", "The reperfusion wave after PCI"],
    correctIndex: 1,
    answer: "The wavefront phenomenon describes how myocardial necrosis progresses from the endocardium (most vulnerable, highest O2 demand, least collateral flow) outward toward the epicardium over 3-6 hours. This is why early reperfusion limits infarct size.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-mi-23",
    type: "question",
    question: "A woman presents with fatigue, nausea, jaw pain, and dyspnea without typical chest pressure. What should the nurse suspect?",
    options: ["Anxiety disorder", "Atypical MI presentation", "Gastroesophageal reflux", "Panic attack"],
    correctIndex: 1,
    answer: "Women and diabetic patients frequently present with atypical MI symptoms: fatigue, dyspnea, nausea, epigastric pain, and jaw/back pain instead of classic substernal chest pressure. A high index of suspicion is essential to avoid missed diagnoses.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-mi-24",
    type: "question",
    question: "What is the mechanism by which beta-blockers reduce myocardial oxygen demand?",
    options: ["Vasodilation of coronary arteries", "Decreasing heart rate and contractility", "Increasing preload", "Enhancing platelet aggregation"],
    correctIndex: 1,
    answer: "Beta-blockers reduce myocardial oxygen demand by blocking beta-1 receptors: decreasing heart rate (less time in systole), reducing contractility (less force generation), and lowering blood pressure (less afterload). This shifts the supply-demand balance favorably.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-mi-25",
    type: "question",
    question: "A patient develops HIT (heparin-induced thrombocytopenia) during MI treatment. What is the priority nursing action?",
    options: ["Increase the heparin dose", "Stop all heparin products immediately and notify the provider", "Switch to warfarin immediately", "Continue heparin and monitor platelets"],
    correctIndex: 1,
    answer: "HIT is an immune-mediated reaction causing thrombocytopenia AND paradoxical thrombosis. ALL heparin must be stopped immediately (including flushes). An alternative anticoagulant (argatroban, bivalirudin) is started. Do NOT start warfarin until platelets recover.",
    category: "Cardiovascular",
    difficulty: 2
  },

  // ============================================================
  // HEART FAILURE (25 cards)
  // ============================================================
  {
    id: "rn-pcn-hf-1",
    type: "question",
    question: "Which heart sound distinguishes HFrEF from HFpEF?",
    options: ["S1 splitting", "S3 (HFrEF) vs S4 (HFpEF)", "Pericardial friction rub", "Aortic ejection click"],
    correctIndex: 1,
    answer: "S3 gallop = rapid ventricular filling into a dilated, volume-overloaded ventricle (HFrEF/systolic failure). S4 gallop = forceful atrial contraction against a stiff, noncompliant ventricle (HFpEF/diastolic failure). This is a high-yield NCLEX distinction.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-2",
    type: "question",
    question: "A patient with HFrEF has a sodium level of 126 mEq/L. What is the appropriate intervention?",
    options: ["Administer IV normal saline", "Restrict fluids to 1.5 L/day", "Give hypertonic saline", "Encourage increased oral sodium"],
    correctIndex: 1,
    answer: "Hyponatremia in HF is dilutional — excess free water relative to sodium. Treatment is fluid restriction (1.5 L/day), NOT sodium replacement. Normal saline would worsen volume overload. Hypertonic saline is dangerous in HF.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-3",
    type: "question",
    question: "What is the most sensitive daily indicator of fluid status change in heart failure?",
    options: ["Blood pressure", "Serum sodium", "Daily weight", "Urine output"],
    correctIndex: 2,
    answer: "Daily weight is the most sensitive indicator of fluid status change. 1 kg = approximately 1 liter of fluid. Weight gain >2 lbs/day or >5 lbs/week indicates fluid retention and requires provider notification.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-4",
    type: "question",
    question: "What are the four pillars of guideline-directed medical therapy (GDMT) for HFrEF?",
    options: ["Aspirin, statin, beta-blocker, ACEi", "ACEi/ARB/ARNI + evidence-based beta-blocker + MRA + SGLT2i", "Diuretic + digoxin + ACEi + statin", "Calcium channel blocker + diuretic + ARB + statin"],
    correctIndex: 1,
    answer: "The four pillars of GDMT for HFrEF are: ACEi/ARB/ARNI (neurohormonal blockade) + evidence-based beta-blocker (carvedilol, metoprolol succinate, or bisoprolol) + MRA (spironolactone/eplerenone) + SGLT2 inhibitor. Each independently reduces mortality.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-5",
    type: "question",
    question: "Why should a beta-blocker NEVER be started during acute decompensated heart failure?",
    options: ["It causes hyperkalemia", "Negative inotropic effect worsens acute heart failure by further reducing cardiac output", "It increases heart rate", "It causes renal failure"],
    correctIndex: 1,
    answer: "Beta-blockers reduce heart rate and contractility (negative inotropy and chronotropy). During acute decompensation, the heart depends on sympathetic drive to maintain output. Blocking this during crisis worsens cardiogenic shock. Stabilize with diuretics first, then start low-dose when euvolemic.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-6",
    type: "question",
    question: "A patient on sacubitril/valsartan (Entresto) needs BNP monitoring. Which marker should the nurse use?",
    options: ["BNP", "NT-proBNP", "Troponin", "CRP"],
    correctIndex: 1,
    answer: "Sacubitril inhibits neprilysin, which normally degrades BNP. This causes falsely elevated BNP levels. NT-proBNP is NOT a neprilysin substrate and provides accurate monitoring of heart failure status in patients on Entresto.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-hf-7",
    type: "question",
    question: "A patient on furosemide has minimal urine output after 2 hours. The nurse anticipates the provider will:",
    options: ["Switch to oral furosemide", "Add metolazone before the next furosemide dose", "Discontinue diuretics", "Increase IV fluids"],
    correctIndex: 1,
    answer: "Diuretic resistance is managed by sequential nephron blockade: adding a thiazide (metolazone) 30 minutes before the loop diuretic blocks sodium reabsorption at two different nephron sites, producing synergistic diuresis.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-hf-8",
    type: "question",
    question: "What is the neurohormonal cascade that perpetuates heart failure?",
    options: ["Parasympathetic activation only", "SNS activation → RAAS activation → ADH release → sodium/water retention → worsening cardiac remodeling", "Decreased renin release", "Enhanced natriuretic peptide response"],
    correctIndex: 1,
    answer: "The maladaptive neurohormonal cascade: decreased CO → sympathetic activation (tachycardia, vasoconstriction) → decreased renal perfusion → RAAS activation (angiotensin II, aldosterone) → sodium/water retention, fibrosis, remodeling → worsening CO. A vicious cycle.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-9",
    type: "question",
    question: "Which 3 beta-blockers have evidence-based mortality benefit in HFrEF?",
    options: ["Atenolol, propranolol, labetalol", "Carvedilol, metoprolol succinate, bisoprolol", "Metoprolol tartrate, nadolol, esmolol", "Sotalol, nebivolol, acebutolol"],
    correctIndex: 1,
    answer: "Only carvedilol, metoprolol succinate (NOT tartrate), and bisoprolol have demonstrated mortality reduction in HFrEF clinical trials. Other beta-blockers should not be substituted as there is no evidence they provide the same benefit.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-10",
    type: "question",
    question: "A patient with HF reports waking up at night gasping for air and needing to sit up to breathe. These symptoms describe:",
    options: ["Sleep apnea only", "Paroxysmal nocturnal dyspnea (PND) and orthopnea", "Anxiety attacks", "Asthma exacerbation"],
    correctIndex: 1,
    answer: "PND (waking up gasping) and orthopnea (need to sit up/use pillows to breathe) are classic left-sided HF symptoms. Fluid redistributes to the lungs when supine, causing pulmonary congestion and dyspnea. These are key assessment findings.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-11",
    type: "question",
    question: "Why is milrinone preferred over dobutamine in a patient on chronic beta-blocker therapy?",
    options: ["Milrinone is cheaper", "Milrinone works via PDE-3 inhibition, independent of beta receptors", "Dobutamine is more potent", "Milrinone has fewer side effects"],
    correctIndex: 1,
    answer: "Milrinone inhibits phosphodiesterase-3, increasing cAMP independently of beta receptors. Dobutamine acts through beta-1 receptors, which are downregulated by chronic beta-blocker therapy, making it less effective. Milrinone bypasses this limitation.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-hf-12",
    type: "question",
    question: "What is the difference between ACC/AHA staging (A-D) and NYHA classification (I-IV)?",
    options: ["They are the same system", "ACC/AHA staging is irreversible (progressive); NYHA classification fluctuates with treatment", "NYHA is permanent; ACC/AHA changes", "Both systems are reversible"],
    correctIndex: 1,
    answer: "ACC/AHA staging (A-D) reflects irreversible structural progression — patients never regress to an earlier stage. NYHA functional classification (I-IV) reflects current symptom burden and can improve or worsen with treatment changes.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-13",
    type: "question",
    question: "Which assessment finding indicates right-sided heart failure?",
    options: ["Crackles on auscultation", "Pink frothy sputum", "Jugular venous distension and peripheral edema", "Orthopnea"],
    correctIndex: 2,
    answer: "Right-sided HF causes systemic venous congestion: JVD, hepatomegaly, hepatojugular reflux, peripheral edema (ankles, sacrum), ascites, and weight gain. Left-sided HF causes pulmonary congestion: crackles, dyspnea, orthopnea, pink frothy sputum.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-14",
    type: "question",
    question: "A patient with HFrEF is on lisinopril, carvedilol, and furosemide. Spironolactone is added. Which lab is most critical to monitor?",
    options: ["Sodium", "Potassium", "Calcium", "Magnesium"],
    correctIndex: 1,
    answer: "Spironolactone (potassium-sparing) + lisinopril (ACEi, also potassium-sparing) = high risk of life-threatening hyperkalemia. Potassium must be checked within 1 week of initiation and regularly thereafter. Hold if K+ >5.0 mEq/L.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-15",
    type: "question",
    question: "What is the Frank-Starling mechanism and how does it fail in HFrEF?",
    options: ["A reflex that increases blood pressure", "As preload increases, contractile force increases — but in HFrEF, the curve is flattened and depressed", "A mechanism that controls heart rate", "A valve function that prevents regurgitation"],
    correctIndex: 1,
    answer: "Frank-Starling: stretching sarcomeres (increased preload) normally increases contractile force. In HFrEF, the curve is depressed — increasing preload beyond a certain point no longer augments stroke volume and instead causes pulmonary congestion.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-hf-16",
    type: "question",
    question: "What common trigger precipitates acute decompensated heart failure most frequently?",
    options: ["Cold weather exposure", "Dietary sodium excess and medication non-adherence", "Exercise", "Emotional stress only"],
    correctIndex: 1,
    answer: "The most common triggers for HF decompensation are dietary sodium excess and medication non-adherence, followed by infection, arrhythmias (especially new AF), and uncontrolled hypertension. Patient education on these triggers is essential.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-17",
    type: "question",
    question: "An SGLT2 inhibitor (empagliflozin) is prescribed for a patient with HFrEF who does NOT have diabetes. Is this appropriate?",
    options: ["No, SGLT2i are only for diabetic patients", "Yes, SGLT2i reduce HF hospitalization and CV death regardless of diabetes status", "Only if the patient also has CKD", "Only for HFpEF, not HFrEF"],
    correctIndex: 1,
    answer: "SGLT2 inhibitors (empagliflozin, dapagliflozin) reduce HF hospitalization and CV death in HFrEF regardless of diabetes status (EMPEROR-Reduced, DAPA-HF trials). They are the fourth pillar of GDMT and also benefit HFpEF.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-18",
    type: "question",
    question: "What is the mandatory washout period when switching from an ACE inhibitor to sacubitril/valsartan (Entresto)?",
    options: ["No washout needed", "36 hours", "72 hours", "7 days"],
    correctIndex: 1,
    answer: "A 36-hour washout from ACEi is required before starting Entresto. Concurrent use of sacubitril (neprilysin inhibitor) and ACEi dramatically increases the risk of life-threatening angioedema due to excessive bradykinin accumulation.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-19",
    type: "question",
    question: "Which finding indicates cardiorenal syndrome in a patient being diuresed for HF?",
    options: ["Decreased BNP", "Rising creatinine during aggressive diuresis", "Improved exercise tolerance", "Stable weight"],
    correctIndex: 1,
    answer: "Cardiorenal syndrome describes bidirectional heart-kidney dysfunction. Rising creatinine during diuresis indicates reduced renal perfusion from decreased preload. The clinical challenge is balancing decongestion with maintaining adequate renal perfusion.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-20",
    type: "question",
    question: "A patient with heart failure develops pink frothy sputum. What does this indicate?",
    options: ["Upper respiratory infection", "Acute pulmonary edema", "Pneumonia", "Bronchitis"],
    correctIndex: 1,
    answer: "Pink frothy sputum indicates acute pulmonary edema — a medical emergency. Elevated left ventricular pressure causes fluid to flood the alveoli, mixing with surfactant and blood to create frothy pink secretions. Requires emergent IV diuretics, oxygen, and possibly NIPPV.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-21",
    type: "question",
    question: "What HF zone system should the nurse teach patients for self-management?",
    options: ["Red/yellow/blue zones", "Green (stable) / Yellow (caution: weight gain, increased dyspnea) / Red (emergency: severe SOB, chest pain)", "Zones 1-5 based on EF", "No zone system exists"],
    correctIndex: 1,
    answer: "The HF zone system helps patients self-monitor: Green = stable (take meds, weigh daily). Yellow = caution (weight gain >2 lbs/day, increased swelling/dyspnea — call provider). Red = emergency (severe SOB, chest pain, confusion — call 911).",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-22",
    type: "question",
    question: "Why is atrial fibrillation particularly dangerous in HFpEF?",
    options: ["It causes bradycardia", "Loss of the atrial kick reduces ventricular filling by 20-30% in an already stiff ventricle", "It only affects the right ventricle", "It lowers blood pressure too much"],
    correctIndex: 1,
    answer: "In HFpEF, the ventricle is stiff and noncompliant. Atrial contraction (atrial kick) contributes 20-30% of ventricular filling. AF eliminates this contribution, causing disproportionate hemodynamic compromise and acute decompensation.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-hf-23",
    type: "question",
    question: "What dietary restriction is recommended for heart failure patients?",
    options: ["Protein restriction <40 g/day", "Sodium <2 g/day", "Fat-free diet", "Carbohydrate restriction only"],
    correctIndex: 1,
    answer: "Sodium restriction to <2 g/day (2000 mg) is recommended to reduce fluid retention. Patients should be taught to read labels, avoid processed foods, and not add salt at the table. Fluid restriction (1.5 L/day) is added if sodium <130 mEq/L.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-hf-24",
    type: "question",
    question: "What is ventricular remodeling and why is it harmful?",
    options: ["Beneficial cardiac adaptation", "Progressive chamber dilation and wall thinning that worsens contractility and promotes arrhythmias", "Valve repair mechanism", "Coronary artery adaptation"],
    correctIndex: 1,
    answer: "Ventricular remodeling is a maladaptive process: chamber dilation, wall thinning, and spherical shape change reduce contractile efficiency and promote arrhythmias. GDMT (ACEi, beta-blockers, MRA) slows remodeling — the basis of chronic HF therapy.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-hf-25",
    type: "question",
    question: "A patient in HFrEF has an EF of 30%, LBBB, and QRS duration of 160 ms despite optimal GDMT. What device therapy should be anticipated?",
    options: ["Pacemaker only", "Cardiac resynchronization therapy (CRT/CRT-D)", "LVAD immediately", "No device indicated"],
    correctIndex: 1,
    answer: "CRT is indicated for HFrEF with EF ≤35%, LBBB, and QRS ≥150 ms despite 3+ months of optimal GDMT. CRT resynchronizes ventricular contraction, improving EF, symptoms, and survival. Often combined with ICD (CRT-D).",
    category: "Cardiovascular",
    difficulty: 3
  },

  // ============================================================
  // CORONARY ARTERY DISEASE (25 cards)
  // ============================================================
  {
    id: "rn-pcn-cad-1",
    type: "question",
    question: "What is the first visible lesion of atherosclerosis?",
    options: ["Fibrous plaque", "Fatty streak", "Calcified nodule", "Thrombus"],
    correctIndex: 1,
    answer: "The fatty streak is the earliest visible lesion of atherosclerosis, composed of lipid-laden macrophages (foam cells) in the arterial intima. Fatty streaks can be found in the aortas of some teenagers and may progress to more advanced plaques over decades.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-2",
    type: "question",
    question: "A patient reports chest pressure that occurs while climbing stairs and resolves with rest. This pattern has been consistent for 6 months. This describes:",
    options: ["Unstable angina", "Stable angina", "Prinzmetal angina", "Acute MI"],
    correctIndex: 1,
    answer: "Stable angina is predictable, reproducible chest discomfort at a consistent level of exertion that resolves with rest or NTG. The 6-month stable pattern confirms this is not new-onset or worsening (unstable) angina.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-3",
    type: "question",
    question: "What LDL cholesterol goal is recommended for patients with established coronary artery disease?",
    options: ["<130 mg/dL", "<100 mg/dL", "<70 mg/dL", "<200 mg/dL"],
    correctIndex: 2,
    answer: "For established CAD (secondary prevention), LDL goal is <70 mg/dL. Very high-risk patients may benefit from <55 mg/dL. High-intensity statin therapy (atorvastatin 40-80 mg or rosuvastatin 20-40 mg) is recommended.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-4",
    type: "question",
    question: "A patient reports unexplained muscle pain and dark urine while on atorvastatin. What should the nurse suspect?",
    options: ["Normal statin side effect", "Rhabdomyolysis — check CK level immediately", "Dehydration", "Urinary tract infection"],
    correctIndex: 1,
    answer: "Unexplained muscle pain with dark urine (myoglobinuria) may indicate rhabdomyolysis, a rare but serious statin complication. CK levels must be checked immediately. Dark urine suggests myoglobin release from muscle breakdown, risking acute kidney injury.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-5",
    type: "question",
    question: "Current AHA guidelines for sublingual NTG use state the patient should take how many tablets before calling 911?",
    options: ["Three tablets, 5 minutes apart", "One tablet, then call 911 if no relief in 5 minutes", "Two tablets, then call 911", "Five tablets over 25 minutes"],
    correctIndex: 1,
    answer: "Current AHA guideline: take ONE NTG tablet, and if chest pain is not relieved within 5 minutes, call 911. The old 3-tablet protocol has been replaced. This change reflects the need for earlier emergency response in potential ACS.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-6",
    type: "question",
    question: "How should sublingual nitroglycerin tablets be stored?",
    options: ["In a plastic container in the bathroom", "In the original dark glass container, replaced every 6 months", "In the refrigerator", "No special storage needed"],
    correctIndex: 1,
    answer: "NTG is light-sensitive and volatile. Store in the original dark glass container, kept closed between uses, and replace every 6 months or sooner if no tingling under the tongue. Tingling indicates potency.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-7",
    type: "question",
    question: "What differentiates unstable angina from NSTEMI?",
    options: ["Symptom duration", "Troponin levels — NSTEMI has troponin elevation indicating myocyte necrosis", "ECG findings only", "Patient age"],
    correctIndex: 1,
    answer: "Both unstable angina and NSTEMI involve acute plaque disruption with non-occlusive thrombus. The distinction is troponin: NSTEMI has elevated troponin (myocyte necrosis from prolonged ischemia), while unstable angina does not (ischemia without necrosis).",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-8",
    type: "question",
    question: "Why are statins considered anti-inflammatory in addition to lipid-lowering?",
    options: ["They reduce blood pressure", "They reduce hs-CRP, stabilize plaques, and improve endothelial function (pleiotropic effects)", "They are actually NSAIDs", "They only lower cholesterol"],
    correctIndex: 1,
    answer: "Statins have pleiotropic effects beyond lipid lowering: they reduce vascular inflammation (lower hs-CRP), stabilize vulnerable plaques (thicken fibrous cap), improve endothelial function (increase NO production), and reduce thrombogenicity.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-9",
    type: "question",
    question: "A positive exercise stress test shows ST depression ≥1 mm. What does this indicate?",
    options: ["Normal response to exercise", "Myocardial ischemia during exertion", "Prior myocardial infarction", "Pericarditis"],
    correctIndex: 1,
    answer: "ST depression ≥1 mm during exercise stress testing indicates myocardial ischemia — the myocardium is not receiving adequate blood supply to meet increased oxygen demand. This suggests significant coronary artery stenosis (typically >70%).",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-10",
    type: "question",
    question: "What is a nitrate-free interval and why is it necessary?",
    options: ["Taking extra nitrates at night", "A 10-12 hour daily period without nitrate exposure to prevent tolerance", "Stopping nitrates permanently", "Taking nitrates only with meals"],
    correctIndex: 1,
    answer: "Continuous nitrate exposure causes pharmacological tolerance (reduced effectiveness). A 10-12 hour daily nitrate-free interval (typically overnight) prevents tolerance development. Long-acting nitrates are usually given in the morning with a second dose at noon, leaving the nighttime free.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-11",
    type: "question",
    question: "What percentage of coronary artery narrowing typically causes stable angina symptoms?",
    options: [">30%", ">50%", ">70%", ">90%"],
    correctIndex: 2,
    answer: "Stable angina typically occurs when a coronary artery has >70% luminal narrowing. At this level, resting blood flow may be adequate, but the stenosis limits flow augmentation during exertion, causing the supply-demand mismatch.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-12",
    type: "question",
    question: "Oxidized LDL plays what role in atherosclerosis pathogenesis?",
    options: ["It is protective", "It triggers the inflammatory cascade, activates endothelium, and is engulfed by macrophages to form foam cells", "It lowers blood pressure", "It dissolves existing plaques"],
    correctIndex: 1,
    answer: "Oxidized LDL in the subendothelial space is highly pro-inflammatory: it activates endothelial cells (adhesion molecule expression), recruits monocytes, and is engulfed by macrophages via scavenger receptors to form foam cells — the building blocks of atherosclerotic plaques.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cad-13",
    type: "question",
    question: "Which type of atherosclerotic plaque is most likely to rupture?",
    options: ["Heavily calcified stable plaque", "Thin-cap fibroatheroma with large lipid core and active inflammation", "Small fatty streak", "Dense fibrous plaque"],
    correctIndex: 1,
    answer: "Vulnerable plaques have thin fibrous caps (<65 micrometers), large lipid-rich necrotic cores, and active inflammation with macrophage infiltration. These features make the cap prone to rupture, triggering acute thrombosis and ACS.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cad-14",
    type: "question",
    question: "A coronary calcium score of 0 on CT has what clinical significance?",
    options: ["The patient definitely has CAD", "Greater than 95% negative predictive value for obstructive CAD", "It indicates calcium deficiency", "No clinical significance"],
    correctIndex: 1,
    answer: "A coronary calcium score of 0 has >95% negative predictive value for obstructive CAD in asymptomatic patients. It indicates minimal atherosclerotic burden and is useful for risk stratification in intermediate-risk individuals.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-15",
    type: "question",
    question: "CABG surgery is preferred over PCI for which pattern of coronary artery disease?",
    options: ["Single-vessel disease", "Left main coronary artery disease or three-vessel disease", "Mild single-vessel stenosis", "Vasospastic angina"],
    correctIndex: 1,
    answer: "CABG is preferred for left main coronary artery disease and multi-vessel (3-vessel) disease, especially in diabetic patients. CABG provides more complete revascularization and better long-term outcomes in these high-risk anatomical patterns.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-16",
    type: "question",
    question: "What is the mechanism of action of ranolazine (Ranexa) for chronic angina?",
    options: ["Beta receptor blockade", "Inhibits late sodium current, reducing intracellular calcium overload without affecting HR or BP", "Calcium channel blockade", "Nitric oxide release"],
    correctIndex: 1,
    answer: "Ranolazine inhibits the late sodium current in ischemic myocytes, reducing intracellular calcium overload and improving diastolic relaxation. It does not affect heart rate or blood pressure, making it ideal as add-on therapy when beta-blockers and CCBs are maximized.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cad-17",
    type: "question",
    question: "Which modifiable risk factor for CAD, when addressed, provides the most rapid risk reduction?",
    options: ["Obesity", "Smoking cessation", "Diabetes management", "Exercise"],
    correctIndex: 1,
    answer: "Smoking cessation provides the most rapid risk reduction: within 1 year, excess cardiac risk drops by 50%. By 2-5 years, stroke risk normalizes. Smoking damages endothelium, promotes thrombosis, causes vasospasm, and increases oxidative stress.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-18",
    type: "question",
    question: "A pharmacologic stress test using adenosine or regadenoson would be used for which patients?",
    options: ["All patients regardless of physical ability", "Patients who are unable to exercise adequately on a treadmill", "Only post-MI patients", "Only patients under 40"],
    correctIndex: 1,
    answer: "Pharmacologic stress tests are used for patients unable to exercise adequately (arthritis, peripheral vascular disease, deconditioning). Adenosine/regadenoson cause coronary vasodilation, revealing differential perfusion between normal and stenotic territories on imaging.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-19",
    type: "question",
    question: "Endothelial dysfunction is the initial step in atherosclerosis. What causes it?",
    options: ["Excessive exercise", "Risk factors (hypertension, smoking, diabetes, hyperlipidemia) damaging the endothelial cell layer", "Viral infection only", "Genetic mutation only"],
    correctIndex: 1,
    answer: "Endothelial dysfunction results from chronic exposure to cardiovascular risk factors. These damage the endothelial lining, reducing nitric oxide production, increasing permeability to LDL, and promoting a pro-inflammatory, pro-thrombotic state.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-20",
    type: "question",
    question: "When should statins be administered for optimal effect?",
    options: ["Morning with breakfast", "At bedtime", "Noon", "With every meal"],
    correctIndex: 1,
    answer: "Peak hepatic cholesterol synthesis occurs overnight (driven by circadian rhythm). Administering statins at bedtime maximizes HMG-CoA reductase inhibition during this peak production period, optimizing LDL reduction.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-21",
    type: "question",
    question: "What does the PQRST format assess in a patient with chest pain?",
    options: ["ECG wave components", "Precipitating factors, Quality, Region/Radiation, Severity, Timing of pain", "Laboratory values", "Medication dosing"],
    correctIndex: 1,
    answer: "PQRST is a systematic pain assessment tool: P=Precipitating/Palliating factors, Q=Quality (pressure, sharp, burning), R=Region/Radiation, S=Severity (0-10 scale), T=Timing (onset, duration, constant vs intermittent). Essential for comparing episodes.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-22",
    type: "question",
    question: "What is the primary mechanism by which nitroglycerin relieves angina?",
    options: ["Increases heart rate", "Venodilation reduces preload, decreasing myocardial oxygen demand; also dilates coronary arteries", "Blocks calcium channels", "Inhibits platelet aggregation"],
    correctIndex: 1,
    answer: "NTG converts to nitric oxide, which activates guanylyl cyclase → increased cGMP → vascular smooth muscle relaxation. Primary effect is venodilation (reduces preload and myocardial wall stress). Secondary effects: arterial dilation (reduces afterload) and coronary artery dilation.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-23",
    type: "question",
    question: "Why is hs-CRP useful in cardiovascular risk assessment?",
    options: ["It directly measures cholesterol", "It reflects systemic vascular inflammation, which drives atherosclerosis progression", "It measures cardiac enzymes", "It detects arrhythmias"],
    correctIndex: 1,
    answer: "High-sensitivity C-reactive protein (hs-CRP) is a marker of systemic inflammation. Atherosclerosis is fundamentally an inflammatory disease. Elevated hs-CRP indicates increased vascular inflammation and higher cardiovascular risk, independent of lipid levels.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cad-24",
    type: "question",
    question: "What vital sign should be checked before administering sublingual nitroglycerin?",
    options: ["Temperature", "Blood pressure — hold if SBP <90 mmHg", "Respiratory rate only", "Oxygen saturation only"],
    correctIndex: 1,
    answer: "Blood pressure must be checked before NTG administration. NTG causes significant vasodilation and can cause dangerous hypotension. Hold if SBP <90 mmHg. Also contraindicated with recent PDE5 inhibitor use and in RV infarction.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cad-25",
    type: "question",
    question: "Chronic inflammatory conditions such as rheumatoid arthritis and lupus increase CAD risk through what mechanism?",
    options: ["They cause hypertension only", "Systemic inflammation accelerates atherosclerosis through endothelial activation and plaque instability", "They increase LDL directly", "They have no effect on CAD"],
    correctIndex: 1,
    answer: "Chronic systemic inflammatory conditions (RA, SLE, HIV) accelerate atherosclerosis through persistent endothelial activation, increased inflammatory cytokine levels, and promotion of plaque vulnerability. These patients require aggressive cardiovascular risk management.",
    category: "Cardiovascular",
    difficulty: 2
  },

  // ============================================================
  // CARDIOGENIC SHOCK (25 cards)
  // ============================================================
  {
    id: "rn-pcn-cs-1",
    type: "question",
    question: "What is the classic hemodynamic profile of cardiogenic shock?",
    options: ["Low PCWP, low SVR, high CO", "High PCWP (>18), low CI (<1.8), high SVR", "Normal hemodynamics", "High CO, low SVR"],
    correctIndex: 1,
    answer: "Cardiogenic shock: high PCWP (left heart congestion), low CI (pump failure), high SVR (compensatory vasoconstriction). This differs from septic shock (low SVR, often high CO) and hypovolemic shock (low PCWP).",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-2",
    type: "question",
    question: "Which vasopressor is first-line for cardiogenic shock based on the SOAP II trial?",
    options: ["Dopamine", "Norepinephrine", "Epinephrine", "Phenylephrine"],
    correctIndex: 1,
    answer: "The SOAP II trial demonstrated norepinephrine is associated with fewer arrhythmias and lower 28-day mortality compared to dopamine in cardiogenic shock. Norepinephrine provides both vasoconstriction (alpha-1) and moderate inotropy (beta-1).",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-3",
    type: "question",
    question: "The most important single intervention for MI-related cardiogenic shock is:",
    options: ["Vasopressor therapy", "Emergent coronary revascularization (PCI)", "IABP insertion", "IV fluid resuscitation"],
    correctIndex: 1,
    answer: "Emergent revascularization (PCI) is the single most important intervention for MI-related cardiogenic shock, reducing mortality from >70% to approximately 50%. All other therapies are supportive bridges to revascularization.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-4",
    type: "question",
    question: "How does the IABP (intra-aortic balloon pump) work?",
    options: ["Pumps blood directly like a heart", "Inflates in diastole (augments coronary perfusion) and deflates before systole (reduces afterload)", "Provides mechanical ventilation", "Replaces the aortic valve"],
    correctIndex: 1,
    answer: "The IABP uses counterpulsation: inflating in diastole increases coronary perfusion pressure, and deflating just before systole reduces afterload, making it easier for the weakened ventricle to eject blood. Timing with the cardiac cycle is critical.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-5",
    type: "question",
    question: "What does a rising lactate level indicate in cardiogenic shock?",
    options: ["Improving tissue perfusion", "Worsening tissue hypoperfusion and anaerobic metabolism", "Normal metabolism", "Liver recovery"],
    correctIndex: 1,
    answer: "Rising lactate indicates worsening tissue hypoperfusion. When tissues receive inadequate oxygen delivery, they shift to anaerobic metabolism, producing lactate. Lactate >4 mmol/L is associated with significantly higher mortality. Lactate clearance (>10% in 2 hours) indicates improving resuscitation.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-6",
    type: "question",
    question: "What mnemonic helps differentiate cardiogenic from septic shock using temperature assessment?",
    options: ["Hot and dry", "Cold and wet = cardiogenic; warm and wet = septic", "Both are the same", "Cold and dry = cardiogenic"],
    correctIndex: 1,
    answer: "Cold and wet = cardiogenic shock (low CO causes cold vasoconstricted extremities; high PCWP causes wet lungs). Warm and wet = septic shock (vasodilation causes warm skin; volume overload causes wet lungs). Cold and dry = hypovolemic.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-7",
    type: "question",
    question: "A patient in cardiogenic shock has an SvO2 of 52%. What does this indicate?",
    options: ["Normal oxygen delivery", "Inadequate oxygen delivery — tissues are extracting more oxygen than normal", "Excessive oxygen supply", "Pulmonary shunting"],
    correctIndex: 1,
    answer: "Mixed venous oxygen saturation (SvO2) <65% indicates that tissues are extracting more oxygen than normal because delivery is inadequate. Normal SvO2 is 65-75%. In cardiogenic shock, low CO reduces oxygen delivery, causing increased extraction.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-8",
    type: "question",
    question: "What is the self-perpetuating 'vicious cycle' of cardiogenic shock?",
    options: ["Blood pressure increases automatically", "Low CO → decreased coronary perfusion → worsening ischemia → further reduction in CO", "Stable hemodynamics maintain themselves", "Only renal effects"],
    correctIndex: 1,
    answer: "The cardiogenic shock spiral: low CO → hypotension → decreased coronary perfusion → more ischemia → less contractility → lower CO. Simultaneously, compensatory tachycardia and vasoconstriction increase O2 demand while decreasing supply. This requires urgent intervention to break the cycle.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-9",
    type: "question",
    question: "What minimum MAP target should the nurse titrate vasopressors to in cardiogenic shock?",
    options: ["MAP ≥50 mmHg", "MAP ≥65 mmHg", "MAP ≥80 mmHg", "MAP ≥100 mmHg"],
    correctIndex: 1,
    answer: "The target MAP in cardiogenic shock is ≥65 mmHg to maintain adequate end-organ perfusion (kidneys, brain, gut). Vasopressors are titrated to this target while monitoring end-organ function (urine output, mental status, lactate clearance).",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-10",
    type: "question",
    question: "If norepinephrine extravasates from a peripheral IV, what is the antidote?",
    options: ["Protamine sulfate", "Phentolamine injected locally", "Naloxone", "Atropine"],
    correctIndex: 1,
    answer: "Phentolamine (alpha-blocker) is injected locally into the area of extravasation to counteract the vasoconstrictive effects of norepinephrine and prevent tissue necrosis. Vasopressors should be administered via central line when possible.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-11",
    type: "question",
    question: "What percentage of left ventricular myocardium must be lost to cause cardiogenic shock?",
    options: [">10%", ">25%", ">40%", ">60%"],
    correctIndex: 2,
    answer: "Cardiogenic shock typically results from loss of >40% of left ventricular myocardium, most commonly from a massive acute MI (especially anterior/LAD territory). This degree of contractile loss overwhelms compensatory mechanisms.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-12",
    type: "question",
    question: "Which urine output target indicates adequate renal perfusion in cardiogenic shock?",
    options: [">2 mL/kg/hr", ">0.5 mL/kg/hr", ">5 mL/kg/hr", "Any output is acceptable"],
    correctIndex: 1,
    answer: "Target urine output >0.5 mL/kg/hr indicates adequate renal perfusion. Oliguria (<0.5 mL/kg/hr) suggests renal hypoperfusion and increased risk for acute tubular necrosis. Hourly urine output monitoring via Foley catheter is essential.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-13",
    type: "question",
    question: "Why is dopamine no longer first-line for cardiogenic shock?",
    options: ["It is too expensive", "Higher arrhythmia rate and increased mortality compared to norepinephrine (SOAP II)", "It does not increase blood pressure", "It is no longer manufactured"],
    correctIndex: 1,
    answer: "The SOAP II trial showed dopamine was associated with more arrhythmias (particularly atrial fibrillation) and higher 28-day mortality compared to norepinephrine in cardiogenic shock. Additionally, the 'renal-dose dopamine' concept has been debunked.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-14",
    type: "question",
    question: "A patient in cardiogenic shock has cool, mottled extremities, altered mental status, and crackles. What do the crackles indicate?",
    options: ["Pneumonia", "Pulmonary congestion from elevated left ventricular filling pressures", "Pleural effusion", "Bronchospasm"],
    correctIndex: 1,
    answer: "In cardiogenic shock, the failing LV cannot adequately eject blood. End-diastolic pressure rises, transmitting backward to the pulmonary vasculature. Elevated pulmonary capillary pressure forces fluid into the alveoli, causing crackles (pulmonary edema).",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-15",
    type: "question",
    question: "What is the lethal triad that develops in prolonged shock?",
    options: ["Fever, hypertension, tachycardia", "Hypothermia, acidosis, coagulopathy", "Bradycardia, hypertension, irregular respirations", "Hyponatremia, hyperkalemia, hypocalcemia"],
    correctIndex: 1,
    answer: "The lethal triad of prolonged shock: hypothermia (impaired thermoregulation), metabolic acidosis (anaerobic metabolism, lactate), and coagulopathy (DIC from tissue factor release, dilution, hypothermia-impaired coagulation enzymes). Each component worsens the others.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-16",
    type: "question",
    question: "What systemic inflammatory response occurs in cardiogenic shock?",
    options: ["No inflammatory response occurs", "SIRS develops from tissue hypoperfusion, releasing TNF-alpha, IL-6, and NO, causing inappropriate vasodilation", "Only local inflammation at the MI site", "Anti-inflammatory response only"],
    correctIndex: 1,
    answer: "Prolonged tissue hypoperfusion triggers SIRS. Inflammatory mediators (TNF-alpha, IL-6) cause myocardial depression and inappropriate vasodilation via nitric oxide. This compounds the hemodynamic collapse beyond just pump failure.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-17",
    type: "question",
    question: "A nurse is titrating dobutamine in cardiogenic shock. The patient develops a new rapid irregular rhythm. What should the nurse suspect?",
    options: ["Normal dobutamine effect", "Dobutamine-induced arrhythmia — notify provider and prepare for dose adjustment", "Mechanical ventilator malfunction", "Hypokalemia unrelated to treatment"],
    correctIndex: 1,
    answer: "Arrhythmias are a significant side effect of dobutamine (beta-1 stimulation). Tachyarrhythmias (VT, rapid AF) increase myocardial oxygen demand and worsen the supply-demand mismatch. Notify the provider for dose reduction or switch to milrinone.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-18",
    type: "question",
    question: "What mechanical complication of MI can cause acute cardiogenic shock with a new murmur?",
    options: ["Dressler syndrome", "Acute mitral regurgitation from papillary muscle rupture", "Pericardial effusion", "Cardiac tamponade without rupture"],
    correctIndex: 1,
    answer: "Papillary muscle rupture causes acute severe mitral regurgitation with a new systolic murmur and sudden hemodynamic collapse. This typically occurs 2-7 days post-MI and requires emergent surgical intervention.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-19",
    type: "question",
    question: "How does norepinephrine differ from pure vasopressors like phenylephrine?",
    options: ["No difference", "Norepinephrine has both alpha-1 (vasoconstriction) AND beta-1 (inotropy) activity", "Phenylephrine has more beta activity", "Norepinephrine only causes vasodilation"],
    correctIndex: 1,
    answer: "Norepinephrine provides alpha-1 mediated vasoconstriction (raises SVR and MAP) PLUS beta-1 mediated positive inotropy (increases contractility). Phenylephrine is a pure alpha-1 agonist without inotropy, potentially increasing afterload without augmenting cardiac output.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-20",
    type: "question",
    question: "What end-organ damage to the liver occurs in cardiogenic shock?",
    options: ["Hepatitis infection", "Centrilobular necrosis from low flow and hepatic congestion, causing elevated LFTs and lactate", "Liver abscess formation", "Fatty liver disease"],
    correctIndex: 1,
    answer: "Hepatic damage in cardiogenic shock occurs through dual mechanisms: hypoperfusion (low cardiac output) causes centrilobular necrosis, and hepatic congestion (elevated CVP) causes passive congestion. Both result in elevated AST, ALT, and contribute to lactate elevation.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-cs-21",
    type: "question",
    question: "Why should IV fluids be used cautiously in cardiogenic shock?",
    options: ["They are contraindicated always", "The patient is already volume-overloaded; excess fluid worsens pulmonary edema", "They cause hypernatremia", "They always improve hemodynamics"],
    correctIndex: 1,
    answer: "In cardiogenic shock, PCWP is already elevated (>18 mmHg). Adding more volume to an already congested patient worsens pulmonary edema without improving cardiac output. Unlike hypovolemic shock, volume resuscitation is NOT the primary treatment.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-22",
    type: "question",
    question: "What does cardiac index (CI) measure and what is the normal range?",
    options: ["Heart rhythm; normal is 60-100", "Cardiac output indexed to body surface area; normal is 2.5-4.0 L/min/m²", "Blood pressure ratio", "Coronary artery diameter"],
    correctIndex: 1,
    answer: "Cardiac index = cardiac output ÷ body surface area, normalizing CO to body size. Normal CI is 2.5-4.0 L/min/m². CI <2.2 indicates impaired perfusion; CI <1.8 with elevated PCWP defines cardiogenic shock hemodynamically.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-23",
    type: "question",
    question: "ECMO may be used in refractory cardiogenic shock. What does VA-ECMO stand for?",
    options: ["Venous-arterial extracorporeal membrane oxygenation", "Ventricular assist — mechanical output", "Very advanced cardiac monitoring option", "Valve area — mitral closing mechanism"],
    correctIndex: 0,
    answer: "Veno-arterial ECMO provides both cardiac and respiratory support by draining deoxygenated blood from a vein, oxygenating it through a membrane lung, and returning it to an artery. It provides circulatory support while the heart recovers or as a bridge to more definitive therapy.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-cs-24",
    type: "question",
    question: "A patient in cardiogenic shock becomes confused and agitated. What does this neurological change indicate?",
    options: ["Improvement", "Cerebral hypoperfusion from inadequate cardiac output", "Medication side effect only", "Normal response to ICU environment"],
    correctIndex: 1,
    answer: "Altered mental status (confusion, agitation, obtundation) in cardiogenic shock indicates cerebral hypoperfusion. The brain requires constant perfusion to maintain function. AMS is an ominous sign of inadequate cardiac output and requires urgent hemodynamic optimization.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-cs-25",
    type: "question",
    question: "Which clinical assessment best indicates improving tissue perfusion during cardiogenic shock resuscitation?",
    options: ["Rising blood pressure alone", "Lactate clearance >10% in 2 hours with improving urine output and mental status", "Increasing heart rate", "Stable CVP readings"],
    correctIndex: 1,
    answer: "Lactate clearance (>10% decrease in 2 hours) combined with improved urine output and mental status are the best composite indicators of improving tissue perfusion. Blood pressure alone does not confirm adequate end-organ perfusion.",
    category: "Cardiovascular",
    difficulty: 2
  },

  // ============================================================
  // ABDOMINAL AORTIC ANEURYSM (25 cards)
  // ============================================================
  {
    id: "rn-pcn-aaa-1",
    type: "question",
    question: "What is the classic triad of ruptured AAA?",
    options: ["Fever, headache, rash", "Sudden severe back/abdominal pain, hypotension, pulsatile abdominal mass", "Chest pain, dyspnea, diaphoresis", "Nausea, vomiting, diarrhea"],
    correctIndex: 1,
    answer: "The classic rupture triad: sudden tearing back/abdominal pain + hypotension (hemorrhagic shock) + pulsatile abdominal mass. However, this triad is present in <50% of cases. Maintain high suspicion in elderly male smokers with acute back pain.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-2",
    type: "question",
    question: "Why should the nurse avoid vigorous abdominal palpation in a patient with a known AAA?",
    options: ["It is uncomfortable", "Vigorous palpation may increase wall stress and precipitate rupture", "It is unnecessary for assessment", "It causes nausea"],
    correctIndex: 1,
    answer: "Vigorous palpation can increase intraluminal pressure against the weakened aortic wall, potentially precipitating rupture. Gentle palpation for pulsatility is acceptable, but aggressive examination should be avoided.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-3",
    type: "question",
    question: "Laplace's Law explains why AAA rupture risk increases exponentially with size. What does the law state?",
    options: ["Pressure decreases with diameter", "Wall tension = (pressure × radius) / (2 × wall thickness)", "Volume is constant", "Flow rate determines rupture"],
    correctIndex: 1,
    answer: "Laplace's Law: wall tension = (pressure × radius) / (2 × wall thickness). As the aneurysm dilates, both radius increases (numerator) and wall thickness decreases (denominator), causing exponential increase in wall tension — a positive feedback loop toward rupture.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-aaa-4",
    type: "question",
    question: "At what AAA diameter is elective surgical repair generally indicated for men?",
    options: ["≥3.0 cm", "≥4.0 cm", "≥5.5 cm", "≥7.0 cm"],
    correctIndex: 2,
    answer: "Elective repair is indicated when AAA diameter reaches ≥5.5 cm in men (≥5.0 cm in women) or growth rate >0.5 cm in 6 months. Below these thresholds, the surgical risk outweighs the rupture risk, and surveillance is appropriate.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-5",
    type: "question",
    question: "What is the strongest modifiable risk factor for AAA development?",
    options: ["Hypertension", "Tobacco use", "Diabetes", "Obesity"],
    correctIndex: 1,
    answer: "Tobacco use is the strongest modifiable risk factor for AAA — 90% of AAA patients are current or former smokers. Smoking accelerates aortic wall degradation through proteolytic enzyme activation and endothelial damage. Cessation slows growth by 20-30%.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-6",
    type: "question",
    question: "What is permissive hypotension in the context of ruptured AAA?",
    options: ["Treating hypertension aggressively", "Maintaining SBP 70-90 mmHg to avoid disrupting the retroperitoneal clot tamponade", "Ignoring blood pressure entirely", "Targeting SBP >180 mmHg"],
    correctIndex: 1,
    answer: "Permissive hypotension (SBP 70-90 mmHg) in ruptured AAA prevents disrupting the fragile retroperitoneal clot that may be tamponading the hemorrhage. Aggressive fluid resuscitation to normal BP can displace this clot and worsen uncontrolled hemorrhage.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-aaa-7",
    type: "question",
    question: "The USPSTF recommends one-time AAA screening with abdominal ultrasound for which population?",
    options: ["All adults over 50", "Males aged 65-75 who have ever smoked", "All females over 65", "Only patients with symptoms"],
    correctIndex: 1,
    answer: "USPSTF Grade B recommendation: one-time screening abdominal ultrasound for males aged 65-75 who have ever smoked. This population has the highest prevalence and greatest mortality reduction from screening.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-8",
    type: "question",
    question: "In suspected ruptured AAA with hemodynamic instability, should the nurse delay for CT scan?",
    options: ["Yes, CT is always needed first", "No — do NOT delay surgery. Bedside ultrasound can confirm diagnosis in unstable patients", "CT should take priority", "MRI is preferred"],
    correctIndex: 1,
    answer: "NEVER delay surgery for CT scan in unstable ruptured AAA. Bedside ultrasound can rapidly confirm the diagnosis. Every minute of delay increases mortality. CT angiography is appropriate only for hemodynamically stable patients.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-9",
    type: "question",
    question: "What is the massive transfusion protocol ratio used in ruptured AAA?",
    options: ["PRBCs only", "1:1:1 ratio of PRBCs:FFP:Platelets", "3:1 crystalloid to blood", "FFP only"],
    correctIndex: 1,
    answer: "Massive transfusion protocol uses 1:1:1 ratio of packed red blood cells : fresh frozen plasma : platelets to prevent the lethal triad (hypothermia, acidosis, coagulopathy) that occurs with massive hemorrhage and resuscitation.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-10",
    type: "question",
    question: "What are Grey Turner sign and Cullen sign?",
    options: ["Cardiac auscultation findings", "Flank ecchymosis (Grey Turner) and periumbilical ecchymosis (Cullen) — late signs of retroperitoneal hemorrhage", "ECG patterns", "Neurological reflexes"],
    correctIndex: 1,
    answer: "Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) indicate retroperitoneal hemorrhage tracking to subcutaneous tissues. These are LATE findings — their absence does not rule out rupture. Also seen in pancreatitis.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-11",
    type: "question",
    question: "What pathological process weakens the aortic wall in AAA formation?",
    options: ["Increased collagen deposition", "Matrix metalloproteinases (MMP-2, MMP-9) degrade elastin and collagen, with smooth muscle cell apoptosis", "Enhanced smooth muscle growth", "Increased wall thickness"],
    correctIndex: 1,
    answer: "AAA formation involves: MMP-mediated elastin/collagen degradation, smooth muscle cell apoptosis (depleting repair capacity), chronic inflammation, and protease-antiprotease imbalance. These collectively weaken the medial layer of the aortic wall.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-aaa-12",
    type: "question",
    question: "What is the normal diameter of the abdominal aorta, and at what diameter is an aneurysm defined?",
    options: ["Normal 1 cm; aneurysm at 2 cm", "Normal ~2 cm; aneurysm at ≥3 cm", "Normal 4 cm; aneurysm at 6 cm", "Normal 3 cm; aneurysm at 4 cm"],
    correctIndex: 1,
    answer: "Normal abdominal aorta diameter is approximately 2.0 cm. An aneurysm is defined as dilation to ≥3.0 cm (50% greater than normal) or ≥1.5 times the expected diameter for the patient's age and body size.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-13",
    type: "question",
    question: "What is the annual rupture risk for an AAA measuring 6.5 cm?",
    options: ["<1%", "1-3%", "10-20%", "<0.5%"],
    correctIndex: 2,
    answer: "Annual rupture risk by size: <4 cm = <1%, 4-5 cm = 1-3%, 5-5.9 cm = 3-15%, 6-6.9 cm = 10-20%, >7 cm = 20-40%. Risk increases exponentially with size, which is why repair is recommended at ≥5.5 cm.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-14",
    type: "question",
    question: "What blood pressure target should be maintained for a stable, unruptured AAA?",
    options: ["SBP <180 mmHg", "SBP <120 mmHg to reduce wall stress", "No blood pressure target needed", "SBP <160 mmHg"],
    correctIndex: 1,
    answer: "For stable unruptured AAA, blood pressure should be controlled with SBP <120 mmHg to minimize aortic wall shear stress. Beta-blockers are preferred as they also reduce dp/dt (rate of pressure rise) on the aortic wall.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-15",
    type: "question",
    question: "What is an endoleak after EVAR (endovascular aneurysm repair)?",
    options: ["Leak from an IV site", "Persistent blood flow into the aneurysm sac despite the graft, requiring lifelong surveillance", "Cerebrospinal fluid leak", "Urinary leak"],
    correctIndex: 1,
    answer: "Endoleak is the most common complication of EVAR: persistent blood flow into the aneurysm sac outside the stent graft. Types I and III require intervention; Type II (from branch vessels) may be observed. Lifelong imaging surveillance is required after EVAR.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-16",
    type: "question",
    question: "The nurse should prepare which immediate interventions for a patient with suspected ruptured AAA?",
    options: ["Oral pain medication and reassessment", "Two large-bore IVs, type and crossmatch, notify surgical team STAT", "Abdominal CT scan first, then IV access", "Bed rest and observation only"],
    correctIndex: 1,
    answer: "Suspected ruptured AAA requires: establish 2 large-bore IVs (14-16 gauge), type and crossmatch for massive transfusion, notify surgical team STAT, prepare for emergent OR transfer. Do NOT delay for imaging in unstable patients.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-17",
    type: "question",
    question: "Why is esmolol particularly useful in acute aortic emergencies?",
    options: ["It has a long half-life", "Ultra-short half-life (9 minutes) allows precise, rapidly titratable BP control", "It is an oral medication", "It only affects the kidneys"],
    correctIndex: 1,
    answer: "Esmolol's 9-minute half-life makes it ideal for acute aortic emergencies where precise, rapidly adjustable BP control is essential. If hypotension occurs, simply stopping the infusion results in rapid offset. Target: HR <60, SBP <120.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-18",
    type: "question",
    question: "Most AAAs rupture into which anatomical space?",
    options: ["Peritoneal cavity (most common)", "Left retroperitoneal space (80% of cases)", "Thoracic cavity", "Pelvic cavity"],
    correctIndex: 1,
    answer: "80% of ruptured AAAs bleed into the left retroperitoneal space, where surrounding tissue may temporarily contain the hemorrhage (contained rupture). 20% rupture freely into the peritoneal cavity, which is uniformly fatal without immediate surgery.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-19",
    type: "question",
    question: "Why does COPD share a pathogenic link with AAA?",
    options: ["Both are caused by hypertension", "Both involve protease-antiprotease imbalance causing tissue destruction (elastin degradation)", "Both are autoimmune diseases", "No relationship exists"],
    correctIndex: 1,
    answer: "COPD and AAA share the same pathogenic mechanism: protease-antiprotease imbalance. In COPD, excess elastase degrades lung elastin (emphysema). In AAA, matrix metalloproteinases degrade aortic wall elastin. Smoking drives both processes.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-pcn-aaa-20",
    type: "question",
    question: "Post-EVAR, what nursing assessment is critical for the lower extremities?",
    options: ["Range of motion only", "Distal pulses, color, temperature, sensation, and motor function to detect limb ischemia", "Weight bearing ability", "Edema measurement only"],
    correctIndex: 1,
    answer: "Post-EVAR, distal pulse checks and neurovascular assessments of both lower extremities are critical to detect graft limb occlusion, embolization, or vascular injury. Loss of pulses, pallor, pain, or paresthesias require immediate notification.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-21",
    type: "question",
    question: "What connective tissue disorders predispose younger patients to aortic aneurysms?",
    options: ["Osteoarthritis", "Marfan syndrome and Ehlers-Danlos syndrome", "Rheumatoid arthritis", "Gout"],
    correctIndex: 1,
    answer: "Marfan syndrome (fibrillin-1 defect affecting elastin organization) and vascular Ehlers-Danlos syndrome (type III collagen defect) cause inherent aortic wall weakness, predisposing to aneurysm formation at younger ages than typical atherosclerotic AAA.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-22",
    type: "question",
    question: "A patient with a 4.2 cm AAA asks how often they need follow-up imaging. What is the correct surveillance schedule?",
    options: ["No follow-up needed", "Annual abdominal ultrasound", "Every 6-12 months", "Monthly CT scans"],
    correctIndex: 2,
    answer: "AAA surveillance: <4 cm = annual ultrasound; 4-5.4 cm = every 6-12 months (depending on growth rate); ≥5.5 cm = surgical evaluation. The 4.2 cm aneurysm falls in the 6-12 month surveillance category.",
    category: "Cardiovascular",
    difficulty: 1
  },
  {
    id: "rn-pcn-aaa-23",
    type: "question",
    question: "What role does tranexamic acid (TXA) play in ruptured AAA management?",
    options: ["It dissolves clots", "It inhibits fibrinolysis, reducing blood loss by preventing clot breakdown", "It increases heart rate", "It treats infection"],
    correctIndex: 1,
    answer: "TXA inhibits plasminogen activation, preventing fibrin clot breakdown. In hemorrhagic emergencies, it reduces blood loss. Given 1g IV over 10 min within 3 hours of hemorrhage onset. The CRASH-2 trial showed mortality reduction in traumatic hemorrhage.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-24",
    type: "question",
    question: "What post-operative complication should the nurse monitor for after open AAA repair involving aortic cross-clamping?",
    options: ["Only wound infection", "Renal failure from renal artery ischemia during cross-clamp", "Hearing loss", "Vision changes"],
    correctIndex: 1,
    answer: "Aortic cross-clamping during open repair causes temporary cessation of blood flow to organs below the clamp. Renal ischemia is a major concern — monitor urine output closely post-operatively. Also monitor for spinal cord ischemia (paraplegia) and mesenteric ischemia.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-pcn-aaa-25",
    type: "question",
    question: "What patient education should the nurse provide about symptoms requiring immediate medical attention for a patient with known AAA?",
    options: ["Only return if the mass gets bigger", "Seek immediate emergency care for sudden severe back/abdominal pain, feeling faint, or new pulsation in the abdomen", "Wait for the next scheduled appointment", "No specific symptoms to watch for"],
    correctIndex: 1,
    answer: "Patients with known AAA must understand warning signs of rupture: sudden severe tearing back or abdominal pain, feeling dizzy/faint, cold sweaty skin, or rapid heartbeat. These require calling 911 immediately — rupture is fatal without emergent surgery.",
    category: "Cardiovascular",
    difficulty: 1
  },

  // ============================================================
  // ISCHEMIC STROKE (25 cards)
  // ============================================================
  {
    id: "rn-pcn-is-1",
    type: "question",
    question: "How many neurons are lost per minute of untreated large vessel occlusion stroke?",
    options: ["100,000", "500,000", "1.9 million", "10 million"],
    correctIndex: 2,
    answer: "Approximately 1.9 million neurons, 14 billion synapses, and 12 km of myelinated fibers are lost per minute of untreated LVO stroke. This quantification underlies the concept 'time is brain' and drives the emphasis on rapid treatment.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-2",
    type: "question",
    question: "What is the blood pressure requirement BEFORE administering IV tPA for ischemic stroke?",
    options: ["<140/90", "<160/100", "<185/110", "<220/120"],
    correctIndex: 2,
    answer: "Blood pressure must be <185/110 before tPA administration to reduce hemorrhagic conversion risk. After tPA, maintain <180/105 for 24 hours. If BP cannot be controlled, tPA is contraindicated.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-3",
    type: "question",
    question: "Why is permissive hypertension (up to 220/120) allowed in non-tPA ischemic stroke?",
    options: ["High BP has no effect", "Cerebral autoregulation is impaired; higher BP maintains perfusion to the ischemic penumbra", "It prevents hemorrhage", "Medications are unavailable"],
    correctIndex: 1,
    answer: "In ischemic stroke, cerebral autoregulation is disrupted. The penumbra relies on systemic blood pressure for perfusion through collateral vessels. Lowering BP may convert salvageable penumbra to infarct. BP is only aggressively treated if tPA is given or BP exceeds 220/120.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-4",
    type: "question",
    question: "What must the nurse do BEFORE giving any food, fluids, or oral medications to a stroke patient?",
    options: ["Check blood pressure", "Perform a swallow screen", "Obtain an ECG", "Check blood glucose"],
    correctIndex: 1,
    answer: "A swallow screen must be performed before ANY oral intake in stroke patients. Dysphagia is common after stroke, and aspiration pneumonia is a leading cause of post-stroke morbidity and mortality. NPO until formal swallow evaluation is passed.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-5",
    type: "question",
    question: "The penumbra concept refers to:",
    options: ["The area of complete necrosis", "Functionally impaired but structurally intact tissue surrounding the infarct core that is potentially salvageable", "The normal brain tissue", "The skull"],
    correctIndex: 1,
    answer: "The ischemic penumbra is tissue receiving marginal blood flow (10-20 mL/100g/min) from collaterals. It is electrically silent (contributing to deficits) but metabolically viable. Without treatment, it converts to infarct over 3-6 hours — the basis for the treatment window.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-6",
    type: "question",
    question: "What is the maximum time window for IV alteplase (tPA) in ischemic stroke?",
    options: ["1 hour", "3 hours", "4.5 hours from last known well", "12 hours"],
    correctIndex: 2,
    answer: "IV alteplase can be administered within 4.5 hours of last known well time. Door-to-needle target is <60 minutes. Each 15-minute reduction in door-to-needle time improves outcomes. Documenting last known well time is critical.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-7",
    type: "question",
    question: "A patient 3 hours post-tPA develops sudden severe headache and vomiting with worsening neuro exam. What is the FIRST action?",
    options: ["Administer acetaminophen", "Stop tPA infusion immediately and obtain stat CT", "Reassess in 30 minutes", "Administer antiemetic"],
    correctIndex: 1,
    answer: "Sudden headache, vomiting, and neurological decline post-tPA strongly suggest hemorrhagic conversion — a life-threatening emergency. Stop tPA immediately, obtain stat CT head, check coagulation studies, and prepare for possible cryoprecipitate and emergent neurosurgical consultation.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-8",
    type: "question",
    question: "MCA (middle cerebral artery) stroke affecting the dominant hemisphere causes which deficits?",
    options: ["Lower extremity weakness only", "Contralateral hemiparesis with aphasia (expressive and/or receptive)", "Bilateral blindness", "Only sensory loss"],
    correctIndex: 1,
    answer: "Dominant hemisphere MCA stroke: contralateral face and arm weakness > leg (MCA supplies lateral cortex), aphasia (Broca = expressive, Wernicke = receptive). Non-dominant MCA: contralateral neglect (ignoring one side of space).",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-9",
    type: "question",
    question: "What blood test MUST be checked immediately in any patient presenting with stroke-like symptoms?",
    options: ["Troponin", "Blood glucose", "BNP", "Lipid panel"],
    correctIndex: 1,
    answer: "Blood glucose must be checked immediately because hypoglycemia can perfectly mimic stroke symptoms (hemiparesis, aphasia, confusion). It is rapidly treatable and is a contraindication to tPA. Blood glucose <50 mg/dL must be corrected before considering thrombolysis.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-10",
    type: "question",
    question: "What is the NIHSS and what does a score of 22 indicate?",
    options: ["A blood test; 22 is normal", "National Institutes of Health Stroke Scale; 22 indicates very severe stroke", "A brain imaging score", "A medication dosing guide"],
    correctIndex: 1,
    answer: "The NIHSS is a standardized stroke severity scale (0-42). Scores: 0 = no deficit, 1-4 = minor, 5-15 = moderate, 16-20 = moderately severe, >20 = very severe. A score of 22 indicates very severe stroke with significant functional impairment.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-11",
    type: "question",
    question: "CT perfusion imaging has extended the mechanical thrombectomy window to how many hours?",
    options: ["4.5 hours", "6 hours", "Up to 24 hours in select patients", "48 hours"],
    correctIndex: 2,
    answer: "The DAWN and DEFUSE-3 trials demonstrated that mechanical thrombectomy for LVO can be performed up to 24 hours if CT perfusion shows a large ischemic penumbra with a small infarct core (mismatch). This paradigm shift has dramatically improved outcomes for late-presenting strokes.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-12",
    type: "question",
    question: "What head positioning is recommended for acute ischemic stroke?",
    options: ["HOB elevated 45 degrees", "Keep HOB flat to maximize cerebral perfusion", "Trendelenburg position", "Prone position"],
    correctIndex: 1,
    answer: "In acute ischemic stroke, keeping the HOB flat maximizes cerebral blood flow to the ischemic area through gravity-assisted perfusion. This is particularly important when autoregulation is impaired. Exception: elevate HOB if significant cerebral edema or aspiration risk.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-13",
    type: "question",
    question: "What is excitotoxicity in the ischemic cascade?",
    options: ["Excess oxygen delivery", "Massive glutamate release causing catastrophic calcium influx through NMDA receptors, leading to cell death", "Increased GABA release", "Improved neuronal function"],
    correctIndex: 1,
    answer: "During ischemia, depolarized neurons release massive glutamate. Glutamate activates NMDA receptors, causing catastrophic calcium influx. Intracellular calcium activates destructive enzymes (phospholipases, proteases, endonucleases) that degrade cell membranes, cytoskeleton, and DNA.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-is-14",
    type: "question",
    question: "Atrial fibrillation increases stroke risk by what factor?",
    options: ["No increase", "2-fold", "5-fold", "10-fold"],
    correctIndex: 2,
    answer: "Atrial fibrillation increases stroke risk approximately 5-fold. The fibrillating left atrium has stagnant blood flow, particularly in the left atrial appendage, promoting thrombus formation. Thrombus can embolize to the cerebral circulation causing cardioembolic stroke.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-15",
    type: "question",
    question: "Dual antiplatelet therapy (aspirin + clopidogrel × 21 days) is indicated for which stroke patients?",
    options: ["All ischemic stroke patients", "Minor ischemic stroke (NIHSS ≤3) or high-risk TIA within 24 hours", "Only hemorrhagic stroke", "Only patients over 80"],
    correctIndex: 1,
    answer: "The CHANCE and POINT trials demonstrated benefit of short-term dual antiplatelet therapy (aspirin + clopidogrel × 21 days) for minor ischemic stroke (NIHSS ≤3) or high-risk TIA presenting within 24 hours. Reduces recurrent stroke by 25%.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-is-16",
    type: "question",
    question: "What is the door-to-CT target time for acute stroke patients?",
    options: ["60 minutes", "45 minutes", "25 minutes", "10 minutes"],
    correctIndex: 2,
    answer: "Non-contrast CT head should be completed within 25 minutes of ED arrival (door-to-CT). This rapid imaging is essential to rule out hemorrhage before thrombolytic administration. Any delay in CT delays definitive treatment.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-17",
    type: "question",
    question: "What is the dose of IV alteplase for ischemic stroke?",
    options: ["0.5 mg/kg", "0.9 mg/kg (max 90 mg), 10% bolus over 1 min, remainder over 60 min", "1.5 mg/kg", "Fixed dose of 50 mg"],
    correctIndex: 1,
    answer: "tPA dose for stroke: 0.9 mg/kg (max 90 mg). Administer 10% as IV bolus over 1 minute, infuse the remaining 90% over 60 minutes. No antiplatelets or anticoagulants for 24 hours after tPA. Door-to-needle goal: <60 minutes.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-18",
    type: "question",
    question: "How often should neurological assessments be performed after tPA administration?",
    options: ["Every 4 hours", "Every 15 min × 2 hr, then every 30 min × 6 hr, then hourly × 16 hr", "Once per shift", "Only if symptoms change"],
    correctIndex: 1,
    answer: "Post-tPA monitoring: q15 min × 2 hours, q30 min × 6 hours, then hourly × 16 hours. Frequent assessment detects hemorrhagic conversion early. Any deterioration requires immediate tPA cessation, stat CT, and emergency intervention.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-19",
    type: "question",
    question: "What distinguishes a TIA from a completed stroke?",
    options: ["TIAs are always longer than 24 hours", "TIA symptoms resolve completely within 24 hours (usually <1 hour) with no permanent brain injury on imaging", "TIAs always cause permanent damage", "There is no difference"],
    correctIndex: 1,
    answer: "TIA (transient ischemic attack) features complete symptom resolution, usually within minutes to 1 hour, without evidence of brain infarction on imaging. TIA is a medical emergency because 10-15% of TIA patients suffer a stroke within 90 days, with highest risk in the first 48 hours.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-20",
    type: "question",
    question: "What is tenecteplase's advantage over alteplase for acute stroke?",
    options: ["It is cheaper", "Single IV bolus dosing (easier administration) with greater fibrin specificity", "It has no bleeding risk", "It works in 30 seconds"],
    correctIndex: 1,
    answer: "Tenecteplase is a modified tPA allowing single bolus dosing (0.25 mg/kg) versus alteplase's 60-minute infusion. This is particularly beneficial in transfer scenarios (drip-and-ship) where simplified administration improves logistics. Non-inferior to alteplase in recent trials.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-21",
    type: "question",
    question: "When should aspirin be administered after ischemic stroke?",
    options: ["Immediately in the ED", "Within 24-48 hours, but hold 24 hours if tPA was given", "Only after 7 days", "Never after stroke"],
    correctIndex: 1,
    answer: "Aspirin 325 mg within 24-48 hours of ischemic stroke onset. If tPA was administered, aspirin must be held for 24 hours to reduce hemorrhagic risk. After the 24-hour post-tPA period, aspirin should be started for secondary prevention.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-22",
    type: "question",
    question: "What does the FAST mnemonic assess?",
    options: ["Medication dosing", "Face drooping, Arm weakness, Speech difficulty, Time to call 911", "Lab values", "Cardiac rhythms"],
    correctIndex: 1,
    answer: "FAST is a rapid stroke assessment tool: F = Face drooping (ask to smile), A = Arm weakness (arm drift test), S = Speech difficulty (slurred or inappropriate), T = Time to call 911. This enables rapid public recognition and EMS activation.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-is-23",
    type: "question",
    question: "What type of stroke pattern suggests a cardioembolic source?",
    options: ["Gradual onset with single vessel territory", "Sudden onset, large infarct, possibly multiple vascular territories", "Lacunar infarct only", "Slow progressive weakness"],
    correctIndex: 1,
    answer: "Cardioembolic strokes (from AF, valve disease, LV thrombus) are characteristically sudden onset, affect large cortical territories, may involve multiple vascular distributions, and recur without anticoagulation. Embolic strokes tend to be larger than thrombotic strokes.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-is-24",
    type: "question",
    question: "Malignant cerebral edema after large MCA stroke typically peaks on which post-stroke day?",
    options: ["Day 1", "Days 2-5", "Day 10", "Day 14"],
    correctIndex: 1,
    answer: "Malignant cerebral edema peaks at days 2-5 post-stroke and can cause transtentorial herniation in large MCA territory infarcts. Signs include progressive obtundation and pupil dilation. Decompressive hemicraniectomy may be indicated in select patients under 60.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-is-25",
    type: "question",
    question: "What nursing documentation is MOST critical for determining stroke treatment eligibility?",
    options: ["Allergy list", "Last known well time", "Dietary preferences", "Insurance information"],
    correctIndex: 1,
    answer: "Last known well time is the single most critical piece of information for stroke treatment decisions. It determines eligibility for tPA (4.5 hours) and thrombectomy (up to 24 hours with imaging). Accurate documentation can be the difference between treatment and no treatment.",
    category: "Neurological",
    difficulty: 1
  },

  // ============================================================
  // HEMORRHAGIC STROKE (25 cards)
  // ============================================================
  {
    id: "rn-pcn-hs-1",
    type: "question",
    question: "What is the hallmark presentation of subarachnoid hemorrhage (SAH)?",
    options: ["Gradual headache over weeks", "Thunderclap headache — 'worst headache of my life' reaching maximum intensity within seconds", "Mild headache with fever", "Headache only with exertion"],
    correctIndex: 1,
    answer: "SAH presents with sudden thunderclap headache reaching maximum intensity within seconds, often described as the 'worst headache of my life.' This is SAH until proven otherwise. May be accompanied by nuchal rigidity, photophobia, nausea, vomiting, and loss of consciousness.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-hs-2",
    type: "question",
    question: "A patient with SAH is on day 7 post-coiling. The nurse notes new left arm weakness not present earlier. What complication is most likely?",
    options: ["Rebleeding", "Cerebral vasospasm causing delayed cerebral ischemia", "Medication side effect", "Normal recovery pattern"],
    correctIndex: 1,
    answer: "New focal deficits on days 4-14 post-SAH strongly suggest cerebral vasospasm causing delayed cerebral ischemia (DCI). This is the most common preventable cause of morbidity after SAH. Requires immediate evaluation and possible intervention.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-3",
    type: "question",
    question: "Why must nimodipine NEVER be given intravenously?",
    options: ["It is not available in IV form", "IV administration causes fatal cardiovascular collapse with profound hypotension", "It is absorbed better orally", "IV route is less effective"],
    correctIndex: 1,
    answer: "Nimodipine given intravenously has caused fatal cardiovascular collapse with severe hypotension and cardiac arrest. It must ONLY be given via oral or nasogastric route. This is a critical medication safety point for clinical practice and NCLEX.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-hs-4",
    type: "question",
    question: "What is the target blood pressure for acute ICH (intracerebral hemorrhage)?",
    options: ["SBP <180 mmHg", "SBP <140 mmHg within 1 hour", "SBP <200 mmHg", "No target needed"],
    correctIndex: 1,
    answer: "Per INTERACT2 and ATACH-2 trials, rapid BP reduction to SBP <140 mmHg within 1 hour reduces hematoma expansion and improves outcomes in ICH. IV nicardipine or clevidipine are preferred for smooth, titratable control.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-5",
    type: "question",
    question: "CT sensitivity for SAH decreases over time. What is the sensitivity at 12 hours vs 1 week?",
    options: ["100% at all times", "98% at 12 hours, drops to 50% at 1 week", "50% at 12 hours", "CT cannot detect SAH"],
    correctIndex: 1,
    answer: "CT sensitivity for SAH: 98% at 12 hours, 93% at 24 hours, and drops to approximately 50% at 1 week as blood is resorbed. If CT is negative but clinical suspicion is high, lumbar puncture with xanthochromia evaluation is required.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-6",
    type: "question",
    question: "A patient on warfarin develops sudden ICH with INR 3.2. What is the most urgent reversal agent?",
    options: ["Vitamin K alone (takes 6-24 hours)", "4-factor PCC (Kcentra) — reverses within 10-15 minutes", "Fresh frozen plasma only", "Protamine sulfate"],
    correctIndex: 1,
    answer: "4-factor PCC (Kcentra) provides rapid warfarin reversal within 10-15 minutes (contains factors II, VII, IX, X). Give WITH IV vitamin K 10 mg (PCC is temporary; vitamin K provides sustained reversal). FFP takes longer and causes volume overload.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-7",
    type: "question",
    question: "What are aneurysm precautions for SAH patients?",
    options: ["Encourage vigorous activity", "Dim lights, quiet environment, limit visitors, stool softeners, avoid straining, bed rest", "No special precautions needed", "High-protein diet and exercise"],
    correctIndex: 1,
    answer: "Aneurysm precautions minimize stimulation to prevent rebleeding: dim quiet room, limited visitors, stool softeners (prevent Valsalva), bed rest, no caffeine, anxiolytics PRN, avoid coughing/sneezing/straining. Maintained until aneurysm is secured.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-hs-8",
    type: "question",
    question: "What is the vasospasm danger window after SAH?",
    options: ["Days 1-3", "Days 4-14", "Days 15-30", "After 1 month"],
    correctIndex: 1,
    answer: "Cerebral vasospasm peaks at days 4-14 post-SAH. During this window, transcranial Doppler monitoring detects increasing velocities (indicating vessel narrowing). Nimodipine prophylaxis and close neurological monitoring are essential during this period.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-hs-9",
    type: "question",
    question: "Hyponatremia in SAH is most commonly caused by:",
    options: ["SIADH", "Cerebral salt wasting (CSW)", "Excessive IV fluids", "Diuretic therapy"],
    correctIndex: 1,
    answer: "Cerebral salt wasting (CSW) is the most common cause of hyponatremia in SAH — differentiated from SIADH by volume status. CSW = hypovolemic (treat with normal saline). SIADH = euvolemic/hypervolemic (treat with fluid restriction). Getting this wrong is dangerous.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-hs-10",
    type: "question",
    question: "What are the signs of uncal herniation?",
    options: ["Bilateral small pupils", "Ipsilateral fixed dilated pupil, contralateral hemiparesis, decreased LOC", "Bilateral papilledema only", "Fever and nuchal rigidity"],
    correctIndex: 1,
    answer: "Uncal herniation: medial temporal lobe herniates through tentorial notch compressing CN III (ipsilateral fixed dilated pupil), cerebral peduncle (contralateral hemiparesis), and brainstem (progressive obtundation). This is a neurosurgical emergency.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-11",
    type: "question",
    question: "What is the most common location for hypertensive ICH?",
    options: ["Frontal lobe", "Basal ganglia/putamen", "Cerebellum", "Occipital lobe"],
    correctIndex: 1,
    answer: "Hypertensive ICH most commonly occurs in the basal ganglia/putamen (60-65%), supplied by lenticulostriate arteries — small perforating branches most susceptible to lipohyalinosis and Charcot-Bouchard microaneurysm formation from chronic hypertension.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-12",
    type: "question",
    question: "What is the Hunt-Hess scale used for?",
    options: ["Grading ICH severity", "Grading SAH severity from I (minimal headache) to V (coma/posturing)", "Rating stroke rehabilitation progress", "Measuring blood pressure"],
    correctIndex: 1,
    answer: "Hunt-Hess scale grades SAH severity and predicts outcome: I = asymptomatic/mild headache, II = moderate-severe headache/nuchal rigidity, III = drowsy/mild focal deficit, IV = stupor/hemiparesis, V = coma/posturing. Higher grades = worse prognosis.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-13",
    type: "question",
    question: "Where is the most common location for cerebral aneurysms?",
    options: ["Posterior cerebral artery", "Anterior communicating artery (30%)", "Basilar artery", "External carotid artery"],
    correctIndex: 1,
    answer: "Berry aneurysms most commonly occur at the anterior communicating artery (30%), followed by posterior communicating artery (25%) and MCA bifurcation (20%). These are all arterial bifurcation points in the Circle of Willis where hemodynamic stress is highest.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-14",
    type: "question",
    question: "What is the spot sign on CT angiography in ICH?",
    options: ["A normal finding", "Active contrast extravasation indicating ongoing bleeding and high risk of hematoma expansion", "Calcification in the brain", "An artifact"],
    correctIndex: 1,
    answer: "The spot sign (contrast pooling within the hematoma on CTA) indicates active extravasation and predicts hematoma expansion — a significant risk factor for clinical deterioration. Patients with spot sign may benefit from more aggressive BP reduction and closer monitoring.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-hs-15",
    type: "question",
    question: "What is the Cushing triad and what does it indicate?",
    options: ["Fever, rash, joint pain", "Hypertension, bradycardia, irregular respirations — indicates critically elevated ICP with brainstem compression", "Tachycardia, hypotension, fever", "Weight gain, moon face, striae"],
    correctIndex: 1,
    answer: "Cushing triad: hypertension (reflex response to maintain cerebral perfusion against rising ICP), bradycardia (vagal response), and irregular respirations (brainstem compression). This is a LATE, OMINOUS sign of impending herniation requiring immediate intervention.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-16",
    type: "question",
    question: "Why is levetiracetam preferred over phenytoin for seizure prophylaxis in SAH?",
    options: ["It is cheaper", "Phenytoin is associated with worse cognitive outcomes in SAH patients", "Levetiracetam has no side effects", "Phenytoin is not available"],
    correctIndex: 1,
    answer: "Studies show phenytoin is associated with worse cognitive outcomes, increased medical complications, and possible cerebral vasospasm in SAH patients. Levetiracetam has fewer drug interactions, no need for level monitoring, and better cognitive profiles.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-17",
    type: "question",
    question: "What is cerebral amyloid angiopathy and why does it cause ICH?",
    options: ["An infection", "Beta-amyloid deposits in cerebral vessel walls causing weakness and lobar hemorrhage in the elderly", "A blood clotting disorder", "A congenital heart defect"],
    correctIndex: 1,
    answer: "Cerebral amyloid angiopathy (CAA) involves beta-amyloid protein deposition in small cortical and leptomeningeal vessel walls, causing vessel fragility. It is the second most common cause of ICH in the elderly and characteristically causes lobar hemorrhages (not deep basal ganglia).",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-hs-18",
    type: "question",
    question: "What is the xanthochromia test and when is it used?",
    options: ["A blood test for infection", "CSF analysis showing yellowish discoloration from bilirubin, confirming SAH when CT is negative", "A skin test for allergies", "An ECG finding"],
    correctIndex: 1,
    answer: "Xanthochromia is yellowish CSF discoloration from bilirubin (a hemoglobin breakdown product) detected by spectrophotometry. It confirms SAH even when CT is negative, appearing 6-12 hours after hemorrhage. LP is mandatory if CT-negative SAH is suspected.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-19",
    type: "question",
    question: "An EVD (external ventricular drain) is placed for hydrocephalus after SAH. What should the nurse monitor?",
    options: ["Only the insertion site", "Drain level, CSF drainage amount, CSF color and clarity, ICP waveform, and signs of infection", "Blood pressure only", "Heart rhythm only"],
    correctIndex: 1,
    answer: "EVD monitoring includes: drain leveled at tragus (correct reference point), CSF drainage amount/hour, CSF appearance (clear/bloody/cloudy), ICP readings and waveform, insertion site for infection, and drainage system for patency. Strict sterile technique is essential.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-20",
    type: "question",
    question: "What is Waterhouse-Friderichsen syndrome in the context of hemorrhagic complications?",
    options: ["A stroke rehabilitation technique", "Bilateral adrenal hemorrhage causing adrenal crisis, often from meningococcal DIC", "A type of aneurysm", "A cardiac rhythm"],
    correctIndex: 1,
    answer: "Waterhouse-Friderichsen syndrome is bilateral hemorrhagic adrenal necrosis, most commonly from meningococcal septicemia with DIC. Presents with shock, petechial/purpuric rash, DIC, and acute adrenal insufficiency. Requires emergent steroids and aggressive supportive care.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-hs-21",
    type: "question",
    question: "HOB positioning for hemorrhagic stroke differs from ischemic stroke. What position is recommended?",
    options: ["HOB flat", "HOB elevated 30 degrees to reduce ICP", "Trendelenburg", "Prone"],
    correctIndex: 1,
    answer: "In hemorrhagic stroke, HOB should be elevated 30 degrees to promote venous drainage, reduce ICP, and decrease hematoma expansion risk. This differs from ischemic stroke (where flat HOB may maximize perfusion). Head should be kept midline to avoid jugular compression.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-hs-22",
    type: "question",
    question: "What is the rebleeding risk in the first 24 hours after SAH if the aneurysm is not secured?",
    options: ["<1%", "4% on day 1, then 1.5%/day for 14 days", "25% on day 1", "No risk of rebleeding"],
    correctIndex: 1,
    answer: "The rebleeding risk is highest in the first 24 hours (4%), then approximately 1.5%/day for the next 14 days. Rebleeding carries 70% mortality. This is why definitive aneurysm securing (clipping or coiling) is performed urgently, ideally within 24 hours.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-23",
    type: "question",
    question: "Nicardipine IV is first-line for BP management in ICH because:",
    options: ["It is the cheapest option", "It provides smooth, titratable BP reduction through calcium channel blockade", "It also prevents seizures", "It reverses anticoagulation"],
    correctIndex: 1,
    answer: "Nicardipine provides smooth, predictable, and titratable BP reduction through arterial vasodilation (L-type calcium channel blockade). Start 5 mg/hr, titrate by 2.5 mg/hr every 5-15 min to max 15 mg/hr. Target SBP <140 within 1 hour.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-24",
    type: "question",
    question: "What is the ICH Score used for?",
    options: ["Determining tPA eligibility", "Predicting 30-day mortality based on GCS, ICH volume, IVH, infratentorial location, and age", "Measuring blood pressure response", "Grading aneurysm severity"],
    correctIndex: 1,
    answer: "The ICH Score predicts 30-day mortality using 5 variables: GCS, ICH volume (>30 mL), presence of IVH (intraventricular hemorrhage), infratentorial origin, and age >80. Higher scores indicate worse prognosis and guide goals-of-care discussions.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-hs-25",
    type: "question",
    question: "Secondary brain injury in ICH occurs through which mechanisms?",
    options: ["Only the initial bleed causes damage", "Iron and thrombin from the clot are neurotoxic, causing perihematomal edema peaking at days 3-5", "Calcium deposits form", "No secondary injury occurs"],
    correctIndex: 1,
    answer: "Secondary injury extends damage beyond the initial hematoma: iron (from hemoglobin degradation) and thrombin released from the clot are directly neurotoxic, triggering inflammation, BBB disruption, and perihematomal edema that peaks at 3-5 days.",
    category: "Neurological",
    difficulty: 3
  },

  // ============================================================
  // SEIZURES (25 cards)
  // ============================================================
  {
    id: "rn-pcn-sz-1",
    type: "question",
    question: "What is the FIRST action during an active generalized tonic-clonic seizure?",
    options: ["Restrain the patient", "Insert a bite block between the teeth", "Turn to the side and protect the head from injury", "Administer oral medication"],
    correctIndex: 2,
    answer: "During an active seizure: turn to the side (maintain airway, prevent aspiration), protect the head from injury, time the seizure, and note characteristics. NEVER restrain (fracture risk) or put anything in the mouth (aspiration risk, broken teeth).",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-2",
    type: "question",
    question: "Status epilepticus is defined as continuous seizure activity lasting longer than:",
    options: ["1 minute", "5 minutes", "15 minutes", "30 minutes"],
    correctIndex: 1,
    answer: "Status epilepticus = continuous seizure activity >5 minutes or two or more seizures without return to baseline consciousness. After 5 minutes, GABA-A receptors internalize (reducing inhibition), making seizures progressively harder to treat. Immediate benzodiazepine is required.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-3",
    type: "question",
    question: "What is the first-line medication for status epilepticus?",
    options: ["Phenytoin IV", "Lorazepam 0.1 mg/kg IV (max 4 mg)", "Valproic acid", "Phenobarbital"],
    correctIndex: 1,
    answer: "Lorazepam is first-line for status epilepticus: 0.1 mg/kg IV (max 4 mg per dose). Faster onset and longer brain duration than diazepam. May repeat once after 5 minutes if seizure continues. Have resuscitation equipment ready for respiratory depression.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-4",
    type: "question",
    question: "A patient on phenytoin develops nystagmus and ataxia. What do these findings indicate?",
    options: ["Therapeutic effect", "Phenytoin toxicity — check drug level immediately", "Need for dose increase", "Unrelated condition"],
    correctIndex: 1,
    answer: "Nystagmus is the FIRST sign of phenytoin toxicity, followed by ataxia, slurred speech, and lethargy. Check level immediately (therapeutic: 10-20 mcg/mL). Phenytoin has zero-order kinetics — small dose changes can cause disproportionate level increases.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-5",
    type: "question",
    question: "Why does phenytoin follow zero-order kinetics and why is this clinically important?",
    options: ["All drugs follow zero-order kinetics", "At therapeutic levels, metabolic enzymes are saturated — small dose increases cause disproportionately large level increases", "It has no clinical importance", "Zero-order means the drug is inactive"],
    correctIndex: 1,
    answer: "Most drugs follow first-order kinetics (elimination proportional to concentration). Phenytoin follows zero-order at therapeutic levels — enzymes are saturated, so small dose increases cause disproportionately large level rises, increasing toxicity risk. Frequent monitoring is essential.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-sz-6",
    type: "question",
    question: "Phenytoin must NEVER be mixed with which IV solution?",
    options: ["Normal saline", "Dextrose solutions — causes precipitation", "Lactated Ringer's", "Sterile water"],
    correctIndex: 1,
    answer: "Phenytoin precipitates in dextrose-containing solutions due to its alkaline pH. It must only be mixed with and administered in normal saline. Using dextrose causes crystallization that can occlude IV lines and cause emboli.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-7",
    type: "question",
    question: "What is the kindling model of epilepsy?",
    options: ["A treatment approach", "Repeated subthreshold stimuli progressively lower seizure threshold until spontaneous seizures occur", "A diagnostic test", "A medication side effect"],
    correctIndex: 1,
    answer: "Kindling describes how each seizure causes cellular changes (synaptic reorganization, receptor changes) that make future seizures more likely and more severe. This 'seizures beget seizures' concept supports the rationale for early, aggressive anticonvulsant therapy.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-sz-8",
    type: "question",
    question: "What are the primary neurotransmitters involved in seizure generation?",
    options: ["Serotonin and dopamine", "Excess glutamate (excitatory) and deficient GABA (inhibitory)", "Acetylcholine only", "Norepinephrine and histamine"],
    correctIndex: 1,
    answer: "Seizures result from excitatory-inhibitory imbalance: excess glutamate (activates NMDA/AMPA receptors, causing sodium/calcium influx and depolarization) and/or deficient GABA (normally hyperpolarizes neurons through chloride channel opening). This imbalance causes hypersynchronous neuronal firing.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-9",
    type: "question",
    question: "A patient post-seizure has focal left arm weakness that is gradually resolving. What is this called?",
    options: ["Stroke", "Todd paralysis — transient post-ictal focal weakness", "Permanent paralysis", "Conversion disorder"],
    correctIndex: 1,
    answer: "Todd paralysis is transient post-ictal focal weakness that can mimic stroke. It typically resolves within 24-48 hours and follows a witnessed seizure. Key differentiator from stroke: temporal relationship to seizure and complete resolution.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-10",
    type: "question",
    question: "Why is levetiracetam (Keppra) increasingly preferred in clinical practice?",
    options: ["It is the cheapest option", "No drug level monitoring needed, IV/PO bioequivalence, minimal drug interactions", "It has no side effects", "It works fastest"],
    correctIndex: 1,
    answer: "Levetiracetam advantages: no therapeutic drug monitoring required, IV and PO doses are bioequivalent (easy transitions), minimal drug interactions (not hepatically metabolized via CYP), renal clearance, and broad spectrum efficacy. However, watch for 'Keppra rage' (behavioral changes).",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-11",
    type: "question",
    question: "Which oral hygiene education is critical for patients taking phenytoin?",
    options: ["No special care needed", "Meticulous oral hygiene to prevent gingival hyperplasia, a common side effect", "Avoid brushing teeth", "Use mouthwash only"],
    correctIndex: 1,
    answer: "Gingival hyperplasia (overgrowth of gum tissue) is a characteristic side effect of phenytoin, especially with poor oral hygiene. Patients should brush and floss regularly, have dental check-ups every 6 months, and massage gums to reduce overgrowth.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-12",
    type: "question",
    question: "Why is valproic acid teratogenic and what alternative should be used in women of childbearing age?",
    options: ["Valproate is safe in pregnancy", "Valproate causes neural tube defects; levetiracetam or lamotrigine preferred", "All AEDs are equally teratogenic", "Phenytoin is safer"],
    correctIndex: 1,
    answer: "Valproic acid is highly teratogenic, causing neural tube defects (spina bifida) in 1-2% of exposed pregnancies. For women of childbearing age, levetiracetam or lamotrigine are preferred. All women on AEDs need folic acid supplementation (4 mg/day before conception).",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-13",
    type: "question",
    question: "What differentiates an absence seizure from a complex partial seizure?",
    options: ["They are identical", "Absence: brief (5-30 sec) staring with no post-ictal phase; complex partial: longer, may have automatisms, with post-ictal confusion", "Absence is longer", "Complex partial has no aura"],
    correctIndex: 1,
    answer: "Absence (petit mal): abrupt onset staring spell lasting 5-30 seconds, common in children, no post-ictal confusion, may have subtle eyelid fluttering. Complex partial (focal with impaired awareness): longer episodes, automatisms (lip smacking, picking), post-ictal confusion.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-14",
    type: "question",
    question: "Alcohol withdrawal seizures typically occur how many hours after the last drink?",
    options: ["1-6 hours", "12-48 hours", "72-96 hours", "7-10 days"],
    correctIndex: 1,
    answer: "Alcohol withdrawal seizures typically occur 12-48 hours after the last drink. They are usually generalized tonic-clonic and may progress to status epilepticus. Treatment: benzodiazepines (lorazepam, chlordiazepoxide). Note: benzodiazepines are appropriate for alcohol withdrawal delirium (unlike other causes of delirium).",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-15",
    type: "question",
    question: "What seizure precautions should be implemented for hospitalized patients at risk?",
    options: ["No special precautions", "Padded side rails, suction at bedside, oxygen available, bed in low position, IV access maintained", "Restraints on all extremities", "Dim room lights only"],
    correctIndex: 1,
    answer: "Seizure precautions: padded side rails (up), suction equipment at bedside, supplemental oxygen available, bed in lowest position, IV access maintained, and bite block NOT placed in advance (only available at bedside). Remove sharp objects from environment.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-16",
    type: "question",
    question: "An elevated prolactin level 10-20 minutes after an event helps differentiate:",
    options: ["Stroke from TIA", "Epileptic seizure from psychogenic non-epileptic seizure (PNES)", "MI from angina", "Infection from inflammation"],
    correctIndex: 1,
    answer: "Prolactin is transiently elevated 10-20 minutes after epileptic seizures (generalized tonic-clonic and complex partial) but NOT after psychogenic non-epileptic seizures (PNES). This helps differentiate when EEG is not immediately available.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-sz-17",
    type: "question",
    question: "What documentation should the nurse include after witnessing a seizure?",
    options: ["Only the time it ended", "Seizure type, duration, body parts involved, pre-ictal aura, ictal movements, post-ictal state, vital signs", "Only the medication given", "Patient's insurance information"],
    correctIndex: 1,
    answer: "Comprehensive seizure documentation: time of onset, duration, pre-ictal aura/activity, body parts involved (focal or generalized), type of movements (tonic, clonic), LOC changes, incontinence, post-ictal state and duration, vital signs, and interventions performed.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-18",
    type: "question",
    question: "What is the status epilepticus treatment pathway?",
    options: ["Phenytoin → lorazepam → pentobarbital", "Lorazepam → fosphenytoin/levetiracetam/valproate → continuous infusion (midazolam/propofol/pentobarbital)", "Only benzodiazepines", "Surgery first"],
    correctIndex: 1,
    answer: "SE treatment ladder: 1st-line: lorazepam IV. 2nd-line (if seizure persists): fosphenytoin, levetiracetam, or valproate IV. 3rd-line (refractory): continuous infusion of midazolam, propofol, or pentobarbital with continuous EEG monitoring.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-19",
    type: "question",
    question: "Which metabolic disturbance is the most common cause of provoked seizures in hospitalized patients?",
    options: ["Hyperkalemia", "Hypoglycemia and hyponatremia", "Hypercalcemia", "Hypermagnesemia"],
    correctIndex: 1,
    answer: "Hypoglycemia and hyponatremia are the most common metabolic causes of provoked seizures. Always check blood glucose and electrolytes (sodium, calcium, magnesium) in new-onset seizures. Correcting the metabolic abnormality may be the only treatment needed.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-20",
    type: "question",
    question: "What should the nurse teach a patient with epilepsy about driving?",
    options: ["No driving restrictions", "Most jurisdictions require a seizure-free period (usually 3-12 months) before driving is permitted", "Driving is always prohibited", "Only drive during daytime"],
    correctIndex: 1,
    answer: "Most jurisdictions require a seizure-free period (typically 3-12 months, varies by location) before driving is permitted. Patients must understand this legal requirement and report seizures. Medication adherence is critical for maintaining driving eligibility.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-21",
    type: "question",
    question: "What complication can result from prolonged tonic-clonic seizure activity?",
    options: ["Improved muscle strength", "Rhabdomyolysis — check CK levels and watch for dark urine", "Weight loss", "Enhanced memory"],
    correctIndex: 1,
    answer: "Prolonged tonic-clonic seizures cause sustained skeletal muscle contraction leading to rhabdomyolysis (muscle breakdown). Released myoglobin can cause acute kidney injury. Monitor CK levels and urine color. Aggressive hydration protects the kidneys.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-22",
    type: "question",
    question: "What is the paroxysmal depolarization shift (PDS)?",
    options: ["An ECG finding", "A large sustained neuronal depolarization (30-50 mV) that is the fundamental cellular event underlying seizure generation", "A blood pressure pattern", "A medication side effect"],
    correctIndex: 1,
    answer: "The PDS is a 30-50 mV depolarization lasting 50-200 ms caused by excessive glutamate-mediated calcium and sodium influx through NMDA/AMPA receptors. When the PDS propagates beyond inhibitory surround and recruits adjacent neurons, a clinical seizure occurs.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-sz-23",
    type: "question",
    question: "What patient statement indicates understanding of seizure precautions?",
    options: ["I can stop my medication once seizure-free for 2 months", "I will take my medication at the same time every day, avoid sleep deprivation, and not drink alcohol", "I should restrain myself when I feel an aura", "I can swim alone as long as I take my medication"],
    correctIndex: 1,
    answer: "Consistent medication timing maintains therapeutic levels. Sleep deprivation and alcohol both lower seizure threshold. AEDs should never be abruptly stopped (risk of SE). Patients should swim with a buddy, wear medical ID, and avoid known triggers.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-sz-24",
    type: "question",
    question: "What side effect of levetiracetam (Keppra) is colloquially called 'Keppra rage'?",
    options: ["Headache", "Behavioral changes including irritability, aggression, and mood disturbance", "Rash", "Sedation"],
    correctIndex: 1,
    answer: "Behavioral changes (irritability, aggression, emotional lability) affect some patients on levetiracetam, especially in the first weeks. This 'Keppra rage' should be monitored and reported. Dose adjustment or switching to another AED may be needed.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-sz-25",
    type: "question",
    question: "What is a vagus nerve stimulator (VNS) and when is it used?",
    options: ["A type of pacemaker", "An implanted device that stimulates the vagus nerve to reduce seizure frequency in drug-resistant epilepsy", "An EEG machine", "A medication pump"],
    correctIndex: 1,
    answer: "VNS is an implanted device that delivers programmable electrical stimulation to the left vagus nerve. It is indicated for drug-resistant epilepsy when surgery is not an option. It typically reduces seizure frequency by 30-50% but rarely eliminates seizures completely.",
    category: "Neurological",
    difficulty: 2
  },

  // ============================================================
  // MENINGITIS (25 cards)
  // ============================================================
  {
    id: "rn-pcn-mn-1",
    type: "question",
    question: "What is the MOST time-sensitive intervention for suspected bacterial meningitis?",
    options: ["Lumbar puncture", "CT scan", "Administer empiric IV antibiotics immediately", "Blood cultures"],
    correctIndex: 2,
    answer: "Empiric IV antibiotics must be administered IMMEDIATELY. Mortality increases approximately 30% for each hour of antibiotic delay. Blood cultures can be drawn simultaneously, but NEVER delay antibiotics for LP, CT, or any other test.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-mn-2",
    type: "question",
    question: "What CSF findings are characteristic of bacterial meningitis?",
    options: ["Lymphocytic pleocytosis, normal glucose", "Neutrophilic pleocytosis, decreased glucose, elevated protein", "Normal CSF", "Elevated RBCs with xanthochromia"],
    correctIndex: 1,
    answer: "Bacterial meningitis CSF: WBC >1000/microL (predominantly neutrophils), decreased glucose (<40 or CSF:serum ratio <0.4 — bacteria and neutrophils consume glucose), elevated protein (>45 mg/dL from BBB disruption). Gram stain positive in 60-90%.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-3",
    type: "question",
    question: "When should dexamethasone be given relative to antibiotics in bacterial meningitis?",
    options: ["24 hours after antibiotics", "15-20 minutes BEFORE or simultaneously with the first antibiotic dose", "Only after culture results", "It is not used in meningitis"],
    correctIndex: 1,
    answer: "Dexamethasone must be given 15-20 min BEFORE or WITH the first antibiotic dose. It reduces the inflammatory surge from antibiotic-induced bacterial cell wall lysis. Starting after antibiotics provides NO benefit. Reduces mortality and hearing loss in pneumococcal meningitis.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-4",
    type: "question",
    question: "What isolation precautions are required for suspected meningococcal meningitis?",
    options: ["Standard precautions only", "Droplet precautions until N. meningitidis ruled out or 24 hours of effective antibiotics", "Airborne precautions", "Contact precautions"],
    correctIndex: 1,
    answer: "Droplet precautions (surgical mask within 3 feet) are required for suspected meningococcal meningitis until N. meningitidis is ruled out or the patient has been on effective antibiotics for 24 hours. This protects healthcare workers from respiratory droplet transmission.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-mn-5",
    type: "question",
    question: "The classic triad of bacterial meningitis (fever, nuchal rigidity, altered mental status) is present in what percentage of patients?",
    options: [">90%", "<50%", "75%", "100%"],
    correctIndex: 1,
    answer: "The classic triad is present in fewer than 50% of patients. Maintain a high index of suspicion even without all three components. Headache with any two of fever, nuchal rigidity, or altered MS should prompt meningitis workup.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-6",
    type: "question",
    question: "What is Kernig sign?",
    options: ["Pain with neck flexion causing hip flexion", "Resistance and pain with knee extension when the hip is flexed 90 degrees", "A rash pattern", "An eye movement abnormality"],
    correctIndex: 1,
    answer: "Kernig sign: with the patient supine and hip flexed to 90°, attempt to extend the knee. Resistance or pain indicates meningeal irritation. Low sensitivity (5-30%) but high specificity when positive. Must be assessed bilaterally.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-mn-7",
    type: "question",
    question: "What is Brudzinski sign?",
    options: ["Pain with leg extension", "Involuntary hip and knee flexion when the neck is passively flexed", "A cardiac rhythm change", "An abdominal reflex"],
    correctIndex: 1,
    answer: "Brudzinski sign: when the neck is passively flexed (chin toward chest), involuntary hip and knee flexion occurs bilaterally. This indicates meningeal irritation from inflammation of the meninges. Like Kernig, it has low sensitivity but high specificity.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-mn-8",
    type: "question",
    question: "Why should a CT scan be obtained BEFORE lumbar puncture in certain patients with suspected meningitis?",
    options: ["CT always required before LP", "In patients with papilledema, focal deficits, altered consciousness, immunocompromise, or seizures — to rule out mass lesion/herniation risk", "CT is never needed before LP", "To confirm meningitis diagnosis"],
    correctIndex: 1,
    answer: "CT before LP is needed if there is risk of increased ICP or mass lesion: papilledema, focal neuro deficits, altered consciousness, immunocompromised, or seizures. LP in the presence of a mass can cause fatal brain herniation. But NEVER delay antibiotics for CT.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-9",
    type: "question",
    question: "A petechial rash progressing to purpura in a patient with meningitis suggests infection with which organism?",
    options: ["Streptococcus pneumoniae", "Neisseria meningitidis (meningococcemia)", "Haemophilus influenzae", "Listeria monocytogenes"],
    correctIndex: 1,
    answer: "Petechial/purpuric rash in meningitis is characteristic of meningococcemia (N. meningitidis). The rash indicates DIC and endothelial damage from meningococcal endotoxin. This can rapidly progress to Waterhouse-Friderichsen syndrome (bilateral adrenal hemorrhage) and septic shock.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-10",
    type: "question",
    question: "What empiric antibiotic regimen is recommended for community-acquired bacterial meningitis in adults?",
    options: ["Amoxicillin alone", "Ceftriaxone + vancomycin ± ampicillin (if Listeria risk)", "Azithromycin", "Metronidazole"],
    correctIndex: 1,
    answer: "Empiric: ceftriaxone (covers pneumococcus and meningococcus) + vancomycin (covers penicillin-resistant pneumococcus) ± ampicillin for Listeria coverage (if >50 years, immunocompromised, or alcoholic). Tailor once culture and sensitivity results return.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-11",
    type: "question",
    question: "What prophylaxis should be given to close contacts of a patient with meningococcal meningitis?",
    options: ["No prophylaxis needed", "Ciprofloxacin (single dose) or rifampin (2-day course)", "Full antibiotic treatment course", "Vaccination only"],
    correctIndex: 1,
    answer: "Close contacts (household, daycare, direct exposure to secretions) of meningococcal patients need chemoprophylaxis: ciprofloxacin 500 mg single dose (adults) or rifampin 600 mg q12h × 2 days. This eliminates nasopharyngeal carriage and prevents secondary cases.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-12",
    type: "question",
    question: "Red Man syndrome can occur with rapid IV vancomycin infusion. What causes it?",
    options: ["Allergic reaction", "Histamine release from mast cell degranulation — not a true allergy", "Drug-drug interaction", "Overdose"],
    correctIndex: 1,
    answer: "Red Man syndrome is a histamine-mediated reaction (NOT true allergy) from rapid vancomycin infusion causing flushing, erythema, and pruritus of the upper body. Prevented by infusing over ≥60 minutes. Not a contraindication to future vancomycin use.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-13",
    type: "question",
    question: "What vancomycin trough level is targeted for meningitis treatment?",
    options: ["5-10 mcg/mL", "10-15 mcg/mL", "15-20 mcg/mL", "25-30 mcg/mL"],
    correctIndex: 2,
    answer: "Meningitis requires higher vancomycin trough targets (15-20 mcg/mL) than standard infections because CSF penetration is limited even with inflamed meninges. Monitor troughs regularly and assess renal function. Higher levels increase nephrotoxicity risk.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-14",
    type: "question",
    question: "What is the blood-brain barrier and why is it relevant in meningitis?",
    options: ["A physical wall in the skull", "Specialized endothelial tight junctions that normally prevent pathogen entry; disrupted in meningitis allowing inflammation and edema", "A medication classification", "A type of brain imaging"],
    correctIndex: 1,
    answer: "The BBB is formed by cerebral endothelial tight junctions, pericytes, and astrocyte end-feet. It normally prevents pathogen entry. In meningitis, bacteria breach the BBB, and the inflammatory response further disrupts it, causing vasogenic edema, increased ICP, and allowing antibiotic penetration.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-15",
    type: "question",
    question: "How does viral meningitis CSF differ from bacterial meningitis CSF?",
    options: ["They are identical", "Viral: lymphocytic pleocytosis, normal glucose, mildly elevated protein vs Bacterial: neutrophilic, low glucose, high protein", "Viral has higher protein", "Viral has lower WBC but lower glucose"],
    correctIndex: 1,
    answer: "Viral meningitis CSF: lymphocytes predominant, normal glucose (viruses don't consume glucose like bacteria), mildly elevated protein. Viral meningitis is self-limiting in immunocompetent patients. Bacterial meningitis: neutrophils, low glucose, high protein — medical emergency.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-16",
    type: "question",
    question: "SIADH is a common complication of meningitis. What electrolyte abnormality results?",
    options: ["Hypernatremia", "Hyponatremia from excessive ADH-mediated water retention", "Hyperkalemia", "Hypocalcemia"],
    correctIndex: 1,
    answer: "Meningitis can cause SIADH (syndrome of inappropriate ADH secretion), leading to excessive free water retention and dilutional hyponatremia. Monitor sodium levels closely and implement fluid restriction if Na+ drops. Correct slowly to prevent osmotic demyelination syndrome.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-17",
    type: "question",
    question: "Why is dexamethasone specifically beneficial in pneumococcal meningitis?",
    options: ["It kills the bacteria", "It reduces the intense inflammatory response from pneumococcal cell wall lysis, decreasing mortality and hearing loss", "It improves antibiotic penetration", "It prevents seizures"],
    correctIndex: 1,
    answer: "Pneumococcal meningitis elicits the most intense inflammatory response. Dexamethasone suppresses this inflammation (reduces TNF-alpha, IL-1beta, BBB permeability), decreasing vasogenic edema and ICP. Clinical trials showed reduced mortality and hearing loss specifically in pneumococcal meningitis.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-mn-18",
    type: "question",
    question: "What hearing complication should be screened for after bacterial meningitis?",
    options: ["Tinnitus only", "Sensorineural hearing loss — audiometric testing recommended before discharge", "Hearing is never affected", "Only conductive hearing loss"],
    correctIndex: 1,
    answer: "Sensorineural hearing loss is the most common permanent sequela of bacterial meningitis (up to 30% of pneumococcal meningitis cases). Inflammation damages the cochlear nerve and inner ear structures. Audiometric testing is recommended before discharge.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-19",
    type: "question",
    question: "What environmental modifications should the nurse implement for a patient with meningitis?",
    options: ["Bright lights and stimulation", "Dim, quiet environment due to photophobia and phonophobia", "No modifications needed", "Cold room temperature"],
    correctIndex: 1,
    answer: "Meningeal inflammation causes intense photophobia (light sensitivity) and phonophobia (noise sensitivity). Maintain a dim, quiet environment, minimize unnecessary stimulation, and provide sunglasses if needed. These are comfort measures that also reduce ICP-aggravating stimuli.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-mn-20",
    type: "question",
    question: "Procalcitonin levels can help differentiate bacterial from viral meningitis. How?",
    options: ["Elevated in viral meningitis", "Elevated in bacterial infections; remains low in viral infections", "Elevated in both equally", "Not useful in meningitis"],
    correctIndex: 1,
    answer: "Procalcitonin is elevated in bacterial infections but remains low in viral infections. This biomarker can help guide antibiotic decisions: a low procalcitonin with lymphocytic CSF supports viral meningitis, potentially allowing earlier antibiotic discontinuation.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-21",
    type: "question",
    question: "Which age group receives ampicillin in addition to ceftriaxone and vancomycin for empiric meningitis coverage?",
    options: ["All ages", "Adults >50 years, immunocompromised, or alcoholic — for Listeria monocytogenes coverage", "Only neonates", "Only children"],
    correctIndex: 1,
    answer: "Ampicillin is added for Listeria monocytogenes coverage in patients >50 years, immunocompromised, or alcoholic. Listeria is an intracellular pathogen resistant to cephalosporins. Third-generation cephalosporins alone do NOT cover Listeria.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-22",
    type: "question",
    question: "What is the Monro-Kellie doctrine and how does it relate to meningitis?",
    options: ["A treatment protocol", "The skull is a fixed compartment; increases in brain, blood, or CSF volume must be offset or ICP rises", "A diagnostic test", "An antibiotic guideline"],
    correctIndex: 1,
    answer: "The Monro-Kellie doctrine states that the skull is a rigid box containing brain tissue, blood, and CSF. An increase in any component must be compensated by a decrease in another. In meningitis, cerebral edema and impaired CSF absorption increase volume, raising ICP.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-mn-23",
    type: "question",
    question: "Cranial nerve palsies (especially CN III, VI, VII) can occur in bacterial meningitis due to:",
    options: ["Direct bacterial invasion of the nerve", "Basal exudate (purulent material) surrounding and compressing cranial nerves at the base of the brain", "Medication side effects", "Dehydration"],
    correctIndex: 1,
    answer: "Purulent exudate accumulates in the basal cisterns and subarachnoid space, surrounding and compressing cranial nerves as they traverse the base of the brain. CN VI (abducens) is most vulnerable due to its long intracranial course. Cranial nerve deficits may be temporary or permanent.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-mn-24",
    type: "question",
    question: "What type of hydrocephalus can develop as a complication of bacterial meningitis?",
    options: ["Normal pressure hydrocephalus", "Communicating hydrocephalus from impaired CSF absorption at arachnoid granulations blocked by inflammatory exudate", "Congenital hydrocephalus", "Hydrocephalus ex vacuo"],
    correctIndex: 1,
    answer: "Communicating hydrocephalus develops when inflammatory exudate and debris block CSF absorption at the arachnoid granulations. This causes CSF accumulation and increased ICP. May require external ventricular drain or permanent VP shunt. Monitor for signs of increased ICP.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-mn-25",
    type: "question",
    question: "What is the nurse's role regarding meningococcal vaccination?",
    options: ["Vaccination is not recommended", "Educate about meningococcal vaccination for high-risk groups: college students, military, asplenic patients, complement-deficient", "Only physicians can discuss vaccination", "Vaccination is only for infants"],
    correctIndex: 1,
    answer: "Meningococcal vaccination (MenACWY and MenB) is recommended for adolescents (11-12 with booster at 16), college freshmen in dormitories, military recruits, travelers to endemic areas, and immunocompromised patients (asplenia, complement deficiency).",
    category: "Neurological",
    difficulty: 1
  },

  // ============================================================
  // PARKINSON DISEASE (25 cards)
  // ============================================================
  {
    id: "rn-pcn-pd-1",
    type: "question",
    question: "What is the TRAP mnemonic for Parkinson disease cardinal features?",
    options: ["Temperature, Rash, Agitation, Pain", "Tremor (resting), Rigidity (cogwheel), Akinesia/bradykinesia, Postural instability", "Tachycardia, Respiration, Anxiety, Pallor", "Tremor, Rash, Aphasia, Paralysis"],
    correctIndex: 1,
    answer: "TRAP: Tremor (4-6 Hz resting pill-rolling, improves with intention), Rigidity (cogwheel or lead-pipe resistance), Akinesia/bradykinesia (slow movement, decreased amplitude), Postural instability (impaired balance, falls). Bradykinesia is required for diagnosis.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-2",
    type: "question",
    question: "Why must carbidopa-levodopa be taken 30 minutes before meals?",
    options: ["It works better on a full stomach", "Dietary protein (amino acids) competes with levodopa for intestinal and BBB transport", "It causes nausea with food", "Timing does not matter"],
    correctIndex: 1,
    answer: "Levodopa is a large neutral amino acid that uses the same intestinal absorption and blood-brain barrier transport system as dietary protein. High-protein meals compete for these transporters, reducing levodopa absorption and CNS delivery, worsening motor symptoms.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-3",
    type: "question",
    question: "What happens if carbidopa-levodopa is abruptly discontinued?",
    options: ["No effect", "Life-threatening crisis resembling neuroleptic malignant syndrome (severe rigidity, hyperthermia, altered consciousness)", "Immediate symptom relief", "Only mild tremor returns"],
    correctIndex: 1,
    answer: "Abrupt levodopa discontinuation can precipitate a life-threatening parkinsonism-hyperpyrexia syndrome resembling NMS: severe rigidity, hyperthermia, altered consciousness, autonomic instability, and elevated CK. Levodopa must NEVER be stopped abruptly.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-4",
    type: "question",
    question: "A patient on pramipexole develops new compulsive gambling. What should the nurse do?",
    options: ["Ignore it as coincidence", "Report to the provider — impulse control disorders are a known side effect of dopamine agonists", "Increase the dose", "Refer to financial counseling only"],
    correctIndex: 1,
    answer: "Impulse control disorders (gambling, hypersexuality, compulsive shopping/eating) affect 15-20% of patients on dopamine agonists (pramipexole, ropinirole). This is a pharmacological side effect, not a personality flaw. Provider notification is essential for dose reduction or medication change.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-5",
    type: "question",
    question: "What non-motor symptoms often precede Parkinson disease motor symptoms by years?",
    options: ["Hearing loss and vision changes", "Constipation, anosmia, REM sleep behavior disorder, depression", "Headaches and fever", "Joint pain and swelling"],
    correctIndex: 1,
    answer: "Non-motor prodromal symptoms include: constipation (vagal motor nucleus involvement), anosmia/hyposmia (olfactory bulb pathology), REM sleep behavior disorder (acting out dreams), depression, and anxiety. These can precede motor symptoms by 5-10+ years per Braak staging.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-6",
    type: "question",
    question: "What percentage of dopaminergic neurons must be lost before motor symptoms of PD appear?",
    options: ["10-20%", "30-40%", "60-80%", "95-100%"],
    correctIndex: 2,
    answer: "Motor symptoms appear when approximately 60-80% of dopaminergic neurons in the substantia nigra pars compacta are lost. This indicates substantial presymptomatic neurodegeneration, which is why biomarker research for early detection is critical.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-7",
    type: "question",
    question: "What is the 'on-off' phenomenon in Parkinson disease?",
    options: ["A type of tremor", "Sudden unpredictable fluctuations between mobile ('on') and immobile ('off') states", "A medication allergy", "A surgical complication"],
    correctIndex: 1,
    answer: "The on-off phenomenon develops after years of levodopa therapy: sudden, unpredictable switches between good mobility ('on' state) and severe immobility/rigidity ('off' state), independent of medication timing. Caused by progressive dopaminergic neuron loss and altered receptor sensitivity.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-8",
    type: "question",
    question: "What are Lewy bodies and what are they composed of?",
    options: ["White blood cells in the brain", "Intracytoplasmic inclusions composed of misfolded alpha-synuclein protein — the pathological hallmark of PD", "Calcium deposits", "Blood clots in brain vessels"],
    correctIndex: 1,
    answer: "Lewy bodies are intracellular eosinophilic inclusions made primarily of misfolded alpha-synuclein protein aggregates surrounded by ubiquitin. They are the pathological hallmark of PD and are directly neurotoxic through mitochondrial dysfunction, oxidative stress, and proteasomal impairment.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-9",
    type: "question",
    question: "Carbidopa-levodopa is the gold standard treatment for PD. What does carbidopa do?",
    options: ["Converts to dopamine in the brain", "Prevents peripheral conversion of levodopa to dopamine, reducing nausea and increasing CNS availability", "Crosses the BBB independently", "Blocks dopamine receptors"],
    correctIndex: 1,
    answer: "Carbidopa is a peripheral decarboxylase inhibitor — it blocks conversion of levodopa to dopamine OUTSIDE the brain. This reduces peripheral side effects (nausea, vomiting, hypotension) and increases the amount of levodopa available to cross the BBB.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-10",
    type: "question",
    question: "What is micrographia and what does it indicate?",
    options: ["Large handwriting", "Progressively smaller handwriting — a manifestation of bradykinesia in Parkinson disease", "Illegible handwriting from tremor", "Fast writing"],
    correctIndex: 1,
    answer: "Micrographia is progressively smaller, cramped handwriting that is a hallmark of PD bradykinesia. It reflects the progressive reduction in movement amplitude that occurs with repetitive actions. Often one of the earliest noticeable motor changes.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-11",
    type: "question",
    question: "What does 'masked facies' or hypomimia refer to in PD?",
    options: ["A facial rash", "Decreased facial expression due to bradykinesia of facial muscles, making the patient appear emotionless", "Facial pain", "Facial swelling"],
    correctIndex: 1,
    answer: "Masked facies (hypomimia) is the loss of spontaneous facial expression due to bradykinesia of facial muscles. Patients appear emotionless or expressionless despite normal emotions. This can be mistaken for depression and affects social interactions.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-12",
    type: "question",
    question: "What is the role of entacapone (Comtan) in PD management?",
    options: ["Replaces dopamine directly", "Inhibits COMT enzyme, preventing peripheral levodopa metabolism and extending its duration of action", "Blocks dopamine receptors", "Treats depression"],
    correctIndex: 1,
    answer: "Entacapone is a peripheral COMT inhibitor that blocks catechol-O-methyltransferase from metabolizing levodopa peripherally. This extends levodopa's plasma half-life and brain availability, reducing 'off' time by 1-2 hours/day. Must be given WITH each levodopa dose.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-13",
    type: "question",
    question: "Patients on entacapone should be warned about what harmless but alarming side effect?",
    options: ["Hair color change", "Orange-brown urine discoloration", "Blue skin", "Red tears"],
    correctIndex: 1,
    answer: "Entacapone causes harmless orange-brown discoloration of urine due to its metabolites. Patients should be warned in advance to prevent unnecessary alarm or emergency visits. This does not indicate liver damage or blood in the urine.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-14",
    type: "question",
    question: "What type of tremor is characteristic of Parkinson disease?",
    options: ["Intention tremor (worsens reaching for objects)", "Resting tremor at 4-6 Hz ('pill-rolling'), improves with intentional movement", "Action tremor", "Postural tremor only"],
    correctIndex: 1,
    answer: "PD tremor is characteristically a resting tremor at 4-6 Hz with a 'pill-rolling' quality (thumb and index finger) that improves with intentional movement. This distinguishes it from essential tremor (action/postural tremor) and cerebellar tremor (intention tremor).",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-15",
    type: "question",
    question: "What is deep brain stimulation (DBS) and when is it indicated?",
    options: ["A medication", "Surgical implantation of electrodes in the subthalamic nucleus or GPi for motor fluctuations refractory to medication", "A type of MRI", "An exercise program"],
    correctIndex: 1,
    answer: "DBS involves surgically implanting electrodes in the subthalamic nucleus or globus pallidus interna, connected to a programmable pulse generator. Indicated for motor fluctuations (on-off, dyskinesias) refractory to optimal medication management. Does not cure PD but significantly improves motor symptoms.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-16",
    type: "question",
    question: "What is the most dangerous motor complication of PD that nursing interventions should focus on?",
    options: ["Tremor", "Falls from postural instability and gait impairment", "Micrographia", "Hypomimia"],
    correctIndex: 1,
    answer: "Falls are the most dangerous motor complication of PD. Postural instability, freezing of gait, orthostatic hypotension, and shuffle gait all contribute. Fall prevention includes PT for gait training, home safety assessment, assistive devices, and orthostatic precautions.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-17",
    type: "question",
    question: "What does the DaTscan imaging study show in Parkinson disease?",
    options: ["Brain tumors", "Reduced dopamine transporter uptake in the striatum, confirming dopaminergic deficit", "Blood flow patterns", "Electrical brain activity"],
    correctIndex: 1,
    answer: "DaTscan (dopamine transporter SPECT imaging) shows reduced uptake of radiotracer in the striatum (caudate and putamen), confirming presynaptic dopaminergic neuron loss. It helps differentiate PD from essential tremor and drug-induced parkinsonism (where DaTscan is normal).",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-18",
    type: "question",
    question: "Orthostatic hypotension is a common autonomic symptom in PD. How should the nurse assess for it?",
    options: ["Check BP only when seated", "Check lying and standing BP — a drop of ≥20 mmHg systolic or ≥10 mmHg diastolic is significant", "Check BP only once daily", "Orthostatic hypotension does not occur in PD"],
    correctIndex: 1,
    answer: "Orthostatic hypotension in PD results from autonomic nervous system degeneration and is worsened by dopaminergic medications. Check BP lying then standing (after 3 minutes). A drop ≥20 systolic or ≥10 diastolic is orthostatic hypotension. Manage with slow position changes, compression stockings, adequate fluids.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-19",
    type: "question",
    question: "What are levodopa-induced dyskinesias?",
    options: ["Tremor worsening", "Involuntary choreiform movements during peak levodopa effect, developing after years of therapy", "Muscle rigidity", "Loss of consciousness"],
    correctIndex: 1,
    answer: "Dyskinesias are involuntary, often choreiform (dance-like) movements typically occurring at peak levodopa plasma levels. They develop after 5-10 years of levodopa therapy as dopaminergic neurons continue to degenerate and receptor sensitivity changes. Managed by dose adjustment or adding amantadine.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-20",
    type: "question",
    question: "Why should dopamine agonists be used cautiously regarding driving?",
    options: ["They improve driving ability", "Sudden sleep attacks (somnolence) can occur without warning", "They cause vision changes", "They impair hearing"],
    correctIndex: 1,
    answer: "Dopamine agonists (pramipexole, ropinirole) can cause sudden, irresistible sleep attacks without prior drowsiness. Patients must be warned about this risk before driving or operating machinery. This is a critical patient safety counseling point.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-21",
    type: "question",
    question: "What is cogwheel rigidity?",
    options: ["Smooth resistance to passive movement", "A ratchet-like, jerky resistance felt when passively moving a joint through its range of motion", "Spasticity with clasp-knife pattern", "No resistance to movement"],
    correctIndex: 1,
    answer: "Cogwheel rigidity is a combination of rigidity (sustained resistance) and tremor, felt as a ratchety, jerky resistance when passively moving a limb through its range of motion. It is characteristic of PD and differs from spasticity (velocity-dependent) and lead-pipe rigidity (constant).",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-22",
    type: "question",
    question: "Why is swallowing assessment important in Parkinson disease patients?",
    options: ["Swallowing is never affected", "Dysphagia develops with disease progression, increasing aspiration pneumonia risk", "Only medication swallowing is affected", "Swallowing improves with PD"],
    correctIndex: 1,
    answer: "Dysphagia develops in 80%+ of PD patients as oropharyngeal muscles become bradykinetic. Aspiration pneumonia is a leading cause of death in PD. Regular swallowing assessments, SLP consultation, and dietary modifications (thickened liquids, soft foods) are essential.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-pd-23",
    type: "question",
    question: "What is the Braak staging hypothesis of Parkinson disease progression?",
    options: ["A medication dosing guide", "Alpha-synuclein pathology begins in the olfactory bulb and brainstem, then ascends to substantia nigra (motor symptoms), then cortex (dementia)", "A physical therapy staging system", "A surgical technique"],
    correctIndex: 1,
    answer: "Braak staging proposes that alpha-synuclein pathology begins in peripheral structures (olfactory bulb, gut, dorsal motor nucleus of vagus nerve), explaining early anosmia and constipation. It ascends through the brainstem to the substantia nigra (motor symptoms) and eventually reaches the cortex (cognitive decline).",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-pcn-pd-24",
    type: "question",
    question: "A patient with PD is scheduled for surgery. What is the critical medication consideration?",
    options: ["Stop all PD medications 1 week before", "Carbidopa-levodopa must be continued perioperatively — give via NG tube if NPO", "No special considerations", "Switch all PD meds to IV formulations"],
    correctIndex: 1,
    answer: "Levodopa must be continued throughout the perioperative period. Abrupt discontinuation can trigger parkinsonism-hyperpyrexia syndrome. If the patient is NPO, administer via NG tube (carbidopa-levodopa can be crushed). Coordinate timing with the surgical team.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-pd-25",
    type: "question",
    question: "What exercise interventions have the strongest evidence for benefit in PD?",
    options: ["Bed rest", "Vigorous aerobic exercise, tai chi for balance, and boxing for coordination", "No exercise is beneficial", "Weight lifting only"],
    correctIndex: 1,
    answer: "Exercise is neuroprotective in PD. High-intensity treadmill exercise may slow motor progression. Tai chi improves balance and reduces falls. Boxing programs improve coordination and speed. Physical therapy for gait training is essential. Exercise also improves non-motor symptoms like depression.",
    category: "Neurological",
    difficulty: 1
  },

  // ============================================================
  // DELIRIUM VS DEMENTIA (25 cards)
  // ============================================================
  {
    id: "rn-pcn-dd-1",
    type: "question",
    question: "An 82-year-old who was alert yesterday is now confused, unable to focus, and seeing 'bugs on the wall.' Symptoms fluctuate. What is most likely?",
    options: ["Alzheimer disease", "Delirium", "Depression", "Normal aging"],
    correctIndex: 1,
    answer: "Acute onset (yesterday → today), fluctuating course, inattention, and visual hallucinations are hallmarks of delirium. This requires immediate investigation for the underlying cause: infection (UTI, pneumonia), medication changes, dehydration, metabolic derangement, pain, or urinary retention.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-2",
    type: "question",
    question: "What is the MOST important distinction between delirium and dementia?",
    options: ["Age of onset", "Delirium is acute and reversible; dementia is gradual and irreversible", "Medication response", "Both are the same"],
    correctIndex: 1,
    answer: "Key distinctions: Delirium = acute onset (hours-days), fluctuating course, impaired ATTENTION, and REVERSIBLE when cause is treated. Dementia = gradual onset (months-years), slowly progressive, impaired MEMORY (attention preserved early), and IRREVERSIBLE.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-3",
    type: "question",
    question: "What is the first-line management approach for delirium?",
    options: ["Haloperidol for all patients", "Non-pharmacological interventions: reorientation, consistent caregivers, sleep hygiene, early mobilization", "Physical restraints", "Benzodiazepines"],
    correctIndex: 1,
    answer: "Non-pharmacological interventions are ALWAYS first-line: frequent reorientation, consistent caregivers, normalize sleep-wake cycle, early mobilization, ensure glasses/hearing aids are in place, adequate hydration and nutrition. Medications reserved for dangerous agitation only.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-4",
    type: "question",
    question: "Why should benzodiazepines be AVOIDED in delirium management?",
    options: ["They are too expensive", "They worsen confusion and increase fall risk in elderly patients — except for alcohol/benzodiazepine withdrawal delirium", "They have no effect", "They cause hypertension"],
    correctIndex: 1,
    answer: "Benzodiazepines worsen delirium by increasing sedation, confusion, and fall risk. They further impair already disrupted cholinergic and GABAergic neurotransmission. The ONLY exception is alcohol or benzodiazepine withdrawal delirium, where benzodiazepines are the treatment.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-5",
    type: "question",
    question: "What is the CAM (Confusion Assessment Method) and what does it assess?",
    options: ["A blood test", "A validated screening tool requiring: acute onset + inattention + either disorganized thinking or altered LOC", "A brain scan protocol", "A medication list"],
    correctIndex: 1,
    answer: "The CAM requires: (1) acute onset with fluctuating course AND (2) inattention AND EITHER (3) disorganized thinking OR (4) altered level of consciousness. It is the most widely used validated tool for delirium screening. High sensitivity and specificity.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-6",
    type: "question",
    question: "Which medication class is the most common CAUSE of delirium in elderly patients?",
    options: ["Statins", "Anticholinergic medications (diphenhydramine, oxybutynin, TCAs)", "NSAIDs", "Antihypertensives"],
    correctIndex: 1,
    answer: "Anticholinergic medications are the leading pharmacological cause of delirium. They reduce cholinergic neurotransmission essential for attention and arousal. Common culprits: diphenhydramine (Benadryl), oxybutynin, TCAs, hydroxyzine, promethazine. Use Beers Criteria to identify inappropriate medications.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-7",
    type: "question",
    question: "What is the STRONGEST predisposing risk factor for developing delirium?",
    options: ["Hypertension", "Pre-existing dementia", "Diabetes", "Obesity"],
    correctIndex: 1,
    answer: "Pre-existing dementia is the STRONGEST risk factor for delirium. Patients with dementia have reduced cognitive reserve and are 2-5 times more likely to develop delirium. Delirium superimposed on dementia carries the worst outcomes and is often underrecognized.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-8",
    type: "question",
    question: "What are the three subtypes of delirium?",
    options: ["Mild, moderate, severe", "Hyperactive, hypoactive, and mixed", "Acute, subacute, chronic", "Type 1, 2, 3"],
    correctIndex: 1,
    answer: "Hyperactive delirium: agitation, hallucinations, pulling at lines (often diagnosed). Hypoactive delirium: withdrawn, quiet, somnolent (often MISSED — more common and more dangerous). Mixed: alternating features. Hypoactive has worse prognosis because it is frequently unrecognized.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-9",
    type: "question",
    question: "Why should physical restraints be AVOIDED in delirious patients?",
    options: ["They are not effective", "Restraints increase agitation, injury risk, aspiration risk, and prolong delirium duration", "They are too expensive", "They require a physician order"],
    correctIndex: 1,
    answer: "Physical restraints worsen delirium by increasing agitation (struggling against restraints), prolonging immobility (increases delirium risk), and causing injury (skin breakdown, asphyxiation, shoulder dislocation). Evidence consistently shows restraints increase, not decrease, adverse outcomes.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-10",
    type: "question",
    question: "Donepezil (Aricept) provides what level of benefit in Alzheimer disease?",
    options: ["Cures the disease", "Modest symptomatic improvement (slows decline by 6-12 months) but does NOT halt progression", "Dramatic reversal of symptoms", "No benefit at all"],
    correctIndex: 1,
    answer: "Cholinesterase inhibitors (donepezil) provide modest symptomatic improvement by increasing available acetylcholine. They may slow cognitive decline by 6-12 months but do NOT stop or reverse disease progression. Administer at bedtime to reduce GI side effects.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-11",
    type: "question",
    question: "Why are antipsychotics NEVER used in Lewy body dementia?",
    options: ["They are too expensive", "Extreme neuroleptic sensitivity can cause life-threatening rigidity, obtundation, and death", "They are not available", "They cure the disease too quickly"],
    correctIndex: 1,
    answer: "Patients with Lewy body dementia have extreme sensitivity to antipsychotics (both typical and atypical). Even low doses can cause severe parkinsonism, obtundation, NMS-like reactions, and death. This is a critical safety distinction — ALWAYS check dementia type before administering antipsychotics.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-12",
    type: "question",
    question: "Memantine (Namenda) is indicated for which stage of Alzheimer disease?",
    options: ["Mild only", "Moderate-to-severe", "Prevention in at-risk patients", "All stages equally"],
    correctIndex: 1,
    answer: "Memantine (NMDA receptor antagonist) is indicated for moderate-to-severe Alzheimer disease. It blocks excessive glutamate-mediated excitotoxicity while preserving normal glutamate signaling. Can be combined with cholinesterase inhibitors for additive benefit.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-13",
    type: "question",
    question: "What is 'sundowning' and how does it relate to delirium?",
    options: ["A type of sunburn", "Increased confusion and agitation in late afternoon/evening — often a manifestation of delirium, not just dementia", "Falling asleep early", "Morning confusion only"],
    correctIndex: 1,
    answer: "Sundowning (increased confusion, agitation, and behavioral disturbance in late afternoon/evening) is common in both delirium and dementia. In hospitalized patients, always investigate for delirium rather than simply attributing symptoms to 'sundowning.'",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-14",
    type: "question",
    question: "What is the most common type of dementia?",
    options: ["Vascular dementia", "Lewy body dementia", "Alzheimer disease (60-80% of cases)", "Frontotemporal dementia"],
    correctIndex: 2,
    answer: "Alzheimer disease accounts for 60-80% of all dementia cases. Pathology includes beta-amyloid plaques (extracellular) and tau neurofibrillary tangles (intracellular) causing progressive cortical atrophy. Selective vulnerability of cholinergic neurons in the nucleus basalis of Meynert explains cholinergic deficit.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-15",
    type: "question",
    question: "Vascular dementia has what characteristic cognitive decline pattern?",
    options: ["Gradual smooth decline", "Stepwise decline corresponding to discrete vascular events (strokes or TIAs)", "Rapid onset over hours", "Fluctuating hourly"],
    correctIndex: 1,
    answer: "Vascular dementia shows a stepwise decline: cognitive function worsens suddenly with each new vascular event (stroke or TIA), then plateaus until the next event. Risk factors mirror cardiovascular risk factors: HTN, diabetes, hyperlipidemia, smoking.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-16",
    type: "question",
    question: "What neurotransmitter disruption primarily causes delirium?",
    options: ["Serotonin excess", "Acetylcholine deficiency and dopamine excess", "GABA excess", "Norepinephrine deficiency"],
    correctIndex: 1,
    answer: "Delirium involves primarily acetylcholine deficiency (attention and arousal impairment) and relative dopamine excess (hallucinations, agitation). This explains why anticholinergic medications cause delirium and why low-dose antipsychotics (dopamine blockers) may help in severe cases.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-17",
    type: "question",
    question: "What common causes of delirium should the nurse investigate when a patient becomes acutely confused?",
    options: ["Only medication review", "Infection (UTI, pneumonia), medication changes, dehydration, metabolic derangement, pain, urinary retention, constipation", "Only check blood pressure", "Psychiatric evaluation only"],
    correctIndex: 1,
    answer: "Delirium workup mnemonic: I WATCH DEATH — Infections, Withdrawal, Acute metabolic, Trauma, CNS pathology, Hypoxia, Deficiencies, Endocrine, Acute vascular, Toxins/drugs, Heavy metals. Most common triggers: UTI, pneumonia, medication changes, dehydration, pain.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-18",
    type: "question",
    question: "What is the Beers Criteria and why is it relevant to delirium prevention?",
    options: ["A beer quality standard", "A list of potentially inappropriate medications for elderly patients that increase delirium and adverse event risk", "A dietary guideline", "A restraint protocol"],
    correctIndex: 1,
    answer: "The Beers Criteria (AGS) lists medications that are potentially inappropriate for older adults. Many Beers-listed medications (anticholinergics, benzodiazepines, first-generation antihistamines, muscle relaxants) cause or worsen delirium. Reviewing this list is a key nursing intervention.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-19",
    type: "question",
    question: "How does frontotemporal dementia (FTD) differ from Alzheimer disease in its presentation?",
    options: ["FTD starts with memory loss", "FTD presents with personality changes, behavioral disinhibition, and language deficits before memory loss", "They are identical", "FTD only affects the elderly"],
    correctIndex: 1,
    answer: "FTD primarily affects frontal and temporal lobes, causing early personality changes (apathy, disinhibition, loss of empathy), behavioral disturbances, and language deficits (progressive aphasia). Memory may be relatively preserved early. FTD often affects younger patients (45-65) than Alzheimer disease.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-20",
    type: "question",
    question: "Ensuring sensory aids (glasses, hearing aids) are in place is important for delirium prevention because:",
    options: ["It is a hospital policy only", "Sensory deprivation contributes to disorientation and increases delirium risk", "Patients request it", "It helps with medication compliance only"],
    correctIndex: 1,
    answer: "Sensory deprivation (inability to see or hear) contributes to disorientation, misperception, and delirium. Ensuring glasses and hearing aids are in place is a simple but critical delirium prevention intervention. Also ensure adequate lighting during the day and darkness at night.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-21",
    type: "question",
    question: "When is haloperidol appropriate for delirium management?",
    options: ["As first-line for all delirious patients", "Only for severely agitated delirium when non-pharmacological measures fail and the patient is a danger to self/others", "Never appropriate", "For all dementia patients"],
    correctIndex: 1,
    answer: "Low-dose haloperidol is reserved for severely agitated delirium when non-pharmacological measures fail and the patient poses danger. Use the lowest effective dose for the shortest duration. Monitor QTc. Black box warning: increased mortality in elderly with dementia.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-22",
    type: "question",
    question: "What nursing assessment differentiates delirium from depression in elderly patients?",
    options: ["They cannot be differentiated", "Delirium has fluctuating attention and acute onset; depression has stable, persistent low mood with intact attention", "Depression causes hallucinations", "Both have fluctuating consciousness"],
    correctIndex: 1,
    answer: "Delirium: acute onset, fluctuating attention, disorganized thinking, perceptual disturbances, altered LOC. Depression: gradual onset, stable persistent low mood, psychomotor retardation, intact attention and orientation (until severe). However, depression is also a delirium risk factor.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-pcn-dd-23",
    type: "question",
    question: "What is validation therapy in dementia care?",
    options: ["Telling the patient they are wrong", "Acknowledging and responding to the emotions behind confused statements rather than correcting factual errors", "Ignoring the patient", "Using reality orientation aggressively"],
    correctIndex: 1,
    answer: "Validation therapy acknowledges the emotions behind confused or delusional statements rather than correcting them (which causes frustration and agitation). Example: if a patient says 'I need to go pick up my children,' respond to the underlying emotion: 'You miss your children. Tell me about them.'",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-24",
    type: "question",
    question: "Caregiver burnout is a major concern in dementia care. What should the nurse assess and recommend?",
    options: ["Caregivers always cope well", "Assess for caregiver fatigue, depression, and isolation; recommend respite care, support groups, and community resources", "Only focus on the patient", "Recommend institutionalization immediately"],
    correctIndex: 1,
    answer: "Dementia caregiving is physically and emotionally exhausting. 40%+ of caregivers develop depression. Nurses should screen for caregiver burden, recommend respite care services, Alzheimer's Association support groups, community resources, and address the caregiver's own health needs.",
    category: "Neurological",
    difficulty: 1
  },
  {
    id: "rn-pcn-dd-25",
    type: "question",
    question: "What is delirium superimposed on dementia (DSD) and why is it clinically important?",
    options: ["A rare condition", "Delirium developing in a patient who already has dementia — highest risk combination with worst outcomes, often underrecognized", "A type of medication reaction", "A diagnostic test"],
    correctIndex: 1,
    answer: "DSD is the most common and dangerous combination: patients with dementia are at highest risk for delirium, and when both coexist, outcomes are significantly worse (increased mortality, accelerated cognitive decline, longer hospitalization). It is frequently missed because behavioral changes are attributed to the underlying dementia.",
    category: "Neurological",
    difficulty: 2
  }
];
