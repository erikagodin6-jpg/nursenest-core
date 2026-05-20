type RtQuizItem = {
  question: string;
  options: string[];
  correct: number;
  rationale: string;
};

type RtSection = {
  id: string;
  heading: string;
  kind: string;
  body: string;
};

type RtFloorLessonInput = {
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  seoTitle: string;
  seoDescription: string;
  clinicalMeaning: string;
  coreConcept: string;
  scenario: string;
  examRelevance: string;
  takeaways: string;
  studyTakeaways: string[];
  studyCommonTraps: string[];
  preTest: RtQuizItem[];
  postTest: RtQuizItem[];
};

function quiz(question: string, options: string[], correct: number, rationale: string): RtQuizItem {
  return { question, options, correct, rationale };
}

function sectionsFor(input: RtFloorLessonInput): RtSection[] {
  return [
    { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: input.clinicalMeaning },
    { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: input.coreConcept },
    { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: input.scenario },
    { id: "exam-relevance", heading: "Clinical Practice Relevance", kind: "exam_relevance", body: input.examRelevance },
    { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: input.takeaways },
  ];
}

function lesson(input: RtFloorLessonInput) {
  return {
    pathwayId: "us-allied-core",
    slug: input.slug,
    title: input.title,
    topic: input.topic,
    topicSlug: input.topicSlug,
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    alliedProfessionKey: "respiratory",
    sections: sectionsFor(input),
    studyTakeaways: input.studyTakeaways,
    studyCommonTraps: input.studyCommonTraps,
    preTest: input.preTest,
    postTest: input.postTest,
  };
}

