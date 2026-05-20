import crypto from "crypto";
import pg from "pg";

const pool = new pg.Pool({
  host: process.env.PGHOST || "helium",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "heliumdb",
  ssl: false,
});

function stemHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ")).digest("hex").substring(0, 16);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface QuestionRecord {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: string;
  correctAnswer: string;
  rationale: string;
  difficulty: number;
  tags: string[];
  bodySystem: string;
  topic: string;
  subtopic: string;
  regionScope: string;
  stemHash: string;
  scenario: string;
  clinicalPearl: string;
  examStrategy: string;
  clinicalTrap: string;
  distractorRationales: string;
  cognitiveLevel: string;
  questionFormat: string;
  careerType: string;
  blueprintDomain: string;
}

const RPN_BLUEPRINT_DOMAINS = [
  "Safe & Effective Care Environment",
  "Health Promotion & Maintenance",
  "Psychosocial Integrity",
  "Physiological Integrity",
];

const RN_BLUEPRINT_DOMAINS = [
  "Safe & Effective Care Environment",
  "Health Promotion & Maintenance",
  "Psychosocial Integrity",
  "Physiological Integrity",
];

const RPN_TOPICS = [
  "Fundamentals of Nursing", "Medication Administration", "Patient Safety",
  "Infection Control", "Fluid & Electrolytes", "Vital Signs Assessment",
  "Wound Care", "Pain Management", "Nutrition", "Elimination",
  "Perioperative Care", "Mental Health Basics", "Maternal-Newborn",
  "Pediatric Nursing", "Geriatric Care", "Delegation & Scope",
  "Documentation", "Communication", "Ethics & Legal", "Emergency Response",
];

const RN_TOPICS = [
  "Critical Thinking & Clinical Judgment", "Pharmacology", "Medical-Surgical Nursing",
  "Cardiac & Hemodynamic Monitoring", "Respiratory Management", "Neurological Assessment",
  "Renal & Urinary", "Endocrine Disorders", "GI & Hepatic", "Hematology & Oncology",
  "Immune & Infectious Disease", "Musculoskeletal", "Integumentary",
  "Maternal-Newborn & Women's Health", "Pediatric Nursing", "Mental Health & Psychiatric",
  "Emergency & Trauma Nursing", "Community & Public Health", "Leadership & Management",
  "Delegation & Prioritization", "Patient Education", "Cultural Competence",
  "Ethics & Legal", "Evidence-Based Practice", "Quality Improvement",
];

const FORMAT_DISTRIBUTION = {
  MCQ: 0.40,
  SATA: 0.15,
  "scenario-based": 0.15,
  prioritization: 0.10,
  delegation: 0.05,
  "dosage-calculation": 0.05,
  "lab-interpretation": 0.05,
  bowtie: 0.03,
  "progressive-unfolding": 0.02,
};

const DIFFICULTY_DISTRIBUTION = { 1: 0.10, 2: 0.20, 3: 0.45, 4: 0.20, 5: 0.05 };

function assignFormat(index: number, total: number): string {
  const formats = Object.entries(FORMAT_DISTRIBUTION);
  let cumulative = 0;
  const position = index / total;
  for (const [fmt, pct] of formats) {
    cumulative += pct;
    if (position < cumulative) return fmt;
  }
  return "MCQ";
}

function assignDifficulty(index: number, total: number): number {
  const diffs = Object.entries(DIFFICULTY_DISTRIBUTION);
  let cumulative = 0;
  const position = (index % 20) / 20;
  for (const [diff, pct] of diffs) {
    cumulative += pct;
    if (position < cumulative) return parseInt(diff);
  }
  return 3;
}

function assignCognitiveLevel(difficulty: number): string {
  if (difficulty <= 2) return "recall";
  if (difficulty === 3) return "application";
  if (difficulty === 4) return "analysis";
  return "synthesis";
}

function assignBlueprintDomain(topic: string, domains: string[]): string {
  const safetyTopics = ["Patient Safety", "Infection Control", "Delegation & Scope", "Documentation", "Ethics & Legal", "Leadership & Management", "Delegation & Prioritization", "Quality Improvement", "Safe & Effective Care Environment"];
  const healthPromTopics = ["Nutrition", "Community & Public Health", "Patient Education", "Cultural Competence", "Health Promotion & Maintenance", "Maternal-Newborn", "Maternal-Newborn & Women's Health", "Pediatric Nursing"];
  const psychoTopics = ["Mental Health Basics", "Communication", "Mental Health & Psychiatric", "Psychosocial Integrity"];

  if (safetyTopics.some(t => topic.includes(t))) return "Safe & Effective Care Environment";
  if (healthPromTopics.some(t => topic.includes(t))) return "Health Promotion & Maintenance";
  if (psychoTopics.some(t => topic.includes(t))) return "Psychosocial Integrity";
  return "Physiological Integrity";
}

