import type { ExamQuestion } from "./types";

export const npExamBatch36Questions: ExamQuestion[] = [
  {
    q: "A 60-year-old male with COPD and FEV1 55% predicted has had 2 exacerbations in the past year. He is currently on a LAMA (tiotropium) alone. Blood eosinophil count is 350 cells/mcL. What medication change is recommended?",
    o: ["Step up to triple therapy (ICS/LABA/LAMA) given the elevated eosinophils and exacerbation history", "Add a short-acting beta-agonist only", "Start oral corticosteroids daily", "Switch to ICS monotherapy"],
    a: 0,
    r: "GOLD 2024 guidelines recommend ICS addition when blood eosinophils are 300 or greater cells/mcL and the patient has frequent exacerbations (2 or more/year). Triple therapy (ICS/LABA/LAMA) has demonstrated reduction in exacerbations and mortality (IMPACT and ETHOS trials). The eosinophil count is the key biomarker guiding ICS use in COPD -- below 100 cells/mcL, ICS is unlikely to benefit and may increase pneumonia risk. ICS monotherapy is never appropriate in COPD.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old female presents with progressive dyspnea and dry cough. CT chest shows bilateral ground-glass opacities with a mosaic attenuation pattern. She has pet birds at home. Serum precipitins to avian antigens are positive. What is the diagnosis?",
    o: ["Chronic hypersensitivity pneumonitis (bird fancier lung); antigen avoidance is the primary treatment", "Idiopathic pulmonary fibrosis; start nintedanib", "Sarcoidosis; start prednisone", "Lung adenocarcinoma; refer for biopsy"],
    a: 0,
    r: "Hypersensitivity pneumonitis from avian antigen exposure (bird fancier lung/pigeon breeder disease) presents with insidious dyspnea and cough in chronic form. CT findings include mosaic attenuation (air trapping), ground-glass opacities, and fibrosis in chronic disease. Serum precipitins (IgG antibodies to avian proteins) support the diagnosis. Primary treatment is complete antigen avoidance, which can halt or reverse early disease. Chronic fibrotic HP may require corticosteroids and has a prognosis similar to IPF if exposure continues.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male presents with massive hemoptysis (estimated 300 mL in 2 hours). He is hemodynamically stable with SpO2 92% on room air. CXR shows a right upper lobe cavitary lesion. What is the priority management?",
    o: ["Position the patient with the bleeding lung (right) dependent, ensure airway protection, emergent interventional radiology for bronchial artery embolization", "Position left side down to prevent aspiration into healthy lung", "Administer oral tranexamic acid and discharge", "Schedule outpatient bronchoscopy in 2 weeks"],
    a: 0,
    r: "Massive hemoptysis (greater than 300-600 mL/24 hours or any amount causing hemodynamic instability or gas exchange impairment) is a life-threatening emergency. Priority: 1) Position with bleeding lung dependent (right side down) to protect the unaffected lung from blood aspiration, 2) Ensure large-bore IV access and crossmatch, 3) Bronchial artery embolization (BAE) is first-line definitive therapy (90% success rate), 4) Rigid bronchoscopy for airway management if needed. Surgery is reserved for BAE failure.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old male with cystic fibrosis has chronic Pseudomonas aeruginosa colonization. His FEV1 has declined from 65% to 52% predicted over the past year. He is on inhaled tobramycin and dornase alfa. What additional therapy should be considered?",
    o: ["Elexacaftor-tezacaftor-ivacaftor (Trikafta) if he has at least one F508del CFTR mutation; this CFTR modulator has demonstrated dramatic improvement in lung function", "Oral ciprofloxacin indefinitely", "High-dose systemic corticosteroids", "Lung transplant as immediate next step"],
    a: 0,
    r: "Elexacaftor-tezacaftor-ivacaftor (Trikafta) is a highly effective CFTR modulator combination approved for patients with at least one F508del mutation (approximately 90% of CF patients). It addresses the underlying protein defect, improving FEV1 by 10-14 percentage points, reducing exacerbations by 63%, and significantly improving quality of life. It represents the most significant therapeutic advance in CF history. CFTR genotyping is essential to determine eligibility. Lung transplant is for end-stage disease.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old male with severe persistent asthma is on high-dose ICS/LABA and has been requiring oral prednisone 20 mg daily for 8 months. Eosinophil count is 600 cells/mcL. Which biologic targets eosinophilic inflammation and can reduce oral steroid dependence?",
    o: ["Mepolizumab (anti-IL-5) or benralizumab (anti-IL-5 receptor alpha)", "Omalizumab (anti-IgE)", "Rituximab (anti-CD20)", "Infliximab (anti-TNF)"],
    a: 0,
    r: "Anti-IL-5 biologics (mepolizumab, reslizumab) and anti-IL-5R (benralizumab) specifically target eosinophilic inflammation and have demonstrated significant oral corticosteroid-sparing effect in severe eosinophilic asthma. Benralizumab depletes eosinophils via ADCC and showed 75% median steroid dose reduction in the ZONDA trial. Mepolizumab reduced steroid dose by 50% in the SIRIUS trial. These biologics are indicated for severe asthma with eosinophils 150-300+ cells/mcL depending on the specific agent.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old female presents with subacute onset of gait instability, urinary incontinence, and cognitive decline. CT head shows ventriculomegaly out of proportion to cortical atrophy. What is the most likely diagnosis and diagnostic test?",
    o: ["Normal pressure hydrocephalus (NPH); large-volume lumbar puncture (30-50 mL CSF removal) with gait assessment before and after", "Alzheimer disease; PET amyloid scan", "Parkinson disease; DaTscan", "Vascular dementia; MRI with diffusion"],
    a: 0,
    r: "The classic triad of NPH (Hakim triad) is: 1) Gait disturbance (magnetic, wide-based), 2) Urinary incontinence, 3) Dementia. Ventriculomegaly without proportional sulcal enlargement (Evans index greater than 0.3) is characteristic. Large-volume lumbar puncture (removing 30-50 mL CSF) with pre- and post-procedure gait assessment is both diagnostic and prognostic. Gait improvement after CSF removal predicts good response to ventriculoperitoneal (VP) shunt placement. Gait disturbance is typically the first and most responsive symptom.",
    s: "Neurology"
  },
  {
    q: "A 20-year-old female presents with her first generalized tonic-clonic seizure. She was sleep-deprived studying for finals. EEG shows generalized 3-4 Hz spike-and-wave discharges. MRI brain is normal. What is the most likely epilepsy syndrome and first-line treatment?",
    o: ["Juvenile myoclonic epilepsy (JME) or idiopathic generalized epilepsy; valproate or levetiracetam (lamotrigine for women of childbearing potential)", "Focal epilepsy; carbamazepine", "Status epilepticus; IV lorazepam", "Psychogenic non-epileptic seizures; psychiatric referral"],
    a: 0,
    r: "Generalized tonic-clonic seizure in a young adult with sleep deprivation trigger and generalized spike-and-wave discharges on EEG suggests idiopathic generalized epilepsy (IGE), most likely JME. First-line treatments: valproate has the broadest efficacy for generalized epilepsies but is teratogenic (avoid in women of childbearing potential unless no alternative). Levetiracetam is effective and safer in pregnancy. Lamotrigine is another option. Carbamazepine can worsen generalized epilepsies by exacerbating absence and myoclonic seizures.",
    s: "Neurology"
  },
  {
    q: "A 55-year-old male with a history of migraine with aura (visual scintillating scotoma) asks about cardiovascular risk. What should the NP counsel?",
    o: ["Migraine with aura is associated with a 2-fold increased risk of ischemic stroke; avoid combined estrogen-containing contraceptives and tobacco; consider vascular risk factor optimization", "Migraine has no cardiovascular implications", "Only cluster headache increases stroke risk", "Aura is a benign visual phenomenon without clinical significance"],
    a: 0,
    r: "Migraine with aura is an independent risk factor for ischemic stroke (2x risk increase), particularly in women under 45 who smoke and use combined oral contraceptives (risk increases to 8-10x). The aura itself involves cortical spreading depression, which may activate prothrombotic pathways. Management implications: avoid combined estrogen-containing contraceptives (progestin-only or non-hormonal methods are safe), aggressive smoking cessation, and optimize modifiable vascular risk factors. Triptans are NOT contraindicated in migraine with aura.",
    s: "Neurology"
  },
  {
    q: "A 45-year-old male presents with progressive bilateral lower extremity weakness and spasticity over 1 year. He also has fasciculations in his arms and tongue. Sensory examination is completely normal. Reflexes are pathologically brisk throughout. What is the most likely diagnosis?",
    o: ["Amyotrophic lateral sclerosis (ALS); EMG and nerve conduction studies for confirmation", "Multiple sclerosis; MRI brain and spine", "Myasthenia gravis; AChR antibodies", "Guillain-Barre syndrome; lumbar puncture"],
    a: 0,
    r: "Combined upper motor neuron signs (spasticity, hyperreflexia) and lower motor neuron signs (fasciculations, atrophy) in the ABSENCE of sensory findings is the hallmark of ALS. El Escorial criteria require UMN and LMN signs in multiple body regions with progressive course. EMG shows active and chronic denervation with normal sensory nerve studies. ALS does not affect sensory neurons. Median survival is 3-5 years. Riluzole and edaravone modestly slow progression. MS and GBS have sensory involvement. MG affects the neuromuscular junction without UMN signs.",
    s: "Neurology"
  },
  {
    q: "A 30-year-old female with epilepsy well-controlled on valproate presents for preconception counseling. She has had no seizures for 3 years. What medication change should the NP discuss?",
    o: ["Transition from valproate to a safer alternative (lamotrigine or levetiracetam) well before conception; start high-dose folic acid (4-5 mg daily)", "Continue valproate with folic acid 0.4 mg daily", "Discontinue all AEDs since she has been seizure-free", "Switch to phenytoin as it is safer in pregnancy"],
    a: 0,
    r: "Valproate is the most teratogenic commonly used AED (neural tube defects 1-2%, overall major malformation rate 6-11%, and dose-dependent cognitive effects in offspring). Women of childbearing potential should be transitioned to safer alternatives: lamotrigine or levetiracetam have the lowest teratogenicity rates. The switch should occur well before conception to ensure seizure control on the new regimen. High-dose folic acid (4-5 mg daily, not standard 0.4 mg) is recommended for women on AEDs. Phenytoin also has teratogenic potential (fetal hydantoin syndrome).",
    s: "Neurology"
  }
];
