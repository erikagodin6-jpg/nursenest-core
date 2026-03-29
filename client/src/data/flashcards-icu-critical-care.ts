import type { FlashcardData } from "./flashcards-rpn";

export const icuCriticalCareFlashcards: FlashcardData[] = [
  // ============================================================
  // VENTILATOR MANAGEMENT (50 cards)
  // ============================================================
  {
    id: "icu-vent-q1",
    type: "question",
    question: "A mechanically ventilated patient on AC/VC mode has the following settings: TV 450 mL, RR 14, FiO2 60%, PEEP 10 cmH2O. The high-pressure alarm sounds. Peak inspiratory pressure is 52 cmH2O (was 28). Plateau pressure is 18 cmH2O. What is the most likely cause?",
    options: [
      "Decreased lung compliance from ARDS progression",
      "Increased airway resistance from mucus plugging or bronchospasm",
      "Auto-PEEP from air trapping",
      "Tension pneumothorax"
    ],
    correctIndex: 1,
    answer: "When peak inspiratory pressure is elevated but plateau pressure remains normal, the problem is increased airway resistance (not compliance). Mucus plugging or bronchospasm increases resistance during airflow but does not affect static (plateau) pressure. Compliance issues (ARDS, pneumothorax) would elevate both peak AND plateau pressures. The nurse should suction and assess for bronchospasm.",
    category: "Ventilator Management",
    difficulty: 3,
    optionRationales: [
      "ARDS progression decreases lung compliance, which would elevate BOTH peak and plateau pressures. Since plateau pressure is normal (18 cmH2O), compliance is not the issue. In ARDS, you would expect plateau pressure >30 cmH2O.",
      "",
      "Auto-PEEP from air trapping would show elevated total PEEP on expiratory hold maneuver and may increase peak pressure, but the characteristic finding is incomplete exhalation on the flow waveform. Plateau pressure would also be affected.",
      "Tension pneumothorax would cause decreased compliance, elevating both peak and plateau pressures. Additional findings would include absent breath sounds on the affected side, tracheal deviation, hemodynamic instability, and subcutaneous emphysema."
    ],
    clinicalPearl: "Peak pressure reflects BOTH airway resistance AND lung compliance. Plateau pressure reflects ONLY lung compliance (measured during an inspiratory hold when there is no airflow). If peak is high but plateau is normal: think airway problem (secretions, bronchospasm, kinked ETT). If both are high: think lung problem (ARDS, pneumothorax, pulmonary edema)."
  },
  {
    id: "icu-vent-q2",
    type: "question",
    question: "A patient with severe ARDS is on AC/VC ventilation: TV 350 mL (6 mL/kg IBW), RR 28, FiO2 100%, PEEP 16 cmH2O. ABG shows pH 7.22, PaCO2 62 mmHg, PaO2 58 mmHg, HCO3 24 mEq/L. P/F ratio is 58. What intervention should the nurse anticipate?",
    options: [
      "Increase tidal volume to 8 mL/kg to improve ventilation",
      "Initiate prone positioning for 16+ hours",
      "Add inhaled nitric oxide and increase PEEP to 20 cmH2O",
      "Prepare for ECMO evaluation"
    ],
    correctIndex: 1,
    answer: "With severe ARDS (P/F ratio <100) and refractory hypoxemia despite maximal FiO2 and adequate PEEP, prone positioning for 16+ hours per day is the next evidence-based intervention. The PROSEVA trial demonstrated a significant mortality reduction with early prone positioning in severe ARDS. Increasing tidal volume would violate lung-protective ventilation principles. Permissive hypercapnia (pH >7.20) is acceptable.",
    category: "Ventilator Management",
    difficulty: 3,
    optionRationales: [
      "Increasing tidal volume above 6 mL/kg IBW violates lung-protective ventilation strategy and increases risk of ventilator-induced lung injury (VILI) through volutrauma. The ARDSNet trial demonstrated mortality reduction with low tidal volumes. Permissive hypercapnia is tolerated as long as pH remains >7.15-7.20.",
      "",
      "Inhaled nitric oxide may transiently improve oxygenation through selective pulmonary vasodilation but has NOT shown mortality benefit in ARDS. It is not a first-line intervention. PEEP of 20 cmH2O may be appropriate but alone is unlikely to resolve this degree of refractory hypoxemia.",
      "ECMO evaluation is considered for refractory ARDS after failure of conventional interventions including prone positioning, neuromuscular blockade, and PEEP optimization. It should not be the first step before trying prone positioning."
    ],
    clinicalPearl: "ARDS severity classification by P/F ratio: Mild 200-300, Moderate 100-200, Severe <100. Prone positioning reduces mortality in severe ARDS by improving V/Q matching, reducing compression atelectasis, and improving lymphatic drainage. Contraindications include: unstable spine fractures, open abdomen, facial/anterior burns."
  },
  {
    id: "icu-vent-q3",
    type: "term",
    question: "What is auto-PEEP (intrinsic PEEP) and how is it detected on the ventilator?",
    answer: "Auto-PEEP is the unintentional positive pressure remaining in the alveoli at end-expiration due to incomplete exhalation (air trapping). It is detected by performing an expiratory hold maneuver on the ventilator - the difference between total PEEP and set (extrinsic) PEEP equals auto-PEEP. On the flow-time waveform, expiratory flow does not return to zero baseline before the next breath. Common causes: high respiratory rates, bronchospasm, COPD, long inspiratory times. Consequences: hemodynamic compromise (decreased venous return), breath stacking, increased work of breathing, inaccurate hemodynamic readings.",
    category: "Ventilator Management",
    difficulty: 3,
    clinicalPearl: "Auto-PEEP can cause hypotension by reducing venous return. If a ventilated patient becomes suddenly hypotensive, disconnect from the ventilator briefly to allow full exhalation. If BP improves, auto-PEEP was the culprit. Reducing auto-PEEP: decrease RR, increase expiratory time, treat bronchospasm, or apply external PEEP matching intrinsic PEEP."
  },
  {
    id: "icu-vent-q4",
    type: "question",
    question: "A nurse is caring for an intubated patient on SIMV mode who is consistently triggering additional breaths above the set rate. The patient appears comfortable with no signs of distress. SpO2 is 96%. What does this indicate?",
    options: [
      "The patient is over-sedated and needs a sedation vacation",
      "The ventilator sensitivity is set too low, causing auto-triggering",
      "The patient has adequate spontaneous respiratory drive and may be a weaning candidate",
      "The ventilator mode should be changed to AC/VC immediately"
    ],
    correctIndex: 2,
    answer: "In SIMV mode, breaths above the set rate are patient-initiated spontaneous breaths, indicating the patient has adequate respiratory drive. If the patient is comfortable, oxygenating well, and not distressed, this is a positive sign suggesting readiness for spontaneous breathing trial (SBT) evaluation. The nurse should assess weaning readiness using established criteria: adequate oxygenation on FiO2 <=40%, hemodynamic stability, minimal vasopressor requirements, and adequate mental status.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "Weaning readiness criteria include: resolving underlying cause, FiO2 <=40%, PEEP <=8 cmH2O, adequate cough/gag, hemodynamic stability without high-dose vasopressors, adequate mental status (following commands), and minimal secretions. The ABCDEF ICU bundle recommends daily SAT (spontaneous awakening trial) paired with SBT (spontaneous breathing trial) to reduce ventilator days."
  },
  {
    id: "icu-vent-q5",
    type: "question",
    question: "A mechanically ventilated patient develops subcutaneous emphysema in the neck and upper chest. Breath sounds are diminished on the right side. SpO2 drops from 97% to 82%. What is the priority nursing action?",
    options: [
      "Increase FiO2 to 100% and notify the physician",
      "Prepare for emergency needle decompression or chest tube insertion",
      "Suction the endotracheal tube to clear secretions",
      "Obtain a stat chest X-ray before intervening"
    ],
    correctIndex: 1,
    answer: "Subcutaneous emphysema with unilateral diminished breath sounds and acute desaturation in a ventilated patient strongly suggests tension pneumothorax - a life-threatening emergency requiring immediate intervention. Positive pressure ventilation can convert a simple pneumothorax to tension pneumothorax rapidly. The nurse should call for emergency assistance and prepare for needle decompression (2nd intercostal space, midclavicular line) followed by chest tube insertion. This is a clinical diagnosis - do not delay treatment for imaging.",
    category: "Ventilator Management",
    difficulty: 3,
    clinicalPearl: "Signs of tension pneumothorax in a ventilated patient: sudden high-pressure alarm, acute hypoxemia, unilateral absent breath sounds, tracheal deviation AWAY from affected side, JVD, hypotension, subcutaneous emphysema. Needle decompression: 14-16 gauge needle at 2nd intercostal space, midclavicular line on the affected side. This is a CLINICAL diagnosis - never delay treatment for X-ray confirmation."
  },
  {
    id: "icu-vent-q6",
    type: "term",
    question: "What is the difference between Assist-Control Volume Control (AC/VC) and Pressure Support Ventilation (PSV)?",
    answer: "AC/VC delivers a set tidal volume with every breath (both mandatory and patient-triggered). The ventilator guarantees the volume regardless of airway pressure changes. PSV provides pressure augmentation only during patient-initiated breaths - the patient controls the rate, inspiratory time, and tidal volume while the ventilator provides a set pressure boost to reduce work of breathing. AC/VC is used for patients needing full ventilatory support. PSV is a spontaneous mode used during weaning, as the patient must have adequate respiratory drive to trigger all breaths.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "Ventilator modes spectrum from most to least support: AC/VC or AC/PC (full support) -> SIMV (partial support with mandatory + spontaneous breaths) -> PSV (spontaneous only with pressure support) -> T-piece trial or CPAP (minimal support for weaning assessment). Understanding this progression is essential for managing ventilator weaning protocols."
  },
  {
    id: "icu-vent-q7",
    type: "question",
    question: "A patient on mechanical ventilation has the following ventilator alarms: low exhaled tidal volume alarm and low-pressure alarm. What should the nurse assess FIRST?",
    options: [
      "Check for a cuff leak by assessing cuff pressure",
      "Increase the tidal volume setting on the ventilator",
      "Check for circuit disconnection or leak in the ventilator tubing",
      "Assess the patient for spontaneous breathing effort"
    ],
    correctIndex: 2,
    answer: "Low tidal volume PLUS low pressure alarms together indicate a system leak or disconnection. The most common cause is a disconnected ventilator circuit at any connection point. The nurse should first check all circuit connections from the endotracheal tube to the ventilator. If the circuit is intact, assess for a cuff leak (check cuff pressure - should be 20-30 cmH2O). While troubleshooting, manually ventilate the patient with a bag-valve-mask to maintain oxygenation.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "Ventilator alarm troubleshooting: HIGH pressure + LOW volume = obstruction (mucus plug, kinked tube, biting). LOW pressure + LOW volume = leak or disconnect. HIGH pressure + NORMAL volume = decreased compliance or increased resistance. Always assess the PATIENT first, then the CIRCUIT, then the VENTILATOR."
  },
  {
    id: "icu-vent-q8",
    type: "question",
    question: "A patient with ARDS has been placed prone. The nurse is monitoring the patient during the first hour. Which finding requires immediate action?",
    options: [
      "Facial edema developing bilaterally",
      "SpO2 improving from 88% to 94%",
      "Endotracheal tube cuff pressure reading 15 cmH2O",
      "Patient requiring repositioning of ECG leads"
    ],
    correctIndex: 2,
    answer: "An ETT cuff pressure of 15 cmH2O is below the safe range (20-30 cmH2O) and risks aspiration of subglottic secretions and air leak around the cuff, potentially leading to ventilator-associated pneumonia (VAP). The cuff should be immediately reinflated to 20-30 cmH2O. In prone position, ETT displacement is a critical risk - the tube position and cuff pressure must be checked frequently. Facial edema is an expected finding during prone positioning.",
    category: "Ventilator Management",
    difficulty: 3,
    clinicalPearl: "Prone positioning nursing considerations: verify secure ETT fixation before turning, check cuff pressure Q4H (maintain 20-30 cmH2O), position face with offloading pads to prevent pressure injuries, ensure continuous monitoring access, maintain IV/arterial line access, assess for facial/periorbital edema (expected), suction before turning, and maintain HOB at 15-20 degrees even in prone."
  },
  {
    id: "icu-vent-q9",
    type: "term",
    question: "What is Airway Pressure Release Ventilation (APRV) and when is it used?",
    answer: "APRV is a mode of mechanical ventilation that applies continuous high airway pressure (P-high, typically 20-35 cmH2O) for a prolonged time (T-high, usually 4-6 seconds) with brief releases to a lower pressure (P-low, usually 0 cmH2O) for a short time (T-low, usually 0.5-0.8 seconds) to allow CO2 elimination. The patient can breathe spontaneously at both pressure levels. APRV recruits collapsed alveoli through sustained high pressure, improves oxygenation, allows spontaneous breathing (reducing sedation needs), and may be used as a rescue mode in refractory ARDS when conventional ventilation fails.",
    category: "Ventilator Management",
    difficulty: 3,
    clinicalPearl: "Key APRV nursing considerations: T-low is set so that expiratory flow terminates at 50-75% of peak expiratory flow (prevents derecruitment). Patients can breathe spontaneously - less sedation needed. Monitor for auto-PEEP if T-low is too short. APRV may reduce ventilator-induced lung injury by maintaining open lung while allowing CO2 clearance."
  },
  {
    id: "icu-vent-q10",
    type: "question",
    question: "A ventilated patient has an ABG showing pH 7.48, PaCO2 28 mmHg, PaO2 98 mmHg, HCO3 22 mEq/L on settings: TV 500 mL, RR 18, FiO2 40%, PEEP 5. What ventilator adjustment is most appropriate?",
    options: [
      "Increase the tidal volume to 600 mL",
      "Decrease the respiratory rate to 12-14 breaths/min",
      "Decrease the FiO2 to 30%",
      "Increase the PEEP to 10 cmH2O"
    ],
    correctIndex: 1,
    answer: "The ABG shows uncompensated respiratory alkalosis (high pH, low PaCO2, normal HCO3). The patient is being over-ventilated, blowing off too much CO2. Decreasing the set respiratory rate will reduce minute ventilation and allow PaCO2 to rise to normal range (35-45 mmHg). Reducing the rate is preferred over reducing tidal volume because maintaining adequate tidal volume prevents atelectasis. Oxygenation is adequate so FiO2 and PEEP changes are not the priority.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "Minute ventilation = TV x RR. To increase PaCO2 (correct alkalosis): decrease RR or decrease TV. To decrease PaCO2 (correct acidosis): increase RR or increase TV. Remember: PaCO2 and pH move in OPPOSITE directions. If changing RR doesn't correct the problem, consider if the patient is triggering additional breaths above the set rate."
  },
  {
    id: "icu-vent-q11",
    type: "question",
    question: "Which ventilator-associated event requires the nurse to implement the ventilator-associated pneumonia (VAP) prevention bundle?",
    options: [
      "A single episode of suctioning thick yellow secretions",
      "New pulmonary infiltrate on chest X-ray with fever >38.3C and purulent secretions after 48 hours of intubation",
      "A positive sputum culture for normal oral flora",
      "Transient oxygen desaturation during position changes"
    ],
    correctIndex: 1,
    answer: "VAP is defined as pneumonia developing >48 hours after endotracheal intubation. The clinical criteria include new/progressive pulmonary infiltrate PLUS at least two of: fever >38.3C (101F), leukocytosis or leukopenia, and purulent secretions. VAP prevention bundle includes: HOB elevation 30-45 degrees, daily sedation vacation and assessment of extubation readiness, peptic ulcer prophylaxis, DVT prophylaxis, oral care with chlorhexidine Q6-8H, and subglottic secretion drainage.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "VAP prevention bundle (remember 'FASTHUG'): Feeding (early enteral), Analgesia assessment, Sedation vacation daily, Thromboprophylaxis, Head of bed elevation 30-45 degrees, Ulcer prophylaxis, Glucose control. Additionally: oral care with chlorhexidine, minimize circuit changes, use closed suction systems, and assess daily readiness for extubation."
  },
  {
    id: "icu-vent-q12",
    type: "question",
    question: "During a spontaneous breathing trial (SBT) on T-piece, a patient develops RR 36, HR increases from 82 to 118, SpO2 drops from 96% to 88%, and accessory muscle use is observed. What is the nurse's priority action?",
    options: [
      "Continue the trial for the full 30 minutes as ordered",
      "Immediately reconnect the patient to the ventilator at previous settings",
      "Administer supplemental oxygen via nasal cannula and continue the trial",
      "Administer an anxiolytic and reassess in 15 minutes"
    ],
    correctIndex: 1,
    answer: "The patient is showing clear signs of SBT failure: tachypnea (RR >35), tachycardia (HR increase >20%), desaturation (SpO2 <90%), and accessory muscle use. The nurse must immediately terminate the trial and reconnect the patient to the ventilator at the previous settings to prevent respiratory failure. SBT failure criteria should be clearly understood: RR >35 or <8, HR change >20%, SpO2 <88%, diaphoresis, anxiety, altered mental status, or paradoxical breathing.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "SBT failure criteria (STOP the trial immediately): RR >35 or <8/min, SpO2 <88%, HR change >20% from baseline, new arrhythmias, SBP >180 or <90 mmHg, accessory muscle use, diaphoresis, anxiety/agitation, or paradoxical abdominal breathing. After failed SBT: resume previous ventilator support, allow 24 hours of rest, identify and address the cause before next attempt."
  },
  {
    id: "icu-vent-q13",
    type: "term",
    question: "What are the four mechanisms of ventilator-induced lung injury (VILI)?",
    answer: "The four mechanisms are: 1) Volutrauma - overdistension of alveoli from excessive tidal volumes (prevented by using 6-8 mL/kg IBW). 2) Barotrauma - excessive airway pressure causing alveolar rupture, pneumothorax, or pneumomediastinum (prevented by keeping plateau pressure <30 cmH2O). 3) Atelectrauma - repeated opening and closing of collapsed alveoli creating shear stress (prevented by adequate PEEP to keep alveoli open). 4) Biotrauma - release of inflammatory cytokines from mechanically stressed lung tissue into the systemic circulation, potentially causing multi-organ dysfunction (prevented by lung-protective ventilation strategies).",
    category: "Ventilator Management",
    difficulty: 3,
    clinicalPearl: "The ARDSNet protocol prevents VILI: TV 6 mL/kg IBW (use predicted body weight based on height, NOT actual weight), plateau pressure <30 cmH2O, adequate PEEP per FiO2/PEEP table, permissive hypercapnia acceptable (pH >7.15). Calculate IBW: Males: 50 + 2.3(height in inches - 60). Females: 45.5 + 2.3(height in inches - 60)."
  },
  {
    id: "icu-vent-q14",
    type: "question",
    question: "A patient on mechanical ventilation has an ETT cuff pressure of 42 cmH2O. What is the primary risk associated with this finding?",
    options: [
      "Air leak around the cuff causing hypoventilation",
      "Tracheal mucosal ischemia and potential tracheal stenosis",
      "Increased risk of self-extubation",
      "Ventilator auto-triggering"
    ],
    correctIndex: 1,
    answer: "ETT cuff pressure above 30 cmH2O exceeds tracheal mucosal capillary perfusion pressure (approximately 25-30 mmHg), causing mucosal ischemia. Prolonged high cuff pressures can lead to tracheal necrosis, tracheoesophageal fistula, tracheal stenosis, or tracheoinnominate artery fistula. The nurse should immediately reduce cuff pressure to the recommended range of 20-30 cmH2O using a cuff manometer and document the intervention.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "ETT cuff pressure targets: 20-30 cmH2O (20-25 cmH2O is ideal). Below 20: aspiration risk. Above 30: mucosal ischemia risk. Check Q8H with a cuff manometer. Use minimal occlusive volume (MOV) or minimal leak technique. Patients on N2O anesthesia require more frequent checks as N2O diffuses into the cuff, increasing pressure."
  },
  {
    id: "icu-vent-q15",
    type: "question",
    question: "A nurse is performing endotracheal suctioning on a ventilated ICU patient. Which practice is evidence-based for minimizing complications?",
    options: [
      "Routinely instill 5 mL normal saline before suctioning to loosen secretions",
      "Apply continuous suction while advancing the catheter into the airway",
      "Limit suction passes to 10 seconds each, pre-oxygenate with 100% FiO2, and use a closed suction system",
      "Suction on a fixed schedule every 2 hours regardless of assessment findings"
    ],
    correctIndex: 2,
    answer: "Evidence-based suctioning includes: pre-oxygenation with 100% FiO2 for 30-60 seconds, using closed in-line suction systems (reduces hypoxia and contamination), limiting suction time to 10-15 seconds per pass, applying suction only during catheter withdrawal (never during advancement), and suctioning only when clinically indicated (not on a routine schedule). Normal saline instillation is no longer recommended as it can displace bacteria deeper and worsen oxygenation.",
    category: "Ventilator Management",
    difficulty: 2,
    clinicalPearl: "Suctioning complications: hypoxemia, cardiac arrhythmias (vagal response causing bradycardia), bronchospasm, mucosal trauma, increased ICP, and atelectasis. Indications for suctioning: audible secretions, visible secretions in ETT, sawtooth pattern on ventilator waveform, increased peak pressures, and coughing. Avoid routine scheduled suctioning - suction based on clinical assessment."
  },
  // ============================================================
  // SHOCK STATES (42 cards)
  // ============================================================
  {
    id: "icu-shock-q1",
    type: "question",
    question: "An ICU patient has the following hemodynamic profile: CVP 2 mmHg, PCWP 4 mmHg, CI 2.0 L/min/m2, SVR 2,400 dynes-sec/cm-5, MAP 58 mmHg. HR 128 bpm. Lactate 6.2 mmol/L. Which type of shock is indicated?",
    options: [
      "Cardiogenic shock",
      "Hypovolemic shock",
      "Septic shock (warm phase)",
      "Obstructive shock from cardiac tamponade"
    ],
    correctIndex: 1,
    answer: "The hemodynamic profile shows low preload (CVP 2, PCWP 4), low cardiac index, HIGH SVR (compensatory vasoconstriction), and elevated lactate (tissue hypoperfusion). This is classic hypovolemic shock. The body is attempting to compensate for volume loss by increasing SVR and heart rate. Cardiogenic shock would show HIGH PCWP (>18). Septic shock (warm) shows LOW SVR. Tamponade shows equalization of pressures (CVP = PCWP = PADP).",
    category: "Shock States",
    difficulty: 3,
    optionRationales: [
      "Cardiogenic shock presents with elevated filling pressures (PCWP >18 mmHg), low CI, and high SVR. The CVP and PCWP would be elevated, not low, because the failing heart cannot pump effectively, causing backup of blood in the venous system.",
      "",
      "Warm septic shock shows a HYPERDYNAMIC profile: low SVR (vasodilation), high cardiac output/index initially, warm flushed skin, and bounding pulses. The SVR of 2,400 is markedly elevated, which is the opposite of distributive shock.",
      "Obstructive shock from cardiac tamponade shows equalization of diastolic pressures (CVP approximately equals PADP approximately equals PCWP), along with pulsus paradoxus and Beck's triad. The pressures in this case are uniformly low, not equalized."
    ],
    clinicalPearl: "Shock hemodynamic profiles: HYPOVOLEMIC = low CVP/PCWP, low CO, high SVR. CARDIOGENIC = high CVP/PCWP, low CO, high SVR. DISTRIBUTIVE (septic warm) = low CVP/PCWP, high CO, LOW SVR. OBSTRUCTIVE (tamponade/PE) = high CVP, low CO, high SVR with pressure equalization."
  },
  {
    id: "icu-shock-q2",
    type: "question",
    question: "A patient in septic shock is receiving norepinephrine at 0.5 mcg/kg/min. MAP remains 58 mmHg. Vasopressin 0.04 units/min was added but MAP is still only 62 mmHg. What vasopressor should be considered next?",
    options: [
      "Dopamine at renal dose (2-5 mcg/kg/min)",
      "Epinephrine as a third-line vasopressor",
      "Phenylephrine boluses",
      "Dobutamine to increase cardiac contractility"
    ],
    correctIndex: 1,
    answer: "Per Surviving Sepsis Campaign guidelines, epinephrine is the recommended third-line vasopressor when norepinephrine plus vasopressin fail to achieve target MAP >65 mmHg. Epinephrine provides both alpha-1 (vasoconstriction) and beta-1 (increased contractility and heart rate) effects. Dopamine is no longer recommended due to increased arrhythmia risk. Dobutamine is an inotrope, not a vasopressor, and is added only if there is evidence of myocardial dysfunction with adequate MAP.",
    category: "Shock States",
    difficulty: 3,
    optionRationales: [
      "Low-dose dopamine for 'renal protection' has been definitively disproven by multiple clinical trials. The Surviving Sepsis Campaign recommends AGAINST using dopamine at any dose for renal protection. Dopamine at vasopressor doses (>10 mcg/kg/min) is associated with increased arrhythmia risk compared to norepinephrine.",
      "",
      "Phenylephrine is a pure alpha-1 agonist that only provides vasoconstriction without beta effects. It can decrease cardiac output by increasing afterload without supporting contractility. It is generally reserved for specific situations like SVT-induced hypotension or as a bridge during norepinephrine shortages.",
      "Dobutamine is an inotrope (beta-1 agonist) that increases cardiac contractility and output. It is NOT a vasopressor and can actually decrease blood pressure through beta-2 vasodilation. It should only be added if echocardiography shows sepsis-induced cardiomyopathy with low cardiac output despite adequate volume and MAP."
    ],
    clinicalPearl: "Septic shock vasopressor algorithm: 1st line: Norepinephrine (target MAP >65). 2nd line: Add vasopressin 0.03-0.04 U/min (to spare norepinephrine dose). 3rd line: Add epinephrine. Consider dobutamine ONLY if echo shows sepsis-induced cardiomyopathy. Consider IV hydrocortisone 200 mg/day if vasopressor requirements are increasing."
  },
  {
    id: "icu-shock-q3",
    type: "term",
    question: "What are the four main types of shock and their distinguishing hemodynamic profiles?",
    answer: "1) HYPOVOLEMIC: Low CVP, low PCWP, low CO, high SVR (volume loss with compensatory vasoconstriction). 2) CARDIOGENIC: High CVP, high PCWP, low CO, high SVR (pump failure with fluid backing up). 3) DISTRIBUTIVE (septic/anaphylactic/neurogenic): Low-normal CVP, low PCWP, high CO (initially), LOW SVR (massive vasodilation). 4) OBSTRUCTIVE (PE/tamponade/tension pneumothorax): High CVP, variable PCWP, low CO, high SVR (mechanical obstruction to blood flow). In septic shock, the profile may transition from warm (high CO, low SVR) to cold (low CO, high SVR) as myocardial depression develops.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "Quick differentiation: Low SVR = distributive shock (vasodilation). High PCWP = cardiogenic shock (pump failure). Low CVP/PCWP = hypovolemic (volume depleted). High CVP with low CO = obstructive (something blocking flow). Lactate >2 mmol/L indicates inadequate tissue perfusion regardless of shock type."
  },
  {
    id: "icu-shock-q4",
    type: "question",
    question: "A trauma patient arrives to the ICU after a motor vehicle collision. Vitals: BP 78/42, HR 138, RR 32, SpO2 89%. The patient has received 2L crystalloid with minimal response. What is the next priority intervention?",
    options: [
      "Administer another 2L crystalloid bolus",
      "Start norepinephrine infusion for blood pressure support",
      "Initiate massive transfusion protocol (MTP) with balanced blood products",
      "Obtain a CT scan of the abdomen to identify the bleeding source"
    ],
    correctIndex: 2,
    answer: "In hemorrhagic shock unresponsive to initial crystalloid resuscitation (2L), the next intervention is massive transfusion protocol with balanced blood products (1:1:1 ratio of packed RBCs, FFP, platelets). Continued crystalloid resuscitation in hemorrhagic shock dilutes coagulation factors, worsens coagulopathy (lethal triad: hypothermia, acidosis, coagulopathy), and does not restore oxygen-carrying capacity. Vasopressors are not first-line for hemorrhagic shock - volume replacement with blood products is the priority.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "The lethal triad in trauma: hypothermia + acidosis + coagulopathy. Each worsens the others in a vicious cycle. Damage control resuscitation: limit crystalloid (causes dilutional coagulopathy), use balanced blood products 1:1:1 (RBC:FFP:Platelets), keep patient warm, correct acidosis, and consider TXA (tranexamic acid) within 3 hours of injury."
  },
  {
    id: "icu-shock-q5",
    type: "question",
    question: "A patient develops anaphylactic shock after IV antibiotic administration. BP 60/30, HR 140, diffuse urticaria, stridor, and SpO2 78%. What is the FIRST medication the nurse should administer?",
    options: [
      "IV diphenhydramine (Benadryl) 50 mg",
      "IM epinephrine 0.3-0.5 mg (1:1,000) into the anterolateral thigh",
      "IV methylprednisolone 125 mg",
      "Nebulized albuterol 2.5 mg"
    ],
    correctIndex: 1,
    answer: "Epinephrine is the FIRST-LINE and MOST IMPORTANT medication for anaphylaxis. IM injection into the anterolateral thigh provides rapid absorption. Epinephrine reverses all pathophysiological mechanisms of anaphylaxis: bronchospasm (beta-2), vasodilation and hypotension (alpha-1), and mediator release from mast cells. Antihistamines and steroids are adjuncts, NOT first-line. Delaying epinephrine increases mortality. If no IV access, IM route is preferred.",
    category: "Shock States",
    difficulty: 2,
    clinicalPearl: "Anaphylaxis treatment priority order: 1) IM Epinephrine (may repeat Q5-15 min), 2) Airway management (intubation if stridor), 3) IV fluids (1-2L crystalloid bolus), 4) Supplemental oxygen, 5) Albuterol nebulizer for bronchospasm, 6) Diphenhydramine IV 50 mg + ranitidine 50 mg (H1+H2 blockers), 7) Methylprednisolone 125 mg IV (prevents biphasic reaction). NEVER use subcutaneous route - IM anterolateral thigh only."
  },
  {
    id: "icu-shock-q6",
    type: "question",
    question: "A patient with cardiogenic shock has CI 1.6 L/min/m2, PCWP 32 mmHg, SVR 2,800 dynes/sec/cm-5. MAP is 60 mmHg. Which combination of medications is most appropriate?",
    options: [
      "Norepinephrine alone at high doses",
      "Dobutamine plus norepinephrine",
      "Dopamine at vasopressor doses",
      "Milrinone plus phenylephrine"
    ],
    correctIndex: 1,
    answer: "In cardiogenic shock with low CI, high PCWP, high SVR, and borderline MAP, the combination of dobutamine (inotrope to increase contractility and cardiac output) plus norepinephrine (vasopressor to maintain MAP >65) is optimal. Dobutamine addresses the primary problem (pump failure) while norepinephrine maintains perfusion pressure. Norepinephrine alone would worsen afterload without improving contractility. Dopamine is associated with increased arrhythmia risk.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "Cardiogenic shock medications by hemodynamic target: Low CI + adequate MAP: dobutamine alone. Low CI + low MAP: dobutamine + norepinephrine. Refractory: consider milrinone (especially if on beta-blockers) or mechanical support (IABP, Impella, ECMO). Always assess fluid status first - some patients need VOLUME even in cardiogenic shock if CVP/PCWP are not elevated."
  },
  {
    id: "icu-shock-q7",
    type: "term",
    question: "What is the significance of lactate levels in shock assessment?",
    answer: "Lactate is a biomarker of tissue hypoperfusion and anaerobic metabolism. Normal: <2 mmol/L. Elevated lactate (>2 mmol/L) indicates inadequate oxygen delivery to tissues. Lactate >4 mmol/L is associated with high mortality and mandates aggressive resuscitation. Serial lactate clearance (decrease by >10-20% per 2 hours) is a resuscitation target - improving lactate trends indicate successful therapy. Persistently elevated or rising lactate despite treatment suggests ongoing tissue ischemia and is a predictor of poor outcomes. In sepsis, initial lactate should be measured within 1 hour and repeated if initially elevated.",
    category: "Shock States",
    difficulty: 2,
    clinicalPearl: "Lactate clearance is a resuscitation goal: >10% decrease per 2 hours indicates response to therapy. Causes of elevated lactate: Type A (hypoperfusion) - shock, cardiac arrest, severe anemia. Type B (not from hypoperfusion) - liver failure (decreased clearance), metformin, seizures, severe exercise, thiamine deficiency, malignancy. Always consider non-perfusion causes before escalating therapy."
  },
  {
    id: "icu-shock-q8",
    type: "question",
    question: "A patient with a massive pulmonary embolism has BP 70/40, HR 130, JVD, and right ventricular dilation on bedside echo. What is the most critical intervention?",
    options: [
      "Administer large-volume IV fluid bolus of 2L crystalloid",
      "Start systemic thrombolysis with alteplase (tPA)",
      "Initiate heparin infusion and monitor aPTT",
      "Prepare for emergent surgical thrombectomy only"
    ],
    correctIndex: 1,
    answer: "Massive PE (PE with hemodynamic instability: SBP <90 or vasopressor requirement) is an indication for systemic thrombolysis. Alteplase (tPA) 100 mg IV over 2 hours is the standard regimen. Thrombolysis rapidly dissolves the clot, reducing right ventricular afterload and restoring hemodynamic stability. Heparin alone does not dissolve existing clot. Aggressive fluid bolusing can worsen RV dilation in massive PE by overdistending the already failing right ventricle.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "PE classification: Submassive = RV dysfunction on echo/CT WITHOUT hypotension. Massive = RV dysfunction WITH hemodynamic instability (SBP <90, shock). Treatment: Submassive: heparin +/- catheter-directed therapy. Massive: systemic tPA (alteplase 100 mg over 2 hours) +/- surgical embolectomy. Caution with fluids: small boluses (250-500 mL) only, as excessive fluid worsens RV failure through interventricular interdependence."
  },
  {
    id: "icu-shock-q9",
    type: "question",
    question: "A patient in neurogenic shock after a C5 spinal cord injury has BP 72/48, HR 52. The patient is warm and flushed below the level of injury. What is the priority intervention?",
    options: [
      "Administer atropine for the bradycardia first, then address hypotension",
      "Initiate IV fluid resuscitation followed by vasopressor (norepinephrine or phenylephrine) if hypotension persists",
      "Apply MAST/pneumatic anti-shock garment",
      "Administer high-dose methylprednisolone for spinal cord protection"
    ],
    correctIndex: 1,
    answer: "Neurogenic shock results from loss of sympathetic tone below the level of spinal cord injury, causing vasodilation (hypotension) and unopposed vagal tone (bradycardia). Initial treatment is IV fluid resuscitation to restore intravascular volume. If hypotension persists despite fluids, vasopressors (norepinephrine preferred for both alpha and beta effects, or phenylephrine for pure vasoconstriction) are initiated to restore vascular tone. Target MAP >85-90 mmHg for the first 7 days to optimize spinal cord perfusion.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "Neurogenic vs. spinal shock: Neurogenic shock = hemodynamic (loss of sympathetic tone causing hypotension + bradycardia). Spinal shock = neurological (temporary loss of all spinal cord function below injury level, with flaccid paralysis and areflexia). They can coexist. Neurogenic shock is more common with injuries above T6. Target MAP >85-90 mmHg for 5-7 days for spinal cord perfusion optimization."
  },
  {
    id: "icu-shock-q10",
    type: "question",
    question: "A nurse is titrating a norepinephrine infusion. The patient's MAP increases from 58 to 72 mmHg but urine output remains at 10 mL/hr. What should the nurse assess?",
    options: [
      "The infusion rate - it needs to be increased further since urine output is still low",
      "Fluid balance and consider a fluid challenge to assess volume responsiveness",
      "Switch to dopamine at renal-dose to improve renal perfusion",
      "Nothing - urine output will improve once MAP has been stable for 24 hours"
    ],
    correctIndex: 1,
    answer: "Although MAP has improved to target (>65 mmHg), low urine output (<0.5 mL/kg/hr) suggests inadequate renal perfusion that may be due to insufficient preload rather than inadequate MAP. The nurse should assess volume status: check CVP trends, perform passive leg raise test, or administer a small fluid bolus (250-500 mL) to assess if the patient is volume-responsive. Simply increasing vasopressors in a volume-depleted patient will worsen organ perfusion. Low-dose dopamine for renal protection has been disproven.",
    category: "Shock States",
    difficulty: 3,
    clinicalPearl: "Assess volume responsiveness before increasing vasopressors: Passive leg raise test (raise legs to 45 degrees for 1 minute - if CI increases by >10%, patient is volume responsive), stroke volume variation on arterial line (SVV >13% suggests responsiveness), IVC ultrasound (collapsibility index >50% in spontaneously breathing patients). Adequate resuscitation targets: MAP >65, UO >0.5 mL/kg/hr, lactate normalizing, capillary refill <3 seconds."
  },
  // ============================================================
  // HEMODYNAMICS (42 cards)
  // ============================================================
  {
    id: "icu-hemo-q1",
    type: "question",
    question: "A nurse is zeroing and leveling a pulmonary artery catheter transducer. At what anatomical landmark should the transducer be leveled?",
    options: [
      "The sternal notch at the level of the clavicles",
      "The phlebostatic axis (4th intercostal space, mid-axillary line)",
      "The xiphoid process at the midline",
      "The level of the right atrium as estimated by the 2nd intercostal space"
    ],
    correctIndex: 1,
    answer: "The phlebostatic axis - the intersection of the 4th intercostal space and the mid-axillary line - approximates the level of the right atrium and is the standard reference point for zeroing all hemodynamic transducers (arterial line, CVP, PA catheter). Incorrect leveling causes inaccurate readings: too high = falsely low readings, too low = falsely high readings. The transducer must be re-leveled whenever the patient's position changes.",
    category: "Hemodynamics",
    difficulty: 2,
    clinicalPearl: "Leveling and zeroing errors: If transducer is ABOVE the phlebostatic axis = readings are FALSELY LOW. If transducer is BELOW the phlebostatic axis = readings are FALSELY HIGH. For every 1 inch (2.5 cm) of error, pressure readings change by approximately 2 mmHg. Always re-level when changing HOB angle. Zero the transducer to atmospheric pressure by opening the stopcock to air."
  },
  {
    id: "icu-hemo-q2",
    type: "question",
    question: "A patient has a PA catheter reading: RA 14 mmHg, PA 52/28 mmHg (mean 36), PCWP 24 mmHg, CO 3.2 L/min, CI 1.7 L/min/m2. SVR is 2,100 dynes-sec/cm-5. What condition do these values suggest?",
    options: [
      "Right ventricular failure from pulmonary hypertension",
      "Left ventricular failure (cardiogenic shock)",
      "Septic shock with myocardial depression",
      "Hypovolemic shock with compensatory vasoconstriction"
    ],
    correctIndex: 1,
    answer: "The hemodynamic profile shows: elevated RA (normal 2-6), elevated PA pressures, elevated PCWP (normal 6-12), low CO and CI, and high SVR. This is classic left ventricular failure/cardiogenic shock: the LV is failing as a pump, causing backup into the pulmonary vasculature (high PCWP and PA pressures), reduced forward flow (low CO/CI), and compensatory vasoconstriction (high SVR). Treatment includes inotropes (dobutamine), afterload reduction if BP permits, and potentially mechanical support.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "Normal hemodynamic values: CVP/RA 2-6 mmHg, PA systolic 20-30 mmHg, PA diastolic 8-15 mmHg, PA mean 10-20 mmHg, PCWP 6-12 mmHg, CO 4-8 L/min, CI 2.5-4.0 L/min/m2, SVR 800-1200 dynes-sec/cm-5. PCWP reflects left ventricular end-diastolic pressure (LVEDP) and is the best indicator of left heart function and pulmonary edema risk."
  },
  {
    id: "icu-hemo-q3",
    type: "term",
    question: "What does the SvO2 (mixed venous oxygen saturation) indicate and what are critical values?",
    answer: "SvO2 measures the oxygen saturation of blood returning to the right heart through the pulmonary artery catheter, reflecting the balance between oxygen delivery (DO2) and oxygen consumption (VO2). Normal SvO2: 60-80%. Low SvO2 (<60%) indicates increased oxygen extraction by tissues due to inadequate delivery (low CO, anemia, hypoxemia) or increased consumption (fever, shivering, seizures). High SvO2 (>80%) suggests decreased oxygen utilization (sepsis with mitochondrial dysfunction, cyanide poisoning, left-to-right shunt, hypothermia). SvO2 <30% is incompatible with sustained tissue viability and requires immediate intervention.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "SvO2 trending is more valuable than a single reading. If SvO2 drops from 72% to 55%, investigate: Did CO decrease (heart failure, hypovolemia)? Did hemoglobin drop (bleeding)? Did SpO2 drop (respiratory failure)? Did O2 demand increase (fever, pain, seizure)? ScvO2 (central venous O2 from CVC in SVC) runs about 5% higher than true SvO2 and can be used as a substitute when PA catheter is not in place."
  },
  {
    id: "icu-hemo-q4",
    type: "question",
    question: "A nurse is interpreting arterial line waveform. The dicrotic notch is absent and the waveform appears overdamped (flattened with a slow rise). What is the most likely cause?",
    options: [
      "Air bubble in the transducer tubing system",
      "Arterial vasospasm from hypothermia",
      "Aortic regurgitation causing a wide pulse pressure",
      "Catheter tip against the vessel wall"
    ],
    correctIndex: 0,
    answer: "An overdamped (flattened) arterial waveform with loss of the dicrotic notch is most commonly caused by an air bubble in the transducer tubing, which absorbs pressure energy. Other causes include: clot at catheter tip, kinks in tubing, loose connections, soft/compliant tubing, or catheter tip against the vessel wall. An overdamped system reads FALSELY LOW systolic and FALSELY HIGH diastolic (MAP is usually still accurate). The nurse should aspirate and flush the line, check for air bubbles, and perform a square wave test.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "Square wave test (fast flush test) for dynamic response: Optimally damped = 1-2 oscillations after flush, then returns to baseline. Overdamped = no oscillations, rounded waveform (falsely low systolic, falsely high diastolic). Underdamped = >3 oscillations, 'ringing' waveform (falsely high systolic, falsely low diastolic). MAP remains accurate in both over- and underdamped states."
  },
  {
    id: "icu-hemo-q5",
    type: "question",
    question: "A patient's CVP reading is 18 mmHg (elevated). Which of the following clinical scenarios is LEAST likely to cause this finding?",
    options: [
      "Right ventricular failure",
      "Cardiac tamponade",
      "Tension pneumothorax",
      "Severe hemorrhagic shock"
    ],
    correctIndex: 3,
    answer: "Severe hemorrhagic shock causes volume depletion, which leads to LOW CVP (typically <2 mmHg), not elevated CVP. CVP reflects right atrial pressure and right ventricular preload. All the other options cause elevated CVP: RV failure (inability to empty, blood backs up), cardiac tamponade (external compression prevents filling), and tension pneumothorax (increased intrathoracic pressure impedes venous return, causing backup).",
    category: "Hemodynamics",
    difficulty: 2,
    clinicalPearl: "Elevated CVP causes: Right heart failure, cardiac tamponade, tension pneumothorax, pulmonary hypertension, massive PE, volume overload, positive pressure ventilation (especially high PEEP), and tricuspid regurgitation. Low CVP causes: hypovolemia/hemorrhage, dehydration, distributive shock (sepsis, anaphylaxis). Remember: CVP is a TREND indicator, not an absolute volume indicator - always correlate with clinical assessment."
  },
  {
    id: "icu-hemo-q6",
    type: "question",
    question: "A patient on a dobutamine infusion at 10 mcg/kg/min develops a heart rate of 142 bpm (was 88 bpm) with new onset irregular rhythm on the monitor. What is the priority nursing action?",
    options: [
      "Increase the dobutamine rate to improve cardiac output further",
      "Decrease or temporarily hold the dobutamine infusion and notify the provider",
      "Administer IV metoprolol to control the heart rate",
      "Continue the current rate and obtain a 12-lead ECG"
    ],
    correctIndex: 1,
    answer: "Significant tachycardia and new arrhythmia during dobutamine infusion indicate dose-related adverse effects (beta-1 stimulation). The priority is to decrease or temporarily hold the infusion to allow the heart rate to decrease, then notify the provider. Excessive tachycardia increases myocardial oxygen demand and can worsen ischemia. Do not independently administer beta-blockers as they may worsen hemodynamics. The provider may reduce the dose, switch to milrinone (less tachycardia), or change the approach entirely.",
    category: "Hemodynamics",
    difficulty: 2,
    clinicalPearl: "Dobutamine side effects to monitor: tachycardia (most common dose-limiting effect), arrhythmias (PVCs, VT), hypotension (beta-2 vasodilation), and chest pain/myocardial ischemia. Tachyphylaxis develops after 72 hours of continuous infusion. If tachycardia limits dobutamine use, consider milrinone (PDE-3 inhibitor) as an alternative - it has less chronotropic effect and works via a non-beta-receptor mechanism."
  },
  {
    id: "icu-hemo-q7",
    type: "term",
    question: "What is stroke volume variation (SVV) and how is it used to guide fluid management?",
    answer: "Stroke volume variation (SVV) measures the percentage change in stroke volume during the respiratory cycle in mechanically ventilated patients. During positive pressure inspiration, venous return temporarily decreases, reducing right heart preload and subsequently left heart stroke volume. In volume-responsive patients (on the steep part of the Frank-Starling curve), this variation is greater. SVV >13% suggests the patient is likely to respond to fluid administration with an increase in cardiac output. SVV <13% suggests the patient is volume-loaded and unlikely to benefit from additional fluids. SVV is only reliable in patients who are mechanically ventilated, in sinus rhythm, and receiving tidal volumes of 8+ mL/kg.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "SVV limitations: only valid in mechanically ventilated patients with controlled ventilation (no spontaneous breathing), sinus rhythm (no arrhythmias), TV >=8 mL/kg, and closed chest. Not valid during open-chest surgery, spontaneous breathing, arrhythmias, or low tidal volume ventilation. Alternative: passive leg raise test works in all patients - raise legs to 45 degrees and measure CI change. >10% increase = volume responsive."
  },
  {
    id: "icu-hemo-q8",
    type: "question",
    question: "A nurse is monitoring a patient's cardiac output using thermodilution via a PA catheter. Which of the following would cause an erroneously LOW cardiac output reading?",
    options: [
      "Injecting the bolus too slowly",
      "Using an injectate that is warmer than specified",
      "Injecting a smaller volume than specified",
      "Performing the injection during the expiratory phase"
    ],
    correctIndex: 0,
    answer: "Injecting the thermodilution bolus too slowly creates a broader, more gradual temperature change curve (wider area under the curve), which the computer interprets as a LOWER cardiac output. The Stewart-Hamilton equation calculates CO inversely proportional to the area under the thermodilution curve. A slow injection mimics a slow transit time (low flow state). Correct technique: inject the full 10 mL bolus smoothly within 4 seconds, at end-expiration, consistently.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "Thermodilution CO technique: Use 10 mL iced or room-temperature normal saline. Inject smoothly in <4 seconds at end-expiration. Perform 3 measurements within 10% of each other and average them. Discard outliers. Sources of error: too slow injection (falsely LOW CO), too warm injectate (falsely HIGH CO), tricuspid regurgitation (falsely LOW CO), intracardiac shunts (inaccurate readings)."
  },
  {
    id: "icu-hemo-q9",
    type: "question",
    question: "A patient has the following values: MAP 72 mmHg, CVP 8 mmHg, CO 5.5 L/min. What is the calculated SVR?",
    options: [
      "930 dynes-sec/cm-5",
      "1,164 dynes-sec/cm-5",
      "800 dynes-sec/cm-5",
      "1,396 dynes-sec/cm-5"
    ],
    correctIndex: 0,
    answer: "SVR = [(MAP - CVP) / CO] x 80. SVR = [(72 - 8) / 5.5] x 80 = [64 / 5.5] x 80 = 11.64 x 80 = 931 dynes-sec/cm-5. This is within normal range (800-1,200). The formula is essential for interpreting hemodynamic profiles and differentiating shock types. High SVR (>1,200) occurs in cardiogenic and hypovolemic shock (compensatory vasoconstriction). Low SVR (<800) occurs in distributive shock (vasodilation in sepsis, anaphylaxis).",
    category: "Hemodynamics",
    difficulty: 2,
    clinicalPearl: "Hemodynamic formulas to know: SVR = [(MAP - CVP) / CO] x 80 (normal 800-1200). PVR = [(MPAP - PCWP) / CO] x 80 (normal 100-250). MAP = DBP + 1/3(SBP - DBP) or (SBP + 2xDBP) / 3. CO = HR x SV. CI = CO / BSA (normal 2.5-4.0). These calculations help differentiate shock types and guide therapy."
  },
  {
    id: "icu-hemo-q10",
    type: "question",
    question: "A nurse notes the following PA catheter waveform changes: the PCWP waveform shows large V-waves. What does this finding suggest?",
    options: [
      "Tricuspid regurgitation",
      "Mitral regurgitation or acute papillary muscle rupture",
      "Normal waveform variation with respiration",
      "Catheter migration into a wedge position"
    ],
    correctIndex: 1,
    answer: "Large V-waves on the PCWP waveform indicate regurgitant flow from the left ventricle back into the left atrium during systole, most commonly from acute mitral regurgitation or papillary muscle rupture (a mechanical complication of MI). Giant V-waves can be seen up to 50-60 mmHg in acute MR. The V-wave occurs during systole when the mitral valve should be closed but instead allows backflow. This finding requires urgent surgical consultation for potential valve repair/replacement.",
    category: "Hemodynamics",
    difficulty: 3,
    clinicalPearl: "PCWP waveform components: A-wave = atrial contraction (absent in AFib). C-wave = mitral valve closure. V-wave = passive atrial filling. X-descent = atrial relaxation. Y-descent = passive ventricular filling. Large A-waves = mitral stenosis, decreased LV compliance. Giant V-waves = mitral regurgitation, VSD. Cannon A-waves = AV dissociation, complete heart block."
  },
  // ============================================================
  // SEPSIS (42 cards)
  // ============================================================
  {
    id: "icu-sepsis-q1",
    type: "question",
    question: "A patient in the ICU has suspected sepsis. Temperature 39.2C, HR 118, RR 24, WBC 18,200/mm3, lactate 3.8 mmol/L. According to the Surviving Sepsis Campaign 2021 guidelines, what interventions must be completed within the first hour?",
    options: [
      "Blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid if hypotensive, lactate measurement, vasopressors for MAP <65 after fluids",
      "CT scan of chest/abdomen, urinalysis, and consultation with infectious disease",
      "Central line placement, arterial line insertion, and PA catheter for hemodynamic monitoring",
      "Blood cultures and narrow-spectrum antibiotic after culture results return"
    ],
    correctIndex: 0,
    answer: "The Surviving Sepsis Campaign 2021 Hour-1 bundle requires: 1) Measure lactate (remeasure if >2 mmol/L), 2) Obtain blood cultures BEFORE antibiotics (but do NOT delay antibiotics for cultures), 3) Administer broad-spectrum antibiotics (each hour of delay increases mortality by 7-8%), 4) Begin 30 mL/kg IV crystalloid for hypotension or lactate >=4 mmol/L, 5) Apply vasopressors for MAP <65 mmHg during or after fluid resuscitation. All five elements should be initiated within 1 hour of sepsis recognition.",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Key timing data: Each HOUR delay in antibiotic administration increases sepsis mortality by 7-8%. Blood cultures should be drawn before antibiotics BUT never delay antibiotics more than 45 minutes to obtain cultures. If line access is difficult, give antibiotics through any available route (even IM) while establishing IV access. Reassess lactate within 2-4 hours if initial lactate is >2 mmol/L."
  },
  {
    id: "icu-sepsis-q2",
    type: "question",
    question: "A septic patient is being resuscitated with IV crystalloid. After 30 mL/kg (2.1L for a 70 kg patient), MAP is 58 mmHg. Lactate has risen from 3.8 to 5.2 mmol/L. What does the rising lactate indicate?",
    options: [
      "Normal response to fluid resuscitation",
      "Persistent tissue hypoperfusion indicating need for vasopressor initiation",
      "The crystalloid fluid is causing dilutional acidosis",
      "Lab error requiring repeat measurement"
    ],
    correctIndex: 1,
    answer: "Rising lactate despite fluid resuscitation indicates persistent tissue hypoperfusion and inadequate oxygen delivery to tissues. This is a sign of treatment failure requiring escalation to vasopressor therapy. Norepinephrine should be started immediately to achieve MAP >65 mmHg, and the source of sepsis must be identified and controlled. Lactate clearance (>10% decrease per 2 hours) is a key resuscitation target - rising lactate is an ominous sign associated with increased mortality.",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Sepsis resuscitation assessment points: 1) After initial 30 mL/kg bolus: reassess MAP, lactate, urine output, capillary refill. 2) If MAP <65: start norepinephrine (do NOT delay for more fluids). 3) Beyond initial resuscitation: assess fluid responsiveness before giving additional fluids (passive leg raise, SVV, IVC ultrasound). 4) Target lactate clearance >10% per 2 hours. 5) Consider steroid stress-dose (hydrocortisone 200 mg/day) if vasopressor-dependent."
  },
  {
    id: "icu-sepsis-q3",
    type: "term",
    question: "What is the qSOFA score and how is it used in sepsis screening?",
    answer: "qSOFA (quick Sequential Organ Failure Assessment) is a bedside screening tool for sepsis using three criteria: 1) Respiratory rate >=22 breaths/min, 2) Altered mentation (GCS <15), 3) Systolic blood pressure <=100 mmHg. Each criterion scores 1 point (0-3 total). A score >=2 identifies patients with suspected infection who are at higher risk for poor outcomes and should prompt further assessment for organ dysfunction using the full SOFA score. qSOFA is NOT a diagnostic criterion for sepsis but serves as a rapid screening trigger at the bedside. Sepsis-3 defines sepsis as suspected infection + SOFA score increase >=2 points.",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Sepsis-3 definitions: SEPSIS = life-threatening organ dysfunction caused by dysregulated host response to infection (SOFA >=2). SEPTIC SHOCK = sepsis + vasopressor requirement to maintain MAP >=65 + lactate >2 mmol/L despite adequate fluid resuscitation. SIRS criteria are no longer used to define sepsis but remain useful for identifying patients who need further evaluation. qSOFA is a screening tool, not a diagnostic tool."
  },
  {
    id: "icu-sepsis-q4",
    type: "question",
    question: "A patient in septic shock requires increasing norepinephrine doses. The current dose is 0.3 mcg/kg/min with MAP 60 mmHg. Vasopressin 0.03 units/min has been added. The nurse should anticipate which additional intervention?",
    options: [
      "Stress-dose corticosteroids (hydrocortisone 200 mg/day)",
      "Broad-spectrum antifungal coverage",
      "Transition to phenylephrine as sole agent",
      "Intra-aortic balloon pump insertion"
    ],
    correctIndex: 0,
    answer: "In vasopressor-dependent septic shock (escalating norepinephrine requirements), the Surviving Sepsis Campaign recommends stress-dose corticosteroids: IV hydrocortisone 200 mg/day (50 mg Q6H or continuous infusion). This addresses relative adrenal insufficiency that occurs in up to 60% of septic shock patients. Corticosteroids improve vasopressor responsiveness and may reduce time to shock reversal. Fludrocortisone may be added but evidence is less clear. There is no need for ACTH stimulation testing before starting.",
    category: "Sepsis",
    difficulty: 3,
    clinicalPearl: "Corticosteroids in septic shock: Start when vasopressor doses are escalating (typically norepinephrine >0.25 mcg/kg/min). Hydrocortisone 200 mg/day IV (50 mg Q6H). Do NOT bolus (can cause hyperglycemia spikes). Monitor blood glucose closely (steroid-induced hyperglycemia). Taper over 3-5 days once vasopressors are discontinued. Do NOT use for sepsis without shock - no benefit and potential harm."
  },
  {
    id: "icu-sepsis-q5",
    type: "question",
    question: "A nurse is managing a patient with sepsis and acute kidney injury. BUN 62 mg/dL, creatinine 4.2 mg/dL, potassium 6.1 mEq/L, urine output 8 mL/hr. Which intervention is the priority?",
    options: [
      "Restrict IV fluids to prevent volume overload",
      "Treat the hyperkalemia emergently with calcium gluconate, insulin/glucose, and prepare for CRRT",
      "Administer furosemide 80 mg IV push to increase urine output",
      "Wait for nephrology consult before initiating any renal interventions"
    ],
    correctIndex: 1,
    answer: "Potassium of 6.1 mEq/L is critically elevated and poses an immediate risk of fatal cardiac arrhythmias (peaked T waves, widened QRS, sine wave pattern, VFib). Emergency treatment includes: 1) IV calcium gluconate 10% (cardioprotection within 1-3 minutes), 2) Regular insulin 10 units + D50W (shifts K+ intracellularly within 15-30 minutes), 3) Sodium bicarbonate if acidotic, 4) Kayexalate or patiromer (removes K+ but slow), 5) Prepare for continuous renal replacement therapy (CRRT) as definitive treatment for AKI with life-threatening electrolyte abnormalities.",
    category: "Sepsis",
    difficulty: 3,
    clinicalPearl: "Hyperkalemia emergency treatment steps: 1) STABILIZE the heart: calcium gluconate 10% 10 mL IV over 2-3 min (onset 1-3 min, does NOT lower K+). 2) SHIFT K+ intracellularly: insulin 10 units + D50W 25 g IV (onset 15-30 min), albuterol 10-20 mg nebulized (onset 15-30 min). 3) REMOVE K+: Kayexalate 30g PO/PR (slow), furosemide if kidneys responsive, CRRT if anuric. Monitor continuous ECG throughout."
  },
  {
    id: "icu-sepsis-q6",
    type: "question",
    question: "Which procalcitonin (PCT) level most strongly suggests bacterial sepsis rather than a non-infectious inflammatory condition?",
    options: [
      "PCT 0.08 ng/mL",
      "PCT 0.3 ng/mL",
      "PCT 8.5 ng/mL",
      "PCT 0.15 ng/mL"
    ],
    correctIndex: 2,
    answer: "Procalcitonin >2.0 ng/mL is highly suggestive of bacterial sepsis. PCT 8.5 ng/mL strongly indicates systemic bacterial infection. PCT is produced by non-thyroid tissues in response to bacterial infection and systemic inflammation. PCT <0.1: bacterial infection unlikely. PCT 0.1-0.5: possible local infection. PCT 0.5-2.0: systemic infection likely. PCT >2.0: severe bacterial sepsis/septic shock likely. PCT is more specific for bacterial infection than CRP or WBC and can guide antibiotic de-escalation (stop antibiotics when PCT drops by >80% from peak or <0.5 ng/mL).",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Procalcitonin for antibiotic stewardship: Initial PCT helps differentiate bacterial vs. viral/non-infectious causes. Serial PCT can guide antibiotic duration - consider stopping antibiotics when PCT drops >80% from peak or <0.25-0.5 ng/mL. False elevations: trauma, surgery, burns, pancreatitis, medullary thyroid cancer, neonates (first 48 hours). False lows: localized infection, early (<6 hours) infection, fungal infections."
  },
  {
    id: "icu-sepsis-q7",
    type: "term",
    question: "What is the Surviving Sepsis Campaign Hour-1 Bundle and why is time critical?",
    answer: "The Hour-1 Bundle requires FIVE interventions within 1 hour of sepsis recognition: 1) Measure serum lactate (remeasure within 2-4 hours if elevated >2 mmol/L). 2) Obtain blood cultures before antibiotics (at least 2 sets from different sites). 3) Administer broad-spectrum IV antibiotics. 4) Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate >=4 mmol/L. 5) Apply vasopressors if hypotensive during or after fluid resuscitation to maintain MAP >=65 mmHg. Time is critical because each hour of delayed antibiotics increases mortality by 7-8%, and delayed resuscitation allows progression to multi-organ dysfunction syndrome (MODS).",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Common sepsis source control interventions: drain abscesses, debride necrotic tissue, remove infected devices (lines, catheters), repair GI perforations, and relieve urinary obstruction. Source control should be achieved within 6-12 hours of diagnosis when possible. Inadequate source control is the most common reason for persistent sepsis despite appropriate antibiotics."
  },
  {
    id: "icu-sepsis-q8",
    type: "question",
    question: "A patient is being monitored with a central venous catheter. ScvO2 (central venous oxygen saturation) is 52%. What does this value indicate?",
    options: [
      "Normal oxygen extraction by tissues",
      "Increased oxygen delivery exceeding tissue needs",
      "Inadequate oxygen delivery relative to tissue demand, requiring intervention",
      "Measurement error requiring catheter repositioning"
    ],
    correctIndex: 2,
    answer: "ScvO2 of 52% is critically low (normal 65-80%), indicating that tissues are extracting more oxygen than usual because delivery is inadequate to meet metabolic demands. Causes include: low cardiac output, anemia (low hemoglobin), hypoxemia (low PaO2/SaO2), or increased oxygen consumption (fever, shivering, seizures). The nurse should assess and address all components of oxygen delivery: optimize cardiac output (fluids, inotropes), ensure adequate hemoglobin (transfuse if Hgb <7), and maximize oxygenation. Target ScvO2 >65-70%.",
    category: "Sepsis",
    difficulty: 3,
    clinicalPearl: "Oxygen delivery equation: DO2 = CO x (1.34 x Hgb x SaO2) x 10. To improve DO2: increase CO (fluids, inotropes), increase Hgb (transfuse), or increase SaO2 (oxygen, ventilator). ScvO2 is a surrogate for SvO2 (runs about 5% higher). Target ScvO2 >70% in early sepsis resuscitation. Paradoxically HIGH ScvO2 in sepsis (>80%) suggests mitochondrial dysfunction - the cells cannot utilize oxygen despite adequate delivery."
  },
  {
    id: "icu-sepsis-q9",
    type: "question",
    question: "A nurse is initiating the sepsis resuscitation bundle. The patient weighs 80 kg. How much crystalloid should be administered in the initial rapid resuscitation?",
    options: [
      "500 mL normal saline over 2 hours",
      "1,000 mL lactated Ringer's over 1 hour",
      "2,400 mL (30 mL/kg) crystalloid as rapidly as possible",
      "4,000 mL (50 mL/kg) within the first 6 hours"
    ],
    correctIndex: 2,
    answer: "Per Surviving Sepsis Campaign guidelines, the initial fluid resuscitation for sepsis-induced hypotension or lactate >=4 mmol/L is 30 mL/kg of IV crystalloid, to be started within the first hour and administered as rapidly as possible (ideally within 1-3 hours). For an 80 kg patient: 30 x 80 = 2,400 mL. Balanced crystalloids (lactated Ringer's, Plasma-Lyte) are preferred over normal saline to reduce hyperchloremic metabolic acidosis. After the initial bolus, assess fluid responsiveness before giving additional fluids.",
    category: "Sepsis",
    difficulty: 2,
    clinicalPearl: "Fluid resuscitation pearls: Use 30 mL/kg as the INITIAL target, not the endpoint. After initial bolus: assess for fluid responsiveness (passive leg raise, SVV) before additional fluids. Normal saline: risk of hyperchloremic acidosis and AKI with large volumes. Albumin: may be considered as adjunct to crystalloid in patients requiring substantial amounts. Monitor for fluid overload: lung auscultation, jugular venous distension, increasing oxygen requirements."
  },
  {
    id: "icu-sepsis-q10",
    type: "question",
    question: "An ICU patient with abdominal sepsis develops DIC. Labs show: platelets 42,000/mm3, fibrinogen 85 mg/dL, D-dimer >20 mcg/mL, PT 22 seconds, INR 2.1. Petechiae and oozing from IV sites are noted. What is the priority treatment?",
    options: [
      "Administer heparin to prevent further clot formation",
      "Treat the underlying sepsis while replacing depleted factors with FFP, cryoprecipitate, and platelets",
      "Administer aminocaproic acid (Amicar) to inhibit fibrinolysis",
      "Transfuse packed red blood cells only"
    ],
    correctIndex: 1,
    answer: "In DIC, the priority is treating the UNDERLYING CAUSE (sepsis in this case) while providing supportive replacement of depleted coagulation factors. Transfuse: FFP for coagulation factor replacement (target INR <1.5), cryoprecipitate for fibrinogen <100 mg/dL (contains fibrinogen, factor VIII, vWF), and platelets for thrombocytopenia <50,000 or active bleeding. Heparin is controversial and generally avoided in acute DIC with active bleeding. The underlying sepsis must be aggressively treated with antibiotics and source control.",
    category: "Sepsis",
    difficulty: 3,
    clinicalPearl: "DIC lab pattern: low platelets, low fibrinogen, elevated PT/aPTT, elevated D-dimer (fibrin degradation products), schistocytes on blood smear. DIC treatment priority: 1) Treat underlying cause (sepsis, trauma, malignancy), 2) Replace: FFP (factors), cryoprecipitate (fibrinogen <100-150), platelets (<50K or bleeding), 3) Consider heparin ONLY in DIC with predominant thrombosis (rarely in sepsis-DIC). Monitor serial labs Q4-6H."
  },
  // ============================================================
  // TRAUMA (42 cards)
  // ============================================================
  {
    id: "icu-trauma-q1",
    type: "question",
    question: "A trauma patient arrives to the ICU after a fall from a 20-foot height. GCS is 7 (E2V1M4). ICP monitor shows pressure of 28 mmHg. CPP is 52 mmHg (MAP 80). What is the priority intervention?",
    options: [
      "Administer IV mannitol 1 g/kg or hypertonic saline 23.4% 30 mL",
      "Lower the head of bed to flat to improve cerebral blood flow",
      "Administer IV dexamethasone for cerebral edema",
      "Hyperventilate to PaCO2 of 20 mmHg"
    ],
    correctIndex: 0,
    answer: "ICP of 28 mmHg is critically elevated (normal <20 mmHg), and CPP of 52 mmHg is below target (maintain 60-70 mmHg). Osmotic therapy with mannitol (0.25-1 g/kg IV bolus) or hypertonic saline (23.4% 30 mL via central line, or 3% 250 mL) is the priority to rapidly reduce ICP by creating an osmotic gradient that draws water from brain tissue into the vasculature. HOB should be elevated to 30 degrees (not flat). Steroids are NOT recommended for traumatic brain injury. Aggressive hyperventilation to PaCO2 <25 is harmful.",
    category: "Trauma",
    difficulty: 3,
    optionRationales: [
      "",
      "Lowering the HOB to flat would WORSEN elevated ICP by impeding cerebral venous drainage. The head should be elevated to 30 degrees, midline position, to promote venous outflow from the brain. Flexion or rotation of the neck should be avoided as it compresses jugular veins and increases ICP.",
      "Corticosteroids (dexamethasone) are NOT recommended for traumatic brain injury. The CRASH trial demonstrated increased mortality with corticosteroid use in TBI. Steroids are used for vasogenic edema (brain tumors, abscesses) but NOT for cytotoxic edema (TBI, stroke).",
      "Aggressive hyperventilation to PaCO2 <25 mmHg causes excessive cerebral vasoconstriction, worsening cerebral ischemia. Brief, mild hyperventilation (PaCO2 30-35 mmHg) may be used as a temporary bridge while preparing definitive ICP management, but sustained aggressive hyperventilation is harmful."
    ],
    clinicalPearl: "ICP management stepwise approach: 1) HOB 30 degrees, head midline, 2) Sedation/analgesia (propofol, fentanyl), 3) Osmotic therapy (mannitol or hypertonic saline), 4) Brief hyperventilation to PaCO2 30-35 as BRIDGE only, 5) CSF drainage via EVD, 6) Barbiturate coma (pentobarbital), 7) Decompressive craniectomy. CPP target: 60-70 mmHg (CPP = MAP - ICP)."
  },
  {
    id: "icu-trauma-q2",
    type: "question",
    question: "A patient with multiple rib fractures (ribs 4-9 on the left) develops paradoxical chest wall movement with inspiration. SpO2 is 86% on 10L non-rebreather. ABG: pH 7.28, PaCO2 58, PaO2 52. What is the diagnosis and priority treatment?",
    options: [
      "Simple pneumothorax requiring chest tube",
      "Flail chest requiring intubation and positive pressure ventilation",
      "Hemothorax requiring thoracotomy",
      "Pulmonary contusion requiring observation only"
    ],
    correctIndex: 1,
    answer: "Flail chest occurs when 3 or more adjacent ribs are fractured in 2 or more places, creating a free-floating segment that moves paradoxically (inward during inspiration, outward during expiration). This patient has respiratory failure (hypoxemia and hypercapnia) requiring endotracheal intubation and mechanical ventilation. Positive pressure ventilation provides internal pneumatic splinting of the flail segment. Associated pulmonary contusion underneath the flail segment worsens gas exchange. Pain management is critical - consider thoracic epidural.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Flail chest management: Intubation NOT always required - mild cases may be managed with aggressive pain control (epidural, intercostal nerve blocks, IV PCA) and incentive spirometry. Intubate if: respiratory failure (PaO2 <60, PaCO2 >50), respiratory rate >35, accessory muscle use, or declining mental status. Always assess for underlying pulmonary contusion (develops over 24-48 hours). Avoid excessive fluid resuscitation as it worsens pulmonary contusion edema."
  },
  {
    id: "icu-trauma-q3",
    type: "term",
    question: "What is the ABCDE approach to primary trauma survey?",
    answer: "A = Airway with cervical spine protection: Assess patency, secure airway (jaw thrust in trauma, NOT head-tilt chin-lift), maintain c-spine immobilization. B = Breathing and ventilation: Assess bilateral breath sounds, RR, SpO2, chest wall integrity, identify and treat life-threatening chest injuries (tension pneumothorax, open pneumothorax, flail chest, massive hemothorax). C = Circulation with hemorrhage control: Control external bleeding with direct pressure, assess perfusion (skin color, cap refill, pulse quality), establish large-bore IV access (2 x 16-18 gauge), initiate fluid/blood product resuscitation. D = Disability (neurological): GCS, pupil size/reactivity, motor/sensory function, identify lateralizing signs. E = Exposure/Environment: Fully undress to identify all injuries, prevent hypothermia with warm blankets, warmed IV fluids, and warm environment.",
    category: "Trauma",
    difficulty: 2,
    clinicalPearl: "Life-threatening injuries to identify during primary survey (and treat immediately): Airway obstruction, tension pneumothorax, open pneumothorax, massive hemothorax, flail chest with pulmonary contusion, and cardiac tamponade. These are 'find it and fix it' problems. The secondary survey (head-to-toe systematic assessment) occurs ONLY after the primary survey is complete and resuscitation is underway."
  },
  {
    id: "icu-trauma-q4",
    type: "question",
    question: "A patient with a pelvic fracture from a motorcycle crash is hemodynamically unstable (BP 72/48, HR 134) despite 2 units of PRBCs. The nurse should anticipate which intervention?",
    options: [
      "Exploratory laparotomy",
      "Application of a pelvic binder and activation of massive transfusion protocol with interventional radiology consult for angioembolization",
      "CT scan with IV contrast to identify the bleeding source",
      "Bilateral femoral traction for fracture stabilization"
    ],
    correctIndex: 1,
    answer: "Unstable pelvic fractures can cause life-threatening retroperitoneal hemorrhage (pelvic vessels are difficult to compress). The priority is: 1) Apply a pelvic binder or sheet to close the pelvic ring and reduce the pelvic volume (tamponade effect), 2) Activate massive transfusion protocol for balanced blood product resuscitation, 3) Consult interventional radiology for angiographic embolization of actively bleeding pelvic vessels. CT scan should NOT be done on a hemodynamically unstable patient - they need the OR or angio suite.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Pelvic fracture hemorrhage management: 1) Pelvic binder at level of greater trochanters (not higher), 2) MTP activation, 3) FAST exam to rule out intraperitoneal bleeding (if positive: OR for laparotomy), 4) If FAST negative and still unstable: angiographic embolization for arterial bleeding, or preperitoneal pelvic packing for venous bleeding. Pelvic fractures can sequester 3-5 liters of blood in the retroperitoneum."
  },
  {
    id: "icu-trauma-q5",
    type: "question",
    question: "A nurse in the trauma ICU is monitoring a patient with a liver laceration being managed non-operatively. Serial hemoglobin values are: admission 12.2 g/dL, 4 hours 10.8 g/dL, 8 hours 8.4 g/dL, 12 hours 7.1 g/dL. What is the nurse's priority action?",
    options: [
      "Continue monitoring - this is an expected trend with serial hemodilution",
      "Notify the trauma surgeon immediately as the declining trend suggests ongoing hemorrhage requiring possible operative intervention",
      "Administer IV iron supplementation",
      "Increase IV fluid rate to maintain intravascular volume"
    ],
    correctIndex: 1,
    answer: "A progressive decline in hemoglobin from 12.2 to 7.1 g/dL over 12 hours strongly suggests ongoing hemorrhage from the liver laceration. Non-operative management of liver injuries requires strict hemodynamic monitoring and serial hemoglobin checks (Q4-6H). Failure of non-operative management (declining Hgb, hemodynamic instability, increasing transfusion requirements) mandates urgent surgical intervention or angiographic embolization. The nurse must immediately notify the trauma surgeon.",
    category: "Trauma",
    difficulty: 2,
    clinicalPearl: "Non-operative management of solid organ injuries (liver/spleen) requires: serial hemoglobin Q4-6H, continuous hemodynamic monitoring, strict bed rest, NPO status, type and screen on file, large-bore IV access maintained, serial abdominal exams. Failure criteria: dropping Hgb despite transfusion, hemodynamic instability, peritoneal signs, or need for >4 units PRBCs. Higher grade injuries (Grade IV-V) have higher failure rates."
  },
  {
    id: "icu-trauma-q6",
    type: "question",
    question: "A patient with a C4 spinal cord injury in the ICU suddenly develops severe hypertension (BP 210/120), bradycardia (HR 48), pounding headache, flushing above the injury level, and piloerection below. What is this condition and what is the immediate intervention?",
    options: [
      "Cushing's triad from increased ICP - administer mannitol",
      "Autonomic dysreflexia - sit the patient upright and identify/remove the noxious stimulus",
      "Malignant hypertension - administer IV labetalol",
      "Pheochromocytoma crisis - prepare for surgical intervention"
    ],
    correctIndex: 1,
    answer: "Autonomic dysreflexia (AD) is a life-threatening emergency occurring in spinal cord injuries at T6 or above. A noxious stimulus below the injury level (most commonly bladder distension, bowel impaction, or skin pressure) triggers an uninhibited sympathetic response causing severe hypertension and reflex bradycardia. Immediate treatment: 1) Sit patient upright to decrease BP by orthostatic effect, 2) Identify and remove the noxious stimulus (check for kinked catheter, fecal impaction, tight clothing, pressure areas), 3) Monitor BP every 2-3 minutes. If BP remains >150 systolic after stimulus removal, administer nifedipine 10 mg sublingual or nitropaste.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Autonomic dysreflexia triggers (most common to least): 1) Bladder distension (most common - 85%) - check for kinked Foley, full leg bag, blocked catheter, 2) Bowel distension/impaction, 3) Skin breakdown/pressure injuries, 4) Ingrown toenails, tight clothing, 5) UTI, kidney stones. Prevention: scheduled bowel/bladder programs, skin assessment, avoid constipation. AD can cause stroke, seizures, retinal hemorrhage, or death if untreated."
  },
  {
    id: "icu-trauma-q7",
    type: "question",
    question: "A burn patient with 45% TBSA second and third-degree burns weighs 75 kg. Using the Parkland formula, how much IV crystalloid (lactated Ringer's) should be administered in the first 8 hours from the time of burn?",
    options: [
      "6,750 mL in the first 8 hours",
      "3,375 mL in the first 8 hours",
      "13,500 mL in the first 8 hours",
      "1,687 mL in the first 8 hours"
    ],
    correctIndex: 0,
    answer: "Parkland formula: 4 mL x body weight (kg) x %TBSA burn = total fluid for first 24 hours. 4 x 75 x 45 = 13,500 mL total in 24 hours. Give HALF (6,750 mL) in the first 8 hours from time of burn (NOT from time of presentation). Give the remaining half (6,750 mL) over the next 16 hours. Use lactated Ringer's solution (preferred over NS to reduce hyperchloremic acidosis). Titrate to urine output of 0.5-1 mL/kg/hr in adults.",
    category: "Trauma",
    difficulty: 2,
    clinicalPearl: "Parkland formula pitfalls: 1) Start time is from TIME OF BURN, not hospital arrival - account for pre-hospital time and fluids already given. 2) The formula is a GUIDE - titrate to urine output (0.5-1 mL/kg/hr adults, 1 mL/kg/hr children). 3) Avoid 'fluid creep' (over-resuscitation) - causes abdominal compartment syndrome, pulmonary edema, and extremity compartment syndrome. 4) Electrical burns need more fluid (deep tissue damage). 5) Use LR, NOT NS."
  },
  {
    id: "icu-trauma-q8",
    type: "question",
    question: "A patient post-abdominal surgery develops abdominal compartment syndrome. Intra-abdominal pressure (IAP) measured via bladder pressure is 32 mmHg. Which finding is MOST consistent with this diagnosis?",
    options: [
      "Decreased peak inspiratory pressures on the ventilator",
      "Oliguria with rising creatinine despite adequate MAP and volume status",
      "Improved venous return and increased cardiac output",
      "Decreased CVP readings"
    ],
    correctIndex: 1,
    answer: "Abdominal compartment syndrome (ACS) occurs when IAP >20 mmHg with new organ dysfunction. The elevated intra-abdominal pressure compresses renal vasculature, causing decreased renal perfusion and oliguria despite adequate MAP. ACS also causes: elevated peak inspiratory pressures (diaphragm pushed up), decreased cardiac output (compressed IVC reducing venous return), elevated CVP (mechanical compression), and bowel ischemia. Treatment: decompressive laparotomy is definitive. Temporizing measures include sedation, neuromuscular blockade, nasogastric decompression, and percutaneous drainage.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Abdominal compartment syndrome grading: Grade I: IAP 12-15 mmHg, Grade II: 16-20 mmHg, Grade III: 21-25 mmHg, Grade IV: >25 mmHg. ACS = IAP >20 + organ dysfunction. Measure bladder pressure: instill 25 mL saline into Foley, connect to pressure transducer, measure at end-expiration in supine position. Risk factors: massive fluid resuscitation, abdominal trauma, pancreatitis, ileus, massive transfusion."
  },
  {
    id: "icu-trauma-q9",
    type: "term",
    question: "What is damage control resuscitation (DCR) in trauma care?",
    answer: "Damage control resuscitation is a strategy for managing hemorrhagic shock in major trauma that aims to prevent the lethal triad (hypothermia, acidosis, coagulopathy). Key principles: 1) Limit crystalloid infusion (causes dilutional coagulopathy and hypothermia). 2) Use balanced ratio blood products early: 1:1:1 (PRBC:FFP:Platelets) per massive transfusion protocol. 3) Permissive hypotension: target SBP 80-90 mmHg (MAP 50-60) in bleeding trauma patients WITHOUT TBI (higher targets for TBI: SBP >110). 4) Prevent hypothermia: warm fluids, warming blankets, warm OR environment. 5) Administer tranexamic acid (TXA) within 3 hours of injury. 6) Damage control surgery: abbreviated surgical procedures to control hemorrhage and contamination, with definitive repair delayed until physiologically stable.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Massive Transfusion Protocol (MTP): Activated for estimated blood loss >1.5L or ABC score >=2. Delivers pre-packaged coolers of blood products in 1:1:1 ratio. Include: calcium replacement (citrate in blood products chelates calcium), TXA 1g IV over 10 min then 1g over 8 hours (give within 3 hours of injury - CRASH-2 trial), and point-of-care coagulation testing (TEG/ROTEM) to guide targeted product replacement."
  },
  {
    id: "icu-trauma-q10",
    type: "question",
    question: "A patient with a subdural hematoma post-TBI is on an ICP monitor. The nurse notes that ICP spikes to 35 mmHg when performing oral suctioning. What nursing modification should be implemented?",
    options: [
      "Discontinue all oral care to prevent ICP elevation",
      "Pre-medicate with IV lidocaine, limit suction passes to 10 seconds, and space activities to minimize cumulative ICP elevation",
      "Switch from oral suctioning to deep tracheal suctioning which has less ICP effect",
      "Increase the sedation rate and perform all care activities simultaneously to minimize disturbance"
    ],
    correctIndex: 1,
    answer: "Suctioning stimulates coughing and Valsalva maneuver, which increases intrathoracic pressure and impedes cerebral venous drainage, causing ICP spikes. Evidence-based modifications: pre-oxygenate with 100% FiO2, administer IV lidocaine 1-1.5 mg/kg 2 minutes before suctioning (suppresses cough reflex), limit suction passes to 10 seconds each, maintain HOB at 30 degrees, and space nursing activities to prevent cumulative ICP elevation. Oral care should not be discontinued - VAP prevention is still important.",
    category: "Trauma",
    difficulty: 3,
    clinicalPearl: "Activities that increase ICP: suctioning, coughing, Valsalva, hip flexion, neck flexion/rotation, clustering nursing care activities, emotional stress, noxious stimuli, and hyperthermia. ICP-sparing nursing interventions: HOB 30 degrees, head midline, avoid neck flexion, pre-medicate before stimulating procedures, space care activities 10-15 minutes apart, maintain normothermia, minimize environmental stimulation, and maintain adequate sedation."
  },
  // ============================================================
  // ICU PHARMACOLOGY (42 cards)
  // ============================================================
  {
    id: "icu-pharm-q1",
    type: "question",
    question: "A nurse is titrating a norepinephrine (Levophed) infusion for a patient in septic shock. The current rate is 0.1 mcg/kg/min with MAP 58 mmHg. Per protocol, the target MAP is >=65 mmHg. What is the appropriate titration action?",
    options: [
      "Double the rate to 0.2 mcg/kg/min immediately",
      "Increase by 0.02-0.05 mcg/kg/min every 5-10 minutes until MAP >=65",
      "Add a second vasopressor before increasing norepinephrine",
      "Bolus norepinephrine 1 mg IV push for rapid response"
    ],
    correctIndex: 1,
    answer: "Norepinephrine should be titrated gradually in increments of 0.02-0.05 mcg/kg/min every 5-10 minutes, assessing MAP response at each step. Abrupt large increases can cause dangerous hypertension, excessive vasoconstriction with organ ischemia, and arrhythmias. Norepinephrine should never be given as an IV push/bolus outside of cardiac arrest. A second vasopressor (vasopressin) is typically added when norepinephrine reaches 0.25-0.5 mcg/kg/min, not before maximizing the primary agent.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "Norepinephrine administration: MUST be given via central line when possible (extravasation causes tissue necrosis - treat with phentolamine infiltration). Concentration: typically 4-16 mg in 250 mL D5W. Dose range: 0.01-3.0 mcg/kg/min. Titrate Q5-10 min. Use dedicated lumen (do not piggyback). Always have vasopressor running through a port proximal to a running carrier fluid to prevent bolus effect when line is flushed."
  },
  {
    id: "icu-pharm-q2",
    type: "question",
    question: "A patient on a propofol (Diprivan) infusion for ICU sedation develops unexplained metabolic acidosis, rhabdomyolysis (CK 45,000 U/L), and acute kidney injury after 72 hours of infusion at 6 mg/kg/hr. What syndrome should the nurse suspect?",
    options: [
      "Neuroleptic malignant syndrome",
      "Malignant hyperthermia",
      "Propofol infusion syndrome (PRIS)",
      "Serotonin syndrome"
    ],
    correctIndex: 2,
    answer: "Propofol infusion syndrome (PRIS) is a rare but potentially fatal complication of prolonged (>48 hours) or high-dose (>5 mg/kg/hr) propofol infusion. It is characterized by: unexplained metabolic acidosis (lactic acidosis), rhabdomyolysis (elevated CK), acute kidney injury, hyperkalemia, hepatomegaly, cardiac failure, and Brugada-like ECG changes. Treatment: immediately discontinue propofol, provide supportive care (hemodialysis, vasopressors), and switch to an alternative sedative (dexmedetomidine, midazolam). Prevention: limit propofol to <5 mg/kg/hr for <48 hours and monitor triglycerides and CK.",
    category: "ICU Pharmacology",
    difficulty: 3,
    optionRationales: [
      "NMS is caused by dopamine antagonists (antipsychotics), not propofol. NMS presents with hyperthermia, muscle rigidity (lead-pipe), altered mental status, and autonomic instability. Treatment is dantrolene and bromocriptine.",
      "Malignant hyperthermia is triggered by volatile anesthetic agents (sevoflurane, desflurane) and succinylcholine, not propofol. It presents with rapidly rising temperature, muscle rigidity, hypercarbia, and metabolic acidosis. Treatment is IV dantrolene.",
      "",
      "Serotonin syndrome is caused by serotonergic drugs (SSRIs, MAOIs, tramadol), not propofol. It presents with mental status changes, neuromuscular abnormalities (clonus, hyperreflexia), and autonomic instability. Treatment is cyproheptadine."
    ],
    clinicalPearl: "PRIS prevention and monitoring: Keep propofol dose <5 mg/kg/hr and duration <48 hours when possible. Monitor triglycerides Q48H (propofol is in a lipid emulsion - count as caloric intake: 1.1 kcal/mL). Check CK daily if on prolonged infusion. Warning signs: unexplained metabolic acidosis, rising CK, bradycardia, hyperlipidemia. Risk factors: pediatric patients, high doses, prolonged use, catecholamine/steroid co-administration."
  },
  {
    id: "icu-pharm-q3",
    type: "question",
    question: "A nurse is managing a patient on a cisatracurium (Nimbex) infusion for ARDS requiring deep sedation and paralysis. Which monitoring tool is essential during neuromuscular blockade?",
    options: [
      "Glasgow Coma Scale assessment every 2 hours",
      "Train-of-four (TOF) peripheral nerve stimulation monitoring",
      "Bispectral index (BIS) monitoring for seizure detection",
      "Hourly pupil reactivity assessment"
    ],
    correctIndex: 1,
    answer: "Train-of-four (TOF) monitoring using a peripheral nerve stimulator is essential during neuromuscular blockade (NMB) to prevent over-paralysis and under-paralysis. The target is typically 1-2 twitches out of 4 (75-90% blockade). Zero twitches indicates excessive paralysis (risk of prolonged weakness), while 4 twitches indicates inadequate blockade. Additionally, adequate sedation MUST be ensured before and during paralysis (the patient cannot communicate pain or awareness). BIS monitoring helps assess sedation depth under paralysis.",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "NMB agent nursing considerations: ALWAYS ensure adequate sedation and analgesia BEFORE initiating paralysis (the patient is aware but unable to move or communicate - 'locked in'). Monitor TOF Q4H (target 1-2/4 twitches). Perform daily NMB holiday when possible. Eye care Q2H (cannot blink - risk of corneal abrasion). DVT prophylaxis. Continuous EEG if seizure risk. Document 'sedation first, then paralysis' in the care plan. Cisatracurium is preferred over vecuronium in renal/hepatic failure (Hofmann elimination)."
  },
  {
    id: "icu-pharm-q4",
    type: "question",
    question: "A patient in the ICU is on a dexmedetomidine (Precedex) infusion for sedation. The nurse notes HR 42 bpm and BP 88/52. What is the appropriate nursing action?",
    options: [
      "Administer IV atropine 0.5 mg for the bradycardia",
      "Decrease the dexmedetomidine infusion rate and assess - bradycardia and hypotension are dose-related side effects",
      "Discontinue the infusion immediately and switch to midazolam",
      "Increase IV fluid rate to treat the hypotension"
    ],
    correctIndex: 1,
    answer: "Dexmedetomidine is an alpha-2 agonist that provides sedation with maintained respiratory drive but commonly causes dose-dependent bradycardia and hypotension. The appropriate first response is to decrease the infusion rate (typically by 25-50%) and reassess. Most cases of hemodynamic compromise resolve with dose reduction. Abrupt discontinuation can cause rebound hypertension and agitation. Atropine should be reserved for symptomatic bradycardia unresponsive to dose reduction.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "Dexmedetomidine advantages: provides 'cooperative sedation' (patient can be aroused for neuro exams), no respiratory depression (unique among ICU sedatives), reduces delirium incidence compared to benzodiazepines, and may decrease time to extubation. Disadvantages: bradycardia and hypotension (most common), cannot achieve deep sedation levels, requires slow loading dose (over 10 min to avoid bradycardia), and is more expensive. Do not use a loading dose in hemodynamically unstable patients."
  },
  {
    id: "icu-pharm-q5",
    type: "term",
    question: "What is the RASS (Richmond Agitation-Sedation Scale) and what are the target sedation levels for ICU patients?",
    answer: "RASS is a 10-point scale (-5 to +4) used to assess sedation and agitation in ICU patients. +4 = Combative (violent). +3 = Very agitated (pulls/removes tubes). +2 = Agitated (frequent non-purposeful movement). +1 = Restless (anxious but not aggressive). 0 = Alert and calm. -1 = Drowsy (not fully alert but sustained awakening >10 sec). -2 = Light sedation (briefly awakens to voice <10 sec). -3 = Moderate sedation (movement/eye opening to voice, no eye contact). -4 = Deep sedation (no response to voice, movement to physical stimulation). -5 = Unarousable (no response to voice or physical stimulation). Target: -2 to 0 (light sedation) for most ICU patients per PADIS guidelines, unless deep sedation is required (ARDS with paralysis, status epilepticus, or elevated ICP).",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "PADIS guidelines (Pain, Agitation/sedation, Delirium, Immobility, Sleep): Target light sedation (RASS -2 to 0) whenever possible - associated with shorter ICU stay, fewer ventilator days, and less delirium. Use 'analgesia-first sedation' - treat pain before adding sedatives. Avoid benzodiazepines (increase delirium risk) - prefer propofol or dexmedetomidine. Perform daily SAT (spontaneous awakening trial) to assess for readiness to reduce sedation."
  },
  {
    id: "icu-pharm-q6",
    type: "question",
    question: "A patient receiving IV amiodarone for refractory ventricular tachycardia develops a heart rate of 38 bpm with QTc interval of 580 ms. What complication is the nurse most concerned about?",
    options: [
      "Amiodarone-induced hypothyroidism",
      "Torsades de pointes from excessive QT prolongation",
      "Amiodarone-induced pulmonary toxicity",
      "Corneal microdeposits affecting vision"
    ],
    correctIndex: 1,
    answer: "A QTc of 580 ms (normal <470 ms for males, <480 ms for females) with severe bradycardia places the patient at high risk for torsades de pointes (TdP), a polymorphic ventricular tachycardia that can degenerate into ventricular fibrillation and cardiac arrest. Amiodarone prolongs the QT interval as part of its mechanism of action (Class III antiarrhythmic). The nurse should immediately notify the provider, prepare IV magnesium sulfate 2 g (first-line for TdP), and have a defibrillator at bedside. The amiodarone dose may need to be reduced or discontinued.",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "Amiodarone side effects by organ system: Heart - bradycardia, QT prolongation, torsades de pointes. Thyroid - both hypo- and hyperthyroidism (contains iodine). Lungs - pulmonary fibrosis/toxicity (monitor PFTs annually). Liver - hepatotoxicity (monitor LFTs Q6 months). Eyes - corneal microdeposits (usually benign), optic neuropathy (rare). Skin - photosensitivity, blue-gray skin discoloration. Monitoring: TFTs, LFTs, PFTs, CXR, ophthalmology exam annually."
  },
  {
    id: "icu-pharm-q7",
    type: "question",
    question: "A nurse is preparing to administer IV phenylephrine to a post-operative cardiac surgery patient. The patient's current SVR is 2,400 dynes-sec/cm-5. Why might phenylephrine be CONTRAINDICATED in this situation?",
    options: [
      "Phenylephrine only works on beta receptors and will not increase blood pressure",
      "Phenylephrine is a pure alpha-1 agonist that will further increase an already elevated SVR, potentially worsening cardiac output",
      "Phenylephrine causes tachycardia which is dangerous post-cardiac surgery",
      "Phenylephrine must be given IM, not IV, in post-operative patients"
    ],
    correctIndex: 1,
    answer: "Phenylephrine is a pure alpha-1 agonist that causes vasoconstriction, increasing SVR. In a patient with already elevated SVR (normal 800-1,200), adding phenylephrine would further increase afterload, forcing the heart to pump against even greater resistance. This can decrease cardiac output (especially in a post-surgical heart with compromised function), worsen myocardial oxygen demand, and reduce tissue perfusion. A vasopressor with inotropic properties (norepinephrine, which has both alpha and beta effects) would be more appropriate.",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "Vasoactive medication selection by hemodynamic profile: Low SVR + Low CO: norepinephrine + dobutamine. Low SVR + Normal/High CO: norepinephrine or vasopressin. Normal/High SVR + Low CO: dobutamine or milrinone (decrease afterload while increasing contractility). High SVR + Low CO + High PCWP: milrinone (inodilator) or dobutamine + nitroglycerin. Always match the drug mechanism to the hemodynamic problem."
  },
  {
    id: "icu-pharm-q8",
    type: "question",
    question: "A patient with septic shock is receiving norepinephrine, vasopressin, and epinephrine. Blood glucose has risen from 142 to 328 mg/dL over 4 hours. What is the most likely cause and appropriate intervention?",
    options: [
      "New-onset type 1 diabetes requiring insulin drip",
      "Stress hyperglycemia from catecholamines and critical illness - initiate continuous insulin infusion per ICU protocol",
      "Steroid-induced hyperglycemia from empiric steroid administration",
      "Dextrose in the IV fluids - switch to normal saline"
    ],
    correctIndex: 1,
    answer: "Stress hyperglycemia in critical illness is caused by counter-regulatory hormones (cortisol, glucagon, catecholamines, growth hormone), insulin resistance, hepatic gluconeogenesis, and exogenous catecholamine administration (epinephrine directly stimulates glycogenolysis and gluconeogenesis). Management: initiate continuous IV insulin infusion per ICU protocol, targeting blood glucose 140-180 mg/dL (per NICE-SUGAR trial). Tight glucose control (<110 mg/dL) is no longer recommended due to increased hypoglycemia risk and mortality.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "ICU glucose management (NICE-SUGAR trial): Target 140-180 mg/dL. Use continuous insulin infusion (NOT sliding scale alone). Monitor glucose Q1-2H during infusion. Avoid hypoglycemia (<70 mg/dL) - associated with increased mortality. Epinephrine is particularly hyperglycemic due to beta-2 stimulation of glycogenolysis. When transitioning off insulin drip, overlap with subcutaneous insulin by 1-2 hours before discontinuing the drip."
  },
  {
    id: "icu-pharm-q9",
    type: "term",
    question: "What are the key differences between fentanyl, morphine, and hydromorphone for ICU analgesia?",
    answer: "FENTANYL: Preferred in ICU. Fast onset (1-2 min IV), short duration (30-60 min), no active metabolites, minimal histamine release, hemodynamically stable. Safe in renal failure. 50-100x more potent than morphine. MORPHINE: Slower onset (5-10 min IV), longer duration (3-4 hours), active metabolite (M6G) accumulates in renal failure causing prolonged sedation. Causes histamine release (hypotension, bronchospasm, pruritus). Avoid in renal impairment. HYDROMORPHONE: Intermediate onset (5 min IV), duration 2-3 hours, minimal active metabolites, less histamine release than morphine, 5-7x more potent than morphine. Reasonable alternative to fentanyl. All three cause respiratory depression, constipation, and require naloxone as the reversal agent.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "ICU analgesia first-line: fentanyl infusion (0.5-2 mcg/kg/hr) for mechanically ventilated patients. PADIS guidelines recommend 'analgesia-first sedation' - treat pain before adding sedatives. Assessment tools: CPOT (Critical Care Pain Observation Tool) or BPS (Behavioral Pain Scale) for patients who cannot self-report. Non-pharmacological adjuncts: repositioning, cold/warm therapy, music therapy, and family presence."
  },
  {
    id: "icu-pharm-q10",
    type: "question",
    question: "A patient on a vasopressin infusion at 0.04 units/min for septic shock develops digital ischemia (blue, cold fingertips) and decreased urine output with serum sodium of 128 mEq/L. What complication is occurring?",
    options: [
      "Expected therapeutic effect of vasopressin - no action needed",
      "Vasopressin-related vasoconstriction causing digital ischemia and antidiuretic effect causing hyponatremia",
      "Sepsis-related DIC causing digital ischemia",
      "Hypothermia-related peripheral vasoconstriction"
    ],
    correctIndex: 1,
    answer: "Vasopressin acts on V1 receptors (vasoconstriction) and V2 receptors (water reabsorption in kidneys). At vasopressor doses, V1-mediated vasoconstriction can cause excessive peripheral and mesenteric ischemia (digital ischemia, mesenteric ischemia, skin necrosis). V2-mediated effects cause water retention, dilutional hyponatremia, and oliguria. The nurse should monitor for these complications, assess digits and skin for ischemia, and track sodium levels. The vasopressin dose may need to be reduced.",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "Vasopressin in septic shock: Fixed dose 0.03-0.04 units/min (NOT titrated like norepinephrine). Used as adjunct to norepinephrine to spare catecholamine dose. Side effects: digital/mesenteric/skin ischemia, hyponatremia (V2 effect), decreased platelet count. Monitor: distal perfusion (fingertips, toes, skin), sodium levels Q6-8H, abdominal assessment for mesenteric ischemia (abdominal pain, bloody stools, lactic acidosis). Advantage: works via non-catecholamine pathway in patients with catecholamine receptor downregulation."
  },
  {
    id: "icu-pharm-q11",
    type: "question",
    question: "A mechanically ventilated patient with status epilepticus is on a midazolam infusion. After 5 days, the team plans to discontinue the infusion. What risk must the nurse anticipate?",
    options: [
      "Immediate return to baseline cognitive function",
      "Benzodiazepine withdrawal syndrome including seizures, agitation, and autonomic instability",
      "Permanent tolerance requiring lifelong benzodiazepine therapy",
      "No special precautions needed - midazolam can be abruptly discontinued"
    ],
    correctIndex: 1,
    answer: "Prolonged benzodiazepine infusion causes physical dependence through GABA-A receptor downregulation. Abrupt discontinuation can trigger withdrawal syndrome: seizures (potentially status epilepticus), severe agitation, tremors, autonomic instability (tachycardia, hypertension, diaphoresis), and delirium. The infusion should be tapered gradually (typically 10-20% dose reduction every 6-12 hours) with continuous monitoring. Alternative long-acting benzodiazepines (lorazepam) or transition to enteral formulations may facilitate weaning.",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "ICU drug withdrawal risks: Benzodiazepines (seizures, delirium, autonomic instability - taper over days), Opioids (diarrhea, diaphoresis, tachycardia, myalgia - taper over days), Propofol (generally safe to discontinue abruptly as no physical dependence), Dexmedetomidine (rebound hypertension and agitation if stopped abruptly - taper). For patients on >5 days of continuous sedation, plan a structured weaning protocol with daily assessment."
  },
  {
    id: "icu-pharm-q12",
    type: "question",
    question: "An ICU patient develops ventilator-associated pneumonia (VAP) with MRSA confirmed on sputum culture. Which antibiotic should the nurse anticipate?",
    options: [
      "Piperacillin-tazobactam (Zosyn)",
      "IV vancomycin or linezolid",
      "Azithromycin (Z-pack)",
      "Amoxicillin-clavulanate"
    ],
    correctIndex: 1,
    answer: "MRSA (methicillin-resistant Staphylococcus aureus) pneumonia requires antibiotics with activity against resistant gram-positive organisms. IV vancomycin (target trough AUC/MIC 400-600 for serious infections) or linezolid (600 mg IV/PO Q12H) are the recommended agents for MRSA pneumonia. Linezolid may have better lung tissue penetration. Beta-lactam antibiotics (piperacillin-tazobactam, amoxicillin) are ineffective against MRSA. Azithromycin covers atypical organisms, not MRSA.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "Vancomycin monitoring update: AUC/MIC-guided dosing (target AUC 400-600 for serious MRSA infections) has replaced trough-only monitoring. Nephrotoxicity risk increases with AUC >600 or concomitant nephrotoxins (piperacillin-tazobactam, aminoglycosides, NSAIDs). Infuse over at least 60 minutes (1g/hr) to prevent 'Red Man Syndrome' (histamine-mediated flushing, NOT a true allergy). Loading dose: 25-30 mg/kg for critically ill patients."
  },
  {
    id: "icu-pharm-q13",
    type: "term",
    question: "What is the mechanism and clinical use of milrinone (Primacor) in the ICU?",
    answer: "Milrinone is a phosphodiesterase-3 (PDE-3) inhibitor that increases intracellular cAMP in cardiac and vascular smooth muscle cells. It has dual 'inodilator' effects: 1) Positive inotropy - increases cardiac contractility and cardiac output by increasing intracellular calcium in cardiac myocytes. 2) Vasodilation - decreases SVR and PVR by relaxing vascular smooth muscle. Clinical uses: cardiogenic shock (especially when the patient is on beta-blockers, since milrinone bypasses beta receptors), decompensated heart failure, right heart failure with pulmonary hypertension, and post-cardiac surgery low cardiac output syndrome. Key adverse effects: hypotension (most common), arrhythmias, thrombocytopenia. Dose adjustment required in renal impairment (renally excreted).",
    category: "ICU Pharmacology",
    difficulty: 3,
    clinicalPearl: "Milrinone vs. Dobutamine: Milrinone advantages - works despite beta-blocker therapy (PDE-3 mechanism), reduces PVR (helpful in RV failure), less tachycardia. Milrinone disadvantages - longer half-life (difficult to titrate, hypotension may persist after stopping), thrombocytopenia (check platelet counts), and renal dosing required. Both are inotropes but through different mechanisms. Choose milrinone when patient is on beta-blockers or has pulmonary hypertension."
  },
  {
    id: "icu-pharm-q14",
    type: "question",
    question: "A patient with acute liver failure in the ICU has altered mental status and asterixis. Ammonia level is 142 umol/L. Which medication should the nurse administer?",
    options: [
      "IV N-acetylcysteine for acetaminophen toxicity regardless of cause",
      "Lactulose 30 mL PO/NG Q2H titrated to 3-4 soft stools per day and rifaximin 550 mg PO BID",
      "IV mannitol for cerebral edema",
      "Flumazenil to reverse hepatic encephalopathy"
    ],
    correctIndex: 1,
    answer: "Hepatic encephalopathy from acute liver failure is treated by reducing ammonia levels. Lactulose is first-line: it creates an acidic environment in the colon that converts ammonia (NH3) to ammonium (NH4+), which cannot be absorbed, and acts as an osmotic laxative to eliminate ammonia-laden stool. Titrate to 3-4 soft stools per day. Rifaximin is a non-absorbable antibiotic that reduces ammonia-producing gut bacteria. N-acetylcysteine is only for acetaminophen-related liver failure. Flumazenil is a benzodiazepine reversal agent, not for hepatic encephalopathy.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "Hepatic encephalopathy grading: Grade I - altered sleep, mild confusion. Grade II - lethargy, moderate confusion, asterixis (liver flap). Grade III - somnolence, marked confusion, incoherent speech. Grade IV - coma, no response to stimuli. Lactulose monitoring: titrate to 3-4 soft stools/day (too many = dehydration and electrolyte imbalance). Hold lactulose if ileus develops. Check ammonia levels but treat based on clinical status (ammonia doesn't always correlate with severity)."
  },
  {
    id: "icu-pharm-q15",
    type: "question",
    question: "A trauma ICU patient is receiving a heparin infusion. The aPTT result is 120 seconds (target 60-80 seconds). The patient develops new hematuria and a drop in hemoglobin from 10.2 to 8.1 g/dL. What is the priority intervention?",
    options: [
      "Continue the heparin infusion at the current rate and recheck aPTT in 6 hours",
      "Stop the heparin infusion, administer protamine sulfate, and notify the provider",
      "Reduce the heparin rate by 50% and continue monitoring",
      "Administer vitamin K 10 mg IV to reverse the heparin effect"
    ],
    correctIndex: 1,
    answer: "The aPTT of 120 seconds is supratherapeutic (1.5x above target) with clinical signs of bleeding (hematuria and dropping hemoglobin). The priority is to stop the heparin infusion immediately and administer protamine sulfate (the specific heparin reversal agent). Protamine dose: 1 mg protamine per 100 units of heparin administered in the last 2 hours, given slowly IV over 10 minutes (rapid infusion causes hypotension, bradycardia, and anaphylactoid reactions). Vitamin K reverses warfarin, NOT heparin.",
    category: "ICU Pharmacology",
    difficulty: 2,
    clinicalPearl: "Anticoagulant reversal agents: Heparin -> Protamine sulfate (1 mg per 100 units heparin). Warfarin -> Vitamin K (IV/PO) + FFP or 4-factor PCC for urgent reversal. Dabigatran -> Idarucizumab (Praxbind). Rivaroxaban/Apixaban -> Andexanet alfa (Andexxa) or 4-factor PCC. LMWH (enoxaparin) -> Protamine (only partially effective, ~60% neutralization). tPA -> Aminocaproic acid (Amicar) or tranexamic acid (TXA)."
  }
];
