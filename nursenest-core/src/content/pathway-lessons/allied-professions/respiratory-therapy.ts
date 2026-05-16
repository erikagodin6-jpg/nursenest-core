const rtSections = {
  ventilationFoundations: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Respiratory therapy practice starts with the difference between ventilation and oxygenation. Ventilation is carbon dioxide clearance through minute ventilation and alveolar ventilation. Oxygenation is oxygen movement across the alveolar-capillary membrane into arterial blood. A patient can oxygenate poorly with an acceptable PaCO2, ventilate poorly with a normal SpO2 for a short period, or fail both at once. RT learners must read the patient, the device, the ABG, and the trend together. This lesson anchors the RT pathway around mechanism-first reasoning instead of memorizing device names."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Minute ventilation equals respiratory rate multiplied by tidal volume, but only the fraction reaching ventilated alveoli participates in gas exchange. Dead space ventilation rises when breaths move air through conducting airways or poorly perfused alveoli without effective CO2 removal. Hypoventilation raises PaCO2. Increased shunt or V/Q mismatch lowers PaO2. FiO2 primarily changes oxygenation; respiratory rate and tidal volume primarily change ventilation. PEEP can improve oxygenation by recruiting alveoli but can also reduce venous return and overdistend compliant lung units. Every ventilator adjustment should therefore be tied to the physiologic problem it is intended to fix."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with pneumonia is on 60% FiO2 with SpO2 87%, PaO2 54, PaCO2 39. Increasing respiratory rate will not directly fix the main problem because CO2 clearance is acceptable. The RT should think oxygenation failure: atelectasis, shunt, V/Q mismatch, secretion burden, worsening consolidation, or inadequate mean airway pressure. A carefully titrated PEEP change, positioning, secretion management, and reassessment of work of breathing are more physiologically aligned than simply increasing rate."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "RT board-style questions often hide the target in the ABG. If PaCO2 is high, think ventilation: rate, tidal volume, dead space, airway obstruction, sedation, fatigue, or ventilator synchrony. If PaO2 is low despite oxygen, think oxygenation: FiO2, PEEP, recruitment, shunt, V/Q mismatch, diffusion impairment, secretions, or hemodynamics. Do not treat pulse oximetry as the whole answer; connect it to PaO2, patient appearance, and device settings."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "High-yield RT rule: FiO2 and PEEP are oxygenation tools; rate and tidal volume are ventilation tools. Always confirm the problem before changing the setting. Reassess after every intervention using the patient, waveform, alarm trend, and ABG rather than one isolated number."
    }
  ],
  abg: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "ABG interpretation for RT learners is not just naming acidosis or alkalosis. The goal is to decide what the gas says about alveolar ventilation, metabolic compensation, oxygen transfer, and the next respiratory intervention. A clinically useful ABG reading connects pH, PaCO2, HCO3, PaO2, FiO2, current device, work of breathing, and trend."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Start with pH to determine acidemia or alkalemia. Then identify whether PaCO2 is moving in the direction that explains the pH. If yes, the primary process is respiratory. If HCO3 is moving in the direction that explains the pH, the primary process is metabolic. Then decide whether compensation is appropriate. In respiratory acidosis, PaCO2 retention lowers pH; acute compensation is limited, while chronic retention allows renal bicarbonate retention. In metabolic acidosis, the patient should lower PaCO2 through compensatory hyperventilation. Winter's formula helps decide whether the respiratory response is appropriate or whether a second respiratory disorder is present."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A COPD patient arrives drowsy on high-flow oxygen. ABG: pH 7.27, PaCO2 72, HCO3 32, PaO2 68. This is acute-on-chronic respiratory acidosis. The elevated bicarbonate suggests chronic CO2 retention, but the low pH means the current PaCO2 rise has exceeded compensation. The RT priority is not simply more oxygen; it is ventilatory support, airway assessment, bronchodilator response, secretion clearance, and close monitoring for noninvasive ventilation failure."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Common exam traps include calling every elevated HCO3 metabolic alkalosis, ignoring chronic compensation in COPD, treating SpO2 without checking ventilation, and missing mixed disorders. Always compare the pH direction with PaCO2 and HCO3. Then ask whether the compensation is expected for the clinical context."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "ABGs become useful when they change management. Label the disorder, decide whether compensation makes sense, connect oxygenation to device settings, and choose the respiratory intervention that matches the physiology."
    }
  ],
  waveform: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Ventilator waveforms are bedside physiology. They show how the patient, lung, airway, circuit, and ventilator are interacting breath by breath. RT learners should not treat waveforms as decoration; they are the fastest way to recognize obstruction, leaks, auto-PEEP, breath stacking, secretion load, and patient-ventilator dyssynchrony before the ABG worsens."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "The pressure-time waveform shows the pressure required to deliver or support a breath. Rising peak pressure with stable plateau pressure suggests increased airway resistance, such as bronchospasm, secretions, biting, or a kinked tube. Rising peak and plateau pressures together suggest reduced compliance, such as ARDS, pulmonary edema, pneumothorax, abdominal pressure, or atelectasis. The flow-time waveform should return to baseline before the next breath. Failure to return to baseline suggests incomplete exhalation and auto-PEEP. The volume-time waveform helps reveal leaks when inspired and expired volumes do not match. Loops show compliance, resistance, and overdistention patterns visually."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A ventilated asthma patient has a scooped expiratory flow curve that does not return to zero before the next breath. Peak pressure is rising and the patient is tachycardic. The waveform is warning about air trapping and intrinsic PEEP. Increasing respiratory rate would shorten exhalation and worsen the problem. RT actions include assessing the patient, checking the circuit and airway, administering bronchodilator therapy when ordered, increasing expiratory time, reducing minute ventilation demand when appropriate, and escalating if hemodynamics deteriorate."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Board-style waveform questions often ask for the next best action. Match the waveform to the mechanism: leak means lost volume; secretions mean resistance and sawtooth or irregular flow; bronchospasm means prolonged expiratory flow; double triggering means unmet demand or timing mismatch; breath stacking means insufficient exhalation or drive mismatch. Do not choose a setting change unless it fixes the mechanism."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Waveform interpretation is RT pattern recognition plus physiology. Read pressure, flow, volume, patient effort, alarms, and vitals as one story."
    }
  ]
};

