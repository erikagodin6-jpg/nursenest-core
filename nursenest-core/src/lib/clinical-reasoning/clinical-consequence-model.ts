export type HighRiskReasoningTopicKey =
  | "sepsis"
  | "shock"
  | "respiratory_failure"
  | "acute_coronary_syndrome"
  | "stroke"
  | "dka"
  | "hyperkalemia"
  | "gi_bleeding"
  | "overdose"
  | "trauma"
  | "maternal_emergencies"
  | "pediatric_emergencies";

export type ClinicalConsequenceProfile = {
  readonly key: HighRiskReasoningTopicKey;
  readonly title: string;
  readonly missedCue: string;
  readonly delayedIntervention: string;
  readonly likelyOutcome: string;
  readonly nextComplication: string;
  readonly requiredDepth: "exceptional";
};

export const HIGH_RISK_REASONING_TOPICS: readonly HighRiskReasoningTopicKey[] = [
  "sepsis",
  "shock",
  "respiratory_failure",
  "acute_coronary_syndrome",
  "stroke",
  "dka",
  "hyperkalemia",
  "gi_bleeding",
  "overdose",
  "trauma",
  "maternal_emergencies",
  "pediatric_emergencies",
] as const;

export const CLINICAL_CONSEQUENCE_PROFILES: readonly ClinicalConsequenceProfile[] = [
  {
    key: "sepsis",
    title: "Sepsis",
    missedCue: "Subtle infection plus perfusion changes, altered mental status, or rising lactate risk.",
    delayedIntervention: "Delayed recognition delays cultures, antimicrobials, fluids, and escalation.",
    likelyOutcome: "Progressive hypoperfusion, organ dysfunction, ICU transfer, or death.",
    nextComplication: "Septic shock.",
    requiredDepth: "exceptional",
  },
  {
    key: "shock",
    title: "Shock",
    missedCue: "Compensated shock signs such as tachycardia, narrow pulse pressure, cool skin, or anxiety.",
    delayedIntervention: "Delayed volume, bleeding control, vasopressor support, or source control worsens perfusion.",
    likelyOutcome: "Tissue hypoxia, acidosis, renal injury, and hemodynamic collapse.",
    nextComplication: "Multi-organ dysfunction.",
    requiredDepth: "exceptional",
  },
  {
    key: "respiratory_failure",
    title: "Respiratory Failure",
    missedCue: "Increased work of breathing, fatigue, altered mentation, or ventilation failure despite acceptable saturation.",
    delayedIntervention: "Delayed airway, oxygenation, ventilation, bronchodilator, or escalation support.",
    likelyOutcome: "CO2 retention, hypoxemia, arrest risk, or intubation delay.",
    nextComplication: "Respiratory arrest.",
    requiredDepth: "exceptional",
  },
  {
    key: "acute_coronary_syndrome",
    title: "Acute Coronary Syndrome",
    missedCue: "Chest discomfort, diaphoresis, dyspnea, ECG changes, or atypical symptoms in high-risk patients.",
    delayedIntervention: "Delayed ECG, troponin, antiplatelet pathway, monitoring, or rapid escalation.",
    likelyOutcome: "Ongoing ischemia and myocardial injury.",
    nextComplication: "Malignant dysrhythmia or cardiogenic shock.",
    requiredDepth: "exceptional",
  },
  {
    key: "stroke",
    title: "Stroke",
    missedCue: "New focal deficit, speech change, visual change, severe headache, or last-known-well ambiguity.",
    delayedIntervention: "Delayed stroke alert, glucose check, imaging, swallow safety, or neurologic reassessment.",
    likelyOutcome: "Lost reperfusion window and increased disability.",
    nextComplication: "Aspiration, cerebral edema, or hemorrhagic transformation risk.",
    requiredDepth: "exceptional",
  },
  {
    key: "dka",
    title: "DKA",
    missedCue: "Hyperglycemia with dehydration, ketones, Kussmaul respirations, abdominal pain, or altered mentation.",
    delayedIntervention: "Delayed fluids, insulin pathway, potassium monitoring, and acidosis management.",
    likelyOutcome: "Worsening dehydration, electrolyte instability, and cerebral or cardiovascular complications.",
    nextComplication: "Severe acidosis or potassium-related dysrhythmia.",
    requiredDepth: "exceptional",
  },
  {
    key: "hyperkalemia",
    title: "Hyperkalemia",
    missedCue: "Elevated potassium with weakness, renal failure, medication risk, or ECG conduction changes.",
    delayedIntervention: "Delayed ECG monitoring, membrane stabilization, potassium shift, or potassium removal.",
    likelyOutcome: "Progressive conduction delay and muscle weakness.",
    nextComplication: "Ventricular dysrhythmia or cardiac arrest.",
    requiredDepth: "exceptional",
  },
  {
    key: "gi_bleeding",
    title: "GI Bleeding",
    missedCue: "Melena, hematemesis, orthostasis, tachycardia, falling hemoglobin, or anticoagulant exposure.",
    delayedIntervention: "Delayed hemodynamic assessment, IV access, type and screen, provider notification, or transfusion preparation.",
    likelyOutcome: "Worsening hypovolemia and perfusion failure.",
    nextComplication: "Hemorrhagic shock.",
    requiredDepth: "exceptional",
  },
  {
    key: "overdose",
    title: "Overdose",
    missedCue: "Respiratory depression, toxidrome pattern, altered mentation, or medication access history.",
    delayedIntervention: "Delayed airway support, antidote pathway, poison control, monitoring, or safety precautions.",
    likelyOutcome: "Hypoxia, aspiration, dysrhythmia, or recurrent sedation.",
    nextComplication: "Respiratory arrest.",
    requiredDepth: "exceptional",
  },
  {
    key: "trauma",
    title: "Trauma",
    missedCue: "Mechanism, hidden bleeding, neurologic change, airway threat, or compartment/perfusion concern.",
    delayedIntervention: "Delayed primary survey, bleeding control, spinal precautions, imaging escalation, or transfer.",
    likelyOutcome: "Unrecognized hemorrhage, hypoxia, or secondary injury.",
    nextComplication: "Traumatic shock or neurologic deterioration.",
    requiredDepth: "exceptional",
  },
  {
    key: "maternal_emergencies",
    title: "Maternal Emergencies",
    missedCue: "Severe-range blood pressure, hemorrhage, fetal distress, seizure risk, or embolic symptoms.",
    delayedIntervention: "Delayed uterine massage, magnesium pathway, fetal/maternal monitoring, or obstetric escalation.",
    likelyOutcome: "Maternal instability and fetal compromise.",
    nextComplication: "Eclampsia, shock, or emergency birth pathway.",
    requiredDepth: "exceptional",
  },
  {
    key: "pediatric_emergencies",
    title: "Pediatric Emergencies",
    missedCue: "Respiratory fatigue, poor perfusion, dehydration, fever with toxicity, or developmental red flags.",
    delayedIntervention: "Delayed weight-based intervention, airway support, fluids, sepsis pathway, or caregiver-informed assessment.",
    likelyOutcome: "Rapid decompensation because pediatric reserve can fail abruptly.",
    nextComplication: "Respiratory failure or shock.",
    requiredDepth: "exceptional",
  },
] as const;

export function clinicalConsequenceProfile(key: HighRiskReasoningTopicKey): ClinicalConsequenceProfile {
  const profile = CLINICAL_CONSEQUENCE_PROFILES.find((item) => item.key === key);
  if (!profile) throw new Error(`Missing clinical consequence profile: ${key}`);
  return profile;
}

export function auditClinicalConsequenceModel(): readonly string[] {
  const issues: string[] = [];
  const profiles = new Set(CLINICAL_CONSEQUENCE_PROFILES.map((item) => item.key));
  for (const topic of HIGH_RISK_REASONING_TOPICS) {
    if (!profiles.has(topic)) issues.push(`missing high-risk consequence profile: ${topic}`);
  }
  for (const profile of CLINICAL_CONSEQUENCE_PROFILES) {
    if (profile.requiredDepth !== "exceptional") issues.push(`${profile.key} must require exceptional depth`);
    if (!profile.missedCue || !profile.delayedIntervention || !profile.likelyOutcome || !profile.nextComplication) {
      issues.push(`${profile.key} has an incomplete consequence chain`);
    }
  }
  return issues;
}
