import { ExamQuestion } from "./types";

export const BLS_BANK: ExamQuestion[] = [
  {
    q: "During high-quality CPR on an adult, what is the recommended compression depth?",
    o: ["At least 1 inch", "At least 2 inches but no more than 2.4 inches", "At least 3 inches", "1.5 inches"],
    a: 1,
    r: "AHA guidelines recommend adult chest compressions of at least 2 inches (5 cm) but no more than 2.4 inches (6 cm) to ensure adequate cardiac output without causing injury.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "What is the recommended compression rate for adult CPR?",
    o: ["80-100 compressions per minute", "100-120 compressions per minute", "120-140 compressions per minute", "60-80 compressions per minute"],
    a: 1,
    r: "The AHA recommends a compression rate of 100-120 per minute for adult CPR. Rates below 100 are insufficient and rates above 120 reduce compression quality and depth.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "After applying an AED and delivering a shock, what is the next immediate action?",
    o: ["Check for a pulse", "Resume CPR starting with compressions", "Deliver another shock", "Provide 2 rescue breaths"],
    a: 1,
    r: "After an AED delivers a shock, CPR should be resumed immediately starting with chest compressions. Pulse checks delay compressions and most patients do not have a perfusing rhythm immediately after defibrillation.",
    s: "BLS - AED"
  },
  {
    q: "For a single rescuer performing CPR on an adult, what is the compression-to-ventilation ratio?",
    o: ["15:2", "30:2", "15:1", "30:1"],
    a: 1,
    r: "The AHA recommends a 30:2 compression-to-ventilation ratio for single-rescuer adult CPR. This ratio maximizes time spent on compressions while providing adequate ventilation.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "An adult is choking and becomes unresponsive. What is the first action?",
    o: ["Perform a finger sweep", "Call 911 and begin CPR starting with compressions", "Attempt to give rescue breaths", "Perform abdominal thrusts on the ground"],
    a: 1,
    r: "When a choking adult becomes unresponsive, activate EMS if not already done and begin CPR starting with chest compressions. Before delivering breaths, look in the mouth for the object. Blind finger sweeps are not recommended.",
    s: "BLS - Choking Management"
  },
  {
    q: "What is the correct hand placement for adult chest compressions?",
    o: ["On the upper half of the sternum", "On the lower half of the sternum", "Over the xiphoid process", "On the left side of the chest over the heart"],
    a: 1,
    r: "The heel of one hand should be placed on the lower half of the sternum (center of the chest, between the nipples). Compression over the xiphoid can cause abdominal injury.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "When using a bag-valve-mask (BVM) with two rescuers, what technique should be used to maintain the mask seal?",
    o: ["One-hand C-clamp technique", "E-C clamp technique with both hands", "Push the mask down firmly with one palm", "Hold the mask with fingertips only"],
    a: 1,
    r: "The E-C clamp technique uses the thumb and index finger to form a C over the mask and the remaining fingers form an E along the jaw to create a tight seal and maintain head-tilt chin-lift.",
    s: "BLS - Bag-Valve-Mask"
  },
  {
    q: "In the adult Chain of Survival for out-of-hospital cardiac arrest, what is the correct sequence?",
    o: [
      "Call 911, CPR, Defibrillation, Advanced care, Post-arrest care, Recovery",
      "CPR, Call 911, Defibrillation, Post-arrest care, Recovery, Advanced care",
      "Defibrillation, CPR, Call 911, Advanced care, Recovery, Post-arrest care",
      "Call 911, Defibrillation, CPR, Recovery, Advanced care, Post-arrest care"
    ],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3, 4, 5],
    r: "The AHA out-of-hospital Chain of Survival is: Recognition and activation of EMS, early CPR, rapid defibrillation, advanced resuscitation by EMS, post-cardiac arrest care, and recovery.",
    s: "BLS - Chain of Survival"
  },
  {
    q: "How often should rescuers switch roles during 2-rescuer CPR?",
    o: ["Every 1 minute", "Every 2 minutes", "Every 5 minutes", "Only when fatigued"],
    a: 1,
    r: "Rescuers should switch compressor roles every 2 minutes (or every 5 cycles of 30:2) to prevent fatigue and maintain high-quality compressions. Switches should take less than 5 seconds.",
    s: "BLS - Team Dynamics"
  },
  {
    q: "What is the recovery position used for?",
    o: ["An unresponsive patient with a pulse and normal breathing", "A patient in cardiac arrest", "A conscious choking patient", "A patient receiving CPR"],
    a: 0,
    r: "The recovery position (lateral recumbent) is used for unresponsive patients who have a pulse and are breathing normally. It helps maintain an open airway and allows fluids to drain from the mouth.",
    s: "BLS - Recovery Position"
  },
  {
    q: "A rescuer is alone and finds an unresponsive adult who is not breathing. The rescuer does not have a phone. What should they do first?",
    o: ["Begin CPR for 2 minutes then go call 911", "Leave immediately to call 911", "Begin CPR and continue until help arrives", "Check for a pulse for 30 seconds"],
    a: 1,
    r: "For an adult cardiac arrest, the priority is activating EMS. If alone without a phone, leave to call 911 and get an AED first, then return to begin CPR. Adults in cardiac arrest most commonly have a shockable rhythm, making defibrillation the priority.",
    s: "BLS - Chain of Survival"
  },
  {
    q: "During BVM ventilation, how much volume should each breath deliver?",
    o: ["As much as possible to fully inflate the lungs", "Just enough to produce visible chest rise", "500 mL exactly measured", "1000 mL per breath"],
    a: 1,
    r: "Each ventilation should deliver just enough volume to produce visible chest rise (approximately 500-600 mL). Excessive ventilation increases intrathoracic pressure, decreases venous return, and increases the risk of gastric inflation.",
    s: "BLS - Bag-Valve-Mask"
  },
  {
    q: "Which of the following are components of high-quality CPR? (Select all that apply)",
    o: ["Allowing full chest recoil between compressions", "Compressing at a rate of 100-120/min", "Minimizing interruptions in compressions", "Ventilating at a rate of 20 breaths per minute"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "High-quality CPR includes full chest recoil, adequate rate (100-120/min), adequate depth, and minimizing interruptions. The ventilation rate during CPR is 1 breath every 6 seconds (10/min), not 20/min.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "What action should a lone rescuer take for an unresponsive child who is not breathing and has no pulse?",
    o: ["Call 911 first, then begin CPR", "Perform 2 minutes of CPR, then call 911", "Begin rescue breathing only", "Apply the AED immediately"],
    a: 1,
    r: "For a lone rescuer finding an unresponsive child, perform 2 minutes (5 cycles) of CPR first, then call 911 and get an AED. Pediatric arrests are more commonly respiratory in origin, so early CPR is prioritized.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "Which of the following are correct actions when using an AED? (Select all that apply)",
    o: ["Ensure no one is touching the patient during analysis", "Place pads on a dry chest surface", "Continue CPR while the AED is charging", "Remove medication patches before pad placement"],
    a: 0,
    t: "sata",
    ca: [0, 1, 3],
    r: "During AED analysis, no one should touch the patient. Pads should be placed on a dry chest. Medication patches should be removed. CPR should NOT continue during AED analysis—it can interfere with rhythm detection.",
    s: "BLS - AED"
  },
  {
    q: "For an infant choking victim who is conscious, what is the appropriate intervention?",
    o: ["Abdominal thrusts (Heimlich maneuver)", "5 back slaps followed by 5 chest thrusts", "Finger sweep of the mouth", "Chest compressions only"],
    a: 1,
    r: "For a conscious choking infant, deliver 5 back slaps (blows) between the scapulae followed by 5 chest thrusts. Abdominal thrusts are not used on infants due to risk of abdominal organ injury.",
    s: "BLS - Choking Management"
  },
  {
    q: "What is the compression-to-ventilation ratio for 2-rescuer infant CPR?",
    o: ["30:2", "15:2", "30:1", "5:1"],
    a: 1,
    r: "For 2-rescuer infant/child CPR, the ratio is 15:2. This provides more frequent ventilations, which is important because pediatric cardiac arrest is more often caused by respiratory failure.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "Which of the following are indications to stop CPR? (Select all that apply)",
    o: ["The patient shows obvious signs of life", "ROSC is achieved", "A more qualified rescuer takes over", "The rescuer has been performing CPR for 10 minutes"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "CPR may be stopped when: the patient regains signs of life, ROSC occurs, a more qualified rescuer takes over, EMS arrives and assumes care, or the rescuer is too exhausted to continue. Duration of CPR alone is not a reason to stop.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "What is the correct compression technique for a single rescuer performing infant CPR?",
    o: ["Two-thumb encircling technique", "Two-finger technique on the lower half of the sternum", "Heel of one hand on the center of the chest", "Full hand with interlocked fingers"],
    a: 1,
    r: "A single rescuer uses the two-finger technique (two fingers placed just below the nipple line on the sternum). The two-thumb encircling technique is preferred for two-rescuer infant CPR.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "Place the following steps of AED use in the correct order.",
    o: ["Power on the AED", "Attach electrode pads to bare chest", "Allow AED to analyze rhythm", "Deliver shock if advised and immediately resume CPR"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The correct AED sequence is: power on, attach pads to bare dry chest, allow analysis (clear the patient), and if shock is advised, deliver shock then immediately resume CPR starting with compressions.",
    s: "BLS - AED"
  },
  {
    q: "What is the recommended depth of chest compressions for an infant?",
    o: ["At least 2 inches", "At least 1.5 inches (4 cm)", "At least 1 inch", "At least 0.5 inches"],
    a: 1,
    r: "For infants, chest compressions should be at least 1.5 inches (4 cm) deep, which is approximately one-third the anterior-posterior diameter of the chest.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "During 2-rescuer CPR with an advanced airway in place, what is the ventilation rate?",
    o: ["1 breath every 2 seconds (30/min)", "1 breath every 6 seconds (10/min)", "1 breath every 3 seconds (20/min)", "2 breaths every 30 compressions"],
    a: 1,
    r: "With an advanced airway in place, ventilations are given at 1 breath every 6 seconds (10 breaths/min) continuously, while compressions are performed continuously without pausing for ventilations.",
    s: "BLS - Bag-Valve-Mask"
  },
  {
    q: "Which of the following describes correct team dynamics during a resuscitation? (Select all that apply)",
    o: ["Using closed-loop communication", "Assigning clear roles to team members", "Having the team leader perform compressions", "Using clear and concise language"],
    a: 0,
    t: "sata",
    ca: [0, 1, 3],
    r: "Effective team dynamics include closed-loop communication, clear role assignments, and concise language. The team leader should direct the resuscitation, not perform compressions, to maintain situational awareness.",
    s: "BLS - Team Dynamics"
  },
  {
    q: "A pregnant woman in the third trimester is in cardiac arrest. What modification should be made during CPR?",
    o: ["Perform compressions with the patient on her right side", "Manually displace the uterus to the left", "Do not perform chest compressions", "Reduce compression depth to 1.5 inches"],
    a: 1,
    r: "Left uterine displacement relieves aortocaval compression by the gravid uterus, improving venous return and compression effectiveness. Compressions should still be performed at standard depth with the patient supine.",
    s: "BLS - High-Quality CPR"
  },
  {
    q: "Place the steps for responding to an unresponsive adult in the correct order.",
    o: ["Check for responsiveness and breathing", "Activate emergency response and get AED", "Begin CPR with 30 compressions", "Open airway and give 2 breaths"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The correct sequence: check responsiveness and scan for breathing, activate EMS and retrieve AED, begin high-quality CPR starting with 30 compressions, then open airway and deliver 2 breaths.",
    s: "BLS - Chain of Survival"
  }
];

export const ACLS_BANK: ExamQuestion[] = [
  {
    q: "A patient is in ventricular fibrillation (VF). After the first defibrillation attempt and 2 minutes of CPR, the rhythm is still VF. What is the next step?",
    o: ["Administer epinephrine 1 mg IV/IO", "Deliver a second shock and resume CPR", "Administer amiodarone 300 mg IV/IO", "Perform synchronized cardioversion"],
    a: 1,
    r: "In the VF/pVT algorithm, after the first shock and 2 minutes of CPR, if the rhythm remains shockable, deliver a second shock and resume CPR. Epinephrine is given after the second shock during the next CPR cycle.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "In the cardiac arrest algorithm, when is the first dose of epinephrine given for a shockable rhythm?",
    o: ["Immediately upon recognition of cardiac arrest", "After the first shock", "After the second shock", "After the third shock"],
    a: 2,
    r: "For shockable rhythms (VF/pVT), epinephrine 1 mg IV/IO is first administered after the second shock during the next CPR cycle. For non-shockable rhythms, epinephrine is given as soon as IV/IO access is established.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "What is the appropriate initial dose of amiodarone during cardiac arrest for refractory VF/pVT?",
    o: ["150 mg IV/IO", "300 mg IV/IO", "450 mg IV/IO", "500 mg IV/IO"],
    a: 1,
    r: "The initial dose of amiodarone for refractory VF/pVT is 300 mg IV/IO bolus. A second dose of 150 mg may be given if VF/pVT persists.",
    s: "ACLS - Pharmacology"
  },
  {
    q: "A patient presents with a regular narrow-complex tachycardia at a rate of 180 bpm. Vagal maneuvers have failed. What is the first-line medication?",
    o: ["Amiodarone 150 mg IV", "Adenosine 6 mg rapid IV push", "Diltiazem 20 mg IV", "Epinephrine 1 mg IV"],
    a: 1,
    r: "For stable regular narrow-complex tachycardia (SVT), adenosine 6 mg rapid IV push followed by a 20 mL NS flush is the first-line treatment after vagal maneuvers fail. A second dose of 12 mg may be given if the first dose is ineffective.",
    s: "ACLS - Tachycardia Algorithm"
  },
  {
    q: "What are the H's and T's that represent reversible causes of cardiac arrest? (Select all that apply)",
    o: ["Hypovolemia, Hypoxia, Hydrogen ion (acidosis)", "Hypo/hyperkalemia, Hypothermia", "Tension pneumothorax, Tamponade, Toxins", "Thrombosis (pulmonary and coronary)"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2, 3],
    r: "All options are correct. The H's include Hypovolemia, Hypoxia, Hydrogen ion, Hypo/hyperkalemia, and Hypothermia. The T's include Tension pneumothorax, Tamponade, Toxins, and Thrombosis (pulmonary and coronary).",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "A patient in PEA arrest has a heart rate of 30 bpm on the monitor with no pulse. What is the appropriate treatment?",
    o: ["Atropine 1 mg IV", "Transcutaneous pacing", "CPR and epinephrine per cardiac arrest algorithm", "Synchronized cardioversion"],
    a: 2,
    r: "PEA is treated with the non-shockable cardiac arrest algorithm: CPR, epinephrine every 3-5 minutes, and identification of reversible causes (H's and T's). Atropine and pacing are NOT indicated for PEA.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "During ACLS, what is the recommended dose and route of epinephrine for cardiac arrest?",
    o: ["0.5 mg IV/IO every 3-5 minutes", "1 mg IV/IO every 3-5 minutes", "1 mg IV/IO every 1-2 minutes", "2 mg IV/IO every 5 minutes"],
    a: 1,
    r: "Epinephrine 1 mg IV/IO is given every 3-5 minutes during cardiac arrest. This dose applies to all cardiac arrest rhythms (VF, pVT, PEA, asystole).",
    s: "ACLS - Pharmacology"
  },
  {
    q: "A patient presents with acute STEMI. Door-to-balloon time should be less than:",
    o: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    a: 2,
    r: "For STEMI patients, PCI (percutaneous coronary intervention) should be performed with a door-to-balloon time of less than 90 minutes. If PCI is not available, fibrinolytic therapy should be given within 30 minutes of arrival.",
    s: "ACLS - STEMI Management"
  },
  {
    q: "A patient has symptomatic bradycardia with a heart rate of 35 bpm and is hypotensive. What is the first-line medication?",
    o: ["Epinephrine 1 mg IV", "Atropine 1 mg IV", "Dopamine 5 mcg/kg/min", "Amiodarone 150 mg IV"],
    a: 1,
    r: "Atropine 1 mg IV is the first-line drug for symptomatic bradycardia. It may be repeated every 3-5 minutes to a maximum of 3 mg. If atropine is ineffective, transcutaneous pacing or dopamine/epinephrine infusions may be used.",
    s: "ACLS - Bradycardia Algorithm"
  },
  {
    q: "What is the Cincinnati Prehospital Stroke Scale used to assess?",
    o: ["Cardiac rhythm abnormalities", "Facial droop, arm drift, and speech abnormalities", "Level of consciousness only", "Blood pressure and heart rate"],
    a: 1,
    r: "The Cincinnati Prehospital Stroke Scale evaluates three findings: facial droop (ask patient to smile), arm drift (extend arms with eyes closed), and abnormal speech (repeat a sentence). Abnormality in any one suggests stroke.",
    s: "ACLS - Stroke Protocols"
  },
  {
    q: "In the acute stroke algorithm, what is the time window for IV alteplase (tPA) administration from symptom onset?",
    o: ["60 minutes", "3 hours", "4.5 hours", "6 hours"],
    a: 2,
    r: "IV alteplase may be administered up to 4.5 hours from symptom onset in eligible patients. The earlier treatment is initiated, the better the outcomes. Door-to-needle time should be within 60 minutes.",
    s: "ACLS - Stroke Protocols"
  },
  {
    q: "A patient with a wide-complex tachycardia at 160 bpm is hemodynamically stable. What is the recommended treatment?",
    o: ["Synchronized cardioversion", "Adenosine 6 mg IV push", "Amiodarone 150 mg IV over 10 minutes", "Defibrillation at 200 J"],
    a: 2,
    r: "For stable wide-complex tachycardia of uncertain origin, amiodarone 150 mg IV over 10 minutes is recommended. Adenosine may be considered if the rhythm is regular and monomorphic. Cardioversion is reserved for unstable patients.",
    s: "ACLS - Tachycardia Algorithm"
  },
  {
    q: "Place the steps of the VF/pVT cardiac arrest algorithm in the correct order.",
    o: ["Deliver first shock", "Resume CPR for 2 minutes, obtain IV/IO access", "Deliver second shock, then give epinephrine during CPR", "Deliver third shock, then give amiodarone during CPR"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The VF/pVT algorithm proceeds: first shock → CPR 2 min with IV/IO access → second shock → CPR with epinephrine 1 mg → third shock → CPR with amiodarone 300 mg. Epinephrine is repeated every 3-5 minutes.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "What is the appropriate energy level for the first biphasic defibrillation attempt in an adult with VF?",
    o: ["50 J", "100 J", "120-200 J (manufacturer-specific)", "360 J"],
    a: 2,
    r: "The initial biphasic defibrillation dose is manufacturer-specific, typically 120-200 J. If the manufacturer dose is unknown, use the maximum available dose. Monophasic defibrillators use 360 J.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "Which of the following are indications for transcutaneous pacing? (Select all that apply)",
    o: ["Symptomatic bradycardia unresponsive to atropine", "Third-degree (complete) heart block with symptoms", "Asystole as a last resort", "Stable sinus bradycardia at 55 bpm"],
    a: 0,
    t: "sata",
    ca: [0, 1],
    r: "Transcutaneous pacing is indicated for symptomatic bradycardia unresponsive to atropine and symptomatic high-degree AV blocks. It is NOT recommended for asystole and is not needed for stable bradycardia.",
    s: "ACLS - Bradycardia Algorithm"
  },
  {
    q: "During post-cardiac arrest care, what is the target temperature for targeted temperature management?",
    o: ["32-34°C", "32-36°C", "36-38°C", "34-37°C"],
    a: 1,
    r: "AHA guidelines recommend targeted temperature management (TTM) at 32-36°C for comatose adult patients with ROSC after cardiac arrest. The temperature should be maintained for at least 24 hours.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "What is the dose of adenosine if the initial 6 mg dose is ineffective for SVT?",
    o: ["6 mg IV push", "12 mg IV push", "18 mg IV push", "24 mg IV push"],
    a: 1,
    r: "If the initial 6 mg dose of adenosine does not convert the SVT, a second dose of 12 mg rapid IV push may be given. A third dose of 12 mg may also be attempted if needed.",
    s: "ACLS - Pharmacology"
  },
  {
    q: "Which of the following are true regarding endotracheal intubation during cardiac arrest? (Select all that apply)",
    o: ["Intubation attempts should not interrupt compressions for more than 10 seconds", "Waveform capnography should be used to confirm placement", "Ventilations should be delivered at 10 breaths per minute once placed", "The tube should be secured and placement verified by auscultation only"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Intubation should minimize compression interruptions (<10 seconds). Waveform capnography is the gold standard for confirming ETT placement. Post-intubation ventilation rate is 10/min. Auscultation alone is insufficient—capnography is required.",
    s: "ACLS - Advanced Airway"
  },
  {
    q: "What is the correct energy for synchronized cardioversion of unstable atrial fibrillation?",
    o: ["50 J", "100 J", "120-200 J biphasic", "360 J"],
    a: 2,
    r: "Unstable atrial fibrillation/flutter is treated with synchronized cardioversion at 120-200 J biphasic. Lower doses (50-100 J) are used for regular narrow-complex tachycardias like SVT and atrial flutter.",
    s: "ACLS - Tachycardia Algorithm"
  },
  {
    q: "In asystole, which of the following interventions should be performed?",
    o: ["Defibrillation", "CPR with epinephrine and treatment of reversible causes", "Synchronized cardioversion", "Amiodarone 300 mg IV bolus"],
    a: 1,
    r: "Asystole is a non-shockable rhythm. Management includes high-quality CPR, epinephrine 1 mg IV/IO every 3-5 minutes, and searching for and treating reversible causes (H's and T's). Defibrillation is not indicated.",
    s: "ACLS - Cardiac Arrest Algorithms"
  },
  {
    q: "Place the STEMI management steps in the correct order.",
    o: ["Obtain 12-lead ECG within 10 minutes of arrival", "Administer aspirin, obtain IV access, labs", "Activate cardiac catheterization lab", "PCI within 90 minutes of first medical contact"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "STEMI management: rapid ECG acquisition → initial therapies (aspirin, IV, labs, morphine/nitro PRN) → cath lab activation → PCI within 90 minutes. If PCI not available, fibrinolytics within 30 minutes.",
    s: "ACLS - STEMI Management"
  },
  {
    q: "A patient with polymorphic VT (torsades de pointes) is hemodynamically unstable. What is the treatment?",
    o: ["Synchronized cardioversion", "Unsynchronized defibrillation", "Amiodarone 150 mg IV", "Magnesium sulfate 2 g IV only"],
    a: 1,
    r: "Unstable polymorphic VT (torsades de pointes) is treated with unsynchronized defibrillation (not synchronized cardioversion). Magnesium sulfate 1-2 g IV is used as adjunctive treatment, particularly for torsades.",
    s: "ACLS - Tachycardia Algorithm"
  },
  {
    q: "What is the maximum total dose of atropine for symptomatic bradycardia?",
    o: ["1 mg", "2 mg", "3 mg", "5 mg"],
    a: 2,
    r: "The maximum total dose of atropine for bradycardia is 3 mg (given as 1 mg every 3-5 minutes). Doses exceeding 3 mg are unlikely to provide additional benefit.",
    s: "ACLS - Pharmacology"
  },
  {
    q: "Which of the following are components of the acute stroke assessment? (Select all that apply)",
    o: ["CT scan without contrast to rule out hemorrhage", "Blood glucose measurement", "Determination of time of symptom onset", "Immediate anticoagulation therapy"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Acute stroke assessment includes non-contrast CT (to rule out hemorrhagic stroke), blood glucose (hypoglycemia can mimic stroke), and establishing symptom onset time (critical for tPA eligibility). Immediate anticoagulation is NOT recommended.",
    s: "ACLS - Stroke Protocols"
  },
  {
    q: "What ETCO2 value during CPR suggests the need to improve compression quality?",
    o: ["Greater than 40 mmHg", "Less than 10 mmHg", "20-30 mmHg", "Greater than 50 mmHg"],
    a: 1,
    r: "An ETCO2 less than 10 mmHg during CPR suggests poor compression quality or inadequate cardiac output. Providers should aim for ETCO2 of at least 10 mmHg, ideally 20 mmHg or higher, as a marker of effective CPR.",
    s: "ACLS - Advanced Airway"
  }
];

export const PALS_BANK: ExamQuestion[] = [
  {
    q: "What are the three components of the Pediatric Assessment Triangle (PAT)?",
    o: ["Appearance, Work of Breathing, Circulation to skin", "Airway, Breathing, Circulation", "Heart rate, Respiratory rate, Blood pressure", "Alertness, Breath sounds, Capillary refill"],
    a: 0,
    r: "The PAT consists of Appearance (muscle tone, interactiveness, consolability, look/gaze, speech/cry), Work of Breathing (abnormal sounds, positioning, retractions, flaring), and Circulation to Skin (pallor, mottling, cyanosis).",
    s: "PALS - Pediatric Assessment Triangle"
  },
  {
    q: "Which finding differentiates respiratory failure from respiratory distress in a child?",
    o: ["Tachypnea", "Use of accessory muscles", "Inadequate oxygenation or ventilation despite increased effort", "Nasal flaring"],
    a: 2,
    r: "Respiratory distress is characterized by increased work of breathing with maintained oxygenation/ventilation. Respiratory failure occurs when compensatory mechanisms fail and oxygenation/ventilation becomes inadequate, often with altered mental status.",
    s: "PALS - Respiratory Distress vs Failure"
  },
  {
    q: "What is the initial fluid bolus for a child in hypovolemic shock?",
    o: ["10 mL/kg isotonic crystalloid", "20 mL/kg isotonic crystalloid", "40 mL/kg isotonic crystalloid", "5 mL/kg isotonic crystalloid"],
    a: 1,
    r: "The initial fluid bolus for pediatric hypovolemic shock is 20 mL/kg of isotonic crystalloid (NS or LR) given rapidly over 5-20 minutes. Reassess after each bolus and repeat up to 60 mL/kg in the first hour if needed.",
    s: "PALS - Pediatric Shock"
  },
  {
    q: "What is the correct dose of epinephrine for pediatric cardiac arrest?",
    o: ["0.1 mg/kg IV/IO", "0.01 mg/kg IV/IO (1:10,000)", "0.1 mg/kg ET (1:1,000)", "1 mg IV/IO regardless of weight"],
    a: 1,
    r: "The IV/IO dose of epinephrine for pediatric cardiac arrest is 0.01 mg/kg (0.1 mL/kg of 1:10,000 concentration). The endotracheal dose is 0.1 mg/kg (0.1 mL/kg of 1:1,000). Maximum single dose is 1 mg.",
    s: "PALS - Weight-Based Dosing"
  },
  {
    q: "The Broselow tape is used to:",
    o: ["Measure blood pressure in children", "Estimate weight and determine medication doses based on length", "Determine the Glasgow Coma Scale score", "Measure head circumference"],
    a: 1,
    r: "The Broselow tape is a length-based resuscitation tool that estimates a child's weight based on length. It provides color-coded zones with pre-calculated medication doses, equipment sizes, and fluid volumes for pediatric resuscitation.",
    s: "PALS - Broselow Tape"
  },
  {
    q: "In pediatric cardiac arrest with a shockable rhythm, what is the initial defibrillation dose?",
    o: ["1 J/kg", "2 J/kg", "4 J/kg", "10 J/kg"],
    a: 1,
    r: "The initial defibrillation dose for pediatric VF/pVT is 2 J/kg. The second dose is 4 J/kg, and subsequent doses are 4 J/kg or higher, not to exceed 10 J/kg or the adult dose.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which of the following are signs of compensated shock in a child? (Select all that apply)",
    o: ["Tachycardia", "Normal blood pressure", "Prolonged capillary refill", "Hypotension"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Compensated shock is characterized by tachycardia, normal blood pressure (maintained by compensatory mechanisms), and signs of poor perfusion such as prolonged capillary refill, cool extremities, and diminished pulses. Hypotension indicates decompensated shock.",
    s: "PALS - Pediatric Shock"
  },
  {
    q: "What is the formula for estimating weight in kilograms for a child aged 1-10 years?",
    o: ["Age × 3", "Age + 4) × 2", "(Age × 2) + 8", "(Age × 3) + 10"],
    a: 2,
    r: "The formula (Age in years × 2) + 8 = estimated weight in kg is commonly used for children aged 1-10 years. For example, a 5-year-old: (5 × 2) + 8 = 18 kg.",
    s: "PALS - Weight-Based Dosing"
  },
  {
    q: "A 4-year-old child has a heart rate of 50 bpm with poor perfusion. What is the initial intervention?",
    o: ["Atropine 0.02 mg/kg IV", "Transcutaneous pacing", "Epinephrine 0.01 mg/kg IV", "Oxygen and ventilation support"],
    a: 3,
    r: "In pediatric bradycardia, the most common cause is hypoxia. Initial management is to support airway, breathing, and oxygenation. If bradycardia persists despite adequate ventilation and oxygenation, then epinephrine or atropine may be considered.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which of the following is the most common cause of cardiac arrest in children?",
    o: ["Ventricular fibrillation", "Primary cardiac disease", "Respiratory failure", "Trauma"],
    a: 2,
    r: "Unlike adults where cardiac arrest is commonly caused by cardiac arrhythmias, pediatric cardiac arrest most often results from progressive respiratory failure or shock. This is why early recognition and intervention for respiratory distress is critical.",
    s: "PALS - Respiratory Distress vs Failure"
  },
  {
    q: "What is the appropriate size of endotracheal tube for a 6-year-old child using an uncuffed tube?",
    o: ["4.0 mm", "4.5 mm", "5.0 mm", "5.5 mm"],
    a: 2,
    r: "For uncuffed ETT: size = (age/4) + 4. For a 6-year-old: (6/4) + 4 = 5.5, rounded to 5.0 mm. For cuffed tubes: size = (age/4) + 3.5. Always have a half-size smaller and larger available.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which type of shock is characterized by warm, flushed skin and bounding pulses?",
    o: ["Hypovolemic shock", "Cardiogenic shock", "Distributive (warm) shock", "Obstructive shock"],
    a: 2,
    r: "Early distributive (warm/hyperdynamic) shock, often caused by sepsis or anaphylaxis, presents with warm flushed skin, bounding pulses, and widened pulse pressure due to vasodilation. Cold shock presents with cool mottled skin and weak pulses.",
    s: "PALS - Pediatric Shock"
  },
  {
    q: "Place the pediatric systematic approach in the correct order.",
    o: ["General impression using PAT", "Primary assessment (ABCDE)", "Secondary assessment (focused history and exam)", "Tertiary assessment (diagnostic studies)"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The PALS systematic approach begins with a rapid general impression using the PAT, followed by a hands-on primary assessment (ABCDE), then secondary assessment with focused history (SAMPLE) and physical exam, and finally diagnostic studies.",
    s: "PALS - Pediatric Assessment Triangle"
  },
  {
    q: "What is the dose of amiodarone for pediatric VF/pVT cardiac arrest?",
    o: ["1 mg/kg IV/IO", "5 mg/kg IV/IO", "150 mg IV/IO", "300 mg IV/IO"],
    a: 1,
    r: "The pediatric dose of amiodarone for VF/pVT is 5 mg/kg IV/IO bolus (max 300 mg). It can be repeated up to 2 more times for refractory VF/pVT.",
    s: "PALS - Weight-Based Dosing"
  },
  {
    q: "Which of the following are signs of upper airway obstruction in a child? (Select all that apply)",
    o: ["Inspiratory stridor", "Hoarse voice or cry", "Barking cough", "Expiratory wheezing"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Upper airway obstruction presents with inspiratory stridor, hoarse voice/cry, and barking cough. Expiratory wheezing is characteristic of lower airway obstruction (e.g., asthma, bronchiolitis).",
    s: "PALS - Respiratory Distress vs Failure"
  },
  {
    q: "What normal heart rate range would you expect for a 2-year-old child?",
    o: ["60-100 bpm", "80-130 bpm", "100-160 bpm", "120-180 bpm"],
    a: 1,
    r: "Normal heart rate for a toddler (1-3 years) is approximately 80-130 bpm. Tachycardia above the upper normal range may indicate fever, pain, anxiety, hypovolemia, or other pathology.",
    s: "PALS - Pediatric Assessment Triangle"
  },
  {
    q: "In pediatric septic shock, if the child remains hypotensive after 60 mL/kg of fluid resuscitation, what is the next step?",
    o: ["Continue fluid boluses", "Begin vasoactive infusion (epinephrine or norepinephrine)", "Administer hydrocortisone", "Perform immediate intubation"],
    a: 1,
    r: "After 40-60 mL/kg of fluid resuscitation without improvement, vasoactive medications should be started. Epinephrine is first-line for cold shock; norepinephrine for warm shock. Stress-dose hydrocortisone may be considered for catecholamine-resistant shock.",
    s: "PALS - Pediatric Shock"
  },
  {
    q: "What is the compression-to-ventilation ratio for 2-rescuer pediatric CPR?",
    o: ["30:2", "15:2", "15:1", "30:1"],
    a: 1,
    r: "For 2-rescuer CPR in infants and children, the compression-to-ventilation ratio is 15:2. This provides more frequent ventilations, which is critical since pediatric arrest is often respiratory in origin.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which of the following medications is used for SVT in a pediatric patient that is stable?",
    o: ["Amiodarone", "Adenosine", "Lidocaine", "Procainamide"],
    a: 1,
    r: "Adenosine is the first-line medication for stable SVT in pediatrics. The initial dose is 0.1 mg/kg (max 6 mg) rapid IV push, followed by 0.2 mg/kg (max 12 mg) if the first dose is ineffective.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which of the following are components of the SAMPLE history? (Select all that apply)",
    o: ["Signs and symptoms", "Allergies and Medications", "Past medical history and Last meal", "Events leading to the illness"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2, 3],
    r: "SAMPLE stands for: Signs/Symptoms, Allergies, Medications, Past medical history, Last meal/intake, and Events leading to the current illness. All components are important in the secondary assessment.",
    s: "PALS - Pediatric Assessment Triangle"
  },
  {
    q: "A child in cardiac arrest has an initial rhythm of asystole. What is the appropriate management?",
    o: ["Defibrillation at 2 J/kg", "CPR, epinephrine, search for reversible causes", "Synchronized cardioversion", "Amiodarone 5 mg/kg IV bolus"],
    a: 1,
    r: "Asystole is a non-shockable rhythm in the pediatric cardiac arrest algorithm. Management includes high-quality CPR, epinephrine 0.01 mg/kg every 3-5 minutes, and identifying/treating reversible causes (H's and T's).",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "What is the correct dose of atropine for pediatric bradycardia?",
    o: ["0.01 mg/kg IV/IO", "0.02 mg/kg IV/IO", "0.1 mg/kg IV/IO", "1 mg IV/IO"],
    a: 1,
    r: "The pediatric dose of atropine for symptomatic bradycardia is 0.02 mg/kg IV/IO (minimum dose 0.1 mg, maximum single dose 0.5 mg). It may be repeated once.",
    s: "PALS - Weight-Based Dosing"
  },
  {
    q: "Place the steps of pediatric post-cardiac arrest care in the correct order.",
    o: ["Optimize ventilation and oxygenation", "Treat hypotension with fluids and/or vasopressors", "Obtain 12-lead ECG and targeted temperature management", "Transport to pediatric critical care center"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Post-ROSC care priorities: optimize ventilation/oxygenation (avoid hyperoxia and hyperventilation), treat hypotension, consider TTM and 12-lead ECG, and transport to appropriate pediatric critical care facility.",
    s: "PALS - Pediatric Cardiac Arrest"
  },
  {
    q: "Which of the following best describes obstructive shock in a child?",
    o: ["Decreased cardiac output due to myocardial dysfunction", "Inadequate circulating blood volume", "Physical obstruction of blood flow (e.g., tension pneumothorax, cardiac tamponade)", "Widespread vasodilation causing relative hypovolemia"],
    a: 2,
    r: "Obstructive shock results from physical obstruction to blood flow, such as tension pneumothorax, cardiac tamponade, pulmonary embolism, or ductal-dependent congenital heart lesions. Treatment targets the underlying obstruction.",
    s: "PALS - Pediatric Shock"
  },
  {
    q: "What is the synchronized cardioversion dose for unstable pediatric SVT?",
    o: ["0.5-1 J/kg", "2 J/kg", "4 J/kg", "10 J/kg"],
    a: 0,
    r: "For unstable SVT in children, synchronized cardioversion starts at 0.5-1 J/kg. If ineffective, the dose may be increased to 2 J/kg. Sedation should be provided if time permits and the patient's condition allows.",
    s: "PALS - Pediatric Cardiac Arrest"
  }
];

export const NRP_BANK: ExamQuestion[] = [
  {
    q: "What are the initial steps of neonatal resuscitation?",
    o: ["Intubation, ventilation, chest compressions", "Warm, dry, stimulate, position airway, clear secretions if needed", "Administer epinephrine, obtain IV access", "Begin PPV immediately after delivery"],
    a: 1,
    r: "The initial steps of NRP include providing warmth, drying, gentle stimulation, positioning the airway (sniffing position), and suctioning only if secretions are obstructing the airway. These are completed within 30 seconds.",
    s: "NRP - Initial Steps"
  },
  {
    q: "After the initial steps of neonatal resuscitation, a newborn has a heart rate of 80 bpm and is gasping. What is the next intervention?",
    o: ["Continue stimulation", "Begin positive pressure ventilation (PPV)", "Begin chest compressions", "Administer epinephrine"],
    a: 1,
    r: "If the newborn has a heart rate below 100 bpm or is gasping/apneic after initial steps, PPV should be initiated within 60 seconds of birth (the Golden Minute). PPV is the single most important intervention in neonatal resuscitation.",
    s: "NRP - PPV Technique"
  },
  {
    q: "What does MR SOPA stand for in NRP?",
    o: [
      "Mask adjustment, Reposition airway, Suction, Open mouth, Pressure increase, Alternative airway",
      "Monitor rhythm, Resuscitate, Suction, Oxygenate, Pace, Assess",
      "Medication, Respiratory support, Surfactant, Oxygen, Pulse oximetry, Apgar",
      "Mask seal, Rate check, Suction, Oxygen increase, Position change, Airway clear"
    ],
    a: 0,
    r: "MR SOPA is a corrective action mnemonic for ineffective PPV: Mask adjustment (ensure seal), Reposition airway, Suction mouth then nose, Open mouth, Pressure increase, Alternative airway (ETT or laryngeal mask).",
    s: "NRP - MR SOPA"
  },
  {
    q: "What is the compression-to-ventilation ratio for neonatal resuscitation?",
    o: ["15:2", "30:2", "3:1", "5:1"],
    a: 2,
    r: "The neonatal compression-to-ventilation ratio is 3:1 (3 compressions followed by 1 ventilation), delivering 90 compressions and 30 breaths per minute (120 events per minute total).",
    s: "NRP - Chest Compressions 3:1 Ratio"
  },
  {
    q: "What is the recommended IV/IO dose of epinephrine in neonatal resuscitation?",
    o: ["0.01 mg/kg (0.1 mL/kg of 1:10,000)", "0.01-0.03 mg/kg (0.1-0.3 mL/kg of 1:10,000)", "0.1 mg/kg (1 mL/kg of 1:10,000)", "1 mg regardless of weight"],
    a: 1,
    r: "The recommended IV/IO epinephrine dose for neonates is 0.01-0.03 mg/kg (0.1-0.3 mL/kg of 1:10,000 concentration). The preferred route is umbilical venous catheter (UVC). Endotracheal dose is 0.05-0.1 mg/kg.",
    s: "NRP - Epinephrine Dosing"
  },
  {
    q: "When are chest compressions indicated in neonatal resuscitation?",
    o: ["Immediately after birth if the baby is not crying", "When the heart rate is less than 100 bpm", "When the heart rate remains less than 60 bpm despite 30 seconds of effective PPV", "When the SpO2 is less than 90%"],
    a: 2,
    r: "Chest compressions are initiated when the heart rate remains below 60 bpm despite 30 seconds of effective PPV with supplemental oxygen. The two-thumb encircling technique is preferred.",
    s: "NRP - Chest Compressions 3:1 Ratio"
  },
  {
    q: "What is the preferred vascular access site for medication administration during neonatal resuscitation?",
    o: ["Peripheral IV", "Intraosseous access", "Umbilical venous catheter", "Central venous catheter"],
    a: 2,
    r: "The umbilical venous catheter (UVC) is the preferred route for emergency vascular access during neonatal resuscitation. It can be quickly inserted into the umbilical vein and advanced until blood can be aspirated (typically 2-4 cm).",
    s: "NRP - Umbilical Catheter"
  },
  {
    q: "What initial FiO2 should be used when starting PPV for a term newborn?",
    o: ["100%", "21% (room air)", "40%", "60%"],
    a: 1,
    r: "For term newborns (≥35 weeks), PPV should be initiated with 21% oxygen (room air). For preterm newborns (<35 weeks), start with 21-30%. FiO2 is titrated based on pre-ductal pulse oximetry readings.",
    s: "NRP - PPV Technique"
  },
  {
    q: "Which of the following are indications for intubation during neonatal resuscitation? (Select all that apply)",
    o: ["PPV with mask is ineffective after corrective steps", "Need for chest compressions", "Prolonged PPV is anticipated", "Heart rate is 110 bpm and improving"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Indications for intubation include ineffective bag-mask ventilation, need for chest compressions, prolonged PPV, special circumstances (diaphragmatic hernia, surfactant administration). A heart rate of 110 and improving does not require intubation.",
    s: "NRP - PPV Technique"
  },
  {
    q: "What is the correct technique for neonatal chest compressions?",
    o: ["Two-finger technique on the sternum", "Two-thumb encircling technique on the lower third of the sternum", "Heel of one hand on the center of the chest", "One-finger technique on the xiphoid"],
    a: 1,
    r: "The preferred technique is the two-thumb encircling technique, with thumbs placed on the lower third of the sternum just below the inter-nipple line. Hands encircle the torso to support the back. Compression depth is one-third the AP diameter.",
    s: "NRP - Chest Compressions 3:1 Ratio"
  },
  {
    q: "A laryngeal mask airway (LMA) may be used in neonatal resuscitation for which of the following situations?",
    o: ["Newborns weighing less than 1500 g", "When bag-mask and intubation are unsuccessful", "As the primary airway device for all deliveries", "Only during transport"],
    a: 1,
    r: "A laryngeal mask airway is an alternative when both bag-mask ventilation and endotracheal intubation are unsuccessful or not feasible. It is generally effective for newborns ≥34 weeks gestation or ≥1500 g.",
    s: "NRP - Laryngeal Mask"
  },
  {
    q: "Place the NRP algorithm steps in the correct order.",
    o: ["Initial steps (warm, dry, stimulate, position, suction PRN)", "PPV if HR <100 or apneic", "Chest compressions if HR <60 despite effective PPV", "Epinephrine if HR <60 despite compressions and PPV"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The NRP algorithm follows: initial steps within 30 seconds → PPV if indicated → chest compressions if HR remains <60 after effective PPV → epinephrine if HR remains <60 despite compressions and ventilation.",
    s: "NRP - Initial Steps"
  },
  {
    q: "What are the target pre-ductal SpO2 values at 5 minutes after birth for a term newborn?",
    o: ["60-65%", "70-75%", "80-85%", "95-100%"],
    a: 2,
    r: "Target pre-ductal SpO2 at 5 minutes is 80-85%. Normal transition SpO2 targets: 1 min: 60-65%, 2 min: 65-70%, 3 min: 70-75%, 4 min: 75-80%, 5 min: 80-85%, 10 min: 85-95%.",
    s: "NRP - Post-Resuscitation Care"
  },
  {
    q: "Normal saline bolus for neonatal volume expansion during resuscitation is given at what dose?",
    o: ["5 mL/kg", "10 mL/kg", "20 mL/kg", "40 mL/kg"],
    a: 1,
    r: "Volume expansion during neonatal resuscitation is given as 10 mL/kg of isotonic crystalloid (normal saline) or O-negative blood, infused over 5-10 minutes through the UVC. May be repeated if needed based on clinical response.",
    s: "NRP - Epinephrine Dosing"
  },
  {
    q: "Which of the following statements about suctioning during NRP are correct? (Select all that apply)",
    o: ["Routine suctioning is no longer recommended for all newborns", "Suction the mouth before the nose", "Vigorous suctioning can cause bradycardia", "Meconium-stained amniotic fluid always requires intubation and tracheal suctioning"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Routine suctioning is not recommended. When suctioning is needed, clear the mouth before the nose. Aggressive suctioning can stimulate a vagal response causing bradycardia. Routine intubation for meconium is no longer recommended; suction only if the airway is obstructed.",
    s: "NRP - Initial Steps"
  },
  {
    q: "What ventilation rate should be used during PPV for a newborn?",
    o: ["20-30 breaths per minute", "40-60 breaths per minute", "60-80 breaths per minute", "10-20 breaths per minute"],
    a: 1,
    r: "During PPV, the ventilation rate for neonates is 40-60 breaths per minute. The rhythm should be 'breathe-two-three, breathe-two-three' to achieve this rate.",
    s: "NRP - PPV Technique"
  },
  {
    q: "Delayed cord clamping for vigorous term newborns should ideally be performed for how long?",
    o: ["Immediately after birth", "At least 30-60 seconds", "5 minutes", "10 minutes"],
    a: 1,
    r: "Delayed cord clamping for at least 30-60 seconds is recommended for vigorous term and preterm newborns. Benefits include improved transitional circulation, decreased need for transfusion, and decreased incidence of IVH in preterm infants.",
    s: "NRP - Initial Steps"
  },
  {
    q: "A newborn is receiving PPV but the chest is not rising. After performing MR SOPA corrective steps, the chest still does not rise. What is the next step?",
    o: ["Increase the FiO2 to 100%", "Begin chest compressions", "Consider alternative airway (ETT or LMA)", "Administer epinephrine"],
    a: 2,
    r: "If PPV is ineffective despite MR SOPA corrective actions, an alternative airway (endotracheal tube or laryngeal mask airway) should be placed. Chest compressions should only begin after effective ventilation is established.",
    s: "NRP - MR SOPA"
  },
  {
    q: "Which of the following are components of post-resuscitation care for a newborn? (Select all that apply)",
    o: ["Monitoring glucose levels", "Therapeutic hypothermia consideration for HIE", "Ongoing cardiorespiratory monitoring", "Immediate discharge if heart rate normalizes"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Post-resuscitation care includes glucose monitoring (hypoglycemia risk), considering therapeutic hypothermia for moderate-severe HIE within 6 hours of birth, and continuous cardiorespiratory monitoring. Newborns requiring resuscitation need ongoing observation.",
    s: "NRP - Post-Resuscitation Care"
  },
  {
    q: "What is the recommended endotracheal tube size for a term newborn?",
    o: ["2.5 mm", "3.0 mm", "3.5 mm", "4.0 mm"],
    a: 2,
    r: "ETT size for a term newborn (≥38 weeks, >3 kg) is 3.5 mm. For preterm: <28 weeks = 2.5 mm, 28-34 weeks = 3.0 mm, 34-38 weeks = 3.0-3.5 mm.",
    s: "NRP - PPV Technique"
  },
  {
    q: "What is the endotracheal dose of epinephrine for neonatal resuscitation?",
    o: ["0.01 mg/kg", "0.05-0.1 mg/kg", "0.1-0.3 mg/kg", "1 mg flat dose"],
    a: 1,
    r: "The ET dose of epinephrine is 0.05-0.1 mg/kg (0.5-1 mL/kg of 1:10,000). The ET route is less reliable and the IV/IO route via UVC is preferred. If ET epinephrine is given, a higher dose is used compared to IV.",
    s: "NRP - Epinephrine Dosing"
  },
  {
    q: "Place the MR SOPA corrective steps in the correct order.",
    o: ["Mask adjustment to ensure proper seal", "Reposition the airway (sniffing position)", "Suction the mouth and nose", "Open the mouth and increase Pressure, then consider Alternative airway"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "MR SOPA should be performed sequentially: Mask adjustment → Reposition airway → Suction → Open mouth → increase Pressure → Alternative airway. Each step is attempted before moving to the next.",
    s: "NRP - MR SOPA"
  },
  {
    q: "At what gestational age should plastic wrap or bags be used to prevent heat loss?",
    o: ["All newborns", "Less than 32 weeks gestation", "Less than 28 weeks gestation", "Greater than 37 weeks gestation"],
    a: 1,
    r: "Newborns less than 32 weeks gestation should be placed in a food-grade polyethylene plastic wrap or bag (without drying) immediately after birth to prevent hypothermia. This is combined with a radiant warmer and thermal mattress.",
    s: "NRP - Initial Steps"
  },
  {
    q: "What is the recommended depth for inserting an umbilical venous catheter during emergency access?",
    o: ["1-2 cm past the skin", "2-4 cm until free flow of blood", "5-7 cm to reach the IVC", "10 cm to reach the right atrium"],
    a: 1,
    r: "During emergency UVC placement, the catheter is inserted 2-4 cm past the abdominal wall (in a term infant) until blood flows freely when aspirated. The tip should be in the umbilical vein just below the liver, not advanced into the IVC.",
    s: "NRP - Umbilical Catheter"
  },
  {
    q: "Which of the following describes the correct hand position for the two-thumb encircling technique in neonatal compressions? (Select all that apply)",
    o: ["Thumbs placed side by side on the lower third of the sternum", "Fingers wrapped around the torso supporting the back", "Compress to a depth of approximately one-third the AP diameter", "Thumbs placed on the xiphoid process"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "The two-thumb technique involves thumbs side by side or overlapping on the lower third of the sternum, fingers encircling the torso to support the back, compressing one-third AP diameter. Avoid the xiphoid to prevent liver injury.",
    s: "NRP - Chest Compressions 3:1 Ratio"
  },
  {
    q: "Therapeutic hypothermia for neonatal HIE should be initiated within what time frame?",
    o: ["1 hour of birth", "6 hours of birth", "12 hours of birth", "24 hours of birth"],
    a: 1,
    r: "Therapeutic hypothermia (33.5°C for whole body or 34.5°C for selective head cooling) should be initiated within 6 hours of birth for newborns ≥36 weeks with moderate-severe hypoxic-ischemic encephalopathy. Treatment continues for 72 hours.",
    s: "NRP - Post-Resuscitation Care"
  }
];

export const TNCC_BANK: ExamQuestion[] = [
  {
    q: "What is the correct sequence for the primary trauma survey?",
    o: ["ABCDE: Airway, Breathing, Circulation, Disability, Exposure", "Head-to-toe assessment, vital signs, history", "Focused assessment, vital signs, interventions", "Scene safety, mechanism of injury, triage"],
    a: 0,
    r: "The primary survey follows ABCDE: Airway with cervical spine protection, Breathing and ventilation, Circulation with hemorrhage control, Disability (neurologic status), and Exposure/Environmental control. Life threats are addressed as identified.",
    s: "TNCC - Primary Survey"
  },
  {
    q: "What classification of hemorrhagic shock is characterized by blood loss of 750-1500 mL (15-30%), tachycardia, and normal blood pressure?",
    o: ["Class I", "Class II", "Class III", "Class IV"],
    a: 1,
    r: "Class II hemorrhage involves 15-30% blood volume loss (750-1500 mL). It presents with tachycardia (>100), narrowed pulse pressure, and anxiety, but blood pressure remains normal. Crystalloid resuscitation is typically sufficient.",
    s: "TNCC - Hemorrhage Control"
  },
  {
    q: "In massive transfusion protocols, what is the recommended ratio of packed RBCs to FFP to platelets?",
    o: ["1:1:1", "3:1:1", "2:1:1", "4:2:1"],
    a: 0,
    r: "Current evidence supports a balanced 1:1:1 ratio of packed RBCs to FFP to platelets in massive transfusion. This approach mimics whole blood and helps prevent dilutional coagulopathy and the lethal triad (hypothermia, acidosis, coagulopathy).",
    s: "TNCC - Massive Transfusion"
  },
  {
    q: "Which of the following findings suggests a tension pneumothorax?",
    o: ["Bilateral equal breath sounds", "Tracheal deviation toward the affected side", "Tracheal deviation away from the affected side with absent breath sounds", "Paradoxical chest wall movement"],
    a: 2,
    r: "Tension pneumothorax presents with tracheal deviation AWAY from the affected side, absent breath sounds on the affected side, hypotension, JVD, and tachycardia. Treatment is immediate needle decompression at the 2nd intercostal space, midclavicular line.",
    s: "TNCC - Thoracic Trauma"
  },
  {
    q: "What is the Glasgow Coma Scale score for a patient who opens eyes to pain, makes incomprehensible sounds, and has flexion withdrawal to pain?",
    o: ["GCS 7", "GCS 8", "GCS 9", "GCS 10"],
    a: 1,
    r: "GCS calculation: Eye opening to pain = 2, Incomprehensible sounds = 2, Flexion withdrawal = 4. Total = 2 + 2 + 4 = 8. A GCS of 8 or less generally indicates the need for intubation for airway protection.",
    s: "TNCC - TBI"
  },
  {
    q: "Which of the following are signs of increased intracranial pressure (ICP)? (Select all that apply)",
    o: ["Cushing's triad (hypertension, bradycardia, irregular respirations)", "Unilateral pupil dilation", "Altered level of consciousness", "Tachycardia and hypotension"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Signs of increased ICP include Cushing's triad (hypertension, bradycardia, irregular breathing), unilateral pupil dilation (uncal herniation), and altered consciousness. Tachycardia with hypotension suggests hemorrhagic shock, not elevated ICP.",
    s: "TNCC - TBI"
  },
  {
    q: "A trauma patient has a pelvic fracture with hemodynamic instability. What is the initial management?",
    o: ["Immediate surgical fixation", "Apply a pelvic binder and begin resuscitation", "CT scan of the pelvis", "Foley catheter insertion"],
    a: 1,
    r: "Initial management of an unstable pelvic fracture includes applying a pelvic binder or sheet wrap to reduce pelvic volume and control hemorrhage, along with volume resuscitation and massive transfusion protocol activation as needed.",
    s: "TNCC - Pelvic Trauma"
  },
  {
    q: "The 'lethal triad' in trauma refers to:",
    o: ["Hypertension, tachycardia, tachypnea", "Hypothermia, acidosis, coagulopathy", "Hypoxia, hypercarbia, hypotension", "Brain injury, spinal injury, hemorrhage"],
    a: 1,
    r: "The lethal triad (trauma triad of death) consists of hypothermia, metabolic acidosis, and coagulopathy. These three conditions create a vicious cycle that significantly increases mortality. Damage control resuscitation aims to prevent and correct this triad.",
    s: "TNCC - Hemorrhage Control"
  },
  {
    q: "What is the most reliable indicator of intra-abdominal hemorrhage in an unstable trauma patient?",
    o: ["CT scan of the abdomen", "FAST (Focused Assessment with Sonography for Trauma) exam", "Serial abdominal examinations", "Diagnostic peritoneal lavage"],
    a: 1,
    r: "The FAST exam is the most rapid and reliable bedside assessment for free fluid in an unstable trauma patient. It examines four areas: right upper quadrant (Morrison's pouch), left upper quadrant, suprapubic, and subxiphoid (pericardial).",
    s: "TNCC - Abdominal Trauma"
  },
  {
    q: "What are the 5 P's of compartment syndrome?",
    o: ["Pain, Pallor, Pulselessness, Paresthesia, Paralysis", "Pressure, Perfusion, Pulse, Pain, Position", "Pain, Pitting, Petechiae, Paresis, Poikilothermia", "Pallor, Palpation, Percussion, Perfusion, Pulselessness"],
    a: 0,
    r: "The 5 P's of compartment syndrome are Pain (out of proportion, worse with passive stretch), Pallor, Pulselessness (late finding), Paresthesia, and Paralysis (late finding). Pain is the earliest and most reliable sign. Compartment pressure >30 mmHg is diagnostic.",
    s: "TNCC - Compartment Syndrome"
  },
  {
    q: "During spinal stabilization, which of the following are correct principles? (Select all that apply)",
    o: ["Maintain cervical spine in neutral alignment", "Use a rigid cervical collar during initial assessment", "Log-roll the patient with spinal precautions for posterior exam", "Prolonged backboard use is recommended for spinal protection"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Spinal stabilization principles include neutral alignment, rigid c-collar application, and log-rolling with spinal precautions. Prolonged backboard use is NOT recommended as it causes pressure injury and discomfort; patients should be transferred off the board promptly.",
    s: "TNCC - Spinal Stabilization"
  },
  {
    q: "A patient has a flail chest. What defines this injury?",
    o: ["A single rib fracture with pneumothorax", "Two or more contiguous ribs fractured in two or more places", "Sternal fracture with cardiac contusion", "Open chest wound with air leak"],
    a: 1,
    r: "Flail chest occurs when two or more contiguous ribs are fractured in two or more places, creating a free-floating segment. This causes paradoxical chest wall movement and underlying pulmonary contusion is the primary concern affecting oxygenation.",
    s: "TNCC - Thoracic Trauma"
  },
  {
    q: "What is permissive hypotension in trauma resuscitation?",
    o: ["Allowing blood pressure to drop to zero", "Targeting a systolic BP of 80-90 mmHg in penetrating trauma until definitive hemorrhage control", "Maintaining systolic BP above 120 mmHg at all times", "Administering vasopressors to maintain blood pressure"],
    a: 1,
    r: "Permissive hypotension targets a lower-than-normal systolic BP (80-90 mmHg) in penetrating trauma to prevent disruption of early clot formation. It is NOT used in TBI where cerebral perfusion pressure must be maintained (target SBP ≥100-110 mmHg).",
    s: "TNCC - Hemorrhage Control"
  },
  {
    q: "Place the steps of hemorrhage control in the correct order from least to most invasive.",
    o: ["Direct pressure and wound packing", "Tourniquet application for extremity hemorrhage", "Hemostatic agents and junctional tourniquets", "Surgical intervention / interventional radiology"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Hemorrhage control progresses from direct pressure → tourniquet (for extremity) or hemostatic agents → junctional devices for non-compressible areas → definitive surgical control or IR embolization for internal hemorrhage.",
    s: "TNCC - Hemorrhage Control"
  },
  {
    q: "What is the secondary survey in trauma assessment?",
    o: ["Initial ABCDE assessment", "Complete head-to-toe assessment with history after life threats are addressed", "Triage of multiple casualties", "Prehospital assessment by EMS"],
    a: 1,
    r: "The secondary survey is a systematic head-to-toe examination performed after the primary survey is complete and life threats are addressed. It includes a complete physical exam, AMPLE history, and adjunct diagnostics.",
    s: "TNCC - Secondary Survey"
  },
  {
    q: "Which of the following are components of the AMPLE history in trauma? (Select all that apply)",
    o: ["Allergies and Medications", "Past medical/surgical history", "Last meal and Events/environment related to injury", "Lab values and ECG results"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "AMPLE stands for: Allergies, Medications, Past medical/surgical history and Pregnancy, Last meal/oral intake, and Events/Environment related to the injury. Lab values and ECG are adjuncts to the assessment, not part of the AMPLE history.",
    s: "TNCC - Secondary Survey"
  },
  {
    q: "A patient with a severe TBI has a systolic BP of 85 mmHg. What is the priority intervention?",
    o: ["Administer mannitol for cerebral edema", "Aggressive fluid resuscitation to maintain SBP ≥100 mmHg", "Hyperventilate to reduce ICP", "Elevate the head of bed to 30 degrees"],
    a: 1,
    r: "Hypotension in TBI significantly worsens outcomes. The priority is to maintain SBP ≥100 mmHg (or MAP ≥80) to ensure adequate cerebral perfusion. Mannitol should NOT be given to a hypotensive patient as it can worsen hypotension.",
    s: "TNCC - TBI"
  },
  {
    q: "What is the most common cause of preventable death in trauma?",
    o: ["Traumatic brain injury", "Uncontrolled hemorrhage", "Tension pneumothorax", "Airway obstruction"],
    a: 1,
    r: "Uncontrolled hemorrhage is the leading cause of preventable trauma death. Early recognition and aggressive hemorrhage control, including damage control resuscitation and surgery, are critical to reducing trauma mortality.",
    s: "TNCC - Hemorrhage Control"
  },
  {
    q: "Place the components of the primary trauma survey in the correct order.",
    o: ["Airway with C-spine protection", "Breathing and ventilation", "Circulation with hemorrhage control", "Disability and Exposure"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The primary survey follows the ABCDE sequence: Airway (with C-spine protection) → Breathing (ventilation assessment) → Circulation (hemorrhage control, IV access) → Disability (neurologic status, GCS) → Exposure (undress, environmental control).",
    s: "TNCC - Primary Survey"
  },
  {
    q: "Tranexamic acid (TXA) for trauma hemorrhage should ideally be given within what time frame from injury?",
    o: ["1 hour", "3 hours", "6 hours", "12 hours"],
    a: 1,
    r: "TXA (1 g IV over 10 minutes, then 1 g over 8 hours) should be given within 3 hours of injury for trauma patients with significant hemorrhage. Administration beyond 3 hours may increase mortality. Earlier administration is more effective.",
    s: "TNCC - Massive Transfusion"
  },
  {
    q: "Which of the following injuries should raise suspicion for aortic disruption? (Select all that apply)",
    o: ["Rapid deceleration mechanism (high-speed MVC, fall from height)", "Widened mediastinum on chest X-ray", "Left hemothorax", "Isolated rib fracture"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Traumatic aortic disruption should be suspected with rapid deceleration mechanisms, widened mediastinum (>8 cm) on CXR, and left hemothorax. An isolated rib fracture alone is not specific for aortic injury.",
    s: "TNCC - Thoracic Trauma"
  },
  {
    q: "What type of TBI is characterized by a lucid interval followed by rapid deterioration?",
    o: ["Subdural hematoma", "Epidural hematoma", "Diffuse axonal injury", "Subarachnoid hemorrhage"],
    a: 1,
    r: "Epidural hematoma classically presents with a lucid interval (brief loss of consciousness, followed by apparent recovery, then rapid deterioration). It is typically caused by middle meningeal artery rupture from temporal bone fracture.",
    s: "TNCC - TBI"
  },
  {
    q: "What is the normal compartment pressure, and at what level is fasciotomy indicated?",
    o: ["Normal <5 mmHg; fasciotomy at >20 mmHg", "Normal <10 mmHg; fasciotomy at >30 mmHg", "Normal <15 mmHg; fasciotomy at >40 mmHg", "Normal <20 mmHg; fasciotomy at >50 mmHg"],
    a: 1,
    r: "Normal compartment pressure is 0-8 mmHg. Fasciotomy is generally indicated when compartment pressure exceeds 30 mmHg or when the delta pressure (diastolic BP minus compartment pressure) is <30 mmHg. Clinical assessment remains paramount.",
    s: "TNCC - Compartment Syndrome"
  },
  {
    q: "A trauma patient has a positive FAST exam and is hemodynamically unstable. What is the next step?",
    o: ["CT scan of the abdomen", "Exploratory laparotomy", "Repeat FAST exam in 30 minutes", "Diagnostic peritoneal lavage"],
    a: 1,
    r: "An unstable trauma patient with a positive FAST (free fluid) requires emergent exploratory laparotomy. CT scanning is reserved for hemodynamically stable patients. The operating room is the definitive treatment for an unstable patient with intra-abdominal hemorrhage.",
    s: "TNCC - Abdominal Trauma"
  },
  {
    q: "Which of the following are contraindications to Foley catheter placement in a trauma patient? (Select all that apply)",
    o: ["Blood at the urethral meatus", "High-riding prostate on rectal exam", "Scrotal hematoma", "History of prior urinary tract infection"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Contraindications to Foley placement in trauma include blood at the meatus, high-riding or non-palpable prostate, and scrotal/perineal hematoma—all signs of potential urethral injury. A retrograde urethrogram should be performed first. Prior UTI is not a contraindication.",
    s: "TNCC - Pelvic Trauma"
  }
];

export const ENPC_BANK: ExamQuestion[] = [
  {
    q: "In the Emergency Severity Index (ESI) pediatric triage system, a child with respiratory distress requiring immediate intervention would be classified as:",
    o: ["ESI Level 1", "ESI Level 2", "ESI Level 3", "ESI Level 4"],
    a: 1,
    r: "ESI Level 2 is assigned to high-risk situations including respiratory distress, altered mental status, or severe pain. ESI Level 1 is reserved for patients requiring immediate life-saving intervention (e.g., cardiac arrest, intubation).",
    s: "ENPC - Pediatric Triage"
  },
  {
    q: "Which of the following best differentiates croup from epiglottitis?",
    o: ["Croup presents with drooling and high fever; epiglottitis has a barking cough", "Croup has gradual onset with barking cough and stridor; epiglottitis has rapid onset with drooling and toxic appearance", "Both conditions present identically", "Croup requires intubation; epiglottitis does not"],
    a: 1,
    r: "Croup (laryngotracheobronchitis) has gradual onset with barking cough, hoarseness, and inspiratory stridor. Epiglottitis has rapid onset with high fever, drooling, dysphagia, tripod positioning, and toxic appearance. Epiglottitis is a surgical airway emergency.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "A 6-month-old presents with wheezing, nasal congestion, and mild retractions. The most likely diagnosis is:",
    o: ["Asthma", "Bronchiolitis", "Foreign body aspiration", "Pneumonia"],
    a: 1,
    r: "Bronchiolitis is the most common lower respiratory tract infection in infants <12 months, typically caused by RSV. It presents with rhinorrhea, wheezing, crackles, mild retractions, and feeding difficulty. Treatment is primarily supportive.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "What are the hallmark features of pediatric asthma exacerbation? (Select all that apply)",
    o: ["Expiratory wheezing", "Prolonged expiratory phase", "Increased work of breathing with accessory muscle use", "Inspiratory stridor"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Asthma presents with expiratory wheezing, prolonged expiration, and increased work of breathing. Inspiratory stridor is characteristic of upper airway obstruction (croup, foreign body). Note: absent wheezing in severe asthma indicates minimal air movement.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "Which finding in a pediatric trauma patient suggests non-accidental trauma (child maltreatment)?",
    o: ["A single bruise on the shin of a walking toddler", "Multiple bruises in various stages of healing on non-ambulatory infant", "A forehead bruise on a 3-year-old", "A spiral fracture of the tibia in a running 4-year-old (toddler's fracture)"],
    a: 1,
    r: "Multiple bruises in various stages of healing, especially in non-ambulatory infants or in unusual locations (ears, neck, buttocks, trunk), are highly suspicious for child maltreatment. Bruises on bony prominences in ambulatory children are common from normal play.",
    s: "ENPC - Child Maltreatment"
  },
  {
    q: "A child presents with a seizure lasting 7 minutes. What is the first-line medication?",
    o: ["Phenytoin IV", "Benzodiazepine (midazolam, lorazepam, or diazepam)", "Phenobarbital IV", "Levetiracetam IV"],
    a: 1,
    r: "Benzodiazepines are first-line for acute seizure management. Options include IV lorazepam (0.1 mg/kg), IM midazolam (0.2 mg/kg), rectal diazepam (0.5 mg/kg), or intranasal midazolam. Second-line agents include fosphenytoin or levetiracetam.",
    s: "ENPC - Seizures"
  },
  {
    q: "What is the most common type of shock in pediatric patients?",
    o: ["Cardiogenic shock", "Distributive shock", "Hypovolemic shock", "Obstructive shock"],
    a: 2,
    r: "Hypovolemic shock (from dehydration, hemorrhage, or third-spacing) is the most common type of shock in children. Dehydration from gastroenteritis is a particularly frequent cause in pediatric emergency settings.",
    s: "ENPC - Shock in Children"
  },
  {
    q: "Which of the following are indicators of severe dehydration in a child? (Select all that apply)",
    o: ["Sunken fontanelle in an infant", "Absent tears when crying", "Decreased urine output", "Increased skin turgor (tenting)"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2, 3],
    r: "All are signs of severe dehydration: sunken fontanelle, absent tears, decreased or absent urine output, and skin tenting. Additional signs include tachycardia, dry mucous membranes, altered mental status, and delayed capillary refill.",
    s: "ENPC - Shock in Children"
  },
  {
    q: "A 2-year-old presents with sudden onset of coughing, gagging, and unilateral wheezing. The most likely diagnosis is:",
    o: ["Asthma exacerbation", "Bronchiolitis", "Foreign body aspiration", "Croup"],
    a: 2,
    r: "Sudden onset of coughing, gagging, and unilateral wheezing in a toddler is classic for foreign body aspiration. The most common age is 1-3 years. Right main bronchus is most commonly affected. Diagnosis is confirmed with inspiratory/expiratory chest X-rays or bronchoscopy.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "In family-centered care, which principle is most important during pediatric resuscitation?",
    o: ["Family members should never be present during resuscitation", "Family should be offered the option to be present with a support person", "Family must leave the room at all times", "Family presence is only allowed after the patient has died"],
    a: 1,
    r: "Family-centered care supports offering family the option to be present during resuscitation with a designated support person. Research shows family presence does not interfere with care and helps with the grieving process.",
    s: "ENPC - Family-Centered Care"
  },
  {
    q: "What is the Pediatric Glasgow Coma Scale (GCS) score for a child who opens eyes to speech, has inappropriate words, and localizes pain?",
    o: ["GCS 10", "GCS 11", "GCS 12", "GCS 13"],
    a: 1,
    r: "Eye opening to speech = 3, Inappropriate words = 3, Localizes pain = 5. Total GCS = 3 + 3 + 5 = 11. Modified verbal scores are used for preverbal children.",
    s: "ENPC - Pediatric Trauma"
  },
  {
    q: "Which of the following injuries should raise suspicion for child abuse? (Select all that apply)",
    o: ["Metaphyseal corner fractures (bucket handle fractures)", "Posterior rib fractures in infants", "Retinal hemorrhages with subdural hematoma", "Clavicle fracture from a fall off a bicycle"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Highly specific injuries for abuse include metaphyseal corner fractures, posterior rib fractures in infants, and retinal hemorrhages with subdural hematoma (shaken baby syndrome). A clavicle fracture from a fall is a common accidental injury.",
    s: "ENPC - Child Maltreatment"
  },
  {
    q: "A child with epiglottitis is in the emergency department. What is the priority nursing action?",
    o: ["Obtain a throat culture", "Keep the child calm and avoid agitation; prepare for airway management", "Place the child supine immediately", "Administer oral antibiotics"],
    a: 1,
    r: "In suspected epiglottitis, keep the child calm and in a position of comfort (usually sitting upright). Avoid agitating the child, examining the throat, or placing supine as this can precipitate complete airway obstruction. Prepare for emergent airway management.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "What is the JumpSTART triage system used for?",
    o: ["In-hospital pediatric triage", "Mass casualty incident triage for children", "Determining severity of pediatric illness", "Prioritizing emergency department patients"],
    a: 1,
    r: "JumpSTART is a mass casualty incident (MCI) triage tool specifically designed for pediatric patients. It categorizes children as Immediate (red), Delayed (yellow), Minor (green), or Deceased/Expectant (black) based on ability to walk, breathing, pulse, and mental status.",
    s: "ENPC - Pediatric Triage"
  },
  {
    q: "Place the assessment priorities for a pediatric trauma patient in the correct order.",
    o: ["Scene safety and mechanism of injury", "Primary survey (ABCDE) with c-spine precautions", "Secondary survey (head-to-toe examination)", "Reassessment and definitive care planning"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Pediatric trauma assessment follows: scene safety and mechanism understanding → primary survey (ABCDE with spinal precautions) → resuscitation of life threats → secondary survey (complete exam) → ongoing reassessment and definitive care planning.",
    s: "ENPC - Pediatric Trauma"
  },
  {
    q: "What distinguishes compensated from decompensated shock in a child?",
    o: ["Compensated shock has hypotension; decompensated has normal blood pressure", "Compensated shock maintains blood pressure through tachycardia and vasoconstriction; decompensated shows hypotension", "There is no difference between compensated and decompensated shock", "Decompensated shock has tachycardia; compensated does not"],
    a: 1,
    r: "In compensated shock, the body maintains blood pressure through increased heart rate and systemic vascular resistance. Decompensated shock occurs when these mechanisms fail, resulting in hypotension. In children, hypotension is a late and ominous sign.",
    s: "ENPC - Shock in Children"
  },
  {
    q: "A febrile seizure in a child is characterized by:",
    o: ["Seizure with fever in a child aged 6 months to 5 years without CNS infection", "Any seizure occurring with a fever regardless of age", "Seizures only caused by meningitis", "Seizures lasting longer than 30 minutes"],
    a: 0,
    r: "Simple febrile seizures occur in children aged 6 months to 5 years with fever (≥38°C) without evidence of CNS infection. They are generalized, last <15 minutes, and do not recur within 24 hours. Complex febrile seizures are focal, prolonged, or recurrent.",
    s: "ENPC - Seizures"
  },
  {
    q: "Which of the following are mandatory reporting situations for nurses? (Select all that apply)",
    o: ["Suspected child abuse or neglect", "Suspected sexual abuse", "Injuries inconsistent with the reported mechanism", "A child with a common cold"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Nurses are mandated reporters and must report suspected child abuse, neglect, sexual abuse, and injuries inconsistent with the reported mechanism. Suspicion is sufficient for reporting—confirmation is not required before filing a report.",
    s: "ENPC - Child Maltreatment"
  },
  {
    q: "The treatment of choice for moderate croup with stridor at rest includes:",
    o: ["Nebulized albuterol and oral antibiotics", "Nebulized racemic epinephrine and oral dexamethasone", "Intubation and IV antibiotics", "Cool mist humidification only"],
    a: 1,
    r: "Moderate-severe croup with stridor at rest is treated with nebulized racemic epinephrine (for rapid symptom relief) and a single dose of oral dexamethasone 0.6 mg/kg (for sustained anti-inflammatory effect). Observation for rebound symptoms after epinephrine is required.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "Place the triage categories of the JumpSTART system in order of treatment priority.",
    o: ["Immediate (Red)", "Delayed (Yellow)", "Minor (Green)", "Deceased/Expectant (Black)"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "JumpSTART MCI triage priorities: Immediate (Red) patients are treated first—they have life-threatening injuries that are treatable. Delayed (Yellow) can wait. Minor (Green) have minimal injuries. Deceased/Expectant (Black) are not viable.",
    s: "ENPC - Pediatric Triage"
  },
  {
    q: "What is the most common mechanism of injury in pediatric trauma?",
    o: ["Penetrating trauma", "Burns", "Blunt trauma", "Near-drowning"],
    a: 2,
    r: "Blunt trauma is the most common mechanism of pediatric injury, including motor vehicle crashes, falls, bicycle injuries, and sports injuries. Children's anatomy makes them more susceptible to multisystem injury from blunt forces.",
    s: "ENPC - Pediatric Trauma"
  },
  {
    q: "A child with status epilepticus has received two doses of benzodiazepines without seizure cessation. What is the next medication to consider?",
    o: ["A third dose of benzodiazepine", "Fosphenytoin or levetiracetam", "Propofol", "Aspirin"],
    a: 1,
    r: "After two doses of benzodiazepines, second-line agents include fosphenytoin (20 mg PE/kg IV) or levetiracetam (60 mg/kg IV). A third benzodiazepine dose increases risk of respiratory depression without significant benefit.",
    s: "ENPC - Seizures"
  },
  {
    q: "What is the appropriate IV fluid maintenance rate calculation for a 15 kg child using the 4-2-1 rule?",
    o: ["40 mL/hr", "50 mL/hr", "55 mL/hr", "60 mL/hr"],
    a: 1,
    r: "Using the 4-2-1 rule: first 10 kg × 4 mL/kg/hr = 40 mL/hr, next 5 kg × 2 mL/kg/hr = 10 mL/hr. Total = 40 + 10 = 50 mL/hr. This Holliday-Segar method is the standard for calculating pediatric maintenance fluids.",
    s: "ENPC - Shock in Children"
  },
  {
    q: "Which of the following are appropriate interventions for a child with bronchiolitis? (Select all that apply)",
    o: ["Nasal suctioning to clear secretions", "Supplemental oxygen if SpO2 <90%", "Maintaining adequate hydration", "Routine use of bronchodilators for all patients"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Bronchiolitis management is primarily supportive: nasal suctioning, supplemental oxygen when needed (SpO2 <90%), and adequate hydration. AAP guidelines do not recommend routine bronchodilators, steroids, or antibiotics for bronchiolitis.",
    s: "ENPC - Respiratory Emergencies"
  },
  {
    q: "During a pediatric emergency, which approach best supports family-centered care?",
    o: ["Restricting all family visits until the child is stable", "Providing honest, timely updates and involving family in care decisions", "Only allowing one parent to visit once per day", "Providing information only after discharge"],
    a: 1,
    r: "Family-centered care involves honest and timely communication, involving families in care decisions, offering presence during procedures and resuscitation, and recognizing the family as integral to the child's care and recovery.",
    s: "ENPC - Family-Centered Care"
  }
];

export const BLS_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What is the recommended compression depth for an adult during CPR?",
    o: ["At least 1.5 inches", "At least 2 inches but no more than 2.4 inches", "At least 3 inches", "1 inch"],
    a: 1,
    r: "Adult compression depth is at least 2 inches (5 cm) but no more than 2.4 inches (6 cm) to optimize cardiac output while minimizing injury risk.",
    s: "BLS Renewal - High-Quality CPR"
  },
  {
    q: "How often should compressors switch during 2-rescuer CPR?",
    o: ["Every 1 minute", "Every 2 minutes", "Every 5 minutes", "Every 10 minutes"],
    a: 1,
    r: "Compressors should switch every 2 minutes to prevent fatigue-related decline in compression quality. Switches should be completed in under 5 seconds.",
    s: "BLS Renewal - Team Dynamics"
  },
  {
    q: "After an AED delivers a shock, what should you do immediately?",
    o: ["Check for a pulse", "Resume CPR starting with chest compressions", "Wait for the AED to reanalyze", "Provide 2 rescue breaths first"],
    a: 1,
    r: "Immediately resume CPR starting with compressions after a shock. Do not delay to check a pulse, as most patients do not have an organized rhythm immediately post-shock.",
    s: "BLS Renewal - AED"
  },
  {
    q: "Which of the following are elements of high-quality CPR? (Select all that apply)",
    o: ["Adequate compression rate of 100-120/min", "Full chest recoil between compressions", "Minimizing interruptions", "Hyperventilating the patient"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "High-quality CPR elements include proper rate, adequate depth, full recoil, and minimizing interruptions. Hyperventilation is harmful as it increases intrathoracic pressure and decreases venous return.",
    s: "BLS Renewal - High-Quality CPR"
  },
  {
    q: "For a choking infant who becomes unresponsive, what is the correct action?",
    o: ["Perform abdominal thrusts", "Begin CPR, look for object before giving breaths", "Perform a blind finger sweep", "Call 911 and wait for EMS"],
    a: 1,
    r: "For an unresponsive choking infant, begin CPR starting with compressions. Before each ventilation attempt, look in the mouth and remove any visible object. Do not perform blind finger sweeps.",
    s: "BLS Renewal - Choking Management"
  },
  {
    q: "What ventilation rate is used with an advanced airway during CPR?",
    o: ["1 breath every 2 seconds", "1 breath every 6 seconds", "1 breath every 10 seconds", "2 breaths every 30 compressions"],
    a: 1,
    r: "With an advanced airway in place, deliver 1 breath every 6 seconds (10 breaths per minute) continuously, without pausing compressions for ventilations.",
    s: "BLS Renewal - Bag-Valve-Mask"
  },
  {
    q: "What is the compression-to-ventilation ratio for single-rescuer adult CPR?",
    o: ["15:2", "30:2", "15:1", "30:1"],
    a: 1,
    r: "The ratio for single-rescuer adult CPR is 30:2 (30 compressions followed by 2 ventilations).",
    s: "BLS Renewal - High-Quality CPR"
  },
  {
    q: "Place the adult BLS steps in the correct order.",
    o: ["Verify scene safety", "Check responsiveness and activate EMS", "Begin CPR with compressions", "Use AED as soon as available"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The BLS sequence: ensure scene safety → check responsiveness and activate EMS → begin CPR with high-quality compressions → apply and use AED as soon as it arrives.",
    s: "BLS Renewal - Chain of Survival"
  },
  {
    q: "An unresponsive adult has a pulse but is not breathing normally. What should you do?",
    o: ["Begin full CPR", "Provide rescue breathing: 1 breath every 6 seconds", "Place in recovery position and wait", "Begin chest compressions only"],
    a: 1,
    r: "For an adult with a pulse but no normal breathing, provide rescue breathing at 1 breath every 6 seconds (10 breaths/min). Recheck the pulse every 2 minutes. If no pulse, begin CPR.",
    s: "BLS Renewal - High-Quality CPR"
  },
  {
    q: "Which is the correct compression technique for 2-rescuer infant CPR?",
    o: ["Two-finger technique", "Two-thumb encircling technique", "Heel of one hand", "Full hand with interlocked fingers"],
    a: 1,
    r: "The two-thumb encircling technique is preferred for 2-rescuer infant CPR. It generates better compression force and coronary perfusion pressure than the two-finger technique.",
    s: "BLS Renewal - High-Quality CPR"
  }
];

export const ACLS_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What is the first medication given in a VF/pVT cardiac arrest after the second shock?",
    o: ["Amiodarone 300 mg IV", "Epinephrine 1 mg IV/IO", "Atropine 1 mg IV", "Lidocaine 1.5 mg/kg IV"],
    a: 1,
    r: "Epinephrine 1 mg IV/IO is given after the second shock in the VF/pVT algorithm. It is repeated every 3-5 minutes. Amiodarone is given after the third shock.",
    s: "ACLS Renewal - Cardiac Arrest Algorithms"
  },
  {
    q: "For symptomatic bradycardia, what is the first-line pharmacologic treatment?",
    o: ["Epinephrine 1 mg IV", "Atropine 1 mg IV", "Dopamine 2-10 mcg/kg/min", "Amiodarone 150 mg IV"],
    a: 1,
    r: "Atropine 1 mg IV is first-line for symptomatic bradycardia. It may be repeated every 3-5 minutes to a maximum of 3 mg. If ineffective, consider pacing or epinephrine/dopamine infusion.",
    s: "ACLS Renewal - Bradycardia Algorithm"
  },
  {
    q: "What is the initial dose of adenosine for stable SVT?",
    o: ["3 mg IV push", "6 mg rapid IV push", "12 mg IV push", "0.5 mg IV push"],
    a: 1,
    r: "Adenosine 6 mg is given as a rapid IV push followed by a 20 mL normal saline flush for stable SVT after vagal maneuvers fail. The second dose is 12 mg if needed.",
    s: "ACLS Renewal - Tachycardia Algorithm"
  },
  {
    q: "Which of the following are reversible causes of cardiac arrest (H's and T's)? (Select all that apply)",
    o: ["Hypoxia and Hypovolemia", "Tension pneumothorax and Tamponade", "Thrombosis and Toxins", "Hypertension and Tachycardia"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "The H's and T's include Hypoxia, Hypovolemia, Hydrogen ion, Hypo/hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, and Thrombosis. Hypertension and tachycardia are not part of this mnemonic.",
    s: "ACLS Renewal - Cardiac Arrest Algorithms"
  },
  {
    q: "What is the target door-to-balloon time for STEMI patients?",
    o: ["30 minutes", "60 minutes", "90 minutes", "120 minutes"],
    a: 2,
    r: "Door-to-balloon time for STEMI should be less than 90 minutes. If PCI is not available within 120 minutes, fibrinolytic therapy should be administered within 30 minutes of arrival.",
    s: "ACLS Renewal - STEMI Management"
  },
  {
    q: "What ETCO2 reading during CPR suggests effective compressions?",
    o: ["Less than 10 mmHg", "10-20 mmHg", "Greater than 20 mmHg", "Greater than 50 mmHg"],
    a: 2,
    r: "ETCO2 greater than 20 mmHg generally indicates adequate compression quality. Values less than 10 mmHg suggest compressions need improvement. A sudden rise to 35-40 mmHg may indicate ROSC.",
    s: "ACLS Renewal - Advanced Airway"
  },
  {
    q: "For an unstable patient with a wide-complex tachycardia, what is the treatment?",
    o: ["Adenosine 6 mg IV push", "Synchronized cardioversion", "Amiodarone 150 mg IV over 10 minutes", "Vagal maneuvers"],
    a: 1,
    r: "Unstable tachycardia of any type (narrow or wide complex) with hemodynamic compromise requires immediate synchronized cardioversion. Medications are used for stable patients.",
    s: "ACLS Renewal - Tachycardia Algorithm"
  },
  {
    q: "Place the VF/pVT algorithm interventions in the correct order.",
    o: ["First shock", "CPR 2 min, then second shock + epinephrine", "CPR 2 min, then third shock + amiodarone", "Continue CPR cycles with epinephrine every 3-5 min"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "VF/pVT sequence: shock → CPR 2 min, shock, epinephrine → CPR 2 min, shock, amiodarone 300 mg → continue with CPR, shocks, and epinephrine every 3-5 minutes.",
    s: "ACLS Renewal - Cardiac Arrest Algorithms"
  },
  {
    q: "What is the recommended temperature range for targeted temperature management post-cardiac arrest?",
    o: ["32-34°C", "32-36°C", "36-38°C", "28-32°C"],
    a: 1,
    r: "Targeted temperature management at 32-36°C is recommended for comatose adult patients after ROSC. Temperature should be maintained for at least 24 hours. Avoid fever (>37.7°C) for at least 72 hours.",
    s: "ACLS Renewal - Cardiac Arrest Algorithms"
  },
  {
    q: "Asystole is treated with which of the following?",
    o: ["Defibrillation", "Epinephrine 1 mg IV every 3-5 minutes and CPR", "Synchronized cardioversion", "Amiodarone 300 mg IV bolus"],
    a: 1,
    r: "Asystole is a non-shockable rhythm. Treatment includes high-quality CPR, epinephrine 1 mg IV/IO every 3-5 minutes, and identifying reversible causes. Defibrillation and cardioversion are not indicated.",
    s: "ACLS Renewal - Cardiac Arrest Algorithms"
  }
];

export const PALS_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What are the three sides of the Pediatric Assessment Triangle?",
    o: ["Airway, Breathing, Circulation", "Appearance, Work of Breathing, Circulation to Skin", "Heart rate, Blood pressure, Respiratory rate", "Alert, Verbal, Painful"],
    a: 1,
    r: "The PAT evaluates Appearance (TICLS: Tone, Interactiveness, Consolability, Look/gaze, Speech/cry), Work of Breathing, and Circulation to Skin for a rapid 'across the room' assessment.",
    s: "PALS Renewal - Pediatric Assessment Triangle"
  },
  {
    q: "What is the initial defibrillation dose for pediatric VF/pVT?",
    o: ["1 J/kg", "2 J/kg", "4 J/kg", "10 J/kg"],
    a: 1,
    r: "Initial defibrillation for pediatric VF/pVT is 2 J/kg. Second shock is 4 J/kg, and subsequent shocks are ≥4 J/kg (max 10 J/kg or adult dose).",
    s: "PALS Renewal - Pediatric Cardiac Arrest"
  },
  {
    q: "What is the IV/IO dose of epinephrine for pediatric cardiac arrest?",
    o: ["0.1 mg/kg", "0.01 mg/kg", "1 mg flat dose", "0.001 mg/kg"],
    a: 1,
    r: "Pediatric epinephrine dose for cardiac arrest is 0.01 mg/kg IV/IO (0.1 mL/kg of 1:10,000). Maximum single dose is 1 mg. Repeat every 3-5 minutes.",
    s: "PALS Renewal - Weight-Based Dosing"
  },
  {
    q: "Which of the following differentiate respiratory distress from failure? (Select all that apply)",
    o: ["Respiratory failure has inadequate oxygenation despite compensatory effort", "Altered mental status suggests respiratory failure", "Respiratory distress shows increased work of breathing with maintained gas exchange", "Both conditions present with normal mental status"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Respiratory distress = increased effort with maintained oxygenation/ventilation. Respiratory failure = inadequate oxygenation/ventilation despite effort, often with altered mental status. Altered mental status is a key differentiator.",
    s: "PALS Renewal - Respiratory Distress vs Failure"
  },
  {
    q: "What is the initial fluid bolus for pediatric hypovolemic shock?",
    o: ["10 mL/kg", "20 mL/kg", "40 mL/kg", "60 mL/kg"],
    a: 1,
    r: "The initial fluid bolus is 20 mL/kg of isotonic crystalloid given over 5-20 minutes. Reassess and repeat as needed up to 60 mL/kg in the first hour.",
    s: "PALS Renewal - Pediatric Shock"
  },
  {
    q: "What compression-to-ventilation ratio is used for 2-rescuer pediatric CPR?",
    o: ["30:2", "15:2", "3:1", "5:1"],
    a: 1,
    r: "Two-rescuer infant/child CPR uses a 15:2 ratio. Single-rescuer uses 30:2. The higher ventilation frequency in 2-rescuer CPR addresses the respiratory etiology of most pediatric arrests.",
    s: "PALS Renewal - Pediatric Cardiac Arrest"
  },
  {
    q: "The Broselow tape estimates a child's weight based on:",
    o: ["Age in years", "Length/height", "Head circumference", "Abdominal girth"],
    a: 1,
    r: "The Broselow tape uses a child's length to estimate weight. It provides color-coded zones with pre-calculated equipment sizes and medication doses for pediatric emergency care.",
    s: "PALS Renewal - Broselow Tape"
  },
  {
    q: "Place the pediatric BLS sequence for a witnessed arrest in the correct order.",
    o: ["Check responsiveness", "Activate emergency response and get AED", "Begin CPR", "Apply AED when available"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "For a witnessed pediatric arrest: check responsiveness → activate EMS and get AED → begin high-quality CPR → apply AED when available. For an unwitnessed arrest, perform 2 minutes of CPR first.",
    s: "PALS Renewal - Pediatric Cardiac Arrest"
  },
  {
    q: "What is the most common cause of pediatric cardiac arrest?",
    o: ["Primary cardiac disease", "Respiratory failure progressing to arrest", "Electrolyte imbalance", "Drug overdose"],
    a: 1,
    r: "Most pediatric cardiac arrests result from progressive respiratory failure or shock, unlike adults where primary cardiac events predominate. This is why early recognition and intervention for respiratory distress is critical in PALS.",
    s: "PALS Renewal - Respiratory Distress vs Failure"
  },
  {
    q: "What is the pediatric dose of adenosine for SVT?",
    o: ["0.05 mg/kg IV", "0.1 mg/kg IV (max 6 mg first dose)", "6 mg IV regardless of weight", "0.5 mg/kg IV"],
    a: 1,
    r: "Pediatric adenosine dose is 0.1 mg/kg (max 6 mg) for the first dose, given as a rapid IV push. Second dose is 0.2 mg/kg (max 12 mg). Must be followed by rapid saline flush.",
    s: "PALS Renewal - Weight-Based Dosing"
  }
];

export const NRP_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What is the initial FiO2 for PPV in a term newborn?",
    o: ["100%", "21% (room air)", "40%", "50%"],
    a: 1,
    r: "PPV for term newborns (≥35 weeks) should start at 21% (room air) and be titrated based on pre-ductal SpO2. For preterm <35 weeks, start at 21-30%.",
    s: "NRP Renewal - PPV Technique"
  },
  {
    q: "What is the compression-to-ventilation ratio in neonatal resuscitation?",
    o: ["30:2", "15:2", "3:1", "5:1"],
    a: 2,
    r: "The neonatal ratio is 3:1 (3 compressions: 1 ventilation), providing 90 compressions and 30 breaths per minute (120 total events per minute).",
    s: "NRP Renewal - Chest Compressions"
  },
  {
    q: "When should chest compressions be started in neonatal resuscitation?",
    o: ["Immediately after birth", "When HR <100 bpm", "When HR <60 bpm despite 30 seconds of effective PPV", "When SpO2 <90%"],
    a: 2,
    r: "Chest compressions are initiated when the heart rate remains below 60 bpm despite 30 seconds of effective PPV with supplemental oxygen. Ventilation must be effective before starting compressions.",
    s: "NRP Renewal - Chest Compressions"
  },
  {
    q: "What does MR SOPA stand for? (Select all that apply)",
    o: ["Mask adjustment, Reposition airway", "Suction mouth and nose, Open mouth", "Pressure increase, Alternative airway", "Monitor rhythm, Oxygen adjustment"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "MR SOPA: Mask adjustment → Reposition airway → Suction → Open mouth → Pressure increase → Alternative airway. It is the systematic approach to correcting ineffective PPV.",
    s: "NRP Renewal - MR SOPA"
  },
  {
    q: "What is the IV/IO dose of epinephrine for neonatal resuscitation?",
    o: ["0.01 mg/kg", "0.01-0.03 mg/kg", "0.1 mg/kg", "1 mg flat dose"],
    a: 1,
    r: "Neonatal IV/IO epinephrine dose is 0.01-0.03 mg/kg (0.1-0.3 mL/kg of 1:10,000). The preferred route is UVC. ET dose is higher: 0.05-0.1 mg/kg.",
    s: "NRP Renewal - Epinephrine Dosing"
  },
  {
    q: "What is the preferred vascular access during neonatal resuscitation?",
    o: ["Peripheral IV", "Umbilical venous catheter", "Intraosseous", "Central line"],
    a: 1,
    r: "The umbilical venous catheter (UVC) is preferred for emergency vascular access in neonates. It can be quickly inserted and used for medication and fluid administration.",
    s: "NRP Renewal - Umbilical Catheter"
  },
  {
    q: "PPV rate for a newborn should be:",
    o: ["20-30 breaths/min", "40-60 breaths/min", "60-80 breaths/min", "10-20 breaths/min"],
    a: 1,
    r: "PPV should be delivered at 40-60 breaths per minute using the 'breathe-two-three' rhythm to maintain appropriate rate.",
    s: "NRP Renewal - PPV Technique"
  },
  {
    q: "Place the NRP algorithm steps in the correct order.",
    o: ["Initial steps (warm, dry, stimulate)", "PPV if apneic or HR <100", "Compressions if HR <60 despite effective PPV", "Epinephrine if HR <60 despite compressions"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "NRP follows: initial steps → PPV → chest compressions if HR remains <60 → epinephrine if HR still <60. Each step builds on effective completion of the previous step.",
    s: "NRP Renewal - Initial Steps"
  },
  {
    q: "Delayed cord clamping is recommended for how long in vigorous term newborns?",
    o: ["Immediately", "At least 30-60 seconds", "5 minutes", "Until the cord stops pulsating"],
    a: 1,
    r: "Delayed cord clamping for at least 30-60 seconds is recommended for vigorous term and preterm newborns. Benefits include improved iron stores and decreased need for transfusion.",
    s: "NRP Renewal - Initial Steps"
  },
  {
    q: "Therapeutic hypothermia for neonatal HIE should be initiated within:",
    o: ["1 hour", "6 hours", "12 hours", "24 hours"],
    a: 1,
    r: "Therapeutic hypothermia should begin within 6 hours of birth for newborns ≥36 weeks with moderate-severe HIE. Target temperature is 33.5°C for 72 hours.",
    s: "NRP Renewal - Post-Resuscitation Care"
  }
];

export const TNCC_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What is the correct order of the primary trauma survey?",
    o: ["ABCDE: Airway, Breathing, Circulation, Disability, Exposure", "Circulation, Airway, Breathing, Disability, Exposure", "Disability, Airway, Breathing, Circulation, Exposure", "Exposure, Airway, Breathing, Circulation, Disability"],
    a: 0,
    r: "The primary survey follows ABCDE: Airway with c-spine protection → Breathing → Circulation with hemorrhage control → Disability (neurologic status) → Exposure with environmental control.",
    s: "TNCC Renewal - Primary Survey"
  },
  {
    q: "What is the recommended ratio for massive transfusion protocol?",
    o: ["3:1:1 (pRBC:FFP:platelets)", "1:1:1 (pRBC:FFP:platelets)", "2:1:1 (pRBC:FFP:platelets)", "1:2:1 (pRBC:FFP:platelets)"],
    a: 1,
    r: "A balanced 1:1:1 ratio of packed RBCs to FFP to platelets is recommended to prevent the lethal triad of hypothermia, acidosis, and coagulopathy.",
    s: "TNCC Renewal - Massive Transfusion"
  },
  {
    q: "Which findings indicate a tension pneumothorax? (Select all that apply)",
    o: ["Absent breath sounds on affected side", "Tracheal deviation away from affected side", "Hypotension and JVD", "Bilateral equal breath sounds"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Tension pneumothorax presents with absent breath sounds on the affected side, tracheal deviation away from the affected side, hypotension, JVD, and tachycardia. Treatment is immediate needle decompression.",
    s: "TNCC Renewal - Thoracic Trauma"
  },
  {
    q: "The lethal triad in trauma consists of:",
    o: ["Hypoxia, hypertension, tachycardia", "Hypothermia, acidosis, coagulopathy", "Brain injury, hemorrhage, pneumothorax", "Sepsis, ARDS, DIC"],
    a: 1,
    r: "The lethal triad consists of hypothermia, metabolic acidosis, and coagulopathy. These conditions perpetuate each other and significantly increase mortality in trauma patients.",
    s: "TNCC Renewal - Hemorrhage Control"
  },
  {
    q: "What GCS score generally indicates the need for intubation?",
    o: ["GCS ≤12", "GCS ≤10", "GCS ≤8", "GCS ≤6"],
    a: 2,
    r: "A GCS of 8 or less generally indicates the need for endotracheal intubation for airway protection, as the patient cannot reliably protect their own airway.",
    s: "TNCC Renewal - TBI"
  },
  {
    q: "What is the most common cause of preventable trauma death?",
    o: ["Airway obstruction", "Uncontrolled hemorrhage", "Tension pneumothorax", "Traumatic brain injury"],
    a: 1,
    r: "Uncontrolled hemorrhage is the leading cause of preventable death in trauma. Early hemorrhage control and damage control resuscitation are essential to improving outcomes.",
    s: "TNCC Renewal - Hemorrhage Control"
  },
  {
    q: "TXA should be administered within what time frame from injury?",
    o: ["1 hour", "3 hours", "6 hours", "12 hours"],
    a: 1,
    r: "Tranexamic acid should be given within 3 hours of injury. The first dose (1 g IV) is given over 10 minutes, followed by 1 g over 8 hours. Earlier administration yields better results.",
    s: "TNCC Renewal - Massive Transfusion"
  },
  {
    q: "Place the hemorrhage control steps from least to most invasive.",
    o: ["Direct pressure", "Tourniquet application", "Hemostatic agents", "Surgical intervention"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Hemorrhage control progression: direct pressure → tourniquet for extremity bleeding → hemostatic agents → definitive surgical control or interventional radiology.",
    s: "TNCC Renewal - Hemorrhage Control"
  },
  {
    q: "An unstable trauma patient has a positive FAST exam. What is the next step?",
    o: ["CT scan", "Exploratory laparotomy", "Repeat FAST in 30 minutes", "MRI"],
    a: 1,
    r: "An unstable patient with a positive FAST exam (free fluid) requires emergent exploratory laparotomy. CT scanning is appropriate only for hemodynamically stable patients.",
    s: "TNCC Renewal - Abdominal Trauma"
  },
  {
    q: "What is the earliest and most reliable sign of compartment syndrome?",
    o: ["Pulselessness", "Paralysis", "Pain out of proportion to injury", "Pallor"],
    a: 2,
    r: "Pain out of proportion to the injury, especially with passive stretch of the affected compartment, is the earliest and most reliable clinical sign of compartment syndrome. Pulselessness and paralysis are late findings.",
    s: "TNCC Renewal - Compartment Syndrome"
  }
];

export const ENPC_RENEWAL_BANK: ExamQuestion[] = [
  {
    q: "What differentiates croup from epiglottitis in a child?",
    o: ["Croup has sudden onset with drooling; epiglottitis has gradual onset with barking cough", "Croup has gradual onset with barking cough; epiglottitis has rapid onset with drooling and toxic appearance", "Both present identically", "Neither causes stridor"],
    a: 1,
    r: "Croup has gradual onset with barking (seal-like) cough, hoarseness, and stridor. Epiglottitis has rapid onset with high fever, drooling, dysphagia, and toxic appearance. Epiglottitis is a true airway emergency.",
    s: "ENPC Renewal - Respiratory Emergencies"
  },
  {
    q: "What is the most common type of shock in pediatric patients?",
    o: ["Cardiogenic", "Distributive", "Hypovolemic", "Obstructive"],
    a: 2,
    r: "Hypovolemic shock is most common in children, often caused by dehydration from gastroenteritis, hemorrhage, or third-space fluid losses.",
    s: "ENPC Renewal - Shock in Children"
  },
  {
    q: "Which of the following are signs of child maltreatment? (Select all that apply)",
    o: ["Injuries inconsistent with reported mechanism", "Multiple bruises in various stages of healing", "Delay in seeking care for significant injury", "A scraped knee on an active 5-year-old"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Red flags for maltreatment include inconsistent history, patterned or multiple-stage bruises, unexplained injuries in non-ambulatory children, and delayed presentation. A scraped knee in an active child is expected.",
    s: "ENPC Renewal - Child Maltreatment"
  },
  {
    q: "First-line medication for a child with an active seizure is:",
    o: ["Phenytoin IV", "Benzodiazepine (lorazepam, midazolam, or diazepam)", "Phenobarbital", "Carbamazepine"],
    a: 1,
    r: "Benzodiazepines are first-line for acute seizures: IV lorazepam, IM/IN midazolam, or rectal diazepam. They act quickly on GABA receptors to terminate seizure activity.",
    s: "ENPC Renewal - Seizures"
  },
  {
    q: "Supportive care for bronchiolitis includes:",
    o: ["Routine bronchodilators and steroids", "Nasal suctioning, oxygen if SpO2 <90%, and hydration", "IV antibiotics", "Chest physiotherapy"],
    a: 1,
    r: "Bronchiolitis treatment is supportive: nasal suctioning, supplemental oxygen for SpO2 <90%, and adequate hydration. AAP guidelines do not recommend routine bronchodilators, steroids, or antibiotics.",
    s: "ENPC Renewal - Respiratory Emergencies"
  },
  {
    q: "In family-centered care, family presence during resuscitation should be:",
    o: ["Never allowed", "Offered as an option with a dedicated support person", "Required for all family members", "Allowed only after death"],
    a: 1,
    r: "Evidence-based family-centered care supports offering families the option to be present during resuscitation with a designated support person to provide comfort and explanation.",
    s: "ENPC Renewal - Family-Centered Care"
  },
  {
    q: "A febrile seizure is characterized by a seizure with fever in a child aged:",
    o: ["0-3 months", "6 months to 5 years", "5-12 years", "Any age"],
    a: 1,
    r: "Simple febrile seizures occur in children aged 6 months to 5 years with fever ≥38°C, without CNS infection. They are generalized, last <15 minutes, and do not recur within 24 hours.",
    s: "ENPC Renewal - Seizures"
  },
  {
    q: "Place the pediatric emergency assessment steps in order.",
    o: ["General impression (PAT)", "Primary assessment (ABCDE)", "Secondary assessment (focused exam and history)", "Reassessment and ongoing care"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Pediatric emergency assessment: general impression using PAT → primary assessment (ABCDE) → secondary assessment with focused exam and SAMPLE history → reassessment and definitive care.",
    s: "ENPC Renewal - Pediatric Triage"
  },
  {
    q: "What distinguishes compensated from decompensated shock in children?",
    o: ["Compensated shock has hypotension", "Decompensated shock maintains normal blood pressure", "Compensated shock maintains BP; decompensated shows hypotension", "There is no clinical difference"],
    a: 2,
    r: "In compensated shock, blood pressure is maintained through tachycardia and vasoconstriction. Decompensated shock occurs when these mechanisms fail, leading to hypotension—a late and ominous sign in children.",
    s: "ENPC Renewal - Shock in Children"
  },
  {
    q: "The most common mechanism of pediatric trauma is:",
    o: ["Penetrating injury", "Burns", "Blunt trauma", "Poisoning"],
    a: 2,
    r: "Blunt trauma (MVCs, falls, bicycle injuries, sports) is the most common mechanism of pediatric injury. Children's proportionally larger heads and more flexible skeletons make them vulnerable to multisystem blunt injury.",
    s: "ENPC Renewal - Pediatric Trauma"
  }
];

export const EMERGENCY_RESUSCITATION_CORE_BANK: ExamQuestion[] = [
  {
    q: "What is the universal compression rate recommended for CPR across all age groups?",
    o: ["80-100 per minute", "100-120 per minute", "120-140 per minute", "60-80 per minute"],
    a: 1,
    r: "The AHA recommends a compression rate of 100-120 per minute for all ages (adult, child, infant, neonate during the compression phase). This rate optimizes cardiac output during CPR.",
    s: "Emergency Resuscitation - Compression Fundamentals"
  },
  {
    q: "What is the purpose of waveform capnography during resuscitation?",
    o: ["Measuring blood pressure", "Confirming ETT placement and monitoring CPR quality", "Assessing oxygen saturation", "Measuring tidal volume"],
    a: 1,
    r: "Waveform capnography confirms endotracheal tube placement (gold standard), monitors CPR quality (ETCO2 correlates with cardiac output), and may indicate ROSC (sudden sustained rise in ETCO2 to ≥40 mmHg).",
    s: "Emergency Resuscitation - Monitoring"
  },
  {
    q: "Which of the following are components of the chain of survival common to all age groups? (Select all that apply)",
    o: ["Early recognition and activation of emergency response", "Early high-quality CPR", "Rapid defibrillation when indicated", "Post-cardiac arrest care"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2, 3],
    r: "The chain of survival includes early recognition, early CPR, rapid defibrillation (when applicable), advanced life support, and post-cardiac arrest care. These links are universal across all age-specific algorithms.",
    s: "Emergency Resuscitation - Chain of Survival"
  },
  {
    q: "Epinephrine's primary mechanism of action during cardiac arrest is:",
    o: ["Beta-2 stimulation causing bronchodilation", "Alpha-1 stimulation causing vasoconstriction to improve coronary and cerebral perfusion", "Beta-1 stimulation increasing myocardial contractility", "Calcium channel blockade"],
    a: 1,
    r: "During cardiac arrest, epinephrine's primary benefit comes from alpha-1 adrenergic stimulation, causing peripheral vasoconstriction that increases aortic diastolic pressure and improves coronary and cerebral perfusion during CPR.",
    s: "Emergency Resuscitation - Pharmacology"
  },
  {
    q: "What compression depth applies as a general rule across all age groups?",
    o: ["1 inch for all patients", "One-third the anterior-posterior diameter of the chest", "2 inches for all patients", "One-half the anterior-posterior diameter"],
    a: 1,
    r: "Compression depth of approximately one-third the AP chest diameter is the general guideline across ages: at least 1.5 inches for infants, at least 2 inches for children, and at least 2 inches (but ≤2.4) for adults.",
    s: "Emergency Resuscitation - Compression Fundamentals"
  },
  {
    q: "Place the universal steps of resuscitation in the correct order.",
    o: ["Assess responsiveness and call for help", "Open airway and check breathing", "Begin CPR if indicated", "Apply monitor/defibrillator and reassess"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "Universal resuscitation sequence: assess responsiveness and activate help → open airway and assess breathing → initiate CPR if needed → attach monitor/defibrillator, reassess rhythm, and continue algorithm-directed care.",
    s: "Emergency Resuscitation - Systematic Approach"
  },
  {
    q: "What is the significance of a sudden sustained rise in ETCO2 during CPR?",
    o: ["It indicates the ETT is displaced", "It strongly suggests return of spontaneous circulation (ROSC)", "It means CPR quality has declined", "It indicates hyperventilation"],
    a: 1,
    r: "A sudden sustained increase in ETCO2 (typically to ≥35-40 mmHg) during CPR strongly suggests ROSC, as the restored circulation increases CO2 delivery to the lungs. This may precede a palpable pulse.",
    s: "Emergency Resuscitation - Monitoring"
  },
  {
    q: "Which of the following are shockable cardiac arrest rhythms? (Select all that apply)",
    o: ["Ventricular fibrillation (VF)", "Pulseless ventricular tachycardia (pVT)", "Pulseless electrical activity (PEA)", "Asystole"],
    a: 0,
    t: "sata",
    ca: [0, 1],
    r: "Shockable rhythms are VF and pVT. Non-shockable rhythms are PEA and asystole. Distinguishing between shockable and non-shockable rhythms determines whether defibrillation is part of the treatment algorithm.",
    s: "Emergency Resuscitation - Rhythm Recognition"
  },
  {
    q: "What is the primary reason to minimize interruptions in chest compressions?",
    o: ["To prevent rescuer fatigue", "To maintain coronary and cerebral perfusion pressure", "To keep count of compressions", "To allow the AED to function properly"],
    a: 1,
    r: "Each interruption in compressions causes coronary perfusion pressure to drop rapidly. It takes multiple compressions to rebuild adequate perfusion pressure. Interruptions should be limited to less than 10 seconds.",
    s: "Emergency Resuscitation - Compression Fundamentals"
  },
  {
    q: "Amiodarone is indicated in which of the following scenarios?",
    o: ["Asystole cardiac arrest", "PEA cardiac arrest", "Refractory VF/pVT cardiac arrest", "Symptomatic bradycardia"],
    a: 2,
    r: "Amiodarone is indicated for VF/pVT that is refractory to defibrillation and epinephrine. It is not indicated for non-shockable rhythms (asystole, PEA) or bradycardia.",
    s: "Emergency Resuscitation - Pharmacology"
  },
  {
    q: "What is the recommended ratio of compressions to ventilations when no advanced airway is present in adult 2-rescuer CPR?",
    o: ["15:2", "30:2", "Continuous compressions with ventilations every 6 seconds", "5:1"],
    a: 1,
    r: "Without an advanced airway, 2-rescuer adult CPR uses 30:2 ratio. Once an advanced airway is placed, compressions become continuous at 100-120/min with ventilations at 1 every 6 seconds (10/min) independently.",
    s: "Emergency Resuscitation - Compression Fundamentals"
  },
  {
    q: "What is the role of high-quality CPR in the overall resuscitation outcome?",
    o: ["It is helpful but not essential", "It is the foundation that determines survival and neurological outcome", "It is only important until the defibrillator arrives", "It has minimal impact compared to medications"],
    a: 1,
    r: "High-quality CPR is the single most important factor in resuscitation outcomes. It maintains vital organ perfusion, improves defibrillation success, and directly correlates with survival and favorable neurological outcomes.",
    s: "Emergency Resuscitation - Compression Fundamentals"
  },
  {
    q: "Which of the following are appropriate post-ROSC interventions across all populations? (Select all that apply)",
    o: ["Titrate oxygen to avoid hyperoxia", "Monitor and maintain blood pressure", "Consider targeted temperature management", "Immediately extubate the patient"],
    a: 0,
    t: "sata",
    ca: [0, 1, 2],
    r: "Post-ROSC care includes titrating oxygen (SpO2 94-99%), hemodynamic support, TTM consideration, and identifying the cause of arrest. Premature extubation is dangerous; patients typically remain intubated and are assessed for neurologic function.",
    s: "Emergency Resuscitation - Post-Arrest Care"
  },
  {
    q: "Closed-loop communication during resuscitation involves:",
    o: ["The team leader giving orders without confirmation", "The receiver repeating back the order and the sender confirming", "Writing all orders on a whiteboard", "Only communicating through written notes"],
    a: 1,
    r: "Closed-loop communication involves three steps: the sender gives a clear message, the receiver repeats it back, and the sender confirms accuracy. This reduces errors and ensures team alignment during high-stress resuscitations.",
    s: "Emergency Resuscitation - Team Dynamics"
  },
  {
    q: "Place the links of the in-hospital chain of survival in the correct order.",
    o: ["Surveillance and prevention", "Recognition and activation of emergency response", "High-quality CPR and defibrillation", "Advanced resuscitation, post-arrest care, and recovery"],
    a: 0,
    t: "ordered",
    co: [0, 1, 2, 3],
    r: "The in-hospital chain of survival: surveillance and prevention of deterioration → early recognition and rapid response activation → immediate high-quality CPR and defibrillation → advanced resuscitation → post-arrest care → recovery.",
    s: "Emergency Resuscitation - Chain of Survival"
  }
];
