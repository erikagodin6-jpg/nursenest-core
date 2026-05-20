import type { ExamQuestion } from "./types";

export const npExamBatch48Questions: ExamQuestion[] = [
  {
    q: "A 75-year-old male presents with progressive difficulty initiating urination, weak stream, nocturia 4 times per night, and post-void residual of 150 mL. PSA is 2.8 ng/mL. What is the most likely diagnosis and initial management?",
    o: ["Benign prostatic hyperplasia (BPH); alpha-blocker (tamsulosin) for rapid symptom relief and/or 5-alpha reductase inhibitor (finasteride) for prostate size reduction in large glands", "Prostate cancer requiring immediate biopsy", "Urinary tract infection; empiric antibiotics", "Neurogenic bladder; intermittent catheterization"],
    a: 0,
    r: "Lower urinary tract symptoms (LUTS) with obstructive pattern (hesitancy, weak stream, incomplete emptying) and irritative symptoms (frequency, nocturia) with elevated post-void residual and normal PSA is classic for BPH. Medical management: 1) Alpha-1 blockers (tamsulosin, silodosin) relax prostatic smooth muscle for rapid symptom relief (days), 2) 5-alpha reductase inhibitors (finasteride, dutasteride) reduce prostate size by 25% over 6-12 months (best for prostates greater than 40g), 3) Combination therapy (COMBAT trial showed superiority for large prostates). AUA Symptom Score (IPSS) guides management decisions.",
    s: "Geriatrics"
  },
  {
    q: "A 65-year-old male with hypertension, diabetes, and LDL of 110 mg/dL on atorvastatin 40 mg daily asks about further LDL reduction. His 10-year ASCVD risk is 22%. What is the LDL goal for this high-risk patient?",
    o: ["LDL less than 70 mg/dL for high-risk patients (10-year ASCVD risk greater than or equal to 20% or diabetes with multiple risk factors); consider adding ezetimibe or PCSK9 inhibitor", "LDL less than 130 mg/dL is adequate", "LDL less than 100 mg/dL is the universal goal", "No specific LDL target; just maximize statin dose"],
    a: 0,
    r: "ACC/AHA 2018 guidelines emphasize statin intensity, but also recognize LDL thresholds for adding non-statin therapy. For very high-risk patients (ASCVD with multiple risk factors, or diabetes with multiple high-risk features), LDL less than 70 mg/dL is the recommended threshold. If on maximally tolerated statin and LDL remains above 70, add ezetimibe (reduces LDL by additional 15-20%). If still above 70, add a PCSK9 inhibitor (evolocumab or alirocumab, reduce LDL by additional 50-60%). The IMPROVE-IT and FOURIER trials demonstrated clinical benefit from these LDL reductions.",
    s: "Preventive Medicine"
  },
  {
    q: "A 20-year-old college student presents for a routine visit. She has completed her childhood immunization series. She has never received the HPV vaccine. Is she still eligible?",
    o: ["Yes; HPV vaccination is recommended through age 26 for those not previously vaccinated; shared clinical decision-making for ages 27-45", "HPV vaccine is only effective if given before age 12", "She is too old for HPV vaccination", "HPV vaccine is only for females under 18"],
    a: 0,
    r: "ACIP recommends HPV vaccination for all individuals through age 26 who were not adequately vaccinated earlier. The 9-valent HPV vaccine (Gardasil 9) protects against 9 HPV types responsible for 90% of cervical cancers, 90% of genital warts, and multiple other HPV-related cancers. For ages 15-26: 3-dose series (0, 1-2, 6 months). Ages 9-14: 2-dose series (0, 6-12 months). Ages 27-45: shared clinical decision-making (benefit decreases with age due to prior exposure, but uninfected individuals still benefit). HPV vaccination is gender-neutral -- recommended for males and females equally.",
    s: "Preventive Medicine"
  },
  {
    q: "A 35-year-old male returns from a hiking trip in the Ohio River Valley with fever, cough, and bilateral hilar lymphadenopathy on CXR. He is immunocompetent. Urine Histoplasma antigen is positive. What is the management?",
    o: ["Mild-moderate acute pulmonary histoplasmosis in an immunocompetent host is typically self-limited; monitor with supportive care; itraconazole for symptoms lasting longer than 4 weeks or moderate-severe disease", "IV amphotericin B immediately for all cases", "Fluconazole for 6 months", "No treatment or monitoring needed"],
    a: 0,
    r: "Histoplasmosis (Histoplasma capsulatum, endemic to Ohio and Mississippi River valleys) causes acute pulmonary infection after inhaling microconidia from soil contaminated with bat or bird droppings. Mild disease in immunocompetent patients is usually self-limited (resolves in 2-4 weeks). Treatment indications: symptoms lasting greater than 4 weeks, moderate-severe disease (hypoxia, extensive infiltrates), disseminated disease, or immunocompromised hosts. Mild-moderate: itraconazole 200 mg TID for 3 days then BID for 6-12 weeks. Severe/disseminated: IV amphotericin B followed by step-down to itraconazole.",
    s: "Infectious Disease"
  },
  {
    q: "A 40-year-old female healthcare worker has a positive tuberculin skin test (15 mm induration) after a known exposure to a patient with active TB. CXR is normal. She has no symptoms. QuantiFERON Gold is also positive. What is the recommended treatment for latent TB infection?",
    o: ["Isoniazid plus rifapentine (3HP regimen) once weekly for 12 weeks, or isoniazid daily for 9 months, or rifampin daily for 4 months", "Four-drug RIPE therapy for 6 months", "No treatment needed for LTBI in healthy adults", "Observation with annual CXR only"],
    a: 0,
    r: "Latent TB infection (LTBI) treatment prevents progression to active TB (5-10% lifetime risk without treatment). CDC-recommended LTBI regimens: 1) 3HP (isoniazid + rifapentine once weekly for 12 doses/12 weeks) -- preferred for adherence, 2) 4R (rifampin daily for 4 months) -- good alternative, 3) 9H (isoniazid daily for 9 months) -- traditional regimen. Treatment is indicated for healthcare workers with documented conversion, contacts of active TB cases, immunosuppressed individuals, and others at high risk. Four-drug RIPE therapy is for ACTIVE TB only. Monitor hepatic function during treatment.",
    s: "Infectious Disease"
  },
  {
    q: "A 30-year-old male presents with fever, maculopapular rash starting on the wrists and ankles spreading centrally, headache, and myalgias. He went camping in North Carolina 1 week ago and recalls a tick bite. What is the most likely diagnosis and treatment?",
    o: ["Rocky Mountain spotted fever (RMSF); doxycycline 100 mg BID immediately -- do not wait for confirmatory testing as delay increases mortality", "Lyme disease; amoxicillin for 21 days", "Ehrlichiosis; observation only", "Contact dermatitis from poison ivy; topical steroids"],
    a: 0,
    r: "RMSF (Rickettsia rickettsii, transmitted by Dermacentor ticks) presents with the classic triad of fever, headache, and rash (centripetal spread from ankles/wrists to trunk, appearing days 3-5). Mortality is 20-25% without treatment and can increase to 50-70% if treatment is delayed beyond day 5. Doxycycline is the treatment of choice for ALL ages (including children -- the risk of tooth staining is far outweighed by mortality risk). Treatment should be initiated empirically based on clinical suspicion -- do NOT wait for serology confirmation. RMSF is a medical emergency.",
    s: "Infectious Disease"
  }
];
