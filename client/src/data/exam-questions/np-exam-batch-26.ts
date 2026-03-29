import type { ExamQuestion } from "./types";

export const npExamBatch26Questions: ExamQuestion[] = [
  {
    q: "A 50-year-old male presents with exertional syncope and a systolic crescendo-decrescendo murmur best heard at the right upper sternal border radiating to the carotids. The murmur intensifies with squatting and decreases with Valsalva. What is the most likely valvular pathology?",
    o: ["Aortic stenosis", "Hypertrophic obstructive cardiomyopathy", "Mitral regurgitation", "Tricuspid regurgitation"],
    a: 0,
    r: "A systolic crescendo-decrescendo murmur at the right upper sternal border radiating to the carotids is classic for aortic stenosis. Key differentiator: AS murmur increases with maneuvers that increase blood flow across the valve (squatting, leg elevation) and decreases with reduced venous return (Valsalva, standing). HOCM behaves oppositely -- louder with Valsalva and standing. Exertional syncope is one of the classic symptoms of severe AS.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old male on aspirin and clopidogrel following coronary stenting 6 months ago needs a colonoscopy. The gastroenterologist wants to stop clopidogrel before the procedure. What should the NP advise regarding antiplatelet management?",
    o: ["Continue aspirin; hold clopidogrel 5-7 days before elective procedures for bare-metal stents but maintain for 12 months minimum for drug-eluting stents before elective surgery", "Stop both aspirin and clopidogrel 7 days before the procedure", "Continue both medications during the procedure", "Replace clopidogrel with warfarin bridging"],
    a: 0,
    r: "Premature discontinuation of dual antiplatelet therapy (DAPT) after coronary stenting is the strongest risk factor for stent thrombosis, a catastrophic event with 40% mortality. DES requires minimum 6-12 months of DAPT. Elective procedures should be delayed until the minimum DAPT duration is met. If surgery cannot wait, aspirin should never be discontinued. Shared decision-making between NP, cardiologist, and proceduralist is essential.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male with type 2 diabetes and LVEF 35% heart failure has HbA1c of 8.4% on metformin 2000 mg. Which SGLT2 inhibitor has the strongest evidence for mortality reduction in heart failure with reduced ejection fraction?",
    o: ["Dapagliflozin or empagliflozin (both have demonstrated mortality and hospitalization reduction in HFrEF trials regardless of diabetes status)", "Canagliflozin", "Ertugliflozin", "Sotagliflozin"],
    a: 0,
    r: "The DAPA-HF trial (dapagliflozin) and EMPEROR-Reduced trial (empagliflozin) demonstrated significant reduction in cardiovascular death and heart failure hospitalization in HFrEF patients, regardless of diabetes status. This led to both drugs receiving FDA approval for HFrEF independent of diabetes. These benefits are now considered a class effect. Canagliflozin has renal data (CREDENCE) but less HF-specific data. Ertugliflozin had neutral CV outcomes in VERTIS-CV.",
    s: "Endocrine"
  },
  {
    q: "A 42-year-old female with Graves disease achieved remission on methimazole 18 months ago. TSH is normal. She asks about the likelihood of relapse and monitoring schedule. What should the NP counsel?",
    o: ["Relapse occurs in 50-70% within 1-2 years after methimazole discontinuation; monitor TSH and free T4 every 1-3 months for the first year, then every 6 months", "Cure rate is 95% after 18 months; annual TSH only", "No monitoring needed after successful treatment course", "Lifelong methimazole is required to prevent relapse"],
    a: 0,
    r: "Graves disease remission with thionamide therapy is achieved in only 30-50% of patients, meaning 50-70% relapse, typically within 1-2 years of drug discontinuation. Factors predicting relapse include large goiter, high TRAb levels, male sex, and smoking. Close monitoring with TSH and free T4 every 1-3 months in the first year is essential for early detection. Patients should be counseled about definitive treatment options (RAI or surgery) if relapse occurs.",
    s: "Endocrine"
  },
  {
    q: "A 35-year-old female with asthma presents for preconception counseling. She is currently well-controlled on medium-dose ICS/LABA. She asks if she should stop her asthma medications during pregnancy. What should the NP advise?",
    o: ["Continue current asthma medications; uncontrolled asthma poses greater risk to the fetus than ICS therapy", "Discontinue all inhalers during the first trimester", "Switch to oral theophylline as it is safer in pregnancy", "Use rescue inhaler only during pregnancy"],
    a: 0,
    r: "Asthma medications (particularly ICS and LABA) should be continued during pregnancy. Uncontrolled asthma is associated with preeclampsia, preterm birth, low birth weight, and maternal morbidity -- risks that far exceed any theoretical medication risk. Budesonide is the ICS with the most pregnancy safety data. Step-down therapy during pregnancy risks loss of control. The mantra is: it is safer for a pregnant woman to be treated with asthma medications than to have asthma symptoms and exacerbations.",
    s: "Respiratory"
  },
  {
    q: "A 45-year-old male presents with hemoptysis, hematuria, and bilateral pulmonary infiltrates on CXR. Urinalysis shows RBC casts. Serum creatinine is 3.2 mg/dL (baseline 0.9). Anti-GBM antibodies are positive. What is the diagnosis and emergent treatment?",
    o: ["Goodpasture syndrome (anti-GBM disease); plasmapheresis, high-dose IV corticosteroids, and cyclophosphamide", "Granulomatosis with polyangiitis; rituximab", "IgA nephropathy; ACE inhibitor", "Systemic lupus erythematosus; hydroxychloroquine"],
    a: 0,
    r: "The triad of pulmonary hemorrhage (hemoptysis, bilateral infiltrates), rapidly progressive glomerulonephritis (RBC casts, rising creatinine), and positive anti-GBM antibodies is diagnostic of Goodpasture syndrome (anti-GBM disease). Treatment is aggressive: plasmapheresis removes circulating anti-GBM antibodies, high-dose IV corticosteroids suppress inflammation, and cyclophosphamide prevents antibody re-formation. Treatment urgency is critical as renal damage is often irreversible if GFR falls below 10-15 mL/min.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old female presents with progressive difficulty swallowing, nasal speech, and ptosis that worsens throughout the day. She reports improving with rest. Ice pack test improves the ptosis. What is the most likely diagnosis and confirmatory test?",
    o: ["Myasthenia gravis; order acetylcholine receptor antibodies and consider repetitive nerve stimulation", "Amyotrophic lateral sclerosis; order EMG", "Lambert-Eaton syndrome; order voltage-gated calcium channel antibodies", "Myotonic dystrophy; genetic testing"],
    a: 0,
    r: "Fatigable weakness with diurnal variation (worse with activity, better with rest), bulbar symptoms (dysphagia, dysarthria), ptosis improving with cold application (ice pack test), and a pattern involving ocular and bulbar muscles is classic for myasthenia gravis. Confirmatory testing includes AChR antibodies (positive in 85% of generalized MG) and MuSK antibodies (if AChR negative). Repetitive nerve stimulation shows decremental response. CT chest evaluates for thymoma (10-15% of MG patients).",
    s: "Neurology"
  },
  {
    q: "A 65-year-old male presents with sudden onset of vertigo, dysarthria, dysphagia, Horner syndrome (ipsilateral ptosis, miosis, anhidrosis), and contralateral loss of pain and temperature sensation. What is the most likely diagnosis?",
    o: ["Lateral medullary syndrome (Wallenberg syndrome) from posterior inferior cerebellar artery (PICA) occlusion", "Medial medullary syndrome from anterior spinal artery occlusion", "Bell palsy", "Vestibular neuritis"],
    a: 0,
    r: "Wallenberg syndrome (lateral medullary infarction) results from PICA or vertebral artery occlusion. The classic presentation includes: vertigo/nystagmus (vestibular nuclei), dysphagia/dysarthria/hoarseness (nucleus ambiguus CN IX/X), ipsilateral Horner syndrome (descending sympathetics), ipsilateral facial pain/temperature loss (spinal trigeminal nucleus), contralateral body pain/temperature loss (spinothalamic tract), and ipsilateral cerebellar ataxia. This classic crossed pattern is pathognomonic.",
    s: "Neurology"
  },
  {
    q: "A 40-year-old male presents with severe epigastric pain radiating to the back, nausea, and vomiting. Lipase is 1,240 U/L (normal less than 60). He denies alcohol use. Ultrasound shows no gallstones but a dilated CBD. Triglycerides are normal. What is the next diagnostic step?",
    o: ["MRCP or endoscopic ultrasound (EUS) to evaluate for occult choledocholithiasis, pancreatic mass, or anatomic abnormality", "Repeat abdominal ultrasound in 1 month", "Empiric cholecystectomy", "CT-guided pancreatic biopsy"],
    a: 0,
    r: "Non-alcoholic, non-gallstone pancreatitis with CBD dilation raises concern for occult CBD stone (missed on ultrasound in 10-15%), pancreatic head mass, or anatomic variant (pancreas divisum, ampullary pathology). MRCP is non-invasive and highly sensitive for CBD stones and ductal anatomy. EUS provides the highest resolution for small stones, sludge, and pancreatic masses. Both are appropriate next steps. CT-guided biopsy is premature without first characterizing the pathology.",
    s: "Gastrointestinal"
  },
  {
    q: "A 55-year-old female with primary biliary cholangitis on ursodeoxycholic acid (UDCA) 15 mg/kg/day for 12 months has persistent alkaline phosphatase 2.5 times the upper limit of normal and elevated bilirubin. What does this indicate and what is the next step?",
    o: ["Inadequate UDCA response; consider adding obeticholic acid (OCA) or fibrate therapy and evaluate for liver transplant candidacy", "Increase UDCA to 30 mg/kg/day", "Switch to corticosteroids", "Discontinue UDCA as it is ineffective"],
    a: 0,
    r: "PBC patients who do not achieve biochemical response to UDCA (Paris II criteria: ALP and AST less than 1.5 times ULN with normal bilirubin after 1 year) have worse prognosis. Second-line options include obeticholic acid (FXR agonist, FDA-approved for PBC with inadequate UDCA response) or bezafibrate/fenofibrate (off-label, supported by BEZURSO trial). Transplant evaluation should be considered for progressive disease. UDCA dose above 15 mg/kg is not more effective.",
    s: "Gastrointestinal"
  }
];
