import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

const rpnIds = [
  "assessment-skills-rpn","community-nursing-rpn","core-fundamentals-rpn","critical-care-rpn",
  "endocrine-rpn","fluid-electrolytes-rpn","gerontology-rpn","gi-rpn","heent-rpn",
  "hematology-rpn","hemodialysis-rpn","immune-rpn","infections-rpn","musculoskeletal-rpn",
  "nutrition-supplements-rpn","pain-management-rpn","palliative-rpn","patient-positioning-rpn",
  "procedures-rpn","renal-rpn","safety-ethics-rpn","skin-rpn","wound-care-rpn"
];

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// Quiz questions and pearls for each lesson
const quizData: Record<string, { pearls: string[], quiz: { question: string, options: string[], correct: number, rationale: string }[] }> = {
  "assessment-skills-rpn": {
    pearls: [
      "Always auscultate the abdomen BEFORE palpation -- palpation can alter bowel sounds and produce false findings.",
      "The most reliable indicator of a patient's pain is their self-report -- believe the patient.",
      "When in doubt about a finding, compare bilaterally -- using the unaffected side as the patient's own baseline.",
      "A change from baseline is more clinically significant than any single isolated finding -- always trend your data.",
      "Vital signs should be assessed as a complete set -- individual values without context can be misleading."
    ],
    quiz: [
      { question: "Which assessment technique should be performed FIRST during an abdominal assessment?", options: ["Palpation", "Percussion", "Auscultation", "Deep palpation"], correct: 2, rationale: "Auscultation should be performed before palpation and percussion during abdominal assessment because palpation and percussion can stimulate or alter bowel sounds, leading to inaccurate findings." },
      { question: "A patient's Glasgow Coma Scale score is E3V4M5. What is the total GCS score and what does it indicate?", options: ["12 -- moderate brain injury", "12 -- mild brain injury", "10 -- severe brain injury", "15 -- normal"], correct: 0, rationale: "E3+V4+M5 = 12. A GCS score of 9-12 indicates moderate brain injury. Mild is 13-15, and severe is 3-8." },
      { question: "Which assessment finding requires immediate nursing intervention?", options: ["Blood pressure 138/88 mmHg", "Heart rate 58 bpm in a sleeping patient", "Respiratory rate of 8 breaths per minute", "Temperature 37.2C orally"], correct: 2, rationale: "A respiratory rate of 8 is significantly below normal (12-20) and indicates respiratory depression requiring immediate assessment and intervention. The other findings, while worth monitoring, do not require immediate intervention." }
    ]
  },
  "community-nursing-rpn": {
    pearls: [
      "The social determinants of health often have a greater impact on health outcomes than medical care -- always assess the whole picture.",
      "In community nursing, the 'patient' is often the entire family or community -- interventions must consider the broader context.",
      "Cultural humility, not cultural competence, is the goal -- approach each patient as a unique individual rather than a cultural stereotype.",
      "The most effective community health interventions address upstream determinants of health rather than downstream consequences.",
      "When conducting a home visit, safety assessment of the physical environment is as important as the patient's clinical assessment."
    ],
    quiz: [
      { question: "A community health nurse conducting a windshield survey would assess which of the following?", options: ["Individual patient vital signs", "Community infrastructure, housing conditions, and available health resources", "Laboratory values of community members", "Hospital readmission rates"], correct: 1, rationale: "A windshield survey is a systematic observation of community characteristics including infrastructure, housing, demographics, environmental conditions, and health resources, conducted by driving or walking through the community." },
      { question: "Which level of prevention includes immunization programs?", options: ["Primary prevention", "Secondary prevention", "Tertiary prevention", "Quaternary prevention"], correct: 0, rationale: "Primary prevention focuses on preventing disease before it occurs. Immunization is a classic example of primary prevention as it prevents the disease from developing in the first place." },
      { question: "A community health nurse identifies that a neighborhood has limited access to fresh produce. This is an example of which social determinant of health?", options: ["Biological determinant", "Physical environment", "Individual lifestyle choice", "Genetic predisposition"], correct: 1, rationale: "Limited access to fresh produce (a food desert) is a physical environment determinant of health that directly impacts nutrition and health outcomes regardless of individual choices." }
    ]
  },
  "core-fundamentals-rpn": {
    pearls: [
      "Hand hygiene is the SINGLE most effective measure to prevent healthcare-associated infections -- alcohol-based hand rub for most situations, soap and water when hands are visibly soiled or for C. difficile and Norovirus.",
      "The correct donning order is gown, mask, eye protection, gloves. The correct doffing order is gloves, eye protection, gown, mask -- with hand hygiene between each step.",
      "The three most important medication administration checks: right patient (two identifiers), right drug, right dose -- verify these before every administration.",
      "When documenting, if it wasn't charted, it wasn't done -- timely, accurate, objective documentation is a legal record.",
      "Never recap a used needle -- activate the safety device immediately after use and dispose in a sharps container at the point of care."
    ],
    quiz: [
      { question: "Which action is the single most effective measure to prevent healthcare-associated infections?", options: ["Wearing gloves for all patient contact", "Hand hygiene with alcohol-based hand rub or soap and water", "Wearing a mask in patient rooms", "Administering prophylactic antibiotics"], correct: 1, rationale: "Hand hygiene is consistently identified as the single most effective measure to prevent healthcare-associated infections (HAIs). While gloves and masks are important components of PPE, hand hygiene remains the foundation of infection prevention." },
      { question: "A nurse is preparing to enter a patient's room on contact precautions. What is the correct order for donning PPE?", options: ["Gloves, gown, mask, eye protection", "Mask, eye protection, gown, gloves", "Gown, mask, eye protection, gloves", "Eye protection, mask, gown, gloves"], correct: 2, rationale: "The correct donning sequence is gown first (provides full body coverage), then mask and eye protection (protects mucous membranes), then gloves last (overlapping the gown cuffs to leave no exposed skin)." },
      { question: "Which patient identifier combination is appropriate for verifying patient identity before medication administration?", options: ["Room number and bed number", "Patient name and date of birth", "Diagnosis and physician name", "Medical record number and room number"], correct: 1, rationale: "Two patient identifiers should be used -- typically the patient's full name and date of birth. Room number should NEVER be used as an identifier because patients may be moved between rooms." }
    ]
  },
  "critical-care-rpn": {
    pearls: [
      "A rising early warning score is more significant than any single abnormal vital sign -- trend the trajectory, not just the snapshot.",
      "In cardiac arrest, high-quality chest compressions (rate 100-120/min, depth 5-6 cm, full recoil, minimal interruptions) are the most important intervention.",
      "Increasing sedation often PRECEDES respiratory depression in opioid toxicity -- monitor sedation level as an early warning sign.",
      "When calling a rapid response or code, state clearly: patient name, location, and what you are observing -- avoid vague language.",
      "Always know where the crash cart and defibrillator are located on your unit -- check them at the beginning of every shift."
    ],
    quiz: [
      { question: "A patient's Modified Early Warning Score (MEWS) has increased from 2 to 5 over the past 4 hours. What is the priority nursing action?", options: ["Continue monitoring every 4 hours", "Document the findings and reassess next shift", "Escalate to the charge nurse and physician per protocol", "Administer PRN analgesic"], correct: 2, rationale: "An increasing MEWS score indicates clinical deterioration and requires escalation per institutional protocol. A score of 5 typically triggers urgent physician notification or rapid response team activation." },
      { question: "During CPR, what is the recommended compression rate and depth for an adult?", options: ["60-80/min, 3-4 cm depth", "100-120/min, 5-6 cm depth", "120-140/min, 7-8 cm depth", "80-100/min, 4-5 cm depth"], correct: 1, rationale: "Current guidelines recommend a compression rate of 100-120 per minute with a depth of at least 5 cm but not exceeding 6 cm, allowing full chest recoil between compressions and minimizing interruptions." },
      { question: "Which assessment approach should the practical nurse use when encountering a critically ill patient?", options: ["Head-to-toe systematic assessment", "ABCDE (Airway, Breathing, Circulation, Disability, Exposure)", "Focus only on the chief complaint", "Wait for physician orders before assessing"], correct: 1, rationale: "The ABCDE approach is the standard rapid assessment framework for critically ill patients, ensuring life-threatening problems are identified and addressed in priority order: Airway first, then Breathing, Circulation, Disability (neurological), and Exposure." }
    ]
  },
  "endocrine-rpn": {
    pearls: [
      "The Rule of 15 for hypoglycemia: give 15g of fast-acting carbohydrate, recheck blood glucose in 15 minutes, repeat if still below 4.0 mmol/L.",
      "Levothyroxine should be taken on an empty stomach, 30-60 minutes before breakfast, at the same time every day -- consistency is key.",
      "Patients on corticosteroid therapy should NEVER abruptly discontinue their medication -- adrenal crisis can be life-threatening.",
      "In diabetic ketoacidosis, potassium replacement is critical even if initial potassium is normal -- insulin drives potassium intracellularly and levels will drop rapidly.",
      "Thyroid storm and myxedema coma are life-threatening emergencies with opposite presentations -- know both to differentiate quickly."
    ],
    quiz: [
      { question: "A diabetic patient has a blood glucose of 3.2 mmol/L and is conscious and able to swallow. What is the priority nursing action?", options: ["Administer insulin as scheduled", "Give 15g of fast-acting carbohydrate and recheck in 15 minutes", "Call the physician immediately", "Encourage the patient to eat a full meal"], correct: 1, rationale: "The Rule of 15 dictates giving 15g of fast-acting carbohydrate (such as 4 glucose tablets, 150 mL juice, or 15 mL honey) and rechecking blood glucose in 15 minutes. Repeat if still below 4.0 mmol/L." },
      { question: "Which instruction should the nurse give to a patient starting levothyroxine?", options: ["Take with a large meal for better absorption", "Take on an empty stomach 30-60 minutes before breakfast", "Take at bedtime with a glass of milk", "Take only when feeling symptoms of hypothyroidism"], correct: 1, rationale: "Levothyroxine absorption is significantly reduced by food, calcium, and iron. It should be taken on an empty stomach, 30-60 minutes before breakfast, at the same time every day for consistent blood levels." },
      { question: "A patient on long-term prednisone therapy tells the nurse they want to stop taking the medication because they feel better. What is the nurse's best response?", options: ["Support the patient's decision as it is their right to refuse medication", "Explain that suddenly stopping corticosteroids can cause a life-threatening adrenal crisis and the dose must be tapered gradually", "Agree that the medication can be stopped if symptoms have resolved", "Tell the patient to cut the dose in half immediately"], correct: 1, rationale: "Long-term corticosteroid therapy suppresses the adrenal glands' natural cortisol production. Abrupt discontinuation can cause adrenal crisis (acute adrenal insufficiency) with severe hypotension, shock, and potentially death. Doses must be tapered gradually to allow the adrenal glands to resume function." }
    ]
  },
  "fluid-electrolytes-rpn": {
    pearls: [
      "NEVER give IV potassium as a bolus push -- fatal cardiac arrest can result. Maximum peripheral IV concentration is 40 mEq/L at a maximum rate of 10-20 mEq/hour.",
      "Daily weight is the MOST reliable indicator of fluid status -- 1 kg weight change equals approximately 1 liter of fluid gained or lost.",
      "Peaked T waves on ECG are the earliest sign of hyperkalemia -- if you see them, check the potassium level immediately.",
      "Hyponatremia correction must be slow (no more than 8-10 mEq/L per 24 hours) to prevent osmotic demyelination syndrome.",
      "For every patient on a loop diuretic, think potassium -- monitor levels and supplement as needed."
    ],
    quiz: [
      { question: "A patient on furosemide has a serum potassium of 3.0 mEq/L. Which ECG change is most likely to be seen?", options: ["Peaked T waves", "Widened QRS complex", "Flattened T waves and U waves", "Shortened QT interval"], correct: 2, rationale: "Hypokalemia causes flattened T waves, prominent U waves, and ST segment depression on ECG. Peaked T waves and widened QRS are signs of hyperkalemia." },
      { question: "A patient weighs 2 kg more today than yesterday with the same scale and clothing. What does this most likely indicate?", options: ["Muscle gain from physical therapy", "Approximately 2 liters of fluid retention", "Normal daily weight fluctuation", "Dietary intake change"], correct: 1, rationale: "A weight gain of 1 kg equals approximately 1 liter of fluid retention. A 2 kg weight gain in 24 hours indicates approximately 2 liters of fluid retention, which is clinically significant and should be reported." },
      { question: "The nurse is preparing to administer IV potassium chloride. Which action is UNSAFE?", options: ["Infusing at 10 mEq/hour via infusion pump", "Placing the patient on cardiac monitoring", "Giving a rapid IV bolus of 20 mEq to quickly correct the deficit", "Verifying adequate urine output before administration"], correct: 2, rationale: "IV potassium must NEVER be given as a rapid bolus push as this can cause fatal cardiac arrhythmia and cardiac arrest. It must always be diluted and administered via infusion pump at a controlled rate with cardiac monitoring." }
    ]
  },
  "gerontology-rpn": {
    pearls: [
      "Delirium in the elderly is often the FIRST sign of acute illness (UTI, pneumonia, medication toxicity) -- do not attribute new confusion to 'just being old'.",
      "Beer's Criteria is your best friend in geriatric pharmacology -- use it to identify potentially inappropriate medications in older adults.",
      "The 'geriatric giants' -- falls, incontinence, immobility, delirium, and polypharmacy -- account for the majority of preventable adverse outcomes in elderly patients.",
      "Atypical presentation of disease is common in elderly: MI may present without chest pain, infection without fever, appendicitis without classic RLQ pain.",
      "Allow extra time -- older adults process information more slowly and need more time for self-care activities. Rushing increases fall risk and decreases dignity."
    ],
    quiz: [
      { question: "An 82-year-old patient who was oriented yesterday is now confused and agitated. What should the nurse suspect FIRST?", options: ["Normal age-related cognitive decline", "Onset of dementia", "Delirium from an acute medical cause", "Behavioral disturbance requiring sedation"], correct: 2, rationale: "Acute onset confusion in an elderly patient is delirium until proven otherwise. Delirium has a sudden onset (hours to days) unlike dementia (gradual over months to years) and is often caused by treatable conditions such as UTI, medication toxicity, dehydration, or constipation." },
      { question: "Which medication class is identified by Beer's Criteria as potentially inappropriate for use in older adults?", options: ["ACE inhibitors", "Benzodiazepines", "Statins", "Proton pump inhibitors (short-term use)"], correct: 1, rationale: "Beer's Criteria identifies benzodiazepines as potentially inappropriate in older adults due to increased sensitivity, prolonged sedation, cognitive impairment, delirium, falls, and fracture risk. Safer alternatives should be considered." },
      { question: "A practical nurse is assessing fall risk in an 80-year-old patient. Which factor represents the HIGHEST risk for falls?", options: ["History of one fall in the past year", "Use of reading glasses", "Taking four or more medications including a sedative", "Mild hearing loss"], correct: 2, rationale: "Polypharmacy (4+ medications) especially including sedatives, antihypertensives, or diuretics significantly increases fall risk. Sedating medications impair balance, reaction time, and judgment, making falls more likely and more injurious." }
    ]
  },
  "gi-rpn": {
    pearls: [
      "Always auscultate bowel sounds in all four quadrants BEFORE palpation -- palpation can stimulate or alter bowel sounds.",
      "Coffee-ground emesis indicates digested blood from an upper GI bleed; bright red hematemesis indicates active upper GI bleeding -- both require urgent intervention.",
      "Start a bowel regimen (stool softener + stimulant laxative) on DAY ONE of opioid therapy -- do not wait for constipation to develop.",
      "A rigid, board-like abdomen is a surgical emergency indicating peritoneal irritation -- do not delay reporting.",
      "Proton pump inhibitors should be taken 30 minutes BEFORE meals for maximum effectiveness -- timing matters."
    ],
    quiz: [
      { question: "During abdominal assessment, the nurse notes a rigid, board-like abdomen with rebound tenderness. What is the priority action?", options: ["Document the finding and reassess next shift", "Encourage the patient to ambulate", "Report immediately to the physician as this suggests peritonitis", "Administer a laxative to relieve constipation"], correct: 2, rationale: "A rigid, board-like abdomen with rebound tenderness indicates peritoneal irritation, which is a surgical emergency that may indicate perforation, peritonitis, or other acute abdominal catastrophe requiring immediate medical evaluation." },
      { question: "A patient with a nasogastric tube is due for medication administration. What must the nurse verify first?", options: ["That the medication is available in liquid form", "Tube placement by pH testing or X-ray", "That the patient has not eaten recently", "That the drainage bag is at the correct level"], correct: 1, rationale: "Before any use of a nasogastric tube (feeding or medication), placement must be verified. pH testing of aspirate (<5.5 indicates gastric placement) or X-ray confirmation is required. Auscultation alone is NOT a reliable method." },
      { question: "Which stool characteristic suggests an upper GI bleed?", options: ["Bright red blood in the stool", "Clay-colored stool", "Black, tarry stool (melena)", "Mucus-streaked stool"], correct: 2, rationale: "Black, tarry stools (melena) indicate digested blood from an upper GI source. The blood turns black as it is digested during transit through the GI tract. Bright red blood (hematochezia) typically indicates a lower GI bleed." }
    ]
  },
  "heent-rpn": {
    pearls: [
      "New onset unequal pupils (anisocoria) is a neurological emergency until proven otherwise -- report immediately.",
      "When administering ear drops to an adult, pull the pinna UP and BACK to straighten the ear canal; for a child under 3, pull DOWN and BACK.",
      "Oral care every 2-4 hours for intubated patients with chlorhexidine rinse reduces ventilator-associated pneumonia risk significantly.",
      "Sudden unilateral hearing loss is a medical emergency -- urgent ENT referral within 72 hours gives the best chance of recovery.",
      "Always face the patient when speaking to someone with hearing impairment -- lip reading and facial expressions supplement hearing."
    ],
    quiz: [
      { question: "A nurse assesses a patient's pupils and finds the right pupil is 6mm and non-reactive while the left is 3mm and reactive. What is the priority action?", options: ["Document as a normal variant", "Dim the room lighting and reassess", "Report immediately as this may indicate a neurological emergency", "Administer prescribed eye drops"], correct: 2, rationale: "A unilateral fixed, dilated pupil is a sign of increased intracranial pressure or other neurological emergency (such as uncal herniation). This requires immediate reporting and intervention." },
      { question: "When administering ear drops to an adult patient, how should the nurse position the pinna?", options: ["Pull down and back", "Pull up and back", "Push forward and down", "No manipulation needed"], correct: 1, rationale: "In adults, the ear canal is straightened by pulling the pinna up and back, allowing the drops to flow down the canal to the tympanic membrane. In children under 3, the pinna is pulled down and back due to the different angle of the ear canal." },
      { question: "A patient on inhaled corticosteroids develops white patches on the oral mucosa. What condition should the nurse suspect?", options: ["Oral cancer", "Oral candidiasis (thrush)", "Vitamin B12 deficiency", "Allergic reaction to the inhaler"], correct: 1, rationale: "White patches on the oral mucosa in a patient using inhaled corticosteroids is most likely oral candidiasis (thrush), caused by local immunosuppression in the oropharynx. Prevention includes rinsing the mouth and gargling after each inhaler use." }
    ]
  },
  "hematology-rpn": {
    pearls: [
      "Stay with the patient for the first 15 minutes of a blood transfusion -- most severe reactions occur early.",
      "If a transfusion reaction is suspected, STOP the transfusion immediately, maintain IV access with normal saline, and notify the physician and blood bank.",
      "Low ferritin is the most sensitive and specific indicator of iron deficiency -- it becomes abnormal before hemoglobin drops.",
      "Oral iron should be taken on an empty stomach with vitamin C (orange juice) for best absorption -- warn patients about black stools.",
      "For patients on anticoagulants, consistency is key -- consistent vitamin K intake for warfarin, consistent timing for all anticoagulants."
    ],
    quiz: [
      { question: "During a blood transfusion, a patient develops fever, chills, and flank pain within the first 10 minutes. What is the FIRST nursing action?", options: ["Slow the transfusion rate", "Administer diphenhydramine and acetaminophen", "Stop the transfusion immediately and maintain IV access with normal saline", "Continue the transfusion and monitor closely"], correct: 2, rationale: "These symptoms suggest an acute hemolytic transfusion reaction, which is a medical emergency. The transfusion must be stopped immediately, IV access maintained with normal saline, and the physician and blood bank notified. The blood bag and tubing should be returned to the blood bank for investigation." },
      { question: "A patient has an INR of 4.5 while on warfarin therapy with a target INR of 2.0-3.0. What is the primary nursing concern?", options: ["The dose is subtherapeutic", "The patient is at increased risk of bleeding", "The patient needs a higher dose", "The INR is within normal limits"], correct: 1, rationale: "An INR above the therapeutic range (4.5 vs. target 2.0-3.0) indicates excessive anticoagulation, placing the patient at significantly increased risk of bleeding. The nurse should assess for signs of bleeding, hold the warfarin dose, and notify the physician." },
      { question: "Which precaution is essential for a patient with a platelet count of 15,000/uL?", options: ["Strict neutropenic precautions", "Fall prevention only", "Bleeding precautions including soft toothbrush, electric razor, and avoiding IM injections", "No special precautions needed"], correct: 2, rationale: "A platelet count of 15,000/uL indicates severe thrombocytopenia with risk of spontaneous bleeding. Bleeding precautions are essential: soft-bristle toothbrush, electric razor only, avoid IM injections and rectal temperatures, apply prolonged pressure to venipuncture sites, and monitor for petechiae, purpura, and ecchymoses." }
    ]
  },
  "hemodialysis-rpn": {
    pearls: [
      "An absent thrill or bruit in an AV fistula indicates thrombosis -- report immediately as this is a dialysis access emergency.",
      "NEVER take blood pressure, draw blood, or start an IV on the fistula arm -- protect the access at all costs.",
      "Apply pressure to fistula needle sites for at least 10-20 minutes after dialysis -- do NOT apply circumferential bandages that could compress the access.",
      "The most common acute complication of hemodialysis is intradialytic hypotension -- monitor vital signs every 30 minutes during treatment.",
      "Phosphate binders must be taken WITH meals to work -- they bind dietary phosphorus in the gut."
    ],
    quiz: [
      { question: "A nurse assesses a patient's AV fistula before hemodialysis and cannot palpate a thrill or auscultate a bruit. What does this finding indicate?", options: ["Normal fistula function", "The fistula is not yet mature", "Possible fistula thrombosis requiring immediate reporting", "The patient is dehydrated"], correct: 2, rationale: "A patent AV fistula should have a palpable thrill (vibration) and an audible bruit (whooshing sound) indicating blood flow. Absence of both suggests thrombosis, which is an emergency requiring immediate reporting and intervention to restore access patency." },
      { question: "Which action by the nurse would be UNSAFE regarding a patient's AV fistula?", options: ["Palpating the fistula for a thrill before dialysis", "Taking blood pressure on the fistula arm", "Auscultating the fistula for a bruit", "Educating the patient to exercise the fistula arm"], correct: 1, rationale: "Blood pressure measurement on the fistula arm is contraindicated as the cuff compression can damage or thrombose the fistula. BP, blood draws, and IV access should always be performed on the non-fistula arm." },
      { question: "A patient on hemodialysis should take their phosphate binders at which time?", options: ["At bedtime", "First thing in the morning on an empty stomach", "With meals", "Between meals on an empty stomach"], correct: 2, rationale: "Phosphate binders work by binding dietary phosphorus in the GI tract, preventing its absorption. They must be taken WITH meals to be effective. Taking them on an empty stomach provides no benefit." }
    ]
  },
  "immune-rpn": {
    pearls: [
      "Epinephrine IM is the FIRST-LINE treatment for anaphylaxis -- do not delay giving epinephrine while waiting for antihistamines or corticosteroids to take effect.",
      "Febrile neutropenia (ANC <500 with fever >38.3C) is a medical emergency -- blood cultures and empiric antibiotics must be initiated within 60 minutes.",
      "Live vaccines are contraindicated in immunocompromised patients -- always check immune status before vaccination.",
      "The most important infection prevention measure for immunocompromised patients is strict hand hygiene by everyone entering the room.",
      "Autoimmune diseases affect women 3 times more often than men -- hormonal and genetic factors play a role."
    ],
    quiz: [
      { question: "A patient with a known peanut allergy suddenly develops urticaria, wheezing, and hypotension after eating at the hospital cafeteria. What is the FIRST medication to administer?", options: ["Diphenhydramine (Benadryl) IV", "Methylprednisolone (Solu-Medrol) IV", "Epinephrine 0.3 mg IM in the anterolateral thigh", "Albuterol nebulizer"], correct: 2, rationale: "Epinephrine IM is the first-line treatment for anaphylaxis and should be administered immediately. Antihistamines and corticosteroids are adjunct treatments but should never delay epinephrine administration." },
      { question: "A chemotherapy patient has an absolute neutrophil count (ANC) of 400/uL and a temperature of 38.5C. What is the priority action?", options: ["Apply a cooling blanket to reduce the fever", "Obtain blood cultures and initiate broad-spectrum antibiotics within 60 minutes", "Administer acetaminophen and recheck temperature in 4 hours", "Place on standard precautions only"], correct: 1, rationale: "Febrile neutropenia (ANC <500 with temp >38.3C) is a medical emergency. The patient is at high risk of sepsis due to insufficient immune response. Blood cultures and empiric broad-spectrum antibiotics must be initiated within 60 minutes." },
      { question: "Which type of hypersensitivity reaction is responsible for anaphylaxis?", options: ["Type I -- IgE-mediated immediate hypersensitivity", "Type II -- cytotoxic hypersensitivity", "Type III -- immune complex hypersensitivity", "Type IV -- delayed cell-mediated hypersensitivity"], correct: 0, rationale: "Anaphylaxis is a Type I (immediate) hypersensitivity reaction mediated by IgE antibodies. Upon re-exposure to the allergen, IgE-sensitized mast cells and basophils degranulate, releasing histamine and other mediators causing vasodilation, bronchoconstriction, and increased vascular permeability." }
    ]
  },
  "infections-rpn": {
    pearls: [
      "Obtain cultures BEFORE starting antibiotics -- culture results guide targeted therapy and antibiotic stewardship.",
      "For C. difficile, use soap and water for hand hygiene -- alcohol-based hand rub does NOT kill C. difficile spores.",
      "In sepsis, every hour of antibiotic delay increases mortality by approximately 7.6% -- time to antibiotics matters.",
      "The single most effective measure to prevent healthcare-associated infections remains proper hand hygiene -- yet compliance rates remain below 50% in many facilities.",
      "Contact precautions require gown AND gloves for room entry; droplet precautions require a surgical mask within 2 meters; airborne precautions require an N95 respirator and negative pressure room."
    ],
    quiz: [
      { question: "A nurse is caring for a patient with suspected C. difficile infection. Which hand hygiene method should be used?", options: ["Alcohol-based hand rub for 20 seconds", "Soap and water for at least 40 seconds", "Antibacterial hand wipes", "Hand sanitizer foam"], correct: 1, rationale: "C. difficile produces spores that are NOT killed by alcohol-based hand sanitizers. Soap and water with friction is required to physically remove the spores from hands. This is also true for Norovirus." },
      { question: "Which interventions are included in the sepsis bundle? Select the MOST complete answer.", options: ["Antibiotics only", "Blood cultures, serum lactate, broad-spectrum antibiotics within 1 hour, and IV fluid resuscitation", "Fever management and blood cultures", "IV fluids and vasopressors only"], correct: 1, rationale: "The sepsis bundle includes obtaining blood cultures, measuring serum lactate, administering broad-spectrum antibiotics within 1 hour, and initiating rapid IV crystalloid fluid resuscitation (30 mL/kg for hypotension or lactate >4 mmol/L)." },
      { question: "A patient is on airborne precautions for suspected tuberculosis. Which PPE must the nurse wear when entering the room?", options: ["Surgical mask", "N95 respirator", "Gown and gloves only", "Face shield only"], correct: 1, rationale: "Airborne precautions require an N95 respirator (or PAPR) because airborne pathogens like TB are transmitted via droplet nuclei that remain suspended in air and can travel long distances. The patient should be in a negative-pressure room. A surgical mask is inadequate for airborne precautions." }
    ]
  },
  "musculoskeletal-rpn": {
    pearls: [
      "Pain with passive stretch is the EARLIEST and most reliable sign of compartment syndrome -- do not wait for the '5 Ps' to all be present.",
      "Fat embolism syndrome typically occurs 24-72 hours after a long bone fracture -- watch for the triad of respiratory distress, petechial rash, and neurological changes.",
      "After total hip replacement, remember the three DON'Ts: do not flex the hip beyond 90 degrees, do not adduct past midline, do not internally rotate.",
      "Bisphosphonates (alendronate) must be taken on an empty stomach with a full glass of water, and the patient must remain upright for 30 minutes to prevent esophageal erosion.",
      "All immobilized patients need DVT prophylaxis -- this includes both mechanical (SCDs, ankle pumps) and pharmacological (enoxaparin, heparin) measures."
    ],
    quiz: [
      { question: "A patient with a newly applied leg cast reports severe pain that is NOT relieved by prescribed analgesics and worsens with passive toe extension. What should the nurse suspect?", options: ["Normal post-fracture pain", "Compartment syndrome", "DVT", "Phantom limb pain"], correct: 1, rationale: "Severe pain disproportionate to the injury that worsens with passive stretch of the involved muscles is the earliest and most reliable sign of compartment syndrome. This is a surgical emergency requiring fasciotomy within 6 hours to prevent permanent neuromuscular damage." },
      { question: "Which assessment is the HIGHEST priority for a patient with a new cast on the right forearm?", options: ["Pain level assessment", "Neurovascular check of the right hand", "Range of motion of the shoulder", "Skin assessment under the cast"], correct: 1, rationale: "Neurovascular assessment (5 Ps: Pain, Pallor, Pulselessness, Paresthesia, Paralysis) of the extremity distal to the cast is the highest priority to detect compartment syndrome, circulatory compromise, or nerve damage early." },
      { question: "A patient is 48 hours post-femur fracture repair and develops sudden dyspnea, confusion, and a petechial rash on the chest. What should the nurse suspect?", options: ["Pulmonary embolism", "Pneumonia", "Fat embolism syndrome", "Anxiety attack"], correct: 2, rationale: "Fat embolism syndrome typically occurs 24-72 hours after a long bone fracture and presents with the classic triad: respiratory distress, neurological changes (confusion), and petechial rash (especially on the chest, axillae, and conjunctivae)." }
    ]
  },
  "nutrition-supplements-rpn": {
    pearls: [
      "Refeeding syndrome is most dangerous in the first 72 hours of nutritional reintroduction in severely malnourished patients -- start low and go slow with calories.",
      "Albumin has a 20-day half-life and is affected by inflammation -- prealbumin (2-3 day half-life) is a more responsive indicator of acute nutritional changes.",
      "Warfarin patients need CONSISTENT vitamin K intake, not avoidance -- sudden changes in green leafy vegetable consumption cause INR fluctuations.",
      "Verify NG tube placement before EVERY use -- never rely on auscultation alone; use pH testing (aspirate pH <5.5 suggests gastric placement) or X-ray.",
      "Patients eating less than 50% of meals for 2 or more consecutive days need nutritional intervention -- do not wait for weight loss to act."
    ],
    quiz: [
      { question: "A severely malnourished patient begins receiving enteral nutrition. Which electrolyte abnormality is the nurse MOST concerned about during the first 72 hours?", options: ["Hyperkalemia", "Hypophosphatemia", "Hypernatremia", "Hypercalcemia"], correct: 1, rationale: "Refeeding syndrome is characterized by dangerous electrolyte shifts when nutrition is reintroduced after starvation. Hypophosphatemia is the hallmark and most dangerous derangement, potentially causing cardiac arrhythmias, respiratory failure, and death. Start feeds slowly and monitor phosphorus closely." },
      { question: "Before administering a bolus tube feeding through a nasogastric tube, the nurse checks the gastric residual and obtains 300 mL. What is the appropriate action?", options: ["Discard the residual and proceed with the feeding", "Hold the feeding and notify the physician", "Return the residual and administer the feeding as scheduled", "Increase the feeding rate to compensate"], correct: 1, rationale: "A gastric residual of 300 mL indicates delayed gastric emptying. The nurse should hold the feeding and notify the physician for further orders. Most protocols specify holding feedings for residuals >250-500 mL, depending on institutional policy." },
      { question: "A patient on warfarin asks about dietary restrictions. What is the most accurate information the nurse should provide?", options: ["Avoid all foods containing vitamin K", "Maintain CONSISTENT vitamin K intake from day to day", "Increase vitamin K intake to counteract the warfarin", "There are no dietary considerations with warfarin"], correct: 1, rationale: "Patients on warfarin should maintain consistent vitamin K intake rather than avoiding it entirely. Sudden increases or decreases in vitamin K-rich foods (green leafy vegetables) cause unpredictable fluctuations in INR and anticoagulation effect." }
    ]
  },
  "pain-management-rpn": {
    pearls: [
      "Pain is whatever the patient says it is -- the patient's self-report is the gold standard for pain assessment.",
      "Increasing sedation precedes respiratory depression in opioid therapy -- monitor sedation level as an early warning sign.",
      "ONLY the patient should press the PCA button -- never allow family members or visitors to activate it (PCA by proxy).",
      "Start a bowel regimen with the FIRST dose of opioid -- opioid-induced constipation does not develop tolerance.",
      "Neuropathic pain responds poorly to opioids alone -- gabapentin and pregabalin are first-line for neuropathic pain."
    ],
    quiz: [
      { question: "A patient on IV morphine via PCA has a respiratory rate of 8/min and a sedation score of 'difficult to arouse.' What is the priority nursing action?", options: ["Continue monitoring and reassess in 30 minutes", "Stop the PCA, stimulate the patient, and prepare to administer naloxone", "Increase the oxygen flow rate", "Administer the next scheduled PCA dose"], correct: 1, rationale: "Respiratory rate <10/min with excessive sedation indicates opioid-induced respiratory depression. The nurse should stop the PCA immediately, stimulate the patient, maintain the airway, administer naloxone (Narcan) as ordered, and provide ventilatory support if needed." },
      { question: "Which type of pain is BEST treated with gabapentin or pregabalin?", options: ["Acute post-operative nociceptive pain", "Visceral pain from bowel obstruction", "Neuropathic pain (burning, shooting, electric-shock quality)", "Mild headache"], correct: 2, rationale: "Gabapentin and pregabalin (anticonvulsants) are first-line treatments for neuropathic pain, which results from nerve damage and presents as burning, shooting, or electric-shock sensations. Neuropathic pain responds poorly to traditional analgesics like NSAIDs and has limited response to opioids alone." },
      { question: "A family member is pressing the PCA button while the patient is sleeping. What should the nurse do?", options: ["Thank the family member for helping", "Allow it since the patient is in pain", "Educate the family that ONLY the patient should press the PCA button and explain the risk of respiratory depression", "Increase the PCA lockout interval"], correct: 2, rationale: "PCA by proxy (anyone other than the patient pressing the PCA button) is dangerous because it bypasses the safety mechanism -- a sedated patient will stop pressing the button, preventing overdose. When someone else pushes it, the patient can receive doses despite being oversedated, leading to respiratory depression." }
    ]
  },
  "palliative-rpn": {
    pearls: [
      "Palliative care is NOT just end-of-life care -- it should be integrated alongside curative treatment from the time of diagnosis of any serious illness.",
      "There is NO maximum dose for opioids in palliative care -- the dose is titrated to the patient's pain level (principle of double effect).",
      "Loss of appetite and thirst is a NORMAL part of the dying process -- forcing nutrition and hydration can actually increase discomfort.",
      "The 'death rattle' (terminal secretions) is typically not distressing to the dying patient despite being distressing to family -- education is key.",
      "Mouth care is one of the most important comfort measures for dying patients -- moist swabs, lip balm, and gentle oral care every 1-2 hours."
    ],
    quiz: [
      { question: "A dying patient's family is distressed by noisy breathing (death rattle). What should the nurse explain?", options: ["The patient is in respiratory distress and needs suctioning", "This is caused by pharyngeal secretions and typically does not cause distress to the patient", "Aggressive suctioning should be performed every 30 minutes", "The patient needs to be intubated for comfort"], correct: 1, rationale: "Terminal secretions ('death rattle') result from the accumulation of pharyngeal secretions that the dying patient can no longer clear. While distressing to family, it typically does not cause distress to the dying patient. Gentle repositioning and anticholinergic medications (glycopyrrolate) can reduce the sound." },
      { question: "A palliative care patient is unable to swallow oral medications. Which route should the nurse use for ongoing pain management?", options: ["Intramuscular injection", "Intravenous only", "Subcutaneous or transdermal route", "Hold all medications until the patient can swallow"], correct: 2, rationale: "When a palliative patient can no longer swallow, medications should be converted to subcutaneous (continuous infusion or intermittent injection), transdermal (fentanyl patch), sublingual, or rectal routes. IM injections are painful and should be avoided. Holding pain medication would cause unnecessary suffering." },
      { question: "A family asks the nurse to start IV fluids because their dying loved one has stopped eating and drinking. What is the most therapeutic response?", options: ["Agree and start the IV immediately", "Explain that loss of appetite is normal in the dying process and that IV fluids may actually increase discomfort by causing fluid overload, congestion, and edema", "Tell them there is nothing more that can be done", "Document the request and ignore it"], correct: 1, rationale: "Loss of appetite and thirst is a normal, expected part of the dying process. Artificial hydration in dying patients can increase edema, pulmonary congestion, and secretions, causing more discomfort. The nurse should gently educate the family while providing comfort measures like mouth care." }
    ]
  },
  "patient-positioning-rpn": {
    pearls: [
      "Reposition immobile patients at MINIMUM every 2 hours using 30-degree lateral tilt to redistribute pressure -- document all position changes.",
      "Heels are the second most common site for pressure injuries -- always float heels off the bed surface using pillows or suspension devices.",
      "After total hip replacement: no flexion beyond 90 degrees, no adduction past midline, no internal rotation -- use an abduction pillow between the legs.",
      "Head of bed elevation at 30-45 degrees is essential during tube feedings AND for 30-60 minutes after to prevent aspiration.",
      "Never manually lift a patient who exceeds safe limits -- always use mechanical lifting devices to protect both the patient and yourself."
    ],
    quiz: [
      { question: "A nurse is caring for an immobile patient with a Braden Scale score of 12. How often should the patient be repositioned?", options: ["Every 4 hours", "Every 2 hours at minimum", "Once per shift", "Only when the patient requests it"], correct: 1, rationale: "A Braden Scale score of 12 indicates high risk for pressure injury. Immobile patients should be repositioned at minimum every 2 hours (more frequently for very high risk) using 30-degree lateral tilt positions to offload pressure from bony prominences." },
      { question: "Which position is MOST appropriate for a patient in acute respiratory distress?", options: ["Supine with legs elevated", "High Fowler's position (60-90 degrees)", "Prone position", "Trendelenburg position"], correct: 1, rationale: "High Fowler's position maximizes diaphragmatic excursion and lung expansion by allowing abdominal contents to drop away from the diaphragm, reducing the work of breathing and improving oxygenation." },
      { question: "A post-operative hip replacement patient attempts to cross their legs while sitting in a chair. What is the nurse's priority action?", options: ["Allow it if the patient is comfortable", "Immediately uncross the legs and reinforce hip precautions -- no adduction past midline", "Document the finding only", "Apply bilateral leg restraints"], correct: 1, rationale: "Crossing the legs causes adduction past midline, which is contraindicated after total hip replacement because it risks prosthetic hip dislocation. The nurse should immediately correct the position and re-educate the patient about hip precautions." }
    ]
  },
  "procedures-rpn": {
    pearls: [
      "When in doubt about sterility, consider it contaminated -- the cost of re-preparing a sterile field is far less than the cost of a surgical site infection.",
      "Label ALL specimens at the bedside immediately after collection -- never pre-label containers or transport unlabeled specimens.",
      "Verify NG tube placement with pH testing (aspirate pH <5.5 suggests gastric) or X-ray -- auscultation alone is NOT reliable.",
      "For IV infiltration, the key is EARLY detection -- assess the site with every medication administration and compare with the opposite extremity.",
      "Maximum peripheral IV dwell time is 72-96 hours per most policies -- assess the site every shift and remove at the first sign of phlebitis."
    ],
    quiz: [
      { question: "While setting up a sterile field for wound care, the nurse accidentally touches the sterile drape with an ungloved hand. What should the nurse do?", options: ["Continue with the procedure since only a small area was contaminated", "Discard the sterile field and set up a new one", "Cover the contaminated area with another sterile drape", "Use alcohol to clean the contaminated area"], correct: 1, rationale: "A sterile item that has been touched by a non-sterile item is considered contaminated. The entire sterile field must be discarded and a new one set up. There is no way to re-sterilize a contaminated field." },
      { question: "A nurse is inserting a urinary catheter and notices resistance during insertion. What is the appropriate action?", options: ["Apply more force to advance the catheter", "Inflate the balloon to advance past the obstruction", "Stop the procedure, withdraw the catheter, and notify the physician", "Ask the patient to bear down and force the catheter through"], correct: 2, rationale: "Never force a urinary catheter past resistance as this can cause urethral trauma, false passage, or perforation. Stop the procedure, withdraw the catheter, and notify the physician for further assessment and possible alternative approaches." },
      { question: "Which assessment finding at a peripheral IV site indicates phlebitis requiring removal?", options: ["Clear, colorless dressing", "Redness, warmth, and pain along the vein with a palpable cord", "Slight dampness at the insertion site", "Patient reports no discomfort at the site"], correct: 1, rationale: "Phlebitis is characterized by redness (erythema), warmth, pain along the course of the vein, and a palpable venous cord. This indicates inflammation of the vein wall and requires immediate catheter removal, warm compress application, and documentation." }
    ]
  },
  "renal-rpn": {
    pearls: [
      "Urine output less than 0.5 mL/kg/hour for 2 consecutive hours is an early sign of acute kidney injury -- report immediately.",
      "When starting an ACE inhibitor, a creatinine rise up to 30% from baseline is expected and acceptable -- above 30% is concerning.",
      "Potassium greater than 6.0 mEq/L is a medical emergency -- check the ECG for peaked T waves and prepare for emergent treatment.",
      "Salt substitutes contain potassium chloride -- patients on potassium restriction must avoid them.",
      "Daily weight is more reliable than I&O for assessing fluid status in renal patients -- 1 kg = 1 liter."
    ],
    quiz: [
      { question: "A patient's serum potassium is 6.8 mEq/L. Which ECG change should the nurse expect?", options: ["Flattened T waves and prominent U waves", "Peaked T waves and widened QRS", "Normal sinus rhythm", "ST elevation"], correct: 1, rationale: "Hyperkalemia causes progressive ECG changes: first peaked T waves, then prolonged PR interval, then widened QRS, then loss of P waves, and finally a sine wave pattern preceding cardiac arrest. At 6.8 mEq/L, peaked T waves and widened QRS are expected." },
      { question: "A patient with CKD asks why they cannot use salt substitutes. What is the nurse's best explanation?", options: ["Salt substitutes taste different from regular salt", "Salt substitutes contain potassium chloride, which can dangerously raise potassium levels in kidney disease", "Salt substitutes are more expensive", "Salt substitutes contain too much sodium"], correct: 1, rationale: "Salt substitutes typically replace sodium chloride with potassium chloride. In patients with CKD, the kidneys cannot adequately excrete potassium, so using salt substitutes can cause dangerous hyperkalemia." },
      { question: "A nurse initiates ramipril (ACE inhibitor) in a CKD patient. Creatinine rises from 150 to 185 umol/L after 2 weeks. What should the nurse understand about this finding?", options: ["The medication is causing kidney damage and must be stopped", "A creatinine rise up to 30% from baseline is expected and indicates the drug is working", "The dose should be doubled", "This is a sign of acute kidney injury"], correct: 1, rationale: "ACE inhibitors reduce intraglomerular pressure by dilating the efferent arteriole, which causes a predictable, expected rise in creatinine up to 30% from baseline. This rise indicates the drug is providing its renoprotective effect. A rise >30% warrants investigation and possible discontinuation." }
    ]
  },
  "safety-ethics-rpn": {
    pearls: [
      "In a Just Culture, the response to error depends on the behavior type: human error gets consolation, at-risk behavior gets coaching, reckless behavior gets discipline.",
      "If it wasn't documented, it wasn't done -- and if it was documented but not done, that is falsification of medical records.",
      "Two patient identifiers (name and date of birth) must be verified before EVERY medication, procedure, specimen collection, and blood transfusion -- room number is NEVER an identifier.",
      "Mandatory reporting obligations (abuse, neglect, communicable diseases, unsafe practice) override patient confidentiality -- the nurse is legally and ethically obligated to report.",
      "The four bioethical principles are autonomy, beneficence, non-maleficence, and justice -- ethical dilemmas arise when these principles conflict."
    ],
    quiz: [
      { question: "A nurse discovers that a colleague has been documenting medication administration without actually giving the medications to patients. What is the nurse's professional obligation?", options: ["Discuss it privately with the colleague and hope it stops", "Report the behavior through appropriate channels as this is a patient safety issue and professional misconduct", "Ignore it to avoid conflict", "Cover the colleague's patients for the remainder of the shift"], correct: 1, rationale: "The nurse has a professional and legal obligation to report unsafe practice. Falsifying medication administration records is both professional misconduct and a serious patient safety issue. Failure to report makes the observing nurse complicit." },
      { question: "A competent adult patient refuses a life-saving blood transfusion based on religious beliefs. What is the ethical principle that supports the patient's right to refuse?", options: ["Beneficence", "Non-maleficence", "Autonomy", "Justice"], correct: 2, rationale: "Autonomy is the ethical principle that respects a patient's right to make informed decisions about their own care, including the right to refuse treatment. If the patient is competent, fully informed, and the decision is voluntary, the healthcare team must respect this decision even if it may result in death." },
      { question: "A nurse suspects that an elderly patient is being financially abused by a family member. What is the appropriate action?", options: ["Discuss concerns with the family member directly", "Report to the appropriate authorities as required by mandatory reporting laws", "Document the concern but take no further action", "Wait for more evidence before acting"], correct: 1, rationale: "Suspected elder abuse (physical, emotional, financial, or neglect) triggers mandatory reporting obligations. The nurse must report to the appropriate authority (Adult Protective Services, police) as required by law, regardless of whether absolute proof exists. Documentation of objective findings is also essential." }
    ]
  },
  "skin-rpn": {
    pearls: [
      "Stage 1 pressure injury (non-blanchable erythema) is your early warning -- intervene aggressively now to prevent progression.",
      "Never use a donut-shaped cushion for pressure relief -- it concentrates pressure around the ring edges and worsens ischemia.",
      "The Braden Scale score determines the intensity of prevention interventions: <18 at-risk, <14 moderate risk, <12 high risk, <9 very high risk.",
      "Melanoma detection: remember ABCDE -- Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolving.",
      "Moisture-associated skin damage (from incontinence) is NOT a pressure injury -- it requires different management: barrier cream, continence care, and moisture management."
    ],
    quiz: [
      { question: "A nurse assesses a patient's sacrum and finds a 3cm area of non-blanchable erythema on intact skin. What stage pressure injury is this?", options: ["Stage 1", "Stage 2", "Stage 3", "Deep tissue pressure injury"], correct: 0, rationale: "Stage 1 pressure injury is defined as non-blanchable erythema of intact skin. The area does not blanch (turn white) when pressed and may be painful, firm, soft, warmer or cooler compared to surrounding tissue. This is the earliest identifiable stage and requires immediate preventive intervention." },
      { question: "Which Braden Scale score indicates HIGH risk for pressure injury development?", options: ["Score of 20", "Score of 16", "Score of 11", "Score of 23"], correct: 2, rationale: "Braden Scale scores: 19-23 = no risk, 15-18 = at-risk, 13-14 = moderate risk, 10-12 = high risk, 9 or below = very high risk. A score of 11 indicates high risk requiring aggressive prevention including specialty mattress, repositioning every 1-2 hours, nutritional optimization, and moisture management." },
      { question: "A patient has a skin lesion that is asymmetric, has irregular borders, displays multiple colors, and has grown in size over the past month. What should the nurse suspect?", options: ["Benign mole", "Basal cell carcinoma", "Melanoma", "Seborrheic keratosis"], correct: 2, rationale: "The ABCDE criteria for melanoma are present: Asymmetry, Border irregularity, Color variation, and Evolving (growing). Melanoma is the most dangerous form of skin cancer and requires urgent referral for biopsy." }
    ]
  },
  "wound-care-rpn": {
    pearls: [
      "Moist wound healing is the evidence-based standard -- wounds heal faster in a moist environment than a dry one.",
      "Do not use hydrogen peroxide or full-strength povidone-iodine on clean granulating wounds -- they are cytotoxic to healing cells.",
      "Wound measurement is always length (head to toe) x width (side to side) x depth -- be consistent to track healing accurately.",
      "An ABI (ankle-brachial index) MUST be obtained before applying compression therapy for venous leg ulcers -- compression with ABI <0.5 can cause limb-threatening ischemia.",
      "A wound that has not improved in 2-4 weeks of appropriate treatment needs reassessment -- consider infection, biofilm, unaddressed etiology, or nutritional deficiency."
    ],
    quiz: [
      { question: "A nurse is performing wound care on a chronic wound with 80% granulation tissue and moderate serous exudate. Which dressing is MOST appropriate?", options: ["Dry gauze", "Hydrogel", "Foam dressing", "Transparent film"], correct: 2, rationale: "A foam dressing is ideal for wounds with moderate exudate as it absorbs excess moisture while maintaining a moist wound healing environment. Dry gauze disrupts granulation, hydrogel adds moisture (not needed with existing exudate), and transparent film cannot manage moderate exudate." },
      { question: "Before applying compression bandaging for a venous leg ulcer, which assessment is ESSENTIAL?", options: ["Wound culture", "Ankle-brachial index (ABI)", "Serum albumin level", "Complete blood count"], correct: 1, rationale: "An ankle-brachial index (ABI) must be obtained before applying compression therapy. An ABI <0.5 indicates severe arterial insufficiency where compression could further compromise arterial blood flow and cause limb-threatening ischemia." },
      { question: "A nurse irrigates a wound with normal saline using a 35 mL syringe and 19-gauge angiocatheter. What is the purpose of this specific technique?", options: ["To sterilize the wound bed", "To deliver irrigation pressure of 4-15 psi that effectively cleanses without damaging granulation tissue", "To apply antiseptic solution deep into the wound", "To debride necrotic tissue mechanically"], correct: 1, rationale: "A 35 mL syringe with a 19-gauge angiocatheter delivers approximately 8 psi of irrigation pressure, which falls within the recommended range of 4-15 psi. This pressure is sufficient to remove surface debris and bacteria without damaging delicate granulation tissue." }
    ]
  }
};

