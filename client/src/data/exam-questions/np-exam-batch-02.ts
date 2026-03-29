import type { ExamQuestion } from "./types";

export const npExamBatch02Questions: ExamQuestion[] = [
  {
    q: "A 58-year-old male with a 40-pack-year smoking history presents with progressive dyspnea and chronic productive cough. Spirometry shows FEV1/FVC ratio of 0.62 and FEV1 of 55% predicted. He has had 2 exacerbations in the past year. According to GOLD guidelines, what is the most appropriate initial maintenance therapy?",
    o: ["LAMA/LABA combination inhaler", "ICS/LABA combination inhaler", "Short-acting bronchodilator PRN only", "Systemic corticosteroid taper"],
    a: 0,
    r: "This patient has GOLD Group E COPD (frequent exacerbations with moderate airflow limitation). LAMA/LABA combination is first-line maintenance therapy for patients with exacerbation history. ICS/LABA may be considered if eosinophils are elevated. SABA PRN alone is insufficient for this severity. Systemic corticosteroids are for acute exacerbations, not maintenance.",
    s: "Respiratory"
  },
  {
    q: "A 32-year-old female with moderate persistent asthma on medium-dose ICS/LABA continues to have symptoms 4 times per week and nighttime awakenings twice monthly. FENO is 45 ppb. What adjustment should the NP make?",
    o: ["Step up to high-dose ICS/LABA and consider add-on LAMA", "Switch to SABA monotherapy", "Add oral theophylline", "Discontinue ICS and use LABA alone"],
    a: 0,
    r: "Uncontrolled moderate persistent asthma on medium-dose ICS/LABA with elevated FENO (indicating ongoing eosinophilic inflammation) warrants step-up to high-dose ICS/LABA with consideration of add-on LAMA (tiotropium). SABA monotherapy is inappropriate for persistent asthma. Theophylline has a narrow therapeutic index and is not preferred. LABA should never be used without ICS due to increased mortality risk.",
    s: "Respiratory"
  },
  {
    q: "A 72-year-old nursing home resident presents with fever of 39.1 C, productive cough with purulent sputum, and right lower lobe consolidation on chest X-ray. CURB-65 score is 3. What is the appropriate management?",
    o: ["Admit to hospital and initiate IV respiratory fluoroquinolone or beta-lactam plus macrolide", "Prescribe oral amoxicillin 1 g three times daily outpatient", "Obtain sputum culture before initiating antibiotics and wait for results", "Start oral azithromycin monotherapy and follow up in 48 hours"],
    a: 0,
    r: "CURB-65 score of 3 indicates severe community-acquired pneumonia requiring hospital admission. Empiric IV antibiotics with a respiratory fluoroquinolone or combination beta-lactam plus macrolide should be initiated promptly. Outpatient oral therapy is inappropriate for this severity. While sputum cultures are valuable, antibiotics should not be delayed for results. Azithromycin monotherapy is insufficient for severe CAP.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old asthmatic presents to the clinic with acute wheezing, respiratory rate of 28, SpO2 91% on room air, and peak expiratory flow 40% of personal best. After 3 doses of nebulized albuterol, symptoms have not improved. What should the NP do?",
    o: ["Transfer to emergency department for systemic corticosteroids and continuous nebulization", "Prescribe an oral corticosteroid burst and discharge home", "Add ipratropium bromide nebulization and reassess in 30 minutes in clinic", "Switch to levalbuterol and continue outpatient management"],
    a: 0,
    r: "This patient is experiencing a severe asthma exacerbation (PEF 40% predicted, SpO2 less than 92%, poor response to initial bronchodilators). Transfer to the ED is indicated for IV access, systemic corticosteroids, continuous nebulization, and potential escalation to magnesium sulfate or intubation. Outpatient management is unsafe at this severity level.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old male with a positive tuberculin skin test (18 mm induration) and a normal chest X-ray has no symptoms and no known TB contacts. He was born in a country with high TB prevalence. What is the recommended treatment?",
    o: ["Isoniazid 300 mg daily for 9 months with pyridoxine supplementation", "Rifampin, isoniazid, pyrazinamide, and ethambutol for 2 months", "No treatment; repeat TST in 1 year", "Isoniazid 300 mg daily for 3 months only"],
    a: 0,
    r: "Latent TB infection (positive TST, normal CXR, no symptoms) in a high-risk individual requires treatment to prevent progression to active TB. Isoniazid 300 mg daily for 9 months is a standard regimen, with pyridoxine (vitamin B6) to prevent peripheral neuropathy. Four-drug therapy is for active TB. Observation without treatment is inappropriate in a high-risk patient. Three months of isoniazid alone is insufficient.",
    s: "Respiratory"
  },
  {
    q: "A 74-year-old male presents with acute onset right-sided hemiparesis and expressive aphasia beginning 90 minutes ago. CT head shows no hemorrhage. Blood pressure is 185/100 mmHg. Blood glucose is 142 mg/dL. What is the most appropriate intervention?",
    o: ["Administer IV alteplase 0.9 mg/kg (maximum 90 mg) with 10% given as bolus", "Administer aspirin 325 mg and admit for observation", "Reduce blood pressure to below 140/90 before any intervention", "Order MRI brain before treatment decision"],
    a: 0,
    r: "This patient presents within the 4.5-hour window for IV thrombolysis with alteplase for acute ischemic stroke. CT has ruled out hemorrhage. BP up to 185/110 is acceptable for thrombolysis eligibility. Aspirin alone is insufficient for acute large vessel occlusion. Aggressive BP reduction prior to thrombolysis may worsen ischemia. MRI should not delay treatment when CT has excluded hemorrhage.",
    s: "Neurology"
  },
  {
    q: "A 42-year-old female presents with recurrent episodes of unilateral throbbing headache with nausea, photophobia, and visual aura occurring 8 days per month. She has tried and failed adequate trials of propranolol and topiramate. Which preventive therapy should the NP consider?",
    o: ["CGRP monoclonal antibody (erenumab, fremanezumab, or galcanezumab)", "Onabotulinumtoxin A injections", "Verapamil 240 mg daily", "Valproic acid 500 mg twice daily"],
    a: 0,
    r: "CGRP monoclonal antibodies are indicated for episodic migraine prevention after failure of at least 2 first-line preventive therapies. Onabotulinumtoxin A is specifically FDA-approved for chronic migraine (15 or more headache days per month), not episodic. Verapamil is used for cluster headache prevention, not migraine. Valproic acid is another first-line option but carries significant teratogenic risk in a woman of reproductive age.",
    s: "Neurology"
  },
  {
    q: "A 68-year-old male with Parkinson disease on carbidopa-levodopa develops wearing-off phenomena with motor fluctuations. He experiences 4 hours of OFF time daily. Which medication adjustment is most appropriate?",
    o: ["Add entacapone (COMT inhibitor) to each levodopa dose", "Double the levodopa dose and extend dosing intervals", "Switch to anticholinergic monotherapy", "Discontinue levodopa and start pramipexole monotherapy"],
    a: 0,
    r: "Entacapone (COMT inhibitor) extends levodopa duration by inhibiting its peripheral metabolism, reducing OFF time. Increasing levodopa dose worsens dyskinesias. Anticholinergics are ineffective as monotherapy for moderate-advanced PD and cause cognitive side effects in elderly patients. Abruptly switching from levodopa to a dopamine agonist risks neuroleptic malignant-like syndrome and inadequate symptom control.",
    s: "Neurology"
  },
  {
    q: "A 30-year-old female presents with a first unprovoked generalized tonic-clonic seizure. Neurological examination is normal. MRI brain and EEG are normal. She has no family history of epilepsy. What is the recommended management?",
    o: ["Counsel on seizure precautions, driving restrictions, and offer the option to observe or initiate antiepileptic therapy", "Start levetiracetam 500 mg twice daily immediately", "Order a repeat EEG in 24 hours and withhold treatment until results", "Prescribe phenytoin 300 mg daily and schedule follow-up in 3 months"],
    a: 0,
    r: "After a first unprovoked seizure with normal neuroimaging and EEG, the risk of recurrence is approximately 30-40%. Current guidelines support either observation with counseling or initiation of AED therapy based on shared decision-making with the patient. Immediate AED initiation without discussion is premature. Phenytoin has significant drug interactions and side effects making it a poor first choice in a young woman of childbearing potential.",
    s: "Neurology"
  },
  {
    q: "A 78-year-old female in a nursing home develops acute confusion with fluctuating attention over the past 24 hours. Her baseline cognitive function was intact. She has a new UTI and was recently started on diphenhydramine for insomnia. What is the priority intervention?",
    o: ["Discontinue diphenhydramine, treat the UTI, and implement delirium precautions", "Order brain MRI to rule out stroke", "Start haloperidol 2 mg IM for agitation", "Initiate a cholinesterase inhibitor for presumed new dementia"],
    a: 0,
    r: "This is acute delirium with identifiable precipitants: anticholinergic medication (diphenhydramine) and infection (UTI). The priority is removing the precipitating cause -- discontinue the offending medication and treat the underlying infection. Brain MRI may be considered if symptoms persist but is not the immediate priority. Antipsychotics should be reserved for severe agitation that poses safety risk. This is delirium, not dementia -- cholinesterase inhibitors are not indicated.",
    s: "Neurology"
  }
];
