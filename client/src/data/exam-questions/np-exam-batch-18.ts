import type { ExamQuestion } from "./types";

export const npExamBatch18Questions: ExamQuestion[] = [
  {
    q: "A 60-year-old male with CKD stage 5 (eGFR 12) presents for discussion of renal replacement therapy. He has adequate vascular access. His albumin is 2.8 g/dL and he has persistent volume overload despite maximum diuretic therapy. When should hemodialysis be initiated?",
    o: ["Initiate hemodialysis based on signs and symptoms of uremia, refractory volume overload, and declining nutritional status rather than a specific GFR threshold", "Wait until eGFR falls below 5", "Start only when potassium exceeds 6.5 mEq/L", "Delay until emergent indication develops"],
    a: 0,
    r: "Current guidelines recommend initiating dialysis based on clinical indications (uremic symptoms, refractory fluid overload, malnutrition, uncontrollable electrolyte abnormalities) rather than a specific GFR threshold. This patient has refractory volume overload and declining albumin, indicating the need for dialysis initiation. Waiting for emergent indications (severe hyperkalemia, pulmonary edema, pericarditis) increases morbidity and mortality.",
    s: "Renal"
  },
  {
    q: "A 45-year-old female with lupus nephritis confirmed by renal biopsy (Class IV diffuse proliferative) has active urinary sediment and proteinuria of 4.2 g/day. Creatinine is 1.6 mg/dL. What is the recommended induction therapy?",
    o: ["Mycophenolate mofetil (MMF) or IV cyclophosphamide in combination with corticosteroids", "Hydroxychloroquine alone", "High-dose oral prednisone as monotherapy", "Azathioprine for induction"],
    a: 0,
    r: "Class IV lupus nephritis (diffuse proliferative, the most severe and common form) requires aggressive immunosuppressive induction therapy. First-line options are MMF or IV cyclophosphamide combined with corticosteroids. MMF has comparable efficacy with fewer gonadal toxicity concerns. Hydroxychloroquine is a foundation of SLE treatment but insufficient alone for nephritis. Corticosteroid monotherapy is inadequate. Azathioprine is used for maintenance, not induction.",
    s: "Renal"
  },
  {
    q: "A 55-year-old male with ADPKD (autosomal dominant polycystic kidney disease) has an eGFR of 55 and total kidney volume of 1,500 mL. He has hypertension controlled on an ACE inhibitor. What additional therapy should the NP discuss?",
    o: ["Tolvaptan (vasopressin V2 receptor antagonist) to slow cyst growth and eGFR decline, with mandatory hepatic monitoring", "Increased fluid intake to 4 liters daily without pharmacotherapy", "Initiate dialysis preparation", "Add a second antihypertensive without specific ADPKD therapy"],
    a: 0,
    r: "Tolvaptan is FDA-approved for ADPKD to slow kidney growth and GFR decline in patients at risk of rapid progression (total kidney volume greater than 750 mL, eGFR 25-65). It inhibits cAMP-mediated cyst growth. Mandatory hepatic function monitoring is required due to hepatotoxicity risk. High fluid intake alone is insufficient to alter disease course. Dialysis is premature at eGFR 55. BP control is important but does not specifically address cyst growth.",
    s: "Renal"
  },
  {
    q: "A 55-year-old male with a CD4 count of 450 and viral load of 45,000 copies/mL is newly diagnosed with HIV. He has no opportunistic infections and hepatitis B surface antigen is positive. What is the recommended initial antiretroviral regimen?",
    o: ["Tenofovir/emtricitabine (TDF/FTC) backbone plus an integrase inhibitor (dolutegravir or bictegravir); TDF/FTC also treats hepatitis B", "Abacavir/lamivudine plus efavirenz", "Zidovudine/lamivudine plus ritonavir-boosted lopinavir", "Defer treatment until CD4 falls below 350"],
    a: 0,
    r: "Current guidelines recommend immediate ART initiation for all patients with HIV regardless of CD4 count. In HIV/HBV coinfection, the regimen must include tenofovir (TDF or TAF) and emtricitabine (or lamivudine) as the NRTI backbone because both have HBV activity. Discontinuing these agents risks HBV flare. Integrase inhibitors (dolutegravir, bictegravir) are preferred third agents due to high efficacy, tolerability, and high barrier to resistance.",
    s: "Infectious Disease"
  },
  {
    q: "A 28-year-old female presents with a 3-day history of painful genital ulcers and inguinal lymphadenopathy. She is sexually active with a new partner. Tzanck smear shows multinucleated giant cells. HSV-2 PCR is positive. What is the recommended treatment?",
    o: ["Valacyclovir 1 g twice daily for 7-10 days for initial genital herpes outbreak", "Acyclovir 400 mg three times daily for 3 days", "Topical acyclovir cream only", "Single dose of azithromycin 1 g"],
    a: 0,
    r: "Initial genital herpes outbreak is treated with antiviral therapy for 7-10 days (valacyclovir 1 g BID, or acyclovir 400 mg TID, or famciclovir 250 mg TID). The initial episode is longer and more severe than recurrences. Three days is the duration for episodic treatment of recurrences, not initial episodes. Topical acyclovir has minimal efficacy for genital herpes. Azithromycin treats chlamydia, not herpes.",
    s: "Infectious Disease"
  },
  {
    q: "A 72-year-old male develops fever, productive cough, and confusion 4 days after hospital admission. Chest X-ray shows new right lower lobe infiltrate. Gram stain of sputum shows gram-negative rods. What is the most appropriate empiric antibiotic regimen?",
    o: ["Anti-pseudomonal beta-lactam (piperacillin-tazobactam or cefepime) plus vancomycin (for MRSA coverage) pending cultures", "Amoxicillin-clavulanate alone", "Azithromycin monotherapy", "Oral levofloxacin and outpatient management"],
    a: 0,
    r: "Hospital-acquired pneumonia (onset 48+ hours after admission) requires empiric coverage for both MRSA and gram-negative organisms including Pseudomonas. Piperacillin-tazobactam or cefepime provides gram-negative coverage, and vancomycin or linezolid covers MRSA. Narrow-spectrum agents are insufficient. Outpatient management is inappropriate for HAP. Monotherapy misses likely pathogens.",
    s: "Infectious Disease"
  },
  {
    q: "A 35-year-old immunocompetent male presents with a painless, non-pruritic skin lesion on his hand that progressed from a papule to a vesicle to a black eschar over 5 days. He works at a livestock farm. What is the most likely diagnosis and treatment?",
    o: ["Cutaneous anthrax; ciprofloxacin 500 mg twice daily for 7-10 days", "Brown recluse spider bite; supportive care", "Orf virus infection; observation", "Tularemia; gentamicin"],
    a: 0,
    r: "A painless papule progressing to a black eschar (malignant pustule) in a livestock worker is classic for cutaneous anthrax (Bacillus anthracis). Cutaneous anthrax has a characteristic painless eschar with surrounding edema. First-line treatment is ciprofloxacin or doxycycline for 7-10 days. It is reportable to public health authorities. Brown recluse bites are painful. Orf causes nodules without eschar. Tularemia presents differently.",
    s: "Infectious Disease"
  },
  {
    q: "A 40-year-old female returning from Southeast Asia presents with cyclical fevers every 48 hours, rigors, and splenomegaly. Peripheral blood smear shows ring-form trophozoites within red blood cells. What is the most important initial management step?",
    o: ["Identify the Plasmodium species and determine severity; if P. falciparum or severe, initiate IV artesunate", "Start oral chloroquine regardless of species", "Prescribe doxycycline prophylaxis", "Observe and repeat blood smear in 48 hours"],
    a: 0,
    r: "Malaria diagnosis on peripheral smear requires species identification because P. falciparum can cause severe or cerebral malaria with high mortality. Severe falciparum malaria requires IV artesunate (superior to IV quinine). Chloroquine resistance is widespread in P. falciparum from Southeast Asia. Doxycycline is prophylactic, not therapeutic. Observation without treatment risks rapid deterioration.",
    s: "Infectious Disease"
  },
  {
    q: "A 35-year-old G3P2 at 34 weeks gestation presents with blood pressure of 168/108 mmHg, 3+ proteinuria, and platelet count of 88,000/mm3. AST is 245 U/L. She reports epigastric pain. What is the diagnosis and management?",
    o: ["Preeclampsia with severe features (HELLP syndrome); initiate magnesium sulfate, antihypertensive therapy, and plan for delivery", "Gestational hypertension; monitor blood pressure weekly", "Chronic hypertension; adjust oral medications and continue pregnancy", "Acute fatty liver of pregnancy; transfer to liver transplant center"],
    a: 0,
    r: "Severe preeclampsia complicated by HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) is a life-threatening obstetric emergency. Management includes magnesium sulfate for seizure prophylaxis, IV labetalol or hydralazine for severe hypertension, and delivery (the definitive treatment). At 34 weeks with severe features, delivery should not be delayed. Corticosteroids for fetal lung maturity may be given if delivery can be safely delayed 48 hours.",
    s: "Women's Health"
  },
  {
    q: "A 30-year-old female with hypothyroidism on levothyroxine discovers she is 6 weeks pregnant. Her pre-pregnancy TSH was 1.8 mIU/L. What thyroid management is recommended during pregnancy?",
    o: ["Increase levothyroxine dose by 25-30% immediately and check TSH every 4 weeks during the first half of pregnancy, targeting TSH below 2.5 mIU/L", "Continue current dose and check TSH at delivery", "Decrease levothyroxine dose as pregnancy increases thyroid hormone binding", "Switch to methimazole for pregnancy"],
    a: 0,
    r: "Thyroid hormone requirements increase by 25-50% during pregnancy due to increased TBG, expanded plasma volume, and placental deiodinase activity. Early dose increase (as soon as pregnancy is confirmed) prevents maternal hypothyroidism that can impair fetal neurodevelopment. TSH should be monitored every 4 weeks and maintained below 2.5 mIU/L in the first trimester. Methimazole is for hyperthyroidism.",
    s: "Women's Health"
  }
];
