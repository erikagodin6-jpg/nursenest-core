export type ParamedicTraumaAcuity = "stable" | "urgent" | "critical";

export type ParamedicTraumaLesson = {
  slug: string;
  title: string;
  module: "trauma-foundations";
  level: "foundation" | "core" | "advanced";
  estimatedMinutes: number;
  acuity: ParamedicTraumaAcuity;
  seoTitle: string;
  seoDescription: string;
  learningObjectives: string[];
  sceneSizeUpFocus: string[];
  primarySurveyPriorities: string[];
  transportDecisionPoints: string[];
  commonMistakes: string[];
  scenarioPrompt: string;
  practiceTags: string[];
  flashcardDecks: string[];
};

export const PARAMEDIC_TRAUMA_FOUNDATIONS_MODULE = {
  slug: "trauma-foundations",
  title: "Paramedic Trauma Foundations",
  shortTitle: "Trauma Foundations",
  description:
    "Prehospital trauma assessment, hemorrhage control, shock recognition, chest trauma, spinal precautions, and rapid transport decision-making for paramedic learners.",
  positioning:
    "Train fast trauma prioritization under field conditions: scene safety, life threats, bleeding, airway, shock, packaging, and transport.",
  primarySeoKeyword: "paramedic trauma assessment",
  secondarySeoKeywords: [
    "EMS trauma assessment",
    "prehospital hemorrhage control",
    "paramedic shock recognition",
    "chest trauma EMS management",
    "trauma primary survey paramedic",
  ],
  readinessTargetPercent: 95,
} as const;