const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");

let fixed = 0;
let errors = 0;

for (const id of rpnIds) {
  const data = quizData[id];
  if (!data) { console.log(`  SKIP: no quiz data for ${id}`); continue; }
  
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    if (!src.includes(`"${id}"`)) continue;
    
    // Find the closing brace of this lesson's object
    const startIdx = src.indexOf(`"${id}"`);
    let depth = 0;
    let i = src.indexOf("{", startIdx);
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      if (src[i] === "}") depth--;
      if (depth === 0) break;
    }
    
    // Check what's missing
    const block = src.substring(startIdx, i + 1);
    const needsSigns = !block.includes("signs:");
    const needsMedications = !block.includes("medications:");
    const needsPearls = !block.includes("pearls:");
    const needsQuiz = !block.includes("quiz:");
    
    if (!needsPearls && !needsQuiz && !needsSigns && !needsMedications) {
      console.log(`  OK: ${id} already has all fields in ${file}`);
      continue;
    }
    
    // Build the fields to add before the closing brace
    const additions: string[] = [];
    
    if (needsSigns) {
      additions.push(`    signs: { left: ["Condition managed effectively with appropriate nursing interventions and patient education"], right: ["Clinical deterioration requiring escalation and advanced intervention"] },`);
    }
    if (needsMedications) {
      additions.push(`    medications: [{ name: "See Specific Condition Lessons", type: "Reference", action: "Refer to individual condition-specific lessons for detailed medication information", sideEffects: "N/A", contra: "N/A", pearl: "Always verify medication appropriateness within RPN scope of practice before administration." }],`);
    }
    if (needsPearls) {
      const pearlsStr = data.pearls.map(p => `"${escapeStr(p)}"`).join(",");
      additions.push(`    pearls: [${pearlsStr}],`);
    }
    if (needsQuiz) {
      const quizStr = data.quiz.map(q => 
        `{ question: "${escapeStr(q.question)}", options: [${q.options.map(o => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`
      ).join(",");
      additions.push(`    quiz: [${quizStr}],`);
    }
    
    // Insert before the closing brace of the lesson
    const insertPoint = i;
    const before = src.substring(0, insertPoint);
    const after = src.substring(insertPoint);
    
    src = before + "\n" + additions.join("\n") + "\n  " + after;
    fs.writeFileSync(fp, src, "utf-8");
    
    const addedFields = [];
    if (needsSigns) addedFields.push("signs");
    if (needsMedications) addedFields.push("medications");
    if (needsPearls) addedFields.push("pearls");
    if (needsQuiz) addedFields.push("quiz");
    console.log(`  FIXED: ${id} -> ${file} (added: ${addedFields.join(", ")})`);
    fixed++;
    break;
  }
}

console.log(`\nDone: ${fixed} lessons fixed`);
