import { OSCESkillStation } from "./osce-skills-data";

export const osceSkillStations3: OSCESkillStation[] = [
  {
    id: "primary-survey-abcde",
    title: "Primary Survey ABCDE Assessment",
    category: "Core Skills",
    difficulty: "Advanced",
    icon: "Shield",
    description: "Perform a systematic primary survey using the ABCDE approach to rapidly identify and manage life-threatening conditions in an acutely unwell patient.",
    scenarioIntro: "You are a nurse on a medical unit when the healthcare assistant calls you urgently. A 68-year-old patient who was admitted for elective knee replacement has become acutely unwell. The patient is slumped in bed, appears pale and diaphoretic. You need to perform an immediate primary survey.",
    equipment: [
      "Stethoscope",
      "Blood pressure cuff",
      "Pulse oximeter",
      "Oxygen delivery devices (nasal cannula, non-rebreather mask)",
      "Suction equipment",
      "Bag-valve-mask",
      "IV access equipment",
      "Cardiac monitor",
      "Penlight",
      "Thermometer",
      "Emergency call bell/phone",
      "Documentation tools"
    ],
    steps: [
      { id: "ps-1", instruction: "Ensure scene safety and don appropriate PPE.", rationale: "Personal safety must always come first. PPE prevents exposure to bodily fluids during emergency assessment.", criticalStep: true },
      { id: "ps-2", instruction: "Call for help and request the emergency trolley/crash cart.", rationale: "Early activation of the emergency response team ensures backup is available if the patient deteriorates further.", criticalStep: true },
      { id: "ps-3", instruction: "Assess Airway: look in the mouth for obstruction, listen for stridor or gurgling, and assess whether the patient can speak.", rationale: "Airway obstruction is the most rapidly fatal emergency. A patient who can speak clearly has a patent airway.", criticalStep: true },
      { id: "ps-4", instruction: "If airway is compromised, perform head-tilt chin-lift (or jaw thrust if spinal injury suspected) and suction if needed.", rationale: "Opening the airway is the first intervention priority. Jaw thrust protects the cervical spine in trauma patients.", criticalStep: true },
      { id: "ps-5", instruction: "Assess Breathing: respiratory rate, depth, pattern, oxygen saturation, chest expansion symmetry, and auscultate lung fields.", rationale: "Breathing assessment identifies conditions requiring immediate intervention such as tension pneumothorax, severe asthma, or pulmonary edema.", criticalStep: true },
      { id: "ps-6", instruction: "Administer high-flow oxygen if SpO2 is below 94% or the patient is in respiratory distress.", rationale: "Hypoxia causes rapid organ damage. High-flow oxygen via non-rebreather mask delivers 60-90% FiO2.", criticalStep: true },
      { id: "ps-7", instruction: "Assess Circulation: heart rate, blood pressure, capillary refill time, skin color and temperature, and check for signs of hemorrhage.", rationale: "Circulatory assessment identifies shock states. Tachycardia is often the earliest sign of hypovolemia.", criticalStep: true },
      { id: "ps-8", instruction: "Establish IV access with a large-bore cannula (16G or 18G) and initiate fluid resuscitation if indicated.", rationale: "IV access is essential for fluid and medication administration. Large-bore cannulas allow rapid fluid infusion.", criticalStep: true },
      { id: "ps-9", instruction: "Assess Disability: level of consciousness using AVPU (Alert, Voice, Pain, Unresponsive) or GCS, pupil size and reactivity, blood glucose.", rationale: "Altered consciousness may indicate hypoglycemia, stroke, head injury, or drug toxicity. Blood glucose is a rapidly reversible cause.", criticalStep: true },
      { id: "ps-10", instruction: "Assess Exposure: expose the patient to perform a brief head-to-toe inspection for rashes, wounds, or other signs, then cover to prevent hypothermia.", rationale: "Full exposure may reveal hidden bleeding, rashes (meningococcal), or injuries. Hypothermia worsens coagulopathy and outcomes.", criticalStep: false },
      { id: "ps-11", instruction: "Reassess ABCDE after each intervention and communicate findings using SBAR to the medical team.", rationale: "Continuous reassessment detects improvement or deterioration. SBAR provides a structured handoff framework.", criticalStep: true },
      { id: "ps-12", instruction: "Document all findings, interventions, and the patient's response to treatment.", rationale: "Accurate documentation provides a legal record and supports continuity of care.", criticalStep: false }
    ],
    commonErrors: [
      "Skipping directly to circulation assessment without clearing the airway first",
      "Failing to call for help early",
      "Not checking blood glucose as part of disability assessment",
      "Forgetting to reassess after interventions",
      "Not exposing the patient fully during the exposure step",
      "Using AVPU incorrectly or not documenting a GCS score",
      "Failing to administer oxygen when SpO2 is below 94%"
    ],
    passingCriteria: "All critical steps must be performed in ABCDE sequence. Candidate must demonstrate systematic progression through each component and call for help early.",
    clinicalPearls: [
      "ABCDE is always performed in order. Never skip ahead; fix problems as you find them before moving on.",
      "A patient who can speak in full sentences has a patent airway and adequate breathing for the moment.",
      "Tachycardia is often the first sign of shock and may precede hypotension by hours.",
      "Always check blood glucose in any patient with altered consciousness — hypoglycemia is immediately treatable.",
      "SBAR: Situation, Background, Assessment, Recommendation — use this every time you call a provider."
    ],
    examLevel: "RN/RPN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are a nurse on a medical ward. A patient has become acutely unwell. Perform a primary survey using the ABCDE approach, managing any life-threatening problems as you find them. Verbalize your findings and actions throughout.",
    patientActorScript: "You are a 68-year-old patient. You are drowsy and confused. You can mumble short responses. You are diaphoretic and pale. When asked about pain, you point to your chest. Your breathing is rapid and shallow.",
    examinerChecklist: [
      { action: "Ensures scene safety and dons PPE", marks: 1 },
      { action: "Calls for help immediately", marks: 2 },
      { action: "Assesses airway patency correctly", marks: 2 },
      { action: "Manages airway if compromised", marks: 2 },
      { action: "Assesses breathing systematically", marks: 2 },
      { action: "Administers oxygen appropriately", marks: 2 },
      { action: "Assesses circulation including capillary refill", marks: 2 },
      { action: "Establishes IV access", marks: 2 },
      { action: "Assesses disability including AVPU/GCS and glucose", marks: 2 },
      { action: "Performs exposure assessment", marks: 1 },
      { action: "Reassesses after interventions", marks: 2 },
      { action: "Communicates using SBAR", marks: 2 }
    ],
    criticalFailCriteria: [
      "Fails to call for help",
      "Does not follow ABCDE sequence",
      "Fails to manage airway obstruction",
      "Does not administer oxygen to hypoxic patient",
      "Fails to check blood glucose in altered consciousness"
    ],
    examinerQuestions: [
      { question: "What does AVPU stand for?", answer: "Alert, Voice, Pain, Unresponsive — a rapid assessment tool for level of consciousness." },
      { question: "When would you use a jaw thrust instead of head-tilt chin-lift?", answer: "When cervical spine injury is suspected, as jaw thrust maintains neutral spine alignment." },
      { question: "What is Cushing's triad and what does it indicate?", answer: "Hypertension, bradycardia, and irregular respirations — it indicates raised intracranial pressure and is a late, ominous sign." }
    ],
    teachingPoints: [
      "The ABCDE approach is the universal framework for assessing acutely unwell patients in any setting.",
      "Always treat life-threatening problems at each stage before moving to the next letter.",
      "Early recognition and escalation saves lives — the first 'golden hour' is critical.",
      "Blood glucose should be checked as part of every disability assessment — it is the most common reversible cause of altered consciousness.",
      "Document the time of each assessment and intervention for accurate clinical records."
    ]
  },
  {
    id: "pain-assessment",
    title: "Pain Assessment",
    category: "Core Skills",
    difficulty: "Beginner",
    icon: "Thermometer",
    description: "Perform a comprehensive pain assessment using validated tools including numeric rating scale, Wong-Baker FACES scale, and PQRSTU mnemonic.",
    scenarioIntro: "You are a nurse on a surgical unit caring for a 45-year-old patient who is 12 hours post-laparoscopic cholecystectomy. The patient presses the call bell and reports pain. You need to perform a thorough pain assessment before administering any analgesics.",
    equipment: [
      "Numeric Rating Scale (0-10) visual aid",
      "Wong-Baker FACES Pain Rating Scale",
      "FLACC scale (for non-verbal patients)",
      "Vital signs equipment",
      "Documentation tools",
      "Medication administration record"
    ],
    steps: [
      { id: "pa-1", instruction: "Perform hand hygiene, identify the patient using two identifiers, and introduce yourself.", rationale: "Standard patient safety and infection prevention measures.", criticalStep: true },
      { id: "pa-2", instruction: "Ask the patient to describe their pain in their own words.", rationale: "Open-ended questions allow the patient to express their experience without leading them toward a particular response.", criticalStep: false },
      { id: "pa-3", instruction: "Use the PQRSTU mnemonic to systematically assess pain characteristics.", rationale: "PQRSTU ensures a comprehensive assessment: Provocation/Palliation, Quality, Region/Radiation, Severity, Timing, Understanding.", criticalStep: true },
      { id: "pa-4", instruction: "Assess Provocation/Palliation: 'What makes the pain better or worse?'", rationale: "Identifies aggravating and alleviating factors to guide treatment and activity modifications.", criticalStep: false },
      { id: "pa-5", instruction: "Assess Quality: 'Can you describe the pain? Is it sharp, dull, burning, throbbing, or aching?'", rationale: "Pain quality helps differentiate between types: sharp/stabbing suggests somatic pain; burning suggests neuropathic pain; cramping suggests visceral pain.", criticalStep: false },
      { id: "pa-6", instruction: "Assess Region and Radiation: 'Where exactly is the pain? Does it spread anywhere else?'", rationale: "Location and radiation pattern help identify the source. Epigastric pain radiating to the back may indicate pancreatitis.", criticalStep: false },
      { id: "pa-7", instruction: "Assess Severity using the Numeric Rating Scale (0-10).", rationale: "The NRS provides a standardized, objective measure that can be tracked over time to evaluate treatment effectiveness.", criticalStep: true },
      { id: "pa-8", instruction: "Assess Timing: 'When did the pain start? Is it constant or intermittent? Has it changed?'", rationale: "Timing patterns help differentiate acute from chronic pain and may indicate complications such as post-operative bleeding.", criticalStep: false },
      { id: "pa-9", instruction: "Assess Understanding: 'What do you think is causing the pain? What is your pain goal?'", rationale: "Understanding the patient's perception and expectations guides realistic goal-setting and patient-centered care.", criticalStep: false },
      { id: "pa-10", instruction: "Obtain vital signs including heart rate, blood pressure, and respiratory rate.", rationale: "Pain can cause sympathetic responses: tachycardia, hypertension, and tachypnea. These may be the only indicators in non-verbal patients.", criticalStep: true },
      { id: "pa-11", instruction: "Observe for non-verbal pain indicators: facial grimacing, guarding, restlessness, diaphoresis, and changes in behavior.", rationale: "Non-verbal cues are essential for patients who cannot self-report, such as those with cognitive impairment or on ventilators.", criticalStep: true },
      { id: "pa-12", instruction: "Select and apply the appropriate pain scale based on the patient's cognitive and communication abilities.", rationale: "NRS for cognitively intact adults, FACES for children or language barriers, FLACC for non-verbal patients. Using the wrong scale produces unreliable data.", criticalStep: true },
      { id: "pa-13", instruction: "Ask about current pain medications, effectiveness, and any side effects.", rationale: "Determines whether current analgesic regimen is adequate and identifies potential adverse effects.", criticalStep: false },
      { id: "pa-14", instruction: "Document all pain assessment findings and develop a pain management plan with the patient.", rationale: "Documentation ensures continuity and enables comparison for reassessment. Patient involvement improves adherence.", criticalStep: true },
      { id: "pa-15", instruction: "Reassess pain within 30-60 minutes after pharmacological intervention or 15-30 minutes after IV analgesic.", rationale: "Reassessment evaluates treatment effectiveness and guides further interventions. IV medications have faster onset.", criticalStep: true }
    ],
    commonErrors: [
      "Accepting a pain score without asking about characteristics (using NRS alone)",
      "Not reassessing pain after administering analgesics",
      "Using an age-inappropriate or cognitively inappropriate pain scale",
      "Ignoring non-verbal pain cues when the patient reports low pain scores",
      "Failing to ask about the patient's pain management goals",
      "Not documenting the complete PQRSTU assessment"
    ],
    passingCriteria: "Candidate must perform a complete PQRSTU assessment, use an appropriate validated pain scale, assess non-verbal indicators, and state the importance of reassessment after intervention.",
    clinicalPearls: [
      "Pain is whatever the patient says it is. The patient's self-report is the gold standard.",
      "Vital signs may be normal even with severe pain, especially in chronic pain patients.",
      "Always reassess pain 30-60 minutes after oral medication and 15-30 minutes after IV medication.",
      "Non-verbal patients can still experience significant pain — use behavioral scales like FLACC or CPOT.",
      "Multimodal analgesia (combining different classes of analgesics) provides better pain relief with fewer side effects."
    ],
    examLevel: "RPN/RN",
    timeLimit: "10 minutes",
    candidateInstructions: "A post-operative patient is reporting pain. Perform a comprehensive pain assessment using the PQRSTU mnemonic and an appropriate pain rating scale. Verbalize your findings and plan.",
    patientActorScript: "You are a 45-year-old patient, 12 hours after gallbladder surgery. Your pain is in the right upper abdomen, sharp and stabbing, worse with deep breathing and coughing. Rate it 7/10. It started about 2 hours ago and has been getting worse. Your last pain medication was 4 hours ago and only helped a little.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 1 },
      { action: "Uses open-ended question to initiate assessment", marks: 1 },
      { action: "Assesses Provocation/Palliation", marks: 1 },
      { action: "Assesses Quality of pain", marks: 1 },
      { action: "Assesses Region and Radiation", marks: 1 },
      { action: "Assesses Severity with NRS", marks: 2 },
      { action: "Assesses Timing", marks: 1 },
      { action: "Assesses Understanding/goals", marks: 1 },
      { action: "Obtains vital signs", marks: 1 },
      { action: "Observes non-verbal pain indicators", marks: 2 },
      { action: "Selects appropriate pain scale", marks: 1 },
      { action: "Documents findings", marks: 1 },
      { action: "States plan for reassessment", marks: 2 }
    ],
    criticalFailCriteria: [
      "Does not use a validated pain assessment tool",
      "Fails to assess pain severity",
      "Does not mention reassessment after intervention",
      "Dismisses or minimizes patient's reported pain"
    ],
    examinerQuestions: [
      { question: "What pain scale would you use for a 4-year-old child?", answer: "The Wong-Baker FACES Pain Rating Scale, as young children can point to faces representing their pain level." },
      { question: "What is the difference between acute and chronic pain?", answer: "Acute pain has a sudden onset and identifiable cause, usually lasting less than 3-6 months. Chronic pain persists beyond normal healing time, often with no identifiable cause." },
      { question: "Name three non-pharmacological pain management strategies.", answer: "Positioning, ice/heat therapy, distraction techniques, guided imagery, deep breathing exercises, massage, and music therapy." }
    ],
    teachingPoints: [
      "Pain is the 'fifth vital sign' and should be assessed with every set of vital signs.",
      "The PQRSTU mnemonic provides a complete framework that prevents omissions in pain assessment.",
      "Always document pain using the same scale to allow meaningful comparison over time.",
      "Cultural factors influence pain expression — some cultures value stoicism, which may lead to underreporting.",
      "Opioid-tolerant patients may require higher doses for adequate pain relief; this is tolerance, not addiction."
    ]
  },
  {
    id: "vital-signs-interpretation",
    title: "Vital Signs Measurement & Interpretation",
    category: "Core Skills",
    difficulty: "Beginner",
    icon: "Activity",
    description: "Accurately measure and interpret a complete set of vital signs including temperature, pulse, respirations, blood pressure, oxygen saturation, and pain, recognizing abnormal values and appropriate nursing actions.",
    scenarioIntro: "You are a nurse beginning your shift on a medical unit. You are assigned a 70-year-old patient admitted with community-acquired pneumonia. You need to perform a complete set of vital signs and interpret the findings to guide your clinical decisions.",
    equipment: [
      "Digital thermometer",
      "Stethoscope",
      "Sphygmomanometer (manual or automatic)",
      "Appropriate-sized blood pressure cuff",
      "Pulse oximeter",
      "Watch with second hand",
      "Pain assessment scale",
      "Documentation tools"
    ],
    steps: [
      { id: "vs-1", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and ensures efficiency by having all equipment ready.", criticalStep: true },
      { id: "vs-2", instruction: "Identify the patient using two identifiers and explain the procedure.", rationale: "Patient safety standard; explaining reduces anxiety which can affect vital sign readings.", criticalStep: true },
      { id: "vs-3", instruction: "Ensure the patient has been resting for at least 5 minutes and is in a comfortable position.", rationale: "Activity, anxiety, and positioning can significantly alter vital sign readings, producing inaccurate baseline data.", criticalStep: false },
      { id: "vs-4", instruction: "Measure temperature using the appropriate route (oral, tympanic, temporal, axillary, or rectal).", rationale: "Route selection depends on patient condition. Oral: 36.5-37.5°C; rectal is 0.5°C higher; axillary is 0.5°C lower.", criticalStep: true },
      { id: "vs-5", instruction: "Assess radial pulse for rate, rhythm, and quality for 30 seconds (or 60 seconds if irregular).", rationale: "Irregular pulses must be counted for a full 60 seconds for accuracy. Quality assessment detects weak or bounding pulses.", criticalStep: true },
      { id: "vs-6", instruction: "If the pulse is irregular, perform an apical pulse assessment for a full 60 seconds.", rationale: "Apical pulse is the most accurate measurement of heart rate. The apical-radial pulse deficit indicates ineffective cardiac contractions.", criticalStep: true },
      { id: "vs-7", instruction: "Count respirations for 30 seconds (or 60 seconds if irregular) without informing the patient.", rationale: "Awareness of being observed changes breathing patterns. Note rate, depth, rhythm, and effort.", criticalStep: true },
      { id: "vs-8", instruction: "Select the correct blood pressure cuff size: the bladder should cover 80% of the arm circumference.", rationale: "A cuff too small gives falsely high readings; a cuff too large gives falsely low readings.", criticalStep: true },
      { id: "vs-9", instruction: "Measure blood pressure with the arm at heart level, supported, with the cuff over the brachial artery.", rationale: "Arm position affects readings: below heart level reads high, above heart level reads low. The brachial artery is the standard site.", criticalStep: true },
      { id: "vs-10", instruction: "Apply pulse oximeter to a warm, well-perfused finger and record SpO2.", rationale: "Cold extremities, nail polish, and poor perfusion give inaccurate readings. Normal SpO2 is 94-100% on room air.", criticalStep: true },
      { id: "vs-11", instruction: "Assess pain using an appropriate validated scale.", rationale: "Pain is the fifth vital sign. Assessment guides analgesic administration and monitors treatment effectiveness.", criticalStep: true },
      { id: "vs-12", instruction: "Interpret all vital signs against normal ranges and the patient's baseline.", rationale: "Comparison against both normal ranges and the patient's own baseline identifies clinically significant trends.", criticalStep: true },
      { id: "vs-13", instruction: "Identify any abnormal findings and determine the appropriate nursing action.", rationale: "Critical values require immediate notification. Trending data guides clinical decision-making.", criticalStep: true },
      { id: "vs-14", instruction: "Document all vital signs accurately with the time, route, and any relevant observations.", rationale: "Accurate documentation with context ensures proper interpretation by all members of the healthcare team.", criticalStep: true }
    ],
    commonErrors: [
      "Using an incorrect blood pressure cuff size",
      "Not counting an irregular pulse for a full 60 seconds",
      "Telling the patient you are counting respirations",
      "Measuring blood pressure with the arm unsupported or below heart level",
      "Not removing nail polish or warming fingers before pulse oximetry",
      "Failing to compare current vital signs to the patient's baseline",
      "Not recognizing or acting on critical values"
    ],
    passingCriteria: "Candidate must accurately measure all six vital signs using correct technique, identify abnormal values, and verbalize appropriate nursing actions for any critical findings.",
    clinicalPearls: [
      "Always compare vital signs to the patient's own baseline, not just normal ranges. A blood pressure of 100/60 may be normal for one patient but hypotensive for another.",
      "The pulse oximeter reads SpO2, not PaO2. It can be falsely normal in carbon monoxide poisoning.",
      "Orthostatic vital signs: a drop in systolic BP of 20 mmHg or diastolic of 10 mmHg upon standing suggests hypovolemia.",
      "In atrial fibrillation, the apical rate is always higher than the radial rate due to pulse deficit.",
      "Hypothermia is defined as core temperature below 35°C and can cause bradycardia, coagulopathy, and cardiac arrest."
    ],
    examLevel: "RPN/RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Perform a complete set of vital signs on this patient admitted with pneumonia. Measure, interpret, and verbalize your findings, including any abnormal values and the nursing actions you would take.",
    patientActorScript: "You are a 70-year-old patient with pneumonia. You are slightly short of breath but able to speak in full sentences. You have a mild cough. When asked about pain, report a 3/10 headache. You feel warm to the touch.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 1 },
      { action: "Measures temperature correctly", marks: 1 },
      { action: "Assesses pulse for rate, rhythm, and quality", marks: 2 },
      { action: "Counts respirations correctly without alerting patient", marks: 2 },
      { action: "Selects correct BP cuff size", marks: 1 },
      { action: "Measures BP with correct technique", marks: 2 },
      { action: "Applies pulse oximeter correctly", marks: 1 },
      { action: "Assesses pain with validated scale", marks: 1 },
      { action: "Correctly interprets findings against normal ranges", marks: 2 },
      { action: "Identifies appropriate nursing actions for abnormals", marks: 2 },
      { action: "Documents findings accurately", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to measure blood pressure or pulse",
      "Uses grossly incorrect technique for any measurement",
      "Does not recognize critical vital sign values",
      "Fails to identify patient correctly"
    ],
    examinerQuestions: [
      { question: "What is a pulse deficit and what does it indicate?", answer: "The difference between the apical and radial pulse rates. It indicates that some cardiac contractions are too weak to produce a palpable peripheral pulse, commonly seen in atrial fibrillation." },
      { question: "Why might a pulse oximeter reading be inaccurate?", answer: "Causes include poor peripheral perfusion, hypothermia, dark nail polish, motion artifact, carbon monoxide poisoning, and severe anemia." },
      { question: "What are the normal adult vital sign ranges?", answer: "Temperature: 36.5-37.5°C, Heart rate: 60-100 bpm, Respirations: 12-20/min, BP: <120/80 mmHg (normal), SpO2: 94-100%." }
    ],
    teachingPoints: [
      "Vital signs are the foundation of all nursing assessment — they should never be delegated without clear parameters for reporting abnormalities.",
      "Trending is more valuable than a single set of vital signs. Always look at the pattern over time.",
      "The Modified Early Warning Score (MEWS) or National Early Warning Score (NEWS) use vital signs to predict deterioration.",
      "Blood pressure should be measured in both arms at least once to identify discrepancies that may indicate vascular disease.",
      "Respiratory rate is the most sensitive predictor of clinical deterioration and is the most frequently omitted vital sign."
    ]
  },
  {
    id: "oxygen-therapy",
    title: "Oxygen Therapy Initiation",
    category: "Core Skills",
    difficulty: "Intermediate",
    icon: "Wind",
    description: "Select and apply the appropriate oxygen delivery device, titrate oxygen flow rate to target saturation, and monitor the patient's response to oxygen therapy.",
    scenarioIntro: "You are a nurse on a respiratory unit. A 65-year-old patient with community-acquired pneumonia has a SpO2 of 88% on room air. The physician has ordered supplemental oxygen to maintain SpO2 at 94-98%. You need to initiate oxygen therapy.",
    equipment: [
      "Oxygen source (wall outlet or portable tank)",
      "Flow meter",
      "Nasal cannula",
      "Simple face mask",
      "Non-rebreather mask with reservoir bag",
      "Venturi mask with color-coded adaptors",
      "Humidification bottle (for flows >4 L/min)",
      "Pulse oximeter",
      "Stethoscope",
      "Oxygen tubing",
      "No Smoking signs",
      "Documentation tools"
    ],
    steps: [
      { id: "ot-1", instruction: "Perform hand hygiene, identify the patient using two identifiers, and verify the oxygen order.", rationale: "Patient safety and ensuring the correct therapy is administered as prescribed.", criticalStep: true },
      { id: "ot-2", instruction: "Explain the procedure and the importance of oxygen therapy to the patient.", rationale: "Patient education promotes compliance. Inform the patient not to adjust or remove the device without calling the nurse.", criticalStep: false },
      { id: "ot-3", instruction: "Assess the patient's respiratory status: rate, depth, pattern, SpO2, breath sounds, and work of breathing.", rationale: "Baseline assessment guides device selection and provides comparison data for evaluating effectiveness.", criticalStep: true },
      { id: "ot-4", instruction: "Check if the patient has COPD or other conditions requiring controlled oxygen therapy.", rationale: "COPD patients may have a hypoxic drive. Target SpO2 is typically 88-92% in COPD to avoid suppressing respiratory drive.", criticalStep: true },
      { id: "ot-5", instruction: "Select the appropriate oxygen delivery device based on the patient's oxygen requirements.", rationale: "Nasal cannula: 1-6 L/min (24-44% FiO2); simple mask: 5-10 L/min (40-60%); non-rebreather: 10-15 L/min (60-90%); Venturi: precise FiO2.", criticalStep: true },
      { id: "ot-6", instruction: "Connect the oxygen tubing to the flow meter and set the prescribed flow rate.", rationale: "Ensure a tight connection to prevent oxygen leaks. Turn on the flow before placing the device on the patient.", criticalStep: true },
      { id: "ot-7", instruction: "Add humidification for oxygen flow rates greater than 4 L/min.", rationale: "High-flow dry oxygen dries the mucous membranes and can cause nosebleeds, sore throat, and discomfort.", criticalStep: false },
      { id: "ot-8", instruction: "If using a non-rebreather mask, inflate the reservoir bag fully before placing it on the patient.", rationale: "The reservoir must be inflated to prevent the patient from breathing in room air. The bag should never fully deflate during inspiration.", criticalStep: true },
      { id: "ot-9", instruction: "Apply the oxygen delivery device securely and comfortably on the patient.", rationale: "Proper fit ensures effective oxygen delivery. Check for skin irritation behind the ears and over the nasal bridge.", criticalStep: false },
      { id: "ot-10", instruction: "Reassess SpO2, respiratory rate, and work of breathing within 5-10 minutes of initiating therapy.", rationale: "Early reassessment confirms the therapy is effective and the target saturation is being achieved.", criticalStep: true },
      { id: "ot-11", instruction: "Post 'No Smoking' and 'Oxygen in Use' signs in the patient's room.", rationale: "Oxygen supports combustion. Fire safety is a critical concern when oxygen therapy is in use.", criticalStep: true },
      { id: "ot-12", instruction: "Educate the patient about fire safety precautions and not to adjust the flow rate.", rationale: "Patients and visitors must understand that smoking, open flames, and electrical equipment can cause fire in oxygen-enriched environments.", criticalStep: false },
      { id: "ot-13", instruction: "Document the oxygen device, flow rate, patient's response, and SpO2 readings.", rationale: "Documentation provides a record of therapy initiation and effectiveness for the healthcare team.", criticalStep: true }
    ],
    commonErrors: [
      "Failing to check for COPD before initiating high-flow oxygen",
      "Not inflating the non-rebreather reservoir bag before application",
      "Setting a flow rate below 5 L/min on a simple face mask (causes CO2 rebreathing)",
      "Forgetting to add humidification for flows above 4 L/min",
      "Not posting fire safety signs",
      "Not reassessing the patient after initiating oxygen therapy",
      "Selecting the wrong device for the patient's oxygen needs"
    ],
    passingCriteria: "Candidate must correctly assess the patient, select an appropriate device, apply it safely, state the target SpO2, and mention fire safety precautions.",
    clinicalPearls: [
      "Never set a simple face mask below 5 L/min — this causes CO2 rebreathing within the mask.",
      "In COPD patients, target SpO2 is 88-92%. Over-oxygenation can suppress their hypoxic respiratory drive.",
      "The non-rebreather reservoir bag should never fully deflate during inspiration — if it does, increase the flow rate.",
      "Venturi masks deliver the most precise FiO2 and are ideal for COPD patients who need controlled oxygen therapy.",
      "Oxygen is a medication — it requires a prescription and must be titrated to a target saturation."
    ],
    examLevel: "RPN/RN",
    timeLimit: "10 minutes",
    candidateInstructions: "A patient with pneumonia has a SpO2 of 88% on room air. Initiate oxygen therapy to achieve a target SpO2 of 94-98%. Select the appropriate device, apply it, and manage the therapy safely.",
    patientActorScript: "You are a 65-year-old patient with pneumonia. You are short of breath and anxious. You do not have COPD. You are cooperative but keep asking if you can take the oxygen off because it is uncomfortable.",
    examinerChecklist: [
      { action: "Verifies oxygen order", marks: 1 },
      { action: "Assesses baseline respiratory status", marks: 2 },
      { action: "Checks for COPD/hypoxic drive", marks: 2 },
      { action: "Selects appropriate oxygen device", marks: 2 },
      { action: "Sets correct flow rate", marks: 2 },
      { action: "Adds humidification if needed", marks: 1 },
      { action: "Inflates non-rebreather bag before application (if used)", marks: 2 },
      { action: "Reassesses SpO2 after initiation", marks: 2 },
      { action: "Posts fire safety signs", marks: 1 },
      { action: "Documents therapy", marks: 1 }
    ],
    criticalFailCriteria: [
      "Applies high-flow oxygen to a known COPD patient without adjusting target",
      "Does not inflate non-rebreather reservoir before application",
      "Sets simple face mask below 5 L/min",
      "Fails to reassess patient after initiating oxygen",
      "Does not mention fire safety"
    ],
    examinerQuestions: [
      { question: "What FiO2 does a nasal cannula deliver at 2 L/min?", answer: "Approximately 28%. Each liter of nasal cannula adds roughly 4% to room air (21%)." },
      { question: "Why is controlled oxygen important in COPD?", answer: "COPD patients may rely on hypoxic drive for respiration. Excessive oxygen can suppress this drive, leading to hypoventilation and CO2 retention." },
      { question: "What is the minimum flow rate for a simple face mask and why?", answer: "5 L/min. Below this, exhaled CO2 accumulates in the mask and is rebreathed, potentially causing hypercapnia." }
    ],
    teachingPoints: [
      "Oxygen is a drug — it requires a prescription, has a dose (flow rate/FiO2), and has potential side effects.",
      "Nasal cannula is most comfortable for long-term use but only delivers low-to-moderate concentrations.",
      "High-flow nasal cannula (HFNC) systems can deliver up to 60 L/min with precise FiO2 and provide some PEEP.",
      "Always verify there are no combustible materials near the oxygen source — this includes alcohol-based hand sanitizer.",
      "Pulse oximetry has limitations: it does not detect hypercarbia and can be falsely normal in CO poisoning."
    ]
  },
  {
    id: "medication-administration-safety",
    title: "Medication Administration Safety",
    category: "Core Skills",
    difficulty: "Intermediate",
    icon: "Pill",
    description: "Demonstrate safe medication administration following the '10 Rights' of medication safety, including patient assessment, drug verification, and post-administration monitoring.",
    scenarioIntro: "You are a nurse preparing to administer scheduled medications to a 72-year-old patient on a medical unit. The patient has multiple medications ordered including an antihypertensive, an anticoagulant, and an antibiotic. You need to demonstrate safe medication administration practices.",
    equipment: [
      "Medication Administration Record (MAR)",
      "Medications as prescribed",
      "Medication scanner/barcode system",
      "Medication cups",
      "Water and straw",
      "Gloves",
      "Blood pressure cuff",
      "Stethoscope",
      "Medication reference guide",
      "Documentation tools"
    ],
    steps: [
      { id: "mas-1", instruction: "Review the Medication Administration Record (MAR) and verify all orders.", rationale: "Ensures current, valid orders are being followed. Check for new orders, discontinued medications, and PRN parameters.", criticalStep: true },
      { id: "mas-2", instruction: "Review patient allergies and verify they are documented on the MAR and patient wristband.", rationale: "Allergy verification prevents potentially fatal allergic reactions or anaphylaxis.", criticalStep: true },
      { id: "mas-3", instruction: "Review each medication: indication, dose, route, expected effects, and potential side effects.", rationale: "Nurses must understand every medication they administer. This is a legal and professional responsibility.", criticalStep: true },
      { id: "mas-4", instruction: "Check for potential drug-drug interactions and food-drug interactions.", rationale: "Some medications interact dangerously. Example: warfarin and NSAIDs increase bleeding risk.", criticalStep: true },
      { id: "mas-5", instruction: "Perform the first medication check: compare the medication label against the MAR at the medication dispensing system.", rationale: "The first of three checks ensures the correct medication is being retrieved from the dispensing system.", criticalStep: true },
      { id: "mas-6", instruction: "Perform the second medication check: verify the medication label when preparing/pouring the medication.", rationale: "The second check catches errors during preparation, such as similar-sounding medication names (look-alike/sound-alike drugs).", criticalStep: true },
      { id: "mas-7", instruction: "Perform the third medication check: verify the medication label at the bedside before administration.", rationale: "The final check is the last opportunity to catch an error before the medication reaches the patient.", criticalStep: true },
      { id: "mas-8", instruction: "Perform hand hygiene and identify the patient using two identifiers (name and date of birth).", rationale: "Two-identifier verification prevents wrong-patient errors, one of the most dangerous medication errors.", criticalStep: true },
      { id: "mas-9", instruction: "Scan the patient's wristband and each medication barcode if barcode verification is available.", rationale: "Barcode medication administration (BCMA) provides an electronic safety check matching patient, medication, dose, and time.", criticalStep: false },
      { id: "mas-10", instruction: "Perform any required pre-administration assessments: blood pressure for antihypertensives, heart rate for cardiac medications, lab values for anticoagulants.", rationale: "Assessment parameters determine whether it is safe to administer. Example: hold metoprolol if HR <60 or SBP <100.", criticalStep: true },
      { id: "mas-11", instruction: "Explain each medication to the patient: name, purpose, expected effects, and potential side effects.", rationale: "Patient education supports adherence, enables the patient to report adverse effects, and respects their right to informed consent.", criticalStep: true },
      { id: "mas-12", instruction: "Administer each medication by the correct route, ensuring proper technique.", rationale: "Wrong-route errors can be fatal. Example: an oral medication given intravenously can cause embolism.", criticalStep: true },
      { id: "mas-13", instruction: "Stay with the patient until all oral medications are swallowed.", rationale: "Ensures the patient actually takes the medication and does not 'cheek' or spit out pills.", criticalStep: true },
      { id: "mas-14", instruction: "Document medication administration immediately, including time, dose, route, and site if applicable.", rationale: "Immediate documentation prevents duplicate dosing and provides an accurate medication record.", criticalStep: true },
      { id: "mas-15", instruction: "Monitor the patient for expected therapeutic effects and adverse reactions after administration.", rationale: "Post-administration monitoring detects adverse effects early and confirms therapeutic response.", criticalStep: true }
    ],
    commonErrors: [
      "Skipping the three-check process or performing checks casually",
      "Not verifying patient allergies before administration",
      "Administering antihypertensives without checking blood pressure first",
      "Pre-pouring medications and leaving them unlabeled at the bedside",
      "Not staying with the patient to verify oral medications are swallowed",
      "Documenting before administration ('pre-charting')",
      "Not checking for drug-drug interactions"
    ],
    passingCriteria: "Candidate must demonstrate the three medication checks, two-patient-identifier verification, pre-administration assessment, patient education, and post-administration documentation.",
    clinicalPearls: [
      "The 10 Rights: Right patient, drug, dose, route, time, documentation, reason, response, to refuse, education.",
      "High-alert medications (insulin, heparin, opioids, potassium chloride) require independent double-checks by two nurses.",
      "Never crush enteric-coated or sustained-release medications — this can cause dose dumping and toxicity.",
      "Look-alike/sound-alike drugs are a leading cause of medication errors. Examples: hydroxyzine vs. hydralazine, metformin vs. metoprolol.",
      "If a patient refuses medication, document the refusal, assess the reason, educate about consequences, and notify the provider."
    ],
    examLevel: "RPN/RN",
    timeLimit: "15 minutes",
    candidateInstructions: "You are preparing to administer scheduled medications to a patient on a medical unit. Demonstrate the complete medication administration process from order verification to post-administration monitoring. Verbalize your actions throughout.",
    patientActorScript: "You are a 72-year-old patient on a medical unit. You take multiple medications. When offered your medications, ask what each one is for. You have a documented allergy to penicillin. Your blood pressure today is 108/62 mmHg.",
    examinerChecklist: [
      { action: "Reviews MAR and verifies orders", marks: 1 },
      { action: "Checks patient allergies", marks: 2 },
      { action: "Reviews medications for indications and interactions", marks: 2 },
      { action: "Performs first medication check", marks: 1 },
      { action: "Performs second medication check", marks: 1 },
      { action: "Performs third medication check at bedside", marks: 1 },
      { action: "Identifies patient with two identifiers", marks: 2 },
      { action: "Performs pre-administration assessment", marks: 2 },
      { action: "Educates patient about medications", marks: 1 },
      { action: "Administers by correct route", marks: 1 },
      { action: "Observes patient swallowing oral meds", marks: 1 },
      { action: "Documents immediately after administration", marks: 1 },
      { action: "Monitors for therapeutic/adverse effects", marks: 1 }
    ],
    criticalFailCriteria: [
      "Administers medication without checking allergies",
      "Fails to identify patient with two identifiers",
      "Administers antihypertensive without checking blood pressure",
      "Skips the three-check process entirely",
      "Documents before administering (pre-charting)"
    ],
    examinerQuestions: [
      { question: "What would you do if the patient's blood pressure is 90/58 and they have an antihypertensive ordered?", answer: "Hold the medication, document the reason (hypotension), and notify the prescriber for further guidance." },
      { question: "Name three high-alert medications that require independent double-checks.", answer: "Insulin, heparin/anticoagulants, opioids, potassium chloride, chemotherapy agents, and neuromuscular blocking agents." },
      { question: "What is the difference between a side effect and an adverse drug reaction?", answer: "A side effect is a predictable, often tolerable pharmacological effect. An adverse drug reaction is an unexpected, harmful response that may require intervention or discontinuation." }
    ],
    teachingPoints: [
      "Medication errors are among the most common and preventable causes of patient harm in healthcare.",
      "The three-check system and two-identifier process are non-negotiable safety steps.",
      "Pre-charting (documenting before administration) is falsification of the medical record.",
      "If in doubt about any medication, always look it up before administering. Uncertainty is not acceptable.",
      "Patients have the right to refuse any medication — respect this right, document it, and notify the provider."
    ]
  },
  {
    id: "iv-insertion",
    title: "IV Insertion",
    category: "Procedure",
    difficulty: "Intermediate",
    icon: "Syringe",
    description: "Perform peripheral intravenous catheter insertion using aseptic technique, including vein selection, site preparation, catheter insertion, and securement.",
    scenarioIntro: "You are a nurse on a medical unit. A 55-year-old patient admitted with cellulitis requires IV antibiotic therapy. The physician has ordered a peripheral IV line. The patient has fair veins in the non-dominant forearm. You need to insert a peripheral IV catheter.",
    equipment: [
      "Appropriate-gauge IV catheter (18G or 20G)",
      "Tourniquet",
      "Antiseptic swabs (chlorhexidine or alcohol)",
      "Transparent semipermeable dressing (Tegaderm)",
      "IV extension tubing with needleless connector",
      "Normal saline flush (10 mL syringe)",
      "Clean gloves (non-sterile)",
      "Tape or securement device",
      "Sharps container",
      "Gauze pads",
      "Label with date, time, gauge, and initials",
      "Arm board (if needed)",
      "Documentation tools"
    ],
    steps: [
      { id: "ivi-1", instruction: "Verify the IV order and assess the patient for any contraindications (lymphedema, AV fistula, mastectomy side).", rationale: "Avoid IV placement on affected limbs. Mastectomy side increases lymphedema risk; AV fistula arms are reserved for dialysis.", criticalStep: true },
      { id: "ivi-2", instruction: "Perform hand hygiene, gather equipment, and introduce yourself to the patient.", rationale: "Infection prevention and ensures all materials are at the bedside before beginning.", criticalStep: true },
      { id: "ivi-3", instruction: "Explain the procedure to the patient and obtain verbal consent.", rationale: "Reduces anxiety and respects patient autonomy. Address any fears about needles.", criticalStep: false },
      { id: "ivi-4", instruction: "Select the appropriate catheter gauge based on therapy needs: 18G for blood/rapid fluids, 20G for most medications, 22G for fragile veins.", rationale: "The smallest gauge catheter that meets therapy needs reduces vein trauma and phlebitis risk.", criticalStep: true },
      { id: "ivi-5", instruction: "Apply the tourniquet 10-15 cm above the intended insertion site and assess veins by inspection and palpation.", rationale: "The tourniquet distends veins. Palpate for a bouncy, resilient vein. Avoid hard, cord-like veins (sclerosed) or veins over joints.", criticalStep: true },
      { id: "ivi-6", instruction: "Select an appropriate vein, starting distally in the non-dominant arm. Avoid areas of flexion, previous infiltration, and bruising.", rationale: "Distal-to-proximal selection preserves proximal veins for future access. Areas of flexion increase occlusion and dislodgement risk.", criticalStep: true },
      { id: "ivi-7", instruction: "Don clean gloves and cleanse the insertion site with chlorhexidine using a back-and-forth friction scrub for 30 seconds. Allow to dry completely.", rationale: "Chlorhexidine reduces bacterial colonization by 99%. The site must be completely dry (30-60 seconds) for maximum antimicrobial effect.", criticalStep: true },
      { id: "ivi-8", instruction: "Anchor the vein by applying traction below the insertion site with your non-dominant hand.", rationale: "Anchoring stabilizes the vein and prevents it from rolling during insertion.", criticalStep: true },
      { id: "ivi-9", instruction: "Insert the catheter bevel up at a 15-30 degree angle until a blood flashback is observed.", rationale: "Bevel up reduces trauma. A 15-30 degree angle allows proper vein entry. Blood flashback confirms intravascular placement.", criticalStep: true },
      { id: "ivi-10", instruction: "Lower the angle and advance the catheter 1-2 mm further, then advance the plastic catheter off the stylet while holding the stylet stationary.", rationale: "Advancing slightly ensures the catheter tip is fully in the vein lumen before threading. Never reinsert the stylet into the catheter.", criticalStep: true },
      { id: "ivi-11", instruction: "Release the tourniquet, apply pressure proximal to the catheter tip, and remove the stylet. Activate the safety mechanism.", rationale: "Releasing the tourniquet prevents excessive bleeding. Proximal pressure prevents blood spillage during stylet removal.", criticalStep: true },
      { id: "ivi-12", instruction: "Connect the extension tubing with flush and aspirate for blood return, then flush with 10 mL normal saline using a push-pause technique.", rationale: "Blood return confirms patency. Push-pause (turbulent) flushing clears the catheter more effectively than a steady push.", criticalStep: true },
      { id: "ivi-13", instruction: "Observe the site for signs of infiltration (swelling, coolness, pain) during the flush.", rationale: "Swelling or pain during flushing indicates the catheter is not in the vein (infiltration) and must be removed.", criticalStep: true },
      { id: "ivi-14", instruction: "Apply the transparent dressing over the insertion site and secure with a stabilization device.", rationale: "Transparent dressings allow visual monitoring without removal. Proper securement reduces dislodgement risk.", criticalStep: false },
      { id: "ivi-15", instruction: "Label the site with date, time, catheter gauge, and your initials.", rationale: "Labeling allows tracking of dwell time. Peripheral IVs should be assessed regularly and replaced per facility policy (typically 72-96 hours).", criticalStep: false },
      { id: "ivi-16", instruction: "Dispose of sharps immediately in the sharps container, remove gloves, and perform hand hygiene.", rationale: "Sharps must be disposed of immediately after use to prevent needlestick injuries. Never recap used needles.", criticalStep: true },
      { id: "ivi-17", instruction: "Document the procedure: site, gauge, number of attempts, blood return, flush tolerance, and patient response.", rationale: "Documentation provides a complete record and communicates catheter details to subsequent caregivers.", criticalStep: true }
    ],
    commonErrors: [
      "Reinserting the stylet into the catheter (risk of catheter shearing and embolism)",
      "Not allowing the antiseptic to dry before insertion",
      "Selecting veins over joints or on the affected limb",
      "Not releasing the tourniquet before flushing",
      "Failing to observe the site during the initial flush for infiltration",
      "Using a catheter gauge that is too large for the vein",
      "Not disposing of sharps immediately"
    ],
    passingCriteria: "Candidate must demonstrate proper vein selection, aseptic technique, correct insertion angle, blood return confirmation, saline flush with site observation, and sharps safety.",
    clinicalPearls: [
      "Never reinsert a stylet into a catheter — this can shear the catheter, creating an embolism.",
      "If the first attempt fails, use a new catheter and try a site proximal to the first attempt on the same vein, or a different vein.",
      "Maximum two attempts per nurse; after two failed attempts, have another nurse or an IV specialist attempt.",
      "A warm compress applied for 5-10 minutes before the procedure dilates veins and improves success rates.",
      "In dehydrated patients, consider a fluid bolus before IV insertion to improve vein distension."
    ],
    examLevel: "RN/RPN",
    timeLimit: "15 minutes",
    candidateInstructions: "Insert a peripheral IV catheter on this patient who requires IV antibiotic therapy. Demonstrate proper technique from site selection to documentation.",
    patientActorScript: "You are a 55-year-old patient who needs an IV for antibiotics. You are nervous about needles but cooperative. You have fair veins visible in your non-dominant forearm. You have no history of mastectomy, AV fistula, or lymphedema.",
    examinerChecklist: [
      { action: "Verifies order and assesses for contraindications", marks: 1 },
      { action: "Selects appropriate catheter gauge", marks: 1 },
      { action: "Applies tourniquet and selects appropriate vein", marks: 2 },
      { action: "Cleanses site with correct technique and allows to dry", marks: 2 },
      { action: "Inserts catheter at correct angle, bevel up", marks: 2 },
      { action: "Advances catheter correctly after flashback", marks: 2 },
      { action: "Releases tourniquet before flushing", marks: 1 },
      { action: "Confirms blood return and flushes with push-pause", marks: 2 },
      { action: "Observes site during flush for infiltration", marks: 1 },
      { action: "Applies dressing and labels site", marks: 1 },
      { action: "Disposes sharps immediately", marks: 2 },
      { action: "Documents procedure", marks: 1 }
    ],
    criticalFailCriteria: [
      "Reinserts stylet into catheter",
      "Does not perform hand hygiene or wear gloves",
      "Fails to cleanse the insertion site",
      "Does not dispose of sharps in sharps container",
      "Inserts IV on affected limb (mastectomy, AV fistula, lymphedema side)"
    ],
    examinerQuestions: [
      { question: "Why should you never reinsert a stylet into a catheter?", answer: "The stylet can shear or cut the catheter, creating a catheter fragment that could embolize to the heart or lungs." },
      { question: "What gauge catheter would you select for a blood transfusion?", answer: "An 18G or larger. Smaller gauges can hemolyze red blood cells and slow the transfusion rate." },
      { question: "What are signs of phlebitis at an IV site?", answer: "Redness, warmth, swelling, tenderness along the vein track, and a palpable cord. The catheter should be removed and a new site selected." }
    ],
    teachingPoints: [
      "Use the smallest gauge catheter that meets the therapy requirements to minimize vein trauma.",
      "Peripheral IV sites should be assessed every shift and when medications are administered.",
      "Midline catheters or PICCs should be considered if IV therapy will last longer than 6 days.",
      "Chlorhexidine is preferred over povidone-iodine for vascular access site preparation.",
      "The push-pause (pulsatile) flushing technique creates turbulent flow that clears the catheter more effectively."
    ]
  },
  {
    id: "iv-pump-programming",
    title: "IV Pump Programming",
    category: "Procedure",
    difficulty: "Intermediate",
    icon: "Monitor",
    description: "Safely program an IV infusion pump for continuous and intermittent infusions, including rate calculation, drug library verification, and alarm management.",
    scenarioIntro: "You are a nurse on a medical unit. A 60-year-old patient has been prescribed IV normal saline at 125 mL/hour and IV cefazolin 1g in 100 mL to infuse over 30 minutes. You need to program the infusion pump to deliver both infusions safely.",
    equipment: [
      "IV infusion pump",
      "IV tubing (primary and secondary sets)",
      "IV fluids as prescribed",
      "Medication label",
      "Alcohol swabs",
      "IV pole",
      "Medication Administration Record (MAR)",
      "Calculator (if needed)",
      "Documentation tools"
    ],
    steps: [
      { id: "ivp-1", instruction: "Verify the IV fluid and medication orders against the MAR.", rationale: "Order verification prevents wrong-fluid and wrong-rate errors.", criticalStep: true },
      { id: "ivp-2", instruction: "Perform hand hygiene and gather all equipment.", rationale: "Infection prevention and preparation for efficient workflow.", criticalStep: true },
      { id: "ivp-3", instruction: "Verify the patient using two identifiers and explain the infusion plan.", rationale: "Patient identification prevents wrong-patient errors. Education promotes cooperation.", criticalStep: true },
      { id: "ivp-4", instruction: "Inspect the IV fluid bag for clarity, expiration date, and integrity (no leaks or punctures).", rationale: "Cloudy or expired fluids may be contaminated. Compromised bag integrity can introduce pathogens.", criticalStep: true },
      { id: "ivp-5", instruction: "Spike the IV bag using aseptic technique: remove the tab and insert the spike without touching the port.", rationale: "Contamination of the spike or port introduces bacteria directly into the infusion.", criticalStep: true },
      { id: "ivp-6", instruction: "Prime the IV tubing, ensuring all air is removed from the line and drip chamber is one-third to one-half full.", rationale: "Air in the tubing can cause air embolism. A half-full drip chamber allows proper drop counting.", criticalStep: true },
      { id: "ivp-7", instruction: "Load the tubing into the pump according to manufacturer instructions.", rationale: "Incorrect loading can result in free-flow, occlusion alarms, or inaccurate delivery rates.", criticalStep: true },
      { id: "ivp-8", instruction: "Select the correct drug library profile and channel on the pump.", rationale: "Drug library systems provide dose-limit guardrails that prevent over- and under-dosing. Always use the correct patient care area profile.", criticalStep: true },
      { id: "ivp-9", instruction: "Program the primary infusion: enter rate (125 mL/hr) and volume to be infused.", rationale: "Correct programming ensures the prescribed rate is delivered. VTBI allows the pump to alarm when the infusion is complete.", criticalStep: true },
      { id: "ivp-10", instruction: "For the secondary (piggyback) antibiotic: calculate the rate — 100 mL over 30 minutes = 200 mL/hr.", rationale: "Rate calculation: Volume (mL) ÷ Time (hours) = Rate. 100 mL ÷ 0.5 hr = 200 mL/hr.", criticalStep: true },
      { id: "ivp-11", instruction: "Hang the secondary bag higher than the primary bag and connect via the secondary port.", rationale: "The secondary bag must be higher to infuse by gravity differential. When complete, the primary infusion automatically resumes.", criticalStep: true },
      { id: "ivp-12", instruction: "Program the secondary infusion with the calculated rate and volume, then start the pump.", rationale: "The pump will deliver the secondary infusion first, then revert to the primary rate.", criticalStep: true },
      { id: "ivp-13", instruction: "Verify the infusion is running by checking the drip chamber and observing the pump display.", rationale: "Visual confirmation ensures the pump is actually delivering fluid and the line is not occluded.", criticalStep: true },
      { id: "ivp-14", instruction: "Assess the IV site for patency: check for redness, swelling, pain, or infiltration.", rationale: "Site assessment ensures the fluid is infusing intravenously, not into surrounding tissue.", criticalStep: true },
      { id: "ivp-15", instruction: "Document the infusion: solution, rate, time started, and IV site assessment.", rationale: "Documentation provides a complete record of the infusion for the healthcare team.", criticalStep: true }
    ],
    commonErrors: [
      "Programming the wrong rate (confusing mL/hr with drops/min)",
      "Failing to prime the tubing completely, leaving air in the line",
      "Not using the drug library guardrails on the pump",
      "Hanging the secondary bag at the same height as the primary (will not infuse properly)",
      "Not verifying the infusion is actually running after pressing start",
      "Failing to assess the IV site before starting the infusion",
      "Incorrect rate calculation for the piggyback infusion"
    ],
    passingCriteria: "Candidate must correctly calculate the infusion rate, program the pump with appropriate drug library, properly set up primary and secondary infusions, and verify the infusion is running.",
    clinicalPearls: [
      "Always use the drug library on the pump — it provides hard and soft dose limits that prevent dangerous errors.",
      "Free flow occurs when tubing is removed from the pump without clamping. Always clamp before disconnecting.",
      "The secondary (piggyback) bag must hang higher than the primary to infuse properly.",
      "Rate calculation formula: mL/hr = Volume (mL) ÷ Time (hours). For drops/min: (Volume × Drop factor) ÷ (Time in minutes).",
      "Air-in-line alarms are common but important — never silence without checking for actual air in the tubing."
    ],
    examLevel: "RPN/RN",
    timeLimit: "12 minutes",
    candidateInstructions: "Program an IV pump to deliver a continuous NS infusion at 125 mL/hr and a secondary antibiotic (cefazolin 1g in 100 mL over 30 minutes). Demonstrate safe setup, rate calculation, and pump programming.",
    patientActorScript: "You are a 60-year-old patient with an existing patent IV line. You are cooperative. Ask the nurse what is in the IV bag and how long it will take.",
    examinerChecklist: [
      { action: "Verifies orders against MAR", marks: 1 },
      { action: "Inspects IV fluids for integrity and expiration", marks: 1 },
      { action: "Primes tubing without air in line", marks: 2 },
      { action: "Loads tubing correctly into pump", marks: 1 },
      { action: "Selects correct drug library profile", marks: 2 },
      { action: "Programs primary infusion correctly (125 mL/hr)", marks: 2 },
      { action: "Correctly calculates secondary rate (200 mL/hr)", marks: 2 },
      { action: "Hangs secondary bag higher than primary", marks: 1 },
      { action: "Verifies infusion is running", marks: 1 },
      { action: "Assesses IV site", marks: 1 },
      { action: "Documents infusion", marks: 1 }
    ],
    criticalFailCriteria: [
      "Programs grossly incorrect infusion rate",
      "Does not remove air from tubing before starting",
      "Does not verify patient identity",
      "Bypasses drug library safety alerts without justification",
      "Fails to clamp tubing before removing from pump (free flow risk)"
    ],
    examinerQuestions: [
      { question: "What is free flow and how do you prevent it?", answer: "Free flow is uncontrolled rapid infusion when tubing is removed from the pump without clamping. Always clamp the tubing before removing it from the pump." },
      { question: "Calculate the drip rate for 1000 mL NS over 8 hours using a 20 drop/mL set.", answer: "(1000 × 20) ÷ (8 × 60) = 20,000 ÷ 480 = approximately 42 drops per minute." },
      { question: "What would you do if you discover a medication has been infusing at the wrong rate?", answer: "Stop the infusion, assess the patient for adverse effects, notify the provider immediately, complete an incident report, and document the event." }
    ],
    teachingPoints: [
      "IV pump drug libraries are one of the most effective medication safety technologies — always use them.",
      "Smart pumps reduce but do not eliminate errors — the nurse must still verify the correct rate and medication.",
      "Clamp the tubing whenever disconnecting from the pump to prevent free flow.",
      "Know two IV rate formulas: mL/hr for pumps, and drops/min for gravity infusions.",
      "Report all pump malfunctions to biomedical engineering and remove the pump from service."
    ]
  },
  {
    id: "iv-site-complication",
    title: "IV Site Complication Assessment",
    category: "Procedure",
    difficulty: "Intermediate",
    icon: "AlertTriangle",
    description: "Systematically assess a peripheral IV site for complications including infiltration, extravasation, phlebitis, infection, and hematoma, and implement appropriate nursing interventions.",
    scenarioIntro: "You are a nurse performing routine IV site assessments during your shift. A 48-year-old patient with a peripheral IV in the left forearm reports that the IV site has become painful and swollen over the past hour. The patient is receiving vancomycin through this line. You need to assess and manage this complication.",
    equipment: [
      "Clean gloves",
      "Penlight",
      "Measuring tape",
      "Warm compress",
      "Cold compress",
      "New IV start kit",
      "Phlebitis assessment scale",
      "Documentation tools"
    ],
    steps: [
      { id: "ivs-1", instruction: "Perform hand hygiene, identify the patient, and don clean gloves.", rationale: "Standard precautions and patient identification.", criticalStep: true },
      { id: "ivs-2", instruction: "Ask the patient about symptoms: pain, burning, stinging, swelling, or any changes at the IV site.", rationale: "Patient-reported symptoms guide the assessment focus and provide subjective data about onset and severity.", criticalStep: true },
      { id: "ivs-3", instruction: "Inspect the IV site: look for redness, swelling, streak formation, drainage, or bruising.", rationale: "Visual inspection identifies early signs of phlebitis (redness, streak), infiltration (swelling), or infection (purulent drainage).", criticalStep: true },
      { id: "ivs-4", instruction: "Palpate the area around the IV site for warmth, tenderness, induration (hardness), or a palpable cord.", rationale: "A palpable cord along the vein suggests thrombophlebitis. Induration indicates tissue edema from infiltration.", criticalStep: true },
      { id: "ivs-5", instruction: "Compare the affected limb to the opposite limb for symmetry in size and appearance.", rationale: "Bilateral comparison helps quantify the degree of swelling and identifies asymmetry caused by infiltration.", criticalStep: false },
      { id: "ivs-6", instruction: "Pause the infusion and attempt to aspirate blood return from the catheter.", rationale: "Absence of blood return suggests the catheter is no longer in the vein. However, blood return can be present even with partial infiltration.", criticalStep: true },
      { id: "ivs-7", instruction: "Grade the phlebitis using a standardized phlebitis scale (0-4).", rationale: "Grade 0: no symptoms; Grade 1: erythema with pain; Grade 2: pain, erythema, edema; Grade 3: pain, erythema, induration, palpable cord; Grade 4: all symptoms plus purulent drainage.", criticalStep: true },
      { id: "ivs-8", instruction: "Grade infiltration using the INS infiltration scale (1-4).", rationale: "Grade 1: skin blanched, cool, <1 inch edema; Grade 2: blanched, cool, 1-6 inches; Grade 3: blanched, cool, gross edema, mild pain; Grade 4: deep pitting, circulatory impairment, pain.", criticalStep: true },
      { id: "ivs-9", instruction: "Determine if the complication is infiltration (non-vesicant) or extravasation (vesicant medication).", rationale: "Extravasation (leakage of vesicant drugs like vancomycin, chemotherapy) can cause tissue necrosis and requires specific antidotes.", criticalStep: true },
      { id: "ivs-10", instruction: "Discontinue the IV catheter if infiltration, extravasation, or Grade 2+ phlebitis is confirmed.", rationale: "Continuing to infuse through a compromised IV worsens tissue damage. The catheter must be removed.", criticalStep: true },
      { id: "ivs-11", instruction: "For infiltration of a non-vesicant: elevate the limb and apply a warm compress.", rationale: "Elevation promotes reabsorption of fluid. Warm compresses improve circulation and aid fluid absorption.", criticalStep: false },
      { id: "ivs-12", instruction: "For extravasation of a vesicant: stop the infusion, aspirate residual drug, apply cold compress (for most vesicants), and notify the provider immediately.", rationale: "Cold limits drug spread. Some vesicants have specific antidotes that must be administered within a short window.", criticalStep: true },
      { id: "ivs-13", instruction: "Mark the borders of the affected area with a skin marker for ongoing monitoring.", rationale: "Marking allows tracking of whether the affected area is expanding or resolving.", criticalStep: false },
      { id: "ivs-14", instruction: "Establish a new IV in the opposite arm or proximal to the failed site on a different vein.", rationale: "Never reinsert below a failed site on the same vein, as fluid may leak from the previous puncture site.", criticalStep: true },
      { id: "ivs-15", instruction: "Document the complication: type, grade, interventions performed, provider notification, and patient response.", rationale: "Detailed documentation supports continuity of care and may be needed for incident reporting.", criticalStep: true }
    ],
    commonErrors: [
      "Continuing the infusion despite signs of infiltration",
      "Not differentiating between infiltration and extravasation",
      "Applying heat to an extravasation of a vesicant (promotes drug spread for some agents)",
      "Reinserting the new IV distal to the failed site on the same vein",
      "Not grading the complication using a standardized scale",
      "Failing to notify the provider about extravasation",
      "Not marking the borders of the affected area"
    ],
    passingCriteria: "Candidate must correctly identify the type of IV complication, grade it using a standardized scale, implement appropriate interventions, and demonstrate knowledge of the difference between infiltration and extravasation.",
    clinicalPearls: [
      "Infiltration = non-vesicant fluid in tissue (manage with elevation and warm compress). Extravasation = vesicant drug in tissue (may cause necrosis, requires specific management).",
      "Common vesicants include vancomycin, dopamine, phenytoin, potassium chloride, and chemotherapy agents.",
      "A functioning IV can still show signs of phlebitis — redness and tenderness along the vein without swelling.",
      "IV sites should be assessed at the start of each shift, before and after each medication, and whenever the patient reports symptoms.",
      "Central line access should be considered if the patient has poor venous access or requires vesicant medications long-term."
    ],
    examLevel: "RPN/RN",
    timeLimit: "10 minutes",
    candidateInstructions: "A patient's IV site has become painful and swollen. The patient is receiving vancomycin. Assess the IV site, identify the complication, grade it, and implement appropriate interventions.",
    patientActorScript: "You are a 48-year-old patient with an IV in your left forearm. The site has been getting more painful over the past hour. It feels tight and swollen. Describe the pain as burning and stinging. The area around the IV looks puffy and slightly reddened.",
    examinerChecklist: [
      { action: "Performs hand hygiene and identifies patient", marks: 1 },
      { action: "Asks about symptoms", marks: 1 },
      { action: "Inspects and palpates the IV site", marks: 2 },
      { action: "Attempts to aspirate blood return", marks: 1 },
      { action: "Grades the complication using a standardized scale", marks: 2 },
      { action: "Correctly identifies infiltration vs extravasation", marks: 2 },
      { action: "Discontinues the IV catheter", marks: 2 },
      { action: "Implements appropriate interventions", marks: 2 },
      { action: "Establishes new IV at appropriate site", marks: 1 },
      { action: "Documents the complication and interventions", marks: 1 },
      { action: "Notifies provider", marks: 1 }
    ],
    criticalFailCriteria: [
      "Continues the infusion through a compromised IV site",
      "Fails to recognize extravasation risk with vancomycin",
      "Does not notify the provider about a vesicant extravasation",
      "Reinserts IV distal to the failed site on the same vein"
    ],
    examinerQuestions: [
      { question: "What is the difference between infiltration and extravasation?", answer: "Infiltration is leakage of a non-vesicant solution into surrounding tissue. Extravasation is leakage of a vesicant (tissue-damaging) medication into surrounding tissue, which can cause necrosis." },
      { question: "Name three vesicant medications.", answer: "Vancomycin, dopamine, phenytoin, potassium chloride (concentrated), chemotherapy agents (doxorubicin, vincristine)." },
      { question: "How would you manage a Grade 3 phlebitis?", answer: "Discontinue the IV, apply a warm compress, elevate the limb, notify the provider, document the complication and grade, and establish a new IV at a different site." }
    ],
    teachingPoints: [
      "Early detection of IV complications prevents serious tissue damage — assess sites routinely.",
      "Vancomycin is a vesicant — always infuse through a well-functioning IV with frequent site checks.",
      "The INS (Infusion Nurses Society) standards recommend IV site assessment at minimum every 4 hours.",
      "Peripheral IVs should be removed at the first sign of complications — do not wait to see if it improves.",
      "Document the phlebitis or infiltration grade using a standardized scale for consistent communication."
    ]
  },
  {
    id: "subcutaneous-injection",
    title: "Subcutaneous Injection",
    category: "Procedure",
    difficulty: "Beginner",
    icon: "Syringe",
    description: "Administer a subcutaneous injection using proper technique, including site selection, angle of insertion, and post-injection assessment.",
    scenarioIntro: "You are a nurse on a surgical unit. A 65-year-old patient who is post-operative day 1 following a total hip replacement is prescribed enoxaparin (Lovenox) 40 mg subcutaneously daily for venous thromboembolism prophylaxis. You need to administer the injection.",
    equipment: [
      "Prescribed medication in prefilled syringe or drawn up in appropriate syringe",
      "Appropriate needle (25-27 gauge, 5/8 inch)",
      "Alcohol swab",
      "Clean gloves",
      "Sharps container",
      "Medication Administration Record (MAR)",
      "Documentation tools"
    ],
    steps: [
      { id: "sci-1", instruction: "Verify the medication order against the MAR and perform the first medication check.", rationale: "Ensures the correct medication, dose, route, and time are being followed.", criticalStep: true },
      { id: "sci-2", instruction: "Review patient allergies and check for contraindications (active bleeding, thrombocytopenia for anticoagulants).", rationale: "Allergy verification and contraindication screening prevent adverse events.", criticalStep: true },
      { id: "sci-3", instruction: "Perform the second medication check when drawing up or preparing the medication.", rationale: "The second safety check catches preparation errors.", criticalStep: true },
      { id: "sci-4", instruction: "Perform hand hygiene, identify the patient using two identifiers, and explain the procedure.", rationale: "Patient safety standards and patient education about the injection.", criticalStep: true },
      { id: "sci-5", instruction: "Perform the third medication check at the bedside.", rationale: "Final verification before administration.", criticalStep: true },
      { id: "sci-6", instruction: "Select an appropriate injection site: abdomen (2 inches from umbilicus), anterior thigh, or upper arm posterior aspect.", rationale: "Subcutaneous tissue in these areas provides consistent absorption. For enoxaparin, the abdomen is preferred.", criticalStep: true },
      { id: "sci-7", instruction: "Rotate the injection site from previous injections.", rationale: "Site rotation prevents lipohypertrophy and lipoatrophy, which impair medication absorption.", criticalStep: true },
      { id: "sci-8", instruction: "Don clean gloves and cleanse the injection site with an alcohol swab using a circular motion. Allow to dry.", rationale: "Antiseptic preparation reduces infection risk. Injecting through wet alcohol causes stinging.", criticalStep: true },
      { id: "sci-9", instruction: "Pinch a fold of skin between your thumb and forefinger to lift the subcutaneous tissue.", rationale: "Pinching ensures the needle enters subcutaneous tissue rather than muscle, especially in thin patients.", criticalStep: true },
      { id: "sci-10", instruction: "Insert the needle at a 45-90 degree angle (90 degrees if adequate subcutaneous tissue, 45 degrees if thin).", rationale: "The angle ensures deposition into subcutaneous tissue. A 90-degree angle is used when there is at least 2 inches of pinchable tissue.", criticalStep: true },
      { id: "sci-11", instruction: "Do NOT aspirate for subcutaneous injections. Inject the medication slowly.", rationale: "Aspiration is no longer recommended for subcutaneous injections. Slow injection reduces tissue trauma and pain.", criticalStep: true },
      { id: "sci-12", instruction: "For enoxaparin specifically: do NOT expel the air bubble from the prefilled syringe.", rationale: "The air bubble in prefilled enoxaparin syringes ensures complete dose delivery and acts as a seal to prevent tracking.", criticalStep: true },
      { id: "sci-13", instruction: "Withdraw the needle at the same angle as insertion and activate the safety mechanism.", rationale: "Withdrawing at the same angle prevents tissue tearing. Safety activation prevents needlestick injuries.", criticalStep: false },
      { id: "sci-14", instruction: "Do NOT rub the injection site. Apply gentle pressure with gauze if needed.", rationale: "Rubbing increases bruising, especially with anticoagulants. Gentle pressure controls bleeding.", criticalStep: true },
      { id: "sci-15", instruction: "Dispose of the needle and syringe immediately in the sharps container.", rationale: "Immediate disposal prevents needlestick injuries. Never recap used needles.", criticalStep: true },
      { id: "sci-16", instruction: "Remove gloves, perform hand hygiene, and document the injection: medication, dose, site, time, and patient response.", rationale: "Complete documentation prevents duplicate dosing and tracks injection site rotation.", criticalStep: true }
    ],
    commonErrors: [
      "Aspirating before a subcutaneous injection (no longer recommended)",
      "Expelling the air bubble from a prefilled enoxaparin syringe",
      "Rubbing the injection site after administration (increases bruising)",
      "Injecting at the wrong angle for the patient's body habitus",
      "Not rotating injection sites",
      "Injecting too close to the umbilicus (less than 2 inches)",
      "Recapping the needle after use"
    ],
    passingCriteria: "Candidate must perform the three medication checks, select an appropriate site, use the correct injection angle, avoid aspiration, and not rub the injection site.",
    clinicalPearls: [
      "Aspiration is NOT required for subcutaneous injections — this is a common outdated practice.",
      "For enoxaparin (Lovenox): never expel the air bubble, always inject in the abdomen, and never rub the site.",
      "Insulin and heparin are the most common subcutaneous medications — both require site rotation.",
      "A 90-degree angle is standard for most adults with adequate subcutaneous tissue. Use 45 degrees for thin patients.",
      "Subcutaneous injections have a slower, more predictable absorption rate than intramuscular injections."
    ],
    examLevel: "RPN/RN",
    timeLimit: "8 minutes",
    candidateInstructions: "Administer a prescribed subcutaneous enoxaparin injection to a post-operative patient. Demonstrate proper technique from medication verification to documentation.",
    patientActorScript: "You are a 65-year-old patient, post-operative day 1 after hip surgery. You are cooperative but dislike needles. Ask why you need the injection. You have no known allergies.",
    examinerChecklist: [
      { action: "Performs three medication checks", marks: 2 },
      { action: "Verifies allergies", marks: 1 },
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Selects appropriate injection site", marks: 2 },
      { action: "Rotates site from previous injections", marks: 1 },
      { action: "Cleanses site and allows to dry", marks: 1 },
      { action: "Pinches skin and inserts at correct angle", marks: 2 },
      { action: "Does NOT aspirate", marks: 1 },
      { action: "Does NOT expel air bubble from enoxaparin", marks: 2 },
      { action: "Does NOT rub the injection site", marks: 1 },
      { action: "Disposes sharps immediately", marks: 1 },
      { action: "Documents correctly", marks: 1 }
    ],
    criticalFailCriteria: [
      "Fails to identify patient with two identifiers",
      "Injects into muscle instead of subcutaneous tissue",
      "Recaps the used needle",
      "Fails to perform any medication verification checks"
    ],
    examinerQuestions: [
      { question: "Why should you not expel the air bubble from a prefilled enoxaparin syringe?", answer: "The air bubble ensures the full dose is delivered and creates a seal that prevents medication from tracking along the needle path, reducing bruising." },
      { question: "What are the recommended injection sites for subcutaneous injections?", answer: "Abdomen (at least 2 inches from the umbilicus), anterior thigh (middle third), and posterior aspect of the upper arm." },
      { question: "Why is site rotation important for insulin injections?", answer: "Repeated injections at the same site cause lipohypertrophy (fatty lumps) which impairs insulin absorption and leads to unpredictable blood glucose control." }
    ],
    teachingPoints: [
      "Current evidence-based practice: do not aspirate for subcutaneous injections.",
      "Enoxaparin has specific administration requirements that differ from other subcutaneous medications.",
      "Site rotation is essential for patients receiving frequent subcutaneous injections (insulin, heparin).",
      "Cold medications from the refrigerator cause more pain — allow to reach room temperature before injecting when possible.",
      "Z-track technique is sometimes used for subcutaneous anticoagulants to reduce bruising."
    ]
  },
  {
    id: "intramuscular-injection",
    title: "Intramuscular Injection",
    category: "Procedure",
    difficulty: "Beginner",
    icon: "Syringe",
    description: "Administer an intramuscular injection using the correct technique, including landmark identification, site selection, Z-track method, and post-injection monitoring.",
    scenarioIntro: "You are a nurse in a clinic. A 35-year-old patient requires an intramuscular injection of influenza vaccine. The patient has no contraindications and has given consent for vaccination. You need to administer the injection using proper IM technique.",
    equipment: [
      "Prescribed medication/vaccine",
      "Appropriate syringe and needle (22-25 gauge, 1-1.5 inch for adults)",
      "Alcohol swab",
      "Clean gloves",
      "Adhesive bandage",
      "Sharps container",
      "Epinephrine auto-injector (for vaccine clinics)",
      "Documentation tools"
    ],
    steps: [
      { id: "imi-1", instruction: "Verify the medication/vaccine order and perform the first medication check.", rationale: "Order verification ensures the correct medication, dose, and route.", criticalStep: true },
      { id: "imi-2", instruction: "Review patient allergies, contraindications, and screening questions for vaccines.", rationale: "Egg allergy, previous adverse reactions, immunocompromised status, and pregnancy may be contraindications for certain vaccines.", criticalStep: true },
      { id: "imi-3", instruction: "Perform the second medication check when preparing the injection.", rationale: "Second safety check during preparation.", criticalStep: true },
      { id: "imi-4", instruction: "Perform hand hygiene, identify the patient using two identifiers, and explain the procedure.", rationale: "Patient safety and education. For vaccines, provide a Vaccine Information Statement (VIS) before administration.", criticalStep: true },
      { id: "imi-5", instruction: "Perform the third medication check at the point of care.", rationale: "Final verification before administration.", criticalStep: true },
      { id: "imi-6", instruction: "Select the appropriate injection site based on patient age, muscle mass, and medication volume.", rationale: "Deltoid: up to 1 mL in adults; Ventrogluteal: up to 3 mL (preferred for large volumes); Vastus lateralis: up to 5 mL.", criticalStep: true },
      { id: "imi-7", instruction: "For the deltoid: locate the acromion process and inject 2-3 finger-widths below it in the middle of the muscle.", rationale: "Proper landmark identification prevents injection into the subdeltoid bursa, radial nerve, or brachial artery.", criticalStep: true },
      { id: "imi-8", instruction: "Select the appropriate needle length based on body habitus and injection site.", rationale: "A needle too short deposits medication into subcutaneous tissue. Standard: 1 inch for deltoid, 1.5 inches for ventrogluteal.", criticalStep: true },
      { id: "imi-9", instruction: "Don clean gloves and cleanse the injection site with an alcohol swab. Allow to dry.", rationale: "Antiseptic preparation and allowing to dry prevents stinging and ensures antimicrobial effect.", criticalStep: true },
      { id: "imi-10", instruction: "Spread the skin taut with your non-dominant hand (or use Z-track technique for irritating medications).", rationale: "Taut skin facilitates needle insertion. Z-track prevents medication from tracking back through subcutaneous tissue.", criticalStep: true },
      { id: "imi-11", instruction: "Insert the needle at a 90-degree angle in one quick, smooth motion.", rationale: "A 90-degree angle ensures the needle reaches the muscle layer. A quick insertion reduces pain.", criticalStep: true },
      { id: "imi-12", instruction: "Aspiration is no longer routinely required for IM injections (except for the dorsogluteal site, which is no longer recommended).", rationale: "Current CDC and WHO guidelines do not recommend aspiration for IM injections at recommended sites. The ventrogluteal and deltoid sites have no major blood vessels.", criticalStep: false },
      { id: "imi-13", instruction: "Inject the medication slowly at a rate of approximately 1 mL per 10 seconds.", rationale: "Slow injection allows the muscle tissue to expand and accommodate the fluid, reducing pain and tissue damage.", criticalStep: false },
      { id: "imi-14", instruction: "Withdraw the needle at the same angle, activate the safety mechanism, and apply gentle pressure with gauze.", rationale: "Same-angle withdrawal reduces tissue damage. Safety activation prevents needlestick injuries.", criticalStep: true },
      { id: "imi-15", instruction: "Apply an adhesive bandage over the injection site.", rationale: "Protects the puncture site and contains any minor bleeding.", criticalStep: false },
      { id: "imi-16", instruction: "Dispose of sharps immediately in the sharps container.", rationale: "Immediate disposal prevents needlestick injuries. Never recap used needles.", criticalStep: true },
      { id: "imi-17", instruction: "For vaccines: instruct the patient to wait 15-30 minutes for observation of anaphylaxis.", rationale: "Anaphylactic reactions typically occur within 15-30 minutes of vaccination. Immediate treatment with epinephrine is required.", criticalStep: true },
      { id: "imi-18", instruction: "Remove gloves, perform hand hygiene, and document the injection including site, medication, lot number (for vaccines), and patient response.", rationale: "Complete documentation including lot number is required for vaccine tracking and adverse event reporting.", criticalStep: true }
    ],
    commonErrors: [
      "Using the dorsogluteal site (no longer recommended due to sciatic nerve risk)",
      "Not identifying landmarks correctly, injecting too high or too low on the deltoid",
      "Using a needle that is too short for the patient's body habitus",
      "Injecting too quickly, causing unnecessary pain",
      "Not having the patient wait for observation after vaccination",
      "Failing to document the vaccine lot number",
      "Injecting more than 1 mL into the deltoid muscle"
    ],
    passingCriteria: "Candidate must correctly identify the injection site using landmarks, use proper injection technique at 90 degrees, dispose of sharps safely, and for vaccines, ensure post-vaccination monitoring.",
    clinicalPearls: [
      "The ventrogluteal site is the preferred site for large-volume IM injections — it has the thickest muscle and no major nerves or vessels.",
      "The dorsogluteal site is NO LONGER RECOMMENDED due to risk of sciatic nerve injury.",
      "Z-track technique: pull the skin laterally before injection, inject, wait 10 seconds, then release. This prevents medication tracking.",
      "For infants under 12 months, the vastus lateralis is the preferred vaccination site.",
      "Aspiration before IM injection is no longer recommended by CDC, WHO, or most nursing organizations."
    ],
    examLevel: "RPN/RN",
    timeLimit: "10 minutes",
    candidateInstructions: "Administer an influenza vaccine via intramuscular injection. Demonstrate proper technique including site selection, landmark identification, injection, and post-vaccination monitoring.",
    patientActorScript: "You are a 35-year-old healthy adult here for your flu shot. You have no allergies, no previous vaccine reactions, and you are not pregnant or immunocompromised. You are slightly anxious but cooperative.",
    examinerChecklist: [
      { action: "Performs three medication checks", marks: 2 },
      { action: "Screens for allergies and contraindications", marks: 1 },
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Selects appropriate site (deltoid)", marks: 2 },
      { action: "Identifies correct landmark (acromion process)", marks: 2 },
      { action: "Selects appropriate needle length", marks: 1 },
      { action: "Cleanses site and allows to dry", marks: 1 },
      { action: "Inserts needle at 90-degree angle", marks: 2 },
      { action: "Injects medication slowly", marks: 1 },
      { action: "Activates safety mechanism and disposes sharps", marks: 1 },
      { action: "Instructs patient to wait 15-30 minutes", marks: 2 },
      { action: "Documents including lot number", marks: 1 }
    ],
    criticalFailCriteria: [
      "Uses dorsogluteal site",
      "Fails to identify patient",
      "Injects at wrong angle (not 90 degrees)",
      "Does not dispose of sharps in sharps container",
      "Does not ensure post-vaccination monitoring for vaccines"
    ],
    examinerQuestions: [
      { question: "Why is the dorsogluteal site no longer recommended?", answer: "Due to risk of sciatic nerve injury and the presence of major blood vessels. The ventrogluteal site is safer and has thicker muscle." },
      { question: "What is the maximum volume for a deltoid IM injection in an adult?", answer: "1 mL for the deltoid. For volumes greater than 1 mL, use the ventrogluteal (up to 3 mL) or vastus lateralis (up to 5 mL)." },
      { question: "What would you do if a patient develops signs of anaphylaxis after a vaccination?", answer: "Administer epinephrine IM immediately (0.3-0.5 mg for adults), call for emergency assistance, position supine with legs elevated (unless respiratory distress), and prepare for possible repeat dosing." }
    ],
    teachingPoints: [
      "The deltoid is the preferred site for most adult vaccinations due to immunogenicity and convenience.",
      "Landmark identification is critical — improper injection site can cause nerve damage or poor absorption.",
      "Current best practice: no aspiration is needed for IM injections at recommended sites.",
      "Z-track technique is recommended for irritating medications like iron dextran to prevent tissue staining.",
      "Always have epinephrine available when administering vaccines or any injectable medication."
    ]
  },
  {
    id: "blood-glucose-monitoring",
    title: "Blood Glucose Monitoring",
    category: "Procedure",
    difficulty: "Beginner",
    icon: "Droplets",
    description: "Perform capillary blood glucose monitoring using a point-of-care glucometer, interpret the results, and implement appropriate nursing interventions based on findings.",
    scenarioIntro: "You are a nurse on a medical unit caring for a 58-year-old patient with Type 2 diabetes who is NPO for a procedure scheduled this afternoon. The patient is prescribed sliding scale insulin with blood glucose monitoring before meals and at bedtime. It is 0730 and you need to check the patient's fasting blood glucose.",
    equipment: [
      "Point-of-care glucometer",
      "Test strips (compatible with the glucometer)",
      "Lancet device with sterile lancet",
      "Alcohol swab",
      "Clean gloves",
      "Gauze or cotton ball",
      "Sharps container",
      "Sliding scale insulin order",
      "Documentation tools"
    ],
    steps: [
      { id: "bgm-1", instruction: "Verify the blood glucose monitoring order and the insulin sliding scale parameters.", rationale: "Ensures the correct monitoring frequency and insulin dosing parameters are followed.", criticalStep: true },
      { id: "bgm-2", instruction: "Perform hand hygiene and gather all equipment. Check the glucometer calibration and test strip expiration date.", rationale: "Expired test strips or uncalibrated meters produce inaccurate results that lead to incorrect insulin dosing.", criticalStep: true },
      { id: "bgm-3", instruction: "Verify quality control has been performed on the glucometer per facility policy.", rationale: "Quality control testing ensures the glucometer is functioning accurately. Most facilities require daily QC checks.", criticalStep: true },
      { id: "bgm-4", instruction: "Identify the patient using two identifiers and explain the procedure.", rationale: "Patient identification prevents wrong-patient errors. Explanation reduces anxiety.", criticalStep: true },
      { id: "bgm-5", instruction: "Assess the patient's fingers for the best puncture site: avoid the tip and pad of the finger; use the lateral aspect.", rationale: "The lateral aspect of the finger has fewer nerve endings than the fingertip, reducing pain. Avoid the thumb and index finger.", criticalStep: true },
      { id: "bgm-6", instruction: "Have the patient wash their hands with warm soap and water, or cleanse the selected site with an alcohol swab and allow to dry completely.", rationale: "Residual substances (glucose from food, lotion, alcohol) on the skin produce falsely elevated or low readings. Warm water also promotes blood flow.", criticalStep: true },
      { id: "bgm-7", instruction: "Don clean gloves and insert a test strip into the glucometer.", rationale: "Gloves protect against bloodborne pathogen exposure. The strip must be inserted before obtaining the sample.", criticalStep: true },
      { id: "bgm-8", instruction: "Select a site on the lateral aspect of the finger and puncture with the lancet device.", rationale: "Use firm, quick pressure for an adequate blood drop. Rotate fingers to prevent callus formation.", criticalStep: true },
      { id: "bgm-9", instruction: "Wipe away the first drop of blood with gauze, then obtain a second hanging drop.", rationale: "The first drop may be contaminated with tissue fluid that dilutes the sample. The second drop provides a more accurate reading.", criticalStep: true },
      { id: "bgm-10", instruction: "Touch the test strip to the blood drop and allow the glucometer to process the sample.", rationale: "The strip must be fully saturated for an accurate reading. Do not smear or spread the blood.", criticalStep: true },
      { id: "bgm-11", instruction: "Apply gentle pressure to the puncture site with gauze until bleeding stops.", rationale: "Hemostasis prevents prolonged bleeding, especially in patients on anticoagulants.", criticalStep: false },
      { id: "bgm-12", instruction: "Read and interpret the blood glucose result against the target range and sliding scale.", rationale: "Normal fasting BG: 4.0-7.0 mmol/L (72-126 mg/dL). Critically low: <3.9 mmol/L (<70 mg/dL). Critically high: >16.7 mmol/L (>300 mg/dL).", criticalStep: true },
      { id: "bgm-13", instruction: "If blood glucose is critically low (<3.9 mmol/L or <70 mg/dL): administer 15-20g of fast-acting glucose and recheck in 15 minutes.", rationale: "Hypoglycemia can cause seizures, loss of consciousness, and brain damage. The 15-15 rule: give 15g glucose, wait 15 minutes, recheck.", criticalStep: true },
      { id: "bgm-14", instruction: "If blood glucose is elevated: administer insulin per the sliding scale and monitor for symptoms.", rationale: "Sliding scale insulin provides correction doses based on current blood glucose levels.", criticalStep: true },
      { id: "bgm-15", instruction: "Dispose of the lancet in the sharps container and the test strip per facility policy.", rationale: "Lancets are sharps and must go in the sharps container. Test strips may be biohazardous waste.", criticalStep: true },
      { id: "bgm-16", instruction: "Remove gloves, perform hand hygiene, and document the blood glucose result, time, site, and any interventions.", rationale: "Documentation ensures results are communicated and interventions are tracked.", criticalStep: true }
    ],
    commonErrors: [
      "Not wiping away the first drop of blood",
      "Using expired test strips",
      "Not allowing alcohol to dry completely before puncturing (causes hemolysis and inaccurate readings)",
      "Puncturing the fingertip pad instead of the lateral aspect",
      "Squeezing the finger excessively (dilutes the sample with tissue fluid)",
      "Not performing quality control on the glucometer",
      "Failing to follow the hypoglycemia protocol for critically low values"
    ],
    passingCriteria: "Candidate must correctly perform blood glucose monitoring with proper technique, interpret the result, identify whether it is normal/abnormal, and state the appropriate nursing action based on the result.",
    clinicalPearls: [
      "The 15-15 Rule for hypoglycemia: give 15g of fast-acting glucose, recheck in 15 minutes, repeat if still <4.0 mmol/L.",
      "Fast-acting glucose sources: 4 glucose tablets, 4 oz juice, 4 oz regular soda, or 1 tablespoon of sugar or honey.",
      "Always wipe the first drop of blood — it contains interstitial fluid that dilutes the sample.",
      "Point-of-care glucometers are not accurate enough for diagnosing diabetes — laboratory venous glucose is required.",
      "In patients on peritoneal dialysis with icodextrin, certain glucometer brands may give falsely elevated readings."
    ],
    examLevel: "RPN/RN",
    timeLimit: "8 minutes",
    candidateInstructions: "Perform a capillary blood glucose check on a diabetic patient who is NPO. Interpret the result and state what nursing actions you would take based on the findings.",
    patientActorScript: "You are a 58-year-old patient with Type 2 diabetes. You have been fasting since midnight for a procedure. You feel a bit shaky and sweaty this morning. You are cooperative and hold out your hand when asked.",
    examinerChecklist: [
      { action: "Verifies order and checks glucometer/strip expiry", marks: 1 },
      { action: "Performs hand hygiene and dons gloves", marks: 1 },
      { action: "Identifies patient with two identifiers", marks: 1 },
      { action: "Selects lateral finger site", marks: 1 },
      { action: "Cleanses site and allows to dry", marks: 1 },
      { action: "Wipes first drop of blood", marks: 2 },
      { action: "Obtains adequate sample on test strip", marks: 1 },
      { action: "Reads and interprets result correctly", marks: 2 },
      { action: "States appropriate intervention for the result", marks: 2 },
      { action: "Disposes lancet in sharps container", marks: 1 },
      { action: "Documents result and interventions", marks: 1 }
    ],
    criticalFailCriteria: [
      "Uses expired test strips",
      "Does not wear gloves during blood exposure",
      "Fails to recognize critically low blood glucose",
      "Does not implement hypoglycemia protocol for BG <3.9 mmol/L",
      "Disposes lancet in regular waste instead of sharps container"
    ],
    examinerQuestions: [
      { question: "Describe the 15-15 rule for managing hypoglycemia.", answer: "Give 15 grams of fast-acting carbohydrate, wait 15 minutes, recheck blood glucose. If still below 4.0 mmol/L (70 mg/dL), repeat. Once stable, provide a complex carbohydrate and protein snack." },
      { question: "Why do you wipe the first drop of blood?", answer: "The first drop contains interstitial fluid that dilutes the blood sample and can produce an inaccurate (usually falsely low) reading." },
      { question: "What symptoms indicate hypoglycemia?", answer: "Shakiness, diaphoresis (sweating), tachycardia, confusion, dizziness, pallor, irritability, hunger, and in severe cases, seizures and loss of consciousness." }
    ],
    teachingPoints: [
      "Blood glucose monitoring is one of the most frequently performed nursing procedures — accuracy is critical for safe insulin dosing.",
      "Always verify quality control and test strip expiration before use.",
      "Hypoglycemia is more immediately life-threatening than hyperglycemia — know the protocol and act quickly.",
      "Teach diabetic patients proper self-monitoring technique, including lateral finger puncture and site rotation.",
      "Report any glucometer that gives results inconsistent with the patient's clinical presentation — send a venous sample to the lab."
    ]
  }
];