export const PARAMEDIC_TRAUMA_FOUNDATION_LESSONS: ParamedicTraumaLesson[] = [
  {
    slug: "trauma-scene-size-up",
    title: "Trauma Scene Size-Up and Mechanism of Injury",
    module: "trauma-foundations",
    level: "foundation",
    estimatedMinutes: 30,
    acuity: "urgent",
    seoTitle: "Trauma Scene Size-Up for Paramedics | EMS MOI Guide",
    seoDescription:
      "Learn paramedic trauma scene size-up, mechanism of injury assessment, hazards, resource requests, and early transport thinking.",
    learningObjectives: [
      "Identify scene hazards that must be controlled before patient contact.",
      "Use mechanism of injury to predict hidden trauma patterns without delaying the primary survey.",
      "Determine when to request additional EMS, fire, police, air medical, or extrication resources.",
      "Connect scene findings to transport destination and packaging urgency.",
    ],
    sceneSizeUpFocus: [
      "Number of patients and need for triage or additional units.",
      "Vehicle damage, intrusion, ejection, rollover, speed, fall height, blast, or penetrating mechanism.",
      "Hazards such as traffic, fire, unstable structures, violence, weather, electricity, or hazardous materials.",
      "Extrication complexity and whether treatment must occur in place before movement.",
    ],
    primarySurveyPriorities: [
      "Do not let dramatic mechanism distract from immediate airway, breathing, circulation, disability, and exposure priorities.",
      "Identify uncontrolled hemorrhage early and intervene before a full secondary assessment.",
      "Reassess after movement, extrication, or transfer because deterioration can appear after packaging.",
    ],
    transportDecisionPoints: [
      "High-energy mechanism plus abnormal vital signs should push early destination decisions.",
      "Consider trauma center criteria, local bypass rules, transport time, and patient instability.",
      "Avoid scene delay when life threats are controlled enough for safe transport.",
    ],
    commonMistakes: [
      "Spending too long reconstructing mechanism while missing active life threats.",
      "Underestimating occult injury because the patient is initially awake and talking.",
      "Failing to request resources early when extrication or multiple patients are present.",
      "Not updating transport priority when vital signs worsen after movement.",
    ],
    scenarioPrompt:
      "You arrive at a rollover MVC with one ejected patient and one trapped driver. Fuel is leaking, bystanders are yelling, and traffic is still moving. What are your first scene decisions before patient assessment?",
    practiceTags: ["trauma", "scene-size-up", "moi", "resource-request", "triage"],
    flashcardDecks: ["Trauma Scene Size-Up", "MOI Patterns", "EMS Resource Decisions"],
  },
  {
    slug: "trauma-primary-survey-xabcde",
    title: "Trauma Primary Survey: XABCDE Priorities",
    module: "trauma-foundations",
    level: "core",
    estimatedMinutes: 38,
    acuity: "critical",
    seoTitle: "Trauma Primary Survey XABCDE for Paramedics | EMS Guide",
    seoDescription:
      "Practice XABCDE trauma priorities: catastrophic bleeding, airway, breathing, circulation, disability, exposure, and rapid reassessment.",
    learningObjectives: [
      "Use XABCDE to sequence trauma care under pressure.",
      "Prioritize catastrophic hemorrhage before airway when immediate exsanguination risk exists.",
      "Recognize breathing and circulation threats that require immediate intervention.",
      "Differentiate rapid primary survey actions from detailed secondary assessment tasks.",
    ],
    sceneSizeUpFocus: [
      "Patient position, visible bleeding, trapped limbs, airway contamination, and chest movement.",
      "Whether the environment allows immediate intervention or requires rapid movement.",
      "Number of providers available to split hemorrhage, airway, and packaging tasks.",
    ],
    primarySurveyPriorities: [
      "X: control life-threatening external hemorrhage immediately.",
      "A: assess patency, obstruction, contamination, facial trauma, and mental status.",
      "B: assess chest rise, respiratory effort, open chest wounds, flail segment, and tension pneumothorax signs.",
      "C: assess pulse quality, skin signs, major bleeding, and shock indicators.",
      "D/E: identify major neurologic changes and expose enough to find life threats while preventing hypothermia.",
    ],
    transportDecisionPoints: [
      "If XABCDE finds unstable life threats, minimize scene time after essential interventions.",
      "Package early when the patient needs definitive surgical or trauma-center care.",
      "Repeat XABCDE after each major movement, intervention, or clinical change.",
    ],
    commonMistakes: [
      "Completing a head-to-toe exam before controlling major bleeding.",
      "Treating airway as isolated while ignoring chest trauma and shock.",
      "Skipping exposure and missing posterior bleeding or penetrating wounds.",
      "Forgetting hypothermia prevention after exposing a trauma patient.",
    ],
    scenarioPrompt:
      "A motorcycle crash patient is pale, confused, has a spurting thigh wound, and is gasping but moving air. How do you sequence XABCDE in the first minute?",
    practiceTags: ["xabcde", "primary-survey", "hemorrhage", "shock", "trauma-prioritization"],
    flashcardDecks: ["XABCDE", "Primary Survey", "Trauma Priorities"],
  },
  {
    slug: "hemorrhage-control-prehospital",
    title: "Prehospital Hemorrhage Control",
    module: "trauma-foundations",
    level: "core",
    estimatedMinutes: 42,
    acuity: "critical",
    seoTitle: "Prehospital Hemorrhage Control for Paramedics | EMS Trauma",
    seoDescription:
      "Learn EMS hemorrhage control decisions: direct pressure, tourniquets, wound packing, junctional bleeding, shock risk, and reassessment.",
    learningObjectives: [
      "Differentiate minor bleeding from life-threatening hemorrhage requiring immediate control.",
      "Select direct pressure, pressure dressing, tourniquet, or wound packing based on wound location and severity.",
      "Recognize junctional bleeding and areas where standard extremity tourniquets do not work.",
      "Reassess bleeding control after movement, packaging, and transport vibration.",
    ],
    sceneSizeUpFocus: [
      "Visible pooling blood, soaked clothing, spurting bleeding, partial amputations, and altered mental status.",
      "Wound location: compressible extremity, junctional, torso, scalp, or concealed internal source.",
      "Available equipment, provider count, lighting, weather, and need for rapid extrication.",
    ],
    primarySurveyPriorities: [
      "Control catastrophic external hemorrhage before moving into later primary survey steps.",
      "Expose enough to find hidden bleeding while preventing heat loss.",
      "Check distal circulation and document tourniquet time when applicable.",
    ],
    transportDecisionPoints: [
      "Persistent hemorrhage, shock signs, penetrating torso trauma, or suspected internal bleeding require rapid transport.",
      "Do not delay transport for perfect bandaging when life threats are controlled enough to move.",
      "Choose a destination capable of definitive hemorrhage control according to local trauma criteria.",
    ],
    commonMistakes: [
      "Using repeated loose dressings instead of escalating hemorrhage control.",
      "Placing tourniquets too distally or failing to tighten until bleeding stops.",
      "Ignoring occult internal bleeding when external bleeding is minimal but shock is present.",
      "Not reassessing after movement or loading into the ambulance.",
    ],
    scenarioPrompt:
      "A farm injury patient has a deep medial thigh wound with rapid bleeding. Direct pressure slows but does not stop it, and the patient is becoming pale. What is your next hemorrhage-control decision?",
    practiceTags: ["hemorrhage", "tourniquet", "wound-packing", "shock", "junctional-bleeding"],
    flashcardDecks: ["Bleeding Control", "Tourniquets", "Trauma Shock"],
  },
  {
    slug: "traumatic-shock-recognition",
    title: "Traumatic Shock Recognition",
    module: "trauma-foundations",
    level: "core",
    estimatedMinutes: 40,
    acuity: "critical",
    seoTitle: "Traumatic Shock Recognition for Paramedics | EMS Assessment",
    seoDescription:
      "Recognize compensated and decompensated traumatic shock using skin signs, mental status, pulse quality, mechanism, and vital sign trends.",
    learningObjectives: [
      "Recognize compensated shock before hypotension appears.",
      "Connect mechanism, bleeding risk, skin signs, pulse quality, and mental status to perfusion status.",
      "Differentiate hemorrhagic shock from obstructive, neurogenic, and distributive patterns when possible in the field.",
      "Use trends to guide transport urgency and reassessment frequency.",
    ],
    sceneSizeUpFocus: [
      "High-energy mechanism, penetrating trauma, pelvic injury, abdominal trauma, long-bone fractures, or crush injury.",
      "Patient appearance: anxiety, restlessness, confusion, pallor, diaphoresis, delayed capillary refill, weak pulses.",
      "Vital sign trends, not one isolated blood pressure.",
    ],
    primarySurveyPriorities: [
      "Control external hemorrhage and search for hidden life threats.",
      "Support oxygenation and ventilation while prioritizing perfusion-sensitive transport decisions.",
      "Prevent hypothermia because it worsens coagulopathy and trauma outcomes.",
    ],
    transportDecisionPoints: [
      "Do not wait for hypotension to declare a patient unstable.",
      "Shock signs after trauma should trigger early trauma-center thinking.",
      "Rapid transport is essential when definitive bleeding control is surgical or hospital-based.",
    ],
    commonMistakes: [
      "Calling a trauma patient stable because systolic BP is still normal.",
      "Missing occult hemorrhage in abdominal, pelvic, or chest trauma.",
      "Over-focusing on pain while ignoring perfusion signs.",
      "Forgetting warming measures in wet, exposed, or cold trauma patients.",
    ],
    scenarioPrompt:
      "A fall patient has pelvic pain, HR 128, cool clammy skin, confusion, and BP 108/72. Why is this not reassuring?",
    practiceTags: ["shock", "trauma", "perfusion", "hemorrhage", "hypothermia"],
    flashcardDecks: ["Trauma Shock", "Perfusion Signs", "Occult Bleeding"],
  },
  {
    slug: "chest-trauma-and-breathing-threats",
    title: "Chest Trauma and Breathing Threats",
    module: "trauma-foundations",
    level: "advanced",
    estimatedMinutes: 44,
    acuity: "critical",
    seoTitle: "Chest Trauma EMS Management | Paramedic Breathing Threats",
    seoDescription:
      "Study EMS chest trauma assessment: open pneumothorax, tension pneumothorax, flail chest, hemothorax, respiratory compromise, and rapid transport.",
    learningObjectives: [
      "Identify chest trauma patterns that threaten ventilation, oxygenation, or circulation.",
      "Recognize signs of open pneumothorax, tension physiology, flail segment, and major thoracic bleeding.",
      "Sequence airway, breathing, occlusive dressing, ventilation support, and rapid transport decisions.",
      "Reassess chest findings after interventions and during transport.",
    ],
    sceneSizeUpFocus: [
      "Blunt or penetrating chest mechanism, steering wheel impact, stab/gunshot wound, crush injury, or blast exposure.",
      "Chest wall movement, wounds, asymmetry, respiratory distress, cyanosis, JVD, tracheal deviation if late, or worsening shock.",
      "Whether treatment can be initiated quickly on scene or must continue en route.",
    ],
    primarySurveyPriorities: [
      "Assess breathing immediately after airway and catastrophic bleeding control.",
      "Expose the chest enough to find penetrating wounds while preventing heat loss.",
      "Apply indicated dressings and support ventilation according to local protocol.",
      "Monitor for deterioration after sealing chest wounds or moving the patient.",
    ],
    transportDecisionPoints: [
      "Suspected tension physiology, penetrating chest trauma, or severe respiratory compromise requires rapid transport.",
      "Destination should match trauma system criteria and available interventions.",
      "Do not delay transport for repeated on-scene reassessments if the patient is worsening.",
    ],
    commonMistakes: [
      "Missing posterior or lateral chest wounds because exposure was incomplete.",
      "Treating respiratory distress as anxiety after chest trauma.",
      "Failing to reassess after occlusive dressing placement.",
      "Waiting for late textbook signs before suspecting tension physiology.",
    ],
    scenarioPrompt:
      "A stabbed patient has increasing dyspnea, unilateral decreased breath sounds, tachycardia, and worsening hypotension after an occlusive dressing. What threat are you worried about?",
    practiceTags: ["chest-trauma", "pneumothorax", "tension-pneumothorax", "flail-chest", "rapid-transport"],
    flashcardDecks: ["Chest Trauma", "Breathing Threats", "Trauma Deterioration"],
  },
  {
    slug: "spinal-motion-restriction-and-neuro-checks",
    title: "Spinal Motion Restriction and Neuro Checks",
    module: "trauma-foundations",
    level: "core",
    estimatedMinutes: 34,
    acuity: "urgent",
    seoTitle: "Spinal Motion Restriction for Paramedics | EMS Neuro Checks",
    seoDescription:
      "Learn spinal motion restriction decisions, neurologic assessment, high-risk mechanisms, and reassessment priorities for EMS trauma care.",
    learningObjectives: [
      "Identify high-risk mechanisms and exam findings that support spinal motion restriction.",
      "Perform focused neurologic checks without delaying life-threat management.",
      "Balance spinal precautions with airway, breathing, hemorrhage, and transport priorities.",
      "Reassess neurologic status after movement, packaging, and transport changes.",
    ],
    sceneSizeUpFocus: [
      "Fall height, axial load, diving injury, rollover, ejection, pedestrian struck, or high-speed collision.",
      "Pain, numbness, weakness, paralysis, altered mental status, intoxication, distracting injury, or communication barriers.",
      "Need for extrication, patient position, and whether airway or bleeding threats override slower packaging.",
    ],
    primarySurveyPriorities: [
      "Manual stabilization should not delay catastrophic hemorrhage or airway correction.",
      "Check movement, sensation, and distal perfusion when feasible before and after movement.",
      "Avoid excessive scene time when neurologic deficit or unstable trauma suggests urgent destination needs.",
    ],
    transportDecisionPoints: [
      "Neurologic deficits after trauma increase urgency and destination importance.",
      "Spinal motion restriction is a risk-reduction strategy, not a reason to delay care of life threats.",
      "Transport position should consider airway, vomiting risk, respiratory mechanics, and local protocol.",
    ],
    commonMistakes: [
      "Prioritizing perfect immobilization over airway or hemorrhage control.",
      "Skipping neurologic reassessment after extrication.",
      "Assuming absence of pain excludes spinal injury when mental status is altered.",
      "Using outdated rigid-board thinking without patient-centered reassessment.",
    ],
    scenarioPrompt:
      "A confused fall patient has neck pain, weak grips, and vomits when supine. How do you balance airway safety, spinal precautions, and transport?",
    practiceTags: ["spinal-motion-restriction", "neuro-checks", "trauma", "extrication", "airway-risk"],
    flashcardDecks: ["Spinal Precautions", "Neuro Checks", "Trauma Packaging"],
  },
];

export function calculateParamedicTraumaReadinessPercent(
  lessons: ParamedicTraumaLesson[] = PARAMEDIC_TRAUMA_FOUNDATION_LESSONS,
): number {
  if (!lessons.length) return 0;

  const requiredFields: Array<keyof ParamedicTraumaLesson> = [
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
      lesson.sceneSizeUpFocus,
      lesson.primarySurveyPriorities,
      lesson.transportDecisionPoints,
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

export const PARAMEDIC_TRAUMA_FOUNDATIONS_READINESS_PERCENT = calculateParamedicTraumaReadinessPercent();
