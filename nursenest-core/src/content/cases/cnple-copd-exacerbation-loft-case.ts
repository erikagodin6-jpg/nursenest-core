import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style COPD case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_COPD_EXACERBATION_DISCHARGE_SAFETY: PatientCase = {
  id: "cnple-sample-copd-exacerbation-001",
  title: "Mr. Daniel Walsh — COPD Exacerbation, Disposition, and Relapse Prevention",
  tagline: "Adult Primary Care · Respiratory Urgent Care",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian Thoracic Society COPD guidance",
      "GOLD COPD exacerbation and maintenance therapy principles",
      "Canadian smoking cessation and immunization guidance",
    ],
  },
  patient: { age: 67, sex: "Male", pronouns: "he/him", setting: "NP-Led Primary Care Same-Day Clinic" },
  chiefComplaint: "Worsening shortness of breath, cough, and sputum change over 3 days.",
  pmhx: [
    "COPD, prior spirometry FEV1 48% predicted",
    "Two exacerbations treated with prednisone in the past year",
    "Hypertension",
    "Former construction worker; still smokes 8 cigarettes/day",
  ],
  medications: [
    { name: "Salbutamol MDI", dose: "100 mcg/puff", route: "inhaled", frequency: "PRN", indication: "COPD reliever" },
    { name: "Tiotropium", dose: "18 mcg", route: "inhaled", frequency: "daily", indication: "COPD maintenance" },
    { name: "Amlodipine", dose: "5 mg", route: "PO", frequency: "daily", indication: "Hypertension" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "acute-urgent-care",
  secondaryDomains: ["pharmacotherapeutics", "health-promotion-prevention", "diagnostics-labs"],
  difficulty: 4,
  stepCount: 3,
  estimatedMinutes: 18,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Same-day COPD exacerbation assessment",
      scenarioText:
        "Mr. Walsh, 67, presents with 3 days of increased dyspnea, more frequent salbutamol use, increased sputum volume, and sputum changing from white to yellow-green. He denies chest pain, hemoptysis, syncope, and unilateral leg swelling. Vitals: T 37.8°C, HR 108, RR 26, BP 146/84, SpO2 89% on room air, improving to 92% with controlled oxygen. He is speaking in full sentences but pauses between phrases. Chest exam: diffuse wheeze, prolonged expiratory phase, no focal crackles. He has no confusion and can walk to the exam room with breaks.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "COPD exacerbation with increased dyspnea, sputum volume, sputum purulence, tachypnea, and borderline oxygenation.",
        newFindings: ["SpO2 89% room air", "RR 26", "Sputum purulence", "Increased sputum volume", "Increased reliever use"],
      },
      vitals: [
        { label: "SpO2", value: "89%", unit: "room air", flag: "low" },
        { label: "RR", value: "26", unit: "/min", flag: "high" },
        { label: "HR", value: "108", unit: "bpm", flag: "high" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mr. Walsh has a COPD exacerbation with increased dyspnea, increased sputum volume, purulent sputum, RR 26, and SpO2 89% on room air. What is the most appropriate initial NP management?",
        family: "copd-exacerbation-initial-management",
        options: [
          { id: "A", label: "Provide controlled oxygen targeting COPD-appropriate saturation, short-acting bronchodilator therapy, oral prednisone, antibiotics because all three cardinal sputum symptoms are present, and close reassessment/disposition planning." },
          { id: "B", label: "Give high-flow oxygen to keep SpO2 above 99% and discharge if he feels less short of breath." },
          { id: "C", label: "Avoid prednisone because inhalers alone are safer in all COPD exacerbations." },
          { id: "D", label: "Treat as pneumonia with antibiotics only and stop bronchodilators until a chest x-ray is available." },
        ],
        correctOptionId: "A",
        rationale:
          "Initial COPD exacerbation care includes controlled oxygen, short-acting bronchodilators, systemic corticosteroid when moderate/severe symptoms are present, and antibiotics when bacterial features are likely, especially increased dyspnea, increased sputum volume, and increased sputum purulence. Oxygen should be titrated rather than indiscriminately maximized because COPD patients at risk of CO2 retention can worsen with excessive oxygen. Bronchodilation and steroid treatment should not be delayed while considering imaging or alternate diagnoses.",
        whyWrongByOptionId: {
          B: "Uncontrolled high-flow oxygen can worsen hypercapnia in susceptible COPD patients; discharge requires more than subjective improvement.",
          C: "Systemic corticosteroids shorten recovery and reduce relapse in appropriate exacerbations; inhalers alone are insufficient here.",
          D: "Antibiotics alone do not treat bronchospasm/airflow obstruction and should not replace bronchodilator and steroid therapy.",
        },
        clinicalJudgmentFocus: "Balancing acute COPD treatment, oxygen safety, and antibiotic stewardship.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Controlled oxygen and bronchodilators improve his work of breathing. Prednisone and an appropriate antibiotic are started, and reassessment determines whether outpatient care is safe." },
          B: { trajectory: "harmful", outcome: "Oxygen is increased excessively. He becomes drowsy and requires ED transfer for possible hypercapnia." },
          C: { trajectory: "suboptimal", outcome: "Symptoms improve briefly but relapse occurs within 24 hours because airway inflammation remains undertreated." },
          D: { trajectory: "harmful", outcome: "Wheezing and dyspnea worsen while bronchodilator treatment is delayed." },
        },
      },
    },
    {
      index: 1,
      heading: "Reassessment and disposition decision",
      updateNarrative: "Two hours later — after bronchodilator therapy, controlled oxygen, prednisone, and antibiotic initiation.",
      scenarioText:
        "After treatment, Mr. Walsh is less dyspneic but still tachypneic. SpO2 is 91–92% on room air at rest, drops to 86% after walking 20 metres, and he becomes visibly short of breath. RR is 24, HR 104. He lives alone on the third floor of a walk-up apartment. He says he can manage because he hates hospitals. No prior home oxygen assessment is documented.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Partial response but exertional desaturation, persistent tachypnea, limited home supports, and unsafe stairs raise disposition risk.",
        newFindings: ["Exertional SpO2 86%", "Lives alone", "Third-floor walk-up", "Persistent RR 24", "No home oxygen assessment"],
      },
      vitals: [
        { label: "SpO2", value: "91–92%", unit: "resting room air", flag: "low" },
        { label: "SpO2", value: "86%", unit: "after walking", flag: "critical" },
        { label: "RR", value: "24", unit: "/min", flag: "high" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Prednisone", dose: "40 mg", route: "PO", frequency: "daily", indication: "COPD exacerbation", flag: "new" },
        { name: "Antibiotic", dose: "agent per local guidance/allergy risk", route: "PO", frequency: "per regimen", indication: "COPD exacerbation with purulent sputum", flag: "new" },
      ],
      followUpInterval: { value: 2, unit: "hours", label: "2 hours later" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mr. Walsh improves somewhat but desaturates to 86% with minimal ambulation and lives alone up three flights of stairs. What is the safest disposition?",
        family: "copd-exacerbation-disposition",
        options: [
          { id: "A", label: "Arrange ED/hospital assessment because exertional desaturation and unsafe home context make outpatient management high risk." },
          { id: "B", label: "Discharge because resting SpO2 is above 90% and he prefers to avoid hospital." },
          { id: "C", label: "Prescribe home oxygen immediately from clinic without further assessment." },
          { id: "D", label: "Tell him to double salbutamol overnight and call the clinic next week." },
        ],
        correctOptionId: "A",
        rationale:
          "Disposition must consider physiologic response and social safety, not just patient preference. Exertional desaturation to 86%, persistent tachypnea, limited functional reserve, living alone, and stairs create high risk for deterioration after discharge. ED/hospital assessment allows blood gas consideration, chest imaging if indicated, monitoring, oxygen assessment, and evaluation for alternate diagnoses or complications. Home oxygen should not be started casually from clinic without proper assessment and a plan.",
        whyWrongByOptionId: {
          B: "Resting oxygenation alone is not enough when minimal exertion causes significant desaturation and the home environment is unsafe.",
          C: "Home oxygen requires appropriate evaluation and prescribing criteria; it does not solve acute deterioration risk by itself.",
          D: "A next-week reassessment is unsafe given exertional hypoxemia and persistent symptoms after treatment.",
        },
        clinicalJudgmentFocus: "Integrating exertional oxygenation, function, home supports, and patient preference into safe disposition.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He agrees to ED assessment after shared decision-making. He receives monitored therapy and is assessed for oxygen needs and pneumonia/heart failure overlap." },
          B: { trajectory: "harmful", outcome: "He becomes severely dyspneic climbing stairs and calls EMS overnight." },
          C: { trajectory: "suboptimal", outcome: "Oxygen is arranged without evaluating acute risk or hypercapnia, delaying appropriate monitoring." },
          D: { trajectory: "harmful", outcome: "Symptoms worsen at home and he presents later with respiratory acidosis." },
        },
      },
    },
    {
      index: 2,
      heading: "Post-exacerbation prevention visit",
      updateNarrative: "Three weeks later — follow-up after ED observation and discharge.",
      scenarioText:
        "Mr. Walsh was observed in ED, improved, and discharged without long-term oxygen. At follow-up, he has returned to baseline but reports using salbutamol daily. He is on tiotropium only for maintenance, continues to smoke, and has not attended pulmonary rehabilitation. He has had two treated exacerbations in the past year. Vaccination record shows influenza vaccine overdue and pneumococcal status uncertain. He says he is embarrassed that he 'caused this' by smoking.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Post-exacerbation recovery with high future exacerbation risk and modifiable prevention gaps.",
        newFindings: ["Daily salbutamol use", "Two exacerbations/year", "Still smoking", "No pulmonary rehab", "Vaccines overdue/uncertain"],
      },
      vitals: [
        { label: "SpO2", value: "94%", unit: "room air" },
        { label: "RR", value: "18", unit: "/min" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 3, unit: "weeks", label: "3 weeks later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At post-exacerbation follow-up, what plan best reduces Mr. Walsh's future COPD risk?",
        family: "copd-relapse-prevention-maintenance",
        options: [
          { id: "A", label: "Review inhaler technique/adherence, escalate maintenance therapy based on symptoms/exacerbation history, refer to pulmonary rehab, provide nonjudgmental smoking cessation support, update vaccines, and create a written exacerbation action plan." },
          { id: "B", label: "Continue the same maintenance therapy because he is back to baseline." },
          { id: "C", label: "Prescribe repeated standby prednisone without inhaler review or follow-up." },
          { id: "D", label: "Focus mainly on telling him to stop smoking because medication changes will not help if he keeps smoking." },
        ],
        correctOptionId: "A",
        rationale:
          "A COPD exacerbation is a sentinel event. Prevention requires technique/adherence review, optimizing maintenance therapy according to symptoms and exacerbation risk, pulmonary rehabilitation, vaccinations, smoking cessation using a nonjudgmental pharmacologic/behavioural approach, and an individualized action plan. Returning to baseline does not mean risk is controlled. Standby steroids without education and follow-up can lead to repeated unmonitored treatment and missed alternate diagnoses.",
        whyWrongByOptionId: {
          B: "Two exacerbations in a year and daily reliever use suggest persistent risk that should trigger optimization.",
          C: "Prednisone rescue packs may be appropriate for selected patients but should not replace maintenance optimization and reassessment.",
          D: "Smoking cessation is critical, but shaming or making it the only intervention misses effective COPD risk-reduction strategies.",
        },
        clinicalJudgmentFocus: "Converting an acute COPD event into a prevention plan that addresses medication, rehab, vaccination, and stigma-aware behaviour change.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "He receives inhaler coaching, maintenance escalation is considered, rehab referral is accepted, vaccines are updated, and he starts a quit plan with pharmacotherapy support." },
          B: { trajectory: "suboptimal", outcome: "No risk factors are addressed. He has another exacerbation during winter respiratory virus season." },
          C: { trajectory: "suboptimal", outcome: "He self-starts prednisone multiple times without review, delaying assessment of worsening baseline dyspnea." },
          D: { trajectory: "suboptimal", outcome: "He feels judged and disengages from follow-up, missing medication and rehab supports." },
        },
      },
    },
  ],
};
