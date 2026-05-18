import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style heart failure case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_HEART_FAILURE_DIURETIC_TITRATION: PatientCase = {
  id: "cnple-sample-heart-failure-diuretic-001",
  title: "Mrs. Eleanor Brooks — Heart Failure Weight Gain and Diuretic Titration",
  tagline: "Cardiovascular · Primary Care Pharmacotherapy",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian Cardiovascular Society heart failure guidance",
      "Canadian primary care chronic disease management principles",
      "Medication safety monitoring guidance for diuretics, ACE inhibitors, and mineralocorticoid receptor antagonists",
    ],
  },
  patient: { age: 78, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "Rapid weight gain, ankle swelling, and worsening shortness of breath over 5 days.",
  pmhx: [
    "Heart failure with reduced ejection fraction, EF 35%",
    "Atrial fibrillation on anticoagulation",
    "CKD stage G3b",
    "Type 2 diabetes mellitus",
    "Hypertension",
  ],
  medications: [
    { name: "Furosemide", dose: "40 mg", route: "PO", frequency: "daily", indication: "Heart failure congestion" },
    { name: "Ramipril", dose: "5 mg", route: "PO", frequency: "daily", indication: "HFrEF / hypertension" },
    { name: "Metoprolol succinate", dose: "75 mg", route: "PO", frequency: "daily", indication: "HFrEF / rate control" },
    { name: "Spironolactone", dose: "25 mg", route: "PO", frequency: "daily", indication: "HFrEF" },
    { name: "Apixaban", dose: "5 mg", route: "PO", frequency: "BID", indication: "Atrial fibrillation stroke prevention" },
  ],
  allergies: [{ substance: "Sulfonamide antibiotic", reaction: "rash", severity: "mild" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["older-adult-care", "diagnostics-labs", "acute-urgent-care"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Congestion assessment and outpatient safety screen",
      scenarioText:
        "Mrs. Brooks, 78, reports a 2.8 kg weight gain over 5 days, increased ankle swelling, reduced exercise tolerance, and needing 3 pillows instead of 1. She denies chest pain, syncope, fever, and new unilateral leg swelling. Vitals: BP 132/78, HR 86 irregular, RR 22, SpO2 94% room air. JVP is elevated, bibasilar crackles are present, and edema is 2+ to mid-shin. She is speaking full sentences and can walk into clinic slowly. Labs from 2 weeks ago: creatinine 142 µmol/L, eGFR 34, potassium 4.7 mmol/L.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Likely mild-to-moderate heart failure congestion without immediate shock, severe hypoxemia, or chest pain red flags.",
        newFindings: ["2.8 kg gain in 5 days", "Orthopnea", "JVP elevated", "Bibasilar crackles", "eGFR 34", "K 4.7"],
      },
      vitals: [
        { label: "SpO2", value: "94%", unit: "room air" },
        { label: "RR", value: "22", unit: "/min", flag: "high" },
        { label: "BP", value: "132/78", unit: "mmHg" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Recent renal/electrolyte baseline",
          finding: "Creatinine 142 µmol/L, eGFR 34, potassium 4.7 mmol/L",
          values: [
            { test: "Creatinine", value: "142 µmol/L", referenceRange: "varies by baseline", flag: "H" },
            { test: "eGFR", value: "34 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
            { test: "Potassium", value: "4.7 mmol/L", referenceRange: "3.5–5.0" },
          ],
          timestamp: "2 weeks ago",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mrs. Brooks has likely heart failure congestion with stable BP, SpO2 94%, CKD G3b, and potassium 4.7. What is the most appropriate NP plan today?",
        family: "heart-failure-outpatient-diuretic-titration",
        options: [
          { id: "A", label: "Increase loop diuretic temporarily, order same-day/next-day creatinine/eGFR/electrolytes, give daily weight and symptom instructions, and arrange close reassessment within 48–72 hours with clear ED precautions." },
          { id: "B", label: "Stop ramipril and spironolactone immediately because any CKD makes heart failure medications unsafe." },
          { id: "C", label: "Send her home with no medication changes because oxygen saturation is normal." },
          { id: "D", label: "Start NSAIDs for edema discomfort and reassess in 2 weeks." },
        ],
        correctOptionId: "A",
        rationale:
          "This presentation is compatible with outpatient-manageable congestion if close monitoring is feasible and red flags are absent. A temporary loop diuretic increase can relieve congestion, but CKD and concurrent ACE inhibitor/MRA therapy require prompt renal function and potassium monitoring. The NP should provide weight targets, sodium/fluid counselling as appropriate, medication adherence review, early reassessment, and ED precautions for worsening dyspnea, chest pain, syncope, confusion, severe hypoxemia, or poor urine output.",
        whyWrongByOptionId: {
          B: "ACE inhibitors and MRAs can be beneficial in HFrEF; they should not be stopped reflexively without hyperkalemia, severe renal decline, hypotension, or another specific indication.",
          C: "Normal resting oxygen saturation does not rule out clinically important congestion requiring action.",
          D: "NSAIDs can worsen fluid retention, kidney function, and blood pressure, and are unsafe in this context.",
        },
        clinicalJudgmentFocus: "Safely titrating diuretics in an older adult with CKD while preserving disease-modifying heart failure therapy when possible.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Furosemide is temporarily increased with lab monitoring and 48-hour reassessment. She understands daily weights and when to seek urgent care." },
          B: { trajectory: "suboptimal", outcome: "Disease-modifying therapy is unnecessarily interrupted and congestion persists." },
          C: { trajectory: "harmful", outcome: "Weight and dyspnea worsen over the next 3 days and she presents to ED with pulmonary edema." },
          D: { trajectory: "harmful", outcome: "NSAID use worsens renal function and fluid retention, accelerating decompensation." },
        },
      },
    },
    {
      index: 1,
      heading: "Lab monitoring after diuretic adjustment",
      updateNarrative: "48 hours later — reassessment and labs.",
      scenarioText:
        "Mrs. Brooks returns 48 hours after temporarily increasing furosemide. Her weight is down 1.4 kg and orthopnea has improved, but she reports mild lightheadedness when standing. BP 106/64 sitting and 94/58 standing, HR 82 irregular, SpO2 95% room air. Labs: creatinine 168 µmol/L, eGFR 28, potassium 5.4 mmol/L, sodium 134 mmol/L. She has been eating high-potassium salt substitute because she thought it was healthier.",
      clinicalUpdate: {
        direction: "mixed",
        summary: "Congestion improving, but orthostasis, renal decline, and hyperkalemia require medication and diet safety review.",
        newFindings: ["Weight down 1.4 kg", "Orthostatic symptoms", "eGFR 28", "K 5.4", "Salt substitute use"],
      },
      vitals: [
        { label: "Standing BP", value: "94/58", unit: "mmHg", flag: "low" },
        { label: "SpO2", value: "95%", unit: "room air" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Post-diuretic safety labs",
          finding: "Creatinine increased, eGFR down to 28, potassium 5.4 mmol/L",
          values: [
            { test: "Creatinine", value: "168 µmol/L", referenceRange: "baseline 142", flag: "H" },
            { test: "eGFR", value: "28 mL/min/1.73m²", referenceRange: "baseline 34", flag: "L" },
            { test: "Potassium", value: "5.4 mmol/L", referenceRange: "3.5–5.0", flag: "H" },
            { test: "Sodium", value: "134 mmol/L", referenceRange: "135–145", flag: "L" },
          ],
          timestamp: "48 hours",
        },
      ],
      medicationChanges: [{ name: "Furosemide", dose: "temporarily increased", route: "PO", frequency: "per short plan", indication: "Congestion", flag: "changed" }],
      followUpInterval: { value: 48, unit: "hours", label: "48 hours later" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "After diuretic adjustment, Mrs. Brooks has improved congestion but orthostasis, eGFR 28, potassium 5.4, and potassium salt substitute use. What is the safest next step?",
        family: "heart-failure-renal-potassium-monitoring",
        options: [
          { id: "A", label: "Reduce/return diuretic toward baseline once euvolemic, stop potassium salt substitute, review high-potassium intake, reassess ACE inhibitor/MRA safety, repeat labs soon, and consult/coordinate if potassium or renal function worsens." },
          { id: "B", label: "Continue escalating furosemide until all edema is gone regardless of blood pressure and kidney function." },
          { id: "C", label: "Ignore potassium 5.4 because mild hyperkalemia is expected in all heart failure patients." },
          { id: "D", label: "Tell her to drink large volumes of water to protect the kidneys while continuing all medication changes unchanged." },
        ],
        correctOptionId: "A",
        rationale:
          "The goal is decongestion without over-diuresis, hypotension, kidney injury, or dangerous hyperkalemia. Her improvement suggests the loop increase helped, but orthostasis, eGFR decline, and potassium 5.4 require active safety management. Potassium-containing salt substitutes are a common hidden contributor to hyperkalemia in patients on ACE inhibitors/MRAs. The NP should correct contributors, reassess volume status, consider whether RAAS-modifying drugs need temporary adjustment based on severity/trend, repeat labs promptly, and coordinate care if potassium rises, ECG symptoms occur, or kidney function continues to decline.",
        whyWrongByOptionId: {
          B: "Over-diuresis can worsen hypotension and kidney function, especially in older adults with CKD.",
          C: "Potassium 5.4 is not an emergency by itself if asymptomatic, but it is clinically significant and requires intervention and repeat monitoring.",
          D: "Excess fluid intake can worsen heart failure congestion; kidney protection requires volume-status-specific management, not blanket hydration advice.",
        },
        clinicalJudgmentFocus: "Interpreting heart failure labs after medication titration and identifying hidden hyperkalemia sources.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Salt substitute is stopped, medication plan is adjusted, and repeat labs are booked. Potassium returns to 4.8 and dizziness resolves." },
          B: { trajectory: "harmful", outcome: "She becomes more hypotensive and creatinine rises further, requiring ED assessment." },
          C: { trajectory: "harmful", outcome: "Potassium rises to 6.0 after continued salt substitute use and spironolactone, requiring urgent management." },
          D: { trajectory: "suboptimal", outcome: "She drinks excessive fluid, congestion returns, and the renal/electrolyte issue remains unresolved." },
        },
      },
    },
    {
      index: 2,
      heading: "Long-term heart failure self-management visit",
      updateNarrative: "Two weeks later — stable follow-up.",
      scenarioText:
        "Mrs. Brooks is back to baseline weight and can sleep on one pillow. Repeat potassium is 4.8 and eGFR is 32. She brings a notebook with daily weights but is unsure what changes should trigger a call. She sometimes skips furosemide before church or appointments. She has not had recent medication reconciliation with cardiology, and her diabetes medication list does not include an SGLT2 inhibitor. She asks whether she should just take extra furosemide whenever she feels swollen.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Recovered from congestion episode. Needs action plan, adherence problem-solving, medication reconciliation, and guideline-directed therapy review.",
        newFindings: ["Baseline weight restored", "K 4.8", "eGFR 32", "Skips furosemide", "No clear weight action thresholds"],
      },
      vitals: [{ label: "BP", value: "124/72", unit: "mmHg" }, { label: "SpO2", value: "96%", unit: "room air" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Repeat safety labs",
          finding: "Potassium improved to 4.8; eGFR 32",
          values: [
            { test: "Potassium", value: "4.8 mmol/L", referenceRange: "3.5–5.0" },
            { test: "eGFR", value: "32 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
          ],
          timestamp: "2 weeks",
        },
      ],
      medicationChanges: [],
      followUpInterval: { value: 2, unit: "weeks", label: "2 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At stable follow-up, what education and care plan best reduces future heart failure decompensation risk?",
        family: "heart-failure-self-management-gdmt-review",
        options: [
          { id: "A", label: "Create a written HF action plan with weight/symptom thresholds, solve diuretic adherence barriers, reconcile medications, review eligibility for guideline-directed therapy such as SGLT2 inhibitor with renal considerations, and coordinate cardiology/primary care follow-up." },
          { id: "B", label: "Tell her to self-adjust furosemide freely whenever she notices any ankle swelling." },
          { id: "C", label: "Stop daily weights because they made her anxious." },
          { id: "D", label: "Focus only on sodium restriction and avoid medication review because cardiology manages all HF drugs." },
        ],
        correctOptionId: "A",
        rationale:
          "Heart failure self-management requires a specific action plan, not vague advice. Patients should know their baseline weight, what weight gain or symptoms require calling, and when urgent care is needed. Diuretic adherence barriers should be addressed pragmatically. Medication reconciliation is essential after decompensation, and modern HFrEF care includes review of guideline-directed therapy, including SGLT2 inhibitor eligibility when appropriate. Coordination prevents gaps between primary care, cardiology, pharmacy, and patient self-management.",
        whyWrongByOptionId: {
          B: "Unstructured self-escalation can cause hypotension, kidney injury, and electrolyte abnormalities.",
          C: "Daily weights are useful when paired with clear thresholds and anxiety-sensitive coaching.",
          D: "Diet matters, but medication reconciliation and interprofessional coordination are core NP responsibilities in chronic disease care.",
        },
        clinicalJudgmentFocus: "Building a safe chronic heart failure action plan after an outpatient decompensation episode.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "She follows clear weight thresholds, stops skipping doses without a plan, and cardiology/pharmacy review identifies safe optimization options." },
          B: { trajectory: "harmful", outcome: "She doubles furosemide repeatedly and develops dizziness with creatinine rise." },
          C: { trajectory: "suboptimal", outcome: "Early congestion is missed until dyspnea returns." },
          D: { trajectory: "suboptimal", outcome: "Medication gaps persist and another preventable exacerbation occurs." },
        },
      },
    },
  ],
};
