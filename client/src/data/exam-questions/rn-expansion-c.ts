import type { ExamQuestion } from "./types";

export const rnExpansionCQuestions: ExamQuestion[] = [
  {
    q: "A nurse is caring for a client in the ICU with suspected sepsis. Vital signs: T 38.9C, HR 112, BP 88/54, RR 24, SpO2 93% on 4L nasal cannula. Lactate level is 4.2 mmol/L. The provider orders a sepsis bundle. Which intervention should the nurse prioritize first?",
    o: ["Obtain blood cultures and initiate broad-spectrum IV antibiotics within 1 hour", "Administer a 30 mL/kg crystalloid fluid bolus", "Start a vasopressor infusion to maintain MAP above 65 mmHg", "Insert a central venous catheter for CVP monitoring"],
    a: 0,
    r: "The Surviving Sepsis Campaign Hour-1 Bundle prioritizes obtaining blood cultures before antibiotics (to identify the organism) and initiating broad-spectrum antibiotics within 1 hour of sepsis recognition. Delays in antibiotic administration increase mortality by 7.6% per hour. Fluid resuscitation is also urgent but cultures and antibiotics take priority. Vasopressors follow fluid resuscitation. Central line placement is important but not the first intervention.",
    s: "Emergency"
  },
  {
    q: "A nurse is assessing a client who arrived in the emergency department after a motor vehicle accident. The client is confused, has cold clammy skin, BP 76/48, HR 132, and weak thready pulses. Estimated blood loss is 1500 mL. Which type of shock is the client experiencing?",
    o: ["Hypovolemic shock (Class III hemorrhage)", "Cardiogenic shock from cardiac tamponade", "Neurogenic shock from spinal cord injury", "Anaphylactic shock from medication allergy"],
    a: 0,
    r: "Blood loss of 1500 mL (30-40% of total blood volume) with tachycardia, hypotension, confusion, and cold clammy skin defines Class III hemorrhagic (hypovolemic) shock. Cardiogenic shock would show JVD and muffled heart sounds. Neurogenic shock presents with bradycardia and warm dry skin (loss of sympathetic tone). Anaphylactic shock would show urticaria, bronchospasm, and angioedema.",
    s: "Emergency"
  },
  {
    q: "A charge nurse is delegating tasks for the shift. Which task is most appropriate to delegate to a licensed practical nurse (LPN)?",
    o: ["Administer scheduled oral medications to a stable client with diabetes", "Perform the initial admission assessment on a newly admitted client", "Develop the plan of care for a client with a new heart failure diagnosis", "Teach a client with a new colostomy how to change the appliance for the first time"],
    a: 0,
    r: "LPNs can administer oral and IM medications to stable clients. Initial admission assessments, care plan development, and initial client education all require the assessment, critical thinking, and clinical judgment skills of the registered nurse. These activities cannot be delegated to an LPN because they involve the nursing process steps of assessment and planning.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for four clients. Which client should the nurse assess first?",
    o: ["A client with pneumonia whose SpO2 dropped from 96% to 88% in the past hour", "A client with heart failure who gained 1.5 kg overnight", "A client 2 days post-appendectomy with a temperature of 37.8C", "A client with diabetes whose fasting blood glucose is 180 mg/dL"],
    a: 0,
    r: "A rapid drop in oxygen saturation from 96% to 88% indicates acute respiratory deterioration that could progress to respiratory failure. This is the most time-sensitive and potentially life-threatening change. Weight gain in heart failure requires assessment but is subacute. Low-grade fever post-surgery may indicate atelectasis. Elevated fasting glucose requires attention but is not immediately life-threatening.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with cardiogenic shock post-myocardial infarction. The client's BP is 78/52, HR 118, CVP 22 mmHg, and urine output is 15 mL/hr. Which medication would the nurse anticipate being ordered?",
    o: ["Dobutamine to improve cardiac contractility and cardiac output", "IV normal saline 1000 mL bolus to increase preload", "Metoprolol to control the heart rate", "Nitroprusside to reduce systemic vascular resistance"],
    a: 0,
    r: "Cardiogenic shock with elevated CVP (22 mmHg, normal 2-8) indicates the heart is failing as a pump with volume overload. Dobutamine is a positive inotrope that increases cardiac contractility and cardiac output without significantly increasing heart rate. IV fluid bolus would worsen the already elevated preload. Beta-blockers would further reduce cardiac output. Nitroprusside would dangerously lower an already critically low blood pressure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse receives a telephone order from a provider. Which action demonstrates correct telephone order procedure?",
    o: ["Read back the complete order to the provider and document the date, time, and provider name", "Write the order and have another nurse carry it out without verification", "Ask the provider to enter the order in the electronic health record later", "Implement the order immediately and document it at the end of the shift"],
    a: 0,
    r: "The read-back process is a critical patient safety measure for telephone orders. The nurse must write the order, read it back verbatim to the provider for confirmation, and document the date, time, order details, and provider name. Having another nurse implement without verification creates error risk. Waiting for EHR entry delays care. Delayed documentation creates a gap in the medical record.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client with acute respiratory distress syndrome (ARDS). The client is intubated and mechanically ventilated. ABG results show: pH 7.28, PaCO2 52 mmHg, PaO2 58 mmHg, HCO3 24 mEq/L. How should the nurse interpret these results?",
    o: ["Uncompensated respiratory acidosis with hypoxemia", "Compensated metabolic alkalosis", "Mixed respiratory and metabolic acidosis", "Uncompensated metabolic acidosis"],
    a: 0,
    r: "pH 7.28 (acidotic), PaCO2 52 (elevated, indicating respiratory cause), HCO3 24 (normal, no compensation yet), and PaO2 58 (hypoxemic). This is uncompensated respiratory acidosis with hypoxemia, consistent with ARDS where the lungs cannot adequately exchange gases. The kidneys have not yet compensated by retaining bicarbonate. Treatment involves adjusting ventilator settings to improve oxygenation and ventilation.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client with diabetic ketoacidosis (DKA). Lab results show: blood glucose 520 mg/dL, pH 7.18, serum potassium 5.8 mEq/L, serum bicarbonate 10 mEq/L. Which statement about this client's potassium level is correct?",
    o: ["The serum potassium is artificially elevated due to acidosis, and total body potassium is actually depleted", "The client has true hyperkalemia requiring immediate potassium-lowering interventions", "The potassium level is normal and requires no monitoring", "Insulin therapy will further increase the potassium level"],
    a: 0,
    r: "In DKA, metabolic acidosis causes hydrogen ions to move into cells in exchange for potassium moving out, creating falsely elevated serum potassium levels. The total body potassium is actually severely depleted from osmotic diuresis. When insulin therapy corrects the acidosis, potassium will shift back into cells, potentially causing dangerous hypokalemia. Aggressive potassium replacement is needed once insulin is started and urine output is confirmed.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client in the emergency department who presents with sudden severe headache described as the worst headache of my life, neck stiffness, and photophobia. BP is 178/102 and HR is 68. What should the nurse suspect and which diagnostic test should be anticipated?",
    o: ["Subarachnoid hemorrhage requiring emergent CT scan without contrast", "Migraine headache requiring pain medication and a quiet environment", "Bacterial meningitis requiring lumbar puncture as the first test", "Tension headache requiring muscle relaxants and NSAIDs"],
    a: 0,
    r: "Thunderclap headache (worst headache of my life) with neck stiffness (meningismus) and photophobia is the classic presentation of subarachnoid hemorrhage (SAH) until proven otherwise. Non-contrast CT scan is the first diagnostic step (98% sensitive within 6 hours). Lumbar puncture follows if CT is negative. This is NOT a migraine - the sudden maximal onset distinguishes SAH. Delay in diagnosis increases mortality from rebleeding.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with septic shock who is receiving norepinephrine. The MAP remains below 65 mmHg despite maximal dose. Which additional vasopressor would the nurse anticipate being added?",
    o: ["Vasopressin at a fixed dose of 0.03-0.04 units/min", "Dopamine at renal dose (2-5 mcg/kg/min)", "Phenylephrine as the sole replacement for norepinephrine", "Nitroglycerin to improve tissue perfusion"],
    a: 0,
    r: "The Surviving Sepsis Guidelines recommend adding vasopressin (at a fixed low dose of 0.03-0.04 units/min) as a second-line vasopressor when norepinephrine alone is insufficient to maintain MAP above 65 mmHg. Vasopressin works through V1 receptors (a different mechanism than catecholamines). Low-dose dopamine is no longer recommended for renal protection. Phenylephrine is less effective than norepinephrine. Nitroglycerin would worsen hypotension.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client on a heparin drip for deep vein thrombosis. The client develops oozing from IV sites, petechiae, and a platelet count of 48,000/mm3 (baseline 220,000). What should the nurse suspect?",
    o: ["Heparin-induced thrombocytopenia (HIT) requiring immediate discontinuation of all heparin products", "Normal response to heparin therapy that will resolve on its own", "Disseminated intravascular coagulation unrelated to heparin", "Vitamin K deficiency requiring supplementation"],
    a: 0,
    r: "A platelet drop greater than 50% from baseline occurring 5-14 days after heparin initiation strongly suggests heparin-induced thrombocytopenia (HIT), an immune-mediated condition. All heparin products (including flushes) must be immediately discontinued and an alternative anticoagulant (argatroban or bivalirudin) started. HIT paradoxically increases thrombosis risk despite low platelets. This is NOT a normal response and requires urgent intervention.",
    s: "Hematology"
  },
  {
    q: "A nurse is triaging four clients in the emergency department. Which client should be seen first using the Emergency Severity Index?",
    o: ["A 55-year-old male with crushing substernal chest pain radiating to the left arm, diaphoresis, and BP 90/60", "A 30-year-old female with a displaced wrist fracture and moderate pain", "A 22-year-old male with a laceration on the forearm requiring sutures", "A 45-year-old female with migraine headache and nausea for 6 hours"],
    a: 0,
    r: "The 55-year-old with classic signs of acute myocardial infarction (crushing chest pain, radiation, diaphoresis) and hypotension is the highest acuity patient. This is an ESI Level 1 (immediate life-threatening condition). The wrist fracture is ESI Level 3. The laceration is ESI Level 4. The migraine is ESI Level 3-4. Time to reperfusion directly impacts survival in STEMI.",
    s: "Emergency"
  },
  {
    q: "A nurse is managing a client on a mechanical ventilator who suddenly develops high-pressure alarms, decreased oxygen saturation, absent breath sounds on the right side, and tracheal deviation to the left. What should the nurse do first?",
    o: ["Prepare for emergency needle decompression of a tension pneumothorax", "Suction the endotracheal tube to clear a mucus plug", "Reposition the endotracheal tube that may have migrated", "Increase the FiO2 to 100% and call for a chest X-ray"],
    a: 0,
    r: "Absent breath sounds on the right, tracheal deviation to the left (away from the affected side), high ventilator pressures, and desaturation are classic signs of tension pneumothorax. This is a medical emergency requiring immediate needle decompression at the 2nd intercostal space, midclavicular line. Suctioning addresses mucus plugs but not pneumothorax. ET tube repositioning addresses right mainstem intubation (which would show absent LEFT breath sounds). Waiting for an X-ray wastes critical time.",
    s: "Respiratory"
  },
  {
    q: "A nurse receives the following lab results for a client with acute kidney injury: BUN 58 mg/dL, creatinine 4.2 mg/dL, potassium 6.8 mEq/L, pH 7.22. The client has ECG changes showing peaked T waves and widened QRS. Which intervention takes the highest priority?",
    o: ["Administer IV calcium gluconate to stabilize the cardiac membrane", "Administer sodium polystyrene sulfonate (Kayexalate) orally", "Prepare for emergent hemodialysis", "Administer IV sodium bicarbonate to correct acidosis"],
    a: 0,
    r: "With ECG changes (peaked T waves, widened QRS) from severe hyperkalemia (6.8 mEq/L), the most immediate priority is IV calcium gluconate to stabilize the cardiac membrane and prevent fatal dysrhythmia. Calcium gluconate does NOT lower potassium but protects the heart while other treatments work. Kayexalate removes potassium slowly (hours). Hemodialysis is definitive but takes time to arrange. Bicarbonate shifts potassium intracellularly but does not protect the heart as quickly.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client 6 hours after a total hip replacement. The client's hemoglobin drops from 11.2 to 7.8 g/dL, heart rate increases to 118, and the wound drain has 800 mL of bloody output. What should the nurse do?",
    o: ["Notify the surgeon immediately and prepare for possible return to the operating room", "Administer iron supplements orally and continue monitoring", "Apply additional pressure dressings to the wound and elevate the affected leg", "Encourage increased oral fluid intake to compensate for blood loss"],
    a: 0,
    r: "A hemoglobin drop of more than 3 g/dL with excessive wound drainage (800 mL) and compensatory tachycardia indicates significant postoperative hemorrhage. The surgeon must be notified immediately because the client may need surgical re-exploration to identify and control the bleeding source. Oral iron takes weeks to increase hemoglobin. Pressure dressings alone are insufficient for active surgical bleeding. Oral fluids cannot replace blood loss of this magnitude.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client with acute pancreatitis. The client's lipase is 1,240 U/L, amylase is 890 U/L, and WBC is 18,200. The client reports severe epigastric pain radiating to the back. Which positioning should the nurse implement for comfort?",
    o: ["Side-lying with knees flexed toward the chest (fetal position)", "Supine with legs extended flat on the bed", "High Fowler's position with legs elevated on pillows", "Prone position with a pillow under the abdomen"],
    a: 0,
    r: "The fetal position (side-lying with knees drawn to chest) reduces tension on the abdominal muscles and decreases pressure on the inflamed pancreas, providing the most pain relief. Supine position increases pressure on the retroperitoneal pancreas. High Fowler's is used for respiratory distress, not pancreatitis comfort. Prone positioning is uncomfortable and impractical for monitoring an acutely ill client.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with acute ischemic stroke who arrived at the hospital 2 hours after symptom onset. CT scan shows no hemorrhage. The client's BP is 172/96 and blood glucose is 140 mg/dL. Which intervention should the nurse anticipate?",
    o: ["Administration of IV alteplase (tPA) within the 4.5-hour treatment window", "Immediate administration of IV labetalol to lower BP below 140/90", "Administration of aspirin 325 mg and clopidogrel 75 mg", "Heparin drip to prevent clot extension"],
    a: 0,
    r: "For acute ischemic stroke within 4.5 hours of symptom onset with no contraindications on CT, IV alteplase (tPA) is the standard of care. BP must be below 185/110 before tPA administration (this client's BP of 172/96 is acceptable). Aggressively lowering BP below 140/90 could worsen cerebral perfusion. Aspirin and clopidogrel are given after tPA completion, not instead of it. Heparin is not first-line for acute stroke.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with severe burns covering 45% of total body surface area (TBSA). Using the Parkland formula, the client weighs 80 kg. What is the total fluid requirement for the first 24 hours?",
    o: ["14,400 mL of lactated Ringer's solution, with half given in the first 8 hours from the time of burn", "7,200 mL of normal saline given at a constant rate over 24 hours", "3,600 mL of 5% dextrose in water given over 12 hours", "1,000 mL of colloid solution per hour for 24 hours"],
    a: 0,
    r: "Parkland formula: 4 mL x body weight (kg) x %TBSA burned = 4 x 80 x 45 = 14,400 mL in the first 24 hours. Half (7,200 mL) is given in the first 8 hours from the TIME OF BURN (not hospital arrival), and the remaining half over the next 16 hours. Lactated Ringer's is the preferred crystalloid. Normal saline at constant rate does not account for the critical first-8-hour window. Dextrose solutions are inappropriate for burn resuscitation.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client with syndrome of inappropriate antidiuretic hormone (SIADH). Serum sodium is 118 mEq/L. Which intervention is the priority?",
    o: ["Restrict fluid intake to 500-1000 mL/day and administer hypertonic saline cautiously if ordered", "Encourage fluid intake of at least 3000 mL/day to flush excess ADH", "Administer furosemide 80 mg IV push immediately", "Begin IV normal saline at 250 mL/hr to correct sodium rapidly"],
    a: 0,
    r: "SIADH causes water retention leading to dilutional hyponatremia. Fluid restriction is the cornerstone of treatment (500-1000 mL/day). Hypertonic saline (3%) may be given cautiously for symptomatic severe hyponatremia (below 120 mEq/L) but sodium correction must not exceed 8-12 mEq/L in 24 hours to prevent osmotic demyelination syndrome. Increasing fluids worsens dilution. Rapid correction with large volumes is dangerous. Furosemide alone does not address the root cause.",
    s: "Endocrine"
  },
  {
    q: "A nurse receives report on four clients. Which client situation represents a failure to rescue?",
    o: ["A client whose early signs of sepsis were documented but no interventions were initiated for 6 hours", "A client who developed a pressure injury despite appropriate preventive measures", "A client who experienced nausea after chemotherapy despite receiving prophylactic antiemetics", "A client whose blood glucose was 200 mg/dL before lunch and insulin was administered"],
    a: 0,
    r: "Failure to rescue occurs when clinicians fail to act on clinical deterioration, leading to preventable harm or death. Documenting early sepsis signs without initiating treatment for 6 hours represents a critical failure to rescue. A pressure injury despite appropriate prevention is an unfortunate outcome but not a failure to rescue. Expected chemotherapy side effects are not failures. Appropriate glucose management shows correct response.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client receiving IV amiodarone for ventricular tachycardia. Which adverse effect requires the nurse to stop the infusion immediately?",
    o: ["Sudden onset of severe hypotension with BP dropping to 70/40 mmHg", "Heart rate slowing from 140 to 92 bpm", "Mild nausea and metallic taste in the mouth", "Phlebitis at the peripheral IV site"],
    a: 0,
    r: "Severe hypotension (BP 70/40) during amiodarone infusion is a life-threatening adverse effect requiring immediate discontinuation. Amiodarone can cause profound vasodilation and negative inotropy. Heart rate reduction from 140 to 92 is the desired therapeutic effect. Mild nausea and metallic taste are common, non-threatening side effects. Phlebitis warrants site change but not infusion discontinuation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client in distributive shock from anaphylaxis. The client received epinephrine 0.3 mg IM. Five minutes later, symptoms persist: BP 68/38, severe bronchospasm, and facial angioedema. What should the nurse do next?",
    o: ["Administer a second dose of epinephrine IM and prepare for IV epinephrine if needed", "Administer diphenhydramine 50 mg IV and wait for improvement", "Apply a tourniquet above the injection site if the allergen was injected", "Position the client in high Fowler's position to aid breathing"],
    a: 0,
    r: "Persistent anaphylaxis after the first epinephrine dose requires a repeat dose every 5-15 minutes. If two IM doses fail, IV epinephrine infusion should be considered. Epinephrine is the ONLY first-line drug for anaphylaxis. Diphenhydramine is adjunctive, not definitive. Tourniquets are outdated. Patients in anaphylactic shock with hypotension should be positioned supine with legs elevated (Trendelenburg), not upright, which would worsen hypotension.",
    s: "Emergency"
  },
  {
    q: "A nurse is reviewing medication orders for a client with heart failure and chronic kidney disease (eGFR 28 mL/min). Which order should the nurse question?",
    o: ["Metformin 1000 mg orally twice daily", "Lisinopril 10 mg orally daily", "Furosemide 40 mg IV twice daily", "Potassium chloride 20 mEq orally daily"],
    a: 0,
    r: "Metformin is contraindicated in clients with eGFR below 30 mL/min due to the risk of lactic acidosis. Impaired renal function prevents adequate clearance of metformin, allowing it to accumulate and cause this life-threatening condition. Lisinopril is used carefully in CKD but not contraindicated. Furosemide is appropriate for volume management in heart failure with CKD. Potassium supplementation requires monitoring but may be needed with loop diuretics.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a pulmonary artery catheter. The readings show: CVP 18 mmHg, PAWP 24 mmHg, cardiac output 3.2 L/min, SVR 2100 dynes/sec/cm5. What do these values indicate?",
    o: ["Left ventricular failure with elevated preload and compensatory vasoconstriction", "Right ventricular failure with fluid volume deficit", "Septic shock with decreased systemic vascular resistance", "Normal hemodynamic values for a post-surgical patient"],
    a: 0,
    r: "Elevated CVP (18, normal 2-8), elevated PAWP (24, normal 6-12), low cardiac output (3.2, normal 4-8), and elevated SVR (2100, normal 800-1200) indicate left ventricular failure. The heart cannot pump effectively (low CO), blood backs up into the pulmonary vasculature (high PAWP), and the body compensates by increasing vasoconstriction (high SVR). Septic shock shows LOW SVR. These values are significantly abnormal.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with cirrhosis who is scheduled for a paracentesis. Prior to the procedure, which lab value is most important to review?",
    o: ["Platelet count and INR to assess coagulation status", "Serum glucose level", "Hemoglobin A1C", "Thyroid function tests"],
    a: 0,
    r: "Paracentesis involves inserting a needle into the peritoneal cavity to drain ascitic fluid. Clients with cirrhosis often have impaired coagulation due to decreased hepatic synthesis of clotting factors and thrombocytopenia from splenic sequestration. Reviewing platelet count and INR before the invasive procedure is critical to assess bleeding risk and determine if coagulation products are needed. Glucose, A1C, and thyroid function are not relevant to procedure safety.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client who is receiving a continuous heparin infusion. The nurse discovers that the infusion pump has been running at twice the prescribed rate for the past 3 hours. What should the nurse do first?",
    o: ["Correct the infusion rate immediately and assess the client for signs of bleeding", "Document the error and continue monitoring without changing the rate", "Discontinue the heparin infusion completely and call the pharmacy", "Administer protamine sulfate immediately without waiting for lab results"],
    a: 0,
    r: "The immediate priority is to stop the harm by correcting the rate and then assess for adverse effects (bleeding). The nurse should check for signs of hemorrhage (bruising, hematuria, oozing from sites), obtain stat aPTT, and notify the provider. An incident report must be filed. Simply documenting without correcting is unsafe. Complete discontinuation may not be necessary. Protamine sulfate is reserved for active significant bleeding, not prophylactically.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with myasthenia gravis who is on pyridostigmine. The client develops increased weakness, excessive salivation, and abdominal cramping. How should the nurse differentiate between myasthenic crisis and cholinergic crisis?",
    o: ["Administer edrophonium (Tensilon) test: improvement indicates myasthenic crisis, worsening indicates cholinergic crisis", "Increase the pyridostigmine dose and observe for improvement", "Discontinue all medications and observe the client for 24 hours", "Administer atropine to treat the excessive secretions and continue current medications"],
    a: 0,
    r: "The edrophonium (Tensilon) test differentiates the two crises. In myasthenic crisis (undermedication), edrophonium temporarily improves strength. In cholinergic crisis (overmedication), edrophonium worsens weakness and increases cholinergic symptoms. Increasing pyridostigmine without diagnosis could worsen cholinergic crisis. Discontinuing all medications could worsen myasthenic crisis. Atropine treats symptoms but not the underlying cause.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with acute liver failure. Which assessment finding indicates the most critical neurological complication?",
    o: ["Stage IV hepatic encephalopathy with absent reflexes and unresponsiveness to stimuli", "Mild confusion and day-night sleep reversal", "Constructional apraxia on cognitive testing", "Asterixis (liver flap) on wrist extension"], 
    a: 0,
    r: "Stage IV hepatic encephalopathy represents the most critical neurological state with coma, absent reflexes, and risk of cerebral edema and brain herniation. This requires ICU-level monitoring, possible intubation, and ICP monitoring. Mild confusion (stage I), constructional apraxia (stage II), and asterixis (stage II) represent earlier, less critical stages that require treatment but are not immediately life-threatening.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is preparing to delegate tasks to an unlicensed assistive personnel (UAP). Which task is outside the UAP's scope of practice?",
    o: ["Assess a wound for signs of infection during a dressing change", "Obtain vital signs on a stable postoperative client", "Assist a client with ambulation using a walker", "Record the client's oral intake at mealtimes"],
    a: 0,
    r: "Assessment is a professional nursing function that cannot be delegated to UAPs. While a UAP can change a dressing (a task), evaluating the wound for signs of infection requires clinical judgment and assessment skills. Obtaining vital signs on stable clients, assisting with ambulation, and recording intake are routine tasks within UAP scope when the client is stable and the RN has provided appropriate instructions.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is monitoring a client who received tissue plasminogen activator (tPA) for acute ischemic stroke 45 minutes ago. The client develops sudden severe headache and vomits. BP is now 210/118. What should the nurse suspect and do?",
    o: ["Suspect hemorrhagic conversion, stop the tPA infusion immediately, and notify the stroke team", "Administer additional tPA to ensure the clot is fully dissolved", "Position the client flat and continue monitoring vital signs every 15 minutes", "Administer ondansetron for nausea and acetaminophen for headache"],
    a: 0,
    r: "Sudden severe headache, vomiting, and acute hypertension after tPA administration are hallmark signs of hemorrhagic conversion (bleeding into the brain). The tPA must be stopped immediately, and emergent CT scan is needed. Cryoprecipitate and tranexamic acid may be needed to reverse the fibrinolytic effect. Additional tPA would worsen bleeding. Flat positioning is inappropriate. Treating symptoms without addressing the bleeding is negligent.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client in the intensive care unit who develops tachycardia, fever, agitation, and profuse diaphoresis 2 days after abrupt discontinuation of a beta-blocker. What should the nurse suspect?",
    o: ["Beta-blocker rebound syndrome causing sympathetic hyperactivity", "Sepsis from a hospital-acquired infection", "Serotonin syndrome from medication interaction", "Malignant hyperthermia from anesthetic agents"],
    a: 0,
    r: "Abrupt discontinuation of beta-blockers can cause rebound sympathetic hyperactivity with tachycardia, hypertension, angina, diaphoresis, and potential myocardial infarction. Beta-blockers must be tapered gradually over 1-2 weeks. The clinical picture fits the timeline and mechanism. Sepsis would have a different trajectory. Serotonin syndrome requires serotonergic medication exposure. Malignant hyperthermia occurs during anesthesia.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with suspected pulmonary embolism. The client has pleuritic chest pain, tachycardia, dyspnea, and SpO2 of 88%. D-dimer is 2,800 ng/mL. Which diagnostic test should the nurse anticipate for definitive diagnosis?",
    o: ["CT pulmonary angiography (CTPA)", "Chest X-ray", "Ventilation-perfusion (V/Q) scan as the first test", "Transthoracic echocardiogram"],
    a: 0,
    r: "CT pulmonary angiography is the gold standard diagnostic test for pulmonary embolism, providing direct visualization of the clot in the pulmonary vasculature. It has high sensitivity and specificity. Chest X-ray may show nonspecific findings but cannot confirm PE. V/Q scan is an alternative when CTPA is contraindicated (contrast allergy, renal failure) but is not first-line. Echocardiogram can show right heart strain but is not definitive for PE.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion who develops sudden hypotension, fever, flank pain, and dark-colored urine within the first 15 minutes. Which type of transfusion reaction is this?",
    o: ["Acute hemolytic transfusion reaction from ABO incompatibility", "Febrile non-hemolytic transfusion reaction", "Transfusion-related acute lung injury (TRALI)", "Allergic transfusion reaction"],
    a: 0,
    r: "Acute hemolytic transfusion reaction occurs within minutes of starting a transfusion with ABO-incompatible blood. Classic signs include hypotension, fever, chills, flank/back pain, hemoglobinuria (dark urine from lysed red blood cells), and DIC. This is a medical emergency. Febrile non-hemolytic reactions cause only fever without hemodynamic instability. TRALI presents with acute respiratory distress. Allergic reactions cause urticaria and pruritus.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client on a ventilator with PEEP of 10 cmH2O. The client's SpO2 is 91% on FiO2 of 80%. The provider orders an increase in PEEP to 14 cmH2O. Which potential complication should the nurse monitor for after this change?",
    o: ["Decreased cardiac output from reduced venous return due to increased intrathoracic pressure", "Improved cardiac output from enhanced oxygenation", "Metabolic alkalosis from improved ventilation", "Decreased intracranial pressure from improved gas exchange"],
    a: 0,
    r: "Increasing PEEP raises intrathoracic pressure, which compresses the great veins and reduces venous return to the heart, potentially decreasing cardiac output and blood pressure. The nurse must monitor BP, cardiac output, and urine output closely after PEEP adjustments. While PEEP improves oxygenation, the hemodynamic trade-off must be carefully balanced. PEEP can also increase ICP by impeding cerebral venous drainage.",
    s: "Respiratory"
  },
  {
    q: "A nurse is assessing a client post-carotid endarterectomy. Which finding requires immediate intervention?",
    o: ["Stridor and increasing neck swelling indicating possible hematoma formation", "Mild hoarseness that was not present preoperatively", "Blood pressure of 142/88 mmHg", "Mild incisional discomfort rated 3/10"],
    a: 0,
    r: "Stridor (high-pitched breathing sound) with increasing neck swelling after carotid endarterectomy indicates hematoma formation that may compress the airway, a surgical emergency. The airway can be completely occluded within minutes. The surgeon must be notified immediately and emergency airway equipment (including tracheostomy tray) must be at bedside. Mild hoarseness may indicate cranial nerve irritation. Moderate BP and mild pain are expected findings.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with status epilepticus. The client has been seizing continuously for 8 minutes. Which medication should the nurse anticipate administering first?",
    o: ["IV lorazepam (Ativan) as the first-line benzodiazepine for status epilepticus", "Oral phenytoin loading dose", "IV phenobarbital as the initial treatment", "Rectal diazepam followed by intramuscular fosphenytoin"],
    a: 0,
    r: "IV lorazepam is the recommended first-line treatment for status epilepticus (seizures lasting more than 5 minutes or recurring without consciousness recovery). Benzodiazepines enhance GABA activity and terminate seizures rapidly. If IV access is unavailable, IM midazolam is an alternative. Oral phenytoin cannot be given during active seizures. Phenobarbital is a second-line agent. The sequence is: benzodiazepine first, then anti-seizure medication loading if needed.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client admitted with acute exacerbation of heart failure. The client's BNP is 1,840 pg/mL, creatinine is 2.1 mg/dL, and the client has 3+ pitting edema bilaterally. The provider orders IV furosemide. Which assessment is most important before administering the diuretic?",
    o: ["Current blood pressure and recent serum potassium level", "Client's dietary preferences and meal schedule", "Time of last bowel movement", "Client's exercise tolerance and mobility level"],
    a: 0,
    r: "Before administering IV furosemide, the nurse must verify blood pressure (hypotension contraindicates diuretics) and potassium level (loop diuretics cause potassium loss, and hypokalemia increases cardiac dysrhythmia risk, especially in heart failure). With creatinine already elevated at 2.1, renal function monitoring is also critical. Dietary preferences, bowel habits, and exercise tolerance are not relevant to safe diuretic administration.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute pancreatitis who develops sudden abdominal rigidity, rebound tenderness, and a temperature spike to 39.8C. The client's WBC increases from 14,000 to 28,000. What complication should the nurse suspect?",
    o: ["Pancreatic abscess or infected pancreatic necrosis requiring surgical consultation", "Expected progression of uncomplicated acute pancreatitis", "Paralytic ileus from decreased bowel motility", "Biliary colic from a gallstone lodged in the common bile duct"],
    a: 0,
    r: "Sudden onset of peritoneal signs (abdominal rigidity, rebound tenderness), high fever, and a dramatic WBC increase in acute pancreatitis strongly suggest infected pancreatic necrosis or abscess. This is a life-threatening complication requiring CT-guided drainage or surgical debridement and IV antibiotics. Uncomplicated pancreatitis does not produce peritoneal signs. Paralytic ileus causes distension, not rigidity. Biliary colic is colicky pain, not peritonitis.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with Addisonian crisis. The client's BP is 72/44, serum sodium is 128 mEq/L, potassium is 6.1 mEq/L, and blood glucose is 52 mg/dL. Which intervention should the nurse anticipate first?",
    o: ["IV hydrocortisone bolus followed by normal saline fluid resuscitation and dextrose", "Administer insulin to treat the hyperkalemia", "Restrict sodium intake and administer potassium supplements", "Begin vasopressor therapy before any hormone replacement"],
    a: 0,
    r: "Addisonian crisis (acute adrenal insufficiency) causes cortisol and aldosterone deficiency leading to hypotension, hyponatremia, hyperkalemia, and hypoglycemia. IV hydrocortisone is the definitive treatment that addresses the hormone deficiency. NS fluid resuscitation corrects hypovolemia and hyponatremia. Dextrose corrects hypoglycemia. Insulin would worsen hypoglycemia. Potassium supplementation is contraindicated with K+ of 6.1. Vasopressors alone do not address the root cause.",
    s: "Endocrine"
  },
  {
    q: "A charge nurse is making assignments for four clients. Which client should be assigned to the most experienced registered nurse?",
    o: ["A client on a continuous insulin drip whose blood glucose has been fluctuating between 45 and 380 mg/dL", "A client 3 days post-cholecystectomy who is tolerating a regular diet", "A client with stable chronic heart failure awaiting discharge teaching", "A client receiving IV antibiotics for a urinary tract infection"],
    a: 0,
    r: "The client with widely fluctuating blood glucose on a continuous insulin drip requires the most experienced nurse because this situation demands frequent monitoring, dose titrations, and rapid clinical decision-making to prevent life-threatening hypo- or hyperglycemia. The post-cholecystectomy client is stable. Discharge teaching requires experience but is not time-sensitive. IV antibiotic administration is a routine task for any RN.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client receiving vancomycin. The trough level drawn before the fourth dose is 28 mcg/mL (therapeutic range 15-20 mcg/mL). What should the nurse do?",
    o: ["Hold the dose, notify the provider, and monitor serum creatinine for nephrotoxicity", "Administer the dose as scheduled since the level will decrease on its own", "Increase the dose to achieve even higher trough levels for maximum efficacy", "Administer an extra dose to maintain consistent drug levels"],
    a: 0,
    r: "A vancomycin trough of 28 mcg/mL exceeds the therapeutic range (15-20 mcg/mL for serious infections), placing the client at significant risk for nephrotoxicity and ototoxicity. The nurse must hold the dose and notify the provider for dose adjustment. Serum creatinine should be monitored to detect early kidney injury. Administering the dose or increasing it would worsen toxicity. Drug levels above 20 mcg/mL are associated with increased nephrotoxicity rates.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is performing rapid sequence intubation preparation. The provider requests that medications be drawn up. Which medication combination is standard for RSI?",
    o: ["Sedative (etomidate or propofol) followed by neuromuscular blocker (succinylcholine or rocuronium)", "Midazolam and morphine for sedation and analgesia", "Ketamine and fentanyl only, without a paralytic agent", "Atropine and glycopyrrolate to reduce secretions"],
    a: 0,
    r: "Rapid sequence intubation requires an induction agent (sedative) to produce unconsciousness followed immediately by a neuromuscular blocking agent (paralytic) to facilitate intubation. Common combinations include etomidate + succinylcholine or propofol + rocuronium. Midazolam and morphine provide sedation but not the rapid onset needed. Ketamine alone does not provide muscle relaxation. Anticholinergics are adjunctive, not primary RSI drugs.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client who is 3 hours post-liver biopsy. The client reports sudden right shoulder pain. What should the nurse suspect?",
    o: ["Hemorrhage from the biopsy site with diaphragmatic irritation causing referred pain to the shoulder", "Musculoskeletal strain from positioning during the procedure", "Normal postprocedural discomfort that requires only acetaminophen", "Pneumothorax from the biopsy needle entering the pleural space"],
    a: 0,
    r: "Right shoulder pain after liver biopsy is a classic sign of hemorrhage causing diaphragmatic irritation. Blood from the liver biopsy site pools around the diaphragm, and the phrenic nerve (C3-C5) refers pain to the right shoulder (Kehr sign for right side). This is a potentially life-threatening complication requiring immediate assessment of vital signs, hemoglobin, and possible ultrasound. The nurse should position the client on the right side to apply pressure to the biopsy site.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a client with a chest tube who accidentally pulls the tube out of the chest wall. What should the nurse do immediately?",
    o: ["Apply petroleum gauze over the insertion site and tape on three sides to create a flutter valve effect", "Leave the site open to air and call the provider", "Reinsert the chest tube using sterile technique", "Apply a fully occlusive dressing taped on all four sides"],
    a: 0,
    r: "A dislodged chest tube creates an open pneumothorax. Petroleum gauze taped on three sides creates a flutter valve that allows air to escape during exhalation but prevents air entry during inhalation. Leaving the site open risks worsening pneumothorax. Reinserting a chest tube is a physician procedure. A fully occlusive dressing (taped on all four sides) can cause tension pneumothorax by trapping air in the pleural space.",
    s: "Respiratory"
  },
  {
    q: "A nurse is participating in a code blue. The client is in pulseless ventricular tachycardia. CPR is in progress. After the first defibrillation attempt at 200J biphasic, the rhythm remains unchanged. What should the nurse anticipate next?",
    o: ["Resume CPR for 2 minutes, then deliver a second shock, and administer epinephrine 1 mg IV", "Perform another defibrillation immediately without resuming CPR", "Administer amiodarone 300 mg IV before the next shock", "Stop CPR and prepare for emergency pericardiocentesis"],
    a: 0,
    r: "Per ACLS protocol for pulseless VT/VF: after the first shock, immediately resume CPR for 2 minutes (5 cycles), deliver a second shock, and administer epinephrine 1 mg IV/IO (repeated every 3-5 minutes). Amiodarone 300 mg IV is given after the THIRD shock if the rhythm persists. Defibrillation without intervening CPR is ineffective. Pericardiocentesis is for cardiac tamponade, not VT.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client with chronic liver disease who develops hepatorenal syndrome. Which finding would the nurse expect?",
    o: ["Oliguria with rising creatinine despite adequate fluid resuscitation and no structural kidney damage", "Polyuria with dilute urine and low serum creatinine", "Hematuria with red blood cell casts on urinalysis", "Normal renal function with only mildly elevated BUN"],
    a: 0,
    r: "Hepatorenal syndrome is a functional renal failure that occurs in advanced liver disease due to severe renal vasoconstriction (not structural kidney damage). It presents with progressive oliguria, rising creatinine, and low urine sodium (below 10 mEq/L) despite adequate volume resuscitation. The kidneys are structurally normal. Polyuria indicates diabetes insipidus. RBC casts suggest glomerulonephritis. Normal renal function rules out the diagnosis.",
    s: "Renal"
  }
];
