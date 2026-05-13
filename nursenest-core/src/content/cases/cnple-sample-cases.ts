/**
 * Static CNPLE-aligned sample cases for development, demos, and free-tier preview.
 *
 * These are NurseNest practice cases. Not official CNPLE content.
 * Full case banks are admin-authored and stored in the ClinicalNursingScenario table.
 */
import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

// ── Case 1: Hypertension + cardiovascular risk ─────────────────────────────────

export const CASE_HYPERTENSION_FOLLOWUP: PatientCase = {
  id: "cnple-sample-htn-001",
  title: "Mrs. Nakamura — Hypertension and Cardiovascular Risk",
  tagline: "Chronic Disease · Prescribing Safety",
  governance: {
    reviewStatus: "published",
    reviewedBy: "NurseNest Clinical Team",
    reviewedAt: "2026-04-01",
    contentUpdatedAt: "2026-04-01",
    guidelineSources: [
      "Hypertension Canada Guidelines (2020)",
      "Diabetes Canada Clinical Practice Guidelines (2023)",
      "KDIGO CKD Guidelines (2022)",
      "CPS/Canadian Cardiovascular Society DVT/PE guidance",
    ],
  },
  patient: {
    age: 58,
    sex: "Female",
    pronouns: "she/her",
    setting: "Primary Care Clinic",
  },
  chiefComplaint: "Routine follow-up for hypertension and new onset fatigue.",
  pmhx: [
    "Hypertension (diagnosed 4 years ago)",
    "Type 2 diabetes mellitus (8 years)",
    "Dyslipidaemia",
    "Osteoarthritis (bilateral knees)",
  ],
  medications: [
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension / diabetic nephroprotection" },
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "Type 2 DM" },
    { name: "Atorvastatin", dose: "20 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia" },
    { name: "Naproxen", dose: "220 mg", route: "PO", frequency: "PRN", indication: "OA pain" },
  ],
  allergies: [
    { substance: "Penicillin", reaction: "Rash", severity: "mild" },
    { substance: "Sulfa drugs", reaction: "Angioedema", severity: "severe" },
  ],
  primaryDomain: "chronic-disease-management",
  secondaryDomains: ["pharmacotherapeutics", "diagnostics-labs", "health-promotion-prevention"],
  difficulty: 2,
  stepCount: 4,
  estimatedMinutes: 18,
  isPremium: false,
  steps: [
    // ── Step 0: Initial visit ─────────────────────────────────────────────────
    {
      index: 0,
      heading: "Initial visit",
      scenarioText:
        "Mrs. Nakamura is a 58-year-old woman presenting for a routine hypertension follow-up. She reports fatigue over the past 6 weeks, which she attributes to stress. She has been taking naproxen 220 mg PRN almost daily for the past 3 months for bilateral knee pain. BP today is 158/96 mmHg (repeated twice). She is not dizzy and has no chest pain or dyspnoea. RR 16, HR 78, SpO2 98% on room air.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Blood pressure above target despite current therapy; new fatigue.",
        newFindings: ["BP 158/96 (above Hypertension Canada target <130/80 for DM)", "Daily NSAID use"],
      },
      vitals: [
        { label: "BP", value: "158/96", unit: "mmHg", flag: "high" },
        { label: "HR", value: "78", unit: "bpm" },
        { label: "RR", value: "16", unit: "br/min" },
        { label: "SpO2", value: "98%", unit: "" },
        { label: "Weight", value: "74", unit: "kg" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "chronic-disease-management",
      question: {
        stem: "Mrs. Nakamura's BP is 158/96 mmHg on current therapy. She has been using naproxen almost daily. What is the most appropriate initial management step?",
        family: "chronic-disease-management",
        options: [
          { id: "A", label: "Add amlodipine 5 mg daily to her current regimen." },
          { id: "B", label: "Counsel her to stop naproxen and reassess BP in 4–6 weeks before changing antihypertensive therapy." },
          { id: "C", label: "Increase ramipril to 10 mg daily immediately." },
          { id: "D", label: "Refer to cardiology for refractory hypertension." },
        ],
        correctOptionId: "B",
        rationale:
          "NSAIDs including naproxen inhibit prostaglandin synthesis, causing sodium retention and vasoconstriction that can raise BP by 3–5 mmHg on average and blunt the effect of ACE inhibitors and diuretics. This is a correctable cause of apparent treatment resistance. Stopping naproxen and reassessing BP in 4–6 weeks is the appropriate first step before escalating antihypertensive therapy. Increasing ramipril or adding a calcium channel blocker without addressing the NSAID is premature and does not address the underlying cause. Referral to cardiology is not warranted at this stage.",
        whyWrongByOptionId: {
          A: "Adding amlodipine before removing the NSAID-induced BP elevation treats the consequence rather than the cause. The BP may normalise after stopping naproxen, making the additional medication unnecessary.",
          C: "Increasing ramipril before addressing the NSAID is premature. Additionally, the ACE inhibitor effect is being blunted by the NSAID; removing the NSAID may restore the ramipril's effectiveness at the current dose.",
          D: "Refractory hypertension should be a diagnosis of exclusion. An identifiable and reversible cause (daily NSAID use) has not yet been addressed.",
        },
        clinicalJudgmentFocus: "Identifying a reversible cause of BP elevation before escalating pharmacotherapy.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "BP is partially controlled but the NSAID-mediated mechanism persists. At her 6-week follow-up, BP is 144/90 — improved but still above target, and she now reports ankle oedema from the amlodipine." },
          B: { trajectory: "optimal", outcome: "Mrs. Nakamura stops naproxen and switches to acetaminophen for knee pain. At her 4-week reassessment, BP is 134/84 — close to target. No medication changes were needed." },
          C: { trajectory: "suboptimal", outcome: "The higher ramipril dose provides modest additional BP lowering, but without addressing the NSAID, BP at 6 weeks is 148/92. She also develops a dry cough, prompting further review." },
          D: { trajectory: "suboptimal", outcome: "Cardiology declines the referral as premature. The NSAID issue is eventually identified at a phone triage visit 8 weeks later, delaying appropriate management." },
        },
      },
    },

    // ── Step 1: 4-week reassessment ───────────────────────────────────────────
    {
      index: 1,
      heading: "4-week reassessment",
      updateNarrative: "4 weeks later — follow-up after stopping naproxen.",
      scenarioText:
        "Mrs. Nakamura returns 4 weeks after stopping naproxen. BP is 136/84 mmHg today. She switched to acetaminophen for knee pain, which provides partial relief. She mentions she has been checking her BP at the pharmacy and values have ranged from 132–140 systolic. You review her fasting labs ordered at the last visit.",
      clinicalUpdate: {
        direction: "improving",
        summary: "BP improved after NSAID cessation. Now at near-target levels.",
      },
      vitals: [
        { label: "BP", value: "136/84", unit: "mmHg", flag: "low" },
        { label: "HR", value: "76", unit: "bpm" },
        { label: "Weight", value: "73.5", unit: "kg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Fasting labs",
          finding: "HbA1c elevated at 8.4%; LDL-C 3.1 mmol/L; eGFR 62 mL/min/1.73m²; K+ 4.6 mmol/L; Cr 98 µmol/L",
          values: [
            { test: "HbA1c", value: "8.4%", referenceRange: "Target <7.0% in DM", flag: "H" },
            { test: "LDL-C", value: "3.1 mmol/L", referenceRange: "Target <2.0 in DM+HTN", flag: "H" },
            { test: "eGFR", value: "62", unit: "mL/min/1.73m²", referenceRange: ">60 (CKD stage G2)", flag: "L" },
            { test: "K+", value: "4.6 mmol/L", referenceRange: "3.5–5.0", flag: undefined },
            { test: "Creatinine", value: "98 µmol/L", referenceRange: "45–84 µmol/L (F)", flag: "H" },
          ],
          timestamp: "Results from last visit",
        },
      ],
      medicationChanges: [
        { name: "Naproxen", flag: "discontinued", indication: "Stopped at last visit" },
      ],
      followUpInterval: { value: 4, unit: "weeks", label: "4 weeks later" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "Mrs. Nakamura's HbA1c is 8.4% (target <7.0%), LDL-C is 3.1 mmol/L (target <2.0), and eGFR is 62 mL/min/1.73m². What is the most appropriate next step in managing her overall cardiovascular risk?",
        family: "lab-diagnostic-interpretation",
        options: [
          { id: "A", label: "Increase atorvastatin to 40 mg daily and refer to endocrinology for the elevated HbA1c." },
          { id: "B", label: "Intensify diabetes management by increasing metformin to 1000 mg three times daily." },
          { id: "C", label: "Increase atorvastatin to 40 mg daily, review and optimise diabetes management collaboratively, and plan monitoring of renal function in 3 months." },
          { id: "D", label: "Stop metformin given the eGFR of 62 and start a sulfonylurea instead." },
        ],
        correctOptionId: "C",
        rationale:
          "This patient has multiple cardiovascular risk factors (DM, hypertension, dyslipidaemia) and both her LDL-C and HbA1c are above target. The Diabetes Canada guidelines recommend high-intensity statin therapy targeting LDL-C <2.0 mmol/L in DM with additional CV risk factors — increasing atorvastatin to 40 mg is appropriate. HbA1c of 8.4% warrants diabetes management optimisation, but this should be approached collaboratively (discussing options including SGLT2i or GLP-1RA that also provide CV and renal benefit) rather than a simple metformin dose increase or immediate specialist referral. Her eGFR is 62 mL/min/1.73m² (CKD stage G2) — metformin is still safe above eGFR 45 and should not be stopped; however, renal function monitoring in 3 months is appropriate.",
        whyWrongByOptionId: {
          A: "Increasing atorvastatin is correct, but routine referral to endocrinology is premature — the NP can optimise diabetes management within scope. Early referral delays definitive treatment.",
          B: "Metformin 3000 mg/day is above the recommended maximum (2550 mg/day); this approach does not address the LDL or renal monitoring needs.",
          D: "Metformin is safe in eGFR >45 mL/min/1.73m² and should not be stopped at 62. Sulfonylureas carry hypoglycaemia risk and offer no cardiovascular or renal benefit. This option is incorrect.",
        },
        clinicalJudgmentFocus: "Multifactorial cardiovascular risk reduction — statin intensification, glycaemic optimisation, and renal monitoring.",
        consequencesByOptionId: {
          A: { trajectory: "acceptable", outcome: "LDL improves but the HbA1c remains elevated while awaiting the endocrinology appointment. Three months pass before diabetes management is adjusted." },
          B: { trajectory: "suboptimal", outcome: "Metformin dose increase provides marginal additional glycaemic benefit but does not address the LDL-C or the need for renal monitoring. At 3 months, LDL remains 2.8 mmol/L." },
          C: { trajectory: "optimal", outcome: "Atorvastatin increased to 40 mg. Metformin continued. You discuss SGLT2 inhibitor options given her DM and CKD G2 profile, and arrange 3-month renal function check. At follow-up, LDL-C is 1.9 mmol/L and HbA1c is 7.3%." },
          D: { trajectory: "harmful", outcome: "Stopping metformin prematurely causes glycaemic deterioration. The sulfonylurea causes two hypoglycaemic episodes, one requiring emergency department assessment. The error is identified on chart review." },
        },
      },
    },

    // ── Step 2: 3-month review ────────────────────────────────────────────────
    {
      index: 2,
      heading: "3-month review",
      updateNarrative: "3 months later — medication adjustment review.",
      scenarioText:
        "Mrs. Nakamura returns for her 3-month review. She started canagliflozin 100 mg daily (SGLT2i) 2 months ago. She reports well-tolerated medications. BP today is 128/78 mmHg. She mentions her knee pain has been better managed with physiotherapy. She reports no polyuria, dysuria, or rash. She asks about her kidney test results.",
      clinicalUpdate: {
        direction: "improving",
        summary: "BP now at target. Glycaemic and lipid management ongoing.",
      },
      vitals: [
        { label: "BP", value: "128/78", unit: "mmHg" },
        { label: "HR", value: "72", unit: "bpm" },
        { label: "Weight", value: "72.0", unit: "kg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "3-month labs",
          finding: "HbA1c 7.1%; LDL-C 1.8 mmol/L; eGFR 59 mL/min/1.73m²; K+ 4.8 mmol/L; UACR 3.2 mg/mmol (moderately elevated)",
          values: [
            { test: "HbA1c", value: "7.1%", referenceRange: "Target <7.0%", flag: "H" },
            { test: "LDL-C", value: "1.8 mmol/L", referenceRange: "Target <2.0", },
            { test: "eGFR", value: "59", unit: "mL/min/1.73m²", referenceRange: "CKD stage G3a", flag: "L" },
            { test: "UACR", value: "3.2 mg/mmol", referenceRange: "<3.0 (normal)", flag: "H" },
            { test: "K+", value: "4.8 mmol/L", referenceRange: "3.5–5.0" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [
        { name: "Canagliflozin", dose: "100 mg", route: "PO", frequency: "daily", indication: "T2DM + CV/renal protection", flag: "new" },
        { name: "Atorvastatin", dose: "40 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia", flag: "changed" },
      ],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mrs. Nakamura's eGFR has declined from 62 to 59 mL/min/1.73m² and UACR is 3.2 mg/mmol (moderately elevated). She is on canagliflozin. What is the most appropriate action regarding her SGLT2 inhibitor and renal function?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Stop canagliflozin immediately due to declining eGFR." },
          { id: "B", label: "Continue canagliflozin — the small eGFR decline is expected and reversible (haemodynamic effect); the UACR elevation supports continued use for renoprotection. Arrange follow-up in 3 months." },
          { id: "C", label: "Reduce canagliflozin to 50 mg daily and recheck eGFR in 1 month." },
          { id: "D", label: "Add an ARB to replace ramipril given the declining renal function." },
        ],
        correctOptionId: "B",
        rationale:
          "A modest initial eGFR decline of 2–5 mL/min/1.73m² after starting an SGLT2 inhibitor is expected, well-characterised, and haemodynamic in origin (reduced glomerular hyperfiltration). This is not a reason to stop the drug. In patients with CKD and albuminuria, SGLT2 inhibitors provide proven renoprotective benefit by reducing intraglomerular pressure. The UACR of 3.2 mg/mmol (moderately elevated) at CKD G3a actually reinforces the indication for canagliflozin per the Kidney Disease: Improving Global Outcomes (KDIGO) 2022 guidelines, which endorse SGLT2i down to eGFR 20. Stopping canagliflozin would remove renoprotective benefit. Routine 3-month monitoring of eGFR and UACR is appropriate.",
        whyWrongByOptionId: {
          A: "Stopping canagliflozin due to an initial haemodynamic eGFR dip is a common prescribing error. The dip is reversible and expected. Discontinuation removes the cardiovascular and renoprotective benefit at the time it is most needed.",
          C: "Canagliflozin 50 mg is not a licensed dose reduction in this indication; the drug is 100 mg or 300 mg in Canada. Dose-reducing is not evidence-based in this scenario.",
          D: "Mrs. Nakamura is already on ramipril (an ACE inhibitor). Combining an ACEi with an ARB is not recommended due to increased risk of hyperkalaemia and renal injury without proven additional benefit.",
        },
        clinicalJudgmentFocus: "Safe continuation of renoprotective therapy — distinguishing expected haemodynamic eGFR dip from true nephrotoxicity.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "Canagliflozin is stopped. Over the following 6 months, UACR rises to 5.8 mg/mmol and HbA1c returns to 8.0%. At the annual review, the NP must restart the SGLT2i and manage the metabolic deterioration." },
          B: { trajectory: "optimal", outcome: "Canagliflozin is continued. At 6-month follow-up, eGFR stabilises at 60 mL/min/1.73m² and UACR decreases to 2.4 mg/mmol. HbA1c is 6.9%. BP remains well-controlled." },
          C: { trajectory: "suboptimal", outcome: "A 50 mg dose does not exist for canagliflozin. The pharmacist flags a prescribing error. After correction, the scenario defaults to continuing at 100 mg, but the delay causes confusion and a missed monitoring window." },
          D: { trajectory: "harmful", outcome: "Adding losartan to ramipril causes significant hyperkalaemia (K+ 5.6 mmol/L) 4 weeks later. The combination is discontinued and the patient requires urgent reassessment." },
        },
      },
    },

    // ── Step 3: Acute presentation ────────────────────────────────────────────
    {
      index: 3,
      heading: "Urgent same-day appointment",
      updateNarrative: "6 weeks later — Mrs. Nakamura calls with a new concern.",
      scenarioText:
        "Mrs. Nakamura calls requesting a same-day appointment. She reports 3 days of worsening right calf pain and swelling, which she noticed after a 9-hour flight returning from a family trip last week. She denies chest pain but reports mild dyspnoea on exertion for the past 24 hours. Vital signs: BP 132/80, HR 98, RR 20, SpO2 95% on room air, T 37.2°C. Right calf is swollen, tender to palpation at the gastrocnemius, and 2 cm larger in circumference than the left.",
      clinicalUpdate: {
        direction: "critical",
        summary: "New acute presentation — suspected DVT with possible PE. Requires urgent evaluation.",
        newFindings: ["Right calf swelling, tenderness, 2 cm asymmetry", "SpO2 95% (drop from 98%)", "HR 98 bpm (elevated)", "Dyspnoea on exertion", "Long-haul travel 9 days prior"],
      },
      vitals: [
        { label: "BP", value: "132/80", unit: "mmHg" },
        { label: "HR", value: "98", unit: "bpm", flag: "high" },
        { label: "RR", value: "20", unit: "br/min", flag: "high" },
        { label: "SpO2", value: "95%", unit: "", flag: "low" },
        { label: "Temp", value: "37.2", unit: "°C" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mrs. Nakamura presents with a 3-day history of right calf pain and swelling after long-haul travel, with dyspnoea on exertion and SpO2 95%. Wells DVT score is 3 (high probability). What is the most appropriate immediate action?",
        family: "acute-deterioration-urgent-referral",
        options: [
          { id: "A", label: "Order a D-dimer and arrange duplex ultrasound for the following week." },
          { id: "B", label: "Call 911 and transfer to the emergency department immediately given SpO2 95% and possible PE." },
          { id: "C", label: "Start therapeutic LMWH empirically and arrange urgent bilateral leg duplex ultrasound today." },
          { id: "D", label: "Prescribe compression stockings and reassess in 48 hours." },
        ],
        correctOptionId: "B",
        rationale:
          "Mrs. Nakamura has multiple features of a high-risk presentation: Wells DVT score 3 (high probability), exertional dyspnoea, and SpO2 95% — a drop from her baseline of 98%. The combination of high-probability DVT with respiratory compromise raises serious concern for pulmonary embolism. SpO2 below 95% is a red flag in this clinical context. In a primary care setting, this patient should be transferred to the emergency department by ambulance for urgent CT pulmonary angiography, IV access, and haemodynamic monitoring. While initiating LMWH empirically in DVT is appropriate in some settings, the respiratory compromise here exceeds what can be safely managed in a primary care clinic. The NP's role is to recognise the urgency, communicate a clear handover, and ensure safe transfer.",
        whyWrongByOptionId: {
          A: "D-dimer is not indicated in high pre-test probability (Wells ≥2 in the simplified score); a negative D-dimer cannot safely exclude DVT/PE. Arranging imaging for next week is dangerously delayed given the respiratory compromise.",
          C: "Empirical LMWH is appropriate for confirmed or high-probability DVT, but this patient's respiratory compromise (SpO2 95%, exertional dyspnoea) suggests possible PE, which requires emergency evaluation and CT-PA — not safe to manage in a primary care clinic.",
          D: "Compression stockings are inappropriate as the sole management for high-probability DVT. This option delays diagnosis and treatment of a potentially life-threatening condition.",
        },
        clinicalJudgmentFocus: "Recognising acute deterioration requiring emergency transfer — applying Wells score and identifying respiratory red flags for PE.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "While waiting for the D-dimer result (which is appropriately not ordered), Mrs. Nakamura deteriorates at home. She is brought to emergency by her spouse with SpO2 88% and haemodynamic compromise consistent with submassive PE. Delayed diagnosis increases morbidity." },
          B: { trajectory: "optimal", outcome: "Mrs. Nakamura is transferred by ambulance. CT-PA confirms right-sided segmental PE with bilateral calf DVT. She is anticoagulated with rivaroxaban and discharged in 3 days in stable condition. At follow-up, you coordinate ongoing anticoagulation management." },
          C: { trajectory: "suboptimal", outcome: "You initiate LMWH and arrange ultrasound. While waiting for the ultrasound report, her SpO2 drops to 92% and she requires emergency transfer regardless. The delay complicated the handover." },
          D: { trajectory: "harmful", outcome: "Compression stockings are applied. Mrs. Nakamura returns 48 hours later via ambulance in haemodynamic instability from a large saddle PE. Delayed treatment results in ICU admission." },
        },
      },
    },
  ],
};

// ── Case 2: Type 2 Diabetes + Metabolic Complexity ────────────────────────────

