const pg = require('pg');
const crypto = require('crypto');

const BATCH_ID = `paramedic-bulk-${Date.now()}`;

const DOMAINS = [
  {
    domain: "Airway Management", count: 180,
    scenarios: [
      { subtopic: "BVM Ventilation", stems: [
        { scenario: (p) => `You respond to a ${p.age}-year-old ${p.sex} found unresponsive in their home. Bystanders report the patient collapsed approximately 5 minutes ago. On arrival, the patient has agonal respirations at 4 breaths/min, HR ${p.hr}, BP ${p.bp}, SpO2 78% on room air. The patient has a GCS of 3 (E1V1M1). You initiate BVM ventilation. Which of the following is the most important step to ensure effective ventilation?`, options: ["Ensure a proper mask seal using the E-C clamp technique with jaw thrust", "Immediately insert an oropharyngeal airway before any ventilation attempts", "Ventilate at a rate of 20-24 breaths per minute to rapidly improve oxygenation", "Apply cricoid pressure before initiating any ventilation attempts"], correct: 0, difficulty: 2 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is found in cardiac arrest. Your partner is performing CPR while you prepare to ventilate with a BVM. After inserting an OPA, you notice significant gastric distension developing during ventilation. The patient's SpO2 remains at 72%. Which intervention should you prioritize?`, options: ["Reduce tidal volume and ventilation rate to prevent further gastric distension", "Perform a needle decompression of the stomach", "Switch to mouth-to-mask ventilation for better volume control", "Insert a nasogastric tube immediately to decompress the stomach"], correct: 0, difficulty: 3 },
        { scenario: (p) => `Paramedics are ventilating a ${p.age}-year-old ${p.sex} with a BVM after a witnessed cardiac arrest. The patient has a ROSC but remains apneic. Current ventilation rate is 10 breaths/min with an SpO2 of 94% and EtCO2 of 38 mmHg. Which adjustment to BVM ventilation is most appropriate?`, options: ["Maintain current ventilation parameters as they are within target ranges", "Increase ventilation rate to 16-20 breaths/min to improve oxygenation", "Decrease FiO2 to maintain SpO2 between 94-99% to avoid hyperoxia", "Add PEEP valve and increase tidal volume to improve lung recruitment"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Supraglottic Airways", stems: [
        { scenario: (p) => `You are managing a ${p.age}-year-old ${p.sex} in cardiac arrest. After two failed intubation attempts, you decide to place a supraglottic airway device. The patient weighs approximately ${p.weight} kg. After insertion of an appropriately sized King LT airway, you ventilate and note no chest rise, absent breath sounds bilaterally, and an EtCO2 reading of 0 mmHg. What is the most likely cause?`, options: ["The device is in the esophagus with the distal balloon not properly positioned", "The device is too small for the patient, allowing air leak around the seal", "The proximal cuff is not adequately inflated to seal the oropharynx", "The device has been inserted too deep, occluding the ventilation ports"], correct: 3, difficulty: 4 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with altered mental status, GCS 6, and copious vomiting. BP ${p.bp}, HR ${p.hr}, RR 8, SpO2 85%. You need to secure the airway. Which supraglottic airway consideration is most important in this patient?`, options: ["Suction the airway thoroughly before placement and consider a device with gastric drainage port", "Supraglottic airways are contraindicated in patients with active vomiting", "Place the patient in Trendelenburg position before inserting any supraglottic device", "Use the largest available supraglottic airway to prevent aspiration around the device"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Endotracheal Intubation", stems: [
        { scenario: (p) => `You are intubating a ${p.age}-year-old ${p.sex} who was found unresponsive. After placing a 7.5 mm ETT, you note condensation in the tube, bilateral breath sounds, but an EtCO2 reading of 8 mmHg. The patient has a palpable carotid pulse at ${p.hr} bpm. What is the most appropriate interpretation?`, options: ["The tube is properly placed; the low EtCO2 reflects poor cardiac output and perfusion", "The tube is in the esophagus and should be immediately removed and replaced", "The EtCO2 monitor is malfunctioning and should be replaced with a different detector", "The tube is in the right mainstem bronchus and needs to be withdrawn 2 cm"], correct: 0, difficulty: 4 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} requires emergent intubation after a motor vehicle collision. On assessment, the patient has blood in the oropharynx, a cervical collar in place, limited mouth opening of 2 cm, and a Mallampati score of IV. BP ${p.bp}, HR ${p.hr}, SpO2 88% on 15L NRB. What is the most appropriate airway management strategy?`, options: ["Proceed with video laryngoscopy while maintaining in-line stabilization", "Perform a surgical cricothyrotomy as the primary airway intervention", "Attempt direct laryngoscopy with a bougie as the first-line approach", "Place a supraglottic airway and transport immediately without further attempts"], correct: 0, difficulty: 5 },
        { scenario: (p) => `During intubation of a ${p.age}-year-old ${p.sex}, you achieve a Grade IIb Cormack-Lehane view. You are using a Macintosh blade. Which technique is most likely to improve your laryngoscopic view?`, options: ["Apply backward, upward, rightward pressure (BURP) to the thyroid cartilage", "Switch to a Miller blade for better epiglottis displacement", "Increase the head tilt to maximum extension", "Have your partner apply bilateral mandibular advancement"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Surgical Airway", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with severe facial trauma from an assault. Massive facial swelling and hemorrhage prevent visualization of any anatomy. BVM ventilation is ineffective despite two-person technique. SpO2 is dropping to 65%. Two attempts at supraglottic airway placement have failed. Which is the most appropriate next step?`, options: ["Perform an emergency surgical cricothyrotomy", "Attempt nasotracheal intubation blindly", "Continue BVM with repositioning and increased force", "Request advanced airway team and continue current management"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Capnography", stems: [
        { scenario: (p) => `You are monitoring a ${p.age}-year-old ${p.sex} intubated patient during transport. The waveform capnography suddenly shows a shark fin pattern with an EtCO2 of 52 mmHg, up from a baseline of 38 mmHg. The patient's SpO2 is 96%, HR ${p.hr}, BP ${p.bp}. What does this capnography change most likely indicate?`, options: ["Bronchospasm causing increased airway resistance and CO2 trapping", "Right mainstem bronchus intubation with unilateral ventilation", "Tension pneumothorax developing on the ventilated side", "ETT obstruction from secretions causing increased dead space"], correct: 0, difficulty: 4 },
        { scenario: (p) => `During cardiac arrest resuscitation of a ${p.age}-year-old ${p.sex}, the EtCO2 has been consistently reading 12-15 mmHg during CPR. After the third round of epinephrine, the EtCO2 suddenly rises to 42 mmHg. What is the most likely explanation?`, options: ["Return of spontaneous circulation (ROSC) has occurred", "The endotracheal tube has migrated into the esophagus", "The patient has developed a tension pneumothorax", "Sodium bicarbonate administration has caused a transient CO2 rise"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "RSI Technique", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with a GCS of 7 after a fall from a roof. The patient has active emesis and is combative. BP ${p.bp}, HR ${p.hr}, RR 22, SpO2 91% on NRB. Medical control authorizes RSI. After preoxygenation, you administer ketamine 2 mg/kg and succinylcholine 1.5 mg/kg. Fasciculations occur but the patient remains clenching their jaw 90 seconds later. What is the most appropriate action?`, options: ["Administer an additional dose of succinylcholine at 1.5 mg/kg", "Wait an additional 60 seconds as the onset may be delayed", "Administer rocuronium 1.2 mg/kg as a rescue paralytic", "Proceed with a supraglottic airway without further paralysis attempts"], correct: 2, difficulty: 5 },
      ]},
      { subtopic: "Difficult Airway Assessment", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with a history of rheumatoid arthritis and morbid obesity (BMI 45) presents with respiratory failure. The patient has a short thick neck, Mallampati IV, limited neck mobility, and a thyromental distance of 4 cm. SpO2 is 82% despite high-flow oxygen. Which factor in this assessment is most predictive of a difficult intubation?`, options: ["Mallampati IV classification with limited neck mobility", "Morbid obesity with BMI of 45", "Short thyromental distance of 4 cm", "History of rheumatoid arthritis affecting cervical spine"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Oxygen Delivery Devices", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with COPD presents with increased dyspnea over the past 3 days. Current vital signs: BP ${p.bp}, HR ${p.hr}, RR 24, SpO2 86% on room air. The patient is using accessory muscles and speaking in 3-4 word sentences. Which oxygen delivery method is most appropriate for initial management?`, options: ["Venturi mask at 28% FiO2 with titration to SpO2 88-92%", "Non-rebreather mask at 15 L/min targeting SpO2 >95%", "Nasal cannula at 2 L/min with no further adjustments", "High-flow nasal cannula at 40 L/min with 100% FiO2"], correct: 0, difficulty: 2 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is experiencing an acute asthma exacerbation. After administering nebulized albuterol, the patient's SpO2 is 90%, RR 30, with audible wheezing and intercostal retractions. Which oxygen delivery system provides the highest FiO2 in the prehospital setting?`, options: ["Non-rebreather mask at 15 L/min providing approximately 90% FiO2", "BVM with reservoir connected to oxygen at 15 L/min providing near 100% FiO2", "Venturi mask set to maximum providing 60% FiO2", "Simple face mask at 10 L/min providing approximately 80% FiO2"], correct: 1, difficulty: 2 },
      ]},
      { subtopic: "Suctioning Techniques", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is found unresponsive with copious blood and emesis in the airway. On log roll, a large volume of fluid drains from the mouth. You are preparing to suction the airway. Which technique is most appropriate for this situation?`, options: ["Use a rigid-tip Yankauer suction catheter with continuous suction while sweeping the oropharynx", "Use a flexible French suction catheter inserted to the level of the carina", "Suction for no more than 5 seconds at a time with a soft-tip catheter", "Position the patient prone and allow gravity drainage before any suctioning"], correct: 0, difficulty: 2 },
      ]},
    ]
  },
  {
    domain: "Cardiology/ECG", count: 210,
    scenarios: [
      { subtopic: "12-Lead ECG Interpretation", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with crushing substernal chest pain radiating to the left arm for 45 minutes. BP ${p.bp}, HR ${p.hr}, RR 20, SpO2 97%. The 12-lead ECG shows ST elevation of 3 mm in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery is most likely occluded?`, options: ["Right coronary artery (RCA)", "Left anterior descending artery (LAD)", "Left circumflex artery (LCx)", "Left main coronary artery"], correct: 0, difficulty: 3 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} complains of chest pressure and shortness of breath. The 12-lead ECG shows ST elevation in leads V1-V4 with tall hyperacute T waves. BP ${p.bp}, HR ${p.hr}, SpO2 95%. What type of MI does this pattern represent?`, options: ["Anterior wall STEMI involving the LAD territory", "Inferior wall STEMI involving the RCA territory", "Lateral wall STEMI involving the circumflex territory", "Posterior wall STEMI with mirror changes"], correct: 0, difficulty: 2 },
        { scenario: (p) => `You obtain a 12-lead ECG on a ${p.age}-year-old ${p.sex} with syncope. The ECG shows a short PR interval (<120 ms), a delta wave at the beginning of the QRS complex, and a widened QRS. HR is 78 bpm and regular. What is the most likely diagnosis?`, options: ["Wolff-Parkinson-White (WPW) syndrome", "First-degree AV block with bundle branch block", "Brugada syndrome", "Ventricular pre-excitation with atrial fibrillation"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Acute Coronary Syndrome", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with a history of diabetes and hypertension presents with 2 hours of epigastric discomfort, diaphoresis, and nausea. BP ${p.bp}, HR ${p.hr}, SpO2 96%. The 12-lead ECG is unremarkable. Troponin is not available in the field. What is the most appropriate prehospital management?`, options: ["Treat as suspected ACS: aspirin 324 mg, IV access, serial 12-leads, and transport to a cardiac facility", "Administer an antacid and monitor for 15 minutes before deciding on transport", "Start nitroglycerin 0.4 mg SL and transport only if ECG changes develop", "This is likely GERD; provide reassurance and offer BLS transport"], correct: 0, difficulty: 3 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is experiencing a STEMI with ST elevation in leads II, III, aVF. Right-sided leads show ST elevation in V4R. BP is 82/50 mmHg, HR ${p.hr}, lungs are clear. The patient is diaphoretic. Which medication is contraindicated?`, options: ["Nitroglycerin due to right ventricular MI with preload-dependent hemodynamics", "Aspirin due to potential gastrointestinal bleeding", "Morphine due to respiratory depression risk", "Normal saline fluid bolus due to volume overload risk"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Dysrhythmia Recognition", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with palpitations and lightheadedness. The cardiac monitor shows a narrow-complex regular tachycardia at 180 bpm. No P waves are visible. BP ${p.bp}, SpO2 98%. What is the most appropriate initial intervention?`, options: ["Attempt vagal maneuvers such as modified Valsalva or carotid sinus massage", "Administer adenosine 6 mg rapid IV push followed by a 20 mL saline flush", "Perform synchronized cardioversion at 50-100 joules", "Administer amiodarone 150 mg IV over 10 minutes"], correct: 0, difficulty: 2 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} on digoxin and metoprolol presents with weakness and near-syncope. The monitor shows a wide-complex bradycardia at 32 bpm with no discernible P waves and irregular R-R intervals. BP 78/52, SpO2 94%. What is the most likely rhythm and appropriate treatment?`, options: ["Third-degree AV block with ventricular escape; transcutaneous pacing and atropine", "Atrial fibrillation with aberrant conduction; rate control with diltiazem", "Accelerated idioventricular rhythm; observation only as it is often benign", "Torsades de pointes; administer magnesium sulfate 2g IV"], correct: 0, difficulty: 4 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with no cardiac history develops sudden onset palpitations while exercising. The monitor shows a regular wide-complex tachycardia at 210 bpm. The patient is alert and oriented with BP ${p.bp} and SpO2 97%. What is the priority treatment?`, options: ["Administer amiodarone 150 mg IV over 10 minutes for presumed ventricular tachycardia", "Attempt vagal maneuvers followed by adenosine 6 mg rapid IVP", "Perform immediate synchronized cardioversion at 100 joules", "Administer procainamide 20 mg/min IV infusion"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Cardioversion/Defibrillation", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with atrial fibrillation presents with an HR of 188 bpm, BP 76/48, altered mental status, and chest pain. SpO2 92%. What is the most appropriate immediate treatment?`, options: ["Synchronized cardioversion starting at 120-200 joules biphasic", "Administer diltiazem 0.25 mg/kg IV over 2 minutes for rate control", "Administer adenosine 6 mg rapid IVP to break the rhythm", "Defibrillate at 200 joules biphasic without synchronization"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Pacing", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with syncope. The monitor shows a second-degree Type II AV block with a ventricular rate of 34 bpm. BP 68/40, the patient is now unresponsive. Atropine 0.5 mg has been given with no effect. What is the next most appropriate intervention?`, options: ["Initiate transcutaneous pacing at 60-80 mA with a rate of 60-80 ppm", "Administer a second dose of atropine 1 mg IV push", "Begin a dopamine infusion at 5-20 mcg/kg/min", "Administer epinephrine 1 mg IV push for bradycardic arrest"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Heart Failure", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with a history of CHF presents with severe dyspnea, orthopnea, and pink frothy sputum. BP 198/112, HR ${p.hr}, RR 32, SpO2 82% on room air. Lung auscultation reveals bilateral crackles to the apices. What is the most appropriate initial prehospital treatment?`, options: ["CPAP at 5-10 cmH2O with nitroglycerin 0.4 mg SL", "Furosemide 40 mg IV and morphine 2 mg IV", "Intubation with positive pressure ventilation", "Albuterol nebulization for bronchospasm with supplemental oxygen"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Hypertensive Emergencies", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} calls 911 for a severe headache. On arrival, BP is 242/138, HR 88, RR 18. The patient reports blurred vision and has a nosebleed. Neurological exam reveals unilateral arm weakness. What is the most concerning complication and appropriate transport decision?`, options: ["Hypertensive emergency with possible hemorrhagic stroke; immediate transport to a stroke center", "Hypertensive urgency; administer oral antihypertensives and transport", "Epistaxis with incidental hypertension; control bleeding and transport", "Migraine with aura; administer analgesics and transport to nearest ED"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Cardiac Tamponade", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} involved in a stabbing to the left chest presents with hypotension (BP 72/54), tachycardia (HR 132), distended jugular veins, and muffled heart sounds. SpO2 91%. What is the most likely diagnosis and prehospital management?`, options: ["Cardiac tamponade; rapid transport to a trauma center for pericardiocentesis or thoracotomy", "Tension pneumothorax; needle decompression at the 2nd intercostal space midclavicular line", "Massive hemothorax; bilateral needle decompression and fluid resuscitation", "Myocardial contusion; 12-lead ECG and monitoring during transport"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Sinus Rhythms and Blocks", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents after a syncopal episode while walking. The cardiac monitor shows a regular rhythm with a constant PR interval of 0.32 seconds, a rate of 58 bpm, and normal QRS complexes. BP ${p.bp}, the patient is now alert and asymptomatic. What is the most accurate rhythm interpretation?`, options: ["First-degree AV block with sinus bradycardia", "Second-degree Type I (Wenckebach) AV block", "Normal sinus rhythm with artifact", "Junctional rhythm with retrograde P waves"], correct: 0, difficulty: 2 },
      ]},
    ]
  },
  {
    domain: "Trauma Management", count: 210,
    scenarios: [
      { subtopic: "Primary Survey", stems: [
        { scenario: (p) => `You arrive at a single-vehicle MVC. A ${p.age}-year-old ${p.sex} unrestrained driver has been ejected from the vehicle. The patient is responsive to painful stimuli only, has sonorous respirations, a deformed right femur, and blood pooling beneath the head. During your primary survey, you clear the airway with a jaw thrust and the patient begins breathing at 28/min. What is your next priority?`, options: ["Assess circulation: check pulse, control hemorrhage, and assess for shock", "Immediately immobilize the cervical spine with a collar", "Perform a detailed secondary survey to identify all injuries", "Establish IV access and begin fluid resuscitation"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Hemorrhage Control", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} construction worker has a large laceration to the left thigh from a circular saw with arterial bleeding. Direct pressure with a hemostatic gauze has been applied for 3 minutes but bleeding continues through the dressing. BP 96/62, HR 128, SpO2 99%, skin is pale and diaphoretic. What is the most appropriate next step?`, options: ["Apply a commercial tourniquet proximal to the wound and note the time of application", "Apply additional dressings on top of the current one and increase direct pressure", "Elevate the extremity above the level of the heart to reduce arterial pressure", "Apply pressure to the femoral artery at the inguinal crease as a pressure point", ], correct: 0, difficulty: 2 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} has a penetrating wound to the right axillary region with uncontrolled hemorrhage. A tourniquet cannot be applied due to the wound location. BP 84/50, HR 138, altered mental status. Which intervention is most appropriate for this junctional hemorrhage?`, options: ["Pack the wound with hemostatic gauze and apply direct pressure for a minimum of 3 minutes", "Apply a commercial junctional tourniquet device to the right axilla", "Clamp the visible bleeding vessels with hemostats", "Apply a pressure dressing and initiate rapid transport without further intervention"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Spinal Motion Restriction", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} fell approximately 15 feet from a ladder, landing on their feet. The patient is ambulatory and complaining of mid-back pain. GCS 15, BP ${p.bp}, HR ${p.hr}. No neurological deficits are present. Based on current evidence, what is the most appropriate spinal precaution?`, options: ["Apply a cervical collar and secure to a long backboard with full spinal immobilization", "Apply a cervical collar and transport on the stretcher in a position of comfort with movement restriction", "No spinal precautions are needed since the patient is ambulatory with no deficits", "Apply a KED (Kendrick Extrication Device) before any movement of the patient"], correct: 1, difficulty: 3 },
      ]},
      { subtopic: "Chest Trauma", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} has been stabbed in the right chest at the 4th intercostal space, anterior axillary line. On assessment: BP 88/60, HR 134, RR 36, SpO2 84%, absent breath sounds on the right, tracheal deviation to the left, and distended jugular veins. What is the immediate intervention?`, options: ["Needle decompression at the 2nd intercostal space, midclavicular line on the right", "Apply an occlusive dressing sealed on three sides over the wound", "Endotracheal intubation with positive pressure ventilation", "Rapid IV fluid bolus of 1L normal saline"], correct: 0, difficulty: 3 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} involved in a high-speed MVC presents with paradoxical chest wall movement over the right anterolateral chest. BP ${p.bp}, HR ${p.hr}, RR 32, SpO2 88%, with severe respiratory distress. What is the most likely injury and best prehospital management?`, options: ["Flail chest segment; provide positive pressure ventilation with BVM or CPAP and analgesia", "Simple rib fractures; administer oxygen by nasal cannula and splint with tape", "Open pneumothorax; apply an occlusive dressing sealed on three sides", "Pulmonary contusion only; administer high-flow oxygen and monitor"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Abdominal Trauma", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} bicyclist was struck by a car and thrown over the handlebars. The patient complains of severe left upper quadrant pain with radiation to the left shoulder (Kehr's sign). BP 92/58, HR 126, RR 24, SpO2 97%, abdomen is rigid and distended. What is the most likely injured organ?`, options: ["Spleen with intra-abdominal hemorrhage", "Left kidney with retroperitoneal bleeding", "Pancreas with enzymatic peritonitis", "Stomach with gastric perforation"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Burns", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} (${p.weight} kg) was rescued from a house fire and has circumferential full-thickness burns to both lower extremities and partial-thickness burns to the anterior trunk. Using the Rule of Nines, what is the approximate TBSA burned and the initial fluid resuscitation rate using the Parkland formula for the first 8 hours?`, optionsFn: (p) => [`Approximately 36% TBSA; ${Math.round(p.weight * 36 * 4 / 2 / 8 * 10) / 10} mL/hr (half of total in first 8 hours)`, "Approximately 27% TBSA; give 2 mL/kg/% TBSA total over 24 hours", "Approximately 45% TBSA; give crystalloid at 500 mL/hr regardless of weight", "Approximately 18% TBSA; give 20 mL/kg bolus then reassess"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Blast Injuries", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} was standing 10 meters from an industrial explosion. The patient is conscious but disoriented, complaining of bilateral ear pain with blood from both ear canals, and abdominal pain. BP ${p.bp}, HR ${p.hr}, RR 28, SpO2 93%. Which blast injury mechanism is most responsible for the tympanic membrane rupture?`, options: ["Primary blast injury from the pressure wave", "Secondary blast injury from projectile fragments", "Tertiary blast injury from displacement of the body", "Quaternary blast injury from thermal and chemical exposure"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Penetrating Trauma", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with a gunshot wound to the right upper quadrant of the abdomen. An exit wound is noted in the right flank. BP 78/42, HR 144, RR 30, SpO2 96%, skin is cool and diaphoretic. What is the most appropriate prehospital management approach?`, options: ["Apply occlusive dressings to both wounds, establish bilateral large-bore IVs, and initiate rapid transport to a trauma center", "Pack both wounds with hemostatic gauze and apply a tourniquet to the abdomen", "Stabilize with a MAST/PASG garment and begin aggressive fluid resuscitation on scene", "Delay transport for a thorough secondary survey and establish central venous access"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Blunt Trauma", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} restrained driver is involved in a T-bone collision on the driver's side at approximately 45 mph. Airbags deployed. The patient complains of left-sided chest and abdominal pain. BP ${p.bp}, HR ${p.hr}, SpO2 94%. You note crepitus over the left lower ribs. Based on the mechanism, which injury pattern are you most concerned about?`, options: ["Splenic laceration with left lower rib fractures", "Liver laceration with right lower rib fractures", "Aortic dissection with sternal fracture", "Diaphragmatic rupture with bowel herniation"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Musculoskeletal Injuries", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} fell while skiing and has an obviously deformed left lower leg with the foot turned laterally. The foot is pale and cool with no palpable dorsalis pedis or posterior tibial pulse. Capillary refill in the toes is >5 seconds. Sensation is diminished distal to the injury. What is the most appropriate prehospital management?`, options: ["Apply gentle longitudinal traction to realign the fracture and reassess distal pulses", "Splint the leg in the position found and transport immediately", "Apply a traction splint for the suspected femur fracture", "Apply an air splint to the lower leg without any manipulation"], correct: 0, difficulty: 3 },
      ]},
    ]
  },
  {
    domain: "Medical Emergencies", count: 210,
    scenarios: [
      { subtopic: "Stroke Assessment", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} developed sudden right-sided weakness and slurred speech 45 minutes ago. BP 178/96, HR ${p.hr}, RR 16, SpO2 98%, glucose 124 mg/dL. Cincinnati Stroke Scale: facial droop present, right arm drift, slurred speech. The nearest comprehensive stroke center is 25 minutes away; the nearest primary stroke center is 8 minutes away. What is the most appropriate transport decision?`, options: ["Transport to the nearest primary stroke center as the patient is within the thrombolytic window", "Transport to the comprehensive stroke center for potential thrombectomy capability", "Administer tPA in the field and transport to the nearest hospital", "Treat the hypertension before transport to reduce hemorrhagic risk"], correct: 0, difficulty: 3 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with sudden onset of the worst headache of their life, vomiting, and neck stiffness. GCS 13 (E3V4M6), BP 198/104, HR 62, RR 18, SpO2 99%. Pupils are equal and reactive. What is the most likely diagnosis and critical prehospital consideration?`, options: ["Subarachnoid hemorrhage; avoid lowering blood pressure aggressively and transport emergently", "Ischemic stroke; activate stroke alert and obtain a 12-lead ECG", "Migraine with aura; administer antiemetics and analgesics", "Meningitis; initiate droplet precautions and administer antibiotics"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Diabetic Emergencies", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with Type 1 diabetes is found confused and diaphoretic by coworkers. Blood glucose reads 38 mg/dL. The patient can follow commands but is too confused to swallow safely. An IV has been established. What is the most appropriate intervention?`, options: ["Administer dextrose 50% (D50) 25g IV push", "Administer glucagon 1 mg IM and wait for response", "Administer oral glucose gel buccally and reassess in 5 minutes", "Administer normal saline 500 mL bolus and recheck glucose"], correct: 0, difficulty: 2 },
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with Type 1 diabetes presents with altered mental status, Kussmaul respirations, and fruity breath odor. Blood glucose reads 486 mg/dL. BP 96/60, HR 128, RR 32 and deep, SpO2 99%. The patient's skin is dry and tenting. What is the priority prehospital intervention?`, options: ["Establish IV access and administer a 20 mL/kg normal saline bolus for dehydration", "Administer insulin 10 units regular IV to lower the blood glucose", "Administer sodium bicarbonate IV to correct the metabolic acidosis", "Hyperventilate the patient to compensate for the metabolic acidosis"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Seizures", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is having a generalized tonic-clonic seizure that has been continuous for 8 minutes per bystanders. The patient has no IV access and is actively seizing. SpO2 88%, cyanotic lips. What is the most appropriate initial medication intervention?`, options: ["Administer midazolam 10 mg IM (intranasal if IM not available)", "Administer diazepam 10 mg rectally while establishing IV access", "Administer lorazepam 4 mg IV after establishing IV access first", "Administer phenytoin 15-20 mg/kg IV loading dose"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Anaphylaxis", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} (${p.weight} kg) ate shellfish 20 minutes ago and now presents with diffuse urticaria, angioedema of the lips and tongue, stridor, and wheezing. BP 72/40, HR 138, RR 30, SpO2 86%. What is the most critical first intervention?`, options: ["Administer epinephrine 0.3 mg (1:1,000) IM in the lateral thigh", "Establish IV access and administer diphenhydramine 50 mg IV", "Provide high-flow oxygen and prepare for emergency intubation", "Administer albuterol nebulization for the bronchospasm"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Sepsis", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} nursing home resident presents with altered mental status, fever of 39.4°C (103°F), HR 124, RR 26, BP 82/48, SpO2 93%. The patient has a Foley catheter in place. Skin is warm and flushed. Blood glucose is 186 mg/dL. Based on the qSOFA criteria, this patient scores 3 (altered mentation, RR ≥22, SBP ≤100). What is the priority prehospital treatment?`, options: ["Establish large-bore IV access and administer a 30 mL/kg crystalloid bolus targeting MAP ≥65 mmHg", "Administer broad-spectrum antibiotics IV before transport", "Administer acetaminophen to reduce fever and apply cooling measures", "Initiate vasopressor therapy with norepinephrine before fluid resuscitation"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Electrolyte Disorders", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} on dialysis missed their last two appointments. The patient complains of generalized weakness and a tingling sensation. ECG shows peaked T waves, widened QRS complexes, and loss of P waves. HR 42, BP 88/52. What is the most immediately life-threatening condition and priority treatment?`, options: ["Hyperkalemia; administer calcium chloride 1g (10 mL of 10%) IV slowly", "Hypercalcemia; administer normal saline 1L rapid IV infusion", "Hyponatremia; administer hypertonic saline 3% 100 mL IV", "Hypermagnesemia; administer calcium gluconate 2g IV"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Respiratory Distress", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with a history of asthma presents with severe respiratory distress after exposure to cold air. The patient can only speak single words, is sitting in tripod position, with HR 132, RR 36, SpO2 87%, and has diminished breath sounds with faint end-expiratory wheezing bilaterally. What does the quiet chest finding indicate?`, options: ["Severe bronchospasm with critically reduced air movement indicating near-fatal asthma", "Resolution of the bronchospasm with improving ventilation", "Mucus plugging of the large airways requiring suctioning", "Pneumothorax requiring needle decompression"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Shock Recognition", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} was stung by a wasp 15 minutes ago. The patient has widespread hives but denies dyspnea. BP 88/56, HR 118, RR 18, SpO2 99%. Lung sounds are clear, no stridor or wheezing is present. The patient is anxious but alert. What type of shock is this patient experiencing?`, options: ["Distributive shock (anaphylactic) from massive vasodilation and capillary leak", "Hypovolemic shock from third-spacing of fluid", "Cardiogenic shock from myocardial depression", "Obstructive shock from bronchospasm"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Neurological Assessment", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} fell and struck their head on concrete. The patient was briefly unconscious, then awoke and was conversant. Twenty minutes later, the patient becomes progressively lethargic and develops a fixed dilated left pupil. GCS drops from 14 to 8. BP 178/62, HR 54, RR irregular. What is the most likely intracranial pathology?`, options: ["Epidural hematoma with uncal herniation causing ipsilateral pupil dilation", "Subdural hematoma with contralateral pupil dilation", "Subarachnoid hemorrhage with diffuse cerebral edema", "Diffuse axonal injury with progressive brainstem dysfunction"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Abdominal Emergencies", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} presents with sudden onset severe epigastric pain radiating to the back, nausea, and vomiting. The patient is lying very still and states movement worsens the pain. BP ${p.bp}, HR ${p.hr}, RR 22, SpO2 97%. The abdomen is rigid with guarding. The patient has a history of heavy alcohol use. What is the most likely diagnosis?`, options: ["Acute pancreatitis with possible peritoneal irritation", "Perforated peptic ulcer with peritonitis", "Abdominal aortic aneurysm rupture", "Acute cholecystitis with biliary obstruction"], correct: 0, difficulty: 3 },
      ]},
    ]
  },
  {
    domain: "ACLS/PALS Protocols", count: 120,
    scenarios: [
      { subtopic: "ACLS Algorithms", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is in witnessed ventricular fibrillation cardiac arrest. You have delivered the first shock at 200J biphasic, followed by 2 minutes of CPR. The rhythm check shows persistent VF. What is the next step per ACLS guidelines?`, options: ["Deliver a second shock at 200-300J biphasic and resume CPR, then administer epinephrine 1 mg IV/IO", "Administer amiodarone 300 mg IV/IO before the second shock", "Continue CPR for 5 minutes before the next rhythm check", "Switch to asynchronous pacing at 80 bpm"], correct: 0, difficulty: 2 },
        { scenario: (p) => `During resuscitation of a ${p.age}-year-old ${p.sex} in cardiac arrest, the rhythm converts from VF to PEA after the third shock. EtCO2 is 18 mmHg. Epinephrine was last given 6 minutes ago. What are the immediate priorities?`, options: ["Continue high-quality CPR, administer epinephrine 1 mg IV/IO, and search for reversible causes (H's and T's)", "Deliver another defibrillation shock as the patient was previously in VF", "Stop CPR to assess for a pulse since the rhythm has changed", "Begin transcutaneous pacing for the PEA rhythm"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Cardiac Arrest Management", stems: [
        { scenario: (p) => `You arrive to find a ${p.age}-year-old ${p.sex} in cardiac arrest with bystander CPR in progress. The AED reports "no shock advised." The patient has a medication list including insulin, metformin, and lisinopril. The blood glucose reads 28 mg/dL. What is a critical reversible cause to address?`, options: ["Hypoglycemia - administer D50W IV while continuing CPR and ACLS", "Hyperkalemia from renal failure secondary to diabetes", "Hypothermia from prolonged down time", "Hydrogen ion (acidosis) from diabetic ketoacidosis"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Post-Resuscitation Care", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} achieves ROSC after 18 minutes of CPR for VF arrest. Current vitals: BP 92/64, HR 108, intubated with EtCO2 44 mmHg, SpO2 100% on 100% FiO2. The patient has no purposeful movements. Which post-ROSC intervention is a priority?`, options: ["Titrate FiO2 down to target SpO2 94-99% and maintain systolic BP >90 with fluids and vasopressors", "Maintain 100% FiO2 to ensure maximum oxygen delivery to the brain", "Immediately induce therapeutic hypothermia to 32°C in the field", "Administer sodium bicarbonate to correct post-arrest acidosis"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Pediatric Resuscitation", stems: [
        { scenario: (p) => `A 6-month-old infant is found apneic and pulseless in a crib. Bystanders did not witness the arrest. After 2 minutes of CPR (15:2 ratio), the monitor shows a fine VF. The infant weighs approximately 7 kg. What is the appropriate first defibrillation dose?`, options: ["2 J/kg (14 joules) using pediatric pads/attenuator", "4 J/kg (28 joules) using pediatric pads/attenuator", "50 joules using adult AED pads", "10 J/kg (70 joules) using adult AED pads"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Neonatal Resuscitation", stems: [
        { scenario: (p) => `A newborn delivered at 38 weeks gestation is limp, cyanotic, and not breathing 30 seconds after delivery. The baby was dried, stimulated, and suctioned. HR by auscultation is 48 bpm. Which intervention is the immediate priority per NRP guidelines?`, options: ["Begin positive pressure ventilation with room air or blended oxygen at 40-60 breaths/min", "Begin chest compressions at a 3:1 ratio with ventilations", "Administer epinephrine 0.01 mg/kg via umbilical venous catheter", "Intubate the trachea before any further interventions"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "ROSC Management", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} achieves ROSC. The patient is intubated. MAP is 58 mmHg despite 500 mL NS bolus. EtCO2 is 48 mmHg. 12-lead ECG shows ST elevation in V1-V4. SpO2 96%. What is the most critical post-ROSC action?`, options: ["Initiate norepinephrine or epinephrine infusion to target MAP ≥65 and activate cath lab for STEMI", "Increase ventilation rate to lower EtCO2 below 35 mmHg", "Administer tenecteplase for fibrinolysis of the STEMI", "Administer amiodarone 150 mg IV to prevent recurrent VF"], correct: 0, difficulty: 5 },
      ]},
    ]
  },
  {
    domain: "Pharmacology", count: 150,
    scenarios: [
      { subtopic: "Drug Calculations", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} weighing ${p.weight} kg requires a dopamine infusion at 10 mcg/kg/min. The available concentration is 400 mg in 250 mL D5W (1600 mcg/mL). Using a microdrip (60 gtt/mL) set, what is the correct drip rate in gtt/min?`, optionsFn: (p) => [`${Math.round(p.weight * 10 / 1600 * 60 * 10) / 10} gtt/min`, `${Math.round(p.weight * 10 / 1600 * 60 * 10 * 2) / 10} gtt/min`, `${Math.round(p.weight * 10 / 1600 * 60 * 10 / 2) / 10} gtt/min`, `${Math.round(p.weight * 10 / 1600 * 10) / 10} gtt/min`], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Cardiac Drugs", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} with a stable monomorphic ventricular tachycardia (HR 156, BP ${p.bp}, alert) has failed to convert with two doses of amiodarone. The rhythm persists. Which medication is the next recommended antiarrhythmic?`, options: ["Procainamide 20 mg/min IV infusion (up to 17 mg/kg total)", "Lidocaine 1-1.5 mg/kg IV push", "Adenosine 6 mg rapid IV push", "Magnesium sulfate 2g IV over 10 minutes"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Sedation and Analgesia", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} (${p.weight} kg) has a displaced femur fracture with a pain score of 10/10. BP ${p.bp}, HR ${p.hr}, RR 20, SpO2 98%. Medical control authorizes fentanyl for pain management. What is the appropriate initial IV dose?`, optionsFn: (p) => [`Fentanyl 1 mcg/kg (${p.weight} mcg) IV slowly over 1-2 minutes`, `Fentanyl 5 mcg/kg (${p.weight * 5} mcg) IV push`, `Morphine 0.1 mg/kg (${p.weight / 10} mg) IV is preferred over fentanyl for fractures`, `Fentanyl 0.5 mcg/kg (${Math.round(p.weight * 0.5)} mcg) IN (intranasal) only`], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "RSI Medications", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} (${p.weight} kg) with suspected elevated ICP requires RSI for airway protection. GCS 6, BP 168/94, HR 58, SpO2 92%. Which induction agent is preferred in this clinical scenario?`, options: ["Ketamine 1-2 mg/kg IV; recent evidence shows it does not increase ICP and provides hemodynamic stability", "Etomidate 0.3 mg/kg IV; it has no effect on ICP but risk of adrenal suppression", "Propofol 2 mg/kg IV; rapid onset but may cause significant hypotension", "Midazolam 0.3 mg/kg IV; slower onset but safer hemodynamic profile"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Vasopressors", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} achieves ROSC after cardiac arrest. Despite 2L of normal saline, the patient remains hypotensive with MAP 52 mmHg. The patient is intubated with SpO2 96%. Which vasopressor is the first-line agent for post-cardiac arrest hypotension?`, options: ["Norepinephrine infusion starting at 0.1-0.5 mcg/kg/min titrated to MAP ≥65 mmHg", "Dopamine infusion at 5-20 mcg/kg/min", "Epinephrine infusion at 0.1-0.5 mcg/kg/min", "Vasopressin 40 units IV bolus"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Antidotes", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is found unresponsive with pinpoint pupils, RR 4, SpO2 74%, and a needle next to the patient. After establishing an airway and providing ventilation, SpO2 improves to 88%. What is the appropriate naloxone dosing strategy?`, options: ["Administer naloxone 0.4 mg IV/IN, titrate to adequate respiratory effort (not full consciousness)", "Administer naloxone 2 mg IV push to fully reverse the opioid effect", "Administer naloxone 0.1 mg IV only, as higher doses risk acute withdrawal", "Withhold naloxone and provide ventilatory support only during transport"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Routes of Administration", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} child (20 kg) in cardiac arrest has had two failed IV attempts. The nearest hospital is 15 minutes away. Which alternative vascular access route and landmark is most appropriate?`, options: ["Intraosseous (IO) access in the proximal tibia, 1-2 cm below the tibial tuberosity on the flat medial surface", "Intraosseous access in the distal femur, 2 cm above the lateral condyle", "External jugular vein cannulation with a 20-gauge catheter", "Umbilical vein catheterization for emergency drug administration"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Toxicology and Poisoning", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} intentionally ingested an unknown quantity of their tricyclic antidepressant (amitriptyline) approximately 1 hour ago. The patient is drowsy, HR 134 with a wide QRS complex (148 ms), BP 88/54. Seizure activity begins. What is the priority antidotal therapy?`, options: ["Sodium bicarbonate 1-2 mEq/kg IV bolus to narrow the QRS and treat cardiotoxicity", "Activated charcoal 1 g/kg via NGT if airway is protected", "Physostigmine 1-2 mg slow IV push to reverse anticholinergic effects", "Lipid emulsion therapy 1.5 mL/kg IV bolus for lipophilic drug toxicity"], correct: 0, difficulty: 4 },
      ]},
    ]
  },
  {
    domain: "Pediatric Emergencies", count: 105,
    scenarios: [
      { subtopic: "Pediatric Assessment Triangle", stems: [
        { scenario: (p) => `You respond to a febrile 18-month-old. On approaching, the child appears limp in the parent's arms, has a weak cry, mottled skin coloring, and is not tracking your movements. Using the Pediatric Assessment Triangle (PAT), which component is most abnormal and what does this overall picture suggest?`, options: ["All three sides (appearance, work of breathing, circulation) are abnormal suggesting cardiopulmonary failure", "Appearance is abnormal with normal work of breathing suggesting a CNS or metabolic problem", "Only circulation is abnormal suggesting compensated shock", "Only appearance is abnormal suggesting a behavioral emergency"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "PALS Algorithms", stems: [
        { scenario: (p) => `A 4-year-old (18 kg) child presents with SVT at 240 bpm, is lethargic but responsive to voice, with BP 74/48 and poor perfusion. Two doses of adenosine (0.1 mg/kg and 0.2 mg/kg) have failed to convert the rhythm. What is the next intervention per PALS guidelines?`, options: ["Synchronized cardioversion at 0.5-1 J/kg (9-18 joules)", "Administer adenosine 0.3 mg/kg (third dose) rapid IV push", "Administer amiodarone 5 mg/kg IV over 20-60 minutes", "Perform vagal maneuvers (ice to face) and repeat adenosine"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Pediatric Airway", stems: [
        { scenario: (p) => `A 3-year-old presents with a sudden onset of choking while eating grapes. The child is now unable to cry, cough, or speak, and is becoming cyanotic. Abdominal thrusts have been unsuccessful after 3 cycles. The child becomes unresponsive. What is the immediate next step?`, options: ["Begin CPR starting with chest compressions; look for the object in the pharynx before each ventilation attempt", "Perform a blind finger sweep to remove the obstruction", "Attempt BVM ventilation to force air past the obstruction", "Perform a needle cricothyrotomy with jet ventilation"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Pediatric Pharmacology", stems: [
        { scenario: (p) => `A 6-year-old (22 kg) child is in pulseless ventricular tachycardia. After the first defibrillation at 2 J/kg and 2 minutes of CPR, the rhythm persists. What is the correct epinephrine dose and route?`, options: ["Epinephrine 0.01 mg/kg (0.22 mg = 2.2 mL of 1:10,000) IV/IO every 3-5 minutes", "Epinephrine 0.1 mg/kg (2.2 mg) IV/IO for cardiac arrest", "Epinephrine 0.01 mg/kg (0.22 mg = 0.22 mL of 1:1,000) IM", "Epinephrine 1 mg IV/IO as a flat dose regardless of weight"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Child Abuse Recognition", stems: [
        { scenario: (p) => `You respond to a 14-month-old who reportedly "rolled off the couch." The infant has bilateral retinal hemorrhages noted on penlight exam, a bulging fontanelle, lethargy, and scattered bruises in various stages of healing on the torso and inner thighs. The caregiver's story has changed between calls. Which finding is most pathognomonic for non-accidental trauma?`, options: ["Bilateral retinal hemorrhages with a bulging fontanelle suggesting abusive head trauma (shaken baby syndrome)", "Bruises in various stages of healing which is common in active toddlers", "The changing story which alone confirms abuse", "Rolling off a couch which is a common mechanism for infant head injuries"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Pediatric Trauma", stems: [
        { scenario: (p) => `An 8-year-old (25 kg) child was struck by a car at approximately 25 mph. The child has abdominal pain and guarding, a HR of 148, capillary refill of 4 seconds, and cool extremities. BP is 84/56 (at the lower limit of normal for age). What volume of isotonic crystalloid should be administered as the initial fluid bolus?`, options: ["20 mL/kg (500 mL) normal saline bolus, reassess after each bolus", "10 mL/kg (250 mL) normal saline bolus to avoid fluid overload", "40 mL/kg (1000 mL) normal saline as rapidly as possible", "Weight-based blood product transfusion before crystalloid"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Pediatric Medical Emergencies", stems: [
        { scenario: (p) => `A 2-year-old presents with a barking cough, inspiratory stridor at rest, and moderate sternal retractions. The child is sitting upright in the parent's lap, is alert but anxious, with SpO2 of 93% on room air. Temperature is 38.5°C. What is the most appropriate prehospital management?`, options: ["Administer nebulized racemic epinephrine 2.25% (0.5 mL in 3 mL NS) and provide humidified oxygen", "Examine the oropharynx with a tongue blade to visualize the airway obstruction", "Administer IM dexamethasone 0.6 mg/kg and allow the child to remain in a position of comfort", "Lay the child supine, suction the airway, and prepare for intubation"], correct: 0, difficulty: 3 },
      ]},
    ]
  },
  {
    domain: "OB Emergencies", count: 90,
    scenarios: [
      { subtopic: "Normal Delivery", stems: [
        { scenario: (p) => `A 28-year-old G3P2 at 39 weeks gestation is crowning in the back of the ambulance. The delivery progresses and the head delivers face-down. After suctioning the mouth then nose, the head does not rotate and the anterior shoulder will not deliver despite gentle downward traction. What is the most appropriate maneuver?`, options: ["Apply suprapubic pressure while maintaining gentle downward traction (McRoberts maneuver with suprapubic pressure) for shoulder dystocia", "Apply fundal pressure to push the baby out more forcefully", "Rotate the baby's head 180 degrees to dislodge the shoulder", "Push the baby's head back in and prepare for emergency cesarean section (Zavanelli maneuver)"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Breech Presentation", stems: [
        { scenario: (p) => `A 32-year-old G1P0 at 37 weeks presents with active labor and imminent delivery. On examination, you see a foot presenting at the introitus. This is a footling breech presentation. The nearest hospital is 20 minutes away. What is the most appropriate prehospital management?`, options: ["Place the mother in Trendelenburg position with hips elevated, high-flow oxygen, and rapid transport; do not pull on the presenting extremity", "Allow the delivery to progress naturally and support the baby as it delivers", "Attempt to push the foot back in and rotate the baby to a vertex presentation", "Have the mother begin pushing immediately to expedite delivery"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Cord Prolapse", stems: [
        { scenario: (p) => `A 25-year-old G2P1 at 36 weeks reports her water broke and she can feel something in her vagina. On examination, you visualize a pulsating loop of umbilical cord presenting ahead of the baby. The fetal heart rate is 80 bpm (normally 120-160). What is the critical immediate intervention?`, options: ["Insert a gloved hand into the vagina to elevate the presenting part off the cord, place mother in knee-chest position, and transport emergently", "Clamp and cut the prolapsed cord and deliver immediately", "Push the cord back into the uterus and have the mother bear down", "Cover the cord with a moist sterile dressing and transport in supine position"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Eclampsia", stems: [
        { scenario: (p) => `A 30-year-old G1P0 at 34 weeks gestation presents with a witnessed tonic-clonic seizure lasting 2 minutes. BP is 192/118, HR 112, RR 22, SpO2 91%. The patient is postictal with facial edema and 3+ pedal edema. What is the priority medication for this patient?`, options: ["Magnesium sulfate 4-6g IV over 15-20 minutes as a loading dose to prevent further seizures", "Diazepam 5-10 mg IV to terminate and prevent seizures", "Labetalol 20 mg IV to rapidly lower blood pressure", "Phenytoin 15 mg/kg IV loading dose for seizure prophylaxis"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Postpartum Hemorrhage", stems: [
        { scenario: (p) => `A 26-year-old just delivered her baby in the field 10 minutes ago. The placenta delivered but there is ongoing heavy vaginal bleeding estimated at 800 mL. The uterus feels boggy and soft on palpation above the umbilicus. BP 94/58, HR 128, skin is pale and diaphoretic. What is the most critical intervention?`, options: ["Perform uterine massage by firmly massaging the uterine fundus while establishing IV access and fluid resuscitation", "Pack the vagina with sterile gauze to tamponade the bleeding", "Administer oxytocin 10 units IM and elevate the mother's legs", "Apply direct pressure to the perineum and prepare for transport"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Neonatal Care", stems: [
        { scenario: (p) => `A term newborn is delivered and after initial drying and stimulation at 1 minute of life, the baby has a HR of 110, active crying, pink centrally with acrocyanosis, and active movement with good tone. The baby is flexing all extremities and responding to stimulation with a vigorous cry. What is the 1-minute APGAR score?`, options: ["8 (deducting 1 point each for acrocyanosis and one other subtle finding)", "10 - perfect score", "7 - moderate depression requiring intervention", "9 - one point deducted for acrocyanosis only"], correct: 3, difficulty: 2 },
      ]},
    ]
  },
  {
    domain: "Operations/EMS Systems", count: 120,
    scenarios: [
      { subtopic: "Scene Safety", stems: [
        { scenario: (p) => `You respond to a report of an unresponsive person in a parking garage. On arrival, you notice two other bystanders are also lying on the ground near a running vehicle in an enclosed area. There is a strong exhaust smell. What is your immediate priority?`, options: ["Do not enter the scene; request fire department/hazmat for possible carbon monoxide exposure and move to a safe location upwind", "Enter the scene quickly holding your breath to assess the patients", "Put on an N95 mask and enter to triage the patients", "Wait for police to secure the scene before entering"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "MCI and Triage", stems: [
        { scenario: (p) => `You are the first ambulance on scene at a building collapse with approximately 20 victims. Using START triage, you encounter an adult who is not breathing. After opening the airway with a head-tilt chin-lift, the patient begins to breathe at 8 breaths/min. What triage category should this patient receive?`, options: ["Red (Immediate) - the patient required airway intervention and has respiratory compromise", "Black (Expectant/Dead) - the patient was initially apneic", "Yellow (Delayed) - the patient is now breathing spontaneously", "Green (Minor) - the patient is breathing after simple intervention"], correct: 0, difficulty: 3 },
        { scenario: (p) => `At a mass casualty incident involving a bus rollover, you are performing JumpSTART triage on pediatric patients. You find a 5-year-old who is not breathing. After opening the airway, the child remains apneic. You check for a pulse and find a palpable radial pulse. Per JumpSTART, what is the next step?`, options: ["Give 5 rescue breaths; if the child resumes breathing, tag RED; if not, tag BLACK", "Tag the child BLACK (expectant) and move to the next patient", "Begin full CPR for 2 minutes and then reassess", "Tag the child RED (immediate) and move to the next patient"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Vehicle Extrication", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} driver is trapped in a vehicle after a head-on collision. The patient is conscious, complaining of chest pain and difficulty breathing. The dash is compressing the patient's legs. Fire department is performing extrication. As the paramedic, what is your primary role during extrication?`, options: ["Maintain patient contact, provide cervical stabilization, manage the airway, and direct medical interventions throughout the extrication", "Operate the hydraulic rescue tools to free the patient", "Step back and allow fire department to complete extrication before approaching", "Focus solely on preparing the stretcher and equipment for after extrication"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Hazmat Awareness", stems: [
        { scenario: (p) => `You respond to an industrial facility where workers report a chemical spill. You arrive and notice a placard on a container showing a red diamond with the number 3. Multiple workers have respiratory complaints. What does this placard indicate and what is your action?`, options: ["Flammable liquid; establish a safe perimeter upwind, identify the substance, do not enter the hot zone without proper PPE", "Oxidizer; approach from downwind to assess victims", "Poison gas; don SCBA and enter immediately to rescue victims", "Corrosive material; decontaminate victims where they stand"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Air Medical Transport", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} has sustained polytrauma from a motorcycle accident on a rural highway. The patient has a GCS of 8, BP 72/40, HR 138, and bilateral femur fractures. The nearest Level I trauma center is 55 minutes by ground and 18 minutes by helicopter. A landing zone can be established in 5 minutes. Based on these factors, what is the most appropriate transport decision?`, options: ["Request helicopter transport to the Level I trauma center given the critical injuries, hemodynamic instability, and significant time savings", "Transport by ground to the nearest community hospital for stabilization first", "Transport by ground to the Level I trauma center to avoid delays in establishing an LZ", "Request helicopter transport to the nearest community hospital"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Handover Communication", stems: [
        { scenario: (p) => `You are delivering a ${p.age}-year-old ${p.sex} STEMI patient to the cardiac catheterization lab. Which handover communication format provides the most complete and structured patient transfer of care?`, options: ["SBAR format: Situation (STEMI with ongoing chest pain), Background (medical history, medications), Assessment (vital signs, ECG findings, interventions given), Recommendation (need for immediate PCI)", "Quick verbal report: 'Chest pain patient, STEMI on 12-lead, gave aspirin and nitro'", "Hand the nurse the written patient care report and leave", "Provide a detailed narrative starting from the 911 call in chronological order"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Documentation Standards", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} patient refuses transport against medical advice (AMA) after a syncopal episode. BP ${p.bp}, HR ${p.hr}, blood glucose 92. The patient is alert, oriented, and has decision-making capacity. What elements must be documented in the patient care report?`, options: ["Mental status assessment confirming capacity, risks explained to patient (including death), patient verbalization of understanding, signature on AMA form, recommendation to call back if symptoms recur, assessment findings", "Simply document 'patient refused transport' with the patient's signature", "Document vital signs and have a witness sign the refusal form", "Only document the chief complaint and the refusal; detailed documentation is not needed for AMA"], correct: 0, difficulty: 2 },
      ]},
      { subtopic: "Crew Resource Management", stems: [
        { scenario: (p) => `During a high-acuity pediatric resuscitation, your partner is about to administer 10x the correct epinephrine dose. You have identified the error. Using CRM principles, what is the most appropriate communication technique?`, options: ["Use assertive communication: clearly state 'Stop - I believe the dose is incorrect. The correct dose is...' and verify with the team", "Quietly correct the dose yourself without confronting your partner", "Allow the dose to be given and discuss the error during the debriefing", "Report the near-miss to your supervisor after the call without intervening"], correct: 0, difficulty: 2 },
      ]},
    ]
  },
  {
    domain: "Environmental Emergencies", count: 60,
    scenarios: [
      { subtopic: "Hypothermia", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is found outdoors in winter conditions. The patient is responsive but confused, with slurred speech, shivering has ceased. Core temperature reads 30°C (86°F). HR 42 and irregular, BP 82/50. What is a critical treatment consideration?`, options: ["Handle the patient gently, apply passive and active rewarming, withhold medications and limit shocks until core temp >30°C", "Aggressively warm the patient with hot water bottles applied directly to the skin", "Administer atropine 1 mg IV for the bradycardia", "Immediately cardiovert the irregular rhythm"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Heat Stroke", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} collapsed during a marathon on a hot day (35°C/95°F). The patient is unresponsive, skin is hot and dry, core temperature is 41.2°C (106.2°F). HR 148, BP 88/52, GCS 7. What is the most critical immediate intervention?`, options: ["Initiate aggressive whole-body cooling with ice packs to groin, axillae, and neck, with cold water dousing and rapid transport", "Administer antipyretics (acetaminophen or ibuprofen) for fever reduction", "Establish IV access and administer a 2L cold saline bolus as the primary cooling method", "Move the patient to shade and apply lukewarm water for gradual cooling"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Drowning", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} is pulled from a lake after submersion for approximately 4 minutes. The patient is unresponsive, apneic, with a weak pulse at 50 bpm. SpO2 is unreadable. What is the priority intervention in drowning resuscitation that differs from standard cardiac arrest protocols?`, options: ["Prioritize early ventilations/oxygenation as drowning is primarily a respiratory emergency; provide 5 initial rescue breaths before compressions", "Begin standard CPR with 30:2 ratio exactly as in cardiac arrest", "Perform abdominal thrusts to expel water from the lungs before ventilation", "Focus on defibrillation as VF is the most common arrest rhythm in drowning"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "High Altitude Illness", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} hiking at 3,800 meters (12,500 feet) develops severe headache, ataxia, confusion, and vomiting over the past 6 hours. SpO2 is 78% on room air. What is the most critical prehospital intervention?`, options: ["Immediate descent to a lower altitude, supplemental oxygen, and dexamethasone 8 mg IM if available", "Rest at the current altitude with fluids and acetaminophen for headache", "Continue ascending slowly to acclimatize", "Administer acetazolamide 250 mg PO and reassess in 4 hours"], correct: 0, difficulty: 3 },
      ]},
      { subtopic: "Lightning Injuries", stems: [
        { scenario: (p) => `Multiple people are struck by lightning at an outdoor event. You arrive to find 5 patients. One patient is in cardiac arrest (pulseless, apneic), two are unconscious but breathing, and two are walking with minor burns. In a lightning MCI, which triage approach differs from standard triage?`, options: ["Prioritize the cardiac arrest patient first (reverse triage) as lightning arrest victims have a higher survival rate with early CPR than typical traumatic arrests", "Triage normally using START: the cardiac arrest patient is tagged BLACK (expectant)", "Treat the walking wounded first as they are most likely to survive", "All patients require immediate hospital transport regardless of condition"], correct: 0, difficulty: 4 },
      ]},
      { subtopic: "Envenomation", stems: [
        { scenario: (p) => `A ${p.age}-year-old ${p.sex} was bitten on the right hand by a rattlesnake 30 minutes ago. The hand is swollen to the wrist with ecchymosis, and the patient reports severe pain and tingling. BP ${p.bp}, HR ${p.hr}, no signs of systemic toxicity. What is the most appropriate prehospital management?`, options: ["Remove jewelry from the affected extremity, immobilize the limb at or below heart level, mark the edge of swelling with a pen and time, and transport for antivenom", "Apply a constricting band proximal to the bite to slow venom spread", "Apply ice directly to the bite site to reduce swelling and slow absorption", "Incise the fang marks and attempt to suction out the venom"], correct: 0, difficulty: 2 },
      ]},
    ]
  },
];

function generatePatient(difficulty) {
  const ages = difficulty <= 2 ? [35, 42, 55, 48, 62] : difficulty === 3 ? [28, 45, 67, 73, 51, 38] : [22, 78, 84, 16, 91, 44];
  const age = ages[Math.floor(Math.random() * ages.length)];
  const sex = Math.random() < 0.5 ? 'male' : 'female';
  const weights = { male: [70, 75, 80, 85, 90], female: [55, 60, 65, 70, 75] };
  const weight = weights[sex][Math.floor(Math.random() * 5)];
  const sbps = [112, 118, 124, 132, 138, 146, 156, 168];
  const dbps = [68, 72, 76, 80, 84, 88, 92];
  const hrs = [72, 78, 84, 88, 92, 96, 102, 108, 114];
  return {
    age, sex, weight,
    bp: `${sbps[Math.floor(Math.random() * sbps.length)]}/${dbps[Math.floor(Math.random() * dbps.length)]}`,
    hr: hrs[Math.floor(Math.random() * hrs.length)]
  };
}

function generateRationale(domain, subtopic, stem, options, correctIdx, difficulty) {
  const correct = options[correctIdx];
  const wrong = options.filter((_, i) => i !== correctIdx);
  const lessonSlug = slugify(domain);
  const subSlug = slugify(subtopic);

  return `## Correct Answer Analysis

The correct answer is "${correct}". This is the most appropriate response in this clinical scenario because it aligns with current evidence-based prehospital practice guidelines and addresses the primary clinical concern presented in the vignette.

In the prehospital setting, paramedics must rapidly assess and prioritize interventions based on the patient's presentation. This scenario specifically tests the candidate's knowledge of ${subtopic} within the broader domain of ${domain}. The correct intervention takes into account the patient's vital signs, assessment findings, and the urgency of the clinical situation.

The pathophysiological basis for this answer involves understanding how ${subtopic.toLowerCase()} affects patient outcomes in the emergency setting. When a patient presents with the findings described in this scenario, the correct action follows established protocols from the American Heart Association (AHA), National Association of EMS Physicians (NAEMSP), and International Trauma Life Support (ITLS) guidelines.

Key physiological principles supporting this answer include the understanding of oxygen delivery, perfusion pressure, and cellular metabolism in the context of the presenting emergency. The correct intervention optimizes patient outcomes by addressing the most immediate life threat while following the systematic approach taught in paramedic education programs.

## Why Each Incorrect Answer Is Wrong

**"${wrong[0]}"** - This option is incorrect because it does not address the primary clinical priority in this scenario. While this intervention may have a role in the overall management of the patient, it is not the most appropriate first action given the clinical presentation. In the prehospital setting, prioritization of interventions follows the ABCDE (Airway, Breathing, Circulation, Disability, Exposure) approach, and this option either addresses a lower priority or represents an inappropriate intervention for the specific clinical findings presented. Selecting this answer demonstrates a misunderstanding of the clinical priority hierarchy.

**"${wrong[1]}"** - This option is plausible but incorrect for this specific clinical scenario. This answer might be appropriate in a different clinical context or at a different point in the patient's care, but given the specific presentation described in the vignette, it does not represent the best course of action. Common reasons candidates select this distractor include confusing similar presentations, misapplying protocols from a different clinical context, or failing to recognize the specific severity markers in the patient's vital signs and assessment findings.

**"${wrong[2]}"** - This option represents a common misconception or outdated practice that candidates may select based on incomplete knowledge. While there may be clinical situations where this intervention is appropriate, the specific patient presentation in this scenario makes this choice incorrect. This distractor tests whether the candidate can differentiate between similar interventions and apply the most current evidence-based guidelines to the specific clinical scenario presented.

## Clinical Pearl

Understanding ${subtopic.toLowerCase()} is essential for paramedic practice. Key clinical pearls for this topic include: (1) Always follow a systematic assessment approach before initiating treatment. (2) Monitor trending vital signs rather than relying on a single measurement. (3) Consider the mechanism of injury or nature of illness when forming differential diagnoses. (4) Reassess after every intervention to evaluate effectiveness. (5) Documentation of assessment findings, interventions, and patient response is critical for continuity of care.

## How Exam Writers Try to Trick You

This question is designed to test whether you can identify the highest-priority intervention from a list of plausible options. Exam writers commonly include distractors that are: (1) Correct interventions but not the FIRST or MOST APPROPRIATE action. (2) Actions that apply to a similar but different clinical scenario. (3) Outdated practices that were previously taught but have been superseded by current evidence. (4) Interventions that skip critical steps in the assessment process. The key to answering these questions correctly is to read the clinical scenario carefully, identify all the relevant findings, and select the answer that addresses the most immediate need.

## Intervention Considerations and Priority Hierarchy

In managing this scenario, the priority hierarchy follows: (1) Ensure scene safety and use appropriate PPE. (2) Perform a rapid primary assessment using the ABCDE approach. (3) Address immediate life threats in order of priority. (4) Initiate the most critical intervention first. (5) Reassess and continue care. (6) Make appropriate transport decisions including destination selection. (7) Provide ongoing assessment and management during transport. (8) Deliver a structured handover to the receiving facility.

## Scenario Variations

If this patient had presented with different vital signs or additional findings, the correct answer might change. For example, if the patient were hemodynamically unstable with signs of shock, the priority might shift to aggressive fluid resuscitation and rapid transport. If the patient had additional injuries or comorbidities, the treatment approach would need to be modified accordingly. Understanding how changing variables affect clinical decision-making is essential for both exam success and clinical practice.

Learn more: /paramedic/lessons/${lessonSlug}/${subSlug}`;
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function generateFlashcards(q) {
  const cards = [];
  cards.push({ cardType: 'definition', front: q.learning_objective, back: q.options[q.correct_answer], rationale: (q.rationale_long || '').substring(0, 500) });
  if (q.clinical_pearls) {
    try {
      const pearls = typeof q.clinical_pearls === 'string' ? JSON.parse(q.clinical_pearls) : q.clinical_pearls;
      if (Array.isArray(pearls) && pearls.length > 0) {
        cards.push({ cardType: 'clinical_decision', front: `Clinical decision: ${q.subtopic} - What is the key clinical pearl?`, back: pearls[0], rationale: pearls.slice(1).join(' | ') });
      }
    } catch(e) {}
  }
  if (q.safety_note) {
    cards.push({ cardType: 'red_flag', front: `Red Flag: ${q.subtopic} - What safety concern must you remember?`, back: q.safety_note, rationale: `From: ${q.blueprint_category}` });
  }
  return cards;
}

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  const existingCount = await pool.query("SELECT COUNT(*) as total FROM allied_questions WHERE career_type='paramedic' AND status='approved'");
  console.log(`Existing approved paramedic questions: ${existingCount.rows[0].total}`);

  const existingStems = await pool.query("SELECT stem FROM allied_questions WHERE career_type='paramedic'");
  const existingHashes = new Set(existingStems.rows.map(r => crypto.createHash('md5').update(r.stem.toLowerCase().trim()).digest('hex')));

  let inserted = 0;
  let flashcardsCreated = 0;
  let duplicatesSkipped = 0;
  const domainInserted = {};
  const difficultyInserted = {};

  for (const domainConfig of DOMAINS) {
    const { domain, count, scenarios } = domainConfig;
    let domainInsertCount = 0;

    for (const subtopicConfig of scenarios) {
      const { subtopic, stems } = subtopicConfig;
      const questionsPerStem = Math.ceil(count / scenarios.length / stems.length);

      for (const stemConfig of stems) {
        const variations = Math.max(1, Math.min(questionsPerStem, Math.ceil((count - domainInsertCount) / (scenarios.length * stems.length))));

        for (let v = 0; v < Math.max(1, Math.ceil(variations / 1)); v++) {
          const difficulty = stemConfig.difficulty || (Math.random() < 0.35 ? (Math.random() < 0.3 ? 1 : 2) : Math.random() < 0.69 ? 3 : (Math.random() < 0.6 ? 4 : 5));
          const patient = generatePatient(difficulty);
          const stem = stemConfig.scenario(patient);
          const options = stemConfig.optionsFn ? [...stemConfig.optionsFn(patient)] : [...stemConfig.options];
          const correctIdx = stemConfig.correct;

          const stemHash = crypto.createHash('md5').update(stem.toLowerCase().trim()).digest('hex');
          if (existingHashes.has(stemHash)) {
            duplicatesSkipped++;
            continue;
          }

          const indices = [0, 1, 2, 3];
          for (let i = 3; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          const shuffledOptions = indices.map(i => options[i]);
          const newCorrectIdx = shuffledOptions.indexOf(options[correctIdx]);

          const cogLevel = difficulty <= 2 ? 'recall' : difficulty === 3 ? 'application' : 'analysis';
          const rationale = generateRationale(domain, subtopic, stem, shuffledOptions, newCorrectIdx, difficulty);

          const clinicalPearls = [
            `Always perform a systematic assessment before initiating ${subtopic.toLowerCase()} interventions`,
            `Monitor for changes in patient condition that may require modification of the treatment plan`,
            `Document all findings, interventions, and patient responses for continuity of care`
          ];

          const safetyNote = `Ensure scene safety and proper PPE before managing ${subtopic.toLowerCase()} scenarios. Follow local protocols and medical direction for all interventions.`;

          const distractorRationales = shuffledOptions.map((opt, i) =>
            i === newCorrectIdx
              ? `Correct: ${opt} is the best answer because it addresses the primary clinical priority`
              : `Incorrect: ${opt} does not address the immediate clinical need in this scenario`
          );

          const examTrap = `This question tests whether you can identify the highest priority intervention from plausible options in a ${subtopic.toLowerCase()} scenario`;

          try {
            const result = await pool.query(`
              INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long,
                learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type,
                exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
              ['paramedic', BATCH_ID, stem, JSON.stringify(shuffledOptions), newCorrectIdx, rationale,
               `Understand the appropriate assessment and management of ${subtopic.toLowerCase()} in the prehospital setting`,
               domain, subtopic, difficulty, cogLevel, 'multiple-choice', examTrap,
               JSON.stringify(clinicalPearls), safetyNote, JSON.stringify(distractorRationales), false, 'approved']);

            const qId = result.rows[0].id;
            existingHashes.add(stemHash);
            inserted++;
            domainInsertCount++;
            domainInserted[domain] = (domainInserted[domain] || 0) + 1;
            difficultyInserted[difficulty] = (difficultyInserted[difficulty] || 0) + 1;

            const q = {
              learning_objective: `Understand the appropriate assessment and management of ${subtopic.toLowerCase()} in the prehospital setting`,
              options: shuffledOptions, correct_answer: newCorrectIdx, rationale_long: rationale,
              clinical_pearls: JSON.stringify(clinicalPearls), safety_note: safetyNote,
              blueprint_category: domain, subtopic
            };

            const cards = generateFlashcards(q);
            for (const c of cards) {
              await pool.query(`INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, blueprint_category, subtopic)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                ['paramedic', qId, c.cardType, c.front, c.back, c.rationale, domain, subtopic]);
              flashcardsCreated++;
            }

            if (inserted % 50 === 0) {
              console.log(`Progress: ${inserted} questions, ${flashcardsCreated} flashcards inserted`);
            }
          } catch (err) {
            console.error(`Insert error: ${err.message}`);
          }
        }
      }
    }
  }

  console.log('\n========== INITIAL TEMPLATE QUESTIONS INSERTED ==========');
  console.log(`Questions inserted: ${inserted}`);
  console.log(`Flashcards created: ${flashcardsCreated}`);
  console.log(`Duplicates skipped: ${duplicatesSkipped}`);
  console.log('\nDomain distribution:');
  Object.entries(domainInserted).sort((a,b) => b[1] - a[1]).forEach(([d,c]) => console.log(`  ${d}: ${c}`));
  console.log('\nDifficulty distribution:');
  Object.entries(difficultyInserted).sort((a,b) => Number(a[0]) - Number(b[0])).forEach(([d,c]) => console.log(`  Level ${d}: ${c}`));

  await pool.end();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
