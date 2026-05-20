import type { ExamQuestion } from "./types";

export const rnExpansionKQuestions: ExamQuestion[] = [
  // ===== PEDIATRIC CARDIOLOGY: Kawasaki (Questions 1-5) =====
  {
    q: "A 3-year-old has had fever for 6 days with bilateral conjunctival injection, strawberry tongue, swollen red hands/feet, and a polymorphous rash. The nurse suspects:",
    o: ["Scarlet fever", "Kawasaki disease", "Measles", "Stevens-Johnson syndrome"],
    a: 1,
    r: "Fever ≥5 days plus 4 of 5 principal criteria (CRASH: Conjunctivitis, Rash, Adenopathy, Strawberry tongue, Hand/foot changes) is diagnostic for Kawasaki disease.",
    s: "Pediatric"
  },
  {
    q: "IVIG for Kawasaki disease must be given within how many days of fever onset to reduce coronary aneurysm risk from 25% to <5%?",
    o: ["3 days", "5 days", "10 days", "14 days"],
    a: 2,
    r: "IVIG 2g/kg within the first 10 days of illness reduces coronary artery aneurysm risk from 25% to <5%. Timing is critical for cardioprotection.",
    s: "Pediatric"
  },
  {
    q: "After IVIG administration for Kawasaki disease, which vaccines must be delayed and for how long?",
    o: ["No vaccines need to be delayed", "Live vaccines (MMR, varicella) must be delayed 11 months", "All vaccines delayed 6 months", "Only influenza vaccine delayed 3 months"],
    a: 1,
    r: "Passive antibodies in IVIG interfere with live vaccine immunogenicity. MMR and varicella must be delayed 11 months post-IVIG to ensure adequate immune response.",
    s: "Pediatric"
  },
  {
    q: "Kawasaki disease is the leading cause of acquired heart disease in children in developed countries. The most serious complication is:",
    o: ["Renal failure", "Hepatic encephalopathy", "Coronary artery aneurysm", "Pulmonary fibrosis"],
    a: 2,
    r: "Coronary artery aneurysms occur in 25% of untreated children and can cause MI, sudden death, or long-term ischemic heart disease. Echocardiography at diagnosis, 2 weeks, and 6-8 weeks monitors for this complication.",
    s: "Pediatric"
  },
  {
    q: "Aspirin is used in Kawasaki disease despite the usual pediatric contraindication because:",
    o: ["Aspirin is safe in all children over age 2", "The anti-inflammatory and antiplatelet properties are essential for reducing coronary artery aneurysm risk", "The dose is too low for any risk", "It is only given for one day"],
    a: 1,
    r: "Kawasaki disease is one of the rare exceptions where aspirin is indicated in children. High-dose (anti-inflammatory) during febrile phase transitions to low-dose (antiplatelet) for 6-8 weeks minimum.",
    s: "Pediatric"
  },
  // ===== NEUROLOGY: Dementia vs Delirium, Parkinson (Questions 6-12) =====
  {
    q: "The Confusion Assessment Method (CAM) requires which two features PLUS at least one additional feature for a positive delirium screen?",
    o: ["Memory loss AND personality change", "Acute onset/fluctuating course AND inattention", "Chronic cognitive decline AND wandering", "Visual hallucinations AND paranoia"],
    a: 1,
    r: "CAM requires: acute onset/fluctuating course AND inattention PLUS either disorganized thinking OR altered level of consciousness. Sensitivity 94-100%, specificity 90-95%.",
    s: "Neurological"
  },
  {
    q: "Which form of delirium is most commonly MISSED in clinical practice?",
    o: ["Hyperactive delirium", "Hypoactive delirium", "Mixed delirium", "Emergence delirium"],
    a: 1,
    r: "Hypoactive delirium (withdrawal, lethargy, flat affect) is the most common and most missed form. It is often mistaken for depression or fatigue. Nurses must screen proactively with CAM.",
    s: "Neurological"
  },
  {
    q: "The single most common cause of delirium in elderly hospitalized patients is:",
    o: ["Medication overdose", "Urinary tract infection", "Sleep deprivation alone", "Dehydration alone"],
    a: 1,
    r: "UTI is the most common cause of delirium in elderly patients. Always check urinalysis when evaluating new-onset confusion in an older adult.",
    s: "Neurological"
  },
  {
    q: "A PD patient has involuntary writhing movements 1 hour after taking carbidopa/levodopa. This represents:",
    o: ["Medication not working", "Peak-dose dyskinesias from excessive dopamine", "Seizure activity", "Disease progression"],
    a: 1,
    r: "Dyskinesias at peak medication levels indicate excessive dopaminergic stimulation—a long-term complication of levodopa therapy. Management includes dose adjustment, adding amantadine, or continuous delivery systems.",
    s: "Neurological"
  },
  {
    q: "Which medication should the nurse question if prescribed to a Parkinson disease patient?",
    o: ["Quetiapine", "Haloperidol", "Donepezil", "Carbidopa/levodopa"],
    a: 1,
    r: "Haloperidol is a potent D2 blocker that dramatically worsens parkinsonian symptoms. Only quetiapine and clozapine have minimal D2 activity and are safe for psychosis in PD.",
    s: "Neurological"
  },
  {
    q: "A PD patient's spouse reports compulsive gambling and excessive online shopping. The most likely medication cause is:",
    o: ["Carbidopa/levodopa", "Pramipexole (dopamine agonist)", "Amantadine", "Benztropine"],
    a: 1,
    r: "Dopamine agonists (pramipexole, ropinirole) cause impulse control disorders in up to 17% of patients: gambling, hypersexuality, compulsive shopping/eating. Requires dose reduction or discontinuation.",
    s: "Neurological"
  },
  {
    q: "Which instruction is essential for carbidopa/levodopa therapy?",
    o: ["Take with high-protein meals for better effect", "Never abruptly discontinue—risk of parkinsonism-hyperpyrexia syndrome", "Take only when symptoms are present", "Urine darkening means the drug is toxic"],
    a: 1,
    r: "Abrupt discontinuation of carbidopa/levodopa can cause parkinsonism-hyperpyrexia syndrome (resembles NMS: hyperthermia, rigidity, autonomic instability, altered consciousness). Drug holidays are no longer recommended.",
    s: "Neurological"
  },
  // ===== ENDOCRINE: DM, Thyroid, Adrenal (Questions 13-20) =====
  {
    q: "The Rule of 15 for hypoglycemia management states:",
    o: ["Give 15 units of insulin for BG >150", "Give 15g fast-acting carbohydrate, wait 15 minutes, recheck, repeat until BG >70", "Restrict carbohydrates to 15g per meal", "Check BG every 15 hours"],
    a: 1,
    r: "Rule of 15: give 15g fast-acting carb (4 oz juice, glucose tablets), wait 15 minutes, recheck BG. Repeat until >70, then give a protein snack to prevent recurrence.",
    s: "Endocrine"
  },
  {
    q: "Dawn phenomenon vs Somogyi effect: how does the nurse differentiate?",
    o: ["They are the same thing", "Check 3 AM blood glucose: normal in dawn phenomenon, low in Somogyi", "Somogyi only occurs in Type 2 DM", "Dawn phenomenon only occurs at noon"],
    a: 1,
    r: "Both cause morning hyperglycemia. Dawn phenomenon: normal 3 AM BG (hormonal surge). Somogyi: low 3 AM BG (rebound hyperglycemia from nocturnal hypoglycemia). Treatment differs: adjust basal insulin timing vs reduce evening dose.",
    s: "Endocrine"
  },
  {
    q: "An SGLT2 inhibitor patient has nausea, vomiting, and malaise with a blood glucose of 145 mg/dL. The nurse should:",
    o: ["Reassure—glucose is normal", "Check serum ketones—euglycemic DKA is possible with SGLT2 inhibitors", "Administer insulin for the hyperglycemia", "Discontinue the SGLT2 inhibitor permanently"],
    a: 1,
    r: "SGLT2 inhibitors can cause euglycemic DKA (normal glucose but acidotic). Symptoms include nausea, vomiting, malaise, and abdominal pain. Check ketones even with normal glucose.",
    s: "Endocrine"
  },
  {
    q: "Which finding is MOST specific for Cushing syndrome?",
    o: ["Hypertension", "Weight gain", "Wide purple striae >1cm", "Fatigue"],
    a: 2,
    r: "Wide (>1cm), purple/violaceous striae are the most specific finding for Cushing syndrome, reflecting cortisol-mediated dermal thinning. Hypertension, weight gain, and fatigue are nonspecific.",
    s: "Endocrine"
  },
  {
    q: "Hyperpigmentation in Addison disease affects skin folds, gingiva, and scars. It occurs in PRIMARY insufficiency because:",
    o: ["Low cortisol causes melanin overproduction directly", "Elevated ACTH stimulates melanocyte-stimulating hormone (both from POMC precursor)", "Fludrocortisone causes pigment changes", "UV sensitivity increases in adrenal disease"],
    a: 1,
    r: "In primary adrenal insufficiency, loss of cortisol negative feedback causes elevated ACTH. ACTH and MSH share the same precursor (POMC), so excess ACTH = excess MSH = hyperpigmentation. Does not occur in secondary insufficiency (ACTH is low).",
    s: "Endocrine"
  },
  {
    q: "Conn syndrome (primary hyperaldosteronism) should be suspected in a patient with:",
    o: ["Hypotension and hyperkalemia", "Resistant hypertension with unexplained hypokalemia", "Weight loss and heat intolerance", "Hypoglycemia and fatigue"],
    a: 1,
    r: "Primary hyperaldosteronism causes sodium retention (hypertension) and potassium secretion (hypokalemia) with metabolic alkalosis. Screen with aldosterone-to-renin ratio in resistant hypertension.",
    s: "Endocrine"
  },
  {
    q: "A patient on spironolactone for hyperaldosteronism should be monitored for which side effects?",
    o: ["Hypoglycemia and weight loss", "Hyperkalemia, gynecomastia, and menstrual irregularities", "Bronchospasm and urticaria", "Hair loss and nail changes"],
    a: 1,
    r: "Spironolactone blocks aldosterone receptors causing K+ retention (hyperkalemia risk). Anti-androgenic effects cause gynecomastia and menstrual irregularities. Eplerenone is a more selective alternative.",
    s: "Endocrine"
  },
  // ===== MUSCULOSKELETAL/IMMUNE (Questions 21-30) =====
  {
    q: "Morning stiffness lasting >60 minutes that improves with activity is characteristic of:",
    o: ["Osteoarthritis", "Rheumatoid arthritis", "Fibromyalgia", "Gout"],
    a: 1,
    r: "Inflammatory arthritis (RA): morning stiffness >60 min, improves with activity. Mechanical arthritis (OA): stiffness <30 min, worsens with activity. Duration of morning stiffness helps differentiate.",
    s: "Musculoskeletal"
  },
  {
    q: "Which supplement must accompany weekly methotrexate therapy?",
    o: ["Vitamin D", "Iron", "Folic acid 1mg daily", "Calcium"],
    a: 2,
    r: "Folic acid 1mg daily reduces methotrexate side effects (oral ulcers, nausea, hepatotoxicity) without reducing therapeutic efficacy. Essential component of RA management.",
    s: "Musculoskeletal"
  },
  {
    q: "A diabetic patient has a foot ulcer and a sterile probe reaches bone through the wound. This indicates:",
    o: ["Normal wound healing", "Probable osteomyelitis requiring further evaluation", "Need for immediate amputation", "Superficial wound only"],
    a: 1,
    r: "Probe-to-bone test positive in a diabetic foot ulcer has >90% positive predictive value for osteomyelitis. MRI and bone biopsy are needed for confirmation. Prolonged antibiotics required.",
    s: "Musculoskeletal"
  },
  {
    q: "Aggressive IV hydration for rhabdomyolysis should target a urine output of:",
    o: ["30 mL/hr", "50-100 mL/hr", "200-300 mL/hr", "500 mL/hr"],
    a: 2,
    r: "Target UOP 200-300 mL/hr (3 mL/kg/hr) to dilute myoglobin concentration and prevent tubular precipitation. May require 10-12 L/day in the first 24 hours.",
    s: "Musculoskeletal"
  },
  {
    q: "Do NOT correct hypocalcemia in rhabdomyolysis unless the patient is symptomatic because:",
    o: ["Calcium is not affected in rhabdomyolysis", "Calcium supplementation worsens renal failure", "Calcium deposits in damaged muscle and will cause rebound hypercalcemia during recovery", "Calcium interferes with myoglobin clearance"],
    a: 2,
    r: "Calcium deposited in injured muscle during the acute phase is released during recovery, causing rebound hypercalcemia. Only treat hypocalcemia if symptomatic (tetany, seizures, arrhythmias).",
    s: "Musculoskeletal"
  },
  {
    q: "The penicillin-cephalosporin cross-reactivity rate for third-generation cephalosporins is approximately:",
    o: ["25-30%", "15-20%", "Less than 2%", "50%"],
    a: 2,
    r: "Cross-reactivity between penicillins and third-generation cephalosporins is <2%. A non-anaphylactic penicillin allergy history generally does not preclude cephalosporin use with monitoring.",
    s: "Infection Control"
  },
  {
    q: "Culture and sensitivity specimens should ideally be obtained:",
    o: ["After 24 hours of antibiotic therapy", "Before starting antibiotics, but never delay antibiotics >60 min in sepsis", "Only if the patient has not responded to treatment", "Only from wound sites"],
    a: 1,
    r: "Cultures should be obtained before antibiotics to maximize organism recovery. However, in sepsis, antibiotics must not be delayed >60 minutes—obtain cultures quickly then start antibiotics immediately.",
    s: "Infection Control"
  },
  {
    q: "Stress hyperglycemia in critically ill patients should be managed with a glucose target of:",
    o: ["80-110 mg/dL (tight control)", "140-180 mg/dL", "200-250 mg/dL", "No specific target needed"],
    a: 1,
    r: "The NICE-SUGAR trial showed tight glucose control (<110) increased mortality in ICU patients. Target 140-180 mg/dL balances hyperglycemia risks without causing dangerous hypoglycemia.",
    s: "Endocrine"
  },
  {
    q: "Any patient on ≥5mg prednisone equivalent daily for ≥3 weeks may need stress-dose steroids during illness or surgery because:",
    o: ["Prednisone causes liver failure", "The HPA axis is suppressed and cannot mount adequate cortisol response to stress", "Prednisone depletes calcium stores", "Prednisone causes immunosuppression only"],
    a: 1,
    r: "Chronic exogenous corticosteroids suppress the HPA axis via negative feedback, causing adrenal atrophy. During physiological stress, the atrophied adrenals cannot produce enough cortisol, risking adrenal crisis.",
    s: "Endocrine"
  }
];