function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

export const respiratoryTherapyLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "rt-gas-exchange-and-alveolar-ventilation",
    title: "Gas Exchange & Alveolar Ventilation",
    topic: "Respiratory Therapy",
    topicSlug: "respiratory-therapy",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "Gas Exchange and Alveolar Ventilation for Respiratory Therapy",
    seoDescription: "Mechanism-first RT lesson on ventilation, oxygenation, dead space, PaCO2, PaO2, and ABG-linked respiratory decisions.",
    alliedProfessionKey: "respiratory",
    sections: rtSections.ventilationFoundations,
    studyTakeaways: ["Separate ventilation from oxygenation before adjusting support.", "Use PaCO2 to judge ventilation and PaO2/FiO2 to judge oxygenation.", "Match each intervention to the physiology it changes."],
    studyCommonTraps: ["Increasing respiratory rate for isolated hypoxemia", "Treating SpO2 without checking ventilation", "Ignoring dead space and work of breathing"],
    preTest: [quiz("Which ABG value most directly reflects alveolar ventilation?", ["PaO2", "PaCO2", "HCO3", "SaO2"], 1, "PaCO2 rises when alveolar ventilation is inadequate and falls when alveolar ventilation increases.")],
    postTest: [quiz("A patient has low PaO2 with normal PaCO2. Which setting class is most directly aligned with oxygenation?", ["Respiratory rate", "Tidal volume", "PEEP/FiO2", "Inspiratory trigger only"], 2, "PEEP and FiO2 primarily support oxygenation; rate and tidal volume primarily affect ventilation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "rt-abg-interpretation-acid-base-and-oxygenation",
    title: "ABG Interpretation: Acid/Base and Oxygenation",
    topic: "ABG Interpretation",
    topicSlug: "abg-interpretation",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "ABG Interpretation for Respiratory Therapy Students",
    seoDescription: "Deep RT ABG lesson covering pH, PaCO2, HCO3, compensation, oxygenation, COPD retainers, and mixed disorder traps.",
    alliedProfessionKey: "respiratory",
    sections: rtSections.abg,
    studyTakeaways: ["Read pH first, then PaCO2 and HCO3 direction.", "Compensation should fit the timeline and diagnosis.", "Use ABGs to guide respiratory intervention, not just label disorders."],
    studyCommonTraps: ["Missing acute-on-chronic respiratory acidosis", "Confusing compensation with a second primary disorder", "Escalating oxygen while missing hypoventilation"],
    preTest: [quiz("In primary respiratory acidosis, which value is the driver?", ["Low PaCO2", "High PaCO2", "Low HCO3", "High PaO2"], 1, "Respiratory acidosis is driven by CO2 retention from inadequate ventilation.")],
    postTest: [quiz("COPD patient: pH 7.27, PaCO2 72, HCO3 32. Best interpretation?", ["Uncompensated metabolic acidosis", "Acute-on-chronic respiratory acidosis", "Pure metabolic alkalosis", "Respiratory alkalosis"], 1, "High bicarbonate suggests chronic compensation, but low pH shows acute decompensation.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "rt-ventilator-waveforms-pressure-flow-volume",
    title: "Ventilator Waveforms: Pressure, Flow, and Volume",
    topic: "Ventilator Waveforms",
    topicSlug: "ventilator-waveforms",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "Ventilator Waveform Interpretation for RT Students",
    seoDescription: "RT lesson on pressure-time, flow-time, volume-time waveforms, loops, auto-PEEP, leaks, secretions, and dyssynchrony.",
    alliedProfessionKey: "respiratory",
    sections: rtSections.waveform,
    studyTakeaways: ["Pressure, flow, and volume curves tell different parts of the same breath story.", "Flow not returning to baseline suggests incomplete exhalation.", "Rising peak pressure with stable plateau pressure suggests airway resistance."],
    studyCommonTraps: ["Increasing rate during air trapping", "Ignoring leak clues on volume curves", "Treating all high-pressure alarms as poor compliance"],
    preTest: [quiz("Flow that fails to return to baseline before the next breath suggests:", ["Auto-PEEP", "Low FiO2", "Metabolic alkalosis", "Normal synchrony"], 0, "Incomplete expiratory flow indicates air trapping and intrinsic PEEP risk.")],
    postTest: [quiz("Peak pressure rises but plateau pressure is unchanged. What is most likely?", ["Reduced lung compliance", "Increased airway resistance", "Improved compliance", "Low minute ventilation"], 1, "Stable plateau with rising peak pressure points toward airway resistance, not stiff lung units.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "rt-volume-assist-control-ventilation",
    title: "Volume Assist Control Ventilation",
    topic: "Mechanical Ventilation",
    topicSlug: "mechanical-ventilation",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "Volume Assist Control Ventilation for Respiratory Therapy",
    seoDescription: "Mechanism-based lesson on volume assist control, tidal volume, pressure response, alarms, ARDS risk, and troubleshooting.",
    alliedProfessionKey: "respiratory",
    sections: [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Volume assist control delivers a set tidal volume for mandatory and patient-triggered breaths. It guarantees volume but not pressure. That makes it useful when minute ventilation targets are important, but it requires close pressure monitoring because worsening compliance or resistance can drive pressures upward." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "In volume control, tidal volume, rate, flow pattern, PEEP, and FiO2 are set. Pressure becomes the dependent variable. If the lung gets stiffer, plateau pressure rises. If the airway becomes obstructed, peak pressure rises more than plateau pressure. RT management therefore requires monitoring peak pressure, plateau pressure, driving pressure, auto-PEEP, patient synchrony, and delivered versus exhaled volume." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A patient with ARDS is receiving volume assist control. Plateau pressure climbs above the safe range while oxygenation remains poor. The RT should recognize compliance failure and lung-protective ventilation needs: confirm tidal volume based on predicted body weight, assess PEEP/FiO2 strategy, monitor driving pressure, and escalate according to protocol rather than simply accepting high pressures to force volume." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include choosing volume assist control because it is familiar without watching pressures, confusing peak pressure with plateau pressure, and missing patient-triggered breath stacking. Always ask what is set, what varies, and what the alarm is actually telling you." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Volume control guarantees tidal volume; pressure tells you what it cost. Rising plateau means compliance problem. Rising peak with stable plateau means resistance problem." }
    ],
    studyTakeaways: ["Volume is set; pressure varies.", "Plateau pressure reflects compliance more than airway resistance.", "Use lung-protective reasoning in ARDS."],
    studyCommonTraps: ["Ignoring plateau pressure", "Confusing peak and plateau", "Increasing volume when pressure is already unsafe"],
    preTest: [quiz("In volume assist control, what is guaranteed by the ventilator?", ["Tidal volume", "Plateau pressure", "Lung compliance", "PaO2"], 0, "The ventilator targets the set tidal volume; pressure varies with resistance and compliance.")],
    postTest: [quiz("Plateau pressure rises in volume control. This most directly suggests:", ["Reduced compliance", "Improved oxygenation", "Lower airway resistance", "Circuit leak only"], 0, "Plateau pressure reflects alveolar pressure and rises with reduced compliance.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "rt-auto-peep-air-trapping-and-dyssynchrony",
    title: "Auto-PEEP, Air Trapping, and Dyssynchrony",
    topic: "Ventilator Troubleshooting",
    topicSlug: "ventilator-troubleshooting",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "Auto-PEEP and Air Trapping for Respiratory Therapy",
    seoDescription: "RT troubleshooting lesson on intrinsic PEEP, obstructive physiology, dyssynchrony, breath stacking, hemodynamics, and corrective actions.",
    alliedProfessionKey: "respiratory",
    sections: [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Auto-PEEP occurs when expiration is incomplete before the next breath begins. It is common in obstructive disease, high respiratory rates, short expiratory times, high minute ventilation demand, or severe dyssynchrony. It can increase work of breathing, worsen hypotension, impair triggering, and create breath stacking." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "The key waveform clue is expiratory flow that does not return to baseline before the next breath. The patient is starting the next inhalation while trapped gas remains. Corrective thinking includes lengthening expiratory time, reducing respiratory rate when clinically appropriate, adjusting inspiratory flow/time, treating bronchospasm or secretions, checking for obstruction, and improving synchrony. In severe cases, trapped pressure can reduce venous return and cause hemodynamic collapse." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A ventilated COPD patient becomes hypotensive after repeated high-pressure alarms. The flow-time waveform shows incomplete exhalation. The RT should suspect dynamic hyperinflation. The immediate response is patient assessment, circuit/airway check, notifying the team, and interventions that reduce trapping rather than increasing ventilation demand." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "The common wrong answer is to increase rate for hypercapnia without noticing air trapping. If the patient cannot exhale, more breaths can worsen CO2 clearance by increasing trapped volume and dead space. Mechanism beats reflexive setting changes." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Auto-PEEP is incomplete exhalation. Look at the flow curve. Create time to exhale, treat obstruction, and reassess hemodynamics." }
    ],
    studyTakeaways: ["Flow not returning to baseline is a major auto-PEEP clue.", "More rate can worsen air trapping.", "Auto-PEEP can cause hypotension and trigger failure."],
    studyCommonTraps: ["Treating high PaCO2 with more rate despite trapping", "Ignoring hemodynamic effects", "Missing bronchospasm and secretions as causes"],
    preTest: [quiz("The classic waveform clue for auto-PEEP is:", ["Expiratory flow returns to zero early", "Expiratory flow fails to return to baseline", "Flat PaCO2", "Low FiO2"], 1, "Incomplete expiratory flow before the next breath is the key waveform clue.")],
    postTest: [quiz("Which change often helps air trapping?", ["Shorten expiratory time", "Increase rate reflexively", "Allow longer expiratory time", "Ignore bronchodilator response"], 2, "Longer expiratory time helps trapped gas leave the lungs.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "rt-ards-oxygenation-and-peep-strategy",
    title: "ARDS Oxygenation and PEEP Strategy",
    topic: "Critical Care Respiratory Therapy",
    topicSlug: "critical-care-respiratory-therapy",
    system: "respiratory",
    bodySystem: "respiratory",
    previewSectionCount: 2,
    seoTitle: "ARDS Oxygenation and PEEP Strategy for RT Students",
    seoDescription: "Critical-care RT lesson on ARDS physiology, refractory hypoxemia, PEEP, FiO2, compliance, plateau pressure, and escalation.",
    alliedProfessionKey: "respiratory",
    sections: [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "ARDS is severe inflammatory lung injury with alveolar flooding, atelectasis, low compliance, shunt physiology, and refractory hypoxemia. The RT role is to support oxygenation while reducing ventilator-induced lung injury. That means interpreting oxygen response, compliance, plateau pressure, driving pressure, PEEP need, secretion burden, positioning, and escalation triggers." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "In ARDS, some lung units are collapsed or fluid-filled while others remain open and vulnerable to overdistention. PEEP can recruit unstable alveoli and improve oxygenation, but excessive pressure can overdistend open units and reduce venous return. Lung-protective ventilation uses lower tidal volumes based on predicted body weight, pressure monitoring, permissive hypercapnia when appropriate, and careful PEEP/FiO2 titration. The RT must read oxygenation and mechanics together." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A septic patient has bilateral infiltrates, PaO2/FiO2 ratio worsening, plateau pressure rising, and SpO2 unstable despite high FiO2. The RT should think ARDS physiology, verify tube/circuit/patient factors, evaluate PEEP strategy, monitor pressures, support proning workflow when ordered, and escalate early for refractory hypoxemia rather than chasing saturation with FiO2 alone." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "ARDS questions test the balance between oxygenation and lung protection. Wrong answers often maximize oxygen or volume without pressure awareness. Correct reasoning uses PEEP/FiO2, low tidal volume, pressure limits, and escalation when refractory hypoxemia persists." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "ARDS is not just low oxygen. It is shunt, low compliance, recruitability, and injury risk. Improve oxygenation while protecting the lung." }
    ],
    studyTakeaways: ["ARDS creates refractory hypoxemia and low compliance.", "PEEP may recruit alveoli but can overdistend or reduce preload.", "Lung-protective ventilation is pressure-aware."],
    studyCommonTraps: ["Increasing tidal volume to fix oxygenation", "Ignoring plateau pressure", "Treating FiO2 as the only oxygenation tool"],
    preTest: [quiz("ARDS oxygenation failure is strongly associated with:", ["Pure hyperventilation", "Shunt and low compliance", "Metabolic alkalosis only", "Normal lung mechanics"], 1, "ARDS causes inflammatory alveolar injury, shunt physiology, and low compliance.")],
    postTest: [quiz("In ARDS, increasing PEEP is intended to:", ["Recruit alveoli and improve oxygenation", "Directly lower PaCO2 only", "Eliminate need for pressure monitoring", "Increase dead space"], 0, "PEEP can recruit alveoli and improve oxygenation, but pressure and hemodynamics must be monitored.")]
  }
];

export default { lessons: respiratoryTherapyLessons };
