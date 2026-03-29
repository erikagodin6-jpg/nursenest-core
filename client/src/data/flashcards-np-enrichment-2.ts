import type { FlashcardData } from "./flashcards-rpn";

export const npFlashcardsEnrichment2: FlashcardData[] = [
  // ============================================================
  // PRIMARY CARE - ADULT/FAMILY (35 cards)
  // ============================================================
  {
    id: "np-pc-e1", type: "question",
    question: "A 52-year-old patient has a blood pressure of 142/88 on two separate visits. What is the classification and initial management per ACC/AHA 2017 guidelines?",
    options: ["Normal blood pressure", "Stage 2 hypertension; initiate two antihypertensive agents from different classes plus lifestyle modifications", "Prehypertension; lifestyle only", "Hypertensive emergency"],
    correctIndex: 1,
    answer: "ACC/AHA 2017: Stage 2 HTN is >=140/90. Treatment: initiate two first-line agents from different classes (ACEi/ARB + CCB or thiazide). Target <130/80 for most adults. SPRINT trial demonstrated benefit of intensive BP control. Lifestyle: DASH diet, sodium <2300 mg/day, 150 min/week exercise, weight loss, alcohol moderation.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e2", type: "question",
    question: "A patient with type 2 diabetes has an HbA1c of 8.5% on metformin 2000 mg daily. They have established ASCVD and BMI 36. What should be added?",
    options: ["Glipizide (sulfonylurea)", "GLP-1 receptor agonist (semaglutide) for cardiovascular benefit, glycemic control, and weight loss", "Pioglitazone", "Insulin as next step"],
    correctIndex: 1,
    answer: "ADA/EASD consensus: for T2D with ASCVD, add GLP-1 RA or SGLT2i regardless of HbA1c. Semaglutide provides: HbA1c reduction 1.0-1.8%, cardiovascular MACE reduction (SUSTAIN-6, SELECT), and 5-15% weight loss. Sulfonylureas cause weight gain and hypoglycemia. Pioglitazone causes fluid retention.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e3", type: "question",
    question: "A 60-year-old with LDL 145 mg/dL has a 10-year ASCVD risk of 12%. What statin intensity is recommended?",
    options: ["No statin needed", "Moderate-to-high intensity statin therapy; for 10-year risk >=7.5%, statin is recommended with shared decision-making", "Low-dose statin only", "Statin only if LDL >200"],
    correctIndex: 1,
    answer: "ACC/AHA lipid guidelines: 10-year ASCVD risk >=7.5% (intermediate risk) is a statin indication with shared decision-making. Risk enhancers (family history, CRP >=2, ABI <0.9, CAC >0) favor treatment. High-intensity statin (atorvastatin 40-80 mg or rosuvastatin 20-40 mg) for established ASCVD or LDL >=190. Target: 50% LDL reduction.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e4", type: "question",
    question: "A patient presents with BMI 38 and failed lifestyle modifications. What pharmacologic options does the NP have for obesity management?",
    options: ["Only lifestyle changes are available", "FDA-approved: semaglutide 2.4 mg/week, liraglutide 3.0 mg/day, phentermine-topiramate, naltrexone-bupropion, orlistat. Semaglutide has highest weight loss (15-17%)", "Amphetamines", "Only surgical referral"],
    correctIndex: 1,
    answer: "FDA-approved obesity medications (BMI >=30, or >=27 with comorbidity): SEMAGLUTIDE 2.4 mg SC weekly (STEP trials: 15-17% weight loss), LIRAGLUTIDE 3.0 mg SC daily (5-8%), PHENTERMINE-TOPIRAMATE ER (7-10%, CV risk concerns), NALTREXONE-BUPROPION (5-6%, avoid with seizures/opioids), ORLISTAT (3-5%, GI side effects). Bariatric surgery referral for BMI >=40 or >=35 with comorbidities.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e5", type: "question",
    question: "A 45-year-old presents with episodic heartburn 3x/week for 6 months. No alarm symptoms. What is the initial management?",
    options: ["Immediate EGD", "Trial of PPI therapy (omeprazole 20 mg daily for 8 weeks) plus lifestyle modifications; refer for EGD if no response or alarm symptoms", "Lifelong H2 blocker", "Barium swallow first"],
    correctIndex: 1,
    answer: "Uncomplicated GERD without alarm symptoms (dysphagia, weight loss, GI bleeding, age >60 with new symptoms): empiric PPI trial for 8 weeks is first-line. Lifestyle: elevate HOB, avoid eating 3 hours before bed, reduce triggers (caffeine, alcohol, spicy foods, acidic foods), weight loss. Alarm symptoms or PPI failure: EGD. Step down to H2 blocker or PRN PPI after resolution.",
    category: "Primary Care NP", difficulty: 1
  },
  {
    id: "np-pc-e6", type: "question",
    question: "A 55-year-old male presents with nocturia, weak stream, and urinary hesitancy. DRE shows smooth, symmetrically enlarged prostate. PSA is 2.1 ng/mL. What is the diagnosis and treatment?",
    options: ["Prostate cancer", "Benign prostatic hyperplasia; start alpha-blocker (tamsulosin) or 5-alpha reductase inhibitor (finasteride) for large prostate", "UTI", "Neurogenic bladder"],
    correctIndex: 1,
    answer: "BPH: smooth, symmetrically enlarged prostate with LUTS. Treatment based on symptom severity (IPSS score) and prostate size. ALPHA-BLOCKERS (tamsulosin, silodosin): rapid symptom relief in 1-2 weeks. 5-ALPHA REDUCTASE INHIBITORS (finasteride, dutasteride): for large prostates (>30-40 g), reduce prostate size over 6-12 months. Combination therapy for moderate-severe LUTS with enlarged prostate.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e7", type: "question",
    question: "A patient with a history of DVT asks about duration of anticoagulation. The DVT was provoked by 6-week leg immobilization. What does the NP recommend?",
    options: ["Lifelong anticoagulation", "3 months of anticoagulation for provoked DVT with identifiable transient risk factor; assess for extended therapy if unprovoked", "6 weeks only", "No anticoagulation needed"],
    correctIndex: 1,
    answer: "PROVOKED DVT/PE (surgery, trauma, immobilization, estrogen): 3 months of anticoagulation is standard. UNPROVOKED DVT/PE: consider extended/indefinite anticoagulation (risk-benefit analysis). D-dimer after stopping: elevated D-dimer suggests higher recurrence risk favoring extended therapy. Annual reassessment of risk-benefit for those on extended therapy.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e8", type: "question",
    question: "A 40-year-old woman presents with chronic daily diarrhea, abdominal cramping relieved by defecation, and no alarm symptoms. Rome IV criteria are met. What is the diagnosis?",
    options: ["Inflammatory bowel disease", "Irritable bowel syndrome (diarrhea-predominant); first-line treatment includes dietary modifications (low FODMAP), antispasmodics, and psychosocial support", "Celiac disease", "Colorectal cancer"],
    correctIndex: 1,
    answer: "IBS-D diagnosed by Rome IV criteria: recurrent abdominal pain >=1 day/week for 3 months associated with defecation, change in stool frequency or form. No alarm symptoms needed for diagnosis in young patients. FIRST-LINE: low FODMAP diet, fiber supplementation, antispasmodics (dicyclomine, hyoscyamine). SECOND-LINE: rifaximin, eluxadoline, bile acid sequestrants. Screen for celiac disease with tTG-IgA. Exclude IBD if alarm symptoms present.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e9", type: "question",
    question: "A 35-year-old woman presents with progressive fatigue, cold intolerance, and weight gain. TSH is 18 mIU/L, free T4 is 0.5 ng/dL. What is the treatment?",
    options: ["Methimazole", "Levothyroxine 1.6 mcg/kg/day on empty stomach 30-60 minutes before breakfast", "Liothyronine only", "No treatment if asymptomatic"],
    correctIndex: 1,
    answer: "Primary hypothyroidism treatment: levothyroxine at 1.6 mcg/kg/day in young healthy adults. Take on empty stomach 30-60 minutes before breakfast. Separate from calcium and iron by 4 hours. Recheck TSH in 6-8 weeks. Goal TSH: 0.5-2.5 mIU/L for most patients. In elderly or cardiac patients, start 12.5-25 mcg and titrate slowly.",
    category: "Primary Care NP", difficulty: 1
  },
  {
    id: "np-pc-e10", type: "question",
    question: "A patient presents with unilateral flank pain, hematuria, and CVA tenderness. Temperature is 38.8C. UA shows pyuria and bacteriuria. What is the diagnosis and management?",
    options: ["Simple cystitis", "Acute pyelonephritis; obtain urine culture, start empiric IV or oral fluoroquinolone or ceftriaxone, and imaging if no improvement in 48-72 hours", "Nephrolithiasis only", "Glomerulonephritis"],
    correctIndex: 1,
    answer: "Acute pyelonephritis: flank pain, CVA tenderness, fever, pyuria, bacteriuria. OUTPATIENT (mild, no nausea): ciprofloxacin 500 mg BID x 7 days or TMP-SMX x 14 days or ceftriaxone IM x 1 dose then oral. INPATIENT: IV ceftriaxone or fluoroquinolone. Blood cultures if sepsis. Imaging (CT or US) if no improvement in 48-72 hours to rule out obstruction or abscess.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e11", type: "question",
    question: "A 62-year-old presents with intermittent claudication and ABI of 0.7. What is the management plan?",
    options: ["Surgical bypass immediately", "Supervised exercise therapy, statin, antiplatelet (aspirin or clopidogrel), smoking cessation, BP/glucose optimization, and cilostazol for claudication symptoms", "Only walking advice", "No treatment needed"],
    correctIndex: 1,
    answer: "PAD management: LIFESTYLE: supervised exercise therapy (30-45 min, 3x/week for 12 weeks is equivalent to angioplasty for claudication). MEDICATIONS: high-intensity statin, antiplatelet (aspirin 81-325 mg or clopidogrel 75 mg), cilostazol 100 mg BID for claudication (PDE3 inhibitor, contraindicated in HF). RISK FACTORS: smoking cessation, BP control, glucose management. Vascular referral for critical limb ischemia or rest pain.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e12", type: "question",
    question: "A 30-year-old sexually active woman has dysuria and frequency. Dipstick shows positive leukocyte esterase and nitrites. What is the management?",
    options: ["Send culture before treating", "Empiric treatment for uncomplicated cystitis with nitrofurantoin 100 mg BID x 5 days or TMP-SMX x 3 days without culture in uncomplicated cases", "IV antibiotics", "CT scan first"],
    correctIndex: 1,
    answer: "Uncomplicated cystitis in premenopausal non-pregnant women: empiric treatment without culture. FIRST-LINE: nitrofurantoin 100 mg BID x 5 days (97% susceptibility) or TMP-SMX DS BID x 3 days (if local resistance <20%) or fosfomycin 3g single dose. Fluoroquinolones are NOT first-line for uncomplicated UTI. Culture needed for: recurrent UTI, complicated UTI, pregnant, or treatment failure.",
    category: "Primary Care NP", difficulty: 1
  },
  {
    id: "np-pc-e13", type: "question",
    question: "A patient with chronic migraine (18 headache days/month) fails topiramate and propranolol. What is the next step?",
    options: ["Increase opioid use", "CGRP monoclonal antibody (erenumab, fremanezumab, or galcanezumab) as preventive therapy for chronic migraine failing 2+ traditional preventives", "Continue failed medications", "No other options"],
    correctIndex: 1,
    answer: "CGRP monoclonal antibodies are indicated for episodic or chronic migraine failing >=2 traditional preventives. Options: erenumab (anti-CGRP receptor, 70/140 mg SC monthly), fremanezumab (anti-CGRP ligand, 225 mg SC monthly or 675 mg quarterly), galcanezumab (anti-CGRP ligand, 240 mg loading then 120 mg monthly). Well-tolerated with injection site reactions as main side effect. OnabotulinumtoxinA (Botox) is also FDA-approved for chronic migraine.",
    category: "Primary Care NP", difficulty: 3
  },
  {
    id: "np-pc-e14", type: "question",
    question: "A patient with diagnosed OSA and AHI of 22 refuses CPAP. What alternatives can the NP offer?",
    options: ["No alternatives exist", "Mandibular advancement device for mild-moderate OSA; positional therapy; weight loss; consider surgical referral for uvulopalatopharyngoplasty", "Only repeat sleep study", "Oxygen therapy alone"],
    correctIndex: 1,
    answer: "OSA alternatives to CPAP: ORAL APPLIANCE (mandibular advancement device) for mild-moderate OSA or CPAP intolerance (AHI 5-30). POSITIONAL THERAPY: avoid supine sleep if position-dependent. WEIGHT LOSS: 10% weight loss can reduce AHI by 50%. SURGICAL: UPPP, hypoglossal nerve stimulation (Inspire device). LIFESTYLE: avoid alcohol and sedatives before bed. Hypoglossal nerve stimulation (Inspire) approved for moderate-severe OSA failing CPAP.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e15", type: "question",
    question: "A 50-year-old presents with sudden onset gout flare in the first MTP joint. They have no CKD or HF. What is the acute management?",
    options: ["Start allopurinol immediately", "NSAID (indomethacin 50 mg TID) or colchicine (1.2 mg then 0.6 mg 1 hour later) within first 36 hours; never start allopurinol during acute flare", "Prednisone only", "Aspirin for pain"],
    correctIndex: 1,
    answer: "Acute gout: FIRST-LINE: NSAIDs (indomethacin, naproxen) OR colchicine within 36 hours of onset (most effective early: 1.2 mg then 0.6 mg 1 hour later = low-dose regimen per AGREE trial). Corticosteroids for NSAID/colchicine contraindications. NEVER start/stop/change allopurinol during acute flare. If already on allopurinol, continue. Urate-lowering therapy starts 2-4 weeks after flare resolution. Target urate <6 mg/dL.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e16", type: "question",
    question: "A patient has positive chlamydia NAAT. What is the treatment for the patient and their partner?",
    options: ["Ciprofloxacin only", "Doxycycline 100 mg BID x 7 days (preferred) or azithromycin 1g single dose; expedited partner therapy; test for co-infections (gonorrhea, HIV, syphilis)", "No partner treatment needed", "Only topical treatment"],
    correctIndex: 1,
    answer: "Chlamydia treatment (CDC 2021): PREFERRED: doxycycline 100 mg BID x 7 days (superior cure rate vs azithromycin). ALTERNATIVE: azithromycin 1g single dose. PARTNERS: treat all sexual partners within 60 days; expedited partner therapy (EPT) where legal. Test for co-infections: gonorrhea (treat empirically if not tested), HIV, syphilis, hepatitis B. Test of cure: 4 weeks post-treatment for pregnant patients. Rescreen patient at 3 months for reinfection.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e17", type: "question",
    question: "A 58-year-old with CKD stage 3a (eGFR 52) has persistent proteinuria (UACR 180 mg/g). BP is 138/82. What renal-protective interventions should be implemented?",
    options: ["Observation only", "ACEi/ARB (for proteinuria reduction), BP target <130/80, SGLT2 inhibitor (finerenone or dapagliflozin for CKD), statin, and dietary sodium restriction", "Fluid restriction only", "Dialysis preparation"],
    correctIndex: 1,
    answer: "CKD with proteinuria management: ACEi or ARB (reduce proteinuria and slow progression), BP target <130/80, SGLT2 inhibitor (dapagliflozin or empagliflozin for CKD regardless of diabetes per DAPA-CKD/EMPA-KIDNEY trials), finerenone (non-steroidal MRA) for diabetic CKD. Additionally: moderate protein intake, sodium restriction <2g/day, statin for CV risk, avoid nephrotoxins. Monitor K+ and creatinine with RAAS blockade.",
    category: "Primary Care NP", difficulty: 3
  },
  {
    id: "np-pc-e18", type: "question",
    question: "A patient presents with a new diagnosis of atrial fibrillation. CHA2DS2-VASc score is 1 (female sex only). Is anticoagulation indicated?",
    options: ["Full anticoagulation required", "CHA2DS2-VASc of 1 in females (sex-based point only) is equivalent to score of 0 in males; no anticoagulation needed, reassess annually", "Aspirin only", "Warfarin immediately"],
    correctIndex: 1,
    answer: "CHA2DS2-VASc scoring: female sex adds 1 point but is not independently an indication for anticoagulation. Score 0 (males) or 1 (females, if only sex-based point): no anticoagulation. Score 1 (males) or 2 (females): consider anticoagulation. Score >=2 (males) or >=3 (females): anticoagulation recommended. Aspirin alone is NOT recommended for AF stroke prevention per ESC guidelines.",
    category: "Primary Care NP", difficulty: 2
  },
  {
    id: "np-pc-e19", type: "question",
    question: "A patient with depression has failed adequate trials of two SSRIs. What constitutes treatment-resistant depression and what are the next steps?",
    options: ["Try another SSRI", "Treatment-resistant depression: failure of 2+ adequate antidepressant trials. Options: augmentation (lithium, atypical antipsychotic), switch class (SNRI, bupropion), esketamine nasal spray, or ECT for severe cases", "No further treatment available", "Discontinue all medications"],
    correctIndex: 1,
    answer: "Treatment-resistant depression (TRD): failure of >=2 adequate trials (adequate dose x >=6 weeks). STRATEGIES: 1) AUGMENTATION: lithium, aripiprazole, or quetiapine added to antidepressant. 2) SWITCH CLASS: SNRI (duloxetine, venlafaxine), bupropion, mirtazapine, MAOIs. 3) ESKETAMINE (Spravato): FDA-approved nasal spray for TRD (REMS required, administered in certified healthcare settings). 4) ECT: gold standard for severe TRD, catatonia, suicidality. TMS is also an option.",
    category: "Primary Care NP", difficulty: 3
  },
  {
    id: "np-pc-e20", type: "question",
    question: "What are the USPSTF recommended adult immunizations for a healthy 65-year-old?",
    options: ["Flu vaccine only", "Annual influenza, PCV20 or PCV15+PPSV23 (pneumococcal), Tdap/Td booster, shingles (Shingrix 2-dose), COVID-19 updated vaccine", "No vaccines needed at 65", "Only pneumococcal"],
    correctIndex: 1,
    answer: "Immunizations for healthy 65-year-old: INFLUENZA: annual (high-dose or adjuvanted preferred for >=65). PNEUMOCOCCAL: PCV20 alone OR PCV15 followed by PPSV23 (1 year later) if not previously vaccinated. SHINGRIX: 2 doses, 2-6 months apart (>=50 years, regardless of prior shingles or Zostavax). Td/Tdap booster every 10 years. COVID-19: updated vaccine. Hepatitis B: universal recommendation for all adults.",
    category: "Primary Care NP", difficulty: 2
  },
  // ============================================================
  // PRIMARY CARE - PEDIATRICS (18 cards)
  // ============================================================
  {
    id: "np-peds-e1", type: "question",
    question: "A 9-month-old presents with high fever for 3 days followed by defervescence and a blanching maculopapular rash starting on the trunk. What is the diagnosis?",
    options: ["Measles", "Roseola (exanthem subitum) caused by HHV-6; rash appears as fever breaks, self-limiting, reassurance only", "Scarlet fever", "Fifth disease"],
    correctIndex: 1,
    answer: "Roseola (exanthem subitum/sixth disease): caused by HHV-6. Classic pattern: high fever (often >40C) for 3-5 days with sudden defervescence, followed by rose-pink maculopapular rash starting on trunk spreading centrifugally. Most common in 6-24 months. Self-limiting, supportive care only. Febrile seizures may occur during the febrile phase. Rash is NOT contagious.",
    category: "Pediatric NP", difficulty: 1
  },
  {
    id: "np-peds-e2", type: "question",
    question: "At what age should autism spectrum disorder screening be performed according to AAP guidelines?",
    options: ["Only if parents express concern", "Universal screening at 18 and 24 months using validated tools like the M-CHAT-R/F", "At age 5 before school", "Only in high-risk children"],
    correctIndex: 1,
    answer: "AAP recommends UNIVERSAL ASD screening at 18 and 24 months using the M-CHAT-R/F (Modified Checklist for Autism in Toddlers, Revised with Follow-Up). Early red flags: no babbling by 12 months, no pointing by 12 months, no single words by 16 months, no 2-word phrases by 24 months, any regression. Early intervention (before age 3) significantly improves outcomes. Refer simultaneously for comprehensive evaluation AND early intervention services.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e3", type: "question",
    question: "A 3-year-old has bilateral middle ear effusion for 4 months with hearing loss of 25 dB. What is the management?",
    options: ["Repeat antibiotics", "Referral for tympanostomy tube placement; persistent bilateral OME >3 months with hearing loss is an indication for tubes", "Watchful waiting another 6 months", "Decongestants"],
    correctIndex: 1,
    answer: "AAO-HNS guidelines for OME: watchful waiting is appropriate for <3 months. Persistent bilateral OME >3 months with documented hearing loss (>=25 dB) is an indication for tympanostomy tubes. Tubes improve hearing and language development. Decongestants, antihistamines, and intranasal steroids have NOT shown benefit for OME. Audiometric evaluation is essential in persistent OME to guide management.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e4", type: "question",
    question: "A 7-year-old presents with inattention, distractibility, and poor academic performance. Teachers report symptoms across settings for >6 months. What diagnostic criteria must be met for ADHD?",
    options: ["Only teacher report needed", "DSM-5 requires >=6 symptoms of inattention and/or hyperactivity-impulsivity present before age 12, in >=2 settings, for >=6 months, causing functional impairment", "One positive screening test", "Only parental concern"],
    correctIndex: 1,
    answer: "DSM-5 ADHD criteria: >=6 symptoms (5 for age >=17) of inattention and/or hyperactivity-impulsivity, present before age 12, in >=2 settings (home, school), for >=6 months, causing functional impairment, not better explained by another condition. Subtypes: predominantly inattentive, predominantly hyperactive-impulsive, combined. Assessment tools: Vanderbilt (parent and teacher forms), Conners scales. First-line treatment >6 years: stimulant medication (methylphenidate or amphetamine) + behavioral therapy.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e5", type: "question",
    question: "A 2-month-old has a temperature of 38.5C (rectal). What is the management approach?",
    options: ["Oral antibiotics and outpatient follow-up", "Full sepsis workup (CBC, blood culture, UA/urine culture, LP) and empiric IV antibiotics pending cultures; all febrile neonates <60 days require evaluation for serious bacterial infection", "Acetaminophen and reassurance", "Wait and recheck in 24 hours"],
    correctIndex: 1,
    answer: "Febrile infant <60 days: high risk for serious bacterial infection (UTI, bacteremia, meningitis). WORKUP: CBC with differential, blood culture, UA + urine culture (catheterized specimen), CSF analysis and culture (LP). EMPIRIC ANTIBIOTICS: ampicillin + gentamicin (or cefotaxime) IV pending cultures. Rochester, Philadelphia, and Boston criteria help risk-stratify, but many centers admit all febrile neonates <28 days regardless. HSV evaluation if <21 days or concerning features.",
    category: "Pediatric NP", difficulty: 3
  },
  {
    id: "np-peds-e6", type: "question",
    question: "A child presents with barky cough, inspiratory stridor, and mild retractions. Westley croup score is 3. What is the treatment?",
    options: ["Immediate intubation", "Single dose of oral dexamethasone 0.6 mg/kg (max 10 mg); nebulized racemic epinephrine if moderate-severe distress", "Antibiotics for bacterial infection", "Albuterol nebulizer"],
    correctIndex: 1,
    answer: "Croup management based on Westley score: MILD (0-2): dexamethasone 0.6 mg/kg PO single dose (or nebulized budesonide). MODERATE (3-5): dexamethasone + nebulized racemic epinephrine (0.05 mL/kg of 2.25% solution, max 0.5 mL). SEVERE (>=6): epinephrine, dexamethasone, prepare for airway management. Observe 3-4 hours after epinephrine for rebound stridor. Cool mist has limited evidence but may provide comfort.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e7", type: "question",
    question: "What is the recommended iron supplementation for a breastfed infant?",
    options: ["No supplementation needed", "Elemental iron 1 mg/kg/day starting at 4 months and continuing until iron-rich complementary foods are established", "Only after anemia is diagnosed", "Iron-fortified water"],
    correctIndex: 1,
    answer: "AAP recommends iron supplementation for exclusively breastfed infants starting at 4 months (1 mg/kg/day elemental iron) because breast milk iron content is insufficient after 4-6 months as fetal iron stores deplete. Continue until iron-rich complementary foods are well established. Screen for iron deficiency anemia at 12 months (hemoglobin and ferritin). Formula-fed infants receive adequate iron from iron-fortified formula.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e8", type: "question",
    question: "A 15-year-old female athlete presents with stress fracture, amenorrhea, and low BMI. What syndrome does this represent?",
    options: ["Anorexia nervosa only", "Female Athlete Triad (now called Relative Energy Deficiency in Sport/RED-S): low energy availability, menstrual dysfunction, and decreased bone mineral density", "Overtraining syndrome", "Vitamin D deficiency"],
    correctIndex: 1,
    answer: "Female Athlete Triad/RED-S: 1) Low energy availability (insufficient caloric intake relative to expenditure), 2) Menstrual dysfunction (functional hypothalamic amenorrhea from low estrogen), 3) Decreased bone mineral density (osteopenia/osteoporosis, stress fractures). Management: increase caloric intake, reduce training intensity, calcium/vitamin D supplementation, consider COC or transdermal estrogen for bone protection. DEXA scan indicated. Screen for eating disorders. Multidisciplinary approach: NP, dietitian, psychologist.",
    category: "Pediatric NP", difficulty: 3
  },
  {
    id: "np-peds-e9", type: "question",
    question: "What is the current immunization schedule for a healthy 2-month-old?",
    options: ["Only DTaP", "DTaP, IPV, Hib, PCV15 or PCV20, rotavirus (oral), and hepatitis B (if not given at birth)", "No vaccines until 6 months", "MMR and varicella"],
    correctIndex: 1,
    answer: "2-month immunization schedule (ACIP): DTaP (dose 1), IPV (dose 1), Hib (dose 1), PCV15 or PCV20 (dose 1), Rotavirus (dose 1, oral), HepB (dose 2 if first given at birth). Maximum 6 injections per visit plus oral rotavirus. Combination vaccines (Pediarix: DTaP-IPV-HepB; Vaxelis: DTaP-IPV-HepB-Hib) reduce injection burden. MMR and varicella start at 12 months.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e10", type: "question",
    question: "A 4-year-old has recurrent wheezing episodes triggered by viral infections and exercise. What criteria classify this as persistent asthma requiring controller therapy?",
    options: ["Any single wheezing episode", "Symptoms >2 days/week, nighttime awakenings >2x/month, SABA use >2 days/week, or any activity limitation classifies as persistent asthma requiring daily ICS", "Only if hospitalized", "Wheezing with every cold"],
    correctIndex: 1,
    answer: "NAEPP EPR-4 classification for children 0-4 years: PERSISTENT asthma if ANY of: symptoms >2 days/week, nighttime awakenings >2x/month, SABA use >2 days/week, minor limitation of normal activity. STEP 2 (mild persistent): low-dose ICS daily (fluticasone 88 mcg BID). Alternative: montelukast (less effective). Reassess control in 4-6 weeks. Step up if not controlled; step down after 3 months of good control. Spacer device with mask is essential for MDI delivery in young children.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e11", type: "question",
    question: "A newborn screening result shows elevated TSH. What is the most likely diagnosis and what is the management?",
    options: ["Transient finding; no action", "Congenital hypothyroidism; start levothyroxine immediately (10-15 mcg/kg/day) to prevent intellectual disability", "Graves disease", "Normal variant"],
    correctIndex: 1,
    answer: "Congenital hypothyroidism (1 in 2000-4000 births) causes irreversible intellectual disability if untreated. Elevated TSH on newborn screen requires IMMEDIATE confirmatory serum TSH and fT4, then levothyroxine 10-15 mcg/kg/day started within first 2 weeks of life. Monitor TSH and fT4 at 2 and 4 weeks, then every 1-2 months in first year. Thyroid ultrasound or scan to determine etiology. Early and adequate treatment results in normal IQ.",
    category: "Pediatric NP", difficulty: 2
  },
  {
    id: "np-peds-e12", type: "question",
    question: "A 10-year-old presents with periumbilical pain that migrates to the right lower quadrant, anorexia, and low-grade fever. What finding helps confirm appendicitis?",
    options: ["Normal exam rules it out", "McBurney point tenderness (1/3 distance from ASIS to umbilicus), positive psoas sign, positive obturator sign, rebound tenderness, and guarding", "Only blood work needed", "Only CT confirms"],
    correctIndex: 1,
    answer: "Appendicitis clinical findings: McBurney point tenderness (most reliable), rebound tenderness, guarding, Rovsing sign (RLQ pain with LLQ palpation), psoas sign (pain with hip extension, retrocecal appendix), obturator sign (pain with internal rotation of flexed hip, pelvic appendix). Pediatric Appendicitis Score (PAS) aids diagnosis. WBC and CRP support but dont exclude. Ultrasound is first-line imaging in children (no radiation). CT if US inconclusive.",
    category: "Pediatric NP", difficulty: 2
  },
  // ============================================================
  // PRIMARY CARE - GERIATRICS (17 cards)
  // ============================================================
  {
    id: "np-geri-e1", type: "question",
    question: "A 78-year-old presents with progressive memory loss, getting lost in familiar places, and difficulty managing finances. MMSE is 18/30. What is the most likely diagnosis?",
    options: ["Normal aging", "Alzheimer disease (most common dementia); start cholinesterase inhibitor (donepezil 5 mg daily) and refer for caregiver support", "Depression", "Delirium"],
    correctIndex: 1,
    answer: "Alzheimer disease accounts for 60-80% of dementias. Presents with insidious memory loss (short-term first), executive dysfunction, visuospatial impairment, language difficulties. MMSE <24 suggests dementia. TREATMENT: cholinesterase inhibitors (donepezil 5-10 mg, rivastigmine, galantamine) for mild-moderate AD. Memantine (NMDA antagonist) added for moderate-severe. Non-pharmacologic: structured routines, caregiver education and support, safety planning, advance directives discussion.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e2", type: "question",
    question: "An 82-year-old on 12 medications presents after a fall. Which medication classes most increase fall risk?",
    options: ["Antihypertensives only", "Benzodiazepines, opioids, anticholinergics, antipsychotics, sedative-hypnotics, and alpha-blockers are highest fall risk medications", "Only muscle relaxants", "Statins"],
    correctIndex: 1,
    answer: "High fall-risk medications (AGS Beers): benzodiazepines and Z-drugs (highest risk, OR 1.5-2.0), opioids, anticholinergics (diphenhydramine, TCAs), first-generation antipsychotics, alpha-blockers (orthostatic hypotension), centrally-acting antihypertensives. Fall prevention: medication review and deprescribing, home safety assessment, exercise programs (tai chi, balance training), vision correction, vitamin D supplementation (800-1000 IU/day), orthostatic BP measurement.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e3", type: "question",
    question: "A 75-year-old presents with abrupt onset confusion, visual hallucinations, and fluctuating attention. What is the priority assessment?",
    options: ["Start antipsychotic immediately", "Diagnose delirium using CAM, then identify and treat underlying cause (infection, medication, metabolic, pain, urinary retention, constipation)", "Order MRI brain for dementia", "Assume sundowning"],
    correctIndex: 1,
    answer: "Delirium: acute onset, fluctuating, inattention, disorganized thinking. Use CAM for diagnosis. PRIORITY: identify and treat cause. Common triggers (mnemonic DELIRIUMS): Drugs, Electrolytes, Lack of drugs (withdrawal), Infection (UTI most common in elderly), Reduced sensory input, Intracranial pathology, Urinary retention/fecal impaction, Myocardial/metabolic, Subdural hematoma. Non-pharmacologic management first. Low-dose haloperidol only for severe agitation threatening safety.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e4", type: "question",
    question: "A 70-year-old woman has a DEXA T-score of -2.8 at the hip. What is the diagnosis and treatment?",
    options: ["Osteopenia; calcium only", "Osteoporosis (T-score <=-2.5); start bisphosphonate therapy plus calcium 1200 mg/day and vitamin D 800-1000 IU/day", "Normal for age", "No treatment until fracture"],
    correctIndex: 1,
    answer: "WHO criteria: T-score -1.0 to -2.4 = osteopenia; <=-2.5 = osteoporosis. Treatment: FIRST-LINE: oral bisphosphonate (alendronate 70 mg weekly or risedronate 35 mg weekly). Calcium 1200 mg/day and vitamin D 800-1000 IU/day. Alternative if bisphosphonate contraindicated: denosumab 60 mg SC every 6 months. For very high fracture risk: romosozumab or teriparatide (anabolic agents) for 1-2 years then transition to antiresorptive.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e5", type: "question",
    question: "What are the key principles of advance care planning that an NP should discuss with elderly patients?",
    options: ["Only discuss at end of life", "Discuss goals of care, healthcare power of attorney, living will, code status (DNAR/DNI), POLST form for seriously ill, and revisit preferences regularly", "Only physician responsibility", "Not applicable in primary care"],
    correctIndex: 1,
    answer: "Advance care planning should be an ongoing conversation, not a one-time event. Components: 1) Goals of care discussion (what matters most to the patient), 2) Healthcare power of attorney/proxy designation, 3) Living will/advance directive (specific treatment preferences), 4) Code status discussion (full code, DNR, DNI), 5) POLST/MOLST form for seriously ill patients (portable medical orders). Revisit with any health status change. Document in medical record and ensure accessibility.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e6", type: "question",
    question: "An 80-year-old with urge urinary incontinence has failed behavioral interventions. What pharmacologic treatment is first-line?",
    options: ["Oxybutynin IR (high anticholinergic)", "Extended-release antimuscarinic with lower CNS penetration (trospium, darifenacin) or beta-3 agonist (mirabegron) preferred in elderly to minimize cognitive side effects", "Diuretics", "Alpha-blockers"],
    correctIndex: 1,
    answer: "Urge incontinence in elderly: BEHAVIORAL first (bladder training, pelvic floor exercises, timed voiding). PHARMACOLOGIC: avoid oxybutynin IR in elderly (high anticholinergic burden, crosses BBB causing cognitive impairment). PREFERRED: mirabegron (beta-3 agonist, no anticholinergic effects) or if antimuscarinic needed, use trospium or darifenacin (lower CNS penetration). Vibegron is a newer beta-3 agonist option. Monitor post-void residual.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e7", type: "question",
    question: "A 76-year-old with Parkinson disease develops visual hallucinations. Which antipsychotic is safest?",
    options: ["Haloperidol", "Pimavanserin (Nuplazid), a selective serotonin inverse agonist that does not block dopamine receptors; alternatively low-dose quetiapine or clozapine", "Risperidone", "Olanzapine"],
    correctIndex: 1,
    answer: "Parkinson disease psychosis: AVOID typical antipsychotics (haloperidol) and most atypicals (risperidone, olanzapine) as they block dopamine D2 receptors and catastrophically worsen motor symptoms. SAFEST options: pimavanserin (FDA-approved for PD psychosis, selective 5-HT2A inverse agonist, no D2 blockade), quetiapine (minimal D2 effect at low doses), clozapine (gold standard but requires CBC monitoring for agranulocytosis). FDA black box: all antipsychotics increase mortality in elderly with dementia.",
    category: "Geriatric NP", difficulty: 3
  },
  {
    id: "np-geri-e8", type: "question",
    question: "What screening tools should the NP use to assess malnutrition risk in elderly patients?",
    options: ["BMI alone", "Mini Nutritional Assessment (MNA) for community-dwelling elderly; assess unintentional weight loss, albumin, dietary intake, functional status, and social isolation", "Only blood tests", "No screening recommended"],
    correctIndex: 1,
    answer: "Geriatric malnutrition screening: MNA (Mini Nutritional Assessment) is validated for community-dwelling elderly (sensitivity 96%). Key indicators: unintentional weight loss (>5% in 1 month or >10% in 6 months), BMI <22 (elderly threshold), low albumin (<3.5 g/dL), low prealbumin (<15 mg/dL), declining functional status, social isolation, polypharmacy affecting appetite, poor dentition, depression. Interventions: oral nutritional supplements, fortified foods, meal programs, dental care, depression treatment.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e9", type: "question",
    question: "How should diabetes management differ in a frail 85-year-old with limited life expectancy?",
    options: ["Same targets as younger adults", "Relaxed HbA1c target of 8.0-8.5%; avoid hypoglycemia-prone agents (sulfonylureas, insulin); prioritize safety and quality of life over tight control", "Discontinue all diabetes medications", "Aggressive HbA1c <6.5%"],
    correctIndex: 1,
    answer: "ADA/AGS guidelines for frail elderly with limited life expectancy: HbA1c target 8.0-8.5% (avoid <7% due to hypoglycemia harm). AVOID: sulfonylureas (hypoglycemia risk), sliding scale insulin (unpredictable). PREFERRED: metformin if tolerated and eGFR adequate, DPP-4 inhibitors (weight neutral, low hypoglycemia, renal dose adjustment). Simplify regimens (once-daily medications). Focus on preventing symptomatic hyperglycemia rather than microvascular endpoint reduction.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e10", type: "question",
    question: "A 74-year-old presents with unilateral resting tremor, bradykinesia, rigidity, and postural instability. What is the treatment?",
    options: ["Donepezil", "Carbidopa-levodopa is first-line for Parkinson disease when symptoms affect function; start 25/100 TID and titrate", "Benztropine for all patients", "No treatment available"],
    correctIndex: 1,
    answer: "Parkinson disease treatment when symptoms affect function: FIRST-LINE: carbidopa-levodopa (most effective symptomatic therapy). Start 25/100 TID, titrate based on response. MAO-B inhibitors (rasagiline, selegiline) for mild symptoms or as adjunct. Dopamine agonists (pramipexole, ropinirole) in younger patients (impulse control disorders in 13-20%). AVOID anticholinergics in elderly (cognitive impairment). Physical therapy, occupational therapy, and fall prevention are essential non-pharmacologic interventions.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e11", type: "question",
    question: "What constitutes elder abuse and what is the NPs legal obligation?",
    options: ["Only physical violence", "Physical, emotional, sexual, financial abuse, neglect, and self-neglect. NPs are mandated reporters in all states; report suspected abuse to Adult Protective Services", "Only if patient discloses", "No reporting obligation"],
    correctIndex: 1,
    answer: "Elder abuse types: PHYSICAL (bruises, fractures, burns in unusual patterns), EMOTIONAL/PSYCHOLOGICAL (isolation, threats, humiliation), SEXUAL, FINANCIAL/EXPLOITATION (unauthorized use of funds, property), NEGLECT (malnutrition, dehydration, poor hygiene, untreated medical conditions), SELF-NEGLECT. Screening: ask about safety at every visit. NPs are MANDATED REPORTERS. Report to Adult Protective Services (APS). Document findings objectively. High-risk: cognitive impairment, social isolation, caregiver stress, financial dependence.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e12", type: "question",
    question: "A 68-year-old reports excessive daytime sleepiness and unrefreshing sleep despite adequate sleep duration. What should the NP evaluate?",
    options: ["Normal aging", "Screen for obstructive sleep apnea (STOP-BANG questionnaire), restless leg syndrome, medications causing sedation, depression, and hypothyroidism", "Prescribe zolpidem", "No intervention"],
    correctIndex: 1,
    answer: "Geriatric insomnia/sleep disorder evaluation: STOP-BANG for OSA screening (>=3 = moderate risk), medication review (sedating agents), depression screening (PHQ-9), thyroid function, RLS assessment (ferritin level, as low ferritin exacerbates RLS). FIRST-LINE for insomnia: CBT-I (cognitive behavioral therapy for insomnia). AVOID: benzodiazepines and Z-drugs (Beers Criteria). If medication needed: low-dose trazodone or melatonin. Sleep hygiene education is essential.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e13", type: "question",
    question: "What is sarcopenia and how should the NP assess and manage it?",
    options: ["Only weight loss", "Progressive loss of skeletal muscle mass, strength, and function; assess with grip strength, gait speed, and chair stand test. Manage with resistance exercise and adequate protein (1.0-1.2 g/kg/day)", "Normal aging requiring no intervention", "Only affects bedridden patients"],
    correctIndex: 1,
    answer: "Sarcopenia: age-related progressive loss of muscle mass, strength, and physical performance. SCREENING: SARC-F questionnaire. ASSESSMENT: grip strength (<27 kg men, <16 kg women), gait speed (<0.8 m/s), chair stand test, DEXA or BIA for muscle mass. MANAGEMENT: resistance exercise (2-3x/week, most effective intervention), adequate protein (1.0-1.2 g/kg/day, distributed across meals), vitamin D supplementation, optimize nutrition. Associated with falls, fractures, disability, and mortality.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e14", type: "question",
    question: "A 72-year-old with depression is not responding to sertraline 100 mg daily after 8 weeks. The patient also has chronic pain. What antidepressant change would address both conditions?",
    options: ["Add alprazolam", "Switch to duloxetine (SNRI) which is FDA-approved for both MDD and chronic pain conditions (diabetic neuropathy, fibromyalgia, chronic musculoskeletal pain)", "Double sertraline dose", "Discontinue all treatment"],
    correctIndex: 1,
    answer: "Duloxetine (SNRI) addresses both depression and chronic pain through dual serotonin-norepinephrine reuptake inhibition modulating descending pain pathways. FDA-approved for MDD, GAD, diabetic peripheral neuropathy, fibromyalgia, and chronic musculoskeletal pain. Start 30 mg daily x 1 week then increase to 60 mg. Max 120 mg/day. Contraindicated with MAOIs and in hepatic insufficiency. Cross-taper from sertraline to avoid discontinuation syndrome.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e15", type: "question",
    question: "What immunizations are specifically recommended for adults aged 65 and older?",
    options: ["Flu vaccine only", "High-dose or adjuvanted influenza annually, pneumococcal (PCV20 or PCV15+PPSV23), Shingrix (2 doses), Td/Tdap booster, COVID-19 updated vaccine", "No vaccines needed", "Only tetanus"],
    correctIndex: 1,
    answer: "Adults >=65 immunizations: INFLUENZA: high-dose (Fluzone HD), adjuvanted (Fluad), or recombinant (Flublok) preferred over standard-dose. PNEUMOCOCCAL: PCV20 alone OR PCV15 then PPSV23 (>=1 year later). SHINGRIX: 2 doses 2-6 months apart (even if prior Zostavax or prior shingles). Td/Tdap every 10 years. COVID-19 updated vaccine. Hepatitis B: universal adult recommendation. RSV: single dose for those >=60 with shared clinical decision-making.",
    category: "Geriatric NP", difficulty: 2
  },
  {
    id: "np-geri-e16", type: "question",
    question: "A 79-year-old presents with new-onset bilateral temporal headache, jaw claudication, and ESR of 85 mm/hr. What is the emergency?",
    options: ["Tension headache", "Giant cell arteritis (temporal arteritis); start high-dose prednisone 40-60 mg immediately to prevent irreversible blindness; arrange urgent temporal artery biopsy", "Migraine", "Sinusitis"],
    correctIndex: 1,
    answer: "Giant cell arteritis (GCA): large-vessel vasculitis in patients >50 years. Classic: new temporal headache, jaw claudication, scalp tenderness, visual disturbances (amaurosis fugax, diplopia). Labs: ESR >50, CRP elevated, thrombocytosis. EMERGENCY: start prednisone 40-60 mg IMMEDIATELY (do NOT wait for biopsy) to prevent irreversible vision loss from anterior ischemic optic neuropathy. Temporal artery biopsy within 2 weeks (steroids dont affect biopsy for 2-6 weeks). Tocilizumab (IL-6 inhibitor) is steroid-sparing agent.",
    category: "Geriatric NP", difficulty: 3
  },
  {
    id: "np-geri-e17", type: "question",
    question: "A 71-year-old is prescribed a new medication. What pharmacokinetic changes of aging affect drug dosing?",
    options: ["No changes occur", "Decreased hepatic metabolism (reduced CYP450), decreased renal clearance (lower GFR), increased body fat (increased Vd for lipophilic drugs), decreased albumin (increased free drug fraction)", "Only renal changes matter", "Increased drug metabolism with aging"],
    correctIndex: 1,
    answer: "Age-related pharmacokinetic changes: ABSORPTION: slightly decreased but clinically insignificant for most drugs. DISTRIBUTION: increased body fat (increased Vd for lipophilic drugs like diazepam, extending half-life), decreased lean mass and total body water (increased concentration of hydrophilic drugs). METABOLISM: decreased hepatic blood flow and CYP450 activity (Phase I metabolism reduced). ELIMINATION: decreased GFR (even with normal creatinine — use Cockcroft-Gault or CKD-EPI to estimate). General rule: start low, go slow, but dont undertreated.",
    category: "Geriatric NP", difficulty: 2
  }
];
