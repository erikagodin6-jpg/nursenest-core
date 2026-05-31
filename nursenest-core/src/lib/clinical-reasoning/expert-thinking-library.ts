import { HIGH_RISK_REASONING_TOPICS, type HighRiskReasoningTopicKey } from "./clinical-consequence-model";

export type ExpertThinkingProfile = {
  readonly key: HighRiskReasoningTopicKey;
  readonly whatExpertsNotice: readonly string[];
  readonly commonLearnerMistakes: readonly string[];
  readonly earlyWarningSigns: readonly string[];
  readonly redFlags: readonly string[];
  readonly subtleFindings: readonly string[];
  readonly patternRecognition: string;
  readonly clinicalPearls: readonly string[];
};

export const EXPERT_THINKING_LIBRARY: readonly ExpertThinkingProfile[] = [
  {
    key: "sepsis",
    whatExpertsNotice: ["trend before threshold", "infection context plus perfusion", "mental status changes as an early cue"],
    commonLearnerMistakes: ["waiting for fever", "reassuring normal blood pressure during compensated shock"],
    earlyWarningSigns: ["tachycardia", "new confusion", "rising respiratory rate"],
    redFlags: ["hypotension", "lactate elevation", "oliguria"],
    subtleFindings: ["cool extremities", "mottling", "unexplained anxiety"],
    patternRecognition: "Sepsis often announces itself as a cluster of small deteriorations before one dramatic vital sign appears.",
    clinicalPearls: ["A normal temperature does not rule out sepsis when perfusion and mentation are changing."],
  },
  {
    key: "shock",
    whatExpertsNotice: ["compensation signs", "skin and pulse pressure", "cause of poor perfusion"],
    commonLearnerMistakes: ["waiting for hypotension", "treating anxiety as emotional only"],
    earlyWarningSigns: ["tachycardia", "narrow pulse pressure", "cool skin"],
    redFlags: ["hypotension", "altered mentation", "absent peripheral pulses"],
    subtleFindings: ["restlessness", "delayed capillary refill", "low urine output"],
    patternRecognition: "Shock is a perfusion problem; blood pressure can look acceptable until compensation fails.",
    clinicalPearls: ["When perfusion cues disagree with the blood pressure, believe the patient trend."],
  },
  {
    key: "respiratory_failure",
    whatExpertsNotice: ["work of breathing", "fatigue", "ventilation signs beyond pulse oximetry"],
    commonLearnerMistakes: ["trusting saturation alone", "delaying escalation until cyanosis"],
    earlyWarningSigns: ["increasing respiratory rate", "accessory muscle use", "short phrases"],
    redFlags: ["silent chest", "decreasing level of consciousness", "severe hypoxemia"],
    subtleFindings: ["restlessness", "sweating", "tripod positioning"],
    patternRecognition: "Respiratory failure is about trajectory and fatigue, not only the oxygen saturation number.",
    clinicalPearls: ["A tired breathing patient is more dangerous than a loud breathing patient."],
  },
  {
    key: "acute_coronary_syndrome",
    whatExpertsNotice: ["atypical presentations", "risk profile", "symptom timing"],
    commonLearnerMistakes: ["waiting for classic crushing pain", "treating indigestion-like pain as benign in high-risk patients"],
    earlyWarningSigns: ["new chest pressure", "diaphoresis", "unexplained dyspnea"],
    redFlags: ["ST changes", "syncope", "hypotension"],
    subtleFindings: ["nausea", "fatigue", "jaw or back discomfort"],
    patternRecognition: "ACS questions test whether the learner connects risk, symptoms, ECG, and time-sensitive escalation.",
    clinicalPearls: ["Atypical ACS symptoms are still high risk when the context fits."],
  },
  {
    key: "stroke",
    whatExpertsNotice: ["last known well", "focal pattern", "swallow and airway risk"],
    commonLearnerMistakes: ["asking the patient to rest first", "delaying glucose check or stroke activation"],
    earlyWarningSigns: ["facial droop", "arm drift", "speech change"],
    redFlags: ["sudden severe headache", "declining consciousness", "new unilateral deficit"],
    subtleFindings: ["visual field change", "neglect", "new imbalance"],
    patternRecognition: "Stroke reasoning is a clock-driven pattern: identify focal deficits, protect safety, and escalate immediately.",
    clinicalPearls: ["Every minute spent normalizing new focal neurologic findings can cost function."],
  },
  {
    key: "dka",
    whatExpertsNotice: ["dehydration plus acidosis signs", "potassium risk", "trigger illness"],
    commonLearnerMistakes: ["focusing only on glucose", "forgetting potassium before insulin"],
    earlyWarningSigns: ["polyuria", "abdominal pain", "Kussmaul respirations"],
    redFlags: ["altered mentation", "severe dehydration", "wide anion gap"],
    subtleFindings: ["fruity breath", "tachycardia", "infection symptoms"],
    patternRecognition: "DKA is a fluid, acid-base, and potassium emergency, not just a high glucose problem.",
    clinicalPearls: ["Insulin fixes acidosis, but unsafe potassium management can create the emergency."],
  },
  {
    key: "hyperkalemia",
    whatExpertsNotice: ["renal context", "medication contributors", "ECG danger"],
    commonLearnerMistakes: ["waiting for symptoms", "treating potassium as a routine lab"],
    earlyWarningSigns: ["weakness", "paresthesias", "rising potassium trend"],
    redFlags: ["ECG changes", "severe elevation", "bradycardia or wide QRS"],
    subtleFindings: ["nausea", "muscle heaviness", "missed dialysis context"],
    patternRecognition: "Hyperkalemia reasoning links the lab number to conduction risk and immediate monitoring.",
    clinicalPearls: ["A dangerous potassium level can be quiet until it is suddenly not quiet."],
  },
  {
    key: "gi_bleeding",
    whatExpertsNotice: ["perfusion before hemoglobin", "anticoagulants", "orthostatic symptoms"],
    commonLearnerMistakes: ["waiting for a low hemoglobin", "assuming dark stool is minor without context"],
    earlyWarningSigns: ["tachycardia", "dizziness", "melena"],
    redFlags: ["hematemesis", "syncope", "hypotension"],
    subtleFindings: ["fatigue", "cool skin", "new confusion in older adults"],
    patternRecognition: "GI bleed severity is judged by perfusion and trajectory, not only the first hemoglobin.",
    clinicalPearls: ["Hemoglobin can lag behind acute blood loss; vital signs often speak first."],
  },
  {
    key: "overdose",
    whatExpertsNotice: ["airway first", "toxidrome pattern", "re-sedation risk"],
    commonLearnerMistakes: ["focusing on confession before stabilization", "missing recurrent opioid toxicity"],
    earlyWarningSigns: ["somnolence", "small pupils", "slow respirations"],
    redFlags: ["respiratory depression", "seizure", "dysrhythmia"],
    subtleFindings: ["mixed medication bottles", "temperature change", "odor or skin findings"],
    patternRecognition: "Overdose reasoning starts with physiologic threat, then narrows toxidrome and safety planning.",
    clinicalPearls: ["History matters, but oxygenation wins the first minute."],
  },
  {
    key: "trauma",
    whatExpertsNotice: ["mechanism", "hidden hemorrhage", "airway and cervical spine risk"],
    commonLearnerMistakes: ["treating visible injuries first", "underestimating compensated blood loss"],
    earlyWarningSigns: ["tachycardia", "pallor", "worsening pain"],
    redFlags: ["unstable pelvis", "altered mentation", "absent distal pulse"],
    subtleFindings: ["seatbelt sign", "unequal pupils", "increasing compartment pain"],
    patternRecognition: "Trauma reasoning follows primary survey logic: threats to life outrank visible but stable injuries.",
    clinicalPearls: ["The loudest injury is not always the injury that kills first."],
  },
  {
    key: "maternal_emergencies",
    whatExpertsNotice: ["maternal stability", "fetal response", "hemorrhage and seizure risk"],
    commonLearnerMistakes: ["reassuring symptoms as normal pregnancy discomfort", "delaying severe blood pressure escalation"],
    earlyWarningSigns: ["headache", "visual changes", "increased bleeding"],
    redFlags: ["severe-range blood pressure", "seizure", "heavy postpartum bleeding"],
    subtleFindings: ["right upper quadrant pain", "new dyspnea", "uterine bogginess"],
    patternRecognition: "Maternal emergency reasoning protects both maternal physiology and fetal/newborn safety through early escalation.",
    clinicalPearls: ["Pregnancy changes what is expected, but severe neurologic or bleeding cues are never routine."],
  },
  {
    key: "pediatric_emergencies",
    whatExpertsNotice: ["appearance, work of breathing, circulation", "caregiver report", "rapid reserve loss"],
    commonLearnerMistakes: ["using adult normal values", "underestimating fatigue after agitation"],
    earlyWarningSigns: ["nasal flaring", "decreased intake", "tachycardia"],
    redFlags: ["lethargy", "poor perfusion", "apnea or severe retractions"],
    subtleFindings: ["fewer wet diapers", "weak cry", "less interaction"],
    patternRecognition: "Pediatric reasoning treats behavior and work of breathing as vital clinical data.",
    clinicalPearls: ["A child who becomes quiet after working hard to breathe may be worsening, not improving."],
  },
] as const;