export const CASE_DIABETES_METABOLIC: PatientCase = {
  id: "cnple-sample-dm-001",
  title: "Mr. Ahmad Chen — Type 2 Diabetes and Metabolic Complexity",
  tagline: "Chronic Disease · Prescribing Safety",
  patient: { age: 62, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Diabetes follow-up. HbA1c remains elevated. Wants to avoid insulin.",
  pmhx: [
    "Type 2 diabetes mellitus (12 years)",
    "Obesity (BMI 38)",
    "Non-alcoholic fatty liver disease (NAFLD) — ultrasound confirmed",
    "CKD stage G2 (eGFR 64 mL/min/1.73m²)",
    "Hypertension",
  ],
  medications: [
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "T2DM" },
    { name: "Gliclazide MR", dose: "60 mg", route: "PO", frequency: "daily", indication: "T2DM" },
    { name: "Ramipril", dose: "10 mg", route: "PO", frequency: "daily", indication: "Hypertension / nephroprotection" },
    { name: "Rosuvastatin", dose: "10 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia" },
  ],
  allergies: [{ substance: "Codeine", reaction: "Nausea/vomiting", severity: "mild" }],
  primaryDomain: "chronic-disease-management",
  secondaryDomains: ["pharmacotherapeutics", "diagnostics-labs"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 16,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "Diabetes Canada Clinical Practice Guidelines (2023)",
      "KDIGO CKD Guidelines (2022)",
      "Canadian Obesity Clinical Practice Guidelines (2020)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Diabetes review",
      scenarioText:
        "Mr. Chen presents for a scheduled diabetes review. His HbA1c has been above target for 18 months despite dose optimisation of gliclazide. He reports two episodes of mild hypoglycaemia in the past month (both resolved with juice). His BMI is 38 and he is motivated to lose weight. He asks whether there is a diabetes medication that could also help with weight loss.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Glycaemic control persistently above target; hypoglycaemia episodes on sulphonylurea; obesity as modifiable factor.",
        newFindings: ["HbA1c 8.9%", "Two hypoglycaemia episodes past month", "BMI 38"],
      },
      vitals: [
        { label: "BP", value: "134/82", unit: "mmHg" },
        { label: "HR", value: "80", unit: "bpm" },
        { label: "Weight", value: "102", unit: "kg" },
        { label: "BMI", value: "38", unit: "kg/m²" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Recent labs",
          finding: "HbA1c 8.9%; eGFR 64; ALT 52 U/L (elevated); AST 44 U/L (elevated)",
          values: [
            { test: "HbA1c", value: "8.9%", referenceRange: "Target <7.0% in T2DM", flag: "H" },
            { test: "eGFR", value: "64", unit: "mL/min/1.73m²", referenceRange: "CKD G2: 60–89" },
            { test: "ALT", value: "52 U/L", referenceRange: "7–40 U/L", flag: "H" },
            { test: "AST", value: "44 U/L", referenceRange: "10–40 U/L", flag: "H" },
          ],
          timestamp: "3 weeks ago",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Chen has T2DM with HbA1c 8.9%, obesity (BMI 38), NAFLD, CKD G2 (eGFR 64), and recurrent hypoglycaemia on gliclazide. He wants to avoid insulin and is interested in weight-supportive therapy. What is the most appropriate next medication adjustment?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Add a GLP-1 receptor agonist (e.g., semaglutide SC) and discontinue gliclazide." },
          { id: "B", label: "Increase gliclazide MR to 120 mg daily to achieve better glycaemic control." },
          { id: "C", label: "Add an SGLT2 inhibitor and continue gliclazide at the current dose." },
          { id: "D", label: "Start basal insulin and discontinue gliclazide." },
        ],
        correctOptionId: "A",
        rationale:
          "GLP-1 receptor agonists (e.g., semaglutide) are the preferred escalation for T2DM with obesity and NAFLD: they reduce HbA1c by ~1.5%, cause meaningful weight loss (5–15%), improve hepatic steatosis, and carry no intrinsic hypoglycaemia risk. Gliclazide should be discontinued — it is causing hypoglycaemia, provides no cardiovascular or weight benefit, and increasing it would worsen the hypoglycaemia risk. SGLT2 inhibitors are also excellent in this patient (CKD G2, CV risk), but GLP-1RA is preferred when weight loss is a priority and hepatic involvement is present. Starting basal insulin is premature and would increase hypoglycaemia and weight.",
        whyWrongByOptionId: {
          B: "Increasing gliclazide worsens the hypoglycaemia risk without addressing the root problem. Sulphonylureas are weight-neutral at best and the patient has already demonstrated hypoglycaemia susceptibility.",
          C: "An SGLT2i is a reasonable option in this patient, but continuing gliclazide perpetuates the hypoglycaemia risk. The correct approach is to switch, not add.",
          D: "Basal insulin is appropriate when oral agents have failed, but this patient has not trialled a GLP-1RA or SGLT2i. Insulin adds weight, hypoglycaemia risk, and injection burden prematurely.",
        },
        clinicalJudgmentFocus: "Agent selection in complex T2DM: weight, hypoglycaemia risk, NAFLD, CKD.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Semaglutide started at 0.25 mg SC weekly; gliclazide stopped. At 3 months: HbA1c 7.6%, weight 96 kg (−6 kg), no hypoglycaemia. ALT normalises at 6 months." },
          B: { trajectory: "harmful", outcome: "Three further hypoglycaemic episodes occur within 4 weeks, one requiring assistance from a family member. HbA1c remains 8.7%. Patient loses confidence in management." },
          C: { trajectory: "suboptimal", outcome: "SGLT2i added but gliclazide continued. HbA1c improves to 7.9% but two hypoglycaemia episodes occur. Weight loss is modest (−2 kg)." },
          D: { trajectory: "suboptimal", outcome: "Insulin is initiated. HbA1c reaches 7.4% but weight increases by 3 kg and the patient reports three mild hypoglycaemic episodes. He is frustrated by the injection requirement." },
        },
      },
    },
    {
      index: 1,
      heading: "3-month semaglutide review",
      updateNarrative: "3 months later — semaglutide titration review.",
      scenarioText:
        "Mr. Chen returns 3 months after starting semaglutide. He tolerated the titration but reports persistent nausea with meals, particularly after fatty foods. Weight has decreased from 102 to 95 kg. He is currently on semaglutide 0.5 mg SC weekly. He is asking when nausea will improve and whether he can increase the dose.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Weight loss and glycaemic improvement. GI side effects on GLP-1RA.",
        newFindings: ["Weight 95 kg (−7 kg)", "Ongoing nausea with meals"],
      },
      vitals: [
        { label: "BP", value: "130/80", unit: "mmHg" },
        { label: "Weight", value: "95", unit: "kg" },
        { label: "BMI", value: "35.7", unit: "kg/m²" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "3-month labs",
          finding: "HbA1c 7.6%; eGFR 62; ALT 38 U/L (normalising)",
          values: [
            { test: "HbA1c", value: "7.6%", referenceRange: "Target <7.0%", flag: "H" },
            { test: "eGFR", value: "62", unit: "mL/min/1.73m²" },
            { test: "ALT", value: "38 U/L", referenceRange: "7–40 U/L" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [
        { name: "Semaglutide", dose: "0.5 mg", route: "SC", frequency: "weekly", indication: "T2DM / weight", flag: "new" },
        { name: "Gliclazide MR", flag: "discontinued" },
      ],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Chen has persistent nausea on semaglutide 0.5 mg SC weekly. HbA1c is 7.6% (target <7.0%) and he has lost 7 kg. What is the most appropriate advice regarding dose titration?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Increase to semaglutide 1 mg SC weekly now — the nausea will resolve with continued use." },
          { id: "B", label: "Hold at 0.5 mg for an additional 4 weeks to allow GI tolerability to improve before titrating." },
          { id: "C", label: "Discontinue semaglutide and switch to a DPP-4 inhibitor given GI intolerance." },
          { id: "D", label: "Add domperidone 10 mg TID to manage nausea and proceed with dose increase." },
        ],
        correctOptionId: "B",
        rationale:
          "Nausea is the most common side effect of GLP-1 receptor agonists, typically dose-dependent and transient. Standard practice is to hold the dose for an additional 4 weeks when nausea is present before proceeding with titration — not to dose-escalate through active nausea, which worsens tolerability and increases dropout. Importantly, HbA1c has already improved to 7.6% — he is approaching target without further dose escalation. Discontinuing semaglutide is premature; nausea is an expected and manageable side effect. Domperidone has QTc prolongation risks and is not indicated for medication-induced nausea management in this context.",
        whyWrongByOptionId: {
          A: "Increasing the dose during active nausea is likely to worsen GI side effects, risking dropout from an otherwise effective therapy. The standard approach is to hold and allow tolerability to improve.",
          C: "Switching to a DPP-4 inhibitor abandons a medication with proven weight loss and NAFLD benefit for a less effective agent. GI tolerability with GLP-1RAs usually improves with time.",
          D: "Domperidone has QTc prolongation risk and drug interaction potential. It is not the appropriate management for GLP-1RA-induced nausea. Dietary counselling (smaller meals, avoiding fatty foods) and dose holding are the first-line approach.",
        },
        clinicalJudgmentFocus: "GLP-1RA titration strategy — managing GI side effects without premature discontinuation.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "Nausea worsens significantly at 1 mg. Mr. Chen stops semaglutide after 2 weeks. He has to restart at the lowest dose 6 weeks later, losing the momentum of his weight loss." },
          B: { trajectory: "optimal", outcome: "Nausea resolves over the next 3 weeks. Semaglutide increased to 1 mg at the next visit. At 6 months: HbA1c 6.9%, weight 91 kg." },
          C: { trajectory: "suboptimal", outcome: "DPP-4 inhibitor provides modest HbA1c reduction (0.7%) with no weight benefit. At 6 months HbA1c is 7.9% and weight has increased slightly." },
          D: { trajectory: "harmful", outcome: "Domperidone prescribed. QTc prolongation is identified on a subsequent ECG (QTc 478 ms). The drug is discontinued and a cardiology review is required, complicating the diabetes management episode." },
        },
      },
    },
    {
      index: 2,
      heading: "6-month metabolic review",
      updateNarrative: "6 months after initiating semaglutide — annual metabolic panel.",
      scenarioText:
        "Mr. Chen returns for his 6-month metabolic review. He is well and tolerating semaglutide 1 mg SC weekly. His weight is now 91 kg (−11 kg from baseline). He feels the best he has in years. Repeat labs are available. His eGFR has drifted to 58 mL/min/1.73m² — he asks whether any of his medications need adjustment.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Excellent metabolic response. eGFR decline requires medication safety review.",
        newFindings: ["eGFR 58 — now CKD G3a", "HbA1c at target", "Weight −11 kg"],
      },
      vitals: [
        { label: "BP", value: "126/78", unit: "mmHg" },
        { label: "Weight", value: "91", unit: "kg" },
        { label: "BMI", value: "34.2", unit: "kg/m²" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "6-month labs",
          finding: "HbA1c 6.9%; eGFR 58; UACR 4.1 mg/mmol; K+ 5.0; Cr 104 µmol/L; ALT 29 U/L",
          values: [
            { test: "HbA1c", value: "6.9%", referenceRange: "Target <7.0%" },
            { test: "eGFR", value: "58", unit: "mL/min/1.73m²", referenceRange: "CKD G3a: 45–59", flag: "L" },
            { test: "UACR", value: "4.1 mg/mmol", referenceRange: "<3.0 (normal)", flag: "H" },
            { test: "K+", value: "5.0 mmol/L", referenceRange: "3.5–5.0" },
            { test: "Creatinine", value: "104 µmol/L", referenceRange: "62–106 µmol/L (M)" },
            { test: "ALT", value: "29 U/L", referenceRange: "7–40 U/L" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [
        { name: "Semaglutide", dose: "1 mg", route: "SC", frequency: "weekly", indication: "T2DM / weight", flag: "changed" },
      ],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "Mr. Chen's eGFR has declined to 58 mL/min/1.73m² (CKD G3a) with UACR 4.1 mg/mmol (moderately elevated). He is on metformin 1000 mg BID and semaglutide 1 mg SC weekly. What is the most appropriate medication safety review action?",
        family: "lab-diagnostic-interpretation",
        options: [
          { id: "A", label: "Continue all medications unchanged — eGFR 58 is above the threshold requiring dose adjustment for metformin or semaglutide." },
          { id: "B", label: "Stop metformin immediately given CKD G3a." },
          { id: "C", label: "Continue metformin at current dose with 3-monthly eGFR monitoring; add an SGLT2 inhibitor given the UACR elevation for additional renoprotection." },
          { id: "D", label: "Reduce metformin to 500 mg BID and discontinue semaglutide given renal decline." },
        ],
        correctOptionId: "C",
        rationale:
          "Metformin is safe above eGFR 45 mL/min/1.73m² in Canada (Diabetes Canada guidelines); no dose reduction is required at eGFR 58. Semaglutide is safe in CKD G3a with no dose adjustment required. However, CKD G3a with moderate albuminuria (UACR 4.1 mg/mmol) is an indication for an SGLT2 inhibitor per KDIGO 2022 guidelines — they provide independent renoprotection by reducing glomerular hyperfiltration, and are safe down to eGFR 20 for their cardio-renal indication. Adding an SGLT2i (e.g., empagliflozin or dapagliflozin) alongside continued monitoring is the evidence-based approach. 3-monthly eGFR monitoring is appropriate.",
        whyWrongByOptionId: {
          A: "While current medications are safe at eGFR 58, the UACR elevation signals progressive nephropathy that warrants additional renoprotective therapy — not a passive \"continue unchanged\" approach.",
          B: "Stopping metformin at eGFR 58 is incorrect and premature; Canadian guidelines permit use down to eGFR 45. Discontinuation removes effective, well-tolerated, low-cost glycaemic therapy unnecessarily.",
          D: "Reducing metformin dose at eGFR 58 is not indicated. Discontinuing semaglutide is inappropriate — it has been highly effective and has no contraindication in CKD G3a.",
        },
        clinicalJudgmentFocus: "Metformin and GLP-1RA safety in CKD G3a; recognising SGLT2i renoprotection indication.",
        consequencesByOptionId: {
          A: { trajectory: "acceptable", outcome: "Renal function is monitored. At 12 months eGFR is 56 and UACR has risen to 5.2 mg/mmol — the opportunity for early SGLT2i intervention was missed." },
          B: { trajectory: "suboptimal", outcome: "Metformin is stopped unnecessarily. HbA1c rises to 7.4% at 3 months. The discontinuation triggers unnecessary endocrinology referral." },
          C: { trajectory: "optimal", outcome: "Empagliflozin 10 mg daily added. At 12 months: eGFR stable at 59, UACR 2.8 mg/mmol (normalised), HbA1c 6.7%, weight 89 kg." },
          D: { trajectory: "harmful", outcome: "Semaglutide discontinued. HbA1c rises to 8.1%. Weight regains 4 kg over 6 months. The clinical gains from the previous 6 months are largely reversed." },
        },
      },
    },
  ],
};

// ── Case 3: Anticoagulation Management ────────────────────────────────────────

export const CASE_ANTICOAGULATION_AF: PatientCase = {
  id: "cnple-sample-ac-001",
  title: "Mr. Kwame Mensah — Atrial Fibrillation and Anticoagulation",
  tagline: "Prescribing Safety · Chronic Disease",
  patient: { age: 67, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Palpitations — new AF diagnosis. Referred by walk-in. Wants to understand treatment options.",
  pmhx: [
    "Hypertension (well controlled)",
    "Type 2 diabetes mellitus",
    "Prior TIA (3 years ago, full recovery)",
    "CKD stage G2–G3a (eGFR fluctuating 55–68)",
  ],
  medications: [
    { name: "Amlodipine", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "T2DM" },
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension / nephroprotection" },
    { name: "Atorvastatin", dose: "20 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia" },
  ],
  allergies: [{ substance: "Sulfa drugs", reaction: "Rash", severity: "moderate" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["chronic-disease-management", "acute-urgent-care"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 15,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "Canadian Cardiovascular Society AF Guidelines (2020)",
      "CCS Heart Failure Guidelines (2021)",
      "KDIGO CKD Guidelines (2022)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "New AF diagnosis",
      scenarioText:
        "Mr. Mensah presents with a 2-week history of intermittent palpitations. Walk-in ECG confirmed paroxysmal AF. He is haemodynamically stable. HR today is 84 bpm in sinus rhythm. BP 136/82. No chest pain, dyspnoea, or syncope. He has a prior TIA 3 years ago. He asks whether he needs a blood thinner.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "New paroxysmal AF with high stroke risk profile.",
        newFindings: ["AF confirmed by ECG at walk-in", "Prior TIA — high CHA₂DS₂-VASc score", "Currently in sinus rhythm"],
      },
      vitals: [
        { label: "BP", value: "136/82", unit: "mmHg" },
        { label: "HR", value: "84", unit: "bpm" },
        { label: "RR", value: "16", unit: "br/min" },
        { label: "SpO2", value: "97%", unit: "" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Current labs",
          finding: "eGFR 58; CrCl estimated 46 mL/min (Cockcroft-Gault); K+ 4.4; Cr 112 µmol/L",
          values: [
            { test: "eGFR (CKD-EPI)", value: "58", unit: "mL/min/1.73m²" },
            { test: "CrCl (C-G)", value: "46", unit: "mL/min", referenceRange: "Relevant for DOAC dosing" },
            { test: "K+", value: "4.4 mmol/L", referenceRange: "3.5–5.0" },
            { test: "Creatinine", value: "112 µmol/L", referenceRange: "62–106 µmol/L (M)", flag: "H" },
          ],
          timestamp: "Today",
        },
        { type: "ecg", name: "Walk-in ECG (yesterday)", finding: "Paroxysmal AF — now in sinus rhythm at presentation." },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Mensah has paroxysmal AF with CHA₂DS₂-VASc score 5 (age 67, male, hypertension, diabetes, prior TIA). CrCl is 46 mL/min (Cockcroft-Gault). He has no contraindications to anticoagulation. What is the most appropriate anticoagulation decision?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Start warfarin (target INR 2.0–3.0) — preferred over DOACs in CKD." },
          { id: "B", label: "Start apixaban 5 mg BID — standard dose, CrCl is above the dose-reduction threshold and dose-reduction criteria are not met." },
          { id: "C", label: "Start apixaban 2.5 mg BID — reduce dose given CrCl 46 mL/min and age 67." },
          { id: "D", label: "Defer anticoagulation — he is currently in sinus rhythm so the risk is low." },
        ],
        correctOptionId: "B",
        rationale:
          "Apixaban is preferred over warfarin in most AF patients including CKD given its superior efficacy-safety profile. Apixaban dose reduction to 2.5 mg BID requires meeting ≥2 of 3 criteria: age ≥80, weight ≤60 kg, or serum creatinine ≥133 µmol/L. Mr. Mensah is age 67 (not ≥80), weight is not ≤60 kg, and his creatinine is 112 µmol/L (below the ≥133 threshold) — he meets none of the three criteria. Standard dose 5 mg BID is correct. Although CrCl 46 mL/min warrants awareness, the Canadian Cardiovascular Society guidelines base apixaban dose selection on the three-criteria rule, not on CrCl alone. Standard dose 5 mg BID is safe and provides superior stroke protection vs. under-dosing.",
        whyWrongByOptionId: {
          A: "Warfarin is second-line in AF anticoagulation — DOACs are preferred unless there is a specific contraindication (mechanical valve, severe mitral stenosis, CrCl <15). CKD G3a does not mandate warfarin over DOACs.",
          C: "Dose reduction to 2.5 mg BID requires meeting ≥2 of 3 criteria: age ≥80, weight ≤60 kg, creatinine ≥133 µmol/L. Mr. Mensah meets none of these. Under-dosing apixaban provides inferior stroke protection without benefit.",
          D: "CHA₂DS₂-VASc ≥2 mandates anticoagulation in AF regardless of rhythm at the time of assessment — paroxysmal AF carries the same stroke risk as persistent AF. Deferring anticoagulation in a patient with prior TIA and CHA₂DS₂-VASc 5 is a serious error.",
        },
        clinicalJudgmentFocus: "DOAC selection and dosing in AF with moderate CKD — applying CHA₂DS₂-VASc and apixaban dose-reduction criteria.",
        consequencesByOptionId: {
          A: { trajectory: "acceptable", outcome: "Warfarin is initiated. INR is labile for the first 3 months requiring frequent monitoring. Time in therapeutic range is 55% at 3 months. Second-line choice but manageable." },
          B: { trajectory: "optimal", outcome: "Apixaban 5 mg BID initiated. No bleeding or thromboembolic events at 6-month follow-up. Renal function stable. Patient tolerates well." },
          C: { trajectory: "suboptimal", outcome: "Dose reduction applied incorrectly. At 6-month review, a clinical pharmacist identifies the under-dosing. Risk of stroke was elevated during this period." },
          D: { trajectory: "harmful", outcome: "Anticoagulation deferred. Seven weeks later, Mr. Mensah presents to ED with a right MCA territory ischaemic stroke. He is left with moderate left hemiparesis. The missed opportunity for anticoagulation is the proximate preventable cause." },
        },
      },
    },
    {
      index: 1,
      heading: "6-week anticoagulation review",
      updateNarrative: "6 weeks later — apixaban tolerability and rate control.",
      scenarioText:
        "Mr. Mensah returns 6 weeks after starting apixaban 5 mg BID. He tolerated it well with no bleeding. However, he reports recurrent palpitations over the past week — more frequent than before. A rhythm strip in the office today shows AF at 112 bpm. He feels mildly breathless walking up stairs but no chest pain or syncope.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "AF returned with rapid ventricular response — rate control required.",
        newFindings: ["AF at 112 bpm on rhythm strip", "Exertional dyspnoea on stairs"],
      },
      vitals: [
        { label: "BP", value: "138/86", unit: "mmHg" },
        { label: "HR", value: "112", unit: "bpm", flag: "high" },
        { label: "RR", value: "18", unit: "br/min" },
        { label: "SpO2", value: "96%", unit: "" },
      ],
      diagnosticArtifacts: [
        { type: "ecg", name: "Office rhythm strip", finding: "Atrial fibrillation, ventricular rate 112 bpm. No ST changes." },
      ],
      medicationChanges: [
        { name: "Apixaban", dose: "5 mg", route: "PO", frequency: "twice daily", indication: "AF stroke prevention", flag: "new" },
      ],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Mensah has AF at 112 bpm with mild exertional dyspnoea. BP 138/86. No heart failure features. He is not on rate control. What is the most appropriate initial rate control strategy?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Start metoprolol succinate 25 mg daily for rate control." },
          { id: "B", label: "Start diltiazem 120 mg ER daily — calcium channel blocker preferred in AF." },
          { id: "C", label: "Refer urgently to cardiology for cardioversion." },
          { id: "D", label: "Start digoxin 0.125 mg daily — rate control with renal dose consideration." },
        ],
        correctOptionId: "A",
        rationale:
          "Beta-blockers (metoprolol) are first-line for rate control in AF with no contraindications and no heart failure with reduced ejection fraction — they are effective, well-studied, and well-tolerated. Diltiazem is an alternative but is avoided if left ventricular function is unknown or reduced; beta-blockers are generally preferred first-line in primary care AF rate control when there are no contraindications. Mr. Mensah has no history of heart failure, asthma, or AV block that would contraindicate a beta-blocker. Urgent cardioversion is not required — he is haemodynamically stable with mild symptoms. Digoxin has a narrow therapeutic index, requires renal dosing (CrCl 46), and is not a first-line rate control agent in paroxysmal AF in active patients.",
        whyWrongByOptionId: {
          B: "Diltiazem is a reasonable second-line option but is avoided in suspected systolic dysfunction. Beta-blockers are generally preferred as first-line rate control in primary care AF.",
          C: "Urgent cardioversion is appropriate for haemodynamically unstable or refractory AF. Mr. Mensah is stable with mild symptoms — rate control is the correct initial approach.",
          D: "Digoxin is a third-line rate control agent with narrow therapeutic index and requires careful renal dose adjustment. It is inadequate as monotherapy for active patients and is not first-line in paroxysmal AF.",
        },
        clinicalJudgmentFocus: "First-line rate control in paroxysmal AF — beta-blocker selection, avoiding digoxin as first-line.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Metoprolol succinate 25 mg daily initiated. At 2-week follow-up, resting HR is 78 bpm. Palpitation frequency decreased. Echocardiogram arranged — EF is 55%, no structural disease." },
          B: { trajectory: "acceptable", outcome: "Diltiazem ER initiated. Rate controlled to 82 bpm at 2 weeks. Acceptable outcome but beta-blocker preferred as first-line." },
          C: { trajectory: "suboptimal", outcome: "Cardiology referral made. Cardioversion performed 3 weeks later. Patient returns to sinus rhythm briefly but reverts to AF within 2 weeks. Rate control was the more appropriate initial strategy." },
          D: { trajectory: "harmful", outcome: "Digoxin 0.125 mg daily started without checking levels. At 3 weeks, patient presents with nausea, visual changes, and heart rate 48 bpm. Digoxin toxicity confirmed. Emergency management required." },
        },
      },
    },
    {
      index: 2,
      heading: "6-month AF management review",
      updateNarrative: "6 months later — comprehensive AF and anticoagulation review.",
      scenarioText:
        "Mr. Mensah presents for his 6-month review. He is on apixaban 5 mg BID and metoprolol succinate 50 mg daily. AF is well rate-controlled at 74 bpm. He is asymptomatic. He mentions he started ibuprofen 400 mg PRN for knee pain over the past 3 weeks at the suggestion of a friend. He asks whether this is safe with his anticoagulant.",
      clinicalUpdate: { direction: "stable", summary: "Well rate-controlled AF. New NSAID use — drug interaction requiring action." },
      vitals: [
        { label: "BP", value: "130/78", unit: "mmHg" },
        { label: "HR", value: "74", unit: "bpm" },
        { label: "RR", value: "14", unit: "br/min" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "6-month labs",
          finding: "eGFR 54; Hgb 138 g/L; platelets 224; K+ 4.7",
          values: [
            { test: "eGFR", value: "54", unit: "mL/min/1.73m²", referenceRange: "CKD G3a", flag: "L" },
            { test: "Hgb", value: "138 g/L", referenceRange: "130–170 g/L (M)" },
            { test: "Platelets", value: "224 × 10⁹/L", referenceRange: "150–400" },
            { test: "K+", value: "4.7 mmol/L", referenceRange: "3.5–5.0" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [
        { name: "Metoprolol succinate", dose: "50 mg", route: "PO", frequency: "daily", indication: "AF rate control", flag: "changed" },
      ],
      followUpInterval: { value: 6, unit: "months", label: "6 months later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Mensah has been self-medicating with ibuprofen 400 mg PRN while on apixaban 5 mg BID. What is the most appropriate counselling and management?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Continue ibuprofen — occasional use is safe with apixaban." },
          { id: "B", label: "Advise to stop ibuprofen immediately; use acetaminophen instead. Document the interaction and reinforce medication safety counselling." },
          { id: "C", label: "Reduce apixaban to 2.5 mg BID to reduce bleeding risk while continuing ibuprofen." },
          { id: "D", label: "Stop apixaban temporarily while he needs anti-inflammatory pain relief." },
        ],
        correctOptionId: "B",
        rationale:
          "NSAIDs significantly increase bleeding risk when combined with anticoagulants — the combination of apixaban and ibuprofen increases risk of gastrointestinal haemorrhage by approximately 3–4-fold versus apixaban alone. Additionally, NSAIDs cause sodium and water retention, potentially elevating BP and worsening renal function in a patient already at CKD G3a. Ibuprofen should be stopped and replaced with acetaminophen (effective for osteoarthritis pain without anticoagulant interaction). Reducing apixaban dose is pharmacologically incorrect — dose reduction is not a strategy for managing drug interactions. Stopping apixaban exposes him to stroke risk — his CHA₂DS₂-VASc is 5 including prior TIA.",
        whyWrongByOptionId: {
          A: "There is no safe level of NSAID use with anticoagulants for routine analgesia. The bleeding risk increase is clinically significant from any regular NSAID use.",
          C: "Reducing apixaban dose does not mitigate the bleeding risk from the NSAID interaction — it simply reduces stroke protection without addressing the underlying hazard.",
          D: "Temporarily stopping apixaban in a patient with prior TIA and CHA₂DS₂-VASc 5 is dangerous. The thromboembolic risk during the gap is unacceptable.",
        },
        clinicalJudgmentFocus: "NSAID–anticoagulant interaction recognition; safe analgesia alternatives in AF.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "Three weeks later, Mr. Mensah presents with haematemesis and melaena. Upper GI bleed confirmed — likely NSAID-potentiated apixaban bleed. Endoscopy required. Apixaban held during acute management." },
          B: { trajectory: "optimal", outcome: "Ibuprofen stopped; acetaminophen 500–1000 mg QID PRN substituted. BP and renal function remain stable. No bleeding episodes at 6-week follow-up." },
          C: { trajectory: "harmful", outcome: "Apixaban dose reduced unnecessarily — NSAID interaction risk persists. At 10 weeks, GI bleed occurs (same mechanism as Option A). Stroke risk was also elevated by the dose reduction." },
          D: { trajectory: "harmful", outcome: "Apixaban paused. Two weeks later, Mr. Mensah has a TIA. He is brought to ED by his wife. Anticoagulation is restarted with urgent neurology review." },
        },
      },
    },
  ],
};

