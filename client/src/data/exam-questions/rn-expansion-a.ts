import type { ExamQuestion } from "./types";

export const rnExpansionAQuestions: ExamQuestion[] = [
  // ===== ICU MONITORING & VENTILATOR MANAGEMENT (Questions 1-10) =====
  {
    q: "A mechanically ventilated client on volume-controlled assist-control mode has a high-pressure alarm sounding repeatedly. The nurse assesses the client and finds coarse crackles bilaterally with thick secretions in the endotracheal tube. What is the priority nursing intervention?",
    o: ["Suction the endotracheal tube", "Increase the tidal volume setting", "Reposition the endotracheal tube", "Administer a sedative to reduce coughing"],
    a: 0,
    r: "High-pressure alarms indicate increased airway resistance or decreased lung compliance. Thick secretions obstructing the airway are a common cause. Suctioning removes the obstruction, reduces airway pressure, and restores adequate ventilation. Increasing tidal volume would worsen the high pressure. Repositioning is warranted if tube displacement is suspected. Sedation does not address the underlying cause.",
    s: "Critical Care"
  },
  {
    q: "A nurse is caring for a client on mechanical ventilation with the following settings: FiO2 60%, PEEP 10 cm H2O, tidal volume 450 mL. The ABG results show pH 7.48, PaCO2 30 mmHg, PaO2 98 mmHg, HCO3 24 mEq/L. Which ventilator adjustment should the nurse anticipate?",
    o: ["Decrease the respiratory rate", "Increase the PEEP", "Increase the FiO2", "Increase the tidal volume"],
    a: 0,
    r: "The ABG shows respiratory alkalosis (elevated pH, low PaCO2) indicating the client is being over-ventilated and blowing off too much CO2. Decreasing the respiratory rate will allow CO2 to accumulate and normalize the pH. The PaO2 is adequate so increasing FiO2 or PEEP is unnecessary. Increasing tidal volume would further reduce CO2 and worsen alkalosis.",
    s: "Critical Care"
  },
  {
    q: "A client on mechanical ventilation develops sudden onset of absent breath sounds on the left side, tracheal deviation to the right, and hypotension. The nurse should prepare for which immediate intervention?",
    o: ["Needle decompression of the left chest", "Emergent intubation with a larger tube", "Chest X-ray to confirm diagnosis", "Increasing the PEEP to improve oxygenation"],
    a: 0,
    r: "Absent breath sounds on one side, tracheal deviation away from the affected side, and hypotension are classic signs of tension pneumothorax. This is a life-threatening emergency requiring immediate needle decompression to relieve pressure, followed by chest tube insertion. Waiting for a chest X-ray delays treatment in this emergency. Increasing PEEP worsens a pneumothorax. Reintubation does not address the underlying problem.",
    s: "Critical Care"
  },
  {
    q: "A nurse is weaning a client from mechanical ventilation using a spontaneous breathing trial (SBT). Which finding indicates the client is not tolerating the weaning trial?",
    o: ["Respiratory rate increasing from 16 to 36 breaths per minute with accessory muscle use", "SpO2 remaining at 96% on FiO2 40%", "Client reporting mild anxiety about the process", "Heart rate increasing from 72 to 80 beats per minute"],
    a: 0,
    r: "A rapid shallow breathing pattern with respiratory rate greater than 35 and accessory muscle use indicates weaning failure and the need to return to full ventilatory support. Maintained SpO2 indicates adequate oxygenation. Mild anxiety is common during weaning. A small increase in heart rate is within normal limits. The rapid shallow breathing index (respiratory rate divided by tidal volume) is the most reliable predictor of weaning failure.",
    s: "Critical Care"
  },
  {
    q: "A mechanically ventilated client develops auto-PEEP (intrinsic PEEP). Which assessment finding would the nurse expect?",
    o: ["Incomplete exhalation before the next breath cycle begins", "Low peak inspiratory pressures on the ventilator", "Increased tidal volume delivery", "Bradycardia and hypertension"],
    a: 0,
    r: "Auto-PEEP (air trapping) occurs when exhalation is incomplete before the next breath is delivered, creating inadvertent positive pressure at end-expiration. This is common in clients with obstructive lung disease (COPD, asthma). It leads to increased peak inspiratory pressures, decreased venous return, and potential hypotension. Treatment includes decreasing respiratory rate, increasing expiratory time, or applying external PEEP.",
    s: "Critical Care"
  },
  {
    q: "A nurse monitors a client in the ICU who is receiving continuous pulse oximetry. The SpO2 reading suddenly drops from 97% to 82%. The client appears comfortable and has warm, dry extremities. What should the nurse do first?",
    o: ["Assess the probe placement and check for signal quality", "Increase the FiO2 immediately", "Prepare for emergent intubation", "Obtain an arterial blood gas immediately"],
    a: 0,
    r: "A sudden drop in SpO2 without corresponding clinical deterioration suggests a technical issue with the probe such as displacement, poor contact, or motion artifact. The nurse should first assess probe placement and signal quality before initiating interventions. If the reading is confirmed accurate, then further interventions such as increasing FiO2 or obtaining an ABG would be appropriate.",
    s: "Critical Care"
  },
  {
    q: "A client on mechanical ventilation has ventilator-associated pneumonia (VAP) prevention bundle orders. Which nursing intervention is part of the evidence-based VAP prevention bundle?",
    o: ["Elevating the head of bed to 30 to 45 degrees", "Performing endotracheal suctioning every hour on a schedule", "Maintaining the endotracheal tube cuff pressure below 15 cm H2O", "Using a heated humidifier instead of a heat-moisture exchanger"],
    a: 0,
    r: "The VAP prevention bundle includes head of bed elevation to 30-45 degrees to prevent aspiration of oropharyngeal secretions, daily sedation vacations, daily assessment of readiness to extubate, peptic ulcer prophylaxis, and DVT prophylaxis. Suctioning should be done as needed, not on a schedule. Cuff pressure should be maintained at 20-30 cm H2O to prevent aspiration. Humidifier type is not a core VAP bundle element.",
    s: "Critical Care"
  },
  {
    q: "A nurse receives an alarm indicating low exhaled tidal volume on a ventilator set to volume-controlled mode. The client's SpO2 is 89%. Which cause should the nurse investigate first?",
    o: ["Air leak in the ventilator circuit or around the endotracheal tube cuff", "Client biting on the endotracheal tube", "Bronchospasm causing increased airway resistance", "Mucus plug in the right mainstem bronchus"],
    a: 0,
    r: "Low exhaled tidal volume in volume-controlled mode indicates that the set volume is being delivered but air is escaping before it can be measured on exhalation. This is most commonly caused by a circuit disconnection or leak, or a deflated endotracheal tube cuff. The nurse should check all connections and assess cuff pressure. Biting and bronchospasm would cause high-pressure alarms. A mucus plug would also increase airway pressure.",
    s: "Critical Care"
  },
  {
    q: "A client in the ICU is being monitored with continuous end-tidal CO2 (EtCO2) capnography. The EtCO2 suddenly drops to near zero while the ventilator continues to cycle. What does this finding most likely indicate?",
    o: ["Endotracheal tube displacement into the esophagus or complete airway obstruction", "Improvement in the client's ventilation status", "The client is breathing over the ventilator rate", "Development of metabolic acidosis"],
    a: 0,
    r: "A sudden drop in EtCO2 to near zero while the ventilator continues to function indicates that exhaled CO2 is not being detected. This is most commonly caused by endotracheal tube displacement (esophageal or pharyngeal position), complete airway obstruction, or cardiac arrest. It requires immediate assessment of tube placement, bilateral breath sounds, and chest rise. Improved ventilation would show a gradual decrease, not an abrupt drop to zero.",
    s: "Critical Care"
  },
  {
    q: "A nurse is preparing to prone a mechanically ventilated client with severe ARDS. Which action should the nurse take before initiating prone positioning?",
    o: ["Ensure all vascular lines and the endotracheal tube are secured and verify tube placement", "Increase the PEEP to maximum before turning", "Discontinue all vasoactive infusions during the turn", "Remove the nasogastric tube to prevent displacement"],
    a: 0,
    r: "Before proning an ARDS client, the nurse must secure all lines, tubes, and drains to prevent dislodgement during the turn. Endotracheal tube placement should be verified, and the team should be prepared for potential complications. PEEP adjustments are made based on clinical response, not maximized before turning. Vasoactive infusions should continue during the turn. The nasogastric tube should be secured, not removed, and gastric feeds are typically held before proning.",
    s: "Critical Care"
  },

  // ===== HEMODYNAMIC ASSESSMENT (Questions 11-20) =====
  {
    q: "A client with a pulmonary artery catheter has the following readings: CVP 14 mmHg, PAP 48/26 mmHg, PAWP 24 mmHg, CO 3.2 L/min. These findings are most consistent with which condition?",
    o: ["Left ventricular failure", "Hypovolemic shock", "Right ventricular failure without left-sided involvement", "Pulmonary embolism"],
    a: 0,
    r: "Elevated CVP, elevated PAP, elevated PAWP, and decreased cardiac output are classic findings of left ventricular failure. The elevated PAWP reflects increased left atrial pressure due to the failing left ventricle. Hypovolemic shock would show low CVP and low PAWP. Isolated right ventricular failure would show elevated CVP but normal PAWP. Pulmonary embolism would show elevated PAP with normal or low PAWP.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client with a central venous catheter. The CVP reading is 2 mmHg. Which condition is this finding most consistent with?",
    o: ["Hypovolemia", "Right ventricular failure", "Cardiac tamponade", "Fluid overload"],
    a: 0,
    r: "A CVP of 2 mmHg is below the normal range of 2-8 mmHg, indicating decreased preload consistent with hypovolemia. Right ventricular failure, cardiac tamponade, and fluid overload would all cause elevated CVP due to increased right-sided pressures and volume. Treatment for low CVP typically includes fluid resuscitation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse notes a dampened waveform on the arterial line tracing. Which action should the nurse take first?",
    o: ["Check the tubing system for air bubbles, blood, or kinks", "Recalibrate the transducer to zero", "Notify the healthcare provider of the change", "Obtain a manual blood pressure for comparison"],
    a: 0,
    r: "A dampened arterial waveform commonly results from air bubbles in the tubing, blood backup, kinks, or loose connections. The nurse should first inspect and troubleshoot the system by checking for these mechanical issues. Zeroing the transducer addresses calibration drift, not dampening. While obtaining a manual BP and notifying the provider may be necessary, troubleshooting the technical issue is the priority first step.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is leveling and zeroing a hemodynamic monitoring transducer. At which anatomical landmark should the transducer be positioned?",
    o: ["The phlebostatic axis at the fourth intercostal space, midaxillary line", "The second intercostal space at the right sternal border", "The xiphoid process at the midclavicular line", "The angle of Louis at the sternal notch"],
    a: 0,
    r: "The phlebostatic axis, located at the intersection of the fourth intercostal space and the midaxillary line, is the external reference point for the right atrium. All hemodynamic transducers must be leveled to this point to ensure accurate pressure readings. Incorrect leveling can produce falsely elevated or decreased readings. The head of bed can be elevated up to 45 degrees as long as the transducer is releveled.",
    s: "Cardiovascular"
  },
  {
    q: "A client's hemodynamic readings show SVR of 2200 dynes/sec/cm-5, CO of 3.0 L/min, and PAWP of 6 mmHg. These findings are most consistent with which type of shock?",
    o: ["Hypovolemic shock", "Cardiogenic shock", "Septic (distributive) shock", "Neurogenic shock"],
    a: 0,
    r: "High SVR, low cardiac output, and low PAWP are classic findings of hypovolemic shock. The body compensates for volume loss by increasing systemic vascular resistance to maintain blood pressure, while low PAWP reflects inadequate preload. Cardiogenic shock would show elevated PAWP. Septic and neurogenic shock (distributive) would show decreased SVR due to vasodilation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is interpreting a pulmonary artery waveform and notes the tracing shows a large a-wave on the right atrial waveform. Which condition can cause prominent a-waves?",
    o: ["Tricuspid stenosis or pulmonary hypertension", "Mitral regurgitation", "Hypovolemia", "Aortic stenosis"],
    a: 0,
    r: "Prominent a-waves on the right atrial waveform occur when the right atrium contracts against increased resistance. This is seen in tricuspid stenosis, pulmonary hypertension, and right ventricular hypertrophy. Mitral regurgitation causes large v-waves on the PAWP tracing. Hypovolemia produces low-amplitude waveforms. Aortic stenosis affects left-sided pressures.",
    s: "Cardiovascular"
  },
  {
    q: "A client in the ICU has a cardiac output of 3.5 L/min and a body surface area of 1.75 m2. The nurse calculates the cardiac index as which value?",
    o: ["2.0 L/min/m2", "3.5 L/min/m2", "1.75 L/min/m2", "6.1 L/min/m2"],
    a: 0,
    r: "Cardiac index (CI) is calculated by dividing cardiac output (CO) by body surface area (BSA). CI = 3.5 / 1.75 = 2.0 L/min/m2. Normal cardiac index is 2.5-4.0 L/min/m2. This client's CI of 2.0 is below normal, indicating inadequate tissue perfusion and requiring further assessment and possible intervention to improve cardiac function.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client after insertion of a pulmonary artery catheter. The waveform suddenly changes from a pulmonary artery waveform to a wedge waveform without balloon inflation. What should the nurse do?",
    o: ["Reposition the client and ask them to cough to help the catheter float back", "Inflate the balloon to confirm the position", "Increase the IV fluid rate to increase cardiac output", "Obtain a chest X-ray before taking any action"],
    a: 0,
    r: "A spontaneous wedge tracing without balloon inflation indicates catheter migration and distal wedging, which can cause pulmonary infarction. The nurse should attempt to reposition the client or have them cough, which may help the catheter float back to the proper position. The balloon should never be inflated when the catheter is already wedged. The provider should be notified if repositioning is unsuccessful, and the catheter may need to be pulled back.",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiogenic shock has the following hemodynamic values: CI 1.8 L/min/m2, SVR 2400 dynes/sec/cm-5, PAWP 28 mmHg. A dobutamine infusion is started. Which finding indicates a therapeutic response?",
    o: ["Cardiac index increases to 2.6 L/min/m2 and PAWP decreases to 16 mmHg", "SVR increases to 2800 dynes/sec/cm-5", "Heart rate increases from 88 to 140 beats per minute", "Blood pressure drops from 86/54 to 70/40 mmHg"],
    a: 0,
    r: "Dobutamine is a positive inotrope that increases myocardial contractility, thereby increasing cardiac output and cardiac index. As cardiac output improves, PAWP decreases because the ventricle empties more effectively, and SVR decreases due to improved perfusion. An increase in CI to 2.6 with a decrease in PAWP represents a positive therapeutic response. Excessive tachycardia and further hypotension are adverse effects.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a critically ill client and notes that the mixed venous oxygen saturation (SvO2) has dropped from 68% to 45%. Which condition could cause this decrease?",
    o: ["Increased tissue oxygen consumption such as with seizure activity or shivering", "Improvement in cardiac output", "Decreased metabolic rate from hypothermia", "Administration of supplemental oxygen via high-flow nasal cannula"],
    a: 0,
    r: "SvO2 reflects the balance between oxygen delivery and oxygen consumption. Normal SvO2 is 60-80%. A drop to 45% indicates that tissues are extracting more oxygen than usual, which can occur with increased oxygen demand (fever, shivering, seizures, pain) or decreased oxygen delivery (low cardiac output, anemia, hypoxemia). Improved cardiac output would increase SvO2. Hypothermia and supplemental oxygen would also increase SvO2.",
    s: "Cardiovascular"
  },

  // ===== SHOCK & RESUSCITATION (Questions 21-30) =====
  {
    q: "A client arrives to the emergency department after a motor vehicle collision with a BP of 82/50 mmHg, HR 128, cool and clammy skin, and altered mental status. Two large-bore IV lines are established. Which fluid should the nurse administer first?",
    o: ["Warmed isotonic crystalloid such as lactated Ringer's or normal saline", "5% dextrose in water", "Hypertonic 3% saline solution", "Packed red blood cells immediately without type and crossmatch"],
    a: 0,
    r: "In hemorrhagic/hypovolemic shock from trauma, initial fluid resuscitation begins with warmed isotonic crystalloids (LR or NS) through large-bore IV access. Warming fluids prevents hypothermia, which worsens coagulopathy. D5W is a hypotonic solution that distributes into cells and is ineffective for volume resuscitation. Hypertonic saline is used for specific indications. While blood products will be needed, crystalloid is the initial resuscitation fluid while blood is being prepared.",
    s: "Emergency"
  },
  {
    q: "A client in septic shock is receiving IV fluids and vasopressors. The nurse notes the following: MAP 58 mmHg, lactate 5.2 mmol/L, urine output 15 mL/hr. Which finding indicates the client is responding to treatment?",
    o: ["Lactate level decreasing to 2.8 mmol/L with increasing urine output", "Maintaining MAP at 58 mmHg with increased vasopressor doses", "Heart rate increasing from 110 to 130 beats per minute", "Central venous pressure increasing from 8 to 18 mmHg"],
    a: 0,
    r: "In septic shock management, lactate clearance is a key indicator of adequate tissue perfusion and response to treatment. A decreasing lactate level indicates improved tissue oxygenation. The target MAP is 65 mmHg or greater. Urine output should be at least 0.5 mL/kg/hr. Increasing vasopressor requirements, worsening tachycardia, and excessively high CVP suggest poor response. Lactate clearance of more than 10% in the first 6 hours is associated with improved outcomes.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client with suspected obstructive shock from cardiac tamponade. Which set of findings does the nurse expect?",
    o: ["Hypotension, muffled heart sounds, and jugular venous distension", "Hypotension, fever, and warm flushed skin", "Hypertension, bradycardia, and irregular respirations", "Hypotension, flat neck veins, and dry mucous membranes"],
    a: 0,
    r: "Cardiac tamponade presents with Beck's triad: hypotension (decreased cardiac output), muffled or distant heart sounds (fluid surrounding the heart), and JVD (impaired venous return). This is an obstructive shock requiring emergent pericardiocentesis. Fever with warm skin suggests distributive shock. The Cushing triad (hypertension, bradycardia, irregular respirations) indicates increased intracranial pressure. Flat neck veins with dry mucous membranes suggest hypovolemia.",
    s: "Emergency"
  },
  {
    q: "During massive transfusion protocol for a trauma client, the nurse should monitor for which life-threatening complication?",
    o: ["Hypocalcemia due to citrate toxicity from stored blood products", "Hyperkalemia from the transfused platelets", "Metabolic alkalosis from the preservative solutions", "Hypernatremia from the normal saline flushes"],
    a: 0,
    r: "During massive transfusion, citrate (the anticoagulant in stored blood) binds ionized calcium, causing hypocalcemia. Signs include tetany, prolonged QT interval, hypotension, and cardiac dysrhythmias. Calcium replacement is often necessary during massive transfusion. Hyperkalemia can occur from potassium released from lysed red blood cells in stored blood, not platelets. Metabolic alkalosis can occur when citrate is metabolized to bicarbonate but is a later finding.",
    s: "Emergency"
  },
  {
    q: "A client presents to the emergency department with anaphylactic shock after a bee sting. BP is 68/40, HR 140, widespread urticaria, and stridor. Which medication should the nurse administer first?",
    o: ["Epinephrine 0.3 mg intramuscularly in the anterolateral thigh", "Diphenhydramine 50 mg IV push", "Methylprednisolone 125 mg IV", "Albuterol nebulizer treatment"],
    a: 0,
    r: "Epinephrine is the first-line treatment for anaphylaxis and should be administered immediately. It reverses bronchospasm, increases blood pressure through vasoconstriction, and reduces histamine release. The IM route in the anterolateral thigh provides the most rapid absorption. Antihistamines and corticosteroids are second-line agents that do not reverse the acute cardiovascular and respiratory compromise. Albuterol may help with bronchospasm but does not address the systemic reaction.",
    s: "Emergency"
  },
  {
    q: "A nurse is assessing a client in neurogenic shock following a cervical spinal cord injury. Which hemodynamic findings does the nurse anticipate?",
    o: ["Hypotension with bradycardia and warm, dry skin below the level of injury", "Hypotension with tachycardia and cool, clammy skin", "Hypertension with bradycardia and diaphoresis", "Normal blood pressure with tachycardia and pallor"],
    a: 0,
    r: "Neurogenic shock results from loss of sympathetic nervous system tone due to spinal cord injury at T6 or above. Without sympathetic input, vasodilation causes hypotension, loss of cardiac acceleration causes bradycardia, and loss of vasoconstriction causes warm, dry skin below the injury. This differs from hypovolemic shock which presents with tachycardia and cool, clammy skin due to intact sympathetic compensation. Treatment includes vasopressors and judicious fluid administration.",
    s: "Emergency"
  },
  {
    q: "A client in hemorrhagic shock has received 3 liters of crystalloid fluid. The blood pressure remains 78/48 mmHg and heart rate is 132. The nurse anticipates which next intervention?",
    o: ["Initiation of blood product transfusion with packed red blood cells", "Administration of an additional 3 liters of crystalloid fluid", "Starting a dopamine infusion for blood pressure support", "Inserting a urinary catheter to monitor output"],
    a: 0,
    r: "After the initial crystalloid bolus (typically 1-2 liters) without hemodynamic improvement, the client likely has significant hemorrhage requiring blood product replacement to restore oxygen-carrying capacity. Continuing large-volume crystalloid resuscitation can worsen coagulopathy through hemodilution. Vasopressors are not first-line for hemorrhagic shock as the problem is volume loss, not vasodilation. Urinary catheter insertion is important but not the priority over definitive hemorrhage management.",
    s: "Emergency"
  },
  {
    q: "A client in the emergency department is in cardiogenic shock with pulmonary edema. Which intervention should the nurse avoid?",
    o: ["Rapid administration of IV normal saline bolus", "Administration of IV furosemide", "Placement of the client in an upright position", "Continuous monitoring of oxygen saturation"],
    a: 0,
    r: "In cardiogenic shock, the heart is unable to pump effectively, leading to fluid backup in the lungs. Administering IV fluid boluses would worsen pulmonary edema and further compromise cardiac function. Treatment focuses on reducing preload with diuretics (furosemide), positioning upright to reduce venous return to the lungs, supporting oxygenation, and potentially using inotropes to improve cardiac contractility. Volume resuscitation is appropriate for hypovolemic shock, not cardiogenic shock.",
    s: "Emergency"
  },
  {
    q: "A nurse is performing targeted temperature management (TTM) on a client after cardiac arrest and return of spontaneous circulation. Which is the target temperature range?",
    o: ["32 to 36 degrees Celsius for at least 24 hours", "36 to 38 degrees Celsius for 12 hours", "28 to 30 degrees Celsius for 48 hours", "38 to 40 degrees Celsius for 6 hours"],
    a: 0,
    r: "Current guidelines recommend targeted temperature management at 32-36 degrees Celsius for at least 24 hours for comatose adult clients with return of spontaneous circulation after cardiac arrest. TTM reduces cerebral metabolic demand, decreases reperfusion injury, and improves neurological outcomes. Temperatures below 32 degrees increase the risk of coagulopathy and arrhythmias. Hyperthermia (above 37.5 degrees) worsens neurological outcomes and should be actively prevented.",
    s: "Emergency"
  },
  {
    q: "A nurse is resuscitating a client in pulseless electrical activity (PEA). Which reversible cause should the nurse consider first based on the clinical scenario of a dialysis client who missed two treatments?",
    o: ["Hyperkalemia", "Hypovolemia", "Tension pneumothorax", "Pulmonary embolism"],
    a: 0,
    r: "PEA has several reversible causes remembered by the H's and T's. In a dialysis client who has missed treatments, hyperkalemia is the most likely cause of PEA arrest due to accumulation of potassium that the kidneys cannot excrete. Severe hyperkalemia causes widened QRS, peaked T waves, and eventually cardiac arrest. Treatment includes IV calcium chloride or gluconate, sodium bicarbonate, insulin with dextrose, and emergent dialysis. Identifying and treating reversible causes is essential during PEA management.",
    s: "Emergency"
  },

  // ===== CARDIAC EMERGENCIES & ACLS (Questions 31-40) =====
  {
    q: "During a code blue, a client is found to be in ventricular fibrillation. The defibrillator is charging. Which action should the nurse prioritize while waiting for the defibrillator?",
    o: ["Continue high-quality CPR with minimal interruptions", "Establish IV access and draw blood for laboratory analysis", "Intubate the client for definitive airway management", "Administer epinephrine 1 mg IV push"],
    a: 0,
    r: "High-quality CPR is the most important intervention in cardiac arrest and should continue with minimal interruptions until the defibrillator is ready. Compressions should be at a rate of 100-120 per minute, depth of at least 2 inches, with full chest recoil. Early defibrillation for shockable rhythms (VF/pulseless VT) is critical. Epinephrine is administered after the first or second shock. IV access and intubation are important but should not delay compressions or defibrillation.",
    s: "Cardiovascular"
  },
  {
    q: "A client presents with a wide-complex tachycardia at a rate of 180 bpm. The client is conscious with BP 100/60, mild chest discomfort, and no respiratory distress. Which intervention does the nurse anticipate?",
    o: ["IV amiodarone infusion", "Immediate synchronized cardioversion", "Vagal maneuvers followed by adenosine", "Defibrillation at 200 joules"],
    a: 0,
    r: "A stable client with wide-complex tachycardia (presumed ventricular tachycardia with a pulse) is treated with IV amiodarone per ACLS guidelines. Synchronized cardioversion is indicated if the client becomes unstable (severe hypotension, altered mental status, acute heart failure). Vagal maneuvers and adenosine are used for narrow-complex SVT. Defibrillation is used for pulseless VT or VF. The client is currently stable with adequate BP and mentation.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops torsades de pointes on the cardiac monitor. In addition to defibrillation if pulseless, which medication should the nurse prepare?",
    o: ["IV magnesium sulfate", "IV amiodarone", "IV lidocaine", "IV procainamide"],
    a: 0,
    r: "Torsades de pointes is a polymorphic ventricular tachycardia associated with prolonged QT interval. The specific treatment is IV magnesium sulfate 1-2 grams given over 5-60 minutes depending on hemodynamic stability. Magnesium helps stabilize cardiac cell membranes and shorten the QT interval. Amiodarone, lidocaine, and procainamide can further prolong the QT interval and worsen torsades. Isoproterenol or overdrive pacing may also be used.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client who received fibrinolytic therapy (alteplase) for an acute STEMI. Which assessment finding requires immediate notification of the provider?",
    o: ["Sudden onset of severe headache with altered level of consciousness", "Oozing from the IV insertion site", "Blood pressure of 138/82 mmHg", "Mild nausea 30 minutes after infusion"],
    a: 0,
    r: "Sudden severe headache with altered consciousness after fibrinolytic therapy suggests intracranial hemorrhage, which is the most serious and life-threatening complication. This requires immediate notification, discontinuation of the fibrinolytic, and emergent CT scan. Minor oozing from IV sites is expected due to the anticoagulant effect. Blood pressure of 138/82 is within acceptable limits. Mild nausea can occur but is not emergent.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a third-degree (complete) heart block has a ventricular rate of 32 bpm and is symptomatic with dizziness and near-syncope. Which intervention is the priority?",
    o: ["Apply transcutaneous pacing pads and initiate pacing", "Administer atropine 0.5 mg IV push", "Administer adenosine 6 mg rapid IV push", "Place a defibrillator and prepare for synchronized cardioversion"],
    a: 0,
    r: "Third-degree heart block with hemodynamic instability requires transcutaneous pacing as the definitive temporizing measure while awaiting transvenous pacing. Atropine may be used but is often ineffective in third-degree block because the block is below the AV node where atropine acts. Adenosine is used for SVT and would worsen bradycardia. Cardioversion is for tachyarrhythmias. Pacing provides reliable ventricular capture and rate control.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute coronary syndrome who is on a heparin infusion. The aPTT result is 120 seconds (therapeutic range 60-80 seconds). What is the priority nursing action?",
    o: ["Hold the heparin infusion and notify the provider", "Continue the infusion and recheck aPTT in 6 hours", "Administer protamine sulfate immediately", "Decrease the heparin rate by 50% and recheck in 4 hours"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range, indicating over-anticoagulation with increased risk of hemorrhage. The nurse should hold the heparin infusion and notify the provider for further orders. Protamine sulfate is the antidote for heparin but is reserved for significant bleeding, not supratherapeutic levels alone. Continuing the infusion or simply decreasing the rate would not adequately address the immediate bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A client is 2 hours post-percutaneous coronary intervention (PCI) via the right radial artery. The nurse assesses the right hand and notes it is pale, cool, and the client cannot feel the pulse oximetry probe. What should the nurse do?",
    o: ["Release or loosen the compression device on the radial artery and notify the interventional cardiologist", "Elevate the right arm above heart level and apply a warm blanket", "Document the findings and reassess in 1 hour", "Apply ice to the right wrist to reduce swelling"],
    a: 0,
    r: "After radial PCI, pallor, coolness, and numbness indicate compromised arterial blood flow to the hand, likely from excessive compression or thrombus formation at the access site. The compression device should be loosened to restore blood flow, and the interventional cardiologist should be notified immediately as vascular compromise is a time-sensitive emergency. Elevation and warming are insufficient. Delaying assessment risks permanent hand ischemia. Ice would further compromise circulation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse identifies a regular narrow-complex tachycardia at a rate of 186 bpm on the monitor. The client is alert with BP 108/70. After vagal maneuvers are unsuccessful, which medication does the nurse anticipate?",
    o: ["Adenosine 6 mg rapid IV push followed by a 20 mL normal saline flush", "Amiodarone 150 mg IV over 10 minutes", "Diltiazem 20 mg IV over 2 minutes", "Epinephrine 1 mg IV push"],
    a: 0,
    r: "A stable client with regular narrow-complex tachycardia (likely SVT) that does not respond to vagal maneuvers should receive adenosine 6 mg rapid IV push through the most proximal port, followed immediately by a 20 mL rapid NS flush. Adenosine has a half-life of less than 10 seconds and must be given rapidly. If the first dose is ineffective, 12 mg may be given. Amiodarone and diltiazem are second-line options. Epinephrine is for cardiac arrest.",
    s: "Cardiovascular"
  },
  {
    q: "During cardiac arrest management, the nurse notes the client is in asystole. Which ACLS intervention is appropriate?",
    o: ["Continue CPR and administer epinephrine 1 mg IV every 3 to 5 minutes", "Defibrillate at 360 joules", "Administer atropine 1 mg IV push", "Perform synchronized cardioversion at 100 joules"],
    a: 0,
    r: "Asystole is a non-shockable rhythm. Management includes high-quality CPR, epinephrine 1 mg IV/IO every 3-5 minutes, identifying and treating reversible causes (H's and T's), and advanced airway management. Defibrillation and cardioversion are not indicated for asystole. Atropine is no longer recommended in the ACLS asystole/PEA algorithm. The team should also consider whether resuscitation efforts should continue based on clinical circumstances.",
    s: "Cardiovascular"
  },
  {
    q: "A client with an acute anterior wall STEMI develops a new systolic murmur, hypotension, and pulmonary edema on day 3 of hospitalization. The nurse suspects which mechanical complication?",
    o: ["Ventricular septal rupture or papillary muscle rupture causing acute mitral regurgitation", "Aortic dissection extending into the coronary arteries", "Pericardial effusion from Dressler syndrome", "Development of a left ventricular aneurysm"],
    a: 0,
    r: "A new systolic murmur with hemodynamic instability 2-7 days after an MI suggests a mechanical complication: either ventricular septal rupture (VSD) causing a left-to-right shunt or papillary muscle rupture causing acute mitral regurgitation. Both present with new murmur, acute heart failure, and cardiogenic shock. Anterior wall MI is particularly associated with VSD. These are surgical emergencies requiring emergent repair. Dressler syndrome typically occurs weeks later. LV aneurysm develops gradually.",
    s: "Cardiovascular"
  },

  // ===== STROKE & NEUROLOGICAL EMERGENCIES (Questions 41-50) =====
  {
    q: "A client presents to the emergency department with sudden onset right-sided weakness, facial droop, and slurred speech. Symptom onset was 90 minutes ago. After confirming a nonhemorrhagic stroke on CT, which intervention is the priority?",
    o: ["Administer IV alteplase within the treatment window", "Start aspirin 325 mg orally immediately", "Request a neurosurgery consult for craniotomy", "Administer IV mannitol for cerebral edema"],
    a: 0,
    r: "For acute ischemic stroke, IV alteplase (tPA) is the gold standard treatment when administered within 4.5 hours of symptom onset after hemorrhagic stroke is ruled out by CT scan. This client is within the treatment window at 90 minutes. Aspirin is given 24 hours after tPA administration. Craniotomy is for hemorrhagic stroke or malignant edema. Mannitol is used for increased ICP but is not the priority over thrombolytic therapy for acute ischemic stroke.",
    s: "Neurological"
  },
  {
    q: "A nurse is monitoring a client who received IV alteplase for acute ischemic stroke. Which finding requires the nurse to stop the infusion and notify the provider immediately?",
    o: ["Development of severe headache with a sudden decrease in level of consciousness", "Blood pressure of 170/95 mmHg", "Mild gum bleeding when performing oral care", "Client reports a metallic taste in the mouth"],
    a: 0,
    r: "Severe headache with decreasing level of consciousness after tPA administration suggests hemorrhagic transformation, the most feared complication. The infusion must be stopped immediately, the provider notified, and a stat CT scan obtained. Blood pressure up to 180/105 is acceptable post-tPA. Minor bleeding (gum, IV site) is expected. A metallic taste is a known but benign side effect. Hemorrhagic transformation occurs in approximately 6% of clients receiving tPA.",
    s: "Neurological"
  },
  {
    q: "A client with a subarachnoid hemorrhage from a ruptured cerebral aneurysm is being monitored in the ICU. On day 5, the nurse notes increasing confusion, new focal neurological deficits, and decreased level of consciousness. Which complication does the nurse suspect?",
    o: ["Cerebral vasospasm", "Rebleeding of the aneurysm", "Normal pressure hydrocephalus", "Brain death"],
    a: 0,
    r: "Cerebral vasospasm is the most common cause of secondary neurological deterioration after subarachnoid hemorrhage, typically occurring between days 4-14. It causes ischemia from narrowing of cerebral blood vessels. Treatment includes nimodipine (calcium channel blocker), triple-H therapy (hypertension, hypervolemia, hemodilution), and possible endovascular intervention. Rebleeding risk is highest in the first 24 hours. Normal pressure hydrocephalus develops more gradually. Brain death presents with loss of all brainstem reflexes.",
    s: "Neurological"
  },
  {
    q: "A client is admitted with status epilepticus. After administering IV lorazepam with no response, which medication should the nurse prepare next?",
    o: ["IV fosphenytoin or phenytoin loading dose", "A second dose of IV lorazepam 30 minutes later", "IV phenobarbital as a continuous infusion", "Oral levetiracetam via nasogastric tube"],
    a: 0,
    r: "Status epilepticus management follows a stepwise protocol. First-line treatment is IV benzodiazepines (lorazepam or diazepam). If seizures continue, second-line treatment is IV fosphenytoin or phenytoin loading dose. Fosphenytoin is preferred due to fewer infusion-related side effects. If seizures persist after second-line agents, third-line treatment includes IV phenobarbital or propofol/midazolam infusion with intubation. Oral medications are not appropriate for active status epilepticus.",
    s: "Neurological"
  },
  {
    q: "A nurse is performing the National Institutes of Health Stroke Scale (NIHSS) assessment. A client with a right hemisphere stroke would most likely demonstrate which finding?",
    o: ["Left-sided neglect with inattention to the left visual field and body", "Receptive aphasia with inability to understand spoken language", "Right-sided hemiplegia with right facial droop", "Expressive aphasia with preserved comprehension"],
    a: 0,
    r: "Right hemisphere strokes characteristically cause left-sided neglect (hemispatial neglect), where the client is unaware of stimuli on the left side. Additional findings include left-sided hemiplegia, impaired spatial awareness, and emotional lability. Receptive aphasia (Wernicke's) and expressive aphasia (Broca's) are associated with left hemisphere strokes affecting dominant language centers. Right-sided deficits would occur with left hemisphere strokes.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with increased intracranial pressure (ICP). The ICP monitor reads 28 mmHg and the MAP is 82 mmHg. What is the cerebral perfusion pressure (CPP), and is it adequate?",
    o: ["CPP is 54 mmHg, which is below the target minimum of 60 mmHg", "CPP is 54 mmHg, which is within the normal range", "CPP is 110 mmHg, which is above the target range", "CPP is 28 mmHg, which requires immediate intervention"],
    a: 0,
    r: "CPP is calculated as MAP minus ICP: 82 - 28 = 54 mmHg. The target CPP is 60-70 mmHg. A CPP below 60 mmHg indicates inadequate cerebral perfusion and risks cerebral ischemia. Interventions include reducing ICP (head elevation, osmotic diuretics, CSF drainage) and maintaining adequate MAP. The ICP of 28 mmHg is also elevated (normal is less than 20 mmHg) and requires treatment.",
    s: "Neurological"
  },
  {
    q: "A client with a traumatic brain injury exhibits a Glasgow Coma Scale score of 6. The client has decorticate posturing, no eye opening to stimuli, and incomprehensible sounds. Which nursing intervention is the priority?",
    o: ["Ensure a secure airway and prepare for intubation", "Administer IV mannitol 1 g/kg", "Perform a CT scan immediately", "Insert an ICP monitoring device"],
    a: 0,
    r: "A GCS of 6 indicates severe brain injury (GCS 8 or below requires airway protection). Decorticate posturing suggests bilateral cerebral hemisphere damage. The priority is airway management because a client with this level of consciousness cannot protect their own airway and is at high risk for aspiration and hypoxia, which would further increase ICP. Intubation should be performed before other interventions. Mannitol, CT, and ICP monitoring are important but follow airway stabilization.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with bacterial meningitis in isolation. Which nursing intervention is most important to prevent transmission?",
    o: ["Maintaining droplet precautions and ensuring close contacts receive prophylactic antibiotics", "Placing the client on airborne precautions with negative pressure room", "Using contact precautions with gown and gloves only", "No isolation is required as bacterial meningitis is not communicable"],
    a: 0,
    r: "Bacterial meningitis caused by Neisseria meningitidis or Haemophilus influenzae requires droplet precautions until 24 hours after effective antibiotic therapy. Close contacts (household members, healthcare workers with direct exposure) should receive chemoprophylaxis with rifampin, ciprofloxacin, or ceftriaxone. Airborne precautions are for TB, measles, and varicella. Contact precautions alone are insufficient for respiratory pathogens.",
    s: "Neurological"
  },
  {
    q: "A nurse administers IV mannitol to a client with increased ICP. Which assessment is essential to monitor during the infusion?",
    o: ["Serum osmolality, intake and output, and electrolyte levels", "Serum glucose levels every 30 minutes", "Liver function tests before and after infusion", "Coagulation studies including PT and INR"],
    a: 0,
    r: "Mannitol is an osmotic diuretic used to reduce ICP by drawing water from brain tissue into the intravascular space. Essential monitoring includes serum osmolality (hold if greater than 320 mOsm/kg to prevent renal failure), strict intake and output (significant diuresis can cause hypovolemia), and electrolytes (particularly sodium and potassium). An indwelling urinary catheter should be in place. Mannitol does not significantly affect glucose, liver function, or coagulation.",
    s: "Neurological"
  },
  {
    q: "A client presents with the worst headache of their life, nuchal rigidity, photophobia, and a positive Kernig sign. CT scan is negative. What is the next diagnostic test the nurse should anticipate?",
    o: ["Lumbar puncture to analyze cerebrospinal fluid", "MRI of the brain with contrast", "Cerebral angiography", "Repeat CT scan in 24 hours"],
    a: 0,
    r: "The presentation is classic for subarachnoid hemorrhage (thunderclap headache, nuchal rigidity, photophobia, positive meningeal signs). CT scan sensitivity decreases with time and can miss small bleeds. When clinical suspicion is high and CT is negative, lumbar puncture is the next step to look for xanthochromia or red blood cells in the CSF, which would confirm subarachnoid hemorrhage. If positive, cerebral angiography would follow to identify the source. MRI may be helpful but LP is the standard next step.",
    s: "Neurological"
  },

  // ===== TRAUMA & BURNS (Questions 51-60) =====
  {
    q: "A client arrives to the emergency department after a house fire with facial burns, singed nasal hairs, and hoarse voice. SpO2 is 94% on room air. What is the priority nursing intervention?",
    o: ["Prepare for early endotracheal intubation before airway edema worsens", "Apply cool water to the facial burns immediately", "Obtain a carboxyhemoglobin level", "Establish two large-bore IV lines for fluid resuscitation"],
    a: 0,
    r: "Facial burns, singed nasal hairs, hoarse voice, and soot in the airway are signs of inhalation injury with potential for rapid airway edema. Early intubation is critical because progressive swelling can make later intubation impossible, and airway obstruction is the leading cause of early death in burn clients. Carboxyhemoglobin levels and fluid resuscitation are important but follow airway stabilization. Cool water should not be applied to large burns due to hypothermia risk.",
    s: "Emergency"
  },
  {
    q: "A nurse is calculating fluid resuscitation for a 70 kg adult with 40% total body surface area (TBSA) burns using the Parkland formula. What is the total volume of lactated Ringer's solution to be administered in the first 24 hours?",
    o: ["11,200 mL with half given in the first 8 hours from the time of injury", "5,600 mL given evenly over 24 hours", "11,200 mL given evenly over 24 hours", "5,600 mL with half given in the first 8 hours"],
    a: 0,
    r: "The Parkland formula calculates fluid resuscitation as 4 mL x body weight (kg) x %TBSA burned. For this client: 4 x 70 x 40 = 11,200 mL of LR in the first 24 hours. Half (5,600 mL) is given in the first 8 hours from the time of injury (not from arrival), and the remaining half over the next 16 hours. Urine output (0.5-1 mL/kg/hr in adults) is the primary indicator for adjusting the fluid rate.",
    s: "Emergency"
  },
  {
    q: "A trauma client arrives with a suspected pelvic fracture, hypotension, and abdominal distension. Which intervention should the nurse avoid?",
    o: ["Inserting a urinary catheter before ruling out urethral injury", "Applying a pelvic binder to stabilize the fracture", "Initiating large-bore IV access for fluid resuscitation", "Obtaining a type and crossmatch for blood products"],
    a: 0,
    r: "In suspected pelvic fractures, urethral injury must be ruled out before inserting a urinary catheter. Signs of urethral injury include blood at the urethral meatus, scrotal or perineal hematoma, and high-riding prostate on rectal exam. Inserting a catheter with urethral disruption can cause further injury and false passage. A retrograde urethrogram should be performed first if urethral injury is suspected. Pelvic binders, IV access, and blood product preparation are all appropriate interventions.",
    s: "Emergency"
  },
  {
    q: "A nurse is assessing a client with a circumferential full-thickness burn to the right forearm. The nurse notes absent radial pulse, pain with passive finger extension, and tense swelling of the forearm. Which intervention does the nurse anticipate?",
    o: ["Emergent escharotomy to relieve compartment pressure", "Elevation of the arm above heart level and application of ice", "Administration of IV morphine for pain management", "Debridement of the burn wound in the operating room"],
    a: 0,
    r: "Circumferential full-thickness burns form a rigid eschar that cannot expand with tissue swelling, creating a tourniquet effect that compromises circulation. Signs of compartment syndrome include absent distal pulses, pain with passive movement, paresthesia, and tense swelling. Escharotomy (incision through the eschar) is an emergent bedside procedure to release pressure and restore circulation. Ice would worsen tissue damage. Pain management is important but does not address the emergency. Debridement is not indicated for this emergency.",
    s: "Emergency"
  },
  {
    q: "A client with a suspected cervical spine injury is being managed by the trauma team. Which nursing action is essential during the initial assessment?",
    o: ["Maintain manual in-line stabilization during any airway interventions", "Logroll the client to prone position for posterior spine assessment", "Remove the cervical collar for a thorough neck examination", "Hyperextend the neck to open the airway"],
    a: 0,
    r: "Manual in-line stabilization (MILS) maintains the cervical spine in a neutral position during any manipulation, including airway management. Jaw thrust (not head tilt-chin lift) is used to open the airway without extending the neck. The cervical collar should remain in place until the spine is cleared clinically and radiographically. The client should be logrolled to supine (not prone) position, maintaining spinal alignment. Hyperextension is contraindicated with suspected cervical injury.",
    s: "Emergency"
  },
  {
    q: "A client with extensive burns is at day 3 post-injury. The nurse notes dark amber urine with a positive myoglobin test. Which complication is the nurse concerned about?",
    o: ["Acute kidney injury from myoglobin-induced tubular obstruction", "Urinary tract infection from the indwelling catheter", "Dehydration from inadequate fluid resuscitation", "Bladder tamponade from blood clots"],
    a: 0,
    r: "Myoglobinuria in burn clients results from muscle breakdown (rhabdomyolysis) due to deep tissue damage. Myoglobin precipitates in the renal tubules, causing acute tubular necrosis and acute kidney injury. Treatment includes aggressive IV fluid resuscitation to maintain urine output greater than 100 mL/hr, alkalization of urine with sodium bicarbonate to prevent myoglobin precipitation, and monitoring of serum creatine kinase levels. Dark amber or cola-colored urine is a hallmark sign.",
    s: "Emergency"
  },
  {
    q: "A nurse is triaging multiple casualties from a building collapse. Which client should the nurse assess first?",
    o: ["A client with an open chest wound making a sucking sound with each breath", "A client with a closed fracture of the left tibia who is alert and oriented", "A client with superficial lacerations and mild anxiety", "A client with no pulse, no respirations, and fixed dilated pupils who was found under heavy debris"],
    a: 0,
    r: "In mass casualty triage, an open (sucking) chest wound is an immediate life threat (RED tag) requiring emergent treatment with an occlusive dressing to prevent tension pneumothorax. The client with a closed fracture is delayed (YELLOW tag). Superficial lacerations are minor (GREEN tag). The pulseless, apneic client found under heavy debris with fixed dilated pupils is expectant/deceased (BLACK tag) in a mass casualty situation where resources must be allocated to salvageable clients.",
    s: "Emergency"
  },
  {
    q: "A client with a traumatic brain injury has clear fluid draining from the nose. The nurse tests the fluid with a glucose reagent strip, which is positive. What should the nurse do next?",
    o: ["Notify the provider as this indicates a cerebrospinal fluid leak from a basilar skull fracture", "Pack the nose with gauze to stop the drainage", "Irrigate the nares with normal saline", "Apply a nasal decongestant spray to reduce drainage"],
    a: 0,
    r: "Clear fluid from the nose (rhinorrhea) that tests positive for glucose after head trauma indicates a CSF leak from a basilar skull fracture involving the cribriform plate. CSF contains glucose while nasal mucus does not. The provider must be notified because CSF leaks increase the risk of meningitis. Never pack the nose or insert anything into the nares as this can worsen the leak or introduce infection. The head of bed should be elevated, and the client should avoid blowing the nose or straining.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client with a flail chest from blunt thoracic trauma. Which assessment finding confirms this diagnosis?",
    o: ["Paradoxical chest wall movement where the injured segment moves inward during inspiration", "Subcutaneous emphysema over the chest wall", "Tracheal deviation toward the unaffected side", "Hyperresonance to percussion on the affected side"],
    a: 0,
    r: "Flail chest occurs when three or more adjacent ribs are fractured in two or more places, creating a free-floating segment. The hallmark finding is paradoxical movement: the flail segment moves inward during inspiration and outward during expiration, opposite to normal chest wall movement. This impairs ventilation and causes hypoxia. Subcutaneous emphysema and tracheal deviation suggest pneumothorax. Hyperresonance suggests pneumothorax or emphysema.",
    s: "Emergency"
  },
  {
    q: "A client with major burns has a core temperature of 34.8 degrees Celsius despite warming measures. The nurse understands that hypothermia in burn clients is dangerous primarily because it causes which complication?",
    o: ["Impaired coagulation leading to increased bleeding and delayed wound healing", "Increased metabolic rate and hyperglycemia", "Vasodilation and flushing of the skin", "Improved oxygen delivery to tissues"],
    a: 0,
    r: "Hypothermia in burn clients is part of the lethal triad (hypothermia, acidosis, coagulopathy). Hypothermia impairs the coagulation cascade and platelet function, leading to increased bleeding, delayed wound healing, and increased infection risk. It also shifts the oxyhemoglobin dissociation curve to the left, impairing oxygen release to tissues. Hypothermia decreases (not increases) metabolic rate and causes vasoconstriction (not vasodilation). Prevention through warm environments, warm fluids, and warming blankets is essential.",
    s: "Emergency"
  },

  // ===== SEPSIS MANAGEMENT (Questions 61-70) =====
  {
    q: "A nurse is assessing a client who meets Systemic Inflammatory Response Syndrome (SIRS) criteria with a suspected infection. The provider orders a serum lactate level. Which result indicates tissue hypoperfusion requiring aggressive intervention?",
    o: ["Lactate of 4.2 mmol/L", "Lactate of 1.5 mmol/L", "Lactate of 0.8 mmol/L", "Lactate of 2.0 mmol/L"],
    a: 0,
    r: "A serum lactate level greater than or equal to 4 mmol/L indicates significant tissue hypoperfusion and is a criterion for septic shock. The Surviving Sepsis Campaign recommends measuring lactate within 1 hour and targeting normalization. A lactate greater than 2 mmol/L warrants close monitoring and may indicate sepsis. Lactate of 4 mmol/L or higher triggers the septic shock bundle including aggressive fluid resuscitation, vasopressors, and repeat lactate measurement.",
    s: "Hematology"
  },
  {
    q: "A client in the emergency department is diagnosed with sepsis. The nurse understands that which action must be completed within the first hour according to the Surviving Sepsis Campaign hour-1 bundle?",
    o: ["Obtain blood cultures before antibiotics and administer broad-spectrum antibiotics within 1 hour", "Insert a central venous catheter for CVP monitoring", "Begin total parenteral nutrition to support metabolic demands", "Obtain a CT scan of the chest and abdomen to identify the source"],
    a: 0,
    r: "The Surviving Sepsis Campaign hour-1 bundle includes: measure lactate (remeasure if initial is greater than 2 mmol/L), obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin rapid fluid resuscitation with 30 mL/kg crystalloid for hypotension or lactate 4 mmol/L or higher, and apply vasopressors if hypotensive during or after fluid resuscitation to maintain MAP 65 mmHg or higher. Central line insertion and imaging may be needed but are not part of the hour-1 bundle.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client in septic shock receiving norepinephrine. The MAP remains at 58 mmHg despite adequate fluid resuscitation and maximum norepinephrine dose. Which medication does the nurse anticipate adding?",
    o: ["Vasopressin as a second-line vasopressor", "Dopamine to increase renal perfusion", "Dobutamine as a primary vasopressor", "Phenylephrine as the only agent"],
    a: 0,
    r: "Per Surviving Sepsis guidelines, norepinephrine is the first-line vasopressor for septic shock. When MAP remains below target despite adequate norepinephrine dosing, vasopressin (up to 0.03 units/min) is recommended as the second-line agent. Vasopressin works through V1 receptors independently of adrenergic receptors. Dopamine has more adverse effects and is not preferred. Dobutamine is an inotrope, not a vasopressor, and is added for myocardial dysfunction. Phenylephrine is a third-line option.",
    s: "Hematology"
  },
  {
    q: "A nurse is initiating the sepsis resuscitation bundle. The provider orders 30 mL/kg of crystalloid. For a 80 kg client, what volume should the nurse infuse?",
    o: ["2,400 mL", "3,000 mL", "1,800 mL", "2,000 mL"],
    a: 0,
    r: "The sepsis resuscitation bundle recommends 30 mL/kg of crystalloid for clients with sepsis-induced hypotension or lactate 4 mmol/L or higher. For an 80 kg client: 30 x 80 = 2,400 mL. This should be initiated within the first hour. The nurse should reassess hemodynamic status frequently and use dynamic measures (passive leg raise, pulse pressure variation) to guide further fluid therapy. Balanced crystalloids (lactated Ringer's) may be preferred over normal saline to reduce hyperchloremic acidosis.",
    s: "Hematology"
  },
  {
    q: "A client with sepsis develops disseminated intravascular coagulation (DIC). Which set of laboratory findings does the nurse expect?",
    o: ["Elevated D-dimer, prolonged PT and aPTT, decreased fibrinogen, and thrombocytopenia", "Elevated fibrinogen, shortened PT, and elevated platelet count", "Normal D-dimer with isolated thrombocytopenia", "Elevated PT with normal aPTT and normal platelet count"],
    a: 0,
    r: "DIC involves simultaneous widespread clotting and bleeding. Clotting factors and platelets are consumed faster than they can be replaced. Characteristic lab findings include elevated D-dimer and FDP (fibrin degradation products from clot breakdown), prolonged PT and aPTT (clotting factor depletion), decreased fibrinogen (consumed in clot formation), and thrombocytopenia (platelet consumption). Treatment addresses the underlying cause and replaces blood components as needed.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with urosepsis. The client's urine output has been 10 mL/hr for the past 3 hours despite adequate fluid resuscitation. Which organ dysfunction is this finding consistent with?",
    o: ["Acute kidney injury as a component of sepsis-related organ dysfunction", "Normal post-resuscitation diuresis", "Urinary retention from the infection", "Chronic kidney disease exacerbation"],
    a: 0,
    r: "Oliguria (less than 0.5 mL/kg/hr) despite adequate fluid resuscitation in a septic client indicates sepsis-related acute kidney injury, which is a component of multi-organ dysfunction syndrome (MODS). Sepsis causes AKI through microvascular dysfunction, inflammation, and cellular injury in the kidneys. This finding should prompt the nurse to assess other organ systems, monitor renal labs (creatinine, BUN), and consider the need for renal replacement therapy if conservative measures fail.",
    s: "Hematology"
  },
  {
    q: "A nurse is monitoring a client in septic shock who is on mechanical ventilation. The provider recommends a lung-protective ventilation strategy. Which ventilator settings align with this approach?",
    o: ["Tidal volume of 6 mL/kg of ideal body weight with plateau pressure below 30 cm H2O", "Tidal volume of 12 mL/kg of actual body weight with high PEEP", "Tidal volume of 10 mL/kg with plateau pressure below 40 cm H2O", "Pressure-controlled ventilation at 35 cm H2O with 100% FiO2"],
    a: 0,
    r: "Lung-protective ventilation for ARDS and sepsis uses low tidal volumes (6 mL/kg of ideal body weight, not actual weight) to prevent ventilator-induced lung injury (VILI). Plateau pressure should be maintained below 30 cm H2O to prevent barotrauma. Higher PEEP may be used to maintain oxygenation while keeping FiO2 as low as possible. This strategy reduces mortality in ARDS by minimizing alveolar overdistension and cyclic atelectasis.",
    s: "Hematology"
  },
  {
    q: "A client with sepsis has a procalcitonin (PCT) level of 8.5 ng/mL. The nurse interprets this result as suggesting which condition?",
    o: ["Severe bacterial infection requiring antibiotic therapy", "Viral upper respiratory infection", "Inflammatory response from autoimmune disease", "Normal finding in a critically ill client"],
    a: 0,
    r: "Procalcitonin is a biomarker that rises significantly in bacterial infections and remains low in viral infections and non-infectious inflammatory conditions. A PCT level greater than 2 ng/mL strongly suggests severe bacterial infection or sepsis. At 8.5 ng/mL, this indicates a high likelihood of systemic bacterial infection requiring aggressive antibiotic therapy. PCT can also be used to guide antibiotic de-escalation when levels decrease, helping to reduce unnecessary antibiotic exposure.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with septic shock. The MAP is 68 mmHg on vasopressors, but the serum lactate remains elevated at 5.0 mmol/L. What does this finding indicate?",
    o: ["Persistent tissue hypoperfusion despite achieving the MAP target", "Adequate resuscitation with resolving shock", "Laboratory error requiring repeat testing", "Normal lactate metabolism in critical illness"],
    a: 0,
    r: "A persistently elevated lactate despite achieving the MAP target of 65 mmHg or higher indicates ongoing tissue hypoperfusion at the microcirculatory level. Lactate is produced during anaerobic metabolism when oxygen delivery to tissues is inadequate. The Surviving Sepsis Campaign recommends targeting lactate normalization as a resuscitation endpoint. Persistent elevation may indicate the need for additional interventions such as dobutamine for cardiac dysfunction or source control measures.",
    s: "Hematology"
  },
  {
    q: "A nurse suspects that a postoperative client with an abdominal wound is developing sepsis. Which early sign should alert the nurse?",
    o: ["New-onset tachycardia, fever, and altered mental status in a client who was previously oriented", "Increased appetite and requests for activity", "Decreasing white blood cell count from 12,000 to 8,000 cells/mm3", "Mild incisional pain controlled with oral acetaminophen"],
    a: 0,
    r: "Early signs of sepsis include tachycardia, fever or hypothermia, tachypnea, and altered mental status (confusion, agitation, decreased responsiveness). A previously oriented postoperative client who develops confusion with tachycardia and fever should raise immediate concern for sepsis. The nurse should obtain blood cultures, measure lactate, and notify the provider. Increasing appetite and controlled pain suggest recovery. A decreasing WBC may be normal or could indicate marrow suppression in severe sepsis.",
    s: "Hematology"
  },

  // ===== ACID-BASE & ABG INTERPRETATION (Questions 71-80) =====
  {
    q: "A client with diabetic ketoacidosis has the following ABG values: pH 7.22, PaCO2 22 mmHg, HCO3 10 mEq/L, PaO2 96 mmHg. How does the nurse interpret these results?",
    o: ["Metabolic acidosis with respiratory compensation", "Respiratory acidosis with metabolic compensation", "Mixed respiratory and metabolic acidosis", "Metabolic alkalosis with respiratory compensation"],
    a: 0,
    r: "The pH of 7.22 is acidotic. The HCO3 of 10 mEq/L is low (normal 22-26), indicating metabolic acidosis, which is the primary disorder in DKA from ketoacid accumulation. The PaCO2 of 22 mmHg is low because the lungs are compensating by hyperventilating (Kussmaul breathing) to blow off CO2 and raise the pH. If compensation were absent, the PaCO2 would be normal (35-45 mmHg). The PaO2 is normal, ruling out a respiratory component.",
    s: "Respiratory"
  },
  {
    q: "A client with COPD presents with the following ABG values: pH 7.35, PaCO2 58 mmHg, HCO3 32 mEq/L, PaO2 62 mmHg. How does the nurse interpret these results?",
    o: ["Compensated respiratory acidosis consistent with chronic CO2 retention", "Uncompensated respiratory acidosis requiring immediate intubation", "Metabolic alkalosis with respiratory compensation", "Normal ABG values for a COPD client"],
    a: 0,
    r: "The pH of 7.35 is at the lower limit of normal, indicating compensation. The elevated PaCO2 of 58 mmHg indicates CO2 retention (respiratory acidosis). The elevated HCO3 of 32 mEq/L shows the kidneys have compensated by retaining bicarbonate to normalize the pH. This is consistent with chronic COPD where the body has adapted to chronically elevated CO2. The PaO2 of 62 mmHg reflects chronic hypoxemia. This is not an emergency requiring intubation as the client has compensated over time.",
    s: "Respiratory"
  },
  {
    q: "A postoperative client who has been receiving continuous nasogastric suction has the following ABG values: pH 7.52, PaCO2 46 mmHg, HCO3 34 mEq/L. Which nursing assessment finding is consistent with this acid-base imbalance?",
    o: ["Tingling in the fingers, muscle twitching, and decreased deep tendon reflexes", "Deep rapid respirations and fruity breath odor", "Shallow respirations and drowsiness", "Cool extremities and weak thready pulse"],
    a: 0,
    r: "The ABG shows metabolic alkalosis (elevated pH, elevated HCO3 from loss of gastric acid through NG suction, PaCO2 slightly elevated as compensation). Metabolic alkalosis causes decreased ionized calcium (calcium binds more to albumin in alkalotic states), leading to neuromuscular irritability: tingling, numbness, muscle twitching, and positive Chvostek and Trousseau signs. Deep rapid breathing (Kussmaul) occurs in metabolic acidosis. Treatment includes replacing volume and electrolytes (potassium, chloride).",
    s: "Respiratory"
  },
  {
    q: "A nurse is analyzing ABG results for a client on mechanical ventilation: pH 7.28, PaCO2 62 mmHg, HCO3 25 mEq/L, PaO2 70 mmHg. What ventilator adjustment should the nurse anticipate?",
    o: ["Increase the respiratory rate or tidal volume to improve CO2 elimination", "Decrease the FiO2 to prevent oxygen toxicity", "Add PEEP to improve oxygenation", "No changes needed as the values are compensated"],
    a: 0,
    r: "The ABG shows acute respiratory acidosis: acidotic pH with elevated PaCO2 and normal HCO3 (no renal compensation yet, indicating an acute process). The client is hypoventilating and retaining CO2. Increasing the respiratory rate or tidal volume on the ventilator will increase minute ventilation and blow off more CO2, correcting the acidosis. The HCO3 is normal, ruling out metabolic compensation. The PaO2 of 70 is low but the priority is correcting the ventilation problem.",
    s: "Respiratory"
  },
  {
    q: "A client with chronic renal failure has the following ABG values: pH 7.30, PaCO2 30 mmHg, HCO3 14 mEq/L, PaO2 92 mmHg. The nurse identifies this as which acid-base disorder?",
    o: ["Partially compensated metabolic acidosis", "Fully compensated respiratory alkalosis", "Uncompensated metabolic acidosis", "Mixed acidosis"],
    a: 0,
    r: "The pH of 7.30 is acidotic (not fully compensated). The low HCO3 of 14 mEq/L indicates metabolic acidosis as the primary disorder, which is common in renal failure due to inability to excrete hydrogen ions and regenerate bicarbonate. The low PaCO2 of 30 mmHg shows respiratory compensation (hyperventilation to blow off CO2). Because the pH has not returned to normal range, this is partially compensated. Fully compensated would show a normal pH.",
    s: "Respiratory"
  },
  {
    q: "A client who attempted suicide by ingesting a large amount of aspirin presents with tinnitus, tachypnea, and confusion. The initial ABG shows pH 7.48 with a PaCO2 of 28 mmHg. The nurse anticipates which progression if untreated?",
    o: ["Mixed respiratory alkalosis and metabolic acidosis as salicylate toxicity worsens", "Continued respiratory alkalosis without metabolic involvement", "Development of isolated metabolic alkalosis", "Spontaneous resolution of acid-base disturbance"],
    a: 0,
    r: "Early salicylate toxicity causes direct stimulation of the respiratory center, producing respiratory alkalosis (initial finding). As toxicity progresses, salicylate interferes with cellular metabolism, causing accumulation of lactic acid and ketoacids, resulting in metabolic acidosis. The classic ABG pattern of aspirin overdose is mixed respiratory alkalosis and metabolic acidosis. Treatment includes alkalinization of urine with sodium bicarbonate, activated charcoal if within the ingestion window, and hemodialysis for severe toxicity.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with a pH of 7.38, PaCO2 of 24 mmHg, and HCO3 of 14 mEq/L. Which interpretation is correct?",
    o: ["Fully compensated metabolic acidosis", "Normal acid-base balance", "Fully compensated respiratory alkalosis", "Uncompensated metabolic acidosis"],
    a: 0,
    r: "The pH is within normal range (7.35-7.45), so this is fully compensated. Both PaCO2 and HCO3 are low. When the pH is on the acidotic side of 7.40 (7.38), the primary disorder is the acid-causing one. Low HCO3 causes metabolic acidosis (primary). Low PaCO2 represents respiratory compensation (hyperventilation). Since pH is at 7.38 (below 7.40), the primary disorder is metabolic acidosis with full respiratory compensation. The pH would be above 7.40 if the primary disorder were respiratory alkalosis.",
    s: "Respiratory"
  },
  {
    q: "A client with severe vomiting for 3 days presents with the following ABG values: pH 7.56, PaCO2 48 mmHg, HCO3 38 mEq/L. Which electrolyte abnormality should the nurse monitor for?",
    o: ["Hypokalemia", "Hyperkalemia", "Hypernatremia", "Hypercalcemia"],
    a: 0,
    r: "Severe vomiting causes metabolic alkalosis from loss of hydrochloric acid (HCl) from the stomach, shown by pH 7.56 and HCO3 38 mEq/L. Vomiting also causes significant potassium loss both directly (gastric fluid contains potassium) and indirectly (the kidneys excrete potassium to conserve hydrogen ions in alkalosis). Hypokalemia can cause cardiac dysrhythmias, muscle weakness, and ileus. Treatment includes potassium and chloride replacement along with volume resuscitation.",
    s: "Respiratory"
  },
  {
    q: "A nurse is evaluating an ABG from a client who was found unresponsive after a heroin overdose: pH 7.18, PaCO2 78 mmHg, HCO3 26 mEq/L, PaO2 48 mmHg. Which intervention is the immediate priority?",
    o: ["Administer naloxone and provide ventilatory support with bag-valve-mask", "Administer sodium bicarbonate IV push", "Start a high-flow nasal cannula at 15 L/min", "Obtain a chest X-ray to evaluate for aspiration pneumonia"],
    a: 0,
    r: "The ABG shows acute uncompensated respiratory acidosis with severe hypoxemia from opioid-induced respiratory depression. The normal HCO3 confirms this is acute (no renal compensation). The immediate priority is reversing the opioid effect with naloxone and providing ventilatory support. Bag-valve-mask ventilation addresses both hypoxemia and hypercapnia. Sodium bicarbonate does not address the respiratory cause. Nasal cannula alone cannot overcome the hypoventilation. Chest X-ray can wait until the client is stabilized.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client in the ICU with the following ABG: pH 7.20, PaCO2 55 mmHg, HCO3 16 mEq/L, PaO2 68 mmHg. This client most likely has which acid-base disorder?",
    o: ["Mixed respiratory and metabolic acidosis", "Compensated metabolic acidosis", "Acute respiratory acidosis only", "Metabolic acidosis with overcompensation"],
    a: 0,
    r: "Both PaCO2 is elevated (respiratory acidosis) and HCO3 is low (metabolic acidosis), and both are contributing to the low pH. In a compensated disorder, one value would be abnormal in the primary direction and the other would move in the compensating direction (both moving the same way). Here, both values are moving in the direction that worsens acidosis, indicating a mixed disorder. This could occur in a client with septic shock (lactic acidosis) and respiratory failure, or cardiac arrest.",
    s: "Respiratory"
  },

  // ===== ELECTROLYTE IMBALANCES (Questions 81-90) =====
  {
    q: "A client's serum potassium level is 6.8 mEq/L. The nurse obtains a 12-lead ECG and observes peaked T waves, widened QRS complexes, and flattened P waves. Which medication should be administered first?",
    o: ["IV calcium gluconate to stabilize the cardiac membrane", "IV insulin with dextrose to shift potassium intracellularly", "Oral sodium polystyrene sulfonate (Kayexalate) to remove potassium", "IV sodium bicarbonate to correct acidosis"],
    a: 0,
    r: "Severe hyperkalemia (greater than 6.5 mEq/L) with ECG changes is a medical emergency. IV calcium gluconate is administered first because it immediately stabilizes the cardiac cell membrane and reduces the risk of lethal arrhythmias, though it does not lower potassium levels. After cardiac stabilization, insulin with dextrose is given to shift potassium into cells. Kayexalate removes potassium from the body but takes hours to work. Sodium bicarbonate also shifts potassium intracellularly but is second to calcium.",
    s: "Renal"
  },
  {
    q: "A client with hypokalemia (K+ 2.8 mEq/L) is receiving IV potassium chloride replacement. Which nursing action is essential during the infusion?",
    o: ["Use an infusion pump and do not administer faster than 10 mEq/hr through a peripheral line", "Administer the potassium as an IV push over 5 minutes for rapid correction", "Mix the potassium in D5W to enhance absorption", "Monitor for signs of hypokalemia resolution by checking reflexes every 15 minutes"],
    a: 0,
    r: "IV potassium must always be administered via infusion pump at a controlled rate. Through a peripheral line, the maximum recommended rate is 10 mEq/hr to prevent cardiac arrhythmias and phlebitis. Higher rates (up to 20-40 mEq/hr) may be used through a central line with continuous cardiac monitoring in critical situations. IV potassium should never be given as an IV push as it can cause fatal cardiac arrest. Potassium is typically mixed in normal saline, not dextrose, as dextrose stimulates insulin release which shifts potassium intracellularly.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a client with a serum calcium level of 6.2 mg/dL. Which assessment finding does the nurse expect?",
    o: ["Positive Trousseau sign with carpopedal spasm when the blood pressure cuff is inflated", "Decreased deep tendon reflexes and muscle flaccidity", "Shortened QT interval on the ECG", "Constipation and polyuria"],
    a: 0,
    r: "Hypocalcemia (normal 8.5-10.5 mg/dL) causes increased neuromuscular excitability. Trousseau sign (carpopedal spasm with BP cuff inflation) and Chvostek sign (facial twitching with tapping over facial nerve) are classic findings. Other signs include muscle cramps, tetany, paresthesias, hyperactive deep tendon reflexes, and prolonged (not shortened) QT interval. Decreased reflexes, constipation, and polyuria are signs of hypercalcemia. Seizures can occur in severe hypocalcemia.",
    s: "Renal"
  },
  {
    q: "A client with chronic alcoholism is admitted with a serum magnesium level of 0.8 mEq/L. The nurse understands that hypomagnesemia often coexists with which other electrolyte imbalance?",
    o: ["Hypocalcemia and hypokalemia", "Hypernatremia and hyperkalemia", "Hypercalcemia and hyperphosphatemia", "Hypermagnesemia and hypochloremia"],
    a: 0,
    r: "Hypomagnesemia frequently coexists with hypocalcemia and hypokalemia because magnesium is essential for parathyroid hormone secretion (affecting calcium levels) and for maintaining potassium levels by regulating the sodium-potassium ATPase pump. Potassium replacement is often refractory until magnesium is corrected. Alcoholism is a common cause of hypomagnesemia due to poor nutrition, malabsorption, and increased renal excretion. Treatment includes IV magnesium sulfate with cardiac monitoring.",
    s: "Renal"
  },
  {
    q: "A client with heart failure is receiving IV furosemide 80 mg twice daily. The nurse monitors the morning electrolyte panel and notes sodium of 128 mEq/L. Which assessment finding should the nurse report immediately?",
    o: ["New-onset confusion, headache, and muscle weakness", "Increased thirst and dry mucous membranes", "Improved urine output and decreased peripheral edema", "Mild fatigue that improves with rest"],
    a: 0,
    r: "Hyponatremia (sodium less than 135 mEq/L) at 128 mEq/L is moderate and can cause neurological symptoms including confusion, headache, nausea, muscle weakness, and potentially seizures. These symptoms indicate cerebral edema from fluid shifting into brain cells and require immediate reporting. Loop diuretics like furosemide can cause hyponatremia through sodium loss. Increased thirst and dry mucous membranes are signs of hypernatremia. Improved edema and mild fatigue are expected therapeutic responses.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with hypernatremia (Na+ 158 mEq/L). The nurse understands that the serum sodium should be corrected at which rate to prevent cerebral edema?",
    o: ["No faster than 10 to 12 mEq/L per 24-hour period", "Rapidly within the first 4 hours to prevent seizures", "At a rate of 5 mEq/L per hour until normalized", "Correction rate does not matter as long as sodium normalizes within 48 hours"],
    a: 0,
    r: "Hypernatremia should be corrected slowly, no faster than 10-12 mEq/L per 24 hours, to prevent cerebral edema. In chronic hypernatremia, brain cells produce idiogenic osmoles to prevent dehydration. Rapid correction causes water to shift into brain cells faster than these osmoles can be cleared, resulting in cerebral edema, seizures, and potentially permanent neurological damage. The underlying cause should also be addressed (dehydration, diabetes insipidus, excess sodium intake).",
    s: "Renal"
  },
  {
    q: "A client's laboratory results show phosphorus of 6.8 mg/dL and calcium of 7.2 mg/dL. Which condition is most likely causing these findings?",
    o: ["Chronic kidney disease with impaired phosphorus excretion", "Primary hyperparathyroidism", "Vitamin D excess from supplementation", "Malabsorption syndrome"],
    a: 0,
    r: "Hyperphosphatemia with hypocalcemia is the hallmark of chronic kidney disease. The failing kidneys cannot excrete phosphorus, leading to elevated serum levels. Excess phosphorus binds calcium, causing hypocalcemia. Additionally, the kidneys cannot convert vitamin D to its active form (calcitriol), further impairing calcium absorption. Hyperparathyroidism would cause elevated calcium and low phosphorus. Vitamin D excess would raise both calcium and phosphorus. Malabsorption would cause low levels of both.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client receiving IV calcium chloride for severe symptomatic hypocalcemia. Which precaution is essential during administration?",
    o: ["Administer through a central venous catheter as infiltration causes tissue necrosis", "Administer rapidly as an IV push over 30 seconds", "Mix calcium chloride with sodium bicarbonate in the same IV line", "Monitor serum potassium only, as calcium does not affect other electrolytes"],
    a: 0,
    r: "Calcium chloride is extremely caustic and causes severe tissue necrosis if it infiltrates from a peripheral IV. It should be administered through a central line whenever possible. If peripheral administration is necessary, a large-bore IV in a large vein with careful monitoring is required. Calcium should be given slowly over 10-20 minutes with continuous cardiac monitoring (rapid administration can cause cardiac arrest). Calcium precipitates when mixed with bicarbonate. Monitor magnesium and phosphorus as well as potassium.",
    s: "Renal"
  },
  {
    q: "A client with syndrome of inappropriate antidiuretic hormone (SIADH) has a serum sodium of 118 mEq/L and is experiencing seizures. Which treatment does the nurse anticipate?",
    o: ["Administration of IV hypertonic (3%) saline with close monitoring", "Rapid IV normal saline bolus of 2 liters", "Oral fluid restriction to 500 mL per day", "Administration of IV desmopressin"],
    a: 0,
    r: "Severe symptomatic hyponatremia (sodium less than 120 mEq/L with seizures) requires cautious administration of 3% hypertonic saline to raise sodium enough to stop seizures. The goal is to raise sodium by 4-6 mEq/L in the first few hours and no more than 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome. Fluid restriction is the chronic treatment for SIADH but is insufficient in acute symptomatic hyponatremia. Normal saline may worsen SIADH. Desmopressin worsens SIADH as it mimics ADH.",
    s: "Renal"
  },
  {
    q: "A client's laboratory values show potassium of 2.6 mEq/L. The nurse reviews the ECG and expects to see which finding?",
    o: ["Flattened T waves, presence of U waves, and ST segment depression", "Peaked T waves and widened QRS complex", "Elevated ST segment and pathological Q waves", "Shortened QT interval and tall P waves"],
    a: 0,
    r: "Hypokalemia (K+ less than 3.5 mEq/L) produces characteristic ECG changes: flattened or inverted T waves, prominent U waves (small deflection after the T wave), ST segment depression, and prolonged QT interval. Severe hypokalemia can progress to life-threatening dysrhythmias including ventricular tachycardia and ventricular fibrillation. Peaked T waves and widened QRS are seen in hyperkalemia. ST elevation with Q waves indicates myocardial infarction.",
    s: "Renal"
  },

  // ===== BLOOD TRANSFUSION & REACTIONS (Questions 91-100) =====
  {
    q: "A nurse is administering packed red blood cells to a client. Within the first 15 minutes, the client develops fever, chills, flank pain, and dark-colored urine. What is the priority nursing action?",
    o: ["Stop the transfusion immediately and maintain IV access with normal saline", "Slow the transfusion rate and administer acetaminophen", "Continue the transfusion and administer diphenhydramine", "Increase the IV flow rate of the blood product"],
    a: 0,
    r: "Fever, chills, flank pain, and dark urine (hemoglobinuria) within the first 15 minutes suggest an acute hemolytic transfusion reaction, which is a life-threatening emergency caused by ABO incompatibility. The transfusion must be stopped immediately. The IV line is kept open with normal saline (new tubing) for emergency access. The blood bank must be notified, and the remaining blood with new blood and urine samples are sent for analysis. Never slow the rate or continue a suspected hemolytic reaction.",
    s: "Hematology"
  },
  {
    q: "A nurse is verifying blood products at the bedside before initiating a transfusion. Which action is part of safe transfusion practice?",
    o: ["Two registered nurses independently verify the client identity, blood type, and unit compatibility at the bedside", "One nurse verifies the blood product while the client confirms their name", "The unit clerk verifies the blood product and labels the tubing", "Verification can be completed at the nursing station before bringing the blood to the bedside"],
    a: 0,
    r: "Two licensed healthcare providers must independently verify the client's identity (name, date of birth, medical record number) against the blood product label and compatibility tag at the bedside. This includes verifying blood type, Rh factor, unit number, and expiration date. Verification must occur at the bedside, not at the nursing station, to prevent wrong-patient transfusion errors. ABO incompatibility is the most common cause of fatal transfusion reactions and is nearly always due to identification errors.",
    s: "Hematology"
  },
  {
    q: "A client receiving a blood transfusion develops urticaria, pruritus, and flushing but has stable vital signs and no respiratory distress. What should the nurse do?",
    o: ["Temporarily stop the transfusion, administer antihistamine as ordered, and resume if symptoms resolve", "Stop the transfusion permanently and return the blood to the blood bank", "Continue the transfusion at a reduced rate while monitoring", "Administer epinephrine and prepare for anaphylaxis management"],
    a: 0,
    r: "Urticaria, pruritus, and flushing without hemodynamic instability or respiratory compromise indicate a mild allergic reaction. The nurse should stop the transfusion, administer an antihistamine (diphenhydramine) as ordered, and if symptoms resolve, the transfusion may be resumed with provider approval. This is the only type of transfusion reaction where the blood may be restarted. If symptoms progress to anaphylaxis (hypotension, bronchospasm, angioedema), the transfusion must be discontinued permanently.",
    s: "Hematology"
  },
  {
    q: "A nurse is transfusing fresh frozen plasma (FFP) to a client with a coagulopathy. Which statement about FFP is correct?",
    o: ["FFP must be ABO-compatible and administered within 24 hours of thawing", "FFP does not require ABO compatibility testing", "FFP can be stored at room temperature for up to 72 hours", "FFP is used primarily to increase the hemoglobin level"],
    a: 0,
    r: "FFP contains all clotting factors and must be ABO-compatible with the recipient. Once thawed, FFP should be transfused within 24 hours as clotting factors (especially factors V and VIII) deteriorate at room temperature. FFP is used to treat coagulopathies, DIC, liver disease, warfarin reversal, and massive transfusion protocol supplementation. It does not contain red blood cells and therefore does not increase hemoglobin. FFP is stored frozen and must be thawed before use.",
    s: "Hematology"
  },
  {
    q: "A client develops transfusion-related acute lung injury (TRALI) during a blood transfusion. Which clinical findings does the nurse observe?",
    o: ["Acute respiratory distress, bilateral pulmonary infiltrates on chest X-ray, and hypoxemia within 6 hours of transfusion", "Gradual onset of pulmonary edema over 24-48 hours with elevated CVP", "Isolated bronchospasm with wheezing and no chest X-ray changes", "Right-sided heart failure with peripheral edema and hepatomegaly"],
    a: 0,
    r: "TRALI presents with acute onset of respiratory distress, bilateral pulmonary infiltrates (non-cardiogenic pulmonary edema), and severe hypoxemia within 6 hours of transfusion. Unlike transfusion-associated circulatory overload (TACO), TRALI is characterized by normal or low CVP and normal cardiac function. It is caused by donor antibodies reacting with recipient neutrophils in the pulmonary vasculature. Treatment is supportive with oxygen and ventilatory support. Diuretics are not effective as it is not fluid overload.",
    s: "Hematology"
  },
  {
    q: "A nurse needs to administer platelets to a client with thrombocytopenia and active bleeding. Which nursing consideration is correct?",
    o: ["Platelets should be administered rapidly over 15 to 30 minutes and should not be refrigerated", "Platelets must be crossmatched and administered over 4 hours", "Platelets can be mixed with lactated Ringer's solution for infusion", "Platelets must be irradiated before administration to all clients"],
    a: 0,
    r: "Platelets are administered rapidly, typically over 15-30 minutes, because they lose effectiveness quickly once out of their storage conditions. Platelets are stored at room temperature (20-24 degrees Celsius) with continuous agitation and should not be refrigerated, as cold temperatures cause platelet activation and clumping. ABO compatibility is preferred but crossmatching is not required. Only normal saline should be used with blood products; LR contains calcium that can cause clotting. Irradiation is needed only for immunocompromised clients.",
    s: "Hematology"
  },
  {
    q: "A nurse is monitoring a client who received 4 units of packed red blood cells over 12 hours. The client develops dyspnea, elevated JVP, and bilateral crackles. The blood pressure is 168/98 mmHg. Which transfusion complication does the nurse suspect?",
    o: ["Transfusion-associated circulatory overload (TACO)", "Transfusion-related acute lung injury (TRALI)", "Acute hemolytic transfusion reaction", "Febrile non-hemolytic transfusion reaction"],
    a: 0,
    r: "TACO occurs from volume overload, typically in clients with cardiac or renal compromise who receive rapid or excessive transfusion volumes. Signs include dyspnea, elevated JVP, pulmonary edema (crackles), hypertension, and elevated BNP. Unlike TRALI (which has normal CVP and normotension/hypotension), TACO presents with elevated CVP and hypertension. Treatment includes stopping the transfusion, positioning upright, administering diuretics, and providing oxygen. Prevention includes slower transfusion rates and smaller volumes.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client with type O negative blood who needs an emergency transfusion. Which statement about type O negative blood is accurate?",
    o: ["O negative is the universal red blood cell donor and can be given to any blood type in emergency situations", "O negative blood can receive any blood type", "O negative blood contains A and B antigens on the red blood cells", "O negative blood requires crossmatching before emergency administration"],
    a: 0,
    r: "Type O negative blood is the universal red blood cell donor because O type red blood cells lack both A and B antigens and Rh-negative lacks the Rh(D) antigen, meaning it will not trigger an immune response in any recipient. In emergency situations when there is no time for type and crossmatch, O negative PRBCs can be safely administered. Type O individuals can receive only type O blood (they have anti-A and anti-B antibodies). Crossmatching is bypassed in true emergencies.",
    s: "Hematology"
  },
  {
    q: "A nurse is educating a new graduate about transfusion reactions. Which statement by the new graduate indicates correct understanding of a febrile non-hemolytic transfusion reaction?",
    o: ["A temperature rise of 1 degree Celsius or more during or shortly after transfusion, treated by stopping the transfusion and administering antipyretics", "It only occurs with plasma products and never with red blood cells", "It is caused by ABO incompatibility and always requires emergent treatment", "It is prevented by administering the blood as quickly as possible"],
    a: 0,
    r: "Febrile non-hemolytic transfusion reactions (FNHTR) are the most common type of transfusion reaction, characterized by a temperature rise of 1 degree Celsius or more above baseline during or within 4 hours of transfusion. They are caused by recipient antibodies reacting with donor white blood cell antigens or cytokines in the stored product. The transfusion should be stopped, the client assessed for other reaction types, and antipyretics administered. Leukocyte-reduction filters can prevent recurrence.",
    s: "Hematology"
  },
  {
    q: "A nurse must transfuse packed red blood cells to a client. After obtaining the blood from the blood bank, the nurse understands that the transfusion must be completed within which timeframe?",
    o: ["4 hours from the time it was removed from controlled storage", "6 hours as long as the blood is kept at room temperature", "2 hours from the time the transfusion was started", "8 hours if the unit is returned to the refrigerator between units"],
    a: 0,
    r: "Packed red blood cells must be transfused within 4 hours from the time they are removed from controlled storage (blood bank refrigerator at 1-6 degrees Celsius). After 4 hours at room temperature, bacterial contamination risk increases significantly. If the transfusion cannot be started within 30 minutes of receiving the unit, it should be returned to the blood bank. Each unit should not be out of the blood bank for more than 30 minutes before hanging. Blood should never be returned to the refrigerator on the nursing unit.",
    s: "Hematology"
  }
];
