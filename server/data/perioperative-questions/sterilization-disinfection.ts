import type { PerioperativeQuestion } from "./types";

export const sterilizationDisinfectionQuestions: PerioperativeQuestion[] = [
  {
    stem: "A sterile processing technician is loading a steam sterilizer for a gravity displacement cycle. The standard parameters for wrapped instruments in a gravity displacement sterilizer are which of the following?",
    options: [
      "250°F (121°C) at 15 psi for 15-30 minutes",
      "270°F (132°C) at 27 psi for 3-4 minutes",
      "320°F (160°C) at atmospheric pressure for 60 minutes",
      "212°F (100°C) at 15 psi for 45 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "Steam sterilization (autoclaving) is the most common and preferred method of sterilization for heat- and moisture-stable surgical instruments. There are two main types of steam sterilizers: gravity displacement and prevacuum (dynamic air removal). Gravity displacement sterilizers rely on gravity to displace air from the chamber as steam enters from the top and pushes air out through a drain at the bottom. Standard parameters for wrapped instruments in a gravity displacement sterilizer are 250°F (121°C) at 15 psi for 15-30 minutes exposure time (depending on the load configuration). Prevacuum sterilizers use a series of vacuum pulses to actively remove air from the chamber before steam is introduced, allowing faster and more reliable steam penetration. Prevacuum parameters are typically 270°F (132°C) at 27 psi for 3-4 minutes exposure time. The prevacuum cycle is preferred for porous loads and instrument sets with lumens because it achieves more complete air removal. The 320°F at atmospheric pressure describes dry heat sterilization, which is used for items that cannot tolerate moisture (such as powders and oils). The 212°F option describes boiling temperature at sea level, which achieves high-level disinfection but NOT sterilization. Understanding these parameters is essential for the perioperative nurse to verify that instruments have been processed correctly.",
    learningObjective: "Differentiate sterilization parameters for gravity displacement and prevacuum steam sterilization cycles",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "steam sterilization parameters",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Gravity displacement: 250°F/121°C, 15 psi, 15-30 min. Prevacuum: 270°F/132°C, 27 psi, 3-4 min. Don't confuse the two.",
    clinicalPearls: [
      "Gravity displacement: 250°F (121°C), 15 psi, 15-30 minutes — relies on gravity for air removal",
      "Prevacuum: 270°F (132°C), 27 psi, 3-4 minutes — uses vacuum pulses for air removal",
      "Prevacuum is preferred for wrapped instrument sets and items with lumens"
    ],
    safetyNote: "Always verify sterilization parameters match the type of sterilizer and cycle used — incorrect parameters result in non-sterile instruments",
    distractorRationales: [
      "270°F/132°C at 27 psi for 3-4 minutes describes prevacuum sterilization, not gravity displacement",
      "320°F at atmospheric pressure for 60 minutes describes dry heat sterilization, not steam sterilization",
      "212°F is boiling temperature, which achieves disinfection but not sterilization"
    ]
  },
  {
    stem: "The perioperative nurse receives a peel-pack instrument from the sterile processing department. Upon inspection, the nurse notes the packaging is intact but there is a visible wet area on the outside of the peel pack. What should the nurse do?",
    options: [
      "Use the instrument since the packaging is intact and the chemical indicator has changed",
      "Consider the item contaminated (wet pack/event-related contamination) and return it to sterile processing for reprocessing",
      "Dry the wet area with a sterile towel and use the instrument immediately",
      "Open the package carefully from the dry end and use the instrument if the inside appears dry"
    ],
    correctAnswer: 1,
    rationaleLong: "A wet pack, also called a 'wet strike-through,' renders the contents non-sterile regardless of whether the packaging appears intact. Moisture on the outside of a sterile package creates a pathway (wick effect) for microorganisms to migrate from the non-sterile exterior through the packaging material to the sterile interior. This is known as strike-through contamination. Causes of wet packs include: improper drying cycles in the sterilizer, overloading the sterilizer (preventing adequate drying), removing packages from the sterilizer before they are completely dry, placing warm sterile packages on cold surfaces (causing condensation), and excessive wrapping material. The item must be considered non-sterile and returned to sterile processing for complete reprocessing (cleaning, repackaging, and re-sterilization). Event-related sterility is the current standard in sterile processing, which means that sterile items remain sterile until an event compromises the packaging integrity — and moisture constitutes such an event. The nurse should never attempt to dry, open, or use a wet pack. Additionally, the nurse should report the wet pack occurrence to sterile processing so the root cause can be investigated and corrected. Frequent wet packs may indicate sterilizer malfunction, improper loading technique, or inadequate drying cycles.",
    learningObjective: "Identify compromised sterile packaging (wet packs) and respond appropriately to maintain aseptic technique",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterile packaging integrity",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A wet pack is ALWAYS non-sterile regardless of chemical indicator results or packaging integrity — moisture creates a pathway for microbial migration.",
    clinicalPearls: [
      "Moisture on sterile packaging = strike-through contamination = non-sterile",
      "Event-related sterility: items remain sterile until an event (moisture, tear, opening) compromises packaging",
      "Report wet packs to sterile processing to investigate root cause"
    ],
    safetyNote: "Never use a wet or damp sterile package — return to sterile processing for complete reprocessing",
    distractorRationales: [
      "Chemical indicator change does not guarantee sterility when packaging integrity is compromised by moisture",
      "Drying the exterior does not eliminate microorganisms that may have already migrated through the wet packaging",
      "Opening from the dry end does not address the contamination that occurred through the wet area"
    ]
  },
  {
    stem: "A nursing student asks the perioperative nurse to explain the difference between sterilization, high-level disinfection, and low-level disinfection. Which statement by the student indicates correct understanding?",
    options: [
      "Sterilization kills all bacteria, while high-level disinfection kills only gram-positive bacteria",
      "Sterilization destroys all microorganisms including bacterial spores; high-level disinfection kills all microorganisms except high numbers of bacterial spores; low-level disinfection kills most vegetative bacteria, some fungi, and lipid-enveloped viruses",
      "High-level disinfection and sterilization are equivalent processes that can be used interchangeably for surgical instruments",
      "Low-level disinfection is adequate for all semi-critical devices that contact mucous membranes"
    ],
    correctAnswer: 1,
    rationaleLong: "The Spaulding Classification System categorizes medical devices based on their intended use and the level of disinfection or sterilization required. Sterilization is the complete elimination of ALL forms of microbial life, including bacterial endospores (the most resistant form of microbial life). This is required for critical items — those that enter sterile tissue or the vascular system (surgical instruments, implants, cardiac catheters). High-level disinfection (HLD) destroys all microorganisms except high numbers of bacterial spores. It is required for semi-critical items — those that contact mucous membranes or non-intact skin (endoscopes, laryngoscope blades, respiratory therapy equipment). Common HLD agents include glutaraldehyde (2%, 20-45 minutes), ortho-phthalaldehyde (OPA, 12 minutes), hydrogen peroxide (7.5%), and peracetic acid. Low-level disinfection (LLD) kills most vegetative bacteria, some fungi, and enveloped (lipid-containing) viruses but does NOT kill mycobacteria, non-enveloped viruses, or bacterial spores. LLD is used for non-critical items — those that contact only intact skin (blood pressure cuffs, stethoscopes, patient furniture). Common LLD agents include quaternary ammonium compounds, dilute bleach solutions, and alcohol wipes. This hierarchy is fundamental to infection prevention in the perioperative environment.",
    learningObjective: "Apply the Spaulding Classification System to determine appropriate levels of disinfection or sterilization for medical devices",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "Spaulding classification",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Sterilization kills ALL microorganisms including spores. HLD kills all EXCEPT large numbers of spores. They are NOT interchangeable.",
    clinicalPearls: [
      "Critical items (sterile tissue/vascular) = sterilization; Semi-critical (mucous membranes) = HLD; Non-critical (intact skin) = LLD",
      "Bacterial spores are the most resistant form of microbial life — only sterilization reliably destroys them",
      "Common HLD agents: glutaraldehyde 2% (20-45 min), OPA (12 min), peracetic acid"
    ],
    safetyNote: "Never substitute high-level disinfection for sterilization when processing critical surgical instruments — this risks patient infection",
    distractorRationales: [
      "HLD kills all microorganisms, not just gram-positive bacteria",
      "HLD and sterilization are NOT equivalent and cannot be used interchangeably for surgical instruments",
      "Semi-critical devices require HLD, not low-level disinfection"
    ]
  },
  {
    stem: "The sterile processing department has received a recall notice for a biological indicator lot. The perioperative nurse manager needs to understand what biological indicators test. Which statement is correct?",
    options: [
      "Biological indicators test whether the chemical indicator tape has changed color appropriately",
      "Biological indicators contain a known population of highly resistant bacterial spores (Geobacillus stearothermophilus for steam; Bacillus atrophaeus for EtO and dry heat) and are the gold standard for verifying sterilization efficacy",
      "Biological indicators measure the temperature and pressure inside the sterilizer during each cycle",
      "Biological indicators test for residual chemical sterilant on processed instruments"
    ],
    correctAnswer: 1,
    rationaleLong: "Biological indicators (BIs) are the most reliable method for verifying that sterilization has actually been achieved. They contain a standardized population of bacterial spores that are highly resistant to the specific sterilization process being monitored. For steam sterilization, the organism used is Geobacillus stearothermophilus (formerly Bacillus stearothermophilus), which is highly heat-resistant with a D-value (time to kill 90% of spores) appropriate for steam parameters. For ethylene oxide (EtO) gas sterilization and dry heat sterilization, Bacillus atrophaeus (formerly B. subtilis) is used. For hydrogen peroxide gas plasma (Sterrad), G. stearothermophilus is also used. After the sterilization cycle, the BI is incubated — for steam BIs, typically at 55-60°C for 24-48 hours (rapid-readout BIs give results in 1-3 hours using fluorescent technology). If the spores are killed (no growth), the sterilization cycle was effective. If the spores survive (growth detected), the cycle failed and all items processed in that load must be recalled and reprocessed. BIs should be run at least daily (or with every load for implants), and in every load containing implantable devices. Implants should not be used until the BI result is negative. Chemical indicators and mechanical indicators (printouts showing time, temperature, pressure) are also important monitoring tools but do not directly prove sterilization like BIs do.",
    learningObjective: "Understand the purpose, organisms, and interpretation of biological indicators in sterilization monitoring",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterilization monitoring",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Steam sterilization BI: Geobacillus stearothermophilus. EtO/dry heat BI: Bacillus atrophaeus. Know which organism goes with which method.",
    clinicalPearls: [
      "BIs are the gold standard for sterilization verification — they prove sterilization actually occurred",
      "Steam BI: G. stearothermophilus; EtO/dry heat BI: B. atrophaeus",
      "Implants should not be released until BI results confirm sterilization (rapid-readout BIs: 1-3 hours)"
    ],
    safetyNote: "A positive BI result (spore growth) requires immediate recall of all items processed in that load and investigation of the sterilizer",
    distractorRationales: [
      "Chemical indicators are separate monitoring tools — BIs do not test chemical indicator function",
      "Mechanical indicators (printouts) measure physical parameters — BIs directly test microbial kill",
      "BIs do not test for chemical residuals — aeration testing serves that function for EtO sterilization"
    ]
  },
  {
    stem: "A circulating nurse receives an instrument from central sterile processing with a torn wrapper. The tear is small (approximately 2 mm) near the edge of the wrap. The instrument is needed for a case starting in 10 minutes. What is the correct action?",
    options: [
      "Use the instrument since the tear is small and near the edge, minimizing contamination risk",
      "Consider the instrument non-sterile due to the packaging breach, reject it, and obtain a replacement from sterile processing or use immediate-use steam sterilization (IUSS) as a last resort",
      "Tape over the tear with sterile indicator tape and proceed with using the instrument",
      "Open the package, inspect the instrument visually for contamination, and use it if it appears clean"
    ],
    correctAnswer: 1,
    rationaleLong: "Any breach in the integrity of sterile packaging, regardless of size or location, renders the contents non-sterile. This is a fundamental principle of aseptic technique based on event-related sterility. A 2 mm tear in the wrapper creates a portal of entry for microorganisms, and the size of the tear does not correlate with the likelihood of contamination — even microscopic organisms can pass through small defects. The nurse must reject the instrument and obtain a replacement. If a replacement is not available from sterile processing, immediate-use steam sterilization (IUSS, formerly called flash sterilization) may be used as a last resort when the instrument is needed for an immediate patient procedure and no sterile alternative is available. However, IUSS should not be used for convenience or to compensate for inadequate instrument inventory. AORN guidelines state that IUSS should only be used when there is insufficient time to process by the preferred wrapped or container method. The nurse should also document the packaging breach and report it to sterile processing for quality improvement tracking. Taping over a tear does not restore sterility. Visual inspection cannot detect microbial contamination — sterility is determined by the integrity of the packaging and the sterilization process, not by visual appearance.",
    learningObjective: "Apply event-related sterility principles to packaging breaches and determine appropriate alternatives when sterile instruments are unavailable",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "packaging integrity",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "ANY packaging breach = non-sterile, regardless of tear size. IUSS is a last resort, not a routine convenience measure.",
    clinicalPearls: [
      "Any breach in sterile packaging renders the contents non-sterile — no exceptions based on tear size",
      "IUSS should only be used when no sterile alternative is available for an immediate patient need",
      "Sterility is determined by packaging integrity and process, not by visual inspection"
    ],
    safetyNote: "Report packaging breaches to sterile processing for quality tracking — recurring issues may indicate packaging, handling, or transport problems",
    distractorRationales: [
      "Small tears are sufficient for microbial passage — size does not determine contamination risk",
      "Taping over a breach does not restore sterility and creates a false sense of security",
      "Visual inspection cannot detect microbial contamination — this is a microbiological, not visual, assessment"
    ]
  },
  {
    stem: "A newly hired perioperative nurse asks about the proper method for opening a sterile gown pack on the back table. Which technique is correct?",
    options: [
      "Open the first flap toward yourself, then open the side flaps, and finally open the flap farthest from you",
      "Open the first flap away from yourself (farthest flap first), then open the side flaps, and finally open the flap nearest to you (toward yourself last)",
      "Open all four flaps simultaneously by grasping the center fold and pulling outward",
      "Open from any direction as long as you do not reach across the sterile field"
    ],
    correctAnswer: 1,
    rationaleLong: "The correct technique for opening a sterile wrapped package on a back table or Mayo stand follows a specific sequence designed to maintain sterility: (1) Open the first flap AWAY from yourself (farthest flap first) — this prevents you from reaching over the sterile contents to open subsequent flaps; (2) Open the side flaps next — grasping only the outer edges of the wrapper; (3) Open the flap NEAREST to you LAST — this allows you to step back as the final flap opens toward you, preventing the non-sterile wrapper edge from contacting your scrubs. This sequence ensures that you never reach over the exposed sterile contents, which would contaminate the field with shed skin particles, lint, and microorganisms from your arms and clothing. The 1-inch border rule also applies: the outer 1 inch of the sterile wrapper is considered non-sterile because it has been handled during the opening process. Only the inner surface of the wrapper and the contained sterile items are considered sterile. This opening technique is a fundamental skill taught in perioperative nursing education and is a critical component of maintaining the sterile field throughout the surgical procedure.",
    learningObjective: "Demonstrate correct technique for opening sterile wrapped packages to maintain aseptic technique",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "aseptic technique",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Open AWAY from yourself first (farthest flap), sides next, TOWARD yourself last. This prevents reaching over the sterile contents.",
    clinicalPearls: [
      "Opening sequence: farthest flap first, side flaps next, nearest flap last — prevents reaching over sterile contents",
      "The outer 1-inch border of the sterile wrapper is considered non-sterile",
      "Grasp only the outer edges of the wrapper — never touch the inner sterile surface"
    ],
    safetyNote: "Never reach over an opened sterile field — this is the most common cause of sterile field contamination during setup",
    distractorRationales: [
      "Opening toward yourself first would require reaching over the sterile contents to open the far flap",
      "Grasping the center fold would contaminate the sterile contents",
      "The opening sequence matters — it is specifically designed to prevent reaching over the sterile field"
    ]
  },
  {
    stem: "Ethylene oxide (EtO) gas sterilization is used for a flexible endoscope that cannot withstand steam sterilization. What is the MOST important post-sterilization step specific to EtO processing?",
    options: [
      "Immediate use of the instrument since EtO sterilization is complete at the end of the cycle",
      "Adequate aeration to allow dissipation of toxic EtO residuals from the device before patient use",
      "Rinsing the instrument with sterile water to remove EtO residue",
      "Applying a chemical neutralizer to inactivate remaining EtO gas"
    ],
    correctAnswer: 1,
    rationaleLong: "Ethylene oxide (EtO) gas sterilization is used for heat-sensitive and moisture-sensitive medical devices that cannot be processed by steam sterilization. EtO is a highly effective sterilant that penetrates packaging and device lumens, killing all microorganisms including bacterial spores. However, EtO is toxic, mutagenic, and carcinogenic, and residual EtO gas can be absorbed into the materials of the processed device. If these residuals are not adequately dissipated before patient use, they can cause adverse reactions ranging from tissue irritation and hemolysis to chemical burns and potentially serious systemic toxicity. The critical post-sterilization step is aeration — the process of allowing EtO residuals to dissipate from the sterilized items. Aeration can occur in a dedicated aeration cabinet (which uses elevated temperature and airflow to accelerate dissipation) or at ambient conditions (which takes much longer). Aeration times vary based on the device material, packaging, and whether mechanical aeration is used. Typical mechanical aeration at 50-60°C is 8-12 hours, while ambient aeration at room temperature may require 7 days or longer. The device must not be used until adequate aeration has been achieved. OSHA regulates occupational exposure to EtO, and sterile processing departments must have appropriate engineering controls (ventilation, monitoring) and personal protective equipment to protect workers from EtO exposure.",
    learningObjective: "Understand the importance of adequate aeration following ethylene oxide sterilization to prevent patient and staff exposure to toxic residuals",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "ethylene oxide sterilization",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "EtO sterilization requires adequate AERATION before use — 8-12 hours mechanical or up to 7 days ambient. Inadequate aeration causes toxic patient reactions.",
    clinicalPearls: [
      "EtO is effective for heat-sensitive items but requires aeration to remove toxic residuals",
      "Mechanical aeration: 50-60°C for 8-12 hours; ambient aeration: up to 7 days",
      "EtO is toxic, mutagenic, and carcinogenic — OSHA regulates occupational exposure limits"
    ],
    safetyNote: "Never use an EtO-sterilized device without verified adequate aeration — toxic residuals can cause chemical burns and hemolysis",
    distractorRationales: [
      "EtO-sterilized items cannot be used immediately — aeration is required to remove toxic residuals",
      "Rinsing with water does not adequately remove absorbed EtO residuals from device materials",
      "There is no chemical neutralizer used post-EtO sterilization — aeration is the established method"
    ]
  },
  {
    stem: "A perioperative nurse is performing a Bowie-Dick test at the beginning of the day before running patient loads in the prevacuum sterilizer. The test results show an uneven color change with a lighter area in the center of the test sheet. What does this result indicate?",
    options: [
      "Normal results — minor color variation is expected and the sterilizer can be used",
      "Air removal failure in the prevacuum sterilizer — the sterilizer must not be used for patient loads until the issue is identified and corrected",
      "The test sheet was expired and should be replaced with a new one, then the test repeated",
      "The sterilizer temperature is too high and needs to be recalibrated"
    ],
    correctAnswer: 1,
    rationaleLong: "The Bowie-Dick test is a daily air removal test performed specifically on prevacuum (dynamic air removal) steam sterilizers. Its purpose is to verify that the vacuum system is effectively removing air from the chamber before steam is introduced. Adequate air removal is critical because trapped air pockets prevent steam from contacting surfaces, resulting in non-sterile areas within the load. The test consists of a standardized test pack placed in a specific location in an otherwise empty sterilizer and run through a standard cycle. After the cycle, the chemical indicator sheet inside the test pack is examined. A passing result shows uniform color change across the entire sheet, indicating that steam penetrated evenly throughout the test pack. A failing result shows uneven color change — typically a lighter or unchanged area in the center of the sheet, indicating that an air pocket was trapped in the center and steam did not reach that area. A failed Bowie-Dick test means the prevacuum sterilizer has an air leak or vacuum pump malfunction and must NOT be used for patient loads until the problem is identified and repaired. The sterilizer should be taken out of service, the biomedical engineering department notified, and all items from the most recent load (if any) should be recalled and reprocessed. The Bowie-Dick test is not performed on gravity displacement sterilizers (which do not use vacuum for air removal).",
    learningObjective: "Interpret Bowie-Dick test results and take appropriate action when air removal failure is detected in a prevacuum sterilizer",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterilizer testing",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Bowie-Dick test = air removal test for PREVACUUM sterilizers only. Uneven color change = FAIL = sterilizer must be taken out of service.",
    clinicalPearls: [
      "Bowie-Dick test: daily air removal test for prevacuum sterilizers — performed first thing each day in an empty chamber",
      "Pass: uniform color change across entire sheet. Fail: uneven change with lighter area in center",
      "Failed Bowie-Dick = sterilizer out of service until repaired — all loads from that sterilizer must be questioned"
    ],
    safetyNote: "Never skip the daily Bowie-Dick test — air removal failure means instruments processed in that sterilizer may not be sterile",
    distractorRationales: [
      "Uneven color change is NOT normal — it indicates air removal failure and the sterilizer must not be used",
      "Expired test sheets would show no color change at all, not a specifically patterned uneven change",
      "The issue is air removal failure, not temperature — the Bowie-Dick test specifically assesses vacuum function"
    ]
  },
  {
    stem: "A surgeon requests immediate-use steam sterilization (IUSS) of a dropped instrument during a total knee arthroplasty involving implant placement. The circulating nurse should be aware that which consideration is MOST critical regarding IUSS for implant procedures?",
    options: [
      "IUSS is never permitted for any instrument used in implant procedures",
      "IUSS may be used for implant procedures but the biological indicator rapid-readout result should be available before the implant is placed, and IUSS should only be used when no sterile alternative exists",
      "IUSS is the preferred method for all orthopedic instruments due to faster turnaround",
      "IUSS requires the same cycle time as a standard wrapped cycle and offers no time advantage"
    ],
    correctAnswer: 1,
    rationaleLong: "Immediate-use steam sterilization (IUSS), formerly known as flash sterilization, is a method of steam sterilization designed for items that are needed immediately and cannot wait for a full wrapped sterilization cycle. AORN guidelines state that IUSS should only be used when there is an urgent patient need and no sterile alternative is available — it should never be used for convenience, to compensate for inadequate instrument inventory, or as a routine sterilization method. For procedures involving implants, IUSS carries additional scrutiny because implant-related infections can be devastating and difficult to treat, often requiring removal of the implant. Current guidelines allow IUSS for implant procedures but require that: (1) A rapid-readout biological indicator (BI) is run with the IUSS cycle; (2) The BI result must be available before the implant is placed (rapid-readout BIs provide results in approximately 1-3 hours); (3) The decision to use IUSS is documented including the reason it was necessary; (4) A multivariable sterilization monitoring system is used (physical, chemical, and biological monitoring). If a rapid-readout BI result cannot be obtained before the implant is placed, the surgical team must weigh the risks and benefits and document the rationale for proceeding.",
    learningObjective: "Apply AORN guidelines for immediate-use steam sterilization in implant procedures with appropriate biological monitoring",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "immediate-use steam sterilization",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "IUSS is NOT prohibited for implants but requires a rapid-readout biological indicator result before the implant is placed.",
    clinicalPearls: [
      "IUSS for implants: biological indicator result must be available before implant placement",
      "IUSS should only be used when no sterile alternative exists — never for convenience or routine use",
      "Document the reason IUSS was necessary in the operative record"
    ],
    safetyNote: "IUSS-processed items are not wrapped and must be transported directly to the sterile field — they cannot be stored for later use",
    distractorRationales: [
      "IUSS is not absolutely prohibited for implant procedures — it is permitted with additional biological monitoring",
      "IUSS is NOT the preferred method — wrapped sterilization is always preferred when time permits",
      "IUSS does have shorter cycle times than standard wrapped sterilization — that is its purpose"
    ]
  },
  {
    stem: "A perioperative nurse is educating a new staff member about the proper handling of glutaraldehyde (Cidex) for high-level disinfection of endoscopes. Which safety precaution is MOST important to emphasize?",
    options: [
      "Glutaraldehyde can be used at room temperature without any ventilation requirements",
      "Adequate ventilation is essential because glutaraldehyde vapors can cause respiratory sensitization, eye irritation, and occupational asthma — the OSHA ceiling limit is 0.05 ppm",
      "Glutaraldehyde is non-toxic and requires only standard gloves for handling",
      "Glutaraldehyde solutions never expire and maintain potency indefinitely once activated"
    ],
    correctAnswer: 1,
    rationaleLong: "Glutaraldehyde (commonly marketed as Cidex) is a high-level disinfectant used for reprocessing heat-sensitive semi-critical devices such as flexible endoscopes. While effective as a germicide, glutaraldehyde poses significant occupational health hazards. It is a known respiratory sensitizer that can cause occupational asthma, respiratory irritation, skin sensitization (contact dermatitis), and eye irritation. OSHA has established a ceiling exposure limit of 0.05 ppm for glutaraldehyde vapor. To meet this limit, glutaraldehyde must be used in well-ventilated areas, ideally under a fume hood or in an automated endoscope reprocessor (AER) with a sealed system. Additional safety measures include: wearing nitrile or butyl rubber gloves (latex gloves do not provide adequate protection), wearing eye protection (splash goggles or face shield), monitoring air levels with dosimetry, and having spill cleanup procedures in place. Glutaraldehyde solutions are activated by adding the activating agent and have a limited use life (typically 14-28 days after activation, depending on the formulation). The solution's minimum effective concentration (MEC) must be tested before each use with appropriate test strips. If the concentration falls below the MEC, the solution must be discarded even if it has not reached its expiration date.",
    learningObjective: "Implement appropriate safety precautions for glutaraldehyde handling to prevent occupational exposure and health effects",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "chemical disinfection safety",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "OSHA ceiling limit for glutaraldehyde: 0.05 ppm. Must use under ventilation/fume hood. Test MEC before EVERY use with test strips.",
    clinicalPearls: [
      "OSHA glutaraldehyde ceiling: 0.05 ppm — requires adequate ventilation or fume hood",
      "Glutaraldehyde causes respiratory sensitization, contact dermatitis, and occupational asthma",
      "Test minimum effective concentration (MEC) before each use — discard if below MEC"
    ],
    safetyNote: "Report any symptoms of glutaraldehyde exposure (respiratory irritation, skin rash, eye irritation) to occupational health immediately",
    distractorRationales: [
      "Adequate ventilation is absolutely required — glutaraldehyde cannot be used without it",
      "Glutaraldehyde is toxic — nitrile or butyl rubber gloves, eye protection, and ventilation are all required",
      "Activated glutaraldehyde solutions have a limited use life (14-28 days) and must be tested before each use"
    ]
  },
  {
    stem: "During an arthroscopic knee procedure, a power instrument falls off the sterile field to the floor. The surgeon needs the instrument to complete the procedure. What is the most appropriate immediate action?",
    options: [
      "Pick up the instrument, wipe it with an alcohol pad, and return it to the sterile field",
      "Obtain an identical sterile instrument from the backup supply; if unavailable, the dropped instrument may be processed through immediate-use steam sterilization (IUSS) after proper cleaning",
      "Rinse the instrument under running water and return it to the sterile field since it was only on the floor briefly",
      "Have a non-scrubbed team member hold the instrument while the circulating nurse sprays it with disinfectant"
    ],
    correctAnswer: 1,
    rationaleLong: "When an instrument falls off the sterile field, it is immediately considered contaminated regardless of the surface it fell on, the duration of contact, or any cleaning that might be performed at the bedside. The contaminated instrument cannot be returned to the sterile field without proper reprocessing. The first and preferred option is to obtain an identical sterile replacement instrument from the backup supply in the operating room or from central sterile processing. This is why adequate instrument inventory and backup sets are important. If no sterile replacement is available and the instrument is critically needed to complete the procedure, immediate-use steam sterilization (IUSS) may be performed as a last resort. However, the instrument must first be properly cleaned (decontaminated) in the decontamination area per the instrument manufacturer's instructions for use (IFU) before it can be sterilized. Simply wiping with an alcohol pad, rinsing under water, or spraying with disinfectant does NOT constitute proper decontamination or sterilization. Proper decontamination involves enzymatic cleaning to remove bioburden, followed by rinsing and inspection before the IUSS cycle. The circulating nurse should document the event, the actions taken, and the IUSS monitoring results.",
    learningObjective: "Apply sterile technique principles when instruments are contaminated by falling off the sterile field",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "contamination management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Dropped instrument = contaminated. Must be properly cleaned BEFORE IUSS. Wiping with alcohol does NOT sterilize.",
    clinicalPearls: [
      "Any instrument that leaves the sterile field is contaminated — no bedside cleaning restores sterility",
      "First choice: sterile replacement. Last resort: proper cleaning + IUSS",
      "IUSS requires prior decontamination — you cannot IUSS a dirty instrument"
    ],
    safetyNote: "Maintain adequate backup instrument inventory to minimize the need for IUSS during surgical procedures",
    distractorRationales: [
      "Alcohol wiping does not sterilize an instrument — it is inadequate for surgical use",
      "Rinsing under water removes visible debris but does not achieve sterility",
      "Spraying with disinfectant does not achieve sterilization and the instrument cannot return to the sterile field"
    ]
  }
];
