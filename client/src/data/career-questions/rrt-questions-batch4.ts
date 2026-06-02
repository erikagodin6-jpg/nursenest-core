import type { CareerQuestion } from "./rrt-questions";

export const rrtQuestionsBatch4: CareerQuestion[] = [
  {
    id: "rrt-1850",
    stem: "A patient is placed on volume-controlled ventilation with a set tidal volume of 500 mL. The peak inspiratory pressure (PIP) suddenly increases from 25 to 45 cmH2O while the plateau pressure remains at 20 cmH2O. What is the most likely cause?",
    options: [
      "Increased airway resistance",
      "Decreased lung compliance",
      "Pneumothorax",
      "Atelectasis"
    ],
    correctIndex: 0,
    rationale: "When PIP increases but plateau pressure remains unchanged, the problem is increased airway resistance (e.g., bronchospasm, secretions, kinked ET tube). If both PIP and plateau increased, the issue would be decreased lung compliance. Pneumothorax and atelectasis would increase plateau pressure as well.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "pressure monitoring"
  },
  {
    id: "rrt-1851",
    stem: "What is the primary purpose of applying positive end-expiratory pressure (PEEP) in mechanically ventilated patients?",
    options: [
      "Prevent alveolar collapse and improve oxygenation",
      "Increase tidal volume delivery",
      "Reduce respiratory rate",
      "Decrease carbon dioxide levels"
    ],
    correctIndex: 0,
    rationale: "PEEP maintains positive pressure at end-expiration to prevent alveolar collapse (atelectasis), recruit collapsed alveoli, and improve functional residual capacity (FRC), thereby improving oxygenation. PEEP does not directly increase tidal volume, reduce respiratory rate, or decrease CO2.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "PEEP"
  },
  {
    id: "rrt-1852",
    stem: "A patient on assist-control ventilation has the following settings: VT 450 mL, rate 14, FiO2 0.50, PEEP 5 cmH2O. ABG shows pH 7.28, PaCO2 58 mmHg, PaO2 88 mmHg, HCO3 26 mEq/L. Which adjustment is most appropriate?",
    options: [
      "Increase the respiratory rate",
      "Increase the PEEP",
      "Increase the FiO2",
      "Decrease the tidal volume"
    ],
    correctIndex: 0,
    rationale: "The ABG shows uncompensated respiratory acidosis (low pH, high PaCO2). Oxygenation is adequate (PaO2 88). To correct respiratory acidosis, increase minute ventilation by increasing the rate or tidal volume. Increasing the rate is the safest first step. Increasing PEEP or FiO2 addresses oxygenation, not ventilation.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "ventilator management"
  },
  {
    id: "rrt-1853",
    stem: "Which ventilator mode allows the patient to breathe spontaneously while providing a set level of continuous positive airway pressure?",
    options: [
      "CPAP",
      "Assist-control",
      "SIMV",
      "Pressure control"
    ],
    correctIndex: 0,
    rationale: "CPAP (Continuous Positive Airway Pressure) maintains a constant positive pressure throughout the respiratory cycle while the patient breathes spontaneously. It does not provide mandatory breaths. Assist-control and SIMV provide mandatory breaths. Pressure control delivers set pressure breaths.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "ventilator modes"
  },
  {
    id: "rrt-1854",
    stem: "A respiratory therapist is assessing a patient for readiness to wean from mechanical ventilation. Which parameter best indicates the patient can sustain spontaneous breathing?",
    options: [
      "Rapid shallow breathing index (RSBI) less than 105",
      "PaO2 of 65 mmHg on FiO2 0.80",
      "Negative inspiratory force (NIF) of -10 cmH2O",
      "Vital capacity of 5 mL/kg"
    ],
    correctIndex: 0,
    rationale: "An RSBI (f/VT) less than 105 breaths/min/L is the best predictor of weaning success. A PaO2 of 65 on FiO2 0.80 indicates poor oxygenation. NIF should be at least -20 cmH2O or more negative. Vital capacity should be at least 10-15 mL/kg for successful weaning.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "weaning parameters"
  },
  {
    id: "rrt-1855",
    stem: "During volume-controlled ventilation, which factor directly determines the peak inspiratory pressure?",
    options: [
      "Airway resistance and lung compliance combined",
      "Set PEEP level only",
      "Inspiratory time only",
      "FiO2 setting"
    ],
    correctIndex: 0,
    rationale: "In volume-controlled ventilation, peak inspiratory pressure is determined by both airway resistance and lung compliance. Higher resistance or lower compliance increases PIP. PEEP affects baseline pressure but not PIP directly. Inspiratory time affects flow rate, and FiO2 has no effect on PIP.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pressure monitoring"
  },
  {
    id: "rrt-1856",
    stem: "A patient on mechanical ventilation develops auto-PEEP of 8 cmH2O. Which intervention would best reduce this intrinsic PEEP?",
    options: [
      "Decrease the respiratory rate to allow more expiratory time",
      "Increase the set PEEP to 10 cmH2O",
      "Increase the tidal volume",
      "Increase the inspiratory time"
    ],
    correctIndex: 0,
    rationale: "Auto-PEEP (intrinsic PEEP) occurs due to incomplete exhalation, often from high respiratory rates or obstructive disease. Decreasing the rate allows more time for exhalation, reducing air trapping. Increasing tidal volume or inspiratory time worsens auto-PEEP. Adding external PEEP can help trigger but does not reduce auto-PEEP itself.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "auto-PEEP"
  },
  {
    id: "rrt-1857",
    stem: "What is the recommended tidal volume for lung-protective ventilation in a patient with ARDS?",
    options: [
      "6-8 mL/kg of ideal body weight",
      "10-12 mL/kg of actual body weight",
      "15 mL/kg of ideal body weight",
      "4 mL/kg of actual body weight"
    ],
    correctIndex: 0,
    rationale: "The ARDSNet protocol recommends low tidal volumes of 6-8 mL/kg of ideal (predicted) body weight to minimize ventilator-induced lung injury. Higher tidal volumes cause volutrauma. Actual body weight overestimates lung size in obese patients. 4 mL/kg is generally too low.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "lung-protective ventilation"
  },
  {
    id: "rrt-1858",
    stem: "A patient on pressure support ventilation (PSV) of 15 cmH2O is breathing at a rate of 28 breaths/min with tidal volumes of 250 mL. What should the therapist recommend?",
    options: [
      "Increase the pressure support level",
      "Switch to CPAP mode",
      "Decrease the pressure support level",
      "Add a mandatory rate"
    ],
    correctIndex: 0,
    rationale: "The patient is tachypneic with low tidal volumes, indicating inadequate support. Increasing the pressure support will augment each breath, increasing tidal volume and likely reducing the respiratory rate. Decreasing support or switching to CPAP would worsen the situation. Adding a mandatory rate changes the mode entirely.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pressure support ventilation"
  },
  {
    id: "rrt-1859",
    stem: "Which of the following is the most appropriate initial FiO2 setting when initiating mechanical ventilation on a patient with an unknown baseline?",
    options: [
      "1.0 (100%)",
      "0.40 (40%)",
      "0.21 (21%)",
      "0.60 (60%)"
    ],
    correctIndex: 0,
    rationale: "When initiating mechanical ventilation with an unknown baseline, it is safest to start at FiO2 1.0 to prevent hypoxemia, then titrate down based on ABG results and SpO2 to the lowest FiO2 that maintains adequate oxygenation (PaO2 >60 mmHg or SpO2 >92%).",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "initial ventilator settings"
  },
  {
    id: "rrt-1860",
    stem: "A patient on volume-controlled SIMV has a set rate of 12 but is triggering an additional 8 breaths per minute. The additional breaths are unsupported. What should be added to improve patient comfort?",
    options: [
      "Pressure support for spontaneous breaths",
      "Higher PEEP",
      "Increased mandatory rate to 20",
      "Sedation only"
    ],
    correctIndex: 0,
    rationale: "In SIMV, spontaneous breaths between mandatory breaths are unsupported unless pressure support is added. Adding pressure support to spontaneous breaths reduces the work of breathing and improves patient comfort. Increasing the mandatory rate negates the purpose of SIMV. Sedation alone does not address the work of breathing.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "SIMV mode"
  },
  {
    id: "rrt-1861",
    stem: "During mechanical ventilation, the plateau pressure is measured at 35 cmH2O. According to lung-protective ventilation guidelines, what is the recommended action?",
    options: [
      "Decrease the tidal volume to reduce plateau pressure below 30 cmH2O",
      "Increase the PEEP to improve compliance",
      "No intervention needed; 35 cmH2O is acceptable",
      "Switch to pressure control ventilation at 35 cmH2O"
    ],
    correctIndex: 0,
    rationale: "Lung-protective ventilation guidelines recommend keeping plateau pressure below 30 cmH2O to prevent barotrauma and ventilator-induced lung injury. At 35 cmH2O, the tidal volume should be decreased. Simply switching to pressure control at the same pressure does not reduce the risk.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "lung-protective ventilation"
  },
  {
    id: "rrt-1862",
    stem: "What is the definition of static compliance in a mechanically ventilated patient?",
    options: [
      "Tidal volume divided by plateau pressure minus PEEP",
      "Tidal volume divided by peak inspiratory pressure minus PEEP",
      "Minute ventilation divided by respiratory rate",
      "Peak inspiratory pressure minus plateau pressure"
    ],
    correctIndex: 0,
    rationale: "Static compliance (Cst) = VT / (Pplat - PEEP). It measures lung and chest wall compliance without the influence of airway resistance, as it uses plateau pressure (measured during an inspiratory hold). Dynamic compliance uses PIP instead of Pplat.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1863",
    stem: "A patient on mechanical ventilation has a sudden drop in SpO2 from 97% to 82%. The ventilator shows a high-pressure alarm and the patient is cyanotic with absent breath sounds on the right side. What is the priority action?",
    options: [
      "Disconnect from ventilator and manually ventilate while preparing for needle decompression",
      "Suction the endotracheal tube",
      "Increase FiO2 to 1.0 and continue mechanical ventilation",
      "Obtain a stat chest X-ray"
    ],
    correctIndex: 0,
    rationale: "Sudden desaturation with absent unilateral breath sounds and high-pressure alarm suggests tension pneumothorax. The priority is to disconnect from the ventilator (which may be worsening the pneumothorax), manually ventilate, and prepare for needle decompression. Waiting for a chest X-ray delays treatment of a life-threatening emergency.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "emergency management"
  },
  {
    id: "rrt-1864",
    stem: "Which mode of ventilation delivers a set pressure for a set inspiratory time, regardless of patient effort?",
    options: [
      "Pressure-controlled ventilation (PCV)",
      "Volume-controlled ventilation (VCV)",
      "Pressure support ventilation (PSV)",
      "CPAP"
    ],
    correctIndex: 0,
    rationale: "Pressure-controlled ventilation delivers a set inspiratory pressure for a set inspiratory time. The tidal volume varies based on compliance and resistance. VCV delivers a set volume. PSV is patient-triggered and cycled. CPAP provides continuous pressure without mandatory breaths.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "ventilator modes"
  },
  {
    id: "rrt-1865",
    stem: "A mechanically ventilated patient is being assessed for a spontaneous breathing trial (SBT). Which criterion would disqualify the patient from starting an SBT?",
    options: [
      "FiO2 requirement of 0.70 with PEEP of 12 cmH2O",
      "Patient is alert and following commands",
      "Hemodynamically stable without vasopressors",
      "Adequate cough reflex present"
    ],
    correctIndex: 0,
    rationale: "An SBT should not be attempted if the patient requires high FiO2 (>0.50) or high PEEP (>8 cmH2O), indicating significant oxygenation impairment. Being alert, hemodynamically stable, and having an adequate cough are all positive indicators for weaning readiness.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "weaning parameters"
  },
  {
    id: "rrt-1866",
    stem: "In pressure-controlled ventilation, what happens to the delivered tidal volume if the patient's lung compliance decreases?",
    options: [
      "Tidal volume decreases",
      "Tidal volume increases",
      "Tidal volume remains the same",
      "Tidal volume doubles"
    ],
    correctIndex: 0,
    rationale: "In pressure-controlled ventilation, the ventilator delivers a set pressure. If lung compliance decreases (stiffer lungs), less volume is delivered at the same pressure. This is a key difference from volume-controlled ventilation, where the volume is guaranteed but pressure varies.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "ventilator modes"
  },
  {
    id: "rrt-1867",
    stem: "A patient with severe ARDS is on mechanical ventilation with FiO2 1.0 and PEEP 14 cmH2O. The PaO2 is 55 mmHg. The physician asks for a recruitment maneuver. What is the purpose of this intervention?",
    options: [
      "Open collapsed alveoli to improve gas exchange",
      "Decrease airway resistance",
      "Reduce minute ventilation",
      "Improve CO2 elimination"
    ],
    correctIndex: 0,
    rationale: "Recruitment maneuvers (sustained inflation or stepwise PEEP increases) are designed to open collapsed alveoli in ARDS to improve oxygenation by increasing the surface area available for gas exchange. They do not primarily affect airway resistance, minute ventilation, or CO2 elimination.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "ARDS management"
  },
  {
    id: "rrt-1868",
    stem: "What is the purpose of an inspiratory hold maneuver during mechanical ventilation?",
    options: [
      "To measure plateau pressure and calculate static compliance",
      "To increase tidal volume delivery",
      "To reduce auto-PEEP",
      "To improve patient triggering"
    ],
    correctIndex: 0,
    rationale: "An inspiratory hold briefly pauses gas flow at end-inspiration, allowing pressure to equilibrate and measure plateau pressure. This is used to calculate static compliance (VT / [Pplat - PEEP]) and assess alveolar distending pressure. It does not affect tidal volume, auto-PEEP, or triggering.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1869",
    stem: "A patient on mechanical ventilation has the following: PIP 40 cmH2O, Pplat 38 cmH2O, PEEP 5 cmH2O. What does this suggest?",
    options: [
      "Decreased lung compliance with normal airway resistance",
      "Increased airway resistance with normal lung compliance",
      "Normal pulmonary mechanics",
      "Equipment malfunction"
    ],
    correctIndex: 0,
    rationale: "When PIP and Pplat are both elevated and close together (small PIP-Pplat gradient of 2 cmH2O), airway resistance is normal but lung compliance is decreased. Causes include pulmonary fibrosis, ARDS, pulmonary edema, or pneumothorax. Increased airway resistance would show a large PIP-Pplat gradient.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pressure monitoring"
  },
  {
    id: "rrt-1870",
    stem: "Which of the following best describes the function of the flow trigger on a mechanical ventilator?",
    options: [
      "It detects a decrease in bias flow caused by patient inspiratory effort to initiate a breath",
      "It sets the peak inspiratory flow rate",
      "It determines the expiratory time",
      "It controls the FiO2 delivered"
    ],
    correctIndex: 0,
    rationale: "A flow trigger senses a change (decrease) in the continuous bias flow through the circuit when the patient makes an inspiratory effort. When the flow drop exceeds the set sensitivity, the ventilator delivers a breath. Flow triggering is generally more sensitive and requires less work than pressure triggering.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "ventilator triggering"
  },
  {
    id: "rrt-1871",
    stem: "A patient with COPD is being mechanically ventilated. The expiratory flow waveform does not return to baseline before the next breath is delivered. What does this indicate?",
    options: [
      "Air trapping and auto-PEEP",
      "Normal ventilation pattern",
      "Circuit leak",
      "Patient-ventilator synchrony"
    ],
    correctIndex: 0,
    rationale: "When expiratory flow does not return to zero (baseline) before the next breath, it indicates that exhalation is incomplete, resulting in air trapping and auto-PEEP (intrinsic PEEP). This is common in obstructive diseases like COPD and asthma. Interventions include reducing rate, reducing VT, or increasing expiratory time.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "auto-PEEP"
  },
  {
    id: "rrt-1872",
    stem: "What is the most common complication of prolonged mechanical ventilation with high FiO2 (>0.60)?",
    options: [
      "Oxygen toxicity causing absorption atelectasis and alveolar damage",
      "Respiratory alkalosis",
      "Pulmonary embolism",
      "Pneumomediastinum"
    ],
    correctIndex: 0,
    rationale: "Prolonged exposure to high FiO2 (>0.60 for >24-48 hours) causes oxygen toxicity, which leads to formation of oxygen free radicals, alveolar damage, absorption atelectasis (nitrogen washout), and can progress to ARDS-like injury. FiO2 should be weaned to <0.60 as quickly as possible.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "oxygen toxicity"
  },
  {
    id: "rrt-1873",
    stem: "A patient is on volume-controlled ventilation with a set VT of 500 mL and rate of 16. The exhaled tidal volume is consistently reading 380 mL. What is the most likely cause?",
    options: [
      "Air leak in the ventilator circuit or around the ET tube cuff",
      "Increased airway resistance",
      "Decreased lung compliance",
      "Auto-PEEP"
    ],
    correctIndex: 0,
    rationale: "A significant difference between set and exhaled tidal volume in volume-controlled ventilation indicates a leak, either in the circuit connections or around a deflated or inadequate endotracheal tube cuff. Increased resistance and decreased compliance would not cause volume loss; they affect pressures. Auto-PEEP causes air trapping, not volume loss.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "troubleshooting"
  },
  {
    id: "rrt-1874",
    stem: "In ARDS management, what is the primary benefit of prone positioning?",
    options: [
      "Improved ventilation-perfusion matching and oxygenation",
      "Reduced need for sedation",
      "Easier airway suctioning",
      "Prevention of ventilator-associated pneumonia"
    ],
    correctIndex: 0,
    rationale: "Prone positioning in ARDS improves oxygenation by redistributing ventilation to previously dependent (dorsal) lung regions, improving V/Q matching, reducing shunt fraction, and improving chest wall mechanics. Studies show a mortality benefit in severe ARDS when used for ≥16 hours/day.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "ARDS management"
  },
  {
    id: "rrt-1875",
    stem: "What is the appropriate endotracheal tube size for an average adult male?",
    options: [
      "7.5-8.5 mm internal diameter",
      "5.0-6.0 mm internal diameter",
      "9.5-10.5 mm internal diameter",
      "4.0-4.5 mm internal diameter"
    ],
    correctIndex: 0,
    rationale: "The standard ET tube size for an adult male is 7.5-8.5 mm ID. Adult females typically use 7.0-8.0 mm ID. Sizes 5.0-6.0 are used for older pediatric patients. Sizes 9.5-10.5 are rarely used and increase the risk of tracheal injury. Sizes 4.0-4.5 are for small children.",
    difficulty: 1,
    category: "Airway Management",
    topic: "endotracheal intubation"
  },
  {
    id: "rrt-1876",
    stem: "After endotracheal intubation, what is the recommended method to confirm proper tube placement?",
    options: [
      "End-tidal CO2 detection (capnography) combined with chest X-ray",
      "Auscultation of breath sounds only",
      "Observation of chest rise only",
      "Pulse oximetry alone"
    ],
    correctIndex: 0,
    rationale: "The gold standard for confirming ET tube placement is continuous waveform capnography (ETCO2 detection) for immediate confirmation, followed by chest X-ray to verify depth and position. Auscultation and chest rise are helpful but can be misleading. Pulse oximetry has a delay and does not confirm tracheal placement.",
    difficulty: 3,
    category: "Airway Management",
    topic: "endotracheal intubation"
  },
  {
    id: "rrt-1877",
    stem: "The recommended cuff pressure range for an endotracheal tube to prevent tracheal mucosal ischemia while maintaining an adequate seal is:",
    options: [
      "20-30 cmH2O",
      "35-45 cmH2O",
      "10-15 cmH2O",
      "50-60 cmH2O"
    ],
    correctIndex: 0,
    rationale: "ET tube cuff pressure should be maintained between 20-30 cmH2O (approximately 15-22 mmHg). Pressures above 30 cmH2O can exceed capillary perfusion pressure (approximately 25-35 cmH2O), causing tracheal mucosal ischemia, necrosis, and potential tracheal stenosis. Pressures below 20 cmH2O risk aspiration and air leak.",
    difficulty: 1,
    category: "Airway Management",
    topic: "endotracheal tube management"
  },
  {
    id: "rrt-1878",
    stem: "A respiratory therapist is preparing to intubate a patient using a Macintosh blade. Where should the tip of this blade be placed?",
    options: [
      "In the vallecula, anterior to the epiglottis",
      "Directly lifting the epiglottis",
      "At the base of the tongue",
      "Posterior to the epiglottis"
    ],
    correctIndex: 0,
    rationale: "The Macintosh (curved) blade is placed in the vallecula (the space between the base of the tongue and the epiglottis). Lifting forward and upward indirectly lifts the epiglottis via the hyoepiglottic ligament, exposing the vocal cords. The Miller (straight) blade directly lifts the epiglottis.",
    difficulty: 3,
    category: "Airway Management",
    topic: "endotracheal intubation"
  },
  {
    id: "rrt-1879",
    stem: "Which airway management device is most appropriate as a rescue airway when endotracheal intubation has failed?",
    options: [
      "Laryngeal mask airway (LMA)",
      "Nasopharyngeal airway",
      "Oropharyngeal airway",
      "Simple face mask"
    ],
    correctIndex: 0,
    rationale: "The laryngeal mask airway (LMA) is a supraglottic airway device that is an effective rescue airway for failed intubation scenarios. It provides a seal around the laryngeal inlet without entering the trachea. Nasopharyngeal and oropharyngeal airways are basic adjuncts that do not protect from aspiration. A face mask is not a definitive airway.",
    difficulty: 3,
    category: "Airway Management",
    topic: "rescue airways"
  },
  {
    id: "rrt-1880",
    stem: "A patient with a tracheostomy develops respiratory distress and the inner cannula appears obstructed. What is the first action?",
    options: [
      "Remove and clean or replace the inner cannula",
      "Call for emergency intubation",
      "Increase the FiO2",
      "Administer a bronchodilator"
    ],
    correctIndex: 0,
    rationale: "When a tracheostomy inner cannula is obstructed, the first and fastest intervention is to remove the inner cannula. This is the primary reason inner cannulas are designed to be removable. If the outer cannula is also obstructed, the entire tracheostomy tube may need replacement. Calling for intubation is not the first step.",
    difficulty: 1,
    category: "Airway Management",
    topic: "tracheostomy management"
  },
  {
    id: "rrt-1881",
    stem: "A patient on mechanical ventilation requires frequent suctioning. The therapist notes that the patient desaturates significantly during open suctioning. What technique modification would best prevent desaturation?",
    options: [
      "Use a closed (in-line) suction catheter system",
      "Increase suction pressure to 200 mmHg",
      "Suction for longer duration each pass",
      "Disconnect the patient and hyperventilate manually"
    ],
    correctIndex: 0,
    rationale: "Closed (in-line) suction systems allow suctioning without disconnecting from the ventilator, maintaining PEEP and FiO2, which significantly reduces desaturation. Increasing suction pressure or duration increases mucosal trauma and atelectasis. Manual hyperventilation is less effective than maintaining ventilator settings.",
    difficulty: 3,
    category: "Airway Management",
    topic: "airway suctioning"
  },
  {
    id: "rrt-1882",
    stem: "Which of the following is a contraindication for nasotracheal intubation?",
    options: [
      "Suspected basilar skull fracture",
      "Cervical spine immobilization",
      "Intact gag reflex",
      "Oral trauma"
    ],
    correctIndex: 0,
    rationale: "Nasotracheal intubation is contraindicated in suspected basilar skull fracture due to the risk of the tube entering the cranial vault through the cribriform plate fracture. Cervical spine immobilization is actually an indication for nasal intubation. Oral trauma may favor nasal over oral route.",
    difficulty: 3,
    category: "Airway Management",
    topic: "nasotracheal intubation"
  },
  {
    id: "rrt-1883",
    stem: "A mechanically ventilated patient's high-pressure alarm sounds with every breath. The therapist cannot pass a suction catheter beyond the end of the ET tube. What is the most likely problem?",
    options: [
      "The ET tube is kinked or obstructed by a mucus plug",
      "The ventilator is malfunctioning",
      "The patient has developed a pneumothorax",
      "The PEEP is set too high"
    ],
    correctIndex: 0,
    rationale: "Inability to pass a suction catheter combined with high-pressure alarms indicates ET tube obstruction, either from kinking, biting, or a mucus plug. If suctioning fails to resolve the obstruction, the tube may need replacement. A pneumothorax would not prevent catheter passage. High PEEP would not obstruct catheter passage.",
    difficulty: 3,
    category: "Airway Management",
    topic: "troubleshooting"
  },
  {
    id: "rrt-1884",
    stem: "What is the maximum duration for each suctioning pass through an endotracheal tube in an adult patient?",
    options: [
      "10-15 seconds",
      "30-45 seconds",
      "5 seconds",
      "60 seconds"
    ],
    correctIndex: 0,
    rationale: "Each suction pass should last no longer than 10-15 seconds to minimize hypoxemia, mucosal trauma, atelectasis, and vagal stimulation. Prolonged suctioning increases the risk of bradycardia, desaturation, and cardiac arrest. The catheter should be inserted without suction and withdrawn with intermittent suction.",
    difficulty: 1,
    category: "Airway Management",
    topic: "airway suctioning"
  },
  {
    id: "rrt-1885",
    stem: "A patient is intubated and the ET tube is taped at 23 cm at the teeth. A chest X-ray shows the tube tip at the level of the carina. What should the therapist do?",
    options: [
      "Withdraw the tube 2-3 cm and re-secure",
      "Advance the tube 2 cm further",
      "Leave the tube in current position",
      "Remove the tube and re-intubate"
    ],
    correctIndex: 0,
    rationale: "The ET tube tip should be 2-6 cm above the carina (approximately at T3-T4 level). If the tip is at the carina, it risks right mainstem intubation. The tube should be withdrawn 2-3 cm, re-secured, and placement confirmed with another chest X-ray. Complete removal and re-intubation is unnecessary.",
    difficulty: 3,
    category: "Airway Management",
    topic: "endotracheal tube positioning"
  },
  {
    id: "rrt-1886",
    stem: "During a difficult intubation, a video laryngoscope provides which primary advantage over a conventional direct laryngoscope?",
    options: [
      "Improved visualization of the glottis without requiring direct line of sight",
      "Faster intubation time in all circumstances",
      "Elimination of the need for stylet use",
      "Reduced need for patient positioning"
    ],
    correctIndex: 0,
    rationale: "Video laryngoscopy provides an indirect view of the glottis via a camera at the blade tip, allowing visualization without requiring alignment of the oral, pharyngeal, and laryngeal axes. This is especially beneficial in patients with difficult airways. It does not necessarily speed up intubation or eliminate stylet use.",
    difficulty: 3,
    category: "Airway Management",
    topic: "difficult airway management"
  },
  {
    id: "rrt-1887",
    stem: "A respiratory therapist is performing tracheostomy care. During the procedure, the tracheostomy tube is accidentally dislodged. The stoma is less than 7 days old. What is the most appropriate action?",
    options: [
      "Orotracheally intubate the patient and call the physician",
      "Immediately reinsert the tracheostomy tube",
      "Apply a face mask and wait for the physician",
      "Insert a nasopharyngeal airway"
    ],
    correctIndex: 0,
    rationale: "When a tracheostomy tube is dislodged from a fresh stoma (less than 7 days old), the tract is not yet mature and reinsertion is dangerous as it may create a false passage. The safest action is to orotracheally intubate and call for physician assistance. In a mature stoma (>7 days), the tube can be carefully reinserted.",
    difficulty: 4,
    category: "Airway Management",
    topic: "tracheostomy management"
  },
  {
    id: "rrt-1888",
    stem: "Which of the following patients is the best candidate for non-invasive positive pressure ventilation (NIPPV)?",
    options: [
      "A patient with COPD exacerbation who is alert and cooperative",
      "A patient with facial burns and airway edema",
      "An unconscious patient with vomiting",
      "A patient with massive hemoptysis"
    ],
    correctIndex: 0,
    rationale: "NIPPV (BiPAP/CPAP) is most appropriate for alert, cooperative patients with COPD exacerbation, cardiogenic pulmonary edema, or acute hypoxemic respiratory failure. Contraindications include facial trauma/burns, inability to protect airway, vomiting/aspiration risk, hemodynamic instability, and decreased consciousness.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "non-invasive ventilation"
  },
  {
    id: "rrt-1889",
    stem: "On BiPAP, the IPAP is set at 15 cmH2O and the EPAP is set at 5 cmH2O. What is the effective pressure support level?",
    options: [
      "10 cmH2O",
      "15 cmH2O",
      "20 cmH2O",
      "5 cmH2O"
    ],
    correctIndex: 0,
    rationale: "The effective pressure support on BiPAP equals IPAP minus EPAP. With IPAP of 15 and EPAP of 5, the pressure support is 10 cmH2O (15 - 5 = 10). IPAP provides the total inspiratory pressure, and EPAP is equivalent to PEEP/CPAP.",
    difficulty: 1,
    category: "Mechanical Ventilation",
    topic: "non-invasive ventilation"
  },
  {
    id: "rrt-1890",
    stem: "A patient on mechanical ventilation has a static compliance of 20 mL/cmH2O. The normal range is 60-100 mL/cmH2O. Which condition is most consistent with this finding?",
    options: [
      "Acute respiratory distress syndrome (ARDS)",
      "Chronic bronchitis",
      "Upper airway obstruction",
      "Asthma exacerbation"
    ],
    correctIndex: 0,
    rationale: "Markedly decreased static compliance (20 mL/cmH2O vs normal 60-100) indicates severely stiff lungs, which is characteristic of ARDS. Chronic bronchitis, upper airway obstruction, and asthma primarily affect airway resistance rather than compliance. ARDS causes diffuse alveolar damage reducing lung compliance.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1891",
    stem: "What is the Mallampati classification used for?",
    options: [
      "Predicting difficulty of endotracheal intubation based on oropharyngeal view",
      "Classifying severity of ARDS",
      "Determining ventilator mode selection",
      "Grading tracheostomy stoma maturity"
    ],
    correctIndex: 0,
    rationale: "The Mallampati classification (Class I-IV) assesses the visibility of oropharyngeal structures (uvula, soft palate, fauces) to predict difficult intubation. Class I shows full visibility of structures; Class IV shows only the hard palate. Higher classes correlate with more difficult intubation.",
    difficulty: 3,
    category: "Airway Management",
    topic: "airway assessment"
  },
  {
    id: "rrt-1892",
    stem: "A patient on volume-controlled ventilation with a set VT of 500 mL has the following: PIP 30 cmH2O, Pplat 28 cmH2O, PEEP 5 cmH2O. What is the dynamic compliance?",
    options: [
      "20 mL/cmH2O",
      "22 mL/cmH2O",
      "25 mL/cmH2O",
      "100 mL/cmH2O"
    ],
    correctIndex: 0,
    rationale: "Dynamic compliance = VT / (PIP - PEEP) = 500 / (30 - 5) = 500 / 25 = 20 mL/cmH2O. Dynamic compliance reflects both airway resistance and lung compliance. Static compliance = VT / (Pplat - PEEP) = 500 / (28 - 5) = 500 / 23 = 21.7 mL/cmH2O.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1893",
    stem: "Airway resistance is calculated using which formula?",
    options: [
      "(PIP - Pplat) / Flow",
      "(Pplat - PEEP) / VT",
      "VT / (PIP - PEEP)",
      "VT x Respiratory rate"
    ],
    correctIndex: 0,
    rationale: "Airway resistance (Raw) = (PIP - Pplat) / Flow. The difference between PIP and plateau pressure represents the pressure required to overcome airway resistance. Normal airway resistance is 0.6-2.4 cmH2O/L/sec on mechanical ventilation. The other formulas calculate compliance or minute ventilation.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1894",
    stem: "A patient on SIMV mode has a set rate of 10, but the total respiratory rate is 24. The patient appears comfortable. What is the appropriate action?",
    options: [
      "No change needed if the patient is comfortable with adequate ABGs",
      "Increase the mandatory rate to match the total rate",
      "Sedate the patient to suppress spontaneous breathing",
      "Switch immediately to assist-control mode"
    ],
    correctIndex: 0,
    rationale: "In SIMV, patients breathe spontaneously between mandatory breaths. If the patient is comfortable and ABGs are acceptable, no changes are needed. The spontaneous breaths provide exercise for respiratory muscles, supporting weaning. Sedation to suppress breathing and increasing the rate would defeat the purpose of SIMV for weaning.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "SIMV mode"
  },
  {
    id: "rrt-1895",
    stem: "What is the formula for calculating minute ventilation?",
    options: [
      "Tidal volume multiplied by respiratory rate",
      "Tidal volume divided by respiratory rate",
      "Peak pressure multiplied by flow rate",
      "FiO2 multiplied by tidal volume"
    ],
    correctIndex: 0,
    rationale: "Minute ventilation (VE) = Tidal volume (VT) x Respiratory rate (f). Normal minute ventilation is approximately 5-10 L/min. Minute ventilation determines CO2 elimination; increasing VE decreases PaCO2, and decreasing VE increases PaCO2.",
    difficulty: 1,
    category: "Mechanical Ventilation",
    topic: "ventilator calculations"
  },
  {
    id: "rrt-1896",
    stem: "A patient on mechanical ventilation has persistent patient-ventilator asynchrony manifesting as double-triggering. What is the most likely cause?",
    options: [
      "The set tidal volume or inspiratory time is too short for patient demand",
      "The trigger sensitivity is too low",
      "The PEEP is set too high",
      "The FiO2 is too low"
    ],
    correctIndex: 0,
    rationale: "Double-triggering occurs when the ventilator cycles off before the patient's inspiratory effort ends, causing the patient to trigger a second breath immediately. This is commonly caused by insufficient tidal volume or inspiratory time for the patient's demand. Increasing VT, inspiratory time, or switching to pressure support may resolve it.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "patient-ventilator asynchrony"
  },
  {
    id: "rrt-1897",
    stem: "Which of the following is the correct formula for calculating the P/F ratio?",
    options: [
      "PaO2 divided by FiO2",
      "PaO2 multiplied by FiO2",
      "FiO2 divided by PaO2",
      "PaCO2 divided by FiO2"
    ],
    correctIndex: 0,
    rationale: "The P/F ratio (PaO2/FiO2) is used to assess oxygenation efficiency. Normal P/F is >400. A P/F of 200-300 indicates mild ARDS, 100-200 moderate ARDS, and <100 severe ARDS. For example, PaO2 80 on FiO2 0.40 = P/F of 200.",
    difficulty: 1,
    category: "Mechanical Ventilation",
    topic: "oxygenation assessment"
  },
  {
    id: "rrt-1898",
    stem: "A COPD patient on mechanical ventilation has permissive hypercapnia. The ABG shows pH 7.30, PaCO2 55 mmHg. Which is the primary rationale for tolerating this?",
    options: [
      "To allow lower tidal volumes and prevent ventilator-induced lung injury",
      "To increase oxygen delivery to tissues",
      "To reduce the need for PEEP",
      "To prepare for immediate extubation"
    ],
    correctIndex: 0,
    rationale: "Permissive hypercapnia is a strategy used in lung-protective ventilation where elevated PaCO2 is tolerated to allow use of lower tidal volumes (6-8 mL/kg IBW), preventing volutrauma and barotrauma. The mild acidosis is generally well-tolerated as long as pH stays above 7.20-7.25.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "lung-protective ventilation"
  },
  {
    id: "rrt-1899",
    stem: "What is the correct depth for endotracheal suctioning using the measured technique?",
    options: [
      "Insert the catheter to the length of the ET tube plus the adapter, no further than 1 cm past the tube tip",
      "Insert until resistance is met, then withdraw 2 cm",
      "Insert to twice the length of the ET tube",
      "Insert 5 cm past the tip of the ET tube"
    ],
    correctIndex: 0,
    rationale: "The measured (shallow) suctioning technique inserts the catheter to a predetermined distance (ET tube length + adapter), not more than 1 cm past the tube tip. This reduces tracheal mucosal trauma compared to deep suctioning (insertion until resistance). The measured technique is recommended by current guidelines.",
    difficulty: 3,
    category: "Airway Management",
    topic: "airway suctioning"
  },
  {
    id: "rrt-1900",
    stem: "A patient develops subcutaneous emphysema in the neck and chest after being placed on mechanical ventilation. What does this finding suggest?",
    options: [
      "Barotrauma with air leak, possibly pneumothorax or pneumomediastinum",
      "Allergic reaction to the ET tube material",
      "Fluid overload",
      "Aspiration pneumonia"
    ],
    correctIndex: 0,
    rationale: "Subcutaneous emphysema (crepitus under the skin) in a mechanically ventilated patient is a sign of barotrauma with air leak into surrounding tissues. This suggests pneumothorax, pneumomediastinum, or tracheal injury. Immediate chest X-ray and possible chest tube insertion are needed. High pressures and large tidal volumes increase the risk.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "complications"
  },
  {
    id: "rrt-1901",
    stem: "Which head position is recommended to optimize the view during direct laryngoscopy for endotracheal intubation?",
    options: [
      "Sniffing position with neck flexion and head extension",
      "Full neck extension",
      "Neutral position with no head movement",
      "Full neck flexion"
    ],
    correctIndex: 0,
    rationale: "The sniffing position (lower cervical flexion with atlanto-occipital extension) aligns the oral, pharyngeal, and laryngeal axes to provide the best visualization of the glottis during direct laryngoscopy. Full extension or flexion alone does not align all three axes. Neutral position provides poor visualization.",
    difficulty: 1,
    category: "Airway Management",
    topic: "endotracheal intubation"
  },
  {
    id: "rrt-1902",
    stem: "A ventilator-dependent patient has a tracheostomy and wants to speak. Which device allows phonation while maintaining ventilation?",
    options: [
      "Passy-Muir speaking valve",
      "Fenestrated inner cannula alone",
      "Cuff deflation without any valve",
      "Increased PEEP"
    ],
    correctIndex: 0,
    rationale: "The Passy-Muir speaking valve is a one-way valve that allows air to enter through the tracheostomy on inspiration but redirects exhaled air up through the vocal cords on expiration, enabling phonation. The cuff must be deflated when using this valve. A fenestrated cannula alone does not redirect airflow. Increased PEEP does not facilitate speech.",
    difficulty: 2,
    category: "Airway Management",
    topic: "tracheostomy management"
  },
  {
    id: "rrt-1903",
    stem: "A patient on volume-controlled ventilation has a sudden increase in both PIP and Pplat from 25/20 to 45/40 cmH2O. Which of the following is the most likely cause?",
    options: [
      "Right mainstem intubation",
      "Bronchospasm",
      "ET tube kinking",
      "Secretions in the airway"
    ],
    correctIndex: 0,
    rationale: "When both PIP and Pplat increase together (small PIP-Pplat gradient maintained), the problem is decreased compliance, not increased resistance. Right mainstem intubation decreases the ventilated lung area, markedly reducing compliance. Bronchospasm, kinking, and secretions increase resistance and would widen the PIP-Pplat gradient.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "troubleshooting"
  },
  {
    id: "rrt-1904",
    stem: "What is the appropriate suction catheter size for a 8.0 mm endotracheal tube?",
    options: [
      "12 French",
      "16 French",
      "8 French",
      "18 French"
    ],
    correctIndex: 0,
    rationale: "The suction catheter should not exceed half the internal diameter of the ET tube to prevent excessive negative pressure and atelectasis. For an 8.0 mm ET tube: multiply the ET tube size by 2, then subtract 2 (8 x 2 - 2 = 14, so use 12 or 14 French). Alternatively, catheter OD should be less than 50% of ET tube ID. 12 French is appropriate.",
    difficulty: 2,
    category: "Airway Management",
    topic: "airway suctioning"
  },
  {
    id: "rrt-1905",
    stem: "A patient develops ventilator-associated pneumonia (VAP). Which of the following strategies is most effective in preventing VAP?",
    options: [
      "Elevating the head of bed to 30-45 degrees",
      "Using heated humidification instead of HME",
      "Increasing the PEEP to 15 cmH2O",
      "Performing tracheostomy within 24 hours"
    ],
    correctIndex: 0,
    rationale: "Head of bed elevation to 30-45 degrees is one of the most evidence-based interventions to prevent VAP by reducing the risk of aspiration of gastric contents and oropharyngeal secretions. Other VAP bundle elements include oral care with chlorhexidine, daily sedation vacations, DVT prophylaxis, and subglottic secretion drainage.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "ventilator-associated pneumonia"
  },
  {
    id: "rrt-1906",
    stem: "During mechanical ventilation, the I:E ratio is set at 1:3 with a respiratory rate of 12 and inspiratory time of 1.25 seconds. What is the expiratory time?",
    options: [
      "3.75 seconds",
      "2.50 seconds",
      "5.00 seconds",
      "1.25 seconds"
    ],
    correctIndex: 0,
    rationale: "With an I:E ratio of 1:3, the expiratory time is 3 times the inspiratory time. Inspiratory time = 1.25 seconds, so expiratory time = 1.25 x 3 = 3.75 seconds. Total cycle time = 60/12 = 5 seconds, which equals 1.25 + 3.75 = 5 seconds, confirming the calculation.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "ventilator calculations"
  },
  {
    id: "rrt-1907",
    stem: "A patient with severe ARDS has refractory hypoxemia on conventional ventilation. The physician orders high-frequency oscillatory ventilation (HFOV). What is the primary mechanism of gas exchange in HFOV?",
    options: [
      "Enhanced molecular diffusion with tidal volumes smaller than dead space",
      "Large tidal volume delivery at high rates",
      "Negative pressure ventilation",
      "Intermittent mandatory breaths at high pressures"
    ],
    correctIndex: 0,
    rationale: "HFOV delivers very small tidal volumes (often less than anatomic dead space) at very high frequencies (3-15 Hz). Gas exchange occurs through enhanced molecular diffusion, coaxial flow, pendelluft, and Taylor dispersion rather than bulk convection. This maintains lung recruitment with minimal pressure swings.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "advanced ventilatory support"
  },
  {
    id: "rrt-1908",
    stem: "What is the recommended action if a mechanically ventilated patient bites down on the endotracheal tube, causing obstruction?",
    options: [
      "Insert a bite block (oral airway) alongside the ET tube",
      "Remove the ET tube immediately",
      "Increase the ventilator pressure to overcome the obstruction",
      "Apply manual jaw thrust without any adjunct"
    ],
    correctIndex: 0,
    rationale: "When a patient bites down on the ET tube causing obstruction, inserting a bite block (oropharyngeal airway) alongside the tube prevents further biting and restores airflow. Removing the tube risks loss of the airway. Increasing pressure could cause barotrauma. Manual jaw thrust alone will not prevent biting.",
    difficulty: 2,
    category: "Airway Management",
    topic: "endotracheal tube management"
  },
  {
    id: "rrt-1909",
    stem: "A patient on volume-controlled ventilation has the following waveform: a constant (square) flow pattern during inspiration. What is the advantage of switching to a decelerating flow pattern?",
    options: [
      "More even gas distribution and potentially lower peak airway pressure",
      "Higher minute ventilation",
      "Shorter inspiratory time",
      "Increased work of breathing"
    ],
    correctIndex: 0,
    rationale: "A decelerating (ramp) flow pattern delivers high flow initially that tapers off, allowing more even gas distribution to lung units with different time constants and generally producing lower peak airway pressures compared to constant (square) flow, though mean airway pressure may be similar. It does not increase minute ventilation or decrease inspiratory time.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "flow patterns"
  },
  {
    id: "rrt-1910",
    stem: "An emergency cricothyrotomy is indicated in which of the following situations?",
    options: [
      "Cannot intubate, cannot ventilate scenario with complete upper airway obstruction",
      "Patient requires long-term mechanical ventilation",
      "Patient has mild stridor responsive to racemic epinephrine",
      "Elective surgery requiring general anesthesia"
    ],
    correctIndex: 0,
    rationale: "Emergency cricothyrotomy (surgical airway) is the last resort in a 'cannot intubate, cannot ventilate' (CICV) scenario where all other airway management techniques have failed and the patient has complete upper airway obstruction. It is not indicated for elective situations, mild stridor, or when intubation is possible.",
    difficulty: 3,
    category: "Airway Management",
    topic: "emergency airway"
  },
  {
    id: "rrt-1911",
    stem: "What is the primary difference between assist-control (A/C) ventilation and SIMV?",
    options: [
      "In A/C, every patient-triggered breath receives a full machine breath; in SIMV, only breaths within the timing window receive machine breaths",
      "A/C does not allow patient triggering",
      "SIMV delivers higher tidal volumes than A/C",
      "A/C cannot be used with PEEP"
    ],
    correctIndex: 0,
    rationale: "In assist-control mode, every patient-triggered breath receives a full set tidal volume or pressure breath. In SIMV, only breaths that occur within a specific timing window receive mandatory breaths; additional spontaneous breaths are unsupported (unless pressure support is added). Both modes allow patient triggering and can be used with PEEP.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "ventilator modes"
  },
  {
    id: "rrt-1912",
    stem: "A respiratory therapist discovers that a patient's ET tube cuff pressure is 40 cmH2O. What is the appropriate intervention?",
    options: [
      "Remove air from the cuff to reduce pressure to 20-30 cmH2O",
      "Add more air to ensure an adequate seal",
      "No intervention needed",
      "Remove the ET tube and replace with a larger size"
    ],
    correctIndex: 0,
    rationale: "Cuff pressure of 40 cmH2O exceeds the recommended 20-30 cmH2O range and can cause tracheal mucosal ischemia leading to tracheal stenosis, tracheomalacia, or tracheoesophageal fistula. Air should be carefully removed to bring the pressure within range while maintaining an adequate seal to prevent aspiration and air leak.",
    difficulty: 1,
    category: "Airway Management",
    topic: "endotracheal tube management"
  },
  {
    id: "rrt-1913",
    stem: "A patient with morbid obesity is placed on mechanical ventilation. What ventilator adjustment is most appropriate to improve oxygenation?",
    options: [
      "Apply higher PEEP to counteract the increased chest wall weight on the lungs",
      "Decrease the respiratory rate",
      "Use lower FiO2 to prevent oxygen toxicity",
      "Set tidal volume based on actual body weight"
    ],
    correctIndex: 0,
    rationale: "Morbid obesity increases the weight on the chest wall, causing atelectasis in dependent lung regions. Higher PEEP counteracts this compression, recruits atelectatic regions, and improves oxygenation. Tidal volume should be set based on ideal body weight, not actual weight. Simply lowering FiO2 or decreasing the rate does not address the underlying problem.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "special populations"
  },
  {
    id: "rrt-1914",
    stem: "Which type of humidification is preferred for a patient on mechanical ventilation who requires frequent nebulizer treatments?",
    options: [
      "Heated humidifier (active humidification)",
      "Heat and moisture exchanger (HME)",
      "Cool mist nebulizer in-line",
      "No humidification needed"
    ],
    correctIndex: 0,
    rationale: "Heated humidifiers (active humidification) are preferred when patients require frequent nebulizer treatments because HMEs must be removed during nebulization to prevent filter clogging and resistance increase. Active humidification also provides more consistent humidity and temperature. HMEs are contraindicated with copious secretions.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "humidification"
  },
  {
    id: "rrt-1915",
    stem: "What is the Cormack-Lehane classification used for during laryngoscopy?",
    options: [
      "Grading the laryngoscopic view of the glottis from Grade I (full view) to Grade IV (no glottic structures visible)",
      "Assessing ET tube cuff integrity",
      "Measuring the depth of sedation",
      "Classifying the type of ventilator mode"
    ],
    correctIndex: 0,
    rationale: "The Cormack-Lehane classification grades the laryngoscopic view: Grade I = full view of vocal cords, Grade II = partial view of vocal cords, Grade III = only epiglottis visible, Grade IV = neither epiglottis nor vocal cords visible. Higher grades indicate more difficult intubation. This helps document and communicate airway difficulty.",
    difficulty: 3,
    category: "Airway Management",
    topic: "airway assessment"
  },
  {
    id: "rrt-1916",
    stem: "A mechanically ventilated patient develops a low-pressure alarm. The therapist notes a large air leak and the cuff pilot balloon is deflated. What is the most likely problem?",
    options: [
      "Ruptured ET tube cuff",
      "Pneumothorax",
      "Mucus plug",
      "Increased compliance"
    ],
    correctIndex: 0,
    rationale: "A low-pressure alarm with a deflated pilot balloon and large air leak indicates a ruptured or leaking ET tube cuff. The cuff no longer maintains a seal around the trachea. The tube should be replaced as soon as possible. Pneumothorax causes high-pressure alarms. Mucus plug causes high-pressure alarms. Increased compliance does not cause low-pressure alarms.",
    difficulty: 2,
    category: "Airway Management",
    topic: "troubleshooting"
  },
  {
    id: "rrt-1917",
    stem: "In volume-controlled ventilation, if the respiratory rate is increased from 12 to 18 breaths/min while keeping the tidal volume constant at 500 mL, what happens to the minute ventilation?",
    options: [
      "Increases from 6 L/min to 9 L/min",
      "Decreases from 6 L/min to 4 L/min",
      "Remains at 6 L/min",
      "Increases from 6 L/min to 12 L/min"
    ],
    correctIndex: 0,
    rationale: "Minute ventilation = VT x RR. At rate 12: 500 x 12 = 6,000 mL/min (6 L/min). At rate 18: 500 x 18 = 9,000 mL/min (9 L/min). Minute ventilation increases by 50% when rate increases by 50% with constant tidal volume.",
    difficulty: 1,
    category: "Mechanical Ventilation",
    topic: "ventilator calculations"
  },
  {
    id: "rrt-1918",
    stem: "A patient on mechanical ventilation has the following settings: VT 400 mL, rate 20, FiO2 0.60, PEEP 10 cmH2O. ABG shows: pH 7.52, PaCO2 28 mmHg, PaO2 110 mmHg. What changes should be made?",
    options: [
      "Decrease the respiratory rate and decrease the FiO2",
      "Increase the respiratory rate and increase the PEEP",
      "Increase the tidal volume and increase the FiO2",
      "No changes needed"
    ],
    correctIndex: 0,
    rationale: "The ABG shows respiratory alkalosis (high pH, low PaCO2) indicating overventilation, and the PaO2 is higher than necessary on FiO2 0.60. The rate should be decreased to reduce minute ventilation and allow PaCO2 to rise. FiO2 should be decreased since PaO2 is adequately high, to reduce the risk of oxygen toxicity.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "ventilator management"
  },
  {
    id: "rrt-1919",
    stem: "What is the primary purpose of a subglottic suction port on an endotracheal tube?",
    options: [
      "To drain secretions that pool above the cuff, reducing ventilator-associated pneumonia risk",
      "To measure cuff pressure",
      "To deliver medications directly to the lungs",
      "To facilitate tube exchange"
    ],
    correctIndex: 0,
    rationale: "Subglottic secretion drainage (SSD) uses a separate lumen in the ET tube to continuously or intermittently drain secretions that accumulate above the cuff. This reduces the risk of microaspiration of contaminated secretions, which is the primary mechanism of ventilator-associated pneumonia. Studies show SSD reduces VAP incidence.",
    difficulty: 3,
    category: "Airway Management",
    topic: "ventilator-associated pneumonia prevention"
  },
  {
    id: "rrt-1920",
    stem: "A patient is being ventilated with inverse ratio ventilation (IRV) at an I:E ratio of 2:1. What is the primary goal of this strategy?",
    options: [
      "Increase mean airway pressure and improve oxygenation in severe ARDS",
      "Decrease inspiratory time",
      "Reduce the work of breathing",
      "Increase CO2 elimination"
    ],
    correctIndex: 0,
    rationale: "Inverse ratio ventilation (I:E >1:1) increases mean airway pressure by prolonging inspiratory time relative to expiratory time. This improves alveolar recruitment and oxygenation in severe ARDS. However, it requires heavy sedation/paralysis as it is uncomfortable, and carries risk of auto-PEEP and hemodynamic compromise.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "advanced ventilatory support"
  },
  {
    id: "rrt-1921",
    stem: "Which formula calculates the appropriate uncuffed endotracheal tube size for a pediatric patient?",
    options: [
      "(Age in years / 4) + 4",
      "(Age in years / 2) + 4",
      "Age in years + 2",
      "(Weight in kg / 10) + 3"
    ],
    correctIndex: 0,
    rationale: "The standard formula for uncuffed ET tube size in children older than 1 year is (age/4) + 4. For cuffed tubes, the formula is (age/4) + 3 (one size smaller). For example, a 4-year-old: (4/4) + 4 = 5.0 mm uncuffed or (4/4) + 3 = 4.0 mm cuffed.",
    difficulty: 2,
    category: "Airway Management",
    topic: "pediatric airway"
  },
  {
    id: "rrt-1922",
    stem: "During mechanical ventilation, what does the term 'driving pressure' refer to?",
    options: [
      "Plateau pressure minus PEEP",
      "Peak inspiratory pressure minus plateau pressure",
      "Set PEEP level",
      "Mean airway pressure"
    ],
    correctIndex: 0,
    rationale: "Driving pressure = Pplat - PEEP. It represents the pressure applied to inflate the lungs above the end-expiratory baseline. Recent evidence suggests driving pressure <15 cmH2O is associated with better outcomes in ARDS. It is essentially the tidal volume normalized to respiratory system compliance.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1923",
    stem: "A patient on BiPAP at IPAP 20/EPAP 8 complains of excessive air swallowing and abdominal distension. What adjustment is most appropriate?",
    options: [
      "Decrease the IPAP",
      "Increase the EPAP",
      "Increase the IPAP",
      "Remove BiPAP and intubate"
    ],
    correctIndex: 0,
    rationale: "Aerophagia (air swallowing) during non-invasive ventilation is commonly caused by excessive IPAP, which forces air into the esophagus. Decreasing the IPAP reduces the pressure delivered and can alleviate aerophagia while maintaining adequate ventilation. If the lower IPAP is insufficient, intubation may be considered but is not the first step.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "non-invasive ventilation"
  },
  {
    id: "rrt-1924",
    stem: "What is the most reliable sign that an endotracheal tube has been placed in the esophagus rather than the trachea?",
    options: [
      "Absence of end-tidal CO2 on capnography",
      "Bilateral breath sounds present",
      "SpO2 of 95%",
      "Chest rise observed"
    ],
    correctIndex: 0,
    rationale: "Absence of end-tidal CO2 on waveform capnography is the most reliable immediate indicator of esophageal intubation. In the esophagus, there is no CO2 exchange, so ETCO2 will be absent or near zero after a few breaths. SpO2 may remain normal initially due to oxygen reservoir. Breath sounds can be transmitted through the stomach. Chest rise may mimic gastric distension.",
    difficulty: 2,
    category: "Airway Management",
    topic: "endotracheal intubation"
  },
  {
    id: "rrt-1925",
    stem: "A patient with a fresh tracheostomy (day 2) has a tracheostomy tube with an inflated cuff. The nurse asks when the patient can begin using a speaking valve. When is it safe to use the speaking valve?",
    options: [
      "Only after the cuff is deflated and the patient can tolerate cuff deflation",
      "Immediately with the cuff inflated",
      "Only after the tracheostomy is removed",
      "Never with a tracheostomy tube"
    ],
    correctIndex: 0,
    rationale: "A speaking valve (such as Passy-Muir) requires the cuff to be deflated because exhaled air must pass around the tube and through the vocal cords. Using a speaking valve with an inflated cuff creates a complete obstruction with no outlet for exhaled air, which is life-threatening. The patient must tolerate cuff deflation first.",
    difficulty: 2,
    category: "Airway Management",
    topic: "tracheostomy management"
  },
  {
    id: "rrt-1926",
    stem: "A mechanically ventilated patient has the following: set VT 500 mL, measured VT 500 mL, PIP 35 cmH2O, Pplat 22 cmH2O, PEEP 5 cmH2O. What is the airway resistance if the peak flow is 60 L/min (1 L/sec)?",
    options: [
      "13 cmH2O/L/sec",
      "17 cmH2O/L/sec",
      "30 cmH2O/L/sec",
      "5 cmH2O/L/sec"
    ],
    correctIndex: 0,
    rationale: "Airway resistance = (PIP - Pplat) / Flow = (35 - 22) / 1 = 13 cmH2O/L/sec. Normal airway resistance on a ventilator is approximately 5-10 cmH2O/L/sec. This patient has mildly elevated airway resistance, which could be due to bronchospasm, secretions, or a small ET tube.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1927",
    stem: "Which of the following is an indication for performing a tracheostomy in a mechanically ventilated patient?",
    options: [
      "Anticipated need for prolonged mechanical ventilation (>14 days)",
      "Respiratory failure requiring ventilation for 24 hours",
      "Patient can be weaned within 48 hours",
      "Mild upper airway edema responding to steroids"
    ],
    correctIndex: 0,
    rationale: "Tracheostomy is generally considered when a patient is expected to require prolonged mechanical ventilation (typically >14 days), when weaning is expected to be slow, or when there is upper airway obstruction not amenable to other treatments. Short-term ventilation or easily treatable conditions do not warrant tracheostomy.",
    difficulty: 2,
    category: "Airway Management",
    topic: "tracheostomy indications"
  },
  {
    id: "rrt-1928",
    stem: "A patient on mechanical ventilation develops increased peak pressures, absent breath sounds on the left side, tracheal deviation to the right, and hypotension. What is the most likely diagnosis?",
    options: [
      "Left-sided tension pneumothorax",
      "Right-sided pneumonia",
      "ET tube in right mainstem bronchus",
      "Left-sided pleural effusion"
    ],
    correctIndex: 0,
    rationale: "The combination of absent breath sounds on one side, tracheal deviation away from the affected side, hypotension, and increased peak pressures in a ventilated patient is classic for tension pneumothorax. Positive pressure ventilation can worsen it. Emergency needle decompression followed by chest tube is required. Right mainstem intubation would show absent left breath sounds but not tracheal deviation.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "emergency management"
  },
  {
    id: "rrt-1929",
    stem: "What is the recommended suction pressure range for endotracheal suctioning in an adult?",
    options: [
      "100-150 mmHg",
      "200-300 mmHg",
      "50-75 mmHg",
      "400-500 mmHg"
    ],
    correctIndex: 0,
    rationale: "The recommended suction pressure for adult endotracheal suctioning is 100-150 mmHg (some references cite up to 120 mmHg). Excessive suction pressure (>150 mmHg) increases the risk of mucosal trauma, atelectasis, and hypoxemia. Pediatric suction pressures are lower (80-100 mmHg). Neonatal pressures are even lower (60-80 mmHg).",
    difficulty: 1,
    category: "Airway Management",
    topic: "airway suctioning"
  },
  {
    id: "rrt-1930",
    stem: "A patient on pressure-controlled ventilation has a set pressure of 20 cmH2O, PEEP of 5 cmH2O, and respiratory rate of 14. The delivered tidal volume has gradually decreased from 450 mL to 300 mL over 4 hours. What is the most likely explanation?",
    options: [
      "Worsening lung compliance",
      "Improved lung compliance",
      "Ventilator malfunction",
      "Decreased airway resistance"
    ],
    correctIndex: 0,
    rationale: "In pressure-controlled ventilation, the set pressure remains constant. If tidal volume decreases, it means the lungs are becoming stiffer (decreased compliance) or airway resistance is increasing. Common causes include worsening pulmonary edema, atelectasis, pneumothorax, or bronchospasm. Improved compliance would increase volume, not decrease it.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "pressure-controlled ventilation"
  },
  {
    id: "rrt-1931",
    stem: "Which of the following correctly describes the Miller laryngoscope blade?",
    options: [
      "A straight blade designed to directly lift the epiglottis",
      "A curved blade placed in the vallecula",
      "A blade with a built-in camera",
      "A blade used only for pediatric patients"
    ],
    correctIndex: 0,
    rationale: "The Miller blade is a straight laryngoscope blade designed to directly lift the epiglottis to expose the vocal cords. It is particularly useful in patients with a long, floppy epiglottis and in pediatric patients. The Macintosh blade is the curved blade placed in the vallecula. Both can be used in adults and children.",
    difficulty: 1,
    category: "Airway Management",
    topic: "laryngoscopy equipment"
  },
  {
    id: "rrt-1932",
    stem: "A patient on mechanical ventilation with PEEP of 10 cmH2O has a central venous pressure (CVP) reading of 18 mmHg. How does PEEP affect the CVP reading?",
    options: [
      "PEEP artificially elevates CVP readings, so the true CVP is likely lower",
      "PEEP has no effect on CVP readings",
      "PEEP decreases CVP readings",
      "PEEP only affects pulmonary artery pressures"
    ],
    correctIndex: 0,
    rationale: "PEEP increases intrathoracic pressure, which is transmitted to the great vessels and heart, artificially elevating CVP (and pulmonary artery wedge pressure) readings. The transmural (true) CVP is lower than the measured value. Clinicians must consider PEEP levels when interpreting hemodynamic measurements.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "hemodynamic effects"
  },
  {
    id: "rrt-1933",
    stem: "What is the primary advantage of using a cuffed endotracheal tube compared to an uncuffed tube?",
    options: [
      "Prevention of aspiration and ensuring consistent tidal volume delivery",
      "Easier insertion",
      "Less tracheal damage",
      "Better phonation"
    ],
    correctIndex: 0,
    rationale: "Cuffed ET tubes seal the airway to prevent aspiration of secretions and gastric contents and ensure that set tidal volumes are delivered without leak. Uncuffed tubes may allow aspiration and air leak around the tube. However, cuffed tubes carry the risk of tracheal injury if cuff pressures are not monitored. Uncuffed tubes are traditionally used in young children.",
    difficulty: 1,
    category: "Airway Management",
    topic: "endotracheal tube selection"
  },
  {
    id: "rrt-1934",
    stem: "A patient on volume-controlled A/C ventilation is triggering the ventilator at 30 breaths/min with a set VT of 500 mL and set rate of 14. The ABG shows pH 7.55, PaCO2 22 mmHg. What is occurring?",
    options: [
      "Respiratory alkalosis from excessive assisted ventilation due to patient-triggered breaths",
      "Metabolic alkalosis",
      "Normal ventilation",
      "Ventilator malfunction"
    ],
    correctIndex: 0,
    rationale: "In A/C mode, every triggered breath receives a full tidal volume. The patient is triggering 30 breaths/min, each receiving 500 mL, resulting in minute ventilation of 15 L/min causing severe respiratory alkalosis. This is a known disadvantage of A/C mode. Solutions include sedation, switching to SIMV, or adjusting trigger sensitivity.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "ventilator modes"
  },
  {
    id: "rrt-1935",
    stem: "What is the purpose of using a bougie (tracheal tube introducer) during intubation?",
    options: [
      "To guide the ET tube into the trachea when the glottis is not fully visualized",
      "To measure the depth of the trachea",
      "To suction secretions during intubation",
      "To inflate the ET tube cuff"
    ],
    correctIndex: 0,
    rationale: "A bougie (gum elastic bougie or tracheal tube introducer) is a semi-rigid stylet that can be passed through a partially visualized glottis (Cormack-Lehane Grade II or III). Once tracheal placement is confirmed (by clicks over tracheal rings and hold-up sign), the ET tube is railroaded over the bougie into the trachea.",
    difficulty: 3,
    category: "Airway Management",
    topic: "difficult airway management"
  },
  {
    id: "rrt-1936",
    stem: "A mechanically ventilated patient has mean airway pressure of 25 cmH2O. The physician asks about the relationship between mean airway pressure and oxygenation. Which statement is correct?",
    options: [
      "Increasing mean airway pressure generally improves oxygenation by increasing alveolar recruitment",
      "Mean airway pressure has no effect on oxygenation",
      "Lower mean airway pressure always improves oxygenation",
      "Mean airway pressure only affects CO2 elimination"
    ],
    correctIndex: 0,
    rationale: "Mean airway pressure (Paw) is directly related to oxygenation. Higher mean airway pressure increases alveolar recruitment and functional residual capacity, improving V/Q matching and oxygenation. However, excessively high Paw can cause hemodynamic compromise by reducing venous return. Factors that increase Paw include PEEP, inspiratory time, tidal volume, and flow pattern.",
    difficulty: 3,
    category: "Mechanical Ventilation",
    topic: "oxygenation"
  },
  {
    id: "rrt-1937",
    stem: "A patient is scheduled for elective intubation. The pre-assessment reveals a Mallampati Class IV airway, limited neck extension, and short thyromental distance. What is the best approach?",
    options: [
      "Prepare for a difficult airway with video laryngoscopy, bougie, and surgical airway equipment available",
      "Proceed with standard direct laryngoscopy without special preparation",
      "Cancel the procedure",
      "Attempt blind nasotracheal intubation"
    ],
    correctIndex: 0,
    rationale: "Multiple predictors of difficult airway (Mallampati IV, limited neck extension, short thyromental distance) indicate high risk of failed intubation. The therapist should prepare for a difficult airway: have video laryngoscope, bougie, supraglottic airways, and surgical airway equipment available. A clear algorithm (ASA Difficult Airway Algorithm) should be followed.",
    difficulty: 4,
    category: "Airway Management",
    topic: "difficult airway management"
  },
  {
    id: "rrt-1938",
    stem: "Which complication is most commonly associated with excessive PEEP?",
    options: [
      "Decreased cardiac output due to reduced venous return",
      "Increased airway resistance",
      "Respiratory acidosis",
      "Tracheal stenosis"
    ],
    correctIndex: 0,
    rationale: "Excessive PEEP increases intrathoracic pressure, which impedes venous return to the right heart, reducing preload and cardiac output. This can cause hypotension, especially in hypovolemic patients. Other complications include barotrauma and overdistension of alveoli. PEEP does not directly cause airway resistance changes or tracheal stenosis.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "PEEP complications"
  },
  {
    id: "rrt-1939",
    stem: "A patient who failed an SBT is placed back on full ventilatory support. What is the recommended waiting period before attempting another SBT?",
    options: [
      "24 hours",
      "1 hour",
      "48-72 hours",
      "1 week"
    ],
    correctIndex: 0,
    rationale: "After a failed SBT, guidelines recommend resting the patient on full ventilatory support for at least 24 hours before attempting another trial. This allows respiratory muscle recovery. During this period, the cause of failure should be identified and addressed. Too-frequent trials can cause respiratory muscle fatigue.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "weaning"
  },
  {
    id: "rrt-1940",
    stem: "An intubated patient on mechanical ventilation has copious bloody secretions from the ET tube. After suctioning, the blood continues. What should the respiratory therapist do?",
    options: [
      "Notify the physician immediately and maintain the airway; avoid excessive suctioning",
      "Continue aggressive suctioning until bleeding stops",
      "Deflate the ET tube cuff",
      "Remove the ET tube to inspect the source of bleeding"
    ],
    correctIndex: 0,
    rationale: "Frank bloody secretions (hemoptysis) from the ET tube indicate possible tracheal injury, pulmonary hemorrhage, or coagulopathy. The therapist should notify the physician immediately, maintain airway patency, avoid excessive suctioning (which can worsen mucosal injury), and prepare for possible bronchoscopy. Removing the tube removes airway protection.",
    difficulty: 3,
    category: "Airway Management",
    topic: "complications"
  },
  {
    id: "rrt-1941",
    stem: "What is the primary purpose of an expiratory hold maneuver during mechanical ventilation?",
    options: [
      "To measure total PEEP including auto-PEEP",
      "To measure plateau pressure",
      "To increase tidal volume",
      "To reduce airway resistance"
    ],
    correctIndex: 0,
    rationale: "An expiratory hold occludes the expiratory valve at end-expiration, allowing equilibration of pressure throughout the system. This measures total PEEP (set PEEP + auto-PEEP). Auto-PEEP = total PEEP - set PEEP. An inspiratory hold measures plateau pressure. Expiratory hold does not affect tidal volume or airway resistance.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "pulmonary mechanics"
  },
  {
    id: "rrt-1942",
    stem: "A patient with asthma is intubated during a severe exacerbation. What ventilator settings are most appropriate?",
    options: [
      "Low rate, low VT, prolonged expiratory time (I:E of 1:4 or greater), moderate PEEP",
      "High rate, high VT, short expiratory time",
      "High rate, high PEEP, FiO2 1.0",
      "Normal rate and VT with no PEEP"
    ],
    correctIndex: 0,
    rationale: "In severe asthma, air trapping is the primary concern. Settings should minimize air trapping: low respiratory rate, lower tidal volumes, prolonged expiratory time (I:E ratio of 1:4 or greater) to allow complete exhalation, and modest PEEP (to counteract auto-PEEP). Permissive hypercapnia may be necessary. High rates worsen air trapping.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "asthma management"
  },
  {
    id: "rrt-1943",
    stem: "Which of the following best describes the function of a heat and moisture exchanger (HME)?",
    options: [
      "It captures heat and moisture from exhaled gas and returns it to inspired gas",
      "It actively heats inspired gas using an electric element",
      "It adds sterile water vapor to the circuit",
      "It filters bacteria from room air"
    ],
    correctIndex: 0,
    rationale: "An HME (also called artificial nose) passively captures heat and moisture from the patient's exhaled breath and returns it during the next inspiration. It does not actively heat or add water. HMEs are simpler than heated humidifiers but less effective at providing 100% humidity. They should be replaced every 24-48 hours.",
    difficulty: 1,
    category: "Mechanical Ventilation",
    topic: "humidification"
  },
  {
    id: "rrt-1944",
    stem: "A patient on assist-control ventilation has respiratory muscle weakness and is unable to generate adequate effort to trigger the ventilator consistently. What trigger setting adjustment would help?",
    options: [
      "Increase trigger sensitivity (make it more sensitive/easier to trigger)",
      "Decrease trigger sensitivity (make it harder to trigger)",
      "Switch from flow triggering to pressure triggering",
      "Eliminate the trigger and use a time-cycled only mode"
    ],
    correctIndex: 0,
    rationale: "If a patient cannot generate enough effort to trigger the ventilator, the trigger sensitivity should be increased (set to a lower threshold, making it easier to trigger). For flow triggering, decrease the flow difference required. For pressure triggering, decrease the negative pressure required. Be cautious of auto-triggering if set too sensitive.",
    difficulty: 2,
    category: "Mechanical Ventilation",
    topic: "ventilator triggering"
  },
  {
    id: "rrt-1945",
    stem: "A patient intubated with a 7.0 mm ET tube requires MRI. Which type of ET tube must be used in the MRI suite?",
    options: [
      "MRI-compatible (non-ferromagnetic) ET tube",
      "Standard PVC ET tube with wire reinforcement",
      "Metal tracheostomy tube",
      "Any standard ET tube is safe in MRI"
    ],
    correctIndex: 0,
    rationale: "MRI requires MRI-compatible (MRI-conditional) equipment free of ferromagnetic materials. Standard ET tubes with metal springs in the pilot valve or wire-reinforced tubes can be hazardous in the MRI environment (projectile risk, heating, image artifact). MRI-safe ET tubes are specifically designed without ferromagnetic components.",
    difficulty: 3,
    category: "Airway Management",
    topic: "special situations"
  },
  {
    id: "rrt-1946",
    stem: "A ventilated patient develops sudden hypotension, elevated peak pressures, distant heart sounds, and distended neck veins. What condition should be suspected?",
    options: [
      "Cardiac tamponade or tension pneumothorax",
      "Ventilator-associated pneumonia",
      "Pulmonary embolism",
      "Atelectasis"
    ],
    correctIndex: 0,
    rationale: "The combination of hypotension, elevated peak pressures, distended neck veins, and distant (muffled) heart sounds suggests obstructive shock from cardiac tamponade (Beck's triad: hypotension, muffled heart sounds, JVD) or tension pneumothorax. Both are life-threatening emergencies requiring immediate intervention. PE can cause hypotension but not typically distant heart sounds and elevated peak pressures together.",
    difficulty: 4,
    category: "Mechanical Ventilation",
    topic: "emergency management"
  },
  {
    id: "rrt-1947",
    stem: "What is the typical FiO2 delivered by a standard nasal cannula at 4 L/min flow?",
    options: [
      "Approximately 36%",
      "Approximately 24%",
      "Approximately 50%",
      "Approximately 100%"
    ],
    correctIndex: 0,
    rationale: "A standard nasal cannula delivers approximately 4% additional FiO2 per liter of flow above room air (21%). At 4 L/min: 21% + (4 x 4%) = 21% + 16% = approximately 37%. The commonly cited values are: 1L=24%, 2L=28%, 3L=32%, 4L=36%, 5L=40%, 6L=44%. Actual FiO2 varies with breathing pattern.",
    difficulty: 1,
    category: "Airway Management",
    topic: "oxygen delivery devices"
  },
  {
    id: "rrt-1948",
    stem: "A mechanically ventilated patient on PEEP 12 cmH2O develops a bronchopleural fistula with a persistent air leak through the chest tube. What ventilator management strategy may help reduce the air leak?",
    options: [
      "Reduce PEEP and tidal volume to minimize airway pressures",
      "Increase PEEP to seal the fistula",
      "Increase tidal volume to maintain minute ventilation",
      "Switch to HFOV at high amplitude"
    ],
    correctIndex: 0,
    rationale: "A bronchopleural fistula with air leak is worsened by high airway pressures. Reducing PEEP and tidal volume minimizes the pressure gradient across the fistula, potentially reducing the leak. High-frequency ventilation at low amplitudes (not high) may also be considered. Increasing pressures worsens the leak.",
    difficulty: 5,
    category: "Mechanical Ventilation",
    topic: "special situations"
  },
  {
    id: "rrt-1949",
    stem: "A respiratory therapist is assessing a patient for extubation. The cuff leak test reveals no audible air leak when the cuff is deflated. What does this suggest?",
    options: [
      "Significant upper airway edema or swelling that may cause post-extubation stridor",
      "The ET tube is properly positioned",
      "The cuff is still inflated",
      "The patient is ready for extubation"
    ],
    correctIndex: 0,
    rationale: "A failed cuff leak test (no air leak when the cuff is deflated) suggests significant upper airway edema around the tube, which may cause post-extubation stridor or upper airway obstruction. Corticosteroids are often administered prior to extubation in these cases. A positive leak (air escaping around the tube) suggests the airway is patent.",
    difficulty: 3,
    category: "Airway Management",
    topic: "extubation assessment"
  }
];
