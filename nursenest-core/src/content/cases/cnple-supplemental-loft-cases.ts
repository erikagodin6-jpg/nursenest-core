import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * Supplemental CNPLE LOFT-style cases.
 *
 * These cases extend the static CNPLE preview/catalog while the larger DB-authored
 * case bank is built out. They are NurseNest-authored practice cases, not official
 * CNPLE items and not affiliated with CCRNR.
 */

export const CASE_PRENATAL_HYPERTENSION: PatientCase = {
  id: "cnple-sample-prenatal-htn-001",
  title: "Ms. Amira El-Sayed — Prenatal Hypertension and Preeclampsia Risk",
  tagline: "Maternal Health · Acute Deterioration",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "SOGC Hypertensive Disorders of Pregnancy guidance",
      "Canadian Task Force preventive care guidance",
      "Ontario perinatal care escalation pathways",
    ],
  },
  patient: { age: 29, sex: "Female", pronouns: "she/her", setting: "NP-Led Prenatal Clinic" },
  chiefComplaint: "28 weeks pregnant with headache, new swelling, and elevated home blood pressure readings.",
  pmhx: [
    "G1P0, singleton pregnancy, 28+4 weeks gestation",
    "BMI 33 before pregnancy",
    "Mother had preeclampsia",
    "No chronic hypertension before pregnancy",
  ],
  medications: [
    { name: "Prenatal vitamin", dose: "1 tab", route: "PO", frequency: "daily", indication: "Pregnancy" },
    { name: "Ferrous fumarate", dose: "300 mg", route: "PO", frequency: "daily", indication: "Iron deficiency prevention" },
  ],
  allergies: [{ substance: "Naproxen", reaction: "Wheezing", severity: "moderate" }],
  primaryDomain: "reproductive-sexual-health",
  secondaryDomains: ["acute-urgent-care", "diagnostics-labs", "professional-practice"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Prenatal same-day assessment",
      scenarioText:
        "Ms. El-Sayed, 29, is 28+4 weeks pregnant and presents for same-day prenatal assessment. She reports a persistent frontal headache for 24 hours, new swelling of her hands and face, and home BP readings in the 150s/90s. In clinic: BP 156/98 after 5 minutes seated, repeat 158/100; HR 88; RR 18; SpO2 98%; T 36.8°C. She denies visual changes, chest pain, dyspnoea, right upper quadrant pain, or reduced fetal movement. Urine dip is 2+ protein.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "New hypertension after 20 weeks with proteinuria and headache — preeclampsia until proven otherwise.",
        newFindings: ["BP 158/100", "Urine protein 2+", "Persistent headache", "New facial/hand swelling"],
      },
      vitals: [
        { label: "BP", value: "158/100", unit: "mmHg", flag: "high" },
        { label: "HR", value: "88", unit: "bpm" },
        { label: "SpO2", value: "98%", unit: "" },
      ],
      diagnosticArtifacts: [
        { type: "lab_panel", name: "Point-of-care urine", finding: "Urine dip 2+ protein", values: [{ test: "Protein", value: "2+", referenceRange: "Negative/trace", flag: "H" }], timestamp: "Today" },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "reproductive-sexual-health",
      question: {
        stem: "Ms. El-Sayed is 28+4 weeks pregnant with BP 158/100, persistent headache, new swelling, and 2+ proteinuria. What is the most appropriate NP action now?",
        family: "acute-deterioration-urgent-referral",
        options: [
          { id: "A", label: "Repeat BP in 1 week and order outpatient urine albumin-creatinine ratio." },
          { id: "B", label: "Arrange same-day obstetrical assessment/triage for preeclampsia workup and fetal assessment." },
          { id: "C", label: "Start labetalol 100 mg BID in clinic and follow up in 48 hours." },
          { id: "D", label: "Advise rest, hydration, and acetaminophen; return if visual symptoms develop." },
        ],
        correctOptionId: "B",
        rationale:
          "New hypertension after 20 weeks with proteinuria and a persistent headache is preeclampsia until proven otherwise. Even though the BP is not yet in the severe range (≥160 systolic or ≥110 diastolic), the combination of neurologic symptom plus proteinuria requires same-day obstetrical triage for CBC, creatinine, AST/ALT, urine protein quantification, fetal non-stress testing, and disposition planning. The NP should not manage this as routine gestational hypertension in primary care. Starting antihypertensive medication without same-day obstetrical assessment risks delaying diagnosis of severe features and fetal compromise.",
        whyWrongByOptionId: {
          A: "A 1-week reassessment is unsafe because symptomatic preeclampsia can progress quickly. Urine quantification is useful, but it does not replace same-day obstetrical evaluation.",
          C: "Labetalol may be used in pregnancy hypertension, but prescribing it as the only action in a symptomatic patient delays required maternal-fetal assessment.",
          D: "Headache in the context of new hypertension and proteinuria is a red flag, not a reassurance point. Waiting for visual symptoms is unsafe.",
        },
        clinicalJudgmentFocus: "Recognising preeclampsia red flags and escalating before severe-range blood pressure or seizures occur.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "She returns 4 days later with severe headache and BP 168/112. Labs show platelets 92 and AST 94. Delayed escalation increases maternal and fetal risk." },
          B: { trajectory: "optimal", outcome: "She is sent to obstetrical triage. Labs are drawn, fetal monitoring is reassuring, and maternal-fetal medicine creates a close surveillance plan with clear return precautions." },
          C: { trajectory: "suboptimal", outcome: "BP improves slightly but headache persists. Triage is delayed until the next day, when abnormal liver enzymes are discovered." },
          D: { trajectory: "harmful", outcome: "Symptoms worsen overnight and she presents by ambulance with severe-range BP and hyperreflexia. Magnesium sulfate is required urgently." },
        },
      },
    },
    {
      index: 1,
      heading: "Triage lab results",
      updateNarrative: "Same day — obstetrical triage calls with results.",
      scenarioText:
        "Obstetrical triage calls your clinic. Ms. El-Sayed's BP is now 162/108 on repeat measurements. Platelets 118 × 10⁹/L, AST 76 U/L, ALT 68 U/L, creatinine 88 µmol/L, urine protein-creatinine ratio elevated. She reports worsening headache and new intermittent visual sparkles. Fetal non-stress test is reactive.",
      clinicalUpdate: {
        direction: "critical",
        summary: "Progression to severe-range hypertension with neurologic symptoms and abnormal platelets/liver enzymes.",
        newFindings: ["BP 162/108", "Visual symptoms", "Platelets 118", "AST/ALT elevated"],
      },
      vitals: [{ label: "BP", value: "162/108", unit: "mmHg", flag: "critical" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Preeclampsia labs",
          finding: "Platelets 118; AST 76; ALT 68; creatinine 88; elevated urine protein-creatinine ratio",
          values: [
            { test: "Platelets", value: "118 × 10⁹/L", referenceRange: "150–400", flag: "L" },
            { test: "AST", value: "76 U/L", referenceRange: "<35", flag: "H" },
            { test: "ALT", value: "68 U/L", referenceRange: "<35", flag: "H" },
            { test: "Creatinine", value: "88 µmol/L", referenceRange: "Pregnancy baseline often lower", flag: "H" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [],
      followUpInterval: { value: 0, unit: "days", label: "Same day" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Ms. El-Sayed now has severe-range BP, worsening headache, visual symptoms, thrombocytopenia, and elevated transaminases. What is the priority treatment escalation?",
        family: "maternal-acute-escalation",
        options: [
          { id: "A", label: "Magnesium sulfate for seizure prophylaxis plus urgent obstetrical admission and antihypertensive therapy." },
          { id: "B", label: "Oral labetalol only — fetal testing is reactive so admission can be avoided." },
          { id: "C", label: "Low-dose ASA initiation — this reduces progression of preeclampsia." },
          { id: "D", label: "Repeat labs in 24 hours — delivery decisions should wait for platelet count below 100." },
        ],
        correctOptionId: "A",
        rationale:
          "This is preeclampsia with severe features: severe-range BP, neurologic symptoms, thrombocytopenia trend, and elevated liver enzymes. Magnesium sulfate is indicated for seizure prophylaxis, and severe BP requires urgent treatment with obstetrical admission. Low-dose ASA is preventive and must be started earlier in pregnancy for risk reduction; it is not treatment for established severe preeclampsia. A reactive fetal tracing does not remove maternal indications for admission and stabilization.",
        whyWrongByOptionId: {
          B: "Antihypertensive therapy is necessary but incomplete. It does not prevent eclampsia and does not replace admission and maternal-fetal surveillance.",
          C: "ASA is prophylaxis, not acute treatment. Starting it after severe features are present does not address current maternal risk.",
          D: "Waiting for platelets to fall below 100 delays care. Severe neurologic symptoms and severe-range BP are already sufficient for escalation.",
        },
        clinicalJudgmentFocus: "Distinguishing prevention from acute management in severe preeclampsia.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Magnesium sulfate and antihypertensive therapy are started. She is admitted under obstetrics with maternal-fetal medicine consultation and corticosteroids for fetal lung maturity." },
          B: { trajectory: "harmful", outcome: "BP is treated but seizure prophylaxis is omitted. She develops hyperreflexia and clonus overnight, requiring urgent magnesium initiation." },
          C: { trajectory: "harmful", outcome: "ASA is started but no acute stabilization occurs. Severe features progress and care is delayed." },
          D: { trajectory: "harmful", outcome: "Labs worsen by morning and she develops right upper quadrant pain. The delay narrows management options." },
        },
      },
    },
    {
      index: 2,
      heading: "Postpartum transition planning",
      updateNarrative: "Two weeks later — postpartum discharge follow-up.",
      scenarioText:
        "Ms. El-Sayed delivered by induction at 34 weeks after maternal stabilization and fetal lung maturity steroids. She is now 2 weeks postpartum, breastfeeding, and discharged on nifedipine XL 30 mg daily. BP today is 142/88. She is tearful about the NICU admission but denies suicidal ideation. She asks whether preeclampsia is 'over now' and whether this affects her future health.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Postpartum hypertension and psychosocial stress. Needs monitoring, counselling, and long-term cardiovascular risk follow-up.",
      },
      vitals: [{ label: "BP", value: "142/88", unit: "mmHg", flag: "high" }, { label: "HR", value: "82", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [{ name: "Nifedipine XL", dose: "30 mg", route: "PO", frequency: "daily", indication: "Postpartum hypertension", flag: "new" }],
      followUpInterval: { value: 2, unit: "weeks", label: "2 weeks postpartum" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At the 2-week postpartum visit after severe preeclampsia, what counselling and follow-up plan is most appropriate?",
        family: "postpartum-risk-counselling",
        options: [
          { id: "A", label: "Continue BP monitoring, screen mood, arrange 6–12 week postpartum review, and counsel on increased lifetime cardiovascular risk." },
          { id: "B", label: "Stop nifedipine because delivery resolves preeclampsia." },
          { id: "C", label: "Avoid breastfeeding while taking nifedipine." },
          { id: "D", label: "Reassure that severe preeclampsia has no long-term implications once the baby is delivered." },
        ],
        correctOptionId: "A",
        rationale:
          "Preeclampsia can worsen or persist postpartum, and BP often peaks 3–6 days after delivery but may require treatment for weeks. Nifedipine is compatible with breastfeeding. The NP should monitor BP, assess symptoms, screen for postpartum depression/anxiety, and ensure transition to long-term cardiovascular risk reduction. A history of preeclampsia increases future risk of chronic hypertension, ischemic heart disease, stroke, CKD, and recurrent hypertensive disorders in pregnancy. The 6–12 week postpartum visit should include BP review, renal/liver recovery if abnormal, contraception, and future pregnancy counselling.",
        whyWrongByOptionId: {
          B: "Delivery is definitive treatment for the placenta-driven process, but hypertension and complications can persist postpartum. Stopping antihypertensives abruptly is unsafe.",
          C: "Nifedipine is generally considered compatible with breastfeeding and is commonly used postpartum.",
          D: "Preeclampsia is an important cardiovascular risk marker and should trigger long-term preventive follow-up.",
        },
        clinicalJudgmentFocus: "Postpartum safety netting after severe preeclampsia and translating pregnancy complications into long-term prevention.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "BP is monitored weekly and nifedipine tapered after control improves. EPDS screening identifies anxiety related to NICU stress; supportive follow-up is arranged. Long-term CV prevention is documented." },
          B: { trajectory: "harmful", outcome: "Nifedipine is stopped. BP rises to 166/104 at home with headache, requiring ED reassessment." },
          C: { trajectory: "suboptimal", outcome: "She stops breastfeeding unnecessarily, worsening distress and undermining her feeding goals." },
          D: { trajectory: "suboptimal", outcome: "No long-term risk plan is made. Chronic hypertension is missed at 6 months postpartum." },
        },
      },
    },
  ],
};

