import { getAssetUrl } from "@/lib/asset-url";
import type { FlashcardData } from "./flashcards-rpn";
import { imgUlcerativeColitis, imgVonWillebrand, imgSIADH, imgSickleCellCrisis, imgVitiligo, imgUrethralStricture, imgVestibularNeuritis, imgAddisons, imgBPH, imgPancreatitis, imgOsteoporosis, imgCellulitis, imgCKD, imgClubfoot, imgCompartmentSyndrome, imgConjunctivitis, imgContracture, imgCushings, imgDelayedHemolyticReaction, imgDevHipDysplasia, imgDiabetes, imgDiabetesInsipidus, imgDiabeticNephropathy, imgDIC, imgDisuseAtrophy, imgDuchenne, imgEpiglottitis, imgEpistaxis, imgErysipelas, imgGlaucoma, imgGlomerulonephritis, imgGravesDisease, imgHashimotoThyroiditis, imgForeignBodyAspiration, imgFibromyalgia, imgHemolyticUremicSyndrome, imgNeuroblastoma, imgPyloricStenosis, imgPlacentaPrevia, imgSerotoninSyndrome, imgTonsillectomy, imgMastitis, imgLeadPoisoning, imgLeukemia, imgLungCancer, imgMeconiumAspiration, imgMeconiumIleus, imgMeningitisNew, imgMetabolicSyndrome, imgMRSA, imgLochia, imgCongenitalHypothyroidism, imgInfantReflexes, imgSucralfate, imgSyndactyly, imgSyringomyelia, imgTardiveDyskinesia, imgTetanus, imgThalassemiaV2, imgThermoregulationV2, imgThrombocytopeniaV2, imgThyroidStormV2, imgTinnitus, imgTonsillectomyV2, imgTraction, imgTrigeminalNeuralgia, imgTrisomy21V2, imgTSS, imgTumorMarkers, imgTurnerSyndromeV2, imgTURP, imgHepatitisB, imgDKA, imgDysphagia, imgEBV, imgEctopicPregnancy, imgEndocarditisFlashcard, imgEndometriosis, imgEnteralFeeding } from "./flashcards-rpn";
import { imgStroke, imgProstatitis, imgRotavirus, imgRubella, imgScarletFever, imgShortBowelV4, imgSJSV2, imgSkinAssessment, imgSpinalStenosisV3, imgSprain, imgEsophagealStricture, imgScabiesV3 } from "./flashcards-rpn";
import { imgHIV, imgHepatitisNew } from "./flashcards-rpn";
import { imgBariatricFlashcard, imgBBBFlashcard } from "./flashcards-rpn";

const imgMenopause = getAssetUrl("menopause_1773374978769.png");
const imgImpetigo = getAssetUrl("impetigo_1773340649073.png");
const imgIntestinalMalrotation = getAssetUrl("intestinalmalrotation_1773340649073.png");
const imgHypothyroidismNew = getAssetUrl("hypothyroidism_1773374939606.png");
const imgHepatitisC = getAssetUrl("hepatitisc_1773340513136.png");
const imgGestationalDiabetes = getAssetUrl("gestationaldiabetes_1773340513136.png");
const illustrationShinglesV2 = getAssetUrl("shingles-v2.png");
const illustrationRetinalDetachmentV2 = getAssetUrl("retinal-detachment-v2.png");
const illustrationRheumatoidArthritis = getAssetUrl("rheumatoid-arthritis.png");
const imgAntepartum = getAssetUrl("antepartum_1773340419064.png");
const imgAnxiety = getAssetUrl("anxiety_1773374656571.png");
const imgAPGAR = getAssetUrl("APGAR_1773340419064.png");
const imgChlamydia = getAssetUrl("chlamydia_1773340419064.png");
const imgDepression = getAssetUrl("depression_1773340419064.png");
const imgPharyngitis = getAssetUrl("pharyngitis_1773269379973.png");
const imgPCOS = getAssetUrl("pcos_1773375118294.png");
const imgPeripheralNeuropathy = getAssetUrl("peripheralneuropathy_1773375118294.png");


export const npFlashcards: FlashcardData[] = [
  // ============================================================
  // ADVANCED PHARMACOLOGY (20 cards)
  // ============================================================
  {
    id: "np-pharm-q1",
    type: "question",
    question: "A 62-year-old male with HFrEF (EF 30%) is currently on lisinopril 20 mg daily and carvedilol 25 mg BID. His latest BNP is 1,200 pg/mL. Which medication change aligns with current GDMT guidelines to reduce mortality?",
    options: ["Switch lisinopril to losartan", "Replace lisinopril with sacubitril/valsartan (Entresto)", "Add amlodipine for afterload reduction", "Increase carvedilol to 50 mg BID"],
    correctIndex: 1,
    answer: "ACC/AHA guidelines recommend replacing ACEi/ARB with sacubitril/valsartan (ARNI) in patients with HFrEF who remain symptomatic on optimal doses of ACEi, beta-blocker, and MRA. The PARADIGM-HF trial demonstrated a 20% relative risk reduction in cardiovascular death and HF hospitalization. Must wash out ACEi for 36 hours before starting ARNI to prevent angioedema. Contraindicated in patients with a history of angioedema.",
    category: "Advanced Pharmacology",
    difficulty: 3,
    optionRationales: [
      "Switching from lisinopril to losartan is a lateral move within the RAAS blockade class (ACEi to ARB) and does not provide the additional mortality benefit of an ARNI. This switch would be appropriate if the patient developed ACEi-related cough, but the question asks about optimizing GDMT for mortality reduction.",
      "",
      "Amlodipine is a dihydropyridine CCB that reduces afterload but has no mortality benefit in HFrEF. While amlodipine is safe in heart failure (unlike verapamil and diltiazem), adding it does not address the guideline-directed need for ARNI therapy in symptomatic HFrEF.",
      "Increasing carvedilol to 50 mg BID is appropriate titration to target dose, but it does not replace the need for ARNI therapy. The four pillars of GDMT for HFrEF are: ARNI (or ACEi/ARB), beta-blocker, MRA, and SGLT2 inhibitor. This patient needs ARNI optimization as the priority change."
    ],
    clinicalPearl: "The four pillars of GDMT for HFrEF (remember: 'ABMS') are: ARNI (sacubitril/valsartan), Beta-blocker (carvedilol, metoprolol succinate, or bisoprolol), MRA (spironolactone or eplerenone), and SGLT2 inhibitor (dapagliflozin or empagliflozin). All four have Class I evidence for mortality reduction. When switching from ACEi to ARNI, the 36-hour washout is critical to prevent life-threatening angioedema."
  },
  {
    id: "np-pharm-q2",
    type: "question",
    question: "A patient on warfarin for atrial fibrillation has a supratherapeutic INR of 9.2 with no bleeding. Which intervention is most appropriate?",
    options: ["Continue warfarin and recheck INR in 1 week", "Hold warfarin, administer oral vitamin K 2.5-5 mg, recheck INR in 24-48 hours", "Administer IV vitamin K 10 mg and fresh frozen plasma", "Switch immediately to rivaroxaban"],
    correctIndex: 1,
    answer: "For INR >9.0 without significant bleeding, the 2012 ACCP guidelines recommend holding warfarin and administering oral vitamin K 2.5-5 mg. IV vitamin K and FFP are reserved for active bleeding or INR >10 with high bleeding risk. The NP should investigate causes: medication interactions (azole antifungals, fluoroquinolones, amiodarone), dietary changes, liver dysfunction, or acute illness. Recheck INR in 24-48 hours and restart at a reduced dose.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q3",
    type: "question",
    question: "An NP is prescribing an antidepressant for a 45-year-old woman with comorbid major depression and chronic neuropathic pain. Which medication addresses both conditions?",
    options: ["Sertraline (Zoloft)", "Duloxetine (Cymbalta)", "Bupropion (Wellbutrin)", "Mirtazapine (Remeron)"],
    correctIndex: 1,
    answer: "Duloxetine is an SNRI with FDA approval for both major depressive disorder and several chronic pain conditions (diabetic peripheral neuropathy, fibromyalgia, chronic musculoskeletal pain). Its dual serotonin and norepinephrine reuptake inhibition modulates descending pain inhibition pathways. Starting dose 30 mg daily for 1 week, then increase to 60 mg. Maximum 120 mg/day. Contraindicated with MAOIs and in hepatic insufficiency.",
    category: "Advanced Pharmacology",
    difficulty: 2,
    image: imgPeripheralNeuropathy
  },
  {
    id: "np-pharm-q4",
    type: "question",
    question: "A 55-year-old patient with type 2 diabetes, CKD stage 3b (eGFR 38), and established ASCVD is on metformin 1000 mg BID. Which additional medication provides the greatest cardiovascular and renal benefit?",
    options: ["Glipizide 5 mg daily", "Empagliflozin 10 mg daily", "Pioglitazone 30 mg daily", "Sitagliptin 50 mg daily"],
    correctIndex: 1,
    answer: "SGLT2 inhibitors (empagliflozin, dapagliflozin) have demonstrated significant cardiovascular benefit (EMPA-REG OUTCOME, DECLARE-TIMI 58) and renal protection (CREDENCE, DAPA-CKD) independent of glucose lowering. They reduce MACE, HF hospitalization, and CKD progression. Empagliflozin can be used down to eGFR 20 mL/min for cardiorenal protection (not for glycemic control below 30). Monitor for euglycemic DKA, genital mycotic infections, and volume depletion.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q5",
    type: "question",
    question: "A 28-year-old woman with epilepsy controlled on valproic acid wants to conceive. What is the NP's priority pharmacological concern?",
    options: ["Valproic acid has no teratogenic effects", "Valproic acid is a known teratogen (Category X) associated with neural tube defects; transition to a safer alternative before conception", "Increase the valproic acid dose during pregnancy", "Add phenobarbital as adjunct therapy"],
    correctIndex: 1,
    answer: "Valproic acid has the highest teratogenic risk of all antiepileptic drugs (AEDs): 7-10% risk of major congenital malformations including spina bifida, cardiac defects, cleft palate, and cognitive impairment. The NP should transition to a safer AED (lamotrigine or levetiracetam have the lowest teratogenic risk) well before conception. High-dose folic acid (4-5 mg/day) should be started 1-3 months before conception. Abrupt discontinuation of any AED risks seizure recurrence.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q6",
    type: "question",
    question: "An NP is prescribing a GLP-1 receptor agonist for a patient with type 2 diabetes and BMI 38. Which counseling point is most critical?",
    options: ["This medication commonly causes weight gain", "GLP-1 RAs carry a boxed warning for risk of thyroid C-cell tumors; contraindicated in personal/family history of medullary thyroid carcinoma or MEN 2", "The medication can be taken with or without food at any time", "GLP-1 RAs are safe in combination with insulin secretagogues without dose adjustment"],
    correctIndex: 1,
    answer: "All GLP-1 receptor agonists (semaglutide, liraglutide, dulaglutide, exenatide) carry a boxed warning about thyroid C-cell tumor risk based on animal studies. They are absolutely contraindicated in patients with personal or family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN 2). Patients should report neck lumps, dysphagia, dyspnea, or persistent hoarseness. When combining with sulfonylureas or insulin, reduce those doses to prevent hypoglycemia.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-q7",
    type: "question",
    question: "A patient on long-term prednisone 20 mg daily develops osteoporosis (T-score -2.8). Which prophylactic medication should the NP have initiated at the start of glucocorticoid therapy?",
    options: ["Calcium and vitamin D supplementation only", "Bisphosphonate therapy (alendronate) along with calcium and vitamin D", "Denosumab as first-line prevention", "No prophylaxis is needed for doses under 40 mg"],
    correctIndex: 1,
    answer: "ACR guidelines recommend initiating osteoporosis prevention in ALL adults expected to receive glucocorticoids ≥2.5 mg prednisone equivalent for ≥3 months. First-line: oral bisphosphonate (alendronate 70 mg weekly or risedronate 35 mg weekly) PLUS calcium 1,000-1,200 mg/day and vitamin D 600-800 IU/day. FRAX score should be calculated. For high fracture risk or bisphosphonate contraindication, consider teriparatide or denosumab. Baseline and follow-up DEXA scans are essential.",
    category: "Advanced Pharmacology",
    difficulty: 2,
    image: imgOsteoporosis
  },
  {
    id: "np-pharm-q8",
    type: "question",
    question: "An NP is managing a patient with COPD who has frequent exacerbations despite tiotropium and an ICS/LABA combination. FEV1 is 38% predicted, eosinophils are 85 cells/μL. What is the next step?",
    options: ["Add roflumilast (PDE4 inhibitor)", "Switch to triple therapy (ICS/LABA/LAMA) and consider adding roflumilast", "Discontinue ICS as eosinophils are low", "Add oral theophylline"],
    correctIndex: 1,
    answer: "GOLD 2024 guidelines recommend escalating to triple therapy (ICS/LABA/LAMA) for patients with persistent exacerbations on dual therapy. With low eosinophils (<100), the benefit of ICS is questionable but continuing while adding roflumilast is reasonable for exacerbation reduction. Roflumilast (PDE4 inhibitor) is indicated for severe COPD (FEV1 <50%) with frequent exacerbations and chronic bronchitis phenotype. Side effects include diarrhea, weight loss, and psychiatric symptoms.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q9",
    type: "question",
    question: "A patient presents with acute gout flare. The patient has CKD stage 4 (eGFR 22) and heart failure. Which medication is the safest first-line treatment?",
    options: ["Indomethacin 50 mg TID", "Colchicine 1.2 mg followed by 0.6 mg one hour later", "Prednisone 40 mg daily for 5 days", "Allopurinol 300 mg to lower uric acid immediately"],
    correctIndex: 2,
    answer: "In patients with CKD and heart failure, NSAIDs are contraindicated (worsen renal function and fluid retention), and colchicine requires significant dose reduction and is risky with eGFR <30. Systemic corticosteroids (prednisone 30-40 mg/day for 5-7 days with taper) are the safest option. Allopurinol should NEVER be started during an acute flare as it can worsen and prolong the attack by mobilizing uric acid deposits. Intra-articular corticosteroid injection is also safe if monoarticular.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q10",
    type: "question",
    question: "A 70-year-old patient with persistent atrial fibrillation and a CHA₂DS₂-VASc score of 5 has a creatinine clearance of 20 mL/min. Which anticoagulant requires the most careful dose adjustment?",
    options: ["Warfarin", "Apixaban 2.5 mg BID (dose-reduced)", "Dabigatran 150 mg BID", "Rivaroxaban 20 mg daily"],
    correctIndex: 2,
    answer: "Dabigatran is 80% renally cleared and is CONTRAINDICATED when CrCl <30 mL/min (USA labeling) or <15 mL/min (European labeling). With CrCl 20, dabigatran should not be used. Apixaban has the least renal dependence (27% renal clearance) and can be dose-reduced to 2.5 mg BID if ≥2 of 3 criteria met: age ≥80, weight ≤60 kg, or creatinine ≥1.5. Rivaroxaban should be avoided below CrCl 15. Warfarin remains an option but requires INR monitoring.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q11",
    type: "question",
    question: "An NP is managing a patient with treatment-resistant hypertension (on maximized doses of an ACEi, CCB, and thiazide diuretic). BP is 158/94. What is the recommended fourth-line agent?",
    options: ["Another ACE inhibitor at higher dose", "Spironolactone 25-50 mg daily", "Clonidine 0.1 mg BID", "Hydralazine 25 mg TID"],
    correctIndex: 1,
    answer: "The PATHWAY-2 trial established spironolactone as the most effective fourth-line agent for resistant hypertension, superior to bisoprolol and doxazosin. Spironolactone addresses the underlying excess aldosterone that contributes to treatment resistance. Monitor potassium closely (risk of hyperkalemia, especially with ACEi). Contraindicated if K+ >5.0 or eGFR <30. Eplerenone is an alternative with fewer anti-androgenic side effects (gynecomastia).",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q12",
    type: "question",
    question: "A 35-year-old woman with migraines averaging 10 headache days per month asks about preventive therapy. She has a BMI of 32 and depression. Which preventive medication addresses all three concerns?",
    options: ["Propranolol 80 mg daily", "Topiramate 100 mg daily", "Amitriptyline 25 mg at bedtime", "Verapamil 240 mg daily"],
    correctIndex: 1,
    answer: "Topiramate is FDA-approved for migraine prevention and uniquely causes weight loss (beneficial for BMI 32). It has some evidence for mood stabilization. Starting dose 25 mg daily, titrate to 50-100 mg BID. However, it is teratogenic (Category D) so contraception must be discussed, and it reduces oral contraceptive efficacy. Side effects include cognitive slowing ('dopamax'), paresthesias, metabolic acidosis, and nephrolithiasis. An alternative is the CGRP monoclonal antibodies if she cannot tolerate topiramate.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-q13",
    type: "question",
    question: "A patient on methotrexate 15 mg weekly for rheumatoid arthritis develops a persistent dry cough, progressive dyspnea, and bilateral ground-glass opacities on chest CT. What complication does the NP suspect?",
    options: ["Community-acquired pneumonia", "Methotrexate-induced pneumonitis", "Heart failure exacerbation", "Pulmonary embolism"],
    correctIndex: 1,
    answer: "Methotrexate-induced pneumonitis is a potentially life-threatening hypersensitivity reaction occurring in 2-8% of patients, typically within the first year of therapy. It presents with dry cough, dyspnea, fever, and bilateral ground-glass or reticular opacities. Diagnosis requires excluding infection (PCP, CMV). Treatment: immediately discontinue methotrexate, start systemic corticosteroids, and provide supportive care. The patient should never be rechallenged with methotrexate. Consider alternative DMARDs.",
    category: "Advanced Pharmacology",
    difficulty: 3,
    image: illustrationRheumatoidArthritis
  },
  {
    id: "np-pharm-q14",
    type: "question",
    question: "An NP is initiating thyroid replacement in a 78-year-old patient with newly diagnosed hypothyroidism (TSH 45, fT4 0.3) and known coronary artery disease. What is the appropriate starting dose of levothyroxine?",
    options: ["Full replacement dose of 1.6 mcg/kg/day", "12.5-25 mcg daily with slow titration every 6-8 weeks", "100 mcg daily to normalize TSH quickly", "Liothyronine (T3) 25 mcg daily for faster effect"],
    correctIndex: 1,
    answer: "In elderly patients with CAD, thyroid replacement must start at a very low dose (12.5-25 mcg/day) and be titrated slowly (increase by 12.5-25 mcg every 6-8 weeks). Rapid correction increases myocardial oxygen demand and can precipitate angina, MI, or arrhythmias. The goal is gradual normalization of TSH over months. Full-dose replacement (1.6 mcg/kg) is only appropriate for young, healthy adults. T3 preparations cause more cardiac stress due to their rapid onset.",
    category: "Advanced Pharmacology",
    difficulty: 2,
    image: imgHypothyroidismNew
  },
  {
    id: "np-pharm-q15",
    type: "question",
    question: "A patient with community-acquired pneumonia has a CURB-65 score of 2. The NP decides on outpatient treatment. Which antibiotic regimen is appropriate per ATS/IDSA guidelines?",
    options: ["Amoxicillin 1 g TID for 7 days", "Respiratory fluoroquinolone (levofloxacin 750 mg daily) OR amoxicillin/clavulanate PLUS a macrolide", "Cephalexin 500 mg QID for 14 days", "TMP-SMX DS BID for 10 days"],
    correctIndex: 1,
    answer: "For CAP with comorbidities (CURB-65 ≥2), ATS/IDSA 2019 guidelines recommend either: (1) respiratory fluoroquinolone monotherapy (levofloxacin or moxifloxacin), OR (2) beta-lactam (amoxicillin/clavulanate or ceftriaxone) PLUS macrolide (azithromycin or doxycycline). Amoxicillin monotherapy is reserved for low-risk patients without comorbidities. Duration is minimum 5 days with clinical stability criteria met before stopping. Consider local resistance patterns.",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-pharm-q16",
    type: "question",
    question: "A patient on clozapine develops constipation that has progressed to no bowel movement for 5 days and abdominal distension. How should the NP manage this?",
    options: ["This is a minor side effect; recommend fiber supplementation", "Clozapine-induced ileus is a medical emergency; obtain stat abdominal imaging, hold clozapine, and initiate aggressive bowel protocol", "Switch to olanzapine which has no GI side effects", "Prescribe loperamide to slow motility"],
    correctIndex: 1,
    answer: "Clozapine-induced constipation can progress to life-threatening complications including paralytic ileus, bowel obstruction, ischemia, perforation, and sepsis, with a reported mortality rate higher than agranulocytosis. Five days without a bowel movement with distension is a medical emergency requiring stat abdominal X-ray, holding clozapine, and aggressive bowel management (stimulant laxatives, enemas, possible surgical consultation). Proactive bowel regimens should be initiated when starting clozapine.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q17",
    type: "question",
    question: "An NP is prescribing PrEP for HIV prevention. Which medication regimen is approved for PrEP, and what baseline labs are required?",
    options: ["Emtricitabine/tenofovir disoproxil (Truvada) or emtricitabine/tenofovir alafenamide (Descovy); requires documented negative HIV test, renal function, hepatitis B serology, and STI screening", "Any single antiretroviral agent taken as needed", "Dolutegravir/lamivudine taken weekly", "PrEP only requires an HIV test with no other baseline labs"],
    correctIndex: 0,
    answer: "FDA-approved PrEP regimens include Truvada (TDF/FTC) for all at-risk populations and Descovy (TAF/FTC) for men and transgender women (not studied in receptive vaginal sex). Cabotegravir IM injection (Apretude) every 2 months is also approved. Baseline requirements: documented negative HIV-1/2 test (4th gen Ag/Ab), CrCl/eGFR (TDF is nephrotoxic), hepatitis B serology (TDF/FTC treat HBV; discontinuation can cause HBV flare), comprehensive STI screening, and pregnancy test in women.",
    category: "Advanced Pharmacology",
    difficulty: 3,
    image: imgHepatitisNew
  },
  {
    id: "np-pharm-q18",
    type: "question",
    question: "A 65-year-old patient with osteoporosis has been on alendronate for 7 years. Recent DEXA shows stable T-scores at -2.0 hip and -1.8 spine. What should the NP consider?",
    options: ["Continue alendronate indefinitely", "Consider a bisphosphonate holiday of 2-5 years with monitoring, given the risk of atypical femur fractures with prolonged use", "Switch to calcium supplements only", "Discontinue all osteoporosis treatment permanently"],
    correctIndex: 1,
    answer: "After 5+ years of bisphosphonate therapy, a drug holiday should be considered in patients at moderate fracture risk with stable or improved DEXA scores. Prolonged use increases risk of atypical femoral fractures and osteonecrosis of the jaw. Bisphosphonates persist in bone for years, providing residual benefit during holidays. High-risk patients (prior fragility fracture, T-score ≤ -2.5) may benefit from longer treatment or transition to anabolic agents (teriparatide, romosozumab). Reassess with DEXA in 2-3 years during holiday.",
    category: "Advanced Pharmacology",
    difficulty: 2,
    image: imgOsteoporosis
  },
  {
    id: "np-pharm-q19",
    type: "question",
    question: "A patient with schizophrenia on olanzapine 20 mg has gained 30 lbs, has fasting glucose 128 mg/dL, and triglycerides 310 mg/dL. What is the NP's best approach?",
    options: ["Continue olanzapine and add metformin for metabolic management", "Consider switching to an antipsychotic with lower metabolic risk (aripiprazole or ziprasidone) if clinically stable", "Discontinue olanzapine abruptly", "Prescribe a stimulant for weight loss"],
    correctIndex: 1,
    answer: "Olanzapine and clozapine carry the highest metabolic risk among antipsychotics. With significant weight gain, prediabetes, and hypertriglyceridemia, switching to a metabolically favorable antipsychotic (aripiprazole, ziprasidone, or lurasidone) should be considered if the patient is psychiatrically stable. The switch must be gradual (cross-taper) to avoid relapse. If olanzapine is the only effective antipsychotic, adding metformin has evidence for weight mitigation. Monitor metabolic parameters per ADA/APA consensus guidelines.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q20",
    type: "question",
    question: "An NP is managing a patient with chronic hepatitis B on tenofovir. The patient wants to stop taking the medication because they feel well. What critical risk must the NP communicate?",
    options: ["There is no risk to stopping antiviral therapy", "Abrupt discontinuation of HBV antivirals can cause severe hepatitis flare with potential liver failure from immune reconstitution and viral rebound", "The medication can be stopped after 6 months of normal liver enzymes", "Switching to interferon is always preferred"],
    correctIndex: 1,
    answer: "Discontinuing nucleos(t)ide analogue therapy for chronic HBV without clear virological endpoints (HBsAg seroconversion, sustained HBV DNA suppression) can trigger severe hepatic flares from immune-mediated destruction of hepatocytes as viral replication rebounds. These flares can be fulminant and fatal. The NP must emphasize lifelong therapy in most cases, especially in cirrhotic patients. If discontinuation is considered in non-cirrhotic patients, close monitoring (ALT, HBV DNA every 1-3 months) for at least 12 months is mandatory.",
    category: "Advanced Pharmacology",
    difficulty: 3,
    image: imgHepatitisNew
  },
  // ============================================================
  // DIFFERENTIAL DIAGNOSIS (20 cards)
  // ============================================================
  {
    id: "np-dx-q1",
    type: "question",
    question: "A 52-year-old woman presents with fatigue, weight gain, cold intolerance, constipation, and dry skin over 6 months. TSH is 12.4, fT4 is 0.6. Her anti-TPO antibodies are elevated. What is the most likely diagnosis?",
    options: ["Subclinical hypothyroidism", "Hashimoto thyroiditis", "Subacute thyroiditis", "Iodine deficiency"],
    correctIndex: 1,
    answer: "Hashimoto thyroiditis (chronic lymphocytic thyroiditis) is the most common cause of hypothyroidism in iodine-sufficient regions. Elevated TSH with low fT4 confirms overt hypothyroidism, and positive anti-TPO antibodies confirm the autoimmune etiology. The disease involves gradual immune-mediated destruction of thyroid tissue. Treatment is levothyroxine replacement titrated to normalize TSH. Subclinical hypothyroidism would show elevated TSH with NORMAL fT4.",
    category: "Differential Diagnosis",
    difficulty: 2,
    image: imgHashimotoThyroiditis
  },
  {
    id: "np-dx-q2",
    type: "question",
    question: "A 30-year-old male presents with acute onset of right-sided pleuritic chest pain and dyspnea. He is tall and thin (BMI 18). CXR shows a visible pleural line with absent lung markings beyond it on the right. What is the diagnosis?",
    options: ["Pneumonia with parapneumonic effusion", "Primary spontaneous pneumothorax", "Pulmonary embolism", "Tension pneumothorax"],
    correctIndex: 1,
    answer: "Tall, thin young males (Marfan habitus) are at increased risk for primary spontaneous pneumothorax due to rupture of apical subpleural blebs. The CXR finding of a visible pleural line with absent lung markings confirms the diagnosis. Small pneumothorax (<2-3 cm) in stable patients can be observed or aspirated. Large or symptomatic pneumothorax requires chest tube thoracostomy. Tension pneumothorax would present with hemodynamic instability and tracheal deviation.",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q3",
    type: "question",
    question: "A 45-year-old woman presents with episodic palpitations, headache, and diaphoresis. During an episode, her BP is 240/130. Between episodes, BP is 128/82. 24-hour urine metanephrines are markedly elevated. What is the diagnosis and what must be ruled out before surgery?",
    options: ["Essential hypertension; no further workup needed", "Pheochromocytoma; rule out MEN 2 syndrome with RET proto-oncogene testing and serum calcium/calcitonin", "Panic disorder with hypertensive response", "Renovascular hypertension from renal artery stenosis"],
    correctIndex: 1,
    answer: "Paroxysmal hypertension with the classic triad (headache, diaphoresis, palpitations) and elevated urinary metanephrines is diagnostic of pheochromocytoma. Before surgical resection, the NP must screen for MEN 2 syndrome (medullary thyroid carcinoma + pheochromocytoma ± parathyroid hyperplasia) with RET proto-oncogene testing, serum calcium, and calcitonin. Preoperative alpha-blockade (phenoxybenzamine 10-14 days) is mandatory before any beta-blockade or surgery.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-dx-q4",
    type: "question",
    question: "A 68-year-old male presents with progressive dyspnea, bilateral lower extremity edema, and a 10-lb weight gain over 2 weeks. JVP is elevated, there are bilateral crackles, and an S3 gallop is present. BNP is 1,850 pg/mL. What is the most likely diagnosis?",
    options: ["Acute coronary syndrome", "Decompensated heart failure (ADHF)", "Chronic obstructive pulmonary disease exacerbation", "Nephrotic syndrome"],
    correctIndex: 1,
    answer: "The constellation of dyspnea, peripheral edema, weight gain, elevated JVP, bilateral crackles, S3 gallop, and markedly elevated BNP (>400 pg/mL) is classic for acute decompensated heart failure. BNP >400 has a positive predictive value >95% for HF. The NP should obtain an echocardiogram to assess EF and classify as HFrEF or HFpEF, which determines treatment strategy. Immediate management includes IV loop diuretics, oxygen, and identification of the precipitant (non-compliance, ACS, arrhythmia).",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q5",
    type: "question",
    question: "A 25-year-old woman presents with bilateral joint pain in the hands and wrists, morning stiffness lasting 3 hours, fatigue, and a malar rash. Labs show positive ANA (1:640, homogeneous pattern), positive anti-dsDNA, low C3/C4, and proteinuria. What is the diagnosis?",
    options: ["Rheumatoid arthritis", "Systemic lupus erythematosus (SLE)", "Dermatomyositis", "Scleroderma"],
    correctIndex: 1,
    answer: "This patient meets multiple ACR/EULAR classification criteria for SLE: malar rash, arthritis, renal involvement (proteinuria suggests lupus nephritis), positive ANA, positive anti-dsDNA (highly specific for SLE), and hypocomplementemia (low C3/C4 indicates immune complex consumption). The NP should quantify proteinuria (24-hour or spot protein/creatinine ratio), assess for other organ involvement, and consider renal biopsy if significant proteinuria is present. Treatment ranges from hydroxychloroquine to immunosuppressives depending on severity.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-dx-q6",
    type: "question",
    question: "A 40-year-old male presents with sudden onset of worst headache of his life, reaching maximum intensity within seconds. He has neck stiffness and photophobia. CT head is normal. What is the next diagnostic step?",
    options: ["Discharge with analgesics for migraine", "Perform a lumbar puncture looking for xanthochromia and RBCs", "Order an MRI of the brain", "Prescribe triptans and follow up in 1 week"],
    correctIndex: 1,
    answer: "Thunderclap headache (worst headache of life, peak within seconds) is subarachnoid hemorrhage until proven otherwise. CT has ~98% sensitivity within 6 hours but decreases with time. A normal CT does NOT rule out SAH. Lumbar puncture is mandatory: xanthochromia (yellow discoloration of CSF from bilirubin degradation of hemoglobin, present >12 hours after bleed) and elevated RBC count in sequential tubes (that do not clear) confirm SAH. If LP is positive, CTA is needed to identify the aneurysm.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-dx-q7",
    type: "question",
    question: "A 58-year-old male with a history of alcohol use disorder presents with confusion, asterixis, jaundice, and spider angiomata. Ammonia level is 142 μmol/L. Albumin is 2.0 g/dL, INR is 2.8, and total bilirubin is 6.5. What stage of his liver disease does this represent?",
    options: ["Compensated cirrhosis", "Decompensated cirrhosis with hepatic encephalopathy", "Acute alcoholic hepatitis without cirrhosis", "Fatty liver disease"],
    correctIndex: 1,
    answer: "Jaundice, coagulopathy (elevated INR), hypoalbuminemia, and hepatic encephalopathy (confusion + asterixis + elevated ammonia) indicate decompensated cirrhosis. The Child-Pugh score helps classify severity: this patient has class C (bilirubin >3, albumin <2.8, INR >2.3, encephalopathy, ascites likely present). Management includes lactulose and rifaximin for encephalopathy, diuretics for ascites, and hepatology referral for transplant evaluation if appropriate. MELD score should be calculated.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-dx-q8",
    type: "question",
    question: "A 22-year-old female presents with intermittent abdominal pain, bloody diarrhea (8-10 times/day), urgency, and tenesmus for 3 weeks. Colonoscopy shows continuous inflammation from the rectum extending to the splenic flexure with pseudopolyps. What is the diagnosis?",
    options: ["Crohn's disease", "Ulcerative colitis (left-sided)", "Irritable bowel syndrome", "Infectious colitis"],
    correctIndex: 1,
    answer: "Continuous mucosal inflammation extending proximally from the rectum with pseudopolyps is pathognomonic for ulcerative colitis. Key differentiators from Crohn's: UC involves ONLY the colon, affects ONLY the mucosa/submucosa, is CONTINUOUS (no skip lesions), and presents with bloody diarrhea (Crohn's typically has non-bloody diarrhea with skip lesions and transmural involvement). Left-sided UC extends to the splenic flexure. Treatment: 5-ASA (mesalamine) for mild-moderate, corticosteroids for flares, biologics for refractory disease.",
    image: imgUlcerativeColitis,
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q9",
    type: "question",
    question: "A 55-year-old postmenopausal woman presents with a unilateral, hard, irregular, fixed breast mass with skin dimpling and bloody nipple discharge. Axillary lymph node is palpable. What is the most likely diagnosis?",
    options: ["Fibroadenoma", "Fibrocystic breast changes", "Breast carcinoma", "Intraductal papilloma"],
    correctIndex: 2,
    answer: "Characteristics highly suspicious for breast carcinoma: postmenopausal onset, unilateral, hard and irregular (versus smooth and mobile for benign), fixed to surrounding tissue, skin dimpling (tumor tethering Cooper's ligaments), bloody nipple discharge, and axillary lymphadenopathy (potential metastatic spread). The NP should order diagnostic mammogram, breast ultrasound, and urgent referral for core needle biopsy. Tissue diagnosis is required before any treatment decisions. BI-RADS 5 classification.",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q10",
    type: "question",
    question: "A 60-year-old diabetic male presents with gradual-onset, painless, unilateral vision loss described as a curtain coming down over his visual field. Fundoscopic exam reveals a pale retina with a cherry-red spot at the macula. What is the diagnosis?",
    options: ["Acute angle-closure glaucoma", "Central retinal artery occlusion (CRAO)", "Retinal detachment", "Diabetic retinopathy"],
    correctIndex: 1,
    answer: "Painless, sudden/gradual unilateral vision loss with a pale retina and cherry-red macula spot is pathognomonic for central retinal artery occlusion (CRAO). The cherry-red spot is the intact choroidal circulation visible through the thin fovea, contrasting with the ischemic pale retina. This is an ophthalmic emergency: permanent vision loss occurs within 90 minutes without treatment. Immediate referral, ocular massage, anterior chamber paracentesis, and evaluation for embolic source (carotid, cardiac) are needed.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-dx-q11",
    type: "question",
    question: "A 35-year-old male presents with recurrent episodes of unilateral headache with lacrimation, rhinorrhea, ptosis, and miosis on the affected side. Episodes last 45-90 minutes and occur 2-3 times daily for weeks, then remit. What type of headache is this?",
    options: ["Migraine with aura", "Cluster headache", "Tension-type headache", "Trigeminal neuralgia"],
    correctIndex: 1,
    answer: "Cluster headaches are characterized by severe unilateral periorbital pain with autonomic features (lacrimation, rhinorrhea, conjunctival injection, ptosis, miosis) occurring in clusters (daily attacks for weeks-months followed by remission). They are more common in males (3:1). Acute treatment: 100% oxygen 12-15 L/min via non-rebreather OR subcutaneous sumatriptan 6 mg. Prevention during cluster periods: verapamil (first-line), short course of prednisone, or lithium.",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q12",
    type: "question",
    question: "A 70-year-old male presents with claudication in both calves that occurs after walking 1 block and resolves with rest. ABI is 0.6 bilaterally. He also has hypertension and hyperlipidemia. What is the diagnosis and initial management?",
    options: ["Spinal stenosis with neurogenic claudication", "Peripheral arterial disease (PAD) with intermittent claudication; cilostazol, supervised exercise, risk factor modification", "Deep vein thrombosis", "Musculoskeletal leg pain"],
    correctIndex: 1,
    answer: "ABI <0.9 confirms PAD; ABI 0.6 indicates moderate disease. Intermittent claudication (reproducible pain with exertion, relieved by rest) is the classic symptom. Management: supervised exercise program (most effective non-pharmacologic intervention), cilostazol 100 mg BID (PDE3 inhibitor, improves walking distance by 50%), aggressive cardiovascular risk factor modification (statin, antiplatelet therapy, BP control, smoking cessation). Differentiate from neurogenic claudication (spinal stenosis): neurogenic is relieved by leaning forward, not just rest.",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-dx-q13",
    type: "question",
    question: "A 28-year-old female presents with progressive proximal muscle weakness, heliotrope rash on the eyelids, and Gottron papules over the MCP and PIP joints. CK is 4,500 U/L. What is the diagnosis and what malignancy screening is recommended?",
    options: ["Polymyalgia rheumatica", "Dermatomyositis; screen for underlying malignancy with age-appropriate cancer screening", "Fibromyalgia", "Systemic lupus erythematosus"],
    correctIndex: 1,
    answer: "Heliotrope rash (violaceous discoloration of the eyelids) and Gottron papules (erythematous plaques over joints) with proximal myopathy and elevated CK are pathognomonic for dermatomyositis. Importantly, adult-onset dermatomyositis carries a 15-30% risk of associated malignancy (ovarian, lung, pancreatic, gastric, colorectal). Comprehensive malignancy screening (CT chest/abdomen/pelvis, age-appropriate cancer screening, ovarian cancer markers) should be performed at diagnosis and periodically. Treatment: systemic corticosteroids and steroid-sparing immunosuppressants.",
    category: "Differential Diagnosis",
    difficulty: 3,
    image: imgFibromyalgia
  },
  {
    id: "np-dx-q14",
    type: "question",
    question: "A 3-year-old child presents with a palpable abdominal mass crossing the midline, hypertension, and periorbital ecchymosis. Urine catecholamine metabolites (VMA and HVA) are elevated. What is the most likely diagnosis?",
    options: ["Wilms tumor", "Neuroblastoma", "Hepatoblastoma", "Polycystic kidney disease"],
    correctIndex: 1,
    answer: "Neuroblastoma is the most common extracranial solid tumor in children, arising from neural crest cells. Key differentiators from Wilms tumor: neuroblastoma crosses the midline (Wilms does not), produces catecholamine metabolites (elevated VMA/HVA), and may present with periorbital ecchymosis ('raccoon eyes' from orbital metastases). Wilms tumor presents as a unilateral flank mass that does NOT cross midline, with hematuria and hypertension. Both tumors cause abdominal masses, but the clinical and lab features distinguish them.",
    category: "Differential Diagnosis",
    difficulty: 3,
    image: imgNeuroblastoma
  },
  // ============================================================
  // DIAGNOSTIC REASONING (18 cards)
  // ============================================================
  {
    id: "np-diag-q1",
    type: "question",
    question: "An NP is evaluating a 50-year-old male with new-onset ascites. The serum-ascites albumin gradient (SAAG) is 1.8 g/dL. What does this indicate about the etiology?",
    options: ["SAAG ≥1.1 indicates portal hypertension as the cause (cirrhosis, heart failure, Budd-Chiari)", "SAAG ≥1.1 indicates peritoneal disease (malignancy, TB peritonitis)", "SAAG has no clinical significance", "A SAAG of 1.8 indicates nephrotic syndrome"],
    correctIndex: 0,
    answer: "SAAG (serum albumin minus ascitic fluid albumin) ≥1.1 g/dL has >97% accuracy for identifying portal hypertension as the cause of ascites. Common causes: cirrhosis (most common), alcoholic hepatitis, heart failure, Budd-Chiari syndrome. SAAG <1.1 suggests peritoneal causes: malignancy (peritoneal carcinomatosis), TB peritonitis, nephrotic syndrome, pancreatitis. Next steps for SAAG ≥1.1: liver evaluation (hepatitis panel, imaging), assess for varices.",
    category: "Diagnostic Reasoning",
    difficulty: 3
  },
  {
    id: "np-diag-q2",
    type: "question",
    question: "A 45-year-old presents with polyuria, polydipsia, and a random glucose of 285 mg/dL. The NP orders a C-peptide and GAD-65 antibodies. C-peptide is undetectable and GAD-65 is positive. What does this indicate?",
    options: ["Type 2 diabetes with insulin resistance", "Latent autoimmune diabetes in adults (LADA/Type 1.5)", "Maturity-onset diabetes of the young (MODY)", "Steroid-induced diabetes"],
    correctIndex: 1,
    answer: "LADA (Latent Autoimmune Diabetes in Adults) is type 1 diabetes with slower onset, typically diagnosed after age 30. Undetectable C-peptide confirms absent endogenous insulin production, and positive GAD-65 antibodies confirm autoimmune beta-cell destruction. Unlike classic type 2, these patients will require insulin (not metformin) as primary therapy. LADA progresses to absolute insulin dependence faster than type 2 but slower than childhood type 1. Sulfonylureas should be avoided as they accelerate beta-cell burnout.",
    category: "Diagnostic Reasoning",
    difficulty: 3
  },
  {
    id: "np-diag-q3",
    type: "question",
    question: "An NP orders a D-dimer for a patient with low pretest probability of PE (Wells score 2). The D-dimer returns at 0.3 μg/mL (normal <0.5). What is the clinical significance?",
    options: ["PE is definitively ruled out; no further workup needed", "D-dimer is negative in a low-probability patient, effectively ruling out PE with high negative predictive value", "CT angiography is still required regardless of D-dimer", "The patient should be anticoagulated empirically"],
    correctIndex: 1,
    answer: "D-dimer has high sensitivity (>95%) but low specificity for VTE. Its primary utility is its negative predictive value: a negative D-dimer in a LOW pretest probability patient (Wells ≤4) effectively rules out PE. However, D-dimer should NOT be used to rule out PE in HIGH pretest probability patients (Wells >4), as false negatives can occur. D-dimer is also elevated in many conditions (surgery, pregnancy, cancer, infection, DIC), limiting its specificity. The age-adjusted D-dimer cutoff (age × 10 for patients >50) improves specificity.",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  {
    id: "np-diag-q4",
    type: "question",
    question: "A patient presents with microcytic anemia (MCV 68, Hgb 9.2). Iron studies show: ferritin 8, TIBC 450, serum iron 25, transferrin saturation 6%. What is the diagnosis?",
    options: ["Anemia of chronic disease", "Iron deficiency anemia", "Thalassemia trait", "Sideroblastic anemia"],
    correctIndex: 1,
    answer: "The iron panel is classic for iron deficiency anemia: low ferritin (depleted stores), high TIBC (body upregulates transferrin to capture more iron), low serum iron, and low transferrin saturation (<20%). This differs from anemia of chronic disease, which shows normal/high ferritin (acute phase reactant), low TIBC, and low iron. Thalassemia trait shows normal iron studies with inappropriately low MCV for the hemoglobin level and elevated Hgb A2 on electrophoresis. The NP should investigate the cause: menorrhagia, GI blood loss (colonoscopy if male or postmenopausal).",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  {
    id: "np-diag-q5",
    type: "question",
    question: "An NP is interpreting a hepatitis panel: HBsAg negative, anti-HBs positive, anti-HBc negative. What does this serologic pattern indicate?",
    options: ["Acute hepatitis B infection", "Chronic hepatitis B infection", "Prior hepatitis B vaccination (immunity from vaccine)", "Resolved natural hepatitis B infection"],
    correctIndex: 2,
    answer: "This pattern indicates immunity from vaccination: anti-HBs positive (the vaccine produces antibodies to surface antigen) with negative HBsAg (no active infection) and negative anti-HBc (no exposure to the actual virus, as core antibody is only produced during natural infection). Resolved natural infection would show: HBsAg negative, anti-HBs positive, anti-HBc positive. Chronic HBV: HBsAg positive for >6 months. Acute HBV: HBsAg positive, IgM anti-HBc positive.",
    category: "Diagnostic Reasoning",
    difficulty: 2,
    image: imgHepatitisNew
  },
  {
    id: "np-diag-q6",
    type: "question",
    question: "A 55-year-old with a 30-pack-year smoking history has a low-dose CT screening that reveals a solitary pulmonary nodule measuring 9 mm with spiculated margins. What is the recommended next step?",
    options: ["No follow-up needed for nodules under 10 mm", "PET scan or tissue sampling given the high-risk features (size, spiculated margins, smoking history)", "Repeat CT in 1 year", "Immediate lobectomy"],
    correctIndex: 1,
    answer: "Fleischner Society and ACCP guidelines stratify nodule management by size, morphology, and risk factors. A 9 mm nodule with spiculated margins in a heavy smoker is high risk for malignancy. Spiculated margins increase malignancy probability to 80-90%. PET-CT (metabolic activity assessment) or CT-guided biopsy is recommended. If PET is positive, tissue diagnosis via biopsy followed by staging is indicated. For solid nodules >8 mm in high-risk patients, 3-month follow-up CT at minimum, but PET or biopsy is preferred.",
    category: "Diagnostic Reasoning",
    difficulty: 3
  },
  {
    id: "np-diag-q7",
    type: "question",
    question: "An NP is evaluating a patient with suspected Cushing syndrome. The patient has moon face, central obesity, purple striae, and proximal muscle weakness. Which is the best initial screening test?",
    options: ["Random serum cortisol", "24-hour urinary free cortisol, late-night salivary cortisol, or 1 mg overnight dexamethasone suppression test", "Serum ACTH level", "MRI of the pituitary gland"],
    correctIndex: 1,
    answer: "The Endocrine Society recommends at least TWO of three screening tests for Cushing syndrome: (1) 24-hour urinary free cortisol (elevated in Cushing), (2) late-night salivary cortisol (loss of diurnal rhythm), or (3) 1 mg overnight dexamethasone suppression test (failure to suppress cortisol below 1.8 μg/dL). Random cortisol is unreliable due to diurnal variation and stress response. ACTH and MRI are used AFTER confirming hypercortisolism to determine the cause (ACTH-dependent vs. independent).",
    category: "Diagnostic Reasoning",
    difficulty: 3,
    image: imgCushings
  },
  {
    id: "np-diag-q8",
    type: "question",
    question: "A patient has an ECG showing ST elevation in leads II, III, and aVF with reciprocal changes in I and aVL. Which coronary artery is most likely occluded?",
    options: ["Left anterior descending (LAD)", "Right coronary artery (RCA)", "Left circumflex artery (LCx)", "Left main coronary artery"],
    correctIndex: 1,
    answer: "ST elevation in leads II, III, aVF indicates an inferior STEMI, which is most commonly caused by right coronary artery (RCA) occlusion (85% of cases). The RCA supplies the inferior wall, SA node (in 60%), and AV node (in 90%). Complications specific to inferior MI: bradycardia, heart block (AV node ischemia), right ventricular infarction (check right-sided leads V3R-V6R), and hypotension. Avoid nitroglycerin and morphine if RV infarction is present (preload-dependent).",
    category: "Diagnostic Reasoning",
    difficulty: 3
  },
  {
    id: "np-diag-q9",
    type: "question",
    question: "A patient presents with symmetric polyarthritis of the hands (MCP and PIP joints), morning stiffness >1 hour, and positive anti-CCP antibodies. RF is weakly positive. What test finding is most specific for the diagnosis?",
    options: ["Elevated ESR", "Positive rheumatoid factor (RF)", "Positive anti-CCP (anti-citrullinated protein antibodies)", "Elevated uric acid"],
    correctIndex: 2,
    answer: "Anti-CCP antibodies have 95-98% specificity for rheumatoid arthritis, making them far more specific than RF (which is positive in many conditions: HCV, Sjögren's, endocarditis, and healthy elderly). Anti-CCP is also prognostic: high titers predict more erosive, aggressive disease. The 2010 ACR/EULAR classification criteria use anti-CCP as a major criterion. Positive anti-CCP with symmetric small joint polyarthritis and prolonged morning stiffness is essentially diagnostic of RA.",
    category: "Diagnostic Reasoning",
    difficulty: 2,
    image: illustrationRheumatoidArthritis
  },
  {
    id: "np-diag-q10",
    type: "question",
    question: "An NP is evaluating a patient with new-onset proteinuria. Spot urine protein/creatinine ratio is 4.2 g/g (normal <0.2). Serum albumin is 2.1 g/dL. Lipid panel shows total cholesterol 380 mg/dL. What syndrome does this represent?",
    options: ["Nephritic syndrome", "Nephrotic syndrome", "Acute kidney injury", "Chronic kidney disease stage 3"],
    correctIndex: 1,
    answer: "The nephrotic syndrome triad: massive proteinuria (>3.5 g/day), hypoalbuminemia (<3.0 g/dL from urinary protein loss), and hyperlipidemia (liver compensates for protein loss by increasing lipoprotein synthesis). Additional features include edema (from reduced oncotic pressure) and lipiduria. The NP should evaluate for underlying causes: minimal change disease (children), membranous nephropathy (adults), diabetic nephropathy, amyloidosis, or FSGS. Renal biopsy is indicated in adults. Nephritic syndrome differs: hematuria, RBC casts, hypertension, mild proteinuria.",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  {
    id: "np-diag-q11",
    type: "question",
    question: "A patient presents with acute monoarthritis of the great toe. Joint aspiration shows negatively birefringent needle-shaped crystals under polarized light. Serum uric acid is 9.8 mg/dL. What is the diagnosis?",
    options: ["Pseudogout (calcium pyrophosphate deposition disease)", "Gout (monosodium urate crystal arthropathy)", "Septic arthritis", "Reactive arthritis"],
    correctIndex: 1,
    answer: "Negatively birefringent needle-shaped crystals are pathognomonic for gout (monosodium urate crystals). This is the gold standard diagnostic test. Pseudogout has positively birefringent rhomboid-shaped crystals (calcium pyrophosphate). Podagra (first MTP joint inflammation) is the most common presentation. Importantly, serum uric acid can be normal or even low during an acute flare (inflammatory cytokines promote renal excretion). Treat the flare first; urate-lowering therapy should not be initiated during acute attacks.",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  {
    id: "np-diag-q12",
    type: "question",
    question: "An NP is evaluating an infant with bilious vomiting on day 2 of life. Abdominal X-ray shows the 'double bubble' sign. What does this suggest?",
    options: ["Pyloric stenosis", "Duodenal atresia", "Necrotizing enterocolitis", "Meconium ileus"],
    correctIndex: 1,
    answer: "The double bubble sign on X-ray (dilated stomach + dilated proximal duodenum separated by the pylorus) is pathognomonic for duodenal atresia or severe stenosis. Bilious vomiting in the first 24-48 hours is the hallmark. Duodenal atresia is associated with Down syndrome (trisomy 21) in 30% of cases, and with polyhydramnios prenatally. Treatment is surgical (duodenoduodenostomy). Unlike pyloric stenosis, which presents at 2-6 weeks with NON-bilious vomiting.",
    category: "Diagnostic Reasoning",
    difficulty: 3,
    image: imgMeconiumIleus
  },
  {
    id: "np-diag-q13",
    type: "question",
    question: "A patient's thyroid function tests show low TSH (0.05), high fT4, and high fT3. Thyroid uptake scan shows diffusely increased uptake. What is the most likely diagnosis?",
    options: ["Toxic multinodular goiter", "Graves disease", "Subacute thyroiditis (De Quervain)", "Thyroid hormone ingestion (factitious thyrotoxicosis)"],
    correctIndex: 1,
    answer: "Diffusely increased radioactive iodine uptake with biochemical hyperthyroidism (low TSH, high fT4/fT3) is characteristic of Graves disease. Toxic multinodular goiter shows patchy uptake with hot and cold nodules. Subacute thyroiditis and factitious thyrotoxicosis show DECREASED uptake (thyroid is not actively producing hormone; in thyroiditis, preformed hormone is released from damaged gland; in factitious, exogenous hormone suppresses thyroid function). TSH receptor antibodies (TRAb) confirm Graves disease.",
    category: "Diagnostic Reasoning",
    difficulty: 2,
    image: imgGravesDisease
  },
  {
    id: "np-diag-q14",
    type: "question",
    question: "A 65-year-old presents with progressive dyspnea, dry cough, and bibasilar Velcro-like crackles on auscultation. HRCT shows honeycombing and traction bronchiectasis predominantly in the lower lobes. PFTs show a restrictive pattern. What is the likely diagnosis?",
    options: ["COPD", "Idiopathic pulmonary fibrosis (IPF)", "Sarcoidosis", "Congestive heart failure"],
    correctIndex: 1,
    answer: "Bibasilar Velcro-like crackles, HRCT showing honeycombing with traction bronchiectasis (usual interstitial pneumonia/UIP pattern), and restrictive PFTs in an older adult are classic for idiopathic pulmonary fibrosis. IPF has a median survival of 3-5 years from diagnosis. Antifibrotic therapy (pirfenidone or nintedanib) slows disease progression. Lung transplant referral should be considered early. IPF does NOT respond to steroids or immunosuppression (unlike other interstitial lung diseases).",
    category: "Diagnostic Reasoning",
    difficulty: 3
  },
  {
    id: "np-diag-q15",
    type: "question",
    question: "A patient with chronic kidney disease has the following labs: calcium 7.8, phosphorus 7.2, PTH 285 pg/mL, vitamin D 12 ng/mL. What is the underlying pathophysiology?",
    options: ["Primary hyperparathyroidism", "Secondary hyperparathyroidism from CKD (renal osteodystrophy)", "Hypoparathyroidism", "Vitamin D toxicity"],
    correctIndex: 1,
    answer: "CKD causes a cascade: failing kidneys cannot convert 25-OH vitamin D to active 1,25-(OH)2 vitamin D → decreased intestinal calcium absorption → hypocalcemia → parathyroid glands respond with elevated PTH (secondary hyperparathyroidism). Failing kidneys also cannot excrete phosphorus → hyperphosphatemia → further calcium deposition and hypocalcemia. Treatment: phosphate binders with meals, active vitamin D (calcitriol), and cinacalcet (calcimimetic) if PTH remains elevated. Unlike primary hyperparathyroidism, which shows HYPERcalcemia.",
    category: "Diagnostic Reasoning",
    difficulty: 2,
    image: imgCKD
  },
  {
    id: "np-diag-q16",
    type: "question",
    question: "An NP is interpreting spirometry results: FEV1/FVC ratio 0.82 (normal), FVC 62% predicted, FEV1 65% predicted, TLC elevated. What pattern is this?",
    options: ["Obstructive pattern", "Restrictive pattern", "Mixed obstructive and restrictive", "Normal spirometry"],
    correctIndex: 1,
    answer: "A normal or elevated FEV1/FVC ratio with reduced FVC and FEV1 indicates a restrictive pattern. Both volumes are proportionally reduced because the lungs cannot fully expand. Obstructive disease shows a REDUCED FEV1/FVC ratio (<0.7) because airflow is limited during exhalation. Causes of restriction: interstitial lung disease, chest wall deformity, neuromuscular disease, pleural disease, obesity. TLC elevation is unusual for pure restriction and may suggest air trapping; clinical correlation needed.",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  {
    id: "np-diag-q17",
    type: "question",
    question: "A patient presents with a painless testicular mass in a 25-year-old male. Ultrasound shows a solid, hypoechoic intratesticular mass. What are the appropriate tumor markers to order?",
    options: ["PSA and free PSA", "AFP, beta-hCG, and LDH", "CEA and CA 19-9", "CA-125 and HE4"],
    correctIndex: 1,
    answer: "Testicular cancer tumor markers: AFP (alpha-fetoprotein, elevated in yolk sac tumors and some non-seminomas), beta-hCG (elevated in choriocarcinoma and some seminomas), and LDH (reflects tumor burden). Seminomas: may have mildly elevated beta-hCG, but AFP is ALWAYS normal (elevated AFP rules out pure seminoma). Non-seminomas: may elevate AFP, beta-hCG, or both. Markers are used for diagnosis, staging, and monitoring treatment response. Radical inguinal orchiectomy (NOT trans-scrotal biopsy) is the definitive diagnostic and initial therapeutic procedure.",
    category: "Diagnostic Reasoning",
    difficulty: 3,
    image: imgTumorMarkers
  },
  {
    id: "np-diag-q18",
    type: "question",
    question: "An NP is evaluating a patient with suspected celiac disease. IgA anti-tissue transglutaminase (tTG-IgA) is strongly positive. Total serum IgA is normal. What is the next step?",
    options: ["Start a gluten-free diet immediately", "Confirm with esophagogastroduodenoscopy (EGD) with small bowel biopsies while the patient is still on a gluten-containing diet", "Order genetic testing (HLA-DQ2/DQ8) as the definitive test", "Prescribe immunosuppressive therapy"],
    correctIndex: 1,
    answer: "While tTG-IgA has high sensitivity (>95%) and specificity (>95%) for celiac disease, histological confirmation with small bowel biopsy remains the gold standard. The patient MUST remain on a gluten-containing diet during testing (gluten-free diet normalizes serology and heals mucosa, causing false negatives). Classic histological findings: villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis (Marsh classification). HLA-DQ2/DQ8 testing is useful for ruling OUT celiac (>99% NPV) but not for confirming it (40% of the general population carries these alleles).",
    category: "Diagnostic Reasoning",
    difficulty: 2
  },
  // ============================================================
  // PRIMARY CARE (18 cards)
  // ============================================================
  {
    id: "np-pc-q1",
    type: "question",
    question: "A 50-year-old male with no known cardiovascular disease has an LDL of 145 mg/dL and a 10-year ASCVD risk of 12%. Per ACC/AHA guidelines, what is the recommended statin intensity?",
    options: ["No statin therapy is needed", "Moderate-intensity statin (e.g., atorvastatin 10-20 mg)", "High-intensity statin (e.g., atorvastatin 40-80 mg)", "Start with lifestyle modifications only for 6 months"],
    correctIndex: 1,
    answer: "For primary prevention with 10-year ASCVD risk 7.5-20% and LDL ≥70, ACC/AHA 2018 guidelines recommend moderate-intensity statin therapy. Risk-enhancing factors (family history, metabolic syndrome, elevated hs-CRP, elevated Lp(a), ABI <0.9) may favor higher intensity. Coronary artery calcium (CAC) scoring can refine the decision: CAC 0 may defer therapy, CAC ≥100 favors statin. High-intensity statins are reserved for clinical ASCVD, LDL ≥190, diabetes with risk factors, or very high risk (≥20%).",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q2",
    type: "question",
    question: "An NP is performing a Medicare Annual Wellness Visit for a 72-year-old woman. Which screening is recommended at this visit?",
    options: ["Full physical examination including pelvic exam", "Health risk assessment, cognitive screening, depression screening, fall risk assessment, advance directive review, and functional ability assessment", "Comprehensive metabolic panel and CBC", "Stress test and echocardiogram"],
    correctIndex: 1,
    answer: "The Medicare Annual Wellness Visit (AWV) is NOT a comprehensive physical exam. It includes: health risk assessment questionnaire, review of medical/family history, vital signs and BMI, cognitive assessment (Mini-Cog or similar), depression screening (PHQ-2/PHQ-9), fall risk assessment, functional ability/ADLs, advance directive review, medication reconciliation, and personalized prevention plan with age-appropriate screening recommendations. Understanding the AWV components is essential for NP billing and compliance.",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q3",
    type: "question",
    question: "A 45-year-old patient presents with a BP of 142/92 on three separate visits over 2 months. No target organ damage is identified. Per the 2017 ACC/AHA guidelines, what is the classification and initial treatment?",
    options: ["Normal BP; no treatment needed", "Stage 1 hypertension; lifestyle modifications and consider pharmacotherapy based on ASCVD risk", "Stage 2 hypertension; start two antihypertensive medications", "Hypertensive urgency requiring immediate IV medications"],
    correctIndex: 1,
    answer: "Per 2017 ACC/AHA guidelines: BP 130-139/80-89 is Stage 1 HTN, and 140+/90+ is Stage 2 HTN. However, JNC 8 thresholds (which many practices still follow) classify 140-159/90-99 as Stage 1. At 142/92, treatment includes lifestyle modifications (DASH diet, sodium restriction <2.3g/day, exercise, weight loss, alcohol moderation) PLUS pharmacotherapy if 10-year ASCVD risk ≥10%. First-line agents: thiazide diuretic, ACEi/ARB, or CCB. Choice is influenced by comorbidities (ACEi/ARB for diabetes or CKD, CCB for African Americans).",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q4",
    type: "question",
    question: "A 52-year-old woman presents with hot flashes, night sweats, and vaginal dryness causing significant distress. Her last menstrual period was 14 months ago. She has no contraindications to hormone therapy. What is the most appropriate management?",
    options: ["Systemic hormone therapy is never recommended", "Low-dose systemic estrogen plus progesterone (for women with intact uterus) is appropriate for vasomotor symptoms within 10 years of menopause onset", "High-dose testosterone replacement", "SSRIs as first-line for all menopausal symptoms"],
    correctIndex: 1,
    answer: "For women within 10 years of menopause onset or under age 60 with bothersome vasomotor symptoms and no contraindications, systemic HT (estrogen + progestogen for intact uterus, estrogen alone if post-hysterectomy) is the most effective treatment. Benefits outweigh risks in this 'window of opportunity.' Contraindications: breast cancer, active liver disease, unexplained vaginal bleeding, history of VTE, known ASCVD. Use the lowest effective dose for the shortest duration. For vaginal symptoms only, low-dose vaginal estrogen is preferred.",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q5",
    type: "question",
    question: "An NP is counseling a patient on colorectal cancer screening. The patient is 46, average risk, with no family history. Per current USPSTF guidelines (2021), when should screening begin?",
    options: ["Age 50", "Age 45", "Age 40", "Age 55"],
    correctIndex: 1,
    answer: "USPSTF 2021 guidelines lowered the colorectal cancer screening initiation age from 50 to 45 for average-risk individuals (Grade B recommendation). Screening options include: colonoscopy every 10 years, FIT annually, FIT-DNA (Cologuard) every 1-3 years, CT colonography every 5 years, or flexible sigmoidoscopy every 5 years. First-degree relatives with CRC before 60 should start screening at age 40 or 10 years before the affected relative's diagnosis, whichever is earlier.",
    category: "Primary Care",
    difficulty: 1
  },
  {
    id: "np-pc-q6",
    type: "question",
    question: "A 30-year-old sexually active woman presents with malodorous, thin, grayish-white vaginal discharge. Wet mount shows clue cells. Whiff test is positive. Vaginal pH is 5.2. What is the diagnosis and treatment?",
    options: ["Vulvovaginal candidiasis; treat with fluconazole", "Bacterial vaginosis; treat with metronidazole 500 mg BID for 7 days or metronidazole vaginal gel", "Trichomoniasis; treat with metronidazole 2 g single dose", "Normal physiological discharge; no treatment needed"],
    correctIndex: 1,
    answer: "Three of four Amsel criteria confirm BV: (1) thin, grayish discharge, (2) clue cells on wet mount (epithelial cells studded with bacteria obscuring cell borders), (3) positive whiff test (fishy odor with KOH), (4) vaginal pH >4.5. Treatment: metronidazole 500 mg BID for 7 days (oral) or metronidazole 0.75% vaginal gel for 5 days. Alternative: clindamycin vaginal cream. BV increases risk of preterm birth in pregnancy (treat all symptomatic pregnant women). Avoid alcohol during and 24 hours after metronidazole.",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q7",
    type: "question",
    question: "An NP is managing a patient with newly diagnosed type 2 diabetes. A1C is 7.8%. BMI is 31. Patient has no ASCVD or CKD. What is the first-line medication per ADA Standards of Care?",
    options: ["Insulin glargine", "Metformin 500 mg with titration to 1000 mg BID", "Empagliflozin 10 mg daily", "Glipizide 5 mg daily"],
    correctIndex: 1,
    answer: "Metformin remains first-line therapy for type 2 diabetes per ADA guidelines. Start 500 mg once daily with meals, titrate to 1000 mg BID over 4-8 weeks to minimize GI side effects. Benefits: effective A1C reduction (1-1.5%), weight neutral/slight loss, low hypoglycemia risk, cardiovascular benefit, low cost. Check B12 levels annually (metformin impairs B12 absorption). Contraindicated if eGFR <30. If A1C is >1.5% above target or patient has ASCVD/CKD/HF, consider dual therapy at initiation (metformin + SGLT2i or GLP-1 RA).",
    category: "Primary Care",
    difficulty: 1
  },
  {
    id: "np-pc-q8",
    type: "question",
    question: "A patient presents with a 2-week history of productive cough, purulent sputum, and low-grade fever. CXR is clear. What is the most likely diagnosis and appropriate management?",
    options: ["Pneumonia requiring antibiotics", "Acute bronchitis; supportive care without antibiotics in most cases", "Tuberculosis requiring isolation", "Lung cancer requiring urgent biopsy"],
    correctIndex: 1,
    answer: "Acute bronchitis is a self-limiting viral illness in 90%+ of cases. Purulent sputum does NOT indicate bacterial infection (it reflects neutrophil influx, not bacteria). With a clear CXR ruling out pneumonia, antibiotics are NOT indicated and contribute to antibiotic resistance. Management: symptom relief with dextromethorphan, honey (adults), NSAIDs for discomfort, adequate hydration, and patient education that cough may persist 2-3 weeks. Consider pertussis testing if cough >2 weeks with paroxysms or post-tussive vomiting.",
    category: "Primary Care",
    difficulty: 1
  },
  {
    id: "np-pc-q9",
    type: "question",
    question: "A 28-year-old patient presents with recurrent episodes of unilateral pulsating headache with nausea, photophobia, and phonophobia lasting 4-72 hours. Episodes occur 12 times per month. What is the diagnosis and when is preventive therapy indicated?",
    options: ["Tension headache; prevention not needed", "Migraine without aura; preventive therapy is indicated when frequency is ≥4 headache days per month", "Cluster headache; start oxygen therapy", "Medication overuse headache; stop all medications"],
    correctIndex: 1,
    answer: "Unilateral pulsating headache with nausea, photo/phonophobia lasting 4-72 hours meets ICHD-3 criteria for migraine without aura. Preventive therapy is indicated when: ≥4 headache days/month, significant disability, contraindication to acute medications, or overuse of acute medications. Options: beta-blockers (propranolol), anticonvulsants (topiramate, valproate), antidepressants (amitriptyline), CGRP monoclonal antibodies (erenumab, fremanezumab). At 12 days/month, this patient is at high risk for progression to chronic migraine.",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q10",
    type: "question",
    question: "An NP is managing a patient with hypothyroidism on levothyroxine 100 mcg daily. TSH is 8.2 (elevated) despite reported adherence. What should the NP assess?",
    image: imgHypothyroidismNew,
    options: ["The dose is adequate; no changes needed", "Assess medication timing (empty stomach, 30-60 min before food), drug interactions (calcium, iron, PPIs), and true adherence", "Switch to liothyronine (T3) immediately", "Increase the dose to 200 mcg immediately"],
    correctIndex: 1,
    answer: "Before adjusting levothyroxine dose, assess common causes of subtherapeutic TSH: (1) Adherence: most common cause; 'white coat compliance' (patient takes medication consistently only before visits). (2) Timing: must be on empty stomach, 30-60 min before food/other meds. (3) Drug interactions: calcium, iron, PPIs, cholestyramine, and antacids impair absorption (space 4 hours). (4) Malabsorption: celiac disease, inflammatory bowel disease, H. pylori. (5) Consider checking free T4 level. Dose adjustments should be made in 12.5-25 mcg increments with TSH rechecked in 6-8 weeks.",
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q11",
    type: "question",
    question: "A 65-year-old male presents with nocturia (4 times/night), weak urinary stream, hesitancy, and incomplete emptying. DRE shows a symmetrically enlarged, non-tender, smooth prostate. PSA is 2.8 ng/mL. What is the initial pharmacological treatment?",
    options: ["Immediate surgical referral for TURP", "Alpha-blocker (tamsulosin) for symptom relief and/or 5-alpha reductase inhibitor (finasteride) for large prostates", "Antibiotics for presumed prostatitis", "Watchful waiting only, regardless of symptom severity"],
    correctIndex: 1,
    answer: "Benign prostatic hyperplasia (BPH) with moderate-severe LUTS (IPSS >7) is initially treated with alpha-blockers (tamsulosin, alfuzosin) for rapid symptom relief (relaxes prostatic smooth muscle). For larger prostates (>30-40g), add a 5-alpha reductase inhibitor (finasteride, dutasteride) which shrinks the gland over 6-12 months and reduces risk of acute urinary retention. Combination therapy is superior for large prostates. Surgical referral (TURP, laser) for refractory symptoms or complications (retention, recurrent UTI, bladder stones, renal insufficiency).",
    image: imgBPH,
    category: "Primary Care",
    difficulty: 2
  },
  {
    id: "np-pc-q12",
    type: "question",
    question: "A patient presents with a BMI of 42, type 2 diabetes, obstructive sleep apnea, and knee osteoarthritis. Previous weight loss attempts with lifestyle modification and medications have failed. What should the NP recommend?",
    options: ["Continue lifestyle modifications indefinitely", "Referral for bariatric surgery evaluation, as BMI ≥40 (or ≥35 with comorbidities) meets criteria", "Prescribe phentermine long-term", "Very-low-calorie liquid diet"],
    correctIndex: 1,
    answer: "Per ASMBS/ACS guidelines, bariatric surgery is indicated for BMI ≥40, or BMI ≥35 with obesity-related comorbidities (diabetes, OSA, hypertension, NAFLD). Recent guidelines also consider BMI 30-35 with poorly controlled type 2 diabetes. Roux-en-Y gastric bypass and sleeve gastrectomy achieve superior long-term weight loss and comorbidity resolution compared to medical therapy alone. The STAMPEDE trial showed 60% of diabetic patients achieving A1C <6% after bariatric surgery vs. 5% with medical therapy.",
    category: "Primary Care",
    difficulty: 2,
    image: imgBariatricFlashcard
  },
  {
    id: "np-pc-q13",
    type: "question",
    question: "An NP is managing a patient with chronic low back pain persisting for 4 months with no red flags. MRI shows mild degenerative disc disease. What is the evidence-based first-line treatment approach?",
    options: ["Prescribe long-term opioids for chronic pain", "Multimodal approach: exercise therapy, NSAIDs, cognitive behavioral therapy, and avoidance of prolonged bed rest", "Immediate surgical referral for discectomy", "Repeat MRI in 2 weeks"],
    correctIndex: 1,
    answer: "ACP/APS guidelines for chronic low back pain recommend a multimodal approach: exercise therapy (strongest evidence), NSAIDs or duloxetine for pharmacological management, cognitive behavioral therapy (addresses pain catastrophizing and fear-avoidance behavior), spinal manipulation, and yoga/tai chi. Opioids are NOT recommended for chronic non-cancer pain as first-line. Imaging is only indicated with red flags (neurological deficit, fever, weight loss, history of cancer, trauma). Surgery is reserved for progressive neurological deficit or cauda equina syndrome.",
    category: "Primary Care",
    difficulty: 2
  },
  // ============================================================
  // ACUTE CARE (16 cards)
  // ============================================================
  {
    id: "np-ac-q1",
    type: "question",
    question: "An NP in the ICU is managing a patient with septic shock. Despite 30 mL/kg crystalloid resuscitation and norepinephrine at 0.5 mcg/kg/min, the MAP is 58 mmHg. What is the next recommended vasopressor per SSC guidelines?",
    options: ["Dopamine at renal dose", "Add vasopressin 0.03-0.04 units/min", "Switch to phenylephrine", "Add dobutamine"],
    correctIndex: 1,
    answer: "Surviving Sepsis Campaign 2021 guidelines recommend adding vasopressin (up to 0.03-0.04 units/min) as the second-line vasopressor when norepinephrine alone is insufficient to achieve MAP ≥65 mmHg. Vasopressin acts on V1 receptors causing vasoconstriction independent of catecholamine receptors. It also has a catecholamine-sparing effect. If cardiac output is a concern (low ScvO2, high lactate despite adequate MAP), dobutamine may be added. Corticosteroids (hydrocortisone 200 mg/day) should be considered for refractory shock.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q2",
    type: "question",
    question: "A hospitalized patient develops acute respiratory distress with bilateral pulmonary infiltrates, PaO2/FiO2 ratio of 180, and no evidence of cardiogenic pulmonary edema. What is the diagnosis and target tidal volume?",
    options: ["Cardiogenic pulmonary edema; diuretics", "Moderate ARDS; lung-protective ventilation with tidal volume 6-8 mL/kg ideal body weight", "Pneumonia; antibiotics only", "Pleural effusion; thoracentesis"],
    correctIndex: 1,
    answer: "PaO2/FiO2 ratio 100-200 with bilateral infiltrates and no cardiogenic cause meets Berlin criteria for MODERATE ARDS (mild: 200-300, severe: <100). ARDSNet lung-protective ventilation: tidal volume 6-8 mL/kg IDEAL body weight (not actual weight), plateau pressure <30 cmH2O, adequate PEEP per PEEP/FiO2 table, and permissive hypercapnia if needed. Prone positioning for 12-16 hours/day improves survival in moderate-severe ARDS (PROSEVA trial). Conservative fluid strategy after initial resuscitation.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q3",
    type: "question",
    question: "An NP is evaluating a patient with suspected acute coronary syndrome. Troponin is elevated and the ECG shows ST depression in V3-V6 with T-wave inversions. What type of ACS is this and what is the management priority?",
    options: ["STEMI requiring emergent PCI within 90 minutes", "NSTEMI; anticoagulation, antiplatelets, and risk stratification for early invasive strategy within 24-72 hours", "Unstable angina; observation only", "Pericarditis; NSAIDs"],
    correctIndex: 1,
    answer: "Elevated troponin with ST depression/T-wave inversions (without ST elevation) defines NSTEMI. Management per ACC/AHA: dual antiplatelet therapy (aspirin + P2Y12 inhibitor), anticoagulation (heparin or enoxaparin), beta-blocker (if no contraindications), statin, and risk stratification using TIMI or GRACE score. Early invasive strategy (cardiac catheterization within 24-72 hours) is recommended for high-risk patients (GRACE score >140, dynamic ST changes, elevated troponin, diabetes, hemodynamic instability).",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q4",
    type: "question",
    question: "A patient with community-acquired pneumonia has a CURB-65 score of 4 (confusion, BUN >20, RR >30, BP <90/60, age 68). What level of care is appropriate?",
    options: ["Outpatient oral antibiotics", "Standard medical floor admission", "ICU admission with IV antibiotics and hemodynamic monitoring", "Observation unit for 24 hours"],
    correctIndex: 2,
    answer: "CURB-65 score ≥3 indicates severe CAP with 30-day mortality 15-40%, warranting ICU consideration. ATS/IDSA major criteria for ICU admission include: invasive mechanical ventilation or septic shock requiring vasopressors. Minor criteria (≥3 of 9 = ICU): confusion, BUN >20, RR ≥30, SBP <90, multilobar infiltrates, PaO2/FiO2 <250, hypothermia, leukopenia, thrombocytopenia. IV antibiotics should cover both typical and atypical pathogens: beta-lactam (ceftriaxone/ampicillin-sulbactam) PLUS macrolide OR respiratory fluoroquinolone.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q5",
    type: "question",
    question: "A patient with cirrhosis presents with fever, abdominal pain, and new-onset ascites. Diagnostic paracentesis reveals: PMN count 380 cells/mm³, protein 1.2 g/dL. What is the diagnosis and empiric treatment?",
    options: ["Secondary bacterial peritonitis requiring surgery", "Spontaneous bacterial peritonitis (SBP); empiric ceftriaxone or cefotaxime PLUS IV albumin", "Sterile ascites requiring diuretics only", "Tuberculous peritonitis"],
    correctIndex: 1,
    answer: "SBP is diagnosed when ascitic fluid PMN count ≥250 cells/mm³ (regardless of culture results). Low protein ascites (<1 g/dL) increases SBP risk. Empiric therapy: third-generation cephalosporin (cefotaxime 2g q8h or ceftriaxone 2g daily) for 5-7 days. IV albumin (1.5 g/kg on day 1, 1 g/kg on day 3) reduces mortality by preventing hepatorenal syndrome (Sort trial). After recovery, long-term prophylaxis with norfloxacin or TMP-SMX is indicated. Avoid aminoglycosides in cirrhosis (nephrotoxicity).",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q6",
    type: "question",
    question: "An NP is managing a patient with acute exacerbation of COPD requiring hospitalization. ABG shows pH 7.28, PaCO2 62, PaO2 55 on 2L NC. What is the most appropriate ventilatory support?",
    options: ["Increase nasal cannula to 6L/min", "Non-invasive positive pressure ventilation (BiPAP) as first-line", "Immediate intubation and mechanical ventilation", "High-flow nasal cannula at 60L/min"],
    correctIndex: 1,
    answer: "BiPAP is first-line ventilatory support for acute COPD exacerbation with respiratory acidosis (pH <7.35, PaCO2 >45). BiPAP reduces work of breathing, improves gas exchange, and reduces intubation rates by 65% and mortality by 46% (Cochrane review). Settings: start with IPAP 10-12 cmH2O, EPAP 4-5 cmH2O, FiO2 titrated to SpO2 88-92%. Intubation is indicated if BiPAP fails after 1-2 hours (worsening pH, rising PaCO2, declining mental status) or if the patient cannot tolerate the mask.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q7",
    type: "question",
    question: "An NP is managing a patient with acute kidney injury. Labs show: creatinine 4.2 (baseline 0.9), potassium 6.8, pH 7.18, BUN 88, and the patient is anuric. What is the indication for urgent dialysis?",
    options: ["Elevated BUN alone", "Refractory hyperkalemia, severe metabolic acidosis, volume overload unresponsive to diuretics, or uremic symptoms (AEIOU mnemonic)", "Creatinine above 3.0", "Any AKI requires immediate dialysis"],
    correctIndex: 1,
    answer: "Urgent dialysis indications (AEIOU): Acidosis refractory to medical management, Electrolyte abnormalities (refractory hyperkalemia), Intoxication (certain drug overdoses: methanol, ethylene glycol, lithium, salicylates), Overload (fluid overload unresponsive to diuretics), Uremia (encephalopathy, pericarditis, bleeding). This patient has refractory hyperkalemia (6.8) AND severe acidosis (7.18) in an anuric patient, meeting multiple urgent criteria. While temporizing measures (calcium gluconate, insulin/D50, sodium bicarbonate) can be initiated, dialysis is needed.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q8",
    type: "question",
    question: "A hospitalized patient on vancomycin therapy develops AKI. The vancomycin trough is 32 mcg/mL (therapeutic range 15-20 for serious infections). What should the NP do?",
    options: ["Continue the same dose as infection control is paramount", "Hold vancomycin, obtain a stat renal panel, reassess the need for vancomycin, and consider switching to alternative agents or adjusting dose based on AUC-guided dosing", "Increase the dose to compensate for renal impairment", "Discontinue vancomycin permanently and never rechallenge"],
    correctIndex: 1,
    answer: "Vancomycin trough of 32 mcg/mL is supratherapeutic and nephrotoxic. Current ASHP/IDSA/SIDP guidelines (2020) recommend AUC-guided dosing (AUC/MIC 400-600) over trough-only monitoring, as it reduces nephrotoxicity. The NP should hold vancomycin, assess renal function trend, and consider: (1) dose reduction with extended interval, (2) switching to alternative (daptomycin for VRE/MRSA bacteremia, linezolid for MRSA pneumonia), or (3) pharmacy-calculated AUC-based dosing adjustment.",
    category: "Acute Care",
    difficulty: 3
  },
  // ============================================================
  // PEDIATRIC NP (14 cards)
  // ============================================================
  {
    id: "np-peds-q1",
    type: "question",
    question: "A 2-month-old infant presents with fever of 38.5°C. The infant appears well-appearing. According to current guidelines, what is the recommended evaluation?",
    options: ["Acetaminophen and follow-up in 48 hours", "Full sepsis workup including CBC, blood culture, urinalysis/urine culture, and lumbar puncture for CSF analysis, with empiric antibiotics pending results", "Observe without testing if the infant appears well", "Prescribe amoxicillin empirically and recheck in 24 hours"],
    correctIndex: 1,
    answer: "Febrile neonates and young infants (0-60 days) require a full sepsis evaluation regardless of appearance because serious bacterial infections (UTI, bacteremia, meningitis) can present with minimal symptoms. The 2021 AAP clinical practice guideline for febrile infants 8-60 days stratifies risk using inflammatory markers (procalcitonin, ABS, CRP) and urinalysis. Infants 0-28 days: full workup + empiric ampicillin and gentamicin (or cefotaxime) pending cultures. Older well-appearing infants with negative markers may be managed more conservatively.",
    category: "Pediatric NP",
    difficulty: 3
  },
  {
    id: "np-peds-q2",
    type: "question",
    question: "An NP is evaluating a 7-year-old with recurrent episodes of sore throat (7 episodes in the past year, all positive for GAS). What is the recommended management?",
    options: ["Continue treating each episode with antibiotics", "Referral for tonsillectomy, as the Paradise criteria are met", "Prophylactic antibiotics for 1 year", "Observe and treat only symptomatic episodes"],
    correctIndex: 1,
    answer: "Paradise criteria for tonsillectomy: ≥7 episodes in 1 year, ≥5/year for 2 years, or ≥3/year for 3 years, each with specific documentation (fever, tonsillar exudate, positive GAS culture, or treatment with antibiotics). This child meets criteria with 7 episodes in 1 year. AAP/AAO-HNS guidelines support tonsillectomy in these cases. Watchful waiting is an alternative if the family prefers, as recurrence often decreases naturally. Penicillin allergy should be documented; amoxicillin or penicillin V remains first-line for GAS pharyngitis.",
    category: "Pediatric NP",
    difficulty: 2,
    image: imgTonsillectomyV2
  },
  {
    id: "np-peds-q3",
    type: "question",
    question: "A 4-year-old presents with periorbital swelling, 4+ proteinuria on dipstick, and serum albumin of 1.5 g/dL. The most likely diagnosis and initial treatment?",
    options: ["Acute glomerulonephritis; IV antibiotics", "Minimal change disease (nephrotic syndrome); empiric corticosteroid therapy with prednisone", "Hemolytic uremic syndrome; plasmapheresis", "IgA nephropathy; ACE inhibitor"],
    correctIndex: 1,
    answer: "In children aged 1-10 years, nephrotic syndrome is most commonly caused by minimal change disease (80% of pediatric nephrotic syndrome). Per KDIGO guidelines, empiric corticosteroid therapy (prednisone 2 mg/kg/day for 4-6 weeks, then taper over 2-6 months) is initiated WITHOUT renal biopsy, as 90% of MCD responds to steroids. Biopsy is reserved for steroid-resistant cases, age <1 or >12, low C3, or hematuria/hypertension suggesting alternative diagnosis. Monitor for steroid side effects and relapse (occurs in 60-70%).",
    category: "Pediatric NP",
    difficulty: 3,
    image: imgHemolyticUremicSyndrome
  },
  {
    id: "np-peds-q4",
    type: "question",
    question: "An NP is evaluating a 6-month-old infant for developmental milestones. Which finding would be most concerning for developmental delay?",
    options: ["Cannot walk independently", "Does not babble, does not reach for objects, does not roll over, and does not track visually", "Cannot stack blocks", "Does not use a pincer grasp"],
    correctIndex: 1,
    answer: "By 6 months, expected milestones include: babbling (social communication), reaching for and grasping objects (fine motor), rolling over both ways (gross motor), and tracking objects visually. Absence of all these suggests significant global developmental delay requiring urgent referral for early intervention services and comprehensive developmental evaluation. Individual milestone delays may be normal variants, but absence of multiple milestones across domains is a red flag. Hearing and vision screening should also be performed.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-peds-q5",
    type: "question",
    question: "A 10-year-old presents with cola-colored urine, periorbital edema, and hypertension 2 weeks after a streptococcal pharyngitis. Serum C3 is low. What is the diagnosis?",
    options: ["IgA nephropathy (Berger disease)", "Post-streptococcal glomerulonephritis (PSGN)", "Minimal change disease", "Henoch-Schönlein purpura nephritis"],
    correctIndex: 1,
    answer: "PSGN is a classic post-infectious glomerulonephritis occurring 1-3 weeks after GAS pharyngitis or 3-6 weeks after GAS skin infection. The nephritic syndrome presentation (hematuria/cola-colored urine, edema, hypertension) with low C3 (consumed by immune complex deposition) following documented streptococcal infection is diagnostic. ASO titer or anti-DNase B confirms prior strep exposure. Treatment is supportive: sodium and fluid restriction, loop diuretics for edema, antihypertensives. C3 should normalize within 6-8 weeks; persistent low C3 suggests alternative diagnosis (MPGN, lupus nephritis).",
    category: "Pediatric NP",
    difficulty: 2,
    image: imgGlomerulonephritis
  },
  {
    id: "np-peds-q6",
    type: "question",
    question: "An NP is managing a child with newly diagnosed ADHD. The parents want to explore medication options. What is the first-line pharmacological treatment per AAP guidelines?",
    options: ["Atomoxetine (Strattera)", "Methylphenidate (Ritalin/Concerta) or amphetamine-based stimulant", "Clonidine", "Bupropion"],
    correctIndex: 1,
    answer: "AAP guidelines (2019) recommend stimulant medications as first-line for ADHD in children ≥6 years: methylphenidate-based (Ritalin, Concerta, Focalin) or amphetamine-based (Adderall, Vyvanse). Both classes have equivalent efficacy (~70-80% response rate). For ages 4-5, behavioral therapy is first-line. Side effects: appetite suppression, insomnia, growth deceleration (monitor height/weight), tachycardia. Growth should be monitored with height/weight at each visit. Second-line: atomoxetine, guanfacine XR, or clonidine XR. Cardiovascular screening with personal/family history is recommended before starting stimulants.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-peds-q7",
    type: "question",
    question: "A neonate born at 28 weeks gestation develops respiratory distress within hours of birth. CXR shows ground-glass opacities with air bronchograms. What is the diagnosis and primary treatment?",
    options: ["Meconium aspiration syndrome", "Respiratory distress syndrome (RDS) from surfactant deficiency; exogenous surfactant replacement", "Transient tachypnea of the newborn", "Congenital pneumonia"],
    correctIndex: 1,
    answer: "RDS (formerly hyaline membrane disease) results from surfactant deficiency in premature lungs (type II pneumocytes produce surfactant beginning at 24-28 weeks, adequate by 35 weeks). CXR shows bilateral ground-glass opacities with air bronchograms. Treatment: exogenous surfactant replacement via ETT (calfactant, beractant, or poractant), CPAP or mechanical ventilation, and supportive NICU care. Prevention: antenatal corticosteroids (betamethasone) given to mothers at risk for preterm delivery at 24-34 weeks accelerates fetal lung maturation.",
    category: "Pediatric NP",
    difficulty: 2,
    image: imgMeconiumAspiration
  },
  // ============================================================
  // FAMILY NP (12 cards)
  // ============================================================
  {
    id: "np-fnp-q1",
    type: "question",
    question: "A 35-year-old woman with a BMI of 42 and irregular menses wants to conceive. She has acne, hirsutism, and ultrasound shows bilateral enlarged ovaries with multiple small follicles. What is the most likely diagnosis and first-line fertility treatment?",
    options: ["Premature ovarian insufficiency; IVF", "Polycystic ovary syndrome (PCOS); weight loss + letrozole for ovulation induction", "Hypothalamic amenorrhea; GnRH pump therapy", "Endometriosis; laparoscopic surgery"],
    correctIndex: 1,
    answer: "PCOS is diagnosed using Rotterdam criteria (≥2 of 3: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovaries on ultrasound). This patient meets all three. For fertility: weight loss of 5-10% can restore ovulation in many women. Letrozole (aromatase inhibitor) has replaced clomiphene as first-line ovulation induction in PCOS per the international evidence-based PCOS guideline (2023). Metformin may be added as adjunct. If letrozole fails, gonadotropins or IVF are considered. Lifestyle modification is foundational for all PCOS management.",
    category: "Family NP",
    difficulty: 3,
    image: imgPCOS
  },
  {
    id: "np-fnp-q2",
    type: "question",
    question: "An NP is managing a family where the 8-year-old child has been diagnosed with lead poisoning (blood lead level 52 μg/dL). What is the treatment threshold and intervention?",
    options: ["No treatment needed below 70 μg/dL", "BLL ≥45 μg/dL requires chelation therapy (succimer for oral or CaEDTA for severe cases); immediate environmental investigation and remediation", "Dietary iron supplementation is the only intervention needed", "Repeat blood lead level in 6 months"],
    correctIndex: 1,
    answer: "CDC reference value is 3.5 μg/dL (previously 5). BLL 45-69 μg/dL: chelation therapy with oral succimer (DMSA) and environmental investigation. BLL ≥70 μg/dL: emergent chelation with parenteral CaEDTA ± BAL in ICU setting. BLL 20-44: environmental investigation, nutritional counseling (iron, calcium, vitamin C enhance lead excretion), developmental assessment. Sources: lead paint (pre-1978 housing), contaminated water, soil, imported ceramics/toys. Iron deficiency increases lead absorption, so ensuring adequate iron status is important.",
    category: "Family NP",
    difficulty: 3,
    image: imgLeadPoisoning
  },
  {
    id: "np-fnp-q3",
    type: "question",
    question: "A 72-year-old patient scores 22/30 on the Montreal Cognitive Assessment (MoCA). The family reports progressive memory loss over 2 years with difficulty managing finances and getting lost while driving. What is the NP's assessment?",
    options: ["Normal age-related cognitive decline", "Mild cognitive impairment (MCI) progressing to probable Alzheimer disease; further evaluation needed", "Depression-related pseudodementia", "Delirium from acute infection"],
    correctIndex: 1,
    answer: "MoCA score <26 suggests cognitive impairment. Progressive decline in memory with impairment in instrumental ADLs (finances, driving) over 2 years suggests progression from MCI to early dementia, most commonly Alzheimer disease. The NP should: rule out reversible causes (TSH, B12, RPR, CBC, CMP, depression screening), obtain neuroimaging (MRI preferred), and refer to neurology/neuropsychology. Cholinesterase inhibitors (donepezil) are indicated for mild-moderate AD. Advance care planning should be initiated early while the patient retains decision-making capacity.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-fnp-q4",
    type: "question",
    question: "An NP is managing a patient with newly diagnosed gout. After the acute flare resolves, the patient has had 3 flares in the past year and has tophi. When should urate-lowering therapy (ULT) be initiated?",
    options: ["Never; treat only acute flares", "ULT is indicated for ≥2 flares/year, tophi, urate nephropathy, or kidney stones; start allopurinol at low dose with prophylactic colchicine for 3-6 months", "Start ULT during the acute flare for fastest results", "ULT is only for patients with uric acid >12 mg/dL"],
    correctIndex: 1,
    answer: "ACR 2020 guidelines recommend ULT for: ≥2 flares/year, any tophus, radiographic damage from gout, or uric acid kidney stones. Allopurinol is first-line (start at 100 mg/day, titrate by 100 mg every 2-4 weeks to target uric acid <6 mg/dL). HLA-B*5801 testing is recommended before starting allopurinol in Southeast Asian and African American patients (risk of severe hypersensitivity/SJS/TEN). Colchicine 0.6 mg daily for prophylaxis during ULT initiation for 3-6 months to prevent mobilization flares. Febuxostat is second-line.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-fnp-q5",
    type: "question",
    question: "A 16-year-old female presents with secondary amenorrhea for 4 months. She is a competitive gymnast with BMI 17. Pregnancy test is negative. What is the most likely diagnosis?",
    options: ["Polycystic ovary syndrome", "Functional hypothalamic amenorrhea from the female athlete triad", "Premature ovarian insufficiency", "Thyroid dysfunction"],
    correctIndex: 1,
    answer: "The female athlete triad consists of: (1) low energy availability (with or without disordered eating), (2) menstrual dysfunction (amenorrhea), and (3) low bone mineral density. In competitive athletes with restrictive eating and low BMI, hypothalamic suppression of GnRH leads to low FSH/LH, resulting in anovulation and amenorrhea. The NP should check FSH, LH, estradiol, prolactin, TSH, and consider DEXA scan. Treatment: increase caloric intake, reduce exercise intensity, and psychosocial support. Estrogen replacement may be needed for bone protection.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-fnp-q6",
    type: "question",
    question: "An NP is managing a patient with chronic hepatitis C (genotype 1a, no cirrhosis, treatment-naive). What is the current standard of care treatment?",
    options: ["Pegylated interferon plus ribavirin for 48 weeks", "Direct-acting antiviral regimen (e.g., glecaprevir/pibrentasvir for 8 weeks or sofosbuvir/velpatasvir for 12 weeks) with >95% cure rate", "Liver transplant", "Observation with serial liver biopsies"],
    correctIndex: 1,
    answer: "DAAs have revolutionized HCV treatment. Pangenotypic regimens (effective against all genotypes) include glecaprevir/pibrentasvir (Mavyret, 8 weeks for treatment-naive without cirrhosis) and sofosbuvir/velpatasvir (Epclusa, 12 weeks). SVR (sustained virologic response = cure) rates exceed 95%. Before treatment: assess for cirrhosis (FIB-4, FibroScan), check HBV status (risk of HBV reactivation during HCV treatment), drug interactions, and renal function. Post-SVR: if no cirrhosis, no further HCV monitoring needed; if cirrhosis, continue HCC screening every 6 months.",
    category: "Family NP",
    difficulty: 2,
    image: imgHepatitisC
  },
  // ============================================================
  // PSYCHIATRIC NP (14 cards)
  // ============================================================
  {
    id: "np-psych-q1",
    type: "question",
    question: "An NP is evaluating a patient for treatment-resistant depression (failed 2 adequate antidepressant trials). PHQ-9 is 22. Which augmentation strategy has the strongest evidence?",
    options: ["Add a second SSRI", "Lithium augmentation, aripiprazole augmentation, or esketamine (Spravato) nasal spray", "Switch to a benzodiazepine", "Add methylphenidate"],
    correctIndex: 1,
    answer: "For treatment-resistant depression (TRD), evidence-based augmentation strategies include: (1) Lithium augmentation (most evidence, target level 0.5-0.8 mEq/L), (2) Atypical antipsychotic augmentation (aripiprazole 2-5 mg, quetiapine XR, brexpiprazole all FDA-approved as adjuncts), (3) Esketamine (Spravato) intranasal spray (FDA-approved for TRD, administered in certified healthcare settings with 2-hour monitoring due to dissociative effects and hemodynamic changes). Other options: switching antidepressant class, ECT (most effective for severe TRD), or TMS.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q2",
    type: "question",
    question: "A 22-year-old male presents with first-episode psychosis: auditory hallucinations for 3 months, social withdrawal, and declining academic performance. There is no substance use. What is the recommended first-line treatment approach?",
    options: ["High-dose typical antipsychotic (haloperidol 20 mg)", "Low-dose second-generation antipsychotic (risperidone 2-4 mg or aripiprazole 10-15 mg) with coordinated specialty care (CSC) program referral", "Benzodiazepines for anxiety management only", "No medication until a second psychotic episode occurs"],
    correctIndex: 1,
    answer: "For first-episode psychosis (FEP), guidelines recommend: (1) Low-dose second-generation antipsychotic (SGA) as FEP patients are more sensitive to side effects and respond to lower doses. Aripiprazole and risperidone have the most evidence for FEP. (2) Coordinated Specialty Care (CSC) programs (like NAVIGATE, OnTrackNY) providing team-based care with psychotherapy, family education, supported employment, and case management. Early intervention improves long-term outcomes. Duration of untreated psychosis (DUP) is the strongest predictor of outcome; shorter DUP = better prognosis.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q3",
    type: "question",
    question: "A patient on olanzapine 20 mg for schizophrenia has developed metabolic syndrome (BMI 38, A1C 7.2%, TG 380, HDL 32). Psychiatric symptoms are well-controlled. What is the NP's approach?",
    options: ["Accept metabolic consequences as necessary for psychiatric stability", "Initiate a structured switch to a metabolically favorable antipsychotic (aripiprazole, ziprasidone, or lurasidone) with cross-taper protocol, while managing metabolic parameters", "Abruptly stop olanzapine and start metformin", "Add a second antipsychotic to reduce the olanzapine dose"],
    correctIndex: 1,
    answer: "Metabolic syndrome on olanzapine significantly increases cardiovascular mortality. If psychiatrically stable, a gradual cross-taper to a metabolically favorable SGA (aripiprazole: weight-neutral; ziprasidone: weight-neutral but requires ECG monitoring; lurasidone: favorable metabolic profile) is preferred. Cross-taper over 4-6 weeks to prevent relapse. If the patient cannot tolerate a switch, metformin addition has the strongest evidence for antipsychotic-related weight gain (10-18 lb reduction). Lifestyle intervention should accompany any approach. Monitor metabolic labs per ADA/APA consensus: fasting glucose, lipids, weight at each visit.",
    category: "Psychiatric NP",
    difficulty: 3,
    image: imgMetabolicSyndrome
  },
  {
    id: "np-psych-q4",
    type: "question",
    question: "A patient with generalized anxiety disorder and comorbid alcohol use disorder asks about pharmacological treatment for anxiety. Which medication class should be AVOIDED?",
    options: ["SSRIs", "Buspirone", "Benzodiazepines", "SNRIs"],
    correctIndex: 2,
    answer: "Benzodiazepines are relatively CONTRAINDICATED in patients with substance use disorders due to: (1) cross-tolerance with alcohol (both enhance GABA), (2) high addiction potential, (3) risk of fatal respiratory depression when combined with alcohol, (4) reinforcement of substance-seeking behavior. First-line anxiolytics for GAD with comorbid AUD: SSRIs (sertraline, escitalopram) or buspirone (no abuse potential, no interaction with alcohol). Gabapentin may be considered for both anxiety and alcohol cravings. Naltrexone should be offered for AUD treatment.",
    category: "Psychiatric NP",
    difficulty: 2,
    image: imgAnxiety
  },
  {
    id: "np-psych-q5",
    type: "question",
    question: "An NP is initiating clozapine for a patient with treatment-resistant schizophrenia (failed 2 adequate antipsychotic trials). What mandatory monitoring program must be in place?",
    options: ["Monthly liver function tests", "Clozapine REMS program with ANC monitoring: weekly for 6 months, biweekly for months 6-12, then monthly thereafter", "Annual echocardiogram", "Daily blood pressure monitoring only"],
    correctIndex: 1,
    answer: "Clozapine requires enrollment in the Clozapine REMS program due to the risk of severe neutropenia/agranulocytosis (1-2%). ANC monitoring schedule: weekly for first 6 months, every 2 weeks for months 6-12, monthly after 1 year. ANC <1,500: hold clozapine (1,000 for benign ethnic neutropenia). Additional monitoring: metabolic parameters (highest weight gain risk), myocarditis (first month: troponin, CRP, echocardiogram if symptomatic), seizure risk (dose-dependent, >600 mg), constipation (can be fatal: ileus), and sialorrhea. Despite its monitoring burden, clozapine is the ONLY antipsychotic with demonstrated superiority in treatment-resistant schizophrenia and is the ONLY one shown to reduce suicide risk.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q6",
    type: "question",
    image: imgSerotoninSyndrome,
    question: "A patient on sertraline 200 mg for depression is prescribed tramadol for pain by another provider. The NP notices this combination on medication reconciliation. What is the concern?",
    options: ["No significant interaction exists", "Risk of serotonin syndrome from combined serotonergic activity; tramadol inhibits serotonin reuptake and this combination should be avoided", "Tramadol reduces the effectiveness of sertraline", "Sertraline causes tramadol to be ineffective"],
    correctIndex: 1,
    answer: "Tramadol has serotonin reuptake inhibition properties in addition to its opioid and norepinephrine effects. Combining tramadol with SSRIs (or SNRIs, MAOIs, triptans, St. John's wort) significantly increases the risk of serotonin syndrome: hyperthermia, agitation, clonus, hyperreflexia, diaphoresis, and potentially life-threatening autonomic instability. The NP should contact the prescribing provider, document the interaction, and recommend alternative analgesics (acetaminophen, NSAIDs, or non-serotonergic opioids if necessary).",
    category: "Psychiatric NP",
    difficulty: 2
  },
  {
    id: "np-psych-q7",
    type: "question",
    question: "An NP is evaluating a 17-year-old with suspected bipolar disorder. The patient has episodes of elevated mood lasting 5 days with decreased need for sleep, grandiosity, racing thoughts, and risky behavior alternating with depressive episodes. What distinguishes bipolar I from bipolar II?",
    options: ["Bipolar I has only depression; bipolar II has only mania", "Bipolar I requires at least one manic episode (≥7 days or requiring hospitalization); bipolar II has hypomanic episodes (≥4 days) that do not cause marked impairment", "Bipolar I is less severe than bipolar II", "Bipolar I only occurs in adults"],
    correctIndex: 1,
    answer: "Bipolar I: requires ≥1 manic episode (≥7 days of elevated/irritable mood with ≥3 classic symptoms, OR any duration if hospitalization is required). Depressive episodes are common but not required for diagnosis. Bipolar II: requires ≥1 hypomanic episode (≥4 days, same symptoms but NOT causing marked functional impairment or psychosis, NOT requiring hospitalization) AND ≥1 major depressive episode. This patient's 5-day episode with significant functional impact likely meets criteria for a manic episode (bipolar I). First-line mood stabilizers: lithium, valproate, or SGA monotherapy. Antidepressant monotherapy is contraindicated.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  // ============================================================
  // WOMEN'S HEALTH (10 cards)
  // ============================================================
  {
    id: "np-wh-q1",
    type: "question",
    question: "A 32-year-old G2P1 at 10 weeks gestation presents for her first prenatal visit. Which screening tests are recommended at this visit?",
    options: ["Amniocentesis for all patients", "CBC, blood type/Rh/antibody screen, rubella titer, RPR, HIV, hepatitis B, urinalysis/culture, Pap if due, and offer first-trimester aneuploidy screening", "Only a urine pregnancy test", "Glucose tolerance test and Group B strep culture"],
    correctIndex: 1,
    answer: "First prenatal visit labs per ACOG guidelines: CBC (anemia, thrombocytopenia), blood type/Rh/antibody screen (Rh sensitization risk), rubella titer (immunity status), RPR/VDRL (syphilis), HIV (opt-out screening), hepatitis B surface antigen, urinalysis and urine culture (asymptomatic bacteriuria), Pap smear if due per screening guidelines. Offer first-trimester combined screening (nuchal translucency + serum markers) or cell-free DNA for aneuploidy at 10-13 weeks. GDM screening is at 24-28 weeks; GBS culture at 36-37 weeks.",
    category: "Women's Health",
    difficulty: 2,
    image: imgHepatitisNew
  },
  {
    id: "np-wh-q2",
    type: "question",
    question: "A 28-year-old woman is diagnosed with a chlamydia cervicitis infection. She reports her male partner is asymptomatic. What is the recommended treatment for BOTH the patient and partner?",
    options: ["Patient: azithromycin 1g single dose; partner does not need treatment", "Patient: doxycycline 100 mg BID for 7 days (preferred); partner: expedited partner therapy (EPT) with same regimen or azithromycin 1g single dose", "Patient: ciprofloxacin 500 mg single dose; partner: observation", "Patient: metronidazole; partner: fluconazole"],
    correctIndex: 1,
    answer: "CDC 2021 STI guidelines now recommend doxycycline 100 mg BID for 7 days as preferred treatment for chlamydia (superior efficacy over single-dose azithromycin). Alternative: azithromycin 1g single dose. ALL sexual partners within the past 60 days must be treated. Expedited partner therapy (EPT) — providing prescriptions or medications for the partner through the patient without examining the partner — is legal in most states and improves partner treatment rates. Test of cure is recommended in pregnant patients at 4 weeks. Retest the patient at 3 months for reinfection.",
    category: "Women's Health",
    difficulty: 2,
    image: imgChlamydia
  },
  {
    id: "np-wh-q3",
    type: "question",
    question: "A 55-year-old postmenopausal woman has a Pap smear showing ASC-US with positive high-risk HPV (hrHPV type 16). What is the recommended management per ASCCP guidelines?",
    options: ["Repeat Pap in 1 year", "Colposcopy with biopsy", "Immediate LEEP procedure", "HPV vaccination"],
    correctIndex: 1,
    answer: "ASC-US with positive hrHPV (especially HPV 16 or 18) warrants colposcopy per ASCCP 2019 risk-based management guidelines. HPV 16 is the highest-risk genotype, responsible for approximately 60% of cervical cancers. Colposcopy with directed biopsies evaluates for cervical intraepithelial neoplasia (CIN). If CIN 2-3 is found, excisional treatment (LEEP or cold knife conization) is recommended. If colposcopy is normal with HPV 16, repeat cotesting in 1 year due to persistent high risk. HPV vaccination is not therapeutic for existing infections.",
    category: "Women's Health",
    difficulty: 2
  },
  {
    id: "np-wh-q4",
    type: "question",
    question: "A 40-year-old woman with a history of migraines with aura wants to start combined oral contraceptive pills (COCs). What is the NP's recommendation?",
    options: ["COCs are safe for all women regardless of migraine history", "COCs are contraindicated in migraine with aura due to significantly increased stroke risk; offer progestin-only methods, IUD, or implant", "COCs are only contraindicated if she has migraines daily", "Prescribe COCs with the lowest estrogen dose"],
    correctIndex: 1,
    answer: "Migraine WITH aura is a WHO Category 4 (absolute contraindication) for combined hormonal contraceptives (pills, patch, ring). Estrogen increases stroke risk 2-4 fold in migraine with aura patients through prothrombotic effects. The NP should offer progestin-only methods: progestin-only pill (norethindrone), Depo-Provera, etonogestrel implant (Nexplanon), or hormonal IUD (Mirena). Copper IUD is also an option. Migraine WITHOUT aura is Category 2 (generally use) in women <35 years, and Category 3 (usually avoid) in women ≥35.",
    category: "Women's Health",
    difficulty: 2
  },
  {
    id: "np-wh-q5",
    type: "question",
    question: "An NP is evaluating a 26-year-old woman with heavy menstrual bleeding (menorrhagia). CBC shows Hgb 9.8 g/dL, MCV 72. What is the most appropriate initial diagnostic workup?",
    options: ["No workup needed; prescribe oral contraceptives", "Pregnancy test, TSH, CBC with iron studies, coagulation studies (if adolescent or family history), and pelvic ultrasound", "CT scan of the abdomen and pelvis", "Immediate referral for hysterectomy"],
    correctIndex: 1,
    answer: "Heavy menstrual bleeding (HMB) evaluation per ACOG: (1) pregnancy test (always), (2) CBC and iron studies (confirms iron deficiency anemia), (3) TSH (hypothyroidism causes HMB), (4) coagulation studies in adolescents or family history of bleeding disorders (von Willebrand disease affects up to 13% of women with HMB), (5) pelvic ultrasound to evaluate for structural causes (fibroids, polyps, adenomyosis). PALM-COEIN classification system categorizes causes. Treatment depends on etiology: hormonal therapy (COCs, LNG-IUD most effective), tranexamic acid, or surgical intervention for structural causes.",
    image: imgVonWillebrand,
    category: "Women's Health",
    difficulty: 2
  },
  // ============================================================
  // GERIATRIC NP (10 cards)
  // ============================================================
  {
    id: "np-geri-q1",
    type: "question",
    question: "An NP is reviewing medications for an 82-year-old patient who has been prescribed diphenhydramine for insomnia, oxybutynin for urinary urgency, and amitriptyline for neuropathic pain. What is the primary concern?",
    options: ["No concerns; all medications are appropriate for elderly patients", "High anticholinergic burden increasing risk of cognitive impairment, falls, delirium, and urinary retention per Beers Criteria", "Drug interactions causing hepatotoxicity", "Risk of serotonin syndrome"],
    correctIndex: 1,
    answer: "All three medications have significant anticholinergic properties and are listed on the AGS Beers Criteria as potentially inappropriate for older adults. Cumulative anticholinergic burden increases risk of: cognitive impairment and delirium, falls and fractures, constipation, urinary retention, blurred vision, dry mouth, and tachycardia. The NP should deprescribe: replace diphenhydramine with melatonin or sleep hygiene, switch oxybutynin to mirabegron (beta-3 agonist, no anticholinergic effects), and replace amitriptyline with gabapentin or duloxetine.",
    category: "Geriatric NP",
    difficulty: 2,
    image: imgPeripheralNeuropathy
  },
  {
    id: "np-geri-q2",
    type: "question",
    question: "An NP is evaluating an 85-year-old patient with hypertension. The patient's current BP is 148/78 on amlodipine 5 mg. Per current guidelines, what is the appropriate BP target for this patient?",
    options: ["<120/80 for all patients regardless of age", "<130/80 per ACC/AHA 2017 guidelines, but individualize based on frailty, fall risk, and comorbidities", "<160/90 per JNC 8 relaxed goals for those over 80", "No treatment is needed above age 80"],
    correctIndex: 1,
    answer: "BP management in the very elderly requires individualization. ACC/AHA 2017 guidelines recommend <130/80 for most adults, but clinical judgment is essential for frail elderly patients. Consider: fall risk (orthostatic hypotension from aggressive BP control causes falls), cognitive function (hypotension may worsen cognitive impairment), functional status, and life expectancy. SPRINT trial showed benefit of intensive control in those ≥75, BUT excluded nursing home residents and those with dementia. The NP should assess orthostatic BP, review fall history, and adjust targets accordingly.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q3",
    type: "question",
    question: "An 80-year-old patient with moderate Alzheimer disease is agitated and aggressive toward caregivers. The family requests medication. What is the NP's evidence-based approach?",
    options: ["Prescribe haloperidol 5 mg IM for immediate sedation", "First identify and treat underlying causes (pain, UTI, constipation, environmental triggers); if medication is needed after non-pharmacological interventions fail, use the lowest effective dose of an SGA with informed consent about risks (boxed warning)", "Prescribe benzodiazepines for long-term use", "Physical restraints are first-line"],
    correctIndex: 1,
    answer: "DICE approach (Describe, Investigate, Create, Evaluate): first identify treatable triggers for behavioral and psychological symptoms of dementia (BPSD): unrecognized pain (use PAINAD scale), UTI, constipation, medication side effects, environmental overstimulation. Non-pharmacological interventions are first-line: music therapy, redirection, structured activities, caregiver education. If medication is necessary, SGAs (risperidone, aripiprazole) at the lowest effective dose may be used with informed consent: ALL antipsychotics carry an FDA boxed warning for increased mortality in elderly with dementia-related psychosis. Regular reassessment and deprescribing attempts are mandatory.",
    category: "Geriatric NP",
    difficulty: 3
  },
  {
    id: "np-geri-q4",
    type: "question",
    question: "An NP is conducting a comprehensive geriatric assessment for a 78-year-old patient. Which domains must be evaluated?",
    options: ["Blood pressure and heart rate only", "Functional status (ADLs/IADLs), cognition (Mini-Cog/MoCA), mood (GDS/PHQ-9), gait and fall risk (Timed Up and Go), nutrition (MNA), medication review (Beers Criteria), social support, and advance directives", "Only cognition and mobility", "Vision and hearing screening alone"],
    correctIndex: 1,
    answer: "The comprehensive geriatric assessment (CGA) is a multidimensional, interdisciplinary process that evaluates: functional status (Katz ADL index for basic ADLs, Lawton IADL scale for instrumental ADLs), cognitive function (Mini-Cog screening, MoCA for more detailed assessment), mood/depression (Geriatric Depression Scale or PHQ-9), gait/balance/fall risk (Timed Up and Go, Tinetti), nutritional status (Mini Nutritional Assessment, weight trend), medication review (Beers Criteria, deprescribing), vision and hearing, continence, social support/safety, caregiver burden, and advance care planning. CGA has been shown to improve outcomes in hospitalized and community-dwelling elderly.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q5",
    type: "question",
    question: "An NP is managing an 88-year-old patient with a new diagnosis of atrial fibrillation. CHA₂DS₂-VASc score is 5. The patient has a history of falls. Should anticoagulation be initiated?",
    options: ["No, falls are an absolute contraindication to anticoagulation", "Yes, anticoagulate with a DOAC; the stroke risk from untreated AFib far exceeds the bleeding risk from falls in most patients", "Use aspirin instead of anticoagulation", "Defer to cardiology only"],
    correctIndex: 1,
    answer: "Fall risk alone is NOT a contraindication to anticoagulation in AFib. Studies show a patient would need to fall approximately 295 times per year for the bleeding risk to outweigh the stroke prevention benefit. With a CHA₂DS₂-VASc of 5, the annual stroke risk is approximately 6.7%. DOACs (apixaban preferred in elderly due to better safety profile in renal impairment and elderly) are preferred over warfarin. Assess and mitigate fall risk (physical therapy, medication review, home safety). HAS-BLED score helps identify modifiable bleeding risk factors.",
    category: "Geriatric NP",
    difficulty: 3
  },
  // ============================================================
  // RESEARCH & EBP (8 cards)
  // ============================================================
  {
    id: "np-ebp-q1",
    type: "question",
    question: "An NP is critically appraising a randomized controlled trial (RCT). The study reports that Drug A reduces mortality by 1% (from 2% to 1%) compared to placebo. The NNT is 100. What does this mean clinically?",
    options: ["Drug A is extremely effective and should be prescribed to all patients", "100 patients would need to be treated with Drug A for 1 additional patient to benefit (avoid death) compared to placebo", "The relative risk reduction is only 1%", "The NNT indicates the drug is harmful"],
    correctIndex: 1,
    answer: "NNT (Number Needed to Treat) is calculated as 1/ARR (Absolute Risk Reduction). ARR = 2% - 1% = 1% = 0.01. NNT = 1/0.01 = 100. This means 100 patients must be treated for 1 additional patient to benefit. While the RELATIVE risk reduction is 50% (impressive sounding), the ABSOLUTE risk reduction is only 1% (more clinically meaningful). The NP must consider NNT alongside cost, side effects, patient preferences, and NNH (Number Needed to Harm) to make shared clinical decisions.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q2",
    type: "question",
    question: "An NP is searching for the best evidence to answer a clinical question about treatment effectiveness. Which level of evidence is highest on the evidence hierarchy?",
    options: ["Expert opinion", "Single randomized controlled trial", "Systematic review and meta-analysis of RCTs", "Cohort study"],
    correctIndex: 2,
    answer: "The evidence hierarchy (strongest to weakest): (1) Systematic reviews and meta-analyses of RCTs (synthesize all available high-quality evidence), (2) Individual RCTs, (3) Cohort studies, (4) Case-control studies, (5) Case series/reports, (6) Expert opinion/editorials. Meta-analyses combine data from multiple RCTs using statistical methods, increasing sample size and statistical power. The NP should use the PICO framework (Population, Intervention, Comparison, Outcome) to formulate searchable clinical questions and seek the highest available level of evidence.",
    category: "Research & EBP",
    difficulty: 1
  },
  {
    id: "np-ebp-q3",
    type: "question",
    question: "An NP reads a study reporting a screening test has a sensitivity of 95% and specificity of 70%. When the prevalence of the disease is low (1%), what happens to the positive predictive value (PPV)?",
    options: ["PPV remains high at 95%", "PPV is very low because most positive results will be false positives in a low-prevalence population", "PPV is not affected by prevalence", "Specificity determines PPV, not prevalence"],
    correctIndex: 1,
    answer: "PPV is heavily influenced by disease prevalence. With 95% sensitivity and 70% specificity in a population with 1% prevalence: among 10,000 people, 100 have the disease (1%). The test correctly identifies 95 true positives. Among 9,900 without disease, 30% (2,970) are false positives. PPV = 95/(95+2,970) = 3.1%. This means 97% of positive results are FALSE positives. This is why screening tests work best in higher-prevalence populations and why confirmatory testing is essential after positive screening results.",
    category: "Research & EBP",
    difficulty: 3
  },
  {
    id: "np-ebp-q4",
    type: "question",
    question: "An NP is implementing an evidence-based practice change in a clinic using the Iowa Model. What is the first step?",
    options: ["Implement the change immediately", "Identify a triggering issue or opportunity (clinical problem or new evidence), then determine if it is a priority for the organization", "Write a research grant proposal", "Publish findings in a journal"],
    correctIndex: 1,
    answer: "The Iowa Model of EBP: (1) Identify triggering issues (clinical problem, new evidence, quality data), (2) Determine organizational priority, (3) Form a team, (4) Assemble and critically appraise relevant evidence, (5) Determine if sufficient evidence exists for change, (6) Design a pilot implementation, (7) Evaluate outcomes, (8) If successful, implement system-wide and disseminate. Other EBP models include the Johns Hopkins Nursing EBP Model (PET process: Practice question, Evidence, Translation), the Stetler Model, and the ACE Star Model.",
    category: "Research & EBP",
    difficulty: 2
  },
  // ============================================================
  // HEALTH POLICY (6 cards)
  // ============================================================
  {
    id: "np-policy-q1",
    type: "question",
    question: "An NP practicing in a full practice authority (FPA) state wants to open an independent primary care clinic. What does full practice authority mean?",
    options: ["The NP must have a collaborative agreement with a physician at all times", "The NP can evaluate, diagnose, interpret diagnostic tests, and initiate and manage treatments including prescribing controlled substances independently without physician oversight", "The NP can only prescribe non-controlled medications", "Full practice authority only applies to hospital settings"],
    correctIndex: 1,
    answer: "Full practice authority (FPA) means NPs can practice to the full extent of their education and training without mandatory physician collaboration or supervision requirements. FPA states allow NPs to: independently evaluate and diagnose, order and interpret diagnostics, initiate and manage treatment plans, prescribe medications including controlled substances (DEA required), and practice independently. As of 2024, 27 states plus DC and two territories have FPA. The AANP and other organizations continue to advocate for FPA nationally to improve access to care, particularly in underserved areas.",
    category: "Health Policy",
    difficulty: 1
  },
  {
    id: "np-policy-q2",
    type: "question",
    question: "An NP is prescribing buprenorphine for opioid use disorder. Under the 2023 federal changes, what is the current prescribing requirement?",
    options: ["NPs still need an X-waiver and are limited to 30 patients", "The X-waiver requirement was eliminated in 2023; any DEA-registered practitioner with a schedule III authority can prescribe buprenorphine for OUD without additional certification", "Only physicians can prescribe buprenorphine", "Buprenorphine requires a special state license separate from DEA registration"],
    correctIndex: 1,
    answer: "The Consolidated Appropriations Act of 2023 eliminated the X-waiver requirement for prescribing buprenorphine. Any practitioner with a valid DEA registration and schedule III prescribing authority can now prescribe buprenorphine for OUD without additional training, certification, or patient limits. However, DEA-registered practitioners must complete 8 hours of training on treating substance use disorders as part of their next DEA registration renewal. This change dramatically expands access to medication-assisted treatment (MAT) for opioid use disorder.",
    category: "Health Policy",
    difficulty: 2
  },
  {
    id: "np-policy-q3",
    type: "question",
    question: "An NP is seeing a 20-year-old patient who discloses suicidal ideation. The patient asks the NP not to tell anyone. What are the NP's legal and ethical obligations?",
    options: ["Respect the patient's wishes and maintain confidentiality", "Duty to protect: the NP must take reasonable steps to protect the patient from self-harm, which may include involuntary commitment, contacting emergency services, or notifying appropriate parties despite the patient's wishes", "Only break confidentiality if the patient is under 18", "Refer to psychiatry and take no further action"],
    correctIndex: 1,
    answer: "When a patient expresses suicidal ideation, the NP has a duty to protect that overrides confidentiality. This originates from Tarasoff v. Regents (1976, duty to warn/protect) and state-specific involuntary commitment statutes. The NP should: conduct a thorough suicide risk assessment (ideation, plan, means, intent, protective factors), use validated tools (Columbia Suicide Severity Rating Scale), implement safety measures (lethal means restriction), and if imminent risk exists, initiate emergency psychiatric evaluation or involuntary hold as permitted by state law. Document the assessment and clinical decision-making thoroughly.",
    category: "Health Policy",
    difficulty: 2
  },
  {
    id: "np-policy-q4",
    type: "question",
    question: "An NP is advocating for scope of practice expansion in a restricted practice state. Which organization's position statement best supports removal of collaborative agreement requirements?",
    options: ["The AMA recommends expanded NP independence", "The National Academy of Medicine (formerly IOM) recommends NPs practice to the full extent of their education and training", "The Joint Commission requires physician oversight of all NPs", "CMS mandates collaborative agreements in all states"],
    correctIndex: 1,
    answer: "The National Academy of Medicine's 2010 landmark report 'The Future of Nursing' recommended that NPs should practice to the full extent of their education and training. This was reaffirmed in the 2021 follow-up report. The FTC has also advocated against unnecessary practice restrictions as anticompetitive. These positions support legislative efforts to remove collaborative agreement requirements.",
    category: "Health Policy",
    difficulty: 2
  },
  {
    id: "np-policy-q5",
    type: "question",
    question: "An NP receives a subpoena for a patient's medical records. What is the appropriate first action?",
    options: ["Immediately release all records to comply with the subpoena", "Contact the practice's legal counsel before releasing any records", "Ignore the subpoena since it violates HIPAA", "Ask the patient to sign a release form"],
    correctIndex: 1,
    answer: "Upon receiving a subpoena, the NP should first contact legal counsel. A subpoena alone may not be sufficient to release records under HIPAA; a court order or patient authorization may also be required. The NP should verify the subpoena's validity, determine if a qualified protective order is needed, and ensure compliance with both federal (HIPAA) and state privacy laws before releasing any information.",
    category: "Health Policy",
    difficulty: 2
  },
  {
    id: "np-policy-q6",
    type: "question",
    question: "An NP is billing Medicare for a comprehensive visit. Under current CMS guidelines, which statement about NP reimbursement is accurate?",
    options: ["NPs are reimbursed at 100% of the physician fee schedule", "NPs are reimbursed at 85% of the physician fee schedule when billing independently", "NPs cannot bill Medicare directly", "NPs are reimbursed at 50% of the physician fee schedule"],
    correctIndex: 1,
    answer: "Medicare reimburses NPs at 85% of the physician fee schedule when billing under their own NPI. When billing 'incident to' a physician, reimbursement is at 100% but requires the physician to be present in the office suite and to have initiated the plan of care. Understanding billing nuances is essential for NP practice viability and revenue optimization.",
    category: "Health Policy",
    difficulty: 1
  },
  // ============================================================
  // CARDIOLOGY NP (12 cards)
  // ============================================================
  {
    id: "np-cardio-q1",
    type: "question",
    question: "A 58-year-old patient with newly diagnosed HFrEF (EF 25%) and NYHA Class III symptoms is initiated on guideline-directed medical therapy. Which combination represents the four pillars of GDMT?",
    options: ["ACEi + beta-blocker + CCB + statin", "ARNI + beta-blocker + MRA + SGLT2 inhibitor", "Digoxin + hydralazine + isosorbide dinitrate + diuretic", "ARB + alpha-blocker + loop diuretic + amiodarone"],
    correctIndex: 1,
    answer: "The four pillars of GDMT for HFrEF (2022 AHA/ACC/HFSA guidelines) are: (1) ARNI (sacubitril/valsartan) or ACEi/ARB, (2) Evidence-based beta-blocker (carvedilol, metoprolol succinate, bisoprolol), (3) MRA (spironolactone or eplerenone), and (4) SGLT2 inhibitor (dapagliflozin or empagliflozin). All four reduce mortality independently and should be initiated and titrated to target doses.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q2",
    type: "question",
    question: "A patient presents with exertional dyspnea and a harsh crescendo-decrescendo systolic murmur best heard at the right upper sternal border radiating to the carotids. What is the most likely diagnosis?",
    options: ["Mitral regurgitation", "Aortic stenosis", "Mitral valve prolapse", "Aortic regurgitation"],
    correctIndex: 1,
    answer: "Aortic stenosis produces a harsh crescendo-decrescendo systolic murmur at the right second intercostal space radiating to the carotids. The classic triad is syncope, angina, and heart failure. Pulsus parvus et tardus (weak and delayed carotid upstroke) is a classic finding. Severe AS (valve area <1.0 cm², mean gradient >40 mmHg) requires surgical or transcatheter aortic valve replacement (TAVR).",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q3",
    type: "question",
    question: "A 72-year-old patient with atrial fibrillation has a CHA₂DS₂-VASc score of 4. Which anticoagulation strategy is recommended?",
    options: ["Aspirin 81 mg daily", "No anticoagulation needed", "Direct oral anticoagulant (DOAC) such as apixaban or rivaroxaban", "Clopidogrel 75 mg daily"],
    correctIndex: 2,
    answer: "A CHA₂DS₂-VASc score ≥2 in men or ≥3 in women indicates anticoagulation is recommended. DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) are preferred over warfarin for non-valvular AF due to lower bleeding risk, predictable pharmacokinetics, and no routine INR monitoring. Apixaban has the best safety profile. DOACs are contraindicated in mechanical heart valves and moderate-to-severe mitral stenosis.",
    category: "Cardiology NP",
    difficulty: 2
  },
  {
    id: "np-cardio-q4",
    type: "question",
    question: "A patient with STEMI presents within 90 minutes of symptom onset. The nearest PCI-capable facility is 45 minutes away. What is the recommended reperfusion strategy?",
    options: ["Administer fibrinolytics immediately", "Transport to PCI-capable facility for primary PCI", "Start heparin drip and observe", "Administer aspirin only and wait for cardiac catheterization the next day"],
    correctIndex: 1,
    answer: "Primary PCI is the preferred reperfusion strategy for STEMI if first medical contact-to-device time is ≤120 minutes. Since the PCI facility is 45 minutes away (well within the 120-minute window), transfer for primary PCI is recommended. Fibrinolytic therapy is indicated only when PCI cannot be performed within 120 minutes. Door-to-balloon time goal is ≤90 minutes at PCI-capable facilities.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q5",
    type: "question",
    question: "A patient with chronic stable angina on maximally tolerated doses of metoprolol and amlodipine continues to have 2-3 episodes of angina weekly. Which add-on medication is appropriate?",
    options: ["Verapamil", "Ranolazine (Ranexa)", "Diltiazem", "Propranolol"],
    correctIndex: 1,
    answer: "Ranolazine is a late sodium channel inhibitor approved as add-on therapy for chronic stable angina. It reduces angina frequency without affecting heart rate or blood pressure. It should not be combined with QT-prolonging drugs. Verapamil and diltiazem should not be added to a beta-blocker regimen due to risk of severe bradycardia and heart block.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q6",
    type: "question",
    question: "An NP is interpreting a 12-lead ECG and notes ST depression in leads V1-V4 with tall R waves. What does this suggest?",
    options: ["Anterior STEMI", "Posterior STEMI (reciprocal changes)", "Left bundle branch block", "Pericarditis"],
    correctIndex: 1,
    answer: "ST depression in V1-V4 with tall R waves represents reciprocal changes of a posterior STEMI. A posterior ECG (leads V7-V9) should be obtained, which would show ST elevation. Posterior MI often accompanies inferior STEMI and is frequently missed. It involves the posterior descending artery or left circumflex territory.",
    category: "Cardiology NP",
    difficulty: 3,
    image: imgBBBFlashcard
  },
  {
    id: "np-cardio-q7",
    type: "question",
    question: "A 45-year-old patient presents with sudden-onset tearing chest pain radiating to the back, blood pressure of 210/120, and a 20 mmHg difference between arms. What is the priority diagnosis to rule out?",
    options: ["Myocardial infarction", "Aortic dissection", "Pulmonary embolism", "Pneumothorax"],
    correctIndex: 1,
    answer: "The classic presentation of aortic dissection includes sudden-onset tearing/ripping chest/back pain, hypertension, and pulse/BP differential between extremities. Type A (ascending aorta) requires emergent surgery. Type B (descending) is managed medically with IV beta-blockers (esmolol, labetalol) to reduce heart rate <60 bpm and SBP 100-120 mmHg. CT angiography is the diagnostic gold standard.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q8",
    type: "question",
    question: "A patient with hypertrophic cardiomyopathy (HCM) asks about exercise restrictions. Which activity modification is most important?",
    options: ["Encourage vigorous aerobic exercise to strengthen the heart", "Avoid competitive sports and intense physical exertion due to risk of sudden cardiac death", "Only restrict swimming", "No restrictions are needed if asymptomatic"],
    correctIndex: 1,
    answer: "HCM is the leading cause of sudden cardiac death in young athletes. Patients should avoid competitive sports, heavy lifting, and intense exertion, which can worsen left ventricular outflow tract obstruction. The 2020 AHA/ACC guidelines recommend shared decision-making regarding exercise. Implantable cardioverter-defibrillators (ICDs) are recommended for high-risk patients.",
    category: "Cardiology NP",
    difficulty: 2
  },
  {
    id: "np-cardio-q9",
    type: "question",
    question: "A patient on amiodarone presents with fatigue, weight gain, cold intolerance, and TSH of 12 mIU/L. What is the most likely etiology?",
    options: ["Amiodarone-induced hyperthyroidism", "Amiodarone-induced hypothyroidism", "Hashimoto's thyroiditis unrelated to amiodarone", "Pituitary adenoma"],
    correctIndex: 1,
    answer: "Amiodarone contains 37% iodine by weight and can cause both hypothyroidism (more common in iodine-sufficient areas) and hyperthyroidism. Elevated TSH with symptoms of hypothyroidism indicates amiodarone-induced hypothyroidism. Treatment is levothyroxine replacement. Thyroid function should be monitored every 6 months while on amiodarone. Amiodarone also requires monitoring of liver function, pulmonary function, and ophthalmologic exams.",
    category: "Cardiology NP",
    difficulty: 3,
    image: imgHypothyroidismNew
  },
  {
    id: "np-cardio-q10",
    type: "question",
    question: "A patient with a new diagnosis of heart failure has an EF of 55%. Which classification does this represent, and what are the treatment considerations?",
    options: ["HFrEF; start ARNI and beta-blocker", "HFpEF; focus on managing comorbidities (hypertension, volume status, AF) and consider SGLT2 inhibitor", "Normal cardiac function; no treatment needed", "Systolic heart failure; start digoxin"],
    correctIndex: 1,
    answer: "EF ≥50% with symptoms of heart failure is classified as HFpEF (heart failure with preserved ejection fraction). Treatment focuses on managing comorbidities (hypertension, diabetes, obesity, AF), diuretics for volume management, and SGLT2 inhibitors (empagliflozin approved based on EMPEROR-Preserved trial). Unlike HFrEF, ARNI and beta-blockers have not shown mortality benefit in HFpEF.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q11",
    type: "question",
    question: "A patient with a mechanical mitral valve replacement asks about anticoagulation. Which is the recommended long-term anticoagulant?",
    options: ["Apixaban (Eliquis)", "Rivaroxaban (Xarelto)", "Warfarin with target INR 2.5-3.5", "Dabigatran (Pradaxa)"],
    correctIndex: 2,
    answer: "Warfarin remains the only recommended anticoagulant for mechanical heart valves. DOACs are contraindicated due to increased thromboembolic events (RE-ALIGN trial with dabigatran was stopped early due to harm). Target INR for mechanical mitral valves is 2.5-3.5. Mechanical aortic valves target INR 2.0-3.0. Bioprosthetic valves may use DOACs after 3-6 months.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-cardio-q12",
    type: "question",
    question: "A 65-year-old patient with resistant hypertension (uncontrolled on 3 drugs including a diuretic) should be evaluated for which secondary cause?",
    options: ["Pheochromocytoma only", "Primary aldosteronism (Conn syndrome)", "Anxiety disorder", "Medication non-adherence only"],
    correctIndex: 1,
    answer: "Primary aldosteronism is the most common cause of secondary hypertension and is found in 10-20% of resistant hypertension cases. Screen with aldosterone-to-renin ratio (ARR). Other secondary causes include renal artery stenosis, pheochromocytoma, Cushing syndrome, thyroid disorders, and obstructive sleep apnea. Medication adherence should also be confirmed before diagnosing resistant hypertension.",
    category: "Cardiology NP",
    difficulty: 3
  },
  // ============================================================
  // ENDOCRINE NP (12 cards)
  // ============================================================
  {
    id: "np-endo-q1",
    type: "question",
    question: "A patient with type 2 diabetes has an A1C of 9.2% on metformin 2000 mg daily. They have established ASCVD. Which second agent provides the greatest cardiovascular benefit?",
    options: ["Glipizide (sulfonylurea)", "Liraglutide (GLP-1 receptor agonist)", "Pioglitazone (thiazolidinedione)", "Acarbose (alpha-glucosidase inhibitor)"],
    correctIndex: 1,
    answer: "GLP-1 receptor agonists (liraglutide, semaglutide, dulaglutide) have demonstrated cardiovascular benefit in patients with established ASCVD (LEADER, SUSTAIN-6, REWIND trials). ADA/EASD guidelines recommend GLP-1 RAs or SGLT2 inhibitors as preferred second-line agents in patients with ASCVD, heart failure, or CKD regardless of A1C. They also promote weight loss and have low hypoglycemia risk.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-endo-q2",
    type: "question",
    question: "A patient presents with heat intolerance, weight loss, tremor, exophthalmos, and a diffusely enlarged thyroid. TSH is <0.01, free T4 is 5.8. What is the diagnosis, and what is the initial treatment?",
    options: ["Hashimoto's thyroiditis; levothyroxine", "Graves' disease; methimazole (preferred) or propylthiouracil", "Toxic multinodular goiter; surgery only", "Subacute thyroiditis; NSAIDs"],
    correctIndex: 1,
    answer: "Graves' disease is an autoimmune hyperthyroidism with TSH receptor antibodies (TRAb/TSI). Exophthalmos and pretibial myxedema are unique to Graves'. First-line treatment is methimazole (preferred due to fewer side effects). PTU is preferred in the first trimester of pregnancy and thyroid storm. Beta-blockers (propranolol) for symptomatic relief. Monitor for agranulocytosis (sore throat, fever = stop drug immediately).",
    category: "Endocrine NP",
    difficulty: 2,
    image: imgGravesDisease
  },
  {
    id: "np-endo-q3",
    type: "question",
    question: "A patient with DKA has a blood glucose of 350 mg/dL, pH 7.18, HCO3 8, and potassium of 5.8. What is the priority intervention before starting insulin?",
    options: ["Administer IV insulin bolus immediately", "Give IV sodium bicarbonate", "Initiate aggressive IV normal saline resuscitation", "Administer IV potassium"],
    correctIndex: 2,
    answer: "The priority in DKA management is aggressive IV fluid resuscitation with 0.9% NS (1-1.5 L/hr initially) to correct dehydration and improve perfusion. Although serum K+ is elevated (5.8), this is due to acidosis-induced transcellular shift; total body potassium is depleted. Once K+ drops below 5.3 and urine output is adequate, add potassium to IV fluids BEFORE or concurrent with insulin to prevent life-threatening hypokalemia as insulin drives K+ intracellularly.",
    category: "Endocrine NP",
    difficulty: 3,
    image: imgDKA
  },
  {
    id: "np-endo-q4",
    type: "question",
    question: "A 55-year-old woman presents with fatigue, constipation, weight gain, and dry skin. TSH is 12 mIU/L, free T4 is 0.4 ng/dL. Anti-TPO antibodies are positive. What is the diagnosis and treatment?",
    options: ["Subacute thyroiditis; observation", "Hashimoto's thyroiditis; levothyroxine replacement", "Graves' disease; methimazole", "Euthyroid sick syndrome; no treatment"],
    correctIndex: 1,
    answer: "Hashimoto's thyroiditis is the most common cause of hypothyroidism in iodine-sufficient areas. Positive anti-TPO antibodies confirm autoimmune etiology. Treatment is levothyroxine (1.6 mcg/kg/day). Start at lower doses in elderly or cardiac patients (25-50 mcg daily). Recheck TSH in 6-8 weeks. Goal TSH is 0.5-2.5 mIU/L. Take on empty stomach, 30-60 minutes before breakfast. Avoid calcium and iron within 4 hours.",
    category: "Endocrine NP",
    difficulty: 2,
    image: imgHashimotoThyroiditis
  },
  {
    id: "np-endo-q5",
    type: "question",
    question: "A patient with type 2 diabetes and CKD stage 3b (eGFR 35) needs intensification of glycemic control. Which medication should be avoided?",
    options: ["Insulin glargine", "Empagliflozin (SGLT2i)", "Metformin", "Linagliptin (DPP-4i)"],
    correctIndex: 2,
    answer: "Metformin should be avoided when eGFR <30 mL/min and used with caution at eGFR 30-45. Risk of lactic acidosis increases with declining renal function. SGLT2 inhibitors can be initiated if eGFR ≥20 (for cardiorenal benefit per CREDENCE/DAPA-CKD trials). Linagliptin does not require renal dose adjustment. Insulin is safe at any eGFR level.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-endo-q6",
    type: "question",
    question: "A patient on long-term prednisone 20 mg daily presents with moon face, central obesity, striae, and a blood glucose of 280 mg/dL. Which test confirms iatrogenic Cushing syndrome?",
    options: ["Random cortisol level", "24-hour urine free cortisol (will be elevated but diagnosis is clinical in iatrogenic cases)", "ACTH stimulation test", "Dexamethasone suppression test"],
    correctIndex: 1,
    answer: "Iatrogenic Cushing syndrome is diagnosed clinically based on exogenous glucocorticoid use and cushingoid features. The 24-hour urine free cortisol and midnight salivary cortisol will be elevated. However, the dexamethasone suppression test is used to diagnose endogenous Cushing syndrome, not iatrogenic. ACTH will be suppressed in iatrogenic cases (exogenous steroids suppress the HPA axis). Management involves gradual taper to prevent adrenal crisis.",
    category: "Endocrine NP",
    difficulty: 3,
    image: imgCushings
  },
  {
    id: "np-endo-q7",
    type: "question",
    question: "A postmenopausal woman with osteoporosis (T-score -3.2) and a history of vertebral fracture asks about treatment options. Which first-line medication reduces both vertebral and hip fracture risk?",
    options: ["Calcium and vitamin D supplementation alone", "Alendronate (bisphosphonate)", "Calcitonin nasal spray", "Raloxifene"],
    correctIndex: 1,
    answer: "Bisphosphonates (alendronate, risedronate, zoledronic acid) are first-line for osteoporosis and reduce both vertebral and hip fracture risk. Take oral bisphosphonates on an empty stomach with a full glass of water, remain upright for 30 minutes to prevent esophageal erosion. For very high fracture risk, anabolic agents (teriparatide, romosozumab) may be considered first. Denosumab is an alternative for bisphosphonate-intolerant patients.",
    category: "Endocrine NP",
    difficulty: 2,
    image: imgOsteoporosis
  },
  {
    id: "np-endo-q8",
    type: "question",
    question: "A patient presents with episodic headaches, palpitations, and diaphoresis with severe hypertension (240/130 mmHg). Which condition should be evaluated, and what is the initial diagnostic test?",
    options: ["Essential hypertension; start lisinopril", "Pheochromocytoma; 24-hour urine fractionated metanephrines or plasma free metanephrines", "Panic disorder; prescribe an SSRI", "Thyroid storm; check TSH"],
    correctIndex: 1,
    answer: "The classic triad of headache, palpitations, and diaphoresis with paroxysmal hypertension suggests pheochromocytoma. Initial screening is plasma free metanephrines (highest sensitivity) or 24-hour urine fractionated metanephrines and catecholamines. If positive, localize with CT/MRI of abdomen. Preoperative alpha-blockade (phenoxybenzamine) must be started BEFORE beta-blockade to prevent hypertensive crisis. Surgical resection is definitive treatment.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-endo-q9",
    type: "question",
    question: "A patient with Addison's disease presents to the ED with hypotension, severe fatigue, abdominal pain, and hyperpigmentation after abruptly stopping hydrocortisone. What is the immediate treatment?",
    options: ["Oral hydrocortisone 20 mg", "IV hydrocortisone 100 mg bolus, then 50 mg every 8 hours, plus aggressive IV fluids", "IV dexamethasone and vasopressors only", "Fludrocortisone alone"],
    correctIndex: 1,
    answer: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening emergency requiring immediate IV hydrocortisone 100 mg bolus followed by 50 mg q8h, aggressive IV normal saline for volume resuscitation, and dextrose if hypoglycemic. Triggers include abrupt steroid withdrawal, infection, surgery, or trauma in patients with known adrenal insufficiency. Patients should carry emergency injection kits and wear medical alert identification.",
    image: imgAddisons,
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-endo-q10",
    type: "question",
    question: "A patient with type 1 diabetes on an insulin pump presents with nausea, vomiting, and blood glucose of 420 mg/dL. Urine ketones are large. The pump site appears normal. What is the first action?",
    options: ["Increase the insulin pump basal rate", "Disconnect the pump and give a correction dose via insulin syringe, then troubleshoot the pump", "Drink fluids and wait for the blood glucose to come down", "Switch to an oral hypoglycemic agent"],
    correctIndex: 1,
    answer: "In pump-dependent patients with hyperglycemia and ketones, pump malfunction is suspected even if the site appears normal (kinked cannula, insulin degradation, tubing occlusion). The priority is to give a correction dose of rapid-acting insulin via syringe or pen (not through the pump) to ensure insulin delivery. Then troubleshoot: change infusion set, reservoir, and insulin. If DKA develops, initiate standard DKA protocol.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-endo-q11",
    type: "question",
    question: "A patient with a thyroid nodule has fine-needle aspiration (FNA) results classified as Bethesda IV (follicular neoplasm). What is the recommended next step?",
    options: ["Repeat FNA in 6 months", "Radioactive iodine ablation", "Diagnostic thyroid lobectomy or molecular testing", "Start levothyroxine suppressive therapy"],
    correctIndex: 2,
    answer: "Bethesda IV (follicular neoplasm/suspicious for follicular neoplasm) cannot distinguish benign follicular adenoma from follicular carcinoma on cytology alone. Recommended management is diagnostic thyroid lobectomy for histological evaluation or molecular testing (Afirma, ThyroSeq) to guide management. If molecular testing suggests benign, surveillance may be appropriate. If malignant features are found, completion thyroidectomy is performed.",
    category: "Endocrine NP",
    difficulty: 3,
    image: imgHypothyroidismNew
  },
  {
    id: "np-endo-q12",
    type: "question",
    question: "A patient with SIADH has a serum sodium of 118 mEq/L with symptoms of confusion and lethargy. What is the treatment approach?",
    options: ["Rapid IV normal saline bolus to correct sodium to 140 quickly", "Hypertonic saline (3%) with careful monitoring, correcting sodium no faster than 8-10 mEq/L in 24 hours", "Fluid bolus with D5W", "Oral sodium chloride tablets only"],
    correctIndex: 1,
    answer: "Symptomatic severe hyponatremia (Na <120 with neurological symptoms) requires 3% hypertonic saline. Correction must not exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis). Monitor sodium every 2-4 hours. For chronic SIADH, fluid restriction (800-1000 mL/day), demeclocycline, or vasopressin receptor antagonists (tolvaptan) may be used.",
    image: imgSIADH,
    category: "Endocrine NP",
    difficulty: 3
  },
  // ============================================================
  // ACUTE CARE NP – EXPANDED (12 cards)
  // ============================================================
  {
    id: "np-acute-q17",
    type: "question",
    question: "A patient in the ICU develops a sudden increase in peak inspiratory pressure on mechanical ventilation with absent breath sounds on the right and tracheal deviation to the left. What is the immediate intervention?",
    options: ["Obtain a chest X-ray first", "Needle decompression at the second intercostal space, midclavicular line on the right", "Increase the ventilator tidal volume", "Suction the endotracheal tube"],
    correctIndex: 1,
    answer: "This presentation is classic for tension pneumothorax: absent breath sounds on the affected side, tracheal deviation away from the affected side, increased ventilatory pressures, and hemodynamic instability. This is a clinical diagnosis that requires immediate needle decompression at the 2nd ICS midclavicular line, followed by chest tube insertion. Do not delay treatment for imaging.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q18",
    type: "question",
    question: "A patient with acute pancreatitis has a Ranson score of 6 on admission. What does this indicate about prognosis?",
    options: ["Mild disease with <1% mortality", "Moderate disease with 10% mortality", "Severe disease with approximately 40% mortality", "The Ranson score is not valid for pancreatitis"],
    correctIndex: 2,
    answer: "Ranson criteria predict severity and mortality in acute pancreatitis. Score ≥3 indicates severe pancreatitis. Score of 6 carries approximately 40% mortality. On admission criteria: age >55, WBC >16,000, glucose >200, LDH >350, AST >250. At 48 hours: HCT drop >10%, BUN rise >5, Ca <8, PaO2 <60, base deficit >4, fluid sequestration >6L. CT severity index (Balthazar) is also used for prognosis.",
    category: "Acute Care NP",
    difficulty: 3,
    image: imgPancreatitis
  },
  {
    id: "np-acute-q19",
    type: "question",
    question: "A patient post-cardiac surgery develops cardiac tamponade. Which physical finding is most specific?",
    options: ["Hypertension", "Pulsus paradoxus >10 mmHg", "Bounding pulses", "Wide pulse pressure"],
    correctIndex: 1,
    answer: "Pulsus paradoxus (>10 mmHg drop in systolic BP during inspiration) is the most specific clinical finding of cardiac tamponade. Beck's triad (hypotension, muffled heart sounds, JVD) is classic but not always present. Echocardiography confirms the diagnosis showing diastolic chamber collapse. Treatment is emergent pericardiocentesis or surgical pericardial window.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q20",
    type: "question",
    question: "A patient with a massive pulmonary embolism (PE) presents with hypotension (SBP 78 mmHg) and right ventricular strain on echocardiography. What is the recommended treatment?",
    options: ["Heparin anticoagulation alone", "Systemic thrombolysis with alteplase (tPA)", "Inferior vena cava filter placement", "Observation with serial echocardiography"],
    correctIndex: 1,
    answer: "Massive (high-risk) PE with hemodynamic instability (SBP <90 for >15 minutes) is an indication for systemic thrombolysis. Alteplase 100 mg IV over 2 hours is the standard regimen. If thrombolysis is contraindicated, catheter-directed therapy or surgical embolectomy should be considered. Submassive PE (RV strain without hypotension) is a grey area where thrombolysis may be considered on a case-by-case basis.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q21",
    type: "question",
    question: "A critically ill patient develops acute kidney injury with a serum potassium of 7.2 mEq/L and peaked T waves on ECG. What is the order of interventions?",
    options: ["Kayexalate first, then IV calcium", "IV calcium gluconate first (cardiac membrane stabilization), then insulin/dextrose, then further potassium-lowering measures", "IV sodium bicarbonate only", "Emergent dialysis without any other intervention"],
    correctIndex: 1,
    answer: "Severe hyperkalemia (K+ >6.5 with ECG changes) management: (1) IV calcium gluconate 10% (stabilizes cardiac membrane, does NOT lower K+), (2) Regular insulin 10 units + D50 (shifts K+ intracellularly), (3) Albuterol nebulizer (shifts K+ intracellularly), (4) Sodium bicarbonate if acidotic, (5) Kayexalate or patiromer (removes K+ from body), (6) Emergent hemodialysis if refractory. Always continuous cardiac monitoring.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q22",
    type: "question",
    question: "A patient on a ventilator meets criteria for a spontaneous breathing trial (SBT). Which method is most commonly used?",
    options: ["Increase PEEP to 15 cmH2O", "T-piece trial or pressure support ventilation (PSV) of 5-8 cmH2O for 30-120 minutes", "Switch to SIMV mode with high rate", "Disconnect from ventilator without monitoring"],
    correctIndex: 1,
    answer: "SBT is performed using either a T-piece or low-level pressure support (5-8 cmH2O) for 30-120 minutes. Criteria for SBT initiation: FiO2 ≤40%, PEEP ≤5-8, adequate oxygenation, hemodynamically stable, able to initiate inspiratory effort. Failure criteria: RR >35, SpO2 <90%, HR change >20%, SBP >180 or <90, agitation, diaphoresis. Rapid shallow breathing index (RR/VT) <105 predicts extubation success.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q23",
    type: "question",
    question: "A patient in the MICU with septic shock is on norepinephrine at 0.5 mcg/kg/min and MAP remains 58 mmHg after 30 mL/kg fluid resuscitation. What is the next vasopressor to add?",
    options: ["Dopamine", "Vasopressin 0.03-0.04 units/min", "Phenylephrine", "Dobutamine"],
    correctIndex: 1,
    answer: "Per the Surviving Sepsis Campaign guidelines, norepinephrine is the first-line vasopressor for septic shock. If MAP target (≥65 mmHg) is not achieved, vasopressin (up to 0.03-0.04 units/min) should be added as a second agent (not titrated). If cardiac dysfunction is present (low cardiac output), dobutamine may be added. Epinephrine is the preferred second-line catecholamine if vasopressin is not available.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q24",
    type: "question",
    question: "A trauma patient with a GCS of 6 has a CT scan showing an acute epidural hematoma with midline shift. What is the definitive treatment?",
    options: ["IV mannitol and observation", "Emergent surgical evacuation (craniotomy)", "Lumbar puncture to relieve pressure", "Corticosteroids"],
    correctIndex: 1,
    answer: "An acute epidural hematoma (biconvex/lens-shaped on CT) with midline shift and declining neurological status requires emergent surgical evacuation via craniotomy. Epidural hematomas are typically caused by rupture of the middle meningeal artery following temporal bone fracture. The classic 'lucid interval' may occur. Without surgery, uncal herniation and death can occur rapidly. Corticosteroids are not recommended in traumatic brain injury.",
    category: "Acute Care NP",
    difficulty: 3
  },
  // ============================================================
  // PSYCHIATRIC NP – EXPANDED (12 cards)
  // ============================================================
  {
    id: "np-psych-q15",
    type: "question",
    question: "A patient with treatment-resistant depression (failed 2 adequate SSRI trials) is being evaluated for alternative therapies. Which FDA-approved treatment option has rapid-onset antidepressant effects?",
    options: ["Switching to another SSRI", "Esketamine (Spravato) nasal spray", "Increasing the current SSRI dose", "Adding buspirone augmentation"],
    correctIndex: 1,
    answer: "Esketamine (Spravato) nasal spray is FDA-approved for treatment-resistant depression (in conjunction with an oral antidepressant). It acts on NMDA glutamate receptors and has rapid onset (hours to days vs weeks for SSRIs). Must be administered in a certified healthcare setting with 2-hour monitoring due to dissociative effects, sedation, and blood pressure changes. REMS program required.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q16",
    type: "question",
    question: "A patient on clozapine for treatment-resistant schizophrenia presents with fever, tachycardia, and a WBC of 1,200/μL with an ANC of 400. What is the immediate action?",
    options: ["Continue clozapine and recheck labs in a week", "Discontinue clozapine immediately and initiate neutropenic precautions", "Reduce the clozapine dose by 50%", "Add G-CSF and continue clozapine"],
    correctIndex: 1,
    answer: "Clozapine-induced agranulocytosis (ANC <500) is a potentially fatal adverse effect occurring in ~1% of patients. ANC <1000 requires immediate discontinuation and the patient should never be rechallenged. ANC <500 is a medical emergency: discontinue clozapine, initiate neutropenic precautions, obtain blood cultures, start broad-spectrum antibiotics if febrile, and consider G-CSF. The Clozapine REMS program mandates regular ANC monitoring.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q17",
    type: "question",
    question: "A patient with bipolar I disorder is in an acute manic episode with psychotic features. Which medication combination is most appropriate for acute management?",
    options: ["SSRI plus benzodiazepine", "Lithium or valproate plus an atypical antipsychotic (e.g., quetiapine, olanzapine)", "SSRI monotherapy", "Lamotrigine monotherapy"],
    correctIndex: 1,
    answer: "Acute mania with psychotic features requires a mood stabilizer (lithium or valproate) combined with an atypical antipsychotic. SSRIs and antidepressants should be avoided as they can worsen mania or induce rapid cycling. Lamotrigine is effective for bipolar depression prevention but not for acute mania. Lithium requires therapeutic drug monitoring (0.6-1.2 mEq/L) and monitoring of renal, thyroid, and cardiac function.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q18",
    type: "question",
    question: "A patient on lithium presents with coarse tremor, vomiting, diarrhea, confusion, and a lithium level of 2.4 mEq/L. What is the priority intervention?",
    options: ["Increase lithium dose for better therapeutic effect", "Hold lithium, administer IV normal saline, and prepare for possible hemodialysis", "Give activated charcoal", "Administer flumazenil"],
    correctIndex: 1,
    answer: "Lithium toxicity (level >1.5 mEq/L) manifests as GI symptoms, coarse tremor, confusion, and ataxia. Severe toxicity (>2.5 mEq/L) can cause seizures, coma, and death. Treatment: hold lithium, aggressive IV NS hydration (lithium is renally excreted), and hemodialysis for levels >2.5 or severe symptoms. Avoid NSAIDs, ACEi, ARBs, and dehydration which increase lithium levels. Activated charcoal does not bind lithium.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q19",
    type: "question",
    question: "A 25-year-old female with PTSD and comorbid generalized anxiety disorder asks about medication options. Which first-line pharmacotherapy is recommended for PTSD?",
    options: ["Benzodiazepines", "Sertraline or paroxetine (SSRIs)", "Prazosin only", "Propranolol"],
    correctIndex: 1,
    answer: "SSRIs (sertraline and paroxetine are FDA-approved for PTSD) are first-line pharmacotherapy. Benzodiazepines are NOT recommended for PTSD (may worsen outcomes, interfere with fear extinction, high abuse potential). Prazosin may be added for PTSD-related nightmares. Venlafaxine (SNRI) is also evidence-based. Trauma-focused psychotherapies (CPT, PE, EMDR) should be offered concurrently.",
    category: "Psychiatric NP",
    difficulty: 2,
    image: imgAnxiety
  },
  {
    id: "np-psych-q20",
    type: "question",
    question: "A patient taking an MAOI (phenelzine) eats aged cheese and develops severe hypertension, headache, and diaphoresis. What is this reaction, and what is the treatment?",
    options: ["Serotonin syndrome; administer cyproheptadine", "Tyramine-induced hypertensive crisis; administer phentolamine (IV alpha-blocker)", "Neuroleptic malignant syndrome; administer dantrolene", "Allergic reaction; administer epinephrine"],
    correctIndex: 1,
    answer: "MAOIs inhibit tyramine metabolism. Tyramine-rich foods (aged cheese, cured meats, red wine, fermented foods) cause a catecholamine surge leading to hypertensive crisis. Treatment is IV phentolamine (alpha-blocker) or nitroprusside. Patients on MAOIs must follow a strict tyramine-restricted diet. Also avoid sympathomimetics, meperidine, SSRIs/SNRIs (risk of serotonin syndrome). Washout period of 14 days before switching medications.",
    category: "Psychiatric NP",
    difficulty: 3
  },
  {
    id: "np-psych-q21",
    type: "question",
    question: "An NP is evaluating a patient with suspected ADHD. Which standardized rating scale is commonly used for adult ADHD diagnosis?",
    options: ["PHQ-9", "Adult ADHD Self-Report Scale (ASRS-v1.1)", "GAD-7", "MMSE"],
    correctIndex: 1,
    answer: "The ASRS-v1.1 (WHO Adult ADHD Self-Report Scale) is a validated 18-item screening tool based on DSM-5 criteria. The 6-item screener is used for initial screening; the full 18-item version for comprehensive assessment. Diagnosis requires symptoms present before age 12, in 2+ settings, with functional impairment. Additional tools include the Conners Adult ADHD Rating Scales (CAARS) and Wender Utah Rating Scale for childhood symptoms.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  {
    id: "np-psych-q22",
    type: "question",
    question: "A patient with schizophrenia on haloperidol develops sustained muscle contractions of the neck and jaw within 48 hours of starting the medication. What is this reaction and the treatment?",
    options: ["Tardive dyskinesia; switch to clozapine", "Acute dystonia; administer benztropine (Cogentin) or diphenhydramine IM/IV", "Akathisia; add propranolol", "Neuroleptic malignant syndrome; administer dantrolene"],
    correctIndex: 1,
    answer: "Acute dystonia (sustained involuntary muscle contractions) occurs within hours to days of starting or increasing a typical antipsychotic. Risk factors: young age, male sex, high-potency agents (haloperidol). Treatment: IM/IV benztropine 1-2 mg or diphenhydramine 25-50 mg (anticholinergics). Response is usually within minutes. Prophylactic anticholinergics may be given with high-potency antipsychotics. Laryngeal dystonia is a medical emergency.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  {
    id: "np-psych-q23",
    type: "question",
    question: "A 70-year-old patient with major depressive disorder and insomnia asks about mirtazapine. Which pharmacological properties make it suitable for this patient?",
    options: ["It is a strong CYP3A4 inhibitor", "It increases norepinephrine and serotonin via alpha-2 antagonism, promotes sleep via H1 blockade, and stimulates appetite", "It has strong anticholinergic effects", "It is a serotonin reuptake inhibitor only"],
    correctIndex: 1,
    answer: "Mirtazapine is a noradrenergic and specific serotonergic antidepressant (NaSSA). Its H1 antihistamine blockade promotes sleep and appetite at lower doses (7.5-15 mg). At higher doses (30-45 mg), the noradrenergic effect predominates and sedation decreases. It has low drug-drug interaction potential, minimal sexual side effects, and low risk of serotonin syndrome. Ideal for elderly depressed patients with insomnia and poor appetite/weight loss.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  {
    id: "np-psych-q24",
    type: "question",
    question: "A patient on long-acting injectable paliperidone (Invega Sustenna) is due for their monthly injection but missed their appointment by 2 weeks. What is the appropriate action?",
    options: ["Restart the initiation dosing regimen", "Administer the maintenance dose as soon as possible if within the dosing window, then resume monthly schedule", "Switch to oral risperidone permanently", "Wait until the next scheduled monthly dose"],
    correctIndex: 1,
    answer: "For paliperidone palmitate monthly injections, if a dose is missed by <6 weeks (after the first injection) or <7 weeks (after subsequent injections), the maintenance dose can be given as soon as possible, then resume the monthly schedule. If missed beyond these windows, reinitiation may be needed depending on the specific timeframe. Long-acting injectables improve medication adherence in schizophrenia. Each formulation has specific missed-dose protocols.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  // ============================================================
  // WOMEN'S HEALTH NP – EXPANDED (10 cards)
  // ============================================================
  {
    id: "np-womens-q11",
    type: "question",
    question: "A 28-year-old woman with a BMI of 38 requests hormonal contraception. She has no other risk factors. Which method is contraindicated?",
    options: ["Copper IUD", "Progestin-only pill", "Combined oral contraceptive (estrogen-containing)", "Etonogestrel implant (Nexplanon)"],
    correctIndex: 2,
    answer: "Combined hormonal contraceptives (estrogen-containing pills, patches, rings) are CDC MEC Category 3 (risks outweigh benefits) for BMI ≥35 due to increased risk of venous thromboembolism. Progestin-only methods (POP, implant, hormonal IUD, DMPA) are safer alternatives. The copper IUD is non-hormonal and has no BMI-related contraindications. Always use the CDC MEC criteria for contraceptive counseling.",
    category: "Women's Health NP",
    difficulty: 2
  },
  {
    id: "np-womens-q12",
    type: "question",
    question: "A 52-year-old menopausal woman with hot flashes, night sweats, and vaginal dryness wants hormone replacement therapy (HRT). She had a hysterectomy 5 years ago. Which HRT regimen is appropriate?",
    options: ["Estrogen plus progestogen combination", "Estrogen-only therapy", "Progestogen-only therapy", "Testosterone-only therapy"],
    correctIndex: 1,
    answer: "Women who have had a hysterectomy can use estrogen-only therapy since the progestogen component is only needed to protect the endometrium from estrogen-induced hyperplasia. The Women's Health Initiative showed that estrogen-only therapy (conjugated equine estrogen) had a more favorable risk profile than combined HRT. Start within 10 years of menopause or before age 60 for cardiovascular benefit window.",
    category: "Women's Health NP",
    difficulty: 2
  },
  {
    id: "np-womens-q13",
    type: "question",
    question: "A patient presents with painless, profuse bright red vaginal bleeding at 34 weeks gestation. What is the priority nursing/NP action?",
    options: ["Perform a digital cervical exam", "Obtain an ultrasound to rule out placenta previa before any vaginal examination", "Administer oxytocin", "Rupture membranes to assess fluid color"],
    correctIndex: 1,
    answer: "Painless bright red vaginal bleeding in the third trimester is classic for placenta previa (placenta covering the cervical os). NEVER perform a digital cervical exam as this can cause catastrophic hemorrhage. Confirm diagnosis with transabdominal ultrasound. Management includes bed rest, IV access, type and crossmatch, monitoring fetal status, and planning delivery (C-section for complete previa). Betamethasone if <37 weeks.",
    category: "Women's Health NP",
    difficulty: 3,
    image: imgPlacentaPrevia
  },
  {
    id: "np-womens-q14",
    type: "question",
    question: "A patient with PCOS asks about first-line pharmacotherapy for menstrual regulation and hyperandrogenism. What is the recommended treatment?",
    options: ["Metformin alone", "Combined oral contraceptives (COCs)", "Spironolactone alone", "Clomiphene citrate"],
    correctIndex: 1,
    answer: "COCs are first-line for menstrual regulation and treatment of hyperandrogenism (acne, hirsutism) in PCOS. They suppress ovarian androgen production and increase SHBG. Spironolactone can be added for persistent hirsutism (teratogenic, requires contraception). Metformin is used for insulin resistance/prediabetes but is not first-line for menstrual irregularity. Clomiphene or letrozole are used when fertility is desired.",
    category: "Women's Health NP",
    difficulty: 2,
    image: imgPCOS
  },
  {
    id: "np-womens-q15",
    type: "question",
    question: "A postpartum patient 3 days after vaginal delivery presents with fever of 38.5°C, uterine tenderness, and foul-smelling lochia. What is the most likely diagnosis?",
    options: ["Normal postpartum recovery", "Endometritis", "Mastitis", "Urinary tract infection"],
    correctIndex: 1,
    answer: "Postpartum endometritis presents with fever (typically >38°C after first 24 hours), uterine tenderness, and foul-smelling lochia. Risk factors include cesarean delivery, prolonged rupture of membranes, prolonged labor, and multiple vaginal exams. Treatment is IV broad-spectrum antibiotics (clindamycin plus gentamicin is standard). Blood cultures should be obtained before starting antibiotics. Most patients improve within 48-72 hours.",
    category: "Women's Health NP",
    difficulty: 2,
    image: imgLochia
  },
  {
    id: "np-womens-q16",
    type: "question",
    question: "A 45-year-old woman has a Pap smear result of HSIL (high-grade squamous intraepithelial lesion). What is the recommended next step?",
    options: ["Repeat Pap in 1 year", "Colposcopy with biopsy", "Immediate hysterectomy", "HPV testing only"],
    correctIndex: 1,
    answer: "HSIL on Pap smear requires immediate colposcopy with directed biopsy regardless of age or HPV status (ASCCP 2019 guidelines). HSIL indicates CIN 2/3 is likely and has significant malignant potential. If biopsy confirms CIN 2/3, treatment options include LEEP (loop electrosurgical excision procedure), cold knife conization, or ablation depending on adequacy of colposcopy and patient factors.",
    category: "Women's Health NP",
    difficulty: 2
  },
  {
    id: "np-womens-q17",
    type: "question",
    question: "A pregnant patient at 28 weeks gestation has a 1-hour glucose challenge test result of 195 mg/dL. What is the next step?",
    options: ["The result is normal; no further testing", "Diagnose gestational diabetes based on this result alone (≥190 mg/dL)", "Perform a 3-hour oral glucose tolerance test", "Start insulin immediately"],
    correctIndex: 1,
    answer: "A 1-hour glucose challenge test ≥190 mg/dL (some guidelines use ≥200) is diagnostic of gestational diabetes without needing a 3-hour OGTT. Values between 130-189 require confirmation with a 3-hour OGTT. Management starts with dietary modification (carbohydrate counting, medical nutrition therapy), glucose monitoring 4x daily, and insulin if targets are not met. Metformin may be used but insulin is preferred.",
    category: "Women's Health NP",
    difficulty: 3,
    image: imgGestationalDiabetes
  },
  {
    id: "np-womens-q18",
    type: "question",
    question: "A 35-year-old woman with a history of migraines with aura requests an IUD for contraception. Which IUD is most appropriate?",
    options: ["She cannot use any IUD", "Levonorgestrel IUD (Mirena) or copper IUD (Paragard)", "She must use combined oral contraceptives instead", "Only barrier methods are safe"],
    correctIndex: 1,
    answer: "Both levonorgestrel IUDs and copper IUDs are CDC MEC Category 1 (no restriction) for women with migraines with aura. Combined hormonal contraceptives (pills, patch, ring) are Category 4 (unacceptable risk) for migraines with aura due to increased stroke risk. Progestin-only methods (IUD, implant, POP, DMPA) are safe alternatives. The hormonal IUD has minimal systemic absorption.",
    category: "Women's Health NP",
    difficulty: 2
  },
  // ============================================================
  // GERIATRIC NP – EXPANDED (10 cards)
  // ============================================================
  {
    id: "np-geri-q11",
    type: "question",
    question: "An 82-year-old patient presents with acute confusion, urinary incontinence, and a fall. Lab results show no metabolic abnormalities. Which assessment tool should be used to evaluate delirium?",
    options: ["Mini-Mental State Exam (MMSE) only", "Confusion Assessment Method (CAM)", "Hamilton Depression Rating Scale", "Glasgow Coma Scale"],
    correctIndex: 1,
    answer: "The Confusion Assessment Method (CAM) is the gold standard screening tool for delirium. It evaluates four features: (1) acute onset and fluctuating course, (2) inattention, (3) disorganized thinking, (4) altered level of consciousness. Delirium diagnosis requires features 1+2 plus either 3 or 4. Common causes in elderly: UTI, medications (anticholinergics, benzodiazepines, opioids), dehydration, infection, pain, constipation.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q12",
    type: "question",
    question: "An NP is reviewing medications for a 78-year-old patient according to the Beers Criteria. Which medication should be avoided or deprescribed?",
    options: ["Lisinopril 10 mg daily", "Metformin 500 mg twice daily", "Diphenhydramine 50 mg at bedtime for sleep", "Acetaminophen 650 mg as needed"],
    correctIndex: 2,
    answer: "The AGS Beers Criteria identifies potentially inappropriate medications for older adults. First-generation antihistamines (diphenhydramine) are Beers-listed due to strong anticholinergic effects: confusion, urinary retention, constipation, dry mouth, fall risk, and cognitive impairment. Safer sleep alternatives include sleep hygiene, melatonin, or low-dose trazodone. Other Beers-listed drugs include benzodiazepines, long-acting sulfonylureas, and muscle relaxants.",
    category: "Geriatric NP",
    difficulty: 1
  },
  {
    id: "np-geri-q13",
    type: "question",
    question: "A 75-year-old patient has a blood pressure of 155/78 mmHg. According to the 2017 ACC/AHA guidelines, what is the blood pressure target for this age group?",
    options: ["<120/80 mmHg for all adults", "<130/80 mmHg if tolerated, considering fall risk and comorbidities", "<160/90 mmHg", "<140/90 mmHg with no further reduction needed"],
    correctIndex: 1,
    answer: "The 2017 ACC/AHA guidelines recommend a BP target <130/80 mmHg for adults ≥65 if tolerated. However, clinical judgment is essential in frail elderly patients: consider orthostatic hypotension risk, fall risk, polypharmacy, and functional status. The SPRINT trial showed benefit of intensive BP control (<120 systolic) even in adults ≥75, but with higher rates of hypotension and AKI. Individualize targets.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q14",
    type: "question",
    question: "An 80-year-old nursing home resident has a MoCA score of 14/30 and progressive memory decline over 2 years with preserved motor function. Which type of dementia is most likely?",
    options: ["Lewy body dementia", "Frontotemporal dementia", "Alzheimer's disease", "Vascular dementia"],
    correctIndex: 2,
    answer: "Alzheimer's disease is the most common dementia (60-80% of cases), characterized by insidious onset and progressive decline in memory (especially short-term), language, and visuospatial skills. Preserved motor function early in disease differentiates it from Lewy body (visual hallucinations, parkinsonism, fluctuating cognition) and vascular dementia (stepwise decline, focal neurological deficits). Treatment: cholinesterase inhibitors (donepezil, rivastigmine) and memantine for moderate-severe disease.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q15",
    type: "question",
    question: "An NP is assessing fall risk in an 85-year-old outpatient. Which validated tool is recommended for fall risk screening?",
    options: ["Braden Scale", "Timed Up and Go (TUG) test", "Norton Scale", "Morse Fall Scale (inpatient only)"],
    correctIndex: 1,
    answer: "The Timed Up and Go (TUG) test is a validated fall risk screening tool for community-dwelling older adults. The patient rises from a chair, walks 3 meters, turns, walks back, and sits down. Time ≥12 seconds suggests increased fall risk. CDC STEADI toolkit recommends: (1) Screen annually, (2) Assess gait/strength/balance, (3) Intervene with exercise, medication review, vitamin D, home safety assessment, and vision correction.",
    category: "Geriatric NP",
    difficulty: 1
  },
  {
    id: "np-geri-q16",
    type: "question",
    question: "A 90-year-old patient with advanced dementia and recurrent aspiration pneumonia is being considered for a PEG tube. What does the evidence show about feeding tubes in advanced dementia?",
    options: ["PEG tubes significantly reduce aspiration pneumonia and improve survival", "Evidence shows PEG tubes do NOT reduce aspiration risk, prevent malnutrition-related complications, or improve survival in advanced dementia", "PEG tubes are required by law in nursing home residents", "PEG tubes improve quality of life in all dementia stages"],
    correctIndex: 1,
    answer: "Multiple studies and the AGS position statement conclude that feeding tubes in advanced dementia do NOT reduce aspiration pneumonia risk, prevent consequences of malnutrition, improve functional status, or extend survival. Careful hand-feeding is the recommended approach. Goals of care discussions should address comfort-focused care, advance directives, and patient/family values. This is an important palliative care and ethical consideration.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q17",
    type: "question",
    question: "An elderly patient on multiple medications develops a new prescription for ciprofloxacin. The NP identifies a significant drug interaction with which existing medication?",
    options: ["Metoprolol", "Warfarin (increased INR/bleeding risk)", "Levothyroxine", "Omeprazole"],
    correctIndex: 1,
    answer: "Ciprofloxacin is a potent CYP1A2 inhibitor that significantly increases warfarin levels and INR, potentially causing life-threatening bleeding. INR should be monitored closely (within 2-3 days of starting ciprofloxacin) and warfarin dose reduced. Other important fluoroquinolone interactions: QT prolongation with other QT-prolonging drugs, theophylline toxicity, and reduced absorption with divalent cations (calcium, magnesium, iron).",
    category: "Geriatric NP",
    difficulty: 2,
    image: imgHypothyroidismNew
  },
  {
    id: "np-geri-q18",
    type: "question",
    question: "An NP is managing a 76-year-old patient with type 2 diabetes. What is the recommended A1C target for this patient with multiple comorbidities and limited life expectancy?",
    options: ["<6.5% to prevent all complications", "<7.0% as for all adults with diabetes", "<8.0-8.5% to avoid hypoglycemia while preventing symptomatic hyperglycemia", "A1C monitoring is not needed in elderly patients"],
    correctIndex: 2,
    answer: "ADA guidelines recommend individualized A1C targets for older adults. For patients with multiple comorbidities, cognitive impairment, or limited life expectancy, a less stringent target of <8.0-8.5% is appropriate to avoid hypoglycemia (which increases fall risk, cognitive decline, and cardiovascular events). Avoid sulfonylureas and sliding-scale insulin in elderly due to hypoglycemia risk. Simplify regimens whenever possible.",
    category: "Geriatric NP",
    difficulty: 2
  },
  // ============================================================
  // PEDIATRIC NP – EXPANDED (10 cards)
  // ============================================================
  {
    id: "np-peds-q15",
    type: "question",
    question: "A 6-month-old infant presents with paroxysmal coughing followed by an inspiratory 'whoop' and post-tussive vomiting. The infant has not received DTaP vaccines. What is the most likely diagnosis?",
    options: ["Croup", "Pertussis (whooping cough)", "Bronchiolitis", "Foreign body aspiration"],
    correctIndex: 1,
    answer: "Pertussis (Bordetella pertussis) presents in three stages: (1) Catarrhal (1-2 weeks, URI-like symptoms, most contagious), (2) Paroxysmal (2-6 weeks, characteristic coughing spasms with inspiratory whoop, post-tussive vomiting, cyanosis), (3) Convalescent (weeks to months, gradual resolution). Treatment: macrolide antibiotics (azithromycin). Post-exposure prophylaxis for close contacts. Most dangerous in infants <6 months. DTaP vaccination prevents disease.",
    category: "Pediatric NP",
    difficulty: 2,
    image: imgForeignBodyAspiration
  },
  {
    id: "np-peds-q16",
    type: "question",
    question: "A 4-year-old child presents with a barking cough, inspiratory stridor, and a 'steeple sign' on neck X-ray. What is the diagnosis and initial management?",
    options: ["Epiglottitis; immediate intubation", "Croup (laryngotracheobronchitis); dexamethasone and nebulized racemic epinephrine if moderate-severe", "Bacterial tracheitis; IV antibiotics", "Asthma; albuterol nebulizer"],
    correctIndex: 1,
    answer: "Croup (viral laryngotracheobronchitis) is caused most commonly by parainfluenza virus. Characterized by barking/seal-like cough, inspiratory stridor, and hoarseness. The steeple sign on AP neck X-ray shows subglottic narrowing. Management: single dose of dexamethasone 0.6 mg/kg (oral or IM) for all severity levels. Nebulized racemic epinephrine for moderate-severe stridor at rest. Observe for 2-4 hours after epinephrine for rebound.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-peds-q17",
    type: "question",
    question: "A 3-year-old child presents with high fever (40°C for 5 days), bilateral non-exudative conjunctivitis, strawberry tongue, cervical lymphadenopathy, and a polymorphous rash. What is the priority treatment?",
    options: ["Antibiotics for streptococcal infection", "IVIG and high-dose aspirin within 10 days of fever onset", "Oral corticosteroids only", "Observation and supportive care"],
    correctIndex: 1,
    answer: "This presentation meets criteria for Kawasaki disease (≥5 days fever + 4 of 5 criteria: conjunctivitis, oral changes, rash, extremity changes, cervical lymphadenopathy). Treatment: IVIG 2g/kg single infusion plus high-dose aspirin (80-100 mg/kg/day until afebrile, then low-dose 3-5 mg/kg/day for 6-8 weeks). The major complication is coronary artery aneurysm. Echocardiography is essential at diagnosis, 2 weeks, and 6-8 weeks.",
    category: "Pediatric NP",
    difficulty: 3
  },
  {
    id: "np-peds-q18",
    type: "question",
    question: "A 10-year-old child with newly diagnosed type 1 diabetes asks about insulin regimen options. Which regimen most closely mimics physiological insulin secretion?",
    options: ["NPH insulin twice daily only", "Basal-bolus regimen (long-acting basal + rapid-acting at meals) or insulin pump therapy", "Sliding scale regular insulin only", "Oral metformin"],
    correctIndex: 1,
    answer: "Basal-bolus therapy (long-acting insulin such as glargine/detemir for basal coverage plus rapid-acting insulin such as lispro/aspart at meals for bolus coverage) best mimics physiological insulin secretion. Insulin pump therapy (continuous subcutaneous insulin infusion) provides the most precise delivery. Automated insulin delivery (hybrid closed-loop) systems are increasingly used in pediatrics. Type 1 diabetes always requires insulin; oral agents are not appropriate.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-peds-q19",
    type: "question",
    question: "A 2-week-old neonate presents with projectile, non-bilious vomiting after feeds and a palpable 'olive-shaped' mass in the right upper quadrant. What is the most likely diagnosis?",
    options: ["Intestinal malrotation with volvulus", "Pyloric stenosis", "Hirschsprung's disease", "Gastroesophageal reflux"],
    correctIndex: 1,
    answer: "Pyloric stenosis is caused by hypertrophy of the pyloric sphincter muscle. Classic presentation: non-bilious projectile vomiting in a 2-6 week old (firstborn male most common), hungry after vomiting, palpable 'olive' in RUQ, visible peristaltic waves. Diagnosed by ultrasound (pyloric muscle thickness >4mm, length >16mm). Labs show hypochloremic, hypokalemic metabolic alkalosis. Treatment: surgical pyloromyotomy (Ramstedt procedure) after fluid/electrolyte correction.",
    category: "Pediatric NP",
    difficulty: 2,
    image: imgPyloricStenosis
  },
  {
    id: "np-peds-q20",
    type: "question",
    question: "A 15-year-old presents with an insidious onset of fatigue, weight loss, and polyuria/polydipsia. C-peptide is low and GAD65 antibodies are positive. What type of diabetes is this?",
    options: ["Type 2 diabetes", "Type 1 diabetes (autoimmune, can present in adolescents)", "MODY (maturity-onset diabetes of the young)", "Steroid-induced diabetes"],
    correctIndex: 1,
    answer: "Type 1 diabetes can present at any age, including adolescence and adulthood (LADA). Low C-peptide indicates minimal endogenous insulin production, and positive GAD65 antibodies confirm autoimmune destruction of beta cells. Unlike the classic acute DKA presentation in young children, adolescents may have a more gradual onset. Differentiating from type 2 (obesity, acanthosis nigricans, family history, normal/elevated C-peptide) is essential for appropriate management.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-peds-q21",
    type: "question",
    question: "An NP is screening a 5-year-old child for developmental delay. According to the AAP, which validated screening tool is recommended for developmental surveillance?",
    options: ["Denver II only", "Ages and Stages Questionnaire (ASQ-3)", "Apgar scoring", "Bayley Scales (administered only by psychologists)"],
    correctIndex: 1,
    answer: "The AAP recommends developmental screening at 9, 18, and 30 months using validated tools such as the ASQ-3 (Ages and Stages Questionnaire). The ASQ-3 is parent-completed, covers communication, gross motor, fine motor, problem-solving, and personal-social domains. Autism-specific screening (M-CHAT-R/F) is recommended at 18 and 24 months. The Denver II is a surveillance tool but less commonly used as a primary screener.",
    category: "Pediatric NP",
    difficulty: 1,
    image: imgAPGAR
  },
  {
    id: "np-peds-q22",
    type: "question",
    question: "A 7-year-old child with sickle cell disease presents with fever of 39°C. What is the priority action?",
    options: ["Administer acetaminophen and discharge home", "Obtain blood cultures and administer empiric IV antibiotics (ceftriaxone) immediately", "Schedule a follow-up appointment in 3 days", "Prescribe oral amoxicillin and discharge"],
    correctIndex: 1,
    answer: "Fever in sickle cell disease is a medical emergency due to functional asplenia and high risk of overwhelming sepsis (especially encapsulated organisms: S. pneumoniae, H. influenzae, N. meningitidis). Management: immediate blood cultures, CBC with reticulocyte count, and empiric IV antibiotics (ceftriaxone). Admit for observation. Penicillin prophylaxis (until age 5) and pneumococcal vaccination reduce infection risk.",
    image: imgSickleCellCrisis,
    category: "Pediatric NP",
    difficulty: 3
  },
  // ============================================================
  // RESEARCH & EBP – EXPANDED (8 cards)
  // ============================================================
  {
    id: "np-ebp-q9",
    type: "question",
    question: "An NP is critically appraising a randomized controlled trial (RCT). The study reports a number needed to treat (NNT) of 5. What does this mean?",
    options: ["5 patients must be in each group", "5 patients need to be treated with the intervention for one additional patient to benefit compared to control", "The treatment is effective in 5% of patients", "5 adverse events occurred in the treatment group"],
    correctIndex: 1,
    answer: "NNT (Number Needed to Treat) is calculated as 1/ARR (absolute risk reduction). An NNT of 5 means that for every 5 patients treated, 1 additional patient benefits compared to control. Lower NNT indicates more effective treatment. NNT of 1 would be a perfect treatment. NNH (Number Needed to Harm) is similarly calculated for adverse effects. These are clinically meaningful measures that help translate statistical significance into practical clinical decisions.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q10",
    type: "question",
    question: "An NP is evaluating the quality of evidence for a clinical practice guideline. Using the GRADE system, which level represents the highest quality evidence?",
    options: ["Expert opinion", "Case-control studies", "High quality: further research is very unlikely to change confidence in the estimate of effect (typically from well-designed RCTs)", "Cohort studies"],
    correctIndex: 2,
    answer: "The GRADE (Grading of Recommendations Assessment, Development, and Evaluation) system classifies evidence quality as High, Moderate, Low, or Very Low. High-quality evidence comes from well-designed RCTs with consistent results, adequate sample sizes, and minimal bias. Evidence can be downgraded for risk of bias, inconsistency, indirectness, imprecision, or publication bias. Observational studies start as low quality but can be upgraded.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q11",
    type: "question",
    question: "An NP is designing a quality improvement (QI) project to reduce central line-associated bloodstream infections (CLABSI). Which framework is most appropriate?",
    options: ["Randomized controlled trial design", "Plan-Do-Study-Act (PDSA) cycle", "Grounded theory methodology", "Case-control study design"],
    correctIndex: 1,
    answer: "The PDSA cycle is the most widely used framework for quality improvement projects. Plan: identify the problem and develop an intervention. Do: implement on a small scale. Study: analyze results and compare to predictions. Act: adopt, adapt, or abandon based on results. Multiple rapid PDSA cycles allow iterative improvement. QI projects differ from research: they focus on improving local processes, not generating generalizable knowledge.",
    category: "Research & EBP",
    difficulty: 1
  },
  {
    id: "np-ebp-q12",
    type: "question",
    question: "An NP reads a diagnostic study reporting sensitivity of 95% and specificity of 70% for a screening test. What does high sensitivity mean clinically?",
    options: ["The test is excellent at confirming disease (few false positives)", "The test is excellent at detecting disease (few false negatives) — good for ruling OUT disease (SnNOut)", "The test has a high positive predictive value", "The test is accurate in all populations"],
    correctIndex: 1,
    answer: "High sensitivity means few false negatives — the test catches most true positives. Mnemonic: SnNOut (Sensitivity, Negative result, rules OUT). A negative result on a highly sensitive test effectively excludes the disease. High specificity means few false positives — SpPIn (Specificity, Positive result, rules IN). Ideal screening tests have high sensitivity; confirmatory tests need high specificity. Predictive values depend on disease prevalence.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q13",
    type: "question",
    question: "An NP is conducting a systematic review. What distinguishes a systematic review from a narrative (traditional) literature review?",
    options: ["Systematic reviews only include RCTs", "Systematic reviews use a predefined, reproducible methodology with explicit search strategies, inclusion/exclusion criteria, and critical appraisal of studies", "Narrative reviews are more rigorous", "There is no difference"],
    correctIndex: 1,
    answer: "Systematic reviews follow a rigorous, predefined protocol (often registered on PROSPERO): comprehensive search strategy across multiple databases, explicit inclusion/exclusion criteria, standardized quality assessment of included studies, and transparent reporting (PRISMA guidelines). Meta-analyses add statistical pooling of results. Narrative reviews are subject to author bias in study selection. Systematic reviews are the highest level of evidence in the evidence hierarchy.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q14",
    type: "question",
    question: "An NP reads a study with a p-value of 0.03 and a 95% confidence interval for the odds ratio of 1.2-3.8. How should this be interpreted?",
    options: ["Not statistically significant because CI includes 1", "Statistically significant; the CI does not cross 1.0, and p<0.05 supports rejecting the null hypothesis", "Clinically significant regardless of the CI", "The study has insufficient power"],
    correctIndex: 1,
    answer: "A p-value <0.05 and a 95% CI for odds ratio that does not include 1.0 both indicate statistical significance. The CI of 1.2-3.8 means we are 95% confident the true odds ratio falls between 1.2 and 3.8, suggesting the exposure increases odds of the outcome by 1.2 to 3.8 times. Statistical significance does not automatically imply clinical significance — effect size and clinical context must also be considered.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q15",
    type: "question",
    question: "An NP wants to compare the effectiveness of two wound care protocols in a clinic. Which study design is most feasible and appropriate?",
    options: ["Randomized controlled trial with blinding", "Quasi-experimental design (pre-post comparison or nonequivalent groups)", "Case report", "Cross-sectional survey"],
    correctIndex: 1,
    answer: "Quasi-experimental designs are most feasible in clinical practice settings where true randomization may not be practical or ethical. These designs include pre-post (before and after intervention), nonequivalent control group, and interrupted time series. While they have lower internal validity than RCTs (no randomization), they provide meaningful evidence for practice improvement. They are commonly used for DNP scholarly projects.",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-ebp-q16",
    type: "question",
    question: "An NP is evaluating a study that reports a relative risk reduction (RRR) of 50% for a new medication versus placebo. The absolute risk reduction (ARR) is 2%. Why is the ARR more clinically meaningful?",
    options: ["ARR is always larger than RRR", "ARR accounts for the baseline event rate, while RRR can be misleading when baseline risk is low (e.g., reducing risk from 4% to 2% = 50% RRR but only 2% ARR)", "ARR is used for marketing purposes", "RRR and ARR always provide the same information"],
    correctIndex: 1,
    answer: "RRR can overstate clinical benefit when baseline risk is small. Example: Event rate drops from 4% to 2% = 50% RRR (sounds impressive) but ARR is only 2% (NNT = 50, meaning 50 patients must be treated for 1 to benefit). ARR provides the absolute magnitude of benefit. NNT (1/ARR) translates this into a clinically interpretable number. Always evaluate both relative and absolute measures when appraising treatment studies.",
    category: "Research & EBP",
    difficulty: 3
  },
  // ============================================================
  // PRIMARY CARE NP – EXPANDED (9 cards)
  // ============================================================
  {
    id: "np-primary-q19",
    type: "question",
    question: "A 50-year-old male with no symptoms asks about colorectal cancer screening. According to current USPSTF guidelines, what is the recommended starting age and preferred methods?",
    options: ["Screening begins at 50 with colonoscopy only", "Screening begins at 45 with colonoscopy every 10 years, or annual FIT/gFOBT, or stool DNA test every 3 years, or CT colonography every 5 years", "Screening is only needed if there is a family history", "Screening begins at 55 with sigmoidoscopy"],
    correctIndex: 1,
    answer: "The USPSTF (2021) lowered colorectal cancer screening initiation to age 45 for average-risk adults (previously 50). Options include: colonoscopy every 10 years, annual high-sensitivity stool tests (FIT or gFOBT), stool DNA-FIT (Cologuard) every 1-3 years, CT colonography every 5 years, or flexible sigmoidoscopy every 5-10 years. Screening continues through age 75. Ages 76-85 is individualized. High-risk patients (family history, IBD, Lynch syndrome) need earlier and more frequent screening.",
    category: "Primary Care NP",
    difficulty: 1
  },
  {
    id: "np-primary-q20",
    type: "question",
    question: "A 45-year-old woman presents with a 2-cm painless, firm, non-mobile breast mass. Mammography shows a BIRADS 5 lesion. What is the next step?",
    options: ["Repeat mammogram in 6 months", "Ultrasound-guided core needle biopsy", "Reassurance and annual screening", "Start tamoxifen empirically"],
    correctIndex: 1,
    answer: "BIRADS 5 indicates highly suggestive of malignancy (≥95% probability). Core needle biopsy is the standard next step for tissue diagnosis. It is preferred over fine-needle aspiration for solid masses as it provides architectural information for histological classification. If biopsy confirms malignancy, staging workup and multidisciplinary oncology referral are needed. Triple assessment (clinical exam + imaging + biopsy) is the gold standard for breast masses.",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-primary-q21",
    type: "question",
    question: "A patient presents with a 3-day history of unilateral facial droop, inability to close the right eye, and loss of taste. There is no arm or leg weakness. What is the most likely diagnosis?",
    options: ["Stroke (CVA)", "Bell's palsy (idiopathic facial nerve CN VII palsy)", "Trigeminal neuralgia", "Myasthenia gravis"],
    correctIndex: 1,
    answer: "Bell's palsy is an acute, idiopathic peripheral CN VII palsy causing unilateral facial paralysis affecting BOTH upper and lower face (cannot wrinkle forehead on affected side). This distinguishes it from stroke (upper motor neuron lesion spares the forehead). Additional features: hyperacusis, loss of taste anterior 2/3 of tongue, decreased lacrimation. Treatment: oral corticosteroids (prednisone) within 72 hours. Most recover within 3-6 months.",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-primary-q22",
    type: "question",
    question: "A patient with chronic low back pain for 8 weeks without red flags (no fever, weight loss, neurological deficits, or history of cancer) asks for imaging. What is the appropriate response?",
    options: ["Order lumbar MRI immediately", "Imaging is not recommended for non-specific low back pain without red flags in the first 6 weeks; continue conservative management", "Order CT scan of the spine", "Refer for surgical evaluation"],
    correctIndex: 1,
    answer: "ACP/AAFP guidelines recommend against routine imaging for acute or subacute low back pain without red flags (cancer history, unexplained weight loss, neurological deficits, fever, trauma, IV drug use, prolonged steroid use). First-line treatment: NSAIDs, muscle relaxants (short-term), physical therapy, and patient education. Imaging is indicated if red flags are present, symptoms persist beyond 6 weeks with no improvement, or progressive neurological deficit develops.",
    category: "Primary Care NP",
    difficulty: 1
  },
  {
    id: "np-primary-q23",
    type: "question",
    question: "A 60-year-old male smoker with a 35-pack-year history asks about lung cancer screening. What does the USPSTF recommend?",
    options: ["Chest X-ray annually", "Low-dose CT (LDCT) annually for adults aged 50-80 with ≥20 pack-year smoking history who currently smoke or quit within the past 15 years", "No screening is available for lung cancer", "PET scan every 5 years"],
    correctIndex: 1,
    answer: "The USPSTF (2021) recommends annual LDCT for adults aged 50-80 with ≥20 pack-year smoking history who currently smoke or quit within the past 15 years. The NELSON and NLST trials demonstrated significant lung cancer mortality reduction with LDCT screening. Screening should be discontinued once the person has not smoked for 15 years, develops a health problem limiting life expectancy, or is unwilling to have curative lung surgery.",
    category: "Primary Care NP",
    difficulty: 2,
    image: imgLungCancer
  },
  {
    id: "np-primary-q24",
    type: "question",
    question: "A patient presents with a painful, vesicular rash in a dermatomal distribution on the right thorax. What is the diagnosis and recommended treatment?",
    options: ["Contact dermatitis; topical steroids", "Herpes zoster (shingles); antiviral therapy (valacyclovir) within 72 hours of rash onset", "Impetigo; topical mupirocin", "Eczema; emollients and antihistamines"],
    correctIndex: 1,
    answer: "Herpes zoster results from reactivation of varicella-zoster virus in dorsal root ganglia. Characterized by painful, vesicular rash in a unilateral dermatomal distribution that does not cross midline. Treatment: valacyclovir 1g TID or acyclovir 800 mg 5x/day for 7 days, ideally within 72 hours. Postherpetic neuralgia (pain persisting >90 days) is the most common complication; treated with gabapentin, pregabalin, or lidocaine patches. Shingrix vaccine recommended for adults ≥50.",
    category: "Primary Care NP",
    difficulty: 1,
    image: imgImpetigo
  },
  {
    id: "np-primary-q25",
    type: "question",
    question: "A 30-year-old patient presents with recurrent episodes of wheezing, chest tightness, and cough that worsen at night and with exercise. Spirometry shows FEV1/FVC <0.70 with >12% improvement after bronchodilator. What step of asthma therapy should be initiated?",
    options: ["SABA as needed only (Step 1)", "Low-dose ICS daily plus SABA as needed (Step 2)", "High-dose ICS-LABA plus oral corticosteroids", "No treatment is needed"],
    correctIndex: 1,
    answer: "This patient has persistent asthma (symptoms >2 days/week, nighttime awakenings). Per NAEPP/GINA guidelines, Step 2 therapy is appropriate: low-dose inhaled corticosteroid (ICS) daily (e.g., fluticasone 88 mcg BID) plus SABA for rescue. Alternatively, GINA now recommends as-needed low-dose ICS-formoterol as both maintenance and reliever therapy (MART). Step up if not controlled after 2-4 weeks on current step. Assess inhaler technique and adherence before stepping up.",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-primary-q26",
    type: "question",
    question: "A patient with hypothyroidism on levothyroxine 100 mcg daily has a persistently elevated TSH of 8.5 mIU/L despite reported adherence. What should the NP assess?",
    options: ["Increase levothyroxine without further assessment", "Assess medication timing, concurrent medications (calcium, iron, PPIs), and dietary factors that impair absorption", "Switch to liothyronine (T3)", "Discontinue levothyroxine"],
    correctIndex: 1,
    answer: "Before increasing levothyroxine dose, assess absorption factors: timing (should be taken 30-60 minutes before breakfast on empty stomach), concurrent medications (calcium, iron, aluminum antacids, PPIs, cholestyramine reduce absorption — separate by 4 hours), soy products, coffee, and fiber can also impair absorption. Ensure consistency in brand/generic. If true malabsorption (celiac, gastric bypass), higher doses or liquid/gel cap formulations may be needed.",
    category: "Primary Care NP",
    difficulty: 2,
    image: imgHypothyroidismNew
  },
  {
    id: "np-primary-q27",
    type: "question",
    question: "A 55-year-old patient presents with a new diagnosis of gout. Serum uric acid is 10.2 mg/dL with tophaceous deposits. Which urate-lowering therapy is first-line for chronic gout management?",
    options: ["Colchicine alone", "Allopurinol (xanthine oxidase inhibitor), starting at low dose and titrating to target uric acid <6 mg/dL", "Probenecid", "NSAIDs indefinitely"],
    correctIndex: 1,
    answer: "Allopurinol is first-line urate-lowering therapy for chronic gout (≥2 flares/year, tophi, CKD, or urolithiasis). Start low (100 mg daily, 50 mg in CKD) and titrate every 2-4 weeks to target serum uric acid <6 mg/dL. Anti-inflammatory prophylaxis (low-dose colchicine or NSAID) should be given for 3-6 months when starting ULT to prevent mobilization flares. Febuxostat is an alternative for allopurinol-intolerant patients. HLA-B*5801 testing recommended in high-risk populations before starting allopurinol.",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-family-q13",
    type: "question",
    question: "A 14-year-old patient asks the NP for contraception without parental knowledge. In a state with minor consent laws for reproductive health, what is the NP's obligation?",
    options: ["Refuse to provide care without parental consent", "Provide confidential reproductive health care as permitted by state minor consent laws", "Call the patient's parents immediately", "Refer to a family planning clinic only"],
    correctIndex: 1,
    answer: "Most states have minor consent laws allowing adolescents to access reproductive health services (contraception, STI testing/treatment, prenatal care) without parental consent. The NP should provide age-appropriate counseling, assess for coercion or abuse, and maintain confidentiality as permitted by state law. ACOG and AAP support adolescent access to confidential reproductive care. Document the encounter and legal basis for providing care.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-family-q14",
    type: "question",
    question: "A patient presents with a sore throat, fever, tonsillar exudates, and anterior cervical lymphadenopathy. The rapid strep test is positive. What is the recommended antibiotic treatment?",
    options: ["Azithromycin for 5 days", "Penicillin V 500 mg BID for 10 days or amoxicillin 500 mg BID for 10 days", "Ciprofloxacin for 7 days", "Cephalexin for 14 days"],
    correctIndex: 1,
    answer: "Penicillin V or amoxicillin for 10 days remains first-line treatment for Group A streptococcal pharyngitis (IDSA guidelines). Single IM benzathine penicillin G is an alternative for adherence concerns. Azithromycin is reserved for penicillin-allergic patients. Treatment prevents rheumatic fever (primary prevention), reduces symptom duration, and decreases transmission. Centor/McIsaac criteria guide testing decisions.",
    category: "Family NP",
    difficulty: 1
  },
  {
    id: "np-family-q15",
    type: "question",
    question: "A 65-year-old patient presents with sudden onset of painless monocular vision loss described as a 'curtain falling over the eye.' What is the most likely diagnosis and urgent action?",
    options: ["Glaucoma; prescribe timolol eye drops", "Retinal detachment; emergent ophthalmology referral", "Cataracts; schedule elective surgery", "Conjunctivitis; prescribe antibiotic eye drops"],
    correctIndex: 1,
    answer: "Sudden painless monocular vision loss with a 'curtain or shade' sensation is classic for retinal detachment. This is an ophthalmologic emergency requiring immediate referral. Rhegmatogenous retinal detachment (most common) involves a retinal tear allowing vitreous fluid underneath the retina. Risk factors: high myopia, prior cataract surgery, trauma, family history. Preceding symptoms include floaters and photopsia (flashing lights). Delay in treatment leads to permanent vision loss.",
    category: "Family NP",
    difficulty: 2,
    image: illustrationRetinalDetachmentV2
  },
  {
    id: "np-family-q16",
    type: "question",
    question: "An NP is managing a patient with chronic kidney disease stage 3 (eGFR 42). Which routine monitoring is essential at this stage?",
    options: ["Annual creatinine only", "Monitor eGFR, urine albumin-to-creatinine ratio, electrolytes (K+, Ca2+, phosphorus), PTH, hemoglobin, and blood pressure at regular intervals", "No monitoring needed until dialysis", "Weekly urinalysis"],
    correctIndex: 1,
    answer: "CKD stage 3 requires comprehensive monitoring: eGFR and UACR every 3-6 months, electrolytes (hyperkalemia risk), calcium/phosphorus/PTH (mineral bone disease), hemoglobin (anemia of CKD from decreased erythropoietin), lipid panel, and blood pressure optimization (<130/80). Refer to nephrology at stage 4 (eGFR <30) or earlier if rapid decline (>5 mL/min/year). Avoid nephrotoxins (NSAIDs, contrast dye, aminoglycosides). SGLT2 inhibitors slow CKD progression.",
    category: "Family NP",
    difficulty: 2,
    image: imgCKD
  },
  {
    id: "np-diff-q21",
    type: "question",
    question: "A 40-year-old patient presents with progressive symmetric joint stiffness and swelling in the hands (MCP and PIP joints) with morning stiffness lasting >1 hour. What is the most likely diagnosis?",
    options: ["Osteoarthritis", "Rheumatoid arthritis", "Gout", "Psoriatic arthritis"],
    correctIndex: 1,
    answer: "Rheumatoid arthritis presents with symmetric inflammatory polyarthritis affecting small joints (MCP, PIP, wrists). Morning stiffness >30-60 minutes (vs <30 minutes in OA) is characteristic. Lab findings: positive RF and anti-CCP antibodies (most specific), elevated ESR/CRP. X-ray: periarticular osteopenia, joint space narrowing, erosions. OA affects DIP joints, is asymmetric, and improves with rest. Early DMARD therapy (methotrexate first-line) prevents joint destruction.",
    category: "Differential Diagnosis",
    difficulty: 2,
    image: illustrationRheumatoidArthritis
  },
  {
    id: "np-cardio-q13",
    type: "question",
    question: "A patient presents with exertional chest pain relieved by rest. Stress ECG shows ST depression in leads V4-V6. What is the next best step?",
    options: ["Start aspirin and discharge", "Order coronary angiography", "Prescribe sublingual nitroglycerin only", "Schedule echocardiogram in 2 weeks"],
    correctIndex: 1,
    answer: "ST depression during stress testing in a symptomatic patient indicates significant myocardial ischemia. Coronary angiography is indicated to evaluate the extent and severity of coronary artery disease and determine if revascularization (PCI or CABG) is needed. In the interim, initiate anti-ischemic therapy (beta-blocker, aspirin, statin, nitroglycerin PRN).",
    category: "Cardiology NP",
    difficulty: 2
  },
  {
    id: "np-cardio-q14",
    type: "question",
    question: "An NP is managing a patient with newly diagnosed heart failure with reduced ejection fraction (HFrEF, EF 30%). Which medications are guideline-directed first-line therapy?",
    options: ["Calcium channel blocker and diuretic", "ACE inhibitor/ARB (or ARNI), beta-blocker, mineralocorticoid receptor antagonist, and SGLT2 inhibitor", "Digoxin and aspirin only", "Hydralazine and nitrate only"],
    correctIndex: 1,
    answer: "Current ACC/AHA guidelines recommend four pillars of HFrEF therapy (GDMT): ACEi/ARB/ARNI (sacubitril-valsartan preferred), evidence-based beta-blocker (carvedilol, metoprolol succinate, or bisoprolol), MRA (spironolactone or eplerenone), and SGLT2 inhibitor (dapagliflozin or empagliflozin). These reduce mortality and hospitalizations. Titrate to target doses as tolerated.",
    category: "Cardiology NP",
    difficulty: 3
  },
  {
    id: "np-pharm-q21",
    type: "question",
    question: "A patient on warfarin is prescribed fluconazole for a vaginal yeast infection. What drug interaction should the NP anticipate?",
    options: ["Decreased warfarin effect requiring dose increase", "No significant interaction", "Increased INR due to CYP2C9 inhibition by fluconazole", "Fluconazole becomes ineffective"],
    correctIndex: 2,
    answer: "Fluconazole is a potent CYP2C9 inhibitor, which is the primary enzyme metabolizing warfarin. This interaction significantly increases warfarin levels and INR, risking serious bleeding. The NP should either choose an alternative antifungal (topical miconazole) or reduce warfarin dose by 25-50% and monitor INR within 3-5 days.",
    category: "Advanced Pharmacology",
    difficulty: 3
  },
  {
    id: "np-pharm-q22",
    type: "question",
    question: "An NP is initiating a GLP-1 receptor agonist (semaglutide) for a patient with type 2 diabetes and obesity. What is the most important prescribing consideration?",
    options: ["Start at the maximum dose for fastest results", "Gradually titrate the dose to minimize GI side effects", "Combine with insulin glargine immediately", "Prescribe only if HbA1c > 10%"],
    correctIndex: 1,
    answer: "GLP-1 RAs require slow dose titration (typically monthly increases) to minimize common GI side effects: nausea, vomiting, diarrhea, and constipation. Semaglutide starts at 0.25 mg weekly for 4 weeks, then 0.5 mg, with further increases as tolerated. Contraindicated in personal/family history of medullary thyroid carcinoma or MEN2. Black box warning for thyroid C-cell tumors (rodent studies).",
    category: "Advanced Pharmacology",
    difficulty: 2
  },
  {
    id: "np-diag-q19",
    type: "question",
    question: "A patient presents with fatigue, weight gain, cold intolerance, and constipation. TSH is 12 mIU/L and free T4 is 0.4 ng/dL. What is the diagnosis and treatment?",
    options: ["Hyperthyroidism; prescribe methimazole", "Primary hypothyroidism; prescribe levothyroxine", "Secondary hypothyroidism; order MRI of pituitary", "Euthyroid sick syndrome; no treatment needed"],
    correctIndex: 1,
    answer: "Elevated TSH with low free T4 confirms primary hypothyroidism. Levothyroxine is first-line replacement therapy. Start with 1.6 mcg/kg/day in healthy adults; use lower starting doses (25-50 mcg/day) in elderly or cardiac patients. Take on an empty stomach, 30-60 minutes before breakfast. Recheck TSH in 6-8 weeks. Most common cause is Hashimoto's thyroiditis.",
    category: "Diagnostic Reasoning",
    difficulty: 1,
    image: imgHypothyroidismNew
  },
  {
    id: "np-diag-q20",
    type: "question",
    question: "A 55-year-old patient presents with polyuria, polydipsia, and an HbA1c of 7.8%. Fasting glucose is 168 mg/dL. What is the appropriate initial management?",
    options: ["Lifestyle modifications only", "Metformin plus lifestyle modifications", "Insulin therapy only", "Sulfonylurea monotherapy"],
    correctIndex: 1,
    answer: "For newly diagnosed type 2 diabetes with HbA1c <9%, ADA guidelines recommend metformin plus lifestyle modifications as initial therapy. Metformin reduces hepatic glucose production, improves insulin sensitivity, is weight-neutral, and has cardiovascular benefits. Consider adding SGLT2 inhibitor or GLP-1 RA if the patient has established cardiovascular disease, CKD, or heart failure.",
    category: "Diagnostic Reasoning",
    difficulty: 1
  },
  {
    id: "np-diff-q22",
    type: "question",
    question: "A patient presents with sudden onset of severe headache described as 'the worst headache of my life.' What diagnosis must be ruled out immediately?",
    options: ["Migraine with aura", "Tension headache", "Subarachnoid hemorrhage", "Cluster headache"],
    correctIndex: 2,
    answer: "Thunderclap headache ('worst headache of my life') is a red flag for subarachnoid hemorrhage (SAH) until proven otherwise. Order stat non-contrast CT head (95% sensitive within 6 hours). If CT is negative but clinical suspicion remains, perform lumbar puncture looking for xanthochromia and elevated RBC count. Causes: ruptured berry aneurysm (most common), AVM. Immediate neurosurgical consultation required.",
    category: "Differential Diagnosis",
    difficulty: 3
  },
  {
    id: "np-diff-q23",
    type: "question",
    question: "A 28-year-old female presents with anxiety, weight loss, tremor, heat intolerance, and palpitations. Exam reveals a diffuse goiter and exophthalmos. What is the most likely diagnosis?",
    options: ["Hashimoto's thyroiditis", "Graves' disease", "Toxic multinodular goiter", "Subacute thyroiditis"],
    correctIndex: 1,
    answer: "Graves' disease is the most common cause of hyperthyroidism, especially in young women. The triad is diffuse goiter, exophthalmos (ophthalmopathy), and pretibial myxedema. Caused by thyroid-stimulating immunoglobulins (TSI) activating TSH receptors. Labs: suppressed TSH, elevated free T4/T3, positive TSI. Treatment options: methimazole (first-line), radioactive iodine ablation, or thyroidectomy.",
    category: "Differential Diagnosis",
    difficulty: 2,
    image: imgGravesDisease
  },
  {
    id: "np-peds-q23",
    type: "question",
    question: "A 4-month-old infant presents with wheezing, nasal congestion, and tachypnea during winter months. What is the most likely diagnosis?",
    options: ["Asthma exacerbation", "RSV bronchiolitis", "Bacterial pneumonia", "Croup"],
    correctIndex: 1,
    answer: "RSV bronchiolitis is the most common lower respiratory infection in infants <1 year, with peak incidence in winter months. Treatment is primarily supportive: nasal suctioning, hydration, and supplemental oxygen if SpO2 <90%. Palivizumab prophylaxis is given to high-risk infants (premature, congenital heart disease, chronic lung disease). Bronchodilators and corticosteroids have NOT shown benefit in bronchiolitis.",
    category: "Pediatric NP",
    difficulty: 1
  },
  {
    id: "np-peds-q24",
    type: "question",
    question: "An NP is evaluating a 7-year-old child with persistent inattention, hyperactivity, and impulsivity across settings for more than 6 months. What validated tool aids in ADHD diagnosis?",
    options: ["PHQ-9 (depression screening)", "Vanderbilt Assessment Scales completed by parents and teachers", "CAGE questionnaire", "Edinburgh Postnatal Depression Scale"],
    correctIndex: 1,
    answer: "Vanderbilt Assessment Scales are validated tools for ADHD evaluation, completed by both parents and teachers to confirm symptoms across multiple settings. DSM-5 criteria require ≥6 symptoms of inattention and/or hyperactivity-impulsivity, present before age 12, in ≥2 settings, causing functional impairment. First-line treatment for children ≥6: methylphenidate or amphetamine-based stimulants plus behavioral therapy.",
    category: "Pediatric NP",
    difficulty: 2
  },
  {
    id: "np-geri-q19",
    type: "question",
    question: "An NP is evaluating a 78-year-old patient for cognitive decline. What screening tool is most commonly used for initial cognitive assessment in primary care?",
    options: ["Hamilton Depression Rating Scale", "Montreal Cognitive Assessment (MoCA)", "Glasgow Coma Scale", "Confusion Assessment Method (CAM)"],
    correctIndex: 1,
    answer: "The Montreal Cognitive Assessment (MoCA) is the preferred screening tool for mild cognitive impairment (MCI) and early dementia, more sensitive than the MMSE. Scores ≤25/30 suggest cognitive impairment. It assesses visuospatial, executive function, naming, memory, attention, language, abstraction, and orientation. If positive, further workup includes labs (TSH, B12, RPR, metabolic panel), neuroimaging, and neuropsychological testing.",
    category: "Geriatric NP",
    difficulty: 1
  },
  {
    id: "np-geri-q20",
    type: "question",
    question: "A 72-year-old patient on multiple medications reports dizziness upon standing. BP is 148/88 sitting and 118/70 standing. Which medication class is the most likely cause?",
    options: ["Statins", "Alpha-1 adrenergic blockers (e.g., doxazosin)", "PPIs", "Acetaminophen"],
    correctIndex: 1,
    answer: "Alpha-1 blockers (doxazosin, prazosin, terazosin) commonly cause orthostatic hypotension, especially in elderly patients. The BP drop of 30 mmHg systolic meets criteria for orthostatic hypotension. These drugs should be used cautiously in geriatric patients and started at low doses at bedtime. Beers Criteria lists alpha-1 blockers as potentially inappropriate for elderly due to fall risk.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-endo-q13",
    type: "question",
    question: "A patient with type 2 diabetes on metformin and glipizide presents with an HbA1c of 8.9%. The NP considers adding a third agent. The patient has established atherosclerotic cardiovascular disease. Which drug class offers the most benefit?",
    options: ["DPP-4 inhibitor", "GLP-1 receptor agonist with proven cardiovascular benefit", "Thiazolidinedione (pioglitazone)", "Alpha-glucosidase inhibitor"],
    correctIndex: 1,
    answer: "GLP-1 RAs (liraglutide, semaglutide, dulaglutide) have proven cardiovascular outcomes benefit (LEADER, SUSTAIN-6, REWIND trials), reducing MACE (major adverse cardiovascular events). ADA/EASD guidelines recommend GLP-1 RA or SGLT2 inhibitor as preferred add-on therapy for patients with established ASCVD, independent of HbA1c. Additional benefits include weight loss and low hypoglycemia risk.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-endo-q14",
    type: "question",
    question: "A patient presents with a thyroid nodule found on physical exam. What is the initial diagnostic evaluation?",
    options: ["Immediate surgical excision", "TSH level and thyroid ultrasound", "Radioactive iodine uptake scan first", "CT scan with contrast"],
    correctIndex: 1,
    answer: "Initial evaluation of a thyroid nodule includes TSH level and thyroid ultrasound (ATA guidelines). Ultrasound characterizes the nodule (size, composition, echogenicity, margins, calcifications) and determines if fine-needle aspiration (FNA) biopsy is needed. If TSH is low (suggesting hyperfunction), a radionuclide thyroid scan is ordered to identify hot vs cold nodules. Avoid iodinated contrast until thyroid evaluation is complete.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-psych-q25",
    type: "question",
    question: "An NP is managing a patient with generalized anxiety disorder. Which first-line pharmacological treatment is recommended?",
    options: ["Benzodiazepine (lorazepam) for long-term use", "SSRI (sertraline) or SNRI (venlafaxine)", "Buspirone combined with an antipsychotic", "Barbiturate for severe anxiety"],
    correctIndex: 1,
    answer: "SSRIs (sertraline, escitalopram) and SNRIs (venlafaxine, duloxetine) are first-line pharmacotherapy for GAD per APA guidelines. They are effective, well-tolerated, and non-addictive. Buspirone is an alternative first-line agent. Benzodiazepines should be reserved for short-term acute relief only due to dependence risk, cognitive impairment, and fall risk (especially in elderly). Combine pharmacotherapy with CBT for optimal outcomes.",
    category: "Psychiatric NP",
    difficulty: 1,
    image: imgAnxiety
  },
  {
    id: "np-psych-q26",
    type: "question",
    image: imgSerotoninSyndrome,
    question: "A patient on an SSRI (fluoxetine) is also prescribed tramadol for pain. What potentially life-threatening interaction should the NP consider?",
    options: ["Hypertensive crisis", "Serotonin syndrome", "Stevens-Johnson syndrome", "Neuroleptic malignant syndrome"],
    correctIndex: 1,
    answer: "Combining SSRIs with tramadol (which has serotonergic properties) increases the risk of serotonin syndrome. Symptoms include altered mental status, autonomic instability (hyperthermia, tachycardia, diaphoresis), and neuromuscular hyperactivity (clonus, rigidity, myoclonus, hyperreflexia). Treatment: discontinue serotonergic agents, supportive care, cyproheptadine (serotonin antagonist) for moderate-severe cases. Choose an alternative analgesic.",
    category: "Psychiatric NP",
    difficulty: 2
  },
  {
    id: "np-family-q17",
    type: "question",
    question: "A 50-year-old patient with no symptoms has a total cholesterol of 240, LDL 165, HDL 38, and a 10-year ASCVD risk of 12%. What is the recommended management?",
    options: ["Lifestyle modifications only", "Initiate moderate-intensity statin therapy", "Prescribe a PCSK9 inhibitor", "Recheck lipids in 1 year"],
    correctIndex: 1,
    answer: "Per ACC/AHA guidelines, moderate-intensity statin therapy is recommended for patients aged 40-75 with LDL ≥70 mg/dL and 10-year ASCVD risk ≥7.5%. A risk of 12% places this patient in the intermediate-risk category. Risk-enhancing factors (low HDL <40, metabolic syndrome, family history) further support statin initiation. Moderate-intensity statins (atorvastatin 10-20 mg, rosuvastatin 5-10 mg) lower LDL by 30-49%.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-family-q18",
    type: "question",
    question: "A 35-year-old patient presents with recurrent epigastric burning pain that improves with eating and worsens 2-3 hours after meals. What is the most likely diagnosis and initial management?",
    options: ["GERD; prescribe H2 blocker", "Duodenal ulcer; test for H. pylori and treat if positive", "Gastric cancer; refer for endoscopy", "Pancreatitis; check lipase"],
    correctIndex: 1,
    answer: "Pain that improves with food and worsens hours later is classic for duodenal ulcer (food buffers acid, then acid secretion increases). Initial management: non-invasive H. pylori testing (urea breath test or stool antigen). If positive, triple therapy: PPI + clarithromycin + amoxicillin (or metronidazole) for 14 days. Confirm eradication 4 weeks after completing treatment. NSAIDs are another common cause.",
    category: "Family NP",
    difficulty: 2
  },
  {
    id: "np-primary-q28",
    type: "question",
    question: "An NP is counseling a 45-year-old patient on recommended cancer screening. Which screening is NOT currently recommended by USPSTF for an average-risk individual at this age?",
    options: ["Colorectal cancer screening starting at age 45", "Breast cancer screening with mammography at age 40", "Prostate cancer screening with PSA for all men at age 45", "Cervical cancer screening with Pap smear or HPV testing"],
    correctIndex: 2,
    answer: "USPSTF does NOT recommend universal PSA screening for prostate cancer. Instead, it recommends shared decision-making for men aged 55-69 (Grade C). USPSTF does recommend colorectal cancer screening starting at age 45 (Grade B), breast cancer screening with biennial mammography ages 40-74 (Grade B), and cervical cancer screening ages 21-65 (Pap every 3 years or HPV co-testing every 5 years ages 30-65).",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-primary-q29",
    type: "question",
    question: "A patient presents with a painful, erythematous, warm, swollen first metatarsophalangeal joint that developed overnight. Serum uric acid is 9.2 mg/dL. What is the first-line acute treatment?",
    options: ["Allopurinol", "Colchicine or NSAIDs", "Corticosteroid long-term maintenance", "Probenecid"],
    correctIndex: 1,
    answer: "Acute gout flare first-line treatment: NSAIDs (indomethacin), colchicine (most effective within 36 hours of onset), or corticosteroids (if NSAIDs/colchicine contraindicated). Do NOT start or adjust urate-lowering therapy (allopurinol, febuxostat) during an acute attack as this can worsen the flare. Allopurinol is for chronic prophylaxis once the acute flare resolves. Joint aspiration showing negatively birefringent monosodium urate crystals is diagnostic.",
    category: "Primary Care NP",
    difficulty: 2
  },
  {
    id: "np-acute-q25",
    type: "question",
    question: "A critically ill patient in the ICU develops a temperature of 38.8°C, WBC 18,000, and new pulmonary infiltrate on CXR 3 days after intubation. What is the most likely diagnosis?",
    options: ["Community-acquired pneumonia", "Ventilator-associated pneumonia (VAP)", "Pulmonary embolism", "ARDS"],
    correctIndex: 1,
    answer: "Ventilator-associated pneumonia (VAP) develops ≥48 hours after endotracheal intubation. Diagnosis: new/progressive infiltrate + fever + leukocytosis + purulent secretions. Obtain lower respiratory tract cultures before starting empiric broad-spectrum antibiotics (covering Pseudomonas, MRSA, Acinetobacter). VAP prevention bundle: HOB elevation 30-45°, daily sedation vacations, oral care with chlorhexidine, DVT and PUD prophylaxis.",
    category: "Acute Care NP",
    difficulty: 3
  },
  {
    id: "np-acute-q26",
    type: "question",
    question: "A post-operative patient develops sudden dyspnea, tachycardia, hypoxia, and unilateral leg swelling on day 3. The NP suspects pulmonary embolism. What is the initial diagnostic test of choice?",
    options: ["D-dimer level", "CT pulmonary angiography (CTPA)", "Ventilation-perfusion scan", "Lower extremity ultrasound"],
    correctIndex: 1,
    answer: "CT pulmonary angiography (CTPA) is the gold standard diagnostic test for PE. D-dimer is useful for ruling OUT PE in low-probability patients (high sensitivity, low specificity) but is often elevated post-operatively and not helpful in this clinical setting. For hemodynamically unstable patients who cannot undergo CTPA, bedside echocardiography showing RV strain supports the diagnosis. Start anticoagulation (heparin) immediately if clinical suspicion is high.",
    category: "Acute Care NP",
    difficulty: 2
  },
  {
    id: "np-ebp-q17",
    type: "question",
    question: "An NP wants to determine if a new wound care protocol reduces infection rates compared to standard care. What is the most rigorous study design?",
    options: ["Case series", "Cohort study", "Randomized controlled trial (RCT)", "Cross-sectional survey"],
    correctIndex: 2,
    answer: "Randomized controlled trials (RCTs) are the gold standard for evaluating treatment efficacy. Randomization minimizes selection bias and confounding variables, allowing causal inference. Systematic reviews/meta-analyses of RCTs sit at the top of the evidence hierarchy. RCTs are Level II evidence; systematic reviews of RCTs are Level I. The NP should also consider feasibility, ethics, and PICOT framework when designing research.",
    category: "Research & EBP",
    difficulty: 1
  },
  {
    id: "np-ebp-q18",
    type: "question",
    question: "An NP is evaluating a diagnostic test for strep pharyngitis. The rapid strep test has 95% sensitivity and 98% specificity. If the test is negative, what does this mean clinically?",
    options: ["The patient definitely does not have strep", "There is a 5% chance the patient actually has strep (false negative)", "The test must be repeated three times", "Specificity determines this, not sensitivity"],
    correctIndex: 1,
    answer: "Sensitivity of 95% means the test correctly identifies 95% of people WITH the disease (true positives). A negative test means there is a 5% false-negative rate. For strep, clinical guidelines recommend backup throat culture if rapid test is negative in children/adolescents (high sensitivity of culture). Specificity of 98% means 98% of people WITHOUT the disease test negative correctly. SpPIn (high specificity rules IN), SnNOut (high sensitivity rules OUT).",
    category: "Research & EBP",
    difficulty: 2
  },
  {
    id: "np-womens-q19",
    type: "question",
    question: "A 32-year-old woman presents with heavy, painful periods and dyspareunia. Pelvic exam reveals a fixed, retroverted uterus with nodularity of the uterosacral ligaments. What is the most likely diagnosis?",
    options: ["Uterine fibroids", "Endometriosis", "Pelvic inflammatory disease", "Ovarian cyst"],
    correctIndex: 1,
    answer: "Endometriosis presents with the classic triad: dysmenorrhea, dyspareunia, and dyschezia (painful defecation). Pelvic exam findings of uterosacral nodularity and fixed retroverted uterus are characteristic. Definitive diagnosis requires laparoscopy with biopsy. First-line medical management: combined oral contraceptives (continuous use) or progestins. GnRH agonists (leuprolide) for refractory cases. Surgical excision/ablation for severe disease or infertility.",
    category: "Women's Health NP",
    difficulty: 2,
    image: imgEndometriosis
  },
  {
    id: "np-womens-q20",
    type: "question",
    question: "A 52-year-old woman in menopause presents with hot flashes, vaginal dryness, and sleep disturbances. She has no history of breast cancer or thromboembolic disease. What is the most effective treatment?",
    options: ["Black cohosh supplement", "Hormone replacement therapy (HRT) with combined estrogen-progesterone", "SSRI monotherapy", "Gabapentin only"],
    correctIndex: 1,
    answer: "HRT (estrogen + progesterone for women with a uterus) is the most effective treatment for vasomotor symptoms. Per NAMS 2022 position statement, the benefits outweigh risks when initiated within 10 years of menopause or before age 60 (window of opportunity). Contraindications: breast cancer, active liver disease, unexplained vaginal bleeding, history of VTE/stroke. SSRIs and gabapentin are alternatives for women who cannot take HRT.",
    category: "Women's Health NP",
    difficulty: 2,
    image: imgMenopause
  },
  {
    id: "np-policy-q7",
    type: "question",
    question: "An NP in a full practice authority state wants to open an independent primary care clinic. Which regulatory requirement must be met?",
    options: ["Obtain a collaborative agreement with a physician", "Apply for NP state licensure with prescriptive authority and DEA registration", "Practice under physician supervision for the first 5 years", "Only prescribe non-controlled substances"],
    correctIndex: 1,
    answer: "In full practice authority (FPA) states, NPs practice independently without physician oversight. Requirements include: active RN and APRN licensure, national board certification, state prescriptive authority (including controlled substances), DEA registration, NPI number, malpractice insurance, and compliance with state-specific business regulations. As of 2024, 27 states and DC grant full practice authority to NPs.",
    category: "Health Policy",
    difficulty: 1
  },
  {
    id: "np-policy-q8",
    type: "question",
    question: "An NP prescribes a Schedule II controlled substance. What federal requirement applies to this prescription?",
    options: ["It can be called in to the pharmacy", "It requires a written or electronic prescription with no refills", "It can have up to 3 refills", "A DEA number is not required"],
    correctIndex: 1,
    answer: "Schedule II controlled substances (opioids, amphetamines, methylphenidate) require a written or electronic prescription per DEA regulations. NO refills are permitted; a new prescription is needed each time. The NP must have a valid DEA registration and state-specific controlled substance authority. Many states also require checking the Prescription Drug Monitoring Program (PDMP) before prescribing opioids.",
    category: "Health Policy",
    difficulty: 1
  },
  {
    id: "np-pc-q14",
    type: "question",
    question: "A 60-year-old patient with a 30-pack-year smoking history asks about lung cancer screening. What does the NP recommend based on USPSTF guidelines?",
    options: ["Chest X-ray annually", "Low-dose CT (LDCT) scan annually", "Sputum cytology every 2 years", "No screening is recommended at this age"],
    correctIndex: 1,
    answer: "USPSTF recommends annual low-dose CT (LDCT) screening for adults aged 50-80 years with a ≥20-pack-year smoking history who currently smoke or quit within the past 15 years (Grade B). Screening should be discontinued once a person has not smoked for 15 years or has a limited life expectancy. LDCT reduces lung cancer mortality by 20% compared to chest X-ray (NLST trial).",
    category: "Primary Care",
    difficulty: 1,
    image: imgLungCancer
  },
  {
    id: "np-pc-q15",
    type: "question",
    question: "An NP is managing a patient with chronic low back pain lasting >12 weeks. What is the recommended first-line non-pharmacological treatment?",
    options: ["Strict bed rest for 2 weeks", "Exercise therapy and cognitive behavioral therapy", "Immediate referral for spinal surgery", "Opioid therapy as first-line"],
    correctIndex: 1,
    answer: "ACP guidelines recommend non-pharmacological therapies as first-line for chronic low back pain: exercise (yoga, tai chi, progressive relaxation), CBT, spinal manipulation, acupuncture, and mindfulness-based stress reduction. If pharmacotherapy is needed, NSAIDs are first-line, followed by duloxetine or tramadol. Opioids are last resort due to limited evidence of long-term benefit and significant harms. Bed rest is NOT recommended.",
    category: "Primary Care",
    difficulty: 1
  },
  {
    id: "np-dx-q15",
    type: "question",
    question: "A patient presents with bilateral hand pain and stiffness, worse in the morning for 15 minutes, affecting the DIP joints. Exam shows Heberden's nodes. What is the diagnosis?",
    options: ["Rheumatoid arthritis", "Osteoarthritis", "Psoriatic arthritis", "Gout"],
    correctIndex: 1,
    answer: "Osteoarthritis (OA) classically affects DIP joints (Heberden's nodes) and PIP joints (Bouchard's nodes). Morning stiffness in OA lasts <30 minutes (vs >1 hour in RA). OA is a degenerative, non-inflammatory arthritis. X-rays show joint space narrowing, osteophytes, subchondral sclerosis. RA affects MCP/PIP joints symmetrically with prolonged morning stiffness. Management: acetaminophen, topical NSAIDs, exercise, weight management.",
    category: "Diagnostic Reasoning",
    difficulty: 1
  },
  {
    id: "np-dx-q16",
    type: "question",
    question: "A patient with well-controlled HIV (undetectable viral load, CD4 450) presents for annual wellness. Which immunization is CONTRAINDICATED?",
    options: ["Influenza inactivated vaccine", "Pneumococcal vaccine (PCV20)", "Live attenuated MMR vaccine if CD4 <200", "Tdap booster"],
    correctIndex: 2,
    answer: "Live vaccines (MMR, varicella, live attenuated influenza, oral polio, BCG, yellow fever) are contraindicated in immunocompromised patients with CD4 <200 cells/mm³. With CD4 ≥200, MMR and varicella vaccines CAN be administered if the patient is not immune. Inactivated vaccines (influenza, pneumococcal, Tdap, Hep A/B, HPV, COVID) are safe regardless of CD4 count. Recombinant zoster vaccine (Shingrix) is recommended for adults ≥19 with HIV.",
    category: "Diagnostic Reasoning",
    difficulty: 3,
    image: imgHIV
  },
  {
    id: "np-ac-q9",
    type: "question",
    question: "A patient in the ICU with sepsis has a lactate of 4.2 mmol/L and MAP of 58 mmHg despite 30 mL/kg IV crystalloid resuscitation. What is the next intervention?",
    options: ["Continue IV fluids only", "Start vasopressor therapy (norepinephrine)", "Administer oral antibiotics", "Discharge if afebrile"],
    correctIndex: 1,
    answer: "Per Surviving Sepsis Campaign guidelines, if MAP remains <65 mmHg after initial fluid resuscitation (30 mL/kg crystalloid within 3 hours), norepinephrine is the first-line vasopressor. Elevated lactate (>2 mmol/L) indicates tissue hypoperfusion. The hour-1 bundle includes: measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin rapid fluid resuscitation, and apply vasopressors for refractory hypotension.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-ac-q10",
    type: "question",
    question: "A patient with new-onset atrial fibrillation with rapid ventricular response (HR 152, BP 88/60) presents with altered mental status. What is the immediate management?",
    options: ["IV diltiazem for rate control", "Synchronized cardioversion", "Oral amiodarone and observation", "IV metoprolol and discharge"],
    correctIndex: 1,
    answer: "Hemodynamically unstable atrial fibrillation (hypotension, altered mental status, chest pain, acute heart failure) requires immediate synchronized cardioversion per ACLS guidelines. Stable AFib with RVR is managed with rate control agents (IV diltiazem, metoprolol, or amiodarone). Anticoagulation decision based on CHA2DS2-VASc score. If AF duration >48 hours, TEE before cardioversion to rule out left atrial thrombus.",
    category: "Acute Care",
    difficulty: 3
  },
  {
    id: "np-fnp-q7",
    type: "question",
    question: "An NP is managing a patient with chronic hepatitis C (genotype 1). What is the current recommended treatment approach?",
    options: ["Interferon-based therapy for 48 weeks", "Direct-acting antiviral (DAA) regimen for 8-12 weeks", "Liver transplant as first-line", "No treatment is available"],
    correctIndex: 1,
    answer: "Direct-acting antivirals (DAAs) have revolutionized HCV treatment with >95% sustained virologic response (cure) rates. Pan-genotypic regimens include sofosbuvir/velpatasvir (Epclusa) and glecaprevir/pibrentasvir (Mavyret) for 8-12 weeks. Interferon-based therapy is no longer recommended. Screen all adults aged 18-79 (USPSTF Grade B). Check HCV RNA 12 weeks post-treatment to confirm SVR (cure). Assess for cirrhosis before treatment.",
    category: "Family NP",
    difficulty: 2,
    image: imgHepatitisC
  },
  {
    id: "np-wh-q6",
    type: "question",
    question: "A 25-year-old woman requests emergency contraception 48 hours after unprotected intercourse. She weighs 85 kg (BMI 31). What is the most effective option?",
    options: ["Levonorgestrel (Plan B)", "Copper IUD insertion", "Combined oral contraceptive pills (Yuzpe method)", "No effective options exist at 48 hours"],
    correctIndex: 1,
    answer: "The copper IUD is the most effective form of emergency contraception (>99% effective) and can be inserted up to 5 days after unprotected intercourse. It is effective regardless of BMI, unlike levonorgestrel (Plan B), which has reduced efficacy in women >70 kg. Ulipristal acetate (ella) is more effective than Plan B for overweight women but less effective than copper IUD. The copper IUD also provides ongoing contraception for up to 10 years.",
    category: "Women's Health",
    difficulty: 2
  },
  {
    id: "np-diff-q24",
    type: "question",
    question: "A patient presents with periumbilical pain that migrated to the right lower quadrant over 12 hours, with rebound tenderness and a positive psoas sign. What is the most likely diagnosis?",
    options: ["Cholecystitis", "Acute appendicitis", "Crohn's disease flare", "Ectopic pregnancy"],
    correctIndex: 1,
    answer: "Classic appendicitis presents with periumbilical pain migrating to McBurney's point (RLQ), rebound tenderness, guarding, positive psoas sign (pain with right hip extension), and positive Rovsing's sign (RLQ pain with LLQ palpation). CT abdomen with contrast is the gold standard for diagnosis. Treatment is appendectomy. Obtain a pregnancy test in women of childbearing age to rule out ectopic pregnancy.",
    category: "Differential Diagnosis",
    difficulty: 1,
    image: imgEctopicPregnancy
  },
  {
    id: "np-diff-q25",
    type: "question",
    question: "A 68-year-old patient presents with acute onset of painless hematuria without UTI symptoms. What is the most concerning diagnosis to rule out?",
    options: ["Benign prostatic hyperplasia", "Bladder cancer", "Kidney stones", "Exercise-induced hematuria"],
    correctIndex: 1,
    answer: "Painless gross hematuria in adults over 50 is bladder cancer until proven otherwise. Risk factors: smoking (strongest), occupational exposure to aromatic amines/benzidine, chronic cystitis, prior pelvic radiation. Workup: urinalysis with cytology, CT urogram, and cystoscopy (gold standard). Refer urgently to urology. Transitional cell carcinoma (urothelial carcinoma) is the most common type (90%).",
    category: "Differential Diagnosis",
    difficulty: 2
  },
  {
    id: "np-pharm-q23",
    type: "question",
    question: "An NP is prescribing doxycycline for a patient with community-acquired pneumonia. Which counseling point is most important?",
    options: ["Take with a large glass of milk", "Avoid sun exposure due to photosensitivity risk", "Take on an empty stomach only", "This medication is safe in pregnancy"],
    correctIndex: 1,
    answer: "Tetracyclines (doxycycline, minocycline) cause significant photosensitivity, increasing risk of severe sunburn. Counsel patients to use broad-spectrum sunscreen (SPF 30+), wear protective clothing, and avoid prolonged sun exposure. Additional precautions: take with food and a full glass of water, remain upright for 30 minutes after (esophageal ulceration risk), avoid in pregnancy and children <8 (tooth discoloration, bone growth effects).",
    category: "Advanced Pharmacology",
    difficulty: 1
  },
  {
    id: "np-geri-q21",
    type: "question",
    question: "An 80-year-old patient with dementia is exhibiting agitation and aggression. The family asks for a medication to calm the patient. What is the NP's best approach?",
    options: ["Prescribe haloperidol for long-term use", "First assess for underlying causes (pain, infection, constipation, delirium), then try non-pharmacological interventions", "Start a benzodiazepine for daily use", "Prescribe diphenhydramine for sedation"],
    correctIndex: 1,
    answer: "Behavioral and psychological symptoms of dementia (BPSD) should first be evaluated for reversible causes: pain, UTI, constipation, medication side effects, environmental triggers. Non-pharmacological interventions are first-line: music therapy, redirection, structured activities, caregiver education. Antipsychotics carry an FDA black box warning for increased mortality in elderly with dementia. If medication is necessary, use lowest dose for shortest duration with informed consent.",
    category: "Geriatric NP",
    difficulty: 2
  },
  {
    id: "np-derm-vitiligo-q1",
    type: "question",
    question: "A patient with extensive vitiligo asks about treatment options. Which first-line therapy does the NP recommend for limited disease?",
    options: ["Systemic corticosteroids", "Topical high-potency corticosteroids or topical calcineurin inhibitors", "Surgical melanocyte transplantation", "Oral psoralen with UVA (PUVA)"],
    correctIndex: 1,
    answer: "For limited vitiligo (<20% BSA), topical high-potency corticosteroids (for body) or calcineurin inhibitors (tacrolimus, pimecrolimus — preferred for face/intertriginous areas to avoid steroid atrophy) are first-line. Narrowband UVB phototherapy is first-line for widespread disease. PUVA has more side effects. Surgical options are reserved for stable, refractory cases.",
    image: imgVitiligo,
    category: "Dermatology NP",
    difficulty: 2
  },
  {
    id: "np-gu-urethral-stricture-q1",
    type: "question",
    question: "An NP evaluates a male patient with recurrent UTIs and obstructive voiding symptoms. Retrograde urethrography confirms a 2 cm bulbar urethral stricture. What is the definitive management?",
    options: ["Long-term antibiotic prophylaxis", "Intermittent self-catheterization", "Referral for urethroplasty (surgical reconstruction)", "Repeated urethral dilation every 3 months indefinitely"],
    correctIndex: 2,
    answer: "Urethroplasty is the definitive treatment for urethral stricture with the highest long-term success rate (85-90%). Urethral dilation and direct visual internal urethrotomy (DVIU) have high recurrence rates (>50%), especially for strictures >2 cm or after failed prior procedures. The NP refers to urology for surgical evaluation and manages interim symptoms.",
    image: imgUrethralStricture,
    category: "Urology NP",
    difficulty: 3
  },
  {
    id: "np-neuro-vestibular-neuritis-q1",
    type: "question",
    question: "A patient presents with acute onset severe vertigo, nausea, and horizontal nystagmus beating away from the affected ear, but hearing is preserved. MRI is normal. What is the NP's diagnosis and initial management?",
    options: ["BPPV — perform Epley maneuver", "Vestibular neuritis — prescribe corticosteroids and vestibular suppressants", "Meniere disease — start salt restriction and diuretics", "Posterior circulation stroke — activate stroke protocol"],
    correctIndex: 1,
    answer: "Vestibular neuritis presents with acute severe vertigo, unidirectional horizontal nystagmus (fast phase away from lesion), and preserved hearing (distinguishing it from labyrinthitis). Normal MRI excludes stroke. Management: methylprednisolone taper (if within 72 hours of onset, improves vestibular recovery), short-term vestibular suppressants (meclizine, diazepam), antiemetics, and early vestibular rehabilitation therapy.",
    image: imgVestibularNeuritis,
    category: "Neurology NP",
    difficulty: 3
  },
  // ===== OBESITY PATHOPHYSIOLOGY & MANAGEMENT FLASHCARDS =====
  {
    id: "np-obesity-q1",
    type: "term",
    question: "What BMI classifications define overweight, class I, class II, and class III obesity?",
    answer: "Overweight: 25-29.9 kg/m². Class I obesity: 30-34.9. Class II: 35-39.9. Class III (morbid): ≥40. These classifications guide pharmacotherapy and surgical eligibility.",
    category: "Endocrine NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q2",
    type: "question",
    question: "What is the mechanism of leptin resistance in obesity?",
    options: ["Leptin production decreases", "SOCS3 suppresses hypothalamic leptin signaling despite high leptin levels", "Leptin receptors increase in number", "Leptin converts to adiponectin"],
    correctIndex: 1,
    answer: "In obesity, chronic hyperleptinemia causes upregulation of SOCS3 (suppressor of cytokine signaling 3), which blocks JAK-STAT3 signaling downstream of the leptin receptor (ObRb), rendering the hypothalamus resistant to leptin's satiety signal.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q3",
    type: "term",
    question: "What is the set-point theory of body weight?",
    answer: "The hypothalamus defends a genetically-influenced body weight range through adaptive thermogenesis and hormonal adjustments (increased ghrelin, decreased leptin/PYY/GLP-1 after weight loss). This explains why sustained weight loss is difficult without pharmacotherapy.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q4",
    type: "question",
    question: "Semaglutide 2.4 mg (Wegovy) achieves what average weight loss in clinical trials?",
    options: ["3-5%", "8-10%", "15-17%", "25-30%"],
    correctIndex: 2,
    answer: "STEP trials demonstrated 15-17% average weight loss with semaglutide 2.4 mg weekly vs 2.4% with placebo. The SELECT trial additionally showed 20% MACE reduction, establishing cardiovascular benefit.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q5",
    type: "term",
    question: "What is the boxed warning for all GLP-1 receptor agonists?",
    answer: "Risk of thyroid C-cell tumors (medullary thyroid carcinoma) based on rodent studies. Contraindicated in patients with personal or family history of MTC or MEN type 2. No confirmed risk in humans to date.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q6",
    type: "question",
    question: "What anti-obesity medication is Category X in pregnancy due to topiramate's teratogenic effect?",
    options: ["Semaglutide", "Orlistat", "Phentermine-topiramate ER (Qsymia)", "Naltrexone-bupropion"],
    correctIndex: 2,
    answer: "Topiramate causes cleft palate/lip. Qsymia's REMS program mandates monthly pregnancy testing and effective contraception. If pregnancy occurs, discontinue immediately (taper topiramate).",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q7",
    type: "term",
    question: "When should anti-obesity medications be discontinued for non-response?",
    answer: "Discontinue if <5% weight loss is not achieved after 12-16 weeks at maximum tolerated dose. Non-response indicates the patient will not benefit from continued use. Consider alternative pharmacotherapy or bariatric surgery referral.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q8",
    type: "question",
    question: "What is tirzepatide (Zepbound) and how much weight loss does it achieve?",
    options: ["GLP-1 agonist, 10%", "Dual GIP/GLP-1 agonist, 20-22%", "Lipase inhibitor, 5%", "Norepinephrine reuptake inhibitor, 8%"],
    correctIndex: 1,
    answer: "Tirzepatide is a dual GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptor agonist. SURMOUNT trials: 20-22% weight loss at maximum dose — the highest of any approved anti-obesity medication.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q9",
    type: "term",
    question: "What are the 2022 ASMBS/IFSO updated bariatric surgery thresholds?",
    answer: "BMI ≥35 regardless of comorbidities, or BMI 30-34.9 with metabolic disease (T2DM, hypertension, dyslipidemia, NAFLD, OSA). This lowers previous thresholds (≥40 or ≥35 with comorbidities).",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q10",
    type: "question",
    question: "Why is waist circumference a better predictor of cardiovascular risk than BMI?",
    options: ["It measures muscle mass", "It reflects visceral adiposity which is more metabolically active than subcutaneous fat", "It correlates with height", "It predicts liver disease only"],
    correctIndex: 1,
    answer: "Visceral fat drains into the portal circulation, exposing the liver to FFAs and inflammatory cytokines. Central obesity (>40\" males, >35\" females) identifies cardiometabolic risk even in normal-BMI patients (metabolically obese normal weight).",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q11",
    type: "term",
    question: "What hormonal changes after weight loss promote weight regain?",
    answer: "Increased ghrelin (hunger), decreased leptin (satiety), decreased PYY (satiety), decreased GLP-1 (satiety), and reduced resting metabolic rate (adaptive thermogenesis). These persist for years, supporting chronic pharmacotherapy.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q12",
    type: "question",
    question: "What defines metabolic syndrome?",
    options: ["1 of 5 criteria", "2 of 5 criteria", "3 of 5 criteria", "All 5 criteria"],
    correctIndex: 2,
    answer: "≥3 of 5: waist circumference (>40\" M, >35\" F), TG ≥150, HDL <40 M/<50 F, BP ≥130/85, fasting glucose ≥100 mg/dL.",
    category: "Endocrine NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q13",
    type: "term",
    question: "What is acanthosis nigricans and what does it indicate?",
    answer: "Dark, velvety skin patches in intertriginous areas (neck, axillae, groin). A clinical marker of insulin resistance and hyperinsulinemia — excess insulin activates IGF-1 receptors on keratinocytes. Screen for prediabetes/T2DM.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q14",
    type: "question",
    question: "After Roux-en-Y gastric bypass, which nutritional deficiencies require lifelong monitoring?",
    options: ["None", "Only vitamin C", "Iron, B12, folate, calcium, vitamin D, fat-soluble vitamins (A, E, K)", "Only protein"],
    correctIndex: 2,
    answer: "RYGB bypasses the duodenum and proximal jejunum where iron, calcium, and fat-soluble vitamins are absorbed. B12 absorption is impaired from reduced intrinsic factor. Lifelong supplementation and lab monitoring are mandatory.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q15",
    type: "term",
    question: "What is the role of adiponectin in metabolic health?",
    answer: "Adiponectin enhances insulin sensitivity via AMPK activation, promotes fatty acid oxidation, and has anti-inflammatory properties. Paradoxically DECREASED in obesity despite more adipose tissue, contributing to insulin resistance.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q16",
    type: "question",
    question: "How much weight is typically regained after discontinuing GLP-1 RA therapy?",
    options: ["None", "One-third", "Two-thirds within 1 year", "All weight is regained immediately"],
    correctIndex: 2,
    answer: "STEP 1 extension data: approximately two-thirds of weight lost is regained within 1 year of semaglutide discontinuation. This supports the chronic disease model of obesity requiring long-term pharmacotherapy.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q17",
    type: "term",
    question: "What is HOMA-IR and how is it calculated?",
    answer: "Homeostatic Model Assessment of Insulin Resistance = fasting glucose (mg/dL) × fasting insulin (μU/mL) / 405. Values >2.5 suggest insulin resistance. Helps identify metabolically unhealthy obesity.",
    category: "Assessment NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q18",
    type: "question",
    question: "Orlistat works by which mechanism?",
    options: ["Appetite suppression", "Inhibiting pancreatic/gastric lipases preventing ~30% dietary fat absorption", "Increasing metabolic rate", "Blocking carbohydrate absorption"],
    correctIndex: 1,
    answer: "Orlistat inhibits lipases, preventing 30% of dietary fat absorption. GI side effects (steatorrhea, oily spotting) worsen with high-fat meals. Supplement fat-soluble vitamins (A, D, E, K).",
    category: "Pharmacology NP",
    difficulty: 1
  },
  // ===== SMOKING CESSATION FLASHCARDS =====
  {
    id: "np-smoking-q1",
    type: "term",
    question: "What is the mechanism of nicotine addiction?",
    answer: "Nicotine binds alpha4beta2 nicotinic acetylcholine receptors on VTA neurons, triggering dopamine release in the nucleus accumbens (reward center). Chronic exposure upregulates receptor density, causing withdrawal during abstinence.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q2",
    type: "question",
    question: "Which smoking cessation medication is the most effective single agent?",
    options: ["Nicotine patch", "Bupropion SR", "Varenicline (Chantix)", "Nicotine gum"],
    correctIndex: 2,
    answer: "Varenicline (OR 2.24 vs placebo) is the most effective single-agent cessation therapy. As a partial agonist at alpha4beta2 nAChRs, it provides moderate dopamine release while blocking nicotine's rewarding effect.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q3",
    type: "term",
    question: "What did the EAGLES trial demonstrate about varenicline?",
    answer: "The EAGLES trial (2016) showed NO increased risk of neuropsychiatric adverse events with varenicline compared to NRT, bupropion, or placebo — even in patients with psychiatric disorders. The FDA boxed warning was REMOVED.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q4",
    type: "question",
    question: "Which cessation medication has dual FDA approval for depression AND smoking cessation?",
    options: ["Varenicline", "Nicotine patch", "Bupropion SR", "Nicotine gum"],
    correctIndex: 2,
    answer: "Bupropion SR (Zyban/Wellbutrin) has dual indications for depression and smoking cessation via norepinephrine-dopamine reuptake inhibition. Also weight-neutral, beneficial for patients concerned about post-cessation weight gain.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q5",
    type: "term",
    question: "What are bupropion's contraindications for smoking cessation?",
    answer: "Seizure disorder, history of seizures, bulimia/anorexia (seizure risk), concurrent MAOIs (14-day washout), abrupt alcohol or benzodiazepine discontinuation. Do not exceed 300 mg/day.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q6",
    type: "question",
    question: "The most predictive item on the Fagerström Test is:",
    options: ["Cigarettes per day", "Time to first cigarette after waking", "Difficulty refraining in restricted areas", "Smoking when ill"],
    correctIndex: 1,
    answer: "Smoking within 5 minutes of waking indicates severe physical dependence requiring aggressive pharmacotherapy. This item reflects the intensity of overnight nicotine withdrawal.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q7",
    type: "term",
    question: "What are the 5 A's of smoking cessation counseling?",
    answer: "Ask about tobacco use, Advise to quit (clear, personalized), Assess willingness, Assist with quit plan and pharmacotherapy, Arrange follow-up. Even 3-minute brief advice increases quit rates by 30%.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q8",
    type: "question",
    question: "When should bupropion be started relative to the quit date?",
    options: ["On the quit date", "1-2 weeks before the quit date", "1 month after quitting", "Only after a relapse"],
    correctIndex: 1,
    answer: "Start bupropion 1-2 weeks before the target quit date to achieve steady-state therapeutic levels by the quit date. Start 150 mg daily x3 days, then 150 mg BID.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q9",
    type: "term",
    question: "What is cotinine and why is it clinically useful?",
    answer: "Cotinine is the primary metabolite of nicotine via CYP2A6, with a 16-hour half-life (vs 2 hours for nicotine). Urine cotinine >200 ng/mL indicates active smoking. Used to verify self-reported smoking status.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q10",
    type: "question",
    question: "Combination NRT for smoking cessation consists of:",
    options: ["Two patches at different sites", "Patch (baseline) + short-acting NRT (gum/lozenge) for breakthrough cravings", "Oral tablet + injectable", "E-cigarette + gum"],
    correctIndex: 1,
    answer: "Combination NRT: nicotine patch provides continuous baseline replacement + short-acting form (gum, lozenge, inhaler, or nasal spray) addresses breakthrough cravings. Achieves quit rates comparable to varenicline monotherapy.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q11",
    type: "term",
    question: "When do nicotine withdrawal symptoms peak?",
    answer: "Withdrawal symptoms (irritability, anxiety, difficulty concentrating, increased appetite, depressed mood, cravings) peak at 24-72 hours and gradually diminish over 2-4 weeks. Psychological cravings may persist for months.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q12",
    type: "question",
    question: "What is the mechanism of action of varenicline?",
    options: ["Full agonist at nicotinic receptors", "Dopamine reuptake inhibitor", "Partial agonist at alpha4beta2 nAChRs", "Opioid receptor antagonist"],
    correctIndex: 2,
    answer: "Partial agonist: provides moderate dopamine release (reduces withdrawal, agonist effect) while blocking nicotine from fully activating the receptor (reduces reward, antagonist effect).",
    category: "Pharmacology NP",
    difficulty: 2
  },
  // ===== PARKINSON DISEASE FLASHCARDS =====
  {
    id: "np-parkinson-q1",
    type: "term",
    question: "What are the four cardinal motor features of Parkinson disease?",
    answer: "Resting tremor (4-6 Hz, pill-rolling), rigidity (cogwheel or lead-pipe), bradykinesia (slowness — most disabling, required for diagnosis), and postural instability (typically later feature).",
    category: "Neurology NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q2",
    type: "question",
    question: "What is the gold standard medication for PD motor symptoms?",
    options: ["Pramipexole", "Amantadine", "Carbidopa-levodopa (Sinemet)", "Benztropine"],
    correctIndex: 2,
    answer: "Carbidopa-levodopa is the gold standard — levodopa crosses the BBB and converts to dopamine. Carbidopa prevents peripheral conversion, reducing side effects and increasing CNS bioavailability.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q3",
    type: "term",
    question: "Why should high-protein meals be avoided around levodopa dosing?",
    answer: "Large neutral amino acids compete with levodopa for intestinal absorption and BBB transport via the LAT1 transporter. High-protein meals significantly reduce levodopa bioavailability. Take 30-60 min before meals.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q4",
    type: "question",
    question: "Impulse control disorders on dopamine agonists include all EXCEPT:",
    options: ["Pathological gambling", "Compulsive shopping", "Hypersexuality", "Bradykinesia"],
    correctIndex: 3,
    answer: "Impulse control disorders (15-20% prevalence): pathological gambling, compulsive shopping, hypersexuality, binge eating. These are D3-mediated and dose-dependent. Screen at every visit. Management: taper the dopamine agonist.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q5",
    type: "term",
    question: "What is wearing-off phenomenon in PD?",
    answer: "End-of-dose deterioration where motor symptoms return before the next levodopa dose. Caused by progressive dopaminergic neuron loss reducing dopamine storage capacity. Management: add entacapone, increase dosing frequency, or add dopamine agonist.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q6",
    type: "question",
    question: "Which antipsychotic is FDA-approved specifically for PD psychosis?",
    options: ["Haloperidol", "Quetiapine", "Pimavanserin (Nuplazid)", "Risperidone"],
    correctIndex: 2,
    answer: "Pimavanserin is a selective 5-HT2A inverse agonist with NO dopamine receptor blocking activity, so it doesn't worsen motor symptoms. Quetiapine (lowest D2 affinity) and clozapine are alternatives.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q7",
    type: "term",
    question: "What is the Braak staging hypothesis?",
    answer: "Alpha-synuclein pathology begins in the olfactory bulb and dorsal motor nucleus of vagus (stages 1-2), ascends to brainstem/midbrain (stages 3-4, motor symptoms), and reaches neocortex (stages 5-6, dementia).",
    category: "Neurology NP",
    difficulty: 3
  },
  {
    id: "np-parkinson-q8",
    type: "question",
    question: "Drug-induced parkinsonism is most commonly caused by:",
    options: ["ACE inhibitors", "D2 receptor blocking agents (metoclopramide, haloperidol)", "Statins", "Beta-blockers"],
    correctIndex: 1,
    answer: "Drug-induced parkinsonism from D2 blockers (metoclopramide, prochlorperazine, typical antipsychotics) is reversible with medication discontinuation. DaTscan is normal (distinguishing from true PD).",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q9",
    type: "term",
    question: "What is the DaTscan and when is it used?",
    answer: "Dopamine transporter SPECT imaging using 123I-ioflupane. Reduced striatal uptake indicates dopaminergic neuron loss (PD). Normal uptake distinguishes essential tremor and drug-induced parkinsonism from PD.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q10",
    type: "question",
    question: "What medication treats levodopa-induced dyskinesias?",
    options: ["Increase levodopa dose", "Amantadine (NMDA antagonist)", "Benztropine", "Selegiline"],
    correctIndex: 1,
    answer: "Amantadine (extended-release, Gocovri) is the only FDA-approved medication for levodopa-induced dyskinesias. It reduces glutamatergic overactivity in the basal ganglia.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q11",
    type: "term",
    question: "What is REM sleep behavior disorder and its relationship to PD?",
    answer: "Loss of normal REM atonia causing patients to act out dreams (kicking, punching, yelling during sleep). Precedes PD motor symptoms by 5-15+ years. Over 80% of RBD patients eventually develop a synucleinopathy (PD, DLB, MSA).",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q12",
    type: "question",
    question: "Hoehn and Yahr Stage 3 Parkinson disease is characterized by:",
    options: ["Unilateral symptoms only", "Bilateral without balance impairment", "Bilateral with postural instability", "Wheelchair-bound"],
    correctIndex: 2,
    answer: "Stage 1: unilateral. Stage 2: bilateral, no balance issues. Stage 3: bilateral with postural instability. Stage 4: severe disability, can stand/walk. Stage 5: wheelchair/bedridden.",
    category: "Assessment NP",
    difficulty: 1
  },
  // ===== MENINGITIS FLASHCARDS =====
  {
    id: "np-meningitis-q1",
    type: "term",
    question: "What is the empiric antibiotic regimen for adults with suspected bacterial meningitis?",
    answer: "Age 18-50: vancomycin + ceftriaxone. Age >50 or immunocompromised: add ampicillin (for Listeria coverage). Neonates: ampicillin + gentamicin (or cefotaxime). Always add dexamethasone before/with first antibiotic dose.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q2",
    type: "question",
    question: "When must dexamethasone be given in meningitis?",
    options: ["After CSF culture results return", "BEFORE or WITH the first antibiotic dose", "24 hours after antibiotics started", "Only if patient doesn't improve"],
    correctIndex: 1,
    answer: "Dexamethasone reduces mortality and hearing loss in pneumococcal meningitis ONLY when given before or with first antibiotics. If antibiotics started >1 hour ago, benefit is lost. Dose: 0.15 mg/kg IV q6h x4 days.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q3",
    type: "term",
    question: "What are the classic CSF findings in bacterial meningitis?",
    answer: "Elevated opening pressure (>20 cm H2O), WBC >1000 with neutrophil predominance (>80%), protein elevated (>100 mg/dL), glucose low (<40 or CSF:serum ratio <0.4), Gram stain positive 60-90%.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q4",
    type: "question",
    question: "When is CT required before lumbar puncture?",
    options: ["Always", "Only with altered mental status, focal deficits, papilledema, seizures, or immunocompromised", "Never", "Only in children"],
    correctIndex: 1,
    answer: "CT before LP is needed only with herniation risk factors. In a young patient with classic meningismus and no red flags, LP proceeds without CT. But antibiotics must NEVER be delayed for imaging.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q5",
    type: "term",
    question: "What is the most common cause of bacterial meningitis in adults?",
    answer: "Streptococcus pneumoniae (gram-positive diplococci). Followed by N. meningitidis. In neonates: GBS, E. coli, Listeria. In elderly/immunocompromised: S. pneumoniae, Listeria, gram-negatives.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q6",
    type: "question",
    question: "Waterhouse-Friderichsen syndrome is:",
    options: ["Viral encephalitis", "Bilateral adrenal hemorrhage from meningococcal sepsis", "Chronic meningitis", "Fungal infection"],
    correctIndex: 1,
    answer: "Bilateral adrenal hemorrhagic necrosis from fulminant meningococcal DIC. Presents with purpura fulminans, hemodynamic collapse, and acute adrenal crisis. Treatment: emergent IV hydrocortisone, fluids, vasopressors.",
    category: "Infectious Disease NP",
    difficulty: 3
  },
  {
    id: "np-meningitis-q7",
    type: "term",
    question: "What chemoprophylaxis options exist for meningococcal close contacts?",
    answer: "Ciprofloxacin 500 mg PO x1 dose (adults), rifampin 600 mg PO q12h x2 days, or ceftriaxone 250 mg IM x1 dose (preferred in pregnancy). Give within 24 hours of case identification.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q8",
    type: "question",
    question: "The classic triad of bacterial meningitis is present in what percentage of cases?",
    options: [">90%", "~75%", "~44%", "~10%"],
    correctIndex: 2,
    answer: "Fever, neck stiffness, and altered mental status triad is present in only ~44%. But nearly all have ≥2 of 4 features: headache, fever, neck stiffness, altered mental status. Maintain high suspicion.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q9",
    type: "term",
    question: "Why is cefotaxime preferred over ceftriaxone in neonates?",
    answer: "Ceftriaxone displaces bilirubin from albumin, increasing free (unconjugated) bilirubin and kernicterus risk in neonates. Cefotaxime provides equivalent gram-negative coverage without this risk.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q10",
    type: "question",
    question: "Enteroviruses account for what percentage of viral meningitis?",
    options: ["25%", "50%", "~85%", "100%"],
    correctIndex: 2,
    answer: "Enteroviruses (coxsackievirus, echovirus) cause ~85% of viral (aseptic) meningitis. Typically self-limited with supportive care. CSF: lymphocytic pleocytosis, normal glucose. Most common in summer/fall.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  // ===== AAA FLASHCARDS =====
  {
    id: "np-aaa-q1",
    type: "term",
    question: "What is the USPSTF AAA screening recommendation?",
    answer: "One-time screening abdominal ultrasound for men aged 65-75 who have EVER smoked (Grade B). No routine screening for women or never-smokers. If normal, no repeat screening needed.",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q2",
    type: "question",
    question: "At what diameter is an AAA defined?",
    options: ["≥2.0 cm", "≥2.5 cm", "≥3.0 cm", "≥4.0 cm"],
    correctIndex: 2,
    answer: "AAA is defined as abdominal aortic diameter ≥3.0 cm or >50% increase over normal (1.5-2.5 cm). Management is based on size: <5.5 cm surveillance, ≥5.5 cm (men) or ≥5.0 cm (women) consider repair.",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q3",
    type: "term",
    question: "What is the strongest modifiable risk factor for AAA?",
    answer: "Smoking — 90% of AAA patients have smoking history. Smoking cessation is the ONLY intervention proven to slow AAA growth rate. Cessation reduces MMP activity and aortic wall inflammation.",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q4",
    type: "question",
    question: "What is the Law of Laplace's relevance to AAA rupture?",
    options: ["It determines blood viscosity", "Wall tension = (pressure × radius) / (2 × wall thickness) — explains exponentially increasing rupture risk with enlargement", "It predicts clot formation", "It measures cardiac output"],
    correctIndex: 1,
    answer: "As the aneurysm enlarges, wall tension increases proportionally to radius while wall thickness decreases, exponentially increasing rupture risk. Annual rupture risk: <4 cm = 0%, 5-5.9 cm = 3-15%, ≥7 cm = 20-40%.",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  {
    id: "np-aaa-q5",
    type: "term",
    question: "What are the AAA surveillance intervals by size?",
    answer: "3.0-3.9 cm: every 3 years. 4.0-4.9 cm: every 12 months. 5.0-5.4 cm: every 6 months. ≥5.5 cm: surgical evaluation. Rapid expansion (>1 cm/year) or symptoms: surgical evaluation regardless of size.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q6",
    type: "question",
    question: "The classic ruptured AAA triad is present in what percentage of cases?",
    options: ["<50%", "75%", "90%", "100%"],
    correctIndex: 0,
    answer: "The triad (sudden abdominal/back pain, hypotension, pulsatile mass) is present in <50% of cases. Maintain high suspicion in any elderly male smoker with sudden abdominal/back pain and hemodynamic instability.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q7",
    type: "term",
    question: "What is the mortality rate for ruptured AAA?",
    answer: "80-90% overall mortality, with 50% dying before reaching the hospital. Elective EVAR: 1-2% mortality, open repair: 4-5%. This is why screening and elective repair are life-saving.",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q8",
    type: "question",
    question: "After EVAR, what follow-up is required?",
    options: ["None", "CT angiography at 1, 6, 12 months then annually for endoleak surveillance", "Annual chest X-ray", "One ultrasound at 5 years"],
    correctIndex: 1,
    answer: "EVAR requires lifelong CT angiography surveillance for endoleaks (persistent blood flow into the aneurysm sac). Endoleaks can lead to continued sac pressurization and delayed rupture.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q9",
    type: "term",
    question: "What is blue toe syndrome in the context of AAA?",
    answer: "Atheroemboli from thrombus within the aneurysm sac causing acute painful cyanotic toes with intact pedal pulses. Indicates an unstable thrombus — indication for AAA repair regardless of size.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q10",
    type: "question",
    question: "Why is the infrarenal aorta most susceptible to aneurysm formation?",
    options: ["Thickest wall", "Lower elastin, no vasa vasorum, increased hemodynamic stress from reflected waves", "Most elastic tissue", "Best blood supply"],
    correctIndex: 1,
    answer: "The infrarenal aorta has lower elastin, relies on luminal diffusion (no vasa vasorum), and experiences increased wall stress from aortic bifurcation reflected waves. These factors make it vulnerable to MMP-mediated degeneration.",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  // ===== THALASSEMIA FLASHCARDS =====
  {
    id: "np-thal-q1",
    type: "term",
    question: "What is the Mentzer index and its clinical utility?",
    answer: "MCV ÷ RBC count. <13 suggests thalassemia trait (many small cells), >13 suggests iron deficiency (fewer cells). A screening tool only — confirm with iron studies and hemoglobin electrophoresis.",
    category: "Hematology NP",
    difficulty: 1
  },
  {
    id: "np-thal-q2",
    type: "question",
    question: "What hemoglobin electrophoresis finding is diagnostic of beta-thalassemia trait?",
    options: ["Elevated HbS", "Elevated HbA2 (>3.5%)", "Normal electrophoresis", "Elevated HbH"],
    correctIndex: 1,
    answer: "Beta-thalassemia trait shows elevated HbA2 (typically 4-8%). Alpha-thalassemia trait has NORMAL electrophoresis. HbH (β4 tetramers) indicates HbH disease (3 alpha-gene deletions).",
    category: "Hematology NP",
    difficulty: 1
  },
  {
    id: "np-thal-q3",
    type: "term",
    question: "Why should iron supplementation be avoided in thalassemia trait?",
    answer: "Thalassemia trait patients have normal/elevated iron stores. Misdiagnosing as iron deficiency and prescribing iron causes iatrogenic iron overload with potential organ damage. Always check iron studies before treating microcytic anemia.",
    category: "Hematology NP",
    difficulty: 1
  },
  {
    id: "np-thal-q4",
    type: "question",
    question: "What is the leading cause of death in transfusion-dependent thalassemia?",
    options: ["Infection", "Renal failure", "Cardiac iron overload", "Hepatocellular carcinoma"],
    correctIndex: 2,
    answer: "Cardiac iron overload causes dilated cardiomyopathy, arrhythmias, and heart failure. Cardiac MRI T2* <20 ms indicates loading; <10 ms indicates severe loading. Intensive chelation with deferiprone ± deferoxamine is critical.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q5",
    type: "term",
    question: "What is hydrops fetalis (Hb Bart's)?",
    answer: "Four alpha-globin gene deletions (--/--) produce Hb Bart's (γ4 tetramers) with extremely high oxygen affinity — cannot deliver O2 to tissues. Incompatible with life. Common risk in Southeast Asian populations with cis deletions.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q6",
    type: "question",
    question: "What is the first-line oral iron chelator for transfusional iron overload?",
    options: ["Deferoxamine", "Deferasirox (Jadenu)", "Deferiprone", "EDTA"],
    correctIndex: 1,
    answer: "Deferasirox (Jadenu) 14-28 mg/kg/day orally. Monitor: monthly creatinine/proteinuria and LFTs, quarterly ferritin, annual audiology/ophthalmology. Target ferritin <1000 ng/mL.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q7",
    type: "term",
    question: "What is the target pre-transfusion hemoglobin in transfusion-dependent thalassemia?",
    answer: "Maintain pre-transfusion Hb 9-10.5 g/dL. This suppresses ineffective erythropoiesis, reduces bone marrow expansion, prevents skeletal changes, and minimizes extramedullary hematopoiesis.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q8",
    type: "question",
    question: "What distinguishes the hair-on-end skull X-ray finding?",
    options: ["It is normal", "Marrow expansion pushing trabeculae perpendicular to skull — pathognomonic for severe thalassemia", "Lytic lesions from metastasis", "Fracture pattern"],
    correctIndex: 1,
    answer: "Hair-on-end appearance results from massive compensatory bone marrow expansion widening the diploe and pushing trabeculae perpendicular to the inner skull table. Also causes frontal bossing and chipmunk facies.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q9",
    type: "term",
    question: "Why is alpha-thalassemia trait difficult to diagnose?",
    answer: "Hemoglobin electrophoresis is NORMAL in alpha-thalassemia trait (1-2 gene deletions) because HbA2 is not elevated. Definitive diagnosis requires molecular genetic testing (PCR or MLPA for alpha-globin gene deletions).",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q10",
    type: "question",
    question: "What curative treatments exist for beta-thalassemia major?",
    options: ["Iron chelation only", "Allogeneic HSCT and gene therapy (Zynteglo)", "Chronic transfusion alone", "Splenectomy"],
    correctIndex: 1,
    answer: "Allogeneic HSCT (bone marrow transplant) from HLA-matched sibling donor: >90% cure rate in young children. Gene therapy (betibeglogene autotemcel/Zynteglo): inserts functional beta-globin gene into autologous stem cells via lentiviral vector.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q11",
    type: "term",
    question: "What role does erythroferrone play in thalassemia iron overload?",
    answer: "Erythroferrone is secreted by erythroid precursors during ineffective erythropoiesis. It suppresses hepatic hepcidin, the master iron-regulatory hormone, leading to unregulated intestinal iron absorption even without transfusions.",
    category: "Hematology NP",
    difficulty: 3
  },
  {
    id: "np-thal-q12",
    type: "question",
    question: "Elevated RDW helps distinguish iron deficiency from thalassemia trait because:",
    options: ["RDW is elevated in both", "RDW is elevated in iron deficiency (anisocytosis) but normal in thalassemia trait (uniform microcytes)", "RDW is only elevated in thalassemia", "RDW is not useful"],
    correctIndex: 1,
    answer: "Iron deficiency: variable cell sizes as iron-replete cells mix with iron-deficient microcytes = elevated RDW. Thalassemia trait: uniformly small cells = normal RDW. Helpful but not definitive.",
    category: "Hematology NP",
    difficulty: 2
  },
  // ===== RHEUMATOID ARTHRITIS FLASHCARDS =====
  {
    id: "np-ra-q1",
    type: "term",
    question: "What is the first-line DMARD for rheumatoid arthritis?",
    answer: "Methotrexate (MTX) 10-15 mg WEEKLY (not daily — daily dosing is fatal). Titrate to 20-25 mg. Always co-prescribe folic acid 1 mg daily. Initiate within 3 months of diagnosis per treat-to-target strategy.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-ra-q2",
    type: "question",
    question: "Anti-CCP antibodies (ACPA) have what specificity for RA?",
    options: ["50%", "70%", "80%", "95-99%"],
    correctIndex: 3,
    answer: "Anti-CCP: 95-99% specificity (vs RF at ~80%). Predicts erosive disease. Can be detected years before clinical onset. A positive anti-CCP in inflammatory arthritis essentially confirms RA diagnosis.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-ra-q3",
    type: "term",
    question: "What is pannus in RA?",
    answer: "Invasive, proliferative synovial tissue (normally 1-2 layers) composed of fibroblast-like synoviocytes, macrophages, T cells, B cells, and plasma cells. Pannus erodes cartilage and bone via MMP production and RANKL-mediated osteoclast activation.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q4",
    type: "question",
    question: "Before starting biologic DMARDs, which screenings are mandatory?",
    options: ["Only CBC", "TB screening (QuantiFERON Gold) and hepatitis B/C", "Only liver function tests", "No screening needed"],
    correctIndex: 1,
    answer: "TB screening: TNF inhibitors reactivate latent TB. Hepatitis B/C: rituximab reactivates HBV. Treat LTBI for ≥1 month before biologic initiation. Also baseline CBC, CMP, chest X-ray.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-ra-q5",
    type: "term",
    question: "What is the treat-to-target (T2T) strategy in RA?",
    answer: "Measure disease activity (DAS28, CDAI, SDAI) at every visit. If target (remission or low disease activity) not met, escalate therapy every 3-6 months. Do not accept persistent moderate/high disease activity.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q6",
    type: "question",
    question: "Why is methotrexate dosing WEEKLY so important?",
    options: ["Weekly provides better efficacy", "Daily MTX dosing is a known fatal medication error causing pancytopenia, mucositis, and death", "There is no difference", "Weekly reduces cost only"],
    correctIndex: 1,
    answer: "Daily MTX dosing causes fatal pancytopenia and severe mucositis. The NP must clearly communicate 'once weekly on the same day' and verify understanding. This is one of the most important medication safety points in RA management.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-ra-q7",
    type: "term",
    question: "What is atlantoaxial (C1-C2) subluxation in RA?",
    answer: "Pannus erosion of the transverse ligament at C1-C2 occurs in up to 25% of RA patients. Flexion-extension cervical spine X-rays required before intubation or surgery to assess spinal cord compression risk.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q8",
    type: "question",
    question: "MTX-induced pneumonitis presents with:",
    options: ["Joint swelling", "Dry cough, progressive dyspnea, bilateral ground-glass opacities — HOLD MTX immediately", "Skin rash only", "Weight gain"],
    correctIndex: 1,
    answer: "Hypersensitivity reaction (2-8%): acute dry cough, dyspnea, bilateral infiltrates. Stop MTX immediately, rule out PCP, start systemic corticosteroids. Never rechallenge with MTX.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q9",
    type: "term",
    question: "Which DMARD is safe to continue during pregnancy?",
    answer: "Hydroxychloroquine — safe in pregnancy and should be continued to prevent RA flares. MTX (Category X, stop 3 months before), leflunomide (teratogenic), and JAK inhibitors are all contraindicated.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q10",
    type: "question",
    question: "Swan-neck deformity in RA involves:",
    options: ["PIP flexion + DIP hyperextension", "PIP hyperextension + DIP flexion", "MCP subluxation only", "Wrist deviation only"],
    correctIndex: 1,
    answer: "Swan-neck: PIP hyperextension + DIP flexion. Boutonnière: PIP flexion + DIP hyperextension. Both are late findings of uncontrolled RA from tendon and capsular destruction by pannus.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q11",
    type: "term",
    question: "What is the strongest modifiable risk factor for RA?",
    answer: "Cigarette smoking increases anti-CCP production 2-fold through citrullination of lung proteins. In HLA-DRB1 shared epitope carriers, smoking synergistically drives the autoimmune cascade. Smoking also worsens RA activity and reduces treatment response.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q12",
    type: "question",
    question: "Felty syndrome is:",
    options: ["RA + hepatomegaly + thrombocytopenia", "RA + splenomegaly + neutropenia", "RA + nephritis", "RA + pericarditis"],
    correctIndex: 1,
    answer: "RA + splenomegaly + neutropenia. Occurs in long-standing seropositive RA. Increases infection risk. Rule out LGL leukemia. Treat with aggressive RA management.",
    category: "Assessment NP",
    difficulty: 2
  },
  // ===== ANTI-INFECTIVES & STEWARDSHIP FLASHCARDS =====
  {
    id: "np-abx-q1",
    type: "term",
    question: "What are the three core antibiotic stewardship principles?",
    answer: "(1) Obtain cultures BEFORE antibiotics, (2) De-escalate within 48-72 hours based on culture results, (3) Use shortest effective duration. These reduce resistance, CDI risk, and adverse drug events.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q2",
    type: "question",
    question: "IDSA 2021 recommends which first-line treatment for C. difficile infection?",
    options: ["Metronidazole PO", "Fidaxomicin 200 mg PO BID x10 days", "IV vancomycin", "Ciprofloxacin"],
    correctIndex: 1,
    answer: "Fidaxomicin preferred over oral vancomycin due to lower recurrence rates (13% vs 27%). Its narrow spectrum preserves colonic microbiota, accelerating recovery. Metronidazole no longer recommended for initial episodes.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q3",
    type: "term",
    question: "What is Red Man Syndrome from vancomycin?",
    answer: "Non-immune histamine-mediated reaction from rapid IV infusion causing flushing, erythema, pruritus of upper body. NOT anaphylaxis. Management: slow infusion rate, premedicate with diphenhydramine. Does NOT contraindicate future vancomycin use.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q4",
    type: "question",
    question: "ESBL-producing E. coli should be treated with:",
    options: ["Ceftriaxone", "Carbapenems (meropenem) — drug of choice regardless of in vitro cephalosporin susceptibility", "Ciprofloxacin", "Amoxicillin"],
    correctIndex: 1,
    answer: "Despite possible in vitro cephalosporin susceptibility, ESBL producers have high clinical failure rates with cephalosporins (inoculum effect). Carbapenems are the drugs of choice for serious ESBL infections.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q5",
    type: "term",
    question: "Why is daptomycin contraindicated for pneumonia?",
    answer: "Daptomycin is inactivated by pulmonary surfactant and must never be used for pneumonia. For MRSA pneumonia, use vancomycin IV or linezolid. Daptomycin is effective for MRSA bacteremia, endocarditis, and skin infections.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q6",
    type: "question",
    question: "Oral vancomycin is used for CDI because:",
    options: ["It has excellent systemic absorption", "It is NOT absorbed and acts locally in the GI tract at high concentrations", "It penetrates all tissues equally", "It is cheaper than IV"],
    correctIndex: 1,
    answer: "Oral vancomycin has negligible systemic absorption — it stays in the GI lumen at high concentrations, ideal for local CDI treatment. IV vancomycin does NOT reach the colonic lumen and is ineffective for CDI.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q7",
    type: "term",
    question: "What are the FDA boxed warnings for fluoroquinolones?",
    answer: "Tendinopathy/rupture (especially Achilles), peripheral neuropathy, CNS effects, aortic dissection/aneurysm, and hypoglycemia. Reserve for infections without safer alternatives. Avoid in elderly and those on corticosteroids.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q8",
    type: "question",
    question: "Vancomycin dosing for MRSA has shifted from trough-based to:",
    options: ["Fixed dosing for all patients", "AUC/MIC-guided dosing (target 400-600) per 2020 ASHP/IDSA guidelines", "Random level monitoring", "No monitoring needed"],
    correctIndex: 1,
    answer: "AUC/MIC target 400-600 achieves equivalent efficacy with less nephrotoxicity than traditional trough-based dosing (target 15-20). This is the new standard per 2020 ASHP/IDSA vancomycin guidelines.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q9",
    type: "term",
    question: "What is MRSA resistance mechanism?",
    answer: "mecA gene encodes PBP2a (altered penicillin-binding protein) with low affinity for all beta-lactams except ceftaroline. Confers resistance to all penicillins, cephalosporins, and carbapenems. Treat: vancomycin, daptomycin, linezolid.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q10",
    type: "question",
    question: "Procalcitonin-guided therapy: antibiotics can be safely stopped when PCT is:",
    options: [">2.0 ng/mL", ">0.5 ng/mL", "<0.25 ng/mL or >80% drop from peak", "<0.01 ng/mL"],
    correctIndex: 2,
    answer: "PCT <0.25 ng/mL or >80% decline from peak enables safe antibiotic discontinuation without increasing adverse outcomes. Particularly useful in respiratory infections and sepsis. Reduces unnecessary antibiotic exposure.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q11",
    type: "term",
    question: "What antibiotics are highest risk for C. difficile infection?",
    answer: "Fluoroquinolones (highest risk — associated with hypervirulent NAP1/BI/027 strain), clindamycin, and broad-spectrum cephalosporins. These cause greatest disruption of colonic flora, allowing C. difficile spore germination.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q12",
    type: "question",
    question: "A patient reports penicillin allergy as 'GI upset.' Can cephalosporins be used?",
    options: ["No, cross-reactivity is 50%", "Yes — GI upset is a side effect, not an immune-mediated allergy; true cross-reactivity is ~1-2%", "Only with epinephrine standby", "Never use any beta-lactam"],
    correctIndex: 1,
    answer: "GI upset is a side effect, NOT IgE-mediated allergy. True penicillin allergy is urticaria/anaphylaxis. Cross-reactivity with cephalosporins is ~1-2%. Penicillin skin testing de-labels ~90% of reported allergies.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  // ===== VACCINES & IMMUNOLOGY FLASHCARDS =====
  {
    id: "np-vaccine-q1",
    type: "term",
    question: "What vaccines are contraindicated in pregnancy?",
    answer: "All LIVE vaccines: MMR, varicella, LAIV, yellow fever, BCG. Safe and recommended: inactivated influenza, Tdap (each pregnancy at 27-36 weeks), hepatitis B, COVID-19. Wait 4 weeks after live vaccine before conception.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q2",
    type: "question",
    question: "Shingrix differs from old Zostavax in that:",
    options: ["Shingrix is live", "Shingrix is recombinant (non-live) with >90% efficacy and CAN be given to immunocompromised patients", "Shingrix has lower efficacy", "Shingrix is oral"],
    correctIndex: 1,
    answer: "Shingrix: recombinant, >90% efficacy, safe in immunocompromised (non-live). Zostavax was live, <50% effective, contraindicated in immunosuppressed. Shingrix recommended for ALL adults ≥50, 2 doses IM.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q3",
    type: "term",
    question: "When should Tdap be given during pregnancy?",
    answer: "27-36 weeks gestation during EACH pregnancy regardless of prior Tdap. Maximizes transplacental transfer of pertussis antibodies to protect the neonate during the vulnerable period before their DTaP series begins at 2 months.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q4",
    type: "question",
    question: "The simplified 2023 ACIP pneumococcal recommendation for vaccine-naive adults ≥65 is:",
    options: ["PPSV23 alone", "PCV13 then PPSV23", "PCV20 single dose", "No vaccine needed"],
    correctIndex: 2,
    answer: "PCV20 (Prevnar 20) single dose replaces the complex PCV13→PPSV23 sequence. Alternative: PCV15 followed by PPSV23 (≥1 year later). Conjugate technology enables immunological memory.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q5",
    type: "term",
    question: "What is the ACIP 2022 universal adult hepatitis B vaccine recommendation?",
    answer: "All unvaccinated adults 19-59: universal recommendation WITHOUT risk-factor screening. Ages ≥60: shared clinical decision. This eliminated the cumbersome risk-factor assessment before recommending HBV vaccine.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q6",
    type: "question",
    question: "Live vaccines are contraindicated when prednisone dose is:",
    options: ["Any dose", "≥10 mg daily for ≥7 days", "≥20 mg daily for ≥14 days", "Only >40 mg daily"],
    correctIndex: 2,
    answer: "Immunosuppressive corticosteroid threshold: ≥20 mg prednisone (or equivalent) daily for ≥14 days. Wait ≥1 month after discontinuation before administering live vaccines. Inactivated vaccines can be given but may have reduced immunogenicity.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q7",
    type: "term",
    question: "How does vaccine hesitancy best be addressed?",
    answer: "Presumptive language ('Your child is due for vaccines today' vs 'Would you like vaccines?') significantly increases acceptance. Motivational interviewing: acknowledge concerns, provide evidence-based information, build trust.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q8",
    type: "question",
    question: "What confirms hepatitis B vaccine immunity in healthcare workers?",
    options: ["HBsAg positive", "Anti-HBs ≥10 mIU/mL", "Anti-HBc positive", "HBeAg positive"],
    correctIndex: 1,
    answer: "Anti-HBs (hepatitis B surface antibody) ≥10 mIU/mL indicates protective immunity. Check 1-2 months after completing HBV series. Non-responders (<10): second complete series then retest.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q9",
    type: "term",
    question: "Why should TST be placed before or simultaneously with live vaccines?",
    answer: "Live vaccines (especially MMR) can suppress cell-mediated immunity, causing false-negative TST for 4-6 weeks. If live vaccine was given first, wait 4-6 weeks before TST. IGRA (blood test) is not affected.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q10",
    type: "question",
    question: "Conjugate vaccines differ from polysaccharide vaccines in that they:",
    options: ["Have fewer antigens", "Produce T-dependent immune response with immunological memory, mucosal immunity, and effectiveness in children <2 years", "Are less effective", "Cannot be given to adults"],
    correctIndex: 1,
    answer: "Conjugation links polysaccharide to carrier protein, converting T-independent to T-dependent response: memory B cells, higher-affinity antibodies, mucosal IgA, and effectiveness in children <2 years.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q11",
    type: "term",
    question: "What is the HPV vaccination recommendation for adults?",
    answer: "Routinely recommended through age 26 for all genders. Ages 27-45: shared clinical decision-making. 2 doses if started before age 15; 3 doses if started at age 15+. Gardasil 9 covers 9 HPV types.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q12",
    type: "question",
    question: "An HIV patient with CD4 350 can receive which live vaccine?",
    options: ["None — all live vaccines contraindicated in HIV", "MMR — live vaccines can be given when CD4 ≥200", "Yellow fever", "BCG"],
    correctIndex: 1,
    answer: "HIV patients with CD4 ≥200 can receive most live vaccines (MMR, varicella). CD4 <200 = severe immunodeficiency, live vaccines contraindicated. Always check CD4 count before administering live vaccines to HIV patients.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q13",
    type: "term",
    question: "What post-splenectomy vaccines are required?",
    answer: "PCV20 (or PCV15+PPSV23), MenACWY, MenB, and Hib. Ideally given ≥2 weeks before elective splenectomy. Plus lifelong penicillin VK 250 mg BID prophylaxis and patient education about seeking immediate care for fever.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q14",
    type: "question",
    question: "The first-line treatment for vaccine-associated anaphylaxis is:",
    options: ["Diphenhydramine PO", "IV methylprednisolone", "Epinephrine IM into anterolateral thigh", "Albuterol nebulizer"],
    correctIndex: 2,
    answer: "Epinephrine IM (anterolateral thigh) is the FIRST-LINE treatment for anaphylaxis. All vaccination sites must have epinephrine available. Antihistamines and steroids are adjunctive, not first-line.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q15",
    type: "term",
    question: "What is immunosenescence?",
    answer: "Age-related decline in immune function: thymic involution, reduced naive T-cell output, impaired B-cell maturation, chronic low-grade inflammation ('inflammaging'). Explains reduced vaccine effectiveness and increased infection risk in elderly.",
    category: "Preventive Care NP",
    difficulty: 3
  },
  {
    id: "np-vaccine-q16",
    type: "question",
    question: "What measles vaccination coverage level achieves herd immunity?",
    options: ["50%", "75%", "~95%", "100%"],
    correctIndex: 2,
    answer: "Measles requires ~95% coverage due to its extremely high R0 (12-18). When coverage drops below this threshold, outbreaks occur. This is one of the highest herd immunity thresholds of any vaccine-preventable disease.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q17",
    type: "term",
    question: "What USPSTF screening recommendations should be integrated at preventive care visits?",
    answer: "Cervical cancer (Pap/HPV), breast cancer (mammography age 40+), colorectal cancer (age 45-75), lung cancer (LDCT for 50-80 with ≥20 pack-year smoking history), depression (PHQ-9), diabetes (glucose/HbA1c if risk factors).",
    category: "Preventive Care NP",
    difficulty: 1
  },
  // ===== ADDITIONAL OBESITY FLASHCARDS =====
  {
    id: "np-obesity-q19",
    type: "question",
    question: "Naltrexone-bupropion ER (Contrave) targets which brain pathways?",
    options: ["Serotonin in hippocampus", "POMC neurons and mesolimbic reward system", "GABA in cerebellum", "Cholinergic in basal forebrain"],
    correctIndex: 1,
    answer: "Bupropion stimulates hypothalamic POMC neurons (appetite regulation). Naltrexone blocks opioid auto-inhibitory feedback on POMC, sustaining appetite suppression. Also modulates mesolimbic reward system, reducing food reward. 5-6% weight loss.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q20",
    type: "term",
    question: "What is dumping syndrome after Roux-en-Y gastric bypass?",
    answer: "Rapid passage of hyperosmolar food into small intestine. Early dumping (15-30 min): nausea, cramping, diarrhea, tachycardia. Late dumping (1-3 hours): reactive hypoglycemia. Prevent: small meals, avoid simple sugars.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q21",
    type: "question",
    question: "Phentermine is contraindicated in which conditions?",
    options: ["Mild hypertension only", "Uncontrolled hypertension, CVD, hyperthyroidism, glaucoma, MAOI use, and history of substance abuse", "Diabetes only", "No contraindications exist"],
    correctIndex: 1,
    answer: "Phentermine is a sympathomimetic amine. Contraindications: uncontrolled HTN, cardiovascular disease, hyperthyroidism, angle-closure glaucoma, concurrent or recent MAOIs (14-day washout), and substance abuse history. DEA Schedule IV controlled substance.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q22",
    type: "term",
    question: "What is the SELECT trial significance for semaglutide?",
    answer: "Landmark 2023 CV outcomes trial: semaglutide 2.4 mg reduced MACE by 20% in overweight/obese adults with CVD but WITHOUT diabetes. Established CV benefit for GLP-1 RAs in obesity independent of glycemic effects.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q23",
    type: "question",
    question: "What sleep disorder contributes to weight gain by altering appetite hormones?",
    options: ["Narcolepsy", "Sleep deprivation (<6 hrs) — increases ghrelin, decreases leptin", "REM behavior disorder", "Sleepwalking"],
    correctIndex: 1,
    answer: "Sleep deprivation increases ghrelin (hunger) and decreases leptin (satiety), promoting high-calorie food cravings. 7-9 hours of sleep is essential for weight management. Also evaluate for OSA.",
    category: "Endocrine NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q24",
    type: "term",
    question: "What labs should be obtained in initial obesity evaluation?",
    answer: "Fasting glucose/HbA1c, fasting lipid panel, TSH, CMP (liver function for NAFLD), morning cortisol if Cushing suspected. Women: consider testosterone/DHEA-S for PCOS. All patients: sleep study referral if OSA symptoms.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q25",
    type: "question",
    question: "Semaglutide slows gastric emptying. What surgical implication does this have?",
    options: ["No implications", "Must be held 1-3 weeks before surgery to reduce aspiration risk from retained gastric contents", "Enhances anesthesia", "Reduces bleeding risk"],
    correctIndex: 1,
    answer: "GLP-1 RAs significantly delay gastric emptying. ASA recommends holding GLP-1 RAs before elective procedures requiring anesthesia (daily formulations: 1 day; weekly: 1 week) to reduce aspiration risk.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q26",
    type: "term",
    question: "What is gallstone risk with GLP-1 receptor agonists?",
    answer: "GLP-1 RAs reduce gallbladder motility causing bile stasis. Combined with rapid weight loss increasing cholesterol secretion, cholelithiasis/cholecystitis risk increases 2-3x. Counsel patients about RUQ pain symptoms.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q27",
    type: "question",
    question: "A 5-10% weight loss achieves which health benefits?",
    options: ["No measurable benefit", "Significant improvement in HbA1c, blood pressure, triglycerides, HDL, and reduction in sleep apnea severity", "Complete diabetes remission in all patients", "Only cosmetic benefit"],
    correctIndex: 1,
    answer: "Even modest 5-10% weight loss produces clinically meaningful improvements: HbA1c reduction 0.6-1.0%, BP reduction 5 mmHg, TG reduction 40 mg/dL, improved OSA, reduced hepatic steatosis, and improved joint symptoms.",
    category: "Endocrine NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q28",
    type: "term",
    question: "What is motivational interviewing's role in obesity management?",
    answer: "Patient-centered counseling technique using open-ended questions, reflective listening, and affirmation to explore ambivalence about behavior change. More effective than directive counseling. Core elements: Express empathy, develop discrepancy, roll with resistance, support self-efficacy.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q29",
    type: "question",
    question: "What chronic disease model concept applies to obesity pharmacotherapy?",
    options: ["Short-term medication use only", "Obesity is a chronic disease requiring long-term treatment — weight regain occurs upon medication discontinuation, similar to HTN returning after stopping antihypertensives", "One medication course cures obesity", "Only lifestyle changes are needed"],
    correctIndex: 1,
    answer: "STEP 1 extension: ~2/3 weight regained within 1 year of semaglutide discontinuation. Obesity involves permanent neurohormonal changes. Long-term pharmacotherapy is the standard, not time-limited treatment.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q30",
    type: "term",
    question: "What is NAFLD/MASLD and its relationship to obesity?",
    answer: "Non-alcoholic/metabolic-associated steatotic liver disease affects 80-90% of obese individuals. Ranges from simple steatosis to NASH (steatohepatitis), fibrosis, cirrhosis, and HCC. Weight loss 7-10% improves histology.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q31",
    type: "question",
    question: "Tirzepatide's dual GIP/GLP-1 mechanism provides what advantage?",
    options: ["No advantage over GLP-1 alone", "GIP enhances beta-cell function and fat metabolism, producing greater weight loss (20-22%) than GLP-1 RA monotherapy", "GIP causes more GI side effects", "GIP blocks insulin secretion"],
    correctIndex: 1,
    answer: "GIP + GLP-1 dual agonism provides complementary actions: GIP enhances islet function, promotes adipose tissue lipid storage/metabolism, and potentially improves GI tolerability. SURMOUNT: 20-22% weight loss vs 15-17% for semaglutide.",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q32",
    type: "term",
    question: "What is the role of physical activity in obesity management?",
    answer: "Exercise alone: only 2-3% weight loss. But critical for MAINTENANCE, cardiovascular fitness, insulin sensitivity, and mood. ACSM: 150-300 min/week moderate-intensity aerobic activity. Benefits independent of weight loss.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q33",
    type: "question",
    question: "At what BMI can pharmacotherapy be initiated?",
    options: ["BMI ≥25 regardless of comorbidities", "BMI ≥30 or BMI ≥27 with at least one weight-related comorbidity", "BMI ≥40 only", "BMI ≥35 only"],
    correctIndex: 1,
    answer: "FDA: BMI ≥30 (obesity) or BMI ≥27 (overweight) with ≥1 weight-related comorbidity (T2DM, HTN, dyslipidemia, OSA). Lifestyle modification should be ongoing alongside pharmacotherapy.",
    category: "Endocrine NP",
    difficulty: 1
  },
  {
    id: "np-obesity-q34",
    type: "term",
    question: "What pancreatitis risk exists with GLP-1 RAs?",
    answer: "Rare but serious. Severe, persistent epigastric pain radiating to the back warrants immediate lipase/amylase and CT abdomen. If confirmed, permanently discontinue the GLP-1 RA. History of pancreatitis is a contraindication.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q35",
    type: "question",
    question: "What distinguishes sleeve gastrectomy from RYGB?",
    options: ["Sleeve involves intestinal rerouting", "Sleeve removes ~80% of stomach with no intestinal bypass; RYGB creates small pouch + intestinal bypass with more malabsorption", "They are identical procedures", "Sleeve has higher complication rates"],
    correctIndex: 1,
    answer: "Sleeve: removes ~80% stomach (including ghrelin-producing fundus), no intestinal bypass, fewer nutritional deficiencies, may worsen GERD. RYGB: small pouch + jejunal bypass, 30-35% weight loss, higher B12/iron deficiency risk, better diabetes remission.",
    category: "Endocrine NP",
    difficulty: 2
  },
  // ===== ADDITIONAL SMOKING CESSATION FLASHCARDS =====
  {
    id: "np-smoking-q13",
    type: "term",
    question: "What are the 5 R's for smokers not ready to quit?",
    answer: "Relevance (personalize why quitting matters), Risks (identify negative consequences), Rewards (identify benefits), Roadblocks (identify barriers and solutions), Repetition (repeat at every visit). Used for patients in precontemplation/contemplation stage.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q14",
    type: "question",
    question: "How long after quitting does coronary heart disease risk drop by 50%?",
    options: ["1 month", "1 year", "5 years", "15 years"],
    correctIndex: 1,
    answer: "At 1 year: 50% CHD risk reduction. Benefits begin within 20 min (HR normalizes), 12 hours (CO normalizes), 2-4 weeks (circulation improves). At 15 years: CV risk approaches never-smoker.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q15",
    type: "term",
    question: "Why are e-cigarettes NOT recommended by USPSTF for cessation?",
    answer: "Insufficient evidence for efficacy. Not FDA-approved cessation aids. May expose users to harmful chemicals (diacetyl, acrolein, heavy metals). FDA-approved pharmacotherapies (varenicline, NRT, bupropion) have proven efficacy and safety data.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q16",
    type: "question",
    question: "Nicotine gum dosing is based on:",
    options: ["Weight", "4 mg if ≥25 cigarettes/day, 2 mg if <25/day; park-and-chew technique through buccal mucosa", "One size fits all", "Age"],
    correctIndex: 1,
    answer: "4 mg for heavy smokers (≥25 cig/day), 2 mg for lighter smokers. Park-and-chew: chew until tingling, then park between cheek and gum. Avoid acidic beverages 15 min before (reduce absorption). Max 20 pieces/day.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q17",
    type: "term",
    question: "What follow-up schedule is recommended after a quit date?",
    answer: "Within 1 week of quit date (critical for early challenges), then monthly for first 3 months (highest relapse risk). Address trigger identification, coping skills, medication adjustment, and relapse prevention.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q18",
    type: "question",
    question: "CYP2A6 polymorphisms affect smoking cessation because:",
    options: ["No effect", "CYP2A6 metabolizes nicotine; slow metabolizers retain nicotine longer, smoke less, and have higher quit rates", "CYP2A6 metabolizes bupropion", "CYP2A6 affects lung cancer only"],
    correctIndex: 1,
    answer: "CYP2A6 is the primary nicotine → cotinine enzyme. Slow metabolizers: lower dependence, fewer cigarettes, better quit rates. Ultra-rapid metabolizers: faster clearance, more smoking, may need higher NRT doses. Emerging personalized cessation approach.",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-smoking-q19",
    type: "term",
    question: "What is third-hand smoke?",
    answer: "Residual nicotine and tobacco toxicants (TSNAs, PAHs) deposited on surfaces, clothing, and dust that persist for months after smoking. Absorbed through skin or ingested by crawling infants. Important counseling for households with children.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q20",
    type: "question",
    question: "A female smoker >35 on oral contraceptives has what increased risk?",
    options: ["Hypothyroidism", "VTE and MI — smoking + OCP synergistically increase cardiovascular risk 6-10x", "Weight loss", "Osteoporosis only"],
    correctIndex: 1,
    answer: "Smoking + OCP in women ≥35 increases MI risk 6-10x and VTE 2-4x. OCPs are contraindicated in women ≥35 who smoke ≥15 cigarettes/day. Cessation counseling and alternative contraception are essential.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q21",
    type: "term",
    question: "What is the nicotine patch dosing schedule?",
    answer: "21 mg/day x6 weeks → 14 mg/day x2 weeks → 7 mg/day x2 weeks (for ≥10 cig/day). Apply to clean, dry, hairless skin. Rotate sites. Remove before MRI. Common side effect: vivid dreams (remove at bedtime if bothersome).",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q22",
    type: "question",
    question: "Varenicline dosing titration schedule is:",
    options: ["1 mg BID from day 1", "0.5 mg daily x3 days → 0.5 mg BID x4 days → 1 mg BID maintenance", "2 mg daily", "1 mg daily throughout"],
    correctIndex: 1,
    answer: "Week 1: 0.5 mg daily x3 days → 0.5 mg BID x4 days. Week 2 onwards: 1 mg BID. Set quit date for day 8-14. Take with food and full glass of water to minimize nausea. Standard treatment: 12 weeks, can extend to 24 weeks.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q23",
    type: "term",
    question: "What USPSTF recommendation combines with smoking cessation counseling?",
    answer: "Annual low-dose CT chest for lung cancer screening in adults 50-80 with ≥20 pack-year smoking history who currently smoke or quit within 15 years. Integrating cessation counseling with screening visits improves quit rates.",
    category: "Assessment NP",
    difficulty: 2
  },
  // ===== ADDITIONAL PARKINSON FLASHCARDS =====
  {
    id: "np-parkinson-q13",
    type: "term",
    question: "What is the gut-brain axis theory in Parkinson disease?",
    answer: "Alpha-synuclein pathology may originate in the enteric nervous system and spread to the CNS via the vagus nerve (Braak stages 1-2). Supporting evidence: GI symptoms precede motor PD by years, truncal vagotomy reduces PD risk.",
    category: "Neurology NP",
    difficulty: 3
  },
  {
    id: "np-parkinson-q14",
    type: "question",
    question: "What medication is contraindicated for nausea in PD patients?",
    options: ["Ondansetron", "Metoclopramide — D2 blocker that worsens parkinsonism", "Trimethobenzamide", "Ginger"],
    correctIndex: 1,
    answer: "Metoclopramide blocks D2 receptors in the CNS, directly antagonizing dopaminergic therapy. Also avoid prochlorperazine and haloperidol. Use ondansetron or domperidone (doesn't cross BBB, not available in US) for nausea in PD.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q15",
    type: "term",
    question: "What is the role of MAO-B inhibitors in PD?",
    answer: "Rasagiline and selegiline selectively inhibit MAO-B, preventing dopamine breakdown in the brain. Used as monotherapy for mild PD or adjunct to levodopa. Drug interactions: meperidine, tramadol, SSRIs (serotonin syndrome risk).",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q16",
    type: "question",
    question: "Deep brain stimulation targets which structures?",
    options: ["Cerebellum", "STN or GPi", "Hippocampus", "Frontal cortex"],
    correctIndex: 1,
    answer: "Subthalamic nucleus (STN, most common, allows med reduction) or globus pallidus internus (GPi, preferred for dyskinesias). DBS does NOT slow progression — it modulates circuit dysfunction. Best for motor fluctuations/tremor refractory to medication.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q17",
    type: "term",
    question: "What non-motor symptoms characterize PD?",
    answer: "Constipation (earliest, from enteric alpha-synuclein), hyposmia (anosmia), REM sleep behavior disorder, depression/anxiety, orthostatic hypotension, urinary urgency, cognitive impairment (50-80% develop dementia), dysphagia, sialorrhea.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q18",
    type: "question",
    question: "Aspiration pneumonia is a leading cause of death in PD because of:",
    options: ["Immune suppression from medications", "Progressive dysphagia affecting 80%+ of patients causing silent aspiration", "Lung fibrosis from levodopa", "Pulmonary hypertension"],
    correctIndex: 1,
    answer: "Oropharyngeal dysphagia from brainstem involvement affects >80% of PD patients. Silent aspiration (without cough reflex) is common. SLP referral, modified barium swallow, diet modifications, and compensatory strategies (chin tuck) reduce aspiration risk.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q19",
    type: "term",
    question: "What is dopamine agonist withdrawal syndrome?",
    answer: "Severe anxiety, panic attacks, dysphoria, depression, irritability, and drug craving when dopamine agonists (pramipexole, ropinirole) are abruptly discontinued. Distinct from motor worsening. Management: gradual dose taper over weeks.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q20",
    type: "question",
    question: "MoCA vs MMSE in PD cognitive screening: which is preferred?",
    options: ["MMSE is superior", "MoCA — more sensitive for PD executive dysfunction and visuospatial deficits", "Both are equally effective", "Neither is useful"],
    correctIndex: 1,
    answer: "MoCA tests executive function, visuospatial abilities, and attention — domains preferentially affected in PD cognitive impairment. Score <26 suggests impairment. MMSE misses early PD-related cognitive changes.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q21",
    type: "term",
    question: "What exercise types benefit PD patients?",
    answer: "Tai chi (balance, fall prevention), aerobic exercise (30+ min, 3-5x/week — may be neuroprotective), dance-based exercise (tango, rhythmic movement), LSVT BIG (amplitude training), and boxing programs. PT referral is recommended for all PD patients.",
    category: "Neurology NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q22",
    type: "question",
    question: "Freezing of gait in PD is managed with:",
    options: ["Higher levodopa doses only", "Visual cues (laser lines), rhythmic auditory cues (metronome), and physical therapy", "Surgical intervention only", "No effective treatment exists"],
    correctIndex: 1,
    answer: "FOG: sudden inability to initiate/continue walking ('feet glued to floor'). Sensory cues bypass the defective basal ganglia: visual (laser pointer, floor lines), auditory (metronome, music), and tactile strategies. Also optimize dopaminergic medication.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q23",
    type: "term",
    question: "What is entacapone's role in PD management?",
    answer: "COMT inhibitor given 200 mg WITH each levodopa dose. Inhibits peripheral levodopa metabolism, extending half-life and reducing wearing-off. Side effects: diarrhea, brownish-orange urine (harmless), dyskinesias (may need levodopa dose reduction).",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q24",
    type: "question",
    question: "The 'levodopa honeymoon' period refers to:",
    options: ["When levodopa stops working", "First 5-10 years of stable motor benefit before fluctuations and dyskinesias develop", "Initial side effects", "A drug holiday period"],
    correctIndex: 1,
    answer: "The first 5-10 years of levodopa therapy provide stable, sustained benefit. As more dopaminergic neurons die, the ability to buffer and release dopamine diminishes. Motor complications (wearing-off, dyskinesias) develop in 40-50% by 5 years.",
    category: "Neurology NP",
    difficulty: 2
  },
  // ===== ADDITIONAL MENINGITIS FLASHCARDS =====
  {
    id: "np-meningitis-q11",
    type: "term",
    question: "What is SIADH in meningitis?",
    answer: "CNS inflammation triggers inappropriate ADH secretion from the posterior pituitary, causing euvolemic hyponatremia. Management: fluid restriction 1-1.2 L/day, monitor Na q4-6h. Correct slowly (≤8 mEq/24h) to avoid osmotic demyelination.",
    category: "Neurological NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q12",
    type: "question",
    question: "Sensorineural hearing loss after meningitis is from:",
    options: ["Medication ototoxicity only", "CN VIII inflammation — the most common neurological sequela of bacterial meningitis", "Middle ear effusion", "Noise exposure"],
    correctIndex: 1,
    answer: "CN VIII (vestibulocochlear) inflammation from meningitis, especially pneumococcal, causes permanent SNHL. Dexamethasone before antibiotics significantly reduces this risk. All meningitis survivors need audiometric evaluation.",
    category: "Neurological NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q13",
    type: "term",
    question: "What is cryptococcal meningitis treatment?",
    answer: "Induction: amphotericin B + flucytosine x2 weeks. Consolidation: fluconazole 400 mg/day x8 weeks. Maintenance: fluconazole 200 mg/day until CD4 >100 x3+ months on ART. Serial therapeutic LPs for elevated ICP.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q14",
    type: "question",
    question: "Antibiotic timing in suspected meningitis: each hour of delay increases mortality by:",
    options: ["1%", "3-7%", "10%", "No impact"],
    correctIndex: 1,
    answer: "Antibiotics within 60 minutes of presentation. Each hour of delay increases mortality 3-7%. If imaging needed before LP, draw blood cultures and START empiric antibiotics BEFORE sending for CT.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q15",
    type: "term",
    question: "What is Kernig sign?",
    answer: "With patient supine and hip flexed to 90°, extending the knee causes pain or resistance due to meningeal inflammation stretching nerve roots. Low sensitivity (5-30%) but high specificity (>90%).",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q16",
    type: "question",
    question: "CSF multiplex PCR panel (BioFire FilmArray) provides:",
    options: ["Only bacterial ID", "Rapid simultaneous detection of >14 bacterial, viral, and fungal pathogens within 1-2 hours", "Culture sensitivity results", "Only viral ID"],
    correctIndex: 1,
    answer: "Detects >14 common meningitis/encephalitis pathogens simultaneously within 1-2 hours. Does NOT replace culture (still needed for sensitivity testing) but dramatically improves diagnostic speed and allows faster targeted therapy.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q17",
    type: "term",
    question: "What organisms cause meningitis in immunocompromised patients?",
    answer: "Standard pathogens PLUS: Listeria monocytogenes, Cryptococcus neoformans, Mycobacterium tuberculosis, Aspergillus, Toxoplasma, CMV. Broader empiric coverage needed — add ampicillin for Listeria, consider antifungals.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q18",
    type: "question",
    question: "TB meningitis typically presents with:",
    options: ["Acute onset over hours", "Subacute onset over weeks with basilar pattern, CN palsies, and hydrocephalus", "Purpuric rash", "Normal CSF"],
    correctIndex: 1,
    answer: "TB meningitis is subacute/chronic (weeks): headache, low-grade fever, weight loss, CN palsies (especially CN VI), hydrocephalus. CSF: lymphocytic pleocytosis, very low glucose, high protein. Basilar meningeal enhancement on MRI.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q19",
    type: "term",
    question: "What is Mollaret meningitis?",
    answer: "Recurrent benign lymphocytic meningitis caused by HSV-2 reactivation. Self-limited episodes (2-5 days) with complete recovery. May show Mollaret cells in CSF. Prophylactic valacyclovir may reduce recurrence.",
    category: "Infectious Disease NP",
    difficulty: 3
  },
  {
    id: "np-meningitis-q20",
    type: "question",
    question: "What is the alternative to ampicillin for Listeria coverage in penicillin-allergic patients?",
    options: ["Ceftriaxone — covers Listeria", "TMP-SMX (trimethoprim-sulfamethoxazole)", "Azithromycin", "Metronidazole"],
    correctIndex: 1,
    answer: "Listeria is intrinsically RESISTANT to all cephalosporins. TMP-SMX is the penicillin allergy alternative. Meropenem is another option. This is a critical prescribing pearl — ceftriaxone will NOT cover Listeria.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  // ===== ADDITIONAL AAA FLASHCARDS =====
  {
    id: "np-aaa-q11",
    type: "term",
    question: "What medical management is recommended for all AAA patients?",
    answer: "Smoking cessation (only proven intervention to slow growth), high-intensity statin (AAA = CV risk equivalent), BP control (target <130/80), and regular exercise. Monitor for concurrent coronary and cerebrovascular disease.",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q12",
    type: "question",
    question: "What is permissive hypotension in ruptured AAA?",
    options: ["Maintaining SBP >160", "Allowing SBP 70-90 mmHg to prevent clot disruption while maintaining cerebral perfusion", "Aggressive fluid resuscitation to SBP >120", "No BP management needed"],
    correctIndex: 1,
    answer: "Permissive hypotension (SBP 70-90) prevents displacement of the retroperitoneal clot that may be tamponading the rupture, while maintaining cerebral perfusion. Aggressive fluid resuscitation increases bleeding and worsens outcomes.",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  {
    id: "np-aaa-q13",
    type: "term",
    question: "What distinguishes EVAR from open AAA repair?",
    answer: "EVAR: endovascular stent-graft via femoral artery, 1-2% perioperative mortality, faster recovery, but requires lifelong CT surveillance for endoleaks. Open: laparotomy, 4-5% mortality, more durable (15+ years), no lifelong surveillance needed.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q14",
    type: "question",
    question: "What screening is recommended for first-degree relatives of AAA patients?",
    options: ["No screening recommended", "Siblings should be screened — they have ~18% AAA prevalence", "Only children should be screened", "Only female relatives"],
    correctIndex: 1,
    answer: "Siblings of AAA patients have ~18% prevalence (vs 5-10% general male population >65). First-degree relatives, especially brothers and sons, should be screened with abdominal ultrasound at age 65 or earlier if symptomatic.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q15",
    type: "term",
    question: "What is an endoleak after EVAR?",
    answer: "Persistent blood flow into the aneurysm sac after stent-graft placement. Type I: attachment site (high pressure, needs repair). Type II: collateral backflow (most common, usually benign). Type III: graft defect (needs repair).",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q16",
    type: "question",
    question: "Abdominal ultrasound is the preferred screening modality for AAA because:",
    options: ["It is therapeutic", "Non-invasive, no radiation, low cost, highly accurate (sensitivity >95%, specificity ~100%)", "It can treat AAA simultaneously", "CT is contraindicated"],
    correctIndex: 1,
    answer: "Ultrasound: >95% sensitivity, ~100% specificity for AAA detection, no radiation, no contrast, low cost, widely available. CT angiography is used for surgical planning and EVAR suitability assessment, not routine screening.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q17",
    type: "term",
    question: "What associated vascular screening should AAA patients receive?",
    answer: "AAA reflects systemic atherosclerosis. Screen for: coronary artery disease (cardiac risk assessment), peripheral arterial disease (ABI), cerebrovascular disease (carotid assessment if indicated), and other aneurysms (iliac, popliteal).",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q18",
    type: "question",
    question: "What is the annual rupture risk for a 6.5 cm AAA?",
    options: ["<1%", "3-5%", "10-20%", "25-40%"],
    correctIndex: 2,
    answer: "Annual rupture risk by size: <4 cm ≈ 0%, 4-4.9 cm ≈ 0.5-5%, 5-5.9 cm ≈ 3-15%, 6-6.9 cm ≈ 10-20%, ≥7 cm ≈ 20-40%. This exponential increase supports elective repair at ≥5.5 cm.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  // ===== ADDITIONAL THALASSEMIA FLASHCARDS =====
  {
    id: "np-thal-q13",
    type: "term",
    question: "What peripheral blood smear findings characterize thalassemia?",
    answer: "Target cells (excess cell membrane), microcytes, basophilic stippling (ribosomal RNA aggregates), nucleated RBCs (severe forms). In HbH disease: HbH inclusions visible with supravital staining.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q14",
    type: "question",
    question: "Which chelator has superior cardiac iron chelation?",
    options: ["Deferasirox", "Deferiprone — but monitor weekly CBC for agranulocytosis", "Deferoxamine", "EDTA"],
    correctIndex: 1,
    answer: "Deferiprone has superior cardiac iron penetration. For cardiac T2* <20 ms, use deferiprone alone or combined with deferoxamine. Major toxicity: agranulocytosis (0.5-2%) — weekly CBC mandatory.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q15",
    type: "term",
    question: "What is the difference between cis and trans alpha-thalassemia deletions?",
    answer: "Cis (--/αα): both deletions on same chromosome 16, common in Southeast Asians. If both parents carry cis: 25% risk of hydrops fetalis. Trans (-α/-α): one deletion per chromosome, common in Africans. Minimal hydrops risk in offspring.",
    category: "Hematology NP",
    difficulty: 3
  },
  {
    id: "np-thal-q16",
    type: "question",
    question: "What is luspatercept (Reblozyl)?",
    options: ["Iron chelator", "Erythroid maturation agent that traps TGF-beta ligands to promote effective erythropoiesis, reducing transfusion burden", "Vitamin supplement", "Immune suppressant"],
    correctIndex: 1,
    answer: "Luspatercept is an activin receptor ligand trap. It binds TGF-beta superfamily ligands (GDF11, activin A) that block late-stage erythroid differentiation. BELIEVE trial: 21% achieved ≥33% transfusion reduction. SC injection every 3 weeks.",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-thal-q17",
    type: "term",
    question: "What endocrinopathies result from iron overload in thalassemia?",
    answer: "Hypogonadotropic hypogonadism (most common, 60-80%): delayed puberty, amenorrhea, infertility. Also: diabetes (pancreatic beta cells), hypothyroidism, hypoparathyroidism. From iron deposition in pituitary and endocrine organs.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q18",
    type: "question",
    question: "What vaccinations are mandatory before splenectomy in thalassemia?",
    options: ["Only influenza", "PCV20, MenACWY, MenB, and Hib — at least 2 weeks before elective surgery", "No vaccines needed", "Only hepatitis B"],
    correctIndex: 1,
    answer: "Pre-splenectomy vaccines target encapsulated organisms: PCV20 (or PCV15+PPSV23), MenACWY, MenB, Hib. Give ≥2 weeks before elective splenectomy. Also: lifelong penicillin VK prophylaxis and fever education.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-thal-q19",
    type: "term",
    question: "What is alloimmunization prevention in chronic transfusion?",
    answer: "Extended red cell antigen matching (Rh C/c/E/e, Kell, Duffy, Kidd) and leukoreduction reduce alloimmunization from 30% to <5-10%. Alloantibodies make finding compatible blood increasingly difficult.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q20",
    type: "question",
    question: "Hydroxyurea in thalassemia intermedia works by:",
    options: ["Correcting the gene defect", "Increasing fetal hemoglobin (HbF) production, partially compensating for beta-globin deficiency", "Chelating iron", "Suppressing immune system"],
    correctIndex: 1,
    answer: "Hydroxyurea stimulates HbF production (mechanism unclear, possibly stress erythropoiesis). In thalassemia intermedia, HbF (α2γ2) partially compensates for absent beta chains. Not as effective as in sickle cell disease.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q21",
    type: "term",
    question: "What is HbH disease?",
    answer: "Three alpha-globin gene deletions (--/-α). Excess beta chains form β4 tetramers (HbH) with increased O2 affinity and instability, causing moderate hemolytic anemia, splenomegaly, jaundice. Most don't need regular transfusions.",
    category: "Hematology NP",
    difficulty: 2
  },
  // ===== ADDITIONAL RA FLASHCARDS =====
  {
    id: "np-ra-q13",
    type: "term",
    question: "What is the mechanism of adalimumab (Humira)?",
    answer: "Fully human monoclonal antibody binding both soluble and transmembrane TNF-alpha, preventing TNF receptor interaction. Reduces inflammatory cell infiltration, MMP production, and osteoclast activation in the RA synovium.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q14",
    type: "question",
    question: "Triple DMARD therapy for RA consists of:",
    options: ["Three biologics", "MTX + hydroxychloroquine + sulfasalazine", "MTX + adalimumab + rituximab", "Prednisone + NSAIDs + acetaminophen"],
    correctIndex: 1,
    answer: "Triple conventional DMARD therapy is a cost-effective alternative to biologics with comparable efficacy in some studies. Used before escalating to biologic/targeted synthetic DMARDs.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q15",
    type: "term",
    question: "What is seronegative vs seropositive RA?",
    answer: "Seropositive (RF+ and/or anti-CCP+): more aggressive erosions, more extra-articular disease (nodules, vasculitis, ILD), worse prognosis. Seronegative (~20-30%): negative serology, meets clinical criteria, may have milder course.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q16",
    type: "question",
    question: "Which joint is characteristically SPARED in RA?",
    options: ["MCP joints", "PIP joints", "DIP joints", "Wrist"],
    correctIndex: 2,
    answer: "RA spares DIPs. DIP involvement suggests OA (Heberden nodes) or psoriatic arthritis. RA preferentially affects MCPs, PIPs, wrists, and MTPs symmetrically.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-ra-q17",
    type: "term",
    question: "What is the squeeze test in RA assessment?",
    answer: "Lateral compression of MCP or MTP joints to elicit pain, indicating synovitis even before visible swelling. Positive MTP squeeze is an early sign of RA foot involvement. Simple, rapid bedside screening tool.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-ra-q18",
    type: "question",
    question: "Morning stiffness in RA is characteristically:",
    options: ["<15 minutes", ">30 minutes (often >60), improving with activity and worsening with rest", "Constant throughout the day", "Only at night"],
    correctIndex: 1,
    answer: "Inflammatory stiffness: >30 min (often >60 min), improves with activity, worsens with rest. OA stiffness: <30 min, worsens with activity, improves with rest. This distinction is a key history-taking point.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-ra-q19",
    type: "term",
    question: "What is the JAK inhibitor boxed warning?",
    answer: "JAK inhibitors (tofacitinib, baricitinib, upadacitinib) carry FDA boxed warning for increased risk of serious cardiac events, malignancy, thrombosis, and death compared to TNF inhibitors (ORAL Surveillance trial data).",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q20",
    type: "question",
    question: "HLA-DRB1 shared epitope in RA accounts for what percentage of genetic risk?",
    options: ["5%", "15%", "~40%", "90%"],
    correctIndex: 2,
    answer: "HLA-DRB1 shared epitope alleles represent the strongest genetic risk factor, ~40% of genetic susceptibility. They present citrullinated peptides to T cells. Combined with smoking, they synergistically drive anti-CCP production.",
    category: "Assessment NP",
    difficulty: 3
  },
  {
    id: "np-ra-q21",
    type: "term",
    question: "What is subcutaneous MTX's advantage over oral at doses >15 mg/week?",
    answer: "Oral MTX bioavailability saturates above 15 mg/week due to saturable intestinal absorption. SC route provides 28% higher drug exposure and linear absorption. Switch oral to SC before escalating to biologics — cost-effective strategy.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q22",
    type: "question",
    question: "Rheumatoid nodules are found in what percentage of seropositive RA patients?",
    options: ["5%", "20-30%", "50%", "80%"],
    correctIndex: 1,
    answer: "Rheumatoid nodules: firm, non-tender subcutaneous nodules at pressure points (olecranon, forearms). Found in 20-30% of seropositive patients, indicating more aggressive disease. MTX can paradoxically increase nodule formation.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q23",
    type: "term",
    question: "What is rituximab's mechanism and key safety concern?",
    answer: "Anti-CD20 monoclonal antibody depleting CD20+ B cells via complement-dependent and antibody-dependent cytotoxicity. MANDATORY hepatitis B screening — rituximab causes fatal HBV reactivation. Also screen for TB.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  // ===== ADDITIONAL ANTI-INFECTIVES FLASHCARDS =====
  {
    id: "np-abx-q13",
    type: "term",
    question: "What is antibiotic 'time out' or reassessment?",
    answer: "Structured review at 48-72 hours when culture/sensitivity data are available. Options: de-escalate to narrow-spectrum, IV-to-PO switch, dose optimization, or discontinue if infection ruled out. Core stewardship intervention.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q14",
    type: "question",
    question: "What are IV-to-PO switch criteria?",
    options: ["WBC must be completely normal", "Clinically improving, afebrile 24-48h, tolerating oral intake, functional GI tract, oral option with adequate bioavailability", "Only after 7 days of IV therapy", "Never appropriate"],
    correctIndex: 1,
    answer: "Switch criteria: clinical improvement, afebrile 24-48h, oral intake tolerated, functional GI tract, and oral antibiotic with good bioavailability. Reduces hospital stay, costs, and IV-related complications (catheter infections).",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q15",
    type: "term",
    question: "What is an antibiogram?",
    answer: "Annual institutional summary of antimicrobial susceptibility patterns for bacterial isolates. Guides empiric antibiotic selection based on local resistance. If local E. coli ciprofloxacin resistance >20%, use alternative empiric agent.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q16",
    type: "question",
    question: "Nitrofurantoin is first-line for uncomplicated cystitis because:",
    options: ["Broadest spectrum available", "Narrow spectrum with low resistance, high urinary concentration, minimal gut flora disruption, and low CDI risk", "It treats all UTI types", "It is the cheapest option"],
    correctIndex: 1,
    answer: "Nitrofurantoin 100 mg BID x5 days: narrow spectrum targets urinary pathogens, minimal collateral gut flora damage, low resistance rates, low CDI risk. NOT effective for pyelonephritis (poor renal parenchymal penetration).",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q17",
    type: "term",
    question: "What is asymptomatic bacteriuria (ASB) guideline?",
    answer: "Screen and treat ONLY in pregnancy (pyelonephritis/preterm risk) and before urologic procedures. Do NOT treat ASB in elderly, catheterized, or diabetic patients — treatment does not improve outcomes and promotes resistance.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q18",
    type: "question",
    question: "CRE (carbapenem-resistant Enterobacterales) is treated with:",
    options: ["Standard carbapenems", "Ceftazidime-avibactam or meropenem-vaborbactam for KPC-producing CRE", "First-generation cephalosporins", "Azithromycin"],
    correctIndex: 1,
    answer: "Novel beta-lactam/BLI combinations: ceftazidime-avibactam (covers KPC-producing CRE), meropenem-vaborbactam. Cefiderocol for metallo-beta-lactamase producers (NDM). These are critical stewardship agents reserved for confirmed CRE.",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-abx-q19",
    type: "term",
    question: "What is the mechanism of VRE resistance?",
    answer: "vanA/vanB genes modify peptidoglycan target from D-Ala-D-Ala to D-Ala-D-Lac, reducing vancomycin binding 1000-fold. VanA: resistant to both vancomycin and teicoplanin. VanB: resistant to vancomycin only. Treat: linezolid or daptomycin.",
    category: "Infectious Disease NP",
    difficulty: 3
  },
  {
    id: "np-abx-q20",
    type: "question",
    question: "Linezolid's most important monitoring requirement is:",
    options: ["Monthly renal function", "Weekly CBC for thrombocytopenia", "Daily blood glucose", "Annual eye exam"],
    correctIndex: 1,
    answer: "Linezolid causes dose-dependent thrombocytopenia (risk increases after >14 days). Weekly CBC mandatory. Also: avoid serotonergic drugs (serotonin syndrome risk), peripheral neuropathy with prolonged use, lactic acidosis.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q21",
    type: "term",
    question: "What is fecal microbiota transplant (FMT)?",
    answer: "Restoration of normal colonic microbiota for recurrent CDI (≥3 episodes failing standard therapy). >85% cure rate. FDA-approved microbiome-based products are now available. Restores Bacteroides diversity, outcompeting C. difficile.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q22",
    type: "question",
    question: "Delayed prescription (watchful waiting) is appropriate for:",
    options: ["Septic shock", "Mild acute otitis media in child >2 years — fill only if not improved in 48-72h", "MRSA bacteremia", "Meningitis"],
    correctIndex: 1,
    answer: "Provide prescription with instructions to fill only if symptoms worsen in 48-72 hours. Appropriate for: mild AOM in children >2, sinusitis <10 days, viral URI. Reduces unnecessary antibiotic use by ~50%.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q23",
    type: "term",
    question: "What is metronidazole's disulfiram-like reaction?",
    answer: "Metronidazole inhibits acetaldehyde dehydrogenase. With alcohol: severe nausea, vomiting, flushing, headache, abdominal cramps. Avoid ALL alcohol (including mouthwash, cooking wine) during treatment and 72 hours after.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  // ===== ADDITIONAL VACCINE FLASHCARDS =====
  {
    id: "np-vaccine-q18",
    type: "term",
    question: "What is the MenACWY booster schedule for adolescents?",
    answer: "First dose at 11-12 years, booster at 16 years (critical for college dormitory risk). If first dose given at ≥16, no booster needed. High-risk patients (asplenia, complement deficiency) need additional doses.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q19",
    type: "question",
    question: "Which populations should receive BOTH MenACWY and MenB?",
    options: ["All healthy adults", "Asplenic patients, complement deficiency, and microbiologists working with N. meningitidis", "Only college freshmen", "Only children under 2"],
    correctIndex: 1,
    answer: "MenACWY covers serogroups A, C, W, Y. MenB covers serogroup B. Both needed for: asplenia, complement deficiency, eculizumab use, and microbiologists exposed to N. meningitidis. College freshmen: MenACWY only (routine); MenB by shared decision.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q20",
    type: "term",
    question: "What is the mRNA vaccine mechanism?",
    answer: "mRNA in lipid nanoparticle delivers instructions for cells to produce target antigen (e.g., spike protein). Immune system generates antibodies + T-cell responses. mRNA rapidly degraded by cellular enzymes. Does NOT enter nucleus or alter DNA.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q21",
    type: "question",
    question: "Rotavirus vaccine's age restriction exists because:",
    options: ["No age restriction", "First dose must be before 15 weeks and series completed by 8 months due to increased intussusception risk in older infants", "Only given to adults", "Can start at any age"],
    correctIndex: 1,
    answer: "Strict age window: first dose at 6 weeks to 14 weeks 6 days (do NOT start after 15 weeks). Complete series by 8 months 0 days. Risk of intussusception (~1 per 20,000-100,000) is highest in older infants.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q22",
    type: "term",
    question: "What is serotype replacement in pneumococcal disease?",
    answer: "After vaccination reduces targeted serotypes, non-vaccine serotypes emerge to fill the ecological niche. Addressed by expanding conjugate vaccine valency: PCV7→PCV13→PCV15→PCV20 to cover emerging serotypes.",
    category: "Preventive Care NP",
    difficulty: 3
  },
  {
    id: "np-vaccine-q23",
    type: "question",
    question: "A 65-year-old who previously received PCV13 needs what pneumococcal vaccination now?",
    options: ["Nothing more", "PPSV23 at least 1 year after PCV13 (or consider PCV20 for additional coverage)", "Repeat PCV13", "PCV15"],
    correctIndex: 1,
    answer: "Complete the series: PPSV23 at least 1 year after PCV13. Alternatively, PCV20 can be given to provide additional serotype coverage. Current simplified guidance: PCV20 single dose for vaccine-naive patients.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q24",
    type: "term",
    question: "What is the DTaP to Tdap switch rationale?",
    answer: "DTaP (uppercase = full-dose diphtheria/pertussis) for children <7 for primary series. Tdap (lowercase = reduced dose) for ≥7 years for boosters — reduced antigen doses decrease reactogenicity while maintaining adequate boosting.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q25",
    type: "question",
    question: "If a live vaccine is inadvertently given during pregnancy, the recommendation is:",
    options: ["Terminate pregnancy", "Counsel on theoretical risk but do NOT recommend termination — no documented fetal harm from vaccination in registries", "No counseling needed", "Give immune globulin immediately"],
    correctIndex: 1,
    answer: "Counsel on theoretical risk but do NOT recommend termination. Vaccine registries (CDC, manufacturers) show no documented cases of congenital rubella syndrome or varicella embryopathy from vaccination. Report to the vaccine pregnancy registry.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q26",
    type: "term",
    question: "What are catch-up vaccination priorities for an unvaccinated immigrant adult?",
    answer: "MMR (2 doses), varicella (2 doses or check titers), Tdap (then Td q10y), hepatitis B (3 doses), HPV (3 doses if ≤26), IPV (if unvaccinated). Check MMR/varicella titers before administering to avoid unnecessary doses.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q27",
    type: "question",
    question: "Cell-culture (Flucelvax) and recombinant (Flublok) influenza vaccines are preferred for patients with:",
    options: ["Mild egg allergy only", "Severe egg allergy — no egg protein in production", "Latex allergy", "All patients"],
    correctIndex: 1,
    answer: "Cell-culture and recombinant vaccines contain no egg protein. ACIP 2023: all IIV can be given to egg-allergic patients of any severity in any setting. Egg allergy is no longer a barrier to influenza vaccination.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q28",
    type: "term",
    question: "What is the yellow fever vaccine International Certificate requirement?",
    answer: "Yellow fever vaccine (live attenuated) requires International Certificate of Vaccination or Prophylaxis (ICVP) for travel to endemic areas (sub-Saharan Africa, South America). Certificate valid for life. Contraindicated in immunocompromised and severe egg allergy.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  // ===== FINAL ROUND: ADDITIONAL FLASHCARDS =====
  {
    id: "np-obesity-q36",
    type: "question",
    question: "What is adaptive thermogenesis?",
    options: ["Increased metabolism after weight loss", "Disproportionate decrease in resting metabolic rate (15-20% beyond predicted) that persists for years after weight loss", "Normal metabolic response to exercise", "Increased thermogenesis from brown fat"],
    correctIndex: 1,
    answer: "Adaptive thermogenesis is a disproportionate metabolic rate reduction exceeding what's predicted by body composition changes alone. Combined with hormonal shifts, it creates a 'metabolic gap' driving weight regain — the biological basis for obesity as a chronic disease.",
    category: "Endocrine NP",
    difficulty: 3
  },
  {
    id: "np-obesity-q37",
    type: "term",
    question: "What is ghrelin's role in obesity?",
    answer: "Ghrelin ('hunger hormone') is produced by gastric fundus cells. Stimulates appetite via hypothalamic NPY/AgRP neurons. Rises before meals and after weight loss. Sleeve gastrectomy removes ghrelin-producing tissue, contributing to appetite suppression.",
    category: "Endocrine NP",
    difficulty: 2
  },
  {
    id: "np-obesity-q38",
    type: "question",
    question: "What is the GLP-1 RA nausea management strategy?",
    options: ["Take on empty stomach", "Slow dose titration over 16-20 weeks, take with food and water, smaller meals", "Give anti-emetics with every dose", "Skip doses"],
    correctIndex: 1,
    answer: "Nausea (~30% incidence) is usually transient. The 16-20 week slow titration minimizes GI effects. Eating smaller meals, avoiding high-fat foods, staying hydrated, and taking with food helps. Nausea typically resolves within 2-3 weeks at each dose level.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q24",
    type: "term",
    question: "What is the average post-cessation weight gain?",
    answer: "Average 4-5 kg in the first year after quitting. Causes: reduced metabolic rate, increased appetite, oral substitution behaviors. Bupropion attenuates weight gain. Exercise and dietary counseling help. Weight gain is far less harmful than continued smoking.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q25",
    type: "question",
    question: "Which stage of change describes a patient who says 'I plan to quit next month'?",
    options: ["Precontemplation", "Contemplation", "Preparation", "Action"],
    correctIndex: 2,
    answer: "Preparation: planning to quit within 30 days. Precontemplation: no intent to quit. Contemplation: thinking about quitting in next 6 months. Action: actively quitting. Maintenance: sustained abstinence >6 months.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q26",
    type: "term",
    question: "How does brief advice impact quit rates?",
    answer: "Even 3 minutes of clinician advice to quit ('As your healthcare provider, the single most important thing you can do for your health is quit smoking') increases quit attempts by 30%. Every clinical encounter is an opportunity.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q27",
    type: "question",
    question: "Nicotine nasal spray differs from other NRT forms in that:",
    options: ["Slowest onset", "Fastest onset of action (peak in 10 minutes) — most closely mimics cigarette nicotine delivery", "Longest duration of action", "Least effective"],
    correctIndex: 1,
    answer: "Nicotine nasal spray reaches peak levels in ~10 minutes, making it the fastest-acting NRT. This rapid onset most closely simulates cigarette nicotine delivery, making it useful for acute cravings. May cause nasal irritation.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q28",
    type: "term",
    question: "What is the quitline (1-800-QUIT-NOW)?",
    answer: "Free, evidence-based cessation counseling available in all 50 states. Combines with pharmacotherapy for optimal results. Provides proactive callback counseling, printed materials, and referral to local resources. NPs should provide this number at every visit.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q25",
    type: "question",
    question: "What is the significance of anosmia/hyposmia in PD?",
    options: ["Medication side effect", "Premotor symptom from olfactory bulb alpha-synuclein deposition (Braak stage 1) — precedes motor symptoms by years", "Nasal congestion", "Age-related change only"],
    correctIndex: 1,
    answer: "Anosmia/hyposmia affects 90%+ of PD patients and often precedes motor symptoms by 5-10 years. It results from alpha-synuclein pathology in the olfactory bulb (Braak stage 1). UPSIT (University of Pennsylvania Smell Identification Test) can detect early loss.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q26",
    type: "term",
    question: "What is the role of amantadine in PD?",
    answer: "NMDA receptor antagonist. Mild anti-parkinsonian effect for early PD. Extended-release (Gocovri) is FDA-approved for levodopa-induced dyskinesias. Also has mild anticholinergic and dopamine-releasing properties. Side effects: livedo reticularis, edema, confusion.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q27",
    type: "question",
    question: "Orthostatic hypotension management in PD includes:",
    options: ["Only pharmacologic intervention", "Non-pharmacologic first (2-3 L fluid, 2-4 g salt, compression stockings, slow position changes), then fludrocortisone or midodrine if needed", "Alpha-blockers", "Dopamine agonist dose increase"],
    correctIndex: 1,
    answer: "First: non-pharmacologic (fluid 2-3 L/day, salt 2-4 g/day, compression stockings, elevate HOB 30°, slow position changes, avoid alcohol/heat). Pharmacologic: fludrocortisone 0.1 mg/day or midodrine 5-10 mg TID. Droxidopa (Northera) for neurogenic OH.",
    category: "Neurological NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q28",
    type: "term",
    question: "What is the levodopa challenge test?",
    answer: "Administering a test dose of levodopa to confirm dopaminergic responsiveness before DBS surgery. Good response predicts good DBS outcome. Poor levodopa response suggests atypical parkinsonism (MSA, PSP, CBD) where DBS is ineffective.",
    category: "Neurology NP",
    difficulty: 3
  },
  {
    id: "np-meningitis-q21",
    type: "question",
    question: "A negative Gram stain in suspected meningitis means:",
    options: ["Bacterial meningitis is ruled out", "Does NOT rule out bacterial meningitis — sensitivity is 60-90%; continue empiric antibiotics until cultures finalize at 48-72h", "Switch to antifungals", "Repeat LP immediately"],
    correctIndex: 1,
    answer: "Gram stain sensitivity 60-90%, varies by organism. Prior antibiotics reduce sensitivity further. Empiric antibiotics must continue until CSF cultures are finalized (48-72 hours). Multiplex PCR panel can provide faster identification.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q22",
    type: "term",
    question: "What is Brudzinski sign?",
    answer: "Passive neck flexion causes involuntary hip and knee flexion (patient draws knees up). Indicates meningeal irritation. Combined with Kernig sign: low sensitivity (5-30%) but high specificity (>90%) for meningitis.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q23",
    type: "question",
    question: "Petechial rash with meningitis is pathognomonic for:",
    options: ["S. pneumoniae", "N. meningitidis (meningococcal meningitis)", "Listeria", "H. influenzae"],
    correctIndex: 1,
    answer: "Petechial/purpuric rash is characteristic of meningococcemia. Results from meningococcal endotoxin causing DIC and vascular damage. Rapidly progressive to purpura fulminans. Emergent antibiotic and ICU care required.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-meningitis-q24",
    type: "term",
    question: "What is the most common complication of meningococcal meningitis?",
    answer: "DIC and purpura fulminans (widespread skin necrosis from microvascular thrombosis). Can progress to Waterhouse-Friderichsen syndrome (bilateral adrenal hemorrhage). Other complications: SIADH, hydrocephalus, hearing loss, seizures.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q19",
    type: "question",
    question: "A 68-year-old male never-smoker with no AAA risk factors — should he be screened?",
    options: ["Yes, all men >65 should be screened", "No — USPSTF recommends screening only men 65-75 who have EVER smoked", "Screen only if hypertensive", "Screen at age 80"],
    correctIndex: 1,
    answer: "USPSTF Grade B: one-time screening for men 65-75 who have EVER smoked. For never-smokers, screening is not routinely recommended (Grade C — individualize based on risk factors: family history, male sex, HTN, hyperlipidemia).",
    category: "Cardiovascular NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q20",
    type: "term",
    question: "What is MMP (matrix metalloproteinase) role in AAA?",
    answer: "MMP-2 and MMP-9 degrade elastin and collagen in the aortic wall, weakening it. Smoking increases MMP activity. Inflammation and oxidative stress activate MMPs. MMP inhibition is a potential therapeutic target (though doxycycline trials showed no benefit).",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  {
    id: "np-aaa-q21",
    type: "question",
    question: "AAA repair threshold for women is:",
    options: ["Same as men (≥5.5 cm)", "Lower at ≥5.0 cm due to higher rupture risk per diameter", "Higher at ≥6.5 cm", "No guideline exists for women"],
    correctIndex: 1,
    answer: "Women have a higher rupture rate per aneurysm diameter (smaller aortic diameter at baseline), so repair is considered at ≥5.0 cm (vs ≥5.5 cm in men). Women are also more likely to have saccular aneurysms, which have higher rupture risk.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-aaa-q22",
    type: "term",
    question: "What concurrent aneurysms should be evaluated in AAA patients?",
    answer: "AAA patients have increased risk for: iliac artery aneurysms (30%), popliteal aneurysms (10-15%), and thoracic aortic aneurysms. CT scan at time of AAA diagnosis should evaluate the entire aorta and iliac vessels.",
    category: "Cardiovascular NP",
    difficulty: 2
  },
  {
    id: "np-thal-q22",
    type: "question",
    question: "What iron parameter differentiates thalassemia trait from iron deficiency?",
    options: ["Both have low ferritin", "Thalassemia trait has normal/elevated ferritin and normal TIBC; iron deficiency has low ferritin and elevated TIBC", "Both have elevated ferritin", "Iron studies are identical"],
    correctIndex: 1,
    answer: "Iron deficiency: low ferritin (<30), elevated TIBC, low serum iron. Thalassemia trait: normal/elevated ferritin, normal TIBC, normal serum iron. ALWAYS check iron studies before diagnosing microcytic anemia as iron deficiency to avoid iatrogenic iron overload.",
    category: "Hematology NP",
    difficulty: 1
  },
  {
    id: "np-thal-q23",
    type: "term",
    question: "What is the role of genetic counseling in thalassemia?",
    answer: "Essential for carrier couples: if both carry beta-thalassemia trait, 25% chance of thalassemia major offspring. If both carry cis alpha-thalassemia deletions, 25% risk of hydrops fetalis. Prenatal diagnosis (CVS, amniocentesis) available.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q24",
    type: "question",
    question: "Thalassemia intermedia differs from thalassemia major in that:",
    options: ["They are identical", "Intermedia patients maintain Hb 7-10 g/dL without regular transfusions due to milder mutations; may need occasional transfusions for infections/surgery", "Intermedia requires more transfusions", "Intermedia has no iron overload risk"],
    correctIndex: 1,
    answer: "Thalassemia intermedia: moderate anemia (Hb 7-10), milder mutations allowing some beta-globin production. May not need regular transfusions but can develop iron overload from increased intestinal absorption (erythroferrone/hepcidin pathway). Treatment: hydroxyurea, luspatercept, folic acid.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q25",
    type: "term",
    question: "What osteoporosis risk exists in thalassemia?",
    answer: "Multiple causes: marrow expansion (cortical thinning), hypogonadism (iron deposition), vitamin D deficiency, deferoxamine toxicity, and growth hormone deficiency. DEXA scanning recommended. Management: treat endocrinopathies, calcium/vitamin D, bisphosphonates.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q26",
    type: "question",
    question: "Hemoglobin Bart's (γ4) is found in:",
    options: ["Beta-thalassemia major", "Alpha-thalassemia with 4-gene deletion (hydrops fetalis)", "Iron deficiency", "Sickle cell disease"],
    correctIndex: 1,
    answer: "Hb Bart's (γ4 tetramers) form when all four alpha-globin genes are deleted — excess gamma chains self-assemble. Hb Bart's has extremely high O2 affinity, cannot deliver O2 to tissues, and is incompatible with life (hydrops fetalis).",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-thal-q27",
    type: "term",
    question: "What is Zynteglo (betibeglogene autotemcel)?",
    answer: "FDA-approved gene therapy for transfusion-dependent beta-thalassemia. Autologous hematopoietic stem cells are transduced with lentiviral vector carrying functional beta-globin gene (βA-T87Q), then reinfused after myeloablative conditioning. Can achieve transfusion independence.",
    category: "Hematology NP",
    difficulty: 3
  },
  {
    id: "np-ra-q24",
    type: "question",
    question: "The ACR/EULAR 2010 RA classification criteria require a total score of at least:",
    options: ["3/10", "4/10", "6/10", "8/10"],
    correctIndex: 2,
    answer: "Points: joint involvement (0-5), serology RF/anti-CCP (0-3), acute phase reactants ESR/CRP (0-1), duration ≥6 weeks (0-1). ≥6/10 = definite RA. Enables early classification before erosive damage.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q25",
    type: "term",
    question: "What is interstitial lung disease (ILD) in RA?",
    answer: "Extra-articular manifestation in 10-30% of RA patients. UIP (usual interstitial pneumonia) pattern most common and has worst prognosis. MTX can also cause drug-induced pneumonitis (acute, hypersensitivity). Distinguish by: onset timing relative to MTX initiation.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-ra-q26",
    type: "question",
    question: "Tocilizumab's unique monitoring consideration is:",
    options: ["No special monitoring", "CRP/ESR cannot be used to monitor disease activity because tocilizumab normalizes them even when disease is active", "Must monitor weekly CBC", "Requires monthly imaging"],
    correctIndex: 1,
    answer: "Tocilizumab blocks IL-6 signaling, which is the primary driver of hepatic CRP and ESR production. These markers normalize regardless of disease activity. Use clinical joint counts (CDAI/SDAI) instead. Also monitor lipids (IL-6 blockade raises LDL).",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-ra-q27",
    type: "term",
    question: "What is corticosteroid bridge therapy in RA?",
    answer: "Low-dose prednisone (10-15 mg daily) for 6-8 weeks while waiting for MTX to reach therapeutic effect (4-8 weeks onset). Taper and discontinue as DMARD effect takes hold. Avoid long-term corticosteroids due to cumulative toxicity.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-ra-q28",
    type: "question",
    question: "Abatacept (Orencia) works by:",
    options: ["TNF blockade", "Selective T-cell co-stimulation blockade — CTLA-4-Ig prevents CD80/86-CD28 interaction", "B-cell depletion", "IL-6 inhibition"],
    correctIndex: 1,
    answer: "Abatacept is a CTLA-4-Ig fusion protein that binds CD80/CD86 on APCs, blocking their interaction with CD28 on T cells. This prevents the 'second signal' needed for T-cell activation, reducing the autoimmune cascade.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q29",
    type: "term",
    question: "What perioperative management is needed for biologics in RA?",
    answer: "Hold biologic for ≥1 dosing interval before surgery (adalimumab ≥2 weeks, rituximab ≥6 months). Resume after adequate wound healing (~14 days, no infection). Methotrexate can generally be CONTINUED perioperatively.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q30",
    type: "question",
    question: "Long-term corticosteroid screening in RA patients should include:",
    options: ["Only blood pressure", "DEXA scan, glucose monitoring, eye exams (cataracts/glaucoma), and gradual taper plan to avoid adrenal crisis", "Only weight monitoring", "Annual chest X-ray only"],
    correctIndex: 1,
    answer: "Monitor for: osteoporosis (DEXA, consider bisphosphonates), hyperglycemia (steroid diabetes), cataracts/glaucoma (ophthalmology), adrenal suppression (never stop abruptly), weight gain, and increased infection risk.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-abx-q24",
    type: "term",
    question: "What is bezlotoxumab (Zinplava)?",
    answer: "Human monoclonal antibody against C. difficile toxin B. Given as single IV infusion WITH antibiotics. Reduces CDI recurrence by 38%. Does NOT treat active infection — always used alongside antibiotic therapy.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q25",
    type: "question",
    question: "What is the appropriate duration for uncomplicated CAP per 2019 ATS/IDSA guidelines?",
    options: ["3 days", "Minimum 5 days with clinical stability criteria met before stopping", "14 days minimum", "21 days"],
    correctIndex: 1,
    answer: "Minimum 5 days + clinical stability (afebrile >48h, HR <100, RR <24, SBP >90, SpO2 >90%, tolerating PO, normal mentation). Longer courses don't improve outcomes and increase CDI/resistance risk.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q26",
    type: "term",
    question: "What is penicillin allergy de-labeling?",
    answer: "~90% of patients reporting penicillin allergy are NOT truly allergic. Skin testing + oral challenge can safely de-label, enabling first-line beta-lactam use. Improves stewardship by reducing unnecessary use of broad-spectrum alternatives.",
    category: "Infectious Disease NP",
    difficulty: 1
  },
  {
    id: "np-abx-q27",
    type: "question",
    question: "Empiric outpatient CAP in a healthy adult is treated with:",
    options: ["Vancomycin IV", "Amoxicillin 1g TID or doxycycline 100 mg BID", "Meropenem", "Piperacillin-tazobactam"],
    correctIndex: 1,
    answer: "ATS/IDSA 2019: healthy outpatient without comorbidities — amoxicillin or doxycycline monotherapy. With comorbidities: amoxicillin-clavulanate + macrolide, or respiratory fluoroquinolone. Reserve broad-spectrum for hospital admission.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q28",
    type: "term",
    question: "What is Days of Therapy (DOT)?",
    answer: "Standard stewardship utilization metric: DOT per 1000 patient-days. Each antibiotic administered counts as one DOT regardless of dose. Allows institutional benchmarking and trend tracking. Different from Length of Therapy (LOT) which counts any antibiotic days.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q29",
    type: "question",
    question: "Prospective audit and feedback is the most effective stewardship intervention because:",
    options: ["It restricts all antibiotics", "Stewardship team reviews prescriptions daily and provides real-time recommendations for de-escalation, optimization, and discontinuation", "It eliminates all resistance", "It automates prescribing"],
    correctIndex: 1,
    answer: "PAF involves infectious disease/pharmacy stewardship teams actively reviewing antibiotic orders and providing direct, case-specific recommendations to prescribers. IDSA recommends this as a core strategy. More effective than blanket restriction policies.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q30",
    type: "term",
    question: "What is NAP1/BI/027 C. difficile strain?",
    answer: "Hypervirulent strain producing 16-23x more toxin A, 23x more toxin B, plus binary toxin (CDT). Associated with fluoroquinolone use. Higher rates of severe disease, recurrence, colectomy, and mortality. Drives ICU admission and healthcare outbreaks.",
    category: "Infectious Disease NP",
    difficulty: 3
  },
  {
    id: "np-vaccine-q29",
    type: "question",
    question: "What is the correct HPV dose schedule for a 12-year-old starting vaccination?",
    options: ["1 dose only", "2 doses: 0 and 6-12 months (started before age 15, only 2 doses needed)", "3 doses: 0, 1-2, 6 months", "4 doses"],
    correctIndex: 1,
    answer: "If started before age 15: 2-dose schedule (0 and 6-12 months). If started at age ≥15: 3-dose schedule (0, 1-2, 6 months). The 2-dose schedule for younger patients is based on superior immune response in this age group.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q30",
    type: "term",
    question: "What is LAIV (FluMist) and its contraindications?",
    answer: "Live attenuated intranasal influenza vaccine. Contraindicated in: immunocompromised, pregnancy, <2 or ≥50 years, aspirin therapy in children (Reye syndrome risk), severe asthma, close contacts of severely immunocompromised.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q31",
    type: "question",
    question: "What observation period is recommended after vaccination?",
    options: ["No observation needed", "15 minutes for most vaccines; 30 minutes if history of anaphylaxis", "60 minutes for all vaccines", "24-hour hospitalization"],
    correctIndex: 1,
    answer: "15 minutes post-vaccination for all patients (anaphylaxis typically occurs within minutes). 30 minutes if prior history of anaphylaxis to any cause. All vaccination sites must have epinephrine auto-injectors available.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q32",
    type: "term",
    question: "What is the Vaccine Adverse Event Reporting System (VAERS)?",
    answer: "National passive surveillance system co-managed by CDC and FDA. Healthcare providers are REQUIRED to report specific adverse events after vaccination. Anyone can submit reports. Data used to detect rare adverse events not identified in clinical trials.",
    category: "Preventive Care NP",
    difficulty: 1
  },
  {
    id: "np-vaccine-q33",
    type: "question",
    question: "Which high-dose influenza vaccine is recommended for adults ≥65?",
    options: ["Standard-dose IIV", "High-dose (Fluzone High-Dose Quadrivalent) or adjuvanted (Fluad Quadrivalent) for enhanced immunogenicity in elderly with immunosenescence", "LAIV nasal spray", "No vaccine needed for elderly"],
    correctIndex: 1,
    answer: "ACIP preferentially recommends high-dose, adjuvanted, or recombinant influenza vaccines for adults ≥65 due to immunosenescence reducing standard-dose vaccine effectiveness. High-dose contains 4x the antigen.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q34",
    type: "term",
    question: "What is the National Vaccine Injury Compensation Program (VICP)?",
    answer: "Federal no-fault program compensating individuals injured by covered vaccines. Funded by $0.75 excise tax per vaccine dose. Protects vaccine manufacturers from litigation, ensuring continued vaccine supply. Covers listed injuries within specified timeframes.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-vaccine-q35",
    type: "question",
    question: "When can immunocompromised patients receive live vaccines after stopping immunosuppressive therapy?",
    options: ["Immediately", "Wait at least 1 month after discontinuing immunosuppressive therapy (3 months for some biologics)", "6 months", "1 year"],
    correctIndex: 1,
    answer: "General rule: wait ≥1 month after stopping immunosuppressive therapy. Specific biologics require longer: rituximab ≥6 months (B-cell recovery), anti-TNF agents ≥1 month. Corticosteroids ≥20 mg x ≥14 days: wait ≥1 month after discontinuation.",
    category: "Preventive Care NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q29",
    type: "term",
    question: "What is harm reduction in tobacco use?",
    answer: "Strategy reducing health consequences without achieving complete abstinence. Includes NRT for reduction, smokeless tobacco substitution, or transitioning to lower-risk products. Complete cessation remains the goal, but harm reduction can be a stepping stone.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-smoking-q30",
    type: "question",
    question: "What percentage of quit attempts succeed without pharmacotherapy?",
    options: ["3-5% — pharmacotherapy doubles to triples quit rates", "25%", "50%", "75%"],
    correctIndex: 0,
    answer: "Unassisted quit attempts: only 3-5% succeed. With pharmacotherapy: varenicline 25-30%, combination NRT 25-30%, bupropion 20-25%. Combining pharmacotherapy with behavioral counseling further improves rates.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-smoking-q31",
    type: "term",
    question: "What is the relapse prevention strategy for former smokers?",
    answer: "Identify high-risk triggers (stress, alcohol, social situations, after meals), develop coping strategies, consider extended pharmacotherapy (up to 24 weeks for varenicline), ongoing behavioral support, and positive reinforcement of smoke-free days.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-parkinson-q29",
    type: "question",
    question: "What percentage of PD patients develop dementia over the disease course?",
    options: ["<10%", "20-30%", "50-80%", "100%"],
    correctIndex: 2,
    answer: "PD dementia develops in 50-80% of patients over the disease course. Executive dysfunction, visuospatial deficits, and attention impairment predominate (different pattern from Alzheimer's). Rivastigmine is the only cholinesterase inhibitor FDA-approved for PD dementia.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q30",
    type: "term",
    question: "What is sialorrhea in PD?",
    answer: "Drooling from impaired automatic swallowing (not excess saliva production). Management: botulinum toxin injection into salivary glands (most effective), sublingual atropine drops, glycopyrrolate. Contributes to aspiration risk and social embarrassment.",
    category: "Neurology NP",
    difficulty: 2
  },
  {
    id: "np-parkinson-q31",
    type: "question",
    question: "Dopamine agonists (pramipexole, ropinirole) are associated with which unique adverse effect?",
    options: ["Hepatotoxicity", "Sudden onset sleep attacks (falling asleep without warning, even while driving)", "Kidney stones", "Hair loss"],
    correctIndex: 1,
    answer: "Sudden onset sleep attacks (somnolence/sleep episodes without prodromal drowsiness) are a dangerous dopamine agonist side effect. Patients must be warned about driving risk. Also: impulse control disorders, peripheral edema, hallucinations.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q25",
    type: "term",
    question: "What are contraindications to lumbar puncture?",
    answer: "Coagulopathy (INR >1.5, platelets <50K), local skin infection at LP site, suspicion of spinal epidural abscess. Signs of raised ICP with mass effect (CT first): focal neuro deficits, papilledema, altered consciousness, immunocompromised, seizures.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q26",
    type: "question",
    question: "Post-meningitis seizure prophylaxis is recommended for:",
    options: ["All meningitis patients", "Patients who have had seizures — no routine prophylaxis recommended for all meningitis patients", "Only viral meningitis", "Only fungal meningitis"],
    correctIndex: 1,
    answer: "Routine seizure prophylaxis is NOT recommended for all bacterial meningitis patients. Treat seizures if they occur with appropriate anticonvulsants. Risk factors for meningitis-associated seizures: pneumococcal etiology, altered consciousness, focal deficits.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-meningitis-q27",
    type: "term",
    question: "What distinguishes viral from bacterial meningitis on CSF analysis?",
    answer: "Viral: WBC 10-500 lymphocyte predominance, normal glucose (CSF:serum >0.6), mildly elevated protein (50-100). Bacterial: WBC >1000 neutrophil predominance, low glucose (CSF:serum <0.4), markedly elevated protein (>100-500). Opening pressure elevated in both.",
    category: "Assessment NP",
    difficulty: 1
  },
  {
    id: "np-aaa-q23",
    type: "question",
    question: "Inflammatory AAA differs from atherosclerotic AAA in that:",
    options: ["They are identical", "Inflammatory AAA has thick periaortic fibrosis (white rind on CT), elevated ESR/CRP, and may cause ureteral obstruction", "Inflammatory AAA never ruptures", "Only inflammatory AAA requires surgery"],
    correctIndex: 1,
    answer: "Inflammatory AAA (~5-10% of all AAA): thick periaortic inflammatory rind on CT, elevated inflammatory markers, can obstruct ureters/duodenum. May respond to corticosteroids for periaortic inflammation. Surgical repair more technically challenging.",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  {
    id: "np-aaa-q24",
    type: "term",
    question: "What is the role of beta-blockers in AAA management?",
    answer: "Despite theoretical benefit of reducing hemodynamic stress (lower HR and dP/dt), the ATAT trial showed NO benefit of propranolol in slowing AAA growth. Beta-blockers are not specifically recommended for AAA but may be used for concurrent cardiovascular indications.",
    category: "Cardiovascular NP",
    difficulty: 3
  },
  {
    id: "np-thal-q28",
    type: "question",
    question: "What is the role of folic acid supplementation in thalassemia?",
    options: ["Not needed", "Recommended for all thalassemia patients due to increased folate demand from chronic hemolysis and expanded erythropoiesis", "Contraindicated", "Only during pregnancy"],
    correctIndex: 1,
    answer: "Chronic hemolysis and compensatory erythropoiesis increase folate demand. Folic acid 1-5 mg daily prevents megaloblastic changes superimposed on microcytic anemia. Especially important in thalassemia intermedia and non-transfusion-dependent disease.",
    category: "Hematology NP",
    difficulty: 1
  },
  {
    id: "np-thal-q29",
    type: "term",
    question: "What is the significance of HbF in thalassemia?",
    answer: "HbF (α2γ2) does not contain beta-globin chains and is therefore unaffected by beta-thalassemia mutations. Higher baseline HbF levels correlate with milder clinical phenotype. HbF induction with hydroxyurea is a therapeutic strategy.",
    category: "Hematology NP",
    difficulty: 2
  },
  {
    id: "np-ra-q31",
    type: "question",
    question: "Certolizumab (Cimzia) is preferred for which patient population?",
    options: ["All RA patients equally", "Pregnant/breastfeeding women — PEGylated Fc-free TNF inhibitor with minimal placental transfer", "Only elderly patients", "Only male patients"],
    correctIndex: 1,
    answer: "Certolizumab is a PEGylated anti-TNF Fab' fragment lacking the Fc region that mediates active placental transfer. This results in minimal transfer to the fetus, making it the preferred TNF inhibitor for pregnant women with RA requiring biologic therapy.",
    category: "Pharmacology NP",
    difficulty: 3
  },
  {
    id: "np-ra-q32",
    type: "term",
    question: "What extra-articular manifestations occur in RA?",
    answer: "Rheumatoid nodules (20-30%), ILD (10-30%), pericarditis/pleuritis, scleritis/episcleritis, vasculitis, Felty syndrome (splenomegaly + neutropenia), atlanto-axial subluxation, carpal tunnel syndrome, anemia of chronic disease.",
    category: "Assessment NP",
    difficulty: 2
  },
  {
    id: "np-abx-q31",
    type: "question",
    question: "Empiric treatment of bite wounds uses:",
    options: ["Cephalexin alone", "Amoxicillin-clavulanate — covers Pasteurella (animal), Eikenella (human), streptococci, staphylococci, and anaerobes", "Ciprofloxacin alone", "Metronidazole alone"],
    correctIndex: 1,
    answer: "Amoxicillin-clavulanate is first-line for all bite wounds. For penicillin allergy: TMP-SMX + metronidazole or moxifloxacin. Also: tetanus prophylaxis, rabies evaluation (animal bites), wound irrigation, and close follow-up.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q32",
    type: "term",
    question: "What is MIC (minimum inhibitory concentration)?",
    answer: "The lowest antibiotic concentration that inhibits visible bacterial growth in vitro. Determines susceptible (S), intermediate (I), or resistant (R) classification. For vancomycin: AUC/MIC 400-600 guides optimal dosing.",
    category: "Infectious Disease NP",
    difficulty: 2
  },
  {
    id: "np-abx-q33",
    type: "question",
    question: "Empiric treatment for acute uncomplicated pyelonephritis is:",
    options: ["Nitrofurantoin", "Ciprofloxacin 500 mg PO BID x7 days (or TMP-SMX if susceptible) — nitrofurantoin does NOT cover pyelonephritis", "Amoxicillin alone", "Doxycycline"],
    correctIndex: 1,
    answer: "Outpatient pyelonephritis: ciprofloxacin 500 mg BID x7 days or TMP-SMX 160/800 BID x14 days (if local resistance <20%). Nitrofurantoin does NOT achieve adequate renal tissue levels. Hospitalize if: sepsis, intolerance of PO, obstruction, or pregnancy.",
    category: "Pharmacology NP",
    difficulty: 2
  },
  {
    id: "np-abx-q34",
    type: "term",
    question: "What is the appropriate treatment for strep pharyngitis?",
    answer: "Penicillin VK or amoxicillin x10 days (full course prevents rheumatic fever). Alternative: azithromycin 5 days (rising resistance limits reliability). Single IM benzathine penicillin G for adherence-challenged patients.",
    category: "Pharmacology NP",
    difficulty: 1
  },
  {
    id: "np-abx-q35",
    type: "question",
    question: "Lyme disease (erythema migrans) first-line treatment is:",
    options: ["Vancomycin", "Doxycycline 100 mg BID x10-21 days", "Metronidazole", "Acyclovir"],
    correctIndex: 1,
    answer: "Doxycycline first-line for adults. Alternatives: amoxicillin 500 mg TID or cefuroxime 500 mg BID x14-21 days (preferred in pregnancy, children <8). Doxycycline also covers tick-borne co-infections (Anaplasma, Ehrlichia).",
    category: "Pharmacology NP",
    difficulty: 1
  },
];
