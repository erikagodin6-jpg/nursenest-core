import type { PerioperativeQuestion } from "./types";

export const additionalQuestions: PerioperativeQuestion[] = [
  {
    stem: "A preoperative nurse is assessing a 70-year-old patient scheduled for a radical nephrectomy. The patient's creatinine clearance is calculated at 28 mL/min. What is the perioperative significance of this finding?",
    options: [
      "Creatinine clearance of 28 mL/min is normal for a 70-year-old patient",
      "This indicates Stage 4 chronic kidney disease (GFR 15-29 mL/min) — the anesthesia team must be notified for renal-dose medication adjustments, the patient is at high risk for postoperative acute kidney injury, and nephrotoxic agents must be avoided",
      "The only concern is fluid restriction during surgery",
      "The patient should receive extra IV contrast for imaging during the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "A creatinine clearance (CrCl) of 28 mL/min indicates Stage 4 chronic kidney disease (CKD), which represents severely reduced kidney function. CKD staging: Stage 1 (GFR ≥90), Stage 2 (60-89), Stage 3a (45-59), Stage 3b (30-44), Stage 4 (15-29), Stage 5 (<15 or dialysis). This has profound perioperative implications: (1) Medication adjustments — many drugs are renally excreted and require dose reduction or avoidance. This includes antibiotics (gentamicin, vancomycin dosing), analgesics (morphine active metabolites accumulate, consider hydromorphone or fentanyl), NSAIDs (contraindicated — they further reduce GFR), and metformin (contraindicated at GFR <30); (2) Increased risk of postoperative acute kidney injury (AKI) — pre-existing CKD is the strongest predictor of perioperative AKI. The remaining kidney must be protected during radical nephrectomy since the patient will have a solitary kidney; (3) Avoid nephrotoxic agents — no IV contrast (if possible), avoid NSAIDs, minimize aminoglycoside exposure; (4) Fluid management — careful balance between adequate hydration (to maintain renal perfusion) and avoiding fluid overload (reduced excretory capacity); (5) Electrolyte monitoring — patients with Stage 4 CKD are at risk for hyperkalemia, metabolic acidosis, and hypocalcemia; (6) Anemia — CKD patients often have erythropoietin-deficiency anemia requiring preoperative optimization.",
    learningObjective: "Recognize Stage 4 CKD as a significant perioperative risk factor requiring medication adjustments and nephroprotective strategies",
    blueprintCategory: "Preoperative Patient Assessment",
    subtopic: "renal assessment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CrCl 28 = Stage 4 CKD. Avoid nephrotoxins (NSAIDs, contrast, aminoglycosides). Pre-existing CKD is the strongest predictor of perioperative AKI.",
    clinicalPearls: [
      "CKD staging: Stage 4 = GFR 15-29 mL/min — severely reduced kidney function",
      "Pre-existing CKD is the strongest predictor of perioperative acute kidney injury",
      "Avoid nephrotoxins: NSAIDs, IV contrast, aminoglycosides in patients with CKD"
    ],
    safetyNote: "After radical nephrectomy, this patient will have a solitary kidney with Stage 4 CKD — aggressive renal protection is critical",
    distractorRationales: [
      "CrCl 28 is not normal at any age — it indicates Stage 4 CKD",
      "Fluid management is important but not the only concern — medication adjustments and AKI prevention are equally critical",
      "IV contrast is nephrotoxic and should be avoided or minimized in patients with CKD"
    ]
  },
  {
    stem: "During a laparoscopic appendectomy, the scrub nurse hands the surgeon a Harmonic scalpel (ultrasonic dissector). What is the primary mechanism by which this device achieves hemostasis and tissue cutting?",
    options: [
      "Electrical current passes through the tissue, similar to electrosurgery",
      "The device uses ultrasonic mechanical vibration (55,500 Hz) to denature tissue proteins through frictional heat, achieving simultaneous cutting and coagulation without electrical current passing through the patient",
      "The device uses laser energy to cut and coagulate tissue",
      "The device uses cryogenic freezing to seal blood vessels"
    ],
    correctAnswer: 1,
    rationaleLong: "The Harmonic scalpel (ultrasonic dissector/coagulator) is fundamentally different from electrosurgery in its mechanism of action. It uses mechanical vibration at ultrasonic frequencies (typically 55,500 Hz) to achieve tissue effects. The active blade vibrates longitudinally at this frequency, creating frictional heat at the tissue interface. This mechanical energy causes protein denaturation: the hydrogen bonds in tissue proteins break, creating a sticky coagulum that seals blood vessels up to 5-7 mm in diameter. Key advantages over electrosurgery include: (1) No electrical current passes through the patient — there is no risk of dispersive electrode site burns, electrical interference with pacemakers/ICDs, or capacitive coupling injuries during laparoscopy; (2) Lower tissue temperature — the Harmonic scalpel operates at 50-100°C compared to 150-400°C for electrosurgery, resulting in less lateral thermal spread and less collateral tissue damage; (3) Minimal smoke plume — significantly less surgical smoke is generated compared to electrosurgery; (4) Simultaneous cutting and coagulation — the device can seal and divide vessels in a single application. The circulating nurse should know that the device tip remains hot after activation and should not contact non-target tissue. The device also requires a generator unit and specific handpiece that must be checked before the procedure begins.",
    learningObjective: "Understand the ultrasonic mechanical vibration mechanism of the Harmonic scalpel and its safety advantages over electrosurgery",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "ultrasonic devices",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Harmonic scalpel: ultrasonic vibration (55,500 Hz), NOT electrical current. Lower temp (50-100°C vs 150-400°C for ESU). Seals vessels up to 5-7 mm.",
    clinicalPearls: [
      "Harmonic scalpel uses mechanical vibration, not electrical current — no dispersive pad needed",
      "Operating temperature 50-100°C (lower than ESU 150-400°C) — less lateral thermal damage",
      "Can seal and divide vessels up to 5-7 mm in diameter"
    ],
    safetyNote: "The Harmonic scalpel blade tip remains hot after activation — avoid contact with non-target tissue to prevent unintended thermal injury",
    distractorRationales: [
      "No electrical current passes through the patient — this is a key distinction from electrosurgery",
      "The device uses ultrasonic mechanical energy, not laser energy",
      "The device generates heat through friction, not cold through cryogenics"
    ]
  },
  {
    stem: "A circulating nurse is performing the surgical count before wound closure for a total abdominal hysterectomy. The count includes surgical sponges, sharps, and instruments. According to AORN guidelines, who is responsible for performing the count?",
    options: [
      "Only the scrub nurse is responsible for the count",
      "The circulating nurse and the scrub person (RN or CST) perform the count together concurrently — both must visualize each item as it is counted, and the circulating nurse documents the count results",
      "Only the surgeon is responsible for ensuring all items are accounted for",
      "Any available staff member can perform the count alone"
    ],
    correctAnswer: 1,
    rationaleLong: "AORN's Guideline for Prevention of Retained Surgical Items mandates that surgical counts be performed by TWO individuals concurrently — the circulating nurse (an RN) and the scrub person (who may be an RN or a surgical technologist). The count must be performed concurrently, meaning both individuals count together at the same time, with each person VISUALIZING each item as it is counted. This dual-person concurrent approach provides: (1) A built-in verification system — two people independently verifying the same count reduces the risk of counting errors; (2) Shared accountability — both the circulating nurse and the scrub person are responsible for count accuracy; (3) Standardized process — the counting is performed audibly and visually, following a consistent sequence. The circulating nurse has the specific responsibility of: (a) Initiating counts at the required times, (b) Documenting the count in the operative record, (c) Communicating count results to the surgeon. Counts must be performed: before the procedure begins (baseline), before closure of any body cavity within a cavity, before wound closure begins, when the scrub person or circulating nurse is permanently relieved, and any time count integrity is questioned. The surgeon has a responsibility to explore the wound if a count discrepancy is identified, but the systematic counting process is a nursing responsibility.",
    learningObjective: "Apply AORN surgical count guidelines requiring concurrent counting by two designated individuals with proper documentation",
    blueprintCategory: "Patient Safety",
    subtopic: "surgical counting",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Counts must be performed by TWO people CONCURRENTLY — circulating nurse AND scrub person. Both must visualize each item. The circulator documents.",
    clinicalPearls: [
      "Two-person concurrent count: circulating nurse + scrub person — both visualize each item",
      "Count at: baseline, cavity closure, wound closure, personnel relief, and any concern",
      "Circulating nurse initiates counts, documents results, and communicates discrepancies to the surgeon"
    ],
    safetyNote: "Never perform a surgical count alone or allow distractions during the counting process — count accuracy depends on focused attention from both participants",
    distractorRationales: [
      "The scrub nurse alone is insufficient — two-person concurrent counting is required",
      "Counting is a nursing responsibility — the surgeon responds to count discrepancies but does not perform the count",
      "Counts cannot be performed by just any staff member — designated circulator and scrub person are required"
    ]
  },
  {
    stem: "A patient develops a wound infection 10 days after a colon resection. The wound culture grows Escherichia coli. According to the CDC SSI classification system, how is this infection categorized?",
    options: [
      "Superficial incisional SSI because it occurred within 30 days of surgery",
      "Deep incisional SSI because it involves the deep soft tissues (fascia, muscle) of the incision, occurring within 30 days of a procedure without an implant",
      "The classification depends on the depth of tissue involvement — superficial incisional if only skin/subcutaneous tissue is infected, deep incisional if fascia/muscle is involved, or organ/space if it involves the abdominal cavity",
      "This is not an SSI because E. coli is a normal bowel organism"
    ],
    correctAnswer: 2,
    rationaleLong: "The CDC/NHSN Surgical Site Infection classification system categorizes SSIs by the anatomic depth of infection into three categories: (1) SUPERFICIAL INCISIONAL SSI — involves only the skin and subcutaneous tissue of the incision. Criteria include: occurs within 30 days of surgery, AND involves the incision site, AND at least one of: purulent drainage from the superficial incision, organisms identified from the wound, pain/tenderness/swelling/redness, or deliberate wound opening by a surgeon due to suspected infection; (2) DEEP INCISIONAL SSI — involves the deep soft tissues of the incision (fascial and muscle layers). Criteria include: occurs within 30 days (or 90 days if an implant is in place), AND involves deep soft tissues, AND at least one of: purulent drainage from the deep incision, deep incision dehiscence or deliberate opening with signs of infection, or abscess found on direct examination or imaging; (3) ORGAN/SPACE SSI — involves any anatomic area other than the incision that was opened or manipulated during the procedure (e.g., intra-abdominal abscess after colon surgery, mediastinitis after cardiac surgery). Criteria include: occurs within 30/90 days, AND involves the organ/space, AND at least one of: purulent drainage from a drain placed in the organ/space, organisms identified from the organ/space, or abscess found on examination/imaging. For this colon resection patient, the classification depends on the depth of tissue involvement, which cannot be determined solely from the organism cultured.",
    learningObjective: "Apply the CDC/NHSN SSI classification system to categorize surgical site infections by anatomic depth of involvement",
    blueprintCategory: "Infection Prevention",
    subtopic: "SSI classification",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SSI classification by depth: superficial incisional (skin/subQ), deep incisional (fascia/muscle), organ/space (anatomic area manipulated). Time frame: 30 days (90 with implant).",
    clinicalPearls: [
      "CDC SSI types: superficial incisional, deep incisional, organ/space — classified by depth",
      "Surveillance period: 30 days for most procedures, 90 days if an implant is in place",
      "E. coli is a common SSI pathogen in colorectal procedures due to bowel contamination"
    ],
    safetyNote: "Accurate SSI classification is essential for surveillance data quality and targeted prevention strategies",
    distractorRationales: [
      "The 30-day time frame is correct but doesn't determine the depth category",
      "Deep incisional SSI involves fascia/muscle, but we need to know the depth of THIS infection to classify it",
      "E. coli causing wound infection after colon resection IS an SSI — normal bowel flora in a surgical wound is pathogenic"
    ]
  },
  {
    stem: "During a total knee arthroplasty, the circulating nurse is monitoring the use of polymethylmethacrylate (PMMA) bone cement. What is the MOST critical adverse event the nurse should be prepared for during cement insertion?",
    options: [
      "Skin irritation from cement contact",
      "Bone cement implantation syndrome (BCIS) — a triad of hypoxia, hypotension, and loss of consciousness caused by fat, marrow, and cement monomer embolization to the pulmonary vasculature during pressurization of cement into the bone",
      "Allergic reaction to the antibiotic in the cement",
      "Excessive intraoperative bleeding from the cement insertion site"
    ],
    correctAnswer: 1,
    rationaleLong: "Bone cement implantation syndrome (BCIS) is a potentially fatal complication that occurs during or shortly after pressurized insertion of polymethylmethacrylate (PMMA) bone cement into the medullary canal during orthopedic procedures (most commonly total hip and knee arthroplasty, and hemiarthroplasty for hip fractures). The mechanism involves: when cement is pressurized into the bone medullary canal, fat, marrow debris, air, cement monomer, and thromboplastin are forced into the venous sinusoids of the bone and embolize to the pulmonary vasculature. This causes: (1) Mechanical obstruction of pulmonary vasculature by fat and marrow emboli; (2) Inflammatory/immunologic response to cement monomer and tissue debris; (3) Activation of the complement and coagulation cascades. The clinical presentation (BCIS triad): hypoxia (SpO2 drops from fat emboli in the lungs), hypotension (from acute right ventricular failure due to pulmonary vascular obstruction), and altered consciousness/cardiac arrest in severe cases. BCIS is classified by severity: Grade 1 (moderate hypoxia with SpO2 <94% or BP drop >20%), Grade 2 (severe hypoxia with SpO2 <88% or BP drop >40% or unexpected loss of consciousness), Grade 3 (cardiovascular collapse requiring CPR). Risk factors include: advanced age, pre-existing cardiopulmonary disease, osteoporotic bone, femoral shaft fractures, and long-stem prostheses.",
    learningObjective: "Recognize bone cement implantation syndrome as a potentially fatal complication and prepare for immediate resuscitation during cemented arthroplasty",
    blueprintCategory: "Intraoperative Care",
    subtopic: "cement complications",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "BCIS triad: hypoxia, hypotension, loss of consciousness. Occurs during cement pressurization. Caused by fat/marrow/cement emboli to the lungs.",
    clinicalPearls: [
      "BCIS: hypoxia + hypotension + altered consciousness during cement insertion",
      "Mechanism: fat, marrow, and cement monomer emboli to pulmonary vasculature",
      "Risk factors: elderly, cardiopulmonary disease, osteoporotic bone, long-stem prostheses"
    ],
    safetyNote: "Notify the anesthesiologist BEFORE cement insertion begins — they must increase monitoring and have resuscitation drugs immediately available",
    distractorRationales: [
      "Skin irritation from cement is a minor concern compared to BCIS",
      "Antibiotic allergic reactions from cement are possible but rare and less acutely dangerous than BCIS",
      "Excessive bleeding is not the primary concern during cement insertion — embolization is the critical risk"
    ]
  },
  {
    stem: "A perioperative nurse is preparing a patient for prone positioning for a posterior lumbar spinal fusion. What is the MOST critical positioning consideration to prevent intraoperative complications?",
    options: [
      "Ensure the patient's arms are tucked at the sides",
      "Ensure the chest and abdomen are supported by a frame or bolsters that allow the abdomen to hang free — abdominal compression in the prone position increases intra-abdominal pressure, which compresses the inferior vena cava, increases epidural venous plexus engorgement and surgical bleeding, and raises intraocular pressure",
      "Place a pillow under the patient's knees for comfort",
      "Position the patient with arms extended above the head in all cases"
    ],
    correctAnswer: 1,
    rationaleLong: "Prone positioning for spinal surgery requires meticulous attention to multiple pressure points and physiological considerations. The most critical positioning consideration is ensuring the abdomen hangs free and is not compressed against the operating table surface. Abdominal compression in the prone position causes a cascade of adverse effects: (1) Increased intra-abdominal pressure (IAP) — external compression of the abdomen raises IAP, which compresses the inferior vena cava (IVC); (2) IVC compression reduces venous return to the heart, potentially causing hypotension, and diverts venous blood flow from the IVC into the epidural venous plexus (Batson's venous plexus); (3) Epidural venous plexus engorgement — the distended epidural veins directly increase surgical bleeding in the operative field, obscuring visualization and increasing blood loss; (4) Increased intraocular pressure (IOP) — elevated IAP and IVC compression, combined with the head-down dependent position of the eyes, increase IOP and decrease ocular perfusion pressure, contributing to postoperative visual loss (POVL); (5) Respiratory compromise — abdominal compression restricts diaphragmatic excursion, increasing peak airway pressures and reducing functional residual capacity. Proper prone positioning uses a Wilson frame, Jackson table, Andrews frame, or chest rolls/bolsters that support the chest and pelvis while allowing the abdomen to hang free. Additional considerations include: padding all pressure points (face, eyes, ears, breasts, genitalia, knees, toes), ensuring the endotracheal tube is secure and not kinked, and verifying bilateral equal breath sounds after positioning.",
    learningObjective: "Implement proper prone positioning with free-hanging abdomen to prevent IVC compression, excessive surgical bleeding, and postoperative visual loss",
    blueprintCategory: "Intraoperative Care",
    subtopic: "prone positioning",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Prone position: abdomen must hang FREE. Abdominal compression → IVC compression → epidural venous engorgement → increased surgical bleeding + increased IOP (visual loss risk).",
    clinicalPearls: [
      "Free-hanging abdomen prevents IVC compression and reduces epidural venous bleeding",
      "Abdominal compression increases IOP — a risk factor for postoperative visual loss (POVL)",
      "Use Wilson frame, Jackson table, or chest bolsters to support chest/pelvis with abdomen free"
    ],
    safetyNote: "Perform a complete eye check after prone positioning — ensure no direct pressure on the globes and confirm eyes are not resting on the headrest",
    distractorRationales: [
      "Arm positioning is important but not the MOST critical consideration — abdominal compression prevention takes priority",
      "A knee pillow is less critical than ensuring free abdominal suspension",
      "Arm position depends on the procedure — arms above head is not universal for prone positioning"
    ]
  },
  {
    stem: "A perioperative nurse observes that the surgeon is about to perform electrosurgery while an alcohol-based skin prep is still visibly wet on the patient's skin. What should the nurse do?",
    options: [
      "Say nothing — the surgeon is in charge of the procedure",
      "Immediately alert the surgeon to STOP — using electrosurgery on wet alcohol-based prep creates a serious fire risk. The prep must be completely dry and any pooled solution removed before activating the ESU",
      "Apply water to dilute the alcohol on the skin",
      "Turn off the overhead lights to reduce fire risk"
    ],
    correctAnswer: 1,
    rationaleLong: "Surgical fires are a devastating but preventable complication that can result in severe patient burns, disfigurement, and death. The fire triad in the operating room consists of: (1) An oxidizer (oxygen, nitrous oxide from the anesthesia circuit, room air); (2) A fuel source (surgical drapes, patient's hair, alcohol-based prep, gauze, ETT); (3) An ignition source (electrosurgical unit, laser, fiber optic light cable). Alcohol-based skin preparations (chlorhexidine-alcohol, iodine-alcohol) are highly flammable due to their isopropyl alcohol content. When the prep has not completely dried, the alcohol vapors can be ignited by electrosurgery, cautery, or laser. The fire can occur on the skin surface or under the drapes where vapors have accumulated. AORN and ECRI Institute (now ECRI) recommend: allowing alcohol-based prep to DRY COMPLETELY (minimum 3 minutes, longer for hairy areas and areas of solution pooling); removing any solution that has pooled under the patient, in the umbilicus, or in skin folds using a sterile towel; ensuring no prep-soaked materials are in contact with the patient; and confirming drying BEFORE activating any ignition source. The nurse has a professional obligation to speak up immediately, regardless of the surgeon's authority, because patient safety is paramount. Using CUS communication or a direct statement like 'The prep is still wet — we need to wait before activating the ESU' is appropriate.",
    learningObjective: "Prevent surgical fires by ensuring complete drying of alcohol-based skin preparations before electrosurgery activation",
    blueprintCategory: "Patient Safety",
    subtopic: "fire prevention",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Fire triad: oxidizer + fuel + ignition source. Alcohol-based prep must be COMPLETELY DRY (≥3 min) before ESU/laser activation. Pooled solution = extreme fire hazard.",
    clinicalPearls: [
      "OR fire triad: oxidizer (O2/N2O) + fuel (drapes, prep, hair) + ignition (ESU, laser, light cable)",
      "Alcohol-based prep: wait minimum 3 minutes for complete drying — longer for hairy areas",
      "Remove pooled solution from skin folds, umbilicus, and under the patient with a sterile towel"
    ],
    safetyNote: "SPEAK UP immediately when you see a fire risk — patient advocacy overrides hierarchical deference. Use CUS: 'This is a SAFETY issue.'",
    distractorRationales: [
      "Remaining silent when there is a clear fire risk violates the nurse's patient advocacy obligation",
      "Adding water to alcohol does not eliminate the fire risk from accumulated vapors under drapes",
      "Overhead lights are not the fire ignition risk — the ESU on wet alcohol is the imminent danger"
    ]
  },
  {
    stem: "A perioperative nurse is performing hand antisepsis before entering the operating room for a scheduled procedure. According to AORN guidelines, what are the two accepted methods of surgical hand antisepsis?",
    options: [
      "Soap and water handwashing for 15 seconds OR hand sanitizer application",
      "A traditional surgical hand scrub with an antimicrobial brush/sponge and running water (typically 2-6 minutes depending on the product) OR an alcohol-based surgical hand rub (waterless method) following manufacturer instructions",
      "Only a traditional scrub with a brush is acceptable for surgical hand antisepsis",
      "Wearing two pairs of gloves eliminates the need for surgical hand antisepsis"
    ],
    correctAnswer: 1,
    rationaleLong: "AORN recognizes two evidence-based methods for surgical hand antisepsis: (1) TRADITIONAL SURGICAL HAND SCRUB — using an antimicrobial agent (chlorhexidine gluconate or povidone-iodine) with a brush or sponge and running water. The duration depends on the specific product used (typically 2-6 minutes for the first scrub of the day, with shorter timed scrubs or a specific stroke count for subsequent scrubs). The scrub follows a systematic pattern: fingertips, fingers, hands, and forearms up to 2 inches above the elbows. Hands are held above the elbows after the scrub to allow water to flow from clean (hands) to less clean (elbows); (2) ALCOHOL-BASED SURGICAL HAND RUB (WATERLESS) — an FDA-approved surgical hand rub product containing at least 60-95% alcohol with sustained antimicrobial activity (often combined with CHG for persistence). The hands must be visibly clean before application, and the product is applied per manufacturer instructions (typically multiple applications with rubbing until dry, covering hands and forearms). Studies show that alcohol-based surgical hand rubs provide equal or superior antimicrobial efficacy compared to traditional scrubbing, with additional benefits: less skin irritation and drying, faster application, reduced water use, and more convenient availability. Both methods are acceptable per AORN, WHO, and CDC guidelines.",
    learningObjective: "Identify the two AORN-accepted methods of surgical hand antisepsis and understand their evidence-based equivalence",
    blueprintCategory: "Infection Prevention",
    subtopic: "surgical hand antisepsis",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Two methods: traditional scrub (antimicrobial + brush + water, 2-6 min) OR alcohol-based waterless rub. Both are evidence-based and AORN-accepted.",
    clinicalPearls: [
      "Two accepted methods: traditional antimicrobial scrub with water OR alcohol-based waterless surgical hand rub",
      "Alcohol-based rubs provide equal or superior antimicrobial efficacy with less skin damage",
      "Hands must be visibly clean before using the alcohol-based waterless method"
    ],
    safetyNote: "Regardless of method, ensure adequate contact time per manufacturer instructions — rushing the process compromises antimicrobial efficacy",
    distractorRationales: [
      "Routine 15-second handwashing and hand sanitizer are for non-surgical hand hygiene, not surgical antisepsis",
      "Both traditional scrub and alcohol-based rub are accepted — the brush-only method is not the only option",
      "Double-gloving reduces glove perforation risk but does NOT replace surgical hand antisepsis"
    ]
  },
  {
    stem: "A perioperative nurse is participating in a root cause analysis (RCA) after a wrong-site surgery event. What is the PRIMARY purpose of a root cause analysis?",
    options: [
      "To determine which individual is responsible and should be disciplined",
      "To identify the underlying system, process, and human factors that contributed to the adverse event, and to develop corrective actions that prevent recurrence — RCA looks beyond individual blame to identify systemic failures",
      "To create a legal defense for the facility",
      "To satisfy a regulatory reporting requirement without making actual changes"
    ],
    correctAnswer: 1,
    rationaleLong: "Root cause analysis (RCA) is a structured, systematic investigation process used to identify the fundamental underlying causes (root causes) of adverse events, near-misses, or sentinel events. The Joint Commission requires RCA for all sentinel events (unexpected events involving death or serious injury). The key principles of RCA include: (1) FOCUS ON SYSTEMS, NOT INDIVIDUALS — RCA investigates the system failures, process breakdowns, and environmental factors that allowed the event to occur. While individual actions are examined, the goal is to understand WHY the individual made the error (Was there a process gap? Was training inadequate? Was there a communication breakdown?) rather than simply assigning blame; (2) MULTIDISCIPLINARY TEAM — the RCA team includes representatives from all disciplines involved in the event; (3) CAUSAL ANALYSIS — the team uses tools such as the '5 Whys' (asking 'why' repeatedly to drill down to root causes), cause-and-effect diagrams (fishbone/Ishikawa diagrams), and process mapping to identify contributing factors; (4) CORRECTIVE ACTION PLAN — the RCA must result in specific, measurable corrective actions that address the root causes identified. Strong corrective actions involve system redesign (removing reliance on individual memory or vigilance) rather than weak actions (retraining, policy reminders); (5) MONITORING — the corrective actions must be monitored for effectiveness. For wrong-site surgery, the RCA would examine the entire verification process: was the consent accurate? Was the site marked? Was the Time-Out performed? Who participated? Were there competing demands or distractions?",
    learningObjective: "Understand root cause analysis as a systems-focused investigation tool that identifies underlying causes and generates corrective actions",
    blueprintCategory: "Professional Accountability",
    subtopic: "quality improvement",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "RCA focuses on SYSTEMS, not individual blame. The goal is to identify root causes and develop corrective actions. TJC requires RCA for sentinel events.",
    clinicalPearls: [
      "RCA focuses on systems and processes, not individual blame",
      "Tools: 5 Whys, fishbone diagrams, process mapping to identify root causes",
      "Strong corrective actions redesign systems — weak actions only retrain or remind individuals"
    ],
    safetyNote: "A punitive response to adverse events drives errors underground — just culture and systems-focused RCA improve patient safety",
    distractorRationales: [
      "RCA is not about blame or discipline — it focuses on systemic contributing factors",
      "RCA is a patient safety improvement tool, not a legal defense strategy",
      "RCA must result in actual corrective actions — completing it without implementing changes defeats its purpose"
    ]
  },
  {
    stem: "A nurse manager is reviewing the results of a staff satisfaction survey. The survey reveals that 40% of perioperative nurses report experiencing moral distress. What is moral distress in the perioperative context?",
    options: [
      "Physical exhaustion from long working hours",
      "The emotional and psychological suffering that occurs when a nurse knows the ethically correct action to take but is constrained from taking that action by institutional, hierarchical, or situational barriers",
      "Anxiety about job security during organizational restructuring",
      "Frustration with outdated equipment in the operating room"
    ],
    correctAnswer: 1,
    rationaleLong: "Moral distress is a specific psychological phenomenon distinct from burnout, compassion fatigue, or general work dissatisfaction. It was first described by Andrew Jameton in 1984 and is defined as the suffering experienced when a healthcare professional knows (or believes they know) the ethically correct action to take but cannot carry out that action due to constraints. In the perioperative setting, common sources of moral distress include: (1) Hierarchical barriers — knowing that a surgeon is performing a procedure that may not be in the patient's best interest but feeling powerless to intervene; (2) Futile care — participating in aggressive surgical procedures on terminally ill patients who have little chance of benefit; (3) Inadequate informed consent — witnessing surgical consent processes where the patient does not appear to fully understand the risks, benefits, and alternatives; (4) Staffing and resource constraints — being unable to provide the quality of care the nurse believes is appropriate due to inadequate staffing or equipment; (5) Witnessing ethical violations — observing unethical behavior (data falsification, unnecessary procedures) without the power to stop it. Moral distress has documented consequences: emotional exhaustion, depersonalization, job dissatisfaction, and ultimately leaving the profession (moral residue — the cumulative effect of repeated moral distress). Interventions include: ethics committees and consultations, debriefing sessions, shared governance empowering nurse voice, assertive communication training, and organizational support systems.",
    learningObjective: "Define moral distress and recognize its impact on perioperative nursing practice and retention",
    blueprintCategory: "Management of Personnel",
    subtopic: "staff wellbeing",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Moral distress: knowing the RIGHT action but being UNABLE to take it due to constraints. Distinct from burnout or compassion fatigue.",
    clinicalPearls: [
      "Moral distress: knowing the ethical action but being constrained from taking it",
      "Common sources: hierarchical barriers, futile care, inadequate consent, staffing constraints",
      "Moral residue: cumulative effect of repeated moral distress — leads to leaving the profession"
    ],
    safetyNote: "Moral distress contributes to nurse turnover — addressing it through ethics support and empowered communication improves retention",
    distractorRationales: [
      "Physical exhaustion describes burnout, not moral distress — they are distinct concepts",
      "Job security anxiety is a workplace stressor but not moral distress",
      "Equipment frustration is an operational concern, not an ethical constraint"
    ]
  },
  {
    stem: "A perioperative nurse is caring for a patient undergoing a Whipple procedure (pancreaticoduodenectomy). The procedure has lasted 7 hours. The circulating nurse should ensure that the patient's position is reassessed and pressure areas checked at what interval during prolonged procedures?",
    options: [
      "Position assessment is only needed at the beginning and end of the procedure",
      "Reassess the patient's position and skin integrity over pressure points at least every 2 hours during prolonged procedures, and whenever the patient is repositioned during surgery",
      "Only check positioning if the surgeon requests it",
      "Position assessment is only necessary for procedures lasting more than 12 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "Prolonged surgical procedures significantly increase the risk of positioning-related injuries, including pressure injuries (PI), peripheral nerve injuries, compartment syndrome, and vascular compromise. The perioperative nurse has a responsibility to prevent these injuries through vigilant monitoring and proactive intervention. AORN Guidelines for Positioning the Patient recommend: (1) Performing a comprehensive skin and positioning assessment before positioning, immediately after positioning, and at regular intervals throughout the procedure; (2) For prolonged procedures (generally those lasting >2 hours), the nurse should reassess pressure points and skin integrity at least every 2 hours. This includes checking: bony prominences (sacrum, heels, occiput, scapulae, malleoli), areas where positioning devices contact the skin, extremity perfusion (pulses, color, temperature), and any areas at risk for shearing or friction; (3) When feasible, relieve pressure by padding or repositioning pressure-susceptible areas. Even small adjustments can redistribute pressure and restore blood flow; (4) Document all positioning assessments and any changes made. In a 7-hour Whipple procedure, the nurse should have reassessed position and pressure areas at minimum 3 times during the case (at approximately 2, 4, and 6 hours). Risk factors for perioperative pressure injury include: prolonged surgery, diabetes, peripheral vascular disease, malnutrition, advanced age, low BMI, and hypothermia.",
    learningObjective: "Implement regular positioning and pressure point reassessment at minimum 2-hour intervals during prolonged surgical procedures",
    blueprintCategory: "Patient Safety",
    subtopic: "pressure injury prevention",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Reassess position and pressure points at least every 2 hours during prolonged procedures. Risk factors: prolonged surgery, diabetes, PVD, malnutrition, age, hypothermia.",
    clinicalPearls: [
      "Reassess positioning and skin integrity at least every 2 hours during prolonged procedures",
      "Check bony prominences, device contact areas, and extremity perfusion at each assessment",
      "Risk factors for perioperative PI: prolonged surgery, diabetes, PVD, malnutrition, hypothermia"
    ],
    safetyNote: "Perioperative pressure injuries may not become apparent until 24-72 hours after surgery — documentation of intraoperative assessments is essential",
    distractorRationales: [
      "Checking only at beginning and end of a 7-hour procedure is insufficient — damage can occur during the case",
      "Position assessment is a nursing responsibility, not dependent on surgeon request",
      "Any procedure lasting >2 hours warrants periodic reassessment — 12 hours is far too long to wait"
    ]
  },
  {
    stem: "A perioperative nurse is monitoring the temperature of a blanket warmer used for patient warming. The temperature is set at 140°F (60°C). What is the maximum safe temperature for blanket warmers according to ECRI and AORN guidelines?",
    options: [
      "There is no temperature limit for blanket warmers",
      "130°F (54°C) is the recommended maximum temperature for blanket warmers used for patient contact — temperatures above this can cause thermal burns, especially in patients with impaired sensation, poor circulation, or under anesthesia",
      "200°F (93°C) — warmer is better for hypothermia prevention",
      "Room temperature blankets are equally effective as warmed blankets"
    ],
    correctAnswer: 1,
    rationaleLong: "Blanket and fluid warmers are essential equipment for maintaining perioperative normothermia, but improper temperature settings can cause thermal burns. ECRI (formerly ECRI Institute) and AORN recommend a maximum temperature of 130°F (54°C) for blanket warmers used for patient-contact items. At the set temperature of 140°F (60°C), this warmer exceeds the recommended limit by 10°F and poses a burn risk. Factors that increase thermal injury risk in the perioperative setting include: (1) Anesthetized patients cannot feel or report pain from thermal contact — their normal protective withdrawal reflex is abolished; (2) Patients with diabetes, peripheral neuropathy, or peripheral vascular disease have impaired sensation and/or compromised circulation, making them more susceptible to burns; (3) Prolonged contact with warm items (placing warm blankets directly against skin and leaving them in contact for the duration of surgery) increases burn risk compared to brief contact; (4) Elderly patients have thinner, more fragile skin that is more susceptible to thermal injury. The nurse should: lower the warmer temperature to ≤130°F (54°C), verify the warmer thermometer is functioning and calibrated, never place warmed items directly against bare skin without a barrier, and check items for acceptable temperature before placing on the patient.",
    learningObjective: "Maintain blanket warmer temperatures within safe limits to prevent thermal burns in perioperative patients",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "warming equipment safety",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Blanket warmer maximum: 130°F (54°C). Anesthetized patients CANNOT feel or report thermal pain — standard protective reflexes are abolished.",
    clinicalPearls: [
      "Maximum blanket warmer temperature: 130°F (54°C) per ECRI and AORN",
      "Anesthetized patients cannot feel or respond to thermal injury — extra vigilance required",
      "High-risk patients: diabetes, peripheral neuropathy, PVD, elderly (thin fragile skin)"
    ],
    safetyNote: "Never place items directly from a warmer onto a patient's bare skin without checking temperature and using a barrier layer",
    distractorRationales: [
      "Temperature limits are well-established to prevent thermal burns in vulnerable patients",
      "130°F is the maximum — 140°F exceeds the safe limit",
      "200°F would cause severe thermal burns — far above any safe patient contact temperature",
      "Warmed blankets are significantly more effective than room temperature for hypothermia prevention"
    ]
  },
  {
    stem: "A scrub nurse is preparing the sterile field for a cardiac surgery case. The scrub nurse notices a small hole (approximately 2 mm) in the sterile drape near the edge of the surgical field. What is the correct action?",
    options: [
      "Cover the hole with a sterile towel and continue — small holes are acceptable",
      "The drape is considered compromised and must be replaced — any breach in a sterile drape barrier allows microbial contamination of the sterile field. Cover the area immediately with a sterile drape or towel and replace the drape if feasible",
      "Apply sterile tape over the hole to seal it",
      "Ignore the hole since it is near the edge of the field and not directly over the incision site"
    ],
    correctAnswer: 1,
    rationaleLong: "Any hole, tear, or puncture in a sterile drape — regardless of size or location on the drape — represents a breach in the sterile barrier. The sterile drape serves as a barrier between the sterile surgical field and the non-sterile environment below and around the field. Even a 2 mm hole allows microorganisms to migrate through the barrier via capillary action (wicking), gravity, or airborne deposition. Moisture (blood, irrigation fluid) can wick through a hole, creating a pathway for microorganisms to travel from the non-sterile surface below the drape to the sterile field above — this is called strike-through contamination. The correct response depends on the timing and surgical situation: (1) If discovered before the procedure begins — replace the drape entirely; (2) If discovered during the procedure when drape replacement is not practical — immediately cover the compromised area with an additional sterile drape or sterile towel to re-establish the barrier. The additional cover should extend well beyond the margins of the hole; (3) Document the drape breach and the corrective action taken. It is never acceptable to ignore a drape breach, regardless of its proximity to the incision. Bacterial contamination does not respect arbitrary boundaries on the sterile field — organisms that enter through any breach can migrate to the surgical site.",
    learningObjective: "Respond to sterile barrier breaches by replacing or covering compromised drapes to maintain field sterility",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterile field management",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ANY hole in a sterile drape = barrier breach. Even 2 mm allows strike-through contamination via wicking. Cover immediately with sterile drape or replace.",
    clinicalPearls: [
      "Any hole or tear in a sterile drape compromises the sterile barrier regardless of size or location",
      "Strike-through contamination: moisture wicks through barrier breaches, carrying microorganisms",
      "Cover compromised area with additional sterile drape extending well beyond the hole margins"
    ],
    safetyNote: "Moisture on drapes accelerates strike-through contamination through barrier breaches — maintain dry sterile draping throughout the procedure",
    distractorRationales: [
      "Covering with a towel is an interim measure, but the response should prioritize barrier restoration — not simply covering and continuing without full assessment",
      "Sterile tape may not create an adequate seal and introduces adhesive that can compromise the drape material",
      "Location on the drape does not determine sterility — organisms can migrate from any breach to the surgical site"
    ]
  },
  {
    stem: "During a procedure under general anesthesia, the fire alarm activates in the surgical suite. There is no visible fire or smoke in the operating room. What is the perioperative team's MOST appropriate response?",
    options: [
      "Ignore the alarm — it is probably a false alarm and the surgery should not be interrupted",
      "Follow the facility's fire response plan: one team member investigates the alarm source, the circulating nurse closes the OR door, the anesthesiologist maintains the patient's airway and anesthesia, and the team prepares for possible evacuation while continuing to monitor the patient. Do NOT evacuate until there is a confirmed need",
      "Immediately evacuate the patient from the operating room regardless of surgical status",
      "Turn off the fire alarm and continue the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "Fire alarms in the surgical suite during an active procedure create a complex situation requiring a balanced response between fire safety and patient safety. The team must follow the facility's fire response plan while recognizing that: (1) A patient under general anesthesia with an open surgical wound cannot be simply evacuated like an ambulatory patient — immediate, unplanned evacuation carries its own risks (airway compromise, surgical site contamination, hemorrhage from unclosed wounds, equipment disconnection); (2) False fire alarms are common — an investigation must determine whether there is an actual fire before taking the drastic step of mid-procedure evacuation. The RACE model guides the fire response: R — RESCUE anyone in immediate danger; A — ALARM — if not already activated, pull the nearest alarm; C — CONFINE — close doors to contain the fire and smoke (the circulating nurse should close the OR door); E — EXTINGUISH/EVACUATE — extinguish small fires if safe to do so, or evacuate if the fire threatens the OR. During the investigation phase, the team should: (a) Continue monitoring and caring for the patient; (b) The anesthesiologist maintains the airway and anesthesia; (c) Prepare for possible evacuation by identifying evacuation routes and assembling portable emergency equipment (Ambu bag, portable oxygen, emergency medications); (d) Designate a team member to communicate with the charge nurse and fire safety officer for situation updates. Evacuate only if confirmed fire threatens the OR area.",
    learningObjective: "Apply the facility fire response plan during surgery by balancing fire safety with patient safety in the operating room",
    blueprintCategory: "Emergency Situations",
    subtopic: "fire response",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "RACE: Rescue, Alarm, Confine, Extinguish/Evacuate. Close OR door (confine). Maintain patient care. Investigate before evacuating a patient under anesthesia.",
    clinicalPearls: [
      "RACE: Rescue, Alarm, Confine (close doors), Extinguish/Evacuate",
      "Close the OR door immediately — contains smoke/fire and protects the OR environment",
      "Prepare for evacuation but do not evacuate a patient under anesthesia until fire is confirmed in the area"
    ],
    safetyNote: "Have portable emergency equipment (Ambu bag, oxygen, emergency meds) readily identifiable for rapid evacuation if needed",
    distractorRationales: [
      "Never ignore a fire alarm — it must be investigated and the team must follow the fire response plan",
      "Immediate evacuation of an anesthetized patient with an open wound carries significant risks — investigate first",
      "Staff cannot turn off fire alarms — only authorized fire safety personnel can silence or reset alarms after investigation"
    ]
  },
  {
    stem: "A perioperative nurse is orienting a new graduate nurse to the sterile processing department. The nurse explains the concept of event-related sterility. What does event-related sterility mean?",
    options: [
      "Sterility is maintained for a specific number of days after sterilization, regardless of storage conditions",
      "Sterility is maintained until an event occurs that compromises the sterile barrier — such as moisture contamination, package damage, seal breach, or improper storage conditions. Sterility depends on the packaging integrity, not an arbitrary expiration date",
      "Sterility is only maintained for 24 hours after processing",
      "Sterility is permanent once an item is sterilized — it never expires"
    ],
    correctAnswer: 1,
    rationaleLong: "Event-related sterility is the current standard practice endorsed by AORN, AAMI, CDC, and APIC, replacing the older concept of time-related (shelf-life) sterility. The principle states that a properly processed and packaged sterile item remains sterile until something happens (an event) that compromises the integrity of the packaging. In other words, sterility is a function of packaging integrity, storage conditions, and handling — not a function of time alone. An item stored in perfect conditions with intact packaging is sterile regardless of how long ago it was processed. Events that can compromise sterility include: (1) Moisture contamination — wet packs, exposure to humidity, water splash; (2) Physical damage — torn packaging, holes, crushed containers, broken seals; (3) Environmental contamination — exposure to dust, debris, pest infestation; (4) Improper handling — excessive squeezing, dropping, compression during storage; (5) Improper storage conditions — open shelving in high-traffic areas, storage near floors or ceilings, exposure to temperature extremes. Proper storage conditions include: closed cabinets or covered shelving, storage at least 8-10 inches from the floor, 18 inches from the ceiling, and 2 inches from outside walls, in a clean, dry, well-ventilated area with controlled temperature and humidity. Before opening any sterile package, the nurse must inspect: packaging integrity, chemical indicator results, and overall condition.",
    learningObjective: "Apply the principle of event-related sterility by assessing packaging integrity rather than relying on arbitrary expiration dates",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterile storage",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Event-related sterility: sterility depends on packaging INTEGRITY, not time. A properly stored, undamaged item remains sterile indefinitely.",
    clinicalPearls: [
      "Event-related sterility: packaging integrity determines sterility, not elapsed time",
      "Events that compromise sterility: moisture, physical damage, seal breach, improper storage",
      "Storage: ≥8-10 inches from floor, ≥18 inches from ceiling, ≥2 inches from walls, in clean/dry area"
    ],
    safetyNote: "Always inspect package integrity before opening any sterile item — look for moisture, tears, holes, and compromised seals",
    distractorRationales: [
      "Time-based (shelf-life) sterility has been replaced by event-related sterility as the standard of practice",
      "24-hour sterility is an outdated concept that does not align with current evidence",
      "Sterility CAN be compromised after processing — it depends on storage and handling events"
    ]
  },
  {
    stem: "A perioperative nurse is reviewing the Spaulding classification for instrument reprocessing. A vaginal speculum used during a gynecological procedure would be classified as which category?",
    options: [
      "Critical — because it is used in a surgical procedure",
      "Semi-critical — it contacts mucous membranes but does not penetrate sterile tissue, requiring high-level disinfection at minimum",
      "Non-critical — it only contacts intact skin",
      "The Spaulding classification does not apply to gynecological instruments"
    ],
    correctAnswer: 1,
    rationaleLong: "The Spaulding Classification system is the foundational framework for determining the appropriate level of reprocessing for medical devices based on the degree of infection risk associated with their use. A vaginal speculum contacts the vaginal mucous membranes but does not penetrate sterile tissue or enter the vascular system, making it a SEMI-CRITICAL item. Semi-critical items require high-level disinfection (HLD) at minimum, which destroys all microorganisms except high numbers of bacterial spores. Many facilities choose to sterilize reusable vaginal specula even though HLD is the minimum requirement, as sterilization provides a higher margin of safety. The three Spaulding categories are: CRITICAL — items that enter sterile tissue or the vascular system (surgical instruments, implants, cardiac catheters) → require sterilization; SEMI-CRITICAL — items that contact mucous membranes or non-intact skin (endoscopes, vaginal specula, laryngoscope blades, respiratory equipment) → require HLD at minimum; NON-CRITICAL — items that contact only intact skin (blood pressure cuffs, stethoscopes, bedside tables) → require low-level disinfection. This classification system, developed by Dr. Earle Spaulding in 1968, remains the global standard for guiding instrument reprocessing decisions.",
    learningObjective: "Apply the Spaulding Classification to categorize gynecological instruments for appropriate reprocessing",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "Spaulding classification",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Vaginal speculum = semi-critical (contacts mucous membranes) = HLD minimum. Many facilities sterilize for higher safety margin.",
    clinicalPearls: [
      "Spaulding: critical (sterile tissue) → sterilize; semi-critical (mucous membranes) → HLD; non-critical (intact skin) → LLD",
      "Vaginal specula contact mucous membranes = semi-critical = HLD at minimum",
      "Developed by Dr. Earle Spaulding in 1968 — still the global standard"
    ],
    safetyNote: "When in doubt about classification, always reprocess to the higher level — sterilizing a semi-critical item is always acceptable",
    distractorRationales: [
      "Critical classification requires penetration of sterile tissue or the vascular system — vaginal use contacts mucous membranes",
      "The speculum contacts mucous membranes, making it semi-critical, not non-critical",
      "The Spaulding classification applies to all medical devices regardless of specialty"
    ]
  },
  {
    stem: "A circulating nurse notices that the surgical technologist breaks sterile technique by touching a non-sterile surface with a gloved hand during instrument setup. The surgical technologist does not appear to notice the contamination. What is the circulating nurse's responsibility?",
    options: [
      "Ignore the break since the surgical technologist probably knows what they are doing",
      "Immediately and professionally inform the surgical technologist of the contamination, have them change the contaminated glove(s), and remove any instruments or supplies that may have been contaminated by the break in technique",
      "Wait until after the case to discuss the contamination",
      "Document the break but take no corrective action during the procedure"
    ],
    correctAnswer: 1,
    rationaleLong: "The circulating nurse serves as the primary monitor of sterile technique in the operating room and has an absolute professional obligation to identify and correct any break in sterile technique IMMEDIATELY when it is observed. Waiting until after the case defeats the purpose of sterile technique monitoring — contaminated instruments or supplies could be used on the patient during the delay, potentially leading to surgical site infection. The circulating nurse should: (1) Address the break immediately — speak up clearly and professionally. Use a direct, non-accusatory statement such as 'You touched the non-sterile table with your right glove — please change your gloves'; (2) Ensure corrective action — the surgical technologist should change the contaminated glove(s) and any instruments or supplies that were touched after the contamination event must be removed from the sterile field; (3) If necessary, provide replacement sterile items for anything removed; (4) Document the break in sterile technique and the corrective actions taken in the operative record. This responsibility applies regardless of the role or seniority of the person who breaks technique — the circulating nurse must address breaks by surgeons, anesthesiologists, residents, and other team members with the same professional directness. Patient safety is the overriding priority.",
    learningObjective: "Fulfill the circulating nurse's role as sterile technique monitor by immediately addressing observed breaks in aseptic technique",
    blueprintCategory: "Infection Prevention",
    subtopic: "aseptic technique monitoring",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Circulating nurse = primary sterile technique monitor. Address ALL breaks IMMEDIATELY, regardless of the team member's role or seniority.",
    clinicalPearls: [
      "The circulating nurse is responsible for monitoring and enforcing sterile technique in the OR",
      "Address breaks immediately, clearly, and professionally — delayed correction risks patient contamination",
      "Apply equally to all team members regardless of role or seniority"
    ],
    safetyNote: "A culture that tolerates unaddressed breaks in sterile technique increases SSI rates — speak up every time",
    distractorRationales: [
      "Ignoring a break in sterile technique is a failure of the circulating nurse's fundamental responsibility",
      "Waiting until after the case allows contaminated items to be used on the patient",
      "Documentation without corrective action does not protect the patient from contamination"
    ]
  },
  {
    stem: "A perioperative nurse is educating a new staff member about the chain of command process. When should a perioperative nurse initiate the chain of command?",
    options: [
      "Only when the nurse manager directs the nurse to escalate an issue",
      "When a patient safety concern has been communicated to the responsible provider and the provider's response is inadequate — the nurse escalates sequentially through the chain of command to ensure the patient safety concern is addressed",
      "The chain of command is only for administrative disputes, not clinical concerns",
      "The chain of command should be used daily for routine questions"
    ],
    correctAnswer: 1,
    rationaleLong: "The chain of command is a formal escalation pathway that empowers perioperative nurses to advocate for patient safety when their initial communication with a provider is unsuccessful. The process is typically: (1) The nurse identifies a patient safety concern; (2) The nurse communicates the concern directly to the responsible provider (surgeon, anesthesiologist); (3) If the provider's response is inadequate (the concern is dismissed, the provider disagrees but the nurse believes the patient is at risk, or no action is taken), the nurse escalates to the next level in the chain of command: charge nurse → nurse manager → director of nursing → chief nursing officer → chief medical officer → hospital administrator, as appropriate; (4) The chain of command should be invoked any time the nurse believes patient safety is at risk and direct communication has not resolved the concern. Examples of situations requiring chain of command activation include: a surgeon insisting on proceeding with surgery despite a laterality discrepancy, an anesthesiologist unwilling to cancel a case despite concerning preoperative findings, unresolved equipment safety concerns, or inadequate staffing that the nurse believes jeopardizes patient safety. The nurse should document each step of the chain of command process, including who was contacted, when, what was communicated, and the response received.",
    learningObjective: "Initiate the chain of command process when direct communication fails to resolve a patient safety concern",
    blueprintCategory: "Professional Accountability",
    subtopic: "chain of command",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Chain of command: used when direct communication about a PATIENT SAFETY concern is unsuccessful. Escalate sequentially. Document every step.",
    clinicalPearls: [
      "Chain of command: used when direct communication about patient safety fails to achieve resolution",
      "Escalation pathway: provider → charge nurse → manager → director → CNO → CMO",
      "Document each step: who, when, what was communicated, and response received"
    ],
    safetyNote: "Never abandon a patient safety concern because the responsible provider dismisses it — the chain of command exists to ensure every concern is addressed",
    distractorRationales: [
      "Any nurse can initiate the chain of command — it does not require manager direction",
      "The chain of command is specifically for clinical patient safety concerns, not just administrative disputes",
      "The chain of command is for unresolved safety concerns, not routine daily questions"
    ]
  },
  {
    stem: "A perioperative nurse is conducting a preoperative verification for a patient scheduled for a left total knee arthroplasty. The patient confirms the procedure but the surgical site is NOT marked. What should the nurse do?",
    options: [
      "Mark the site with a pen and proceed — any team member can mark the surgical site",
      "Do NOT proceed until the surgical site is marked by the person performing the procedure (or a licensed practitioner designated by the facility's policy). The site must be marked while the patient is awake and able to confirm the correct site",
      "Proceed without site marking since the patient verbally confirmed the correct side",
      "Mark the site after the patient is under anesthesia"
    ],
    correctAnswer: 1,
    rationaleLong: "Surgical site marking is a critical component of The Joint Commission's Universal Protocol for preventing wrong-site, wrong-procedure, wrong-person surgery. The requirements include: (1) The surgical site must be marked BEFORE the procedure — the mark must be visible after the patient is prepped and draped; (2) The site must be marked by the PERSON PERFORMING THE PROCEDURE or a licensed practitioner designated by the facility's site marking policy. In most facilities, this means the surgeon, not the nurse, must mark the site; (3) The site must be marked while the PATIENT IS AWAKE and able to confirm — this provides the critical patient-involvement safety check. Marking the site after the patient is sedated or anesthetized eliminates the patient verification component; (4) The mark must be at or near the incision site and must be unambiguous (typically the surgeon's initials — avoid marks like 'X' which could be interpreted as 'not this side'); (5) Site marking is required for procedures involving laterality (left/right), multiple structures (different fingers/toes), or multiple levels (spinal surgery). The nurse should NOT proceed with any preoperative steps that would prevent site marking (such as administering sedation) until the site is properly marked by the appropriate person.",
    learningObjective: "Enforce surgical site marking requirements per the Universal Protocol before proceeding with any preoperative preparation",
    blueprintCategory: "Patient Safety",
    subtopic: "site marking",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Site marking: by the person performing the procedure, while the patient is AWAKE. Use initials, not 'X'. Must be visible after prep and draping.",
    clinicalPearls: [
      "Site marking by the surgeon (or designated practitioner) while the patient is awake and can confirm",
      "Mark at or near the incision site with the surgeon's initials — avoid ambiguous marks like 'X'",
      "Required for laterality, multiple structures, and multiple levels"
    ],
    safetyNote: "Never sedate a patient before surgical site marking is complete — sedation eliminates the patient's ability to verify the correct site",
    distractorRationales: [
      "Site marking must be done by the person performing the procedure or a designated licensed practitioner — not any team member",
      "Verbal confirmation alone is insufficient — site marking provides a visible, persistent verification",
      "Marking under anesthesia eliminates the patient verification component — the patient must be awake"
    ]
  },
  {
    stem: "During a laparoscopic cholecystectomy, the surgeon accidentally causes a bile duct injury. The circulating nurse should anticipate which IMMEDIATE intraoperative response?",
    options: [
      "Close the abdomen immediately and transfer the patient to another facility",
      "The surgeon may convert to an open procedure for better visualization, request an intraoperative cholangiogram to delineate the biliary anatomy, and potentially call a hepatobiliary surgeon for consultation and repair",
      "Irrigate the area with saline and continue the laparoscopic procedure",
      "No action is needed — bile duct injuries heal spontaneously"
    ],
    correctAnswer: 1,
    rationaleLong: "Bile duct injury during laparoscopic cholecystectomy is a serious complication occurring in approximately 0.3-0.5% of cases. The most common mechanism is misidentification of the common bile duct (CBD) as the cystic duct (the 'critical view of safety' technique was developed to prevent this). When a bile duct injury is recognized intraoperatively, the response depends on the type and severity of injury: (1) IMMEDIATE RECOGNITION is critical — injuries recognized and repaired intraoperatively have significantly better outcomes than those discovered postoperatively; (2) The surgeon may CONVERT TO OPEN to obtain better visualization of the biliary anatomy and facilitate repair; (3) An INTRAOPERATIVE CHOLANGIOGRAM (IOC) may be performed to delineate the exact anatomy and identify the nature and extent of the injury; (4) If the injury is complex (Strasberg classification Type D or E — involving the common hepatic duct or common bile duct), the operating surgeon should strongly consider calling a HEPATOBILIARY SURGEON for consultation and definitive repair. Complex bile duct repairs performed by non-specialist surgeons have higher complication rates; (5) The type of repair depends on the injury: simple lateral injuries may be repaired primarily over a T-tube; complete transections typically require a hepaticojejunostomy (Roux-en-Y). The circulating nurse should prepare for potential conversion to open, have cholangiography supplies available, and facilitate consultation calls.",
    learningObjective: "Anticipate the surgical team's response to bile duct injury during laparoscopic cholecystectomy including conversion, cholangiography, and specialist consultation",
    blueprintCategory: "Emergency Situations",
    subtopic: "surgical complications",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Bile duct injury: intraoperative recognition has better outcomes than delayed. Prepare for conversion to open, IOC, and hepatobiliary surgeon consultation.",
    clinicalPearls: [
      "Bile duct injury during lap chole: 0.3-0.5% incidence — most common cause is misidentification of CBD as cystic duct",
      "Critical view of safety technique prevents misidentification of biliary anatomy",
      "Intraoperative recognition and repair has significantly better outcomes than delayed diagnosis"
    ],
    safetyNote: "Complex bile duct repairs should be performed by or in consultation with a hepatobiliary specialist — outcomes are significantly better",
    distractorRationales: [
      "Closing without addressing the injury delays necessary repair and worsens outcomes",
      "Simply irrigating without definitive management of the bile duct injury is inadequate",
      "Bile duct injuries do NOT heal spontaneously — they cause bile leak, biliary stricture, and potentially fatal biliary sepsis"
    ]
  },
  {
    stem: "A patient scheduled for ambulatory surgery (same-day surgery) asks the preoperative nurse what criteria must be met before they can be discharged home. According to Phase II ambulatory discharge criteria, which of the following must be met?",
    options: [
      "Only stable vital signs are required for discharge",
      "Multiple criteria must be met: stable vital signs, adequate pain control, minimal nausea/vomiting, ability to ambulate at pre-procedure level, ability to void (procedure-dependent), toleration of oral fluids, responsible adult escort available, and discharge instructions understood and provided in writing",
      "The patient must stay overnight for observation regardless of the procedure",
      "Only the surgeon can authorize discharge — no standardized criteria exist"
    ],
    correctAnswer: 1,
    rationaleLong: "Phase II ambulatory surgery discharge criteria are comprehensive and patient-centered, designed to ensure that the patient is safe for discharge to home care. The standard discharge criteria include: (1) VITAL SIGNS — stable and within acceptable range for the patient's baseline, assessed at regular intervals; (2) PAIN MANAGEMENT — pain is controlled to an acceptable level with oral analgesics, and the patient has a prescription for home pain management; (3) NAUSEA AND VOMITING — absent or controlled with antiemetics, and the patient can tolerate oral fluids; (4) LEVEL OF CONSCIOUSNESS — alert, oriented, and returned to pre-procedure cognitive baseline; (5) AMBULATION — able to ambulate at or near the pre-procedure level (age and procedure-appropriate); (6) VOIDING — required before discharge for specific procedures (spinal/epidural anesthesia, urological procedures, hernia repairs, pelvic procedures) or when excessive IV fluids were administered; (7) SURGICAL SITE — dressing dry and intact, no signs of active bleeding or complications; (8) RESPONSIBLE ADULT — a competent adult must be available to escort the patient home and stay with them for the first 24 hours; (9) DISCHARGE INSTRUCTIONS — written and verbal instructions including activity restrictions, medication management, wound care, diet advancement, signs/symptoms requiring emergency return, and follow-up appointment information; (10) The patient or caregiver demonstrates understanding of the discharge instructions. Standardized scoring tools such as the Post-Anesthetic Discharge Scoring System (PADSS) may be used to objectively assess readiness.",
    learningObjective: "Apply comprehensive Phase II ambulatory discharge criteria to ensure patient safety for home discharge after same-day surgery",
    blueprintCategory: "Postoperative Patient Care",
    subtopic: "ambulatory discharge",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Ambulatory discharge requires: stable VS, pain controlled, no N/V, ambulating, voiding (if applicable), responsible adult escort, written discharge instructions understood.",
    clinicalPearls: [
      "Phase II discharge: vital signs, pain, N/V, consciousness, ambulation, voiding, escort, written instructions",
      "A responsible adult must escort the patient home AND stay for 24 hours postprocedure",
      "PADSS (Post-Anesthetic Discharge Scoring System) provides objective discharge readiness assessment"
    ],
    safetyNote: "Never discharge an ambulatory surgery patient without a confirmed responsible adult escort — patients cannot drive or take public transportation alone after anesthesia",
    distractorRationales: [
      "Stable vital signs alone are insufficient — multiple criteria must be met for safe discharge",
      "Ambulatory surgery patients are discharged same-day when criteria are met — overnight stays are not required",
      "Standardized discharge criteria exist and should guide the discharge decision — it is not solely at surgeon discretion"
    ]
  },
  {
    stem: "A perioperative nurse manager is investigating an incident where a medication was administered from a syringe that was not labeled on the sterile field. According to The Joint Commission National Patient Safety Goals, what is the labeling requirement for medications on the sterile field?",
    options: [
      "Labeling is optional if only one medication is on the field",
      "ALL medications and solutions on the sterile field must be labeled — including those in syringes, basins, and cups — even if there is only ONE medication on the field. The label must include the drug name, concentration, and expiration date/time when applicable",
      "Only medications that look alike need to be labeled",
      "The surgeon verbally tracking which syringe contains which medication is sufficient"
    ],
    correctAnswer: 1,
    rationaleLong: "The Joint Commission National Patient Safety Goal (NPSG) 03.04.01 specifically addresses medication labeling on and off the sterile field. The requirement states that ALL medications and solutions on AND off the sterile field must be labeled. This includes: (1) ALL syringes containing medications — even if there is only one syringe on the field; (2) ALL basins and cups containing solutions (saline, antibiotic irrigation, local anesthetic, etc.); (3) The label must include: the drug name, the concentration/strength, and the expiration date and time when not used immediately. The labeling requirement applies even when there is only ONE medication on the field because: the syringe may be set down and picked up later when the scrub person or surgeon may not remember its contents; a different team member may handle the syringe; similar-appearing clear fluids on the sterile field (saline, local anesthetic, heparin solution) are visually indistinguishable; and verbal tracking is unreliable, especially during complex or prolonged procedures. Medication errors on the sterile field are a significant source of patient harm. Labeling is a simple but critical safety practice that prevents wrong-drug, wrong-dose, and wrong-route errors. The scrub person should label medications immediately upon receiving them on the sterile field, and the circulating nurse should verify the label by reading it back.",
    learningObjective: "Apply TJC National Patient Safety Goals for medication labeling on the sterile field to prevent medication errors",
    blueprintCategory: "Patient Safety",
    subtopic: "medication safety",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "ALL medications on the sterile field must be labeled — even if there is only ONE. Label includes: drug name, concentration, expiration when applicable.",
    clinicalPearls: [
      "TJC NPSG 03.04.01: ALL medications/solutions on the sterile field must be labeled — no exceptions",
      "Label includes: drug name, concentration, and expiration date/time",
      "Label immediately upon receiving on the field — the circulating nurse verifies by reading back"
    ],
    safetyNote: "Clear fluids on the sterile field are visually indistinguishable — unlabeled syringes are a leading cause of medication errors in surgery",
    distractorRationales: [
      "Labeling is required even with only one medication — the standard has no exception for single medications",
      "ALL medications must be labeled regardless of appearance — look-alike risk is just one of many reasons",
      "Verbal tracking is unreliable — written labels are the required standard per TJC NPSG"
    ]
  },
  {
    stem: "A perioperative nurse is verifying the emergency equipment in the operating room before the first case of the day. Which piece of emergency equipment must be IMMEDIATELY available in every operating room per AORN and facility accreditation standards?",
    options: [
      "A portable chest X-ray machine",
      "A malignant hyperthermia cart containing dantrolene, cold IV saline, and emergency supplies — plus a defibrillator, difficult airway equipment, and a fire extinguisher",
      "A portable ultrasound machine",
      "An emergency backup generator in the room"
    ],
    correctAnswer: 1,
    rationaleLong: "Every operating room must have immediate access to specific emergency equipment to respond to life-threatening perioperative emergencies. Required emergency equipment includes: (1) MALIGNANT HYPERTHERMIA (MH) CART — must be immediately accessible (within the OR suite, not just in the hospital). The MH cart must contain: dantrolene sodium (at least 36 vials of Dantrium or 3 vials of Ryanodex), sterile water for reconstitution (60 mL vials), cold IV normal saline for cooling, cooling blankets, and a protocol/checklist. MHAUS (Malignant Hyperthermia Association of the United States) publishes specific cart contents; (2) DEFIBRILLATOR — must be immediately available (within the OR or in the corridor immediately outside) for cardiac arrest management. Staff must know its location and be trained in its use; (3) DIFFICULT AIRWAY EQUIPMENT — including supraglottic airways (LMA), video laryngoscope, fiberoptic bronchoscope, and surgical airway (cricothyrotomy) kit for cannot-intubate-cannot-ventilate emergencies; (4) FIRE EXTINGUISHER — at least one CO2 fire extinguisher must be in or immediately accessible to every OR for surgical fire management. Staff must know the PASS technique (Pull pin, Aim at base, Squeeze handle, Sweep); (5) EMERGENCY MEDICATIONS — epinephrine, atropine, vasopressin, succinylcholine, and other resuscitation drugs in the anesthesia cart. The circulating nurse should verify the location and readiness of all emergency equipment before the first case of the day as part of the daily OR safety check.",
    learningObjective: "Verify the availability of required emergency equipment in the operating room including MH cart, defibrillator, difficult airway equipment, and fire extinguisher",
    blueprintCategory: "Emergency Situations",
    subtopic: "emergency preparedness",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Every OR needs: MH cart (dantrolene), defibrillator, difficult airway equipment, fire extinguisher, and emergency medications — verify BEFORE the first case daily.",
    clinicalPearls: [
      "MH cart: ≥36 vials Dantrium (or 3 Ryanodex), sterile water, cold NS, cooling blankets, protocol",
      "Fire extinguisher: CO2 type, PASS technique (Pull, Aim, Squeeze, Sweep)",
      "Difficult airway: LMA, video laryngoscope, fiberoptic scope, surgical airway kit"
    ],
    safetyNote: "Verify emergency equipment location, contents, and readiness BEFORE the first case of the day — in an emergency, there is no time to search for equipment",
    distractorRationales: [
      "Portable X-ray is useful but not required to be immediately in every OR",
      "Portable ultrasound is helpful but not a mandatory emergency equipment requirement in every OR",
      "Emergency backup power is a facility-level system, not individual room equipment"
    ]
  }
];
