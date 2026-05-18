import type { PatientCase } from "@/lib/cases/longitudinal-case-types";

/**
 * NurseNest-authored CNPLE LOFT-style pediatric respiratory case.
 *
 * This is original practice content for Canadian NP clinical judgment training.
 * It is not an official CNPLE item and is not affiliated with CCRNR.
 */
export const CASE_PEDIATRIC_ASTHMA_EXACERBATION: PatientCase = {
  id: "cnple-sample-pediatric-asthma-001",
  title: "Mason Chen — Pediatric Asthma Exacerbation and Discharge Safety",
  tagline: "Pediatrics · Respiratory Urgent Care",
  governance: {
    reviewStatus: "internal_review",
    reviewedBy: "NurseNest Clinical Team",
    contentUpdatedAt: "2026-05-18",
    guidelineSources: [
      "Canadian Thoracic Society asthma guidance",
      "Canadian Paediatric Society asthma exacerbation guidance",
      "Pediatric acute respiratory assessment and discharge safety principles",
    ],
  },
  patient: { age: 8, sex: "Male", pronouns: "he/him", setting: "Community Urgent Care Clinic" },
  chiefComplaint: "Wheezing, cough, and shortness of breath after viral symptoms and missed controller therapy.",
  pmhx: [
    "Asthma diagnosed at age 5",
    "Two urgent visits for wheeze in the past year",
    "Allergic rhinitis",
    "No ICU admissions or intubation",
  ],
  medications: [
    { name: "Salbutamol MDI", dose: "100 mcg/puff", route: "inhaled", frequency: "PRN", indication: "Asthma reliever" },
    { name: "Fluticasone MDI", dose: "125 mcg/puff", route: "inhaled", frequency: "1 puff BID", indication: "Asthma controller" },
  ],
  allergies: [{ substance: "No known drug allergies", reaction: "", severity: "mild" }],
  primaryDomain: "pediatrics",
  secondaryDomains: ["acute-urgent-care", "health-promotion-prevention", "pharmacotherapeutics"],
  difficulty: 3,
  stepCount: 3,
  estimatedMinutes: 17,
  isPremium: true,
  steps: [
    {
      index: 0,
      heading: "Initial urgent respiratory assessment",
      scenarioText:
        "Mason, 8, arrives with his mother after 2 days of rhinorrhea and cough followed by worsening wheeze overnight. He used salbutamol 6 times since midnight with only brief relief. His mother says he has not used fluticasone regularly for several weeks because he seemed well. He is speaking in short phrases and using intercostal muscles. Vitals: T 37.6°C, HR 124, RR 34, SpO2 92% on room air. Chest exam: diffuse expiratory wheeze with reduced air entry at bases. He is alert but anxious.",
      clinicalUpdate: {
        direction: "worsening",
        summary: "Moderate to severe pediatric asthma exacerbation with hypoxemia and increased work of breathing.",
        newFindings: ["SpO2 92% room air", "RR 34", "Short phrases", "Intercostal retractions", "Frequent salbutamol use overnight"],
      },
      vitals: [
        { label: "SpO2", value: "92%", unit: "room air", flag: "low" },
        { label: "RR", value: "34", unit: "/min", flag: "high" },
        { label: "HR", value: "124", unit: "bpm", flag: "high" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: null,
      cnpleDomain: "pediatrics",
      question: {
        stem: "Mason has wheeze, reduced air entry, SpO2 92%, short phrases, and intercostal retractions. What is the most appropriate initial NP management?",
        family: "pediatric-asthma-acute-triage",
        options: [
          { id: "A", label: "Give controlled oxygen, inhaled salbutamol by MDI/spacer or nebulizer protocol, add ipratropium for severity, give systemic corticosteroid early, and reassess frequently." },
          { id: "B", label: "Prescribe antibiotics for presumed bronchitis and advise salbutamol every 6 hours at home." },
          { id: "C", label: "Restart fluticasone only and arrange routine follow-up in 1 week." },
          { id: "D", label: "Send him home because wheeze is expected with viral infections and his temperature is normal." },
        ],
        correctOptionId: "A",
        rationale:
          "Mason has objective severity markers: oxygen saturation around 92%, increased work of breathing, short phrase speech, tachypnea, and reduced air entry. Initial management prioritizes oxygenation, rapid bronchodilation, early systemic corticosteroid, and frequent reassessment. Ipratropium is appropriate in moderate to severe exacerbations. Controller therapy matters for prevention, but inhaled corticosteroid alone will not treat acute bronchospasm. Antibiotics are not indicated without evidence of bacterial pneumonia.",
        whyWrongByOptionId: {
          B: "A viral trigger is common and antibiotics do not treat bronchospasm. Delaying bronchodilator/steroid management risks deterioration.",
          C: "Controller therapy should be restarted, but acute hypoxemia and retractions require immediate rescue treatment and reassessment.",
          D: "Normal temperature does not make this safe. Work of breathing and oxygen saturation are more important severity indicators.",
        },
        clinicalJudgmentFocus: "Recognising pediatric asthma severity and initiating time-sensitive treatment before fatigue develops.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Oxygen and bronchodilator therapy are started immediately. Dexamethasone is given. Mason's work of breathing improves over the next hour while monitoring continues." },
          B: { trajectory: "harmful", outcome: "Antibiotics are prescribed but bronchospasm worsens. He returns later with SpO2 88% and exhaustion." },
          C: { trajectory: "harmful", outcome: "Controller therapy alone does not relieve acute obstruction. Mason deteriorates before the scheduled follow-up." },
          D: { trajectory: "harmful", outcome: "He is discharged too early and presents to ED overnight with severe respiratory distress." },
        },
      },
    },
    {
      index: 1,
      heading: "Post-treatment reassessment and disposition",
      updateNarrative: "90 minutes later — after oxygen, bronchodilators, and dexamethasone.",
      scenarioText:
        "After repeated salbutamol and ipratropium plus dexamethasone, Mason is more comfortable. SpO2 is 95% on room air for 40 minutes. RR is 24, HR 112, and he speaks in full sentences. Mild expiratory wheeze remains with good air entry. His mother lives 20 minutes from the ED, has transportation, and can return if symptoms worsen. She asks whether he can go home because he looks much better.",
      clinicalUpdate: {
        direction: "improving",
        summary: "Clinical improvement after acute treatment, but safe discharge depends on sustained response, caregiver capacity, medications, and return precautions.",
        newFindings: ["SpO2 95% room air", "Full sentences", "Mild residual wheeze", "Good access to urgent care", "Caregiver can monitor"],
      },
      vitals: [
        { label: "SpO2", value: "95%", unit: "room air" },
        { label: "RR", value: "24", unit: "/min" },
        { label: "HR", value: "112", unit: "bpm", flag: "high" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [
        { name: "Dexamethasone", dose: "weight-based", route: "PO", frequency: "once", indication: "Asthma exacerbation", flag: "new" },
        { name: "Salbutamol", dose: "per action plan", route: "inhaled", frequency: "scheduled then PRN", indication: "Reliever after exacerbation", flag: "changed" },
      ],
      followUpInterval: { value: 90, unit: "minutes", label: "90 minutes later" },
      cnpleDomain: "acute-urgent-care",
      question: {
        stem: "Mason improves after treatment and maintains SpO2 95% on room air. What discharge plan is safest if he remains stable?",
        family: "pediatric-asthma-discharge-safety",
        options: [
          { id: "A", label: "Discharge with written asthma action plan, correct spacer technique demonstration, reliever schedule, controller restart/adherence plan, steroid instructions if needed, red flags, and follow-up within 24–48 hours." },
          { id: "B", label: "Discharge with salbutamol only and tell the family to restart controller therapy if he wheezes again." },
          { id: "C", label: "Keep him in clinic all day until wheeze is completely absent." },
          { id: "D", label: "Order a chest x-ray before discharge because all children with asthma exacerbations need imaging." },
        ],
        correctOptionId: "A",
        rationale:
          "Safe discharge after pediatric asthma exacerbation requires sustained clinical response, adequate oxygenation on room air, reduced work of breathing, caregiver ability, access to urgent care, medication access, written action plan, inhaler/spacer teaching, and early follow-up. Mild residual wheeze can be acceptable if work of breathing and oxygenation have normalized and the child is stable. Chest x-ray is not routine unless there are focal findings, persistent hypoxemia, fever suggesting pneumonia, pneumothorax concern, or atypical course.",
        whyWrongByOptionId: {
          B: "Reliever-only discharge misses the prevention failure that contributed to the exacerbation and provides no structured safety net.",
          C: "Complete absence of wheeze is not required if objective stability and discharge supports are present.",
          D: "Routine imaging is low-value and may distract from education, medication access, and follow-up planning.",
        },
        clinicalJudgmentFocus: "Turning acute improvement into a safe pediatric discharge plan with family-centred teaching.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "Mason is discharged with a clear action plan and early reassessment. His mother demonstrates spacer technique and knows when to seek urgent care." },
          B: { trajectory: "suboptimal", outcome: "He improves initially but the family underuses controller medication. Symptoms flare again within days." },
          C: { trajectory: "suboptimal", outcome: "Clinic resources are used unnecessarily despite objective discharge readiness. The family still lacks prevention teaching." },
          D: { trajectory: "suboptimal", outcome: "Imaging is normal and delays discharge education. The root adherence and technique issues remain unaddressed." },
        },
      },
    },
    {
      index: 2,
      heading: "Follow-up and prevention planning",
      updateNarrative: "48 hours later — primary care follow-up.",
      scenarioText:
        "Mason returns 48 hours later. He has no retractions, sleeps through the night, and uses salbutamol every 4–6 hours with improvement. His mother admits she stopped fluticasone because she worried about steroids and did not understand why he needed it when asymptomatic. Mason demonstrates MDI use and actuates before sealing his lips around the spacer. They have a cat at home and he has untreated allergic rhinitis symptoms most mornings.",
      clinicalUpdate: {
        direction: "stable",
        summary: "Recovery phase with modifiable prevention issues: controller beliefs, inhaler technique, allergic rhinitis, and trigger management.",
        newFindings: ["Poor spacer technique", "Controller steroid concern", "Morning rhinitis", "Cat exposure", "Recent urgent exacerbation"],
      },
      vitals: [
        { label: "SpO2", value: "98%", unit: "room air" },
        { label: "RR", value: "20", unit: "/min" },
      ],
      diagnosticArtifacts: [],
      medicationChanges: [],
      followUpInterval: { value: 48, unit: "hours", label: "48 hours later" },
      cnpleDomain: "health-promotion-prevention",
      question: {
        stem: "At follow-up, what is the most important prevention-focused NP intervention?",
        family: "pediatric-asthma-controller-adherence",
        options: [
          { id: "A", label: "Use teach-back to correct MDI/spacer technique, address steroid fears, restart daily controller therapy, treat allergic rhinitis, review triggers, and update the written action plan." },
          { id: "B", label: "Stop inhaled corticosteroid permanently because the family is uncomfortable with steroids." },
          { id: "C", label: "Advise salbutamol before school every day as the main long-term prevention plan." },
          { id: "D", label: "Focus only on cat removal and defer medication teaching until the next exacerbation." },
        ],
        correctOptionId: "A",
        rationale:
          "A child with recent urgent exacerbation, frequent reliever use, technique errors, allergic rhinitis, and controller nonadherence needs comprehensive prevention. The NP should use teach-back, correct spacer steps, explain that inhaled corticosteroids reduce airway inflammation and exacerbation risk, treat comorbid allergic rhinitis, review feasible trigger reduction, confirm medication access, and update the action plan. Daily salbutamol is not controller therapy and can mask poor control. Trigger reduction helps but should not replace pharmacologic prevention and technique correction.",
        whyWrongByOptionId: {
          B: "Stopping controller therapy after an exacerbation increases future risk and does not address the family's concern with balanced education.",
          C: "Regular reliever use without anti-inflammatory control is a marker of poor control, not prevention.",
          D: "Environmental changes may help but are incomplete and can be unrealistic if framed as the only solution.",
        },
        clinicalJudgmentFocus: "Using family-centred education to convert an acute event into durable asthma control.",
        consequencesByOptionId: {
          A: { trajectory: "optimal", outcome: "The family demonstrates correct spacer technique and agrees to a controller plan. Rhinitis treatment begins and action-plan zones are reviewed. Salbutamol use falls over the next 2 weeks." },
          B: { trajectory: "harmful", outcome: "Controller therapy is stopped. Mason has another urgent exacerbation after the next viral illness." },
          C: { trajectory: "suboptimal", outcome: "Daily reliever use hides worsening control. He remains at increased risk for severe exacerbation." },
          D: { trajectory: "suboptimal", outcome: "The family feels blamed about the cat and leaves without understanding controller therapy or proper technique." },
        },
      },
    },
  ],
};
