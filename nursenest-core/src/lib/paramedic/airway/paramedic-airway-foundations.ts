export type ParamedicAirwayAcuity = "stable" | "urgent" | "critical";

export type ParamedicAirwayLesson = {
  slug: string;
  title: string;
  module: "airway-foundations";
  level: "foundation" | "core" | "advanced";
  estimatedMinutes: number;
  acuity: ParamedicAirwayAcuity;
  seoTitle: string;
  seoDescription: string;
  learningObjectives: string[];
  fieldAssessmentFocus: string[];
  clinicalDecisionPoints: string[];
  commonMistakes: string[];
  scenarioPrompt: string;
  practiceTags: string[];
  flashcardDecks: string[];
};

export const PARAMEDIC_AIRWAY_FOUNDATIONS_MODULE = {
  slug: "airway-foundations",
  title: "Paramedic Airway Foundations",
  shortTitle: "Airway Foundations",
  description:
    "Prehospital airway assessment, oxygen delivery, ventilation support, and respiratory deterioration recognition for paramedic learners.",
  positioning:
    "Train rapid airway decision-making in field conditions, not classroom-only memorization.",
  primarySeoKeyword: "paramedic airway management",
  secondarySeoKeywords: [
    "EMS airway assessment",
    "BVM ventilation paramedic",
    "oxygen delivery devices EMS",
    "prehospital respiratory distress",
    "paramedic capnography basics",
  ],
  readinessTargetPercent: 95,
} as const;

