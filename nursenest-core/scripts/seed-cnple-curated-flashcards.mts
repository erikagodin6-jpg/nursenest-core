/**
 * Seed CNPLE curated flashcards — 100 hand-authored, NP-level, Canadian-guideline-aligned.
 *
 * These are NOT auto-generated. Each card is clinically reviewed for:
 *   - NP-level reasoning (not RN-level)
 *   - Canadian guideline context (CHEP, NACI, CTFPHC, CCRNR, etc.)
 *   - Prescribing / diagnostic / prioritization framing
 *   - No answer leakage in the front
 *   - Actionable, not trivia
 *
 * Marked as examItemKind: CLINICAL — queryable as "premium curated" set.
 * sourceKey prefix: "cnple:curated:NNN"
 *
 * Usage:
 *   npx tsx scripts/seed-cnple-curated-flashcards.mts              # dry-run
 *   npx tsx scripts/seed-cnple-curated-flashcards.mts --apply      # write to DB
 */
import "@/lib/db/env-bootstrap";
import { prisma } from "./lib/prisma-script-client";
import { ContentStatus, CountryCode, ExamFamily, FlashcardItemKind, TierCode } from "@prisma/client";

const DRY_RUN = !process.argv.includes("--apply");
const CNPLE_DECK_ID = "cmnxsjry200050ntcsbzo7378";

type CuratedCard = {
  front: string;
  back: string;
  domain: string;
  sourceKey: string;
};

