import type { ExamQuestion } from "./types";

export const npExamBatch31Questions: ExamQuestion[] = [
  {
    q: "A 40-year-old female presents with a 1 cm thyroid nodule, suppressed TSH of 0.1 mIU/L, and normal free T4. Radioiodine uptake scan shows a focal hot nodule with suppression of the surrounding gland. What is the diagnosis and management?",
    o: ["Toxic adenoma (autonomous functioning thyroid nodule); treatment options include radioactive iodine ablation or surgery", "Thyroid cancer requiring total thyroidectomy", "Graves disease; start methimazole", "Non-toxic goiter; observation only"],
    a: 0,
    r: "A focal hot nodule on radioiodine uptake scan with surrounding gland suppression in the setting of suppressed TSH is diagnostic of a toxic (functioning) adenoma. This benign condition causes subclinical or overt hyperthyroidism through autonomous thyroid hormone production. Treatment options are RAI ablation (preferred for nodules less than 4 cm) or surgical lobectomy. FNA is generally not needed for hot nodules as they have a very low malignancy risk (less than 1%). Graves disease shows diffuse uptake.",
    s: "Endocrine"
  },
  {
    q: "A 70-year-old male with a 60-pack-year smoking history has FEV1 of 30% predicted (GOLD stage 4). He is on maximal inhaled therapy and has been hospitalized 3 times in the past year for COPD exacerbations. His PaCO2 is chronically elevated at 52 mmHg. What additional interventions should the NP consider?",
    o: ["Pulmonary rehabilitation, long-term oxygen therapy if hypoxemic, lung volume reduction evaluation, and transplant evaluation", "Increase ICS dose further", "Start oral theophylline at maximum dose", "Prescribe continuous nebulized bronchodilators at home"],
    a: 0,
    r: "Very severe COPD (GOLD 4) with frequent exacerbations despite maximal medical therapy warrants: pulmonary rehabilitation (improves exercise capacity, reduces hospitalizations), LTOT if qualifying hypoxemia (PaO2 55 mmHg or less, or 60 or less with cor pulmonale), lung volume reduction surgery evaluation (for upper-lobe-predominant emphysema), and lung transplant evaluation for progressive disease. Noninvasive ventilation may benefit patients with chronic hypercapnia. Further increasing ICS adds minimal benefit with increased pneumonia risk.",
    s: "Respiratory"
  },
  {
    q: "A 25-year-old male presents with a spontaneous pneumothorax. CXR shows 35% collapse of the right lung. He is hemodynamically stable with SpO2 95%. He denies dyspnea at rest but has mild discomfort. What is the recommended initial management?",
    o: ["Chest tube insertion (small-bore pigtail catheter or traditional tube thoracostomy) with water seal", "Observation with supplemental oxygen and repeat CXR in 6 hours", "Needle aspiration as definitive treatment", "Immediate VATS with pleurodesis"],
    a: 0,
    r: "Primary spontaneous pneumothorax with greater than 15-20% collapse (some guidelines use 2-3 cm apex-to-cupola distance) or symptomatic patients warrants intervention. Options include needle aspiration (attempt at initial management per BTS guidelines) or small-bore chest tube (American approach). For 35% collapse with symptoms, chest tube drainage is appropriate. Observation alone is for small (less than 15%), asymptomatic pneumothoraces. VATS is reserved for recurrent pneumothorax or persistent air leak.",
    s: "Respiratory"
  },
  {
    q: "A 40-year-old female with severe persistent asthma on high-dose ICS/LABA, tiotropium, and montelukast has eosinophil count of 500 cells/mcL and total IgE of 450 IU/mL. She has frequent exacerbations. Which biologic therapy is most appropriate?",
    o: ["Dupilumab (anti-IL-4/IL-13) as it addresses both the eosinophilic and IgE-mediated pathways", "Omalizumab alone based on the elevated IgE", "Benralizumab alone targeting eosinophils", "Tezepelumab as first choice"],
    a: 0,
    r: "Dupilumab (anti-IL-4R alpha, blocking both IL-4 and IL-13) is effective for severe eosinophilic asthma with or without elevated IgE. It reduces exacerbations, improves FEV1, and decreases oral steroid dependence. For patients with both elevated eosinophils AND elevated IgE, dupilumab addresses both type 2 inflammatory pathways. Omalizumab targets IgE only. Benralizumab/mepolizumab target eosinophils only. Tezepelumab (anti-TSLP) is a newer option for severe asthma regardless of biomarker status.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old female with relapsing-remitting MS on dimethyl fumarate presents with an absolute lymphocyte count of 500/mcL (normal greater than 1,000) on routine monitoring. She has no active symptoms. What should the NP do?",
    o: ["Hold dimethyl fumarate and monitor CBC; if lymphopenia persists below 500 for 6 months, discontinue permanently and switch to an alternative DMT due to PML risk", "Continue current therapy and recheck in 1 year", "Increase dimethyl fumarate dose", "Add a second DMT to compensate"],
    a: 0,
    r: "Dimethyl fumarate can cause lymphopenia, which increases the risk of progressive multifocal leukoencephalopathy (PML) when lymphocyte count falls below 500/mcL. Guidelines recommend: check CBC every 6 months, hold DMF if ALC falls below 500, and discontinue if ALC remains below 500 for 6 months. Switch to a DMT with a different mechanism (natalizumab with JCV monitoring, ocrelizumab, or fingolimod depending on risk profile). PML is a fatal opportunistic brain infection caused by JC virus.",
    s: "Neurology"
  },
  {
    q: "A 55-year-old male presents with a 6-month history of progressive bilateral hand clumsiness, gait unsteadiness, and urinary urgency. Examination shows upper motor neuron signs in the legs (hyperreflexia, positive Babinski) and lower motor neuron signs in the hands (atrophy, fasciculations). MRI cervical spine shows severe multilevel stenosis with cord signal change. What is the diagnosis?",
    o: ["Cervical spondylotic myelopathy; urgent surgical referral for decompression", "ALS requiring riluzole", "Normal pressure hydrocephalus requiring VP shunt", "Vitamin B12 deficiency; check methylmalonic acid"],
    a: 0,
    r: "Progressive myelopathy with combined UMN signs in legs and LMN signs in hands in the setting of severe cervical stenosis with cord signal change on MRI is cervical spondylotic myelopathy. The LMN hand findings result from compression of anterior horn cells at the stenotic level, while UMN leg findings result from cord compression above the lumbar enlargement. Surgical decompression is indicated for progressive neurological deficit. Delay risks irreversible cord damage. ALS lacks MRI structural abnormality.",
    s: "Neurology"
  },
  {
    q: "A 60-year-old female presents with acute onset of left-sided facial droop, arm drift, and speech difficulty. Time of onset is unknown (woke up with symptoms, last seen normal 10 hours ago). CT head is negative for hemorrhage. What is the appropriate next step?",
    o: ["Obtain MRI with diffusion-weighted imaging and perfusion imaging to evaluate for DWI-FLAIR mismatch, which may extend the thrombolysis or thrombectomy window", "Standard IV alteplase within the 4.5-hour window", "Aspirin 325 mg and observation", "Discharge with neurology follow-up in 1 week"],
    a: 0,
    r: "Wake-up strokes with unknown time of onset may benefit from reperfusion therapy using advanced imaging. The WAKE-UP trial showed that IV alteplase is effective in patients with DWI-FLAIR mismatch (positive DWI but negative FLAIR suggests the infarct is less than 4.5 hours old despite unknown clinical onset). Additionally, the DAWN and DEFUSE-3 trials extended the mechanical thrombectomy window to 24 hours using perfusion imaging to identify salvageable tissue. Advanced imaging revolutionized stroke management beyond the traditional time-based windows.",
    s: "Neurology"
  },
  {
    q: "A 50-year-old male with NASH cirrhosis has a MELD-Na score of 18. He asks about liver transplant evaluation. What are the general listing criteria?",
    o: ["MELD-Na score 15 or greater, or complications of cirrhosis (refractory ascites, hepatic encephalopathy, variceal bleeding) that significantly impair quality of life", "MELD-Na must be 25 or greater", "Only patients with hepatocellular carcinoma qualify", "Transplant is only considered after all complications have resolved"],
    a: 0,
    r: "Liver transplant evaluation is generally recommended when MELD-Na reaches 15 or greater, as this is the threshold where transplant survival exceeds waitlist survival. Complications of cirrhosis (refractory ascites, recurrent encephalopathy, variceal bleeding, HCC within Milan criteria) are also indications regardless of MELD score. NASH is now the leading indication for liver transplant in the US. Patients must demonstrate 6 months of alcohol abstinence if alcohol is a contributing factor.",
    s: "Gastrointestinal"
  },
  {
    q: "A 35-year-old female presents with odynophagia and dysphagia. She is HIV-positive with a CD4 count of 80. Endoscopy shows multiple well-circumscribed shallow ulcers in the esophagus. Biopsy shows multinucleated giant cells with ground-glass nuclear inclusions. What is the diagnosis and treatment?",
    o: ["Herpes simplex virus esophagitis; IV acyclovir or oral valacyclovir", "Candida esophagitis; fluconazole", "CMV esophagitis; IV ganciclovir", "Pill esophagitis; discontinue offending medication"],
    a: 0,
    r: "In an immunocompromised patient (CD4 less than 100), well-circumscribed shallow esophageal ulcers with multinucleated giant cells and ground-glass nuclear inclusions (Cowdry type B) on biopsy are diagnostic of HSV esophagitis. Treatment is IV acyclovir (immunocompromised) or oral valacyclovir. CMV esophagitis shows large deep ulcers with cytoplasmic and nuclear inclusions (owl's eye). Candida shows white plaques and pseudohyphae. ART optimization is essential for long-term immunity.",
    s: "Gastrointestinal"
  },
  {
    q: "A 65-year-old male with type 2 diabetes presents with chronic nausea, early satiety, postprandial bloating, and vomiting of undigested food several hours after eating. Upper endoscopy is normal. Gastric emptying study shows 60% retention at 4 hours (normal less than 10%). What is the diagnosis and management?",
    o: ["Gastroparesis; dietary modifications (small frequent low-fat low-fiber meals), prokinetic therapy (metoclopramide with monitoring for tardive dyskinesia), and glycemic optimization", "GERD; increase PPI dose", "Peptic ulcer disease; test for H. pylori", "Functional dyspepsia; prescribe amitriptyline"],
    a: 0,
    r: "Delayed gastric emptying (greater than 10% retention at 4 hours) with compatible symptoms and no mechanical obstruction on endoscopy confirms gastroparesis. Diabetic gastroparesis results from vagal autonomic neuropathy. Management includes: dietary modification (small, frequent, low-fat, low-fiber meals -- fiber forms bezoars), prokinetics (metoclopramide is the only FDA-approved prokinetic; limit to 12 weeks due to tardive dyskinesia risk), and tight glycemic control (hyperglycemia itself delays gastric emptying). Gastric electrical stimulation is for refractory cases.",
    s: "Gastrointestinal"
  }
];
