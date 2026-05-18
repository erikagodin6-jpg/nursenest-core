import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style CKD medication safety case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_CKD_MEDICATION_SAFETY: PatientCase = {
  id: "cnple-sample-ckd-medication-safety-001",
  title: "Mrs. Priya Raman — CKD Medication Safety, Albuminuria, and Hyperkalemia Prevention",
  tagline: "Nephrology · Prescribing Safety",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian CKD primary care management principles",
      "Diabetes Canada kidney protection and medication safety guidance",
      "Medication safety guidance for NSAIDs, ACE inhibitors, SGLT2 inhibitors, metformin, and hyperkalemia risk",
    ],
  },
  patient: { age: 71, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "Worsening kidney function on routine labs after several weeks of back pain medication use.",
  pmhx: [
    "Type 2 diabetes mellitus",
    "CKD stage G3b with albuminuria",
    "Hypertension",
    "Osteoarthritis and chronic low back pain",
    "Heart failure with preserved ejection fraction",
  ],
  medications: [
    { name: "Metformin XR", dose: "1000 mg", route: "PO", frequency: "daily", indication: "T2DM" },
    { name: "Empagliflozin", dose: "10 mg", route: "PO", frequency: "daily", indication: "T2DM / kidney-cardiovascular protection" },
    { name: "Ramipril", dose: "10 mg", route: "PO", frequency: "daily", indication: "Albuminuria / hypertension" },
    { name: "Hydrochlorothiazide", dose: "25 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Ibuprofen", dose: "400 mg", route: "PO", frequency: "TID PRN", indication: "Back pain", flag: "new" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["diagnostics-labs", "older-adult-care", "health-promotion-prevention"],
  difficulty: 5,
  stepCount: 3,
  estimatedMinutes: 20,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Routine CKD lab deterioration",
      scenarioText:
        "Mrs. Raman, 71, attends for routine diabetes/CKD follow-up. She feels more tired and has been taking ibuprofen three times daily for 3 weeks after a back strain. She reports reduced fluid intake because she has been busy caring for her spouse. Labs today: creatinine 178 µmol/L, eGFR 28 mL/min/1.73m², potassium 5.2 mmol/L, urine ACR 48 mg/mmol. Three months ago eGFR was 38 and potassium was 4.6. BP is 118/68. She denies chest pain, severe dyspnea, oliguria, fever, dysuria, flank pain, or vomiting.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "CKD with acute-on-chronic renal decline, mild hyperkalemia, albuminuria, NSAID exposure, ACE inhibitor, SGLT2 inhibitor, and lower intake.",
        newFindings: ["eGFR fell 38 to 28", "K 5.2", "ACR 48", "Regular ibuprofen", "Ramipril use", "Reduced intake"],
      },
      vitals: [{ label: "BP", value: "118/68", unit: "mmHg" }, { label: "eGFR", value: "28", unit: "mL/min/1.73m²", flag: "low" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "CKD safety labs",
          finding: "Acute-on-chronic renal decline with mild hyperkalemia and persistent albuminuria",
          values: [
            { test: "Creatinine", value: "178 µmol/L", referenceRange: "baseline lower", flag: "H" },
            { test: "eGFR", value: "28 mL/min/1.73m²", referenceRange: "previous 38", flag: "L" },
            { test: "Potassium", value: "5.2 mmol/L", referenceRange: "3.5–5.0", flag: "H" },
            { test: "Urine ACR", value: "48 mg/mmol", referenceRange: "<3", flag: "H" }
          ],
          timestamp: "Today"
        }
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mrs. Raman has CKD G3b with a recent eGFR drop, potassium 5.2, albuminuria, ramipril, empagliflozin, and regular ibuprofen use. What is the safest NP action now?",
        family: "ckd-acute-decline-medication-safety",
        options: [
          { id: "A", label: "Stop NSAID use, assess volume status and reversible AKI contributors, review sick-day medication guidance, repeat renal/electrolyte labs promptly, manage potassium contributors, and coordinate escalation if renal function or potassium worsens." },
          { id: "B", label: "Stop ramipril permanently because ACE inhibitors are always harmful when eGFR is below 30." },
          { id: "C", label: "Reassure her because eGFR decline is expected with aging and does not require medication review." },
          { id: "D", label: "Increase ibuprofen because uncontrolled pain can worsen blood pressure." }
        ],
        correctOptionId: "A",
        rationale: "The pattern suggests potentially reversible acute-on-chronic kidney injury from NSAID exposure, lower intake, diuretic/ACE inhibitor/SGLT2 context, and CKD vulnerability. NSAIDs should be stopped. ACE inhibitors can be kidney-protective in albuminuric CKD and are not automatically stopped permanently, but they require reassessment if potassium rises, creatinine increases substantially, hypotension occurs, or acute illness/volume depletion is present. Prompt repeat labs and potassium management are necessary.",
        whyWrongByOptionId: {
          B: "ACE inhibitors can reduce albuminuria and slow CKD progression; decisions should be based on potassium, renal trajectory, BP, volume status, and clinical context.",
          C: "A 10-point eGFR drop with NSAID exposure and hyperkalemia needs active safety management.",
          D: "NSAIDs can worsen renal perfusion, fluid retention, blood pressure, and hyperkalemia risk in CKD."
        },
        clinicalJudgmentFocus: "Identifying medication-induced kidney risk while preserving kidney-protective therapy when safe.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Ibuprofen is stopped, hydration and medication safety are addressed, labs are repeated, and kidney function partially recovers." },
          B: { trajectory: "suboptimal", outcome: "Ramipril is stopped unnecessarily long-term and albuminuria worsens." },
          C: { trajectory: "harmful", outcome: "NSAID use continues and potassium rises further." },
          D: { trajectory: "harmful", outcome: "Renal function deteriorates and she requires urgent assessment for AKI and hyperkalemia." }
        }
      }
    },
    {
      index: 1,
      heading: "Repeat labs and hyperkalemia prevention",
      updateNarrative: "One week later — repeat labs after stopping NSAID.",
      scenarioText:
        "Mrs. Raman stopped ibuprofen and increased oral intake. Back pain persists but is manageable with heat and acetaminophen. Repeat labs show creatinine 154 µmol/L, eGFR 33, potassium 5.0, bicarbonate 22, ACR still 45 mg/mmol. She reveals she uses a potassium-containing salt substitute because she was told to reduce sodium. BP is 124/72. She asks if she should stop all kidney medications whenever a lab is abnormal.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Renal function improved after NSAID removal, but persistent albuminuria and borderline potassium require long-term safety planning.",
        newFindings: ["eGFR improved to 33", "K 5.0", "ACR 45", "Potassium salt substitute", "BP 124/72"],
      },
      vitals: [{ label: "BP", value: "124/72", unit: "mmHg" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Repeat CKD labs",
          finding: "Partial recovery of kidney function with persistent albuminuria and borderline potassium",
          values: [
            { test: "eGFR", value: "33 mL/min/1.73m²", referenceRange: "previous 28", flag: "L" },
            { test: "Potassium", value: "5.0 mmol/L", referenceRange: "3.5–5.0" },
            { test: "Urine ACR", value: "45 mg/mmol", referenceRange: "<3", flag: "H" },
            { test: "Bicarbonate", value: "22 mmol/L", referenceRange: "22–29" }
          ],
          timestamp: "1 week"
        }
      ],
      medicationChanges: [{ name: "Ibuprofen", dose: "400 mg", route: "PO", frequency: "TID PRN", indication: "Back pain", flag: "stopped" }],
      followUpInterval: { value: 1, unit: "weeks", label: "1 week later" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "Kidney function improved after stopping NSAIDs, but albuminuria persists and potassium remains borderline with salt-substitute use. What is the best long-term medication safety plan?",
        family: "ckd-albuminuria-hyperkalemia-prevention",
        options: [
          { id: "A", label: "Continue kidney-protective therapy if safe, stop potassium salt substitute, teach sick-day rules for dehydration/illness, avoid NSAIDs, monitor eGFR/potassium/ACR, and individualize nephrology referral based on trajectory and risk." },
          { id: "B", label: "Stop SGLT2 inhibitor and ACE inhibitor permanently because eGFR is below normal." },
          { id: "C", label: "Ignore albuminuria because eGFR is the only CKD marker that matters." },
          { id: "D", label: "Encourage potassium salt substitute because it is always safer than sodium." }
        ],
        correctOptionId: "A",
        rationale: "Albuminuria is an important CKD progression and cardiovascular risk marker. ACE inhibitor/ARB therapy and SGLT2 inhibitors are often kidney/cardiovascular protective when used safely within renal and clinical parameters. Potassium-containing salt substitutes can worsen hyperkalemia risk, especially with ACE inhibitors/ARBs and CKD. Sick-day rules help prevent AKI during dehydration or acute illness. Ongoing monitoring and referral decisions should consider eGFR, albuminuria, potassium, rate of decline, resistant hypertension, and complications.",
        whyWrongByOptionId: {
          B: "Kidney-protective drugs should not be stopped solely because eGFR is reduced; thresholds and safety context matter.",
          C: "Albuminuria independently predicts kidney and cardiovascular risk and guides therapy intensity.",
          D: "Potassium salt substitutes can be dangerous in CKD and RAAS blockade."
        },
        clinicalJudgmentFocus: "Balancing kidney protection with hyperkalemia prevention and patient-friendly sick-day rules.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "She avoids NSAIDs and potassium salt substitute, understands sick-day holds, and kidney function stabilizes with monitored protective therapy." },
          B: { trajectory: "suboptimal", outcome: "Albuminuria worsens after protective medications are stopped without a safety indication." },
          C: { trajectory: "suboptimal", outcome: "Progression risk is underestimated and prevention opportunities are missed." },
          D: { trajectory: "harmful", outcome: "Potassium rises to 5.8 during a minor illness, requiring urgent management." }
        }
      }
    },
    {
      index: 2,
      heading: "CKD progression planning and pain-management alternatives",
      updateNarrative: "Three months later — chronic CKD follow-up.",
      scenarioText:
        "Mrs. Raman has stable eGFR 34 and potassium 4.8. ACR remains elevated at 42 mg/mmol. She has avoided NSAIDs but reports worse knee and back pain limiting walking. She is afraid that all pain treatments will damage her kidneys. Her BP average is 126/74. She has not had recent medication reconciliation with pharmacy or nephrology input. She wants a clear plan for pain flares and when to seek urgent care for kidney issues.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Stable CKD after reversible insult removed; persistent albuminuria and pain barriers require chronic care planning.",
        newFindings: ["eGFR 34 stable", "K 4.8", "ACR 42", "Pain limits activity", "NSAIDs avoided", "Needs flare plan"],
      },
      vitals: [{ label: "BP average", value: "126/74", unit: "mmHg" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "CKD follow-up labs",
          finding: "Stable eGFR and potassium with persistent albuminuria",
          values: [
            { test: "eGFR", value: "34 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
            { test: "Potassium", value: "4.8 mmol/L", referenceRange: "3.5–5.0" },
            { test: "Urine ACR", value: "42 mg/mmol", referenceRange: "<3", flag: "H" }
          ],
          timestamp: "3 months"
        }
      ],
      medicationChanges: [],
      followUpInterval: { value: 3, unit: "months", label: "3 months later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At stable CKD follow-up, what plan best supports kidney protection while addressing chronic pain and escalation safety?",
        family: "ckd-chronic-management-pain-and-referral",
        options: [
          { id: "A", label: "Create a CKD action plan: avoid NSAIDs, use safer multimodal pain strategies, monitor eGFR/potassium/ACR, reconcile doses with pharmacy, review nephrology referral criteria, optimize BP/diabetes/kidney-protective therapy, and teach urgent red flags." },
          { id: "B", label: "Tell her to avoid all pain treatment because CKD makes analgesia unsafe." },
          { id: "C", label: "Use OTC NSAIDs only during severe pain flares because short courses cannot affect CKD." },
          { id: "D", label: "Stop monitoring ACR because it has stayed elevated and cannot be changed." }
        ],
        correctOptionId: "A",
        rationale: "CKD care is longitudinal and risk-based. Pain undertreatment can worsen mobility, frailty, mood, and diabetes control, so safer multimodal options should be used instead of reflex NSAID avoidance without alternatives. Medication doses and interactions require periodic review as kidney function changes. Persistent albuminuria guides therapy and referral risk. Urgent red flags include low urine output, severe dehydration/vomiting, chest pain, dyspnea, confusion, severe weakness, palpitations, or suspected hyperkalemia symptoms.",
        whyWrongByOptionId: {
          B: "Avoiding all pain treatment can harm function and quality of life; the goal is safer pain management.",
          C: "Even short NSAID courses can precipitate AKI or hyperkalemia in vulnerable CKD patients.",
          D: "Persistent albuminuria remains clinically meaningful and should be trended."
        },
        clinicalJudgmentFocus: "Building a realistic CKD prevention plan that integrates medication safety, pain, monitoring, and referral thresholds.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "She receives a clear flare plan, maintains mobility with safer therapies, and has scheduled kidney monitoring and referral thresholds documented." },
          B: { trajectory: "suboptimal", outcome: "Pain worsens, activity declines, and diabetes/BP self-management deteriorates." },
          C: { trajectory: "harmful", outcome: "A later NSAID flare course triggers recurrent AKI and potassium elevation." },
          D: { trajectory: "suboptimal", outcome: "Progression risk is missed because albuminuria is no longer tracked." }
        }
      }
    }
  ]
};