export const PARAMEDIC_AIRWAY_FOUNDATION_LESSONS: ParamedicAirwayLesson[] = [
  {
    slug: "airway-assessment-primary-survey",
    title: "Airway Assessment in the Primary Survey",
    module: "airway-foundations",
    level: "foundation",
    estimatedMinutes: 28,
    acuity: "urgent",
    seoTitle: "Paramedic Airway Assessment in the Primary Survey | NurseNest",
    seoDescription:
      "Learn how paramedics assess airway patency, respiratory effort, mental status, and immediate threats during the primary survey.",
    learningObjectives: [
      "Differentiate patent, threatened, and obstructed airways in the first minute of patient contact.",
      "Use AVPU, speech, positioning, and work of breathing to judge airway risk.",
      "Identify when airway intervention must happen before a full secondary assessment.",
      "Connect airway findings to transport urgency and reassessment frequency.",
    ],
    fieldAssessmentFocus: [
      "Can the patient speak in full sentences, short phrases, or not at all?",
      "Is there snoring, gurgling, stridor, vomitus, blood, swelling, or facial trauma?",
      "Is mental status declining enough to compromise protective airway reflexes?",
      "Does positioning improve airflow or reveal fatigue?",
    ],
    clinicalDecisionPoints: [
      "Open and position the airway when obstruction is suspected.",
      "Suction before ventilation when fluid or vomitus threatens airway patency.",
      "Escalate from oxygen to assisted ventilation when ventilation is inadequate, not just when saturation is low.",
      "Package and transport early when airway status is unstable or deteriorating.",
    ],
    commonMistakes: [
      "Treating oxygen saturation as the only airway assessment finding.",
      "Delaying suction while attempting repeated oxygen device changes.",
      "Ignoring mental status decline as an airway warning sign.",
      "Documenting clear lungs while missing upper-airway obstruction signs.",
    ],
    scenarioPrompt:
      "You arrive for a 71-year-old found on the floor after vomiting. They open eyes to voice, make gurgling sounds, and have SpO₂ 86% on room air. What airway actions come before history-taking?",
    practiceTags: ["airway", "primary-survey", "suction", "respiratory-distress", "altered-loc"],
    flashcardDecks: ["Airway Assessment", "Primary Survey", "Respiratory Red Flags"],
  },
  {
    slug: "oxygen-delivery-devices-ems",
    title: "Oxygen Delivery Devices for EMS",
    module: "airway-foundations",
    level: "foundation",
    estimatedMinutes: 32,
    acuity: "stable",
    seoTitle: "Oxygen Delivery Devices for EMS | Paramedic Study Guide",
    seoDescription:
      "Compare nasal cannula, non-rebreather, Venturi, nebulizer, CPAP, and BVM oxygen delivery decisions for EMS calls.",
    learningObjectives: [
      "Match oxygen delivery devices to patient presentation and respiratory effort.",
      "Explain when oxygen delivery is insufficient because ventilation is failing.",
      "Recognize device limitations in shock, COPD, asthma, pulmonary edema, and altered mental status.",
      "Choose escalation steps when saturation, work of breathing, or mental status worsens.",
    ],
    fieldAssessmentFocus: [
      "Current SpO₂ trend and reliability of waveform or perfusion.",
      "Respiratory rate, tidal volume, fatigue, accessory muscle use, and ability to tolerate mask devices.",
      "Clinical context: trauma, pulmonary edema, asthma, COPD, overdose, or sepsis.",
      "Response to intervention after 2 to 5 minutes, not just initial device selection.",
    ],
    clinicalDecisionPoints: [
      "Use nasal cannula for mild hypoxemia with adequate ventilation.",
      "Use non-rebreather for significant hypoxemia when ventilation remains adequate.",
      "Use nebulized bronchodilator delivery when bronchospasm is the priority and local protocol supports it.",
      "Move to BVM or CPAP when oxygenation failure is paired with ventilation failure or severe work of breathing.",
    ],
    commonMistakes: [
      "Leaving a non-rebreather on a patient who is too fatigued to ventilate effectively.",
      "Assuming high-flow oxygen corrects hypercapnic respiratory failure.",
      "Forgetting to reassess lung sounds and work of breathing after device changes.",
      "Using oxygen devices without considering local protocol and patient tolerance.",
    ],
    scenarioPrompt:
      "A patient with severe dyspnea is speaking one-word answers, breathing 8/min, and has shallow chest rise. SpO₂ is 82%. Why is a non-rebreather not enough?",
    practiceTags: ["oxygen", "bvm", "cpap", "respiratory-failure", "device-selection"],
    flashcardDecks: ["Oxygen Devices", "Respiratory Support", "EMS Escalation"],
  },
  {
    slug: "bvm-ventilation-paramedic",
    title: "BVM Ventilation and Assisted Breathing",
    module: "airway-foundations",
    level: "core",
    estimatedMinutes: 36,
    acuity: "critical",
    seoTitle: "BVM Ventilation for Paramedics | Assisted Breathing Guide",
    seoDescription:
      "Practice paramedic BVM ventilation decisions, seal technique, ventilation rate, chest rise assessment, and deterioration cues.",
    learningObjectives: [
      "Identify when a patient needs assisted ventilation rather than oxygen alone.",
      "Describe effective BVM technique including seal, positioning, rate, and chest-rise targets.",
      "Recognize complications of over-ventilation and gastric insufflation.",
      "Use reassessment findings to adjust ventilation support during transport.",
    ],
    fieldAssessmentFocus: [
      "Respiratory rate that is too slow, too fast with fatigue, or irregular.",
      "Poor tidal volume despite oxygen delivery.",
      "Mental status changes suggesting rising CO₂ or hypoxia.",
      "Chest rise, compliance, mask seal, and airway positioning during ventilations.",
    ],
    clinicalDecisionPoints: [
      "Assist ventilations when respiratory effort is inadequate or failing.",
      "Use two-person BVM technique whenever possible for better seal and control.",
      "Ventilate enough to see chest rise; avoid aggressive bagging.",
      "Escalate airway strategy if effective ventilation cannot be maintained.",
    ],
    commonMistakes: [
      "Bagging too fast and reducing venous return in shock or arrest.",
      "Watching the bag instead of watching chest rise and patient response.",
      "Failing to reposition the airway when ventilation becomes difficult.",
      "Treating BVM as a last resort instead of early support for failing ventilation.",
    ],
    scenarioPrompt:
      "An overdose patient has pinpoint pupils, shallow respirations at 6/min, and SpO₂ 78%. What tells you this is a ventilation problem before naloxone has time to work?",
    practiceTags: ["bvm", "assisted-ventilation", "overdose", "respiratory-failure", "airway-positioning"],
    flashcardDecks: ["BVM Technique", "Ventilation Failure", "Airway Escalation"],
  },
  {
    slug: "airway-obstruction-and-suctioning",
    title: "Airway Obstruction and Suctioning",
    module: "airway-foundations",
    level: "core",
    estimatedMinutes: 34,
    acuity: "critical",
    seoTitle: "Airway Obstruction and Suctioning for Paramedics | EMS Guide",
    seoDescription:
      "Recognize upper-airway obstruction, gurgling, vomitus, blood, and suctioning priorities in prehospital airway management.",
    learningObjectives: [
      "Recognize partial and complete airway obstruction cues in adult and pediatric patients.",
      "Prioritize suctioning when fluid, blood, or vomitus prevents oxygenation or ventilation.",
      "Sequence positioning, manual maneuvers, suction, and ventilation support.",
      "Identify when obstruction requires rapid transport and advanced airway backup.",
    ],
    fieldAssessmentFocus: [
      "Noisy airway: gurgling, snoring, stridor, wheeze, silence, or ineffective cough.",
      "Visible vomitus, blood, secretions, swelling, dental trauma, or foreign body.",
      "Ability to speak, cough, protect airway, and maintain posture.",
      "Recurrent contamination during transport.",
    ],
    clinicalDecisionPoints: [
      "Clear visible obstruction and suction before attempting ventilation when contamination is present.",
      "Use manual maneuvers and positioning to improve upper-airway patency.",
      "Reassess after every suction attempt because airway contamination can recur.",
      "Prepare for escalation when obstruction persists or ventilation remains ineffective.",
    ],
    commonMistakes: [
      "Applying oxygen over a contaminated airway without clearing it.",
      "Assuming wheeze is lower-airway bronchospasm when upper-airway sounds are present.",
      "Delaying transport in recurrent vomiting or facial trauma.",
      "Failing to reassess after turning or moving the patient.",
    ],
    scenarioPrompt:
      "A trauma patient has blood in the mouth, snoring respirations, and decreasing responsiveness. What is the safest sequence before BVM ventilation?",
    practiceTags: ["suction", "obstruction", "trauma", "vomiting", "airway-contamination"],
    flashcardDecks: ["Suctioning", "Airway Obstruction", "Trauma Airway"],
  },
  {
    slug: "respiratory-distress-vs-failure",
    title: "Respiratory Distress vs Respiratory Failure",
    module: "airway-foundations",
    level: "core",
    estimatedMinutes: 40,
    acuity: "critical",
    seoTitle: "Respiratory Distress vs Failure for Paramedics | EMS Assessment",
    seoDescription:
      "Learn how paramedics distinguish respiratory distress from respiratory failure using work of breathing, fatigue, mental status, and ventilation adequacy.",
    learningObjectives: [
      "Differentiate respiratory distress, respiratory failure, and respiratory arrest risk.",
      "Use work of breathing, mental status, and tidal volume to judge ventilation adequacy.",
      "Identify deterioration patterns in asthma, COPD, pulmonary edema, overdose, and sepsis.",
      "Select oxygen, CPAP, BVM, or rapid transport based on trajectory.",
    ],
    fieldAssessmentFocus: [
      "Tripod positioning, accessory muscles, retractions, nasal flaring, or exhaustion.",
      "Rising anxiety followed by drowsiness or confusion.",
      "Silent chest, reduced chest rise, or falling respiratory effort.",
      "SpO₂ trend plus clinical signs of ventilation failure.",
    ],
    clinicalDecisionPoints: [
      "Treat distress early but prepare for failure when fatigue appears.",
      "Do not wait for SpO₂ collapse when mental status and tidal volume are worsening.",
      "Consider CPAP for severe respiratory distress with adequate mental status and protocol support.",
      "Use BVM when ventilation is inadequate or the patient cannot maintain effort.",
    ],
    commonMistakes: [
      "Calling a patient stable because they are still awake despite severe fatigue.",
      "Missing the transition from loud wheezing to a silent chest.",
      "Using SpO₂ as a late marker instead of assessing ventilation directly.",
      "Failing to prepare backup airway support while initial treatments are attempted.",
    ],
    scenarioPrompt:
      "A severe asthma patient who was anxious and wheezing is now quiet, drowsy, and barely moving air. What changed clinically?",
    practiceTags: ["respiratory-distress", "respiratory-failure", "asthma", "copd", "cpap", "bvm"],
    flashcardDecks: ["Respiratory Failure", "EMS Deterioration", "Asthma and COPD"],
  },
  {
    slug: "capnography-basics-for-paramedics",
    title: "Capnography Basics for Paramedics",
    module: "airway-foundations",
    level: "advanced",
    estimatedMinutes: 38,
    acuity: "urgent",
    seoTitle: "Capnography Basics for Paramedics | EMS EtCO₂ Guide",
    seoDescription:
      "Understand EtCO₂ trends, ventilation assessment, airway confirmation, shock states, and resuscitation clues for paramedic practice.",
    learningObjectives: [
      "Explain what EtCO₂ reflects in ventilation, perfusion, and metabolism.",
      "Use capnography trends to evaluate ventilation effectiveness and deterioration.",
      "Recognize capnography uses in airway confirmation, ROSC suspicion, bronchospasm, and shock.",
      "Avoid interpreting EtCO₂ values without the clinical picture.",
    ],
    fieldAssessmentFocus: [
      "EtCO₂ value, waveform shape, and trend over time.",
      "Ventilation rate and depth compared with waveform changes.",
      "Perfusion context: shock, arrest, sepsis, pulmonary embolism, or trauma.",
      "Bronchospasm pattern and response to treatment.",
    ],
    clinicalDecisionPoints: [
      "Use waveform capnography to support airway placement confirmation when available and indicated.",
      "Trend EtCO₂ during assisted ventilation to avoid over- or under-ventilation.",
      "Recognize sudden EtCO₂ rise during resuscitation as a possible ROSC clue.",
      "Escalate care when EtCO₂ trends conflict with appearance or vital signs.",
    ],
    commonMistakes: [
      "Treating EtCO₂ as only a tube-confirmation tool.",
      "Ignoring waveform shape and relying only on the number.",
      "Assuming low EtCO₂ always means hyperventilation without considering shock or low perfusion.",
      "Over-ventilating to chase a number instead of patient physiology.",
    ],
    scenarioPrompt:
      "During CPR, EtCO₂ suddenly rises from 12 to 38 mmHg and the waveform becomes stronger. What should the team reassess immediately?",
    practiceTags: ["capnography", "etco2", "rosc", "ventilation", "shock", "airway-confirmation"],
    flashcardDecks: ["Capnography", "Resuscitation Clues", "Ventilation Monitoring"],
  },
];

