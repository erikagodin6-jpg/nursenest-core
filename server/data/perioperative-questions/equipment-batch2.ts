import type { PerioperativeQuestion } from "./types";

export const equipmentBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "During a laparoscopic cholecystectomy, the circulating nurse notices that the image on the video monitor appears foggy and unclear. What is the MOST likely cause and corrective action?",
    options: [
      "The light source is malfunctioning — replace the light source",
      "Fogging of the laparoscope lens due to temperature differential — apply anti-fog solution to the lens and warm the scope in sterile saline or with a commercial scope warmer before reinserting",
      "The camera head is defective — replace the entire camera system",
      "The CO2 insufflation pressure is too low — increase the insufflation pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Fogging of the laparoscope lens is one of the most common equipment-related issues during laparoscopic surgery and occurs due to the temperature differential between the cold scope (from the sterile instrument table or from being outside the body) and the warm, humid intra-abdominal environment. When the cold lens enters the warm abdomen, condensation forms on the lens surface, obscuring the image. Prevention and management strategies include: (1) Apply commercially available anti-fog solution (such as FRED, Scope Clear, or similar) to the distal lens before insertion — these hydrophilic agents prevent water droplet formation by creating a thin film on the lens surface; (2) Warm the scope before insertion by placing the distal end in warm (not hot) sterile saline or using a commercial scope warmer; (3) Touch the scope tip to a warm tissue surface inside the abdomen briefly to equalize temperature; (4) Ensure the scope is not placed on cold instrument surfaces between uses. The circulating nurse should have anti-fog solution and warm saline available before the case begins. Persistent image quality issues that do not resolve with anti-fog treatment may indicate a damaged light cable (inspect for broken fibers — a broken cable appears dark when illuminated from one end), a failing light source (check bulb hours), or camera head malfunction.",
    learningObjective: "Troubleshoot laparoscope lens fogging during laparoscopic procedures using anti-fog solutions and scope warming techniques",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "laparoscopic equipment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Scope fogging = temperature differential (cold scope, warm abdomen). Solution: anti-fog agent + warm the scope before insertion.",
    clinicalPearls: [
      "Scope fogging is caused by temperature differential — cold scope entering warm humid abdomen",
      "Prevention: anti-fog solution on lens + warm scope in sterile saline before insertion",
      "Persistent poor image: check light cable for broken fibers, light source bulb hours, camera head"
    ],
    safetyNote: "Poor visualization during laparoscopic surgery increases the risk of inadvertent injury — address image quality issues immediately",
    distractorRationales: [
      "Light source malfunction causes dim (not foggy) images — fogging is a lens condensation issue",
      "Camera head defects typically cause color distortion, lines, or complete signal loss — not fogging",
      "Insufflation pressure affects working space, not image clarity — fog is a lens surface issue"
    ]
  },
  {
    stem: "A perioperative nurse is setting up a pneumatic tourniquet for an upper extremity orthopedic procedure. The surgeon requests the tourniquet to be inflated to 250 mmHg. What safety checks should be performed BEFORE tourniquet application?",
    options: [
      "No safety checks are needed — simply inflate to the requested pressure",
      "Verify tourniquet equipment function (pressure gauge calibration, no leaks), apply appropriate-width cuff over padding at the correct location, document baseline limb assessment including pulses, set the maximum inflation time alarm, and verify the inflation pressure is appropriate for the extremity",
      "Apply the tourniquet directly to bare skin for maximum effectiveness",
      "Test the tourniquet by inflating it on the nurse's own arm"
    ],
    correctAnswer: 1,
    rationaleLong: "Pneumatic tourniquet use in orthopedic surgery requires systematic safety checks to prevent serious complications including nerve injury, vascular compromise, skin injury, and compartment syndrome. Pre-application safety checks include: (1) Equipment inspection — verify the tourniquet machine is functioning properly, the pressure gauge is calibrated per manufacturer's IFU and facility policy, check tubing and connectors for leaks by inflating an empty cuff and ensuring pressure is maintained; (2) Cuff selection — use the widest cuff that fits the limb (wider cuffs require lower inflation pressures), ensuring the cuff width is appropriate for the extremity and patient size; (3) Skin protection — apply smooth, wrinkle-free padding (stockinette or manufacturer-provided sleeve) under the cuff to prevent skin injury; NEVER apply directly to bare skin; (4) Location — apply to the proximal aspect of the extremity over the area of maximum muscle mass (typically upper arm for UE, upper thigh for LE); avoid bony prominences and the area over peripheral nerves; (5) Baseline assessment — document neurovascular status (pulses, sensation, motor function, skin color, temperature) BEFORE inflation to establish a comparison baseline; (6) Pressure verification — appropriate pressures are based on the limb occlusion pressure (LOP) plus a safety margin, or use standard guidelines: typically 250-300 mmHg for upper extremity and 300-350 mmHg for lower extremity, adjusted for patient blood pressure; (7) Time alarm — set the maximum continuous inflation time (typically 60 minutes for UE, 90-120 minutes for LE).",
    learningObjective: "Perform comprehensive pneumatic tourniquet safety checks including equipment verification, cuff selection, skin protection, and baseline assessment",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "tourniquet safety",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Tourniquet: widest cuff possible, padding under cuff, document baseline neurovasc status. Max time: 60 min UE, 90-120 min LE. Never apply to bare skin.",
    clinicalPearls: [
      "Wider cuffs require lower pressures — use the widest cuff that fits the extremity",
      "Standard pressures: 250-300 mmHg UE, 300-350 mmHg LE (adjust for patient BP)",
      "Maximum inflation time: 60 minutes UE, 90-120 minutes LE — set an audible alarm"
    ],
    safetyNote: "Document tourniquet application time, pressure, location, and pre/post inflation neurovascular assessment in the operative record",
    distractorRationales: [
      "Multiple safety checks are mandatory — inflating without verification risks serious complications",
      "Direct skin application causes friction burns and shearing injuries — padding is required",
      "Self-testing is not a valid equipment verification method"
    ]
  },
  {
    stem: "The circulating nurse is preparing the electrosurgical unit (ESU) for a procedure. The surgeon requests the use of bipolar electrosurgery. Which statement BEST describes the difference between monopolar and bipolar electrosurgery?",
    options: [
      "Monopolar uses lower power settings than bipolar",
      "In monopolar electrosurgery, current flows from the active electrode through the patient's body to the dispersive (return) electrode pad. In bipolar, current flows only between the two tines of the bipolar forceps — no dispersive pad is needed and the current path is confined to the tissue between the forceps tips",
      "Bipolar electrosurgery can only be used for cutting, while monopolar is used for coagulation",
      "There is no clinically significant difference between monopolar and bipolar electrosurgery"
    ],
    correctAnswer: 1,
    rationaleLong: "Understanding the difference between monopolar and bipolar electrosurgery is fundamental perioperative knowledge that directly impacts patient safety. In MONOPOLAR electrosurgery: current flows from the active electrode (pencil/blade), through the patient's body along the path of least resistance, and returns to the ESU generator via the dispersive electrode (grounding pad or return electrode pad). Because the current travels through the patient's body, a large dispersive pad is required to safely dissipate the returning current over a wide area, preventing burns. The dispersive pad must be placed on a large muscle mass, close to the surgical site, and must have complete adhesive contact with the skin. In BIPOLAR electrosurgery: current flows only between the two tines (tips) of the bipolar instrument (typically forceps). The current path is confined to the small amount of tissue between the two tines — it does NOT flow through the patient's body. Therefore, NO dispersive electrode pad is required. Bipolar electrosurgery has several advantages: more precise tissue effect, less thermal spread to surrounding tissue, safer for patients with implantable electronic devices, safer near vital structures (nerves, bowel), and no risk of dispersive electrode site burns. However, bipolar is primarily used for coagulation (not cutting) and uses lower power settings.",
    learningObjective: "Differentiate monopolar and bipolar electrosurgery mechanisms to understand their safety profiles and appropriate applications",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "electrosurgery",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Monopolar: current through patient's body → needs dispersive pad. Bipolar: current only between forceps tips → NO dispersive pad needed.",
    clinicalPearls: [
      "Monopolar: current through patient → dispersive pad required. Bipolar: current between tips only → no pad needed",
      "Bipolar has less thermal spread — safer near nerves, bowel, and vital structures",
      "Bipolar is safer for patients with pacemakers/ICDs because current does not travel through the body"
    ],
    safetyNote: "Monopolar dispersive pad must have complete adhesive contact on a large muscle mass — incomplete contact concentrates current and causes burns",
    distractorRationales: [
      "Bipolar actually uses lower power settings than monopolar, not the other way around",
      "Bipolar is primarily used for coagulation, not cutting — monopolar can do both cutting and coagulation",
      "There are significant clinical differences that affect patient safety and procedural technique"
    ]
  },
  {
    stem: "A perioperative nurse notices that the fiber optic light cable connected to the laparoscope has several broken fibers visible when illuminated from one end (appearing as dark spots in the light pattern). What is the impact of this finding?",
    options: [
      "Broken fibers have no impact on the procedure — the cable functions normally",
      "Broken fibers reduce light transmission resulting in a dimmer image, and if more than 20-25% of fibers are broken, the cable should be replaced. Additionally, the cable tip can become hot enough to cause burns or ignite drapes",
      "Only one broken fiber is needed to make the cable completely non-functional",
      "Broken fibers only affect the color accuracy of the image, not brightness"
    ],
    correctAnswer: 1,
    rationaleLong: "Fiber optic light cables transmit light from the light source to the laparoscope or endoscope through thousands of individual glass or quartz fibers bundled together. Each fiber transmits light independently, so the loss of individual fibers progressively reduces the total light transmission. The clinical impact depends on the percentage of broken fibers: minor fiber loss may not noticeably affect image quality, but when approximately 20-25% or more of fibers are broken, the light transmission becomes inadequate for safe surgical visualization. The nurse can check for broken fibers by holding one end of the cable up to a light source and looking at the opposite end — broken fibers appear as dark spots in the otherwise uniformly illuminated cross-section. An important safety concern with damaged light cables is HEAT GENERATION. The cable tips become extremely hot during use (temperatures can exceed 400°F/200°C). When fibers are broken, less light is transmitted through the cable, meaning more energy is absorbed by the cable tip, making it HOTTER. This creates a significant fire and burn risk. Light cables should never be placed on drapes, paper, or flammable materials when the light source is active. The cable should be placed on a non-flammable surface or the light source should be placed on standby when the scope is not in use.",
    learningObjective: "Assess fiber optic light cable integrity and understand the fire and burn risks associated with damaged cables",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "fiber optic equipment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Broken fibers = dimmer image AND hotter cable tip (increased fire/burn risk). Replace cable when >20-25% fibers broken. NEVER place active light cable on drapes.",
    clinicalPearls: [
      "Check cable integrity: hold to light — dark spots = broken fibers",
      "Replace when >20-25% of fibers are broken — progressive light loss and increased heat",
      "Cable tips exceed 400°F/200°C — significant fire and burn risk, especially with broken fibers"
    ],
    safetyNote: "Never place an active (illuminated) fiber optic cable tip on drapes, gowns, or flammable materials — this is a fire ignition source",
    distractorRationales: [
      "Broken fibers reduce light transmission and increase heat — they have significant procedural impact",
      "The cable functions with broken fibers at reduced capacity — it is not rendered completely non-functional by one fiber",
      "Broken fibers primarily affect brightness (light intensity), not just color accuracy"
    ]
  },
  {
    stem: "The circulating nurse is setting up a forced-air warming device (Bair Hugger) for a patient undergoing a total knee arthroplasty. The surgeon expresses concern about the device increasing surgical site infection (SSI) risk. Based on current evidence, what is the nurse's BEST response?",
    options: [
      "Agree with the surgeon and do not use the device",
      "Explain that current large-scale evidence does NOT support an increased SSI risk with forced-air warming, and that maintaining normothermia (≥36°C) with active warming is an established strategy to REDUCE SSI risk — hypothermia is a known SSI risk factor",
      "Suggest using only blankets instead of forced-air warming",
      "Use the forced-air warming device only after the incision is closed"
    ],
    correctAnswer: 1,
    rationaleLong: "The relationship between forced-air warming (FAW) devices and SSI risk has been debated in the literature. Initial concerns were raised by researchers with competing financial interests in alternative warming devices, suggesting that FAW disrupted laminar airflow in the OR and increased bacterial contamination of the surgical wound. However, subsequent large-scale, well-designed studies and systematic reviews have NOT supported an association between FAW and increased SSI risk. In fact, the evidence strongly supports that maintaining perioperative normothermia (core temperature ≥36°C) is one of the most important modifiable risk factors for REDUCING SSI. The landmark Kurz et al. (1996) study in NEJM demonstrated that maintaining normothermia reduced SSI rates by approximately two-thirds compared to hypothermic patients. Hypothermia increases SSI risk by: impairing neutrophil oxidative killing, reducing tissue oxygen tension (oxygen is required for neutrophil bactericidal activity), causing subcutaneous vasoconstriction (reducing antibiotic delivery to tissues), and impairing immune function. FAW is the most effective and widely recommended method for maintaining perioperative normothermia. The nurse should advocate for active warming as an evidence-based SSI prevention measure while being prepared to discuss the current evidence if questioned.",
    learningObjective: "Advocate for evidence-based forced-air warming as an SSI prevention strategy by maintaining perioperative normothermia",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "warming devices",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Forced-air warming does NOT increase SSI per current evidence. Normothermia (≥36°C) REDUCES SSI by ~66% vs. hypothermia (Kurz NEJM 1996).",
    clinicalPearls: [
      "Normothermia (≥36°C) reduces SSI by approximately 66% compared to hypothermia",
      "Hypothermia impairs neutrophil function, reduces tissue oxygenation, and impairs antibiotic delivery",
      "Forced-air warming is the most effective and recommended method for maintaining normothermia"
    ],
    safetyNote: "Active warming should be initiated preoperatively and continued throughout the case — pre-warming for 10-20 minutes reduces the redistribution hypothermia that occurs after anesthetic induction",
    distractorRationales: [
      "Deferring to the surgeon without presenting evidence fails to advocate for evidence-based patient care",
      "Passive warming (blankets) alone is insufficient to prevent perioperative hypothermia",
      "Waiting until after incision closure means the patient was hypothermic during the procedure when SSI risk is highest"
    ]
  },
  {
    stem: "A perioperative nurse is assisting with the setup for a robotic-assisted laparoscopic prostatectomy using the da Vinci surgical system. The robot has been docked to the patient. Which safety concern is UNIQUE to robotic surgery that the circulating nurse must monitor throughout the procedure?",
    options: [
      "Monitoring the patient's blood pressure",
      "Preventing patient movement or table repositioning while the robot is docked — uncoordinated movement between the patient/table and the robotic arms can cause port-site injuries, tissue tears, or robotic arm collisions",
      "Monitoring IV fluid administration rates",
      "Counting surgical sponges"
    ],
    correctAnswer: 1,
    rationaleLong: "Robotic-assisted surgery introduces unique safety considerations that do not exist in traditional open or laparoscopic surgery. The most critical robot-specific safety concern is the physical coupling between the robotic arms and the patient through the laparoscopic ports. Once the robot is 'docked' (the robotic arms are attached to the trocar ports inserted in the patient), any movement of the patient or the operating table WITHOUT first undocking the robot can cause catastrophic injuries. Specifically: (1) If the table is moved (tilted, raised, lowered, or rotated) while the robot is docked, the rigid robotic arms will pull or push against the trocar ports, potentially tearing the abdominal wall, eviscerating bowel through enlarged port sites, or causing vascular injury; (2) Robotic arm collisions can occur if the arms are improperly positioned, potentially injuring the patient or damaging the instruments; (3) The surgeon operates at the console AWAY from the patient, reducing direct visualization and tactile feedback — the bedside assistant and circulating nurse serve as the surgeon's eyes and hands at the patient. The circulating nurse must: ensure the OR table is LOCKED after final positioning and before docking; communicate with the ENTIRE team before any table adjustment; monitor the patient and robotic arms throughout the case for any signs of excessive pressure, tissue blanching, or arm interference; and ensure emergency undocking procedures are understood by all team members.",
    learningObjective: "Identify and manage the unique safety risks of robotic-assisted surgery, particularly preventing patient/table movement while the robot is docked",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "robotic surgery safety",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER move the OR table while the robot is docked. The rigid robotic arms will cause port-site injuries and tissue damage. Lock the table BEFORE docking.",
    clinicalPearls: [
      "Lock the OR table before robot docking — any table movement while docked can cause tissue injury",
      "Surgeon is at the console away from the patient — the bedside team is the surgeon's eyes and hands",
      "All team members must know the emergency undocking procedure"
    ],
    safetyNote: "In an emergency requiring immediate patient access (cardiac arrest, hemorrhage), the robot must be undocked FIRST — practice emergency undocking as a team",
    distractorRationales: [
      "Blood pressure monitoring is important but not unique to robotic surgery",
      "IV fluid management is a standard nursing responsibility, not specific to robotic cases",
      "Sponge counting is important in all surgeries, not uniquely a robotic concern"
    ]
  }
];
