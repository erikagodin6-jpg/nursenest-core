import type { ExamQuestion } from "./types";

export const npExamBatch62Questions: ExamQuestion[] = [
  {
    q: "A 65-year-old male with a history of paroxysmal atrial fibrillation undergoes cardioversion. Post-procedure, he develops acute onset right foot pain with a cold, pale, pulseless extremity. What is the most likely diagnosis and immediate intervention?",
    o: ["Acute arterial embolism from atrial thrombus; emergent vascular surgery consultation for thrombectomy and systemic anticoagulation", "Deep vein thrombosis; start LMWH and compression stockings", "Peripheral neuropathy exacerbation; gabapentin", "Gout flare of the foot; colchicine"],
    a: 0,
    r: "Acute limb ischemia presenting with the '6 Ps' (Pain, Pallor, Pulselessness, Poikilothermia, Paresthesias, Paralysis) following cardioversion is highly suspicious for arterial embolism from a left atrial thrombus dislodged during rhythm conversion. This is a vascular emergency requiring emergent surgical thrombectomy (or catheter-directed therapy) within 6 hours to prevent limb loss. Systemic anticoagulation with IV heparin should be initiated immediately. This underscores the importance of adequate anticoagulation for at least 3 weeks before elective cardioversion or TEE to exclude atrial thrombus. DVT does not cause arterial symptoms. This acute presentation does not fit chronic neuropathy or gout.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old female with rheumatoid arthritis on methotrexate 20 mg weekly presents with new onset cough, low-grade fever, and bilateral ground-glass opacities on CT chest. She was recently started on a biologic DMARD (adalimumab). What must be ruled out?",
    o: ["Methotrexate pneumonitis and opportunistic infection (including Pneumocystis jirovecii and tuberculosis)", "Lung cancer only", "Allergic rhinitis with post-nasal drip", "COPD exacerbation"],
    a: 0,
    r: "Patients on methotrexate AND biologic DMARDs (TNF-alpha inhibitors like adalimumab) have dual immunosuppressive risk. New pulmonary symptoms require evaluating for: (1) methotrexate-induced pneumonitis (a hypersensitivity reaction occurring at any point during therapy, presenting with cough, dyspnea, and ground-glass opacities), (2) opportunistic infections including PJP (Pneumocystis jirovecii pneumonia) and reactivation tuberculosis (TNF-alpha inhibitors significantly increase TB risk — all patients should have had TB screening before biologic initiation), and (3) bacterial pneumonia. Workup includes sputum cultures, beta-D-glucan, TB testing, and possibly bronchoscopy with BAL. Holding immunosuppressive therapy is essential pending evaluation.",
    s: "Respiratory"
  },
  {
    q: "A 28-year-old female presents with cyclic pelvic pain that worsens before menstruation, deep dyspareunia, and painful defecation during menses. She has no desire for fertility. What is the first-line pharmacologic treatment for suspected endometriosis?",
    o: ["Combined hormonal contraceptives (continuous use) or progestin-only therapy for symptom suppression", "GnRH agonist (leuprolide) as first-line", "Danazol 200 mg BID", "Empiric antibiotics for suspected PID"],
    a: 0,
    r: "For patients with suspected endometriosis who do not desire fertility, empiric hormonal suppression with combined hormonal contraceptives (continuous or extended cycle to minimize withdrawal bleeding) or progestin-only therapy (norethindrone, medroxyprogesterone, levonorgestrel IUD) is first-line treatment. These agents suppress ovulation, reduce menstrual flow, and create a hypoestrogenic or progestational environment that suppresses endometrial implants. GnRH agonists are effective but are second-line due to hypoestrogenic side effects (bone loss, hot flashes) and require add-back therapy. Danazol is rarely used due to androgenic side effects. Surgical diagnosis with laparoscopy is reserved for failed medical therapy or diagnostic uncertainty.",
    s: "Women's Health & Gynecology"
  },
  {
    q: "A 44-year-old female presents with fatigue, weight loss, and skin hyperpigmentation affecting palmar creases and buccal mucosa. Morning cortisol is 2.1 mcg/dL (low). ACTH is 280 pg/mL (markedly elevated). Sodium is 128 mEq/L, potassium is 5.8 mEq/L. What is the diagnosis and emergent management?",
    o: ["Primary adrenal insufficiency (Addison disease); IV hydrocortisone 100 mg bolus, IV normal saline, and dextrose if hypoglycemic", "Cushing syndrome; start ketoconazole", "Secondary adrenal insufficiency; start low-dose prednisone", "SIADH; fluid restriction"],
    a: 0,
    r: "Low cortisol with markedly elevated ACTH indicates primary adrenal insufficiency (Addison disease). Skin hyperpigmentation (from ACTH/MSH excess) in palmar creases and buccal mucosa is pathognomonic. Hyponatremia with hyperkalemia results from aldosterone deficiency. This is a potentially life-threatening adrenal crisis requiring emergent management: IV hydrocortisone 100 mg bolus then 50 mg q6-8h, IV normal saline for volume repletion and hyponatremia, and dextrose if hypoglycemic. Once stable, transition to oral hydrocortisone and fludrocortisone (for mineralocorticoid replacement). Cushing syndrome has elevated cortisol. Secondary adrenal insufficiency (pituitary) has low ACTH and no hyperpigmentation or hyperkalemia (aldosterone is preserved).",
    s: "Endocrine & Metabolic"
  },
  {
    q: "A 58-year-old male with well-controlled hypertension on lisinopril and amlodipine presents with bilateral leg edema. He notes the edema started 3 months after amlodipine was added. Albumin is normal at 4.2 g/dL. BNP is 45 pg/mL (normal). Urinalysis shows no proteinuria. Venous duplex ultrasound is negative for DVT. What is the most likely cause?",
    o: ["Amlodipine-induced peripheral edema (dihydropyridine CCB side effect); consider switching to non-dihydropyridine CCB or adding low-dose thiazide", "Heart failure; start furosemide", "Nephrotic syndrome; renal biopsy", "Chronic venous insufficiency; compression stockings only"],
    a: 0,
    r: "Dihydropyridine calcium channel blockers (amlodipine, nifedipine) cause dose-dependent peripheral edema in 5-30% of patients through arteriolar vasodilation, which increases capillary hydrostatic pressure and transudation. The temporal relationship (3 months after starting amlodipine), normal BNP (excluding heart failure), normal albumin (excluding hypoalbuminemia), negative urinalysis (excluding nephrotic syndrome), and negative venous duplex (excluding DVT) support this diagnosis. Management options include: reducing amlodipine dose, switching to a non-dihydropyridine CCB or another class, or adding a low-dose ACE inhibitor or ARB (venodilation counteracts arteriolar-mediated edema). Adding a diuretic is an alternative approach.",
    s: "Pharmacology"
  },
  {
    q: "A 33-year-old female presents with recurrent episodes of intense fear, palpitations, chest tightness, shortness of breath, tingling in her hands, and a sense of impending doom lasting 10-15 minutes. Episodes occur unexpectedly 3-4 times per week. She is avoiding public places for fear of having an episode. What is the diagnosis and first-line treatment?",
    o: ["Panic disorder with agoraphobia; SSRI (sertraline or paroxetine) plus cognitive behavioral therapy", "Generalized anxiety disorder; buspirone only", "Acute coronary syndrome; serial troponins and ECG monitoring", "Hyperthyroidism; check TSH"],
    a: 0,
    r: "Recurrent unexpected panic attacks (discrete episodes of intense fear with physical symptoms peaking within minutes) with subsequent avoidance behavior (avoiding public places) meets criteria for panic disorder with agoraphobia. First-line treatment is an SSRI (sertraline, paroxetine, or fluoxetine are FDA-approved for panic disorder) combined with CBT focusing on interoceptive exposure (deliberately inducing feared physical sensations in a safe setting). Short-term benzodiazepine use may bridge the 4-6 week SSRI onset period. GAD presents with chronic excessive worry rather than discrete attacks. While cardiac and thyroid causes should be evaluated initially, the recurrent stereotyped presentation is classic for panic disorder.",
    s: "Psychiatry & Mental Health"
  },
  {
    q: "A 78-year-old female with a history of chronic atrial fibrillation, hypertension, and CKD stage 3 presents with progressive lower extremity edema, exertional dyspnea, and an ejection fraction of 55% on echocardiogram. Diastolic dysfunction grade II is noted. BNP is 380 pg/mL. What is the diagnosis and management approach?",
    o: ["Heart failure with preserved ejection fraction (HFpEF); diuretics for volume management, treat underlying hypertension and AF, and consider SGLT2 inhibitor", "Normal aging; reassurance", "Pulmonary hypertension; start sildenafil", "Cor pulmonale; start supplemental oxygen"],
    a: 0,
    r: "Heart failure with preserved ejection fraction (HFpEF, EF >50%) accounts for approximately 50% of heart failure cases. Diagnosis is supported by symptoms (dyspnea, edema), elevated BNP, and diastolic dysfunction on echocardiography. Unlike HFrEF, few medications have shown mortality benefit in HFpEF. Management focuses on: diuretics for volume optimization, aggressive hypertension treatment, rate control of atrial fibrillation, weight management, and exercise training. SGLT2 inhibitors (empagliflozin — EMPEROR-Preserved trial) have shown benefit in HFpEF. The traditional HFrEF medications (ACEi, beta-blockers, MRA) have less robust evidence in HFpEF. This is not normal aging — elevated BNP and symptoms indicate pathology.",
    s: "Cardiovascular"
  },
  {
    q: "A 24-year-old male presents with acute onset flank pain radiating to the groin, nausea, and hematuria. CT without contrast shows a 4 mm stone in the left proximal ureter with mild hydronephrosis. Creatinine is normal. Temperature is 37.0°C. What is the initial management?",
    o: ["Aggressive IV hydration, NSAIDs or opioids for pain control, tamsulosin 0.4 mg daily for medical expulsive therapy, and strain urine for stone analysis", "Emergent ureteroscopy and stent placement", "Extracorporeal shock wave lithotripsy immediately", "CT with IV contrast for better visualization"],
    a: 0,
    r: "Ureteral stones <5 mm have an 85-90% spontaneous passage rate. Conservative management is appropriate when there is no infection, single kidney, or intractable symptoms. Management includes: adequate hydration, analgesics (NSAIDs are first-line — ketorolac IV/IM is highly effective; opioids for refractory pain), and medical expulsive therapy with tamsulosin (alpha-blocker that relaxes ureteral smooth muscle and facilitates passage). All voided urine should be strained for stone collection and composition analysis to guide prevention. Urgent intervention (ureteroscopy, stenting) is indicated for stones >10 mm, persistent obstruction, infection with obstruction (obstructive pyelonephritis — a urologic emergency), or intractable pain/vomiting. ESWL is an option for stones 5-20 mm in the proximal ureter.",
    s: "Renal & Nephrology"
  },
  {
    q: "A 56-year-old male with chronic low back pain has been requesting increased doses of hydrocodone-acetaminophen over the past 6 months. He reports the medication 'doesn't work like it used to' and is taking more than prescribed. He has no new imaging abnormalities. PDMP check shows prescriptions from 2 other providers. What is the priority action?",
    o: ["Discuss findings openly, assess for opioid use disorder using DSM-5 criteria, offer medication-assisted treatment (buprenorphine/naloxone), and develop a taper plan", "Increase hydrocodone dose to meet his needs", "Abruptly discontinue all opioids and discharge from practice", "Report to law enforcement immediately"],
    a: 0,
    r: "Multiple prescribers on PDMP, dose escalation, and tolerance suggest opioid use disorder (OUD). The priority is a compassionate, non-judgmental assessment using DSM-5 criteria for OUD. If OUD is confirmed, medication-assisted treatment (MAT) with buprenorphine/naloxone (Suboxone) is first-line and can be prescribed by qualified providers in office-based settings. A structured taper plan should be developed if continuing opioids. Simply increasing the dose enables the disorder. Abrupt discontinuation risks withdrawal and may drive the patient to illicit sources. Prescribing agreements, random urine drug screens, and naloxone co-prescribing are additional harm-reduction strategies. Law enforcement reporting is not indicated for OUD.",
    s: "Pharmacology"
  },
  {
    q: "A 60-year-old female with type 2 diabetes, hypertension, and obesity (BMI 38) is evaluating treatment options. She is on metformin 1000 mg BID with an HbA1c of 8.1%. She has a history of ASCVD (prior MI). Which medication class provides the best combination of glycemic control, cardiovascular benefit, and weight loss?",
    o: ["GLP-1 receptor agonist (semaglutide or liraglutide)", "Sulfonylurea (glipizide)", "DPP-4 inhibitor (sitagliptin)", "Thiazolidinedione (pioglitazone)"],
    a: 0,
    r: "GLP-1 receptor agonists (semaglutide, liraglutide) are uniquely positioned to address all three priorities: (1) significant HbA1c reduction (1.0-1.8%), (2) proven cardiovascular benefit with MACE reduction in patients with established ASCVD (LEADER, SUSTAIN-6, SELECT trials), and (3) meaningful weight loss (5-15% body weight). ADA/EASD guidelines recommend GLP-1 RAs (or SGLT2 inhibitors) as preferred second-line agents after metformin in patients with ASCVD. Sulfonylureas cause weight gain and hypoglycemia. DPP-4 inhibitors provide modest glycemic control without CV or weight benefit. Pioglitazone causes weight gain and fluid retention.",
    s: "Endocrine & Metabolic"
  },
  {
    q: "A 42-year-old male presents with a 2-week history of productive cough with rust-colored sputum, fever (38.9°C), right-sided pleuritic chest pain, and dyspnea. CXR shows right lower lobe consolidation. He has no recent hospitalization or antibiotic use. CURB-65 score is 1 (age <65, no confusion, urea normal, RR 22, BP 128/78). What is the appropriate outpatient antibiotic regimen?",
    o: ["Amoxicillin 1 g TID for 5 days or doxycycline 100 mg BID for 5 days", "IV ceftriaxone plus azithromycin (inpatient regimen)", "Ciprofloxacin 750 mg BID for 14 days", "Azithromycin 250 mg daily for 3 days (Z-pack)"],
    a: 0,
    r: "Community-acquired pneumonia (CAP) with CURB-65 score 0-1 can be managed outpatient. For previously healthy adults with no antibiotic use in the past 3 months, ATS/IDSA guidelines recommend: amoxicillin 1 g TID (preferred), or doxycycline 100 mg BID, or a macrolide (where pneumococcal resistance <25%). Treatment duration is 5 days minimum with clinical improvement. The Z-pack (5-day azithromycin) is commonly prescribed but 3-day courses may be insufficient. Fluoroquinolones are reserved for patients with comorbidities or recent antibiotic use. IV antibiotics are for inpatient management (CURB-65 ≥2). Ciprofloxacin does not adequately cover typical CAP pathogens (S. pneumoniae).",
    s: "Respiratory"
  },
  {
    q: "A 68-year-old male with Parkinson disease treated with carbidopa-levodopa for 8 years develops predictable 'wearing off' episodes with return of tremor and rigidity before his next dose. He is currently on carbidopa-levodopa 25/100 TID. What is the most appropriate medication adjustment?",
    o: ["Increase dosing frequency to QID or add a COMT inhibitor (entacapone) to extend levodopa effect", "Switch to anticholinergic (benztropine) monotherapy", "Discontinue levodopa and switch to pramipexole monotherapy", "Add haloperidol for tremor control"],
    a: 0,
    r: "Wearing off is a common motor complication of chronic levodopa therapy due to progressive loss of dopaminergic neurons' ability to buffer levodopa levels. Management strategies include: increasing carbidopa-levodopa dosing frequency (smaller, more frequent doses to maintain steady levels), adding a COMT inhibitor (entacapone, available as Stalevo in combination with carbidopa-levodopa) to slow peripheral levodopa metabolism and prolong its effect, or adding a MAO-B inhibitor (rasagiline, safinamide). Anticholinergics are avoided in elderly patients (delirium risk, cognitive impairment). Stopping levodopa in advanced PD would cause severe motor deterioration. Haloperidol (D2 blocker) would catastrophically worsen Parkinsonism.",
    s: "Neurological"
  },
  {
    q: "A 35-year-old female G2P1 at 16 weeks gestation has a history of chronic hypertension managed with lisinopril before pregnancy. She was switched to labetalol when pregnancy was confirmed. BP today is 142/88. She is considering adding a second antihypertensive. Which medication is safe as add-on therapy in pregnancy?",
    o: ["Nifedipine extended-release 30 mg daily", "Hydrochlorothiazide 25 mg daily", "Lisinopril 10 mg daily", "Atenolol 50 mg daily"],
    a: 0,
    r: "For chronic hypertension in pregnancy requiring additional medication beyond labetalol, nifedipine extended-release is a safe and effective second-line agent. It is a dihydropyridine CCB with extensive safety data in pregnancy. The CHAP trial (2022) demonstrated benefits of treating chronic hypertension to a target of <140/90 in pregnancy. ACE inhibitors (lisinopril) are absolutely contraindicated in pregnancy (fetal renal agenesis, oligohydramnios, skull defects — Category D/X). Atenolol is associated with fetal growth restriction and is avoided. Hydrochlorothiazide is generally avoided in pregnancy due to volume depletion concerns, though it may be cautiously continued if used pre-pregnancy. Methyldopa is another safe alternative.",
    s: "Pharmacology"
  },
  {
    q: "A premature infant born at 32 weeks gestation develops apneic episodes (cessation of breathing >20 seconds with desaturation) at 3 days of life. The infant is otherwise stable with no signs of infection, normal glucose, and normal temperature. What is the first-line treatment for apnea of prematurity?",
    o: ["Caffeine citrate (loading dose 20 mg/kg then maintenance 5-10 mg/kg daily)", "Aminophylline IV infusion", "Doxapram infusion", "Intubation and mechanical ventilation immediately"],
    a: 0,
    r: "Apnea of prematurity (AOP) is a developmental disorder of respiratory control in premature infants (<37 weeks). Caffeine citrate is first-line treatment with a strong evidence base (CAP trial): it reduces apnea frequency, decreases BPD incidence, and improves neurodevelopmental outcomes. Loading dose is 20 mg/kg IV/PO, followed by maintenance 5-10 mg/kg daily. Caffeine has a wide therapeutic index and excellent safety profile. Aminophylline (theophylline) is an older alternative with a narrower therapeutic window and more side effects. Doxapram is a central respiratory stimulant used as rescue therapy when caffeine fails. Intubation is reserved for severe, caffeine-refractory apnea with persistent desaturation/bradycardia.",
    s: "Neonatal"
  },
  {
    q: "A 50-year-old male presents with a painless testicular mass. Ultrasound confirms a 3 cm solid intratesticular mass. Serum AFP is 240 ng/mL (elevated), beta-hCG is 12 mIU/mL (mildly elevated), and LDH is 380 U/L. What is the priority management?",
    o: ["Radical inguinal orchiectomy for diagnosis and staging; CT chest/abdomen/pelvis for metastatic workup", "Testicular biopsy via scrotal approach", "Observation with repeat ultrasound in 3 months", "Empiric chemotherapy before surgical intervention"],
    a: 0,
    r: "A solid intratesticular mass with elevated tumor markers (AFP, beta-hCG, LDH) is testicular cancer until proven otherwise. Management follows a specific protocol: radical inguinal orchiectomy (NOT transscrotal biopsy, which risks tumor seeding) for definitive diagnosis and histologic classification (seminoma vs. non-seminomatous germ cell tumor). Elevated AFP specifically indicates a non-seminomatous component (pure seminomas do not produce AFP). CT chest/abdomen/pelvis stages the disease. Post-orchiectomy management depends on histology and stage: surveillance, retroperitoneal lymph node dissection, or chemotherapy. Observation without tissue diagnosis is inappropriate for a solid testicular mass. Empiric chemotherapy without histologic confirmation violates oncologic principles.",
    s: "Renal & Nephrology"
  },
  {
    q: "A 45-year-old female presents with progressive bilateral hand numbness and tingling in the first three digits, worse at night and with driving. Tinel sign and Phalen test are positive bilaterally. She works as a data entry clerk. Nerve conduction studies confirm bilateral carpal tunnel syndrome, moderate severity. Conservative measures (splinting, NSAIDs) for 3 months have failed. What is the next step?",
    o: ["Corticosteroid injection into the carpal tunnel; if no sustained improvement, refer for surgical release", "Continue conservative measures for 6 more months", "Start gabapentin for neuropathic pain", "MRI of the cervical spine"],
    a: 0,
    r: "For moderate carpal tunnel syndrome failing conservative management (night splints, NSAIDs, activity modification), corticosteroid injection into the carpal tunnel provides significant short-to-medium term relief (evidence supports improvement lasting weeks to months). If symptoms recur after injection, surgical carpal tunnel release is definitive (95% success rate). Prolonging failed conservative therapy delays definitive treatment and risks permanent nerve damage. Gabapentin may help symptoms but does not address the mechanical compression. Cervical spine MRI evaluates for cervical radiculopathy, which would present differently (dermatomal pattern, not median nerve distribution; neck pain; negative Tinel/Phalen).",
    s: "Musculoskeletal"
  },
  {
    q: "A 30-year-old female presents with a 1-year history of chronic daily headaches, occurring 22 days per month. She has been taking ibuprofen 800 mg daily and sumatriptan 3-4 times per week for the past 6 months. Neurological exam is normal. MRI brain is unremarkable. What is the most important initial intervention?",
    o: ["Gradual withdrawal of overused acute medications (ibuprofen and sumatriptan) with bridge therapy and initiate preventive medication", "Increase sumatriptan frequency for better acute control", "Switch to opioid-based acute therapy", "Refer for occipital nerve blocks"],
    a: 0,
    r: "This patient meets criteria for medication overuse headache (MOH): headache >15 days/month with regular overuse of acute headache medications >3 months (triptans >10 days/month, NSAIDs >15 days/month). MOH is the most common cause of chronic daily headache transformation. The essential first step is withdrawal of the overused medications — abrupt or gradual depending on the medication class (triptans can be stopped abruptly; NSAIDs and opioids should be tapered). Bridge therapy (short course of prednisone or longer-acting NSAID like naproxen) manages withdrawal headaches. Simultaneously, a preventive medication (topiramate, amitriptyline, or CGRP monoclonal antibody) should be initiated. Increasing the overused medication perpetuates the cycle. Opioids would create a worse overuse pattern.",
    s: "Neurological"
  },
  {
    q: "A term newborn at 12 hours of life is noted to have central cyanosis that does not improve with supplemental oxygen (100% FiO2). The infant is tachypneic but has no respiratory distress. CXR shows decreased pulmonary vascular markings and a normal heart size with an 'egg-on-a-string' cardiac silhouette. What is the most likely diagnosis and life-saving intervention?",
    o: ["Transposition of the great arteries; IV prostaglandin E1 to maintain PDA patency and emergent cardiology consultation for balloon atrial septostomy", "Tetralogy of Fallot; start propranolol", "Respiratory distress syndrome; surfactant administration", "Persistent pulmonary hypertension; inhaled nitric oxide"],
    a: 0,
    r: "Central cyanosis unresponsive to supplemental oxygen (failed hyperoxia test) in a newborn indicates a cyanotic congenital heart defect. The 'egg-on-a-string' CXR silhouette (narrow mediastinum from parallel great arteries) with decreased pulmonary markings is classic for D-transposition of the great arteries (D-TGA). In D-TGA, the aorta arises from the RV and the PA from the LV, creating parallel circulations incompatible with life unless mixing occurs. IV prostaglandin E1 (alprostadil) maintains PDA patency for systemic-pulmonary mixing and is life-saving. Balloon atrial septostomy (Rashkind procedure) creates an atrial communication for improved mixing. Definitive surgical repair is the arterial switch operation (Jatene procedure) performed within the first 2 weeks of life.",
    s: "Neonatal"
  },
  {
    q: "A 62-year-old male presents with a 4-month history of progressive fatigue, night sweats, unintentional weight loss of 12 lbs, and lymphadenopathy involving cervical, axillary, and inguinal regions. CBC shows WBC 45,000 with 85% mature lymphocytes. Peripheral smear shows smudge cells. What is the most likely diagnosis?",
    o: ["Chronic lymphocytic leukemia (CLL); flow cytometry for confirmation and staging workup", "Acute lymphoblastic leukemia; immediate chemotherapy", "Infectious mononucleosis; EBV titers", "Lymphoma; excisional lymph node biopsy"],
    a: 0,
    r: "The presentation of an older adult with progressive lymphadenopathy, constitutional symptoms (B symptoms), marked lymphocytosis with mature-appearing lymphocytes, and smudge cells (fragile CLL cells that rupture during blood smear preparation) is classic for chronic lymphocytic leukemia (CLL). Diagnosis is confirmed by flow cytometry showing CD5+, CD19+, CD23+ B-cell clonality. Rai staging (0-IV) guides management: early-stage (0-I) typically undergoes watch-and-wait; advanced stage or symptomatic disease requires treatment (chemoimmunotherapy or targeted therapies like ibrutinib, venetoclax). ALL presents acutely with blasts, cytopenias, and rapid deterioration. EBV mononucleosis affects young adults. Lymphoma may coexist but CLL diagnosis is established by peripheral blood flow cytometry.",
    s: "Hematology & Oncology"
  },
  {
    q: "A 43-year-old female presents with a 6-month history of progressive symmetric proximal muscle weakness. She has difficulty climbing stairs, rising from a chair, and lifting objects overhead. CK is 4,200 U/L. EMG shows myopathic changes. She also has a heliotrope rash around her eyes and Gottron papules over her knuckles. What is the most likely diagnosis and what malignancy screening is essential?",
    o: ["Dermatomyositis; age-appropriate cancer screening plus CT chest/abdomen/pelvis given increased malignancy risk", "Polymyalgia rheumatica; start prednisone 15 mg", "Fibromyalgia; duloxetine and exercise program", "Myasthenia gravis; anti-AChR antibody testing"],
    a: 0,
    r: "Proximal muscle weakness with markedly elevated CK, myopathic EMG findings, heliotrope rash (violaceous periorbital discoloration), and Gottron papules (scaly erythematous patches over extensor surfaces of joints) is diagnostic of dermatomyositis. Adults with dermatomyositis have a significantly increased risk of occult malignancy (15-30%), particularly ovarian, lung, breast, GI, and lymphoma. Age-appropriate cancer screening plus CT chest/abdomen/pelvis is essential at diagnosis and for 3-5 years. Treatment includes high-dose corticosteroids and steroid-sparing immunosuppressants (methotrexate or azathioprine). Polymyalgia rheumatica causes pain and stiffness without true weakness or CK elevation. Fibromyalgia has normal CK. Myasthenia gravis causes fatigable weakness with normal CK.",
    s: "Musculoskeletal"
  },
  {
    q: "A 71-year-old female with a history of osteoporosis is found to have a serum calcium of 13.2 mg/dL during routine labs. She reports confusion, constipation, polyuria, and nausea. ECG shows a shortened QT interval. PTH is suppressed at 8 pg/mL. PTHrP is elevated. What is the most likely etiology and emergent management?",
    o: ["Humoral hypercalcemia of malignancy (PTHrP-mediated); aggressive IV normal saline hydration, IV zoledronic acid, and urgent malignancy workup", "Primary hyperparathyroidism; referral for parathyroidectomy", "Vitamin D intoxication; stop supplements", "Sarcoidosis; start prednisone"],
    a: 0,
    r: "Hypercalcemia with suppressed PTH and elevated PTHrP indicates humoral hypercalcemia of malignancy (HHM). PTHrP is secreted by squamous cell carcinomas (lung, head/neck), renal cell carcinoma, breast cancer, and bladder cancer. Emergent management of severe hypercalcemia (>13 mg/dL with symptoms) includes: (1) aggressive IV NS hydration (200-300 mL/hr initially to restore volume and enhance renal calcium excretion), (2) IV bisphosphonate (zoledronic acid 4 mg — takes 2-4 days for full effect), (3) calcitonin (rapid but temporary calcium reduction — bridge until bisphosphonate works), and (4) urgent workup to identify the primary malignancy. Primary hyperparathyroidism has ELEVATED PTH. Vitamin D toxicity shows elevated 25-OH vitamin D. Sarcoidosis shows elevated 1,25-dihydroxyvitamin D.",
    s: "Endocrine & Metabolic"
  }
];
