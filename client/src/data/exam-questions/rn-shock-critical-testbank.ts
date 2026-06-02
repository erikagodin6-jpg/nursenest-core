import type { ExamQuestion } from "./types";

export const rnShockCriticalTestbankQuestions: ExamQuestion[] = [
  // ===== HYPOVOLEMIC SHOCK (45 questions) =====
  {
    q: "A 25-year-old trauma patient has HR 140, BP 72/50, RR 32, and is confused. Estimated blood loss is 2200 mL. Which class of hemorrhagic shock does this represent?",
    o: ["Class I (up to 750 mL loss)", "Class II (750-1500 mL loss)", "Class III (1500-2000 mL loss)", "Class IV (>2000 mL loss)"],
    a: 3,
    r: "With >2000 mL blood loss (>40% circulating volume), marked tachycardia, severe hypotension, confusion/lethargy, and tachypnea, this patient is in Class IV hemorrhagic shock. Class IV requires immediate massive transfusion protocol activation and surgical hemorrhage control.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a hemorrhagic shock patient receiving massive transfusion. Which finding indicates the development of the 'lethal triad'?",
    o: ["Temperature 36°C, pH 7.38, INR 1.1", "Temperature 34.2°C, pH 7.18 (metabolic acidosis), INR 2.8 (coagulopathy)", "Temperature 38.5°C, pH 7.42, platelet count 180,000", "Temperature 37°C, pH 7.35, fibrinogen 350 mg/dL"],
    a: 1,
    r: "The lethal triad: hypothermia (34.2°C) + metabolic acidosis (pH 7.18) + coagulopathy (INR 2.8). Each component worsens the others. Break the cycle with active rewarming, balanced blood product transfusion (1:1:1), and treating the source of hemorrhage.",
    s: "Shock & Emergency"
  },
  {
    q: "Which assessment finding is the EARLIEST indicator of hypovolemic shock?",
    o: ["Hypotension (SBP <90 mmHg)", "Tachycardia", "Anuria", "Altered level of consciousness"],
    a: 1,
    r: "Tachycardia is the earliest compensatory sign, driven by baroreceptor-mediated sympathetic activation in response to decreased stroke volume. Hypotension is a LATE finding (>30% volume loss). In young healthy patients, tachycardia may be the only sign for a significant period.",
    s: "Shock & Emergency"
  },
  {
    q: "The nurse is monitoring a trauma patient receiving fluid resuscitation. Which finding indicates adequate resuscitation?",
    o: ["Heart rate remains 130 bpm", "Lactate clearance >10% over 6 hours", "Urine output 10 mL/hr", "Blood pressure 80/50 mmHg"],
    a: 1,
    r: "Lactate clearance >10% over 6 hours is the best indicator of adequate tissue perfusion and resuscitation response. A single lactate level is less useful than the trend. Persistent tachycardia, oliguria, and hypotension indicate ongoing inadequate resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "When administering tranexamic acid (TXA) in hemorrhagic trauma, the nurse understands that TXA must be given within:",
    o: ["30 minutes of injury", "1 hour of injury", "3 hours of injury (CRASH-2 trial evidence)", "8 hours of injury"],
    a: 2,
    r: "The CRASH-2 trial demonstrated that TXA given within 3 hours of injury reduces hemorrhagic death by approximately 30%. Administration after 3 hours may paradoxically increase mortality. Dose: 1 g IV over 10 minutes, then 1 g over 8 hours.",
    s: "Shock & Emergency"
  },
  {
    q: "Which IV access is the priority in hypovolemic shock?",
    o: ["One 20-gauge IV in the hand", "Two large-bore (14-16 gauge) peripheral IVs", "Central venous catheter only", "PICC line"],
    a: 1,
    r: "Two large-bore (14-16 gauge) peripheral IVs allow rapid volume infusion. Flow rate is determined by catheter DIAMETER (radius to the 4th power per Poiseuille's law) and LENGTH (shorter is faster). A short, wide peripheral IV can deliver fluid faster than a long, thin central line.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with penetrating abdominal trauma has active hemorrhage and BP 78/52. The surgeon is en route. What is the target blood pressure management strategy?",
    o: ["Aggressive resuscitation to achieve SBP >120 mmHg", "Permissive hypotension with SBP 80-90 mmHg until surgical hemorrhage control", "Vasopressor-only approach with no IV fluids", "No treatment until surgical control is obtained"],
    a: 1,
    r: "Permissive hypotension (SBP 80-90 mmHg) in penetrating trauma with uncontrolled hemorrhage prevents disruption of fragile clots by avoiding aggressive fluid resuscitation. Normal BP targets apply after surgical hemorrhage control. This does NOT apply to TBI patients who need MAP >80.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is Lactated Ringer's preferred over Normal Saline for large-volume resuscitation in hypovolemic shock?",
    o: ["LR has more sodium for better volume expansion", "LR avoids the hyperchloremic metabolic acidosis that occurs with large-volume NS administration", "LR is isotonic while NS is hypotonic", "LR contains glucose for energy support"],
    a: 1,
    r: "NS contains 154 mEq/L chloride (plasma normal 98-106), and large volumes cause hyperchloremic metabolic acidosis that can worsen existing shock-related acidosis. LR has a more physiologic chloride concentration, and its lactate is metabolized to bicarbonate, buffering acidosis.",
    s: "Shock & Emergency"
  },
  {
    q: "The massive transfusion protocol uses which ratio of blood products?",
    o: ["3:1:1 (pRBCs:FFP:Platelets)", "1:1:1 (pRBCs:FFP:Platelets)", "2:1:0 (pRBCs:FFP only)", "Only pRBCs without additional products"],
    a: 1,
    r: "The 1:1:1 balanced ratio (packed RBCs:FFP:platelets) most closely mimics whole blood composition and prevents dilutional coagulopathy. This approach was validated by the PROPPR trial and is the standard of care in massive transfusion protocols.",
    s: "Shock & Emergency"
  },
  {
    q: "A hypotensive trauma patient has flat neck veins. This finding is MOST consistent with which type of shock?",
    o: ["Cardiogenic shock", "Obstructive shock from tamponade", "Hypovolemic shock", "Tension pneumothorax"],
    a: 2,
    r: "Flat neck veins (absent JVD) indicate low CVP from inadequate circulating volume, characteristic of hypovolemic shock. Cardiogenic shock, tamponade, and tension pneumothorax all cause JVD from elevated venous pressures due to impaired cardiac function or obstruction.",
    s: "Shock & Emergency"
  },

  // ===== DISTRIBUTIVE SHOCK (40 questions) =====
  {
    q: "Which hemodynamic finding differentiates distributive shock from ALL other shock types?",
    o: ["Elevated cardiac output", "Low systemic vascular resistance (SVR)", "Elevated CVP", "High PAWP"],
    a: 1,
    r: "Low SVR (<800 dyn-s-cm-5) is the hallmark of distributive shock across all subtypes. Massive vasodilation causes blood pooling in dilated peripheral vasculature. Hypovolemic and cardiogenic shock have HIGH SVR from compensatory vasoconstriction. Obstructive shock has variable SVR.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient has warm, flushed skin, bounding pulses, wide pulse pressure, and low blood pressure. These findings are MOST consistent with:",
    o: ["Hypovolemic shock", "Cardiogenic shock", "Early distributive shock (warm/hyperdynamic phase)", "Late distributive shock (cold/hypodynamic phase)"],
    a: 2,
    r: "Warm flushed skin, bounding pulses, and wide pulse pressure with hypotension describe the hyperdynamic (warm) phase of distributive shock. Massive vasodilation increases cardiac output but drops SVR and MAP. If untreated, it progresses to cold shock with low CO.",
    s: "Shock & Emergency"
  },
  {
    q: "The nurse identifies that a patient's shock profile has transitioned from 'warm shock' to 'cold shock.' What hemodynamic change has occurred?",
    o: ["SVR has normalized", "Cardiac output has decreased due to myocardial depression", "CVP has decreased", "PAWP has normalized"],
    a: 1,
    r: "The transition from warm to cold shock indicates myocardial depression from circulating cardiodepressant factors (TNF-alpha, IL-1). Cardiac output falls, skin becomes cool and mottled, and the patient develops features of both distributive and cardiogenic pathophysiology. This transition carries a worse prognosis.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a C4 spinal cord injury is hypotensive with HR 46, warm dry skin, and absent sweating below the clavicles. Which type of shock is this?",
    o: ["Septic shock", "Hypovolemic shock", "Neurogenic shock", "Cardiogenic shock"],
    a: 2,
    r: "Bradycardia + hypotension + warm dry skin with loss of sweating below the injury = neurogenic shock from loss of sympathetic tone. C4 injury disrupts all thoracolumbar sympathetic outflow (T1-L2). This is the ONLY shock type with bradycardia + hypotension + warm skin.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the fixed dose of vasopressin used as adjunct vasopressor therapy in distributive shock?",
    o: ["0.01 units/min, titrated to effect", "0.03-0.04 units/min, NOT titrated", "0.1 units/min, titrated to MAP", "1 unit bolus every 4 hours"],
    a: 1,
    r: "Vasopressin is given at a FIXED dose of 0.03-0.04 units/min (NOT titrated). It acts on V1 receptors for vasoconstriction via a non-catecholamine pathway, supplementing norepinephrine in refractory distributive shock. It may allow norepinephrine dose reduction.",
    s: "Shock & Emergency"
  },

  // ===== SEPSIS & SEPTIC SHOCK (50 questions) =====
  {
    q: "The nurse is using the qSOFA score to screen a patient for sepsis. Which three criteria are assessed?",
    o: ["Temperature, heart rate, WBC count", "Respiratory rate >22, altered mentation (GCS <15), systolic BP <100 mmHg", "Lactate level, urine output, MAP", "Procalcitonin, blood cultures, CRP"],
    a: 1,
    r: "qSOFA is a rapid bedside screening tool requiring NO laboratory tests: (1) RR >22, (2) Altered mentation (GCS <15), (3) SBP <100 mmHg. A score >=2 indicates high risk for poor outcomes and should prompt further evaluation for organ dysfunction.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse suspects a patient has sepsis. According to the Surviving Sepsis Campaign Hour-1 Bundle, which actions should be completed within 1 hour?",
    o: ["CT scan, urinalysis, antibiotics, IV fluids", "Lactate measurement, blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid if hypotensive, vasopressors if needed", "CBC, CMP, chest X-ray, supplemental oxygen, Foley catheter", "Blood cultures, wait for results, then targeted antibiotics"],
    a: 1,
    r: "The Hour-1 Bundle mandates within 1 hour: (1) Measure lactate, (2) Obtain blood cultures BEFORE antibiotics, (3) Administer broad-spectrum antibiotics, (4) Begin 30 mL/kg crystalloid for hypotension or lactate >4, (5) Apply vasopressors if MAP remains <65 during/after fluids.",
    s: "Shock & Emergency"
  },
  {
    q: "A septic patient has blood cultures drawn and broad-spectrum antibiotics ordered. The nurse was unable to obtain the second set of blood cultures. What should the nurse do?",
    o: ["Wait for the second set before giving antibiotics", "Administer the antibiotics immediately; do NOT delay >45 minutes for cultures", "Cancel the antibiotics until cultures are complete", "Request a central line for blood culture access"],
    a: 1,
    r: "Antibiotics must NOT be delayed more than 45 minutes for culture collection. Each hour delay increases mortality by 7.6% in septic shock. If IV access is difficult, give antibiotics and draw cultures simultaneously or from different sites.",
    s: "Shock & Emergency"
  },
  {
    q: "Which vasopressor is the FIRST-LINE agent for septic shock per the Surviving Sepsis Campaign?",
    o: ["Dopamine", "Phenylephrine", "Norepinephrine", "Epinephrine"],
    a: 2,
    r: "Norepinephrine is the first-line vasopressor. Its combined alpha-1 (vasoconstriction to restore SVR) and beta-1 (cardiac support) effects make it ideal for septic shock. Dopamine has more arrhythmic risk. Vasopressin or epinephrine are added as second-line agents.",
    s: "Shock & Emergency"
  },
  {
    q: "What serum lactate level defines sepsis-induced tissue hypoperfusion that warrants fluid resuscitation?",
    o: ["Lactate >1 mmol/L", "Lactate >2 mmol/L", "Lactate >4 mmol/L", "Lactate >10 mmol/L"],
    a: 2,
    r: "Lactate >4 mmol/L indicates severe tissue hypoperfusion and triggers aggressive fluid resuscitation (30 mL/kg crystalloid). Lactate >2 mmol/L defines sepsis-related hypoperfusion. The goal is >10% lactate clearance within 6 hours of resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with septic shock remains hypotensive despite 30 mL/kg crystalloid and norepinephrine at 20 mcg/min. The nurse anticipates which intervention?",
    o: ["Another 30 mL/kg crystalloid bolus", "Addition of vasopressin 0.03 units/min and stress-dose hydrocortisone 200 mg/day", "Switching to oral antibiotics", "Discontinuing vasopressors"],
    a: 1,
    r: "For refractory septic shock (unresponsive to fluids + first-line vasopressor), guidelines recommend adding vasopressin as second-line vasopressor and stress-dose hydrocortisone (200 mg/day IV) to enhance vascular catecholamine sensitivity and address relative adrenal insufficiency.",
    s: "Shock & Emergency"
  },
  {
    q: "The Sepsis-3 definition of septic shock includes which TWO criteria?",
    o: ["Fever >38.5°C and WBC >15,000", "Vasopressors needed to maintain MAP >65 mmHg AND lactate >2 mmol/L despite adequate fluid resuscitation", "Positive blood cultures and hypotension", "SIRS criteria met and tachycardia >110"],
    a: 1,
    r: "Septic shock = sepsis PLUS persistent hypotension requiring vasopressors to maintain MAP >=65 mmHg AND lactate >2 mmol/L despite adequate volume resuscitation. This identifies the subset with >40% mortality requiring the most aggressive management.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notes that a septic patient's skin has changed from warm and flushed to cool, mottled, and pale. What does this transition indicate?",
    o: ["The patient is improving", "Transition from warm (hyperdynamic) to cold (hypodynamic) shock indicating myocardial depression", "The antibiotics are working", "Normal hemodynamic fluctuation"],
    a: 1,
    r: "Transition from warm to cold shock indicates myocardial depression from circulating cardiodepressant factors (TNF-alpha, IL-1), decreased cardiac output, and worsening prognosis. The nurse should immediately report this change and anticipate escalation of hemodynamic support.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the most common source of infection leading to sepsis?",
    o: ["Urinary tract infection", "Pneumonia (respiratory tract infection)", "Skin and soft tissue infection", "Central line-associated bloodstream infection"],
    a: 1,
    r: "Pneumonia is the most common source of sepsis, followed by urinary tract infection, intra-abdominal infection, and skin/soft tissue infection. Identifying the source is critical for appropriate antibiotic selection and source control measures.",
    s: "Shock & Emergency"
  },
  {
    q: "Which procalcitonin level trend supports de-escalation of antibiotics in a recovering sepsis patient?",
    o: ["Rising procalcitonin", "Procalcitonin declining by >80% from peak or to <0.5 ng/mL", "Stable procalcitonin", "Procalcitonin >10 ng/mL"],
    a: 1,
    r: "Declining procalcitonin (>80% decrease from peak or absolute value <0.5 ng/mL) supports antibiotic de-escalation in recovering sepsis. Procalcitonin is produced by thyroid C cells and hepatocytes in response to bacterial infection and decreases as infection resolves.",
    s: "Shock & Emergency"
  },

  // ===== ANAPHYLACTIC SHOCK (40 questions) =====
  {
    q: "A patient develops urticaria, wheezing, facial swelling, and BP 68/38 three minutes after IV ceftriaxone. What is the FIRST nursing action?",
    o: ["Administer diphenhydramine 50 mg IV", "Stop the ceftriaxone AND administer epinephrine 0.3-0.5 mg IM into the anterolateral thigh", "Prepare for intubation", "Start a normal saline bolus"],
    a: 1,
    r: "The first actions are: STOP the allergen (ceftriaxone) AND administer epinephrine IM immediately. Epinephrine is the ONLY first-line treatment addressing all pathophysiology: vasoconstriction, bronchodilation, and mast cell stabilization. Antihistamines are adjuncts only.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is epinephrine given IM into the anterolateral thigh rather than subcutaneously?",
    o: ["The thigh is more accessible", "IM injection into the vastus lateralis provides faster and more reliable absorption than subcutaneous", "The deltoid cannot be used for epinephrine", "SC injection is contraindicated in anaphylaxis"],
    a: 1,
    r: "IM injection into the anterolateral thigh (vastus lateralis) provides faster peak plasma levels than subcutaneous injection due to better blood supply in muscle tissue. Studies show IM epinephrine reaches peak levels in 8-10 minutes vs 30+ minutes for SC.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a known peanut allergy accidentally eats peanut butter. They have hives and lip swelling but stable vital signs. What medication should the nurse administer?",
    o: ["Diphenhydramine only - epinephrine is only for severe reactions", "Epinephrine 0.3-0.5 mg IM immediately - anaphylaxis can rapidly progress to cardiovascular collapse", "Methylprednisolone only", "Observe without treatment since vital signs are stable"],
    a: 1,
    r: "Anaphylaxis can progress rapidly from mild skin symptoms to cardiovascular collapse within minutes. Epinephrine should be given at the FIRST sign of anaphylaxis (skin + any other system involvement). Delaying epinephrine is the most common cause of death from anaphylaxis.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient treated for anaphylaxis with epinephrine has complete symptom resolution within 30 minutes. The patient wants to go home. The nurse should:",
    o: ["Discharge the patient with an EpiPen prescription", "Keep the patient for minimum 4-6 hours observation due to risk of biphasic reaction", "Discharge after 1 hour of observation", "Discharge with oral antihistamines only"],
    a: 1,
    r: "Biphasic anaphylaxis occurs in 5-20% of cases, typically 4-12 hours after initial resolution. All patients must be observed for minimum 4-6 hours after treatment. Severe cases (requiring multiple epinephrine doses or IV epinephrine) warrant 24-hour observation.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on atenolol (beta-blocker) develops anaphylaxis that is not responding to epinephrine. What rescue medication should the nurse prepare?",
    o: ["Additional diphenhydramine", "Glucagon 1-5 mg IV", "Amiodarone", "Atropine"],
    a: 1,
    r: "Glucagon bypasses blocked beta receptors via a non-adrenergic mechanism (activates adenylyl cyclase directly), increasing cardiac output and providing bronchodilation. It is the rescue medication for beta-blocker-resistant anaphylaxis: 1-5 mg IV bolus, may repeat or infuse.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the epinephrine dose and concentration for IM injection in adult anaphylaxis?",
    o: ["0.1 mg of 1:10,000 concentration", "0.3-0.5 mg of 1:1,000 (1 mg/mL) concentration IM", "1 mg of 1:1,000 concentration IV", "5 mg of 1:10,000 concentration IM"],
    a: 1,
    r: "IM epinephrine in anaphylaxis: 0.3-0.5 mg of 1:1,000 concentration (1 mg/mL). The 1:10,000 concentration (0.1 mg/mL) is for IV/cardiac arrest use. Confusion between these concentrations can cause significant dosing errors.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is it important to position an anaphylactic patient SUPINE with legs elevated (unless respiratory distress is severe)?",
    o: ["To prevent aspiration", "Supine positioning maximizes venous return; standing/sitting can cause fatal 'empty ventricle syndrome' from venous pooling", "To improve epinephrine absorption", "To reduce urticaria"],
    a: 1,
    r: "During anaphylaxis, massive vasodilation allows blood to pool in the lower extremities. Standing or sitting can cause fatal cardiovascular collapse (empty ventricle syndrome) as blood pools away from the heart. Supine position with legs elevated optimizes venous return. Exception: sit upright if severe respiratory distress.",
    s: "Shock & Emergency"
  },
  {
    q: "Which laboratory test confirms anaphylaxis retrospectively?",
    o: ["IgE level", "Serum tryptase drawn within 1-3 hours of symptom onset", "CRP level", "Complement C3/C4 levels"],
    a: 1,
    r: "Serum tryptase peaks 1-2 hours after anaphylaxis onset and confirms mast cell degranulation. Draw within 1-3 hours. Level >11.4 ng/mL supports diagnosis. Comparison with a baseline tryptase (drawn at least 24 hours later) increases diagnostic accuracy.",
    s: "Shock & Emergency"
  },

  // ===== NEUROGENIC SHOCK (35 questions) =====
  {
    q: "Which vital sign pattern is UNIQUE to neurogenic shock?",
    o: ["Tachycardia and hypotension", "Bradycardia and hypertension", "Bradycardia and hypotension with warm, dry skin", "Tachycardia and hypertension"],
    a: 2,
    r: "Bradycardia + hypotension + warm dry skin is the UNIQUE triad of neurogenic shock. All other shock types present with compensatory tachycardia. The bradycardia results from loss of sympathetic cardiac accelerator fibers (T1-T4), leaving parasympathetic (vagal) tone unopposed.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a T3 spinal cord injury has HR 42 and is symptomatic. Which medication should the nurse administer?",
    o: ["Norepinephrine", "Atropine 0.5 mg IV", "Epinephrine SC", "Dopamine"],
    a: 1,
    r: "Atropine blocks vagal (parasympathetic) stimulation at the SA node, increasing heart rate for symptomatic bradycardia. 0.5 mg IV every 3-5 minutes (max 3 mg total). If atropine fails, transcutaneous or transvenous pacing may be needed for persistent symptomatic bradycardia.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is the MAP target higher (85-90 mmHg) in neurogenic shock from spinal cord injury compared to standard shock management (MAP >65)?",
    o: ["To prevent headaches", "Higher MAP maintains spinal cord perfusion pressure, preventing secondary ischemic injury to the cord", "To compensate for bradycardia", "Standard protocol for all spinal injuries"],
    a: 1,
    r: "A higher MAP target of 85-90 mmHg is required in acute SCI to maintain adequate spinal cord perfusion pressure and prevent secondary ischemic cord injury. The injured cord is particularly vulnerable to ischemia during the acute phase.",
    s: "Shock & Emergency"
  },
  {
    q: "A trauma patient has hypotension and cool, clammy skin. Another patient has hypotension with warm, dry skin and bradycardia. What are the likely shock types?",
    o: ["Both have hypovolemic shock", "Patient 1: hypovolemic shock; Patient 2: neurogenic shock", "Both have neurogenic shock", "Patient 1: neurogenic shock; Patient 2: hypovolemic shock"],
    a: 1,
    r: "Patient 1 (cool, clammy skin + hypotension) = hypovolemic shock from blood loss with compensatory vasoconstriction. Patient 2 (warm, dry skin + bradycardia + hypotension) = neurogenic shock from loss of sympathetic tone. In trauma, ALWAYS rule out hemorrhage first.",
    s: "Shock & Emergency"
  },
  {
    q: "Why must neurogenic shock be a diagnosis of exclusion in trauma patients?",
    o: ["It is the most common type of shock in trauma", "Hemorrhagic shock is more common and immediately life-threatening; it must be ruled out before attributing hypotension to neurogenic cause", "Neurogenic shock is always mild", "It is impossible to diagnose in the field"],
    a: 1,
    r: "In trauma, hemorrhagic shock is far more common and immediately life-threatening. A spinal cord-injured patient can also have intra-abdominal hemorrhage. Assuming hypotension is 'just neurogenic' without excluding hemorrhage can be fatal. FAST exam and trauma workup should proceed simultaneously.",
    s: "Shock & Emergency"
  },

  // ===== OBSTRUCTIVE SHOCK (35 questions) =====
  {
    q: "A trauma patient has JVD, hypotension, and muffled heart sounds. What is the MOST likely diagnosis?",
    o: ["Tension pneumothorax", "Cardiac tamponade", "Hypovolemic shock", "Septic shock"],
    a: 1,
    r: "Beck's triad (JVD + hypotension + muffled heart sounds) is pathognomonic for cardiac tamponade. Fluid in the pericardial space compresses the heart, impairing filling and reducing cardiac output. Emergency pericardiocentesis is the definitive treatment.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on mechanical ventilation suddenly develops absent breath sounds on the left, tracheal deviation to the right, hypotension, and JVD. The nurse should:",
    o: ["Obtain a stat chest X-ray", "Immediately notify the provider and prepare for needle decompression at the 2nd ICS, left midclavicular line", "Increase the ventilator FiO2", "Suction the endotracheal tube"],
    a: 1,
    r: "This is tension pneumothorax (absent breath sounds + tracheal deviation away from affected side + JVD + hypotension). It is a CLINICAL diagnosis requiring immediate needle decompression. Do NOT wait for imaging. Positive pressure ventilation can worsen tension pneumothorax rapidly.",
    s: "Shock & Emergency"
  },
  {
    q: "Which hemodynamic finding is shared by ALL three causes of obstructive shock (tamponade, tension pneumothorax, massive PE)?",
    o: ["Low SVR", "Elevated CVP (JVD) with decreased cardiac output", "Elevated PAWP", "Bradycardia"],
    a: 1,
    r: "All three causes impair cardiac filling or ejection, causing blood to back up into the venous system (elevated CVP = JVD) while cardiac output falls. This differentiates obstructive shock from hypovolemic shock (where CVP is low due to volume depletion).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the hemodynamic hallmark of cardiac tamponade on PA catheter readings?",
    o: ["Low PAWP with high CO", "Equalization of diastolic pressures: RA = RV diastolic = PA diastolic = PAWP", "High PAWP with low SVR", "Normal pressures with high CO"],
    a: 1,
    r: "Equalization of diastolic pressures (RA ≈ RV diastolic ≈ PA diastolic ≈ PAWP) is pathognomonic for cardiac tamponade. Pericardial fluid compresses all chambers equally, preventing filling and creating equal pressures across all chambers in diastole.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient develops sudden dyspnea, pleuritic chest pain, hypotension, and JVD. The ECG shows S1Q3T3 pattern. The nurse suspects:",
    o: ["Acute MI", "Massive pulmonary embolism", "Cardiac tamponade", "Pneumothorax"],
    a: 1,
    r: "Sudden dyspnea + pleuritic chest pain + hypotension + JVD + S1Q3T3 on ECG = massive pulmonary embolism causing obstructive shock. The clot obstructs pulmonary outflow, causing acute RV failure. Treatment: systemic thrombolysis (alteplase) or catheter-directed therapy.",
    s: "Shock & Emergency"
  },
  {
    q: "Why should positive pressure ventilation be avoided or minimized in cardiac tamponade?",
    o: ["It can cause cardiac arrhythmias", "PPV further reduces venous return to an already compressed heart, worsening hemodynamic compromise", "PPV is too expensive", "PPV causes pericardial inflammation"],
    a: 1,
    r: "Positive pressure ventilation increases intrathoracic pressure, which reduces venous return (preload). In cardiac tamponade, the heart is already compressed and underfilled. Reducing preload further can cause cardiovascular collapse. Spontaneous breathing is preferred if possible.",
    s: "Shock & Emergency"
  },

  // ===== MODS (35 questions) =====
  {
    q: "A septic patient has PaO2/FiO2 ratio of 180, platelets 75,000, creatinine 2.8 (baseline 0.9), and requires norepinephrine at 12 mcg/min. Using SOFA criteria, how many organ systems are failing?",
    o: ["2 organ systems", "3 organ systems", "4 organ systems", "5 organ systems"],
    a: 2,
    r: "Four systems: (1) Respiratory - PaO2/FiO2 180 = moderate ARDS, (2) Hematologic - platelets 75,000 = SOFA 2, (3) Renal - creatinine 2.8 from 0.9 baseline = significant AKI, (4) Cardiovascular - norepinephrine requirement. With 4 failing organs, mortality exceeds 80%.",
    s: "Shock & Emergency"
  },
  {
    q: "What tidal volume should be set for lung-protective ventilation in ARDS associated with MODS?",
    o: ["10-12 mL/kg actual body weight", "8-10 mL/kg ideal body weight", "6 mL/kg ideal body weight with plateau pressure <30 cmH2O", "4 mL/kg actual body weight"],
    a: 2,
    r: "ARDSNet protocol: 6 mL/kg IDEAL body weight (not actual) with plateau pressure <30 cmH2O and optimized PEEP. This lung-protective strategy reduces ventilator-induced lung injury (VILI) and is the single most impactful intervention proven to reduce ARDS mortality.",
    s: "Shock & Emergency"
  },
  {
    q: "Which organ system typically fails FIRST in the progression of MODS?",
    o: ["Renal system", "Hepatic system", "Respiratory system (ARDS)", "Neurological system"],
    a: 2,
    r: "The lungs are typically first to fail, manifesting as ARDS with declining PaO2/FiO2 ratio and bilateral infiltrates. The typical progression: respiratory → cardiovascular → renal → hepatic → hematologic → neurological. Each additional system failure increases mortality by 15-20%.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with MODS has escalating vasopressor requirements, worsening PaO2/FiO2 ratio, and rising creatinine. The family asks about prognosis. The nurse understands that:",
    o: ["Most patients with 3+ failing organs survive with aggressive treatment", "Mortality exceeds 60-70% with 3 or more failing organs, making goals-of-care discussions essential", "Prognosis cannot be estimated from organ failure counts", "All MODS patients fully recover with ICU care"],
    a: 1,
    r: "MODS mortality: 1 organ ~20%, 2 organs ~40%, 3 organs ~60-70%, 4+ organs >80%. Early, honest goals-of-care discussions help families make informed decisions about treatment intensity, code status, and comfort measures.",
    s: "Shock & Emergency"
  },
  {
    q: "What does the 'two-hit' model of MODS describe?",
    o: ["Two different medications causing organ failure", "An initial insult primes inflammation; a second insult triggers disproportionate systemic inflammatory response leading to organ failure", "Two patients developing MODS simultaneously", "MODS always involves exactly two organs"],
    a: 1,
    r: "The two-hit model: (1) Initial insult (trauma, infection) activates and primes the innate immune system, (2) A subsequent insult (aspiration, surgery, secondary infection) triggers a disproportionately massive inflammatory cascade leading to progressive organ failure. Prevention of the second hit is key.",
    s: "Shock & Emergency"
  },

  // ===== BURNS (45 questions) =====
  {
    q: "A 70 kg patient sustains 45% TBSA burns at 1200. Using the Parkland Formula, what volume of LR should be infused in the first 8 hours?",
    o: ["6,300 mL (half the 24-hour total)", "12,600 mL (total 24-hour volume)", "3,150 mL", "25,200 mL"],
    a: 0,
    r: "Parkland: 4 mL × 70 kg × 45% = 12,600 mL/24 hours. Half (6,300 mL) given in first 8 hours FROM TIME OF INJURY (1200-2000). Remaining half over 16 hours. Titrate to urine output 0.5-1 mL/kg/hr, not a fixed volume.",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient's wound appears blistered, moist, pink-red, and extremely painful. What depth is this burn?",
    o: ["Superficial (1st degree)", "Superficial partial-thickness (2nd degree)", "Full-thickness (3rd degree)", "4th degree"],
    a: 1,
    r: "Blisters + moist pink-red base + SEVERE pain = superficial partial-thickness (2nd degree). The epidermis and superficial dermis are damaged, but deep dermis with nerve endings and epidermal appendages (hair follicles, sweat glands) remain intact, allowing re-epithelialization.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with facial burns arrives alert and talking but has singed nasal hairs, hoarseness, and carbonaceous sputum. What is the PRIORITY nursing action?",
    o: ["Calculate TBSA using Rule of Nines", "Prepare for EARLY endotracheal intubation before airway edema progresses", "Apply silver sulfadiazine to the facial burns", "Start IV morphine for pain"],
    a: 1,
    r: "Singed nasal hairs + hoarseness + carbonaceous sputum = inhalation injury with impending airway edema. Intubate EARLY while the patient is still talking and the airway is patent. Supraglottic edema can progress to complete obstruction within hours, making later intubation impossible.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is pulse oximetry UNRELIABLE in patients with carbon monoxide (CO) poisoning from inhalation injury?",
    o: ["CO destroys the pulse oximeter", "Standard pulse oximetry reads carboxyhemoglobin (COHb) as oxyhemoglobin, giving FALSELY NORMAL SpO2 readings", "CO interferes with arterial blood flow", "Pulse oximetry only works on non-burned digits"],
    a: 1,
    r: "Standard pulse oximetry cannot distinguish COHb from OxyHb because they have similar light absorption at the two wavelengths used. SpO2 reads falsely normal even with severe CO poisoning. Confirm with CO-oximetry ABG. Treat with 100% O2 via non-rebreather mask.",
    s: "Shock & Emergency"
  },
  {
    q: "The nurse is preparing to administer silver sulfadiazine (Silvadene) to a burn patient. Which assessment finding should prompt the nurse to contact the provider before applying?",
    o: ["The burn is on the patient's leg", "The patient reports a SULFA ALLERGY", "The patient's temperature is 37.5°C", "The wound has mild serous drainage"],
    a: 1,
    r: "Silver sulfadiazine contains a sulfonamide component. Patients with sulfa allergy should NOT receive this medication. Alternative topical agents include mafenide acetate (Sulfamylon, but also contains sulfa), silver-containing dressings, or bacitracin. Also avoid in pregnancy and neonates.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient has circumferential full-thickness burns to the chest and is developing respiratory distress. What emergency procedure should the nurse prepare for?",
    o: ["Chest tube insertion", "Escharotomy of the chest wall", "Thoracentesis", "Mechanical ventilation only"],
    a: 1,
    r: "Circumferential full-thickness chest burns create a rigid eschar that restricts chest wall expansion, impairing ventilation. Escharotomy (incision through the non-elastic eschar) releases the constriction and restores chest wall compliance. This is a bedside emergency procedure.",
    s: "Shock & Emergency"
  },
  {
    q: "What is 'fluid creep' in burn resuscitation and why is it dangerous?",
    o: ["Fluid leaking from IV sites", "Over-resuscitation beyond the calculated Parkland volume, causing pulmonary edema, abdominal compartment syndrome, and extremity compartment syndrome", "Fluid moving too slowly through IV tubing", "Under-resuscitation causing hypovolemia"],
    a: 1,
    r: "Fluid creep occurs when actual fluid administered significantly exceeds the calculated Parkland requirement. Over-resuscitation causes pulmonary edema, abdominal compartment syndrome, and extremity compartment syndrome. Titrate to urine output (0.5-1 mL/kg/hr), not a fixed volume.",
    s: "Shock & Emergency"
  },
  {
    q: "Using the Rule of Nines for an adult, what is the TBSA for burns involving both entire legs and the perineum?",
    o: ["27%", "36%", "37%", "45%"],
    a: 2,
    r: "Rule of Nines: each entire leg = 18% × 2 = 36% + perineum 1% = 37% TBSA. Each leg has anterior (9%) and posterior (9%) surfaces equaling 18%. The Rule of Nines is modified for children (head is larger, legs are proportionally smaller).",
    s: "Shock & Emergency"
  },

  // ===== STATUS EPILEPTICUS (40 questions) =====
  {
    q: "A patient has been seizing for 3 minutes. At what point should the nurse administer first-line antiseizure medication?",
    o: ["At 30 minutes", "At 20 minutes", "At 5 minutes (or if still seizing when intervention is possible)", "Only after EEG confirmation"],
    a: 2,
    r: "The current definition of status epilepticus uses a 5-minute threshold for treatment. If a seizure has not terminated by 5 minutes, benzodiazepines should be administered. GABA-A receptor internalization begins almost immediately, so earlier treatment has higher success rates.",
    s: "Shock & Emergency"
  },
  {
    q: "Which benzodiazepine is PREFERRED for IV treatment of status epilepticus due to its longer antiseizure duration?",
    o: ["Diazepam (Valium)", "Lorazepam (Ativan)", "Midazolam (Versed)", "Clonazepam (Klonopin)"],
    a: 1,
    r: "IV lorazepam is preferred because it has a longer duration of antiseizure effect (12-24 hours) compared to diazepam (15-20 minutes of antiseizure effect despite longer sedation). Dose: 0.1 mg/kg (max 4 mg), may repeat once after 5 minutes.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient is actively seizing and has no IV access. Which medication should the nurse administer?",
    o: ["IV phenytoin", "IM midazolam 10 mg", "IV lorazepam", "Oral valproic acid"],
    a: 1,
    r: "IM midazolam 10 mg (for adults >40 kg) is the treatment when IV access is unavailable. The RAMPART trial showed IM midazolam was as effective as IV lorazepam when IV access was delayed. Do NOT delay treatment to establish IV access during active seizures.",
    s: "Shock & Emergency"
  },
  {
    q: "After first-line benzodiazepine fails to terminate status epilepticus, which second-line agent should the nurse prepare?",
    o: ["Repeat benzodiazepine indefinitely", "Fosphenytoin 20 mg PE/kg, valproate 40 mg/kg, OR levetiracetam 60 mg/kg", "Propofol infusion as second-line", "Phenobarbital IM"],
    a: 1,
    r: "Second-line agents (given if seizure continues after first-line): IV fosphenytoin 20 mg PE/kg (max 150 mg PE/min), IV valproate 40 mg/kg, or IV levetiracetam 60 mg/kg. The choice depends on the patient's history and contraindications. This should be given within 20 minutes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the FIRST assessment the nurse should perform when a patient begins seizing?",
    o: ["Perform EEG", "Check bedside blood glucose immediately", "Obtain CT scan of the head", "Draw antiepileptic drug levels"],
    a: 1,
    r: "Bedside glucose (finger stick) must be checked IMMEDIATELY. Hypoglycemia is a rapidly reversible cause of seizures; administering D50W 50 mL IV can stop the seizure if glucose is <60 mg/dL. This should be done simultaneously with safety measures and medication administration.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse witnesses a patient having a tonic-clonic seizure. Which nursing actions are appropriate? Select the BEST answer.",
    o: ["Restrain the patient and insert an oral airway", "Protect from injury (clear area, pad if possible), position on side, time the seizure, do NOT insert anything in mouth, suction as needed", "Perform chest compressions", "Administer oral medications immediately"],
    a: 1,
    r: "During a seizure: protect from injury (clear hard objects, pad surfaces), position on side when possible (prevent aspiration), time the seizure precisely, do NOT restrain or insert anything in mouth (causes injury), provide oxygen, and suction secretions as needed.",
    s: "Shock & Emergency"
  },
  {
    q: "Why should thiamine be given BEFORE dextrose in a seizing patient with suspected alcohol use disorder?",
    o: ["Thiamine enhances dextrose absorption", "Glucose administration without thiamine can precipitate or worsen Wernicke encephalopathy by depleting remaining thiamine stores", "Thiamine stops seizures directly", "Dextrose inhibits thiamine absorption"],
    a: 1,
    r: "Thiamine (vitamin B1) is a cofactor for glucose metabolism. Administering glucose to a thiamine-depleted patient (chronic alcohol use, malnutrition) accelerates thiamine consumption, potentially precipitating or worsening Wernicke encephalopathy (confusion, ophthalmoplegia, ataxia).",
    s: "Shock & Emergency"
  },
  {
    q: "What is non-convulsive status epilepticus (NCSE) and how is it detected?",
    o: ["A brief seizure with rapid recovery; detected by clinical exam", "Ongoing seizure activity presenting as altered consciousness WITHOUT convulsions; requires continuous EEG for diagnosis", "A type of seizure that only occurs during sleep", "Absence seizures in children only"],
    a: 1,
    r: "NCSE presents as altered consciousness, confusion, or subtle behavioral changes without visible convulsions. It can only be diagnosed by continuous EEG showing ongoing epileptiform activity. Suspect NCSE in any patient with prolonged unexplained altered mental status, especially after convulsive seizure.",
    s: "Shock & Emergency"
  },

  // ===== TBI (40 questions) =====
  {
    q: "A patient with severe TBI has ICP of 25 mmHg and MAP of 85 mmHg. Calculate the CPP and determine if it is adequate.",
    o: ["CPP = 60 mmHg; borderline adequate (goal >60)", "CPP = 110 mmHg; adequate", "CPP = 25 mmHg; critically low", "CPP cannot be calculated"],
    a: 0,
    r: "CPP = MAP - ICP = 85 - 25 = 60 mmHg. This is borderline adequate (goal >60 mmHg). The nurse should monitor closely and intervene to reduce ICP (osmotic therapy, CSF drainage, HOB 30°) or increase MAP if CPP drops below 60.",
    s: "Shock & Emergency"
  },
  {
    q: "What does Cushing's triad indicate and why is it considered a LATE sign?",
    o: ["Infection; because fever develops slowly", "Critically elevated ICP with impending brainstem herniation; it occurs only when ICP is so high that the brainstem is being compressed", "Dehydration; because electrolyte imbalances take time", "Cardiac failure; because pump function declines gradually"],
    a: 1,
    r: "Cushing's triad (hypertension + bradycardia + irregular respirations) occurs when critically elevated ICP compresses the brainstem, triggering sympathetic discharge (hypertension) and vagal response (bradycardia). It is LATE because significant brain damage has already occurred. The nurse should detect rising ICP through GCS and pupil changes BEFORE Cushing's triad develops.",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient's right pupil changes from 3 mm reactive to 6 mm fixed. The left pupil remains 3 mm reactive. This indicates:",
    o: ["Normal medication response", "RIGHT-sided uncal herniation compressing CN III on the ipsilateral side", "LEFT-sided herniation", "Bilateral brainstem death"],
    a: 1,
    r: "A unilateral fixed dilated pupil indicates uncal herniation on the SAME SIDE. The right temporal lobe is herniating through the tentorium cerebelli, compressing the right CN III (oculomotor nerve). This is a neurosurgical emergency requiring immediate ICP reduction and neurosurgical consultation.",
    s: "Shock & Emergency"
  },
  {
    q: "Which nursing action is MOST important for reducing ICP in a TBI patient?",
    o: ["Administering acetaminophen", "Maintaining HOB at 30 degrees with head in neutral midline position to promote venous drainage", "Encouraging fluid intake", "Positioning flat in bed"],
    a: 1,
    r: "HOB at 30° with head neutral/midline promotes jugular venous drainage from the brain, reducing intracranial blood volume and ICP. This is a FREE, immediate nursing intervention. Neck flexion or rotation compresses jugular veins, impeding outflow and increasing ICP.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse needs to suction a patient with severe TBI and ICP monitoring. What steps reduce the ICP spike from suctioning?",
    o: ["Suction for 30 seconds continuously", "Preoxygenate with 100% FiO2, limit suction passes to <10 seconds each, and monitor ICP during the procedure", "Suction without FiO2 changes to avoid oxygen toxicity", "No precautions are needed for suctioning"],
    a: 1,
    r: "Suctioning stimulates the cough reflex and vagal response, increasing ICP. To minimize spikes: preoxygenate with 100% FiO2 for 30-60 seconds, limit each suction pass to <10 seconds, allow ICP to return to baseline between passes, and suction only when clinically necessary.",
    s: "Shock & Emergency"
  },
  {
    q: "When should mannitol be HELD in a TBI patient?",
    o: ["When ICP is elevated", "When serum osmolality exceeds 320 mOsm/kg (risk of renal failure and rebound edema)", "When the patient is hypertensive", "When urine output is high"],
    a: 1,
    r: "Hold mannitol when serum osmolality >320 mOsm/kg because further osmotic diuresis at this level risks acute kidney injury, severe dehydration, and rebound cerebral edema. Check serum osmolality every 6 hours. Consider hypertonic saline as an alternative.",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient develops polyuria (6 L/day), urine specific gravity 1.002, and serum sodium 152 mEq/L. The nurse suspects:",
    o: ["SIADH", "Diabetes insipidus (DI) from pituitary or hypothalamic injury", "Acute kidney failure", "Fluid overload"],
    a: 1,
    r: "Polyuria + dilute urine (low specific gravity) + hypernatremia = diabetes insipidus from posterior pituitary damage (no ADH secretion). Treatment: desmopressin (DDAVP) to replace ADH, fluid replacement to match output. Differentiate from SIADH which causes oliguria, concentrated urine, and hyponatremia.",
    s: "Shock & Emergency"
  },

  // ===== HEMODYNAMIC MONITORING (40 questions) =====
  {
    q: "Where should the hemodynamic transducer be leveled for accurate readings?",
    o: ["At the level of the heart apex", "At the phlebostatic axis: 4th intercostal space at mid-axillary line", "At the sternal notch", "At the xiphoid process"],
    a: 1,
    r: "The phlebostatic axis (4th ICS, mid-axillary line) approximates the right atrium level. All pressure transducers must be leveled here. Leveling too HIGH gives falsely LOW readings; leveling too LOW gives falsely HIGH readings. Re-level with each position change.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient has the following hemodynamic readings: CVP 3, PAWP 5, CI 1.8, SVR 1800. What type of shock is indicated?",
    o: ["Cardiogenic shock", "Hypovolemic shock", "Septic shock", "Neurogenic shock"],
    a: 1,
    r: "Low CVP (3, normal 2-8) + low PAWP (5, normal 8-12) + low CI (1.8, normal 2.5-4.0) + high SVR (1800, normal 800-1200) = hypovolemic shock. Low filling pressures indicate inadequate preload; high SVR is compensatory vasoconstriction. Treatment: volume resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient has: CVP 18, PAWP 24, CI 1.6, SVR 2400. These readings indicate:",
    o: ["Hypovolemic shock", "Cardiogenic shock", "Distributive shock", "Obstructive shock"],
    a: 1,
    r: "Elevated CVP (18) + elevated PAWP (24) + low CI (1.6) + high SVR (2400) = cardiogenic shock. High filling pressures indicate fluid backing up from pump failure. Low CI shows the heart failing as a pump. High SVR is compensatory. Treatment: inotropes (dobutamine), afterload reduction.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient has: CVP 4, PAWP 6, CI 5.2, SVR 420. These readings indicate:",
    o: ["Hypovolemic shock", "Cardiogenic shock", "Distributive (septic) shock", "Normal hemodynamics"],
    a: 2,
    r: "Low-normal CVP (4) + low PAWP (6) + HIGH CI (5.2) + LOW SVR (420) = distributive/septic shock (warm phase). Massive vasodilation drops SVR while cardiac output is elevated (hyperdynamic state). Treatment: fluid resuscitation + vasopressors (norepinephrine).",
    s: "Shock & Emergency"
  },
  {
    q: "What does the Allen test assess and when must it be performed?",
    o: ["Arterial blood flow; before any blood draw", "Dual blood supply to the hand via ulnar artery; BEFORE radial arterial line insertion", "Cardiac output; during PA catheter insertion", "Venous patency; before IV placement"],
    a: 1,
    r: "The Allen test confirms adequate ulnar artery collateral circulation to the hand before radial arterial line insertion. Occlude both radial and ulnar arteries, then release ulnar: hand should reperfuse within 7 seconds. A positive Allen test (delayed reperfusion) means the radial artery should NOT be used.",
    s: "Shock & Emergency"
  },
  {
    q: "The nurse notices the arterial waveform appears dampened with a rounded peak and slow downstroke. What should the nurse do FIRST?",
    o: ["Document the reading as is", "Perform square wave (fast flush) test and troubleshoot: check for air bubbles, clot, kink, or loose connections", "Immediately remove the arterial line", "Increase the pressure bag to 400 mmHg"],
    a: 1,
    r: "A dampened waveform gives inaccurately low systolic and high diastolic readings. Troubleshoot: aspirate to remove air/clot, flush the line, check for kinks in tubing, tighten connections. Perform the square wave test to assess system dynamics. Only escalate if troubleshooting fails.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the normal range for mixed venous oxygen saturation (SvO2) from a PA catheter?",
    o: ["40-50%", "60-80%", "85-95%", "95-100%"],
    a: 1,
    r: "Normal SvO2 is 60-80%, reflecting the balance between oxygen delivery and consumption. SvO2 <60% indicates inadequate oxygen delivery or increased extraction (low CO, anemia, increased demand). SvO2 >80% may indicate inability to extract oxygen (sepsis, cyanide poisoning).",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse accidentally flushes medication through an arterial line instead of the IV. What is the potential consequence?",
    o: ["The medication will be absorbed faster", "Distal arterial vasospasm causing tissue ischemia, necrosis, and potential limb loss", "No significant consequence", "The arterial line will become occluded"],
    a: 1,
    r: "Medication injection into an artery causes intense vasospasm, crystal precipitation, and endothelial damage leading to distal ischemia, tissue necrosis, gangrene, and potential limb loss. Arterial lines must be clearly labeled and ONLY used for monitoring and blood sampling. Never infuse medications through an arterial line.",
    s: "Shock & Emergency"
  },
  {
    q: "How is MAP calculated and what is the minimum target for adequate organ perfusion?",
    o: ["(Systolic + Diastolic) / 2; target >80 mmHg", "[(2 × Diastolic) + Systolic] / 3; target >65 mmHg", "Systolic - Diastolic; target >40 mmHg", "CO × SVR; target >100 mmHg"],
    a: 1,
    r: "MAP = [(2 × Diastolic) + Systolic] / 3. Diastolic is weighted because the heart spends ~2/3 of the cardiac cycle in diastole. Target MAP >65 mmHg ensures adequate perfusion to vital organs (kidneys, brain, coronary arteries). MAP <60 generally leads to organ ischemia.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL HYPOVOLEMIC SHOCK =====
  {
    q: "A nurse is infusing blood products through a rapid infuser. Which complication should be monitored for when using cold stored blood?",
    o: ["Hyperkalemia from potassium leaching out of stored RBCs", "Hypokalemia", "Hypernatremia", "Respiratory alkalosis"],
    a: 0,
    r: "Stored blood accumulates extracellular potassium as RBC membranes deteriorate over storage time. Rapid infusion of multiple units can cause life-threatening hyperkalemia (cardiac arrhythmias, peaked T-waves, widened QRS). Monitor potassium and ECG during massive transfusion. Warm blood products to reduce cardiac irritability.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Shock Index and what value is associated with increased mortality risk?",
    o: ["SI = SBP/HR; abnormal if <0.5", "SI = HR/SBP; SI >1.0 indicates significant hypovolemia and increased mortality risk", "SI = MAP/HR; abnormal if >2", "SI = HR x SBP; abnormal if >10,000"],
    a: 1,
    r: "Shock Index = HR / SBP. Normal is 0.5-0.7. SI >1.0 suggests significant hypovolemia. SI >1.5 suggests severe hemorrhagic shock. Example: HR 130, SBP 90 = SI 1.44. It is more sensitive than individual vital signs for detecting occult hemorrhagic shock, especially in young patients who compensate well.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a femur fracture is estimated to lose how much blood into the thigh compartment?",
    o: ["100-200 mL", "500-1000 mL", "1000-1500 mL", "2000-3000 mL"],
    a: 2,
    r: "A closed femur fracture can sequester 1000-1500 mL of blood into the thigh compartment. Pelvic fractures can cause even greater occult hemorrhage (up to 3000+ mL). These injuries can cause hypovolemic shock without external bleeding. The nurse should monitor for thigh swelling and compartment syndrome.",
    s: "Shock & Emergency"
  },
  {
    q: "Which lab value is the BEST indicator of ongoing tissue hypoperfusion during resuscitation?",
    o: ["Hemoglobin level", "White blood cell count", "Serial serum lactate levels and trend", "Platelet count"],
    a: 2,
    r: "Serial lactate levels and their trend are the best indicator of tissue perfusion adequacy. Lactate is produced by anaerobic metabolism when tissues are inadequately perfused. A declining lactate (>10% clearance in 6 hours) indicates improving perfusion. Rising or persistently elevated lactate despite resuscitation suggests ongoing inadequate perfusion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the primary mechanism of death in uncontrolled hemorrhagic shock?",
    o: ["Respiratory failure", "Cardiovascular collapse from inadequate preload leading to insufficient cardiac output and organ ischemia", "Renal failure", "Neurological injury"],
    a: 1,
    r: "Hemorrhagic shock causes death through cardiovascular collapse: blood loss reduces preload → decreases stroke volume → drops cardiac output → causes organ ischemia → metabolic acidosis → myocardial depression → further cardiovascular decline. This vicious cycle leads to irreversible shock and death without intervention.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL DISTRIBUTIVE SHOCK =====
  {
    q: "Which assessment finding would prompt the nurse to suspect adrenal crisis as a cause of distributive shock?",
    o: ["Hyperglycemia and hypertension", "Hypotension refractory to fluids and vasopressors, hypoglycemia, hyperkalemia, and hyponatremia in a patient on chronic corticosteroids", "Fever and positive blood cultures", "Urticaria and angioedema"],
    a: 1,
    r: "Adrenal crisis (acute adrenal insufficiency) causes distributive shock from cortisol deficiency. Key clues: history of chronic corticosteroid use (sudden withdrawal), refractory hypotension despite fluids/vasopressors, hypoglycemia, hyperkalemia, hyponatremia. Treatment: IV hydrocortisone 100 mg bolus, then 50 mg q8h.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notes that a patient in distributive shock has a CO of 8.5 L/min (normal 4-8) and SVR of 400 dyn-s-cm-5 (normal 800-1200). What do these values indicate?",
    o: ["Cardiogenic shock", "Hyperdynamic distributive shock with compensatory elevated cardiac output but critically low vascular resistance", "Hypovolemic shock", "Normal hemodynamics"],
    a: 1,
    r: "Elevated CO (8.5 L/min) + low SVR (400) = hyperdynamic distributive shock. The heart compensates for low vascular resistance by increasing output, but MAP remains low because MAP ≈ CO × SVR. Treatment: vasopressors (norepinephrine) to increase SVR, plus fluid resuscitation if preload is low.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL SEPSIS =====
  {
    q: "A nurse is caring for a septic patient with a central venous catheter that was placed 5 days ago. The patient develops new-onset fever and rigors during a line flush. What should the nurse suspect?",
    o: ["Catheter-related bloodstream infection (CRBSI); draw blood cultures from the line AND peripherally, notify provider for line removal consideration", "Normal response to flush", "Medication allergy", "DVT at catheter site"],
    a: 0,
    r: "New fever/rigors during line flush suggest CRBSI. Actions: draw paired blood cultures (one from the central line, one from peripheral vein — differential time to positivity helps confirm CRBSI), notify provider, anticipate line removal. Do NOT delay antibiotics. Source control (line removal) is essential for treatment.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the target blood glucose range for septic patients according to the Surviving Sepsis Campaign?",
    o: ["80-110 mg/dL (tight control)", "Blood glucose <180 mg/dL with insulin infusion if two consecutive readings >180 mg/dL", "No glucose management needed", "200-250 mg/dL"],
    a: 1,
    r: "The SSC recommends insulin therapy targeting blood glucose <180 mg/dL (initiated after two consecutive readings >180). Tight glucose control (<110) is NOT recommended due to increased hypoglycemia risk (which increases mortality). Monitor blood glucose every 1-2 hours during insulin infusion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Surviving Sepsis Campaign recommendation regarding corticosteroid use in septic shock?",
    o: ["Corticosteroids for all sepsis patients", "Stress-dose hydrocortisone 200 mg/day IV ONLY for septic shock refractory to adequate fluid resuscitation AND vasopressor therapy", "High-dose dexamethasone for all septic shock", "Corticosteroids are contraindicated in sepsis"],
    a: 1,
    r: "Low-dose (stress-dose) hydrocortisone 200 mg/day IV (50 mg q6h or continuous infusion) is recommended ONLY for refractory septic shock not responding to fluids and vasopressors. It enhances vascular catecholamine sensitivity. NOT for uncomplicated sepsis without shock. Taper gradually, do not abruptly discontinue.",
    s: "Shock & Emergency"
  },
  {
    q: "A septic patient has a procalcitonin level of 12 ng/mL on admission and 2.4 ng/mL on day 5. What does this trend indicate?",
    o: ["Worsening infection requiring antibiotic escalation", "Improving infection; an 80% decline supports antibiotic de-escalation", "No clinical significance", "Need for surgical intervention"],
    a: 1,
    r: "Procalcitonin declined by 80% (12 → 2.4), strongly suggesting improving infection. This supports antibiotic de-escalation or discontinuation. Procalcitonin-guided antibiotic de-escalation has been shown to reduce antibiotic exposure without increasing mortality or treatment failure rates.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of the passive leg raise (PLR) test in sepsis resuscitation?",
    o: ["To assess for DVT", "A dynamic test of fluid responsiveness; if cardiac output increases >10% when legs are raised 45°, the patient is likely to benefit from additional IV fluids", "To reduce lower extremity edema", "To prevent pressure injuries"],
    a: 1,
    r: "The PLR test autotransfuses ~300 mL from lower extremities to central circulation. If cardiac output/stroke volume increases >10% during PLR, the patient is fluid-responsive and will benefit from a bolus. If no response, further fluids are unlikely to help and may cause harm (pulmonary edema). This avoids unnecessary fluid administration.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL ANAPHYLAXIS =====
  {
    q: "A nurse administers epinephrine IM for anaphylaxis. Fifteen minutes later, symptoms have partially improved but the patient still has wheezing and BP 82/54. What should the nurse do?",
    o: ["Administer diphenhydramine and wait", "Give a second dose of epinephrine 0.3-0.5 mg IM; epinephrine can be repeated every 5-15 minutes", "Start methylprednisolone IV only", "Prepare for discharge since partial improvement occurred"],
    a: 1,
    r: "Epinephrine IM can be repeated every 5-15 minutes if symptoms persist. Most patients respond to 1-2 doses. Partial improvement with persistent hypotension and bronchospasm warrants a second dose. If 2-3 IM doses are ineffective, transition to IV epinephrine infusion (1-10 mcg/min).",
    s: "Shock & Emergency"
  },
  {
    q: "What are the four organ systems that can be involved in anaphylaxis?",
    o: ["Respiratory, GI, cardiac, neurological", "Skin/mucosal, respiratory, cardiovascular, and gastrointestinal", "Only skin and respiratory", "Renal, hepatic, cardiac, pulmonary"],
    a: 1,
    r: "Anaphylaxis involves four organ systems: (1) Skin/mucosal (urticaria, angioedema, flushing — present in 90%), (2) Respiratory (wheeze, stridor, dyspnea), (3) Cardiovascular (hypotension, tachycardia, syncope), (4) Gastrointestinal (nausea, vomiting, cramping, diarrhea). Diagnosis requires 2+ systems after allergen exposure.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient presents with urticaria, tongue swelling, and stridor after a bee sting. The nurse cannot administer IM epinephrine because the auto-injector is out of stock. What is the alternative route?",
    o: ["Wait for the pharmacy to deliver more", "Administer epinephrine 1:1,000 (1 mg/mL) 0.3-0.5 mg via IM injection using a syringe drawn from a vial", "Give diphenhydramine IV as a substitute", "Apply topical epinephrine"],
    a: 1,
    r: "If auto-injectors are unavailable, draw epinephrine 1:1,000 (1 mg/mL) from a vial using a syringe and inject 0.3-0.5 mL IM into the anterolateral thigh. The concentration is the same; only the delivery device differs. NEVER substitute antihistamines for epinephrine — epinephrine is the only first-line treatment.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL NEUROGENIC SHOCK =====
  {
    q: "A nurse is caring for a patient with a C6 spinal cord injury who has a temperature of 35.2°C despite warming blankets. What is the MOST likely cause?",
    o: ["Sepsis", "Poikilothermia from loss of sympathetic thermoregulation below the injury level", "Hypothyroidism", "Medication side effect"],
    a: 1,
    r: "Poikilothermia (body temperature adapting to environmental temperature) occurs because sympathetic control of cutaneous vasoconstriction, sweating, and shivering below the injury is lost. The nurse must actively maintain normothermia: warming blankets, warm IV fluids, temperature monitoring every 2-4 hours, and controlling room temperature.",
    s: "Shock & Emergency"
  },
  {
    q: "How does the nurse differentiate neurogenic shock from hypovolemic shock in a multi-trauma patient with a cervical spine injury?",
    o: ["They present identically", "Neurogenic: bradycardia + warm dry skin + absent sweating below injury. Hypovolemic: tachycardia + cool clammy skin + diaphoresis", "Neurogenic always has tachycardia", "Only CT imaging can differentiate them"],
    a: 1,
    r: "Key differences: Neurogenic = bradycardia (lost sympathetic cardiac acceleration) + warm dry skin (vasodilation + absent sweating) below injury. Hypovolemic = tachycardia (compensatory) + cool clammy skin (vasoconstriction + diaphoresis). In trauma, ALWAYS rule out hemorrhage first, as both may coexist.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL OBSTRUCTIVE SHOCK =====
  {
    q: "A nurse is monitoring a patient who had a pericardiocentesis for cardiac tamponade. Which assessment finding indicates re-accumulation of pericardial fluid?",
    o: ["Improving blood pressure", "Return of JVD, muffled heart sounds, declining blood pressure, and pulsus paradoxus", "Clear lung sounds", "Decreased heart rate"],
    a: 1,
    r: "Re-accumulation of pericardial fluid presents with recurrence of Beck's triad (JVD + muffled heart sounds + hypotension) and pulsus paradoxus. The nurse should monitor pericardial drain output, hemodynamic trends, and compare with pre-procedure assessment. Notify the provider immediately if tamponade signs recur.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the MOST specific diagnostic study for pulmonary embolism?",
    o: ["Chest X-ray", "CT pulmonary angiography (CTPA) with IV contrast", "D-dimer level", "ECG"],
    a: 1,
    r: "CTPA is the gold standard diagnostic test for PE with >95% sensitivity and specificity. It directly visualizes the clot in the pulmonary vasculature. D-dimer is a screening tool (high sensitivity, low specificity — useful to rule OUT PE if negative). ECG and CXR support diagnosis but are not definitive.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL MODS =====
  {
    q: "A nurse notes that a patient with MODS has developed acute hepatic dysfunction with bilirubin 4.2 mg/dL and INR 2.1. What do these findings indicate?",
    o: ["Normal liver function", "Hepatic failure component of MODS: elevated bilirubin indicates impaired conjugation, elevated INR indicates impaired clotting factor synthesis", "Biliary obstruction only", "Vitamin K deficiency only"],
    a: 1,
    r: "Elevated bilirubin (normal <1.2) indicates impaired hepatic conjugation and excretion. Elevated INR (normal <1.1) indicates impaired synthesis of clotting factors (II, VII, IX, X). Together, these indicate hepatic failure in MODS. The liver's failure worsens coagulopathy and reduces drug metabolism, potentially causing toxicity.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the primary nursing goal in managing MODS?",
    o: ["Treat each organ system independently", "Support failing organ systems while treating the underlying cause to prevent progression and additional organ failure", "Focus solely on the respiratory system", "Provide comfort care only"],
    a: 1,
    r: "MODS management is primarily supportive: maintain organ perfusion (fluids, vasopressors), support failing organs (ventilator for ARDS, CRRT for AKI), treat the underlying cause (antibiotics for sepsis, source control), prevent secondary insults (infection prevention, nutrition), and have honest goals-of-care discussions as prognosis worsens.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL BURNS =====
  {
    q: "A burn patient weighing 90 kg has 30% TBSA burns. Using the Parkland formula, what is the IV fluid rate for the first 8 hours?",
    o: ["675 mL/hr", "1350 mL/hr", "540 mL/hr (10,800 mL total; 5,400 mL in first 8 hours; 5,400/8 = 675 mL/hr)", "270 mL/hr"],
    a: 0,
    r: "Parkland: 4 × 90 kg × 30% = 10,800 mL/24 hr. Half in first 8 hours = 5,400 mL ÷ 8 hours = 675 mL/hr. Titrate to urine output 0.5-1 mL/kg/hr (45-90 mL/hr for this patient). The calculated rate is a starting point — always adjust based on urine output response.",
    s: "Shock & Emergency"
  },
  {
    q: "Which topical antimicrobial agent penetrates burn eschar most effectively?",
    o: ["Silver sulfadiazine", "Mafenide acetate (Sulfamylon) penetrates eschar best but causes pain on application and metabolic acidosis from carbonic anhydrase inhibition", "Bacitracin", "Petroleum jelly"],
    a: 1,
    r: "Mafenide acetate penetrates eschar more effectively than silver sulfadiazine, making it preferred for deep burns and ear cartilage burns. Disadvantages: causes significant pain on application and inhibits carbonic anhydrase, potentially causing metabolic acidosis. Monitor ABGs during use. Also contraindicated with sulfa allergy.",
    s: "Shock & Emergency"
  },
  {
    q: "What lab values should the nurse monitor closely during the first 48 hours of burn resuscitation?",
    o: ["Only CBC and BMP", "Electrolytes (Na, K), ABG (acidosis), lactate, hemoglobin/hematocrit, coagulation studies, and serum albumin", "Only blood glucose", "Only liver function tests"],
    a: 1,
    r: "Critical labs in burn resuscitation: electrolytes (Na drops from dilution, K rises from tissue destruction), ABG (assess metabolic acidosis), lactate (tissue perfusion), Hgb/Hct (hemoconcentration initially, then drops after fluid resuscitation), coagulation (DIC risk), albumin (lost through capillary leak), and glucose (stress hyperglycemia).",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL STATUS EPILEPTICUS =====
  {
    q: "A patient with a history of epilepsy has been seizure-free for 2 years and reports stopping their phenytoin 3 days ago. Now presenting with status epilepticus. What is the MOST likely cause?",
    o: ["New brain tumor", "Anti-epileptic drug non-adherence or abrupt discontinuation — the most common precipitant of SE in known epileptics", "Stroke", "Metabolic abnormality"],
    a: 1,
    r: "AED non-adherence or abrupt discontinuation is the SINGLE most common cause of SE in patients with known epilepsy. Phenytoin (and other AEDs) should NEVER be stopped abruptly — they require gradual tapering. The nurse should educate patients about the life-threatening consequences of medication non-adherence.",
    s: "Shock & Emergency"
  },
  {
    q: "During status epilepticus, what is the significance of the motor component (convulsive vs non-convulsive)?",
    o: ["Convulsive SE is always more dangerous", "Both convulsive and non-convulsive SE cause neuronal damage; NCSE may go undetected longer, causing insidious but significant brain injury", "Non-convulsive SE is benign", "Motor activity determines seizure classification only"],
    a: 1,
    r: "Both convulsive SE (visible motor activity) and non-convulsive SE (no visible motor activity) cause excitotoxic neuronal damage. NCSE is particularly dangerous because it often goes unrecognized — the patient appears to have a prolonged post-ictal state but is actually still seizing. Continuous EEG is the only way to detect NCSE.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the recommended duration of continuous EEG monitoring after treating status epilepticus?",
    o: ["2-4 hours", "24-48 hours to detect non-convulsive seizure activity", "EEG monitoring is not needed after seizures stop", "1 week"],
    a: 1,
    r: "Continuous EEG monitoring for 24-48 hours after treating convulsive SE is recommended. Up to 48% of patients develop NCSE after apparent termination of convulsive seizures. Extended monitoring also guides medication titration and helps identify breakthrough seizure activity.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL TBI =====
  {
    q: "A TBI patient has a GCS of 6 on arrival. According to Brain Trauma Foundation guidelines, what interventions should the nurse anticipate?",
    o: ["Observation only", "Endotracheal intubation (GCS ≤8), ICP monitor or EVD placement, CT scan, and admission to neurosurgical ICU", "Discharge with follow-up CT in 24 hours", "Only IV fluids and pain management"],
    a: 1,
    r: "Severe TBI (GCS 3-8) requires: immediate intubation for airway protection, ICP monitoring (intraparenchymal monitor or EVD), urgent CT head, neurosurgical ICU admission, and prevention of secondary injury (maintain SBP >100, SpO2 >95%, normothermia, normoglycemia, HOB 30°). A GCS ≤8 means the patient cannot protect their airway.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the 'talk and die' phenomenon in TBI?",
    o: ["Patients who talk during the accident die later", "A patient who initially appears lucid (talks) but later deteriorates and dies from a delayed expanding intracranial hematoma (classically epidural hematoma with lucid interval)", "A communication disorder after TBI", "Death caused by talking too much"],
    a: 1,
    r: "The 'talk and die' phenomenon describes patients who are initially alert and communicative after head injury but rapidly deteriorate from an expanding intracranial hematoma. The classic example is an epidural hematoma from middle meningeal artery rupture with a 'lucid interval.' This highlights the critical importance of serial neurological assessments every 1-2 hours.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is hyperventilation no longer recommended as a first-line ICP management strategy in TBI?",
    o: ["It is too complex", "Hyperventilation reduces ICP by cerebral vasoconstriction (lowering PaCO2), but this also reduces cerebral blood flow, potentially worsening ischemia in the injured brain", "It has no effect on ICP", "It causes cardiac arrhythmias"],
    a: 1,
    r: "Hyperventilation lowers PaCO2, causing cerebral vasoconstriction and reduced ICP. However, this also reduces cerebral blood flow (CBF), risking ischemia in already injured brain tissue. Current BTF guidelines: avoid prophylactic hyperventilation. Reserve brief hyperventilation (PaCO2 30-35) ONLY for acute herniation as a bridge to definitive intervention. Target PaCO2 35-45.",
    s: "Shock & Emergency"
  },
  {
    q: "A TBI patient develops SIADH. What lab findings would the nurse expect?",
    o: ["Hypernatremia and dilute urine", "Hyponatremia (<135 mEq/L), low serum osmolality, concentrated urine (high urine specific gravity), and decreased urine output", "Hyperglycemia", "Elevated potassium"],
    a: 1,
    r: "SIADH after TBI causes excessive ADH secretion → water retention → dilutional hyponatremia (<135) with low serum osmolality (<280 mOsm/kg), concentrated urine (SG >1.020), and decreased UO. Opposite of DI. Treatment: fluid restriction (1000-1200 mL/day), hypertonic saline for severe hyponatremia (<120). Correct sodium slowly to avoid osmotic demyelination.",
    s: "Shock & Emergency"
  },

  // ===== ADDITIONAL HEMODYNAMIC MONITORING =====
  {
    q: "A nurse notices that the CVP reading changes significantly when the patient is repositioned from supine to semi-Fowler's. What should the nurse do?",
    o: ["Record both readings", "Re-level the transducer at the phlebostatic axis with each position change — the transducer must always be at the level of the right atrium regardless of patient position", "Only measure CVP in supine position", "Ignore the discrepancy"],
    a: 1,
    r: "The transducer must be re-leveled at the phlebostatic axis (4th ICS, mid-axillary line) each time the patient changes position. If the transducer is not re-leveled, hydrostatic pressure changes from position create falsely high or low readings. Readings can be obtained in any position as long as the transducer is properly leveled.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the normal range for CVP (central venous pressure)?",
    o: ["0-2 mmHg", "2-8 mmHg", "10-15 mmHg", "15-25 mmHg"],
    a: 1,
    r: "Normal CVP is 2-8 mmHg. CVP reflects right atrial pressure (right heart preload). CVP <2 suggests hypovolemia. CVP >8 may indicate fluid overload, right heart failure, cardiac tamponade, or tension pneumothorax. Trend CVP values rather than relying on a single reading.",
    s: "Shock & Emergency"
  },
  {
    q: "What hemodynamic profile would the nurse expect in a patient with septic shock who has progressed from warm to cold shock?",
    o: ["High CO, low SVR", "Low CO, high SVR, elevated PAWP from myocardial depression", "Normal hemodynamics", "Low CO, low SVR, low PAWP"],
    a: 1,
    r: "Cold (hypodynamic) septic shock: CO drops from myocardial depression (cardiodepressant cytokines), SVR rises from compensatory vasoconstriction (and may be further elevated by vasopressors), and PAWP may rise from ventricular dysfunction. This profile resembles cardiogenic shock and may require addition of inotropes (dobutamine).",
    s: "Shock & Emergency"
  },
  {
    q: "A patient's arterial line shows a systolic blood pressure of 160 mmHg, but the cuff blood pressure reads 130 mmHg. The square wave test shows a rapid oscillation with 4-5 ringing waves. What is the issue?",
    o: ["The cuff is wrong", "An under-damped arterial line system causing artificially elevated systolic readings (resonance artifact)", "A catheter clot", "Normal reading variation"],
    a: 1,
    r: "Excessive oscillations (>2 ringing waves) on square wave test = under-damped system. This causes artificially HIGH systolic and artificially LOW diastolic readings. MAP is usually accurate. Causes: excessive tubing length, air microbubbles, extra stopcocks. Fix: shorten tubing, remove air, add damping device. Use cuff BP until corrected.",
    s: "Shock & Emergency"
  },
  {
    q: "What does an increasing trend in PAWP (pulmonary artery wedge pressure) indicate about a patient's left ventricular function?",
    o: ["Improving left ventricular function", "Worsening left ventricular function — rising PAWP indicates increasing left ventricular end-diastolic pressure from impaired pumping", "Volume depletion", "Pulmonary embolism"],
    a: 1,
    r: "Rising PAWP trend indicates deteriorating left ventricular function. As the left ventricle fails to pump effectively, blood backs up into the left atrium and pulmonary vasculature, increasing PAWP. PAWP >18 mmHg is associated with pulmonary congestion. The nurse should anticipate: diuretics, inotropes, afterload reduction, and potential mechanical circulatory support.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED HYPOVOLEMIC =====
  {
    q: "A trauma patient arrives with an estimated 2L blood loss. The physician orders a massive transfusion protocol (MTP). What is the typical PRBC:FFP:platelet ratio used in MTP?",
    o: ["4:1:1", "1:1:1 ratio of PRBCs to FFP to platelets", "2:1:0.5", "Only PRBCs are needed"],
    a: 1,
    r: "Modern massive transfusion protocols use a balanced 1:1:1 ratio of PRBCs:FFP:platelets based on PROPPR trial evidence. This mimics whole blood composition and prevents dilutional coagulopathy. Early activation of MTP is critical when >10 units are anticipated. Tranexamic acid (TXA) within 3 hours of injury also improves outcomes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is permissive hypotension and in which hemorrhagic shock patients is it appropriate?",
    o: ["Maintaining BP <60 mmHg in all shock patients", "Targeting SBP 80-90 mmHg in penetrating trauma before surgical control to minimize ongoing hemorrhage while maintaining organ perfusion", "Never allowing hypotension", "Treating hypertension aggressively in shock"],
    a: 1,
    r: "Permissive hypotension targets SBP 80-90 mmHg in penetrating trauma BEFORE surgical hemorrhage control. Aggressive fluid resuscitation to normalize BP can pop clots and worsen bleeding. Contraindicated in TBI (need SBP >100 for cerebral perfusion) and blunt trauma with uncertain bleeding source.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with hemorrhagic shock has a temperature of 34.5°C, pH 7.22, and INR 2.8. What triad does this represent?",
    o: ["Cushing's triad", "The lethal triad (trauma triad of death): hypothermia, acidosis, and coagulopathy — each component worsens the others, creating a vicious cycle", "Beck's triad", "Virchow's triad"],
    a: 1,
    r: "The lethal triad: hypothermia (impairs clotting enzymes), acidosis (impairs coagulation cascade and cardiac function), and coagulopathy (from dilution, consumption, and hypothermia). Each worsens the others in a vicious cycle. Treatment: damage control surgery, active warming, balanced transfusion, and correction of acidosis.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between crystalloid and colloid fluid resuscitation in hemorrhagic shock?",
    o: ["They are identical", "Crystalloids (NS, LR) distribute into interstitial space quickly (only 25% stays intravascular); colloids (albumin) stay intravascular longer but are more expensive with no proven survival benefit", "Colloids are always preferred", "Crystalloids stay intravascular longer"],
    a: 1,
    r: "Crystalloids: inexpensive, widely available, but only 25% remains intravascular after 1 hour (75% shifts to interstitium). LR is preferred over NS (less hyperchloremic acidosis). Colloids (albumin, hetastarch): stay intravascular longer but cost more and no mortality benefit in most studies. Blood products are preferred for hemorrhagic shock.",
    s: "Shock & Emergency"
  },
  {
    q: "What is tranexamic acid (TXA) and when should it be administered in trauma?",
    o: ["An antibiotic given prophylactically", "An antifibrinolytic that reduces bleeding-related mortality when given within 3 hours of traumatic hemorrhage", "A vasopressor", "A platelet substitute"],
    a: 1,
    r: "TXA inhibits fibrinolysis (clot breakdown) by blocking plasminogen-plasmin conversion. The CRASH-2 trial showed TXA reduces all-cause mortality and hemorrhage-related mortality when given within 3 hours. Dose: 1g IV over 10 minutes, then 1g over 8 hours. After 3 hours, TXA may INCREASE mortality and should NOT be given.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED DISTRIBUTIVE =====
  {
    q: "What is the mechanism of action of vasopressin in distributive shock?",
    o: ["Beta-1 agonist", "Acts on V1 receptors on vascular smooth muscle to cause vasoconstriction independent of catecholamine pathways, making it useful when catecholamine receptors are downregulated", "Calcium channel blocker", "Alpha-2 agonist"],
    a: 1,
    r: "Vasopressin (V1 receptor agonist) causes vasoconstriction through a mechanism independent of adrenergic receptors. In prolonged shock, catecholamine receptors become downregulated (tachyphylaxis), making norepinephrine less effective. Vasopressin works through a different pathway, providing additional vasoconstriction. Dose: 0.03-0.04 units/min (not titrated).",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notes that a patient's norepinephrine requirement has increased from 5 to 25 mcg/min over 12 hours. What should the nurse communicate to the provider?",
    o: ["This is expected and normal", "Escalating vasopressor requirements suggest worsening shock; reassess for source control failure, new infection, adrenal insufficiency, or cardiac decompensation", "Decrease the rate to save medication", "Switch to oral medications"],
    a: 1,
    r: "Rising vasopressor requirements (catecholamine-resistant shock) are ominous. Causes: inadequate source control, new/worsening infection, adrenal insufficiency (consider stress-dose hydrocortisone), myocardial depression (add inotrope), metabolic derangement (acidosis). Each cause requires targeted intervention. High-dose vasopressors (>0.5 mcg/kg/min NE equivalent) carry poor prognosis.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED SEPSIS =====
  {
    q: "What is the qSOFA score and what does it screen for?",
    o: ["A full sepsis diagnostic tool", "Quick SOFA uses 3 bedside criteria (RR ≥22, altered mentation, SBP ≤100) to identify patients at risk for poor outcomes from sepsis; ≥2 criteria positive warrants further workup", "A cardiac assessment tool", "A pain assessment scale"],
    a: 1,
    r: "qSOFA: RR ≥22 (1 point), altered mentation (1 point), SBP ≤100 (1 point). Score ≥2 identifies patients at risk for poor outcomes and should prompt evaluation for organ dysfunction (full SOFA score). qSOFA is a screening tool, NOT diagnostic. It requires NO lab tests, making it ideal for bedside triage.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the components of the SOFA score used to define sepsis-related organ dysfunction?",
    o: ["Only respiratory and renal", "Six organ systems: respiratory (PaO2/FiO2), coagulation (platelets), liver (bilirubin), cardiovascular (MAP/vasopressor dose), CNS (GCS), renal (creatinine/UO)", "Only cardiovascular", "Only neurological"],
    a: 1,
    r: "SOFA score evaluates 6 organ systems: (1) Respiratory: PaO2/FiO2 ratio, (2) Coagulation: platelet count, (3) Liver: bilirubin, (4) Cardiovascular: MAP and vasopressor requirement, (5) CNS: GCS, (6) Renal: creatinine or urine output. Sepsis-3 defines sepsis as infection + SOFA increase ≥2 points.",
    s: "Shock & Emergency"
  },
  {
    q: "A septic patient's blood cultures grow methicillin-resistant Staphylococcus aureus (MRSA). The patient is currently receiving piperacillin-tazobactam. What antibiotic change should the nurse anticipate?",
    o: ["Continue current antibiotics", "Add vancomycin or daptomycin — MRSA is resistant to beta-lactams including piperacillin-tazobactam; de-escalate pip/tazo if MRSA is the sole pathogen", "Switch to oral amoxicillin", "Discontinue all antibiotics"],
    a: 1,
    r: "MRSA is resistant to all beta-lactams (penicillins, cephalosporins, carbapenems). Vancomycin is the first-line agent (target trough AUC/MIC ratio). Monitor vancomycin trough levels (goal AUC/MIC 400-600) and renal function. Daptomycin is an alternative for bloodstream infections but NOT for pneumonia (inactivated by surfactant).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Surviving Sepsis Campaign Hour-1 Bundle?",
    o: ["A 1-hour nursing orientation program", "Within 1 hour of sepsis recognition: measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin fluid resuscitation (30 mL/kg crystalloid) for hypotension/lactate ≥4, and start vasopressors if hypotension persists", "A hospital safety checklist", "A 1-hour discharge protocol"],
    a: 1,
    r: "Hour-1 Bundle (2018 SSC update): (1) Measure lactate (re-measure if >2), (2) Obtain blood cultures before antibiotics, (3) Administer broad-spectrum IV antibiotics, (4) Begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L, (5) Start vasopressors if MAP <65 during or after fluid resuscitation. Time zero = sepsis recognition.",
    s: "Shock & Emergency"
  },
  {
    q: "Why is balanced crystalloid (lactated Ringer's) preferred over 0.9% normal saline for sepsis resuscitation?",
    o: ["It is cheaper", "Large-volume NS causes hyperchloremic metabolic acidosis, which can worsen renal function; LR has a more physiologic electrolyte composition", "NS is preferred", "They are identical"],
    a: 1,
    r: "Normal saline contains 154 mEq/L chloride (vs plasma 98-106). Large-volume NS infusion causes hyperchloremic metabolic acidosis and is associated with AKI and increased mortality (SMART trial). LR/PlasmaLyte have balanced electrolyte compositions closer to plasma. Exception: NS preferred when hyperkalemia is a concern (LR contains 4 mEq/L potassium).",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with sepsis develops acute respiratory distress syndrome (ARDS). What is the recommended ventilator strategy?",
    o: ["High tidal volumes for comfort", "Low tidal volume ventilation (6 mL/kg predicted body weight) with PEEP optimization and plateau pressure ≤30 cmH2O", "Non-invasive ventilation only", "No specific strategy is needed"],
    a: 1,
    r: "ARDS ventilation (ARDSNet protocol): Vt 6 mL/kg PBW (not actual weight), plateau pressure ≤30 cmH2O, PEEP titrated to FiO2/PEEP table, target SpO2 88-95%. Low Vt prevents ventilator-induced lung injury (VILI). Also consider prone positioning (16 hours/day) for P/F ratio <150. This reduces mortality by ~10%.",
    s: "Shock & Emergency"
  },
  {
    q: "What is sepsis-induced myocardial dysfunction and how is it detected?",
    o: ["Always clinically obvious", "Cytokine-mediated reversible biventricular dilation with reduced ejection fraction, detected by bedside echocardiography showing decreased EF and ventricular dilation", "Only detected by cardiac catheterization", "Does not exist in sepsis"],
    a: 1,
    r: "Sepsis causes myocardial depression through cardiodepressant cytokines (TNF-α, IL-1β). Features: biventricular dilation, reduced ejection fraction (sometimes <20%), but usually reversible within 7-10 days of recovery. Bedside echo is the primary detection tool. Treatment: inotropes (dobutamine), avoid excessive fluids, optimize afterload.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED ANAPHYLAXIS =====
  {
    q: "What is the recommended observation period after treating anaphylaxis?",
    o: ["30 minutes", "4-6 hours minimum; up to 24 hours for severe reactions due to biphasic reaction risk", "No observation needed", "48 hours"],
    a: 1,
    r: "Observe minimum 4-6 hours after symptom resolution (some guidelines recommend 6-12 hours). Biphasic reactions (symptom recurrence) occur in up to 20% of cases, typically within 4-12 hours. Patients with severe initial reactions, slow response to epinephrine, or prior biphasic history should be observed 24 hours.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on a beta-blocker (metoprolol) experiences anaphylaxis. Why is this combination particularly dangerous?",
    o: ["Beta-blockers have no effect on anaphylaxis", "Beta-blockers blunt the cardiovascular response to epinephrine and block compensatory tachycardia, making anaphylaxis more severe and harder to treat", "Beta-blockers prevent anaphylaxis", "The patient should take more metoprolol"],
    a: 1,
    r: "Beta-blockers: (1) Block compensatory tachycardia, worsening hypotension, (2) Block beta-2 bronchodilation from epinephrine, (3) May cause paradoxical bradycardia during anaphylaxis. Treatment: larger epinephrine doses, glucagon 1-5 mg IV (bypasses beta-receptors via cAMP pathway), aggressive fluid resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between anaphylaxis and anaphylactoid reactions?",
    o: ["They are identical", "Anaphylaxis is IgE-mediated (requires prior sensitization); anaphylactoid reactions are non-IgE mediated (can occur on first exposure) but present identically", "Anaphylactoid is always mild", "Anaphylaxis does not involve the immune system"],
    a: 1,
    r: "Classic anaphylaxis: IgE-mediated, requires prior sensitization (first exposure = sensitization, second exposure = reaction). Anaphylactoid: direct mast cell degranulation without IgE (contrast dye, opioids, vancomycin red man syndrome). Clinical presentation and treatment are IDENTICAL. The distinction is mainly pathophysiological, not clinical.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED NEUROGENIC =====
  {
    q: "What is spinal shock vs neurogenic shock?",
    o: ["They are the same condition", "Spinal shock is temporary loss of all reflexes and flaccidity below the injury (hours to weeks); neurogenic shock is cardiovascular instability from loss of sympathetic tone", "Neurogenic shock lasts longer", "Spinal shock causes hypertension"],
    a: 1,
    r: "Spinal shock: temporary areflexia and flaccidity below the SCI level (loss of reflex arc function); resolves in hours to weeks (return of bulbocavernosus reflex = spinal shock resolution). Neurogenic shock: cardiovascular consequence of sympathetic disruption (hypotension, bradycardia). They often coexist initially but are distinct phenomena.",
    s: "Shock & Emergency"
  },
  {
    q: "At what spinal cord level does injury most commonly cause neurogenic shock?",
    o: ["Below L1", "Injuries at or above T6, because the sympathetic chain exits from T1-L2, and injuries above T6 disrupt the majority of sympathetic outflow", "Any cervical level only", "Only at C1-C3"],
    a: 1,
    r: "Injuries above T6 cause significant neurogenic shock because most sympathetic outflow originates from T1-L2. Higher injuries = more sympathetic disruption = more severe shock. C1-C5: complete loss of all sympathetic tone (most severe). T6-T10: partial sympathetic disruption (milder shock). Below T10: usually no significant neurogenic shock.",
    s: "Shock & Emergency"
  },
  {
    q: "What is autonomic dysreflexia and how does it relate to neurogenic shock?",
    o: ["It is the same as neurogenic shock", "A life-threatening hypertensive crisis in patients with healed SCI above T6 caused by noxious stimuli below the injury level; the opposite problem of neurogenic shock's hypotension", "A gradual onset condition", "Only occurs in thoracic injuries"],
    a: 1,
    r: "Autonomic dysreflexia (AD) develops AFTER spinal shock resolves (chronic SCI above T6). A noxious stimulus below injury (full bladder, constipation) triggers massive sympathetic response below injury → severe HTN (SBP >200). Above injury: compensatory bradycardia, flushing, headache. Treatment: sit upright, find and remove the stimulus (catheterize, disimpact).",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED OBSTRUCTIVE =====
  {
    q: "What is electrical alternans on ECG and what does it suggest?",
    o: ["A benign variant", "Alternating amplitude of QRS complexes suggesting cardiac tamponade — the heart swings back and forth in a large pericardial effusion", "Atrial fibrillation", "Ventricular tachycardia"],
    a: 1,
    r: "Electrical alternans: beat-to-beat alternation in QRS amplitude and/or axis on ECG. It is caused by the heart swinging back and forth within a large pericardial effusion, changing the electrical axis with each beat. It is highly specific (though not sensitive) for large pericardial effusion and impending tamponade.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Wells score used for?",
    o: ["Assessing heart failure severity", "A clinical prediction rule that estimates the pre-test probability of pulmonary embolism based on clinical criteria including DVT signs, heart rate, immobilization, and history", "Scoring wound severity", "A nutritional assessment"],
    a: 1,
    r: "Wells score criteria: clinical DVT signs (3 pts), PE most likely diagnosis (3 pts), HR >100 (1.5 pts), immobilization/surgery (1.5 pts), previous DVT/PE (1.5 pts), hemoptysis (1 pt), cancer (1 pt). Score ≤4: low probability (D-dimer to rule out); >4: high probability (proceed to CTPA). It guides the diagnostic workup approach.",
    s: "Shock & Emergency"
  },
  {
    q: "A post-cardiac surgery patient has 250 mL chest tube output in the first hour, then 200 mL in the second hour. The output is bright red. What should the nurse do?",
    o: ["This is normal drainage", "Notify the surgeon — high-volume bright red drainage (>200 mL/hr or >100 mL/hr for 3+ hours) suggests active surgical bleeding requiring possible re-exploration", "Clamp the chest tube", "Decrease IV fluid rate only"],
    a: 1,
    r: "Excessive chest tube output criteria for surgical re-exploration: >200 mL in the first hour, >100 mL/hr for 3+ consecutive hours, or sudden increase in output. Bright red blood = arterial bleeding. Actions: notify surgeon, type and crossmatch blood, prepare for possible emergent sternotomy, transfuse if hemoglobin drops.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED MODS =====
  {
    q: "What is the SOFA score and how is it used to track MODS progression?",
    o: ["A nutritional assessment", "Sequential Organ Failure Assessment scoring system that tracks 6 organ systems (respiratory, coagulation, liver, cardiovascular, CNS, renal) to quantify organ dysfunction severity and predict mortality", "A pain scale", "A fluid balance tool"],
    a: 1,
    r: "SOFA scores each organ 0-4 points (0 = normal, 4 = severe failure): respiratory (PaO2/FiO2), coagulation (platelets), liver (bilirubin), cardiovascular (MAP/vasopressor), CNS (GCS), renal (creatinine/UO). Total score predicts mortality: SOFA 0-6 = <10%, 7-9 = 15-20%, 10-12 = 40-50%, >15 = >90%. Daily SOFA trending guides prognosis.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of the gut in MODS pathogenesis?",
    o: ["The gut is not involved in MODS", "Gut mucosal ischemia causes bacterial translocation (gut bacteria entering the bloodstream), perpetuating the systemic inflammatory response and worsening organ failure", "The gut only affects nutrition", "Gut bacteria are always beneficial in MODS"],
    a: 1,
    r: "The gut is called the 'motor of MODS.' Shock causes splanchnic vasoconstriction → gut mucosal ischemia → loss of mucosal barrier integrity → bacterial translocation (gut bacteria and endotoxin cross into bloodstream) → amplified systemic inflammatory response → worsening organ failure. Early enteral nutrition helps maintain gut integrity.",
    s: "Shock & Emergency"
  },
  {
    q: "A MODS patient develops coagulopathy with bleeding from IV sites and petechiae. Lab findings: platelets 42K, fibrinogen 85 mg/dL, D-dimer >20 mcg/mL, PT 22s. What condition has developed?",
    o: ["Simple thrombocytopenia", "Disseminated intravascular coagulation (DIC) — simultaneous widespread clotting and bleeding from consumption of clotting factors and platelets", "Hemophilia", "Vitamin K deficiency only"],
    a: 1,
    r: "DIC in MODS: widespread microthrombi activate coagulation cascade, consuming clotting factors (elevated PT/PTT) and platelets (<100K), while fibrinolysis produces elevated D-dimer. Fibrinogen <100 is a late and ominous finding. Treatment: treat underlying cause, replace factors (FFP, cryoprecipitate), platelets if <10K or actively bleeding.",
    s: "Shock & Emergency"
  },
  {
    q: "What is ARDS as a component of MODS, and what are its diagnostic criteria (Berlin definition)?",
    o: ["Any respiratory difficulty", "Acute onset (within 1 week), bilateral opacities on CXR (not explained by effusion/atelectasis), non-cardiogenic pulmonary edema, and PaO2/FiO2 ≤300 on PEEP ≥5", "Chronic lung disease", "Only pneumonia"],
    a: 1,
    r: "Berlin ARDS criteria: (1) Acute onset within 1 week of known insult, (2) Bilateral CXR opacities not fully explained by effusions/atelectasis/nodules, (3) NOT primarily from heart failure, (4) PaO2/FiO2 ratio with PEEP ≥5: Mild 200-300, Moderate 100-200, Severe <100. In MODS, ARDS is often the first organ failure to manifest.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED BURNS =====
  {
    q: "What is an escharotomy and when is it performed?",
    o: ["Removal of burned tissue for grafting", "A surgical incision through circumferential full-thickness burn eschar to release constriction and restore blood flow to the extremity or chest wall ventilation", "A skin biopsy", "A type of wound dressing"],
    a: 1,
    r: "Circumferential full-thickness burns create tight, non-elastic eschar that acts like a tourniquet. As edema develops, the constriction compresses blood vessels (extremity ischemia) or restricts chest wall movement (respiratory compromise). Escharotomy: bedside lateral incisions through eschar to release pressure. No anesthesia needed (full-thickness burns are insensate).",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient develops hoarseness and stridor 3 hours after injury. The patient was in a house fire. What is the priority intervention?",
    o: ["Administer albuterol", "Emergent endotracheal intubation — progressive airway edema from inhalation injury will worsen; intubation becomes impossible once edema peaks at 12-24 hours", "Give IV steroids and observe", "Apply ice to the neck"],
    a: 1,
    r: "Hoarseness and stridor after inhalation injury indicate progressing supraglottic edema. This is an EMERGENCY — intubate NOW while the airway is still patent. Edema peaks at 12-24 hours; by then, laryngeal swelling may make intubation impossible (surgical airway required). Signs of inhalation injury: facial burns, singed nasal hairs, carbonaceous sputum, hoarseness.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between superficial partial-thickness and deep partial-thickness burns?",
    o: ["No clinical difference", "Superficial partial-thickness: painful, blistered, moist, red, blanches, heals in 2-3 weeks without scarring. Deep partial-thickness: less painful, white/red, may not blister, heals in 3-8 weeks with scarring, may need grafting", "Superficial is worse", "Deep partial heals faster"],
    a: 1,
    r: "Superficial partial (2nd degree superficial): involves epidermis and superficial dermis. Painful (nerve endings intact), blistered, moist, red, blanches with pressure. Heals in 2-3 weeks with minimal scarring. Deep partial (2nd degree deep): extends to deep dermis. Less painful (nerve damage), waxy/white appearance, less moisture. Heals in 3-8 weeks with significant scarring; often requires skin grafting.",
    s: "Shock & Emergency"
  },
  {
    q: "What is carbon monoxide (CO) poisoning and how is it treated in burn patients?",
    o: ["CO poisoning is rare in fire victims", "CO binds hemoglobin with 200-250x greater affinity than oxygen, causing tissue hypoxia despite normal PaO2; treated with 100% FiO2 via non-rebreather mask", "Treatment is supplemental oxygen at 2L NC", "CO poisoning only affects the lungs"],
    a: 1,
    r: "CO displaces oxygen from hemoglobin (forming carboxyhemoglobin, COHb) with 200-250x greater affinity. SpO2 is FALSELY NORMAL (pulse ox cannot distinguish COHb from OxyHb). Diagnosis: co-oximetry (arterial blood gas). Treatment: 100% FiO2 via NRB (half-life of COHb: 60-90 min on 100% vs 4-5 hours on room air). Consider hyperbaric oxygen for COHb >25% or neurological symptoms.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED STATUS EPILEPTICUS =====
  {
    q: "What metabolic complications can occur during prolonged status epilepticus?",
    o: ["Only hyperglycemia", "Hyperthermia, metabolic acidosis (lactic acidosis from muscle contractions), rhabdomyolysis (CK elevation, myoglobin in urine), hyperkalemia, and hypoglycemia (late)", "Only dehydration", "No metabolic complications occur"],
    a: 1,
    r: "Prolonged SE complications: (1) Hyperthermia from excessive muscle activity, (2) Lactic acidosis from anaerobic muscle metabolism, (3) Rhabdomyolysis (muscle breakdown → elevated CK, myoglobinuria → AKI), (4) Hyperkalemia (from cell breakdown), (5) Hypoglycemia (glucose stores depleted), (6) Aspiration pneumonia, (7) Neuronal death from excitotoxicity.",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing safety interventions should be performed during an active generalized tonic-clonic seizure?",
    o: ["Restrain the patient and place something in their mouth", "Protect from injury (pad surroundings), position on side, do NOT restrain or put anything in the mouth, suction as needed, time the seizure, give oxygen", "Leave the patient alone and document", "Apply a tourniquet to the convulsing limb"],
    a: 1,
    r: "During active seizure: (1) Call for help, (2) Note time, (3) Clear surroundings/protect from injury, (4) DO NOT restrain, (5) DO NOT place anything in the mouth (no tongue blade, bite block), (6) Turn on side when possible (aspiration prevention), (7) Loosen tight clothing, (8) Suction secretions, (9) Administer oxygen, (10) Have emergency medications ready. Document type, duration, and postictal status.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the mechanism of action of phenytoin/fosphenytoin in seizure management?",
    o: ["GABA enhancement", "Sodium channel blockade — stabilizes neuronal membranes by blocking voltage-gated sodium channels, preventing repetitive firing of action potentials", "Calcium channel blockade", "Glutamate inhibition"],
    a: 1,
    r: "Phenytoin/fosphenytoin block voltage-gated sodium channels, preventing repetitive neuronal firing. They stabilize the inactive state of sodium channels, making neurons less excitable. Key monitoring: therapeutic level 10-20 mcg/mL, ECG monitoring during IV loading (risk of bradycardia and hypotension from propylene glycol in phenytoin), and purple glove syndrome.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on a propofol infusion for refractory SE develops triglycerides of 400 mg/dL, elevated CK, metabolic acidosis, and bradycardia. What syndrome should the nurse suspect?",
    o: ["Normal propofol effects", "Propofol infusion syndrome (PRIS) — a rare but often fatal complication of prolonged or high-dose propofol infusion", "Serotonin syndrome", "Neuroleptic malignant syndrome"],
    a: 1,
    r: "PRIS: rare but potentially fatal complication of propofol (usually >48 hours or >5 mg/kg/hr). Features: metabolic acidosis, rhabdomyolysis (elevated CK), hypertriglyceridemia, cardiac failure, bradycardia, renal failure. Treatment: STOP propofol immediately, supportive care. Monitor triglycerides, CK, and pH daily during propofol infusion.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED TBI =====
  {
    q: "What are the three types of brain herniation and their clinical signs?",
    o: ["Only one type exists", "Uncal (ipsilateral pupil dilation, contralateral hemiparesis), central/transtentorial (bilateral pupil fixation, decerebrate posturing), and tonsillar (sudden respiratory arrest from brainstem compression)", "Herniation does not cause specific signs", "Only upward herniation exists"],
    a: 1,
    r: "Herniation syndromes: (1) Uncal: temporal lobe herniates through tentorial notch → CN III compression → ipsilateral fixed dilated pupil, contralateral hemiparesis; (2) Central/transtentorial: bilateral tentorial herniation → bilateral fixed pupils, decerebrate posturing, Cushing's triad; (3) Tonsillar: cerebellar tonsils herniate through foramen magnum → brainstem compression → sudden respiratory/cardiac arrest.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of mannitol in ICP management?",
    o: ["A nutritional supplement", "An osmotic diuretic that draws water from brain tissue into the intravascular space, reducing cerebral edema and ICP within 15-30 minutes", "An antibiotic", "A vasodilator"],
    a: 1,
    r: "Mannitol (20%): osmotic gradient draws water from brain tissue into blood. Dose: 0.25-1 g/kg IV bolus over 15-20 minutes. Onset: 15-30 minutes, peak 60-90 minutes, duration 4-6 hours. Monitor: serum osmolality (hold if >320 mOsm/kg — renal failure risk), I&O, electrolytes. Must maintain euvolemia — mannitol causes diuresis.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between an epidural hematoma and a subdural hematoma?",
    o: ["No clinical difference", "Epidural: arterial (middle meningeal artery), lens-shaped on CT, lucid interval, rapid deterioration. Subdural: venous (bridging veins), crescent-shaped on CT, more gradual onset, higher mortality due to underlying brain injury", "Epidural is always chronic", "Subdural is always acute"],
    a: 1,
    r: "Epidural: between skull and dura, usually from temporal bone fracture tearing the middle meningeal artery. Lens (biconvex) shape on CT. Classic lucid interval then rapid deterioration. Emergency surgery (craniotomy). Subdural: between dura and arachnoid, from torn bridging veins. Crescent shape on CT. Acute (<72h), subacute (3d-3w), or chronic (>3w). Higher mortality due to concurrent brain contusion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is secondary brain injury and what nursing interventions prevent it?",
    o: ["Only surgical injuries", "Brain damage after the initial trauma from hypotension, hypoxia, hyperthermia, hyperglycemia, or seizures; prevented by maintaining SBP >100, SpO2 >95%, normothermia, euglycemia, and seizure prophylaxis", "Secondary injury is not preventable", "Only medication-related injury"],
    a: 1,
    r: "Secondary injury = additional brain damage from systemic insults after the initial trauma. A single episode of hypotension (SBP <90) doubles mortality. Key prevention: SBP >100 (BTF guidelines), SpO2 >95%, PaCO2 35-45, temperature 36-37.5°C (avoid both hyper/hypothermia), glucose 80-180, seizure prophylaxis (phenytoin × 7 days for severe TBI), and ICP management.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 3: EXTENDED HEMODYNAMIC MONITORING =====
  {
    q: "What is the Allen test and when is it performed?",
    o: ["A test for DVT", "Assesses collateral ulnar artery circulation before radial artery cannulation — the patient clenches their fist while both arteries are occluded, then the ulnar artery is released; hand should pink up within 5-7 seconds", "A neurological assessment", "A test for carpal tunnel syndrome"],
    a: 1,
    r: "The Allen test evaluates ulnar artery patency before radial arterial line insertion. Procedure: (1) Patient clenches fist, (2) Occlude both radial and ulnar arteries, (3) Patient opens hand (should be pale), (4) Release ULNAR artery only, (5) Hand should pink up within 5-7 seconds (positive = adequate collateral flow). If negative (>7 seconds), do NOT cannulate the radial artery.",
    s: "Shock & Emergency"
  },
  {
    q: "What does an elevated SVR (systemic vascular resistance) indicate clinically?",
    o: ["Vasodilation", "Vasoconstriction — either compensatory (shock states), pharmacological (vasopressor effect), or pathological (hypothermia, heart failure with compensatory peripheral vasoconstriction)", "Normal hemodynamics", "Decreased afterload"],
    a: 1,
    r: "Elevated SVR (>1200 dyn-s-cm-5) indicates increased vascular tone/vasoconstriction. Causes: compensatory response to low CO (cardiogenic/hypovolemic shock), vasopressor therapy, hypothermia, or heart failure. Elevated SVR increases cardiac workload (afterload). Treatment depends on cause: vasodilators for HF, volume for hypovolemia, warming for hypothermia.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is asked to assist with pulmonary artery catheter insertion. What complications should be monitored during and after insertion?",
    o: ["Only infection", "Arrhythmias (PVCs/VT from catheter irritating the RV), pneumothorax, PA rupture, air embolism, catheter knotting, and infection", "Only bleeding", "No complications are possible"],
    a: 1,
    r: "PA catheter complications: (1) During insertion: arrhythmias (VT from catheter touching RV endocardium — have lidocaine and defibrillator ready), pneumothorax (subclavian approach), air embolism, (2) In situ: PA rupture (over-inflation of balloon), infection (risk increases after 72 hours), thrombosis, catheter knotting. Monitor ECG continuously during insertion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the purpose of zeroing and leveling a hemodynamic monitoring system?",
    o: ["Calibrating the display screen", "Zeroing eliminates atmospheric pressure from readings; leveling at the phlebostatic axis ensures accurate pressure readings by eliminating hydrostatic pressure effects of fluid column height", "Testing the alarm system", "Checking battery life"],
    a: 1,
    r: "Zeroing: opening the transducer to atmospheric pressure and setting the monitor to read zero (eliminates atmospheric pressure from readings — only measures intravascular pressure). Leveling: positioning the transducer at the phlebostatic axis (4th ICS, mid-axillary line = right atrium level) to eliminate hydrostatic pressure effects. Must zero/level every shift, with position changes, and when readings seem inaccurate.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the normal hemodynamic values for pulmonary artery pressures?",
    o: ["PA systolic 40-60 mmHg", "PA systolic 15-25 mmHg, PA diastolic 8-15 mmHg, PA mean 10-20 mmHg", "PA systolic 0-5 mmHg", "PA pressures cannot be measured"],
    a: 1,
    r: "Normal PA pressures: systolic 15-25 mmHg, diastolic 8-15 mmHg, mean 10-20 mmHg. Elevated PA pressures suggest: pulmonary hypertension, left heart failure (back pressure), ARDS, PE, or volume overload. PA diastolic normally correlates with PAWP (when there is no pulmonary vascular disease).",
    s: "Shock & Emergency"
  },
  {
    q: "How does PEEP affect hemodynamic monitoring readings?",
    o: ["PEEP has no effect", "PEEP >10 cmH2O can falsely elevate CVP and PAWP by transmitting intrathoracic pressure to the vascular system; readings should be taken at end-expiration for accuracy", "PEEP decreases all readings", "PEEP only affects blood pressure"],
    a: 1,
    r: "PEEP increases intrathoracic pressure, which is transmitted to the heart and great vessels, artificially elevating CVP and PAWP readings. At PEEP >10 cmH2O, subtract approximately 1/4 to 1/3 of the PEEP value from the recorded pressure. Always measure at end-expiration (respiratory variation is minimal). Consider transmural pressure for accurate assessment.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 4: LARGE EXPANSION =====
  {
    q: "What is the Trendelenburg position and is it recommended for hypovolemic shock?",
    o: ["Head down, legs up — always recommended", "Historically used (head down, legs up) but now NOT routinely recommended due to increased ICP, decreased lung compliance, and no proven benefit; passive leg raise is preferred as a diagnostic maneuver", "Sitting upright position", "Prone position"],
    a: 1,
    r: "Trendelenburg (head down) was traditionally used for shock but is no longer recommended. Risks: increased ICP, decreased lung compliance, impaired diaphragmatic excursion, aspiration risk, and minimal sustained hemodynamic benefit. Passive leg raise (PLR) is preferred as a temporary diagnostic maneuver to assess fluid responsiveness.",
    s: "Shock & Emergency"
  },
  {
    q: "Which type of IV fluid should be avoided in hemorrhagic shock with head injury?",
    o: ["Lactated Ringer's", "Hypotonic solutions (D5W, 0.45% NS) — they lower serum osmolality and can worsen cerebral edema in TBI patients", "Normal saline", "Blood products"],
    a: 1,
    r: "Hypotonic fluids (D5W, 0.45% NS) lower serum osmolality, driving water into brain tissue and worsening cerebral edema. In hemorrhagic shock with TBI: use isotonic crystalloids (NS or LR) or blood products. Hypertonic saline (3% or 23.4%) may be used in TBI to reduce ICP while expanding intravascular volume.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient receives 6 units of PRBCs over 2 hours. The nurse notices the ECG showing peaked T-waves and widened QRS. What electrolyte abnormality is occurring?",
    o: ["Hypokalemia", "Hyperkalemia from potassium released from stored RBCs — stored blood accumulates extracellular K+ over time", "Hypercalcemia", "Hyponatremia"],
    a: 1,
    r: "Stored blood accumulates potassium as RBC membranes deteriorate (older blood = higher K+). Rapid infusion of multiple units can cause life-threatening hyperkalemia. ECG changes in order: peaked T-waves → prolonged PR → widened QRS → sine wave → VFib/asystole. Treatment: IV calcium (stabilizes cardiac membrane), insulin + glucose, and sodium bicarbonate.",
    s: "Shock & Emergency"
  },
  {
    q: "What is damage control resuscitation (DCR)?",
    o: ["Standard fluid resuscitation", "A strategy combining permissive hypotension, balanced blood product transfusion (1:1:1), and damage control surgery to address the lethal triad in severe hemorrhagic shock", "Aggressive crystalloid infusion", "Delayed surgical intervention"],
    a: 1,
    r: "DCR principles: (1) Permissive hypotension (SBP 80-90 until surgical control), (2) Minimize crystalloids (avoid dilutional coagulopathy), (3) Balanced blood products (1:1:1 ratio), (4) Damage control surgery (stop bleeding, temporary closure, ICU resuscitation, then definitive repair), (5) Early TXA (<3 hours), (6) Active warming.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of base deficit in trauma resuscitation?",
    o: ["It measures oxygen levels", "Base deficit reflects the severity of metabolic acidosis from tissue hypoperfusion; a base deficit >6 mEq/L indicates significant shock, >10 mEq/L indicates severe hemorrhage requiring aggressive resuscitation", "It measures kidney function", "It is not clinically useful"],
    a: 1,
    r: "Base deficit = difference between actual and normal bicarbonate levels. Reflects tissue oxygen debt from anaerobic metabolism. Mild: -2 to -5; Moderate: -6 to -9; Severe: <-10. Correlates with blood loss, transfusion requirements, and mortality. Serial measurements help track resuscitation adequacy. Improving base deficit = improving tissue perfusion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of point-of-care ultrasound (POCUS) in shock assessment?",
    o: ["Only for cardiac assessment", "POCUS rapidly evaluates cardiac function (EF, wall motion), volume status (IVC collapsibility), pericardial effusion, pleural effusion, pneumothorax, and free fluid (FAST exam) at the bedside without delay", "It replaces all lab tests", "Only for pregnancy assessment"],
    a: 1,
    r: "POCUS in shock: (1) Cardiac: estimate EF, wall motion, valve function, pericardial effusion (tamponade), (2) IVC: diameter and collapsibility (>50% collapse with respiration suggests hypovolemia), (3) Lungs: B-lines (pulmonary edema), absent sliding (pneumothorax), (4) Abdomen: free fluid (FAST), AAA, (5) DVT: compress femoral and popliteal veins. It rapidly differentiates shock types at the bedside.",
    s: "Shock & Emergency"
  },
  {
    q: "A septic patient is on norepinephrine and the nurse notes the peripheral IV is infiltrating. What is the MOST important intervention?",
    o: ["Restart the IV in the other arm", "Stop the infusion immediately and assess for tissue injury — extravasation of norepinephrine causes severe vasoconstriction and tissue necrosis; inject phentolamine (alpha-blocker) subcutaneously around the infiltration site", "Continue the infusion", "Apply warm compresses only"],
    a: 1,
    r: "Norepinephrine extravasation can cause severe tissue necrosis from local vasoconstriction and ischemia. Immediate actions: (1) STOP infusion, (2) Aspirate any remaining drug, (3) Inject phentolamine 5-10 mg in 10-20 mL NS subcutaneously around the site (alpha-blocker reverses vasoconstriction), (4) Elevate extremity, (5) Notify provider. Prevention: vasopressors should be administered through central venous catheters when possible.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the clinical manifestations of septic shock that differentiate it from other types of distributive shock?",
    o: ["Hypothermia only", "Fever or hypothermia, suspected or confirmed infection source, elevated WBC or leukopenia, elevated procalcitonin, positive blood cultures, and end-organ dysfunction (elevated lactate, AKI, altered mental status)", "Urticaria and angioedema", "Bradycardia and dry skin"],
    a: 1,
    r: "Septic shock-specific features: fever OR hypothermia (hypothermia is worse prognosis), identified or suspected infection source, elevated WBC (or leukopenia — immune exhaustion), positive cultures, elevated procalcitonin (bacterial infection marker), elevated lactate (>2 mmol/L), and requires vasopressors for MAP ≥65 despite adequate fluid resuscitation. Other distributive causes: anaphylaxis (allergen exposure), neurogenic (SCI).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the recommended endotracheal tube (ETT) cuff pressure monitoring in ICU patients, and why is it important?",
    o: ["Cuff pressure doesn't matter", "Maintain cuff pressure 20-30 cmH2O — too low allows aspiration and air leak, too high causes tracheal mucosal ischemia and necrosis", "Always inflate to maximum pressure", "Only check during intubation"],
    a: 1,
    r: "ETT cuff pressure: maintain 20-30 cmH2O (15-22 mmHg). Too low (<20): aspiration of oropharyngeal secretions and ventilator air leak. Too high (>30): tracheal mucosal capillary perfusion pressure is ~25-35 cmH2O; exceeding this causes ischemia, necrosis, tracheomalacia, and tracheal stenosis. Check every 8-12 hours using a cuff pressure manometer.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with septic shock develops a serum lactate of 8 mmol/L after 4 liters of crystalloid. MAP is 60 mmHg. What is the NEXT priority intervention?",
    o: ["Give more crystalloid", "Start vasopressor therapy (norepinephrine) via central line to achieve MAP ≥65 mmHg — continued fluid without vasopressors will not achieve MAP goal and risks fluid overload", "Wait for blood culture results", "Transfer to a higher level of care"],
    a: 1,
    r: "After adequate fluid resuscitation (30 mL/kg ≈ 2-3L), persistent hypotension (MAP <65) indicates vasopressor-dependent shock. Norepinephrine is first-line (alpha-1 + beta-1 activity). Start via peripheral IV or IO if central access not yet available, but place a central line urgently. Continued crystalloid without vasopressors delays hemodynamic stability and worsens edema.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Berlin definition severity classification for ARDS?",
    o: ["Based on chest X-ray findings only", "Classified by PaO2/FiO2 ratio: Mild 200-300 (26% mortality), Moderate 100-200 (32% mortality), Severe <100 (45% mortality), all measured on PEEP ≥5 cmH2O", "Based on patient symptoms only", "Based on CT findings only"],
    a: 1,
    r: "Berlin ARDS severity by PaO2/FiO2 ratio (on PEEP ≥5): Mild: 201-300 (mortality ~27%), Moderate: 101-200 (mortality ~32%), Severe: ≤100 (mortality ~45%). Example: PaO2 75 on FiO2 0.60 = P/F 125 = moderate ARDS. Severity guides treatment: prone positioning for moderate-severe (P/F <150), neuromuscular blockade for severe.",
    s: "Shock & Emergency"
  },
  {
    q: "A burn patient's urine turns dark red-brown. What complication should the nurse suspect?",
    o: ["UTI", "Myoglobinuria from rhabdomyolysis (muscle tissue destruction from deep burns or electrical injury) — risk for acute tubular necrosis and renal failure", "Hematuria from catheter trauma", "Normal concentrated urine"],
    a: 1,
    r: "Dark red-brown urine in burns = myoglobinuria (myoglobin from destroyed muscle). Myoglobin precipitates in renal tubules causing acute tubular necrosis (ATN) and AKI. Treatment: aggressive fluid resuscitation to maintain UO 1-2 mL/kg/hr (double normal target), alkalinize urine with sodium bicarbonate (increases myoglobin solubility), and consider mannitol. Monitor CK, creatinine, and potassium.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Lund-Browder chart and why is it preferred over the Rule of Nines for pediatric burns?",
    o: ["They are identical", "The Lund-Browder chart adjusts TBSA percentages for patient age, accounting for the fact that children have proportionally larger heads and smaller extremities than adults", "The Rule of Nines is more accurate for children", "The Lund-Browder is only for adults"],
    a: 1,
    r: "Rule of Nines assigns 9% to each body region but doesn't account for age-related proportional differences. Children have proportionally larger heads (up to 18% TBSA in infants vs 9% in adults) and smaller legs. The Lund-Browder chart provides age-adjusted percentages for accurate TBSA estimation in pediatric and adult patients.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between a first-degree burn and a full-thickness (third-degree) burn?",
    o: ["No clinical difference", "First-degree: superficial (epidermis only), red, painful, no blisters, heals in 3-5 days without scarring (sunburn). Full-thickness: destroys epidermis AND entire dermis, white/brown/charred, painless (nerve destruction), requires skin grafting", "First-degree is more serious", "Full-thickness heals faster"],
    a: 1,
    r: "First-degree: superficial epidermal burn (sunburn). Red, painful, dry, no blisters. Heals 3-5 days without scarring. NOT included in TBSA calculation for fluid resuscitation. Full-thickness (3rd degree): destroys epidermis + entire dermis. Leathery, white/waxy/charred, painless (sensory nerve destruction). Cannot regenerate — requires skin grafting. May need escharotomy if circumferential.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of carboxyhemoglobin (COHb) levels in burn patients?",
    o: ["COHb has no clinical significance", "COHb displaces oxygen from hemoglobin: <10% = mild, 10-20% = headache/confusion, 20-40% = nausea/disorientation, 40-60% = coma/seizures, >60% = death", "COHb only affects the lungs", "COHb indicates dehydration"],
    a: 1,
    r: "COHb levels indicate CO poisoning severity: <10%: smoker baseline/mild symptoms, 10-20%: headache, confusion, nausea, 20-40%: disorientation, visual disturbance, syncope, 40-60%: coma, seizures, cardiac arrhythmias, >60%: often fatal. Treatment: 100% FiO2 (all levels); consider hyperbaric oxygen for COHb >25%, pregnancy, neurological symptoms, or cardiac ischemia.",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing interventions are priorities for a patient with an electrical burn?",
    o: ["Treat like a thermal burn only", "Monitor ECG continuously (arrhythmia risk), assess for internal injuries along the current pathway (organ damage may be far greater than surface appearance), monitor urine for myoglobinuria, maintain high urine output", "Apply ice to entrance and exit wounds", "No special considerations beyond wound care"],
    a: 1,
    r: "Electrical burns: surface appearance often underestimates internal damage (iceberg effect). Priorities: (1) Continuous cardiac monitoring × 24-48h (risk of fatal arrhythmias), (2) Identify entrance and exit wounds (current travels between them, damaging everything in its path), (3) Aggressive fluid resuscitation (target UO 1-2 mL/kg/hr for myoglobinuria), (4) Monitor CK and K+ (rhabdomyolysis), (5) Assess for fractures (tetanic muscle contractions), (6) Neurovascular checks.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the mechanism of benzodiazepines in treating status epilepticus?",
    o: ["Sodium channel blockade", "Benzodiazepines enhance GABA-A receptor activity by increasing chloride channel opening frequency, causing neuronal hyperpolarization and inhibiting seizure activity", "Calcium channel blockade", "Glutamate receptor antagonism"],
    a: 1,
    r: "Benzodiazepines bind allosteric sites on GABA-A receptors, increasing chloride ion channel opening frequency. Chloride influx hyperpolarizes the neuron, making it less likely to fire. In SE, GABA receptors are internalized over time (30+ minutes), reducing benzodiazepine effectiveness. This is why benzodiazepines are FIRST-line but become less effective in prolonged SE.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with a known seizure disorder presents with altered mental status and subtle eye twitching. EEG shows continuous electrographic seizure activity. What is this condition?",
    o: ["Post-ictal state", "Non-convulsive status epilepticus (NCSE) — ongoing seizure activity without prominent motor manifestations, diagnosed only by EEG", "Delirium", "Medication side effect"],
    a: 1,
    r: "NCSE: continuous electrographic seizure activity without obvious convulsive movements. Presents as altered mental status, subtle motor signs (eye twitching, lip smacking), or apparent post-ictal state. Can ONLY be diagnosed by EEG. Causes the same excitotoxic neuronal damage as convulsive SE. Treatment: same antiepileptic medications as convulsive SE.",
    s: "Shock & Emergency"
  },
  {
    q: "What is levetiracetam (Keppra) and what is its role in seizure management?",
    o: ["An antibiotic", "A second-line antiepileptic drug for SE; advantages include IV formulation, no hepatic metabolism, minimal drug interactions, and no need for drug level monitoring", "A benzodiazepine", "A barbiturate"],
    a: 1,
    r: "Levetiracetam: second-line AED for SE with several advantages: (1) IV formulation (rapid administration), (2) Does NOT cause hepatic enzyme induction (minimal drug interactions), (3) No routine drug level monitoring needed, (4) Favorable side effect profile (irritability/behavioral changes are main concerns), (5) No cardiovascular side effects (unlike phenytoin). Dose: 20-60 mg/kg IV.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the key differences between epidural hematoma and subdural hematoma presentations?",
    o: ["They present identically", "Epidural: brief LOC → lucid interval → rapid deterioration (arterial bleeding). Subdural: progressive deterioration without lucid interval, or chronic presentation with gradual confusion (venous bleeding)", "Subdural has a lucid interval", "Epidural is always chronic"],
    a: 1,
    r: "Epidural: middle meningeal artery rupture from temporal bone fracture. Classic pattern: brief LOC → lucid interval (minutes to hours) → rapid deterioration from expanding hematoma. CT: lens/biconvex shape, does NOT cross suture lines. Subdural: bridging vein rupture. Usually no lucid interval, progressive deterioration. CT: crescent shape, crosses suture lines. Risk factors: elderly, anticoagulants, falls.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Glasgow Coma Scale (GCS) and how is it scored?",
    o: ["Only measures pupil response", "GCS assesses three components: Eye opening (1-4), Verbal response (1-5), Motor response (1-6); total score ranges from 3 (deep coma) to 15 (fully alert)", "It ranges from 0-10", "Only used in pediatric patients"],
    a: 1,
    r: "GCS: Eye (4=spontaneous, 3=to voice, 2=to pain, 1=none) + Verbal (5=oriented, 4=confused, 3=inappropriate words, 2=incomprehensible sounds, 1=none) + Motor (6=obeys commands, 5=localizes pain, 4=withdrawal, 3=abnormal flexion, 2=extension, 1=none). Total: 3-15. Severe TBI: 3-8 (intubation needed). Moderate: 9-12. Mild: 13-15.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of hypertonic saline in TBI management?",
    o: ["Only for dehydration", "Hypertonic saline (3% or 23.4% NaCl) creates an osmotic gradient that draws water from edematous brain tissue into the vasculature, reducing ICP and expanding intravascular volume", "It is contraindicated in TBI", "Only used for hyponatremia"],
    a: 1,
    r: "Hypertonic saline in TBI: creates osmotic gradient → draws water from brain tissue → reduces cerebral edema and ICP. Advantages over mannitol: (1) Does not cause diuresis (maintains intravascular volume), (2) Can be used with hypotension, (3) No osmolality ceiling. 23.4% NaCl (30 mL via central line) for acute herniation; 3% NaCl (250 mL bolus or continuous infusion) for sustained ICP management. Monitor sodium (target 145-155 mEq/L).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Cushing reflex and what does it indicate?",
    o: ["A stress response", "A late sign of brainstem compression: severe hypertension, bradycardia, and irregular respirations (Cheyne-Stokes or ataxic breathing) indicating impending herniation", "A normal physiological response", "A drug reaction"],
    a: 1,
    r: "Cushing's triad (hypertension + bradycardia + irregular respirations) is a LATE sign of critically elevated ICP causing brainstem compression. The brainstem responds to ischemia by triggering massive sympathetic discharge (severe hypertension), and the baroreceptor reflex causes compensatory bradycardia. This is a PRE-TERMINAL finding requiring immediate intervention.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a cardiac tamponade patient. Which intervention should be AVOIDED?",
    o: ["IV fluid bolus", "Positive pressure ventilation (intubation/PEEP) — it further reduces venous return to an already compromised heart, worsening tamponade physiology", "Pericardiocentesis", "Dopamine infusion"],
    a: 1,
    r: "AVOID in tamponade: (1) PPV/PEEP — increases intrathoracic pressure, further reducing venous return, (2) Diuretics — reduce preload (already compromised), (3) Nitroglycerin — reduces preload via venodilation. If intubation is absolutely necessary, use ketamine (maintains sympathetic tone) and avoid propofol (causes vasodilation). Fluid bolus is appropriate as a bridge.",
    s: "Shock & Emergency"
  },
  {
    q: "What is pulseless electrical activity (PEA) and which obstructive causes must be ruled out?",
    o: ["PEA is always fatal", "PEA is organized electrical activity on the monitor with no detectable pulse; reversible obstructive causes include tension pneumothorax, cardiac tamponade, and massive PE (the H's and T's)", "PEA only occurs in hypothermia", "PEA means the monitor is malfunctioning"],
    a: 1,
    r: "PEA: organized electrical rhythm on monitor but no palpable pulse or blood pressure. Obstructive causes (T's): Tension pneumothorax (needle decompression), Tamponade (pericardiocentesis), Thrombosis-PE (thrombolytics), Thrombosis-MI (PCI). These are REVERSIBLE if rapidly identified and treated during CPR. Bedside ultrasound during CPR can rapidly identify tamponade and severe RV strain from PE.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the indications for needle decompression of a tension pneumothorax?",
    o: ["Any pneumothorax", "Clinical diagnosis of tension pneumothorax with hemodynamic compromise: absent breath sounds on one side, tracheal deviation to opposite side, JVD, hypotension, and tachycardia — performed BEFORE chest X-ray", "Only after CT confirmation", "Only in operating room"],
    a: 1,
    r: "Needle decompression is performed based on CLINICAL diagnosis — do NOT delay for imaging. Indications: unilateral absent breath sounds + tracheal deviation + JVD + hypotension + respiratory distress. Technique: 14-16 gauge needle, 2nd intercostal space midclavicular line (or 5th ICS anterior axillary line). Rush of air confirms diagnosis. Follow with chest tube insertion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nursing priority when administering vasopressin in septic shock?",
    o: ["Titrate to blood pressure response", "Vasopressin is given at a FIXED dose (0.03-0.04 units/min) and is NOT titrated; monitor for skin ischemia (digital/mesenteric), hyponatremia, and cardiac ischemia", "Give as an IV bolus", "Only give orally"],
    a: 1,
    r: "Vasopressin in septic shock: FIXED dose 0.03-0.04 units/min IV — NOT titrated like catecholamines. Added as second vasopressor when norepinephrine is at moderate doses (to spare catecholamine dose). Adverse effects: digital ischemia (peripheral vasoconstriction), mesenteric ischemia, hyponatremia (V2 receptor activity), coronary vasoconstriction. Monitor extremities for mottling and ischemia.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in preventing catheter-associated urinary tract infections (CAUTI) in critically ill patients?",
    o: ["UTI prevention is not a nursing concern", "Daily assessment of catheter necessity, proper insertion technique, closed drainage system, perineal hygiene, securing the catheter to prevent traction, and advocating for removal as soon as clinically appropriate", "Change catheter every 24 hours", "Prophylactic antibiotics for all catheterized patients"],
    a: 1,
    r: "CAUTI prevention bundle: (1) Daily assess need — remove catheter as soon as possible, (2) Maintain closed drainage system, (3) Hand hygiene before catheter manipulation, (4) Proper perineal care, (5) Secure catheter to prevent traction/trauma, (6) Keep drainage bag below bladder level, (7) Monitor for signs of UTI (fever, cloudy urine, increasing WBC). Nurse-driven catheter removal protocols reduce CAUTI by 50-60%.",
    s: "Shock & Emergency"
  },
  {
    q: "A MODS patient develops acute liver failure with elevated ammonia levels. What neurological complication should the nurse monitor for?",
    o: ["Seizures only", "Hepatic encephalopathy — elevated ammonia crosses the blood-brain barrier causing confusion, asterixis (liver flap), somnolence, and potentially coma", "No neurological effects", "Only peripheral neuropathy"],
    a: 1,
    r: "Hepatic encephalopathy in MODS: the failing liver cannot metabolize ammonia → elevated serum ammonia → crosses BBB → neuronal dysfunction. Stages: Grade I (confusion, mood changes), Grade II (drowsiness, asterixis), Grade III (somnolence, marked confusion), Grade IV (coma). Treatment: lactulose (traps ammonia in gut for excretion), rifaximin (reduces ammonia-producing gut bacteria), protein restriction.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of prone positioning in ARDS management?",
    o: ["Only for comfort", "Prone positioning (16+ hours/day) improves V/Q matching, recruits dependent lung regions, and reduces mortality in moderate-severe ARDS (P/F ratio <150)", "It is contraindicated in ARDS", "Only for 30 minutes at a time"],
    a: 1,
    r: "Prone positioning: placing the patient face-down for ≥16 hours/day. Benefits: redistributes lung perfusion, recruits collapsed dorsal lung regions, improves V/Q matching, reduces VILI. The PROSEVA trial showed 50% relative reduction in 28-day mortality for severe ARDS. Requires experienced team, careful airway management, and monitoring for complications (facial edema, pressure injuries, ETT displacement).",
    s: "Shock & Emergency"
  },
  {
    q: "What assessment findings indicate Addisonian crisis as a cause of distributive shock?",
    o: ["Hyperglycemia and fluid retention", "Hypotension refractory to fluids/vasopressors, hypoglycemia, hyperkalemia, hyponatremia, hyperpigmentation, and history of chronic steroid use or adrenal disease", "Only hypotension", "Urticaria and wheezing"],
    a: 1,
    r: "Addisonian crisis (acute adrenal insufficiency): cortisol deficiency causes refractory distributive shock. Key clues: (1) Vasopressor-resistant hypotension, (2) Hypoglycemia (cortisol promotes gluconeogenesis), (3) Hyperkalemia (aldosterone deficiency → K+ retention), (4) Hyponatremia (aldosterone deficiency → Na+ wasting), (5) History of chronic steroids (abrupt withdrawal), (6) Hyperpigmentation. Treatment: IV hydrocortisone 100 mg bolus stat.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the pathophysiology of tension pneumothorax causing obstructive shock?",
    o: ["Air fills the alveoli", "Air enters the pleural space through a one-way valve mechanism, progressively accumulating and increasing intrapleural pressure, which compresses the heart and great vessels, kinking the IVC and reducing venous return", "Blood fills the pleural space", "The lung overexpands"],
    a: 1,
    r: "Tension pneumothorax: one-way valve mechanism allows air to enter the pleural space during inspiration but not escape during expiration. Progressive accumulation increases intrapleural pressure → lung collapse → mediastinal shift → compression of contralateral lung AND great vessels (IVC/SVC) → severely reduced venous return → obstructive shock → cardiac arrest if untreated.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse notes that a patient's IVC on bedside ultrasound is collapsing >50% with respiration. What does this finding suggest?",
    o: ["Fluid overload", "Volume depletion/hypovolemia — the IVC collapses significantly because reduced intravascular volume cannot maintain IVC distension against respiratory pressure changes", "Cardiac tamponade", "Normal finding in all patients"],
    a: 1,
    r: "IVC assessment by ultrasound: >50% collapse with respiration (or sniff test) suggests hypovolemia/fluid responsiveness. <50% collapse with IVC >2.1 cm suggests elevated right atrial pressure (fluid overload, right heart failure, tamponade, PE). This is a rapid bedside assessment tool but should be correlated with the full clinical picture. Limitations: mechanical ventilation, high PEEP.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of warm versus cold shock in the progression of septic shock?",
    o: ["They are the same", "Warm shock (early): high CO, low SVR, warm/flushed skin, bounding pulses. Cold shock (late): low CO (myocardial depression), high SVR, cool/mottled skin, weak pulses — represents decompensation and worse prognosis", "Cold shock always comes first", "Only children get warm shock"],
    a: 1,
    r: "Warm (hyperdynamic) shock: early sepsis phase with intact cardiac function, compensatory high CO, and vasodilated periphery (warm, flushed, bounding pulses). Cold (hypodynamic) shock: later phase when myocardial depression develops (cardiodepressant cytokines), CO drops, compensatory vasoconstriction occurs (cool, mottled, weak pulses). Cold shock requires addition of inotropes (dobutamine) to support the failing heart.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of continuous EEG monitoring in critical care beyond seizure detection?",
    o: ["EEG only detects seizures", "Continuous EEG monitors for non-convulsive seizures, tracks sedation depth, guides medication titration, detects delayed cerebral ischemia (DCI) after subarachnoid hemorrhage, and provides prognostic information in coma", "EEG is outdated technology", "Only used for sleep studies"],
    a: 1,
    r: "Continuous EEG in ICU: (1) Detect NCSE (up to 48% of treated convulsive SE continues subclinically), (2) Guide burst-suppression depth for barbiturate coma, (3) Detect delayed cerebral ischemia after SAH, (4) Prognosticate in post-cardiac arrest (reactivity predicts outcome), (5) Monitor sedation depth, (6) Detect lateralized periodic discharges. The nurse documents clinical events to correlate with EEG changes.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is preparing a patient for CRRT (continuous renal replacement therapy). What vascular access is required?",
    o: ["Standard peripheral IV", "A large-bore (11.5-13.5 Fr) dual-lumen catheter placed in the internal jugular, femoral, or subclavian vein, capable of sustaining blood flow rates of 150-300 mL/min", "Arteriovenous fistula", "PICC line"],
    a: 1,
    r: "CRRT requires a large-bore dual-lumen dialysis catheter (11.5-13.5 Fr). Preferred sites: right internal jugular (best flow, lowest complications), femoral (easy access but infection risk), subclavian (avoid if possible — stenosis risk). Blood is removed from the patient, filtered through the hemofiltration circuit (removing fluid, toxins, and electrolytes), and returned. Flow rates: 150-300 mL/min.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between CVVH, CVVHD, and CVVHDF in CRRT?",
    o: ["They are identical", "CVVH uses convection (hemofiltration) for solute removal, CVVHD uses diffusion (hemodialysis), and CVVHDF combines both convection and diffusion for superior solute and fluid removal", "Only CVVH is used in MODS", "They differ only in flow rate"],
    a: 1,
    r: "CVVH (continuous venovenous hemofiltration): convection removes large molecules well (cytokines). CVVHD (continuous venovenous hemodialysis): diffusion removes small molecules well (urea, creatinine). CVVHDF (continuous venovenous hemodiafiltration): combines both methods for optimal removal of both small and large molecules. CVVHDF is most commonly used in MODS for comprehensive solute clearance.",
    s: "Shock & Emergency"
  },
  {
    q: "What discharge education should the nurse provide to a patient who experienced anaphylaxis?",
    o: ["No follow-up needed", "Carry two epinephrine auto-injectors at all times, wear a medical alert bracelet, identify and avoid the trigger, follow up with an allergist for testing, create an anaphylaxis action plan, educate family on auto-injector use", "Only take antihistamines daily", "Avoid all outdoor activities"],
    a: 1,
    r: "Anaphylaxis discharge education: (1) Carry TWO auto-injectors (in case one fails or biphasic reaction), (2) Medical alert bracelet/necklace, (3) Allergen avoidance education (read food labels, inform restaurants), (4) Allergist referral for confirmatory testing and immunotherapy consideration, (5) Written anaphylaxis action plan, (6) Train family/friends/school staff on auto-injector use, (7) Know when to call 911 (any symptom recurrence). Auto-injector expiration dates must be tracked.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between mixed venous oxygen saturation (SvO2) from a PA catheter and central venous oxygen saturation (ScvO2) from a central line?",
    o: ["They are identical", "SvO2 (PA catheter) reflects true mixed venous blood from the entire body; ScvO2 (central line) approximates SvO2 but measures only upper body drainage and typically runs 5-7% higher than SvO2", "ScvO2 is more accurate", "SvO2 measures arterial oxygen"],
    a: 1,
    r: "SvO2: measured from the PA catheter tip in the pulmonary artery, where venous blood from the entire body is mixed. Gold standard for oxygen supply-demand balance. Normal: 60-80%. ScvO2: measured from a central venous catheter tip (SVC/right atrium), reflecting mainly upper body venous drainage. Typically 5-7% HIGHER than SvO2 (doesn't include coronary sinus blood). ScvO2 is a practical substitute when PA catheter is not available.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in preventing ventilator-associated pneumonia (VAP) in critically ill patients?",
    o: ["VAP prevention is the respiratory therapist's responsibility only", "Implement the VAP prevention bundle: HOB 30-45°, daily sedation vacation and readiness-to-extubate assessment, oral care with chlorhexidine every 2-4 hours, peptic ulcer prophylaxis, DVT prophylaxis, and subglottic suctioning", "Only antibiotics prevent VAP", "VAP cannot be prevented"],
    a: 1,
    r: "VAP bundle (evidence-based interventions that reduce VAP by 50-70%): (1) HOB 30-45° (reduces aspiration), (2) Daily sedation interruption + spontaneous breathing trial (reduces ventilator days), (3) Oral care with chlorhexidine 0.12% q2-4h (reduces bacterial colonization), (4) Peptic ulcer prophylaxis, (5) DVT prophylaxis, (6) Subglottic suctioning ETT, (7) Maintain ETT cuff pressure 20-30 cmH2O.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient in neurogenic shock is receiving norepinephrine. Why is norepinephrine preferred over pure alpha agonists in this setting?",
    o: ["It is cheaper", "Norepinephrine provides both alpha-1 vasoconstriction (to restore vascular tone) and beta-1 cardiac support (to address bradycardia risk), making it ideal for neurogenic shock's dual hemodynamic problem", "Pure alpha agonists are always preferred", "Norepinephrine only affects the heart"],
    a: 1,
    r: "Neurogenic shock has TWO hemodynamic problems: (1) Loss of vascular tone (vasodilation → hypotension) and (2) Loss of cardiac sympathetic innervation (bradycardia). Norepinephrine addresses both: alpha-1 effect restores vascular tone, beta-1 effect supports heart rate and contractility. A pure alpha agonist (phenylephrine) would raise BP but could worsen bradycardia via reflex mechanism.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the key elements of the primary survey (ABCDE) in trauma assessment?",
    o: ["Only checking vital signs", "A (Airway with C-spine protection), B (Breathing and ventilation), C (Circulation with hemorrhage control), D (Disability/neurological status), E (Exposure/environment) — performed in order with life threats addressed immediately", "Physical examination from head to toe", "Only IV access and fluids"],
    a: 1,
    r: "Primary survey (ATLS): A: Airway patency with cervical spine immobilization. B: Breathing — chest auscultation, respiratory rate, SpO2 (tension pneumo, open pneumo, flail chest). C: Circulation — pulse, BP, hemorrhage control (direct pressure, tourniquet), IV access × 2 large-bore. D: Disability — GCS, pupils, lateralizing signs. E: Exposure — fully undress, log-roll for posterior exam, then prevent hypothermia. Treat each life threat when found before moving to next step.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the FAST exam and when is it used in shock assessment?",
    o: ["A fasting blood glucose test", "Focused Assessment with Sonography in Trauma — a bedside ultrasound evaluating 4 windows (RUQ, LUQ, suprapubic, subxiphoid) for free fluid in the abdomen and pericardial effusion", "A cardiac stress test", "A neurological assessment"],
    a: 1,
    r: "FAST exam: 4 ultrasound windows: (1) RUQ (Morrison's pouch — most sensitive for free fluid), (2) LUQ (splenorenal recess), (3) Suprapubic (pouch of Douglas/rectovesical), (4) Subxiphoid (pericardial effusion). Positive FAST in unstable patient → immediate surgical exploration. Extended FAST (eFAST) adds bilateral anterior chest views for pneumothorax.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 5: FINAL EXPANSION =====
  {
    q: "What is Class III hemorrhagic shock and what are the expected clinical findings?",
    o: ["Minimal vital sign changes", "30-40% blood volume loss (1500-2000 mL): HR >120, SBP <90, RR 30-40, UO 5-15 mL/hr, confused/anxious, cold and clammy — immediate blood product transfusion required", "Only tachycardia", "Hypertension and bradycardia"],
    a: 1,
    r: "Class III hemorrhage (30-40% blood loss, 1500-2000 mL): vital signs overtly abnormal. HR >120 (maximal compensation), SBP <90 (decompensation begins), RR 30-40, UO 5-15 mL/hr, mental status confused/anxious. Requires IMMEDIATE crystalloid AND blood product transfusion. This is the stage where the transition from compensated to decompensated shock occurs.",
    s: "Shock & Emergency"
  },
  {
    q: "How does the nurse assess skin mottling as a sign of shock?",
    o: ["Mottling is not clinically significant", "Mottling (patchy blue-purple discoloration) starts around the knees and extends proximally with worsening shock; the mottling score (0-5 based on extent) correlates with mortality in septic shock", "Mottling only occurs in hypothermia", "It is always a skin allergy"],
    a: 1,
    r: "Skin mottling: patchy blue-purple discoloration from microcirculatory dysfunction. Mottling score: 0 = none, 1 = coin-sized around knee, 2 = extending above knee, 3 = mid-thigh, 4 = beyond thigh, 5 = beyond groin. Higher scores correlate with increased mortality. Mottling is a clinical sign of poor peripheral perfusion and can be assessed without any equipment.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is preparing to administer norepinephrine. What IV access is preferred and why?",
    o: ["Any peripheral IV is fine", "Central venous access (IJ, subclavian, or femoral) is preferred because norepinephrine extravasation from a peripheral IV can cause severe tissue necrosis; if peripheral IV is the only option, use a large vein and monitor closely", "Only via PICC line", "IM injection"],
    a: 1,
    r: "Vasopressors should be administered via central venous catheter: (1) Reliable access, (2) Prevents extravasation injury (peripheral NE extravasation causes severe tissue necrosis requiring phentolamine injection and possible skin grafting), (3) Ensures consistent drug delivery. However, SSC 2021 guidelines allow short-term peripheral vasopressors (large proximal vein, <12 hours) when central access is not yet available — do NOT delay vasopressors for central line placement.",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing assessment distinguishes anaphylaxis from a vasovagal reaction?",
    o: ["They are clinically identical", "Anaphylaxis: tachycardia, hypotension, urticaria/angioedema, bronchospasm, warm/flushed skin. Vasovagal: bradycardia, hypotension, pallor, diaphoresis, no urticaria, no respiratory symptoms — resolves with supine positioning", "Only lab tests can differentiate them", "Vasovagal always has urticaria"],
    a: 1,
    r: "Key differences: ANAPHYLAXIS: tachycardia (sympathetic response), urticaria/angioedema (mast cell mediators), bronchospasm/stridor (lower/upper airway edema), warm flushed skin (vasodilation). VASOVAGAL: BRADYCARDIA (parasympathetic), pale/diaphoretic (vagal tone), NO skin findings, NO respiratory symptoms, resolves rapidly with supine position. Critical to differentiate because epinephrine for anaphylaxis, NO epinephrine needed for vasovagal.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the pathophysiology of warm shock versus cold shock in distributive states?",
    o: ["Only temperature differences", "Warm shock: vasodilation + compensatory increased CO = adequate tissue O2 delivery but maldistribution. Cold shock: myocardial depression + exhausted compensation = inadequate CO and tissue O2 delivery, representing clinical deterioration", "Cold shock always comes first", "They represent different diseases"],
    a: 1,
    r: "Warm shock (hyperdynamic): massive vasodilation (low SVR) but the heart compensates with increased CO. Tissues receive blood flow but it bypasses capillary beds (arteriovenous shunting). Skin is warm and flushed. Cold shock (hypodynamic): cardiodepressant cytokines impair contractility, CO drops. Compensatory vasoconstriction (high SVR) occurs but cannot maintain perfusion. Skin becomes cool and mottled. Cold shock = decompensation = worse prognosis.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the indications for stress-dose steroids in septic shock?",
    o: ["All sepsis patients", "Hydrocortisone 200 mg/day IV for septic shock refractory to adequate fluid resuscitation AND norepinephrine ≥0.25 mcg/kg/min (or equivalent) — NOT for sepsis without shock", "Only for patients with known adrenal insufficiency", "Dexamethasone for all ICU patients"],
    a: 1,
    r: "Stress-dose hydrocortisone indications: septic shock not responding to adequate fluids + vasopressors (NE dose ≥0.25 mcg/kg/min or escalating). Mechanism: restores vascular catecholamine sensitivity. Dose: hydrocortisone 50 mg IV q6h or 200 mg/day continuous infusion. Duration: taper off when vasopressors discontinued. Do NOT use for sepsis without shock. ACTH stimulation test is NOT required before starting.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the nursing considerations for enteral feeding in a critically ill patient on vasopressors?",
    o: ["Enteral feeding is contraindicated on any vasopressor", "Low-rate trophic enteral feeding (10-20 mL/hr) can be initiated on LOW-dose vasopressors if hemodynamically stable; hold feeds if vasopressor requirements are escalating, MAP <60, or there are signs of bowel ischemia", "Full-rate feeds from admission", "Only TPN on vasopressors"],
    a: 1,
    r: "Current evidence supports early low-rate enteral feeding on stable, low-dose vasopressors. Benefits: maintains gut mucosal integrity, reduces bacterial translocation, prevents ileus. Hold feeds when: escalating vasopressor doses (unstable hemodynamics), MAP persistently <60, active resuscitation, signs of bowel ischemia (abdominal distension, bloody NG aspirate, rising lactate). Monitor gastric residual volumes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is blood lactate and what are the normal and abnormal values?",
    o: ["A marker of liver function only", "Normal <2 mmol/L; 2-4 mmol/L indicates mild tissue hypoperfusion; >4 mmol/L indicates significant shock and triggers fluid resuscitation per SSC guidelines; serial trending is more important than a single value", "Normal is 0 mmol/L", "It only matters in sepsis"],
    a: 1,
    r: "Lactate: produced by anaerobic metabolism when tissue O2 delivery is inadequate. Normal: <2 mmol/L. Mild elevation (2-4): mild tissue hypoperfusion or non-shock causes (medications, liver disease, seizures). Significant (≥4): triggers aggressive resuscitation per SSC. Serial trending is KEY: declining lactate (>10% clearance per hour) = improving perfusion. Rising or persistently elevated = worsening shock.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on a ventilator develops acute desaturation. What is the DOPE mnemonic for troubleshooting?",
    o: ["A pain assessment tool", "D (Displacement of ETT), O (Obstruction — mucus plug/biting), P (Pneumothorax), E (Equipment failure — circuit disconnect, ventilator malfunction)", "A medication calculation", "A fall prevention protocol"],
    a: 1,
    r: "DOPE mnemonic for acute ventilator desaturation: D = Displacement (ETT extubated, in right mainstem, or in esophagus — check end-tidal CO2, bilateral breath sounds, ETT depth at teeth), O = Obstruction (mucus plug, patient biting tube — suction, insert bite block), P = Pneumothorax (especially tension — assess breath sounds, tracheal deviation), E = Equipment (circuit disconnect, O2 source empty, ventilator malfunction — bag-valve-mask while troubleshooting).",
    s: "Shock & Emergency"
  },
  {
    q: "What is thromboelastography (TEG) and how is it used in massive transfusion?",
    o: ["A type of ECG", "A point-of-care viscoelastic test that evaluates the entire coagulation cascade in real-time, guiding targeted blood product administration (FFP, platelets, cryoprecipitate, TXA) rather than empiric ratios", "A CT scan technique", "A blood typing method"],
    a: 1,
    r: "TEG/ROTEM: point-of-care viscoelastic tests that assess clot formation, strength, and lysis in real-time (~15 minutes vs ~1 hour for traditional labs). Parameters guide TARGETED product administration: low R-time/CT → give FFP, low MA/MCF → give platelets, low fibrinogen → give cryoprecipitate, high LY30 → give TXA. This reduces wasteful transfusion and improves outcomes compared to empiric 1:1:1 in some studies.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between anion gap and non-anion gap metabolic acidosis in shock?",
    o: ["They are treated identically", "Anion gap acidosis (AG >12): lactate accumulation from tissue hypoperfusion (most common in shock). Non-anion gap: hyperchloremic acidosis from excessive NS resuscitation — AG is normal but bicarbonate is low", "Only AG acidosis occurs in shock", "Non-AG acidosis is more dangerous"],
    a: 1,
    r: "Anion gap = Na - (Cl + HCO3); normal 8-12. In shock, elevated AG is primarily from LACTIC ACIDOSIS (unmeasured anion). The nurse can distinguish the two: AG metabolic acidosis (elevated AG, normal Cl) = tissue hypoperfusion/shock → treat the cause. Non-AG metabolic acidosis (normal AG, elevated Cl) = iatrogenic from NS over-resuscitation → switch to balanced crystalloids (LR).",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing assessment findings would indicate a chemical burn requiring special decontamination?",
    o: ["All burns are treated identically", "Chemical burns require IMMEDIATE copious water irrigation (20-30+ minutes), identification of the chemical agent (acid vs alkali), checking pH of wound runoff, and avoiding specific antidotes for some chemicals (e.g., do NOT use water for elemental sodium/lithium burns)", "Only neutralizing the chemical is needed", "Chemical burns never require irrigation"],
    a: 1,
    r: "Chemical burn priorities: (1) REMOVE contaminated clothing (protect healthcare workers with PPE), (2) COPIOUS water irrigation for 20-30+ minutes (do NOT try to neutralize — exothermic reaction can worsen injury), (3) Check wound pH — irrigate until pH 7.0-7.5, (4) Identify the agent: ALKALI burns (cement, oven cleaner) cause deeper injury than ACID (coagulation necrosis limits penetration). Special cases: hydrofluoric acid → calcium gluconate application.",
    s: "Shock & Emergency"
  },
  {
    q: "What is inhalation injury and how is it classified?",
    o: ["Only involves the lungs", "Three levels: supraglottic (heat injury → edema, stridor), tracheobronchial (chemical injury → sloughing, secretions), and parenchymal (systemic toxins — CO, cyanide → cellular hypoxia)", "Only CO poisoning", "Does not affect prognosis"],
    a: 1,
    r: "Inhalation injury has three levels: (1) Supraglottic (above vocal cords): HEAT injury causing edema, stridor, drooling → intubate early. (2) Tracheobronchial (trachea to bronchi): CHEMICAL injury from combustion byproducts → mucosal sloughing, bronchospasm, copious secretions → aggressive pulmonary toilet. (3) Parenchymal (alveolar): systemic toxins (CO, cyanide) → cellular hypoxia. Inhalation injury increases mortality by 20% and fluid requirements by 50%.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of the pentad of TTP (thrombotic thrombocytopenic purpura) and how does it present similarly to MODS?",
    o: ["TTP is the same as MODS", "TTP pentad: thrombocytopenia, microangiopathic hemolytic anemia, renal failure, neurological changes, and fever — can mimic MODS but requires specific treatment with plasma exchange (plasmapheresis) not just supportive care", "TTP only affects platelets", "TTP never occurs in ICU patients"],
    a: 1,
    r: "TTP can mimic MODS presentation but requires completely different treatment. Classic pentad: (1) Thrombocytopenia (platelets <30K), (2) Microangiopathic hemolytic anemia (schistocytes on smear, elevated LDH), (3) Renal failure, (4) Neurological changes (confusion, seizures), (5) Fever. Treatment: emergent plasma exchange (removes ADAMTS13 inhibitor). Do NOT give platelets (worsens microvascular thrombosis). Mortality without treatment: >90%; with plasma exchange: <20%.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Braden Scale and why is it especially important in shock and MODS patients?",
    o: ["A pain assessment scale", "A pressure injury risk assessment tool scoring sensory perception, moisture, activity, mobility, nutrition, and friction/shear; critically ill patients on vasopressors score very high risk due to immobility, hypoperfusion, and edema", "A neurological assessment", "A fall risk assessment"],
    a: 1,
    r: "Braden Scale: 6 subscales scored 1-4 (lower = higher risk). Total ≤18 = at risk, ≤12 = very high risk. Critically ill shock/MODS patients score high risk because: (1) Decreased sensory perception (sedation), (2) Constant moisture (diaphoresis, incontinence), (3) Bedbound (immobility), (4) Compromised nutrition, (5) Friction from turning. Vasopressors worsen risk by decreasing peripheral skin perfusion. Implement pressure injury prevention: turn q2h (if hemodynamically stable), specialty mattress, nutritional optimization.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the target temperature management range for post-cardiac arrest patients and how does it relate to TBI management?",
    o: ["Hyperthermia is beneficial", "Targeted temperature management: maintain 32-36°C for 24+ hours post-cardiac arrest; in TBI, maintain strict normothermia (36-37.5°C) and aggressively treat fever, which worsens secondary brain injury", "Temperature management is not important", "Always cool to 28°C"],
    a: 1,
    r: "Post-cardiac arrest: TTM 32-36°C for ≥24 hours reduces neurological injury from global hypoxic-ischemic encephalopathy. TBI: strict normothermia (36-37.5°C) — fever increases metabolic demand of injured brain by 10-13% per degree Celsius, worsening secondary injury. Treat fever aggressively with acetaminophen, cooling blankets, and addressing infection sources. Prophylactic hypothermia is not currently recommended for TBI (EUROTHERM trial).",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is assessing a patient for compartment syndrome after a crush injury. What clinical findings would confirm this diagnosis?",
    o: ["Only swelling", "The 6 P's: Pain out of proportion to injury (especially with passive stretch), Pressure (tense compartment), Paresthesia, Paralysis (late), Pulselessness (very late), and Pallor — compartment pressure >30 mmHg or within 30 mmHg of diastolic pressure confirms diagnosis", "Only absence of pulses", "Normal vital signs rule it out"],
    a: 1,
    r: "Compartment syndrome: 6 P's in order of appearance: (1) PAIN out of proportion (earliest, most reliable sign — especially with passive stretch of muscles in the compartment), (2) PRESSURE (tense, firm compartment on palpation), (3) PARESTHESIA (nerve ischemia), (4) PARALYSIS (muscle ischemia — late), (5) PULSELESSNESS (very late — arterial compression), (6) PALLOR. Treatment: emergent fasciotomy. Do NOT elevate the extremity above the heart (reduces perfusion pressure).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of continuous pulse oximetry in shock monitoring and what are its limitations?",
    o: ["SpO2 measures tissue perfusion", "SpO2 measures arterial hemoglobin oxygen saturation; limitations in shock include: poor signal in vasoconstriction/poor perfusion, falsely normal in CO poisoning and methemoglobinemia, does not measure tissue oxygen delivery or ventilation", "SpO2 has no limitations", "SpO2 measures CO2 levels"],
    a: 1,
    r: "SpO2 measures the percentage of hemoglobin saturated with oxygen. Limitations in shock: (1) Poor perfusion/vasoconstriction → weak or absent signal (common in shock!), (2) CO poisoning → SpO2 reads COHb as OxyHb (falsely normal), (3) Methemoglobinemia → SpO2 converges toward 85% regardless of actual saturation, (4) Anemia → SpO2 may be normal but O2 content is low, (5) Does NOT measure PaCO2 or ventilation adequacy. Use ABG for definitive assessment.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of the 'golden hour' in trauma and shock management?",
    o: ["It is exactly 60 minutes", "The concept that mortality is significantly reduced when definitive care (hemorrhage control, surgical intervention) is achieved within the first hour after injury; each minute of delay increases mortality", "It refers to visiting hours", "It only applies to cardiac arrest"],
    a: 1,
    r: "The 'golden hour' (coined by R. Adams Cowley) emphasizes that definitive interventions within ~60 minutes of injury dramatically improve survival. In hemorrhagic shock: each 3-minute delay in hemorrhage control increases mortality by 1%. In sepsis: each hour of antibiotic delay increases mortality by 7.6%. The nurse's role: rapid assessment, early recognition, immediate interventions, and efficient communication to minimize time to definitive care.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between collateral and definitive interventions in shock management?",
    o: ["They are the same", "Collateral (supportive) interventions maintain organ perfusion temporarily (fluids, vasopressors, ventilators); definitive interventions address the root cause (surgery for hemorrhage, antibiotics for sepsis, epinephrine for anaphylaxis)", "Only definitive interventions matter", "Only supportive care is used"],
    a: 1,
    r: "Supportive interventions: IV fluids (restore volume), vasopressors (restore vascular tone), mechanical ventilation (support oxygenation), CRRT (replace renal function). These buy TIME but don't cure the underlying problem. Definitive interventions: surgery (stop hemorrhage, remove infection source), antibiotics (kill causative organism), epinephrine (reverse anaphylaxis), pericardiocentesis (relieve tamponade). Effective shock management requires BOTH simultaneously.",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing interventions help prevent ventilator-induced lung injury (VILI) in ARDS?",
    o: ["High tidal volumes for better oxygenation", "Low tidal volume ventilation (6 mL/kg PBW), plateau pressure ≤30 cmH2O, adequate PEEP, monitoring for auto-PEEP, and avoiding ventilator dyssynchrony through appropriate sedation and paralysis", "No interventions can prevent VILI", "Only increasing FiO2"],
    a: 1,
    r: "VILI prevention: (1) Low Vt (6 mL/kg PBW, not actual weight), (2) Plateau pressure ≤30 cmH2O (barotrauma prevention), (3) Adequate PEEP (prevents atelectrauma — cyclic opening/closing of alveoli), (4) Monitor for auto-PEEP (air trapping), (5) Sedation/paralysis for patient-ventilator synchrony (prevents breath stacking), (6) Driving pressure monitoring (plateau pressure minus PEEP, target ≤15 cmH2O). These strategies reduce mortality in ARDS by ~25%.",
    s: "Shock & Emergency"
  },
  {
    q: "What is end-tidal CO2 (ETCO2) monitoring and what does it indicate in shock states?",
    o: ["Only used for confirming intubation", "ETCO2 measures exhaled CO2 and reflects cardiac output (CO2 production requires perfusion); in cardiac arrest, rising ETCO2 indicates effective CPR and ROSC; in shock, low ETCO2 indicates poor cardiac output", "It measures oxygen levels", "Only used in operating rooms"],
    a: 1,
    r: "ETCO2 uses: (1) Confirm ETT placement (gold standard — CO2 detected = in trachea), (2) CPR quality indicator (ETCO2 >10 mmHg = adequate compressions), (3) ROSC detection (sudden ETCO2 rise to >40), (4) Shock monitoring — ETCO2 reflects cardiac output because CO2 must be delivered to lungs by perfusion. Low ETCO2 in intubated patient = low CO (shock, PE) or hyperventilation. Trending ETCO2 can guide resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Parkland formula for burn fluid resuscitation?",
    o: ["10 mL/kg/% TBSA", "4 mL × body weight (kg) × % TBSA burned = total fluid for 24 hours; give half in first 8 hours from time of injury, remaining half over next 16 hours; use lactated Ringer's", "2 mL × body weight × % TBSA", "No formula is used"],
    a: 1,
    r: "Parkland formula: 4 mL × kg × %TBSA = 24-hour crystalloid volume. Give 50% in first 8 hours (from TIME OF BURN, not ED arrival) and 50% over remaining 16 hours. Use LR (preferred). Example: 80 kg, 40% TBSA = 4 × 80 × 40 = 12,800 mL/24h. First 8h: 6,400 mL = 800 mL/hr. The formula is a STARTING POINT — titrate to urine output 0.5-1 mL/kg/hr.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Modified Early Warning Score (MEWS) and how does it help detect shock early?",
    o: ["A cardiac rhythm assessment", "An aggregate vital sign scoring system that assigns points for abnormalities in HR, BP, RR, temperature, and LOC; a rising score triggers escalation of care and can identify deteriorating patients before overt shock develops", "A pain assessment tool", "Only used in emergency departments"],
    a: 1,
    r: "MEWS scores 5 parameters (0-3 points each): systolic BP, heart rate, respiratory rate, temperature, and level of consciousness. Score ≥5 typically triggers rapid response team activation. The power of MEWS: it detects TRENDS in deterioration that might be missed when individual vital signs are viewed in isolation. Nurse-driven MEWS documentation and escalation protocols have reduced unexpected ICU admissions and cardiac arrests.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 6: CONTINUED EXPANSION =====
  {
    q: "What is the role of vasopressin in shock management?",
    o: ["It replaces norepinephrine", "Vasopressin acts on V1 receptors to cause vasoconstriction independent of catecholamine receptors; it is used as a second-line agent at a fixed dose of 0.03-0.04 U/min to augment MAP when catecholamine receptor downregulation occurs", "It increases heart rate", "It is first-line for all shock types"],
    a: 1,
    r: "Vasopressin: non-catecholamine vasopressor acting on V1 receptors (vascular smooth muscle). Benefits: (1) Works when catecholamine receptors downregulate (tachyphylaxis), (2) Fixed dose (0.03-0.04 U/min — not titrated), (3) Catecholamine-sparing effect, (4) Restores endogenous vasopressin deficiency in septic shock. Side effects: digital and mesenteric ischemia at higher doses, hyponatremia. Added as second-line to norepinephrine per SSC guidelines.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient with sepsis has a central line and the nurse suspects a catheter-related bloodstream infection (CRBSI). What assessment findings support this suspicion?",
    o: ["Central lines never cause infections", "New-onset fever, chills, or hemodynamic instability without another identified source; erythema, purulence, or tenderness at the insertion site; positive blood cultures drawn from the catheter with shorter time-to-positivity compared to peripheral cultures", "Only insertion site redness", "Only elevated WBC count"],
    a: 1,
    r: "CRBSI suspicion: (1) Fever/chills without other identified source (especially if onset coincides with line use), (2) Site findings: erythema, warmth, purulence, tenderness, (3) Hemodynamic instability in a patient without other obvious infection source. Diagnosis: paired blood cultures (one from catheter hub, one peripheral) — differential time to positivity (catheter culture positive ≥2 hours earlier = CRBSI). Common organisms: coagulase-negative staph, S. aureus, Candida. Prevention: CHG bathing, proper insertion technique, daily line assessment, prompt removal of unnecessary lines.",
    s: "Shock & Emergency"
  },
  {
    q: "What is fluid responsiveness and how does the nurse assess it?",
    o: ["All hypotensive patients need fluids", "Fluid responsiveness means cardiac output will increase with additional volume; assessed by passive leg raise (CO increase ≥10%), pulse pressure variation (>13% in mechanically ventilated patients), or stroke volume variation — only ~50% of ICU patients are actually fluid responsive", "It is the same as fluid overload", "It cannot be assessed bedside"],
    a: 1,
    r: "Fluid responsiveness: will the patient's CO increase with more IV fluid? Only ~50% of ICU patients respond to fluids — the other 50% just become edematous. Assessment methods: (1) Passive leg raise (PLR): CO increase ≥10% = responsive, (2) Pulse pressure variation (PPV): >13% variation with respiration in fully mechanically ventilated patients, (3) Stroke volume variation (SVV): >12-13%, (4) IVC collapsibility on ultrasound: >40% variation = fluid responsive. Static measures (CVP) are POOR predictors of fluid responsiveness.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the signs and symptoms of fat embolism syndrome after long bone fracture?",
    o: ["Only pain at the fracture site", "Classic triad: respiratory distress (hypoxemia, tachypnea), neurological changes (confusion, agitation, decreased LOC), and petechial rash (chest, axillae, conjunctivae) — typically occurs 24-72 hours after long bone fracture", "Occurs immediately after injury", "Only affects the lungs"],
    a: 1,
    r: "Fat embolism syndrome: fat globules from bone marrow enter circulation → lodge in pulmonary and systemic microvasculature. Triad: (1) Respiratory (most common, earliest): dyspnea, tachypnea, hypoxemia, ARDS pattern, (2) Neurological: confusion, agitation, seizures, coma (cerebral fat emboli), (3) Petechiae (pathognomonic but occurs in only 50%): non-palpable, transient, found on chest, axillae, conjunctivae. Onset: 24-72 hours post-fracture. Treatment: supportive (O2, ventilation). Prevention: early fracture fixation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of a widening pulse pressure in shock?",
    o: ["Always indicates hypovolemia", "Widening pulse pressure (difference between SBP and DBP increases) occurs in early distributive/septic shock due to decreased SVR (DBP drops); in contrast, narrowing pulse pressure occurs in hypovolemic and cardiogenic shock (compensatory vasoconstriction raises DBP)", "Pulse pressure has no clinical significance", "It always means improved perfusion"],
    a: 1,
    r: "Pulse pressure (PP) = SBP - DBP. Normal: 30-40 mmHg. Widening PP (>40): vasodilation in distributive shock (DBP drops from low SVR), aortic regurgitation, increased intracranial pressure (Cushing response). Narrowing PP (<25): vasoconstriction in hypovolemic/cardiogenic shock (SVR rises, DBP increases relative to SBP), or decreased stroke volume. PP is an early indicator of shock type BEFORE overt hypotension develops.",
    s: "Shock & Emergency"
  },
  {
    q: "A nurse is caring for a patient with neurogenic shock from a C5 spinal cord injury. The patient's HR is 42 and BP is 70/40. What medications should the nurse anticipate?",
    o: ["Only IV fluids", "Vasopressors (norepinephrine preferred) for hypotension from loss of sympathetic vascular tone, AND atropine or temporary pacing for bradycardia from unopposed vagal tone; judicious IV fluids (avoid over-resuscitation without cardiac monitoring)", "Only epinephrine", "Only atropine"],
    a: 1,
    r: "Neurogenic shock treatment targets both components: (1) HYPOTENSION (loss of SVR): norepinephrine (alpha + beta effects, restores vascular tone AND provides some cardiac support), phenylephrine (pure alpha if tachycardic — rare in neurogenic shock). (2) BRADYCARDIA (unopposed vagal tone): atropine 0.5 mg IV (blocks vagal activity), dopamine low-dose (chronotropic effect), or temporary transcutaneous/transvenous pacing for refractory bradycardia. IV fluids: cautious boluses (500-1000 mL) — over-resuscitation causes pulmonary edema without addressing the underlying vasodilation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Cushing triad and what does it indicate?",
    o: ["A metabolic finding", "Hypertension (widening pulse pressure), bradycardia, and irregular respirations — it indicates brainstem compression from critically elevated ICP and is a LATE, ominous sign of impending herniation", "A cardiac rhythm", "A sign of improving neurological status"],
    a: 1,
    r: "Cushing triad (Cushing response): (1) Hypertension with widening pulse pressure (brain attempts to maintain CPP by raising MAP), (2) Bradycardia (baroreceptor response to hypertension), (3) Irregular respirations (brainstem respiratory centers compressed). This is a LATE sign — by the time Cushing triad appears, brainstem herniation may be imminent or occurring. The nurse should NOT wait for Cushing triad to report rising ICP — earlier signs (decreasing GCS, pupil changes, new headache) are more actionable.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in preventing secondary brain injury after TBI?",
    o: ["Only monitoring ICP", "Prevent hypotension (SBP <90 doubles mortality), prevent hypoxia (PaO2 <60 doubles mortality), maintain normothermia, prevent hyperglycemia, avoid ICP elevations from positioning/activities, and maintain normocarbia (PaCO2 35-40 mmHg)", "TBI injury is fixed and cannot worsen", "Only surgical intervention can help"],
    a: 1,
    r: "Secondary brain injury prevention (the nurse's most critical role): (1) Prevent hypotension: even ONE episode of SBP <90 doubles mortality — maintain MAP for CPP 60-70, (2) Prevent hypoxia: maintain SpO2 >94%, PaO2 >60, (3) Normothermia: fever increases CMRO2 10-13%/degree, (4) Glucose control: 140-180 (hyperglycemia worsens ischemia), (5) Normocarbia: PaCO2 35-40 (hypocapnia causes vasoconstriction → ischemia), (6) ICP management: positioning, osmotherapy, CSF drainage, (7) Seizure prophylaxis: phenytoin/levetiracetam for 7 days.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nursing assessment for a patient with a chest tube for hemothorax?",
    o: ["Only check the insertion site", "Monitor drainage amount, color, and consistency hourly; assess for air leak in the water seal chamber; maintain system below chest level; assess breath sounds bilaterally; report drainage >200 mL/hr (suggests active hemorrhage requiring surgical exploration)", "Only record total daily output", "Remove the tube if drainage stops"],
    a: 1,
    r: "Chest tube assessment: (1) Drainage: amount (expected: decreasing over time), color (blood → serosanguinous → serous), report >200 mL/hr for ≥2 hours (may need thoracotomy), (2) Air leak: bubbling in water seal = air leak (expected initially in pneumothorax, concerning if new or worsening), (3) Tidaling: water level fluctuates with respiration (confirms patent tube), (4) System integrity: all connections tight, system below chest, no kinks, (5) Crepitus: subcutaneous emphysema around insertion site, (6) Breath sounds: bilateral, improving.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the ABCDE approach to trauma assessment?",
    o: ["A general health screening", "Airway (with C-spine protection), Breathing (ventilation and oxygenation), Circulation (hemorrhage control, pulse, BP), Disability (neurological status — GCS, pupils), Exposure (fully expose patient, prevent hypothermia) — assessed in strict order of life-threatening priority", "Only applicable in the ED", "Starts with circulation"],
    a: 1,
    r: "ABCDE primary survey (ATLS): (A) Airway: open/patent? Protect C-spine. Intubate if needed. (B) Breathing: bilateral breath sounds? Chest wall movement? Treat tension pneumothorax/open pneumothorax/massive hemothorax. (C) Circulation: pulse quality, skin color/temp, stop external hemorrhage (direct pressure, tourniquet), 2 large-bore IVs, blood products. (D) Disability: GCS, pupils (size, reactivity, symmetry), glucose check. (E) Exposure: remove all clothing, log-roll for posterior exam, prevent hypothermia (warm blankets, warm fluids, warm room). ALWAYS address A before B before C.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of capillary refill time (CRT) as an assessment tool in shock?",
    o: ["CRT is unreliable and should never be used", "CRT >3 seconds suggests poor peripheral perfusion; the ANDROMEDA-SHOCK trial showed CRT-guided resuscitation (targeting CRT <3 sec) was non-inferior to lactate-guided resuscitation and may reduce organ dysfunction in septic shock", "CRT only works in children", "Normal CRT is >5 seconds"],
    a: 1,
    r: "Capillary refill time: press nail bed for 5 seconds, release, measure time for color return. Normal: <3 seconds. Prolonged CRT (>3 sec) indicates poor peripheral perfusion (vasoconstriction, low CO). ANDROMEDA-SHOCK trial: CRT-guided resuscitation (targeting CRT <3 sec at fingertip over sternum) was non-inferior to lactate-guided and showed a trend toward reduced 28-day mortality. CRT is FREE, rapid, bedside, and can be reassessed every few minutes during resuscitation — a valuable adjunct to lactate.",
    s: "Shock & Emergency"
  },
  {
    q: "A patient on CRRT (continuous renal replacement therapy) develops hypotension. What should the nurse assess first?",
    o: ["Stop CRRT permanently", "Assess the CRRT machine: check for excessive ultrafiltration rate, blood loss into the circuit, circuit clotting, and access issues; also assess the patient for other causes of hypotension (bleeding, sepsis, cardiac) — temporarily reduce or stop ultrafiltration while stabilizing", "Increase the ultrafiltration rate", "CRRT never causes hypotension"],
    a: 1,
    r: "CRRT-related hypotension causes: (1) Excessive ultrafiltration rate (removing fluid faster than vascular refilling), (2) Blood loss in the circuit (filter clotting with significant blood volume in the circuit), (3) Rapid solute shifts (osmotic changes), (4) Vasodilatory effect of citrate anticoagulation. Nursing actions: (1) Reduce or pause ultrafiltration, (2) Give fluid bolus (NS or albumin), (3) Assess for non-CRRT causes (sepsis, bleeding, cardiac), (4) Check circuit for clotting, (5) Verify access function (recirculation). Report to nephrologist.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between burn depth classifications?",
    o: ["All burns are the same depth", "Superficial (first-degree): epidermis only, red/painful, no blisters. Partial-thickness (second-degree): extends into dermis — superficial partial: moist/blistered/very painful; deep partial: waxy/less painful. Full-thickness (third-degree): all skin layers destroyed, leathery/painless", "Only two depth categories exist", "Depth doesn't affect treatment"],
    a: 1,
    r: "Burn depth classification: (1) Superficial (1st degree): epidermis only, erythema, painful, no blisters (sunburn). Heals in 3-7 days, no scarring. (2) Superficial partial (2nd degree): into papillary dermis, blisters, moist, VERY painful (nerve endings exposed), blanches. Heals in 7-21 days. (3) Deep partial (2nd degree): into reticular dermis, waxy appearance, decreased sensation, may need grafting. (4) Full-thickness (3rd degree): all layers destroyed, leathery/dry, painless (nerves destroyed), does NOT blanch. Requires grafting. (5) Fourth-degree: extends to muscle/bone.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the key nursing considerations when administering hypertonic saline for elevated ICP?",
    o: ["Can be given through any IV", "23.4% NaCl must be given via central line (risk of phlebitis/tissue necrosis); 3% NaCl can be given peripherally; monitor serum sodium closely (target <155-160 mEq/L); monitor serum osmolality (hold if >320); assess neurological status for improvement", "No monitoring is needed", "Only given orally"],
    a: 1,
    r: "Hypertonic saline administration: (1) 23.4%: CENTRAL LINE ONLY, given as 30 mL bolus over 10-15 min (potent but risk of phlebitis), (2) 3%: can give peripherally, 250-500 mL bolus or continuous infusion (150-300 mL/hr). Monitoring: (1) Serum Na q4-6h (target <155-160), (2) Serum osmolality (hold if >320), (3) Neurological status, (4) ICP response, (5) Volume status (HTS can cause fluid overload from osmotic shift). Advantages over mannitol: no diuretic effect, effective at higher osmolalities, better in hypovolemic patients.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the pathophysiology of DIC (disseminated intravascular coagulation) in the context of MODS?",
    o: ["DIC only causes bleeding", "DIC involves simultaneous widespread microvascular thrombosis (consuming clotting factors and platelets) AND hemorrhage (from factor depletion); in MODS, it contributes to organ failure through microvascular thrombosis and tissue ischemia", "DIC is the same as DVT", "DIC only occurs in cancer patients"],
    a: 1,
    r: "DIC pathophysiology: (1) Trigger (sepsis, trauma, burns) activates coagulation cascade systemically, (2) Widespread microvascular thrombi form → organ ischemia (contributes to MODS), (3) Clotting factors and platelets are CONSUMED → paradoxical bleeding (consumptive coagulopathy). Lab findings: prolonged PT/PTT, low fibrinogen (<100), elevated D-dimer, low platelets, schistocytes on blood smear. Treatment: treat the UNDERLYING CAUSE (antibiotics, surgery), supportive transfusion (FFP, cryoprecipitate, platelets). DIC is a SECONDARY process — always search for the trigger.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of prone positioning in severe ARDS?",
    o: ["It has no benefit", "Turning the patient face-down for ≥16 hours/day improves V/Q matching, reduces mortality by ~50% in severe ARDS (P/F <150), and should be initiated early; requires a trained team of 4-5 members for safe turning", "Only used as a last resort", "It worsens oxygenation"],
    a: 1,
    r: "Prone positioning mechanism: (1) Redistributes ventilation to previously dependent lung regions, (2) Improves V/Q matching (better ventilation-perfusion coupling), (3) Reduces pleural pressure gradient, (4) Improves chest wall compliance, (5) Facilitates secretion drainage. PROSEVA trial: 16+ hours prone/day reduced 28-day mortality from 33% to 16% in severe ARDS. Nursing considerations: secure all lines/tubes, protect face/pressure points, eye care, monitor hemodynamics during turn, document skin assessment.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between epinephrine auto-injector use in adults versus children?",
    o: ["The same dose for all ages", "Adults and children >30 kg: 0.3 mg (EpiPen). Children 15-30 kg: 0.15 mg (EpiPen Jr). Inject into the lateral thigh (vastus lateralis), can be given through clothing; hold for 10 seconds; massage the site; always carry two devices", "Children never need epinephrine", "Only IV epinephrine is effective"],
    a: 1,
    r: "EpiPen dosing: (1) EpiPen (0.3 mg): adults and children >30 kg, (2) EpiPen Jr (0.15 mg): children 15-30 kg. For infants <15 kg: no commercial auto-injector — use 0.01 mg/kg IM from a vial. Technique: (1) Remove safety cap, (2) Push firmly against lateral thigh (through clothing is acceptable), (3) Hold 10 seconds, (4) Massage injection site, (5) Note time administered. Patients should carry TWO auto-injectors (30-40% of reactions require a second dose). Teach: 'Blue to the sky, orange to the thigh.'",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing interventions help prevent hospital-acquired infections in critically ill shock patients?",
    o: ["Only hand washing", "Hand hygiene, CHG bathing, VAP bundle (HOB 30°, oral care, sedation vacation, DVT/peptic ulcer prophylaxis), CLABSI bundle (insertion checklist, daily line assessment, CHG dressing, scrub the hub), CAUTI bundle (daily catheter necessity review, aseptic insertion)", "Antibiotics for all ICU patients", "No interventions are effective"],
    a: 1,
    r: "Evidence-based infection prevention bundles: VAP bundle: (1) HOB 30-45°, (2) Chlorhexidine oral care, (3) Daily sedation interruption + extubation readiness, (4) DVT prophylaxis, (5) Peptic ulcer prophylaxis. CLABSI bundle: (1) Hand hygiene + maximal barrier precautions during insertion, (2) CHG skin prep, (3) Optimal site selection (subclavian preferred), (4) Daily line necessity review, (5) CHG-impregnated dressings. CAUTI bundle: (1) Aseptic insertion, (2) Daily necessity review (remove ASAP), (3) Secure catheter. General: CHG bathing, antimicrobial stewardship.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between synchronized cardioversion and defibrillation?",
    o: ["They are identical procedures", "Synchronized cardioversion delivers energy timed to the R wave (used for organized rhythms like SVT, Afib, Aflutter with pulse); defibrillation delivers unsynchronized energy (used for pulseless VT and VF where there is no organized rhythm to synchronize with)", "Defibrillation uses lower energy", "Cardioversion is only used during cardiac arrest"],
    a: 1,
    r: "Synchronized cardioversion: shock delivered ON the R wave (avoids T wave, preventing R-on-T phenomenon → VF). Used for unstable tachyarrhythmias WITH a pulse: SVT, Afib, Aflutter, VT with pulse. Energy: start low (50-100J biphasic for SVT/Aflutter, 120-200J for Afib). Defibrillation: shock delivered immediately (no synchronization) for VF/pulseless VT — the rhythm is chaotic so there is no R wave to synchronize with. Energy: max (200J biphasic, 360J monophasic). Critical nursing error: using SYNC mode in VF (machine cannot find R wave → no shock delivered).",
    s: "Shock & Emergency"
  },
  {
    q: "What is carboxyhemoglobin (COHb) and when should it be measured in burn patients?",
    o: ["It is the same as regular hemoglobin", "COHb forms when carbon monoxide binds to hemoglobin with 200-250x greater affinity than oxygen; measured via co-oximetry (NOT pulse oximetry) in all patients with suspected smoke inhalation; levels >20% indicate significant CO poisoning requiring 100% O2 or hyperbaric oxygen", "Only measure in outpatients", "It resolves without treatment"],
    a: 1,
    r: "COHb: CO binds hemoglobin 200-250x more avidly than O2 → displaces oxygen → tissue hypoxia. Measurement: arterial or venous co-oximetry (standard pulse ox reads COHb as OxyHb → FALSELY NORMAL SpO2). Levels: non-smokers <3%, smokers up to 10%. >20-25%: significant poisoning (headache, confusion, nausea). >40%: severe (seizures, coma, cardiac ischemia). >60%: often fatal. Treatment: 100% O2 via NRB (COHb half-life: 5-6h on room air → 60-90 min on 100% O2). Hyperbaric O2: for levels >25%, neurological symptoms, pregnancy, cardiac ischemia.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Glasgow Coma Scale and how is it scored?",
    o: ["A pain assessment tool", "GCS scores three components: Eye opening (1-4: spontaneous=4, to voice=3, to pain=2, none=1), Verbal (1-5: oriented=5, confused=4, inappropriate words=3, incomprehensible sounds=2, none=1), Motor (1-6: obeys commands=6, localizes pain=5, withdraws=4, abnormal flexion=3, extension=2, none=1); total range 3-15", "A respiratory assessment", "Only assesses motor function"],
    a: 1,
    r: "GCS components: EYE (E): 4=spontaneous, 3=to voice, 2=to pain, 1=none. VERBAL (V): 5=oriented, 4=confused, 3=inappropriate words, 2=incomprehensible sounds, 1=none. MOTOR (M): 6=obeys commands, 5=localizes pain (crosses midline toward central stimulus), 4=withdrawal, 3=abnormal flexion (decorticate), 2=extension (decerebrate), 1=none. Total: 3-15. Severe TBI: GCS ≤8 (intubation threshold). ALWAYS report components separately (E3V4M5=12 is more informative than just '12').",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of jugular venous distension (JVD) in different types of shock?",
    o: ["JVD is always normal in the ICU", "JVD indicates elevated right atrial pressure: PRESENT in obstructive shock (tamponade, tension pneumothorax, PE), right heart failure, and fluid overload. ABSENT in hypovolemic shock and distributive shock (low preload). JVD helps differentiate shock types at the bedside", "JVD only indicates dehydration", "JVD is always pathological"],
    a: 1,
    r: "JVD interpretation in shock: (1) JVD PRESENT + hypotension = obstructive shock (tamponade: muffled heart sounds; tension pneumo: absent breath sounds; massive PE: RV strain on ECG) or right heart failure. (2) JVD ABSENT + hypotension = hypovolemic (flat neck veins from volume depletion) or distributive shock (vasodilation with low preload). Assess JVD with HOB at 30-45° — distension >3 cm above the sternal angle is abnormal. Combined with other clinical signs, JVD rapidly narrows the differential diagnosis of shock.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in organ donation assessment in a patient with devastating TBI?",
    o: ["The nurse has no role in organ donation", "Notify the organ procurement organization (OPO) upon identification of an impending or actual death per hospital policy; the nurse does NOT make the donation request but maintains hemodynamic stability, normothermia, and organ perfusion while the OPO coordinates with the family", "The nurse asks the family about donation", "Organ donation only occurs after brain death testing"],
    a: 1,
    r: "Nurse's role in organ donation: (1) IDENTIFY potential donors (devastating brain injury, impending death) and NOTIFY OPO per hospital policy — federal regulation (CMS Conditions of Participation) requires timely referral, (2) The OPO designated requestor approaches the family (NOT the nurse or treating physician — trained requestors have higher consent rates), (3) Maintain donor management: hemodynamic stability, normothermia, oxygenation, urine output, electrolyte balance to preserve organ function, (4) Support the family through the process emotionally and informationally.",
    s: "Shock & Emergency"
  },
  {
    q: "What is refractory status epilepticus and how is it managed?",
    o: ["Any seizure lasting >5 minutes", "Status epilepticus that persists despite adequate doses of first-line (benzodiazepine) AND second-line agents; requires ICU admission, continuous EEG monitoring, and IV anesthetic infusions (midazolam, propofol, or pentobarbital) titrated to burst-suppression on EEG", "It always resolves with benzodiazepines", "It only occurs in elderly patients"],
    a: 1,
    r: "Refractory SE: seizures persist despite first-line (adequate benzodiazepine doses) AND second-line (fosphenytoin/valproate/levetiracetam) agents. Management: (1) ICU admission, (2) Intubation for airway protection, (3) Continuous EEG monitoring (target: burst-suppression or seizure cessation), (4) IV anesthetic infusion: midazolam (0.2 mg/kg bolus, then 0.05-2 mg/kg/hr) OR propofol (2 mg/kg bolus, then 30-200 mcg/kg/min — watch for PRIS with prolonged use) OR pentobarbital (5 mg/kg bolus, then 1-5 mg/kg/hr). (5) Maintain for 24-48h before weaning. Super-refractory SE: persists >24h on anesthetic — consider ketamine, immunotherapy.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the potential complications of massive fluid resuscitation?",
    o: ["There are no complications from IV fluids", "Pulmonary edema (ARDS), abdominal compartment syndrome, dilutional coagulopathy, hyperchloremic metabolic acidosis (from NS), hypothermia (cold fluids), tissue edema impairing wound healing, and cerebral edema — these complications can be as dangerous as the shock itself", "Only infection from the IV site", "Only volume overload"],
    a: 1,
    r: "Massive fluid resuscitation complications: (1) Pulmonary edema/ARDS (fluid shift to alveoli), (2) Abdominal compartment syndrome (bowel/retroperitoneal edema → IAP >20), (3) Dilutional coagulopathy (clotting factors diluted), (4) Hyperchloremic metabolic acidosis (NS contains 154 mEq/L Cl), (5) Hypothermia (cold IV fluids), (6) Tissue edema (impairs wound healing, GI function, oxygen diffusion), (7) Cerebral edema (worsens ICP in TBI). This is why modern resuscitation focuses on BALANCED approaches: permissive hypotension, damage control resuscitation, and early assessment of fluid responsiveness.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Allen test and when does the nurse perform it?",
    o: ["A blood typing test", "The Allen test assesses collateral ulnar artery blood flow BEFORE radial artery cannulation; the patient clenches the fist while the nurse occludes both radial and ulnar arteries, then releases the ulnar — palm should re-perfuse within 5-7 seconds (positive test = adequate collateral flow)", "A neurological assessment", "A test for allergies"],
    a: 1,
    r: "Allen test procedure: (1) Have patient clench fist tightly (blanch the hand), (2) Occlude BOTH radial and ulnar arteries, (3) Release the fist (hand should be pale), (4) Release ONLY the ulnar artery, (5) Observe for hand re-perfusion (color return within 5-7 seconds = POSITIVE/normal = safe to cannulate radial artery). If hand remains pale >7 seconds = NEGATIVE/abnormal = inadequate ulnar collateral flow → radial artery cannulation is risky (hand ischemia if radial artery thromboses). Modified Allen test uses pulse oximetry on the thumb for objective assessment.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of albumin in the resuscitation of burn patients?",
    o: ["Albumin is never used in burns", "After the first 24 hours of crystalloid resuscitation, 5% albumin is used to maintain intravascular oncotic pressure and reduce overall fluid requirements as capillary integrity begins to restore; it is NOT given in the first 24 hours when capillary leak is maximal", "Albumin is the first-line fluid in burns", "Only 25% albumin is used"],
    a: 1,
    r: "Albumin in burns: NOT given in the first 24 hours — capillary leak is maximal, so albumin would leak into the interstitium (worsening edema with no intravascular benefit). After 24 hours: capillary integrity begins to restore. 5% albumin is used to: (1) Maintain intravascular oncotic pressure, (2) Reduce crystalloid requirements, (3) Improve hemodynamics. Typical dosing: albumin infusion titrated to maintain serum albumin >2 g/dL and adequate hemodynamics. Some burn centers use the Brooke formula (includes colloid) from the start in select patients.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of continuous EEG monitoring in the ICU?",
    o: ["EEG is only for epilepsy clinics", "Continuous EEG detects nonconvulsive seizures (present in up to 34% of critically ill patients), guides treatment of SE, monitors burst-suppression during therapeutic coma, and identifies secondary brain injury patterns in TBI patients", "It only monitors heart rhythm", "It is not useful in critically ill patients"],
    a: 1,
    r: "Continuous EEG (cEEG) ICU indications: (1) Detect nonconvulsive seizures (NCSE): up to 34% of ICU patients with altered consciousness have electrographic seizures — invisible without EEG, (2) Monitor SE treatment: confirm seizure cessation, guide medication titration, (3) Therapeutic coma monitoring: target burst-suppression (equal burst and suppression periods), (4) TBI monitoring: detect secondary injury, cortical spreading depolarization, (5) Post-cardiac arrest neuroprognostication: malignant patterns (burst-suppression without reactivity, status epilepticus). Nursing: electrode skin prep, artifact reduction, hourly documentation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the pulmonary artery wedge pressure (PAWP) and what does it represent?",
    o: ["Venous blood pressure", "PAWP is obtained by inflating the PA catheter balloon in a distal pulmonary artery, measuring the pressure transmitted from the left atrium; it estimates left ventricular preload. Normal: 8-12 mmHg. Elevated in LV failure/fluid overload; low in hypovolemia", "It measures right heart pressure only", "It is the same as CVP"],
    a: 1,
    r: "PAWP (pulmonary artery wedge/occlusion pressure): balloon inflation occludes the distal PA branch → creates a static column of blood between the catheter tip and the left atrium → measures LA pressure ≈ LVEDP (left ventricular end-diastolic pressure = LV preload). Normal: 8-12 mmHg. Elevated PAWP: LV failure, mitral stenosis, fluid overload. Low PAWP: hypovolemia, distributive shock. PAWP differentiates cardiogenic pulmonary edema (PAWP >18) from non-cardiogenic/ARDS (PAWP <18).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the primary survey in trauma (ABCDE) and what life-threatening conditions must be identified during the 'B' assessment?",
    o: ["B stands for blood pressure", "B (Breathing): identify and treat immediately life-threatening thoracic injuries — tension pneumothorax, open pneumothorax, massive hemothorax, and flail chest with pulmonary contusion; assess RR, breath sounds, chest wall symmetry, tracheal position, SpO2", "B only means checking respiratory rate", "B assessment comes after all others"],
    a: 1,
    r: "B (Breathing) life-threatening conditions: (1) Tension pneumothorax: absent breath sounds, tracheal deviation, hypotension → needle decompression, (2) Open pneumothorax (sucking chest wound): air entering through chest wall defect → three-sided occlusive dressing, (3) Massive hemothorax: >1500 mL blood in pleural space → chest tube + possible thoracotomy, (4) Flail chest: ≥3 consecutive ribs fractured in ≥2 places → paradoxical movement, underlying pulmonary contusion → pain management, may need intubation. Assessment: inspection (symmetry, wounds), auscultation (bilateral), palpation (crepitus, instability), percussion (dullness vs hyperresonance).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Surviving Sepsis Campaign 2021 recommendation for the type of IV fluid used in initial sepsis resuscitation?",
    o: ["Normal saline is always preferred", "Balanced crystalloids (lactated Ringer's or Plasma-Lyte) are preferred over normal saline for initial resuscitation due to reduced risk of hyperchloremic metabolic acidosis and acute kidney injury with balanced solutions", "Only colloids should be used", "No specific fluid is recommended"],
    a: 1,
    r: "SSC 2021 weak recommendation: use balanced crystalloids (LR, Plasma-Lyte) rather than NS for resuscitation. Evidence: SMART trial and BaSICS trial showed balanced crystalloids associated with reduced composite of death, new RRT, and persistent renal dysfunction compared to NS. NS concerns: supraphysiologic chloride (154 mEq/L vs plasma 100-106) → hyperchloremic metabolic acidosis, renal afferent arteriole vasoconstriction → reduced GFR. Exceptions: NS preferred in hyperkalemia (no K+ in NS) and TBI (LR is slightly hypotonic).",
    s: "Shock & Emergency"
  },
  // ===== BATCH 7: LARGE TESTBANK EXPANSION =====
  {
    q: "What is the Parkland formula adjustment for electrical burn injuries?",
    o: ["Use standard Parkland formula", "Electrical burns require MORE fluid than the Parkland formula predicts because internal tissue damage far exceeds visible surface burns; target UO 1-2 mL/kg/hr (double normal target) to prevent myoglobin-induced acute kidney injury from rhabdomyolysis", "Reduce fluids in electrical burns", "No fluid resuscitation is needed"],
    a: 1,
    r: "Electrical burn fluid needs: visible burn underestimates injury (current travels through tissue causing deep muscle damage). Complications: rhabdomyolysis (myoglobin release → AKI), cardiac arrhythmias, compartment syndrome. Fluid target: UO 1-2 mL/kg/hr (vs 0.5-1 mL/kg/hr for thermal burns) to flush myoglobin. Add sodium bicarbonate to alkalinize urine if myoglobinuria present (dark/cola-colored urine). All electrical burns require cardiac monitoring for 24+ hours (delayed arrhythmias possible).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the mechanism of action of mannitol in reducing ICP?",
    o: ["It is an antibiotic", "Mannitol is an osmotic diuretic that creates an osmotic gradient drawing water from brain tissue into the intravascular space, reducing cerebral edema and ICP; it also improves blood rheology by decreasing blood viscosity", "It directly kills brain cells", "It raises blood pressure only"],
    a: 1,
    r: "Mannitol mechanisms: (1) Primary: osmotic gradient — mannitol stays in the intravascular space (cannot cross intact BBB), drawing water from brain parenchyma into blood vessels → reduces cerebral edema/ICP. (2) Secondary: improves blood rheology (decreases blood viscosity) → improves cerebral microcirculation → reflexive vasoconstriction → reduced cerebral blood volume → reduced ICP. Dose: 0.25-1 g/kg IV bolus over 15-20 min. Onset: 15-30 min. Monitor: serum osmolality (hold if >320), renal function, electrolytes (hypokalemia from diuresis).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between decorticate and decerebrate posturing?",
    o: ["They are the same", "Decorticate: abnormal flexion (arms flexed/adducted, legs extended) — indicates damage above the midbrain (cortical/subcortical). Decerebrate: extension of all extremities (arms extended/pronated, legs extended) — indicates damage at the midbrain/brainstem level and carries a worse prognosis", "Decorticate is always worse", "Neither has neurological significance"],
    a: 1,
    r: "Decorticate (GCS Motor 3): arms FLEXED and adducted to chest, wrists flexed, legs extended. Indicates: damage to cerebral hemispheres or internal capsule (above red nucleus). 'COR' = toward the CORE. Decerebrate (GCS Motor 2): arms EXTENDED and internally rotated, wrists pronated, legs extended. Indicates: damage to midbrain/upper pons (at or below red nucleus). Worse prognosis. Transition from decorticate to decerebrate = DETERIORATION (descending lesion). Neither pattern is voluntary — both indicate severe brain injury.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between epidural and subdural hematomas?",
    o: ["They are identical conditions", "Epidural: arterial bleeding (middle meningeal artery) between skull and dura, lens-shaped on CT, lucid interval common, requires emergent craniotomy. Subdural: venous bleeding (bridging veins) between dura and arachnoid, crescent-shaped on CT, more common in elderly/anticoagulated patients", "Only subdural requires surgery", "Both are always chronic"],
    a: 1,
    r: "Epidural hematoma: (1) Source: middle meningeal artery (temporal bone fracture), (2) Location: between skull and dura, (3) CT: biconvex/lens-shaped (does not cross suture lines), (4) Classic: lucid interval then rapid deterioration, (5) Treatment: emergent surgical evacuation. Subdural hematoma: (1) Source: bridging veins torn by acceleration-deceleration, (2) Location: between dura and arachnoid, (3) CT: crescent-shaped (crosses suture lines), (4) Common in: elderly, alcoholics, anticoagulated patients (brain atrophy = stretched bridging veins), (5) Can be acute, subacute, or chronic.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the nursing priorities during rapid sequence intubation (RSI)?",
    o: ["Only hand the doctor the laryngoscope", "Pre-oxygenate with 100% O2 for 3-5 minutes, prepare medications (induction agent + neuromuscular blocker), apply cricoid pressure (Sellick maneuver if directed), confirm ETT placement with ETCO2 and bilateral breath sounds, secure the tube and note depth at the teeth", "No preparation is needed", "Only suction equipment"],
    a: 1,
    r: "RSI nursing priorities: (1) PRE-RSI: SOAP-ME preparation (Suction, Oxygen, Airway equipment, Pharmacy/meds, Monitoring/Equipment), preoxygenate 3-5 min with NRB or BVM at 100% O2, (2) DURING: push induction agent (etomidate, ketamine, propofol), push paralytic (succinylcholine or rocuronium), apply cricoid pressure if requested, hand laryngoscope, monitor SpO2 continuously. (3) POST: confirm ETCO2 (gold standard for placement), auscultate bilateral breath sounds AND epigastrium, document ETT depth at teeth (usually 21-23 cm in adults), secure with tape/commercial holder, CXR for depth confirmation, initiate ventilator settings.",
    s: "Shock & Emergency"
  },
  {
    q: "What is Cushing's ulcer and how does it relate to TBI?",
    o: ["A pressure injury", "Cushing's ulcer is a gastric/duodenal ulcer caused by elevated ICP stimulating the vagus nerve, leading to excessive gastric acid secretion; TBI patients are at high risk and require stress ulcer prophylaxis with PPI or H2 blocker", "A type of brain lesion", "A skin condition"],
    a: 1,
    r: "Cushing's ulcer: stress ulcer specifically associated with CNS injury (TBI, stroke, neurosurgery). Mechanism: elevated ICP → stimulates vagal nuclei → excessive gastric acid secretion → gastric/duodenal mucosal erosion → bleeding. Differs from Curling's ulcer (burn-related, caused by mucosal ischemia from hypovolemia). Prevention: PPI (pantoprazole 40 mg IV daily) or H2 blocker (famotidine) for ALL TBI patients. Early enteral nutrition also helps protect the GI mucosa.",
    s: "Shock & Emergency"
  },
  {
    q: "What is Curling's ulcer and how does it differ from Cushing's ulcer?",
    o: ["They are the same ulcer", "Curling's ulcer occurs in BURN patients due to splanchnic vasoconstriction and mucosal ischemia; Cushing's ulcer occurs in BRAIN INJURY patients due to vagal stimulation and excessive acid secretion — both are types of stress ulcers requiring prophylaxis", "Neither requires treatment", "They only occur together"],
    a: 1,
    r: "Curling's ulcer (burns): mechanism is splanchnic vasoconstriction → mucosal ischemia + decreased mucosal blood flow → erosion. Risk increases with burn >35% TBSA. Prevention: early enteral feeding + PPI/H2 blocker. Cushing's ulcer (brain injury): mechanism is vagal stimulation → hypersecretion of gastric acid → perforation risk. Prevention: PPI + early enteral feeding. Mnemonic: CURling = bURn, CUShing = brUSh (brain). Both are indications for stress ulcer prophylaxis in the ICU.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the phases of septic shock and their hemodynamic characteristics?",
    o: ["Septic shock has only one phase", "Hyperdynamic (warm) phase: high CO, low SVR, warm extremities, bounding pulses, wide pulse pressure. Hypodynamic (cold) phase: low CO, high SVR, cool/mottled extremities, weak pulses — indicates cardiac decompensation and worse prognosis", "Only cold shock exists", "Phases are not clinically relevant"],
    a: 1,
    r: "Septic shock phases: WARM SHOCK (early/hyperdynamic): massive cytokine-mediated vasodilation → low SVR, compensatory high CO, warm flushed skin, bounding pulses, wide pulse pressure, fever. ScvO2 may be HIGH (mitochondrial dysfunction → cells can't use O2). COLD SHOCK (late/hypodynamic): myocardial depressant factors (TNF-α, IL-1β) + volume depletion → falling CO, compensatory vasoconstriction → rising SVR, cool/mottled skin, weak pulses, narrow pulse pressure. Cold shock = decompensation = critical.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of point-of-care ultrasound (POCUS) in shock assessment?",
    o: ["Ultrasound is only for pregnancy", "POCUS rapidly assesses cardiac function (EF, RV dilation), volume status (IVC diameter/collapsibility), lung pathology (B-lines for pulmonary edema, sliding sign for pneumothorax), and free fluid (FAST) — allowing rapid differentiation of shock type at the bedside", "Only available in radiology", "It replaced all other monitoring"],
    a: 1,
    r: "POCUS in shock (RUSH exam — Rapid Ultrasound for Shock and Hypotension): (1) PUMP: cardiac function (parasternal views → EF, RV dilation, pericardial effusion), (2) TANK: volume status (IVC diameter/collapsibility → preload assessment, B-lines → pulmonary edema, FAST → free fluid), (3) PIPES: DVT assessment, aortic assessment. POCUS differentiates: hypovolemic (small IVC, hyperdynamic heart), cardiogenic (dilated LV, poor EF), obstructive (RV dilation/PE, pericardial effusion), distributive (hyperdynamic heart, normal/large IVC). Available within 5 minutes at bedside.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in blood glucose management in critically ill patients?",
    o: ["Maintain blood glucose <80 mg/dL", "Maintain blood glucose 140-180 mg/dL using insulin infusion protocols; avoid both hyperglycemia (>180: impairs immune function, worsens outcomes) and hypoglycemia (<70: causes brain injury, increases mortality); use consistent monitoring every 1-2 hours on insulin drips", "Blood glucose doesn't matter in shock", "Only oral medications for glucose control"],
    a: 1,
    r: "Glucose management in critical illness: Target 140-180 mg/dL (NICE-SUGAR trial showed tight control <110 increased mortality from hypoglycemia). Hyperglycemia (>180): stress hormone-mediated, impairs neutrophil function, promotes infection, worsens ischemic brain injury. Hypoglycemia (<70): causes brain injury, cardiac arrhythmias, increased mortality. Insulin infusion: continuous IV (regular insulin), monitor glucose q1-2h initially, adjust based on protocol. Avoid: dextrose-containing maintenance fluids unless needed, variable insulin doses without protocol.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the relationship between oxygen delivery (DO2) and oxygen consumption (VO2) in shock?",
    o: ["They are always equal", "Normally VO2 is independent of DO2 (supply exceeds demand). In shock, when DO2 falls below a critical threshold, VO2 becomes supply-dependent (VO2 drops as DO2 drops) — this is the point of tissue oxygen debt and anaerobic metabolism begins", "VO2 never changes", "DO2 is not measurable"],
    a: 1,
    r: "DO2-VO2 relationship: Normal: DO2 (~1000 mL/min) far exceeds VO2 (~250 mL/min) — large reserve (extraction ratio ~25%). As DO2 drops, tissues compensate by extracting MORE O2 (extraction ratio increases). VO2 remains stable (supply-independent). Critical DO2 threshold: when extraction is maximal (~60-70%), VO2 becomes supply-dependent — any further DO2 decrease → VO2 drops → anaerobic metabolism → lactic acidosis. Shock management goal: increase DO2 (optimize CO, hemoglobin, SaO2) above the critical threshold to restore supply-independent VO2.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the clinical manifestations of hepatic failure in MODS?",
    o: ["Only jaundice", "Jaundice, coagulopathy (decreased clotting factor synthesis, elevated INR), hypoglycemia (impaired gluconeogenesis), hyperammonemia (decreased urea cycle function leading to hepatic encephalopathy), elevated AST/ALT/bilirubin, and impaired drug metabolism", "Liver failure has no symptoms", "Only elevated enzymes"],
    a: 1,
    r: "Hepatic failure in MODS: (1) Jaundice (elevated direct bilirubin — impaired conjugation/excretion), (2) Coagulopathy (liver produces factors II, VII, IX, X, protein C/S — INR rises, bleeding risk), (3) Hypoglycemia (impaired gluconeogenesis — liver's glucose production fails), (4) Hepatic encephalopathy (ammonia not converted to urea → cerebral toxicity → asterixis, confusion, coma), (5) Impaired drug metabolism (adjust doses of hepatically cleared medications), (6) Decreased albumin synthesis → third-spacing/edema. Monitor: LFTs, INR, glucose, ammonia, mental status.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of mixed venous oxygen saturation (SvO2) in hemodynamic monitoring?",
    o: ["SvO2 measures arterial oxygen", "SvO2 reflects the balance between oxygen delivery and consumption; normal is 60-75%. Low SvO2 (<60%) indicates increased extraction (shock, anemia, low CO). High SvO2 (>80%) may indicate poor tissue extraction (sepsis, cyanide poisoning) or decreased demand (hypothermia)", "It is always normal in shock", "Only measured in the outpatient setting"],
    a: 1,
    r: "SvO2 interpretation: (1) Normal (60-75%): balanced DO2/VO2, (2) LOW SvO2 (<60%): tissues extracting more O2 than normal — causes: decreased CO (heart failure), anemia (decreased O2 carrying capacity), hypoxemia (decreased SaO2), increased VO2 (fever, shivering, agitation), (3) HIGH SvO2 (>80%): tissues NOT extracting O2 — causes: sepsis (mitochondrial dysfunction, pathologic shunting), cyanide poisoning (cellular O2 utilization blocked), hypothermia (decreased metabolic demand). SvO2 trending guides interventions: falling SvO2 = deterioration, rising SvO2 = improvement (with appropriate clinical correlation).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in therapeutic hypothermia/targeted temperature management?",
    o: ["Only applying ice packs", "Initiate cooling to target (32-36°C), monitor core temperature continuously, manage shivering (Bedside Shivering Assessment Scale), administer sedation/paralysis as ordered, monitor for complications (arrhythmias, coagulopathy, electrolyte shifts, infection), and manage controlled rewarming (0.25-0.5°C/hour)", "Temperature management is the physician's role only", "No monitoring is needed during cooling"],
    a: 1,
    r: "TTM nursing role: (1) INDUCTION: apply cooling devices (surface pads, intravascular catheter), administer cold IV saline, monitor core temp (esophageal, bladder, PA catheter), target 32-36°C. (2) MAINTENANCE (24+ hours): prevent shivering (BSAS scoring, use skin counterwarming, meperidine, buspirone, or paralysis), monitor ECG (prolonged QT, Osborne waves, bradycardia), electrolytes q4h (K+ drops during cooling, rebounds during rewarming), coagulation. (3) REWARMING: SLOW (0.25-0.5°C/hr) to prevent rebound hyperthermia, rebound hyperkalemia, and hemodynamic instability. Continue sedation until normothermic.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between acute and chronic subdural hematomas?",
    o: ["Only timing differs, treatment is the same", "Acute SDH: develops within 72 hours, appears hyperdense (white) on CT, often from significant trauma, requires emergent surgery if >10mm or midline shift >5mm. Chronic SDH: develops over weeks-months, appears hypodense (dark) on CT, common in elderly/anticoagulated patients, may be drained with burr holes", "Chronic SDH is more dangerous", "Both always require craniotomy"],
    a: 1,
    r: "Acute SDH: onset <72 hours, high-velocity mechanism, CT shows hyperdense (bright white) crescent. Mortality 50-90%. Surgical criteria: thickness >10 mm, midline shift >5 mm, GCS <9 with pupil abnormalities. Chronic SDH: onset weeks to months after minor/forgotten trauma, CT shows hypodense (dark) crescent or mixed density. Common in elderly (brain atrophy → stretched bridging veins), anticoagulated, alcoholics. Treatment: burr hole drainage (less invasive than craniotomy). Subacute SDH: 3-21 days, isodense on CT (easy to miss).",
    s: "Shock & Emergency"
  },
  {
    q: "What are the indications for decompressive craniectomy in TBI?",
    o: ["For all head injuries", "Refractory intracranial hypertension (ICP >22 mmHg) that does not respond to maximum medical management (osmotherapy, sedation, CSF drainage, hyperventilation); removes a portion of skull to allow brain to swell without compression — controversial but can be life-saving", "Only for skull fractures", "Never indicated in TBI"],
    a: 1,
    r: "Decompressive craniectomy indications: (1) ICP >22 mmHg refractory to tier 1 and 2 medical management (sedation, osmotherapy, CSF drainage, moderate hyperventilation), (2) Impending herniation with deteriorating neurological exam, (3) Large contusions/edema with mass effect. Procedure: large bone flap removed, dura opened, brain allowed to expand into created space. DECRA and RESCUEicp trials: reduces mortality but may increase proportion of vegetative/severely disabled survivors. Decision involves shared decision-making with family about quality of life goals.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the hemodynamic effects of positive pressure ventilation?",
    o: ["No hemodynamic effects", "Positive pressure ventilation increases intrathoracic pressure, which decreases venous return (preload) and can decrease cardiac output; this is especially significant in hypovolemic patients who may develop hypotension with intubation and mechanical ventilation", "It always increases cardiac output", "Only affects respiratory function"],
    a: 1,
    r: "Positive pressure ventilation hemodynamics: (1) Increased intrathoracic pressure → compressed IVC → decreased venous return (preload) → decreased CO. This is why hypovolemic patients often CRASH after intubation. (2) Increased intrathoracic pressure → increased RV afterload (compressed pulmonary vasculature) → RV strain. (3) PEEP effects: further decreases preload (beneficial in fluid overload, harmful in hypovolemia). Nursing: pre-load with IV fluids before intubation in hypovolemic patients, have vasopressors ready, use sedation agents with minimal hemodynamic effects (etomidate, ketamine).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the RIFLE criteria for acute kidney injury classification?",
    o: ["A firearms assessment", "RIFLE classifies AKI severity: Risk (creatinine ×1.5 or UO <0.5 mL/kg/hr ×6h), Injury (creatinine ×2 or UO <0.5 ×12h), Failure (creatinine ×3 or UO <0.3 ×24h or anuria ×12h), Loss (persistent ARF >4 weeks), End-stage (ESRD >3 months)", "Only measures kidney function in outpatients", "A rehabilitation protocol"],
    a: 1,
    r: "RIFLE criteria (now largely replaced by KDIGO): Risk: Cr ×1.5 or GFR decrease >25% or UO <0.5 mL/kg/hr ×6h. Injury: Cr ×2 or GFR decrease >50% or UO <0.5 ×12h. Failure: Cr ×3 or Cr ≥4 with acute rise or GFR decrease >75% or UO <0.3 ×24h or anuria ×12h. Loss: complete loss >4 weeks. ESRD: >3 months. In MODS, AKI worsens prognosis significantly. Nurse role: monitor UO hourly, trend creatinine, assess fluid balance, advocate for nephrology consultation and CRRT when indicated.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in family communication during critical illness?",
    o: ["Avoid communicating with family", "Provide regular updates using plain language, facilitate family presence at bedside, support family decision-making by ensuring they understand the clinical situation, coordinate interdisciplinary family meetings, and assess family coping and support needs", "Only physicians communicate with family", "Family should not be involved in care decisions"],
    a: 1,
    r: "Nurse's role in family communication: (1) Regular updates at scheduled intervals and whenever clinical changes occur — use PLAIN language (avoid jargon), (2) Facilitate family bedside presence (including during resuscitation per hospital policy), (3) Explain equipment, monitors, and alarms to reduce anxiety, (4) Coordinate interdisciplinary family meetings (especially for goals of care), (5) Assess family understanding (teach-back method), (6) Provide emotional support and refer to social work/chaplain, (7) Document family discussions. The nurse is often the family's primary point of contact and translator of medical information.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the pathophysiology of neurogenic pulmonary edema after TBI?",
    o: ["Same as heart failure pulmonary edema", "Neurogenic pulmonary edema results from massive sympathetic discharge after brain injury, causing transient severe systemic and pulmonary hypertension, shifting blood into pulmonary vasculature, and damaging the alveolar-capillary membrane — it is a NON-cardiogenic pulmonary edema", "It doesn't exist", "Only occurs with spinal cord injury"],
    a: 1,
    r: "Neurogenic pulmonary edema (NPE): acute onset after CNS insult (SAH, TBI, SE, brainstem injury). Mechanism: massive sympathetic surge → (1) severe systemic vasoconstriction → blood shifts centrally to pulmonary vasculature, (2) pulmonary venous and capillary hypertension → hydrostatic edema, (3) catecholamine-mediated alveolar-capillary membrane damage → permeability edema. Key difference from cardiogenic: PAWP may be normal (damage is at the capillary level). Treatment: supportive (oxygen, ventilation, PEEP), treat the underlying CNS cause. Usually resolves within 24-72 hours if the brain injury is managed.",
    s: "Shock & Emergency"
  },
  {
    q: "What is an Intra-aortic balloon pump (IABP) and when is it used?",
    o: ["A type of pacemaker", "An IABP is a counterpulsation device inserted into the descending aorta that inflates during diastole (augmenting coronary and cerebral perfusion) and deflates during systole (reducing afterload) — used in cardiogenic shock, refractory angina, and as a bridge to definitive therapy", "It replaces the heart", "Only used in pediatric patients"],
    a: 1,
    r: "IABP: balloon-tipped catheter placed in descending thoracic aorta (tip just distal to left subclavian). Inflation (diastole): increases diastolic aortic pressure → improves coronary perfusion and cerebral blood flow. Deflation (systole): creates vacuum effect → reduces afterload → reduces myocardial oxygen demand → improves CO. Indications: cardiogenic shock (bridge to PCI/surgery), refractory unstable angina, post-MI mechanical complications. Nursing: monitor for limb ischemia (check distal pulses q1h), anticoagulation, prevent balloon migration, monitor helium gas loss, patient must remain supine with affected leg straight.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between Type 1 and Type 2 respiratory failure?",
    o: ["They are identical", "Type 1 (hypoxemic): PaO2 <60 with normal/low PaCO2 (V/Q mismatch, shunt — as in ARDS, pneumonia, PE). Type 2 (hypercapnic): PaCO2 >50 with respiratory acidosis (inadequate ventilation — as in COPD, neuromuscular disease, overdose). Different mechanisms require different treatments", "Type 2 is always less severe", "Only Type 1 requires intubation"],
    a: 1,
    r: "Type 1 respiratory failure (oxygenation failure): PaO2 <60 mmHg with normal or low PaCO2. Mechanism: V/Q mismatch or shunt (blood passes through un-ventilated lung). Causes: ARDS, pneumonia, PE, pulmonary edema. Treatment: supplemental O2, PEEP (recruits collapsed alveoli), prone positioning. Type 2 (ventilatory failure): PaCO2 >50 mmHg (± hypoxemia). Mechanism: inadequate alveolar ventilation. Causes: COPD exacerbation, neuromuscular weakness (Guillain-Barré), drug overdose, SE (respiratory muscle fatigue). Treatment: support ventilation (BiPAP or mechanical ventilation).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of epoprostenol (prostacyclin) in the management of pulmonary hypertension causing obstructive shock?",
    o: ["It is a blood thinner only", "Epoprostenol is a potent pulmonary vasodilator that reduces pulmonary vascular resistance and RV afterload; it is used in severe pulmonary hypertension/RV failure to reduce PA pressures — administered via continuous central IV infusion and must NEVER be abruptly discontinued", "It is given orally PRN", "Only used in chronic management"],
    a: 1,
    r: "Epoprostenol (Flolan/Veletri): continuous IV prostacyclin analog. Actions: (1) Potent pulmonary vasodilator (reduces PVR/RV afterload), (2) Antiplatelet aggregation, (3) Antiproliferative effects on pulmonary vasculature. CRITICAL nursing: (1) NEVER abruptly stop — rebound pulmonary hypertension can be FATAL (carry backup pump and mixing supplies), (2) Central line required, (3) Short half-life (6 min) — any infusion interruption is dangerous, (4) Side effects: flushing, jaw pain, headache, hypotension, (5) Reconstitute fresh every 24-48h (thermolabile). Used in PH crisis with RV failure as bridge to lung transplant or recovery.",
    s: "Shock & Emergency"
  },
  {
    q: "What nursing assessments help determine the progression of burn wound infection?",
    o: ["Only temperature monitoring", "Conversion of partial-thickness to full-thickness (wound deepening), change in wound color (dark red/brown/black), green discoloration (Pseudomonas), purulent drainage, perilesional cellulitis, and systemic signs (fever, tachycardia, rising WBC, sepsis)", "Burns never get infected", "Only blood cultures are informative"],
    a: 1,
    r: "Burn wound infection assessment: (1) Wound appearance changes: deepening of partial-thickness to full-thickness (wound conversion), hemorrhagic discoloration, dark red/brown/black appearance, green discoloration (classic Pseudomonas), (2) Exudate: purulent drainage, increased amount/odor, (3) Perilesional: cellulitis (spreading erythema), edema, warmth, (4) Systemic: fever or hypothermia, tachycardia, hyperglycemia in previously stable patient, rising WBC or leukopenia. Gold standard diagnosis: quantitative wound biopsy (>10^5 organisms/g tissue = infection). Common pathogens: Pseudomonas, MRSA, Candida.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the clinical significance of the S1Q3T3 pattern on ECG?",
    o: ["A normal variant", "S1Q3T3 (prominent S wave in lead I, Q wave in lead III, inverted T wave in lead III) is a classic ECG finding suggestive of acute right heart strain from massive pulmonary embolism — though it is neither sensitive nor specific, it should raise suspicion for PE in the appropriate clinical context", "Indicates myocardial infarction only", "Only seen in pediatric patients"],
    a: 1,
    r: "S1Q3T3 pattern: (1) S wave in Lead I (indicates RV dilation causing rightward axis), (2) Q wave in Lead III (right heart strain), (3) T-wave inversion in Lead III (RV ischemia/strain). Found in ~20% of PE cases — low sensitivity but clinically important when present. Other PE ECG findings: sinus tachycardia (most common), right axis deviation, RBBB (new), T-wave inversions in V1-V4 (RV strain pattern), atrial fibrillation/flutter. Remember: a NORMAL ECG does NOT rule out PE. Clinical correlation with D-dimer, CT-PA, and clinical gestalt is essential.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nursing management of hypothermia in trauma patients?",
    o: ["Hypothermia is beneficial in trauma", "Prevent and treat actively: remove wet clothing, warm blankets, forced warm air devices (Bair Hugger), warm IV fluids (42°C), warm the environment (increase room temperature), blood warmers for transfusions — hypothermia below 35°C impairs coagulation and worsens the lethal triad", "Only external warming is needed", "Hypothermia does not affect outcomes"],
    a: 1,
    r: "Trauma hypothermia prevention: (1) Passive: remove wet/cold clothing, warm blankets, increase room temperature (24-27°C). (2) Active external: forced warm air devices (Bair Hugger — most effective non-invasive method), warm blankets, radiant warmers. (3) Active internal: warm IV fluids (42°C via blood/fluid warmer), warm humidified ventilator circuits, body cavity lavage (peritoneal, thoracic) for severe hypothermia. Why it matters: hypothermia <35°C impairs platelet function, slows enzymatic coagulation cascade (10% decreased activity per 1°C drop), increases infection risk, and promotes cardiac arrhythmias. Goal: maintain core temp >36°C.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the role of central venous pressure (CVP) in modern hemodynamic assessment?",
    o: ["CVP is the gold standard for volume assessment", "CVP is a poor predictor of fluid responsiveness; a single CVP value cannot reliably determine volume status. However, CVP TRENDS and extreme values are still useful: very low CVP (<2) suggests hypovolemia, very high CVP (>15) suggests volume overload or right heart failure", "CVP is no longer measured", "CVP replaces the need for PA catheter"],
    a: 1,
    r: "CVP limitations: multiple studies show CVP poorly predicts fluid responsiveness (AUROC ~0.56 = barely better than a coin flip). A CVP of 8-12 does NOT mean the patient needs or doesn't need fluids. Current recommendations: (1) Do NOT use CVP alone to guide fluid therapy, (2) CVP TRENDS may be useful (rapidly rising CVP with fluid bolus = non-responsive), (3) Extreme values informative (CVP <2 = likely hypovolemic, CVP >15 = volume overloaded/RV failure), (4) Dynamic assessments are superior (PLR, PPV, SVV, IVC variability). CVP is still used for: medication administration safety (confirms central access) and calculating SVR/PVR.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the differences between intermittent hemodialysis (IHD) and CRRT in the ICU?",
    o: ["They are identical treatments", "IHD removes solutes and fluid rapidly over 3-4 hours (risk of hemodynamic instability); CRRT removes solutes and fluid slowly and continuously over 24 hours (better hemodynamic tolerance) — CRRT is preferred in hemodynamically unstable patients such as those in shock", "IHD is always preferred in the ICU", "CRRT is only for outpatients"],
    a: 1,
    r: "IHD: rapid solute and fluid removal over 3-4 hours. Advantages: efficient, allows patient mobility between sessions. Disadvantages: hemodynamic instability from rapid fluid shifts (hypotension), electrolyte swings, not suitable for unstable patients. CRRT: continuous slow removal 24/7 using specialized bedside machines (CVVH, CVVHD, CVVHDF). Advantages: hemodynamically stable (slow fluid removal), precise volume management, better in shock patients. Disadvantages: continuous anticoagulation needed (citrate or heparin), immobility, specialized nursing training required. In MODS with shock: CRRT is the standard of care.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of troponin elevation in non-cardiac critical illness?",
    o: ["Always indicates heart attack", "Troponin elevation in ICU patients can result from demand ischemia (Type 2 MI from shock, sepsis, hypoxia), RV strain (PE, ARDS), myocardial depression (septic cardiomyopathy), or direct myocardial injury — it requires clinical context interpretation, not automatic cath lab activation", "It is always a false positive", "Only cardiac patients have troponin elevation"],
    a: 1,
    r: "Troponin elevation in critical illness: Type 1 MI (plaque rupture): ST changes, chest pain, wall motion abnormality → cath lab. Type 2 MI (demand ischemia): supply-demand mismatch from shock, hypoxia, tachycardia, anemia → treat the underlying cause. Other causes in ICU: septic cardiomyopathy (cytokine-mediated), PE (RV strain), myocarditis, contusion (trauma), renal failure (impaired clearance), stress cardiomyopathy (Takotsubo). Nursing: correlate with ECG, clinical context, echo. Serial trending is key — rising troponin in a septic patient may indicate developing septic cardiomyopathy requiring inotropic support.",
    s: "Shock & Emergency"
  },
  // ===== BATCH 8: EXPANDED TESTBANK =====
  {
    q: "What is the 'lethal diamond' and how does it expand on the lethal triad in trauma?",
    o: ["A surgical instrument", "The lethal diamond adds HYPOCALCEMIA to the lethal triad (hypothermia, acidosis, coagulopathy); calcium is essential for the coagulation cascade and myocardial contractility — depleted by citrate in transfused blood products during massive transfusion", "A trauma assessment tool", "A type of cardiac rhythm"],
    a: 1,
    r: "Lethal diamond = lethal triad + hypocalcemia. Citrate in stored blood products binds ionized calcium → hypocalcemia during massive transfusion. Calcium is required for: (1) Multiple steps in the coagulation cascade (factor activation), (2) Myocardial contractility, (3) Vascular smooth muscle tone. Severe hypocalcemia (iCa <0.9 mmol/L): prolonged QT, cardiac arrest, refractory hypotension, worsened coagulopathy. Treatment: calcium chloride 1g IV (via central line — CaCl provides 3× more ionized Ca than calcium gluconate). Monitor iCa every 30 min during massive transfusion.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in preventing catheter-associated urinary tract infection (CAUTI) in shock patients?",
    o: ["Foley catheters don't cause UTIs", "Aseptic insertion technique, maintain closed drainage system, secure catheter to prevent traction, keep bag below bladder level, perform daily catheter necessity review, remove catheter as soon as possible, avoid routine catheter irrigation", "Change the catheter daily", "Use antibiotics prophylactically"],
    a: 1,
    r: "CAUTI prevention: (1) Avoid unnecessary insertion (use alternatives: condom catheter, straight cath, bladder scanner), (2) Aseptic insertion (sterile technique, proper cleansing), (3) Maintain closed system (never disconnect catheter from drainage bag), (4) Secure catheter (prevents urethral traction and irritation), (5) Keep drainage bag below bladder (prevents reflux), (6) Daily necessity review (remove when no longer needed — #1 prevention strategy), (7) Do NOT irrigate routinely, (8) Perineal hygiene. UTI risk increases ~5%/day of catheterization. In shock patients, Foley is often needed for UO monitoring but should be removed ASAP when the patient stabilizes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is rebound intracranial hypertension?",
    o: ["A type of headache", "A dangerous rise in ICP that occurs when osmotherapy (mannitol) is discontinued abruptly or when the blood-brain barrier becomes permeable — osmotic agents cross the damaged BBB and draw water INTO the brain, paradoxically increasing ICP", "It only occurs after surgery", "ICP never rebounds after treatment"],
    a: 1,
    r: "Rebound ICP elevation mechanisms: (1) Mannitol rebound: with repeated dosing, mannitol accumulates in brain tissue through a damaged BBB → creates reversed osmotic gradient → draws water INTO the brain when serum levels drop (worse with rapid infusion and damaged BBB). (2) Hypertonic saline rebound: less common but possible if rapid sodium correction occurs (Na drops → osmotic water shift into brain). Prevention: gradual dose reduction, maintain serum osmolality within target range, avoid prolonged mannitol use, transition to hypertonic saline if prolonged osmotherapy needed. Monitor ICP closely during any osmotherapy changes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Monro-Kellie doctrine's clinical application in TBI management?",
    o: ["It has no clinical application", "Since the cranial vault is fixed volume, reducing one component (CSF drainage via EVD, reducing cerebral blood volume via head positioning/hyperventilation, reducing brain water via osmotherapy) can lower ICP when another component increases (edema, hemorrhage)", "It only applies to pediatric patients", "It relates to spinal cord injury"],
    a: 1,
    r: "Monro-Kellie clinical applications: When brain volume increases (edema, hemorrhage): (1) REDUCE CSF: EVD drainage (most direct intervention), (2) REDUCE BLOOD VOLUME: head elevation 30° (promotes venous drainage), brief hyperventilation (PaCO2 30-35 → cerebral vasoconstriction, rescue only), avoid obstruction of venous outflow (midline head, avoid tight cervical collars), (3) REDUCE BRAIN WATER: osmotherapy (mannitol or HTS draws water out of brain tissue). Surgical: decompressive craniectomy (effectively INCREASES vault volume). Each intervention targets a specific Monro-Kellie component.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's assessment for spinal cord injury level?",
    o: ["Only check if the patient can walk", "Systematic dermatomal sensory examination (light touch and pinprick from sacral to cervical), motor strength testing (key muscle groups per level), reflex assessment, and documentation of the neurological level (most caudal level with intact motor and sensory function)", "Only imaging determines the level", "Level assessment is not a nursing responsibility"],
    a: 1,
    r: "SCI level assessment (ASIA/ISNCSCI exam): (1) SENSORY: test each dermatome bilaterally for light touch AND pinprick (C2 to S4-5). Key dermatomes: C4 (shoulder), T4 (nipple line), T10 (umbilicus), L1 (inguinal), S4-5 (perianal). Score 0-2 per dermatome. (2) MOTOR: test key muscles bilaterally. C5 (biceps), C6 (wrist extensors), C7 (triceps), C8 (finger flexors), T1 (finger abduction), L2 (hip flexors), L3 (quadriceps), L4 (dorsiflexors), L5 (great toe extensors), S1 (plantarflexors). Score 0-5. (3) ASIA Impairment Scale: A (complete) through E (normal). Serial exams document improvement or deterioration.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between primary and secondary survey in trauma?",
    o: ["They are done simultaneously", "Primary survey (ABCDE): rapid identification and treatment of immediately life-threatening conditions (seconds to minutes). Secondary survey: comprehensive head-to-toe examination, detailed history (AMPLE), and diagnostic studies — only performed AFTER the primary survey is complete and the patient is stabilized", "Secondary survey comes first", "Primary survey is only for severe trauma"],
    a: 1,
    r: "Primary survey (ABCDE): done in strict sequential order. Takes 2-5 minutes. Identifies and treats IMMEDIATE threats to life. Life-saving interventions done simultaneously (intubation, chest decompression, hemorrhage control). Secondary survey: done AFTER primary survey completion and initial stabilization. Includes: (1) Complete head-to-toe physical exam (inspect all surfaces including posterior with log-roll), (2) AMPLE history (Allergies, Medications, Past medical history, Last meal, Events surrounding injury), (3) Diagnostic studies (CXR, pelvis XR, FAST, CT as indicated). If the patient deteriorates during secondary survey → RETURN to primary survey.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in maintaining chain of custody for forensic evidence in trauma?",
    o: ["Nurses have no role in evidence collection", "Document clothing removal, place each item in separate paper bags (not plastic), preserve bullets/foreign objects, document wound descriptions and body markings, maintain chain of custody documentation for all evidence, and notify law enforcement per hospital policy", "Only police collect evidence", "Evidence is only important for gunshot wounds"],
    a: 1,
    r: "Forensic nursing responsibilities: (1) CLOTHING: cut around (not through) bullet holes/stab marks, place each item in separate PAPER bag (plastic promotes mold/degradation), label with patient info and date/time, (2) BULLETS/FRAGMENTS: handle with gloved hands (avoid marking), place in specimen container, document who received evidence, (3) DOCUMENTATION: wound descriptions (size, shape, location using anatomical landmarks, presence of powder burns/stippling), body markings, photograph if possible, (4) CHAIN OF CUSTODY: document every person who handles evidence, keep log of items, (5) Minimize wound washing until evidence collected (unless life-threatening hemorrhage), (6) Notify law enforcement per policy.",
    s: "Shock & Emergency"
  },
  {
    q: "What is shock index and how is it interpreted?",
    o: ["Heart rate divided by temperature", "Shock index = heart rate / systolic blood pressure; normal is 0.5-0.7; SI >0.9 suggests significant shock; SI >1.0 is associated with high mortality and need for massive transfusion — useful because it may detect shock earlier than traditional vital sign thresholds", "It is the same as MAP", "Only used in pediatric patients"],
    a: 1,
    r: "Shock index = HR / SBP. Normal: 0.5-0.7 (e.g., HR 70, SBP 120 = SI 0.58). Interpretation: SI 0.7-0.9 = early/compensated shock (may have normal individual vital signs), SI 0.9-1.3 = significant shock (associated with need for blood transfusion, ICU admission), SI >1.3 = severe shock (high mortality). Clinical value: detects shock EARLIER than individual vital sign thresholds because it integrates two parameters. A patient with HR 100 and SBP 100 has 'normal' individual vital signs but SI = 1.0 (abnormal). Particularly useful in triage and prehospital settings.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the RASS (Richmond Agitation-Sedation Scale) and why is it important in shock management?",
    o: ["A pain scale", "RASS scores -5 (unarousable) to +4 (combative); it guides sedation titration in mechanically ventilated patients; target is typically 0 to -2 (light sedation) to allow daily sedation interruptions and spontaneous breathing trials — over-sedation prolongs ventilation and ICU stay", "Only used for psychiatric patients", "RASS measures blood pressure"],
    a: 1,
    r: "RASS scale: +4 combative, +3 very agitated, +2 agitated, +1 restless, 0 alert/calm, -1 drowsy, -2 light sedation (briefly awakens to voice), -3 moderate sedation (movement to voice), -4 deep sedation (movement to physical stimulation), -5 unarousable. Target in most ICU patients: 0 to -2 (light sedation). Sedation targets in specific situations: TBI with elevated ICP may need deeper sedation (-4 to -5), refractory SE on therapeutic coma (-5 with burst-suppression). Daily sedation interruption (SAT) paired with spontaneous breathing trial (SBT) reduces ventilator days and mortality.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the nursing considerations for a patient on an epinephrine infusion for anaphylactic shock?",
    o: ["No special monitoring needed", "Continuous cardiac monitoring (arrhythmia risk), arterial line for accurate BP (preferred), titrate to MAP ≥65, monitor for myocardial ischemia (chest pain, ECG changes), extravasation monitoring if peripheral (tissue necrosis), document dose and response frequently", "Only monitor blood pressure", "Epinephrine infusions are never used for anaphylaxis"],
    a: 1,
    r: "Epinephrine infusion for refractory anaphylaxis: (1) Dose: 1-10 mcg/min IV (mix 1 mg in 250 mL NS = 4 mcg/mL), titrate to response. (2) Monitoring: continuous ECG (epinephrine → tachycardia, PVCs, VT risk), continuous BP (arterial line preferred — rapid BP changes), SpO2 (airway patency). (3) Risks: myocardial ischemia (increased myocardial O2 demand), arrhythmias, tissue necrosis with extravasation (use central line when possible). (4) Weaning: gradually decrease dose as symptoms resolve — abrupt discontinuation can cause rebound anaphylaxis. (5) Concurrent: continue H1/H2 blockers, corticosteroids, fluid resuscitation.",
    s: "Shock & Emergency"
  },
  {
    q: "What is propofol infusion syndrome (PRIS) and which patients are at highest risk?",
    o: ["A common harmless side effect", "PRIS is a rare but fatal complication of prolonged propofol infusion (>48 hours at >5 mg/kg/hr) characterized by metabolic acidosis, rhabdomyolysis, hyperkalemia, renal failure, cardiac failure, and lipemic serum — highest risk in patients on high-dose propofol for SE or TBI", "Only occurs in outpatients", "Propofol has no serious side effects"],
    a: 1,
    r: "PRIS: rare but mortality >50%. Mechanism: propofol impairs mitochondrial fatty acid oxidation → unable to utilize long-chain fatty acids for energy → cellular energy failure. Risk factors: (1) Dose >5 mg/kg/hr, (2) Duration >48 hours, (3) Concurrent catecholamine/steroid use, (4) Carbohydrate depletion. Clinical features: unexplained metabolic acidosis (elevated lactate), rhabdomyolysis (elevated CK >5000), hyperkalemia (from cell death), bradycardia/cardiac failure, lipemia (triglycerides >500), hepatomegaly. Monitoring: daily CK and triglycerides on propofol >48h. Limit propofol to <5 mg/kg/hr and <48h when possible.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the difference between the Parkland and modified Brooke formulas for burn resuscitation?",
    o: ["They are identical formulas", "Parkland: 4 mL/kg/%TBSA using crystalloid (LR) only. Modified Brooke: 2 mL/kg/%TBSA using crystalloid — uses less initial volume. Both formulas are STARTING POINTS only; actual fluid rate is titrated to urine output (0.5-1 mL/kg/hr adult)", "Modified Brooke uses more fluid", "Neither uses crystalloid"],
    a: 1,
    r: "Parkland formula: 4 mL × kg × %TBSA = 24h crystalloid volume (half in first 8h from burn time, half over next 16h). Modified Brooke: 2 mL × kg × %TBSA (half the Parkland volume). Both are ESTIMATES — the actual rate must be titrated to response: (1) UO 0.5-1 mL/kg/hr in adults (30-50 mL/hr), (2) UO 1 mL/kg/hr in children, (3) UO 1-2 mL/kg/hr in electrical burns. 'Fluid creep' (over-resuscitation) is a recognized problem — monitor for pulmonary edema, abdominal compartment syndrome, and extremity compartment syndrome. Both formulas use LR (preferred over NS to avoid hyperchloremic acidosis).",
    s: "Shock & Emergency"
  },
  {
    q: "What is the significance of base deficit in trauma and shock?",
    o: ["It is a measure of lung function only", "Base deficit reflects the degree of metabolic acidosis from tissue hypoperfusion; mild (-3 to -5), moderate (-6 to -9), severe (<-10); it correlates with blood loss, need for transfusion, and mortality — and can be trended to assess resuscitation adequacy", "It has no clinical significance", "It is the same as blood pH"],
    a: 1,
    r: "Base deficit (BD): the amount of base (bicarbonate) that would need to be added to normalize pH. It reflects lactic acid production from anaerobic metabolism. Classification: Mild (-3 to -5): ~750-1000 mL blood loss, low mortality. Moderate (-6 to -9): significant hemorrhage, ~1500-2000 mL blood loss. Severe (<-10): massive hemorrhage, high mortality (25-70%). Clinical uses: (1) Estimate blood loss severity, (2) Guide transfusion decisions, (3) Track resuscitation effectiveness (improving BD = improving perfusion), (4) Prognostic indicator. BD can detect occult shock in patients with normal vital signs.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the RACE mnemonic for stroke assessment and how does it relate to neurological emergencies?",
    o: ["A fall risk assessment", "RACE: Rapid Arterial oCclusion Evaluation — assesses facial palsy, arm motor function, leg motor function, and gaze/head deviation to identify large vessel occlusion (LVO) strokes; scores ≥5 indicate LVO requiring emergent thrombectomy", "A cardiac rhythm assessment", "Only used by paramedics"],
    a: 1,
    r: "RACE scale: designed to identify LVO strokes in the field for direct transport to comprehensive stroke centers with thrombectomy capability. Components: (1) Facial palsy (0-2), (2) Arm motor (0-2), (3) Leg motor (0-2), (4) Head/gaze deviation (0-1), (5) Aphasia/agnosia (0-2). Total: 0-9. Score ≥5: sensitivity >70% for LVO. Related to neurological emergencies: similar rapid assessment principles apply to TBI (GCS), SE (seizure timing), and SCI (level assessment). These prehospital screening tools optimize destination decisions and reduce time to definitive treatment.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the principle of damage control resuscitation?",
    o: ["Give unlimited IV fluids until surgery", "Minimize crystalloid use, early 1:1:1 transfusion ratio (PRBC:FFP:platelets), permissive hypotension (SBP 80-90), prevention/correction of the lethal triad (hypothermia, acidosis, coagulopathy), and early surgical hemorrhage control", "Only use colloids", "Resuscitation is not needed before surgery"],
    a: 1,
    r: "Damage control resuscitation (DCR): (1) LIMIT crystalloids (reduce dilutional coagulopathy and tissue edema), (2) 1:1:1 transfusion ratio (PROPPR trial: 1 unit PRBC : 1 unit FFP : 1 pack platelets — replaces what is being lost), (3) Permissive hypotension (SBP 80-90, MAP 50-60 — until surgical hemorrhage control), (4) Correct the lethal triad: blood warmers + warm environment (hypothermia), treat source of acidosis (hemorrhage control), replace clotting factors (FFP, cryoprecipitate, TXA), (5) Point-of-care testing (TEG/ROTEM) to guide targeted product administration. DCR is paired with damage control surgery for optimal outcomes.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the nurse's role in targeted temperature management (TTM) for post-cardiac arrest patients?",
    o: ["Only apply ice packs", "Initiate cooling to 32-36°C within hours of ROSC, monitor core temperature continuously (esophageal/bladder probe), manage shivering aggressively, administer sedation/paralysis as ordered, monitor for complications (arrhythmias, coagulopathy, electrolyte shifts), and control rewarming rate at 0.25-0.5°C/hr", "Temperature management is physician-only", "Hypothermia is never used after cardiac arrest"],
    a: 1,
    r: "TTM nursing care phases: (1) INDUCTION: surface cooling (Arctic Sun, Blanketrol) or intravascular catheter (Thermogard), target 32-36°C. Monitor core temp continuously (esophageal, bladder, or PA catheter — NOT axillary/oral). (2) MAINTENANCE (24+ hours): manage shivering (BSAS assessment, counterwarming, meperidine, dexmedetomidine, or paralysis), check K+ q4h (drops during cooling), coagulation (hypothermia impairs clotting), ECG (prolonged QT, Osborne waves). (3) REWARMING: 0.25-0.5°C/hr (avoid rebound hyperthermia!), monitor K+ closely (rebound hyperkalemia), hold neuroprognostication until ≥72h after normothermia.",
    s: "Shock & Emergency"
  },
  {
    q: "What is ventilator-associated event (VAE) prevention and how does it differ from VAP prevention?",
    o: ["They are identical concepts", "VAE is a broader concept including any sustained worsening of oxygenation on mechanical ventilation; VAP is a specific infection subset. VAE prevention includes ALL VAP bundle elements PLUS minimizing tidal volumes, minimizing PEEP/FiO2 when possible, fluid management, and early mobility", "VAE only applies to surgical patients", "Prevention is not possible"],
    a: 1,
    r: "VAE (CDC surveillance definition): sustained increase in ventilator settings (FiO2 increase ≥0.20 or PEEP increase ≥3 cmH2O for ≥2 days) after ≥2 days of stable or improving settings. Subtypes: Infection-related VAC (IVAC) and probable/possible VAP. VAE prevention encompasses MORE than traditional VAP bundles: (1) VAP bundle (HOB 30°, oral care, SAT/SBT, DVT/PUD prophylaxis), PLUS (2) Conservative fluid management (avoid pulmonary edema), (3) Lung-protective ventilation (low Vt, appropriate PEEP), (4) Early mobility (reduce deconditioning), (5) Minimize unnecessary sedation depth.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the Parkland formula calculation for a pediatric patient?",
    o: ["Same as adult formula without modifications", "Parkland formula is the same (4 mL/kg/%TBSA) but children also require maintenance fluids (based on weight) IN ADDITION to the resuscitation volume; children have larger BSA-to-weight ratios and are more susceptible to hypothermia and hypoglycemia", "Children don't need fluid resuscitation", "Halve the adult formula"],
    a: 1,
    r: "Pediatric burn resuscitation: (1) Parkland: 4 mL × kg × %TBSA + maintenance fluids (4-2-1 rule or Holiday-Segar), (2) Maintenance fluids added because children have higher basal fluid requirements per kg, (3) Use D5LR for maintenance (children prone to HYPOGLYCEMIA — monitor glucose q4-6h), (4) Target UO: 1 mL/kg/hr (higher than adults), (5) Greater BSA-to-weight ratio → higher evaporative losses and heat loss → more aggressive hypothermia prevention, (6) Rule of Nines modified: infant head = 18% (vs adult 9%), legs = 14% each (vs adult 18%). Lund-Browder chart is more accurate for children.",
    s: "Shock & Emergency"
  },
  {
    q: "What is the evidence for early goal-directed therapy (EGDT) in sepsis and how has it evolved?",
    o: ["EGDT is still the standard of care exactly as described by Rivers in 2001", "The original Rivers trial (2001) showed mortality benefit with protocolized CVP, MAP, and ScvO2 targets within 6 hours; however, subsequent multicenter trials (ProCESS, ARISE, ProMISe) found no benefit of protocolized EGDT over usual care — current SSC emphasizes rapid antibiotics, fluids, and vasopressors without rigid protocols", "EGDT has been completely abandoned", "EGDT is only for surgical patients"],
    a: 1,
    r: "EGDT evolution: Rivers 2001: protocol targeting CVP 8-12, MAP ≥65, ScvO2 ≥70% within 6 hours → reduced mortality from 46% to 31%. Major impact: made sepsis time-sensitive like MI/stroke. However, three large multicenter trials (ProCESS 2014, ARISE 2014, ProMISe 2015) found NO benefit of protocolized EGDT over usual care. Why? The control groups had improved because awareness and early treatment became standard practice. Current approach: SSC Hour-1 Bundle (measure lactate, cultures, antibiotics, fluids for hypotension/lactate ≥4, vasopressors for refractory hypotension) — emphasis on RAPID intervention without rigid protocolization.",
    s: "Shock & Emergency"
  },
  {
    q: "What are the complications of circumferential burns to the extremities?",
    o: ["No special concerns with circumferential burns", "Circumferential full-thickness burns form a rigid eschar that does not expand as tissue swells underneath; this acts like a tourniquet, compromising distal circulation (absent pulses, increasing pain, paresthesias, paralysis) and requiring emergent escharotomy", "Only affects cosmetic outcomes", "Only causes pain"],
    a: 1,
    r: "Circumferential burn complications: full-thickness eschar is inelastic → as underlying tissue swells (capillary leak, fluid resuscitation) → constrictive effect → (1) Vascular compromise: diminished/absent distal pulses, delayed capillary refill, cool digits, pain with passive stretch, (2) Neurological: paresthesias → paralysis (nerve ischemia), (3) If chest/trunk: restricted ventilation (rising airway pressures, decreased tidal volumes). Assessment: hourly neurovascular checks (5 Ps: pain, pulses, paresthesia, paralysis, pallor), Doppler signals if pulses not palpable. Treatment: emergent escharotomy along lateral lines of the extremity.",
    s: "Shock & Emergency"
  }
];
