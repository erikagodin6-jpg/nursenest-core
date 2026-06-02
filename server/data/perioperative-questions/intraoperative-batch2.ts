import type { PerioperativeQuestion } from "./types";

export const intraoperativeBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "During a thyroidectomy, the surgeon requests a nerve integrity monitor (NIM) endotracheal tube to monitor the recurrent laryngeal nerve. What is the circulating nurse's responsibility regarding the NIM tube?",
    options: [
      "The NIM tube is placed by the surgeon during the procedure",
      "Verify with the anesthesiologist that the NIM tube is properly positioned with the electrodes in contact with the vocal cords, and ensure the monitoring system is functioning before the procedure begins",
      "The NIM tube is the same as a standard endotracheal tube with no special considerations",
      "Apply the NIM electrodes to the patient's neck after intubation"
    ],
    correctAnswer: 1,
    rationaleLong: "The nerve integrity monitor (NIM) endotracheal tube is a specialized ETT with integrated electrodes that contact the vocal cords to detect electromyographic (EMG) signals from the recurrent laryngeal nerve (RLN) during thyroid and parathyroid surgery. The RLN innervates the intrinsic muscles of the larynx (including the vocal cords), and damage to this nerve during thyroidectomy can result in hoarseness (unilateral injury) or airway obstruction (bilateral injury). The circulating nurse's responsibilities include: (1) Ensuring the correct NIM tube is available and the appropriate size is selected; (2) Verifying with the anesthesiologist that the tube is properly positioned — the electrodes must be in direct contact with the vocal cords for accurate monitoring. Tube rotation or malposition results in false-negative readings; (3) Connecting the NIM tube to the monitoring system and verifying that the system is functioning properly before the surgeon begins dissection; (4) Important anesthetic consideration: neuromuscular blocking agents (paralytic agents) must not be active during the dissection phase, as they block the neuromuscular junction and prevent the monitor from detecting nerve stimulation. Short-acting NMBAs may be used for intubation but must be fully reversed or worn off before nerve monitoring begins; (5) Documenting the NIM results including baseline responses, intraoperative signals, and any signal loss events.",
    learningObjective: "Implement proper nerve integrity monitor (NIM) setup and monitoring for recurrent laryngeal nerve protection during thyroid surgery",
    blueprintCategory: "Intraoperative Care",
    subtopic: "nerve monitoring",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NIM tube electrodes must contact the vocal cords. Neuromuscular blocking agents MUST be reversed/worn off before nerve monitoring — paralysis causes false negatives.",
    clinicalPearls: [
      "NIM tube electrodes must be in direct contact with the vocal cords for accurate monitoring",
      "Neuromuscular blocking agents must be fully reversed before nerve monitoring begins",
      "RLN injury: unilateral = hoarseness; bilateral = potential airway obstruction"
    ],
    safetyNote: "Verify NIM system function BEFORE the surgeon begins dissection — a non-functioning monitor provides false reassurance",
    distractorRationales: [
      "The NIM tube is placed by the anesthesiologist during intubation, not by the surgeon",
      "The NIM tube has special electrodes and monitoring requirements unlike a standard ETT",
      "The electrodes are integrated into the ETT at the vocal cord level, not externally on the neck"
    ]
  },
  {
    stem: "A circulating nurse is setting up for an open craniotomy. The surgeon plans to use an ultrasonic aspirator (Cavitron/CUSA). What is the primary advantage of this device in neurosurgery?",
    options: [
      "It coagulates tissue more effectively than standard electrosurgery",
      "It uses ultrasonic vibration to selectively fragment and aspirate tissue with high water content (tumor) while preserving structures with high collagen content (blood vessels, nerves)",
      "It provides better visualization than standard suction",
      "It eliminates the need for hemostasis during the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "The Cavitron Ultrasonic Surgical Aspirator (CUSA) is a tissue-selective surgical device that uses ultrasonic vibration at approximately 23,000-36,000 Hz to fragment tissue. The key principle is tissue selectivity: the device preferentially fragments and aspirates tissue with high water content (such as brain tumors, liver parenchyma) while preserving structures with high collagen or elastin content (blood vessels, nerves, bile ducts). This selectivity is critical in neurosurgery where the surgeon must remove tumors while preserving adjacent vital neural and vascular structures. The device tip vibrates longitudinally at ultrasonic frequencies, causing cellular disruption through cavitation. The fragmented tissue is simultaneously irrigated and aspirated through the instrument. The circulating nurse should understand: (1) Setup requirements — the console settings (amplitude/power) are adjusted based on tissue type; (2) Irrigation fluid supply — the device requires continuous irrigation (typically saline); (3) The device does not provide hemostasis — separate coagulation tools (bipolar electrosurgery, hemostatic agents) are needed for bleeding; (4) The handpiece and tip must be handled carefully as the ultrasonic tip is delicate and expensive. The CUSA is also used extensively in hepatic surgery for liver resection, where it preserves intrahepatic blood vessels and bile ducts while removing liver parenchyma.",
    learningObjective: "Understand the tissue-selective mechanism of ultrasonic aspiration and its advantages in neurosurgery",
    blueprintCategory: "Intraoperative Care",
    subtopic: "surgical technology",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CUSA is tissue-SELECTIVE: fragments high-water-content tissue (tumor), preserves high-collagen structures (vessels, nerves). It does NOT provide hemostasis.",
    clinicalPearls: [
      "CUSA selectively fragments high-water-content tissue while preserving collagen-rich structures",
      "Used primarily in neurosurgery and hepatic surgery for tissue-selective resection",
      "Does NOT provide hemostasis — separate coagulation tools are needed"
    ],
    safetyNote: "Ensure continuous irrigation supply for the CUSA during use — running without irrigation can cause thermal tissue damage",
    distractorRationales: [
      "The CUSA does not coagulate — it fragments and aspirates; separate hemostasis is required",
      "Better visualization is a secondary benefit — the primary advantage is tissue selectivity",
      "The CUSA does not provide hemostasis — bleeding must be managed with other instruments"
    ]
  },
  {
    stem: "During a total hip arthroplasty, the patient is positioned in the lateral decubitus position. The circulating nurse notices the dependent (lower) ear is folded forward under the patient's head. What is the potential complication and nursing intervention?",
    options: [
      "No concern — the ear will return to normal position after the procedure",
      "The folded ear can develop pressure necrosis and chondritis (cartilage infection/inflammation) — immediately reposition the ear to prevent ischemic injury and pad appropriately",
      "The ear position only matters for procedures involving the ear",
      "Apply a cold pack to the ear to reduce inflammation"
    ],
    correctAnswer: 1,
    rationaleLong: "Auricular (ear) pressure injuries are a documented complication of lateral decubitus positioning. When the dependent ear is folded or compressed under the patient's head, the thin skin overlying the auricular cartilage receives sustained pressure that exceeds capillary closing pressure (approximately 32 mmHg), leading to tissue ischemia. The ear has limited subcutaneous tissue and a tenuous blood supply to the cartilage, making it particularly vulnerable to pressure injury. Prolonged compression can result in: (1) Pressure necrosis of the skin; (2) Chondritis (infection of the auricular cartilage) which is extremely difficult to treat and can lead to permanent ear deformity (cauliflower ear); (3) Cartilage necrosis requiring reconstructive surgery. The circulating nurse should: immediately unfold and reposition the ear, ensure the ear is lying flat and not folded or kinked, pad the dependent ear with foam or gel padding, check the ear position periodically throughout the procedure (as the patient may shift), and document the ear position and padding in the operative record. This is a preventable injury that requires diligent attention during positioning. The ear should be part of the systematic skin assessment performed before and after every procedure.",
    learningObjective: "Prevent auricular pressure injury during lateral decubitus positioning through proper ear positioning and padding",
    blueprintCategory: "Intraoperative Care",
    subtopic: "positioning injuries",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Folded ears in lateral decubitus position cause pressure necrosis and chondritis. ALWAYS check and pad dependent ear during lateral positioning.",
    clinicalPearls: [
      "Auricular cartilage has minimal blood supply — very susceptible to pressure necrosis",
      "Chondritis from pressure injury can cause permanent ear deformity requiring reconstruction",
      "Include the dependent ear in the systematic positioning check for lateral decubitus procedures"
    ],
    safetyNote: "Check the dependent ear during initial positioning AND periodically throughout the case — the patient may shift during surgery",
    distractorRationales: [
      "Sustained pressure on folded cartilage causes irreversible ischemic injury — it will NOT simply recover",
      "Ear positioning is important in ALL procedures using lateral positioning, not just ear surgery",
      "Cold packs are not appropriate for preventing pressure injury — repositioning and padding are required"
    ]
  },
  {
    stem: "A scrub nurse observes a break in the outer glove during a total knee arthroplasty. The inner glove appears intact. What should the scrub nurse do?",
    options: [
      "Continue the case since the inner glove is intact and provides adequate barrier protection",
      "Immediately step away from the sterile field, remove both gloves, perform hand hygiene, and re-glove with two new pairs (double-gloving)",
      "Remove only the outer glove and continue with single gloving",
      "Apply surgical glue to seal the perforation in the outer glove"
    ],
    correctAnswer: 1,
    rationaleLong: "Double-gloving is the standard practice in orthopedic and other high-risk surgical procedures because it significantly reduces the risk of inner glove perforation and pathogen transmission. When the outer glove is perforated, the integrity of the barrier is compromised. Even though the inner glove appears intact, it may have undetected microperforation, and continuing with a compromised outer glove exposes the inner glove to contamination. The correct response is: (1) Immediately step away from the sterile field to prevent dripping contaminated material onto the field; (2) Remove BOTH gloves — the outer glove is contaminated and the inner glove has been exposed to potential contamination; (3) Perform hand hygiene — even though the inner glove appeared intact, hand hygiene provides an additional safety measure; (4) Re-glove with a new pair of sterile double gloves (two new pairs). AORN recommends double-gloving for all invasive procedures, and indicator glove systems (where the inner glove is a different color, typically green or brown) can help detect outer glove perforations more quickly. Studies show that glove perforation rates in surgery range from 7-65% depending on the procedure type and duration, and most perforations go undetected by the wearer. In orthopedic surgery with sharp bone edges and power instruments, perforation rates are particularly high.",
    learningObjective: "Respond correctly to glove perforation during surgery by removing both gloves and re-gloving with new sterile double gloves",
    blueprintCategory: "Intraoperative Care",
    subtopic: "barrier protection",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "When the outer glove is perforated in double-gloving, remove BOTH gloves and re-glove. The inner glove may have undetected microperforation.",
    clinicalPearls: [
      "Double-gloving reduces inner glove perforation risk by 71% compared to single gloving",
      "Most glove perforations go undetected by the wearer — indicator systems improve detection",
      "Glove perforation rates in surgery: 7-65% depending on procedure type and duration"
    ],
    safetyNote: "Double-gloving is recommended for ALL invasive procedures — indicator glove systems enhance perforation detection",
    distractorRationales: [
      "Continuing with a perforated outer glove exposes the potentially compromised inner glove to contamination",
      "Removing only the outer glove leaves the potentially contaminated inner glove in place",
      "Sealing a glove perforation does not restore the barrier integrity and introduces adhesive contamination"
    ]
  },
  {
    stem: "The surgical team is performing a laparoscopic Nissen fundoplication and the circulating nurse notices that the CO2 insufflation pressure has reached 18 mmHg. The standard maximum recommended intra-abdominal pressure for laparoscopic surgery is what value?",
    options: [
      "25 mmHg — higher pressures provide better visualization",
      "15 mmHg — pressures above 15 mmHg increase the risk of hemodynamic compromise, decreased venous return, ventilatory impairment, and organ ischemia",
      "10 mmHg — which is the maximum safe pressure for all patients",
      "There is no established maximum pressure for laparoscopic insufflation"
    ],
    correctAnswer: 1,
    rationaleLong: "The standard maximum recommended intra-abdominal pressure (IAP) for CO2 pneumoperitoneum during laparoscopic surgery is 15 mmHg. Pressures above this threshold significantly increase the risk of physiological complications: (1) Cardiovascular effects — elevated IAP compresses the inferior vena cava, reducing venous return and cardiac output. This is particularly dangerous in patients with cardiac disease. Above 15 mmHg, cardiac output can decrease by 20-40%; (2) Respiratory effects — the elevated diaphragm reduces functional residual capacity and total lung compliance, increasing peak airway pressures and the risk of atelectasis. The V/Q mismatch can cause hypoxemia; (3) Renal effects — elevated IAP compresses renal vasculature, reducing renal blood flow and glomerular filtration rate. Sustained IAP >15 mmHg can cause oliguria; (4) Splanchnic effects — mesenteric blood flow decreases, potentially causing intestinal ischemia in prolonged procedures; (5) CO2 absorption — higher pressures increase systemic CO2 absorption, requiring increased minute ventilation to maintain normocapnia. At 18 mmHg, this patient is above the recommended maximum, and the nurse should notify the surgeon so the pressure can be reduced. Some surgeons may briefly exceed 15 mmHg to improve visualization during challenging dissection, but sustained pressures above 15 mmHg should be avoided.",
    learningObjective: "Monitor and maintain safe intra-abdominal pressure during laparoscopic procedures to prevent hemodynamic and organ perfusion compromise",
    blueprintCategory: "Intraoperative Care",
    subtopic: "pneumoperitoneum management",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Maximum recommended IAP for laparoscopy: 15 mmHg. Above 15 mmHg = decreased cardiac output, renal flow, and respiratory compliance.",
    clinicalPearls: [
      "Maximum recommended IAP: 15 mmHg for standard laparoscopic procedures",
      "Above 15 mmHg: cardiac output decreases 20-40%, renal blood flow decreases, airway pressures increase",
      "Lower pressures (8-12 mmHg) may be used in pediatric patients and patients with cardiopulmonary disease"
    ],
    safetyNote: "Notify the surgeon when insufflation pressure exceeds 15 mmHg — sustained elevated IAP can cause organ ischemia",
    distractorRationales: [
      "25 mmHg far exceeds the safe limit and would cause significant hemodynamic and organ perfusion compromise",
      "10 mmHg may be used for specific patient populations but is not the standard maximum for all patients",
      "Well-established guidelines set 15 mmHg as the standard maximum — there is not no guideline"
    ]
  },
  {
    stem: "During an open aortic aneurysm repair, the surgeon applies a cross-clamp to the aorta above the aneurysm. What hemodynamic change should the circulating nurse anticipate IMMEDIATELY after cross-clamping?",
    options: [
      "Immediate hypotension from reduced cardiac output",
      "Acute hypertension proximal to the clamp (above) due to suddenly increased systemic vascular resistance, and hypoperfusion to organs and tissues distal to the clamp (below)",
      "No hemodynamic change is expected during aortic cross-clamping",
      "Bradycardia from vagal stimulation"
    ],
    correctAnswer: 1,
    rationaleLong: "Aortic cross-clamping has profound and predictable hemodynamic effects that the entire perioperative team must anticipate. When the aorta is clamped, blood flow to the distal vasculature is abruptly interrupted. This has two simultaneous effects: (1) PROXIMAL to the clamp (above) — systemic vascular resistance (SVR) suddenly increases because the blood can no longer flow through the aorta to the lower body. This afterload increase causes acute hypertension, increased left ventricular wall stress, and increased myocardial oxygen demand. The degree of hypertension depends on the level of clamping — suprarenal clamping causes more severe hypertension than infrarenal clamping; (2) DISTAL to the clamp (below) — blood flow is interrupted, causing ischemia to the kidneys (suprarenal clamp), bowel (mesenteric ischemia), spinal cord (risk of paraplegia), and lower extremities. The anesthesiologist typically administers vasodilators (nitroprusside, nitroglycerin) or adjusts the anesthetic depth to manage the proximal hypertension. When the clamp is RELEASED (declamping), the opposite occurs: sudden vasodilation and release of ischemic metabolites (lactate, potassium) cause acute hypotension (declamping shock), metabolic acidosis, and potential hyperkalemia-induced arrhythmias. The nurse should anticipate the need for volume resuscitation, vasopressor support, and bicarbonate during declamping.",
    learningObjective: "Anticipate hemodynamic changes associated with aortic cross-clamping and declamping during aortic surgery",
    blueprintCategory: "Intraoperative Care",
    subtopic: "aortic surgery hemodynamics",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cross-clamp = hypertension above, ischemia below. Declamp = hypotension from vasodilation, metabolic acidosis, hyperkalemia-induced arrhythmias.",
    clinicalPearls: [
      "Aortic cross-clamp: acute hypertension proximal, ischemia distal to clamp",
      "Suprarenal clamping causes more severe hemodynamic changes than infrarenal",
      "Declamping: hypotension, metabolic acidosis, hyperkalemia — prepare for aggressive resuscitation"
    ],
    safetyNote: "Communicate clamping and declamping timing to the anesthesiologist — hemodynamic management must be proactive, not reactive",
    distractorRationales: [
      "Cross-clamping causes hypertension (not hypotension) proximal to the clamp due to increased afterload",
      "Aortic cross-clamping causes dramatic hemodynamic changes that must be anticipated and managed",
      "The primary response is hypertensive, not bradycardic — though reflex changes can occur"
    ]
  },
  {
    stem: "A scrub nurse is assisting during a minimally invasive cardiac surgery procedure. The surgeon requests heparin for systemic anticoagulation before cardiopulmonary bypass. The nurse should verify that which reversal agent is available before heparin administration?",
    options: [
      "Vitamin K (phytonadione)",
      "Protamine sulfate, which reverses heparin's anticoagulant effect by forming a stable salt complex",
      "Aminocaproic acid (Amicar)",
      "Fresh frozen plasma"
    ],
    correctAnswer: 1,
    rationaleLong: "Protamine sulfate is the specific reversal agent for heparin and must be immediately available whenever heparin is administered for systemic anticoagulation. Protamine is a strongly basic protein derived from salmon sperm that forms an ionic complex with the strongly acidic heparin molecule, neutralizing heparin's anticoagulant activity within minutes. The typical reversal dose is 1 mg protamine per 100 units of heparin given, titrated to the activated clotting time (ACT). During cardiac surgery with cardiopulmonary bypass, large doses of heparin (300-400 units/kg) are administered to prevent clotting in the bypass circuit. After the bypass run is complete and the patient is separated from the CPB machine, protamine is administered to reverse the heparin and restore normal coagulation. The nurse should be aware of important protamine safety concerns: (1) Protamine must be administered slowly (over 10 minutes) because rapid administration can cause severe hypotension, bradycardia, and anaphylactoid reactions; (2) Patients with fish or seafood allergies, previous protamine exposure, NPH insulin users, and males who have undergone vasectomy may have increased risk of protamine reactions; (3) Protamine overdose can paradoxically cause anticoagulation because protamine itself has mild anticoagulant properties. Vitamin K reverses warfarin, not heparin. Aminocaproic acid is an antifibrinolytic, not a heparin reversal agent.",
    learningObjective: "Identify protamine sulfate as the specific heparin reversal agent and understand its administration considerations during cardiac surgery",
    blueprintCategory: "Intraoperative Care",
    subtopic: "cardiac surgery anticoagulation",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Protamine reverses heparin (1 mg per 100 units). Must be given slowly — rapid administration causes hypotension and anaphylactoid reactions.",
    clinicalPearls: [
      "Protamine sulfate: specific heparin reversal agent — 1 mg per 100 units of heparin",
      "Administer protamine slowly over 10 minutes to prevent hypotension and anaphylactoid reactions",
      "High-risk for protamine reaction: fish allergy, NPH insulin users, prior protamine exposure, vasectomy"
    ],
    safetyNote: "Never administer heparin for systemic anticoagulation without protamine immediately available as the reversal agent",
    distractorRationales: [
      "Vitamin K reverses warfarin, not heparin — they work through completely different mechanisms",
      "Aminocaproic acid is an antifibrinolytic that inhibits plasmin — it does not reverse heparin",
      "FFP provides clotting factors but does not specifically reverse heparin's mechanism of action"
    ]
  },
  {
    stem: "During a posterior spinal fusion, the surgeon places a subdermal needle electrode on the patient's tibialis anterior muscle for monitoring somatosensory evoked potentials (SSEPs) and motor evoked potentials (MEPs). A 50% decrease in SSEP amplitude is detected. What does this finding suggest and what is the nursing priority?",
    options: [
      "The finding is artifact from electrocautery interference and can be ignored",
      "A significant decrease in SSEP amplitude suggests potential spinal cord compromise — immediately alert the surgeon and anesthesiologist so corrective actions can be taken before permanent neurological injury occurs",
      "The electrodes need to be repositioned as they have shifted",
      "This is a normal finding during spinal surgery and requires no action"
    ],
    correctAnswer: 1,
    rationaleLong: "Intraoperative neurophysiological monitoring (IONM) using somatosensory evoked potentials (SSEPs) and motor evoked potentials (MEPs) is critical for detecting early spinal cord compromise during spinal surgery. SSEPs test the dorsal (sensory) columns by stimulating a peripheral nerve and recording the signal as it travels through the spinal cord to the cerebral cortex. MEPs test the ventral (motor) pathways by stimulating the motor cortex and recording muscle responses in the extremities. A significant change in IONM signals — typically defined as a >50% decrease in amplitude and/or >10% increase in latency — is an alarm criterion that suggests potential spinal cord ischemia, compression, or injury. The perioperative team's response to a significant IONM change includes: (1) Immediately alert the surgeon — they may need to reverse a recent surgical maneuver (remove hardware, reduce correction, relieve compression); (2) Alert the anesthesiologist — optimize spinal cord perfusion by increasing mean arterial pressure (MAP target typically >80-85 mmHg), correcting any anemia, and ensuring adequate oxygenation; (3) Check for systemic causes — hypothermia, hypotension, and volatile anesthetic depth can cause IONM changes that are not related to surgical injury; (4) Document the IONM changes and interventions. Time is critical — if spinal cord ischemia is not reversed promptly, permanent paraplegia can result.",
    learningObjective: "Recognize significant IONM changes during spinal surgery and initiate immediate team communication to prevent permanent neurological injury",
    blueprintCategory: "Intraoperative Care",
    subtopic: "neurophysiological monitoring",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SSEP alarm criteria: >50% amplitude decrease and/or >10% latency increase. This may indicate spinal cord ischemia — immediate action is required.",
    clinicalPearls: [
      "SSEP alarm: >50% amplitude decrease or >10% latency increase = potential spinal cord compromise",
      "SSEPs monitor sensory (dorsal) columns; MEPs monitor motor (ventral) pathways",
      "Optimize spinal cord perfusion: increase MAP, correct anemia, ensure oxygenation"
    ],
    safetyNote: "A significant IONM change requires immediate response — delayed intervention can result in permanent paraplegia",
    distractorRationales: [
      "While electrocautery can cause artifact, a consistent 50% amplitude decrease requires immediate investigation",
      "Electrode repositioning may be needed but the finding must first be treated as a potential emergency",
      "A 50% amplitude decrease is NOT a normal finding and always requires investigation"
    ]
  },
  {
    stem: "The circulating nurse is managing the surgical specimen from a right breast lumpectomy for breast cancer. The surgeon requests the specimen be sent 'fresh' to pathology for margin assessment. What is the critical nursing action for specimen handling?",
    options: [
      "Place the specimen in formalin solution for preservation before sending to pathology",
      "Do NOT place the specimen in formalin — label the specimen with patient identifiers, orient the specimen as directed by the surgeon (marking specific margins with sutures or ink), and transport it fresh (unfixed) to pathology immediately",
      "Place the specimen in saline solution and send it to pathology at the end of the day",
      "Take a photograph of the specimen and send the photograph to pathology instead"
    ],
    correctAnswer: 1,
    rationaleLong: "When a surgeon requests that a specimen be sent 'fresh' (unfixed) to pathology, it is critical that the specimen NOT be placed in formalin (formaldehyde fixative solution). Formalin fixation cross-links proteins and nucleic acids, which preserves tissue architecture but prevents certain types of analysis that require fresh tissue, including: frozen section margin assessment (where the pathologist rapidly freezes and sections the tissue to evaluate margins while the patient is still in surgery), hormone receptor testing, genetic testing, and flow cytometry. For breast cancer lumpectomy, margin status is the most critical information — the pathologist determines whether the tumor extends to the margins of the specimen (positive margin = cancer cells at the edge, potentially requiring re-excision). The nurse must: (1) NOT place the specimen in formalin — this destroys the ability to perform frozen section; (2) Label the specimen with two patient identifiers (name and medical record number) at the time of receipt from the surgeon; (3) Orient the specimen as directed by the surgeon — typically using orienting sutures (e.g., long suture = lateral, short suture = superior) or ink of different colors on specific margins; (4) Document the specimen in the operative record including laterality, site, and orientation; (5) Transport the specimen to pathology immediately — fresh tissue deteriorates rapidly at room temperature.",
    learningObjective: "Handle surgical specimens correctly based on surgeon instructions, including fresh specimen management for margin assessment",
    blueprintCategory: "Intraoperative Care",
    subtopic: "specimen management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Fresh specimen = NO formalin. Formalin prevents frozen section margin assessment. Label, orient, and transport to pathology IMMEDIATELY.",
    clinicalPearls: [
      "Fresh specimen: do NOT place in formalin — it prevents frozen section analysis",
      "Orientation with sutures or ink is critical for margin identification",
      "Label with TWO patient identifiers and transport to pathology immediately"
    ],
    safetyNote: "Placing a 'fresh' specimen in formalin can necessitate a second surgery for margin re-assessment — this is a preventable specimen error",
    distractorRationales: [
      "Formalin PREVENTS frozen section analysis — it must not be used for fresh specimens",
      "Saline may be used for short-term preservation but delayed transport (end of day) is inappropriate for fresh specimens",
      "A photograph does not substitute for the physical specimen needed for histological examination"
    ]
  },
  {
    stem: "During a laparoscopic colectomy, the anesthesiologist reports that the patient's peak inspiratory pressure (PIP) has suddenly increased from 24 to 42 cmH2O, SpO2 has dropped to 89%, and there is no ETCO2 waveform. What should the circulating nurse suspect and prepare for?",
    options: [
      "Bronchospasm from allergic reaction",
      "Right mainstem intubation from ETT migration during patient repositioning",
      "Complete airway obstruction (kinked ETT, mucus plug, or ETT obstruction) — prepare suction equipment, replacement ETT, and assist the anesthesiologist with airway troubleshooting",
      "Equipment malfunction of the ventilator"
    ],
    correctAnswer: 2,
    rationaleLong: "The sudden combination of dramatically increased peak inspiratory pressure, falling oxygen saturation, and absent ETCO2 waveform (flat capnogram) during mechanical ventilation is most consistent with complete airway obstruction. The anesthesiologist is unable to deliver ventilation to the lungs, which is reflected in all three findings: high PIP (the ventilator is generating high pressure trying to push gas through an obstruction), falling SpO2 (no gas exchange is occurring), and no ETCO2 (no gas is reaching the alveoli and returning CO2). Common causes include: (1) Kinked endotracheal tube — the ETT may kink at the connector, at the teeth/bite block area, or within the trachea; (2) Mucus plug or blood clot obstructing the ETT; (3) The ETT cuff herniating over the distal opening; (4) Foreign body in the airway; (5) Severe bronchospasm (though this usually still allows some ETCO2 flow). The circulating nurse should: prepare suction equipment for ETT suctioning, have a replacement ETT available, assist the anesthesiologist with airway troubleshooting, and if indicated, prepare for re-intubation. Right mainstem intubation typically causes unilateral breath sounds and hypoxia but still allows some ventilation and ETCO2. Bronchospasm usually produces a prolonged expiratory ETCO2 waveform (shark fin pattern), not an absent waveform.",
    learningObjective: "Recognize complete airway obstruction during mechanical ventilation and assist with emergency airway management",
    blueprintCategory: "Intraoperative Care",
    subtopic: "airway emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "High PIP + no ETCO2 + desaturation = complete airway obstruction. Bronchospasm produces a 'shark fin' ETCO2 pattern, not absent ETCO2.",
    clinicalPearls: [
      "Complete airway obstruction: high PIP, absent ETCO2, rapid desaturation",
      "Common causes: kinked ETT, mucus plug, cuff herniation, foreign body",
      "Bronchospasm produces a prolonged expiratory phase (shark fin ETCO2), not absent ETCO2"
    ],
    safetyNote: "Complete airway obstruction is a life-threatening emergency — prepare for ETT suctioning, possible ETT exchange, or re-intubation",
    distractorRationales: [
      "Bronchospasm typically produces a characteristic 'shark fin' ETCO2 pattern, not absent ETCO2",
      "Right mainstem intubation causes unilateral breath sounds but still allows ventilation and ETCO2",
      "Ventilator malfunction is possible but less likely than ETT obstruction when PIP is high (indicating the ventilator is generating pressure)"
    ]
  }
];