export function expertThinkingProfile(key: HighRiskReasoningTopicKey): ExpertThinkingProfile {
  const profile = EXPERT_THINKING_LIBRARY.find((item) => item.key === key);
  if (!profile) throw new Error(`Missing expert thinking profile: ${key}`);
  return profile;
}

export function auditExpertThinkingLibrary(): readonly string[] {
  const issues: string[] = [];
  const profiles = new Set(EXPERT_THINKING_LIBRARY.map((item) => item.key));
  for (const topic of HIGH_RISK_REASONING_TOPICS) {
    if (!profiles.has(topic)) issues.push(`missing expert thinking profile: ${topic}`);
  }
  for (const profile of EXPERT_THINKING_LIBRARY) {
    if (profile.whatExpertsNotice.length < 3) issues.push(`${profile.key} needs expert-notice cues`);
    if (profile.commonLearnerMistakes.length < 2) issues.push(`${profile.key} needs learner mistakes`);
    if (profile.earlyWarningSigns.length < 3) issues.push(`${profile.key} needs early warning signs`);
    if (profile.redFlags.length < 3) issues.push(`${profile.key} needs red flags`);
    if (profile.subtleFindings.length < 3) issues.push(`${profile.key} needs subtle findings`);
    if (profile.clinicalPearls.length < 1) issues.push(`${profile.key} needs clinical pearls`);
  }
  return issues;
}
