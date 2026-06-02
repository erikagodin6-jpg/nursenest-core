import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

export const npExamBatch41Questions: ExamQuestion[] = [
  {
    q: "A 50-year-old male with autosomal dominant polycystic kidney disease (ADPKD) presents with hypertension, bilateral flank fullness, and eGFR 55. His total kidney volume is 1,500 mL. What targeted therapy can slow disease progression?",
    o: ["Tolvaptan (vasopressin V2 receptor antagonist), FDA-approved to slow eGFR decline in ADPKD at risk for rapid progression", "ACE inhibitor as the sole disease-modifying therapy", "Sirolimus for cyst reduction", "Bilateral nephrectomy to prevent complications"],
    a: 0,
    r: "Tolvaptan is FDA-approved for ADPKD based on the TEMPO 3:4 and REPRISE trials, which demonstrated slowed kidney growth and eGFR decline. It works by blocking vasopressin V2 receptors in collecting duct cells, reducing cAMP-mediated cyst growth. Patient selection: rapidly progressing ADPKD (estimated by total kidney volume using the Mayo ADPKD classification). Side effects include aquaretic effects (polyuria, thirst, nocturia) and hepatotoxicity (requires monthly liver function monitoring for 18 months). ACE inhibitors are important but not sufficient as monotherapy.",
    s: "Renal"
  },
  {
    q: "A 25-year-old female presents with gross hematuria, flank pain, and proteinuria. She has a family history of renal failure -- her father is on dialysis and her uncle had kidney failure by age 40. Ultrasound shows bilateral enlarged kidneys with multiple cysts. Genetic testing reveals a PKD1 mutation. At what age should her children be screened?",
    o: ["Screening of at-risk family members is recommended; presymptomatic genetic testing can be offered at age 18 or earlier if clinically indicated; imaging screening starting at age 15-18", "No screening until symptoms develop", "Screen at age 40 when disease typically manifests", "Genetic testing is not available for ADPKD"],
    a: 0,
    r: "ADPKD follows autosomal dominant inheritance (50% chance of transmission). PKD1 mutations (85% of cases) tend to have earlier onset and more severe disease than PKD2. Screening at-risk family members: ultrasound screening can be offered at age 15-18 (sensitivity increases with age). Genetic testing provides definitive diagnosis and is increasingly available. Screening allows early BP management (hypertension often precedes CKD), counseling, and reproductive planning. The Ravine ultrasound criteria define age-specific diagnostic thresholds for PKD1-linked families.",
    s: "Renal"
  },
  {
    q: "A 35-year-old female presents with recurrent episodes of binge eating (consuming large quantities rapidly with loss of control) followed by self-induced vomiting. She binges and purges 3-4 times weekly. She has dental erosion and parotid gland enlargement. BMI is 22. What is the diagnosis and first-line treatment?",
    o: ["Bulimia nervosa; first-line treatment is CBT (cognitive behavioral therapy) and fluoxetine (only FDA-approved medication for bulimia)", "Anorexia nervosa; nutritional rehabilitation", "Binge eating disorder; lisdexamfetamine", "ARFID; behavioral feeding therapy"],
    a: 0,
    r: "Bulimia nervosa is characterized by recurrent binge eating followed by compensatory behaviors (purging, laxative use, excessive exercise) at least once weekly for 3 months. Unlike anorexia, BMI is typically normal or above. Physical findings include dental erosion (perimolysis from gastric acid), parotid hypertrophy, Russell sign (knuckle calluses), metabolic alkalosis, and hypokalemia. First-line treatment: CBT-Enhanced (CBT-E) is the gold standard. Fluoxetine 60 mg/day (higher than typical antidepressant dose) is the only FDA-approved medication. TCAs and bupropion are contraindicated (seizure risk).",
    s: "Psychiatry"
  },
  {
    q: "A 45-year-old male with chronic PTSD from military combat presents with nightmares disrupting his sleep 5-6 nights per week, hypervigilance, emotional numbing, and avoidance of fireworks and loud noises. He has not responded to sertraline 200 mg. What is the pharmacological approach for his nightmares?",
    o: ["Prazosin (alpha-1 adrenergic antagonist) at bedtime for PTSD-related nightmares", "Benzodiazepine at bedtime for sleep", "Increase sertraline beyond 200 mg", "Add haloperidol for hypervigilance"],
    a: 0,
    r: "Prazosin is the most evidence-supported medication for PTSD-related nightmares. It blocks alpha-1 adrenergic receptors in the brain, reducing noradrenergic hyperactivity that drives trauma-related nightmares during REM sleep. Starting dose is 1 mg at bedtime, titrated up to 6-15 mg based on response. Monitor for orthostatic hypotension, especially with dose increases. The VA/DoD Clinical Practice Guideline recommends prazosin for trauma nightmares. Benzodiazepines may worsen PTSD outcomes and are NOT recommended. First-line PTSD pharmacotherapy includes SSRIs (sertraline, paroxetine) and SNRIs (venlafaxine).",
    s: "Psychiatry"
  },
  {
    q: "A 70-year-old female with Parkinson disease develops visual hallucinations (seeing children playing in her room) and paranoid ideation. She is on carbidopa-levodopa. Her MMSE is 22/30. What antipsychotic can be used safely in Parkinson disease?",
    o: ["Pimavanserin (selective 5-HT2A inverse agonist, FDA-approved for Parkinson disease psychosis) or quetiapine at low doses", "Haloperidol at standard antipsychotic doses", "Risperidone for its dual receptor blocking", "Olanzapine for its sedating properties"],
    a: 0,
    r: "Parkinson disease psychosis requires special consideration because most antipsychotics block dopamine D2 receptors, worsening motor symptoms. Pimavanserin is the only FDA-approved medication for PD psychosis -- it selectively targets 5-HT2A receptors without D2 blockade, preserving motor function. Quetiapine (low D2 affinity at low doses) is the most commonly used off-label alternative. Clozapine is highly effective but requires WBC monitoring (agranulocytosis risk). Haloperidol, risperidone, and olanzapine are contraindicated in PD due to significant dopamine blockade worsening parkinsonism.",
    s: "Psychiatry"
  },
  {
    q: "A 25-year-old female presents with a new 8 mm asymmetric, irregularly bordered, multi-colored (brown, black, red) flat lesion on her calf that was not present 6 months ago. What is the appropriate management?",
    o: ["Urgent excisional biopsy with narrow margins to evaluate for melanoma; do NOT shave biopsy a lesion suspicious for melanoma", "Observe and photograph for comparison in 6 months", "Shave biopsy for cosmetic removal", "Cryotherapy with liquid nitrogen"],
    a: 0,
    r: "This lesion meets ABCDE criteria for melanoma: Asymmetry, Border irregularity, Color variation, Diameter greater than 6 mm, and Evolution (new lesion). Management: excisional biopsy with 1-2 mm clinical margins for histological evaluation is mandatory. Shave biopsy is inappropriate for suspected melanoma because it may not capture the full depth (Breslow depth is the single most important prognostic factor and determines re-excision margins and sentinel lymph node biopsy indication). Cryotherapy destroys tissue, preventing histological evaluation. Early detection is critical -- 5-year survival for stage I melanoma exceeds 95%.",
    s: "Dermatology"
  },
  {
    q: "A 40-year-old male with HIV (CD4 200) presents with violaceous plaques on his skin, oral cavity, and lower extremities. Biopsy shows spindle cells with vascular channels and HHV-8 positivity. What is the diagnosis?",
    o: ["Kaposi sarcoma associated with HHV-8 infection; optimize antiretroviral therapy as first-line treatment", "Squamous cell carcinoma; wide excision", "Psoriasis; topical corticosteroids", "Bacillary angiomatosis; doxycycline"],
    a: 0,
    r: "Violaceous (purple) mucocutaneous plaques in an immunocompromised patient (HIV/AIDS) with HHV-8 (human herpesvirus 8) positive biopsy showing spindle cells with slit-like vascular spaces is diagnostic of Kaposi sarcoma. KS is an AIDS-defining illness. First-line treatment is ART optimization (immune reconstitution often leads to KS regression). For extensive or visceral KS, systemic chemotherapy (liposomal doxorubicin) is added. Bacillary angiomatosis (Bartonella) can mimic KS clinically but shows different histology and responds to antibiotics.",
    s: "Dermatology",
    image: getAssetUrl("kaposisarcoma_1773517523349.png")
  },
  {
    q: "A 55-year-old postmenopausal female with an intact uterus presents with bothersome hot flashes, night sweats, and vaginal dryness significantly affecting her quality of life. She has no contraindications to hormone therapy. What HRT regimen should the NP prescribe?",
    o: ["Combined estrogen plus progestogen therapy (continuous combined or cyclic) to protect the endometrium from unopposed estrogen stimulation", "Estrogen-only therapy without progestogen", "Testosterone replacement therapy", "High-dose progesterone only"],
    a: 0,
    r: "Women with an intact uterus MUST receive progestogen with estrogen to prevent endometrial hyperplasia and cancer (unopposed estrogen increases endometrial cancer risk 5-10 fold). Options: continuous combined (daily estrogen plus progestogen -- eliminates withdrawal bleeding) or cyclic (estrogen daily plus progestogen 12-14 days/month -- causes predictable withdrawal bleeding). Preferred in first 10 years postmenopause or under age 60 (timing hypothesis). Transdermal estradiol has the lowest VTE risk. Women without a uterus can receive estrogen-only therapy.",
    s: "Women's Health"
  },
  {
    q: "A 28-year-old female presents requesting emergency contraception. She had unprotected intercourse 4 days ago. Her BMI is 32. What is the most effective option at this timepoint?",
    o: ["Copper IUD insertion (effective up to 5 days post-intercourse and most effective EC method regardless of BMI)", "Levonorgestrel 1.5 mg (Plan B)", "Combined oral contraceptive pills (Yuzpe method)", "Mifepristone 200 mg"],
    a: 0,
    r: "The copper IUD is the most effective emergency contraceptive method (99.9% effectiveness), effective up to 5 days (120 hours) after unprotected intercourse, and its efficacy is NOT affected by BMI. Levonorgestrel (Plan B) has reduced efficacy in women with BMI greater than 26 and is most effective within 72 hours. Ulipristal (ella) is effective up to 5 days and less affected by BMI than levonorgestrel, but still less effective than copper IUD. Additional benefit: the copper IUD provides ongoing contraception for up to 10-12 years.",
    s: "Women's Health"
  },
  {
    q: "An 82-year-old male with moderate Alzheimer dementia, diabetes, hypertension, and chronic pain is on 14 medications. His daughter reports confusion worsening over the past month. What should the NP prioritize?",
    o: ["Comprehensive medication review to deprescribe inappropriate medications using tools like Beers Criteria and STOPP/START; polypharmacy is a leading cause of iatrogenic confusion in the elderly", "Add donepezil for presumed Alzheimer progression", "Order CT head for new intracranial pathology", "Increase pain medications for possible undertreated pain"],
    a: 0,
    r: "Polypharmacy (5 or more medications, especially 10 or more) in elderly patients is a major cause of adverse drug reactions, falls, confusion, and hospitalization. Before attributing worsening cognition to dementia progression, medications must be reviewed as a cause. Common offenders: anticholinergics (diphenhydramine, oxybutynin), benzodiazepines, opioids, centrally-acting antihypertensives, and medications with drug-drug interactions. The Beers Criteria identifies potentially inappropriate medications for older adults. Deprescribing (systematic medication reduction) can dramatically improve cognitive function, reduce falls, and improve quality of life.",
    s: "Geriatrics"
  }
];
