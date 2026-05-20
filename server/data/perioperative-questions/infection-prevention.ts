import type { PerioperativeQuestion } from "./types";

export const infectionPreventionQuestions: PerioperativeQuestion[] = [
  {
    stem: "According to SCIP (Surgical Care Improvement Project) guidelines, when should prophylactic antibiotics be administered before a surgical incision to maximize surgical site infection prevention?",
    options: [
      "Within 2 hours before surgical incision for all antibiotics",
      "Within 60 minutes before surgical incision for most antibiotics, or within 120 minutes for vancomycin and fluoroquinolones due to their longer infusion times",
      "Immediately at the time of incision, not before",
      "The evening before surgery to ensure peak tissue levels"
    ],
    correctAnswer: 1,
    rationaleLong: "The timing of prophylactic antibiotic administration is one of the most critical factors in preventing surgical site infections (SSIs). The SCIP guidelines and the Centers for Medicare and Medicaid Services (CMS) quality measures specify that prophylactic antibiotics should be administered within 60 minutes before surgical incision for most antibiotics. This timing ensures that adequate tissue concentrations of the antibiotic are present at the time of incision when the wound is most vulnerable to bacterial contamination. For vancomycin and fluoroquinolones, which require longer infusion times (vancomycin must be infused over at least 60 minutes to prevent red man syndrome), the window is extended to within 120 minutes before incision. Administration too early results in declining tissue levels at the time of incision, while administration too late means the antibiotic has not yet reached therapeutic tissue concentrations. The antibiotic should be completely infused before tourniquet inflation (if applicable) and before incision. Redosing during surgery is recommended for prolonged procedures (when the duration exceeds two half-lives of the antibiotic) or when blood loss exceeds 1,500 mL. Prophylactic antibiotics should be discontinued within 24 hours after surgery (48 hours for cardiac surgery) — prolonged courses do not reduce SSI rates and contribute to antimicrobial resistance.",
    learningObjective: "Apply evidence-based timing for prophylactic antibiotic administration to maximize SSI prevention",
    blueprintCategory: "Infection Prevention",
    subtopic: "antibiotic prophylaxis timing",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Most antibiotics: within 60 minutes before incision. Vancomycin/fluoroquinolones: within 120 minutes. Discontinue within 24 hours after surgery.",
    clinicalPearls: [
      "Most antibiotics: administer within 60 min of incision; vancomycin/fluoroquinolones: within 120 min",
      "Redose during surgery if procedure exceeds 2 half-lives of the antibiotic or blood loss >1,500 mL",
      "Discontinue prophylactic antibiotics within 24 hours after surgery (48 hours for cardiac surgery)"
    ],
    safetyNote: "Late or missed prophylactic antibiotics are a preventable cause of SSI — verify administration before incision",
    distractorRationales: [
      "The 2-hour window applies only to vancomycin and fluoroquinolones, not all antibiotics",
      "Administration at the time of incision is too late — tissue concentrations are not yet therapeutic",
      "Evening-before administration results in subtherapeutic tissue levels at the time of incision"
    ]
  },
  {
    stem: "The circulating nurse is preparing for a total knee arthroplasty. The patient's skin preparation has been applied using a chlorhexidine-alcohol solution. What is the correct application technique?",
    options: [
      "Apply in a circular motion starting from the incision site and moving outward, using light strokes",
      "Apply with firm, repeated back-and-forth strokes for at least 30 seconds on dry skin and 2 minutes on moist skin, allow to dry completely for at least 3 minutes",
      "Apply in a single swipe from one end of the surgical site to the other",
      "Apply the solution and immediately begin draping while the prep is still wet"
    ],
    correctAnswer: 1,
    rationaleLong: "Chlorhexidine gluconate (CHG) combined with isopropyl alcohol is the preferred skin antiseptic for most surgical procedures (except those near the eyes or ears, where CHG is contraindicated due to ototoxicity and corneal damage). The correct application technique for CHG-alcohol prep involves: (1) Using firm, repeated back-and-forth (friction) strokes — this mechanical action is essential for disrupting skin flora and biofilm. Light strokes do not provide adequate friction for antisepsis. (2) The recommended scrub time is at least 30 seconds on dry/hairless skin and 2 minutes on moist or hair-bearing skin. The friction and dwell time allow the CHG to bind to the stratum corneum and provide persistent antimicrobial activity. (3) Allow the prep to dry completely — this is critical for two reasons: the alcohol component must evaporate to achieve full antiseptic effect, and wet alcohol-based prep under drapes creates a fire hazard. Minimum drying time is 3 minutes on hairless skin, but longer in hair-bearing areas or body folds where pooling can occur. The traditional circular motion (clean-to-dirty, starting at the incision site and moving outward) is recommended for iodine-based preps but NOT for CHG-alcohol preps, which use the back-and-forth friction technique. CHG provides both immediate and persistent (residual) antimicrobial activity, making it superior to iodine-based preps for sustained skin antisepsis.",
    learningObjective: "Apply correct surgical skin preparation technique for chlorhexidine-alcohol antiseptic agents",
    blueprintCategory: "Infection Prevention",
    subtopic: "surgical skin preparation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CHG-alcohol uses BACK-AND-FORTH friction strokes (not circular motion). Must dry completely (min 3 min) before draping. CHG contraindicated near eyes/ears.",
    clinicalPearls: [
      "CHG-alcohol: back-and-forth friction strokes, 30 sec dry skin / 2 min moist skin, dry completely ≥3 min",
      "Iodine preps use circular motion from incision outward; CHG uses back-and-forth technique",
      "CHG is contraindicated near eyes (corneal damage) and ears (ototoxicity)"
    ],
    safetyNote: "Wet alcohol-based prep under drapes is a fire hazard — verify complete drying before draping and using electrosurgery",
    distractorRationales: [
      "Circular motion is for iodine-based preps, not CHG-alcohol which requires back-and-forth friction",
      "A single swipe provides inadequate friction and dwell time for effective antisepsis",
      "Draping over wet alcohol prep creates a significant fire risk and reduces antiseptic efficacy"
    ]
  },
  {
    stem: "A perioperative nurse notices that the surgeon is wearing a surgical mask with the nose piece not fitted snugly to the nose, leaving visible gaps at the sides of the mask. What is the correct nursing response?",
    options: [
      "No action needed — surgical masks do not need to fit tightly to be effective",
      "Politely inform the surgeon that the mask should be fitted snugly with the nose piece molded to the bridge of the nose and secured with both ties to minimize bacterial dispersal from the nasopharyngeal area",
      "Document the observation but take no corrective action during the case",
      "Replace the mask with a different brand that may fit better without informing the surgeon"
    ],
    correctAnswer: 1,
    rationaleLong: "Surgical masks serve as a barrier to contain droplets and aerosols expelled from the wearer's nose and mouth during breathing, talking, and sneezing, preventing these microorganisms from reaching the sterile field and the patient's surgical wound. For a surgical mask to be effective, it must fit snugly against the face. The metal nose piece must be molded to the contour of the bridge of the nose to eliminate gaps where unfiltered air (carrying bacteria from the nasopharynx) can escape. Both ties (upper and lower) must be secured — the upper tie secures the mask at the crown of the head, and the lower tie secures it at the nape of the neck. An improperly fitted mask is essentially ineffective because exhaled air containing bacteria follows the path of least resistance, flowing through gaps rather than being filtered through the mask material. Studies have shown that up to 80% of bacterial shedding occurs from the nose and mouth. The perioperative nurse has the professional responsibility to address breaks in aseptic practice with all team members, regardless of hierarchy. Communication should be respectful, factual, and focused on patient safety. This is consistent with AORN guidelines on surgical attire and a just culture of safety where any team member can speak up about infection prevention practices.",
    learningObjective: "Ensure proper surgical mask fit and technique to maintain the sterile environment and reduce surgical site infection risk",
    blueprintCategory: "Infection Prevention",
    subtopic: "surgical attire",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A loose-fitting surgical mask with gaps is INEFFECTIVE — unfiltered air bypasses the mask material. The nose piece must be molded snugly to the face.",
    clinicalPearls: [
      "Mask must fit snugly: mold nose piece to bridge of nose, secure both ties",
      "Up to 80% of bacterial shedding is from the nose and mouth — mask fit directly affects wound contamination",
      "Change masks between cases and when they become wet (moisture reduces filtration efficiency)"
    ],
    safetyNote: "Speak up about improper mask fit regardless of team hierarchy — patient safety supersedes social comfort",
    distractorRationales: [
      "Masks must fit snugly to be effective — gaps render the mask ineffective as a barrier",
      "Documentation without action fails to address the immediate infection risk to the patient",
      "Replacing the mask without informing the surgeon does not address the fitting technique issue"
    ]
  },
  {
    stem: "A patient develops a surgical site infection (SSI) 18 days after a total knee arthroplasty with a prosthetic implant. According to the CDC/NHSN definitions, how is this SSI classified based on timing?",
    options: [
      "This is not an SSI because it occurred more than 14 days after surgery",
      "This is an SSI within the surveillance period — implant procedures have a 90-day surveillance window for SSI detection",
      "This is a community-acquired infection, not an SSI",
      "This is classified as a nosocomial infection but not as an SSI"
    ],
    correctAnswer: 1,
    rationaleLong: "The CDC's National Healthcare Safety Network (NHSN) defines the surveillance periods for surgical site infection detection based on the type of procedure performed. For most surgical procedures without implants, the SSI surveillance window is 30 days after the procedure. However, for procedures involving the placement of an implant (such as total joint arthroplasty, cardiac valve replacement, hernia mesh, vascular grafts, and other permanent or semi-permanent devices), the surveillance window extends to 90 days after the procedure. An implant is defined by the NHSN as a non-human-derived implantable foreign body (e.g., prosthetic heart valve, prosthetic joint, mesh, hardware, artificial vascular graft) that is permanently placed during the procedure. This extended surveillance period exists because implant-associated infections can present later than soft tissue infections due to the formation of biofilm on the implant surface, which provides a protected environment for bacteria and can delay clinical presentation. An SSI occurring at 18 days post-TKA (with a prosthetic implant) falls well within the 90-day surveillance window and is classified as an SSI. The three depth classifications of SSI are: superficial incisional (skin and subcutaneous tissue within 30 days), deep incisional (deep soft tissue/fascia/muscle within 30 or 90 days), and organ/space (any body area deeper than the incision within 30 or 90 days).",
    learningObjective: "Apply CDC/NHSN SSI surveillance period criteria to classify infections based on procedure type and timing",
    blueprintCategory: "Infection Prevention",
    subtopic: "SSI surveillance",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SSI surveillance: 30 days for most procedures, 90 days for procedures with implants. TKA with prosthesis = 90-day window.",
    clinicalPearls: [
      "SSI surveillance periods: 30 days without implant, 90 days with implant",
      "SSI depth: superficial incisional, deep incisional, organ/space",
      "Biofilm formation on implants delays infection presentation — hence the extended surveillance"
    ],
    safetyNote: "Educate patients to report signs of infection (redness, swelling, drainage, fever) for the full surveillance period after discharge",
    distractorRationales: [
      "The surveillance window for implant procedures is 90 days, not 14 days",
      "An infection occurring within the surveillance window after a surgical procedure meets SSI criteria",
      "SSI classification is specific to infections related to surgical procedures and has defined criteria"
    ]
  },
  {
    stem: "During a surgical procedure, a team member realizes they need to leave the restricted area of the operating room to retrieve supplies from the sub-sterile corridor. What is the proper surgical attire protocol for re-entering the restricted area?",
    options: [
      "Remove the surgical mask and shoe covers when leaving, replace them before re-entering",
      "Cover the scrub attire with a lab coat or warm-up jacket when leaving the restricted area, and remove the cover when returning — fresh surgical attire is required only if the scrubs become visibly contaminated",
      "Change into a completely new set of scrub attire before re-entering the restricted area",
      "No change is needed as long as the surgical cap remains in place"
    ],
    correctAnswer: 1,
    rationaleLong: "AORN guidelines for surgical attire in the perioperative environment specify that when personnel leave the restricted (sterile) area of the operating room department, they should cover their scrub attire with a clean lab coat, cover gown, or warm-up jacket to protect the scrubs from contamination in unrestricted areas. The cover should be removed upon return to the restricted area. A new mask should be applied each time the person enters a room where a sterile field is open. The rationale is that scrub attire exposed to unrestricted areas can collect microorganisms that are then carried back into the restricted zone. The cover garment provides a barrier between the scrub attire and the unrestricted environment. Complete change of scrub attire is required when the scrubs become visibly contaminated with blood or body fluids, or when leaving the facility. The surgical head cover (bouffant or skull cap) should completely cover all head and facial hair at all times in the semi-restricted and restricted areas. Some facilities may have more stringent policies based on their own infection prevention assessments. The key principle is maintaining the microbial barrier between restricted and unrestricted areas of the surgical department.",
    learningObjective: "Apply proper surgical attire protocols when transitioning between restricted and unrestricted areas of the perioperative department",
    blueprintCategory: "Infection Prevention",
    subtopic: "surgical attire protocols",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cover scrub attire when leaving the restricted area — remove the cover when returning. Complete change only required for visible contamination.",
    clinicalPearls: [
      "Cover scrub attire when leaving restricted area; remove cover on return",
      "Apply a fresh mask each time entering a room with an open sterile field",
      "Complete scrub change required only for visible contamination or when leaving the facility"
    ],
    safetyNote: "Scrub attire worn outside the restricted area can carry environmental microorganisms back into the surgical environment",
    distractorRationales: [
      "The mask should be applied when entering rooms with sterile fields, not removed and replaced for corridor trips",
      "Complete change is only required for visible contamination, not for brief trips to the sub-sterile area",
      "Leaving the cap in place is necessary but insufficient — scrub attire must be covered when leaving the restricted area"
    ]
  },
  {
    stem: "A perioperative nurse is implementing a surgical site infection prevention bundle for colorectal surgery. Which combination of evidence-based interventions constitutes a comprehensive SSI prevention bundle?",
    options: [
      "Preoperative antibiotics only, with no other interventions needed",
      "Preoperative skin antisepsis with CHG, appropriate antibiotic prophylaxis within 60 minutes, normothermia maintenance (core temp >36°C), perioperative glucose control (<200 mg/dL), and appropriate hair removal (clipping, not shaving)",
      "Shaving the surgical site the night before surgery, administering antibiotics 3 hours before surgery, and applying iodine prep",
      "Using double-gloving, laminar airflow, and extended antibiotic courses (7 days postoperative)"
    ],
    correctAnswer: 1,
    rationaleLong: "Evidence-based SSI prevention bundles combine multiple interventions that, when implemented together, significantly reduce SSI rates beyond what any single intervention achieves alone. The key components of a comprehensive SSI prevention bundle include: (1) Preoperative skin antisepsis — chlorhexidine gluconate (CHG) with alcohol is preferred for most surgical sites due to its persistent antimicrobial activity; (2) Appropriate antibiotic prophylaxis — the correct antibiotic, administered within 60 minutes of incision (120 min for vancomycin), redosed as needed, and discontinued within 24 hours; (3) Normothermia maintenance — maintaining core temperature >36°C, as hypothermia impairs immune function and increases SSI risk 2-3x; (4) Perioperative glucose control — maintaining blood glucose <200 mg/dL regardless of diabetes status, as hyperglycemia impairs neutrophil function; (5) Appropriate hair removal — if hair removal is necessary, clippers should be used immediately before the procedure, NOT razors. Razors cause microscopic skin cuts that serve as entry points for bacteria. Shaving the night before surgery significantly increases SSI rates. Additional bundle elements for colorectal surgery may include: mechanical bowel preparation with oral antibiotics, wound protector devices, and antimicrobial suture (triclosan-coated suture) for fascial closure. Bundle compliance must be monitored and reported as a quality metric.",
    learningObjective: "Implement a comprehensive SSI prevention bundle incorporating evidence-based interventions for surgical patients",
    blueprintCategory: "Infection Prevention",
    subtopic: "SSI prevention bundle",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SSI prevention bundle: CHG prep, timely antibiotics, normothermia >36°C, glucose <200 mg/dL, clip (don't shave). Razors INCREASE SSI risk.",
    clinicalPearls: [
      "SSI bundle: CHG skin prep, timely antibiotics, normothermia >36°C, glucose <200 mg/dL, clip not shave",
      "Razors cause skin microabrasions that increase SSI risk — always use clippers",
      "Each bundle element reduces SSI risk; combined implementation provides the greatest benefit"
    ],
    safetyNote: "Monitor and report SSI bundle compliance as a quality metric — partial bundle compliance provides partial benefit",
    distractorRationales: [
      "Antibiotics alone are insufficient — SSI prevention requires a multimodal bundled approach",
      "Shaving with a razor increases SSI risk; antibiotics 3 hours before incision is too early",
      "Extended antibiotic courses (>24 hours) do not reduce SSI rates and promote antimicrobial resistance"
    ]
  },
  {
    stem: "The circulating nurse observes the scrub nurse reaching across the sterile field to retrieve an instrument from the back table, and the scrub nurse's arm passes over a sterile basin of irrigation fluid. What should the circulating nurse do?",
    options: [
      "No action needed since the scrub nurse is wearing sterile gown and gloves",
      "Inform the scrub nurse that the irrigation fluid in the basin is now contaminated because unseen particles can fall from the sterile gown sleeve into the basin, and the irrigation fluid should be replaced",
      "Document the observation as a minor sterile technique deviation",
      "Replace the basin only if visible debris is noted in the irrigation fluid"
    ],
    correctAnswer: 1,
    rationaleLong: "Even when wearing a sterile gown and gloves, reaching over sterile items (particularly open containers of fluid) is an aseptic technique violation. The principle at issue is that sterile gowns are considered sterile only on the front from chest to waist level and on the sleeves from 2 inches above the elbow to the cuff. The top of the gown shoulder, the underarm area, and the back are considered non-sterile because they cannot be observed and maintained by the wearer. When the scrub nurse reaches across the field, the underarm area of the gown (which is non-sterile) passes over the open basin, and unseen particles, lint fibers, or skin cells can fall from this non-sterile area into the irrigation fluid. Additionally, the reaching motion can dislodge invisible particles from the gown sleeves and arms. Open containers of fluid on the sterile field are particularly vulnerable because they cannot be covered and any contaminant that falls in is immediately dispersed throughout the fluid. The contaminated irrigation fluid must be replaced. The circulating nurse should communicate this to the scrub nurse respectfully and assist in replacing the fluid. This is a teachable moment about the principle that items should be passed hand-to-hand rather than reaching over the field, and that open containers should be covered or filled immediately before use.",
    learningObjective: "Apply principles of surgical asepsis to identify contamination events involving open containers on the sterile field",
    blueprintCategory: "Infection Prevention",
    subtopic: "aseptic technique",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Reaching over an open sterile container contaminates it — even with sterile gown/gloves. The gown's underarm and shoulders are NON-STERILE.",
    clinicalPearls: [
      "Sterile gown zones: front from chest to waist, sleeves from 2 inches above elbow to cuff — all else non-sterile",
      "Never reach over open sterile containers — unseen particles can contaminate the contents",
      "Pass items hand-to-hand rather than reaching across the sterile field"
    ],
    safetyNote: "Open containers of irrigation fluid on the sterile field are highly vulnerable to contamination — replace immediately if contamination is suspected",
    distractorRationales: [
      "Sterile gowns have non-sterile areas (underarm, shoulders, back) that can shed contaminants when passing over open containers",
      "Documentation without corrective action fails to protect the patient from potential infection",
      "Contamination is often invisible — absence of visible debris does not mean the fluid is uncontaminated"
    ]
  },
  {
    stem: "A perioperative nurse is preparing for a procedure on a patient known to be colonized with methicillin-resistant Staphylococcus aureus (MRSA). In addition to Standard Precautions, which transmission-based precaution is required?",
    options: [
      "Airborne precautions with N95 respirator and negative pressure room",
      "Contact precautions with gown and gloves for direct patient contact, and enhanced environmental cleaning with an EPA-registered disinfectant effective against MRSA",
      "Droplet precautions with surgical mask within 3 feet of the patient",
      "No additional precautions beyond Standard Precautions are needed in the operating room"
    ],
    correctAnswer: 1,
    rationaleLong: "MRSA is transmitted primarily through direct contact with colonized or infected skin, wounds, or contaminated surfaces and equipment. Therefore, Contact Precautions are indicated in addition to Standard Precautions. Contact Precautions include: wearing a gown and gloves for all direct patient contact, removing PPE upon leaving the room, performing hand hygiene with soap and water (preferred over alcohol-based hand rub for patients with certain MDROs, though alcohol-based rub is also acceptable for MRSA), and enhanced environmental cleaning. In the operating room, additional considerations for MRSA-colonized patients include: scheduling the patient as the last case of the day (when possible) to allow terminal cleaning, using EPA-registered disinfectants proven effective against MRSA for terminal cleaning of all surfaces, disposing of or properly reprocessing all supplies and equipment used during the case, and considering preoperative MRSA decolonization (intranasal mupirocin ointment and CHG bathing for 5 days before elective surgery) which has been shown to reduce SSI rates in MRSA carriers. MRSA is not airborne under normal circumstances (unlike tuberculosis, which requires airborne precautions with an N95 respirator and negative pressure room). Droplet precautions are used for respiratory pathogens transmitted through large respiratory droplets (influenza, pertussis), which is not MRSA's primary transmission mode.",
    learningObjective: "Implement appropriate transmission-based precautions for MRSA-colonized patients in the perioperative setting",
    blueprintCategory: "Infection Prevention",
    subtopic: "multidrug-resistant organisms",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "MRSA = Contact Precautions (gown + gloves + environmental cleaning). NOT airborne or droplet. Consider preoperative decolonization for elective surgery.",
    clinicalPearls: [
      "MRSA: Contact Precautions — gown, gloves, enhanced environmental cleaning",
      "Consider scheduling MRSA patients as the last case with terminal cleaning",
      "Preoperative MRSA decolonization (mupirocin + CHG) reduces SSI rates in carriers"
    ],
    safetyNote: "Hand hygiene after removing PPE is critical — MRSA can survive on surfaces and hands for extended periods",
    distractorRationales: [
      "MRSA is transmitted by contact, not airborne — N95 respirators and negative pressure rooms are for airborne pathogens like TB",
      "MRSA is not primarily transmitted by droplets — droplet precautions are for influenza, pertussis, and similar respiratory pathogens",
      "Standard Precautions alone are insufficient for known MRSA colonization — Contact Precautions are required"
    ]
  },
  {
    stem: "After a surgical procedure, the perioperative nurse is performing terminal cleaning of the operating room. Which surface requires the MOST attention for thorough cleaning to prevent healthcare-associated infections?",
    options: [
      "The ceiling tiles and overhead lighting fixtures",
      "High-touch surfaces including the OR table, anesthesia machine controls, IV poles, light handles, doorknobs, computer keyboards, and monitor screens",
      "The floor only, as most bacteria settle on horizontal surfaces due to gravity",
      "The walls and windows of the operating room"
    ],
    correctAnswer: 1,
    rationaleLong: "Terminal cleaning of the operating room focuses on high-touch surfaces — areas that are frequently touched by healthcare workers' hands during the procedure. These surfaces accumulate the highest concentration of microorganisms from contact transmission and serve as reservoirs for pathogen transfer between patients. High-touch surfaces include: the operating room table (mattress, rails, articulation controls), anesthesia machine and its controls, IV poles and pump surfaces, overhead surgical light handles, doorknobs and push plates, computer keyboards and mice, monitor screens and touchpads, electrosurgery unit controls, suction canisters and regulators, stretcher/bed rails, and any equipment directly involved in patient care. Studies using fluorescent markers and ATP bioluminescence testing have consistently shown that high-touch surfaces are the most commonly missed areas during routine cleaning and the most likely sources of cross-contamination. Environmental contamination with pathogens such as MRSA, VRE, Clostridioides difficile, and Acinetobacter baumannii can persist for days to months on surfaces, facilitating transmission to subsequent patients. The cleaning agent must be an EPA-registered hospital-grade disinfectant with appropriate contact time (wet time) for the targeted pathogens. For C. difficile, an EPA-registered sporicidal agent (such as bleach-based products) is required.",
    learningObjective: "Prioritize high-touch surface cleaning during terminal OR decontamination to prevent healthcare-associated infections",
    blueprintCategory: "Infection Prevention",
    subtopic: "environmental cleaning",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "High-touch surfaces (table, anesthesia controls, light handles, doorknobs, keyboards) are the priority — they have the highest microbial load from contact.",
    clinicalPearls: [
      "High-touch surfaces are most commonly missed during cleaning and most likely to harbor pathogens",
      "Use EPA-registered disinfectant with appropriate contact time — wet time matters",
      "C. difficile requires sporicidal agent (bleach-based); standard disinfectants are insufficient"
    ],
    safetyNote: "Verify disinfectant contact time is met — applying and immediately wiping reduces antimicrobial efficacy significantly",
    distractorRationales: [
      "Ceiling tiles and lighting fixtures are low-touch surfaces with minimal impact on infection transmission",
      "Floor cleaning alone is insufficient — most cross-contamination occurs through hand contact with high-touch surfaces",
      "Walls and windows are low-touch surfaces that contribute minimally to cross-contamination"
    ]
  }
];
