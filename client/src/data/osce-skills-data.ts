export interface OSCEStep {
  id: string;
  instruction: string;
  rationale: string;
  criticalStep: boolean;
}

export type OSCECategory =
  | "Assessment"
  | "Hygiene"
  | "Procedure"
  | "Drain & Tube Care"
  | "Core Skills"
  | "Acute Care"
  | "Maternal & Newborn"
  | "Pediatric"
  | "Mental Health"
  | "Communication"
  | "Geriatric Care"
  | "Community Health"
  | "Critical Care";

export interface ExaminerChecklistItem {
  action: string;
  marks: number;
}

export interface ExaminerQuestion {
  question: string;
  answer: string;
}

export interface OSCESkillStation {
  id: string;
  title: string;
  category: OSCECategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  description: string;
  scenarioIntro: string;
  equipment: string[];
  steps: OSCEStep[];
  commonErrors: string[];
  passingCriteria: string;
  clinicalPearls: string[];
  examLevel?: string;
  timeLimit?: string;
  candidateInstructions?: string;
  patientActorScript?: string;
  examinerChecklist?: ExaminerChecklistItem[];
  criticalFailCriteria?: string[];
  examinerQuestions?: ExaminerQuestion[];
  teachingPoints?: string[];
}

export const osceSkillStations: OSCESkillStation[] = [
  {
    id: "head-to-toe-assessment",
    title: "Head-to-Toe Assessment",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "User",
    description: "Perform a systematic head-to-toe physical assessment on an adult patient, using inspection, palpation, percussion, and auscultation in the correct sequence.",
    scenarioIntro: "You are a nurse beginning your shift on a medical-surgical unit. Your patient is a 62-year-old admitted for observation following a syncopal episode. The physician has ordered a complete head-to-toe assessment. The patient is alert, oriented, and cooperative.",
    equipment: [
      "Stethoscope",
      "Penlight",
      "Blood pressure cuff (sphygmomanometer)",
      "Pulse oximeter",
      "Thermometer",
      "Watch with second hand",
      "Tongue depressor",
      "Cotton ball and sharp object (for sensory testing)",
      "Reflex hammer",
      "Tape measure",
      "Scale",
      "Clean gloves",
      "Documentation tools"
    ],
    steps: [
      { id: "htt-1", instruction: "Perform hand hygiene and gather all necessary equipment.", rationale: "Prevents transmission of microorganisms and ensures an efficient, uninterrupted assessment.", criticalStep: true },
      { id: "htt-2", instruction: "Identify the patient using two identifiers and introduce yourself.", rationale: "Confirms correct patient and establishes rapport. Two-identifier verification is a patient safety standard.", criticalStep: true },
      { id: "htt-3", instruction: "Explain the procedure to the patient and obtain verbal consent.", rationale: "Informed consent respects patient autonomy and reduces anxiety.", criticalStep: false },
      { id: "htt-4", instruction: "Ensure privacy by closing the curtain or door and draping the patient appropriately.", rationale: "Maintains patient dignity and promotes comfort during the examination.", criticalStep: false },
      { id: "htt-5", instruction: "Obtain vital signs: temperature, pulse, respirations, blood pressure, oxygen saturation, and pain level.", rationale: "Vital signs provide baseline data and may reveal abnormalities requiring immediate attention.", criticalStep: true },
      { id: "htt-6", instruction: "Assess general appearance, level of consciousness, and overall condition.", rationale: "Provides an initial impression of the patient's health status and mental orientation.", criticalStep: false },
      { id: "htt-7", instruction: "Inspect the head: scalp, hair, face symmetry, and skin integrity.", rationale: "Identifies lesions, asymmetry (possible stroke indicators), or signs of injury.", criticalStep: false },
      { id: "htt-8", instruction: "Assess eyes: pupil size, equality, reactivity to light (PERRLA), and visual acuity.", rationale: "Pupil assessment screens for neurological dysfunction; unequal pupils may indicate increased intracranial pressure.", criticalStep: false },
      { id: "htt-9", instruction: "Inspect ears, nose, and throat; assess hearing and oral mucosa.", rationale: "Detects infection, obstruction, or lesions in the ENT structures.", criticalStep: false },
      { id: "htt-10", instruction: "Assess the neck: lymph nodes, thyroid gland, jugular venous distension (JVD), and range of motion.", rationale: "Lymphadenopathy may indicate infection or malignancy; JVD suggests right-sided heart failure or fluid overload.", criticalStep: false },
      { id: "htt-11", instruction: "Inspect and auscultate the chest: anterior and posterior lung fields bilaterally.", rationale: "Identifies abnormal breath sounds (crackles, wheezes, diminished sounds) that indicate respiratory pathology.", criticalStep: true },
      { id: "htt-12", instruction: "Auscultate heart sounds in all four valve areas (aortic, pulmonic, tricuspid, mitral).", rationale: "Detects murmurs, extra heart sounds (S3, S4), or irregular rhythms.", criticalStep: true },
      { id: "htt-13", instruction: "Inspect the abdomen, then auscultate bowel sounds in all four quadrants before palpation.", rationale: "Auscultation must occur before palpation to avoid altering bowel motility. Absent or hyperactive sounds are clinically significant.", criticalStep: true },
      { id: "htt-14", instruction: "Lightly palpate the abdomen in all four quadrants, followed by deep palpation if indicated.", rationale: "Identifies tenderness, guarding, masses, or organ enlargement.", criticalStep: false },
      { id: "htt-15", instruction: "Assess peripheral vascular status: peripheral pulses (radial, dorsalis pedis, posterior tibial), capillary refill, and edema.", rationale: "Evaluates circulation; absent pulses or prolonged capillary refill may indicate vascular compromise.", criticalStep: false },
      { id: "htt-16", instruction: "Inspect the skin from head to toe: color, turgor, moisture, temperature, and integrity.", rationale: "Identifies pressure injuries, rashes, cyanosis, jaundice, or signs of dehydration.", criticalStep: false },
      { id: "htt-17", instruction: "Perform a focused neurological assessment: orientation, cranial nerves, motor strength, sensation, and reflexes.", rationale: "Screens for neurological deficits; changes from baseline require urgent follow-up.", criticalStep: false },
      { id: "htt-18", instruction: "Assess musculoskeletal status: range of motion, gait, and muscle strength.", rationale: "Identifies limitations in mobility that affect safety and fall risk.", criticalStep: false },
      { id: "htt-19", instruction: "Assist the patient to a comfortable position, ensure the call bell is within reach, and raise side rails as appropriate.", rationale: "Promotes patient safety and comfort after the examination.", criticalStep: false },
      { id: "htt-20", instruction: "Perform hand hygiene and document all findings thoroughly.", rationale: "Hand hygiene prevents cross-contamination. Documentation ensures continuity of care and legal record-keeping.", criticalStep: true }
    ],
    commonErrors: [
      "Palpating the abdomen before auscultating bowel sounds",
      "Forgetting to identify the patient with two identifiers",
      "Skipping hand hygiene before or after the assessment",
      "Failing to assess all four heart valve areas",
      "Not comparing bilateral findings (e.g., lung sounds, pulses)",
      "Omitting pain assessment as part of vital signs",
      "Not ensuring patient privacy before beginning"
    ],
    passingCriteria: "All critical steps must be performed in the correct sequence. Critical steps include hand hygiene, patient identification, vital signs, lung and heart auscultation, auscultating before palpating the abdomen, and documentation.",
    clinicalPearls: [
      "Always follow a systematic approach (head-to-toe or systems-based) to avoid omitting assessments.",
      "Compare bilateral findings: what is found on one side should be compared with the other.",
      "Auscultate the abdomen BEFORE palpating. This is a classic exam question.",
      "Use the diaphragm of the stethoscope for high-pitched sounds (breath sounds, S1/S2) and the bell for low-pitched sounds (S3, S4, murmurs).",
      "Document both normal and abnormal findings; absence of documentation implies absence of assessment."
    ]
  },
  {
    id: "cardiovascular-assessment",
    title: "Cardiovascular Assessment",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "Heart",
    description: "Perform a focused cardiovascular assessment including heart sound auscultation, jugular venous pressure, peripheral pulses, and capillary refill.",
    scenarioIntro: "You are caring for a 58-year-old patient admitted with exertional dyspnea and bilateral ankle edema. The cardiologist has requested a focused cardiovascular assessment. The patient is sitting upright in bed at 45 degrees.",
    equipment: [
      "Stethoscope (with bell and diaphragm)",
      "Blood pressure cuff (sphygmomanometer)",
      "Penlight",
      "Ruler (for JVP measurement)",
      "Watch with second hand",
      "Pulse oximeter",
      "Clean gloves",
      "Documentation tools"
    ],
    steps: [
      { id: "cv-1", instruction: "Perform hand hygiene and gather equipment.", rationale: "Standard infection prevention measure and ensures readiness.", criticalStep: true },
      { id: "cv-2", instruction: "Identify the patient using two identifiers, introduce yourself, and explain the assessment.", rationale: "Patient safety standard; reduces anxiety and gains cooperation.", criticalStep: true },
      { id: "cv-3", instruction: "Position the patient at 45 degrees for JVP assessment.", rationale: "The 45-degree angle is the standardized position for accurate jugular venous pressure assessment.", criticalStep: false },
      { id: "cv-4", instruction: "Inspect the precordium for visible pulsations, heaves, or lifts.", rationale: "Visible precordial heave may indicate ventricular hypertrophy.", criticalStep: false },
      { id: "cv-5", instruction: "Assess jugular venous pressure (JVP) by inspecting the internal jugular vein.", rationale: "Elevated JVP indicates increased central venous pressure, suggesting right-sided heart failure or fluid overload.", criticalStep: true },
      { id: "cv-6", instruction: "Palpate the point of maximal impulse (PMI) at the 5th intercostal space, midclavicular line.", rationale: "A displaced PMI suggests cardiac enlargement (cardiomegaly).", criticalStep: false },
      { id: "cv-7", instruction: "Auscultate the aortic area (2nd right intercostal space) with the diaphragm.", rationale: "Assesses for aortic stenosis or regurgitation murmurs.", criticalStep: true },
      { id: "cv-8", instruction: "Auscultate the pulmonic area (2nd left intercostal space) with the diaphragm.", rationale: "Assesses for pulmonic valve abnormalities.", criticalStep: true },
      { id: "cv-9", instruction: "Auscultate Erb's point (3rd left intercostal space) with the diaphragm.", rationale: "Common area to detect aortic and pulmonic murmurs.", criticalStep: false },
      { id: "cv-10", instruction: "Auscultate the tricuspid area (4th left intercostal space) with the diaphragm.", rationale: "Assesses for tricuspid valve murmurs.", criticalStep: true },
      { id: "cv-11", instruction: "Auscultate the mitral area (5th left intercostal space, midclavicular line) with both diaphragm and bell.", rationale: "The mitral area is where S1 is best heard; use the bell to detect low-pitched S3 and S4 sounds.", criticalStep: true },
      { id: "cv-12", instruction: "Assess heart rate and rhythm, noting any irregularities.", rationale: "Irregular rhythms may indicate atrial fibrillation or other dysrhythmias requiring further evaluation.", criticalStep: false },
      { id: "cv-13", instruction: "Measure blood pressure in both arms.", rationale: "A difference greater than 10-15 mmHg between arms may indicate aortic dissection or subclavian stenosis.", criticalStep: false },
      { id: "cv-14", instruction: "Palpate peripheral pulses bilaterally: radial, dorsalis pedis, and posterior tibial.", rationale: "Absent or diminished pulses indicate peripheral arterial disease or vascular compromise.", criticalStep: true },
      { id: "cv-15", instruction: "Assess capillary refill time by pressing on a nail bed.", rationale: "Normal capillary refill is less than 3 seconds; prolonged refill suggests poor peripheral perfusion.", criticalStep: false },
      { id: "cv-16", instruction: "Inspect and palpate extremities for edema, documenting location and severity (1+ to 4+).", rationale: "Peripheral edema may indicate heart failure, venous insufficiency, or renal dysfunction.", criticalStep: false },
      { id: "cv-17", instruction: "Assist the patient to a comfortable position, ensure safety measures, and document all findings.", rationale: "Promotes patient safety and ensures findings are communicated for continuity of care.", criticalStep: false }
    ],
    commonErrors: [
      "Using the diaphragm instead of the bell to listen for S3 and S4 at the mitral area",
      "Not auscultating in all four valve areas",
      "Forgetting to assess JVP or not positioning the patient correctly at 45 degrees",
      "Not comparing bilateral pulses",
      "Measuring blood pressure in only one arm",
      "Failing to grade and document edema severity"
    ],
    passingCriteria: "All critical steps must be performed correctly. Student must auscultate all four primary valve areas and assess JVP and peripheral pulses.",
    clinicalPearls: [
      "Use the bell of the stethoscope for low-pitched sounds (S3, S4, mitral stenosis) and the diaphragm for high-pitched sounds (S1, S2, aortic regurgitation).",
      "S3 in an older adult is often pathological and suggests heart failure (volume overload). S3 can be normal in children and young adults.",
      "S4 is always pathological and suggests a stiff, noncompliant ventricle (hypertension, aortic stenosis).",
      "JVP greater than 4 cm above the sternal angle is considered elevated.",
      "Grade edema: 1+ (2 mm depression), 2+ (4 mm), 3+ (6 mm), 4+ (8 mm or greater)."
    ]
  },
  {
    id: "respiratory-assessment",
    title: "Respiratory Assessment",
    category: "Assessment",
    difficulty: "Intermediate",
    icon: "Wind",
    description: "Perform a systematic respiratory assessment using inspection, palpation, percussion, and auscultation of the anterior and posterior thorax.",
    scenarioIntro: "You are caring for a 72-year-old patient with a history of COPD who was admitted with increasing shortness of breath and productive cough. The patient is sitting upright and using accessory muscles. You need to perform a focused respiratory assessment.",
    equipment: [
      "Stethoscope",
      "Pulse oximeter",
      "Watch with second hand",
      "Penlight",
      "Clean gloves",
      "Documentation tools"
    ],
    steps: [
      { id: "resp-1", instruction: "Perform hand hygiene and gather equipment.", rationale: "Infection prevention and preparation for an efficient assessment.", criticalStep: true },
      { id: "resp-2", instruction: "Identify the patient using two identifiers and explain the assessment.", rationale: "Patient safety standard and obtaining cooperation.", criticalStep: true },
      { id: "resp-3", instruction: "Assess respiratory rate, depth, pattern, and effort for one full minute without informing the patient.", rationale: "Counting for a full minute increases accuracy. Telling the patient may alter their breathing pattern.", criticalStep: true },
      { id: "resp-4", instruction: "Apply pulse oximeter and note oxygen saturation.", rationale: "SpO2 provides a non-invasive measurement of oxygenation. Normal is 94-100% on room air.", criticalStep: false },
      { id: "resp-5", instruction: "Inspect the thorax: chest shape, symmetry of expansion, use of accessory muscles, and presence of retractions.", rationale: "Barrel chest suggests COPD; asymmetric expansion may indicate pneumothorax or pleural effusion; accessory muscle use indicates respiratory distress.", criticalStep: true },
      { id: "resp-6", instruction: "Inspect for signs of respiratory distress: nasal flaring, pursed-lip breathing, cyanosis, and tripod positioning.", rationale: "These signs indicate increased work of breathing and potential hypoxia.", criticalStep: false },
      { id: "resp-7", instruction: "Palpate the posterior chest for tenderness, crepitus, and tactile fremitus bilaterally.", rationale: "Increased fremitus suggests consolidation (pneumonia); decreased fremitus suggests pleural effusion or pneumothorax.", criticalStep: false },
      { id: "resp-8", instruction: "Assess chest expansion by placing hands on the posterior thorax at the 10th rib level.", rationale: "Asymmetric expansion indicates unilateral pathology such as pneumothorax, effusion, or atelectasis.", criticalStep: false },
      { id: "resp-9", instruction: "Percuss the posterior chest bilaterally, comparing side to side.", rationale: "Hyperresonance suggests air trapping (COPD, pneumothorax); dullness suggests consolidation or fluid.", criticalStep: false },
      { id: "resp-10", instruction: "Auscultate posterior lung fields bilaterally using the diaphragm, starting at the apices and moving to the bases.", rationale: "Systematic bilateral comparison detects adventitious sounds: crackles (fluid), wheezes (narrowed airways), diminished sounds (effusion, COPD).", criticalStep: true },
      { id: "resp-11", instruction: "Auscultate anterior lung fields bilaterally.", rationale: "Ensures complete assessment of all lung lobes, including the right middle lobe and lingula.", criticalStep: true },
      { id: "resp-12", instruction: "Auscultate lateral lung fields bilaterally.", rationale: "The lateral fields assess the lower lobes where dependent fluid or atelectasis commonly occurs.", criticalStep: false },
      { id: "resp-13", instruction: "Assess the character of any cough and sputum: color, amount, consistency, and odor.", rationale: "Green or yellow sputum suggests infection; pink frothy sputum suggests pulmonary edema; rusty sputum suggests pneumonia.", criticalStep: false },
      { id: "resp-14", instruction: "Assist the patient to a comfortable position, ensure supplemental oxygen is in place if ordered, and document all findings.", rationale: "Promotes oxygenation and comfort; documentation ensures continuity of care.", criticalStep: false }
    ],
    commonErrors: [
      "Auscultating over clothing instead of bare skin",
      "Not comparing bilateral lung sounds side to side",
      "Counting respirations for only 15 seconds and multiplying (less accurate for irregular patterns)",
      "Informing the patient you are counting respirations, which alters the rate",
      "Skipping the lateral lung fields",
      "Not noting use of accessory muscles or tripod positioning",
      "Forgetting to assess sputum characteristics"
    ],
    passingCriteria: "All critical steps must be performed in correct sequence. Student must assess respiratory rate for a full minute, inspect the thorax, and auscultate both posterior and anterior lung fields bilaterally.",
    clinicalPearls: [
      "Always auscultate over bare skin, never over clothing or a gown.",
      "Ask the patient to breathe through their mouth during auscultation to reduce upper airway sounds.",
      "Compare side to side, not top to bottom, when auscultating lung sounds.",
      "Crackles that clear with coughing suggest atelectasis; crackles that do not clear suggest pulmonary edema or fibrosis.",
      "A silent chest in an asthmatic is ominous and suggests severe bronchospasm with minimal air movement."
    ]
  },
  {
    id: "neurological-assessment",
    title: "Neurological Assessment",
    category: "Assessment",
    difficulty: "Advanced",
    icon: "Brain",
    description: "Perform a focused neurological assessment including level of consciousness, pupillary response, motor and sensory function, and cranial nerve screening.",
    scenarioIntro: "You are caring for a 55-year-old patient who was admitted following a fall with loss of consciousness. The patient is now awake but drowsy. The neurosurgeon has ordered neurological assessments every 2 hours. You need to perform a thorough neurological assessment.",
    equipment: [
      "Penlight",
      "Reflex hammer",
      "Cotton ball",
      "Sharp object (broken tongue depressor or safety pin)",
      "Tuning fork (128 Hz)",
      "Tongue depressor",
      "Ophthalmoscope (if available)",
      "Glasgow Coma Scale reference card",
      "Documentation tools"
    ],
    steps: [
      { id: "neuro-1", instruction: "Perform hand hygiene and gather equipment.", rationale: "Infection prevention and assessment readiness.", criticalStep: true },
      { id: "neuro-2", instruction: "Identify the patient using two identifiers and explain the assessment.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "neuro-3", instruction: "Assess level of consciousness (LOC) using the Glasgow Coma Scale: eye opening, verbal response, motor response.", rationale: "GCS is the standardized tool for monitoring LOC. A declining GCS is an early indicator of neurological deterioration.", criticalStep: true },
      { id: "neuro-4", instruction: "Assess orientation to person, place, time, and situation.", rationale: "Orientation provides a baseline for cognitive function; changes may indicate increasing intracranial pressure.", criticalStep: true },
      { id: "neuro-5", instruction: "Assess pupil size, shape, equality, and reactivity to light bilaterally (PERRLA).", rationale: "Unequal pupils (anisocoria) or a fixed, dilated pupil is a neurological emergency indicating possible uncal herniation.", criticalStep: true },
      { id: "neuro-6", instruction: "Test extraocular movements (EOMs) by having the patient follow your finger through the six cardinal positions of gaze.", rationale: "Assesses cranial nerves III, IV, and VI; abnormalities may indicate brainstem lesion or increased ICP.", criticalStep: false },
      { id: "neuro-7", instruction: "Assess facial symmetry by asking the patient to smile, raise eyebrows, and puff cheeks (CN VII).", rationale: "Facial droop or asymmetry is a key stroke indicator.", criticalStep: true },
      { id: "neuro-8", instruction: "Test motor strength in upper extremities bilaterally: hand grips and arm drift.", rationale: "Unilateral weakness suggests a contralateral brain lesion; pronator drift is a sensitive test for upper motor neuron weakness.", criticalStep: true },
      { id: "neuro-9", instruction: "Test motor strength in lower extremities bilaterally: foot dorsiflexion and plantar flexion.", rationale: "Assesses for motor deficits in the lower extremities, which can indicate spinal cord or brain lesion.", criticalStep: false },
      { id: "neuro-10", instruction: "Grade motor strength on the 0-5 scale bilaterally.", rationale: "Standardized grading allows objective comparison over time: 0 = no movement, 5 = full strength against resistance.", criticalStep: false },
      { id: "neuro-11", instruction: "Test sensation: light touch (cotton ball) and sharp/dull discrimination bilaterally.", rationale: "Compares sensory function between sides; deficits may follow dermatomal patterns indicating spinal cord involvement.", criticalStep: false },
      { id: "neuro-12", instruction: "Test deep tendon reflexes: biceps, triceps, patellar, and Achilles bilaterally.", rationale: "Hyperreflexia suggests upper motor neuron lesion; hyporeflexia suggests lower motor neuron lesion.", criticalStep: false },
      { id: "neuro-13", instruction: "Assess speech for clarity, fluency, and comprehension.", rationale: "Slurred speech (dysarthria) or inability to find words (aphasia) suggests stroke or neurological impairment.", criticalStep: false },
      { id: "neuro-14", instruction: "Assess gait and balance if the patient is able to ambulate safely.", rationale: "Unsteady gait or ataxia may indicate cerebellar dysfunction or posterior circulation stroke.", criticalStep: false },
      { id: "neuro-15", instruction: "Ensure safety measures are in place (side rails up, call bell within reach, bed in low position) and document all findings including GCS score.", rationale: "Neurologically compromised patients are at high fall risk. Documentation with GCS score allows trend monitoring.", criticalStep: true }
    ],
    commonErrors: [
      "Not calculating a complete GCS score (forgetting one of the three components)",
      "Failing to compare bilateral pupil size and reactivity",
      "Not testing motor strength bilaterally for comparison",
      "Using a bright overhead light instead of a penlight for pupil assessment",
      "Not documenting the GCS score numerically",
      "Skipping facial symmetry assessment (key stroke screen)",
      "Forgetting to assess orientation to all four spheres"
    ],
    passingCriteria: "All critical steps must be performed. Student must correctly assess GCS, pupillary response (PERRLA), facial symmetry, and bilateral motor strength.",
    clinicalPearls: [
      "LOC is the most sensitive indicator of neurological change. A decrease of 2 or more points in GCS requires immediate notification of the provider.",
      "A fixed, dilated pupil is a neurological emergency. Notify the provider immediately.",
      "Always compare findings bilaterally. Unilateral deficits suggest a focal brain lesion.",
      "Cushing's triad (hypertension, bradycardia, irregular respirations) is a late sign of increased intracranial pressure.",
      "Pronator drift: have the patient hold arms outstretched with palms up and eyes closed. If one arm pronates and drifts downward, it indicates contralateral brain pathology."
    ]
  },
  {
    id: "hand-hygiene",
    title: "Hand Hygiene (Hand Washing)",
    category: "Hygiene",
    difficulty: "Beginner",
    icon: "Hand",
    description: "Perform proper hand hygiene using the WHO-recommended hand washing technique, demonstrating all steps for effective removal of transient microorganisms.",
    scenarioIntro: "You are about to enter a patient's room to perform a wound dressing change. The patient has a surgical wound. Your hands are visibly soiled from a previous task. You must perform hand washing with soap and water before donning sterile gloves.",
    equipment: [
      "Sink with running water",
      "Liquid antimicrobial soap",
      "Paper towels",
      "Waste receptacle"
    ],
    steps: [
      { id: "hh-1", instruction: "Remove all jewelry (rings, watch, bracelets) and push sleeves above the wrists.", rationale: "Jewelry harbors microorganisms in crevices and prevents effective cleaning of skin surfaces beneath.", criticalStep: true },
      { id: "hh-2", instruction: "Turn on the water to a comfortable warm temperature.", rationale: "Warm water facilitates lathering and is more comfortable; excessively hot water can cause skin irritation and dryness.", criticalStep: false },
      { id: "hh-3", instruction: "Wet hands and wrists thoroughly under running water, keeping hands lower than elbows.", rationale: "Water should flow from the least contaminated area (wrists) to the most contaminated area (fingertips) and into the sink.", criticalStep: true },
      { id: "hh-4", instruction: "Apply a generous amount of liquid soap (approximately 3-5 mL).", rationale: "Adequate soap is needed to create sufficient lather for mechanical removal of microorganisms.", criticalStep: false },
      { id: "hh-5", instruction: "Lather and rub palms together vigorously.", rationale: "Friction is the primary mechanism for removing transient flora from skin surfaces.", criticalStep: true },
      { id: "hh-6", instruction: "Rub the back of each hand with the palm of the other hand, interlacing fingers.", rationale: "Cleans the dorsal surfaces of the hands and between the finger webs.", criticalStep: true },
      { id: "hh-7", instruction: "Interlace fingers palm to palm and rub between all finger webs.", rationale: "Finger webs are commonly missed areas where microorganisms accumulate.", criticalStep: true },
      { id: "hh-8", instruction: "Rub the backs of fingers against the opposing palm with fingers interlocked.", rationale: "Cleans the dorsal aspect of the fingers which is frequently missed.", criticalStep: false },
      { id: "hh-9", instruction: "Perform rotational rubbing of each thumb clasped in the opposite hand.", rationale: "Thumbs are the most commonly missed area during hand washing.", criticalStep: true },
      { id: "hh-10", instruction: "Rub fingertips of each hand in a circular motion against the opposite palm.", rationale: "Cleans under and around the fingernails where microorganism counts are highest.", criticalStep: true },
      { id: "hh-11", instruction: "Continue washing for a minimum of 20 seconds (40-60 seconds total hand wash time).", rationale: "A minimum of 20 seconds of friction with soap is required to effectively reduce transient flora.", criticalStep: true },
      { id: "hh-12", instruction: "Rinse hands thoroughly under running water, keeping hands lower than elbows.", rationale: "Removes soap and loosened microorganisms; hand position ensures contaminated water flows away from clean areas.", criticalStep: true },
      { id: "hh-13", instruction: "Dry hands thoroughly with a clean paper towel, starting from fingertips to wrists.", rationale: "Moist hands transfer microorganisms more readily than dry hands. Dry from cleanest to least clean area.", criticalStep: false },
      { id: "hh-14", instruction: "Use a dry paper towel to turn off the faucet.", rationale: "The faucet handle is contaminated. Using a paper towel prevents recontamination of clean hands.", criticalStep: true }
    ],
    commonErrors: [
      "Washing for less than 20 seconds",
      "Missing the thumbs during washing",
      "Not removing jewelry before washing",
      "Touching the faucet with clean hands after washing",
      "Holding hands higher than elbows, allowing water to run toward clean areas",
      "Not using enough soap to create adequate lather",
      "Skipping the areas between finger webs",
      "Not drying hands thoroughly"
    ],
    passingCriteria: "All critical steps must be performed in the correct order. Student must demonstrate all WHO hand washing motions, maintain correct hand position (below elbows), wash for at least 20 seconds, and avoid recontamination when turning off the faucet.",
    clinicalPearls: [
      "Thumbs are the most commonly missed area. Make a conscious effort to scrub each thumb individually.",
      "Hand washing with soap and water is required when hands are visibly soiled, after caring for a patient with C. difficile, and after using the restroom.",
      "Alcohol-based hand rub (ABHR) is acceptable when hands are NOT visibly soiled and the patient does NOT have C. difficile or norovirus.",
      "The WHO identifies 5 Moments for Hand Hygiene: before patient contact, before aseptic task, after body fluid exposure, after patient contact, and after touching patient surroundings.",
      "Artificial nails and nail extenders are prohibited in clinical settings as they harbor gram-negative organisms and fungi."
    ]
  },
  {
    id: "catheter-insertion",
    title: "Urinary Catheter Insertion (Indwelling/Foley)",
    category: "Procedure",
    difficulty: "Advanced",
    icon: "Droplets",
    description: "Insert an indwelling (Foley) urinary catheter using sterile technique, including patient preparation, sterile field setup, insertion, balloon inflation, and securing the catheter.",
    scenarioIntro: "You are caring for a 70-year-old postoperative patient who has been unable to void for 8 hours following hip replacement surgery. The bladder scan shows 650 mL of urine. The physician has ordered insertion of a 16 Fr indwelling Foley catheter. The patient is female and positioned supine.",
    equipment: [
      "Indwelling catheter kit (includes catheter, drainage bag, sterile gloves, drape, lubricant, antiseptic solution, specimen container, syringe with sterile water)",
      "16 Fr Foley catheter (if not included in kit)",
      "Extra pair of sterile gloves",
      "Waterproof pad",
      "Adequate lighting (lamp or overhead light)",
      "Tape or catheter securement device",
      "Clean gloves",
      "Hygiene supplies (washcloth, soap, water)",
      "Privacy curtain"
    ],
    steps: [
      { id: "cath-1", instruction: "Verify the physician's order for catheter insertion, including catheter size and type.", rationale: "Ensures the procedure is authorized and the correct catheter is selected. Smallest effective catheter size reduces trauma.", criticalStep: true },
      { id: "cath-2", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and preparation for uninterrupted procedure.", criticalStep: true },
      { id: "cath-3", instruction: "Identify the patient using two identifiers, explain the procedure, and obtain consent.", rationale: "Patient safety standard; informed consent is required for invasive procedures.", criticalStep: true },
      { id: "cath-4", instruction: "Ensure adequate privacy, lighting, and positioning. Position the patient supine with knees flexed and feet flat (for female).", rationale: "Proper positioning allows visualization of the urethral meatus. Privacy maintains dignity.", criticalStep: true },
      { id: "cath-5", instruction: "Perform perineal hygiene with soap and water using clean gloves, then remove gloves.", rationale: "Reduces surface microorganisms before the sterile procedure. Clean perineum before establishing sterile field.", criticalStep: true },
      { id: "cath-6", instruction: "Perform hand hygiene again.", rationale: "Required before establishing a sterile field to prevent contamination.", criticalStep: true },
      { id: "cath-7", instruction: "Open the catheter kit on a clean, flat surface using sterile technique. Establish the sterile field.", rationale: "The inner surface of the kit wrapper becomes the sterile field. Proper opening technique prevents contamination.", criticalStep: true },
      { id: "cath-8", instruction: "Don sterile gloves.", rationale: "Sterile gloves must be worn when handling sterile equipment and during catheter insertion to prevent CAUTI.", criticalStep: true },
      { id: "cath-9", instruction: "Organize the sterile field: open antiseptic solution, lubricate catheter tip, test the balloon by inflating and deflating with the syringe.", rationale: "Testing the balloon ensures it functions properly. Lubricant reduces urethral trauma during insertion.", criticalStep: true },
      { id: "cath-10", instruction: "Place the sterile drape under the patient's buttocks and fenestrated drape over the perineum.", rationale: "Creates a sterile working field around the insertion site.", criticalStep: false },
      { id: "cath-11", instruction: "With the non-dominant hand, separate the labia to expose the urethral meatus. This hand is now contaminated.", rationale: "The non-dominant hand maintains labial separation throughout cleansing and insertion. Once it touches non-sterile tissue, it cannot touch sterile equipment.", criticalStep: true },
      { id: "cath-12", instruction: "Using the dominant (sterile) hand and antiseptic-soaked swabs, cleanse the meatus with downward strokes: far labial fold, near labial fold, then directly over the meatus. Use a new swab for each stroke.", rationale: "Cleansing from clean to dirty reduces the risk of introducing bacteria into the urethra. One swab per stroke prevents recontamination.", criticalStep: true },
      { id: "cath-13", instruction: "Pick up the lubricated catheter with the dominant (sterile) hand, keeping the drainage end in the collection tray.", rationale: "Maintains sterility of the catheter; the collection tray catches urine upon insertion.", criticalStep: true },
      { id: "cath-14", instruction: "Insert the catheter gently into the urethral meatus approximately 5-7.5 cm (2-3 inches) for a female patient, or until urine flows.", rationale: "The female urethra is approximately 4 cm long. Inserting an additional 2.5-5 cm ensures the balloon is within the bladder.", criticalStep: true },
      { id: "cath-15", instruction: "Once urine flows, advance the catheter an additional 2.5-5 cm (1-2 inches) before inflating the balloon.", rationale: "Advancing beyond the point of urine return ensures the balloon is fully within the bladder, preventing urethral trauma.", criticalStep: true },
      { id: "cath-16", instruction: "Inflate the balloon with the pre-filled syringe of sterile water (usually 10 mL). If the patient reports pain, stop, deflate, advance further, and retry.", rationale: "Balloon inflation anchors the catheter. Pain during inflation may indicate the balloon is in the urethra, not the bladder.", criticalStep: true },
      { id: "cath-17", instruction: "Gently pull the catheter back until resistance is felt, confirming the balloon is seated at the bladder neck.", rationale: "Proper positioning at the bladder neck ensures effective drainage.", criticalStep: false },
      { id: "cath-18", instruction: "Secure the catheter to the patient's inner thigh using tape or a securement device, allowing slack for movement.", rationale: "Securing prevents accidental traction on the catheter, which can cause urethral erosion and discomfort.", criticalStep: true },
      { id: "cath-19", instruction: "Hang the drainage bag below the level of the bladder on the bed frame. Never place it on the floor.", rationale: "Gravity-dependent drainage prevents backflow of urine into the bladder, reducing infection risk.", criticalStep: true },
      { id: "cath-20", instruction: "Remove drapes, assist the patient to a comfortable position, and remove gloves.", rationale: "Restores comfort and removes equipment from the work area.", criticalStep: false },
      { id: "cath-21", instruction: "Perform hand hygiene and document: catheter size, balloon volume, urine output (color, clarity, amount), patient tolerance, and indication for catheterization.", rationale: "Complete documentation is required for legal and clinical purposes. Recording the indication supports CAUTI prevention bundle compliance.", criticalStep: true }
    ],
    commonErrors: [
      "Not testing the balloon before insertion",
      "Inflating the balloon before urine return or before advancing the catheter fully",
      "Contaminating the sterile field or sterile gloves during the procedure",
      "Using the dominant (sterile) hand to separate the labia",
      "Not cleansing with separate swabs for each stroke",
      "Placing the drainage bag above the level of the bladder",
      "Forgetting to document the indication for catheterization",
      "Not securing the catheter to the thigh"
    ],
    passingCriteria: "All critical steps must be performed in correct order. Sterile technique must be maintained throughout. Student must verify the order, perform hand hygiene, maintain sterile field, cleanse properly, advance catheter before inflating balloon, and secure the drainage system below bladder level.",
    clinicalPearls: [
      "CAUTI prevention bundle: assess the need for the catheter daily, maintain a closed drainage system, keep the bag below the bladder, perform hand hygiene before and after handling, and secure the catheter.",
      "If the catheter enters the vagina by mistake, leave it in place as a landmark, obtain a new sterile catheter, and insert into the correct opening.",
      "For male patients, hold the penis at a 60-90 degree angle during insertion to straighten the urethra, and insert 17-22.5 cm (7-9 inches) or until urine flows.",
      "Always use the smallest effective catheter size (typically 14-16 Fr for adults) to minimize urethral trauma.",
      "The most common cause of hospital-acquired UTI is an indwelling urinary catheter. Remove as soon as clinically indicated."
    ]
  },
  {
    id: "catheter-removal",
    title: "Urinary Catheter Removal",
    category: "Procedure",
    difficulty: "Beginner",
    icon: "CircleMinus",
    description: "Safely remove an indwelling (Foley) urinary catheter, monitor for complications, and implement a voiding trial.",
    scenarioIntro: "You are caring for a 65-year-old patient who is postoperative day 2 following abdominal surgery. The physician has ordered removal of the indwelling urinary catheter and initiation of a voiding trial. The patient is alert, ambulatory, and has no history of urinary retention.",
    equipment: [
      "10 mL syringe (for balloon deflation)",
      "Waterproof pad",
      "Clean gloves",
      "Hygiene supplies (washcloth, soap, warm water)",
      "Graduated container for measuring urine output",
      "Bladder scanner (if available)",
      "Documentation tools"
    ],
    steps: [
      { id: "cr-1", instruction: "Verify the physician's order for catheter removal.", rationale: "Ensures the removal is authorized and any specific instructions are noted.", criticalStep: true },
      { id: "cr-2", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and preparation.", criticalStep: true },
      { id: "cr-3", instruction: "Identify the patient using two identifiers and explain the procedure.", rationale: "Patient safety standard; explaining reduces patient anxiety about the removal.", criticalStep: true },
      { id: "cr-4", instruction: "Ensure privacy and position the patient supine or in a comfortable position.", rationale: "Privacy maintains dignity; supine positioning facilitates the procedure.", criticalStep: false },
      { id: "cr-5", instruction: "Apply clean gloves and place a waterproof pad under the patient.", rationale: "Protects the bed linens from urine leakage during removal.", criticalStep: false },
      { id: "cr-6", instruction: "Empty the drainage bag and measure and record the final urine output.", rationale: "Accurate intake and output records are essential for fluid balance monitoring.", criticalStep: true },
      { id: "cr-7", instruction: "Attach the empty syringe to the balloon inflation port.", rationale: "Prepares for balloon deflation. Using a syringe ensures complete water removal.", criticalStep: false },
      { id: "cr-8", instruction: "Deflate the balloon completely by aspirating all sterile water with the syringe. Verify the volume matches the amount documented at insertion.", rationale: "Incomplete deflation can cause urethral trauma during removal. Verifying volume ensures the balloon is fully deflated.", criticalStep: true },
      { id: "cr-9", instruction: "Ask the patient to take a slow, deep breath and gently withdraw the catheter in a smooth, steady motion during exhalation.", rationale: "Relaxation during exhalation reduces urethral sphincter tone, minimizing discomfort during removal.", criticalStep: true },
      { id: "cr-10", instruction: "Inspect the catheter tip to ensure it is intact.", rationale: "A retained balloon fragment or catheter piece could cause obstruction or infection.", criticalStep: true },
      { id: "cr-11", instruction: "Perform perineal hygiene.", rationale: "Removes any residual antiseptic or drainage; promotes comfort and hygiene.", criticalStep: false },
      { id: "cr-12", instruction: "Educate the patient about the voiding trial: they should attempt to void within 6-8 hours, drink adequate fluids, and notify the nurse when they void or if they experience inability to void, burning, or urgency.", rationale: "Post-removal voiding trial monitors for urinary retention. Patient education promotes self-monitoring and timely reporting.", criticalStep: true },
      { id: "cr-13", instruction: "Remove gloves, perform hand hygiene, and document: time of removal, amount of water removed from balloon, urine output, catheter tip integrity, patient tolerance, and voiding trial education.", rationale: "Complete documentation is a legal requirement and ensures continuity of care.", criticalStep: true }
    ],
    commonErrors: [
      "Cutting the inflation port instead of using a syringe (can cause balloon fragments to remain in the bladder)",
      "Not completely deflating the balloon before removal",
      "Pulling the catheter out too quickly causing trauma",
      "Failing to educate the patient about the voiding trial",
      "Not inspecting the catheter tip after removal",
      "Not measuring the final urine output before removal",
      "Forgetting to document the voiding trial instructions"
    ],
    passingCriteria: "All critical steps must be performed correctly. Student must verify the order, completely deflate the balloon, inspect the catheter, and educate the patient about the voiding trial.",
    clinicalPearls: [
      "Never cut the inflation port to deflate the balloon. Cutting may cause the port to seal and prevent water removal, requiring cystoscopy for removal.",
      "If the balloon does not deflate, do not force removal. Notify the provider for further intervention.",
      "Post-removal urinary retention is defined as the inability to void within 6-8 hours or a post-void residual greater than 300-400 mL on bladder scan.",
      "Morning catheter removal is associated with lower rates of urinary retention compared to evening removal.",
      "Monitor for signs of UTI after removal: dysuria, frequency, urgency, fever, cloudy or foul-smelling urine."
    ]
  },
  {
    id: "chest-tube-removal",
    title: "Chest Tube Removal",
    category: "Procedure",
    difficulty: "Advanced",
    icon: "Scissors",
    description: "Assist with the removal of a chest tube, including patient preparation, dressing application, and post-removal monitoring for complications.",
    scenarioIntro: "You are assisting the physician with chest tube removal for a 48-year-old patient who had a chest tube placed 3 days ago for a spontaneous pneumothorax. The chest X-ray shows full lung re-expansion, there has been no air leak for 24 hours, and drainage has been less than 100 mL in the past 24 hours. The physician has determined it is safe to remove the chest tube.",
    equipment: [
      "Suture removal kit (scissors and forceps)",
      "Petroleum gauze (Vaseline gauze)",
      "Sterile 4x4 gauze pads",
      "Wide occlusive tape (2-3 inch)",
      "Sterile gloves",
      "Clean gloves",
      "Waterproof pad",
      "Pre-medication as ordered (analgesic)",
      "Pulse oximeter",
      "Stethoscope",
      "Emergency chest tube insertion tray (at bedside)",
      "Documentation tools"
    ],
    steps: [
      { id: "ctr-1", instruction: "Verify the physician's order for chest tube removal and confirm removal criteria are met (lung re-expansion on CXR, no air leak, minimal drainage).", rationale: "Removal criteria must be satisfied to prevent recurrence of pneumothorax or hemothorax.", criticalStep: true },
      { id: "ctr-2", instruction: "Perform hand hygiene and gather all equipment, ensuring petroleum gauze and occlusive dressing supplies are prepared.", rationale: "Having petroleum gauze ready is essential for immediate application after removal to prevent air entry.", criticalStep: true },
      { id: "ctr-3", instruction: "Identify the patient using two identifiers and explain the procedure, including what the patient will be asked to do during removal.", rationale: "The patient must understand they will be asked to perform a specific breathing maneuver during removal.", criticalStep: true },
      { id: "ctr-4", instruction: "Administer pre-medication (analgesic) as ordered, 30 minutes before the procedure.", rationale: "Chest tube removal is painful. Pre-medication improves patient comfort and cooperation during the procedure.", criticalStep: true },
      { id: "ctr-5", instruction: "Position the patient semi-Fowler's or on the unaffected side. Ensure pulse oximetry is in place.", rationale: "Semi-Fowler's position facilitates breathing; continuous pulse oximetry monitors for desaturation.", criticalStep: false },
      { id: "ctr-6", instruction: "Place a waterproof pad beneath the chest tube site.", rationale: "Protects bed linens from drainage during removal.", criticalStep: false },
      { id: "ctr-7", instruction: "Don clean gloves and remove the existing dressing. Assess the insertion site for signs of infection.", rationale: "Site assessment identifies any complications before proceeding.", criticalStep: false },
      { id: "ctr-8", instruction: "Remove clean gloves, perform hand hygiene, and don sterile gloves.", rationale: "Sterile technique is required for the removal site to prevent infection.", criticalStep: true },
      { id: "ctr-9", instruction: "The physician cuts the suture securing the chest tube.", rationale: "The suture must be cut before the tube can be removed. A purse-string suture may be tightened after removal.", criticalStep: false },
      { id: "ctr-10", instruction: "Instruct the patient to take a deep breath in and hold it (Valsalva maneuver) or exhale completely during tube removal.", rationale: "This maneuver increases intrathoracic pressure, preventing air from entering the pleural space during removal.", criticalStep: true },
      { id: "ctr-11", instruction: "The physician removes the chest tube in one smooth, quick motion while the patient performs the breathing maneuver.", rationale: "Quick, smooth removal minimizes the window for air entry into the pleural space.", criticalStep: true },
      { id: "ctr-12", instruction: "Immediately apply petroleum gauze over the site, followed by sterile gauze and an occlusive tape dressing.", rationale: "Petroleum gauze creates an airtight seal preventing air entry through the tract. The occlusive dressing reinforces this seal.", criticalStep: true },
      { id: "ctr-13", instruction: "Monitor the patient's vital signs, oxygen saturation, respiratory status, and assess for signs of recurrent pneumothorax (sudden dyspnea, decreased breath sounds, subcutaneous emphysema).", rationale: "Post-removal pneumothorax is the primary complication. Early detection enables rapid intervention.", criticalStep: true },
      { id: "ctr-14", instruction: "Ensure a post-removal chest X-ray is ordered and completed as per protocol (typically within 1-2 hours).", rationale: "Confirms continued lung expansion and absence of recurrent pneumothorax after removal.", criticalStep: true },
      { id: "ctr-15", instruction: "Document: time of removal, patient's breathing maneuver, dressing applied, drainage amount, site appearance, vital signs, SpO2, patient tolerance, and post-removal CXR order.", rationale: "Complete documentation for continuity of care and legal record.", criticalStep: false }
    ],
    commonErrors: [
      "Not having petroleum gauze ready for immediate application after removal",
      "Forgetting to instruct the patient on the breathing maneuver during removal",
      "Not pre-medicating the patient before the procedure",
      "Applying a non-occlusive dressing instead of petroleum gauze with occlusive tape",
      "Not monitoring for signs of recurrent pneumothorax after removal",
      "Failing to ensure a post-removal chest X-ray is obtained",
      "Not having an emergency chest tube tray at the bedside"
    ],
    passingCriteria: "All critical steps must be performed. Student must verify removal criteria, pre-medicate, instruct on the breathing maneuver, immediately apply petroleum gauze with occlusive dressing, monitor post-removal, and ensure post-removal CXR.",
    clinicalPearls: [
      "The Valsalva maneuver (deep breath in and hold) or forced exhalation during removal prevents air entry by increasing intrathoracic pressure.",
      "Petroleum gauze must be applied IMMEDIATELY upon tube removal. Even a momentary delay can allow air to enter the pleural space.",
      "Subcutaneous emphysema (crepitus on palpation) around the site after removal indicates air leak and requires immediate assessment.",
      "Keep the patient on bed rest for 1-2 hours after removal and reassess respiratory status before ambulation.",
      "If the patient develops sudden dyspnea, decreased breath sounds, or tracheal deviation after removal, prepare for emergency chest tube reinsertion."
    ]
  },
  {
    id: "chest-tube-care",
    title: "Chest Tube Care and Management",
    category: "Drain & Tube Care",
    difficulty: "Advanced",
    icon: "Stethoscope",
    description: "Manage and monitor a chest drainage system, including assessing drainage, tidaling, air leaks, and maintaining system integrity.",
    scenarioIntro: "You are caring for a 55-year-old patient who had a chest tube inserted yesterday for a hemopneumothorax following blunt chest trauma. The chest tube is connected to a closed drainage system (e.g., Pleur-Evac). You need to perform a routine chest tube assessment and management.",
    equipment: [
      "Stethoscope",
      "Pulse oximeter",
      "Tape (to mark drainage levels)",
      "Marker/pen",
      "Two padded clamps (at bedside for emergencies only)",
      "Sterile petroleum gauze and occlusive dressing (at bedside)",
      "Clean gloves",
      "Documentation tools"
    ],
    steps: [
      { id: "ctc-1", instruction: "Perform hand hygiene, don clean gloves, and gather assessment equipment.", rationale: "Standard infection prevention.", criticalStep: true },
      { id: "ctc-2", instruction: "Identify the patient using two identifiers and explain the assessment.", rationale: "Patient safety standard.", criticalStep: true },
      { id: "ctc-3", instruction: "Assess the patient's respiratory status: rate, depth, effort, SpO2, and auscultate bilateral lung sounds.", rationale: "Evaluates effectiveness of the drainage system and identifies respiratory compromise.", criticalStep: true },
      { id: "ctc-4", instruction: "Assess the chest tube insertion site dressing: intact, dry, and occlusive.", rationale: "A compromised dressing can allow air entry into the pleural space or indicate bleeding at the site.", criticalStep: true },
      { id: "ctc-5", instruction: "Inspect the insertion site for signs of infection, subcutaneous emphysema, or drainage around the tube.", rationale: "Subcutaneous emphysema (crepitus) suggests air leak; redness, swelling, or purulent drainage indicates infection.", criticalStep: false },
      { id: "ctc-6", instruction: "Verify all connections in the tubing system are tight and secured with tape or bands.", rationale: "Loose connections allow air into the system, compromising the closed drainage system and reducing effectiveness.", criticalStep: true },
      { id: "ctc-7", instruction: "Inspect the drainage tubing: ensure it is free of kinks, loops, or dependent loops, and lies in a straight path to the collection unit.", rationale: "Kinks or dependent loops obstruct drainage and can cause increased intrathoracic pressure.", criticalStep: true },
      { id: "ctc-8", instruction: "Assess the water seal chamber: look for tidaling (fluctuation of fluid level with respiration).", rationale: "Tidaling indicates the system is functioning correctly. Absence of tidaling may indicate tube occlusion, lung re-expansion, or kink.", criticalStep: true },
      { id: "ctc-9", instruction: "Assess the water seal chamber for continuous bubbling.", rationale: "Continuous bubbling indicates an air leak in the system or from the patient. Intermittent bubbling during expiration or cough may be normal.", criticalStep: true },
      { id: "ctc-10", instruction: "If continuous bubbling is present, systematically check for the source: briefly clamp the tubing close to the patient. If bubbling stops, the leak is at the patient's chest. If it continues, the leak is in the tubing or connections.", rationale: "Identifying the source of the air leak guides appropriate intervention.", criticalStep: false },
      { id: "ctc-11", instruction: "Assess the drainage collection chamber: note the color, consistency, and amount of drainage. Mark the drainage level with the date and time.", rationale: "Tracking drainage trends is essential. Greater than 200 mL/hr of sanguineous drainage or a sudden increase may indicate hemorrhage requiring immediate intervention.", criticalStep: true },
      { id: "ctc-12", instruction: "If suction is ordered, verify the suction control chamber is set to the prescribed level (usually -20 cmH2O) and confirm gentle continuous bubbling in the suction control chamber.", rationale: "Correct suction pressure ensures effective drainage. Vigorous bubbling is not more effective and increases evaporation.", criticalStep: false },
      { id: "ctc-13", instruction: "Ensure the drainage system is kept upright and below the level of the patient's chest at all times.", rationale: "Prevents backflow of drainage into the pleural space, which could cause infection or re-accumulation of fluid/air.", criticalStep: true },
      { id: "ctc-14", instruction: "Verify that two padded clamps are at the bedside and that sterile petroleum gauze is readily available.", rationale: "Emergency supplies are needed in case of accidental tube dislodgement or system disconnection.", criticalStep: true },
      { id: "ctc-15", instruction: "Document: respiratory assessment, site appearance, drainage amount and character, tidaling, air leak status, suction settings, and patient tolerance.", rationale: "Thorough documentation allows trending of drainage and early detection of complications.", criticalStep: false }
    ],
    commonErrors: [
      "Clamping the chest tube for prolonged periods (can cause tension pneumothorax)",
      "Raising the drainage system above the level of the chest",
      "Stripping or milking the chest tube routinely (creates excessive negative pressure)",
      "Not assessing for tidaling in the water seal chamber",
      "Failing to mark drainage levels at regular intervals",
      "Not keeping emergency supplies (clamps, petroleum gauze) at bedside",
      "Confusing normal intermittent bubbling with a pathological continuous air leak"
    ],
    passingCriteria: "All critical steps must be performed. Student must assess respiratory status, verify system integrity (connections, no kinks), assess water seal for tidaling and air leak, monitor drainage, keep system below chest level, and ensure emergency supplies are at bedside.",
    clinicalPearls: [
      "NEVER clamp a chest tube unless specifically ordered or during a system change. Clamping can cause a tension pneumothorax if there is an ongoing air leak.",
      "If the chest tube accidentally disconnects from the drainage system, submerge the end of the tube in sterile water or saline to create a temporary water seal.",
      "If the chest tube is accidentally pulled out, immediately cover the site with petroleum gauze taped on three sides (flutter valve effect) and call for help.",
      "Normal drainage changes from sanguineous (bloody) to serosanguineous to serous over time. A return to bright red drainage may indicate bleeding.",
      "Tidaling should correspond to respiration: in a spontaneously breathing patient, fluid rises on inspiration and falls on expiration. This pattern reverses in mechanically ventilated patients."
    ]
  }
];