// ── 100 hand-authored CNPLE cards ────────────────────────────────────────────
const CURATED_CARDS: CuratedCard[] = [

  // ── Pharmacology & Prescribing (18) ─────────────────────────────────────────
  {
    front: "An NP calculates a CHA₂DS₂-VASc score of 2 in a 68-year-old male with paroxysmal AFib. What is the recommended anticoagulation decision per Canadian guidelines?",
    back: "Score ≥ 2 in males → anticoagulation is RECOMMENDED. Preferred agents: NOACs (apixaban, rivaroxaban, dabigatran) over warfarin for non-valvular AFib. Warfarin reserved for mechanical heart valves or severe renal impairment (eGFR < 15). Do not use NOAC if eGFR < 15. Reassess annually.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:001",
  },
  {
    front: "What are the Beers Criteria high-risk drug classes to avoid in adults ≥ 65 years, and why does this matter for Canadian NP prescribing?",
    back: "High-risk classes: benzodiazepines (falls, cognitive impairment), first-generation antihistamines (anticholinergic), NSAIDs (GI bleed, renal impairment), sliding-scale insulin (hypoglycemia), tricyclic antidepressants, skeletal muscle relaxants. NP duty: review all meds at each visit; use STOPP/START tool for Canadian context. Deprescribe when risk > benefit.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:002",
  },
  {
    front: "A patient with newly diagnosed hypertension has a BP of 154/94, no diabetes, no CKD, no heart failure. What is the Canadian first-line pharmacologic treatment per CHEP guidelines?",
    back: "First-line options (CHEP): thiazide diuretic (chlorthalidone preferred over HCTZ), long-acting CCB (amlodipine), or ACE inhibitor/ARB. Thiazide preferred if no compelling indication. Target BP: < 130/80 mmHg for most patients (revised CHEP/Hypertension Canada 2020+). Avoid ARB + ACEi combination (dual blockade).",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:003",
  },
  {
    front: "An NP is initiating pharmacotherapy for T2DM with HbA1c 9.2%, no CVD, no CKD. What is the current Canadian Diabetes guideline first-line approach?",
    back: "Metformin remains first-line if tolerated (eGFR ≥ 30). Add second agent if HbA1c ≥ 8.5% or not at target after 3 months. CVD or atherosclerosis → add SGLT2i or GLP-1RA regardless of glycemic control (cardiorenal benefit). Heart failure → prefer SGLT2i. CKD with proteinuria → SGLT2i + ACEi/ARB. Target HbA1c ≤ 7% for most; individualize for elderly.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:004",
  },
  {
    front: "A patient with COPD GOLD Group E (high exacerbation risk) is on SABA PRN only. What is the correct Canadian/GOLD inhaler escalation step?",
    back: "GOLD Group E → LAMA + LABA (dual bronchodilation) is initial recommended therapy. If persistent symptoms/exacerbations on dual bronchodilator → add ICS (triple therapy: ICS/LABA/LAMA). ICS NOT recommended as first-line for COPD; reserve for eosinophils ≥ 300 or frequent exacerbations. SABA PRN remains for acute relief.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:005",
  },
  {
    front: "What are the key differences between SSRIs, SNRIs, and bupropion in prescribing for major depressive disorder, and which has the lowest sexual side effect profile?",
    back: "SSRIs (fluoxetine, sertraline, escitalopram): first-line MDD; sexual dysfunction common (30–40%); discontinuation syndrome with short half-life agents. SNRIs (venlafaxine, duloxetine): add norepinephrine; useful for comorbid pain/anxiety; higher BP at higher doses. Bupropion: dopamine/norepinephrine; LOWEST sexual side effects; contraindicated in eating disorders, seizure history; stimulating — avoid in anxiety. Choice based on comorbidities.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:006",
  },
  {
    front: "An NP prescribes warfarin for a patient with mechanical mitral valve. The patient starts ciprofloxacin for a UTI. What is the expected pharmacokinetic interaction and required management?",
    back: "Ciprofloxacin inhibits CYP1A2 and CYP3A4 → reduces warfarin metabolism → INR rises (risk of bleeding). Action: check INR 3–5 days after starting antibiotic, again when antibiotic course ends. Counsel patient on bleeding signs. Consider dose reduction empirically in high-risk patients. Same applies to metronidazole, fluconazole, TMP-SMX (potent warfarin potentiators).",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:007",
  },
  {
    front: "What are the absolute contraindications to metformin in a Canadian NP primary care setting?",
    back: "Absolute contraindications: eGFR < 30 mL/min/1.73m² (hold if < 30; caution 30–45); active liver disease; active alcohol use disorder; iodinated contrast dye (hold 48h before/after if eGFR < 60); metabolic acidosis. Note: prior contraindication for 'heart failure' is no longer absolute — metformin is generally safe in stable CHF.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:008",
  },
  {
    front: "A 74-year-old patient is on 5 medications including an SSRI, tramadol, and ondansetron. What is the prescribing safety concern and how does the NP manage it?",
    back: "Serotonin syndrome risk: SSRIs + tramadol (serotonergic opioid) + ondansetron (5-HT3 antagonist, though primarily blocks not adds serotonin). Classic triad: mental status change + autonomic instability + neuromuscular abnormalities. Management: deprescribe tramadol (substitute non-serotonergic opioid or NSAID if appropriate); discontinue unnecessary serotonergic agents; if syndrome occurs → cyproheptadine, benzodiazepines, ICU if severe.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:009",
  },
  {
    front: "Under Canadian controlled substance regulations, what is required before an NP prescribes opioids for chronic non-cancer pain?",
    back: "Requirements: documented risk assessment (ORT or DIRE tool); signed opioid agreement; urine drug screen at baseline; prescription monitoring program (PMP/PNS) check for double doctoring; documented functional goals (not pain score alone); PDMP check each refill. Start low, go slow: morphine equivalent < 90 mg/day before specialist referral (Canadian Opioid Guideline). Reassess q3 months.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:010",
  },
  {
    front: "What is the prescribing approach for a 28-year-old pregnant patient (16 weeks) with a UTI confirmed by urinalysis and culture positive for E. coli?",
    back: "Treat all bacteriuria in pregnancy (even asymptomatic). Safe antibiotics in mid-pregnancy: nitrofurantoin (avoid at term — risk of neonatal hemolytic anemia), cefalexin, amoxicillin-clavulanate. Avoid: quinolones (tendon/cartilage), TMP-SMX (folate antagonist — avoid 1st trimester and near term), tetracyclines. Duration: 7 days for cystitis in pregnancy. Repeat urine C&S 1 week after treatment.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:011",
  },
  {
    front: "A patient on amiodarone for AFib develops new hypothyroid symptoms. What is the mechanism and prescribing management?",
    back: "Amiodarone is 37% iodine by weight → causes hypothyroidism (iodine load inhibits thyroid synthesis — Wolff-Chaikoff effect) OR hyperthyroidism (iodine excess triggers autonomous thyroid tissue). Hypothyroidism: start levothyroxine; do NOT stop amiodarone without cardiology consult. Hyperthyroidism: urgent endocrinology referral; may require thionamides or steroids. Monitor TFTs every 6 months for all amiodarone patients.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:012",
  },
  {
    front: "What are the key prescribing cautions for lithium that the NP must monitor in a patient with bipolar I disorder?",
    back: "Narrow therapeutic window: target level 0.8–1.0 mEq/L (maintenance); 1.0–1.2 for acute mania. Toxicity risk: dehydration, NSAIDs, ACEi/ARBs, thiazides all INCREASE lithium levels. Monitor: renal function, TFTs, lithium level q6 months (stable). Early toxicity: tremor, polyuria, nausea. Severe: coarse tremor, ataxia, seizures, coma. Check level stat if suspected toxicity — hold dose.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:013",
  },
  {
    front: "A patient starts an ACE inhibitor and develops a dry cough 2 weeks later. What is the mechanism, and what is the appropriate substitution?",
    back: "Mechanism: ACE inhibitors prevent bradykinin breakdown → bradykinin accumulates in lungs → dry non-productive cough (10–15% of patients). Not dose-dependent; will not resolve with dose reduction. Substitution: ARB (e.g., ramipril → losartan). ARBs do NOT block bradykinin degradation → no cough. Note: ACEi-induced angioedema is a separate reaction — ARBs carry small risk of recurrence (switch with caution in angioedema history).",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:014",
  },
  {
    front: "What are the CNPLE-relevant prescribing considerations for antipsychotics in elderly patients with dementia-related psychosis?",
    back: "Black box warning: atypical antipsychotics increase mortality in elderly dementia patients (cerebrovascular events, pneumonia). Use only when non-pharmacologic measures fail and risk to patient/others is significant. If needed: low-dose risperidone (most evidence for BPSD), quetiapine (less EPS). Avoid haloperidol (high EPS, sedation). Metabolic monitoring: weight, fasting glucose, lipids at baseline and q6 months. Attempt dose reduction/discontinuation q6 months.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:015",
  },
  {
    front: "What are the key safety considerations when prescribing GLP-1 receptor agonists (e.g., semaglutide) for T2DM or obesity in a Canadian NP practice?",
    back: "Contraindications: personal/family history of medullary thyroid cancer or MEN2 (black box). Common side effects: nausea, vomiting, diarrhea (start low, titrate slowly). Pancreatitis risk: hold if acute abdominal pain. Do NOT use with DPP-4i (additive but no benefit; cost). Weight loss benefit: 10–15% with semaglutide. Cardiorenal benefit in T2DM with CVD/CKD (prefer over other agents). Monitor renal function (dehydration from GI side effects can worsen CKD).",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:016",
  },
  {
    front: "A patient with stable asthma on low-dose ICS asks the NP about stepping up therapy. What determines the step-up decision per GINA guidelines?",
    back: "Step up if: daytime symptoms > 2 days/week, night waking, SABA use > 2 days/week, activity limitation, or exacerbation requiring OCS in past 12 months. Step 2 (low-dose ICS) → Step 3 (low-dose ICS + LABA or medium ICS). Confirm: adherence, correct inhaler technique, and trigger avoidance before step up. SABA-only treatment is no longer recommended as first-line — all symptomatic patients need ICS. Use written asthma action plan.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:017",
  },
  {
    front: "An NP is initiating HAART for an HIV-positive patient who is also on rifampin for latent TB. What is the key drug interaction and prescribing consideration?",
    back: "Rifampin is a potent CYP3A4 inducer → dramatically reduces levels of most antiretrovirals (especially PIs and some NNRTIs). Interaction: avoid rifampin with most PIs (use rifabutin instead). Efavirenz-based regimens tolerate rifampin better (dose efavirenz 800 mg if > 60 kg). Integrase inhibitors: dolutegravir or raltegravir can be used but requires dose adjustment. Always involve HIV specialist and infectious disease for co-treatment.",
    domain: "CNPLE — Pharmacology & Prescribing",
    sourceKey: "cnple:curated:018",
  },

  // ── Diagnostics & Lab Interpretation (12) ────────────────────────────────────
  {
    front: "A patient presents with fatigue and the NP orders a CBC. Hgb is 88 g/L, MCV 68 fL, ferritin 8 μg/L. What is the interpretation and next diagnostic step?",
    back: "Microcytic hypochromic anemia with low ferritin = iron deficiency anemia (IDA). Next step: identify the CAUSE of iron deficiency. In adults > 50 or with GI symptoms: rule out GI blood loss (fecal occult blood test, colonoscopy). In women of reproductive age: assess menstrual loss, diet. Also check: TIBC (elevated in IDA), reticulocyte count. Treat with elemental iron 150–200 mg/day; recheck CBC in 4–6 weeks.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:019",
  },
  {
    front: "An NP interprets an ECG showing ST elevation ≥ 2 mm in V1–V4 with reciprocal ST depression in II, III, aVF. What is the diagnosis and immediate action?",
    back: "Anterior STEMI (LAD territory). STEMI criteria: ≥ 1 mm in ≥ 2 contiguous limb leads; ≥ 2 mm in V1–V4 (men) / ≥ 1.5 mm in V5–V6 (women). Immediate action: call 911 / activate STEMI protocol; aspirin 162–325 mg PO; 12-lead confirmation; IV access + oxygen if SpO₂ < 90%; AVOID delay — door-to-balloon target < 90 min. Do not administer thrombolytics if PCI available. Mortality benefit with primary PCI > thrombolysis.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:020",
  },
  {
    front: "What are the diagnostic criteria for diabetes mellitus in a Canadian primary care setting, and when is a fasting plasma glucose versus OGTT preferred?",
    back: "Any ONE of: FPG ≥ 7.0 mmol/L (fasting); 2-hour OGTT glucose ≥ 11.1 mmol/L; random glucose ≥ 11.1 mmol/L + symptoms; HbA1c ≥ 6.5% (validated lab). Two abnormal values required if asymptomatic. OGTT preferred: suspected gestational diabetes (24–28 weeks), intermediate FPG (6.1–6.9), post-bariatric surgery. HbA1c less reliable in: hemolytic anemia, hemoglobinopathies, iron deficiency. Pre-diabetes: IFG 6.1–6.9, HbA1c 6.0–6.4%.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:021",
  },
  {
    front: "An NP interprets an ABG: pH 7.28, PaCO₂ 52 mmHg, HCO₃ 23 mEq/L. What is the acid-base disorder and likely cause?",
    back: "Respiratory acidosis (primary): ↓ pH, ↑ PaCO₂. HCO₃ is normal → ACUTE (no metabolic compensation yet). In chronic respiratory acidosis, HCO₃ would be elevated (renal compensation: +1 mEq/L per 10 mmHg rise in PaCO₂ acute; +3.5 mEq/L chronic). Causes: COPD exacerbation, opioid overdose, NMJ disease, obesity hypoventilation. Management: treat underlying cause; caution with high-flow O₂ in COPD (may blunt hypoxic drive).",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:022",
  },
  {
    front: "What is the appropriate HbA1c target for a 76-year-old patient with T2DM who has dementia and recurrent hypoglycemia?",
    back: "For frail elderly with dementia, short life expectancy, or hypoglycemia risk: HbA1c target 7.6–8.5% (Canadian Diabetes guidelines). Avoid tight control — hypoglycemia risk > benefit. Deprescribe sulfonylureas and insulin when possible; prefer metformin (if eGFR allows) or DPP-4i (low hypoglycemia risk). Document individualized target in chart. Reassess quarterly.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:023",
  },
  {
    front: "A TSH is 8.2 mIU/L and free T4 is low-normal. What does this pattern indicate, and when does the NP initiate levothyroxine?",
    back: "Pattern: overt hypothyroidism (elevated TSH + low/low-normal free T4). Treat if: TSH > 10 mIU/L (all patients), TSH 4.5–10 + symptoms (fatigue, cold intolerance, weight gain, constipation, bradycardia), pregnant or planning pregnancy (treat TSH > 2.5), or symptomatic hypothyroidism regardless. Starting dose: 1.6 mcg/kg/day; lower starting dose in elderly (25–50 mcg/day). Recheck TSH in 6–8 weeks after initiation or dose change.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:024",
  },
  {
    front: "An NP orders a troponin in a patient with chest pain. Troponin I is 0.08 ng/mL at 0 hours and 0.18 ng/mL at 3 hours. How is this interpreted?",
    back: "Rising troponin pattern (delta rise ≥ 20% in 3h) in the context of chest pain = acute myocardial infarction (AMI) until proven otherwise. Serial troponins are required (0h and 3h minimum; or 0h/1h if high-sensitivity troponin assay). Single elevated troponin without rise can occur in: CKD, PE, myocarditis, sepsis, CHF (demand ischemia). Action: ECG, aspirin, referral to ED, cardiology consult. Do NOT discharge with rising troponin.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:025",
  },
  {
    front: "A patient has eGFR 42 mL/min/1.73m² (stable for 3 months), albumin-to-creatinine ratio 62 mg/mmol. What CKD stage is this, and what does the NP prioritize?",
    back: "CKD Stage G3b A3 (eGFR 30–44 = G3b; ACR ≥ 30 mg/mmol = A3 — severely increased albuminuria). High/Very high risk category. Priorities: (1) ACEi or ARB to reduce proteinuria and slow progression; (2) BP target < 130/80; (3) SGLT2i if T2DM (additional renoprotection); (4) dietary protein restriction counselling; (5) avoid nephrotoxins (NSAIDs, IV contrast, certain antibiotics); (6) monitor K+, Hgb, bicarbonate q3–6 months. Refer nephrology if rapid progression or dialysis planning.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:026",
  },
  {
    front: "An NP interprets an INR of 4.8 in a warfarin patient with no bleeding. What is the management based on Canadian thrombosis guidelines?",
    back: "INR 4.5–10, no bleeding: hold 1–2 warfarin doses; recheck INR in 24–48h. Do NOT routinely give vitamin K for INR < 10 without bleeding (can cause INR overcorrection and thrombosis risk). For INR > 10 without bleeding: consider low-dose oral vitamin K 1–2 mg PO. For any major bleeding at any INR: 4-factor PCC + IV vitamin K 5–10 mg. Identify cause of supratherapeutic INR: medication change, alcohol, dietary change, illness.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:027",
  },
  {
    front: "A CBC shows: WBC 2.8, Hgb 90 g/L, platelets 88 × 10⁹/L. MCV is 104. What is this pattern called and what is the most likely diagnosis?",
    back: "Pancytopenia with macrocytosis (MCV > 100) = megaloblastic anemia most likely. Causes: B12 deficiency, folate deficiency, or both. Order: serum B12, folate, reticulocyte count, peripheral blood smear (hypersegmented neutrophils = pathognomonic for megaloblastic anemia). B12 deficiency causes: pernicious anemia (anti-IF antibodies), gastric surgery, metformin (↓ B12 absorption), strict vegan diet, Crohn's. Treat B12 deficiency with IM cyanocobalamin if absorption impaired.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:028",
  },
  {
    front: "What does a D-dimer result of 0.8 mg/L in a patient with a Wells Score of 2 (PE moderate probability) mean for the NP's diagnostic pathway?",
    back: "Wells PE Score 2 = intermediate probability. D-dimer of 0.8 mg/L is ELEVATED (normal < 0.5 mg/L in most labs). Elevated D-dimer in intermediate probability → CT pulmonary angiography (CTPA) is REQUIRED. D-dimer alone cannot rule out PE when pre-test probability is intermediate or high. Only rule out PE with D-dimer if Wells ≤ 4 AND D-dimer < 0.5 mg/L. If CTPA confirms PE → anticoagulate (NOAC preferred, LMWH bridge if massive PE).",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:029",
  },
  {
    front: "A lipid panel shows: LDL 4.1 mmol/L, TG 6.8 mmol/L, HDL 0.8 mmol/L. The Framingham 10-year CVD risk is 18%. What is the NP's approach?",
    back: "Intermediate CVD risk (10–19%) with LDL > 3.5 mmol/L → statin therapy recommended (Canadian Cardiovascular Society 2021 guidelines). Elevated TG (> 5.6 = very high; > 10 = pancreatitis risk) → TG-lowering: dietary fat restriction, alcohol reduction, control diabetes, add omega-3 or fibrate if TG > 5.6 and at pancreatitis risk. Target: LDL reduction ≥ 50% from baseline OR LDL < 2.0 mmol/L (high risk). Recheck fasting lipids 6–8 weeks after statin initiation.",
    domain: "CNPLE — Diagnostics & Lab Interpretation",
    sourceKey: "cnple:curated:030",
  },

  // ── Differential Diagnosis (10) ──────────────────────────────────────────────
  {
    front: "A 45-year-old presents with thunderclap headache — worst headache of their life, onset at peak intensity within seconds. What is the immediate diagnostic priority?",
    back: "Thunderclap headache = subarachnoid hemorrhage (SAH) until proven otherwise. Immediate action: non-contrast CT head (85–95% sensitive in first 6h). If CT negative and high suspicion → lumbar puncture at 6–12h after symptom onset (look for xanthochromia or elevated RBCs). Do NOT discharge without ruling out SAH. Other causes: cerebral venous thrombosis, carotid/vertebral dissection, pituitary apoplexy. Avoid lumbar puncture if mass lesion on CT.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:031",
  },
  {
    front: "An NP applies the Ottawa Knee Rules. What are the criteria indicating a need for knee X-ray after injury?",
    back: "Ottawa Knee Rules — X-ray required if ANY of: age ≥ 55 years; isolated patella tenderness (no other bone tenderness); fibular head tenderness; inability to flex knee to 90°; inability to weight-bear immediately and in the ED (4 steps, limping acceptable). Sensitivity 97–99% for clinically significant fractures. If none apply → no X-ray needed, can manage conservatively.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:032",
  },
  {
    front: "A 55-year-old presents with fatigue, weight gain, constipation, cold intolerance, bradycardia, and dry skin. What is the most likely diagnosis, and what confirms it?",
    back: "Classic hypothyroidism presentation. Confirming test: TSH (elevated), followed by free T4 (low) to confirm overt hypothyroidism. Additional: anti-TPO antibodies (positive in Hashimoto's — most common cause in Canada). ECG may show bradycardia, low-voltage QRS. CBC may show macrocytic anemia (B12/folate deficiency common in Hashimoto's). Treatment: levothyroxine; recheck TSH in 6–8 weeks.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:033",
  },
  {
    front: "What are the SNOOP mnemonic red flags for secondary headache that the NP must not miss in primary care?",
    back: "SNOOP: S = Systemic symptoms/signs (fever, weight loss, HIV, cancer); N = Neurological symptoms/signs (focal deficits, altered consciousness); O = Onset sudden (thunderclap); O = Older age (> 50, new headache pattern); P = Progressive pattern or change in established headache character. Any SNOOP flag → urgent workup: CT head, LP, imaging. Cannot attribute new headache to migraine or tension type without ruling out secondary causes.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:034",
  },
  {
    front: "A patient has unilateral lower extremity swelling, warmth, and tenderness. Wells DVT Score is 3 (high probability). What is the NP's diagnostic and management pathway?",
    back: "Wells DVT ≥ 2 = moderate/high probability. Steps: (1) D-dimer if moderate probability; D-dimer is unreliable to rule out if high probability → go straight to imaging. (2) Compression ultrasound (CUS) is the diagnostic standard. (3) If CUS positive → anticoagulate (NOAC preferred; apixaban or rivaroxaban first-line in most patients without cancer). (4) If CUS negative but high clinical suspicion → repeat CUS in 5–7 days. (5) Cancer workup if unprovoked DVT (age/sex-appropriate screening).",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:035",
  },
  {
    front: "A 35-year-old female presents with episodic palpitations, heat intolerance, weight loss, tremor, and exophthalmos. What is the diagnosis and the first-line NP workup?",
    back: "Graves' disease (autoimmune hyperthyroidism) — most common cause of hyperthyroidism with exophthalmos. Workup: TSH (suppressed), free T4 (elevated), free T3 (elevated), TSI (thyroid-stimulating immunoglobulin — diagnostic of Graves', positive in > 95%). Referral: endocrinology. Treatment options: antithyroid drugs (propylthiouracil in 1st trimester; methimazole otherwise), radioactive iodine, thyroidectomy. Beta-blocker (propranolol) for symptom control while awaiting definitive treatment.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:036",
  },
  {
    front: "An older patient presents with new confusion, fever, and pyuria. A colleague attributes it to UTI. What must the NP consider?",
    back: "Asymptomatic bacteriuria (ASB) is common in elderly and does NOT cause isolated delirium. New confusion in elderly has a broad DDx: AEIOU-TIPS (Alcohol/metabolic, Epilepsy, Insulin/glucose, Opioids/drugs, Uremia, Trauma, Infection, Psychiatric, Structural). Do not treat ASB unless the patient is pregnant, about to undergo urologic procedure, or has clear lower/upper UTI symptoms. Workup: CBC, BMP, blood cultures, urinalysis, head CT if focal neuro signs, EEG if seizure suspected. Avoid fluoroquinolones for UTI without culture confirmation.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:037",
  },
  {
    front: "A 40-year-old male presents with progressive dysphagia to solids and liquids, weight loss, and regurgitation of undigested food. What is the most likely diagnosis and key diagnostic test?",
    back: "Classic achalasia presentation (failure of LES relaxation + absent peristalsis). Key test: esophageal manometry (gold standard — shows absent peristalsis and incomplete LES relaxation). Barium esophagram: classic 'bird-beak' appearance. Endoscopy: rule out pseudoachalasia (malignancy at GEJ). CT chest: exclude mediastinal mass. Management: pneumatic dilation or Heller myotomy (surgical); POEM procedure; botulinum toxin injection (temporary). Refer gastroenterology/thoracic surgery.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:038",
  },
  {
    front: "A patient presents with acute monoarthritis of the right first MTP joint with swelling, erythema, and exquisite tenderness. What is the most likely diagnosis, and what confirms it?",
    back: "Gout (podagra) — most common acute monoarthritis at first MTP. Gold standard: joint aspiration + synovial fluid analysis (negatively birefringent needle-shaped urate crystals under polarized light microscopy). Serum uric acid can be normal during acute attack. Do not start urate-lowering therapy during an acute attack. Acute management: NSAIDs (if no contraindications), colchicine (0.5 mg BID with renal adjustment), or oral prednisone. Prophylaxis: allopurinol or febuxostat when attack resolved (target uric acid < 360 μmol/L).",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:039",
  },
  {
    front: "What are the CURB-65 criteria for community-acquired pneumonia, and how does the NP use the score to make admission/discharge decisions?",
    back: "CURB-65: C = Confusion (new); U = Urea > 7 mmol/L; R = Respiratory rate ≥ 30/min; B = Blood pressure SBP < 90 or DBP ≤ 60 mmHg; 65 = age ≥ 65 years. Score 0–1: outpatient treatment. Score 2: consider short-stay hospital admission. Score ≥ 3: inpatient treatment; ICU if score 4–5. Outpatient CAP treatment: amoxicillin 500 mg TID (5 days); doxycycline if atypical suspected; azithromycin if allergy. Add macrolide for inpatient to cover atypicals.",
    domain: "CNPLE — Differential Diagnosis",
    sourceKey: "cnple:curated:040",
  },

  // ── Acute & Urgent Care (8) ───────────────────────────────────────────────────
  {
    front: "A 22-year-old with peanut allergy develops urticaria, stridor, and hypotension 5 minutes after eating at a restaurant. What is the NP's immediate management?",
    back: "Anaphylaxis. Immediate management: (1) Epinephrine IM 0.3–0.5 mg (1:1000 solution) into lateral thigh — first and most critical step. (2) Lay patient flat, elevate legs (if no respiratory distress). (3) Call 911 / activate emergency response. (4) IV access, 0.9% NaCl 1–2L bolus. (5) Diphenhydramine and ranitidine (adjuncts, not primary treatment). (6) Salbutamol nebulized for bronchospasm. (7) Observe ≥ 4 hours (biphasic reaction risk). Discharge: epinephrine auto-injector prescription, allergist referral, medic-alert bracelet.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:041",
  },
  {
    front: "A patient presents to urgent care with BP 210/130 mmHg, headache, and papilledema on fundoscopy. How does the NP distinguish hypertensive emergency from urgency, and what is the immediate management?",
    back: "Hypertensive emergency: severe hypertension + end-organ damage (encephalopathy, papilledema, MI, acute HF, aortic dissection, AKI). Urgency: severe hypertension without end-organ damage. Emergency management: CALL 911 — IV labetalol, nicardipine, or sodium nitroprusside; target BP reduction ≤ 25% in first hour (do NOT drop precipitously — risk of cerebral ischemia). Urgency: oral antihypertensives, close follow-up in 24–48h. Do not use sublingual nifedipine (uncontrolled BP drop).",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:042",
  },
  {
    front: "A patient is brought in with DKA. Blood glucose is 28 mmol/L, pH 7.18, bicarbonate 12 mEq/L, anion gap 22. What are the first 3 management priorities?",
    back: "(1) IV fluid resuscitation: 0.9% NaCl 1L over 1 hour (correct volume depletion first). (2) Insulin infusion: 0.1 units/kg/hour IV regular insulin (not SC). Do NOT start insulin before fluids if severely hypovolemic. (3) Potassium replacement: check K+ before starting insulin. If K+ < 3.5 → replace K+ before insulin (risk of fatal hypokalemia as insulin drives K+ into cells). Target: glucose decrease 2–4 mmol/L/hour. Add dextrose when glucose < 14 to avoid hypoglycemia while continuing insulin to close the gap.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:043",
  },
  {
    front: "What is the qSOFA score, and at what threshold should the NP escalate care for a patient suspected of having sepsis?",
    back: "qSOFA (quick Sepsis-related Organ Failure Assessment): (1) RR ≥ 22/min; (2) Altered mental status (GCS < 15); (3) SBP ≤ 100 mmHg. Score ≥ 2 = high risk for organ dysfunction/death → escalate immediately. In-hospital: escalate to SOFA score + blood cultures × 2 + lactate. Surviving Sepsis bundle: blood cultures BEFORE antibiotics, broad-spectrum antibiotics within 1 hour, 30 mL/kg IV crystalloid if hypotension/lactate ≥ 4 mmol/L. Reassess lactate at 2–4h.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:044",
  },
  {
    front: "A 19-year-old student has a tonic-clonic seizure lasting 8 minutes and does not regain consciousness. What is the management of status epilepticus?",
    back: "Seizure > 5 min = treat as status epilepticus. Phase 1 (0–5 min): ABCs, IV access, glucose check (D50 if hypoglycemic), oxygen. Phase 2 (5–20 min): benzodiazepine — lorazepam 4 mg IV preferred (or diazepam 10 mg IV/PR, midazolam 10 mg IM if no IV). Phase 3 (20–40 min): if no response → phenytoin/fosphenytoin IV or levetiracetam IV or valproate IV. Phase 4 (> 40 min): refractory status → anesthesia (propofol, midazolam infusion, pentobarbital) + EEG monitoring in ICU.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:045",
  },
  {
    front: "What is the Canadian Stroke Network FAST mnemonic, the tPA eligibility window, and the two key contraindications the NP must recognize?",
    back: "FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911. tPA (alteplase) eligibility: onset < 4.5 hours (CT confirms no hemorrhage). Key absolute contraindications: (1) prior intracranial hemorrhage; (2) head trauma or stroke within 3 months; (3) active bleeding or bleeding diathesis; (4) BP > 185/110 (treat first). Door-to-needle target: < 60 minutes. Endovascular thrombectomy: up to 24 hours for large vessel occlusion with salvageable tissue on imaging.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:046",
  },
  {
    front: "A 32-year-old presents to the walk-in clinic with severe chest pain radiating to the back, described as 'tearing,' BP left arm 145/90 and right arm 105/60. What does this suggest and what is the immediate action?",
    back: "Aortic dissection — unequal BP between arms (> 20 mmHg) is highly suggestive. Tearing/ripping pain radiating to back = classic Stanford Type A or B dissection. Immediate: call 911, DO NOT perform thrombolysis or anticoagulate. IV access, two large-bore IVs, pain management, heart rate/BP control (IV labetalol to prevent extension). Diagnostic: CT angiography aorta (chest/abdomen/pelvis). Type A (ascending aorta) = surgical emergency. Type B = medical management with BP control unless complicated.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:047",
  },
  {
    front: "A patient on warfarin presents with sudden onset right hemiplegia and expressive aphasia. Head CT shows no hemorrhage. INR is 3.2. Can tPA be given?",
    back: "No. INR > 1.7 is a contraindication to IV tPA. With INR 3.2, thrombolysis is contraindicated (risk of hemorrhagic transformation). Assess for mechanical thrombectomy eligibility (INR is NOT a contraindication to thrombectomy). Consult neurology urgently. If INR supratherapeutic in hemorrhagic stroke (different scenario): reverse with 4-factor PCC + vitamin K. This case: proceed with CT angiography, activate stroke team, discuss thrombectomy.",
    domain: "CNPLE — Acute & Urgent Care",
    sourceKey: "cnple:curated:048",
  },

  // ── Women's Health (10) ───────────────────────────────────────────────────────
  {
    front: "A 28-year-old presents with irregular periods, hirsutism, acne, and BMI 31. What are the diagnostic criteria for PCOS per Rotterdam consensus?",
    back: "Rotterdam criteria (2 of 3 required): (1) Oligo/anovulation; (2) Clinical or biochemical hyperandrogenism (hirsutism, acne, elevated testosterone/DHEA-S/free androgen index); (3) Polycystic ovarian morphology on ultrasound (≥ 20 follicles per ovary OR ovarian volume ≥ 10 mL). Exclude other causes: thyroid disease (TSH), hyperprolactinemia (prolactin), adrenal hyperplasia (17-OHP if virilized). Metabolic risk: screen for insulin resistance, T2DM (OGTT), dyslipidemia.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:049",
  },
  {
    front: "What are the PALM-COEIN causes of abnormal uterine bleeding, and how does the NP differentiate structural from non-structural causes?",
    back: "PALM = Structural: Polyp, Adenomyosis, Leiomyoma (fibroid), Malignancy/hyperplasia. COEIN = Non-structural: Coagulopathy, Ovulatory dysfunction, Endometrial, Iatrogenic, Not otherwise classified. Initial workup: pregnancy test (always), CBC, TSH, coagulation screen (if heavy bleeding since menarche), pelvic ultrasound (TVUS preferred). Endometrial biopsy: for women ≥ 45 or risk factors for hyperplasia (obesity, PCOS, tamoxifen). Referral: persistent AUB unresponsive to medical therapy or structural lesion.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:050",
  },
  {
    front: "A 26-year-old presents requesting emergency contraception 52 hours after unprotected intercourse. What are the options and their efficacy at this timepoint?",
    back: "Options at 52 hours: (1) LNG (Plan B / Next Choice): effective within 72h but efficacy declining by 52h (~75% overall, lower at later times); less effective if BMI > 75 kg. (2) Ulipristal acetate (Ella): more effective at 52–72h, up to 120h. (3) Copper IUD: most effective (> 99%) up to 5 days; also provides ongoing contraception. At 52 hours: ulipristal acetate is preferred over LNG due to better late-window efficacy. Copper IUD best option if patient wants ongoing contraception.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:051",
  },
  {
    front: "An NP conducts antenatal care for a patient at 26 weeks. What is the Canadian recommended screening for gestational diabetes?",
    back: "Canadian Diabetes guideline: universal screening at 24–28 weeks with 50g GCT (oral 50g glucose, 1h plasma glucose). If GCT ≥ 7.8 mmol/L → proceed to 75g OGTT (2-hour). GDM diagnosis: fasting ≥ 5.1 mmol/L, 1h ≥ 10.0 mmol/L, 2h ≥ 8.5 mmol/L (any one value). High-risk women (prior GDM, PCOS, BMI ≥ 30, first-degree family history): screen at first prenatal visit AND again at 24–28 weeks. Insulin is preferred pharmacotherapy in GDM (metformin acceptable as alternative).",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:052",
  },
  {
    front: "What are the diagnostic criteria for preeclampsia, and what is the immediate NP management when BP is 160/110 mmHg at 34 weeks gestation?",
    back: "Preeclampsia: BP ≥ 140/90 on two occasions ≥ 4h apart after 20 weeks + proteinuria (≥ 300 mg/24h) OR end-organ damage (platelets < 100, AKI, liver dysfunction, pulmonary edema, new headache/visual disturbance). Severe features: SBP ≥ 160 or DBP ≥ 110. Immediate action at 160/110: antihypertensive therapy (IV labetalol or IV hydralazine; oral nifedipine fast-release); magnesium sulfate for seizure prophylaxis; call obstetrics urgently. Delivery is definitive treatment — timing depends on gestational age and severity.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:053",
  },
  {
    front: "A patient 4 weeks postpartum presents with low mood, inability to bond with her baby, insomnia despite tiredness, and hopelessness. What is the assessment and management approach?",
    back: "Postpartum depression (PPD): onset typically 2 weeks to 3 months postpartum. Use Edinburgh Postnatal Depression Scale (EPDS) ≥ 10 = concerning; ≥ 13 = probable depression. Distinguish from: baby blues (peaks day 3–5, resolves by 2 weeks) and postpartum psychosis (hallucinations, delusions — psychiatric emergency). Management PPD: psychotherapy (CBT first-line for mild-moderate); SSRI (sertraline or paroxetine — both compatible with breastfeeding). Safety screening: ask about suicidal ideation and infanticidal thoughts (requires urgent psychiatric consultation if positive).",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:054",
  },
  {
    front: "A 52-year-old perimenopausal patient asks about hormone therapy for hot flashes and sleep disruption. What are the key considerations per Canadian Menopause Society guidance?",
    back: "Hormone therapy (HT) is the most effective treatment for vasomotor symptoms. Systemic HT: estrogen + progestogen (if uterus intact); estrogen-only (post-hysterectomy). Relative contraindications: breast cancer history (discuss risks), DVT/PE, active CV disease (use with caution), unexplained vaginal bleeding. Lowest effective dose for shortest necessary duration (< 5 years for most). Alternative: low-dose SSRIs/SNRIs (venlafaxine, paroxetine) for HT-intolerant patients. Vaginal atrophy: low-dose topical estrogen safe even in breast cancer history.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:055",
  },
  {
    front: "What is the CTFPHC-recommended cervical cancer screening approach in Canada, and what changed with the adoption of primary HPV testing?",
    back: "Current Canadian approach (CTFPHC 2023 update): HPV primary testing every 5 years (ages 25–65) is replacing cytology. Where still using Pap: cytology every 3 years (ages 25–69). HPV-positive result: reflex to genotyping or cytology co-test; HPV 16/18 → colposcopy; other high-risk HPV + normal cytology → repeat HPV in 12 months. Start screening at age 25 (not earlier); stop at 69 if adequate recent negative screening. HPV vaccination does not eliminate need for screening.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:056",
  },
  {
    front: "A patient presents with 3-day history of dysuria, frequency, and suprapubic pain. No fever or flank pain. Urinalysis shows nitrites positive, leukocyte esterase positive. What is the NP management for uncomplicated cystitis?",
    back: "Uncomplicated lower UTI in non-pregnant adult female. First-line treatment (Canadian guidelines): nitrofurantoin macrocrystals 100 mg BID × 5 days, or TMP-SMX 160/800 mg BID × 3 days (check local resistance patterns — > 20% resistance in some regions). Avoid fluoroquinolones for uncomplicated UTI (stewardship). No need for urine C&S for uncomplicated first-time UTI; culture if recurrent, treatment failure, or atypical. Male UTI, upper UTI signs, pregnancy → culture + broader workup required.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:057",
  },
  {
    front: "What is the NP's approach to a patient requesting intrauterine device (IUD) insertion who has a history of a previous PID 3 years ago?",
    back: "Prior PID is NOT a contraindication to IUD insertion if the PID was treated and resolved > 3 months ago (WHO MEC Category 1–2). Screen for STIs (gonorrhea, chlamydia NAAT) before insertion; treat if positive before proceeding. Active PID or STI = defer insertion until treated. Levonorgestrel IUD (Mirena, Kyleena) and copper IUD are both options. Counsel: IUD does not protect against STIs; advise condom use if STI risk ongoing. Insert after negative STI screen if preferred.",
    domain: "CNPLE — Women's Health",
    sourceKey: "cnple:curated:058",
  },

  // ── Mental Health (8) ─────────────────────────────────────────────────────────
  {
    front: "A patient scores 16 on the PHQ-9. They endorse passive suicidal ideation with no plan or intent. What are the NP's next steps?",
    back: "PHQ-9 ≥ 15 = moderately severe depression. Passive SI without plan: conduct safety assessment (Columbia Suicide Severity Rating Scale or similar); establish safety plan collaboratively; involve supports; increase follow-up frequency. Initiate SSRI (sertraline 50 mg start) + psychotherapy referral (CBT). Active SI with plan/intent: crisis intervention, emergency referral (may require involuntary psychiatric hold per provincial Mental Health Act). Document safety planning conversation and disclosure.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:059",
  },
  {
    front: "What are the DSM-5 criteria that distinguish bipolar I from bipolar II disorder?",
    back: "Bipolar I: ≥ 1 manic episode (duration ≥ 7 days OR hospitalization OR psychotic features). Manic episode: elevated/irritable mood + increased energy + ≥ 3 additional symptoms (grandiosity, decreased sleep need, pressured speech, racing thoughts, distractibility, increased goal-directed activity, risky behavior). Depressive episodes not required for Bipolar I. Bipolar II: ≥ 1 hypomanic episode (≥ 4 days, same criteria but less severe, no hospitalization/psychosis) + ≥ 1 major depressive episode; no full manic episode ever.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:060",
  },
  {
    front: "A 38-year-old patient with PTSD asks about pharmacotherapy options. What does current Canadian evidence support?",
    back: "First-line pharmacotherapy for PTSD (CANMAT 2023): SSRIs — paroxetine and sertraline (strongest evidence); SNRIs — venlafaxine. Add prazosin for trauma-related nightmares (alpha-1 blocker). Benzodiazepines: NOT recommended (worsen dissociation, poor long-term outcomes, abuse risk). Antipsychotics (quetiapine, risperidone): adjunctive, not first-line. Psychotherapy (CPT, prolonged exposure, EMDR) is first-line — combine with pharmacotherapy for severe PTSD. Monitor for comorbid depression and substance use.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:061",
  },
  {
    front: "An NP screens for alcohol use with the AUDIT-C. Score is 7/12 (male). What does this indicate and what is the brief intervention approach?",
    back: "AUDIT-C ≥ 4 (women) / ≥ 5 (men) = hazardous/harmful drinking. Score 7 in a male = moderate-high alcohol use disorder risk. Brief intervention: 5 A's or FRAMES approach (Feedback, Responsibility, Advice to change, Menu of options, Empathy, Self-efficacy). Offer referral to addiction medicine, motivational interviewing. CIWA-Ar for withdrawal risk assessment if stopping abruptly. Pharmacotherapy for AUD: naltrexone (reduces craving/relapse), acamprosate (reduces withdrawal symptoms), disulfiram (aversion). Screen for thiamine deficiency (Wernicke's encephalopathy risk).",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:062",
  },
  {
    front: "A patient on clozapine for treatment-resistant schizophrenia presents with fever (38.9°C), sore throat, and fatigue. What is the NP's immediate concern and management?",
    back: "Clozapine-induced agranulocytosis — potentially fatal. Immediate: CBC + differential STAT. If neutrophil count < 1.0 × 10⁹/L (absolute neutropenia): STOP clozapine immediately, notify prescribing psychiatrist, refer to ED for neutropenic precautions and possible filgrastim. Monitoring requirements in Canada: CBC weekly × 6 months, then bi-weekly × 6 months, then monthly. Patient cannot be re-challenged with clozapine after agranulocytosis. Other clozapine risks: myocarditis (first 4 weeks), metabolic syndrome, seizures, ileus.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:063",
  },
  {
    front: "What clinical features distinguish delirium from dementia in an older hospitalized patient?",
    back: "Delirium: ACUTE onset (hours to days), FLUCTUATING course, IMPAIRED attention (primary deficit), disorganized thinking. Dementia: GRADUAL onset (months to years), STABLE or slowly progressive course, INTACT attention (early) with memory deficit. Key: in delirium, level of consciousness is often impaired; in early dementia it is preserved. Both can coexist (delirium superimposed on dementia — common and worsens prognosis). Confusion Assessment Method (CAM): acute onset + fluctuating course + inattention + disorganized thinking = delirium. Non-pharmacologic management first: reorientation, reduce medications, treat underlying cause.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:064",
  },
  {
    front: "What are the key monitoring parameters for a patient starting an atypical antipsychotic (e.g., olanzapine, quetiapine)?",
    back: "Metabolic monitoring (CNPLE-relevant — Canadian guideline): at baseline and q3 months for first year, then annually: weight/BMI, waist circumference, fasting glucose/HbA1c, fasting lipids, BP, fasting insulin (some guidelines). Movement disorder monitoring: EPS (extrapyramidal symptoms), tardive dyskinesia (AIMS scale q6 months). QTc: baseline ECG, repeat if dose change (clozapine, ziprasidone — highest QTc risk). Prolactin: if galactorrhea, amenorrhea, sexual dysfunction (risperidone, haloperidol highest risk). Weight gain highest with olanzapine and clozapine.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:065",
  },
  {
    front: "A 16-year-old is brought in by parents concerned about rapid weight loss, amenorrhea, lanugo, and food restriction rituals. What is the NP assessment and immediate safety threshold?",
    back: "Anorexia nervosa: restriction + low weight + fear of weight gain + disturbed body image. Medical instability criteria requiring urgent hospitalization: HR < 50 bpm, BP < 90/60, syncope, QTc prolongation, rapid weight loss (> 1 kg/week), electrolyte abnormalities (hypophosphatemia, hypokalemia, hyponatremia). Refeeding syndrome risk: monitor phosphate, K+, Mg²+ when initiating nutrition support. Refer eating disorder specialty program. SSRI: NOT effective in anorexia (low evidence); fluoxetine used in bulimia nervosa. Family-based therapy (FBT) is first-line for adolescents.",
    domain: "CNPLE — Mental Health",
    sourceKey: "cnple:curated:066",
  },

  // ── Pediatrics (8) ────────────────────────────────────────────────────────────
  {
    front: "A 6-week-old febrile infant (temp 38.5°C rectally) is brought to the clinic. What is the NP's management priority?",
    back: "Fever in infant < 3 months = medical emergency until proven otherwise. Immediate: refer to ED. Do not attempt outpatient management. Workup in ED: CBC, blood culture, urinalysis and urine culture (catheterized), LP (lumbar puncture — meningitis must be excluded), CRP/procalcitonin. Empiric IV antibiotics started immediately after cultures (ampicillin + gentamicin or ampicillin + cefotaxime). Reason: immune system immature; Group B Strep, E. coli, Listeria meningitis can progress in hours.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:067",
  },
  {
    front: "What are the developmental red flags at 18 months that require immediate pediatric/developmental referral?",
    back: "18-month red flags: no words spoken (< 6 words); no pointing, waving, or showing; does not follow simple commands; does not walk independently; loss of previously acquired skills (regression — always refer urgently). Normal 18-month milestones: 10–20 words, points to body parts, uses spoon, walks independently, imitates actions. Regression of language or social skills at any age → urgent developmental evaluation + autism spectrum disorder assessment. M-CHAT-R/F at 18 and 24 months is recommended screening tool.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:068",
  },
  {
    front: "An NP sees a 3-year-old with recurrent episodes of low-grade fever, bulging fontanelle, and stiff neck. What are the clinical signs of bacterial meningitis in a toddler and the immediate management?",
    back: "Classic signs (may be absent in young children): Kernig's (inability to extend knee with hip flexed 90°), Brudzinski's (involuntary hip flexion on neck flexion), bulging fontanelle, fever, photophobia, neck stiffness, petechiae/purpura (meningococcal). Immediate management: DO NOT delay antibiotics for LP if LP will be delayed > 30 minutes. Empiric IV ceftriaxone (third-generation cephalosporin) + dexamethasone (reduces hearing loss in H. influenzae/S. pneumoniae). LP after CT if papilledema/focal deficits present. Admit to PICU.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:069",
  },
  {
    front: "What are the clinical features distinguishing croup from epiglottitis in a child with stridor, and how does management differ?",
    back: "Croup (laryngotracheobronchitis, viral, 6 months–3 years): gradual onset, barky 'seal-like' cough, inspiratory stridor, mild-moderate respiratory distress, WELL-appearing, low grade fever, Steeple sign on X-ray. Treatment: dexamethasone 0.6 mg/kg PO/IM (single dose), racemic epinephrine nebulized if moderate-severe distress, humidified air, observe 2–4h. Epiglottitis (Hib — now rare post-vaccination): SUDDEN high fever, toxic appearance, DROOLING, dysphagia, tripod position, absent cough — EMERGENCY. Call anesthesia immediately, do NOT examine throat, secure airway in OR.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:070",
  },
  {
    front: "A 5-year-old presents with their first febrile seizure lasting 2 minutes. Temperature is 39°C. No neurologic deficits. What is the management and family counselling?",
    back: "Simple febrile seizure: age 6 months–5 years, generalized, < 15 minutes, single seizure within 24 hours, no postictal focal deficits. Management: assess after seizure; if recovered and no meningism signs → no LP required. Check glucose. No urgent CT needed for simple febrile seizure. Counsel parents: recurrence risk 30%; does not cause epilepsy; does not cause brain damage from the seizure itself. No anticonvulsant prophylaxis recommended for simple febrile seizure (risks > benefits). Complex febrile seizure: focal, > 15 min, or multiple in 24h → further workup.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:071",
  },
  {
    front: "What are the key NACI-recommended vaccines on the Canadian infant immunization schedule at 2, 4, and 6 months?",
    back: "Canadian immunization schedule (NACI): 2, 4, 6 months: DTaP-IPV-Hib (diphtheria, tetanus, acellular pertussis, polio, Hib); PCV-13 (pneumococcal conjugate); Men-C-C or Men-C-ACYW (meningococcal C or ACYW conjugate); Rotavirus oral vaccine (2 and 4 months in most provinces). At 2 months only: Hepatitis B (in some provinces). Province-specific variations exist for BCG (TB), influenza (≥ 6 months), and Men-B. Always consult provincial immunization schedule for current recommendations.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:072",
  },
  {
    front: "A 4-year-old has a hemoglobin of 95 g/L with MCV 62 fL. The parents are from Southeast Asia. What additional test should the NP order before treating with iron supplementation?",
    back: "High suspicion for thalassemia trait (alpha or beta-thalassemia minor) given Southeast Asian heritage and microcytic anemia. Order: hemoglobin electrophoresis (or HPLC) to differentiate IDA from thalassemia trait. Thalassemia trait: elevated HbA2 (> 3.5%) = beta-thalassemia minor; normal HbA2 with microcytosis = alpha-thalassemia. Do NOT give iron supplementation without excluding thalassemia — iron supplementation is ineffective for thalassemia trait and can cause iron overload. Genetic counselling if both parents are carriers.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:073",
  },
  {
    front: "A parent is concerned their 7-year-old has ADHD. The NP uses DSM-5 criteria. What are the minimum diagnostic requirements and what is recommended before prescribing stimulants?",
    back: "DSM-5 ADHD criteria: ≥ 6 symptoms (inattention or hyperactivity/impulsivity) in children < 17 years; ≥ 5 symptoms for age ≥ 17. Symptoms present in ≥ 2 settings, onset before age 12, functionally impairing, not better explained by another disorder. Minimum workup before prescribing: structured rating scales from parent AND teacher (Conners', SNAP-IV, Vanderbilt); physical exam (BP, HR, weight); vision/hearing screen; rule out sleep disorder, anxiety, learning disability, thyroid dysfunction. First-line pharmacotherapy ≥ 6 years: methylphenidate (school age) or amphetamine. Non-stimulant option: atomoxetine. Lifestyle and behavioural therapy: first-line in < 6 years.",
    domain: "CNPLE — Pediatrics",
    sourceKey: "cnple:curated:074",
  },

  // ── Geriatrics (5) ────────────────────────────────────────────────────────────
  {
    front: "An 82-year-old with osteoporosis, COPD, hypertension, and depression is on 9 medications. What screening tool does the NP use to identify potentially inappropriate prescriptions?",
    back: "STOPP/START criteria (Screening Tool of Older Persons' Prescriptions / Screening Tool to Alert to Right Treatment) — validated for Canadian NP practice. STOPP identifies potentially inappropriate medications in older adults (e.g., NSAIDs in CKD/HF, benzodiazepines > 4 weeks, antipsychotics for insomnia). START identifies appropriate medications being withheld (e.g., ACEi in systolic HF, bisphosphonate in osteoporosis on corticosteroids). Also: Beers Criteria (US-focused but widely referenced). Goal: deprescribe with patient consent and monitoring.",
    domain: "CNPLE — Geriatrics",
    sourceKey: "cnple:curated:075",
  },
  {
    front: "What are the key components of a falls risk assessment for a community-dwelling older adult, and what are the evidence-based interventions?",
    back: "Falls risk assessment: TUG test (> 12 sec = high risk), orthostatic BP (> 20/10 mmHg drop = orthostatic hypotension), medication review (polypharmacy, benzodiazepines, antihypertensives, opioids), vision assessment, muscle strength, gait/balance assessment. Evidence-based interventions: multifactorial (exercise + medication review + home hazard assessment = highest level). Exercise: Otago programme, Tai Chi (reduces falls 25–30%). Vitamin D 1000–2000 IU/day (reduces falls in deficient patients). Footwear assessment. Home safety modifications. Stop unnecessary psychotropics.",
    domain: "CNPLE — Geriatrics",
    sourceKey: "cnple:curated:076",
  },
  {
    front: "A family member asks the NP about advance care planning for their 78-year-old parent with moderate Alzheimer's dementia. What should the NP address?",
    back: "Advance care planning (ACP) should begin EARLY — while patient retains capacity. Components: (1) Determine decision-making capacity (functional assessment); (2) Identify healthcare proxy/substitute decision maker (SDM) per provincial legislation (e.g., Ontario HCCA, British Columbia RSCA); (3) Complete advance directive (living will / personal directive); (4) Document goals of care (full resuscitation vs. comfort-focused); (5) Update regularly as condition progresses. Goals of care discussions: use the SPIKES framework. Clarify CPR preferences when patient still has capacity to participate.",
    domain: "CNPLE — Geriatrics",
    sourceKey: "cnple:curated:077",
  },
  {
    front: "What are the diagnostic criteria for moderate Alzheimer's disease, and what cholinesterase inhibitor dosing does the NP use?",
    back: "Moderate AD: CDR (Clinical Dementia Rating) score 2; MMSE typically 10–20; significant functional decline (ADL assistance required). Cholinesterase inhibitors (approved in Canada): donepezil 5 mg/day → increase to 10 mg after 4–6 weeks; rivastigmine (also patch formulation); galantamine. Start at lowest dose, titrate slowly. Adverse effects: nausea, diarrhea, bradycardia (caution in sick sinus syndrome). Memantine (NMDA antagonist): licensed for moderate-severe AD; can combine with cholinesterase inhibitor. Set realistic expectations with family (slow disease course, not reversal).",
    domain: "CNPLE — Geriatrics",
    sourceKey: "cnple:curated:078",
  },
  {
    front: "An 80-year-old patient's family requests aggressive nutrition support (NG tube feeding) for end-stage dementia. How does the NP approach this ethically and clinically?",
    back: "Tube feeding in end-stage dementia: no evidence of benefit; associated with aspiration pneumonia, pressure ulcers, patient discomfort. Clinical evidence: does not prolong survival or improve quality of life in end-stage dementia. Ethical approach: (1) Clarify decision-making capacity of patient; (2) Explore family's values and fears; (3) Explain evidence-based information; (4) Explore what patient would have wanted (ACP, previously expressed wishes); (5) Offer palliative-comfort feeding (hand-feeding, soft foods as tolerated). Document goals-of-care conversation; involve palliative care team.",
    domain: "CNPLE — Geriatrics",
    sourceKey: "cnple:curated:079",
  },

  // ── Primary Care & Prevention (10) ───────────────────────────────────────────
  {
    front: "According to CTFPHC recommendations, what is the Canadian breast cancer screening guideline for average-risk women aged 50–74?",
    back: "CTFPHC (2018): mammography every 2–3 years for women 50–74 (average risk). Age 40–49: no routine screening recommended for average-risk women (benefits do not outweigh harms of false positives and over-diagnosis); discuss if patient requests. High-risk women (BRCA1/2, first-degree relative with premenopausal BC, prior chest radiation): annual MRI + mammography starting at 30–40 depending on mutation. Note: CTFPHC guidelines are controversial — some provinces (e.g., Ontario) still recommend age 40+ in certain populations. Know the Canadian national guideline for CNPLE.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:080",
  },
  {
    front: "What is the CTFPHC recommendation for colorectal cancer screening in average-risk Canadians aged 50–74?",
    back: "CTFPHC (2016): fecal immunochemical test (FIT) every 2 years OR flexible sigmoidoscopy every 10 years for average-risk adults aged 50–74. Colonoscopy: not recommended as first-line screening for average-risk adults (evidence insufficient for benefit > risk in screening context). Higher risk (personal/family history of CRC, adenomatous polyps, IBD, inherited syndrome): colonoscopy with shorter intervals per specialist guidance. Positive FIT → colonoscopy. CNPLE: know the non-invasive screening-first approach.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:081",
  },
  {
    front: "A 45-year-old male smoker (20 pack-years, currently smoking) asks about lung cancer screening. What is the NP's recommendation per Canadian guidelines?",
    back: "Lung cancer screening (CTFPHC / Canadian lung cancer screening programs): low-dose CT (LDCT) annually recommended for high-risk adults aged 50–74 who have ≥ 20 pack-year history AND currently smoke OR quit within past 15 years. Discuss benefits/harms: detection of early-stage cancers vs. false positives, overdiagnosis, radiation, invasive follow-up. Smoking cessation counselling is mandatory component of screening visit. This patient (45 years old) is below the age threshold — recommend cessation counselling, revisit screening eligibility at 50.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:082",
  },
  {
    front: "What are the NACI-recommended adult immunizations the NP should assess at a routine health visit for a 65-year-old with COPD and diabetes?",
    back: "High-priority adults ≥ 65 with chronic disease: (1) Influenza: annually (high-dose or adjuvanted preferred in ≥ 65). (2) Pneumococcal: PCV15 or PCV20 (pneumococcal conjugate) × 1 dose if not previously vaccinated; PPSV23 if only PPSV23 given — follow NACI sequential schedule. (3) RSV vaccine: single dose ≥ 60 years (NACI 2023). (4) COVID-19: current booster per NACI interval recommendation. (5) Zoster (shingles): Shingrix (recombinant) 2 doses preferred over Zostavax (live) in immunocompromised. (6) Td/Tdap: booster q10 years.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:083",
  },
  {
    front: "What are the CTFPHC criteria for initiating osteoporosis screening with DEXA in a Canadian primary care setting?",
    back: "CTFPHC (2023): DEXA screening recommended for: (1) women ≥ 65 (regardless of risk factors); (2) postmenopausal women 50–64 with ≥ 1 clinical risk factor (fragility fracture, parental hip fracture, glucocorticoid use > 3 months, current smoking, BMI < 18.5, excessive alcohol ≥ 3 drinks/day). Men ≥ 70 (or 50–69 with high-risk factors). Use FRAX or CAROC tool to estimate 10-year fracture risk before DEXA to guide need. Bisphosphonate treatment: FRAX 10-year major osteoporotic fracture risk ≥ 20% OR T-score ≤ −2.5.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:084",
  },
  {
    front: "What are the Canadian hypertension (CHEP/Hypertension Canada) thresholds for initiating antihypertensive therapy in adults without diabetes or CKD?",
    back: "Hypertension Canada 2020: Diagnose hypertension at BP ≥ 130/80 mmHg (average of ≥ 2 readings at ≥ 2 visits). Treatment threshold: lifestyle modifications for all; pharmacotherapy for: Stage 1 (130–139/80–89) with CVD or 10-year Framingham risk ≥ 15%; Stage 2 (≥ 140/90) — pharmacotherapy recommended. Treatment target: < 130/80 mmHg for most patients (especially high cardiovascular risk, per SPRINT trial alignment). Lifestyle: DASH diet, sodium < 2g/day, 150 min/week aerobic activity, limit alcohol, smoking cessation.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:085",
  },
  {
    front: "A 48-year-old patient with T2DM has no symptoms of cardiovascular disease. What cardiovascular risk assessment approach does the NP use per Canadian guidelines?",
    back: "Canadian Cardiovascular Society (CCS) 2021: In T2DM, use Framingham Risk Score or CCS cardiovascular risk calculator. Patients with T2DM AND any high-risk feature (kidney disease, macroalbuminuria, age ≥ 40 + 10-year CV risk ≥ 20%, age ≥ 60, LVH, retinopathy) → HIGH risk → treat with statin regardless of LDL level. For DM patients without high-risk features and 10-year risk 10–19%: consider statin if LDL > 3.5 mmol/L. SGLT2i/GLP-1RA have primary CV risk reduction benefit in T2DM with established CVD.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:086",
  },
  {
    front: "What are the key elements of brief counselling for smoking cessation in a primary care setting using the 5 A's model?",
    back: "5 A's framework: Ask (screen every patient for tobacco use); Advise (clear, personalized recommendation to quit — 'quitting is the single most important thing you can do for your health'); Assess (readiness to quit — contemplation stage); Assist (set quit date, prescription NRT/bupropion/varenicline, self-help resources, quitline referral); Arrange (follow-up within 1–2 weeks post-quit date). Most effective pharmacotherapy: combination NRT (patch + short-acting) or varenicline (Champix). Varenicline: most effective single agent; screen for neuropsychiatric symptoms. B12 counselling for recent cannabis smokers.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:087",
  },
  {
    front: "What social determinants of health (SDOH) screening elements are relevant to Canadian NP primary care practice?",
    back: "SDOH domains (WHO/Canadian Framework): income and social protection; education; food security; housing stability; employment; social inclusion; access to healthcare; early childhood development; Indigenous health and structural racism. Screening tools: PRAPARE tool, Protocol for Responding to and Assessing Patients' Assets, Risks, and Experiences. Canadian context: screening for housing insecurity, food insecurity (HFSSM), income adequacy. Action: warm handoffs to social work, community health workers, Indigenous patient navigators. Documentation should avoid stigmatizing language.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:088",
  },
  {
    front: "What are the CTFPHC recommendations for diabetes screening in asymptomatic adults in Canada?",
    back: "CTFPHC (2012, endorsed by Diabetes Canada): screen adults ≥ 40 years with risk factors OR adults with 1 high-risk factor at any age. High-risk factors: BMI ≥ 25 + 1 of: first-degree family history, high-risk ethnicity (South Asian, Indigenous, African, Hispanic, Asian), gestational diabetes or macrosomic baby, IGT/IFG, HTN, dyslipidemia, polycystic ovaries, schizophrenia (antipsychotic use), acanthosis nigricans, NASH. Preferred test: fasting plasma glucose every 3 years; or HbA1c (if no hemoglobinopathy); OGTT in specific situations.",
    domain: "CNPLE — Primary Care & Prevention",
    sourceKey: "cnple:curated:089",
  },

  // ── Professional Practice & Ethics (5) ───────────────────────────────────────
  {
    front: "What are the four principles of biomedical ethics (Beauchamp and Childress) and how does the NP apply them in a patient who refuses a life-saving blood transfusion on religious grounds?",
    back: "Four principles: (1) Autonomy — respect patient's right to make informed decisions; (2) Beneficence — act in patient's best interest; (3) Non-maleficence — do no harm; (4) Justice — fair allocation of resources. Application: a competent adult with capacity has the right to refuse treatment even if it may result in death (Autonomy principle). NP obligations: ensure patient has capacity (understands consequences), ensure decision is informed and voluntary, document clearly, offer alternatives (e.g., volume expanders, erythropoietin). Do not override competent refusal. Advance directive requesting no blood transfusion is legally binding in Canada.",
    domain: "CNPLE — Professional Practice & Ethics",
    sourceKey: "cnple:curated:090",
  },
  {
    front: "A patient discloses past childhood sexual abuse and is currently in a violent relationship. What are the NP's legal obligations regarding mandatory reporting in Canada?",
    back: "Mandatory reporting varies by province. Universal: (1) Child in need of protection: report to CAS/MCFD/CYFS if there is reasonable suspicion a child is/may be abused (does not require proof). (2) Suspected abuse by regulated health professional: report to relevant college. NOT universally mandatory for adult IPV: NPs must assess safety and offer resources (shelters, community supports), but cannot report adult IPV without consent in most provinces (exceptions: Alberta). Duty to warn: if imminent threat to identifiable third party (Tarasoff principle). Document all disclosures and safety assessments.",
    domain: "CNPLE — Professional Practice & Ethics",
    sourceKey: "cnple:curated:091",
  },
  {
    front: "What is the NP's scope of practice for autonomous prescribing in Canada, and how does it vary across provinces?",
    back: "As of 2024–2025, NP autonomous prescribing authority varies: Ontario, BC, AB, MB, NS, NB, NL: full prescribing authority for NPs, including controlled substances (varies by regulation). Quebec: prescribing authority but some restrictions remain. PEI, SK: expanding authority. Federally: NPs recognized as prescribers under CDSA (Controlled Drugs and Substances Act) as of 2012 amendments, but provincial regulation governs scope. NP must prescribe within competence, document clinical reasoning, conduct appropriate assessment, and follow provincial NP standards (e.g., CRNNS in NS, CNO in Ontario).",
    domain: "CNPLE — Professional Practice & Ethics",
    sourceKey: "cnple:curated:092",
  },
  {
    front: "A First Nations patient expresses mistrust of the healthcare system due to intergenerational trauma from residential schools. How does the NP apply cultural safety principles?",
    back: "Cultural safety in Indigenous health: acknowledge systemic racism and historical harm (residential schools, Sixties Scoop, forced sterilization). Actions: (1) Ask how patient prefers to receive information; (2) Explore meaning of illness and health practices; (3) Offer Indigenous patient navigator or cultural liaison; (4) Do not assume traditional medicine use — ask; (5) Use trauma-informed care approach (do not retraumatize); (6) Understand Truth and Reconciliation Commission Calls to Action relevant to health. CCRNR and Canadian nursing colleges require cultural safety competency as part of NP practice standards.",
    domain: "CNPLE — Professional Practice & Ethics",
    sourceKey: "cnple:curated:093",
  },
  {
    front: "A patient comes to the NP for a second opinion after their physician recommended surgery. The NP disagrees with the surgical recommendation. How should this be handled?",
    back: "NP obligations: (1) Provide honest, evidence-informed assessment to the patient (transparent second opinion); (2) Explain the clinical rationale for agreement or disagreement; (3) Do not speak disparagingly about the physician's recommendation (professional obligation); (4) Document findings clearly; (5) If patient chooses surgery, provide supporting documentation if within NP scope; (6) Encourage patient to discuss discordant opinions with the original treating physician; (7) If the NP believes the patient is at serious risk from the proposed treatment, activate formal consultation/referral pathway. Patients have the right to make their own informed decisions.",
    domain: "CNPLE — Professional Practice & Ethics",
    sourceKey: "cnple:curated:094",
  },

  // ── Respiratory (3) ──────────────────────────────────────────────────────────
  {
    front: "A 62-year-old with a 40 pack-year history presents with exertional dyspnea, productive cough, and FEV1/FVC ratio of 0.62 post-bronchodilator. What is the GOLD staging and appropriate management?",
    back: "Post-BD FEV1/FVC < 0.70 confirms COPD. FEV1 needed for staging: GOLD 1 (≥ 80% predicted), GOLD 2 (50–79%), GOLD 3 (30–49%), GOLD 4 (< 30%). Combined ABCD assessment: symptom burden (mMRC/CAT) + exacerbation history. Management (GOLD 2023): GOLD A (low symptoms, low exacerbation): SABA or SAMA PRN; GOLD B: LAMA or LABA (LAMA preferred); GOLD E: LAMA + LABA (+ ICS if eos ≥ 300). Smoking cessation: single most impactful intervention. Pulmonary rehabilitation: strongest evidence for functional improvement. Influenza + pneumococcal vaccines.",
    domain: "CNPLE — Respiratory",
    sourceKey: "cnple:curated:095",
  },
  {
    front: "A 24-year-old with known asthma is presenting with RR 28, pulsus paradoxus 18 mmHg, peak flow 42% predicted, and inability to complete sentences. What severity is this and how is the NP managing it?",
    back: "Severe acute asthma (GINA) / moderate-severe acute exacerbation: SpO₂ < 90%, PEFR 40–69%, RR > 30, speaking in phrases, pulsus paradoxus > 10 mmHg. Pulsus > 18 mmHg = life-threatening exacerbation. Immediate: (1) Salbutamol 5 mg nebulized continuously or MDI 4–8 puffs q20 min × 3; (2) Ipratropium bromide 0.5 mg nebulized (first 3h); (3) Systemic corticosteroids: prednisone 40–60 mg PO or methylprednisolone 80–125 mg IV; (4) Oxygen to SpO₂ 93–95%. If not improving → transfer to ED. Do not use sedation. Heliox, IV magnesium sulfate in refractory severe cases.",
    domain: "CNPLE — Respiratory",
    sourceKey: "cnple:curated:096",
  },
  {
    front: "What clinical and diagnostic criteria guide the NP's diagnosis of community-acquired pneumonia vs. acute bronchitis?",
    back: "CAP (vs. bronchitis): new infiltrate on CXR is the gold standard for CAP. Clinical indicators favouring CAP over bronchitis: fever > 38°C, HR > 100, RR > 20, SpO₂ < 95%, focal consolidation findings on exam (dullness to percussion, crackles, bronchial breath sounds, egophony). Acute bronchitis: normal CXR, no systemic sepsis signs, self-limiting cough. NP management CAP (outpatient, no comorbidities): amoxicillin 500 mg TID × 5 days (FIRST line in Canada over macrolides due to atypical resistance); add doxycycline if atypical suspected. If penicillin allergy: doxycycline or respiratory fluoroquinolone.",
    domain: "CNPLE — Respiratory",
    sourceKey: "cnple:curated:097",
  },

  // ── Endocrine & Metabolic (3) ─────────────────────────────────────────────────
  {
    front: "A 32-year-old presents with severe fatigue, hyperpigmentation of skin creases, low sodium (129 mmol/L), high potassium (5.9 mmol/L), and hypotension. What is the most likely diagnosis and confirmatory test?",
    back: "Primary adrenal insufficiency (Addison's disease): adrenal cortex failure → low cortisol + high ACTH → skin hyperpigmentation (ACTH/MSH cross-reaction). Classic electrolytes: hyponatremia (low aldosterone → Na wasting), hyperkalemia, hypotension. Confirmatory test: 250 mcg ACTH stimulation test (cortisol fails to rise to > 550 nmol/L at 30–60 min). Also: morning cortisol < 140 nmol/L = likely insufficiency. Treatment: hydrocortisone 20 mg AM / 10 mg PM + fludrocortisone 0.1 mg/day (mineralocorticoid replacement). Sick day rules: double dose during illness.",
    domain: "CNPLE — Endocrine & Metabolic",
    sourceKey: "cnple:curated:098",
  },
  {
    front: "A patient's fasting serum calcium is 3.1 mmol/L (normal < 2.6). They report fatigue, constipation, polydipsia, depression, and renal colic. What is the diagnosis and priority management?",
    back: "Hypercalcemia ('bones, groans, moans, and stones'): elevated Ca²+ causes constipation, depression, polyuria/polydipsia, nephrolithiasis. Severe hypercalcemia (> 3.0 mmol/L) — most common cause: primary hyperparathyroidism (elevated PTH) or malignancy (low PTH, PTHrP elevated). Immediate management for symptomatic/severe hypercalcemia: (1) IV 0.9% NaCl 200–300 mL/h (volume expansion + calciuresis); (2) Furosemide ONLY after rehydration. (3) Bisphosphonates (zoledronic acid) if malignancy-related. Workup: intact PTH, PTHrP, CXR, SPEP, 24h urine calcium, vitamin D. Refer endocrinology for parathyroid adenoma (surgical resection = curative).",
    domain: "CNPLE — Endocrine & Metabolic",
    sourceKey: "cnple:curated:099",
  },
  {
    front: "What is the diagnostic pathway for Cushing's syndrome, and what first-line screening test does the NP order?",
    back: "Cushing's syndrome (cortisol excess): central obesity, moon face, buffalo hump, purple striae, proximal muscle weakness, easy bruising, hypertension, hyperglycemia, hirsutism (women), depression. First-line screening: late-night salivary cortisol (×2, most convenient, high sensitivity) OR 24h urine free cortisol (×2) OR 1 mg overnight dexamethasone suppression test (fails to suppress to < 50 nmol/L = abnormal). Confirm before referring endocrinology. ACTH-dependent: ACTH elevated → pituitary adenoma (Cushing's disease) or ectopic ACTH. ACTH-independent: ACTH suppressed → adrenal adenoma/carcinoma. Most common cause: iatrogenic (exogenous corticosteroids).",
    domain: "CNPLE — Endocrine & Metabolic",
    sourceKey: "cnple:curated:100",
  },
];

