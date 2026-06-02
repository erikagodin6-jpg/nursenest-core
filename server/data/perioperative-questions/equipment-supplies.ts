import type { PerioperativeQuestion } from "./types";

export const equipmentSuppliesQuestions: PerioperativeQuestion[] = [
  {
    stem: "During a laparoscopic cholecystectomy, the surgeon requests the circulating nurse to increase the electrosurgery unit (ESU) power setting because the tissue is not coagulating adequately. Before increasing the power, what should the nurse assess FIRST?",
    options: [
      "Whether the patient has a pacemaker that could be affected by higher power settings",
      "The return electrode (grounding pad) placement and contact quality, as inadequate contact is the most common cause of poor ESU performance",
      "Whether the surgeon is using the correct hand piece for the procedure",
      "The age of the ESU unit and when it was last serviced"
    ],
    correctAnswer: 1,
    rationaleLong: "When the electrosurgery unit appears to be performing inadequately (insufficient coagulation or cutting), the most common cause is a problem with the return electrode (dispersive pad/grounding pad) rather than insufficient power settings. Before increasing the power, the circulating nurse should systematically assess: (1) Return electrode placement and contact — is the pad making full, even contact with the skin? Has it partially peeled off? Is it on dry, clean skin overlying a large muscle mass? (2) Return electrode connections — is the cord fully connected to the ESU and the pad? (3) Patient skin preparation — was alcohol-based prep used? Is the skin dry under the pad? (4) Patient positioning changes — has the patient been repositioned since the pad was applied? (5) Pad location — is it on an appropriate site (not over a bony prominence, scar tissue, or metallic implant)? Increasing the power without checking the return electrode can mask an underlying safety problem. If the return electrode has inadequate contact, increasing power concentrates more energy at the reduced contact point, significantly increasing the risk of a thermal burn at the pad site. Other causes of poor ESU performance include: damaged insulation on the active electrode, incorrect mode selection (cut vs. coag), excessive tissue desiccation, and instrument malfunction. The nurse should also verify that the electrosurgery pencil tip is clean, as char buildup on the tip reduces conductivity.",
    learningObjective: "Systematically troubleshoot electrosurgery performance issues by assessing the return electrode before increasing power settings",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "electrosurgery troubleshooting",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Poor ESU performance is usually a return electrode or connection problem — increasing power without checking can cause burns.",
    clinicalPearls: [
      "Most common cause of poor ESU performance: return electrode contact issues, not insufficient power",
      "Always check return electrode, connections, and electrode tip before increasing ESU power",
      "Char buildup on the active electrode tip reduces conductivity — clean tip with moist sponge"
    ],
    safetyNote: "Never increase ESU power settings without first assessing the return electrode and active electrode — increased power with poor contact causes burns",
    distractorRationales: [
      "Pacemaker consideration is important but does not explain the immediate performance problem",
      "Hand piece selection is relevant but return electrode contact is the most common cause of poor performance",
      "ESU age and service history are maintenance concerns but not the first troubleshooting step for acute performance issues"
    ]
  },
  {
    stem: "A scrub nurse is preparing suture materials for a bowel anastomosis during an open right hemicolectomy. The surgeon requests an absorbable braided suture for the inner layer. Which suture is most appropriate for this purpose?",
    options: [
      "Silk (braided, non-absorbable)",
      "Polyglactin 910 (Vicryl — braided, synthetic absorbable with 56-70 day absorption and approximately 75% tensile strength at 2 weeks)",
      "Polypropylene (Prolene — monofilament, non-absorbable)",
      "Chromic gut (absorbable, natural monofilament with unpredictable absorption)"
    ],
    correctAnswer: 1,
    rationaleLong: "For the inner layer of a bowel anastomosis, an absorbable braided suture is appropriate because: (1) the suture does not need to provide permanent support (the bowel heals and regains strength within weeks), (2) absorbable suture reduces the risk of suture-related complications within the bowel lumen (non-absorbable suture exposed to the lumen can serve as a nidus for stone formation or granuloma), and (3) braided suture provides better knot security than monofilament. Polyglactin 910 (Vicryl) is a synthetic braided absorbable suture that maintains approximately 75% of its tensile strength at 2 weeks and 50% at 3 weeks, with complete absorption by 56-70 days through hydrolysis. This timeline matches the healing progression of bowel anastomoses, which achieve adequate strength within 2-3 weeks. Silk, while braided and having excellent handling characteristics, is non-absorbable and would persist in the bowel wall indefinitely. Polypropylene (Prolene) is a monofilament non-absorbable suture, which does not meet either criterion (absorbable or braided). Chromic gut is absorbable but is a natural material with less predictable absorption timing and greater tissue reactivity compared to synthetic absorbable sutures. The outer layer of a bowel anastomosis typically uses interrupted silk or absorbable suture (Lambert or seromuscular sutures), while the inner layer uses a continuous absorbable suture (Connell or through-and-through sutures).",
    learningObjective: "Select appropriate suture materials based on tissue requirements, absorption profile, and surgical application",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "suture materials",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Vicryl = braided, synthetic, absorbable. Silk = braided but non-absorbable. Prolene = monofilament, non-absorbable. Know the classifications.",
    clinicalPearls: [
      "Vicryl (polyglactin 910): braided, synthetic absorbable, 75% strength at 2 weeks, absorbed by 56-70 days",
      "Inner bowel layer = absorbable; outer bowel layer = interrupted silk or absorbable (seromuscular)",
      "Non-absorbable suture in the bowel lumen can cause stone formation or granuloma"
    ],
    safetyNote: "Always verify suture type, size, and needle configuration with the surgeon before opening suture packages",
    distractorRationales: [
      "Silk is non-absorbable — it would persist in the bowel wall and is not appropriate for the inner layer",
      "Prolene is both monofilament and non-absorbable — it does not meet the surgeon's request",
      "Chromic gut has unpredictable absorption and higher tissue reactivity than synthetic absorbable sutures"
    ]
  },
  {
    stem: "The perioperative nurse is setting up for a procedure requiring a pneumatic tourniquet on the upper extremity. What is the recommended tourniquet width and inflation pressure for an adult upper extremity?",
    options: [
      "Narrow cuff (5 cm), inflated to 350 mmHg above systolic blood pressure",
      "Width should be appropriate for the limb (typically wider cuffs for larger limbs), and inflation pressure is typically 50-75 mmHg above systolic blood pressure for upper extremity or determined by limb occlusion pressure (LOP) plus a safety margin",
      "Any available cuff width, inflated to a standard 400 mmHg regardless of the patient's blood pressure",
      "The widest available cuff inflated to 25 mmHg above diastolic blood pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Pneumatic tourniquet use requires attention to both cuff selection and inflation pressure to achieve effective hemostasis while minimizing the risk of complications. Cuff width should be appropriate for the patient's limb — wider cuffs occlude blood flow at lower pressures and distribute pressure more evenly, reducing the risk of tissue and nerve injury. As a general guideline, the cuff width should be approximately 20% wider than the limb diameter. For adult upper extremities, inflation pressure is typically set at 50-75 mmHg above the patient's systolic blood pressure. For lower extremities, the pressure is typically 100-150 mmHg above systolic, or double the systolic blood pressure. A more evidence-based approach uses the limb occlusion pressure (LOP) method, where the minimum pressure needed to occlude arterial flow (determined by Doppler or pulse oximetry) is identified, and a safety margin is added (typically 40-80 mmHg above LOP for upper extremity and 80-100 mmHg above LOP for lower extremity). This individualized approach uses the lowest effective pressure, reducing tissue compression and injury risk. Excessively high pressures increase the risk of nerve injury, skin damage, and post-tourniquet syndrome. Excessively low pressures cause venous congestion without arterial occlusion, paradoxically increasing bleeding. The nurse should document the cuff location, pressure, and total inflation time.",
    learningObjective: "Apply evidence-based tourniquet pressure guidelines to minimize tissue injury while achieving effective hemostasis",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "tourniquet use",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Upper extremity: 50-75 mmHg above systolic. Lower extremity: 100-150 mmHg above systolic. LOP-based method is more evidence-based.",
    clinicalPearls: [
      "Upper extremity tourniquet: 50-75 mmHg above systolic; Lower extremity: 100-150 mmHg above systolic",
      "Wider cuffs occlude flow at lower pressures and reduce injury risk — match cuff to limb size",
      "Limb occlusion pressure (LOP) method uses the lowest effective pressure with a safety margin"
    ],
    safetyNote: "Document tourniquet location, inflation pressure, total time inflated, skin condition before inflation and after deflation",
    distractorRationales: [
      "A narrow cuff at 350 mmHg is excessively high and increases nerve and tissue injury risk",
      "Standard 400 mmHg regardless of patient factors causes unnecessary tissue compression and injury",
      "Diastolic pressure is not the reference point for tourniquet inflation — systolic pressure or LOP is used"
    ]
  },
  {
    stem: "A circulating nurse notices that the fiber-optic light cable attached to a laparoscopic camera is resting on the surgical drape while the light source is turned on. What is the immediate safety concern?",
    options: [
      "The light cable may cause electromagnetic interference with the patient's cardiac monitor",
      "The concentrated light energy from the fiber-optic cable can generate enough heat to ignite the surgical drape, creating a fire risk",
      "The light cable may become contaminated if it contacts the drape material",
      "The camera image quality will be degraded if the cable is not properly positioned"
    ],
    correctAnswer: 1,
    rationaleLong: "Fiber-optic light cables used in endoscopic surgery carry intense, focused light energy that generates significant heat at the cable tip. When the light source is turned on and the cable tip is in contact with combustible materials such as surgical drapes, sponges, or patient skin/hair, the concentrated heat can reach temperatures sufficient to cause ignition within seconds. This is one of the lesser-known but well-documented sources of operating room fires. The fire triangle in the OR includes the three elements: an ignition source (fiber-optic light cable tip, electrosurgery unit, laser), a fuel source (drapes, sponges, alcohol-based prep, patient hair, intestinal gases), and an oxidizer (supplemental oxygen, nitrous oxide, room air). The fiber-optic light cable tip qualifies as an ignition source capable of producing temperatures exceeding 400°F within 10-30 seconds of contact with a surface. Safety measures include: always disconnecting the light cable from the light source or placing it in standby mode when not actively in use, never placing an active (illuminated) light cable on drapes or near combustible materials, using a designated holster or clip to secure the cable when not in use, and maintaining awareness of the cable tip position throughout the procedure.",
    learningObjective: "Identify fiber-optic light cables as a potential ignition source for operating room fires and implement appropriate safety measures",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "fiber-optic light cable safety",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Active fiber-optic light cables can reach >400°F and ignite drapes within seconds. Always disconnect or place in standby when not in use.",
    clinicalPearls: [
      "Fiber-optic light cable tips reach >400°F and can ignite drapes within 10-30 seconds of contact",
      "The light cable is a recognized OR fire ignition source — same category as ESU and laser",
      "Disconnect light cable from source or use standby mode whenever it is not actively in the surgical field"
    ],
    safetyNote: "Never place an active fiber-optic light cable on drapes or near any combustible material — always disconnect or use standby mode",
    distractorRationales: [
      "Light cables do not cause electromagnetic interference with cardiac monitors",
      "Contamination is not the primary concern — the fire risk is the immediate safety hazard",
      "Image quality, while important, is secondary to the fire safety concern"
    ]
  },
  {
    stem: "The surgical team is about to perform a procedure on the wrong extremity. The circulating nurse identifies the error during the Time Out. What component of the Universal Protocol prevented this wrong-site surgery?",
    options: [
      "The preoperative nursing assessment",
      "The Time Out — a final verification performed immediately before the procedure begins, confirming the correct patient, correct procedure, and correct site with all team members",
      "The surgeon's memory of the operative plan",
      "The operating room schedule board"
    ],
    correctAnswer: 1,
    rationaleLong: "The Universal Protocol, mandated by The Joint Commission (TJC), consists of three components designed to prevent wrong-site, wrong-procedure, and wrong-patient surgery: (1) Preoperative Verification — an ongoing process throughout the preoperative period to verify the correct patient, correct procedure, and correct site using all relevant documentation (consent form, medical record, imaging studies); (2) Marking the Operative Site — the person performing the procedure marks the surgical site with an indelible marker while the patient is awake and can confirm the site (marking is required for procedures involving laterality, multiple structures, or multiple levels); (3) Time Out — the final verification performed immediately before the procedure begins (before incision) in which all team members stop, actively communicate, and verbally confirm the correct patient identity, correct procedure, correct site/side, correct patient position, and availability of correct implants/equipment. The Time Out is the last line of defense against wrong-site surgery. In this scenario, the Time Out caught the error before the incision was made, preventing a 'never event.' ALL team members have the authority and obligation to halt the procedure if any element of the Time Out cannot be verified. The Time Out is not a passive checklist — it requires active verbal participation from all members of the surgical team.",
    learningObjective: "Identify the Time Out as the final safety checkpoint of the Universal Protocol that prevents wrong-site, wrong-procedure, and wrong-patient surgery",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "surgical safety protocol",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Universal Protocol has 3 components: Preoperative Verification, Site Marking, and Time Out. The Time Out is the LAST line of defense before incision.",
    clinicalPearls: [
      "Universal Protocol: Preoperative Verification + Site Marking + Time Out",
      "Time Out requires ALL team members to stop and actively verify before incision",
      "Any team member can halt the procedure if verification fails — this is a shared responsibility"
    ],
    safetyNote: "Never proceed with an incision if any element of the Time Out cannot be verified — stop and resolve the discrepancy",
    distractorRationales: [
      "Preoperative assessment is important but the Time Out is the specific final verification that caught this error",
      "Relying on the surgeon's memory is not a safety system — human memory is fallible",
      "The OR schedule board is an administrative tool, not a patient safety verification system"
    ]
  },
  {
    stem: "A perioperative nurse is setting up for a total hip arthroplasty. The surgeon's preference card lists bone cement (polymethylmethacrylate/PMMA). What safety precaution is MOST critical when bone cement is being mixed and applied?",
    options: [
      "Ensure the room temperature is below 65°F to prevent premature hardening",
      "Ensure adequate room ventilation and use a vacuum mixing system, as PMMA monomer vapors are toxic and can cause hypotension in the patient during cementation",
      "Apply the cement with bare hands to ensure proper consistency",
      "Mix the cement at least 30 minutes before the surgeon needs it to allow proper polymerization"
    ],
    correctAnswer: 1,
    rationaleLong: "Polymethylmethacrylate (PMMA) bone cement used in joint arthroplasty poses several safety concerns that the perioperative nurse must be aware of. The liquid monomer (methylmethacrylate) produces vapors that are irritating to the eyes, skin, and respiratory tract. Prolonged exposure to these vapors can cause allergic sensitization, dermatitis, and respiratory effects. Staff should use a vacuum mixing system (closed system) to minimize vapor exposure, and the operating room should have adequate ventilation. More critically for the patient, the cementation process can cause a phenomenon known as bone cement implantation syndrome (BCIS), which presents as hypotension, hypoxia, loss of consciousness, and even cardiac arrest. This occurs when the pressurized cement forces fat, air, marrow contents, and cement particles into the venous circulation, causing fat embolism, complement activation, and cardiovascular collapse. The anesthesiologist must be alerted before cement is inserted so they can prepare for potential hemodynamic instability. Additional safety considerations include: the exothermic polymerization reaction generates significant heat (can reach 100°C), the monomer is flammable, and nitrile gloves (not latex) should be worn when handling PMMA as the monomer can penetrate latex gloves. The circulating nurse should also ensure that the cement has not expired and that the components are properly mixed per manufacturer instructions.",
    learningObjective: "Implement safety precautions for PMMA bone cement use including vapor management and awareness of bone cement implantation syndrome",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "bone cement safety",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "BCIS (bone cement implantation syndrome) causes sudden hypotension, hypoxia, and potential cardiac arrest. Alert anesthesia BEFORE cementation.",
    clinicalPearls: [
      "BCIS: hypotension, hypoxia, loss of consciousness during cementation — can cause cardiac arrest",
      "Use vacuum mixing system to minimize monomer vapor exposure for staff and patient",
      "MMA monomer penetrates latex gloves — use nitrile gloves; monomer is also flammable"
    ],
    safetyNote: "Alert the anesthesiologist before bone cement is inserted — BCIS can cause sudden cardiovascular collapse requiring immediate intervention",
    distractorRationales: [
      "Room temperature affects cement working time but the primary safety concern is vapor toxicity and BCIS",
      "Bare hand contact with PMMA monomer causes chemical dermatitis — always wear nitrile gloves",
      "Cement has a specific working time (5-10 minutes) and premixing 30 minutes early would result in a hardened, unusable product"
    ]
  },
  {
    stem: "A perioperative nurse is preparing for a case that requires the use of a surgical laser. The nurse needs to select the appropriate laser safety eyewear. Which factor MOST determines the correct eyewear selection?",
    options: [
      "The color of the laser beam",
      "The wavelength and optical density (OD) rating specific to the laser being used",
      "Whether the eyewear is comfortable for extended wear",
      "The cost of the eyewear and availability in the department"
    ],
    correctAnswer: 1,
    rationaleLong: "Laser safety eyewear must be specifically matched to the wavelength of the laser being used and must have an adequate optical density (OD) rating for that wavelength. Different lasers operate at different wavelengths: CO2 lasers (10,600 nm), Nd:YAG lasers (1,064 nm), Argon lasers (488-514 nm), KTP lasers (532 nm), and diode lasers (various wavelengths). Each wavelength requires eyewear with lenses specifically designed to absorb or reflect that particular wavelength. Using eyewear designed for a different laser wavelength provides NO protection against the laser in use. The optical density (OD) rating indicates how much the eyewear attenuates (reduces) the laser energy at the specified wavelength. A higher OD provides greater protection. The required OD depends on the laser's power/energy output and the maximum permissible exposure (MPE) for the eye. Laser safety eyewear must be clearly labeled with the wavelengths they protect against and their OD ratings. The Laser Safety Officer (LSO) is responsible for determining the appropriate eyewear for each laser and ensuring adequate supply is available. All personnel in the laser treatment area, including the patient, must wear appropriate eye protection. The patient's eyes may be protected with wavelength-specific goggles, moist eye pads, or metallic corneal shields depending on the procedure location.",
    learningObjective: "Select appropriate wavelength-specific laser safety eyewear based on the laser being used",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "laser safety equipment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Laser safety eyewear is WAVELENGTH-SPECIFIC. Eyewear for one laser type does NOT protect against a different wavelength laser.",
    clinicalPearls: [
      "Laser eyewear must match the specific wavelength and have adequate optical density (OD) for the laser in use",
      "CO2: 10,600 nm; Nd:YAG: 1,064 nm; Argon: 488-514 nm; KTP: 532 nm",
      "The Laser Safety Officer determines appropriate eyewear and ensures availability"
    ],
    safetyNote: "Using incorrect wavelength laser eyewear provides NO protection — verify the eyewear is labeled for the specific laser being used",
    distractorRationales: [
      "Beam color is related to wavelength but the specific wavelength and OD rating are the determining factors",
      "Comfort is important for compliance but is secondary to the primary safety requirement of wavelength specificity",
      "Cost and availability do not determine the correct eyewear — only wavelength and OD specifications are relevant"
    ]
  },
  {
    stem: "During a surgical procedure, the circulating nurse discovers that a surgical instrument set is missing one Kocher clamp according to the count sheet. The set was verified as complete by sterile processing before delivery. What is the FIRST action?",
    options: [
      "Note the discrepancy on the count sheet and inform the surgeon at the end of the case",
      "Immediately reconcile the count with all team members, search the field and drapes, and if the instrument cannot be located, initiate the incorrect count protocol before the case begins",
      "Assume the instrument was left out during packaging and adjust the count sheet",
      "Request a replacement Kocher clamp and add it to the count without investigating the discrepancy"
    ],
    correctAnswer: 1,
    rationaleLong: "When an initial surgical count reveals a discrepancy between the count sheet and the actual instruments present, the scrub nurse and circulating nurse must immediately reconcile the count. This means systematically accounting for every instrument by comparing the count sheet (which documents what should be in the set) with what is actually on the field. If a Kocher clamp that was documented as being in the set is missing, there are several possibilities: (1) it was inadvertently left out during assembly in sterile processing, (2) it was dropped during transport, (3) it is hidden within the drapes or on the field, or (4) the count sheet itself is in error. The discrepancy must be resolved before the case begins. If the instrument cannot be located after a thorough search, the incorrect count protocol should be initiated, which typically includes: notifying the surgeon, documenting the discrepancy, adjusting the count sheet with witnesses, and potentially obtaining an X-ray at the end of the case to confirm no retained instrument (though in this case, the instrument was likely missing from the start). Simply adjusting the count sheet without investigation, adding a replacement without documentation, or deferring the issue to the end of the case all create opportunities for retained surgical items. The starting count must be accurate because all subsequent counts reference it.",
    learningObjective: "Respond to initial count discrepancies by systematically reconciling and resolving the discrepancy before the procedure begins",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "instrument counting",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Initial count discrepancies must be resolved BEFORE the case begins. Never adjust the count sheet without investigation — the starting count must be accurate.",
    clinicalPearls: [
      "The initial count establishes the baseline — all subsequent counts reference it and it must be accurate",
      "Discrepancies in the initial count must be reconciled and documented before the case begins",
      "Never assume an instrument was 'left out' — investigate and document all discrepancies"
    ],
    safetyNote: "An inaccurate initial count makes all subsequent counts unreliable and increases the risk of retained surgical instruments",
    distractorRationales: [
      "Deferring discrepancy resolution to the end of the case creates risk of retained instruments",
      "Assuming it was left out without investigation is dangerous — it could be in the drapes or on the field",
      "Adding a replacement without investigating the original discrepancy creates a count error"
    ]
  },
  {
    stem: "A patient with a body weight of 150 kg is scheduled for bariatric surgery. The standard operating table has a weight capacity of 135 kg (300 lbs). What is the appropriate nursing action?",
    options: [
      "Proceed with the standard table since the 15 kg difference is within an acceptable tolerance range",
      "Obtain a bariatric operating table rated for the patient's weight, and ensure all positioning devices, stirrups, and transfer equipment are also rated for bariatric use",
      "Place an extra mattress pad on the standard table to distribute the weight more evenly",
      "Reduce the patient's weight by administering a diuretic before surgery"
    ],
    correctAnswer: 1,
    rationaleLong: "Operating table weight limits are determined by the manufacturer and represent the maximum safe load capacity for the table and its components (including the hydraulic system, table top integrity, and attachment points for accessories). Exceeding the weight limit creates risks of table malfunction (hydraulic failure during positioning), structural failure (table collapse), and potential catastrophic injury to the patient and surgical team. A patient weighing 150 kg exceeds the 135 kg limit of the standard table and requires a bariatric-rated operating table. Bariatric operating tables are specifically designed to support higher weights (typically up to 450-600 kg or more) and are wider to accommodate larger body habitus. Additionally, all associated equipment must be appropriately rated: positioning devices (bean bags, arm boards), stirrups (especially important as standard stirrups may have lower weight limits), transfer devices (sliders, lifts, hover mats), and safety straps. The operating room should have bariatric equipment readily available and staff should be trained in its use. A multidisciplinary planning approach is recommended for bariatric patients, including coordination with anesthesia for potential difficult airway, consideration of positioning-related complications (rhabdomyolysis, nerve injuries), and availability of longer instruments.",
    learningObjective: "Ensure appropriate weight-rated equipment is available for bariatric surgical patients to prevent equipment failure and injury",
    blueprintCategory: "Equipment and Supplies",
    subtopic: "bariatric equipment",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never exceed the manufacturer's weight limit for operating tables or positioning equipment — there is no 'acceptable tolerance range.'",
    clinicalPearls: [
      "Standard OR tables: typically 135-205 kg capacity; bariatric tables: up to 450-600+ kg",
      "ALL equipment must be weight-rated for bariatric patients: table, stirrups, arm boards, transfer devices",
      "Plan ahead for bariatric patients: specialized equipment, longer instruments, difficult airway preparation"
    ],
    safetyNote: "Exceeding table weight limits can cause hydraulic failure, table collapse, and catastrophic injury — always use appropriately rated equipment",
    distractorRationales: [
      "There is no acceptable tolerance above the manufacturer's weight limit — this creates liability and safety risk",
      "Extra padding does not change the structural or hydraulic weight capacity of the table",
      "Diuretic administration is inappropriate, ineffective for meaningful weight reduction, and dangerous before surgery"
    ]
  }
];
