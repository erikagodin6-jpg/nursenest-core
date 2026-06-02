import type { ExamQuestion } from "./types";

export const rpnExpansionAQuestions: ExamQuestion[] = [
  // ===== INFECTION CONTROL (Questions 1-10) =====
  {
    q: "A practical nurse is preparing to enter the room of a client diagnosed with pulmonary tuberculosis. Which personal protective equipment (PPE) is required?",
    o: ["N95 respirator mask", "Surgical mask", "Face shield only", "Gown and gloves only"],
    a: 0,
    r: "Pulmonary tuberculosis is spread via airborne droplet nuclei, requiring airborne precautions including an N95 respirator mask. A surgical mask does not filter airborne particles smaller than 5 microns. A face shield alone is insufficient. Gown and gloves are used for contact precautions but do not protect against airborne transmission.",
    s: "Infection Control"
  },
  {
    q: "A practical nurse is caring for a client with Clostridioides difficile (C. diff) infection. Which hand hygiene method is most appropriate after removing gloves?",
    o: ["Washing hands with soap and water for at least 20 seconds", "Using alcohol-based hand sanitizer", "Wiping hands with a disinfectant wipe", "Applying hand lotion followed by hand sanitizer"],
    a: 0,
    r: "C. difficile produces spores that are resistant to alcohol-based sanitizers. Soap and water with mechanical friction is required to physically remove spores from the hands. Alcohol-based sanitizer is ineffective against C. diff spores. Disinfectant wipes are for surfaces, not hand hygiene. Hand lotion does not provide antimicrobial action.",
    s: "Infection Control"
  },
  {
    q: "The practical nurse observes a colleague recapping a used needle after administering an injection. What is the most appropriate action?",
    o: ["Remind the colleague that recapping used needles is not recommended and to use the sharps container", "Report the colleague to management immediately without speaking to them", "Recap the needle properly for the colleague", "Ignore the behavior as it is the colleague's responsibility"],
    a: 0,
    r: "Recapping used needles increases the risk of needlestick injuries and bloodborne pathogen exposure. The nurse should address unsafe practices immediately by reminding the colleague of proper sharps disposal. Reporting without first addressing the issue may not be the most collegial approach. Recapping for the colleague perpetuates the unsafe practice. Ignoring the behavior fails to promote workplace safety.",
    s: "Infection Control"
  },
  {
    q: "A client is placed on contact precautions for methicillin-resistant Staphylococcus aureus (MRSA) wound infection. Which action by the practical nurse requires correction?",
    o: ["Using the same stethoscope for this client and the next client without disinfecting", "Donning a gown and gloves before entering the room", "Placing the client in a private room", "Removing PPE before exiting the room"],
    a: 0,
    r: "Equipment used for a client on contact precautions must be dedicated to that client or disinfected between uses to prevent MRSA transmission. Sharing equipment without disinfection is a breach of contact precautions. Gown and gloves, private room placement, and proper PPE removal are all correct practices for contact isolation.",
    s: "Infection Control"
  },
  {
    q: "A practical nurse is preparing a sterile field for a wound dressing change. Which action would contaminate the sterile field?",
    o: ["Reaching across the sterile field to grab supplies from the other side", "Opening the sterile package away from the body", "Placing sterile items within the center of the sterile field", "Keeping the sterile field within the nurse's line of vision"],
    a: 0,
    r: "Reaching across a sterile field introduces non-sterile clothing and skin over the field, risking contamination by microorganisms falling onto the sterile area. Opening packages away from the body, placing items centrally, and maintaining visual contact with the field are all correct techniques that preserve sterility.",
    s: "Infection Control"
  },
  {
    q: "Which client should the practical nurse assign to a negative-pressure airflow room?",
    o: ["A client with suspected active tuberculosis", "A client with a surgical wound infection", "A client with urinary tract infection", "A client with cellulitis of the lower extremity"],
    a: 0,
    r: "Negative-pressure rooms are designed for clients with airborne infections such as tuberculosis. The room prevents contaminated air from flowing into the hallway by pulling air into the room and exhausting it outside. Wound infections, UTIs, and cellulitis require standard or contact precautions but do not require negative-pressure isolation.",
    s: "Infection Control"
  },
  {
    q: "A practical nurse is performing hand hygiene before inserting a urinary catheter. The nurse should scrub hands for a minimum of how many seconds?",
    o: ["20 seconds", "5 seconds", "60 seconds", "10 seconds"],
    a: 0,
    r: "The recommended minimum hand hygiene duration for routine handwashing is 20 seconds with soap and water, which allows adequate friction to remove transient microorganisms. Five or ten seconds is insufficient for effective microbial removal. While 60 seconds is not harmful, it exceeds the recommended minimum and is not required for routine handwashing.",
    s: "Infection Control"
  },
  {
    q: "A practical nurse sustains a needlestick injury while disposing of a used insulin syringe. What is the priority first action?",
    o: ["Wash the puncture site immediately with soap and water", "Apply a tourniquet proximal to the injury", "Report to the charge nurse before doing anything", "Squeeze the wound to push out blood"],
    a: 0,
    r: "After a needlestick injury, the priority is to immediately wash the wound with soap and water to reduce the risk of infection. A tourniquet is not indicated. While reporting is essential, decontamination of the wound is the first action. Squeezing the wound is not recommended as it may increase tissue damage and does not effectively reduce infection risk.",
    s: "Infection Control"
  },
  {
    q: "The practical nurse is educating a client about preventing surgical site infections after discharge. Which client statement indicates effective learning?",
    o: ["I will wash my hands before and after touching my incision site", "I will remove the dressing after 24 hours and leave the wound open to air", "I will apply antibiotic ointment to the incision every hour", "I will soak the incision in a warm bath to promote healing"],
    a: 0,
    r: "Hand hygiene before and after touching the incision site is a key infection prevention measure. Removing the dressing prematurely or leaving wounds open increases infection risk. Applying antibiotic ointment every hour is excessive and not typically recommended. Soaking a fresh surgical incision can introduce bacteria and impair wound healing.",
    s: "Infection Control"
  },
  {
    q: "A practical nurse is caring for a client with varicella (chickenpox). Which type of transmission precaution is required in addition to standard precautions?",
    o: ["Airborne and contact precautions", "Droplet precautions only", "Contact precautions only", "Protective (reverse) isolation"],
    a: 0,
    r: "Varicella is transmitted via airborne route and through direct contact with vesicular fluid. Both airborne and contact precautions are required. Droplet precautions alone are insufficient as varicella particles can remain suspended in the air. Contact precautions alone do not address the airborne component. Protective isolation is used for immunocompromised clients, not for containing infection.",
    s: "Infection Control"
  },
  // ===== WOUND CARE (Questions 11-20) =====
  {
    q: "A practical nurse is assessing a pressure injury that has full-thickness tissue loss with visible adipose tissue but no exposed bone, tendon, or muscle. How should this wound be staged?",
    o: ["Stage 3 pressure injury", "Stage 1 pressure injury", "Stage 2 pressure injury", "Stage 4 pressure injury"],
    a: 0,
    r: "A Stage 3 pressure injury involves full-thickness tissue loss where subcutaneous fat may be visible, but bone, tendon, and muscle are not exposed. Stage 1 involves non-blanchable erythema of intact skin. Stage 2 involves partial-thickness loss with exposed dermis. Stage 4 involves full-thickness loss with exposed bone, tendon, or muscle.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse is performing a wound irrigation. At what pressure should the irrigation solution be delivered to effectively cleanse the wound without causing tissue damage?",
    o: ["4 to 15 psi using a 35 mL syringe with a 19-gauge angiocatheter", "Greater than 25 psi using a high-pressure spray device", "Less than 1 psi by pouring solution gently over the wound", "50 psi using a water pick device"],
    a: 0,
    r: "Effective wound irrigation requires 4 to 15 psi, which can be achieved with a 35 mL syringe and 19-gauge angiocatheter. This pressure removes debris and bacteria without damaging healing tissue. Pressures above 15 psi can drive bacteria into tissue. Pouring solution provides insufficient pressure for debridement. Water pick devices generate excessive force that damages granulation tissue.",
    s: "Wound Care"
  },
  {
    q: "A client has a wound with yellow, stringy tissue covering the wound bed. The practical nurse documents this tissue as which of the following?",
    o: ["Slough", "Eschar", "Granulation tissue", "Epithelial tissue"],
    a: 0,
    r: "Slough is yellow, tan, or gray stringy tissue composed of dead cells and debris that covers the wound bed. It must often be removed to promote healing. Eschar is dry, thick, black or brown necrotic tissue. Granulation tissue is red, moist, and beefy, indicating healthy healing. Epithelial tissue is new pink skin growing from the wound edges.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse is selecting a dressing for a wound with moderate exudate and healthy granulation tissue. Which dressing type is most appropriate?",
    o: ["Foam dressing", "Transparent film dressing", "Dry gauze dressing", "Alginate dressing"],
    a: 0,
    r: "Foam dressings are ideal for wounds with moderate exudate as they absorb drainage while maintaining a moist wound environment that supports granulation. Transparent films have no absorptive capacity and are suited for low-exudate wounds. Dry gauze can adhere to the wound bed and damage granulation tissue upon removal. Alginate dressings are indicated for heavily exudating wounds.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse notices purulent, foul-smelling drainage from a client's surgical wound on postoperative day 5. The wound edges are separated. What is the priority nursing action?",
    o: ["Notify the healthcare provider of findings suggesting wound infection and dehiscence", "Apply a new sterile dressing and document the findings", "Irrigate the wound with hydrogen peroxide", "Apply adhesive skin closures to approximate the wound edges"],
    a: 0,
    r: "Purulent foul-smelling drainage and wound edge separation on postoperative day 5 suggest wound infection and dehiscence, which require immediate provider notification for assessment and possible intervention. Simply redressing does not address the complication. Hydrogen peroxide is cytotoxic to healing tissue. Applying closures to a potentially infected, dehisced wound is contraindicated.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse is caring for a client with a new colostomy. During a pouch change, the nurse notes the stoma appears dark purple. What should the nurse do first?",
    o: ["Notify the healthcare provider immediately as this may indicate ischemia", "Document the finding as a normal variation", "Apply the new pouch and reassess in 4 hours", "Clean the stoma vigorously to improve blood flow"],
    a: 0,
    r: "A dark purple or black stoma suggests compromised blood supply and potential ischemia, which is a surgical emergency. The provider must be notified immediately. A healthy stoma should be pink to red and moist. Documenting as normal is incorrect. Delaying assessment risks tissue necrosis. Vigorous cleaning does not address vascular compromise and may cause further injury.",
    s: "Wound Care"
  },
  {
    q: "The practical nurse is positioning a client to prevent pressure injuries. Which intervention is most effective for a client who is bedbound?",
    o: ["Repositioning the client at least every 2 hours", "Massaging reddened bony prominences", "Placing the client on an air ring (donut cushion)", "Keeping the head of bed elevated at 60 degrees continuously"],
    a: 0,
    r: "Repositioning every 2 hours redistributes pressure and is the most effective nursing intervention to prevent pressure injuries. Massaging reddened areas can further damage compromised tissue. Donut cushions concentrate pressure around the ring edges and are not recommended. Continuous high head-of-bed elevation increases sacral shearing forces.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse is measuring a wound and documents it as 4 cm length x 2 cm width x 1 cm depth. Which measurement technique is correct?",
    o: ["Length is measured head to toe, width is measured side to side, and depth is measured by inserting a cotton-tipped applicator perpendicular to the wound bed", "Length is measured side to side and width is measured head to toe", "Depth is estimated visually without probing", "All measurements are taken with a tape measure held above the wound"],
    a: 0,
    r: "Standardized wound measurement uses a clock-face method: length is head to toe (12 to 6 o'clock), width is side to side (3 to 9 o'clock), and depth is measured by inserting a cotton-tipped applicator at the deepest point perpendicular to the wound surface. Reversing length and width produces inconsistent documentation. Visual estimation of depth is inaccurate. Measurements must be taken at the wound surface, not above it.",
    s: "Wound Care"
  },
  {
    q: "A client with diabetes has a foot ulcer that has been present for 6 weeks with no signs of improvement. The practical nurse recognizes that which factor is most likely delaying wound healing?",
    o: ["Elevated blood glucose levels impairing immune function and tissue perfusion", "The client's age of 45 years", "Consumption of a high-protein diet", "Use of non-adherent wound dressings"],
    a: 0,
    r: "Hyperglycemia impairs white blood cell function, reduces tissue perfusion through microvascular damage, and delays collagen synthesis, all of which significantly impair wound healing in diabetic clients. Age 45 is not a significant wound-healing risk factor. High-protein diets support wound healing. Non-adherent dressings protect the wound bed and promote healing.",
    s: "Wound Care"
  },
  {
    q: "A practical nurse is removing a wound packing strip from a deep wound. The nurse counts the removed packing and finds it does not match the amount documented as inserted. What is the priority action?",
    o: ["Notify the healthcare provider that retained packing material is suspected", "Repack the wound with new packing material", "Document the discrepancy and continue with the dressing change", "Irrigate the wound forcefully to flush out any remaining packing"],
    a: 0,
    r: "A discrepancy in wound packing count indicates retained material, which is a foreign body that can cause infection and impair healing. The provider must be notified to determine the next steps, which may include imaging or wound exploration. Repacking over retained material worsens the problem. Documentation alone is insufficient. Forceful irrigation may not retrieve retained packing and could cause harm.",
    s: "Wound Care"
  },
  // ===== PAIN ASSESSMENT (Questions 21-30) =====
  {
    q: "A practical nurse is assessing pain in a 4-year-old child who is postoperative. Which pain assessment tool is most appropriate for this client?",
    o: ["Wong-Baker FACES Pain Rating Scale", "Numeric Rating Scale (0-10)", "Visual Analog Scale", "McGill Pain Questionnaire"],
    a: 0,
    r: "The Wong-Baker FACES scale uses facial expressions and is validated for children ages 3 and older who may not understand numeric concepts. The Numeric Rating Scale requires abstract thinking about numbers, which is developmentally inappropriate for a 4-year-old. The Visual Analog Scale requires the ability to mark a point on a line. The McGill Pain Questionnaire is complex and designed for adults.",
    s: "Fundamentals"
  },
  {
    q: "A client rates pain as 8 out of 10 after receiving an analgesic 30 minutes ago. The practical nurse should take which action next?",
    o: ["Reassess the client and notify the healthcare provider that the current pain management is ineffective", "Tell the client that the medication needs more time to work", "Administer another dose of the same medication immediately", "Ask the client to try deep breathing and wait another hour"],
    a: 0,
    r: "If pain remains at 8/10 thirty minutes after analgesic administration, the current intervention is ineffective and the provider should be notified for possible dosage adjustment or alternative medication. Most oral analgesics should show some effect within 30 minutes. Administering another dose without an order is outside the nurse's scope. Non-pharmacological interventions alone are insufficient for severe pain.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client with chronic lower back pain who states, 'I don't look like I'm in pain, but I am.' The nurse's best response is:",
    o: ["I believe you. Pain is whatever you say it is. Let's work on managing it.", "You seem comfortable, so your pain is probably not that severe.", "Try not to focus on the pain. Distraction might help more than medication.", "I need to see physical signs of pain before I can medicate you."],
    a: 0,
    r: "Pain is a subjective experience, and the client's self-report is the most reliable indicator of pain. Clients with chronic pain may not exhibit observable signs due to physiological adaptation. Dismissing the client's report, suggesting distraction as a sole strategy, or requiring visible signs violates the principle that pain is whatever the client says it is.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is assessing pain in a nonverbal client with advanced dementia. Which assessment approach is most appropriate?",
    o: ["Use a behavioral pain scale that evaluates facial expressions, body movements, and vocalizations", "Assume the client is not in pain because they cannot verbalize it", "Rely solely on vital sign changes to determine pain level", "Ask the family to rate the client's pain on a 0-10 scale"],
    a: 0,
    r: "Behavioral pain scales such as the PAINAD or Abbey scale assess observable indicators including facial expressions, body language, and vocalizations in nonverbal clients. Assuming no pain because the client cannot verbalize is a dangerous misconception. Vital signs alone are unreliable pain indicators. Family input is valuable but should supplement, not replace, a validated behavioral tool.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse administers morphine 4 mg IV to a postoperative client. Which assessment is most important 15 minutes after administration?",
    o: ["Respiratory rate and level of sedation", "Blood pressure only", "Urine output", "Wound drainage amount"],
    a: 0,
    r: "Respiratory depression is the most serious adverse effect of opioid analgesics. Monitoring respiratory rate and sedation level 15 minutes after IV morphine is critical because peak effect occurs rapidly. While blood pressure monitoring is important, respiratory depression is the primary life-threatening concern. Urine output and wound drainage are not directly related to opioid side effects.",
    s: "Fundamentals"
  },
  {
    q: "A client with a history of substance use disorder is requesting pain medication after surgery. The practical nurse should:",
    o: ["Administer prescribed pain medication as ordered, as the client has a right to adequate pain management", "Withhold the medication because the client may be drug-seeking", "Administer half the ordered dose to reduce addiction risk", "Tell the client to try non-pharmacological methods first"],
    a: 0,
    r: "All clients have a right to adequate pain management regardless of substance use history. Undertreating pain in clients with substance use disorders is a common form of bias. Withholding or reducing prescribed medications without a provider order is outside the nurse's scope. While non-pharmacological methods are helpful adjuncts, they should not replace prescribed analgesics.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is using the PQRSTU mnemonic to assess a client's chest pain. What does the 'P' stand for?",
    o: ["Provocation or palliation", "Pain location", "Pulse rate", "Prior medical history"],
    a: 0,
    r: "In the PQRSTU pain assessment mnemonic, P stands for Provocation (what causes or worsens the pain) and Palliation (what relieves the pain). This helps identify aggravating and alleviating factors. Pain location is assessed under R (Region/Radiation). Pulse rate and prior history are important but are not represented by the P in this framework.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating a client about using a patient-controlled analgesia (PCA) pump. Which statement by the client indicates the need for further teaching?",
    o: ["My family member can press the button for me if I fall asleep and seem uncomfortable", "I should press the button when I start to feel pain returning", "The pump has a lockout feature so I cannot overdose myself", "I should report any itching or difficulty breathing to the nurse"],
    a: 0,
    r: "PCA by proxy (having someone other than the client press the button) increases the risk of oversedation and respiratory depression. The client must self-administer to ensure they are awake enough to feel pain and request relief. Understanding to press before pain peaks, the lockout feature, and reporting side effects are all correct understandings.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse notes that a client's pain increases during dressing changes. Which type of pain does this represent?",
    o: ["Procedural pain", "Phantom pain", "Referred pain", "Neuropathic pain"],
    a: 0,
    r: "Procedural pain occurs during medical or nursing procedures such as dressing changes, wound care, or injections. It is predictable and can be managed with pre-procedural analgesia. Phantom pain occurs after amputation. Referred pain is felt in an area distant from its source. Neuropathic pain results from nerve damage and presents as burning or tingling.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for an older adult client who reports taking ibuprofen daily for arthritis pain. Which concern should the nurse address?",
    o: ["Risk of gastrointestinal bleeding and renal impairment with chronic NSAID use", "Ibuprofen is the safest analgesic for older adults", "NSAIDs do not interact with other medications", "The client should increase the dose for better pain control"],
    a: 0,
    r: "Chronic NSAID use in older adults increases the risk of GI bleeding, peptic ulcers, renal impairment, and cardiovascular events. Older adults are more vulnerable to these adverse effects. NSAIDs are not the safest option for older adults. NSAIDs have numerous drug interactions. Increasing the dose without provider guidance can worsen adverse effects.",
    s: "Fundamentals"
  },
  // ===== VITAL SIGNS & MONITORING (Questions 31-40) =====
  {
    q: "A practical nurse obtains a blood pressure reading of 82/50 mmHg in a client who was ambulatory 10 minutes ago. What should the nurse do first?",
    o: ["Reposition the client supine, retake the blood pressure, and assess for symptoms of hypotension", "Document the reading and continue with care", "Immediately call a code blue", "Administer IV fluids without a provider order"],
    a: 0,
    r: "An unexpected low blood pressure reading requires verification. The nurse should reposition the client to improve venous return, retake the measurement to confirm accuracy, and assess for associated symptoms such as dizziness, pallor, or diaphoresis. Documentation without further assessment is unsafe. A single low reading does not warrant a code blue. Administering IV fluids requires a provider order.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is taking an apical pulse on a client prescribed digoxin. The heart rate is 56 beats per minute. What is the appropriate action?",
    o: ["Hold the digoxin dose and notify the healthcare provider", "Administer the digoxin as prescribed", "Administer the digoxin and recheck the heart rate in 1 hour", "Document the heart rate and give the medication at the next scheduled time"],
    a: 0,
    r: "Digoxin should be held if the apical heart rate is below 60 bpm in adults because the medication further decreases heart rate through vagal stimulation, risking bradycardia and toxicity. The provider must be notified to evaluate the client and adjust the regimen. Administering the drug at a rate below 60 bpm is unsafe.",
    s: "Fundamentals"
  },
  {
    q: "When assessing a client's respiratory rate, the practical nurse should:",
    o: ["Count respirations for a full 60 seconds without informing the client that breathing is being assessed", "Count respirations for 15 seconds and multiply by 4", "Ask the client to breathe deeply while counting", "Count only after informing the client that respirations are being monitored"],
    a: 0,
    r: "Respiratory rate should be counted for a full 60 seconds for accuracy, especially if the rhythm is irregular. The assessment should be done discreetly because clients may alter their breathing pattern if they know it is being observed. Counting for 15 seconds can miss irregularities. Asking for deep breathing assesses respiratory effort, not resting rate.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is assessing a client's oxygen saturation. The pulse oximeter reads 88% on room air. The client has no respiratory distress. What should the nurse do?",
    o: ["Reposition the probe, check for proper signal, and reassess before notifying the provider", "Immediately apply a non-rebreather mask at 15 L/min", "Document the finding as within normal limits", "Advise the client to take deep breaths and recheck in 2 hours"],
    a: 0,
    r: "Before acting on an unexpected pulse oximetry reading, the nurse should verify accuracy by checking probe placement, perfusion, and signal quality. Factors such as cold extremities, nail polish, or poor perfusion can cause falsely low readings. An SpO2 of 88% is below normal (95-100%) and requires investigation. Applying high-flow oxygen without verification may be premature. Waiting 2 hours is unsafe if the reading is accurate.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is taking the temperature of a 2-month-old infant. Which route is most appropriate?",
    o: ["Rectal", "Oral", "Axillary", "Tympanic"],
    a: 0,
    r: "For infants under 2 years old, rectal temperature is considered the gold standard as it provides the most accurate core body temperature reading. Oral thermometry is contraindicated in infants due to safety concerns. Axillary temperatures are less accurate and may miss fevers. Tympanic thermometry may be inaccurate in infants due to the small ear canal size.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse notes a client's heart rate is irregularly irregular when taking the radial pulse. The nurse should:",
    o: ["Take an apical pulse for a full 60 seconds and report the finding", "Record the radial pulse and note the irregularity", "Assume the finding is normal variation and continue care", "Take the pulse for 15 seconds and multiply by 4"],
    a: 0,
    r: "An irregularly irregular pulse suggests atrial fibrillation or other dysrhythmia. The apical pulse provides the most accurate count as some beats may not produce a palpable radial pulse (pulse deficit). Counting for a full 60 seconds ensures accuracy. A 15-second count multiplied by 4 can miss the irregularity. This finding is not normal and should be reported.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse measures a client's blood pressure using a cuff that is too small for the client's arm. The nurse should expect the reading to be:",
    o: ["Falsely elevated", "Falsely low", "Accurate", "Unmeasurable"],
    a: 0,
    r: "A blood pressure cuff that is too small does not compress the brachial artery adequately, resulting in a falsely elevated reading. The cuff bladder should cover 80% of the arm circumference for an accurate reading. An oversized cuff would produce a falsely low reading. The reading will still be obtainable but inaccurate.",
    s: "Fundamentals"
  },
  {
    q: "A client's temperature is 38.9 degrees Celsius. The practical nurse recognizes this as:",
    o: ["A fever that should be reported to the healthcare provider", "A normal body temperature", "Hypothermia", "A critical temperature requiring immediate emergency intervention"],
    a: 0,
    r: "A temperature of 38.9 degrees Celsius (approximately 102 degrees Fahrenheit) is a significant fever indicating an elevated body temperature that warrants provider notification to determine the cause and initiate appropriate treatment. Normal body temperature is approximately 36.5 to 37.5 degrees Celsius. Hypothermia is below 35 degrees Celsius. While elevated, 38.9 degrees is not typically considered a critical emergency.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is monitoring a postoperative client's intake and output. The client's 8-hour intake is 1200 mL and output is 180 mL. What does this finding suggest?",
    o: ["Possible fluid retention or renal impairment requiring provider notification", "Normal postoperative fluid balance", "The client is adequately hydrated", "The output is expected following general anesthesia"],
    a: 0,
    r: "A significant discrepancy between intake (1200 mL) and output (180 mL) over 8 hours indicates possible fluid retention, renal impairment, or third-spacing. Normal urine output is at least 30 mL/hour (240 mL over 8 hours). An output of 180 mL in 8 hours (22.5 mL/hour) is below the minimum acceptable threshold and requires provider notification and further assessment.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is performing orthostatic vital signs on a client. Which finding indicates orthostatic hypotension?",
    o: ["A systolic blood pressure decrease of 20 mmHg or more when moving from lying to standing", "A heart rate decrease of 10 beats per minute upon standing", "A diastolic blood pressure increase of 5 mmHg upon standing", "No change in vital signs between positions"],
    a: 0,
    r: "Orthostatic hypotension is defined as a systolic blood pressure drop of 20 mmHg or more, a diastolic drop of 10 mmHg or more, or a heart rate increase of 20 bpm or more within 3 minutes of standing. A heart rate decrease upon standing is not consistent with orthostatic changes. A small diastolic increase may be a normal compensatory response. No change indicates normal cardiovascular compensation.",
    s: "Fundamentals"
  },
  // ===== FALL PREVENTION & SAFETY (Questions 41-50) =====
  {
    q: "A practical nurse is caring for an 82-year-old client who scored high risk on the Morse Fall Scale. Which intervention should be implemented first?",
    o: ["Ensure the bed is in the lowest position with the call bell within reach", "Apply bilateral wrist restraints", "Keep the client on strict bedrest", "Administer a sedative to keep the client calm"],
    a: 0,
    r: "For a high fall-risk client, the priority is environmental safety: lowering the bed reduces injury from falls and placing the call bell within reach ensures the client can summon help. Restraints increase agitation and injury risk and require a provider order. Strict bedrest leads to deconditioning. Sedatives increase fall risk by causing drowsiness and impaired balance.",
    s: "Safety"
  },
  {
    q: "A practical nurse discovers a client lying on the floor beside the bed. What is the priority action?",
    o: ["Assess the client for injuries before moving them", "Help the client back into bed immediately", "Call the healthcare provider before touching the client", "Document the fall in the medical record"],
    a: 0,
    r: "The priority after discovering a fallen client is to assess for injuries, particularly head, neck, and spine injuries, before any movement. Moving the client without assessment could worsen undetected injuries such as fractures or spinal cord damage. Provider notification and documentation are important subsequent actions but do not take priority over immediate client assessment.",
    s: "Safety"
  },
  {
    q: "A practical nurse is caring for a confused client who repeatedly attempts to climb out of bed. The nurse has exhausted all least-restrictive alternatives. Which action should the nurse take before applying a restraint?",
    o: ["Obtain a healthcare provider order for the specific type of restraint", "Apply the restraint and document the rationale afterward", "Ask a family member for verbal consent", "Delegate the restraint application to the personal support worker"],
    a: 0,
    r: "Restraint application requires a healthcare provider order specifying the type of restraint, indication, and duration. Applying restraints without an order violates client rights and institutional policy. Family consent does not replace a provider order. Restraint application must be performed by a regulated health professional, not delegated to unregulated staff.",
    s: "Safety"
  },
  {
    q: "A practical nurse is applying a vest restraint to a client. How many fingers should the nurse be able to insert between the restraint and the client's body?",
    o: ["Two fingers", "No fingers", "Four fingers", "One finger"],
    a: 0,
    r: "The two-finger rule ensures the restraint is snug enough to be effective yet loose enough to prevent circulatory compromise, skin breakdown, or respiratory restriction. No space risks skin and neurovascular injury. Four fingers is too loose and the restraint may be ineffective. One finger may be too tight and can restrict breathing or circulation.",
    s: "Safety"
  },
  {
    q: "A practical nurse is conducting a medication safety check. The client's identification band reads 'Jane Smith, DOB 01/15/1945, MRN 456789.' The medication label reads 'Jane Smith, MRN 456789.' What should the nurse do?",
    o: ["Verify identity using two identifiers such as name and date of birth by asking the client to state their name and date of birth", "Administer the medication since the name and MRN match", "Check the room number to confirm identity", "Ask the client's roommate to confirm the client's identity"],
    a: 0,
    r: "Safe medication administration requires verifying identity using at least two client identifiers. The nurse should ask the client to actively state their name and date of birth, not simply match the wristband to the label. Room numbers are not acceptable identifiers as clients may be moved. Asking a roommate is unreliable and violates privacy.",
    s: "Safety"
  },
  {
    q: "A practical nurse is providing discharge teaching to a client about home safety to prevent falls. Which recommendation is most appropriate?",
    o: ["Remove scatter rugs, ensure adequate lighting, and install grab bars in the bathroom", "Keep all medications on the nightstand for easy access", "Encourage the client to walk in socks for comfort", "Recommend placing furniture close together for support while walking"],
    a: 0,
    r: "Removing trip hazards (scatter rugs), ensuring adequate lighting, and installing grab bars are evidence-based fall prevention strategies for the home environment. Keeping medications on the nightstand risks accidental overdose. Walking in socks increases slip risk. Closely placed furniture creates narrow pathways and does not provide stable support.",
    s: "Safety"
  },
  {
    q: "A practical nurse is caring for a client with a seizure disorder. Which items should be kept at the bedside?",
    o: ["Suction equipment and oxygen", "Tongue depressor and padded restraints", "Oral airway and IV sedative medication", "Bite block and arm restraints"],
    a: 0,
    r: "Suction equipment is essential to maintain airway patency during and after a seizure by clearing secretions. Supplemental oxygen should be available for post-ictal hypoxia. Tongue depressors, bite blocks, and objects forced into the mouth during a seizure can cause oral injury. Restraints can cause musculoskeletal injuries during convulsions. IV sedatives require a provider order.",
    s: "Safety"
  },
  {
    q: "A practical nurse enters a client's room and notices smoke coming from an electrical outlet. What is the nurse's first action?",
    o: ["Remove the client from immediate danger using the RACE protocol", "Attempt to extinguish the fire", "Open the windows for ventilation", "Call the maintenance department"],
    a: 0,
    r: "Using the RACE protocol, the first step is Rescue: removing clients from immediate danger. After ensuring client safety, the nurse should Activate the fire alarm, Contain the fire by closing doors, and Extinguish or Evacuate as appropriate. Attempting to extinguish before rescuing puts the client at risk. Opening windows feeds the fire with oxygen. Calling maintenance delays emergency response.",
    s: "Safety"
  },
  {
    q: "A practical nurse is caring for a client receiving continuous oxygen therapy at 3 L/min via nasal cannula. Which safety measure is most important?",
    o: ["Ensure no open flames or smoking occurs near the oxygen source", "Keep the oxygen flow at the maximum setting at all times", "Apply petroleum-based lip balm to prevent nasal dryness", "Store the portable oxygen tank on its side under the bed"],
    a: 0,
    r: "Oxygen supports combustion, making fire safety the highest priority. No open flames, smoking, or spark-producing devices should be near oxygen equipment. Maximum flow rates are determined by the provider order, not arbitrarily set. Petroleum-based products are flammable near oxygen; water-based products should be used instead. Oxygen tanks should be stored upright and secured.",
    s: "Safety"
  },
  {
    q: "A practical nurse is preparing to transfer a client from the bed to a wheelchair. The client can bear partial weight. Which technique is safest?",
    o: ["Use a gait belt around the client's waist and assist the client to stand and pivot to the wheelchair", "Lift the client under the arms and lower them into the wheelchair", "Have the client slide from the bed to the wheelchair on a sheet", "Ask two visitors to assist with the transfer"],
    a: 0,
    r: "A gait belt provides a secure point of contact for the nurse to stabilize the client during a standing pivot transfer. This technique uses proper body mechanics and is appropriate for clients with partial weight-bearing ability. Lifting under the arms can cause shoulder injury. A sheet slide does not support a standing transfer. Visitors are not trained in safe patient handling techniques.",
    s: "Safety"
  },
  // ===== PATIENT EDUCATION (Questions 51-60) =====
  {
    q: "A practical nurse is teaching a newly diagnosed diabetic client about insulin self-injection. Which teaching method is most effective?",
    o: ["Demonstrate the technique, then have the client perform a return demonstration", "Provide a written pamphlet and ask if there are questions", "Show a video and assume the client understands", "Verbally explain the procedure during discharge"],
    a: 0,
    r: "Return demonstration is the most effective method for teaching psychomotor skills because it allows the nurse to evaluate the client's technique and correct errors in real time. Written materials and videos are supplementary tools but do not assess competency. Verbal-only instruction during the busy discharge period is least likely to ensure skill acquisition.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating an older adult client with low health literacy. Which strategy enhances understanding?",
    o: ["Use simple language, short sentences, and visual aids such as pictures or diagrams", "Provide a detailed written handout using medical terminology", "Speak louder and faster to convey all information quickly", "Give all instructions verbally without supplemental materials"],
    a: 0,
    r: "Clients with low health literacy benefit from plain language, short sentences, and visual aids that reinforce key concepts. Medical terminology increases confusion. Speaking louder does not improve comprehension. Verbal-only instruction without reinforcement materials reduces retention. The teach-back method should be used to confirm understanding.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is using the teach-back method after educating a client about a new medication. Which statement best demonstrates this technique?",
    o: ["Can you tell me in your own words how you will take this medication at home?", "Do you understand how to take your medication?", "I'm going to explain this one more time in case you missed something.", "Sign this form to confirm you received the medication education."],
    a: 0,
    r: "The teach-back method requires the client to explain or demonstrate what they learned in their own words, allowing the nurse to assess comprehension and identify gaps. Asking 'Do you understand?' yields a yes/no response that does not confirm actual comprehension. Repeating information does not assess understanding. Signing a form documents only that education was provided, not that it was understood.",
    s: "Fundamentals"
  },
  {
    q: "A client who speaks limited English needs education about a scheduled surgical procedure. What is the most appropriate action by the practical nurse?",
    o: ["Arrange for a certified medical interpreter to assist with teaching", "Use the client's 12-year-old child as an interpreter", "Speak slowly and use hand gestures", "Provide an English-language consent form and point to the signature line"],
    a: 0,
    r: "A certified medical interpreter ensures accurate, confidential, and complete communication of complex health information. Using children as interpreters is inappropriate due to developmental limitations, role reversal, and potential exposure to distressing information. Hand gestures are insufficient for complex surgical education. Providing an English-only consent form does not ensure informed consent.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating a client about a low-sodium diet. Which food choice by the client indicates the teaching was effective?",
    o: ["Fresh grilled chicken with steamed vegetables", "Canned soup with crackers", "Deli turkey sandwich with pickles", "Frozen dinner with a side of cottage cheese"],
    a: 0,
    r: "Fresh grilled chicken and steamed vegetables without added sauces are naturally low in sodium. Canned soups are high in sodium due to preservation. Deli meats and pickles contain significant amounts of sodium from curing and brining. Frozen dinners and cottage cheese are typically high in sodium. Fresh, unprocessed foods are the best choices for a low-sodium diet.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is developing a teaching plan for a client with newly diagnosed heart failure. Which learning domain does the nurse address when teaching the client to weigh themselves daily?",
    o: ["Psychomotor domain", "Cognitive domain", "Affective domain", "Developmental domain"],
    a: 0,
    r: "The psychomotor domain involves physical skills and hands-on activities. Weighing oneself daily is a physical task that requires learning the technique of using a scale and recording the result. The cognitive domain involves knowledge acquisition. The affective domain involves attitudes, values, and motivation. Developmental domain is not a recognized learning domain in Bloom's taxonomy.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse identifies that a client is in the precontemplation stage of change regarding smoking cessation. Which intervention is most appropriate?",
    o: ["Provide information about the health risks of smoking without pressuring the client to quit", "Set a quit date for the client", "Prescribe nicotine replacement therapy", "Refuse to discuss smoking until the client is ready to quit"],
    a: 0,
    r: "In the precontemplation stage, the client is not yet considering change. The nurse's role is to raise awareness by providing factual health information without judgment or pressure. Setting a quit date is appropriate during the preparation stage. Prescribing therapy is a provider function and appropriate during the action stage. Refusing to discuss the topic misses an opportunity for health promotion.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is discharging a client who is taking warfarin. Which dietary instruction is most important?",
    o: ["Maintain a consistent intake of vitamin K-rich foods such as green leafy vegetables", "Avoid all green vegetables while taking warfarin", "Increase vitamin K intake to boost the medication's effectiveness", "There are no dietary considerations with warfarin"],
    a: 0,
    r: "Vitamin K affects warfarin's anticoagulant action. Clients should maintain a consistent intake of vitamin K-rich foods rather than eliminating or increasing them, as dramatic changes in vitamin K consumption alter the INR and medication effectiveness. Complete avoidance removes important nutrients. Increasing vitamin K would decrease warfarin's effect. Dietary counseling is essential with warfarin therapy.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is teaching a client about proper inhaler technique with a metered-dose inhaler (MDI). Which client action indicates correct technique?",
    o: ["Exhale fully, then inhale slowly and deeply while pressing the canister, and hold breath for 10 seconds", "Inhale rapidly and forcefully while pressing the canister", "Exhale into the inhaler before pressing the canister", "Take two quick puffs in succession without waiting between doses"],
    a: 0,
    r: "Correct MDI technique involves exhaling completely, then inhaling slowly and deeply while activating the inhaler, followed by a 10-second breath hold to allow medication to deposit in the airways. Rapid inhalation deposits medication in the oropharynx rather than the lungs. Exhaling into the inhaler can introduce moisture. Two puffs should be separated by 1 minute to allow adequate drug delivery.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating a postpartum client about breastfeeding. The client asks when to seek medical attention. Which response is most accurate?",
    o: ["Contact your healthcare provider if you develop a hard, red, painful area on your breast with fever", "Breast engorgement always requires emergency care", "You should not feel any discomfort during breastfeeding", "Wait until your next scheduled appointment to report any concerns"],
    a: 0,
    r: "A hard, red, painful area on the breast accompanied by fever suggests mastitis, which requires prompt medical evaluation and possibly antibiotics. Breast engorgement is common and manageable with frequent feeding and warm compresses. Mild initial discomfort during breastfeeding is normal as the latch is established. Waiting for a scheduled appointment could delay treatment of a potentially serious infection.",
    s: "Fundamentals"
  },
  // ===== DOCUMENTATION & REPORTING (Questions 61-70) =====
  {
    q: "A practical nurse documents a client's wound assessment. Which entry demonstrates proper documentation?",
    o: ["Wound on left lower leg measuring 3 cm x 2 cm x 0.5 cm with pink granulation tissue, moderate serous drainage, no odor", "Wound on leg looks better today", "Large wound on left leg, healing well", "Wound is improving and client seems comfortable"],
    a: 0,
    r: "Proper wound documentation includes specific location, precise measurements, tissue type, drainage characteristics (type, amount, color), and presence or absence of odor. Vague terms such as 'looks better,' 'large,' 'healing well,' or 'seems comfortable' are subjective and do not provide the detail needed for wound monitoring and continuity of care.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse makes an error in a paper medical record entry. What is the correct way to correct this documentation error?",
    o: ["Draw a single line through the error, write 'error' above it, initial, date, and write the correct entry", "Use correction fluid to cover the mistake and rewrite the entry", "Remove the page and rewrite the entire note", "Scribble over the error completely so it cannot be read"],
    a: 0,
    r: "The standard method for correcting paper documentation errors is a single line through the incorrect entry so the original remains legible, with 'error' written above, followed by the nurse's initials and the date. Correction fluid, page removal, and obliterating the entry are considered alterations of the medical record and may raise legal concerns about record tampering.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse receives a telephone order from a healthcare provider. Which action is most important to ensure accuracy?",
    o: ["Read back the complete order to the provider for verification", "Write the order down and implement it without verification", "Ask the unit clerk to transcribe the order", "Wait until the provider visits the unit to confirm the order"],
    a: 0,
    r: "The read-back method is a patient safety practice that requires the nurse to write down the verbal or telephone order and then read it back to the prescriber to verify accuracy. Implementing without verification risks errors. Delegating transcription to a non-clinical staff member is inappropriate for verbal orders. Waiting to confirm delays necessary treatment.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse witnesses a client fall. Which documentation element is essential in the incident report?",
    o: ["Objective description of what was observed, the client's condition, and actions taken", "The nurse's opinion about what caused the fall", "Blame attributed to the client for not using the call bell", "The names of all staff members who were not in the room"],
    a: 0,
    r: "Incident reports require objective, factual documentation of what was observed, the client's assessment findings, interventions performed, and notifications made. Opinions and assumptions about causation are not appropriate. Blaming the client is unprofessional and not objective. Listing absent staff members does not contribute to understanding the event and may be used inappropriately.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse receives shift report and discovers the previous nurse did not document a medication administration. What should the practical nurse do?",
    o: ["Contact the previous nurse to clarify and ask them to document the medication administration", "Assume the medication was given and carry on", "Document that the previous nurse administered the medication", "Administer the medication again to ensure the client receives it"],
    a: 0,
    r: "If medication administration is not documented, the practical nurse should contact the previous nurse for clarification. Each nurse is responsible for documenting their own care. Assuming the medication was given is unsafe. Documenting on behalf of another nurse may be inaccurate. Administering a duplicate dose could cause harm, particularly with narrow therapeutic index medications.",
    s: "Fundamentals"
  },
  {
    q: "A client tells the practical nurse, 'I feel like no one cares if I live or die.' Which documentation of this statement is most appropriate?",
    o: ["Client stated: 'I feel like no one cares if I live or die.' Provider notified at 1430. Safety assessment initiated.", "Client is depressed and suicidal.", "Client made vague comments about not wanting to be alive.", "Client seems sad today."],
    a: 0,
    r: "The most appropriate documentation uses the client's direct quote for accuracy, includes the time and action of provider notification, and notes the safety intervention initiated. Labeling the client as suicidal is a diagnostic interpretation beyond the nurse's scope. Paraphrasing alters the meaning of the statement. Vague documentation like 'seems sad' does not capture the severity of the situation.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is using an electronic health record (EHR) system. Which action protects client confidentiality?",
    o: ["Log out of the system before stepping away from the computer", "Share login credentials with a trusted colleague during a busy shift", "Leave the medical record open so the next nurse can continue charting", "Access records of clients not assigned to the nurse out of curiosity"],
    a: 0,
    r: "Logging out when stepping away prevents unauthorized access to protected health information. Sharing login credentials violates privacy regulations and makes the nurse accountable for the colleague's entries. Leaving records open exposes client information to unauthorized viewers. Accessing records without a clinical need violates HIPAA and institutional privacy policies.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse suspects a child is being physically abused based on assessment findings. What is the nurse's legal obligation?",
    o: ["Report the suspected abuse to the appropriate child protective agency as mandated by law", "Confirm the abuse by questioning the parent before reporting", "Wait for the healthcare provider to decide whether to report", "Document the findings but do not report unless the child discloses abuse"],
    a: 0,
    r: "Nurses are mandated reporters and are legally required to report suspected child abuse to the appropriate authority. Confirmation of abuse is not required before reporting; reasonable suspicion is sufficient. Waiting for a provider delays a legally required action. Documentation alone does not fulfill the reporting obligation. The child does not need to disclose abuse for a report to be made.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse completes a late entry in the medical record. Which approach is correct?",
    o: ["Note the current date and time, label the entry as a late entry, and reference the date and time the event occurred", "Backdate the entry to when the event actually occurred", "Insert the entry between previous entries to maintain chronological order", "Ask a colleague to enter the information under their login and date"],
    a: 0,
    r: "Late entries must be documented using the current date and time with a clear notation that it is a late entry, referencing when the actual event occurred. Backdating falsifies the record. Inserting between entries in a paper chart is considered tampering. Having a colleague document under their credentials is misrepresentation and a legal and ethical violation.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is preparing a handoff report using the SBAR format. Which component includes the nurse's recommended action?",
    o: ["Recommendation", "Situation", "Background", "Assessment"],
    a: 0,
    r: "In the SBAR framework, Recommendation is where the nurse suggests a specific action or request for the provider to consider. Situation describes the current problem. Background provides relevant clinical history. Assessment includes the nurse's clinical evaluation of the client's current status. The Recommendation component ensures the communication includes a clear request for action.",
    s: "Fundamentals"
  },
  // ===== SCOPE OF PRACTICE & DELEGATION (Questions 71-80) =====
  {
    q: "A practical nurse is working on a busy medical unit. Which task can be safely delegated to an unregulated care provider (UCP)?",
    o: ["Assisting a stable client with bathing and hygiene", "Administering oral medications to a stable client", "Performing an initial admission assessment", "Suctioning a tracheostomy"],
    a: 0,
    r: "Assisting with activities of daily living such as bathing in stable clients is within the scope of an unregulated care provider. Medication administration requires regulated health professional competency. Initial assessments require clinical judgment and cannot be delegated. Tracheostomy suctioning is an invasive procedure requiring specialized training and regulated practice.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is asked by a physician to administer a medication that is unfamiliar. What is the most appropriate action?",
    o: ["Look up the medication's indications, dose, route, and side effects before administering it", "Administer the medication because the physician ordered it", "Refuse to administer the medication without explanation", "Ask another nurse to administer the medication instead"],
    a: 0,
    r: "Nurses have an independent obligation to ensure safe medication administration. Looking up an unfamiliar medication allows the nurse to verify the indication, appropriate dose, route, and potential adverse effects. Administering blindly based on a physician order does not meet the standard of safe practice. Refusing without explanation or delegating does not resolve the knowledge gap.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse receives an order that appears to have an incorrect medication dosage. What should the nurse do?",
    o: ["Clarify the order with the prescribing healthcare provider before administering", "Administer the medication as ordered because the provider knows best", "Adjust the dose to what the nurse believes is correct", "Ask a colleague to verify and administer the medication"],
    a: 0,
    r: "When an order appears incorrect, the nurse must clarify with the prescriber before administration. Administering a potentially incorrect dose violates the nurse's duty to question and clarify orders. Adjusting a dose independently exceeds the nurse's scope of practice. Asking a colleague to administer does not resolve the potential error and transfers the liability without addressing the concern.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is delegating tasks at the start of the shift. Which principle guides appropriate delegation?",
    o: ["The right task, right circumstance, right person, right direction, and right supervision", "Delegate all tasks equally among team members regardless of their qualifications", "Delegate tasks based solely on the workload of each team member", "Only delegate tasks that the practical nurse does not want to perform"],
    a: 0,
    r: "The Five Rights of Delegation ensure client safety: right task (appropriate to delegate), right circumstance (safe and appropriate situation), right person (competent to perform), right direction (clear instructions), and right supervision (monitoring and follow-up). Equal distribution without considering qualifications is unsafe. Workload alone does not determine delegation appropriateness. Personal preference is not a valid delegation criterion.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client who is deteriorating rapidly. The nurse calls the healthcare provider but disagrees with the order given. What is the appropriate next step?",
    o: ["Advocate for the client by clearly stating the concern and using the chain of command if necessary", "Follow the order without question because the provider has more education", "Ignore the order and implement what the nurse believes is correct", "Wait until the next shift and let the oncoming nurse handle it"],
    a: 0,
    r: "The nurse has an ethical and professional obligation to advocate for the client. If the nurse believes an order may cause harm, they should clearly communicate their concern to the provider and, if unresolved, utilize the chain of command. Blindly following orders may compromise client safety. Acting independently without an order exceeds the nurse's scope. Waiting endangers the deteriorating client.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse working in a long-term care facility is asked to perform a procedure they have not been trained to do. What is the correct action?",
    o: ["Decline to perform the procedure and notify the supervisor that additional training is required", "Attempt the procedure using online video instructions", "Perform the procedure because the assignment was given by the supervisor", "Ask an unregulated care provider to perform the procedure instead"],
    a: 0,
    r: "Nurses must only perform procedures within their competence. Declining and notifying the supervisor allows for alternative arrangements and identifies a training need. Attempting an unfamiliar procedure using videos risks client harm. Supervisor assignment does not override competency requirements. Delegating a procedure the nurse cannot perform to an unregulated provider is inappropriate and unsafe.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse witnesses a registered nurse making a medication error. What is the practical nurse's responsibility?",
    o: ["Ensure the client is safe, assist with intervention if needed, and report the error through proper channels", "Ignore the error because it is the registered nurse's responsibility", "Confront the registered nurse publicly at the nursing station", "Document the error in the client's chart under the practical nurse's name"],
    a: 0,
    r: "All nurses have a professional duty to ensure client safety regardless of which colleague committed an error. The practical nurse should ensure the client is safe, assist as needed, and report through proper channels such as the charge nurse and incident reporting system. Ignoring compromises client safety. Public confrontation is unprofessional. Documenting under the wrong name falsifies the record.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse's client requests information about an alternative treatment not covered in the care plan. The nurse is unfamiliar with the treatment. What should the nurse do?",
    o: ["Acknowledge the client's interest and refer them to the healthcare provider for detailed information", "Advise the client against the treatment because it is not in the care plan", "Provide information based on personal opinion", "Tell the client to research it on the internet"],
    a: 0,
    r: "When a client inquires about a treatment outside the nurse's knowledge base, the appropriate response is to acknowledge their interest and refer to the appropriate healthcare provider who can provide evidence-based guidance. Advising against a treatment without knowledge is dismissive. Personal opinions are not appropriate clinical guidance. Directing clients to internet research provides unvetted information.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client who refuses a blood transfusion based on religious beliefs. What is the appropriate nursing action?",
    o: ["Respect the client's decision, document the refusal, and notify the healthcare provider", "Attempt to convince the client that the transfusion is necessary", "Proceed with the transfusion because it is medically necessary", "Ask the client's family to override the decision"],
    a: 0,
    r: "Competent clients have the right to refuse treatment, including blood transfusions, based on personal or religious beliefs. The nurse must respect this decision, ensure informed refusal is documented, and notify the provider to explore alternative treatments. Attempting to convince or override the client violates autonomy. Family members cannot override a competent client's decision.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is asked to float to an unfamiliar unit. What is the nurse's first responsibility upon arrival?",
    o: ["Communicate competency limitations to the charge nurse and clarify which tasks are within the nurse's scope", "Accept all assignments without question to be cooperative", "Refuse to float because the assignment is unfamiliar", "Perform all tasks as assigned regardless of training", ],
    a: 0,
    r: "When floating to an unfamiliar unit, the nurse must communicate any scope or competency limitations to the charge nurse so that safe client assignments can be made. Accepting all tasks without clarification risks client harm if the nurse lacks competency. Refusing to float may not be an option per institutional policy. Performing tasks without adequate training is unsafe.",
    s: "Fundamentals"
  },
  // ===== BASIC NUTRITION (Questions 81-90) =====
  {
    q: "A practical nurse is caring for a client on a clear liquid diet after abdominal surgery. Which item is appropriate for this diet?",
    o: ["Apple juice", "Milk", "Cream of wheat cereal", "Yogurt"],
    a: 0,
    r: "A clear liquid diet includes liquids that are transparent and leave minimal residue in the GI tract. Apple juice is clear and appropriate. Milk is opaque and on a full liquid diet. Cream of wheat is a soft food, not a liquid. Yogurt is a semisolid and not appropriate for a clear liquid diet.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating a client with iron-deficiency anemia about dietary sources of iron. Which food combination maximizes iron absorption?",
    o: ["Spinach salad with a glass of orange juice", "Spinach salad with a glass of milk", "Spinach salad with a cup of coffee", "Spinach salad with a cup of tea"],
    a: 0,
    r: "Vitamin C (ascorbic acid) enhances the absorption of non-heme iron found in plant sources. Orange juice is rich in vitamin C and improves iron uptake. Calcium in milk inhibits iron absorption. Tannins in coffee and tea bind to iron and reduce absorption. Pairing iron-rich foods with vitamin C sources is a key dietary strategy for iron-deficiency anemia.",
    s: "Fundamentals"
  },
  {
    q: "A client with chronic kidney disease is on a potassium-restricted diet. Which food should the practical nurse instruct the client to avoid?",
    o: ["Bananas", "White rice", "Apple slices", "White bread"],
    a: 0,
    r: "Bananas are very high in potassium and should be limited or avoided in clients on a potassium-restricted diet, particularly those with chronic kidney disease. White rice, apple slices, and white bread are relatively low in potassium and are generally acceptable on a potassium-restricted diet.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is assessing a client's nutritional status. Which finding is the most reliable indicator of protein-calorie malnutrition?",
    o: ["Serum albumin level of 2.0 g/dL", "Body mass index of 24", "Hemoglobin level of 14 g/dL", "Client reports eating three meals per day"],
    a: 0,
    r: "Serum albumin is a visceral protein marker that reflects nutritional status. A level of 2.0 g/dL (normal 3.5-5.0 g/dL) indicates significant protein depletion and malnutrition. A BMI of 24 is within normal range. A hemoglobin of 14 g/dL is normal. Self-reported meal intake does not reflect the quality or adequacy of nutrients consumed.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client receiving enteral feeding through a nasogastric tube. Before administering the feeding, the nurse should:",
    o: ["Verify tube placement by checking gastric aspirate pH and auscultating for air insufflation", "Begin the feeding immediately after inserting the tube", "Administer the feeding with the client lying flat", "Flush the tube with carbonated soda to prevent clogging"],
    a: 0,
    r: "Verifying tube placement before each feeding is essential to prevent aspiration. Gastric aspirate pH should be 5.5 or less. Auscultation alone is not reliable but can supplement other verification methods. Beginning without verification risks aspiration pneumonia. The client should be positioned with the head of bed elevated at least 30-45 degrees. Water, not carbonated soda, is used for flushing.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is educating a client with Type 2 diabetes about carbohydrate counting. Which statement by the client indicates understanding?",
    o: ["I should aim for a consistent amount of carbohydrates at each meal to help manage my blood sugar", "I should eliminate all carbohydrates from my diet", "I can eat as many carbohydrates as I want if I take my medication", "Carbohydrates do not affect my blood sugar levels"],
    a: 0,
    r: "Carbohydrate consistency at meals helps maintain stable blood glucose levels. Eliminating all carbohydrates is not recommended as they are an essential macronutrient and energy source. Medications do not give unlimited dietary freedom. Carbohydrates are the primary macronutrient that directly raises blood glucose levels, making their management central to diabetes care.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse notices a client on a mechanical soft diet is having difficulty swallowing pureed foods. What is the priority action?",
    o: ["Hold the meal, place the client NPO, and notify the healthcare provider and speech-language pathologist", "Encourage the client to drink water between bites to wash down the food", "Switch the client to a regular diet", "Continue the current diet and monitor for aspiration signs"],
    a: 0,
    r: "Difficulty swallowing even pureed foods indicates significant dysphagia and aspiration risk. The nurse should stop oral intake immediately (NPO), notify the provider, and request a swallowing evaluation by a speech-language pathologist. Drinking water with food can increase aspiration risk. A regular diet is more difficult to swallow. Continuing without intervention puts the client at risk for aspiration pneumonia.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is assessing a client for signs of dehydration. Which finding is consistent with dehydration?",
    o: ["Poor skin turgor, dry mucous membranes, and concentrated urine", "Edema in the lower extremities", "Weight gain of 2 kg overnight", "Bounding peripheral pulses"],
    a: 0,
    r: "Dehydration presents with poor skin turgor (tenting), dry mucous membranes, and concentrated (dark, low-volume) urine due to fluid volume deficit. Edema, rapid weight gain, and bounding pulses are signs of fluid volume excess (overhydration), the opposite condition. Additional signs of dehydration include tachycardia, hypotension, and decreased urine output.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client who is prescribed a high-fiber diet to manage chronic constipation. Which dietary recommendation is most appropriate?",
    o: ["Increase intake of whole grains, fresh fruits, vegetables, and adequate fluids", "Eat primarily white bread, pasta, and processed foods", "Limit fluid intake to prevent bloating", "Avoid fruits and vegetables as they may worsen symptoms"],
    a: 0,
    r: "Whole grains, fresh fruits, and vegetables are rich in dietary fiber, which adds bulk to stool and promotes regular bowel movements. Adequate fluid intake is essential to soften the fiber and prevent obstruction. Refined carbohydrates are low in fiber. Limiting fluids can worsen constipation. Fruits and vegetables are the foundation of a high-fiber diet.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is monitoring a client receiving total parenteral nutrition (TPN). Which assessment finding requires immediate intervention?",
    o: ["Blood glucose level of 22.2 mmol/L", "Urine output of 50 mL/hour", "Temperature of 36.8 degrees Celsius", "Serum sodium of 140 mEq/L"],
    a: 0,
    r: "TPN contains high concentrations of dextrose, which can cause hyperglycemia. A blood glucose of 22.2 mmol/L (approximately 400 mg/dL) is critically elevated and requires immediate intervention with insulin per protocol and provider notification. Urine output of 50 mL/hour is adequate. A temperature of 36.8 degrees Celsius is normal. A sodium of 140 mEq/L is within normal range.",
    s: "Fundamentals"
  },
  // ===== FLUID BALANCE & I/O (Questions 91-100) =====
  {
    q: "A practical nurse is calculating a client's 8-hour intake. The client consumed 240 mL of coffee, 180 mL of juice, 120 mL of gelatin, and received 500 mL of IV normal saline. What is the total intake?",
    o: ["1040 mL", "920 mL", "540 mL", "420 mL"],
    a: 0,
    r: "Total intake includes all oral and intravenous fluids. Coffee (240 mL) + juice (180 mL) + gelatin (120 mL, as it is liquid at room temperature and counts as fluid intake) + IV normal saline (500 mL) = 1040 mL. All items consumed that are liquid at room temperature are included in intake calculations along with IV fluids.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is monitoring a client's fluid balance. The client's 24-hour intake is 2800 mL and output is 3600 mL. How should the nurse interpret this finding?",
    o: ["The client has a negative fluid balance of 800 mL, suggesting potential fluid volume deficit", "The client's fluid balance is normal", "The client is fluid overloaded", "The discrepancy is insignificant and needs no action"],
    a: 0,
    r: "A negative fluid balance occurs when output exceeds intake. Here, 2800 mL intake minus 3600 mL output equals negative 800 mL, indicating the client is losing more fluid than they are taking in and may be developing fluid volume deficit. This requires monitoring and possible provider notification. Fluid overload would show intake exceeding output. An 800 mL deficit is clinically significant.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client with heart failure who has gained 1.5 kg overnight. The nurse recognizes this weight gain most likely represents:",
    o: ["Fluid retention of approximately 1500 mL", "Increased caloric intake", "Muscle mass gain from physical therapy", "An inaccurate scale reading"],
    a: 0,
    r: "In heart failure, rapid weight gain typically reflects fluid retention. One kilogram of weight gain equals approximately 1000 mL (1 liter) of retained fluid. A 1.5 kg gain suggests approximately 1500 mL of fluid retention. Caloric intake does not cause such rapid weight change. Muscle gain occurs gradually over weeks. While scale errors are possible, in the context of heart failure, fluid retention is the most likely cause.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client receiving IV fluids at 125 mL/hour. The drip factor of the tubing is 15 drops/mL. What is the correct drip rate in drops per minute?",
    o: ["31 drops per minute", "15 drops per minute", "42 drops per minute", "125 drops per minute"],
    a: 0,
    r: "The drip rate formula is: (Volume per hour x Drop factor) divided by 60 minutes. (125 mL x 15 drops/mL) / 60 = 1875 / 60 = 31.25, rounded to 31 drops per minute. Accurate drip rate calculation ensures the client receives the prescribed fluid volume without complications of too-rapid or too-slow infusion.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse notices that a client's IV site is swollen, cool to touch, and the IV fluid is not infusing properly. What does this finding suggest?",
    o: ["Infiltration", "Phlebitis", "Septicemia", "Air embolism"],
    a: 0,
    r: "Infiltration occurs when IV fluid leaks into surrounding tissue, causing swelling, coolness, and impaired infusion. The nurse should discontinue the IV and restart at a new site. Phlebitis presents with warmth, redness, and tenderness along the vein. Septicemia is a systemic infection with fever and hemodynamic changes. Air embolism presents with chest pain, dyspnea, and hypotension.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is preparing to administer a 1000 mL IV fluid bolus over 4 hours as ordered. What hourly rate should the infusion pump be set to?",
    o: ["250 mL/hour", "125 mL/hour", "500 mL/hour", "1000 mL/hour"],
    a: 0,
    r: "To calculate the hourly rate: 1000 mL divided by 4 hours equals 250 mL/hour. Setting the pump at 250 mL/hour will deliver the entire 1000 mL over the prescribed 4-hour period. A rate of 125 mL/hour would take 8 hours. A rate of 500 mL/hour would complete in 2 hours. Infusing 1000 mL in 1 hour could cause fluid overload.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for an elderly client who has been vomiting for 24 hours. Which electrolyte imbalance should the nurse monitor for?",
    o: ["Hypokalemia and metabolic alkalosis", "Hyperkalemia and metabolic acidosis", "Hypernatremia and respiratory alkalosis", "Hypocalcemia and respiratory acidosis"],
    a: 0,
    r: "Prolonged vomiting causes loss of potassium and hydrochloric acid from the stomach, leading to hypokalemia and metabolic alkalosis. The loss of acidic gastric contents shifts the blood pH toward alkaline. Hyperkalemia is not associated with vomiting. Respiratory acid-base disturbances are caused by changes in ventilation, not GI losses.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client with an indwelling urinary catheter. The urine output has been 20 mL/hour for the past 3 hours. What is the appropriate action?",
    o: ["Notify the healthcare provider as the output is below the minimum acceptable threshold", "Document the output and continue monitoring", "Increase the IV fluid rate without an order", "Irrigate the catheter to check for obstruction and notify the provider"],
    a: 3,
    r: "Minimum acceptable urine output is 30 mL/hour (0.5 mL/kg/hour). An output of 20 mL/hour for 3 consecutive hours is concerning and may indicate catheter obstruction, dehydration, or renal impairment. The nurse should first check the catheter system for kinks or obstruction by irrigating, then notify the provider with the findings. Simply documenting without action is insufficient. Changing IV rates requires an order.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is caring for a client who is NPO before surgery scheduled for the morning. The client asks for a glass of water at midnight. What should the nurse tell the client?",
    o: ["I understand you are thirsty, but you cannot have anything to eat or drink before surgery to prevent complications during anesthesia", "You can have a small sip of water since it will not make a difference", "You can have ice chips but not water", "You should have eaten and drank more at dinner to prevent feeling thirsty"],
    a: 0,
    r: "NPO status before surgery means no food or fluid by mouth, which is essential to reduce the risk of aspiration during anesthesia. The nurse should explain the rationale while showing empathy. Even small sips of water can increase gastric volume and aspiration risk. Ice chips are still water. Criticizing the client's prior intake is unhelpful and non-therapeutic.",
    s: "Fundamentals"
  },
  {
    q: "A practical nurse is assessing a client for fluid volume excess. Which assessment finding is most consistent with this condition?",
    o: ["Crackles on lung auscultation and peripheral edema", "Dry, flaky skin and sunken eyes", "Flat neck veins and weak, thready pulse", "Concentrated urine and decreased skin turgor"],
    a: 0,
    r: "Fluid volume excess causes fluid to shift into interstitial and pulmonary spaces, resulting in crackles (pulmonary edema) and peripheral edema. Additional signs include weight gain, distended neck veins, and bounding pulse. Dry skin, sunken eyes, flat neck veins, weak pulse, concentrated urine, and poor skin turgor are signs of fluid volume deficit, the opposite condition.",
    s: "Fundamentals"
  }
];
