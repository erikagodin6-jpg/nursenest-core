import type { PerioperativeQuestion } from "./types";

export const intraoperativeCareQuestions: PerioperativeQuestion[] = [
  {
    stem: "During a laparoscopic cholecystectomy, the circulating nurse notices the patient's core temperature has dropped from 36.8°C to 35.2°C over the past 90 minutes. Which intervention should the nurse implement FIRST?",
    options: [
      "Increase the room temperature to 75-80°F (24-27°C) and apply a forced-air warming blanket",
      "Document the temperature change and continue monitoring every 15 minutes",
      "Administer warmed IV fluids only, as warming blankets are contraindicated during laparoscopic surgery",
      "Notify the surgeon to consider converting to an open procedure to reduce the duration"
    ],
    correctAnswer: 0,
    rationaleLong: "Inadvertent perioperative hypothermia (core temperature below 36°C) is a common complication during surgery, occurring in up to 50-70% of surgical patients. Even mild hypothermia (34-36°C) significantly increases the risk of surgical site infections (by 2-3x), coagulopathy with increased surgical blood loss (by 16-25%), cardiac morbidity (3x increase in macular events), prolonged drug metabolism, delayed wound healing, and increased hospital length of stay. The nurse should implement active warming measures immediately when the temperature trend shows progressive cooling. First-line interventions include increasing the ambient room temperature (the single most effective passive measure) and applying forced-air warming devices (such as Bair Hugger) which are the most effective active warming method. Additional measures include warming all IV fluids and irrigation fluids, using warm blankets, and minimizing skin exposure. Forced-air warming blankets are not contraindicated during laparoscopic surgery — they can be applied to the upper body and extremities. Simply documenting and monitoring constitutes inadequate nursing care when a modifiable risk factor is worsening. The insufflation of cold, dry CO2 during laparoscopy contributes to heat loss, making active warming even more important during laparoscopic procedures.",
    learningObjective: "Implement evidence-based interventions to prevent and treat inadvertent perioperative hypothermia",
    blueprintCategory: "Intraoperative Care",
    subtopic: "thermoregulation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Forced-air warming blankets are NOT contraindicated during laparoscopic surgery — they are the gold standard active warming device in all surgical settings.",
    clinicalPearls: [
      "Even mild hypothermia (34-36°C) increases SSI risk 2-3x and blood loss by 16-25%",
      "Forced-air warming is the most effective active warming method available in the OR",
      "CO2 insufflation during laparoscopy contributes to additional heat loss"
    ],
    safetyNote: "Monitor core temperature continuously during all procedures lasting >30 minutes and implement warming before hypothermia develops",
    distractorRationales: [
      "Documentation without intervention is inadequate when hypothermia is developing",
      "Forced-air warming is appropriate during laparoscopic surgery and should be used",
      "Converting to open surgery is not an appropriate response to hypothermia — this decision is based on surgical factors"
    ]
  },
  {
    stem: "A scrub nurse is performing the surgical count with the circulating nurse before closing the abdominal fascia during an open appendectomy. The sponge count is incorrect — one 4x4 radiopaque sponge is missing. What is the FIRST action the scrub nurse should take?",
    options: [
      "Inform the surgeon immediately that the sponge count is incorrect",
      "Recount all sponges on the field and in the kick bucket before notifying anyone",
      "Request an intraoperative X-ray to locate the missing sponge",
      "Search the drapes, gown, and floor for the missing sponge before informing the surgeon"
    ],
    correctAnswer: 0,
    rationaleLong: "When a surgical count is incorrect, the immediate priority is to inform the surgeon. The Association of periOperative Registered Nurses (AORN) guidelines state that the surgeon must be notified immediately when a count discrepancy is identified, as this information is critical for patient safety — the surgeon may need to explore the wound before closure to locate a retained sponge. While a systematic search of the field, drapes, kick bucket, trash, and surrounding area should also be performed, informing the surgeon is the first action because closure must be halted until the discrepancy is resolved. A retained surgical sponge (gossypiboma) can cause serious complications including abscess formation, bowel obstruction, perforation, fistula formation, and sepsis. The radiopaque markers on surgical sponges allow them to be identified on intraoperative X-ray if they cannot be located by visual and manual search. AORN recommends counting sponges, sharps, and instruments: (1) before the procedure begins, (2) when new items are added to the field, (3) before closure of a body cavity, (4) at skin closure, and (5) at the time of permanent relief of the scrub or circulating nurse. All count discrepancies must be resolved before the patient leaves the operating room.",
    learningObjective: "Implement correct surgical count procedures and respond appropriately to count discrepancies",
    blueprintCategory: "Intraoperative Care",
    subtopic: "surgical counts",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The surgeon must be informed FIRST — do not delay notification while searching. The surgeon needs to halt closure immediately.",
    clinicalPearls: [
      "AORN counts: before procedure, when items added, before cavity closure, at skin closure, at personnel relief",
      "All count discrepancies must be resolved before the patient leaves the OR",
      "Retained surgical items are a 'never event' — they are always preventable"
    ],
    safetyNote: "Never allow closure to continue when a count discrepancy exists — inform the surgeon immediately and halt closure until the item is located",
    distractorRationales: [
      "Recounting before notifying the surgeon delays critical communication",
      "X-ray may be needed but informing the surgeon comes first so closure is halted",
      "Searching before informing the surgeon delays the critical step of halting closure"
    ]
  },
  {
    stem: "During positioning for a posterior spinal fusion, the perioperative nurse is placing a 58-year-old male patient in the prone position on a Wilson frame. Which nursing assessment is MOST critical immediately after positioning?",
    options: [
      "Verify that the patient's arms are positioned with shoulders abducted less than 90 degrees and padded at the elbows",
      "Confirm that the patient's eyes are free from direct pressure and the head is in a neutral position with eyes checked every 15 minutes",
      "Ensure the chest rolls are positioned to allow free abdominal wall movement for adequate ventilation",
      "Check that the patient's genitalia are free from compression against the frame"
    ],
    correctAnswer: 1,
    rationaleLong: "While all four assessments are critical for safe prone positioning, protecting the eyes from direct pressure is the most critical nursing priority. Perioperative visual loss (POVL), including ischemic optic neuropathy and central retinal artery occlusion, is a devastating and often irreversible complication of prone positioning. Direct pressure on the globe from the headrest, horseshoe, or other positioning devices can cause central retinal artery occlusion, leading to permanent unilateral blindness. Even indirect compression can increase intraocular pressure sufficiently to cause ischemia. The ASA Practice Advisory for Perioperative Visual Loss recommends: using appropriate headrests that avoid direct globe pressure (such as foam headrests with eye cutouts or Mayfield pins), ensuring the head is in a neutral position (flexion increases IOP and venous congestion), checking the eyes immediately after positioning and at regular intervals (every 15 minutes or more frequently), and documenting eye checks throughout the procedure. Risk factors for POVL include prolonged prone procedures (>6 hours), significant blood loss, hypotension, anemia, and pre-existing ocular conditions. While arm positioning, chest roll placement, and genital protection are all important, they typically do not result in the same level of irreversible harm as ocular injury.",
    learningObjective: "Prioritize eye protection and monitoring during prone positioning to prevent perioperative visual loss",
    blueprintCategory: "Intraoperative Care",
    subtopic: "surgical positioning",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Perioperative visual loss from prone positioning can cause permanent blindness — eye checks every 15 minutes are mandatory, not optional.",
    clinicalPearls: [
      "POVL includes ischemic optic neuropathy and central retinal artery occlusion — both can cause permanent blindness",
      "Check eyes immediately after prone positioning and every 15 minutes throughout the case",
      "Risk factors for POVL: procedure >6 hours, significant blood loss, hypotension, anemia"
    ],
    safetyNote: "Document eye checks at regular intervals during prone positioning — direct globe pressure must be completely eliminated",
    distractorRationales: [
      "Arm positioning is important but rarely causes irreversible harm comparable to permanent blindness",
      "Chest rolls for ventilation are critical but inadequate ventilation is immediately detected by monitoring equipment",
      "Genital protection is important but compression injuries are typically reversible"
    ]
  },
  {
    stem: "The circulating nurse observes the surgeon using monopolar electrosurgery near a pool of alcohol-based skin prep solution that has not fully dried on the patient's lateral chest wall. What is the IMMEDIATE nursing action?",
    options: [
      "Document the observation and monitor for any signs of a fire",
      "Verbally alert the surgeon to stop using electrosurgery immediately and inform the team that the prep solution has not dried",
      "Activate the fire alarm and evacuate the operating room",
      "Remove the electrosurgery pencil from the surgeon's hand to prevent activation"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario represents an imminent OR fire risk. The fire triangle in the operating room consists of three elements: an oxidizer (supplemental oxygen, nitrous oxide, room air), a fuel source (alcohol-based skin prep, drapes, sponges, patient hair, intestinal gases), and an ignition source (electrosurgery, lasers, fiber-optic light sources). Alcohol-based skin preparation solutions (such as ChloraPrep) are flammable and produce volatile vapors that can pool in dependent areas, under drapes, and along body contours. If the prep has not fully dried, active liquid and vapors create an extremely dangerous fuel source. Using monopolar electrosurgery near pooled prep solution can ignite a flash fire. The nurse must immediately speak up and alert the entire surgical team to stop electrosurgery until the prep has fully dried. This is a 'stop the line' moment in patient safety. The nurse should not hesitate to voice concerns — the AORN and Joint Commission both emphasize the perioperative nurse's responsibility and authority to halt unsafe practices. Activating the fire alarm is premature if no fire has started. Physically removing the instrument from the surgeon is inappropriate. Documentation without intervention fails to prevent the imminent hazard.",
    learningObjective: "Recognize and intervene in OR fire risk situations involving the fire triangle components",
    blueprintCategory: "Intraoperative Care",
    subtopic: "fire safety",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Alcohol-based preps must be completely DRY before draping or using electrosurgery. Pooled prep in body folds or dependent areas takes longer to dry.",
    clinicalPearls: [
      "OR fire triangle: oxidizer (O2, N2O), fuel (alcohol prep, drapes, hair), ignition (ESU, laser, fiberoptic light)",
      "Alcohol-based preps must dry completely — pooling in body creases or under drapes creates fire risk",
      "The perioperative nurse has the authority and responsibility to 'stop the line' for safety"
    ],
    safetyNote: "Allow alcohol-based skin preparation to dry completely (minimum 3 minutes on hairless skin, longer in hair-bearing areas or body folds) before draping or activating ignition sources",
    distractorRationales: [
      "Documentation without intervention fails to prevent an imminent fire — this is a 'stop the line' situation",
      "The fire alarm is for active fires, not imminent risk — verbal communication halts the unsafe practice",
      "Physically removing instruments from the surgeon is inappropriate — verbal communication is the correct approach"
    ]
  },
  {
    stem: "During a laparoscopic gynecologic procedure, the anesthesiologist reports a sudden rise in end-tidal CO2 (ETCO2) from 35 mmHg to 58 mmHg with tachycardia and hypotension. The patient's SpO2 is 94% and dropping. What is the MOST likely cause of this presentation?",
    options: [
      "Malignant hyperthermia triggered by the volatile anesthetic agent",
      "Carbon dioxide embolism from inadvertent intravascular insufflation during laparoscopy",
      "Simple hypercarbia from CO2 absorption during prolonged pneumoperitoneum",
      "Tension pneumothorax from trocar insertion"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden onset of markedly elevated ETCO2, tachycardia, hypotension, and falling oxygen saturation during a laparoscopic procedure is most consistent with carbon dioxide (CO2) embolism. CO2 embolism occurs when insufflation gas enters the venous system, typically through inadvertent placement of a Veress needle or trocar into a blood vessel, or through open venous channels in the surgical field. When a large bolus of CO2 enters the venous system, it can create a gas lock in the right heart, obstructing pulmonary blood flow and causing acute right heart failure with cardiovascular collapse. The classic presentation includes: sudden dramatic rise in ETCO2 (as the embolized CO2 is excreted through the lungs), followed by a rapid decrease in ETCO2 (as cardiac output falls and less CO2 reaches the lungs), tachycardia, hypotension, falling SpO2, and potentially a 'mill wheel' murmur on auscultation. While malignant hyperthermia also presents with elevated ETCO2, it typically develops more gradually with concomitant muscle rigidity, rising temperature, and metabolic acidosis. Simple hypercarbia from CO2 absorption during pneumoperitoneum causes gradual ETCO2 elevation without hemodynamic instability. Tension pneumothorax would cause elevated airway pressures and absent breath sounds on the affected side.",
    learningObjective: "Recognize the clinical presentation of CO2 embolism during laparoscopic surgery and differentiate it from other causes of elevated ETCO2",
    blueprintCategory: "Intraoperative Care",
    subtopic: "laparoscopic complications",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CO2 embolism causes SUDDEN rise in ETCO2 with hemodynamic collapse. Malignant hyperthermia causes GRADUAL ETCO2 rise with muscle rigidity and fever.",
    clinicalPearls: [
      "CO2 embolism: sudden ETCO2 spike, then drop as cardiac output falls, tachycardia, hypotension, desaturation",
      "Treatment: stop insufflation, release pneumoperitoneum, place patient in left lateral decubitus and Trendelenburg position",
      "Mill wheel murmur on auscultation is pathognomonic for gas embolism"
    ],
    safetyNote: "Immediately stop insufflation and release pneumoperitoneum if CO2 embolism is suspected — delay can result in cardiac arrest",
    distractorRationales: [
      "MH develops gradually with rigidity, fever, and metabolic acidosis — not sudden cardiovascular collapse",
      "Simple CO2 absorption causes gradual ETCO2 rise without hemodynamic instability",
      "Pneumothorax presents with elevated airway pressures, absent breath sounds, and tracheal deviation"
    ]
  },
  {
    stem: "A circulating nurse is monitoring a patient during a total knee arthroplasty performed under a femoral nerve block and general anesthesia. The surgeon is using a pneumatic tourniquet on the thigh. The tourniquet has been inflated for 2 hours and 15 minutes. What is the appropriate nursing action?",
    options: [
      "No action needed — tourniquets can safely remain inflated for up to 4 hours on lower extremities",
      "Inform the surgeon that tourniquet time has exceeded 2 hours and document the cumulative inflation time",
      "Immediately deflate the tourniquet without notifying the surgeon",
      "Apply a second tourniquet proximal to the current one to distribute the pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Pneumatic tourniquet use during orthopedic surgery requires careful monitoring of inflation time to prevent ischemic complications. The generally accepted safe tourniquet time for lower extremities is 1.5 to 2 hours, though some sources cite up to 2 hours for healthy adults. Prolonged tourniquet inflation beyond recommended times increases the risk of nerve injury (tourniquet palsy), muscle damage (ischemia-reperfusion injury), vascular injury, compartment syndrome, and deep vein thrombosis. The circulating nurse has a responsibility to monitor and announce tourniquet inflation time at regular intervals (typically every 30 minutes or hourly, per institutional policy). At 2 hours, the nurse should inform the surgeon of the cumulative inflation time. The surgeon makes the clinical decision about whether to deflate the tourniquet temporarily (typically for 10-15 minutes to allow tissue reperfusion) or to continue if the procedure is nearly complete. The nurse should document the inflation time, any tourniquet deflation periods, and the pressure setting. Deflating the tourniquet without surgical direction could cause a bloodless field to become bloody at a critical point in the procedure. Adding a second tourniquet proximal to the first does not address the underlying ischemia concern.",
    learningObjective: "Monitor and communicate pneumatic tourniquet inflation times to prevent ischemic complications",
    blueprintCategory: "Intraoperative Care",
    subtopic: "tourniquet management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Safe tourniquet time is generally 1.5-2 hours for lower extremities. The NURSE monitors time and communicates; the SURGEON decides whether to deflate.",
    clinicalPearls: [
      "Safe tourniquet time: 1-1.5 hours upper extremity, 1.5-2 hours lower extremity",
      "Report tourniquet time to the surgeon at regular intervals (typically every 30 minutes)",
      "If tourniquet must be deflated temporarily, allow 10-15 minutes for tissue reperfusion before reinflating"
    ],
    safetyNote: "Document tourniquet pressure, inflation time, deflation periods, and skin condition upon tourniquet removal",
    distractorRationales: [
      "Four hours far exceeds safe tourniquet time and would cause significant ischemic injury",
      "The nurse should not deflate the tourniquet without surgical direction — this could compromise the surgical field",
      "A second tourniquet does not address the ischemia caused by the primary tourniquet"
    ]
  },
  {
    stem: "During a craniotomy for tumor resection, the scrub nurse notices that the surgeon's gown sleeve has become contaminated by contact with a non-sterile surface. The surgeon does not appear to have noticed the contamination. What is the correct action?",
    options: [
      "Wait until a convenient break in the procedure to mention it to the surgeon",
      "Document the break in sterile technique in the operative record without informing the surgeon",
      "Immediately and respectfully inform the surgeon of the contamination so the sterile gown can be changed",
      "Cover the contaminated area with a sterile towel to contain the contamination"
    ],
    correctAnswer: 2,
    rationaleLong: "When a break in sterile technique is observed, the scrub nurse or any member of the surgical team has a professional and ethical obligation to immediately communicate the contamination to the involved party. Sterile technique is the cornerstone of surgical asepsis and prevents surgical site infections (SSIs). Craniotomy procedures carry particularly high consequences for infection because intracranial infections (meningitis, brain abscess) can be life-threatening and devastating to neurological function. The scrub nurse must immediately and clearly inform the surgeon of the contamination. This communication should be direct, factual, and non-judgmental. The contaminated gown sleeve must be changed — either the surgeon steps away to re-gown and re-glove, or in some cases, a sterile sleeve cover may be applied depending on institutional policy and the extent of contamination. Waiting for a convenient break allows the contamination to potentially contact the sterile field and the open surgical wound. Documenting without communicating fails to address the immediate safety concern. Covering contamination with a sterile towel does not restore sterility to the contaminated surface. The surgical team functions as a safety team, and any member — regardless of hierarchy — must feel empowered to speak up about breaks in sterile technique.",
    learningObjective: "Respond immediately and appropriately to observed breaks in sterile technique during surgical procedures",
    blueprintCategory: "Intraoperative Care",
    subtopic: "sterile technique",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ALL team members have the obligation to immediately report breaks in sterile technique — regardless of hierarchy or perceived inconvenience.",
    clinicalPearls: [
      "Sterile breaks must be addressed immediately — delayed communication increases infection risk",
      "Communication should be direct, factual, and non-judgmental regardless of team hierarchy",
      "Covering contamination does not restore sterility — the contaminated item must be replaced"
    ],
    safetyNote: "Any team member observing a break in sterile technique must speak up immediately — patient safety supersedes hierarchical concerns",
    distractorRationales: [
      "Waiting for a break allows continued contamination of the surgical field and wound",
      "Documentation without communication fails to address the immediate safety concern",
      "Covering contamination with a sterile towel does not restore sterility — the surface underneath remains contaminated"
    ]
  },
  {
    stem: "A patient undergoing a robotic-assisted prostatectomy in steep Trendelenburg position develops bilateral conjunctival edema (chemosis) and facial plethora after 4 hours. The anesthesiologist reports peak airway pressures have increased from 22 to 34 cmH2O. What physiological mechanism explains these findings?",
    options: [
      "Allergic reaction to the surgical skin preparation solution",
      "Increased venous pressure in the head and upper body due to prolonged steep Trendelenburg position causing dependent edema and reduced pulmonary compliance",
      "Anaphylaxis from latex exposure during the procedure",
      "Acute right heart failure from CO2 pneumoperitoneum"
    ],
    correctAnswer: 1,
    rationaleLong: "Steep Trendelenburg position (typically 30-45 degrees head-down) combined with pneumoperitoneum during robotic-assisted pelvic surgery creates significant physiological changes. When the patient is positioned head-down for prolonged periods, gravity causes cephalad shifting of blood volume, increasing central venous pressure and venous congestion in the head, face, and upper extremities. This results in facial and periorbital edema, conjunctival chemosis (conjunctival swelling), and facial plethora (redness from venous congestion). Simultaneously, the pneumoperitoneum pushes the diaphragm cephalad, reducing functional residual capacity (FRC) and total lung compliance. This cephalad diaphragmatic displacement, combined with the weight of abdominal viscera pressing on the chest in the head-down position, causes increased peak airway pressures as the anesthesiologist must generate higher pressures to ventilate the less compliant lungs. These changes worsen with prolonged duration in the position. Complications can include increased intracranial pressure, increased intraocular pressure (risk of posterior ischemic optic neuropathy), corneal abrasion from edematous conjunctiva, upper airway edema (potentially requiring delayed extubation), and brachial plexus injury from shoulder braces if used. The perioperative nurse should ensure the patient's eyes are protected with lubricant and tape, monitor for progressive edema, and communicate with the surgical team about duration in the steep Trendelenburg position.",
    learningObjective: "Understand the physiological effects of prolonged steep Trendelenburg position with pneumoperitoneum on the cardiovascular and respiratory systems",
    blueprintCategory: "Intraoperative Care",
    subtopic: "surgical positioning effects",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Steep Trendelenburg effects are position-related, not allergic. Key finding: bilateral and symmetric edema with physiological explanation from venous congestion.",
    clinicalPearls: [
      "Steep Trendelenburg causes cephalad blood shift, increased ICP, IOP, and upper airway edema",
      "Pneumoperitoneum further reduces lung compliance by pushing the diaphragm cephalad",
      "Prolonged steep Trendelenburg may require delayed extubation due to upper airway edema"
    ],
    safetyNote: "Communicate duration in steep Trendelenburg to the surgical team — cumulative effects worsen with time and may require position modification",
    distractorRationales: [
      "Allergic reactions are typically unilateral or patchy and include urticaria, not bilateral dependent edema with positional explanation",
      "Anaphylaxis presents with bronchospasm, hypotension, and urticaria, not position-dependent edema",
      "Right heart failure from pneumoperitoneum would present with hemodynamic instability, not isolated facial edema"
    ]
  },
  {
    stem: "The circulating nurse is setting up the operating room for a procedure requiring use of a CO2 laser for excision of vocal cord polyps. Which safety precaution is SPECIFIC to laser use in the airway?",
    options: [
      "All personnel in the room must wear standard clear-lens safety glasses",
      "A laser-safe endotracheal tube must be used, and the cuff should be filled with saline (tinted with methylene blue) instead of air",
      "The door to the operating room should remain open for ventilation during laser use",
      "Standard surgical drapes can be used since CO2 lasers do not generate significant heat"
    ],
    correctAnswer: 1,
    rationaleLong: "When a CO2 laser is used in the airway, specific safety precautions must be implemented to prevent an airway fire, which is one of the most catastrophic complications in perioperative care. Standard PVC endotracheal tubes are highly flammable and can ignite when struck by a laser beam, causing an airway fire within the trachea. Therefore, a laser-safe (laser-resistant) endotracheal tube must be used. These specialized tubes are wrapped with metallic tape or made of metal, or are specifically designed to resist ignition from laser energy. Additionally, the endotracheal tube cuff should be filled with saline rather than air. Saline serves as a heat sink that absorbs laser energy if the cuff is inadvertently struck, and it helps extinguish any ignition. Methylene blue dye is added to the saline so that if the cuff is perforated by the laser, the blue-colored fluid is immediately visible, alerting the surgical team to cuff compromise. Other laser safety precautions include: reducing the FiO2 to the lowest concentration that maintains adequate oxygenation (supplemental oxygen supports combustion), using wavelength-specific laser safety eyewear (not standard glasses), keeping wet towels or sponges around the surgical site as a fire barrier, having a basin of saline available for immediate fire suppression, and posting a laser warning sign on the closed OR door.",
    learningObjective: "Implement specific laser safety precautions for airway surgery to prevent airway fire",
    blueprintCategory: "Intraoperative Care",
    subtopic: "laser safety",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard eyewear is NOT sufficient for laser protection — wavelength-specific laser safety goggles are required. Saline-filled cuffs with methylene blue dye are specific to airway laser procedures.",
    clinicalPearls: [
      "Laser-safe ETT with saline-filled cuff (methylene blue dye added) prevents airway fire",
      "Reduce FiO2 to lowest tolerable concentration during airway laser procedures",
      "Wavelength-specific laser safety eyewear is required — standard glasses are not protective"
    ],
    safetyNote: "An airway fire is a life-threatening emergency — if it occurs, stop ventilation, remove the ETT, flood the field with saline, and reintubate",
    distractorRationales: [
      "Standard clear-lens glasses do not protect against laser energy — wavelength-specific goggles are required",
      "OR doors must be CLOSED during laser use with a warning sign posted — open doors expose others to laser hazards",
      "CO2 lasers generate significant heat and can ignite drapes, ETTs, and tissues"
    ]
  },
  {
    stem: "During a total abdominal hysterectomy, the circulating nurse notices the monopolar electrosurgery return electrode (grounding pad) has partially peeled away from the patient's thigh. The surgeon is actively using the electrosurgery unit. What should the nurse do?",
    options: [
      "Wait until the surgeon stops using the ESU, then reapply the pad",
      "Immediately notify the surgeon to stop using the ESU, then reapply the return electrode to ensure full contact with adequate skin surface area",
      "Place a second return electrode on the opposite thigh as backup",
      "Switch to bipolar electrosurgery for the remainder of the case without addressing the loose pad"
    ],
    correctAnswer: 1,
    rationaleLong: "A partially detached monopolar electrosurgery return electrode (grounding pad) creates a dangerous situation that can result in a thermal burn at the return electrode site. Monopolar electrosurgery works by passing electrical current from the active electrode (pencil) through the patient's body to the return electrode. The return electrode must maintain full, even contact with a large skin surface area to disperse the electrical current safely. When the pad partially peels away, the contact area is reduced, concentrating the returning electrical current over a smaller area. This increased current density generates heat and can cause a full-thickness thermal burn at the pad site. Modern ESU units with return electrode monitoring (REM or contact quality monitoring) will alarm and deactivate when they detect reduced contact, but older units or those without this technology will continue to function even with inadequate contact. The nurse must immediately notify the surgeon to stop using the ESU, then reapply the return electrode to a clean, dry, well-vascularized, hair-free area with full contact. The pad should be applied over a large muscle mass (thigh, buttock) and should not be placed over bony prominences, scar tissue, or areas with metal implants.",
    learningObjective: "Identify and correct monopolar electrosurgery return electrode safety hazards to prevent thermal burns",
    blueprintCategory: "Intraoperative Care",
    subtopic: "electrosurgery safety",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A partially detached return electrode concentrates current density and causes burns. The surgeon must STOP using the ESU before the pad is reapplied.",
    clinicalPearls: [
      "Reduced return electrode contact area increases current density and causes thermal burns",
      "Place return electrode over large muscle mass, avoiding bony prominences, scars, and metal implants",
      "Return electrode monitoring (REM) alarms when contact quality is inadequate"
    ],
    safetyNote: "Check return electrode placement and contact quality before and throughout every case using monopolar electrosurgery",
    distractorRationales: [
      "Waiting while the ESU is actively in use risks an immediate burn injury — the surgeon must stop first",
      "Adding a second pad does not address the hazard at the detached pad — it must be properly reapplied",
      "Switching to bipolar without addressing the loose pad leaves a potential hazard and the surgeon may need monopolar later"
    ]
  },
  {
    stem: "The scrub nurse is preparing the sterile instrument table for an exploratory laparotomy. A wrapped instrument set with external chemical indicator tape shows appropriate color change, but when the set is opened, the internal chemical indicator has NOT changed color. What does this finding indicate?",
    options: [
      "The instruments are safe to use since the external indicator confirmed sterilization",
      "The sterilization parameters (time, temperature, and/or pressure) may not have been achieved throughout the entire package, and the set should not be used",
      "The internal indicator is defective and can be disregarded",
      "The instruments need an additional 10 minutes of flash sterilization before use"
    ],
    correctAnswer: 1,
    rationaleLong: "Chemical indicators are monitoring tools used to verify that sterilization conditions have been met. External chemical indicators (process indicators, Class 1) are placed on the outside of packaging and indicate only that the package has been exposed to the sterilization process (e.g., exposed to heat). They confirm that the package went through the sterilizer but do not verify that sterilization parameters were achieved throughout the package. Internal chemical indicators (multi-parameter indicators, Class 4 or 5) are placed inside the package and respond to multiple sterilization parameters including time, temperature, and steam penetration (for steam sterilization). When the internal indicator fails to change color, it indicates that the sterilization parameters may not have been achieved at the center of the pack. This could be due to improper loading of the sterilizer (overpacking prevents steam penetration), equipment malfunction, inadequate cycle parameters, or moisture within the pack. The instruments must NOT be used and the entire set should be returned to sterile processing for reprocessing. The external indicator changing while the internal indicator does not is not uncommon when steam cannot penetrate to the center of a tightly packed set. This is exactly why both external and internal indicators are required. Flash sterilization (now called immediate-use steam sterilization or IUSS) should not be used as a routine substitute for proper sterilization.",
    learningObjective: "Interpret chemical indicator results and respond appropriately when internal indicators fail to confirm sterilization",
    blueprintCategory: "Intraoperative Care",
    subtopic: "sterilization monitoring",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "External indicators only show EXPOSURE to the process. Internal indicators verify that sterilization PARAMETERS were achieved inside the pack. Both are needed.",
    clinicalPearls: [
      "External indicator = process exposure only. Internal indicator = sterilization parameters achieved inside pack",
      "Failed internal indicator = instruments are NOT sterile and must be reprocessed",
      "Most common cause of internal indicator failure: sterilizer overpacking preventing steam penetration"
    ],
    safetyNote: "Never use instruments when the internal chemical indicator has not changed — this indicates potential sterilization failure",
    distractorRationales: [
      "External indicators alone do not confirm sterilization — they only confirm the package entered the sterilizer",
      "Assuming the internal indicator is defective without evidence is dangerous and could result in patient infection",
      "Flash sterilization should not be used as a routine fix for sterilization failures — the set needs proper reprocessing"
    ]
  },
  {
    stem: "During a cesarean section under spinal anesthesia, the patient suddenly complains of difficulty breathing, becomes anxious, and her oxygen saturation drops from 99% to 91%. The anesthesiologist notes a high spinal block with sensory level at T2. Blood pressure drops to 78/42 mmHg. What is the most likely cause and priority intervention?",
    options: [
      "Amniotic fluid embolism — prepare for cardiopulmonary resuscitation",
      "High spinal anesthesia causing respiratory compromise — support airway and breathing, administer vasopressors for hypotension",
      "Pulmonary embolism — administer heparin and prepare for CT angiography",
      "Tension pneumothorax — prepare for needle decompression"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for a high or total spinal block, which occurs when the local anesthetic spreads higher than intended in the subarachnoid space. A sensory level at T2 means the block has reached the upper thoracic dermatomes, affecting the intercostal muscles that are critical for breathing. The patient's symptoms — difficulty breathing, anxiety, desaturation, and hypotension — result from the combination of respiratory muscle paralysis (intercostal muscles), sympathetic blockade (causing vasodilation and hypotension), and potential impairment of the phrenic nerve (C3-C5) which controls the diaphragm. If the block extends to C3-C5, the patient may develop complete respiratory failure. Priority interventions include: (1) Support airway and breathing — administer 100% oxygen, assist ventilation with bag-valve-mask, and prepare for intubation if respiratory failure is imminent; (2) Treat hypotension aggressively with IV fluid bolus and vasopressors (ephedrine or phenylephrine) to counteract the sympathetic blockade; (3) Left uterine displacement to prevent aortocaval compression (the pregnant uterus can compress the inferior vena cava in supine position); (4) Reassure the patient that the effects are temporary and will resolve as the block recedes. The circulating nurse should assist with airway management, prepare medications, and ensure the cesarean delivery continues promptly as the baby needs to be delivered.",
    learningObjective: "Recognize and respond to high spinal anesthesia during cesarean section with appropriate airway and hemodynamic support",
    blueprintCategory: "Intraoperative Care",
    subtopic: "anesthesia complications",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "High spinal = T2 level with respiratory compromise and hypotension. The key differentiator from amniotic fluid embolism is the gradual onset and clear relationship to the spinal anesthetic.",
    clinicalPearls: [
      "High spinal: block extends above T4 causing intercostal paralysis, sympathetic blockade, and potential phrenic nerve involvement",
      "Priority: support airway/breathing, vasopressors for hypotension, left uterine displacement in pregnant patients",
      "Effects are temporary and resolve as the block recedes — reassure the patient"
    ],
    safetyNote: "Have intubation equipment and vasopressors immediately available whenever spinal anesthesia is administered",
    distractorRationales: [
      "AFE presents with sudden cardiovascular collapse, DIC, and seizures — not a gradual ascending block pattern",
      "PE typically presents with sudden pleuritic chest pain and tachycardia without the ascending sensory block",
      "Tension pneumothorax presents with absent breath sounds, tracheal deviation, and is unrelated to spinal anesthesia"
    ]
  }
];