// ── Case 4: Mental Health + Prescribing Safety ────────────────────────────────

export const CASE_MENTAL_HEALTH_SSRI: PatientCase = {
  id: "cnple-sample-mh-001",
  title: "Ms. Isabelle Tremblay — Major Depression and Prescribing Safety",
  tagline: "Mental Health · Prescribing Safety",
  patient: { age: 34, sex: "Female", pronouns: "she/her", setting: "Primary Care Clinic" },
  chiefComplaint: "Low mood, poor sleep, and anxiety for 3 months. Requesting treatment.",
  pmhx: [
    "Major depressive disorder (first episode, current)",
    "Generalised anxiety disorder",
    "Chronic low back pain (managed with tramadol PRN)",
    "No prior psychiatric hospitalisations",
  ],
  medications: [
    { name: "Tramadol", dose: "50 mg", route: "PO", frequency: "PRN (up to twice daily)", indication: "Chronic low back pain" },
    { name: "Ibuprofen", dose: "400 mg", route: "PO", frequency: "PRN", indication: "Back pain" },
    { name: "Oral contraceptive pill", dose: "Levonorgestrel/ethinyl estradiol 0.15/0.03 mg", route: "PO", frequency: "daily", indication: "Contraception" },
  ],
  allergies: [],
  primaryDomain: "mental-health",
  secondaryDomains: ["pharmacotherapeutics", "ethics-legal-professional"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 15,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "CANMAT Depression Guidelines (2023)",
      "Health Canada Drug Product Database — tramadol/SSRI interaction",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Initial depression assessment",
      scenarioText:
        "Ms. Tremblay presents reporting 3 months of persistent low mood, anhedonia, poor concentration, fatigue, and disturbed sleep (difficulty falling asleep, early wakening). PHQ-9 score today is 16 (moderately severe depression). She denies suicidal ideation. She is functional at work but struggling. She uses tramadol 50 mg up to twice daily for chronic back pain. She asks to start an antidepressant today.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Moderately severe MDD confirmed. Significant prescribing interaction risk with tramadol.",
        newFindings: ["PHQ-9: 16 (moderately severe)", "Concurrent tramadol use — serotonin syndrome risk if SSRI added"],
      },
      vitals: [
        { label: "BP", value: "118/74", unit: "mmHg" },
        { label: "HR", value: "78", unit: "bpm" },
        { label: "Temp", value: "36.8", unit: "°C" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "mental-health",
      question: {
        stem: "Ms. Tremblay has moderately severe MDD (PHQ-9 16) and takes tramadol PRN up to 50 mg BID for chronic back pain. You plan to start an antidepressant. What is the most appropriate prescribing approach?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Start sertraline 50 mg daily — preferred first-line SSRI; tramadol interaction risk is theoretical and can be monitored." },
          { id: "B", label: "Start sertraline 50 mg daily; discontinue tramadol and transition to an alternative non-serotonergic analgesic before initiating the SSRI." },
          { id: "C", label: "Start mirtazapine 15 mg nightly — avoids the serotonin syndrome risk and improves sleep." },
          { id: "D", label: "Defer antidepressants and refer directly to psychiatry." },
        ],
        correctOptionId: "B",
        rationale:
          "Tramadol is a weak serotonin-norepinephrine reuptake inhibitor in addition to its opioid activity. Combining tramadol with an SSRI significantly increases the risk of serotonin syndrome — a potentially life-threatening drug interaction characterised by hyperthermia, autonomic instability, clonus, and altered mental status. The correct approach is to discontinue tramadol first and transition to a non-serotonergic analgesic (e.g., acetaminophen ± a short course of a non-interacting agent, or physiotherapy for back pain management) before initiating the SSRI. Starting sertraline without addressing tramadol is a prescribing safety error. Mirtazapine is a reasonable antidepressant option for comorbid anxiety and insomnia, but does not solve the tramadol interaction — it has mild serotonergic activity and should also not be combined with tramadol without caution. Psychiatric referral is appropriate for complex or refractory depression, not moderate-first-episode MDD in a primary care setting.",
        whyWrongByOptionId: {
          A: "The serotonin syndrome risk from tramadol + SSRI is not theoretical — it is a well-documented, potentially life-threatening interaction. Monitoring is insufficient as serotonin syndrome can develop acutely.",
          C: "Mirtazapine has its own serotonergic mechanisms and is not considered safe to combine with tramadol. It does not resolve the core prescribing safety problem.",
          D: "First-episode moderately severe MDD without psychosis, suicidality, or treatment resistance is a primary care diagnosis. Initiating antidepressant therapy within primary care is within NP scope and the appropriate level of care.",
        },
        clinicalJudgmentFocus: "Serotonin syndrome risk identification — SSRI + tramadol interaction is a high-stakes prescribing safety priority.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "Sertraline started with tramadol continuing. Three weeks later, Ms. Tremblay presents to ED with agitation, diaphoresis, clonus, and temperature 38.9°C. Serotonin syndrome diagnosed. Both drugs discontinued; cyproheptadine administered. Hospitalised 48 hours." },
          B: { trajectory: "optimal", outcome: "Tramadol discontinued; acetaminophen 1000 mg QID substituted for back pain. Physiotherapy referral made. Sertraline 50 mg started 5 days later. At 4 weeks: PHQ-9 11 (moderate). No adverse drug events." },
          C: { trajectory: "suboptimal", outcome: "Mirtazapine started. Sleep improves modestly. However, back pain management is unaddressed and PHQ-9 remains 14 at 4 weeks. The tramadol interaction risk was not resolved." },
          D: { trajectory: "suboptimal", outcome: "Psychiatry wait list is 6–8 weeks. Ms. Tremblay's symptoms deteriorate; she takes a mental health leave from work. Psychiatry eventually initiates sertraline — the same first-line option the NP could have started safely." },
        },
      },
    },
    {
      index: 1,
      heading: "4-week antidepressant review",
      updateNarrative: "4 weeks after starting sertraline.",
      scenarioText:
        "Ms. Tremblay returns 4 weeks after starting sertraline 50 mg daily (tramadol was stopped and replaced with acetaminophen before initiation). PHQ-9 today is 10 (moderate depression). She reports some improvement in sleep and energy but ongoing low mood and flat affect. She also reports increased anxiety in the first week that has since settled. She asks about increasing the dose.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Partial response to sertraline 50 mg at 4 weeks. Dose titration consideration.",
      },
      vitals: [{ label: "BP", value: "116/72", unit: "mmHg" }, { label: "HR", value: "76", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Sertraline", dose: "50 mg", route: "PO", frequency: "daily", indication: "MDD / GAD", flag: "new" },
        { name: "Tramadol", flag: "discontinued" },
        { name: "Acetaminophen", dose: "1000 mg", route: "PO", frequency: "QID PRN", indication: "Back pain", flag: "new" },
      ],
      followUpInterval: { value: 4, unit: "weeks", label: "4 weeks later" },
      cnpleDomain: "mental-health",
      question: {
        stem: "Ms. Tremblay has a partial response to sertraline 50 mg at 4 weeks (PHQ-9 improved from 16 to 10). She tolerated the medication well after initial anxiety settled. What is the most appropriate next step?",
        family: "single-best-answer-clinical-judgment",
        options: [
          { id: "A", label: "Increase sertraline to 100 mg daily — 4 weeks is sufficient time to assess response; partial response warrants dose titration." },
          { id: "B", label: "Wait a full 8 weeks at 50 mg before adjusting dose — it is too early to titrate." },
          { id: "C", label: "Switch to venlafaxine — SSRIs are not working." },
          { id: "D", label: "Add a benzodiazepine for residual anxiety and wait for full antidepressant response." },
        ],
        correctOptionId: "A",
        rationale:
          "Partial response at 4 weeks with good tolerability is an appropriate trigger for dose titration. Canadian CANMAT guidelines recommend a 4-week assessment point for SSRI dose optimisation — if partial response is present and the medication is tolerated, dose increase is appropriate. Waiting a full 8 weeks at 50 mg unnecessarily prolongs subtherapeutic treatment when partial response suggests the patient may respond better to a higher dose. Switching antidepressants at 4 weeks with partial response is premature — a failed trial requires adequate dose and duration (at least 4–6 weeks at target dose). Adding a benzodiazepine is not indicated for antidepressant-related anxiety, which has already settled; chronic benzodiazepine use in MDD is associated with dependence and impaired treatment response.",
        whyWrongByOptionId: {
          B: "Partial response at 4 weeks with good tolerability is the indication to titrate — not to wait. Remaining at a sub-optimal dose for another 4 weeks delays recovery without rationale.",
          C: "Switching at 4 weeks with partial response is premature. A failed SSRI trial requires adequate dose and duration. Venlafaxine is appropriate after failed first-line SSRI, not during.",
          D: "Benzodiazepines are not indicated as adjunctive therapy for antidepressant-induced initial anxiety that has already resolved. Chronic benzo use impairs antidepressant treatment outcomes and creates dependence risk.",
        },
        clinicalJudgmentFocus: "SSRI dose titration decision — partial response at 4 weeks, CANMAT guidance.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Sertraline increased to 100 mg. At 8 weeks total: PHQ-9 5 (mild/remission). Patient reports sustained mood improvement and return to normal functioning." },
          B: { trajectory: "suboptimal", outcome: "Dose held at 50 mg for 4 more weeks. PHQ-9 remains 9–10. At 8 weeks, dose is increased to 100 mg — the same endpoint, but 4 weeks later." },
          C: { trajectory: "suboptimal", outcome: "Switch to venlafaxine. Requires 2-week sertraline taper then titration of venlafaxine. Patient experiences withdrawal symptoms and delayed recovery." },
          D: { trajectory: "harmful", outcome: "Lorazepam added. Initial anxiety relief but PHQ-9 remains 11 at 8 weeks. Patient becomes concerned about lorazepam dependence; tapering is difficult. Mood outcomes worse with benzodiazepine co-prescription." },
        },
      },
    },
    {
      index: 2,
      heading: "8-week depression review",
      updateNarrative: "8 weeks after sertraline initiation — dose 100 mg for 4 weeks.",
      scenarioText:
        "Ms. Tremblay returns for her 8-week review. PHQ-9 today is 6 (mild residual symptoms, approaching remission). She reports significant improvement — better sleep, improved concentration, social engagement has resumed. She asks how long she needs to continue sertraline and whether she can stop soon now that she feels better.",
      clinicalUpdate: { direction: "improving", summary: "Near-remission response to sertraline 100 mg. Counselling on treatment duration required." },
      vitals: [{ label: "BP", value: "116/72", unit: "mmHg" }, { label: "HR", value: "74", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Sertraline", dose: "100 mg", route: "PO", frequency: "daily", indication: "MDD / GAD", flag: "changed" },
      ],
      followUpInterval: { value: 4, unit: "weeks", label: "4 weeks later" },
      cnpleDomain: "mental-health",
      question: {
        stem: "Ms. Tremblay has near-remission (PHQ-9 6) after 8 weeks on sertraline, now at 100 mg daily. She asks to stop the medication. What is the most appropriate counselling?",
        family: "professional-ethics-legal-scope",
        options: [
          { id: "A", label: "Advise her to continue sertraline for a minimum of 6–12 months from remission before considering taper." },
          { id: "B", label: "Begin sertraline taper now — she has achieved remission and prolonged treatment is unnecessary." },
          { id: "C", label: "Tell her to continue indefinitely — first-episode depression has a 50% recurrence rate." },
          { id: "D", label: "Switch to St. John's Wort — a natural alternative for maintenance." },
        ],
        correctOptionId: "A",
        rationale:
          "Canadian CANMAT guidelines recommend continuing antidepressant therapy for a minimum of 6–12 months following remission from a first episode of MDD to prevent relapse. Stopping when feeling well is a common patient misconception — the early improvement phase is when relapse risk is highest if medication is prematurely discontinued. She has not yet achieved full remission (PHQ-9 <5) and has been on an effective dose for only 4 weeks. The appropriate counselling is: (1) continue for at least 6–12 months from full remission, (2) any taper should be slow and supervised, (3) plan a follow-up to reassess before any dose change.",
        whyWrongByOptionId: {
          B: "She has not yet achieved full remission and has been on the therapeutic dose for only 4 weeks. Premature discontinuation in the early response phase carries a high relapse risk.",
          C: "While lifetime maintenance is appropriate for recurrent or severe depression, a minimum defined treatment period (6–12 months) rather than \"indefinite\" is more accurate and more aligned with shared decision-making for first-episode MDD.",
          D: "St. John's Wort has significant drug interactions (including OCP, reducing contraceptive efficacy — highly relevant for this patient on OCP) and is not an appropriate maintenance recommendation. It is not evidence-based as a maintenance strategy.",
        },
        clinicalJudgmentFocus: "Antidepressant treatment duration counselling — preventing relapse with appropriate continuation phase guidance.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Ms. Tremblay continues sertraline 100 mg for 9 months from remission. PHQ-9 reaches 3 (remission). Planned slow taper over 4 weeks is completed successfully without relapse at 12-month follow-up." },
          B: { trajectory: "harmful", outcome: "Sertraline tapered and stopped. Within 6 weeks, Ms. Tremblay relapses with PHQ-9 of 15. Antidepressant restarted; recovery takes an additional 3 months." },
          C: { trajectory: "suboptimal", outcome: "\"Indefinite\" framing causes significant patient anxiety. Ms. Tremblay stops sertraline unilaterally 4 months later without medical supervision, experiencing withdrawal symptoms." },
          D: { trajectory: "harmful", outcome: "St. John's Wort started. Within 3 weeks, Ms. Tremblay reports breakthrough spotting and missed periods. The OCP's effectiveness has been reduced by St. John's Wort CYP3A4 induction. She is advised to use additional contraception immediately." },
        },
      },
    },
  ],
};

// ── Case 5: Paediatric Febrile Illness ────────────────────────────────────────

export const CASE_PAEDIATRIC_FEVER: PatientCase = {
  id: "cnple-sample-peds-001",
  title: "Charlie Bergeron — Paediatric Febrile Illness",
  tagline: "Paediatrics · Prescribing Safety",
  patient: { age: "22 months", sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Fever for 2 days, fussy, pulling at right ear.",
  pmhx: [
    "Term birth, uncomplicated delivery",
    "Up to date on immunisations",
    "One prior AOM episode at 14 months (resolved without antibiotics)",
    "No known drug allergies",
  ],
  medications: [],
  allergies: [],
  primaryDomain: "pediatrics",
  secondaryDomains: ["pharmacotherapeutics", "acute-urgent-care"],
  difficulty: 2,
  stepCount: 3,
  estimatedMinutes: 12,
  isPremium: false,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "Canadian Paediatric Society — Acute Otitis Media (2016, updated 2023)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Febrile 22-month-old",
      scenarioText:
        "Charlie, a 22-month-old male, presents with 2 days of fever (Tmax 39.4°C at home), irritability, decreased appetite, and right ear pulling. He has been sleeping poorly. Parents report he had mild URI symptoms 5 days ago. He is fully immunised. On examination: T 39.0°C (tympanic), HR 138 bpm, RR 28 br/min, SpO2 99% on room air. He is irritable but consolable. Pneumatic otoscopy: right TM is red, bulging, and non-mobile with decreased light reflex. Left TM is normal.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Right acute otitis media with fever, bulging TM, and impaired TM mobility.",
        newFindings: ["Right TM bulging, immobile, erythematous on pneumatic otoscopy", "Fever 39.0°C", "Preceding URI"],
      },
      vitals: [
        { label: "Temp", value: "39.0", unit: "°C", flag: "high" },
        { label: "HR", value: "138", unit: "bpm", flag: "high" },
        { label: "RR", value: "28", unit: "br/min" },
        { label: "SpO2", value: "99%", unit: "" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pediatrics",
      question: {
        stem: "Charlie, 22 months, has right-sided AOM with bulging TM, 2-day fever up to 39.4°C, and significant distress. He has had one prior AOM at 14 months that resolved without antibiotics. What is the most appropriate management?",
        family: "lifespan-primary-care",
        options: [
          { id: "A", label: "Watchful waiting with analgesia for 48–72 hours — most AOM resolves without antibiotics." },
          { id: "B", label: "Start amoxicillin 80–90 mg/kg/day in two divided doses for 10 days." },
          { id: "C", label: "Start amoxicillin-clavulanate 90/6.4 mg/kg/day — broader coverage required given prior AOM." },
          { id: "D", label: "Refer urgently to paediatrics — fever and bulging TM requires specialist assessment." },
        ],
        correctOptionId: "B",
        rationale:
          "In children aged 2 years and under with AOM, the Canadian Paediatric Society (CPS) guidelines recommend antibiotic treatment (not watchful waiting) when: age <2 years with bilateral AOM, age <2 years with any AOM with severe symptoms (fever ≥39°C, significant distress), or otorrhoea. Charlie is 22 months with a bulging TM, fever ≥39°C, significant irritability — antibiotic treatment is indicated. Amoxicillin 80–90 mg/kg/day in two divided doses for 5–10 days (10 days for children <2 years or severe disease) is first-line. Amoxicillin-clavulanate is reserved for treatment failure (no improvement at 48–72 hours), prior amoxicillin exposure within 30 days, or concurrent purulent conjunctivitis. Watchful waiting is appropriate for milder presentations in older children (>2 years).",
        whyWrongByOptionId: {
          A: "Watchful waiting is not appropriate for a child under 2 years with AOM and fever ≥39°C and significant symptoms — this meets the CPS threshold for antibiotic treatment.",
          C: "Amoxicillin-clavulanate is second-line, reserved for treatment failure, recent amoxicillin exposure, or concurrent purulent conjunctivitis. Using it first-line is not indicated here and exposes the child to broader-spectrum antibiotic unnecessarily.",
          D: "AOM is routinely managed in primary care. This does not meet criteria for urgent paediatric referral. Referral is indicated for suspected mastoiditis, meningitis, or labyrinthitis.",
        },
        clinicalJudgmentFocus: "AOM antibiotic decision — applying age-based and severity criteria per CPS guidelines.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "Charlie is sent home with analgesic only. At 48-hour phone follow-up, fever persists at 39.2°C and he has been inconsolable overnight. Parents return: TM still bulging. Antibiotic started — watchful waiting was not appropriate here." },
          B: { trajectory: "optimal", outcome: "Amoxicillin 80 mg/kg/day for 10 days prescribed. By day 3, fever resolves and irritability decreases. At day 10 follow-up, right TM improved — mildly pink but no longer bulging." },
          C: { trajectory: "suboptimal", outcome: "Amoxicillin-clavulanate prescribed. Charlie develops significant diarrhoea by day 3. Family contacts the clinic. Broader spectrum use was not indicated for a first-line AOM treatment." },
          D: { trajectory: "suboptimal", outcome: "Paediatrics has no same-day availability. Charlie seen 2 days later — they initiate amoxicillin for what was straightforward primary care AOM. Delay causes unnecessary suffering and parental anxiety." },
        },
      },
    },
    {
      index: 1,
      heading: "48-hour phone follow-up",
      updateNarrative: "48 hours into amoxicillin — scheduled follow-up call.",
      scenarioText:
        "You perform a scheduled 48-hour follow-up call. Charlie's parents report he still has fever (38.6°C this morning) but has been significantly less irritable since yesterday evening. He is eating somewhat better. He is completing the amoxicillin without difficulty. Parents ask whether the treatment is working.",
      clinicalUpdate: { direction: "improving", summary: "Improving clinical picture at 48 hours — response to amoxicillin." },
      vitals: [{ label: "Temp (home)", value: "38.6", unit: "°C (AM)" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Amoxicillin", dose: "80 mg/kg/day", route: "PO", frequency: "divided twice daily", indication: "AOM right", flag: "new" },
      ],
      followUpInterval: { value: 2, unit: "days", label: "48 hours later" },
      cnpleDomain: "pediatrics",
      question: {
        stem: "At 48-hour phone follow-up: Charlie is less irritable, eating better, but still has a low fever (38.6°C). He is tolerating amoxicillin. What is the most appropriate response?",
        family: "lifespan-primary-care",
        options: [
          { id: "A", label: "Advise to continue amoxicillin and reassure — clinical improvement at 48 hours is expected; fever may persist 2–3 days." },
          { id: "B", label: "Switch to amoxicillin-clavulanate immediately — fever at 48 hours indicates treatment failure." },
          { id: "C", label: "Stop amoxicillin — fever persisting means antibiotics are not helping." },
          { id: "D", label: "Add azithromycin — coverage gap for atypical organisms is likely causing treatment failure." },
        ],
        correctOptionId: "A",
        rationale:
          "Clinical improvement (decreased irritability, improved feeding) at 48 hours is the key indicator of antibiotic response — not the speed of fever resolution. Fever from AOM can persist for 2–3 days after antibiotic initiation. True treatment failure is defined as no improvement in symptoms (not just ongoing fever) at 48–72 hours. Charlie shows clear clinical improvement — this is the expected course. Switching to broader-spectrum antibiotics or adding azithromycin at 48 hours with evidence of improvement is premature and inappropriate antibiotic stewardship.",
        whyWrongByOptionId: {
          B: "Treatment failure is determined by no clinical improvement at 48–72 hours — not by fever persistence alone. Charlie has improved clinically. Switching to amoxicillin-clavulanate is premature.",
          C: "Stopping antibiotics at 48 hours because fever persists is incorrect and unsafe — AOM treatment requires completion of the full course for children under 2 years.",
          D: "Azithromycin provides no additional coverage for typical AOM organisms and is not indicated for treatment failure in this setting. Adding antibiotics empirically when improvement is occurring promotes resistance.",
        },
        clinicalJudgmentFocus: "Recognising clinical improvement as the treatment response indicator — fever persistence is expected at 48 hours.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Amoxicillin continued. At day 5, Charlie is afebrile and back to his normal temperament. Parents complete the 10-day course. Day 10 in-person review shows resolving AOM." },
          B: { trajectory: "suboptimal", outcome: "Switched to amoxicillin-clavulanate unnecessarily. Charlie develops loose stools and a perineal rash. The change was not indicated." },
          C: { trajectory: "harmful", outcome: "Amoxicillin stopped at 48 hours. By day 5, fever returns to 39.2°C and Charlie is again inconsolable. TM is now perforated with purulent otorrhoea. Incomplete treatment course caused treatment failure." },
          D: { trajectory: "suboptimal", outcome: "Azithromycin added. No benefit demonstrated. Introduces unnecessary antibiotic exposure and potential macrolide resistance selection pressure." },
        },
      },
    },
    {
      index: 2,
      heading: "10-day AOM follow-up",
      updateNarrative: "10 days after initial visit — end-of-treatment review.",
      scenarioText:
        "Charlie presents for his 10-day end-of-treatment review. He has been afebrile since day 5 and is back to his normal activity level. Parents completed the full amoxicillin course. On examination: T 37.1°C, HR 108 bpm, SpO2 99%. Right TM: mildly pink, no bulging, light reflex present, mobility reduced on pneumatic otoscopy. Left TM normal. Parents ask whether Charlie needs to come back.",
      clinicalUpdate: { direction: "improving", summary: "Clinical resolution. Residual middle ear effusion is common — watchful waiting appropriate." },
      vitals: [
        { label: "Temp", value: "37.1", unit: "°C" },
        { label: "HR", value: "108", unit: "bpm" },
        { label: "SpO2", value: "99%", unit: "" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [{ name: "Amoxicillin", flag: "discontinued" }],
      followUpInterval: { value: 10, unit: "days", label: "Day 10" },
      cnpleDomain: "pediatrics",
      question: {
        stem: "Charlie has completed his antibiotic course. He is afebrile and well. Right TM shows reduced mobility on pneumatic otoscopy — consistent with middle ear effusion. What is the appropriate next step?",
        family: "lifespan-primary-care",
        options: [
          { id: "A", label: "Reassure parents — middle ear effusion after AOM is expected and usually resolves spontaneously within 3 months. Recheck at 3 months if effusion persists." },
          { id: "B", label: "Refer immediately to ENT for tympanostomy tubes — reduced TM mobility indicates treatment failure." },
          { id: "C", label: "Start a second course of antibiotics — residual effusion indicates bacterial persistence." },
          { id: "D", label: "Prescribe intranasal corticosteroids to resolve the middle ear effusion." },
        ],
        correctOptionId: "A",
        rationale:
          "Middle ear effusion (otitis media with effusion, OME) following a resolved AOM episode is extremely common — present in up to 40% of children at 1 month and resolving spontaneously in the majority by 3 months. CPS guidelines recommend watchful waiting for OME following AOM resolution in otherwise healthy children with no hearing concerns. ENT referral is appropriate only if effusion persists beyond 3 months with associated hearing loss or language delay. A second antibiotic course is not indicated for asymptomatic OME after treated AOM. Intranasal corticosteroids have not been shown to accelerate resolution of OME.",
        whyWrongByOptionId: {
          B: "ENT referral for tympanostomy tubes is appropriate for persistent OME (>3 months) with hearing concerns or language delay — not for acute post-AOM effusion at day 10.",
          C: "Residual effusion is not a sign of bacterial persistence after clinical resolution. A second antibiotic course exposes Charlie to unnecessary medication without proven benefit.",
          D: "Intranasal corticosteroids are not effective for AOM-associated middle ear effusion and are not recommended by CPS guidelines for this indication.",
        },
        clinicalJudgmentFocus: "Post-AOM effusion management — recognising expected course vs. indications for escalation.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Parents reassured. At 3-month follow-up, TM mobility is normal. No hearing concerns. No ENT referral required." },
          B: { trajectory: "suboptimal", outcome: "ENT referral made. ENT confirms OME and recommends watchful waiting — the same management the NP could have provided. Three-month wait for an unnecessary specialist visit." },
          C: { trajectory: "harmful", outcome: "Second amoxicillin course prescribed. No benefit to effusion — OME is not a bacterial infection. Charlie develops diarrhoea and a rash from unnecessary antibiotic exposure." },
          D: { trajectory: "suboptimal", outcome: "Intranasal budesonide prescribed. At 6 weeks, effusion unchanged. The medication provided no benefit for this indication." },
        },
      },
    },
  ],
};