export const CASE_ANTIBIOTIC_STEWARDSHIP_UTI: PatientCase = {
  id: "cnple-sample-uti-stewardship-001",
  title: "Mrs. Sofia Ricci — Recurrent UTI and Antibiotic Stewardship",
  tagline: "Infectious Disease · Prescribing Safety",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Choosing Wisely Canada — UTI and asymptomatic bacteriuria recommendations",
      "Canadian antimicrobial stewardship guidance",
      "IDSA uncomplicated cystitis and pyelonephritis guidance",
    ],
  },
  patient: { age: 72, sex: "Female", pronouns: "she/her", setting: "Primary Care Clinic" },
  chiefComplaint: "Burning with urination and frequency. History of recurrent UTIs and recent antibiotic exposure.",
  pmhx: ["Recurrent uncomplicated cystitis", "Stage G3a CKD", "Type 2 diabetes mellitus", "Postmenopausal genitourinary syndrome"],
  medications: [
    { name: "Metformin", dose: "500 mg", route: "PO", frequency: "twice daily", indication: "T2DM" },
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension / renal protection" },
    { name: "Calcium carbonate", dose: "500 mg", route: "PO", frequency: "daily", indication: "Supplement" },
  ],
  allergies: [{ substance: "TMP-SMX", reaction: "Diffuse urticaria", severity: "moderate" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["diagnostics-labs", "older-adult-care", "health-promotion-prevention"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 16,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Symptomatic cystitis assessment",
      scenarioText:
        "Mrs. Ricci, 72, reports 24 hours of dysuria, urinary frequency, and suprapubic discomfort. She denies fever, flank pain, nausea, vomiting, and rigors. BP 128/76, HR 82, T 36.9°C. She had a UTI treated with ciprofloxacin 6 weeks ago at a walk-in clinic. Her most recent eGFR is 48 mL/min/1.73m². Urine dip: leukocyte esterase positive, nitrites positive, trace blood.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Lower urinary tract symptoms without systemic features. Recent fluoroquinolone exposure and CKD affect antibiotic choice.",
        newFindings: ["Dysuria/frequency", "Nitrites positive", "No fever/flank pain", "eGFR 48", "Ciprofloxacin 6 weeks ago"],
      },
      vitals: [
        { label: "T", value: "36.9", unit: "°C" },
        { label: "HR", value: "82", unit: "bpm" },
        { label: "BP", value: "128/76", unit: "mmHg" },
      ],
      diagnosticArtifacts: [
        { type: "lab_panel", name: "Urine dip", finding: "Leukocyte esterase positive; nitrite positive; trace blood", values: [{ test: "Nitrite", value: "Positive", referenceRange: "Negative", flag: "H" }, { test: "Leukocyte esterase", value: "Positive", referenceRange: "Negative", flag: "H" }], timestamp: "Today" },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mrs. Ricci has symptomatic lower UTI, eGFR 48, TMP-SMX allergy, and ciprofloxacin exposure 6 weeks ago. What is the most appropriate empiric antibiotic plan?",
        family: "antibiotic-stewardship-prescribing",
        options: [
          { id: "A", label: "Nitrofurantoin 100 mg PO BID for 5 days; send urine culture because of recurrence and recent antibiotic exposure." },
          { id: "B", label: "Ciprofloxacin 500 mg PO BID for 7 days — recent success suggests it will work again." },
          { id: "C", label: "Amoxicillin 500 mg PO TID for 7 days without culture." },
          { id: "D", label: "No antibiotics until culture returns — antimicrobial stewardship requires waiting." },
        ],
        correctOptionId: "A",
        rationale:
          "Nitrofurantoin is appropriate for lower UTI when eGFR is ≥30 mL/min/1.73m² and there are no signs of pyelonephritis. Mrs. Ricci's eGFR is 48, symptoms are lower-tract only, and TMP-SMX cannot be used due to allergy. Fluoroquinolones should be avoided for uncomplicated cystitis when alternatives exist because of collateral damage, resistance selection, tendinopathy, QT risk, C. difficile risk, and recent exposure. Because she has recurrent UTI and recent antibiotic treatment, urine culture should be sent before antibiotics, but treatment should not be delayed in a symptomatic older adult.",
        whyWrongByOptionId: {
          B: "Ciprofloxacin is not first-line for uncomplicated cystitis and recent exposure increases resistance and adverse-event risk.",
          C: "Empiric amoxicillin has poor E. coli coverage in many Canadian communities and should not be used without susceptibility confirmation.",
          D: "Stewardship is not withholding treatment from symptomatic infection; it is choosing the narrowest appropriate agent and obtaining culture when indicated.",
        },
        clinicalJudgmentFocus: "Antibiotic stewardship: narrow empiric therapy, renal threshold for nitrofurantoin, and avoiding unnecessary fluoroquinolones.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Culture is sent and nitrofurantoin started. Symptoms improve within 48 hours. Culture later confirms E. coli susceptible to nitrofurantoin." },
          B: { trajectory: "suboptimal", outcome: "Ciprofloxacin improves symptoms but causes significant diarrhea and increases future resistance risk. The antimicrobial stewardship review flags avoidable fluoroquinolone use." },
          C: { trajectory: "harmful", outcome: "Amoxicillin-resistant E. coli grows on culture. Symptoms worsen and treatment has to be changed after 72 hours." },
          D: { trajectory: "suboptimal", outcome: "Treatment is delayed. She calls after 48 hours with worsening dysuria and distress, despite having a clear symptomatic infection." },
        },
      },
    },
    {
      index: 1,
      heading: "Culture result and flank pain call",
      updateNarrative: "48 hours later — phone call and culture review.",
      scenarioText:
        "Mrs. Ricci calls 48 hours later. Dysuria is slightly better but she now has left flank pain, nausea, and chills. Temperature at home is 38.3°C. Culture: E. coli >100,000 CFU/mL, susceptible to ceftriaxone, cefixime, ciprofloxacin, and nitrofurantoin; resistant to ampicillin and TMP-SMX. She sounds unwell on the phone.",
      clinicalUpdate: {
        direction: "critical",
        summary: "New systemic features suggest ascending infection/pyelonephritis; nitrofurantoin is inadequate for renal tissue penetration.",
        newFindings: ["Fever 38.3", "Flank pain", "Nausea/chills", "Culture susceptible but nitrofurantoin not tissue-penetrating"],
      },
      vitals: [{ label: "Temp", value: "38.3", unit: "°C", flag: "high" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Urine culture",
          finding: "E. coli susceptible to ceftriaxone, cefixime, ciprofloxacin, nitrofurantoin; resistant to ampicillin and TMP-SMX",
          values: [
            { test: "E. coli", value: ">100,000 CFU/mL", referenceRange: "No growth" },
            { test: "Nitrofurantoin", value: "Susceptible", referenceRange: "" },
            { test: "TMP-SMX", value: "Resistant", referenceRange: "" },
          ],
          timestamp: "48 hours",
        },
      ],
      medicationChanges: [{ name: "Nitrofurantoin", dose: "100 mg", route: "PO", frequency: "BID", indication: "Lower UTI", flag: "new" }],
      followUpInterval: { value: 48, unit: "hours", label: "48 hours later" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mrs. Ricci now has fever, flank pain, nausea, and chills while on nitrofurantoin. Culture shows E. coli susceptible to nitrofurantoin and ceftriaxone. What is the most appropriate management?",
        family: "acute-infection-escalation",
        options: [
          { id: "A", label: "Continue nitrofurantoin because the culture shows susceptibility." },
          { id: "B", label: "Assess urgently same day/ED depending on stability; stop nitrofurantoin and treat as pyelonephritis with systemic therapy." },
          { id: "C", label: "Add phenazopyridine and reassess in 48 hours." },
          { id: "D", label: "Switch to amoxicillin because narrow therapy is preferred." },
        ],
        correctOptionId: "B",
        rationale:
          "Nitrofurantoin concentrates in urine but does not achieve adequate renal parenchymal tissue levels, so it is inappropriate for pyelonephritis even when the urine isolate tests susceptible. New fever, flank pain, nausea, and chills indicate systemic/upper-tract involvement. She requires urgent same-day assessment for vitals, sepsis screen, hydration status, renal function, and selection of systemic therapy such as ceftriaxone followed by an appropriate oral agent when stable. Older age, diabetes, CKD, and sounding unwell lower the threshold for ED referral.",
        whyWrongByOptionId: {
          A: "Culture susceptibility does not override pharmacokinetics. Nitrofurantoin is only for lower UTI, not renal tissue infection.",
          C: "Phenazopyridine treats discomfort only and delays treatment of ascending infection.",
          D: "The organism is ampicillin resistant, so amoxicillin is inappropriate and unsafe here.",
        },
        clinicalJudgmentFocus: "Escalating lower UTI to pyelonephritis management and understanding antibiotic tissue penetration.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "She continues nitrofurantoin and presents the next day with hypotension and acute kidney injury requiring admission." },
          B: { trajectory: "optimal", outcome: "She is assessed urgently, receives ceftriaxone, labs, and hydration. She stabilizes and completes step-down oral therapy with close follow-up." },
          C: { trajectory: "harmful", outcome: "Symptoms are masked briefly but infection progresses. ED admission occurs after rigors and confusion develop." },
          D: { trajectory: "harmful", outcome: "Amoxicillin fails due to resistance. Fever and flank pain worsen." },
        },
      },
    },
    {
      index: 2,
      heading: "Recurrent UTI prevention visit",
      updateNarrative: "Six weeks later — prevention planning.",
      scenarioText:
        "Mrs. Ricci has recovered. This was her third culture-confirmed UTI in 9 months. She is postmenopausal and reports vaginal dryness and dyspareunia. She asks for daily antibiotics because she is worried about another infection. She has no current urinary symptoms today, but a screening urine dip at a pharmacy showed leukocytes.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Recurrent UTI prevention and asymptomatic bacteriuria stewardship issue.",
        newFindings: ["3 UTIs in 9 months", "Postmenopausal symptoms", "No urinary symptoms today", "Pharmacy dip positive leukocytes"],
      },
      vitals: [{ label: "BP", value: "126/74", unit: "mmHg" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mrs. Ricci is asymptomatic today but has recurrent UTIs and postmenopausal genitourinary symptoms. What prevention plan best reflects antimicrobial stewardship?",
        family: "uti-prevention-stewardship",
        options: [
          { id: "A", label: "Do not treat asymptomatic bacteriuria; start vaginal estrogen if no contraindication and use culture-guided therapy for future symptomatic episodes." },
          { id: "B", label: "Prescribe daily ciprofloxacin prophylaxis for 6 months." },
          { id: "C", label: "Treat the positive pharmacy urine dip with nitrofurantoin now." },
          { id: "D", label: "Order monthly urine cultures to detect infection before symptoms occur." },
        ],
        correctOptionId: "A",
        rationale:
          "Asymptomatic bacteriuria should not be screened for or treated in most older adults because treatment does not improve outcomes and increases antimicrobial resistance and C. difficile risk. In postmenopausal recurrent UTI, topical vaginal estrogen reduces recurrence by improving the urogenital mucosa and lactobacilli-dominant flora. Future symptomatic episodes should be culture-guided because she has recurrence, CKD, allergy limitations, and recent resistance history. Long-term antibiotic prophylaxis can be considered only after non-antibiotic prevention fails and should not default to fluoroquinolones.",
        whyWrongByOptionId: {
          B: "Daily fluoroquinolone prophylaxis is not appropriate because of serious adverse effects and resistance selection; it is not first-line prevention.",
          C: "Treating leukocytes on dip without symptoms is treatment of asymptomatic bacteriuria and violates stewardship principles.",
          D: "Routine surveillance cultures in asymptomatic older adults lead to overdiagnosis and unnecessary antibiotics.",
        },
        clinicalJudgmentFocus: "Preventing recurrent UTI while avoiding asymptomatic bacteriuria over-treatment.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Vaginal estrogen is started with counselling. No antibiotics are given for asymptomatic dip findings. Over 6 months, she has one mild symptomatic UTI treated culture-guided without fluoroquinolone exposure." },
          B: { trajectory: "harmful", outcome: "Daily ciprofloxacin causes Achilles tendon pain and diarrhea. A later UTI grows fluoroquinolone-resistant E. coli." },
          C: { trajectory: "suboptimal", outcome: "She receives unnecessary antibiotics and develops vulvovaginal candidiasis. The underlying genitourinary syndrome remains untreated." },
          D: { trajectory: "suboptimal", outcome: "Monthly cultures repeatedly show bacteriuria and trigger avoidable antibiotic courses despite no symptoms." },
        },
      },
    },
  ],
};

export const CNPLE_SUPPLEMENTAL_LOFT_CASES: PatientCase[] = [
  CASE_PRENATAL_HYPERTENSION,
  CASE_ANTIBIOTIC_STEWARDSHIP_UTI,
];
