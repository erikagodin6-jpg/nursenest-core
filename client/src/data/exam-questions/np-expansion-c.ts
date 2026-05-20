import type { ExamQuestion } from "./types";

export const npExpansionCQuestions: ExamQuestion[] = [
  {
    q: "A 62-year-old male presents with a 6-month history of progressive exertional dyspnoea. Chest radiograph shows bilateral hilar lymphadenopathy. Spirometry reveals an FEV1/FVC ratio of 0.82 with reduced DLCO. Serum ACE level is elevated. What is the most appropriate next diagnostic step?",
    o: ["CT scan of the chest followed by transbronchial biopsy to confirm non-caseating granulomas", "Start prednisone 40 mg daily empirically and reassess in 4 weeks", "Order sputum acid-fast bacilli cultures and initiate tuberculosis isolation", "Refer for immediate thoracotomy and open lung biopsy"],
    a: 0,
    r: "The presentation is classic for pulmonary sarcoidosis: bilateral hilar lymphadenopathy, restrictive pattern with reduced DLCO, and elevated ACE. CT chest provides detailed staging and transbronchial biopsy confirms non-caseating granulomas while ruling out infection and malignancy. Empiric steroids without tissue diagnosis risk treating an undiagnosed malignancy or infection. While TB should be considered, the bilateral hilar pattern and elevated ACE favour sarcoidosis. Open lung biopsy is unnecessarily invasive when bronchoscopic biopsy has high diagnostic yield.",
    s: "Respiratory"
  },
  {
    q: "A 34-year-old woman presents with recurrent episodes of palpitations, diaphoresis, and severe headache. Blood pressure during an episode is 210/120 mmHg. Between episodes, blood pressure is 128/78 mmHg. Which initial diagnostic test is most appropriate?",
    o: ["Plasma-free metanephrines or 24-hour urine for fractionated metanephrines and catecholamines", "CT scan of the adrenal glands", "Serum aldosterone-to-renin ratio", "Renal artery duplex ultrasonography"],
    a: 0,
    r: "Episodic hypertension with the classic triad of headache, diaphoresis, and palpitations is highly suggestive of pheochromocytoma. Biochemical confirmation must precede imaging. Plasma-free metanephrines have the highest sensitivity (96-100%) for diagnosis. CT adrenals is appropriate only after biochemical confirmation to avoid false-positive incidental findings. Aldosterone-renin ratio screens for primary aldosteronism, which presents with sustained rather than episodic hypertension. Renal artery imaging evaluates renovascular hypertension, a different entity.",
    s: "Cardiovascular"
  },
  {
    q: "A 28-year-old woman at 10 weeks gestation presents with a TSH of 0.3 mIU/L and free T4 of 22 pmol/L. She has no thyroid history, no goitre, and no symptoms of hyperthyroidism. What is the most appropriate management?",
    o: ["Reassure and monitor, as this likely represents normal gestational thyrotoxicosis mediated by hCG", "Start propylthiouracil immediately to prevent fetal thyrotoxicosis", "Order thyroid receptor antibodies and refer to endocrinology urgently", "Perform radioactive iodine uptake scan to differentiate Graves disease from gestational thyrotoxicosis"],
    a: 0,
    r: "In early pregnancy, hCG has structural homology with TSH and can stimulate the thyroid, causing a transient suppression of TSH with mildly elevated free T4. This gestational thyrotoxicosis is self-limiting, resolving by 14-18 weeks as hCG declines. In the absence of symptoms, goitre, or ophthalmopathy, no treatment is needed. PTU would be inappropriate without confirmed hyperthyroidism. TRAb testing is warranted only if clinical features suggest Graves disease. Radioactive iodine is absolutely contraindicated in pregnancy.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old male with type 2 diabetes, eGFR 42 mL/min/1.73m², and a history of heart failure with reduced ejection fraction (EF 35%) presents for medication review. Current HbA1c is 8.2% on metformin 1000 mg twice daily. Which additional agent is most appropriate?",
    o: ["An SGLT2 inhibitor such as empagliflozin, which provides glycaemic, renal, and cardiovascular benefit", "Add glyburide 5 mg daily for additional glycaemic control", "Start insulin glargine 10 units at bedtime", "Add sitagliptin 100 mg daily"],
    a: 0,
    r: "SGLT2 inhibitors (empagliflozin, dapagliflozin) have robust evidence for reducing heart failure hospitalisations, slowing CKD progression, and improving glycaemic control. In a patient with HFrEF and CKD stage 3b, an SGLT2 inhibitor addresses all three conditions. Glyburide is contraindicated in renal impairment due to accumulation of active metabolites and hypoglycaemia risk. Insulin is effective but does not provide cardio-renal benefit. Sitagliptin requires dose adjustment and lacks the proven HF and renal outcomes of SGLT2 inhibitors.",
    s: "Pharmacology"
  },
  {
    q: "A 72-year-old woman presents with acute onset of right-sided facial droop, arm weakness, and aphasia. Symptoms began 90 minutes ago. CT head shows no haemorrhage. Blood glucose is 6.8 mmol/L. Blood pressure is 178/96 mmHg. What is the most appropriate immediate action?",
    o: ["Administer IV alteplase within the 4.5-hour window after confirming no contraindications", "Administer IV labetalol to reduce blood pressure below 140/90 mmHg before any other intervention", "Order MRI brain with diffusion-weighted imaging before making treatment decisions", "Start aspirin 325 mg and admit for observation"],
    a: 0,
    r: "This patient presents with acute ischaemic stroke within the thrombolytic window (< 4.5 hours). CT has excluded haemorrhage and glucose is normal. IV alteplase is indicated. Blood pressure does not need to be lowered below 185/110 mmHg before thrombolysis; this patient's BP of 178/96 is within acceptable range. Waiting for MRI delays time-critical treatment. Aspirin is appropriate for patients who are not candidates for thrombolysis but should not replace it when alteplase is indicated.",
    s: "Neurological"
  },
  {
    q: "A 45-year-old male presents with a painless, firm, 2-cm left testicular mass discovered on self-examination. Ultrasound confirms a solid intratesticular lesion. Serum AFP is elevated at 85 ng/mL. Beta-hCG and LDH are normal. What is the most appropriate next step?",
    o: ["Radical inguinal orchiectomy for definitive diagnosis and staging", "Transcrotal needle biopsy of the mass for tissue diagnosis", "Start empiric antibiotics and reassess in 2 weeks", "Order CT abdomen and pelvis before any surgical intervention"],
    a: 0,
    r: "A solid intratesticular mass with elevated AFP is testicular cancer until proven otherwise. Radical inguinal orchiectomy is both diagnostic and therapeutic, providing tissue for histological classification and staging. Transcrotal biopsy is contraindicated due to risk of tumour seeding along the scrotal skin and altering lymphatic drainage patterns. Antibiotics are inappropriate for a solid mass with elevated tumour markers. CT staging is important but is performed after orchiectomy, as it does not change the initial surgical approach.",
    s: "Genitourinary"
  },
  {
    q: "A 38-year-old woman presents with a 4-week history of bloody diarrhoea, tenesmus, and crampy lower abdominal pain. Colonoscopy reveals continuous mucosal inflammation extending from the rectum to the splenic flexure with loss of vascular pattern and contact bleeding. Biopsies show crypt abscesses and mucosal inflammation without granulomas. What is the most likely diagnosis?",
    o: ["Ulcerative colitis with left-sided disease extending to the splenic flexure", "Crohn disease of the colon", "Infectious colitis due to Clostridioides difficile", "Ischaemic colitis of the descending colon"],
    a: 0,
    r: "Continuous mucosal inflammation starting from the rectum, crypt abscesses, and absence of granulomas are hallmarks of ulcerative colitis. Extension to the splenic flexure classifies this as left-sided colitis (E2 in Montreal classification). Crohn disease typically shows skip lesions, transmural inflammation, and non-caseating granulomas. C. difficile colitis can mimic UC but usually has a history of antibiotic exposure and pseudomembranes. Ischaemic colitis typically affects the watershed area (splenic flexure) with a sudden onset and does not start from the rectum.",
    s: "GI"
  },
  {
    q: "A 68-year-old female with a 40-pack-year smoking history presents with persistent cough, hemoptysis, and 5 kg weight loss over 3 months. Chest CT reveals a 4-cm spiculated mass in the right upper lobe with ipsilateral mediastinal lymphadenopathy. What is the most appropriate next step?",
    o: ["CT-guided percutaneous biopsy or bronchoscopy with biopsy for tissue diagnosis and staging", "Immediate referral for right upper lobectomy without tissue diagnosis", "Start broad-spectrum antibiotics for 6 weeks and repeat imaging", "Order PET-CT scan as the sole diagnostic investigation"],
    a: 0,
    r: "A spiculated lung mass with mediastinal lymphadenopathy in a heavy smoker is highly suspicious for lung cancer. Tissue diagnosis is essential before treatment planning, as histological subtype determines treatment approach. Biopsy can be obtained via CT-guided percutaneous approach or bronchoscopy depending on lesion location. Surgery without tissue diagnosis is inappropriate, especially with mediastinal involvement suggesting possible stage III disease. Antibiotics delay diagnosis of a likely malignancy. PET-CT is valuable for staging but does not provide histological diagnosis.",
    s: "Respiratory"
  },
  {
    q: "A 52-year-old male presents with a serum creatinine of 186 µmol/L (baseline 95 µmol/L three months ago), potassium of 5.8 mmol/L, and bilateral lower extremity oedema. He was started on lisinopril 20 mg and naproxen 500 mg twice daily 6 weeks ago for hypertension and osteoarthritis respectively. Urinalysis is bland. What is the most likely cause of his acute kidney injury?",
    o: ["Combined haemodynamic effect of ACE inhibitor reducing efferent arteriolar tone and NSAID reducing afferent arteriolar flow", "Acute interstitial nephritis from lisinopril", "NSAID-induced papillary necrosis", "Bilateral renal artery stenosis unmasked by ACE inhibitor therapy"],
    a: 0,
    r: "The combination of an ACE inhibitor and NSAID is a well-recognised cause of acute kidney injury. ACEi dilates the efferent arteriole (reducing filtration pressure) while NSAIDs constrict the afferent arteriole (reducing renal blood flow). Together, they critically reduce glomerular filtration pressure. The bland urinalysis and temporal correlation with dual-drug initiation support this diagnosis. Interstitial nephritis typically shows pyuria, WBC casts, and eosinophiluria. Papillary necrosis presents with flank pain and haematuria. Renal artery stenosis is possible but less likely given the clear drug-related temporal association.",
    s: "Renal"
  },
  {
    q: "A 16-year-old female presents with primary amenorrhoea. Physical examination reveals normal breast development (Tanner stage 4) but absent pubic and axillary hair. Pelvic ultrasound shows a blind-ending vaginal pouch with no visible uterus. Karyotype is 46,XY. What is the most likely diagnosis?",
    o: ["Complete androgen insensitivity syndrome", "Turner syndrome (45,X)", "Mullerian agenesis (Mayer-Rokitansky-Kuster-Hauser syndrome)", "5-alpha reductase deficiency"],
    a: 0,
    r: "Complete androgen insensitivity syndrome (CAIS) presents with primary amenorrhoea, female phenotype with breast development (due to peripheral aromatisation of testosterone to oestradiol), absent pubic/axillary hair (androgen-dependent), absent uterus (due to anti-Mullerian hormone from testes), and 46,XY karyotype. Turner syndrome has a 45,X karyotype. MRKH presents with absent uterus but has 46,XX karyotype and normal secondary sexual characteristics including pubic hair. 5-alpha reductase deficiency presents with ambiguous genitalia at birth and virilisation at puberty.",
    s: "Reproductive"
  },
  {
    q: "A 70-year-old male with known atrial fibrillation, hypertension, diabetes, and prior stroke presents for anticoagulation review. His CHA₂DS₂-VASc score is 6. He is currently on warfarin with a time in therapeutic range of 45% over the past 6 months. What is the most appropriate change?",
    o: ["Switch to a direct oral anticoagulant such as apixaban or rivaroxaban for more consistent anticoagulation", "Increase warfarin dose and recheck INR weekly", "Add aspirin to warfarin for additional stroke prevention", "Discontinue anticoagulation due to poor INR control and switch to aspirin monotherapy"],
    a: 0,
    r: "With a CHA₂DS₂-VASc of 6, this patient is at very high stroke risk. A TTR below 65% indicates poor warfarin control and is associated with both increased stroke and bleeding risk. DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) provide predictable pharmacokinetics without INR monitoring, and landmark trials demonstrated non-inferiority or superiority to warfarin for stroke prevention with lower intracranial bleeding risk. Adding aspirin to warfarin increases bleeding without additional stroke benefit. Switching to aspirin alone is inadequate for this risk level.",
    s: "Cardiovascular"
  },
  {
    q: "A 42-year-old woman presents with symmetric polyarthralgia affecting the metacarpophalangeal and proximal interphalangeal joints bilaterally, morning stiffness lasting 90 minutes, and fatigue for 8 weeks. RF is positive and anti-CCP antibodies are strongly positive. ESR is 48 mm/hr. Radiographs show periarticular osteopaenia but no erosions. What is the most appropriate initial treatment?",
    o: ["Methotrexate as first-line DMARD therapy with folic acid supplementation", "Prednisone 60 mg daily as monotherapy", "Hydroxychloroquine monotherapy", "Ibuprofen 600 mg three times daily as primary treatment"],
    a: 0,
    r: "This presentation meets ACR/EULAR criteria for rheumatoid arthritis. Methotrexate is the anchor DMARD recommended as first-line by all major guidelines due to its efficacy in controlling disease activity, preventing erosions, and favourable long-term safety profile. Folic acid reduces side effects. High-dose prednisone alone does not prevent joint destruction and has significant long-term toxicity. Hydroxychloroquine is less effective as monotherapy for seropositive, high-inflammatory RA. NSAIDs provide symptomatic relief but do not modify disease progression.",
    s: "Musculoskeletal"
  },
  {
    q: "A 58-year-old male with a BMI of 36 presents with daytime somnolence, witnessed apnoeas, and an Epworth Sleepiness Scale score of 16. His neck circumference is 44 cm. Polysomnography reveals an apnoea-hypopnoea index of 32 events/hour. What is the most appropriate initial treatment?",
    o: ["Continuous positive airway pressure therapy as first-line treatment for moderate-to-severe obstructive sleep apnoea", "Refer for uvulopalatopharyngoplasty as first-line treatment", "Prescribe modafinil for daytime somnolence", "Recommend positional therapy alone with a tennis ball technique"],
    a: 0,
    r: "An AHI of 32 classifies this as severe obstructive sleep apnoea. CPAP is the gold-standard first-line treatment for moderate-to-severe OSA, reducing AHI, improving daytime somnolence, and decreasing cardiovascular risk. UPPP has variable success rates and is considered when CPAP fails or is not tolerated. Modafinil may be adjunctive for residual sleepiness on CPAP but does not treat the obstruction. Positional therapy alone is insufficient for severe OSA, though weight loss should be recommended as adjunctive therapy.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old male presents with a first unprovoked generalised tonic-clonic seizure. He has no significant medical history. Neurological examination is normal. MRI brain is unremarkable. EEG shows generalised 3-Hz spike-and-wave discharges. What is the most appropriate management?",
    o: ["Start an antiseizure medication such as valproate or levetiracetam, as the EEG findings indicate a high recurrence risk", "Reassure that a single seizure does not require treatment and observe", "Order a lumbar puncture to rule out meningoencephalitis", "Start phenytoin as the preferred first-line agent for generalised epilepsy"],
    a: 0,
    r: "While a single unprovoked seizure has a ~40% recurrence risk overall, the presence of generalised spike-and-wave discharges on EEG significantly increases recurrence risk (>60%), justifying initiation of antiseizure medication. Valproate is highly effective for generalised epilepsies (especially with 3-Hz spike-wave suggesting idiopathic/genetic generalised epilepsy), though levetiracetam is an alternative, particularly in women of childbearing potential. Observation alone would be reasonable only if EEG and MRI were entirely normal. LP is unnecessary without clinical signs of infection. Phenytoin is not first-line for generalised epilepsy and may worsen absence seizures.",
    s: "Neurological"
  },
  {
    q: "A 48-year-old woman presents with a 3-month history of progressive dysphagia to solids and liquids equally, with regurgitation of undigested food. Barium swallow shows a dilated oesophagus with a smooth, tapered narrowing at the gastro-oesophageal junction (bird-beak sign). Oesophageal manometry confirms absent peristalsis and incomplete lower oesophageal sphincter relaxation. What is the definitive treatment?",
    o: ["Laparoscopic Heller myotomy with partial fundoplication, which has the highest long-term success rate", "Lifelong proton pump inhibitor therapy", "Endoscopic botulinum toxin injection as definitive treatment", "Oesophagectomy"],
    a: 0,
    r: "The presentation is classic achalasia: equal dysphagia to solids and liquids, bird-beak sign, absent peristalsis, and failed LES relaxation. Laparoscopic Heller myotomy with partial (Dor or Toupet) fundoplication provides the best long-term symptom relief (>90% success at 5 years). Peroral endoscopic myotomy (POEM) is an emerging alternative. PPIs do not address the motility disorder. Botulinum toxin provides temporary relief (3-6 months) and is reserved for patients who are not surgical candidates. Oesophagectomy is reserved for end-stage disease refractory to all other treatments.",
    s: "GI"
  },
  {
    q: "A 65-year-old female with well-controlled hypertension presents for routine screening. Fasting lipid panel shows total cholesterol 6.8 mmol/L, LDL 4.2 mmol/L, HDL 1.3 mmol/L, and triglycerides 1.8 mmol/L. Her 10-year Framingham Risk Score is 18%. She has no diabetes or established cardiovascular disease. What is the most appropriate management?",
    o: ["Initiate moderate-to-high intensity statin therapy based on her elevated cardiovascular risk", "Recommend lifestyle modifications alone and recheck lipids in 6 months", "Start ezetimibe as first-line lipid-lowering therapy", "Start a PCSK9 inhibitor for aggressive LDL reduction"],
    a: 0,
    r: "With a 10-year FRS of 18% (intermediate-high risk) and significantly elevated LDL, Canadian Cardiovascular Society guidelines recommend statin therapy. Statins are first-line for primary prevention in patients with intermediate or high cardiovascular risk. Lifestyle modifications alone are insufficient at this risk level. Ezetimibe is second-line, added when statin monotherapy fails to achieve targets. PCSK9 inhibitors are reserved for familial hypercholesterolaemia or patients failing maximally tolerated statin plus ezetimibe therapy.",
    s: "Cardiovascular"
  },
  {
    q: "A 30-year-old woman presents with a 2-cm palpable breast mass. Ultrasound shows a well-circumscribed, solid, oval mass with homogeneous echotexture, classified as BI-RADS 3. She has no family history of breast cancer. What is the most appropriate management?",
    o: ["Short-interval follow-up imaging at 6 months, with biopsy if the lesion changes", "Immediate excisional biopsy", "Bilateral mammography with tomosynthesis", "MRI breast with gadolinium contrast"],
    a: 0,
    r: "BI-RADS 3 (probably benign) lesions have a malignancy rate of less than 2%. Guidelines recommend short-interval follow-up (typically at 6 months) to assess for stability, with biopsy if the lesion enlarges or changes character. In a young woman with a well-circumscribed solid mass and no risk factors, this is most likely a fibroadenoma. Immediate excisional biopsy is unnecessarily invasive for a probably benign lesion. Mammography has limited sensitivity in dense breast tissue of young women. MRI is not indicated for BI-RADS 3 lesions without high-risk features.",
    s: "Reproductive"
  },
  {
    q: "A 7-year-old boy presents with periorbital oedema, generalised oedema, and foamy urine for 2 weeks. Urinalysis shows 4+ protein with no haematuria. Serum albumin is 18 g/L and serum cholesterol is 9.2 mmol/L. Renal function is normal. What is the most appropriate initial management?",
    o: ["Start oral prednisone at 2 mg/kg/day (max 60 mg) for 4-6 weeks as first-line treatment for presumed minimal change disease", "Perform renal biopsy before starting any treatment", "Start furosemide and albumin infusion as primary treatment", "Begin cyclosporine as first-line immunosuppressive therapy"],
    a: 0,
    r: "In children aged 1-12 years, nephrotic syndrome (heavy proteinuria, hypoalbuminaemia, hyperlipidaemia, oedema) is most commonly caused by minimal change disease (~80% of cases). ISKDC guidelines recommend empiric corticosteroid therapy without biopsy in typical presentations, as ~90% of MCD responds to steroids within 4 weeks. Renal biopsy is reserved for steroid-resistant cases, atypical features (haematuria, hypertension, low C3), or age outside the typical range. Diuretics and albumin are supportive measures, not definitive treatment. Cyclosporine is second-line for steroid-dependent or frequently relapsing cases.",
    s: "Renal"
  },
  {
    q: "A 35-year-old woman presents with recurrent episodes of intense fear, palpitations, diaphoresis, trembling, and a sensation of impending doom lasting 10-15 minutes. Episodes occur without any identifiable trigger. Between episodes, she constantly worries about having another attack and avoids crowded places. What is the first-line treatment?",
    o: ["An SSRI such as sertraline or paroxetine combined with cognitive-behavioural therapy", "Alprazolam 1 mg three times daily as long-term maintenance therapy", "Propranolol 40 mg twice daily as monotherapy", "Referral for psychodynamic psychotherapy as sole treatment"],
    a: 0,
    r: "This presentation is classic panic disorder with agoraphobia. First-line treatment per CPA and NICE guidelines is an SSRI (sertraline, paroxetine, or escitalopram) combined with CBT, which has the strongest evidence for sustained improvement. Long-term benzodiazepine use carries risks of dependence, tolerance, and cognitive impairment and is not recommended as primary therapy. Beta-blockers may help with somatic symptoms but do not address the core anxiety or avoidance. Psychodynamic therapy has weaker evidence than CBT for panic disorder.",
    s: "Mental Health"
  },
  {
    q: "A 60-year-old male with a 30-pack-year smoking history presents with a new skin lesion on his lower lip. Examination reveals a 1.5-cm indurated, ulcerated lesion with rolled borders on the vermilion border. There is no cervical lymphadenopathy. What is the most appropriate next step?",
    o: ["Punch or incisional biopsy of the lesion for histopathological diagnosis", "Apply topical 5-fluorouracil cream and reassess in 6 weeks", "Prescribe a course of acyclovir for presumed herpetic ulcer", "Observe the lesion for spontaneous resolution over 4 weeks"],
    a: 0,
    r: "An indurated, ulcerated lesion with rolled borders on the lower lip vermilion border in a smoker is highly suspicious for squamous cell carcinoma. The lower lip is the most common site for lip SCC due to UV and tobacco exposure. Biopsy is essential for definitive diagnosis before treatment planning. Topical 5-FU is used for actinic keratoses, not suspected invasive SCC. The clinical features are not consistent with herpes simplex. Observation delays diagnosis of a potentially aggressive malignancy.",
    s: "Dermatology"
  }
];
