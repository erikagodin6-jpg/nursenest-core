import type { ExamQuestion } from "./types";

export const rpnExpansionEQuestions: ExamQuestion[] = [
  {
    q: "A nurse is monitoring a postpartum client 2 hours after vaginal delivery. The nurse notes the uterine fundus is boggy, displaced to the right, and 3 cm above the umbilicus. What should the nurse do first?",
    o: ["Have the client empty her bladder and then reassess the fundus", "Administer oxytocin immediately without further assessment", "Begin fundal massage with maximum pressure", "Apply an ice pack to the lower abdomen"],
    a: 0,
    r: "A boggy fundus displaced to the right and above the umbilicus most commonly indicates a distended bladder pushing the uterus upward and to the side. The nurse should first have the client void, then reassess fundal tone and position. Oxytocin may be needed but the bladder must be emptied first. Aggressive fundal massage before emptying the bladder is ineffective. Ice packs alone do not resolve uterine displacement.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a client at 38 weeks gestation. The fetal heart rate monitor shows a baseline rate of 140 bpm with moderate variability and two accelerations in 20 minutes. How should the nurse interpret this tracing?",
    o: ["Category I tracing indicating a well-oxygenated fetus with no intervention needed", "Category II tracing requiring continuous monitoring and position change", "Category III tracing requiring emergency cesarean delivery", "An indeterminate pattern requiring immediate scalp pH sampling"],
    a: 0,
    r: "A baseline FHR of 110-160 bpm with moderate variability and accelerations defines a Category I (normal/reassuring) tracing. This indicates adequate fetal oxygenation and acid-base status. Category II includes indeterminate patterns. Category III includes absent variability with recurrent late decelerations. This tracing requires no intervention beyond routine monitoring.",
    s: "Maternal"
  },
  {
    q: "A nurse is assessing a 1-day-old newborn. Which finding requires immediate notification of the healthcare provider?",
    o: ["Respiratory rate of 72 with nasal flaring and grunting", "Acrocyanosis of the hands and feet", "Lanugo on the shoulders and back", "A single umbilical artery noted on cord examination"],
    a: 0,
    r: "Respiratory rate above 60 with nasal flaring and grunting indicates respiratory distress in a newborn and requires immediate evaluation. Acrocyanosis (blue hands and feet) is normal in the first 24-48 hours due to peripheral circulation immaturity. Lanugo is normal, especially in preterm infants. A single umbilical artery may indicate associated anomalies but is not an emergency.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a breastfeeding mother who reports severe nipple pain and cracking. Which intervention should the nurse suggest first?",
    o: ["Assess the infant's latch technique and correct positioning", "Recommend switching to formula feeding immediately", "Apply alcohol-based cleanser to prevent infection", "Suggest pumping exclusively until the nipples heal completely"],
    a: 0,
    r: "The most common cause of nipple pain and cracking during breastfeeding is improper latch. Assessing and correcting latch technique resolves most cases. Switching to formula is premature and undermines breastfeeding goals. Alcohol dries and further damages tissue. While temporary pumping may be needed, the root cause (poor latch) must be addressed first for long-term success.",
    s: "Maternal"
  },
  {
    q: "A nurse is monitoring a laboring client who is receiving oxytocin for labor induction. The nurse observes contractions occurring every 90 seconds lasting 90 seconds. What should the nurse do?",
    o: ["Stop the oxytocin infusion immediately and position the client on her left side", "Increase the oxytocin rate to strengthen the contractions further", "Continue monitoring since frequent strong contractions are desirable", "Administer a tocolytic medication without notifying the provider"],
    a: 0,
    r: "Contractions every 90 seconds lasting 90 seconds represents uterine tachysystole (hyperstimulation). There is insufficient relaxation time between contractions, which compromises uteroplacental blood flow and can cause fetal distress or uterine rupture. The nurse must stop oxytocin, position the client on her left side to optimize blood flow, administer oxygen, and notify the provider. Increasing oxytocin worsens the situation.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a client diagnosed with preeclampsia who is receiving magnesium sulfate IV. Which finding indicates magnesium toxicity?",
    o: ["Respiratory rate of 10 breaths per minute with absent deep tendon reflexes", "Blood pressure of 140/90 mmHg", "Urine output of 35 mL/hr", "Mild headache and facial flushing"],
    a: 0,
    r: "Respiratory depression (below 12 bpm) and loss of deep tendon reflexes are early signs of magnesium toxicity. Therapeutic range is 4-7 mEq/L. The nurse must hold the infusion and notify the provider. Calcium gluconate is the antidote. BP of 140/90 is expected with preeclampsia. Urine output of 35 mL/hr is adequate (minimum is 30 mL/hr). Flushing and mild headache can occur with therapeutic levels.",
    s: "Maternal"
  },
  {
    q: "A nurse is assessing a client who is experiencing a panic attack in the emergency department. The client is hyperventilating, reports chest tightness, and states they are going to die. What is the nurse's priority action?",
    o: ["Stay with the client, speak in a calm voice, and guide slow controlled breathing", "Leave the room to get emergency medications for the client", "Tell the client there is nothing physically wrong and to calm down", "Place the client in a room with bright lights and other patients for distraction"],
    a: 0,
    r: "During a panic attack, the nurse's priority is therapeutic presence and de-escalation. Staying with the client provides safety. Calm verbal guidance with controlled breathing reduces hyperventilation and associated symptoms. Leaving the client alone increases fear. Dismissing symptoms is non-therapeutic and invalidating. Bright lights and crowds increase sensory stimulation and worsen anxiety.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client with major depressive disorder who has been started on sertraline (Zoloft). The client asks when they will start feeling better. Which response is most accurate?",
    o: ["Most people notice improvement in mood within 2 to 4 weeks, though full benefits may take 6 to 8 weeks", "You should feel better within 24 to 48 hours of starting the medication", "The medication works immediately but you may not notice it right away", "If you do not feel better in 3 days, we will need to switch to a different medication"],
    a: 0,
    r: "SSRIs like sertraline typically take 2-4 weeks for initial therapeutic effects, with full benefits at 6-8 weeks. This is because serotonin receptor sensitivity must adjust over time. Immediate relief is unrealistic and causes treatment abandonment. Expecting results in 24-48 hours or 3 days sets false expectations. Clients should be counseled about this timeline to promote medication adherence.",
    s: "Mental Health"
  },
  {
    q: "A nurse is assessing a client admitted after a suicide attempt by overdose. The client now appears calm and states they feel much better and want to go home. What is the most appropriate nursing action?",
    o: ["Maintain close observation and communicate the client's statements to the treatment team", "Prepare discharge paperwork since the client is no longer expressing suicidal ideation", "Remove the client from one-to-one observation since the crisis has passed", "Encourage the client to call family to arrange transportation home"],
    a: 0,
    r: "A sudden improvement in mood after a suicide attempt may indicate the client has made a decision to complete suicide and feels relief from the plan. This is a high-risk period requiring continued close observation. Discharging prematurely is dangerous. Removing safety precautions based on a single statement is unsafe. The treatment team must evaluate readiness for discharge through comprehensive assessment.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client with bipolar disorder who is in a manic episode. The client has not slept in 3 days, is pacing the hallway, and is speaking rapidly. Which intervention is the priority?",
    o: ["Provide a calm low-stimulation environment with high-calorie finger foods and ensure safety", "Engage the client in a group therapy session to redirect energy", "Encourage the client to exercise vigorously to burn off excess energy", "Confront the client about their behavior and insist they sit down"],
    a: 0,
    r: "During acute mania, the priority is safety and meeting basic needs. A low-stimulation environment reduces sensory input that escalates mania. High-calorie finger foods address nutrition since the client cannot sit for meals. Group therapy overstimulates. Vigorous exercise may increase agitation and risk exhaustion. Confrontation escalates behavior and is non-therapeutic.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client with schizophrenia who states that the television is sending them secret messages. How should the nurse respond?",
    o: ["Acknowledge the client's experience without reinforcing the delusion by saying you understand it seems real to them", "Tell the client that the television cannot send messages and they need to think logically", "Agree with the client to build trust and therapeutic rapport", "Turn off the television and tell the client the messages have stopped"],
    a: 0,
    r: "The therapeutic approach to delusions is to acknowledge the client's feelings and experience without agreeing with or challenging the false belief. Challenging directly increases anxiety and damages trust. Agreeing reinforces the delusion. Turning off the TV does not address the underlying thought disorder and may provoke agitation. The nurse should present reality gently while maintaining the therapeutic relationship.",
    s: "Mental Health"
  },
  {
    q: "A nurse is preparing to care for a client with Clostridium difficile infection. Which personal protective equipment is required?",
    o: ["Gown and gloves with handwashing using soap and water", "N95 respirator and sterile gloves", "Surgical mask and eye protection only", "Standard precautions with alcohol-based hand sanitizer"],
    a: 0,
    r: "C. difficile requires contact precautions (gown and gloves) because the spores are transmitted by direct contact. Critically, handwashing must use soap and water because alcohol-based sanitizers do NOT kill C. difficile spores. An N95 respirator is for airborne precautions. A surgical mask alone is inadequate. Standard precautions with alcohol sanitizer will not eliminate the spores.",
    s: "Infection Control"
  },
  {
    q: "A nurse is caring for a client diagnosed with active pulmonary tuberculosis. Which isolation precaution is required?",
    o: ["Airborne precautions with a negative-pressure room and N95 respirator", "Contact precautions with gown and gloves", "Droplet precautions with a surgical mask", "Standard precautions only"],
    a: 0,
    r: "Pulmonary tuberculosis is transmitted by airborne nuclei that can remain suspended in air for hours. Airborne precautions require a negative-pressure room (air flows in, not out), the door must remain closed, and healthcare workers must wear fit-tested N95 respirators. Contact precautions are for surface-transmitted organisms. Droplet precautions are for larger particles. Standard precautions alone are insufficient.",
    s: "Infection Control"
  },
  {
    q: "A nurse is performing hand hygiene before entering a client's room. In which situation should the nurse use soap and water instead of alcohol-based hand sanitizer?",
    o: ["When hands are visibly soiled with blood or body fluids", "When entering any client room for routine care", "When the client has a surgical wound that is healing well", "When administering oral medications to the client"],
    a: 0,
    r: "Soap and water must be used when hands are visibly soiled because alcohol-based sanitizer cannot remove organic material effectively. Additional situations requiring soap and water include caring for clients with C. difficile or norovirus. For routine clean situations, alcohol-based sanitizer is acceptable and preferred for its convenience and broad-spectrum antimicrobial activity.",
    s: "Infection Control"
  },
  {
    q: "A nurse is preparing to insert a urinary catheter. Which action is most important for preventing catheter-associated urinary tract infections (CAUTI)?",
    o: ["Maintain strict aseptic technique during insertion and keep the drainage system closed", "Use the largest catheter size available for better urine flow", "Irrigate the catheter routinely every 4 hours with normal saline", "Apply antibiotic ointment to the urethral meatus daily"],
    a: 0,
    r: "Strict aseptic technique during insertion and maintaining a closed drainage system are the most evidence-based CAUTI prevention strategies. Using the smallest appropriate catheter size reduces urethral trauma. Routine irrigation disrupts the closed system and introduces bacteria. Antibiotic ointment at the meatus has not been shown to reduce CAUTI and may promote resistant organisms.",
    s: "Infection Control"
  },
  {
    q: "A nurse accidentally sustains a needlestick injury from a used needle. What is the nurse's first action?",
    o: ["Wash the puncture site immediately with soap and water and report the incident to the supervisor", "Apply a tourniquet above the puncture site to prevent blood spread", "Continue working and report the incident at the end of the shift", "Apply bleach to the puncture wound for disinfection"],
    a: 0,
    r: "After a needlestick injury, the immediate action is to wash the site thoroughly with soap and water to reduce pathogen transmission risk. The incident must be reported immediately for baseline blood testing, source patient testing, and potential post-exposure prophylaxis (PEP) for HIV and hepatitis B. Tourniquets are ineffective for bloodborne pathogen exposure. Delayed reporting risks missing the PEP window. Bleach is caustic and tissue-damaging.",
    s: "Infection Control"
  },
  {
    q: "A nurse is teaching a client about proper use of contact lenses. Which client statement indicates a need for further teaching?",
    o: ["I use tap water to rinse my contact lenses when I do not have solution available", "I wash my hands before inserting or removing my contacts", "I replace my contact lens case every 3 months", "I remove my contacts before going to sleep"],
    a: 0,
    r: "Tap water should NEVER be used for contact lenses because it can contain Acanthamoeba and other microorganisms that cause severe keratitis and potential vision loss. Only sterile contact lens solution should be used. Handwashing before handling lenses, replacing cases regularly, and removing lenses before sleep are all correct practices that reduce infection risk.",
    s: "Infection Control"
  },
  {
    q: "A nurse is caring for a client who has been receiving gentamicin IV for 7 days. Which assessment is most important to perform?",
    o: ["Monitor for hearing changes and check serum creatinine for nephrotoxicity", "Assess skin for rash and check liver function tests", "Monitor blood glucose levels every 4 hours", "Check the client's hemoglobin and hematocrit levels daily"],
    a: 0,
    r: "Aminoglycosides (gentamicin, tobramycin) are associated with ototoxicity (hearing loss, tinnitus, vertigo) and nephrotoxicity (elevated creatinine, decreased urine output). Monitoring peak and trough drug levels, serum creatinine, and hearing are essential. Rash and liver function are not primary aminoglycoside concerns. Blood glucose and CBC are not specifically affected by aminoglycosides.",
    s: "Pharmacology"
  },
  {
    q: "A client with chronic kidney disease has a serum potassium of 6.2 mEq/L. Which ECG change would the nurse expect?",
    o: ["Peaked (tall, narrow) T waves", "Prolonged QT interval", "ST segment depression", "Absent P waves with regular rhythm"],
    a: 0,
    r: "Hyperkalemia (above 5.0 mEq/L) causes characteristic tall, peaked T waves as the first ECG change. As potassium rises further, P waves flatten, PR interval prolongs, QRS widens, and eventually cardiac arrest occurs. Prolonged QT is associated with hypokalemia, hypomagnesemia, and certain medications. ST depression has multiple causes but is not the classic hyperkalemia finding.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a client who has been vomiting for 3 days and has a nasogastric tube to suction. Which acid-base imbalance is the client most at risk for?",
    o: ["Metabolic alkalosis from loss of hydrochloric acid", "Metabolic acidosis from bicarbonate loss", "Respiratory alkalosis from hyperventilation", "Respiratory acidosis from hypoventilation"],
    a: 0,
    r: "Prolonged vomiting and NG suction remove hydrochloric acid (HCl) from the stomach, causing a loss of hydrogen ions and chloride. This results in metabolic alkalosis with elevated pH and elevated bicarbonate. Metabolic acidosis occurs with diarrhea (bicarbonate loss). Respiratory imbalances are related to ventilation changes, not GI losses.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client receiving peritoneal dialysis. The nurse notes that the returned dialysate is cloudy. What should the nurse do?",
    o: ["Send a specimen of the dialysate for culture and notify the healthcare provider of possible peritonitis", "Continue the dialysis exchanges as scheduled since cloudiness is normal", "Increase the dwell time to improve clearance of waste products", "Add antibiotics to the next dialysis exchange without provider notification"],
    a: 0,
    r: "Cloudy dialysate is the hallmark sign of peritonitis, the most common and serious complication of peritoneal dialysis. The nurse must collect a specimen for culture and cell count and notify the provider immediately. Normal dialysate is clear and light yellow. Continuing without evaluation risks sepsis. Increasing dwell time does not address infection. Antibiotics require a culture-guided provider order.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a 3-year-old child who is brought to the emergency department with burns on both hands in a glove-like pattern. The parent states the child touched a hot stove. What should the nurse suspect?",
    o: ["Non-accidental injury (child abuse) based on the burn pattern", "An accidental injury consistent with the parent's explanation", "A self-inflicted injury from the child's curiosity", "A contact burn from normal childhood exploration"],
    a: 0,
    r: "Symmetric glove-like or stocking-pattern burns with clear demarcation lines are classic indicators of intentional immersion burns (abuse). Accidental burns from touching a stove typically produce irregular, asymmetric burns on one hand with splash marks. The nurse is legally mandated to report suspected child abuse. The injury pattern is inconsistent with the parent's story.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a 2-year-old child who is post-tonsillectomy. Which finding should the nurse report immediately?",
    o: ["The child is swallowing frequently and drooling blood-tinged saliva", "The child refuses to drink cool fluids and is crying", "The child's temperature is 37.4C orally", "The child is sleeping quietly in the parent's arms"],
    a: 0,
    r: "Frequent swallowing and drooling blood-tinged saliva after tonsillectomy indicate post-tonsillectomy hemorrhage, a potentially life-threatening complication. Children may swallow blood rather than spit it out, making frequent swallowing an important early sign. Refusing fluids is concerning but expected. Low-grade temperature is normal postoperatively. Quiet sleep is a desired outcome.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is assessing a 6-month-old infant during a well-child visit. Which developmental milestone should the nurse expect?",
    o: ["Sits with support and transfers objects from one hand to the other", "Walks independently and says 2-3 words", "Pulls to standing and cruises along furniture", "Builds a tower of 4 blocks and uses a spoon"],
    a: 0,
    r: "At 6 months, infants typically sit with support (or tripod sitting), roll in both directions, transfer objects between hands, and babble. Walking independently is expected at 12-15 months. Pulling to stand and cruising occurs at 9-12 months. Building block towers and using utensils develops at 15-18 months.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client with anorexia nervosa who has been admitted for medical stabilization. The client's BMI is 15 and serum potassium is 2.8 mEq/L. Which complication should the nurse monitor for during refeeding?",
    o: ["Refeeding syndrome with severe hypophosphatemia and cardiac complications", "Hyperglycemia from rapid carbohydrate metabolism", "Hypertension from sodium retention", "Respiratory alkalosis from anxiety about eating"],
    a: 0,
    r: "Refeeding syndrome occurs when malnourished patients receive rapid nutritional support. Insulin release drives phosphate, potassium, and magnesium into cells, causing dangerous electrolyte depletion, particularly hypophosphatemia. This can cause cardiac arrhythmias, respiratory failure, and death. Caloric intake must be increased slowly with close electrolyte monitoring. Hyperglycemia may occur but is secondary. Hypertension and respiratory alkalosis are not primary concerns.",
    s: "Mental Health"
  },
  {
    q: "A nurse is caring for a client with generalized anxiety disorder who is prescribed buspirone (BuSpar). Which client education is most important?",
    o: ["This medication takes 2 to 4 weeks to reach full therapeutic effect and must be taken consistently", "This medication can be taken on an as-needed basis for acute anxiety episodes", "You should avoid eating grapefruit while taking this medication", "This medication will cause significant drowsiness so do not drive"],
    a: 0,
    r: "Buspirone is a non-benzodiazepine anxiolytic that requires 2-4 weeks of consistent dosing to achieve therapeutic effect. Unlike benzodiazepines, it cannot be used PRN for acute anxiety. It has a low risk of sedation and dependence. While grapefruit interactions exist with some medications, the most critical teaching is about the delayed onset to prevent premature discontinuation and treatment failure.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is assessing a client on a psychiatric unit who is pacing, clenching fists, and speaking in a loud voice. Using the de-escalation approach, what should the nurse do first?",
    o: ["Approach calmly from the side, maintain a safe distance, and use a low steady voice to acknowledge the client's distress", "Restrain the client immediately to prevent harm to self or others", "Tell the client to stop pacing and sit down immediately", "Ignore the behavior since the client is not physically harming anyone"],
    a: 0,
    r: "De-escalation begins with a calm, non-threatening approach. Standing to the side (not directly confrontational), maintaining safe distance, and using a calm voice demonstrates respect and reduces threat perception. Restraints are a last resort. Commanding the client to stop is confrontational and escalates agitation. Ignoring the behavior misses the escalation window and increases risk of violence.",
    s: "Mental Health"
  },
  {
    q: "A nurse is educating a client with newly diagnosed epilepsy about seizure precautions. Which instruction is most important for home safety?",
    o: ["Never swim alone and always have someone nearby who knows seizure first aid", "You may continue driving as long as you take your medication regularly", "Keep the bathroom door locked for privacy during bathing", "Seizure medication can be adjusted based on how you feel each day"],
    a: 0,
    r: "Drowning is a significant risk for epilepsy patients because a seizure in water can be rapidly fatal. Swimming and bathing should never be done alone. Driving restrictions vary by jurisdiction but typically require seizure-free periods. Locked bathroom doors prevent rescue access during a seizure. Anti-seizure medications must be taken consistently as prescribed, never self-adjusted, to maintain therapeutic levels.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client receiving IV potassium chloride 40 mEq in 1000 mL normal saline. The client reports burning at the IV site. What should the nurse do?",
    o: ["Slow the infusion rate and assess the IV site for signs of infiltration or phlebitis", "Increase the infusion rate to complete the dose more quickly", "Discontinue the IV and apply a cold compress", "Ignore the complaint since burning is expected with potassium infusions"],
    a: 0,
    r: "Burning during IV potassium infusion may indicate the rate is too fast, the concentration is too high, or the vein is irritated (phlebitis). The nurse should slow the rate first and assess the site. If infiltration is present, potassium can cause tissue necrosis. Increasing the rate worsens pain and tissue damage. Discontinuing without assessment may not be necessary if slowing resolves the problem. Burning should never be ignored.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a Foley catheter. To reduce the risk of catheter-associated urinary tract infection, which nursing action is most appropriate?",
    o: ["Assess daily whether the catheter is still needed and advocate for removal when appropriate", "Change the catheter every 48 hours routinely", "Irrigate the catheter with antibiotic solution every shift", "Apply antimicrobial ointment to the urethral meatus every 4 hours"],
    a: 0,
    r: "The most effective CAUTI prevention strategy is removing the catheter as soon as it is no longer clinically necessary. Each day the catheter remains increases infection risk by 3-7%. Routine catheter changes increase infection risk by breaking the closed system. Routine irrigation introduces bacteria. Antimicrobial ointment at the meatus has not been shown to reduce CAUTI rates.",
    s: "Infection Control"
  },
  {
    q: "A nurse is monitoring a client who had a total hip replacement 6 hours ago. Which position should the nurse maintain to prevent prosthetic dislocation?",
    o: ["Keep the affected leg abducted with a pillow between the legs and avoid flexion beyond 90 degrees", "Cross the affected leg over the unaffected leg for comfort", "Encourage the client to bend forward at the waist to reach personal items", "Position the client on the operative side immediately after surgery"],
    a: 0,
    r: "After total hip replacement, the hip must be maintained in abduction (legs apart) to prevent dislocation. A pillow between the legs maintains alignment. Hip flexion must not exceed 90 degrees. Adduction (crossing legs) and internal rotation are contraindicated as they displace the prosthetic head from the acetabular cup. Excessive forward bending exceeds the 90-degree limit. Operative side positioning depends on surgeon preference.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client with a suspected stroke. The nurse performs a neurological assessment and notes facial drooping on the right side, right arm weakness, and difficulty speaking. What should the nurse do?",
    o: ["Activate the stroke response team immediately and document the time of symptom onset", "Administer aspirin 325 mg and wait for the provider to arrive", "Position the client flat and apply bilateral leg compression devices", "Encourage the client to rest and reassess in 30 minutes"],
    a: 0,
    r: "Stroke is a time-sensitive emergency where every minute matters. The nurse must activate the stroke team immediately and note the time of symptom onset because thrombolytic therapy (tPA) has a narrow time window (within 3-4.5 hours). Aspirin should not be given until imaging rules out hemorrhagic stroke. Flat positioning is not appropriate for all stroke types. Waiting 30 minutes wastes critical treatment time.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with cancer who is receiving chemotherapy. The client's absolute neutrophil count (ANC) is 400 cells/mm3. Which precaution is most important?",
    o: ["Implement neutropenic precautions including no fresh flowers, fruits, or raw vegetables in the room", "Encourage visitors to bring fresh fruit baskets to boost nutrition", "Place the client on contact isolation with gown and gloves", "Administer a live vaccine to boost the immune system"],
    a: 0,
    r: "An ANC below 500 indicates severe neutropenia with high infection risk. Neutropenic precautions include restricting fresh flowers (harbor fungi/bacteria), raw produce (potential pathogen source), and limiting visitors. Private room, strict hand hygiene, and monitoring for infection signs are essential. Fresh fruit brings pathogens. Contact isolation is for different organisms. Live vaccines are absolutely contraindicated in immunosuppressed clients.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client with cancer who reports nausea and vomiting after chemotherapy treatment. When should the nurse administer the prescribed antiemetic for maximum effectiveness?",
    o: ["30 minutes before the next chemotherapy session as prophylaxis", "Only after the client begins vomiting during treatment", "24 hours after chemotherapy is completed", "When the client requests medication for nausea"],
    a: 0,
    r: "Antiemetics are most effective when given prophylactically 30 minutes before chemotherapy to prevent the onset of nausea and vomiting. Once vomiting begins, it is much harder to control. The anticipatory and acute phases of chemotherapy-induced nausea respond best to pretreatment. Waiting until the client is actively vomiting or 24 hours later misses the window of maximum effectiveness.",
    s: "Oncology"
  },
  {
    q: "A nurse is assessing a client with cirrhosis who has asterixis. What does this finding indicate?",
    o: ["Hepatic encephalopathy from elevated ammonia levels affecting brain function", "Normal hand tremor from anxiety about hospitalization", "Hypocalcemia from inadequate vitamin D absorption", "Peripheral neuropathy from alcohol-related nerve damage"],
    a: 0,
    r: "Asterixis (liver flap) is an involuntary flapping tremor of the hands when the wrists are extended. It is a hallmark sign of hepatic encephalopathy caused by elevated blood ammonia levels that cross the blood-brain barrier and impair neurological function. It is not a normal anxiety tremor. While hypocalcemia can cause tremors, asterixis is specifically associated with liver failure. Peripheral neuropathy causes different neurological symptoms.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a postpartum client who delivered 4 hours ago and has soaked through two perineal pads in 30 minutes. What is the nurse's priority action?",
    o: ["Perform fundal massage and notify the healthcare provider of postpartum hemorrhage", "Change the perineal pads and continue routine monitoring", "Encourage the client to breastfeed to stimulate oxytocin release", "Apply an ice pack to the perineum for comfort"],
    a: 0,
    r: "Soaking through two perineal pads in 30 minutes exceeds normal postpartum bleeding and indicates postpartum hemorrhage. The nurse must immediately perform fundal massage to stimulate uterine contraction and notify the provider. Additional interventions may include oxytocin, bimanual compression, or surgical intervention. Simply changing pads delays critical treatment. Breastfeeding can help but is not sufficient for active hemorrhage.",
    s: "Maternal"
  },
  {
    q: "A nurse is caring for a client with alcohol use disorder who was admitted 48 hours ago. The client is tremulous, diaphoretic, and reports seeing insects on the walls. What should the nurse suspect?",
    o: ["Alcohol withdrawal delirium (delirium tremens) requiring immediate medical intervention", "A normal response to the hospital environment", "Malingering to obtain benzodiazepines", "A psychotic disorder unrelated to alcohol use"],
    a: 0,
    r: "Visual hallucinations (seeing insects or animals), tremors, diaphoresis, and agitation occurring 48-72 hours after last alcohol intake are classic signs of delirium tremens (DTs), a life-threatening alcohol withdrawal complication. DTs can progress to seizures, hyperthermia, and cardiovascular collapse without treatment. This is a medical emergency requiring IV benzodiazepines, fluid replacement, and continuous monitoring.",
    s: "Mental Health"
  },
  {
    q: "A nurse is teaching a client about taking metformin for type 2 diabetes. Which instruction is most important?",
    o: ["Take the medication with meals to reduce gastrointestinal side effects", "Take the medication on an empty stomach for better absorption", "Metformin will cause significant weight gain so adjust your diet accordingly", "Monitor for hypoglycemia since metformin frequently causes low blood sugar"],
    a: 0,
    r: "Metformin should be taken with meals to minimize common GI side effects (nausea, diarrhea, abdominal cramping). Taking on an empty stomach worsens GI intolerance. Metformin is weight-neutral or may cause modest weight loss, unlike sulfonylureas and insulin. When used alone, metformin rarely causes hypoglycemia because it works by reducing hepatic glucose production and improving insulin sensitivity.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who underwent a right-sided modified radical mastectomy. Which nursing action is appropriate for the immediate postoperative period?",
    o: ["Elevate the right arm on pillows above heart level to reduce edema", "Take blood pressure in the right arm for convenience", "Position the client flat with both arms at the sides", "Apply a heating pad to the right axillary area for comfort"],
    a: 0,
    r: "After mastectomy with axillary lymph node dissection, the affected arm must be elevated to promote lymphatic drainage and prevent lymphedema. Blood pressure, venipuncture, and injections must be avoided on the surgical side permanently to prevent lymphedema and infection. Flat positioning with arms at the sides increases edema. Heat application to a fresh surgical site increases bleeding risk.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client with end-stage renal disease. The client's phosphorus level is 7.2 mg/dL (normal 2.5-4.5 mg/dL). Which medication would the nurse expect to be prescribed?",
    o: ["Calcium carbonate taken with meals to bind dietary phosphorus", "Potassium chloride supplement to correct electrolyte balance", "Aluminum-free antacids taken between meals", "Sodium bicarbonate to correct metabolic acidosis"],
    a: 0,
    r: "Calcium carbonate is a phosphate binder that works by binding dietary phosphorus in the GI tract, preventing its absorption. It must be taken WITH meals to be effective. Hyperphosphatemia in kidney disease causes calcium-phosphate precipitation, leading to bone disease and cardiovascular calcification. Potassium may be restricted, not supplemented. Antacids between meals do not bind dietary phosphorus. Sodium bicarbonate treats acidosis, not hyperphosphatemia.",
    s: "Renal"
  },
  {
    q: "A nurse is discharging a client who is prescribed warfarin. Which dietary instruction is most appropriate?",
    o: ["Maintain a consistent daily intake of vitamin K-rich foods rather than eliminating them", "Avoid all green leafy vegetables completely while taking warfarin", "Increase consumption of vitamin K-rich foods to enhance the medication's effect", "Eat as much spinach and kale as desired since diet does not affect warfarin"],
    a: 0,
    r: "Vitamin K is the antagonist to warfarin's anticoagulant effect. Rather than eliminating vitamin K-rich foods, patients should maintain a CONSISTENT daily intake so the warfarin dose can be calibrated accordingly. Sudden changes in vitamin K intake cause INR fluctuations. Complete avoidance is nutritionally harmful. Increasing vitamin K counteracts warfarin. Claiming diet has no effect is dangerously incorrect.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is assessing a client with suspected appendicitis. Which assessment finding is most consistent with this diagnosis?",
    o: ["Right lower quadrant pain at McBurney's point that increases with coughing", "Left upper quadrant pain radiating to the left shoulder", "Epigastric pain relieved by eating", "Diffuse abdominal pain that improves with movement"],
    a: 0,
    r: "McBurney's point tenderness (located one-third the distance from the anterior superior iliac spine to the umbilicus in the right lower quadrant) is the classic finding of appendicitis. Pain increases with coughing, movement, or rebound testing. Left upper quadrant pain radiating to the shoulder suggests splenic injury (Kehr sign). Epigastric pain relieved by eating suggests duodenal ulcer. Appendicitis pain worsens with movement.",
    s: "Gastrointestinal"
  },
  {
    q: "A nurse is caring for a newborn at 12 hours of age. The nurse notes yellowing of the skin and sclera. What should the nurse consider?",
    o: ["Pathological jaundice that requires prompt evaluation since it appeared within 24 hours of birth", "Physiological jaundice that is normal and self-limiting", "Breast milk jaundice that will resolve with formula supplementation", "Normal skin color variation in newborns that requires no intervention"],
    a: 0,
    r: "Jaundice appearing within the first 24 hours of life is always considered pathological and requires immediate evaluation. It may indicate hemolytic disease (ABO or Rh incompatibility), infection, or other serious conditions. Physiological jaundice typically appears after 24 hours (day 2-3) and peaks by day 5. Breast milk jaundice occurs later (after day 5-7). Jaundice within 24 hours is never normal.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client with a central venous catheter. During a dressing change, the nurse accidentally dislodges the catheter partially. What should the nurse do first?",
    o: ["Apply pressure to the insertion site, cover with an occlusive dressing, and notify the provider", "Push the catheter back to its original depth", "Remove the catheter completely and apply a bandage", "Flush the catheter with heparin to maintain patency"],
    a: 0,
    r: "A partially dislodged central venous catheter must never be pushed back in because doing so can introduce skin bacteria into the bloodstream, causing a central line-associated bloodstream infection (CLABSI). The nurse should stabilize the catheter, apply pressure to prevent air embolism, cover with an occlusive dressing, and notify the provider. Complete removal without orders is inappropriate unless it is an emergency.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client with PTSD who wakes up screaming after a nightmare. The client is disoriented and appears frightened. What is the nurse's best initial response?",
    o: ["Speak calmly to orient the client to the present environment and provide reassurance of safety", "Turn on all the lights and loudly announce your presence", "Physically restrain the client to prevent injury", "Administer a sedative medication immediately"],
    a: 0,
    r: "During a PTSD-related nightmare or flashback, the priority is grounding the client in the present reality. A calm, steady voice with orientation cues (where they are, who you are, that they are safe) helps the client transition out of the re-experiencing state. Sudden bright lights and loud sounds increase startle response. Physical restraint escalates panic. Sedation should follow assessment, not precede it.",
    s: "Mental Health"
  },
  {
    q: "A nurse is monitoring a client who is receiving a blood transfusion of platelets. Which vital sign change would indicate a febrile non-hemolytic transfusion reaction?",
    o: ["Temperature increase of 1C or more above baseline during or within 4 hours of transfusion", "Blood pressure decrease from 120/80 to 90/60 mmHg with severe chest pain", "Respiratory rate increase from 16 to 18 breaths per minute", "Heart rate decrease from 80 to 76 bpm"],
    a: 0,
    r: "A febrile non-hemolytic transfusion reaction is characterized by a temperature rise of 1C or more during or within 4 hours of the transfusion. It is the most common transfusion reaction, caused by antibodies against donor white blood cell antigens. Severe hypotension with chest pain suggests anaphylaxis or hemolytic reaction. Minor respiratory and heart rate changes are not diagnostic of a transfusion reaction.",
    s: "Hematology"
  },
  {
    q: "A nurse is caring for a client who is withdrawing from opioids. Which assessment findings would the nurse expect?",
    o: ["Dilated pupils, yawning, rhinorrhea, muscle aches, and diarrhea", "Constricted pupils, respiratory depression, and euphoria", "Tremors, seizures, and visual hallucinations", "Bradycardia, hypothermia, and constipation"],
    a: 0,
    r: "Opioid withdrawal produces symptoms that are essentially the opposite of opioid effects: dilated pupils (vs constricted), yawning, lacrimation, rhinorrhea (runny nose), muscle aches, piloerection (goose bumps), GI cramping, and diarrhea (vs constipation). Constricted pupils indicate opioid use, not withdrawal. Tremors and seizures are characteristic of alcohol or benzodiazepine withdrawal. Bradycardia and hypothermia are not typical of opioid withdrawal.",
    s: "Mental Health"
  },
  {
    q: "A nurse is assessing a child who presents with a barking cough, inspiratory stridor, and hoarseness. The child's temperature is 38.2C. What condition should the nurse suspect?",
    o: ["Croup (laryngotracheobronchitis) requiring humidified air and monitoring for respiratory distress", "Epiglottitis requiring immediate intubation", "Asthma exacerbation requiring bronchodilator therapy", "Foreign body aspiration requiring abdominal thrusts"],
    a: 0,
    r: "A barking (seal-like) cough with inspiratory stridor and hoarseness is the classic presentation of viral croup. Treatment includes cool mist, corticosteroids, and racemic epinephrine for moderate-severe cases. Epiglottitis presents with high fever, drooling, tripod positioning, and no cough. Asthma causes expiratory wheezing. Foreign body aspiration has sudden onset and may have unilateral absent breath sounds.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client in the emergency department who reports being sexually assaulted. What is the nurse's priority action?",
    o: ["Provide privacy, ensure safety, and follow the facility's sexual assault examination protocol", "Ask the client to shower and change into a hospital gown before examination", "Immediately call the police before providing any care", "Tell the client they should have been more careful"],
    a: 0,
    r: "The priority is ensuring the client's physical and emotional safety in a private setting while following the facility's evidence collection protocol. The client should NOT bathe, change clothes, eat, drink, or urinate before evidence collection. Police notification should be offered but is the client's decision in most jurisdictions. Blaming the victim is never appropriate and re-traumatizes the client.",
    s: "Mental Health"
  }
];
