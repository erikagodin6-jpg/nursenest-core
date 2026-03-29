import type { ExamQuestion } from "./types";

export const npExamBatch16Questions: ExamQuestion[] = [
  {
    q: "A 65-year-old male with IPF (idiopathic pulmonary fibrosis) has progressive dyspnea despite pirfenidone therapy. DLCO is 35% predicted. PaO2 at rest is 55 mmHg. What management steps should be discussed?",
    o: ["Oxygen supplementation, pulmonary rehabilitation, and referral for lung transplant evaluation", "Increase pirfenidone dose", "Start systemic corticosteroids", "Prescribe bronchodilators"],
    a: 0,
    r: "IPF with advanced disease (DLCO less than 40%, resting hypoxemia) warrants lung transplant evaluation as IPF has a median survival of 3-5 years from diagnosis. Supplemental oxygen improves symptoms and quality of life. Pulmonary rehabilitation enhances exercise capacity. Systemic corticosteroids are not effective in IPF and may be harmful. Bronchodilators do not address the fibrotic process.",
    s: "Respiratory"
  },
  {
    q: "A 30-year-old female with asthma uses her rescue inhaler 5 times weekly and has nighttime symptoms twice monthly. She is currently on low-dose ICS alone. How should therapy be adjusted according to the stepwise approach?",
    o: ["Step up to low-dose ICS/LABA combination (step 3)", "Continue current low-dose ICS and add a leukotriene modifier", "Switch to SABA PRN only (step down)", "Start oral corticosteroids daily"],
    a: 0,
    r: "Rescue inhaler use more than 2 days/week and nighttime symptoms 3-4 times monthly indicate uncontrolled asthma on current step 2 therapy (low-dose ICS). Step 3 is low-dose ICS/LABA combination. Adding LTRA is an alternative but less effective than ICS/LABA. Stepping down is inappropriate with uncontrolled symptoms. Daily oral steroids are for severe persistent asthma only.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male presents with a massive hemoptysis episode (approximately 300 mL of bright red blood). He is hemodynamically stable with SpO2 94% on room air. CXR shows right upper lobe opacity. What is the immediate priority?",
    o: ["Position patient with affected side (right) down, secure airway, emergent pulmonology/interventional radiology consultation for bronchial artery embolization", "CT angiography before any intervention", "Oral antibiotics and outpatient follow-up", "Nebulized tranexamic acid alone"],
    a: 0,
    r: "Massive hemoptysis (greater than 200-300 mL/24 hours) is life-threatening primarily from asphyxiation, not hemorrhagic shock. Positioning the patient with the bleeding side down prevents blood from flooding the unaffected lung. Airway management is the priority. Bronchial artery embolization (BAE) is the first-line intervention for massive hemoptysis. CT imaging may help localize the source but should not delay intervention in unstable patients.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old male with well-controlled asthma asks about exercising. He experiences wheezing during the first 10-15 minutes of vigorous exercise. What should the NP recommend?",
    o: ["Pre-exercise SABA (albuterol 2 puffs 15 minutes before exercise) and a 10-15 minute warm-up period", "Avoid all vigorous exercise", "Use LABA alone before exercise", "No intervention needed; symptoms are normal with exercise"],
    a: 0,
    r: "Exercise-induced bronchoconstriction (EIB) in an asthmatic is managed with pre-exercise SABA (albuterol 2 puffs 15-30 minutes before exercise). A warm-up period may reduce the severity of EIB. Exercise should not be avoided as it improves overall fitness and lung function. LABA should not be used alone without ICS. Symptoms with exercise are not normal and indicate EIB requiring intervention.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old female with stage IV lung adenocarcinoma has a large right-sided pleural effusion causing dyspnea. Thoracentesis yields 1,800 mL of exudative fluid. The effusion reaccumulates within 2 weeks. What is the recommended management?",
    o: ["Indwelling pleural catheter (IPC) or chemical pleurodesis for recurrent malignant pleural effusion", "Repeated thoracentesis every 2 weeks", "Diuretic therapy", "Chest tube insertion with continuous drainage"],
    a: 0,
    r: "Recurrent malignant pleural effusion requires definitive management. Options include IPC (allows outpatient drainage) or chemical pleurodesis (talc instillation to create adhesion between pleural surfaces). Repeated thoracentesis provides only temporary relief and exposes the patient to repeated procedural risks. Diuretics are ineffective for malignant effusions. A chest tube alone without pleurodesis leads to recurrence.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old male with newly diagnosed Alzheimer dementia (MMSE 20/30) presents with his family. His medications include atorvastatin and lisinopril. What pharmacological treatment should be initiated?",
    o: ["Cholinesterase inhibitor (donepezil 5 mg daily, titrated to 10 mg after 4-6 weeks)", "Memantine 10 mg twice daily", "Combination donepezil and memantine simultaneously", "No pharmacological treatment until MMSE drops below 15"],
    a: 0,
    r: "Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) are first-line for mild-to-moderate Alzheimer disease. Donepezil is started at 5 mg daily and titrated to 10 mg after 4-6 weeks. Memantine (NMDA receptor antagonist) is indicated for moderate-to-severe dementia and may be added later. Combination therapy from the start is not standard for mild disease. Waiting to treat delays potential cognitive benefit.",
    s: "Neurology"
  },
  {
    q: "A 45-year-old female presents with unilateral severe periorbital headache lasting 60-90 minutes with ipsilateral lacrimation, rhinorrhea, and ptosis. These occur 3-4 times daily for the past 3 weeks. What is the diagnosis and acute treatment?",
    o: ["Cluster headache; high-flow oxygen (12-15 L/min) and/or subcutaneous sumatriptan 6 mg", "Migraine with aura; oral sumatriptan 100 mg", "Tension headache; acetaminophen 1000 mg", "Trigeminal neuralgia; carbamazepine"],
    a: 0,
    r: "Unilateral periorbital headache with autonomic features (lacrimation, rhinorrhea, ptosis) occurring in clusters (multiple daily attacks over weeks) is classic cluster headache. First-line acute treatment is high-flow oxygen (12-15 L/min via non-rebreather for 15-20 minutes) or subcutaneous sumatriptan 6 mg (fastest onset of any triptan formulation). Verapamil is first-line preventive. Oral triptans are too slow for cluster attacks.",
    s: "Neurology"
  },
  {
    q: "A 35-year-old female with new-onset seizures has an MRI showing a 2 cm ring-enhancing lesion in the right temporal lobe with surrounding edema. She recently returned from Central America. Stool exam shows ova. What is the most likely diagnosis?",
    o: ["Neurocysticercosis; antiparasitic therapy (albendazole) with concurrent corticosteroids and antiepileptic medication", "Primary brain tumor; refer for biopsy and oncology", "Brain abscess; IV antibiotics and surgical drainage", "Multiple sclerosis; start interferon therapy"],
    a: 0,
    r: "Ring-enhancing brain lesion in a patient from an endemic area with parasitic stool findings is highly suggestive of neurocysticercosis. Treatment includes albendazole (anti-parasitic) with concurrent dexamethasone (to prevent inflammatory response to dying cysts) and AEDs for seizure control. Primary brain tumors typically have different imaging characteristics. Brain abscess may appear similar but clinical context favors NCC. MS has white matter demyelinating lesions.",
    s: "Neurology"
  },
  {
    q: "A 55-year-old male with chronic lower back pain has been on gabapentin 300 mg three times daily for neuropathic pain with inadequate relief. He rates pain 7/10 with burning and tingling in bilateral feet. What medication adjustment is appropriate?",
    o: ["Titrate gabapentin to 1800-3600 mg daily in divided doses, or switch to duloxetine or pregabalin if gabapentin fails", "Add oxycodone 5 mg every 6 hours", "Start topical capsaicin alone", "Discontinue gabapentin and start amitriptyline 100 mg at bedtime"],
    a: 0,
    r: "Gabapentin 900 mg daily is a subtherapeutic dose for neuropathic pain. The effective dose range is 1800-3600 mg daily in three divided doses. Titration should be attempted before declaring treatment failure. If gabapentin is inadequate at optimal dosing, duloxetine or pregabalin are evidence-based alternatives. Opioids are not first-line for neuropathic pain. Starting amitriptyline at 100 mg is dangerous; it requires titration from 10-25 mg.",
    s: "Neurology"
  },
  {
    q: "A 72-year-old female presents with progressive bilateral hand weakness and atrophy, fasciculations in multiple limbs, and brisk reflexes. Sensation is intact. EMG shows widespread denervation with normal sensory nerve conduction. What is the most likely diagnosis?",
    o: ["Amyotrophic lateral sclerosis (ALS)", "Myasthenia gravis", "Cervical myelopathy", "Chronic inflammatory demyelinating polyneuropathy"],
    a: 0,
    r: "Combined upper motor neuron signs (brisk reflexes) and lower motor neuron signs (weakness, atrophy, fasciculations) with intact sensation and EMG showing widespread denervation with normal sensory conduction is the hallmark of ALS. Myasthenia gravis has fatigable weakness without fasciculations. Cervical myelopathy has sensory findings. CIDP has sensory involvement and abnormal sensory conduction studies.",
    s: "Neurology"
  }
];
