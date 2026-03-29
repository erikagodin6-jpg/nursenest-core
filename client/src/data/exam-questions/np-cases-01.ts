import type { ExamQuestion } from "./types";

export const npCases01Questions: ExamQuestion[] = [
  {
    q: "A 52-year-old male presents to primary care with a 3-month history of progressive fatigue, unintentional weight gain of 8 kg, constipation, and cold intolerance. He has dry, coarse skin and periorbital oedema. Vital signs: HR 56, BP 142/88, T 36.1°C. Past medical history includes type 2 diabetes and dyslipidaemia. What is the most appropriate initial diagnostic test?",
    o: ["TSH level, as the clinical presentation is classic for primary hypothyroidism", "Free T3 level as the most sensitive thyroid marker", "Thyroid ultrasound to evaluate for structural abnormalities", "Random cortisol level to rule out adrenal insufficiency"],
    a: 0,
    r: "The presentation is classic primary hypothyroidism: fatigue, weight gain, constipation, cold intolerance, dry skin, periorbital oedema, and bradycardia. TSH is the most sensitive and specific initial screening test for thyroid dysfunction. In primary hypothyroidism, TSH will be elevated. Free T4 (not T3) is the appropriate follow-up if TSH is abnormal. Free T3 is not recommended as an initial test because T3 levels are maintained until late in hypothyroidism. Ultrasound evaluates structure, not function. Adrenal insufficiency causes weight loss, not gain.",
    s: "Endocrine"
  },
  {
    q: "A 52-year-old male with suspected hypothyroidism returns with lab results: TSH 48 mIU/L (normal 0.4-4.0), free T4 6 pmol/L (normal 12-22). Anti-TPO antibodies are strongly positive. What is the most appropriate treatment?",
    o: ["Levothyroxine 50-75 mcg daily with follow-up TSH in 6-8 weeks, starting at a lower dose given his age and cardiac risk factors", "Levothyroxine 200 mcg daily for rapid hormone replacement", "Liothyronine (T3) 25 mcg three times daily", "No treatment; recheck in 3 months as this may be transient thyroiditis"],
    a: 0,
    r: "With confirmed overt primary hypothyroidism (markedly elevated TSH, low free T4, positive anti-TPO confirming Hashimoto thyroiditis), levothyroxine replacement is indicated. In patients over 50 or with known cardiovascular disease/risk factors, starting at a lower dose (25-75 mcg) and titrating gradually prevents cardiac complications (angina, arrhythmias). Full-dose initiation (200 mcg) risks precipitating myocardial ischaemia. T3 monotherapy is not recommended due to short half-life and variable levels. With TSH of 48 and symptomatic disease, watchful waiting is inappropriate.",
    s: "Endocrine"
  },
  {
    q: "A 52-year-old male on levothyroxine 75 mcg daily for Hashimoto thyroiditis returns at 8 weeks. TSH is now 12 mIU/L, free T4 is 10 pmol/L. He reports some improvement in energy but still has constipation and dry skin. He takes his levothyroxine with breakfast along with his metformin and calcium carbonate supplement. What adjustment should the NP recommend?",
    o: ["Take levothyroxine on an empty stomach 30-60 minutes before breakfast and separate from calcium by at least 4 hours, then increase the dose by 25 mcg", "Double the levothyroxine dose immediately since TSH is still elevated", "Switch to dessicated thyroid extract for better absorption", "Add liothyronine 10 mcg daily to the current levothyroxine"],
    a: 0,
    r: "Levothyroxine absorption is significantly impaired by food and by calcium, iron, and certain medications taken concurrently. Taking levothyroxine with breakfast and calcium carbonate substantially reduces absorption, explaining the persistently elevated TSH despite treatment. The first step is to correct the administration: take on an empty stomach 30-60 minutes before eating, and separate from calcium by at least 4 hours. A modest dose increase (25 mcg) is also appropriate given the still-elevated TSH. Doubling the dose without addressing the absorption issue is excessive. Dessicated thyroid has inconsistent potency. Adding T3 is not first-line.",
    s: "Pharmacology"
  },
  {
    q: "A 52-year-old male with Hashimoto thyroiditis asks the NP whether his thyroid condition could be causing his elevated cholesterol (total cholesterol 7.2 mmol/L, LDL 4.8 mmol/L). His lipids were borderline before the thyroid diagnosis. What is the most appropriate response?",
    o: ["Hypothyroidism commonly causes secondary dyslipidaemia; optimize thyroid replacement first and recheck lipids in 3 months before initiating statin therapy", "Start atorvastatin 40 mg immediately regardless of thyroid status", "There is no relationship between thyroid function and cholesterol levels", "Refer to an endocrinologist for the dyslipidaemia management"],
    a: 0,
    r: "Hypothyroidism is a well-established cause of secondary dyslipidaemia, particularly elevated total cholesterol and LDL. Thyroid hormone influences hepatic LDL receptor expression, and deficiency reduces LDL clearance. Guidelines recommend optimizing thyroid replacement and rechecking lipids after achieving euthyroidism (typically 3-6 months) before initiating statin therapy, as many patients see significant lipid improvement with thyroid correction alone. Starting statins prematurely is inappropriate if the dyslipidaemia may resolve. The relationship is well-documented. A referral is unnecessary for this straightforward management.",
    s: "Endocrine"
  },
  {
    q: "A 38-year-old female presents with a 2-week history of progressive shortness of breath, pleuritic chest pain, and a dry cough. She recently returned from a 14-hour international flight. She takes oral contraceptive pills. BMI is 32. Vital signs: HR 112, BP 118/74, RR 24, SpO2 93%, T 37.4°C. D-dimer is 2,840 ng/mL. What is the most appropriate diagnostic test?",
    o: ["CT pulmonary angiography to evaluate for pulmonary embolism", "Chest X-ray as the sole diagnostic investigation", "Ventilation-perfusion scan as first-line given normal renal function", "Repeat D-dimer in 48 hours for trending"],
    a: 0,
    r: "This patient has multiple risk factors for venous thromboembolism (long-haul flight, oral contraceptives, obesity) with a high clinical probability (Wells score likely >4: tachycardia, pleuritic chest pain, hypoxia). The markedly elevated D-dimer (>500 ng/mL) with high pretest probability mandates definitive imaging. CTPA is the gold-standard diagnostic test for PE, offering high sensitivity and specificity with rapid availability. Chest X-ray alone has poor sensitivity for PE. V/Q scan is an alternative but CTPA is preferred in most guidelines as first-line. Repeating D-dimer adds nothing when clinical suspicion is already high and the initial value is markedly elevated.",
    s: "Respiratory"
  },
  {
    q: "A 38-year-old female is diagnosed with a submassive pulmonary embolism on CTPA (right ventricular dilation, no haemodynamic instability). Troponin I is mildly elevated at 0.08 ng/mL. What is the most appropriate initial treatment?",
    o: ["Unfractionated heparin IV infusion with transition to a direct oral anticoagulant, with close monitoring for haemodynamic deterioration", "Systemic thrombolysis with alteplase as first-line treatment", "Inferior vena cava filter placement without anticoagulation", "Rivaroxaban alone without initial heparin bridging"],
    a: 0,
    r: "Submassive PE (RV dysfunction without haemodynamic instability) requires anticoagulation with close monitoring in an ICU or step-down setting. UFH is preferred initially because of its short half-life and reversibility with protamine, allowing rapid dose adjustment if the patient deteriorates. Transition to a DOAC occurs once stable. Systemic thrombolysis is reserved for massive PE with haemodynamic instability (persistent hypotension). IVC filters are indicated only when anticoagulation is contraindicated. While some DOACs (rivaroxaban) can be used without heparin bridging in uncomplicated DVT/PE, submassive PE with RV strain and elevated troponin warrants initial UFH for closer titration.",
    s: "Respiratory"
  },
  {
    q: "A 38-year-old female with submassive PE on anticoagulation improves clinically. Before discharge, the NP discusses the duration of anticoagulation therapy. Her PE was provoked by oral contraceptive use and immobility. Oral contraceptives will be permanently discontinued. What is the recommended duration of anticoagulation?",
    o: ["Three months of anticoagulation, as the PE was provoked by a modifiable and now removed risk factor", "Lifelong anticoagulation regardless of the circumstances", "Six weeks of anticoagulation is sufficient for provoked PE", "One month of anticoagulation followed by aspirin indefinitely"],
    a: 0,
    r: "For VTE provoked by a transient, modifiable risk factor (oral contraceptives now discontinued, immobility from travel), guidelines recommend a minimum of 3 months of anticoagulation. Since the provoking factors have been addressed (OCP stopped, patient counselled on travel precautions), extended anticoagulation beyond 3 months is not routinely recommended as the recurrence risk is low (~3% per year). Lifelong anticoagulation is indicated for unprovoked PE or persistent risk factors. Six weeks is too short. Aspirin is not a substitute for anticoagulation in VTE treatment.",
    s: "Pharmacology"
  },
  {
    q: "A 65-year-old male presents with a 4-week history of progressive bilateral lower extremity oedema, fatigue, and foamy urine. He has a 15-year history of poorly controlled type 2 diabetes (HbA1c 9.2%). Vital signs are stable. Urinalysis shows 4+ protein. Spot urine albumin-to-creatinine ratio is 3,200 mg/g. Serum albumin is 22 g/L. Serum creatinine is 158 µmol/L (eGFR 38). Lipid panel shows total cholesterol 9.8 mmol/L. What is the most likely diagnosis?",
    o: ["Nephrotic syndrome secondary to diabetic nephropathy", "Congestive heart failure exacerbation", "Hepatic cirrhosis with portal hypertension", "Minimal change disease"],
    a: 0,
    r: "The classic nephrotic syndrome tetrad is present: heavy proteinuria (ACR 3,200 mg/g), hypoalbuminaemia (22 g/L), hyperlipidaemia (cholesterol 9.8 mmol/L), and peripheral oedema. In a patient with longstanding poorly controlled diabetes, diabetic nephropathy is the most likely cause. The reduced eGFR confirms advanced chronic kidney disease. CHF causes oedema but not heavy proteinuria or hypoalbuminaemia. Cirrhosis causes hypoalbuminaemia but not massive proteinuria. Minimal change disease is the most common cause in children but would be unusual in a 65-year-old with diabetes without ruling out diabetic nephropathy first.",
    s: "Renal"
  },
  {
    q: "A 65-year-old male with nephrotic syndrome from diabetic nephropathy has an eGFR of 38 and is currently on metformin 1000 mg BID and lisinopril 20 mg daily. The NP is optimizing his management. Which medication change is most important?",
    o: ["Add an SGLT2 inhibitor such as dapagliflozin, which provides renal protection, reduces proteinuria, and slows CKD progression beyond ACE inhibitor therapy alone", "Increase lisinopril to 40 mg daily as the sole renal protective strategy", "Discontinue metformin as it is contraindicated at this eGFR", "Start prednisone for immunosuppression to reduce proteinuria"],
    a: 0,
    r: "SGLT2 inhibitors have demonstrated significant renal protective effects beyond RAAS blockade in the DAPA-CKD and CREDENCE trials. They reduce proteinuria, slow eGFR decline, and reduce the risk of kidney failure even in patients already on ACE inhibitors/ARBs. At eGFR 38, dapagliflozin can be initiated (approved down to eGFR 25) and continued even if eGFR drops further. While optimizing ACEi dosing is important, SGLT2 inhibitor addition provides incremental benefit. Metformin can continue at eGFR 30-45 with monitoring (some guidelines suggest dose reduction). Prednisone is not indicated for diabetic nephropathy.",
    s: "Pharmacology"
  },
  {
    q: "A 65-year-old male with nephrotic syndrome and CKD stage 3b develops sudden-onset left leg swelling, warmth, and erythema. Duplex ultrasound confirms an acute proximal deep vein thrombosis of the left femoral vein. Why is this patient at increased risk for thromboembolism?",
    o: ["Nephrotic syndrome causes urinary loss of antithrombin III and other anticoagulant proteins, creating a hypercoagulable state", "Diabetes directly activates the coagulation cascade through insulin resistance", "CKD stage 3b causes thrombocytosis predisposing to clot formation", "The DVT is unrelated to his nephrotic syndrome and is caused by immobility alone"],
    a: 0,
    r: "Nephrotic syndrome creates a well-documented hypercoagulable state through urinary loss of low-molecular-weight anticoagulant proteins, particularly antithrombin III, protein C, and protein S. Additionally, hepatic compensation for albumin loss leads to increased production of procoagulant factors (fibrinogen, factors V, VII, VIII). The risk of VTE in nephrotic syndrome is 1.5-3% per year, with membranous nephropathy carrying the highest risk. While diabetes and CKD have some prothrombotic associations, the primary mechanism in nephrotic syndrome is specific loss of anticoagulant proteins. The DVT is directly related to the nephrotic state.",
    s: "Renal"
  },
  {
    q: "A 28-year-old female presents with a 6-month history of recurrent painful oral ulcers, fatigue, diffuse joint pain, and a malar rash that worsens with sun exposure. She reports hair loss at the temples. Vital signs are normal. Labs: ANA positive at 1:640, anti-dsDNA positive, complement C3 and C4 both low, WBC 3.2 × 10⁹/L, platelets 118 × 10⁹/L. Urinalysis shows 2+ protein and granular casts. What is the most important additional investigation?",
    o: ["24-hour urine protein or spot urine protein-to-creatinine ratio and renal function tests to assess for lupus nephritis", "Skin biopsy of the malar rash for histological confirmation", "Rheumatoid factor and anti-CCP antibodies to evaluate for rheumatoid arthritis", "CT scan of the chest to evaluate for pulmonary involvement"],
    a: 0,
    r: "This patient meets ACR/EULAR criteria for systemic lupus erythematosus (malar rash, oral ulcers, arthritis, renal involvement, cytopaenias, positive ANA, positive anti-dsDNA, low complement). The proteinuria with granular casts indicates possible lupus nephritis, which is a major determinant of prognosis and treatment. Quantifying proteinuria and assessing renal function is the most critical next step, as lupus nephritis (Class III-V) may require aggressive immunosuppression (mycophenolate or cyclophosphamide). A renal biopsy will likely follow for classification. Skin biopsy confirms cutaneous lupus but does not change management urgency. RF/anti-CCP evaluates RA, a different diagnosis. Chest CT is lower priority than renal assessment.",
    s: "Musculoskeletal"
  },
  {
    q: "A 28-year-old female diagnosed with SLE and lupus nephritis (Class IV on biopsy) is started on mycophenolate mofetil 1 g BID and prednisone 1 mg/kg/day. The NP is counselling her on essential monitoring and precautions. Which counselling point is most critical?",
    o: ["Mycophenolate is teratogenic; she must use reliable contraception and pregnancy must be planned with medication adjustment well in advance", "Mycophenolate commonly causes hair loss and she should expect complete alopecia", "She can discontinue prednisone after 2 weeks if she feels better", "Mycophenolate provides immunity boosting that will help her fight infections"],
    a: 0,
    r: "Mycophenolate mofetil is classified as pregnancy category D/X and is a known teratogen causing congenital malformations (ear, facial, cardiac, renal defects) and pregnancy loss. In a 28-year-old woman of childbearing potential, effective contraception counselling is paramount. If pregnancy is desired, mycophenolate must be switched to a safer alternative (azathioprine) at least 6 weeks before conception. MMF does not cause complete alopecia. Prednisone is tapered slowly in lupus nephritis, not stopped at 2 weeks. MMF is immunosuppressive (not immunity boosting), increasing infection risk.",
    s: "Pharmacology"
  },
  {
    q: "A 44-year-old male presents with episodic severe right-sided headaches lasting 45-90 minutes, occurring 2-3 times daily for the past 3 weeks. During attacks, he has ipsilateral lacrimation, conjunctival injection, nasal congestion, and ptosis. He paces and rocks during episodes. He reports no aura. The episodes wake him at the same time each night. What is the most likely diagnosis?",
    o: ["Cluster headache based on the unilateral location, autonomic features, periodicity, and restlessness during attacks", "Migraine with aura", "Trigeminal neuralgia", "Temporal arteritis"],
    a: 0,
    r: "The presentation is classic cluster headache: severe unilateral periorbital pain lasting 15-180 minutes, occurring in clusters (2-3 times daily for weeks), with ipsilateral cranial autonomic symptoms (lacrimation, conjunctival injection, nasal congestion, ptosis/miosis from Horner syndrome). Restlessness and pacing during attacks (in contrast to migraine patients who prefer stillness) and nocturnal periodicity are characteristic. Migraine typically lasts 4-72 hours, is bilateral in 40%, and has nausea/photophobia. Trigeminal neuralgia causes seconds-long electric shock-like pain. Temporal arteritis affects patients over 50 with elevated inflammatory markers.",
    s: "Neurological"
  },
  {
    q: "A 44-year-old male diagnosed with cluster headache is in the midst of a cluster period. What is the most appropriate acute treatment for individual attacks?",
    o: ["High-flow oxygen at 12-15 L/min via non-rebreather mask for 15-20 minutes and/or subcutaneous sumatriptan 6 mg", "Oral ibuprofen 800 mg as first-line treatment", "IV dihydroergotamine as the only effective therapy", "Oral prednisone 60 mg for each individual attack"],
    a: 0,
    r: "First-line acute treatment for cluster headache is high-flow 100% oxygen at 12-15 L/min via non-rebreather mask (effective in ~78% of patients within 15 minutes) and/or subcutaneous sumatriptan 6 mg (the fastest-acting triptan formulation). Oral analgesics including NSAIDs are too slow-acting for cluster attacks, which peak rapidly and resolve within 90 minutes. IV DHE is effective but not practical for episodic outpatient use. Oral prednisone is used as a transitional preventive agent during cluster periods, not for individual attack abortion. Intranasal sumatriptan or zolmitriptan are alternatives to subcutaneous injection.",
    s: "Neurological"
  },
  {
    q: "A 44-year-old male with cluster headaches asks about preventive treatment to reduce the frequency and duration of his cluster period. He has no history of cardiac disease or asthma. What is the first-line preventive medication for episodic cluster headache?",
    o: ["Verapamil, starting at 240 mg daily in divided doses and titrating up with ECG monitoring for PR prolongation", "Topiramate 100 mg daily", "Amitriptyline 25 mg at bedtime", "Gabapentin 300 mg three times daily"],
    a: 0,
    r: "Verapamil is the first-line preventive agent for episodic and chronic cluster headache, supported by multiple clinical guidelines. It is started at 240 mg daily in divided doses and may be titrated to 480-960 mg daily. ECG monitoring is essential as verapamil can cause significant PR prolongation and heart block at higher doses. Topiramate has some evidence for migraine prevention but not cluster headache. Amitriptyline is effective for tension-type headache and migraine, not cluster headache. Gabapentin lacks evidence for cluster headache prevention. Short-term prednisone bridges can be used while verapamil takes effect.",
    s: "Neurological"
  },
  {
    q: "A 71-year-old female presents with a non-healing ulcer on her right lower leg, present for 8 weeks. The ulcer is shallow, irregularly shaped, located above the medial malleolus, with a moist granular base. She has significant bilateral lower leg oedema, hemosiderin staining, and lipodermatosclerosis. Pedal pulses are palpable bilaterally. ABPI is 0.92. What is the most appropriate treatment?",
    o: ["Compression therapy with graduated compression bandaging or stockings, as this is a venous leg ulcer with adequate arterial supply confirmed by normal ABPI", "Revascularization surgery for peripheral arterial disease", "Debridement and skin grafting as initial treatment", "Oral antibiotics for 6 weeks for presumed chronic wound infection"],
    a: 0,
    r: "This is a classic venous leg ulcer: medial malleolus location, shallow with granular base, associated with venous insufficiency signs (oedema, hemosiderin staining, lipodermatosclerosis). The ABPI of 0.92 (>0.8) confirms adequate arterial supply, making compression therapy safe and effective. Compression is the cornerstone of venous ulcer management, improving venous return and promoting healing. Revascularization is for arterial disease (ABPI <0.5). Skin grafting may be considered for refractory ulcers after adequate compression therapy. Antibiotics are indicated only for clinical signs of infection (increasing pain, erythema, purulent drainage), not routinely.",
    s: "Dermatology"
  },
  {
    q: "A 55-year-old male with well-controlled HIV on antiretroviral therapy (CD4 580, undetectable viral load) and no prior hepatitis vaccination presents for routine care. Hepatitis B serology shows: HBsAg negative, anti-HBs negative, anti-HBc negative. What is the most appropriate next step?",
    o: ["Administer the hepatitis B vaccine series, as the patient is susceptible and at increased risk for HBV due to HIV coinfection", "No vaccination needed since all hepatitis B markers are negative", "Order HBV DNA PCR to rule out occult hepatitis B", "Administer hepatitis A vaccine instead"],
    a: 0,
    r: "All three HBV markers being negative indicates the patient has never been infected with or vaccinated against hepatitis B and is fully susceptible. HIV-positive individuals are at increased risk for HBV coinfection and have poorer outcomes when coinfected. Vaccination is strongly recommended with the standard 3-dose series, with post-vaccination anti-HBs titre checked to confirm seroconversion (response rates are lower in HIV). If the initial series fails, a double-dose or adjuvanted series should be attempted. A negative anti-HBc essentially rules out occult infection. Hepatitis A vaccination is also important but does not address HBV susceptibility.",
    s: "Infectious Disease"
  }
];
