import type { PerioperativeQuestion } from "./types";

export const sterilizationBatch2Questions: PerioperativeQuestion[] = [
  {
    stem: "A sterile processing technician is loading a steam sterilizer (autoclave). The technician places a heavy instrument tray on top of a wrapped textile pack. What is the concern with this loading practice?",
    options: [
      "No concern — heavy items on top provide better steam contact",
      "Heavy items placed on top of textile packs can compress the fabric, prevent steam penetration, and create wet packs — textile packs should be placed on the top shelf with metal trays below or on edge",
      "The only concern is that the textile pack may tear from the weight",
      "Heavy items should always be placed on top to ensure even heat distribution"
    ],
    correctAnswer: 1,
    rationaleLong: "Proper loading of the steam sterilizer is critical for effective sterilization and prevention of wet packs. The loading configuration directly affects steam circulation, penetration, and drying. When heavy metal instrument trays are placed on top of textile packs, several problems occur: (1) Compression of the textile fibers prevents adequate steam penetration — steam must contact all surfaces for sterilization to occur; (2) Condensate (water) from the metal tray drips down onto the textile pack, creating a wet pack — wet packs are considered contaminated because moisture provides a pathway for microorganisms to wick through the wrapping material (strike-through contamination); (3) The compressed textile pack may not dry properly during the drying phase, further contributing to wet pack formation. AAMI (Association for the Advancement of Medical Instrumentation) and AORN guidelines recommend: placing textile packs on the TOP shelf of the sterilizer (since condensate drips down); placing metal instrument trays on lower shelves or on their sides (tilted) to allow water to drain off rather than pool; not overloading the sterilizer — items should not touch the chamber walls; allowing space between items for steam circulation; and placing basin sets on their sides to prevent water pooling. Wet packs must be considered non-sterile and reprocessed.",
    learningObjective: "Apply proper sterilizer loading principles to prevent wet packs and ensure effective steam sterilization",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterilizer loading",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Textiles on TOP shelf, metals BELOW or on edge. Heavy items on textiles = compression + condensate = wet packs = non-sterile.",
    clinicalPearls: [
      "Textiles on top shelf, metal trays below or tilted on edge — prevents condensate dripping on textiles",
      "Wet packs are considered contaminated and must be reprocessed",
      "Basin sets should be placed on their sides to prevent water pooling"
    ],
    safetyNote: "Wet packs must NEVER be used — moisture wicks microorganisms through wrapping material via strike-through contamination",
    distractorRationales: [
      "Heavy items on top compress textiles and create wet packs — this is incorrect loading",
      "The primary concern is sterilization failure and wet packs, not just tearing",
      "Heat distribution requires proper spacing and steam circulation, not weight stacking"
    ]
  },
  {
    stem: "The perioperative nurse is reviewing the biological indicator (BI) results from the morning sterilizer load. The BI from a prevacuum steam sterilizer shows a positive result (growth). What is the IMMEDIATE action?",
    options: [
      "Repeat the BI test to confirm — a single positive result may be a false positive",
      "Immediately recall ALL items from the load associated with the positive BI, quarantine the sterilizer until the cause is identified and corrective actions are completed, and notify the infection preventionist",
      "Continue using the sterilizer since chemical indicators on the packages showed acceptable results",
      "Document the positive result and continue normal operations"
    ],
    correctAnswer: 1,
    rationaleLong: "A positive biological indicator (growth of the test organism, typically Geobacillus stearothermophilus for steam sterilization) is the most definitive evidence of sterilization failure. The biological indicator is the gold standard for sterilization monitoring because it directly tests whether the sterilization conditions were sufficient to kill highly resistant bacterial spores. When a positive BI occurs, the response must be immediate and comprehensive: (1) RECALL all items from the suspect load that have not been used — these items must be considered non-sterile and must be reprocessed; (2) If items from the suspect load have already been used on patients, notify the infection preventionist and surgeon so that appropriate patient monitoring and notification can occur; (3) QUARANTINE the sterilizer — it must not be used until the cause of the failure is identified and corrected; (4) Investigate the cause — review mechanical indicators (time, temperature, pressure printouts), chemical indicator results, sterilizer maintenance records, and loading practices; (5) After the cause is identified and corrected, run three consecutive empty-chamber BI cycles — all must be negative before the sterilizer is returned to service; (6) Document the entire event including the investigation, corrective actions, and return-to-service testing. Chemical indicators (CIs) alone are NOT sufficient to confirm sterilization — they only indicate that certain sterilization parameters were met, but they do not confirm microbial kill.",
    learningObjective: "Respond to a positive biological indicator with immediate recall, sterilizer quarantine, investigation, and return-to-service protocols",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "sterilization monitoring",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Positive BI = sterilization failure. Immediate recall of all items from the load. Sterilizer quarantined. Three consecutive negative BI cycles before return to service.",
    clinicalPearls: [
      "Positive BI: recall items, quarantine sterilizer, investigate cause, notify infection preventionist",
      "Three consecutive negative BI cycles required before sterilizer returns to service",
      "Chemical indicators are NOT sufficient to confirm sterilization — BI is the gold standard"
    ],
    safetyNote: "Items from a suspect load already used on patients require infection preventionist notification and potential patient follow-up",
    distractorRationales: [
      "A positive BI requires immediate action — waiting for repeat testing delays critical recall",
      "Chemical indicators do not confirm sterilization — they are supplementary, not sufficient",
      "Documenting without action is unacceptable — patient safety requires immediate recall and investigation"
    ]
  },
  {
    stem: "A perioperative nurse is preparing to use a rigid container system for steam sterilization of a laparoscopic instrument set. What is a critical checkpoint that must be verified BEFORE loading the container into the sterilizer?",
    options: [
      "The weight of the container must be measured on a scale",
      "The container filter or valve mechanism must be inspected to ensure it is intact, clean, undamaged, and properly seated — a compromised filter/valve prevents adequate steam penetration or allows recontamination after sterilization",
      "The instruments inside must be wrapped in an additional layer of blue wrap",
      "The container must be pre-heated in a warming cabinet before loading"
    ],
    correctAnswer: 1,
    rationaleLong: "Rigid container systems are reusable sterilization containers made of anodized aluminum or stainless steel that serve as an alternative to traditional wrapping materials (blue wrap, peel pouches). They are widely used for instrument sets because they are durable, environmentally friendly, and provide consistent barrier protection. However, their sterilization effectiveness depends entirely on the integrity of their filter or valve mechanism. The filter (either a single-use disposable filter or a reusable valve-type filter) is the critical component that allows steam penetration during sterilization while maintaining a microbial barrier after sterilization. Before loading, the nurse or sterile processing technician must verify: (1) The filter is the correct type and size for the container model; (2) The filter is intact — no tears, holes, or wet spots in disposable filters; no visible damage, debris, or improper seating in valve-type filters; (3) The filter retention plate or frame is properly secured; (4) The gasket (silicone seal around the container lid) is intact, flexible, and properly seated — a damaged gasket allows air leak and potential contamination; (5) The container body and lid are clean, undamaged, and latches function properly. A compromised filter or gasket can result in either sterilization failure (steam cannot enter) or recontamination after sterilization (microorganisms can enter through the compromised barrier).",
    learningObjective: "Verify rigid container system integrity before sterilization by inspecting filters, gaskets, and latch mechanisms",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "container systems",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Rigid containers depend on filter/valve and gasket integrity. Inspect BEFORE every sterilization cycle. Damaged filter = sterilization failure or recontamination.",
    clinicalPearls: [
      "Container filter/valve allows steam entry during sterilization and provides microbial barrier after",
      "Inspect: filter integrity, gasket flexibility/seating, latch function, and container body/lid condition",
      "Disposable filters: check for tears, holes, moisture; valve filters: check seating and debris"
    ],
    safetyNote: "Never use a rigid container with a damaged filter or gasket — the sterile barrier is compromised and the contents must be considered non-sterile",
    distractorRationales: [
      "Weight measurement is not a standard pre-sterilization checkpoint for containers",
      "Instruments are placed directly in the container tray — additional wrapping defeats the container's purpose",
      "Pre-heating is not required or recommended — the sterilizer provides the necessary temperature"
    ]
  },
  {
    stem: "A nurse is performing high-level disinfection (HLD) of a flexible bronchoscope using glutaraldehyde (Cidex). What is the minimum contact time required for high-level disinfection with 2.4% glutaraldehyde at 25°C?",
    options: [
      "5 minutes of soaking",
      "20 minutes of complete immersion at 25°C as specified by the manufacturer and validated per AAMI/SGNA guidelines",
      "2 minutes of wiping with a glutaraldehyde-soaked cloth",
      "60 minutes — the same as sterilization"
    ],
    correctAnswer: 1,
    rationaleLong: "High-level disinfection (HLD) with glutaraldehyde requires strict adherence to manufacturer-specified contact times to achieve effective microbial kill. For 2.4% glutaraldehyde (Cidex) at 25°C, the FDA-cleared minimum contact time for high-level disinfection is 20 minutes of COMPLETE IMMERSION. This means every surface of the device, including all internal channels and lumens, must be in contact with the solution for the full 20 minutes. Key principles of glutaraldehyde HLD include: (1) COMPLETE IMMERSION — the scope must be fully submerged with all channels perfused to eliminate air pockets; (2) Temperature matters — the contact time is validated at a specific temperature (typically 25°C/77°F); lower temperatures may require longer contact times; (3) Solution concentration must be verified before each use with a minimum effective concentration (MEC) test strip — if the glutaraldehyde concentration has dropped below the MEC (typically 1.5% for Cidex), the solution must be discarded even if within the use-life period; (4) Thorough pre-cleaning before HLD is essential — organic debris (blood, tissue, secretions) can shield microorganisms from the disinfectant and must be mechanically removed during the cleaning step; (5) Thorough rinsing after HLD removes residual glutaraldehyde, which is toxic and can cause mucosal irritation. HLD kills all microorganisms except high numbers of bacterial spores. For sterilization with glutaraldehyde, 10 hours of contact is typically required.",
    learningObjective: "Apply correct glutaraldehyde high-level disinfection contact time and technique for flexible endoscope reprocessing",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "high-level disinfection",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Glutaraldehyde HLD: 20 minutes complete immersion at 25°C. Verify MEC with test strip before each use. HLD ≠ sterilization (which requires 10 hours).",
    clinicalPearls: [
      "Glutaraldehyde 2.4% HLD: 20 minutes complete immersion at 25°C",
      "Verify minimum effective concentration (MEC) with test strip before each use",
      "Pre-cleaning is essential — organic debris shields microorganisms from the disinfectant"
    ],
    safetyNote: "Glutaraldehyde is toxic — use in a well-ventilated area, wear appropriate PPE, and ensure thorough rinsing after HLD to prevent patient mucosal injury",
    distractorRationales: [
      "5 minutes is insufficient for effective HLD — complete microbial kill requires 20 minutes",
      "Wiping does not constitute complete immersion and does not reach internal channels",
      "60 minutes approaches but does not reach the 10 hours required for sterilization with glutaraldehyde"
    ]
  },
  {
    stem: "A new perioperative nurse asks about the difference between sterilization and high-level disinfection. Which statement BEST describes this difference?",
    options: [
      "There is no practical difference — both terms describe the same process",
      "Sterilization destroys ALL microorganisms including bacterial spores, while high-level disinfection destroys all microorganisms EXCEPT high numbers of bacterial spores",
      "High-level disinfection is more effective than sterilization because it uses chemical agents",
      "Sterilization is used for non-critical items while high-level disinfection is for critical items"
    ],
    correctAnswer: 1,
    rationaleLong: "The distinction between sterilization and high-level disinfection is fundamental to instrument reprocessing in the perioperative setting. Sterilization is defined as the complete elimination or destruction of ALL forms of microbial life, including the most resistant bacterial endospores (such as Geobacillus stearothermophilus and Bacillus atrophaeus). Sterilization is required for all critical medical devices — those that enter sterile body tissues or the vascular system (surgical instruments, implants, cardiac catheters). Methods include steam (autoclave), ethylene oxide (EO), hydrogen peroxide gas plasma (Sterrad), and vaporized hydrogen peroxide. High-level disinfection (HLD) destroys all microorganisms including mycobacteria, fungi, and viruses, EXCEPT high numbers of bacterial spores. HLD is used for semi-critical medical devices — those that contact mucous membranes or non-intact skin (endoscopes, laryngoscope blades, respiratory therapy equipment). Methods include glutaraldehyde, ortho-phthalaldehyde (OPA), peracetic acid, and hydrogen peroxide-based solutions. The Spaulding Classification system guides this decision: Critical items → sterilization; Semi-critical items → HLD minimum; Non-critical items → low-level disinfection. Understanding this hierarchy is essential for proper instrument reprocessing and infection prevention.",
    learningObjective: "Differentiate between sterilization and high-level disinfection based on microbial kill spectrum and apply the Spaulding Classification for reprocessing decisions",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "reprocessing hierarchy",
    difficulty: 1,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Sterilization = ALL microorganisms including spores. HLD = all microorganisms EXCEPT high numbers of spores. Spaulding: Critical → sterilization; Semi-critical → HLD.",
    clinicalPearls: [
      "Sterilization destroys ALL microorganisms including bacterial spores",
      "HLD destroys all microorganisms except high numbers of bacterial spores",
      "Spaulding Classification: critical (sterile tissue) → sterilize; semi-critical (mucous membranes) → HLD"
    ],
    safetyNote: "Semi-critical items that contact mucous membranes require HLD at minimum — low-level disinfection is insufficient",
    distractorRationales: [
      "Sterilization and HLD are distinct processes with different microbial kill spectrums",
      "Sterilization is more complete than HLD — it eliminates bacterial spores that HLD does not",
      "The Spaulding Classification is the opposite: critical items require sterilization, not just HLD"
    ]
  },
  {
    stem: "An OR nurse opens a sterile package and notices the internal chemical indicator strip has not changed to the expected color. The external chemical indicator on the package appears to have changed appropriately. What should the nurse do?",
    options: [
      "Use the instruments since the external indicator changed correctly",
      "Do NOT use the contents — the unchanged internal chemical indicator suggests the sterilization conditions inside the package may not have been met, even though the external indicator changed. Remove the package from the field and report to sterile processing",
      "Dip the internal indicator in saline to activate the color change",
      "The internal indicator is not important if the external indicator passed"
    ],
    correctAnswer: 1,
    rationaleLong: "Chemical indicators (CIs) are categorized by the AAMI into six classes, each with a different level of monitoring sensitivity. External CIs (typically Class 1, process indicators) are placed on the outside of the package to indicate that the package was exposed to a sterilization process (they differentiate processed from unprocessed items), but they do NOT confirm that sterilization conditions were achieved inside the package. Internal CIs (typically Class 4 multi-parameter or Class 5 integrating indicators) are placed inside the package to verify that sterilization conditions (time, temperature, and steam or sterilant contact) were achieved at the point of the indicator inside the package. When the internal CI has not changed to the expected color or pattern, it indicates that one or more sterilization parameters were not met at that location inside the package. This can occur due to: inadequate steam penetration (trapped air, overloading), incorrect sterilizer settings, sterilizer malfunction, or wrapping technique that impeded steam contact. The entire package must be considered non-sterile and must not be used. The nurse should: (1) Remove the package from the sterile field; (2) Notify the sterile processing department; (3) Investigate the cause — check other packages from the same load; (4) Obtain replacement instruments from a different source.",
    learningObjective: "Respond correctly to an unchanged internal chemical indicator by removing the package from the sterile field and reporting to sterile processing",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "chemical indicators",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "External CI ≠ sterilization confirmation. Internal CI failure = do NOT use the contents. External CI only shows the package was processed, not that conditions were met inside.",
    clinicalPearls: [
      "External CI (Class 1): indicates the package was processed — does NOT confirm internal sterilization",
      "Internal CI (Class 4/5): verifies sterilization conditions were met INSIDE the package",
      "An unchanged internal CI means sterilization parameters were not met — contents are non-sterile"
    ],
    safetyNote: "ALWAYS check the internal chemical indicator when opening a sterile package — never rely solely on the external indicator",
    distractorRationales: [
      "External indicator passing does not guarantee internal sterilization conditions were met",
      "Chemical indicators are heat/chemical-activated and cannot be artificially activated with saline",
      "Internal indicators are essential — they verify conditions at the point of use inside the package"
    ]
  },
  {
    stem: "The perioperative nurse is selecting the appropriate Spaulding classification for a reusable laryngeal mask airway (LMA). How should this device be classified and reprocessed?",
    options: [
      "Non-critical item — wipe with low-level disinfectant between patients",
      "Semi-critical item — contacts mucous membranes and requires high-level disinfection at minimum, though many facilities sterilize reusable LMAs per manufacturer IFU",
      "Critical item — requires sterilization before every use because it enters sterile tissue",
      "No reprocessing needed — LMAs are single-use only"
    ],
    correctAnswer: 1,
    rationaleLong: "The Spaulding Classification system categorizes medical devices based on the degree of infection risk associated with their use: Critical items contact sterile tissue or the vascular system (surgical instruments, implants) and require sterilization; Semi-critical items contact mucous membranes or non-intact skin (endoscopes, LMAs, respiratory equipment) and require high-level disinfection at minimum; Non-critical items contact only intact skin (blood pressure cuffs, stethoscopes) and require low-level disinfection. A reusable laryngeal mask airway (LMA) contacts the oropharyngeal and laryngeal mucous membranes, classifying it as a semi-critical device requiring high-level disinfection at minimum. However, many facilities choose to sterilize reusable LMAs (using steam autoclave per manufacturer's IFU, which specifies the number of sterilization cycles the device can undergo before mandatory replacement) as this provides a higher level of assurance than HLD. The key principle is that the reprocessing method must meet or exceed the minimum Spaulding classification requirement AND must follow the manufacturer's instructions for use (IFU) for that specific device.",
    learningObjective: "Apply the Spaulding Classification to correctly categorize and reprocess reusable airway devices",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "Spaulding classification",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "LMA contacts mucous membranes = semi-critical = HLD minimum. Many facilities sterilize reusable LMAs per manufacturer IFU for higher assurance.",
    clinicalPearls: [
      "Spaulding: Critical (sterile tissue) → sterilize; Semi-critical (mucous membranes) → HLD minimum; Non-critical (intact skin) → LLD",
      "LMAs are semi-critical devices — HLD minimum, sterilization preferred if manufacturer IFU permits",
      "Always follow manufacturer IFU for maximum number of reprocessing cycles for reusable devices"
    ],
    safetyNote: "Exceeding the manufacturer's maximum number of sterilization cycles for reusable devices can compromise device integrity and patient safety",
    distractorRationales: [
      "LMAs contact mucous membranes — low-level disinfection is insufficient (that is for non-critical items)",
      "LMAs contact mucous membranes, not sterile tissue, making them semi-critical rather than critical",
      "Reusable LMAs exist — they are designed for multiple uses with proper reprocessing between patients"
    ]
  },
  {
    stem: "A sterile processing technician is testing the minimum effective concentration (MEC) of an ortho-phthalaldehyde (OPA) high-level disinfectant solution. The test strip indicates the solution is below the MEC. The solution is only 10 days into its 14-day use life. What should the technician do?",
    options: [
      "Continue using the solution since it is within the use-life period",
      "Discard the solution and replace it with fresh OPA — the solution must be discarded whenever the MEC test indicates the concentration has dropped below the effective level, regardless of the remaining use-life days",
      "Add more concentrate to bring the solution back to the correct concentration",
      "Switch to glutaraldehyde to extend the use life"
    ],
    correctAnswer: 1,
    rationaleLong: "High-level disinfectant solutions are monitored by two parameters: use-life and minimum effective concentration (MEC). Use-life is the maximum number of days the solution can be used after activation (typically 14 days for OPA, 14-28 days for glutaraldehyde depending on formulation). MEC is the minimum concentration of active ingredient required for effective high-level disinfection. Both parameters must be met — if either criterion fails, the solution must be discarded. In this scenario, the solution is within its use-life (day 10 of 14) but has fallen below MEC. This can happen because: repeated immersion of devices introduces organic matter that reacts with and consumes the active chemical; dilution occurs from water carried over on devices; and evaporation concentrates or depletes the solution depending on conditions. The solution MUST be discarded because a below-MEC solution cannot reliably kill all target organisms. Key principles: (1) Test MEC before EACH use (not just at the beginning of the day); (2) A solution that fails MEC testing is unsafe regardless of remaining use-life; (3) Adding concentrate to a depleted solution is NOT acceptable — the solution composition and pH are altered, and the original validation no longer applies; (4) Document MEC testing results for each use as part of the quality control log.",
    learningObjective: "Apply MEC testing principles to determine when high-level disinfectant solutions must be discarded, regardless of use-life status",
    blueprintCategory: "Sterilization and Disinfection",
    subtopic: "disinfectant monitoring",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MEC test and use-life are INDEPENDENT criteria — BOTH must pass. Below MEC = discard immediately, even if use-life has days remaining.",
    clinicalPearls: [
      "Both MEC AND use-life must be met — failure of either criterion requires solution disposal",
      "Test MEC before each use, not just daily",
      "Topping off or adding concentrate to depleted solution is NOT acceptable practice"
    ],
    safetyNote: "Using a below-MEC solution for HLD is a sterilization/disinfection failure that can lead to patient infection from inadequately reprocessed devices",
    distractorRationales: [
      "Use-life alone is insufficient — if MEC fails, the solution cannot reliably disinfect regardless of days remaining",
      "Adding concentrate changes the solution composition and invalidates the original efficacy validation",
      "Switching agents does not address the need to discard the depleted solution and begin fresh"
    ]
  }
];
