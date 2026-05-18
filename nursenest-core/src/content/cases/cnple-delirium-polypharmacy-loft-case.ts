import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style geriatrics case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_DELIRIUM_POLYPHARMACY: PatientCase = {
  id: "cnple-sample-delirium-polypharmacy-001",
  title: "Mrs. Beatrice Nguyen — Delirium, Dementia Differentiation, and Polypharmacy Safety",
  tagline: "Geriatrics · Diagnostic Reasoning and Medication Safety",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian geriatrics delirium assessment principles",
      "Medication safety and deprescribing guidance for older adults",
      "Primary care cognitive impairment and caregiver-support principles",
    ],
  },
  patient: { age: 84, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Same-Day Clinic" },
  chiefComplaint: "New confusion, falls, and sleep-wake reversal after a recent medication change.",
  pmhx: [
    "Mild cognitive impairment",
    "Osteoarthritis",
    "Hypertension",
    "Recurrent urinary symptoms",
    "Chronic insomnia",
  ],
  medications: [
    { name: "Amlodipine", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Oxybutynin", dose: "5 mg", route: "PO", frequency: "BID", indication: "Urinary urgency" },
    { name: "Zopiclone", dose: "7.5 mg", route: "PO", frequency: "nightly PRN", indication: "Insomnia" },
    { name: "Tramadol/acetaminophen", dose: "37.5/325 mg", route: "PO", frequency: "up to QID PRN", indication: "Osteoarthritis pain" },
    { name: "Diphenhydramine", dose: "25 mg", route: "PO", frequency: "nightly", indication: "Sleep aid", flag: "new" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "older-adult-care",
  secondaryDomains: ["diagnostics-labs", "pharmacotherapeutics", "professional-practice"],
  difficulty: 5,
  stepCount: 3,
  estimatedMinutes: 20,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "New confusion assessment",
      scenarioText:
        "Mrs. Nguyen, 84, is brought by her daughter for 3 days of fluctuating confusion, sleep-wake reversal, two near-falls, and seeing 'children in the hallway' at night. Her daughter says this is a sudden change from baseline mild forgetfulness. She started diphenhydramine for sleep 1 week ago and has been using more tramadol for knee pain. Vitals: T 37.3°C, HR 92, BP 108/62, RR 18, SpO2 96%. She is inattentive and cannot recite months backward. No focal neurologic deficit is found.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Acute fluctuating confusion with inattention and hallucinations suggests delirium, not simple progression of dementia.",
        newFindings: ["Acute 3-day change", "Fluctuating attention", "Visual hallucinations", "Falls", "Diphenhydramine started", "More tramadol"],
      },
      vitals: [
        { label: "BP", value: "108/62", unit: "mmHg" },
        { label: "T", value: "37.3", unit: "°C" },
        { label: "SpO2", value: "96%", unit: "room air" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [{ name: "Diphenhydramine", dose: "25 mg", route: "PO", frequency: "nightly", indication: "Sleep aid", flag: "new" }],
      followUpInterval: null,
      cnpleDomain: "older-adult-care",
      question: {
        stem: "Mrs. Nguyen has acute fluctuating confusion, inattention, hallucinations, and recent anticholinergic/sedating medication exposure. What is the most appropriate NP action?",
        family: "delirium-recognition-polypharmacy",
        options: [
          { id: "A", label: "Treat this as delirium until proven otherwise: assess urgent causes, review high-risk medications, check hydration/pain/infection/metabolic triggers, evaluate falls risk, and arrange same-day workup/disposition based on safety." },
          { id: "B", label: "Diagnose dementia progression and start a cholinesterase inhibitor today." },
          { id: "C", label: "Increase zopiclone because sleep disruption is the main driver." },
          { id: "D", label: "Treat presumed UTI with antibiotics based only on confusion." },
        ],
        correctOptionId: "A",
        rationale:
          "Delirium is acute, fluctuating, and marked by inattention. It is a medical syndrome requiring prompt search for triggers such as medication toxicity, infection, dehydration, pain, constipation, urinary retention, hypoxia, metabolic abnormalities, and neurologic events. Anticholinergics like diphenhydramine and oxybutynin plus sedatives/opioids increase delirium and fall risk. Dementia progression is usually more gradual. Confusion alone should not trigger antibiotics for UTI without urinary symptoms/systemic signs or supportive testing.",
        whyWrongByOptionId: {
          B: "Dementia does not typically worsen suddenly over 3 days with fluctuating attention and hallucinations; missing delirium is unsafe.",
          C: "More sedative-hypnotic medication may worsen delirium, falls, and respiratory/CNS depression.",
          D: "Overtreating asymptomatic bacteriuria is harmful; delirium requires broad evaluation, not reflex antibiotics." 
        },
        clinicalJudgmentFocus: "Distinguishing delirium from dementia and identifying medication-induced cognitive harm.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "High-risk medications are held, same-day labs/urinalysis based on symptoms are arranged, hydration/pain/constipation are assessed, and safety planning begins." },
          B: { trajectory: "harmful", outcome: "Delirium triggers are missed and falls continue." },
          C: { trajectory: "harmful", outcome: "Sedation worsens and she falls overnight." },
          D: { trajectory: "suboptimal", outcome: "Antibiotics are prescribed unnecessarily while anticholinergic toxicity and dehydration remain unaddressed." }
        }
      }
    },
    {
      index: 1,
      heading: "Workup results and medication reconciliation",
      updateNarrative: "Same day — daughter returns with medication bottles and lab results.",
      scenarioText:
        "Labs show sodium 132 mmol/L, creatinine mildly above baseline, glucose 7.8 mmol/L, CBC without leukocytosis. Urinalysis has trace leukocytes but no nitrites; she has no dysuria, fever, flank pain, or suprapubic pain. Her daughter reveals Mrs. Nguyen also takes over-the-counter 'PM' cold medication containing diphenhydramine. She has been constipated for 5 days and drinking poorly because she is afraid of urinary accidents.",
      clinicalUpdate: {
        direction: "mixed",
        summary: "Delirium likely multifactorial: anticholinergic burden, sedatives/opioids, dehydration, mild hyponatremia, constipation, and urinary-urgency fear.",
        newFindings: ["Na 132", "Creatinine above baseline", "No urinary symptoms", "OTC diphenhydramine duplicate", "Constipation", "Poor fluid intake"],
      },
      vitals: [{ label: "Na", value: "132", unit: "mmol/L", flag: "low" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Delirium workup",
          finding: "Mild hyponatremia, mild renal decline, no leukocytosis, nonspecific urinalysis without urinary symptoms",
          values: [
            { test: "Sodium", value: "132 mmol/L", referenceRange: "135–145", flag: "L" },
            { test: "Creatinine", value: "mildly above baseline", referenceRange: "patient baseline", flag: "H" },
            { test: "WBC", value: "normal", referenceRange: "normal" },
            { test: "Urinalysis", value: "trace leukocytes, nitrite negative", referenceRange: "negative" }
          ],
          timestamp: "Same day"
        }
      ],
      medicationChanges: [],
      followUpInterval: { value: 0, unit: "days", label: "Same day" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mrs. Nguyen has delirium with anticholinergic burden, constipation, dehydration, mild hyponatremia, and no urinary symptoms. What is the safest management plan?",
        family: "delirium-deprescribing-and-trigger-management",
        options: [
          { id: "A", label: "Stop diphenhydramine/OTC sedating products, deprescribe or taper high-risk sedatives appropriately, reassess oxybutynin need, treat constipation/dehydration, avoid antibiotics without UTI symptoms, and arrange close follow-up/safety monitoring." },
          { id: "B", label: "Start antibiotics for trace leukocytes and make no medication changes." },
          { id: "C", label: "Add quetiapine nightly as first-line treatment for insomnia and hallucinations." },
          { id: "D", label: "Restrict fluids further to prevent urinary urgency." }
        ],
        correctOptionId: "A",
        rationale: "Management of delirium targets reversible causes and safety. Anticholinergic/sedating medications, constipation, dehydration, and metabolic abnormalities are modifiable contributors. Trace leukocytes without urinary symptoms are not enough to diagnose UTI in an older adult. Antipsychotics are not first-line for sleep and should be reserved for severe distress or danger after nonpharmacologic strategies and cause correction, using the lowest-risk approach.",
        whyWrongByOptionId: {
          B: "This treats a nonspecific urine finding while ignoring the strongest delirium drivers.",
          C: "Antipsychotics can worsen sedation, orthostasis, QT risk, and falls; they are not routine sleep medications.",
          D: "Fluid restriction worsens dehydration, constipation, renal function, and delirium risk."
        },
        clinicalJudgmentFocus: "Prioritizing deprescribing and reversible delirium triggers over reflex antibiotics or sedatives.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Confusion begins improving after anticholinergics are stopped, bowel regimen and hydration improve, and family supervision is arranged." },
          B: { trajectory: "harmful", outcome: "She develops antibiotic-associated diarrhea while delirium persists." },
          C: { trajectory: "harmful", outcome: "Night sedation worsens gait instability and she sustains a fall." },
          D: { trajectory: "harmful", outcome: "Dehydration worsens, sodium falls further, and confusion intensifies." }
        }
      }
    },
    {
      index: 2,
      heading: "Recovery, cognition reassessment, and caregiver plan",
      updateNarrative: "Three weeks later — follow-up after delirium resolution.",
      scenarioText:
        "Mrs. Nguyen is no longer hallucinating and attention has improved. Her daughter says she is close to baseline but still forgets appointments and repeats questions. She is worried about future independence and asks whether this means dementia. Mrs. Nguyen is embarrassed and wants all medications restarted because she dislikes urinary urgency and poor sleep. She has not fallen since medication changes and constipation treatment.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Delirium improved. Now appropriate to reassess baseline cognition, function, bladder symptoms, sleep, pain, caregiver supports, and safer alternatives.",
        newFindings: ["Attention improved", "No hallucinations", "Persistent baseline memory issues", "No further falls", "Requests old medications"],
      },
      vitals: [{ label: "BP", value: "126/70", unit: "mmHg" }],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Diphenhydramine", dose: "25 mg", route: "PO", frequency: "nightly/OTC", indication: "Sleep aid", flag: "stopped" },
        { name: "Zopiclone", dose: "7.5 mg", route: "PO", frequency: "nightly PRN", indication: "Insomnia", flag: "changed" }
      ],
      followUpInterval: { value: 3, unit: "weeks", label: "3 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "After delirium improves, what is the most appropriate long-term NP plan?",
        family: "post-delirium-cognition-and-deprescribing-followup",
        options: [
          { id: "A", label: "Document delirium recovery, reassess cognition/function after stabilization, avoid restarting high-risk anticholinergics/sedatives, offer safer bladder/sleep/pain strategies, review falls risk, and support caregiver planning." },
          { id: "B", label: "Restart diphenhydramine because it worked before and the delirium resolved." },
          { id: "C", label: "Diagnose irreversible dementia immediately and stop all chronic medications." },
          { id: "D", label: "Avoid discussing driving, finances, home safety, or caregiver strain because those are not medical issues." }
        ],
        correctOptionId: "A",
        rationale: "After delirium resolves, cognition should be reassessed when the patient is medically stable because delirium can unmask or worsen underlying cognitive impairment. Long-term care should prevent recurrence by avoiding high-risk medications, managing sleep/bladder/pain with safer approaches, reducing falls risk, and supporting caregivers. Functional topics such as driving, medication management, finances, and home safety are central to geriatric primary care.",
        whyWrongByOptionId: {
          B: "Restarting anticholinergic sleep aids recreates a major delirium and fall risk.",
          C: "Dementia diagnosis requires stable-state assessment and should not be made solely during/soon after delirium.",
          D: "Function and caregiver strain directly affect safety, adherence, and health outcomes."
        },
        clinicalJudgmentFocus: "Using a delirium episode as a trigger for safer prescribing, cognitive reassessment, and caregiver-centred planning.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "A cognitive reassessment plan, caregiver supports, bladder non-drug strategies, sleep hygiene, and falls-prevention plan reduce recurrence risk." },
          B: { trajectory: "harmful", outcome: "Confusion and falls recur within weeks after anticholinergic re-exposure." },
          C: { trajectory: "suboptimal", outcome: "The family receives premature labeling without a fair baseline cognitive assessment." },
          D: { trajectory: "suboptimal", outcome: "Medication errors and caregiver burnout develop because functional risks were not addressed." }
        }
      }
    }
  ]
};
