import type { LessonContent } from "./types";

export const clinicalConditionsBatchELessons: Record<string, LessonContent> = {
  "pneumothorax-management-rpn": {
    title: "Pneumothorax Management",
    cellular: {
      title: "Air Entry into the Pleural Space",
      content: "A pneumothorax occurs when air enters the pleural space, disrupting the normally negative intrapleural pressure that keeps the lung expanded. This causes partial or total lung collapse. An open pneumothorax results from a penetrating chest wall injury, while a closed pneumothorax occurs after lung surgery or spontaneous alveolar rupture. A tension pneumothorax is the most life-threatening form: air enters the pleural space but cannot escape, causing progressive pressure buildup that shifts mediastinal structures to the unaffected side, compressing the heart and great vessels. The nurse must recognize deteriorating respiratory status, report findings immediately, and assist with emergency interventions as directed."
    },
    riskFactors: [
      "Chest trauma (penetrating or blunt)",
      "Thoracic surgery or procedures",
      "Tall, thin body habitus (spontaneous)",
      "COPD with bullae formation",
      "Mechanical ventilation with high PEEP",
      "Central line insertion (iatrogenic)",
      "Smoking history",
      "Previous pneumothorax"
    ],
    diagnostics: [
      "Monitor respiratory rate, depth, and oxygen saturation continuously",
      "Report diminished or absent breath sounds on the affected side",
      "Monitor vital signs for tachycardia and hypotension",
      "Report tracheal deviation toward the unaffected side",
      "Observe for subcutaneous emphysema (crepitus on palpation)",
      "Document changes in chest movement symmetry",
      "Report chest X-ray findings as communicated by the team"
    ],
    management: [
      "Apply three-sided occlusive dressing over sucking chest wound as directed",
      "Position patient in Fowler's position to facilitate breathing",
      "Administer supplemental oxygen as ordered",
      "Assist with preparation for chest tube insertion",
      "Administer pain medications as ordered",
      "Maintain bed rest during the acute phase",
      "Keep emergency equipment accessible at bedside"
    ],
    nursingActions: [
      "Assess respiratory status every 15 minutes during acute phase as directed",
      "Report progressive dyspnea, restlessness, or anxiety immediately to the RN",
      "Monitor oxygen saturation continuously and report SpO2 below ordered parameters",
      "Observe for signs of tension pneumothorax: tracheal deviation, JVD, severe hypotension",
      "Assist with positioning for chest tube insertion as directed",
      "Report cyanosis or changes in level of consciousness immediately",
      "Monitor and document chest tube drainage characteristics as directed"
    ],
    signs: {
      left: [
        "Progressive dyspnea",
        "Chest pain (pleuritic, sharp)",
        "Diminished breath sounds on affected side",
        "Hyperresonance on percussion",
        "Decreased tactile fremitus",
        "Restlessness and anxiety"
      ],
      right: [
        "Tracheal deviation (tension pneumothorax)",
        "Jugular venous distension (tension)",
        "Hypotension and tachycardia",
        "Cyanosis",
        "Subcutaneous emphysema",
        "Asymmetric chest wall movement"
      ]
    },
    medications: [
      { name: "Morphine Sulfate", type: "Opioid analgesic", action: "Binds to opioid receptors in the CNS to reduce pain perception and anxiety", sideEffects: "Respiratory depression, hypotension, constipation, sedation", contra: "Severe respiratory depression, acute or severe bronchial asthma", pearl: "Administer as ordered for pleuritic chest pain. Monitor respiratory rate before administration; hold and report if RR <12." },
      { name: "Supplemental Oxygen", type: "Respiratory support", action: "Increases inspired oxygen concentration to correct hypoxemia", sideEffects: "Oxygen toxicity with prolonged high concentrations, absorption atelectasis", contra: "Use cautiously in COPD patients with chronic CO2 retention", pearl: "Small pneumothorax may resolve faster with supplemental O2 as it accelerates reabsorption of pleural air." }
    ],
    pearls: [
      "A tension pneumothorax is a medical emergency requiring immediate needle decompression before chest X-ray confirmation",
      "A three-sided occlusive dressing creates a flutter valve effect: air exits on expiration but cannot re-enter on inspiration",
      "Report any sudden increase in dyspnea, tracheal deviation, or hypotension immediately as these suggest tension physiology"
    ],
    quiz: [
      { question: "Which assessment finding should the nurse report immediately in a patient with a chest injury?", options: ["Respiratory rate of 16 breaths/min", "Tracheal deviation away from the injured side", "Mild chest wall tenderness", "Oxygen saturation of 97%"], correct: 1, rationale: "Tracheal deviation away from the injured side indicates a tension pneumothorax, a life-threatening emergency requiring immediate intervention." },
      { question: "How should the nurse apply a dressing to a sucking chest wound?", options: ["Cover all four sides with tape", "Apply a three-sided occlusive dressing", "Leave the wound open to air", "Apply a dry gauze loosely over the wound"], correct: 1, rationale: "A three-sided occlusive dressing creates a flutter valve: the open side allows trapped air to escape on expiration while preventing air entry on inspiration." },
      { question: "Which position should the nurse assist the patient into for a pneumothorax?", options: ["Supine with legs elevated", "Fowler's position", "Left lateral decubitus", "Prone position"], correct: 1, rationale: "Fowler's position promotes lung expansion and reduces work of breathing by allowing gravity to assist diaphragmatic excursion." }
    ]
  },

  "pneumothorax-management-rn": {
    title: "Pneumothorax Management",
    cellular: {
      title: "Pathophysiology of Pleural Space Disruption",
      content: "Pneumothorax results from disruption of the visceral or parietal pleura, allowing air to accumulate in the normally negative-pressure pleural space. In a simple pneumothorax, the lung collapses proportional to the volume of trapped air. In a tension pneumothorax, a one-way valve mechanism allows air entry but prevents exit, causing progressive ipsilateral lung collapse and mediastinal shift. This shift compresses the contralateral lung and impedes venous return to the heart, leading to obstructive shock. The nurse must perform rapid respiratory and cardiovascular assessment, assist with or prepare for needle decompression or chest tube insertion, manage the chest drainage system, and monitor for complications including re-expansion pulmonary edema."
    },
    riskFactors: [
      "Penetrating or blunt chest trauma",
      "Iatrogenic (central line placement, thoracentesis, lung biopsy)",
      "Positive pressure mechanical ventilation",
      "COPD with emphysematous bullae",
      "Primary spontaneous (tall, thin males 20-40 years)",
      "Connective tissue disorders (Marfan, Ehlers-Danlos)",
      "Cystic fibrosis",
      "Tuberculosis or necrotizing pneumonia"
    ],
    diagnostics: [
      "Perform focused respiratory assessment: breath sounds, percussion, chest expansion symmetry",
      "Interpret chest X-ray: visible pleural line, absent lung markings beyond the line, mediastinal shift",
      "Monitor ABG results for hypoxemia and respiratory acidosis",
      "Assess for subcutaneous emphysema by palpation of chest, neck, and face",
      "Monitor continuous pulse oximetry and capnography trends",
      "Evaluate hemodynamic stability: BP, HR, CVP trends",
      "Assess for signs of re-expansion pulmonary edema after chest tube placement"
    ],
    management: [
      "For tension pneumothorax: assist with emergent needle decompression at 2nd intercostal space, midclavicular line",
      "Prepare for and assist with chest tube insertion (typically 4th-5th intercostal space, anterior axillary line)",
      "Connect chest tube to water-seal drainage system and verify function",
      "Administer oxygen to maintain SpO2 >94% via appropriate delivery device",
      "Implement pain management protocol with IV analgesics",
      "Position patient with affected side up for simple pneumothorax if tolerated",
      "Prepare for possible pleurodesis in recurrent cases",
      "Monitor chest tube output and air leak status"
    ],
    nursingActions: [
      "Perform serial respiratory assessments every 1-2 hours post-chest tube placement",
      "Verify chest tube connections are secure and all tubing is free of dependent loops or kinks",
      "Assess water-seal chamber for tidaling (expected until lung re-expands) and continuous bubbling (air leak)",
      "Monitor and document chest tube drainage volume, color, and consistency hourly",
      "Ensure collection device remains below the level of the chest insertion site at all times",
      "Assess insertion site dressing for integrity, subcutaneous emphysema, and drainage",
      "Coordinate follow-up chest X-ray to confirm lung re-expansion",
      "Educate patient on splinting techniques for coughing and deep breathing exercises"
    ],
    signs: {
      left: [
        "Absent or diminished breath sounds",
        "Hyperresonance on percussion",
        "Decreased chest wall movement",
        "Pleuritic chest pain",
        "Dyspnea and tachypnea",
        "Decreased SpO2"
      ],
      right: [
        "Tracheal deviation (tension)",
        "JVD with hypotension (tension)",
        "Pulsus paradoxus (tension)",
        "Subcutaneous emphysema",
        "Cyanosis",
        "Cardiac arrest (PEA) in severe tension"
      ]
    },
    medications: [
      { name: "Morphine Sulfate", type: "Opioid analgesic", action: "Binds mu-opioid receptors reducing pain perception and sympathetic drive", sideEffects: "Respiratory depression, hypotension, sedation, nausea", contra: "Hemodynamic instability, severe respiratory compromise without ventilatory support", pearl: "Adequate pain control is essential for effective deep breathing and coughing. Assess pain before and after administration using validated tool." },
      { name: "Ketorolac", type: "NSAID analgesic", action: "Inhibits COX-1 and COX-2 to reduce prostaglandin-mediated inflammation and pain", sideEffects: "GI bleeding, renal impairment, platelet dysfunction", contra: "Active bleeding, renal failure, perioperative CABG setting", pearl: "Effective adjunct for pleuritic chest pain. Limit use to 5 days maximum. Reduces opioid requirements." },
      { name: "Lidocaine 1%", type: "Local anesthetic", action: "Blocks sodium channels in nerve fibers to prevent pain signal transmission at insertion site", sideEffects: "Local tissue reaction, systemic toxicity if inadvertent IV injection", contra: "Allergy to amide anesthetics", pearl: "Used for local infiltration at chest tube insertion site. Maximum dose 4.5 mg/kg without epinephrine." }
    ],
    pearls: [
      "Tension pneumothorax is a clinical diagnosis: do NOT delay treatment to obtain a chest X-ray",
      "Continuous bubbling in the water-seal chamber indicates an active air leak; intermittent bubbling with coughing is expected",
      "Never clamp a chest tube unless specifically ordered or during system changes: clamping can recreate a tension pneumothorax",
      "If a chest tube becomes disconnected, submerge the end in sterile water to create a temporary water seal",
      "Re-expansion pulmonary edema can occur after rapid lung re-expansion: monitor for new-onset cough, hypoxemia, and frothy sputum"
    ],
    quiz: [
      { question: "Which is the priority nursing action for a patient with suspected tension pneumothorax?", options: ["Obtain a stat chest X-ray", "Prepare for emergency needle decompression at the 2nd intercostal space", "Administer IV morphine for pain", "Insert a Foley catheter to monitor urine output"], correct: 1, rationale: "Tension pneumothorax is a clinical emergency. Needle decompression at the 2nd intercostal space, midclavicular line, must be performed immediately without waiting for imaging confirmation." },
      { question: "The nurse observes continuous bubbling in the water-seal chamber of a chest tube system. What does this indicate?", options: ["Normal functioning of the system", "The lung has fully re-expanded", "An active air leak in the system or from the patient", "The suction pressure is set too high"], correct: 2, rationale: "Continuous bubbling in the water-seal chamber indicates an active air leak, which could be from the patient's pleural space or a system connection leak. The nurse should check all connections and report the finding." },
      { question: "A chest tube accidentally becomes disconnected from the drainage system. What is the RN's immediate action?", options: ["Clamp the chest tube with two hemostats", "Place the open end in a container of sterile water", "Reconnect to the same drainage system", "Remove the chest tube and apply an occlusive dressing"], correct: 1, rationale: "Submerging the open end in sterile water creates a temporary water seal, preventing air entry while allowing trapped air to escape. This prevents tension pneumothorax while the system is reestablished." }
    ]
  },

  "chest-drainage-system-rpn": {
    title: "Chest Drainage Systems",
    cellular: {
      title: "Principles of Chest Drainage",
      content: "A chest drainage system is a closed system that removes air, fluid, or blood from the pleural space to re-establish negative intrapleural pressure and allow lung re-expansion. The system typically consists of three chambers: a collection chamber for drainage, a water-seal chamber that acts as a one-way valve preventing air re-entry, and a suction control chamber that regulates the amount of negative pressure applied. Tidaling (fluctuation of fluid in the water-seal chamber with respiration) is an expected finding that indicates the system is functioning and patent until the lung fully re-expands. The nurse must monitor the system, report abnormal findings, and maintain patient safety."
    },
    riskFactors: [
      "Pneumothorax requiring evacuation",
      "Hemothorax or pleural effusion",
      "Post-thoracic surgery",
      "Empyema drainage",
      "Chylothorax",
      "Chest trauma with hemopneumothorax"
    ],
    diagnostics: [
      "Monitor and document drainage volume hourly as directed",
      "Observe drainage color and consistency: serous, sanguineous, or purulent",
      "Report drainage exceeding 100 mL/hour to the nurse immediately",
      "Observe water-seal chamber for tidaling and report its absence",
      "Report continuous bubbling in the water-seal chamber",
      "Monitor vital signs for tachycardia or hypotension suggesting blood loss",
      "Observe insertion site dressing for intact seal and signs of drainage"
    ],
    management: [
      "Keep the collection device below the level of the chest insertion site at all times",
      "Ensure tubing is free from kinks and dependent loops",
      "Do not strip or milk chest tubes as it increases negative pressure",
      "Reinforce the occlusive dressing around the insertion site as directed",
      "Encourage deep breathing exercises as tolerated",
      "Maintain patient in semi-Fowler's position unless otherwise ordered",
      "Keep two padded clamps at the bedside for emergencies"
    ],
    nursingActions: [
      "Monitor chest tube drainage characteristics and volume every 1-2 hours as directed",
      "Report sudden bright red or free-flowing drainage immediately",
      "Observe water-seal chamber: tidaling is normal, continuous bubbling is abnormal",
      "Check all tubing connections for tightness at the beginning of each shift",
      "Ensure collection system is upright and below the chest insertion site",
      "Report if drainage stops suddenly (may indicate tube occlusion or kink)",
      "Assist patient with position changes, ensuring tubing is not compressed",
      "Report any respiratory distress or change in breath sounds to the RN"
    ],
    signs: {
      left: [
        "Tidaling in water-seal chamber (normal)",
        "Serous drainage in collection chamber",
        "Gradual decrease in drainage volume",
        "Improved breath sounds over time",
        "Stable vital signs",
        "Patient reports decreased dyspnea"
      ],
      right: [
        "Continuous bubbling in water-seal (air leak)",
        "Sudden bright red drainage >100 mL/hr",
        "Absent tidaling (tube occlusion or full re-expansion)",
        "Subcutaneous emphysema at insertion site",
        "Increasing dyspnea despite drainage",
        "Dislodged chest tube"
      ]
    },
    medications: [
      { name: "Acetaminophen", type: "Non-opioid analgesic", action: "Inhibits prostaglandin synthesis centrally to reduce pain and fever", sideEffects: "Hepatotoxicity at high doses", contra: "Severe hepatic impairment, doses exceeding 4g/day", pearl: "Administer as ordered for mild chest tube site pain. Report uncontrolled pain requiring escalation to opioid analgesics." },
      { name: "Hydromorphone", type: "Opioid analgesic", action: "Mu-opioid receptor agonist for moderate to severe pain relief", sideEffects: "Respiratory depression, sedation, constipation, nausea", contra: "Severe respiratory depression, paralytic ileus", pearl: "Adequate pain control is essential for effective coughing and deep breathing. Monitor sedation level and respiratory rate before and after administration." }
    ],
    pearls: [
      "Never raise the collection device above the chest level: fluid can flow back into the pleural space",
      "Tidaling stops when the lung is fully re-expanded or the tube is occluded: assess breath sounds to differentiate",
      "If the chest tube becomes accidentally dislodged, cover the site immediately with a petroleum-impregnated gauze and notify the RN",
      "Continuous bubbling in the water-seal chamber means air is leaking and must be reported"
    ],
    quiz: [
      { question: "The nurse observes that tidaling has stopped in the water-seal chamber. What is the most appropriate action?", options: ["Clamp the chest tube to restart tidaling", "Assess breath sounds and report the finding to the RN", "Increase the suction pressure", "Milk the tubing to restore flow"], correct: 1, rationale: "Absent tidaling can mean the lung has re-expanded (positive finding) or the tube is occluded (negative finding). The nurse should assess breath sounds and report to the nurse for further evaluation." },
      { question: "What should the nurse do if the chest tube drainage becomes suddenly bright red and exceeds 100 mL in one hour?", options: ["Document the finding and reassess in 2 hours", "Report to the nurse immediately", "Strip the tubing to clear clots", "Reduce the suction pressure"], correct: 1, rationale: "Sudden bright red drainage exceeding 100 mL/hour suggests hemorrhage and requires immediate notification of the nurse and healthcare provider for possible surgical intervention." },
      { question: "Which action should the nurse avoid when managing a chest drainage system?", options: ["Keeping the collection device below the chest", "Stripping or milking the tubing", "Checking connections for tightness", "Monitoring drainage volume hourly"], correct: 1, rationale: "Stripping or milking chest tubes creates excessive negative pressure that can damage lung tissue. This practice is no longer recommended." }
    ]
  },

  "chest-drainage-system-rn": {
    title: "Chest Drainage Systems",
    cellular: {
      title: "Physics and Clinical Application of Pleural",
      content: "Chest drainage systems operate on the principle of restoring negative intrapleural pressure by providing a one-way evacuation path for air and fluid. Modern disposable units integrate three chambers: the collection chamber measures output, the water-seal chamber prevents atmospheric air re-entry (acting as a one-way valve), and the suction control chamber (wet or dry) regulates applied negative pressure. Water-seal tidaling reflects respiratory pressure changes transmitted through the pleural space and confirms system patency. Air leak assessment is performed systematically by evaluating bubbling in the water-seal chamber: continuous bubbling indicates a persistent bronchopleural fistula or system breach. The nurse manages the entire chest drainage system, troubleshoots complications, interprets assessment findings, titrates suction, and determines readiness for tube removal."
    },
    riskFactors: [
      "Postoperative thoracotomy or cardiac surgery",
      "Traumatic hemopneumothorax",
      "Large-volume pleural effusion",
      "Empyema requiring drainage",
      "Persistent air leak (bronchopleural fistula)",
      "Post-chest tube insertion complications"
    ],
    diagnostics: [
      "Assess and document drainage volume, color, and consistency hourly",
      "Evaluate water-seal chamber for tidaling and air leak grading",
      "Perform systematic air leak assessment: clamp sequentially from patient outward to localize source",
      "Interpret chest X-ray for lung expansion, tube position, and residual air/fluid",
      "Auscultate breath sounds bilaterally to correlate with drainage and X-ray findings",
      "Monitor hemoglobin and hematocrit if sanguineous drainage is significant",
      "Assess ABG results for oxygenation and ventilation adequacy"
    ],
    management: [
      "Maintain water-seal at prescribed level (typically 2 cm H2O)",
      "Set suction control as ordered: -20 cm H2O standard (verify wet vs. dry suction system)",
      "Perform systematic troubleshooting for absent tidaling: check for kinks, clots, or lung re-expansion",
      "For air leak: grade severity, assess all connections, secure insertion site dressing",
      "Criteria for chest tube removal: resolved air leak ≥24 hours, drainage <200 mL/day, lung fully expanded on imaging",
      "Prepare for chest tube removal: premedicate with analgesic, instruct patient in Valsalva or end-expiration breath hold",
      "Apply petroleum-impregnated gauze dressing immediately upon tube removal",
      "Order post-removal chest X-ray within 2 hours to confirm sustained lung expansion"
    ],
    nursingActions: [
      "Perform comprehensive respiratory assessment every 2-4 hours and correlate with drainage system findings",
      "Document hourly drainage output with time markers on the collection chamber",
      "Assess insertion site each shift for subcutaneous emphysema, infection, and dressing integrity",
      "Educate patient on the importance of not pulling on tubing, coughing, and deep breathing exercises",
      "Maintain two padded clamps at bedside for emergency clamping during system breaks only",
      "If system cracks or breaks, submerge tubing in sterile water as temporary water seal",
      "Facilitate safe patient ambulation with portable chest drainage unit below waist level",
      "Coordinate with respiratory therapy for incentive spirometry and chest physiotherapy"
    ],
    signs: {
      left: [
        "Tidaling with respirations (system patent)",
        "Gradual decrease in drainage output",
        "Intermittent bubbling with cough only",
        "Improving breath sounds bilaterally",
        "Lung re-expansion on follow-up X-ray",
        "Patient tolerating ambulation"
      ],
      right: [
        "Continuous bubbling (persistent air leak/system breach)",
        "Absence of tidaling (occlusion or full expansion)",
        "Sanguineous drainage >100 mL/hr (hemorrhage)",
        "Tension physiology after clamping (contraindicated)",
        "Subcutaneous emphysema expanding",
        "New respiratory distress with tube in place"
      ]
    },
    medications: [
      { name: "Morphine IV", type: "Opioid analgesic", action: "Central mu-receptor agonist providing analgesia and reducing sympathetic response", sideEffects: "Respiratory depression, hypotension, nausea, constipation", contra: "Severe hypotension, respiratory failure without ventilatory support", pearl: "Administer 15-30 minutes before chest tube removal for procedural analgesia. PCA may be appropriate for ongoing chest tube pain." },
      { name: "Cefazolin", type: "First-generation cephalosporin", action: "Inhibits bacterial cell wall synthesis; prophylactic coverage for chest tube insertion", sideEffects: "Allergic reaction, GI disturbance, phlebitis at IV site", contra: "Anaphylaxis to cephalosporins; use with caution in penicillin allergy", pearl: "May be ordered prophylactically for traumatic chest tube placement. Single dose typically sufficient; prolonged antibiotics increase resistance risk." }
    ],
    pearls: [
      "Never clamp a chest tube in a patient with a known air leak: this recreates tension pneumothorax",
      "Wet suction systems must have continuous gentle bubbling in the suction control chamber to confirm suction is applied",
      "Mark drainage levels with time on the collection chamber to track hourly output trends",
      "If dependent loops form in the tubing, gently lift the tubing to drain fluid toward the collection device",
      "Post-removal: monitor the patient for at least 2 hours and obtain a chest X-ray to rule out recurrent pneumothorax"
    ],
    quiz: [
      { question: "The nurse is preparing a patient for chest tube removal. Which criteria must be met?", options: ["Drainage >500 mL/day with resolved air leak", "Air leak resolved ≥24 hours, drainage <200 mL/day, lung fully expanded", "Continuous bubbling with stable vital signs", "Drainage present for less than 12 hours"], correct: 1, rationale: "Chest tube removal requires resolution of the air leak for at least 24 hours, drainage less than 200 mL/day, and confirmed full lung expansion on imaging." },
      { question: "During ambulation, the chest drainage collection device is accidentally elevated above the patient's chest. What should the nurse do?", options: ["Clamp the chest tube immediately", "Lower the device below chest level and assess the patient", "Disconnect the tubing and reconnect", "Stop ambulation and obtain a chest X-ray immediately"], correct: 1, rationale: "The device should be immediately lowered below chest level to prevent back-flow of drainage into the pleural space. The nurse should then assess the patient for respiratory changes." },
      { question: "The suction control chamber of a wet suction system has stopped bubbling. What does this indicate?", options: ["The lung has fully re-expanded", "Suction is not being applied to the system", "An air leak has resolved", "The water-seal chamber is functioning properly"], correct: 1, rationale: "In a wet suction system, gentle continuous bubbling in the suction control chamber confirms that wall suction is being applied. Absence of bubbling indicates suction is disconnected or wall suction is off." }
    ]
  },

  "malignant-hyperthermia-rpn": {
    title: "Malignant Hyperthermia",
    cellular: {
      title: "Hypermetabolic Crisis in Skeletal Muscle",
      content: "Malignant hyperthermia (MH) is a rare, inherited, life-threatening disorder triggered by certain anesthetic agents, most commonly succinylcholine and volatile inhalational anesthetics. In susceptible individuals (autosomal dominant mutation in the ryanodine receptor gene RYR1), these agents cause uncontrolled release of calcium from the sarcoplasmic reticulum into the muscle cell cytoplasm. This triggers sustained skeletal muscle contraction and hypermetabolism, producing excessive heat, carbon dioxide, and lactic acid. Without rapid intervention, the condition progresses to rhabdomyolysis, hyperkalemia, metabolic acidosis, and cardiac arrest. The nurse must recognize early warning signs, assist with emergency interventions, and report changes in the patient's condition immediately."
    },
    riskFactors: [
      "Family history of malignant hyperthermia",
      "Autosomal dominant genetic mutation (RYR1 gene)",
      "Previous adverse reaction to anesthesia",
      "Exposure to succinylcholine (primary trigger)",
      "Exposure to volatile inhalational anesthetics (halothane, sevoflurane, desflurane)",
      "Extreme heat exposure or strenuous exercise in susceptible individuals",
      "Concurrent stress or trauma"
    ],
    diagnostics: [
      "Monitor vital signs continuously during and after anesthesia as directed",
      "Report any unexplained rise in end-tidal CO2 (early sign)",
      "Monitor temperature and report rapid progressive elevation",
      "Report muscle rigidity, particularly masseter (jaw) rigidity after succinylcholine",
      "Observe for tachycardia and unstable blood pressure",
      "Report dark red or cola-colored urine (myoglobinuria)",
      "Monitor cardiac rhythm for dysrhythmias as directed"
    ],
    management: [
      "Assist with discontinuation of triggering anesthetic agent immediately",
      "Assist with preparation and administration of dantrolene as directed",
      "Apply cooling measures: cooling blankets, ice packs to axillae and groin",
      "Administer chilled IV solutions as ordered",
      "Assist with preparation of 100% oxygen delivery",
      "Maintain IV access for rapid fluid and medication administration",
      "Keep emergency equipment accessible"
    ],
    nursingActions: [
      "Report any unexplained tachycardia, rigidity, or temperature rise during surgery immediately",
      "Assist with ice packs and cooling blanket application as directed",
      "Monitor temperature continuously and report trends to the RN",
      "Assist with mixing dantrolene (reconstitute with sterile water) as directed",
      "Monitor urine output and color; report dark or decreased urine",
      "Maintain accurate intake and output records",
      "Assist with arterial blood gas specimen collection as directed",
      "Document all interventions and patient responses"
    ],
    signs: {
      left: [
        "Unexplained rise in end-tidal CO2 (earliest sign)",
        "Masseter muscle rigidity after succinylcholine",
        "Tachycardia",
        "Tachypnea",
        "Unstable blood pressure",
        "Diaphoresis"
      ],
      right: [
        "Rapid progressive hyperthermia (can exceed 107°F/41.7°C)",
        "Generalized muscle rigidity",
        "Dark red urine (myoglobinuria)",
        "Cardiac dysrhythmias",
        "Metabolic and respiratory acidosis",
        "Cardiac arrest"
      ]
    },
    medications: [
      { name: "Dantrolene Sodium", type: "Skeletal muscle relaxant", action: "Blocks calcium release from the sarcoplasmic reticulum, stopping the hypermetabolic cascade in skeletal muscle", sideEffects: "Muscle weakness, hepatotoxicity with prolonged use, phlebitis at IV site", contra: "Active hepatic disease (for chronic oral use); no absolute contraindication in MH emergency", pearl: "Initial dose 2.5 mg/kg IV push, repeated every 5-10 minutes until symptoms resolve. May require up to 10 mg/kg total. Each vial requires 60 mL sterile water for reconstitution: have multiple staff mixing simultaneously." }
    ],
    pearls: [
      "End-tidal CO2 rise is typically the FIRST sign of malignant hyperthermia, often appearing before temperature elevation",
      "Jaw rigidity after succinylcholine is a classic early warning: report immediately even if no other signs are present",
      "Dantrolene must be reconstituted with sterile water only (not normal saline or lactated Ringer's)",
      "Ask about family history of anesthesia complications during preoperative screening"
    ],
    quiz: [
      { question: "Which is typically the earliest sign of malignant hyperthermia during surgery?", options: ["High fever exceeding 107°F", "Dark red urine", "Unexplained rise in end-tidal CO2", "Cardiac arrest"], correct: 2, rationale: "An unexplained rise in end-tidal CO2 is typically the first sign of malignant hyperthermia, reflecting the hypermetabolic state before temperature elevation becomes apparent." },
      { question: "The nurse is assisting with reconstitution of dantrolene. Which solution should be used?", options: ["Normal saline (0.9% NaCl)", "Lactated Ringer's solution", "Sterile water for injection", "Dextrose 5% in water"], correct: 2, rationale: "Dantrolene must be reconstituted with sterile water for injection only. Other solutions can cause precipitation and inactivation of the drug." },
      { question: "Which finding should the nurse report immediately during the postoperative period in a patient with a known family history of MH?", options: ["Mild incisional pain rated 3/10", "Progressive muscle rigidity and unexplained tachycardia", "Drowsiness from residual anesthesia", "Appetite returning within 2 hours"], correct: 1, rationale: "Progressive muscle rigidity and unexplained tachycardia in a patient with MH risk factors are early warning signs requiring immediate reporting and evaluation for possible malignant hyperthermia." }
    ]
  },

  "malignant-hyperthermia-rn": {
    title: "Malignant Hyperthermia",
    cellular: {
      title: "Molecular Pathophysiology",
      content: "Malignant hyperthermia is triggered when susceptible individuals with RYR1 mutations are exposed to volatile anesthetics or depolarizing neuromuscular blocking agents. The mutation causes the ryanodine receptor in the sarcoplasmic reticulum to become hypersensitive, releasing massive amounts of calcium into the myoplasm. This sustained calcium release causes continuous muscle contraction and hypermetabolism, consuming ATP and oxygen at exponential rates while producing excessive CO2, heat, and lactic acid. As ATP stores are depleted, sarcolemma integrity fails, releasing intracellular contents including potassium, myoglobin, and creatine kinase into the bloodstream. This leads to life-threatening hyperkalemia, metabolic acidosis, rhabdomyolysis with acute kidney injury, disseminated intravascular coagulation, and cardiac arrest. The nurse must coordinate the emergency response, administer dantrolene, implement aggressive cooling, and manage metabolic derangements simultaneously."
    },
    riskFactors: [
      "Autosomal dominant RYR1 gene mutation",
      "Family history of MH or unexplained perioperative death",
      "Previous episode of MH",
      "Exposure to triggering agents: succinylcholine, halothane, sevoflurane, desflurane, isoflurane, enflurane",
      "History of exercise-induced rhabdomyolysis (possible MH susceptibility)",
      "Associated conditions: central core disease, King-Denborough syndrome",
      "Male sex (more commonly affected)",
      "Younger age (more frequent in children and young adults)"
    ],
    diagnostics: [
      "Monitor continuous end-tidal CO2: rapidly rising ETCO2 is the earliest and most sensitive indicator",
      "Obtain core temperature via esophageal or rectal probe: may rise 1-2°C every 5 minutes",
      "Draw stat ABG: expect mixed respiratory and metabolic acidosis",
      "Obtain stat electrolytes: hyperkalemia (K+ >6.0 mEq/L) from muscle breakdown",
      "Draw CK (creatine kinase): will rise dramatically (>20,000 U/L) within hours",
      "Monitor serum myoglobin and urine myoglobin: indicates rhabdomyolysis severity",
      "Obtain coagulation panel: DIC may develop as a late complication",
      "Monitor continuous ECG for dysrhythmias: peaked T waves, widened QRS (hyperkalemia)"
    ],
    management: [
      "Call for help and activate the MH crisis protocol immediately",
      "Discontinue ALL triggering agents and disconnect vaporizers from the anesthesia machine",
      "Hyperventilate with 100% oxygen at high fresh gas flow (≥10 L/min)",
      "Administer dantrolene 2.5 mg/kg IV push, repeat every 5-10 minutes until symptoms resolve (up to 10 mg/kg)",
      "Initiate aggressive cooling: cold IV normal saline, ice packs to axillae/groin/neck, cooling blanket, lavage if needed",
      "Treat hyperkalemia: calcium chloride or gluconate, insulin with dextrose, sodium bicarbonate",
      "Maintain urine output >2 mL/kg/hr with aggressive IV fluids and mannitol to prevent myoglobin-induced renal failure",
      "Treat dysrhythmias per ACLS protocol but avoid calcium channel blockers (fatal interaction with dantrolene)"
    ],
    nursingActions: [
      "Assign roles immediately: dantrolene mixing (multiple staff), cooling, medications, documentation",
      "Mix dantrolene rapidly: each 20 mg vial requires 60 mL sterile water; vigorous shaking needed; assign 2-3 staff to reconstitute simultaneously",
      "Insert Foley catheter to monitor hourly urine output and observe for myoglobinuria",
      "Monitor core temperature every 5 minutes during the crisis and discontinue cooling at 38°C to prevent overshoot",
      "Maintain continuous ECG monitoring and report any rhythm changes immediately",
      "Administer calcium chloride 10 mg/kg IV for life-threatening hyperkalemia with ECG changes",
      "Draw serial labs every 30-60 minutes during acute phase: ABG, K+, CK, myoglobin",
      "Continue dantrolene 1 mg/kg IV every 4-6 hours for at least 24 hours post-crisis to prevent recurrence"
    ],
    signs: {
      left: [
        "Rising end-tidal CO2 (earliest sign)",
        "Masseter spasm after succinylcholine",
        "Sinus tachycardia",
        "Tachypnea (if spontaneously breathing)",
        "Mixed venous desaturation",
        "Diaphoresis and skin mottling"
      ],
      right: [
        "Core temperature >40°C (can exceed 43°C)",
        "Generalized rigidity despite neuromuscular blockade",
        "Peaked T waves and wide QRS on ECG",
        "Dark cola-colored urine",
        "Unstable BP progressing to cardiovascular collapse",
        "DIC with diffuse bleeding (late)"
      ]
    },
    medications: [
      { name: "Dantrolene Sodium IV", type: "Direct-acting skeletal muscle relaxant", action: "Binds to the ryanodine receptor (RYR1) and prevents excessive calcium release from the sarcoplasmic reticulum, halting the hypermetabolic cascade", sideEffects: "Muscle weakness, phlebitis (alkaline pH), hepatotoxicity (chronic use), nausea", contra: "No absolute contraindication in MH emergency; avoid with calcium channel blockers (hyperkalemia and cardiovascular collapse)", pearl: "Loading dose: 2.5 mg/kg IV push every 5-10 min until crisis resolves (up to 10 mg/kg). Follow with 1 mg/kg q4-6h for 24-48 hours. MH cart should stock minimum of 36 vials (720 mg). New formulation (Ryanodex) = 250 mg/vial requiring only 5 mL reconstitution." },
      { name: "Calcium Chloride 10%", type: "Electrolyte/cardiac stabilizer", action: "Stabilizes cardiac myocyte membrane against hyperkalemia-induced arrhythmias by raising the threshold potential", sideEffects: "Tissue necrosis if extravasation, bradycardia, hypotension with rapid infusion", contra: "Digitalis toxicity (relative), hypercalcemia", pearl: "Administer 10-20 mg/kg IV through central line if available. Onset 1-3 minutes. Does NOT lower potassium; it provides time while other measures take effect." },
      { name: "Regular Insulin + Dextrose", type: "Potassium-lowering combination", action: "Insulin drives potassium intracellularly via Na+/K+-ATPase activation; dextrose prevents hypoglycemia", sideEffects: "Hypoglycemia (monitor glucose every 30 minutes), hypokalemia rebound", contra: "Monitor closely; adjust based on serial glucose and potassium levels", pearl: "Regular insulin 0.1 units/kg IV with D50W 0.5 g/kg. Onset 15-30 minutes, lasts 4-6 hours. Essential for hyperkalemia management in MH." }
    ],
    pearls: [
      "DO NOT use calcium channel blockers (verapamil, diltiazem) in MH: combined with dantrolene they cause fatal hyperkalemia and cardiovascular collapse",
      "MH can present up to 24 hours postoperatively (recrudescence): maintain monitoring and dantrolene infusion",
      "Masseter spasm alone after succinylcholine occurs in ~1% of pediatric patients and warrants evaluation: discontinue triggering agents and observe closely",
      "Minimum 36 vials of dantrolene (720 mg) should be immediately available wherever triggering agents are used",
      "Refer all survivors and at-risk family members to a specialized MH center for caffeine-halothane contracture testing"
    ],
    quiz: [
      { question: "During an MH crisis, the nurse is preparing to treat hyperkalemia. Which medication is absolutely contraindicated?", options: ["Calcium chloride", "Regular insulin with dextrose", "Verapamil (calcium channel blocker)", "Sodium bicarbonate"], correct: 2, rationale: "Calcium channel blockers combined with dantrolene can cause fatal hyperkalemia and cardiovascular collapse. This is an absolute contraindication during MH treatment." },
      { question: "How many vials of standard dantrolene should the nurse expect to mix for an 80 kg patient at the initial dose?", options: ["2 vials (40 mg)", "5 vials (100 mg)", "10 vials (200 mg)", "20 vials (400 mg)"], correct: 2, rationale: "Initial dose is 2.5 mg/kg. For an 80 kg patient: 80 × 2.5 = 200 mg. Standard vials are 20 mg each, requiring 10 vials for the initial dose. Multiple staff should reconstitute simultaneously." },
      { question: "At what temperature should the nurse discontinue active cooling measures during an MH crisis?", options: ["36°C (96.8°F)", "38°C (100.4°F)", "40°C (104°F)", "42°C (107.6°F)"], correct: 1, rationale: "Active cooling should be discontinued at 38°C to prevent hypothermia overshoot. Continued aggressive cooling below this threshold can result in dangerous hypothermia." }
    ]
  },

  "malignant-hyperthermia-np": {
    title: "Malignant Hyperthermia",
    cellular: {
      title: "Genetic Pharmacogenomics",
      content: "Malignant hyperthermia susceptibility (MHS) is an autosomal dominant pharmacogenomic disorder with variable penetrance. Over 400 causative mutations in the RYR1 gene (chromosome 19q13.1) have been identified, with additional rare mutations in CACNA1S (the dihydropyridine receptor). The ryanodine receptor is a massive calcium release channel in the sarcoplasmic reticulum. In MHS individuals, triggering agents cause conformational changes that lock the channel open, flooding the myoplasm with calcium. The clinician in perioperative or critical care settings must lead the MH crisis response, prescribe definitive pharmacotherapy, order appropriate monitoring and laboratory surveillance, manage multiorgan complications, coordinate genetic counseling referrals, and develop institutional MH preparedness protocols. The clinician must also recognize and differentiate MH from mimicking conditions including neuroleptic malignant syndrome, serotonin syndrome, thyroid storm, and heat stroke."
    },
    riskFactors: [
      "Confirmed RYR1 or CACNA1S mutation (autosomal dominant)",
      "Positive caffeine-halothane contracture test (CHCT)",
      "First-degree relative with MHS",
      "Previous MH episode (100% recurrence risk with re-exposure)",
      "Central core disease (strong RYR1 association)",
      "King-Denborough syndrome",
      "Exertional heat stroke with rhabdomyolysis (possible MHS phenotype)",
      "Unexplained perioperative cardiac arrest in family member"
    ],
    diagnostics: [
      "Order serial ABG every 30 minutes during crisis: expect pH <7.25, PaCO2 >60, base excess < -8",
      "Order stat CK: initial may be normal but rises exponentially (peak 12-24 hours, may exceed 100,000 U/L)",
      "Order serum and urine myoglobin: if positive, initiate renal protection protocol",
      "Order comprehensive metabolic panel every 2-4 hours: K+, Ca2+, phosphorus, BUN/creatinine",
      "Order coagulation panel (PT, PTT, fibrinogen, D-dimer) to evaluate for DIC",
      "Order lactate level: severely elevated reflecting anaerobic hypermetabolism",
      "Post-crisis: refer for caffeine-halothane contracture testing at accredited MH center",
      "Consider genetic testing for RYR1 mutations in patient and first-degree relatives"
    ],
    management: [
      "Lead the MH crisis response: direct all interventions and delegate roles",
      "Prescribe dantrolene 2.5 mg/kg IV push q5-10 min until crisis resolves, then 1 mg/kg IV q4-6h for 24-48 hours",
      "Prescribe hyperventilation protocol: 100% FiO2, tidal volume 10-15 mL/kg, RR 20-30",
      "Order aggressive IV fluid resuscitation: cold NS bolus 20-30 mL/kg",
      "Prescribe renal protection: target UOP 2-3 mL/kg/hr with fluids and mannitol 0.25 g/kg IV",
      "Order hyperkalemia management: calcium chloride 10 mg/kg IV, insulin 0.1 U/kg + D50W, sodium bicarbonate 1-2 mEq/kg",
      "Prescribe ICU admission for minimum 24-hour monitoring post-crisis for recrudescence",
      "Differentiate from NMS, serotonin syndrome, thyroid storm, and pheochromocytoma based on clinical context and timing"
    ],
    nursingActions: [
      "Direct the multidisciplinary crisis team and ensure MH protocol compliance",
      "Prescribe post-crisis monitoring: continuous telemetry, hourly vitals, core temperature q1h, urine output q1h",
      "Order serial labs q4-6h for 24 hours post-crisis: CK, K+, myoglobin, coags, BMP",
      "Prescribe post-crisis dantrolene prophylaxis: 1 mg/kg IV every 4-6 hours for 24-48 hours",
      "Counsel patient and family regarding genetic nature of MH and need for testing",
      "Prescribe MH susceptible medical alert bracelet and update medical record",
      "Develop safe anesthesia plan for future procedures: use non-triggering agents (propofol, ketamine, nitrous oxide, regional anesthesia)",
      "Report the event to the Malignant Hyperthermia Association of the United States (MHAUS) registry"
    ],
    signs: {
      left: [
        "Rising ETCO2 >60 mmHg despite adequate ventilation",
        "Masseter spasm after succinylcholine",
        "Mixed venous PO2 <30 mmHg",
        "Tachycardia >150 bpm unresponsive to treatment",
        "Rising core temperature >1°C every 5 minutes",
        "Lactate >5 mmol/L"
      ],
      right: [
        "Core temperature >41°C with continued rise",
        "Generalized rigidity unresponsive to non-depolarizing agents",
        "K+ >6.5 mEq/L with peaked T waves",
        "CK >20,000 U/L rising exponentially",
        "DIC with diffuse oozing from surgical sites and IVs",
        "Multi-organ failure: AKI, cardiac arrest, cerebral edema"
      ]
    },
    medications: [
      { name: "Dantrolene Sodium (Ryanodex)", type: "Concentrated skeletal muscle relaxant", action: "Directly antagonizes the RYR1 receptor, blocking excessive calcium release and halting the hypermetabolic cascade", sideEffects: "Profound muscle weakness, hepatotoxicity (oral formulation), phlebitis", contra: "Concurrent calcium channel blockers (absolute in MH); no other absolute contraindication in emergency", pearl: "Ryanodex formulation: 250 mg/vial requires only 5 mL reconstitution vs. standard 20 mg/vial requiring 60 mL. One Ryanodex vial replaces 12.5 standard vials, dramatically reducing preparation time. Continue 1 mg/kg IV q4-6h post-crisis for at minimum 24 hours." },
      { name: "Sodium Bicarbonate 8.4%", type: "Alkalinizing agent", action: "Buffers metabolic acidosis, shifts potassium intracellularly, and improves hemodynamic response to vasopressors", sideEffects: "Metabolic alkalosis, hypokalemia, hypernatremia, hyperosmolarity", contra: "Metabolic alkalosis, hypernatremia", pearl: "Prescribe 1-2 mEq/kg IV for severe metabolic acidosis (pH <7.15) and as adjunct for hyperkalemia management. Repeat based on serial ABG monitoring. Avoid excessive correction." },
      { name: "Mannitol 20%", type: "Osmotic diuretic", action: "Increases renal tubular flow rate to prevent myoglobin precipitation and cast formation in the renal tubules", sideEffects: "Fluid overload, electrolyte imbalance, rebound cerebral edema", contra: "Anuria, severe dehydration, active intracranial bleeding", pearl: "Prescribe 0.25-0.5 g/kg IV for renal protection in rhabdomyolysis. Target urine output 2-3 mL/kg/hr. Note: dantrolene formulations contain mannitol as an excipient, contributing to the osmotic diuretic effect." }
    ],
    pearls: [
      "MH recrudescence occurs in 25% of cases within 24-72 hours: ICU monitoring with continued dantrolene is essential",
      "Differentiating MH from NMS: MH occurs during/immediately after anesthetic exposure; NMS develops over 1-3 days after antipsychotic initiation/dose change",
      "Safe anesthetic alternatives for MHS patients: propofol, etomidate, ketamine, nitrous oxide, all non-depolarizing neuromuscular blockers, all regional and neuraxial techniques",
      "The caffeine-halothane contracture test remains the gold standard for diagnosis but requires surgical muscle biopsy at an accredited center",
      "Genetic testing can identify specific RYR1 mutations but a negative test does not rule out susceptibility due to incomplete gene coverage: CHCT remains necessary for definitive diagnosis"
    ],
    quiz: [
      { question: "An NP is prescribing an anesthetic plan for a patient with confirmed MH susceptibility. Which combination is safe?", options: ["Sevoflurane + succinylcholine", "Propofol + rocuronium + regional anesthesia", "Halothane + nitrous oxide", "Desflurane + sugammadex"], correct: 1, rationale: "Propofol, non-depolarizing neuromuscular blockers (rocuronium), and regional anesthesia are all non-triggering agents safe for MHS patients. All volatile anesthetics and succinylcholine must be avoided." },
      { question: "How does Ryanodex differ from standard dantrolene in the clinical setting?", options: ["It is administered orally instead of IV", "It contains 250 mg per vial requiring only 5 mL for reconstitution, dramatically reducing preparation time", "It does not require reconstitution", "It is given at lower doses than standard dantrolene"], correct: 1, rationale: "Ryanodex contains 250 mg per vial and requires only 5 mL of sterile water for reconstitution, compared to standard dantrolene which provides 20 mg per vial requiring 60 mL. This significantly reduces the time and personnel needed for preparation." },
      { question: "An NP must differentiate between malignant hyperthermia and neuroleptic malignant syndrome. Which feature distinguishes MH?", options: ["Gradual onset over 1-3 days", "Association with antipsychotic medications", "Acute onset during or immediately after anesthetic agent exposure", "Lead pipe rigidity as the predominant finding"], correct: 2, rationale: "MH has acute onset during or immediately after exposure to triggering anesthetic agents. NMS develops gradually over 1-3 days after initiation or dose escalation of antipsychotic medications." }
    ]
  },

  "wound-irrigation-rpn": {
    title: "Wound Irrigation",
    cellular: {
      title: "Principles of Wound Cleansing",
      content: "Wound irrigation is the mechanical flushing of debris, bacteria, and exudate from an open wound using pressurized fluid to reduce infection risk and promote healing. The process works through both mechanical and dilutional mechanisms: fluid pressure dislodges adherent debris and bacteria while diluting the microbial load below the infectious threshold. The optimal irrigation pressure is 4-15 psi, achieved with a 35 mL syringe and 19-gauge angiocatheter, which provides sufficient force to remove contaminants without driving bacteria deeper into tissue or damaging granulation tissue. Wounds sustained in outdoor environments have increased contamination risk including Clostridium tetani, necessitating tetanus vaccination assessment. The nurse performs wound irrigation using sterile technique, documents wound characteristics, and reports findings to the nursing team."
    },
    riskFactors: [
      "Outdoor injury with soil contamination",
      "Delayed wound treatment (>6 hours)",
      "Deep penetrating wounds",
      "Crush injuries with devitalized tissue",
      "Animal or human bites",
      "Foreign body retention",
      "Immunocompromised patient",
      "Unknown tetanus vaccination status"
    ],
    diagnostics: [
      "Assess wound location, size, depth, and wound bed characteristics before irrigation",
      "Document drainage amount, color, consistency, and odor",
      "Assess for signs of infection: erythema, warmth, swelling, purulent drainage",
      "Evaluate pain level using validated scale before and after irrigation",
      "Report any exposed bone, tendon, or foreign body to the RN",
      "Assess surrounding skin integrity",
      "Verify tetanus vaccination status and report if unknown or outdated"
    ],
    management: [
      "Administer prescribed analgesic 30 minutes before wound irrigation",
      "Perform hand hygiene and apply sterile gloves",
      "Position patient to allow gravitational flow of irrigation solution",
      "Use 35 mL syringe with 19-gauge angiocatheter for appropriate pressure",
      "Hold syringe tip approximately 1 inch (2.5 cm) above the wound surface",
      "Irrigate with low continuous pressure from top edge downward",
      "Continue flushing until solution runs clear of debris and exudate",
      "Dry wound edges with sterile gauze and apply appropriate dressing"
    ],
    nursingActions: [
      "Assess and document wound characteristics before irrigation: size, depth, bed color, drainage",
      "Place absorbent pad or towel beneath the wound before starting",
      "Remove old dressing carefully and assess for adherence or drainage patterns",
      "Maintain sterile technique throughout the irrigation procedure",
      "Irrigate from clean area to contaminated area (center to edges)",
      "Observe wound bed during irrigation for retained foreign bodies",
      "Apply sterile dressing after irrigation and label with date, time, and initials",
      "Document procedure including wound assessment, solution used, volume, and patient tolerance"
    ],
    signs: {
      left: [
        "Clean wound bed with pink granulation tissue",
        "Serous or minimal drainage",
        "Wound edges approximating",
        "Decreasing wound size over time",
        "Intact surrounding skin",
        "Patient tolerating procedure"
      ],
      right: [
        "Purulent drainage (green, yellow, thick)",
        "Increasing erythema and warmth",
        "Foul odor",
        "Wound enlargement or undermining",
        "Necrotic or slough tissue",
        "Exposed deep structures (bone, tendon)"
      ]
    },
    medications: [
      { name: "Normal Saline 0.9%", type: "Isotonic irrigation solution", action: "Provides mechanical cleansing of wound without cytotoxic effects on healing tissue", sideEffects: "None significant with topical wound use", contra: "None for wound irrigation", pearl: "Normal saline is the preferred irrigation solution as it is isotonic and non-cytotoxic to granulation tissue. Warm to body temperature to prevent vasoconstriction and patient discomfort." },
      { name: "Acetaminophen", type: "Non-opioid analgesic", action: "Inhibits central prostaglandin synthesis to reduce pain perception", sideEffects: "Hepatotoxicity at high doses", contra: "Severe hepatic disease, doses exceeding 4g/day", pearl: "Administer as ordered 30 minutes before wound irrigation for mild pain. For moderate to severe wound pain, report to the nurse for escalation to opioid analgesics." }
    ],
    pearls: [
      "Always irrigate from the cleanest area to the most contaminated area to prevent spreading bacteria",
      "The 35 mL syringe with 19-gauge angiocatheter provides the ideal 8 psi pressure for effective wound irrigation",
      "Never use a bulb syringe for wound irrigation as it does not generate adequate pressure for bacterial removal",
      "Document wound measurements using consistent technique (length × width × depth) for accurate tracking"
    ],
    quiz: [
      { question: "What equipment provides the optimal irrigation pressure for wound cleansing?", options: ["10 mL syringe with 25-gauge needle", "35 mL syringe with 19-gauge angiocatheter", "Bulb syringe with warm water", "Pour bottle of normal saline"], correct: 1, rationale: "A 35 mL syringe with a 19-gauge angiocatheter generates approximately 8 psi, which is within the therapeutic range of 4-15 psi needed to effectively remove bacteria without causing tissue damage." },
      { question: "How far above the wound should the nurse hold the syringe tip during irrigation?", options: ["Touching the wound surface", "Approximately 1 inch (2.5 cm)", "6 inches (15 cm)", "12 inches (30 cm)"], correct: 1, rationale: "Holding the syringe tip approximately 1 inch above the wound prevents the syringe from contaminating the wound while maintaining effective irrigation pressure at the wound surface." },
      { question: "In which direction should the nurse irrigate the wound?", options: ["From the edges toward the center", "From the bottom edge upward", "From the top edge downward allowing gravitational flow", "In a circular motion"], correct: 2, rationale: "Irrigation should flow from the top edge downward, using gravity to direct contaminated fluid away from clean tissue and into the collection basin." }
    ]
  },

  "wound-irrigation-rn": {
    title: "Wound Irrigation",
    cellular: {
      title: "Evidence-Based Wound Irrigation",
      content: "Wound irrigation is a critical component of wound management that directly impacts healing trajectory and infection rates. The nurse must integrate knowledge of wound healing physiology when selecting irrigation solutions, pressures, and techniques. Acute wounds progress through hemostasis, inflammation, proliferation, and remodeling phases, each requiring tailored management. Normal saline (0.9% NaCl) remains the gold standard irrigation solution as it is isotonic and non-cytotoxic to fibroblasts and keratinocytes. Antiseptic solutions (povidone-iodine, hydrogen peroxide, Dakin's solution) are cytotoxic to healing tissue and reserved for heavily contaminated or infected wounds where bacterial burden outweighs tissue damage concerns. The nurse performs comprehensive wound assessment using standardized tools, selects appropriate irrigation parameters, differentiates between wound types requiring different management approaches, and coordinates wound care planning."
    },
    riskFactors: [
      "Surgical site infection (SSI) risk factors: obesity, diabetes, malnutrition, immunosuppression",
      "Chronic wound risk: peripheral vascular disease, venous insufficiency",
      "Contamination level: clean, clean-contaminated, contaminated, dirty/infected",
      "Wound chronicity exceeding 30 days",
      "Previous wound infection or MRSA colonization",
      "Radiation therapy to the wound area",
      "Corticosteroid or immunosuppressant therapy",
      "Smoking (impairs tissue oxygenation and healing)"
    ],
    diagnostics: [
      "Perform systematic wound assessment: location, dimensions (L×W×D), tunneling, undermining",
      "Classify wound bed using RED-YELLOW-BLACK system (granulation, slough, eschar)",
      "Assess wound edges for epithelialization, maceration, or rolled edges",
      "Document periwound skin condition: erythema, induration, maceration, excoriation",
      "Obtain wound culture using Levine technique if infection is suspected (clean wound first, then rotate swab over 1 cm² for 5 seconds with sufficient pressure to express fluid)",
      "Assess and document exudate characteristics: serous, serosanguineous, sanguineous, purulent",
      "Evaluate nutritional status: albumin, prealbumin, caloric intake (essential for healing)"
    ],
    management: [
      "Select irrigation solution based on wound status: normal saline for clean wounds, antiseptic for infected wounds",
      "Calculate irrigation volume: generally 50-100 mL per cm of wound length",
      "Select appropriate pressure: 4-15 psi for acute contaminated wounds; low-pressure lavage for clean granulating wounds",
      "Implement negative pressure wound therapy (wound VAC) for appropriate wound types as ordered",
      "Coordinate wound care team involvement for complex wounds",
      "Apply appropriate dressing: moist wound healing principle matched to wound bed and exudate level",
      "Order nutritional supplementation to support healing: protein, vitamin C, zinc",
      "Implement pressure injury prevention protocols for at-risk patients"
    ],
    nursingActions: [
      "Perform wound assessment at every dressing change and document using standardized wound care terminology",
      "Implement sterile technique for acute surgical wounds; clean technique acceptable for chronic wounds per protocol",
      "Warm irrigation solution to body temperature (37°C) to prevent vasoconstriction",
      "Irrigate using pulsatile lavage for wounds with heavy necrotic tissue (per order)",
      "Obtain wound cultures before initiating new antibiotic therapy",
      "Coordinate with wound care specialist for wounds not progressing within 2-4 weeks",
      "Educate patient and caregivers on wound care, signs of infection, and when to seek care",
      "Assess and optimize modifiable healing factors: glycemic control, nutrition, offloading pressure"
    ],
    signs: {
      left: [
        "Red granulation tissue (healthy healing)",
        "Wound size decreasing on serial measurements",
        "Epithelialization at wound edges",
        "Serous or minimal exudate",
        "Clean wound margins without maceration",
        "Patient reports decreasing pain"
      ],
      right: [
        "Purulent or malodorous drainage",
        "Expanding periwound erythema or cellulitis",
        "Wound bed: pale, dusky, or necrotic tissue",
        "Increasing wound dimensions or new tunneling",
        "Systemic signs: fever, elevated WBC, tachycardia",
        "Wound dehiscence or evisceration"
      ]
    },
    medications: [
      { name: "Normal Saline 0.9%", type: "Isotonic irrigation solution", action: "Mechanical wound cleansing without cytotoxicity to fibroblasts, keratinocytes, or granulation tissue", sideEffects: "None significant for topical wound use", contra: "None for wound irrigation", pearl: "Gold standard for wound irrigation. Warm to body temperature. Adequate volume is more important than solution additives for reducing bacterial counts." },
      { name: "Dilute Sodium Hypochlorite (Dakin's 0.025%)", type: "Antiseptic irrigation", action: "Broad-spectrum bactericidal activity through hypochlorous acid generation; dissolves necrotic tissue through chlorination of amino acids", sideEffects: "Cytotoxic to fibroblasts and granulation tissue at higher concentrations", contra: "Clean granulating wounds (delays healing); sensitivity to chlorine", pearl: "Use lowest effective concentration (0.025%) for infected wounds only. Discontinue once infection clears and wound bed is clean. Change dressings every 8-12 hours for continuous antiseptic effect." },
      { name: "Silver Sulfadiazine 1% Cream", type: "Topical antimicrobial", action: "Silver ions disrupt bacterial cell wall and DNA replication; broad-spectrum coverage including Pseudomonas", sideEffects: "Leukopenia (transient), local hypersensitivity, delays epithelialization", contra: "Sulfonamide allergy, pregnancy (near term), infants <2 months", pearl: "Apply 1/16 inch thickness after irrigation for burn or infected wounds. Monitor WBC. Avoid in wounds approaching closure as silver is cytotoxic to keratinocytes." }
    ],
    pearls: [
      "The Levine wound culture technique (swab rotated over clean 1 cm² area for 5 seconds with pressure) is more accurate than superficial swabbing",
      "Moist wound healing accelerates epithelialization by 40% compared to dry healing: match dressing to exudate level",
      "Never use hydrogen peroxide or full-strength povidone-iodine on clean granulating wounds: they are cytotoxic to healing tissue",
      "Albumin <3.5 g/dL and prealbumin <20 mg/dL indicate protein malnutrition that will impair wound healing",
      "Wound evisceration is a surgical emergency: cover exposed viscera with sterile saline-moistened towels and notify the surgeon immediately"
    ],
    quiz: [
      { question: "Which wound culture technique provides the most accurate results for identifying wound infection?", options: ["Swabbing the wound surface broadly", "The Levine technique: rotating a swab over a 1 cm² area for 5 seconds with pressure", "Culturing the drainage from the dressing", "Aspirating fluid from the wound edge"], correct: 1, rationale: "The Levine technique (rotating a swab with sufficient pressure to express tissue fluid over a 1 cm² clean area for 5 seconds) provides the most accurate representation of organisms causing tissue infection, not just surface colonization." },
      { question: "Which irrigation solution is appropriate for a clean, granulating wound?", options: ["Full-strength povidone-iodine", "Hydrogen peroxide 3%", "Normal saline warmed to body temperature", "Dakin's solution full-strength"], correct: 2, rationale: "Normal saline is isotonic and non-cytotoxic to granulation tissue. Antiseptic solutions like povidone-iodine, hydrogen peroxide, and Dakin's solution are cytotoxic to fibroblasts and should be reserved for infected or heavily contaminated wounds." },
      { question: "A patient's wound shows pale wound bed, increasing size, and malodorous drainage after 3 weeks of treatment. What is the RN's priority action?", options: ["Continue current dressing regimen for another 2 weeks", "Obtain a wound culture and consult wound care specialist", "Switch to dry sterile dressing changes", "Apply hydrogen peroxide to the wound bed"], correct: 1, rationale: "A wound not progressing after 2-4 weeks with signs of possible infection requires wound culture to identify causative organisms and wound care specialist consultation for revised treatment planning." }
    ]
  },

  "wound-irrigation-np": {
    title: "Wound Irrigation",
    cellular: {
      title: "Wound Physiology",
      content: "The clinician integrates molecular wound healing science with clinical decision-making to optimize irrigation strategies and comprehensive wound management. Normal wound healing progresses through four overlapping phases: hemostasis (platelet plug and fibrin clot, minutes to hours), inflammation (neutrophil and macrophage infiltration, days 1-6), proliferation (angiogenesis, fibroplasia, and epithelialization, days 4-21), and remodeling (collagen reorganization, 21 days to 2 years). Chronic wounds stall in the inflammatory phase due to excessive protease activity (MMP-2, MMP-9), bacterial biofilm formation, and growth factor deficiency. Biofilms—structured bacterial communities encased in a polymeric matrix—are present in >60% of chronic wounds and are 100-1000x more resistant to antibiotics than planktonic bacteria. The clinician must prescribe evidence-based irrigation protocols, order appropriate diagnostics, initiate systemic and topical antimicrobial therapy, address underlying etiologies (vascular disease, diabetes, pressure), and refer for advanced wound therapies."
    },
    riskFactors: [
      "Diabetes mellitus with HbA1c >7% (impairs neutrophil function and angiogenesis)",
      "Peripheral arterial disease (ABI <0.9 reduces tissue perfusion)",
      "Chronic venous insufficiency (venous hypertension causes tissue edema and inflammation)",
      "Malnutrition (albumin <3.5 g/dL, prealbumin <20 mg/dL)",
      "Immunosuppression (corticosteroids, chemotherapy, HIV/AIDS)",
      "Smoking (carbon monoxide reduces oxygen-carrying capacity, nicotine causes vasoconstriction)",
      "Chronic renal failure (uremia impairs cellular immunity)",
      "Obesity (adipose tissue is poorly vascularized)"
    ],
    diagnostics: [
      "Order tissue biopsy for chronic wounds unresponsive to therapy (quantitative culture >10⁵ organisms/g indicates infection)",
      "Order ABI/TBI to evaluate arterial perfusion for lower extremity wounds (ABI <0.5 indicates severe PAD, may require revascularization before wound closure)",
      "Order HbA1c and fasting glucose for diabetic wound patients (target HbA1c <7% for optimal healing)",
      "Order prealbumin (half-life 2-3 days) to monitor acute nutritional status response to supplementation",
      "Order wound edge biopsy for wounds unresponsive >3 months to rule out malignant transformation (Marjolin's ulcer)",
      "Order MRI or bone scan for wounds probing to bone to evaluate for osteomyelitis",
      "Order vascular duplex ultrasound for lower extremity wounds to assess venous reflux or arterial stenosis"
    ],
    management: [
      "Prescribe irrigation protocol: normal saline with 4-15 psi pressure; antiseptic irrigants for biofilm disruption",
      "Order sharp or enzymatic debridement for necrotic tissue (collagenase ointment for autolytic debridement)",
      "Prescribe negative pressure wound therapy (wound VAC) at -75 to -125 mmHg for complex wounds",
      "Initiate systemic antibiotics based on tissue culture results for wound infection with systemic signs",
      "Order compression therapy (30-40 mmHg) for venous leg ulcers after confirming ABI >0.8",
      "Prescribe offloading devices (total contact cast) for diabetic plantar foot ulcers",
      "Refer for hyperbaric oxygen therapy for diabetic wounds unresponsive to standard therapy",
      "Order advanced wound therapies: cellular and tissue-based products, growth factors, or skin grafting for wounds failing to progress"
    ],
    nursingActions: [
      "Perform comprehensive wound assessment at each visit using standardized wound assessment tool (BWAT or PUSH)",
      "Order and interpret wound cultures: tissue biopsy preferred over surface swab for chronic wounds",
      "Prescribe nutrition optimization: protein 1.25-1.5 g/kg/day, vitamin C 500 mg BID, zinc 220 mg daily",
      "Initiate smoking cessation program and prescribe pharmacotherapy (varenicline or NRT)",
      "Optimize glycemic control in diabetic patients: adjust insulin or oral hypoglycemic regimen",
      "Coordinate multidisciplinary wound care: vascular surgery, plastic surgery, diabetes education, nutrition",
      "Prescribe appropriate pain management: topical lidocaine before procedures, systemic analgesics as needed",
      "Establish follow-up schedule based on wound complexity: weekly for acute, biweekly for chronic stable wounds"
    ],
    signs: {
      left: [
        "Progressive wound contraction (measurable reduction in area)",
        "Robust red granulation tissue filling wound base",
        "Active epithelialization migrating from wound edges",
        "Exudate decreasing in volume over time",
        "Negative wound culture results",
        "Patient reporting decreased pain at wound site"
      ],
      right: [
        "Biofilm: recurrent thin, shiny coating on wound bed despite debridement",
        "Wound stalling in inflammatory phase >4 weeks",
        "Increasing wound dimensions, tunneling, or undermining",
        "Cellulitis: expanding erythema, warmth, pain (systemic antibiotics needed)",
        "Osteomyelitis: probe-to-bone positive (89% specificity)",
        "Malignant transformation: raised, rolled edges in chronic wound (biopsy indicated)"
      ]
    },
    medications: [
      { name: "Collagenase (Santyl)", type: "Enzymatic debriding agent", action: "Selectively digests denatured collagen in necrotic tissue without damaging viable granulation tissue", sideEffects: "Local irritation, transient erythema", contra: "Use with silver or iodine dressings (inactivates enzyme)", pearl: "Apply thin layer daily to necrotic wound bed after irrigation. Cross-hatch eschar with scalpel to enhance enzyme penetration. Do not combine with silver-containing dressings." },
      { name: "Mupirocin 2% Ointment", type: "Topical antibiotic", action: "Inhibits bacterial isoleucyl-tRNA synthetase, preventing protein synthesis; effective against MRSA", sideEffects: "Local irritation, rare allergic reaction", contra: "Sensitivity to mupirocin or polyethylene glycol base", pearl: "Prescribe for MRSA-colonized wounds or nasal decolonization. Apply TID for 5-14 days. Not for use on large open wounds due to polyethylene glycol absorption risk in renal insufficiency." },
      { name: "Metronidazole Topical Gel 0.75%", type: "Topical antimicrobial", action: "Disrupts bacterial DNA synthesis in anaerobic organisms; reduces wound odor caused by anaerobic bacteria", sideEffects: "Local skin irritation", contra: "Sensitivity to metronidazole or parabens", pearl: "Particularly effective for malodorous fungating or necrotic wounds. Dramatically reduces wound odor within 24-48 hours. Apply to wound bed BID after irrigation." },
      { name: "Pentoxifylline", type: "Methylxanthine/hemorrheologic agent", action: "Increases red blood cell deformability, reduces blood viscosity, and inhibits inflammatory cytokines (TNF-alpha)", sideEffects: "Nausea, headache, dizziness", contra: "Active cerebral or retinal hemorrhage, caffeine sensitivity", pearl: "400 mg TID as adjunct therapy for venous leg ulcers. Cochrane review shows improved healing rates when combined with compression. Contraindicated with concurrent theophylline." }
    ],
    pearls: [
      "Biofilm presence should be suspected in any wound failing to progress despite appropriate therapy: sharp debridement is the most effective biofilm disruption method",
      "Probe-to-bone test with a sterile metal probe has 89% specificity for osteomyelitis in diabetic foot ulcers",
      "Wound irrigation alone reduces bacterial counts by 1-2 log units; debridement + irrigation is more effective than either alone",
      "Do not use cytotoxic antiseptics on wounds in the proliferative phase: they kill fibroblasts at lower concentrations than bacteria",
      "Target serum albumin >3.5 g/dL and prealbumin >20 mg/dL for optimal wound healing: supplement protein 1.25-1.5 g/kg/day"
    ],
    quiz: [
      { question: "An NP is managing a chronic venous leg ulcer that has not improved in 6 weeks despite compression therapy. Which additional assessment is most important?", options: ["Order a serum vitamin D level", "Confirm ABI >0.8 and obtain tissue biopsy for culture and histology", "Increase compression to 50 mmHg", "Switch to dry gauze dressings"], correct: 1, rationale: "For a chronic wound not responding to standard therapy, the clinician must verify adequate arterial perfusion (ABI >0.8 for safe compression) and obtain tissue biopsy to rule out occult infection (>10⁵ organisms/g) and malignant transformation." },
      { question: "Which finding on wound assessment has the highest specificity for osteomyelitis in a diabetic foot ulcer?", options: ["Wound depth greater than 2 cm", "Positive probe-to-bone test", "ESR >70 mm/hr", "Wound present for more than 6 months"], correct: 1, rationale: "The probe-to-bone test (inserting a sterile metal probe through the wound and feeling bone) has 89% specificity for osteomyelitis in diabetic foot ulcers and should prompt MRI or bone biopsy for confirmation." },
      { question: "An NP prescribes collagenase (Santyl) for enzymatic debridement. Which concurrent wound care product must be avoided?", options: ["Normal saline irrigation", "Hydrogel moisture dressing", "Silver-containing dressings", "Foam dressing for exudate management"], correct: 2, rationale: "Silver-containing dressings and iodine-based products inactivate the collagenase enzyme, rendering the debridement agent ineffective. These products must not be used concurrently." }
    ]
  }
};