// ── Case 6: Perimenopause and Menopausal Hormone Therapy ──────────────────────

export const CASE_PERIMENOPAUSE_MHT: PatientCase = {
  id: "cnple-sample-wh-001",
  title: "Ms. Nadia Kowalski — Perimenopause and Menopausal Hormone Therapy",
  tagline: "Women's Health · Prescribing Safety",
  patient: { age: 48, sex: "Female", pronouns: "she/her", setting: "Primary Care Clinic" },
  chiefComplaint: "Hot flushes, poor sleep, and irregular periods for 8 months. Wants to discuss hormones.",
  pmhx: [
    "Previously well",
    "Gravida 2, Para 2 (vaginal births)",
    "No history of VTE, cardiovascular disease, or breast cancer",
    "Smoker: 5 cigarettes per day × 12 years",
    "BMI 27",
  ],
  medications: [{ name: "None", indication: "No regular medications" }],
  allergies: [],
  primaryDomain: "reproductive-sexual-health",
  secondaryDomains: ["pharmacotherapeutics", "health-promotion-prevention"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 14,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "SOGC Menopause and Osteoporosis Guidelines (2021)",
      "Canadian Menopause Society — MHT Position Statement (2023)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Perimenopause assessment",
      scenarioText:
        "Ms. Kowalski presents with 8 months of hot flushes (5–8/day, frequently nocturnal), sleep disruption, irritability, and irregular periods (cycles ranging from 22 to 45 days with occasional skipped cycles). She scores 21/30 on the Menopause Rating Scale (moderate-severe). She smokes 5 cigarettes per day. No personal or first-degree family history of breast cancer. No prior DVT. She is requesting menopausal hormone therapy (MHT). FSH 48 IU/L; LH 32 IU/L; E2 low for age.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Symptomatic perimenopause confirmed. MHT candidacy assessment required.",
        newFindings: ["FSH 48 IU/L, LH 32 IU/L — consistent with perimenopause", "Moderate-severe MRS score 21/30", "Smoker — VTE and cardiovascular risk modifier"],
      },
      vitals: [
        { label: "BP", value: "122/76", unit: "mmHg" },
        { label: "HR", value: "76", unit: "bpm" },
        { label: "BMI", value: "27", unit: "kg/m²" },
        { label: "Weight", value: "72", unit: "kg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Hormone panel",
          finding: "FSH 48 IU/L; LH 32 IU/L; E2 low for age; TSH normal (1.8 mIU/L); Hgb 122 g/L",
          values: [
            { test: "FSH", value: "48 IU/L", referenceRange: "Postmenopausal range >25 IU/L", flag: "H" },
            { test: "LH", value: "32 IU/L", referenceRange: "Elevated consistent with perimenopause", flag: "H" },
            { test: "TSH", value: "1.8 mIU/L", referenceRange: "0.4–4.0 mIU/L" },
            { test: "Hgb", value: "122 g/L", referenceRange: "120–160 g/L (F)" },
          ],
          timestamp: "2 weeks ago",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "reproductive-sexual-health",
      question: {
        stem: "Ms. Kowalski, 48, has symptomatic perimenopause with moderate-severe vasomotor symptoms. No personal or family history of breast cancer, no prior VTE, no cardiovascular disease. She smokes 5 cigarettes/day and her BP is 122/76. What is the most appropriate approach to MHT initiation?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Offer MHT with transdermal estradiol plus cyclic micronised progesterone — preferred route given smoking history." },
          { id: "B", label: "Offer oral combined estrogen-progestogen MHT — first-line for symptomatic perimenopause." },
          { id: "C", label: "Withhold MHT — smoking is an absolute contraindication." },
          { id: "D", label: "Offer venlafaxine 37.5 mg daily as a non-hormonal alternative — MHT is not recommended in perimenopausal women under 50." },
        ],
        correctOptionId: "A",
        rationale:
          "Transdermal estradiol is preferred over oral estrogen in women with VTE risk factors (including smoking and obesity) because transdermal delivery avoids first-pass hepatic metabolism, thereby avoiding the procoagulant effects of oral estrogen on clotting factors. Smoking is NOT an absolute contraindication to MHT — it is a modifier that influences route selection. The SOGC 2021 Menopause guidelines and the Canadian Menopause Society support transdermal estradiol for women with higher VTE risk profiles. Micronised progesterone (Prometrium) is preferred over synthetic progestogens for women with an intact uterus, as it has a more favourable safety profile. Ms. Kowalski's BP is normal, no contraindications are present, and her symptoms are significantly impacting quality of life. MHT is appropriate.",
        whyWrongByOptionId: {
          B: "Oral combined MHT increases VTE risk more than transdermal; given smoking history, transdermal route is preferred. Oral MHT is not wrong in all cases, but in a smoker transdermal is the correct first choice.",
          C: "Smoking is not an absolute contraindication to MHT. It is a risk modifier that should direct route selection (transdermal over oral) and counselling about smoking cessation.",
          D: "Non-hormonal options like venlafaxine are reserved for women with contraindications to MHT (active breast cancer, history of estrogen-sensitive cancer, unexplained vaginal bleeding, active VTE). Ms. Kowalski has no contraindications. Withholding MHT unnecessarily deprives her of effective treatment.",
        },
        clinicalJudgmentFocus: "MHT route selection in a smoker — transdermal estrogen preferred to reduce VTE risk.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Transdermal estradiol patch 50 mcg/24h twice-weekly + micronised progesterone 200 mg days 1–14 of cycle initiated. At 3 months: hot flushes 1–2/day (mild), sleep significantly improved, MRS 9/30. Smoking cessation counselling ongoing." },
          B: { trajectory: "acceptable", outcome: "Oral MHT initiated. Effective symptom control but increased thrombotic risk. Smoking cessation counselling crucial. Second-line choice given smoking history." },
          C: { trajectory: "suboptimal", outcome: "MHT withheld. Ms. Kowalski continues to experience severe vasomotor symptoms affecting sleep, work, and quality of life for another 12 months before being referred to menopause specialist." },
          D: { trajectory: "suboptimal", outcome: "Venlafaxine initiated. Modest reduction in hot flush frequency (30–40%) but does not address sleep disruption or mood symptoms as effectively as MHT. Patient dissatisfied with treatment outcome." },
        },
      },
    },
    {
      index: 1,
      heading: "3-month MHT review",
      updateNarrative: "3 months after starting transdermal MHT.",
      scenarioText:
        "Ms. Kowalski returns for her 3-month MHT review. She reports excellent symptomatic control — hot flushes reduced to 1–2 mild episodes per day, sleep much improved, and mood stabilised. She is pleased with the result. However, she reports breast tenderness that began 3 weeks after starting MHT and has been persistent. She is otherwise well. BP today is 118/74.",
      clinicalUpdate: { direction: "improving", summary: "Good MHT response. Breast tenderness is common side effect requiring assessment." },
      vitals: [{ label: "BP", value: "118/74", unit: "mmHg" }, { label: "HR", value: "74", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Estradiol patch", dose: "50 mcg/24h", route: "Transdermal", frequency: "twice weekly", indication: "Menopausal vasomotor symptoms", flag: "new" },
        { name: "Micronised progesterone", dose: "200 mg", route: "PO", frequency: "days 1–14", indication: "Endometrial protection", flag: "new" },
      ],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "reproductive-sexual-health",
      question: {
        stem: "Ms. Kowalski has excellent symptom control on transdermal estradiol 50 mcg + micronised progesterone but reports persistent breast tenderness for 6 weeks. What is the most appropriate management?",
        family: "health-promotion-screening",
        options: [
          { id: "A", label: "Reassure — breast tenderness is an expected side effect of MHT that typically resolves within 3–6 months; no action needed." },
          { id: "B", label: "Reduce estradiol patch to 25 mcg/24h, ensure mammogram is up to date, and arrange follow-up in 6 weeks." },
          { id: "C", label: "Stop MHT immediately — new breast symptoms require urgent breast surgery referral before continuing." },
          { id: "D", label: "Switch to continuous combined MHT — cyclic progesterone is causing the breast tenderness." },
        ],
        correctOptionId: "B",
        rationale:
          "Breast tenderness is a recognised and common side effect of MHT, particularly at initiation, often related to the estrogen dose. The management approach is: (1) confirm breast screening is current (mammography — due for Canadian women beginning at age 40–50 per provincial guidelines), (2) consider dose reduction if tenderness is troublesome, and (3) review and follow up. Reducing to 25 mcg patch addresses the likely estrogen dose-related tenderness while maintaining some symptom control. Stopping MHT immediately for this common side effect is disproportionate — breast tenderness is not a red flag requiring urgent surgical referral. Urgent referral is indicated for a discrete new breast lump, skin changes, nipple discharge, or axillary adenopathy, none of which are present.",
        whyWrongByOptionId: {
          A: "Breast tenderness from MHT warrants assessment — ensuring mammography is up to date and considering dose adjustment is part of good practice. Pure reassurance without action is insufficient.",
          C: "Stopping MHT for breast tenderness without a concerning breast finding is disproportionate. Urgent surgical referral is not warranted for diffuse tenderness without focal abnormalities.",
          D: "Cyclic progesterone is not typically associated with more breast tenderness than continuous regimens. This rationale is not evidence-based. The likely cause is estrogen dose.",
        },
        clinicalJudgmentFocus: "Managing breast tenderness on MHT — dose adjustment and cancer screening integration.",
        consequencesByOptionId: {
          A: { trajectory: "acceptable", outcome: "Tenderness resolves at 5 months. However, mammography was not confirmed — a missed preventive care opportunity." },
          B: { trajectory: "optimal", outcome: "Estradiol reduced to 25 mcg. Mammogram performed — normal. Breast tenderness resolves within 6 weeks. Vasomotor symptoms slightly increased but manageable." },
          C: { trajectory: "suboptimal", outcome: "MHT stopped. Vasomotor symptoms return to severe within 3 weeks. Breast surgery consultation confirms no pathology and recommends restarting MHT. Three months of unnecessary symptom burden." },
          D: { trajectory: "suboptimal", outcome: "Switched to continuous combined MHT. Breast tenderness persists — estrogen dose was not addressed. Patient experiences irregular spotting from the switch, requiring additional investigation." },
        },
      },
    },
    {
      index: 2,
      heading: "12-month MHT continuation review",
      updateNarrative: "12 months on MHT — annual safety review.",
      scenarioText:
        "Ms. Kowalski returns for her annual MHT safety review. She has been on estradiol 25 mcg patch twice weekly + micronised progesterone for 12 months. Symptoms are well controlled. Mammogram last month was normal. She reports she has reduced smoking to 2 cigarettes per day and is working toward cessation. She asks how long she can continue MHT.",
      clinicalUpdate: { direction: "stable", summary: "Well-controlled perimenopause on MHT. Annual safety review and duration counselling." },
      vitals: [{ label: "BP", value: "120/76", unit: "mmHg" }, { label: "HR", value: "72", unit: "bpm" }, { label: "BMI", value: "27", unit: "kg/m²" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 12, unit: "months", label: "12 months later" },
      cnpleDomain: "reproductive-sexual-health",
      question: {
        stem: "Ms. Kowalski asks how long she should continue MHT. She is 49, has a normal mammogram, well-controlled symptoms, and has almost stopped smoking. What is the most appropriate duration counselling?",
        family: "health-promotion-screening",
        options: [
          { id: "A", label: "Advise MHT should not continue beyond 5 years — risk outweighs benefit after this point." },
          { id: "B", label: "Advise MHT duration is individualised — benefits and risks should be reassessed annually; there is no arbitrary cut-off for healthy women under 60 years." },
          { id: "C", label: "Stop MHT now that she has been on it 12 months — this is the recommended maximum for perimenopausal women." },
          { id: "D", label: "Advise switching to SSRIs after age 50 — MHT is not recommended beyond menopause." },
        ],
        correctOptionId: "B",
        rationale:
          "The SOGC 2021 Menopause guidelines and the International Menopause Society recommend an individualised approach to MHT duration — there is no universal maximum duration. For women under 60 years with no contraindications and ongoing symptoms significantly affecting quality of life, the benefit-risk balance generally favours continuing MHT with annual reassessment. The concept of a 5-year or single-year maximum is outdated and based on misinterpretation of the WHI study (which used oral conjugated equine estrogen, different from transdermal estradiol). Annual review incorporating symptom control, cardiovascular risk, breast screening, and patient preferences is the evidence-based approach.",
        whyWrongByOptionId: {
          A: "The \"5-year maximum\" rule is not supported by current Canadian or international menopause guidelines. Duration is based on individualised risk-benefit review.",
          C: "Stopping after 12 months is not evidence-based. Perimenopausal symptoms can persist for 7–10 years; arbitrary discontinuation causes recurrence of symptoms affecting quality of life.",
          D: "SSRIs are a non-hormonal alternative for women with contraindications to MHT. They are not a replacement for effective MHT in a woman with no contraindications who is responding well.",
        },
        clinicalJudgmentFocus: "MHT duration — individualised approach, annual review, no arbitrary cut-off.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "MHT capped at 5 years. Vasomotor symptoms return at year 5 when MHT stopped. Patient seeks care for recurrent moderate symptoms and is restarted on MHT — the discontinuation was premature." },
          B: { trajectory: "optimal", outcome: "Annual review continued. At age 52 Ms. Kowalski transitions to natural menopause confirmation. She chooses to continue MHT for 2 more years for genitourinary symptoms then transitions to topical vaginal estrogen as systemic therapy is weaned." },
          C: { trajectory: "suboptimal", outcome: "MHT stopped at 12 months. Moderate hot flushes and sleep disturbance return within 6 weeks. Patient requests restart of MHT — premature discontinuation was not indicated." },
          D: { trajectory: "suboptimal", outcome: "Venlafaxine substituted for MHT at age 50. Genitourinary symptoms (dryness, dyspareunia) develop over 12 months that venlafaxine does not address. Topical estrogen required in addition." },
        },
      },
    },
  ],
};

// ── Case 7: Geriatric Polypharmacy ────────────────────────────────────────────

