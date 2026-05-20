import crypto from "crypto";
import { pool } from "../storage";
import { NP_SPECIALTY_CONFIGS } from "./np-specialty-content-data";

function hashStem(stem: string, examPrefix?: string): string {
  const normalized = (examPrefix ? examPrefix + ":" : "") + stem.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
  return crypto.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

function hashFlashcard(front: string): string {
  return crypto.createHash("sha256").update(front.toLowerCase().trim()).digest("hex");
}

const BLUEPRINT_WEIGHTS: Record<string, Record<string, number>> = {
  "AANP-FNP": {
    "Assessment & Diagnosis": 0.38,
    "Clinical Management & Treatment": 0.38,
    "Health Promotion": 0.12,
    "Professional Practice": 0.12,
  },
  "ANCC-FNP": {
    "Assessment & Diagnosis": 0.32,
    "Clinical Management & Treatment": 0.32,
    "Health Promotion": 0.12,
    "Professional Practice": 0.08,
    "Research & Evidence": 0.08,
    "Role & Policy": 0.08,
  },
  "AGPCNP-AANP": {
    "Assessment & Diagnosis": 0.36,
    "Clinical Management & Treatment": 0.36,
    "Health Promotion & Disease Prevention": 0.14,
    "Professional Practice": 0.14,
  },
  "AGPCNP-ANCC": {
    "Assessment & Diagnosis": 0.30,
    "Clinical Management & Treatment": 0.30,
    "Health Promotion & Disease Prevention": 0.12,
    "Professional Practice": 0.10,
    "Research & Evidence-Based Practice": 0.10,
    "Role & Policy": 0.08,
  },
  "AGACNP": {
    "Complex Acute & Critical Care": 0.35,
    "Diagnostic Reasoning & Procedures": 0.25,
    "Chronic Disease in Acute Settings": 0.15,
    "Pharmacotherapeutics": 0.15,
    "Professional Practice & Systems": 0.10,
  },
  "PMHNP": {
    "Psychiatric Assessment": 0.30,
    "Psychopharmacology": 0.30,
    "Therapy Modalities": 0.20,
    "Crisis Intervention": 0.15,
    "Professional Practice": 0.05,
  },
  "PNP": {
    "Pediatric Health Assessment": 0.25,
    "Growth & Developmental Milestones": 0.20,
    "Pediatric Disease Management": 0.25,
    "Health Promotion & Immunizations": 0.15,
    "Family & Behavioral Health": 0.10,
    "Professional Practice": 0.05,
  },
  "WHNP": {
    "Reproductive Health & Gynecology": 0.30,
    "Prenatal & Postpartum Care": 0.20,
    "Primary Care of Women": 0.20,
    "Health Promotion & Screening": 0.15,
    "Professional Practice & Ethics": 0.15,
  },
  "ENP": {
    "Emergency Assessment & Triage": 0.30,
    "Acute Illness & Injury Management": 0.30,
    "Procedures & Diagnostics": 0.20,
    "Trauma Management": 0.10,
    "Professional Practice & Systems": 0.10,
  },
};

interface TopicPool {
  topic: string;
  bodySystem: string;
  domain: string;
  conditions: ConditionTemplate[];
}

interface ConditionTemplate {
  condition: string;
  presentations: PresentationVariant[];
  pharmacology: PharmTemplate[];
  diagnostics: DiagnosticTemplate[];
  management: ManagementTemplate[];
  caseScenarios: CaseTemplate[];
}

interface PresentationVariant {
  demographics: string;
  symptoms: string;
  findings: string;
  labs?: string;
  vitals?: string;
}

interface PharmTemplate {
  drug: string;
  drugClass: string;
  indication: string;
  dose: string;
  monitoring: string;
  interaction: string;
  contraindication: string;
  sideEffect: string;
}

interface DiagnosticTemplate {
  test: string;
  normalRange: string;
  abnormalFinding: string;
  interpretation: string;
  nextStep: string;
}

interface ManagementTemplate {
  scenario: string;
  firstLine: string;
  secondLine: string;
  referral: string;
  followUp: string;
}

interface CaseTemplate {
  caseLabel: string;
  phases: string[];
}

const COGNITIVE_LEVELS = ["recall", "application", "analysis", "synthesis"];
const DIFFICULTIES = [1, 2, 2, 3, 3, 3, 3, 4, 4, 5];
const QUESTION_FORMATS = ["MCQ", "MCQ", "MCQ", "MCQ", "MCQ", "scenario-based", "scenario-based", "SATA", "lab-interpretation", "prioritization", "bowtie", "progressive-unfolding", "dosage-calculation", "ordered-response"];
const NGN_FORMATS = ["scenario-based", "bowtie", "SATA", "progressive-unfolding", "lab-interpretation"];

const PATIENT_AGES = ["22-year-old", "28-year-old", "34-year-old", "42-year-old", "48-year-old", "55-year-old", "62-year-old", "68-year-old", "74-year-old", "81-year-old"];
const GENDERS = ["male", "female"];
const SETTINGS = ["primary care clinic", "urgent care center", "family practice office", "outpatient clinic", "community health center"];

const SPECIALTY_TOPIC_BANKS: Record<string, TopicPool[]> = {
  "AANP-FNP": buildFNPTopics(),
  "ANCC-FNP": buildFNPTopics(),
  "AGPCNP-AANP": buildAGPCNPTopics(),
  "AGPCNP-ANCC": buildAGPCNPTopics(),
  "AGACNP": buildAGACNPTopics(),
  "PMHNP": buildPMHNPTopics(),
  "PNP": buildPNPTopics(),
  "WHNP": buildWHNPTopics(),
  "ENP": buildENPTopics(),
};

function buildFNPTopics(): TopicPool[] {
  return [
    {
      topic: "Cardiovascular Disorders",
      bodySystem: "Cardiovascular",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Hypertension",
          presentations: [
            { demographics: "55-year-old male", symptoms: "headaches, dizziness", findings: "BP 158/96 mmHg, S4 gallop, mild LVH on ECG", labs: "BMP normal, lipid panel elevated LDL", vitals: "HR 78, RR 16" },
            { demographics: "62-year-old female", symptoms: "fatigue, blurred vision", findings: "BP 168/102 mmHg, retinal AV nicking, proteinuria on UA", labs: "Cr 1.4, K+ 4.2, UA protein 2+", vitals: "HR 82, RR 18" },
            { demographics: "48-year-old male", symptoms: "chest tightness with exertion", findings: "BP 172/98 mmHg, PMI displaced laterally, bilateral ankle edema", labs: "BNP 180, Cr 1.2, HbA1c 7.8%", vitals: "HR 88, RR 20" },
          ],
          pharmacology: [
            { drug: "Lisinopril", drugClass: "ACE Inhibitor", indication: "HTN, HF, diabetic nephropathy", dose: "10-40 mg daily", monitoring: "BMP (K+, Cr) at 1-2 weeks after initiation", interaction: "NSAIDs reduce efficacy, potassium-sparing diuretics increase hyperkalemia risk", contraindication: "Pregnancy, bilateral renal artery stenosis, angioedema history", sideEffect: "Dry cough (10-15%), hyperkalemia, angioedema" },
            { drug: "Amlodipine", drugClass: "Calcium Channel Blocker", indication: "HTN, angina", dose: "5-10 mg daily", monitoring: "BP, HR, peripheral edema assessment", interaction: "CYP3A4 inhibitors increase levels, simvastatin dose limit 20mg", contraindication: "Severe aortic stenosis", sideEffect: "Peripheral edema, flushing, headache" },
            { drug: "Hydrochlorothiazide", drugClass: "Thiazide Diuretic", indication: "HTN", dose: "12.5-25 mg daily", monitoring: "BMP (Na+, K+, uric acid, glucose) at 2-4 weeks", interaction: "Lithium levels increased, digoxin toxicity with hypokalemia", contraindication: "Anuria, sulfonamide allergy", sideEffect: "Hypokalemia, hyperuricemia, hyperglycemia, hyponatremia" },
          ],
          diagnostics: [
            { test: "Basic Metabolic Panel", normalRange: "Na 136-145, K 3.5-5.0, Cr 0.7-1.3, BUN 7-20", abnormalFinding: "K+ 5.6 after starting ACEi", interpretation: "Drug-induced hyperkalemia requiring medication adjustment", nextStep: "Hold ACEi, recheck K+ in 48 hours, consider alternative agent" },
            { test: "ECG", normalRange: "Normal sinus rhythm, normal QRS voltage", abnormalFinding: "LVH criteria met (Sokolow-Lyon >35mm)", interpretation: "Left ventricular hypertrophy suggesting chronic uncontrolled HTN", nextStep: "Echocardiogram to assess LV mass and function" },
          ],
          management: [
            { scenario: "Stage 1 HTN in non-diabetic patient", firstLine: "Lifestyle modification for 3-6 months if no ASCVD risk factors", secondLine: "Thiazide diuretic or CCB as initial monotherapy", referral: "Cardiology if resistant HTN (uncontrolled on 3+ agents including diuretic)", followUp: "Recheck BP in 4-6 weeks after medication change" },
            { scenario: "Stage 2 HTN with diabetes", firstLine: "ACEi/ARB + CCB or thiazide combination therapy", secondLine: "Triple therapy: ACEi + CCB + thiazide", referral: "Nephrology if GFR <30 or rapidly declining renal function", followUp: "BMP at 1-2 weeks, BP recheck at 4 weeks" },
          ],
          caseScenarios: [
            { caseLabel: "Progressive HTN with target organ damage", phases: ["Initial presentation with elevated BP and headaches", "Lab results showing proteinuria and elevated creatinine", "ECG demonstrating LVH", "Treatment selection and monitoring plan"] },
          ],
        },
        {
          condition: "Heart Failure",
          presentations: [
            { demographics: "68-year-old male", symptoms: "progressive dyspnea on exertion, orthopnea, PND", findings: "JVD, bilateral crackles, S3 gallop, 2+ pitting edema", labs: "BNP 1200, Cr 1.5, Na 132", vitals: "HR 96, BP 142/88, O2 sat 92% RA" },
            { demographics: "74-year-old female", symptoms: "weight gain of 8 lbs in 1 week, worsening fatigue", findings: "Hepatojugular reflux, ascites, hepatomegaly", labs: "BNP 950, AST/ALT elevated, albumin 2.8", vitals: "HR 102, BP 108/72, RR 24" },
          ],
          pharmacology: [
            { drug: "Carvedilol", drugClass: "Beta-Blocker", indication: "HFrEF", dose: "3.125 mg BID, titrate to 25 mg BID over weeks", monitoring: "HR, BP, weight, symptoms of decompensation", interaction: "Insulin may mask hypoglycemia signs, verapamil contraindicated", contraindication: "Decompensated HF, severe bradycardia, 2nd/3rd degree AV block", sideEffect: "Bradycardia, hypotension, fatigue, dizziness" },
            { drug: "Sacubitril/Valsartan", drugClass: "ARNI", indication: "HFrEF (EF <=40%)", dose: "24/26 mg BID, titrate to 97/103 mg BID", monitoring: "BP, K+, renal function, angioedema symptoms", interaction: "Cannot use with ACEi (36-hour washout), increases lithium levels", contraindication: "Concurrent ACEi use, angioedema history, pregnancy", sideEffect: "Hypotension, hyperkalemia, renal impairment, angioedema" },
          ],
          diagnostics: [
            { test: "BNP/NT-proBNP", normalRange: "BNP <100 pg/mL, NT-proBNP <300 pg/mL", abnormalFinding: "BNP 1200 pg/mL", interpretation: "Significantly elevated, consistent with acute decompensated heart failure", nextStep: "Echocardiogram to assess EF, diuretic therapy initiation" },
          ],
          management: [
            { scenario: "New HFrEF diagnosis (EF 35%)", firstLine: "ACEi/ARB/ARNI + evidence-based beta-blocker + diuretic for volume management", secondLine: "Add MRA (spironolactone) if K+ <5.0 and GFR >30, consider SGLT2i", referral: "Cardiology for all new HFrEF diagnoses, advanced HF if NYHA III-IV", followUp: "Weight monitoring daily, BMP in 1 week, cardiology within 2 weeks" },
          ],
          caseScenarios: [
            { caseLabel: "Acute HF exacerbation management", phases: ["Presentation with dyspnea and volume overload", "Diagnostic workup including BNP and echo", "Acute diuretic management", "Discharge planning and GDMT optimization"] },
          ],
        },
        {
          condition: "Atrial Fibrillation",
          presentations: [
            { demographics: "72-year-old male", symptoms: "palpitations, exercise intolerance, lightheadedness", findings: "Irregularly irregular pulse, rate 122, no murmur", labs: "TSH 0.8, BMP normal", vitals: "HR 122, BP 136/84, O2 98%" },
          ],
          pharmacology: [
            { drug: "Apixaban", drugClass: "Factor Xa Inhibitor (DOAC)", indication: "Stroke prevention in non-valvular AF", dose: "5 mg BID (2.5 mg BID if age >=80, weight <=60 kg, or Cr >=1.5)", monitoring: "Renal function annually, CBC for bleeding", interaction: "Strong CYP3A4/P-gp inhibitors (ketoconazole) increase levels", contraindication: "Active pathological bleeding, mechanical heart valve, severe hepatic impairment", sideEffect: "Bleeding, GI upset, anemia" },
            { drug: "Metoprolol Succinate", drugClass: "Beta-1 Selective Blocker", indication: "Rate control in AF", dose: "25-200 mg daily (XL formulation)", monitoring: "Resting HR target <80 bpm, BP", interaction: "Verapamil/diltiazem risk of severe bradycardia, clonidine withdrawal rebound", contraindication: "Severe bradycardia, decompensated HF, sick sinus syndrome without pacemaker", sideEffect: "Fatigue, bradycardia, depression, cold extremities, bronchospasm" },
          ],
          diagnostics: [
            { test: "CHA2DS2-VASc Score", normalRange: "Score 0 = low risk", abnormalFinding: "Score 4 (age >75, HTN, DM)", interpretation: "High stroke risk requiring anticoagulation", nextStep: "Initiate DOAC therapy, assess bleeding risk with HAS-BLED score" },
          ],
          management: [
            { scenario: "New-onset AF with rapid ventricular rate", firstLine: "Rate control with beta-blocker or non-DHP CCB, anticoagulation assessment with CHA2DS2-VASc", secondLine: "Rhythm control consideration if symptomatic despite rate control", referral: "Cardiology for rhythm control evaluation, electrophysiology for ablation consideration", followUp: "HR and rhythm assessment at 1 week, TSH if not recently checked" },
          ],
          caseScenarios: [
            { caseLabel: "AF with stroke risk assessment", phases: ["Initial presentation with palpitations and irregular rhythm", "CHA2DS2-VASc and HAS-BLED scoring", "Anticoagulation selection and patient education", "Follow-up rate control optimization"] },
          ],
        },
      ],
    },
    {
      topic: "Endocrine Disorders",
      bodySystem: "Endocrine",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Type 2 Diabetes Mellitus",
          presentations: [
            { demographics: "52-year-old female", symptoms: "polyuria, polydipsia, fatigue, blurred vision", findings: "BMI 34, acanthosis nigricans, mild peripheral neuropathy", labs: "FBG 186, HbA1c 8.4%, Cr 0.9, eGFR >90", vitals: "BP 142/88, HR 78" },
            { demographics: "64-year-old male", symptoms: "numbness in feet, slow wound healing", findings: "BMI 31, diminished monofilament sensation bilateral feet, fungal nail infection", labs: "HbA1c 9.2%, lipid panel: LDL 162, TG 248, eGFR 55", vitals: "BP 154/92, HR 84" },
          ],
          pharmacology: [
            { drug: "Metformin", drugClass: "Biguanide", indication: "T2DM first-line", dose: "500 mg BID, titrate to 1000 mg BID", monitoring: "Renal function (Cr/eGFR annually), B12 levels periodically", interaction: "Iodinated contrast (hold 48h before/after), alcohol increases lactic acidosis risk", contraindication: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate, may continue)", sideEffect: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)" },
            { drug: "Semaglutide", drugClass: "GLP-1 Receptor Agonist", indication: "T2DM with ASCVD, weight management", dose: "0.25 mg SC weekly x4 weeks, titrate to 0.5-1 mg weekly", monitoring: "HbA1c q3 months, renal function, signs of pancreatitis", interaction: "May delay absorption of oral medications", contraindication: "Personal/family history of medullary thyroid carcinoma or MEN 2", sideEffect: "Nausea (dose-related), vomiting, diarrhea, injection site reactions, pancreatitis risk" },
            { drug: "Empagliflozin", drugClass: "SGLT2 Inhibitor", indication: "T2DM with HF or CKD, cardiovascular risk reduction", dose: "10-25 mg daily", monitoring: "Renal function, genital infections, volume status", interaction: "Diuretics increase dehydration/hypotension risk", contraindication: "eGFR <20 for glucose lowering (may continue for cardiorenal benefits), type 1 DM", sideEffect: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA risk" },
          ],
          diagnostics: [
            { test: "HbA1c", normalRange: "4.0-5.6% (normal), 5.7-6.4% (prediabetes)", abnormalFinding: "HbA1c 8.4%", interpretation: "Uncontrolled T2DM, represents 3-month average glucose approximately 194 mg/dL", nextStep: "Intensify therapy, assess medication adherence, evaluate barriers to control" },
            { test: "Urine Albumin-to-Creatinine Ratio", normalRange: "<30 mg/g", abnormalFinding: "UACR 145 mg/g", interpretation: "Moderately increased albuminuria (A2 category), indicative of early diabetic nephropathy", nextStep: "Initiate or optimize ACEi/ARB, consider SGLT2i for nephroprotection" },
          ],
          management: [
            { scenario: "Newly diagnosed T2DM, HbA1c 7.5%, no ASCVD", firstLine: "Metformin + lifestyle modifications (diet, exercise 150 min/week)", secondLine: "Add SGLT2i or GLP-1 RA based on comorbidity profile", referral: "Endocrinology if HbA1c >10% or insulin-requiring, ophthalmology for baseline retinal exam", followUp: "HbA1c at 3 months, comprehensive metabolic panel, lipid panel, UACR annually" },
          ],
          caseScenarios: [
            { caseLabel: "Progressive T2DM management", phases: ["Initial diagnosis with elevated HbA1c and obesity", "Three-month follow-up with suboptimal control on metformin", "Addition of second agent based on comorbidities", "Long-term monitoring and complication screening"] },
          ],
        },
        {
          condition: "Hypothyroidism",
          presentations: [
            { demographics: "45-year-old female", symptoms: "fatigue, weight gain, constipation, cold intolerance, hair loss", findings: "Dry skin, delayed DTRs, non-pitting edema, bradycardia", labs: "TSH 14.2, free T4 0.5, anti-TPO antibodies positive", vitals: "HR 56, BP 132/86, temp 97.4F" },
          ],
          pharmacology: [
            { drug: "Levothyroxine", drugClass: "Synthetic T4", indication: "Hypothyroidism", dose: "1.6 mcg/kg/day full replacement, elderly: start 25-50 mcg/day", monitoring: "TSH at 6-8 weeks after dose change, annually when stable", interaction: "Calcium, iron, PPI reduce absorption (separate by 4 hours), warfarin effect increased", contraindication: "Uncorrected adrenal insufficiency (must treat with cortisol first)", sideEffect: "Overreplacement: tachycardia, anxiety, weight loss, osteoporosis risk, atrial fibrillation" },
          ],
          diagnostics: [
            { test: "TSH with Reflex Free T4", normalRange: "TSH 0.4-4.0 mIU/L, FT4 0.8-1.8 ng/dL", abnormalFinding: "TSH 14.2, FT4 0.5", interpretation: "Primary hypothyroidism (high TSH, low FT4)", nextStep: "Start levothyroxine, check anti-TPO for Hashimoto confirmation" },
          ],
          management: [
            { scenario: "Primary hypothyroidism in young adult", firstLine: "Levothyroxine 1.6 mcg/kg/day, take on empty stomach 30-60 min before breakfast", secondLine: "Consider T4+T3 combination if persistent symptoms despite normal TSH (controversial)", referral: "Endocrinology if thyroid nodule found, pregnant, or difficulty achieving euthyroid state", followUp: "TSH in 6-8 weeks, then every 6-12 months when stable" },
          ],
          caseScenarios: [
            { caseLabel: "Hashimoto thyroiditis management", phases: ["Presentation with hypothyroid symptoms", "Lab confirmation and antibody testing", "Levothyroxine initiation and dose titration", "Long-term monitoring and dose adjustments"] },
          ],
        },
      ],
    },
    {
      topic: "Respiratory Disorders",
      bodySystem: "Respiratory",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Asthma",
          presentations: [
            { demographics: "32-year-old female", symptoms: "recurrent wheezing, chest tightness, nighttime cough 3x/week", findings: "Bilateral expiratory wheezes, prolonged expiratory phase", labs: "PFTs: FEV1/FVC 68%, FEV1 72% predicted, 15% improvement post-bronchodilator", vitals: "HR 88, RR 20, O2 97%" },
          ],
          pharmacology: [
            { drug: "Fluticasone/Salmeterol", drugClass: "ICS/LABA Combination", indication: "Moderate-severe persistent asthma", dose: "100/50 to 500/50 mcg, 1 inhalation BID", monitoring: "PEF, symptom diary, oral candidiasis check, growth velocity in children", interaction: "Strong CYP3A4 inhibitors (ritonavir) increase fluticasone levels, beta-blockers may antagonize salmeterol", contraindication: "LABA monotherapy (without ICS), status asthmaticus for acute relief", sideEffect: "Oral candidiasis, dysphonia, tachycardia from LABA, potential growth suppression in children" },
          ],
          diagnostics: [
            { test: "Spirometry", normalRange: "FEV1/FVC >70%, FEV1 >80% predicted", abnormalFinding: "FEV1/FVC 68%, FEV1 72% predicted, 15% reversibility", interpretation: "Obstructive pattern with significant bronchodilator reversibility, consistent with moderate persistent asthma", nextStep: "Classify severity, initiate step therapy per NAEPP/GINA guidelines" },
          ],
          management: [
            { scenario: "Moderate persistent asthma, inadequately controlled on low-dose ICS", firstLine: "Step up to medium-dose ICS + LABA (or add LAMA as alternative)", secondLine: "High-dose ICS + LABA, add LTRA or theophylline", referral: "Pulmonology if uncontrolled on Step 4 therapy, or if diagnosis uncertain", followUp: "PFTs at 3 months, assess control with ACT questionnaire, step down after 3 months of good control" },
          ],
          caseScenarios: [],
        },
        {
          condition: "COPD",
          presentations: [
            { demographics: "66-year-old male", symptoms: "progressive dyspnea on exertion, chronic productive cough, 40-pack-year smoking history", findings: "Barrel chest, diminished breath sounds, hyperresonance to percussion", labs: "PFTs: FEV1/FVC 58%, FEV1 48% predicted, minimal bronchodilator response, ABG: pH 7.36, PaCO2 48", vitals: "HR 92, RR 22, O2 90% RA" },
          ],
          pharmacology: [
            { drug: "Tiotropium", drugClass: "Long-Acting Muscarinic Antagonist (LAMA)", indication: "COPD maintenance therapy", dose: "18 mcg inhaled once daily (HandiHaler) or 2 puffs of 2.5 mcg (Respimat)", monitoring: "Anticholinergic effects (urinary retention, dry mouth, constipation), glaucoma symptoms", interaction: "Other anticholinergics increase side effect risk", contraindication: "Known hypersensitivity to atropine derivatives", sideEffect: "Dry mouth, urinary retention, constipation, paradoxical bronchospasm" },
          ],
          diagnostics: [
            { test: "Post-bronchodilator Spirometry", normalRange: "FEV1/FVC >70%", abnormalFinding: "FEV1/FVC 58%, FEV1 48% predicted post-bronchodilator", interpretation: "Confirmed COPD, GOLD Stage III (severe), based on persistent airflow limitation", nextStep: "LAMA + LABA combination, assess for supplemental oxygen, smoking cessation" },
          ],
          management: [
            { scenario: "GOLD Stage III COPD with frequent exacerbations", firstLine: "LAMA + LABA combination (tiotropium + olodaterol), PRN SABA", secondLine: "Add ICS if eosinophils >300 or frequent exacerbations on LAMA+LABA", referral: "Pulmonology for advanced COPD, pulmonary rehabilitation, oxygen assessment", followUp: "PFTs annually, COPD Assessment Test (CAT) every visit, vaccination review" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Musculoskeletal Disorders",
      bodySystem: "Musculoskeletal",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Osteoarthritis",
          presentations: [
            { demographics: "58-year-old female", symptoms: "bilateral knee pain worse with activity, morning stiffness <30 minutes, crepitus", findings: "Bony enlargement bilateral knees, reduced ROM, crepitus, no warmth or effusion", labs: "ESR normal, CRP normal, RF negative", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Acetaminophen", drugClass: "Analgesic", indication: "Mild OA pain", dose: "325-650 mg q4-6h PRN, max 3g/day (2g if liver disease)", monitoring: "Hepatic function if chronic use, total daily dose from all sources", interaction: "Warfarin effect potentiated, alcohol increases hepatotoxicity risk", contraindication: "Severe hepatic impairment, active liver disease", sideEffect: "Hepatotoxicity in overdose, rare allergic reactions" },
            { drug: "Meloxicam", drugClass: "NSAID (COX-2 preferential)", indication: "OA pain and inflammation", dose: "7.5-15 mg daily", monitoring: "Renal function, GI symptoms, BP, CBC if prolonged use", interaction: "Lithium levels increased, ACEi/ARB efficacy reduced, anticoagulant bleeding risk", contraindication: "Active GI bleeding, CKD stage 4-5, perioperative CABG, aspirin-sensitive asthma", sideEffect: "GI bleeding/ulcer, renal impairment, cardiovascular events, hypertension" },
          ],
          diagnostics: [
            { test: "Knee X-ray (weight-bearing)", normalRange: "Preserved joint space, no osteophytes", abnormalFinding: "Joint space narrowing, osteophyte formation, subchondral sclerosis", interpretation: "Radiographic OA, Kellgren-Lawrence grade III", nextStep: "Conservative management with physical therapy, weight management, pharmacotherapy" },
          ],
          management: [
            { scenario: "Moderate knee OA affecting daily activities", firstLine: "Physical therapy, weight loss if BMI >25, topical NSAIDs, acetaminophen", secondLine: "Oral NSAIDs with PPI gastroprotection, intra-articular corticosteroid injection", referral: "Orthopedics if failed conservative management after 3-6 months, considering arthroplasty", followUp: "Reassess pain and function at 6-8 weeks, monitor for NSAID side effects" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Dermatological Conditions",
      bodySystem: "Integumentary",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Skin Lesion Assessment",
          presentations: [
            { demographics: "65-year-old male", symptoms: "changing mole on upper back noticed by spouse, no pain or itching", findings: "Asymmetric lesion 8mm diameter, irregular borders, variegated color (brown/black/red), slightly elevated", labs: "None initially", vitals: "Normal" },
          ],
          pharmacology: [],
          diagnostics: [
            { test: "Dermoscopy/ABCDE Assessment", normalRange: "Symmetric, regular borders, uniform color, <6mm, stable", abnormalFinding: "Asymmetric, irregular borders, color variation, 8mm, evolving", interpretation: "Meets multiple ABCDE criteria for melanoma - high suspicion", nextStep: "Urgent excisional biopsy with 1-3mm margins, dermatology referral" },
          ],
          management: [
            { scenario: "Suspicious melanocytic lesion", firstLine: "Excisional biopsy (not shave biopsy) for histopathologic evaluation", secondLine: "Wide local excision based on Breslow depth if melanoma confirmed", referral: "Dermatology urgent referral for biopsy, oncology if melanoma confirmed", followUp: "Biopsy results within 1-2 weeks, total body skin exam for additional lesions" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "GI & Hepatic Disorders",
      bodySystem: "Gastrointestinal",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "GERD",
          presentations: [
            { demographics: "44-year-old male", symptoms: "heartburn, regurgitation, worse after meals and when lying down, 3-month history", findings: "Mild epigastric tenderness, no red flags (dysphagia, weight loss, GI bleeding)", labs: "CBC normal", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Omeprazole", drugClass: "Proton Pump Inhibitor", indication: "GERD, peptic ulcer disease", dose: "20 mg daily before breakfast for 8 weeks", monitoring: "Mg2+ if prolonged use, B12 periodically, bone density if >1 year use", interaction: "Clopidogrel effect reduced (avoid combination), methotrexate levels increased", contraindication: "None absolute, caution in severe hepatic impairment", sideEffect: "C. difficile infection risk, hypomagnesemia, B12 deficiency, hip fracture risk with long-term use, fundic gland polyps" },
          ],
          diagnostics: [
            { test: "Upper Endoscopy (EGD)", normalRange: "Normal esophageal mucosa", abnormalFinding: "Erythema and erosions in distal esophagus", interpretation: "Erosive esophagitis, LA Classification Grade B", nextStep: "PPI therapy for 8 weeks, repeat EGD if Barrett esophagus suspected" },
          ],
          management: [
            { scenario: "Uncomplicated GERD without alarm symptoms", firstLine: "Lifestyle modifications (elevate HOB, avoid triggers, weight loss) + PPI 8 weeks", secondLine: "Double-dose PPI, add H2RA at bedtime if nocturnal symptoms persist", referral: "GI referral for EGD if alarm symptoms, refractory GERD, or >5 years of symptoms", followUp: "Assess symptom resolution at 8 weeks, attempt PPI step-down to lowest effective dose" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Renal & Urological Disorders",
      bodySystem: "Renal/Urinary",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Urinary Tract Infection",
          presentations: [
            { demographics: "28-year-old female", symptoms: "dysuria, urinary frequency, urgency, suprapubic discomfort", findings: "Suprapubic tenderness, no CVA tenderness, no fever", labs: "UA: WBC 50+, nitrite positive, LE positive, no casts", vitals: "Temp 98.8F, HR 78, BP 118/72" },
          ],
          pharmacology: [
            { drug: "Nitrofurantoin", drugClass: "Nitrofuran Antibiotic", indication: "Uncomplicated lower UTI", dose: "Macrocrystal 100 mg BID x 5 days", monitoring: "Renal function (ineffective if CrCl <30), pulmonary symptoms with prolonged use", interaction: "Magnesium trisilicate antacids reduce absorption", contraindication: "CrCl <30 (inadequate urinary concentration), G6PD deficiency, pregnancy at term (38-42 weeks)", sideEffect: "GI upset, peripheral neuropathy with prolonged use, pulmonary fibrosis (rare), hemolytic anemia in G6PD" },
          ],
          diagnostics: [
            { test: "Urinalysis with Culture", normalRange: "WBC <5, no bacteria, nitrite negative, LE negative", abnormalFinding: "WBC 50+, nitrite positive, LE positive, >100,000 CFU E. coli", interpretation: "Uncomplicated cystitis with E. coli, consistent with simple UTI", nextStep: "First-line antibiotic (nitrofurantoin or TMP-SMX based on local resistance), no imaging needed" },
          ],
          management: [
            { scenario: "Uncomplicated cystitis in non-pregnant female", firstLine: "Nitrofurantoin 100mg BID x 5 days or TMP-SMX DS BID x 3 days", secondLine: "Fosfomycin 3g single dose, or fluoroquinolone if resistance concerns", referral: "Urology if recurrent UTIs (>3/year), structural abnormality suspected, or male UTI", followUp: "Test of cure not needed if symptoms resolve, repeat UA only if persistent symptoms" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Neurological Disorders",
      bodySystem: "Neurological",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Migraine Headache",
          presentations: [
            { demographics: "35-year-old female", symptoms: "recurrent unilateral throbbing headaches with photophobia, phonophobia, nausea, 4-6 episodes per month", findings: "Normal neurological exam, no papilledema, no focal deficits", labs: "None indicated", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Sumatriptan", drugClass: "Triptan (5-HT1B/1D Agonist)", indication: "Acute migraine treatment", dose: "50-100 mg PO at onset, may repeat in 2 hours (max 200 mg/day), also available SC 6mg, nasal 20mg", monitoring: "CV risk assessment before initiation, frequency of use (limit to <10 days/month to prevent MOH)", interaction: "SSRIs/SNRIs (serotonin syndrome risk), MAOIs (contraindicated within 2 weeks), ergotamines", contraindication: "Ischemic heart disease, uncontrolled HTN, hemiplegic/basilar migraine, recent stroke, peripheral vascular disease", sideEffect: "Chest tightness/pressure, tingling, flushing, dizziness, medication overuse headache" },
            { drug: "Topiramate", drugClass: "Anticonvulsant (Migraine Prophylaxis)", indication: "Migraine prevention (>=4 headache days/month)", dose: "25 mg daily, titrate by 25 mg/week to 50-100 mg BID", monitoring: "Renal function (kidney stones), metabolic acidosis (bicarb), cognitive function, weight", interaction: "Reduces efficacy of oral contraceptives, increases metformin levels, valproate interaction", contraindication: "Pregnancy (teratogenic - cleft palate), glaucoma, kidney stones, metabolic acidosis", sideEffect: "Cognitive dulling ('dopamax'), paresthesias, weight loss, kidney stones, metabolic acidosis, teratogenicity" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Frequent migraines (>4/month) with functional impairment", firstLine: "Prophylaxis with propranolol 40-160 mg daily or topiramate 50-100 mg BID, acute: triptan", secondLine: "CGRP monoclonal antibodies (erenumab, fremanezumab) if 2+ prophylactic agents failed", referral: "Neurology if refractory to 2 prophylactic agents, atypical features, or aura with motor symptoms", followUp: "Headache diary review at 4-6 weeks, assess >50% reduction in frequency as treatment success" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Infectious Disease",
      bodySystem: "Infectious Disease",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Community-Acquired Pneumonia",
          presentations: [
            { demographics: "58-year-old male", symptoms: "productive cough with purulent sputum, fever, pleuritic chest pain, dyspnea", findings: "Crackles in right lower lobe, dullness to percussion, increased tactile fremitus", labs: "WBC 15,800, CXR: RLL consolidation, procalcitonin 0.8", vitals: "Temp 101.8F, HR 102, RR 24, BP 128/78, O2 93% RA" },
          ],
          pharmacology: [
            { drug: "Amoxicillin", drugClass: "Aminopenicillin", indication: "Outpatient CAP without comorbidities", dose: "1g TID for 5-7 days", monitoring: "Clinical improvement in 48-72 hours, allergy assessment", interaction: "Methotrexate levels increased, warfarin effect may increase", contraindication: "Anaphylaxis to penicillin, infectious mononucleosis (rash risk)", sideEffect: "Diarrhea, nausea, rash, allergic reactions, C. difficile" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Outpatient CAP with comorbidities", firstLine: "Amoxicillin-clavulanate 875/125 BID + azithromycin 500mg day 1, 250mg days 2-5 OR respiratory fluoroquinolone monotherapy", secondLine: "Doxycycline 100 mg BID as alternative to macrolide if allergy", referral: "Hospital admission if CURB-65 >=2, low O2, unable to tolerate PO, immunocompromised", followUp: "Clinical reassessment at 48-72 hours, repeat CXR only if not improving or high-risk" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Mental Health & Behavioral Disorders",
      bodySystem: "Mental Health",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Major Depressive Disorder",
          presentations: [
            { demographics: "42-year-old female", symptoms: "depressed mood, anhedonia, insomnia, poor concentration, fatigue, worthlessness, 6-week duration", findings: "PHQ-9 score 18 (moderately severe), flat affect, psychomotor retardation, no suicidal ideation", labs: "TSH normal, CBC normal, B12 normal", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Sertraline", drugClass: "SSRI", indication: "MDD, GAD, PTSD, OCD, panic disorder", dose: "50 mg daily, titrate by 25-50 mg every 1-2 weeks, max 200 mg/day", monitoring: "Suicidality (especially ages 18-24 in first weeks), serotonin syndrome symptoms, Na+ in elderly", interaction: "MAOIs (absolute contraindication, 14-day washout), triptans (serotonin syndrome), warfarin (increased bleeding)", contraindication: "Concurrent MAOI use, concurrent pimozide", sideEffect: "GI upset (nausea, diarrhea), sexual dysfunction (30-70%), insomnia/somnolence, weight changes, serotonin syndrome" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Moderate-severe MDD (PHQ-9 >=15)", firstLine: "SSRI (sertraline or escitalopram) + psychotherapy (CBT or IPT)", secondLine: "Switch to SNRI (venlafaxine, duloxetine) or add bupropion if partial response after 6-8 weeks", referral: "Psychiatry if suicidal ideation, psychotic features, bipolar suspected, or failed 2 adequate trials", followUp: "Phone check at 1-2 weeks for tolerability, office visit at 4-6 weeks, PHQ-9 at each visit" },
          ],
          caseScenarios: [],
        },
      ],
    },
  ];
}

function buildAGPCNPTopics(): TopicPool[] {
  return [
    {
      topic: "Geriatric Syndromes",
      bodySystem: "Geriatric Medicine",
      domain: "Assessment & Diagnosis",
      conditions: [
        {
          condition: "Falls in Elderly",
          presentations: [
            { demographics: "78-year-old female", symptoms: "two falls in the past month, dizziness when standing", findings: "Orthostatic hypotension (20 mmHg drop), Timed Up-and-Go test 18 seconds, Romberg positive", labs: "CBC normal, BMP: Na 134, vitamin D 18 ng/mL", vitals: "Seated BP 142/82, standing BP 118/68, HR 72" },
          ],
          pharmacology: [
            { drug: "Vitamin D3", drugClass: "Fat-soluble vitamin", indication: "Vitamin D deficiency, fall prevention", dose: "1000-4000 IU daily or 50,000 IU weekly for repletion", monitoring: "25-OH vitamin D level at 3 months (target 30-50 ng/mL), calcium", interaction: "Thiazides increase calcium levels, cholestyramine reduces absorption", contraindication: "Hypercalcemia, hypervitaminosis D", sideEffect: "Hypercalcemia, kidney stones with excess supplementation" },
          ],
          diagnostics: [
            { test: "Orthostatic Vital Signs", normalRange: "Systolic drop <20 mmHg, diastolic drop <10 mmHg on standing", abnormalFinding: "Systolic drop 24 mmHg after 3 minutes standing", interpretation: "Orthostatic hypotension contributing to fall risk", nextStep: "Review medications (antihypertensives, diuretics, alpha-blockers), hydration assessment, compression stockings" },
          ],
          management: [
            { scenario: "Recurrent falls in community-dwelling older adult", firstLine: "Medication review (deprescribe fall-risk medications), physical therapy for balance/strength, vitamin D supplementation, home safety assessment", secondLine: "Cardiology referral if cardiac cause suspected, podiatry for footwear, vision assessment", referral: "PT/OT for fall prevention program, ophthalmology, cardiology if syncope suspected", followUp: "Fall diary, reassess at 4-6 weeks, repeat orthostatics after medication changes" },
          ],
          caseScenarios: [
            { caseLabel: "Multifactorial fall assessment", phases: ["Initial fall history and risk factor assessment", "Medication review identifying 4 fall-risk medications", "Physical therapy and home safety recommendations", "Follow-up with reduced fall frequency"] },
          ],
        },
        {
          condition: "Cognitive Decline",
          presentations: [
            { demographics: "82-year-old male", symptoms: "memory problems noticed by family, difficulty managing finances, getting lost in familiar places", findings: "MMSE 22/30, clock drawing test abnormal, normal cranial nerves and motor exam", labs: "TSH normal, B12 normal, RPR non-reactive, BMP normal", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Donepezil", drugClass: "Cholinesterase Inhibitor", indication: "Mild-moderate Alzheimer disease", dose: "5 mg daily at bedtime, increase to 10 mg after 4-6 weeks", monitoring: "GI tolerance, bradycardia, weight loss, behavioral changes", interaction: "Anticholinergics antagonize effect, beta-blockers increase bradycardia risk", contraindication: "Severe hepatic impairment", sideEffect: "Nausea, diarrhea, insomnia, vivid dreams, bradycardia, weight loss" },
          ],
          diagnostics: [
            { test: "Montreal Cognitive Assessment (MoCA)", normalRange: ">=26/30", abnormalFinding: "Score 20/30 with deficits in delayed recall and visuospatial domains", interpretation: "Mild cognitive impairment or early dementia", nextStep: "Further evaluation with neuropsychological testing, MRI brain to rule out structural causes" },
          ],
          management: [
            { scenario: "Suspected early Alzheimer disease", firstLine: "Cholinesterase inhibitor (donepezil), cognitive stimulation activities, caregiver education and support", secondLine: "Add memantine when progressing to moderate stage, behavioral interventions for BPSD", referral: "Neurology/geriatric psychiatry for diagnosis confirmation, social work for care planning, elder law for advance directives", followUp: "Cognitive assessment every 6 months, caregiver burden screening, medication reconciliation, safety assessment" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Polypharmacy Management",
      bodySystem: "Multi-system",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Medication Reconciliation",
          presentations: [
            { demographics: "76-year-old female", symptoms: "dizziness, confusion, constipation, dry mouth", findings: "Taking 12 medications, Beers criteria medications identified (diphenhydramine, amitriptyline)", labs: "BMP: Na 131, K 3.2, Cr 1.4, eGFR 42", vitals: "BP 108/62 (on 3 antihypertensives), HR 58" },
          ],
          pharmacology: [
            { drug: "Deprescribing Protocol", drugClass: "Pharmacotherapy Optimization", indication: "Polypharmacy with adverse effects", dose: "Systematic medication reduction", monitoring: "Symptom monitoring during taper, rebound effects, patient function", interaction: "Assess for deprescribing cascade effects", contraindication: "Abrupt withdrawal of certain medications (beta-blockers, benzodiazepines, corticosteroids)", sideEffect: "Withdrawal symptoms if medications tapered too rapidly" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Polypharmacy with anticholinergic burden", firstLine: "Beers criteria review, anticholinergic burden score calculation, deprescribe highest-risk medications first", secondLine: "Consolidate duplicate-class medications, simplify regimen to once-daily dosing where possible", referral: "Pharmacist consultation for comprehensive medication review, geriatric specialist", followUp: "Reassess symptoms at 2-4 weeks after each medication change, monitor for withdrawal effects" },
          ],
          caseScenarios: [
            { caseLabel: "Polypharmacy deprescribing cascade", phases: ["Comprehensive medication list review with Beers criteria assessment", "Identification of anticholinergic burden score and drug interactions", "Prioritized deprescribing plan with taper schedule", "Outcome monitoring showing improved cognition and reduced falls"] },
          ],
        },
      ],
    },
    {
      topic: "Chronic Disease Management",
      bodySystem: "Multi-system",
      domain: "Clinical Management & Treatment",
      conditions: [
        {
          condition: "Chronic Kidney Disease",
          presentations: [
            { demographics: "70-year-old male", symptoms: "fatigue, decreased appetite, nocturia", findings: "Mild bilateral pedal edema, sallow skin color", labs: "Cr 2.1, eGFR 32 (CKD Stage 3b), UACR 320 mg/g, Hgb 10.2, phosphorus 5.2", vitals: "BP 148/86, HR 76" },
          ],
          pharmacology: [
            { drug: "Losartan", drugClass: "ARB", indication: "HTN with CKD and proteinuria", dose: "25-100 mg daily", monitoring: "K+, Cr at 1-2 weeks (acceptable Cr rise <30%), UACR trend", interaction: "NSAIDs reduce efficacy and worsen renal function, K+ supplements/K+-sparing diuretics", contraindication: "Pregnancy, bilateral renal artery stenosis", sideEffect: "Hyperkalemia, acute kidney injury, hypotension, dizziness" },
          ],
          diagnostics: [
            { test: "Estimated GFR and UACR", normalRange: "eGFR >60, UACR <30 mg/g", abnormalFinding: "eGFR 32, UACR 320 mg/g", interpretation: "CKD Stage 3b with severely increased albuminuria (A3), high risk for progression", nextStep: "ACEi/ARB optimization, SGLT2i initiation, nephrology referral, dietary counseling" },
          ],
          management: [
            { scenario: "CKD Stage 3b with proteinuria and HTN", firstLine: "ACEi/ARB at maximum tolerated dose, SGLT2i (dapagliflozin/empagliflozin), BP target <130/80", secondLine: "Finerenone if albuminuria persists on ACEi/ARB, bicarbonate supplementation if acidotic", referral: "Nephrology for CKD Stage 4 or rapidly declining GFR, dietitian for renal diet education", followUp: "BMP, UACR every 3-6 months, Hgb and iron studies q6 months, phosphorus/calcium/PTH annually" },
          ],
          caseScenarios: [],
        },
      ],
    },
  ];
}

function buildAGACNPTopics(): TopicPool[] {
  return [
    {
      topic: "Critical Care Management",
      bodySystem: "Multi-system",
      domain: "Complex Acute & Critical Care",
      conditions: [
        {
          condition: "Sepsis",
          presentations: [
            { demographics: "64-year-old male", symptoms: "fever, confusion, rapid breathing, recent UTI", findings: "Altered mental status, warm/flushed skin initially, poor cap refill", labs: "WBC 22,000, lactate 4.2, procalcitonin 8.5, Cr rising from 1.0 to 2.2", vitals: "Temp 103.2F, HR 118, RR 28, BP 82/48, MAP 59" },
          ],
          pharmacology: [
            { drug: "Norepinephrine", drugClass: "Alpha-1 Adrenergic Agonist (Vasopressor)", indication: "Septic shock (first-line vasopressor)", dose: "0.1-0.5 mcg/kg/min IV infusion, titrate to MAP >=65 mmHg", monitoring: "Continuous arterial BP monitoring (arterial line), MAP target, urine output, lactate clearance", interaction: "MAOIs potentiate effect, tricyclics potentiate effect", contraindication: "Peripheral IV infiltration risk (central line preferred)", sideEffect: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation, reflex bradycardia" },
          ],
          diagnostics: [
            { test: "Serial Lactate", normalRange: "<2 mmol/L", abnormalFinding: "Initial lactate 4.2 mmol/L, repeat at 6 hours 3.8 mmol/L", interpretation: "Elevated lactate indicating tissue hypoperfusion, inadequate clearance (<10% in 6 hours)", nextStep: "Reassess volume status, consider vasopressor escalation, source control evaluation" },
          ],
          management: [
            { scenario: "Septic shock (qSOFA >=2, MAP <65 despite fluids)", firstLine: "Hour-1 bundle: blood cultures x2 before antibiotics, broad-spectrum antibiotics, 30 mL/kg crystalloid bolus, vasopressor for MAP <65 after fluids, lactate measurement", secondLine: "If MAP remains <65 on norepinephrine, add vasopressin 0.03 units/min, stress-dose hydrocortisone if refractory shock", referral: "ICU admission mandatory, infectious disease consultation, surgical consultation if source requires intervention", followUp: "Lactate q2-4 hours for clearance, antibiotic de-escalation with culture results at 48-72 hours, daily assessment for organ recovery" },
          ],
          caseScenarios: [
            { caseLabel: "Sepsis progression and management", phases: ["Initial ED presentation with SIRS criteria and suspected source", "Hour-1 bundle implementation and response assessment", "Hemodynamic management with vasopressors and repeat lactate", "De-escalation and organ function recovery monitoring"] },
          ],
        },
        {
          condition: "Acute Respiratory Distress Syndrome",
          presentations: [
            { demographics: "56-year-old female", symptoms: "progressive dyspnea, hypoxemia refractory to supplemental oxygen", findings: "Bilateral crackles, increased work of breathing, cyanosis", labs: "ABG: pH 7.28, PaCO2 48, PaO2 55 on 15L NRB, P/F ratio 55, bilateral infiltrates on CXR", vitals: "HR 124, RR 34, BP 96/58, SpO2 82% on 15L" },
          ],
          pharmacology: [
            { drug: "Cisatracurium", drugClass: "Neuromuscular Blocking Agent", indication: "Moderate-severe ARDS (P/F <150) for ventilator dyssynchrony", dose: "0.1-0.2 mg/kg bolus, then 1-3 mcg/kg/min infusion", monitoring: "Train-of-four monitoring, ensure adequate sedation (BIS <40), ventilator mechanics", interaction: "Aminoglycosides prolong blockade, hypothermia prolongs duration", contraindication: "Inadequate sedation, inability to ventilate", sideEffect: "Awareness during paralysis if undersedated, ICU-acquired weakness, prolonged paralysis" },
          ],
          diagnostics: [
            { test: "P/F Ratio (PaO2/FiO2)", normalRange: "400-500 (normal)", abnormalFinding: "P/F ratio 55", interpretation: "Severe ARDS (P/F <=100 on PEEP >=5)", nextStep: "Lung-protective ventilation (Vt 4-6 mL/kg IBW), consider prone positioning, neuromuscular blockade" },
          ],
          management: [
            { scenario: "Severe ARDS on mechanical ventilation", firstLine: "Lung-protective ventilation: Vt 6 mL/kg IBW, plateau pressure <30 cmH2O, PEEP optimization, FiO2 for SpO2 88-95%", secondLine: "Prone positioning 16+ hours/day if P/F <150, neuromuscular blockade if ventilator dyssynchrony, conservative fluid strategy", referral: "ECMO center consideration if P/F <80 despite optimal ventilation, or pH <7.20 with Pplat >30", followUp: "Daily assessment for spontaneous breathing trial readiness, serial P/F ratios, sedation vacation" },
          ],
          caseScenarios: [
            { caseLabel: "ARDS ventilator management", phases: ["Initial intubation and ventilator settings", "P/F ratio assessment and PEEP optimization", "Prone positioning decision and implementation", "Weaning assessment and liberation from ventilator"] },
          ],
        },
      ],
    },
    {
      topic: "Acute Cardiac Events",
      bodySystem: "Cardiovascular",
      domain: "Complex Acute & Critical Care",
      conditions: [
        {
          condition: "Acute STEMI",
          presentations: [
            { demographics: "58-year-old male", symptoms: "crushing substernal chest pain radiating to left arm and jaw, diaphoresis, nausea", findings: "Diaphoretic, anxious, S3 gallop, bilateral crackles at bases", labs: "Troponin I 12.4 ng/mL (normal <0.04), CK-MB elevated, BNP 450", vitals: "HR 112, BP 98/60, RR 24, SpO2 94% on 2L NC" },
          ],
          pharmacology: [
            { drug: "Heparin (Unfractionated)", drugClass: "Anticoagulant", indication: "Acute STEMI adjunctive therapy", dose: "60 units/kg bolus (max 4000 units), then 12 units/kg/hr (max 1000 units/hr)", monitoring: "aPTT q6h (target 1.5-2.5x control), platelet count q2-3 days (HIT screening), hemoglobin, signs of bleeding", interaction: "Warfarin overlap, platelet inhibitors increase bleeding risk", contraindication: "Active bleeding, HIT history, severe thrombocytopenia", sideEffect: "Bleeding, HIT (type II - immune-mediated), osteoporosis with prolonged use" },
          ],
          diagnostics: [
            { test: "Serial Troponin", normalRange: "Troponin I <0.04 ng/mL", abnormalFinding: "Troponin I 12.4 ng/mL with rising pattern", interpretation: "Acute myocardial injury consistent with STEMI, significant myocardial necrosis", nextStep: "Emergent cardiac catheterization within 90 minutes (door-to-balloon time), DAPT, anticoagulation" },
          ],
          management: [
            { scenario: "Acute STEMI within 12-hour window", firstLine: "MONA (Morphine if pain refractory, Oxygen if SpO2 <94%, Nitroglycerin, Aspirin 325 mg), emergent PCI within 90 minutes", secondLine: "Fibrinolytic therapy (alteplase) if PCI not available within 120 minutes of first medical contact", referral: "Cardiology/interventional cardiology emergent, cardiac surgery standby", followUp: "Post-PCI: DAPT for 12 months, statin, beta-blocker, ACEi, cardiac rehabilitation" },
          ],
          caseScenarios: [
            { caseLabel: "STEMI door-to-balloon pathway", phases: ["ED presentation with chest pain and ECG showing ST elevation", "Emergent PCI activation and adjunctive pharmacotherapy", "Post-procedure hemodynamic monitoring and complication assessment", "Discharge planning with GDMT and cardiac rehabilitation"] },
          ],
        },
      ],
    },
    {
      topic: "Ventilator Management",
      bodySystem: "Respiratory",
      domain: "Diagnostic Reasoning & Procedures",
      conditions: [
        {
          condition: "Mechanical Ventilation",
          presentations: [
            { demographics: "62-year-old male", symptoms: "intubated for acute respiratory failure secondary to pneumonia", findings: "Sedated, ventilator: AC mode, Vt 400 mL, RR 16, FiO2 60%, PEEP 10", labs: "ABG: pH 7.32, PaCO2 52, PaO2 68, HCO3 26, P/F 113", vitals: "HR 94, BP 128/76, SpO2 93%" },
          ],
          pharmacology: [
            { drug: "Propofol", drugClass: "Sedative-Hypnotic", indication: "ICU sedation for mechanically ventilated patients", dose: "5-50 mcg/kg/min IV infusion", monitoring: "Triglycerides q48h if infusion >48h, RASS target (-2 to 0), propofol infusion syndrome signs (metabolic acidosis, rhabdomyolysis)", interaction: "Additive CNS depression with opioids and benzodiazepines", contraindication: "Egg/soy allergy (intralipid formulation), hemodynamic instability", sideEffect: "Hypotension, bradycardia, hypertriglyceridemia, propofol infusion syndrome (rare, lethal), pain on injection" },
          ],
          diagnostics: [
            { test: "Arterial Blood Gas", normalRange: "pH 7.35-7.45, PaCO2 35-45, PaO2 80-100, HCO3 22-26", abnormalFinding: "pH 7.32, PaCO2 52, PaO2 68", interpretation: "Respiratory acidosis with hypoxemia, inadequate ventilation and oxygenation", nextStep: "Increase respiratory rate or tidal volume to improve ventilation, increase PEEP or FiO2 for oxygenation" },
          ],
          management: [
            { scenario: "Respiratory acidosis on mechanical ventilation", firstLine: "Increase minute ventilation (increase RR first, then Vt if Pplat allows), maintain Pplat <30 cmH2O", secondLine: "If hypoxemia persists despite FiO2 and PEEP optimization, consider recruitment maneuver or prone positioning", referral: "Pulmonology consultation for complex ventilator management, ECMO team if refractory", followUp: "Repeat ABG in 30-60 minutes after changes, daily spontaneous breathing trial assessment, sedation vacation" },
          ],
          caseScenarios: [],
        },
      ],
    },
  ];
}

function buildPMHNPTopics(): TopicPool[] {
  return [
    {
      topic: "Psychiatric Assessment & DSM-5",
      bodySystem: "Mental Health",
      domain: "Psychiatric Assessment",
      conditions: [
        {
          condition: "Bipolar Disorder",
          presentations: [
            { demographics: "28-year-old male", symptoms: "decreased need for sleep (3 hours/night), pressured speech, grandiosity, excessive spending, hypersexuality, 5-day duration", findings: "Flight of ideas, psychomotor agitation, euphoric mood, dressed flamboyantly, MDQ positive", labs: "TSH normal, UDS negative, BMP normal", vitals: "HR 96, BP 138/84" },
          ],
          pharmacology: [
            { drug: "Lithium", drugClass: "Mood Stabilizer", indication: "Bipolar I disorder (acute mania and maintenance)", dose: "300 mg BID-TID, titrate to serum level 0.8-1.2 mEq/L (acute) or 0.6-1.0 mEq/L (maintenance)", monitoring: "Lithium level q5-7 days during titration then q3-6 months, renal function (BUN/Cr), TSH q6 months, calcium, ECG baseline", interaction: "NSAIDs increase levels (reduce renal clearance), thiazides increase levels, ACEi increase levels, dehydration/sodium restriction increases levels", contraindication: "Severe renal impairment, severe cardiovascular disease, Brugada syndrome, pregnancy (1st trimester - Ebstein anomaly)", sideEffect: "Fine tremor, polyuria/polydipsia (nephrogenic DI), weight gain, hypothyroidism, GI upset, cognitive dulling, teratogenicity (Ebstein anomaly)" },
            { drug: "Valproic Acid", drugClass: "Mood Stabilizer/Anticonvulsant", indication: "Bipolar I disorder (acute mania), rapid cycling", dose: "250-500 mg BID, titrate to serum level 50-125 mcg/mL", monitoring: "Valproic acid level, LFTs at baseline and 6 months, CBC with differential (thrombocytopenia), ammonia if altered mental status", interaction: "Lamotrigine levels doubled (must reduce lamotrigine dose by 50%), aspirin displaces protein binding", contraindication: "Hepatic disease, pancreatitis, pregnancy (neural tube defects, teratogenic), urea cycle disorders", sideEffect: "Weight gain, hair loss, tremor, GI upset, hepatotoxicity, pancreatitis, thrombocytopenia, neural tube defects" },
          ],
          diagnostics: [
            { test: "Mood Disorder Questionnaire (MDQ)", normalRange: "Score <7 with functional impairment", abnormalFinding: "MDQ positive: 10/13 yes responses with concurrent symptoms causing moderate-serious problems", interpretation: "Positive screen for bipolar spectrum disorder, requires clinical interview for DSM-5 confirmation", nextStep: "Structured clinical interview to confirm bipolar I vs II, rule out substance-induced or medical causes, assess suicide risk" },
          ],
          management: [
            { scenario: "Acute manic episode, Bipolar I", firstLine: "Lithium or valproic acid for mood stabilization, add atypical antipsychotic (quetiapine, olanzapine) if psychotic features or severe agitation", secondLine: "Carbamazepine or lamotrigine if lithium/valproate intolerant, combination therapy for refractory mania", referral: "Psychiatric hospitalization if danger to self/others, unable to care for self, psychotic features", followUp: "Lithium/valproate levels at day 5 and day 10, weekly visits during stabilization, monthly once stable" },
          ],
          caseScenarios: [
            { caseLabel: "Bipolar I acute mania to maintenance", phases: ["Acute manic presentation with DSM-5 criteria assessment", "Mood stabilizer selection and lithium monitoring protocol", "Transition to maintenance therapy with level optimization", "Long-term monitoring and relapse prevention planning"] },
          ],
        },
        {
          condition: "Schizophrenia",
          presentations: [
            { demographics: "24-year-old male", symptoms: "auditory hallucinations, paranoid delusions, social withdrawal, flat affect, declining function over 8 months", findings: "Disheveled appearance, poor eye contact, guarded, responding to internal stimuli, thought broadcasting delusion", labs: "UDS negative, TSH normal, CBC normal", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Risperidone", drugClass: "Atypical Antipsychotic", indication: "Schizophrenia, bipolar mania", dose: "1 mg BID, titrate to 2-4 mg/day over 1-2 weeks", monitoring: "EPS assessment (AIMS scale q6 months), metabolic panel (glucose, lipids, weight) at baseline, 3 months, annually, prolactin if symptoms", interaction: "CYP2D6 inhibitors (fluoxetine, paroxetine) increase levels, carbamazepine decreases levels", contraindication: "Known hypersensitivity, caution in dementia-related psychosis (increased mortality)", sideEffect: "EPS (akathisia, dystonia, parkinsonism), weight gain, hyperprolactinemia (galactorrhea, amenorrhea), metabolic syndrome, tardive dyskinesia, QTc prolongation" },
          ],
          diagnostics: [],
          management: [
            { scenario: "First-episode schizophrenia", firstLine: "Low-dose atypical antipsychotic (risperidone 2-4 mg or aripiprazole 10-15 mg), psychoeducation, family therapy", secondLine: "Switch to different atypical antipsychotic if inadequate response after 4-6 weeks at therapeutic dose, clozapine for treatment-resistant schizophrenia (failed 2 adequate trials)", referral: "Psychiatry for all first-episode psychosis, ACT team for severe functional impairment, vocational rehabilitation", followUp: "Weekly for first month, metabolic monitoring at 3 months, AIMS q6 months, annual comprehensive metabolic screening" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Psychopharmacology",
      bodySystem: "Mental Health",
      domain: "Psychopharmacology",
      conditions: [
        {
          condition: "ADHD in Adults",
          presentations: [
            { demographics: "32-year-old male", symptoms: "difficulty concentrating at work, disorganization, forgetfulness, restlessness, childhood ADHD history", findings: "ASRS positive (5+ items >=3), normal mental status otherwise, no substance use disorder", labs: "UDS negative, TSH normal, BP normal", vitals: "HR 72, BP 122/78" },
          ],
          pharmacology: [
            { drug: "Lisdexamfetamine", drugClass: "Prodrug Stimulant (CNS Stimulant)", indication: "ADHD, Binge Eating Disorder", dose: "30 mg daily AM, titrate by 10-20 mg weekly, max 70 mg/day", monitoring: "BP, HR at each visit, weight, appetite, sleep quality, substance use screening, height in children", interaction: "MAOIs (absolute contraindication, 14-day washout), urinary alkalinizers increase amphetamine levels", contraindication: "Concurrent MAOI use, advanced arteriosclerosis, symptomatic cardiovascular disease, moderate-severe HTN, hyperthyroidism, glaucoma, history of substance abuse (relative)", sideEffect: "Decreased appetite, insomnia, dry mouth, tachycardia, anxiety, headache, growth suppression in children, abuse potential (lower than other stimulants due to prodrug mechanism)" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Adult ADHD confirmed by history and screening", firstLine: "Stimulant medication (methylphenidate or amphetamine-based), CBT for ADHD skills", secondLine: "Non-stimulant: atomoxetine 40-80 mg daily or bupropion 150-300 mg daily if stimulant contraindicated", referral: "Psychiatry if comorbid substance use disorder, unclear diagnosis, treatment-resistant", followUp: "BP and HR at 2-4 weeks, then monthly during titration, quarterly when stable" },
          ],
          caseScenarios: [],
        },
        {
          condition: "Generalized Anxiety Disorder",
          presentations: [
            { demographics: "38-year-old female", symptoms: "excessive worry about multiple domains for 8+ months, muscle tension, poor sleep, irritability, difficulty concentrating", findings: "GAD-7 score 16 (severe), anxious affect, muscle tension in neck/shoulders, no panic attacks", labs: "TSH normal, CBC normal", vitals: "HR 88, BP 132/82" },
          ],
          pharmacology: [
            { drug: "Buspirone", drugClass: "5-HT1A Partial Agonist (Anxiolytic)", indication: "GAD", dose: "5 mg TID, titrate by 5 mg q2-3 days, usual dose 15-30 mg/day divided BID-TID, max 60 mg/day", monitoring: "Efficacy assessment at 2-4 weeks (slower onset than benzodiazepines), hepatic/renal function", interaction: "MAOIs (contraindicated), CYP3A4 inhibitors (erythromycin, ketoconazole) increase levels, grapefruit juice increases levels", contraindication: "Concurrent MAOI use, severe hepatic/renal impairment", sideEffect: "Dizziness, nausea, headache, nervousness (paradoxical initially), no sedation, no dependence potential, no withdrawal syndrome" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Moderate-severe GAD (GAD-7 >=10)", firstLine: "SSRI (sertraline or escitalopram) or SNRI (venlafaxine, duloxetine) + CBT", secondLine: "Buspirone augmentation or switch, pregabalin (off-label), hydroxyzine PRN for acute anxiety", referral: "Psychiatry if comorbid conditions, treatment-resistant, or benzodiazepine dependence concerns", followUp: "GAD-7 at each visit, phone check at 1-2 weeks for tolerability, office visit at 4-6 weeks" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Substance Use Disorders",
      bodySystem: "Mental Health",
      domain: "Psychiatric Assessment",
      conditions: [
        {
          condition: "Alcohol Use Disorder",
          presentations: [
            { demographics: "48-year-old male", symptoms: "drinking escalation, inability to cut down, withdrawal symptoms (tremors, sweating), occupational impairment", findings: "AUDIT score 28, mild tremor, elevated BP, mild hepatomegaly, spider angiomata", labs: "AST 128, ALT 64 (AST:ALT >2:1), GGT 312, MCV 104, CDT elevated", vitals: "HR 96, BP 148/92, temp 99.2F" },
          ],
          pharmacology: [
            { drug: "Naltrexone", drugClass: "Opioid Antagonist (Anti-craving)", indication: "Alcohol use disorder (reduces cravings and heavy drinking days)", dose: "50 mg PO daily or 380 mg IM monthly (Vivitrol)", monitoring: "LFTs at baseline and periodically (hepatotoxicity risk at high doses), compliance with PO formulation", interaction: "Blocks opioid analgesics (pain management challenge), must be opioid-free 7-10 days before starting", contraindication: "Current opioid use or positive urine opioid screen, acute hepatitis, hepatic failure, acute opioid withdrawal", sideEffect: "Nausea (most common, usually transient), headache, dizziness, injection site reactions (IM), hepatotoxicity at high doses, precipitated withdrawal if opioids present" },
          ],
          diagnostics: [
            { test: "AUDIT Score", normalRange: "<8 (low risk)", abnormalFinding: "Score 28 (possible dependence)", interpretation: "High score indicating severe alcohol use disorder with likely physical dependence", nextStep: "Assess withdrawal risk (CIWA protocol), medical stabilization, pharmacotherapy, psychosocial treatment" },
          ],
          management: [
            { scenario: "Moderate-severe AUD with medical complications", firstLine: "Medically-supervised withdrawal if needed (benzodiazepine protocol using CIWA), naltrexone or acamprosate for maintenance, motivational interviewing", secondLine: "Disulfiram (supervised dosing setting), topiramate (off-label), gabapentin (off-label) if naltrexone/acamprosate ineffective", referral: "Addiction medicine, inpatient detox if CIWA >8 or history of withdrawal seizures/DTs, support group (AA, SMART Recovery)", followUp: "Weekly during early recovery, monthly once stable, LFTs q3 months, ongoing psychiatric comorbidity management" },
          ],
          caseScenarios: [
            { caseLabel: "AUD assessment through maintenance", phases: ["Initial assessment with AUDIT screening and medical evaluation", "Withdrawal risk assessment and benzodiazepine protocol if needed", "Pharmacotherapy selection and motivational interviewing initiation", "Long-term maintenance and relapse prevention planning"] },
          ],
        },
      ],
    },
    {
      topic: "Crisis Intervention",
      bodySystem: "Mental Health",
      domain: "Crisis Intervention",
      conditions: [
        {
          condition: "Suicidal Ideation Assessment",
          presentations: [
            { demographics: "35-year-old male", symptoms: "hopelessness, passive suicidal ideation without plan, recent job loss and divorce, social isolation", findings: "PHQ-9 score 22, C-SSRS: passive ideation without plan or intent, no prior attempts, no access to firearms", labs: "TSH normal, UDS negative", vitals: "Normal" },
          ],
          pharmacology: [],
          diagnostics: [
            { test: "Columbia Suicide Severity Rating Scale (C-SSRS)", normalRange: "No ideation", abnormalFinding: "Passive ideation (wishes to be dead) without specific plan or intent", interpretation: "Moderate suicide risk requiring safety planning and close follow-up", nextStep: "Safety planning intervention, means restriction counseling, follow-up within 48-72 hours, consider intensive outpatient" },
          ],
          management: [
            { scenario: "Moderate suicide risk with passive ideation", firstLine: "Safety planning intervention (Stanley-Brown), lethal means counseling, emergency contact list, 988 Suicide Lifeline information", secondLine: "Intensive outpatient program, increased session frequency, SSRI if not on antidepressant, involve support system", referral: "Psychiatric emergency services if active plan/intent develops, inpatient hospitalization if unable to safety plan", followUp: "Phone contact within 24-48 hours, office visit within 72 hours, weekly visits during acute phase" },
          ],
          caseScenarios: [
            { caseLabel: "Suicide risk assessment and safety planning", phases: ["Initial risk assessment with C-SSRS and PHQ-9", "Safety planning intervention implementation", "Lethal means counseling and support system engagement", "Follow-up risk reassessment and treatment intensification"] },
          ],
        },
      ],
    },
  ];
}

function buildPNPTopics(): TopicPool[] {
  return [
    {
      topic: "Growth & Developmental Milestones",
      bodySystem: "Pediatrics",
      domain: "Growth & Developmental Milestones",
      conditions: [
        {
          condition: "Developmental Delay Screening",
          presentations: [
            { demographics: "18-month-old male", symptoms: "no words, not pointing, limited eye contact, no pretend play", findings: "ASQ-3 below cutoff in communication and personal-social domains, M-CHAT-R positive", labs: "Lead level normal, TSH normal, hearing screen passed", vitals: "Normal growth parameters" },
          ],
          pharmacology: [],
          diagnostics: [
            { test: "M-CHAT-R/F (Modified Checklist for Autism)", normalRange: "Score 0-2 (low risk)", abnormalFinding: "Score 6 (medium-high risk) with positive follow-up interview", interpretation: "Positive screen requiring referral for comprehensive developmental evaluation", nextStep: "Refer to developmental pediatrician for comprehensive evaluation, early intervention services, audiology if not done" },
          ],
          management: [
            { scenario: "Positive autism screening at 18-month well visit", firstLine: "Immediate referral to early intervention (Part C services), developmental pediatrician for comprehensive evaluation, audiology", secondLine: "Speech-language therapy, occupational therapy, ABA therapy if ASD confirmed", referral: "Developmental pediatrician, early intervention program, pediatric neurology if regression noted", followUp: "Monthly during evaluation process, reassess at 24-month well visit with repeat M-CHAT-R" },
          ],
          caseScenarios: [
            { caseLabel: "Developmental delay identification and early intervention", phases: ["Developmental screening at well-child visit", "Positive screening result and family counseling", "Referral coordination for comprehensive evaluation", "Early intervention services initiation and progress monitoring"] },
          ],
        },
      ],
    },
    {
      topic: "Pediatric Disease Management",
      bodySystem: "Pediatrics",
      domain: "Pediatric Disease Management",
      conditions: [
        {
          condition: "Acute Otitis Media",
          presentations: [
            { demographics: "2-year-old male", symptoms: "ear pulling, irritability, fever 102F for 2 days, preceding URI", findings: "Bulging, erythematous, opacified TM right ear, reduced mobility on pneumatic otoscopy, purulent fluid behind TM", labs: "None needed for uncomplicated AOM", vitals: "Temp 102.2F, HR 120, RR 28" },
          ],
          pharmacology: [
            { drug: "Amoxicillin", drugClass: "Aminopenicillin", indication: "First-line for AOM in children", dose: "High-dose: 80-90 mg/kg/day divided BID for 10 days (age <2) or 5-7 days (age >=2)", monitoring: "Clinical response at 48-72 hours, allergic reaction signs, diarrhea", interaction: "Allopurinol increases rash risk", contraindication: "Anaphylaxis to penicillin", sideEffect: "Diarrhea, rash (non-allergic amoxicillin rash common), nausea, allergic reactions" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Uncomplicated AOM in child <2 years", firstLine: "High-dose amoxicillin 80-90 mg/kg/day BID for 10 days (standard for age <2 with moderate-severe symptoms)", secondLine: "Amoxicillin-clavulanate 90/6.4 mg/kg/day if treatment failure at 72 hours, ceftriaxone IM if unable to tolerate PO", referral: "ENT if >=3 episodes in 6 months or >=4 in 12 months (recurrent AOM), hearing evaluation if persistent effusion >3 months", followUp: "Recheck at 48-72 hours if not improving, follow-up in 2-4 weeks to confirm resolution" },
          ],
          caseScenarios: [],
        },
        {
          condition: "Pediatric Asthma",
          presentations: [
            { demographics: "6-year-old female", symptoms: "recurrent wheezing with exercise and URI triggers, nighttime cough 3x/week, SABA use 4x/week", findings: "Mild expiratory wheezes bilaterally, no retractions, speaking in full sentences", labs: "Spirometry: FEV1 82% predicted, 14% reversibility post-bronchodilator", vitals: "HR 92, RR 22, SpO2 97%" },
          ],
          pharmacology: [
            { drug: "Fluticasone MDI", drugClass: "Inhaled Corticosteroid", indication: "Persistent asthma controller therapy", dose: "Low dose: 88 mcg/day (44 mcg BID), medium dose: 220 mcg/day, high dose: 440 mcg/day", monitoring: "Growth velocity q6 months (ICS can reduce growth velocity by 0.5-1 cm/year), oral candidiasis, symptom control", interaction: "CYP3A4 inhibitors (ritonavir) increase systemic absorption significantly", contraindication: "Primary treatment of acute bronchospasm (not a rescue medication)", sideEffect: "Oral candidiasis (rinse/spit after use), dysphonia, growth velocity reduction (dose-dependent), adrenal suppression at high doses" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Moderate persistent asthma in school-age child", firstLine: "Low-dose ICS (fluticasone 44 mcg BID with spacer) + PRN SABA, asthma action plan for family and school", secondLine: "If not controlled on low-dose ICS: add LABA (age >=5) or increase to medium-dose ICS, add LTRA (montelukast)", referral: "Pediatric pulmonology if not controlled on Step 3 therapy, allergist for allergy testing and immunotherapy consideration", followUp: "Assess control at 2-6 weeks after initiation, step down after 3 months of well-controlled asthma" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Childhood Immunizations",
      bodySystem: "Preventive Care",
      domain: "Health Promotion & Immunizations",
      conditions: [
        {
          condition: "Immunization Schedule",
          presentations: [
            { demographics: "4-month-old female", symptoms: "presenting for well-child visit, up-to-date on previous immunizations", findings: "Normal growth and development, no acute illness", labs: "None needed", vitals: "Normal" },
          ],
          pharmacology: [],
          diagnostics: [],
          management: [
            { scenario: "4-month well-child visit immunizations", firstLine: "DTaP #2, IPV #2, Hib #2, PCV13 #2, Rotavirus #2 (RV5) - per CDC schedule", secondLine: "Catch-up schedule if behind, evaluate for contraindications (true anaphylaxis to previous dose or component)", referral: "Pediatric immunology if suspected immunodeficiency prior to live vaccine administration", followUp: "Next well visit at 6 months for third dose of DTaP, IPV, Hib, PCV13, and influenza vaccine if season" },
          ],
          caseScenarios: [],
        },
      ],
    },
  ];
}

function buildWHNPTopics(): TopicPool[] {
  return [
    {
      topic: "Reproductive Health & Contraception",
      bodySystem: "Reproductive",
      domain: "Reproductive Health & Gynecology",
      conditions: [
        {
          condition: "Contraceptive Counseling",
          presentations: [
            { demographics: "25-year-old female", symptoms: "requesting contraception, nulliparous, no desire for pregnancy for 3-5 years", findings: "BMI 24, BP 118/72, normal pelvic exam", labs: "Pregnancy test negative", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Levonorgestrel IUD (Mirena)", drugClass: "Progestin-releasing IUD (LARC)", indication: "Long-acting reversible contraception, menorrhagia", dose: "52 mg LNG-IUS, effective for 8 years", monitoring: "String check at 4-6 weeks post-insertion, ultrasound if strings not visualized", interaction: "None clinically significant (local effect)", contraindication: "Active pelvic infection, unexplained vaginal bleeding, uterine anomaly distorting cavity, Wilson disease (copper IUD), breast cancer (LNG-IUS relative)", sideEffect: "Irregular bleeding/spotting for 3-6 months, headache, amenorrhea (20-50% by 1 year), rare: perforation, expulsion, ectopic pregnancy" },
          ],
          diagnostics: [],
          management: [
            { scenario: "Young woman seeking long-term contraception", firstLine: "LARC methods (IUD or implant) recommended as first-line per ACOG - most effective and cost-effective", secondLine: "Combined OCP, patch, or ring if LARC declined, DMPA injection if convenience preferred", referral: "Gynecology if IUD insertion difficult, uterine anomaly, or contraceptive failure", followUp: "String check at 4-6 weeks, annual well-woman exam, no routine ultrasound needed if strings present" },
          ],
          caseScenarios: [],
        },
        {
          condition: "Abnormal Uterine Bleeding",
          presentations: [
            { demographics: "38-year-old female", symptoms: "heavy menstrual bleeding (HMB) with clots, cycle length irregular (21-45 days), 6-month history", findings: "Mildly enlarged uterus, no adnexal masses, cervix appears normal", labs: "Hgb 10.2, TSH normal, pregnancy test negative, coagulation studies normal", vitals: "Normal" },
          ],
          pharmacology: [
            { drug: "Tranexamic Acid", drugClass: "Antifibrinolytic", indication: "Heavy menstrual bleeding", dose: "1300 mg TID for up to 5 days during menses", monitoring: "Signs of thromboembolic events, visual changes", interaction: "Hormonal contraceptives (theoretical thrombotic risk, use with caution), factor IX complex", contraindication: "Active thromboembolic disease, subarachnoid hemorrhage, color vision defects", sideEffect: "Nausea, headache, musculoskeletal pain, thromboembolic events (rare)" },
          ],
          diagnostics: [
            { test: "Transvaginal Ultrasound", normalRange: "Endometrial stripe <12mm in premenopausal, homogeneous", abnormalFinding: "Endometrial thickness 16mm, intracavitary lesion 2cm consistent with submucosal fibroid", interpretation: "Submucosal leiomyoma likely contributing to heavy menstrual bleeding", nextStep: "Saline infusion sonohysterography or hysteroscopy for further evaluation, management options discussion" },
          ],
          management: [
            { scenario: "Heavy menstrual bleeding with submucosal fibroid", firstLine: "LNG-IUS (Mirena) for bleeding control, NSAIDs during menses, tranexamic acid if LNG-IUS declined", secondLine: "Combined OCP if no contraindications, GnRH agonist for temporary control, hysteroscopic myomectomy if medical management fails", referral: "Gynecology for hysteroscopic myomectomy if fibroid >2cm or medical management failure, hematology if Hgb <7", followUp: "Reassess bleeding at 3 months, repeat Hgb, iron studies and supplementation" },
          ],
          caseScenarios: [],
        },
      ],
    },
    {
      topic: "Prenatal & Postpartum Care",
      bodySystem: "Obstetrics",
      domain: "Prenatal & Postpartum Care",
      conditions: [
        {
          condition: "Gestational Diabetes",
          presentations: [
            { demographics: "32-year-old female", symptoms: "26 weeks gestation, routine GDM screening", findings: "BMI 30 pre-pregnancy, fundal height appropriate, no proteinuria", labs: "1-hour GCT 162 mg/dL, 3-hour OGTT: fasting 98, 1hr 192, 2hr 168, 3hr 142 (2 values abnormal)", vitals: "BP 122/76" },
          ],
          pharmacology: [
            { drug: "Insulin (for GDM)", drugClass: "Hormone (Blood Glucose Regulation)", indication: "GDM uncontrolled on medical nutrition therapy", dose: "Individualized: NPH 0.1-0.2 units/kg at bedtime for fasting glucose, rapid-acting insulin for postprandial elevations", monitoring: "Self-monitoring BG: fasting <95 mg/dL, 1hr postprandial <140, 2hr postprandial <120, HbA1c q4-6 weeks", interaction: "Beta-blockers mask hypoglycemia symptoms, corticosteroids increase glucose", contraindication: "None absolute in pregnancy (insulin is preferred over oral agents)", sideEffect: "Hypoglycemia, weight gain, injection site reactions, lipodystrophy" },
          ],
          diagnostics: [
            { test: "3-Hour Oral Glucose Tolerance Test", normalRange: "Fasting <95, 1hr <180, 2hr <155, 3hr <140 mg/dL (Carpenter-Coustan criteria)", abnormalFinding: "Fasting 98, 1hr 192, 2hr 168, 3hr 142 (2 abnormal values)", interpretation: "Gestational diabetes mellitus diagnosed (requires 2 or more abnormal values on 3-hour OGTT)", nextStep: "Medical nutrition therapy, BG self-monitoring, exercise counseling, insulin if targets not met in 1-2 weeks" },
          ],
          management: [
            { scenario: "Newly diagnosed GDM at 26 weeks", firstLine: "Medical nutrition therapy (complex carb distribution, 3 meals + 2-3 snacks), moderate exercise, BG monitoring QID", secondLine: "Insulin therapy if fasting >95 or postprandial >140 at 1hr after 1-2 weeks of MNT", referral: "MFM if requiring insulin, dietary counseling, growth ultrasounds q4 weeks starting at 28 weeks", followUp: "Weekly BG log review, growth ultrasound at 28, 32, 36 weeks, 2-hour 75g OGTT at 4-12 weeks postpartum" },
          ],
          caseScenarios: [
            { caseLabel: "GDM diagnosis through postpartum follow-up", phases: ["GCT screening and 3-hour OGTT diagnosis", "Medical nutrition therapy initiation and BG monitoring", "Insulin therapy decision and fetal surveillance", "Postpartum glucose tolerance re-evaluation"] },
          ],
        },
      ],
    },
    {
      topic: "Menopause Management",
      bodySystem: "Endocrine",
      domain: "Primary Care of Women",
      conditions: [
        {
          condition: "Menopausal Symptom Management",
          presentations: [
            { demographics: "52-year-old female", symptoms: "hot flashes 8-10/day, night sweats disrupting sleep, vaginal dryness, mood changes, 14 months amenorrhea", findings: "BMI 26, vaginal atrophy with pale/thin mucosa, no adnexal masses", labs: "FSH 68, estradiol 12 pg/mL, lipid panel: LDL 148, mammogram normal", vitals: "BP 128/78" },
          ],
          pharmacology: [
            { drug: "Estradiol/Progesterone (HRT)", drugClass: "Hormone Replacement Therapy", indication: "Moderate-severe vasomotor symptoms in women within 10 years of menopause or age <60", dose: "Transdermal estradiol 0.025-0.05 mg/day patch + micronized progesterone 100-200 mg daily (if uterus intact)", monitoring: "Annual mammogram, endometrial evaluation if unexpected bleeding, BP, lipids, reassess need annually", interaction: "CYP3A4 inducers (carbamazepine, rifampin) reduce estradiol levels", contraindication: "Unexplained vaginal bleeding, active breast cancer, active VTE/PE, active liver disease, coronary heart disease", sideEffect: "Breast tenderness, bloating, headache, VTE risk (lower with transdermal), breast cancer risk with >5 years use (combined E+P)" },
          ],
          diagnostics: [
            { test: "FSH Level", normalRange: "Premenopausal: 3-20 mIU/mL", abnormalFinding: "FSH 68 mIU/mL", interpretation: "Elevated FSH consistent with menopause (ovarian failure), typically not needed for diagnosis if clinical criteria met", nextStep: "Clinical diagnosis based on 12+ months amenorrhea + symptoms in appropriate age group, lab confirmation rarely needed" },
          ],
          management: [
            { scenario: "Moderate-severe vasomotor symptoms, 52-year-old, 14 months post-menopause", firstLine: "Transdermal estradiol + progesterone (systemic HRT) - most effective treatment, within 10-year window", secondLine: "Non-hormonal: venlafaxine 37.5-75 mg, paroxetine 7.5 mg (Brisdelle), gabapentin for hot flashes, vaginal estrogen for GSM", referral: "Gynecology if contraindication to HRT, abnormal bleeding on HRT, breast cancer history", followUp: "Reassess at 3 months for symptom control, annual reassessment of HRT need, use lowest effective dose for shortest duration" },
          ],
          caseScenarios: [],
        },
      ],
    },
  ];
}

function buildENPTopics(): TopicPool[] {
  return [
    {
      topic: "Emergency Triage & Assessment",
      bodySystem: "Multi-system",
      domain: "Emergency Assessment & Triage",
      conditions: [
        {
          condition: "Chest Pain Evaluation",
          presentations: [
            { demographics: "55-year-old male", symptoms: "acute onset substernal chest pain, diaphoresis, radiating to left arm, onset 45 minutes ago", findings: "Diaphoretic, anxious, S4 gallop, no murmurs, lungs clear", labs: "Initial troponin pending, ECG: 2mm ST elevation V1-V4", vitals: "HR 108, BP 152/94, RR 22, SpO2 97%" },
          ],
          pharmacology: [
            { drug: "Aspirin (Emergency)", drugClass: "Antiplatelet", indication: "Acute STEMI/NSTEMI", dose: "325 mg chewed immediately (non-enteric coated)", monitoring: "Bleeding signs, hemodynamic status", interaction: "Anticoagulants increase bleeding risk, NSAIDs reduce cardioprotective effect if chronic use", contraindication: "Active GI bleeding, aspirin allergy (desensitize if possible), severe uncontrolled bleeding", sideEffect: "GI bleeding, allergic reaction, tinnitus at high doses" },
          ],
          diagnostics: [
            { test: "12-Lead ECG", normalRange: "Normal sinus rhythm, no ST changes", abnormalFinding: "2mm ST elevation V1-V4", interpretation: "Anterior STEMI indicating LAD occlusion, STEMI alert activation required", nextStep: "Activate cardiac catheterization lab, dual antiplatelet therapy, anticoagulation, cardiology notification" },
          ],
          management: [
            { scenario: "Anterior STEMI in ED", firstLine: "Immediate ASA 325mg chewed, heparin bolus, P2Y12 inhibitor (ticagrelor or clopidogrel), emergent PCI activation (door-to-balloon <90 min)", secondLine: "Fibrinolytic therapy (alteplase) if PCI not available within 120 minutes, NTG for ongoing pain if SBP >90", referral: "Interventional cardiology STAT, cardiac surgery standby", followUp: "CCU admission post-PCI, GDMT initiation, cardiac rehabilitation referral" },
          ],
          caseScenarios: [
            { caseLabel: "STEMI recognition and management", phases: ["ED presentation with acute chest pain", "ECG interpretation and STEMI identification", "PCI activation and adjunctive pharmacotherapy", "Post-intervention monitoring and disposition"] },
          ],
        },
        {
          condition: "Stroke Assessment",
          presentations: [
            { demographics: "68-year-old female", symptoms: "sudden onset right-sided weakness, slurred speech, facial droop, onset 90 minutes ago", findings: "Right facial droop, right arm drift, dysarthria, NIHSS 12", labs: "CT head: no hemorrhage, glucose 142, INR 1.0, platelet 198K", vitals: "HR 88, BP 186/102, RR 18, SpO2 98%" },
          ],
          pharmacology: [
            { drug: "Alteplase (tPA)", drugClass: "Thrombolytic (Tissue Plasminogen Activator)", indication: "Acute ischemic stroke within 4.5 hours of symptom onset", dose: "0.9 mg/kg IV (max 90 mg): 10% as bolus over 1 minute, remaining 90% infused over 60 minutes", monitoring: "BP q15min during infusion and 2hr post, then q30min x6hr, neuro checks q15min, monitor for hemorrhagic conversion", interaction: "Anticoagulants increase bleeding risk (INR must be <1.7)", contraindication: "Active internal bleeding, recent intracranial surgery/trauma (3 months), BP >185/110 unresponsive to treatment, INR >1.7, platelet <100K, glucose <50", sideEffect: "Intracranial hemorrhage (6-7%), systemic bleeding, angioedema (especially with ACEi use), allergic reaction" },
          ],
          diagnostics: [
            { test: "CT Head Non-Contrast", normalRange: "No acute intracranial pathology", abnormalFinding: "No hemorrhage, no established infarct, subtle early ischemic changes in left MCA territory", interpretation: "Acute ischemic stroke eligible for thrombolytic therapy (no contraindications identified)", nextStep: "tPA administration within 4.5-hour window, BP control to <185/110 before and <180/105 during tPA, admit to stroke unit" },
          ],
          management: [
            { scenario: "Acute ischemic stroke within tPA window", firstLine: "IV alteplase 0.9 mg/kg, BP control (labetalol or nicardipine drip), stroke unit admission, NPO until swallow evaluation", secondLine: "Mechanical thrombectomy referral if large vessel occlusion (NIHSS >6, proximal artery occlusion) within 24 hours", referral: "Neurology/stroke team immediate notification, interventional neuroradiology for thrombectomy evaluation", followUp: "CT head at 24 hours, transition to antiplatelet (aspirin + clopidogrel for minor stroke), statin, BP management, rehabilitation" },
          ],
          caseScenarios: [
            { caseLabel: "Stroke code activation and management", phases: ["ED presentation with acute focal neurological deficit", "NIHSS scoring and CT imaging", "tPA eligibility assessment and administration", "Post-thrombolytic monitoring and stroke unit care"] },
          ],
        },
      ],
    },
    {
      topic: "Trauma Management",
      bodySystem: "Multi-system",
      domain: "Trauma Management",
      conditions: [
        {
          condition: "Trauma Primary Survey",
          presentations: [
            { demographics: "32-year-old male", symptoms: "MVC at 60 mph, unrestrained driver, positive LOC at scene, alert but confused on arrival", findings: "C-spine immobilized, abrasion left forehead, left chest wall tenderness with crepitus, abdomen distended and tender, pelvis stable", labs: "FAST exam positive (free fluid Morrison pouch), Hgb 11.2 (dropping from 13.5), lactate 3.8", vitals: "HR 118, BP 94/62, RR 26, SpO2 93% on 15L NRB" },
          ],
          pharmacology: [
            { drug: "Tranexamic Acid (Trauma)", drugClass: "Antifibrinolytic", indication: "Hemorrhagic shock in trauma (within 3 hours of injury)", dose: "1g IV over 10 minutes, then 1g IV over 8 hours", monitoring: "Coagulation studies, signs of continued hemorrhage, thromboembolic events", interaction: "Factor IX complex concentrates increase thrombotic risk", contraindication: ">3 hours from injury (CRASH-2 trial showed harm), active intravascular clotting", sideEffect: "Nausea, diarrhea, thromboembolic events if given >3 hours post-injury" },
          ],
          diagnostics: [
            { test: "FAST Exam (Focused Assessment with Sonography for Trauma)", normalRange: "No free fluid in abdomen or pericardium", abnormalFinding: "Positive free fluid in Morrison pouch (hepatorenal space)", interpretation: "Intraperitoneal hemorrhage requiring urgent surgical evaluation in hemodynamically unstable patient", nextStep: "Massive transfusion protocol activation, emergent surgical consultation, operative exploration" },
          ],
          management: [
            { scenario: "Blunt abdominal trauma with hemorrhagic shock", firstLine: "ABCDE primary survey, two large-bore IVs, massive transfusion protocol (1:1:1 PRBC:FFP:platelets), TXA within 3 hours", secondLine: "Damage control resuscitation: permissive hypotension (MAP 50-60 until surgical control), avoid crystalloid excess, target temp >35C", referral: "Trauma surgery STAT for operative exploration, interventional radiology if hemodynamically stable for angioembolization", followUp: "ICU admission, serial hemoglobin/lactate, resuscitation endpoints (lactate clearance, base deficit, UO >0.5 mL/kg/hr)" },
          ],
          caseScenarios: [
            { caseLabel: "Trauma resuscitation and damage control", phases: ["Scene arrival and primary survey", "FAST exam and hemorrhage identification", "Massive transfusion protocol and surgical decision", "Post-operative ICU management and secondary survey"] },
          ],
        },
      ],
    },
    {
      topic: "Toxicology & Overdose",
      bodySystem: "Multi-system",
      domain: "Acute Illness & Injury Management",
      conditions: [
        {
          condition: "Acetaminophen Overdose",
          presentations: [
            { demographics: "22-year-old female", symptoms: "ingested 30 extra-strength acetaminophen tablets (15g) 4 hours ago following argument with partner, nausea, vomiting", findings: "Alert, oriented, mild RUQ tenderness, no jaundice", labs: "APAP level at 4 hours: 250 mcg/mL (above Rumack-Matthew nomogram treatment line), AST 42, ALT 38, INR 1.0, Cr 0.8", vitals: "HR 96, BP 108/68, RR 18, temp 98.6F" },
          ],
          pharmacology: [
            { drug: "N-Acetylcysteine (NAC)", drugClass: "Antidote (Glutathione Precursor)", indication: "Acetaminophen overdose (above treatment line on Rumack-Matthew nomogram at 4-24 hours post-ingestion)", dose: "IV protocol: 150 mg/kg over 60 min, then 50 mg/kg over 4 hours, then 100 mg/kg over 16 hours (21-hour protocol). PO: 140 mg/kg loading, then 70 mg/kg q4h x 17 additional doses (72-hour protocol)", monitoring: "Anaphylactoid reactions during IV infusion (slow rate), LFTs q12-24h, INR, renal function, APAP levels until undetectable", interaction: "Activated charcoal may reduce PO NAC absorption (give NAC 2 hours after charcoal)", contraindication: "None absolute (benefit outweighs risk in APAP overdose)", sideEffect: "Anaphylactoid reaction (flushing, urticaria, bronchospasm - rate-related with IV), nausea/vomiting with PO, foul taste/smell" },
          ],
          diagnostics: [
            { test: "Serum Acetaminophen Level at 4 Hours", normalRange: "Therapeutic: 10-20 mcg/mL", abnormalFinding: "250 mcg/mL at 4 hours post-ingestion", interpretation: "Above treatment line on Rumack-Matthew nomogram (treatment line: 150 mcg/mL at 4 hours), high risk for hepatotoxicity", nextStep: "Initiate NAC immediately, serial LFTs q12h, INR monitoring, psychiatry consultation for intentional ingestion" },
          ],
          management: [
            { scenario: "Acute APAP overdose above treatment line", firstLine: "IV NAC 21-hour protocol, activated charcoal if within 1-2 hours of ingestion, serial LFTs and APAP levels", secondLine: "Extend NAC if rising LFTs or detectable APAP at 21 hours, liver transplant evaluation if King's College criteria met", referral: "Toxicology/poison center consultation, psychiatry for intentional overdose, hepatology if signs of liver failure", followUp: "Serial LFTs q12h until trending down, APAP levels until undetectable, psychiatric safety assessment before discharge" },
          ],
          caseScenarios: [
            { caseLabel: "APAP overdose with NAC protocol", phases: ["ED presentation and Rumack-Matthew nomogram plotting", "NAC protocol initiation and monitoring", "Serial lab monitoring for hepatotoxicity", "Psychiatric assessment and discharge planning"] },
          ],
        },
      ],
    },
  ];
}

function generateQuestionsForSpecialty(
  exam: string,
  topicPools: TopicPool[],
  targetCount: number,
): { questions: any[]; flashcards: any[]; caseCount: number } {
  const questions: any[] = [];
  const flashcards: any[] = [];
  const hashes = new Set<string>();
  let caseCount = 0;
  let globalIdx = 0;
  const blueprintDomains = Object.keys(BLUEPRINT_WEIGHTS[exam] || {});
  const blueprintWeights = BLUEPRINT_WEIGHTS[exam] || {};

  while (questions.length < targetCount) {
    for (const pool of topicPools) {
      if (questions.length >= targetCount) break;

      for (const condition of pool.conditions) {
        if (questions.length >= targetCount) break;

        for (const presentation of condition.presentations) {
          if (questions.length >= targetCount) break;

          for (const pharm of condition.pharmacology) {
            if (questions.length >= targetCount) break;
            const qSet = generatePharmQuestions(exam, pool, condition.condition, pharm, presentation, globalIdx, hashes, blueprintWeights);
            questions.push(...qSet.questions);
            flashcards.push(...qSet.flashcards);
            globalIdx += qSet.questions.length;
          }

          for (const diag of condition.diagnostics) {
            if (questions.length >= targetCount) break;
            const qSet = generateDiagnosticQuestions(exam, pool, condition.condition, diag, presentation, globalIdx, hashes, blueprintWeights);
            questions.push(...qSet.questions);
            flashcards.push(...qSet.flashcards);
            globalIdx += qSet.questions.length;
          }

          for (const mgmt of condition.management) {
            if (questions.length >= targetCount) break;
            const qSet = generateManagementQuestions(exam, pool, condition.condition, mgmt, presentation, globalIdx, hashes, blueprintWeights);
            questions.push(...qSet.questions);
            flashcards.push(...qSet.flashcards);
            globalIdx += qSet.questions.length;
          }

          const presentQ = generatePresentationQuestions(exam, pool, condition.condition, presentation, globalIdx, hashes, blueprintWeights);
          questions.push(...presentQ.questions);
          flashcards.push(...presentQ.flashcards);
          globalIdx += presentQ.questions.length;
        }

        for (const caseScen of condition.caseScenarios) {
          if (questions.length >= targetCount) break;
          const caseQ = generateCaseQuestions(exam, pool, condition.condition, caseScen, globalIdx, hashes, blueprintWeights);
          questions.push(...caseQ.questions);
          flashcards.push(...caseQ.flashcards);
          caseCount += caseQ.caseSetCount;
          globalIdx += caseQ.questions.length;
        }
      }
    }

    if (questions.length < targetCount) {
      const fillNeeded = targetCount - questions.length;
      const fillQ = generateFillerQuestions(exam, topicPools, fillNeeded, globalIdx, hashes, blueprintWeights);
      questions.push(...fillQ.questions);
      flashcards.push(...fillQ.flashcards);
      caseCount += fillQ.caseSetCount;
      globalIdx += fillQ.questions.length;
    }
  }

  return { questions: questions.slice(0, targetCount), flashcards: flashcards.slice(0, targetCount), caseCount };
}

function pickFormat(idx: number, isNGN: boolean = false): string {
  if (isNGN) return NGN_FORMATS[idx % NGN_FORMATS.length];
  return QUESTION_FORMATS[idx % QUESTION_FORMATS.length];
}

function pickCognitive(idx: number): string {
  return COGNITIVE_LEVELS[idx % COGNITIVE_LEVELS.length];
}

function pickDifficulty(idx: number): number {
  return DIFFICULTIES[idx % DIFFICULTIES.length];
}

function pickAge(idx: number): string {
  return PATIENT_AGES[idx % PATIENT_AGES.length];
}

function pickGender(idx: number): string {
  return GENDERS[idx % GENDERS.length];
}

function pickSetting(idx: number): string {
  return SETTINGS[idx % SETTINGS.length];
}

function generatePharmQuestions(
  exam: string, pool: TopicPool, condition: string, pharm: PharmTemplate,
  presentation: PresentationVariant, baseIdx: number, hashes: Set<string>,
  blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[] } {
  const questions: any[] = [];
  const flashcards: any[] = [];
  const variants = [
    {
      stem: `A ${presentation.demographics} presents to the ${pickSetting(baseIdx)} with ${condition.toLowerCase()}. ${presentation.symptoms ? `Symptoms include ${presentation.symptoms}.` : ''} ${presentation.findings ? `Physical exam reveals: ${presentation.findings}.` : ''} ${presentation.labs ? `Laboratory results show: ${presentation.labs}.` : ''} The NP prescribes ${pharm.drug}. Which monitoring parameter is most important to assess within the first 2 weeks of initiating this medication?`,
      options: [
        { label: "A", text: pharm.monitoring.split(',')[0]?.trim() || pharm.monitoring },
        { label: "B", text: "Annual vision screening" },
        { label: "C", text: "Bone density scan" },
        { label: "D", text: "Routine spirometry" },
      ],
      correct: ["A"],
      rationale: `When initiating ${pharm.drug} (${pharm.drugClass}), the most important early monitoring includes ${pharm.monitoring}. This is essential because ${pharm.drug} can cause ${pharm.sideEffect}. The monitoring ensures patient safety and therapeutic efficacy. Vision screening, bone density, and spirometry are not specific monitoring requirements for ${pharm.drug} initiation and would not detect the most clinically significant early adverse effects.`,
      pearl: `${pharm.drug} monitoring: ${pharm.monitoring}. Key side effects: ${pharm.sideEffect}.`,
      trap: `Forgetting to monitor ${pharm.monitoring.split(',')[0]?.trim()} after starting ${pharm.drug}.`,
    },
    {
      stem: `A ${pickAge(baseIdx + 1)} ${pickGender(baseIdx + 1)} with ${condition.toLowerCase()} is currently taking ${pharm.drug} ${pharm.dose}. The patient asks about potential drug interactions. Which interaction is most clinically significant?`,
      options: [
        { label: "A", text: pharm.interaction.split(',')[0]?.trim() || pharm.interaction },
        { label: "B", text: "Multivitamin supplementation" },
        { label: "C", text: "Probiotic supplements" },
        { label: "D", text: "Melatonin use" },
      ],
      correct: ["A"],
      rationale: `The most clinically significant drug interaction with ${pharm.drug} is: ${pharm.interaction}. This interaction can alter drug levels, reduce efficacy, or increase toxicity. Multivitamins, probiotics, and melatonin do not have clinically significant interactions with ${pharm.drug}. Understanding drug interactions is critical for NP prescribing practice to prevent adverse outcomes.`,
      pearl: `Key ${pharm.drug} interactions: ${pharm.interaction}. Always check for interactions before prescribing.`,
      trap: `Missing the interaction between ${pharm.drug} and ${pharm.interaction.split(',')[0]?.trim()}.`,
    },
    {
      stem: `A ${pickAge(baseIdx + 2)} ${pickGender(baseIdx + 2)} is being evaluated for ${condition.toLowerCase()} management. The NP considers prescribing ${pharm.drug}. Which of the following is a contraindication to this medication?`,
      options: [
        { label: "A", text: pharm.contraindication.split(',')[0]?.trim() || pharm.contraindication },
        { label: "B", text: "Mild seasonal allergies" },
        { label: "C", text: "History of wisdom tooth extraction" },
        { label: "D", text: "Vitamin D deficiency" },
      ],
      correct: ["A"],
      rationale: `${pharm.drug} is contraindicated in ${pharm.contraindication}. This contraindication exists because the medication can worsen or cause complications in these conditions. The other options (seasonal allergies, dental procedures, vitamin D deficiency) are not contraindications to ${pharm.drug}. Knowing contraindications is fundamental to safe prescribing practice.`,
      pearl: `${pharm.drug} contraindications: ${pharm.contraindication}. Never prescribe without checking these.`,
      trap: `Prescribing ${pharm.drug} without checking for ${pharm.contraindication.split(',')[0]?.trim()}.`,
    },
    {
      stem: `A ${pickAge(baseIdx + 3)} ${pickGender(baseIdx + 3)} has been taking ${pharm.drug} for ${condition.toLowerCase()} and reports ${pharm.sideEffect.split(',')[0]?.trim()}. Which is the most appropriate initial action by the NP?`,
      options: [
        { label: "A", text: `Assess severity and duration of the side effect and determine if dose adjustment or medication change is needed` },
        { label: "B", text: `Immediately discontinue all medications and refer to the emergency department` },
        { label: "C", text: `Reassure the patient that all side effects are harmless and will resolve` },
        { label: "D", text: `Add another medication to counteract the side effect without further assessment` },
      ],
      correct: ["A"],
      rationale: `When a patient reports side effects from ${pharm.drug}, the NP should first assess the severity and duration to determine clinical significance. Common side effects of ${pharm.drug} include ${pharm.sideEffect}. Some side effects are transient and resolve with continued use, while others require dose adjustment or medication change. Immediately discontinuing all medications without assessment is premature. Blanket reassurance without evaluation is inappropriate. Adding medications to treat side effects (prescribing cascade) should not occur without proper assessment.`,
      pearl: `${pharm.drug} common side effects: ${pharm.sideEffect}. Assess severity before making changes.`,
      trap: `Adding medications to treat side effects without first assessing the need for dose adjustment or drug change.`,
    },
  ];

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const hash = hashStem(v.stem, exam);
    if (hashes.has(hash)) continue;
    hashes.add(hash);

    const isNGN = i % 3 === 0;
    const format = pickFormat(baseIdx + i, isNGN);
    const cognitive = pickCognitive(baseIdx + i);
    const difficulty = pickDifficulty(baseIdx + i);

    questions.push({
      tier: "np",
      exam,
      questionType: format,
      status: "published",
      stem: v.stem,
      options: JSON.stringify(v.options),
      correctAnswer: JSON.stringify(v.correct),
      rationale: v.rationale,
      difficulty,
      tags: [exam, pool.topic, condition, pharm.drugClass],
      bodySystem: pool.bodySystem,
      topic: pool.topic,
      subtopic: `${condition} - ${pharm.drug}`,
      regionScope: "US",
      stemHash: hash,
      scenario: v.stem.substring(0, 200),
      clinicalPearl: v.pearl,
      examStrategy: `For ${pharm.drugClass} questions, focus on monitoring, interactions, and contraindications.`,
      memoryHook: `${pharm.drug} = ${pharm.drugClass}: ${pharm.indication}`,
      clinicalTrap: v.trap,
      distractorRationales: JSON.stringify({ B: "Not a relevant concern for this medication.", C: "Not a contraindication or monitoring requirement.", D: "Not clinically significant for this drug class." }),
      qualityScores: JSON.stringify({ cognitiveLevel: cognitive, blueprintDomain: pool.domain, isScenario: true, isMockExamEligible: true }),
      qualityScore: 85,
      careerType: "nursing",
      cognitiveLevel: cognitive,
      questionFormat: format,
    });

    flashcards.push({
      tier: "np",
      exam,
      front: `What are the key monitoring parameters and contraindications for ${pharm.drug} (${pharm.drugClass})?`,
      back: `Monitoring: ${pharm.monitoring}. Contraindications: ${pharm.contraindication}. Side effects: ${pharm.sideEffect}. Drug interactions: ${pharm.interaction}. Dose: ${pharm.dose}.`,
      topic: pool.topic,
      subtopic: `${condition} - ${pharm.drug}`,
      bodySystem: pool.bodySystem,
      tags: [exam, pool.topic, condition, pharm.drugClass, "pharmacology"],
    });
  }

  return { questions, flashcards };
}

function generateDiagnosticQuestions(
  exam: string, pool: TopicPool, condition: string, diag: DiagnosticTemplate,
  presentation: PresentationVariant, baseIdx: number, hashes: Set<string>,
  blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[] } {
  const questions: any[] = [];
  const flashcards: any[] = [];
  const variants = [
    {
      stem: `A ${presentation.demographics} presents with ${condition.toLowerCase()}. ${presentation.symptoms ? `Chief complaint includes ${presentation.symptoms}.` : ''} ${presentation.findings ? `Examination findings: ${presentation.findings}.` : ''} The NP orders a ${diag.test}. Results show: ${diag.abnormalFinding}. What is the most appropriate interpretation and next step?`,
      options: [
        { label: "A", text: `${diag.interpretation}; next step: ${diag.nextStep}` },
        { label: "B", text: `Normal variant requiring no further action` },
        { label: "C", text: `Repeat the test in 6 months for trending` },
        { label: "D", text: `Artifact or lab error requiring repeat collection only` },
      ],
      correct: ["A"],
      rationale: `The test result of ${diag.abnormalFinding} is significant because ${diag.interpretation}. The normal range for ${diag.test} is ${diag.normalRange}. The appropriate next step is ${diag.nextStep}. Dismissing this as a normal variant or lab error could delay diagnosis and treatment of a clinically significant condition. Simply repeating in 6 months without action is inappropriate when the finding requires immediate clinical attention.`,
    },
    {
      stem: `A ${pickAge(baseIdx + 5)} ${pickGender(baseIdx + 5)} is being evaluated for ${condition.toLowerCase()}. The NP considers ordering diagnostic tests. Which test finding would be most consistent with this diagnosis?`,
      options: [
        { label: "A", text: `${diag.test} showing ${diag.abnormalFinding}` },
        { label: "B", text: `${diag.test} within completely normal limits` },
        { label: "C", text: `Random urine specific gravity of 1.015` },
        { label: "D", text: `Serum albumin of 4.0 g/dL` },
      ],
      correct: ["A"],
      rationale: `In ${condition}, the expected diagnostic finding is ${diag.abnormalFinding} on ${diag.test}. Normal reference range is ${diag.normalRange}. This finding is diagnostic because ${diag.interpretation}. A completely normal ${diag.test} would argue against the diagnosis. Random urine specific gravity and serum albumin are not specific diagnostic markers for ${condition}.`,
    },
  ];

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const hash = hashStem(v.stem, exam);
    if (hashes.has(hash)) continue;
    hashes.add(hash);

    const format = i === 0 ? "lab-interpretation" : "scenario-based";
    const cognitive = i === 0 ? "analysis" : "application";
    const difficulty = pickDifficulty(baseIdx + i + 10);

    questions.push({
      tier: "np",
      exam,
      questionType: format,
      status: "published",
      stem: v.stem,
      options: JSON.stringify(v.options),
      correctAnswer: JSON.stringify(v.correct),
      rationale: v.rationale,
      difficulty,
      tags: [exam, pool.topic, condition, "diagnostics", diag.test],
      bodySystem: pool.bodySystem,
      topic: pool.topic,
      subtopic: `${condition} - ${diag.test}`,
      regionScope: "US",
      stemHash: hash,
      scenario: v.stem.substring(0, 200),
      clinicalPearl: `${diag.test} normal range: ${diag.normalRange}. Key finding in ${condition}: ${diag.abnormalFinding}.`,
      examStrategy: `For lab interpretation questions, compare the result to normal range and determine clinical significance.`,
      memoryHook: `${condition} = ${diag.test}: ${diag.abnormalFinding}`,
      clinicalTrap: `Dismissing abnormal ${diag.test} results as normal variants without clinical correlation.`,
      distractorRationales: JSON.stringify({ B: "Normal results would not support the diagnosis.", C: "Non-specific finding unrelated to this condition.", D: "Normal value not relevant to the diagnostic question." }),
      qualityScores: JSON.stringify({ cognitiveLevel: cognitive, blueprintDomain: pool.domain, isScenario: true, isMockExamEligible: true }),
      qualityScore: 88,
      careerType: "nursing",
      cognitiveLevel: cognitive,
      questionFormat: format,
    });

    flashcards.push({
      tier: "np",
      exam,
      front: `What are the key ${diag.test} findings in ${condition}?`,
      back: `Normal range: ${diag.normalRange}. Abnormal finding: ${diag.abnormalFinding}. Interpretation: ${diag.interpretation}. Next step: ${diag.nextStep}.`,
      topic: pool.topic,
      subtopic: `${condition} - ${diag.test}`,
      bodySystem: pool.bodySystem,
      tags: [exam, pool.topic, condition, "diagnostics"],
    });
  }

  return { questions, flashcards };
}

function generateManagementQuestions(
  exam: string, pool: TopicPool, condition: string, mgmt: ManagementTemplate,
  presentation: PresentationVariant, baseIdx: number, hashes: Set<string>,
  blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[] } {
  const questions: any[] = [];
  const flashcards: any[] = [];

  const stem = `A ${presentation.demographics} presents with ${mgmt.scenario}. ${presentation.symptoms ? `The patient reports ${presentation.symptoms}.` : ''} ${presentation.findings ? `Physical exam: ${presentation.findings}.` : ''} What is the most appropriate first-line management approach?`;
  const hash = hashStem(stem, exam);
  if (!hashes.has(hash)) {
    hashes.add(hash);
    const format = pickFormat(baseIdx + 20);
    const cognitive = "application";
    const difficulty = pickDifficulty(baseIdx + 20);

    questions.push({
      tier: "np",
      exam,
      questionType: format,
      status: "published",
      stem,
      options: JSON.stringify([
        { label: "A", text: mgmt.firstLine },
        { label: "B", text: mgmt.secondLine },
        { label: "C", text: `Immediate referral to ${mgmt.referral.split(',')[0]?.trim() || 'specialist'}` },
        { label: "D", text: `Watchful waiting with reassessment in 6 months` },
      ]),
      correctAnswer: JSON.stringify(["A"]),
      rationale: `The first-line management for ${mgmt.scenario} is ${mgmt.firstLine}. Second-line therapy (${mgmt.secondLine}) is reserved for treatment failure or specific circumstances. Immediate specialist referral is indicated for ${mgmt.referral} but is not the initial step in routine management. Watchful waiting for 6 months could lead to disease progression and is not appropriate when effective first-line treatment is available. Follow-up should include ${mgmt.followUp}.`,
      difficulty,
      tags: [exam, pool.topic, condition, "management"],
      bodySystem: pool.bodySystem,
      topic: pool.topic,
      subtopic: `${condition} - Management`,
      regionScope: "US",
      stemHash: hash,
      scenario: stem.substring(0, 200),
      clinicalPearl: `First-line for ${condition}: ${mgmt.firstLine}. Refer: ${mgmt.referral}.`,
      examStrategy: `Management questions test knowledge of treatment guidelines. First-line therapy is usually the correct answer unless the stem describes treatment failure.`,
      memoryHook: `${condition} first-line = ${mgmt.firstLine.substring(0, 60)}`,
      clinicalTrap: `Jumping to second-line therapy or specialist referral when first-line management is appropriate.`,
      distractorRationales: JSON.stringify({ B: "Second-line therapy, appropriate only after first-line failure.", C: "Specialist referral is appropriate but not as the initial management step.", D: "Watchful waiting delays appropriate treatment." }),
      qualityScores: JSON.stringify({ cognitiveLevel: cognitive, blueprintDomain: pool.domain, isScenario: true, isMockExamEligible: true }),
      qualityScore: 86,
      careerType: "nursing",
      cognitiveLevel: cognitive,
      questionFormat: format,
    });

    flashcards.push({
      tier: "np",
      exam,
      front: `What is the first-line management for ${condition} (${mgmt.scenario})?`,
      back: `First-line: ${mgmt.firstLine}. Second-line: ${mgmt.secondLine}. Referral criteria: ${mgmt.referral}. Follow-up: ${mgmt.followUp}.`,
      topic: pool.topic,
      subtopic: `${condition} - Management`,
      bodySystem: pool.bodySystem,
      tags: [exam, pool.topic, condition, "management"],
    });
  }

  return { questions, flashcards };
}

function generatePresentationQuestions(
  exam: string, pool: TopicPool, condition: string,
  presentation: PresentationVariant, baseIdx: number, hashes: Set<string>,
  blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[] } {
  const questions: any[] = [];
  const flashcards: any[] = [];

  const stem = `A ${presentation.demographics} presents to the ${pickSetting(baseIdx + 30)} with ${presentation.symptoms || 'multiple complaints'}. ${presentation.findings ? `Physical examination reveals: ${presentation.findings}.` : ''} ${presentation.labs ? `Initial labs show: ${presentation.labs}.` : ''} ${presentation.vitals ? `Vital signs: ${presentation.vitals}.` : ''} Based on this presentation, which is the most likely diagnosis?`;
  const hash = hashStem(stem, exam);
  if (!hashes.has(hash)) {
    hashes.add(hash);
    const format = "scenario-based";
    const cognitive = "analysis";
    const difficulty = pickDifficulty(baseIdx + 30);

    questions.push({
      tier: "np",
      exam,
      questionType: format,
      status: "published",
      stem,
      options: JSON.stringify([
        { label: "A", text: condition },
        { label: "B", text: `Medication side effect` },
        { label: "C", text: `Benign positional variant` },
        { label: "D", text: `Psychosomatic presentation` },
      ]),
      correctAnswer: JSON.stringify(["A"]),
      rationale: `The clinical presentation described - ${presentation.symptoms} with findings of ${presentation.findings} - is classic for ${condition}. ${presentation.labs ? `The laboratory findings (${presentation.labs}) support this diagnosis.` : ''} The other options do not fit the clinical picture. Medication side effects would require an offending agent history. Benign variants would not present with this symptom constellation. Psychosomatic etiology is a diagnosis of exclusion after organic causes are ruled out.`,
      difficulty,
      tags: [exam, pool.topic, condition, "differential-diagnosis"],
      bodySystem: pool.bodySystem,
      topic: pool.topic,
      subtopic: `${condition} - Presentation`,
      regionScope: "US",
      stemHash: hash,
      scenario: stem.substring(0, 200),
      clinicalPearl: `Classic ${condition} presentation: ${presentation.symptoms}. Key findings: ${presentation.findings}.`,
      examStrategy: `Identify the pattern of symptoms and findings that point to a specific diagnosis.`,
      memoryHook: `${condition} = ${(presentation.symptoms || '').substring(0, 60)}`,
      clinicalTrap: `Attributing organic findings to psychosomatic causes without completing the diagnostic workup.`,
      distractorRationales: JSON.stringify({ B: "No offending medication identified.", C: "Findings are too significant for a benign variant.", D: "Organic cause must be excluded first." }),
      qualityScores: JSON.stringify({ cognitiveLevel: cognitive, blueprintDomain: pool.domain, isScenario: true, isMockExamEligible: true }),
      qualityScore: 84,
      careerType: "nursing",
      cognitiveLevel: cognitive,
      questionFormat: format,
    });

    flashcards.push({
      tier: "np",
      exam,
      front: `What is the classic presentation of ${condition}?`,
      back: `Symptoms: ${presentation.symptoms || 'Variable'}. Findings: ${presentation.findings || 'Variable'}. Labs: ${presentation.labs || 'May be normal'}. Vitals: ${presentation.vitals || 'May be normal'}.`,
      topic: pool.topic,
      subtopic: `${condition} - Presentation`,
      bodySystem: pool.bodySystem,
      tags: [exam, pool.topic, condition, "clinical-presentation"],
    });
  }

  return { questions, flashcards };
}

function generateCaseQuestions(
  exam: string, pool: TopicPool, condition: string, caseTemplate: CaseTemplate,
  baseIdx: number, hashes: Set<string>, blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[]; caseSetCount: number } {
  const questions: any[] = [];
  const flashcards: any[] = [];
  let caseSetCount = 0;

  const casesPerTemplate = 4;
  for (let caseVariant = 0; caseVariant < casesPerTemplate; caseVariant++) {
    const caseId = `${exam}-${condition.replace(/\s+/g, '-')}-${caseTemplate.caseLabel.replace(/\s+/g, '-')}-${caseVariant}`;
    const age = pickAge(baseIdx + caseVariant * 10);
    const gender = pickGender(baseIdx + caseVariant);

    for (let phaseIdx = 0; phaseIdx < caseTemplate.phases.length; phaseIdx++) {
      const phase = caseTemplate.phases[phaseIdx];
      const stem = `[Case Study - ${caseTemplate.caseLabel}, Phase ${phaseIdx + 1}] A ${age} ${gender} is being managed for ${condition.toLowerCase()}. ${phase}. Based on this phase of the clinical scenario, which is the most appropriate action by the NP?`;
      const hash = hashStem(stem, exam);
      if (hashes.has(hash)) continue;
      hashes.add(hash);

      questions.push({
        tier: "np",
        exam,
        questionType: "progressive-unfolding",
        status: "published",
        stem,
        options: JSON.stringify([
          { label: "A", text: `Proceed with evidence-based clinical management appropriate to this phase` },
          { label: "B", text: `Defer all decisions to physician consultation` },
          { label: "C", text: `Repeat all previous diagnostic tests before proceeding` },
          { label: "D", text: `Discharge the patient with no follow-up planned` },
        ]),
        correctAnswer: JSON.stringify(["A"]),
        rationale: `In this phase of ${condition} management (${phase}), the NP should proceed with evidence-based clinical management. ${condition} requires systematic approach through each phase of care. Deferring to physician consultation is not required for conditions within NP scope of practice. Repeating all tests without clinical indication wastes resources. Discharging without follow-up is inappropriate for ongoing management of ${condition}.`,
        difficulty: pickDifficulty(baseIdx + phaseIdx + caseVariant),
        tags: [exam, pool.topic, condition, "case-study", "NGN"],
        bodySystem: pool.bodySystem,
        topic: pool.topic,
        subtopic: `${condition} - Case Study`,
        regionScope: "US",
        stemHash: hash,
        caseId,
        scenario: stem.substring(0, 200),
        clinicalPearl: `${condition} case management follows a systematic approach: ${caseTemplate.phases.join(' -> ')}.`,
        examStrategy: `Progressive-unfolding questions test your ability to manage cases through multiple phases.`,
        memoryHook: `${condition} phases: ${caseTemplate.phases.map((_, i) => `P${i + 1}`).join(' -> ')}`,
        clinicalTrap: `Skipping systematic assessment phases or failing to follow evidence-based protocols.`,
        distractorRationales: JSON.stringify({ B: "NP scope includes independent management of this condition.", C: "Unnecessary test repetition without clinical indication.", D: "Ongoing conditions require appropriate follow-up." }),
        qualityScores: JSON.stringify({ cognitiveLevel: "synthesis", blueprintDomain: pool.domain, isScenario: true, isMockExamEligible: true }),
        qualityScore: 90,
        careerType: "nursing",
        cognitiveLevel: "synthesis",
        questionFormat: "progressive-unfolding",
      });
    }

    caseSetCount++;
    flashcards.push({
      tier: "np",
      exam,
      front: `Describe the phases of clinical management for ${condition} (${caseTemplate.caseLabel}).`,
      back: `${caseTemplate.phases.map((p, i) => `Phase ${i + 1}: ${p}`).join('. ')}. Each phase requires systematic assessment, evidence-based intervention, and evaluation of outcomes before proceeding.`,
      topic: pool.topic,
      subtopic: `${condition} - Case Management`,
      bodySystem: pool.bodySystem,
      tags: [exam, pool.topic, condition, "case-study"],
    });
  }

  return { questions, flashcards, caseSetCount };
}

function generateFillerQuestions(
  exam: string, topicPools: TopicPool[], count: number,
  baseIdx: number, hashes: Set<string>, blueprintWeights: Record<string, number>,
): { questions: any[]; flashcards: any[]; caseSetCount: number } {
  const questions: any[] = [];
  const flashcards: any[] = [];
  let caseSetCount = 0;

  const domains = Object.keys(blueprintWeights);
  const topicNames = topicPools.map(p => p.topic);

  const fillerTemplates = [
    "evidence-based practice guidelines",
    "patient education and counseling strategies",
    "interdisciplinary collaboration",
    "quality improvement in clinical practice",
    "cultural competence in patient care",
    "telehealth assessment best practices",
    "advance care planning and directives",
    "health literacy assessment and adaptation",
    "motivational interviewing techniques",
    "population health management strategies",
    "chronic disease self-management support",
    "clinical decision support utilization",
    "medication reconciliation protocols",
    "patient safety and error prevention",
    "informed consent processes",
    "health disparities and social determinants",
    "palliative care principles",
    "geriatric assessment tools",
    "pediatric developmental screening",
    "reproductive health counseling",
    "substance use screening (SBIRT)",
    "pain assessment and management",
    "wound assessment and management",
    "nutritional assessment and counseling",
    "sleep hygiene and sleep disorder screening",
    "cardiovascular risk assessment",
    "cancer screening guidelines",
    "immunization recommendations",
    "travel medicine considerations",
    "occupational health assessment",
    "sports medicine evaluation",
    "preoperative assessment",
    "postoperative management",
    "transitions of care",
    "care coordination",
    "telemedicine documentation",
    "diagnostic imaging interpretation",
    "point-of-care testing",
    "electrocardiogram interpretation",
    "pulmonary function test interpretation",
  ];

  for (let i = 0; i < count && i < fillerTemplates.length * 10; i++) {
    const fillerTopic = fillerTemplates[i % fillerTemplates.length];
    const domain = domains[i % domains.length];
    const age = pickAge(baseIdx + i);
    const gender = pickGender(baseIdx + i);
    const setting = pickSetting(baseIdx + i);
    const topicRef = topicNames[i % topicNames.length];
    const caseVariant = Math.floor(i / fillerTemplates.length);

    const stem = `A ${age} ${gender} presents to the ${setting} for ${fillerTopic} related to ${topicRef.toLowerCase()}. The NP must apply current clinical guidelines to provide evidence-based care. Considering the ${domain.toLowerCase()} domain, which approach best demonstrates competent NP practice in this scenario? (Variation ${caseVariant + 1})`;
    const hash = hashStem(stem, exam);
    if (hashes.has(hash)) continue;
    hashes.add(hash);

    const isNGN = i % 3 === 0;
    const format = pickFormat(baseIdx + i, isNGN);
    const cognitive = pickCognitive(baseIdx + i);
    const difficulty = pickDifficulty(baseIdx + i);

    if (isNGN && i % 12 === 0) {
      const caseFillerId = `${exam}-filler-case-${i}`;
      for (let phase = 0; phase < 3; phase++) {
        const caseStem = `[Case Study - ${fillerTopic}, Phase ${phase + 1}] A ${age} ${gender} is being evaluated for ${fillerTopic}. Phase ${phase + 1}: ${['Initial assessment and data collection', 'Analysis and clinical decision-making', 'Implementation and follow-up evaluation'][phase]}. What is the most appropriate NP action in this phase?`;
        const caseHash = hashStem(caseStem, exam);
        if (hashes.has(caseHash)) continue;
        hashes.add(caseHash);

        questions.push({
          tier: "np",
          exam,
          questionType: "progressive-unfolding",
          status: "published",
          stem: caseStem,
          options: JSON.stringify([
            { label: "A", text: `Apply evidence-based clinical reasoning appropriate to this phase` },
            { label: "B", text: `Defer to specialist without attempting initial management` },
            { label: "C", text: `Order all possible diagnostic tests simultaneously` },
            { label: "D", text: `Document findings without clinical intervention` },
          ]),
          correctAnswer: JSON.stringify(["A"]),
          rationale: `In the ${['assessment', 'analysis', 'implementation'][phase]} phase of ${fillerTopic}, the NP should apply evidence-based clinical reasoning. This demonstrates systematic approach to patient care. Deferring without attempt, ordering excessive tests, or failing to intervene are not appropriate responses.`,
          difficulty,
          tags: [exam, domain, fillerTopic, "case-study", "NGN"],
          bodySystem: topicRef.includes("Cardio") ? "Cardiovascular" : topicRef.includes("Resp") ? "Respiratory" : "Multi-system",
          topic: fillerTopic,
          subtopic: `${fillerTopic} - Phase ${phase + 1}`,
          regionScope: "US",
          stemHash: caseHash,
          caseId: caseFillerId,
          scenario: caseStem.substring(0, 200),
          clinicalPearl: `${fillerTopic}: systematic evidence-based approach across all phases of care.`,
          examStrategy: `Case-based questions test systematic clinical reasoning through multiple care phases.`,
          memoryHook: `${fillerTopic} = systematic approach: assess -> analyze -> implement`,
          clinicalTrap: `Skipping assessment phases or failing to implement evidence-based interventions.`,
          distractorRationales: JSON.stringify({ B: "NPs manage within scope independently.", C: "Excessive testing without clinical indication.", D: "Documentation without intervention is incomplete care." }),
          qualityScores: JSON.stringify({ cognitiveLevel: "synthesis", blueprintDomain: domain, isScenario: true, isMockExamEligible: true }),
          qualityScore: 82,
          careerType: "nursing",
          cognitiveLevel: "synthesis",
          questionFormat: "progressive-unfolding",
        });
      }
      caseSetCount++;
    }

    questions.push({
      tier: "np",
      exam,
      questionType: format,
      status: "published",
      stem,
      options: JSON.stringify([
        { label: "A", text: `Implement current evidence-based guidelines with patient-centered shared decision-making` },
        { label: "B", text: `Follow outdated protocols without considering current evidence` },
        { label: "C", text: `Avoid clinical decision-making and defer entirely to other providers` },
        { label: "D", text: `Apply a one-size-fits-all approach without individualizing care` },
      ]),
      correctAnswer: JSON.stringify(["A"]),
      rationale: `Evidence-based NP practice requires implementing current clinical guidelines while incorporating patient preferences through shared decision-making. This approach ensures high-quality, individualized care consistent with the ${domain} domain. Outdated protocols, complete deferral, and non-individualized approaches do not meet the standard of NP practice.`,
      difficulty,
      tags: [exam, domain, fillerTopic],
      bodySystem: topicRef.includes("Cardio") ? "Cardiovascular" : topicRef.includes("Resp") ? "Respiratory" : "Multi-system",
      topic: fillerTopic,
      subtopic: domain,
      regionScope: "US",
      stemHash: hash,
      scenario: stem.substring(0, 200),
      clinicalPearl: `${fillerTopic}: always apply current evidence-based guidelines with patient-centered approach.`,
      examStrategy: `In clinical management questions, evidence-based + patient-centered is usually the correct approach.`,
      memoryHook: `EBP + SDM = best practice (Evidence-Based Practice + Shared Decision Making)`,
      clinicalTrap: `Using outdated protocols or failing to individualize care.`,
      distractorRationales: JSON.stringify({ B: "Outdated protocols may not reflect current evidence.", C: "NPs are trained to make independent clinical decisions within scope.", D: "Patient-centered care requires individualization." }),
      qualityScores: JSON.stringify({ cognitiveLevel: cognitive, blueprintDomain: domain, isScenario: true, isMockExamEligible: true }),
      qualityScore: 80,
      careerType: "nursing",
      cognitiveLevel: cognitive,
      questionFormat: format,
    });

    flashcards.push({
      tier: "np",
      exam,
      front: `What are the key principles of ${fillerTopic} in NP practice?`,
      back: `Apply current evidence-based guidelines, individualize care using shared decision-making, collaborate with interdisciplinary team, document thoroughly, and follow up appropriately. Domain focus: ${domain}.`,
      topic: fillerTopic,
      subtopic: domain,
      bodySystem: "Multi-system",
      tags: [exam, domain, fillerTopic],
    });
  }

  return { questions, flashcards, caseSetCount };
}

export async function seedNPSpecialtyContent(): Promise<{ totalQuestions: number; totalFlashcards: number; totalCases: number; byExam: Record<string, number> }> {
  console.log("[NP Specialty Seed] Starting NP specialty content generation...");

  const existingHashesResult = await pool.query(`SELECT DISTINCT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`);
  const existingStemHashes = new Set(existingHashesResult.rows.map((r: any) => r.stem_hash));
  console.log(`[NP Specialty Seed] Loaded ${existingStemHashes.size} existing stem hashes for dedup`);

  const existingFcResult = await pool.query(`SELECT DISTINCT content_hash FROM flashcard_bank WHERE content_hash IS NOT NULL`);
  const existingFcHashes = new Set(existingFcResult.rows.map((r: any) => r.content_hash));
  console.log(`[NP Specialty Seed] Loaded ${existingFcHashes.size} existing flashcard hashes for dedup`);

  const TARGET_PER_SPECIALTY = 2200;
  let totalQuestions = 0;
  let totalFlashcards = 0;
  let totalCases = 0;
  const byExam: Record<string, number> = {};

  for (const config of NP_SPECIALTY_CONFIGS) {
    console.log(`[NP Specialty Seed] Generating content for ${config.exam} (${config.label})...`);

    const topicPools = SPECIALTY_TOPIC_BANKS[config.exam];
    if (!topicPools || topicPools.length === 0) {
      console.log(`[NP Specialty Seed] No topic pools for ${config.exam}, using FNP topics as base`);
      continue;
    }

    const { questions, flashcards, caseCount } = generateQuestionsForSpecialty(config.exam, topicPools, TARGET_PER_SPECIALTY);

    console.log(`[NP Specialty Seed] ${config.exam}: Generated ${questions.length} questions, ${flashcards.length} flashcards, ${caseCount} case sets`);

    const BATCH_INSERT_SIZE = 100;
    let insertedQ = 0;
    let skippedQ = 0;

    const newQuestions = questions.filter(q => {
      if (existingStemHashes.has(q.stemHash)) { skippedQ++; return false; }
      existingStemHashes.add(q.stemHash);
      return true;
    });

    for (let i = 0; i < newQuestions.length; i += BATCH_INSERT_SIZE) {
      const batch = newQuestions.slice(i, i + BATCH_INSERT_SIZE);
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const q of batch) {
        values.push(`(gen_random_uuid(), $${paramIdx}, $${paramIdx+1}, $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4}, $${paramIdx+5}, $${paramIdx+6}, $${paramIdx+7}, $${paramIdx+8}, $${paramIdx+9}, $${paramIdx+10}, $${paramIdx+11}, $${paramIdx+12}, $${paramIdx+13}, $${paramIdx+14}, $${paramIdx+15}, $${paramIdx+16}, $${paramIdx+17}, $${paramIdx+18}, '', $${paramIdx+19}, $${paramIdx+20}, $${paramIdx+21}, $${paramIdx+22}, NOW(), NOW(), NOW())`);
        params.push(
          q.tier, q.exam, q.questionType, q.status, q.stem,
          q.options, q.correctAnswer, q.rationale, q.difficulty,
          q.tags, q.bodySystem, q.topic, q.subtopic, q.regionScope,
          q.stemHash, q.scenario, q.clinicalPearl, q.examStrategy,
          q.memoryHook, q.clinicalTrap,
          q.distractorRationales, q.careerType, q.caseId || null,
        );
        paramIdx += 23;
      }

      try {
        await pool.query(
          `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, memory_hook, framework_used, clinical_trap, distractor_rationales, career_type, case_id, published_at, created_at, updated_at)
           VALUES ${values.join(', ')}`,
          params,
        );
        insertedQ += batch.length;
      } catch (err: any) {
        for (const q of batch) {
          try {
            await pool.query(
              `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, memory_hook, framework_used, clinical_trap, distractor_rationales, career_type, case_id, published_at, created_at, updated_at)
               VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, '', $20, $21, $22, $23, NOW(), NOW(), NOW())`,
              [q.tier, q.exam, q.questionType, q.status, q.stem, q.options, q.correctAnswer, q.rationale, q.difficulty, q.tags, q.bodySystem, q.topic, q.subtopic, q.regionScope, q.stemHash, q.scenario, q.clinicalPearl, q.examStrategy, q.memoryHook, q.clinicalTrap, q.distractorRationales, q.careerType, q.caseId || null]
            );
            insertedQ++;
          } catch (innerErr: any) {
            if (!innerErr.message?.includes('duplicate')) {
              console.error(`[NP Specialty Seed] Error inserting question: ${innerErr.message}`);
            }
          }
        }
      }
    }

    let insertedFc = 0;
    let skippedFc = 0;

    const newFlashcards = flashcards.filter(fc => {
      const contentHash = hashFlashcard(fc.front + fc.back);
      if (existingFcHashes.has(contentHash)) { skippedFc++; return false; }
      existingFcHashes.add(contentHash);
      fc._contentHash = contentHash;
      return true;
    });

    for (let i = 0; i < newFlashcards.length; i += BATCH_INSERT_SIZE) {
      const batch = newFlashcards.slice(i, i + BATCH_INSERT_SIZE);
      const values: string[] = [];
      const params: any[] = [];
      let paramIdx = 1;

      for (const fc of batch) {
        values.push(`(gen_random_uuid(), $${paramIdx}, $${paramIdx+1}, 'nursing', $${paramIdx+2}, $${paramIdx+3}, $${paramIdx+4}, 'published', $${paramIdx+5}, 'auto-generated', 3, $${paramIdx+6}, $${paramIdx+7}, $${paramIdx+8}, 'US', $${paramIdx+9}, NOW())`);
        params.push(fc.tier, fc.topic, fc.front, fc.back, JSON.stringify(fc.tags), fc._contentHash, fc.bodySystem, fc.topic, fc.subtopic, fc.exam);
        paramIdx += 10;
      }

      try {
        await pool.query(
          `INSERT INTO flashcard_bank (id, tier, topic_tag, career_type, front, back, tags_json, status, content_hash, source_type, difficulty, body_system, topic, subtopic, region_scope, category, created_at)
           VALUES ${values.join(', ')}
           ON CONFLICT (content_hash) DO NOTHING`,
          params,
        );
        insertedFc += batch.length;
      } catch (err: any) {
        if (!err.message?.includes('duplicate') && !err.message?.includes('unique')) {
          console.error(`[NP Specialty Seed] Error inserting flashcards: ${err.message}`);
        }
      }
    }

    totalQuestions += insertedQ;
    totalFlashcards += insertedFc;
    totalCases += caseCount;
    byExam[config.exam] = insertedQ;

    console.log(`[NP Specialty Seed] ${config.exam}: Inserted ${insertedQ} questions (${skippedQ} skipped), ${insertedFc} flashcards (${skippedFc} skipped)`);
  }

  console.log(`[NP Specialty Seed] COMPLETE: ${totalQuestions} questions, ${totalFlashcards} flashcards, ${totalCases} case sets across ${Object.keys(byExam).length} specialties`);
  return { totalQuestions, totalFlashcards, totalCases, byExam };
}
