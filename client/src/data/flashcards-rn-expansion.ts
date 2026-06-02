import type { FlashcardData } from "./flashcards-rpn";

export const rnExpansionFlashcards: FlashcardData[] = [
  // ============================================================
  // CARDIOVASCULAR EXPANSION (MI, HF, AAA)
  // ============================================================
  {
    id: "rn-exp-cv-1",
    type: "question",
    question: "A patient with acute STEMI has ST elevation in leads II, III, aVF, and V4R. Blood pressure is 78/50 with JVD. Which intervention should the nurse AVOID?",
    options: ["IV normal saline bolus", "Dobutamine infusion", "Sublingual nitroglycerin", "12-lead ECG monitoring"],
    correctIndex: 2,
    answer: "Right ventricular MI (indicated by V4R ST elevation with inferior STEMI) is preload-dependent. Nitroglycerin causes venodilation, reducing preload and potentially causing severe hypotension. IV fluids are the appropriate intervention to maintain preload.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-exp-cv-2",
    type: "question",
    question: "A nurse is transitioning a HFrEF patient from lisinopril to sacubitril/valsartan. What is the mandatory washout period?",
    options: ["12 hours", "24 hours", "36 hours", "48 hours"],
    correctIndex: 2,
    answer: "A 36-hour washout period is required between the last ACEi dose and the first sacubitril/valsartan dose to prevent life-threatening angioedema from dual RAAS and neprilysin inhibition.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-exp-cv-3",
    type: "question",
    question: "Which heart sound finding differentiates HFrEF from HFpEF?",
    options: ["S1 splitting", "S3 gallop indicates volume overload (HFrEF); S4 gallop indicates stiff ventricle (HFpEF)", "Mitral valve click", "Pericardial friction rub"],
    correctIndex: 1,
    answer: "S3 gallop is caused by rapid ventricular filling into a dilated, compliant ventricle (HFrEF). S4 gallop is caused by atrial contraction against a stiff, noncompliant ventricle (HFpEF/hypertensive heart disease).",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-exp-cv-4",
    type: "question",
    question: "A 70-year-old male smoker presents with sudden tearing back pain, hypotension, and a pulsatile abdominal mass. The nurse's priority action is:",
    options: ["Obtain a CT scan", "Establish two large-bore IVs and prepare for emergency surgery", "Administer IV morphine", "Place in Trendelenburg position"],
    correctIndex: 1,
    answer: "The classic triad of ruptured AAA (pain, hypotension, pulsatile mass) requires immediate IV access for volume resuscitation and preparation for emergency surgical repair. Mortality is 80-90% without surgery.",
    category: "Cardiovascular",
    difficulty: 3
  },
  {
    id: "rn-exp-cv-5",
    type: "question",
    question: "Post-MI, a patient develops an accelerated idioventricular rhythm (AIVR) at 70 bpm and is hemodynamically stable. What is the appropriate nursing action?",
    options: ["Prepare for cardioversion", "Administer amiodarone", "Continue monitoring—AIVR is a benign reperfusion arrhythmia", "Administer atropine"],
    correctIndex: 2,
    answer: "AIVR is a common, benign reperfusion arrhythmia indicating successful restoration of coronary blood flow. It typically resolves spontaneously and does not require treatment in hemodynamically stable patients.",
    category: "Cardiovascular",
    difficulty: 2
  },
  {
    id: "rn-exp-cv-6",
    type: "question",
    question: "A heart failure patient gains 4 pounds overnight. What assessment should the nurse perform FIRST?",
    options: ["Check BNP level", "Auscultate lung sounds and assess for edema", "Administer extra furosemide", "Restrict fluids to 500 mL/day"],
    correctIndex: 1,
    answer: "Weight gain >2 lbs/day or >5 lbs/week in HF suggests fluid retention. The nurse should first assess for decompensation (crackles, edema, JVD, dyspnea) to provide a comprehensive report before intervening.",
    category: "Cardiovascular",
    difficulty: 2
  },
  // ============================================================
  // NEUROLOGY EXPANSION (Stroke, Seizures, Meningitis, Dementia/Delirium, Parkinson)
  // ============================================================
  {
    id: "rn-exp-neuro-1",
    type: "question",
    question: "A patient presents with left-sided hemiplegia and aphasia 90 minutes after symptom onset. CT shows no hemorrhage. BP is 176/94. What is the priority?",
    options: ["Lower BP to <140/90", "Administer IV alteplase per protocol", "Obtain MRI for confirmation", "Administer aspirin 325mg"],
    correctIndex: 1,
    answer: "Within the 4.5-hour tPA window with no hemorrhage on CT and BP <185/110, IV alteplase is the priority to salvage the ischemic penumbra. Aspirin is held 24 hours post-tPA.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-exp-neuro-2",
    type: "question",
    question: "Why is nimodipine given ORALLY and never IV in subarachnoid hemorrhage?",
    options: ["IV form is not manufactured", "IV administration has caused fatal cardiovascular collapse", "Oral absorption is more reliable", "IV form causes seizures"],
    correctIndex: 1,
    answer: "Nimodipine given IV has caused fatal cardiovascular collapse. It must be given only PO or via NG tube, 60mg every 4 hours for 21 days after SAH to prevent cerebral vasospasm.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-exp-neuro-3",
    type: "question",
    question: "During a witnessed tonic-clonic seizure, which nursing action is CONTRAINDICATED?",
    options: ["Turning the patient to the side", "Inserting an oral airway between the teeth", "Timing the seizure duration", "Removing nearby hazardous objects"],
    correctIndex: 1,
    answer: "NEVER place anything in the mouth during a seizure. The risk of broken teeth, aspiration, and airway obstruction from a foreign object far outweighs the minimal risk of tongue biting.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-exp-neuro-4",
    type: "question",
    question: "A patient with suspected bacterial meningitis needs a CT before LP. What should the nurse do regarding antibiotics?",
    options: ["Wait for LP results", "Wait for CT results", "Draw blood cultures and start empiric antibiotics immediately", "Start antibiotics after Gram stain"],
    correctIndex: 2,
    answer: "Every hour of antibiotic delay in bacterial meningitis increases mortality by 30%. Blood cultures should be drawn immediately and empiric antibiotics started without waiting for CT or LP.",
    category: "Neurological",
    difficulty: 3
  },
  {
    id: "rn-exp-neuro-5",
    type: "question",
    question: "An 80-year-old hip surgery patient was oriented on admission. On post-op day 2, they are confused, pulling at IVs, and seeing 'bugs on the wall.' This is most consistent with:",
    options: ["Alzheimer disease", "Post-operative delirium", "Major depression", "Normal post-op recovery"],
    correctIndex: 1,
    answer: "Acute onset of confusion, agitation, and visual hallucinations in a previously oriented hospitalized elderly patient is classic post-operative delirium. Key differentiators from dementia: acute onset, fluctuating course, inattention.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-exp-neuro-6",
    type: "question",
    question: "A PD patient takes carbidopa/levodopa. When should the medication be administered relative to meals?",
    options: ["With high-protein meals", "30-60 minutes before meals", "Immediately after meals", "Timing does not matter"],
    correctIndex: 1,
    answer: "Dietary protein competes with levodopa for transport across the intestinal wall and blood-brain barrier. Taking levodopa 30-60 minutes before meals maximizes absorption and brain uptake.",
    category: "Neurological",
    difficulty: 2
  },
  {
    id: "rn-exp-neuro-7",
    type: "question",
    question: "Which medication is CONTRAINDICATED in Lewy body dementia?",
    options: ["Quetiapine", "Haloperidol", "Donepezil", "Melatonin"],
    correctIndex: 1,
    answer: "Haloperidol and other typical antipsychotics are contraindicated in Lewy body dementia due to extreme dopaminergic sensitivity that can cause fatal neuroleptic sensitivity reactions with severe rigidity and autonomic instability.",
    category: "Neurological",
    difficulty: 3
  },
  // ============================================================
  // ENDOCRINE EXPANSION (DM, DKA, Thyroid, Adrenal)
  // ============================================================
  {
    id: "rn-exp-endo-1",
    type: "question",
    question: "In DKA management, what must be checked BEFORE starting an insulin drip?",
    options: ["Blood glucose level", "Serum potassium level", "Urine ketones", "Hemoglobin A1C"],
    correctIndex: 1,
    answer: "Serum potassium must be ≥3.3 mEq/L before starting insulin. Insulin drives potassium intracellularly; starting insulin with low K+ can cause fatal cardiac arrhythmias from hypokalemia.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-exp-endo-2",
    type: "question",
    question: "A DKA patient's glucose is 185 mg/dL but pH is 7.15 with anion gap 22. What should the nurse anticipate?",
    options: ["Stop the insulin drip", "Continue insulin and add D5W to IV fluids", "Switch to oral hypoglycemics", "Administer sodium bicarbonate IV push"],
    correctIndex: 1,
    answer: "Glucose normalizes before acidosis resolves. The insulin drip must continue until DKA resolves (pH >7.30, bicarb ≥15, anion gap ≤12). Dextrose is added to IV fluids to prevent hypoglycemia while continuing insulin.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-exp-endo-3",
    type: "question",
    question: "A patient on methimazole reports fever 102°F, sore throat, and mouth ulcers. The nurse should advise:",
    options: ["Take OTC cold medicine", "Come to the ED immediately for stat CBC", "Gargle with salt water", "This is expected and will resolve"],
    correctIndex: 1,
    answer: "Fever, sore throat, and mouth ulcers on methimazole suggest agranulocytosis—a potentially fatal drop in WBC/neutrophils. A stat CBC with differential is mandatory. If ANC <500, the drug is permanently discontinued.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-exp-endo-4",
    type: "question",
    question: "Post-thyroidectomy, a patient has perioral tingling and positive Chvostek sign. What does this indicate?",
    options: ["Hypocalcemia from parathyroid damage", "Normal post-surgical healing", "Recurrent laryngeal nerve damage", "Thyroid storm"],
    correctIndex: 0,
    answer: "Perioral tingling and positive Chvostek sign (facial twitch when tapping over the facial nerve) indicate hypocalcemia from inadvertent parathyroid damage during thyroidectomy. Treat with IV calcium gluconate.",
    category: "Endocrine",
    difficulty: 2
  },
  {
    id: "rn-exp-endo-5",
    type: "question",
    question: "An Addison disease patient presents with BP 70/40, temp 103°F, Na+ 118, K+ 6.8. What is the priority?",
    options: ["Administer spironolactone", "Administer IV hydrocortisone 100mg immediately", "Obtain morning cortisol level first", "Start methimazole"],
    correctIndex: 1,
    answer: "This is an adrenal crisis—a life-threatening emergency. IV hydrocortisone 100mg is given immediately without waiting for diagnostic confirmation. The hyponatremia and hyperkalemia reflect aldosterone deficiency.",
    category: "Endocrine",
    difficulty: 3
  },
  {
    id: "rn-exp-endo-6",
    type: "question",
    question: "Before starting levothyroxine in a patient with both hypothyroidism and suspected adrenal insufficiency, which medication must be given FIRST?",
    options: ["Levothyroxine", "Hydrocortisone", "Methimazole", "Propranolol"],
    correctIndex: 1,
    answer: "Cortisol must be replaced before levothyroxine. Thyroid hormone increases cortisol metabolism; without adequate cortisol, levothyroxine can precipitate life-threatening adrenal crisis.",
    category: "Endocrine",
    difficulty: 3
  },
  // ============================================================
  // HEMATOLOGY/ONCOLOGY (ALL/AML, Neutropenia, Sickle Cell)
  // ============================================================
  {
    id: "rn-exp-heme-1",
    type: "question",
    question: "A patient undergoing AML induction has K+ 6.9, PO4 8.0, Ca2+ 6.2, uric acid 15. What complication has occurred?",
    options: ["Septic shock", "Tumor lysis syndrome", "DIC", "Adrenal crisis"],
    correctIndex: 1,
    answer: "Hyperkalemia, hyperphosphatemia, hypocalcemia, and hyperuricemia define tumor lysis syndrome—rapid tumor cell death releasing intracellular contents. Treatment: aggressive hydration, rasburicase, and electrolyte management.",
    category: "Hematology",
    difficulty: 3
  },
  {
    id: "rn-exp-heme-2",
    type: "question",
    question: "A neutropenic patient (ANC 150) has temperature 100.8°F. What is the FIRST nursing action?",
    options: ["Administer acetaminophen", "Obtain blood cultures and notify provider for stat antibiotics", "Apply cooling blankets", "Administer filgrastim"],
    correctIndex: 1,
    answer: "Febrile neutropenia is a medical emergency. Fever may be the ONLY sign of life-threatening infection. Blood cultures and empiric broad-spectrum antibiotics must be initiated within 60 minutes.",
    category: "Hematology",
    difficulty: 3
  },
  {
    id: "rn-exp-heme-3",
    type: "question",
    question: "Which food is SAFE for a patient on neutropenic precautions?",
    options: ["Raw sushi", "Fresh salad", "Well-cooked chicken breast", "Soft-ripened cheese"],
    correctIndex: 2,
    answer: "Neutropenic diet restricts raw/undercooked foods that may harbor bacteria: no raw meats, unpasteurized dairy, soft cheeses, or raw fruits/vegetables. Well-cooked foods are safe.",
    category: "Hematology",
    difficulty: 1
  },
  {
    id: "rn-exp-heme-4",
    type: "question",
    question: "A sickle cell patient presents with fever, chest pain, and SpO2 88%. CXR shows a new infiltrate. The nurse suspects:",
    options: ["Pneumonia only", "Acute chest syndrome", "Pulmonary embolism", "Pleural effusion"],
    correctIndex: 1,
    answer: "Fever, chest pain, respiratory distress, hypoxemia, and new pulmonary infiltrate in SCD define acute chest syndrome—the leading cause of death in SCD. Treatment: oxygen, antibiotics, transfusion, incentive spirometry.",
    category: "Hematology",
    difficulty: 3
  },
  {
    id: "rn-exp-heme-5",
    type: "question",
    question: "What is the priority nursing intervention for a sickle cell vaso-occlusive crisis?",
    options: ["Apply cold compresses", "Administer IV analgesics within 30 minutes and hydration", "Restrict fluids", "Encourage ambulation"],
    correctIndex: 1,
    answer: "Pain management within 30 minutes is the priority. IV opioids plus NSAIDs provide multimodal analgesia. Aggressive IV hydration reduces blood viscosity. Cold worsens sickling; heat is preferred.",
    category: "Hematology",
    difficulty: 2
  },
  // ============================================================
  // MUSCULOSKELETAL (RA, Rhabdomyolysis, Osteomyelitis)
  // ============================================================
  {
    id: "rn-exp-msk-1",
    type: "question",
    question: "A nurse is administering methotrexate to an RA patient. Which verification is CRITICAL?",
    options: ["That the dose is daily", "That the dose is WEEKLY, not daily", "That it's given with high-protein food", "That it's given with TMP-SMX"],
    correctIndex: 1,
    answer: "Methotrexate for RA is a WEEKLY dose. Daily methotrexate is a common and potentially fatal medication error that can cause severe pancytopenia and mucositis.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-exp-msk-2",
    type: "question",
    question: "A patient has CK 45,000, dark brown urine, and was found on the floor for 12 hours. What is the priority intervention?",
    options: ["Urine culture and antibiotics", "Aggressive IV normal saline targeting UOP 200-300 mL/hr", "IV calcium chloride", "Ice packs to all extremities"],
    correctIndex: 1,
    answer: "Aggressive IV hydration is the cornerstone of rhabdomyolysis treatment. It increases renal perfusion, dilutes myoglobin in tubular fluid, and prevents precipitation and AKI. Early hydration within 6 hours dramatically reduces AKI risk.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-exp-msk-3",
    type: "question",
    question: "Urine dipstick is positive for blood but microscopy shows NO red blood cells. This finding suggests:",
    options: ["False positive test", "Myoglobinuria from rhabdomyolysis", "Urinary tract infection", "Glomerulonephritis"],
    correctIndex: 1,
    answer: "The urine dipstick detects the heme group in both hemoglobin and myoglobin. Positive dipstick with no RBCs on microscopy = myoglobinuria from rhabdomyolysis until proven otherwise.",
    category: "Musculoskeletal",
    difficulty: 3
  },
  {
    id: "rn-exp-msk-4",
    type: "question",
    question: "During vancomycin infusion, a patient develops facial and upper trunk flushing. The nurse should:",
    options: ["Stop permanently and document allergy", "Slow the infusion, give diphenhydramine, restart at slower rate", "Administer epinephrine", "Continue at the same rate"],
    correctIndex: 1,
    answer: "Red Man syndrome is a rate-related histamine release, NOT a true allergy. Slow or stop the infusion, give diphenhydramine, restart at slower rate (minimum 60 min/gram). Do not label as allergy.",
    category: "Musculoskeletal",
    difficulty: 2
  },
  // ============================================================
  // IMMUNE/INFECTION CONTROL
  // ============================================================
  {
    id: "rn-exp-immune-1",
    type: "question",
    question: "A pregnant patient at 30 weeks asks about recommended vaccines. Which is indicated?",
    options: ["MMR", "Tdap", "Live attenuated influenza nasal spray", "Varicella"],
    correctIndex: 1,
    answer: "Tdap is recommended during each pregnancy at 27-36 weeks to provide passive antibody transfer protecting the newborn against pertussis. MMR, varicella, and LAIV are live vaccines contraindicated in pregnancy.",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-exp-immune-2",
    type: "question",
    question: "After vaccine administration, a patient develops hives, throat swelling, and hypotension within 10 minutes. What is the FIRST medication?",
    options: ["Diphenhydramine 50mg IV", "Methylprednisolone 125mg IV", "Epinephrine 0.3mg IM in the vastus lateralis", "Albuterol nebulizer"],
    correctIndex: 2,
    answer: "Anaphylaxis requires IMMEDIATE epinephrine IM as first-line treatment. Antihistamines and corticosteroids are adjuncts, not substitutes. Epinephrine must be available wherever vaccines are given.",
    category: "Infection Control",
    difficulty: 2
  },
  {
    id: "rn-exp-immune-3",
    type: "question",
    question: "Which infection control precaution is correct for MRSA wound infection?",
    options: ["Standard precautions only", "Contact precautions with gown and gloves", "Airborne precautions with N95", "Droplet precautions with surgical mask"],
    correctIndex: 1,
    answer: "MRSA is transmitted by direct contact. Contact precautions (gown and gloves upon room entry, dedicated equipment) are required. Airborne is for TB, measles, varicella. Droplet is for meningococcus, influenza.",
    category: "Infection Control",
    difficulty: 1
  },
  {
    id: "rn-exp-immune-4",
    type: "question",
    question: "A patient on prednisone 20mg daily for 6 months is admitted for emergency surgery. What perioperative medication is essential?",
    options: ["Continue oral prednisone only", "Stress-dose IV hydrocortisone", "Discontinue prednisone", "Start methimazole"],
    correctIndex: 1,
    answer: "Chronic corticosteroid use suppresses the HPA axis. During surgery, the adrenals cannot mount an adequate cortisol response. Stress-dose IV hydrocortisone (100mg bolus then 50mg q8h) prevents adrenal crisis.",
    category: "Endocrine",
    difficulty: 3
  }
];