export const CASE_GERIATRIC_POLYPHARMACY: PatientCase = {
  id: "cnple-sample-geri-001",
  title: "Mr. Gilles Moreau — Geriatric Polypharmacy and Falls",
  tagline: "Geriatrics · Prescribing Safety",
  patient: { age: 84, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Annual review. Son accompanies — concerned about two recent falls and increasing confusion.",
  pmhx: [
    "Type 2 diabetes mellitus",
    "Hypertension",
    "Atrial fibrillation (rate controlled)",
    "Osteoarthritis (bilateral hips and knees)",
    "Benign prostatic hyperplasia",
    "Mild cognitive impairment (MCI — diagnosed 18 months ago)",
    "Insomnia",
    "Hypothyroidism",
    "GERD",
  ],
  medications: [
    { name: "Metformin", dose: "500 mg", route: "PO", frequency: "twice daily", indication: "T2DM" },
    { name: "Gliclazide MR", dose: "30 mg", route: "PO", frequency: "daily", indication: "T2DM" },
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Bisoprolol", dose: "2.5 mg", route: "PO", frequency: "daily", indication: "AF rate control" },
    { name: "Apixaban", dose: "2.5 mg", route: "PO", frequency: "twice daily", indication: "AF stroke prevention (dose-reduced: age >80, Cr 131 µmol/L)" },
    { name: "Naproxen", dose: "250 mg", route: "PO", frequency: "twice daily", indication: "Osteoarthritis pain" },
    { name: "Tamsulosin", dose: "0.4 mg", route: "PO", frequency: "daily", indication: "BPH" },
    { name: "Temazepam", dose: "15 mg", route: "PO", frequency: "nightly PRN", indication: "Insomnia (prescribed 3 years ago)" },
    { name: "Levothyroxine", dose: "75 mcg", route: "PO", frequency: "daily", indication: "Hypothyroidism" },
    { name: "Pantoprazole", dose: "40 mg", route: "PO", frequency: "daily", indication: "GERD" },
    { name: "Diphenhydramine", dose: "25 mg", route: "PO", frequency: "nightly PRN", indication: "Insomnia (OTC, self-initiated)" },
  ],
  allergies: [{ substance: "Penicillin", reaction: "Rash", severity: "mild" }],
  primaryDomain: "older-adult-care",
  secondaryDomains: ["pharmacotherapeutics", "ethics-legal-professional"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 20,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "American Geriatrics Society Beers Criteria (2023 update)",
      "STOPP/START Criteria v3 (2023)",
      "CMA Driver Fitness Guidelines (2017)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Annual review with polypharmacy audit",
      scenarioText:
        "Mr. Moreau, 84, presents for his annual review. His son notes two falls in the past 3 months (both mechanical, no loss of consciousness). He reports increasing morning grogginess and worsening short-term memory. His medication list is reviewed and reveals he has been taking both temazepam and OTC diphenhydramine nightly — he did not realise they are both sleep aids. His MMSE today is 22/30 (mild cognitive impairment — stable vs. prior 24/30 18 months ago). eGFR 48 mL/min/1.73m².",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Polypharmacy with multiple Beers Criteria medications, two falls, and cognitive decline. Medication safety review essential.",
        newFindings: ["Two falls in 3 months", "MMSE 22/30 (declining from 24)", "Concurrent benzodiazepine + anticholinergic use", "NSAID + anticoagulant combination", "eGFR 48"],
      },
      vitals: [
        { label: "BP (sitting)", value: "138/82", unit: "mmHg" },
        { label: "BP (standing 1 min)", value: "112/70", unit: "mmHg", flag: "low" },
        { label: "HR", value: "68", unit: "bpm" },
        { label: "Weight", value: "72", unit: "kg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Recent labs",
          finding: "eGFR 48; Cr 131 µmol/L; K+ 5.1; HbA1c 7.4%; TSH 1.9 mIU/L; Hgb 118 g/L",
          values: [
            { test: "eGFR", value: "48", unit: "mL/min/1.73m²", referenceRange: "CKD G3b", flag: "L" },
            { test: "Creatinine", value: "131 µmol/L", referenceRange: "62–106 µmol/L (M)", flag: "H" },
            { test: "K+", value: "5.1 mmol/L", referenceRange: "3.5–5.0", flag: "H" },
            { test: "HbA1c", value: "7.4%", referenceRange: "Target <8.0% in frail elderly acceptable" },
            { test: "TSH", value: "1.9 mIU/L", referenceRange: "0.4–4.0 mIU/L" },
            { test: "Hgb", value: "118 g/L", referenceRange: "130–170 g/L (M)", flag: "L" },
          ],
          timestamp: "Last week",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "older-adult-care",
      question: {
        stem: "Mr. Moreau, 84, has two recent falls, MMSE decline, orthostatic hypotension, and is on temazepam + diphenhydramine + naproxen + anticoagulant. Applying the Beers Criteria and geriatric prescribing principles, which medication changes are most urgent?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Discontinue temazepam, discontinue diphenhydramine, and stop naproxen — all three are inappropriate in an 84-year-old with falls and CKD." },
          { id: "B", label: "Reduce temazepam dose to 7.5 mg and counsel to stop diphenhydramine. Review naproxen at the next visit." },
          { id: "C", label: "Stop apixaban — anticoagulation is too risky in a patient with two falls." },
          { id: "D", label: "Add a calcium channel blocker for orthostatic hypotension and adjust medications at the next visit." },
        ],
        correctOptionId: "A",
        rationale:
          "Three high-priority Beers Criteria medications must be addressed urgently: (1) Temazepam (benzodiazepine) — Beers Criteria warns against benzodiazepines in older adults due to high falls risk, cognitive impairment, and prolonged sedation. Must be tapered and discontinued. (2) Diphenhydramine — anticholinergic burden is associated with cognitive impairment, urinary retention, delirium, and falls. Particularly dangerous in a patient with MCI. Should be discontinued immediately. (3) Naproxen (NSAID) — contraindicated in combination with anticoagulants (bleeding risk × 3–4), and inappropriate in CKD G3b (nephrotoxic). Stopping all three is urgent. Stopping apixaban is incorrect — his CHA₂DS₂-VASc is high and fall risk does not override anticoagulation benefit in AF (falls would need to occur ~300 times/year to negate benefit). Adding a calcium channel blocker for orthostatic hypotension when the cause is polypharmacy-induced treats the symptom rather than the cause.",
        whyWrongByOptionId: {
          B: "Reducing benzodiazepine dose is insufficient — temazepam must be tapered and discontinued in a patient with falls, cognitive decline, and sedation side effects. Deferring the NSAID review is unsafe given active anticoagulation and CKD.",
          C: "Stopping anticoagulation due to fall risk is a common but incorrect management decision. Evidence shows the thromboembolic risk in AF with prior stroke risk factors far exceeds the bleeding risk from falls. The HASBLED score should guide bleeding risk, not falls alone. Stopping apixaban exposes Mr. Moreau to high stroke risk.",
          D: "Adding a calcium channel blocker treats the orthostatic hypotension downstream effect while leaving the causative medications (benzodiazepine, alpha-blocker polypharmacy) in place. De-prescribing is the correct approach.",
        },
        clinicalJudgmentFocus: "Beers Criteria application — urgently identifying and removing unsafe medications in a frail older adult with falls.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Temazepam tapered (25% dose reduction q2wks), diphenhydramine stopped immediately, naproxen stopped with acetaminophen substituted. At 8-week follow-up: no further falls, less morning grogginess, MMSE 23/30 (improved after anticholinergic burden removed)." },
          B: { trajectory: "suboptimal", outcome: "Temazepam reduced but not stopped. Diphenhydramine stopped. At 6 weeks, another fall occurs. Residual benzodiazepine use in an 84-year-old with cognitive impairment remains dangerous." },
          C: { trajectory: "harmful", outcome: "Apixaban stopped. Six weeks later, Mr. Moreau presents with a left MCA ischaemic stroke. Anticoagulation was inappropriately withheld." },
          D: { trajectory: "harmful", outcome: "Amlodipine added. Ankle oedema develops at 3 weeks. Furosemide is added — the medication cascade worsens the polypharmacy burden. Falls risk compounds." },
        },
      },
    },
    {
      index: 1,
      heading: "6-week deprescribing follow-up",
      updateNarrative: "6 weeks after deprescribing — temazepam taper completed.",
      scenarioText:
        "Mr. Moreau returns 6 weeks later with his son. Temazepam has been fully tapered and discontinued. Diphenhydramine stopped. Naproxen stopped and replaced with acetaminophen 500 mg QID. He reports improved daytime alertness. No further falls. Son notes he seems 'more like himself.' However, Mr. Moreau reports difficulty sleeping without his 'sleep pill.' He asks for something to help with sleep.",
      clinicalUpdate: { direction: "improving", summary: "Post-deprescribing improvement. Sleep concerns require non-pharmacological management." },
      vitals: [
        { label: "BP (sitting)", value: "132/80", unit: "mmHg" },
        { label: "BP (standing 1 min)", value: "118/74", unit: "mmHg" },
        { label: "HR", value: "66", unit: "bpm" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Temazepam", flag: "discontinued" },
        { name: "Diphenhydramine", flag: "discontinued" },
        { name: "Naproxen", flag: "discontinued" },
        { name: "Acetaminophen", dose: "500 mg", route: "PO", frequency: "QID PRN", indication: "Osteoarthritis pain", flag: "new" },
      ],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "older-adult-care",
      question: {
        stem: "Mr. Moreau is requesting a new sleep aid now that temazepam has been discontinued. He has insomnia — difficulty falling asleep and frequent nocturnal wakening. What is the most appropriate management of insomnia in this 84-year-old?",
        family: "safe-prescribing-medication-management",
        options: [
          { id: "A", label: "Start zolpidem 5 mg nightly — non-benzodiazepine sedative-hypnotics are safer than benzodiazepines in older adults." },
          { id: "B", label: "Start low-dose doxepin 3–6 mg nightly — approved for insomnia in older adults with limited anticholinergic profile at low doses." },
          { id: "C", label: "Recommend sleep hygiene education and CBT for insomnia (CBTi) as first-line; avoid adding pharmacological sleep aids given falls history and cognitive impairment." },
          { id: "D", label: "Start melatonin 5 mg nightly — safest option for older adults." },
        ],
        correctOptionId: "C",
        rationale:
          "Cognitive Behavioural Therapy for Insomnia (CBTi) is the evidence-based first-line treatment for chronic insomnia in all age groups including older adults — it is more effective than pharmacotherapy long-term and has no adverse effects. In an 84-year-old with MCI and a falls history, adding any new pharmacological sleep aid carries significant risk: zolpidem is included in Beers Criteria for older adults (same falls/cognitive risk as benzodiazepines), doxepin has anticholinergic effects even at low doses in frail elderly, and melatonin evidence in older adults is weak and dose-dependent. Sleep hygiene education plus CBTi referral (or guided self-help CBTi) is the appropriate first step.",
        whyWrongByOptionId: {
          A: "Zolpidem (Z-drug) is explicitly included in the Beers Criteria for older adults — it carries equivalent falls and cognitive impairment risk as benzodiazepines. Not appropriate.",
          B: "Doxepin even at 3–6 mg has residual anticholinergic activity that is problematic in patients with MCI and can worsen cognitive function. The Beers Criteria flags TCAs including low-dose doxepin in older adults with cognitive impairment.",
          D: "Melatonin may provide modest benefit for sleep onset but has limited evidence for sleep maintenance and is not a substitute for CBTi. Recommending it without offering CBTi misses the evidence-based first-line treatment.",
        },
        clinicalJudgmentFocus: "Insomnia management in frail elderly — CBTi first-line, avoiding Beers Criteria sedatives.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "Zolpidem prescribed. Three weeks later, Mr. Moreau has another fall during a nocturnal bathroom trip. Hip X-ray shows no fracture but significant concern raised. Zolpidem discontinued." },
          B: { trajectory: "suboptimal", outcome: "Low-dose doxepin initiated. Sleep improves modestly but cognition worsens slightly at 4 weeks (MMSE 21). Anticholinergic effects identified as likely contributor. Discontinued." },
          C: { trajectory: "optimal", outcome: "Sleep hygiene education provided; CBTi workbook and brief community CBTi program referral arranged. At 8 weeks: sleep latency improved, one nocturnal waking (down from three). MMSE 23/30 maintained." },
          D: { trajectory: "acceptable", outcome: "Melatonin 2 mg (modified-release) started. Modest improvement in sleep onset. CBTi not offered. Acceptable short-term but misses the more effective long-term intervention." },
        },
      },
    },
    {
      index: 2,
      heading: "3-month goals-of-care conversation",
      updateNarrative: "3 months after initial deprescribing — goals-of-care planning.",
      scenarioText:
        "Mr. Moreau is at his 3-month review. No further falls. Sleep improved with CBTi strategies. MMSE stable at 23/30. However, his son raises concerns about his father's driving safety and asks about advance care planning. Mr. Moreau says he 'doesn't want to talk about all that yet' but his son is very concerned. You note that Mr. Moreau still holds a valid driver's licence.",
      clinicalUpdate: { direction: "stable", summary: "Stable post-deprescribing. Driving safety and advance care planning require professional assessment and counselling." },
      vitals: [{ label: "BP", value: "130/78", unit: "mmHg" }, { label: "HR", value: "68", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "ethics-legal-professional",
      question: {
        stem: "Mr. Moreau, 84, has MCI (MMSE 23/30), two prior falls, and a valid driver's licence. His son raises concerns about driving safety. Mr. Moreau does not want to discuss it. What is the most appropriate NP response?",
        family: "professional-ethics-legal-scope",
        options: [
          { id: "A", label: "Respect Mr. Moreau's autonomy — he has capacity and has the right to decide whether to continue driving." },
          { id: "B", label: "Conduct a structured driving risk assessment (e.g., Trail Making Test, SIMARD-MD), document findings, and counsel Mr. Moreau using a patient-centred approach. If safety concern is confirmed, follow provincial mandatory reporting obligations." },
          { id: "C", label: "Call the licensing authority immediately to report a cognitive impairment — mandatory reporting overrides patient confidentiality." },
          { id: "D", label: "Ask the son to report the driving concern to the licensing authority on his father's behalf." },
        ],
        correctOptionId: "B",
        rationale:
          "Driving fitness in a patient with cognitive impairment requires a systematic, documented assessment — not a binary autonomy-vs-report decision. The appropriate steps are: (1) Conduct a structured assessment of driving-related cognitive functions (Trail Making Test, SIMARD-MD, or referral to a driver rehabilitation specialist). (2) Document all findings. (3) Counsel the patient compassionately, exploring alternatives and the impact of driving cessation on quality of life. (4) If the clinical assessment identifies a significant safety risk, Canadian provinces have mandatory reporting obligations for NPs who assess patients with medical conditions that may impair driving fitness — reporting is required when assessment confirms unacceptable risk, not simply because a family member has raised a concern. Acting on the family's complaint without assessment, or asking the family to report, bypasses the NP's professional and legal obligations.",
        whyWrongByOptionId: {
          A: "Capacity and autonomy do not override public safety obligations. If an assessment reveals that driving poses a significant safety risk to the patient and others, the NP has a legal and professional obligation to act under provincial reporting frameworks.",
          C: "Reporting without conducting an assessment bypasses due process and the NP's professional obligation to assess before report. The driving concern requires clinical substantiation, not reflexive reporting.",
          D: "Delegating the reporting obligation to a family member is not appropriate. The NP has direct professional obligations — these cannot be discharged by asking a family member to report to the licensing authority.",
        },
        clinicalJudgmentFocus: "Driving fitness assessment and mandatory reporting in cognitive impairment — professional-legal obligation framework.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "No assessment performed. Six months later, Mr. Moreau has a minor collision in a parking lot. His driving licence is reviewed by the province after the police report. A retroactive assessment finds significant impairment — the NP's failure to assess is reviewed during a quality audit." },
          B: { trajectory: "optimal", outcome: "Trail Making Test and SIMARD-MD performed. Results indicate meaningful impairment in processing speed and attention relevant to driving. Mr. Moreau is counselled with compassion about alternative transportation. He voluntarily surrenders his licence. Advance care planning discussion begins with the family at a subsequent visit." },
          C: { trajectory: "suboptimal", outcome: "Report made without assessment. Licensing authority conducts their own investigation and finds that an NP clinical assessment should have been completed first. The report is returned for clinical documentation." },
          D: { trajectory: "suboptimal", outcome: "The son submits a complaint to the licensing authority. The authority contacts the NP for a clinical assessment. The NP's delay in assessment is noted in correspondence." },
        },
      },
    },
  ],
};

// ── Case 8: CHF / COPD Overlap ────────────────────────────────────────────────

