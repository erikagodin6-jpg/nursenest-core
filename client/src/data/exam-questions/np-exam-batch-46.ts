import type { ExamQuestion } from "./types";

export const npExamBatch46Questions: ExamQuestion[] = [
  {
    q: "A 50-year-old male presents with acute onset of a cold, pale, painful right leg. Femoral pulse is absent on the right. He has atrial fibrillation and is not anticoagulated. What is the diagnosis and emergent management?",
    o: ["Acute limb ischemia from arterial embolism; emergent vascular surgery consultation for thromboembolectomy or catheter-directed thrombolysis; initiate heparin anticoagulation", "Deep vein thrombosis; start DOAC", "Chronic peripheral arterial disease; lifestyle modifications", "Musculoskeletal injury; orthopedic evaluation"],
    a: 0,
    r: "The 6 Ps of acute limb ischemia: Pain, Pallor, Pulselessness, Poikilothermia (cool), Paresthesia, and Paralysis (late finding indicating tissue death). In a patient with atrial fibrillation not on anticoagulation, cardioembolic source is most likely. This is a surgical emergency requiring intervention within 6 hours to prevent irreversible tissue loss. Treatment: immediate heparin anticoagulation, emergent surgical embolectomy (Fogarty catheter), or catheter-directed thrombolysis for viable limbs. Rutherford classification guides urgency.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female with known hypertrophic obstructive cardiomyopathy presents with exertional dyspnea and LVOT gradient of 60 mmHg at rest. She is on metoprolol 100 mg BID and disopyramide. What interventional options exist for refractory obstruction?",
    o: ["Septal myectomy (surgical) or alcohol septal ablation (catheter-based) for patients with refractory symptoms despite optimal medical therapy", "Aortic valve replacement", "Mitral valve repair", "Cardiac transplant as first-line"],
    a: 0,
    r: "HOCM with LVOT gradient greater than 50 mmHg and NYHA III-IV symptoms despite medical therapy (beta-blockers, disopyramide, verapamil) qualifies for septal reduction therapy. Surgical myectomy (Morrow procedure) is the gold standard with greater than 90% success and low mortality at experienced centers. Alcohol septal ablation is a catheter-based alternative (ethanol injection into a septal perforator artery, creating a controlled infarction) for patients who are not surgical candidates or prefer a less invasive approach. Both reduce the LVOT gradient and improve symptoms.",
    s: "Cardiovascular"
  },
  {
    q: "A 30-year-old female with no cardiac history presents with chest pain after a major emotional stressor. ECG shows anterior ST elevation. Troponin is mildly elevated. Emergent coronary angiography shows no obstructive coronary disease. Ventriculography reveals apical ballooning with basal hyperkinesis. What is the diagnosis?",
    o: ["Takotsubo cardiomyopathy (stress-induced cardiomyopathy or broken heart syndrome)", "Acute anterior STEMI", "Myocarditis", "Prinzmetal angina"],
    a: 0,
    r: "Takotsubo (stress) cardiomyopathy is characterized by transient LV systolic dysfunction with apical ballooning and basal hyperkinesis, mimicking ACS (ST elevation, troponin elevation) but without obstructive coronary disease. It is triggered by physical or emotional stress and predominantly affects postmenopausal women (90%). The catecholamine surge mechanism causes direct myocardial stunning. LVEF typically recovers within 1-4 weeks. Complications include heart failure, cardiogenic shock (rare), and LV thrombus. Supportive care and short-term HF management are the mainstay of treatment.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old female with type 1 diabetes and microalbuminuria (UACR 120 mg/g) but normal blood pressure asks about nephroprotective therapy. eGFR is 85. What should the NP recommend?",
    o: ["ACE inhibitor or ARB therapy regardless of blood pressure, as they provide renoprotection by reducing intraglomerular pressure and proteinuria", "No treatment until blood pressure becomes elevated", "SGLT2 inhibitor alone without RAAS blockade", "Dietary protein restriction as sole intervention"],
    a: 0,
    r: "ACE inhibitors and ARBs are recommended for all patients with diabetes and albuminuria (UACR greater than 30 mg/g) regardless of blood pressure. They provide renoprotection by reducing intraglomerular pressure (dilating efferent arterioles) and decreasing proteinuria. The IRMA-2 and IDNT trials demonstrated ARB benefit in diabetic nephropathy. Additionally, SGLT2 inhibitors now show additive renoprotection. The combination of RAAS blockade plus SGLT2 inhibitor represents the current standard for diabetic kidney disease management.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old male with type 2 diabetes asks about the cardiovascular safety of his diabetes medications. He is on metformin, glipizide, and pioglitazone. Which of these medications has a potential cardiovascular concern?",
    o: ["Pioglitazone increases risk of heart failure exacerbation through fluid retention (contraindicated in NYHA III-IV); it paradoxically reduces MACE events", "Metformin increases cardiovascular risk", "Glipizide is the safest cardiovascular option", "All three medications have identical cardiovascular profiles"],
    a: 0,
    r: "Pioglitazone (thiazolidinedione) has a dual cardiovascular profile: it INCREASES heart failure risk through PPAR-gamma-mediated sodium and fluid retention (contraindicated in NYHA III-IV HF) but paradoxically REDUCES atherosclerotic cardiovascular events (PROactive trial showed 16% reduction in composite CV endpoint). Metformin has established CV safety and modest benefit. Sulfonylureas have debated CV safety (CAROLINA trial showed non-inferiority of glimepiride vs DPP4i, but older agents like glyburide have concerns). Understanding medication-specific CV profiles is essential for individualized prescribing.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male presents with sudden onset of excruciating headache, visual field deficits, and ophthalmoplegia. MRI shows a hemorrhagic pituitary mass. Cortisol is critically low at 1.2 mcg/dL. What is the diagnosis and immediate management?",
    o: ["Pituitary apoplexy; immediate IV hydrocortisone 100 mg bolus, fluid resuscitation, urgent neurosurgical consultation for possible transphenoidal decompression", "Subarachnoid hemorrhage; clip or coil aneurysm", "Migraine with aura; sumatriptan", "Meningitis; empiric antibiotics"],
    a: 0,
    r: "Pituitary apoplexy is hemorrhage or infarction of a pituitary adenoma causing sudden expansion, compressing adjacent structures (optic chiasm causing visual field deficits, cavernous sinus causing cranial nerve palsies III/IV/VI). Life-threatening adrenal crisis can occur from acute ACTH deficiency. Immediate management: 1) IV stress-dose hydrocortisone (100 mg bolus, then 50 mg Q8h), 2) Fluid resuscitation, 3) Urgent neurosurgical evaluation for decompression (indicated for progressive visual loss or decreased consciousness). Do NOT delay corticosteroid replacement for confirmatory testing.",
    s: "Endocrine"
  },
  {
    q: "A 65-year-old male with COPD on home oxygen presents with increasing dyspnea, purulent sputum, and oxygen requirement increase from 2 to 4 L/min. His baseline FEV1 is 35% predicted. CXR shows no pneumonia. What is the classification and management of this event?",
    o: ["Moderate COPD exacerbation (increased dyspnea, sputum purulence, and increased O2 requirement without hospitalization criteria); treat with short-course systemic corticosteroids and antibiotics", "Mild exacerbation; increase rescue inhaler only", "Severe exacerbation; intubate immediately", "Stable COPD; no treatment change needed"],
    a: 0,
    r: "GOLD classification of COPD exacerbations: Mild (managed with short-acting bronchodilators alone), Moderate (requires short-acting bronchodilators PLUS antibiotics and/or oral corticosteroids), Severe (requires ED visit or hospitalization). This patient has a moderate exacerbation. Management: 1) Systemic corticosteroids (prednisone 40 mg for 5 days per REDUCE trial), 2) Antibiotics (amoxicillin-clavulanate, azithromycin, or doxycycline for purulent sputum -- Anthonisen criteria), 3) Increase short-acting bronchodilator frequency, 4) Supplemental O2 to target SpO2 88-92%.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male smoker presents with hemoptysis and weight loss. CT chest shows a central hilar mass with mediastinal lymphadenopathy. Bronchoscopy with biopsy reveals small cell lung cancer. PET scan and brain MRI show no distant metastases. What is the staging and treatment?",
    o: ["Limited-stage SCLC (confined to one hemithorax and regional lymph nodes); concurrent chemoradiation with cisplatin-etoposide plus prophylactic cranial irradiation if response is achieved", "Surgery followed by adjuvant chemotherapy", "Radiation alone without chemotherapy", "Immunotherapy alone as first-line"],
    a: 0,
    r: "SCLC is staged as limited (LS-SCLC, confined to one hemithorax and regional lymph nodes, approximately 30% of cases) or extensive (ES-SCLC). Limited-stage treatment: concurrent chemoradiation (cisplatin-etoposide plus thoracic radiation) is potentially curative, with 20-25% 5-year survival. Prophylactic cranial irradiation (PCI) reduces brain metastasis risk and improves survival after complete or partial response. Surgery has a limited role in SCLC (only very early-stage T1-2N0). SCLC is highly chemo- and radiosensitive initially but has high recurrence rates.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old female with history of DVT and PE 6 months ago on rivaroxaban presents for discussion about anticoagulation duration. Her DVT was provoked by oral contraceptive use, which has been discontinued. She has no thrombophilia. What is the recommended duration?",
    o: ["Complete 3-6 months of anticoagulation then discontinue, as her VTE was provoked by a reversible risk factor (OCP); the recurrence risk after stopping is low", "Lifelong anticoagulation is required for any PE", "6 weeks is sufficient for provoked VTE", "Continue indefinitely regardless of risk factors"],
    a: 0,
    r: "VTE provoked by a major transient risk factor (surgery, trauma, OCP use, immobilization) has a low annual recurrence risk (less than 3%) after the provoking factor is removed. Guidelines recommend 3-6 months of anticoagulation for provoked VTE followed by discontinuation. In contrast, unprovoked VTE has a high recurrence risk (7-10% annually) and often warrants extended/indefinite anticoagulation. Cancer-associated VTE requires anticoagulation as long as the cancer is active. The decision for extended therapy uses individualized risk-benefit assessment considering bleeding risk, patient preference, and risk factors.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old male with trigeminal neuralgia presents with severe lancinating facial pain in the V2/V3 distribution triggered by chewing, talking, and light touch to the right cheek. Episodes last seconds to minutes. What is the first-line pharmacological treatment?",
    o: ["Carbamazepine (or oxcarbazepine) as the only medication with strong evidence for trigeminal neuralgia", "Gabapentin as first-line", "Opioid analgesics for severe pain", "Ibuprofen for anti-inflammatory effect"],
    a: 0,
    r: "Carbamazepine is the first-line and most studied medication for trigeminal neuralgia (TN), with an NNT of 1.7-1.8. It stabilizes voltage-gated sodium channels, reducing ectopic nerve firing. Start at 100 mg BID and titrate to effect (usual range 400-1200 mg/day). Oxcarbazepine is an alternative with fewer drug interactions. Monitor CBC (aplastic anemia risk) and liver function. If medical therapy fails, interventional options include microvascular decompression (MVD, most effective long-term solution), percutaneous procedures (radiofrequency ablation, glycerol injection), or stereotactic radiosurgery (Gamma Knife).",
    s: "Neurology"
  }
];
