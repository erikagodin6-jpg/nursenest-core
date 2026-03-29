import type { ExamQuestion } from "./types";

export const rnCatExpansionQuestions: ExamQuestion[] = [
  // ===== CAT-STYLE ADAPTIVE QUESTIONS: Cardiovascular =====
  {
    q: "A nurse receives morning labs on four patients. Which result requires the MOST immediate action?\n\nPatient A: Potassium 3.4 mEq/L on furosemide\nPatient B: Troponin I 0.04 ng/mL (normal <0.04) with new substernal chest pressure\nPatient C: BNP 250 pg/mL in known HFrEF patient\nPatient D: INR 2.8 on warfarin for atrial fibrillation",
    o: ["Patient A: Potassium replacement needed", "Patient B: Borderline troponin with chest pain requires immediate evaluation and serial troponins", "Patient C: BNP is elevated but expected in chronic HF", "Patient D: INR is within therapeutic range for AFib"],
    a: 1,
    r: "Patient B has an acute presentation: new chest pain with troponin at the upper limit of normal requires immediate ECG, serial troponins at 3-6 hours, and cardiology consultation. This could be an evolving MI. Patient A needs K+ replacement but is not in immediate danger. Patient C and D have expected findings.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is prioritizing care for four patients at the start of the shift. Which patient should be assessed FIRST?\n\n1. Post-MI patient 48 hours ago, stable vitals, asking for pain medication\n2. HFrEF patient with new-onset dyspnea at rest and SpO2 88%\n3. AAA surveillance patient with stable 4.5cm aneurysm, BP 132/78\n4. Kawasaki disease child, day 3 of IVIG, temperature 37.2°C",
    o: ["Patient 1: Post-MI requesting pain medication", "Patient 2: HF patient with new dyspnea and hypoxemia", "Patient 3: AAA surveillance with stable BP", "Patient 4: Kawasaki child with low-grade temp"],
    a: 1,
    r: "New-onset dyspnea at rest with SpO2 88% in an HFrEF patient indicates acute decompensation—a potentially life-threatening emergency requiring immediate assessment, oxygen, and likely IV diuretics. This represents an acute change in condition with respiratory compromise.",
    s: "Cardiovascular"
  },
  // ===== CAT-STYLE: Neurology =====
  {
    q: "A nurse is caring for four neurological patients. Which situation requires the MOST immediate intervention?\n\n1. Stroke patient 6 hours post-tPA with BP 172/94\n2. Seizure patient with phenytoin level 18 mcg/mL reporting mild headache\n3. Meningitis patient on antibiotics for 18 hours, temperature now 100.2°F\n4. Stroke patient 2 hours post-tPA developing sudden severe headache, vomiting, and new left arm weakness",
    o: ["Patient 1: BP needs monitoring but is within acceptable range post-tPA", "Patient 2: Phenytoin level is therapeutic; headache is manageable", "Patient 3: Fever is decreasing on antibiotics; expected course", "Patient 4: New symptoms post-tPA suggest hemorrhagic conversion—emergency"],
    a: 3,
    r: "Sudden headache, vomiting, and new neurological deficits 2 hours post-tPA strongly suggest hemorrhagic conversion—a life-threatening emergency. Stop tPA immediately, obtain stat CT, prepare cryoprecipitate. The other patients have stable or expected findings.",
    s: "Neurological"
  },
  {
    q: "A nurse must delegate care for four patients to an LPN. Which task is appropriate to delegate?\n\n1. Performing the initial neurological assessment on a new stroke admission\n2. Administering IV alteplase per stroke protocol\n3. Monitoring vital signs on a stable post-seizure patient\n4. Assessing a patient's response to lorazepam for status epilepticus",
    o: ["Initial neurological assessment on stroke admission", "IV alteplase administration", "Monitoring vital signs on stable post-seizure patient", "Assessing response to IV lorazepam"],
    a: 2,
    r: "Monitoring vital signs on a stable patient is within LPN scope—a predictable, routine task. Initial assessment, IV thrombolytic administration, and evaluating response to emergency medications all require RN-level assessment and clinical judgment.",
    s: "Neurological"
  },
  // ===== CAT-STYLE: Endocrine =====
  {
    q: "A nurse receives four phone calls simultaneously. Which should be addressed FIRST?\n\n1. Type 2 DM patient: fasting glucose 185 mg/dL, feels fine\n2. DKA patient: K+ result 2.8 mEq/L, insulin drip currently running\n3. Hypothyroid patient: TSH 8.2, scheduled for dose adjustment\n4. Cushing patient: morning cortisol 42 mcg/dL, awaiting test results",
    o: ["Patient 1: Needs medication adjustment at next visit", "Patient 2: Critical hypokalemia with insulin running—stop insulin immediately", "Patient 3: Needs thyroid dose increase but not urgent", "Patient 4: Results confirm diagnosis, not an emergency"],
    a: 1,
    r: "K+ 2.8 with insulin running is immediately life-threatening. Insulin drives K+ intracellularly, dropping it further and risking fatal cardiac arrhythmias. The insulin must be stopped and K+ replaced before resuming. All other situations are non-emergent.",
    s: "Endocrine"
  },
  {
    q: "A patient with Type 1 DM, adrenal insufficiency, and hypothyroidism requires all three medications. In which order should the nurse administer them?",
    o: ["Levothyroxine first, then hydrocortisone, then insulin", "Hydrocortisone first, then levothyroxine, then insulin with meals", "Insulin first, then levothyroxine, then hydrocortisone", "All three can be given simultaneously"],
    a: 1,
    r: "Cortisol must be replaced BEFORE thyroid hormone (levothyroxine increases cortisol metabolism, risking adrenal crisis). Insulin is given with meals as scheduled. The sequence: hydrocortisone → levothyroxine (30-60 min before food) → insulin with meals.",
    s: "Endocrine"
  },
  // ===== CAT-STYLE: Hematology =====
  {
    q: "A nurse is caring for a patient receiving induction chemotherapy for AML. At 0600, the following findings are noted:\n- Temperature 100.6°F\n- ANC calculated at 180\n- CK within normal limits\n- Potassium 6.2, phosphorus 7.8, calcium 7.0, uric acid 12\n\nWhich TWO findings require the MOST immediate intervention?",
    o: ["The fever with ANC 180 (febrile neutropenia) AND the electrolyte pattern (tumor lysis syndrome)", "Only the temperature elevation needs attention", "Only the potassium elevation needs treatment", "The calcium level is the sole priority"],
    a: 0,
    r: "Two emergencies are occurring simultaneously: (1) Febrile neutropenia requiring antibiotics within 60 minutes, and (2) Tumor lysis syndrome (hyperK, hyperPO4, hypoCa, hyperuricemia) requiring aggressive hydration and rasburicase. Both require immediate intervention.",
    s: "Hematology"
  },
  {
    q: "A sickle cell disease patient presents to the ED in vaso-occlusive crisis. The triage nurse reviews the chart and notes the patient has presented 8 times in the past 3 months. What is the MOST appropriate nursing response?",
    o: ["Document concerns about drug-seeking behavior", "Initiate pain management protocol within 30 minutes without judgment", "Suggest the patient try non-pharmacological methods first", "Limit opioid administration to prevent dependence"],
    a: 1,
    r: "Frequent ED visits for SCD pain crises reflect disease severity, not drug-seeking behavior. Undertreatment of SCD pain is a well-documented healthcare disparity. The nurse should follow the pain management protocol and administer analgesics within 30 minutes without bias.",
    s: "Hematology"
  },
  // ===== CAT-STYLE: Infection Control =====
  {
    q: "A nurse is assigning rooms on a medical unit. Which patient assignments are appropriate?\n\n1. MRSA wound infection in Room A (private)\n2. Active tuberculosis in Room B (private, negative pressure)\n3. Meningococcal meningitis in Room C (private, droplet precautions)\n4. C. difficile infection in Room D (private, contact precautions)\n\nWhich room assignment would be INCORRECT?",
    o: ["MRSA in private room with contact precautions—correct", "TB in private negative pressure room with airborne precautions—correct", "Meningococcal meningitis placed in a shared room—INCORRECT; requires private room with droplet precautions", "C. difficile in private room with contact precautions—correct"],
    a: 2,
    r: "Meningococcal meningitis requires droplet precautions in a private room until 24 hours of effective antibiotic therapy. A shared room would expose the roommate to N. meningitidis transmitted via respiratory droplets.",
    s: "Infection Control"
  },
  {
    q: "A nurse is educating nursing students about antibiotic stewardship. Which statement by a student requires correction?",
    o: ["Cultures should be obtained before starting antibiotics when possible", "Broad-spectrum antibiotics should be used empirically then narrowed based on culture results", "Patients should complete their full antibiotic course even if feeling better", "If the patient has a viral URI, a broad-spectrum antibiotic should be prescribed prophylactically to prevent bacterial superinfection"],
    a: 3,
    r: "Prescribing antibiotics prophylactically for viral infections is a major driver of antimicrobial resistance. Antibiotics are ineffective against viruses and should only be used when bacterial infection is confirmed or strongly suspected.",
    s: "Infection Control"
  },
  // ===== CAT-STYLE: Cross-system Clinical Judgment =====
  {
    q: "A critically ill patient has the following: temperature 103.2°F, HR 128, BP 82/48, WBC 22,000, lactate 4.2 mmol/L, blood glucose 268 mg/dL, and has been on prednisone 30mg daily for 3 months. Which interventions should the nurse anticipate? Select the BEST answer.",
    o: ["IV fluids and antibiotics only", "IV fluids, broad-spectrum antibiotics within 60 minutes, stress-dose hydrocortisone, and insulin drip for stress hyperglycemia", "Stress-dose steroids only since the patient is on chronic prednisone", "Blood cultures then observe for 24 hours before starting antibiotics"],
    a: 1,
    r: "This patient has sepsis (fever, tachycardia, hypotension, elevated lactate) complicated by chronic steroid-induced HPA suppression and stress hyperglycemia. All four interventions are needed: volume resuscitation, empiric antibiotics within 60 minutes, stress-dose hydrocortisone (suppressed HPA axis), and insulin for glucose control.",
    s: "Critical Care"
  },
  {
    q: "A nurse is reviewing discharge instructions with a patient who has multiple chronic conditions. The patient takes: metformin 1000mg BID, lisinopril 20mg daily, carvedilol 12.5mg BID, and methotrexate weekly for RA. Which discharge instruction is MOST critical?",
    o: ["Take all medications with meals for best absorption", "If you develop fever, sore throat, or mouth sores, seek immediate medical attention", "You can stop metformin if your blood sugar normalizes", "Take methotrexate daily instead of weekly for faster results"],
    a: 1,
    r: "Methotrexate can cause life-threatening agranulocytosis. Fever, sore throat, and mouth ulcers may indicate dangerously low WBC counts requiring emergent CBC. This instruction could save the patient's life. Option D is a potentially fatal medication error.",
    s: "Pharmacology"
  },
  {
    q: "A nurse working the night shift has four patients. At 0200, the following occurs simultaneously:\n\n1. Post-op thyroidectomy patient reports difficulty breathing with stridor\n2. HF patient requests PRN furosemide for leg swelling\n3. DM patient has BG of 62 mg/dL and is alert\n4. Post-MI patient asks for sleeping medication\n\nWhich patient should the nurse see FIRST?",
    o: ["Patient 1: Stridor post-thyroidectomy indicates potential airway compromise—life-threatening emergency", "Patient 2: Leg swelling is chronic and stable", "Patient 3: BG 62 needs treatment but patient is alert and oriented", "Patient 4: Sleep medication is a comfort measure"],
    a: 0,
    r: "Post-thyroidectomy stridor indicates potential airway compromise from hemorrhage, laryngeal edema, or bilateral recurrent laryngeal nerve damage. This is a life-threatening emergency requiring immediate assessment and possible emergent intervention (tracheostomy tray at bedside). ABCs always take priority.",
    s: "Critical Care"
  }
];
