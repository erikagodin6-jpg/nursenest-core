import type { ExamQuestion } from "./types";

export const npExamBatch40Questions: ExamQuestion[] = [
  {
    q: "A 30-year-old female with no smoking history presents with recurrent spontaneous pneumothoraces and cystic lung disease on CT. She also has multiple skin-colored papules on her face and a history of renal angiomyolipoma. What is the underlying diagnosis?",
    o: ["Tuberous sclerosis complex with lymphangioleiomyomatosis (LAM)", "Alpha-1 antitrypsin deficiency", "Langerhans cell histiocytosis", "Primary spontaneous pneumothorax from blebs"],
    a: 0,
    r: "The triad of cystic lung disease (LAM), facial angiofibromas (skin-colored papules), and renal angiomyolipoma is characteristic of tuberous sclerosis complex (TSC), an autosomal dominant genetic disorder affecting TSC1 or TSC2 genes. LAM affects almost exclusively women and causes progressive cystic lung destruction with recurrent pneumothoraces. Sirolimus (mTOR inhibitor) has demonstrated efficacy in stabilizing lung function in LAM. LAM can also occur sporadically without TSC. VEGF-D serum level is a diagnostic biomarker.",
    s: "Respiratory"
  },
  {
    q: "A 55-year-old male with severe COPD on home oxygen at 2 L/min is planning a flight from New York to Los Angeles. His resting SpO2 on room air is 89% and PaO2 is 68 mmHg. What advice should the NP provide regarding air travel?",
    o: ["Increase supplemental oxygen flow rate during flight; commercial aircraft cabin pressure equivalent to 6,000-8,000 feet altitude can reduce PaO2 by 25 mmHg; contact the airline for in-flight oxygen arrangements", "No adjustments needed; cabin pressure is fully pressurized", "Absolute contraindication to flying with supplemental oxygen", "Supplemental oxygen is not permitted on commercial aircraft"],
    a: 0,
    r: "Commercial aircraft cabins are pressurized to the equivalent of 6,000-8,000 feet altitude, reducing inspired oxygen pressure by approximately 25%. For COPD patients on supplemental O2, this can cause significant hypoxemia. Recommendations: increase flow rate by 1-2 L/min during flight, arrange in-flight supplemental oxygen with the airline (48-72 hours advance notice required), consider pre-flight hypoxic altitude simulation test (HAST) if borderline, and carry a physician letter documenting oxygen requirements and equipment needs.",
    s: "Respiratory"
  },
  {
    q: "A 60-year-old non-smoking female presents with a solitary pulmonary nodule found incidentally on CT. The nodule is 8 mm, solid, with no calcification. She has no cancer history. What should the NP recommend based on Fleischner Society guidelines?",
    o: ["Follow-up CT at 6-12 months, then at 18-24 months if stable; PET scan may be considered for characterization", "Immediate surgical resection", "No follow-up imaging needed for solid nodules less than 8 mm", "Annual CXR for 5 years"],
    a: 0,
    r: "Fleischner Society 2017 guidelines for incidental solid pulmonary nodules: For 6-8 mm solid nodules in low-risk patients (non-smokers), CT follow-up at 6-12 months is recommended, with optional follow-up at 18-24 months. If the nodule grows, biopsy or resection is indicated. If stable for 2 years, no further imaging is needed (benign). PET-CT has limited sensitivity for nodules less than 10 mm. Factors favoring malignancy: spiculated margins, upper lobe location, growth, FDG avidity. Ground-glass nodules have different follow-up protocols.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old male presents with progressive memory loss, personality changes, and myoclonus over 6 months. MRI shows cortical ribboning and DWI hyperintensity in the caudate and putamen. EEG shows periodic sharp wave complexes. 14-3-3 protein is elevated in CSF. What is the diagnosis?",
    o: ["Creutzfeldt-Jakob disease (CJD); rapidly progressive dementia with characteristic MRI, EEG, and CSF findings", "Alzheimer disease; start cholinesterase inhibitor", "Frontotemporal dementia; behavioral variant", "Lewy body dementia; start carbidopa-levodopa"],
    a: 0,
    r: "Rapidly progressive dementia over weeks to months with myoclonus, MRI cortical ribboning and basal ganglia DWI/FLAIR hyperintensity, periodic sharp wave complexes on EEG, and elevated 14-3-3 protein in CSF is classic for sporadic CJD. CJD is a prion disease (misfolded PrPSc protein) that is universally fatal (median survival 5-6 months). Diagnostic criteria include progressive dementia plus 2 of: myoclonus, pyramidal/extrapyramidal signs, visual/cerebellar signs, akinetic mutism. RT-QuIC assay in CSF has greater than 95% sensitivity and specificity.",
    s: "Neurology"
  },
  {
    q: "A 25-year-old female presents with daily headaches that started 3 months ago. She takes ibuprofen 800 mg 4-5 times daily. The headaches are diffuse, moderate severity, and present upon awakening. She has a history of episodic migraine. What is the most likely cause of her daily headaches?",
    o: ["Medication overuse headache (analgesic rebound); the treatment is withdrawal of the overused analgesic with a bridging strategy", "Chronic migraine requiring higher analgesic doses", "Tension-type headache requiring muscle relaxants", "Pseudotumor cerebri requiring lumbar puncture"],
    a: 0,
    r: "Medication overuse headache (MOH) develops when acute headache medications are used 15 or more days/month for 3 or more months. NSAIDs used 15+ days/month or triptans/combination analgesics used 10+ days/month can cause MOH. Treatment requires withdrawal of the overused medication (headaches typically worsen for 1-2 weeks before improving), with a bridging strategy (naproxen, prednisone taper, or nerve block). Preventive migraine therapy should be initiated simultaneously. CGRP monoclonal antibodies (erenumab, fremanezumab) are effective for MOH without requiring analgesic withdrawal first.",
    s: "Neurology"
  },
  {
    q: "A 60-year-old female with a history of falls presents with bilateral hand weakness, difficulty with fine motor tasks, and Lhermitte sign (electric shock sensation down the spine with neck flexion). MRI cervical spine shows multilevel cervical spondylosis with cord compression and T2 hyperintensity within the cord. What does the T2 hyperintensity represent?",
    o: ["Myelopathy (spinal cord injury/edema) from chronic compression; this is an indication for surgical decompression", "Normal aging finding; no intervention needed", "Multiple sclerosis plaque; start disease-modifying therapy", "Disc herniation only; conservative management"],
    a: 0,
    r: "T2 hyperintensity within the cervical spinal cord in the setting of cervical spondylotic stenosis represents myelopathy (cord edema, gliosis, or demyelination from chronic compression). This is a surgical indication because myelopathy typically progresses without decompression. Lhermitte sign (also seen in MS) indicates posterior column involvement. Surgical options include anterior cervical discectomy and fusion (ACDF) for 1-2 levels or posterior laminoplasty for multilevel disease. Outcomes are better with earlier intervention before significant cord damage occurs.",
    s: "Neurology"
  },
  {
    q: "A 35-year-old male presents with intermittent right upper quadrant pain after fatty meals. Murphy sign is positive. Ultrasound shows multiple gallstones with gallbladder wall thickening to 5 mm. WBC is 14,000 and temperature is 38.2 C. What is the most likely diagnosis and definitive treatment?",
    o: ["Acute cholecystitis; laparoscopic cholecystectomy within 72 hours of presentation", "Biliary colic; elective cholecystectomy", "Choledocholithiasis; ERCP with stone extraction", "Cholangitis; emergent biliary drainage"],
    a: 0,
    r: "Positive Murphy sign (inspiratory arrest during RUQ palpation), gallstones, gallbladder wall thickening (greater than 3 mm), fever, and leukocytosis meet Tokyo Guidelines criteria for acute cholecystitis. Definitive treatment is laparoscopic cholecystectomy, ideally within 72 hours of presentation (early cholecystectomy reduces total hospital stay and complications compared to delayed surgery). IV antibiotics (covering gram-negatives and anaerobes) are initiated preoperatively. Uncomplicated biliary colic would not have fever, leukocytosis, or wall thickening.",
    s: "Gastrointestinal"
  },
  {
    q: "A 70-year-old male with new-onset painless jaundice, dark urine, clay-colored stools, and weight loss presents for evaluation. CA 19-9 is markedly elevated. CT shows a 3 cm pancreatic head mass with biliary and pancreatic duct dilation (double duct sign). What is the most likely diagnosis?",
    o: ["Pancreatic adenocarcinoma; staging workup and surgical oncology referral for potential Whipple procedure", "Chronic pancreatitis with pseudocyst", "Choledocholithiasis; ERCP", "Cholangiocarcinoma; palliative stenting only"],
    a: 0,
    r: "Painless jaundice in an elderly patient with a pancreatic head mass, elevated CA 19-9, and double duct sign (simultaneous dilation of CBD and pancreatic duct) is classic for pancreatic adenocarcinoma until proven otherwise. Workup includes staging CT with pancreas protocol, CA 19-9 (elevated in 80%, useful for monitoring treatment response), and EUS with FNA for tissue diagnosis. Surgical resection (pancreaticoduodenectomy/Whipple procedure) offers the only potential cure but only 15-20% of patients have resectable disease at diagnosis. 5-year survival is 10-20% with surgery.",
    s: "Gastrointestinal"
  },
  {
    q: "A 45-year-old female with celiac disease on a strict gluten-free diet for 2 years continues to have symptoms (bloating, diarrhea, weight loss). tTG-IgA remains elevated at 45 U/mL. What should the NP investigate?",
    o: ["Unintentional gluten exposure from hidden sources (medications, processed foods, cross-contamination); referral to a celiac-specialist dietitian", "Switch to a dairy-free diet", "Start systemic corticosteroids", "Diagnose refractory celiac disease immediately"],
    a: 0,
    r: "Persistent symptoms and elevated tTG-IgA in celiac disease despite a 'strict' gluten-free diet is most commonly due to unintentional gluten exposure (70-90% of cases). Hidden sources include: medications/supplements (gluten-containing excipients), processed foods (soy sauce, modified food starch, malt flavoring), restaurant meals, cross-contamination during food preparation, and communion wafers. Referral to a celiac-specialist dietitian for detailed dietary review is the first step. Refractory celiac disease (true non-response to GFD) is rare and requires duodenal biopsy with immunophenotyping to diagnose.",
    s: "Gastrointestinal"
  },
  {
    q: "A 35-year-old female presents with severe flank pain radiating to the groin. CT KUB shows a 7 mm obstructing ureteral stone at the ureterovesical junction. She has no fever and normal WBC. Creatinine is normal. What is the initial management?",
    o: ["Pain management with ketorolac and opioids as needed, alpha-blocker (tamsulosin) as medical expulsive therapy, and follow-up imaging in 2-4 weeks", "Emergent surgical intervention", "Observation without pain management", "Lithotripsy immediately"],
    a: 0,
    r: "Uncomplicated ureteral stones less than 10 mm without infection or renal failure can be managed with medical expulsive therapy (MET). Tamsulosin (alpha-1 blocker) relaxes ureteral smooth muscle, facilitating stone passage (NNT approximately 4 for stones 5-10 mm). Pain management with NSAIDs (ketorolac is first-line, superior to opioids for renal colic) plus opioids for breakthrough. Stones at the UVJ have the highest spontaneous passage rate. Follow-up imaging in 2-4 weeks confirms passage. Indications for intervention: infection, bilateral obstruction, renal failure, or intractable symptoms.",
    s: "Renal"
  }
];