export const CASE_CHF_COPD_OVERLAP: PatientCase = {
  id: "cnple-sample-chf-001",
  title: "Mrs. Simone Beauchamp — CHF and COPD Overlap",
  tagline: "Acute Care · Chronic Disease",
  patient: { age: 71, sex: "Female", pronouns: "she/her", setting: "Primary Care — Urgent Visit" },
  chiefComplaint: "Worsening dyspnoea for 3 days. Known CHF and COPD.",
  pmhx: [
    "Heart failure with reduced ejection fraction (HFrEF, EF 35% — last echo 8 months ago)",
    "COPD GOLD Grade 3 (post-bronchodilator FEV₁ 42% predicted)",
    "Hypertension",
    "Former smoker (50 pack-years, quit 4 years ago)",
    "Atrial fibrillation (rate controlled)",
    "CKD stage G3a (eGFR 55 mL/min/1.73m²)",
  ],
  medications: [
    { name: "Furosemide", dose: "40 mg", route: "PO", frequency: "daily", indication: "CHF fluid management" },
    { name: "Carvedilol", dose: "12.5 mg", route: "PO", frequency: "twice daily", indication: "HFrEF / AF rate control" },
    { name: "Sacubitril-valsartan", dose: "49/51 mg", route: "PO", frequency: "twice daily", indication: "HFrEF" },
    { name: "Tiotropium", dose: "18 mcg", route: "Inhaled", frequency: "daily", indication: "COPD maintenance" },
    { name: "Formoterol-budesonide", dose: "12/400 mcg", route: "Inhaled", frequency: "twice daily", indication: "COPD maintenance" },
    { name: "Apixaban", dose: "5 mg", route: "PO", frequency: "twice daily", indication: "AF stroke prevention" },
    { name: "Rosuvastatin", dose: "10 mg", route: "PO", frequency: "nightly", indication: "Dyslipidaemia" },
  ],
  allergies: [{ substance: "ACE inhibitors", reaction: "Dry cough", severity: "moderate" }],
  primaryDomain: "acute-urgent-care",
  secondaryDomains: ["chronic-disease-management", "diagnostics-labs"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-12",
    guidelineSources: [
      "CCS Heart Failure Guidelines (2021)",
      "GOLD COPD Management Strategy (2024)",
      "CCS AF Guidelines (2020)",
    ],
  },
  steps: [
    {
      index: 0,
      heading: "Acute dyspnoea presentation",
      scenarioText:
        "Mrs. Beauchamp, 71, presents urgently with 3-day history of worsening dyspnoea, increased sputum production (green/yellow), and bilateral ankle oedema worsening over the same period. She has not had a respiratory illness. She reports compliance with her medications but notes she ate at a restaurant twice last week and had more salt than usual. RR 26 br/min, SpO2 89% on room air (baseline SpO2 94%). HR 94 bpm, BP 158/96. JVP elevated at 5 cm above the sternal angle. Bilateral expiratory wheeze and coarse basal crackles on auscultation.",
      clinicalUpdate: {
        direction: "critical",
        summary: "Acute decompensation with mixed picture — features of both COPD exacerbation and acute decompensated heart failure.",
        newFindings: ["SpO2 89% (below baseline 94%)", "Bilateral wheeze and basal crackles", "JVP elevated", "Worsening bilateral oedema", "Green-yellow sputum", "Dietary sodium excess"],
      },
      vitals: [
        { label: "BP", value: "158/96", unit: "mmHg", flag: "high" },
        { label: "HR", value: "94", unit: "bpm", flag: "high" },
        { label: "RR", value: "26", unit: "br/min", flag: "high" },
        { label: "SpO2", value: "89%", unit: "", flag: "critical" },
        { label: "Temp", value: "37.6", unit: "°C" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mrs. Beauchamp has SpO2 89%, RR 26, JVP elevated, bilateral wheeze and crackles, worsening oedema, and purulent sputum — features consistent with both COPD exacerbation and acute decompensated CHF. What is the most appropriate immediate action in the primary care setting?",
        family: "acute-deterioration-urgent-referral",
        options: [
          { id: "A", label: "Administer salbutamol nebuliser, increase furosemide dose, and reassess in 60 minutes." },
          { id: "B", label: "Initiate supplemental oxygen to SpO2 88–92%, call 911 for emergency transfer to hospital." },
          { id: "C", label: "Start oral prednisone and doxycycline for COPD exacerbation and arrange urgent chest X-ray tomorrow." },
          { id: "D", label: "Administer IV furosemide 80 mg in the clinic and arrange outpatient echocardiogram." },
        ],
        correctOptionId: "B",
        rationale:
          "Mrs. Beauchamp has acute decompensation — SpO2 89% (significantly below her baseline of 94%), RR 26, elevated JVP, and mixed features of COPD exacerbation and acute decompensated heart failure. This exceeds the scope of primary care management. Immediate actions in the primary care setting: (1) Supplemental oxygen titrated to SpO2 88–92% in COPD (avoiding hyperoxia-driven hypercapnic respiratory failure), and (2) Emergency transfer by ambulance. Hospital management will include IV diuresis, bronchodilators, possible NIV if respiratory failure worsens, investigation of precipitant (sputum culture, chest X-ray, BNP, ECG). Managing complex mixed decompensation in primary care risks delayed intervention if the patient deteriorates.",
        whyWrongByOptionId: {
          A: "Managing a patient with SpO2 89%, elevated JVP, and RR 26 with clinic-based nebulisers and oral furosemide is insufficient for the severity of presentation. Decompensation of this degree requires emergency department resources.",
          C: "Oral corticosteroids and antibiotics address only the COPD exacerbation component — the acute heart failure component (JVP elevation, crackles, oedema) requires IV diuresis and monitoring not available in primary care.",
          D: "IV furosemide in a primary care setting without cardiac monitoring, resuscitation capability, or ability to manage electrolyte shifts is not appropriate. An outpatient echocardiogram is non-urgent and does not address the acute presentation.",
        },
        clinicalJudgmentFocus: "Recognising mixed CHF/COPD decompensation as exceeding primary care capacity — emergency transfer with targeted oxygen.",
        consequencesByOptionId: {
          A: { trajectory: "harmful", outcome: "Salbutamol given, furosemide dose doubled. At 60-minute reassessment, SpO2 87%, RR 30. Patient transferred by ambulance — delayed by 2 hours. Admitted to ICU for non-invasive ventilation." },
          B: { trajectory: "optimal", outcome: "Supplemental O2 applied (SpO2 rises to 91%). Ambulance arrives, patient transferred. In ED: CXR shows bilateral interstitial oedema and hyperinflation. BNP markedly elevated. IV furosemide, LABA/SAMA nebulisers, short-course prednisone initiated. Discharged day 5 in stable condition." },
          C: { trajectory: "harmful", outcome: "Oral prednisone and doxycycline prescribed. Patient deteriorates overnight at home. Spouse calls 911 the next morning — SpO2 82%, altered consciousness. Delayed hospital presentation." },
          D: { trajectory: "harmful", outcome: "IV furosemide given in clinic without monitoring. Potassium falls to 3.0 mmol/L two hours later. Patient develops cardiac ectopy. Emergency transfer required urgently." },
        },
      },
    },
    {
      index: 1,
      heading: "Hospital discharge — 5 days later",
      updateNarrative: "Discharge follow-up at hospital day 5.",
      scenarioText:
        "Mrs. Beauchamp is discharged from hospital on day 5. Hospital summary: acute CHF decompensation triggered by dietary sodium excess + mild COPD exacerbation. IV furosemide given for 3 days. Short-course prednisone and doxycycline completed. SpO2 94–95% on room air at discharge. Weight on admission 74.2 kg; discharge weight 71.8 kg. New medications added: spironolactone 25 mg daily (for HFrEF in addition to sacubitril-valsartan). You are seeing her for discharge follow-up in your clinic 1 week post-discharge.",
      clinicalUpdate: { direction: "improving", summary: "Post-decompensation CHF. New spironolactone added. Renal monitoring required." },
      vitals: [
        { label: "BP", value: "118/74", unit: "mmHg" },
        { label: "HR", value: "72", unit: "bpm" },
        { label: "RR", value: "18", unit: "br/min" },
        { label: "SpO2", value: "94%", unit: "" },
        { label: "Weight", value: "71.8", unit: "kg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Discharge labs (day 5)",
          finding: "K+ 4.8; eGFR 50; Cr 124 µmol/L; Na 138; BNP 380 pg/mL (improved from 1840 on admission)",
          values: [
            { test: "K+", value: "4.8 mmol/L", referenceRange: "3.5–5.0" },
            { test: "eGFR", value: "50", unit: "mL/min/1.73m²", referenceRange: "CKD G3b", flag: "L" },
            { test: "Creatinine", value: "124 µmol/L", referenceRange: "45–84 µmol/L (F)", flag: "H" },
            { test: "Na", value: "138 mmol/L", referenceRange: "135–145 mmol/L" },
            { test: "BNP", value: "380 pg/mL", referenceRange: "Normal <100; improved from 1840 pg/mL on admission", flag: "H" },
          ],
          timestamp: "Day 5 discharge",
        },
      ],
      medicationChanges: [
        { name: "Spironolactone", dose: "25 mg", route: "PO", frequency: "daily", indication: "HFrEF — RAAS modulation", flag: "new" },
      ],
      followUpInterval: { value: 7, unit: "days", label: "1 week post-discharge" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "Mrs. Beauchamp is 1 week post-discharge on furosemide, sacubitril-valsartan, carvedilol, and newly added spironolactone 25 mg daily. K+ 4.8 mEq/L; eGFR 50. What is the priority monitoring action?",
        family: "lab-diagnostic-interpretation",
        options: [
          { id: "A", label: "Stop spironolactone — K+ 4.8 is too high for a patient on both spironolactone and sacubitril-valsartan/ACEi." },
          { id: "B", label: "Repeat electrolytes and renal function in 1–2 weeks — hyperkalaemia risk with spironolactone in CKD and concurrent RAAS agents." },
          { id: "C", label: "Continue current medications — K+ 4.8 is within normal range, no monitoring needed for 3 months." },
          { id: "D", label: "Increase furosemide to 80 mg daily to prevent K+ accumulation from spironolactone." },
        ],
        correctOptionId: "B",
        rationale:
          "Spironolactone in combination with sacubitril-valsartan (which blocks the renin-angiotensin system) and in the context of CKD G3b creates significant hyperkalaemia risk. While K+ 4.8 is within normal range at 1 week, the trajectory is the concern — values can continue to rise in the first 2–4 weeks as spironolactone accumulates. Close monitoring (repeat electrolytes and creatinine at 1–2 weeks post-initiation) is the evidence-based approach per HFrEF management guidelines. Stopping spironolactone at K+ 4.8 is premature — it has mortality benefit in HFrEF (RALES trial) and should be maintained if electrolytes can be safely managed. Empirically increasing furosemide causes over-diuresis without addressing the underlying risk mechanism.",
        whyWrongByOptionId: {
          A: "K+ 4.8 is within normal range. Stopping spironolactone at this value is premature and unnecessarily removes a mortality-reducing therapy. Monitoring and action at K+ ≥5.0 or ≥5.5 is the guideline threshold.",
          C: "3-monthly monitoring for a newly initiated potassium-sparing diuretic in CKD G3b with concurrent RAAS therapy is inappropriate. Hyperkalaemia can develop within 1–4 weeks of initiation — weekly to biweekly monitoring is required initially.",
          D: "Increasing furosemide treats the anticipated K+ elevation indirectly (by increasing urinary K+ excretion) but risks over-diuresis, acute kidney injury, and haemoconcentration — not appropriate without confirmed hyperkalemia.",
        },
        clinicalJudgmentFocus: "Spironolactone monitoring in HFrEF with CKD — hyperkalaemia risk management with concurrent RAAS therapy.",
        consequencesByOptionId: {
          A: { trajectory: "suboptimal", outcome: "Spironolactone stopped prematurely. Mrs. Beauchamp's K+ was within range and the medication would have been tolerated. She misses mortality benefit. Reinitiated by cardiologist 3 months later." },
          B: { trajectory: "optimal", outcome: "Labs repeated at 10 days: K+ 5.0, eGFR 48. Spironolactone continued with salt restriction counselling reinforced. At 4 weeks: K+ 4.9, eGFR stable. No intervention needed." },
          C: { trajectory: "harmful", outcome: "No follow-up labs ordered. At 6 weeks, Mrs. Beauchamp attends ED with fatigue and muscle weakness. K+ 5.9. Spironolactone held, IV calcium gluconate and glucose-insulin given. Avoidable with closer monitoring." },
          D: { trajectory: "harmful", outcome: "Furosemide increased to 80 mg. One week later: K+ 3.7 (corrected) but Cr rises to 156 µmol/L and eGFR falls to 38. Aggressive diuresis caused an acute kidney injury." },
        },
      },
    },
    {
      index: 2,
      heading: "6-week post-discharge COPD/CHF review",
      updateNarrative: "6 weeks post-discharge — integrated cardiorespiratory review.",
      scenarioText:
        "Mrs. Beauchamp is 6 weeks post-discharge. She is stable — no dyspnoea at rest, SpO2 94% at rest. She performs slow walks on flat ground. She asks about pulmonary rehabilitation. Her COPD maintenance inhaler (tiotropium + formoterol-budesonide) is being used correctly. She asks whether she can start a beta-blocker for her 'heart' — she heard it was good for people with heart failure.",
      clinicalUpdate: { direction: "stable", summary: "Stable CHF-COPD overlap. Carvedilol already in use. Patient education on cardioselective beta-blocker use in COPD." },
      vitals: [
        { label: "BP", value: "122/78", unit: "mmHg" },
        { label: "HR", value: "68", unit: "bpm" },
        { label: "RR", value: "18", unit: "br/min" },
        { label: "SpO2", value: "94%", unit: "" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "chronic-disease-management",
      question: {
        stem: "Mrs. Beauchamp asks about starting a beta-blocker for her heart failure. She is already on carvedilol 12.5 mg BID. She has COPD (FEV₁ 42%). She asks whether she should be on a cardioselective beta-blocker instead, as she has heard they are safer for lung disease. What is the most appropriate counselling?",
        family: "single-best-answer-clinical-judgment",
        options: [
          { id: "A", label: "Advise her she is already on carvedilol (a non-selective beta-blocker); carvedilol is guideline-recommended for HFrEF and is appropriate with close COPD monitoring." },
          { id: "B", label: "Switch to bisoprolol — cardioselective beta-blockers are always preferred over carvedilol in COPD." },
          { id: "C", label: "Stop carvedilol — beta-blockers are contraindicated in COPD with FEV₁ below 50%." },
          { id: "D", label: "Add bisoprolol to carvedilol for additional cardiac protection." },
        ],
        correctOptionId: "A",
        rationale:
          "Carvedilol is a guideline-recommended beta-blocker for HFrEF (along with metoprolol succinate and bisoprolol) and is already prescribed. COPD is not a contraindication to beta-blockers — multiple trials and meta-analyses confirm that cardioselective beta-blockers (bisoprolol, metoprolol succinate) and carvedilol are safe in stable COPD and reduce mortality in HFrEF even in the presence of obstructive lung disease. Carvedilol's non-selectivity is a theoretical bronchospasm concern, but in practice it is well-tolerated in stable COPD and remains guideline-supported. The question of cardioselective vs. non-selective is a reasonable one to discuss, but the key message is that carvedilol is already appropriate and should be continued. Stopping carvedilol would remove mortality benefit without pharmacological justification.",
        whyWrongByOptionId: {
          B: "Switching from carvedilol to bisoprolol is not necessary if carvedilol is tolerated — both are acceptable for HFrEF. The claim that cardioselective beta-blockers are 'always preferred' in COPD is an oversimplification; current evidence supports both in stable COPD.",
          C: "Beta-blockers are not contraindicated in COPD. Withholding mortality-reducing therapy based on FEV₁ threshold is not supported by evidence or guidelines. COPD is a relative consideration for monitoring, not a contraindication.",
          D: "Combining two beta-blockers increases risk of bradycardia, hypotension, and conduction abnormalities without any added clinical benefit. Beta-blockers are not additive — only one agent is used.",
        },
        clinicalJudgmentFocus: "Beta-blocker use in CHF-COPD overlap — carvedilol safety, correcting the misconception that COPD contraindicates beta-blockade.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Mrs. Beauchamp is reassured. Carvedilol continued. At 3 months: LVEF on repeat echo improved to 42% (from 35%). COPD well controlled. Pulmonary rehabilitation enrolled." },
          B: { trajectory: "acceptable", outcome: "Switch to bisoprolol made. Equivalent clinical outcome. Carvedilol was already appropriate — the switch was unnecessary but not harmful." },
          C: { trajectory: "harmful", outcome: "Carvedilol stopped. At 8-week follow-up, Mrs. Beauchamp has recurrent AF with rapid ventricular response and worsening dyspnoea. Rate was partially controlled by carvedilol. Readmission for CHF decompensation." },
          D: { trajectory: "harmful", outcome: "Bisoprolol added to carvedilol. HR falls to 44 bpm the following week. BP 92/60. Dizziness and near-syncope reported. Both beta-blockers had to be held urgently." },
        },
      },
    },
  ],
};

// ── Case 9: Hypothyroidism — levothyroxine titration ─────────────────────────

export const CASE_HYPOTHYROIDISM: PatientCase = {
  id: "cnple-sample-thyroid-001",
  title: "Mr. Osei — Hypothyroidism and Fatigue",
  tagline: "Endocrine · Prescribing Safety",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: ["Thyroid Foundation of Canada Clinical Practice Guidelines", "Canadian Thyroid Association 2021 Update"],
  },
  patient: { age: 46, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Fatigue, weight gain, and cold intolerance over 6 months.",
  pmhx: ["Type 2 DM managed with metformin", "No prior thyroid history", "Family history of autoimmune thyroid disease (sister)"],
  medications: [
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "Type 2 DM" },
  ],
  allergies: [],
  primaryDomain: "endocrine-metabolic",
  secondaryDomains: ["pharmacotherapeutics", "diagnostics-labs"],
  difficulty: 2,
  stepCount: 3,
  estimatedMinutes: 14,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Initial presentation — fatigue and weight gain",
      scenarioText:
        "Mr. Osei, a 46-year-old man, presents with 6 months of progressive fatigue, 7 kg weight gain, cold intolerance, constipation, and dry skin. He works as an office manager and reports he 'just feels slow.' He has no dyspnoea, chest pain, or leg swelling. BP 126/80, HR 58 bpm, RR 14, T 36.3°C. On exam: dry coarse skin, periorbital puffiness, delayed ankle reflexes bilaterally, and a small firm diffuse thyroid enlargement without nodules.",
      clinicalUpdate: { direction: "worsening", summary: "Progressive symptoms consistent with hypothyroidism; exam supports diagnosis.", newFindings: ["HR 58 bpm (bradycardia)", "Periorbital puffiness", "Delayed DTRs", "Diffuse firm goitre"] },
      vitals: [
        { label: "BP", value: "126/80", unit: "mmHg" },
        { label: "HR", value: "58", unit: "bpm", flag: "low" },
        { label: "T", value: "36.3", unit: "°C" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "endocrine-metabolic",
      question: {
        stem: "Mr. Osei has classic hypothyroid symptoms, bradycardia, delayed DTRs, and a firm goitre. What is the most appropriate initial diagnostic step?",
        family: "endocrine-diagnostics",
        options: [
          { id: "A", label: "TSH alone — a normal TSH effectively excludes primary hypothyroidism." },
          { id: "B", label: "TSH and free T4 — TSH confirms function; free T4 assesses severity and guides dosing." },
          { id: "C", label: "TSH, free T4, and free T3 — T3 needed to distinguish conversion issues." },
          { id: "D", label: "Thyroid ultrasound first — goitre must be imaged before lab work." },
        ],
        correctOptionId: "B",
        rationale:
          "TSH is the most sensitive first-line test for primary hypothyroidism; an elevated TSH with low free T4 confirms overt hypothyroidism and guides levothyroxine dosing. Free T3 is not routinely needed in primary hypothyroidism and adds cost without clinical benefit. Ultrasound is useful for nodule evaluation but is not the initial step when clinical diagnosis is suspected — labs first. A TSH alone is adequate for screening but free T4 is needed alongside an elevated TSH to assess severity and confirm treatment threshold in overt disease.",
      },
    },
    {
      index: 1,
      heading: "Lab results — starting levothyroxine",
      scenarioText:
        "Results: TSH 18.4 mIU/L (ref 0.4–4.0), free T4 8.2 pmol/L (ref 12–22), TPO antibody 485 IU/mL (positive). CBC, CMP, and lipids: mild dyslipidaemia (LDL 3.8 mmol/L), otherwise normal. Diagnosis: Hashimoto's hypothyroidism (overt). You plan to start levothyroxine.",
      clinicalUpdate: { direction: "worsening", summary: "Overt primary hypothyroidism confirmed — Hashimoto's. Dyslipidaemia likely secondary.", newFindings: ["TSH 18.4", "Free T4 8.2 (low)", "TPO-Ab positive", "LDL 3.8 mmol/L"] },
      vitals: [],
      diagnosticArtifacts: [
        { label: "TSH", value: "18.4 mIU/L", interpretation: "Elevated — primary hypothyroidism", isAbnormal: true },
        { label: "Free T4", value: "8.2 pmol/L", interpretation: "Below reference range", isAbnormal: true },
        { label: "TPO-Ab", value: "485 IU/mL", interpretation: "Strongly positive — Hashimoto's", isAbnormal: true },
      ],
      medicationChanges: [],
      followUpInterval: "6–8 weeks",
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Osei is 46 with no cardiac history and overt hypothyroidism (TSH 18.4, free T4 8.2). What is the most appropriate levothyroxine starting dose?",
        family: "prescribing-endocrine",
        options: [
          { id: "A", label: "Full replacement: 1.6 mcg/kg/day (~112 mcg) — start at target dose for a healthy adult." },
          { id: "B", label: "Low start: 25–50 mcg/day — safer to titrate up over weeks." },
          { id: "C", label: "25 mcg/day and increase by 25 mcg every 4 weeks — standard cardiac-cautious titration." },
          { id: "D", label: "Defer until TSH exceeds 20 mIU/L — subclinical at this level." },
        ],
        correctOptionId: "A",
        rationale:
          "In otherwise healthy adults under 60 without cardiac disease, full replacement levothyroxine (1.6 mcg/kg/day) can be started directly. Mr. Osei is 46 with no cardiac comorbidities — cautious titration is reserved for the elderly (>60) or those with known ischaemic heart disease where rapid correction could trigger angina or arrhythmia. His TSH of 18.4 with low free T4 constitutes overt hypothyroidism requiring treatment. TSH below 10 with normal free T4 is subclinical hypothyroidism and has a separate treatment threshold discussion. Recheck TSH in 6–8 weeks after starting; titrate to maintain TSH 0.5–2.5 mIU/L. Secondary dyslipidaemia from hypothyroidism often resolves with treatment — reassess lipids after euthyroidism achieved.",
      },
    },
    {
      index: 2,
      heading: "Follow-up at 8 weeks — titration",
      scenarioText:
        "Mr. Osei returns at 8 weeks on levothyroxine 112 mcg/day. He reports improved energy, less constipation, and 2 kg weight loss. TSH now 3.2 mIU/L (within range). He asks whether he can stop the medication once his thyroid 'heals.'",
      clinicalUpdate: { direction: "improving", summary: "Good clinical and biochemical response to levothyroxine at 8 weeks.", newFindings: ["TSH 3.2 (normalized)", "Symptom improvement", "Weight trending down"] },
      vitals: [{ label: "HR", value: "68", unit: "bpm" }],
      diagnosticArtifacts: [{ label: "TSH", value: "3.2 mIU/L", interpretation: "Within reference range", isAbnormal: false }],
      medicationChanges: [{ name: "Levothyroxine", change: "continue", note: "Maintain 112 mcg/day; recheck TSH in 6 months" }],
      followUpInterval: "6 months",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mr. Osei's TSH has normalized. He asks if he can stop levothyroxine once he feels better. What is the most accurate NP response?",
        family: "patient-education",
        options: [
          { id: "A", label: "Hashimoto's hypothyroidism is typically a permanent condition — lifelong therapy is usually required." },
          { id: "B", label: "A 3-month drug holiday will confirm whether the thyroid has recovered function." },
          { id: "C", label: "The medication can be reduced to 50% once TSH normalizes." },
          { id: "D", label: "Therapy duration depends on anti-TPO antibody levels — recheck in 1 year." },
        ],
        correctOptionId: "A",
        rationale:
          "Hashimoto's thyroiditis causes progressive autoimmune destruction of thyroid tissue. While rare spontaneous remissions occur, the overwhelming majority of patients with overt hypothyroidism from Hashimoto's require lifelong levothyroxine replacement. Drug holidays should not be advised — stopping therapy leads to symptomatic relapse and potential complications (cardiac, cognitive, lipid). Anti-TPO titers do not guide treatment duration. The NP's role here is patient education: normalize the need for lifelong medication, address adherence strategies (morning fasting, consistent timing), and explain that annual TSH monitoring is sufficient once stable.",
      },
    },
  ],
};

// ── Case 10: COPD Exacerbation — acute management ────────────────────────────

export const CASE_COPD_EXACERBATION: PatientCase = {
  id: "cnple-sample-copd-001",
  title: "Mr. Thibodeau — COPD Exacerbation",
  tagline: "Respiratory · Acute Urgent Care",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: ["Canadian Thoracic Society COPD Guidelines (2023)", "GOLD COPD Report 2024"],
  },
  patient: { age: 67, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic — walk-in" },
  chiefComplaint: "Increased breathlessness and productive green sputum for 3 days.",
  pmhx: ["COPD (GOLD Stage 2B, FEV1 55% predicted)", "Former smoker — quit 8 years ago", "Type 2 DM", "No home oxygen"],
  medications: [
    { name: "Tiotropium", dose: "18 mcg", route: "INH", frequency: "once daily", indication: "COPD" },
    { name: "Salbutamol (SABA)", dose: "100 mcg", route: "INH", frequency: "PRN", indication: "COPD rescue" },
    { name: "Metformin", dose: "500 mg", route: "PO", frequency: "twice daily", indication: "Type 2 DM" },
  ],
  allergies: [{ substance: "Azithromycin", reaction: "QTc prolongation on prior ECG", severity: "moderate" }],
  primaryDomain: "acute-urgent-care",
  secondaryDomains: ["pharmacotherapeutics", "diagnostics-labs"],
  difficulty: 3,
  stepCount: 4,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Walk-in — acute dyspnoea",
      scenarioText:
        "Mr. Thibodeau, 67, walks into your primary care clinic with 3 days of worsening dyspnoea, increased sputum production (purulent green), and reduced exercise tolerance. He has been using his salbutamol inhaler every 2 hours without adequate relief. He has not had a fever. He is alert and oriented. On exam: RR 26 br/min, SpO2 88% on room air, HR 104 bpm, BP 138/84, T 37.2°C. Diffuse expiratory wheeze, prolonged expiratory phase. Accessory muscle use noted.",
      clinicalUpdate: { direction: "worsening", summary: "Moderate-severe COPD exacerbation: SpO2 88%, RR 26, accessory muscle use, inadequate SABA response.", newFindings: ["SpO2 88%", "RR 26", "HR 104", "Accessory muscle use", "Purulent sputum"] },
      vitals: [
        { label: "SpO2", value: "88%", unit: "", flag: "critical" },
        { label: "RR", value: "26", unit: "br/min", flag: "high" },
        { label: "HR", value: "104", unit: "bpm", flag: "high" },
        { label: "BP", value: "138/84", unit: "mmHg" },
        { label: "T", value: "37.2", unit: "°C" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mr. Thibodeau has a COPD exacerbation with SpO2 88%, RR 26, accessory muscle use, and inadequate SABA response. What is the immediate priority?",
        family: "acute-respiratory",
        options: [
          { id: "A", label: "Controlled oxygen via Venturi mask to target SpO2 88–92%, then assess for bronchodilators." },
          { id: "B", label: "High-flow oxygen at 10 L/min via non-rebreather mask to rapidly correct hypoxaemia." },
          { id: "C", label: "Start oral prednisone before oxygen — steroids are the priority in COPD exacerbation." },
          { id: "D", label: "Transfer to ED immediately without any intervention — he is too unstable for clinic management." },
        ],
        correctOptionId: "A",
        rationale:
          "In COPD exacerbation, controlled oxygen is given to target SpO2 88–92% — NOT 94–98%. COPD patients with chronic CO2 retention may lose their hypoxic drive if over-oxygenated, leading to CO2 narcosis and respiratory failure. Use a Venturi mask (24–28% FiO2) to titrate precisely. High-flow O2 via non-rebreather is contraindicated in COPD unless the patient is near arrest. Bronchodilators (salbutamol + ipratropium nebulised) are the next immediate step after oxygen. Systemic steroids follow. Transfer to ED is indicated for severe exacerbations (altered mental status, rising CO2, CPAP/intubation need) — but controlled O2 and assessment happen first.",
      },
    },
    {
      index: 1,
      heading: "Initial stabilization — antibiotic decision",
      scenarioText:
        "Controlled O2 via Venturi 28% applied; SpO2 improved to 92%. Ipratropium + salbutamol nebulisation given × 1. RR down to 22 br/min. He is less distressed. You need to decide on antibiotic therapy. His sputum is purulent green, he has no focal consolidation on chest X-ray (hyperinflation, no infiltrate). He is allergic to azithromycin (QTc prolongation).",
      clinicalUpdate: { direction: "improving", summary: "Partial response to O2 and bronchodilators. No pneumonia on CXR. Antibiotic decision required.", newFindings: ["SpO2 92% on 28% FiO2", "No CXR infiltrate", "Purulent sputum", "Azithromycin allergy — QTc"] },
      vitals: [{ label: "SpO2", value: "92%", unit: "" }, { label: "RR", value: "22", unit: "br/min" }],
      diagnosticArtifacts: [{ label: "CXR", value: "Hyperinflation, no infiltrate", interpretation: "No pneumonia", isAbnormal: false }],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Thibodeau has a moderate COPD exacerbation with purulent sputum, no consolidation on CXR, and azithromycin allergy. What is the most appropriate antibiotic choice?",
        family: "prescribing-respiratory",
        options: [
          { id: "A", label: "Amoxicillin 500 mg three times daily for 5 days — narrow spectrum first-line." },
          { id: "B", label: "Doxycycline 200 mg loading then 100 mg daily for 5 days — covers Haemophilus, Streptococcus, Moraxella." },
          { id: "C", label: "Amoxicillin-clavulanate 875/125 mg twice daily for 7 days — broader spectrum, good lung penetration." },
          { id: "D", label: "No antibiotics — sputum colour alone is insufficient to indicate bacterial infection." },
        ],
        correctOptionId: "C",
        rationale:
          "Purulent sputum plus increased dyspnoea meets Anthonisen criteria for antibiotic treatment in moderate-severe COPD exacerbation. Amoxicillin-clavulanate is appropriate for moderate-severe COPD exacerbations with risk factors — Mr. Thibodeau has GOLD 2B disease, DM (immunocompromised), and inadequate response to bronchodilators. Amoxicillin alone may miss beta-lactamase-producing Haemophilus influenzae strains. Doxycycline is a reasonable alternative but amoxicillin-clavulanate provides superior beta-lactamase coverage. Azithromycin is contraindicated (allergy with QTc risk). 5–7 days is the guideline-recommended duration. CTS guidelines support antibiotics when ≥2 of 3 Anthonisen criteria are met.",
      },
    },
    {
      index: 2,
      heading: "Steroid decision and disposition",
      scenarioText:
        "Mr. Thibodeau has responded well to initial treatment. SpO2 93%, RR 18, HR 88. He is more comfortable. You need to decide on systemic corticosteroids and disposition (home vs. ED transfer).",
      clinicalUpdate: { direction: "improving", summary: "Good response to O2 + bronchodilators. Now decide on steroids and safe discharge criteria.", newFindings: ["SpO2 93%", "RR 18", "Clinically improved", "SABA response achieved"] },
      vitals: [{ label: "SpO2", value: "93%", unit: "" }, { label: "RR", value: "18", unit: "br/min" }, { label: "HR", value: "88", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Prednisone", change: "start", note: "40 mg PO daily × 5 days" },
        { name: "Amoxicillin-clavulanate", change: "start", note: "875/125 mg BID × 7 days" },
      ],
      followUpInterval: "48–72 hours",
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Thibodeau has improved but still has COPD with DM. He asks about steroids. What is the NP prescribing decision?",
        family: "prescribing-respiratory-steroid",
        options: [
          { id: "A", label: "Prednisone 40 mg daily for 5 days is standard — monitor blood glucose given his DM." },
          { id: "B", label: "Methylprednisolone IV — oral steroids are not absorbed reliably in COPD exacerbations." },
          { id: "C", label: "Inhaled budesonide only — systemic steroids are contraindicated with DM." },
          { id: "D", label: "Defer steroids until repeat CXR confirms no infiltrate." },
        ],
        correctOptionId: "A",
        rationale:
          "Systemic corticosteroids reduce exacerbation duration, treatment failure rate, and hospitalisation in moderate-severe COPD exacerbations. Prednisone 40 mg PO for 5 days is equivalent to IV methylprednisolone and is the preferred outpatient approach. DM is not a contraindication — it is a caution requiring blood glucose monitoring and patient education about hyperglycaemia. Inhaled corticosteroids alone are insufficient for acute exacerbation management. Steroids should not be withheld pending CXR — treatment decision is clinical. The NP must counsel Mr. Thibodeau to monitor capillary glucose BID and contact the clinic if glucose exceeds 15 mmol/L.",
      },
    },
    {
      index: 3,
      heading: "Discharge plan and follow-up",
      scenarioText:
        "Mr. Thibodeau is discharged on prednisone 40 mg × 5 days and amoxicillin-clavulanate 875/125 mg BID × 7 days. His SpO2 on room air is now 91%. He has a follow-up booked in 48 hours.",
      clinicalUpdate: { direction: "improving", summary: "Safe for discharge with close follow-up. SpO2 91% on RA acceptable at baseline for GOLD 2B.", newFindings: ["SpO2 91% RA (near his baseline)", "Medications prescribed", "Follow-up 48h"] },
      vitals: [{ label: "SpO2", value: "91%", unit: "" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: "48 hours mandatory",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Before Mr. Thibodeau leaves, what is the most important point in your discharge teaching?",
        family: "patient-education-copd",
        options: [
          { id: "A", label: "Return immediately if dyspnoea worsens, SpO2 drops below 88%, or confusion develops." },
          { id: "B", label: "Stop the prednisone after 3 days if symptoms are improved." },
          { id: "C", label: "Restart smoking to reduce anxiety — nicotine withdrawal can worsen breathlessness." },
          { id: "D", label: "SpO2 monitoring at home is not necessary — follow prescribed treatment only." },
        ],
        correctOptionId: "A",
        rationale:
          "Clear return precautions are the most critical discharge safety instruction: worsening dyspnoea, SpO2 <88%, altered mental status, inability to tolerate oral medications, or no improvement at 48 hours are all indications for ED reassessment or hospital admission. Completing the full steroid course is essential — early discontinuation risks rebound inflammation and treatment failure. Home SpO2 monitoring is appropriate for COPD patients who own pulse oximeters. Smoking cessation reinforcement at every visit is a GOLD-standard intervention for COPD management.",
      },
    },
  ],
};

