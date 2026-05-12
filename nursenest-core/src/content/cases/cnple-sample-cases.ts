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

// ── Exported catalog ───────────────────────────────────────────────────────────

export const CNPLE_SAMPLE_CASES: PatientCase[] = [CASE_HYPERTENSION_FOLLOWUP];

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
