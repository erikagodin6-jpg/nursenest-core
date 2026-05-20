import pg from "pg";
import * as crypto from "crypto";
const Pool = pg.Pool;

const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

function stemHash(stem: string): string {
  return crypto.createHash("sha256").update(stem.trim().toLowerCase()).digest("hex");
}

interface QuestionData {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string[];
  rationale: string;
  difficulty: number;
  tags: string[];
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  careerType: string;
  clinicalPearl: string | null;
  examStrategy: string | null;
  distractorRationales: Record<string, string> | null;
}

const canadaQuestions: QuestionData[] = [
  // === PHARMACOLOGY (8 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse in a Canadian hospital is administering metoprolol to a client with atrial fibrillation. The client's heart rate is 52 bpm and blood pressure is 100/62 mmHg. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Administer the medication as prescribed" },
      { label: "B", text: "Hold the medication and notify the prescriber" },
      { label: "C", text: "Administer half the prescribed dose" },
      { label: "D", text: "Document the vital signs and administer the medication" }
    ],
    correctAnswer: ["B"],
    rationale: "Beta-blockers like metoprolol should be held when heart rate is below 60 bpm. A heart rate of 52 bpm indicates bradycardia, which is a contraindication for administration. The nurse must hold the medication and notify the prescriber for further orders.",
    difficulty: 2, tags: ["pharmacology", "beta-blockers", "cardiac"], bodySystem: "Cardiovascular",
    topic: "Pharmacology", subtopic: "Beta-Blockers", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Always check apical heart rate for a full minute before administering beta-blockers or cardiac glycosides.",
    examStrategy: "When a question asks about holding medications, look for vital sign parameters that fall outside safe ranges.",
    distractorRationales: { "A": "Administering with a HR of 52 risks worsening bradycardia", "C": "Nurses cannot independently adjust dosages", "D": "Documentation alone is insufficient when vital signs are abnormal" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client receiving warfarin therapy has an INR of 4.8. The nurse expects the prescriber to order which of the following?",
    options: [
      { label: "A", text: "Increase the warfarin dose" },
      { label: "B", text: "Administer vitamin K" },
      { label: "C", text: "Administer heparin" },
      { label: "D", text: "Continue current therapy and recheck in 48 hours" }
    ],
    correctAnswer: ["B"],
    rationale: "An INR of 4.8 is significantly above the therapeutic range of 2.0-3.0, indicating a high risk for bleeding. Vitamin K is the antidote for warfarin toxicity. The warfarin dose would be held or decreased, not increased.",
    difficulty: 2, tags: ["pharmacology", "anticoagulants", "INR"], bodySystem: "Hematologic",
    topic: "Pharmacology", subtopic: "Anticoagulants", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Therapeutic INR for most conditions is 2.0-3.0. For mechanical heart valves, the target is 2.5-3.5.",
    examStrategy: "Remember: Vitamin K reverses warfarin; protamine sulfate reverses heparin.",
    distractorRationales: { "A": "Increasing the dose would further elevate the INR", "C": "Heparin would add more anticoagulation", "D": "An INR of 4.8 requires immediate intervention" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing to administer digoxin 0.125 mg PO to an elderly client. Prior to administration, the nurse obtains an apical pulse of 56 bpm. The serum digoxin level is 2.4 nmol/L (therapeutic range: 0.6–2.6 nmol/L). What should the nurse do?",
    options: [
      { label: "A", text: "Administer the medication as the digoxin level is within range" },
      { label: "B", text: "Hold the medication due to the low heart rate" },
      { label: "C", text: "Administer half the dose and reassess in 30 minutes" },
      { label: "D", text: "Administer the medication and monitor for toxicity signs" }
    ],
    correctAnswer: ["B"],
    rationale: "Digoxin should be held when the apical pulse is below 60 bpm in adults. Even though the digoxin level is within therapeutic range (0.6–2.6 nmol/L in SI units), the bradycardia indicates the client may be approaching toxicity. The prescriber should be notified.",
    difficulty: 3, tags: ["pharmacology", "digoxin", "cardiac-glycosides"], bodySystem: "Cardiovascular",
    topic: "Pharmacology", subtopic: "Cardiac Glycosides", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, digoxin levels are reported in nmol/L (therapeutic: 0.6–2.6 nmol/L), while US uses ng/mL (0.5–2.0 ng/mL).",
    examStrategy: "Always prioritize the clinical finding (bradycardia) over the lab value when they conflict.",
    distractorRationales: { "A": "While the level is within range, the HR below 60 bpm requires holding the medication", "C": "Nurses cannot independently alter dosages", "D": "Administering with HR < 60 risks severe bradycardia or heart block" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with type 2 diabetes is prescribed metformin 500 mg PO twice daily. The client is scheduled for a CT scan with contrast dye tomorrow. Which action should the nurse take?",
    options: [
      { label: "A", text: "Administer the metformin as prescribed" },
      { label: "B", text: "Hold the metformin and notify the prescriber" },
      { label: "C", text: "Increase the client's fluid intake and give the metformin" },
      { label: "D", text: "Switch to insulin for today only" }
    ],
    correctAnswer: ["B"],
    rationale: "Metformin should be held before and for 48 hours after contrast dye administration due to the risk of lactic acidosis and contrast-induced nephropathy. The combination can lead to decreased renal clearance of metformin, causing dangerous accumulation.",
    difficulty: 3, tags: ["pharmacology", "diabetes", "metformin", "contrast-dye"], bodySystem: "Endocrine",
    topic: "Pharmacology", subtopic: "Antidiabetic Medications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Metformin must be held 48 hours before and after iodinated contrast administration. Check serum creatinine before resuming.",
    examStrategy: "Any question about metformin + contrast dye = hold metformin.",
    distractorRationales: { "A": "Administering with contrast dye risks lactic acidosis", "C": "Fluids alone do not mitigate the metformin-contrast interaction", "D": "This decision requires a prescriber order, not independent nursing action" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who is receiving an aminoglycoside antibiotic. Which laboratory value is most important for the nurse to monitor?",
    options: [
      { label: "A", text: "Serum potassium level" },
      { label: "B", text: "Serum creatinine level" },
      { label: "C", text: "Complete blood count" },
      { label: "D", text: "Liver function tests" }
    ],
    correctAnswer: ["B"],
    rationale: "Aminoglycosides (gentamicin, tobramycin, amikacin) are nephrotoxic and ototoxic. Serum creatinine and BUN levels must be monitored to detect early signs of renal impairment. Peak and trough drug levels should also be monitored.",
    difficulty: 2, tags: ["pharmacology", "aminoglycosides", "nephrotoxicity"], bodySystem: "Renal",
    topic: "Pharmacology", subtopic: "Antibiotics", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "The 'Two toxicities' of aminoglycosides: nephrotoxicity and ototoxicity. Monitor creatinine and report tinnitus or hearing loss immediately.",
    examStrategy: null,
    distractorRationales: { "A": "Potassium is not the primary concern with aminoglycosides", "C": "CBC is important but not the priority for aminoglycoside monitoring", "D": "Aminoglycosides are nephrotoxic, not hepatotoxic" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is administering IV vancomycin to a client. During the infusion, the client develops flushing, pruritus, and a maculopapular rash on the face and trunk. What is the priority nursing action?",
    options: [
      { label: "A", text: "Stop the infusion immediately and prepare epinephrine" },
      { label: "B", text: "Slow the infusion rate and notify the prescriber" },
      { label: "C", text: "Administer diphenhydramine and continue the infusion" },
      { label: "D", text: "Document the findings and continue monitoring" }
    ],
    correctAnswer: ["B"],
    rationale: "These symptoms describe 'Red Man Syndrome,' a histamine-mediated reaction to rapid vancomycin infusion. The priority action is to slow or stop the infusion and notify the prescriber. This is not a true allergic reaction but rather a rate-related response. Infusing over at least 60 minutes typically prevents this reaction.",
    difficulty: 3, tags: ["pharmacology", "vancomycin", "adverse-effects"], bodySystem: "Integumentary",
    topic: "Pharmacology", subtopic: "Antibiotic Adverse Effects", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Red Man Syndrome is prevented by infusing vancomycin slowly (over 60+ minutes). It is NOT an allergy—do not document it as one.",
    examStrategy: "Distinguish Red Man Syndrome (rate-related, manageable by slowing) from anaphylaxis (requires stopping medication and epinephrine).",
    distractorRationales: { "A": "This is Red Man Syndrome, not anaphylaxis—epinephrine is not indicated", "C": "The infusion rate must be addressed first", "D": "Active intervention is needed, not just monitoring" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a client about newly prescribed phenytoin for seizure management. Which statement by the client indicates a need for further teaching?",
    options: [
      { label: "A", text: "I will maintain good oral hygiene and see my dentist regularly" },
      { label: "B", text: "I should not stop taking this medication suddenly" },
      { label: "C", text: "I can take this medication with antacids if it upsets my stomach" },
      { label: "D", text: "I will report any unusual bruising or bleeding" }
    ],
    correctAnswer: ["C"],
    rationale: "Antacids decrease the absorption of phenytoin and should not be taken concurrently. Phenytoin should be taken consistently with or without food. Good oral hygiene is important due to gingival hyperplasia risk, abrupt discontinuation can cause status epilepticus, and bleeding may indicate toxicity.",
    difficulty: 3, tags: ["pharmacology", "antiepileptics", "phenytoin"], bodySystem: "Neurological",
    topic: "Pharmacology", subtopic: "Antiepileptic Drugs", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Three classic phenytoin side effects: gingival hyperplasia, hirsutism, and Stevens-Johnson syndrome.",
    examStrategy: "For 'need for further teaching' questions, look for the INCORRECT statement made by the client.",
    distractorRationales: { "A": "Correct understanding—gingival hyperplasia requires dental care", "B": "Correct—abrupt discontinuation risks status epilepticus", "D": "Correct—bleeding may indicate phenytoin toxicity" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is receiving a continuous heparin infusion. The aPTT result is 120 seconds (therapeutic range: 60–80 seconds). The nurse should anticipate which prescriber order?",
    options: [
      { label: "A", text: "Increase the heparin infusion rate" },
      { label: "B", text: "Stop the heparin infusion and prepare protamine sulfate" },
      { label: "C", text: "Continue the infusion and recheck aPTT in 6 hours" },
      { label: "D", text: "Administer vitamin K intravenously" }
    ],
    correctAnswer: ["B"],
    rationale: "An aPTT of 120 seconds is significantly above the therapeutic range (60–80 seconds), indicating a high bleeding risk. The heparin infusion should be stopped and protamine sulfate (the heparin antidote) should be available. Vitamin K is the antidote for warfarin, not heparin.",
    difficulty: 3, tags: ["pharmacology", "heparin", "anticoagulation"], bodySystem: "Hematologic",
    topic: "Pharmacology", subtopic: "Heparin Therapy", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Protamine sulfate reverses heparin; vitamin K reverses warfarin. Never mix up the antidotes.",
    examStrategy: null,
    distractorRationales: { "A": "The aPTT is already dangerously high", "C": "Immediate action is needed at this level", "D": "Vitamin K is for warfarin reversal, not heparin" }
  },

  // === CARDIOVASCULAR (6 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client presents to a Canadian emergency department with chest pain radiating to the left arm, diaphoresis, and nausea. The 12-lead ECG shows ST-segment elevation in leads II, III, and aVF. Which area of the heart is most likely affected?",
    options: [
      { label: "A", text: "Anterior wall" },
      { label: "B", text: "Lateral wall" },
      { label: "C", text: "Inferior wall" },
      { label: "D", text: "Septal wall" }
    ],
    correctAnswer: ["C"],
    rationale: "ST-segment elevation in leads II, III, and aVF indicates an inferior wall myocardial infarction. The inferior wall is supplied by the right coronary artery in most individuals. Anterior wall MI shows changes in V1-V4, lateral in I, aVL, V5-V6, and septal in V1-V2.",
    difficulty: 3, tags: ["cardiovascular", "MI", "ECG-interpretation"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Myocardial Infarction", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Remember inferior MI leads as 'II, III, aVF = floor (inferior).' Always obtain a right-sided ECG to rule out right ventricular involvement.",
    examStrategy: "Associate lead groupings with cardiac wall locations: II, III, aVF = inferior; V1-V4 = anterior; I, aVL, V5-V6 = lateral.",
    distractorRationales: { "A": "Anterior MI shows changes in V1-V4", "B": "Lateral MI shows changes in I, aVL, V5-V6", "D": "Septal MI shows changes in V1-V2" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with heart failure who is receiving furosemide 40 mg IV. Which laboratory result should the nurse report to the prescriber immediately?",
    options: [
      { label: "A", text: "Serum sodium 138 mmol/L" },
      { label: "B", text: "Serum potassium 2.8 mmol/L" },
      { label: "C", text: "Serum calcium 2.3 mmol/L" },
      { label: "D", text: "Serum magnesium 0.9 mmol/L" }
    ],
    correctAnswer: ["B"],
    rationale: "A serum potassium of 2.8 mmol/L indicates hypokalemia, which is a dangerous adverse effect of loop diuretics like furosemide. Hypokalemia can lead to life-threatening cardiac dysrhythmias. Normal potassium in SI units is 3.5–5.0 mmol/L. The other values are within normal ranges.",
    difficulty: 2, tags: ["cardiovascular", "heart-failure", "electrolytes"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Heart Failure Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Loop diuretics waste potassium. Always monitor K+ levels. If the client is also on digoxin, hypokalemia increases digoxin toxicity risk.",
    examStrategy: null,
    distractorRationales: { "A": "Sodium 138 mmol/L is within normal range (135-145)", "C": "Calcium 2.3 mmol/L is within normal range (2.1-2.6)", "D": "Magnesium 0.9 mmol/L is within normal range (0.7-1.0)" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with a new diagnosis of atrial fibrillation asks the nurse why anticoagulation therapy has been prescribed. Which response by the nurse is most accurate?",
    options: [
      { label: "A", text: "To prevent the formation of blood clots that could cause a stroke" },
      { label: "B", text: "To regulate the heart rate and restore normal rhythm" },
      { label: "C", text: "To reduce blood pressure and decrease cardiac workload" },
      { label: "D", text: "To prevent the recurrence of atrial fibrillation episodes" }
    ],
    correctAnswer: ["A"],
    rationale: "Atrial fibrillation causes ineffective atrial contractions, leading to blood stasis in the atria, particularly the left atrial appendage. This stasis promotes clot formation (thrombus), which can embolize and travel to the brain, causing a stroke. Anticoagulation therapy reduces this thromboembolic risk.",
    difficulty: 2, tags: ["cardiovascular", "atrial-fibrillation", "anticoagulation"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Atrial Fibrillation", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Atrial fibrillation increases stroke risk 5-fold. The CHA₂DS₂-VASc score guides anticoagulation decisions.",
    examStrategy: null,
    distractorRationales: { "B": "Rate control medications serve this purpose, not anticoagulants", "C": "Antihypertensives address blood pressure, not anticoagulants", "D": "Antiarrhythmics prevent recurrence, not anticoagulants" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client admitted with acute decompensated heart failure has a BNP level of 1200 pg/mL. The nurse understands that this value indicates which of the following?",
    options: [
      { label: "A", text: "Improved cardiac function" },
      { label: "B", text: "Significant myocardial wall stress and volume overload" },
      { label: "C", text: "Acute renal failure" },
      { label: "D", text: "Pulmonary embolism" }
    ],
    correctAnswer: ["B"],
    rationale: "B-type natriuretic peptide (BNP) is released by the ventricles in response to increased wall stress from volume overload. A BNP >400 pg/mL strongly suggests heart failure. A level of 1200 pg/mL indicates significant cardiac decompensation requiring aggressive management.",
    difficulty: 3, tags: ["cardiovascular", "heart-failure", "BNP", "diagnostics"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Heart Failure Diagnostics", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "BNP < 100 pg/mL = HF unlikely. BNP 100-400 = possible HF. BNP > 400 = HF very likely. Use for initial diagnosis and monitoring treatment response.",
    examStrategy: null,
    distractorRationales: { "A": "Elevated BNP indicates worsening, not improving cardiac function", "C": "While renal failure can elevate BNP, the clinical context points to heart failure", "D": "PE has different biomarkers (D-dimer, troponin)" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client post-cardiac catheterization via the right femoral artery. Two hours after the procedure, the client reports numbness and tingling in the right foot. The foot is cool and pale. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Elevate the right leg on two pillows" },
      { label: "B", text: "Apply a warm blanket to the right foot" },
      { label: "C", text: "Notify the prescriber immediately" },
      { label: "D", text: "Encourage the client to wiggle the toes" }
    ],
    correctAnswer: ["C"],
    rationale: "Numbness, tingling, coolness, and pallor of the extremity after cardiac catheterization indicate compromised arterial circulation, possibly from a thrombus or hematoma compressing the artery. This is a medical emergency requiring immediate notification of the prescriber for potential surgical intervention.",
    difficulty: 3, tags: ["cardiovascular", "cardiac-catheterization", "complications"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Post-Procedure Complications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "The 5 P's of arterial occlusion: Pain, Pallor, Pulselessness, Paresthesia, Paralysis. Any of these post-catheterization requires immediate intervention.",
    examStrategy: "Post-catheterization with signs of impaired circulation = notify prescriber immediately.",
    distractorRationales: { "A": "Elevation could worsen arterial insufficiency", "B": "Warming does not address the underlying vascular compromise", "D": "This is a vascular emergency, not a comfort measure" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is interpreting a client's ECG strip. The rhythm is regular, the rate is 42 bpm, P waves are present and upright before each QRS complex, and the PR interval is 0.24 seconds. The nurse interprets this as:",
    options: [
      { label: "A", text: "Sinus bradycardia with first-degree AV block" },
      { label: "B", text: "Second-degree AV block Type I (Wenckebach)" },
      { label: "C", text: "Third-degree AV block" },
      { label: "D", text: "Junctional rhythm" }
    ],
    correctAnswer: ["A"],
    rationale: "The rhythm is regular with a rate of 42 bpm (bradycardia), P waves precede each QRS (sinus origin), and the PR interval is prolonged at 0.24 seconds (normal is 0.12–0.20 seconds), indicating first-degree AV block. This combination is sinus bradycardia with first-degree AV block.",
    difficulty: 4, tags: ["cardiovascular", "ECG", "dysrhythmias"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "ECG Interpretation", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "First-degree AV block: PR interval > 0.20 sec but every P wave is followed by a QRS. It often requires no treatment but should be monitored.",
    examStrategy: "Systematically analyze: rate → rhythm → P waves → PR interval → QRS duration.",
    distractorRationales: { "B": "Wenckebach shows progressively lengthening PR intervals before a dropped QRS", "C": "Third-degree block shows no relationship between P waves and QRS complexes", "D": "Junctional rhythms have inverted or absent P waves" }
  },

  // === RESPIRATORY (6 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with COPD is receiving oxygen via nasal cannula at 2 L/min. The client's SpO2 is 91%. The nurse understands that the target oxygen saturation for this client should be:",
    options: [
      { label: "A", text: "95–100%" },
      { label: "B", text: "88–92%" },
      { label: "C", text: "80–85%" },
      { label: "D", text: "98–100%" }
    ],
    correctAnswer: ["B"],
    rationale: "Clients with COPD have a chronic hypoxic drive for respiration. The target SpO2 for COPD clients is 88–92%. Administering high-flow oxygen to achieve 95–100% can suppress the hypoxic drive and lead to respiratory depression or failure.",
    difficulty: 2, tags: ["respiratory", "COPD", "oxygen-therapy"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Oxygen Therapy", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "COPD clients rely on hypoxic drive. Keep O2 low-flow (1-2 L/min NC) with target SpO2 88-92%. High-flow O2 can cause CO2 retention and respiratory failure.",
    examStrategy: null,
    distractorRationales: { "A": "This target is for clients without COPD", "C": "This is too low and indicates severe hypoxemia", "D": "This level risks suppressing hypoxic drive in COPD" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is reviewing arterial blood gas (ABG) results for a client: pH 7.28, PaCO2 58 mmHg, HCO3 24 mmol/L. The nurse interprets this as:",
    options: [
      { label: "A", text: "Respiratory alkalosis" },
      { label: "B", text: "Respiratory acidosis, uncompensated" },
      { label: "C", text: "Metabolic acidosis" },
      { label: "D", text: "Metabolic alkalosis" }
    ],
    correctAnswer: ["B"],
    rationale: "The pH of 7.28 is acidotic (normal 7.35–7.45). The PaCO2 of 58 mmHg is elevated (normal 35–45 mmHg), indicating respiratory origin. The HCO3 of 24 mmol/L is within normal range (22–26 mmol/L), indicating no metabolic compensation has occurred. Therefore, this is uncompensated respiratory acidosis.",
    difficulty: 3, tags: ["respiratory", "ABG", "acid-base"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "ABG Interpretation", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Use the ROME mnemonic: Respiratory Opposite (pH and CO2 go opposite directions), Metabolic Equal (pH and HCO3 go same direction).",
    examStrategy: "Step 1: Is pH acidotic or alkalotic? Step 2: Which value (CO2 or HCO3) matches the pH direction? Step 3: Is the other value compensating?",
    distractorRationales: { "A": "Alkalosis would have a pH > 7.45", "C": "Metabolic acidosis would show low HCO3", "D": "Alkalosis with elevated HCO3 is not present" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with a chest tube connected to a water-seal drainage system has continuous bubbling in the water-seal chamber. The nurse should first:",
    options: [
      { label: "A", text: "Clamp the chest tube immediately" },
      { label: "B", text: "Check all connections for air leaks" },
      { label: "C", text: "Notify the prescriber of a pneumothorax" },
      { label: "D", text: "Increase the suction pressure" }
    ],
    correctAnswer: ["B"],
    rationale: "Continuous bubbling in the water-seal chamber indicates an air leak in the system. The nurse should first systematically check all tubing connections for loose fittings, as this is the most common cause. Chest tubes should never be clamped unless specifically ordered, as this can cause tension pneumothorax.",
    difficulty: 3, tags: ["respiratory", "chest-tube", "air-leak"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Chest Tube Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Intermittent bubbling during exhalation or coughing is normal (air leaving pleural space). Continuous bubbling = air leak in the system.",
    examStrategy: "Never clamp a chest tube unless specifically ordered. Check connections first when there's continuous bubbling.",
    distractorRationales: { "A": "Clamping risks tension pneumothorax", "C": "The air leak is likely in the system, not indicating new pneumothorax", "D": "Increasing suction does not address the air leak" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who has just had a thoracentesis. Which assessment finding should the nurse report immediately?",
    options: [
      { label: "A", text: "Mild discomfort at the puncture site" },
      { label: "B", text: "Decreased breath sounds on the affected side" },
      { label: "C", text: "A small amount of serous drainage on the dressing" },
      { label: "D", text: "Respiratory rate of 18 breaths per minute" }
    ],
    correctAnswer: ["B"],
    rationale: "Decreased breath sounds on the affected side after thoracentesis may indicate a pneumothorax, which is a serious complication of the procedure. The nurse should report this immediately and anticipate a chest X-ray. The other findings are expected or normal.",
    difficulty: 2, tags: ["respiratory", "thoracentesis", "pneumothorax"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Post-Procedure Assessment", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Post-thoracentesis, always auscultate breath sounds bilaterally and monitor for tracheal deviation, which indicates tension pneumothorax.",
    examStrategy: null,
    distractorRationales: { "A": "Mild discomfort is expected", "C": "Small serous drainage is normal", "D": "RR of 18 is within normal range" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with pneumonia who has a productive cough with rust-coloured sputum and a temperature of 39.2°C. Which nursing intervention has the highest priority?",
    options: [
      { label: "A", text: "Obtain a sputum specimen for culture and sensitivity" },
      { label: "B", text: "Administer the prescribed antipyretic" },
      { label: "C", text: "Encourage increased fluid intake to 2–3 L/day" },
      { label: "D", text: "Position the client in high Fowler's position" }
    ],
    correctAnswer: ["A"],
    rationale: "Obtaining a sputum culture and sensitivity is the highest priority because it identifies the causative organism and guides appropriate antibiotic therapy. The specimen should be collected before antibiotics are started. While the other interventions are important, identifying the pathogen directs definitive treatment.",
    difficulty: 3, tags: ["respiratory", "pneumonia", "diagnostic-priority"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Pneumonia Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Always collect cultures BEFORE starting antibiotics. Rust-coloured sputum is classic for Streptococcus pneumoniae.",
    examStrategy: "Diagnostic tests that guide treatment take priority over supportive care when both are needed.",
    distractorRationales: { "B": "Important but doesn't guide definitive treatment", "C": "Supportive care, not highest priority", "D": "Positioning aids breathing but doesn't guide treatment" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with asthma is using a metered-dose inhaler (MDI) with both a corticosteroid and a bronchodilator prescribed. In which order should the client use these inhalers?",
    options: [
      { label: "A", text: "Corticosteroid first, then bronchodilator" },
      { label: "B", text: "Bronchodilator first, then corticosteroid" },
      { label: "C", text: "The order does not matter" },
      { label: "D", text: "Both can be administered simultaneously" }
    ],
    correctAnswer: ["B"],
    rationale: "The bronchodilator should be administered first to open the airways, allowing the corticosteroid to penetrate deeper into the lungs for maximum anti-inflammatory effect. The client should wait 1–5 minutes between inhalers.",
    difficulty: 2, tags: ["respiratory", "asthma", "inhalers"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Asthma Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Bronchodilator first = opens airways. Corticosteroid second = deeper penetration for inflammation control. Rinse mouth after corticosteroid to prevent oral candidiasis.",
    examStrategy: null,
    distractorRationales: { "A": "Corticosteroid first means it cannot penetrate closed airways effectively", "C": "Order matters for optimal drug delivery", "D": "MDIs must be used sequentially" }
  },

  // === NEUROLOGICAL (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client presents to the emergency department with sudden onset of right-sided weakness, slurred speech, and facial drooping on the right side. Symptoms began 90 minutes ago. The nurse anticipates the priority intervention will be:",
    options: [
      { label: "A", text: "Administering aspirin 325 mg PO" },
      { label: "B", text: "Preparing for tissue plasminogen activator (tPA) administration" },
      { label: "C", text: "Scheduling an MRI of the brain" },
      { label: "D", text: "Starting a heparin infusion" }
    ],
    correctAnswer: ["B"],
    rationale: "The client is presenting with signs of an acute ischemic stroke within the tPA treatment window (within 4.5 hours of symptom onset). tPA is the priority intervention to dissolve the clot and restore cerebral blood flow. A non-contrast CT scan would be performed first to rule out hemorrhagic stroke before tPA administration.",
    difficulty: 3, tags: ["neurological", "stroke", "tPA"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Acute Stroke Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "tPA window: within 4.5 hours of symptom onset. CT scan MUST be done first to rule out hemorrhagic stroke. Never give aspirin or anticoagulants until hemorrhage is ruled out.",
    examStrategy: "Acute stroke within time window + no hemorrhage = tPA is the priority.",
    distractorRationales: { "A": "Aspirin is contraindicated until hemorrhage is ruled out", "C": "CT without contrast is the priority imaging, not MRI", "D": "Heparin is not first-line for acute ischemic stroke" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client 6 hours after a craniotomy. The client's Glasgow Coma Scale (GCS) score has decreased from 14 to 9. Which action should the nurse take first?",
    options: [
      { label: "A", text: "Document the change and continue monitoring" },
      { label: "B", text: "Reposition the client and reassess in 30 minutes" },
      { label: "C", text: "Notify the neurosurgeon immediately" },
      { label: "D", text: "Administer prescribed analgesics for pain" }
    ],
    correctAnswer: ["C"],
    rationale: "A decrease of 5 points in the GCS (from 14 to 9) is a significant neurological deterioration that may indicate increased intracranial pressure, hemorrhage, or cerebral edema. This requires immediate notification of the neurosurgeon. A GCS of 9 indicates the client is now in a moderately severe state.",
    difficulty: 3, tags: ["neurological", "GCS", "post-craniotomy"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Post-Craniotomy Care", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "A GCS decrease of 2 or more points is clinically significant. GCS 13-15 = mild; 9-12 = moderate; 3-8 = severe (intubation needed).",
    examStrategy: "Any acute neurological deterioration = notify the prescriber immediately.",
    distractorRationales: { "A": "A 5-point GCS drop requires immediate action, not just documentation", "B": "Waiting 30 minutes could be dangerous with acute deterioration", "D": "Analgesics may mask neurological changes and are not the priority" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with suspected bacterial meningitis is admitted. The nurse prepares for a lumbar puncture. Which position should the nurse assist the client into?",
    options: [
      { label: "A", text: "Supine with legs extended" },
      { label: "B", text: "Lateral recumbent with knees drawn to the chest" },
      { label: "C", text: "Prone with a pillow under the abdomen" },
      { label: "D", text: "Semi-Fowler's position with arms at sides" }
    ],
    correctAnswer: ["B"],
    rationale: "The lateral recumbent (side-lying) position with knees drawn to the chest (fetal position) opens the intervertebral spaces, allowing easier needle insertion into the subarachnoid space. An alternative is sitting upright and leaning forward over a bedside table.",
    difficulty: 2, tags: ["neurological", "meningitis", "lumbar-puncture"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Lumbar Puncture", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Post-LP: keep client flat for 4-8 hours to prevent spinal headache. Encourage fluid intake. Monitor for headache, back pain, and signs of infection.",
    examStrategy: null,
    distractorRationales: { "A": "Supine position does not open intervertebral spaces", "C": "Prone position is not used for lumbar puncture", "D": "Semi-Fowler's does not adequately flex the spine" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with increased intracranial pressure (ICP). Which nursing intervention is contraindicated?",
    options: [
      { label: "A", text: "Elevating the head of the bed to 30 degrees" },
      { label: "B", text: "Clustering nursing care activities" },
      { label: "C", text: "Maintaining the neck in a neutral position" },
      { label: "D", text: "Administering stool softeners" }
    ],
    correctAnswer: ["B"],
    rationale: "Clustering nursing care activities increases ICP by stimulating the client repeatedly in a short period. Care should be spaced out to allow ICP to return to baseline between interventions. Head elevation to 30 degrees promotes venous drainage, neutral neck position prevents jugular vein compression, and stool softeners prevent straining (Valsalva maneuver).",
    difficulty: 4, tags: ["neurological", "increased-ICP", "nursing-interventions"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Increased ICP Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Activities that increase ICP: clustering care, suctioning >10 sec, coughing, straining, hip flexion, prone positioning. Space interventions apart and allow recovery time.",
    examStrategy: "For ICP questions, think about what increases venous pressure in the head. Anything that impedes venous outflow or causes straining raises ICP.",
    distractorRationales: { "A": "HOB at 30 degrees promotes venous drainage and is correct", "C": "Neutral neck position prevents jugular compression", "D": "Stool softeners prevent straining which would increase ICP" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a client with newly diagnosed epilepsy. Which statement by the client indicates understanding of seizure precautions?",
    options: [
      { label: "A", text: "I should place a padded tongue blade at my bedside" },
      { label: "B", text: "I will avoid swimming alone and take showers instead of baths" },
      { label: "C", text: "I can continue driving as long as I take my medications" },
      { label: "D", text: "I should restrain someone who is having a seizure to prevent injury" }
    ],
    correctAnswer: ["B"],
    rationale: "Clients with epilepsy should avoid activities that could be dangerous if a seizure occurs, including swimming alone and taking baths (drowning risk). Showers are safer. In Canada, driving restrictions for epilepsy vary by province but generally require a seizure-free period. Objects should never be placed in the mouth during a seizure, and physical restraint is contraindicated.",
    difficulty: 2, tags: ["neurological", "epilepsy", "seizure-precautions"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Seizure Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, seizure-free driving periods vary by province (typically 6-12 months). Never insert anything into the mouth during a seizure.",
    examStrategy: "For client teaching questions, identify the statement that demonstrates safe, evidence-based behaviour.",
    distractorRationales: { "A": "Never insert objects into the mouth during a seizure", "C": "Driving restrictions apply until seizure-free for a specified period", "D": "Restraining during a seizure can cause injury" }
  },

  // === MENTAL HEALTH (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is conducting an intake assessment for a client admitted with major depressive disorder. The client states, 'I have a plan to end my life.' What is the nurse's priority action?",
    options: [
      { label: "A", text: "Document the statement and continue the assessment" },
      { label: "B", text: "Ask the client to describe the plan in detail" },
      { label: "C", text: "Place the client on one-to-one observation and notify the prescriber" },
      { label: "D", text: "Contact the client's family for additional information" }
    ],
    correctAnswer: ["C"],
    rationale: "When a client verbalizes a specific plan for suicide, the immediate priority is ensuring client safety through one-to-one observation (constant supervision) and notifying the prescriber. This is a psychiatric emergency. While assessing the plan details is part of a comprehensive risk assessment, the safety intervention must come first.",
    difficulty: 2, tags: ["mental-health", "suicide-risk", "safety"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Suicide Risk Assessment", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Asking about suicide does NOT increase risk. A plan with means and intent = high risk requiring immediate intervention.",
    examStrategy: "Client safety is ALWAYS the priority. When a client expresses suicidal ideation with a plan, implement safety measures first.",
    distractorRationales: { "A": "Documentation is important but safety comes first", "B": "Assessing the plan is important but ensuring safety takes priority", "D": "The client's immediate safety supersedes gathering collateral information" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client experiencing acute alcohol withdrawal. The client is diaphoretic, tremulous, has a heart rate of 118 bpm, and is reporting visual hallucinations. The nurse recognizes these findings as consistent with:",
    options: [
      { label: "A", text: "Alcohol intoxication" },
      { label: "B", text: "Delirium tremens" },
      { label: "C", text: "Korsakoff syndrome" },
      { label: "D", text: "Wernicke encephalopathy" }
    ],
    correctAnswer: ["B"],
    rationale: "Delirium tremens (DT) is a severe form of alcohol withdrawal characterized by autonomic hyperactivity (tachycardia, diaphoresis, hypertension), tremors, hallucinations (visual, tactile, or auditory), agitation, and confusion. DT typically occurs 48–72 hours after the last drink and is a medical emergency with a mortality rate of up to 5% if untreated.",
    difficulty: 3, tags: ["mental-health", "alcohol-withdrawal", "delirium-tremens"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Substance Withdrawal", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Alcohol withdrawal timeline: 6-12h tremors/anxiety; 12-24h hallucinations; 24-48h seizures; 48-72h delirium tremens. Benzodiazepines are the treatment of choice.",
    examStrategy: null,
    distractorRationales: { "A": "Intoxication causes sedation, not autonomic hyperactivity", "C": "Korsakoff syndrome involves memory impairment, not acute withdrawal", "D": "Wernicke encephalopathy presents with ataxia, confusion, and ophthalmoplegia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with bipolar disorder is in a manic episode and is speaking rapidly, has not slept in 3 days, and is making grandiose claims about their abilities. Which nursing intervention is the priority?",
    options: [
      { label: "A", text: "Encourage the client to participate in group therapy" },
      { label: "B", text: "Provide a structured, low-stimulation environment and ensure adequate nutrition and hydration" },
      { label: "C", text: "Engage the client in detailed conversation about their plans" },
      { label: "D", text: "Administer an antidepressant as needed" }
    ],
    correctAnswer: ["B"],
    rationale: "During a manic episode, the priority is to reduce stimulation and meet basic physiological needs. Clients in mania often forget to eat and drink due to hyperactivity. A structured, low-stimulation environment helps reduce agitation. Group therapy and detailed conversations increase stimulation, and antidepressants can worsen mania.",
    difficulty: 3, tags: ["mental-health", "bipolar", "mania"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Bipolar Disorder", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Offer high-calorie finger foods and drinks during mania—clients cannot sit for meals. Never give antidepressants during mania without a mood stabilizer.",
    examStrategy: "Maslow's hierarchy: physiological needs (nutrition, hydration, safety) before psychosocial interventions.",
    distractorRationales: { "A": "Group therapy increases stimulation", "C": "Engaging in conversation increases stimulation and reinforces grandiosity", "D": "Antidepressants can worsen mania" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with schizophrenia who is prescribed clozapine. Which laboratory test must be monitored regularly?",
    options: [
      { label: "A", text: "Liver function tests" },
      { label: "B", text: "Absolute neutrophil count (ANC)" },
      { label: "C", text: "Fasting blood glucose only" },
      { label: "D", text: "Thyroid function tests" }
    ],
    correctAnswer: ["B"],
    rationale: "Clozapine carries a risk of severe neutropenia (agranulocytosis), which can be fatal. Regular ANC monitoring is mandatory: weekly for the first 6 months, biweekly for the next 6 months, then monthly. In Canada, the Clozapine National Registry tracks all patients on clozapine.",
    difficulty: 3, tags: ["mental-health", "clozapine", "pharmacology"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Antipsychotic Medications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Clozapine is the gold standard for treatment-resistant schizophrenia but requires ANC monitoring. ANC < 1500 = do not start. ANC < 1000 = hold medication.",
    examStrategy: null,
    distractorRationales: { "A": "Liver function is monitored with other antipsychotics, not primarily clozapine", "C": "Metabolic monitoring is important but ANC is the critical safety concern", "D": "Thyroid tests are monitored with lithium, not clozapine" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is using therapeutic communication with a client who has just been diagnosed with cancer. The client says, 'Why is this happening to me?' Which response by the nurse is most therapeutic?",
    options: [
      { label: "A", text: "Everything happens for a reason. You'll get through this." },
      { label: "B", text: "You seem upset. Tell me more about what you're feeling." },
      { label: "C", text: "Don't worry. The treatments available today are very effective." },
      { label: "D", text: "I know how you feel. My aunt had cancer too." }
    ],
    correctAnswer: ["B"],
    rationale: "This response uses reflection (acknowledging the client's feelings) and open-ended exploration, which are core therapeutic communication techniques. It validates the client's emotions without providing false reassurance, minimizing concerns, or shifting focus to the nurse's experience.",
    difficulty: 2, tags: ["mental-health", "therapeutic-communication", "coping"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Therapeutic Communication", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Therapeutic communication: reflect feelings, use open-ended questions, maintain silence for reflection. Avoid false reassurance, clichés, and self-disclosure.",
    examStrategy: "The best therapeutic response validates feelings and encourages the client to express more. Avoid responses that minimize, dismiss, or shift focus.",
    distractorRationales: { "A": "Uses cliché and false reassurance", "C": "Minimizes the client's emotional response", "D": "Shifts focus to the nurse and uses self-disclosure" }
  },

  // === PEDIATRICS (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a 2-year-old child admitted with suspected epiglottitis. Which assessment finding would the nurse expect?",
    options: [
      { label: "A", text: "Barking cough with inspiratory stridor" },
      { label: "B", text: "Drooling, tripod positioning, and high fever" },
      { label: "C", text: "Gradual onset of symptoms over several days" },
      { label: "D", text: "Low-grade fever and productive cough" }
    ],
    correctAnswer: ["B"],
    rationale: "Epiglottitis presents with the classic 'three Ds': drooling, dysphagia, and distressed respiratory effort. Children often assume a tripod position (leaning forward with chin extended) to maximize airway opening. Onset is rapid with high fever. Barking cough is characteristic of croup, not epiglottitis.",
    difficulty: 3, tags: ["pediatrics", "epiglottitis", "respiratory-emergency"], bodySystem: "Respiratory",
    topic: "Pediatrics", subtopic: "Epiglottitis", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Never examine the throat of a child with suspected epiglottitis—this can cause complete airway obstruction. Keep emergency intubation equipment at bedside.",
    examStrategy: "Epiglottitis vs Croup: Epiglottitis = sudden onset, high fever, drooling, tripod position. Croup = gradual onset, barking cough, steeple sign on X-ray.",
    distractorRationales: { "A": "Barking cough is characteristic of croup", "C": "Epiglottitis has a rapid, acute onset", "D": "Epiglottitis causes high fever, not low-grade fever" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is calculating the maintenance IV fluid rate for a 15 kg child using the Holliday-Segar method. What is the hourly rate?",
    options: [
      { label: "A", text: "50 mL/hour" },
      { label: "B", text: "35 mL/hour" },
      { label: "C", text: "52.5 mL/hour" },
      { label: "D", text: "62.5 mL/hour" }
    ],
    correctAnswer: ["C"],
    rationale: "Using the Holliday-Segar method: First 10 kg = 100 mL/kg/day = 1000 mL/day. Next 5 kg = 50 mL/kg/day = 250 mL/day. Total = 1250 mL/day ÷ 24 hours = 52.08 mL/hour, approximately 52.5 mL/hour.",
    difficulty: 4, tags: ["pediatrics", "IV-fluids", "calculations"], bodySystem: "Fluid and Electrolytes",
    topic: "Pediatrics", subtopic: "Fluid Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Holliday-Segar: First 10 kg = 100 mL/kg/day; 10-20 kg = 50 mL/kg/day; >20 kg = 20 mL/kg/day. This is the gold standard for pediatric maintenance fluids.",
    examStrategy: "Memorize the Holliday-Segar formula. Break down the weight into segments and calculate each separately before adding.",
    distractorRationales: { "A": "This would be 1200 mL/day, which uses incorrect calculations", "B": "This is too low", "D": "This would be 1500 mL/day, which is too high" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a 6-month-old infant. Which finding would require immediate follow-up?",
    options: [
      { label: "A", text: "The infant rolls from front to back" },
      { label: "B", text: "The infant has not yet begun to sit without support" },
      { label: "C", text: "The infant does not turn toward sounds" },
      { label: "D", text: "The infant shows stranger anxiety" }
    ],
    correctAnswer: ["C"],
    rationale: "By 6 months of age, infants should turn toward sounds and voices, indicating normal hearing development. Failure to respond to sounds may indicate hearing impairment and requires immediate follow-up. Rolling over is achieved by 4-6 months, sitting without support develops around 6-8 months, and stranger anxiety typically begins around 6-8 months.",
    difficulty: 3, tags: ["pediatrics", "developmental-milestones", "hearing"], bodySystem: "Neurological",
    topic: "Pediatrics", subtopic: "Developmental Milestones", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Developmental red flags at 6 months: no response to sounds, no social smile, not reaching for objects, persistent fisting of hands.",
    examStrategy: null,
    distractorRationales: { "A": "Rolling front to back is a normal 4-6 month milestone", "B": "Independent sitting develops around 6-8 months", "D": "Stranger anxiety begins around 6-8 months and is normal" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a child with suspected Kawasaki disease. Which clinical manifestation is most characteristic of this condition?",
    options: [
      { label: "A", text: "Petechial rash and joint swelling" },
      { label: "B", text: "High fever lasting 5 or more days, conjunctival injection, and strawberry tongue" },
      { label: "C", text: "Low-grade fever with vesicular rash" },
      { label: "D", text: "Productive cough with bilateral crackles" }
    ],
    correctAnswer: ["B"],
    rationale: "Kawasaki disease presents with high fever lasting ≥5 days plus at least 4 of: bilateral conjunctival injection, oral mucous membrane changes (strawberry tongue, cracked lips), peripheral extremity changes (edema, peeling), polymorphous rash, and cervical lymphadenopathy. The major complication is coronary artery aneurysm.",
    difficulty: 3, tags: ["pediatrics", "kawasaki-disease", "autoimmune"], bodySystem: "Cardiovascular",
    topic: "Pediatrics", subtopic: "Kawasaki Disease", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Kawasaki disease: Treated with IV immunoglobulin (IVIG) and high-dose aspirin. This is one of the few pediatric conditions where aspirin is used (normally avoided due to Reye syndrome risk).",
    examStrategy: null,
    distractorRationales: { "A": "Petechiae and joint swelling suggest Henoch-Schönlein purpura", "C": "Vesicular rash suggests varicella", "D": "Productive cough with crackles suggests pneumonia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is providing discharge teaching to parents of a toddler diagnosed with iron-deficiency anemia. Which dietary recommendation is most appropriate?",
    options: [
      { label: "A", text: "Increase milk intake to 1 litre per day to provide calcium" },
      { label: "B", text: "Give iron supplements with orange juice and limit milk to 500 mL per day" },
      { label: "C", text: "Provide iron supplements with milk for better absorption" },
      { label: "D", text: "Focus on increasing carbohydrate-rich foods" }
    ],
    correctAnswer: ["B"],
    rationale: "Iron supplements should be given with vitamin C (orange juice) to enhance absorption. Milk intake should be limited to approximately 500 mL (16 oz) per day because excessive milk consumption displaces iron-rich foods and calcium inhibits iron absorption. The metric measurement of 500 mL is standard in Canadian clinical practice.",
    difficulty: 2, tags: ["pediatrics", "anemia", "nutrition", "iron"], bodySystem: "Hematologic",
    topic: "Pediatrics", subtopic: "Iron-Deficiency Anemia", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Iron + vitamin C = enhanced absorption. Iron + milk/calcium/tea = decreased absorption. Give iron between meals. Expect dark/black stools.",
    examStrategy: null,
    distractorRationales: { "A": "Excessive milk displaces iron-rich foods and inhibits iron absorption", "C": "Milk and calcium inhibit iron absorption", "D": "Carbohydrates do not address iron deficiency" }
  },

  // === MATERNITY (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client at 32 weeks gestation who presents with painless, bright red vaginal bleeding. The nurse suspects:",
    options: [
      { label: "A", text: "Placental abruption" },
      { label: "B", text: "Placenta previa" },
      { label: "C", text: "Cervical insufficiency" },
      { label: "D", text: "Uterine rupture" }
    ],
    correctAnswer: ["B"],
    rationale: "Painless, bright red vaginal bleeding in the third trimester is the hallmark presentation of placenta previa, where the placenta partially or completely covers the cervical os. Placental abruption presents with painful, dark red bleeding with a rigid abdomen. No vaginal examinations should be performed with suspected placenta previa.",
    difficulty: 2, tags: ["maternity", "placenta-previa", "antepartum-hemorrhage"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Placenta Previa", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Placenta previa = painless, bright red bleeding. Abruption = painful, dark bleeding, rigid abdomen. NEVER perform a vaginal exam with suspected previa.",
    examStrategy: "Painless + bright red + third trimester = placenta previa. Painful + dark + board-like abdomen = abruption.",
    distractorRationales: { "A": "Abruption presents with painful, dark red bleeding", "C": "Cervical insufficiency presents with painless cervical dilation, typically in second trimester", "D": "Uterine rupture presents with severe pain and signs of shock" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a newborn at 1 minute of life using the APGAR scoring system. The infant has a heart rate of 110 bpm, slow and irregular respiratory effort, some flexion of extremities, grimace in response to stimulation, and a body that is pink with blue extremities. What is the APGAR score?",
    options: [
      { label: "A", text: "5" },
      { label: "B", text: "6" },
      { label: "C", text: "7" },
      { label: "D", text: "8" }
    ],
    correctAnswer: ["B"],
    rationale: "APGAR scoring: Heart rate 110 = 2 (>100 bpm); Respiratory effort slow/irregular = 1; Muscle tone some flexion = 1; Reflex irritability grimace = 1; Colour pink with blue extremities (acrocyanosis) = 1. Total = 2+1+1+1+1 = 6.",
    difficulty: 4, tags: ["maternity", "newborn", "APGAR"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Newborn Assessment", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "APGAR: Appearance, Pulse, Grimace, Activity, Respirations. Scored at 1 and 5 minutes. Score 7-10 = normal; 4-6 = moderate depression; 0-3 = severe depression.",
    examStrategy: "Systematically score each component: 0, 1, or 2 points. Don't rush—score each criterion separately.",
    distractorRationales: { "A": "This underestimates the heart rate score", "C": "This overestimates one of the categories", "D": "This overestimates multiple categories" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is monitoring a client in active labour. The fetal heart rate tracing shows late decelerations with three consecutive contractions. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Continue monitoring and document the pattern" },
      { label: "B", text: "Reposition the client to the left lateral position, increase IV fluids, and notify the prescriber" },
      { label: "C", text: "Administer oxytocin to strengthen contractions" },
      { label: "D", text: "Prepare the client for immediate ambulation" }
    ],
    correctAnswer: ["B"],
    rationale: "Late decelerations indicate uteroplacental insufficiency and fetal compromise. The priority nursing actions are: turn the client to the left lateral position to improve uterine blood flow, increase IV fluids to improve perfusion, administer oxygen if ordered, stop oxytocin if infusing, and notify the prescriber immediately.",
    difficulty: 3, tags: ["maternity", "fetal-monitoring", "late-decelerations"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Fetal Heart Rate Patterns", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Late decelerations: mirror image of contraction, begin after contraction peak, return to baseline after contraction ends. Always indicate uteroplacental insufficiency.",
    examStrategy: "Late decelerations = turn, increase fluids, oxygen, stop oxytocin, notify. Early decelerations = benign (head compression). Variable decelerations = cord compression.",
    distractorRationales: { "A": "Late decelerations require immediate intervention", "C": "Oxytocin should be stopped, not administered, with late decelerations", "D": "Ambulation is inappropriate when fetal compromise is suspected" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a postpartum client 2 hours after a vaginal delivery. The fundus is palpated 2 cm above the umbilicus and deviated to the right. What is the nurse's first action?",
    options: [
      { label: "A", text: "Document the finding as normal involution" },
      { label: "B", text: "Have the client void and then reassess the fundus" },
      { label: "C", text: "Begin fundal massage immediately" },
      { label: "D", text: "Administer methylergonovine as prescribed" }
    ],
    correctAnswer: ["B"],
    rationale: "A fundus that is above the umbilicus and deviated to the right suggests a distended bladder, which is displacing the uterus. The nurse should have the client void first and then reassess. A full bladder prevents the uterus from contracting properly, increasing the risk of postpartum hemorrhage.",
    difficulty: 3, tags: ["maternity", "postpartum", "fundal-assessment"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Postpartum Assessment", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Deviated fundus = full bladder. Have the client void first. A boggy, midline fundus = uterine atony requiring massage. Always check fundal position, firmness, and lochia together.",
    examStrategy: "Fundus deviated = think bladder. Fundus boggy at midline = think uterine atony (massage).",
    distractorRationales: { "A": "Deviation from midline is not normal", "C": "Address the bladder distention first", "D": "Medications are not the first intervention for a displaced fundus" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is providing prenatal education to a client at 28 weeks gestation who has gestational diabetes. Which statement by the client indicates understanding of the condition?",
    options: [
      { label: "A", text: "I will need insulin injections for the rest of my life" },
      { label: "B", text: "My baby is at risk for macrosomia, so I need to monitor my blood glucose closely" },
      { label: "C", text: "Gestational diabetes means my baby will definitely have diabetes" },
      { label: "D", text: "I can eat whatever I want as long as I take my medication" }
    ],
    correctAnswer: ["B"],
    rationale: "Gestational diabetes increases the risk of macrosomia (large baby >4000 g) due to fetal hyperinsulinemia in response to maternal hyperglycemia. Close blood glucose monitoring is essential. Gestational diabetes typically resolves after delivery, though it increases the mother's lifetime risk of type 2 diabetes. The baby does not necessarily develop diabetes.",
    difficulty: 2, tags: ["maternity", "gestational-diabetes", "client-teaching"], bodySystem: "Endocrine",
    topic: "Maternity", subtopic: "Gestational Diabetes", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Gestational diabetes typically resolves postpartum but increases lifetime risk of type 2 DM by 50%. Screen at 6-12 weeks postpartum with a 75g OGTT.",
    examStrategy: null,
    distractorRationales: { "A": "GDM typically resolves after delivery", "C": "GDM does not guarantee the baby will have diabetes", "D": "Diet management is crucial, not just medication" }
  },

  // === CRITICAL CARE (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse in the intensive care unit is caring for a client on a mechanical ventilator. The high-pressure alarm activates. Which action should the nurse take first?",
    options: [
      { label: "A", text: "Increase the tidal volume setting" },
      { label: "B", text: "Assess the client for airway obstruction and suction if indicated" },
      { label: "C", text: "Disconnect the client from the ventilator" },
      { label: "D", text: "Silence the alarm and document the event" }
    ],
    correctAnswer: ["B"],
    rationale: "A high-pressure alarm on a mechanical ventilator indicates increased resistance in the airway or circuit. Common causes include mucus plugging, kinking of the tubing, the client biting on the endotracheal tube, bronchospasm, or client-ventilator dyssynchrony. The nurse should first assess the client and suction if indicated to clear the airway.",
    difficulty: 3, tags: ["critical-care", "mechanical-ventilation", "alarms"], bodySystem: "Respiratory",
    topic: "Critical Care", subtopic: "Ventilator Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "High-pressure alarm = resistance/obstruction (suction, check tubing, client assessment). Low-pressure alarm = leak/disconnection (check connections, cuff pressure).",
    examStrategy: "High pressure = something blocking airflow. Low pressure = air escaping. Always assess the client before the equipment.",
    distractorRationales: { "A": "Increasing tidal volume would worsen the high pressure", "C": "Disconnecting is only done if the ventilator is malfunctioning and manual ventilation is needed", "D": "Never silence an alarm without investigating the cause" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client in septic shock. The client's mean arterial pressure (MAP) is 55 mmHg despite fluid resuscitation. The nurse anticipates the prescriber will order:",
    options: [
      { label: "A", text: "Additional crystalloid bolus of 2 litres" },
      { label: "B", text: "Norepinephrine infusion" },
      { label: "C", text: "Furosemide 40 mg IV" },
      { label: "D", text: "Packed red blood cell transfusion" }
    ],
    correctAnswer: ["B"],
    rationale: "According to the Surviving Sepsis Campaign guidelines, norepinephrine (Levophed) is the first-line vasopressor for septic shock when MAP remains below 65 mmHg despite adequate fluid resuscitation. It provides both alpha-adrenergic vasoconstriction and beta-1 cardiac stimulation to improve blood pressure and cardiac output.",
    difficulty: 4, tags: ["critical-care", "septic-shock", "vasopressors"], bodySystem: "Cardiovascular",
    topic: "Critical Care", subtopic: "Septic Shock Management", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Sepsis bundle: cultures before antibiotics, antibiotics within 1 hour, 30 mL/kg crystalloid bolus, vasopressors if MAP < 65 after fluids. Target MAP ≥ 65 mmHg.",
    examStrategy: null,
    distractorRationales: { "A": "Fluid resuscitation has already been attempted", "C": "Diuretics would worsen hypotension in shock", "D": "PRBCs are for hemorrhagic shock, not first-line for septic shock" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a pulmonary artery catheter. The nurse notes a pulmonary artery wedge pressure (PAWP) of 22 mmHg. This finding is consistent with:",
    options: [
      { label: "A", text: "Hypovolemia" },
      { label: "B", text: "Left-sided heart failure" },
      { label: "C", text: "Right-sided heart failure only" },
      { label: "D", text: "Normal hemodynamic status" }
    ],
    correctAnswer: ["B"],
    rationale: "Normal PAWP is 8–12 mmHg. A PAWP of 22 mmHg indicates elevated left ventricular filling pressures, consistent with left-sided heart failure and pulmonary congestion. Hypovolemia would show low PAWP values. Values above 18 mmHg typically indicate pulmonary edema.",
    difficulty: 4, tags: ["critical-care", "hemodynamics", "PA-catheter"], bodySystem: "Cardiovascular",
    topic: "Critical Care", subtopic: "Hemodynamic Monitoring", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "PAWP reflects left heart function. Normal: 8-12 mmHg. Elevated (>18): left HF/pulmonary edema. Low (<6): hypovolemia. CVP reflects right heart function.",
    examStrategy: "PAWP = left heart. CVP = right heart. High values = volume overload or failure. Low values = dehydration or hemorrhage.",
    distractorRationales: { "A": "Hypovolemia shows low PAWP", "C": "Right-sided failure shows elevated CVP, not necessarily elevated PAWP", "D": "Normal PAWP is 8-12 mmHg" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is monitoring a client who received a massive blood transfusion (6 units of packed RBCs in 2 hours). Which complication should the nurse assess for?",
    options: [
      { label: "A", text: "Hyperkalemia and hypothermia" },
      { label: "B", text: "Hypokalemia and hyperthermia" },
      { label: "C", text: "Hypernatremia and alkalosis" },
      { label: "D", text: "Hyponatremia and respiratory alkalosis" }
    ],
    correctAnswer: ["A"],
    rationale: "Massive transfusion complications include hyperkalemia (stored blood has elevated potassium from cell lysis), hypothermia (banked blood is stored at 1–6°C), hypocalcemia (citrate in preservatives binds calcium), and coagulopathy. The nurse should use blood warmers and monitor electrolytes closely.",
    difficulty: 4, tags: ["critical-care", "transfusion", "massive-transfusion"], bodySystem: "Hematologic",
    topic: "Critical Care", subtopic: "Transfusion Complications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Massive transfusion triad of death: hypothermia, acidosis, coagulopathy. Use blood warmers, monitor calcium (citrate toxicity), and check potassium frequently.",
    examStrategy: null,
    distractorRationales: { "B": "Stored blood causes hyperkalemia, not hypokalemia, and hypothermia, not hyperthermia", "C": "Hypernatremia is not a primary concern", "D": "Neither hyponatremia nor respiratory alkalosis are primary massive transfusion complications" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who develops pulseless ventricular tachycardia. According to Advanced Cardiovascular Life Support (ACLS) guidelines, what is the first intervention?",
    options: [
      { label: "A", text: "Administer amiodarone 300 mg IV bolus" },
      { label: "B", text: "Begin defibrillation at 120–200 J biphasic" },
      { label: "C", text: "Begin high-quality CPR" },
      { label: "D", text: "Establish IV access and administer epinephrine" }
    ],
    correctAnswer: ["C"],
    rationale: "According to ACLS guidelines, high-quality CPR is the first intervention for any cardiac arrest rhythm, including pulseless ventricular tachycardia. While defibrillation is critical, CPR should be initiated immediately while the defibrillator is being prepared. The sequence is: CPR → defibrillation → CPR → vasopressor/antiarrhythmic.",
    difficulty: 3, tags: ["critical-care", "ACLS", "cardiac-arrest"], bodySystem: "Cardiovascular",
    topic: "Critical Care", subtopic: "ACLS Protocols", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Shockable rhythms: V-fib and pulseless V-tach. Non-shockable: asystole and PEA. CPR always comes first—push hard, push fast (100-120/min), allow full recoil.",
    examStrategy: "CPR is ALWAYS the first intervention in cardiac arrest. Then assess rhythm and defibrillate if appropriate.",
    distractorRationales: { "A": "Amiodarone is given after the first or second shock", "B": "Defibrillation follows CPR initiation", "D": "IV access and medications come after CPR and defibrillation" }
  },

  // === DELEGATION & LEADERSHIP (4 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A registered nurse (RN) is delegating tasks to an unregulated care provider (UCP) in a Canadian acute care setting. Which task is appropriate to delegate?",
    options: [
      { label: "A", text: "Assessing a newly admitted client's neurological status" },
      { label: "B", text: "Ambulating a stable postoperative client in the hallway" },
      { label: "C", text: "Administering a PRN analgesic to a client with pain" },
      { label: "D", text: "Educating a client about a new insulin regimen" }
    ],
    correctAnswer: ["B"],
    rationale: "In Canadian nursing practice, UCPs (also called personal support workers or health care aides) can perform routine care tasks for stable clients, such as ambulation, bathing, feeding, and vital signs for stable patients. Assessment, medication administration, and client education are within the RN scope of practice and cannot be delegated to UCPs.",
    difficulty: 2, tags: ["delegation", "scope-of-practice", "UCP"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Scope of Practice", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, the term 'unregulated care provider' (UCP) is used rather than 'nursing assistant' or 'CNA.' Delegation principles remain: assess, plan, evaluate = RN. Routine care for stable clients = may be delegated.",
    examStrategy: "The Five Rights of Delegation: Right task, Right circumstance, Right person, Right direction/communication, Right supervision.",
    distractorRationales: { "A": "Assessment is an RN responsibility", "C": "Medication administration cannot be delegated to UCPs", "D": "Client education is an RN responsibility" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "An RN is working on a medical-surgical unit with one RPN/LPN and one unregulated care provider (UCP). Which client assignment is most appropriate for the RPN/LPN?",
    options: [
      { label: "A", text: "A client with an unstable cardiac rhythm requiring continuous telemetry monitoring" },
      { label: "B", text: "A client 1 day post-cholecystectomy who is stable and preparing for discharge" },
      { label: "C", text: "A client receiving a blood transfusion who is showing signs of a reaction" },
      { label: "D", text: "A newly admitted client requiring a comprehensive health history" }
    ],
    correctAnswer: ["B"],
    rationale: "The RPN/LPN is best suited for stable, predictable clients with expected outcomes. A client 1 day post-cholecystectomy preparing for discharge has predictable needs. Unstable clients, transfusion reactions, and comprehensive assessments require the RN's broader scope of practice and clinical judgment.",
    difficulty: 3, tags: ["delegation", "assignment", "RPN-scope"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Assignment Making", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, RPN scope varies by province. General rule: RPNs care for stable clients with predictable outcomes. RNs manage unstable, complex, or unpredictable clients.",
    examStrategy: "Assign the most stable, predictable clients to the LPN/RPN. RN gets unstable, unpredictable, or complex clients.",
    distractorRationales: { "A": "Unstable cardiac rhythms require RN assessment and management", "C": "Transfusion reactions are emergencies requiring RN intervention", "D": "Comprehensive assessment is an RN responsibility" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse receives a prescriber's order that the nurse believes could be harmful to the client. What is the nurse's most appropriate action?",
    options: [
      { label: "A", text: "Follow the order as prescribed since the physician ordered it" },
      { label: "B", text: "Refuse to carry out the order and document the reason" },
      { label: "C", text: "Clarify the order with the prescriber and document the communication" },
      { label: "D", text: "Ask another nurse to carry out the order instead" }
    ],
    correctAnswer: ["C"],
    rationale: "The nurse has a professional and legal obligation to question any order that could be harmful to the client. The first step is to clarify the order with the prescriber, discussing concerns and rationale. The communication should be documented. If the prescriber maintains the order and the nurse still believes it is harmful, the nurse should follow the chain of command.",
    difficulty: 2, tags: ["delegation", "patient-safety", "professional-practice"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Questioning Orders", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Nurses are legally accountable for their actions, including following harmful orders. Always clarify first, then escalate through the chain of command if needed.",
    examStrategy: "Clarify first → escalate if needed → document everything.",
    distractorRationales: { "A": "Blindly following a harmful order violates the nurse's duty of care", "B": "Refusing without clarification may delay necessary treatment", "D": "Passing the responsibility does not resolve the safety concern" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "During a mass casualty incident, a triage nurse uses the Canadian Triage and Acuity Scale (CTAS). A client arrives with severe respiratory distress, cyanosis, and an oxygen saturation of 78%. The nurse should assign which triage level?",
    options: [
      { label: "A", text: "CTAS Level 1 – Resuscitation" },
      { label: "B", text: "CTAS Level 2 – Emergent" },
      { label: "C", text: "CTAS Level 3 – Urgent" },
      { label: "D", text: "CTAS Level 4 – Less Urgent" }
    ],
    correctAnswer: ["A"],
    rationale: "CTAS Level 1 (Resuscitation) is assigned to conditions that are threats to life or limb and require immediate aggressive interventions. Severe respiratory distress with cyanosis and SpO2 of 78% indicates imminent respiratory failure requiring immediate resuscitation efforts. CTAS is the standard emergency triage system used across Canada.",
    difficulty: 3, tags: ["delegation", "triage", "CTAS", "emergency"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Triage", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "CTAS levels: 1=Resuscitation (immediate), 2=Emergent (<15 min), 3=Urgent (<30 min), 4=Less Urgent (<60 min), 5=Non-Urgent (<120 min).",
    examStrategy: null,
    distractorRationales: { "B": "Level 2 is for potentially life-threatening conditions that are not immediately critical", "C": "Level 3 is for conditions that could progress without timely care", "D": "Level 4 is for conditions that can wait up to an hour" }
  },

  // === ETHICS & LEGAL (4 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a competent adult client who refuses a blood transfusion based on religious beliefs. The client's hemoglobin is 62 g/L. What is the nurse's most appropriate action?",
    options: [
      { label: "A", text: "Administer the transfusion because the hemoglobin is critically low" },
      { label: "B", text: "Respect the client's decision and document the refusal" },
      { label: "C", text: "Contact the client's family to override the decision" },
      { label: "D", text: "Seek a court order to administer the transfusion" }
    ],
    correctAnswer: ["B"],
    rationale: "A competent adult has the right to refuse any treatment, including life-sustaining treatment, based on the principle of autonomy. In Canada, this right is protected under the Canadian Charter of Rights and Freedoms. The nurse should ensure the client understands the risks, respect the decision, and document the informed refusal.",
    difficulty: 2, tags: ["ethics", "autonomy", "informed-consent"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Patient Autonomy", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, hemoglobin is reported in g/L (normal: 120-160 g/L for females, 140-180 g/L for males). 62 g/L is critically low but the patient's right to refuse is paramount.",
    examStrategy: "Competent adult + informed decision = respect autonomy regardless of the medical consequence.",
    distractorRationales: { "A": "Administering without consent is battery", "C": "Family cannot override a competent adult's decision", "D": "Court orders are sought for incapacitated clients, not competent adults" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse discovers that a colleague has been diverting controlled substances from the medication dispensing system. According to the College of Nurses' standards, the nurse should:",
    options: [
      { label: "A", text: "Confront the colleague privately and ask them to self-report" },
      { label: "B", text: "Report the situation to the nursing manager or appropriate authority" },
      { label: "C", text: "Ignore the situation to maintain collegial relationships" },
      { label: "D", text: "Document the observations and wait for someone else to report" }
    ],
    correctAnswer: ["B"],
    rationale: "Nurses have a professional and legal obligation to report unsafe practice, including drug diversion. In Canada, provincial Colleges of Nurses require mandatory reporting of practice concerns. The nurse should report to the nursing manager or appropriate authority immediately to protect patient safety.",
    difficulty: 2, tags: ["ethics", "drug-diversion", "reporting"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Mandatory Reporting", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, mandatory reporting to the College of Nurses is required for: unsafe practice, incompetence, incapacity, and professional misconduct. This supersedes collegial loyalty.",
    examStrategy: "When patient safety is at risk, the answer is always to report through proper channels.",
    distractorRationales: { "A": "Private confrontation may allow continued diversion", "C": "Ignoring unsafe practice violates professional obligations", "D": "Waiting is not acceptable when patient safety is at risk" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who is receiving Medical Assistance in Dying (MAiD) in Canada. Which of the following is a legal requirement?",
    options: [
      { label: "A", text: "The client must have a terminal illness with less than 6 months to live" },
      { label: "B", text: "The client must be assessed by two independent medical practitioners and provide informed consent" },
      { label: "C", text: "Family members must provide written consent for the procedure" },
      { label: "D", text: "The client must be over 65 years of age" }
    ],
    correctAnswer: ["B"],
    rationale: "Under Canada's Criminal Code amendments (Bill C-14 and C-7), MAiD requires assessment by two independent medical practitioners or nurse practitioners, informed consent from the client, and the client must have a grievous and irremediable medical condition. There is no age restriction (must be 18+), no requirement for terminal illness with a specific timeline, and family consent is not required.",
    difficulty: 4, tags: ["ethics", "MAiD", "Canadian-law"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Medical Assistance in Dying", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "MAiD is unique to Canadian nursing practice. Key requirements: 18+, grievous and irremediable condition, capable of informed consent, 2 independent assessors.",
    examStrategy: null,
    distractorRationales: { "A": "Terminal illness is not required since Bill C-7 amendments", "C": "Only the client's consent is required, not family", "D": "The client must be 18+ but there is no upper age requirement" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is documenting in a client's electronic health record and makes an error in a progress note. What is the correct way to handle this in accordance with Canadian documentation standards?",
    options: [
      { label: "A", text: "Delete the entry and rewrite it correctly" },
      { label: "B", text: "Add an addendum noting the error and the correct information" },
      { label: "C", text: "Ask the unit clerk to correct the entry" },
      { label: "D", text: "Create a new chart for the client to start fresh" }
    ],
    correctAnswer: ["B"],
    rationale: "In electronic health records, entries should not be deleted. The correct practice is to add an addendum or late entry noting the error, the date and time of the correction, and the accurate information. This maintains the integrity of the medical record as a legal document.",
    difficulty: 2, tags: ["ethics", "documentation", "health-records"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Documentation Standards", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Medical records are legal documents. Never delete, white-out, or alter entries. In paper charts: single line through error, write 'error,' initial, date, and write correct entry.",
    examStrategy: null,
    distractorRationales: { "A": "Deleting entries violates documentation standards", "C": "Only the author of the note should make corrections", "D": "Creating a new chart destroys the legal record" }
  },

  // === RENAL (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with chronic kidney disease whose serum creatinine is 620 µmol/L and GFR is 12 mL/min. The client asks about dietary restrictions. Which instruction is most appropriate?",
    options: [
      { label: "A", text: "Increase protein intake to rebuild kidney tissue" },
      { label: "B", text: "Restrict potassium, phosphorus, sodium, and fluid intake" },
      { label: "C", text: "Follow a high-sodium diet to maintain blood pressure" },
      { label: "D", text: "Increase fluid intake to flush the kidneys" }
    ],
    correctAnswer: ["B"],
    rationale: "In advanced CKD (GFR <15 mL/min, Stage 5), the kidneys cannot adequately excrete potassium, phosphorus, sodium, and fluid. Dietary restrictions of these substances are essential to prevent hyperkalemia, hyperphosphatemia, fluid overload, and hypertension. In Canada, creatinine is reported in µmol/L (normal: 53–106 µmol/L); 620 µmol/L indicates severe renal impairment.",
    difficulty: 3, tags: ["renal", "CKD", "diet", "electrolytes"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Chronic Kidney Disease", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Canadian labs report creatinine in µmol/L (normal 53-106). US uses mg/dL (normal 0.6-1.2). CKD diet: restrict K+, PO4, Na+, fluid. Protein restriction varies by stage.",
    examStrategy: null,
    distractorRationales: { "A": "Excessive protein increases BUN and worsens uremia", "C": "High sodium causes fluid retention and hypertension", "D": "Increased fluids risk fluid overload when kidneys cannot excrete" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client receiving hemodialysis via an arteriovenous (AV) fistula in the left arm. Which assessment finding indicates fistula patency?",
    options: [
      { label: "A", text: "Absence of a bruit over the fistula site" },
      { label: "B", text: "A palpable thrill and audible bruit over the fistula" },
      { label: "C", text: "Cool, pale skin distal to the fistula" },
      { label: "D", text: "Edema and redness over the fistula site" }
    ],
    correctAnswer: ["B"],
    rationale: "A patent AV fistula has a palpable thrill (vibration felt on palpation) and an audible bruit (turbulent blood flow heard with stethoscope). Absence of these findings suggests thrombosis. Cool, pale skin indicates arterial compromise, and edema with redness suggests infection or stenosis.",
    difficulty: 2, tags: ["renal", "hemodialysis", "AV-fistula"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Hemodialysis Access", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "AV fistula care: no BP measurements, no blood draws, no IVs in the fistula arm. Check thrill and bruit every shift. Elevate arm post-dialysis.",
    examStrategy: null,
    distractorRationales: { "A": "Absence of bruit suggests clotting", "C": "Cool, pale skin indicates compromised circulation", "D": "Edema and redness suggest complications" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with a urinary tract infection has a urine culture showing Escherichia coli with a colony count of >100,000 CFU/mL. The client is prescribed trimethoprim-sulfamethoxazole. Which instruction should the nurse include in client teaching?",
    options: [
      { label: "A", text: "Take the medication until symptoms resolve, then stop" },
      { label: "B", text: "Complete the entire course of antibiotics even if symptoms improve" },
      { label: "C", text: "Limit fluid intake during treatment to concentrate the medication" },
      { label: "D", text: "Take the medication with an antacid to prevent stomach upset" }
    ],
    correctAnswer: ["B"],
    rationale: "Clients must complete the entire course of antibiotics to fully eradicate the infection and prevent antibiotic resistance. Stopping early when symptoms improve allows resistant bacteria to survive. Fluid intake should be increased (2-3 L/day) to flush the urinary system, and antacids can interfere with absorption.",
    difficulty: 2, tags: ["renal", "UTI", "antibiotics"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Urinary Tract Infections", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "UTI prevention: void after intercourse, wipe front to back, avoid irritants, drink adequate fluids, void frequently. Cranberry products may help prevent recurrence.",
    examStrategy: null,
    distractorRationales: { "A": "Stopping early promotes antibiotic resistance", "C": "Increased fluids are recommended, not restricted", "D": "Antacids can interfere with absorption" }
  },

  // === ENDOCRINE (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client admitted with diabetic ketoacidosis (DKA). The client's blood glucose is 28 mmol/L. Which set of interventions should the nurse anticipate?",
    options: [
      { label: "A", text: "Regular insulin IV infusion, IV normal saline, and potassium replacement" },
      { label: "B", text: "NPH insulin subcutaneous injection and oral fluids" },
      { label: "C", text: "Dextrose 50% IV push and glucagon injection" },
      { label: "D", text: "Oral hypoglycemic agents and dietary modification" }
    ],
    correctAnswer: ["A"],
    rationale: "DKA management includes: regular insulin IV infusion (only regular insulin can be given IV), aggressive IV fluid replacement with normal saline (0.9% NaCl) to correct dehydration, and potassium replacement (insulin drives potassium into cells, risking hypokalemia). In Canada, blood glucose is reported in mmol/L; 28 mmol/L is critically high (equivalent to ~504 mg/dL).",
    difficulty: 3, tags: ["endocrine", "DKA", "insulin", "emergency"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "Diabetic Ketoacidosis", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Canadian glucose units: mmol/L (normal fasting: 3.9-5.5 mmol/L). DKA triad: hyperglycemia, ketosis, acidosis. Always check potassium before giving insulin—hypokalemia can be fatal.",
    examStrategy: "DKA = insulin + fluids + potassium. HHNS = fluids + insulin (less insulin needed). Always think about potassium with insulin.",
    distractorRationales: { "B": "Subcutaneous insulin and oral fluids are insufficient for DKA", "C": "Dextrose and glucagon are for hypoglycemia, not hyperglycemia", "D": "Oral agents are not appropriate for DKA management" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client post-thyroidectomy reports numbness and tingling around the mouth and in the fingertips. The nurse should assess for which complication?",
    options: [
      { label: "A", text: "Thyroid storm" },
      { label: "B", text: "Hypocalcemia due to parathyroid damage" },
      { label: "C", text: "Laryngeal nerve damage" },
      { label: "D", text: "Hemorrhage at the surgical site" }
    ],
    correctAnswer: ["B"],
    rationale: "Numbness and tingling (paresthesia) around the mouth and in the extremities are early signs of hypocalcemia, which can occur after thyroidectomy due to inadvertent damage or removal of the parathyroid glands. The nurse should check Chvostek's sign and Trousseau's sign, and have IV calcium gluconate available.",
    difficulty: 3, tags: ["endocrine", "thyroidectomy", "hypocalcemia"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "Post-Thyroidectomy Complications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Post-thyroidectomy priorities: airway (laryngeal edema), bleeding (check behind neck), hypocalcemia (parathyroid damage), voice changes (recurrent laryngeal nerve). Keep tracheostomy tray and IV calcium at bedside.",
    examStrategy: "Tingling/numbness post-thyroidectomy = hypocalcemia. Hoarseness = laryngeal nerve damage. Neck swelling = hemorrhage.",
    distractorRationales: { "A": "Thyroid storm presents with hyperthermia, tachycardia, and agitation", "C": "Laryngeal nerve damage causes hoarseness, not paresthesia", "D": "Hemorrhage presents with neck swelling, difficulty breathing" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a client with Addison's disease about managing their condition. Which statement by the client indicates understanding?",
    options: [
      { label: "A", text: "I should decrease my corticosteroid dose when I feel better" },
      { label: "B", text: "I need to increase my corticosteroid dose during times of stress or illness" },
      { label: "C", text: "I should restrict my sodium intake to prevent fluid retention" },
      { label: "D", text: "I can stop taking my medications once my symptoms resolve" }
    ],
    correctAnswer: ["B"],
    rationale: "Addison's disease (adrenal insufficiency) requires lifelong corticosteroid replacement therapy. During periods of physiological stress (illness, surgery, trauma), the body requires more cortisol, so the replacement dose must be increased (stress dosing) to prevent adrenal crisis. Sodium should not be restricted as these clients are prone to hyponatremia.",
    difficulty: 3, tags: ["endocrine", "addisons-disease", "corticosteroids"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "Addison's Disease", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Addison's = hyposecretion (low cortisol, low aldosterone). Cushing's = hypersecretion. Addisonian crisis: hypotension, hyponatremia, hyperkalemia—treat with IV hydrocortisone and NS.",
    examStrategy: "Addison's disease: increase steroids during stress. Cushing's syndrome: reduce steroids. Never abruptly stop corticosteroids.",
    distractorRationales: { "A": "Doses should never be decreased without prescriber guidance", "C": "Sodium restriction is contraindicated in Addison's", "D": "Lifelong therapy is required; stopping risks adrenal crisis" }
  },

  // === INFECTION CONTROL (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client diagnosed with active pulmonary tuberculosis. Which type of isolation precautions should the nurse implement?",
    options: [
      { label: "A", text: "Contact precautions" },
      { label: "B", text: "Droplet precautions" },
      { label: "C", text: "Airborne precautions" },
      { label: "D", text: "Standard precautions only" }
    ],
    correctAnswer: ["C"],
    rationale: "Active pulmonary tuberculosis requires airborne precautions because TB is transmitted via airborne nuclei (droplet nuclei) that remain suspended in the air for long periods. The client should be placed in a negative pressure airborne infection isolation room (AIIR), and healthcare workers must wear N95 respirators or PAPRs.",
    difficulty: 2, tags: ["infection-control", "TB", "airborne-precautions"], bodySystem: "Respiratory",
    topic: "Infection Control", subtopic: "Transmission-Based Precautions", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Airborne precautions: TB, measles, varicella (chickenpox), disseminated herpes zoster. Use N95 respirator + negative pressure room. Mnemonic: 'My Chicken Has TB' (Measles, Chickenpox, Herpes zoster, TB).",
    examStrategy: null,
    distractorRationales: { "A": "Contact precautions are for MRSA, C. difficile, etc.", "B": "Droplet precautions are for influenza, pertussis, meningococcal meningitis", "D": "Standard precautions alone are insufficient for TB" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is donning personal protective equipment (PPE) to care for a client on contact and droplet precautions. What is the correct order for donning PPE?",
    options: [
      { label: "A", text: "Gloves, gown, mask, eye protection" },
      { label: "B", text: "Gown, mask, eye protection, gloves" },
      { label: "C", text: "Mask, gown, gloves, eye protection" },
      { label: "D", text: "Eye protection, mask, gown, gloves" }
    ],
    correctAnswer: ["B"],
    rationale: "The correct order for donning PPE according to PHAC (Public Health Agency of Canada) and IPAC guidelines is: gown first (protects clothing), then mask/respirator (protects respiratory tract), eye protection (protects mucous membranes), and gloves last (covers hands and secures gown cuffs). This sequence ensures optimal protection.",
    difficulty: 2, tags: ["infection-control", "PPE", "donning-sequence"], bodySystem: "Professional Practice",
    topic: "Infection Control", subtopic: "PPE Donning and Doffing", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Donning: Gown → Mask → Eye protection → Gloves. Doffing (removal): Gloves → Gown → Eye protection → Mask. Perform hand hygiene after removing each piece.",
    examStrategy: "Remember: 'Going in: gown first, gloves last. Coming out: gloves first, mask last.' Hand hygiene between each step.",
    distractorRationales: { "A": "Gloves should be last, not first", "C": "Gown should be first, not mask", "D": "This sequence is incorrect" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is implementing Routine Practices (the Canadian equivalent of Standard Precautions) when caring for all clients. Which action demonstrates proper implementation?",
    options: [
      { label: "A", text: "Wearing gloves only when caring for clients with known infections" },
      { label: "B", text: "Performing hand hygiene before and after every client contact regardless of glove use" },
      { label: "C", text: "Recapping needles carefully after use to prevent needlestick injuries" },
      { label: "D", text: "Wearing an N95 respirator for all client interactions" }
    ],
    correctAnswer: ["B"],
    rationale: "Routine Practices (Canada's term for Standard Precautions) include performing hand hygiene before and after every client contact, regardless of whether gloves were worn. This is the single most important measure to prevent healthcare-associated infections. Gloves are worn when contact with blood or body fluids is anticipated, needles should never be recapped, and N95s are only for airborne precautions.",
    difficulty: 2, tags: ["infection-control", "routine-practices", "hand-hygiene"], bodySystem: "Professional Practice",
    topic: "Infection Control", subtopic: "Routine Practices", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "In Canada, 'Routine Practices' is the term used instead of 'Standard Precautions.' The WHO's '5 Moments for Hand Hygiene' is followed across Canadian healthcare settings.",
    examStrategy: null,
    distractorRationales: { "A": "Gloves are used based on anticipated exposure, not just known infections", "C": "Needles should NEVER be recapped—use safety-engineered devices", "D": "N95 respirators are only for airborne precautions" }
  },

  // === GI (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client with suspected appendicitis. Which assessment finding is most consistent with this diagnosis?",
    options: [
      { label: "A", text: "Diffuse abdominal pain that improves with eating" },
      { label: "B", text: "Right lower quadrant pain at McBurney's point with rebound tenderness" },
      { label: "C", text: "Left upper quadrant pain radiating to the back" },
      { label: "D", text: "Epigastric pain relieved by antacids" }
    ],
    correctAnswer: ["B"],
    rationale: "Appendicitis classically presents with periumbilical pain that migrates to the right lower quadrant at McBurney's point (one-third of the distance from the anterior superior iliac spine to the umbilicus). Rebound tenderness (pain upon release of pressure) indicates peritoneal irritation. These are hallmark findings of appendicitis.",
    difficulty: 2, tags: ["GI", "appendicitis", "assessment"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "Appendicitis", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Appendicitis signs: McBurney's point tenderness, Rovsing's sign (RLQ pain with LLQ palpation), psoas sign, obturator sign. Avoid applying heat or giving enemas—risk of rupture.",
    examStrategy: null,
    distractorRationales: { "A": "Appendicitis pain is localized, not diffuse, and worsens with movement", "C": "LUQ pain radiating to back suggests pancreatitis or splenic issues", "D": "Epigastric pain relieved by antacids suggests peptic ulcer disease" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a nasogastric (NG) tube connected to low intermittent suction. The client develops metabolic alkalosis. The nurse understands that this is caused by:",
    options: [
      { label: "A", text: "Loss of gastric acid (HCl) through the NG tube" },
      { label: "B", text: "Retention of carbon dioxide" },
      { label: "C", text: "Excessive administration of IV fluids" },
      { label: "D", text: "Increased renal excretion of bicarbonate" }
    ],
    correctAnswer: ["A"],
    rationale: "NG suction removes gastric acid (hydrochloric acid) from the stomach, resulting in a loss of hydrogen ions (H+). This loss of acid shifts the body toward alkalosis (metabolic alkalosis). The condition is often accompanied by hypokalemia and hypochloremia.",
    difficulty: 3, tags: ["GI", "NG-tube", "acid-base"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "NG Tube Complications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "NG suction = loss of H+ and Cl- = metabolic alkalosis + hypokalemia + hypochloremia. Vomiting causes the same acid-base imbalance.",
    examStrategy: "Loss of gastric contents (vomiting, NG suction) = metabolic alkalosis. Loss of intestinal contents (diarrhea) = metabolic acidosis.",
    distractorRationales: { "B": "CO2 retention causes respiratory acidosis", "C": "IV fluids alone don't typically cause metabolic alkalosis", "D": "Increased bicarbonate excretion would cause acidosis, not alkalosis" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing a client for a colonoscopy scheduled for tomorrow morning. Which instruction is most important for the nurse to include in the preparation teaching?",
    options: [
      { label: "A", text: "Eat a high-fibre diet today to ensure a clean bowel" },
      { label: "B", text: "Drink the bowel preparation solution as directed and remain NPO after midnight" },
      { label: "C", text: "Take aspirin before the procedure to prevent blood clots" },
      { label: "D", text: "Continue all regular medications including iron supplements" }
    ],
    correctAnswer: ["B"],
    rationale: "Proper bowel preparation is essential for adequate visualization during colonoscopy. The client should consume clear liquids, drink the prescribed bowel preparation solution to cleanse the bowel, and remain NPO after midnight. A high-fibre diet, aspirin (bleeding risk), and iron supplements (dark stool, interferes with visualization) should all be avoided before the procedure.",
    difficulty: 2, tags: ["GI", "colonoscopy", "pre-procedure"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "Colonoscopy Preparation", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Stop iron supplements 7 days before, anticoagulants as directed by prescriber. Clear liquids only the day before. Complete bowel prep is essential for adequate mucosal visualization.",
    examStrategy: null,
    distractorRationales: { "A": "A low-residue or clear liquid diet is required, not high-fibre", "C": "Aspirin increases bleeding risk during the procedure", "D": "Iron supplements should be stopped before colonoscopy" }
  },

  // === MUSCULOSKELETAL (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who had a total hip replacement 12 hours ago. Which finding requires immediate nursing intervention?",
    options: [
      { label: "A", text: "Moderate pain at the surgical site rated 5/10" },
      { label: "B", text: "The client's operative leg is shorter and externally rotated" },
      { label: "C", text: "Slight swelling around the incision site" },
      { label: "D", text: "The client reports feeling anxious about mobilization" }
    ],
    correctAnswer: ["B"],
    rationale: "Shortening and external rotation of the operative leg are classic signs of hip prosthesis dislocation, which is a surgical emergency. The nurse should immobilize the leg, notify the surgeon immediately, and keep the client NPO in preparation for possible surgical intervention. The other findings are expected or manageable.",
    difficulty: 3, tags: ["musculoskeletal", "hip-replacement", "dislocation"], bodySystem: "Musculoskeletal",
    topic: "Musculoskeletal", subtopic: "Joint Replacement Complications", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Hip dislocation signs: shortened operative leg + external rotation + severe pain. Prevention: avoid hip flexion >90°, avoid crossing legs, use abductor pillow, elevated toilet seat.",
    examStrategy: "Shortened and rotated leg after hip replacement = dislocation until proven otherwise.",
    distractorRationales: { "A": "Moderate pain is expected postoperatively", "C": "Slight swelling is a normal inflammatory response", "D": "Anxiety about mobilization is expected and can be addressed with reassurance" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client with a new plaster cast on the right lower leg. The client reports increasing pain unrelieved by prescribed analgesics, and the nurse notes that the toes are pale, cool, and the client cannot dorsiflex the foot. The nurse suspects:",
    options: [
      { label: "A", text: "Deep vein thrombosis" },
      { label: "B", text: "Compartment syndrome" },
      { label: "C", text: "Fat embolism" },
      { label: "D", text: "Normal postoperative swelling" }
    ],
    correctAnswer: ["B"],
    rationale: "The combination of pain unrelieved by analgesics (disproportionate pain), pallor, coolness, and inability to move the foot (paralysis) are classic signs of compartment syndrome. This is a surgical emergency where increased pressure within the fascial compartment compromises blood flow to muscles and nerves. The cast must be bivalved immediately and a fasciotomy may be required.",
    difficulty: 4, tags: ["musculoskeletal", "compartment-syndrome", "emergency"], bodySystem: "Musculoskeletal",
    topic: "Musculoskeletal", subtopic: "Compartment Syndrome", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "The 6 P's of compartment syndrome: Pain (disproportionate, unrelieved by analgesics), Pressure, Paralysis, Paresthesia, Pallor, Pulselessness. This is an emergency—bivalve the cast immediately.",
    examStrategy: "Pain out of proportion + neurovascular compromise + cast = compartment syndrome. Act immediately.",
    distractorRationales: { "A": "DVT presents with calf pain, swelling, and warmth, not pallor and paralysis", "C": "Fat embolism presents with respiratory distress, petechial rash, and confusion", "D": "Pain unrelieved by analgesics with neurovascular compromise is not normal" }
  },

  // === WOUND CARE (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a pressure injury on a client's sacrum. The wound has full-thickness tissue loss with visible subcutaneous fat, but no bone, tendon, or muscle is exposed. How should the nurse classify this pressure injury?",
    options: [
      { label: "A", text: "Stage 1" },
      { label: "B", text: "Stage 2" },
      { label: "C", text: "Stage 3" },
      { label: "D", text: "Stage 4" }
    ],
    correctAnswer: ["C"],
    rationale: "Stage 3 pressure injuries involve full-thickness tissue loss with visible subcutaneous fat, but bone, tendon, and muscle are not exposed. Stage 1 shows intact skin with non-blanchable redness, Stage 2 involves partial-thickness loss with exposed dermis, and Stage 4 involves full-thickness loss with exposed bone, tendon, or muscle.",
    difficulty: 3, tags: ["wound-care", "pressure-injury", "staging"], bodySystem: "Integumentary",
    topic: "Wound Care", subtopic: "Pressure Injury Staging", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Pressure injury staging: Stage 1 = non-blanchable redness; Stage 2 = partial thickness (blister/abrasion); Stage 3 = full thickness (fat visible); Stage 4 = full thickness (bone/tendon visible). Unstageable = slough/eschar covering wound.",
    examStrategy: null,
    distractorRationales: { "A": "Stage 1 has intact skin with non-blanchable erythema", "B": "Stage 2 is partial-thickness, not full-thickness", "D": "Stage 4 has exposed bone, tendon, or muscle" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a surgical wound healing by secondary intention. The wound bed has 80% red granulation tissue and 20% yellow slough. Which wound care intervention is most appropriate?",
    options: [
      { label: "A", text: "Apply a dry gauze dressing and change daily" },
      { label: "B", text: "Pack the wound with moistened gauze and apply a secondary dressing" },
      { label: "C", text: "Apply a hydrocolloid dressing over the wound" },
      { label: "D", text: "Leave the wound open to air to promote drying" }
    ],
    correctAnswer: ["B"],
    rationale: "A wound healing by secondary intention with granulation tissue and some slough requires moist wound healing to promote autolytic debridement of the slough while supporting granulation tissue growth. Moistened gauze packed into the wound maintains a moist environment. The wound should not be dried out, as moisture promotes healing.",
    difficulty: 3, tags: ["wound-care", "secondary-intention", "moist-healing"], bodySystem: "Integumentary",
    topic: "Wound Care", subtopic: "Wound Healing", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Wound bed colours: Red = healthy granulation (protect and keep moist); Yellow = slough (debride gently); Black = eschar (requires debridement). Moist wound healing is always preferred over dry.",
    examStrategy: null,
    distractorRationales: { "A": "Dry gauze can adhere to and damage granulation tissue", "C": "Hydrocolloid is for shallow wounds, not deep wounds requiring packing", "D": "Drying delays healing and damages new tissue" }
  },

  // === FLUID & ELECTROLYTES (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with hyponatremia (serum sodium 125 mmol/L). Which client assessment finding is most concerning?",
    options: [
      { label: "A", text: "Muscle cramps and weakness" },
      { label: "B", text: "Confusion and seizure activity" },
      { label: "C", text: "Nausea and abdominal cramping" },
      { label: "D", text: "Headache and fatigue" }
    ],
    correctAnswer: ["B"],
    rationale: "Severe hyponatremia (Na+ < 125 mmol/L) can cause cerebral edema leading to confusion, seizures, and potentially coma or death. While the other symptoms are associated with hyponatremia, neurological symptoms are most dangerous and require immediate intervention including hypertonic saline (3% NaCl) administered carefully to avoid osmotic demyelination syndrome.",
    difficulty: 3, tags: ["fluid-electrolytes", "hyponatremia", "neurological"], bodySystem: "Fluid and Electrolytes",
    topic: "Fluid and Electrolytes", subtopic: "Hyponatremia", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Correct hyponatremia slowly (no more than 8-10 mmol/L in 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis).",
    examStrategy: "Neurological symptoms (seizures, confusion) are always the most concerning findings in electrolyte imbalances.",
    distractorRationales: { "A": "Muscle cramps are common but less immediately dangerous", "C": "GI symptoms are expected but not life-threatening", "D": "Headache and fatigue are mild symptoms" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with a serum potassium of 6.2 mmol/L has the following ECG changes: tall, peaked T waves and a widened QRS complex. The nurse's priority action is:",
    options: [
      { label: "A", text: "Encourage the client to eat bananas and orange juice" },
      { label: "B", text: "Administer IV calcium gluconate as prescribed" },
      { label: "C", text: "Place the client on fluid restriction" },
      { label: "D", text: "Prepare potassium chloride for IV infusion" }
    ],
    correctAnswer: ["B"],
    rationale: "Hyperkalemia (K+ > 5.0 mmol/L) with ECG changes (peaked T waves, widened QRS) is a medical emergency. IV calcium gluconate is administered first to stabilize the cardiac membrane and prevent fatal dysrhythmias. This does not lower potassium but protects the heart while other treatments (insulin + glucose, sodium bicarbonate, kayexalate, dialysis) are initiated.",
    difficulty: 4, tags: ["fluid-electrolytes", "hyperkalemia", "cardiac-emergency"], bodySystem: "Fluid and Electrolytes",
    topic: "Fluid and Electrolytes", subtopic: "Hyperkalemia", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Hyperkalemia treatment order: 1) Calcium gluconate (cardiac protection), 2) Insulin + glucose (shifts K+ intracellularly), 3) Sodium bicarb if acidotic, 4) Kayexalate (removes K+), 5) Dialysis if refractory.",
    examStrategy: "Hyperkalemia with ECG changes = immediate cardiac protection with calcium gluconate.",
    distractorRationales: { "A": "Bananas and orange juice are high in potassium and would worsen hyperkalemia", "C": "Fluid restriction does not address hyperkalemia", "D": "Additional potassium would worsen the hyperkalemia" }
  },

  // === ADDITIONAL TOPICS TO REACH 75 (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing to administer a unit of packed red blood cells. During the initial 15 minutes of the transfusion, the client develops chills, fever, low back pain, and dark urine. The nurse should first:",
    options: [
      { label: "A", text: "Slow the infusion rate and administer acetaminophen" },
      { label: "B", text: "Stop the transfusion immediately and maintain IV access with normal saline" },
      { label: "C", text: "Increase the infusion rate to complete the transfusion quickly" },
      { label: "D", text: "Administer diphenhydramine and continue the transfusion" }
    ],
    correctAnswer: ["B"],
    rationale: "These symptoms indicate an acute hemolytic transfusion reaction, which is a life-threatening emergency caused by ABO incompatibility. The nurse must immediately stop the transfusion, maintain IV access with normal saline (using new tubing), send the remaining blood and a post-transfusion blood sample to the lab, and notify the prescriber.",
    difficulty: 3, tags: ["hematologic", "transfusion-reaction", "emergency"], bodySystem: "Hematologic",
    topic: "Hematologic", subtopic: "Transfusion Reactions", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Acute hemolytic reaction: chills, fever, low back/flank pain, dark (hemoglobinuric) urine, hypotension. STOP transfusion immediately. Send blood bag + post-transfusion sample to blood bank.",
    examStrategy: "Any suspected transfusion reaction = STOP the transfusion first. Then maintain IV access, notify prescriber, and send samples.",
    distractorRationales: { "A": "Slowing is insufficient for a hemolytic reaction", "C": "Increasing the rate would worsen the reaction", "D": "This is a hemolytic reaction, not an allergic reaction" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who is 2 days postoperative following abdominal surgery. The client coughs and reports feeling something 'give way.' The nurse observes evisceration of the bowel. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Push the bowel back into the abdomen and apply a sterile dressing" },
      { label: "B", text: "Cover the exposed bowel with sterile saline-soaked dressings and call the surgeon" },
      { label: "C", text: "Apply an abdominal binder and have the client ambulate" },
      { label: "D", text: "Document the finding and continue routine postoperative care" }
    ],
    correctAnswer: ["B"],
    rationale: "Evisceration (protrusion of abdominal organs through the wound) is a surgical emergency. The nurse should: 1) Call for help, 2) Cover the exposed organs with sterile saline-moistened dressings to prevent drying and tissue damage, 3) Position the client supine with knees bent to reduce abdominal tension, 4) Notify the surgeon immediately, 5) Prepare for emergency return to the operating room.",
    difficulty: 3, tags: ["surgical", "evisceration", "emergency"], bodySystem: "Gastrointestinal",
    topic: "Surgical Nursing", subtopic: "Wound Dehiscence and Evisceration", regionScope: "CAN", careerType: "nursing",
    clinicalPearl: "Never attempt to push organs back in. Cover with sterile NS-soaked gauze, keep client supine with knees flexed, NPO, and prepare for OR. Risk factors: obesity, coughing, straining, poor nutrition, infection.",
    examStrategy: "Evisceration = cover with sterile moist dressings + notify surgeon + supine with knees bent + NPO.",
    distractorRationales: { "A": "Never push organs back into the abdomen—risk of contamination and injury", "C": "Ambulation would worsen the evisceration", "D": "This is a surgical emergency requiring immediate intervention" }
  }
];

// USA QUESTIONS (75 questions)
const usaQuestions: QuestionData[] = [
  // === PHARMACOLOGY (8 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing to administer lisinopril to a client with hypertension. The client's potassium level is 5.8 mEq/L. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Administer the medication as prescribed" },
      { label: "B", text: "Hold the medication and notify the provider" },
      { label: "C", text: "Administer the medication with a potassium supplement" },
      { label: "D", text: "Give the medication and recheck potassium in 4 hours" }
    ],
    correctAnswer: ["B"],
    rationale: "ACE inhibitors like lisinopril can cause hyperkalemia by decreasing aldosterone secretion and reducing potassium excretion. A potassium level of 5.8 mEq/L is dangerously elevated (normal: 3.5-5.0 mEq/L). The nurse should hold the medication and notify the provider immediately, as administering it could worsen the hyperkalemia.",
    difficulty: 2, tags: ["pharmacology", "ACE-inhibitors", "hyperkalemia"], bodySystem: "Cardiovascular",
    topic: "Pharmacology", subtopic: "ACE Inhibitors", regionScope: "US", careerType: "nursing",
    clinicalPearl: "ACE inhibitors and ARBs cause hyperkalemia. Always check potassium before administration. Dry cough is a common ACE inhibitor side effect—switch to an ARB if it occurs.",
    examStrategy: "ACE inhibitor + elevated potassium = hold the medication. Remember: ACE inhibitors end in '-pril.'",
    distractorRationales: { "A": "Administering with elevated K+ risks cardiac arrest", "C": "Adding potassium would worsen hyperkalemia", "D": "The K+ level requires immediate intervention" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is receiving IV nitroprusside for hypertensive crisis. The nurse should monitor for which toxic effect specific to this medication?",
    options: [
      { label: "A", text: "Serotonin syndrome" },
      { label: "B", text: "Cyanide toxicity" },
      { label: "C", text: "Neuroleptic malignant syndrome" },
      { label: "D", text: "Malignant hyperthermia" }
    ],
    correctAnswer: ["B"],
    rationale: "Nitroprusside (Nipride) is metabolized to cyanide, which can accumulate with prolonged use or high doses. Signs of cyanide toxicity include metabolic acidosis, tachycardia, altered consciousness, and seizures. The antidote is sodium thiosulfate or hydroxocobalamin. The solution must be protected from light.",
    difficulty: 4, tags: ["pharmacology", "nitroprusside", "toxicity"], bodySystem: "Cardiovascular",
    topic: "Pharmacology", subtopic: "Antihypertensive Emergencies", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Nitroprusside: wrap IV bag in aluminum foil (light-sensitive), monitor thiocyanate levels for prolonged infusions (>48-72h), watch for metabolic acidosis as early sign of cyanide toxicity.",
    examStrategy: null,
    distractorRationales: { "A": "Serotonin syndrome is associated with SSRIs/MAOIs", "C": "NMS is associated with antipsychotics", "D": "Malignant hyperthermia is associated with anesthetic agents" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a client about newly prescribed levothyroxine for hypothyroidism. Which statement indicates the client understands proper medication administration?",
    options: [
      { label: "A", text: "I will take this medication at bedtime with a glass of milk" },
      { label: "B", text: "I should take this medication on an empty stomach, 30-60 minutes before breakfast" },
      { label: "C", text: "I can take this medication with my calcium and iron supplements" },
      { label: "D", text: "I only need to take this medication when I feel tired" }
    ],
    correctAnswer: ["B"],
    rationale: "Levothyroxine should be taken on an empty stomach, ideally 30-60 minutes before breakfast, with a full glass of water for optimal absorption. Calcium, iron, antacids, and dairy products significantly decrease absorption. The medication must be taken consistently every day, not as needed.",
    difficulty: 2, tags: ["pharmacology", "levothyroxine", "thyroid"], bodySystem: "Endocrine",
    topic: "Pharmacology", subtopic: "Thyroid Medications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Levothyroxine interactions: calcium, iron, antacids, proton pump inhibitors all decrease absorption. Separate by at least 4 hours.",
    examStrategy: null,
    distractorRationales: { "A": "Milk contains calcium which decreases absorption", "C": "Calcium and iron interfere with absorption", "D": "It must be taken daily, not as needed" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client receiving morphine sulfate IV for acute pain becomes unresponsive with a respiratory rate of 6 breaths per minute and pinpoint pupils. What should the nurse administer?",
    options: [
      { label: "A", text: "Flumazenil" },
      { label: "B", text: "Naloxone" },
      { label: "C", text: "Atropine" },
      { label: "D", text: "Epinephrine" }
    ],
    correctAnswer: ["B"],
    rationale: "The client is experiencing opioid overdose characterized by the classic triad: respiratory depression, unresponsiveness, and pinpoint pupils (miosis). Naloxone (Narcan) is the opioid antagonist that reverses these effects. It should be administered IV, IM, or intranasally. Flumazenil reverses benzodiazepines.",
    difficulty: 2, tags: ["pharmacology", "opioid-overdose", "naloxone"], bodySystem: "Neurological",
    topic: "Pharmacology", subtopic: "Opioid Reversal", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Naloxone has a shorter duration than most opioids—monitor for re-sedation. May need repeat doses every 2-3 minutes. Can precipitate acute withdrawal in opioid-dependent patients.",
    examStrategy: "Opioid overdose triad: respiratory depression + miosis + decreased LOC = naloxone.",
    distractorRationales: { "A": "Flumazenil reverses benzodiazepines, not opioids", "C": "Atropine is for bradycardia and organophosphate poisoning", "D": "Epinephrine is for anaphylaxis and cardiac arrest" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client prescribed lithium carbonate for bipolar disorder. The client's serum lithium level is 2.0 mEq/L. The nurse should first:",
    options: [
      { label: "A", text: "Administer the next dose as scheduled" },
      { label: "B", text: "Hold the lithium and notify the provider" },
      { label: "C", text: "Encourage the client to increase sodium intake" },
      { label: "D", text: "Administer a PRN dose of lithium" }
    ],
    correctAnswer: ["B"],
    rationale: "The therapeutic range for lithium is 0.6-1.2 mEq/L. A level of 2.0 mEq/L is toxic and can cause serious effects including confusion, coarse tremors, seizures, renal failure, and cardiac dysrhythmias. The nurse should hold the medication, notify the provider, and monitor for signs of toxicity.",
    difficulty: 3, tags: ["pharmacology", "lithium", "toxicity"], bodySystem: "Mental Health",
    topic: "Pharmacology", subtopic: "Mood Stabilizers", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Lithium toxicity signs: fine tremors (therapeutic), coarse tremors (early toxicity), seizures/coma (severe toxicity). Draw levels 8-12 hours after last dose. Dehydration and NSAIDs increase lithium levels.",
    examStrategy: "Any drug level above therapeutic range = hold the medication and notify the provider.",
    distractorRationales: { "A": "The level is toxic; administering more lithium is dangerous", "C": "Sodium intake management is for prevention, not acute toxicity", "D": "Additional lithium would worsen toxicity" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing to administer enoxaparin subcutaneously to a postoperative client for DVT prophylaxis. Which technique demonstrates correct administration?",
    options: [
      { label: "A", text: "Aspirate before injection and massage the site afterward" },
      { label: "B", text: "Inject into the abdomen without aspirating, and do not rub the site" },
      { label: "C", text: "Administer the injection into the deltoid muscle" },
      { label: "D", text: "Inject at a 45-degree angle into the thigh" }
    ],
    correctAnswer: ["B"],
    rationale: "Enoxaparin (Lovenox) is administered subcutaneously into the abdomen (at least 2 inches from the umbilicus) at a 90-degree angle. Do NOT aspirate before injection or rub/massage the site afterward, as these actions increase the risk of bruising and hematoma formation. The air bubble in the prefilled syringe should NOT be expelled.",
    difficulty: 2, tags: ["pharmacology", "enoxaparin", "injection-technique"], bodySystem: "Hematologic",
    topic: "Pharmacology", subtopic: "Anticoagulant Administration", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Enoxaparin specifics: subcutaneous only (never IM), abdomen preferred, 90-degree angle, keep the air bubble, no aspiration, no rubbing. Rotate injection sites.",
    examStrategy: null,
    distractorRationales: { "A": "Do not aspirate or massage with subcutaneous anticoagulants", "C": "Enoxaparin is subcutaneous, not intramuscular", "D": "The injection is given at 90 degrees into the abdomen" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is prescribed nitroglycerin sublingual for angina. The nurse should instruct the client to:",
    options: [
      { label: "A", text: "Swallow the tablet with a full glass of water" },
      { label: "B", text: "Place the tablet under the tongue and sit or lie down; call 911 if pain is unrelieved after 1 dose" },
      { label: "C", text: "Chew the tablet for faster absorption" },
      { label: "D", text: "Take up to 10 tablets before seeking emergency care" }
    ],
    correctAnswer: ["B"],
    rationale: "Per updated AHA guidelines, patients should place nitroglycerin under the tongue and sit or lie down to prevent hypotension. If chest pain is not relieved after one dose, call 911 immediately rather than taking additional doses at home. The previous recommendation of taking up to 3 doses has been updated to prioritize early emergency activation.",
    difficulty: 3, tags: ["pharmacology", "nitroglycerin", "angina"], bodySystem: "Cardiovascular",
    topic: "Pharmacology", subtopic: "Antianginal Medications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Updated AHA recommendation: Take 1 NTG SL, call 911 if no relief. Store in original dark glass container. Tingling/burning under the tongue confirms potency. Headache is an expected side effect.",
    examStrategy: "Nitroglycerin teaching: sit/lie down (hypotension risk), 1 dose → call 911 if unrelieved. Never use with PDE-5 inhibitors (sildenafil).",
    distractorRationales: { "A": "Sublingual tablets must dissolve under the tongue", "C": "Chewing is not the correct route for sublingual NTG", "D": "Taking 10 tablets is dangerous and delays emergency care" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who is receiving gentamicin. The trough level is 4 mcg/mL (therapeutic trough: <2 mcg/mL). What action should the nurse take?",
    options: [
      { label: "A", text: "Administer the next dose as scheduled" },
      { label: "B", text: "Hold the dose and notify the provider" },
      { label: "C", text: "Double the next dose to achieve therapeutic levels" },
      { label: "D", text: "Administer the dose and recheck the level in 24 hours" }
    ],
    correctAnswer: ["B"],
    rationale: "A gentamicin trough level of 4 mcg/mL is above the therapeutic trough level (<2 mcg/mL), indicating the drug is accumulating and increasing the risk of nephrotoxicity and ototoxicity. The nurse should hold the medication and notify the provider for dose adjustment.",
    difficulty: 3, tags: ["pharmacology", "gentamicin", "peak-trough"], bodySystem: "Renal",
    topic: "Pharmacology", subtopic: "Aminoglycoside Monitoring", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Trough levels are drawn just before the next dose. Peak levels are drawn 30 min after IV infusion. Elevated troughs = accumulation risk. Monitor BUN, creatinine, and hearing.",
    examStrategy: null,
    distractorRationales: { "A": "The elevated trough indicates accumulation", "C": "Doubling the dose would worsen toxicity", "D": "The level requires immediate action" }
  },

  // === CARDIOVASCULAR (6 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is admitted with a blood pressure of 220/120 mmHg and reports a severe headache and blurred vision. The nurse identifies this as a hypertensive emergency. Which medication does the nurse anticipate administering?",
    options: [
      { label: "A", text: "Oral amlodipine" },
      { label: "B", text: "IV nicardipine or nitroprusside" },
      { label: "C", text: "Sublingual nifedipine" },
      { label: "D", text: "Oral hydrochlorothiazide" }
    ],
    correctAnswer: ["B"],
    rationale: "A hypertensive emergency with end-organ damage (headache, visual changes indicating possible hypertensive encephalopathy) requires IV antihypertensive medications for controlled, gradual blood pressure reduction. IV nicardipine or nitroprusside allows precise titration. Sublingual nifedipine is no longer recommended due to unpredictable drops. Oral medications are too slow.",
    difficulty: 4, tags: ["cardiovascular", "hypertensive-emergency", "IV-medications"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Hypertensive Emergencies", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Reduce MAP by no more than 25% in the first hour to prevent cerebral hypoperfusion. IV nicardipine, nitroprusside, or labetalol are first-line. Avoid sublingual nifedipine.",
    examStrategy: "Hypertensive emergency = IV medications for controlled reduction. Hypertensive urgency (no organ damage) = oral medications acceptable.",
    distractorRationales: { "A": "Oral medications are too slow for emergencies", "C": "Sublingual nifedipine causes unpredictable BP drops", "D": "Diuretics are not first-line for hypertensive emergencies" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with peripheral arterial disease (PAD). Which assessment finding is most consistent with this condition?",
    options: [
      { label: "A", text: "Edema, brown skin discoloration, and stasis dermatitis" },
      { label: "B", text: "Intermittent claudication, diminished peripheral pulses, and cool, pale extremities" },
      { label: "C", text: "Warm, reddened skin with pitting edema" },
      { label: "D", text: "Spider veins and varicose veins" }
    ],
    correctAnswer: ["B"],
    rationale: "Peripheral arterial disease is characterized by inadequate arterial blood flow to the extremities. Classic findings include intermittent claudication (pain with activity, relieved by rest), diminished or absent peripheral pulses, cool and pale extremities, hair loss on the legs, and thick, brittle nails. Venous insufficiency presents with edema and brown discoloration.",
    difficulty: 2, tags: ["cardiovascular", "PAD", "peripheral-vascular"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Peripheral Arterial Disease", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Arterial vs Venous: Arterial = pale, cool, pulseless, pain with elevation, intermittent claudication. Venous = edema, brown pigmentation, warm, pain with dependency.",
    examStrategy: null,
    distractorRationales: { "A": "Brown discoloration and stasis dermatitis are signs of venous insufficiency", "C": "Warm, reddened skin with pitting edema suggests venous disease", "D": "Spider and varicose veins are venous conditions" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client 24 hours after a percutaneous coronary intervention (PCI) with stent placement. The client asks when they can stop taking dual antiplatelet therapy. The nurse's best response is:",
    options: [
      { label: "A", text: "You can stop after 1 week when the stent site heals" },
      { label: "B", text: "You should take aspirin and a P2Y12 inhibitor for at least 6-12 months as prescribed by your cardiologist" },
      { label: "C", text: "You only need aspirin and can stop the other medication tomorrow" },
      { label: "D", text: "You will need anticoagulation with warfarin instead" }
    ],
    correctAnswer: ["B"],
    rationale: "After coronary stent placement, dual antiplatelet therapy (DAPT) with aspirin and a P2Y12 inhibitor (clopidogrel, prasugrel, or ticagrelor) is required for at least 6-12 months to prevent in-stent thrombosis. Premature discontinuation is the leading cause of stent thrombosis, which can cause myocardial infarction or death.",
    difficulty: 3, tags: ["cardiovascular", "PCI", "stent", "antiplatelet"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "PCI Post-Procedure Care", regionScope: "US", careerType: "nursing",
    clinicalPearl: "After drug-eluting stent: DAPT for minimum 6-12 months, then aspirin indefinitely. Educate: never stop without cardiologist approval, carry medication list, inform all providers of stent.",
    examStrategy: null,
    distractorRationales: { "A": "One week is far too short for DAPT after stenting", "C": "Single antiplatelet therapy is insufficient early after stenting", "D": "Warfarin is not standard post-PCI therapy unless concurrent atrial fibrillation" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is monitoring a client's troponin levels after admission for chest pain. The initial troponin I is 0.02 ng/mL, and the repeat troponin 6 hours later is 2.5 ng/mL. The nurse interprets this as:",
    options: [
      { label: "A", text: "Normal variation, no cause for concern" },
      { label: "B", text: "Consistent with acute myocardial infarction" },
      { label: "C", text: "Indicative of heart failure" },
      { label: "D", text: "A laboratory error requiring repeat testing" }
    ],
    correctAnswer: ["B"],
    rationale: "A significant rise in troponin levels (from 0.02 to 2.5 ng/mL) is the hallmark biomarker pattern for acute myocardial infarction. Troponin is released from damaged myocardial cells. A rise and fall pattern with at least one value above the 99th percentile of a normal reference population, combined with clinical evidence of ischemia, confirms MI.",
    difficulty: 3, tags: ["cardiovascular", "troponin", "MI-diagnosis"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Cardiac Biomarkers", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Troponin rises 3-6 hours after MI, peaks at 12-24 hours, and can remain elevated for 7-14 days. Serial troponins (0, 3, and 6 hours) are the gold standard for MI diagnosis.",
    examStrategy: null,
    distractorRationales: { "A": "A 100-fold increase is not normal variation", "C": "While troponin can elevate in HF, this rise-and-fall pattern suggests MI", "D": "The pattern is consistent with acute MI, not lab error" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a temporary pacemaker set at a rate of 72 bpm. The monitor shows pacemaker spikes without associated QRS complexes. The nurse identifies this as:",
    options: [
      { label: "A", text: "Normal pacemaker function" },
      { label: "B", text: "Failure to capture" },
      { label: "C", text: "Failure to sense" },
      { label: "D", text: "Oversensing" }
    ],
    correctAnswer: ["B"],
    rationale: "Failure to capture occurs when the pacemaker delivers an electrical stimulus (spike visible) but fails to depolarize the myocardium (no QRS complex follows). Causes include lead displacement, low battery, or increased capture threshold. The nurse should increase the milliampere output, check lead connections, and notify the provider.",
    difficulty: 4, tags: ["cardiovascular", "pacemaker", "malfunction"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Pacemaker Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Pacemaker malfunctions: Failure to fire (no spikes), Failure to capture (spikes without QRS), Failure to sense (pacing despite native rhythm), Oversensing (pacing inhibited by artifact).",
    examStrategy: "Spike + no QRS = failure to capture. No spike when expected = failure to fire. Spike too close to native beat = failure to sense.",
    distractorRationales: { "A": "Normal function shows spikes followed by QRS complexes", "C": "Failure to sense shows pacing spikes despite native heartbeats", "D": "Oversensing shows absence of pacing when needed" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with heart failure is prescribed carvedilol. Before initiating the medication, which assessment is most important?",
    options: [
      { label: "A", text: "Serum cholesterol level" },
      { label: "B", text: "Heart rate and blood pressure" },
      { label: "C", text: "Serum albumin level" },
      { label: "D", text: "Capillary blood glucose" }
    ],
    correctAnswer: ["B"],
    rationale: "Carvedilol is a beta-blocker used in heart failure management. Before initiating, the nurse must assess heart rate and blood pressure because beta-blockers can cause bradycardia and hypotension. The medication should not be started if the heart rate is below 60 bpm or if the client is hypotensive or in acute decompensated heart failure.",
    difficulty: 2, tags: ["cardiovascular", "heart-failure", "beta-blockers"], bodySystem: "Cardiovascular",
    topic: "Cardiovascular", subtopic: "Heart Failure Medications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Beta-blockers in HF: start low, go slow. Never start during acute decompensation. Monitor for worsening HF symptoms during initiation.",
    examStrategy: null,
    distractorRationales: { "A": "Cholesterol is not the priority assessment for beta-blockers", "C": "Albumin is not directly related to carvedilol", "D": "While carvedilol can mask hypoglycemia, HR and BP are the priority" }
  },

  // === RESPIRATORY (6 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with acute respiratory distress syndrome (ARDS). The client is mechanically ventilated with PEEP of 10 cmH2O. Which finding indicates a complication of PEEP therapy?",
    options: [
      { label: "A", text: "Improved oxygen saturation from 88% to 95%" },
      { label: "B", text: "Decreased cardiac output and hypotension" },
      { label: "C", text: "Decreased work of breathing" },
      { label: "D", text: "Improved lung compliance" }
    ],
    correctAnswer: ["B"],
    rationale: "PEEP maintains positive pressure in the alveoli to prevent collapse and improve oxygenation. However, excessive PEEP can decrease venous return to the heart by increasing intrathoracic pressure, leading to decreased cardiac output and hypotension. Other complications include barotrauma (pneumothorax) and decreased renal perfusion.",
    difficulty: 4, tags: ["respiratory", "ARDS", "PEEP", "ventilator"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "ARDS Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "PEEP improves oxygenation but can decrease cardiac output. Monitor hemodynamics closely. ARDS ventilation strategy: low tidal volumes (6 mL/kg ideal body weight), PEEP to maintain SpO2 >88%.",
    examStrategy: "PEEP complications: decreased cardiac output, barotrauma, decreased urine output. Benefits: improved oxygenation, alveolar recruitment.",
    distractorRationales: { "A": "Improved SpO2 is the expected therapeutic effect", "C": "Decreased work of breathing is a benefit", "D": "Improved compliance is a positive outcome" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client who had a pulmonary embolism. Which set of findings is most consistent with this diagnosis?",
    options: [
      { label: "A", text: "Sudden onset dyspnea, tachycardia, pleuritic chest pain, and anxiety" },
      { label: "B", text: "Gradual onset cough, low-grade fever, and purulent sputum" },
      { label: "C", text: "Orthopnea, peripheral edema, and weight gain" },
      { label: "D", text: "Barrel chest, prolonged expiration, and wheezing" }
    ],
    correctAnswer: ["A"],
    rationale: "Pulmonary embolism classically presents with sudden onset dyspnea, tachycardia, tachypnea, pleuritic chest pain (worsens with inspiration), and anxiety/sense of impending doom. Hemoptysis may also occur. The sudden onset distinguishes PE from other respiratory conditions. Risk factors include immobility, surgery, DVT, and oral contraceptive use.",
    difficulty: 2, tags: ["respiratory", "pulmonary-embolism", "assessment"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Pulmonary Embolism", regionScope: "US", careerType: "nursing",
    clinicalPearl: "PE diagnostic workup: D-dimer (screening), CT pulmonary angiography (gold standard). Treatment: anticoagulation (heparin then warfarin/DOAC). Massive PE may need thrombolytics or embolectomy.",
    examStrategy: "Sudden onset respiratory distress + risk factors (DVT, immobility, surgery) = think PE.",
    distractorRationales: { "B": "Gradual onset with purulent sputum suggests pneumonia", "C": "Orthopnea and edema suggest heart failure", "D": "Barrel chest and wheezing suggest COPD" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with a tracheostomy has copious thick secretions. The nurse should perform suctioning using which technique?",
    options: [
      { label: "A", text: "Apply suction while inserting the catheter" },
      { label: "B", text: "Insert the catheter without suction and apply intermittent suction while withdrawing" },
      { label: "C", text: "Suction for 30 seconds continuously" },
      { label: "D", text: "Use a clean technique with tap water irrigation" }
    ],
    correctAnswer: ["B"],
    rationale: "Correct tracheostomy suctioning technique: preoxygenate with 100% O2, insert the catheter without suction to the appropriate depth, then apply intermittent suction while rotating and withdrawing the catheter. Suction for no more than 10-15 seconds per pass. Use sterile technique. Allow the client to rest between passes.",
    difficulty: 2, tags: ["respiratory", "tracheostomy", "suctioning"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Tracheostomy Care", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Suctioning rules: max 10-15 seconds per pass, preoxygenate with 100% O2, sterile technique, no more than 3 passes, monitor SpO2 and heart rhythm during procedure.",
    examStrategy: null,
    distractorRationales: { "A": "Suctioning during insertion damages mucosa", "C": "30 seconds causes hypoxemia and mucosal damage", "D": "Sterile technique is required for tracheal suctioning" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a tension pneumothorax. Which clinical finding would the nurse expect?",
    options: [
      { label: "A", text: "Bilateral equal breath sounds and normal vital signs" },
      { label: "B", text: "Tracheal deviation away from the affected side, jugular vein distention, and hypotension" },
      { label: "C", text: "Tracheal deviation toward the affected side with bradycardia" },
      { label: "D", text: "Bilateral crackles with pink frothy sputum" }
    ],
    correctAnswer: ["B"],
    rationale: "Tension pneumothorax is a life-threatening emergency where air accumulates in the pleural space under pressure, causing mediastinal shift. Classic signs include: tracheal deviation away from the affected side, JVD (from impaired venous return), hypotension, tachycardia, absent breath sounds on the affected side, and cyanosis. Treatment is immediate needle decompression followed by chest tube insertion.",
    difficulty: 3, tags: ["respiratory", "tension-pneumothorax", "emergency"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Tension Pneumothorax", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Tension pneumothorax is a clinical diagnosis—do NOT wait for X-ray. Immediate needle decompression at the 2nd intercostal space, midclavicular line on the affected side.",
    examStrategy: "Tracheal deviation AWAY + JVD + hypotension + absent breath sounds = tension pneumothorax. This is a clinical diagnosis requiring immediate intervention.",
    distractorRationales: { "A": "Equal breath sounds would rule out pneumothorax", "C": "Tracheal deviation is AWAY from the affected side", "D": "Bilateral crackles with frothy sputum suggests pulmonary edema" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is receiving oxygen therapy via a non-rebreather mask at 15 L/min. The nurse understands that this device delivers approximately what FiO2?",
    options: [
      { label: "A", text: "24-28%" },
      { label: "B", text: "40-60%" },
      { label: "C", text: "80-95%" },
      { label: "D", text: "100%" }
    ],
    correctAnswer: ["C"],
    rationale: "A non-rebreather mask at 15 L/min delivers approximately 80-95% FiO2. It has a reservoir bag that must remain inflated during use and one-way valves that prevent room air from being inhaled and exhaled air from entering the reservoir. It provides the highest FiO2 of any standard oxygen delivery device without intubation.",
    difficulty: 3, tags: ["respiratory", "oxygen-therapy", "non-rebreather"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Oxygen Delivery Devices", regionScope: "US", careerType: "nursing",
    clinicalPearl: "O2 delivery devices: NC 1-6 L (24-44%), simple mask 5-8 L (40-60%), partial rebreather 6-10 L (60-80%), non-rebreather 10-15 L (80-95%), Venturi mask (precise FiO2).",
    examStrategy: null,
    distractorRationales: { "A": "24-28% is delivered by low-flow nasal cannula at 1-2 L/min", "B": "40-60% is delivered by a simple face mask", "D": "100% requires a closed system like mechanical ventilation" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is performing a respiratory assessment on a client with suspected left lower lobe pneumonia. Over which area of the chest would the nurse expect to hear bronchial breath sounds?",
    options: [
      { label: "A", text: "Over the anterior chest near the clavicles" },
      { label: "B", text: "Over the lower left posterior lung field" },
      { label: "C", text: "Over the trachea only" },
      { label: "D", text: "Over the right middle lobe" }
    ],
    correctAnswer: ["B"],
    rationale: "In pneumonia, consolidation of lung tissue causes transmission of bronchial (tubular) breath sounds to the peripheral lung fields where vesicular sounds are normally heard. Therefore, bronchial breath sounds heard over the lower left posterior lung field indicate consolidation in the left lower lobe—an abnormal finding that supports the diagnosis of pneumonia.",
    difficulty: 4, tags: ["respiratory", "pneumonia", "lung-sounds"], bodySystem: "Respiratory",
    topic: "Respiratory", subtopic: "Respiratory Assessment", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Normal: vesicular sounds over peripheral lung fields, bronchial sounds over trachea. Abnormal: bronchial sounds in peripheral fields = consolidation (pneumonia, atelectasis).",
    examStrategy: null,
    distractorRationales: { "A": "This is not the area of the left lower lobe", "C": "Bronchial sounds over the trachea are normal", "D": "The right middle lobe is not the suspected area" }
  },

  // === NEUROLOGICAL (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a C5 spinal cord injury. The client suddenly develops a severe headache, blood pressure of 260/130 mmHg, bradycardia, flushing above the level of injury, and nasal congestion. The nurse recognizes this as:",
    options: [
      { label: "A", text: "Neurogenic shock" },
      { label: "B", text: "Autonomic dysreflexia" },
      { label: "C", text: "Spinal shock" },
      { label: "D", text: "Hypertensive emergency" }
    ],
    correctAnswer: ["B"],
    rationale: "Autonomic dysreflexia is a life-threatening emergency that occurs in clients with spinal cord injuries at T6 or above. It is triggered by a noxious stimulus below the level of injury (most commonly a distended bladder or bowel). The uninhibited sympathetic response causes severe hypertension, bradycardia, pounding headache, flushing and diaphoresis above the injury, and pallor below.",
    difficulty: 3, tags: ["neurological", "spinal-cord-injury", "autonomic-dysreflexia"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Spinal Cord Injury Complications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Autonomic dysreflexia treatment: 1) Sit the client upright (lowers BP), 2) Identify and remove the trigger (check catheter first—most common cause is urinary retention), 3) Monitor BP every 5 min, 4) Administer antihypertensive if ordered.",
    examStrategy: "SCI at T6 or above + severe HTN + headache + bradycardia = autonomic dysreflexia. The trigger is almost always below the injury level.",
    distractorRationales: { "A": "Neurogenic shock causes hypotension and bradycardia, not severe hypertension", "C": "Spinal shock is loss of all reflexes below injury level, not hypertensive crisis", "D": "While BP is dangerously high, the SCI context makes this autonomic dysreflexia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client admitted with a traumatic brain injury. The client exhibits decorticate posturing. Which description accurately represents this finding?",
    options: [
      { label: "A", text: "Arms extended, internally rotated, with legs extended (all extremities rigid)" },
      { label: "B", text: "Arms flexed on the chest with wrists flexed, legs extended and internally rotated" },
      { label: "C", text: "Flaccid paralysis of all extremities" },
      { label: "D", text: "Alternating flexion and extension of extremities" }
    ],
    correctAnswer: ["B"],
    rationale: "Decorticate posturing involves flexion of the upper extremities (arms flexed on chest, wrists flexed, fists clenched) with extension and internal rotation of the lower extremities. It indicates damage to the cerebral cortex. Decerebrate posturing (extension of all extremities) indicates more severe brainstem damage and carries a worse prognosis.",
    difficulty: 3, tags: ["neurological", "TBI", "posturing"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Traumatic Brain Injury", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Mnemonic: 'COR' = flexion toward the CORe (decorticate). 'DE' = arms Down and Extended (decerebrate). Decorticate = cortex damage. Decerebrate = brainstem damage (worse prognosis).",
    examStrategy: null,
    distractorRationales: { "A": "This describes decerebrate posturing", "C": "Flaccidity indicates complete loss of motor function", "D": "Alternating posturing is not a standard classification" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with myasthenia gravis who is receiving pyridostigmine. The client develops increased weakness, excessive salivation, and abdominal cramping. The nurse suspects:",
    options: [
      { label: "A", text: "Myasthenic crisis" },
      { label: "B", text: "Cholinergic crisis" },
      { label: "C", text: "Thyroid storm" },
      { label: "D", text: "Addisonian crisis" }
    ],
    correctAnswer: ["B"],
    rationale: "Cholinergic crisis is caused by excessive acetylcholinesterase inhibitor medication (overdose of pyridostigmine). Symptoms include increased weakness, excessive secretions (salivation, lacrimation), miosis, bradycardia, and abdominal cramping. This is differentiated from myasthenic crisis (undermedication) by administering edrophonium (Tensilon test)—if symptoms worsen, it's cholinergic crisis.",
    difficulty: 4, tags: ["neurological", "myasthenia-gravis", "cholinergic-crisis"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Myasthenia Gravis", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Cholinergic crisis (too much medication): SLUDGE—Salivation, Lacrimation, Urination, Defecation, GI cramping, Emesis. Myasthenic crisis (too little medication): weakness without excessive secretions.",
    examStrategy: "Weakness + excessive secretions = cholinergic crisis (too much med). Weakness without secretions = myasthenic crisis (too little med).",
    distractorRationales: { "A": "Myasthenic crisis has weakness but without excessive secretions", "C": "Thyroid storm presents with hyperthermia, tachycardia, and agitation", "D": "Addisonian crisis presents with hypotension, hyponatremia, and hyperkalemia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with Parkinson's disease who is taking carbidopa-levodopa. The nurse understands that this medication works by:",
    options: [
      { label: "A", text: "Blocking acetylcholine receptors in the basal ganglia" },
      { label: "B", text: "Replacing dopamine in the brain by crossing the blood-brain barrier" },
      { label: "C", text: "Stimulating serotonin production in the frontal cortex" },
      { label: "D", text: "Inhibiting GABA reuptake in the cerebellum" }
    ],
    correctAnswer: ["B"],
    rationale: "Parkinson's disease is caused by depletion of dopamine in the substantia nigra. Levodopa crosses the blood-brain barrier and is converted to dopamine. Carbidopa prevents the peripheral conversion of levodopa to dopamine (preventing nausea and other peripheral side effects), allowing more levodopa to reach the brain.",
    difficulty: 3, tags: ["neurological", "parkinsons", "dopamine"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Parkinson's Disease", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Avoid high-protein meals with levodopa (protein competes for absorption). 'On-off' phenomenon occurs with long-term use. Never abruptly stop—risk of neuroleptic malignant-like syndrome.",
    examStrategy: null,
    distractorRationales: { "A": "Anticholinergics block acetylcholine but are adjunct therapy", "C": "Serotonin is not the target in Parkinson's", "D": "GABA is not the primary neurotransmitter involved" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is performing a neurological assessment on a client and tests cranial nerve V (trigeminal). Which assessment technique is appropriate?",
    options: [
      { label: "A", text: "Ask the client to shrug their shoulders against resistance" },
      { label: "B", text: "Test facial sensation by touching the forehead, cheek, and jaw; assess jaw clench strength" },
      { label: "C", text: "Ask the client to protrude their tongue" },
      { label: "D", text: "Test visual acuity using a Snellen chart" }
    ],
    correctAnswer: ["B"],
    rationale: "Cranial nerve V (trigeminal) has three branches: ophthalmic (V1 - forehead), maxillary (V2 - cheek), and mandibular (V3 - jaw). It provides facial sensation (sensory) and controls muscles of mastication (motor). Testing involves touching each area for sensation and asking the client to clench their jaw to assess motor function.",
    difficulty: 3, tags: ["neurological", "cranial-nerves", "assessment"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Cranial Nerve Assessment", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Mnemonic for cranial nerves: 'Oh, Oh, Oh, To Touch And Feel Very Good Velvet, AH.' (Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Accessory, Hypoglossal).",
    examStrategy: null,
    distractorRationales: { "A": "Shoulder shrug tests CN XI (accessory)", "C": "Tongue protrusion tests CN XII (hypoglossal)", "D": "Visual acuity tests CN II (optic)" }
  },

  // === MENTAL HEALTH (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse in a psychiatric unit is caring for a client who is exhibiting escalating agitation. The client is pacing, clenching fists, and using a loud voice. Using the least restrictive intervention approach, the nurse should first:",
    options: [
      { label: "A", text: "Apply physical restraints for the client's safety" },
      { label: "B", text: "Administer a PRN intramuscular sedative immediately" },
      { label: "C", text: "Approach calmly, use a low voice, and offer the client choices to de-escalate" },
      { label: "D", text: "Call security to escort the client to a seclusion room" }
    ],
    correctAnswer: ["C"],
    rationale: "The least restrictive intervention principle requires nurses to use the least invasive approach first. Verbal de-escalation techniques include maintaining a calm, non-threatening posture, speaking in a low voice, offering choices, setting clear limits, and acknowledging the client's feelings. Restraints and seclusion are last resorts when other methods have failed.",
    difficulty: 2, tags: ["mental-health", "de-escalation", "safety"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Crisis Intervention", regionScope: "US", careerType: "nursing",
    clinicalPearl: "De-escalation hierarchy: verbal intervention → offer medication voluntarily → show of support (team response) → physical intervention → restraint/seclusion. Always try least restrictive first.",
    examStrategy: "Always choose the least restrictive intervention first: verbal de-escalation → voluntary medication → seclusion → restraints (last resort).",
    distractorRationales: { "A": "Restraints are a last resort, not first intervention", "B": "Forced medication is more restrictive than verbal de-escalation", "D": "Seclusion is used only after less restrictive measures fail" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with anorexia nervosa who has been admitted with a BMI of 14. The client is started on refeeding. Which complication should the nurse monitor for most closely?",
    options: [
      { label: "A", text: "Hyperkalemia and hyperphosphatemia" },
      { label: "B", text: "Refeeding syndrome with hypophosphatemia and cardiac dysrhythmias" },
      { label: "C", text: "Rapid weight gain of 5 lbs per day" },
      { label: "D", text: "Hyperglycemia requiring insulin therapy" }
    ],
    correctAnswer: ["B"],
    rationale: "Refeeding syndrome is a potentially fatal complication that occurs when nutrition is reintroduced too quickly in severely malnourished individuals. It causes a shift of phosphorus, potassium, and magnesium from extracellular to intracellular spaces as glucose metabolism restarts, leading to severe electrolyte imbalances, cardiac dysrhythmias, and potentially death.",
    difficulty: 4, tags: ["mental-health", "anorexia", "refeeding-syndrome"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Eating Disorders", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Refeeding syndrome prevention: start low, advance slowly. Monitor phosphorus, potassium, magnesium daily. Supplement thiamine before refeeding. Watch for heart failure, respiratory failure, and cardiac arrest.",
    examStrategy: "Severely malnourished + starting nutrition = monitor for refeeding syndrome (hypophosphatemia is the hallmark).",
    distractorRationales: { "A": "Refeeding causes hypokalemia and hypophosphatemia, not hyper-", "C": "Refeeding is done slowly; rapid weight gain is not expected", "D": "While glucose shifts occur, hypoglycemia is more common than persistent hyperglycemia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with PTSD is experiencing a flashback and appears to be reliving a traumatic event. Which nursing intervention is most appropriate?",
    options: [
      { label: "A", text: "Touch the client to provide reassurance" },
      { label: "B", text: "Use grounding techniques and orient the client to the present environment" },
      { label: "C", text: "Ask the client to describe the traumatic event in detail" },
      { label: "D", text: "Leave the client alone until the flashback passes" }
    ],
    correctAnswer: ["B"],
    rationale: "During a PTSD flashback, grounding techniques help orient the client to the present reality. These include asking the client to identify objects in the room, describe textures they can feel, or focus on current sensory input (5-4-3-2-1 technique). Touching may be perceived as threatening, detailed recounting can worsen distress, and leaving the client alone provides no support.",
    difficulty: 3, tags: ["mental-health", "PTSD", "grounding-techniques"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "PTSD Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "5-4-3-2-1 grounding technique: identify 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste. Always approach calmly, use the client's name, and state who you are.",
    examStrategy: "Flashback intervention: ground the client in the present. Avoid touching or asking to relive the event.",
    distractorRationales: { "A": "Touch may trigger a defensive response during a flashback", "C": "Reliving the event can worsen the flashback", "D": "The client needs support and grounding, not isolation" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who is involuntarily committed to a psychiatric unit. The client refuses medication. Under which circumstance can the medication be administered?",
    options: [
      { label: "A", text: "Whenever the nurse determines it is in the client's best interest" },
      { label: "B", text: "Only when the client poses an imminent danger to self or others, as determined by a provider" },
      { label: "C", text: "Whenever the family requests it" },
      { label: "D", text: "Only during nighttime hours for better compliance" }
    ],
    correctAnswer: ["B"],
    rationale: "Involuntary commitment does not remove a client's right to refuse medication in most US states. Medications can only be administered over a client's objection when there is an imminent danger to the client or others (emergency exception) or when a court order authorizes treatment. A provider must determine the emergency exists.",
    difficulty: 3, tags: ["mental-health", "patient-rights", "involuntary-treatment"], bodySystem: "Mental Health",
    topic: "Mental Health", subtopic: "Patient Rights", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Involuntary commitment ≠ loss of all rights. Patients retain the right to refuse treatment except in emergencies. Court orders may be needed for ongoing involuntary medication.",
    examStrategy: null,
    distractorRationales: { "A": "Nurses cannot override patient rights based on their judgment alone", "C": "Family cannot authorize forced medication for a competent adult", "D": "Timing does not change the legality of forced medication" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client for signs of serotonin syndrome. Which cluster of symptoms would the nurse expect?",
    options: [
      { label: "A", text: "Hypothermia, bradycardia, and constipation" },
      { label: "B", text: "Hyperthermia, agitation, clonus, and diaphoresis" },
      { label: "C", text: "Weight gain, sedation, and dry mouth" },
      { label: "D", text: "Flat affect, cogwheel rigidity, and tardive dyskinesia" }
    ],
    correctAnswer: ["B"],
    rationale: "Serotonin syndrome results from excessive serotonergic activity, often from drug interactions (e.g., SSRIs with MAOIs or tramadol). Key features include the triad of altered mental status (agitation, confusion), autonomic dysfunction (hyperthermia, diaphoresis, tachycardia), and neuromuscular abnormalities (clonus, hyperreflexia, tremor, muscle rigidity).",
    difficulty: 3, tags: ["mental-health", "serotonin-syndrome", "drug-interaction"], bodySystem: "Neurological",
    topic: "Mental Health", subtopic: "Medication Adverse Effects", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Serotonin syndrome vs NMS: Both have hyperthermia and altered mental status. Serotonin syndrome has clonus/hyperreflexia and rapid onset. NMS has lead-pipe rigidity and gradual onset.",
    examStrategy: "Serotonin syndrome = agitation + hyperthermia + clonus/hyperreflexia. Onset is rapid (within 24 hours of drug change).",
    distractorRationales: { "A": "These are opposite of serotonin syndrome findings", "C": "These are common side effects of antipsychotics, not serotonin syndrome", "D": "These are extrapyramidal symptoms from antipsychotics" }
  },

  // === PEDIATRICS (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a 4-year-old child who has been diagnosed with nephrotic syndrome. Which assessment finding does the nurse expect?",
    options: [
      { label: "A", text: "Hematuria and hypertension" },
      { label: "B", text: "Periorbital edema, proteinuria, and hypoalbuminemia" },
      { label: "C", text: "Polyuria and weight loss" },
      { label: "D", text: "Decreased urine specific gravity and hyperproteinemia" }
    ],
    correctAnswer: ["B"],
    rationale: "Nephrotic syndrome is characterized by massive proteinuria (protein loss in urine), hypoalbuminemia (low serum albumin from urinary protein loss), generalized edema (especially periorbital edema upon waking), hyperlipidemia, and lipiduria. The edema is caused by decreased oncotic pressure from protein loss.",
    difficulty: 3, tags: ["pediatrics", "nephrotic-syndrome", "renal"], bodySystem: "Renal",
    topic: "Pediatrics", subtopic: "Nephrotic Syndrome", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Nephrotic syndrome hallmarks: massive proteinuria, hypoalbuminemia, edema, hyperlipidemia. Monitor weight daily, I&O, abdominal girth. Restrict sodium, not fluids. Watch for peritonitis.",
    examStrategy: "Nephrotic = protein loss → edema. Nephritic (glomerulonephritis) = hematuria → hypertension.",
    distractorRationales: { "A": "Hematuria and hypertension are more characteristic of nephritic syndrome", "C": "Oliguria (not polyuria) and weight gain (not loss) occur in nephrotic syndrome", "D": "Urine specific gravity is increased, and serum protein is decreased" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a 3-month-old infant and notes bulging fontanelles, a high-pitched cry, and poor feeding. These findings are most suggestive of:",
    options: [
      { label: "A", text: "Dehydration" },
      { label: "B", text: "Increased intracranial pressure" },
      { label: "C", text: "Normal developmental findings" },
      { label: "D", text: "Colic" }
    ],
    correctAnswer: ["B"],
    rationale: "Bulging fontanelles in an infant are a cardinal sign of increased intracranial pressure (ICP). Combined with a high-pitched cry (cerebral irritation) and poor feeding, these findings suggest elevated ICP, which can be caused by meningitis, hydrocephalus, or intracranial hemorrhage. Normal fontanelles are flat and soft. Sunken fontanelles indicate dehydration.",
    difficulty: 2, tags: ["pediatrics", "increased-ICP", "infant-assessment"], bodySystem: "Neurological",
    topic: "Pediatrics", subtopic: "Increased ICP in Infants", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Infant ICP signs differ from adults: bulging fontanelle, high-pitched cry, setting-sun eyes, widening head circumference, irritability, poor feeding. Adults: headache, vomiting, altered LOC.",
    examStrategy: "Bulging fontanelle + high-pitched cry = increased ICP in infants. Sunken fontanelle = dehydration.",
    distractorRationales: { "A": "Dehydration causes sunken, not bulging fontanelles", "C": "These are abnormal findings requiring immediate evaluation", "D": "Colic does not cause bulging fontanelles" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching parents about car seat safety for their 14-month-old toddler who weighs 22 lbs. According to the American Academy of Pediatrics (AAP), which recommendation is correct?",
    options: [
      { label: "A", text: "The child should ride in a forward-facing car seat" },
      { label: "B", text: "The child should remain in a rear-facing car seat" },
      { label: "C", text: "The child can use a booster seat with the vehicle seat belt" },
      { label: "D", text: "The child can sit in the front seat with an airbag" }
    ],
    correctAnswer: ["B"],
    rationale: "The AAP recommends that children ride rear-facing for as long as possible, ideally until they reach the maximum height or weight limit of their rear-facing car seat (typically 40 lbs). At 14 months and 22 lbs, the child should remain rear-facing. This position provides the best protection for the child's head, neck, and spine in a crash.",
    difficulty: 2, tags: ["pediatrics", "safety", "car-seat"], bodySystem: "Professional Practice",
    topic: "Pediatrics", subtopic: "Child Safety", regionScope: "US", careerType: "nursing",
    clinicalPearl: "AAP car seat progression: rear-facing as long as possible → forward-facing with harness (once outgrown rear-facing limits) → booster seat (once outgrown harness) → seat belt (typically 4'9\" tall).",
    examStrategy: null,
    distractorRationales: { "A": "AAP recommends rear-facing until the car seat weight/height limit is reached", "C": "Booster seats are for older, larger children", "D": "Children under 13 should never sit in the front seat with an active airbag" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a child admitted with suspected intussusception. Which clinical presentation is most characteristic?",
    options: [
      { label: "A", text: "Painless, profuse watery diarrhea" },
      { label: "B", text: "Sudden episodic abdominal pain with 'currant jelly' stools and a sausage-shaped abdominal mass" },
      { label: "C", text: "Projectile vomiting after feeding with a palpable olive-shaped mass" },
      { label: "D", text: "Chronic constipation with ribbon-like stools" }
    ],
    correctAnswer: ["B"],
    rationale: "Intussusception occurs when one segment of the bowel telescopes into an adjacent segment. Classic findings include sudden, severe, episodic (colicky) abdominal pain causing the child to draw up the knees, 'currant jelly' stools (blood and mucus), and a palpable sausage-shaped mass in the right upper quadrant. Treatment is air or barium enema reduction.",
    difficulty: 3, tags: ["pediatrics", "intussusception", "GI-emergency"], bodySystem: "Gastrointestinal",
    topic: "Pediatrics", subtopic: "Intussusception", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Intussusception = currant jelly stools + colicky pain + sausage-shaped mass. Pyloric stenosis = projectile vomiting + olive-shaped mass + hungry infant. Hirschsprung = ribbon-like stools + chronic constipation.",
    examStrategy: "Match the GI condition to its classic finding: currant jelly = intussusception, olive mass = pyloric stenosis, ribbon stools = Hirschsprung.",
    distractorRationales: { "A": "Profuse watery diarrhea suggests gastroenteritis", "C": "Projectile vomiting with olive-shaped mass is pyloric stenosis", "D": "Chronic constipation with ribbon-like stools suggests Hirschsprung disease" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a 5-year-old child with a new diagnosis of type 1 diabetes. The child's blood glucose is 45 mg/dL. The child is conscious but lethargic. What is the nurse's priority action?",
    options: [
      { label: "A", text: "Administer glucagon intramuscularly" },
      { label: "B", text: "Give 4 oz of orange juice or glucose tablets" },
      { label: "C", text: "Start an IV dextrose infusion" },
      { label: "D", text: "Withhold the next insulin dose and recheck in 1 hour" }
    ],
    correctAnswer: ["B"],
    rationale: "For a conscious child with hypoglycemia (blood glucose <70 mg/dL), the priority is to administer a fast-acting oral carbohydrate such as 4 oz of juice or glucose tablets (15-15 rule: 15 grams of carbohydrate, recheck in 15 minutes). Glucagon is reserved for unconscious patients. IV dextrose is used when oral intake is not possible.",
    difficulty: 2, tags: ["pediatrics", "diabetes", "hypoglycemia"], bodySystem: "Endocrine",
    topic: "Pediatrics", subtopic: "Type 1 Diabetes Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Rule of 15: Give 15g fast-acting carb → recheck in 15 min → repeat if still <70 mg/dL → once stable, give a protein snack to sustain glucose. Glucagon IM if unconscious.",
    examStrategy: "Hypoglycemia + conscious = oral glucose. Hypoglycemia + unconscious = glucagon IM or IV dextrose.",
    distractorRationales: { "A": "Glucagon is for unconscious patients who cannot take oral carbs", "C": "IV dextrose is used when oral intake is not possible", "D": "Active hypoglycemia requires immediate treatment" }
  },

  // === MATERNITY (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client at 38 weeks gestation who presents with sudden severe abdominal pain, a rigid board-like abdomen, and dark vaginal bleeding. The fetal heart rate shows late decelerations. The nurse suspects:",
    options: [
      { label: "A", text: "Placenta previa" },
      { label: "B", text: "Placental abruption" },
      { label: "C", text: "Preterm labor" },
      { label: "D", text: "Braxton Hicks contractions" }
    ],
    correctAnswer: ["B"],
    rationale: "Placental abruption presents with sudden, severe abdominal pain, a rigid/board-like uterus, dark vaginal bleeding (or concealed hemorrhage), and signs of fetal distress (late decelerations). It is a life-threatening emergency requiring immediate delivery. Risk factors include hypertension, cocaine use, trauma, and advanced maternal age.",
    difficulty: 2, tags: ["maternity", "placental-abruption", "obstetric-emergency"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Placental Abruption", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Abruption: painful + dark blood + rigid uterus + fetal distress. Previa: painless + bright blood + soft uterus. Abruption can be concealed (no visible bleeding but uterus is rigid and enlarging).",
    examStrategy: null,
    distractorRationales: { "A": "Previa presents with painless, bright red bleeding", "C": "Preterm labor presents with regular contractions, not board-like rigidity", "D": "Braxton Hicks are mild, irregular, and painless" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a laboring client whose amniotic membranes have ruptured. The nurse notes the presence of a loop of umbilical cord protruding from the vagina. What is the nurse's immediate action?",
    options: [
      { label: "A", text: "Push the cord back into the vagina" },
      { label: "B", text: "Apply manual pressure to elevate the presenting part off the cord, position the client in Trendelenburg or knee-chest position, and call for emergency cesarean delivery" },
      { label: "C", text: "Have the client begin pushing immediately" },
      { label: "D", text: "Apply oxygen by mask and continue to monitor" }
    ],
    correctAnswer: ["B"],
    rationale: "Umbilical cord prolapse is an obstetric emergency. The nurse must immediately use a gloved hand to apply upward pressure on the presenting part to relieve pressure on the cord. The client should be placed in Trendelenburg or knee-chest position to use gravity to lift the presenting part. Emergency cesarean delivery is required. Keep the cord warm and moist with sterile saline.",
    difficulty: 3, tags: ["maternity", "cord-prolapse", "obstetric-emergency"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Cord Prolapse", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Cord prolapse management: hand on presenting part (do NOT remove until surgery), Trendelenburg/knee-chest position, keep cord warm and moist, NO pushing, emergency C-section.",
    examStrategy: null,
    distractorRationales: { "A": "Never push the cord back in", "C": "Pushing would increase pressure on the cord", "D": "Oxygen alone is insufficient; the cord compression must be relieved" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a client 24 hours after cesarean delivery. The client reports increasing pain at the incision site, and the nurse notes redness, warmth, and purulent drainage. The client's temperature is 101.2°F (38.4°C). The nurse should:",
    options: [
      { label: "A", text: "Apply ice packs and continue routine postoperative care" },
      { label: "B", text: "Document the findings and reassess in 24 hours" },
      { label: "C", text: "Obtain wound cultures as ordered and notify the provider about suspected surgical site infection" },
      { label: "D", text: "Remove the surgical staples to release the pressure" }
    ],
    correctAnswer: ["C"],
    rationale: "Redness, warmth, purulent drainage, increasing pain, and fever are signs of a surgical site infection (SSI). The nurse should obtain wound cultures (before antibiotics are started) and notify the provider immediately for antibiotic orders. A fever >100.4°F (38°C) within 24-48 hours post-cesarean with wound changes suggests infection.",
    difficulty: 3, tags: ["maternity", "cesarean", "surgical-infection"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Post-Cesarean Complications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Post-cesarean infection risk factors: prolonged labor, multiple vaginal exams, emergency C-section, obesity, diabetes. Signs: wound erythema, purulent drainage, fever >100.4°F after first 24 hours.",
    examStrategy: null,
    distractorRationales: { "A": "Ice alone does not address infection", "B": "Active infection requires immediate intervention", "D": "Staple removal should only be done by the provider" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a pregnant client at 12 weeks gestation about nutrition during pregnancy. The client asks how much additional folic acid she needs. The nurse's best response is:",
    options: [
      { label: "A", text: "You need 800 mcg of folic acid daily throughout pregnancy" },
      { label: "B", text: "You should take at least 400-800 mcg of folic acid daily, ideally starting before conception, to prevent neural tube defects" },
      { label: "C", text: "Folic acid is only needed in the third trimester" },
      { label: "D", text: "You can get enough folic acid from your diet alone without supplements" }
    ],
    correctAnswer: ["B"],
    rationale: "The CDC recommends 400-800 mcg of folic acid daily for all women of childbearing age, ideally starting at least one month before conception and continuing through the first trimester. Folic acid is essential for neural tube development, which occurs in the first 28 days after conception (often before pregnancy is known).",
    difficulty: 2, tags: ["maternity", "prenatal-nutrition", "folic-acid"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Prenatal Nutrition", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Women with a history of NTD pregnancies need 4 mg (4000 mcg) daily. Neural tube closes by day 28—supplementation before conception is ideal. Food sources: leafy greens, fortified cereals, legumes.",
    examStrategy: null,
    distractorRationales: { "A": "While 800 mcg is within range, the timing information is incomplete", "C": "The critical period is first trimester, not third", "D": "Supplementation is recommended in addition to dietary sources" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with preeclampsia who is receiving magnesium sulfate IV. The nurse assesses deep tendon reflexes at 0/4, a respiratory rate of 10 breaths/min, and urine output of 20 mL in the past hour. The nurse should first:",
    options: [
      { label: "A", text: "Continue the infusion and recheck reflexes in 1 hour" },
      { label: "B", text: "Stop the magnesium sulfate infusion and notify the provider" },
      { label: "C", text: "Increase the infusion rate to improve urine output" },
      { label: "D", text: "Administer calcium chloride immediately" }
    ],
    correctAnswer: ["B"],
    rationale: "Absent deep tendon reflexes (0/4), respiratory depression (RR <12), and decreased urine output (<30 mL/hr) are signs of magnesium sulfate toxicity. The nurse should immediately stop the infusion and notify the provider. Calcium gluconate (not chloride) is the antidote for magnesium toxicity and should be at the bedside.",
    difficulty: 3, tags: ["maternity", "preeclampsia", "magnesium-toxicity"], bodySystem: "Reproductive",
    topic: "Maternity", subtopic: "Magnesium Sulfate Therapy", regionScope: "US", careerType: "nursing",
    clinicalPearl: "MgSO4 toxicity monitoring: DTRs should be 2+, RR >12, UO >30 mL/hr. Therapeutic Mg level: 4-7 mEq/L. Toxic: >7 mEq/L. Antidote: calcium gluconate 10% IV push.",
    examStrategy: "Absent reflexes + respiratory depression + decreased UO = magnesium toxicity. Stop the infusion first, then notify.",
    distractorRationales: { "A": "Continuing the infusion would worsen toxicity", "C": "Increasing the rate would worsen all symptoms", "D": "Calcium gluconate (not chloride) is the antidote, and the infusion must be stopped first" }
  },

  // === CRITICAL CARE (5 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client in the ICU who develops cardiogenic shock after an anterior wall MI. The nurse anticipates the hemodynamic findings will include:",
    options: [
      { label: "A", text: "Decreased CVP, decreased PAWP, increased cardiac output" },
      { label: "B", text: "Increased CVP, increased PAWP, decreased cardiac output" },
      { label: "C", text: "Normal CVP, normal PAWP, normal cardiac output" },
      { label: "D", text: "Decreased CVP, increased PAWP, normal cardiac output" }
    ],
    correctAnswer: ["B"],
    rationale: "In cardiogenic shock, the heart fails as a pump. Blood backs up behind the failing ventricle, causing elevated CVP (right heart backup) and elevated PAWP (left heart backup/pulmonary congestion). Cardiac output decreases because the heart cannot pump effectively. SVR increases as the body attempts to compensate through vasoconstriction.",
    difficulty: 4, tags: ["critical-care", "cardiogenic-shock", "hemodynamics"], bodySystem: "Cardiovascular",
    topic: "Critical Care", subtopic: "Cardiogenic Shock", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Shock hemodynamics: Cardiogenic = pump failure (↑CVP, ↑PAWP, ↓CO). Hypovolemic = volume loss (↓CVP, ↓PAWP, ↓CO). Septic/distributive = vasodilation (↓CVP, ↓PAWP, ↑CO early, ↓CO late).",
    examStrategy: "Remember: cardiogenic shock = everything backs up (increased pressures) with decreased output.",
    distractorRationales: { "A": "This pattern describes hypovolemic shock", "C": "Normal values are not consistent with any type of shock", "D": "This mixed pattern is not consistent with cardiogenic shock" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with acute pancreatitis. The client's serum amylase is 450 U/L (normal: 30-110 U/L) and lipase is 800 U/L (normal: 0-160 U/L). Which nursing intervention is the priority?",
    options: [
      { label: "A", text: "Encourage a high-fat diet to stimulate the pancreas" },
      { label: "B", text: "Maintain NPO status, provide IV fluid resuscitation, and manage pain" },
      { label: "C", text: "Administer pancreatic enzymes orally" },
      { label: "D", text: "Position the client supine with legs elevated" }
    ],
    correctAnswer: ["B"],
    rationale: "Acute pancreatitis management focuses on resting the pancreas (NPO status), aggressive IV fluid resuscitation (to prevent hypovolemic shock from third-spacing), and pain management (often with IV opioids—meperidine was traditionally preferred but hydromorphone is now used). A nasogastric tube may be placed for decompression if vomiting is persistent.",
    difficulty: 3, tags: ["critical-care", "pancreatitis", "GI-emergency"], bodySystem: "Gastrointestinal",
    topic: "Critical Care", subtopic: "Acute Pancreatitis", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Pancreatitis pain position: fetal position (knees to chest) or leaning forward. Cullen sign (periumbilical bruising) and Grey Turner sign (flank bruising) indicate hemorrhagic pancreatitis.",
    examStrategy: "Acute pancreatitis = NPO + IV fluids + pain management. Lipase is more specific than amylase for pancreatitis.",
    distractorRationales: { "A": "High-fat diet stimulates the pancreas and worsens inflammation", "C": "Oral enzymes are for chronic pancreatitis, not acute", "D": "Supine positioning worsens pain; side-lying with knees flexed is preferred" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a traumatic brain injury who has an ICP monitor in place. The ICP reading is 28 mmHg. The nurse should anticipate which intervention?",
    options: [
      { label: "A", text: "Lower the head of the bed to flat" },
      { label: "B", text: "Administer IV mannitol as prescribed" },
      { label: "C", text: "Increase the IV fluid rate" },
      { label: "D", text: "Administer a hypotonic IV solution" }
    ],
    correctAnswer: ["B"],
    rationale: "Normal ICP is 0-15 mmHg. An ICP of 28 mmHg is critically elevated and requires immediate intervention. IV mannitol is an osmotic diuretic that draws fluid from the brain tissue into the vascular space, reducing cerebral edema and ICP. The head of bed should be elevated to 30 degrees, and hypertonic (not hypotonic) solutions may be used.",
    difficulty: 4, tags: ["critical-care", "TBI", "increased-ICP"], bodySystem: "Neurological",
    topic: "Critical Care", subtopic: "ICP Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "ICP management: HOB 30°, maintain normothermia, avoid hypercarbia (keep PaCO2 35-40), mannitol or hypertonic saline, avoid hypotension (maintain CPP >60). CPP = MAP - ICP.",
    examStrategy: "Elevated ICP interventions: elevate HOB 30°, mannitol or hypertonic saline, maintain neutral neck, prevent fever, avoid excessive suctioning.",
    distractorRationales: { "A": "Flat positioning increases ICP", "C": "Increased fluids could worsen cerebral edema", "D": "Hypotonic solutions worsen cerebral edema" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a burn client who sustained full-thickness burns over 40% of total body surface area (TBSA). Using the Parkland formula, what is the fluid resuscitation volume for the first 24 hours for a 70 kg client?",
    options: [
      { label: "A", text: "5,600 mL of lactated Ringer's" },
      { label: "B", text: "11,200 mL of lactated Ringer's" },
      { label: "C", text: "8,400 mL of normal saline" },
      { label: "D", text: "2,800 mL of D5W" }
    ],
    correctAnswer: ["B"],
    rationale: "The Parkland formula calculates fluid resuscitation for burn clients: 4 mL × body weight (kg) × %TBSA burned. For this client: 4 × 70 × 40 = 11,200 mL of lactated Ringer's in 24 hours. Half is given in the first 8 hours (from time of injury), and the remaining half over the next 16 hours.",
    difficulty: 4, tags: ["critical-care", "burns", "fluid-resuscitation"], bodySystem: "Integumentary",
    topic: "Critical Care", subtopic: "Burn Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Parkland formula: 4 mL × kg × %TBSA. First half in 8 hours from TIME OF INJURY (not admission). Use lactated Ringer's. Monitor urine output (goal: 0.5-1 mL/kg/hr in adults).",
    examStrategy: "Parkland formula: 4 × weight × %burn = total. Half in first 8 hours, half in next 16 hours. Timing starts from the burn, not from admission.",
    distractorRationales: { "A": "This uses 2 mL instead of 4 mL", "C": "LR is preferred over NS, and the volume is incorrect", "D": "D5W is not used for burn resuscitation, and the volume is incorrect" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with DIC (disseminated intravascular coagulation). Which laboratory findings are consistent with this condition?",
    options: [
      { label: "A", text: "Increased platelet count, decreased D-dimer, and increased fibrinogen" },
      { label: "B", text: "Decreased platelet count, elevated D-dimer, prolonged PT/PTT, and decreased fibrinogen" },
      { label: "C", text: "Normal platelet count, normal PT/PTT, and elevated hemoglobin" },
      { label: "D", text: "Elevated platelet count, decreased PT/PTT, and normal fibrinogen" }
    ],
    correctAnswer: ["B"],
    rationale: "DIC involves simultaneous widespread clotting and bleeding. Clotting factors and platelets are consumed in the abnormal coagulation process, leading to: decreased platelets (thrombocytopenia), elevated D-dimer (fibrin degradation products from clot breakdown), prolonged PT/PTT (depleted clotting factors), and decreased fibrinogen (consumed in clot formation).",
    difficulty: 4, tags: ["critical-care", "DIC", "coagulopathy"], bodySystem: "Hematologic",
    topic: "Critical Care", subtopic: "DIC", regionScope: "US", careerType: "nursing",
    clinicalPearl: "DIC: 'Everything is consumed and depleted.' Low platelets, low fibrinogen, prolonged PT/PTT, high D-dimer. Treatment: address the underlying cause + replacement therapy (FFP, platelets, cryoprecipitate).",
    examStrategy: "DIC labs: everything that should be high is low (platelets, fibrinogen), everything that should be low is high (D-dimer, PT/PTT).",
    distractorRationales: { "A": "DIC causes decreased platelets, elevated D-dimer, and decreased fibrinogen", "C": "Normal values are not consistent with DIC", "D": "These findings are the opposite of DIC" }
  },

  // === DELEGATION & LEADERSHIP (4 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A charge nurse is making assignments for the day shift. The unit has one RN, one LPN, and one certified nursing assistant (CNA). Which client is most appropriate to assign to the LPN?",
    options: [
      { label: "A", text: "A client newly admitted with an acute stroke requiring neurological checks every 15 minutes" },
      { label: "B", text: "A client with a stable tracheostomy who needs routine suctioning and wound care" },
      { label: "C", text: "A client receiving a first-time blood transfusion" },
      { label: "D", text: "A client returning from cardiac catheterization requiring initial post-procedure assessment" }
    ],
    correctAnswer: ["B"],
    rationale: "The LPN is most appropriately assigned to a stable client with predictable care needs. A client with a stable tracheostomy requiring routine suctioning and wound care is within the LPN scope of practice. Acute assessments, first-time blood transfusions, and initial post-procedure assessments require the RN's broader assessment skills and judgment.",
    difficulty: 3, tags: ["delegation", "assignment-making", "LPN-scope"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Assignment Making", regionScope: "US", careerType: "nursing",
    clinicalPearl: "LPN assignment criteria: stable, predictable, not newly diagnosed, not requiring complex assessment. RN retains: admission assessments, blood transfusion initiation, unstable clients, teaching, care planning.",
    examStrategy: "Most stable, most predictable = best LPN assignment. Anything new, first-time, or unstable = RN.",
    distractorRationales: { "A": "Acute stroke with frequent neuro checks requires RN assessment", "C": "First blood transfusion requires RN monitoring for reactions", "D": "Initial post-procedure assessment requires RN" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse has four clients. After morning assessment, which client should the nurse see first?",
    options: [
      { label: "A", text: "A client 1 day post-appendectomy with pain rated 4/10 requesting analgesics" },
      { label: "B", text: "A client with COPD whose SpO2 is 89% on 2 L nasal cannula" },
      { label: "C", text: "A client with diabetes who had a blood glucose of 250 mg/dL before breakfast" },
      { label: "D", text: "A client with pneumonia whose respiratory rate is 28 and SpO2 is 84% on room air" }
    ],
    correctAnswer: ["D"],
    rationale: "The client with pneumonia and an SpO2 of 84% on room air is the priority because this client has acute hypoxemia requiring immediate intervention. A SpO2 of 84% is dangerously low and could lead to respiratory failure. The COPD client's SpO2 of 89% is near their target range (88-92%). The other clients have important but less urgent needs.",
    difficulty: 3, tags: ["delegation", "prioritization", "triage"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Prioritization", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Prioritization frameworks: ABCs (Airway, Breathing, Circulation), Maslow's hierarchy, and acute vs chronic. Acute, unexpected changes take priority over expected findings.",
    examStrategy: "Use ABCs: Airway first, then Breathing, then Circulation. Then prioritize by acuity: unstable > acute changes > stable chronic conditions.",
    distractorRationales: { "A": "Pain of 4/10 is important but not life-threatening", "B": "SpO2 89% is near the COPD target of 88-92%", "C": "BG 250 mg/dL is elevated but not immediately dangerous" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "An RN delegates vital sign measurement to a CNA for a client who is 4 hours post-cardiac catheterization. The CNA reports a blood pressure of 88/52 mmHg. The RN should:",
    options: [
      { label: "A", text: "Thank the CNA and document the vital signs" },
      { label: "B", text: "Ask the CNA to recheck the vital signs in 30 minutes" },
      { label: "C", text: "Personally assess the client immediately and notify the provider" },
      { label: "D", text: "Tell the CNA to elevate the head of the bed" }
    ],
    correctAnswer: ["C"],
    rationale: "A blood pressure of 88/52 mmHg in a post-cardiac catheterization client is concerning for possible bleeding or cardiac complications. The RN must personally assess the client immediately—checking the catheterization site for bleeding, assessing distal pulses, and evaluating for signs of cardiogenic shock or hemorrhage—and notify the provider.",
    difficulty: 2, tags: ["delegation", "supervision", "critical-thinking"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Delegation and Supervision", regionScope: "US", careerType: "nursing",
    clinicalPearl: "When a delegated task reveals abnormal findings, the RN must personally assess and intervene. Delegation does not relieve the RN of accountability for client outcomes.",
    examStrategy: "Abnormal findings from delegated tasks always require RN follow-up assessment. Never re-delegate assessment of abnormal findings.",
    distractorRationales: { "A": "Hypotension post-catheterization requires immediate RN assessment", "B": "Waiting 30 minutes could be dangerous", "D": "The RN must assess first before determining interventions" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse discovers a medication error where a client received 10 units of regular insulin instead of the prescribed 10 units of NPH insulin. What is the nurse's priority action?",
    options: [
      { label: "A", text: "File an incident report and notify the nurse manager" },
      { label: "B", text: "Assess the client for hypoglycemia and monitor blood glucose frequently" },
      { label: "C", text: "Document the error in the client's progress notes" },
      { label: "D", text: "Notify the pharmacy to prevent future errors" }
    ],
    correctAnswer: ["B"],
    rationale: "The priority action after any medication error is to assess the client for potential harm. Regular insulin has a faster onset (15-30 minutes) and shorter peak than NPH insulin, putting the client at risk for acute hypoglycemia. The nurse should monitor blood glucose frequently, assess for signs of hypoglycemia, and have glucose available. After ensuring client safety, incident reporting and notification follow.",
    difficulty: 3, tags: ["delegation", "medication-error", "patient-safety"], bodySystem: "Professional Practice",
    topic: "Delegation", subtopic: "Medication Error Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Medication error priority: 1) Assess the client, 2) Intervene if needed, 3) Notify the provider, 4) File incident report. Never document incident reports in the patient's medical record.",
    examStrategy: "Client safety first: assess the client → intervene → notify → report. The incident report is important but not the priority.",
    distractorRationales: { "A": "Incident reporting is important but client assessment comes first", "C": "The error details go in the incident report, not the progress notes", "D": "Pharmacy notification is important but not the priority" }
  },

  // === ETHICS & LEGAL (4 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for an elderly client in the emergency department. The nurse notes multiple bruises in various stages of healing on the client's arms and back. The client appears fearful and avoids eye contact when the caregiver is present. The nurse should:",
    options: [
      { label: "A", text: "Document the findings and discharge the client with the caregiver" },
      { label: "B", text: "Interview the client privately, report suspected elder abuse to the appropriate authorities" },
      { label: "C", text: "Confront the caregiver about the bruises" },
      { label: "D", text: "Ask the caregiver to explain the bruises" }
    ],
    correctAnswer: ["B"],
    rationale: "The nurse has a legal obligation as a mandated reporter to report suspected elder abuse. The nurse should first interview the client privately (away from the potential abuser) to assess the situation safely, then report to the appropriate authorities (Adult Protective Services). Confronting or questioning the suspected abuser could escalate the situation and put the client at further risk.",
    difficulty: 2, tags: ["ethics", "elder-abuse", "mandatory-reporting"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Mandatory Reporting", regionScope: "US", careerType: "nursing",
    clinicalPearl: "All nurses are mandated reporters of suspected abuse (child, elder, vulnerable adult). Report based on suspicion, not confirmed evidence. Private interview is essential.",
    examStrategy: "Suspected abuse: separate the victim from the suspected abuser → assess → report to authorities. Don't confront the suspected abuser.",
    distractorRationales: { "A": "Discharging without reporting suspected abuse violates mandatory reporting laws", "C": "Confronting the caregiver could escalate violence", "D": "Asking the suspected abuser for explanations is inappropriate" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client who has signed an advance directive specifying 'Do Not Resuscitate' (DNR). The client's family member demands that CPR be performed if the client arrests. The nurse should:",
    options: [
      { label: "A", text: "Perform CPR if the client arrests to satisfy the family's wishes" },
      { label: "B", text: "Honor the client's advance directive and explain the legal basis to the family" },
      { label: "C", text: "Ignore the advance directive because the family has the final say" },
      { label: "D", text: "Remove the DNR order from the chart to avoid conflict" }
    ],
    correctAnswer: ["B"],
    rationale: "The client's advance directive represents their autonomous wishes and is a legally binding document. The nurse is legally and ethically obligated to honor the DNR order. The nurse should explain to the family that the advance directive reflects the client's own decision made while competent. The nurse can involve the ethics committee, social work, or chaplain to provide support to the family.",
    difficulty: 2, tags: ["ethics", "advance-directive", "DNR"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "Advance Directives", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Advance directives: a competent adult's wishes take precedence over family demands. DNR = no CPR, but all other care continues. Involve palliative care, ethics, and social work for family support.",
    examStrategy: "Client's documented wishes (advance directive) > family wishes when the client is unable to speak for themselves.",
    distractorRationales: { "A": "Performing CPR against a valid DNR violates the client's autonomy", "C": "The competent client's wishes supersede family demands", "D": "Removing a valid DNR is illegal and unethical" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is providing end-of-life care for a client in hospice. The client's daughter asks if the morphine drip will hasten her mother's death. The nurse's most appropriate response is:",
    options: [
      { label: "A", text: "The morphine will likely speed up the dying process, but your mother will be comfortable" },
      { label: "B", text: "The primary purpose of the morphine is to manage pain and ensure comfort. We carefully titrate the dose to relieve suffering while minimizing side effects" },
      { label: "C", text: "We can stop the morphine if you're concerned about hastening death" },
      { label: "D", text: "I'm not qualified to answer that question—you should talk to the doctor" }
    ],
    correctAnswer: ["B"],
    rationale: "This response reflects the principle of double effect, where the intended effect (pain relief and comfort) is morally acceptable even though an unintended side effect (respiratory depression that could hasten death) may occur. The primary goal is comfort, not hastening death. The nurse should educate the family about the ethical and clinical basis for comfort care.",
    difficulty: 3, tags: ["ethics", "end-of-life", "hospice", "double-effect"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "End-of-Life Care", regionScope: "US", careerType: "nursing",
    clinicalPearl: "The principle of double effect: it is ethically acceptable to provide pain medication for comfort even if it may unintentionally hasten death, as long as the intent is to relieve suffering, not to cause death.",
    examStrategy: null,
    distractorRationales: { "A": "This implies the intent is to hasten death, which is inaccurate", "C": "Stopping pain medication would cause unnecessary suffering", "D": "Nurses are qualified to educate families about pain management" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse witnesses a colleague accessing a client's electronic health record without a treatment relationship or legitimate need. This action violates which federal law?",
    options: [
      { label: "A", text: "EMTALA (Emergency Medical Treatment and Labor Act)" },
      { label: "B", text: "HIPAA (Health Insurance Portability and Accountability Act)" },
      { label: "C", text: "ADA (Americans with Disabilities Act)" },
      { label: "D", text: "OSHA (Occupational Safety and Health Act)" }
    ],
    correctAnswer: ["B"],
    rationale: "HIPAA's Privacy Rule prohibits accessing protected health information (PHI) without a legitimate treatment, payment, or healthcare operations purpose. Unauthorized access to a client's medical record—even by a healthcare worker—is a HIPAA violation. The nurse should report this to the privacy officer or compliance department.",
    difficulty: 2, tags: ["ethics", "HIPAA", "privacy"], bodySystem: "Professional Practice",
    topic: "Ethics", subtopic: "HIPAA", regionScope: "US", careerType: "nursing",
    clinicalPearl: "HIPAA violations include: accessing records without need, sharing PHI verbally in public areas, leaving records visible on screens, texting PHI on personal devices. Report violations to the privacy officer.",
    examStrategy: null,
    distractorRationales: { "A": "EMTALA governs emergency medical treatment requirements", "C": "ADA addresses disability discrimination", "D": "OSHA addresses workplace safety" }
  },

  // === RENAL (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with acute kidney injury (AKI). The client's BUN is 45 mg/dL (normal: 7-20 mg/dL) and creatinine is 4.2 mg/dL (normal: 0.6-1.2 mg/dL). Which clinical manifestation does the nurse expect?",
    options: [
      { label: "A", text: "Polyuria and excessive thirst" },
      { label: "B", text: "Oliguria, peripheral edema, and elevated serum potassium" },
      { label: "C", text: "Increased urine output and weight loss" },
      { label: "D", text: "Clear, dilute urine and hypokalemia" }
    ],
    correctAnswer: ["B"],
    rationale: "In AKI, the kidneys cannot adequately filter waste products or regulate fluid and electrolyte balance. This leads to oliguria (<400 mL/day), fluid retention causing edema, hyperkalemia (kidneys cannot excrete potassium), metabolic acidosis, and uremia (elevated BUN). The elevated BUN and creatinine confirm significant renal impairment.",
    difficulty: 3, tags: ["renal", "AKI", "electrolytes"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Acute Kidney Injury", regionScope: "US", careerType: "nursing",
    clinicalPearl: "AKI stages: pre-renal (decreased perfusion), intrarenal (kidney damage), post-renal (obstruction). Treat the cause. Monitor I&O strictly. Watch for hyperkalemia—can cause cardiac arrest.",
    examStrategy: null,
    distractorRationales: { "A": "Polyuria occurs in early CKD, not typical AKI", "C": "AKI causes fluid retention, not weight loss", "D": "AKI causes concentrated, scant urine and hyperkalemia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing a client for peritoneal dialysis. During the outflow phase, the nurse notes the effluent is cloudy. What should the nurse do?",
    options: [
      { label: "A", text: "Continue the exchanges as normal" },
      { label: "B", text: "Send a sample for culture and cell count, and notify the provider" },
      { label: "C", text: "Add heparin to the next exchange" },
      { label: "D", text: "Increase the dwell time for the next exchange" }
    ],
    correctAnswer: ["B"],
    rationale: "Cloudy effluent in peritoneal dialysis is the hallmark sign of peritonitis, the most serious complication. The nurse should obtain a sample for culture and sensitivity, cell count, and Gram stain, and notify the provider immediately. Treatment typically includes intraperitoneal antibiotics. Normal PD effluent should be clear and yellow.",
    difficulty: 3, tags: ["renal", "peritoneal-dialysis", "peritonitis"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Peritoneal Dialysis", regionScope: "US", careerType: "nursing",
    clinicalPearl: "PD effluent monitoring: clear/yellow = normal; cloudy = peritonitis; bloody = possible bowel perforation; brown = bowel perforation. Report any deviation from clear effluent.",
    examStrategy: "Cloudy PD effluent = peritonitis until proven otherwise. Culture first, then antibiotics.",
    distractorRationales: { "A": "Cloudy effluent requires immediate investigation", "C": "Heparin is added for fibrin clots, not infection", "D": "Increasing dwell time does not address the infection" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with a ureteral stent placed after kidney stone surgery. The client reports bladder spasms and urgency. Which intervention is most appropriate?",
    options: [
      { label: "A", text: "Remove the stent immediately" },
      { label: "B", text: "Administer antispasmodics as prescribed, encourage fluids, and reassure the client that these symptoms are expected" },
      { label: "C", text: "Restrict fluid intake to decrease urinary frequency" },
      { label: "D", text: "Clamp the urinary catheter to reduce bladder irritation" }
    ],
    correctAnswer: ["B"],
    rationale: "Ureteral stents commonly cause bladder spasms, urgency, frequency, and flank pain during urination. These symptoms are expected and managed with antispasmodic medications (oxybutynin), adequate hydration, and pain management. The stent is removed by the urologist at a scheduled follow-up appointment, not by the nurse.",
    difficulty: 2, tags: ["renal", "ureteral-stent", "kidney-stones"], bodySystem: "Renal",
    topic: "Renal", subtopic: "Post-Surgical Stent Care", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Ureteral stent side effects: bladder spasms, urgency, frequency, hematuria, flank pain during voiding. These are expected and managed conservatively. Report: fever, severe pain, inability to void.",
    examStrategy: null,
    distractorRationales: { "A": "Stent removal is done by the urologist at follow-up", "C": "Fluids should be increased to prevent clot formation and infection", "D": "Clamping a catheter could cause bladder distention" }
  },

  // === ENDOCRINE (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with type 1 diabetes is found unresponsive with cold, clammy skin and a blood glucose of 38 mg/dL. The nurse's priority action is:",
    options: [
      { label: "A", text: "Administer regular insulin subcutaneously" },
      { label: "B", text: "Administer glucagon 1 mg IM or IV dextrose 50%" },
      { label: "C", text: "Place orange juice under the client's tongue" },
      { label: "D", text: "Start an IV infusion of normal saline" }
    ],
    correctAnswer: ["B"],
    rationale: "The client is experiencing severe hypoglycemia (BG 38 mg/dL) and is unresponsive. For unconscious clients, oral glucose is contraindicated due to aspiration risk. The nurse should administer glucagon 1 mg IM (or IV dextrose 50% if IV access is available) to rapidly raise blood glucose. Once conscious, oral carbohydrates can be given.",
    difficulty: 2, tags: ["endocrine", "hypoglycemia", "emergency"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "Hypoglycemia Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Hypoglycemia: conscious = oral glucose (15g rule). Unconscious = glucagon IM or IV D50. After glucagon, position side-lying (nausea common). Follow up with complex carb + protein snack.",
    examStrategy: "Unresponsive + hypoglycemia = glucagon IM or IV D50. NEVER give oral glucose to an unconscious client.",
    distractorRationales: { "A": "Insulin would worsen hypoglycemia", "C": "Nothing by mouth for unconscious clients—aspiration risk", "D": "NS does not address hypoglycemia" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with Cushing syndrome. Which clinical manifestation does the nurse expect?",
    options: [
      { label: "A", text: "Weight loss, bronze skin pigmentation, and hypotension" },
      { label: "B", text: "Moon face, buffalo hump, truncal obesity, and purple striae" },
      { label: "C", text: "Exophthalmos, weight loss, and heat intolerance" },
      { label: "D", text: "Myxedema, cold intolerance, and weight gain" }
    ],
    correctAnswer: ["B"],
    rationale: "Cushing syndrome results from excess cortisol and is characterized by: moon face (round face), buffalo hump (fat pad on upper back), truncal obesity with thin extremities, purple striae (stretch marks from skin thinning), easy bruising, hyperglycemia, hypertension, osteoporosis, and immunosuppression.",
    difficulty: 2, tags: ["endocrine", "cushings", "hypercortisolism"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "Cushing Syndrome", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Cushing's = too much cortisol (moon face, buffalo hump, hyperglycemia, HTN). Addison's = too little cortisol (weight loss, hypotension, hyperpigmentation). They are clinical opposites.",
    examStrategy: "Remember Cushing's features: the 3 H's—Hyperglycemia, Hypertension, Hirsutism. Plus moon face, buffalo hump, and purple striae.",
    distractorRationales: { "A": "Weight loss and bronze pigmentation describe Addison's disease", "C": "Exophthalmos and weight loss describe Graves' disease", "D": "Myxedema and cold intolerance describe hypothyroidism" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client with syndrome of inappropriate antidiuretic hormone (SIADH). The client's serum sodium is 124 mEq/L. Which nursing intervention is most important?",
    options: [
      { label: "A", text: "Encourage fluid intake to dilute excess ADH" },
      { label: "B", text: "Implement fluid restriction and monitor serum sodium closely" },
      { label: "C", text: "Administer IV dextrose 5% in water (D5W)" },
      { label: "D", text: "Increase dietary sodium to 6 grams per day" }
    ],
    correctAnswer: ["B"],
    rationale: "SIADH causes excessive water retention leading to dilutional hyponatremia. The primary treatment is fluid restriction (typically 500-1000 mL/day) to allow serum sodium to normalize. Hypertonic saline (3% NaCl) may be used for severe hyponatremia (<120 mEq/L). D5W and additional fluids would worsen the dilutional hyponatremia.",
    difficulty: 3, tags: ["endocrine", "SIADH", "hyponatremia"], bodySystem: "Endocrine",
    topic: "Endocrine", subtopic: "SIADH", regionScope: "US", careerType: "nursing",
    clinicalPearl: "SIADH vs DI: SIADH = too much ADH → water retention → dilutional hyponatremia → fluid restrict. DI = too little ADH → water loss → hypernatremia → fluid replacement. They are opposites.",
    examStrategy: "SIADH = dilute blood (low Na+) + concentrated urine. DI = concentrated blood (high Na+) + dilute urine. SIADH = restrict fluids. DI = replace fluids.",
    distractorRationales: { "A": "Encouraging fluids worsens dilutional hyponatremia", "C": "D5W is a hypotonic solution that would worsen hyponatremia", "D": "Dietary sodium alone is insufficient for SIADH management" }
  },

  // === INFECTION CONTROL (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client diagnosed with Clostridioides difficile (C. diff) infection. Which isolation precaution is most important?",
    options: [
      { label: "A", text: "Airborne precautions with N95 respirator" },
      { label: "B", text: "Contact precautions with hand washing using soap and water" },
      { label: "C", text: "Droplet precautions with surgical mask" },
      { label: "D", text: "Standard precautions with alcohol-based hand sanitizer" }
    ],
    correctAnswer: ["B"],
    rationale: "C. difficile requires contact precautions (gown and gloves) because it is spread through the fecal-oral route via spores. Critically, hand washing with soap and water is required because C. diff spores are not killed by alcohol-based hand sanitizers. The room should be cleaned with bleach-based disinfectants to kill spores.",
    difficulty: 2, tags: ["infection-control", "c-diff", "contact-precautions"], bodySystem: "Gastrointestinal",
    topic: "Infection Control", subtopic: "C. difficile Precautions", regionScope: "US", careerType: "nursing",
    clinicalPearl: "C. diff key points: soap and water (not alcohol gel), bleach for environmental cleaning, contact precautions, dedicated equipment. Risk factors: antibiotics, PPI use, elderly, hospitalization.",
    examStrategy: "C. diff = soap and water hand hygiene (alcohol doesn't kill spores). This is an exception to standard practice.",
    distractorRationales: { "A": "C. diff is not airborne", "C": "C. diff is not spread by droplets", "D": "Alcohol-based sanitizers do NOT kill C. diff spores" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse sustains a needlestick injury from a client with unknown HIV status. What is the nurse's immediate priority action?",
    options: [
      { label: "A", text: "Complete an incident report and return to patient care" },
      { label: "B", text: "Wash the site with soap and water, report to occupational health, and begin post-exposure prophylaxis (PEP) if indicated" },
      { label: "C", text: "Apply alcohol to the wound and wait for the client's lab results before taking action" },
      { label: "D", text: "Apply a bandage and continue with the shift" }
    ],
    correctAnswer: ["B"],
    rationale: "After a needlestick injury, the nurse should immediately wash the site with soap and water (do not squeeze the wound), report to occupational health or the emergency department, and have both the source patient and nurse tested. Post-exposure prophylaxis (PEP) should be initiated within 2 hours (ideally within 72 hours) if indicated. PEP consists of a 28-day course of antiretroviral medications.",
    difficulty: 2, tags: ["infection-control", "needlestick", "PEP"], bodySystem: "Professional Practice",
    topic: "Infection Control", subtopic: "Needlestick Injury Protocol", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Needlestick protocol: wash immediately with soap and water, report to occupational health, source and nurse testing, PEP within 2 hours if indicated, follow-up testing at 6 weeks, 3 months, and 6 months.",
    examStrategy: "Needlestick: wash → report → PEP within 2 hours → follow-up. Time is critical for PEP effectiveness.",
    distractorRationales: { "A": "An incident report alone is insufficient; medical evaluation is needed", "C": "Alcohol is not the recommended cleaning agent, and waiting delays PEP", "D": "A bandage alone does not address the exposure risk" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is preparing to care for a client with varicella (chickenpox). Which type of precautions should the nurse implement?",
    options: [
      { label: "A", text: "Contact precautions only" },
      { label: "B", text: "Airborne and contact precautions" },
      { label: "C", text: "Droplet precautions only" },
      { label: "D", text: "Standard precautions only" }
    ],
    correctAnswer: ["B"],
    rationale: "Varicella (chickenpox) requires both airborne AND contact precautions because the virus is transmitted via airborne nuclei (inhaled) and by direct contact with vesicular fluid from the lesions. The client needs a negative pressure room, and staff must wear an N95 respirator plus gown and gloves. Only staff with documented immunity should care for the client.",
    difficulty: 3, tags: ["infection-control", "varicella", "airborne-contact"], bodySystem: "Integumentary",
    topic: "Infection Control", subtopic: "Varicella Precautions", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Varicella and disseminated herpes zoster require BOTH airborne + contact precautions. Localized zoster (shingles) requires contact precautions only. Only immune staff should care for these patients.",
    examStrategy: "Varicella = airborne + contact (the virus is in the air AND in the vesicle fluid).",
    distractorRationales: { "A": "Contact precautions alone miss the airborne transmission route", "C": "Varicella is airborne, not just droplet", "D": "Standard precautions are insufficient for varicella" }
  },

  // === GI (3 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client admitted with an upper GI bleed. The client is vomiting bright red blood and has a blood pressure of 86/54 mmHg, heart rate of 124 bpm. The nurse's priority action is:",
    options: [
      { label: "A", text: "Insert a nasogastric tube for lavage" },
      { label: "B", text: "Establish two large-bore IV lines and begin fluid resuscitation" },
      { label: "C", text: "Administer a proton pump inhibitor IV" },
      { label: "D", text: "Schedule an emergent endoscopy" }
    ],
    correctAnswer: ["B"],
    rationale: "The client is showing signs of hypovolemic shock (hypotension, tachycardia) from acute hemorrhage. The priority is to restore circulating volume by establishing two large-bore IV lines (14-16 gauge) and initiating aggressive fluid resuscitation with isotonic crystalloids and typing and crossmatching for blood products. All other interventions, while important, follow volume resuscitation.",
    difficulty: 3, tags: ["GI", "upper-GI-bleed", "hemorrhagic-shock"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "Upper GI Bleeding", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Upper GI bleed management: ABCs → 2 large-bore IVs → fluid resuscitation → type and crossmatch → PPI drip → emergent endoscopy. Red flags: hematemesis, melena, coffee-ground emesis.",
    examStrategy: "In hemorrhage with shock signs, volume resuscitation is ALWAYS the priority. Two large-bore IVs first.",
    distractorRationales: { "A": "NG tube is secondary to hemodynamic stabilization", "C": "PPI is important but not the immediate priority", "D": "Endoscopy is needed but the client must be stabilized first" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client with cirrhosis develops ascites. The provider orders a paracentesis. The nurse prepares the client by:",
    options: [
      { label: "A", text: "Placing the client in a supine position and keeping NPO" },
      { label: "B", text: "Having the client void, then positioning in an upright sitting position" },
      { label: "C", text: "Administering a sedative and placing the client prone" },
      { label: "D", text: "Inserting a Foley catheter and positioning in left lateral decubitus" }
    ],
    correctAnswer: ["B"],
    rationale: "Before paracentesis, the client should void to decompress the bladder and reduce the risk of bladder perforation. The client is positioned sitting upright at the edge of the bed or in a chair, leaning slightly forward, which allows fluid to accumulate in the lower abdomen and facilitates easier access for the needle insertion.",
    difficulty: 3, tags: ["GI", "cirrhosis", "paracentesis"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "Paracentesis", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Post-paracentesis monitoring: vital signs q15min × 4 (risk of hypovolemia from large-volume removal), measure abdominal girth, daily weight, I&O. Albumin infusion may be ordered for large-volume removal (>5L).",
    examStrategy: null,
    distractorRationales: { "A": "Supine position does not facilitate fluid drainage", "C": "Sedation and prone positioning are not standard for paracentesis", "D": "A Foley is typically not needed if the client can void voluntarily" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is teaching a client newly diagnosed with celiac disease about dietary modifications. Which food item should the client avoid?",
    options: [
      { label: "A", text: "Rice and corn" },
      { label: "B", text: "Fresh fruits and vegetables" },
      { label: "C", text: "Wheat bread and barley soup" },
      { label: "D", text: "Potatoes and quinoa" }
    ],
    correctAnswer: ["C"],
    rationale: "Celiac disease is an autoimmune disorder triggered by gluten, a protein found in wheat, barley, and rye. The client must follow a strict gluten-free diet for life. Wheat bread and barley soup both contain gluten and must be avoided. Rice, corn, potatoes, quinoa, fruits, and vegetables are naturally gluten-free and safe to consume.",
    difficulty: 2, tags: ["GI", "celiac-disease", "gluten-free"], bodySystem: "Gastrointestinal",
    topic: "Gastrointestinal", subtopic: "Celiac Disease", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Celiac gluten sources: Wheat, Barley, Rye (remember 'WBR'). Oats are controversial—cross-contamination is common. Safe grains: rice, corn, quinoa, buckwheat, millet.",
    examStrategy: null,
    distractorRationales: { "A": "Rice and corn are gluten-free", "B": "Fresh fruits and vegetables are gluten-free", "D": "Potatoes and quinoa are gluten-free" }
  },

  // === MUSCULOSKELETAL (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client in skeletal traction for a femur fracture. Which nursing intervention is most important?",
    options: [
      { label: "A", text: "Remove the weights periodically to allow the client to rest" },
      { label: "B", text: "Maintain the weights hanging freely, ensure proper alignment, and perform neurovascular checks" },
      { label: "C", text: "Lift the weights when repositioning the client" },
      { label: "D", text: "Add additional weight if the client reports continued pain" }
    ],
    correctAnswer: ["B"],
    rationale: "Skeletal traction weights must hang freely at all times to maintain continuous pull and proper alignment. The weights should never be lifted, removed, or adjusted by the nurse. Neurovascular checks (5 Ps: pain, pulse, pallor, paresthesia, paralysis) should be performed regularly. The client should be repositioned using the trapeze without disrupting traction.",
    difficulty: 2, tags: ["musculoskeletal", "traction", "femur-fracture"], bodySystem: "Musculoskeletal",
    topic: "Musculoskeletal", subtopic: "Traction Management", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Traction rules: weights hang freely, never removed (skeletal) or adjusted without orders, ropes move freely through pulleys, knots don't touch pulleys. Skin traction can be removed briefly; skeletal traction never.",
    examStrategy: null,
    distractorRationales: { "A": "Skeletal traction weights must remain on at all times", "C": "Lifting weights disrupts the traction force", "D": "Only the provider adjusts traction weights" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client 24 hours after a long bone fracture repair. The client develops sudden dyspnea, confusion, petechial rash on the chest, and an SpO2 of 82%. The nurse suspects:",
    options: [
      { label: "A", text: "Deep vein thrombosis" },
      { label: "B", text: "Fat embolism syndrome" },
      { label: "C", text: "Pneumonia" },
      { label: "D", text: "Atelectasis" }
    ],
    correctAnswer: ["B"],
    rationale: "Fat embolism syndrome classically occurs 24-72 hours after a long bone fracture. The diagnostic triad includes: respiratory distress (dyspnea, tachypnea, hypoxemia), neurological changes (confusion, agitation), and a petechial rash (typically on the chest, axillae, and conjunctivae). This is a medical emergency requiring supportive care, high-flow oxygen, and mechanical ventilation if needed.",
    difficulty: 3, tags: ["musculoskeletal", "fat-embolism", "emergency"], bodySystem: "Respiratory",
    topic: "Musculoskeletal", subtopic: "Fat Embolism Syndrome", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Fat embolism triad: respiratory distress + neuro changes + petechial rash. Occurs 24-72h post-fracture. Risk factors: long bone fractures, pelvis fractures, liposuction. No specific treatment—supportive care.",
    examStrategy: "Petechial rash + respiratory distress + confusion after a long bone fracture = fat embolism syndrome.",
    distractorRationales: { "A": "DVT typically presents with leg swelling, not petechial rash", "C": "Pneumonia develops more gradually and doesn't cause petechiae", "D": "Atelectasis doesn't cause petechial rash or confusion" }
  },

  // === WOUND CARE (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is performing wound care on a client with a venous stasis ulcer on the lower leg. Which treatment approach is most appropriate?",
    options: [
      { label: "A", text: "Apply compression therapy and keep the wound moist" },
      { label: "B", text: "Elevate the leg above heart level continuously and apply heat" },
      { label: "C", text: "Apply compression and dry the wound completely" },
      { label: "D", text: "Keep the leg in a dependent position and apply cold packs" }
    ],
    correctAnswer: ["A"],
    rationale: "Venous stasis ulcers result from chronic venous insufficiency causing blood pooling in the legs. Treatment includes compression therapy (compression stockings or wraps) to improve venous return, moist wound healing environment, leg elevation when resting, and management of edema. The wound should be kept moist, not dried out.",
    difficulty: 3, tags: ["wound-care", "venous-ulcer", "compression"], bodySystem: "Integumentary",
    topic: "Wound Care", subtopic: "Venous Stasis Ulcers", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Venous ulcers: medial malleolus, irregular borders, shallow, moderate-heavy exudate. Treat with compression + moist wound care. Arterial ulcers: distal extremity, round, deep, pale base. NO compression for arterial ulcers.",
    examStrategy: "Venous ulcer = compression + moist wound healing. Arterial ulcer = improve circulation, NO compression (check ABI first).",
    distractorRationales: { "B": "Continuous elevation and heat are excessive; compression is more effective", "C": "Drying the wound impairs healing", "D": "Dependency worsens venous stasis; cold packs are not standard" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is assessing a surgical client's wound and notes serosanguineous drainage on the dressing. The nurse interprets this finding as:",
    options: [
      { label: "A", text: "Active arterial bleeding requiring immediate intervention" },
      { label: "B", text: "Normal wound healing with a mixture of serum and blood" },
      { label: "C", text: "Wound infection requiring antibiotic therapy" },
      { label: "D", text: "Dehiscence requiring emergency surgical repair" }
    ],
    correctAnswer: ["B"],
    rationale: "Serosanguineous drainage is a combination of serous (clear, watery) and sanguineous (bloody) drainage, appearing pink or light red. This is normal during the early phases of wound healing (inflammatory phase). Pure sanguineous (bright red) drainage may indicate active bleeding, purulent (thick, opaque) drainage suggests infection, and serous drainage alone is normal.",
    difficulty: 2, tags: ["wound-care", "drainage-types", "assessment"], bodySystem: "Integumentary",
    topic: "Wound Care", subtopic: "Wound Drainage Assessment", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Wound drainage types: Serous (clear/yellow, normal), Sanguineous (bloody red, may indicate bleeding), Serosanguineous (pink, normal healing), Purulent (thick/opaque, infection).",
    examStrategy: null,
    distractorRationales: { "A": "Serosanguineous is normal; bright red drainage indicates active bleeding", "C": "Purulent drainage suggests infection, not serosanguineous", "D": "Dehiscence is wound separation with visible tissue, not just drainage" }
  },

  // === FLUID & ELECTROLYTES (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a client receiving IV therapy. The client develops sudden dyspnea, chest pain, and a churning sound heard over the precordium. The nurse suspects an air embolism. What is the nurse's immediate action?",
    options: [
      { label: "A", text: "Place the client in Trendelenburg position on the left side" },
      { label: "B", text: "Raise the head of the bed and administer oxygen" },
      { label: "C", text: "Turn the client to the right side in a prone position" },
      { label: "D", text: "Position the client supine and begin chest compressions" }
    ],
    correctAnswer: ["A"],
    rationale: "For a suspected air embolism, the nurse should immediately clamp the IV tubing, position the client in left lateral Trendelenburg (left side lying with head lower than feet). This position traps the air in the right atrium (away from the pulmonary vasculature), preventing it from traveling to the lungs. The nurse should then notify the provider and administer oxygen.",
    difficulty: 4, tags: ["fluid-electrolytes", "air-embolism", "IV-complications"], bodySystem: "Cardiovascular",
    topic: "Fluid and Electrolytes", subtopic: "IV Therapy Complications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Air embolism: clamp tubing → left lateral Trendelenburg → notify provider → oxygen → monitor vitals. Prevention: prime all tubing, use Luer-Lock connections, never let IV bags run dry.",
    examStrategy: "Air embolism = left side + Trendelenburg. The left lateral position traps air in the right atrium.",
    distractorRationales: { "B": "This position could allow air to travel to pulmonary circulation", "C": "Right side positioning does not trap air in the right atrium", "D": "Chest compressions are not indicated unless cardiac arrest occurs" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is administering IV potassium chloride to a client. Which safety precaution is most important?",
    options: [
      { label: "A", text: "Administer potassium by IV push for rapid correction" },
      { label: "B", text: "Never administer potassium by IV push; always use an infusion pump with cardiac monitoring" },
      { label: "C", text: "Dilute in dextrose 5% and administer without monitoring" },
      { label: "D", text: "Administer undiluted potassium at a rate of 40 mEq/hour" }
    ],
    correctAnswer: ["B"],
    rationale: "IV potassium chloride must NEVER be administered by IV push—this can cause fatal cardiac arrest. It must always be diluted appropriately, administered via an infusion pump at a rate not exceeding 10-20 mEq/hour (or per facility policy), and the client must be on continuous cardiac monitoring. The IV site should be monitored for phlebitis, as potassium is very irritating to veins.",
    difficulty: 2, tags: ["fluid-electrolytes", "potassium", "IV-safety"], bodySystem: "Fluid and Electrolytes",
    topic: "Fluid and Electrolytes", subtopic: "IV Potassium Administration", regionScope: "US", careerType: "nursing",
    clinicalPearl: "IV potassium rules: NEVER push, max 10-20 mEq/hr, always use pump, cardiac monitoring, assess IV site for infiltration/phlebitis. Peripheral: max 40 mEq/L concentration. Central: higher concentrations OK.",
    examStrategy: "IV potassium by push = NEVER. This is a universal nursing safety rule tested frequently.",
    distractorRationales: { "A": "IV push potassium causes fatal cardiac arrest", "C": "Cardiac monitoring is always required", "D": "40 mEq/hour exceeds the safe rate, and potassium is never given undiluted" }
  },

  // === ADDITIONAL TOPICS TO REACH 75 (2 questions) ===
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A client is admitted with suspected meningitis. The nurse prepares for which diagnostic test to confirm the diagnosis?",
    options: [
      { label: "A", text: "CT scan of the abdomen" },
      { label: "B", text: "Lumbar puncture with cerebrospinal fluid analysis" },
      { label: "C", text: "Electroencephalogram (EEG)" },
      { label: "D", text: "Magnetic resonance angiography (MRA)" }
    ],
    correctAnswer: ["B"],
    rationale: "Lumbar puncture (LP) with cerebrospinal fluid (CSF) analysis is the gold standard for diagnosing meningitis. CSF findings in bacterial meningitis include: elevated protein, decreased glucose, elevated WBC count (predominantly neutrophils), and cloudy appearance. A CT scan of the head may be done first to rule out increased ICP before performing the LP.",
    difficulty: 2, tags: ["neurological", "meningitis", "diagnostics"], bodySystem: "Neurological",
    topic: "Neurological", subtopic: "Meningitis Diagnosis", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Bacterial meningitis CSF: cloudy, high protein, low glucose, high WBC (neutrophils). Viral meningitis CSF: clear, normal/slight protein elevation, normal glucose, high WBC (lymphocytes).",
    examStrategy: null,
    distractorRationales: { "A": "CT abdomen is not relevant for meningitis", "C": "EEG tests brain electrical activity, not infection", "D": "MRA evaluates blood vessels, not meningeal infection" }
  },
  {
    tier: "rn", exam: "NCLEX-RN", questionType: "multiple_choice", status: "published",
    stem: "A nurse is caring for a postoperative client who develops a temperature of 102.2°F (39°C) on postoperative day 3 with purulent wound drainage. The nurse suspects a surgical site infection. Using the mnemonic 'Wind, Water, Wound, Walk,' which cause of postoperative fever does this represent?",
    options: [
      { label: "A", text: "Wind (atelectasis/pneumonia)" },
      { label: "B", text: "Water (urinary tract infection)" },
      { label: "C", text: "Wound (surgical site infection)" },
      { label: "D", text: "Walk (deep vein thrombosis)" }
    ],
    correctAnswer: ["C"],
    rationale: "The 'Wind, Water, Wound, Walk' mnemonic helps identify common causes of postoperative fever by timing: Wind (POD 1-2: atelectasis, pneumonia), Water (POD 3-5: UTI, especially if catheterized), Wound (POD 5-7: surgical site infection), Walk (POD 7-10: DVT/PE). However, wound infections can occur earlier. The purulent drainage with fever on POD 3 points to wound infection.",
    difficulty: 3, tags: ["surgical", "postoperative-fever", "infection"], bodySystem: "Professional Practice",
    topic: "Surgical Nursing", subtopic: "Post-Operative Complications", regionScope: "US", careerType: "nursing",
    clinicalPearl: "Post-op fever mnemonic 'W's' by day: Wind (1-2), Water (3-5), Wound (5-7), Walk (7-10), Wonder drugs (any time). This is a guide—actual timing varies.",
    examStrategy: "Match the postoperative day with the likely fever cause: early = respiratory, mid = UTI/wound, late = DVT.",
    distractorRationales: { "A": "Wind causes are typically POD 1-2 without wound drainage", "B": "Water causes present with urinary symptoms", "D": "Walk causes present with leg symptoms, typically later" }
  }
];

async function insertQuestions(questions: QuestionData[]) {
  let inserted = 0;
  let skipped = 0;

  for (const q of questions) {
    const hash = stemHash(q.stem);

    const existing = await pool.query(
      `SELECT id FROM exam_questions WHERE stem_hash = $1`,
      [hash]
    );

    if (existing.rows.length > 0) {
      skipped++;
      continue;
    }

    await pool.query(
      `INSERT INTO exam_questions (
        tier, exam, question_type, status, stem, options, correct_answer, rationale,
        difficulty, tags, body_system, topic, subtopic, region_scope, career_type,
        clinical_pearl, exam_strategy, distractor_rationales, stem_hash, published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW()
      )`,
      [
        q.tier, q.exam, q.questionType, q.status, q.stem,
        JSON.stringify(q.options), JSON.stringify(q.correctAnswer),
        q.rationale, q.difficulty, q.tags, q.bodySystem, q.topic,
        q.subtopic, q.regionScope, q.careerType, q.clinicalPearl,
        q.examStrategy, q.distractorRationales ? JSON.stringify(q.distractorRationales) : null,
        hash
      ]
    );
    inserted++;
  }

  return { inserted, skipped };
}

async function main() {
  try {
    console.log("Starting RN exam question insertion...\n");

    console.log(`Inserting ${canadaQuestions.length} RN Canada questions...`);
    const canResult = await insertQuestions(canadaQuestions);
    console.log(`  Inserted: ${canResult.inserted}, Skipped (duplicates): ${canResult.skipped}`);

    console.log(`\nInserting ${usaQuestions.length} RN USA questions...`);
    const usResult = await insertQuestions(usaQuestions);
    console.log(`  Inserted: ${usResult.inserted}, Skipped (duplicates): ${usResult.skipped}`);

    console.log("\n--- Verification Queries ---\n");

    const canCount = await pool.query(
      `SELECT COUNT(*) as cnt FROM exam_questions WHERE tier = 'rn' AND region_scope = 'CAN' AND status = 'published'`
    );
    console.log(`RN Canada published questions: ${canCount.rows[0].cnt}`);

    const usCount = await pool.query(
      `SELECT COUNT(*) as cnt FROM exam_questions WHERE tier = 'rn' AND region_scope = 'US' AND status = 'published'`
    );
    console.log(`RN USA published questions: ${usCount.rows[0].cnt}`);

    const totalRN = await pool.query(
      `SELECT COUNT(*) as cnt FROM exam_questions WHERE tier = 'rn' AND status = 'published'`
    );
    console.log(`Total RN published questions: ${totalRN.rows[0].cnt}`);

    const topicDist = await pool.query(
      `SELECT region_scope, topic, COUNT(*) as cnt 
       FROM exam_questions 
       WHERE tier = 'rn' AND status = 'published' AND region_scope IN ('CAN', 'US')
       GROUP BY region_scope, topic 
       ORDER BY region_scope, cnt DESC`
    );
    console.log("\nTopic distribution for new CAN/US questions:");
    for (const row of topicDist.rows) {
      console.log(`  ${row.region_scope}: ${row.topic} - ${row.cnt}`);
    }

    const diffDist = await pool.query(
      `SELECT region_scope, difficulty, COUNT(*) as cnt 
       FROM exam_questions 
       WHERE tier = 'rn' AND status = 'published' AND region_scope IN ('CAN', 'US')
       GROUP BY region_scope, difficulty 
       ORDER BY region_scope, difficulty`
    );
    console.log("\nDifficulty distribution for new CAN/US questions:");
    for (const row of diffDist.rows) {
      const labels: Record<number, string> = { 2: "Easy", 3: "Moderate", 4: "Hard" };
      console.log(`  ${row.region_scope}: ${labels[row.difficulty] || row.difficulty} (${row.difficulty}) - ${row.cnt}`);
    }

    console.log("\nDone! All questions inserted successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

main();