// ── Case 11: Opioid Use Disorder — buprenorphine/naloxone prescribing ─────────

export const CASE_OPIOID_USE_DISORDER: PatientCase = {
  id: "cnple-sample-oud-001",
  title: "Ms. Chartrand — Opioid Use Disorder",
  tagline: "Substance Use · Professional Practice",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: ["Canadian Guidelines for Safe and Effective Use of Opioids for CNCP (NOUGG)", "CAMH Opioid Use Disorder Practice Guidance", "College of Physicians and Surgeons of Ontario (CPSO) OUD Guidelines"],
  },
  patient: { age: 31, sex: "Female", pronouns: "she/her", setting: "Primary Care Clinic" },
  chiefComplaint: "Requesting help to stop opioids — on prescription oxycodone from another provider.",
  pmhx: ["Chronic low back pain (MVA 3 years ago)", "Anxiety disorder", "No prior OUD treatment", "No hepatitis B or C"],
  medications: [
    { name: "Oxycodone IR", dose: "10 mg", route: "PO", frequency: "4× daily", indication: "Chronic pain (prescribed elsewhere)" },
    { name: "Sertraline", dose: "100 mg", route: "PO", frequency: "once daily", indication: "Anxiety" },
  ],
  allergies: [],
  primaryDomain: "mental-health-substance-use",
  secondaryDomains: ["pharmacotherapeutics", "professional-practice"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 16,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "First visit — assessment for OAT",
      scenarioText:
        "Ms. Chartrand, 31, presents requesting help to stop opioids. She reports she has been prescribed oxycodone 10 mg QID for chronic back pain but now takes 4–6 tabs daily, often running out early. She describes intense cravings, missed work, and fear of withdrawal. She is taking opioids first thing in the morning to feel 'normal.' She denies IV drug use. AUDIT-C: 2 (low risk alcohol). She has never tried to quit before and is scared of withdrawal symptoms.",
      clinicalUpdate: { direction: "worsening", summary: "Opioid use disorder: loss of control, tolerance, morning use to avoid withdrawal, cravings, functional impairment.", newFindings: ["Early refills", "Morning use", "Cravings", "Work impairment", "Fear of withdrawal"] },
      vitals: [{ label: "BP", value: "134/86", unit: "mmHg" }, { label: "HR", value: "92", unit: "bpm" }, { label: "RR", value: "16", unit: "br/min" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "mental-health-substance-use",
      question: {
        stem: "Ms. Chartrand meets DSM-5 criteria for opioid use disorder. She is motivated to start treatment. Which is the most appropriate NP action?",
        family: "oud-oat",
        options: [
          { id: "A", label: "Refer to addictions psychiatry and defer prescribing OAT — NPs should not initiate buprenorphine independently." },
          { id: "B", label: "Initiate buprenorphine/naloxone after appropriate assessment and training — Canadian NPs with prescribing authority can prescribe OAT under provincial scope." },
          { id: "C", label: "Offer supervised opioid taper only — abrupt cessation or rapid taper is the safest approach for prescription opioid dependence." },
          { id: "D", label: "Continue current oxycodone prescription and add naloxone kit — harm reduction only at this stage." },
        ],
        correctOptionId: "B",
        rationale:
          "In Canada, NPs with prescribing authority can initiate buprenorphine/naloxone (Suboxone) for opioid use disorder in most provinces without requiring a special exemption (unlike methadone in some provinces). Evidence strongly supports opioid agonist therapy (OAT) with buprenorphine/naloxone as first-line treatment for OUD — it reduces mortality by 50–60%, decreases illicit use, and improves social functioning. Referral to addictions psychiatry is not mandatory; wait times may be prohibitive and immediate NP-initiated OAT is guideline-supported. Opioid taper alone has very high relapse rates (>90%) and is not recommended as first-line for moderate-severe OUD. Harm reduction (naloxone kit) is important but not a substitute for OAT when the patient is motivated and meets criteria.",
      },
    },
    {
      index: 1,
      heading: "Starting buprenorphine/naloxone",
      scenarioText:
        "Ms. Chartrand agrees to start buprenorphine/naloxone. You assess her with the Clinical Opioid Withdrawal Scale (COWS): score 10 (mild-moderate withdrawal). Her last oxycodone dose was 8 hours ago. You plan to initiate buprenorphine/naloxone today.",
      clinicalUpdate: { direction: "stable", summary: "COWS 10 — adequate withdrawal for safe buprenorphine induction. Can proceed with first dose.", newFindings: ["COWS 10 (mild-moderate)", "8h since last opioid", "Vitals stable"] },
      vitals: [],
      diagnosticArtifacts: [{ label: "COWS Score", value: "10", interpretation: "Mild-moderate withdrawal — appropriate for induction", isAbnormal: false }],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Ms. Chartrand has COWS 10 and her last opioid was 8 hours ago. What is the correct buprenorphine/naloxone induction approach?",
        family: "oat-induction",
        options: [
          { id: "A", label: "Buprenorphine/naloxone 2 mg/0.5 mg SL — give first dose now, observe for 1 hour, then 2 mg/0.5 mg if tolerated." },
          { id: "B", label: "Buprenorphine/naloxone 8 mg/2 mg SL as a single loading dose — faster to therapeutic level." },
          { id: "C", label: "Wait until COWS ≥ 13 (moderate withdrawal) before giving first dose to avoid precipitated withdrawal." },
          { id: "D", label: "Give 16 mg/4 mg on day 1 — Canadian guidelines recommend reaching therapeutic dose in 24 hours." },
        ],
        correctOptionId: "A",
        rationale:
          "Buprenorphine induction requires a minimum COWS of 8–12 (some guidelines say ≥8, others ≥12) to reduce precipitated withdrawal risk. COWS 10 is adequate. The low-dose induction approach (2 mg SL, observe 1h, repeat 2 mg if tolerated, titrate to 8–16 mg total on Day 1) is standard and well-tolerated. The first dose should be given in-office with 1-hour observation. Day 1 total dose is typically 8–16 mg; Day 2 is typically 16 mg; titrate to suppress cravings and withdrawal (often 16–24 mg/day maintenance). High loading doses (16 mg in one shot) without observation increase precipitated withdrawal risk for less-experienced prescribers. Waiting for COWS ≥13 prolongs suffering unnecessarily; ≥8–10 is standard.",
      },
    },
    {
      index: 2,
      heading: "Day 7 — follow-up on OAT",
      scenarioText:
        "Ms. Chartrand returns 7 days later. She is on buprenorphine/naloxone 16 mg/4 mg daily. She reports no cravings, no withdrawal symptoms, better sleep, and she went back to work. Her urine drug screen (UDS) shows buprenorphine present, no other opioids, no benzodiazepines. She asks about how long she will need to take it.",
      clinicalUpdate: { direction: "improving", summary: "Excellent OAT response at Day 7: stable, working, no illicit opioids, good sleep.", newFindings: ["No cravings", "Returned to work", "UDS: buprenorphine only", "No illicit opioids"] },
      vitals: [],
      diagnosticArtifacts: [{ label: "UDS", value: "Buprenorphine positive only", interpretation: "Adherent to OAT, no illicit opioids", isAbnormal: false }],
      medicationChanges: [{ name: "Buprenorphine/naloxone", change: "continue", note: "16 mg/4 mg daily — stable dose" }],
      followUpInterval: "2–4 weeks",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Ms. Chartrand asks how long she needs to stay on buprenorphine/naloxone. What is the most evidence-based NP response?",
        family: "oat-duration",
        options: [
          { id: "A", label: "At least 6 months — most patients can safely taper after 6 months of stability." },
          { id: "B", label: "At least 1–2 years — relapse rates are significantly lower with longer duration; many continue indefinitely." },
          { id: "C", label: "Until cravings are gone — stopping once cravings resolve is safe for most patients." },
          { id: "D", label: "Indefinitely only if heroin history — prescription opioid OUD typically requires shorter treatment." },
        ],
        correctOptionId: "B",
        rationale:
          "Evidence clearly demonstrates that longer duration of OAT is associated with lower relapse rates and overdose mortality. Guidelines recommend a minimum of 1–2 years of stable OAT before considering tapering, and many patients benefit from indefinite maintenance. Tapering within 6 months has a relapse rate exceeding 80%. OAT duration should not be based on opioid type (heroin vs prescription) — the neurobiological basis of opioid use disorder is the same. The NP frames OAT as a long-term medical treatment for a chronic condition (analogous to antihypertensives for hypertension), not a detox program with a fixed endpoint. Shared decision-making about duration is essential; patient autonomy is respected while presenting the evidence clearly.",
      },
    },
  ],
};

// ── Case 12: Chest Pain — primary care differential ──────────────────────────

export const CASE_CHEST_PAIN_DIFFERENTIAL: PatientCase = {
  id: "cnple-sample-cp-001",
  title: "Ms. Abramowitz — Chest Pain Evaluation",
  tagline: "Urgent Care · Differential Diagnosis",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: ["Canadian Cardiovascular Society Stable Ischemic Heart Disease Guidelines", "ACC/AHA Chest Pain Evaluation Guidelines 2021"],
  },
  patient: { age: 52, sex: "Female", pronouns: "she/her", setting: "Primary Care Clinic — same day appointment" },
  chiefComplaint: "Chest pain for 2 weeks — worse with exertion.",
  pmhx: ["Hypertension (controlled)", "Type 2 DM", "Non-smoker", "BMI 29", "Family history: father MI at 58"],
  medications: [
    { name: "Perindopril", dose: "8 mg", route: "PO", frequency: "once daily", indication: "Hypertension" },
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "Type 2 DM" },
  ],
  allergies: [],
  primaryDomain: "acute-urgent-care",
  secondaryDomains: ["diagnostics-labs", "chronic-disease-management"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 16,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Assessment — 2 weeks of exertional chest pain",
      scenarioText:
        "Ms. Abramowitz, 52, presents with a 2-week history of substernal chest tightness that occurs with brisk walking or climbing stairs. Pain is 5/10 intensity, lasts 5–10 minutes, and resolves with rest. No pain at rest. No radiation to arm or jaw. No dyspnoea, diaphoresis, nausea, or palpitations. She is post-menopausal (natural menopause at 50). Vitals: BP 132/78, HR 72, RR 14, SpO2 99%, T 36.9°C. Exam: no cardiac murmur, no S3/S4, no peripheral oedema, lungs clear.",
      clinicalUpdate: { direction: "stable", summary: "Classic exertional chest pain in a post-menopausal woman with cardiovascular risk factors. Stable angina presentation.", newFindings: ["Exertional onset", "Rest relief", "Multiple CVD risk factors", "Post-menopausal"] },
      vitals: [{ label: "BP", value: "132/78", unit: "mmHg" }, { label: "HR", value: "72", unit: "bpm" }, { label: "SpO2", value: "99%", unit: "" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Ms. Abramowitz has 2 weeks of stable exertional chest pain, multiple CVD risk factors, and a positive family history. What is the NP's most appropriate immediate action?",
        family: "chest-pain-differential",
        options: [
          { id: "A", label: "Order resting ECG and troponin — rule out NSTEMI before outpatient workup." },
          { id: "B", label: "Send to ED via EMS — any exertional chest pain in a diabetic must be treated as ACS." },
          { id: "C", label: "Reassure her it is musculoskeletal — the 2-week stable history and lack of radiation makes cardiac cause unlikely." },
          { id: "D", label: "Prescribe a PPI empirically — GERD is the most common cause of chest pain in perimenopausal women." },
        ],
        correctOptionId: "A",
        rationale:
          "Stable exertional chest pain in a post-menopausal woman with DM, hypertension, obesity, and positive family history is a classic stable angina presentation requiring urgent but not emergency workup. The NP's immediate priority is to exclude NSTEMI/UA with a resting ECG and troponin (even if presentation is 2 weeks old — silent MI is more common in diabetics). If troponin is negative and ECG shows no acute changes, she requires same-day or next-day referral to cardiology or stress testing. Sending to ED by EMS is appropriate for active ACS symptoms (rest pain, diaphoresis, dynamic ECG changes) — this is not that presentation. Reassurance without workup is dangerous given her risk profile. PPI empirically is not the priority.",
      },
    },
    {
      index: 1,
      heading: "Initial investigations — stable angina confirmed",
      scenarioText:
        "Resting ECG: normal sinus rhythm, no ST changes, no pathological Q waves. Troponin I: <0.01 ng/mL (negative ×2 at 3h). Fasting lipid panel: LDL 3.4 mmol/L, HDL 1.1 mmol/L, TG 2.1 mmol/L. HbA1c: 7.8%. You confirm a clinical diagnosis of stable ischemic heart disease (SIHD)/stable angina pending functional stress testing.",
      clinicalUpdate: { direction: "stable", summary: "NSTEMI excluded. Stable angina confirmed clinically. Cardiovascular risk factors under-treated: LDL 3.4, HbA1c 7.8%.", newFindings: ["Negative troponin", "Normal resting ECG", "LDL 3.4 (above target for high-risk)", "HbA1c 7.8%"] },
      vitals: [],
      diagnosticArtifacts: [
        { label: "Troponin I", value: "<0.01 ng/mL", interpretation: "Negative ×2 — NSTEMI excluded", isAbnormal: false },
        { label: "LDL", value: "3.4 mmol/L", interpretation: "Above target (<1.8 for high CVD risk)", isAbnormal: true },
        { label: "HbA1c", value: "7.8%", interpretation: "Above target; consider intensification", isAbnormal: true },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Troponin negative, ECG normal. Ms. Abramowitz has stable angina pending stress test, LDL 3.4, HbA1c 7.8%. What is the NP's priority pharmacotherapy change?",
        family: "sihd-prescribing",
        options: [
          { id: "A", label: "Start aspirin 81 mg daily and high-intensity statin (rosuvastatin 20–40 mg) — antiplatelet + statin is first-line SIHD." },
          { id: "B", label: "Start sublingual nitroglycerin PRN only — wait for stress test before adding other medications." },
          { id: "C", label: "Start amlodipine for chest pain management — calcium channel blockers are first-line for stable angina." },
          { id: "D", label: "Increase metformin dose first — DM control is the priority before addressing lipids." },
        ],
        correctOptionId: "A",
        rationale:
          "In stable ischemic heart disease, aspirin 81 mg and high-intensity statin therapy are class I guideline recommendations regardless of symptom severity. For a patient with SIHD (or very high CVD risk), LDL target is <1.8 mmol/L — her LDL of 3.4 requires high-intensity statin (rosuvastatin 20–40 mg or atorvastatin 40–80 mg). Aspirin reduces event risk in confirmed SIHD. SL nitroglycerin PRN is appropriate for symptom relief but does not address underlying disease risk. Amlodipine and beta-blockers are first-line anti-anginal agents but are added after confirming diagnosis by stress testing — she needs stress testing first. HbA1c optimization is important but does not take priority over evidence-based SIHD pharmacotherapy.",
      },
    },
    {
      index: 2,
      heading: "Referral and follow-up plan",
      scenarioText:
        "You start aspirin 81 mg daily and rosuvastatin 20 mg nightly. SL nitroglycerin PRN is prescribed with education. You arrange urgent cardiology referral for stress testing (appointment in 5 days). Ms. Abramowitz asks what to do if pain occurs again tonight.",
      clinicalUpdate: { direction: "improving", summary: "Initial medications started. Urgent cardiology referral in place. Safety planning needed.", newFindings: ["ASA started", "Rosuvastatin started", "Stress test pending"] },
      vitals: [],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Aspirin", change: "start", note: "81 mg daily" },
        { name: "Rosuvastatin", change: "start", note: "20 mg nightly" },
        { name: "Nitroglycerin SL", change: "start", note: "0.4 mg PRN — 1 tab q5min × 3, then 911 if no relief" },
      ],
      followUpInterval: "Cardiology in 5 days; NP review in 1–2 weeks",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "You are teaching Ms. Abramowitz how to use nitroglycerin. What is the critical safety instruction?",
        family: "patient-education-angina",
        options: [
          { id: "A", label: "If chest pain is not relieved by 3 nitroglycerin tablets 5 minutes apart, call 911 immediately." },
          { id: "B", label: "Take up to 5 nitroglycerin tablets before calling for help — angina can take time to respond." },
          { id: "C", label: "NTG is safe with sildenafil — both are vasodilators and the combination is additive." },
          { id: "D", label: "Take NTG lying down to prevent hypotension, then wait 30 minutes before reassessing." },
        ],
        correctOptionId: "A",
        rationale:
          "The CCS/ACC/AHA guideline teaching for nitroglycerin use in stable angina: one SL tablet every 5 minutes, maximum 3 tablets. If pain persists after 3 tablets, call 911 — this may indicate an ACS. The rule of three (3 × 5 minutes = 15 minutes) is the international standard. Sitting (not lying) when taking NTG reduces risk of falls from orthostatic hypotension. The combination of nitroglycerin with PDE5 inhibitors (sildenafil, tadalafil, vardenafil) is absolutely contraindicated due to catastrophic hypotension — this must be explicitly counselled. Waiting 30 minutes is dangerous and delays ACS recognition.",
      },
    },
  ],
};

// ── Case 13: Preventive Care — 45-year-old health maintenance ─────────────────

export const CASE_PREVENTIVE_HEALTH: PatientCase = {
  id: "cnple-sample-prev-001",
  title: "Mr. Mehta — 45-Year-Old Health Maintenance Visit",
  tagline: "Preventive Care · Health Promotion",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: [
      "Canadian Task Force on Preventive Health Care Recommendations",
      "Canadian Cancer Society Screening Guidelines",
      "Diabetes Canada — Screening for Type 2 DM",
      "Heart & Stroke — Cardiovascular Risk Screening",
    ],
  },
  patient: { age: 45, sex: "Male", pronouns: "he/him", setting: "Primary Care Clinic" },
  chiefComplaint: "Annual health check — no acute complaints.",
  pmhx: ["No known chronic diseases", "Father had MI at 62, bowel cancer at 70", "BMI 26.4", "Non-smoker", "Drinks 10–12 standard drinks/week"],
  medications: [],
  allergies: [],
  primaryDomain: "health-promotion-prevention",
  secondaryDomains: ["diagnostics-labs", "professional-practice"],
  difficulty: 2,
  stepCount: 3,
  estimatedMinutes: 14,
  isPremium: false,
  steps: [
    {
      index: 0,
      heading: "45-year-old male annual visit",
      scenarioText:
        "Mr. Mehta, 45, presents for his first health check in 3 years. He has no acute complaints. He is a project manager, reports high work stress, and drinks wine with dinner most nights (10–12 drinks/week). Non-smoker. BMI 26.4. BP 138/84 (repeated: 136/82), HR 76, SpO2 99%, T 36.8°C. Exam: no abnormal findings. He has a family history of paternal MI and bowel cancer. He is interested in knowing what screenings he is due for.",
      clinicalUpdate: { direction: "stable", summary: "Well male, 45. Borderline elevated BP. Alcohol above low-risk drinking guidelines. Positive family history.", newFindings: ["BP 136/82 (borderline HTN)", "Alcohol 10–12 drinks/week (above guideline)", "Family hx: MI, bowel CA"] },
      vitals: [{ label: "BP", value: "136/82", unit: "mmHg", flag: "borderline" }, { label: "BMI", value: "26.4", unit: "kg/m²" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mr. Mehta, 45 years old, borderline BP, family history of MI and bowel cancer, 10–12 drinks/week. Which screening battery is most aligned with Canadian Task Force recommendations?",
        family: "preventive-screening",
        options: [
          { id: "A", label: "Fasting glucose/HbA1c, lipid panel, colorectal cancer screening (FIT), blood pressure monitoring, AUDIT-C, and FRAX." },
          { id: "B", label: "PSA, colonoscopy, lipids, stress ECG, and fasting glucose — comprehensive for a 45-year-old man with family history." },
          { id: "C", label: "Fasting lipids and blood pressure only — other screening is not indicated until age 50." },
          { id: "D", label: "Colonoscopy only — bowel cancer is the dominant risk given his family history." },
        ],
        correctOptionId: "A",
        rationale:
          "The Canadian Task Force on Preventive Health Care (CTFPHC) and Diabetes Canada recommend: (1) DM screening starting at 40 with risk factors (family history positive first-degree relative with CVD) using FPG or HbA1c; (2) lipid panel for CVD risk calculation (Framingham or pooled cohort equations) at 40+ with risk factors; (3) Colorectal cancer screening with FIT (fecal immunochemical test) starting at age 45–50 (some provinces initiate at 50, but 45 with positive FH is a reasonable start; some guidelines offer colonoscopy for first-degree relative with CRC under 60); (4) blood pressure monitoring at every visit; (5) alcohol brief intervention (AUDIT/AUDIT-C) — 10–12 drinks/week exceeds Canada's low-risk drinking guidelines (≤14/week but framed as 2 standard drinks/day max; 10+ is above moderate-risk guidance); (6) FRAX bone health assessment at 40+ with risk factors. PSA is not recommended by CTFPHC (weak evidence, no survival benefit, harm from overdiagnosis). Routine resting stress ECG is not indicated. Colonoscopy is higher sensitivity but FIT is appropriate first step.",
      },
    },
    {
      index: 1,
      heading: "Lab review and risk counselling",
      scenarioText:
        "Labs return: FPG 6.2 mmol/L (ref 3.9–6.0 — impaired fasting glucose), HbA1c 6.0% (prediabetes), total cholesterol 5.8 mmol/L, LDL 3.6 mmol/L, HDL 1.3 mmol/L, TG 1.8 mmol/L. 10-year CVD risk (Framingham): 12% (intermediate risk). eGFR 95 mL/min. FIT ordered. You now counsel Mr. Mehta on his results.",
      clinicalUpdate: { direction: "stable", summary: "Prediabetes, intermediate CVD risk, LDL above optimal. Modifiable risk factors present.", newFindings: ["FPG 6.2 (impaired fasting)", "HbA1c 6.0% (prediabetes)", "LDL 3.6 (above optimal for intermediate risk)", "10-year CVD risk 12%"] },
      vitals: [],
      diagnosticArtifacts: [
        { label: "FPG", value: "6.2 mmol/L", interpretation: "Impaired fasting glucose (prediabetes)", isAbnormal: true },
        { label: "HbA1c", value: "6.0%", interpretation: "Prediabetes range (5.7–6.4%)", isAbnormal: true },
        { label: "LDL", value: "3.6 mmol/L", interpretation: "Above target for intermediate CVD risk (<3.5)", isAbnormal: true },
        { label: "10-yr CVD risk", value: "12%", interpretation: "Intermediate (10–20%)", isAbnormal: false },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mr. Mehta has prediabetes, intermediate CVD risk, and LDL 3.6. What is the most appropriate initial management strategy?",
        family: "prediabetes-cvd-risk",
        options: [
          { id: "A", label: "Lifestyle intervention first: structured physical activity (150 min/week), dietary modification, and alcohol reduction — defer medications." },
          { id: "B", label: "Start metformin immediately — prediabetes with cardiovascular risk factors meets threshold for metformin." },
          { id: "C", label: "Start statin immediately — LDL 3.6 with 12% CVD risk meets CCS threshold for pharmacotherapy." },
          { id: "D", label: "Start both metformin and a statin — risk level warrants dual pharmacotherapy now." },
        ],
        correctOptionId: "A",
        rationale:
          "For prediabetes (FPG 6.1–6.9 or HbA1c 6.0–6.4%), Diabetes Canada recommends lifestyle intervention as first-line: structured physical activity (150 min/week moderate intensity), 5–10% weight reduction if overweight, and healthy eating patterns. Metformin may be considered for high-risk prediabetes (HbA1c >6.0%, FPG >6.1, combined risk factors), but lifestyle intervention should be trialled first for 3–6 months. For CVD risk: CCS guidelines suggest statin initiation when 10-year risk ≥20% (high) regardless of LDL, or when LDL ≥4.9. At 12% risk and LDL 3.6, lifestyle modification and risk reassessment in 3–6 months is appropriate before statin initiation. Alcohol reduction alone (from 12 to <7 drinks/week) would meaningfully improve his CVD risk, blood pressure, lipid profile, and metabolic markers.",
      },
    },
    {
      index: 2,
      heading: "Alcohol screening and brief intervention",
      scenarioText:
        "Mr. Mehta reports drinking 2 glasses of wine nightly 'to unwind from work stress.' He does not consider this a problem. AUDIT score: 12 (hazardous drinking). He has never had a drink-driving conviction or blackouts. You address alcohol as part of a brief intervention.",
      clinicalUpdate: { direction: "stable", summary: "AUDIT 12 — hazardous drinking. Brief motivational intervention indicated.", newFindings: ["AUDIT 12 (hazardous range)", "Daily use linked to stress", "No dependency markers"] },
      vitals: [],
      diagnosticArtifacts: [{ label: "AUDIT Score", value: "12", interpretation: "Hazardous drinking (8–15)", isAbnormal: true }],
      medicationChanges: [],
      followUpInterval: "3 months",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mr. Mehta's AUDIT score is 12 (hazardous). He does not see it as a problem. What is the most effective NP response?",
        family: "alcohol-brief-intervention",
        options: [
          { id: "A", label: "Brief motivational intervention: provide personalised feedback linking his drinking to BP, CVD risk, and prediabetes — set a collaborative reduction goal." },
          { id: "B", label: "Refer to an addictions specialist — AUDIT ≥8 requires specialist assessment." },
          { id: "C", label: "Document and defer — he is not ready to change; confrontation risks damaging the therapeutic relationship." },
          { id: "D", label: "Prescribe naltrexone — pharmacotherapy is first-line for AUDIT score above 10." },
        ],
        correctOptionId: "A",
        rationale:
          "Brief motivational intervention (BMI/BI) is evidence-based, NP-appropriate first-line care for hazardous drinking (AUDIT 8–15). The approach: (1) give personalised feedback — his 10–12 drinks/week raises BP, worsens lipid and glucose control, and adds hepatic and cancer risk; (2) ask about readiness to change; (3) provide Canada's low-risk drinking guidelines (≤14/week, ≤3/occasion); (4) set a collaborative reduction goal (e.g., target ≤7/week). Referral to addictions specialist is for dependent or high-risk drinking (AUDIT ≥16 or overt dependency markers). Deferring because 'he's not ready' is not best practice — brief intervention works even in ambivalent patients. Naltrexone is for alcohol dependence or relapse prevention, not hazardous drinking in a person without dependency.",
      },
    },
  ],
};

