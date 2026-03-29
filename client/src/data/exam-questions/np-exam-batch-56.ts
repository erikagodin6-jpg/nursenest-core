import type { ExamQuestion } from "./types";

export const npExamBatch56Questions: ExamQuestion[] = [
  {
    q: "A 65-year-old female with a history of atrial fibrillation presents with sudden onset right-sided hemiplegia and global aphasia. CT head at 45 minutes is negative for hemorrhage. BP is 178/96 mmHg. What is the most appropriate intervention?",
    o: ["Administer IV alteplase (tPA) within the 4.5-hour window and do not lower BP unless above 185/110 before thrombolysis", "Administer aspirin 325 mg and observe", "Lower BP to 120/80 with IV labetalol before any further intervention", "Order MRI brain before making any treatment decisions"],
    a: 0,
    r: "Acute ischemic stroke with symptom onset under 4.5 hours and no hemorrhage on CT is an indication for IV alteplase (tPA). BP must be below 185/110 before and below 180/105 for 24 hours after administration. Current BP of 178/96 does not require treatment before tPA. Aspirin is given 24 hours after tPA, not concurrently. MRI provides more detail but should not delay time-critical thrombolytic therapy. NIHSS score guides treatment decisions. Door-to-needle time goal is under 60 minutes.",
    s: "Neurology"
  },
  {
    q: "A 72-year-old male with COPD presents with worsening dyspnea, increased sputum production, and purulent sputum over 3 days. SpO2 is 87% on room air. ABG: pH 7.32, PaCO2 58, HCO3 30, PaO2 55. What is the appropriate management?",
    o: ["Initiate controlled oxygen therapy targeting SpO2 88-92%, administer bronchodilators and systemic corticosteroids, and start antibiotics for acute exacerbation", "Intubate immediately for respiratory failure", "Administer high-flow oxygen at 15 L/min via non-rebreather mask", "Prescribe oral antibiotics only and discharge home"],
    a: 0,
    r: "This is an acute exacerbation of COPD (AECOPD) with increased dyspnea, sputum volume, and purulence (Anthonisen type I). ABG shows acute-on-chronic respiratory acidosis (compensated chronic hypercapnia with acute worsening). Management: 1) Controlled O2 to SpO2 88-92% (avoid suppressing hypoxic drive), 2) Short-acting bronchodilators (albuterol + ipratropium nebulized), 3) Systemic corticosteroids (prednisone 40 mg x 5 days per REDUCE trial), 4) Antibiotics (amoxicillin-clavulanate or azithromycin for Anthonisen type I), 5) Consider NIV (BiPAP) if pH remains below 7.35 despite initial treatment.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old female presents with progressive bilateral hand stiffness worse in the morning lasting over 1 hour, symmetric swelling of the MCP and PIP joints, and fatigue. RF is positive. ESR is 48 mm/hr. What initial DMARD therapy should the NP prescribe?",
    o: ["Methotrexate 7.5-15 mg weekly with folic acid supplementation as first-line DMARD therapy", "Prednisone 60 mg daily as sole therapy", "Hydroxychloroquine 400 mg daily as sole first-line agent", "Infliximab (TNF inhibitor) as initial monotherapy"],
    a: 0,
    r: "Methotrexate is the anchor first-line DMARD for rheumatoid arthritis per ACR/EULAR guidelines. Starting dose is 7.5-15 mg/week orally or subcutaneously, titrated to 25 mg/week. Folic acid 1 mg daily reduces side effects (mucositis, hepatotoxicity, cytopenias). Baseline labs: CBC, CMP with LFTs, hepatitis B/C serology, CXR. Monitoring: CBC and LFTs every 4-8 weeks. Corticosteroids are bridging therapy only (short-term). Biologic DMARDs (TNF inhibitors) are second-line after inadequate response to methotrexate. Hydroxychloroquine is less potent and used for mild disease or in combination.",
    s: "Musculoskeletal"
  },
  {
    q: "A 45-year-old male with no cardiac history presents with palpitations and irregular pulse. ECG shows irregularly irregular rhythm with no discernible P waves and a ventricular rate of 132 bpm. He is hemodynamically stable. What is the initial management?",
    o: ["Rate control with IV diltiazem or metoprolol to target heart rate below 110 bpm, assess CHA2DS2-VASc for anticoagulation, and evaluate for underlying cause", "Immediate synchronized cardioversion", "Administer amiodarone IV bolus", "Discharge with oral flecainide for pill-in-pocket strategy"],
    a: 0,
    r: "New-onset atrial fibrillation with rapid ventricular response in a hemodynamically stable patient is managed with rate control first. IV diltiazem (0.25 mg/kg bolus then infusion) or IV metoprolol are first-line agents targeting HR below 110 bpm (RACE II trial lenient rate control). Evaluate CHA2DS2-VASc score for stroke risk and initiate anticoagulation if score ≥2 in males or ≥3 in females. Workup: TFTs, echocardiogram, electrolytes. Cardioversion is reserved for hemodynamic instability or after appropriate anticoagulation for ≥3 weeks (or TEE-guided). Pill-in-pocket is for established paroxysmal AF.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old female presents with bilateral flank pain, fever of 102.4°F, dysuria, and CVA tenderness. Urinalysis shows WBCs, bacteria, and leukocyte esterase positive. She has no drug allergies and is not pregnant. What is the appropriate outpatient treatment?",
    o: ["Ciprofloxacin 500 mg BID for 7 days or TMP-SMX DS BID for 14 days, with urine culture to guide therapy", "Nitrofurantoin 100 mg BID for 5 days", "Amoxicillin 500 mg TID for 3 days", "Single-dose fosfomycin 3 g"],
    a: 0,
    r: "This presentation is consistent with acute pyelonephritis (upper UTI). Outpatient treatment for uncomplicated pyelonephritis: fluoroquinolone (ciprofloxacin 500 mg BID x 7 days or levofloxacin 750 mg daily x 5 days) is first-line if local resistance rates below 10%. TMP-SMX DS BID x 14 days is an alternative. Urine culture MUST be obtained before starting empiric therapy to guide de-escalation. Nitrofurantoin and fosfomycin do NOT achieve adequate renal tissue levels and are only appropriate for uncomplicated lower UTIs (cystitis). Amoxicillin monotherapy has high E. coli resistance rates.",
    s: "Renal"
  },
  {
    q: "A 62-year-old male with a 30-pack-year smoking history presents with hemoptysis, weight loss, and a 4-cm right upper lobe mass on chest CT. Biopsy confirms non-small cell lung cancer (squamous cell). PET scan shows no distant metastases. What staging workup and treatment plan should the NP coordinate?",
    o: ["Brain MRI for staging completion, pulmonary function testing for surgical candidacy, and referral to thoracic surgery for lobectomy with mediastinal lymph node dissection", "Start palliative chemotherapy without further staging", "Order serial CT scans every 3 months to monitor growth", "Refer for radiation therapy only"],
    a: 0,
    r: "For non-small cell lung cancer (NSCLC) without distant metastases on PET, complete staging requires brain MRI (brain is a common metastatic site, PET has poor sensitivity for brain metastases). If confirmed stage I-IIIA, surgical resection (lobectomy with systematic mediastinal lymph node dissection) offers the best chance of cure. Preoperative PFTs (FEV1, DLCO) assess surgical candidacy. Postoperative FEV1 predicted should be above 40%. Adjuvant chemotherapy may be recommended for stage II-IIIA. Palliative chemo is for stage IV. Watchful waiting is inappropriate for a biopsy-proven malignancy.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old female with type 2 diabetes (HbA1c 7.8%) and a recent diagnosis of heart failure with reduced ejection fraction (LVEF 35%) is on metformin and lisinopril. Which diabetes medication should the NP add for cardiovascular and renal benefit?",
    o: ["Empagliflozin (SGLT2 inhibitor) based on EMPA-REG OUTCOME and EMPEROR-Reduced trial evidence for HFrEF mortality and hospitalization reduction", "Glipizide (sulfonylurea) for rapid glucose lowering", "Pioglitazone (thiazolidinedione) for insulin sensitization", "Sitagliptin (DPP-4 inhibitor) for modest A1c reduction"],
    a: 0,
    r: "SGLT2 inhibitors (empagliflozin, dapagliflozin) have class I recommendation for HFrEF regardless of diabetes status (EMPEROR-Reduced, DAPA-HF trials). In diabetic patients with HF, they provide dual benefit: glucose lowering and cardiovascular protection (reduced HF hospitalization and cardiovascular death). Mechanism includes osmotic diuresis, reduced preload/afterload, and improved myocardial energetics. Pioglitazone is CONTRAINDICATED in HF (fluid retention). Saxagliptin (DPP-4i) was associated with increased HF hospitalizations (SAVOR-TIMI trial). Sulfonylureas offer no cardiovascular benefit.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old male presents with a PSA of 8.2 ng/mL (previously 4.1 eighteen months ago) and an abnormal digital rectal exam with a firm nodule. What is the most appropriate next step?",
    o: ["Refer for transrectal ultrasound-guided prostate biopsy (or MRI-fusion biopsy) for tissue diagnosis", "Repeat PSA in 6 months", "Start finasteride to lower PSA", "Order CT abdomen and pelvis for staging"],
    a: 0,
    r: "A rising PSA (PSA velocity above 0.75 ng/mL/year) combined with an abnormal DRE (firm nodule) raises high suspicion for prostate cancer and warrants tissue diagnosis via prostate biopsy. MRI-fusion guided biopsy is increasingly preferred over standard TRUS biopsy for improved detection of clinically significant cancer. Repeating PSA delays diagnosis. Starting finasteride artificially lowers PSA and masks disease progression. Staging CT is premature without histological diagnosis. If biopsy confirms cancer, staging (bone scan, CT/MRI) and risk stratification (Gleason score, PSA, stage) guide treatment decisions.",
    s: "Renal"
  },
  {
    q: "A 40-year-old female presents with episodic severe headaches, diaphoresis, palpitations, and hypertension (BP 210/130). She has a family history of medullary thyroid cancer. Which diagnosis should the NP suspect and what initial test should be ordered?",
    o: ["Pheochromocytoma; order 24-hour urine fractionated metanephrines and catecholamines or plasma free metanephrines", "Essential hypertension; start amlodipine", "Panic disorder; prescribe an SSRI", "Hyperthyroidism; order TSH and free T4"],
    a: 0,
    r: "The triad of episodic severe hypertension, diaphoresis, and palpitations/tachycardia is classic for pheochromocytoma (catecholamine-secreting adrenal tumor). Family history of medullary thyroid cancer raises suspicion for MEN 2A (medullary thyroid cancer + pheochromocytoma + primary hyperparathyroidism) or MEN 2B. Diagnosis: 24-hour urine fractionated metanephrines and catecholamines (sensitivity 98%) or plasma free metanephrines (sensitivity 99%). After biochemical confirmation, CT/MRI adrenals for tumor localization. CRITICAL: alpha-adrenergic blockade (phenoxybenzamine) MUST precede beta-blockade to prevent hypertensive crisis from unopposed alpha stimulation.",
    s: "Endocrine"
  },
  {
    q: "A 70-year-old male with a history of benign prostatic hyperplasia on tamsulosin presents with acute urinary retention, lower abdominal distension, and a palpable bladder. Post-void residual is 650 mL. Creatinine is 2.1 mg/dL (baseline 1.0). What is the priority management?",
    o: ["Insert urinary catheter for bladder decompression, monitor for post-obstructive diuresis, and assess for obstructive nephropathy with renal ultrasound", "Increase tamsulosin dose and discharge", "Start IV antibiotics for presumed UTI", "Schedule elective TURP within 2 weeks"],
    a: 0,
    r: "Acute urinary retention with elevated creatinine above baseline indicates obstructive uropathy causing acute kidney injury. Priority: urethral catheter placement for immediate bladder decompression. After catheterization, monitor for post-obstructive diuresis (which can cause significant fluid and electrolyte losses requiring IV fluid replacement). Renal ultrasound evaluates for hydronephrosis. Serial creatinine monitors for AKI recovery. Once the acute episode resolves, evaluate for definitive management (TURP, prostate artery embolization). Add or optimize alpha-blocker + 5-alpha reductase inhibitor (finasteride/dutasteride) for BPH medical management.",
    s: "Renal"
  },
  {
    q: "A 55-year-old female on chronic prednisone 20 mg daily for rheumatoid arthritis for 2 years needs a DEXA scan. T-score at the lumbar spine is -2.8. What pharmacologic intervention should the NP prescribe for glucocorticoid-induced osteoporosis?",
    o: ["Oral bisphosphonate (alendronate 70 mg weekly) with calcium 1200 mg and vitamin D 800-1000 IU daily, and attempt to taper prednisone to the lowest effective dose", "Calcium and vitamin D supplementation alone", "No treatment needed until a fracture occurs", "Teriparatide as first-line regardless of fracture history"],
    a: 0,
    r: "Glucocorticoid-induced osteoporosis (GIOP) is the most common secondary cause of osteoporosis. ACR guidelines recommend bisphosphonate therapy for patients on prednisone ≥2.5 mg/day for ≥3 months with T-score ≤-2.5 or FRAX-adjusted high fracture risk. Alendronate, risedronate, or zoledronic acid are first-line. Calcium (1200 mg/day) and vitamin D (800-1000 IU/day) are adjunctive but insufficient alone. Teriparatide is reserved for very high-risk patients (prior fractures, T-score below -3.5). Glucocorticoid dose reduction is essential. Fall prevention strategies should be implemented.",
    s: "Musculoskeletal"
  },
  {
    q: "A 28-year-old female presents with a 3-month history of bloody diarrhea, urgency, and tenesmus. Colonoscopy shows continuous mucosal inflammation from the rectum extending to the sigmoid colon with loss of vascular pattern and friability. Biopsies show crypt distortion and crypt abscesses. What is the diagnosis and initial treatment?",
    o: ["Ulcerative colitis (left-sided/distal); initiate mesalamine (5-ASA) oral plus rectal formulation as first-line induction and maintenance therapy", "Crohn disease; start methotrexate", "Infectious colitis; empiric ciprofloxacin and metronidazole", "Irritable bowel syndrome; dietary fiber supplementation"],
    a: 0,
    r: "Continuous mucosal inflammation starting at the rectum, crypt distortion, and crypt abscesses are pathognomonic for ulcerative colitis. Left-sided/distal UC (rectum to splenic flexure) is treated with combined oral and topical (rectal) mesalamine for induction and maintenance. Topical therapy (suppository for proctitis, enema for left-sided) provides direct mucosal contact. Response is assessed at 8-12 weeks. If inadequate response, escalate to corticosteroids (budesonide MMX or prednisone) for induction, then immunomodulators (azathioprine) or biologics (anti-TNF, vedolizumab). Stool studies must rule out C. difficile and other infections before starting immunosuppression.",
    s: "Gastrointestinal"
  },
  {
    q: "A 38-year-old male presents with severe epigastric pain radiating to the back, nausea, and vomiting after a heavy alcohol binge. Lipase is 1,200 U/L (normal below 160). BISAP score is 3. What management should the NP initiate?",
    o: ["Aggressive IV fluid resuscitation with lactated Ringer's, NPO status, IV analgesics, and ICU admission for severe acute pancreatitis", "Oral analgesics and low-fat diet", "ERCP within 24 hours", "Empiric IV antibiotics for presumed infected necrosis"],
    a: 0,
    r: "Acute pancreatitis with BISAP score ≥3 indicates severe disease with high complication risk (organ failure, necrosis). Management: 1) Aggressive IV crystalloid resuscitation (LR preferred over NS; goal-directed, 250-500 mL/hr initially with reassessment), 2) NPO initially with early oral feeding (within 24-48 hours if tolerated), 3) IV analgesics (multimodal approach, opioids if needed), 4) ICU monitoring for organ failure. ERCP is indicated only for gallstone pancreatitis with concurrent cholangitis or persistent biliary obstruction. Prophylactic antibiotics are NOT recommended (do not prevent infected necrosis per AGA guidelines). CT with contrast at 48-72 hours to assess for necrosis if not improving.",
    s: "Gastrointestinal"
  },
  {
    q: "A 60-year-old male with well-controlled HIV (undetectable viral load, CD4 520) presents for annual health maintenance. What cancer screening recommendations should the NP provide beyond standard age-appropriate guidelines?",
    o: ["Annual anal Pap smear for anal dysplasia screening, and ensure standard colorectal, lung (if smoking history), and prostate cancer screening per USPSTF guidelines", "No additional screening beyond standard guidelines", "Annual full-body PET scan for lymphoma surveillance", "Quarterly tumor marker panels (CEA, AFP, CA 19-9)"],
    a: 0,
    r: "People living with HIV have increased risk for HPV-related anal squamous cell carcinoma (16-37x higher than general population), even with well-controlled HIV. Annual digital anorectal exam and anal cytology (anal Pap) are recommended for HIV-positive MSM and women with history of cervical/vulvar dysplasia. High-resolution anoscopy (HRA) is performed for abnormal results. Standard age-appropriate screenings (colonoscopy from 45, low-dose CT for lung cancer if eligible, prostate cancer shared decision-making) apply. Cervical cancer screening may be more frequent (annual Pap for first 3 years after HIV diagnosis, then per standard guidelines if normal).",
    s: "Infectious Disease"
  },
  {
    q: "A 42-year-old female presents with fatigue, joint pain, and a butterfly-shaped facial rash that worsens with sun exposure. ANA is positive (1:640, homogeneous pattern). Anti-dsDNA antibodies are positive. Complement C3 and C4 are low. Urinalysis shows proteinuria 2+ and RBC casts. What is the diagnosis and what urgent evaluation is needed?",
    o: ["Systemic lupus erythematosus with suspected lupus nephritis; order quantitative urine protein-to-creatinine ratio and refer to nephrology for renal biopsy", "Drug-induced lupus; discontinue offending medication", "Fibromyalgia; start duloxetine", "Rosacea with coincidental positive ANA; topical metronidazole"],
    a: 0,
    r: "This presentation meets ACR/EULAR classification criteria for SLE: malar rash, photosensitivity, positive ANA with anti-dsDNA antibodies, low complement, and renal involvement. Proteinuria with RBC casts indicates glomerulonephritis (lupus nephritis), which occurs in 40-60% of SLE patients and is a major cause of morbidity. Urgent evaluation: quantitative urine protein (spot protein-to-creatinine ratio or 24-hour collection), serum creatinine, nephrology referral for renal biopsy (ISN/RPS classification guides treatment). Class III/IV lupus nephritis requires aggressive immunosuppression (mycophenolate mofetil or cyclophosphamide induction, then maintenance therapy). Hydroxychloroquine is foundational therapy for all SLE patients.",
    s: "Musculoskeletal"
  },
  {
    q: "A 55-year-old male with alcohol use disorder presents with confusion, ataxia, and ophthalmoplegia. He is malnourished with BMI 17. What is the diagnosis and what must be administered before any glucose-containing IV fluids?",
    o: ["Wernicke encephalopathy; administer IV thiamine (vitamin B1) 500 mg TID for 3 days before dextrose-containing fluids to prevent irreversible Korsakoff syndrome", "Delirium tremens; IV lorazepam", "Hepatic encephalopathy; lactulose", "Alcohol intoxication; IV normal saline only"],
    a: 0,
    r: "The classic triad of confusion, ataxia, and ophthalmoplegia (nystagmus, lateral rectus palsy) defines Wernicke encephalopathy, caused by thiamine (B1) deficiency in chronic alcohol use. CRITICAL: IV thiamine MUST be given BEFORE glucose administration. Glucose metabolism consumes thiamine; giving glucose to a thiamine-depleted patient can precipitate or worsen Wernicke encephalopathy and cause irreversible progression to Korsakoff syndrome (permanent anterograde amnesia, confabulation). Treatment: high-dose IV thiamine (minimum 500 mg TID x 3 days, then 250 mg daily) plus magnesium (thiamine cofactor). Oral thiamine is inadequate in acute Wernicke due to impaired GI absorption in alcoholics.",
    s: "Neurology"
  },
  {
    q: "A 30-year-old female with generalized anxiety disorder has failed adequate trials of sertraline and escitalopram. She reports persistent worry, muscle tension, insomnia, and difficulty concentrating. What pharmacologic strategy should the NP consider?",
    o: ["Switch to SNRI (venlafaxine XR or duloxetine) as second-line pharmacotherapy for treatment-resistant generalized anxiety disorder", "Add a second SSRI", "Start long-term benzodiazepine monotherapy", "Prescribe quetiapine as first-line monotherapy"],
    a: 0,
    r: "After failure of two adequate SSRI trials (8-12 weeks at therapeutic doses), SNRIs (venlafaxine XR 75-225 mg/day or duloxetine 60-120 mg/day) are recommended second-line agents for GAD. SNRIs have FDA approval for GAD and provide dual serotonergic and noradrenergic modulation. Combining two SSRIs increases side effects without proven benefit. Long-term benzodiazepine monotherapy is not recommended due to dependence risk, tolerance, and cognitive effects. Quetiapine has evidence for GAD but carries metabolic side effects (weight gain, diabetes) and is considered third-line. Buspirone augmentation is another option. CBT should be offered alongside pharmacotherapy.",
    s: "Psychiatry"
  },
  {
    q: "A 6-month-old infant presents with fever, irritability, and pulling at the right ear. Otoscopic exam reveals a bulging, erythematous, immobile tympanic membrane with purulent effusion. This is the first episode. What antibiotic should the NP prescribe?",
    o: ["High-dose amoxicillin 80-90 mg/kg/day divided BID for 10 days as first-line treatment for acute otitis media", "Azithromycin 10 mg/kg day 1, then 5 mg/kg days 2-5", "Ciprofloxacin otic drops", "Observation only without antibiotics"],
    a: 0,
    r: "AAP guidelines recommend immediate antibiotic therapy for AOM in infants under 6 months, children with severe symptoms (moderate/severe otalgia, fever ≥39°C), bilateral AOM in children under 2, or AOM with otorrhea. High-dose amoxicillin (80-90 mg/kg/day) is first-line, covering the most common pathogens (S. pneumoniae, H. influenzae, M. catarrhalis) including intermediate-resistant pneumococci. Duration: 10 days for children under 2 years, 5-7 days for children ≥2 with mild symptoms. Observation alone is only appropriate for older children (≥2 years) with unilateral mild AOM. Azithromycin is alternative for penicillin allergy only.",
    s: "Pediatrics"
  },
  {
    q: "A 65-year-old female with a history of osteoarthritis reports progressive right knee pain that is now limiting her ability to walk more than one block. She has tried acetaminophen, NSAIDs, physical therapy, and intra-articular corticosteroid injections without adequate relief. Weight-bearing X-ray shows bone-on-bone contact with osteophytes. What should the NP recommend?",
    o: ["Referral to orthopedic surgery for total knee arthroplasty evaluation, as conservative management has been exhausted", "Increase NSAID dose to maximum", "Start opioid therapy for chronic pain management", "Try viscosupplementation (hyaluronic acid injection) as definitive treatment"],
    a: 0,
    r: "After exhausting conservative measures (acetaminophen, NSAIDs, PT, weight management, corticosteroid injections) with persistent functional limitation and radiographic evidence of severe OA (bone-on-bone, Kellgren-Lawrence grade 4), total knee arthroplasty (TKA) referral is appropriate. TKA has excellent outcomes: 90% of patients report significant pain reduction and 95% prosthesis survival at 15 years. Increasing NSAID dose increases GI, cardiovascular, and renal risks. Chronic opioid therapy is not recommended for OA. Viscosupplementation has limited evidence and is not definitive treatment for severe end-stage OA.",
    s: "Musculoskeletal"
  },
  {
    q: "A 48-year-old female presents with a painless thyroid nodule discovered on physical exam. TSH is suppressed at 0.1 mIU/L. What is the appropriate next diagnostic step?",
    o: ["Radioactive iodine uptake and scan to determine if the nodule is functioning (hot) or non-functioning (cold)", "Immediate fine needle aspiration biopsy", "Start levothyroxine empirically", "Order CT neck with contrast"],
    a: 0,
    r: "When TSH is suppressed (below normal), the ATA guidelines recommend radioactive iodine uptake (RAIU) scan before FNA. A hot (hyperfunctioning) nodule autonomously produces thyroid hormone, is almost never malignant (less than 1%), and does not require biopsy. A cold (non-functioning) or indeterminate nodule requires ultrasound-guided FNA for cytologic evaluation. CT with IV contrast is generally avoided because iodinated contrast can interfere with subsequent radioactive iodine therapy if needed and can worsen hyperthyroidism. FNA without prior RAIU in a suppressed TSH context may lead to unnecessary biopsy of a benign hot nodule.",
    s: "Endocrine"
  },
  {
    q: "A 75-year-old male with heart failure with preserved ejection fraction (HFpEF, LVEF 62%) presents with exertional dyspnea and bilateral lower extremity edema. BNP is 380 pg/mL. He is on amlodipine 10 mg and lisinopril 20 mg. What should the NP add?",
    o: ["Diuretic therapy (furosemide or bumetanide) for volume management, and consider adding an SGLT2 inhibitor based on EMPEROR-Preserved and DELIVER trial evidence", "Digoxin 0.25 mg daily", "Carvedilol 25 mg twice daily", "Sacubitril-valsartan to replace lisinopril"],
    a: 0,
    r: "HFpEF management focuses on volume control, comorbidity management, and now includes SGLT2 inhibitors. Diuretics are first-line for congestion symptoms. EMPEROR-Preserved (empagliflozin) and DELIVER (dapagliflozin) trials demonstrated significant reduction in HF hospitalization in HFpEF patients, leading to class IIa recommendation. Unlike HFrEF, traditional HF medications (beta-blockers, ACEi/ARBs, MRAs) have not shown mortality benefit in HFpEF. Sacubitril-valsartan showed borderline benefit in PARAGON-HF. Digoxin has no role in HFpEF. Address contributing factors: HTN control, AF rate control, weight management, sleep apnea treatment.",
    s: "Cardiovascular"
  },
  {
    q: "A 32-year-old female G1P0 at 10 weeks gestation presents for initial prenatal visit. She takes valproic acid for epilepsy. What medication change should the NP urgently coordinate with her neurologist?",
    o: ["Switch from valproic acid to a safer antiepileptic drug (lamotrigine or levetiracetam) due to high teratogenicity risk including neural tube defects", "Continue valproic acid as seizure control takes priority over fetal risks", "Discontinue all antiepileptic medications during pregnancy", "Add high-dose folic acid and continue valproic acid"],
    a: 0,
    r: "Valproic acid is the most teratogenic commonly prescribed AED, with a 6-11% risk of major congenital malformations (particularly neural tube defects including spina bifida, cardiac defects, hypospadias) and dose-dependent risk of neurodevelopmental delay (lower IQ, autism spectrum). FDA pregnancy category X. Lamotrigine and levetiracetam have the best safety profiles in pregnancy. Medication switch should be done as early as possible, though neural tube closure occurs by week 4 (may already be past critical window at 10 weeks). Abrupt AED discontinuation risks status epilepticus. High-dose folic acid (4-5 mg/day) should be given to all women on AEDs before and during pregnancy but does not fully mitigate valproate risk.",
    s: "Obstetrics"
  },
  {
    q: "A 55-year-old male presents with chronic low back pain for 6 months without radiculopathy, neurological deficits, or red flag symptoms. He has tried NSAIDs and physical therapy with minimal improvement. MRI shows age-appropriate degenerative changes. What is the next appropriate step?",
    o: ["Trial of duloxetine (SNRI) for chronic low back pain, continue physical therapy with cognitive behavioral therapy referral, and avoid opioid initiation", "Order repeat MRI in 3 months", "Prescribe oxycodone for chronic pain management", "Refer for spinal fusion surgery"],
    a: 0,
    r: "ACP/APS guidelines for chronic low back pain without red flags: first-line non-pharmacologic (exercise, PT, CBT, mindfulness-based stress reduction), then pharmacologic (NSAIDs, then duloxetine or tramadol as second-line). Duloxetine has FDA approval for chronic musculoskeletal pain and addresses both pain and common comorbid depression/anxiety. Opioids are NOT recommended for chronic non-cancer pain due to limited efficacy, tolerance, dependence, and overdose risk. Repeat MRI is unnecessary without new symptoms. Spinal surgery for non-specific low back pain without structural pathology has poor outcomes. Multidisciplinary pain rehabilitation programs show the best long-term results.",
    s: "Musculoskeletal"
  },
  {
    q: "A 70-year-old female presents with progressive memory loss over 18 months, difficulty managing finances, and getting lost in familiar places. MMSE score is 18/30. MRI shows hippocampal atrophy with generalized cortical atrophy. Basic metabolic panel, TSH, B12, and RPR are normal. What is the most likely diagnosis and initial pharmacotherapy?",
    o: ["Alzheimer disease; start donepezil (cholinesterase inhibitor) 5 mg daily for 4-6 weeks, then increase to 10 mg daily if tolerated", "Normal age-related cognitive decline; reassurance only", "Vascular dementia; start aspirin", "Major depressive disorder presenting as pseudodementia; start sertraline"],
    a: 0,
    r: "Progressive memory loss with difficulty in executive function (finances) and visuospatial impairment (getting lost), MMSE below 24, and MRI showing hippocampal and cortical atrophy with normal reversible cause workup is consistent with Alzheimer disease. Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) are first-line for mild-moderate AD. Donepezil: start 5 mg daily, increase to 10 mg after 4-6 weeks. For moderate-severe AD, add memantine (NMDA antagonist). Reversible causes ruled out: hypothyroidism (TSH), B12 deficiency, neurosyphilis (RPR), depression. Comprehensive management includes caregiver support, safety assessment, advance care planning, and driving evaluation.",
    s: "Neurology"
  },
  {
    q: "A 45-year-old male with a BMI of 42 and comorbidities of type 2 diabetes (A1c 8.5%), obstructive sleep apnea, and hypertension has failed to achieve meaningful weight loss with diet, exercise, and pharmacotherapy. What should the NP discuss regarding surgical intervention?",
    o: ["Referral for bariatric surgery evaluation, as BMI above 40 or BMI above 35 with obesity-related comorbidities meets criteria per ASMBS and IFSO guidelines", "Continue current approach for another 12 months", "Prescribe a very-low-calorie diet of 500 calories per day indefinitely", "Start growth hormone therapy for metabolic acceleration"],
    a: 0,
    r: "Bariatric surgery indications (ASMBS/IFSO updated guidelines 2022): BMI ≥40, or BMI ≥35 with obesity-related comorbidities (T2DM, OSA, HTN, NAFLD, GERD), or BMI 30-35 with inadequately controlled T2DM. This patient meets multiple criteria. Roux-en-Y gastric bypass and sleeve gastrectomy produce 60-70% excess weight loss and significant diabetes remission (up to 80% for RYGB). Preoperative evaluation includes psychological assessment, nutritional counseling, cardiac clearance, and sleep study. Lifelong vitamin/mineral supplementation (B12, iron, calcium, vitamin D) and follow-up are required. Very-low-calorie diets are unsustainable and lead to metabolic adaptation.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old male with stage 3b CKD (eGFR 38) has a hemoglobin of 9.2 g/dL, ferritin 45 ng/mL, and TSAT 15%. What is the appropriate management for his anemia?",
    o: ["IV iron supplementation first to replete iron stores (target ferritin above 200 and TSAT above 20%), then reassess for erythropoiesis-stimulating agent if hemoglobin remains below 10", "Start erythropoietin immediately", "Transfuse 2 units of packed red blood cells", "Oral iron supplementation alone"],
    a: 0,
    r: "CKD-associated anemia management per KDIGO: iron deficiency must be corrected BEFORE starting ESAs. This patient has iron deficiency (ferritin below 100, TSAT below 20%). IV iron (ferric carboxymaltose, iron sucrose) is preferred in CKD stages 3-5 because oral iron has poor absorption due to elevated hepcidin in CKD. Target: ferritin 200-500 and TSAT 20-30%. If Hgb remains below 10 g/dL after iron repletion, consider ESA (epoetin alfa or darbepoetin) with target Hgb 10-11.5 (not above 13 due to cardiovascular risk per TREAT and CHOIR trials). Transfusion is reserved for symptomatic severe anemia or Hgb below 7 and should be avoided in transplant candidates to prevent alloimmunization.",
    s: "Renal"
  },
  {
    q: "A 35-year-old female presents with recurrent episodes of right upper quadrant pain after fatty meals, nausea, and a positive Murphy sign. Ultrasound shows cholelithiasis with a thickened gallbladder wall and pericholecystic fluid. WBC is 14,000 and temperature is 101.6°F. What is the appropriate management?",
    o: ["Admit for IV antibiotics (piperacillin-tazobactam or ceftriaxone plus metronidazole) and urgent cholecystectomy within 72 hours", "Prescribe oral antibiotics and schedule elective cholecystectomy in 6 weeks", "Recommend a low-fat diet and ursodiol for gallstone dissolution", "Order HIDA scan to confirm cholecystitis before any treatment"],
    a: 0,
    r: "Positive Murphy sign, gallstones on US, thickened gallbladder wall, pericholecystic fluid, leukocytosis, and fever meet Tokyo Guidelines criteria for acute cholecystitis (Grade II moderate severity). Management: IV antibiotics covering enteric organisms (piperacillin-tazobactam or ceftriaxone + metronidazole) and early laparoscopic cholecystectomy (within 72 hours of symptom onset per ACPGBI and Tokyo Guidelines -- early surgery reduces total hospital stay and complications compared to delayed surgery). HIDA scan is useful when diagnosis is uncertain (equivocal US) but is unnecessary here with classic presentation. Ursodiol is for asymptomatic small cholesterol stones only.",
    s: "Gastrointestinal"
  },
  {
    q: "A 22-year-old female presents with amenorrhea for 4 months, weight loss (BMI 16.5), excessive exercise, and preoccupation with body weight. She denies pregnancy. Labs: FSH low, LH low, estradiol low. Pregnancy test negative. What is the most likely diagnosis?",
    o: ["Functional hypothalamic amenorrhea secondary to anorexia nervosa; multidisciplinary treatment with nutritional rehabilitation, psychotherapy, and medical monitoring", "Primary ovarian insufficiency", "Polycystic ovary syndrome", "Prolactinoma"],
    a: 0,
    r: "Low BMI (below 18.5), excessive exercise, body image preoccupation, and amenorrhea with low gonadotropins (FSH, LH) and low estradiol indicate functional hypothalamic amenorrhea (FHA) from energy deficit, most commonly seen in anorexia nervosa. Hypothalamic GnRH suppression from caloric deficit leads to hypogonadotropic hypogonadism. Management: multidisciplinary team (psychiatrist/psychologist, dietitian, medical provider), nutritional rehabilitation with weight restoration, CBT for eating disorder, and monitoring for complications (osteoporosis, cardiac arrhythmias, electrolyte abnormalities). POI would show elevated FSH. PCOS would show hyperandrogenism and typically normal/elevated LH. Prolactinoma would show elevated prolactin.",
    s: "Endocrine"
  },
  {
    q: "A 68-year-old male with Parkinson disease on carbidopa-levodopa for 8 years develops involuntary choreiform movements of the face and limbs occurring at peak medication effect. What should the NP adjust?",
    o: ["Reduce individual levodopa doses and increase dosing frequency to minimize peak-dose dyskinesias while maintaining overall motor benefit", "Double the levodopa dose", "Discontinue carbidopa-levodopa entirely", "Add haloperidol for dyskinesia control"],
    a: 0,
    r: "Peak-dose dyskinesias are involuntary movements (chorea, dystonia) occurring when levodopa plasma levels are highest, common after years of levodopa therapy due to pulsatile dopaminergic stimulation. Management: reduce individual doses and increase frequency (more continuous dopaminergic stimulation), add COMT inhibitor (entacapone) to smooth out levodopa levels, consider amantadine (the only FDA-approved medication for levodopa-induced dyskinesias), or refer for deep brain stimulation (DBS) evaluation. Never abruptly discontinue levodopa (risk of neuroleptic malignant-like syndrome). Haloperidol (dopamine antagonist) would worsen parkinsonism dramatically.",
    s: "Neurology"
  },
  {
    q: "A 50-year-old male with major depressive disorder on fluoxetine 40 mg daily for 6 weeks reports only partial response. PHQ-9 score is 14 (moderate depression). What is the most evidence-based augmentation strategy?",
    o: ["Add low-dose aripiprazole (2-5 mg daily) as augmentation therapy based on STAR*D and multiple RCTs supporting atypical antipsychotic augmentation for partial SSRI response", "Add another SSRI (paroxetine)", "Switch to an MAOI immediately", "Add lithium 300 mg TID without monitoring"],
    a: 0,
    r: "Atypical antipsychotic augmentation (aripiprazole 2-15 mg, quetiapine XR, brexpiprazole) is a well-established strategy for treatment-resistant depression (TRD) after partial SSRI response. Aripiprazole augmentation has FDA approval for adjunctive MDD treatment. Partial D2 agonism provides unique mechanism complementing serotonergic effects. STAR*D trial demonstrated that by step 3-4, augmentation strategies outperform switching. Adding a second SSRI is not recommended (additive side effects without proven benefit). MAOI cannot be combined with fluoxetine (serotonin syndrome risk; requires 5-week washout for fluoxetine due to long half-life of norfluoxetine). Lithium augmentation is evidence-based but requires level monitoring and is less commonly used.",
    s: "Psychiatry"
  },
  {
    q: "A 3-year-old child presents with periorbital edema, abdominal distension, and generalized edema. Urinalysis shows 4+ protein with no blood. Serum albumin is 1.8 g/dL. Cholesterol is 380 mg/dL. What is the most likely diagnosis and initial treatment?",
    o: ["Minimal change disease (nephrotic syndrome); initiate oral prednisone 2 mg/kg/day for 4-6 weeks as first-line treatment", "Acute post-streptococcal glomerulonephritis; antibiotics", "Henoch-Schönlein purpura; supportive care", "Urinary tract infection; trimethoprim-sulfamethoxazole"],
    a: 0,
    r: "Nephrotic syndrome in children aged 1-6 years is most commonly minimal change disease (MCD, 80% of cases). Classic presentation: massive proteinuria (3.5+ g/day or 4+ on dipstick), hypoalbuminemia (below 2.5 g/dL), hyperlipidemia, and generalized edema (periorbital earliest, then dependent). MCD is treated empirically with corticosteroids (prednisone 2 mg/kg/day, max 60 mg, for 4-6 weeks, then taper over 2-6 months) without renal biopsy initially. Over 90% of children with MCD are steroid-responsive. Biopsy is reserved for steroid-resistant cases, atypical age, or hematuria/hypertension suggesting alternative diagnosis. Monitor for steroid side effects and thromboembolic complications.",
    s: "Pediatrics"
  },
  {
    q: "A 65-year-old female with a 10-year history of type 2 diabetes presents with burning pain, tingling, and numbness in both feet in a stocking distribution. Monofilament testing shows decreased sensation bilaterally. What pharmacologic treatment should the NP prescribe for neuropathic pain?",
    o: ["Pregabalin or duloxetine as first-line pharmacotherapy for diabetic peripheral neuropathy pain, with optimization of glycemic control", "Acetaminophen 1000 mg TID", "Opioids as initial therapy", "Topical hydrocortisone cream"],
    a: 0,
    r: "Diabetic peripheral neuropathy (DPN) treatment per AAN/ADA guidelines: first-line agents are pregabalin (FDA-approved), duloxetine (FDA-approved), and gabapentin. Pregabalin: start 75 mg BID, titrate to 300 mg/day. Duloxetine: start 30 mg daily, increase to 60 mg. Topical capsaicin 8% patch is adjunctive. Acetaminophen and NSAIDs are ineffective for neuropathic pain. Opioids are not first-line due to risks. Optimizing HbA1c (below 7%) slows progression but does not reverse established neuropathy. Annual foot exams, proper footwear, and patient education on foot care are essential to prevent diabetic foot ulcers and amputation.",
    s: "Neurology"
  },
  {
    q: "A 40-year-old male presents with episodic wheezing, chest tightness, and dyspnea that occur 3-4 times per week with nocturnal symptoms twice a month. He uses albuterol PRN 3 times per week. Spirometry: FEV1 78% predicted with 15% improvement after bronchodilator. What step of asthma therapy should the NP initiate?",
    o: ["Step 2: low-dose inhaled corticosteroid (ICS) daily as controller therapy (fluticasone 88 mcg BID or budesonide 180 mcg BID) with albuterol PRN for rescue", "Continue albuterol PRN only", "Start oral prednisone daily", "Prescribe a long-acting beta-agonist (LABA) alone"],
    a: 0,
    r: "Per GINA/NAEPP guidelines, this patient has moderate persistent asthma (symptoms >2 days/week, nighttime symptoms >2x/month, FEV1 60-80%, rescue inhaler use >2 days/week). Step 2 therapy: low-dose ICS (beclomethasone 80-240 mcg, budesonide 180-600 mcg, or fluticasone 88-264 mcg daily) is the cornerstone controller. Alternative: leukotriene receptor antagonist (montelukast) for ICS-intolerant patients. SABA PRN as rescue. LABA monotherapy is contraindicated (black box warning for increased asthma mortality). Oral steroids are for exacerbations, not maintenance. Step up if not controlled after 2-6 weeks on appropriate therapy.",
    s: "Respiratory"
  },
  {
    q: "A 58-year-old male with newly diagnosed major depressive disorder and chronic pain has a past history of benzodiazepine use disorder. Which antidepressant should the NP avoid prescribing?",
    o: ["Alprazolam or any benzodiazepine; instead select duloxetine which addresses both depression and chronic pain without abuse potential", "Sertraline", "Bupropion", "Mirtazapine"],
    a: 0,
    r: "In patients with a history of substance use disorder involving benzodiazepines, prescribing any benzodiazepine (alprazolam, lorazepam, clonazepam, diazepam) is contraindicated due to high relapse and dependence risk. Duloxetine (SNRI) is an excellent choice for this patient as it has FDA indications for both MDD and chronic pain conditions (diabetic neuropathy, fibromyalgia, chronic musculoskeletal pain) without abuse potential. Sertraline and bupropion are safe alternatives for depression. Mirtazapine may help with insomnia and appetite. Gabapentin/pregabalin should also be used cautiously as they carry abuse potential in patients with SUD history.",
    s: "Psychiatry"
  },
  {
    q: "A 72-year-old female presents with sudden onset severe tearing abdominal pain radiating to the back. She has a known 5.8 cm abdominal aortic aneurysm. BP is 82/50, HR 120, and she is diaphoretic. What is the immediate priority?",
    o: ["Activate emergency vascular surgery for suspected ruptured AAA, initiate large-bore IV access with permissive hypotension (target SBP 70-80), and type and crossmatch for massive transfusion", "Order CT angiogram before any intervention", "Start IV antibiotics for suspected peritonitis", "Administer IV nitroprusside to lower blood pressure"],
    a: 0,
    r: "Sudden severe abdominal/back pain with known large AAA (above 5.5 cm) and hemodynamic instability (hypotension, tachycardia) is a ruptured AAA until proven otherwise. This is a surgical emergency with 80-90% mortality without intervention. Management: 1) Immediate vascular surgery activation (open repair or EVAR if anatomy favorable), 2) Large-bore IV access (14-16 gauge x2), 3) Permissive hypotension (SBP 70-80, avoid aggressive fluid resuscitation which increases bleeding), 4) Massive transfusion protocol activation. CT imaging should not delay surgical intervention in unstable patients. Lowering BP further would worsen end-organ perfusion.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female healthcare worker is found to have a positive tuberculin skin test (TST) with 12 mm induration. She has no symptoms, normal chest X-ray, and no known TB exposure. She received BCG vaccination as a child. What should the NP do?",
    o: ["Order interferon-gamma release assay (IGRA) to differentiate true latent TB infection from BCG-related false positive, and treat LTBI if IGRA is positive", "Start 4-drug anti-TB therapy immediately", "Repeat TST in 2 weeks", "No further workup needed since BCG causes false positives"],
    a: 0,
    r: "In BCG-vaccinated individuals, TST may be false-positive due to cross-reactivity. IGRA (QuantiFERON-TB Gold or T-SPOT.TB) is preferred for confirmation because it uses M. tuberculosis-specific antigens (ESAT-6, CFP-10) not present in BCG strains. If IGRA is positive: treat latent TB infection (LTBI) with 4 months rifampin (preferred per ATS/CDC 2020) or 3 months isoniazid-rifapentine (3HP), or 9 months isoniazid. Healthcare workers with positive TST ≥10 mm require evaluation regardless of BCG history. Active TB must always be excluded with chest X-ray and symptom assessment before starting LTBI treatment. 4-drug therapy (RIPE) is for active TB only.",
    s: "Infectious Disease"
  },
  {
    q: "A 60-year-old male with chronic hepatitis C (genotype 1a) and compensated cirrhosis (Child-Pugh A) presents for treatment. His eGFR is 45. What antiviral regimen should the NP coordinate for hepatitis C cure?",
    o: ["Glecaprevir-pibrentasvir (Mavyret) for 8-12 weeks as a pangenotypic DAA regimen safe in renal impairment, with monitoring for hepatic decompensation", "Interferon-alpha and ribavirin for 48 weeks", "Sofosbuvir-based regimen without dose adjustment", "No treatment available for HCV with cirrhosis"],
    a: 0,
    r: "Direct-acting antiviral (DAA) therapy has revolutionized HCV treatment with >95% SVR12 (cure) rates. Glecaprevir-pibrentasvir is pangenotypic (all genotypes 1-6), safe in severe renal impairment (eGFR below 30, including dialysis; primarily hepatic metabolism), and effective in compensated cirrhosis. Duration: 8 weeks for treatment-naive without cirrhosis, 8-12 weeks with compensated cirrhosis. Sofosbuvir-based regimens require eGFR above 30 (renal clearance). Interferon-based regimens are obsolete due to poor tolerability and inferior SVR. Patients with cirrhosis require HCC surveillance (ultrasound ± AFP every 6 months) indefinitely even after SVR achievement.",
    s: "Gastrointestinal"
  },
  {
    q: "A 55-year-old female with a history of breast cancer treated with tamoxifen presents with abnormal uterine bleeding. Transvaginal ultrasound shows an endometrial thickness of 14 mm. What is the appropriate next step?",
    o: ["Endometrial biopsy to evaluate for tamoxifen-associated endometrial pathology including hyperplasia, polyps, or carcinoma", "Reassurance that tamoxifen commonly causes endometrial thickening with no clinical significance", "Switch from tamoxifen to an aromatase inhibitor without further workup", "Repeat ultrasound in 6 months"],
    a: 0,
    r: "Tamoxifen acts as a selective estrogen receptor modulator (SERM) with estrogenic effects on the endometrium, increasing risk of endometrial polyps, hyperplasia, and carcinoma (2-7x increased risk). Any abnormal uterine bleeding in a tamoxifen-treated patient requires endometrial biopsy regardless of endometrial thickness. Endometrial thickness above 5 mm in postmenopausal women or abnormal bleeding in premenopausal women warrants tissue sampling. While tamoxifen does cause endometrial thickening on ultrasound, this finding combined with bleeding requires histologic evaluation. Medication adjustment decisions should follow pathology results.",
    s: "Obstetrics"
  },
  {
    q: "A 25-year-old male presents with a 2-week history of progressive bilateral lower extremity weakness ascending from the feet, decreased deep tendon reflexes, and paresthesias. He had a respiratory infection 3 weeks ago. CSF shows albuminocytologic dissociation (elevated protein with normal cell count). What is the diagnosis and urgent monitoring requirement?",
    o: ["Guillain-Barré syndrome; urgent monitoring of respiratory function with serial forced vital capacity measurements, with ICU admission if FVC falls below 20 mL/kg", "Multiple sclerosis; start interferon beta", "Myasthenia gravis; pyridostigmine", "Transverse myelitis; high-dose IV corticosteroids"],
    a: 0,
    r: "Ascending symmetric weakness with areflexia following a viral illness and CSF showing elevated protein with normal WBC count (albuminocytologic dissociation) is classic Guillain-Barré syndrome (acute inflammatory demyelinating polyneuropathy). Critical concern: respiratory failure from diaphragmatic weakness. Monitor FVC every 4-6 hours; intubate if FVC below 20 mL/kg, NIF below -30 cmH2O, or greater than 30% decline (20/30/40 rule). Treatment: IV immunoglobulin (IVIG) 0.4 g/kg/day x 5 days OR plasmapheresis (equally effective). Corticosteroids are NOT effective in GBS. Autonomic dysfunction (cardiac arrhythmias, BP instability) requires telemetry monitoring. Most patients recover but 5-10% have permanent disability.",
    s: "Neurology"
  },
  {
    q: "A 50-year-old female presents with a serum calcium of 11.8 mg/dL, PTH 95 pg/mL (elevated), phosphorus 2.1 mg/dL (low), and a 24-hour urine calcium of 320 mg. DEXA shows T-score -2.7 at the lumbar spine. What is the definitive treatment?",
    o: ["Parathyroidectomy, as this patient meets surgical criteria for primary hyperparathyroidism with osteoporosis (T-score below -2.5)", "Observation with annual monitoring", "Start calcitonin nasal spray", "Cinacalcet as definitive therapy"],
    a: 0,
    r: "Primary hyperparathyroidism (PHPT): elevated calcium with inappropriately elevated PTH and low phosphorus. Elevated urine calcium excludes familial hypocalciuric hypercalcemia (FHH). Surgical indications (4th International Workshop 2014): 1) Serum calcium >1 mg/dL above normal, 2) T-score ≤-2.5 at any site, 3) Vertebral fracture, 4) eGFR <60, 5) Age <50, 6) 24-hr urine calcium >400 mg. This patient meets criteria with T-score -2.7. Parathyroidectomy is curative (95-98% success rate). Preoperative localization with sestamibi scan and/or 4D CT. Cinacalcet is for surgical contraindications only (does not improve bone density). Post-operative monitoring: hungry bone syndrome (hypocalcemia) from rapid calcium deposition.",
    s: "Endocrine"
  }
];