export const respiratoryTherapyFloorPracticeLessons = [
  lesson({
    slug: "rt-high-pressure-alarm-bedside-response",
    title: "High Pressure Alarm: Bedside Response",
    topic: "Ventilator Alarms",
    topicSlug: "ventilator-alarms",
    seoTitle: "High Pressure Ventilator Alarm Response for Respiratory Therapists",
    seoDescription: "Floor-practice RT lesson on high pressure alarms, patient-first assessment, resistance vs compliance, bagging, waveforms, and escalation.",
    clinicalMeaning:
      "A high pressure alarm is a bedside warning that the ventilator is meeting excessive resistance to breath delivery or the lung is becoming harder to inflate. For future RTs, the key is not memorizing a cause list. The key is the first 30 seconds: look at the patient, check oxygenation and chest rise, decide whether the patient is unstable, and separate airway resistance from poor compliance. A high pressure alarm can be harmless coughing, but it can also be mucus plugging, bronchospasm, pneumothorax, biting the tube, kinked tubing, water in the circuit, or rapid ARDS deterioration.",
    coreConcept:
      "Use a patient-first workflow. First assess the patient, not the ventilator screen. If the patient is severely unstable, disconnect from the ventilator and manually ventilate with 100% oxygen while calling for help according to local policy. If the patient stabilizes with manual ventilation, troubleshoot the ventilator and circuit. If bagging is difficult, think airway obstruction, bronchospasm, mucus plug, kinked tube, or compliance catastrophe. Rising peak pressure with stable plateau pressure suggests resistance. Rising peak and plateau together suggests compliance problems such as ARDS, edema, pneumothorax, atelectasis, or abdominal pressure.",
    scenario:
      "You walk into an ICU room for a high pressure alarm. The patient is restless, SpO2 is falling from 94% to 84%, and the flow waveform looks irregular. The wrong move is to silence the alarm and scroll settings. The correct sequence is patient assessment, oxygenation check, airway and circuit scan, suction readiness, manual ventilation if unstable, then focused troubleshooting. If secretions are suspected, suction and reassess. If breath sounds are suddenly absent on one side with hypotension, escalate immediately for possible tension physiology.",
    examRelevance:
      "This is not only an exam skill; it is a floor survival skill. New RTs often freeze because alarms feel like machine problems. The safe habit is to treat alarms as patient problems until proven otherwise. Your decision tree should always include: patient, airway, circuit, waveform, pressure pattern, intervention, reassessment, and communication.",
    takeaways:
      "High pressure means delivery is harder. Look at the patient first. If unstable, oxygenate and ventilate manually while escalating. Then decide resistance versus compliance and fix the cause, not just the number.",
    studyTakeaways: ["Patient first, ventilator second.", "Peak-only pressure rise suggests resistance.", "Peak and plateau rise together suggests compliance."],
    studyCommonTraps: ["Silencing alarms before assessing the patient", "Assuming every high pressure alarm is secretions", "Forgetting pneumothorax in sudden decompensation"],
    preTest: [quiz("What is the first priority when a ventilated patient has a high pressure alarm and desaturates?", ["Silence the alarm", "Look at and assess the patient", "Increase tidal volume", "Leave to get supplies"], 1, "The patient is the priority. Ventilator data matters after immediate patient assessment.")],
    postTest: [quiz("Rising peak pressure with stable plateau pressure most strongly suggests:", ["Airway resistance", "Improved compliance", "Metabolic acidosis", "Low FiO2"], 0, "Peak-only pressure rise points toward resistance such as secretions, bronchospasm, tube biting, or kinked tubing.")],
  }),
  lesson({
    slug: "rt-low-pressure-alarm-disconnect-and-leak-workflow",
    title: "Low Pressure Alarm: Disconnect and Leak Workflow",
    topic: "Ventilator Alarms",
    topicSlug: "ventilator-alarms",
    seoTitle: "Low Pressure Ventilator Alarm Workflow for RT Students",
    seoDescription: "Real-world RT lesson on low pressure alarms, disconnections, cuff leaks, extubation risk, and immediate safety workflow.",
    clinicalMeaning:
      "A low pressure alarm usually means the ventilator cannot build or maintain expected pressure. On the floor, that often means a circuit disconnect, cuff leak, loose connection, patient disconnection, circuit break, or accidental extubation. The danger is loss of ventilation and oxygen delivery. Future RTs must treat low pressure alarms as potentially urgent until they confirm the patient is ventilating.",
    coreConcept:
      "Start at the patient and work backward through the circuit. Check chest rise, SpO2, airway position, tube depth, cuff status, patient connection, humidifier, water traps, inline suction catheter, and ventilator outlet. If the patient is unstable or disconnected from effective ventilation, reconnect immediately or manually ventilate with oxygen while help is called. A large leak may show low exhaled tidal volume, poor chest rise, inability to maintain pressure, low minute ventilation, and audible air leak. Never assume a low pressure alarm is benign in a trach or ETT patient.",
    scenario:
      "A trach patient alarms low pressure after repositioning. SpO2 falls, exhaled volume is low, and you hear air. You assess the patient and discover the circuit has partially separated at the swivel connector. The correct action is to reconnect, assess chest rise, check oxygenation, verify exhaled volume, and document the event and response. If the trach appears displaced or ventilation remains poor, escalate immediately and prepare emergency airway equipment.",
    examRelevance:
      "This is a practical safety workflow more than a board-prep concept. It teaches future RTs how to move from alarm to patient to connection to ventilation effectiveness. It also reinforces that leaks and disconnections are clinical emergencies when the patient depends on positive pressure.",
    takeaways:
      "Low pressure means pressure is escaping or not being generated. Check the patient and circuit immediately. Confirm ventilation by chest rise, oxygenation, and returned volume.",
    studyTakeaways: ["Work from patient to ventilator.", "Low exhaled volume is a major leak clue.", "Unstable patients need manual ventilation and escalation."],
    studyCommonTraps: ["Troubleshooting the ventilator before reconnecting the patient", "Ignoring cuff leak signs", "Missing accidental decannulation or extubation"],
    preTest: [quiz("A low pressure alarm most commonly suggests:", ["Increased compliance only", "Leak or disconnect", "High airway resistance", "Metabolic acidosis"], 1, "Low pressure alarms commonly occur when pressure escapes through leaks or disconnections.")],
    postTest: [quiz("In a dependent ventilated patient with low pressure alarm and falling SpO2, the safest first action is:", ["Check the patient and restore ventilation", "Chart the alarm", "Increase PEEP", "Wait for the nurse"], 0, "Immediate patient assessment and restoration of ventilation come first.")],
  }),
  lesson({
    slug: "rt-apnea-alarm-fatigue-sedation-and-niv-failure",
    title: "Apnea Alarm: Fatigue, Sedation, and NIV Failure",
    topic: "Ventilator Alarms",
    topicSlug: "ventilator-alarms",
    seoTitle: "Apnea Alarm Assessment for Respiratory Therapy Practice",
    seoDescription: "RT floor-practice lesson on apnea alarms, oversedation, respiratory fatigue, NIV failure, trigger settings, and escalation.",
    clinicalMeaning:
      "An apnea alarm means the ventilator is not detecting spontaneous breathing within the expected time window. For a future RT, this alarm should trigger an immediate question: is the patient not breathing, or is the ventilator not sensing the effort? Causes include oversedation, opioid effect, CNS depression, fatigue, worsening hypercapnia, poor mask fit during NIV, weak effort below trigger threshold, or circuit issues.",
    coreConcept:
      "Assess level of consciousness, chest movement, respiratory effort, oxygenation, end-tidal CO2 if available, ABG trend, ventilator trigger sensitivity, and backup ventilation. In NIV, repeated apnea or poor effort may signal failure and need for escalation. In invasive ventilation, the alarm may reveal sedation overshoot, neuromuscular weakness, worsening respiratory failure, or trigger mismatch. Do not simply increase alarm limits without understanding why the patient is not triggering breaths.",
    scenario:
      "A COPD patient on BiPAP has repeated apnea alarms and is increasingly drowsy. SpO2 is acceptable but PaCO2 has climbed. This is dangerous because oxygenation may look temporarily reassuring while ventilation is failing. The RT should assess mental status, mask fit, synchrony, delivered volumes, leak, backup rate, and notify the team for possible NIV failure and escalation.",
    examRelevance:
      "Future RTs need to understand that SpO2 can be misleading during hypoventilation. Apnea alarms connect directly to fatigue, sedation, hypercapnia, and failure of noninvasive support. The safest clinical reasoning asks whether the patient can maintain ventilation, not just oxygen saturation.",
    takeaways:
      "Apnea alarms are about absent or undetected breathing. Check the patient, effort, trigger, ventilation, sedation, and CO2 trend. Repeated apnea on NIV is an escalation warning.",
    studyTakeaways: ["SpO2 does not prove adequate ventilation.", "Repeated apnea on NIV may mean failure.", "Assess effort and trigger sensitivity together."],
    studyCommonTraps: ["Trusting SpO2 while PaCO2 rises", "Widening alarm settings without assessment", "Missing sedation-related hypoventilation"],
    preTest: [quiz("A patient with apnea alarms and rising PaCO2 is primarily showing failure of:", ["Ventilation", "Hemoglobin production", "Renal filtration", "Platelet function"], 0, "Rising PaCO2 with apnea points to inadequate ventilation.")],
    postTest: [quiz("Repeated apnea alarms on BiPAP with drowsiness should make the RT suspect:", ["NIV failure or hypoventilation", "Normal recovery", "Isolated oxygenation success", "No need for reassessment"], 0, "Drowsiness and apnea on NIV can indicate CO2 retention and failure of support.")],
  }),
  lesson({
    slug: "rt-first-icu-shift-prioritization",
    title: "First ICU Shift as an RT: Prioritization",
    topic: "On-the-Floor RT",
    topicSlug: "on-the-floor-rt",
    seoTitle: "First ICU Shift as a Respiratory Therapist: Prioritization",
    seoDescription: "New grad RT survival lesson on ICU assignment review, triage, ventilator checks, unstable patients, and shift prioritization.",
    clinicalMeaning:
      "The first ICU shift is not about knowing every answer. It is about building a safe prioritization routine. Future RTs need to know how to scan an assignment, identify unstable patients, complete ventilator checks, respond to pages, communicate concerns, and avoid getting trapped in low-priority tasks while a patient is deteriorating.",
    coreConcept:
      "Start with report and risk stratification. Identify intubated patients, high oxygen needs, unstable ABGs, frequent alarms, new admissions, recent intubations, proned patients, trach emergencies, NIV patients at risk of failure, and anyone with escalating oxygen demand. Then perform focused vent checks: patient appearance, SpO2 trend, breath sounds, secretions, mode, settings, measured values, pressures, waveforms, alarms, humidification, airway security, and backup equipment. Prioritize the unstable over the routine.",
    scenario:
      "Your assignment includes one stable chronic trach, one post-op patient on nasal cannula, one COPD patient on BiPAP with rising CO2, and one ARDS patient on high PEEP with frequent desaturations. The new grad mistake is to round room by room in order. The safer RT approach is to see the BiPAP and ARDS patients first, verify emergency equipment, communicate concerns early, and then complete stable checks.",
    examRelevance:
      "This module is not exam-only content. It builds the workflow future RTs need on the floor. It should be treated as transition-to-practice training and revisited before clinical placements, preceptorship, and the first job.",
    takeaways:
      "Start every shift by identifying who can crash first. Triage by instability, oxygen demand, ventilation failure, alarms, and airway risk. Routine checks matter, but unstable patients come first.",
    studyTakeaways: ["Risk-stratify before routine rounds.", "NIV failure and high PEEP patients deserve early assessment.", "Communicate concern before the patient crashes."],
    studyCommonTraps: ["Rounding only by room order", "Spending too long with stable patients first", "Failing to identify NIV failure risk"],
    preTest: [quiz("Which patient should generally be prioritized first?", ["Stable room-air patient", "NIV patient becoming drowsy with rising CO2", "Stable chronic trach with no changes", "Patient waiting for routine inhaler"], 1, "Drowsiness and rising CO2 on NIV suggest possible ventilatory failure.")],
    postTest: [quiz("A safe first-shift RT habit is to:", ["Ignore report and start alphabetically", "Risk-stratify the assignment", "Avoid calling for help", "Delay unstable vent checks"], 1, "Risk stratification helps identify who can deteriorate first.")],
  }),
  lesson({
    slug: "rt-vent-check-workflow-that-catches-deterioration",
    title: "Vent Checks That Catch Deterioration",
    topic: "On-the-Floor RT",
    topicSlug: "on-the-floor-rt",
    seoTitle: "Respiratory Therapist Vent Check Workflow",
    seoDescription: "Practical RT lesson on ventilator checks, waveforms, pressures, secretion burden, cuff checks, humidification, alarms, and deterioration detection.",
    clinicalMeaning:
      "A vent check is not a box-ticking exercise. It is a structured safety assessment that can catch worsening compliance, increased resistance, secretion burden, dyssynchrony, leak, oxygenation failure, and early deterioration. Future RTs need to learn what experienced RTs are really scanning for during each check.",
    coreConcept:
      "A strong vent check includes patient appearance, work of breathing, synchrony, SpO2 trend, breath sounds, airway security, cuff status per policy, humidification, circuit condition, mode, set values, measured values, peak pressure, plateau pressure when appropriate, PEEP, exhaled tidal volume, minute ventilation, leak, alarm history, waveform shape, secretion amount, and response to recent interventions. The question is always: is this patient stable, improving, or trending toward failure?",
    scenario:
      "During a routine vent check, you notice peak pressures are higher than the prior round, exhaled tidal volume is lower, secretions are thick, and the flow waveform is irregular. This is not just documentation. It is a clinical signal. You assess the patient, suction, check humidification, reassess waveform and pressure, and report persistent changes to the team.",
    examRelevance:
      "This is floor authority content. It helps RT students and new grads understand how routine work prevents emergencies. It also supports higher retention because users return before clinicals and early shifts.",
    takeaways:
      "A vent check asks whether the patient, airway, circuit, and ventilator still match. Trends matter more than isolated values. Document what changed and what happened after intervention.",
    studyTakeaways: ["Vent checks are clinical assessments.", "Trend pressures, exhaled volumes, waveforms, and alarms.", "Reassess after suction or setting changes."],
    studyCommonTraps: ["Copying numbers without clinical interpretation", "Ignoring alarm history", "Failing to compare current pressures with baseline"],
    preTest: [quiz("A vent check should primarily determine:", ["Only the ventilator brand", "Whether the patient and ventilator are stable together", "Only the room temperature", "Only the charting time"], 1, "Vent checks assess patient-ventilator status and trends.")],
    postTest: [quiz("A rising peak pressure trend during vent checks should prompt:", ["Clinical assessment and troubleshooting", "No action ever", "Automatic discharge", "Ignoring waveform changes"], 0, "Pressure trends require assessment for resistance, compliance, circuit, or patient changes.")],
  }),
  lesson({
    slug: "rt-responding-to-desaturation-pages",
    title: "Responding to Desaturation Pages",
    topic: "On-the-Floor RT",
    topicSlug: "on-the-floor-rt",
    seoTitle: "Responding to Oxygen Desaturation as a Respiratory Therapist",
    seoDescription: "RT floor-practice lesson on desaturation response, oxygen device assessment, airway, work of breathing, escalation, and reassessment.",
    clinicalMeaning:
      "A desaturation page is one of the most common real-world RT calls. The floor skill is quickly deciding whether this is probe artifact, transient exertion, secretion/atelectasis, device displacement, bronchospasm, pulmonary edema, aspiration, pneumothorax, PE, or impending respiratory failure. Future RTs need a reproducible approach that prevents panic and missed deterioration.",
    coreConcept:
      "Assess the patient first: appearance, airway, breathing pattern, work of breathing, mental status, skin color, speech, chest rise, breath sounds, and pulse oximeter signal. Then check the oxygen delivery device: correct device, flow, FiO2, placement, tubing, humidification, water, and source. Intervene within scope: reposition, coach breathing, titrate oxygen per protocol, suction if indicated, deliver ordered therapy, prepare escalation, and communicate clearly. Reassess SpO2, work of breathing, and overall trajectory after each intervention.",
    scenario:
      "A ward patient on 2 L nasal cannula is suddenly 82%. You arrive and find the cannula displaced, but the patient is also tachypneic with crackles. You replace the device and oxygen improves only to 88%. The right move is not to leave because the number improved slightly. You reassess, escalate concern, and prepare for further evaluation because the clinical picture suggests ongoing respiratory compromise.",
    examRelevance:
      "This module helps future RTs on the floor because desaturation calls are frequent and variable. The goal is not one perfect answer. The goal is a consistent patient-device-escalation-reassessment workflow.",
    takeaways:
      "Treat desaturation as real until proven otherwise. Confirm signal, assess patient, check device, intervene, reassess, and escalate when the patient remains clinically concerning.",
    studyTakeaways: ["Check probe signal but never ignore the patient.", "Device displacement is common but may not be the whole problem.", "Reassess after oxygen changes."],
    studyCommonTraps: ["Leaving after a small SpO2 improvement", "Treating the monitor instead of the patient", "Forgetting device setup and oxygen source checks"],
    preTest: [quiz("A desaturation page should begin with:", ["Patient assessment", "Chart review only", "Changing all settings blindly", "Ignoring the call"], 0, "Assess the patient first to determine urgency and likely mechanism.")],
    postTest: [quiz("If SpO2 improves slightly but work of breathing remains high, the RT should:", ["Leave immediately", "Reassess and escalate concern", "Remove oxygen", "Ignore breathing pattern"], 1, "Persistent distress despite improved SpO2 requires reassessment and escalation.")],
  }),
  lesson({
    slug: "rt-accidental-extubation-and-airway-emergency-role",
    title: "Accidental Extubation and RT Airway Role",
    topic: "RT Emergency Response",
    topicSlug: "rt-emergency-response",
    seoTitle: "Accidental Extubation Response for Respiratory Therapists",
    seoDescription: "RT emergency lesson on accidental extubation, oxygenation, manual ventilation, airway equipment, team role, and escalation.",
    clinicalMeaning:
      "Accidental extubation is a time-critical airway emergency. Future RTs need to understand their role: recognize loss of airway, call for help, oxygenate, support ventilation, prepare reintubation equipment, monitor the patient, and communicate clearly. The priority is oxygenation and ventilation, not debating why the tube came out.",
    coreConcept:
      "Immediate workflow depends on patient stability and local policy, but core priorities are consistent: call for help, assess airway and breathing, apply oxygen, manually ventilate if needed and feasible, prepare bag-mask setup, suction, airway adjuncts, end-tidal CO2, reintubation equipment, and backup airway supplies. Watch for aspiration, laryngospasm, inability to ventilate, and rapid desaturation. Communicate tube depth if known, prior airway difficulty, recent settings, and oxygenation response.",
    scenario:
      "A sedated ICU patient self-extubates and desaturates rapidly. The RT enters, calls for help, applies oxygen, prepares bag-mask ventilation and suction, ensures airway equipment is ready, and gives concise information to the intubating provider: diagnosis, prior vent settings, oxygen saturation trend, and airway concerns. This is not a moment for lengthy explanation; it is a role-based emergency response.",
    examRelevance:
      "Airway emergencies make new RTs anxious because they require action under pressure. This content builds the real-world mental script that schools may not repeat enough: oxygenate, ventilate, prepare, communicate, reassess.",
    takeaways:
      "Accidental extubation is an airway emergency. Call for help, oxygenate, ventilate, prepare airway equipment, and communicate what the team needs to know.",
    studyTakeaways: ["Oxygenation and ventilation are immediate priorities.", "Have suction and airway backup ready.", "Communicate prior airway and vent data concisely."],
    studyCommonTraps: ["Searching the chart before oxygenating", "Forgetting suction", "Not calling for help early"],
    preTest: [quiz("The first priority after accidental extubation is:", ["Determine billing code", "Oxygenation/ventilation and help", "Routine charting", "Remove all equipment from room"], 1, "Airway support and help are immediate priorities.")],
    postTest: [quiz("Helpful communication during reintubation includes:", ["Prior vent settings and oxygenation trend", "Cafeteria hours", "Unrelated lab history only", "Nothing"], 0, "The team needs relevant airway, ventilation, and oxygenation information.")],
  }),
  lesson({
    slug: "rt-tracheostomy-emergencies-decannulation-and-plugging",
    title: "Tracheostomy Emergencies: Decannulation and Plugging",
    topic: "RT Emergency Response",
    topicSlug: "rt-emergency-response",
    seoTitle: "Tracheostomy Emergency Response for RT Students",
    seoDescription: "RT clinical practice lesson on trach decannulation, mucus plugging, obstruction, oxygenation, suction, and emergency escalation.",
    clinicalMeaning:
      "Trach emergencies are high-risk because airway anatomy, stoma maturity, secretion burden, and equipment familiarity all matter. Future RTs must know how to recognize obstruction, mucus plugging, displacement, false passage risk, and accidental decannulation. A trach patient in distress can deteriorate quickly.",
    coreConcept:
      "Assess whether air is moving through the trach and whether the patient can be oxygenated. Look for distress, absent airflow, inability to pass suction catheter, high pressure alarms, low exhaled volume, cyanosis, agitation, and falling SpO2. Call for help early. Prepare suction, inner cannula change if applicable and within policy, oxygen to trach and/or upper airway depending on anatomy, spare trach tubes, obturator, bag-valve setup, and emergency airway support. Stoma maturity matters; never force reinsertion if resistance suggests false passage risk.",
    scenario:
      "A patient with a trach suddenly becomes distressed with high pressure alarms. You cannot pass the suction catheter. This strongly suggests obstruction or displacement. You call for help, oxygenate, assess the inner cannula per policy, prepare emergency equipment, and escalate immediately. The wrong move is repeated blind force or assuming anxiety is the cause.",
    examRelevance:
      "This is floor-critical RT content. It prepares future RTs for the practical reality that trach emergencies require equipment readiness, calm sequence, and early escalation.",
    takeaways:
      "Trach distress is airway distress. If suction catheter cannot pass, think obstruction or displacement. Oxygenate, call for help, use emergency trach workflow, and avoid forcing equipment blindly.",
    studyTakeaways: ["Inability to pass suction catheter is a danger sign.", "Keep spare trach and suction ready.", "Stoma maturity and false passage risk matter."],
    studyCommonTraps: ["Assuming distress is anxiety", "Forcing reinsertion", "Forgetting upper-airway oxygenation considerations"],
    preTest: [quiz("A trach patient in distress where suction catheter cannot pass suggests:", ["Possible obstruction or displacement", "Normal finding", "No airway issue", "Only metabolic alkalosis"], 0, "Inability to pass suction catheter is concerning for obstruction or displacement.")],
    postTest: [quiz("In trach emergencies, a safe RT behavior is:", ["Call for help early and prepare airway equipment", "Force equipment blindly", "Ignore SpO2", "Leave patient alone"], 0, "Early help and airway equipment preparation are essential.")],
  }),
  lesson({
    slug: "rt-mucus-plugging-recognition-and-response",
    title: "Mucus Plugging: Recognition and Response",
    topic: "RT Emergency Response",
    topicSlug: "rt-emergency-response",
    seoTitle: "Mucus Plugging Recognition and Response for Respiratory Therapists",
    seoDescription: "RT floor-practice lesson on mucus plugs, sudden desaturation, high pressure alarms, breath sounds, suction, humidification, and escalation.",
    clinicalMeaning:
      "Mucus plugging can cause sudden desaturation, high pressure alarms, absent or diminished breath sounds, increased work of breathing, atelectasis, and rapid deterioration. Future RTs need to recognize that secretion burden is not a minor comfort issue; it can become a life-threatening airway problem.",
    coreConcept:
      "Think mucus plug when there is sudden oxygenation drop, high pressure alarm, difficult bagging, coarse or absent breath sounds, visible secretion burden, thick secretions, inadequate humidification, weak cough, dehydration, or recent surgery. Interventions may include patient assessment, suction, humidification review, airway clearance therapy as ordered, bronchodilator/mucolytic protocols if applicable, positioning, bagging support if unstable, and escalation if oxygenation does not recover quickly.",
    scenario:
      "A ventilated patient has sudden high pressure alarms, SpO2 78%, and diminished breath sounds on the right. Thick secretions were noted earlier. You assess, call for help, oxygenate, suction, reassess breath sounds and pressures, review humidification, and escalate if plugging persists. Improvement after suction supports secretion obstruction, but recurrence means prevention and team communication matter.",
    examRelevance:
      "This is future-floor content because mucus plugging is a common cause of scary bedside deterioration. It teaches RTs to connect alarms, breath sounds, waveforms, humidification, and secretion history.",
    takeaways:
      "Mucus plugging can crash a patient. Suspect it with sudden desaturation plus high pressures or absent breath sounds. Suction, oxygenate, reassess, and fix the conditions that made secretions thick.",
    studyTakeaways: ["Thick secretions plus sudden desaturation is high risk.", "Humidification matters for prevention.", "Reassess after suction."],
    studyCommonTraps: ["Only increasing FiO2 without clearing airway", "Ignoring humidification", "Failing to reassess breath sounds"],
    preTest: [quiz("Sudden desaturation with high pressure alarms and thick secretions suggests:", ["Mucus plugging", "Normal ventilation", "Improved compliance", "No airway issue"], 0, "Mucus plugging can obstruct airflow and cause rapid deterioration.")],
    postTest: [quiz("After suction improves oxygenation, the RT should also:", ["Reassess and review secretion prevention factors", "Leave without reassessment", "Turn off humidification", "Ignore pressures"], 0, "Reassessment and prevention reduce recurrence risk.")],
  }),
  lesson({
    slug: "rt-clinical-communication-calling-provider-with-abg",
    title: "Calling the Provider With an ABG",
    topic: "RT Communication",
    topicSlug: "rt-communication",
    seoTitle: "How Respiratory Therapists Communicate ABG Results to Providers",
    seoDescription: "Practical RT lesson on concise provider updates, ABG reporting, respiratory recommendations, escalation language, and reassessment.",
    clinicalMeaning:
      "Future RTs need to communicate like clinicians, not just relay numbers. Calling with an ABG means explaining what changed, what it means physiologically, what the patient looks like, what support they are on, and what action may be needed. Clear communication improves trust and patient safety.",
    coreConcept:
      "Use a concise structure: patient/context, current support, ABG values, interpretation, clinical status, trend, concern, and requested action. Example: 'This is the RT for room 12. COPD exacerbation on BiPAP 16/8 and 40%. ABG is pH 7.25, PaCO2 78, HCO3 34, PaO2 66. This looks like acute-on-chronic respiratory acidosis. He is more drowsy than baseline with low tidal volumes and repeated apnea alarms. I am concerned NIV is failing. Can you come assess for escalation?'",
    scenario:
      "A new RT calls and says only 'the CO2 is high.' The provider has to ask ten follow-up questions. A stronger RT call includes support settings, pH, PaCO2, HCO3, oxygenation, mental status, work of breathing, trend, and concern. That makes escalation faster and shows clinical judgment.",
    examRelevance:
      "Communication is not usually the glamorous part of RT education, but it is what makes a new RT safe on the floor. This module should support placements, first jobs, and ICU confidence.",
    takeaways:
      "Do not just report numbers. Report interpretation, patient status, trend, support, concern, and requested action. Concise communication is a clinical skill.",
    studyTakeaways: ["Include support settings with ABGs.", "Say what you think the ABG means.", "State your concern clearly."],
    studyCommonTraps: ["Reporting PaCO2 without pH or clinical status", "Not mentioning current support", "Being vague about escalation concern"],
    preTest: [quiz("A useful ABG call should include:", ["Only PaCO2", "ABG, support settings, clinical status, trend, and concern", "Only patient age", "No interpretation"], 1, "Providers need context, interpretation, and clinical concern.")],
    postTest: [quiz("'I am concerned NIV is failing' is useful because it:", ["States clinical concern clearly", "Avoids escalation", "Hides the problem", "Replaces assessment"], 0, "Clear concern helps the team act faster.")],
  }),
  lesson({
    slug: "rt-handoff-report-for-vented-and-high-risk-patients",
    title: "RT Handoff Report for Vented and High-Risk Patients",
    topic: "RT Communication",
    topicSlug: "rt-communication",
    seoTitle: "Respiratory Therapist Handoff Report for Ventilated Patients",
    seoDescription: "Practical RT lesson on handoff reports, ventilator settings, trends, alarms, ABGs, airway risk, secretions, and pending concerns.",
    clinicalMeaning:
      "A good RT handoff prevents missed deterioration. It tells the next RT what is stable, what is changing, what failed, what worked, and what needs follow-up. Future RTs need to learn that handoff is not a social summary; it is transfer of respiratory risk.",
    coreConcept:
      "For ventilated or high-risk patients, include diagnosis, airway type and security, mode and settings, measured values, pressures, oxygenation trend, latest ABG and interpretation, secretion burden, suction response, waveform concerns, alarms, recent changes, pending weaning or escalation plans, code events, transport issues, and team concerns. Prioritize what can harm the patient if forgotten.",
    scenario:
      "You receive report on a patient described as 'fine on the vent.' Ten minutes later they alarm high pressure, and only then you learn they had repeated mucus plugging all day. A better handoff would include secretion trend, recent suction events, pressure changes, humidification concerns, and what to watch for overnight.",
    examRelevance:
      "This module supports real-world RT practice after the exam. It is part of making NurseNest useful beyond boards and into the first year of clinical work.",
    takeaways:
      "Handoff should transfer respiratory risk. Include airway, settings, trends, ABG interpretation, alarms, secretions, recent changes, and what the next RT must watch.",
    studyTakeaways: ["Handoff is risk transfer.", "Include trends, not just current settings.", "Mention what failed and what worked."],
    studyCommonTraps: ["Saying 'stable' without trend", "Omitting secretion problems", "Not reporting recent vent changes"],
    preTest: [quiz("The most useful RT handoff focuses on:", ["Respiratory risk and trends", "Only room number", "Unrelated gossip", "Nothing if stable"], 0, "Handoff should communicate risks and trends that affect respiratory care.")],
    postTest: [quiz("For a vented patient, handoff should include:", ["Airway, settings, ABG/trends, alarms, and secretion concerns", "Only breakfast intake", "Only skin color", "No ventilator data"], 0, "These details help the next RT safely continue care.")],
  }),
  lesson({
    slug: "rt-equipment-confidence-oxygen-devices-and-humidification",
    title: "Equipment Confidence: Oxygen Devices and Humidification",
    topic: "RT Equipment Confidence",
    topicSlug: "rt-equipment-confidence",
    seoTitle: "Oxygen Devices and Humidification for New Respiratory Therapists",
    seoDescription: "RT floor-practice lesson on oxygen device selection, flow ranges, humidification, patient comfort, secretion risk, and troubleshooting.",
    clinicalMeaning:
      "Future RTs often know device names but feel uncertain setting them up in real rooms. Equipment confidence means knowing what the device can deliver, what can go wrong, what to check when oxygenation fails, and when humidification matters. This reduces the 'I look lost on the floor' feeling.",
    coreConcept:
      "Oxygen device choice depends on oxygen requirement, work of breathing, ventilation needs, comfort, secretion burden, mouth breathing, flow demand, and escalation risk. Nasal cannula, simple mask, Venturi, non-rebreather, high-flow nasal cannula, aerosol systems, trach collar, CPAP, and BiPAP each have setup checks. Humidification is important when upper airway conditioning is bypassed, flows are high, secretions are thick, or artificial airways are present. Always verify source, flow, FiO2, fit, water level, tubing, and patient response.",
    scenario:
      "A trach collar patient has thick secretions and repeated desaturations. The oxygen percentage is unchanged, but humidification water is empty and secretions are becoming harder to clear. The RT recognizes this as an equipment and secretion-management problem, corrects humidification, assesses airway clearance, and communicates the trend.",
    examRelevance:
      "This is practical floor training. It helps RT students connect device setup to patient outcomes and prepares them for clinical placements and early shifts.",
    takeaways:
      "Equipment is therapy. Verify setup, source, flow, FiO2, fit, humidification, and response. A device that is technically ordered but poorly set up can fail the patient.",
    studyTakeaways: ["Device setup affects therapy delivery.", "Humidification matters with artificial airways and high flows.", "Always reassess patient response."],
    studyCommonTraps: ["Assuming the ordered device is functioning correctly", "Ignoring empty humidification", "Not matching device to patient flow demand"],
    preTest: [quiz("Humidification is especially important for:", ["Artificial airways and thick secretions", "Only low-risk room air patients", "Billing only", "No respiratory patients"], 0, "Artificial airways bypass natural humidification and can worsen secretion issues.")],
    postTest: [quiz("A safe oxygen device check includes:", ["Source, flow/FiO2, fit, tubing, humidification, and patient response", "Only wall color", "Only chart order", "No reassessment"], 0, "Effective oxygen delivery requires setup verification and reassessment.")],
  }),
  lesson({
    slug: "rt-transport-vent-basics-and-safe-movement",
    title: "Transport Vent Basics and Safe Movement",
    topic: "RT Equipment Confidence",
    topicSlug: "rt-equipment-confidence",
    seoTitle: "Transport Ventilator Basics for Respiratory Therapists",
    seoDescription: "Real-world RT lesson on transport ventilators, oxygen supply, battery, emergency bagging, monitoring, and safe patient movement.",
    clinicalMeaning:
      "Transport is a high-risk period because the patient leaves the controlled ICU environment. Future RTs need to think about oxygen supply, battery, circuit security, airway security, monitoring, emergency bagging, alarms, and what to do if the transport ventilator fails.",
    coreConcept:
      "Before transport, verify airway security, current settings, transport vent compatibility, oxygen cylinder pressure and duration, battery, circuit connections, alarms, monitoring, suction availability, manual resuscitator, PEEP valve if needed, medications/infusions coordination, destination readiness, and enough staff. During transport, watch the patient continuously: chest rise, SpO2, pressure alarms, exhaled volume if available, waveform/ETCO2 if available, and hemodynamics. Always know how to disconnect and bag if the transport system fails.",
    scenario:
      "An ARDS patient on high PEEP needs CT. The inexperienced approach is to roll quickly. The RT approach is to calculate oxygen supply, confirm battery and alarms, bring bag-mask with PEEP valve per policy, secure airway and circuit, coordinate team roles, and reassess after every move and transfer.",
    examRelevance:
      "Transport preparation is floor-practice authority content. It helps users after the exam because transport anxiety is common for new RTs.",
    takeaways:
      "Transport is a respiratory risk event. Prepare oxygen, battery, airway, circuit, monitoring, suction, and manual ventilation backup before movement.",
    studyTakeaways: ["Oxygen duration matters.", "Manual ventilation backup must travel with the patient.", "Moving the patient can destabilize airway and circuit."],
    studyCommonTraps: ["Leaving without enough oxygen", "Forgetting battery/backup bag", "Not reassessing after transfer"],
    preTest: [quiz("Before ventilated transport, the RT must verify:", ["Oxygen supply, battery, airway/circuit, monitoring, and backup bagging", "Only hallway lights", "Only lunch schedule", "Nothing if short trip"], 0, "Transport requires preparation for predictable respiratory risks.")],
    postTest: [quiz("Transport should be treated as:", ["A high-risk respiratory event", "Never risky", "Only a paperwork issue", "Unrelated to RT"], 0, "Movement and equipment changes can destabilize ventilated patients.")],
  }),
  lesson({
    slug: "rt-compensating-vs-decompensating-respiratory-patients",
    title: "Compensating vs Decompensating Respiratory Patients",
    topic: "ICU Pattern Recognition",
    topicSlug: "icu-pattern-recognition",
    seoTitle: "Compensating vs Decompensating Respiratory Patients for RTs",
    seoDescription: "RT clinical judgment lesson on fatigue, work of breathing, mental status, oxygen demand, CO2 retention, and escalation thresholds.",
    clinicalMeaning:
      "Experienced RTs recognize when a patient is still compensating and when compensation is failing. Future RTs need to see the pattern before the crash: rising oxygen demand, increasing work of breathing, decreasing mental status, falling tidal volumes, rising PaCO2, diaphoresis, accessory muscle fatigue, inability to speak, and worsening waveform or alarm trends.",
    coreConcept:
      "Compensation often looks like tachypnea, accessory muscle use, anxiety, upright positioning, and increased minute ventilation. Decompensation may look quieter: decreasing respiratory rate, shallow breathing, drowsiness, weak cough, poor synchrony, rising CO2, worsening acidosis, and reduced ability to maintain airway or ventilation. A patient who looks less distressed because they are tiring is more dangerous than one who is vigorously compensating.",
    scenario:
      "A COPD patient who was anxious and tachypneic becomes sleepy with a slower respiratory rate. SpO2 is 91% on oxygen, but ABG shows rising PaCO2 and falling pH. The inexperienced learner may feel reassured because the patient looks calmer. The RT recognizes fatigue and ventilatory failure and escalates.",
    examRelevance:
      "This is high-value clinical judgment content. It helps future RTs understand the difference between a patient who is working hard and a patient who is losing the ability to work.",
    takeaways:
      "Decompensation can look quieter than compensation. Watch mental status, work of breathing, CO2, pH, tidal volume, and trend. Calm is not always better.",
    studyTakeaways: ["Worsening drowsiness can mean CO2 retention.", "Falling work of breathing may mean fatigue, not improvement.", "Trend beats snapshot."],
    studyCommonTraps: ["Feeling reassured by a sleepy hypercapnic patient", "Ignoring PaCO2 trend", "Waiting until arrest to escalate"],
    preTest: [quiz("A tiring respiratory patient may become:", ["Sleepier with worse ventilation", "Always more energetic", "Unaffected by CO2", "Impossible to identify"], 0, "Fatigue and CO2 retention can reduce respiratory effort and mental status.")],
    postTest: [quiz("A COPD patient becomes drowsy with rising PaCO2. The RT should suspect:", ["Decompensating ventilatory failure", "Certain improvement", "No need to reassess", "Only probe artifact"], 0, "Drowsiness with rising CO2 is concerning for ventilatory failure.")],
  }),
  lesson({
    slug: "rt-first-90-days-new-grad-survival",
    title: "First 90 Days as a New Grad RT",
    topic: "New Grad RT Survival",
    topicSlug: "new-grad-rt-survival",
    seoTitle: "First 90 Days as a New Grad Respiratory Therapist",
    seoDescription: "New grad RT survival lesson on confidence, asking for help, prioritization, first emergencies, communication, and safe growth on the floor.",
    clinicalMeaning:
      "The first 90 days as an RT are about safe growth. Future RTs need permission to be new while building reliable habits: ask for help early, know where equipment is, prepare before procedures, communicate concerns clearly, debrief after emergencies, and build pattern recognition one shift at a time.",
    coreConcept:
      "New grad safety habits include arriving early enough to review assignment, identifying high-risk patients, keeping emergency equipment in mind, asking experienced RTs how they prioritize, documenting clearly, following local policy, practicing concise calls, and reflecting after difficult events. Confidence should come from repeatable workflows, not pretending to know everything. The best new grads escalate early, stay teachable, and use structured reassessment.",
    scenario:
      "A new RT is embarrassed to ask for help with a difficult vent alarm. They spend several minutes troubleshooting alone while the patient worsens. A safer new-grad response is to assess the patient, begin immediate supportive actions, and call another RT early. Asking for help is not weakness when the patient is unstable.",
    examRelevance:
      "This is beyond exam prep and creates long-term product value. It supports learners through clinical placement, hiring, onboarding, and early practice, which makes NurseNest useful after licensure.",
    takeaways:
      "New grad RT success is built on safe routines: prioritize, assess, ask for help, communicate, reassess, and learn from every event. You do not need to be fearless; you need to be safe and teachable.",
    studyTakeaways: ["Ask for help early with unstable patients.", "Confidence comes from workflows.", "Debrief and learn after emergencies."],
    studyCommonTraps: ["Pretending to know everything", "Waiting too long to escalate", "Equating anxiety with incompetence"],
    preTest: [quiz("A safe new grad RT behavior is:", ["Ask for help early when unstable", "Hide uncertainty in emergencies", "Never reassess", "Avoid communication"], 0, "Early help protects patients and supports learning.")],
    postTest: [quiz("New grad RT confidence should be built on:", ["Repeatable safety workflows", "Guessing", "Avoiding feedback", "Never asking questions"], 0, "Workflows and feedback build safe confidence.")],
  }),
];

export default { lessons: respiratoryTherapyFloorPracticeLessons };