export function calculateParamedicAirwayReadinessPercent(
  lessons: ParamedicAirwayLesson[] = PARAMEDIC_AIRWAY_FOUNDATION_LESSONS,
): number {
  if (!lessons.length) return 0;

  const requiredFields: Array<keyof ParamedicAirwayLesson> = [
    "slug",
    "title",
    "seoTitle",
    "seoDescription",
    "scenarioPrompt",
  ];

  let earned = 0;
  let possible = 0;

  for (const lesson of lessons) {
    for (const field of requiredFields) {
      possible += 1;
      const value = lesson[field];
      if (typeof value === "string" && value.trim().length >= 12) earned += 1;
    }

    const arrays = [
      lesson.learningObjectives,
      lesson.fieldAssessmentFocus,
      lesson.clinicalDecisionPoints,
      lesson.commonMistakes,
      lesson.practiceTags,
      lesson.flashcardDecks,
    ];

    for (const arr of arrays) {
      possible += 1;
      if (Array.isArray(arr) && arr.length >= 3 && arr.every((item) => item.trim().length >= 4)) earned += 1;
    }
  }

  return Math.round((earned / possible) * 100);
}

export const PARAMEDIC_AIRWAY_FOUNDATIONS_READINESS_PERCENT = calculateParamedicAirwayReadinessPercent();
