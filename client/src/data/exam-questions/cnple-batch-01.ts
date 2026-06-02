import type { ExamQuestion } from "./types";

export const cnpleBatch01Questions: ExamQuestion[] = [
  {
    q: "A 62-year-old male presents to the NP clinic with a 2-month history of exertional dyspnoea, orthopnoea, and bilateral ankle oedema. He has a history of hypertension and type 2 diabetes. Examination reveals JVP of 8 cm, bilateral basal crackles, and a displaced apical impulse. BNP is 1,240 pg/mL. Which initial investigation is most appropriate?",
    o: ["Transthoracic echocardiogram to assess ventricular function and structural abnormalities", "Coronary angiography to evaluate for ischaemic heart disease", "Cardiac MRI for tissue characterisation", "Right heart catheterisation for haemodynamic assessment"],
    a: 0,
    r: "Transthoracic echocardiogram is the first-line investigation for suspected heart failure, providing assessment of ejection fraction, valvular function, wall motion abnormalities, and chamber dimensions. The elevated BNP strongly supports heart failure. Coronary angiography may be indicated subsequently if ischaemic aetiology is suspected but is not the initial test. Cardiac MRI and right heart catheterisation are second-line investigations for specific clinical questions.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old female with newly diagnosed HFrEF (EF 30%) is being started on guideline-directed medical therapy. She has no contraindications. Which combination represents the current standard initial pharmacotherapy?",
    o: ["ACE inhibitor or ARB, beta-blocker, mineralocorticoid receptor antagonist, and SGLT2 inhibitor", "Digoxin, furosemide, and hydralazine as triple therapy", "Calcium channel blocker and thiazide diuretic", "Beta-blocker monotherapy with reassessment in 6 months"],
    a: 0,
    r: "Current CCS/AHA guidelines recommend four pillars of therapy for HFrEF: RAAS inhibition (ACEi/ARB/ARNI), beta-blocker (bisoprolol, carvedilol, or metoprolol succinate), MRA (spironolactone or eplerenone), and SGLT2 inhibitor (dapagliflozin or empagliflozin). These have each demonstrated mortality benefit. Digoxin reduces hospitalisations but does not reduce mortality. Non-dihydropyridine CCBs are contraindicated in HFrEF. Monotherapy is inadequate.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female presents with a 3-day history of dysuria, urinary frequency, and suprapubic discomfort. She has no fever, flank pain, or vaginal discharge. She has had two previous UTIs in the past year treated with trimethoprim-sulfamethoxazole. Urine dipstick shows positive nitrites and leukocyte esterase. What is the most appropriate management?",
    o: ["Prescribe empiric antibiotics for uncomplicated cystitis based on local resistance patterns and obtain urine culture if recurrent", "Refer for cystoscopy to evaluate for structural abnormalities", "Order a CT abdomen to rule out renal calculi", "Prescribe a 14-day course of ciprofloxacin"],
    a: 0,
    r: "This is an uncomplicated cystitis in a premenopausal, non-pregnant woman. First-line empiric treatment options include nitrofurantoin 100 mg BID for 5 days, trimethoprim-sulfamethoxazole DS BID for 3 days (if local resistance <20%), or fosfomycin 3 g single dose. Given this is her third UTI in a year, a urine culture with sensitivities should be obtained to guide therapy. Cystoscopy is reserved for persistent haematuria or suspected structural disease. CT is unnecessary without flank pain or haematuria. Fluoroquinolones should not be used first-line for uncomplicated cystitis.",
    s: "Renal"
  },
  {
    q: "A 70-year-old male with COPD (GOLD stage III) on tiotropium and salbutamol PRN presents with increased dyspnoea, purulent sputum production, and increased sputum volume over 3 days. RR 24, SpO2 89% on room air, T 37.8°C. Chest examination reveals bilateral wheezes and decreased air entry bilaterally. What is the initial management?",
    o: ["Short-acting bronchodilators, systemic corticosteroids (prednisone 40 mg daily for 5 days), antibiotics for purulent sputum, and supplemental oxygen", "Increase tiotropium dose and add inhaled corticosteroids", "Start IV aminophylline as first-line therapy", "Prescribe oral leukotriene receptor antagonist and reassess in 1 week"],
    a: 0,
    r: "This is an acute exacerbation of COPD (AECOPD) with all three Anthonisen criteria (increased dyspnoea, sputum volume, and sputum purulence). Management includes intensified short-acting bronchodilators (salbutamol ± ipratropium), systemic corticosteroids (prednisone 40 mg × 5 days per GOLD guidelines), antibiotics (amoxicillin-clavulanate or azithromycin for purulent sputum), and controlled oxygen therapy targeting SpO2 88-92%. Increasing the long-acting anticholinergic dose is not appropriate for acute management. IV aminophylline has a narrow therapeutic index and is not first-line. Leukotriene antagonists are not indicated for AECOPD.",
    s: "Respiratory"
  },
  {
    q: "A 35-year-old female presents with a 2 cm firm, mobile, non-tender mass in the upper outer quadrant of her right breast, discovered 2 weeks ago during self-examination. She has no family history of breast cancer. Menstrual cycles are regular. What is the most appropriate initial investigation?",
    o: ["Diagnostic ultrasound as the preferred initial imaging modality in women under 40 due to breast tissue density", "Bilateral mammography as first-line investigation", "Fine needle aspiration biopsy without imaging", "MRI of both breasts for comprehensive evaluation"],
    a: 0,
    r: "In women under 40, ultrasound is the preferred initial imaging modality because dense breast tissue in younger women reduces mammographic sensitivity. Ultrasound can characterise the mass as solid vs cystic and assess morphological features suggestive of malignancy (irregular margins, shadowing). If the ultrasound shows suspicious features, core needle biopsy follows. Mammography is first-line in women over 40. FNA without imaging misses the opportunity to characterise the lesion. MRI is reserved for high-risk screening or equivocal findings on conventional imaging.",
    s: "Reproductive"
  },
  {
    q: "A 55-year-old male presents for a periodic health examination. He has no symptoms and no significant past medical history. BMI is 27. BP is 132/84. Fasting glucose is 6.4 mmol/L. He asks about diabetes screening. What is the most appropriate next step?",
    o: ["Order an HbA1c or fasting glucose repeated on a separate day, as fasting glucose of 6.4 mmol/L falls in the prediabetes range (impaired fasting glucose)", "Diagnose type 2 diabetes based on the single fasting glucose result", "No further testing is needed as the glucose is within normal limits", "Order a random glucose level to confirm the finding"],
    a: 0,
    r: "A fasting glucose of 6.1-6.9 mmol/L indicates impaired fasting glucose (prediabetes) per Diabetes Canada guidelines. A single abnormal result in an asymptomatic individual requires confirmation with a repeat test on a separate day (fasting glucose or HbA1c). An HbA1c of 6.0-6.4% also confirms prediabetes. Diabetes diagnosis requires fasting glucose ≥7.0 mmol/L or HbA1c ≥6.5% confirmed on two separate occasions in asymptomatic patients. The current result is above normal (≤6.0 mmol/L), so further testing is required. Random glucose is less reliable for screening.",
    s: "Endocrine"
  },
  {
    q: "A 48-year-old female presents with fatigue, weight gain, and menstrual irregularity. TSH is 8.2 mIU/L (normal 0.4-4.0), free T4 is 11 pmol/L (normal 12-22). Anti-TPO antibodies are positive. She has no cardiac history. What is the most appropriate management?",
    o: ["Initiate levothyroxine replacement starting at 1.6 mcg/kg/day and recheck TSH in 6-8 weeks", "Observe without treatment and recheck in 6 months as TSH is only mildly elevated", "Start levothyroxine 200 mcg daily for rapid correction", "Refer to endocrinology before starting any treatment"],
    a: 0,
    r: "This is overt primary hypothyroidism (elevated TSH with low free T4) with positive anti-TPO confirming Hashimoto thyroiditis. Levothyroxine at a weight-based dose of approximately 1.6 mcg/kg/day is appropriate in patients under 60-65 without cardiac disease. TSH should be rechecked in 6-8 weeks with dose adjustment. Observation is appropriate for subclinical hypothyroidism (normal free T4) but not overt disease with symptoms. A starting dose of 200 mcg risks cardiac complications. Endocrinology referral is unnecessary for straightforward primary hypothyroidism.",
    s: "Endocrine"
  },
  {
    q: "A 30-year-old female at 10 weeks gestation presents for her first prenatal visit. She has no significant medical history. Which screening tests are essential at this initial visit according to Canadian prenatal care guidelines?",
    o: ["CBC, blood type and Rh, antibody screen, rubella immunity, hepatitis B surface antigen, HIV, syphilis, urinalysis and culture, and offer of first-trimester screening", "Only a urine pregnancy test to confirm pregnancy", "Glucose tolerance test and Group B Streptococcus culture", "Full STI panel including herpes and HPV testing only"],
    a: 0,
    r: "Canadian prenatal guidelines (SOGC) recommend comprehensive first-visit screening: CBC (anaemia, thrombocytopenia), blood group and Rh (Rh incompatibility risk), antibody screen, rubella immunity, HBsAg, HIV serology, syphilis serology (RPR/VDRL), urinalysis with culture (asymptomatic bacteriuria), and offering first-trimester combined screening (nuchal translucency + serum markers) at 11-14 weeks. Pregnancy is typically confirmed before referral. Glucose screening is done at 24-28 weeks. GBS culture is done at 35-37 weeks. HSV and HPV are not routine prenatal screens.",
    s: "Maternal"
  },
  {
    q: "A 4-year-old male is brought by his mother for a well-child visit. He has met all developmental milestones. His immunisations are up to date. Mother reports he is a picky eater. His growth is tracking along the 25th percentile for both height and weight, consistent with previous visits. What is the most appropriate nutritional guidance?",
    o: ["Reassure the mother that consistent growth along his percentile is normal, encourage variety without pressure, and recommend continued daily vitamin D supplementation", "Refer to a paediatric gastroenterologist for failure to thrive evaluation", "Prescribe a high-calorie supplement to increase his percentile ranking", "Order comprehensive blood work including iron studies, vitamin levels, and celiac screening"],
    a: 0,
    r: "A child consistently tracking along the 25th percentile with normal development is growing appropriately. Picky eating is developmentally normal at age 4. Evidence-based guidance includes offering variety without pressure (Satter's division of responsibility), maintaining regular meal and snack times, and continuing vitamin D supplementation (400 IU daily per CPS guidelines). The 25th percentile is within normal range and does not indicate failure to thrive. High-calorie supplements are unnecessary and may reduce appetite. Comprehensive blood work is not indicated with normal growth trajectory.",
    s: "Pediatric"
  },
  {
    q: "A 72-year-old female with osteoarthritis of bilateral knees presents requesting pain management. She has tried regular acetaminophen with partial relief. She has a history of peptic ulcer disease and takes low-dose ASA for cardiovascular prophylaxis. Renal function is normal. What is the most appropriate next step in pharmacological management?",
    o: ["Topical NSAID (diclofenac gel) applied to the knees, as it provides local anti-inflammatory effect with minimal systemic absorption and lower GI risk", "Oral ibuprofen 400 mg three times daily", "Oral naproxen with a proton pump inhibitor", "Opioid analgesic such as tramadol 50 mg every 6 hours"],
    a: 0,
    r: "Given her history of peptic ulcer disease and concurrent ASA use, oral NSAIDs pose significant GI bleeding risk. Topical NSAIDs (diclofenac gel) provide effective local anti-inflammatory action for knee OA with minimal systemic absorption, avoiding GI and renal adverse effects. Canadian Rheumatology Association guidelines recommend topical NSAIDs as second-line after acetaminophen for knee OA. Oral ibuprofen or naproxen with PPI still carry GI risk, especially with concurrent ASA. Opioids should be avoided for chronic OA management due to dependence risk and limited long-term efficacy.",
    s: "Musculoskeletal"
  },
  {
    q: "A 40-year-old male presents with acute onset of severe pain, swelling, erythema, and warmth of the first metatarsophalangeal joint. He consumed alcohol heavily at a social event 2 days ago. He has no fever. Serum uric acid is 520 µmol/L. What is the most appropriate initial treatment?",
    o: ["Colchicine 1.2 mg followed by 0.6 mg one hour later, or an NSAID if colchicine is not tolerated, for acute gout flare management", "Allopurinol 300 mg daily to lower uric acid immediately", "Intra-articular corticosteroid injection as first-line without attempting oral therapy", "Probenecid to increase uric acid excretion during the acute flare"],
    a: 0,
    r: "This is a classic presentation of acute gout (podagra) with the typical first MTP joint involvement following alcohol intake. First-line treatment for acute gout is colchicine (low-dose regimen: 1.2 mg then 0.6 mg one hour later) or an NSAID (naproxen, indomethacin). Allopurinol should never be initiated during an acute flare as it can worsen and prolong the attack by causing urate crystal shift. Urate-lowering therapy is started 2-4 weeks after flare resolution. Intra-articular injection is an option but not first-line when oral therapy is feasible. Probenecid is a urate-lowering agent, not an acute treatment.",
    s: "Musculoskeletal"
  },
  {
    q: "A 28-year-old female presents with a 6-week history of persistent low mood, anhedonia, insomnia (difficulty falling asleep and early morning wakening), poor concentration, decreased appetite with 4 kg weight loss, and passive suicidal ideation without plan or intent. She denies substance use. PHQ-9 score is 18 (moderately severe). She has no prior psychiatric history. What is the most appropriate initial pharmacotherapy?",
    o: ["SSRI such as sertraline or escitalopram, starting at the lowest effective dose with close follow-up in 1-2 weeks for suicidality monitoring", "Benzodiazepine such as lorazepam for immediate symptom relief", "Tricyclic antidepressant such as amitriptyline 75 mg at bedtime", "Atypical antipsychotic such as quetiapine 300 mg at bedtime"],
    a: 0,
    r: "SSRIs (sertraline, escitalopram, fluoxetine) are first-line pharmacotherapy for major depressive disorder per CANMAT guidelines. They have favourable safety profiles, established efficacy, and lower overdose risk compared to TCAs (important given passive suicidal ideation). Starting at the lowest dose with planned follow-up in 1-2 weeks allows monitoring for treatment-emergent suicidality and side effects. Benzodiazepines treat anxiety symptoms but are not antidepressants and carry dependence risk. TCAs are second-line due to side effects and lethality in overdose. Quetiapine at 300 mg is not first-line for MDD.",
    s: "Mental Health"
  },
  {
    q: "A 65-year-old male with a 40-pack-year smoking history and recently diagnosed COPD asks about smoking cessation. He has tried to quit twice before using nicotine patches without success. He is motivated to quit. What pharmacotherapy should the NP recommend?",
    o: ["Varenicline as it has the highest efficacy for smoking cessation among pharmacological options, especially for those who failed NRT", "Bupropion SR 150 mg once daily without dose titration", "Nicotine patch alone at a higher dose than previously tried", "Electronic cigarettes as a proven first-line smoking cessation aid"],
    a: 0,
    r: "Varenicline is the most effective single pharmacological agent for smoking cessation, with quit rates approximately 2-3 times higher than placebo. It works as a partial agonist at the alpha-4 beta-2 nicotinic receptor, reducing cravings and withdrawal while blocking the rewarding effects of nicotine. For patients who have failed NRT, varenicline is the recommended next-line therapy per CTS/CTFPHC guidelines. Bupropion is effective but requires BID dosing after titration. Repeating failed NRT alone is unlikely to succeed. Electronic cigarettes are not approved as cessation aids in Canadian guidelines.",
    s: "Respiratory"
  },
  {
    q: "A 50-year-old female presents with a 2-week history of epigastric burning pain, worse after meals, with occasional nausea. She takes ibuprofen regularly for chronic back pain. She has no alarm features (dysphagia, weight loss, vomiting, GI bleeding). She has never been tested for H. pylori. What is the most appropriate initial management?",
    o: ["Discontinue ibuprofen, test for H. pylori with urea breath test or stool antigen, and start a PPI while awaiting results", "Proceed directly to upper endoscopy for definitive diagnosis", "Start triple therapy for H. pylori empirically without testing", "Prescribe sucralfate without addressing the NSAID use"],
    a: 0,
    r: "This patient has dyspepsia likely related to chronic NSAID use. Management includes discontinuing the offending NSAID, testing for H. pylori (urea breath test or stool antigen are non-invasive first-line tests per CAG guidelines), and initiating PPI therapy. H. pylori testing is recommended as co-existing infection with NSAID use synergistically increases ulcer risk. Upper endoscopy is reserved for patients with alarm features or age >60 with new dyspepsia. Empiric H. pylori treatment without confirmed infection promotes antibiotic resistance. Sucralfate alone does not address the underlying causes.",
    s: "GI"
  },
  {
    q: "A 22-year-old female presents with acute right lower quadrant pain, nausea, and a low-grade fever of 37.9°C. She reports her last menstrual period was 3 weeks ago and was normal. On examination, she has rebound tenderness at McBurney point. WBC is 13.8 × 10⁹/L. What is the priority action before confirming appendicitis?",
    o: ["Obtain a urine or serum beta-hCG to rule out ectopic pregnancy before any imaging or surgical planning", "Order immediate CT abdomen with IV contrast", "Start IV antibiotics and prepare for appendectomy", "Administer morphine 4 mg IV for pain and reassess in 2 hours"],
    a: 0,
    r: "In any female of reproductive age presenting with acute abdominal pain, pregnancy must be excluded before proceeding with diagnostic imaging (especially CT with radiation) or surgical intervention. Ectopic pregnancy can mimic appendicitis and is a life-threatening condition requiring different management. A beta-hCG should be obtained urgently. While the presentation is consistent with appendicitis, CT imaging should follow pregnancy exclusion. Starting antibiotics and preparing for surgery without excluding ectopic pregnancy is unsafe. Pain management is important but secondary to ruling out ectopic pregnancy.",
    s: "Reproductive"
  },
  {
    q: "A 68-year-old male with a history of atrial fibrillation on warfarin presents with an INR of 5.8 at a routine visit. He has no signs of active bleeding. What is the most appropriate management?",
    o: ["Hold warfarin for 1-2 doses, recheck INR in 24-48 hours, and consider low-dose oral vitamin K (1-2.5 mg) if INR is above 9 or the patient is at high bleeding risk", "Administer IV vitamin K 10 mg immediately", "Transfuse fresh frozen plasma", "Continue warfarin at the current dose and recheck in 1 week"],
    a: 0,
    r: "For a supratherapeutic INR of 5.0-9.0 without active bleeding, Canadian guidelines (Thrombosis Canada) recommend holding warfarin for 1-2 doses and rechecking INR. Oral vitamin K 1-2.5 mg is considered if INR is >9 or if the patient has additional risk factors for bleeding. IV vitamin K 10 mg is reserved for serious or life-threatening bleeding with INR reversal urgency. FFP is indicated for active major bleeding or when rapid reversal is needed for emergency surgery. Continuing the current dose with an INR of 5.8 risks serious haemorrhage.",
    s: "Pharmacology"
  },
  {
    q: "A 42-year-old female presents with a painful, erythematous, warm, fluctuant swelling (3 cm) on her right forearm for 4 days. She is afebrile. There is no surrounding cellulitis beyond 1 cm of the abscess margin. She has no diabetes or immunocompromise. What is the most appropriate treatment?",
    o: ["Incision and drainage of the abscess; routine oral antibiotics are not necessary for a small uncomplicated abscess without significant surrounding cellulitis", "Oral antibiotics alone without drainage", "Warm compresses and observation for 2 weeks", "Referral to a surgeon for excision under general anaesthesia"],
    a: 0,
    r: "Incision and drainage is the definitive treatment for a cutaneous abscess. For small (≤5 cm), uncomplicated abscesses in immunocompetent patients without significant surrounding cellulitis, I&D alone is sufficient and antibiotics are not routinely required per IDSA guidelines. Antibiotics alone without drainage are ineffective for abscesses as they cannot penetrate the abscess cavity adequately. Warm compresses may help small developing abscesses but a 3 cm fluctuant collection requires drainage. A 3 cm superficial abscess can be drained in the clinic under local anaesthesia; surgical referral is unnecessary.",
    s: "Dermatology"
  },
  {
    q: "A 78-year-old female living in a long-term care facility is brought to clinic by staff for evaluation of confusion and agitation over the past 2 days. Her baseline is oriented and conversational. She has a history of hypertension and mild cognitive impairment. Temperature is 37.2°C, HR 92, BP 148/88. Urinalysis shows positive leukocytes and bacteria. What should the NP consider before prescribing antibiotics?",
    o: ["Asymptomatic bacteriuria is common in elderly institutionalised patients; assess for other causes of delirium including medication changes, constipation, pain, and dehydration before attributing to UTI", "Treat immediately with ciprofloxacin 500 mg BID for 7 days", "Order blood cultures and start IV antibiotics for presumed urosepsis", "Catheterise the patient for a clean specimen before making any decisions"],
    a: 0,
    r: "Asymptomatic bacteriuria is present in 25-50% of elderly women in long-term care and should not be routinely treated per IDSA and Choosing Wisely Canada guidelines. Positive urinalysis in this population does not confirm UTI as the cause of delirium. A thorough delirium workup should assess for other causes: medication changes (anticholinergics, opioids, benzodiazepines), constipation, pain, dehydration, environmental changes, and other infections (pneumonia). Fluoroquinolones should be avoided in the elderly due to CNS and tendon adverse effects. Without systemic signs (fever, haemodynamic instability), urosepsis is unlikely. Catheterisation introduces infection risk.",
    s: "Geriatric"
  },
  {
    q: "A 56-year-old male with type 2 diabetes, hypertension, and CKD stage 3a (eGFR 52) presents for medication review. Current medications: metformin 1000 mg BID, glyburide 10 mg daily, amlodipine 10 mg daily. HbA1c is 8.1%, BP 138/82. Spot urine ACR is 15 mg/mmol. What medication change should the NP prioritize?",
    o: ["Discontinue glyburide (increased hypoglycaemia risk in CKD) and add an SGLT2 inhibitor or GLP-1 receptor agonist for glycaemic control plus renal and cardiovascular protection", "Increase glyburide to 15 mg daily for better glycaemic control", "Add insulin glargine 10 units at bedtime without changing oral agents", "Switch amlodipine to hydrochlorothiazide for better BP control"],
    a: 0,
    r: "Glyburide is contraindicated in CKD due to accumulation of active metabolites causing prolonged severe hypoglycaemia. Discontinuation is the priority. Replacing with an SGLT2 inhibitor (empagliflozin, dapagliflozin) or GLP-1 RA (semaglutide, liraglutide) provides glycaemic control while offering proven renal and cardiovascular protection in patients with CKD and diabetes. Adding an ACEi/ARB for the albuminuria (ACR 15 mg/mmol) should also be considered. Increasing glyburide worsens hypoglycaemia risk. Adding insulin without removing the dangerous agent perpetuates risk. Thiazides are less effective at eGFR <50 and don't address the glycaemic medication concern.",
    s: "Endocrine"
  },
  {
    q: "A 33-year-old female presents requesting contraception. She has a history of migraine with aura occurring 2-3 times per month. She is a non-smoker with normal BMI and BP. She prefers an oral method. Which contraceptive is most appropriate?",
    o: ["Progestin-only pill (norethindrone or desogestrel), as combined hormonal contraceptives are contraindicated in migraine with aura due to increased stroke risk", "Combined oral contraceptive with 35 mcg ethinyl estradiol", "Combined oral contraceptive with 20 mcg ethinyl estradiol as the low dose is safe", "Transdermal combined hormonal patch"],
    a: 0,
    r: "Migraine with aura is a WHO Medical Eligibility Criteria (MEC) Category 4 contraindication for combined hormonal contraceptives (pills, patch, ring) due to a 2-4 fold increased risk of ischaemic stroke. The increased stroke risk applies regardless of the estrogen dose, so both 35 mcg and 20 mcg formulations are contraindicated, as is the transdermal patch. Progestin-only methods (POP, implant, hormonal IUD, DMPA) are MEC Category 2 (advantages outweigh risks) and are safe options. If she prefers oral contraception, a progestin-only pill is appropriate.",
    s: "Reproductive"
  },
  {
    q: "A 60-year-old male presents for a periodic health examination. He has hypertension controlled with ramipril and a BMI of 31. He is asymptomatic. According to the Canadian Cardiovascular Society, when should lipid screening be performed?",
    o: ["Lipid screening is recommended for all men aged 40 and over, and for anyone with cardiovascular risk factors regardless of age, so screening should be performed at this visit", "Lipid screening is only indicated after a cardiac event", "Screen only if the patient requests it or has a family history of hyperlipidaemia", "Lipid screening should begin at age 75 for men"],
    a: 0,
    r: "CCS guidelines recommend lipid screening for all men ≥40 years (and women ≥40 or postmenopausal), and for anyone with cardiovascular risk factors (hypertension, diabetes, obesity, smoking, family history) regardless of age. This 60-year-old male with hypertension and obesity clearly meets screening criteria. A non-fasting lipid panel (total cholesterol, LDL, HDL, triglycerides, non-HDL) and Framingham Risk Score or modified score should be obtained. Waiting for a cardiac event represents missed prevention opportunity. Age 75 initiation is not consistent with any Canadian guideline.",
    s: "Cardiovascular"
  },
  {
    q: "A 7-month-old infant is brought for a well-baby visit. The mother asks when she should introduce allergenic foods such as peanut products and eggs. The infant has mild eczema but no known food allergies. What is the current Canadian Paediatric Society recommendation?",
    o: ["Introduce common allergenic foods around 6 months of age and no later than 12 months, as early introduction reduces allergy risk, including for infants with mild eczema", "Delay all allergenic foods until age 3 years to prevent allergies", "Refer to an allergist for skin prick testing before any allergenic food introduction", "Introduce one new food per month starting at age 12 months"],
    a: 0,
    r: "CPS guidelines (aligned with LEAP and EAT study evidence) recommend introducing common allergenic foods (peanut, egg, milk, wheat, soy, tree nuts, fish, shellfish, sesame) at around 6 months but not before 4 months, and no later than 12 months. Early introduction reduces the risk of developing food allergies. Infants with mild eczema are at slightly higher risk for food allergy and benefit most from early introduction. Delaying allergenic foods beyond 12 months increases allergy risk. Allergy testing is recommended before introduction only for infants with severe eczema or existing food allergy.",
    s: "Pediatric"
  },
  {
    q: "A 45-year-old female presents with a 2 cm erythematous, scaling plaque with well-defined borders on her right elbow. She reports similar lesions on her knees and scalp that have been present intermittently for years. There is no joint pain. What is the most likely diagnosis and initial treatment?",
    o: ["Psoriasis; initial treatment with high-potency topical corticosteroid (betamethasone) for body lesions and moderate-potency for facial or flexural areas", "Contact dermatitis; prescribe oral prednisone taper", "Tinea corporis; prescribe oral terbinafine for 6 weeks", "Squamous cell carcinoma; urgent referral for excisional biopsy"],
    a: 0,
    r: "The presentation is classic plaque psoriasis: well-demarcated, erythematous, scaling plaques in typical distribution (elbows, knees, scalp) with a chronic relapsing course. First-line treatment for limited plaque psoriasis (<10% BSA) is topical therapy: high-potency corticosteroids (betamethasone dipropionate) for trunk/extremity lesions, with lower potency for face/flexures. Topical vitamin D analogues (calcipotriol) can be added. Contact dermatitis is typically pruritic with less well-defined borders. Tinea corporis has an active advancing border with central clearing. SCC presents as a single progressive lesion, not chronic relapsing bilateral plaques.",
    s: "Dermatology"
  },
  {
    q: "A 55-year-old male with well-controlled type 2 diabetes and hypertension presents with a spot urine albumin-to-creatinine ratio of 8 mg/mmol (normal <2 mg/mmol in males) on two separate occasions. eGFR is 72 mL/min. He is currently on amlodipine 5 mg daily for blood pressure. What medication change should the NP prioritize?",
    o: ["Initiate an ACE inhibitor or ARB as first-line for diabetic nephropathy with albuminuria, given their proven renoprotective effects independent of blood pressure reduction", "Continue amlodipine and add hydrochlorothiazide for additional BP lowering", "No change needed as the eGFR is still normal", "Start spironolactone as first-line therapy for albuminuria"],
    a: 0,
    r: "Confirmed albuminuria (ACR >2 mg/mmol on two occasions) in a diabetic patient indicates diabetic nephropathy. ACE inhibitors or ARBs are first-line regardless of blood pressure, as they reduce intraglomerular pressure and proteinuria through efferent arteriolar dilation, providing renoprotection beyond BP lowering. Diabetes Canada and KDIGO guidelines strongly recommend RAAS blockade in this setting. Adding hydrochlorothiazide provides BP lowering but not specific renoprotection. Normal eGFR does not negate the albuminuria concern, as albuminuria is an early marker preceding GFR decline. Spironolactone is adjunctive, not first-line.",
    s: "Renal"
  },
  {
    q: "A 38-year-old male presents to the emergency department with severe retrosternal chest pain radiating to the back, diaphoresis, and nausea. The pain started suddenly 1 hour ago. He has a history of Marfan syndrome. BP is 168/94 in the right arm and 122/76 in the left arm. HR 108. ECG shows sinus tachycardia without ST changes. What is the most critical diagnosis to exclude?",
    o: ["Acute aortic dissection, given the Marfan syndrome, tearing chest pain radiating to the back, and >20 mmHg inter-arm blood pressure differential", "Acute myocardial infarction", "Pulmonary embolism", "Acute pericarditis"],
    a: 0,
    r: "The presentation is highly concerning for acute aortic dissection: sudden severe chest/back pain in a patient with Marfan syndrome (a connective tissue disorder predisposing to aortic root dilation and dissection), with a significant inter-arm blood pressure differential (>20 mmHg suggesting aortic arch involvement). CT angiography of the aorta is the diagnostic test of choice. While MI must be considered, the normal ECG and inter-arm BP difference point to dissection. PE causes dyspnoea predominantly. Pericarditis causes positional pleuritic pain without BP differential. Misdiagnosing dissection as MI and giving thrombolytics or anticoagulants can be fatal.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old female post-total knee replacement on day 2 develops acute-onset dyspnoea, pleuritic chest pain, and tachycardia despite prophylactic enoxaparin. SpO2 is 91%. The NP suspects pulmonary embolism. What is the most appropriate diagnostic approach?",
    o: ["CT pulmonary angiography, as the high clinical probability bypasses the need for D-dimer testing in post-surgical patients", "D-dimer level as the initial screening test", "Chest X-ray as the definitive diagnostic test", "Ventilation-perfusion scan only if CT is unavailable"],
    a: 0,
    r: "In a post-surgical patient with high clinical probability of PE (recent major surgery, immobilisation, acute dyspnoea, tachycardia, hypoxia), D-dimer testing is not useful because it will be elevated post-operatively regardless of PE, and the high pretest probability mandates definitive imaging. CTPA is the gold-standard investigation with high sensitivity and specificity. Chest X-ray is insufficient to diagnose or exclude PE. V/Q scan is an alternative when CTPA is contraindicated (contrast allergy, severe renal impairment) but CTPA is preferred first-line. Despite prophylactic anticoagulation, PE can still occur post-arthroplasty.",
    s: "Respiratory"
  },
  {
    q: "A 19-year-old female presents with a sore throat, fever of 39.2°C, tonsillar exudates, and tender anterior cervical lymphadenopathy for 3 days. She has no cough, rhinorrhoea, or conjunctivitis. Centor score is 4. What is the most appropriate management?",
    o: ["Perform a rapid strep test or throat culture; if positive, treat with penicillin V or amoxicillin for 10 days for Group A Streptococcal pharyngitis", "Prescribe broad-spectrum antibiotics immediately without testing", "Recommend symptom management only as this is likely viral", "Order a CT neck to evaluate for peritonsillar abscess"],
    a: 0,
    r: "A Centor score of 4 (fever, tonsillar exudates, tender anterior cervical lymphadenopathy, absence of cough) indicates a high probability of GAS pharyngitis (~50-60%). Canadian guidelines recommend confirmatory testing (rapid antigen detection test or throat culture) before antibiotics, even with high Centor scores, to avoid unnecessary antibiotic use. If confirmed, penicillin V or amoxicillin for 10 days is first-line to prevent rheumatic fever. Empiric broad-spectrum antibiotics promote resistance. With a Centor score of 4, symptom management alone risks missing GAS. CT neck is indicated only with asymmetric tonsillar swelling or trismus suggesting peritonsillar abscess.",
    s: "Infectious Disease"
  },
  {
    q: "A 52-year-old female presents with a 3-month history of bilateral hand pain and stiffness worst in the morning, lasting approximately 90 minutes. She has swelling of the MCPs and PIPs bilaterally with symmetric distribution. She reports fatigue and malaise. What initial investigations should the NP order?",
    o: ["RF, anti-CCP antibodies, ESR, CRP, and X-rays of hands and feet to evaluate for rheumatoid arthritis", "ANA and anti-dsDNA antibodies to evaluate for lupus", "Serum uric acid to evaluate for gout", "HLA-B27 testing for ankylosing spondylitis"],
    a: 0,
    r: "This presentation is classic for rheumatoid arthritis: symmetric inflammatory polyarthritis of small joints (MCPs, PIPs) with prolonged morning stiffness (>60 minutes), fatigue, and malaise. The appropriate workup includes rheumatoid factor, anti-CCP antibodies (more specific for RA), inflammatory markers (ESR, CRP), and baseline X-rays of hands and feet to assess for erosive changes. Early referral to rheumatology is essential for disease-modifying therapy. ANA/anti-dsDNA is for lupus, which typically presents with additional systemic features. Uric acid is for gout, which is typically monoarticular and asymmetric. HLA-B27 is relevant for spondyloarthropathies, not symmetric peripheral polyarthritis.",
    s: "Musculoskeletal"
  },
  {
    q: "A 75-year-old male with moderate Alzheimer dementia is brought by his wife who reports increasing agitation and verbal aggression in the evenings over the past month. There has been no change in medications, environment, or routine. He has no signs of pain, infection, constipation, or urinary retention on examination. The NP wants to manage the behavioural symptoms. What is the most appropriate initial approach?",
    o: ["Non-pharmacological interventions first: structured daily routine, adequate lighting in the evening, redirection techniques, calming music, and caregiver education about sundowning", "Prescribe haloperidol 2 mg at bedtime for immediate sedation", "Prescribe lorazepam 1 mg as needed for agitation", "Prescribe donepezil 10 mg daily if not already on a cholinesterase inhibitor"],
    a: 0,
    r: "Evening agitation in dementia (sundowning) should first be managed with non-pharmacological interventions per CCS/CCCDTD guidelines. Structured routines, adequate evening lighting, redirection, music therapy, and caregiver education are first-line. Antipsychotics (haloperidol) carry black box warnings for increased mortality in elderly dementia patients and should only be considered when non-pharmacological measures fail and symptoms cause risk of harm. Benzodiazepines increase fall risk, confusion, and paradoxical agitation in the elderly. Cholinesterase inhibitors may help cognition overall but are not targeted treatments for acute behavioural disturbance.",
    s: "Geriatric"
  }
];