// ── Case 14: Skin Infection — cellulitis assessment + prescribing ──────────────

export const CASE_CELLULITIS: PatientCase = {
  id: "cnple-sample-skin-001",
  title: "Mrs. Fontaine — Lower Leg Cellulitis",
  tagline: "Dermatology · Prescribing Safety",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: [
      "Infectious Diseases Society of America (IDSA) Skin and Soft Tissue Infection Guidelines 2014 (updated 2024)",
      "Canada Communicable Disease Report — Community-Acquired MRSA",
    ],
  },
  patient: { age: 61, sex: "Female", pronouns: "she/her", setting: "Walk-in / Primary Care" },
  chiefComplaint: "Right lower leg redness, swelling, and warmth — 3 days.",
  pmhx: ["Type 2 DM (HbA1c 8.2% last year)", "Obesity (BMI 34)", "Bilateral leg oedema", "No prior cellulitis", "No IV drug use"],
  medications: [
    { name: "Metformin", dose: "1000 mg", route: "PO", frequency: "twice daily", indication: "Type 2 DM" },
    { name: "Furosemide", dose: "40 mg", route: "PO", frequency: "once daily", indication: "Leg oedema" },
  ],
  allergies: [],
  primaryDomain: "dermatology-wound-care",
  secondaryDomains: ["pharmacotherapeutics", "diagnostics-labs"],
  difficulty: 2,
  stepCount: 3,
  estimatedMinutes: 12,
  isPremium: false,
  steps: [
    {
      index: 0,
      heading: "Presenting with right leg redness",
      scenarioText:
        "Mrs. Fontaine, 61, presents with 3 days of increasing right lower leg redness, warmth, swelling, and tenderness. The area extends from the ankle to mid-calf. There is no fluctuance, no central necrosis, no obvious wound, and no bullae. She notes a small crack between the fourth and fifth toes (interdigital fissure). T 38.1°C, HR 92, BP 142/86, RR 16. Systemic CBC pending. She has been taking ibuprofen with minimal relief.",
      clinicalUpdate: { direction: "worsening", summary: "Non-purulent cellulitis with systemic features (fever, tachycardia). Likely portal of entry: toe web fissure.", newFindings: ["T 38.1°C", "HR 92", "Erythema ankle to mid-calf", "Interdigital fissure (portal of entry)", "No abscess/fluctuance"] },
      vitals: [
        { label: "T", value: "38.1", unit: "°C", flag: "high" },
        { label: "HR", value: "92", unit: "bpm", flag: "borderline" },
        { label: "BP", value: "142/86", unit: "mmHg" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "dermatology-wound-care",
      question: {
        stem: "Mrs. Fontaine has non-purulent cellulitis with low-grade fever and tachycardia in a diabetic. What is the first-line antibiotic choice?",
        family: "cellulitis-prescribing",
        options: [
          { id: "A", label: "Cephalexin 500 mg four times daily for 5–7 days — first-line for non-purulent cellulitis (beta-haemolytic Streptococcus coverage)." },
          { id: "B", label: "TMP-SMX 1–2 DS tablets twice daily — MRSA coverage is essential given her diabetes." },
          { id: "C", label: "Clindamycin 300 mg three times daily — broad coverage including anaerobes and MRSA." },
          { id: "D", label: "Flucloxacillin 500 mg four times daily — Staphylococcal coverage is first priority in cellulitis." },
        ],
        correctOptionId: "A",
        rationale:
          "Non-purulent cellulitis (without abscess, folliculitis, or purulent discharge) is primarily caused by beta-haemolytic Streptococcus (Group A, B, C, G). IDSA guidelines recommend cephalexin (or amoxicillin-clavulanate) as first-line for non-purulent cellulitis. TMP-SMX and clindamycin provide MRSA coverage but do NOT reliably cover beta-haemolytic Streptococcus — using them for non-purulent cellulitis risks treatment failure. MRSA coverage (TMP-SMX or clindamycin) is reserved for purulent cellulitis/abscess or confirmed MRSA exposure. Flucloxacillin is appropriate in UK guidelines but cephalexin is preferred in Canada. Duration: 5–7 days minimum; extend if not improving at 48–72 hours. Treating the interdigital tinea/fissure (topical antifungal) prevents recurrence.",
      },
    },
    {
      index: 1,
      heading: "Marking progression and 48-hour reassessment",
      scenarioText:
        "You mark the borders of erythema and instruct Mrs. Fontaine to return in 48 hours. She returns: erythema is extending 2 cm beyond marked border. T 38.4°C, HR 96, BP 136/80. She has taken all antibiotic doses. CBC now available: WBC 16.2 × 10⁹/L (neutrophilia), CRP 68 mg/L.",
      clinicalUpdate: { direction: "worsening", summary: "Treatment failure at 48 hours — spreading erythema, rising fever, systemic inflammatory response. Consider IV antibiotics or admission.", newFindings: ["Erythema beyond marked border", "WBC 16.2", "CRP 68", "T 38.4°C"] },
      vitals: [{ label: "T", value: "38.4", unit: "°C", flag: "high" }, { label: "WBC", value: "16.2", unit: "×10⁹/L", flag: "high" }],
      diagnosticArtifacts: [{ label: "WBC", value: "16.2 × 10⁹/L", interpretation: "Elevated neutrophilia", isAbnormal: true }, { label: "CRP", value: "68 mg/L", interpretation: "Elevated", isAbnormal: true }],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Cellulitis is progressing despite 48 hours of oral cephalexin. She has systemic features. What is the most appropriate NP action?",
        family: "cellulitis-escalation",
        options: [
          { id: "A", label: "Refer to ED for IV antibiotics — treatment failure with systemic features in a diabetic warrants escalation." },
          { id: "B", label: "Switch to oral TMP-SMX — MRSA is now the likely cause of treatment failure." },
          { id: "C", label: "Increase cephalexin dose and add topical antibiotic — give more time on current regimen." },
          { id: "D", label: "Admit under NP service and start IV cefazolin in clinic — home IV therapy is sufficient." },
        ],
        correctOptionId: "A",
        rationale:
          "Cellulitis progressing beyond marked borders at 48 hours despite adequate oral antibiotics, combined with worsening systemic features (rising fever, tachycardia, elevated WBC/CRP) in a diabetic, meets indications for IV antibiotic therapy and emergency department assessment. IDSA criteria for hospital admission include: failure to respond to oral antibiotics, fever ≥38.5°C, rapidly spreading erythema, immunocompromised host (DM with HbA1c >8%). IV cefazolin 1–2 g q8h is the standard hospital regimen. Switching to TMP-SMX alone without addressing the streptococcal possibility risks ongoing failure. The NP's role is to recognise treatment failure thresholds and refer appropriately — this is an essential professional practice competency for the CNPLE.",
      },
    },
    {
      index: 2,
      heading: "Follow-up after hospital discharge",
      scenarioText:
        "Mrs. Fontaine was admitted, treated with IV cefazolin for 48 hours, then transitioned to oral cephalexin. She returns to your clinic 1 week later, cellulitis resolved. You now address underlying risk factors for recurrence.",
      clinicalUpdate: { direction: "improving", summary: "Cellulitis resolved post-IV treatment. Recurrence prevention required — tinea pedis, oedema, DM control.", newFindings: ["Cellulitis resolved", "Interdigital tinea still present", "Oedema persists", "HbA1c still 8.2%"] },
      vitals: [],
      diagnosticArtifacts: [],
      medicationChanges: [{ name: "Topical antifungal", change: "start", note: "Clotrimazole 1% cream BID × 4 weeks — treat interdigital tinea (recurrence prevention)" }],
      followUpInterval: "6–8 weeks",
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "What is the most important recurrence-prevention measure for Mrs. Fontaine's cellulitis?",
        family: "cellulitis-prevention",
        options: [
          { id: "A", label: "Treat interdigital tinea pedis, optimize glycaemic control, and manage lower extremity oedema." },
          { id: "B", label: "Prophylactic oral penicillin V for 6 months — antibiotic prophylaxis is first-line for cellulitis recurrence." },
          { id: "C", label: "Compression stockings only — venous insufficiency is the primary risk factor." },
          { id: "D", label: "Topical mupirocin to both legs daily — decolonisation reduces Staphylococcal carriage." },
        ],
        correctOptionId: "A",
        rationale:
          "Recurrent cellulitis risk is highest when portal-of-entry risk factors are unaddressed. For Mrs. Fontaine, three modifiable factors require NP attention: (1) interdigital tinea pedis is the most common portal of entry for leg cellulitis — treat with topical antifungal (clotrimazole 1% BID × 4 weeks); (2) poorly controlled DM (HbA1c 8.2%) impairs immune response and skin barrier — intensify DM management; (3) bilateral oedema creates skin fragility and impaired lymphatic clearance — ensure optimal diuretic dosing and consider compression stockings. Antibiotic prophylaxis (phenoxymethylpenicillin 250 mg BID) is IDSA-guideline supported for recurrent cellulitis (≥3 episodes/year) but is NOT first-line at first recurrence; address underlying risk factors first.",
      },
    },
  ],
};

// ── Case 15: Professional Practice — NP Scope and Ethical Dilemma ─────────────

export const CASE_PROFESSIONAL_PRACTICE: PatientCase = {
  id: "cnple-sample-pp-001",
  title: "NP Scope and Collaborative Practice",
  tagline: "Professional Practice · Ethics",
  governance: {
    reviewStatus: "internal_review",
    contentUpdatedAt: "2026-05-13",
    guidelineSources: [
      "CNA Code of Ethics for Registered Nurses (2017)",
      "CNPS Professional Liability Program Scope of Practice Guidance",
      "CNO Entry-to-Practice Competencies for Nurse Practitioners",
    ],
  },
  patient: { age: 38, sex: "Female", pronouns: "she/her", setting: "Remote NP-Led Clinic" },
  chiefComplaint: "NP consultation — chest pain, recent weight loss, night sweats.",
  pmhx: ["Recent immigration (6 months ago)", "No Canadian health records available", "Reports prior TB contact in home country"],
  medications: [],
  allergies: [],
  primaryDomain: "professional-practice",
  secondaryDomains: ["diagnostics-labs", "health-promotion-prevention"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 14,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Remote clinic assessment — possible TB",
      scenarioText:
        "You are the only NP in a remote northern Ontario community. Ms. Abubakar, 38, presents with 3 months of productive cough, night sweats, 6 kg weight loss, and fatigue. She emigrated from a high-burden TB country 6 months ago. She has no documented TB screening in Canada. Vitals: T 37.8°C, HR 96, RR 20, SpO2 96%, BP 112/72. Exam: decreased breath sounds and dullness to percussion at the left lower lobe.",
      clinicalUpdate: { direction: "worsening", summary: "High-probability active tuberculosis in a recent immigrant with classic systemic symptoms and focal respiratory findings.", newFindings: ["3-month constitutional symptoms", "LLL dullness", "T 37.8°C", "High-burden country origin", "6 kg weight loss"] },
      vitals: [{ label: "T", value: "37.8", unit: "°C", flag: "high" }, { label: "SpO2", value: "96%", unit: "" }, { label: "HR", value: "96", unit: "bpm" }],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "professional-practice",
      question: {
        stem: "You have high clinical suspicion for active pulmonary tuberculosis. What is the most appropriate immediate NP action in a remote clinic without on-site radiology?",
        family: "tb-professional-practice",
        options: [
          { id: "A", label: "Isolate the patient, arrange urgent telehealth/physician consultation, arrange transport for CXR and sputum AFB, and notify public health." },
          { id: "B", label: "Start empirical TB therapy (HRZE) immediately — clinical diagnosis is sufficient to initiate treatment in a remote setting." },
          { id: "C", label: "Prescribe azithromycin for atypical pneumonia and re-evaluate in 2 weeks." },
          { id: "D", label: "Defer management until the patient can be seen in a city hospital — remote NP scope does not include infectious disease management." },
        ],
        correctOptionId: "A",
        rationale:
          "Active TB is a notifiable disease under the Public Health Agency of Canada and all provincial public health acts — mandatory reporting is a legal and professional obligation for any regulated health professional. In a remote NP-led clinic, the NP's immediate actions are: (1) respiratory isolation — separate from waiting area, provide surgical mask; (2) urgent telehealth consultation with infectious disease or public health physician to confirm workup and management plan; (3) arrange transfer for CXR (two views), sputum AFB × 3 (morning specimens), and full labs; (4) notify the local Medical Officer of Health. Empirical TB therapy should not be started without confirmatory testing — incorrect regimen, drug resistance, and contact tracing all depend on microbiological confirmation. This is NOT outside NP scope — recognising, isolating, reporting, and coordinating is core NP professional practice in any setting.",
      },
    },
    {
      index: 1,
      heading: "Patient declines investigation",
      scenarioText:
        "Ms. Abubakar understands the concern but refuses to be transported to the nearest city 4 hours away. She has two young children and her husband is away working. She asks if she can 'just take some medicine' at home and come back in a week.",
      clinicalUpdate: { direction: "worsening", summary: "Patient refusing necessary diagnostic transport. Public health risk and patient autonomy conflict.", newFindings: ["Patient refusing transport", "Active TB highly likely", "Community infection risk", "Children at home"] },
      vitals: [],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "professional-practice",
      question: {
        stem: "Ms. Abubakar is refusing transport for diagnosis despite high TB suspicion. How does the NP best balance autonomy and public health responsibility?",
        family: "professional-ethics-autonomy",
        options: [
          { id: "A", label: "Document refusal, provide respiratory precautions education, arrange sputum collection at clinic, and activate public health reporting — patient autonomy is respected while fulfilling legal obligations." },
          { id: "B", label: "Comply with her request — patient autonomy overrides all other considerations in NP practice." },
          { id: "C", label: "Invoke mandatory detention under the Public Health Act immediately — she is a clear public health risk." },
          { id: "D", label: "Discharge and refer to her family physician — this case is beyond NP scope in a remote setting." },
        ],
        correctOptionId: "A",
        rationale:
          "The NP must navigate the tension between respecting patient autonomy and fulfilling public health and professional obligations. The correct approach is: (1) Acknowledge her legitimate concerns (childcare, distance) — validate and problem-solve (e.g., social work consult for childcare support, telehealth follow-up, home nursing visit); (2) Explain the legal reporting obligation clearly and honestly — she must understand reporting will occur regardless of her decision about transport; (3) Proceed with what CAN be done at clinic: sputum collection in isolation, contact tracing conversation, home precautions education (separate sleep room, no visitors, wear mask); (4) Document a detailed informed refusal noting capacity, options offered, and plans. Mandatory detention (quarantine order) requires physician/MOH order — it is not a unilateral NP action. Abdicating care ('refer to family physician') is not appropriate when there is an active public health threat. CNA Code of Ethics: NPs have a duty to both the individual patient and the health of the public.",
      },
    },
    {
      index: 2,
      heading: "Sputum results and treatment decision",
      scenarioText:
        "Three sputum AFB smears are positive. CXR (tele-radiology): left upper lobe infiltrate with cavitation — highly consistent with active pulmonary TB. Public health is notified. Infectious disease telehealth consultation confirms: start 4-drug HRZE therapy. You are asked to prescribe the initial TB regimen as part of the collaborative management plan.",
      clinicalUpdate: { direction: "stable", summary: "Active TB confirmed by smear and CXR. Starting HRZE under physician collaborative plan.", newFindings: ["AFB smear positive ×3", "CXR: LUL cavitation", "ID physician plan: HRZE"] },
      vitals: [],
      diagnosticArtifacts: [
        { label: "AFB Smear", value: "Positive ×3", interpretation: "Active pulmonary TB confirmed", isAbnormal: true },
        { label: "CXR", value: "LUL infiltrate with cavitation", interpretation: "Classic active TB pattern", isAbnormal: true },
      ],
      medicationChanges: [
        { name: "Isoniazid (H)", change: "start", note: "5 mg/kg/day (max 300 mg) — note pyridoxine co-prescription needed" },
        { name: "Rifampin (R)", change: "start", note: "10 mg/kg/day (max 600 mg)" },
        { name: "Pyrazinamide (Z)", change: "start", note: "15–30 mg/kg/day" },
        { name: "Ethambutol (E)", change: "start", note: "15–20 mg/kg/day" },
      ],
      followUpInterval: "2 months (intensive phase completion)",
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "You are prescribing isoniazid as part of the TB regimen. What co-prescription is essential and why?",
        family: "tb-prescribing",
        options: [
          { id: "A", label: "Pyridoxine (vitamin B6) 25–50 mg daily — isoniazid depletes B6, causing peripheral neuropathy." },
          { id: "B", label: "Folic acid — isoniazid depletes folate, causing megaloblastic anaemia." },
          { id: "C", label: "Magnesium — isoniazid chelates divalent cations, causing hypomagnesaemia." },
          { id: "D", label: "No co-prescription needed — pyridoxine is only added if the patient develops symptoms." },
        ],
        correctOptionId: "A",
        rationale:
          "Isoniazid inhibits pyridoxine (vitamin B6) metabolism by competing with pyridoxal phosphate, the active form of B6. Peripheral neuropathy is the main adverse effect — risk is higher with malnutrition, alcoholism, diabetes, renal failure, HIV, and pregnancy. Pyridoxine 25–50 mg daily is co-prescribed with every isoniazid-containing TB regimen in Canada to prevent neuropathy. This is standard of care in Canadian TB guidelines — it is not optional or reserved for symptomatic patients. The NP should also counsel Ms. Abubakar about rifampin's significant drug interactions (including oral contraceptives — ineffective), orange discolouration of body fluids (expected), and the critical importance of adherence (DOTS — directly observed therapy may be arranged through public health).",
      },
    },
  ],
};

// ── Exported catalog ───────────────────────────────────────────────────────────

export const CNPLE_SAMPLE_CASES: PatientCase[] = [
  CASE_HYPERTENSION_FOLLOWUP,
  CASE_DIABETES_METABOLIC,
  CASE_ANTICOAGULATION_AF,
  CASE_MENTAL_HEALTH_SSRI,
  CASE_PAEDIATRIC_FEVER,
  CASE_PERIMENOPAUSE_MHT,
  CASE_GERIATRIC_POLYPHARMACY,
  CASE_CHF_COPD_OVERLAP,
  // New cases — commercial readiness sprint 2026-05-13
  CASE_HYPOTHYROIDISM,
  CASE_COPD_EXACERBATION,
  CASE_OPIOID_USE_DISORDER,
  CASE_CHEST_PAIN_DIFFERENTIAL,
  CASE_PREVENTIVE_HEALTH,
  CASE_CELLULITIS,
  CASE_PROFESSIONAL_PRACTICE,
];

/** Free-tier preview: returns cases with isPremium=false, steps limited to first 2. */
export function getCnpleSampleCasePreview(caseId: string): PatientCase | undefined {
  const found = CNPLE_SAMPLE_CASES.find((c) => c.id === caseId);
  if (!found) return undefined;
  return {
    ...found,
    steps: found.isPremium ? found.steps.slice(0, 1) : found.steps,
  };
}

export function listCnpleSampleCases(): Omit<PatientCase, "steps">[] {
  return CNPLE_SAMPLE_CASES.map(({ steps: _steps, ...meta }) => meta);
}
