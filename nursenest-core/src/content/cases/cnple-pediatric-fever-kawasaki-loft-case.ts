import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style pediatric fever case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_PEDIATRIC_FEVER_KAWASAKI: PatientCase = {
  id: "cnple-sample-pediatric-fever-kawasaki-001",
  title: "Ava Thompson — Persistent Pediatric Fever and Kawasaki Disease Recognition",
  tagline: "Pediatrics · Diagnostic Reasoning",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian Paediatric Society fever and Kawasaki disease practice guidance",
      "Pediatric urgent care red-flag assessment principles",
      "Canadian pediatric inflammatory syndrome differential diagnosis guidance",
    ],
  },
  patient: { age: 4, sex: "Female", pronouns: "she/her", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "Fever for 5 days with rash, red eyes, and irritability.",
  pmhx: ["Previously healthy", "Immunizations up to date", "No known cardiac history", "No recent travel"],
  medications: [
    { name: "Acetaminophen", dose: "weight-based", route: "PO", frequency: "PRN", indication: "Fever" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "pediatrics",
  secondaryDomains: ["diagnostics-labs", "acute-urgent-care", "professional-practice"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Persistent fever assessment",
      scenarioText:
        "Ava, 4, is brought by her father for fever that has persisted for 5 days despite acetaminophen. She is irritable and less interested in food but drinking small amounts. Vitals: T 39.2°C, HR 138, RR 24, SpO2 98%, BP 92/58. Exam: bilateral non-purulent conjunctival injection, cracked red lips, strawberry tongue, diffuse polymorphous trunk rash, swollen hands, and one 2 cm tender left cervical lymph node. No cough, no meningismus, no focal lung findings. Rapid strep yesterday was negative.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Five days of fever plus mucocutaneous findings strongly suggests Kawasaki disease and requires same-day pediatric assessment.",
        newFindings: ["Fever 5 days", "Non-purulent conjunctivitis", "Cracked lips/strawberry tongue", "Polymorphous rash", "Swollen hands", "Cervical lymphadenopathy"],
      },
      vitals: [
        { label: "T", value: "39.2", unit: "°C", flag: "high" },
        { label: "HR", value: "138", unit: "bpm", flag: "high" },
        { label: "SpO2", value: "98%", unit: "room air" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pediatrics",
      question: {
        stem: "Ava has fever for 5 days with conjunctival injection, oral mucosal changes, rash, swollen hands, and cervical lymphadenopathy. What is the most appropriate NP action?",
        family: "pediatric-fever-kawasaki-recognition",
        options: [
          { id: "A", label: "Arrange same-day pediatric/ED assessment for suspected Kawasaki disease, inflammatory labs, echocardiography planning, and IVIG consideration." },
          { id: "B", label: "Treat as viral exanthem and reassess in 72 hours if fever persists." },
          { id: "C", label: "Start amoxicillin for scarlet fever despite negative rapid strep and no pharyngitis." },
          { id: "D", label: "Give antihistamine for rash and reassure that conjunctivitis explains the fever." },
        ],
        correctOptionId: "A",
        rationale:
          "Fever for at least 5 days with classic mucocutaneous features is Kawasaki disease until proven otherwise. The NP priority is same-day escalation for pediatric assessment, inflammatory markers, CBC, liver enzymes, urinalysis, cardiac evaluation planning, and treatment decisions such as IVIG and ASA under specialist direction. Delayed recognition increases coronary artery aneurysm risk. A negative rapid strep and absence of pharyngitis make scarlet fever less likely, and viral exanthem should not be assumed when multiple Kawasaki criteria are present.",
        whyWrongByOptionId: {
          B: "Waiting 72 hours risks delayed IVIG beyond the optimal treatment window and increases coronary complication risk.",
          C: "Scarlet fever does not explain the full constellation of bilateral non-purulent conjunctivitis, extremity swelling, and persistent fever.",
          D: "Rash and conjunctivitis are not isolated benign findings here; they are part of a systemic vasculitis pattern.",
        },
        clinicalJudgmentFocus: "Recognising Kawasaki disease early enough to prevent coronary complications.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Ava is sent for urgent pediatric assessment. Labs show high CRP/ESR and thrombocytosis trend. Echocardiography is arranged and IVIG is started within the treatment window." },
          B: { trajectory: "harmful", outcome: "Fever continues. She presents later with periungual peeling and coronary changes on echocardiogram." },
          C: { trajectory: "harmful", outcome: "Antibiotics delay correct diagnosis. Fever persists and cardiac evaluation is not arranged." },
          D: { trajectory: "harmful", outcome: "Symptoms are minimized and the family returns when Ava is more lethargic and dehydrated." },
        },
      },
    },
    {
      index: 1,
      heading: "Inflammatory labs and differential diagnosis",
      updateNarrative: "Same day — pediatric assessment update.",
      scenarioText:
        "The pediatric team calls with initial results. CRP 116 mg/L, ESR 72 mm/hr, WBC 16.8 × 10⁹/L, hemoglobin 101 g/L, platelets 465 × 10⁹/L, ALT mildly elevated, albumin low-normal, sterile pyuria on urinalysis. SARS-CoV-2 PCR is negative. Ava has no shock, no severe abdominal pain, and no myocardial dysfunction on initial assessment. Her father asks whether this could be MIS-C because he read about it online.",
      clinicalUpdate: {
        direction: "critical",
        summary: "Inflammatory pattern supports Kawasaki disease. MIS-C remains a differential but shock, GI-predominant illness, and myocardial dysfunction are not prominent here.",
        newFindings: ["CRP 116", "ESR 72", "Platelets 465", "Sterile pyuria", "No shock", "No myocardial dysfunction"],
      },
      vitals: [{ label: "T", value: "38.9", unit: "°C", flag: "high" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Inflammatory workup",
          finding: "CRP/ESR elevated, leukocytosis, thrombocytosis trend, mild ALT elevation, sterile pyuria",
          values: [
            { test: "CRP", value: "116 mg/L", referenceRange: "<5", flag: "H" },
            { test: "ESR", value: "72 mm/hr", referenceRange: "<20", flag: "H" },
            { test: "Platelets", value: "465 × 10⁹/L", referenceRange: "150–400", flag: "H" },
            { test: "Urinalysis", value: "Sterile pyuria", referenceRange: "None", flag: "H" },
          ],
          timestamp: "Same day",
        },
      ],
      medicationChanges: [],
      followUpInterval: { value: 0, unit: "days", label: "Same day" },
      cnpleDomain: "diagnostics-labs",
      question: {
        stem: "Based on the inflammatory labs and clinical pattern, what explanation should the NP provide to the family while supporting the pediatric plan?",
        family: "pediatric-inflammatory-differential",
        options: [
          { id: "A", label: "Kawasaki disease remains the leading concern; MIS-C is considered, but her classic mucocutaneous findings and absence of shock/myocardial dysfunction support Kawasaki-directed management." },
          { id: "B", label: "MIS-C is impossible because the PCR is negative." },
          { id: "C", label: "The elevated platelets rule out inflammatory disease and suggest dehydration only." },
          { id: "D", label: "Sterile pyuria confirms UTI, so IVIG is unnecessary." },
        ],
        correctOptionId: "A",
        rationale:
          "Kawasaki disease and MIS-C can overlap. A negative PCR does not fully exclude prior SARS-CoV-2 related illness, but Ava's age, classic mucocutaneous criteria, sterile pyuria, thrombocytosis trend, and absence of shock or myocardial dysfunction fit Kawasaki disease strongly. The NP should communicate uncertainty accurately, avoid dismissing parental concerns, and reinforce urgent pediatric treatment to reduce coronary risk.",
        whyWrongByOptionId: {
          B: "MIS-C can follow prior infection and may not require positive PCR at presentation; serology/exposure history may matter.",
          C: "Thrombocytosis can occur in Kawasaki disease and does not reduce concern for systemic inflammation.",
          D: "Sterile pyuria is a recognized supportive finding in Kawasaki disease; it does not confirm bacterial UTI without bacteriuria/culture support.",
        },
        clinicalJudgmentFocus: "Explaining overlapping pediatric inflammatory syndromes without delaying indicated Kawasaki treatment.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "The family understands why urgent Kawasaki treatment is proceeding while the team continues to evaluate the differential." },
          B: { trajectory: "suboptimal", outcome: "The family receives oversimplified information and loses trust when additional SARS-CoV-2 history is later reviewed." },
          C: { trajectory: "harmful", outcome: "Inflammation is minimized and treatment urgency is misunderstood." },
          D: { trajectory: "harmful", outcome: "The focus shifts incorrectly to UTI, risking delayed IVIG and cardiac monitoring." },
        },
      },
    },
    {
      index: 2,
      heading: "Post-discharge follow-up and cardiac safety netting",
      updateNarrative: "Ten days later — primary care follow-up after pediatric admission.",
      scenarioText:
        "Ava received IVIG and ASA in hospital and was discharged after fever resolved. Initial echocardiogram showed no coronary aneurysm. She is now afebrile and eating better. Her fingertips are beginning to peel. Her father asks whether the normal echocardiogram means she can stop follow-up and return to all activities immediately.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Clinical recovery after Kawasaki treatment. Needs cardiology follow-up, medication safety counselling, and recurrence/fever safety netting.",
        newFindings: ["Afebrile", "Peeling fingertips", "Initial echo normal", "Post-IVIG", "On ASA plan"],
      },
      vitals: [{ label: "T", value: "36.8", unit: "°C" }, { label: "HR", value: "96", unit: "bpm" }],
      diagnosticArtifacts: [
        { type: "imaging", name: "Initial echocardiogram", finding: "No coronary aneurysm on initial study", values: [], timestamp: "Admission" },
      ],
      medicationChanges: [{ name: "ASA", dose: "specialist-directed", route: "PO", frequency: "per discharge plan", indication: "Kawasaki disease post-treatment", flag: "new" }],
      followUpInterval: { value: 10, unit: "days", label: "10 days later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "What follow-up teaching is most appropriate after hospital treatment for Kawasaki disease with an initially normal echocardiogram?",
        family: "kawasaki-follow-up-safety-netting",
        options: [
          { id: "A", label: "Continue cardiology-directed follow-up echocardiography, follow ASA instructions, avoid live vaccines for the recommended interval after IVIG, and seek care urgently for recurrent fever or cardiac symptoms." },
          { id: "B", label: "Stop all follow-up because the first echocardiogram was normal." },
          { id: "C", label: "Stop ASA immediately because peeling fingertips means the disease has resolved." },
          { id: "D", label: "Give varicella/MMR vaccine today because IVIG improves vaccine response." },
        ],
        correctOptionId: "A",
        rationale:
          "A normal initial echocardiogram is reassuring but does not eliminate the need for scheduled cardiac follow-up because coronary changes can evolve after the acute presentation. Families need clear instructions about cardiology appointments, ASA use and bleeding/Reye syndrome precautions, fever recurrence, activity guidance from cardiology, and vaccine timing after IVIG. Live vaccines such as MMR/varicella are commonly deferred after IVIG because passive antibodies can reduce vaccine effectiveness.",
        whyWrongByOptionId: {
          B: "Coronary artery changes may appear later, so follow-up imaging remains important.",
          C: "Peeling is part of the disease course and does not mean specialist-directed ASA can be stopped independently.",
          D: "IVIG can interfere with live vaccine response; timing should follow immunization guidance and specialist/public health advice.",
        },
        clinicalJudgmentFocus: "Preventing post-discharge gaps after a high-risk pediatric inflammatory illness.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Ava attends repeat echocardiography and remains well. The family understands medication safety and vaccine timing." },
          B: { trajectory: "harmful", outcome: "Follow-up is missed and a later coronary dilation is not detected promptly." },
          C: { trajectory: "suboptimal", outcome: "Medication is stopped without cardiology direction, creating preventable risk and confusion." },
          D: { trajectory: "suboptimal", outcome: "Live vaccine is given too soon after IVIG and may need repeat dosing later." },
        },
      },
    },
  ],
};
