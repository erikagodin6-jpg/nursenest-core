import type { ExamQuestion } from "./types";

export const npExamBatch10Questions: ExamQuestion[] = [
  {
    q: "A 52-year-old male with severe persistent asthma on high-dose ICS/LABA and tiotropium has eosinophil count of 450 cells/mcL and continues to have 3-4 exacerbations per year. What is the next step in management?",
    o: ["Add a biologic agent targeting the eosinophilic pathway (mepolizumab, benralizumab, or dupilumab)", "Add oral corticosteroids daily", "Increase ICS to maximum dose", "Start theophylline"],
    a: 0,
    r: "Severe uncontrolled eosinophilic asthma despite maximal inhaler therapy is an indication for biologic therapy. Anti-IL-5 agents (mepolizumab, benralizumab) or anti-IL-4/13 (dupilumab) target eosinophilic inflammation. Chronic oral corticosteroids have significant adverse effects and should be avoided. ICS is already at high dose. Theophylline adds minimal benefit with significant toxicity risk.",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old male with COPD (GOLD Group E) on LAMA/LABA combination has blood eosinophils of 380 cells/mcL and had 2 exacerbations requiring hospitalization in the past year. What therapy adjustment is recommended?",
    o: ["Escalate to triple therapy (ICS/LAMA/LABA)", "Continue LAMA/LABA without change", "Switch to ICS monotherapy", "Add oral azithromycin prophylaxis"],
    a: 0,
    r: "COPD patients with persistent exacerbations despite LAMA/LABA therapy and blood eosinophils 300 or greater benefit from adding ICS (triple therapy). The IMPACT and ETHOS trials demonstrated reduced exacerbations with triple therapy in this population. ICS monotherapy is never recommended in COPD. Azithromycin prophylaxis is considered only after optimizing inhaler therapy.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old non-smoking female presents with progressive dyspnea on exertion. CT chest shows bilateral ground-glass opacities with a mosaic pattern. Pulmonary function tests show a restrictive pattern with reduced DLCO. Echocardiogram is normal. ANA is positive at 1:640. What is the most likely diagnosis?",
    o: ["Connective tissue disease-associated interstitial lung disease", "Idiopathic pulmonary fibrosis", "Pulmonary alveolar proteinosis", "Chronic hypersensitivity pneumonitis"],
    a: 0,
    r: "A young non-smoking female with high-titer ANA, ground-glass opacities, restrictive PFTs with reduced DLCO, and no cardiac etiology is highly suspicious for CTD-ILD. The high ANA titer suggests an underlying autoimmune condition (SLE, scleroderma, or mixed CTD). IPF typically affects older males who smoke. Pulmonary alveolar proteinosis has a distinct crazy-paving pattern. Chronic HP usually has exposure history.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old male with a 3 cm solitary pulmonary nodule on CT has a PET scan showing SUV of 8.5. He is a current smoker with a 30-pack-year history. What is the recommended next step?",
    o: ["CT-guided biopsy or referral for surgical resection", "Repeat CT in 3 months for interval growth assessment", "Prescribe empiric antibiotics for 2 weeks and repeat imaging", "PET scan in 6 months"],
    a: 0,
    r: "A large (greater than 3 cm), PET-avid (SUV greater than 2.5) pulmonary nodule in a heavy smoker has a very high probability of malignancy. Tissue diagnosis via CT-guided biopsy or surgical resection is indicated. Watchful waiting with serial imaging is inappropriate for high-risk lesions. Empiric antibiotics delay diagnosis. Repeat PET adds no diagnostic value.",
    s: "Respiratory"
  },
  {
    q: "A patient with COPD presents with worsening dyspnea, increased sputum production and purulence, and fever. Current SpO2 is 86% on room air. ABG shows pH 7.32, PaCO2 55 mmHg, PaO2 52 mmHg. What is the priority intervention?",
    o: ["Start controlled supplemental oxygen targeting SpO2 88-92%, administer systemic corticosteroids and antibiotics", "Apply high-flow oxygen at 15 L/min via non-rebreather mask", "Intubate and initiate mechanical ventilation", "Prescribe oral prednisone and azithromycin for outpatient management"],
    a: 0,
    r: "Acute COPD exacerbation with respiratory acidosis and hypoxemia requires controlled oxygen therapy (target 88-92% to avoid suppressing hypoxic respiratory drive), systemic corticosteroids (prednisone 40 mg for 5 days), and antibiotics (if increased sputum purulence suggests infection). High-flow oxygen can worsen CO2 retention in COPD patients. Intubation is premature if NIV is available. Outpatient management is inappropriate given the severity.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old female with multiple sclerosis on interferon beta-1a presents with new onset right-sided weakness and vision changes. MRI shows 3 new T2 lesions and 2 gadolinium-enhancing lesions compared to 6 months ago. What should the NP recommend?",
    o: ["Discuss escalation to higher-efficacy disease-modifying therapy such as natalizumab, ocrelizumab, or fingolimod", "Continue current interferon therapy and repeat MRI in 1 year", "Start IV methylprednisolone for acute treatment only", "Add gabapentin for symptom management"],
    a: 0,
    r: "New clinical symptoms with new MRI lesions indicate breakthrough disease activity despite current therapy. Evidence supports escalating to higher-efficacy DMTs when breakthrough activity occurs on platform therapies. IV methylprednisolone treats acute relapses but does not modify disease course. Simply continuing current therapy ignores treatment failure. Symptomatic management alone does not address disease progression.",
    s: "Neurology"
  },
  {
    q: "A 60-year-old male with a 2-year history of tremor, bradykinesia, and rigidity responds well to carbidopa-levodopa. His wife reports he acts out his dreams violently during sleep. What does this additional symptom suggest?",
    o: ["REM sleep behavior disorder, a non-motor feature of Parkinson disease that may precede or accompany motor symptoms", "Medication-induced psychosis requiring antipsychotic therapy", "Obstructive sleep apnea", "Restless leg syndrome requiring dopamine agonist addition"],
    a: 0,
    r: "REM sleep behavior disorder (RBD) is a recognized non-motor feature of Parkinson disease and other synucleinopathies. RBD involves loss of normal REM atonia leading to dream enactment behaviors. It may precede motor PD symptoms by years. Safety measures (padding bed, removing sharp objects) and clonazepam or melatonin are management options. This is not psychosis, OSA, or RLS.",
    s: "Neurology"
  },
  {
    q: "A 25-year-old female presents with a severe unilateral headache with pulsating quality, nausea, photophobia, and disability lasting 12 hours. She has these headaches 3-4 times monthly. She has never tried preventive therapy. What is the appropriate acute and preventive treatment plan?",
    o: ["Acute: triptan (sumatriptan) with NSAID; Preventive: propranolol or topiramate given frequency exceeds 4 headache days per month", "Acute: acetaminophen only; Preventive: none needed", "Acute: opioid analgesic; Preventive: daily triptan", "Acute: ergotamine; Preventive: verapamil"],
    a: 0,
    r: "Episodic migraine with 3-4 attacks monthly meets the threshold for preventive therapy (generally 4 or more headache days/month or significant disability). Triptans are first-line abortive therapy for moderate-severe migraine. Propranolol and topiramate are evidence-based first-line preventive agents. Opioids should be avoided for migraine. Daily triptans risk medication overuse headache. Verapamil is for cluster headache prevention.",
    s: "Neurology"
  },
  {
    q: "A 78-year-old male presents with sudden onset vertigo, nausea, and gait ataxia. He cannot walk without assistance. HINTS exam shows direction-changing nystagmus and a normal head impulse test. What is the most likely diagnosis and appropriate action?",
    o: ["Central vertigo (likely posterior circulation stroke); emergent neuroimaging and neurology consultation", "Benign paroxysmal positional vertigo; perform Epley maneuver", "Vestibular neuritis; prescribe meclizine and follow up in 1 week", "Meniere disease; restrict sodium and prescribe a diuretic"],
    a: 0,
    r: "HINTS exam findings of direction-changing nystagmus and normal head impulse test are concerning for central vertigo (posterior circulation stroke). These are the opposite of peripheral findings (unidirectional nystagmus, abnormal head impulse test). In an elderly patient with vascular risk factors, emergent neuroimaging is critical. BPPV has positional nystagmus. Vestibular neuritis has a positive head impulse test.",
    s: "Neurology"
  },
  {
    q: "A 30-year-old female on valproic acid 1000 mg daily for epilepsy expresses a desire to become pregnant. Her seizures have been well-controlled for 3 years. What preconception counseling should the NP provide?",
    o: ["Discuss transitioning to a safer AED (lamotrigine or levetiracetam), start high-dose folic acid 4 mg daily, and refer to a maternal-fetal medicine specialist", "Continue valproic acid as changing medications during pregnancy planning is risky", "Discontinue all AEDs before conception", "Switch to phenytoin for pregnancy safety"],
    a: 0,
    r: "Valproic acid is the most teratogenic AED (neural tube defects 1-2%, neurodevelopmental effects). Preconception transition to a safer alternative (lamotrigine or levetiracetam) with close seizure monitoring is standard of care. High-dose folic acid (4-5 mg) reduces neural tube defect risk. Abrupt AED discontinuation risks status epilepticus. Phenytoin also carries teratogenic risk (fetal hydantoin syndrome).",
    s: "Neurology"
  }
];
