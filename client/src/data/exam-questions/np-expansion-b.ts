import type { ExamQuestion } from "./types";

export const npExpansionBQuestions: ExamQuestion[] = [
  {
    q: "A 58-year-old male presents with fatigue, polyuria, and polydipsia. Fasting plasma glucose is 142 mg/dL on two separate occasions. HbA1c is 7.8%. BMI is 34. He has a history of hypertension and dyslipidemia. What is the most appropriate initial pharmacotherapy?",
    o: ["Metformin 500 mg twice daily, titrating to therapeutic dose based on tolerance and renal function", "Insulin glargine 10 units at bedtime", "Glipizide 5 mg daily before breakfast", "Pioglitazone 30 mg daily"],
    a: 0,
    r: "ADA/EASD guidelines recommend metformin as first-line pharmacotherapy for type 2 diabetes due to its efficacy, weight neutrality (or modest weight loss), cardiovascular benefit, low hypoglycemia risk, and cost-effectiveness. Starting at 500 mg BID and titrating reduces GI side effects. eGFR must be monitored (contraindicated below 30 mL/min). Insulin is reserved for higher A1c or failure of oral agents. Sulfonylureas increase hypoglycemia risk. Thiazolidinediones cause weight gain and fluid retention.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old female presents with a 3-cm thyroid nodule found incidentally on imaging. TSH is 2.1 mIU/L (normal). What is the next appropriate diagnostic step?",
    o: ["Thyroid ultrasound to characterize the nodule followed by fine-needle aspiration biopsy if indicated by TI-RADS criteria", "Immediate surgical referral for thyroidectomy", "Radioactive iodine uptake scan", "Start levothyroxine to suppress TSH and shrink the nodule"],
    a: 0,
    r: "ATA guidelines recommend thyroid ultrasound as the initial diagnostic step for thyroid nodules to assess size, composition, echogenicity, margins, and calcifications using the TI-RADS (Thyroid Imaging Reporting and Data System) classification. FNA biopsy is indicated based on TI-RADS category and nodule size. Surgery without tissue diagnosis is premature. RAI uptake is indicated when TSH is LOW (to evaluate hyperfunctioning nodules). TSH suppression therapy is no longer recommended for benign nodules.",
    s: "Endocrine"
  },
  {
    q: "A 62-year-old male with COPD presents to the clinic with worsening dyspnea, increased sputum production, and purulent sputum for 3 days. SpO2 is 91% on room air, RR 22, temp 37.6C. FEV1 at last visit was 42% predicted. What is the most appropriate management?",
    o: ["Prescribe a short course of oral prednisone 40 mg daily for 5 days and an antibiotic covering common respiratory pathogens", "Admit the patient for IV methylprednisolone and bronchoscopy", "Increase the maintenance inhaler dose and schedule follow-up in 2 weeks", "Start a macrolide antibiotic only without systemic corticosteroids"],
    a: 0,
    r: "GOLD guidelines for moderate COPD exacerbation (increased dyspnea, purulent sputum, but stable enough for outpatient management) recommend: oral corticosteroids (prednisone 40 mg x 5 days) to reduce airway inflammation and shorten recovery, plus antibiotics when sputum is purulent (amoxicillin-clavulanate, azithromycin, or respiratory fluoroquinolone). Hospital admission is indicated for severe exacerbation. Simply increasing the maintenance inhaler is insufficient for an acute exacerbation. Antibiotics alone without steroids provides incomplete treatment.",
    s: "Respiratory"
  },
  {
    q: "A nurse practitioner is evaluating a 72-year-old female with a history of atrial fibrillation, hypertension, diabetes, and prior stroke. She is currently taking aspirin 81 mg daily. Her CHA2DS2-VASc score is 7. What anticoagulation change should be recommended?",
    o: ["Discontinue aspirin and initiate a direct oral anticoagulant (apixaban or rivaroxaban) given the high stroke risk", "Continue aspirin alone since she is already on antiplatelet therapy", "Add clopidogrel to aspirin for dual antiplatelet therapy", "Start warfarin with a target INR of 3.0-4.0"],
    a: 0,
    r: "A CHA2DS2-VASc score of 7 indicates very high stroke risk requiring therapeutic anticoagulation. DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) are preferred over warfarin for non-valvular AF due to predictable pharmacokinetics, fewer drug interactions, no INR monitoring, and better safety profiles. Aspirin alone is insufficient for stroke prevention with this risk score. Dual antiplatelet therapy is inferior to anticoagulation for AF. Warfarin target INR for AF is 2.0-3.0, not 3.0-4.0.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old female presents with progressive fatigue, cold intolerance, weight gain of 7 kg over 6 months, constipation, and dry skin. TSH is 12.4 mIU/L (elevated) and free T4 is 0.6 ng/dL (low). Anti-TPO antibodies are positive. What is the diagnosis and appropriate treatment?",
    o: ["Hashimoto's thyroiditis with overt hypothyroidism; initiate levothyroxine replacement therapy", "Graves' disease requiring methimazole", "Subacute thyroiditis requiring NSAIDs and observation", "Subclinical hypothyroidism requiring monitoring only"],
    a: 0,
    r: "Elevated TSH with low free T4 confirms overt hypothyroidism. Positive anti-TPO antibodies identify Hashimoto's thyroiditis (chronic autoimmune thyroiditis) as the etiology, the most common cause of hypothyroidism in iodine-sufficient countries. Treatment is levothyroxine (1.6 mcg/kg/day), with dose titration every 6-8 weeks based on TSH. Graves' disease causes HYPERthyroidism. Subacute thyroiditis is typically post-viral with thyroid pain. Subclinical hypothyroidism has normal free T4.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male presents with a blood pressure of 158/98 at three separate clinic visits. He has no other medical conditions. Urinalysis and basic metabolic panel are normal. What is the most appropriate initial antihypertensive?",
    o: ["ACE inhibitor (lisinopril) or ARB (losartan) as first-line monotherapy", "Clonidine for immediate blood pressure reduction", "Metoprolol as the preferred first-line agent", "Hydralazine three times daily"],
    a: 0,
    r: "JNC 8 and ACC/AHA guidelines recommend ACE inhibitors, ARBs, calcium channel blockers, or thiazide diuretics as first-line antihypertensive therapy. For a non-Black patient without diabetes or CKD, ACE inhibitors or ARBs are excellent first-line choices due to cardiovascular and renal protection. Clonidine is a second-line centrally acting agent with rebound hypertension risk. Beta-blockers are no longer first-line for uncomplicated hypertension. Hydralazine requires multiple daily doses and causes reflex tachycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A 28-year-old female presents with recurrent episodes of palpitations, tremor, heat intolerance, unintentional weight loss of 5 kg, and exophthalmos. TSH is undetectable (<0.01 mIU/L), free T4 is 4.8 ng/dL (elevated), and TSI (thyroid-stimulating immunoglobulin) is positive. What is the initial treatment approach?",
    o: ["Start methimazole as first-line antithyroid drug and add a beta-blocker for symptom control", "Perform immediate radioactive iodine ablation", "Start propylthiouracil (PTU) as the preferred long-term antithyroid drug", "Start high-dose levothyroxine to suppress autoimmune activity"],
    a: 0,
    r: "Graves' disease (confirmed by suppressed TSH, elevated free T4, positive TSI, and exophthalmos) is treated with antithyroid drugs as first-line in many patients. Methimazole is preferred over PTU due to once-daily dosing, fewer side effects, and lower risk of hepatotoxicity. PTU is reserved for first-trimester pregnancy and thyroid storm. A beta-blocker (propranolol or atenolol) controls adrenergic symptoms while antithyroid drugs take effect. RAI is a definitive option but not the initial step. Levothyroxine would worsen hyperthyroidism.",
    s: "Endocrine"
  },
  {
    q: "A nurse practitioner is evaluating a 65-year-old male with a 40-pack-year smoking history who presents with a chronic productive cough. Spirometry shows FEV1/FVC ratio of 0.62 and FEV1 of 58% predicted. Post-bronchodilator FEV1 improves by 8%. What GOLD stage of COPD does this represent and what is the recommended maintenance therapy?",
    o: ["GOLD Stage II (moderate); initiate a long-acting bronchodilator (LABA or LAMA) as maintenance therapy", "GOLD Stage I (mild); short-acting bronchodilator PRN only", "GOLD Stage IV (very severe); initiate home oxygen therapy", "GOLD Stage III (severe); start systemic corticosteroids daily"],
    a: 0,
    r: "FEV1/FVC below 0.70 post-bronchodilator confirms COPD. FEV1 of 58% predicted classifies as GOLD Stage II (moderate: 50-79% predicted). GOLD guidelines recommend a long-acting bronchodilator (LAMA like tiotropium or LABA like salmeterol) as first-line maintenance therapy for symptomatic moderate COPD. The poor bronchodilator reversibility (8%, below 12%) distinguishes COPD from asthma. Stage I needs only PRN SABA. Stage IV is FEV1 below 30%. Daily systemic steroids are not recommended for stable COPD.",
    s: "Respiratory"
  },
  {
    q: "A 42-year-old female presents with joint pain, fatigue, and morning stiffness lasting 2 hours affecting bilateral hands (MCPs and PIPs symmetrically). Symptoms have persisted for 10 weeks. Labs show positive RF, positive anti-CCP antibodies, ESR 48, and CRP 2.4. X-rays show periarticular osteopenia. What is the diagnosis and what treatment should be initiated?",
    o: ["Rheumatoid arthritis; initiate methotrexate as the first-line DMARD within 3 months of symptom onset", "Osteoarthritis; prescribe acetaminophen and recommend joint protection", "Gout; start allopurinol for urate lowering", "Systemic lupus erythematosus; begin hydroxychloroquine monotherapy"],
    a: 0,
    r: "Bilateral symmetric polyarthritis of MCP and PIP joints with prolonged morning stiffness (over 1 hour), positive RF and anti-CCP antibodies, elevated inflammatory markers, and periarticular osteopenia for more than 6 weeks meets ACR/EULAR criteria for rheumatoid arthritis. Early aggressive treatment with methotrexate (first-line DMARD) within 3 months of diagnosis significantly improves outcomes by preventing joint destruction. OA is not symmetric and lacks inflammatory markers. Gout affects different joints. SLE has different criteria.",
    s: "Musculoskeletal"
  },
  {
    q: "A 55-year-old male with type 2 diabetes (A1c 7.2%) and a history of myocardial infarction is on metformin 1000 mg BID. Which additional diabetes medication would provide the greatest cardiovascular benefit?",
    o: ["An SGLT2 inhibitor (empagliflozin) or GLP-1 receptor agonist (liraglutide) with proven cardiovascular outcome benefit", "Glipizide to further lower A1c", "Pioglitazone for insulin sensitization", "Acarbose to reduce postprandial glucose spikes"],
    a: 0,
    r: "ADA Standards of Care recommend adding an SGLT2 inhibitor (empagliflozin, dapagliflozin) or GLP-1 RA (liraglutide, semaglutide) for patients with type 2 diabetes and established cardiovascular disease, regardless of A1c, due to proven cardiovascular mortality and heart failure hospitalization reduction in landmark trials (EMPA-REG, LEADER, SUSTAIN-6). Sulfonylureas have no CV benefit and increase hypoglycemia. Pioglitazone can worsen heart failure. Acarbose has modest glucose-lowering effect.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old female presents with a painful, swollen, erythematous first metatarsophalangeal joint that developed overnight. She has a history of CKD (eGFR 35). Synovial fluid analysis reveals negatively birefringent, needle-shaped crystals. What is the preferred acute treatment?",
    o: ["Low-dose colchicine within 12 hours of onset, with corticosteroids as an alternative given the CKD", "Allopurinol 300 mg to immediately lower uric acid", "High-dose ibuprofen 800 mg three times daily", "Probenecid to increase uric acid excretion"],
    a: 0,
    r: "Negatively birefringent needle-shaped crystals confirm gout. For acute gout with CKD (eGFR 35), treatment options are limited. Colchicine (low-dose: 1.2 mg followed by 0.6 mg one hour later) is effective when initiated within 12-36 hours. Corticosteroids (oral prednisone, intra-articular injection, or IM triamcinolone) are preferred when NSAIDs and colchicine are contraindicated. NSAIDs are contraindicated with eGFR below 60 due to further renal impairment. Allopurinol should NOT be started during acute attacks (worsens flare). Probenecid is ineffective with reduced GFR.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse practitioner is interpreting an ECG. The rhythm shows irregularly irregular rate at 142 bpm with no discernible P waves and narrow QRS complexes. What is the rhythm and what is the acute management priority?",
    o: ["Atrial fibrillation with rapid ventricular response; control the ventricular rate with IV diltiazem or metoprolol", "Ventricular fibrillation requiring immediate defibrillation", "Atrial flutter requiring synchronized cardioversion", "Sinus tachycardia requiring fluid bolus"],
    a: 0,
    r: "Irregularly irregular rhythm with absent P waves and narrow QRS complexes is the hallmark of atrial fibrillation. With a rate of 142 (rapid ventricular response), the acute priority is rate control using IV diltiazem (calcium channel blocker) or metoprolol (beta-blocker) to achieve a resting heart rate below 110. VF has no organized rhythm. Atrial flutter has a regular sawtooth pattern. Sinus tachycardia has visible P waves before each QRS. Anticoagulation decision should follow using CHA2DS2-VASc scoring.",
    s: "Cardiovascular"
  },
  {
    q: "A 30-year-old female presents with a 6-month history of episodic unilateral pulsating headaches lasting 4-72 hours, accompanied by nausea, photophobia, and phonophobia. She has 8-10 headache days per month, significantly impacting her work. What prophylactic treatment should be initiated?",
    o: ["Propranolol or topiramate as first-line migraine prophylaxis given the frequency and disability level", "Sumatriptan 100 mg daily as preventive therapy", "Opioid analgesics for each headache episode", "CT scan of the head before any treatment"],
    a: 0,
    r: "This patient meets ICHD-3 criteria for migraine without aura. With 8-10 headache days monthly and significant functional impairment, prophylactic therapy is indicated (recommended when there are 4 or more headache days/month or significant disability). First-line prophylactics include beta-blockers (propranolol), anticonvulsants (topiramate, valproate), and antidepressants (amitriptyline). CGRP monoclonal antibodies are newer options. Triptans are abortive, not preventive. Opioids risk medication overuse headache. Neuroimaging is not indicated for classic migraine presentation.",
    s: "Neurological"
  },
  {
    q: "A 70-year-old male with a history of BPH presents with acute urinary retention, lower abdominal pain, and a palpable suprapubic mass. He has been taking diphenhydramine for allergies. Post-void residual is 650 mL. What is the immediate management?",
    o: ["Insert an indwelling urinary catheter for bladder decompression and discontinue the anticholinergic medication", "Prescribe oxybutynin to relax the bladder muscle", "Start finasteride and schedule follow-up in 6 weeks", "Recommend double voiding technique and increased fluid intake"],
    a: 0,
    r: "Acute urinary retention with 650 mL PVR requires immediate bladder decompression via catheterization to prevent bladder injury and post-obstructive renal damage. Diphenhydramine (anticholinergic) likely precipitated the retention by decreasing detrusor muscle contractility in a patient with pre-existing BPH. The offending medication must be discontinued. Oxybutynin (also anticholinergic) would worsen retention. Finasteride takes months to reduce prostate size. Behavioral techniques are insufficient for acute retention.",
    s: "Renal"
  },
  {
    q: "A nurse practitioner is managing a 48-year-old male with newly diagnosed major depressive disorder. He reports insomnia, weight loss, anhedonia, and difficulty concentrating for the past 8 weeks. He has no prior psychiatric history. What is the most appropriate initial pharmacotherapy?",
    o: ["An SSRI such as sertraline or escitalopram as first-line treatment for MDD", "Bupropion XL for its stimulating properties to address fatigue", "Amitriptyline for its sedating properties to address insomnia", "Lithium as a mood stabilizer", "Benzodiazepine for anxiety and sleep"],
    a: 0,
    r: "SSRIs (sertraline, escitalopram, fluoxetine) are recommended as first-line pharmacotherapy for MDD due to favorable efficacy, tolerability, and safety profiles. Sertraline has the broadest evidence base and fewest drug interactions. Escitalopram has the most favorable side effect profile. Treatment should continue for 6-12 months after remission. Bupropion is second-line. TCAs (amitriptyline) have significant side effects and overdose risk. Lithium is for bipolar disorder. Benzodiazepines are not antidepressants and carry dependence risk.",
    s: "Mental Health"
  },
  {
    q: "A 52-year-old female presents with a 2-cm breast mass found on self-examination. Mammogram shows a spiculated, irregular mass with microcalcifications. Ultrasound confirms a solid hypoechoic lesion. What is the next step?",
    o: ["Core needle biopsy of the breast mass for tissue diagnosis before any treatment decisions", "Immediate mastectomy given the suspicious imaging findings", "Repeat mammogram in 6 months to monitor for changes", "Start tamoxifen empirically while awaiting additional imaging"],
    a: 0,
    r: "Spiculated margins and microcalcifications on mammogram with a solid hypoechoic lesion on ultrasound are highly suspicious for malignancy (BI-RADS 5). Core needle biopsy is essential for tissue diagnosis (histologic type, grade, receptor status: ER/PR/HER2) before any treatment planning. Surgery without tissue diagnosis is inappropriate. Waiting 6 months risks disease progression. Empiric tamoxifen without confirmed diagnosis and receptor status is inappropriate. Triple assessment (clinical, imaging, pathology) is the standard approach.",
    s: "Oncology"
  },
  {
    q: "A nurse practitioner is evaluating a 60-year-old male with persistent heartburn despite 8 weeks of omeprazole 20 mg daily. He reports dysphagia to solids and has lost 4 kg unintentionally. What is the most appropriate next step?",
    o: ["Refer for upper endoscopy (EGD) to evaluate for Barrett's esophagus, stricture, or malignancy given the alarm symptoms", "Double the omeprazole dose to 40 mg twice daily and reassess in 4 weeks", "Switch to ranitidine and add sucralfate", "Order a barium swallow as the definitive diagnostic test"],
    a: 0,
    r: "Alarm symptoms in GERD include dysphagia, unintentional weight loss, odynophagia, GI bleeding, and age over 50 with new-onset symptoms. These mandate upper endoscopy to rule out Barrett's esophagus, esophageal stricture, esophageal adenocarcinoma, or eosinophilic esophagitis. Empiric PPI escalation without investigating alarm symptoms is unsafe. Ranitidine was withdrawn from the market due to NDMA contamination. Barium swallow can identify structural abnormalities but cannot obtain tissue for histology.",
    s: "Gastrointestinal"
  },
  {
    q: "A 38-year-old female presents with a butterfly-shaped erythematous rash across the cheeks and nose, joint pain, fatigue, and oral ulcers. Labs show: ANA positive (1:640), anti-dsDNA positive, low C3 and C4, and proteinuria (1.2 g/24 hours). What is the most likely diagnosis and what critical assessment must be performed?",
    o: ["Systemic lupus erythematosus with probable lupus nephritis; obtain renal biopsy to classify the nephritis and guide treatment", "Dermatomyositis requiring muscle biopsy", "Scleroderma requiring skin biopsy", "Drug-induced lupus requiring medication review only"],
    a: 0,
    r: "Malar (butterfly) rash, arthritis, oral ulcers, positive ANA and anti-dsDNA, hypocomplementemia, and significant proteinuria meet ACR/EULAR classification criteria for SLE with renal involvement. Renal biopsy is critical to classify lupus nephritis (ISN/RPS classes I-VI) because treatment varies dramatically: Class III/IV (proliferative) requires aggressive immunosuppression (mycophenolate or cyclophosphamide), while Class V (membranous) has different treatment. Dermatomyositis has heliotrope rash, not malar. Drug-induced lupus rarely affects kidneys and is anti-histone positive.",
    s: "Musculoskeletal"
  },
  {
    q: "A 55-year-old male with metabolic syndrome (BMI 38, fasting glucose 118 mg/dL, triglycerides 280 mg/dL, HDL 32 mg/dL, BP 144/92) presents for a wellness visit. His 10-year ASCVD risk score is 14%. What is the comprehensive management approach?",
    o: ["Lifestyle modification plus moderate-intensity statin therapy, antihypertensive (ACE inhibitor or ARB), and consideration of metformin for prediabetes", "Lifestyle modification only with reassessment in 1 year", "High-intensity statin and fibrate combination immediately", "Bariatric surgery referral as the sole intervention"],
    a: 0,
    r: "With a 10-year ASCVD risk of 14% (intermediate risk: 7.5-20%), ACC/AHA guidelines recommend moderate-intensity statin therapy. Hypertension (144/92) requires pharmacotherapy with lifestyle modification (BP goal below 130/80). Prediabetes (FG 118) warrants intensive lifestyle intervention and consideration of metformin. This is a comprehensive cardiovascular risk reduction approach. Lifestyle modification alone is insufficient given the risk burden. Statin-fibrate combination increases myopathy risk without proven mortality benefit. Bariatric surgery has specific BMI criteria.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse practitioner is evaluating a 25-year-old female with recurrent urinary tract infections (4 episodes in the past year). Urine culture consistently grows E. coli. Renal ultrasound is normal. What is the most appropriate management strategy?",
    o: ["Offer continuous low-dose antibiotic prophylaxis or post-coital prophylaxis after behavioral modifications have been attempted", "Prescribe a 14-day course of IV antibiotics", "Order a CT urogram to evaluate for structural abnormalities", "Start empiric antifungal therapy for possible resistant organism"],
    a: 0,
    r: "Recurrent UTIs (3 or more episodes/year) in premenopausal women with normal anatomy warrant a stepwise approach: first behavioral modifications (post-coital voiding, adequate hydration, cranberry products), then antibiotic prophylaxis if recurrences continue. Options include continuous low-dose prophylaxis (nitrofurantoin 50-100 mg nightly) or post-coital prophylaxis (single dose after intercourse). IV antibiotics are for complicated UTIs. CT urogram is indicated for suspected structural abnormalities (already ruled out by ultrasound). Antifungals are inappropriate for bacterial UTIs.",
    s: "Renal"
  },
  {
    q: "A 70-year-old female presents with sudden onset of severe lower back pain after lifting groceries. She has a history of osteoporosis and has not been taking her prescribed alendronate. X-ray shows a compression fracture at T12. What is the acute and long-term management?",
    o: ["Pain management with calcitonin nasal spray, limited bed rest, bracing if needed, and restart bisphosphonate therapy with calcium and vitamin D supplementation", "Immediate surgical spinal fusion", "High-dose oral corticosteroids for 2 weeks", "Bed rest for 6 weeks followed by physical therapy"],
    a: 0,
    r: "Osteoporotic vertebral compression fractures are managed conservatively in most cases. Acute treatment includes analgesics (calcitonin nasal spray has analgesic properties specific to bone pain), short-term activity modification (not prolonged bed rest which worsens bone loss), and thoracolumbar bracing for comfort. Long-term management requires restarting bisphosphonate therapy, calcium (1200 mg/day), vitamin D (800-1000 IU/day), and fall prevention. Surgery is reserved for fractures with neurological compromise. Steroids worsen osteoporosis. Prolonged bed rest accelerates bone loss.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse practitioner is interpreting spirometry results for a 22-year-old female with episodic wheezing and chest tightness. Baseline FEV1 is 82% predicted with FEV1/FVC ratio of 0.78. After bronchodilator administration, FEV1 improves by 15% and 250 mL. What do these results indicate?",
    o: ["Positive bronchodilator reversibility consistent with asthma; FEV1 improvement of 12% or more and 200 mL or more confirms reversible airway obstruction", "Normal spirometry requiring no further evaluation", "COPD based on the reduced FEV1", "Restrictive lung disease requiring lung volume testing"],
    a: 0,
    r: "Significant bronchodilator reversibility is defined as FEV1 improvement of 12% or more AND 200 mL or more from baseline. This patient demonstrates 15% and 250 mL improvement, confirming reversible airway obstruction characteristic of asthma. The baseline FEV1/FVC of 0.78 is borderline (normal above 0.80 in young adults). COPD shows poor reversibility and occurs in older adults with smoking history. Restrictive disease shows reduced FVC with normal or elevated FEV1/FVC ratio. Treatment should follow GINA stepwise approach.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old male presents with epigastric pain that improves with eating but returns 2-3 hours after meals. He is H. pylori positive by urea breath test. What is the recommended treatment?",
    o: ["Triple therapy: PPI twice daily plus clarithromycin plus amoxicillin for 14 days, followed by confirmation of H. pylori eradication", "PPI monotherapy for 8 weeks with no antibiotic treatment", "Antacids as needed and dietary modification only", "Immediate referral for upper endoscopy before any treatment"],
    a: 0,
    r: "ACG guidelines recommend clarithromycin-based triple therapy (PPI + clarithromycin 500 mg + amoxicillin 1000 mg, all BID x 14 days) as first-line for H. pylori eradication in areas where clarithromycin resistance is below 15%. Bismuth quadruple therapy is an alternative. Confirmation of eradication (urea breath test or stool antigen at least 4 weeks after completing therapy) is essential. PPI alone suppresses but does not eradicate H. pylori. Antacids alone are insufficient. Endoscopy is indicated for alarm symptoms, which this patient lacks.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse practitioner is evaluating a 58-year-old male presenting with progressive exertional dyspnea and bilateral lower extremity edema. Physical exam reveals JVD, an S3 gallop, and bibasilar crackles. BNP is 1,240 pg/mL. Echocardiogram shows EF of 30%. What is the evidence-based pharmacotherapy for this patient?",
    o: ["ACE inhibitor (or ARB), evidence-based beta-blocker (carvedilol, metoprolol succinate, or bisoprolol), and mineralocorticoid receptor antagonist (spironolactone)", "Digoxin as the sole treatment for systolic heart failure", "Calcium channel blocker (amlodipine) for afterload reduction", "Aspirin and statin only since coronary disease is the likely cause"],
    a: 0,
    r: "Heart failure with reduced ejection fraction (HFrEF, EF 30%) requires guideline-directed medical therapy (GDMT) per ACC/AHA: ACE inhibitor/ARB (reduce preload/afterload, improve survival), evidence-based beta-blocker (carvedilol, metoprolol succinate, or bisoprolol — NOT all beta-blockers), and MRA (spironolactone/eplerenone). SGLT2 inhibitors are now also recommended regardless of diabetes status. This four-pillar approach has the strongest mortality reduction evidence. Digoxin reduces hospitalizations but not mortality. Most CCBs (except amlodipine) are harmful in HFrEF.",
    s: "Cardiovascular"
  },
  {
    q: "A 40-year-old female presents with fatigue, pallor, and glossitis. CBC shows: Hgb 9.2 g/dL, MCV 112 fL (macrocytic), WBC 3,200, platelets 128,000. Peripheral smear shows hypersegmented neutrophils. What is the most likely diagnosis and what additional labs should be ordered?",
    o: ["Megaloblastic anemia; order serum vitamin B12, folate, methylmalonic acid, and homocysteine levels", "Iron deficiency anemia; order serum iron, TIBC, and ferritin", "Aplastic anemia; order bone marrow biopsy immediately", "Thalassemia; order hemoglobin electrophoresis"],
    a: 0,
    r: "Macrocytic anemia (MCV above 100 fL) with pancytopenia and hypersegmented neutrophils (5 or more nuclear lobes) is pathognomonic for megaloblastic anemia caused by vitamin B12 or folate deficiency. These vitamins are essential for DNA synthesis, and their deficiency causes abnormally large precursor cells. Methylmalonic acid is elevated only in B12 deficiency (not folate), helping differentiate the two. Homocysteine is elevated in both. Iron deficiency causes microcytic anemia. Aplastic anemia shows hypocellular marrow without megaloblastic changes. Thalassemia is microcytic.",
    s: "Hematology"
  },
  {
    q: "A 65-year-old male smoker presents with a new persistent cough, hemoptysis, and weight loss of 6 kg over 2 months. Chest X-ray shows a 4-cm spiculated mass in the right upper lobe with ipsilateral hilar lymphadenopathy. What is the most appropriate diagnostic and staging workup?",
    o: ["CT chest with contrast, CT-guided biopsy or bronchoscopy for tissue diagnosis, PET-CT for staging, and brain MRI", "Repeat chest X-ray in 3 months to monitor for change", "Start empiric antibiotics for a possible lung abscess", "Refer for immediate surgical resection without biopsy"],
    a: 0,
    r: "A spiculated lung mass with hemoptysis and weight loss in a smoker is lung cancer until proven otherwise. Diagnostic workup requires: CT chest with contrast for detailed characterization, tissue biopsy (CT-guided percutaneous or bronchoscopy depending on location) for histologic diagnosis and molecular testing (EGFR, ALK, PD-L1), PET-CT for whole-body staging, and brain MRI (lung cancer frequently metastasizes to brain). Waiting 3 months risks stage progression. Antibiotics would delay cancer diagnosis. Surgery requires pathologic confirmation and staging first.",
    s: "Respiratory"
  },
  {
    q: "A nurse practitioner is managing a 55-year-old female with type 2 diabetes on metformin and empagliflozin. She presents with dysuria, vulvar pruritus, and a thick white vaginal discharge. Urinalysis shows no bacteria but abundant yeast on wet mount. What is the likely cause?",
    o: ["Vulvovaginal candidiasis as a known adverse effect of SGLT2 inhibitors due to glycosuria creating a favorable environment for yeast", "Bacterial vaginosis requiring metronidazole", "Urinary tract infection requiring antibiotics", "Sexually transmitted infection requiring partner notification"],
    a: 0,
    r: "SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) work by blocking glucose reabsorption in the proximal tubule, causing glycosuria. The increased urinary glucose creates an ideal environment for Candida growth, making vulvovaginal candidiasis a well-known adverse effect (incidence 10-15% in women). Treatment is topical or oral antifungal therapy. BV has a fishy odor with clue cells, not yeast. Urinalysis shows no bacteria. The clinical picture with yeast on wet mount and the SGLT2 inhibitor history is diagnostic. The medication may need to be reconsidered if infections recur.",
    s: "Pharmacology"
  },
  {
    q: "A 72-year-old male with Parkinson's disease is on carbidopa-levodopa. He reports that his medication effectiveness has decreased, with wearing-off episodes occurring before the next dose and involuntary choreiform movements at peak effect. What medication adjustment should the nurse practitioner consider?",
    o: ["Increase dosing frequency with smaller individual doses to reduce motor fluctuations, and consider adding a COMT inhibitor (entacapone) or MAO-B inhibitor", "Double the current dose to overcome the wearing-off effect", "Switch entirely to an anticholinergic medication", "Discontinue carbidopa-levodopa and start only a dopamine agonist"],
    a: 0,
    r: "Motor fluctuations in Parkinson's disease (wearing-off between doses and peak-dose dyskinesia) are common after several years of levodopa therapy (the on-off phenomenon). Management includes: fractionating the total daily dose into more frequent smaller doses (smooths plasma levels), adding a COMT inhibitor (entacapone) to extend levodopa's duration, or adding a MAO-B inhibitor (rasagiline, selegiline) to inhibit dopamine breakdown. Simply doubling the dose worsens dyskinesia. Anticholinergics are limited to tremor. Abrupt levodopa discontinuation risks neuroleptic malignant-like syndrome.",
    s: "Neurological"
  },
  {
    q: "A nurse practitioner is managing a 50-year-old male with newly diagnosed stage 3a chronic kidney disease (eGFR 48 mL/min). He has hypertension, diabetes, and proteinuria (UACR 380 mg/g). Which medication class is most important for slowing CKD progression?",
    o: ["ACE inhibitor or ARB to reduce proteinuria and slow nephropathy progression, titrated to maximum tolerated dose", "Calcium channel blocker (amlodipine) as the sole antihypertensive", "Loop diuretic to reduce fluid overload and lower blood pressure", "Alpha-blocker (doxazosin) for blood pressure control"],
    a: 0,
    r: "ACE inhibitors or ARBs are the cornerstone of CKD management in diabetic nephropathy with proteinuria. They reduce intraglomerular pressure by dilating the efferent arteriole, decreasing proteinuria by 30-50% and significantly slowing progression to ESRD. KDIGO guidelines recommend maximum tolerated doses targeting UACR reduction. SGLT2 inhibitors (finerenone also) are now added for additional renoprotection. CCBs lower BP but do not reduce proteinuria. Loop diuretics manage volume but do not protect kidneys. Alpha-blockers are not first-line for CKD.",
    s: "Renal"
  },
  {
    q: "A 32-year-old female presents 6 weeks postpartum with depressed mood, insomnia, poor appetite, difficulty bonding with her infant, intrusive thoughts of harming the baby, and guilt about these thoughts. She reports the thoughts are ego-dystonic and she has no intention of acting on them. What is the diagnosis and appropriate management?",
    o: ["Postpartum depression with intrusive thoughts (common in PPD); initiate SSRI therapy and arrange psychotherapy, with close follow-up", "Postpartum psychosis requiring immediate psychiatric hospitalization", "Normal baby blues that will resolve spontaneously", "Personality disorder exacerbated by the postpartum period"],
    a: 0,
    r: "Postpartum depression occurring beyond 2 weeks postpartum with ego-dystonic intrusive thoughts (the mother is distressed by the thoughts and has no desire to act on them) is a common feature of PPD, not psychosis. Treatment includes SSRI therapy (sertraline is preferred during breastfeeding due to low milk transfer), psychotherapy (CBT or IPT), and close follow-up with safety planning. Postpartum psychosis presents with ego-syntonic delusions, hallucinations, and disorganized behavior. Baby blues resolve by 2 weeks. The 6-week timeline and symptom severity exceed baby blues.",
    s: "Mental Health"
  },
  {
    q: "A nurse practitioner is interpreting a 12-lead ECG that shows ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery territory is most likely affected?",
    o: ["Right coronary artery supplying the inferior wall of the heart", "Left anterior descending artery supplying the anterior wall", "Left circumflex artery supplying the lateral wall", "Left main coronary artery causing global ischemia"],
    a: 0,
    r: "ST elevation in leads II, III, and aVF localizes to the inferior wall of the left ventricle, supplied by the right coronary artery (RCA) in approximately 85% of patients (right-dominant circulation). Reciprocal changes (ST depression in I, aVL) support the diagnosis. The NP should also obtain right-sided leads (V4R) to evaluate for right ventricular infarction (also RCA territory). LAD supplies the anterior wall (V1-V4). Circumflex supplies the lateral wall (I, aVL, V5-V6). Left main disease typically shows widespread ST changes.",
    s: "Cardiovascular"
  },
  {
    q: "A 28-year-old female presents with amenorrhea for 4 months, galactorrhea, and headaches with bitemporal visual field deficits. Pregnancy test is negative. Serum prolactin is 285 ng/mL (markedly elevated). What is the most likely diagnosis and initial treatment?",
    o: ["Prolactinoma (pituitary macroadenoma); initiate cabergoline as first-line medical therapy", "Hypothyroidism causing secondary hyperprolactinemia", "Pregnancy despite negative test requiring repeat testing", "Non-functioning pituitary adenoma requiring immediate surgery"],
    a: 0,
    r: "Markedly elevated prolactin (above 200 ng/mL) with galactorrhea, amenorrhea, and visual field deficits (chiasmal compression) strongly suggests a prolactin-secreting pituitary macroadenoma (greater than 10 mm). First-line treatment is medical, not surgical: dopamine agonists (cabergoline preferred over bromocriptine due to superior efficacy and fewer side effects) reduce prolactin and shrink the tumor in 80-90% of cases. MRI confirms the diagnosis. Surgery is reserved for medication-resistant tumors. Hypothyroidism causes modest prolactin elevation (below 100). Visual field deficits point to a mass effect.",
    s: "Endocrine"
  },
  {
    q: "A nurse practitioner is evaluating a 45-year-old male with chronic hepatitis C (genotype 1a). His labs show: ALT 78 U/L, AST 65 U/L, platelets 142,000, and FibroScan showing F2 fibrosis. HCV RNA is 2.4 million IU/mL. What is the current standard of care for treatment?",
    o: ["Direct-acting antiviral (DAA) regimen such as sofosbuvir/velpatasvir or glecaprevir/pibrentasvir for 8-12 weeks", "Pegylated interferon plus ribavirin for 48 weeks", "Observation with serial liver function tests every 6 months", "Liver transplant evaluation given the active viral replication"],
    a: 0,
    r: "AASLD/IDSA guidelines recommend DAA therapy for all patients with chronic HCV regardless of fibrosis stage. Pan-genotypic regimens (sofosbuvir/velpatasvir or glecaprevir/pibrentasvir) have cure rates (SVR12) exceeding 95% with 8-12 week courses and minimal side effects. Interferon-based regimens are obsolete due to severe side effects and lower efficacy. Observation alone allows fibrosis progression. Liver transplant is for decompensated cirrhosis or hepatocellular carcinoma, not F2 fibrosis. Treatment at earlier fibrosis stages prevents progression.",
    s: "Gastrointestinal"
  },
  {
    q: "A 60-year-old male with a history of type 2 diabetes and peripheral neuropathy presents with a painless, swollen, erythematous left foot. X-ray shows bone fragmentation and joint destruction of the midfoot with loss of the longitudinal arch. Temperature is 37.2C. WBC is normal. What is the most likely diagnosis?",
    o: ["Charcot neuroarthropathy (Charcot foot); immobilize the foot immediately with total contact casting and strict non-weight bearing", "Osteomyelitis requiring IV antibiotics and surgical debridement", "Gout flare affecting the midfoot joints", "Deep vein thrombosis requiring anticoagulation"],
    a: 0,
    r: "Charcot neuroarthropathy is a devastating complication of diabetic peripheral neuropathy where loss of protective sensation leads to repetitive trauma, inflammation, bone fragmentation, and joint destruction — often painless due to the neuropathy. The midfoot (tarsometatarsal joints) is most commonly affected, causing the classic rocker-bottom deformity. Immediate management is total contact casting and strict non-weight bearing to prevent further structural collapse. Osteomyelitis is a differential but typically has elevated WBC and positive bone culture. Gout has acute onset with urate crystals. DVT does not cause bone destruction.",
    s: "Endocrine"
  },
  {
    q: "A nurse practitioner is performing a comprehensive geriatric assessment on an 80-year-old female. She scores 22/30 on the Mini-Mental State Exam (MMSE), reports two falls in the past 3 months, and takes 12 medications. Which concern requires the most immediate intervention?",
    o: ["Polypharmacy with fall risk requiring comprehensive medication review using the Beers Criteria to identify potentially inappropriate medications", "The MMSE score suggesting early dementia requiring cholinesterase inhibitor initiation", "Social isolation requiring referral to community programs", "Nutritional assessment for potential malnutrition"],
    a: 0,
    r: "Polypharmacy (5 or more medications) combined with recurrent falls is the most immediately actionable finding because medications are the most modifiable fall risk factor. The Beers Criteria identifies potentially inappropriate medications in older adults (anticholinergics, benzodiazepines, opioids, certain antihypertensives) that increase fall risk. Deprescribing can have immediate safety benefits. The MMSE score (22/30) suggests mild cognitive impairment warranting further evaluation but is less immediately dangerous. Social isolation and nutrition are important but less urgent than fall prevention.",
    s: "Neurological"
  },
  {
    q: "A 35-year-old male presents with a painless testicular mass. Ultrasound confirms a solid intratesticular lesion. Serum AFP is elevated at 380 ng/mL and beta-hCG is 12 mIU/mL. LDH is 240 U/L. What is the initial management?",
    o: ["Radical inguinal orchiectomy for definitive diagnosis and treatment, NOT transscrotal biopsy", "Transscrotal needle biopsy for tissue diagnosis before surgery", "Watchful waiting with repeat ultrasound in 3 months", "Empiric antibiotics for possible epididymitis"],
    a: 0,
    r: "Testicular cancer management begins with radical inguinal orchiectomy (NOT transscrotal approach, which risks tumor seeding into the scrotal lymphatic drainage). Elevated AFP suggests a non-seminomatous germ cell tumor (AFP is not elevated in pure seminoma). Beta-hCG can be elevated in both types. Post-orchiectomy staging (CT chest/abdomen/pelvis, repeat markers) guides further treatment (surveillance, chemotherapy, or RPLND). Transscrotal biopsy violates surgical principles. Waiting risks metastasis. Antibiotics are inappropriate for solid testicular masses.",
    s: "Oncology"
  },
  {
    q: "A nurse practitioner is managing a 48-year-old female with fibromyalgia. She reports widespread pain, fatigue, cognitive difficulties (fibro fog), and sleep disturbance. She has failed trials of acetaminophen and ibuprofen. What is the most appropriate pharmacotherapy?",
    o: ["Duloxetine (SNRI) or pregabalin as FDA-approved first-line medications for fibromyalgia", "Oxycodone for chronic pain management", "Prednisone taper for inflammation control", "Methotrexate as a disease-modifying agent"],
    a: 0,
    r: "Three medications are FDA-approved for fibromyalgia: duloxetine (SNRI), milnacipran (SNRI), and pregabalin (alpha-2-delta ligand). Duloxetine addresses pain, fatigue, and mood symptoms. Pregabalin improves pain and sleep. Non-pharmacologic approaches (exercise, CBT, sleep hygiene) are equally important. Opioids are NOT recommended for fibromyalgia (poor efficacy, addiction risk, may worsen central sensitization). Corticosteroids are ineffective because fibromyalgia is not an inflammatory condition. Methotrexate is for autoimmune diseases, not fibromyalgia.",
    s: "Musculoskeletal"
  },
  {
    q: "A 62-year-old male presents with progressive dyspnea on exertion and a harsh crescendo-decrescendo systolic murmur heard best at the right upper sternal border radiating to the carotids. He had a syncopal episode last week. Echocardiogram shows aortic valve area of 0.8 cm2 and a mean gradient of 48 mmHg. What is the management?",
    o: ["Referral for aortic valve replacement (surgical or transcatheter) as the patient has severe symptomatic aortic stenosis", "Medical management with vasodilators to reduce afterload", "Exercise stress testing to determine functional capacity", "Watchful waiting with annual echocardiograms"],
    a: 0,
    r: "Severe aortic stenosis (valve area below 1.0 cm2, mean gradient above 40 mmHg) with symptoms (syncope, dyspnea, angina) has a very poor prognosis without intervention (50% mortality at 2 years with syncope). Aortic valve replacement (SAVR or TAVR based on surgical risk) is indicated for all symptomatic severe AS. Vasodilators are contraindicated (can cause severe hypotension due to fixed outflow obstruction). Exercise testing is contraindicated in symptomatic severe AS. Watchful waiting is only appropriate for asymptomatic severe AS.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse practitioner is counseling a 30-year-old female who wishes to become pregnant. She takes valproic acid for epilepsy, lisinopril for hypertension, and a statin for dyslipidemia. Which preconception medication changes are essential?",
    o: ["Discontinue valproic acid (teratogenic: neural tube defects), lisinopril (fetotoxic: renal agenesis), and the statin (category X), and switch to safer alternatives before conception", "Continue all medications since stopping them poses greater risk to the mother", "Discontinue only valproic acid and continue lisinopril and the statin", "Switch all medications to herbal alternatives during pregnancy"],
    a: 0,
    r: "Preconception counseling requires identifying and replacing teratogenic medications: Valproic acid causes neural tube defects (spina bifida) in 1-2% of exposed pregnancies and cognitive impairment — switch to lamotrigine or levetiracetam. ACE inhibitors (lisinopril) cause fetal renal agenesis, oligohydramnios, and skull ossification defects — switch to labetalol or nifedipine. Statins are contraindicated in pregnancy — discontinue. High-dose folic acid (4 mg/day) should be started 3 months before conception for women on anti-epileptic drugs.",
    s: "Pharmacology"
  },
  {
    q: "A nurse practitioner is evaluating a 50-year-old male with cirrhosis (Child-Pugh B) who presents with hematemesis. His BP is 88/56, HR 118. After initial resuscitation, emergent EGD reveals actively bleeding esophageal varices. What is the pharmacologic adjunct to endoscopic treatment?",
    o: ["IV octreotide to reduce portal pressure and splanchnic blood flow, combined with IV antibiotics (ceftriaxone) for SBP prophylaxis", "IV pantoprazole 80 mg bolus followed by continuous infusion", "IV vasopressin without nitroglycerin", "Oral propranolol to reduce portal hypertension"],
    a: 0,
    r: "Acute variceal hemorrhage management includes: endoscopic band ligation (definitive), IV octreotide (somatostatin analog that reduces portal pressure and splanchnic blood flow for 3-5 days), and prophylactic antibiotics (ceftriaxone 1g/day x 7 days) because cirrhotic patients with GI bleeding have a 20% risk of spontaneous bacterial peritonitis and infections worsen rebleeding risk. PPI infusion is for peptic ulcer bleeding, not variceal. Vasopressin alone causes coronary vasoconstriction. Oral propranolol is for secondary prophylaxis, not acute hemorrhage.",
    s: "Gastrointestinal"
  },
  {
    q: "A 40-year-old female presents with progressive bilateral hand weakness, difficulty releasing grip, and percussion myotonia (sustained contraction after tapping the thenar eminence). She also reports frontal balding and cataracts. Family history reveals her mother had similar symptoms. What is the most likely diagnosis?",
    o: ["Myotonic dystrophy type 1 (Steinert disease), an autosomal dominant trinucleotide repeat disorder", "Myasthenia gravis requiring edrophonium testing", "Carpal tunnel syndrome requiring nerve conduction studies", "Polymyositis requiring creatine kinase levels and muscle biopsy"],
    a: 0,
    r: "Myotonic dystrophy type 1 is the most common adult muscular dystrophy, caused by CTG trinucleotide repeat expansion in the DMPK gene (autosomal dominant with anticipation). Classic features include: distal muscle weakness (hands, feet), myotonia (inability to relax muscles after contraction), percussion myotonia, frontal balding, cataracts (posterior subcapsular), cardiac conduction defects, and cognitive impairment. Family history with affected mother confirms autosomal dominant inheritance. Myasthenia gravis has fatigable weakness, not myotonia. CTS does not cause myotonia. Polymyositis has proximal weakness without myotonia.",
    s: "Neurological"
  },
  {
    q: "A nurse practitioner is managing a 55-year-old male with suspected obstructive sleep apnea. He reports excessive daytime somnolence, witnessed apneic episodes, and an Epworth Sleepiness Scale score of 16. BMI is 36. What is the diagnostic gold standard and first-line treatment?",
    o: ["Polysomnography (sleep study) for diagnosis, followed by continuous positive airway pressure (CPAP) as first-line treatment if AHI is 15 or greater", "Home pulse oximetry as the definitive diagnostic test", "Immediate uvulopalatopharyngoplasty (UPPP) without sleep study", "Modafinil for daytime sleepiness as the primary treatment"],
    a: 0,
    r: "In-laboratory polysomnography (PSG) is the gold standard for OSA diagnosis, measuring apnea-hypopnea index (AHI), oxygen desaturation, sleep architecture, and cardiac rhythm. Home sleep apnea testing (HSAT) is an acceptable alternative for uncomplicated cases. CPAP is first-line treatment for moderate-severe OSA (AHI 15 or greater) or symptomatic mild OSA. CPAP reduces AHI, improves daytime function, and decreases cardiovascular risk. Weight loss is adjunctive. Pulse oximetry alone is insufficient. Surgery is second-line. Modafinil treats residual sleepiness despite CPAP, not primary OSA.",
    s: "Respiratory"
  },
  {
    q: "A nurse practitioner is evaluating a 65-year-old female with a GFR of 22 mL/min (CKD stage 4). Labs show: calcium 8.0 mg/dL, phosphorus 6.2 mg/dL, PTH 320 pg/mL (elevated), and vitamin D 12 ng/mL (low). What is the pathophysiology and management of these findings?",
    o: ["Secondary hyperparathyroidism from CKD; manage with phosphate binders, active vitamin D (calcitriol), dietary phosphorus restriction, and possibly calcimimetics", "Primary hyperparathyroidism requiring parathyroidectomy", "Vitamin D toxicity requiring medication discontinuation", "Milk-alkali syndrome from excessive calcium intake"],
    a: 0,
    r: "CKD stage 4 causes secondary hyperparathyroidism through: reduced 1-alpha hydroxylation (low active vitamin D), phosphorus retention (impaired excretion), and hypocalcemia (reduced calcium absorption). The parathyroids compensate by increasing PTH to maintain calcium homeostasis (CKD-MBD: mineral bone disorder). Management per KDIGO: phosphate binders with meals (sevelamer, calcium acetate), calcitriol or paricalcitol (active vitamin D), dietary phosphorus restriction (800-1000 mg/day), and cinacalcet (calcimimetic) if PTH remains elevated. Primary hyperparathyroidism has HIGH calcium. Vitamin D toxicity causes hypercalcemia.",
    s: "Renal"
  },
  {
    q: "A nurse practitioner is treating a 22-year-old college student who presents with sore throat, fever, cervical lymphadenopathy, and splenomegaly for 10 days. The rapid strep test is negative. Monospot test is positive. CBC shows atypical lymphocytes. What is the diagnosis and which medication must be avoided?",
    o: ["Infectious mononucleosis caused by Epstein-Barr virus; avoid amoxicillin and ampicillin which cause a characteristic diffuse maculopapular rash", "Streptococcal pharyngitis requiring high-dose penicillin despite the negative rapid test", "Acute HIV infection requiring immediate antiretroviral therapy", "Lymphoma requiring urgent oncology referral"],
    a: 0,
    r: "Infectious mononucleosis (EBV) presents with fever, pharyngitis, lymphadenopathy, splenomegaly, and atypical lymphocytes. Monospot (heterophile antibody test) confirms the diagnosis. Aminopenicillins (amoxicillin, ampicillin) must be avoided because 90% of EBV-infected patients develop a diffuse pruritic maculopapular rash (not a true allergy but an immune-mediated reaction). Management is supportive: rest, fluids, analgesics, and avoiding contact sports for 3-4 weeks due to splenic rupture risk. Acute HIV has similar symptoms but monospot is negative. Persistent symptoms beyond 4 weeks warrant lymphoma evaluation.",
    s: "Infection Control"
  },
  {
    q: "A nurse practitioner is managing a 70-year-old female who presents with confusion, urinary incontinence, and gait disturbance (magnetic gait with wide base and short shuffling steps). CT head shows ventricular enlargement out of proportion to sulcal atrophy. What is the most likely diagnosis and diagnostic test?",
    o: ["Normal pressure hydrocephalus (NPH); confirmed by clinical improvement after large-volume lumbar puncture (tap test)", "Alzheimer's disease requiring cholinesterase inhibitor", "Parkinson's disease requiring carbidopa-levodopa", "Vascular dementia requiring antiplatelet therapy"],
    a: 0,
    r: "The classic triad of normal pressure hydrocephalus (Hakim triad) is: gait disturbance (usually the first and most prominent symptom — magnetic, wide-based, shuffling), dementia (subcortical pattern), and urinary incontinence (wet, wacky, and wobbly). CT showing ventriculomegaly disproportionate to cortical atrophy supports the diagnosis. Large-volume LP (30-50 mL CSF removal) with gait improvement confirms the diagnosis and predicts shunt response. VP shunt is the definitive treatment. Alzheimer's has cortical atrophy proportional to ventricle size. Parkinson's has different gait (festinating, not magnetic). Vascular dementia has step-wise progression.",
    s: "Neurological"
  },
  {
    q: "A nurse practitioner is evaluating a 45-year-old male with a 10-year history of poorly controlled type 2 diabetes (A1c 9.2%) who now presents with frothy urine and bilateral pedal edema. Urinalysis shows 3+ protein. 24-hour urine protein is 4.2 g. Serum albumin is 2.8 g/dL. Serum creatinine is 1.8 mg/dL. What clinical syndrome does this represent?",
    o: ["Nephrotic syndrome from diabetic nephropathy; characterized by proteinuria greater than 3.5 g/day, hypoalbuminemia, edema, and hyperlipidemia", "Nephritic syndrome with hematuria and red blood cell casts", "Acute kidney injury from dehydration", "Chronic interstitial nephritis from medication toxicity"],
    a: 0,
    r: "Nephrotic syndrome is defined by: proteinuria greater than 3.5 g/day (this patient has 4.2 g), hypoalbuminemia (below 3.0 g/dL), peripheral edema (from decreased oncotic pressure), and hyperlipidemia (hepatic overproduction of lipoproteins to compensate for protein loss). Diabetic nephropathy is the most common cause of nephrotic syndrome in adults. Management includes: maximum dose ACE inhibitor/ARB, SGLT2 inhibitor, glycemic optimization, sodium restriction, and possibly diuretics for edema. Nephritic syndrome features hematuria, RBC casts, and hypertension. AKI from dehydration would not cause proteinuria of this magnitude.",
    s: "Renal"
  }
];
