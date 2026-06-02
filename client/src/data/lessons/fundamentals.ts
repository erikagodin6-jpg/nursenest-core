import type { LessonContent } from "./types";

export const fundamentalsLessons: Record<string, LessonContent> = {
  "nursing-process-adpie": {
    title: "Nursing Process (ADPIE)",
    cellular: {
      title: "The Nursing Process as a Clinical Framework",
      content: "The nursing process is a systematic, evidence-based framework that guides all clinical decision-making in nursing practice. It consists of five sequential and cyclical phases: Assessment, Diagnosis, Planning, Implementation, and Evaluation (ADPIE). This process is not merely a checklist but a dynamic reasoning framework that mirrors the scientific method applied to patient care.\n\nAssessment is the foundation of all nursing care. It involves systematic collection of subjective data (what the patient reports: pain, nausea, dizziness) and objective data (what the nurse observes or measures: vital signs, skin color, lab values, physical examination findings). Assessment must be ongoing and comprehensive. A thorough initial assessment establishes baseline data against which all future changes are measured. Focused assessments are performed when a specific concern arises. The nurse must differentiate between relevant and irrelevant data and recognize patterns that suggest clinical deterioration.\n\nNursing Diagnosis differs from medical diagnosis. While a physician diagnoses a disease (e.g., pneumonia), the nurse diagnoses the human response to the condition (e.g., Impaired Gas Exchange related to alveolar-capillary membrane changes as evidenced by SpO2 of 88% on room air). NANDA-I provides standardized nursing diagnoses that are used to identify actual or potential health problems."
    },
    riskFactors: [
      "Incomplete or rushed assessment leading to missed findings",
      "Failure to reassess after interventions",
      "Cognitive biases (anchoring, confirmation bias) in clinical reasoning",
      "Poor documentation of assessment findings",
      "Interruptions during medication administration or critical tasks",
      "Inadequate handoff communication between shifts",
      "Failure to prioritize problems using clinical frameworks",
      "Lack of integration between subjective and objective data"
    ],
    diagnostics: [
      "Collect comprehensive health history (chief complaint, HPI, PMH, medications, allergies)",
      "Perform systematic head-to-toe physical assessment",
      "Review diagnostic test results and laboratory values",
      "Assess psychosocial status, cultural considerations, and spiritual needs",
      "Validate assessment data with multiple sources",
      "Identify patterns and cluster related data for diagnosis formulation"
    ],
    management: [
      "Formulate priority nursing diagnoses based on Maslow's hierarchy",
      "Develop measurable, patient-centered goals with specific timeframes",
      "Select evidence-based nursing interventions for each diagnosis",
      "Implement interventions systematically while monitoring patient response",
      "Evaluate outcomes against established goals and modify the plan as needed",
      "Document all phases of the nursing process thoroughly"
    ],
    nursingActions: [
      "Prioritize assessments based on patient acuity and ABCs",
      "Use clinical reasoning to connect assessment findings to potential complications",
      "Communicate changes in patient status using SBAR format",
      "Reassess patient after every intervention to evaluate effectiveness",
      "Document assessment findings objectively and completely",
      "Collaborate with interdisciplinary team members to optimize patient outcomes"
    ],
    signs: {
      left: [
        "Planning Phase: SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)",
        "Implementation Phase: Independent, dependent, and collaborative interventions",
        "Evaluation Phase: Goal met, partially met, or not met with plan modification",
        "Clinical Reasoning: Pattern recognition from clustered assessment data"
      ],
      right: [
        "Red Flag: Assessment data not reassessed after intervention",
        "Red Flag: Nursing diagnosis not supported by assessment data",
        "Red Flag: Goals that are vague or unmeasurable",
        "Red Flag: Failure to modify plan when goals are not met"
      ]
    },
    medications: [
      {
        name: "Clinical Reasoning Frameworks",
        type: "Decision-Making Tool",
        action: "Systematic approach to analyzing patient data and making clinical decisions",
        sideEffects: "Over-reliance on algorithms without critical thinking",
        contra: "Ignoring clinical context or patient individuality",
        pearl: "Use Tanner's Clinical Judgment Model: Noticing → Interpreting → Responding → Reflecting. Always ask 'What am I noticing that is different from what I expected?'"
      }
    ],
    pearls: [
      "Assessment is the most critical step - everything else depends on accurate data collection",
      "Never skip reassessment after an intervention - this closes the nursing process loop",
      "Prioritize nursing diagnoses using ABCs and Maslow's hierarchy: physiological needs first",
      "Clinical reasoning improves with deliberate practice and reflective thinking"
    ],
    preTest: [
      {
        question: "Which phase of the nursing process involves collecting subjective and objective data?",
        options: ["Diagnosis", "Assessment", "Planning", "Implementation"],
        correct: 1,
        rationale: "Assessment is the first phase and involves systematic collection of both subjective (patient-reported) and objective (nurse-observed) data to establish a baseline."
      },
      {
        question: "A nurse identifies 'Impaired Gas Exchange related to alveolar membrane changes.' This is which phase?",
        options: ["Assessment", "Nursing Diagnosis", "Planning", "Evaluation"],
        correct: 1,
        rationale: "Formulating a nursing diagnosis is the second phase of the nursing process. It identifies the patient's response to a health condition using a standardized format."
      },
      {
        question: "What distinguishes a nursing diagnosis from a medical diagnosis?",
        options: ["Nursing diagnoses are less important", "Nursing diagnoses address human responses to health conditions", "Only physicians can make diagnoses", "They are identical"],
        correct: 1,
        rationale: "Nursing diagnoses focus on the patient's response to illness (e.g., impaired mobility), while medical diagnoses identify the disease process itself (e.g., stroke)."
      }
    ],
    postTest: [
      {
        question: "A patient's SpO2 drops to 89% after repositioning. The nurse applies oxygen and reassesses. Which ADPIE phases were used?",
        options: ["Assessment only", "Assessment, Implementation, Evaluation", "Planning and Implementation", "Diagnosis and Planning"],
        correct: 1,
        rationale: "The nurse assessed (noted SpO2 drop), implemented an intervention (applied oxygen), and evaluated (reassessed). This demonstrates the cyclical nature of the nursing process."
      },
      {
        question: "Which goal is correctly written using SMART criteria?",
        options: ["Patient will feel better", "Patient will ambulate 50 feet with a walker by discharge", "Patient will have good vital signs", "Patient will be less anxious"],
        correct: 1,
        rationale: "SMART goals must be Specific (ambulate 50 feet), Measurable (distance), Achievable, Relevant (mobility goal), and Time-bound (by discharge)."
      },
      {
        question: "When should a nurse modify the plan of care?",
        options: ["Only at discharge", "When the physician orders it", "When evaluation shows goals are not being met", "At the start of each shift automatically"],
        correct: 2,
        rationale: "The evaluation phase determines if goals are met, partially met, or not met. When goals are not met, the nurse must reassess and modify the plan accordingly."
      }
    ],
    quiz: [
      {
        question: "Which action demonstrates the evaluation phase of the nursing process?",
        options: ["Administering pain medication", "Checking if the patient's pain decreased after medication", "Writing a nursing diagnosis", "Collecting vital signs"],
        correct: 1,
        rationale: "Evaluation involves determining whether the intervention achieved the desired outcome. Checking if pain decreased after medication is evaluating the effectiveness of the intervention."
      }
    ]
  },

  "vital-signs-red-flags": {
    title: "Vital Signs: Red Flags",
    cellular: {
      title: "Vital Signs as Early Warning Indicators",
      content: "Vital signs are the most fundamental and frequently assessed clinical parameters in nursing. They provide critical real-time data about cardiovascular, respiratory, neurological, and metabolic function. The five core vital signs are temperature, pulse, respirations, blood pressure, and oxygen saturation, with pain often considered the sixth vital sign.\n\nVital sign changes are often the earliest detectable indicators of clinical deterioration, frequently preceding catastrophic events by hours. Studies consistently show that patients who experience cardiac arrest, septic shock, or respiratory failure almost always display abnormal vital sign trends in the 6-8 hours prior to the event. The failure to recognize and act on these trends is a leading cause of preventable patient deaths.\n\nRapid Response Teams (RRT) were developed specifically to address 'failure to rescue' events. These teams are activated when specific vital sign criteria are met, providing immediate critical care expertise at the bedside. The Modified Early Warning Score (MEWS) and National Early Warning Score (NEWS2) are validated scoring systems that aggregate vital sign deviations to predict clinical deterioration. A single abnormal vital sign may be benign, but a pattern of multiple deviations from baseline represents a clinical emergency requiring immediate intervention."
    },
    riskFactors: [
      "Failure to trend vital signs over time (looking at single readings in isolation)",
      "Not reassessing vital signs after interventions or status changes",
      "Using incorrect measurement techniques (wrong cuff size, incorrect positioning)",
      "Ignoring subtle changes from patient's individual baseline",
      "Delayed recognition of compensatory mechanisms masking true severity",
      "Failure to correlate vital signs with clinical presentation",
      "Not recognizing that 'normal' vital signs can be abnormal for certain patients",
      "Alarm fatigue leading to delayed response to monitoring alerts"
    ],
    diagnostics: [
      "Assess vital signs at minimum every 4 hours for stable patients",
      "Increase frequency to every 1-2 hours for patients showing early warning signs",
      "Continuous monitoring for unstable or critically ill patients",
      "Always assess vital signs before and after medication administration",
      "Reassess within 30-60 minutes after any intervention for abnormal findings",
      "Calculate and document Early Warning Scores (NEWS2 or MEWS) with each vital sign set"
    ],
    management: [
      "Activate Rapid Response Team when criteria are met - do not delay",
      "Begin ABCs assessment immediately for any acute vital sign derangement",
      "Position patient appropriately (high-Fowler's for dyspnea, flat for hypotension)",
      "Administer oxygen as per standing orders for SpO2 below threshold",
      "Establish IV access for patients with hemodynamic instability",
      "Prepare for potential escalation to higher level of care"
    ],
    nursingActions: [
      "Report heart rate < 40 or > 130 bpm immediately",
      "Report respiratory rate < 8 or > 28 breaths/min immediately",
      "Report systolic BP < 90 or > 180 mmHg immediately",
      "Report SpO2 < 90% (< 88% in COPD patients) immediately",
      "Report temperature > 38.5°C or < 35°C with other abnormal findings",
      "Report any acute change in level of consciousness (new confusion, lethargy, unresponsiveness)",
      "Report new-onset chest pain with any vital sign abnormality"
    ],
    signs: {
      left: [
        "Tachycardia: Often the FIRST sign of clinical deterioration",
        "Tachypnea: Most sensitive predictor of impending arrest",
        "Hypotension: Late sign - compensatory mechanisms have already failed",
        "Altered LOC: Indicates inadequate cerebral perfusion"
      ],
      right: [
        "Bradycardia with HTN: Cushing's response (increased ICP)",
        "Widening pulse pressure: Late sign of shock or ICP emergency",
        "Silent chest with tachypnea: Impending respiratory arrest",
        "Hypothermia with tachycardia: Consider sepsis in elderly/immunocompromised"
      ]
    },
    medications: [
      {
        name: "Rapid Response Activation Criteria",
        type: "Clinical Protocol",
        action: "Triggers immediate bedside evaluation by critical care team",
        sideEffects: "None - activating RRT is never wrong when concerned",
        contra: "Never withhold activation due to fear of 'overreacting'",
        pearl: "If you are worried enough to consider calling the RRT, call the RRT. Staff concern alone is a valid activation criterion."
      }
    ],
    pearls: [
      "Tachypnea (RR > 24) is the single most predictive vital sign for clinical deterioration",
      "A 'normal' blood pressure does not mean the patient is stable - tachycardia may be compensating",
      "Always compare current vital signs to the patient's BASELINE, not just textbook normals",
      "The combination of tachycardia + tachypnea + altered mental status = emergency until proven otherwise"
    ],
    preTest: [
      {
        question: "Which vital sign is the most sensitive early indicator of clinical deterioration?",
        options: ["Blood pressure", "Temperature", "Respiratory rate", "Oxygen saturation"],
        correct: 2,
        rationale: "Respiratory rate is consistently the most sensitive and earliest predictor of clinical deterioration. Tachypnea often precedes other vital sign changes by hours."
      },
      {
        question: "A patient's heart rate increases from baseline 72 to 110 bpm but blood pressure remains stable. What does this suggest?",
        options: ["The patient is improving", "Early compensatory response to a developing problem", "Normal variation throughout the day", "Equipment malfunction"],
        correct: 1,
        rationale: "Tachycardia with maintained blood pressure suggests the body is compensating. Blood pressure drops are a LATE finding after compensatory mechanisms fail."
      },
      {
        question: "When is it appropriate to activate a Rapid Response Team?",
        options: ["Only when the patient is in cardiac arrest", "Only with physician approval", "When any RRT criteria are met or the nurse has significant concern", "Only during night shifts"],
        correct: 2,
        rationale: "RRT should be activated when criteria are met OR when the nurse has significant concern about a patient's condition. Nurse intuition/concern is a valid activation criterion."
      }
    ],
    postTest: [
      {
        question: "A patient has HR 118, RR 26, BP 142/88, SpO2 94%. Which pattern is most concerning?",
        options: ["Elevated BP alone", "The combination of tachycardia and tachypnea together", "SpO2 of 94%", "None of these are concerning"],
        correct: 1,
        rationale: "The combination of tachycardia AND tachypnea together is a red flag pattern suggesting systemic stress. This combination warrants immediate assessment for the underlying cause."
      },
      {
        question: "A COPD patient has SpO2 of 89%. The nurse should:",
        options: ["Immediately apply high-flow oxygen", "Recognize this may be acceptable for COPD and assess further", "Call a code blue", "Increase IV fluids"],
        correct: 1,
        rationale: "COPD patients often have a target SpO2 of 88-92%. High-flow oxygen can suppress their hypoxic drive. Assess the patient clinically and compare to their individual baseline."
      },
      {
        question: "Cushing's triad (bradycardia, hypertension, irregular respirations) indicates:",
        options: ["Cardiac tamponade", "Septic shock", "Increased intracranial pressure", "Pulmonary embolism"],
        correct: 2,
        rationale: "Cushing's triad is a LATE and ominous sign of critically elevated intracranial pressure. It indicates brainstem compression and is a neurological emergency."
      }
    ],
    quiz: [
      {
        question: "What is the priority when a patient's vital signs meet Rapid Response criteria?",
        options: ["Document and reassess in 30 minutes", "Call the physician first", "Activate the Rapid Response Team immediately", "Wait for the charge nurse to decide"],
        correct: 2,
        rationale: "When RRT criteria are met, activation should be immediate. Delays in recognition and response are associated with increased mortality."
      }
    ]
  },

  "medication-administration-safety": {
    title: "Medication Administration: Rights",
    cellular: {
      title: "Medication Safety as a System-Level Priority",
      content: "Medication errors are among the most common and preventable causes of patient harm in healthcare. The Institute of Medicine estimates that medication errors injure at least 1.5 million people per year in the United States alone, with thousands of deaths annually. These errors can occur at any stage of the medication use process: prescribing, transcribing, dispensing, administering, or monitoring.\n\nThe traditional 'Five Rights' of medication administration (Right Patient, Right Drug, Right Dose, Right Route, Right Time) have expanded to include additional safety checks: Right Documentation, Right Reason, Right Response, and Right to Refuse. These rights serve as a minimum safety framework but are not sufficient alone to prevent all errors. System-level safeguards including barcode medication administration (BCMA), computerized provider order entry (CPOE), and pharmacist verification provide additional layers of protection.\n\nHigh-alert medications are drugs that bear a heightened risk of causing significant patient harm when used in error. These include insulin, anticoagulants (heparin, warfarin), opioids, chemotherapy agents, concentrated electrolytes (potassium chloride, hypertonic saline), and neuromuscular blocking agents. These medications require independent double-checks by two qualified nurses before administration. The Institute for Safe Medication Practices (ISMP) maintains a list of high-alert medications that every nurse should be familiar with."
    },
    riskFactors: [
      "Look-alike/sound-alike (LASA) medications (e.g., hydroxyzine vs hydralazine)",
      "Interruptions during medication preparation and administration",
      "Failure to verify patient identity using two identifiers",
      "Calculation errors with weight-based or concentration-dependent dosing",
      "Bypassing barcode scanning or other safety technologies",
      "Inadequate knowledge of medication actions, interactions, and contraindications",
      "Transcription errors from verbal or telephone orders",
      "Failure to assess allergies before administration"
    ],
    diagnostics: [
      "Verify patient identity using two unique identifiers (name and date of birth)",
      "Check medication against the Medication Administration Record (MAR)",
      "Verify allergies and cross-reactivity before first dose of any new medication",
      "Perform independent double-check for all high-alert medications",
      "Assess relevant lab values before administering (K+ for potassium, INR for warfarin, glucose for insulin)",
      "Evaluate for drug-drug and drug-food interactions"
    ],
    management: [
      "Administer medications within the prescribed time window (typically 30 minutes before or after scheduled time)",
      "Monitor patient response after administration (onset of action varies by route)",
      "Educate patient on medication purpose, expected effects, and side effects to report",
      "Document administration immediately after giving the medication - never pre-chart",
      "For PRN medications, document the indication and reassess effectiveness",
      "Report and document any adverse drug reactions through the incident reporting system"
    ],
    nursingActions: [
      "Never administer a medication you did not prepare yourself",
      "Never leave medications at the bedside unattended (exceptions: nitroglycerin, inhalers per policy)",
      "Hold medications and notify the prescriber when assessment findings contraindicate administration",
      "Hold digoxin if heart rate is below 60 bpm (adult) and notify prescriber",
      "Hold antihypertensives if systolic BP is below the prescribed parameter",
      "Check blood glucose before administering insulin and verify the correct type (rapid vs long-acting)",
      "Verify NG tube placement before administering medications through enteral route"
    ],
    signs: {
      left: [
        "Right Patient: Two identifiers (name + DOB) every time",
        "Right Drug: Compare label to MAR three times",
        "Right Dose: Verify calculations, especially for pediatric/weight-based dosing",
        "Right Route: PO, IV, IM, SubQ, topical - never assume"
      ],
      right: [
        "Right Time: Within acceptable time window per policy",
        "Right Documentation: Chart immediately after administration",
        "Right Reason: Understand the clinical indication",
        "Right Response: Monitor for expected therapeutic and adverse effects"
      ]
    },
    medications: [
      {
        name: "High-Alert Medications (ISMP List)",
        type: "Safety Category",
        action: "Require independent double-check before administration",
        sideEffects: "Higher risk of significant harm if error occurs",
        contra: "Never administer without verification by second qualified nurse",
        pearl: "Memory aid: A PINCH - Anticoagulants, Potassium (IV), Insulin, Narcotics/opioids, Chemotherapy, Heparin. These require two-nurse verification."
      }
    ],
    pearls: [
      "The three checks: verify medication label when pulling from storage, when preparing, and at the bedside before administration",
      "If a patient says 'That doesn't look like my usual pill,' STOP and verify - patients know their medications",
      "Never crush enteric-coated or extended-release tablets - it destroys the protective coating and can cause toxicity",
      "Insulin pens are single-patient use devices - NEVER share between patients even with a new needle"
    ],
    preTest: [
      {
        question: "How many unique identifiers must be verified before medication administration?",
        options: ["One (name only)", "Two (name and date of birth)", "Three (name, DOB, and room number)", "Room number is sufficient"],
        correct: 1,
        rationale: "Two unique identifiers are required. Room number is NOT an acceptable identifier because patients move rooms. Name and date of birth are the standard identifiers used."
      },
      {
        question: "Which medications require an independent double-check by two nurses?",
        options: ["Acetaminophen and ibuprofen", "All oral medications", "High-alert medications (insulin, heparin, opioids, potassium)", "Only IV medications"],
        correct: 2,
        rationale: "High-alert medications carry heightened risk of harm if given in error. Insulin, heparin, opioids, IV potassium, and chemotherapy all require independent double-check verification."
      },
      {
        question: "A patient says the pill looks different from their usual medication. The nurse should:",
        options: ["Reassure the patient and give it anyway", "Hold the medication and reverify against the MAR and pharmacy", "Tell the patient generic versions look different", "Chart a refusal"],
        correct: 1,
        rationale: "Patient concerns about medication appearance should always be taken seriously. Hold the medication and reverify before administering. Patients are an important safety check."
      }
    ],
    postTest: [
      {
        question: "A nurse prepares insulin but is called away for an emergency. Another nurse should:",
        options: ["Administer the insulin that was drawn up", "Draw up a new dose and verify independently", "Leave the insulin at the bedside for later", "Ask the patient to self-administer"],
        correct: 1,
        rationale: "Never administer a medication you did not prepare yourself. The second nurse must draw up a new dose, verify independently, and follow all safety checks."
      },
      {
        question: "When should medication administration be documented?",
        options: ["At the beginning of the shift", "Before administering the medication", "Immediately after administering the medication", "At the end of the shift"],
        correct: 2,
        rationale: "Document immediately AFTER administration. Pre-charting (documenting before giving) is a safety violation that can lead to double-dosing or charting medications that were never actually given."
      },
      {
        question: "A patient's heart rate is 54 bpm and digoxin is due. The nurse should:",
        options: ["Give the medication as scheduled", "Hold the digoxin and notify the prescriber", "Give half the dose", "Wait one hour and recheck"],
        correct: 1,
        rationale: "Digoxin should be held for heart rate below 60 bpm in adults (below 70 in children). The prescriber must be notified because bradycardia may indicate digoxin toxicity."
      }
    ],
    quiz: [
      {
        question: "Which is NOT one of the traditional rights of medication administration?",
        options: ["Right Patient", "Right Dose", "Right Diagnosis", "Right Route"],
        correct: 2,
        rationale: "The traditional five rights are: Right Patient, Right Drug, Right Dose, Right Route, and Right Time. Right Reason is an expanded right, but Right Diagnosis is not part of the framework."
      }
    ]
  },

  "infection-prevention-ppe": {
    title: "Infection Prevention & PPE Standards",
    cellular: {
      title: "Chain of Infection",
      content: "Healthcare-associated infections (HAIs) affect approximately 1 in 31 hospital patients on any given day, resulting in significant morbidity, mortality, and healthcare costs. Understanding the chain of infection is essential for breaking the cycle of disease transmission. The six links in the chain are: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Breaking ANY single link prevents infection transmission.\n\nStandard Precautions are the minimum infection prevention practices that apply to ALL patients in ALL healthcare settings, regardless of suspected or confirmed infection status. They are based on the principle that all blood, body fluids, non-intact skin, and mucous membranes may contain transmissible infectious agents. Standard precautions include hand hygiene, use of personal protective equipment (PPE), respiratory hygiene/cough etiquette, safe injection practices, and proper handling of contaminated equipment and surfaces.\n\nTransmission-Based Precautions are used IN ADDITION to Standard Precautions for patients known or suspected to be infected with pathogens that require additional measures to prevent transmission. There are three categories: Contact Precautions (for organisms spread by direct or indirect contact, such as MRSA, C. difficile, and VRE), Droplet Precautions (for organisms spread by large respiratory droplets that travel up to 3-6 feet, such as influenza, pertussis, and bacterial meningitis), and Airborne Precautions (for organisms that remain suspended in the air for extended periods and travel long distances, such as tuberculosis, measles, and varicella)."
    },
    riskFactors: [
      "Inadequate hand hygiene (the single most important infection prevention measure)",
      "Improper donning or doffing of PPE leading to self-contamination",
      "Failure to identify patients requiring isolation precautions",
      "Reuse of single-use equipment or failure to properly disinfect reusable equipment",
      "Indwelling devices (urinary catheters, central lines, endotracheal tubes)",
      "Immunocompromised patients (chemotherapy, HIV, organ transplant recipients)",
      "Antibiotic overuse leading to resistant organism development",
      "Breaks in sterile technique during invasive procedures"
    ],
    diagnostics: [
      "Assess for signs of infection: fever, elevated WBC, localized redness/swelling/drainage",
      "Review culture and sensitivity results to identify organism and appropriate treatment",
      "Determine appropriate isolation category based on known or suspected pathogen",
      "Monitor for HAI indicators: CAUTI, CLABSI, SSI, VAP",
      "Screen high-risk patients for MRSA and other resistant organisms per facility policy",
      "Assess patient's immune status and infection risk factors"
    ],
    management: [
      "Perform hand hygiene before and after every patient contact (WHO 5 Moments)",
      "Select appropriate PPE based on the type of precautions required",
      "Use alcohol-based hand rub for routine hand hygiene; use soap and water for C. difficile and visibly soiled hands",
      "Ensure negative pressure rooms are available and functioning for airborne precautions",
      "Implement CAUTI prevention bundle: assess daily need for catheter, maintain closed system",
      "Implement CLABSI prevention bundle: daily line necessity review, chlorhexidine bathing"
    ],
    nursingActions: [
      "Contact Precautions: Gown and gloves for all patient contact; dedicated equipment",
      "Droplet Precautions: Surgical mask within 3-6 feet of patient; private room preferred",
      "Airborne Precautions: N95 respirator (fit-tested), negative pressure room, door closed",
      "Doff PPE in correct order: gloves first, then hand hygiene, then gown, then eye protection, then mask, then hand hygiene again",
      "Report clusters of infections or suspected outbreaks to infection prevention team immediately",
      "Educate patients and visitors on the purpose of isolation precautions and proper hand hygiene"
    ],
    signs: {
      left: [
        "Contact: MRSA, VRE, C. difficile, Scabies, Wound infections with drainage",
        "Droplet: Influenza, Pertussis, Bacterial Meningitis, Mumps, Rubella",
        "Airborne: Tuberculosis (pulmonary), Measles (Rubeola), Varicella (Chickenpox)",
        "Standard: ALL patients, ALL encounters, regardless of diagnosis"
      ],
      right: [
        "N95 required: TB, Measles, Varicella, Disseminated Herpes Zoster",
        "C. difficile: Soap and water ONLY (alcohol does not kill spores)",
        "Neutropenic precautions: Protective isolation for immunocompromised",
        "Surgical mask on patient during transport outside isolation room"
      ]
    },
    medications: [
      {
        name: "Hand Hygiene Protocol",
        type: "Infection Prevention Cornerstone",
        action: "Eliminates transient microorganisms from hands, preventing transmission",
        sideEffects: "Skin dryness and irritation with frequent use (use moisturizer)",
        contra: "Alcohol-based rub contraindicated for C. difficile (spores require friction with soap and water)",
        pearl: "WHO 5 Moments for Hand Hygiene: Before patient contact, Before aseptic task, After body fluid exposure, After patient contact, After touching patient surroundings."
      }
    ],
    pearls: [
      "Hand hygiene is the single most effective measure to prevent healthcare-associated infections",
      "For C. difficile: use SOAP AND WATER only - alcohol-based sanitizers do not kill bacterial spores",
      "Airborne precautions require a fit-tested N95 respirator, not a surgical mask",
      "PPE doffing is the highest risk moment for self-contamination - follow the sequence carefully"
    ],
    preTest: [
      {
        question: "Which type of precaution requires an N95 respirator?",
        options: ["Contact precautions", "Droplet precautions", "Airborne precautions", "Standard precautions"],
        correct: 2,
        rationale: "Airborne precautions require an N95 respirator because airborne particles are small enough to remain suspended in the air and pass through a surgical mask. TB, measles, and varicella require airborne precautions."
      },
      {
        question: "A patient with C. difficile requires which hand hygiene method?",
        options: ["Alcohol-based hand rub", "Soap and water only", "Hand sanitizer gel", "Either alcohol or soap is acceptable"],
        correct: 1,
        rationale: "C. difficile forms spores that are resistant to alcohol. Only soap and water with friction can physically remove the spores from hands."
      },
      {
        question: "Standard precautions apply to which patients?",
        options: ["Only patients with confirmed infections", "Only immunocompromised patients", "All patients in all healthcare settings", "Only surgical patients"],
        correct: 2,
        rationale: "Standard precautions apply to ALL patients regardless of infection status. They are based on the principle that any patient may harbor transmissible organisms."
      }
    ],
    postTest: [
      {
        question: "What is the correct PPE doffing sequence?",
        options: ["Mask, gown, gloves", "Gloves, hand hygiene, gown, eye protection, mask, hand hygiene", "Gown, mask, gloves", "Eye protection, mask, gloves, gown"],
        correct: 1,
        rationale: "Gloves are the most contaminated PPE and are removed first. Hand hygiene is performed between steps. The sequence minimizes self-contamination risk."
      },
      {
        question: "A patient with active pulmonary tuberculosis needs to be transported for a chest X-ray. The patient should:",
        options: ["Walk to radiology without a mask", "Wear a surgical mask during transport", "Wear an N95 respirator", "Only be transported if asymptomatic"],
        correct: 1,
        rationale: "The PATIENT wears a surgical mask during transport to contain respiratory droplets. The healthcare worker caring for a TB patient wears the N95 respirator."
      },
      {
        question: "Which infection prevention bundle component is most important for CAUTI prevention?",
        options: ["Prophylactic antibiotics", "Daily assessment of continued catheter necessity", "Routine catheter irrigation", "Catheter replacement every 72 hours"],
        correct: 1,
        rationale: "The most important CAUTI prevention measure is daily assessment of catheter necessity and removal as soon as clinically appropriate. The longer a catheter remains, the higher the infection risk."
      }
    ],
    quiz: [
      {
        question: "Which organisms require Contact Precautions?",
        options: ["Tuberculosis and measles", "MRSA, VRE, and C. difficile", "Influenza and pertussis", "Varicella and rubeola"],
        correct: 1,
        rationale: "MRSA, VRE, and C. difficile are spread by direct or indirect contact and require contact precautions (gown and gloves for all patient contact, dedicated equipment)."
      }
    ]
  },

  "documentation-sbar-dar": {
    title: "Clinical Documentation: SBAR, DAR",
    cellular: {
      title: "Documentation as a Legal",
      content: "Clinical documentation is the cornerstone of patient safety, continuity of care, and legal protection. The medical record serves multiple critical functions: it communicates the patient's condition and plan of care to all members of the healthcare team, provides legal evidence of care provided, supports billing and reimbursement, contributes to quality improvement data, and serves as a record for research and education.\n\nThe legal principle governing nursing documentation is simple: 'If it wasn't documented, it wasn't done.' In malpractice litigation, the medical record is the primary evidence. Nurses must document objectively, accurately, and in a timely manner. Late entries, altered records, and gaps in documentation can be interpreted as evidence of negligence or cover-up. Every entry should be factual, specific, and free from subjective opinions or judgmental language.\n\nSBAR (Situation-Background-Assessment-Recommendation) is the gold standard communication framework for healthcare handoffs and provider notifications. Originally developed by the US Navy for nuclear submarine communication, SBAR provides a structured, predictable format that reduces communication failures - the leading cause of sentinel events. When calling a physician about a patient concern, SBAR ensures that the nurse communicates all essential information concisely and includes a specific recommendation rather than simply reporting data.\n\nDAR (Data-Action-Response) is a focus charting format used for narrative nursing documentation. Data includes subjective and objective findings, Action describes the nursing interventions performed, and Response documents the patient's outcome following the intervention. This format ensures that every documented entry tells a complete clinical story."
    },
    riskFactors: [
      "Late or incomplete documentation creating gaps in the medical record",
      "Using subjective or judgmental language (e.g., 'patient was noncompliant')",
      "Documenting care that was not actually provided",
      "Altering or adding to records after-the-fact without proper late entry notation",
      "Using prohibited abbreviations that can be misinterpreted",
      "Failure to document patient education and understanding",
      "Incomplete handoff communication leading to information gaps",
      "Documenting assessments without documenting follow-up actions taken"
    ],
    diagnostics: [
      "Review current documentation for completeness at end of each shift",
      "Verify that all assessments have corresponding interventions documented",
      "Ensure all physician notifications and responses are documented with date, time, and provider name",
      "Confirm that patient education is documented including method, content, and patient's demonstration of understanding",
      "Review for prohibited abbreviations (The Joint Commission 'Do Not Use' list)",
      "Verify that all PRN medication administrations include indication and reassessment"
    ],
    management: [
      "Document assessment findings objectively using measurable terms",
      "Use SBAR format for all provider notifications and handoff communication",
      "Document in real-time or as close to the event as possible",
      "Include direct quotes when documenting patient statements",
      "Document notification of physician with: time, physician name, information reported, orders received",
      "For late entries: document current date/time, note it is a late entry, and reference the actual date/time of the event"
    ],
    nursingActions: [
      "S (Situation): 'I am calling about [patient name] in room [X]. The situation is [specific concern].'",
      "B (Background): 'The patient was admitted on [date] for [diagnosis]. Relevant history includes [pertinent background].'",
      "A (Assessment): 'I believe the problem is [your clinical assessment]. The patient appears [stable/unstable].'",
      "R (Recommendation): 'I recommend [specific action]. Do you want me to [specific intervention]?'",
      "Document the SBAR communication including physician response and new orders received",
      "If the physician does not address the concern adequately, escalate through the chain of command"
    ],
    signs: {
      left: [
        "SBAR: Situation - identify yourself, patient, and specific concern",
        "SBAR: Background - relevant history, current treatment, recent changes",
        "SBAR: Assessment - your clinical judgment of what is happening",
        "SBAR: Recommendation - what you think needs to happen next"
      ],
      right: [
        "DAR: Data - subjective and objective findings (vital signs, patient statements)",
        "DAR: Action - interventions performed (medications given, positions changed)",
        "DAR: Response - patient outcome following intervention",
        "Legal: Always document refusal of treatment and education provided"
      ]
    },
    medications: [
      {
        name: "Documentation Best Practices",
        type: "Legal Safety Framework",
        action: "Protects nurse and patient through accurate, complete, timely medical record",
        sideEffects: "Time-intensive but legally essential",
        contra: "Never falsify, pre-chart, or backdate documentation",
        pearl: "The medical record is a legal document. Write every entry as though you will read it aloud in a courtroom - because you might."
      }
    ],
    pearls: [
      "If it wasn't documented, it wasn't done - legally, undocumented care is equivalent to no care",
      "Always document the time you notified a physician, the physician's name, what was communicated, and orders received",
      "Never use 'patient refused' without documenting education provided, risks explained, and patient's understanding",
      "SBAR communication reduces errors by 30% during handoffs - use it consistently for every provider notification"
    ],
    preTest: [
      {
        question: "What does the 'R' in SBAR stand for?",
        options: ["Report", "Review", "Recommendation", "Response"],
        correct: 2,
        rationale: "R stands for Recommendation. The nurse should offer a specific recommendation to the provider, not just report data. This demonstrates clinical judgment and facilitates faster decision-making."
      },
      {
        question: "A nurse discovers she forgot to document a medication given 2 hours ago. The correct action is:",
        options: ["Add the documentation to the earlier time slot", "Make a late entry with current date/time referencing the actual event time", "Do not document it since it's too late", "Ask another nurse to document it"],
        correct: 1,
        rationale: "A late entry should be made using the current date and time, clearly labeled as 'Late Entry,' and referencing the actual date and time the event occurred. Never backdate entries."
      },
      {
        question: "Which documentation entry is legally appropriate?",
        options: ["Patient was difficult and refused medications", "Patient stated 'I don't want to take that pill.' Risks of non-adherence explained. Patient verbalized understanding.", "Patient noncompliant with care as usual", "Patient is a bad historian"],
        correct: 1,
        rationale: "Documentation must be objective, factual, and include direct quotes when possible. Subjective terms like 'difficult,' 'noncompliant,' and 'bad historian' are judgmental and legally problematic."
      }
    ],
    postTest: [
      {
        question: "When using SBAR to notify a physician about a deteriorating patient, which component includes 'I believe the problem is sepsis'?",
        options: ["Situation", "Background", "Assessment", "Recommendation"],
        correct: 2,
        rationale: "Assessment is where the nurse provides their clinical judgment about what they believe is happening. 'I believe the problem is sepsis' is the nurse's clinical assessment of the situation."
      },
      {
        question: "In DAR charting, the 'Response' component documents:",
        options: ["The nurse's emotional response", "The patient's outcome following the intervention", "The physician's response to a call", "The family's response to the diagnosis"],
        correct: 1,
        rationale: "Response documents the patient's outcome or reaction following the nursing intervention. For example: 'Pain decreased from 8/10 to 3/10 thirty minutes after morphine administration.'"
      },
      {
        question: "A patient refuses a blood transfusion for religious reasons. The nurse must document:",
        options: ["'Patient refused blood' and nothing else", "The refusal, education provided about risks, alternatives discussed, and that the physician was notified", "A note saying the patient is making a bad decision", "Only document if the physician asks"],
        correct: 1,
        rationale: "Document the refusal, education provided about risks and consequences, alternatives discussed, patient's understanding of the risks, and notification of the physician. This protects both the patient's autonomy and the nurse legally."
      }
    ],
    quiz: [
      {
        question: "What is the primary legal implication of incomplete nursing documentation?",
        options: ["The nurse will be fined", "In litigation, undocumented care is considered as not performed", "The patient will be discharged", "No legal implications exist"],
        correct: 1,
        rationale: "The legal standard is 'if it wasn't documented, it wasn't done.' In malpractice cases, the medical record is the primary evidence, and gaps are interpreted unfavorably."
      }
    ]
  },

  "fluid-balance-assessment": {
    title: "Fluid Balance: I&O, Dehydration & Overload",
    cellular: {
      title: "Fluid Compartments and Homeostatic Regulation",
      content: "Total body water comprises approximately 60% of adult body weight, distributed between intracellular fluid (ICF, 40% of body weight) and extracellular fluid (ECF, 20% of body weight). The ECF is further divided into intravascular (plasma, approximately 5% of body weight) and interstitial (15% of body weight) compartments. Maintaining fluid balance between these compartments is critical for cellular function, organ perfusion, and hemodynamic stability.\n\nFluid balance is regulated through multiple mechanisms: the renin-angiotensin-aldosterone system (RAAS) responds to decreased renal perfusion by retaining sodium and water; antidiuretic hormone (ADH) from the posterior pituitary responds to increased serum osmolality by promoting water reabsorption in the collecting ducts; and atrial natriuretic peptide (ANP) responds to atrial stretch from volume overload by promoting sodium and water excretion.\n\nThird-spacing refers to the pathological shift of fluid from the intravascular space into a non-functional interstitial or transcellular compartment. This fluid is 'trapped' and unavailable for circulation, effectively creating intravascular volume depletion despite the patient appearing edematous. Third-spacing commonly occurs in burns, pancreatitis, liver failure (ascites), bowel obstruction, and sepsis. The clinical paradox is that the patient may have significant total body water excess but be intravascularly depleted, requiring IV fluid resuscitation even while appearing fluid-overloaded."
    },
    riskFactors: [
      "Elderly patients with decreased thirst mechanism and renal concentrating ability",
      "Patients on diuretics, especially loop diuretics (furosemide)",
      "Heart failure patients with impaired cardiac output and renal perfusion",
      "Post-surgical patients with third-spacing and insensible losses",
      "Patients with vomiting, diarrhea, nasogastric suction, or wound drainage",
      "Burns patients with massive fluid shifts and evaporative losses",
      "Patients receiving IV fluids without adequate intake/output monitoring",
      "Chronic kidney disease patients with impaired fluid regulation"
    ],
    diagnostics: [
      "Strict intake and output monitoring (include all sources: oral, IV, tube feedings, irrigations)",
      "Daily weights at the same time, same scale, same clothing (most accurate indicator)",
      "Assess skin turgor (tenting over the sternum or forehead in elderly)",
      "Monitor mucous membranes for moisture status",
      "Assess jugular venous distension (JVD) in 45-degree position",
      "Auscultate lung sounds for crackles indicating pulmonary congestion",
      "Monitor for peripheral and sacral edema (document location, severity with scale)"
    ],
    management: [
      "For dehydration: replace fluids as ordered (oral preferred if tolerated, IV if not)",
      "For fluid overload: restrict fluids as ordered, administer diuretics as prescribed",
      "Monitor electrolytes closely during fluid shifts (especially potassium and sodium)",
      "Elevate head of bed for patients with pulmonary congestion",
      "Weigh patient daily and report weight gain > 1 kg (2.2 lbs) in 24 hours",
      "Track net fluid balance (intake minus output) and report significant positive or negative balances"
    ],
    nursingActions: [
      "Report urine output < 30 mL/hr (adults) or < 0.5 mL/kg/hr immediately",
      "Report weight gain > 1 kg in 24 hours or > 1.5 kg in 48 hours",
      "Assess for signs of dehydration: tachycardia, hypotension, poor skin turgor, concentrated urine, dry mucous membranes",
      "Assess for signs of fluid overload: JVD, crackles, peripheral edema, weight gain, dyspnea, S3 heart sound",
      "Report signs of third-spacing: edema with concurrent hypotension, tachycardia, and decreased urine output",
      "Include ALL fluid sources in I&O: ice chips, liquid medications, tube feeding flushes"
    ],
    signs: {
      left: [
        "Dehydration: Tachycardia, hypotension, poor skin turgor, concentrated urine",
        "Dehydration: Dry mucous membranes, decreased urine output, thirst",
        "Dehydration: Weight loss > 1 kg/day indicates fluid loss",
        "Severe dehydration: Altered mental status, weak/thready pulse"
      ],
      right: [
        "Fluid Overload: JVD, crackles, peripheral/sacral edema, weight gain",
        "Fluid Overload: Bounding pulse, dyspnea, orthopnea, S3 heart sound",
        "Fluid Overload: Frothy pink sputum indicates pulmonary edema (EMERGENCY)",
        "Third-Spacing: Edema + hypotension + tachycardia (paradox of volume depletion with edema)"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na/K/2Cl cotransporter in Loop of Henle, promoting rapid diuresis",
        sideEffects: "Hypokalemia, hyponatremia, dehydration, ototoxicity (with rapid IV push)",
        contra: "Severe dehydration, anuria, hypokalemia",
        pearl: "Monitor potassium closely - hypokalemia increases risk of digoxin toxicity and cardiac dysrhythmias. Administer IV push slowly (no faster than 20 mg/min) to prevent ototoxicity."
      }
    ],
    pearls: [
      "Daily weights are more accurate than I&O for assessing fluid status - 1 kg weight change = approximately 1 liter of fluid",
      "Third-spacing creates a paradox: the patient is edematous but intravascularly depleted and may need IV fluids despite appearing 'overloaded'",
      "Elderly patients may not exhibit typical signs of dehydration (poor skin turgor is less reliable due to decreased skin elasticity)",
      "Frothy pink sputum is a late sign of pulmonary edema requiring emergency intervention (oxygen, diuretics, positioning)"
    ],
    preTest: [
      {
        question: "What is the most accurate method for assessing fluid status?",
        options: ["Intake and output records", "Daily weights", "Skin turgor assessment", "Blood pressure monitoring"],
        correct: 1,
        rationale: "Daily weights are the most accurate indicator of fluid status. A 1 kg weight change equals approximately 1 liter of fluid gain or loss. I&O is important but prone to recording errors."
      },
      {
        question: "A patient has peripheral edema but is tachycardic and hypotensive. What is likely occurring?",
        options: ["Simple fluid overload", "Third-spacing with intravascular depletion", "Normal fluid distribution", "The vital signs are unrelated to fluid status"],
        correct: 1,
        rationale: "Third-spacing shifts fluid into non-functional compartments (interstitial/transcellular). The patient appears edematous but is actually intravascularly depleted, causing tachycardia and hypotension."
      },
      {
        question: "What is the minimum acceptable urine output for an adult?",
        options: ["10 mL/hr", "30 mL/hr", "60 mL/hr", "100 mL/hr"],
        correct: 1,
        rationale: "Minimum acceptable urine output for an adult is 30 mL/hr (0.5 mL/kg/hr). Output below this level suggests inadequate renal perfusion and should be reported immediately."
      }
    ],
    postTest: [
      {
        question: "A patient gains 2 kg overnight. How much fluid has been retained?",
        options: ["500 mL", "1,000 mL", "2,000 mL", "3,000 mL"],
        correct: 2,
        rationale: "1 kg of weight change equals approximately 1,000 mL (1 liter) of fluid. A 2 kg gain represents approximately 2,000 mL of fluid retention."
      },
      {
        question: "Which assessment finding indicates pulmonary edema requiring emergency intervention?",
        options: ["Mild ankle edema", "Crackles in lung bases", "Frothy pink sputum", "Weight gain of 0.5 kg"],
        correct: 2,
        rationale: "Frothy pink sputum indicates severe pulmonary edema where fluid has entered the alveoli and is mixing with air and blood. This is a respiratory emergency requiring immediate oxygen, diuretics, and positioning."
      },
      {
        question: "Why is alcohol-based hand rub inadequate for C. difficile?",
        options: ["It is too harsh on the skin", "Alcohol does not kill C. difficile spores", "It takes too long to dry", "It is not available in isolation rooms"],
        correct: 1,
        rationale: "C. difficile produces spores that are resistant to alcohol and most chemical disinfectants. Only soap and water with friction can physically remove the spores from hands."
      }
    ],
    quiz: [
      {
        question: "Which hormone promotes water retention by increasing reabsorption in the collecting ducts?",
        options: ["Aldosterone", "ADH (Antidiuretic Hormone)", "ANP (Atrial Natriuretic Peptide)", "Cortisol"],
        correct: 1,
        rationale: "ADH (vasopressin) is released from the posterior pituitary in response to increased serum osmolality or decreased blood volume. It acts on the collecting ducts to increase water reabsorption."
      }
    ]
  }
};
