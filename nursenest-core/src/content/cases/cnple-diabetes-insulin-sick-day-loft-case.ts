import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style diabetes pharmacotherapy case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_DIABETES_INSULIN_SICK_DAY_MANAGEMENT: PatientCase = {
  id: "cnple-sample-diabetes-insulin-sick-day-001",
  title: "Mr. Harjit Singh — Diabetes Insulin Adjustment and Sick-Day Safety",
  tagline: "Endocrine · Pharmacotherapy Safety",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Diabetes Canada pharmacotherapy and sick-day guidance",
      "Canadian primary care diabetes management principles",
      "Medication safety guidance for insulin, SGLT2 inhibitors, metformin, and CKD",
    ],
  },
  patient: { age: 63, sex: "Male", pronouns: "he/him", setting: "NP-Led Primary Care Clinic" },
  chiefComplaint: "High home glucose readings, nausea, poor intake, and uncertainty about whether to take insulin while sick.",
  pmhx: [
    "Type 2 diabetes mellitus for 16 years",
    "CKD stage G3a",
    "Hypertension",
    "Dyslipidemia",
    "Prior hypoglycemia when meals were skipped",
  ],
  medications: [
    { name: "Insulin glargine", dose: "34 units", route: "subcutaneous", frequency: "nightly", indication: "Basal insulin for T2DM" },
    { name: "Insulin lispro", dose: "8 units", route: "subcutaneous", frequency: "with meals", indication: "Prandial insulin" },
    { name: "Metformin XR", dose: "1000 mg", route: "PO", frequency: "daily", indication: "T2DM" },
    { name: "Empagliflozin", dose: "10 mg", route: "PO", frequency: "daily", indication: "T2DM / kidney-cardiovascular protection" },
    { name: "Ramipril", dose: "10 mg", route: "PO", frequency: "daily", indication: "Hypertension / renal protection" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "pharmacotherapeutics",
  secondaryDomains: ["diagnostics-labs", "acute-urgent-care", "health-promotion-prevention"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 19,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Sick-day triage and medication safety",
      scenarioText:
        "Mr. Singh, 63, calls the clinic after 24 hours of vomiting, poor oral intake, thirst, and home glucose readings between 17 and 21 mmol/L. He skipped his glargine last night because he was not eating and is unsure whether to keep taking empagliflozin and metformin. He denies chest pain but feels weak. Home BP is 104/66. He has not checked ketones. His last eGFR was 48 mL/min/1.73m².",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Intercurrent illness with hyperglycemia, dehydration risk, skipped basal insulin, and SGLT2/metformin safety concerns.",
        newFindings: ["Vomiting", "Poor intake", "Glucose 17–21 mmol/L", "Skipped basal insulin", "SGLT2 inhibitor use", "No ketone check"],
      },
      vitals: [{ label: "Home BP", value: "104/66", unit: "mmHg" }, { label: "Glucose", value: "17–21", unit: "mmol/L", flag: "high" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Recent renal baseline",
          finding: "eGFR 48 mL/min/1.73m²",
          values: [{ test: "eGFR", value: "48 mL/min/1.73m²", referenceRange: ">60", flag: "L" }],
          timestamp: "Recent baseline",
        },
      ],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pharmacotherapeutics",
      question: {
        stem: "Mr. Singh has vomiting, poor intake, hyperglycemia, skipped basal insulin, and is taking empagliflozin and metformin. What is the safest NP advice and triage plan?",
        family: "diabetes-sick-day-medication-safety",
        options: [
          { id: "A", label: "Assess urgently today; check ketones, hydration, renal function/electrolytes if indicated; continue basal insulin with guidance; hold SGLT2 inhibitor and metformin during dehydration/vomiting; give clear ED precautions." },
          { id: "B", label: "Stop all insulin until eating normally to prevent hypoglycemia." },
          { id: "C", label: "Continue empagliflozin because glucose is high and it will lower sugar during illness." },
          { id: "D", label: "Reassure him that hyperglycemia during illness is expected and book routine follow-up in 2 weeks." },
        ],
        correctOptionId: "A",
        rationale:
          "Sick-day diabetes care must prevent both hypoglycemia and metabolic decompensation. Basal insulin is usually continued even with reduced intake because stopping it can worsen hyperglycemia and ketosis risk. SGLT2 inhibitors should be held during acute illness with vomiting/dehydration because of euglycemic DKA risk, and metformin is commonly held during dehydration/acute kidney injury risk to reduce lactic acidosis risk. Persistent vomiting, weakness, hyperglycemia, inability to hydrate, ketones, confusion, chest pain, or worsening hypotension should trigger ED assessment.",
        whyWrongByOptionId: {
          B: "Stopping all insulin can precipitate severe hyperglycemia and ketosis; prandial insulin may need adjustment, but basal insulin generally continues with monitoring.",
          C: "SGLT2 inhibitors increase dehydration and ketoacidosis risk during acute illness and should be held until well and eating/drinking normally.",
          D: "Vomiting plus hyperglycemia and medication safety concerns require same-day triage, not delayed routine follow-up.",
        },
        clinicalJudgmentFocus: "Applying sick-day medication rules without stopping life-sustaining basal insulin.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He is assessed same day, ketones are checked, SGLT2/metformin are held temporarily, basal insulin is continued with monitoring, and dehydration is treated early." },
          B: { trajectory: "harmful", outcome: "He stops insulin completely and presents later with worsening hyperglycemia and positive ketones." },
          C: { trajectory: "harmful", outcome: "He continues empagliflozin while vomiting and develops worsening dehydration with ketoacidosis risk." },
          D: { trajectory: "harmful", outcome: "Symptoms progress overnight and he requires ED care for dehydration and metabolic instability." },
        },
      },
    },
    {
      index: 1,
      heading: "Same-day assessment and insulin correction plan",
      updateNarrative: "Same day — in-clinic assessment.",
      scenarioText:
        "Mr. Singh arrives in clinic with his daughter. He is alert, dry-mouthed, and mildly orthostatic. Vitals: BP 112/70 sitting, 96/60 standing, HR 104, RR 20, T 37.4°C, SpO2 97%. Capillary glucose is 19.4 mmol/L. Blood ketones are 0.4 mmol/L. He can tolerate small sips of oral fluids. No abdominal pain or Kussmaul breathing. He took no rapid-acting insulin today because he did not eat breakfast.",
      clinicalUpdate: {
        direction: "mixed",
        summary: "Hyperglycemia and dehydration risk without current ketosis. Needs correction guidance, oral hydration plan, and close reassessment.",
        newFindings: ["Glucose 19.4", "Ketones 0.4", "Orthostatic BP", "Tolerates sips", "No Kussmaul breathing", "Skipped rapid insulin"],
      },
      vitals: [
        { label: "Glucose", value: "19.4", unit: "mmol/L", flag: "high" },
        { label: "Ketones", value: "0.4", unit: "mmol/L" },
        { label: "Standing BP", value: "96/60", unit: "mmHg", flag: "low" },
      ],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Point-of-care metabolic check",
          finding: "Hyperglycemia without significant ketonemia",
          values: [
            { test: "Capillary glucose", value: "19.4 mmol/L", referenceRange: "individualized target", flag: "H" },
            { test: "Blood ketones", value: "0.4 mmol/L", referenceRange: "<0.6", flag: "" },
          ],
          timestamp: "Same day",
        },
      ],
      medicationChanges: [
        { name: "Empagliflozin", dose: "10 mg", route: "PO", frequency: "daily", indication: "T2DM", flag: "held" },
        { name: "Metformin XR", dose: "1000 mg", route: "PO", frequency: "daily", indication: "T2DM", flag: "held" },
      ],
      followUpInterval: { value: 0, unit: "days", label: "Same day" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mr. Singh has glucose 19.4 mmol/L, ketones 0.4 mmol/L, mild orthostasis, and can tolerate oral fluids. What plan is most appropriate if he remains clinically stable?",
        family: "diabetes-hyperglycemia-correction-and-monitoring",
        options: [
          { id: "A", label: "Use his individualized correction insulin plan or arrange prescriber-guided correction, continue basal insulin, encourage small frequent carbohydrate-containing fluids as tolerated, monitor glucose/ketones, and reassess within 24 hours or sooner if red flags develop." },
          { id: "B", label: "Give no insulin until he resumes full meals because any rapid insulin without food is dangerous." },
          { id: "C", label: "Restart empagliflozin immediately because ketones are normal." },
          { id: "D", label: "Send him home with advice to drink only water and avoid carbohydrates until glucose normalizes." },
        ],
        correctOptionId: "A",
        rationale:
          "When ketones are not elevated and the patient can hydrate, outpatient management may be reasonable with close follow-up, correction insulin guidance, continued basal insulin, temporary holding of dehydration-risk medications, and clear ED criteria. Rapid-acting insulin can be used for correction even if meal dosing is held or adjusted, but it should follow an individualized plan to reduce hypoglycemia risk. Complete carbohydrate avoidance during illness can worsen weakness and makes insulin use harder; small carbohydrate-containing fluids may be needed when intake is reduced.",
        whyWrongByOptionId: {
          B: "Meal bolus may be adjusted if not eating, but correction insulin may still be needed for significant hyperglycemia.",
          C: "Normal ketones now do not remove SGLT2 sick-day risk while vomiting and dehydrated.",
          D: "Carbohydrate-free hydration is not always appropriate during illness, especially when insulin is required and oral intake is poor.",
        },
        clinicalJudgmentFocus: "Separating meal insulin, correction insulin, basal insulin, hydration, and ketone monitoring during illness.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Glucose trends down, ketones remain negative, and he avoids ED transfer while being reassessed the next day." },
          B: { trajectory: "harmful", outcome: "Hyperglycemia persists and ketones rise because correction insulin was omitted." },
          C: { trajectory: "harmful", outcome: "SGLT2 inhibitor is restarted too early and dehydration worsens." },
          D: { trajectory: "suboptimal", outcome: "He becomes weaker, intake remains poor, and insulin adjustment becomes unsafe." },
        },
      },
    },
    {
      index: 2,
      heading: "Recovery visit and prevention plan",
      updateNarrative: "One week later — recovered from gastroenteritis.",
      scenarioText:
        "Mr. Singh is eating normally again. Vomiting resolved 4 days ago. Glucose readings are back to 6.8–10.2 mmol/L. Repeat creatinine is near baseline and eGFR is 47. He asks when to restart metformin and empagliflozin and admits he has never had a written sick-day plan. His daughter says the family was frightened because they did not know which diabetes medications were dangerous to stop or continue.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Recovered illness with need for medication restart plan, written sick-day instructions, and family teach-back.",
        newFindings: ["Eating normally", "eGFR 47", "Glucose back near target", "No written sick-day plan", "Family uncertainty"],
      },
      vitals: [{ label: "Glucose", value: "6.8–10.2", unit: "mmol/L" }, { label: "eGFR", value: "47", unit: "mL/min/1.73m²", flag: "low" }],
      diagnosticArtifacts: [
        {
          type: "lab_panel",
          name: "Recovery renal check",
          finding: "Renal function near baseline after acute illness",
          values: [
            { test: "eGFR", value: "47 mL/min/1.73m²", referenceRange: "baseline 48", flag: "L" },
            { test: "Creatinine", value: "near baseline", referenceRange: "patient baseline" },
          ],
          timestamp: "1 week",
        },
      ],
      medicationChanges: [],
      followUpInterval: { value: 1, unit: "weeks", label: "1 week later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At recovery follow-up, what education and medication plan is most appropriate?",
        family: "diabetes-sick-day-prevention-teachback",
        options: [
          { id: "A", label: "Restart held medications when eating/drinking normally and renal function is stable as appropriate; provide written sick-day rules, ketone/glucose monitoring thresholds, insulin guidance, and family teach-back." },
          { id: "B", label: "Permanently stop empagliflozin and metformin because they were held during illness." },
          { id: "C", label: "Tell him to stop basal insulin during all future illnesses if he is not eating." },
          { id: "D", label: "Avoid involving family because medication teaching should only be directed to the patient." },
        ],
        correctOptionId: "A",
        rationale:
          "Held medications can often be restarted after recovery when oral intake and hydration normalize and renal function is stable, but this should be individualized. The key prevention intervention is a written sick-day plan: which medications to hold, which insulin to continue or adjust, how often to check glucose and ketones, hydration/carbohydrate guidance, and when to seek urgent care. Family involvement and teach-back improve safety when patients manage complex regimens at home.",
        whyWrongByOptionId: {
          B: "Temporary holding during acute illness does not mean these medications are permanently contraindicated.",
          C: "Basal insulin should generally not be stopped during illness without specific prescriber direction.",
          D: "With patient consent, family involvement can reduce medication errors and improve safety.",
        },
        clinicalJudgmentFocus: "Converting a near-miss sick-day episode into a durable diabetes safety plan.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "The family demonstrates the plan accurately. Mr. Singh knows when to hold medications, continue basal insulin, check ketones, and seek care." },
          B: { trajectory: "suboptimal", outcome: "Beneficial kidney/cardiometabolic medications are stopped unnecessarily and glycemic control worsens." },
          C: { trajectory: "harmful", outcome: "During the next illness, he stops basal insulin and develops significant ketonemia." },
          D: { trajectory: "suboptimal", outcome: "The daughter remains unsure how to help, and medication confusion recurs during the next illness." },
        },
      },
    },
  ],
};
