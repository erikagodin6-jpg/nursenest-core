import type { ExamQuestion } from "./types";

export const npClinicalManagementQuestions: ExamQuestion[] = [
  // ===== CARDIOVASCULAR MANAGEMENT (Questions 1-10) =====
  {
    q: "A 62-year-old male presents with exertional chest pressure relieved by rest. BP is 148/92, HR 78, and ECG shows ST depression in leads V4-V6 during a stress test. LDL is 4.2 mmol/L. What is the most appropriate initial pharmacologic management?",
    o: ["ASA, high-intensity statin, beta-blocker, and sublingual nitroglycerin PRN", "Clopidogrel monotherapy and lifestyle modifications", "Calcium channel blocker and referral for coronary angiography only", "ACE inhibitor monotherapy and repeat stress test in 6 months"],
    a: 0,
    r: "Stable angina with positive stress test requires dual antiplatelet or ASA, high-intensity statin for LDL above 2.0 mmol/L, beta-blocker for rate control and anti-anginal effect, and sublingual nitroglycerin for acute episodes. Clopidogrel alone is insufficient. Calcium channel blockers are second-line. ACE inhibitor monotherapy does not address the anginal symptoms or lipid management adequately.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old female with newly diagnosed heart failure (EF 35%) presents with dyspnea on exertion and bilateral ankle edema. BP is 128/78, HR 82. Creatinine is 92 umol/L and potassium is 4.1 mmol/L. Which medication combination is the first-line guideline-directed therapy?",
    o: ["ACE inhibitor (or ARB), beta-blocker, and mineralocorticoid receptor antagonist", "Digoxin, furosemide, and hydralazine", "Calcium channel blocker, thiazide diuretic, and ASA", "ARB, ivabradine, and metolazone"],
    a: 0,
    r: "Heart failure with reduced ejection fraction (HFrEF) guideline-directed medical therapy includes ACE inhibitor or ARB, evidence-based beta-blocker (bisoprolol, carvedilol, or metoprolol succinate), and mineralocorticoid receptor antagonist (spironolactone). These medications reduce mortality. Digoxin does not reduce mortality. Calcium channel blockers (except amlodipine) are contraindicated in HFrEF. Ivabradine is added only if HR remains above 70 despite maximized beta-blocker.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old male with atrial fibrillation has a CHA2DS2-VASc score of 4. He reports no bleeding history. Creatinine clearance is 45 mL/min. What is the most appropriate anticoagulation strategy?",
    o: ["Dose-adjusted direct oral anticoagulant (DOAC) based on renal function", "Full-dose warfarin with INR target of 2.0-3.0", "ASA 81 mg daily as an alternative to anticoagulation", "No anticoagulation due to renal impairment risk"],
    a: 0,
    r: "With a CHA2DS2-VASc score of 4, anticoagulation is strongly indicated. DOACs are preferred over warfarin due to fewer drug interactions and no routine INR monitoring, but dose adjustment is required for renal impairment (CrCl 15-49 mL/min for most DOACs). ASA alone is no longer recommended for stroke prevention in atrial fibrillation. Withholding anticoagulation at CrCl 45 mL/min is inappropriate as the stroke risk outweighs bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old female presents with BP readings of 162/98 and 158/96 on two separate visits. She has type 2 diabetes with microalbuminuria. Potassium is 4.3 mmol/L and creatinine is 88 umol/L. What is the first-line antihypertensive?",
    o: ["ACE inhibitor", "Thiazide diuretic", "Amlodipine", "Atenolol"],
    a: 0,
    r: "In hypertensive patients with diabetes and microalbuminuria, ACE inhibitors (or ARBs) are first-line because they provide renal protection by reducing intraglomerular pressure and albuminuria progression. Thiazide diuretics are first-line for uncomplicated hypertension but do not offer the same renal benefit. Amlodipine is an add-on agent. Beta-blockers are not first-line for hypertension without other indications.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old male presents with sudden onset of severe tearing chest pain radiating to the back. BP is 210/118 in the right arm and 178/96 in the left arm. HR is 104. Chest X-ray shows widened mediastinum. What is the priority intervention while awaiting imaging?",
    o: ["IV esmolol to rapidly lower heart rate and blood pressure", "IV nitroglycerin infusion only", "Thrombolytic therapy for suspected STEMI", "Oral captopril and observation"],
    a: 0,
    r: "Tearing chest pain with BP differential between arms and widened mediastinum is classic for aortic dissection. Immediate IV beta-blocker (esmolol) is priority to reduce heart rate below 60 and systolic BP below 120 mmHg, decreasing aortic wall stress. Nitroglycerin alone causes reflex tachycardia. Thrombolytics are absolutely contraindicated as they would worsen hemorrhage. Oral agents act too slowly for this emergency.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old female with peripheral arterial disease reports intermittent claudication after walking 100 meters. Ankle-brachial index is 0.6. She smokes 10 cigarettes per day. Which management plan is most appropriate?",
    o: ["Smoking cessation, supervised exercise program, antiplatelet therapy, and statin", "Immediate referral for surgical bypass", "Nifedipine and bed rest for 2 weeks", "Compression stockings and elevation of extremities"],
    a: 0,
    r: "PAD management for intermittent claudication includes aggressive risk factor modification: smoking cessation (most important modifiable factor), supervised exercise training (improves walking distance), antiplatelet therapy (ASA or clopidogrel), and statin therapy. Surgical bypass is reserved for critical limb ischemia or lifestyle-limiting claudication unresponsive to conservative measures. Calcium channel blockers are not first-line. Compression stockings and elevation are for venous disease, not arterial.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old male with a history of STEMI 3 months ago presents for follow-up. Current medications include ASA, ticagrelor, metoprolol, ramipril, and rosuvastatin. His LDL is 1.4 mmol/L and BP is 118/72. He asks about stopping ticagrelor. What is the appropriate recommendation?",
    o: ["Continue dual antiplatelet therapy for a total of 12 months post-STEMI", "Discontinue ticagrelor now since LDL is at target", "Switch to clopidogrel for indefinite use", "Stop both ASA and ticagrelor and continue statin only"],
    a: 0,
    r: "Post-STEMI, dual antiplatelet therapy (ASA plus a P2Y12 inhibitor such as ticagrelor) should be continued for 12 months to reduce the risk of stent thrombosis and recurrent events. Discontinuing at 3 months is premature. Switching to clopidogrel indefinitely is not standard. Stopping both antiplatelet agents dramatically increases thrombotic risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old male presents with new-onset exertional dyspnea. Echocardiogram reveals a bicuspid aortic valve with moderate aortic stenosis. Peak gradient is 35 mmHg, aortic valve area is 1.2 cm2, and EF is 60%. What is the most appropriate management?",
    o: ["Serial echocardiographic monitoring every 1-2 years with symptom surveillance", "Immediate referral for aortic valve replacement", "Start ACE inhibitor and beta-blocker therapy", "Prescribe prophylactic antibiotics before dental procedures"],
    a: 0,
    r: "Moderate aortic stenosis (valve area 1.0-1.5 cm2, mean gradient 20-39 mmHg) with preserved EF is managed with watchful waiting and serial echocardiograms every 1-2 years. Surgical valve replacement is indicated for severe symptomatic AS. ACE inhibitors should be used cautiously due to preload reduction. Current guidelines no longer recommend routine antibiotic prophylaxis for bicuspid aortic valve.",
    s: "Cardiovascular"
  },
  {
    q: "A 44-year-old female presents with palpitations and anxiety. ECG shows a narrow-complex regular tachycardia at 180 bpm. BP is 110/70 and she is alert. Vagal maneuvers are unsuccessful. What is the first pharmacologic intervention?",
    o: ["IV adenosine 6 mg rapid push", "IV metoprolol 5 mg over 2 minutes", "Oral verapamil 80 mg", "Synchronized cardioversion at 50 joules"],
    a: 0,
    r: "Narrow-complex regular tachycardia (likely SVT/AVNRT) in a stable patient unresponsive to vagal maneuvers is treated with IV adenosine 6 mg rapid push followed by saline flush. If unsuccessful, a second dose of 12 mg can be given. IV metoprolol is an alternative but not first-line. Oral medications act too slowly. Cardioversion is reserved for hemodynamically unstable patients.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old male with chronic stable heart failure (EF 30%) on optimized GDMT presents with persistent symptoms (NYHA class III). His HR is 78 bpm in sinus rhythm and QRS duration is 155 ms with LBBB morphology. What additional intervention should be recommended?",
    o: ["Cardiac resynchronization therapy (CRT) with defibrillator", "Add ivabradine to lower heart rate further", "Increase furosemide dose for volume management", "Refer for heart transplant evaluation immediately"],
    a: 0,
    r: "In HFrEF with EF 35% or less, NYHA class III-IV symptoms despite optimal GDMT, sinus rhythm, QRS 150 ms or greater with LBBB, CRT with defibrillator (CRT-D) is strongly recommended. It improves symptoms, reduces hospitalizations, and reduces mortality. Ivabradine is indicated when HR exceeds 70 bpm. Increasing diuretics does not address the dyssynchrony. Transplant evaluation is premature before CRT trial.",
    s: "Cardiovascular"
  },

  // ===== RESPIRATORY MANAGEMENT (Questions 11-20) =====
  {
    q: "A 58-year-old male with a 40 pack-year smoking history presents with progressive dyspnea and chronic productive cough. Spirometry shows FEV1/FVC ratio of 0.58 and FEV1 of 52% predicted post-bronchodilator. He reports two exacerbations requiring antibiotics in the past year. According to GOLD classification, what is the appropriate initial maintenance therapy?",
    o: ["Long-acting muscarinic antagonist (LAMA) plus long-acting beta-agonist (LABA)", "Short-acting beta-agonist PRN only", "Inhaled corticosteroid monotherapy", "Oral theophylline twice daily"],
    a: 0,
    r: "GOLD Group E (formerly Group D) COPD with FEV1 52% predicted (GOLD 2) and 2 or more exacerbations per year warrants LAMA + LABA combination therapy. SABA PRN alone is inadequate for moderate COPD with frequent exacerbations. ICS monotherapy is not recommended in COPD. Theophylline has a narrow therapeutic index and is not first-line.",
    s: "Respiratory"
  },
  {
    q: "A 32-year-old female with asthma uses her salbutamol inhaler 4-5 times per week and has nighttime symptoms twice per month. She has not been on controller therapy. Based on asthma classification, what is the most appropriate step-up therapy?",
    o: ["Low-dose inhaled corticosteroid daily", "Medium-dose inhaled corticosteroid plus LABA", "Oral montelukast monotherapy", "Increase salbutamol to scheduled dosing four times daily"],
    a: 0,
    r: "Asthma with symptoms more than twice per week but not daily, and nighttime symptoms more than twice per month classifies as mild persistent. Step 2 therapy is low-dose ICS daily. Medium-dose ICS-LABA is step 3-4. Montelukast is an alternative but less effective than ICS. Scheduled SABA does not address inflammation and increases adverse effects.",
    s: "Respiratory"
  },
  {
    q: "A 70-year-old male with COPD presents with increased dyspnea, purulent sputum, and temperature of 37.8 degrees Celsius. Oxygen saturation is 88% on room air. Chest X-ray shows no consolidation. What is the most appropriate management?",
    o: ["Oral prednisone 40 mg for 5 days, antibiotic therapy, and supplemental oxygen targeting SpO2 88-92%", "IV methylprednisolone and broad-spectrum IV antibiotics", "Nebulized salbutamol only and follow-up in 1 week", "Chest CT with contrast to rule out pulmonary embolism first"],
    a: 0,
    r: "Acute COPD exacerbation with increased dyspnea, purulent sputum, and at least one Anthonisen criterion warrants short-course systemic corticosteroids (prednisone 40 mg for 5 days), antibiotics (covering H. influenzae, M. catarrhalis, S. pneumoniae), and supplemental oxygen titrated to SpO2 88-92% to avoid hypercapnic respiratory failure. IV steroids are for severe cases requiring hospitalization. SABA alone is insufficient. CT-PA is not indicated without PE suspicion.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old female non-smoker presents with a 3-month history of dry cough. She started lisinopril for hypertension 4 months ago. Physical exam and chest X-ray are normal. What is the most appropriate initial management?",
    o: ["Discontinue lisinopril and switch to an ARB, then reassess in 4 weeks", "Add a cough suppressant and continue lisinopril", "Order a high-resolution CT of the chest", "Prescribe an inhaled corticosteroid for possible cough-variant asthma"],
    a: 0,
    r: "ACE inhibitor-induced cough occurs in up to 15% of patients, typically a dry, persistent cough starting weeks to months after initiation. The appropriate management is to discontinue the ACE inhibitor and substitute an ARB, which rarely causes cough. The cough usually resolves within 1-4 weeks. Adding a cough suppressant does not address the cause. HRCT is unnecessary with a clear temporal association. Treating for asthma before ruling out ACE inhibitor cough is premature.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old male presents with sudden onset pleuritic chest pain and dyspnea. He is tall and thin with no significant medical history. Chest X-ray reveals a 25% right-sided pneumothorax with no mediastinal shift. Vital signs are stable. What is the initial management?",
    o: ["Needle aspiration with a small-bore catheter and reassessment", "Immediate chest tube insertion (28-32 Fr)", "Observation with supplemental oxygen and repeat chest X-ray in 6 hours", "Emergency thoracotomy"],
    a: 0,
    r: "For a first episode primary spontaneous pneumothorax larger than 2 cm (approximately 15-20%) in a stable patient, needle aspiration or small-bore catheter is the recommended initial intervention per BTS and Canadian guidelines. Large-bore chest tube is reserved for tension pneumothorax, secondary pneumothorax, or failed aspiration. Observation alone is appropriate for very small pneumothoraces (less than 2 cm). Thoracotomy is not indicated.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old female with obesity (BMI 42) presents with excessive daytime somnolence, morning headaches, and witnessed apneas. Epworth Sleepiness Scale score is 16. An overnight polysomnography shows an AHI of 32 events per hour. What is the first-line treatment?",
    o: ["Continuous positive airway pressure (CPAP) therapy", "Mandibular advancement device", "Uvulopalatopharyngoplasty (UPPP)", "Weight loss counseling only and reassess in 6 months"],
    a: 0,
    r: "Moderate to severe obstructive sleep apnea (AHI 15 or greater) with excessive daytime somnolence requires CPAP as first-line therapy. It reduces AHI, improves daytime sleepiness, and decreases cardiovascular risk. Mandibular advancement devices are for mild to moderate OSA or CPAP-intolerant patients. UPPP has variable outcomes. Weight loss is important but insufficient as sole therapy for severe OSA.",
    s: "Respiratory"
  },
  {
    q: "A 62-year-old male with COPD (FEV1 38% predicted) on LAMA/LABA/ICS triple therapy continues to have frequent exacerbations (3 in the past year). Blood eosinophil count is 80 cells per microlitre. What medication adjustment should be considered?",
    o: ["Discontinue ICS and add roflumilast to LAMA/LABA", "Add oral corticosteroids long-term", "Switch to ICS monotherapy", "Add azithromycin prophylaxis to current triple therapy"],
    a: 0,
    r: "With low blood eosinophils (less than 100 cells/uL), ICS benefit is minimal, and the risk of pneumonia increases. Roflumilast (PDE4 inhibitor) is indicated for COPD with FEV1 less than 50% predicted and frequent exacerbations despite bronchodilator therapy. Long-term oral corticosteroids cause significant adverse effects. ICS monotherapy is never indicated in COPD. Azithromycin prophylaxis is an option but ICS de-escalation with roflumilast addition is more appropriate given low eosinophils.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old female presents with progressively worsening dyspnea on exertion over 6 months. She has no cough or sputum. Spirometry shows FVC 62% predicted, FEV1 68% predicted, and FEV1/FVC ratio of 0.88. DLCO is reduced at 55% predicted. What is the most likely diagnosis?",
    o: ["Interstitial lung disease", "COPD", "Asthma", "Pulmonary hypertension without parenchymal disease"],
    a: 0,
    r: "A restrictive pattern on spirometry (reduced FVC with preserved or elevated FEV1/FVC ratio) combined with reduced DLCO suggests interstitial lung disease. COPD and asthma produce obstructive patterns with reduced FEV1/FVC. Pulmonary hypertension without parenchymal disease typically shows normal spirometry with isolated DLCO reduction. The combination of restriction and decreased gas transfer points to ILD.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male with well-controlled asthma on low-dose ICS/LABA presents with a new diagnosis of hypertension. Which antihypertensive agent should be avoided?",
    o: ["Non-selective beta-blocker (propranolol)", "ACE inhibitor (ramipril)", "Calcium channel blocker (amlodipine)", "Thiazide diuretic (hydrochlorothiazide)"],
    a: 0,
    r: "Non-selective beta-blockers (propranolol, nadolol) block beta-2 receptors in bronchial smooth muscle, causing bronchoconstriction and potentially triggering severe asthma exacerbations. They are contraindicated in asthma. ACE inhibitors may cause cough but do not worsen bronchoconstriction. Calcium channel blockers and thiazide diuretics are safe in asthma. If a beta-blocker is necessary, cardioselective agents (bisoprolol) at low doses may be cautiously used.",
    s: "Respiratory"
  },
  {
    q: "A 65-year-old female presents with a 3-week history of cough with blood-streaked sputum, unintentional weight loss of 5 kg, and a 30 pack-year smoking history. Chest X-ray shows a 3.5 cm spiculated mass in the right upper lobe. What is the most appropriate next diagnostic step?",
    o: ["CT chest with contrast followed by CT-guided biopsy or bronchoscopy", "Repeat chest X-ray in 3 months for interval change", "Sputum cytology and acid-fast bacilli smear", "Start empiric antibiotics for possible pneumonia"],
    a: 0,
    r: "A spiculated lung mass in a long-term smoker with hemoptysis and weight loss is highly suspicious for primary lung malignancy. CT chest with contrast provides detailed staging information, and tissue biopsy (CT-guided or bronchoscopic) is essential for histologic diagnosis. Watchful waiting with repeat imaging risks delaying diagnosis. Sputum cytology has low sensitivity. Empiric antibiotics delay workup of a likely malignancy.",
    s: "Respiratory"
  },

  // ===== NEUROLOGICAL DIFFERENTIAL DIAGNOSIS (Questions 21-30) =====
  {
    q: "A 72-year-old female presents with acute onset right-sided weakness and expressive aphasia that began 2 hours ago. CT head is negative for hemorrhage. BP is 178/96. What is the priority intervention?",
    o: ["Administer IV alteplase within the 4.5-hour treatment window", "Start IV labetalol to lower BP below 140/90 before any intervention", "Order MRI brain before considering thrombolysis", "Administer ASA 325 mg and admit for observation"],
    a: 0,
    r: "Acute ischemic stroke within the 4.5-hour window with no hemorrhage on CT is an indication for IV alteplase. BP should only be lowered if above 185/110 prior to thrombolysis. Waiting for MRI delays time-critical treatment. ASA is given 24 hours after thrombolysis, not instead of it. The goal is door-to-needle time under 60 minutes.",
    s: "Neurological"
  },
  {
    q: "A 35-year-old female presents with episodic unilateral throbbing headaches with visual aura (zigzag lines) lasting 20 minutes before headache onset. She experiences nausea and photophobia. Episodes occur 8 times per month and impair her daily functioning. What is the most appropriate prophylactic therapy?",
    o: ["Propranolol or topiramate as first-line prophylaxis", "Sumatriptan daily as preventive therapy", "Opioid analgesics for breakthrough pain management", "Acetaminophen 1000 mg scheduled three times daily"],
    a: 0,
    r: "Migraine with aura occurring 4 or more times per month or causing significant disability warrants prophylactic therapy. First-line agents include propranolol, topiramate, amitriptyline, or valproate. Note: combined oral contraceptives are contraindicated in migraine with aura due to stroke risk. Triptans are abortive therapy, not preventive. Opioids risk medication overuse headache. Scheduled acetaminophen is not effective prophylaxis.",
    s: "Neurological"
  },
  {
    q: "A 68-year-old male presents with resting tremor in the right hand, cogwheel rigidity, bradykinesia, and shuffling gait. Symptoms have progressed over 18 months. His cognition is intact. What is the initial pharmacologic treatment?",
    o: ["Carbidopa-levodopa", "Donepezil", "Haloperidol", "Propranolol"],
    a: 0,
    r: "Parkinson disease presenting with motor symptoms (resting tremor, rigidity, bradykinesia, postural instability) is best treated with carbidopa-levodopa as the most effective first-line agent. Dopamine agonists may be used in younger patients. Donepezil is for Alzheimer dementia. Haloperidol is a dopamine antagonist that would worsen parkinsonism. Propranolol treats essential tremor, not parkinsonian resting tremor.",
    s: "Neurological"
  },
  {
    q: "A 25-year-old female presents with a 2-day history of ascending bilateral lower extremity weakness that began in the feet and is now at the knees. She had a respiratory infection 3 weeks ago. Deep tendon reflexes are absent in both legs. What diagnostic test is most important to confirm the diagnosis?",
    o: ["Lumbar puncture for CSF analysis and nerve conduction studies", "CT head without contrast", "Serum creatine kinase level", "MRI of the lumbar spine with gadolinium"],
    a: 0,
    r: "Ascending symmetric weakness with areflexia following a recent infection is classic for Guillain-Barre syndrome (acute inflammatory demyelinating polyradiculoneuropathy). CSF analysis shows albuminocytologic dissociation (elevated protein with normal cell count). Nerve conduction studies confirm demyelination. CT head is normal in GBS. CK is for myopathies. MRI spine may show nerve root enhancement but is not the primary diagnostic tool.",
    s: "Neurological"
  },
  {
    q: "A 55-year-old male presents with the worst headache of his life that began suddenly during exercise. He has neck stiffness and photophobia. CT head without contrast is negative. What is the next diagnostic step?",
    o: ["Lumbar puncture to assess for xanthochromia", "CT angiography of cerebral vessels only", "Prescribe sumatriptan and discharge with follow-up", "MRI brain with gadolinium enhancement"],
    a: 0,
    r: "Thunderclap headache raises suspicion for subarachnoid hemorrhage until proven otherwise. CT head sensitivity decreases after the first 6-12 hours. A negative CT must be followed by lumbar puncture to look for xanthochromia (bilirubin in CSF), which confirms SAH. CTA may identify an aneurysm but does not rule out SAH if LP is not performed. Discharging without LP is dangerous. MRI has lower sensitivity for acute SAH.",
    s: "Neurological"
  },
  {
    q: "A 30-year-old female presents with two episodes of optic neuritis and one episode of transverse myelitis over 2 years. MRI brain shows multiple periventricular white matter lesions. CSF shows oligoclonal bands. What is the first-line disease-modifying therapy?",
    o: ["Interferon beta-1a or dimethyl fumarate", "High-dose IV methylprednisolone indefinitely", "Carbamazepine for symptom management", "Plasmapheresis as maintenance therapy"],
    a: 0,
    r: "Relapsing-remitting multiple sclerosis (dissemination in time and space with supportive CSF findings) requires early initiation of disease-modifying therapy. First-line options include interferon beta preparations, dimethyl fumarate, or glatiramer acetate. IV methylprednisolone treats acute relapses but is not used long-term. Carbamazepine may treat trigeminal neuralgia in MS but does not modify disease course. Plasmapheresis is for steroid-refractory relapses.",
    s: "Neurological"
  },
  {
    q: "A 78-year-old male presents with progressive memory loss over 2 years, difficulty with word-finding, and getting lost in familiar places. Mini-Mental State Examination score is 18/30. CT head shows generalized cortical atrophy with hippocampal volume loss. What is the most appropriate initial pharmacotherapy?",
    o: ["Cholinesterase inhibitor (donepezil)", "Levodopa-carbidopa", "Memantine as monotherapy", "Haloperidol for behavioral management"],
    a: 0,
    r: "Progressive cognitive decline with hippocampal atrophy and MMSE score consistent with moderate Alzheimer dementia warrants initiation of a cholinesterase inhibitor (donepezil, rivastigmine, or galantamine) as first-line. Memantine is typically added for moderate-to-severe disease or used when cholinesterase inhibitors are not tolerated. Levodopa is for Parkinson disease. Antipsychotics should only be used for severe behavioral symptoms unresponsive to non-pharmacologic measures.",
    s: "Neurological"
  },
  {
    q: "A 42-year-old female presents with episodes of severe, lancinating unilateral facial pain triggered by chewing and brushing teeth. Episodes last seconds and occur in clusters. Neurological examination is normal. What is the first-line treatment?",
    o: ["Carbamazepine", "Gabapentin", "Amitriptyline", "Oxycodone"],
    a: 0,
    r: "Trigeminal neuralgia presents with sudden, severe, shock-like facial pain along trigeminal nerve distributions triggered by activities such as chewing, talking, or touch. Carbamazepine is the first-line pharmacologic treatment with the strongest evidence base. Oxcarbazepine is an alternative. Gabapentin is second-line. Amitriptyline is for neuropathic pain but not first-line for trigeminal neuralgia. Opioids are not appropriate for this condition.",
    s: "Neurological"
  },
  {
    q: "A 60-year-old male with a history of epilepsy controlled on phenytoin presents with gingival hyperplasia, ataxia, and a phenytoin level of 120 umol/L (therapeutic range 40-80 umol/L). What is the immediate management?",
    o: ["Hold phenytoin, monitor for toxicity signs, and recheck level in 24-48 hours", "Increase phenytoin dose to account for autoinduction", "Administer IV phenytoin loading dose", "Switch immediately to levetiracetam at maximum dose"],
    a: 0,
    r: "Phenytoin toxicity (supratherapeutic level with ataxia and gingival hyperplasia) requires holding the medication and monitoring. Phenytoin has zero-order kinetics, meaning small dose increases can cause disproportionate level increases. The drug should be held until levels return to therapeutic range, then restarted at a lower dose. Increasing the dose worsens toxicity. Abrupt switching to another agent without careful transition risks breakthrough seizures.",
    s: "Neurological"
  },
  {
    q: "A 50-year-old male presents with progressively worsening bilateral hand weakness, fasciculations, hyperreflexia in the lower extremities, and dysarthria. Sensation is intact. Symptoms have worsened over 8 months. What is the most likely diagnosis?",
    o: ["Amyotrophic lateral sclerosis (ALS)", "Myasthenia gravis", "Cervical spondylotic myelopathy", "Multiple sclerosis"],
    a: 0,
    r: "Combined upper motor neuron signs (hyperreflexia) and lower motor neuron signs (fasciculations, weakness, atrophy) without sensory involvement in multiple regions is characteristic of ALS. Myasthenia gravis causes fatigable weakness without fasciculations or hyperreflexia. Cervical myelopathy typically involves sensory changes and a clear spinal cord level. MS usually presents with sensory symptoms and relapsing-remitting pattern.",
    s: "Neurological"
  },

  // ===== ENDOCRINE PRESCRIBING (Questions 31-40) =====
  {
    q: "A 52-year-old male is newly diagnosed with type 2 diabetes. HbA1c is 8.2% (66 mmol/mol), BMI is 34, creatinine is 76 umol/L, and eGFR is 88 mL/min/1.73m2. He has no cardiovascular disease history. What is the most appropriate initial pharmacotherapy?",
    o: ["Metformin 500 mg twice daily with gradual dose titration", "Insulin glargine 10 units at bedtime", "Glyburide 5 mg daily", "Sitagliptin 100 mg daily"],
    a: 0,
    r: "Metformin remains the first-line pharmacotherapy for type 2 diabetes per Canadian Diabetes Association guidelines when eGFR is adequate. It is started at 500 mg once or twice daily and titrated to minimize GI side effects. Insulin is reserved for symptomatic hyperglycemia or HbA1c above 10%. Sulfonylureas increase hypoglycemia risk and weight gain. DPP-4 inhibitors are second-line agents.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old female with type 2 diabetes, HbA1c 7.8%, and established atherosclerotic cardiovascular disease is currently on maximum-dose metformin. Creatinine is 98 umol/L. What is the most appropriate add-on therapy?",
    o: ["SGLT2 inhibitor (empagliflozin) or GLP-1 receptor agonist (liraglutide)", "Add glyburide 10 mg daily", "Add pioglitazone 30 mg daily", "Switch to insulin glargine and discontinue metformin"],
    a: 0,
    r: "In type 2 diabetes with established ASCVD, SGLT2 inhibitors (empagliflozin, canagliflozin) and GLP-1 receptor agonists (liraglutide, semaglutide) have demonstrated cardiovascular mortality benefit and are preferred second-line agents. Sulfonylureas do not reduce cardiovascular events. Pioglitazone may worsen heart failure. Switching entirely to insulin without trying these agents misses cardiovascular benefit.",
    s: "Endocrine"
  },
  {
    q: "A 38-year-old female presents with fatigue, weight gain, constipation, cold intolerance, and dry skin. TSH is 12.4 mIU/L (normal 0.4-4.0) and free T4 is 8 pmol/L (normal 12-22). What is the appropriate treatment?",
    o: ["Levothyroxine 1.6 mcg/kg/day, recheck TSH in 6-8 weeks", "Liothyronine (T3) monotherapy", "Propylthiouracil for 6 months", "Radioactive iodine ablation"],
    a: 0,
    r: "Primary hypothyroidism (elevated TSH, low free T4) is treated with levothyroxine as the standard of care. Dosing starts at approximately 1.6 mcg/kg/day in otherwise healthy adults. TSH should be rechecked in 6-8 weeks to allow steady-state levels. Liothyronine monotherapy is not recommended. Propylthiouracil and radioactive iodine are for hyperthyroidism, not hypothyroidism.",
    s: "Endocrine"
  },
  {
    q: "A 28-year-old female presents with weight loss, tremor, heat intolerance, palpitations, and diffuse goiter. TSH is less than 0.01 mIU/L and free T4 is 48 pmol/L. Thyroid-stimulating immunoglobulins are positive. She is not pregnant. What is the first-line treatment in Canada?",
    o: ["Methimazole with a beta-blocker for symptom control", "Radioactive iodine ablation as initial therapy", "Immediate total thyroidectomy", "Propylthiouracil for 18 months"],
    a: 0,
    r: "Graves disease in a young, non-pregnant patient is typically managed with antithyroid drugs (methimazole preferred over PTU due to lower hepatotoxicity risk) for 12-18 months. A beta-blocker (propranolol or atenolol) controls adrenergic symptoms. In Canada, antithyroid drugs are generally first-line. RAI is an alternative but causes permanent hypothyroidism. Surgery is reserved for large goiters, suspected malignancy, or drug intolerance. PTU is reserved for first-trimester pregnancy or thyroid storm.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old female presents with an incidental 1.8 cm thyroid nodule found on carotid ultrasound. TSH is normal. Ultrasound shows the nodule is hypoechoic with irregular margins and microcalcifications. What is the next step?",
    o: ["Fine-needle aspiration biopsy", "Repeat ultrasound in 12 months", "Total thyroidectomy", "Radioactive iodine scan"],
    a: 0,
    r: "A thyroid nodule with high-risk sonographic features (hypoechoic, irregular margins, microcalcifications, taller-than-wide) greater than 1 cm requires fine-needle aspiration for cytologic evaluation. Watchful waiting is inappropriate given the suspicious features. Total thyroidectomy without tissue diagnosis is premature. Radioiodine scan is indicated when TSH is low to evaluate for a functioning (hot) nodule, which is unlikely malignant.",
    s: "Endocrine"
  },
  {
    q: "A 65-year-old male with type 2 diabetes on metformin and gliclazide presents with confusion and diaphoresis. Capillary blood glucose is 2.4 mmol/L. After treatment with oral glucose, what medication adjustment should be made?",
    o: ["Reduce or discontinue gliclazide and reassess glycemic targets", "Increase metformin to compensate for gliclazide reduction", "Add insulin glargine and continue both oral agents", "Switch to repaglinide which has a shorter half-life"],
    a: 0,
    r: "Sulfonylurea-induced hypoglycemia (glucose less than 4.0 mmol/L with symptoms) in an elderly patient requires dose reduction or discontinuation of gliclazide. Sulfonylureas carry the highest hypoglycemia risk among oral agents. Increasing metformin does not cause hypoglycemia but does not address the sulfonylurea risk. Adding insulin without addressing the sulfonylurea increases hypoglycemia risk. Repaglinide still carries hypoglycemia risk.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old female with a BMI of 28 presents with irregular menses, hirsutism, and acne. Labs show elevated free testosterone, normal DHEA-S, and LH-to-FSH ratio of 3:1. Fasting glucose is 6.4 mmol/L. What is the most appropriate initial management?",
    o: ["Combined oral contraceptive pill and metformin with lifestyle modifications", "Spironolactone monotherapy", "Clomiphene citrate for ovulation induction", "Dexamethasone suppression for adrenal hyperandrogenism"],
    a: 0,
    r: "Polycystic ovary syndrome (PCOS) with hyperandrogenism, oligomenorrhea, and impaired fasting glucose is managed with combined OCP (suppresses ovarian androgen production, regulates cycles) and metformin (addresses insulin resistance and metabolic risk). Lifestyle modification for weight loss is essential. Spironolactone can be added for persistent hirsutism but is not used as monotherapy initially. Clomiphene is for fertility. Dexamethasone is for congenital adrenal hyperplasia, not PCOS.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male presents with episodic headaches, diaphoresis, and palpitations. BP during an episode is 220/130. A 24-hour urine collection shows elevated metanephrines and catecholamines. CT abdomen reveals a 4 cm right adrenal mass. What is the preoperative pharmacologic preparation?",
    o: ["Alpha-blocker (phenoxybenzamine) for at least 10-14 days before surgery, then add beta-blocker", "Beta-blocker (metoprolol) immediately followed by surgical resection", "ACE inhibitor and calcium channel blocker combination", "No preoperative medication; proceed directly to laparoscopic adrenalectomy"],
    a: 0,
    r: "Pheochromocytoma requires preoperative alpha-adrenergic blockade (phenoxybenzamine or doxazosin) for at least 10-14 days to prevent intraoperative hypertensive crisis. Beta-blockers are added only after adequate alpha-blockade to prevent unopposed alpha stimulation (worsening hypertension). ACE inhibitors do not adequately block catecholamine effects. Surgery without alpha-blockade risks life-threatening hypertensive crisis and arrhythmias.",
    s: "Endocrine"
  },
  {
    q: "A 62-year-old female on chronic prednisone 15 mg daily for rheumatoid arthritis develops a cushingoid appearance, hyperglycemia (fasting glucose 9.8 mmol/L), and osteopenia on DEXA scan. What management steps are most appropriate?",
    o: ["Taper prednisone to lowest effective dose, initiate bisphosphonate, and manage hyperglycemia", "Abruptly discontinue prednisone and start DMARD therapy only", "Continue prednisone and add metformin for glucose only", "Increase prednisone to suppress disease activity and prevent flares"],
    a: 0,
    r: "Iatrogenic Cushing syndrome from chronic glucocorticoids requires tapering to the lowest effective dose (never abrupt discontinuation due to adrenal suppression risk). Bisphosphonate therapy protects against glucocorticoid-induced osteoporosis. Hyperglycemia should be managed with appropriate agents. Abrupt discontinuation risks adrenal crisis. Addressing only glucose ignores bone loss. Increasing prednisone worsens all metabolic complications.",
    s: "Endocrine"
  },
  {
    q: "A 58-year-old male presents to the emergency department with altered mental status. Blood glucose is 38 mmol/L, serum osmolality is 340 mOsm/kg, and pH is 7.36. Ketones are trace. Sodium is 148 mmol/L. What is the priority treatment?",
    o: ["Aggressive IV normal saline resuscitation followed by insulin infusion", "IV insulin bolus 10 units immediately without fluid resuscitation", "Sodium bicarbonate infusion for acidosis correction", "Oral hypoglycemic agent and oral rehydration"],
    a: 0,
    r: "Hyperglycemic hyperosmolar state (HHS) presents with severe hyperglycemia, hyperosmolality, altered mentation, and minimal ketosis (pH above 7.30). The priority is aggressive IV fluid resuscitation (0.9% NaCl) to correct severe dehydration (average deficit 8-10 L) before insulin. Insulin without adequate fluid can cause cardiovascular collapse. Bicarbonate is not indicated as pH is normal. Oral agents are inappropriate in an acute life-threatening emergency.",
    s: "Endocrine"
  },

  // ===== GI & HEPATOLOGY (Questions 41-50) =====
  {
    q: "A 45-year-old male presents with epigastric pain that improves with eating, worse 2-3 hours after meals, and nocturnal symptoms. H. pylori stool antigen test is positive. He has no alarm features. What is the first-line treatment?",
    o: ["Triple therapy: PPI plus amoxicillin plus clarithromycin for 14 days", "PPI monotherapy for 8 weeks", "Bismuth quadruple therapy as initial treatment", "H2 receptor antagonist and antacid PRN"],
    a: 0,
    r: "H. pylori-positive peptic ulcer disease is treated with eradication therapy. First-line is standard triple therapy (PPI, amoxicillin 1000 mg BID, clarithromycin 500 mg BID) for 14 days, provided local clarithromycin resistance is below 15%. PPI monotherapy does not eradicate H. pylori. Bismuth quadruple therapy is first-line in areas with high clarithromycin resistance or as second-line after triple therapy failure. H2RA alone is insufficient.",
    s: "GI"
  },
  {
    q: "A 52-year-old female with chronic heartburn for 10 years undergoes upper endoscopy showing salmon-colored mucosa extending 4 cm above the gastroesophageal junction. Biopsy confirms intestinal metaplasia without dysplasia. What is the recommended management?",
    o: ["Lifelong PPI therapy and surveillance endoscopy every 3-5 years", "Nissen fundoplication immediately", "Discontinue PPI and use antacids only", "Endoscopic mucosal resection of the metaplastic segment"],
    a: 0,
    r: "Barrett esophagus (intestinal metaplasia of the esophagus) without dysplasia requires long-term PPI therapy to reduce acid exposure and surveillance endoscopy every 3-5 years to monitor for dysplastic progression. Fundoplication does not eliminate surveillance needs. Discontinuing acid suppression increases progression risk. Endoscopic resection is indicated for dysplasia or early adenocarcinoma, not non-dysplastic Barrett.",
    s: "GI"
  },
  {
    q: "A 38-year-old female presents with bloody diarrhea, tenesmus, and crampy abdominal pain for 6 weeks. Colonoscopy shows continuous inflammation from the rectum extending to the splenic flexure with loss of haustra. Biopsy shows crypt abscesses. What is the first-line induction therapy?",
    o: ["Oral and topical (rectal) 5-aminosalicylic acid (mesalamine)", "Oral prednisone 60 mg daily", "Infliximab infusion", "Methotrexate weekly"],
    a: 0,
    r: "Left-sided ulcerative colitis (continuous inflammation from rectum to splenic flexure) of moderate severity is initially treated with combined oral and topical (rectal) 5-ASA (mesalamine) for induction. This combination is more effective than either route alone. Corticosteroids are for moderate-severe disease unresponsive to 5-ASA. Biologics are for steroid-dependent or steroid-refractory disease. Methotrexate has limited evidence in UC compared to Crohn disease.",
    s: "GI"
  },
  {
    q: "A 55-year-old male with a history of alcohol use disorder presents with ascites, jaundice, and spider angiomata. Labs show albumin 24 g/L, INR 1.8, total bilirubin 68 umol/L, and platelet count 78 x 10^9/L. Abdominal ultrasound confirms cirrhosis with portal hypertension. What is the MELD score component being calculated to guide management priority?",
    o: ["Bilirubin, INR, and creatinine to determine transplant listing priority", "Albumin, ascites grade, and encephalopathy severity", "Platelet count, portal vein diameter, and spleen size", "AST-to-ALT ratio and alkaline phosphatase"],
    a: 0,
    r: "The MELD (Model for End-Stage Liver Disease) score uses serum bilirubin, INR, and creatinine to predict 90-day mortality in cirrhosis and prioritize liver transplant listing. The Child-Pugh score uses albumin, bilirubin, INR, ascites, and encephalopathy. Platelet count and portal vein measurements assess portal hypertension severity but are not MELD components. AST/ALT ratio helps distinguish alcoholic from non-alcoholic liver disease.",
    s: "GI"
  },
  {
    q: "A 48-year-old female presents with right upper quadrant pain, fever of 38.6 degrees Celsius, and jaundice. Ultrasound shows a dilated common bile duct at 12 mm with a distal stone. WBC is 18.2 x 10^9/L and total bilirubin is 85 umol/L. What is the diagnosis and priority management?",
    o: ["Ascending cholangitis requiring IV antibiotics and urgent ERCP", "Acute cholecystitis requiring emergent cholecystectomy", "Biliary colic managed with analgesics and elective cholecystectomy", "Hepatitis requiring supportive care and monitoring"],
    a: 0,
    r: "Charcot triad (RUQ pain, fever, jaundice) with a dilated CBD, distal stone, leukocytosis, and hyperbilirubinemia is diagnostic of ascending cholangitis. This is a biliary emergency requiring IV antibiotics (to cover gram-negative and anaerobic organisms) and urgent biliary drainage via ERCP. Cholecystitis does not typically present with jaundice. Biliary colic is episodic without fever. Hepatitis does not cause biliary dilation with stones.",
    s: "GI"
  },
  {
    q: "A 60-year-old male with compensated cirrhosis undergoes screening endoscopy showing medium-sized esophageal varices with no red wale marks. He has never had variceal bleeding. What is the appropriate primary prophylaxis?",
    o: ["Non-selective beta-blocker (nadolol or propranolol)", "Endoscopic variceal band ligation immediately", "Transjugular intrahepatic portosystemic shunt (TIPS)", "Octreotide infusion prophylactically"],
    a: 0,
    r: "Primary prophylaxis of esophageal variceal bleeding in medium to large varices uses non-selective beta-blockers (nadolol, propranolol) or endoscopic band ligation. Beta-blockers are first-line for primary prophylaxis as they are non-invasive and reduce portal pressure. Band ligation is an alternative if beta-blockers are contraindicated or not tolerated. TIPS is for refractory variceal bleeding, not primary prophylaxis. Octreotide is for acute variceal hemorrhage.",
    s: "GI"
  },
  {
    q: "A 35-year-old female with Crohn disease affecting the terminal ileum presents with a perianal fistula, weight loss, and diarrhea despite 6-mercaptopurine therapy. CRP is 28 mg/L. What is the most appropriate escalation therapy?",
    o: ["Anti-TNF biologic (infliximab) with concurrent immunomodulator", "Increase 6-mercaptopurine dose to maximum", "Oral budesonide 9 mg daily", "Surgical resection of the terminal ileum"],
    a: 0,
    r: "Crohn disease with perianal fistula and active luminal disease despite immunomodulator therapy requires escalation to biologic therapy. Infliximab has the strongest evidence for both fistulizing and luminal Crohn disease. Combination therapy with an immunomodulator reduces anti-drug antibody formation. Increasing 6-MP alone is unlikely to achieve adequate response. Budesonide is for mild ileal disease and does not treat fistulas. Surgery is reserved for complications unresponsive to medical therapy.",
    s: "GI"
  },
  {
    q: "A 50-year-old female with no significant past medical history presents with painless jaundice, dark urine, clay-colored stools, and a 7 kg weight loss over 3 months. CT abdomen shows a 3 cm mass in the head of the pancreas with no vascular invasion. What is the next management step?",
    o: ["Refer for surgical evaluation for Whipple procedure (pancreaticoduodenectomy)", "Start palliative chemotherapy", "Endoscopic ultrasound with fine-needle aspiration for tissue diagnosis", "Observe and repeat CT in 3 months"],
    a: 0,
    r: "A pancreatic head mass with obstructive jaundice and weight loss in a resectable patient (no vascular invasion, no metastases) should be referred for surgical evaluation. Whipple procedure offers the only chance for cure. While EUS-FNA can provide tissue diagnosis, in clearly resectable disease, surgery should not be delayed for biopsy. Palliative chemo is for unresectable or metastatic disease. Observation delays potentially curative intervention.",
    s: "GI"
  },
  {
    q: "A 42-year-old male presents with chronic watery diarrhea, bloating, and iron deficiency anemia. He reports no weight loss. Anti-tissue transglutaminase (anti-tTG) IgA is strongly positive. Total IgA level is normal. What is the next diagnostic step?",
    o: ["Upper endoscopy with duodenal biopsies", "Start a gluten-free diet immediately without biopsy", "Colonoscopy with random biopsies", "Hydrogen breath test for lactose intolerance"],
    a: 0,
    r: "Strongly positive anti-tTG IgA with normal total IgA is highly suggestive of celiac disease, but histologic confirmation with duodenal biopsy (showing villous atrophy, crypt hyperplasia, and intraepithelial lymphocytosis) is required before initiating a lifelong gluten-free diet. Starting the diet before biopsy can cause histologic normalization, making diagnosis impossible. Colonoscopy does not evaluate the duodenum. Hydrogen breath test is for carbohydrate malabsorption.",
    s: "GI"
  },
  {
    q: "A 55-year-old male with metabolic syndrome (BMI 32, fasting glucose 6.8 mmol/L, triglycerides 3.2 mmol/L) has elevated ALT at 78 U/L and AST at 52 U/L. Hepatitis B and C serologies are negative. Alcohol intake is minimal. Abdominal ultrasound shows hepatic steatosis. What is the most appropriate management?",
    o: ["Structured weight loss program targeting 7-10% body weight reduction with lifestyle modifications", "Start ursodeoxycholic acid for liver protection", "Liver biopsy immediately to stage fibrosis", "Prescribe metformin specifically for liver disease"],
    a: 0,
    r: "Non-alcoholic fatty liver disease (NAFLD/MASLD) with metabolic syndrome is primarily managed with lifestyle modifications targeting 7-10% weight loss, which has been shown to improve hepatic steatosis, inflammation, and even fibrosis. Ursodeoxycholic acid has no proven benefit in NAFLD. Liver biopsy is reserved for patients with high fibrosis risk scores (FIB-4, NAFLD fibrosis score). Metformin improves insulin resistance but does not specifically improve liver histology.",
    s: "GI"
  },

  // ===== RENAL & ELECTROLYTE CORRECTION (Questions 51-60) =====
  {
    q: "A 68-year-old male with type 2 diabetes presents with eGFR 38 mL/min/1.73m2, urine albumin-to-creatinine ratio of 45 mg/mmol, potassium 4.6 mmol/L, and BP 142/88. Current medications include metformin 1000 mg BID. What medication adjustments are most appropriate?",
    o: ["Add an ACE inhibitor, reduce metformin dose per renal function, and add an SGLT2 inhibitor", "Discontinue metformin entirely and start insulin", "Add amlodipine only for blood pressure control", "No changes needed; continue current management"],
    a: 0,
    r: "CKD stage 3b (eGFR 30-44) with significant albuminuria and diabetes requires ACE inhibitor or ARB for renoprotection and BP control (target less than 130/80). SGLT2 inhibitors (dapagliflozin, canagliflozin) have shown renal and cardiovascular benefits in CKD. Metformin dose should be reduced (maximum 1000 mg/day) at eGFR 30-44 but not discontinued. Amlodipine alone does not address proteinuria. Current management is suboptimal.",
    s: "Renal"
  },
  {
    q: "A 72-year-old female presents with fatigue, nausea, and confusion. Sodium is 118 mmol/L, serum osmolality is 255 mOsm/kg, urine osmolality is 580 mOsm/kg, and urine sodium is 45 mmol/L. She is clinically euvolemic. TSH and cortisol are normal. What is the most appropriate initial management?",
    o: ["Fluid restriction to 1000-1200 mL/day", "IV 3% hypertonic saline bolus 150 mL over 20 minutes", "IV normal saline 500 mL/hr", "Oral salt tablets 3 g three times daily"],
    a: 0,
    r: "Euvolemic hyponatremia with concentrated urine and elevated urine sodium, after excluding hypothyroidism and adrenal insufficiency, is consistent with SIADH. Initial management is fluid restriction (1000-1200 mL/day). Hypertonic saline is reserved for severe symptomatic hyponatremia (seizures, severe confusion). Normal saline can worsen SIADH-related hyponatremia. Salt tablets may be adjunctive but fluid restriction is the primary intervention.",
    s: "Renal"
  },
  {
    q: "A 55-year-old male on lisinopril and spironolactone presents with muscle weakness and palpitations. ECG shows peaked T waves, widened QRS, and absent P waves. Potassium is 7.2 mmol/L. What is the immediate priority intervention?",
    o: ["IV calcium gluconate 10% to stabilize the myocardium", "IV regular insulin with dextrose", "Oral sodium polystyrene sulfonate (Kayexalate)", "IV sodium bicarbonate"],
    a: 0,
    r: "Severe hyperkalemia (potassium above 6.5 mmol/L) with ECG changes (peaked T waves, widened QRS, absent P waves) is a cardiac emergency. IV calcium gluconate is the immediate priority to stabilize the cardiac membrane and prevent arrhythmias. It does not lower potassium but provides cardioprotection within minutes. Insulin-dextrose shifts potassium intracellularly but takes 15-30 minutes. Kayexalate and bicarbonate are slower-acting. All may be needed but calcium is always first.",
    s: "Renal"
  },
  {
    q: "A 45-year-old female post-thyroidectomy develops perioral tingling, carpopedal spasm, and positive Chvostek sign. Total calcium is 1.72 mmol/L (normal 2.10-2.55) and albumin is 38 g/L. What is the immediate treatment?",
    o: ["IV calcium gluconate 10% slow infusion with cardiac monitoring", "Oral calcium carbonate 500 mg three times daily", "IV magnesium sulfate 2 g", "Calcitriol 0.5 mcg daily only"],
    a: 0,
    r: "Symptomatic hypocalcemia (perioral tingling, carpopedal spasm, positive Chvostek and Trousseau signs) post-thyroidectomy (likely due to hypoparathyroidism) requires urgent IV calcium gluconate with cardiac monitoring. Severe hypocalcemia can cause laryngospasm, seizures, and cardiac arrhythmias. Oral calcium is for maintenance therapy. IV magnesium should be checked and corrected as hypomagnesemia impairs PTH function, but calcium is the immediate priority. Calcitriol is for long-term management.",
    s: "Renal"
  },
  {
    q: "A 60-year-old male with CKD stage 4 (eGFR 22 mL/min/1.73m2) presents with phosphate of 2.1 mmol/L (normal 0.8-1.5), calcium of 2.02 mmol/L, and PTH of 28 pmol/L (elevated). What is the most appropriate management?",
    o: ["Dietary phosphate restriction, phosphate binder with meals, and calcitriol supplementation", "Calcium carbonate supplementation only", "Increase dietary protein intake for nutrition", "Cinacalcet as sole therapy"],
    a: 0,
    r: "CKD-mineral bone disorder with hyperphosphatemia, secondary hyperparathyroidism, and hypocalcemia requires a multi-pronged approach: dietary phosphate restriction (800-1000 mg/day), phosphate binders taken with meals (calcium-based or non-calcium-based), and active vitamin D (calcitriol) to suppress PTH and improve calcium absorption. Calcium supplementation alone does not address phosphate. Increased protein increases phosphate load. Cinacalcet is for tertiary hyperparathyroidism or dialysis patients.",
    s: "Renal"
  },
  {
    q: "A 30-year-old female presents with recurrent kidney stones. A 24-hour urine collection shows hypercalciuria (8.5 mmol/day), normal uric acid, and low urine citrate. Serum calcium is 2.38 mmol/L (normal). Stone analysis shows calcium oxalate. What is the most appropriate pharmacologic prevention?",
    o: ["Hydrochlorothiazide to reduce urinary calcium excretion", "Allopurinol for uric acid reduction", "Potassium citrate supplementation only", "Tamsulosin for stone passage"],
    a: 0,
    r: "Recurrent calcium oxalate stones with hypercalciuria and normal serum calcium (absorptive hypercalciuria) are best managed with thiazide diuretics (hydrochlorothiazide, indapamide), which reduce urinary calcium excretion by enhancing renal calcium reabsorption. Potassium citrate is also beneficial for low urine citrate and can be added. Allopurinol is for hyperuricosuric calcium stones. Tamsulosin facilitates acute stone passage but does not prevent recurrence.",
    s: "Renal"
  },
  {
    q: "A 75-year-old male with heart failure and CKD (eGFR 35 mL/min/1.73m2) presents with worsening lower extremity edema despite furosemide 80 mg BID. Creatinine has risen from 168 to 195 umol/L. Weight has increased 4 kg in 2 weeks. What is the most appropriate diuretic strategy?",
    o: ["Add metolazone 2.5-5 mg 30 minutes before furosemide for sequential nephron blockade", "Switch furosemide to hydrochlorothiazide 25 mg daily", "Double furosemide to 160 mg BID", "Discontinue diuretics due to rising creatinine"],
    a: 0,
    r: "Diuretic resistance in cardiorenal syndrome is managed with sequential nephron blockade: adding a thiazide-type diuretic (metolazone) to the loop diuretic. Metolazone blocks sodium reabsorption in the distal tubule, overcoming the compensatory sodium retention that occurs with chronic loop diuretic use. Switching to hydrochlorothiazide alone is less potent than furosemide in CKD. Simply doubling the loop diuretic may be less effective than combination therapy. Discontinuing diuretics worsens volume overload.",
    s: "Renal"
  },
  {
    q: "A 22-year-old male presents with cola-colored urine, periorbital edema, and hypertension (148/96) 10 days after a streptococcal pharyngitis. Urinalysis shows RBC casts and proteinuria. Creatinine is 142 umol/L and C3 complement is low. What is the most likely diagnosis and management?",
    o: ["Post-streptococcal glomerulonephritis with supportive care including sodium restriction and antihypertensives", "IgA nephropathy requiring corticosteroids immediately", "Minimal change disease requiring high-dose prednisone", "Nephrotic syndrome requiring ACE inhibitor and statin"],
    a: 0,
    r: "Post-streptococcal glomerulonephritis (PSGN) presents 1-3 weeks after streptococcal infection with nephritic syndrome (hematuria with RBC casts, proteinuria, hypertension, edema) and low C3. Management is supportive: sodium and fluid restriction, antihypertensives (ACE inhibitor or calcium channel blocker), and loop diuretics for edema. PSGN is self-limiting in most cases. IgA nephropathy presents with synpharyngitic hematuria (during infection). Minimal change disease causes nephrotic syndrome in children.",
    s: "Renal"
  },
  {
    q: "A 65-year-old female with newly diagnosed stage 3a CKD (eGFR 52 mL/min/1.73m2) is found to have hemoglobin of 98 g/L, ferritin of 85 mcg/L, and transferrin saturation of 18%. What is the most appropriate initial management of the anemia?",
    o: ["IV iron supplementation to achieve ferritin above 200 mcg/L and TSAT above 20% before considering ESA", "Start erythropoiesis-stimulating agent (ESA) immediately", "Blood transfusion for hemoglobin below 100 g/L", "Oral iron sulfate 300 mg three times daily"],
    a: 0,
    r: "Anemia of CKD with functional iron deficiency (ferritin less than 200 and TSAT less than 20%) should first be treated with iron supplementation. IV iron is preferred over oral in CKD due to better absorption and fewer GI side effects. ESAs should only be started after iron stores are replete, as iron deficiency causes ESA resistance. Transfusion is reserved for symptomatic severe anemia. Oral iron has poor bioavailability in CKD.",
    s: "Renal"
  },
  {
    q: "A 48-year-old female presents with sudden onset of flank pain and gross hematuria. CT KUB shows a 7 mm stone in the left ureterovesical junction. She is afebrile and has no signs of obstruction. Pain is controlled with ketorolac. What is the appropriate management?",
    o: ["Medical expulsive therapy with tamsulosin and analgesics with follow-up imaging in 2-4 weeks", "Emergency ureteroscopy for immediate stone extraction", "Extracorporeal shock wave lithotripsy within 24 hours", "Percutaneous nephrostomy tube placement"],
    a: 0,
    r: "Ureteral stones 5-10 mm at the ureterovesical junction in a stable, afebrile patient with controlled pain can be managed with medical expulsive therapy (tamsulosin relaxes ureteral smooth muscle, improving passage rates). Follow-up imaging in 2-4 weeks assesses stone passage. Urgent intervention is needed for infection, intractable pain, obstruction with AKI, or solitary kidney. ESWL and ureteroscopy are for stones that fail to pass. Nephrostomy is for obstructive emergencies.",
    s: "Renal"
  },

  // ===== DERMATOLOGY DIAGNOSIS & TREATMENT (Questions 61-70) =====
  {
    q: "A 25-year-old female presents with an enlarging, irregularly bordered, multicolored mole on her left calf. It is 8 mm in diameter and has been changing over 3 months. She has a family history of melanoma. What is the most appropriate management?",
    o: ["Excisional biopsy of the entire lesion with 1-3 mm margins", "Shave biopsy of the darkest area", "Cryotherapy with liquid nitrogen", "Topical fluorouracil application for 4 weeks"],
    a: 0,
    r: "A pigmented lesion meeting ABCDE criteria (Asymmetry, Border irregularity, Color variation, Diameter greater than 6 mm, Evolution) requires excisional biopsy with narrow margins (1-3 mm) for complete histopathologic evaluation. Shave biopsy may not provide accurate depth measurement (Breslow thickness) critical for staging. Cryotherapy and topical agents are inappropriate and risk destroying tissue needed for diagnosis. Family history of melanoma increases suspicion further.",
    s: "Dermatology"
  },
  {
    q: "A 40-year-old male presents with well-demarcated, salmon-pink plaques with silvery-white scale on the elbows, knees, and scalp covering approximately 12% body surface area. He reports joint stiffness in his fingers. What is the most appropriate initial systemic therapy?",
    o: ["Methotrexate with folic acid supplementation", "Topical betamethasone only", "Oral prednisone taper", "Phototherapy with UVB alone"],
    a: 0,
    r: "Moderate-to-severe plaque psoriasis (BSA above 10%) with concurrent psoriatic arthritis symptoms warrants systemic therapy. Methotrexate is a first-line systemic agent that treats both skin and joint disease. Topical corticosteroids alone are insufficient for moderate-severe disease. Oral prednisone can cause rebound flares upon discontinuation. UVB phototherapy addresses skin but not joint disease. Folic acid supplementation reduces methotrexate side effects.",
    s: "Dermatology"
  },
  {
    q: "A 6-month-old infant presents with erythematous, weeping, crusted lesions on the cheeks and extensor surfaces of the arms. The parents report the infant is frequently scratching. Family history is positive for asthma. What is the most appropriate initial management?",
    o: ["Low-potency topical corticosteroid and liberal emollient application", "Oral antihistamine and topical antifungal", "Medium-potency topical corticosteroid on the face", "Systemic corticosteroid course for 2 weeks"],
    a: 0,
    r: "Atopic dermatitis in infants presents with erythematous, weeping, crusted lesions on the face and extensor surfaces. First-line management includes low-potency topical corticosteroids (hydrocortisone 1%) for facial and body lesions and liberal emollient application to restore the skin barrier. Medium-to-high-potency steroids should be avoided on the face due to atrophy risk. Systemic steroids are rarely indicated in pediatric eczema. Antifungals are not appropriate for eczema.",
    s: "Dermatology"
  },
  {
    q: "A 55-year-old female presents with a pearly, dome-shaped nodule with visible telangiectasias on the nose. It has slowly enlarged over 1 year and occasionally bleeds. What is the most appropriate management?",
    o: ["Surgical excision with clear margins or Mohs micrographic surgery", "Observation and reassess in 6 months", "Topical imiquimod 5% cream for 6 weeks", "Cryotherapy with liquid nitrogen"],
    a: 0,
    r: "A pearly nodule with telangiectasia on the nose is highly suspicious for nodular basal cell carcinoma. On the nose (high-risk site), Mohs micrographic surgery provides the highest cure rate with tissue-sparing. Standard surgical excision with margin assessment is also appropriate. Observation delays treatment of a malignancy. Topical imiquimod is only for superficial BCC. Cryotherapy does not allow margin assessment and has higher recurrence rates, especially on the nose.",
    s: "Dermatology"
  },
  {
    q: "A 30-year-old male presents with a 2-week history of a herald patch on the trunk followed by diffuse oval, salmon-colored papules along the skin cleavage lines in a Christmas-tree pattern. He is otherwise asymptomatic. What is the most appropriate management?",
    o: ["Reassurance that pityriasis rosea is self-limiting and will resolve in 6-8 weeks", "Oral terbinafine for tinea corporis", "Skin biopsy to rule out secondary syphilis", "Topical mupirocin for bacterial infection"],
    a: 0,
    r: "Pityriasis rosea presents classically with a herald patch followed by diffuse oval papules in a Christmas-tree distribution along Langer lines. It is self-limiting, resolving in 6-8 weeks. However, if the patient is sexually active, RPR/VDRL should be considered to exclude secondary syphilis, which can mimic pityriasis rosea. Terbinafine is for fungal infections. Mupirocin is for bacterial skin infections.",
    s: "Dermatology"
  },
  {
    q: "A 22-year-old female presents with moderate inflammatory acne vulgaris with comedones, papules, and pustules on the face, chest, and back. She has tried benzoyl peroxide and topical retinoid for 3 months without improvement. She is on combined oral contraceptive. What is the next step in treatment?",
    o: ["Add oral antibiotic therapy (doxycycline or minocycline) for 3 months", "Start isotretinoin immediately", "Switch to a topical antibiotic monotherapy", "Discontinue current topical therapy and use salicylic acid wash only"],
    a: 0,
    r: "Moderate inflammatory acne unresponsive to topical combination therapy (retinoid plus benzoyl peroxide) warrants addition of oral antibiotics (doxycycline or minocycline preferred). Tetracyclines should be limited to 3-4 months to reduce resistance and used with topical retinoid and benzoyl peroxide. Isotretinoin is for severe nodulocystic acne or treatment-resistant disease. Topical antibiotic monotherapy promotes resistance. Salicylic acid alone is insufficient for inflammatory acne.",
    s: "Dermatology"
  },
  {
    q: "A 65-year-old male presents with a rapidly growing, firm, dome-shaped nodule with central keratin plug on the forearm. It has grown from 5 mm to 2 cm in 6 weeks. What is the most important consideration?",
    o: ["Excisional biopsy to differentiate keratoacanthoma from squamous cell carcinoma", "Clinical diagnosis of keratoacanthoma with observation for spontaneous resolution", "Cryotherapy and follow-up in 3 months", "Topical 5-fluorouracil cream for 4 weeks"],
    a: 0,
    r: "Rapidly growing dome-shaped nodule with central keratin plug on sun-exposed skin can be keratoacanthoma or well-differentiated squamous cell carcinoma. These entities are histologically difficult to distinguish, and keratoacanthoma is considered a variant of SCC by many pathologists. Excisional biopsy is required for definitive diagnosis. Observation risks allowing a potentially invasive SCC to progress. Cryotherapy and topical treatments do not provide tissue for diagnosis.",
    s: "Dermatology"
  },
  {
    q: "A 35-year-old female presents with a painful, tender, erythematous nodule on the anterior shin. She has had 3 similar episodes in the past year. She also reports joint pain and diarrhea. Biopsy shows septal panniculitis. What underlying condition should be investigated?",
    o: ["Inflammatory bowel disease (Crohn disease or ulcerative colitis)", "Systemic lupus erythematosus", "Deep vein thrombosis", "Cellulitis requiring IV antibiotics"],
    a: 0,
    r: "Erythema nodosum (painful pretibial nodules with septal panniculitis) is associated with multiple systemic conditions including inflammatory bowel disease, sarcoidosis, streptococcal infection, medications, and pregnancy. The combination of erythema nodosum with joint pain and diarrhea strongly suggests IBD. SLE causes different skin manifestations. DVT presents differently. Erythema nodosum is not infectious and does not respond to antibiotics.",
    s: "Dermatology"
  },
  {
    q: "A 50-year-old male with diabetes presents with a warm, erythematous, sharply demarcated area of swelling on the right lower leg with advancing borders. Temperature is 38.4 degrees Celsius and WBC is 14.5 x 10^9/L. What is the first-line antibiotic treatment?",
    o: ["IV cephalexin or cefazolin targeting Group A Streptococcus", "Oral metronidazole for anaerobic coverage", "Topical mupirocin and elevation only", "IV vancomycin for empiric MRSA coverage"],
    a: 0,
    r: "Cellulitis (warm, erythematous, sharply demarcated with advancing borders and systemic symptoms) is most commonly caused by Group A Streptococcus or Staphylococcus aureus. First-line treatment is a beta-lactam antibiotic (cephalexin oral or cefazolin IV depending on severity). Metronidazole does not cover the typical pathogens. Topical therapy alone is insufficient for cellulitis with systemic signs. Vancomycin is reserved for suspected MRSA (purulent cellulitis, abscess, or MRSA risk factors).",
    s: "Dermatology"
  },
  {
    q: "A 28-year-old female presents with a targetoid (bull's-eye) rash on her thigh that has expanded to 8 cm over 5 days. She recalls a tick bite in that area 10 days ago. She is otherwise well with no systemic symptoms. What is the appropriate treatment?",
    o: ["Doxycycline 100 mg BID for 14-21 days", "Observation and serologic testing in 6 weeks", "IV ceftriaxone for 28 days", "Topical mupirocin to the bite site"],
    a: 0,
    r: "Erythema migrans (expanding targetoid rash after tick bite) is diagnostic of early localized Lyme disease and requires treatment without waiting for serologic confirmation (serology may be negative early). Doxycycline is first-line for adults. Alternative is amoxicillin for pregnant women or children under 8. Observation delays treatment and risks disseminated disease. IV ceftriaxone is for late Lyme disease or neurologic involvement. Topical antibiotics do not treat systemic Borrelia infection.",
    s: "Dermatology"
  },

  // ===== INFECTIOUS DISEASE MANAGEMENT (Questions 71-80) =====
  {
    q: "A 30-year-old male presents with fever, night sweats, weight loss, and a productive cough for 3 weeks. He recently immigrated from a TB-endemic country. Chest X-ray shows right upper lobe cavitary lesion. What is the initial diagnostic and management approach?",
    o: ["Airborne isolation, collect 3 sputum specimens for AFB smear and culture, and start RIPE therapy", "Start azithromycin for community-acquired pneumonia and follow up in 1 week", "Obtain a tuberculin skin test and wait for results before treatment", "CT chest with contrast before any treatment decisions"],
    a: 0,
    r: "Cavitary upper lobe lesion with constitutional symptoms in a patient from a TB-endemic country is presumptive active pulmonary tuberculosis. Immediate airborne isolation is required. Three sputum specimens (including one early morning) for AFB smear and mycobacterial culture should be collected. Empiric RIPE therapy (rifampin, isoniazid, pyrazinamide, ethambutol) is started without waiting for culture results. TST/IGRA cannot distinguish active from latent TB. Delaying treatment risks transmission.",
    s: "Infectious Disease"
  },
  {
    q: "A 35-year-old female presents with dysuria, urinary frequency, and suprapubic discomfort for 2 days. She is afebrile with no flank pain. Urine dipstick is positive for leukocyte esterase and nitrites. She has no drug allergies and is not pregnant. What is the first-line empiric treatment?",
    o: ["Nitrofurantoin 100 mg BID for 5 days", "Ciprofloxacin 500 mg BID for 7 days", "Amoxicillin-clavulanate 875 mg BID for 10 days", "Single-dose fosfomycin 3 g"],
    a: 0,
    r: "Uncomplicated cystitis in a non-pregnant woman is treated with first-line agents: nitrofurantoin (5 days) or trimethoprim-sulfamethoxazole (3 days). Fluoroquinolones should be reserved for complicated UTIs due to resistance concerns and serious adverse effects. Amoxicillin-clavulanate has higher resistance rates and is not first-line. Single-dose fosfomycin is an alternative but has lower efficacy than nitrofurantoin for E. coli.",
    s: "Infectious Disease"
  },
  {
    q: "A 68-year-old male presents with fever of 39.2 degrees Celsius, productive cough with rusty sputum, and right lower lobe consolidation on chest X-ray. He has COPD and takes prednisone 5 mg daily. CURB-65 score is 3. What is the appropriate management?",
    o: ["Hospital admission with IV ceftriaxone plus azithromycin", "Outpatient oral amoxicillin for 7 days", "Outpatient oral levofloxacin monotherapy", "ICU admission with IV piperacillin-tazobactam and vancomycin"],
    a: 0,
    r: "Community-acquired pneumonia with CURB-65 score of 3 (Confusion, Urea, Respiratory rate, Blood pressure, age 65+) indicates severe disease requiring hospital admission. Standard inpatient therapy is a beta-lactam (ceftriaxone) plus a macrolide (azithromycin) for atypical coverage. Outpatient therapy is inappropriate at this severity. Respiratory fluoroquinolone monotherapy is an alternative but combination therapy is preferred. ICU-level broad-spectrum coverage is for septic shock or requiring ventilatory support.",
    s: "Infectious Disease"
  },
  {
    q: "A 25-year-old sexually active female presents with purulent vaginal discharge, cervical motion tenderness, and lower abdominal pain. Temperature is 38.1 degrees Celsius. Pregnancy test is negative. NAAT for N. gonorrhoeae and C. trachomatis are pending. What empiric treatment should be initiated?",
    o: ["IM ceftriaxone 500 mg single dose plus oral doxycycline 100 mg BID for 14 days plus oral metronidazole 500 mg BID for 14 days", "Oral azithromycin 1 g single dose only", "IV ampicillin-sulbactam and admission", "Wait for NAAT results before initiating treatment"],
    a: 0,
    r: "Pelvic inflammatory disease (PID) requires empiric treatment covering N. gonorrhoeae, C. trachomatis, and anaerobes without waiting for test results. Outpatient treatment for mild-moderate PID includes IM ceftriaxone (for gonorrhea), oral doxycycline (for chlamydia), and oral metronidazole (for anaerobes). Azithromycin alone is insufficient. IV therapy with admission is for severe PID with tubo-ovarian abscess or sepsis. Delaying treatment increases the risk of infertility and chronic pain.",
    s: "Infectious Disease"
  },
  {
    q: "A 45-year-old male with HIV (CD4 count 180 cells/mm3, viral load 85,000 copies/mL) presents for initial antiretroviral therapy. He has no active opportunistic infections. HLA-B*5701 testing is negative. Hepatitis B surface antigen is positive. What is the most appropriate initial ART regimen?",
    o: ["Tenofovir disoproxil fumarate/emtricitabine plus dolutegravir", "Abacavir/lamivudine plus efavirenz", "Zidovudine/lamivudine plus nevirapine", "Start PCP prophylaxis only and defer ART until CD4 is below 100"],
    a: 0,
    r: "HIV with hepatitis B co-infection requires an ART backbone containing tenofovir plus emtricitabine (or lamivudine), which are active against both HIV and HBV. Dolutegravir is the preferred integrase inhibitor. Abacavir requires negative HLA-B*5701 (which this patient has) but does not cover HBV. Zidovudine-based regimens have more side effects. ART should never be deferred; early initiation improves outcomes. PCP prophylaxis (TMP-SMX) is needed at CD4 below 200 but does not replace ART.",
    s: "Infectious Disease"
  },
  {
    q: "A 72-year-old nursing home resident develops watery diarrhea (6 episodes per day), abdominal cramping, and low-grade fever after a 10-day course of clindamycin. WBC is 22.4 x 10^9/L. Stool PCR for Clostridioides difficile toxin is positive. What is the first-line treatment?",
    o: ["Oral vancomycin 125 mg four times daily for 10-14 days", "Oral metronidazole 500 mg three times daily for 10 days", "IV vancomycin 1 g every 12 hours", "Loperamide to control diarrhea and continue clindamycin"],
    a: 0,
    r: "Clostridioides difficile infection (CDI) is treated with oral vancomycin (or fidaxomicin) as first-line per current IDSA guidelines. Oral metronidazole is no longer recommended as first-line due to inferior cure rates. IV vancomycin does not reach adequate intraluminal concentrations. Loperamide is contraindicated as it inhibits toxin clearance and may cause toxic megacolon. The offending antibiotic (clindamycin) should be discontinued if possible.",
    s: "Infectious Disease"
  },
  {
    q: "A 55-year-old male with a prosthetic aortic valve presents with fever, malaise, and a new regurgitant murmur. Blood cultures (2 of 2 sets) grow Staphylococcus aureus. Transesophageal echocardiogram shows a 1.5 cm vegetation on the prosthetic valve with paravalvular abscess. What is the most appropriate management?",
    o: ["IV nafcillin (or vancomycin if MRSA) plus surgical consultation for valve replacement", "Oral cephalexin for 6 weeks as outpatient", "IV gentamicin monotherapy for synergy", "Repeat blood cultures in 2 weeks before deciding on treatment"],
    a: 0,
    r: "Prosthetic valve endocarditis with S. aureus, large vegetation, and paravalvular abscess is an indication for urgent surgical valve replacement plus prolonged IV antibiotic therapy (nafcillin for MSSA or vancomycin for MRSA, typically 6 weeks). Oral antibiotics are inadequate for endocarditis. Gentamicin alone is insufficient and nephrotoxic. Delaying treatment risks embolization, heart failure, and death. Surgical indications include paravalvular abscess, heart failure, persistent bacteremia, and large vegetations.",
    s: "Infectious Disease"
  },
  {
    q: "A 40-year-old male presents with a painless genital ulcer for 1 week. He has had unprotected sexual contact with a new partner. Examination shows a single, clean-based, indurated, non-tender ulcer on the penile shaft. Inguinal lymph nodes are bilaterally enlarged and non-tender. What is the diagnosis and treatment?",
    o: ["Primary syphilis; IM benzathine penicillin G 2.4 million units single dose", "Genital herpes; oral valacyclovir for 10 days", "Chancroid; oral azithromycin 1 g single dose", "Lymphogranuloma venereum; doxycycline 100 mg BID for 21 days"],
    a: 0,
    r: "A single painless, clean-based, indurated ulcer (chancre) with bilateral non-tender lymphadenopathy is classic for primary syphilis. Treatment is IM benzathine penicillin G 2.4 million units single dose. Genital herpes causes painful vesicles and ulcers. Chancroid causes painful purulent ulcers with tender suppurative lymphadenopathy. LGV begins with a painless papule or ulcer but progresses to painful inguinal lymphadenopathy (buboes). Partners should be tested and treated.",
    s: "Infectious Disease"
  },
  {
    q: "A 60-year-old female undergoing chemotherapy for breast cancer presents with fever of 38.8 degrees Celsius and ANC of 0.3 x 10^9/L. She is hemodynamically stable. What is the immediate management?",
    o: ["Blood cultures (peripheral and central line) and empiric IV anti-pseudomonal beta-lactam (piperacillin-tazobactam)", "Oral ciprofloxacin and await culture results", "Granulocyte colony-stimulating factor (G-CSF) only", "Observation with antipyretics and recheck in 24 hours"],
    a: 0,
    r: "Febrile neutropenia (fever above 38.3 degrees Celsius single or above 38.0 sustained, with ANC below 0.5 x 10^9/L) is a medical emergency requiring immediate blood cultures and empiric broad-spectrum IV antibiotics with anti-pseudomonal activity (piperacillin-tazobactam, cefepime, or meropenem). Oral antibiotics are for low-risk patients (MASCC score above 21). G-CSF may be adjunctive but does not replace antibiotics. Observation risks septic shock and death.",
    s: "Infectious Disease"
  },
  {
    q: "A 32-year-old female presents with a 4-day history of fever, headache, myalgias, and a maculopapular rash that began on the wrists and ankles and spread centrally. She went hiking in a wooded area 1 week ago. What is the most likely diagnosis and treatment?",
    o: ["Rocky Mountain spotted fever; doxycycline 100 mg BID immediately", "Lyme disease; amoxicillin 500 mg TID for 21 days", "Measles; supportive care and isolation", "Drug reaction; discontinue all medications"],
    a: 0,
    r: "Centripetal rash (starting on extremities and spreading centrally) with fever, headache, and myalgias after outdoor exposure in an endemic area is classic for Rocky Mountain spotted fever (Rickettsia rickettsii). Doxycycline is the treatment of choice and must be started empirically without waiting for serologic confirmation, as delays increase mortality. Lyme disease presents with erythema migrans, not centripetal rash. Measles rash starts on the face. Drug reactions have different distribution patterns.",
    s: "Infectious Disease"
  },

  // ===== WOMEN'S HEALTH & REPRODUCTIVE (Questions 81-90) =====
  {
    q: "A 28-year-old female at 10 weeks gestation presents with BP readings of 168/108 on two occasions 4 hours apart. She has a history of chronic hypertension diagnosed before pregnancy. Proteinuria is negative. Creatinine is 62 umol/L and platelets are 245 x 10^9/L. What is the preferred antihypertensive in pregnancy?",
    o: ["Labetalol", "Lisinopril", "Hydrochlorothiazide", "Atenolol"],
    a: 0,
    r: "Labetalol is a first-line antihypertensive in pregnancy, safe across all trimesters. Nifedipine (long-acting) and methyldopa are alternatives. ACE inhibitors (lisinopril) and ARBs are teratogenic and absolutely contraindicated in pregnancy (cause renal dysgenesis, oligohydramnios). Thiazide diuretics reduce placental perfusion and are generally avoided. Atenolol is associated with fetal growth restriction and is not preferred.",
    s: "Women's Health"
  },
  {
    q: "A 32-year-old primigravida at 34 weeks presents with severe headache, visual changes, epigastric pain, BP 172/112, and 3+ proteinuria. Platelets are 88 x 10^9/L and AST is 186 U/L. What is the priority management?",
    o: ["IV magnesium sulfate for seizure prophylaxis, IV labetalol for BP control, and expedite delivery", "Oral nifedipine and bed rest until term", "Expectant management with weekly labs until 37 weeks", "Immediate cesarean section without medical stabilization"],
    a: 0,
    r: "Preeclampsia with severe features (BP above 160/110, thrombocytopenia, elevated liver enzymes, cerebral symptoms) at 34 weeks requires IV magnesium sulfate for eclampsia prophylaxis, IV antihypertensives for acute BP control, and delivery as the definitive treatment. Expectant management is only considered at less than 34 weeks if stable, with antenatal corticosteroids. Delaying delivery risks eclamptic seizures, hepatic rupture, and placental abruption. Medical stabilization should precede delivery.",
    s: "Women's Health"
  },
  {
    q: "A 26-year-old female presents for her first prenatal visit at 8 weeks gestation. She has no medical history and takes no medications. Which screening tests should be ordered at this initial visit?",
    o: ["CBC, blood type and Rh, antibody screen, rubella immunity, hepatitis B, HIV, syphilis, urinalysis, and urine culture", "Glucose tolerance test and Group B Streptococcus culture", "Amniocentesis for chromosomal analysis", "Only hemoglobin and urinalysis"],
    a: 0,
    r: "First prenatal visit screening includes CBC (anemia), blood type and Rh status (Rh incompatibility risk), antibody screen, rubella immunity, hepatitis B surface antigen, HIV, syphilis (RPR/VDRL), urinalysis and urine culture (asymptomatic bacteriuria). Glucose tolerance testing is done at 24-28 weeks. GBS culture is at 35-37 weeks. Amniocentesis is not routine screening. Limiting to only hemoglobin misses critical infectious disease screening.",
    s: "Women's Health"
  },
  {
    q: "A 45-year-old female presents with irregular heavy menstrual bleeding, hot flashes, and sleep disturbances. FSH is 45 IU/L and estradiol is low. Endometrial biopsy shows no atypia. She has no contraindications to hormone therapy. What is the most appropriate treatment?",
    o: ["Combined estrogen-progestogen hormone therapy for symptom management", "Estrogen-only therapy", "High-dose oral contraceptive pills", "Selective serotonin reuptake inhibitor only"],
    a: 0,
    r: "Perimenopausal symptoms with elevated FSH, low estradiol, and intact uterus require combined estrogen-progestogen therapy if hormone therapy is chosen. Progestogen is mandatory with estrogen in women with a uterus to prevent endometrial hyperplasia and cancer. Estrogen-only therapy is only for women post-hysterectomy. High-dose OCPs are not used for menopausal hormone therapy. SSRIs are an alternative for vasomotor symptoms if hormone therapy is contraindicated.",
    s: "Women's Health"
  },
  {
    q: "A 30-year-old female presents with a 2 cm right adnexal mass found on routine pelvic ultrasound. She is asymptomatic and has regular menstrual cycles. The mass appears to be a simple cyst with thin walls, no septations, and no solid components. CA-125 is normal. What is the recommended management?",
    o: ["Repeat ultrasound in 8-12 weeks to assess for resolution", "Immediate laparoscopic cystectomy", "Start combined oral contraceptive pills to resolve the cyst", "CT abdomen and pelvis with contrast for staging"],
    a: 0,
    r: "Simple ovarian cysts less than 5 cm in premenopausal women are almost always functional (follicular or corpus luteum) and typically resolve spontaneously within 1-3 menstrual cycles. Repeat ultrasound in 8-12 weeks confirms resolution. Surgical intervention is unnecessary for small simple cysts. OCPs prevent new cyst formation but do not hasten resolution of existing cysts. CT imaging and staging are for suspected malignancy, which is unlikely with a small simple cyst and normal CA-125.",
    s: "Women's Health"
  },
  {
    q: "A 22-year-old female presents with secondary amenorrhea for 6 months. She has lost 12 kg intentionally through excessive exercise and caloric restriction. BMI is 16.5. Pregnancy test is negative. TSH and prolactin are normal. What is the underlying diagnosis and initial management?",
    o: ["Functional hypothalamic amenorrhea; nutritional rehabilitation and reduction of exercise intensity", "Premature ovarian insufficiency; start hormone replacement", "Polycystic ovary syndrome; start metformin", "Asherman syndrome; refer for hysteroscopy"],
    a: 0,
    r: "Secondary amenorrhea in a young woman with significant weight loss, excessive exercise, and low BMI (below 18.5) is consistent with functional hypothalamic amenorrhea (FHA). The hypothalamic-pituitary-ovarian axis is suppressed due to energy deficit. Management is nutritional rehabilitation, weight restoration, and reduction of excessive exercise. Bone density monitoring is important due to estrogen deficiency. POI has elevated FSH. PCOS presents with hyperandrogenism. Asherman syndrome follows uterine instrumentation.",
    s: "Women's Health"
  },
  {
    q: "A 35-year-old female G3P2 at 38 weeks presents in active labor. Fetal heart rate tracing shows repetitive late decelerations with minimal variability over the past 30 minutes. Cervix is 5 cm dilated. What is the priority intervention?",
    o: ["Intrauterine resuscitation (left lateral positioning, IV fluid bolus, oxygen) and prepare for emergent cesarean if pattern persists", "Continue labor with continuous monitoring", "Administer oxytocin to accelerate labor", "Perform amniotomy to assess amniotic fluid"],
    a: 0,
    r: "Repetitive late decelerations with minimal variability is a Category III fetal heart rate pattern indicating fetal acidemia. Immediate intrauterine resuscitation includes left lateral positioning (improves uteroplacental perfusion), IV fluid bolus, discontinuing oxytocin if running, and supplemental oxygen. If the pattern does not improve promptly, emergent cesarean delivery is indicated regardless of cervical dilation. Continuing labor or augmenting with oxytocin worsens fetal compromise. Amniotomy may worsen cord compression.",
    s: "Women's Health"
  },
  {
    q: "A 50-year-old female presents with postmenopausal bleeding for 2 weeks. She is not on hormone therapy. BMI is 38 and she has type 2 diabetes. Transvaginal ultrasound shows an endometrial thickness of 8 mm. What is the next step?",
    o: ["Endometrial biopsy", "Reassurance and repeat ultrasound in 6 months", "Start progestogen therapy empirically", "Hysterectomy"],
    a: 0,
    r: "Any postmenopausal bleeding warrants investigation to rule out endometrial cancer. Endometrial thickness greater than 4 mm on transvaginal ultrasound in a symptomatic postmenopausal woman requires endometrial biopsy. This patient has additional risk factors for endometrial cancer (obesity, diabetes, postmenopausal status). Reassurance without biopsy risks missing malignancy. Empiric progestogen does not address the need for histologic diagnosis. Hysterectomy without tissue diagnosis is premature.",
    s: "Women's Health"
  },
  {
    q: "A 19-year-old female presents requesting contraception. She has a history of migraine with aura. She has no other medical conditions. Which contraceptive method is contraindicated?",
    o: ["Combined oral contraceptive pill", "Levonorgestrel intrauterine system", "Copper intrauterine device", "Progestin-only pill"],
    a: 0,
    r: "Combined hormonal contraceptives (pills, patch, ring) are absolutely contraindicated (MEC category 4) in women with migraine with aura due to significantly increased risk of ischemic stroke. The estrogen component is the primary concern. Progestin-only methods (POP, implant, Depo-Provera, hormonal IUD) are safe in migraine with aura (MEC category 2). Copper IUD is non-hormonal and has no contraindication.",
    s: "Women's Health"
  },
  {
    q: "A 38-year-old female presents with a palpable 2.5 cm breast lump in the left upper outer quadrant. It is firm, non-tender, and does not change with the menstrual cycle. Mammography shows an irregular spiculated mass. What is the appropriate next step?",
    o: ["Core needle biopsy of the mass", "Fine-needle aspiration only", "Repeat mammography in 6 months", "Bilateral mastectomy"],
    a: 0,
    r: "A palpable breast mass with suspicious mammographic features (irregular, spiculated) requires tissue diagnosis. Core needle biopsy is preferred over FNA because it provides architectural information needed to distinguish invasive from in situ carcinoma and allows receptor testing (ER, PR, HER2). FNA provides cytology only and may be insufficient. Watchful waiting delays diagnosis of a potentially malignant lesion. Surgical intervention without pathologic diagnosis is inappropriate.",
    s: "Women's Health"
  },

  // ===== PSYCHIATRY & PSYCHOPHARMACOLOGY (Questions 91-100) =====
  {
    q: "A 35-year-old female presents with persistent depressed mood, anhedonia, insomnia, fatigue, poor concentration, and feelings of worthlessness for 3 months. She has no suicidal ideation and no history of mania. She is not pregnant. What is the first-line pharmacotherapy?",
    o: ["Selective serotonin reuptake inhibitor (sertraline or escitalopram)", "Tricyclic antidepressant (amitriptyline)", "Monoamine oxidase inhibitor (phenelzine)", "Benzodiazepine (lorazepam) for 2 weeks"],
    a: 0,
    r: "Major depressive disorder meeting DSM-5 criteria (5 or more symptoms for 2 or more weeks with functional impairment) is first treated with SSRIs due to favorable efficacy, safety profile, and tolerability. Sertraline and escitalopram have strong evidence. TCAs have more side effects and cardiac toxicity risk. MAOIs require dietary restrictions and are reserved for treatment-resistant depression. Benzodiazepines do not treat depression and carry dependence risk.",
    s: "Psychiatry"
  },
  {
    q: "A 28-year-old male presents with a first episode of psychosis: auditory hallucinations, persecutory delusions, and disorganized speech for 6 weeks. He has no substance use history. Physical examination and labs are unremarkable. What is the most appropriate initial pharmacotherapy?",
    o: ["Second-generation antipsychotic (risperidone or aripiprazole) at low dose", "High-dose haloperidol", "Lithium monotherapy", "Clozapine as first-line treatment"],
    a: 0,
    r: "First-episode psychosis is treated with a low-dose second-generation antipsychotic (SGA) such as risperidone or aripiprazole due to better tolerability and lower extrapyramidal side effect risk compared to first-generation agents. Low starting doses reduce side effects. High-dose haloperidol increases EPS and tardive dyskinesia risk. Lithium is for bipolar disorder, not primary psychosis. Clozapine is reserved for treatment-resistant schizophrenia (failed 2 adequate antipsychotic trials).",
    s: "Psychiatry"
  },
  {
    q: "A 42-year-old male with bipolar I disorder (most recent episode manic) is stabilized on lithium 900 mg daily. Lithium level is 0.8 mmol/L. He presents with tremor, polyuria, and polydipsia. TSH is 8.2 mIU/L (elevated) and creatinine is 112 umol/L. What is the most appropriate management?",
    o: ["Check free T4, start levothyroxine if hypothyroid, monitor renal function, and consider lithium dose adjustment", "Discontinue lithium immediately and switch to valproate", "Increase lithium dose for better mood stabilization", "Add propranolol for tremor and ignore thyroid results"],
    a: 0,
    r: "Lithium commonly causes nephrogenic diabetes insipidus (polyuria, polydipsia) and hypothyroidism (elevated TSH). Management includes checking free T4 and starting levothyroxine replacement if confirmed hypothyroid. Renal function monitoring is essential as lithium can cause chronic interstitial nephritis. Lithium level of 0.8 is therapeutic (0.6-1.2 mmol/L). Abrupt discontinuation risks manic relapse. The tremor, thyroid, and renal effects are managed while maintaining lithium if mood is stable.",
    s: "Psychiatry"
  },
  {
    q: "A 22-year-old female presents with recurrent panic attacks with palpitations, diaphoresis, shortness of breath, and fear of dying. Cardiac workup is negative. Episodes occur 3-4 times per week and she avoids crowded places. What is the most appropriate long-term treatment?",
    o: ["SSRI (sertraline or paroxetine) with cognitive behavioral therapy", "Alprazolam 1 mg TID as sole treatment", "Propranolol 40 mg BID", "Buspirone 15 mg BID"],
    a: 0,
    r: "Panic disorder with agoraphobia is best treated with an SSRI (first-line pharmacotherapy) combined with cognitive behavioral therapy (CBT), which has the strongest evidence for long-term efficacy. Benzodiazepines may provide short-term bridge therapy but are not recommended as sole long-term treatment due to dependence, tolerance, and withdrawal risk. Propranolol treats performance anxiety but not panic disorder. Buspirone is for generalized anxiety disorder, not panic disorder.",
    s: "Psychiatry"
  },
  {
    q: "A 65-year-old male with major depressive disorder on venlafaxine 225 mg daily for 8 weeks shows minimal improvement. He has adequate adherence and no substance use. What is the most appropriate next step?",
    o: ["Augment with aripiprazole or lithium", "Add a second SSRI to the venlafaxine", "Discontinue venlafaxine abruptly and start an MAOI", "Continue venlafaxine at the same dose for another 12 weeks"],
    a: 0,
    r: "Treatment-resistant depression (failure to respond to adequate dose and duration of antidepressant) warrants augmentation strategies. Aripiprazole and lithium have strong evidence for augmentation of antidepressants. Adding a second serotonergic agent increases serotonin syndrome risk. MAOI cannot be combined with SNRI (requires 2-week washout minimum for venlafaxine). Continuing the same ineffective regimen without modification delays recovery.",
    s: "Psychiatry"
  },
  {
    q: "A 30-year-old female with generalized anxiety disorder is started on escitalopram 10 mg daily. After 2 weeks, she reports worsening anxiety and nausea. What is the most appropriate advice?",
    o: ["Reassure that initial activation and GI side effects often improve by weeks 4-6; continue the medication", "Discontinue escitalopram immediately and switch to a benzodiazepine", "Double the dose to 20 mg for faster onset of effect", "Switch to a tricyclic antidepressant"],
    a: 0,
    r: "SSRIs commonly cause transient jitteriness, anxiety activation, and GI side effects (nausea, diarrhea) in the first 1-2 weeks of therapy. These side effects typically diminish by weeks 4-6 as the therapeutic effect emerges. Patients should be counseled to continue the medication. Premature discontinuation prevents therapeutic benefit. Doubling the dose worsens activation side effects. Switching classes should be considered after 6-8 weeks of adequate trial.",
    s: "Psychiatry"
  },
  {
    q: "A 19-year-old male is brought to the emergency department by police after threatening self-harm. He has a history of impulsive behavior, unstable relationships, chronic emptiness, and self-injurious behavior (cutting). He does not meet criteria for an acute mood episode. What is the most effective long-term treatment?",
    o: ["Dialectical behavior therapy (DBT)", "Long-term benzodiazepine therapy", "High-dose antipsychotic medication", "Electroconvulsive therapy"],
    a: 0,
    r: "Borderline personality disorder (BPD) presenting with emotional dysregulation, impulsivity, unstable relationships, and self-harm is most effectively treated with dialectical behavior therapy (DBT), which has the strongest evidence base. DBT teaches distress tolerance, emotion regulation, interpersonal effectiveness, and mindfulness skills. Benzodiazepines can worsen impulsivity and disinhibition. Antipsychotics may be used short-term for acute agitation but are not primary treatment. ECT is for severe treatment-resistant mood disorders.",
    s: "Psychiatry"
  },
  {
    q: "A 55-year-old male with alcohol use disorder presents 24 hours after his last drink with tremor, diaphoresis, anxiety, and tachycardia (HR 112). BP is 158/96. CIWA-Ar score is 18. What is the most appropriate pharmacologic management?",
    o: ["Symptom-triggered benzodiazepine protocol (diazepam or chlordiazepoxide) guided by CIWA-Ar scoring", "Phenytoin loading dose for seizure prophylaxis", "Haloperidol 5 mg IM for agitation", "IV ethanol drip to prevent withdrawal"],
    a: 0,
    r: "Moderate alcohol withdrawal (CIWA-Ar score 10-18) requires symptom-triggered benzodiazepine therapy. Long-acting agents (diazepam, chlordiazepoxide) provide smoother withdrawal. Symptom-triggered dosing (treating when CIWA greater than 10) reduces total benzodiazepine use and ICU duration compared to fixed-dose schedules. Phenytoin does not prevent alcohol withdrawal seizures. Haloperidol lowers seizure threshold and can cause QT prolongation. IV ethanol is not a standard treatment approach.",
    s: "Psychiatry"
  },
  {
    q: "A 70-year-old female with depression and chronic pain is started on duloxetine 30 mg daily. She also takes tramadol PRN for pain. Two weeks later, she presents with agitation, hyperthermia (39.1 degrees Celsius), myoclonus, hyperreflexia, and diarrhea. What is the most likely diagnosis?",
    o: ["Serotonin syndrome", "Neuroleptic malignant syndrome", "Malignant hyperthermia", "Anticholinergic toxicity"],
    a: 0,
    r: "Serotonin syndrome results from excess serotonergic activity, commonly from combining serotonergic agents. Duloxetine (SNRI) and tramadol (weak serotonin reuptake inhibitor and mu-opioid agonist) together increase serotonin syndrome risk. Clinical triad includes altered mental status, autonomic instability (hyperthermia, tachycardia, diarrhea), and neuromuscular hyperactivity (myoclonus, hyperreflexia, clonus). NMS is associated with dopamine antagonists and presents with lead-pipe rigidity. Malignant hyperthermia occurs with inhalational anesthetics. Anticholinergic toxicity causes dry skin, urinary retention, and mydriasis.",
    s: "Psychiatry"
  },
  {
    q: "A 25-year-old male presents with intrusive, repetitive thoughts about contamination and spends 3 hours daily washing his hands, causing skin breakdown and functional impairment. He recognizes the thoughts are irrational but cannot control them. What is the first-line treatment approach?",
    o: ["SSRI (fluoxetine or fluvoxamine) at higher doses than typical depression dosing, combined with exposure and response prevention (ERP) therapy", "Benzodiazepine (clonazepam) for anxiety reduction", "Antipsychotic monotherapy (olanzapine)", "Cognitive behavioral therapy without any medication"],
    a: 0,
    r: "Obsessive-compulsive disorder (OCD) with significant functional impairment is best treated with combination therapy: SSRI at higher-than-typical doses (e.g., fluoxetine 40-80 mg, fluvoxamine 200-300 mg) plus exposure and response prevention (ERP), a specialized form of CBT. SSRIs are first-line pharmacotherapy for OCD. Benzodiazepines are not effective for OCD. Antipsychotics may augment SSRIs in refractory OCD but are not first-line. CBT alone may be sufficient for mild OCD but moderate-severe cases benefit from combined approach.",
    s: "Psychiatry"
  }
];
