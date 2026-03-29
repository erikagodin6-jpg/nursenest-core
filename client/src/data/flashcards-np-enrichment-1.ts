import type { FlashcardData } from "./flashcards-rpn";

export const npFlashcardsEnrichment1: FlashcardData[] = [
  // ============================================================
  // ADVANCED HEALTH ASSESSMENT (35 cards)
  // ============================================================
  {
    id: "np-assess-e1",
    type: "question",
    question: "During a comprehensive cardiovascular assessment, you auscultate an S3 gallop in a 58-year-old patient. What is the most likely clinical significance?",
    options: ["Normal finding in young adults", "Left ventricular volume overload or systolic dysfunction", "Aortic stenosis", "Mitral valve prolapse"],
    correctIndex: 1,
    answer: "An S3 gallop in adults over 40 is pathologic and indicates rapid ventricular filling from volume overload or reduced ventricular compliance. It is strongly associated with systolic heart failure (HFrEF) and is the most specific bedside finding for elevated left ventricular filling pressures. While S3 may be physiologic in children and young adults, its presence in middle-aged or older patients warrants echocardiography and BNP measurement.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e2",
    type: "question",
    question: "A 72-year-old presents with unilateral leg swelling. Which clinical assessment tool standardizes the pre-test probability for deep vein thrombosis?",
    options: ["CURB-65 score", "Wells score for DVT", "CHA₂DS₂-VASc score", "APACHE II score"],
    correctIndex: 1,
    answer: "The Wells score for DVT incorporates clinical features (active cancer, paralysis, bedridden >3 days, localized tenderness, entire leg swelling, calf swelling >3 cm, pitting edema, collateral veins, previously documented DVT) and an alternative diagnosis component. A score of 2 or more indicates high probability warranting compression ultrasound. For low-probability patients, D-dimer can safely rule out DVT.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e3",
    type: "question",
    question: "When performing a cranial nerve assessment, a patient cannot elevate the soft palate on the right side and the uvula deviates to the left. Which cranial nerve is impaired?",
    options: ["CN IX (glossopharyngeal)", "CN X (vagus) on the right", "CN XII (hypoglossal)", "CN VII (facial)"],
    correctIndex: 1,
    answer: "Unilateral vagus nerve (CN X) palsy causes ipsilateral soft palate weakness. The uvula deviates AWAY from the affected side because the intact side pulls it over. This finding may indicate posterior fossa pathology, brainstem stroke, or skull base lesion. CN X also innervates the larynx so check for hoarseness.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e4",
    type: "question",
    question: "A 45-year-old woman presents with bilateral hand joint pain. Which examination findings distinguish rheumatoid arthritis from osteoarthritis?",
    options: ["Pain with motion only", "MCP and PIP joint involvement with morning stiffness >60 minutes and boggy synovial swelling", "DIP joint Heberden nodes with brief morning stiffness", "Normal joint exam with positive ANA"],
    correctIndex: 1,
    answer: "RA classically affects MCP and PIP joints symmetrically with prolonged morning stiffness (>60 min), boggy synovial thickening, and warmth. OA preferentially affects DIP joints (Heberden nodes) and PIP joints (Bouchard nodes) with brief stiffness (<30 min) and bony enlargement without warmth. RA spares the DIP joints. Ulnar deviation and swan-neck deformities are late RA findings. Labs: RF, anti-CCP antibodies, ESR/CRP support RA diagnosis.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e5",
    type: "question",
    question: "During a mental status examination, a patient scores 22/30 on the MoCA. What does this indicate and what is the next step?",
    options: ["Normal cognition; no action needed", "Possible mild cognitive impairment; further neurocognitive testing and reversible cause workup", "Definitive Alzheimer diagnosis; start donepezil", "Malingering; repeat in 6 months"],
    correctIndex: 1,
    answer: "MoCA (Montreal Cognitive Assessment) cutoff is 26/30. A score of 22 suggests mild cognitive impairment. The NP should rule out reversible causes (B12 deficiency, hypothyroidism, depression, medication effects), obtain neuroimaging (MRI brain), and refer for formal neuropsychological testing. MoCA is more sensitive than MMSE for detecting MCI and vascular cognitive impairment.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e6",
    type: "question",
    question: "What is the significance of a positive Romberg test in a neurological examination?",
    options: ["Cerebellar dysfunction", "Proprioceptive or vestibular sensory deficit causing balance loss with eyes closed", "Upper motor neuron lesion", "Peripheral neuropathy only"],
    correctIndex: 1,
    answer: "A positive Romberg test (increased sway or falling with eyes closed but stable with eyes open) indicates a proprioceptive (dorsal column) or vestibular deficit. With eyes closed, the patient cannot compensate for the sensory loss with vision. Cerebellar ataxia causes imbalance with eyes both open AND closed. Common causes include B12 deficiency, tabes dorsalis, and peripheral neuropathy.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e7",
    type: "question",
    question: "A 6-month-old infant is brought for a well-child visit. Which developmental milestone should be assessed at this age?",
    options: ["Walking independently", "Sits with support, reaches for objects, babbles, and rolls from back to front", "Speaks in 2-word phrases", "Draws a circle"],
    correctIndex: 1,
    answer: "At 6 months, expected milestones include: GROSS MOTOR: sits with support, rolls both directions; FINE MOTOR: reaches for and transfers objects; LANGUAGE: babbles with consonant sounds; SOCIAL: stranger anxiety beginning, responds to name. Red flags: no rolling, no reaching, no babbling, persistent fisting. Use ASQ-3 for validated screening.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e8",
    type: "question",
    question: "During a peripheral vascular assessment, the ankle-brachial index (ABI) is 0.65. What does this indicate?",
    options: ["Normal circulation", "Moderate peripheral arterial disease with claudication expected", "Severe PAD requiring urgent intervention", "Venous insufficiency"],
    correctIndex: 1,
    answer: "ABI interpretation: >1.30 (non-compressible calcified vessels); 1.00-1.30 (normal); 0.91-0.99 (borderline); 0.41-0.90 (mild-moderate PAD with intermittent claudication); <=0.40 (severe PAD with rest pain and tissue loss risk). An ABI of 0.65 indicates moderate PAD. Management includes smoking cessation, supervised exercise, statin, and antiplatelet therapy.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e9",
    type: "question",
    question: "A patient presents with acute onset vertigo. Which examination finding differentiates central from peripheral vertigo?",
    options: ["Nausea and vomiting", "Direction-changing nystagmus, negative head impulse test, and skew deviation (HINTS exam) suggest central cause", "Hearing loss", "Duration of symptoms"],
    correctIndex: 1,
    answer: "The HINTS exam differentiates central from peripheral vertigo. CENTRAL signs: normal head impulse test (no corrective saccade), direction-changing nystagmus, skew deviation present. PERIPHERAL signs: positive head impulse test, unidirectional nystagmus, no skew. HINTS is more sensitive than early MRI for posterior stroke.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e10",
    type: "question",
    question: "When examining a thyroid nodule, which characteristics on palpation suggest malignancy?",
    options: ["Smooth, mobile, soft nodule", "Firm, fixed, irregular nodule with cervical lymphadenopathy", "Diffusely enlarged thyroid without nodularity", "Tender nodule with recent URI"],
    correctIndex: 1,
    answer: "Malignancy red flags: firm/hard consistency, fixed (non-mobile) to surrounding tissues, irregular borders, rapid growth, associated cervical lymphadenopathy, hoarseness suggesting recurrent laryngeal nerve involvement. Use ACR TI-RADS system for biopsy recommendations based on ultrasound features including microcalcifications and hypoechogenicity.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e11",
    type: "question",
    question: "During a geriatric functional assessment, which validated tool best evaluates fall risk in community-dwelling older adults?",
    options: ["Glasgow Coma Scale", "Timed Up and Go (TUG) test", "APACHE II score", "CURB-65"],
    correctIndex: 1,
    answer: "The Timed Up and Go (TUG) test measures functional mobility: rise from chair, walk 3 meters, turn, walk back, and sit. Greater than 12 seconds suggests fall risk. The CDC STEADI toolkit integrates multiple screening components. Falls assessment should include medication review, orthostatic vitals, visual acuity, footwear, and home safety evaluation.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e12",
    type: "question",
    question: "A patient presents with epigastric pain radiating to the back. What physical examination findings suggest acute pancreatitis?",
    options: ["Rebound tenderness in RLQ", "Epigastric tenderness, guarding, Grey Turner sign (flank ecchymosis), and Cullen sign (periumbilical ecchymosis)", "Murphy sign positive", "Rovsing sign positive"],
    correctIndex: 1,
    answer: "Acute pancreatitis presents with epigastric tenderness, often with guarding. Severe necrotizing pancreatitis may show Grey Turner sign (flank ecchymosis) and Cullen sign (periumbilical ecchymosis) indicating retroperitoneal hemorrhage. Diagnosis requires 2 of 3: characteristic pain, lipase >3x ULN, and imaging findings. Ranson criteria or BISAP score assess severity.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e13",
    type: "question",
    question: "What is the CAGE questionnaire used for and when should the NP administer it?",
    options: ["A depression screening tool", "A 4-question alcohol screening tool: Cut down, Annoyed, Guilty, Eye-opener. Score of 2 or more suggests alcohol use disorder", "A cognitive assessment tool", "An anxiety screening instrument"],
    correctIndex: 1,
    answer: "CAGE is a brief alcohol screening tool: Have you ever felt the need to Cut down? Have people Annoyed you about drinking? Have you ever felt Guilty about drinking? Have you ever had an Eye-opener? Score of 2 or more has 93% sensitivity for alcohol dependence. AUDIT is more comprehensive and identifies hazardous drinking. Screen annually in primary care.",
    category: "Advanced Health Assessment",
    difficulty: 1
  },
  {
    id: "np-assess-e14",
    type: "question",
    question: "A 55-year-old male presents for routine exam. Using USPSTF guidelines, which cancer screening is recommended?",
    options: ["Annual PSA for all men starting at 40", "Low-dose CT chest for lung cancer if 20+ pack-year history and currently smoking or quit within 15 years; colonoscopy starting at 45", "Annual full-body MRI", "PET scan every 5 years"],
    correctIndex: 1,
    answer: "USPSTF screening recommendations for a 55-year-old male: LUNG: annual LDCT if 20+ pack-year smoking history and currently smoke or quit within 15 years (age 50-80); COLORECTAL: colonoscopy every 10 years, FIT annually, or stool DNA every 3 years starting at 45; PROSTATE: shared decision-making about PSA (age 55-69). AAA screening: one-time ultrasound for men 65-75 who ever smoked.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e15",
    type: "question",
    question: "During a prenatal assessment at 28 weeks, what screening tests should the NP order?",
    options: ["Only blood pressure check", "Glucose challenge test (50g GCT), Rh antibody screen if Rh-negative, CBC, and Tdap vaccine", "CT scan of pelvis", "Genetic amniocentesis"],
    correctIndex: 1,
    answer: "At 28 weeks: glucose screening with 50g GCT; RhoGAM 300 mcg IM if Rh-negative; CBC to screen for anemia; Tdap vaccine between 27-36 weeks each pregnancy; repeat STI screening if high-risk. Begin kick counts at 28 weeks and assess fetal movement, fundal height, and fetal heart tones.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e16",
    type: "question",
    question: "What distinguishes a dermatomal rash distribution from a non-dermatomal pattern?",
    options: ["No clinical significance", "Dermatomal follows a single spinal nerve (herpes zoster); non-dermatomal may suggest systemic, allergic, or autoimmune etiology", "Both indicate fungal infection", "Dermatomal means bilateral distribution"],
    correctIndex: 1,
    answer: "Dermatomal distribution follows a single spinal nerve root and is classic for herpes zoster presenting as painful vesicles in a unilateral band that does not cross midline. Non-dermatomal patterns include symmetric (drug reaction), photodistributed (lupus), extensor surfaces (psoriasis), and flexural (eczema).",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e17",
    type: "question",
    question: "What scoring system guides inpatient versus outpatient management for community-acquired pneumonia?",
    options: ["GCS alone", "CURB-65: Confusion, Uremia, Respiratory rate >=30, BP <90/60, age >=65. Score 0-1 outpatient; 2 short stay; 3-5 ICU consideration", "APGAR", "SOFA only"],
    correctIndex: 1,
    answer: "CURB-65 assigns 1 point each for: Confusion, Urea >7 mmol/L, RR >=30, BP <90 systolic or <=60 diastolic, age >=65. Score 0-1 outpatient. Score 2 short inpatient. Score 3-5 hospital admission with ICU consideration. PSI/PORT score is more complex but also validated.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e18",
    type: "question",
    question: "What clinical findings differentiate an upper motor neuron lesion from a lower motor neuron lesion?",
    options: ["No difference exists", "UMN: hyperreflexia, spasticity, positive Babinski, clonus. LMN: hyporeflexia, flaccidity, muscle atrophy, fasciculations", "Both cause flaccidity", "Both cause hyperreflexia"],
    correctIndex: 1,
    answer: "UMN lesions: hyperreflexia, spasticity, positive Babinski, clonus, no significant atrophy early. LMN lesions: hyporeflexia/areflexia, flaccidity, muscle atrophy, fasciculations, negative Babinski. Mixed UMN/LMN: ALS. Pure UMN: stroke, MS, spinal cord compression. Pure LMN: GBS, polio, radiculopathy.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e19",
    type: "question",
    question: "A 50-year-old woman has a firm, fixed, irregular 2 cm breast mass. What is the most concerning feature?",
    options: ["Location in upper outer quadrant", "The mass is fixed to the chest wall suggesting locally advanced breast cancer", "The mass is non-tender", "The mass is 2 cm"],
    correctIndex: 1,
    answer: "Fixation to the chest wall is the most concerning feature, suggesting T4a breast cancer. Other high-risk features: irregular borders, skin dimpling, peau d'orange, nipple retraction, bloody discharge, and axillary lymphadenopathy. Diagnostic mammogram plus core needle biopsy is the standard workup.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e20",
    type: "question",
    question: "What is the PHQ-9 and how is it interpreted?",
    options: ["A pain assessment tool", "A 9-item depression screening tool: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe depression", "A cognitive screening instrument", "An anxiety tool"],
    correctIndex: 1,
    answer: "PHQ-9 screens for major depressive disorder using 9 DSM-5 criteria over the past 2 weeks. Score >=10 has 88% sensitivity and 88% specificity for MDD. Question 9 assesses suicidal ideation and always needs follow-up on positive responses. PHQ-2 is useful as an ultra-brief initial screen. A 50% reduction indicates clinical improvement.",
    category: "Advanced Health Assessment",
    difficulty: 1
  },
  {
    id: "np-assess-e21",
    type: "question",
    question: "A neonate is assessed at 1 minute after birth with an APGAR score of 4. What does this indicate?",
    options: ["Healthy newborn", "Moderate depression requiring active resuscitation including stimulation, airway clearance, and possible positive pressure ventilation", "Normal transition", "Only observation needed"],
    correctIndex: 1,
    answer: "APGAR scoring assesses Appearance, Pulse, Grimace, Activity, Respiration. Score 7-10 is reassuring. Score 4-6 indicates moderate depression requiring warming, drying, stimulation, airway suctioning, and possible PPV with room air. Score 0-3 is severe and requires aggressive resuscitation including intubation. The 5-minute score better predicts outcomes.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e22",
    type: "question",
    question: "During a sports preparticipation physical, what cardiac assessment is most critical for sudden cardiac death prevention?",
    options: ["Routine stress testing", "History of syncope with exertion, family history of sudden death under 50, auscultation for murmurs that increase with Valsalva (HCM)", "Annual echocardiogram for all athletes", "Resting ECG for all"],
    correctIndex: 1,
    answer: "The AHA-recommended PPE includes targeted cardiac history: syncope with exercise, chest pain with exertion, excessive dyspnea, palpitations, family history of sudden cardiac death under 50, known family cardiomyopathy. Auscultation: murmurs increasing with Valsalva suggest HCM. Any positive findings require echocardiography and cardiology referral before clearance.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e23",
    type: "question",
    question: "What key findings differentiate epiglottitis from croup in a pediatric patient?",
    options: ["Both present identically", "Epiglottitis: acute onset, high fever, drooling, tripod position, muffled voice. Croup: gradual onset, barky cough, stridor, low-grade fever", "Only age differs", "Only pathogen differs"],
    correctIndex: 1,
    answer: "EPIGLOTTITIS: acute onset, high fever, toxic appearance, dysphagia with drooling, tripod position, muffled voice, minimal cough. Thumbprint sign on lateral neck X-ray. Do NOT examine the throat. CROUP: gradual onset, barky cough, inspiratory stridor worse at night, hoarseness, steeple sign on AP neck X-ray. Treatment: dexamethasone plus racemic epinephrine.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e24",
    type: "question",
    question: "A patient has painless jaundice, weight loss, and a palpable nontender gallbladder. What does this triad suggest?",
    options: ["Cholecystitis", "Pancreatic head cancer (Courvoisier sign)", "Choledocholithiasis", "Hepatitis"],
    correctIndex: 1,
    answer: "Courvoisier sign: painless jaundice plus palpable nontender gallbladder suggests malignant biliary obstruction, typically pancreatic head cancer. Gradual tumor growth allows gallbladder distension, unlike gallstone obstruction which causes chronic inflammation preventing distension. Workup: CT abdomen with contrast, CA 19-9, endoscopic ultrasound with FNA.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e25",
    type: "question",
    question: "What findings on pelvic examination suggest pelvic inflammatory disease?",
    options: ["Normal cervix with clear discharge", "Cervical motion tenderness, adnexal tenderness, mucopurulent cervical discharge, and fever", "Only positive pregnancy test", "Urinary incontinence"],
    correctIndex: 1,
    answer: "CDC PID diagnostic criteria minimum: cervical motion tenderness OR uterine tenderness OR adnexal tenderness. Supporting criteria: oral temperature >38.3C, mucopurulent discharge, elevated ESR/CRP, positive GC/CT testing. Treatment: ceftriaxone 500 mg IM plus doxycycline 100 mg BID for 14 days. Inpatient if tubo-ovarian abscess or failed outpatient therapy.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e26",
    type: "question",
    question: "A patient has numbness in the lateral three and a half digits. Which tests confirm carpal tunnel syndrome?",
    options: ["Finkelstein test", "Tinel sign (tapping over median nerve) and Phalen test (wrist flexion reproducing symptoms)", "Lachman test", "McMurray test"],
    correctIndex: 1,
    answer: "Carpal tunnel syndrome (median nerve entrapment): Tinel sign reproduces paresthesias. Phalen test (sustained wrist flexion for 60 seconds) is the most sensitive office test. Durkan test uses direct carpal compression for 30 seconds. NCS/EMG confirms severity. Finkelstein test is for de Quervain tenosynovitis.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e27",
    type: "question",
    question: "Which markers best identify protein-calorie malnutrition?",
    options: ["BMI alone", "BMI, mid-arm circumference, serum albumin (<3.5 g/dL), prealbumin (<15 mg/dL), and unintentional weight loss >5% in 1 month", "Only calorie counting", "Cholesterol level only"],
    correctIndex: 1,
    answer: "Malnutrition assessment combines anthropometric and biochemical markers. Albumin has a 20-day half-life and is affected by inflammation. Prealbumin has a 2-day half-life and is better for acute changes. Unintentional weight loss >5% in 1 month or >10% in 6 months is significant. Use validated screening tools like MUST for community settings.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e28",
    type: "question",
    question: "What is the significance of papilledema on fundoscopic examination?",
    options: ["Normal variant", "Bilateral optic disc swelling indicating elevated intracranial pressure requiring urgent neuroimaging", "Indicates glaucoma", "Suggests macular degeneration"],
    correctIndex: 1,
    answer: "Papilledema is bilateral optic disc edema caused by elevated intracranial pressure. Findings include blurred disc margins, venous engorgement, and flame-shaped hemorrhages. Causes: intracranial mass, idiopathic intracranial hypertension, cerebral venous sinus thrombosis, hydrocephalus. Requires urgent CT/MRI brain.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e29",
    type: "question",
    question: "How does the CAM (Confusion Assessment Method) differentiate delirium from dementia?",
    options: ["It cannot differentiate them", "CAM requires: acute onset with fluctuating course AND inattention PLUS either disorganized thinking OR altered consciousness", "It measures memory only", "It assesses mood"],
    correctIndex: 1,
    answer: "The CAM diagnoses delirium with 94% sensitivity and 89% specificity. Required features: acute onset with fluctuating course plus inattention. Plus at least one of: disorganized thinking or altered consciousness. Delirium is acute and often reversible while dementia is insidious and progressive. Delirium superimposed on dementia is common.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e30",
    type: "question",
    question: "Which tuning fork tests differentiate conductive from sensorineural hearing loss?",
    options: ["Visual acuity test", "Weber lateralizes to affected ear in conductive loss; Rinne shows bone > air conduction in conductive loss", "Otoscopy alone", "Tympanometry only"],
    correctIndex: 1,
    answer: "WEBER TEST: 512 Hz tuning fork on vertex. Lateralizes to affected ear in conductive loss, to unaffected ear in sensorineural loss. RINNE TEST: compare air conduction to bone conduction. Normal/SNHL: AC > BC. CHL: BC > AC (negative Rinne). SNHL causes: noise exposure, presbycusis, ototoxic medications. CHL causes: cerumen, otitis media, otosclerosis.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e31",
    type: "question",
    question: "What are the components of the OPQRST pain assessment mnemonic?",
    options: ["A medication formula", "Onset, Provocation/Palliation, Quality, Region/Radiation, Severity, Timing for systematic pain characterization", "An emergency protocol", "A surgical checklist"],
    correctIndex: 1,
    answer: "OPQRST: Onset (sudden suggests MI/PE/dissection), Provocation/Palliation (rest relief suggests angina), Quality (tearing back pain suggests dissection), Region/Radiation (epigastric to back suggests pancreatitis), Severity (0-10 scale for tracking), Timing (constant, intermittent, positional). Systematic pain assessment guides differential diagnosis.",
    category: "Advanced Health Assessment",
    difficulty: 1
  },
  {
    id: "np-assess-e32",
    type: "question",
    question: "A 65-year-old has an asymmetric, rock-hard, nodular prostate on DRE with PSA of 12 ng/mL. What is the most likely diagnosis?",
    options: ["Benign prostatic hyperplasia", "Prostate cancer requiring transrectal ultrasound-guided biopsy", "Prostatitis", "Normal prostate"],
    correctIndex: 1,
    answer: "A rock-hard, nodular, asymmetric prostate with elevated PSA (>4.0 ng/mL) is highly suspicious for prostate cancer. BPH presents as smooth, symmetrically enlarged, rubbery. Prostatitis shows tender, boggy prostate. Next step: multiparametric MRI of prostate (PI-RADS scoring) then targeted biopsy. Gleason score determines aggressiveness.",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e33",
    type: "question",
    question: "What differentiates tension pneumothorax from simple pneumothorax on physical examination?",
    options: ["They present identically", "Tension: tracheal deviation away, hypotension, JVD, absent breath sounds, cardiovascular collapse requiring needle decompression", "Only X-ray differentiates", "Tension has no cardiovascular effects"],
    correctIndex: 1,
    answer: "SIMPLE: decreased breath sounds, hyperresonance, stable vitals. TENSION: tracheal deviation AWAY from affected side, JVD, hypotension, tachycardia, cardiovascular collapse (obstructive shock). Tension pneumothorax is a clinical diagnosis and should not be delayed for imaging. Immediate needle decompression in 2nd intercostal space followed by chest tube.",
    category: "Advanced Health Assessment",
    difficulty: 3
  },
  {
    id: "np-assess-e34",
    type: "question",
    question: "What elements must be present in an NP assessment note to meet medicolegal standards?",
    options: ["Only chief complaint", "CC, HPI, relevant PMH/SH/FH, ROS, focused PE findings, differential diagnosis, clinical reasoning, plan with follow-up, and patient education documentation", "Diagnosis only", "Medication list only"],
    correctIndex: 1,
    answer: "Complete documentation includes: subjective (CC, HPI, relevant PMH, allergies, medications, SH, FH, pertinent ROS), objective (vital signs, focused PE with pertinent positives AND negatives), assessment (differential diagnosis with clinical reasoning), and plan (diagnostics, treatment with specific doses, referrals, patient education, follow-up, safety-net instructions).",
    category: "Advanced Health Assessment",
    difficulty: 2
  },
  {
    id: "np-assess-e35",
    type: "question",
    question: "During an abdominal assessment, what is the correct sequence of examination techniques and why?",
    options: ["Palpation first", "Inspection, auscultation, percussion, palpation. Auscultation before palpation prevents artificial alteration of bowel sounds", "No specific order", "Percussion first"],
    correctIndex: 1,
    answer: "Abdominal exam follows inspection, auscultation, percussion, palpation. Auscultation before palpation/percussion prevents stimulating peristalsis and altering bowel sounds. Inspect for distension, scars, visible peristalsis. Auscultate all 4 quadrants for bowel sounds. Percuss for tympany vs dullness. Palpate superficially then deeply, tender areas last.",
    category: "Advanced Health Assessment",
    difficulty: 1
  },
  // ============================================================
  // ADVANCED PHARMACOLOGY (35 cards) 
  // ============================================================
  {
    id: "np-pharm-e1",
    type: "question",
    question: "A patient with CKD stage 4 (eGFR 18) requires pain management for chronic low back pain. Which analgesic approach is safest?",
    options: ["Ibuprofen 400 mg TID", "Acetaminophen 650 mg Q6H (max 2g/day) with topical diclofenac and non-pharmacologic approaches", "Naproxen 500 mg BID", "Ketorolac 30 mg IM"],
    correctIndex: 1,
    answer: "In CKD stage 4, ALL systemic NSAIDs are contraindicated since they reduce renal blood flow via prostaglandin inhibition. Acetaminophen is first-line with reduced max dose (2g/day) in advanced CKD. Topical NSAIDs have minimal systemic absorption. Non-pharmacologic approaches (PT, CBT) are important adjuncts. If opioids needed, avoid morphine (active metabolite accumulation); hydromorphone or fentanyl are safer.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e2",
    type: "question",
    question: "An NP starts warfarin for a mechanical heart valve. What is the INR target range?",
    options: ["INR 1.5-2.0", "INR 2.5-3.5 for mechanical valves; monitor azole antifungals, amiodarone, and fluoroquinolones for interactions", "INR 2.0-3.0 for all", "No monitoring needed"],
    correctIndex: 1,
    answer: "Mechanical heart valve INR target: 2.5-3.5 (higher than 2.0-3.0 for AF/DVT). DOACs are NOT approved for mechanical valves (RE-ALIGN trial showed excess events). Major warfarin potentiators: azole antifungals, amiodarone, TMP-SMX. Major inhibitors: rifampin, carbamazepine, St. John's wort. Counsel on consistent vitamin K dietary intake.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e3",
    type: "question",
    question: "A breastfeeding mother develops mastitis. Which antibiotic is safest?",
    options: ["Ciprofloxacin", "Dicloxacillin 500 mg QID or cephalexin 500 mg QID covering Staphylococcus aureus", "Tetracycline", "Metronidazole first-line"],
    correctIndex: 1,
    answer: "Lactational mastitis is most commonly caused by S. aureus. First-line: dicloxacillin or cephalexin for 10-14 days (both L1 safest in LactMed). Continue breastfeeding on affected side. Ciprofloxacin has potential cartilage effects. Tetracycline causes dental staining. If MRSA suspected: TMP-SMX or clindamycin.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e4",
    type: "question",
    question: "A 78-year-old on multiple medications is excessively sedated. Which Beers Criteria medications should be reviewed?",
    options: ["Only opioids", "First-gen antihistamines, benzodiazepines, zolpidem, muscle relaxants, and anticholinergics", "Only benzodiazepines", "Beers only applies inpatient"],
    correctIndex: 1,
    answer: "AGS Beers Criteria identifies potentially inappropriate medications in older adults. High sedation risk: benzodiazepines, zolpidem (same fall risk as benzos), diphenhydramine (anticholinergic plus sedating), tricyclic antidepressants (amitriptyline), muscle relaxants (cyclobenzaprine). Deprescribing approach: taper one medication at a time and monitor for withdrawal.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e5",
    type: "question",
    question: "A patient on lithium develops polyuria, polydipsia, and sodium of 148 mEq/L. What is the complication?",
    options: ["Hypothyroidism", "Lithium-induced nephrogenic diabetes insipidus where kidneys resist ADH", "Lithium toxicity", "Hypercalcemia"],
    correctIndex: 1,
    answer: "Chronic lithium use causes nephrogenic DI in 20-40% of patients by downregulating aquaporin-2 channels. Presents with polyuria (>3L/day), polydipsia, and hypernatremia. Diagnosis: low urine osmolality that does not concentrate after desmopressin. Management: amiloride, hydrochlorothiazide (paradoxically concentrates urine), adequate hydration.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e6",
    type: "question",
    question: "Which medical condition is an absolute contraindication (WHO Category 4) for combined hormonal contraceptives?",
    options: ["Obesity", "History of migraine with aura due to increased ischemic stroke risk", "History of gestational diabetes", "Age over 30"],
    correctIndex: 1,
    answer: "WHO Category 4 for combined hormonal contraceptives: migraine WITH aura (2-4x stroke risk), age >=35 smoking >=15 cigarettes/day, current/history DVT/PE, known thrombophilia, current breast cancer, ischemic heart disease. Migraine WITHOUT aura is Category 2. These patients can safely use progestin-only methods.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e7",
    type: "question",
    question: "Which COPD medication is a long-acting muscarinic antagonist (LAMA)?",
    options: ["Albuterol", "Tiotropium (Spiriva) providing 24-hour bronchodilation as maintenance therapy", "Budesonide", "Montelukast"],
    correctIndex: 1,
    answer: "Tiotropium blocks M3 muscarinic receptors in airway smooth muscle providing sustained 24-hour bronchodilation. GOLD guidelines position LAMAs as preferred initial maintenance therapy for COPD. Alternative LAMAs: umeclidinium, aclidinium, glycopyrrolate. Side effects: dry mouth, urinary retention. Contraindicated with narrow-angle glaucoma.",
    category: "Advanced Pharmacology",
    difficulty: 1
  },
  {
    id: "np-pharm-e8",
    type: "question",
    question: "What is serotonin syndrome and which drug combinations increase its risk?",
    options: ["A withdrawal syndrome", "A hyperserotonergic state from combining SSRIs/SNRIs with MAOIs, tramadol, linezolid, or triptans. Presents with clonus, hyperthermia, agitation", "An allergic reaction", "Only MAOI monotherapy"],
    correctIndex: 1,
    answer: "Serotonin syndrome: neuromuscular excitability (clonus, hyperreflexia), autonomic instability (hyperthermia, tachycardia, diaphoresis), and altered mental status. HIGH-RISK: SSRI + MAOI (most dangerous), SSRI + tramadol, SSRI + linezolid, SSRI + triptans. Treatment: discontinue agents, cyproheptadine (serotonin antagonist), benzodiazepines, cooling.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e9",
    type: "question",
    question: "A child weighing 15 kg has acute otitis media. What is the correct amoxicillin dose?",
    options: ["250 mg once daily", "Amoxicillin 80-90 mg/kg/day divided BID equals approximately 600-675 mg BID for 10 days if under age 2", "500 mg TID (adult dose)", "No antibiotics ever needed"],
    correctIndex: 1,
    answer: "AAP guidelines: high-dose amoxicillin (80-90 mg/kg/day divided BID) is first-line. For 15 kg child: 80 x 15 = 1200 mg/day = 600 mg BID. Duration: 10 days if <2 years. Second-line: amoxicillin-clavulanate. PCN allergy: cefdinir, cefuroxime, or azithromycin.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e10",
    type: "question",
    question: "A patient on statin therapy develops muscle pain with CK at 5x ULN. What should the NP do?",
    options: ["Continue statin", "Discontinue statin, let symptoms resolve, then rechallenge with different statin at lower dose or alternate-day dosing", "Add a second statin", "Statins never cause this"],
    correctIndex: 1,
    answer: "Statin-associated muscle symptoms (SAMS): CK >5x ULN with symptoms warrants discontinuation. After resolution (2-4 weeks): rechallenge with lower-potency statin (pravastatin, fluvastatin) or alternate-day rosuvastatin. Risk factors: hypothyroidism, CKD, drug interactions. If statin-intolerant: ezetimibe, PCSK9 inhibitors, bempedoic acid.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e11",
    type: "question",
    question: "What are the key counseling points when starting metformin for type 2 diabetes?",
    options: ["Take on empty stomach", "Start low (500 mg with food), titrate slowly; monitor B12 annually; hold before contrast if eGFR <30; no hypoglycemia as monotherapy", "No dietary changes needed", "Check INR monthly"],
    correctIndex: 1,
    answer: "Metformin: START 500 mg with dinner, increase by 500 mg weekly to target. Extended-release has better GI tolerability. Safe down to eGFR 30 (reduced dose 30-45). B12 deficiency in 10-30% with chronic use. Lactic acidosis is very rare but hold during acute illness with dehydration. No hypoglycemia as monotherapy.",
    category: "Advanced Pharmacology",
    difficulty: 1
  },
  {
    id: "np-pharm-e12",
    type: "question",
    question: "What is the mechanism of PCSK9 inhibitors and when are they indicated?",
    options: ["Block cholesterol absorption", "PCSK9 inhibitors prevent LDL receptor degradation, increasing hepatic LDL uptake. Indicated for ASCVD with inadequate response to maximally tolerated statin", "Inhibit HMG-CoA reductase", "Bind bile acids"],
    correctIndex: 1,
    answer: "PCSK9 inhibitors (evolocumab, alirocumab) are monoclonal antibodies that block LDL receptor degradation, increasing LDL clearance. LDL-C reduction: 50-60% on top of statin. FOURIER and ODYSSEY trials demonstrated reduced cardiovascular events. Administration: subcutaneous injection every 2-4 weeks.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e13",
    type: "question",
    question: "A pregnant patient at 8 weeks has a UTI. Which antibiotic is safe?",
    options: ["Trimethoprim", "Nitrofurantoin 100 mg BID for 5-7 days or cephalexin 500 mg QID for 7 days", "Ciprofloxacin", "Doxycycline"],
    correctIndex: 1,
    answer: "Safe UTI antibiotics in pregnancy: nitrofurantoin, cephalexin, amoxicillin-clavulanate. AVOID: fluoroquinolones (cartilage damage), tetracyclines (dental staining), TMP-SMX (folate antagonism in T1, kernicterus near term). ALL bacteriuria in pregnancy requires treatment since untreated has 25-30% risk of pyelonephritis.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e14",
    type: "question",
    question: "What are the prescribing requirements for buprenorphine/naloxone for opioid use disorder?",
    options: ["No special training", "Since 2023, any DEA-licensed prescriber can prescribe after completing 8 hours of training. The X-waiver requirement was eliminated.", "Only addiction psychiatrists", "Only inpatient"],
    correctIndex: 1,
    answer: "The MAT Act (2022, effective 2023) eliminated the X-waiver requirement. Any practitioner with valid DEA registration can prescribe buprenorphine for OUD. INDUCTION: start when patient is in mild-moderate withdrawal (COWS score >=8-12) to avoid precipitated withdrawal. Target 16 mg/day maintenance. Buprenorphine is a partial mu-opioid agonist with ceiling effect on respiratory depression.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e15",
    type: "question",
    question: "Which herbal supplement has the most clinically significant drug interactions?",
    options: ["Echinacea", "St. John's wort reduces efficacy of oral contraceptives, warfarin, cyclosporine, and HIV antiretrovirals via CYP3A4 induction", "Ginger root", "Vitamin C"],
    correctIndex: 1,
    answer: "St. John's wort is a potent inducer of CYP3A4, CYP2C9, and P-glycoprotein. Critical interactions: reduces efficacy of oral contraceptives, warfarin, cyclosporine, HIV antiretrovirals, digoxin. Also causes serotonin syndrome with SSRIs/SNRIs. Always ask about herbal supplements at every visit.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e16",
    type: "question",
    question: "What is the first-line medication for acute anaphylaxis and its correct dose?",
    options: ["IV diphenhydramine", "Epinephrine 0.3-0.5 mg (1:1000) IM in the mid-outer thigh repeated every 5-15 minutes", "Oral prednisone 60 mg", "Albuterol only"],
    correctIndex: 1,
    answer: "EPINEPHRINE is THE first-line treatment for anaphylaxis with no contraindication. Dose: 0.3-0.5 mg of 1:1000 concentration IM in the vastus lateralis. Repeat every 5-15 minutes. Adjuncts: H1/H2 blockers, corticosteroids (prevent biphasic reaction), IV fluids, albuterol for bronchospasm. Delayed epinephrine is the top cause of anaphylaxis death.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e17",
    type: "question",
    question: "Which medication extends levodopa's duration in Parkinson disease wearing off?",
    options: ["Benztropine", "Entacapone (COMT inhibitor) blocks peripheral levodopa metabolism, increasing bioavailability and duration", "Haloperidol", "Diphenhydramine"],
    correctIndex: 1,
    answer: "Entacapone is a peripheral COMT inhibitor that blocks peripheral levodopa metabolism, extending its duration by 30-60 minutes per dose. Available as Stalevo (carbidopa/levodopa/entacapone). MAO-B inhibitors (rasagiline, selegiline) also extend effect. Never use haloperidol in PD as D2 blockade catastrophically worsens motor symptoms.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e18",
    type: "question",
    question: "What is the evidence-based approach to deprescribing in elderly polypharmacy?",
    options: ["Stop all at once", "Identify candidates using Beers/STOPP criteria, prioritize by harm, taper one medication at a time, and monitor for withdrawal", "Never reduce", "Only discontinue OTC"],
    correctIndex: 1,
    answer: "Evidence-based deprescribing: IDENTIFY using Beers Criteria and STOPP/START criteria. PRIORITIZE by harm potential (fall-risk medications first). TAPER one at a time monitoring 2-4 weeks between changes. Commonly deprescribed: PPIs (rebound acid), benzodiazepines (gradual taper essential), statins (if limited life expectancy). Document rationale.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e19",
    type: "question",
    question: "A 12-year-old with ADHD is prescribed methylphenidate. What monitoring is required?",
    options: ["None needed", "Baseline and periodic height, weight, BP, HR; assess for appetite suppression, sleep disturbance, mood changes, and tics; monitor growth velocity", "Only liver function", "Monthly ECG"],
    correctIndex: 1,
    answer: "Stimulant monitoring: BASELINE: height, weight, BMI, BP, HR, cardiac history. ONGOING: height/weight at each visit (growth velocity may decrease), BP and HR quarterly, appetite/sleep/mood, tic monitoring. Consider drug holidays during summer. Non-stimulant alternatives: atomoxetine, guanfacine ER, clonidine ER.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e20",
    type: "question",
    question: "What should the NP explain about generic versus brand medication bioequivalence?",
    options: ["Generics are always inferior", "FDA requires generics to have same active ingredient and be within 80-125% bioequivalence. Most are within 3-5% of brand. Monitor narrow therapeutic index drugs when switching.", "Generics use different ingredients", "No regulatory standards exist"],
    correctIndex: 1,
    answer: "FDA generic approval: same active ingredient, dose, dosage form, route. Bioequivalence: 90% CI for AUC and Cmax within 80-125% of brand. In practice, most are within 3-5%. NARROW THERAPEUTIC INDEX drugs (warfarin, levothyroxine, phenytoin, lithium, digoxin) warrant brand consistency or careful monitoring when switching.",
    category: "Advanced Pharmacology",
    difficulty: 1
  },
  {
    id: "np-pharm-e21",
    type: "question",
    question: "What pharmacogenomic concern exists with codeine prescribing?",
    options: ["No genetic considerations", "CYP2D6 ultra-rapid metabolizers convert codeine to morphine too quickly, causing potentially fatal respiratory depression", "Only age matters", "Codeine has no active metabolite"],
    correctIndex: 1,
    answer: "Codeine is a prodrug metabolized by CYP2D6 to morphine. Ultra-rapid metabolizers have rapid conversion causing excessive sedation and respiratory depression. FDA BLACK BOX: contraindicated in children <12 and after tonsillectomy in <18. Poor metabolizers get no analgesic effect. Consider pharmacogenomic testing per CPIC guidelines.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e22",
    type: "question",
    question: "A patient on sertraline develops hyponatremia (Na 126 mEq/L). What is the mechanism?",
    options: ["Renal sodium wasting", "SIADH caused by SSRI-stimulated ADH release leading to dilutional hyponatremia", "Adrenal insufficiency", "Dietary sodium deficiency"],
    correctIndex: 1,
    answer: "SSRI-induced hyponatremia occurs via SIADH: serotonin stimulates ADH secretion. Risk factors: elderly, female, low body weight, concurrent diuretics. Onset typically within 2-4 weeks. Management: discontinue SSRI (Na normalizes within 2 weeks), fluid restriction for mild cases. Correction rate: <=8 mEq/L per 24 hours to prevent osmotic demyelination.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e23",
    type: "question",
    question: "What are the three FDA-approved first-line smoking cessation pharmacotherapies?",
    options: ["Only nicotine gum", "Nicotine replacement therapy, bupropion SR, and varenicline (most effective single agent)", "Only willpower", "Only bupropion"],
    correctIndex: 1,
    answer: "Three FDA-approved first-line therapies: 1) NRT (patch, gum, lozenge, inhaler, nasal spray; combination NRT is more effective). 2) Bupropion SR 150 mg BID (contraindicated in seizure disorder). 3) Varenicline (partial nicotinic agonist, most effective single agent per EAGLES trial). Combination varenicline + NRT patch may be most effective.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e24",
    type: "question",
    question: "What is the current standard of care for chronic hepatitis C treatment?",
    options: ["Interferon and ribavirin", "Direct-acting antivirals: sofosbuvir/velpatasvir or glecaprevir/pibrentasvir with >95% cure rates in 8-12 weeks", "No treatment exists", "Liver transplant only"],
    correctIndex: 1,
    answer: "Direct-acting antivirals: sofosbuvir/velpatasvir (Epclusa) 12 weeks, glecaprevir/pibrentasvir (Mavyret) 8 weeks for treatment-naive non-cirrhotic. SVR rates >95%. Screen for HBV coinfection before starting (HBV reactivation risk). AASLD/IDSA recommend treatment for ALL patients with chronic HCV. SVR12 confirms cure.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e25",
    type: "question",
    question: "What immunosuppressive regimen is standard for renal transplant patients?",
    options: ["Aspirin only", "Triple therapy: tacrolimus (calcineurin inhibitor), mycophenolate (antimetabolite), and corticosteroids. Monitor drug levels, renal function, and screen for infections.", "No long-term medications", "Only prednisone"],
    correctIndex: 1,
    answer: "Standard triple immunosuppression: tacrolimus (trough 5-10 ng/mL, nephrotoxic, diabetogenic), mycophenolate (GI side effects, teratogenic), corticosteroids (tapered to low dose). Monitor: tacrolimus levels, BUN/Cr, CBC, BK virus, CMV, EBV. Annual skin cancer and cervical cancer screening. Azole antifungals dramatically increase tacrolimus levels.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e26",
    type: "question",
    question: "What biologic therapy should be considered for severe persistent asthma failing high-dose ICS/LABA?",
    options: ["Increase ICS further", "Omalizumab (anti-IgE) for allergic asthma, or dupilumab (anti-IL-4/IL-13) for eosinophilic asthma, guided by biomarker phenotyping", "Permanent systemic steroids", "Thermoplasty first"],
    correctIndex: 1,
    answer: "Biologic therapies (GINA Step 5) selected by phenotype: ALLERGIC (elevated IgE): omalizumab. EOSINOPHILIC (eos >=150): mepolizumab/benralizumab, dupilumab, tezepelumab. Phenotyping requires blood eosinophils, total IgE, FeNO, allergy testing. Biologics reduce exacerbations 50-70% and allow OCS tapering. Avoid chronic systemic steroids.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e27",
    type: "question",
    question: "What baseline labs and monitoring are needed when initiating an ACE inhibitor?",
    options: ["No labs", "Baseline: serum creatinine, potassium, BMP. Recheck 1-2 weeks after initiation. Monitor for cough (10-15%), angioedema, hyperkalemia, and AKI", "Only CBC", "Only LFTs"],
    correctIndex: 1,
    answer: "ACE inhibitor initiation: BASELINE: creatinine, potassium, BMP. RECHECK in 1-2 weeks (up to 30% creatinine rise is acceptable). MONITOR: dry cough (10-15% switch to ARB), angioedema (0.1-0.7%), hyperkalemia, first-dose hypotension. CONTRAINDICATED: pregnancy, bilateral renal artery stenosis, history of ACEi-induced angioedema.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e28",
    type: "question",
    question: "What are the non-glycemic benefits of SGLT2 inhibitors?",
    options: ["Only glucose lowering", "Cardiovascular risk reduction, heart failure hospitalization reduction, and CKD progression slowing. Now indicated for HFrEF, HFpEF, and CKD independent of diabetes", "Only weight loss", "No other benefits"],
    correctIndex: 1,
    answer: "SGLT2 inhibitors have transformed cardiorenal medicine: CARDIOVASCULAR MACE reduction (EMPA-REG, CANVAS), HEART FAILURE reduced hospitalization in HFrEF AND HFpEF regardless of diabetes, RENAL slowed CKD progression (CREDENCE, DAPA-CKD). Side effects: genital mycotic infections, euglycemic DKA, volume depletion, Fournier gangrene (rare).",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-e29",
    type: "question",
    question: "What prescribing program is mandatory for isotretinoin?",
    options: ["No special requirements", "iPLEDGE program: 2 negative pregnancy tests, monthly pregnancy tests, 2 forms of contraception, monthly agreements, 7-day prescription window", "Only consent form", "Only allergy test"],
    correctIndex: 1,
    answer: "Isotretinoin is FDA Category X teratogen. iPLEDGE REMS is mandatory: 2 negative pregnancy tests before start, 2 forms of contraception, monthly pregnancy test, monthly iPLEDGE website confirmation, 7-day fill window. Additional monitoring: fasting lipids, LFTs, CBC. Continue contraception 1 month post-discontinuation.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e30",
    type: "question",
    question: "What are the administration instructions for alendronate to prevent esophageal damage?",
    options: ["Take at bedtime with milk", "Take first thing in morning on empty stomach with 8 oz plain water, remain upright for 30 minutes, no food or other medications", "Take with food", "Chew the tablet"],
    correctIndex: 1,
    answer: "Bisphosphonate administration: take first in morning, empty stomach, full glass plain water, remain upright >=30 minutes, no food or other medications for 30-60 minutes. These instructions prevent esophageal erosion and ulceration. Contraindicated in esophageal disorders or inability to sit upright. Ensure adequate calcium and vitamin D supplementation.",
    category: "Advanced Pharmacology",
    difficulty: 1
  },
  {
    id: "np-pharm-e31",
    type: "question",
    question: "What constitutes a valid DEA controlled substance prescription?",
    options: ["Verbal order only", "Prescriber name, address, DEA number, patient name/address, drug details, quantity, directions, refill count, date, and signature. Schedule II has no refills.", "Email sufficient", "No requirements"],
    correctIndex: 1,
    answer: "Schedule II: written/EPCS only, no refills, max 90-day supply. Schedule III-V: written, oral, or faxed, up to 5 refills within 6 months. All require: prescriber name/address/DEA number, patient full name/address, drug/strength/quantity/directions, date, signature. PDMP checking mandatory in most states.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e32",
    type: "question",
    question: "What are the risks of long-term PPI therapy?",
    options: ["No risks", "Increased fracture risk, C. difficile infection, B12 deficiency, hypomagnesemia, acute interstitial nephritis, and CKD", "PPIs strengthen bones", "Only H2 blockers have risks"],
    correctIndex: 1,
    answer: "Chronic PPI risks: hip fracture (OR 1.25-1.44), C. difficile infection, community-acquired pneumonia, B12 deficiency, hypomagnesemia, acute interstitial nephritis, CKD, fundic gland polyps. Deprescribing: taper to avoid rebound acid hypersecretion, step down to H2 blocker, use lowest effective dose. Review indication annually.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e33",
    type: "question",
    question: "Which antiepileptic drugs also treat bipolar disorder?",
    options: ["Phenobarbital", "Valproic acid and lamotrigine are both FDA-approved for epilepsy and bipolar disorder", "Gabapentin", "Levetiracetam"],
    correctIndex: 1,
    answer: "VALPROIC ACID: FDA-approved for epilepsy, bipolar mania, and migraine. TERATOGENIC (Category X). LAMOTRIGINE: FDA-approved for epilepsy and bipolar maintenance (prevents depressive episodes). Requires SLOW titration (SJS risk 0.3%). Halve lamotrigine dose when combined with valproic acid (inhibits metabolism).",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e34",
    type: "question",
    question: "What are the key differences between ACE inhibitors and ARBs?",
    options: ["Identical", "ACEIs block angiotensin-converting enzyme and prevent bradykinin degradation (explains cough). ARBs block AT1 receptors with no cough. Choose ARB when ACEi causes cough. Never combine.", "ARBs cause more cough", "ACEIs always preferred"],
    correctIndex: 1,
    answer: "ACE INHIBITORS: block ACE plus prevent bradykinin degradation (explains cough 10-15% and angioedema). Broader outcomes data. ARBs: block angiotensin II at AT1 receptor, no effect on bradykinin so no cough. CHOOSE ARB when ACEi causes cough. NEVER combine ACEi + ARB (ONTARGET trial: increased AKI with no benefit). Both contraindicated in pregnancy.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-e35",
    type: "question",
    question: "What is the first-line treatment for Clostridioides difficile infection?",
    options: ["Metronidazole for all", "Fidaxomicin 200 mg BID or vancomycin 125 mg QID for 10 days per IDSA/SHEA 2021 guidelines. Metronidazole is no longer first-line.", "Ciprofloxacin", "Continue offending antibiotic"],
    correctIndex: 1,
    answer: "IDSA/SHEA 2021: INITIAL NON-SEVERE: fidaxomicin 200 mg BID x 10 days (preferred, lower recurrence) or vancomycin 125 mg QID x 10 days. Metronidazole is now second-line. SEVERE (WBC >=15,000): vancomycin. FULMINANT: vancomycin 500 mg QID + IV metronidazole. RECURRENCE: fidaxomicin taper, bezlotoxumab, or fecal microbiota transplant.",
    category: "Advanced Pharmacology",
    difficulty: 3
  }
];
