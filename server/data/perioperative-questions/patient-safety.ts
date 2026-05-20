import type { PerioperativeQuestion } from "./types";

export const patientSafetyQuestions: PerioperativeQuestion[] = [
  {
    stem: "A circulating nurse is positioning a patient for a posterior lumbar fusion in the prone position. The patient weighs 95 kg. Which positioning consideration is MOST critical for preventing a pressure injury during this 4-hour procedure?",
    options: [
      "Ensure the patient's head is turned to one side for airway access",
      "Verify that all bony prominences are adequately padded, the chest is supported to allow free abdominal and chest wall movement, and the iliac crests and knees are padded to prevent pressure injury",
      "Place standard cotton blankets under the patient for cushioning",
      "Position the arms at the patient's sides secured with the draw sheet"
    ],
    correctAnswer: 1,
    rationaleLong: "Perioperative pressure injuries are a significant patient safety concern, particularly during prolonged procedures in the prone position. The prone position creates pressure points on the forehead, chin, chest, iliac crests (anterior superior iliac spines), knees, and dorsum of the feet. For a 95 kg patient undergoing a 4-hour procedure, the risk is substantially elevated. The nurse must ensure: (1) All bony prominences are adequately padded with appropriate pressure-redistribution devices (gel pads, foam pads, or viscoelastic polymer pads — NOT standard cotton blankets, which compress under body weight and provide minimal pressure redistribution); (2) The chest rolls or frame supports are positioned to elevate the torso off the table surface, allowing free chest wall excursion for ventilation and preventing abdominal compression (which would increase intraabdominal pressure, compress the IVC, and increase surgical bleeding); (3) The iliac crests are padded bilaterally; (4) The knees are padded and slightly flexed; (5) The feet are supported to prevent toe pressure; (6) The face is positioned in a specialized prone headrest that prevents eye and facial pressure; (7) The arms are positioned with shoulders abducted <90° with elbows padded. Risk factors for perioperative pressure injury include: duration >3 hours, hypotension, hypothermia, diabetes, peripheral vascular disease, malnutrition, advanced age, and obesity. The Braden Scale can be adapted for perioperative use.",
    learningObjective: "Implement comprehensive positioning interventions to prevent pressure injuries during prolonged prone surgical procedures",
    blueprintCategory: "Patient Safety",
    subtopic: "pressure injury prevention",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard cotton blankets compress under body weight and do NOT provide adequate pressure redistribution — use gel, foam, or viscoelastic polymer pads.",
    clinicalPearls: [
      "Prone pressure points: forehead, chin, chest, iliac crests, knees, dorsum of feet",
      "Risk factors: duration >3 hours, hypotension, hypothermia, diabetes, malnutrition, obesity",
      "Chest rolls must allow free abdominal wall movement — compression increases IVC pressure and surgical bleeding"
    ],
    safetyNote: "Document skin assessment before and after positioning — perioperative pressure injuries are preventable adverse events",
    distractorRationales: [
      "Head turned to one side is appropriate for some positions but a prone headrest is preferred for prone positioning to protect the eyes",
      "Cotton blankets compress under body weight and do not redistribute pressure effectively",
      "Arms at sides secured by draw sheet can cause brachial plexus injury — proper arm positioning with padding is required"
    ]
  },
  {
    stem: "During a surgical procedure, the scrub nurse sustains a needlestick injury from a contaminated suture needle. What is the FIRST action the scrub nurse should take?",
    options: [
      "Continue working and report the injury after the case is completed to avoid delaying the procedure",
      "Immediately remove the gloves, allow the wound to bleed freely, wash the area thoroughly with soap and water, report to the circulating nurse for replacement, and initiate the facility's exposure control plan",
      "Apply a bandage over the glove and continue working with double gloves",
      "Disinfect the needle with alcohol and continue using it"
    ],
    correctAnswer: 1,
    rationaleLong: "A needlestick injury with a contaminated sharp is a potentially life-altering occupational exposure to bloodborne pathogens including HIV, hepatitis B virus (HBV), and hepatitis C virus (HCV). The risk of transmission per percutaneous exposure is approximately: HBV 6-30% (if susceptible), HCV 1.8%, and HIV 0.3%. The immediate response is critical: (1) Remove gloves and allow the wound to bleed freely (do not squeeze or 'milk' the wound as this can drive contaminants deeper into the tissue); (2) Wash the wound thoroughly with soap and water for at least 5 minutes — do not use bleach, iodine, or other harsh disinfectants as they can damage tissue and may increase pathogen absorption; (3) Notify the circulating nurse so a replacement scrub can be arranged; (4) Report the injury per the facility's exposure control plan (required by OSHA's Bloodborne Pathogens Standard); (5) Seek immediate medical evaluation — HIV post-exposure prophylaxis (PEP) is most effective when started within 2 hours of exposure and should be initiated within 72 hours; (6) The source patient's blood should be tested for HIV, HBV, and HCV with consent. Continuing to work without addressing the injury delays time-sensitive medical intervention (HIV PEP) and violates OSHA standards. The scrub nurse's health and safety are paramount — the surgical team can adjust staffing to continue the procedure.",
    learningObjective: "Implement the correct immediate response to a needlestick injury including wound care, reporting, and time-sensitive post-exposure prophylaxis",
    blueprintCategory: "Patient Safety",
    subtopic: "sharps injury management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "HIV PEP is most effective within 2 HOURS of exposure. Do NOT delay reporting until after the case — time-sensitive intervention may be needed.",
    clinicalPearls: [
      "Transmission risk per needlestick: HBV 6-30%, HCV 1.8%, HIV 0.3%",
      "HIV PEP most effective within 2 hours, must start within 72 hours of exposure",
      "Wash with soap and water — do NOT use bleach or harsh disinfectants on the wound"
    ],
    safetyNote: "Report ALL sharps injuries immediately — delays in reporting can result in missed PEP windows and failure to comply with OSHA requirements",
    distractorRationales: [
      "Delaying reporting until after the case risks missing the critical 2-hour window for HIV PEP",
      "Bandaging over the glove without wound care fails to properly manage the exposure",
      "Disinfecting the needle does not address the scrub nurse's wound management needs"
    ]
  },
  {
    stem: "A circulating nurse is positioning a patient's arms on padded arm boards for a general surgical procedure in the supine position. What is the maximum degree of arm abduction to prevent brachial plexus injury?",
    options: [
      "Arms can be abducted to any angle as long as they are padded",
      "Arms should not be abducted beyond 90 degrees to prevent stretching of the brachial plexus",
      "Arms should be abducted to exactly 45 degrees with no variation",
      "Arm position does not affect the brachial plexus — only leg positioning matters for nerve injuries"
    ],
    correctAnswer: 1,
    rationaleLong: "The brachial plexus is a network of nerves (C5-T1) that innervates the upper extremity. It courses from the cervical spine through the scalene muscles, over the first rib, under the clavicle, and into the axilla. When the arm is abducted beyond 90 degrees, the brachial plexus is stretched over the head of the humerus and across the first rib, creating tension that can cause ischemia and nerve injury (neurapraxia). This injury can result in numbness, weakness, or paralysis of the affected arm. AORN guidelines recommend that arm abduction should not exceed 90 degrees on padded arm boards. Additional positioning precautions to prevent brachial plexus injury include: (1) The arm board should be at the same level as the operating table to prevent hyperextension; (2) The forearm should be supinated (palm up) when abducted to externally rotate the humerus and reduce brachial plexus tension; (3) Padding should protect the ulnar nerve at the elbow (the ulnar nerve is the most commonly injured peripheral nerve during surgery); (4) If the arms are tucked at the sides, ensure they are in a neutral position with the palms facing the body, and that no pressure is applied from team members leaning against the arms. Positioning-related nerve injuries are the second most common claim in the ASA Closed Claims database.",
    learningObjective: "Apply safe arm positioning guidelines to prevent brachial plexus injury during surgical procedures",
    blueprintCategory: "Patient Safety",
    subtopic: "nerve injury prevention",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Maximum arm abduction: 90 degrees. Forearm supinated (palm up) when abducted. Ulnar nerve is the most commonly injured peripheral nerve in surgery.",
    clinicalPearls: [
      "Arm abduction should not exceed 90 degrees to protect the brachial plexus",
      "Supinate the forearm (palm up) when arm is abducted to reduce brachial plexus tension",
      "Ulnar nerve at the elbow is the most commonly injured peripheral nerve during surgery"
    ],
    safetyNote: "Document arm position and padding before and after the procedure — positioning injuries may not manifest until hours after surgery",
    distractorRationales: [
      "Padding alone does not prevent brachial plexus stretch — the angle of abduction is the critical factor",
      "Exactly 45 degrees is unnecessarily restrictive — abduction up to 90 degrees is safe with proper padding",
      "Upper extremity positioning significantly affects brachial plexus and ulnar nerve injury risk"
    ]
  },
  {
    stem: "A patient scheduled for a left knee arthroscopy has surgical site marking performed by the surgeon. The mark should be placed in which location and in what manner?",
    options: [
      "On the operative knee, with the word 'YES' or the surgeon's initials, placed with an indelible marker at or near the incision site, visible after draping",
      "On the non-operative (right) knee, with the word 'NO' to indicate which side should NOT be operated on",
      "On the patient's gown near the operative side",
      "On the patient's chart and consent form only — no skin marking is required"
    ],
    correctAnswer: 0,
    rationaleLong: "The Joint Commission's Universal Protocol requires surgical site marking for all procedures involving laterality (right vs. left), multiple structures (e.g., fingers, toes), or multiple levels (e.g., spinal surgery). The site mark must be placed: (1) ON the operative site or as close to the operative site as possible; (2) With the word 'YES' or the surgeon's initials — never using marks like 'X' which can be ambiguous (does X mean 'operate here' or 'do NOT operate here'?); (3) Using a permanent/indelible marker that will remain visible after skin preparation and draping; (4) By the surgeon or the privileged practitioner performing the procedure — the mark should be made with the patient awake and participating in the verification process when possible. Marking the NON-operative site with 'NO' is specifically discouraged because it can create confusion and does not serve as a positive identification of the correct surgical site. Marking the patient's gown or chart does not meet the requirement for a site-specific mark on the patient. The site mark should be visible after draping — if the prep or drapes will cover the mark, it should be placed in a location that remains visible, or the mark should be visible during the Time Out before the drapes are placed. Site marking is a critical component of wrong-site surgery prevention.",
    learningObjective: "Apply TJC Universal Protocol site marking requirements for procedures involving laterality",
    blueprintCategory: "Patient Safety",
    subtopic: "surgical site marking",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Mark the OPERATIVE site with 'YES' or surgeon's initials — NOT 'X' (ambiguous). Do NOT mark the non-operative site. Mark must be visible after prep and draping.",
    clinicalPearls: [
      "Mark the operative site with 'YES' or surgeon's initials using an indelible marker",
      "Never use 'X' for site marking — it is ambiguous and can mean 'do not operate here'",
      "The surgeon/privileged practitioner must make the mark with the patient participating in verification"
    ],
    safetyNote: "Site marking is a critical step in preventing wrong-site surgery — never skip or delegate to non-privileged personnel",
    distractorRationales: [
      "Marking the non-operative site with 'NO' creates confusion and is not recommended by TJC",
      "Marking the gown does not meet the requirement for site-specific patient skin marking",
      "Chart documentation alone is insufficient — a physical mark on the patient is required"
    ]
  },
  {
    stem: "A patient is receiving a blood transfusion intraoperatively during a total hip arthroplasty. Ten minutes after initiation, the patient develops fever (temp rising from 36.8°C to 38.6°C), chills, flank pain, and dark-colored urine in the Foley catheter. What transfusion reaction is MOST likely occurring?",
    options: [
      "Febrile non-hemolytic transfusion reaction — mild and self-limiting",
      "Acute hemolytic transfusion reaction (ABO incompatibility) — stop the transfusion immediately and notify the blood bank",
      "Transfusion-related acute lung injury (TRALI)",
      "Allergic transfusion reaction requiring antihistamine only"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of fever, chills, flank pain, and dark-colored urine (hemoglobinuria) developing shortly after transfusion initiation is the classic presentation of an acute hemolytic transfusion reaction, most commonly caused by ABO blood group incompatibility. This occurs when the recipient's pre-existing antibodies (anti-A, anti-B) attack the transfused incompatible red blood cells, causing rapid intravascular hemolysis. The released free hemoglobin causes hemoglobinuria (dark/tea-colored urine), and the hemolytic process triggers disseminated intravascular coagulation (DIC), acute kidney injury, and potentially cardiovascular collapse. Immediate actions include: (1) STOP the transfusion immediately; (2) Disconnect the blood product and tubing from the IV — do not flush the line as this pushes more incompatible blood into the patient; (3) Start a new IV line with normal saline to maintain renal perfusion; (4) Notify the blood bank and the attending physician; (5) Send the blood bag, tubing, and post-reaction blood and urine samples to the blood bank for investigation; (6) Monitor and support vital signs, urine output, and coagulation status; (7) Administer IV fluids aggressively to maintain urine output >1 mL/kg/hr to prevent hemoglobin precipitation in the renal tubules. The root cause is almost always a patient identification or labeling error — wrong blood administered to the wrong patient. This is why two-nurse verification of patient identity and blood product labeling at the bedside is required before every transfusion.",
    learningObjective: "Recognize acute hemolytic transfusion reaction and implement immediate interventions to prevent further hemolysis and organ damage",
    blueprintCategory: "Patient Safety",
    subtopic: "transfusion reactions",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Flank pain + dark urine + fever = acute hemolytic reaction (ABO incompatibility). Febrile non-hemolytic reactions do NOT cause dark urine or flank pain.",
    clinicalPearls: [
      "Acute hemolytic reaction: fever, chills, flank pain, hemoglobinuria — caused by ABO incompatibility",
      "Stop transfusion, start new IV with NS, maintain UOP >1 mL/kg/hr, send blood bag to bank",
      "Root cause is almost always a patient/blood product identification error — prevention relies on two-nurse verification"
    ],
    safetyNote: "ALWAYS verify patient identity with two independent identifiers and cross-check the blood product label before initiating transfusion",
    distractorRationales: [
      "Febrile non-hemolytic reactions cause fever but NOT flank pain or hemoglobinuria",
      "TRALI presents with acute respiratory distress, bilateral pulmonary infiltrates, and hypoxia, not hemoglobinuria",
      "Allergic reactions present with urticaria, pruritus, and possible anaphylaxis, not hemoglobinuria and flank pain"
    ]
  },
  {
    stem: "The perioperative nurse is conducting a root cause analysis (RCA) after a retained surgical sponge was discovered on a postoperative X-ray. Which component of the RCA process is MOST important for preventing recurrence?",
    options: [
      "Identifying which individual nurse made the counting error and implementing disciplinary action",
      "Identifying the systemic factors and process failures that contributed to the event and implementing system-level corrective actions to prevent recurrence",
      "Determining the cost of the additional surgery required to retrieve the sponge",
      "Interviewing only the surgeon to determine what happened during the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "Root cause analysis (RCA) is a structured process for identifying the underlying systemic, process, and organizational factors that contributed to an adverse event. The most critical component of an effective RCA is the identification of systemic root causes — not individual blame — and the development and implementation of system-level corrective actions that prevent recurrence. A just culture approach recognizes that most errors result from flawed systems, processes, and conditions that lead predictable human beings to make predictable mistakes. For a retained surgical sponge, systemic factors to investigate include: (1) Were the counting policies and procedures followed? (2) Was there a staffing issue (relief of scrub or circulating nurse during the count)? (3) Were there distractions during the counting process? (4) Was there adequate lighting for the count? (5) Were radiopaque sponges used exclusively? (6) Was the surgical count documentation system adequate? (7) Was there a policy for routine wound X-ray for high-risk procedures? (8) Were there equipment issues (retained sponge detection technology available but not used)? Corrective actions should address the systemic issues identified: improved counting procedures, mandatory wound X-ray before closure for high-risk procedures, implementation of radiofrequency sponge detection systems, staffing policies that minimize count interruptions, and simulation training for count procedures.",
    learningObjective: "Apply just culture and systems-thinking principles in root cause analysis to identify systemic factors and implement corrective actions",
    blueprintCategory: "Patient Safety",
    subtopic: "root cause analysis",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "RCA focuses on SYSTEMIC factors and process failures, NOT individual blame. A just culture approach recognizes that systems create the conditions for human error.",
    clinicalPearls: [
      "RCA identifies systemic root causes and implements system-level corrective actions",
      "Just culture: distinguish between human error (console), at-risk behavior (coach), and reckless behavior (discipline)",
      "Retained surgical items are 'never events' — preventable through system improvements"
    ],
    safetyNote: "Effective RCA requires input from all team members who were involved in the event, not just one person",
    distractorRationales: [
      "Individual blame does not prevent recurrence — the system allowed the error to occur and must be fixed",
      "Cost analysis is an administrative concern but does not address the root cause of the safety failure",
      "Interviewing only the surgeon provides an incomplete picture — all team members must contribute to the investigation"
    ]
  },
  {
    stem: "During a robotic-assisted surgery, the robot malfunctions and the surgical arms are locked in position within the patient's abdomen. The surgeon cannot free the arms. What is the perioperative team's PRIORITY action?",
    options: [
      "Power cycle the robotic system by turning it off and back on",
      "Follow the facility's robotic emergency undocking protocol, which includes manual release of the robotic arms from the trocars and conversion to open or laparoscopic surgery",
      "Call the manufacturer's technical support line and wait for instructions",
      "Attempt to pull the robotic arms out of the patient by force"
    ],
    correctAnswer: 1,
    rationaleLong: "Robotic surgical system malfunction during a procedure is a patient safety emergency that requires immediate, practiced response. Every facility that uses robotic surgical systems must have a documented emergency undocking protocol that all team members are trained to execute. The protocol typically includes: (1) Manual release of the robotic arms from the trocar cannulas using the emergency release mechanisms built into the robotic system; (2) Once the arms are freed from the trocars, the robot is moved away from the patient; (3) The surgeon converts to either conventional laparoscopic surgery or open surgery to complete the procedure safely. The perioperative nursing team must know: the location of the emergency release mechanisms, the steps for manual undocking, the location of backup conventional laparoscopic and open instrument sets (which should be in the room for every robotic case), and their specific role in the emergency protocol. Regular drills should be conducted so the team can perform the undocking efficiently under pressure. Power cycling the system may be appropriate for minor software issues but NOT when the arms are locked inside the patient. Calling the manufacturer for real-time instructions introduces dangerous delays. Forcefully pulling the arms risks visceral injury, hemorrhage, and trocar site trauma. The key principle is that the team must be prepared to convert any robotic case to conventional surgery at any time.",
    learningObjective: "Implement emergency robotic undocking procedures during intraoperative robotic malfunction",
    blueprintCategory: "Patient Safety",
    subtopic: "robotic surgery safety",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Every robotic case must have conventional laparoscopic and open instruments AVAILABLE in the room. Emergency undocking must be practiced through regular drills.",
    clinicalPearls: [
      "Every facility must have a documented robotic emergency undocking protocol with regular drills",
      "Backup conventional laparoscopic and open instruments must be available in the room for every robotic case",
      "All team members must know their role in the emergency undocking protocol"
    ],
    safetyNote: "Never attempt to forcefully remove robotic arms from the patient — use the emergency release mechanisms designed into the system",
    distractorRationales: [
      "Power cycling while arms are inside the patient may cause unpredictable arm movement and injury",
      "Waiting for manufacturer support introduces dangerous delays during an active patient safety emergency",
      "Forcefully removing arms risks visceral perforation, hemorrhage, and significant patient injury"
    ]
  },
  {
    stem: "A perioperative nurse discovers that a specimen obtained during a breast biopsy has been mislabeled — the specimen container has a different patient's name. What is the CORRECT action?",
    options: [
      "Cross out the wrong name on the label and write the correct patient's name",
      "Immediately quarantine the specimen, notify the surgeon and pathology department, and initiate the specimen error protocol to determine if the specimen can be correctly identified",
      "Discard the specimen and document that it was lost",
      "Send the specimen to pathology with a note explaining the labeling error"
    ],
    correctAnswer: 1,
    rationaleLong: "Specimen misidentification is a critical patient safety event that can result in devastating consequences: a patient may receive a false-negative diagnosis (missing a cancer diagnosis) or a false-positive diagnosis (receiving unnecessary treatment for a cancer they do not have). The correct response to discovering a mislabeled specimen is: (1) QUARANTINE the specimen immediately — do not discard it, alter the label, or send it to pathology with the incorrect label; (2) Notify the surgeon immediately — the surgeon may be able to provide information to help correctly identify the specimen (e.g., if the surgeon can confirm the specimen was obtained from this specific patient based on the chain of custody in the OR); (3) Notify the pathology department — they need to know about the error and may have protocols for handling mislabeled specimens; (4) Initiate the facility's specimen error protocol — this typically involves documenting the error, investigating the chain of custody, determining if the specimen can be correctly identified with certainty, and if not, whether a repeat biopsy is necessary; (5) Complete an incident report/safety event report. Crossing out the wrong name and writing the correct one does not establish that the specimen was actually from the correct patient — there may be TWO mislabeled specimens. Discarding the specimen destroys irreplaceable diagnostic tissue. The circulating nurse is responsible for specimen handling and labeling in the operating room.",
    learningObjective: "Respond correctly to specimen mislabeling events to prevent diagnostic errors and ensure patient safety",
    blueprintCategory: "Patient Safety",
    subtopic: "specimen management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never cross out and relabel a mislabeled specimen — the chain of custody is broken and you cannot be certain which patient the specimen belongs to.",
    clinicalPearls: [
      "Specimen mislabeling can result in missed cancer diagnoses or unnecessary cancer treatment",
      "Quarantine the specimen, notify surgeon and pathology, and initiate specimen error protocol",
      "The circulating nurse is responsible for specimen labeling in the OR — use read-back verification"
    ],
    safetyNote: "Label every specimen container IN THE PRESENCE of the surgeon at the time the specimen is received — never label in advance or from memory",
    distractorRationales: [
      "Relabeling does not establish correct specimen identity — there may be two mislabeled specimens from different patients",
      "Discarding the specimen destroys diagnostic tissue that may be irreplaceable and causes harm through missed diagnosis",
      "Sending a mislabeled specimen to pathology perpetuates the identification error"
    ]
  },
  {
    stem: "A perioperative nurse is performing a medication verification for a patient's epidural catheter. The epidural infusion is labeled 'bupivacaine 0.125% with fentanyl 2 mcg/mL.' The nurse notices that the tubing from the epidural pump is connected to the patient's peripheral IV catheter instead of the epidural catheter. What is the PRIORITY action?",
    options: [
      "Adjust the flow rate to compensate for the incorrect route of administration",
      "Immediately stop the infusion, disconnect the tubing from the IV catheter, assess the patient for adverse effects of IV bupivacaine/fentanyl administration, and notify the anesthesiologist urgently",
      "Reconnect the tubing to the epidural catheter and continue the infusion",
      "Document the error and continue monitoring the patient"
    ],
    correctAnswer: 1,
    rationaleLong: "The accidental intravenous administration of an epidural solution containing local anesthetic (bupivacaine) is a life-threatening medication error that can cause cardiovascular collapse and central nervous system toxicity. Bupivacaine is particularly cardiotoxic when administered intravenously — it can cause refractory ventricular dysrhythmias, cardiac arrest, and death. Even the dilute concentration of 0.125% can cause systemic toxicity if enough volume has been infused. The immediate actions are: (1) STOP the infusion immediately — every additional drop increases the risk of systemic toxicity; (2) Disconnect the tubing from the IV catheter to prevent further inadvertent administration; (3) Assess the patient for signs of local anesthetic systemic toxicity (LAST): perioral numbness, metallic taste, tinnitus, visual disturbances, confusion, seizures, cardiovascular depression (hypotension, bradycardia, dysrhythmias); (4) Notify the anesthesiologist urgently — they need to evaluate the patient and may need to administer Intralipid (20% lipid emulsion) which is the specific antidote for local anesthetic systemic toxicity; (5) Have the crash cart and lipid emulsion available at bedside; (6) Monitor the patient continuously with ECG, pulse oximetry, and blood pressure monitoring. This type of error (wrong route) is prevented by using connector systems that prevent misconnection between epidural and IV tubing (such as NRFit connectors for neuraxial applications), proper line tracing at every handoff, and standardized labeling protocols.",
    learningObjective: "Recognize wrong-route medication administration as a life-threatening emergency and implement immediate intervention",
    blueprintCategory: "Patient Safety",
    subtopic: "medication safety",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IV bupivacaine is cardiotoxic and can cause cardiac arrest. Intralipid 20% (lipid emulsion) is the specific antidote for local anesthetic systemic toxicity (LAST).",
    clinicalPearls: [
      "IV bupivacaine can cause refractory cardiac arrest — even dilute concentrations are dangerous",
      "Intralipid 20% (lipid emulsion) is the specific antidote for local anesthetic systemic toxicity",
      "NRFit connectors prevent neuraxial-to-IV tubing misconnections — a systems-level prevention strategy"
    ],
    safetyNote: "Trace ALL lines from the patient to the pump at every handoff — wrong-route errors are among the most dangerous medication errors",
    distractorRationales: [
      "Adjusting the flow rate does not address the fundamental problem of wrong-route administration",
      "Simply reconnecting to the epidural catheter does not address the IV bupivacaine already administered and delays necessary assessment",
      "Documentation without immediate intervention fails to protect the patient from ongoing systemic toxicity"
    ]
  },
  {
    stem: "A patient with a documented allergy to iodine is scheduled for a cardiac catheterization. The surgeon plans to use iodinated contrast dye. The perioperative nurse should implement which safety measure?",
    options: [
      "Cancel the procedure since iodine allergy is an absolute contraindication to iodinated contrast",
      "Communicate the allergy to the entire team, administer premedication with corticosteroids and antihistamines per the facility protocol, and ensure emergency resuscitation medications are immediately available",
      "Substitute gadolinium-based contrast as a safe alternative",
      "Apply a test dose of contrast dye on the patient's skin to check for a reaction"
    ],
    correctAnswer: 1,
    rationaleLong: "A history of iodine allergy or prior contrast reaction is NOT an absolute contraindication to iodinated contrast administration, but it does increase the risk of an adverse reaction. The perioperative nurse should implement a premedication protocol to reduce the risk of contrast reaction. Standard premedication protocols typically include: oral prednisone 50 mg at 13, 7, and 1 hour before the procedure (or IV hydrocortisone if oral route is not possible), plus diphenhydramine 50 mg 1 hour before the procedure. Some protocols also include an H2 blocker (ranitidine or famotidine). It is important to note that true 'iodine allergy' is a misnomer — iodine is an essential element in the human body (present in thyroid hormones) and true allergy to elemental iodine is essentially impossible. What patients commonly report as 'iodine allergy' is either: (1) a previous contrast media reaction (which is a reaction to the contrast molecule, not the iodine component), (2) a topical iodine/betadine skin sensitivity, or (3) a shellfish allergy (shellfish allergy is related to tropomyosin protein, NOT iodine content). However, regardless of the mechanism, a history of previous contrast reaction does increase the risk of subsequent reactions (2-6x higher than the general population), so premedication is indicated. Gadolinium is used for MRI, not cardiac catheterization, and has its own risk profile including nephrogenic systemic fibrosis. Skin testing is unreliable for predicting contrast reactions.",
    learningObjective: "Implement appropriate premedication protocols for patients with iodine or contrast allergy undergoing procedures requiring iodinated contrast",
    blueprintCategory: "Patient Safety",
    subtopic: "contrast allergy management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Iodine allergy is NOT an absolute contraindication to contrast. Premedication with steroids and antihistamines reduces reaction risk. 'Iodine allergy' is a misnomer.",
    clinicalPearls: [
      "True iodine allergy does not exist — contrast reactions are to the contrast molecule, not iodine",
      "Shellfish allergy is to tropomyosin, NOT iodine — it does not increase contrast reaction risk",
      "Premedication: prednisone at 13, 7, 1 hour before procedure + diphenhydramine 1 hour before"
    ],
    safetyNote: "Even with premedication, have emergency resuscitation medications (epinephrine, antihistamines) immediately available — breakthrough reactions can still occur",
    distractorRationales: [
      "Iodine allergy is not an absolute contraindication — premedication reduces risk sufficiently for most patients",
      "Gadolinium is for MRI contrast and carries its own risks — it is not a routine substitute for iodinated contrast in cardiac catheterization",
      "Skin testing is unreliable for predicting contrast reactions and is not recommended"
    ]
  }
];