// ── Category slug helper ──────────────────────────────────────────────────────
function domainToSlug(domain: string): string {
  return domain.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(DRY_RUN ? "=== DRY RUN ===" : "=== SEEDING CNPLE CURATED FLASHCARDS ===");
  console.log(`Total curated cards: ${CURATED_CARDS.length}`);

  // Validate no duplicate sourceKeys
  const keys = CURATED_CARDS.map((c) => c.sourceKey);
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dupes.length > 0) { console.error("Duplicate sourceKeys:", dupes); process.exit(1); }

  // Domain distribution
  const byDomain: Record<string, number> = {};
  for (const c of CURATED_CARDS) byDomain[c.domain] = (byDomain[c.domain] ?? 0) + 1;
  console.log("\nDomain distribution:");
  for (const [d, n] of Object.entries(byDomain).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${n.toString().padStart(4)}  ${d}`);
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Sample cards:");
    for (const c of CURATED_CARDS.slice(0, 3)) {
      console.log(`  [${c.domain.replace("CNPLE — ", "")}]`);
      console.log(`  Q: ${c.front.slice(0, 90)}...`);
      console.log(`  A: ${c.back.slice(0, 90)}...`);
      console.log();
    }
    console.log("Pass --apply to write to DB.");
    return;
  }

  // Ensure categories exist
  const categoryMap = new Map<string, string>();
  const domains = [...new Set(CURATED_CARDS.map((c) => c.domain))];
  for (const domain of domains) {
    const slug = domainToSlug(domain);
    const cat = await prisma.category.upsert({ where: { slug }, update: { name: domain }, create: { name: domain, slug } });
    categoryMap.set(domain, cat.id);
  }

  // Get current max positionInDeck
  const maxPos = await prisma.flashcard.aggregate({
    where: { deckId: CNPLE_DECK_ID },
    _max: { positionInDeck: true },
  });
  let pos = (maxPos._max.positionInDeck ?? 0) + 1;

  // Upsert cards (safe re-run)
  let inserted = 0;
  let updated = 0;
  for (const card of CURATED_CARDS) {
    const existing = await prisma.flashcard.findUnique({ where: { sourceKey: card.sourceKey } });
    if (existing) {
      await prisma.flashcard.update({
        where: { sourceKey: card.sourceKey },
        data: {
          front: card.front,
          back: card.back,
          categoryId: categoryMap.get(card.domain)!,
          examItemKind: FlashcardItemKind.CLINICAL,
        },
      });
      updated++;
    } else {
      await prisma.flashcard.create({
        data: {
          front: card.front,
          back: card.back,
          country: CountryCode.CA,
          tier: TierCode.NP,
          examFamily: ExamFamily.NP,
          status: ContentStatus.PUBLISHED,
          categoryId: categoryMap.get(card.domain)!,
          deckId: CNPLE_DECK_ID,
          positionInDeck: pos++,
          sourceKey: card.sourceKey,
          examItemKind: FlashcardItemKind.CLINICAL,
        },
      });
      inserted++;
    }
  }

  // Update deck card count
  const finalCount = await prisma.flashcard.count({ where: { deckId: CNPLE_DECK_ID } });
  await prisma.flashcardDeck.update({ where: { id: CNPLE_DECK_ID }, data: { cardCount: finalCount } });

  console.log(`\n✓ Inserted: ${inserted} | Updated: ${updated}`);
  console.log(`✓ Deck total: ${finalCount} cards`);
  console.log(`✓ Curated cards marked examItemKind: CLINICAL`);
  console.log(`✓ Query curated set: WHERE sourceKey LIKE 'cnple:curated:%' OR examItemKind = 'CLINICAL'`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
