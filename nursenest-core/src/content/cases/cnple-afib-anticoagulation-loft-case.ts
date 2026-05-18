import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style atrial fibrillation anticoagulation case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_AFIB_ANTICOAGULATION_RISK_BENEFIT: PatientCase = {
  id: "cnple-sample-afib-anticoagulation-001",
  title: "Mr. Omar Haddad — Atrial Fibrillation Anticoagulation, Falls, and Renal Dosing",
  tagline: "Cardiovascular · Prescribing Risk-Benefit",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian Cardiovascular Society atrial fibrillation guidance",
      "Canadian medication safety principles for anticoagulation",
      "Shared decision-making and falls-risk management guidance for older adults",
    ],
  },
  patient: { age: 79, sex: "Male", pronouns: "he/him", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "New irregular heartbeat found after a fall and several weeks of fatigue.",
  pmhx: [
    "Hypertension",
    "Type 2 diabetes mellitus",
    "CKD stage G3a",
    "Osteoarthritis with two mechanical falls in the past year",
    "No prior stroke or TIA",
  ],
  medications: [
    { name: "Amlodipine", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
    { name: "Metformin XR", dose: "1000 mg", route: "PO", frequency: "daily", indication: "T2DM" },
    { name: "Ibuprofen", dose: "400 mg", route: "PO", frequency: "PRN", indication: "Osteoarthritis pain" },
    { name: "Acetaminophen", dose: "650 mg", route: "PO", frequency: "PRN", indication: "Pain" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["older-adult-care", "cardiovascular", "professional-practice"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "New atrial fibrillation and stroke-risk assessment",
      scenarioText:
        "Mr. Haddad, 79, is seen after an urgent care ECG showed atrial fibrillation with ventricular rate 92 bpm. He reports fatigue and occasional palpitations but no chest pain, syncope, focal neurologic symptoms, or dyspnea at rest. BP is 138/76, HR irregular 88–104, SpO2 97%. Recent labs: creatinine 118 µmol/L, eGFR 52 mL/min/1.73m², hemoglobin 134 g/L, platelets 230 × 10⁹/L. He is worried about anticoagulation because he fell twice last year while rushing to the bathroom at night.",
      clinicalUpdate: {
        direction: "stable",
        summary: "New nonvalvular atrial fibrillation with high stroke risk and patient concern about falls/bleeding.",
        newFindings: ["Age 79", "Hypertension", "Diabetes", "eGFR 52", "Two mechanical falls", "No active bleeding"],
      },
      vitals: [
        { label: "HR", value: "88–104", unit: "irregular bpm" },
        { label: "BP", value: "138/76", unit: "mmHg" },
        { label: "SpO2", value: "97%", unit: "room air" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Baseline anticoagulation safety labs",
          finding: "eGFR 52, hemoglobin 134, platelets 230",
          values: [
            { test: "eGFR", value: "52 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
            { test: "Hemoglobin", value: "134 g/L", referenceRange: "patient-specific" },
            { test: "Platelets", value: "230 × 10⁹/L", referenceRange: "150–400" },
          ],
          timestamp: "Today",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Haddad has new atrial fibrillation, age 79, hypertension, diabetes, CKD G3a, and two prior mechanical falls. What is the most appropriate NP approach to stroke prevention?",
        family: "afib-anticoagulation-risk-benefit-initiation",
        options: [
          { id: "A", label: "Estimate stroke and bleeding risk, discuss anticoagulation using shared decision-making, address modifiable fall/bleed risks, check renal dosing and interactions, and avoid withholding anticoagulation solely because of falls." },
          { id: "B", label: "Avoid anticoagulation because any fall history makes bleeding risk higher than stroke-prevention benefit." },
          { id: "C", label: "Use ASA instead of anticoagulation because it is safer and equally effective for atrial fibrillation stroke prevention." },
          { id: "D", label: "Start anticoagulation without discussing bleeding risk, falls prevention, renal function, or patient preference." },
        ],
        correctOptionId: "A",
        rationale: "Older age, hypertension, and diabetes make his thromboembolic risk high enough that anticoagulation should be strongly considered. Fall history matters, but mechanical falls alone usually do not outweigh stroke-prevention benefit. The NP should evaluate bleeding risk to modify factors such as NSAID use, uncontrolled BP, alcohol, renal function, and falls hazards rather than using bleeding scores to deny therapy. ASA is not an adequate substitute for anticoagulation in AF stroke prevention.",
        whyWrongByOptionId: {
          B: "Falls risk should trigger prevention strategies, not automatic anticoagulation denial.",
          C: "ASA provides substantially less stroke protection and still carries bleeding risk.",
          D: "Anticoagulation is preference-sensitive and safety-sensitive; shared decision-making and baseline risk review are required."
        },
        clinicalJudgmentFocus: "Balancing AF stroke prevention against bleeding and falls without oversimplifying either risk.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He understands his stroke risk, agrees to anticoagulation after discussing bleeding precautions, and begins a falls-prevention plan." },
          B: { trajectory: "harmful", outcome: "He remains unprotected and later has a disabling embolic stroke that might have been prevented." },
          C: { trajectory: "suboptimal", outcome: "He believes he is protected, but residual stroke risk remains high." },
          D: { trajectory: "suboptimal", outcome: "He starts therapy but is anxious, continues NSAID use, and does not know what bleeding symptoms to report." }
        }
      }
    },
    {
      index: 1,
      heading: "Anticoagulant selection and interaction safety",
      updateNarrative: "One week later — medication decision visit.",
      scenarioText:
        "Mr. Haddad returns with his daughter. He wants a once- or twice-daily medication that does not require frequent INR checks if appropriate. Weight is 74 kg. Creatinine remains 118 µmol/L and eGFR 52. He takes ibuprofen most evenings for knee pain and sometimes uses over-the-counter naproxen. BP today is 144/82. He drinks one glass of wine nightly. He asks if he can keep using NSAIDs because they are the only thing that helps his knees.",
      clinicalUpdate: {
        direction: "stable",
        summary: "DOAC may be appropriate, but NSAID exposure, BP, renal function, and bleeding education must be addressed.",
        newFindings: ["eGFR 52", "Weight 74 kg", "NSAID use", "BP 144/82", "Prefers no INR checks", "Family support present"],
      },
      vitals: [{ label: "BP", value: "144/82", unit: "mmHg", flag: "high" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "DOAC selection baseline",
          finding: "Stable renal function and weight documented for dose selection",
          values: [
            { test: "eGFR", value: "52 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
            { test: "Creatinine", value: "118 µmol/L", referenceRange: "patient-specific" },
            { test: "Weight", value: "74 kg", referenceRange: "" }
          ],
          timestamp: "1 week",
        }
      ],
      medicationChanges: [],
      followUpInterval: { value: 1, unit: "weeks", label: "1 week later" },
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Haddad is starting anticoagulation and uses NSAIDs most evenings. What prescribing-safety plan is best?",
        family: "afib-doac-selection-interaction-safety",
        options: [
          { id: "A", label: "Select an anticoagulant/dose using renal function, age, weight, indication, and interactions; stop routine NSAID use, optimize safer pain strategies, control BP, and teach bleeding/urgent-care precautions." },
          { id: "B", label: "Continue ibuprofen because NSAIDs do not affect anticoagulant bleeding risk." },
          { id: "C", label: "Choose a reduced anticoagulant dose automatically because he is older." },
          { id: "D", label: "Avoid renal monitoring once a DOAC is selected because DOACs never require lab follow-up." }
        ],
        correctOptionId: "A",
        rationale: "Anticoagulant prescribing requires correct agent and dose selection using renal function, age, weight, indication, and product-specific criteria. Routine NSAID use increases GI and other bleeding risk and should be minimized or replaced with safer pain strategies when possible. Blood pressure control and alcohol review reduce modifiable bleeding risk. DOACs require periodic renal function, hemoglobin, adherence, and interaction review even though INR monitoring is not used.",
        whyWrongByOptionId: {
          B: "NSAIDs materially increase bleeding risk when combined with anticoagulation.",
          C: "Underdosing without meeting product-specific criteria can reduce stroke protection.",
          D: "Renal function changes can require dose adjustment or agent reassessment."
        },
        clinicalJudgmentFocus: "Preventing anticoagulant harm by managing interactions, renal dosing, and modifiable bleeding risks.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He starts appropriately dosed therapy, switches away from routine NSAIDs, receives bleeding education, and has renal/hemoglobin follow-up arranged." },
          B: { trajectory: "harmful", outcome: "He develops melena after combining daily NSAIDs with anticoagulation." },
          C: { trajectory: "suboptimal", outcome: "He receives an unnecessarily low dose and remains at avoidable stroke risk." },
          D: { trajectory: "suboptimal", outcome: "Renal decline is missed months later, increasing medication risk." }
        }
      }
    },
    {
      index: 2,
      heading: "Follow-up after minor bleeding and fall-risk review",
      updateNarrative: "Six weeks later — anticoagulation follow-up.",
      scenarioText: "Mr. Haddad reports mild gum bleeding while brushing and one bruise after bumping his arm. No melena, hematuria, severe headache, neurologic symptoms, syncope, or major trauma. He stopped NSAIDs and uses acetaminophen plus physiotherapy exercises. Home BP averages 132/76. He still wakes at night to urinate and almost tripped on a loose hallway rug. Labs: hemoglobin 132 g/L, eGFR 50, platelets normal.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Minor nuisance bleeding without major bleeding features; falls-prevention and ongoing monitoring remain priorities.",
        newFindings: ["Mild gum bleeding", "No major bleeding symptoms", "NSAIDs stopped", "Nighttime toileting hazard", "eGFR 50", "Hemoglobin stable"],
      },
      vitals: [{ label: "Home BP", value: "132/76", unit: "mmHg" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Anticoagulation monitoring labs",
          finding: "Hemoglobin and renal function stable",
          values: [
            { test: "Hemoglobin", value: "132 g/L", referenceRange: "near baseline" },
            { test: "eGFR", value: "50 mL/min/1.73m²", referenceRange: ">60", flag: "L" },
            { test: "Platelets", value: "normal", referenceRange: "150–400" }
          ],
          timestamp: "6 weeks"
        }
      ],
      medicationChanges: [{ name: "Ibuprofen/naproxen", dose: "OTC", route: "PO", frequency: "PRN", indication: "Pain", flag: "stopped" }],
      followUpInterval: { value: 6, unit: "weeks", label: "6 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "Mr. Haddad has minor gum bleeding/bruising, stable hemoglobin and renal function, and ongoing fall hazards. What is the best follow-up plan?",
        family: "afib-anticoagulation-monitoring-falls-prevention",
        options: [
          { id: "A", label: "Assess bleeding severity, continue anticoagulation if no major bleeding or contraindication, reinforce red flags, review dental/oral care and adherence, continue renal/hemoglobin monitoring, and address falls hazards/nocturia." },
          { id: "B", label: "Stop anticoagulation permanently because any bleeding means therapy is unsafe." },
          { id: "C", label: "Ignore fall hazards because anticoagulation decisions are unrelated to home safety." },
          { id: "D", label: "Add ASA to improve stroke prevention because gum bleeding means anticoagulation is not enough." }
        ],
        correctOptionId: "A",
        rationale: "Minor nuisance bleeding should be assessed and managed, but it does not automatically require stopping anticoagulation when stroke risk remains high and labs are stable. Patients need clear red flags for major bleeding or head injury, adherence review, periodic renal/hemoglobin monitoring, and fall-risk mitigation. Home hazards, nocturia, footwear, vision, strength/balance, and medication contributors are all relevant to safer anticoagulation use.",
        whyWrongByOptionId: {
          B: "Stopping anticoagulation exposes him to stroke risk and is not indicated for minor bleeding alone.",
          C: "Falls prevention is central to anticoagulation safety in older adults.",
          D: "Adding ASA increases bleeding risk and is not routinely added for AF stroke prevention without another indication."
        },
        clinicalJudgmentFocus: "Managing minor bleeding while preserving stroke prevention and reducing modifiable injury risk.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He remains protected from stroke, understands major bleeding red flags, removes the hallway rug, and receives nocturia/falls assessment." },
          B: { trajectory: "harmful", outcome: "Therapy is stopped unnecessarily and he remains at high embolic stroke risk." },
          C: { trajectory: "suboptimal", outcome: "A preventable nighttime fall occurs because home risks were not addressed." },
          D: { trajectory: "harmful", outcome: "Dual antithrombotic exposure causes clinically significant bleeding without added AF benefit." }
        }
      }
    }
  ]
};
