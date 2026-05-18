import type { ParamedicSeedQuestion } from "./paramedic-question-bank-blueprint";

export const PARAMEDIC_P0_SEED_QUESTIONS: readonly ParamedicSeedQuestion[] = [
  {
    id: "ems-airway-asthma-silent-chest-001",
    domain: "airway",
    difficulty: "critical",
    style: "clinical-judgment",
    stem:
      "A severe asthma patient who was initially wheezing loudly is now drowsy, quiet, and barely moving air. SpO₂ is falling despite oxygen. What does this change most strongly suggest?",
    choices: [
      "Improvement because wheezing is less audible",
      "Respiratory fatigue and impending failure",
      "An anxiety response that should be managed with reassurance only",
      "A stable patient who can wait for routine transport",
    ],
    correctChoiceIndex: 1,
    rationale:
      "A quiet or silent chest with drowsiness after severe wheezing is a high-risk sign of fatigue and inadequate ventilation, not improvement.",
    tags: ["airway", "asthma", "silent-chest", "respiratory-failure", "deterioration"],
    remediationLessonSlugs: ["respiratory-distress-vs-failure", "bvm-ventilation-paramedic"],
  },
  {
    id: "ems-airway-cpap-pulmonary-edema-001",
    domain: "airway",
    difficulty: "operational",
    style: "clinical-judgment",
    stem:
      "A patient with severe dyspnea, crackles, frothy sputum, hypertension, and intact mental status is sitting upright and tiring. Which intervention is most consistent with early EMS respiratory support if allowed by protocol?",
    choices: ["CPAP with close reassessment", "Oral fluids and supine positioning", "Delayed oxygen until hospital arrival", "Immediate full spinal immobilization"],
    correctChoiceIndex: 0,
    rationale:
      "Pulmonary edema with severe work of breathing and intact mental status is a classic setting where CPAP may improve oxygenation and reduce work of breathing under local protocol.",
    tags: ["airway", "cpap", "pulmonary-edema", "respiratory-distress", "reassessment"],
    remediationLessonSlugs: ["oxygen-delivery-devices-ems", "respiratory-distress-vs-failure"],
  },
  {
    id: "ems-airway-contaminated-trauma-001",
    domain: "airway",
    difficulty: "critical",
    style: "scenario-sequence",
    stem:
      "A trauma patient has blood in the mouth, snoring respirations, and declining responsiveness. What is the safest initial airway sequence?",
    choices: [
      "Apply a non-rebreather over the blood and continue the secondary survey",
      "Open/position the airway, suction contamination, then support ventilation as needed",
      "Delay airway care until the patient is fully immobilized",
      "Give oral medication to improve alertness",
    ],
    correctChoiceIndex: 1,
    rationale:
      "A contaminated and threatened airway needs positioning and suction before effective oxygenation or ventilation support can occur.",
    tags: ["airway", "suction", "trauma", "contaminated-airway", "bvm"],
    remediationLessonSlugs: ["airway-obstruction-and-suctioning", "airway-assessment-primary-survey"],
  },
  {
    id: "ems-airway-etco2-rosc-001",
    domain: "airway",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "During CPR, waveform capnography suddenly rises from 11 to 39 mmHg with a stronger waveform. What should the crew reassess immediately?",
    choices: ["Whether ROSC may have occurred", "Whether oxygen should be discontinued", "Whether compressions should be slowed indefinitely", "Whether the monitor should be ignored as artifact without patient assessment"],
    correctChoiceIndex: 0,
    rationale:
      "A sudden sustained EtCO₂ rise during resuscitation can suggest improved perfusion and possible ROSC, requiring pulse and rhythm reassessment.",
    tags: ["airway", "capnography", "rosc", "cpr", "reassessment"],
    remediationLessonSlugs: ["capnography-basics-for-paramedics"],
  },
  {
    id: "ems-airway-copd-etco2-001",
    domain: "airway",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "A COPD patient on oxygen becomes increasingly somnolent with shallow respirations and rising EtCO₂. What problem is most important to recognize?",
    choices: ["Ventilation failure, not simply an oxygenation problem", "A normal response to feeling better", "A reason to stop reassessment because SpO₂ is the only useful value", "A finding unrelated to respiratory status"],
    correctChoiceIndex: 0,
    rationale:
      "Rising EtCO₂, somnolence, and shallow breathing point to inadequate ventilation. Oxygen saturation alone can miss ventilatory failure.",
    tags: ["airway", "copd", "etco2", "ventilation-failure", "reassessment"],
    remediationLessonSlugs: ["capnography-basics-for-paramedics", "respiratory-distress-vs-failure"],
  },
  {
    id: "ems-trauma-occult-shock-pelvis-001",
    domain: "trauma",
    difficulty: "critical",
    style: "clinical-judgment",
    stem:
      "A fall patient has pelvic pain, HR 128, cool clammy skin, confusion, and BP 108/72. Which interpretation is safest?",
    choices: ["The blood pressure proves the patient is stable", "Compensated shock is possible despite a normal-ish systolic pressure", "Pelvic pain is never associated with significant bleeding", "Transport can be delayed for a full scene interview"],
    correctChoiceIndex: 1,
    rationale:
      "Tachycardia, skin signs, confusion, and mechanism can indicate compensated shock before hypotension appears, especially with possible pelvic bleeding.",
    tags: ["trauma", "shock", "pelvic-trauma", "occult-bleeding", "perfusion"],
    remediationLessonSlugs: ["traumatic-shock-recognition", "trauma-scene-size-up"],
  },
  {
    id: "ems-trauma-chest-seal-deterioration-001",
    domain: "trauma",
    difficulty: "critical",
    style: "scenario-sequence",
    stem:
      "A stabbed patient has an occlusive dressing placed over a chest wound. Minutes later, dyspnea worsens, unilateral breath sounds decrease, and hypotension worsens. What threat should be suspected?",
    choices: ["Possible tension physiology requiring urgent reassessment and escalation", "Normal anxiety after dressing placement", "Improvement because the wound is covered", "A reason to stop reassessing until arrival"],
    correctChoiceIndex: 0,
    rationale:
      "Worsening respiratory distress and shock after chest wound management should trigger concern for evolving tension physiology and immediate reassessment according to protocol.",
    tags: ["trauma", "chest-trauma", "tension-pneumothorax", "reassessment", "shock"],
    remediationLessonSlugs: ["chest-trauma-and-breathing-threats"],
  },
  {
    id: "ems-trauma-tourniquet-reassessment-001",
    domain: "trauma",
    difficulty: "operational",
    style: "clinical-judgment",
    stem:
      "After applying a tourniquet for severe extremity bleeding, which reassessment is most important during packaging and transport?",
    choices: ["Confirm bleeding remains controlled and document application time", "Loosen it every few minutes to see if bleeding restarts", "Ignore the limb once the first dressing is applied", "Delay transport until the patient reports no pain"],
    correctChoiceIndex: 0,
    rationale:
      "Tourniquet effectiveness must be reassessed after movement, and application time should be documented for downstream care.",
    tags: ["trauma", "tourniquet", "hemorrhage", "reassessment", "transport"],
    remediationLessonSlugs: ["hemorrhage-control-prehospital"],
  },
  {
    id: "ems-trauma-tbi-airway-priority-001",
    domain: "trauma",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "A head-injury patient becomes combative, then progressively lethargic with vomiting. What priority should rise immediately?",
    choices: ["Airway protection and rapid reassessment of neurologic status", "Leaving the patient supine without suction nearby", "Delaying transport until a detailed witness interview is complete", "Assuming the patient is simply intoxicated and stable"],
    correctChoiceIndex: 0,
    rationale:
      "Declining LOC and vomiting after head injury increase airway risk and require reassessment, suction readiness, and rapid transport thinking.",
    tags: ["trauma", "tbi", "airway", "vomiting", "neuro"],
    remediationLessonSlugs: ["spinal-motion-restriction-and-neuro-checks", "airway-obstruction-and-suctioning"],
  },
  {
    id: "ems-trauma-burn-airway-001",
    domain: "trauma",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "A patient rescued from a house fire has facial burns, hoarse voice, soot around the mouth, and increasing respiratory distress. What is the highest-risk issue?",
    choices: ["Possible inhalation injury and progressive airway compromise", "Minor skin pain only", "A stable patient who does not need respiratory reassessment", "A reason to prioritize a full burn percentage calculation before airway concerns"],
    correctChoiceIndex: 0,
    rationale:
      "Facial burns, soot, hoarseness, and respiratory distress suggest inhalation injury with potential progressive airway compromise.",
    tags: ["trauma", "burns", "airway", "inhalation-injury", "respiratory-distress"],
    remediationLessonSlugs: ["airway-assessment-primary-survey", "respiratory-distress-vs-failure"],
  },
  {
    id: "ems-ecg-vt-unstable-001",
    domain: "ecg-cardiology",
    difficulty: "critical",
    style: "ecg-interpretation",
    stem:
      "A monitored patient has a regular wide-complex tachycardia at 210/min, BP 74/40, diaphoresis, and confusion. What is the safest EMS interpretation?",
    choices: ["Unstable wide-complex tachycardia requiring immediate escalation under protocol", "Stable SVT because the patient is still breathing", "Artifact unless the patient is completely unconscious", "A benign rhythm that can wait for outpatient follow-up"],
    correctChoiceIndex: 0,
    rationale:
      "Wide-complex tachycardia with hypotension and altered mental status is unstable until proven otherwise and should be escalated according to local protocol/ACLS scope.",
    tags: ["ecg", "vt", "wide-complex", "unstable-rhythm", "shock"],
    remediationLessonSlugs: ["wide-complex-tachycardia-prehospital"],
  },
  {
    id: "ems-ecg-artifact-vf-001",
    domain: "ecg-cardiology",
    difficulty: "operational",
    style: "ecg-interpretation",
    stem:
      "During transport, the monitor suddenly appears to show VF, but the patient is awake and talking while the ambulance is moving over rough road. What should happen first?",
    choices: ["Assess the patient and verify the rhythm/leads before treating the monitor", "Immediately defibrillate without checking the patient", "Stop monitoring permanently because ECGs are unreliable", "Document cardiac arrest without pulse assessment"],
    correctChoiceIndex: 0,
    rationale:
      "Motion artifact can mimic VF. EMS must treat the patient, assess pulse/perfusion, and verify leads before acting on an apparent lethal rhythm.",
    tags: ["ecg", "artifact", "vf", "transport", "telemetry-pitfalls"],
    remediationLessonSlugs: ["icu-telemetry-critical-care"],
  },
  {
    id: "ems-ecg-complete-heart-block-001",
    domain: "ecg-cardiology",
    difficulty: "advanced",
    style: "clinical-judgment",
    stem:
      "A patient with dizziness has HR 32, hypotension, confusion, and an ECG concerning for complete heart block. What is the key operational concern?",
    choices: ["Unstable bradycardia with poor perfusion and peri-arrest risk", "A normal finding in all older adults", "A rhythm that should only be reassessed after a long transport delay", "A condition unrelated to mental status or blood pressure"],
    correctChoiceIndex: 0,
    rationale:
      "Complete heart block with hypotension and confusion indicates unstable perfusion and should trigger urgent escalation and transport decision-making.",
    tags: ["ecg", "complete-heart-block", "bradycardia", "perfusion", "transport"],
    remediationLessonSlugs: ["unstable-bradycardia-and-perfusion"],
  },
  {
    id: "ems-ecg-stemi-repeat-001",
    domain: "ecg-cardiology",
    difficulty: "operational",
    style: "transport-decision",
    stem:
      "A chest-pain patient has an initial nondiagnostic ECG but develops worsening pain, diaphoresis, and hypotension during transport. What is the best ECG-related action?",
    choices: ["Repeat ECG and reassess for evolving STEMI or rhythm change", "Ignore ECG changes after the first tracing", "Cancel transport because the first ECG was nondiagnostic", "Treat all worsening symptoms as anxiety without reassessment"],
    correctChoiceIndex: 0,
    rationale:
      "STEMI and rhythm findings can evolve. Worsening symptoms or vitals should trigger repeat assessment and ECG when feasible.",
    tags: ["ecg", "stemi", "repeat-ecg", "reassessment", "transport"],
    remediationLessonSlugs: ["prehospital-acs-recognition"],
  },
  {
    id: "ems-ecg-pea-pulse-check-001",
    domain: "ecg-cardiology",
    difficulty: "critical",
    style: "ecg-interpretation",
    stem:
      "The monitor shows an organized rhythm, but the patient is unresponsive and pulseless. What is the correct interpretation?",
    choices: ["PEA is possible and treatment should focus on CPR and reversible causes", "An organized rhythm always means the patient has a pulse", "Defibrillation is always indicated for every organized rhythm", "Pulse checks are unnecessary when the monitor has electrical activity"],
    correctChoiceIndex: 0,
    rationale:
      "PEA is organized electrical activity without a palpable pulse. The ECG alone cannot confirm perfusion.",
    tags: ["ecg", "pea", "cardiac-arrest", "pulse-check", "acls"],
    remediationLessonSlugs: ["icu-telemetry-critical-care"],
  },
];

export const PARAMEDIC_P0_SEED_QUESTION_COUNT = PARAMEDIC_P0_SEED_QUESTIONS.length;

export function getParamedicP0QuestionsByDomain(domain: ParamedicSeedQuestion["domain"]): ParamedicSeedQuestion[] {
  return PARAMEDIC_P0_SEED_QUESTIONS.filter((question) => question.domain === domain);
}