function buildRExPNQuestions(): QuestionRecord[] {
  const questions: QuestionRecord[] = [];
  const tier = "rpn";
  const exam = "REx-PN";
  const regionScope = "CA";

  const scenarios: Array<{
    topic: string;
    subtopic: string;
    stem: string;
    options: { label: string; text: string }[];
    correctAnswer: string[];
    rationale: string;
    clinicalPearl: string;
    examStrategy: string;
    clinicalTrap: string;
    distractorRationales: Record<string, string>;
    tags: string[];
    questionFormat: string;
    scenario: string;
  }> = [
    {
      topic: "Infection Control",
      subtopic: "Hand Hygiene",
      stem: "An RPN is preparing to perform a sterile dressing change on a patient's abdominal surgical incision. The wound shows healthy granulation tissue with no signs of infection. The patient's temperature is 36.8°C, and the last WBC count was 7.2 x 10^9/L. What is the RPN's priority action before beginning the dressing change?",
      options: [
        { label: "A", text: "Apply clean gloves and begin removing the old dressing" },
        { label: "B", text: "Perform hand hygiene with alcohol-based hand rub for at least 15 seconds" },
        { label: "C", text: "Set up the sterile field and open all supplies before washing hands" },
        { label: "D", text: "Perform surgical hand scrub with antiseptic soap for at least 2 minutes" },
      ],
      correctAnswer: ["B"],
      rationale: "Hand hygiene is the single most important intervention to prevent healthcare-associated infections (HAIs). Before any wound care procedure, the RPN must perform thorough hand hygiene. Alcohol-based hand rub (ABHR) is the preferred method for routine hand hygiene when hands are not visibly soiled, as recommended by the Public Health Agency of Canada (PHAC) and the World Health Organization (WHO). The technique requires applying sufficient product to cover all hand surfaces and rubbing for at least 15 seconds until dry. While a surgical hand scrub is appropriate for operating room procedures, it is not required for bedside dressing changes. Setting up supplies before hand hygiene would contaminate the sterile field. The normal vital signs (temperature 36.8°C, WBC 7.2 x 10^9/L in SI units) indicate no current infection, but aseptic technique must still be maintained to prevent wound contamination. After hand hygiene, the RPN should apply clean gloves to remove the old dressing, perform hand hygiene again, then apply sterile gloves for the new dressing application. This two-glove technique prevents cross-contamination between the soiled dressing and the clean wound bed.",
      clinicalPearl: "ABHR is preferred over soap and water when hands are not visibly soiled; it is faster and more effective against most pathogens",
      examStrategy: "When asked about priority actions before procedures, hand hygiene almost always comes first in the sequence",
      clinicalTrap: "Do not confuse surgical hand scrub (OR procedures) with routine hand hygiene (bedside procedures)",
      distractorRationales: {
        A: "Applying clean gloves without first performing hand hygiene violates infection control principles and increases HAI risk",
        C: "Setting up the sterile field before hand hygiene would introduce microorganisms from contaminated hands onto sterile supplies",
        D: "Surgical hand scrub is reserved for operating room procedures; it is excessive for bedside dressing changes",
      },
      tags: ["infection-control", "hand-hygiene", "sterile-technique", "wound-care"],
      questionFormat: "MCQ",
      scenario: "RPN performing sterile abdominal dressing change on a surgical patient with healthy granulation tissue",
    },
    {
      topic: "Medication Administration",
      subtopic: "Insulin Administration",
      stem: "An RPN is preparing to administer insulin to a patient with Type 2 diabetes mellitus. The patient's capillary blood glucose reading is 14.2 mmol/L before lunch. The physician has ordered insulin lispro (Humalog) 6 units subcutaneously with meals. Which action by the RPN demonstrates safe insulin administration?",
      options: [
        { label: "A", text: "Draw up the insulin and administer it 30 minutes before the meal tray arrives" },
        { label: "B", text: "Verify the insulin type, dose, and expiry date, then administer within 15 minutes of the meal" },
        { label: "C", text: "Mix the insulin lispro with NPH insulin in the same syringe to reduce injections" },
        { label: "D", text: "Administer the insulin intramuscularly for faster absorption due to the elevated glucose" },
      ],
      correctAnswer: ["B"],
      rationale: "Insulin lispro (Humalog) is a rapid-acting insulin analogue with onset of 10-15 minutes, peak effect at 1-2 hours, and duration of 3-5 hours. It should be administered within 15 minutes of eating to match its rapid onset with carbohydrate absorption. Administering it 30 minutes before the meal (as with regular insulin) could cause hypoglycemia before the patient begins eating. The RPN must always verify the '10 Rights' of medication administration, including the right drug (checking that it is indeed insulin lispro, not another insulin type), right dose (6 units), right route (subcutaneous), right time (with meals), and right patient. Checking the expiry date and the insulin's appearance (clear for rapid-acting) is essential. While insulin lispro can technically be mixed with NPH insulin, this should only be done if specifically ordered, and the rapid-acting insulin must be drawn up first to prevent contamination with the intermediate-acting insulin. Intramuscular injection is not the standard route for routine insulin administration and would alter the pharmacokinetics unpredictably. The blood glucose of 14.2 mmol/L (equivalent to approximately 256 mg/dL in US units) is elevated but does not require emergent IM administration.",
      clinicalPearl: "Rapid-acting insulins (lispro, aspart, glulisine) are given within 15 minutes of meals; regular insulin is given 30 minutes before meals",
      examStrategy: "Match the insulin type to its correct timing: rapid-acting = with meals, regular = 30 min before, intermediate/long-acting = scheduled times",
      clinicalTrap: "Do not confuse the timing of rapid-acting insulin (within 15 min of meals) with regular insulin (30 min before meals)",
      distractorRationales: {
        A: "Administering rapid-acting insulin 30 minutes before eating is the timing for regular insulin; this could cause hypoglycemia",
        C: "Mixing insulins should only be done when specifically ordered; the question states a single insulin order",
        D: "Subcutaneous injection is the standard route for routine insulin; IM injection is not appropriate for meal-time dosing",
      },
      tags: ["medication-administration", "insulin", "diabetes", "pharmacology", "patient-safety"],
      questionFormat: "MCQ",
      scenario: "RPN administering rapid-acting insulin to a Type 2 diabetic patient before lunch with blood glucose 14.2 mmol/L",
    },
    {
      topic: "Patient Safety",
      subtopic: "Fall Prevention",
      stem: "An RPN is caring for an 82-year-old patient who was admitted for a left hip replacement 2 days ago. The patient is on hydromorphone 1 mg PO q4h PRN for pain and has been experiencing postural hypotension. The patient's Morse Fall Scale score is 55. Which combination of interventions should the RPN implement? (Select all that apply.)",
      options: [
        { label: "A", text: "Place the bed in the lowest position with brakes locked" },
        { label: "B", text: "Ensure the call bell is within the patient's reach at all times" },
        { label: "C", text: "Apply bilateral wrist restraints to prevent the patient from getting up independently" },
        { label: "D", text: "Assist the patient to sit on the edge of the bed before standing (dangling)" },
        { label: "E", text: "Encourage the patient to ambulate independently to promote recovery" },
        { label: "F", text: "Place a yellow fall-risk bracelet on the patient and post signage at the bedside" },
      ],
      correctAnswer: ["A", "B", "D", "F"],
      rationale: "This patient has multiple fall risk factors: advanced age (82), recent hip surgery requiring opioid analgesia (hydromorphone causes sedation and dizziness), postural hypotension, and a Morse Fall Scale score of 55 (high risk is typically >45). The RPN must implement a comprehensive fall prevention care plan. Keeping the bed in the lowest position with brakes locked reduces injury from potential falls. The call bell must always be within reach so the patient can request assistance before attempting to mobilize. Dangling (sitting on the edge of the bed before standing) is essential for patients with postural hypotension, as it allows the cardiovascular system to compensate for position changes, reducing the risk of syncope. Fall-risk identification through a yellow bracelet and bedside signage alerts all healthcare team members to the patient's elevated risk status. Restraints (option C) are never a first-line fall prevention intervention and require a physician's order; they can actually increase injury risk and patient agitation. Encouraging independent ambulation (option E) is inappropriate given the high fall risk score, recent surgery, opioid use, and postural hypotension; the patient requires supervised and assisted ambulation.",
      clinicalPearl: "Morse Fall Scale scores above 45 indicate high fall risk requiring a multi-faceted prevention plan including environmental modifications, patient identification, and assisted mobility",
      examStrategy: "For SATA questions on fall prevention, select interventions that reduce risk without restricting patient rights; restraints are almost never correct for fall prevention",
      clinicalTrap: "Restraints are NOT appropriate for fall prevention; they increase agitation, injury risk, and restrict patient autonomy",
      distractorRationales: {
        C: "Physical restraints are not indicated for fall prevention; they require a specific order, increase agitation, and violate patient autonomy principles",
        E: "Independent ambulation is unsafe with a Morse Fall Scale score of 55, recent hip surgery, opioid use, and postural hypotension",
      },
      tags: ["patient-safety", "fall-prevention", "geriatric-care", "postoperative", "opioid-safety"],
      questionFormat: "SATA",
      scenario: "82-year-old post-hip replacement patient with multiple fall risk factors including opioid use and postural hypotension",
    },
    {
      topic: "Fluid & Electrolytes",
      subtopic: "Hyperkalemia",
      stem: "An RPN is reviewing the laboratory results for a patient with chronic kidney disease (CKD) stage 4. The serum potassium level is 6.2 mmol/L (normal: 3.5-5.0 mmol/L). The patient reports muscle weakness and tingling in the extremities. Which ECG finding should the RPN anticipate and report immediately?",
      options: [
        { label: "A", text: "Flattened T waves and prominent U waves" },
        { label: "B", text: "Tall, peaked (tented) T waves with widened QRS complexes" },
        { label: "C", text: "Prolonged QT interval with ST segment depression" },
        { label: "D", text: "Normal sinus rhythm with occasional premature atrial contractions" },
      ],
      correctAnswer: ["B"],
      rationale: "Hyperkalemia (serum potassium > 5.0 mmol/L) is a life-threatening electrolyte imbalance commonly seen in patients with chronic kidney disease due to the kidneys' impaired ability to excrete potassium. At a level of 6.2 mmol/L, the patient is at significant risk for cardiac dysrhythmias and cardiac arrest. The hallmark ECG changes of hyperkalemia progress as potassium levels rise: mild hyperkalemia (5.5-6.0 mmol/L) shows tall, peaked (tented) T waves, particularly in the precordial leads; moderate hyperkalemia (6.0-7.0 mmol/L) adds widened QRS complexes, prolonged PR interval, and flattened P waves; severe hyperkalemia (>7.0 mmol/L) can progress to a sine wave pattern, ventricular fibrillation, or asystole. The clinical symptoms of muscle weakness and paresthesias (tingling) are consistent with hyperkalemia's effects on neuromuscular function. Flattened T waves and U waves are characteristic of hypokalemia, the opposite condition. Prolonged QT with ST depression suggests hypocalcemia or certain medication effects. The RPN must report this finding immediately and anticipate orders for calcium gluconate (cardiac membrane stabilizer), regular insulin with dextrose (shifts potassium intracellularly), sodium bicarbonate, and possibly sodium polystyrene sulfonate (Kayexalate) to bind potassium in the GI tract.",
      clinicalPearl: "Tall, peaked T waves are the earliest and most reliable ECG indicator of hyperkalemia; cardiac monitoring is essential when K+ exceeds 5.5 mmol/L",
      examStrategy: "Remember: hyperKalemia = tall/peaked T waves (K goes up, T waves go up); hypoKalemia = flat T waves and U waves (K goes down, T waves go down)",
      clinicalTrap: "Do not confuse hyperkalemia ECG changes (peaked T waves) with hypokalemia ECG changes (flat T waves, U waves)",
      distractorRationales: {
        A: "Flattened T waves and U waves are characteristic of hypokalemia (low potassium), not hyperkalemia",
        C: "Prolonged QT and ST depression are more consistent with hypocalcemia or medication effects, not hyperkalemia",
        D: "Normal sinus rhythm with PACs would not be expected with a potassium of 6.2 mmol/L; significant ECG changes occur at this level",
      },
      tags: ["fluid-electrolytes", "hyperkalemia", "CKD", "ECG", "lab-interpretation"],
      questionFormat: "lab-interpretation",
      scenario: "CKD stage 4 patient with hyperkalemia (K+ 6.2 mmol/L) showing neuromuscular symptoms",
    },
    {
      topic: "Vital Signs Assessment",
      subtopic: "Blood Pressure Measurement",
      stem: "An RPN is measuring the blood pressure of a 68-year-old patient with a history of peripheral vascular disease. The patient's arm circumference measures 38 cm. The initial reading using a standard adult cuff shows 162/94 mmHg. What should the RPN consider regarding the accuracy of this reading?",
      options: [
        { label: "A", text: "The reading is accurate; document it and report the hypertension to the physician" },
        { label: "B", text: "A cuff that is too small for the arm circumference may produce a falsely elevated reading; a large adult cuff should be used" },
        { label: "C", text: "The reading is likely falsely low due to atherosclerotic vessels; add 10 mmHg to the systolic reading" },
        { label: "D", text: "Wait 5 minutes and retake using the same cuff on the opposite arm; one reading is insufficient" },
      ],
      correctAnswer: ["B"],
      rationale: "Accurate blood pressure measurement requires the use of an appropriately sized cuff. The bladder of the cuff should encircle at least 80% of the patient's upper arm circumference. A standard adult blood pressure cuff is designed for arm circumferences of approximately 27-34 cm. With an arm circumference of 38 cm, this patient requires a large adult cuff (designed for arm circumferences of 35-44 cm). Using a cuff that is too small results in a falsely elevated blood pressure reading because the smaller bladder cannot adequately compress the brachial artery, requiring higher cuff pressure to occlude blood flow. Conversely, a cuff that is too large may produce a falsely low reading. This is a significant clinical concern because an inaccurate reading could lead to unnecessary treatment for hypertension or inappropriate medication adjustments. The Canadian Hypertension Education Program (CHEP) guidelines emphasize proper cuff sizing as a key component of accurate blood pressure measurement. While repeating the measurement is good practice, it will not correct the fundamental error of using an incorrectly sized cuff. The reading should be repeated with the appropriate large adult cuff, with the patient seated, back supported, feet flat on the floor, and after 5 minutes of rest.",
      clinicalPearl: "Cuff bladder should encircle at least 80% of arm circumference; too-small cuff = falsely high reading, too-large cuff = falsely low reading",
      examStrategy: "If the question describes a large arm circumference with an elevated BP reading, always consider cuff size as the first factor affecting accuracy",
      clinicalTrap: "A too-small cuff gives falsely HIGH readings (not low); this is the most common source of measurement error in obese patients",
      distractorRationales: {
        A: "Documenting and reporting without verifying cuff size accuracy could lead to inappropriate treatment based on a falsely elevated reading",
        C: "There is no standard practice of adding a correction factor to blood pressure readings; the solution is proper cuff sizing",
        D: "While repeating the measurement is reasonable, it will not correct the error caused by using an inappropriately sized cuff",
      },
      tags: ["vital-signs", "blood-pressure", "measurement-accuracy", "cuff-sizing", "hypertension"],
      questionFormat: "MCQ",
      scenario: "68-year-old patient with PVD and arm circumference 38 cm being assessed for blood pressure accuracy",
    },
    {
      topic: "Wound Care",
      subtopic: "Pressure Injury Prevention",
      stem: "An RPN is assessing a bedbound 76-year-old patient who was admitted with a stroke 5 days ago. The patient has a Braden Scale score of 12. During repositioning, the RPN notes a 3 cm x 2 cm area on the patient's sacrum that is intact but has a non-blanchable deep red-purple discolouration. What stage is this pressure injury, and what is the priority nursing intervention?",
      options: [
        { label: "A", text: "Stage 1 pressure injury; reposition the patient every 2 hours and apply a moisture barrier cream" },
        { label: "B", text: "Stage 2 pressure injury; apply a hydrocolloid dressing to the area" },
        { label: "C", text: "Deep tissue pressure injury (DTPI); offload pressure from the sacrum immediately and notify the wound care team" },
        { label: "D", text: "Unstageable pressure injury; debride the area to assess the wound bed" },
      ],
      correctAnswer: ["C"],
      rationale: "The description of intact skin with non-blanchable deep red-purple discolouration is consistent with a Deep Tissue Pressure Injury (DTPI), as defined by the National Pressure Injury Advisory Panel (NPIAP). DTPI indicates damage to underlying soft tissue from pressure and/or shear, where the injury may have originated at the bone-tissue interface. The deep red-purple discolouration represents blood that has extravasated into the tissues due to sustained pressure on the microvascular system. This differs from a Stage 1 pressure injury, which presents as non-blanchable erythema (redness) that is typically lighter in colour without the deep purple hue. The Braden Scale score of 12 indicates high risk for pressure injury development (scores of 15-18 = mild risk, 13-14 = moderate risk, 10-12 = high risk, ≤9 = very high risk). The priority intervention is to immediately offload pressure from the sacrum by repositioning the patient (30-degree lateral position is preferred to completely relieve sacral pressure) and to notify the wound care team, as DTPI can rapidly evolve into full-thickness tissue loss. Additional interventions include implementing a comprehensive pressure redistribution mattress, establishing a turning schedule, optimizing nutrition (protein intake 1.25-1.5 g/kg/day), and maintaining skin moisture management. Stage 2 involves partial-thickness skin loss with exposed dermis. An unstageable injury has obscured wound bed covered by slough or eschar.",
      clinicalPearl: "DTPI appears as intact skin with deep red-purple discolouration; it can rapidly progress to Stage 3 or 4 within days; immediate offloading is critical",
      examStrategy: "Deep purple/maroon intact skin = DTPI (not Stage 1); Stage 1 = non-blanchable redness/erythema without the deep purple hue",
      clinicalTrap: "Non-blanchable deep purple discolouration is DTPI, not Stage 1; Stage 1 is non-blanchable erythema (redness) without deep tissue damage",
      distractorRationales: {
        A: "Stage 1 presents as non-blanchable erythema; the deep red-purple discolouration indicates deeper tissue damage characteristic of DTPI",
        B: "Stage 2 involves partial-thickness skin loss with exposed dermis; this injury has intact skin with deep tissue damage",
        D: "Unstageable injuries have obscured wound beds covered by slough or eschar; this area has intact skin with visible deep discolouration",
      },
      tags: ["wound-care", "pressure-injury", "DTPI", "Braden-scale", "prevention", "geriatric"],
      questionFormat: "scenario-based",
      scenario: "Bedbound 76-year-old stroke patient with Braden Scale 12 and sacral deep red-purple discolouration",
    },
    {
      topic: "Pain Management",
      subtopic: "Opioid Safety Monitoring",
      stem: "An RPN is caring for a 72-year-old postoperative patient who received hydromorphone 1 mg IV 45 minutes ago for severe incisional pain. The patient now rates the pain as 3/10 but has a respiratory rate of 8 breaths/min, oxygen saturation of 89%, and is difficult to arouse. Place the following nursing actions in order of priority.",
      options: [
        { label: "A", text: "Administer naloxone (Narcan) 0.04 mg IV as ordered PRN for respiratory depression" },
        { label: "B", text: "Stimulate the patient by calling their name loudly and performing a sternal rub" },
        { label: "C", text: "Stop any further opioid administration and document the adverse reaction" },
        { label: "D", text: "Position the patient in a semi-Fowler's position and apply supplemental oxygen" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is exhibiting signs of opioid-induced respiratory depression (OIRD): respiratory rate of 8 (below the critical threshold of 12 breaths/min), oxygen saturation of 89% (below 95%), and excessive sedation (difficult to arouse). The Pasero Opioid-Induced Sedation Scale (POSS) would classify this as Level S (somnolent, minimal or no response to stimulation). The priority sequence is: (1) STIMULATE the patient immediately (sternal rub, verbal stimulation) while calling for help, as this may be sufficient to increase respiratory drive in mild-to-moderate respiratory depression. (2) Position and oxygenate (semi-Fowler's, apply O2 via nasal cannula or mask). (3) Administer naloxone if stimulation is ineffective, starting at the lowest effective dose (0.04-0.1 mg IV) to reverse respiratory depression without completely reversing analgesia. Titrate every 2-3 minutes as needed. (4) Stop further opioid administration and document. However, the question asks for the PRIORITY action, which is stimulating the patient first (option B), as this is the immediate, non-pharmacological intervention that can be performed instantly without waiting for medication preparation. This follows the ABC (Airway, Breathing, Circulation) framework where establishing the patient's responsiveness and stimulating breathing is the first step. All subsequent interventions follow in rapid succession but stimulation comes first.",
      clinicalPearl: "OIRD triad: RR <12, SpO2 <95%, and excessive sedation; stimulate first, then position/oxygenate, then consider naloxone",
      examStrategy: "For prioritization questions about opioid respiratory depression, stimulation comes before naloxone because it is immediate and non-pharmacological",
      clinicalTrap: "Naloxone is not always the first action; stimulation may be sufficient and avoids the risk of precipitating severe pain, vomiting, and cardiac arrhythmias from naloxone",
      distractorRationales: {
        A: "Naloxone may be needed but is not the first action; stimulation should be attempted first as it is immediate and may be sufficient",
        C: "Stopping opioids and documenting are important but not the priority when the patient has life-threatening respiratory depression",
        D: "Positioning and oxygen are important concurrent actions but stimulation to increase respiratory drive is the immediate priority",
      },
      tags: ["pain-management", "opioid-safety", "respiratory-depression", "naloxone", "prioritization"],
      questionFormat: "prioritization",
      scenario: "72-year-old postoperative patient with opioid-induced respiratory depression after IV hydromorphone",
    },
    {
      topic: "Delegation & Scope",
      subtopic: "RPN Scope of Practice",
      stem: "An RPN is working on a medical-surgical unit with an RN and a personal support worker (PSW). The unit has 12 patients. The charge nurse asks the RPN to assign tasks for the shift. Which task is within the RPN's scope of practice to perform independently?",
      options: [
        { label: "A", text: "Initiating a blood transfusion for a patient with hemoglobin of 68 g/L" },
        { label: "B", text: "Administering oral medications and documenting the patient's response" },
        { label: "C", text: "Performing the initial comprehensive assessment on a newly admitted patient" },
        { label: "D", text: "Titrating an IV heparin drip based on aPTT results" },
      ],
      correctAnswer: ["B"],
      rationale: "Within the RPN scope of practice in Canada, as defined by the College of Nurses of Ontario (CNO) and other provincial regulatory bodies, RPNs are authorized to administer medications (oral, subcutaneous, intramuscular, and in some cases intravenous) as ordered by an authorized prescriber and to document the patient's response to those medications. This is a core competency of the RPN role. Initiating a blood transfusion (option A) is typically outside the RPN scope of practice in most Canadian provinces, as it requires specialized assessment skills and management of potential transfusion reactions that fall within the RN's scope. The hemoglobin of 68 g/L (SI units, equivalent to approximately 6.8 g/dL) indicates severe anemia requiring transfusion, but the initiation and monitoring of blood products is an RN responsibility. Performing the initial comprehensive assessment on a newly admitted patient (option C) is an RN responsibility, as the RPN may contribute to the ongoing assessment but the initial admission assessment requires the broader scope of the RN. Titrating IV heparin (option D) is a high-risk, high-complexity medication that requires continuous monitoring of coagulation parameters and falls outside the RPN scope due to the critical nature of anticoagulation therapy. The RPN should delegate appropriate tasks to the PSW (vital signs, bathing, feeding, mobility) while focusing on medication administration, wound care, and focused assessments within their scope.",
      clinicalPearl: "RPNs in Canada can administer medications as ordered but cannot independently initiate blood transfusions, titrate high-alert medications, or perform initial comprehensive admission assessments",
      examStrategy: "For delegation questions, identify tasks that are within the scope of the specific nursing role; RPNs perform assigned tasks under the direction of the care plan, while RNs manage complex and high-risk interventions",
      clinicalTrap: "RPNs can administer many medications but NOT titrate high-alert/critical medications like heparin drips, vasopressors, or initiate blood transfusions",
      distractorRationales: {
        A: "Initiating blood transfusions requires RN-level assessment and monitoring skills for potential transfusion reactions",
        C: "Initial comprehensive admission assessments are within the RN scope; RPNs contribute to ongoing focused assessments",
        D: "Titrating IV heparin based on lab values is a high-risk activity requiring continuous RN monitoring and clinical judgment",
      },
      tags: ["delegation", "scope-of-practice", "RPN", "teamwork", "Canadian-nursing"],
      questionFormat: "delegation",
      scenario: "RPN working with an RN and PSW on a 12-patient medical-surgical unit, assigning shift tasks",
    },
    {
      topic: "Perioperative Care",
      subtopic: "Postoperative Assessment",
      stem: "An RPN is caring for a patient in the post-anesthesia care unit (PACU) following a laparoscopic cholecystectomy under general anesthesia. The patient has been in the PACU for 30 minutes. Vital signs: BP 142/88 mmHg, HR 96 bpm, RR 18 breaths/min, SpO2 96% on 2L O2 via nasal cannula, temperature 35.8°C. The patient is shivering and complaining of nausea. Which postoperative complication should the RPN address first?",
      options: [
        { label: "A", text: "Postoperative nausea; administer ondansetron (Zofran) 4 mg IV as ordered" },
        { label: "B", text: "Postoperative hypothermia; apply warm blankets and initiate active warming measures" },
        { label: "C", text: "Postoperative hypertension; hold pain medication and notify the surgeon" },
        { label: "D", text: "Postoperative tachycardia; obtain a 12-lead ECG immediately" },
      ],
      correctAnswer: ["B"],
      rationale: "Postoperative hypothermia (core temperature < 36.0°C) is a common and clinically significant complication following general anesthesia. The temperature of 35.8°C indicates mild hypothermia. Anesthetic agents impair the body's thermoregulatory mechanisms by inhibiting vasoconstriction and shivering responses, while the cool operating room environment and exposure of body surfaces during surgery further contribute to heat loss. Hypothermia must be addressed first because it has cascading physiological effects: it triggers shivering (which increases oxygen consumption by 200-500%, placing stress on the cardiovascular system), impairs coagulation (increasing bleeding risk), delays wound healing, increases the risk of surgical site infection, prolongs the effects of anesthetic agents and muscle relaxants, and can cause cardiac arrhythmias. The shivering explains the elevated heart rate (96 bpm) and mildly elevated blood pressure (142/88), as shivering increases sympathetic tone and metabolic demand. Addressing the hypothermia with warm blankets and active warming measures (forced-air warming blankets such as Bair Hugger, warm IV fluids) will likely resolve the tachycardia and hypertension as compensatory responses diminish. The nausea should be addressed after warming, and antiemetics can be administered concurrently. The BP and HR are likely secondary to the shivering/hypothermia response rather than primary complications.",
      clinicalPearl: "Postoperative hypothermia causes a cascade: shivering increases O2 consumption 200-500%, which drives tachycardia and hypertension; treating the hypothermia often resolves the other vital sign abnormalities",
      examStrategy: "When multiple postoperative findings are present, identify which is the root cause; hypothermia with shivering often drives secondary tachycardia and hypertension",
      clinicalTrap: "The elevated HR and BP are compensatory responses to hypothermia-induced shivering, not primary cardiovascular complications",
      distractorRationales: {
        A: "While nausea should be treated, hypothermia has more significant physiological consequences and is driving other abnormal findings",
        C: "The mild hypertension is likely a compensatory response to shivering/hypothermia, not a primary complication requiring surgical notification",
        D: "The tachycardia is sinus in origin, driven by shivering and increased metabolic demand; an ECG is not the priority over warming",
      },
      tags: ["perioperative", "PACU", "hypothermia", "postoperative-complications", "thermoregulation"],
      questionFormat: "scenario-based",
      scenario: "Post-laparoscopic cholecystectomy patient in PACU with hypothermia 35.8°C, shivering, and nausea",
    },
    {
      topic: "Maternal-Newborn",
      subtopic: "Postpartum Assessment",
      stem: "An RPN is caring for a patient who is 6 hours postpartum after a vaginal delivery. The patient reports feeling dizzy when she stands. Assessment findings: fundus is boggy and displaced to the right, lochia is heavy with large clots, HR 110 bpm, BP 98/58 mmHg. What is the RPN's priority action?",
      options: [
        { label: "A", text: "Encourage the patient to void and then reassess the fundus" },
        { label: "B", text: "Massage the fundus firmly until it becomes firm, and monitor vital signs" },
        { label: "C", text: "Administer oxytocin (Pitocin) 10 units IM immediately" },
        { label: "D", text: "Position the patient flat and elevate the legs for orthostatic hypotension" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is exhibiting signs of postpartum hemorrhage (PPH) due to uterine atony, the most common cause of PPH (accounting for 70-80% of cases). The clinical findings are classic: boggy (soft, non-contracted) uterus displaced to the right (suggesting a full bladder is also present but the immediate concern is atony), heavy lochia with large clots, tachycardia (HR 110), and hypotension (BP 98/58). The priority nursing action is fundal massage, which is a critical first-line intervention that the RPN can perform immediately without waiting for medication orders. Fundal massage stimulates uterine contraction by triggering the release of endogenous prostaglandins and promoting the clamping down of uterine blood vessels (the 'living ligature' of the myometrium). The technique involves placing one hand on the lower uterine segment for support and using the other hand to massage the fundus with a firm, circular motion until it becomes firm and contracted. While massage is being performed, the RPN should also call for help, prepare for oxytocin administration (which requires a physician's order), monitor blood loss, start or increase IV fluids, and prepare for possible blood type and crossmatch. Encouraging voiding (option A) addresses the bladder displacement but is not the priority when active hemorrhage is occurring. Oxytocin (option C) requires a physician's order and takes time to prepare; fundal massage is an immediate nursing intervention. Positioning (option D) does not address the cause of the hemorrhage.",
      clinicalPearl: "Uterine atony accounts for 70-80% of postpartum hemorrhage; fundal massage is the immediate first-line nursing intervention before pharmacological agents",
      examStrategy: "For postpartum hemorrhage questions, the priority is always fundal massage first (immediate nursing action), then pharmacological interventions (require orders)",
      clinicalTrap: "While a full bladder (fundus displaced to right) contributes to atony, addressing the active hemorrhage through fundal massage takes priority over bladder emptying",
      distractorRationales: {
        A: "Voiding will help but is not the priority when active hemorrhage with hemodynamic instability is present; fundal massage addresses the bleeding directly",
        C: "Oxytocin is appropriate but requires a physician's order; fundal massage is an independent nursing intervention that can be performed immediately",
        D: "Positioning does not address the cause of hemorrhage (uterine atony); the priority is to promote uterine contraction",
      },
      tags: ["maternal-newborn", "postpartum", "hemorrhage", "uterine-atony", "fundal-massage", "emergency"],
      questionFormat: "prioritization",
      scenario: "6-hour postpartum patient with signs of postpartum hemorrhage: boggy fundus, heavy lochia, tachycardia, hypotension",
    },
    {
      topic: "Geriatric Care",
      subtopic: "Delirium vs Dementia",
      stem: "An RPN is caring for an 84-year-old patient admitted 2 days ago for a urinary tract infection. The family reports the patient was 'perfectly fine at home' but is now confused, agitated, and not recognizing family members. The confusion seems worse at night. The patient has a temperature of 38.2°C, urine is cloudy and malodorous. Which assessment finding best differentiates delirium from dementia?",
      options: [
        { label: "A", text: "The confusion has been progressive over the past several years" },
        { label: "B", text: "The confusion has an acute onset and fluctuating course related to the infection" },
        { label: "C", text: "The patient has difficulty with word-finding and abstract thinking" },
        { label: "D", text: "The patient's sleep-wake cycle has always been disrupted" },
      ],
      correctAnswer: ["B"],
      rationale: "Differentiating delirium from dementia is a critical nursing assessment skill, especially in the geriatric population where the two conditions can coexist. The key differentiating feature in this scenario is the ACUTE onset and FLUCTUATING course of the confusion. Delirium is characterized by: (1) acute onset (hours to days), (2) fluctuating course (symptoms wax and wane throughout the day, often worse at night - called 'sundowning'), (3) an identifiable precipitating cause (in this case, UTI with fever), (4) altered level of consciousness (ranges from hyperactive/agitated to hypoactive/lethargic), (5) impaired attention (the hallmark feature), and (6) reversibility with treatment of the underlying cause. Dementia, in contrast, has: (1) insidious, gradual onset (months to years), (2) progressive, generally stable course without significant fluctuation, (3) no specific precipitating event, (4) preserved consciousness until late stages, (5) memory impairment as the hallmark feature, and (6) irreversible progression. The family's report that the patient was 'perfectly fine at home' strongly suggests this is delirium superimposed on normal cognition, triggered by the UTI. The Confusion Assessment Method (CAM) is the gold-standard screening tool for delirium and assesses: acute onset with fluctuating course, inattention, disorganized thinking, and altered level of consciousness. Treatment focuses on resolving the underlying cause (antibiotics for UTI) while maintaining patient safety.",
      clinicalPearl: "Delirium = acute onset, fluctuating, reversible, has a CAUSE; Dementia = gradual onset, progressive, irreversible, no acute cause",
      examStrategy: "The word 'acute' in the description of onset is the most reliable differentiator; also look for an identifiable precipitating factor (infection, medication, metabolic disturbance)",
      clinicalTrap: "Sundowning occurs in BOTH delirium and dementia; it alone does not differentiate the two conditions",
      distractorRationales: {
        A: "Progressive confusion over years describes dementia's gradual onset, not the acute presentation in this scenario",
        C: "Word-finding difficulties and abstract thinking impairment can occur in both delirium and dementia and are not differentiating features",
        D: "Sleep-wake cycle disruption can occur in both conditions; in delirium it has an acute onset coinciding with the illness",
      },
      tags: ["geriatric", "delirium", "dementia", "UTI", "confusion", "cognitive-assessment"],
      questionFormat: "MCQ",
      scenario: "84-year-old admitted for UTI with acute onset confusion, agitation, and sundowning behaviour",
    },
    {
      topic: "Mental Health Basics",
      subtopic: "Suicide Risk Assessment",
      stem: "An RPN is caring for a patient admitted to the mental health unit who states, 'I've been thinking about ending it all. I have a plan and I know exactly what I would do.' The patient appears calm and has been cooperative with care. What is the RPN's immediate priority action?",
      options: [
        { label: "A", text: "Document the statement in the patient's chart and continue with routine assessments" },
        { label: "B", text: "Initiate one-to-one continuous observation, remove all potential means of self-harm, and notify the RN and physician immediately" },
        { label: "C", text: "Ask the patient to sign a no-harm contract to ensure their safety" },
        { label: "D", text: "Provide reassurance that things will get better and encourage the patient to rest" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is expressing active suicidal ideation with a specific plan, which places them at HIGH immediate risk for suicide. The presence of a plan (beyond vague thoughts of death) significantly elevates the risk level. The patient's calm demeanour should NOT be interpreted as a lower risk indicator; in fact, a patient who has made a definitive decision about suicide may appear calm and resolute because the internal conflict has been resolved. This is sometimes referred to as 'the calm before the storm' and should increase clinical vigilance, not decrease it. The RPN's immediate priority is patient safety: (1) Initiate continuous one-to-one observation (constant visual monitoring within arm's reach), (2) Remove all potential means of self-harm from the environment (sharps, cords, belts, medications, plastic bags), (3) Immediately notify the RN and physician for urgent psychiatric evaluation, and (4) Document the patient's exact words in quotation marks. No-harm contracts (option C) have been shown in research to be ineffective in preventing suicide and provide a false sense of security; they are no longer recommended in evidence-based practice. Simply documenting without taking protective action (option A) fails to address the immediate safety concern. Providing generic reassurance (option D) minimizes the patient's distress and does not ensure safety. The RPN should use therapeutic communication, acknowledging the patient's feelings while maintaining safety: 'I hear you and I want to keep you safe. I'm going to stay with you while we get you the help you need.'",
      clinicalPearl: "A calm demeanour in a suicidal patient who has expressed a specific plan may indicate they have made a decision; this should INCREASE vigilance, not decrease it",
      examStrategy: "For suicide assessment questions, the answer that prioritizes immediate safety (observation, means restriction, notification) is almost always correct; no-harm contracts are ineffective",
      clinicalTrap: "No-harm contracts are NOT evidence-based and should not be relied upon for suicide prevention; they provide a false sense of security",
      distractorRationales: {
        A: "Documentation alone is insufficient when a patient expresses suicidal ideation with a plan; immediate safety interventions are required",
        C: "No-harm contracts are not evidence-based and have been shown to be ineffective in preventing suicide; they should not replace active safety measures",
        D: "Generic reassurance minimizes the patient's experience and does not address the immediate safety concern; it can also damage the therapeutic relationship",
      },
      tags: ["mental-health", "suicide-risk", "safety", "assessment", "therapeutic-communication"],
      questionFormat: "MCQ",
      scenario: "Mental health patient expressing suicidal ideation with a specific plan while appearing calm",
    },
    {
      topic: "Nutrition",
      subtopic: "Dysphagia Management",
      stem: "An RPN is assisting a patient with a history of stroke to eat lunch. The patient has been assessed by the speech-language pathologist (SLP) and placed on a pureed diet with honey-thick liquids. During the meal, the patient begins coughing and the voice sounds wet and gurgly after swallowing. What should the RPN do?",
      options: [
        { label: "A", text: "Encourage the patient to take larger sips of liquid to clear the throat" },
        { label: "B", text: "Stop feeding immediately, position the patient upright at 90 degrees, encourage coughing, and report to the RN" },
        { label: "C", text: "Continue feeding slowly with smaller bites and reassess in 15 minutes" },
        { label: "D", text: "Offer the patient regular thin liquids to wash down the food" },
      ],
      correctAnswer: ["B"],
      rationale: "The patient is exhibiting signs of aspiration: coughing during meals and a wet, gurgly voice quality after swallowing. These are clinical indicators that food or liquid has entered the airway, a serious complication for patients with dysphagia secondary to stroke. The wet, gurgly voice occurs when aspirated material sits on or near the vocal cords, altering voice quality. The RPN must immediately: (1) STOP feeding to prevent further aspiration, (2) Position the patient upright at 90 degrees (or lean slightly forward) to use gravity to help clear the airway, (3) Encourage the patient to cough (if the patient has a productive cough reflex, this helps clear aspirated material), (4) Monitor respiratory status (RR, SpO2, lung sounds), and (5) Report to the RN immediately for further assessment and potential notification of the physician and SLP. Encouraging larger sips (option A) or offering thin liquids (option D) would significantly increase aspiration risk, as the patient is already showing signs of aspiration on honey-thick liquids. Thin liquids are the most commonly aspirated consistency. Continuing to feed with smaller bites (option C) does not address the current aspiration event and puts the patient at risk for further aspiration and potential aspiration pneumonia. The SLP may need to reassess the patient's swallowing function and modify the diet consistency. The RPN should also document the event including the type of food/liquid, the signs observed, interventions taken, and the patient's response.",
      clinicalPearl: "Wet/gurgly voice after swallowing is a key indicator of aspiration; stop feeding immediately and do not offer thinner liquids",
      examStrategy: "Signs of aspiration during feeding = stop feeding immediately; never increase liquid volume or decrease consistency to 'help' - this worsens aspiration risk",
      clinicalTrap: "Offering thin liquids to 'wash down' food is dangerous for dysphagic patients; thin liquids are the most commonly aspirated consistency",
      distractorRationales: {
        A: "Larger sips would increase the volume of liquid entering the already compromised airway; this worsens aspiration risk",
        C: "Continuing feeding when signs of aspiration are present puts the patient at risk for aspiration pneumonia; feeding must stop",
        D: "Thin liquids are the most difficult consistency for dysphagic patients to control and the most commonly aspirated; offering them would dramatically increase aspiration risk",
      },
      tags: ["nutrition", "dysphagia", "aspiration", "stroke", "feeding-safety", "SLP"],
      questionFormat: "MCQ",
      scenario: "Post-stroke patient on pureed diet showing signs of aspiration during assisted feeding",
    },
    {
      topic: "Elimination",
      subtopic: "Urinary Catheter Care",
      stem: "An RPN is performing routine care for a patient with an indwelling urinary catheter (Foley catheter). The urine output has been 15 mL over the past 2 hours. The patient's blood pressure is 108/72 mmHg, heart rate is 88 bpm, and the patient received IV normal saline at 100 mL/hr. What should the RPN assess first?",
      options: [
        { label: "A", text: "Check the catheter tubing for kinks, clamps, or obstructions that may be blocking urine flow" },
        { label: "B", text: "Increase the IV fluid rate to 200 mL/hr to improve urine output" },
        { label: "C", text: "Irrigate the catheter with 30 mL of normal saline to dislodge any clots" },
        { label: "D", text: "Remove the catheter and insert a new one, assuming the current catheter is defective" },
      ],
      correctAnswer: ["A"],
      rationale: "Low urine output (oliguria, defined as < 0.5 mL/kg/hr or approximately < 30 mL/hr for an average adult) in a catheterized patient can be caused by mechanical obstruction or a true decrease in renal perfusion/function. Before assuming a renal cause, the RPN must first rule out mechanical causes by assessing the catheter system for kinks, clamps, or obstructions. This is the most common and easily correctable cause of apparent low urine output in catheterized patients. The assessment should include: (1) Inspect the entire length of tubing from the catheter insertion site to the collection bag for kinks, twists, or compression (e.g., patient lying on the tubing), (2) Ensure the collection bag is positioned below the level of the bladder to facilitate gravity drainage, (3) Check that any clamps are open, (4) Assess the catheter for sediment or blood clots that may be obstructing flow, (5) Verify the balloon is properly inflated and the catheter is correctly positioned. Increasing the IV rate (option B) is a medical order modification that the RPN cannot independently adjust and does not address a potential mechanical obstruction. Catheter irrigation (option C) requires a physician's order in most settings and should be performed only after confirming the indication. Replacing the catheter (option D) is premature without first assessing for a correctable mechanical cause. If the tubing is patent and the output remains low, the RPN should then consider renal causes and report to the RN/physician for further evaluation including bladder scan, renal function tests, and fluid balance review.",
      clinicalPearl: "Always assess for mechanical causes of low urine output in catheterized patients (kinks, clamps, positioning) before assuming renal pathology",
      examStrategy: "For low urine output in catheterized patients, check the catheter system first; the simplest explanation (mechanical obstruction) should be ruled out before complex interventions",
      clinicalTrap: "Do not increase IV fluids or irrigate the catheter before checking for the simplest mechanical cause: kinked or obstructed tubing",
      distractorRationales: {
        B: "Increasing IV rate requires a physician's order and does not address a potential mechanical obstruction causing apparent oliguria",
        C: "Catheter irrigation requires an order and should only be performed after assessing for mechanical obstruction and confirming the indication",
        D: "Replacing the catheter is premature; a simple assessment of the tubing may reveal a correctable mechanical cause",
      },
      tags: ["elimination", "urinary-catheter", "oliguria", "assessment", "troubleshooting"],
      questionFormat: "MCQ",
      scenario: "Catheterized patient with low urine output (15 mL over 2 hours) on IV fluids",
    },
    {
      topic: "Emergency Response",
      subtopic: "Anaphylaxis Management",
      stem: "An RPN is administering IV cefazolin to a patient for surgical prophylaxis. Five minutes after the infusion begins, the patient develops facial flushing, urticaria (hives) on the chest and arms, throat tightness, and audible wheezing. BP drops to 82/50 mmHg from a baseline of 120/74 mmHg. What is the RPN's priority sequence of actions?",
      options: [
        { label: "A", text: "Continue the infusion at a slower rate while monitoring for further symptoms" },
        { label: "B", text: "Stop the infusion immediately, call for emergency assistance, prepare epinephrine for IM administration, and maintain the IV line with normal saline" },
        { label: "C", text: "Administer diphenhydramine (Benadryl) 50 mg IV and continue monitoring" },
        { label: "D", text: "Position the patient in high Fowler's position and apply oxygen via simple face mask" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is experiencing anaphylaxis, a life-threatening systemic hypersensitivity reaction to cefazolin (a cephalosporin antibiotic). The clinical presentation includes multiple systems: integumentary (facial flushing, urticaria), respiratory (throat tightness, wheezing indicating bronchospasm), and cardiovascular (hypotension from vasodilation and increased vascular permeability). Anaphylaxis can progress to cardiovascular collapse and death within minutes if not treated promptly. The priority sequence is: (1) STOP the infusion immediately to prevent further antigen exposure, but do NOT remove the IV access as it is needed for emergency medications and fluid resuscitation, (2) CALL for emergency assistance (code team/rapid response), (3) EPINEPHRINE is the first-line medication for anaphylaxis - it should be administered IM in the mid-outer thigh (vastus lateralis) at a dose of 0.3-0.5 mg of 1:1,000 (1 mg/mL) solution for adults. Epinephrine works as an alpha-1 agonist (vasoconstriction to reverse hypotension), beta-1 agonist (increased cardiac output), and beta-2 agonist (bronchodilation to relieve wheezing and throat tightness), (4) Run IV normal saline wide open for volume expansion, (5) Position the patient supine with legs elevated (Trendelenburg) to support blood pressure unless respiratory distress prevents supine positioning. Secondary medications include diphenhydramine (H1 blocker), ranitidine (H2 blocker), and corticosteroids, but these do NOT replace epinephrine as the first-line treatment. Continuing the infusion at a slower rate (option A) is dangerous and could be fatal. Diphenhydramine alone (option C) is insufficient for anaphylaxis with cardiovascular compromise.",
      clinicalPearl: "Epinephrine IM is ALWAYS the first-line medication for anaphylaxis; diphenhydramine and steroids are adjuncts but do not replace epinephrine",
      examStrategy: "For anaphylaxis questions: stop the allergen, call for help, give epinephrine IM, maintain IV access with NS - this sequence is almost always the correct answer",
      clinicalTrap: "Diphenhydramine is NOT sufficient for anaphylaxis with hypotension and bronchospasm; epinephrine is the only medication that addresses all three systems affected",
      distractorRationales: {
        A: "Continuing the infusion at any rate perpetuates the allergic response and can lead to cardiovascular collapse and death",
        C: "Diphenhydramine treats histamine-mediated symptoms but does not address the life-threatening bronchospasm and hypotension; epinephrine is required",
        D: "While oxygen is important, the priority is stopping the infusion and administering epinephrine; high Fowler's is not the optimal position for anaphylaxis with hypotension",
      },
      tags: ["emergency", "anaphylaxis", "drug-reaction", "epinephrine", "cephalosporin", "life-threatening"],
      questionFormat: "prioritization",
      scenario: "Patient developing anaphylaxis 5 minutes after IV cefazolin infusion with urticaria, bronchospasm, and hypotension",
    },
    {
      topic: "Communication",
      subtopic: "SBAR Communication",
      stem: "An RPN is calling the physician to report a change in a patient's condition. The patient, a 65-year-old with Type 2 diabetes, has developed confusion, diaphoresis, and tremors. The capillary blood glucose is 2.8 mmol/L. Which SBAR communication is most appropriate?",
      options: [
        { label: "A", text: "S: 'Mr. Chen doesn't look right.' B: 'He was fine this morning.' A: 'I think something is wrong.' R: 'Can you come see him?'" },
        { label: "B", text: "S: 'I'm calling about Mr. Chen in room 304 who is hypoglycemic.' B: 'He is a 65-year-old with Type 2 diabetes on metformin and glyburide, last meal was 6 hours ago.' A: 'He has confusion, diaphoresis, tremors, and a blood glucose of 2.8 mmol/L.' R: 'I recommend 15-20 g of fast-acting carbohydrate if he can swallow safely, or D50W IV if he cannot.'" },
        { label: "C", text: "S: 'Room 304 needs help.' B: 'Diabetic patient.' A: 'Low sugar.' R: 'Please order something.'" },
        { label: "D", text: "S: 'Mr. Chen is confused.' B: 'He has many medical conditions.' A: 'His vital signs have changed.' R: 'I need new orders for everything.'" },
      ],
      correctAnswer: ["B"],
      rationale: "SBAR (Situation, Background, Assessment, Recommendation) is the gold-standard structured communication tool used in healthcare to ensure clear, concise, and complete information transfer between providers. Effective SBAR communication reduces medical errors and improves patient outcomes. Option B demonstrates exemplary SBAR technique: SITUATION - clearly identifies the patient (name, room number) and the problem (hypoglycemia); BACKGROUND - provides relevant medical history (Type 2 diabetes), current medications (metformin and glyburide, a sulfonylurea that commonly causes hypoglycemia), and pertinent context (last meal 6 hours ago, explaining the timing of hypoglycemia); ASSESSMENT - states specific clinical findings (confusion, diaphoresis, tremors) with objective data (blood glucose 2.8 mmol/L, which is critically low); RECOMMENDATION - suggests appropriate interventions based on clinical guidelines (15-20 g fast-acting carbohydrate orally if swallowing is safe, or D50W IV if the patient cannot swallow safely). This demonstrates the RPN's clinical knowledge and assists the physician in making timely decisions. Options A, C, and D are vague, lack specific data, and do not demonstrate the RPN's clinical assessment skills. Effective SBAR should always include specific patient identifiers, objective data, and evidence-based recommendations.",
      clinicalPearl: "Include the patient's name, room number, specific vital signs/lab values, relevant medications, and a clear recommendation in every SBAR communication",
      examStrategy: "The best SBAR answer always has: specific patient ID, relevant history/meds, objective data, and a clinical recommendation; vague statements are always wrong",
      clinicalTrap: "Vague SBAR like 'something is wrong' or 'needs help' fails to communicate critical information and can delay treatment",
      distractorRationales: {
        A: "This SBAR is vague and subjective; it lacks specific data, relevant background, and a clinical recommendation",
        C: "This is too brief and lacks patient identification, specific data, relevant history, and an evidence-based recommendation",
        D: "This is non-specific; 'many medical conditions' and 'vital signs have changed' do not provide actionable clinical information",
      },
      tags: ["communication", "SBAR", "teamwork", "patient-safety", "hypoglycemia"],
      questionFormat: "MCQ",
      scenario: "RPN reporting hypoglycemia in a 65-year-old diabetic patient using SBAR framework",
    },
    {
      topic: "Ethics & Legal",
      subtopic: "Informed Consent",
      stem: "An RPN is preparing a patient for a colonoscopy. The patient, who speaks limited English, nods when the physician explains the procedure and signs the consent form. The patient's family member, who is more fluent in English, was not present during the explanation. What should the RPN do?",
      options: [
        { label: "A", text: "Proceed with the preparation since the consent form has been signed" },
        { label: "B", text: "Advocate for the patient by requesting a professional medical interpreter to ensure the patient truly understands the procedure, risks, benefits, and alternatives before proceeding" },
        { label: "C", text: "Call the family member to come and translate the consent information" },
        { label: "D", text: "Use Google Translate on a personal phone to explain the procedure" },
      ],
      correctAnswer: ["B"],
      rationale: "Informed consent is a fundamental ethical and legal principle in healthcare that requires the patient to understand the nature of the procedure, potential risks and benefits, alternative options, and the consequences of refusing the procedure. A signed consent form alone does not constitute valid informed consent if the patient did not truly understand the information provided. For patients with limited English proficiency (LEP), healthcare facilities in Canada are required to provide professional interpreter services to ensure effective communication and true informed consent. The RPN has a professional and ethical obligation to advocate for the patient's right to informed consent by requesting a certified medical interpreter. Using family members as interpreters (option C) is discouraged because they may lack medical terminology knowledge, may filter or modify information based on their own biases, and the patient may not feel comfortable disclosing concerns through a family member. Using technology-based translation tools like Google Translate (option D) is inappropriate for medical consent because these tools may produce inaccurate translations of medical terminology, lack the nuance of face-to-face interpretation, and do not meet the standard for professional medical interpretation. Proceeding without ensuring understanding (option A) violates the patient's right to informed consent and could constitute battery if the procedure is performed without valid consent. The Canadian Nurses Association (CNA) Code of Ethics emphasizes the nurse's responsibility to promote and protect the patient's right to informed decision-making.",
      clinicalPearl: "A signed consent form does NOT equal informed consent; the patient must demonstrate understanding of the procedure, risks, benefits, and alternatives in their preferred language",
      examStrategy: "For consent questions with language barriers, the correct answer always involves professional medical interpreters, not family members or technology tools",
      clinicalTrap: "Family members should NOT be used as medical interpreters due to bias, lack of medical vocabulary, and patient privacy concerns",
      distractorRationales: {
        A: "A signed form without demonstrated understanding does not constitute valid informed consent; proceeding could be legally and ethically problematic",
        C: "Family members are not recommended as medical interpreters due to potential bias, lack of medical vocabulary, and privacy concerns",
        D: "Technology translation tools are not appropriate for medical consent due to accuracy limitations and inability to assess patient understanding",
      },
      tags: ["ethics", "legal", "informed-consent", "language-barrier", "advocacy", "interpreter"],
      questionFormat: "MCQ",
      scenario: "Limited English proficiency patient who signed a colonoscopy consent form without clear evidence of understanding",
    },
    {
      topic: "Documentation",
      subtopic: "Documentation Principles",
      stem: "An RPN discovers that she administered metoprolol 50 mg to Patient A instead of Patient B at 0800. Patient A is not prescribed metoprolol. Patient A's vital signs after the error: HR 58 bpm, BP 104/62 mmHg. What is the correct sequence of actions?",
      options: [
        { label: "A", text: "Quietly document the error in Patient A's chart without reporting it, since the patient appears stable" },
        { label: "B", text: "Assess Patient A immediately, notify the physician and charge nurse, complete an incident report, and monitor the patient closely for adverse effects" },
        { label: "C", text: "Ask a colleague to document the medication as given to Patient B to correct the medication administration record" },
        { label: "D", text: "Administer the medication to the correct patient (Patient B) and document it as given at the correct time to both patients" },
      ],
      correctAnswer: ["B"],
      rationale: "Medication errors are reportable events that require immediate action to ensure patient safety and transparency. The correct response follows the facility's medication error protocol and professional standards: (1) ASSESS the patient immediately - Patient A now has a beta-blocker (metoprolol) on board that was not prescribed, and the vital signs show bradycardia (HR 58, which is below normal for an unmedicated patient but is an expected effect of metoprolol) and relative hypotension (BP 104/62). The patient needs continuous monitoring for worsening bradycardia, hypotension, bronchospasm (if history of asthma/COPD), and other beta-blocker side effects. (2) NOTIFY the physician to assess the patient, potentially order cardiac monitoring, and provide any necessary treatment. Also notify the charge nurse/supervisor. (3) COMPLETE an incident/safety report per facility policy - this is a non-punitive reporting mechanism designed to identify system issues and prevent future errors. The report should include factual, objective information about the event. (4) MONITOR the patient closely - metoprolol has a half-life of approximately 3-7 hours, so monitoring should continue for at least that duration. (5) DOCUMENT accurately in the patient's chart what occurred, when it occurred, and what actions were taken. Concealing the error (option A) violates ethical and legal obligations. Falsifying records (option C) is a serious professional misconduct that can result in disciplinary action and license revocation. Administering the medication to Patient B without addressing the error in Patient A (option D) does not address the immediate safety concern.",
      clinicalPearl: "Medication errors must always be reported through incident reporting systems; concealment violates professional ethics and prevents system learning to prevent future errors",
      examStrategy: "The correct response to any medication error is: assess the patient, notify the physician, complete an incident report, and monitor; never conceal or falsify records",
      clinicalTrap: "Never concealing or 'correcting' a medication error by falsifying documentation; this constitutes professional misconduct and can result in license revocation",
      distractorRationales: {
        A: "Concealing a medication error is unethical and a violation of professional standards regardless of the patient's current stability",
        C: "Falsifying medication records is professional misconduct that can result in disciplinary action, criminal charges, and license revocation",
        D: "This approach fails to address the immediate safety concern for Patient A and compounds the error with additional unsafe practice",
      },
      tags: ["documentation", "medication-error", "patient-safety", "incident-report", "ethics"],
      questionFormat: "MCQ",
      scenario: "RPN who administered metoprolol to the wrong patient, discovering the error post-administration",
    },
    {
      topic: "Pediatric Nursing",
      subtopic: "Growth and Development",
      stem: "An RPN is assessing a 9-month-old infant during a well-baby visit. Which developmental milestones should the RPN expect this infant to demonstrate? (Select all that apply.)",
      options: [
        { label: "A", text: "Sits independently without support" },
        { label: "B", text: "Walks independently without assistance" },
        { label: "C", text: "Uses pincer grasp to pick up small objects" },
        { label: "D", text: "Says 'mama' and 'dada' non-specifically" },
        { label: "E", text: "Transfers objects from one hand to the other" },
        { label: "F", text: "Speaks in 2-3 word sentences" },
      ],
      correctAnswer: ["A", "C", "D", "E"],
      rationale: "Developmental milestones at 9 months of age span four domains: gross motor, fine motor, language, and social-emotional. At 9 months, the infant should demonstrate: GROSS MOTOR - sits independently without support (achieved at 6-7 months and well-established by 9 months), may pull to stand with support, and may begin cruising along furniture. Independent walking (option B) typically occurs at 12-15 months and would not be expected at 9 months. FINE MOTOR - pincer grasp (using thumb and index finger to pick up small objects) emerges at 8-10 months and should be developing at 9 months. Object transfer from hand to hand (option E) is typically achieved at 6-7 months and well-established by 9 months. LANGUAGE - at 9 months, infants babble with consonant-vowel combinations and may say 'mama' and 'dada' non-specifically (not yet associating the words with specific people). Speaking in 2-3 word sentences (option F) is a milestone for 18-24 months and would not be expected at 9 months. SOCIAL-EMOTIONAL - stranger anxiety typically emerges at 6-8 months and is well-developed by 9 months; the infant may show separation anxiety and have object permanence. The RPN should use a standardized developmental screening tool (such as the Nipissing District Developmental Screen in Ontario or the ASQ-3) to formally assess developmental progress and identify any potential delays requiring referral.",
      clinicalPearl: "9-month milestones: sits independently, pincer grasp emerging, transfers objects, babbles mama/dada non-specifically, stranger anxiety present",
      examStrategy: "Learn milestone clusters by age: 6 mo = sits with support, 9 mo = sits independently + pincer, 12 mo = walks + first words, 18 mo = walks up stairs + 10 words",
      clinicalTrap: "Independent walking is a 12-15 month milestone, NOT 9 months; 2-3 word sentences are 18-24 months",
      distractorRationales: {
        B: "Independent walking typically occurs at 12-15 months; expecting this at 9 months would create unnecessary parental concern",
        F: "2-3 word sentences are an 18-24 month language milestone; at 9 months, infants babble and may say mama/dada non-specifically",
      },
      tags: ["pediatric", "growth-development", "milestones", "infant", "assessment"],
      questionFormat: "SATA",
      scenario: "9-month-old infant at a well-baby visit being assessed for age-appropriate developmental milestones",
    },
    {
      topic: "Fundamentals of Nursing",
      subtopic: "Body Mechanics and Patient Transfers",
      stem: "An RPN is preparing to transfer a patient from the bed to a wheelchair. The patient had a right-sided stroke 3 days ago and has left-sided hemiplegia. The patient can bear partial weight on the right leg. Which technique demonstrates proper body mechanics and safe transfer?",
      options: [
        { label: "A", text: "Position the wheelchair on the patient's left (affected) side and assist the patient to pivot on the left leg" },
        { label: "B", text: "Position the wheelchair on the patient's right (unaffected) side and assist the patient to pivot on the strong right leg toward the wheelchair" },
        { label: "C", text: "Use a mechanical lift for all transfers regardless of the patient's ability to bear weight" },
        { label: "D", text: "Position the wheelchair directly in front of the patient and have the patient stand and turn 180 degrees" },
      ],
      correctAnswer: ["B"],
      rationale: "When transferring a patient with hemiplegia (one-sided weakness/paralysis), the wheelchair should be positioned on the patient's UNAFFECTED (strong) side. In this case, the patient has a right-sided stroke causing LEFT-sided hemiplegia, meaning the RIGHT side is the strong side. The wheelchair should be positioned on the patient's right so that the patient can: (1) use the strong right arm to push up from the bed, (2) pivot on the strong right leg (which can bear partial weight), and (3) reach for the wheelchair armrest with the strong right hand for stability during the transfer. This maximizes patient independence and safety while minimizing injury risk for both patient and nurse. Positioning the wheelchair on the affected left side (option A) would require the patient to pivot on the weak/paralyzed left leg, which cannot bear weight and significantly increases fall risk. A mechanical lift (option C) is not indicated when the patient can bear partial weight; using a lift unnecessarily reduces patient independence and is not an efficient use of equipment. Turning 180 degrees (option D) is an unnecessarily complex maneuver that increases the risk of loss of balance and fall. Proper body mechanics for the RPN include: wide base of support, knees bent, back straight, core engaged, and using leg muscles rather than back muscles. A gait belt should be applied around the patient's waist for a secure handhold during the transfer.",
      clinicalPearl: "Lead with the strong side: wheelchair on the UNAFFECTED side, patient pivots on the STRONG leg; remember 'the good leads the way'",
      examStrategy: "For stroke/hemiplegia transfers: identify the affected vs unaffected side first, then position equipment on the STRONG (unaffected) side",
      clinicalTrap: "Right-sided stroke = LEFT hemiplegia (contralateral); the RIGHT side is the strong side for transfers",
      distractorRationales: {
        A: "Positioning on the affected side requires pivoting on the weak leg, which cannot safely bear weight and increases fall risk",
        C: "Mechanical lifts are reserved for patients who cannot bear any weight; using them unnecessarily reduces patient independence",
        D: "A 180-degree turn is complex and dangerous; positioning the wheelchair at the bedside on the strong side requires only a minimal pivot",
      },
      tags: ["fundamentals", "body-mechanics", "transfer", "stroke", "hemiplegia", "patient-safety"],
      questionFormat: "MCQ",
      scenario: "Transferring a right-sided stroke patient with left hemiplegia from bed to wheelchair",
    },
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const difficulty = s.questionFormat === "SATA" ? 3 : (i % 5 === 0 ? 4 : i % 3 === 0 ? 2 : 3);
    const domain = assignBlueprintDomain(s.topic, RPN_BLUEPRINT_DOMAINS);
    questions.push({
      tier,
      exam,
      questionType: s.questionFormat,
      status: "published",
      stem: s.stem,
      options: JSON.stringify(s.options),
      correctAnswer: JSON.stringify(s.correctAnswer),
      rationale: s.rationale,
      difficulty,
      tags: s.tags,
      bodySystem: domain,
      topic: s.topic,
      subtopic: s.subtopic,
      regionScope,
      stemHash: stemHash(s.stem),
      scenario: s.scenario,
      clinicalPearl: s.clinicalPearl,
      examStrategy: s.examStrategy,
      clinicalTrap: s.clinicalTrap,
      distractorRationales: JSON.stringify(s.distractorRationales),
      cognitiveLevel: assignCognitiveLevel(difficulty),
      questionFormat: s.questionFormat,
      careerType: "nursing",
      blueprintDomain: domain,
    });
  }

  return questions;
}

function generateTopicVariations(baseTopic: string, exam: string, tier: string, regionScope: string, count: number): QuestionRecord[] {
  const questions: QuestionRecord[] = [];
  const domains = tier === "rpn" ? RPN_BLUEPRINT_DOMAINS : RN_BLUEPRINT_DOMAINS;

  const topicTemplates: Record<string, Array<{
    stemTemplate: (ctx: any) => string;
    optionsTemplate?: (ctx: any) => { label: string; text: string }[];
    options?: { label: string; text: string }[];
    correctAnswer: string[];
    rationaleTemplate: (ctx: any) => string;
    clinicalPearl: string;
    examStrategy: string;
    clinicalTrap: string;
    distractorRationales: Record<string, string>;
    subtopic: string;
    tags: string[];
    format: string;
  }>> = {
    "Infection Control": [
      {
        stemTemplate: (ctx) => `A nurse on the ${ctx.unit} unit is caring for a patient diagnosed with ${ctx.condition}. The patient is ${ctx.age} years old with a history of ${ctx.history}. Which type of isolation precautions should the nurse implement in addition to standard precautions?`,
        options: [
          { label: "A", text: "Contact precautions with gown and gloves" },
          { label: "B", text: "Droplet precautions with surgical mask within 2 metres" },
          { label: "C", text: "Airborne precautions with N95 respirator and negative pressure room" },
          { label: "D", text: "Standard precautions only are sufficient for this condition" },
        ],
        correctAnswer: ["C"],
        rationaleTemplate: (ctx) => `${ctx.condition} requires airborne precautions because the pathogen is transmitted via small particle aerosols (< 5 micrometres) that remain suspended in the air for extended periods and can travel long distances through air currents. Airborne precautions require: (1) placement in a negative-pressure airborne infection isolation room (AIIR) with a minimum of 6-12 air changes per hour, (2) healthcare workers must wear a fitted N95 respirator or higher-level respirator before entering the room, (3) the door must remain closed at all times, and (4) the patient must wear a surgical mask during transport outside the room. In Canadian healthcare settings, provincial infection prevention and control (IPAC) guidelines from organizations like Public Health Ontario and PHAC mandate these precautions. Standard precautions (hand hygiene, PPE based on anticipated exposure, respiratory hygiene) are always applied in addition to transmission-based precautions. The nurse must also ensure proper donning and doffing sequence to prevent self-contamination. Key conditions requiring airborne precautions include: pulmonary or laryngeal tuberculosis, measles (rubeola), varicella (chickenpox), and disseminated herpes zoster. Understanding the chain of infection and appropriate precaution levels is essential for preventing nosocomial transmission.`,
        clinicalPearl: "Airborne precautions = N95 + negative pressure room; remember 'My Chicken Has TB' (Measles, Chickenpox, Herpes zoster disseminated, TB)",
        examStrategy: "Memorize the three conditions requiring airborne: TB, measles, varicella/disseminated zoster; everything else is contact or droplet",
        clinicalTrap: "A surgical mask is NOT sufficient for airborne precautions; an N95 respirator is required because surgical masks do not filter small particle aerosols",
        distractorRationales: {
          A: "Contact precautions are for MRSA, C. diff, and other contact-transmitted organisms; not sufficient for airborne pathogens",
          B: "Droplet precautions are for influenza, pertussis, and meningitis; airborne pathogens require N95, not surgical mask",
          D: "Standard precautions alone are insufficient for airborne pathogens; transmission-based precautions must be added",
        },
        subtopic: "Airborne Precautions",
        tags: ["infection-control", "isolation", "airborne", "N95", "negative-pressure"],
        format: "MCQ",
      },
      {
        stemTemplate: (ctx) => `A nurse is performing hand hygiene before inserting a peripheral IV catheter. The nurse's hands are visibly soiled with blood from a previous procedure. Which hand hygiene method is most appropriate in this situation?`,
        options: [
          { label: "A", text: "Apply alcohol-based hand rub (ABHR) and rub until dry" },
          { label: "B", text: "Wash hands with soap and water for at least 20 seconds" },
          { label: "C", text: "Apply ABHR followed by soap and water rinse" },
          { label: "D", text: "Wipe hands with antiseptic wipes and apply clean gloves" },
        ],
        correctAnswer: ["B"],
        rationaleTemplate: (ctx) => `When hands are visibly soiled with blood or body fluids, soap and water must be used for hand hygiene. Alcohol-based hand rub (ABHR) is effective against most pathogens but cannot adequately clean hands that are visibly contaminated with organic matter such as blood, because the organic material can inactivate the alcohol and create a barrier between the antiseptic and the microorganisms on the skin. The WHO and PHAC guidelines recommend soap and water hand washing for a minimum of 20 seconds (some guidelines specify 40-60 seconds for the complete hand washing procedure) when hands are visibly soiled. The correct technique includes: wetting hands, applying sufficient soap, rubbing all surfaces (palms, backs of hands, between fingers, fingertips, thumbs, and wrists) for at least 20 seconds, rinsing thoroughly under running water, and drying with a single-use paper towel. The paper towel should then be used to turn off the faucet to avoid recontamination. ABHR is preferred when hands are NOT visibly soiled because it is more effective, faster, less drying to skin, and more accessible at the point of care. Additionally, soap and water is always required after caring for patients with Clostridioides difficile (C. diff) infection, as alcohol does not kill C. diff spores.`,
        clinicalPearl: "Visibly soiled hands = soap and water; not visibly soiled = ABHR is preferred; C. diff = always soap and water (alcohol doesn't kill spores)",
        examStrategy: "Two situations always require soap and water: visibly soiled hands AND C. difficile; for everything else, ABHR is acceptable and preferred",
        clinicalTrap: "ABHR is NOT effective when hands are visibly soiled or for C. difficile spores; these situations always require soap and water",
        distractorRationales: {
          A: "ABHR is ineffective when hands are visibly soiled with blood; organic matter inactivates the alcohol",
          C: "Using ABHR then soap and water is unnecessary and does not follow evidence-based hand hygiene guidelines",
          D: "Antiseptic wipes are not an acceptable substitute for proper hand hygiene before invasive procedures",
        },
        subtopic: "Hand Hygiene Selection",
        tags: ["infection-control", "hand-hygiene", "blood-exposure", "evidence-based"],
        format: "MCQ",
      },
    ],
    "Medication Administration": [
      {
        stemTemplate: (ctx) => `A ${tier === "rpn" ? "practical nurse" : "registered nurse"} is preparing to administer ${ctx.medication} to a ${ctx.age}-year-old patient. The patient's current vital signs are: HR ${ctx.hr} bpm, BP ${ctx.bp} mmHg, RR ${ctx.rr} breaths/min. The medication order reads: "${ctx.order}." Which action should the nurse take before administering this medication?`,
        options: [
          { label: "A", text: "Administer the medication as ordered since the order is valid" },
          { label: "B", text: "Hold the medication, assess the patient, and notify the prescriber of the concerning vital signs" },
          { label: "C", text: "Administer half the ordered dose as a precaution" },
          { label: "D", text: "Ask a colleague to verify that the vital signs are accurate" },
        ],
        correctAnswer: ["B"],
        rationaleTemplate: (ctx) => `Before administering any medication, the nurse must perform a comprehensive pre-administration assessment that includes checking relevant vital signs against established parameters. The patient's current vital signs indicate ${ctx.concern}, which is a contraindication or precaution for the administration of ${ctx.medication}. The nurse's scope of practice includes the professional judgment to hold a medication when assessment findings suggest administration could harm the patient. This decision is based on pharmacological knowledge: ${ctx.pharmacology}. The nurse must: (1) hold the medication and document the reason (vital sign findings), (2) perform a thorough assessment to determine the cause of the abnormal vital signs, (3) notify the prescriber with specific data using SBAR communication, and (4) document the conversation and any new orders received. Administering the medication as ordered without considering the current vital signs (option A) demonstrates a lack of clinical judgment and could harm the patient. Adjusting the dose independently (option C) is outside the nurse's scope of practice - dose modifications require a prescriber's order. While verifying vital signs with a colleague is reasonable practice, it delays the critical action of holding the medication and notifying the prescriber.`,
        clinicalPearl: "Always check relevant vital signs BEFORE administering medications that affect those parameters; hold and notify if outside safe parameters",
        examStrategy: "For pre-administration assessment questions, the correct answer involves holding the medication AND notifying the prescriber; never administer or modify the dose independently",
        clinicalTrap: "Nurses cannot independently modify medication doses; this requires a prescriber's order",
        distractorRationales: {
          A: "Administering without assessing current vital signs ignores the nurse's responsibility for pre-administration assessment and clinical judgment",
          C: "Nurses cannot independently adjust medication doses; this requires a new order from the prescriber",
          D: "While rechecking vital signs is reasonable, the priority is holding the medication and reporting the findings",
        },
        subtopic: "Pre-Administration Assessment",
        tags: ["medication-administration", "assessment", "patient-safety", "vital-signs"],
        format: "MCQ",
      },
    ],
    "Patient Safety": [
      {
        stemTemplate: (ctx) => `A nurse is implementing fall prevention strategies for a ${ctx.age}-year-old patient admitted to the ${ctx.unit} unit. The patient is taking ${ctx.medication}, has a history of ${ctx.history}, and scored ${ctx.fallScore} on the Morse Fall Scale. Which intervention is MOST important for preventing falls in this patient?`,
        options: [
          { label: "A", text: "Apply bilateral wrist restraints during sleeping hours" },
          { label: "B", text: "Ensure the patient's environment is well-lit, the call bell is within reach, bed is in lowest position, and the patient wears non-skid footwear" },
          { label: "C", text: "Assign a sitter to remain at the bedside 24 hours a day" },
          { label: "D", text: "Keep all four bed side rails up at all times" },
        ],
        correctAnswer: ["B"],
        rationaleTemplate: (ctx) => `Evidence-based fall prevention requires a multi-modal approach that addresses environmental, physiological, and pharmacological risk factors. The correct answer encompasses the key environmental modifications: adequate lighting (reduces tripping hazards and disorientation, especially important at night), call bell accessibility (enables the patient to request assistance before attempting to mobilize independently), bed in lowest position (reduces injury height if a fall occurs), and non-skid footwear (provides traction on hospital floors). The patient's risk factors include age (${ctx.age}), medication effects (${ctx.medication} can cause dizziness, orthostatic hypotension, or sedation), history of ${ctx.history}, and a high Morse Fall Scale score of ${ctx.fallScore}. Restraints (option A) are NOT appropriate for fall prevention and have been shown to increase injury, agitation, and pressure injuries while decreasing mobility and functional status. Restraint use requires a specific physician's order and is reserved for last-resort situations to prevent self-harm, not fall prevention. Full bilateral side rails (option D) are considered a form of restraint in Canadian healthcare policy and actually increase fall risk because patients may climb over them and fall from a greater height. A 24-hour sitter (option C) may be indicated for high-risk patients but is not the MOST important intervention compared to comprehensive environmental modifications, and may not be feasible for all facilities.`,
        clinicalPearl: "All four side rails up = restraint; use only 2-3 rails up to facilitate safe exit while providing protection",
        examStrategy: "For fall prevention, environmental modifications (lighting, call bell, low bed, footwear) are always preferred over restraints; restraints INCREASE injury risk",
        clinicalTrap: "Four side rails up constitutes a restraint; patients may climb over them, increasing fall height and injury severity",
        distractorRationales: {
          A: "Restraints are not indicated for fall prevention; they increase injury, agitation, and are considered a last resort",
          C: "A sitter may be appropriate but is not the MOST important intervention; environmental modifications address the root causes",
          D: "All four side rails up is considered a restraint and paradoxically increases fall risk due to patients climbing over them",
        },
        subtopic: "Fall Prevention Strategies",
        tags: ["patient-safety", "fall-prevention", "environmental-modification", "restraints"],
        format: "MCQ",
      },
    ],
    "Fluid & Electrolytes": [
      {
        stemTemplate: (ctx) => `A nurse reviews the following laboratory results for a patient admitted with ${ctx.condition}: sodium ${ctx.sodium} mmol/L, potassium ${ctx.potassium} mmol/L, chloride ${ctx.chloride} mmol/L, bicarbonate ${ctx.bicarb} mmol/L, creatinine ${ctx.creatinine} umol/L. Which electrolyte abnormality requires the MOST urgent nursing intervention?`,
        optionsTemplate: (ctx) => [
          { label: "A", text: `Hyponatremia (sodium ${ctx.sodium} mmol/L)` },
          { label: "B", text: `Hyperkalemia (potassium ${ctx.potassium} mmol/L)` },
          { label: "C", text: `Metabolic acidosis (bicarbonate ${ctx.bicarb} mmol/L)` },
          { label: "D", text: `Elevated creatinine (${ctx.creatinine} umol/L)` },
        ],
        correctAnswer: ["B"],
        rationaleTemplate: (ctx) => `Hyperkalemia (serum potassium > 5.0 mmol/L) is the most immediately life-threatening electrolyte abnormality because of its direct effect on cardiac conduction. At a level of ${ctx.potassium} mmol/L, the patient is at significant risk for fatal cardiac dysrhythmias including ventricular fibrillation and asystole. Potassium's role in cardiac cellular depolarization means that elevated levels can cause peaked T waves, widened QRS complexes, and eventually sine wave patterns leading to cardiac arrest. The nurse must immediately: place the patient on continuous cardiac monitoring, notify the physician urgently, anticipate orders for calcium gluconate (stabilizes cardiac membranes), regular insulin with dextrose (shifts K+ intracellularly), sodium bicarbonate (if acidosis is present, also shifts K+ intracellularly), and potentially kayexalate or dialysis for definitive potassium removal. While hyponatremia, metabolic acidosis, and elevated creatinine all require attention and monitoring, they do not carry the same immediate risk of sudden cardiac death as hyperkalemia. The mnemonic for hyperkalemia management is 'C BIG K Drop': Calcium gluconate, Beta-agonists, Insulin + Glucose, Kayexalate, Dialysis. Continuous cardiac monitoring is essential until potassium returns to a safe range.`,
        clinicalPearl: "Hyperkalemia is the most immediately life-threatening electrolyte abnormality due to cardiac dysrhythmia risk; always check potassium first in critical lab reviews",
        examStrategy: "When multiple lab abnormalities are listed, hyperkalemia almost always requires the MOST urgent intervention due to cardiac arrest risk",
        clinicalTrap: "Do not focus on elevated creatinine (kidney function marker) over hyperkalemia; the potassium level has more immediate lethal potential",
        distractorRationales: {
          A: "Hyponatremia requires monitoring and treatment but does not carry the same immediate cardiac arrest risk as hyperkalemia",
          C: "Metabolic acidosis is concerning but is often secondary to the underlying condition; hyperkalemia has more immediate lethal potential",
          D: "Elevated creatinine indicates impaired renal function but is not an immediate emergency; it explains the hyperkalemia but the K+ itself is more urgent",
        },
        subtopic: "Electrolyte Priorities",
        tags: ["fluid-electrolytes", "hyperkalemia", "cardiac-monitoring", "lab-interpretation", "emergency"],
        format: "lab-interpretation",
      },
    ],
    "Pharmacology": [
      {
        stemTemplate: (ctx) => `A nurse is caring for a patient prescribed ${ctx.medication} for ${ctx.condition}. The patient asks, "What side effects should I watch for?" Which teaching points should the nurse include? (Select all that apply.)`,
        optionsTemplate: (ctx) => [
          { label: "A", text: ctx.sideEffect1 },
          { label: "B", text: ctx.sideEffect2 },
          { label: "C", text: ctx.wrongEffect1 },
          { label: "D", text: ctx.sideEffect3 },
          { label: "E", text: ctx.wrongEffect2 },
        ],
        correctAnswer: ["A", "B", "D"],
        rationaleTemplate: (ctx) => `${ctx.medication} is a ${ctx.drugClass} used to treat ${ctx.condition}. The mechanism of action involves ${ctx.mechanism}. Common and important side effects that patients should be taught to monitor include: ${ctx.sideEffect1} - this occurs because ${ctx.reason1}. ${ctx.sideEffect2} - this occurs because ${ctx.reason2}. ${ctx.sideEffect3} - this occurs because ${ctx.reason3}. The incorrect options are not associated with this medication class: ${ctx.wrongEffect1} is more commonly associated with ${ctx.wrongDrug1}, and ${ctx.wrongEffect2} is more commonly associated with ${ctx.wrongDrug2}. Patient education is a critical nursing responsibility and includes teaching about expected side effects, when to seek medical attention, dietary considerations, and medication interactions. The nurse should use teach-back method to verify patient understanding and provide written materials for reference.`,
        clinicalPearl: "Know the major side effects for each drug class; this medication requires monitoring of specific parameters",
        examStrategy: "For SATA medication side effect questions, match side effects to the drug's mechanism of action; effects should logically relate to how the drug works",
        clinicalTrap: "Do not confuse side effects between drug classes; each class has its own characteristic adverse effect profile",
        distractorRationales: {
          C: "This side effect is not associated with this medication and is more commonly seen with different drug classes",
          E: "This side effect is not characteristic of this medication and would be more likely with a different pharmacological category",
        },
        subtopic: "Patient Education on Side Effects",
        tags: ["pharmacology", "patient-education", "side-effects", "medication-safety"],
        format: "SATA",
      },
    ],
  };

  const contextVariants: Record<string, any[]> = {
    "Infection Control": [
      { unit: "medical", condition: "active pulmonary tuberculosis", age: 52, history: "HIV positive, immigration from endemic region" },
      { unit: "pediatric", condition: "measles (rubeola)", age: 4, history: "unvaccinated status, recent travel" },
      { unit: "medical", condition: "disseminated varicella-zoster virus", age: 78, history: "immunosuppression from chemotherapy" },
      { unit: "respiratory", condition: "suspected COVID-19 with aerosol-generating procedure", age: 67, history: "COPD, diabetes mellitus" },
      { unit: "isolation", condition: "drug-resistant tuberculosis (MDR-TB)", age: 45, history: "previous incomplete TB treatment" },
    ],
    "Medication Administration": [
      { medication: "metoprolol 50 mg PO", age: 72, hr: 52, bp: "96/58", rr: 16, order: "metoprolol 50 mg PO BID", concern: "bradycardia (HR 52) and hypotension (BP 96/58)", pharmacology: "Metoprolol is a beta-1 selective blocker that decreases heart rate and blood pressure. Administering it with an already low HR and BP could cause severe bradycardia, symptomatic hypotension, or cardiogenic shock." },
      { medication: "lisinopril 10 mg PO", age: 65, hr: 88, bp: "88/54", rr: 18, order: "lisinopril 10 mg PO daily", concern: "hypotension (BP 88/54)", pharmacology: "Lisinopril is an ACE inhibitor that lowers blood pressure by blocking the conversion of angiotensin I to angiotensin II. Administering it with a systolic BP below 90 mmHg could cause dangerous hypotension." },
      { medication: "digoxin 0.125 mg PO", age: 80, hr: 54, bp: "118/72", rr: 14, order: "digoxin 0.125 mg PO daily", concern: "bradycardia (HR 54, below the hold parameter of 60)", pharmacology: "Digoxin is a cardiac glycoside that slows the heart rate and increases contractility. The standard hold parameter is HR < 60 bpm; administering digoxin with a HR of 54 could cause severe bradycardia or heart block." },
      { medication: "morphine 4 mg IV", age: 58, hr: 76, bp: "112/68", rr: 8, order: "morphine 4 mg IV q4h PRN pain", concern: "respiratory depression (RR 8, below the hold parameter of 12)", pharmacology: "Morphine is an opioid agonist that depresses the respiratory centre in the medulla. With a respiratory rate of 8, administering additional opioid could cause respiratory arrest." },
    ],
    "Patient Safety": [
      { age: 82, unit: "medical", medication: "lorazepam 0.5 mg PO at bedtime", history: "previous falls, urinary frequency", fallScore: 60 },
      { age: 75, unit: "surgical", medication: "oxycodone 5 mg PO q4h PRN", history: "hip replacement 1 day ago, visual impairment", fallScore: 55 },
      { age: 88, unit: "geriatric", medication: "furosemide 40 mg PO daily", history: "orthostatic hypotension, dementia", fallScore: 70 },
    ],
    "Fluid & Electrolytes": [
      { condition: "acute kidney injury", sodium: 133, potassium: 6.4, chloride: 108, bicarb: 18, creatinine: 450 },
      { condition: "diabetic ketoacidosis", sodium: 130, potassium: 5.8, chloride: 100, bicarb: 12, creatinine: 180 },
      { condition: "chronic kidney disease stage 5", sodium: 136, potassium: 6.1, chloride: 106, bicarb: 16, creatinine: 620 },
    ],
    "Pharmacology": [
      { medication: "metformin", condition: "Type 2 diabetes mellitus", drugClass: "biguanide", mechanism: "decreasing hepatic glucose production and increasing insulin sensitivity", sideEffect1: "GI disturbances (nausea, diarrhea, abdominal discomfort)", sideEffect2: "Risk of lactic acidosis, especially with renal impairment or contrast dye use", sideEffect3: "Vitamin B12 deficiency with long-term use", wrongEffect1: "Hypoglycemia when used as monotherapy", wrongEffect2: "Weight gain", wrongDrug1: "sulfonylureas (glyburide)", wrongDrug2: "insulin or thiazolidinediones", reason1: "metformin irritates the GI mucosa", reason2: "metformin impairs lactate metabolism in the liver", reason3: "metformin interferes with B12 absorption in the ileum" },
      { medication: "lisinopril", condition: "hypertension", drugClass: "ACE inhibitor", mechanism: "blocking the conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion", sideEffect1: "Persistent dry cough (due to bradykinin accumulation)", sideEffect2: "Hyperkalemia (due to reduced aldosterone secretion)", sideEffect3: "First-dose hypotension (especially in volume-depleted patients)", wrongEffect1: "Ankle edema and peripheral swelling", wrongEffect2: "Reflex tachycardia", wrongDrug1: "calcium channel blockers (amlodipine)", wrongDrug2: "alpha-1 blockers (prazosin)", reason1: "ACE inhibitors prevent bradykinin breakdown, causing cough", reason2: "reduced aldosterone means less potassium excretion", reason3: "sudden reduction in angiotensin II can cause acute vasodilation" },
      { medication: "warfarin", condition: "atrial fibrillation (stroke prevention)", drugClass: "vitamin K antagonist anticoagulant", mechanism: "inhibiting vitamin K-dependent clotting factors (II, VII, IX, X)", sideEffect1: "Increased bleeding risk (bruising, prolonged bleeding from cuts, blood in urine/stool)", sideEffect2: "INR elevation requiring dose adjustment and regular monitoring", sideEffect3: "Drug and food interactions (vitamin K-rich foods like leafy greens can decrease effectiveness)", wrongEffect1: "Thrombocytopenia (low platelet count)", wrongEffect2: "Osteoporosis with long-term use", wrongDrug1: "heparin (HIT - heparin-induced thrombocytopenia)", wrongDrug2: "unfractionated heparin with prolonged use", reason1: "warfarin inhibits clotting factors, prolonging bleeding time", reason2: "the therapeutic range for INR is typically 2.0-3.0 and requires regular blood testing", reason3: "vitamin K in foods can compete with warfarin's mechanism" },
    ],
  };

  let generated = 0;
  const topicsToUse = Object.keys(topicTemplates);

  for (let i = 0; i < count && generated < count; i++) {
    const topicKey = topicsToUse[i % topicsToUse.length];
    const templates = topicTemplates[topicKey];
    if (!templates || templates.length === 0) continue;

    const template = templates[i % templates.length];
    const variants = contextVariants[topicKey];
    if (!variants || variants.length === 0) continue;

    const ctx = variants[i % variants.length];
    const stem = template.stemTemplate(ctx);
    const hash = stemHash(stem);
    const difficulty = assignDifficulty(i, count);
    const domain = assignBlueprintDomain(topicKey, domains);
    const resolvedOptions = template.optionsTemplate ? template.optionsTemplate(ctx) : template.options;

    questions.push({
      tier,
      exam,
      questionType: template.format,
      status: "published",
      stem,
      options: JSON.stringify(resolvedOptions),
      correctAnswer: JSON.stringify(template.correctAnswer),
      rationale: template.rationaleTemplate(ctx),
      difficulty,
      tags: template.tags,
      bodySystem: domain,
      topic: topicKey === "Pharmacology" && tier === "rn" ? "Pharmacology" : topicKey,
      subtopic: template.subtopic,
      regionScope,
      stemHash: hash,
      scenario: stem.substring(0, 120),
      clinicalPearl: template.clinicalPearl,
      examStrategy: template.examStrategy,
      clinicalTrap: template.clinicalTrap,
      distractorRationales: JSON.stringify(template.distractorRationales),
      cognitiveLevel: assignCognitiveLevel(difficulty),
      questionFormat: template.format,
      careerType: "nursing",
      blueprintDomain: domain,
    });
    generated++;
  }

  return questions;
}

function buildNCLEXPNQuestions(): QuestionRecord[] {
  const questions: QuestionRecord[] = [];
  const tier = "rpn";
  const exam = "NCLEX-PN";
  const regionScope = "US";

  const scenarios: Array<{
    topic: string;
    subtopic: string;
    stem: string;
    options: { label: string; text: string }[];
    correctAnswer: string[];
    rationale: string;
    clinicalPearl: string;
    examStrategy: string;
    clinicalTrap: string;
    distractorRationales: Record<string, string>;
    tags: string[];
    questionFormat: string;
    scenario: string;
  }> = [
    {
      topic: "Safety and Infection Control",
      subtopic: "Standard Precautions",
      stem: "A licensed practical nurse (LPN) is caring for multiple patients on a medical-surgical unit. Which action demonstrates proper use of standard precautions?",
      options: [
        { label: "A", text: "Wearing gloves only when handling blood or body fluids" },
        { label: "B", text: "Applying standard precautions to all patients regardless of diagnosis, including hand hygiene, PPE based on anticipated exposure, and respiratory hygiene" },
        { label: "C", text: "Using standard precautions only for patients with known infectious diseases" },
        { label: "D", text: "Wearing an N95 respirator for all patient interactions" },
      ],
      correctAnswer: ["B"],
      rationale: "Standard precautions are the minimum infection prevention practices that apply to ALL patient care in ALL healthcare settings, regardless of suspected or confirmed infection status of the patient. They are based on the principle that all blood, body fluids, secretions, excretions (except sweat), non-intact skin, and mucous membranes may contain transmissible infectious agents. Standard precautions include: (1) hand hygiene before and after patient contact, (2) use of personal protective equipment (PPE) based on the anticipated exposure (gloves for contact with blood/body fluids, gown to protect clothing, mask/eye protection when splashes are anticipated), (3) respiratory hygiene/cough etiquette, (4) safe injection practices, (5) safe handling of potentially contaminated equipment or surfaces, and (6) proper handling of laundry and waste. The Centers for Disease Control and Prevention (CDC) mandates that standard precautions be applied universally, not selectively based on diagnosis. Option A is incorrect because gloves are only one component of standard precautions. Option C is incorrect because applying precautions only to known infectious patients fails to protect against undiagnosed infections. Option D is incorrect because N95 respirators are reserved for airborne precautions, not routine standard precautions. The LPN must understand that standard precautions are the foundation of infection control, with transmission-based precautions (contact, droplet, airborne) added when specific pathogens are identified.",
      clinicalPearl: "Standard precautions apply to ALL patients, ALL the time, regardless of diagnosis; they are the foundation of infection prevention",
      examStrategy: "When asked about standard precautions, the correct answer always emphasizes universal application to ALL patients, not just those with known infections",
      clinicalTrap: "Standard precautions are NOT the same as universal precautions; standard precautions are more comprehensive and include respiratory hygiene and safe injection practices",
      distractorRationales: {
        A: "Gloves alone do not constitute standard precautions; other components (hand hygiene, gowns, masks, respiratory hygiene) are also required based on anticipated exposure",
        C: "Applying standard precautions only to known infectious patients violates the principle that all patients may harbor undiagnosed infections",
        D: "N95 respirators are required only for airborne precautions, not standard precautions; this would be excessive for routine care",
      },
      tags: ["infection-control", "standard-precautions", "PPE", "hand-hygiene", "patient-safety"],
      questionFormat: "MCQ",
      scenario: "LPN implementing standard precautions on a medical-surgical unit with multiple patients",
    },
    {
      topic: "Pharmacological Therapies",
      subtopic: "Dosage Calculation",
      stem: "A physician orders amoxicillin 500 mg PO every 8 hours for a patient with a urinary tract infection. The pharmacy sends amoxicillin 250 mg/5 mL oral suspension. How many milliliters should the LPN administer per dose?",
      options: [
        { label: "A", text: "5 mL" },
        { label: "B", text: "10 mL" },
        { label: "C", text: "15 mL" },
        { label: "D", text: "20 mL" },
      ],
      correctAnswer: ["B"],
      rationale: "This is a standard dosage calculation using the formula: Desired dose / Available dose x Volume = Amount to administer. The ordered dose (Desired) is 500 mg. The available concentration is 250 mg per 5 mL (Available dose = 250 mg, Volume = 5 mL). Calculation: 500 mg / 250 mg x 5 mL = 10 mL. Alternatively, using dimensional analysis: 500 mg x (5 mL / 250 mg) = 2500/250 = 10 mL. The LPN should administer 10 mL of the oral suspension per dose. Verification: 10 mL x 250 mg/5 mL = 10 mL x 50 mg/mL = 500 mg, which matches the ordered dose. Dosage calculation is a critical nursing competency that requires accuracy to prevent medication errors. The LPN should always: (1) verify the order, (2) perform the calculation, (3) verify the calculation independently or with a colleague for high-risk medications, (4) use the appropriate measuring device (oral syringe for liquid medications, not a household teaspoon), and (5) document the dose administered. Common errors in dosage calculation include forgetting to convert units, misplacing decimal points, and using the wrong formula. The LPN should never estimate or round inappropriately when calculating medication doses.",
      clinicalPearl: "Use the formula: Desired/Available x Volume; always verify calculations for oral suspensions using an oral syringe, not household measuring devices",
      examStrategy: "For dosage calculation questions: set up the formula first, perform the calculation, then verify by working backward from your answer to confirm it equals the ordered dose",
      clinicalTrap: "Do not confuse mg with mL; the question asks for mL (volume to administer), not mg (dose)",
      distractorRationales: {
        A: "5 mL would provide only 250 mg (half the ordered dose); this calculation error results from using 1:1 ratio instead of the correct formula",
        C: "15 mL would provide 750 mg (150% of the ordered dose); this would be an overdose",
        D: "20 mL would provide 1000 mg (double the ordered dose); this would be a significant overdose",
      },
      tags: ["pharmacology", "dosage-calculation", "medication-administration", "math", "patient-safety"],
      questionFormat: "dosage-calculation",
      scenario: "LPN calculating the correct volume of amoxicillin oral suspension to administer for a UTI",
    },
    {
      topic: "Physiological Integrity",
      subtopic: "Diabetes Management",
      stem: "An LPN is caring for a patient with Type 1 diabetes mellitus who reports feeling shaky, sweaty, and anxious. The patient's blood glucose reading is 58 mg/dL. The patient is alert and able to swallow. What is the LPN's priority action?",
      options: [
        { label: "A", text: "Administer the patient's scheduled insulin dose" },
        { label: "B", text: "Give the patient 15-20 grams of fast-acting carbohydrate such as 4 oz of juice or 3-4 glucose tablets" },
        { label: "C", text: "Call the physician and wait for orders before intervening" },
        { label: "D", text: "Encourage the patient to eat a full meal immediately" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is experiencing symptomatic hypoglycemia (blood glucose < 70 mg/dL with symptoms of autonomic nervous system activation: shakiness, diaphoresis, anxiety). For a conscious, alert patient who can swallow safely, the treatment follows the 'Rule of 15': administer 15-20 grams of fast-acting carbohydrate (4 oz fruit juice, 3-4 glucose tablets, 6-8 oz regular soda, or 1 tablespoon honey), wait 15 minutes, then recheck the blood glucose. If the glucose remains below 70 mg/dL, repeat the treatment. Once the glucose normalizes, provide a protein-containing snack or the next scheduled meal to prevent recurrent hypoglycemia. Administering insulin (option A) would further lower the already dangerously low blood glucose and could cause severe hypoglycemia, seizures, or loss of consciousness. Waiting for physician orders (option C) delays critical treatment; hypoglycemia treatment protocols are typically standing orders that the LPN can implement immediately. Eating a full meal (option D) is appropriate after initial treatment with fast-acting carbohydrate, but the full meal takes too long to raise blood glucose compared to simple carbohydrates. The American Diabetes Association (ADA) guidelines recommend that all healthcare providers be trained in the recognition and immediate treatment of hypoglycemia using the Rule of 15 protocol.",
      clinicalPearl: "Rule of 15: give 15 g fast-acting carbohydrate, wait 15 minutes, recheck glucose; repeat if still below 70 mg/dL",
      examStrategy: "For hypoglycemia questions with a conscious patient: fast-acting carbohydrate first (Rule of 15); for unconscious patient: glucagon IM or D50W IV",
      clinicalTrap: "NEVER give insulin to a hypoglycemic patient; this is the opposite of the needed treatment and could be fatal",
      distractorRationales: {
        A: "Administering insulin to a patient with blood glucose of 58 mg/dL would cause severe, potentially fatal hypoglycemia",
        C: "Hypoglycemia requires immediate intervention; waiting for physician orders delays treatment of a potentially life-threatening condition",
        D: "A full meal takes too long to raise blood glucose; fast-acting carbohydrate provides the quickest glucose elevation",
      },
      tags: ["diabetes", "hypoglycemia", "emergency", "patient-safety", "nutrition"],
      questionFormat: "MCQ",
      scenario: "Type 1 diabetic patient with symptomatic hypoglycemia (BG 58 mg/dL) who is alert and able to swallow",
    },
    {
      topic: "Health Promotion and Maintenance",
      subtopic: "Immunizations",
      stem: "An LPN is providing discharge teaching to the parents of a 2-month-old infant after a well-baby visit. Which vaccines should have been administered at this visit? (Select all that apply.)",
      options: [
        { label: "A", text: "DTaP (diphtheria, tetanus, pertussis)" },
        { label: "B", text: "IPV (inactivated poliovirus)" },
        { label: "C", text: "MMR (measles, mumps, rubella)" },
        { label: "D", text: "Hepatitis B (second dose)" },
        { label: "E", text: "Rotavirus (oral)" },
        { label: "F", text: "Varicella" },
      ],
      correctAnswer: ["A", "B", "D", "E"],
      rationale: "According to the CDC recommended immunization schedule for infants, the following vaccines are given at the 2-month visit: (1) DTaP - first dose of diphtheria, tetanus, and acellular pertussis vaccine; (2) IPV - first dose of inactivated poliovirus vaccine; (3) Hepatitis B - second dose (first dose given at birth); (4) Rotavirus - first dose of oral rotavirus vaccine (RV1 or RV5); (5) Hib - Haemophilus influenzae type b conjugate vaccine; and (6) PCV13 - pneumococcal conjugate vaccine. The MMR (option C) is NOT given at 2 months; the first dose of MMR is administered at 12-15 months because maternal antibodies would interfere with the vaccine's effectiveness before that age. Varicella vaccine (option F) is also NOT given at 2 months; the first dose is administered at 12-15 months. The LPN should educate parents about expected side effects (mild fever, fussiness, injection site redness/swelling), appropriate use of acetaminophen for fever management (not prophylactically), and when to seek medical attention (high fever >104°F/40°C, persistent inconsolable crying >3 hours, seizure activity, or allergic reaction signs). The importance of maintaining the immunization schedule should be emphasized to protect the infant during this vulnerable period when the immune system is still developing.",
      clinicalPearl: "2-month vaccines: DTaP, IPV, Hep B (2nd dose), Rotavirus, Hib, PCV13; MMR and varicella are NOT given until 12-15 months",
      examStrategy: "Remember that live vaccines (MMR, varicella) are given at 12-15 months, not before; 2-month and 4-month visits use inactivated/conjugate vaccines",
      clinicalTrap: "MMR and varicella are given at 12-15 months, NOT at 2 months; maternal antibodies would interfere with these live vaccines before that age",
      distractorRationales: {
        C: "MMR is a live vaccine first given at 12-15 months; maternal antibodies make it ineffective before that age",
        F: "Varicella is a live vaccine first given at 12-15 months; it is not part of the 2-month immunization schedule",
      },
      tags: ["health-promotion", "immunizations", "pediatric", "well-baby", "vaccine-schedule"],
      questionFormat: "SATA",
      scenario: "2-month-old infant at a well-baby visit receiving age-appropriate immunizations per CDC schedule",
    },
    {
      topic: "Psychosocial Integrity",
      subtopic: "Therapeutic Communication",
      stem: "An LPN is caring for a patient who was recently diagnosed with breast cancer. The patient is crying and says, 'I don't know how I'm going to tell my children about this. I feel like my whole world is falling apart.' Which response by the LPN demonstrates the BEST therapeutic communication technique?",
      options: [
        { label: "A", text: "'Don't worry, everything will be fine. Many people survive breast cancer nowadays.'" },
        { label: "B", text: "'I understand how you feel. My aunt had breast cancer and she went through the same thing.'" },
        { label: "C", text: "'This must be very overwhelming for you. Tell me more about what concerns you most about talking to your children.'" },
        { label: "D", text: "'You should focus on staying positive. Negative thinking will only make things worse.'" },
      ],
      correctAnswer: ["C"],
      rationale: "Therapeutic communication is a purposeful, goal-directed form of communication that promotes patient well-being and supports the nurse-patient relationship. Option C demonstrates two key therapeutic techniques: (1) EMPATHY and VALIDATION - acknowledging the patient's feelings ('This must be very overwhelming for you') validates the emotional experience without dismissing or minimizing it, and (2) OPEN-ENDED QUESTIONING - inviting the patient to explore their concerns ('Tell me more about what concerns you most') encourages deeper expression and helps the nurse understand the patient's specific needs. This response creates a safe space for the patient to process emotions and identify areas where support is needed. Option A uses FALSE REASSURANCE ('everything will be fine'), which dismisses the patient's fears and is non-therapeutic because the nurse cannot guarantee outcomes. It also blocks communication by shutting down the emotional expression. Option B uses SELF-DISCLOSURE inappropriately - sharing personal stories shifts the focus from the patient to the nurse and implies that all cancer experiences are the same. While briefly mentioning a shared experience can sometimes build rapport, in this context it does not address the patient's specific concern about her children. Option D GIVES ADVICE and is dismissive of the patient's emotional needs - telling someone to 'stay positive' invalidates their feelings and creates pressure to suppress genuine emotions, which can be harmful to psychological processing and adjustment.",
      clinicalPearl: "Therapeutic communication validates feelings first, then uses open-ended questions to explore concerns; avoid false reassurance, unsolicited advice, and inappropriate self-disclosure",
      examStrategy: "For therapeutic communication questions, choose the response that acknowledges feelings AND invites the patient to share more; responses starting with 'Don't worry' or 'You should' are almost always wrong",
      clinicalTrap: "False reassurance ('everything will be fine') is one of the most common non-therapeutic responses on NCLEX; it dismisses feelings and blocks communication",
      distractorRationales: {
        A: "False reassurance dismisses the patient's legitimate fears and blocks therapeutic communication; nurses cannot guarantee outcomes",
        B: "Inappropriate self-disclosure shifts focus from the patient to the nurse and does not address the patient's specific concern about her children",
        D: "Giving unsolicited advice to 'stay positive' invalidates the patient's emotional experience and creates pressure to suppress genuine feelings",
      },
      tags: ["psychosocial", "therapeutic-communication", "empathy", "cancer-diagnosis", "patient-centered"],
      questionFormat: "MCQ",
      scenario: "Newly diagnosed breast cancer patient expressing distress about telling her children",
    },
    {
      topic: "Safe and Effective Care Environment",
      subtopic: "Delegation",
      stem: "An LPN is working with an unlicensed assistive personnel (UAP) on a busy medical-surgical unit. Which task can the LPN appropriately delegate to the UAP?",
      options: [
        { label: "A", text: "Administering an oral medication to a stable patient" },
        { label: "B", text: "Obtaining vital signs on a stable postoperative patient and reporting abnormal findings" },
        { label: "C", text: "Performing the initial assessment on a newly admitted patient" },
        { label: "D", text: "Teaching a diabetic patient about insulin injection technique" },
      ],
      correctAnswer: ["B"],
      rationale: "Delegation is the process of transferring a task to a competent individual while retaining accountability for the outcome. The LPN must use the five rights of delegation when assigning tasks to UAPs: (1) Right Task - the task must be within the UAP's scope and training, (2) Right Circumstance - the patient's condition must be stable and predictable, (3) Right Person - the UAP must be competent to perform the task, (4) Right Direction/Communication - clear, specific instructions must be provided, including what to report, and (5) Right Supervision/Evaluation - the LPN must monitor the UAP's performance and evaluate outcomes. Obtaining vital signs on a STABLE patient and reporting abnormal findings is within the UAP's scope because it is a routine, non-invasive procedure that the UAP has been trained to perform. The key modifier is 'stable' - vital signs on unstable or complex patients should be performed by the nurse. Medication administration (option A) is a licensed activity that cannot be delegated to UAPs in any US state. Initial assessment (option C) requires nursing judgment and critical thinking that is beyond the UAP's scope. Patient teaching about insulin injection (option D) requires nursing knowledge and is a licensed nursing function. The LPN remains accountable for the patient's care even when delegating tasks; if the UAP reports abnormal vital signs, the LPN must assess the patient and take appropriate action.",
      clinicalPearl: "Five Rights of Delegation: Right Task, Right Circumstance, Right Person, Right Direction, Right Supervision; UAPs can perform routine data collection but NOT assessment, teaching, or medication administration",
      examStrategy: "For delegation questions, remember that UAPs can measure (vital signs, I&O) and provide basic care (bathing, feeding) for STABLE patients, but cannot assess, teach, or administer medications",
      clinicalTrap: "Medication administration is ALWAYS a licensed nursing function; it can NEVER be delegated to UAPs regardless of the patient's stability",
      distractorRationales: {
        A: "Medication administration is a licensed activity that cannot be delegated to UAPs regardless of patient stability",
        C: "Initial assessment is a nursing function requiring clinical judgment; UAPs can collect data but cannot perform assessments",
        D: "Patient teaching requires nursing knowledge and clinical judgment; it is a licensed function that cannot be delegated to UAPs",
      },
      tags: ["delegation", "UAP", "scope-of-practice", "patient-safety", "leadership"],
      questionFormat: "delegation",
      scenario: "LPN determining appropriate delegation of tasks to a UAP on a medical-surgical unit",
    },
    {
      topic: "Physiological Integrity",
      subtopic: "Bowel Obstruction Assessment",
      stem: "An LPN is caring for a patient admitted with a suspected small bowel obstruction. The patient reports cramping abdominal pain, nausea, and has not passed gas or had a bowel movement in 3 days. Which assessment finding would the LPN expect?",
      options: [
        { label: "A", text: "Hyperactive, high-pitched bowel sounds proximal to the obstruction" },
        { label: "B", text: "Hypoactive bowel sounds throughout all four quadrants" },
        { label: "C", text: "Normal bowel sounds with localized tenderness in the right lower quadrant" },
        { label: "D", text: "Absent bowel sounds with rigid, board-like abdomen" },
      ],
      correctAnswer: ["A"],
      rationale: "In a small bowel obstruction, the intestines proximal (above) to the obstruction attempt to push contents past the blockage through increased peristaltic activity. This produces characteristic hyperactive, high-pitched bowel sounds often described as 'rushes and tinkles' when auscultated with a stethoscope. These sounds represent the intestinal smooth muscle contracting vigorously against the obstruction. The classic presentation includes: (1) colicky/cramping abdominal pain that comes in waves (corresponding to peristaltic waves), (2) nausea and vomiting (which may become feculent if the obstruction is prolonged), (3) abdominal distension, (4) obstipation (failure to pass gas or stool), and (5) hyperactive bowel sounds. The patient's report of no flatus or bowel movement for 3 days, along with cramping pain and nausea, is consistent with mechanical obstruction. As the obstruction progresses and the bowel becomes ischemic or necrotic, bowel sounds will diminish and eventually become absent, indicating a late and potentially life-threatening complication (strangulation). Hypoactive bowel sounds (option B) are more consistent with paralytic ileus (non-mechanical obstruction). Normal sounds with RLQ tenderness (option C) suggests appendicitis. Absent bowel sounds with a rigid abdomen (option D) suggests peritonitis, a surgical emergency indicating perforation or necrosis, which is a late and ominous finding rather than an expected initial presentation.",
      clinicalPearl: "Early obstruction = hyperactive, high-pitched bowel sounds; late obstruction/strangulation = absent bowel sounds (ominous sign indicating possible necrosis)",
      examStrategy: "For bowel obstruction questions, match the timing: early = hyperactive sounds, late/complications = absent sounds; absent sounds are NEVER the expected initial finding",
      clinicalTrap: "Absent bowel sounds indicate LATE, complicated obstruction (necrosis, strangulation), not the expected initial presentation of bowel obstruction",
      distractorRationales: {
        B: "Hypoactive bowel sounds are more characteristic of paralytic ileus, not mechanical small bowel obstruction",
        C: "Normal bowel sounds with RLQ tenderness are more suggestive of appendicitis, not bowel obstruction",
        D: "Absent bowel sounds with rigid abdomen indicate peritonitis, a late complication, not the expected initial assessment finding",
      },
      tags: ["GI", "bowel-obstruction", "assessment", "bowel-sounds", "auscultation"],
      questionFormat: "MCQ",
      scenario: "Patient admitted with suspected small bowel obstruction presenting with cramping pain, nausea, and obstipation",
    },
    {
      topic: "Physiological Integrity",
      subtopic: "Chest Tube Management",
      stem: "An LPN is assisting in the care of a patient with a chest tube connected to a water-seal drainage system. The patient had a thoracotomy for a right lower lobe lung resection 12 hours ago. Which finding should the LPN report to the RN immediately?",
      options: [
        { label: "A", text: "Gentle tidaling (fluctuation) in the water-seal chamber with respiration" },
        { label: "B", text: "200 mL of dark red drainage in the collection chamber over the last hour" },
        { label: "C", text: "Intermittent bubbling in the water-seal chamber with coughing" },
        { label: "D", text: "The chest tube dressing is intact and occlusive" },
      ],
      correctAnswer: ["B"],
      rationale: "Chest tube output of 200 mL per hour is excessive and requires immediate notification because it may indicate active hemorrhage from the surgical site. Normal chest tube drainage after thoracotomy is typically 100-200 mL in the first 2 hours, then gradually decreasing to less than 50-100 mL per hour. Drainage exceeding 200 mL per hour, or a sudden increase in drainage volume, suggests surgical bleeding that may require re-exploration. Additionally, the dark red colour of the drainage indicates fresh blood (hemothorax), rather than the expected serous or serosanguineous drainage. The LPN should: (1) immediately notify the RN and surgeon, (2) mark the drainage level with time on the collection chamber for accurate monitoring, (3) assess the patient's vital signs for signs of hypovolemic shock (tachycardia, hypotension, tachypnea), (4) ensure the chest tube system is functioning properly (connections secure, tubing not kinked), and (5) prepare for potential blood transfusion or surgical re-intervention. Tidaling (option A) is a normal finding that indicates the chest tube is patent and responsive to changes in intrapleural pressure during respiration. Intermittent bubbling with coughing (option C) can be normal in the immediate postoperative period as residual air is expelled. An intact occlusive dressing (option D) is the expected, normal finding.",
      clinicalPearl: "Chest tube drainage > 200 mL/hour or sudden increase in drainage = potential surgical hemorrhage requiring immediate notification; normal = decreasing serous/serosanguineous drainage",
      examStrategy: "For chest tube questions, know what is normal (tidaling, intermittent bubbling, serosanguineous drainage) vs abnormal (excessive drainage, continuous bubbling, no tidaling)",
      clinicalTrap: "Tidaling is NORMAL and indicates a patent chest tube; absence of tidaling may indicate a blocked tube or lung re-expansion",
      distractorRationales: {
        A: "Tidaling is a normal finding indicating proper chest tube function; it reflects changes in intrapleural pressure with respiration",
        C: "Intermittent bubbling with coughing is normal in the early postoperative period; continuous bubbling would be abnormal and suggest an air leak",
        D: "An intact occlusive dressing is the expected finding; this does not require immediate notification",
      },
      tags: ["respiratory", "chest-tube", "postoperative", "hemorrhage", "assessment", "critical-care"],
      questionFormat: "MCQ",
      scenario: "Post-thoracotomy patient with chest tube drainage of 200 mL/hour of dark red blood",
    },
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const difficulty = s.questionFormat === "SATA" ? 3 : (i % 5 === 0 ? 4 : i % 3 === 0 ? 2 : 3);
    const domain = assignBlueprintDomain(s.topic, RPN_BLUEPRINT_DOMAINS);
    questions.push({
      tier,
      exam,
      questionType: s.questionFormat,
      status: "published",
      stem: s.stem,
      options: JSON.stringify(s.options),
      correctAnswer: JSON.stringify(s.correctAnswer),
      rationale: s.rationale,
      difficulty,
      tags: s.tags,
      bodySystem: domain,
      topic: s.topic,
      subtopic: s.subtopic,
      regionScope,
      stemHash: stemHash(s.stem),
      scenario: s.scenario,
      clinicalPearl: s.clinicalPearl,
      examStrategy: s.examStrategy,
      clinicalTrap: s.clinicalTrap,
      distractorRationales: JSON.stringify(s.distractorRationales),
      cognitiveLevel: assignCognitiveLevel(difficulty),
      questionFormat: s.questionFormat,
      careerType: "nursing",
      blueprintDomain: domain,
    });
  }

  return questions;
}

function buildNCLEXRNQuestions(): QuestionRecord[] {
  const questions: QuestionRecord[] = [];
  const tier = "rn";
  const exam = "NCLEX-RN";
  const regionScope = "BOTH";

  const scenarios: Array<{
    topic: string;
    subtopic: string;
    stem: string;
    options: { label: string; text: string }[];
    correctAnswer: string[];
    rationale: string;
    clinicalPearl: string;
    examStrategy: string;
    clinicalTrap: string;
    distractorRationales: Record<string, string>;
    tags: string[];
    questionFormat: string;
    scenario: string;
  }> = [
    {
      topic: "Critical Thinking & Clinical Judgment",
      subtopic: "Priority Setting - ABCs",
      stem: "A registered nurse receives report on four patients at the beginning of the shift. Which patient should the RN assess FIRST?",
      options: [
        { label: "A", text: "A patient with Type 2 diabetes who has a blood glucose of 210 mg/dL before breakfast" },
        { label: "B", text: "A patient 1 day post-appendectomy who is requesting pain medication with a pain rating of 7/10" },
        { label: "C", text: "A patient with COPD who has oxygen saturation of 86% on 2L nasal cannula and is using accessory muscles to breathe" },
        { label: "D", text: "A patient admitted for cellulitis who has a temperature of 101.2°F (38.4°C) and is due for IV antibiotics" },
      ],
      correctAnswer: ["C"],
      rationale: "Using the ABCs (Airway, Breathing, Circulation) priority framework, the patient with COPD and an oxygen saturation of 86% with accessory muscle use requires immediate assessment. This patient has a compromised BREATHING status - the SpO2 is significantly below the acceptable range for COPD patients (88-92% is typically the target to avoid suppressing hypoxic drive), and accessory muscle use indicates increased work of breathing and potential respiratory failure. Signs of respiratory distress that require immediate intervention include: use of accessory muscles (sternocleidomastoid, intercostals, abdominal muscles), nasal flaring, tripod positioning, inability to speak in full sentences, paradoxical breathing, and declining SpO2. The RN must assess this patient immediately to determine if the oxygen delivery needs adjustment, whether the patient requires higher-level respiratory support (high-flow nasal cannula, BiPAP, or intubation), and to identify the cause of the deterioration (exacerbation, pneumonia, pneumothorax). While the other patients have valid concerns, none represent an immediate threat to life: the diabetic patient (option A) has an elevated but not critically dangerous glucose that can be managed with the scheduled insulin regimen; the post-appendectomy patient (option B) has expected postoperative pain that, while needing attention, is not life-threatening; the cellulitis patient (option D) has a low-grade fever consistent with the infection being treated and can wait for antibiotics within the ordered timeframe. The Maslow hierarchy and the ABCs framework consistently prioritize respiratory/airway issues above all other concerns.",
      clinicalPearl: "COPD patients with SpO2 < 88% AND accessory muscle use are at risk for respiratory failure; this is an emergency requiring immediate assessment and intervention",
      examStrategy: "For priority/delegation questions, use ABCs: Airway first, then Breathing, then Circulation; a patient who cannot breathe is always the highest priority",
      clinicalTrap: "COPD patients have a target SpO2 of 88-92%, but 86% WITH accessory muscle use indicates significant deterioration requiring immediate intervention",
      distractorRationales: {
        A: "Blood glucose of 210 mg/dL is elevated but not an emergency; it can be managed with the scheduled medication regimen",
        B: "Postoperative pain of 7/10 is expected and needs attention but is not life-threatening; the nurse can address this after stabilizing the respiratory patient",
        D: "A temperature of 101.2°F with cellulitis is consistent with the infectious process; IV antibiotics should be given promptly but this is not as urgent as respiratory compromise",
      },
      tags: ["priority-setting", "ABCs", "respiratory", "COPD", "clinical-judgment", "triage"],
      questionFormat: "prioritization",
      scenario: "RN prioritizing four patients at the beginning of the shift using ABCs framework",
    },
    {
      topic: "Cardiac & Hemodynamic Monitoring",
      subtopic: "Heart Failure Management",
      stem: "An RN is caring for a patient admitted with acute decompensated heart failure (ADHF). The patient is on IV furosemide 40 mg q12h, oxygen at 4L via nasal cannula, and fluid restriction of 1500 mL/day. Which assessment finding indicates the treatment is effective?",
      options: [
        { label: "A", text: "The patient's weight has increased by 1 kg since admission and dependent edema persists" },
        { label: "B", text: "The patient's lung sounds have changed from bilateral crackles to clear, weight has decreased by 2 kg, and urine output is 60 mL/hour" },
        { label: "C", text: "The patient's BNP (brain natriuretic peptide) has increased from 800 pg/mL to 1200 pg/mL" },
        { label: "D", text: "The patient continues to report dyspnea on exertion and requires 3 pillows to sleep" },
      ],
      correctAnswer: ["B"],
      rationale: "The treatment goals for acute decompensated heart failure (ADHF) are to reduce preload (volume overload), improve cardiac output, and alleviate symptoms of congestion. Effective treatment is demonstrated by: (1) CLEARING of lung crackles - crackles (rales) indicate pulmonary edema from fluid backing up into the lungs due to left ventricular failure. When treatment is effective, the diuretic (furosemide) removes excess fluid, reducing pulmonary congestion and clearing the crackles. (2) WEIGHT LOSS - daily weight is the most reliable indicator of fluid balance. A decrease of 2 kg represents approximately 2 liters of fluid loss, indicating effective diuresis. Patients should be weighed daily at the same time, on the same scale, wearing similar clothing. (3) ADEQUATE URINE OUTPUT - furosemide is a loop diuretic that works by blocking the Na-K-2Cl transporter in the ascending limb of the loop of Henle, preventing sodium and water reabsorption. An output of 60 mL/hour indicates the kidneys are effectively eliminating excess fluid. The nurse should monitor intake and output carefully and assess for signs of excessive diuresis (dehydration, hypokalemia, hypotension). Weight gain with persistent edema (option A) indicates treatment failure. Rising BNP (option C) indicates worsening heart failure (BNP is released when ventricular walls are stretched). Continued dyspnea and orthopnea requiring multiple pillows (option D) indicates persistent symptoms of heart failure without improvement.",
      clinicalPearl: "Daily weight is the most reliable indicator of fluid status in heart failure; a 1 kg weight change = approximately 1 liter of fluid gain or loss",
      examStrategy: "For 'treatment effective' questions in heart failure, look for the answer showing improvement: decreased weight, cleared lung sounds, improved urine output, decreased BNP",
      clinicalTrap: "Increased BNP indicates WORSENING heart failure, not improvement; BNP should DECREASE with effective treatment",
      distractorRationales: {
        A: "Weight gain and persistent edema indicate the treatment is NOT effective; the patient is retaining fluid despite diuretic therapy",
        C: "An increase in BNP from 800 to 1200 pg/mL indicates worsening ventricular wall stress and heart failure progression, not treatment effectiveness",
        D: "Continued dyspnea on exertion and orthopnea (requiring multiple pillows) indicate persistent symptoms without improvement",
      },
      tags: ["cardiac", "heart-failure", "diuretics", "assessment", "treatment-evaluation", "BNP"],
      questionFormat: "MCQ",
      scenario: "ADHF patient on IV furosemide being evaluated for treatment effectiveness",
    },
    {
      topic: "Respiratory Management",
      subtopic: "Mechanical Ventilation",
      stem: "An RN is caring for a patient on mechanical ventilation in the ICU. The ventilator alarm sounds indicating high peak airway pressure. Which of the following should the RN assess? (Select all that apply.)",
      options: [
        { label: "A", text: "Kinked or obstructed endotracheal tube" },
        { label: "B", text: "Patient biting on the endotracheal tube" },
        { label: "C", text: "Increased secretions requiring suctioning" },
        { label: "D", text: "Disconnection of the ventilator circuit" },
        { label: "E", text: "Bronchospasm or worsening pneumothorax" },
        { label: "F", text: "Patient in a calm, cooperative state" },
      ],
      correctAnswer: ["A", "B", "C", "E"],
      rationale: "High peak airway pressure on a ventilator indicates increased resistance to airflow or decreased lung compliance. The RN must systematically assess for causes, working from the patient to the machine. Causes of high pressure include: (1) KINKED OR OBSTRUCTED ETT (option A) - the tube may be kinked, malpositioned, or obstructed by dried secretions, creating resistance to airflow. The RN should check the ETT position and patency. (2) PATIENT BITING THE ETT (option B) - if the patient is biting on the tube, airflow is obstructed, causing high pressures. An oral airway (bite block) may need to be inserted. (3) INCREASED SECRETIONS (option C) - mucus plugging or increased secretions in the airways increase resistance to airflow. The RN should assess for audible secretions and suction as needed using closed-suction technique. (4) BRONCHOSPASM OR PNEUMOTHORAX (option E) - bronchospasm (airway constriction) increases resistance, while tension pneumothorax decreases compliance and increases pressure. The RN should assess breath sounds bilaterally and administer prescribed bronchodilators. (5) Other causes include decreased lung compliance (ARDS, pulmonary edema), abdominal distension, patient-ventilator dyssynchrony, or fluid overload. Disconnection of the ventilator circuit (option D) would cause a LOW pressure alarm, not high pressure, because the circuit loses its seal when disconnected. A calm, cooperative patient (option F) is the desired state and would not cause high-pressure alarms; patient agitation or coughing could contribute to high pressures, but calmness does not.",
      clinicalPearl: "High pressure alarm = obstruction or compliance issue (look for cause from patient to machine); Low pressure alarm = disconnection or leak",
      examStrategy: "For ventilator alarm questions: HIGH pressure = something is blocked or lungs are stiff; LOW pressure = something is disconnected or leaking",
      clinicalTrap: "Circuit disconnection causes LOW pressure alarms, not HIGH; do not confuse the two alarm types",
      distractorRationales: {
        D: "Ventilator circuit disconnection would trigger a LOW pressure alarm, not a high pressure alarm, due to loss of circuit integrity",
        F: "A calm, cooperative patient would not trigger a high pressure alarm; patient agitation or coughing (the opposite of calm) could contribute",
      },
      tags: ["respiratory", "mechanical-ventilation", "ventilator-alarms", "ICU", "critical-care", "troubleshooting"],
      questionFormat: "SATA",
      scenario: "ICU patient on mechanical ventilation with high peak airway pressure alarm",
    },
    {
      topic: "Neurological Assessment",
      subtopic: "Stroke Assessment - NIHSS",
      stem: "An RN in the emergency department is assessing a 68-year-old patient who arrived with sudden onset left-sided facial droop, left arm weakness, and slurred speech. The symptoms began 90 minutes ago. The patient's blood pressure is 178/96 mmHg, and blood glucose is 126 mg/dL. Which priority intervention should the RN anticipate?",
      options: [
        { label: "A", text: "Administer sublingual nitroglycerin to lower the blood pressure before treatment" },
        { label: "B", text: "Prepare for emergent CT scan of the head without contrast to rule out hemorrhagic stroke before IV alteplase administration" },
        { label: "C", text: "Administer aspirin 325 mg PO immediately to prevent further clot formation" },
        { label: "D", text: "Position the patient flat and apply bilateral compression stockings" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is presenting with acute ischemic stroke symptoms (sudden onset focal neurological deficits: facial droop, arm weakness, slurred speech/dysarthria) within the thrombolytic treatment window. The current AHA/ASA guidelines recommend IV alteplase (tPA - tissue plasminogen activator) for eligible patients within 4.5 hours of symptom onset. However, BEFORE administering alteplase, a non-contrast CT scan of the head is ESSENTIAL to rule out hemorrhagic stroke (intracerebral hemorrhage or subarachnoid hemorrhage), because alteplase is a thrombolytic that dissolves blood clots and would be FATAL in a hemorrhagic stroke by worsening the bleeding. The treatment protocol is: (1) rapid neurological assessment using NIHSS (National Institutes of Health Stroke Scale), (2) emergent CT head without contrast (door-to-CT time goal: < 25 minutes), (3) obtain lab work (CBC, coagulation studies, basic metabolic panel, troponin, type and screen), (4) if CT shows no hemorrhage and patient meets inclusion criteria, administer IV alteplase within a door-to-needle time of < 60 minutes. The blood pressure of 178/96 requires monitoring but should NOT be aggressively lowered before alteplase (the threshold for treatment is BP > 185/110; below that, treatment should proceed). Aspirin (option C) should NOT be given within 24 hours of alteplase administration due to increased bleeding risk. Nitroglycerin (option A) is not indicated for stroke; aggressive BP lowering can worsen ischemia by reducing cerebral perfusion.",
      clinicalPearl: "CT head without contrast MUST be done before alteplase to rule out hemorrhagic stroke; door-to-CT < 25 min, door-to-needle < 60 min",
      examStrategy: "For acute stroke questions, the priority is always CT first (rule out hemorrhage), THEN thrombolytics if eligible; never give aspirin within 24 hours of tPA",
      clinicalTrap: "NEVER give aspirin within 24 hours before or after alteplase; the combination dramatically increases hemorrhage risk",
      distractorRationales: {
        A: "Nitroglycerin is not indicated for stroke management; aggressive BP lowering before treatment can worsen cerebral ischemia by reducing perfusion",
        C: "Aspirin should NOT be given until after CT rules out hemorrhage, and must be held for 24 hours if alteplase is administered",
        D: "Positioning flat and applying compression stockings do not address the acute stroke emergency; time-sensitive thrombolytic evaluation takes priority",
      },
      tags: ["neurological", "stroke", "alteplase", "tPA", "emergency", "CT-scan", "thrombolytic"],
      questionFormat: "prioritization",
      scenario: "68-year-old ED patient with acute ischemic stroke symptoms 90 minutes after onset",
    },
    {
      topic: "Endocrine Disorders",
      subtopic: "Diabetic Ketoacidosis (DKA)",
      stem: "An RN is caring for a patient admitted with diabetic ketoacidosis (DKA). The patient's lab values include: blood glucose 486 mg/dL, pH 7.18, bicarbonate 10 mEq/L, potassium 5.6 mEq/L, and serum osmolality 315 mOsm/kg. The patient is lethargic and has Kussmaul respirations. The physician orders an insulin drip and IV normal saline. What should the RN monitor MOST closely during initial treatment?",
      options: [
        { label: "A", text: "Urine specific gravity every 4 hours" },
        { label: "B", text: "Serum potassium levels and cardiac rhythm, as potassium will shift intracellularly with insulin administration" },
        { label: "C", text: "Daily weights and dietary intake" },
        { label: "D", text: "Skin turgor and mucous membrane moisture every shift" },
      ],
      correctAnswer: ["B"],
      rationale: "During DKA treatment, the MOST critical monitoring parameter is serum potassium because of the life-threatening shift that occurs with insulin therapy. In DKA, the initial serum potassium may be normal or elevated (as in this case, 5.6 mEq/L) despite a total body potassium deficit. This occurs because: (1) insulin deficiency prevents potassium from entering cells, keeping it in the extracellular space, (2) acidosis (pH 7.18) causes hydrogen ions to shift into cells, and potassium shifts out to maintain electrical neutrality, and (3) dehydration and reduced renal perfusion decrease potassium excretion. When insulin is administered, it facilitates the rapid shift of potassium BACK into cells (insulin activates the Na-K-ATPase pump), causing serum potassium to drop rapidly and potentially to dangerous levels (hypokalemia). Severe hypokalemia can cause fatal cardiac dysrhythmias (flat T waves, U waves, PVCs, VT, VF). The RN must: (1) monitor potassium levels every 1-2 hours initially, (2) maintain continuous cardiac monitoring for ECG changes of hypokalemia, (3) ensure IV potassium replacement is started when K+ drops below 5.3 mEq/L (some protocols start before insulin if K+ is < 3.3 mEq/L), and (4) NOT start insulin if potassium is < 3.3 mEq/L until it is repleted. The Kussmaul respirations (deep, rapid breathing) are the body's compensatory mechanism to blow off CO2 and reduce the metabolic acidosis. These will resolve as the pH normalizes with treatment.",
      clinicalPearl: "In DKA, serum K+ may appear normal/high but total body K+ is depleted; insulin drives K+ into cells, causing rapid drops that can be fatal; NEVER start insulin if K+ < 3.3 mEq/L",
      examStrategy: "For DKA treatment monitoring, potassium is always the most critical parameter because of the insulin-mediated intracellular shift; cardiac monitoring is essential",
      clinicalTrap: "A 'normal' or elevated potassium in DKA does NOT mean the patient has adequate potassium stores; total body K+ is depleted and will drop rapidly with insulin",
      distractorRationales: {
        A: "Urine specific gravity is a useful monitoring parameter but is not the MOST critical during initial DKA treatment",
        C: "Daily weights and dietary intake are important for ongoing management but are not the priority during acute DKA treatment",
        D: "Skin turgor and mucous membrane assessment are important for dehydration evaluation but are not the MOST critical parameter to monitor during insulin therapy",
      },
      tags: ["endocrine", "DKA", "diabetes", "potassium", "insulin", "critical-care", "metabolic-acidosis"],
      questionFormat: "MCQ",
      scenario: "DKA patient with pH 7.18, glucose 486 mg/dL, K+ 5.6 mEq/L receiving insulin drip and IV fluids",
    },
    {
      topic: "Renal & Urinary",
      subtopic: "Acute Kidney Injury",
      stem: "An RN is caring for a patient diagnosed with prerenal acute kidney injury (AKI) secondary to sepsis-related hypotension. The patient's labs show: BUN 42 mg/dL, creatinine 3.2 mg/dL, urine output 10 mL/hour for the past 4 hours, potassium 5.8 mEq/L. Which intervention does the RN anticipate as the PRIORITY?",
      options: [
        { label: "A", text: "Restrict all IV fluids to prevent fluid overload" },
        { label: "B", text: "Aggressive IV fluid resuscitation to restore renal perfusion while monitoring for fluid overload" },
        { label: "C", text: "Administer furosemide 80 mg IV to increase urine output" },
        { label: "D", text: "Prepare the patient for immediate hemodialysis" },
      ],
      correctAnswer: ["B"],
      rationale: "Prerenal AKI results from decreased renal perfusion, meaning the kidneys are structurally intact but are not receiving adequate blood flow to maintain filtration. In this case, the cause is sepsis-related hypotension. The PRIORITY treatment is to restore renal perfusion through IV fluid resuscitation, which addresses the underlying cause. When renal perfusion is restored, kidney function should improve and urine output should increase. The RN should anticipate: (1) IV crystalloid bolus (typically 500-1000 mL normal saline) with reassessment after each bolus, (2) continuous hemodynamic monitoring (BP, HR, CVP if central line present), (3) strict intake and output monitoring with hourly urine output measurement, (4) monitoring for signs of fluid overload (pulmonary crackles, JVD, peripheral edema) as fluid is administered, and (5) monitoring potassium closely given the level of 5.8 mEq/L. Restricting fluids (option A) would worsen the prerenal hypoperfusion and potentially cause irreversible kidney damage (intrarenal AKI). Furosemide (option C) may be considered later but giving a diuretic to an already hypoperfused patient could worsen the AKI by further reducing renal blood flow. Hemodialysis (option D) is reserved for life-threatening complications of AKI (refractory hyperkalemia, severe metabolic acidosis, uremic symptoms, fluid overload not responsive to diuretics) and is not the first-line treatment for prerenal AKI where the underlying cause (hypoperfusion) can be corrected. The oliguria (< 0.5 mL/kg/hr) and elevated BUN:creatinine ratio (> 20:1) are classic findings of prerenal AKI.",
      clinicalPearl: "Prerenal AKI = perfusion problem; treatment = restore perfusion with IV fluids; BUN:creatinine ratio > 20:1 suggests prerenal cause",
      examStrategy: "For AKI questions, identify the TYPE first (prerenal, intrarenal, postrenal); prerenal = give fluids, intrarenal = protect kidneys, postrenal = relieve obstruction",
      clinicalTrap: "Do NOT give diuretics to a patient with prerenal AKI from hypoperfusion; this worsens the problem by further reducing renal blood flow",
      distractorRationales: {
        A: "Restricting fluids in prerenal AKI would worsen hypoperfusion and potentially cause irreversible intrarenal damage",
        C: "Furosemide in a hypoperfused patient could worsen AKI; it does not address the underlying cause of decreased perfusion",
        D: "Hemodialysis is reserved for complications of AKI (refractory hyperkalemia, severe acidosis, uremia, volume overload); it is not first-line for prerenal AKI",
      },
      tags: ["renal", "AKI", "prerenal", "fluid-resuscitation", "sepsis", "critical-care"],
      questionFormat: "MCQ",
      scenario: "Prerenal AKI patient with sepsis-related hypotension, oliguria, elevated BUN/creatinine, and hyperkalemia",
    },
    {
      topic: "Delegation & Prioritization",
      subtopic: "RN Delegation to LPN",
      stem: "An RN is charge nurse on a medical-surgical unit with 20 patients. The team includes 1 additional RN, 2 LPNs, and 2 UAPs. Which patient assignments are MOST appropriate? (Select all that apply.)",
      options: [
        { label: "A", text: "Assign the LPN to administer routine oral and IM medications to stable patients" },
        { label: "B", text: "Assign the UAP to perform initial admission assessments on new patients" },
        { label: "C", text: "Assign the RN to care for the patient receiving IV chemotherapy" },
        { label: "D", text: "Assign the LPN to monitor a patient on a PCA pump who is stable and alert" },
        { label: "E", text: "Assign the UAP to administer PRN pain medications to post-surgical patients" },
        { label: "F", text: "Assign the RN to care for the patient who is 2 hours post-cardiac catheterization" },
      ],
      correctAnswer: ["A", "C", "D", "F"],
      rationale: "Effective delegation requires matching patient acuity with the appropriate level of care provider. The correct assignments are: (A) LPNs can administer routine oral and IM medications to stable patients within their scope of practice. (C) IV chemotherapy administration requires RN-level assessment and specialized training due to the high-risk nature of cytotoxic drugs, vesicant extravasation risks, and potential for severe allergic reactions. (D) An LPN can monitor a stable, alert patient on a PCA pump, as the pump delivers pre-set doses and the LPN can assess pain levels, sedation, and respiratory status. However, the RN should perform the initial setup and programming of the PCA pump. (F) Post-cardiac catheterization patients require frequent RN assessment of the access site (femoral or radial) for hemorrhage, hematoma, pseudoaneurysm, and distal perfusion (pulse checks, sensation, warmth, and colour of the extremity). Incorrect assignments: (B) Initial admission assessments are a NURSING function requiring licensed personnel; UAPs cannot perform assessments. (E) Medication administration is a licensed activity; UAPs cannot administer any medications, including PRN pain medications. The charge RN must apply the five rights of delegation and maintain accountability for all delegated tasks.",
      clinicalPearl: "Delegate stable, predictable patients to LPNs; retain complex, unstable, or high-risk patients for RNs; UAPs perform data collection and basic care only",
      examStrategy: "For delegation SATA questions, eliminate any option that assigns assessment, medication administration, or teaching to UAPs; these are always wrong",
      clinicalTrap: "UAPs can NEVER administer medications or perform assessments; these are licensed nursing functions regardless of patient stability",
      distractorRationales: {
        B: "Initial admission assessments require licensed personnel (RN or LPN under RN direction); UAPs cannot perform nursing assessments",
        E: "Medication administration is a licensed nursing function; UAPs cannot administer any medications including PRN medications",
      },
      tags: ["delegation", "leadership", "charge-nurse", "scope-of-practice", "teamwork", "patient-safety"],
      questionFormat: "SATA",
      scenario: "Charge RN assigning patients and tasks to RNs, LPNs, and UAPs on a medical-surgical unit",
    },
    {
      topic: "GI & Hepatic",
      subtopic: "Liver Cirrhosis Complications",
      stem: "An RN is caring for a patient with liver cirrhosis who presents with a distended abdomen, peripheral edema, and confusion. The serum ammonia level is 120 mcg/dL (normal: 15-45 mcg/dL). The physician orders lactulose 30 mL PO TID. What is the therapeutic goal of lactulose administration for this patient?",
      options: [
        { label: "A", text: "To increase the absorption of ammonia in the gastrointestinal tract" },
        { label: "B", text: "To produce 2-3 soft stools per day, decreasing intestinal ammonia absorption by converting ammonia to ammonium for fecal excretion" },
        { label: "C", text: "To reduce portal hypertension by decreasing blood flow through the portal vein" },
        { label: "D", text: "To replace beneficial gut bacteria and improve intestinal motility" },
      ],
      correctAnswer: ["B"],
      rationale: "This patient is presenting with hepatic encephalopathy (HE), a serious complication of liver cirrhosis characterized by neuropsychiatric changes (confusion, asterixis, personality changes, and in severe cases, coma) caused by the accumulation of ammonia (NH3) and other toxins that the damaged liver can no longer metabolize. Lactulose is the first-line treatment for hepatic encephalopathy. Its mechanism of action involves: (1) ACIDIFICATION of the colonic environment - lactulose is a synthetic disaccharide that is not absorbed in the small intestine. In the colon, bacteria metabolize it into lactic acid and acetic acid, lowering the colonic pH. (2) CONVERSION of ammonia to ammonium - the acidic environment converts ammonia (NH3, which crosses the intestinal membrane and enters the bloodstream) to ammonium (NH4+, which is ionized, cannot cross the membrane, and remains trapped in the colon). (3) OSMOTIC LAXATIVE effect - lactulose draws water into the colon and promotes increased bowel movements (goal: 2-3 soft stools per day), which physically eliminates ammonia-laden contents from the body. The RN must monitor: stool frequency and consistency (therapeutic goal: 2-3 soft stools/day), serum ammonia levels, neurological status (orientation, asterixis, level of consciousness), fluid and electrolyte balance (lactulose can cause dehydration and electrolyte imbalances), and for signs of excessive diarrhea (which can worsen dehydration). Rifaximin (a non-absorbable antibiotic) is often used in combination with lactulose for HE treatment and prophylaxis.",
      clinicalPearl: "Lactulose goal: 2-3 soft stools/day; too few = ineffective ammonia reduction; too many = dehydration and electrolyte imbalance; monitor neurological status",
      examStrategy: "Lactulose = trap ammonia in colon by acidification (NH3 to NH4+) and eliminate via stool; therapeutic endpoint = 2-3 soft stools per day, NOT diarrhea",
      clinicalTrap: "Excessive diarrhea from lactulose is NOT the goal and can worsen the patient's condition by causing dehydration and electrolyte imbalances",
      distractorRationales: {
        A: "Lactulose DECREASES ammonia absorption, not increases it; it traps ammonia as ammonium in the colon for elimination",
        C: "Lactulose does not affect portal hypertension; it works in the GI tract to reduce ammonia absorption",
        D: "While lactulose is metabolized by gut bacteria, its primary purpose is ammonia reduction, not probiotic replacement",
      },
      tags: ["GI", "hepatic", "cirrhosis", "hepatic-encephalopathy", "lactulose", "ammonia", "pharmacology"],
      questionFormat: "MCQ",
      scenario: "Cirrhosis patient with hepatic encephalopathy, elevated serum ammonia, and confusion",
    },
    {
      topic: "Maternal-Newborn & Women's Health",
      subtopic: "Preeclampsia Management",
      stem: "An RN is caring for a 34-week pregnant patient diagnosed with severe preeclampsia. The patient's blood pressure is 168/110 mmHg, proteinuria is 3+, and the patient reports a severe headache and visual disturbances (seeing spots). The physician orders magnesium sulfate 4 g IV loading dose over 20 minutes, followed by a maintenance infusion of 2 g/hour. What is the MOST important assessment the RN must perform during magnesium sulfate administration?",
      options: [
        { label: "A", text: "Monitor blood glucose levels every hour" },
        { label: "B", text: "Assess deep tendon reflexes (DTRs), respiratory rate, and urine output; keep calcium gluconate at the bedside as the antidote" },
        { label: "C", text: "Monitor liver function tests every 30 minutes" },
        { label: "D", text: "Auscultate lung sounds every 4 hours" },
      ],
      correctAnswer: ["B"],
      rationale: "Magnesium sulfate is the drug of choice for seizure prophylaxis in severe preeclampsia and for treatment of eclamptic seizures. However, magnesium has a narrow therapeutic window (4-7 mEq/L therapeutic range), and toxicity can be fatal. The RN's priority assessments during magnesium sulfate administration include: (1) DEEP TENDON REFLEXES (DTRs) - loss of DTRs is the earliest sign of magnesium toxicity (occurs at levels of 7-10 mEq/L). The nurse should assess patellar reflexes every 1-2 hours; if DTRs are absent, the infusion must be stopped immediately. (2) RESPIRATORY RATE - respiratory depression occurs at magnesium levels of 10-12 mEq/L. The respiratory rate must be assessed every hour and should be maintained above 12 breaths/minute. If RR falls below 12, the infusion must be stopped immediately. (3) URINE OUTPUT - magnesium is excreted by the kidneys, so adequate renal function (urine output ≥ 30 mL/hour) is essential to prevent accumulation and toxicity. (4) CALCIUM GLUCONATE - must be kept at the bedside as the antidote for magnesium sulfate toxicity. Calcium gluconate 1 g IV given over 3 minutes reverses the effects of magnesium by competing for membrane receptor sites. The toxicity progression is: loss of DTRs (7-10 mEq/L), respiratory depression (10-12 mEq/L), cardiac arrest (>15 mEq/L). The RN should also monitor for therapeutic effects: decreased BP, resolution of headache, decreased proteinuria, and absence of seizure activity. Fetal monitoring should continue continuously.",
      clinicalPearl: "Magnesium toxicity progression: loss of DTRs (earliest sign) then respiratory depression then cardiac arrest; calcium gluconate is the antidote - ALWAYS at bedside",
      examStrategy: "For magnesium sulfate questions: DTRs + RR + urine output + calcium gluconate at bedside; if DTRs absent OR RR < 12 OR output < 30 mL/hr, STOP the infusion",
      clinicalTrap: "Loss of DTRs precedes respiratory depression; if you miss the DTR check, the next sign may be respiratory arrest",
      distractorRationales: {
        A: "Blood glucose monitoring is not specific to magnesium sulfate administration; it is not the MOST important assessment",
        C: "Liver function tests are important in HELLP syndrome but are not checked every 30 minutes; DTRs and respiratory rate are more immediately life-saving assessments",
        D: "Lung sounds every 4 hours is too infrequent; respiratory rate should be assessed every hour during magnesium sulfate infusion",
      },
      tags: ["maternal-newborn", "preeclampsia", "magnesium-sulfate", "toxicity", "calcium-gluconate", "obstetric-emergency"],
      questionFormat: "MCQ",
      scenario: "34-week pregnant patient with severe preeclampsia receiving magnesium sulfate for seizure prophylaxis",
    },
    {
      topic: "Mental Health & Psychiatric",
      subtopic: "Substance Withdrawal Assessment",
      stem: "An RN in the emergency department is caring for a patient who was admitted 12 hours ago and has a history of chronic alcohol use (reports drinking a fifth of vodka daily for 10 years). The patient is now diaphoretic, tremulous, has a heart rate of 118 bpm, BP 162/98 mmHg, and reports seeing 'bugs crawling on the walls.' The CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol) score is 28. What is the RN's priority concern?",
      options: [
        { label: "A", text: "The patient is at risk for alcohol withdrawal seizures and delirium tremens and requires emergent benzodiazepine administration per CIWA protocol" },
        { label: "B", text: "The patient is experiencing a psychiatric emergency and needs antipsychotic medication for the hallucinations" },
        { label: "C", text: "The patient is dehydrated and needs IV fluid bolus only" },
        { label: "D", text: "The patient is experiencing caffeine withdrawal and needs dietary education" },
      ],
      correctAnswer: ["A"],
      rationale: "This patient is in severe alcohol withdrawal with a CIWA-Ar score of 28 (scores > 20 indicate severe withdrawal requiring aggressive pharmacological management). The CIWA-Ar scale assesses 10 parameters: nausea/vomiting, tremor, paroxysmal sweats, anxiety, agitation, tactile disturbances, auditory disturbances, visual disturbances, headache, and orientation/clouding of sensorium. A score ≥ 20 indicates severe withdrawal requiring intensive care. The patient's symptoms represent the progression of alcohol withdrawal syndrome (AWS): Stage 1 (6-12 hours): tremors, anxiety, diaphoresis, tachycardia, hypertension, insomnia. Stage 2 (12-24 hours): visual, auditory, or tactile hallucinations (the patient reporting 'bugs crawling on the walls' indicates visual hallucinations, characteristic of this stage). Stage 3 (24-48 hours): withdrawal seizures (grand mal). Stage 4 (48-96 hours): delirium tremens (DTs) - the most severe and potentially fatal form of withdrawal, characterized by severe confusion, agitation, hallucinations, cardiovascular instability, and hyperthermia. DTs carry a mortality rate of 5-15% without treatment. Benzodiazepines (diazepam, lorazepam, or chlordiazepoxide) are the first-line treatment because they work on the same GABA-A receptors as alcohol, replacing the depressant effect and preventing the excitotoxic cascade that leads to seizures and DTs. The CIWA protocol guides symptom-triggered dosing for optimal management. Antipsychotics (option B) are NOT first-line for alcohol withdrawal hallucinations because they lower the seizure threshold; haloperidol may be used adjunctively for severe agitation but only AFTER adequate benzodiazepine coverage.",
      clinicalPearl: "CIWA-Ar score > 20 = severe withdrawal; benzodiazepines are ALWAYS first-line (GABA receptor agonists); antipsychotics lower seizure threshold and are NOT first-line",
      examStrategy: "For alcohol withdrawal questions: benzodiazepines are always the correct first-line treatment; they prevent seizures and DTs; antipsychotics lower seizure threshold",
      clinicalTrap: "Antipsychotics (haloperidol) LOWER the seizure threshold in alcohol withdrawal; they are NOT first-line and can worsen the condition if given without benzodiazepine coverage",
      distractorRationales: {
        B: "The hallucinations are caused by alcohol withdrawal, not a primary psychiatric disorder; antipsychotics lower seizure threshold and are not first-line for AWS",
        C: "While the patient likely needs IV fluids, addressing the severe withdrawal with benzodiazepines is the PRIORITY to prevent seizures and DTs",
        D: "Caffeine withdrawal does not cause the severity of symptoms described; this clinical presentation is classic for alcohol withdrawal syndrome",
      },
      tags: ["mental-health", "alcohol-withdrawal", "CIWA", "benzodiazepines", "delirium-tremens", "emergency", "substance-use"],
      questionFormat: "MCQ",
      scenario: "Chronic alcohol user in severe withdrawal with CIWA-Ar score 28, visual hallucinations, and autonomic instability",
    },
    {
      topic: "Leadership & Management",
      subtopic: "Quality Improvement - Root Cause Analysis",
      stem: "An RN is the charge nurse when a medication error occurs: a patient receives warfarin 10 mg instead of the ordered 5 mg due to a look-alike/sound-alike medication stored next to each other in the medication dispensing cabinet. After ensuring patient safety, which quality improvement action should the RN initiate?",
      options: [
        { label: "A", text: "Document the error in an incident report using a just culture, non-punitive approach, and initiate a root cause analysis to identify system failures" },
        { label: "B", text: "Counsel the nurse who made the error privately and suggest remedial medication administration training" },
        { label: "C", text: "Report the error to the state board of nursing for disciplinary action against the responsible nurse" },
        { label: "D", text: "Ignore the error since the patient was not seriously harmed" },
      ],
      correctAnswer: ["A"],
      rationale: "The Institute for Healthcare Improvement (IHI) and The Joint Commission advocate for a 'just culture' approach to medical errors that focuses on system improvement rather than individual blame. When a medication error occurs, the charge RN should: (1) ENSURE PATIENT SAFETY first (assess the patient, notify the physician, provide any necessary treatment), (2) COMPLETE AN INCIDENT REPORT - this is a non-punitive, factual documentation of the event used for quality improvement purposes. It is NOT part of the patient's medical record and should not assign blame. (3) INITIATE ROOT CAUSE ANALYSIS (RCA) - a systematic process to identify the underlying system factors that contributed to the error. In this case, the root causes may include: look-alike/sound-alike (LASA) medications stored adjacently, inadequate separation of similar medications in the dispensing cabinet, lack of tall-man lettering or alerting systems, barcode scanning bypass, and workload or environmental factors. (4) IMPLEMENT CORRECTIVE ACTIONS based on the RCA findings, such as physical separation of LASA medications, adding warning labels, implementing independent double-checks, and modifying storage locations. Individual counseling (option B) may be appropriate as part of a comprehensive response but focuses on the individual rather than the system. Reporting to the board (option C) is for egregious conduct, not system-related errors. Ignoring the error (option D) prevents system learning and allows the same error to recur.",
      clinicalPearl: "Just culture focuses on system failures, not individual blame; root cause analysis identifies WHY errors occur so systems can be redesigned to prevent recurrence",
      examStrategy: "For quality improvement questions, choose the answer that addresses SYSTEM issues through RCA and incident reporting, not individual punishment",
      clinicalTrap: "An incident report is a quality improvement tool, NOT a punitive document; it should never be placed in the patient's medical record",
      distractorRationales: {
        B: "Individual counseling alone does not address the underlying system factors (LASA medication storage) that caused the error",
        C: "Board reporting is reserved for egregious misconduct, impairment, or pattern of practice issues; a system-related error warrants RCA, not disciplinary action",
        D: "Ignoring any medication error prevents system learning and allows the same error to recur with potentially worse outcomes",
      },
      tags: ["leadership", "quality-improvement", "medication-error", "root-cause-analysis", "just-culture", "patient-safety"],
      questionFormat: "MCQ",
      scenario: "Charge RN managing a look-alike/sound-alike medication error involving warfarin dosing",
    },
  ];

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    const difficulty = s.questionFormat === "SATA" ? 4 : (i % 5 === 0 ? 5 : i % 3 === 0 ? 2 : 3);
    const domain = assignBlueprintDomain(s.topic, RN_BLUEPRINT_DOMAINS);
    questions.push({
      tier,
      exam,
      questionType: s.questionFormat,
      status: "published",
      stem: s.stem,
      options: JSON.stringify(s.options),
      correctAnswer: JSON.stringify(s.correctAnswer),
      rationale: s.rationale,
      difficulty,
      tags: s.tags,
      bodySystem: domain,
      topic: s.topic,
      subtopic: s.subtopic,
      regionScope,
      stemHash: stemHash(s.stem),
      scenario: s.scenario,
      clinicalPearl: s.clinicalPearl,
      examStrategy: s.examStrategy,
      clinicalTrap: s.clinicalTrap,
      distractorRationales: JSON.stringify(s.distractorRationales),
      cognitiveLevel: assignCognitiveLevel(difficulty),
      questionFormat: s.questionFormat,
      careerType: "nursing",
      blueprintDomain: domain,
    });
  }

  return questions;
}

async function insertQuestions(questions: QuestionRecord[], label: string): Promise<number> {
  let inserted = 0;
  let duplicates = 0;

  for (const q of questions) {
    try {
      const existing = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 LIMIT 1`,
        [q.stemHash, q.tier, q.exam]
      );
      if (existing.rows.length > 0) {
        duplicates++;
        continue;
      }

      await pool.query(
        `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, clinical_trap, distractor_rationales, career_type, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW(), NOW())`,
        [
          q.tier, q.exam, q.questionType, q.status, q.stem,
          q.options, q.correctAnswer, q.rationale, q.difficulty,
          q.tags, q.bodySystem, q.topic, q.subtopic, q.regionScope,
          q.stemHash, q.scenario, q.clinicalPearl, q.examStrategy,
          q.clinicalTrap, q.distractorRationales, q.careerType,
        ]
      );
      inserted++;
    } catch (err: any) {
      console.error(`  [ERROR] ${label}: ${err.message}`);
    }
  }

  console.log(`  ${label}: inserted ${inserted}, duplicates ${duplicates}, total attempted ${questions.length}`);
  return inserted;
}

async function triggerAIPipeline(tier: string, exam: string, targetCount: number, countryCode: string, topic: string): Promise<void> {
  const { startPipelineRun } = await import("../qbank-pipeline");
  console.log(`  Triggering AI pipeline: ${exam} / ${topic} / ${targetCount} questions`);

  try {
    const run = await startPipelineRun({
      tier,
      examType: exam,
      topic,
      targetCount,
      countryCode,
    });
    console.log(`  Pipeline run started: ${run.id}`);

    let attempts = 0;
    const maxAttempts = 120;
    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 5000));
      const { getPipelineRun } = await import("../qbank-pipeline");
      const current = getPipelineRun(run.id);
      if (!current || current.status === "completed" || current.status === "failed") {
        console.log(`  Pipeline run ${run.id}: status=${current?.status}, valid=${current?.validCount}, errors=${current?.errorCount}`);
        break;
      }
      attempts++;
      if (attempts % 12 === 0) {
        console.log(`  Pipeline ${run.id}: ${current.validCount}/${targetCount} generated (${current.status})`);
      }
    }
  } catch (err: any) {
    console.error(`  Pipeline error for ${exam}/${topic}: ${err.message}`);
  }
}

async function main() {
  console.log("=== RPN & RN Question Bank Scaling ===");
  console.log("Target: 500+ RPN/PN questions, 500+ RN questions\n");

  const beforeCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("BEFORE counts:");
  for (const r of beforeCounts.rows) {
    console.log(`  ${r.tier} / ${r.exam}: ${r.count}`);
  }
  console.log();

  console.log("--- Step 1: Generating hand-crafted REx-PN questions (Canadian context) ---");
  const rexPNBase = buildRExPNQuestions();
  const rexPNInserted = await insertQuestions(rexPNBase, "REx-PN base");

  console.log("--- Step 2: Generating hand-crafted NCLEX-PN questions (US context) ---");
  const nclexPNBase = buildNCLEXPNQuestions();
  const nclexPNInserted = await insertQuestions(nclexPNBase, "NCLEX-PN base");

  console.log("--- Step 3: Generating hand-crafted NCLEX-RN questions ---");
  const nclexRNBase = buildNCLEXRNQuestions();
  const nclexRNInserted = await insertQuestions(nclexRNBase, "NCLEX-RN base");

  console.log("\n--- Step 4: Generating template-based variations for REx-PN ---");
  const rexPNVariations = generateTopicVariations("REx-PN", "REx-PN", "rpn", "CA", 60);
  const rexPNVarInserted = await insertQuestions(rexPNVariations, "REx-PN variations");

  console.log("--- Step 5: Generating template-based variations for NCLEX-PN ---");
  const nclexPNVariations = generateTopicVariations("NCLEX-PN", "NCLEX-PN", "rpn", "US", 60);
  const nclexPNVarInserted = await insertQuestions(nclexPNVariations, "NCLEX-PN variations");

  console.log("--- Step 6: Generating template-based variations for NCLEX-RN ---");
  const nclexRNVariations = generateTopicVariations("NCLEX-RN", "NCLEX-RN", "rn", "BOTH", 60);
  const nclexRNVarInserted = await insertQuestions(nclexRNVariations, "NCLEX-RN variations");

  console.log("\n--- Step 7: AI Pipeline Generation ---");
  const aiTopicsRExPN = ["Patient Safety", "Infection Control", "Medication Administration", "Wound Care", "Pain Management",
    "Fluid & Electrolytes", "Vital Signs Assessment", "Nutrition", "Elimination", "Perioperative Care",
    "Mental Health Basics", "Maternal-Newborn", "Pediatric Nursing", "Geriatric Care", "Delegation & Scope",
    "Documentation", "Communication", "Ethics & Legal", "Emergency Response", "Fundamentals of Nursing"];

  const aiTopicsNCLEXPN = ["Safety and Infection Control", "Pharmacological Therapies", "Physiological Integrity",
    "Health Promotion and Maintenance", "Psychosocial Integrity", "Safe and Effective Care Environment",
    "Diabetes Management", "Bowel Obstruction Assessment", "Chest Tube Management"];

  const aiTopicsNCLEXRN = ["Critical Thinking & Clinical Judgment", "Pharmacology", "Medical-Surgical Nursing",
    "Cardiac & Hemodynamic Monitoring", "Respiratory Management", "Neurological Assessment",
    "Renal & Urinary", "Endocrine Disorders", "GI & Hepatic", "Hematology & Oncology",
    "Immune & Infectious Disease", "Maternal-Newborn & Women's Health", "Mental Health & Psychiatric",
    "Emergency & Trauma Nursing", "Leadership & Management", "Delegation & Prioritization"];

  for (const topic of aiTopicsRExPN) {
    await triggerAIPipeline("rpn", "REx-PN", 15, "CA", topic);
  }

  for (const topic of aiTopicsNCLEXPN) {
    await triggerAIPipeline("rpn", "NCLEX-PN", 30, "US", topic);
  }

  for (const topic of aiTopicsNCLEXRN) {
    await triggerAIPipeline("rn", "NCLEX-RN", 30, "BOTH", topic);
  }

  console.log("\n--- Step 8: Bulk update all generated questions to published ---");
  const publishResult = await pool.query(
    `UPDATE exam_questions SET status = 'published', updated_at = NOW()
     WHERE tier IN ('rpn', 'rn') AND exam IN ('REx-PN', 'NCLEX-PN', 'NCLEX-RN')
     AND status != 'published'`
  );
  console.log(`Published ${publishResult.rowCount} questions that were not yet published`);

  console.log("\n--- Step 9: Deduplication check ---");
  const dupeCheck = await pool.query(
    `SELECT stem_hash, tier, exam, COUNT(*)::int as cnt
     FROM exam_questions
     WHERE tier IN ('rpn', 'rn') AND exam IN ('REx-PN', 'NCLEX-PN', 'NCLEX-RN')
     AND stem_hash IS NOT NULL
     GROUP BY stem_hash, tier, exam
     HAVING COUNT(*) > 1
     ORDER BY cnt DESC
     LIMIT 20`
  );

  if (dupeCheck.rows.length > 0) {
    console.log(`Found ${dupeCheck.rows.length} duplicate stem hashes. Removing extras...`);
    for (const r of dupeCheck.rows) {
      const dupes = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 ORDER BY created_at ASC`,
        [r.stem_hash, r.tier, r.exam]
      );
      const idsToDelete = dupes.rows.slice(1).map((d: any) => d.id);
      if (idsToDelete.length > 0) {
        await pool.query(`DELETE FROM exam_questions WHERE id = ANY($1)`, [idsToDelete]);
        console.log(`  Removed ${idsToDelete.length} duplicates for hash ${r.stem_hash}`);
      }
    }
  } else {
    console.log("No duplicates found.");
  }

  console.log("\n--- Step 10: Validation check ---");
  const noRationale = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     AND (rationale IS NULL OR rationale = '')`
  );
  console.log(`Questions without rationales: ${noRationale.rows[0].cnt}`);

  const noTags = await pool.query(
    `SELECT COUNT(*)::int as cnt FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     AND (tags IS NULL OR array_length(tags, 1) IS NULL)`
  );
  console.log(`Questions without tags: ${noTags.rows[0].cnt}`);

  console.log("\n=== FINAL COUNTS ===");
  const afterCounts = await pool.query(
    `SELECT tier, exam, status, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY tier, exam, status ORDER BY tier, exam, status`
  );
  for (const r of afterCounts.rows) {
    console.log(`  ${r.tier} / ${r.exam} / ${r.status}: ${r.count}`);
  }

  const formatDist = await pool.query(
    `SELECT tier, exam, question_type, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY tier, exam, question_type ORDER BY tier, exam, count DESC`
  );
  console.log("\nFormat distribution:");
  for (const r of formatDist.rows) {
    console.log(`  ${r.tier}/${r.exam}: ${r.question_type} = ${r.count}`);
  }

  const diffDist = await pool.query(
    `SELECT tier, exam, difficulty, COUNT(*)::int as count FROM exam_questions
     WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY tier, exam, difficulty ORDER BY tier, exam, difficulty`
  );
  console.log("\nDifficulty distribution:");
  for (const r of diffDist.rows) {
    console.log(`  ${r.tier}/${r.exam}: difficulty ${r.difficulty} = ${r.count}`);
  }

  const topicDist = await pool.query(
    `SELECT tier, exam, COALESCE(topic, 'Unknown') as topic, COUNT(*)::int as cnt
     FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN')
     GROUP BY tier, exam, COALESCE(topic, 'Unknown')
     ORDER BY tier, exam, cnt DESC`
  );
  console.log("\nTopic distribution:");
  let currentExam = "";
  for (const r of topicDist.rows) {
    const key = `${r.tier}/${r.exam}`;
    if (key !== currentExam) {
      currentExam = key;
      console.log(`\n  ${key}:`);
    }
    console.log(`    ${r.topic}: ${r.cnt}`);
  }

  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
