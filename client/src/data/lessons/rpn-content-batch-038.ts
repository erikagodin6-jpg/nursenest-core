import type { LessonContent } from "./types";

export const rpnContentBatch038Lessons: Record<string, LessonContent> = {
  "chain-of-infection-rpn": {
    title: "Chain of Infection",
    cellular: {
      title: "Transmission Pathophysiology and Infection Chain",
      content: "The chain of infection describes the six linked elements required for disease transmission: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Breaking any single link prevents infection transmission. Infectious agents include bacteria, viruses, fungi, and parasites with varying virulence and pathogenicity. Reservoirs include humans (carriers or infected individuals), animals, and environmental sources (water, soil, fomites). Modes of transmission include contact (direct and indirect), droplet, airborne, vector-borne, and vehicle-borne. The susceptible host's immune status, age, nutritional state, chronic disease burden, and integrity of natural barriers (skin, mucous membranes) determine infection risk. Healthcare-associated infections (HAIs) affect approximately 1 in 31 hospitalized patients, making infection control knowledge essential for all nursing practice."
    },
    riskFactors: [
      "Immunocompromised patients (chemotherapy, HIV, organ transplant)",
      "Invasive devices (central lines, urinary catheters, ventilators)",
      "Surgical wounds and breaks in skin integrity",
      "Extremes of age (neonates and elderly)",
      "Prolonged hospitalization increasing exposure to resistant organisms"
    ],
    diagnostics: [
      "Culture and sensitivity testing to identify organism and drug resistance",
      "White blood cell count with differential for infection indicators",
      "C-reactive protein and procalcitonin levels for systemic infection",
      "Surveillance cultures for multidrug-resistant organism screening"
    ],
    management: [
      "Apply appropriate precautions based on mode of transmission",
      "Implement hand hygiene before and after every patient contact",
      "Use aseptic technique for all invasive procedures",
      "Remove invasive devices as soon as clinically appropriate"
    ],
    nursingActions: [
      "Perform hand hygiene using the WHO 5 Moments framework",
      "Identify and implement appropriate isolation precautions",
      "Educate patients and visitors on infection prevention measures",
      "Monitor patients for signs and symptoms of infection development",
      "Report clusters of infections to infection prevention team"
    ],
    signs: {
      left: [
        "Afebrile with WBC within normal limits",
        "Intact skin and mucous membranes",
        "Clean, dry wound sites without erythema",
        "Clear urine without foul odor"
      ],
      right: [
        "Fever, elevated WBC, and shift to the left",
        "Purulent drainage from wound or device site",
        "Erythema, warmth, and swelling at insertion sites",
        "Cloudy or foul-smelling urine with catheter"
      ]
    },
    medications: [
      {
        name: "Chlorhexidine (CHG) 2%",
        type: "Antiseptic skin preparation",
        action: "Broad-spectrum antimicrobial that disrupts bacterial cell membranes with residual activity up to 6 hours",
        sideEffects: "Skin irritation, allergic dermatitis (rare), ototoxicity if enters middle ear",
        contra: "Known allergy to chlorhexidine, use near eyes or ears",
        pearl: "CHG bathing of ICU patients reduces MRSA and VRE colonization by 23-30%; allow 2 minutes drying time for full effect."
      }
    ],
    pearls: [
      "Hand hygiene is the single most effective measure to prevent healthcare-associated infections",
      "Breaking any ONE link in the chain of infection prevents disease transmission",
      "Healthcare workers' hands are the most common vehicle for transmitting infections between patients"
    ],
    quiz: [
      {
        question: "Which element is NOT part of the chain of infection?",
        options: ["Susceptible host", "Mode of transmission", "Antibiotic resistance", "Portal of entry"],
        correct: 2,
        rationale: "The chain of infection includes: agent, reservoir, portal of exit, mode of transmission, portal of entry, susceptible host."
      },
      {
        question: "The most effective single intervention to break the chain of infection is:",
        options: ["Wearing gloves", "Hand hygiene", "Administering antibiotics", "Patient isolation"],
        correct: 1,
        rationale: "Hand hygiene is the single most effective measure to prevent transmission of microorganisms."
      },
      {
        question: "A patient with an indwelling urinary catheter is at increased infection risk because the catheter:",
        options: ["Increases urine output", "Provides a portal of entry bypassing natural barriers", "Strengthens immune response", "Decreases bacterial exposure"],
        correct: 1,
        rationale: "Catheters bypass natural barriers (urethral sphincter, mucosal defenses), creating a direct portal of entry."
      }
    ]
  },
  "standard-precautions-rpn": {
    title: "Standard Precautions",
    cellular: {
      title: "Universal Barrier Protection Principles",
      content: "Standard precautions are the minimum infection prevention practices applied to ALL patient care regardless of suspected or confirmed infection status. They are based on the principle that all blood, body fluids (except sweat), non-intact skin, and mucous membranes may contain transmissible infectious agents. Standard precautions include hand hygiene, use of personal protective equipment (PPE) based on anticipated exposure, respiratory hygiene/cough etiquette, safe injection practices, sterile instruments and devices, and clean and disinfected environmental surfaces. Standard precautions replaced the older concept of universal precautions by extending protection beyond bloodborne pathogens to all potentially infectious materials. Hand hygiene is performed using alcohol-based hand rub (ABHR) or soap and water, with soap and water required when hands are visibly soiled or after caring for patients with Clostridioides difficile or norovirus."
    },
    riskFactors: [
      "Non-compliance with hand hygiene protocols among healthcare workers",
      "Inadequate PPE availability or improper donning/doffing technique",
      "High patient-to-nurse ratios limiting time for infection control practices",
      "Needlestick injuries from unsafe sharps handling",
      "Contaminated environmental surfaces acting as fomite reservoirs"
    ],
    diagnostics: [
      "Hand hygiene compliance auditing and monitoring",
      "Environmental surface sampling for contamination assessment",
      "Sharps injury surveillance and reporting data",
      "Healthcare-associated infection rate tracking"
    ],
    management: [
      "Apply standard precautions to every patient encounter",
      "Select PPE based on type of anticipated exposure",
      "Use sharps safety devices and dispose in puncture-resistant containers",
      "Follow safe injection practices - one needle, one syringe, one patient"
    ],
    nursingActions: [
      "Perform hand hygiene before and after every patient contact using WHO 5 Moments",
      "Don gloves when anticipating contact with blood, body fluids, or non-intact skin",
      "Wear gown when clothing may contact blood or body fluids",
      "Use face protection (mask, eye shield) when splashing or spraying is anticipated",
      "Dispose of sharps immediately at point of use in designated containers"
    ],
    signs: {
      left: [
        "Consistent hand hygiene compliance before and after patient care",
        "Appropriate PPE selection for each patient interaction",
        "Sharps disposed of immediately in puncture-resistant containers",
        "Clean patient environment with disinfected high-touch surfaces"
      ],
      right: [
        "Observed lapses in hand hygiene between patients",
        "Recapping used needles or improper sharps disposal",
        "PPE not worn during procedures with exposure risk",
        "Contaminated equipment shared between patients without disinfection"
      ]
    },
    medications: [
      {
        name: "Alcohol-Based Hand Rub (ABHR - Purell/Avagard)",
        type: "Hand antiseptic",
        action: "Denatures proteins and dissolves lipid membranes of bacteria, fungi, and most viruses on contact",
        sideEffects: "Skin dryness and irritation with frequent use",
        contra: "Visibly soiled hands, C. difficile exposure (use soap and water), norovirus exposure",
        pearl: "Apply enough ABHR to cover all hand surfaces and rub until dry (minimum 20 seconds); if hands dry in <15 seconds, not enough product was used."
      }
    ],
    pearls: [
      "Standard precautions apply to ALL patients ALL the time - not just those with known infections",
      "Alcohol-based hand rub does NOT kill C. difficile spores - use soap and water for C. diff patients",
      "Gloves are NOT a substitute for hand hygiene - perform hand hygiene before donning and after removing gloves"
    ],
    quiz: [
      {
        question: "Standard precautions should be applied to:",
        options: ["Only patients with confirmed infections", "Only immunocompromised patients", "All patients regardless of diagnosis", "Only surgical patients"],
        correct: 2,
        rationale: "Standard precautions apply to ALL patients in ALL settings to prevent transmission of infectious agents."
      },
      {
        question: "After caring for a patient with C. difficile infection, hand hygiene should be performed with:",
        options: ["Alcohol-based hand rub only", "Soap and water", "Hand sanitizer wipes", "No hand hygiene needed if gloves were worn"],
        correct: 1,
        rationale: "C. difficile forms spores that are resistant to alcohol; friction with soap and water is required to mechanically remove spores."
      },
      {
        question: "Which body fluid is EXCLUDED from standard precautions?",
        options: ["Blood", "Urine", "Sweat", "Cerebrospinal fluid"],
        correct: 2,
        rationale: "Sweat is the only body fluid excluded from standard precautions, as it has not been implicated in disease transmission."
      }
    ]
  },
  "airborne-precautions-rpn": {
    title: "Airborne Precautions",
    cellular: {
      title: "Airborne Transmission and Containment Pathophysiology",
      content: "Airborne precautions prevent transmission of infections spread by airborne nuclei - tiny particles (≤5 micrometers) that remain suspended in air for extended periods and can travel long distances on air currents. Key airborne diseases include tuberculosis (TB), measles (rubeola), varicella (chickenpox), and disseminated herpes zoster. These particles can be inhaled by susceptible individuals who have never entered the patient's room if air is shared through ventilation systems. Airborne isolation requires a negative pressure airborne infection isolation room (AIIR) that maintains at least 6-12 air exchanges per hour with air exhausted directly outside or through HEPA filtration. Healthcare workers must wear N95 respirators (or higher) that have been individually fit-tested to ensure a proper facial seal, as standard surgical masks do not filter particles small enough for airborne transmission."
    },
    riskFactors: [
      "Undiagnosed or untreated active pulmonary tuberculosis",
      "Immunocompromised patients susceptible to varicella or measles",
      "Healthcare workers without immunity to measles or varicella",
      "Failure to properly fit-test N95 respirators",
      "Rooms without negative pressure capability"
    ],
    diagnostics: [
      "Tuberculin skin test (TST/Mantoux) or interferon-gamma release assay (IGRA)",
      "Chest X-ray for active pulmonary tuberculosis",
      "Sputum for acid-fast bacilli (AFB) smear and culture",
      "Measles and varicella IgG titers for immunity verification"
    ],
    management: [
      "Place patient in negative pressure airborne infection isolation room (AIIR)",
      "Keep door closed at all times; monitor negative pressure daily",
      "N95 respirator required for all persons entering the room",
      "Patient wears surgical mask during transport outside isolation room"
    ],
    nursingActions: [
      "Verify N95 respirator is fit-tested before entering isolation room",
      "Perform seal check each time N95 is donned (positive and negative pressure test)",
      "Keep isolation room door closed and monitor negative pressure indicator",
      "Place surgical mask on patient during any necessary transport",
      "Coordinate care to minimize door openings and unnecessary entries"
    ],
    signs: {
      left: [
        "Negative pressure maintained in isolation room",
        "All staff wearing properly fit-tested N95 respirators",
        "Patient compliant with isolation requirements",
        "TB patients with three negative sputum AFB smears"
      ],
      right: [
        "Active coughing with productive sputum in suspected TB",
        "Vesicular rash in unimmunized patient (varicella)",
        "Fever with maculopapular rash and Koplik spots (measles)",
        "Isolation room door found open or positive pressure noted"
      ]
    },
    medications: [
      {
        name: "Isoniazid (INH)",
        type: "Antitubercular antimicrobial",
        action: "Inhibits mycolic acid synthesis in the mycobacterial cell wall, bactericidal against actively growing M. tuberculosis",
        sideEffects: "Hepatotoxicity, peripheral neuropathy, pyridoxine (B6) depletion",
        contra: "Active liver disease, previous INH-associated hepatitis",
        pearl: "Always co-administer pyridoxine (vitamin B6) to prevent peripheral neuropathy; monitor liver function monthly."
      }
    ],
    pearls: [
      "Airborne precautions require N95 respirator - a surgical mask is NOT sufficient for TB, measles, or varicella",
      "TB patients need three negative sputum AFB smears collected 8-24 hours apart before discontinuing airborne precautions",
      "Healthcare workers who are not immune to measles or varicella should NOT enter those patients' rooms"
    ],
    quiz: [
      {
        question: "Which type of room is required for a patient on airborne precautions?",
        options: ["Private room with positive pressure", "Negative pressure airborne infection isolation room", "Semi-private room with curtain", "Any room with door closed"],
        correct: 1,
        rationale: "Negative pressure rooms prevent airborne particles from escaping into hallways and other patient areas."
      },
      {
        question: "The minimum respiratory protection required for entering an airborne isolation room is:",
        options: ["Surgical mask", "N95 respirator (fit-tested)", "Face shield only", "Standard cloth mask"],
        correct: 1,
        rationale: "N95 respirators filter ≥95% of airborne particles and must be individually fit-tested for proper seal."
      },
      {
        question: "Which disease requires airborne precautions?",
        options: ["Influenza", "C. difficile", "Active pulmonary tuberculosis", "MRSA"],
        correct: 2,
        rationale: "TB is transmitted via airborne nuclei <5 micrometers and requires airborne precautions with AIIR."
      }
    ]
  },
  "droplet-precautions-rpn": {
    title: "Droplet Precautions",
    cellular: {
      title: "Droplet Transmission Mechanism and Prevention",
      content: "Droplet precautions prevent transmission of infections spread by large respiratory droplets (>5 micrometers) generated during coughing, sneezing, talking, or procedures like suctioning. Unlike airborne particles, droplets are too heavy to remain airborne and typically travel no more than 3-6 feet before settling on surfaces. Key droplet-transmitted infections include influenza, pertussis (whooping cough), diphtheria, Neisseria meningitidis (meningococcal meningitis), Mycoplasma pneumoniae, mumps, rubella, and streptococcal pharyngitis. A surgical mask (not N95) worn within 3-6 feet of the patient provides adequate protection because droplets do not remain airborne. Negative pressure rooms are not required for droplet precautions, but patients should be in private rooms or cohorted with patients who have the same infection."
    },
    riskFactors: [
      "Close contact (within 6 feet) with infected individuals",
      "Crowded living conditions facilitating droplet spread",
      "Healthcare procedures generating respiratory droplets (suctioning, nebulizing)",
      "Unvaccinated individuals exposed to vaccine-preventable droplet diseases",
      "Seasonal epidemics of influenza and respiratory viruses"
    ],
    diagnostics: [
      "Rapid influenza diagnostic test (RIDT) or RT-PCR",
      "Nasopharyngeal swab for pertussis PCR testing",
      "Throat culture for Group A Streptococcus",
      "Blood cultures for suspected meningococcemia"
    ],
    management: [
      "Place patient in private room (negative pressure not required)",
      "Wear surgical mask when within 3-6 feet of the patient",
      "Patient wears surgical mask during transport",
      "Implement respiratory hygiene and cough etiquette measures"
    ],
    nursingActions: [
      "Don surgical mask before entering patient room",
      "Maintain spatial separation of at least 3 feet between patient and visitors when mask removed",
      "Apply surgical mask on patient during transport outside room",
      "Provide tissues and hand hygiene supplies at bedside for cough etiquette",
      "Educate patient to cover mouth and nose when coughing or sneezing"
    ],
    signs: {
      left: [
        "Patient compliant with cough etiquette and mask use",
        "No new cases among close contacts",
        "Appropriate isolation signage posted on door",
        "Staff consistently wearing surgical masks"
      ],
      right: [
        "Active coughing and sneezing without covering mouth",
        "Staff entering room without surgical mask",
        "Patient transported without mask outside room",
        "New infection cases in nearby patients suggesting transmission"
      ]
    },
    medications: [
      {
        name: "Oseltamivir (Tamiflu)",
        type: "Neuraminidase inhibitor antiviral",
        action: "Inhibits viral neuraminidase enzyme preventing influenza virus release from infected cells",
        sideEffects: "Nausea, vomiting, headache, rarely neuropsychiatric events in children",
        contra: "None absolute; dose adjustment needed for renal impairment",
        pearl: "Most effective when started within 48 hours of symptom onset; can be used prophylactically for close contacts of influenza cases."
      }
    ],
    pearls: [
      "Droplet precautions require a surgical mask, NOT an N95 - droplets are too large to be inhaled as airborne nuclei",
      "Influenza, pertussis, and meningococcal disease are the most common droplet-transmitted diseases in healthcare",
      "Respiratory hygiene/cough etiquette is a key source control measure for droplet-transmitted infections"
    ],
    quiz: [
      {
        question: "Droplet precautions differ from airborne precautions in that droplet precautions:",
        options: ["Require an N95 respirator", "Require negative pressure room", "Need only a surgical mask and private room", "Are applied only to TB patients"],
        correct: 2,
        rationale: "Droplet precautions require a surgical mask (not N95) and private room (not negative pressure)."
      },
      {
        question: "Respiratory droplets typically travel no more than:",
        options: ["1 foot", "3-6 feet", "20 feet", "Unlimited distance on air currents"],
        correct: 1,
        rationale: "Large droplets (>5 micrometers) fall to surfaces within 3-6 feet due to gravity."
      },
      {
        question: "Which infection requires droplet precautions?",
        options: ["Tuberculosis", "Measles", "Influenza", "Varicella"],
        correct: 2,
        rationale: "Influenza is transmitted via large respiratory droplets; TB, measles, and varicella require airborne precautions."
      }
    ]
  },
  "contact-precautions-rpn": {
    title: "Contact Precautions",
    cellular: {
      title: "Contact Transmission Prevention",
      content: "Contact precautions prevent transmission of infections spread through direct physical contact with the patient or indirect contact with contaminated surfaces and equipment. Direct contact transmission occurs when microorganisms transfer from an infected person to another through touching, bathing, or performing procedures. Indirect contact occurs through contaminated intermediate objects (fomites) such as bed rails, call lights, stethoscopes, and blood pressure cuffs. Key contact-transmitted organisms include methicillin-resistant Staphylococcus aureus (MRSA), vancomycin-resistant Enterococcus (VRE), Clostridioides difficile, multidrug-resistant organisms (MDROs), scabies, and respiratory syncytial virus (RSV). Contact precautions require gloves and gown for all interactions involving contact with the patient or their environment. Dedicated patient-care equipment should remain in the room and be disinfected after use."
    },
    riskFactors: [
      "Colonization or infection with MRSA, VRE, or other MDROs",
      "Clostridioides difficile infection with diarrhea shedding spores",
      "Draining wounds or skin lesions with resistant organisms",
      "Scabies infestation with direct skin-to-skin transmission",
      "RSV in pediatric patients spread through contaminated surfaces"
    ],
    diagnostics: [
      "Wound or nasal cultures for MRSA screening",
      "Stool testing for C. difficile toxin (PCR or GDH/toxin assay)",
      "Rectal swab surveillance for VRE colonization",
      "Skin scraping for scabies mite identification"
    ],
    management: [
      "Place patient in private room or cohort with same organism",
      "Don gloves and gown before entering room for all patient contact",
      "Dedicate patient-care equipment to the room (stethoscope, BP cuff, thermometer)",
      "Perform thorough environmental disinfection, especially high-touch surfaces"
    ],
    nursingActions: [
      "Don gown and gloves before entering the patient room",
      "Remove gown and gloves before leaving room; perform hand hygiene immediately",
      "Use dedicated equipment for the patient and disinfect after each use",
      "Ensure thorough terminal cleaning when patient is discharged or transferred",
      "Educate patient and family on the reason for isolation and expected duration"
    ],
    signs: {
      left: [
        "Surveillance cultures negative for target organism",
        "Wound healing without signs of infection",
        "Formed stool without diarrhea (C. diff clearance)",
        "No new cases linked to this patient source"
      ],
      right: [
        "Persistent MRSA or VRE colonization on surveillance cultures",
        "Ongoing diarrhea with positive C. difficile testing",
        "Draining wound with positive culture for resistant organism",
        "New cases of the same organism appearing in nearby patients"
      ]
    },
    medications: [
      {
        name: "Mupirocin (Bactroban) nasal ointment",
        type: "Topical antibiotic for MRSA decolonization",
        action: "Inhibits bacterial isoleucyl-tRNA synthetase stopping protein synthesis in staphylococci",
        sideEffects: "Nasal irritation, headache, taste disturbance",
        contra: "None significant; avoid if allergic to mupirocin",
        pearl: "Applied intranasally twice daily for 5 days for MRSA nasal decolonization; combine with CHG bathing for best results."
      }
    ],
    pearls: [
      "Gloves AND gown are required for contact precautions - gloves alone are insufficient",
      "High-touch surfaces (bed rails, call light, bedside table) harbor the highest pathogen loads",
      "C. difficile spores survive on surfaces for months - thorough cleaning with sporicidal agents is essential"
    ],
    quiz: [
      {
        question: "Contact precautions require which PPE upon entering the patient room?",
        options: ["Gloves only", "Mask only", "Gloves and gown", "N95 respirator and gloves"],
        correct: 2,
        rationale: "Contact precautions require both gloves and gown for any interaction with the patient or their environment."
      },
      {
        question: "Which organism transmission is BEST prevented by contact precautions?",
        options: ["Tuberculosis", "Measles", "MRSA", "Influenza"],
        correct: 2,
        rationale: "MRSA is primarily spread through direct and indirect contact, making contact precautions the appropriate strategy."
      },
      {
        question: "Dedicated patient-care equipment is required in contact isolation because:",
        options: ["It reduces cost", "Shared equipment serves as a fomite transmitting organisms", "Patients prefer their own equipment", "It simplifies the nurse's workflow"],
        correct: 1,
        rationale: "Shared equipment becomes contaminated and serves as an indirect contact vehicle (fomite) for transmission."
      }
    ]
  },
  "surgical-site-infection-prevention-rpn": {
    title: "Surgical Site Infection Prevention",
    cellular: {
      title: "Surgical Wound Classification and Infection Pathogenesis",
      content: "Surgical site infections (SSIs) are infections occurring within 30 days of surgery (or 90 days for implant procedures) at the incision or in deep tissues manipulated during the operation. SSIs are classified as superficial incisional (skin and subcutaneous tissue), deep incisional (deep soft tissue, fascia, muscle), or organ/space (any body area opened during surgery other than the incision). Surgical wound classification guides infection risk: Class I (clean) has <2% infection risk, Class II (clean-contaminated) 3-11%, Class III (contaminated) 13-17%, and Class IV (dirty-infected) >27%. The Surgical Care Improvement Project (SCIP) established evidence-based measures including prophylactic antibiotic timing (within 60 minutes of incision), appropriate hair removal (clipping not shaving), glucose control in cardiac surgery, and normothermia maintenance. Biofilm formation on implanted materials creates antibiotic-resistant bacterial communities."
    },
    riskFactors: [
      "Diabetes mellitus with poor glycemic control (glucose >200 mg/dL perioperatively)",
      "Obesity with increased subcutaneous tissue and poor wound perfusion",
      "Smoking impairing microvascular perfusion and oxygen delivery to wound",
      "Prolonged surgical duration exceeding expected time for procedure",
      "Emergency surgery with contaminated or dirty wound classification"
    ],
    diagnostics: [
      "Wound inspection for signs of infection (erythema, drainage, dehiscence)",
      "Wound culture and sensitivity of purulent drainage",
      "CBC with differential (elevated WBC, shift to left)",
      "CT imaging for suspected deep space or organ/space SSI"
    ],
    management: [
      "Administer prophylactic antibiotics within 60 minutes of surgical incision",
      "Maintain normothermia (>36°C) throughout the perioperative period",
      "Control blood glucose <200 mg/dL in perioperative period",
      "Use clippers (not razors) for hair removal at surgical site if necessary"
    ],
    nursingActions: [
      "Verify prophylactic antibiotic administration timing before incision",
      "Perform surgical site assessment at prescribed intervals post-operatively",
      "Use aseptic technique for all wound care and dressing changes",
      "Monitor temperature and WBC for early signs of SSI development",
      "Educate patient on incision care, signs of infection, and when to seek care"
    ],
    signs: {
      left: [
        "Approximated wound edges with minimal erythema",
        "Serous or serosanguineous drainage in first 24-48 hours",
        "Afebrile with WBC within normal limits",
        "Progressive wound healing with decreasing tenderness"
      ],
      right: [
        "Purulent drainage from incision site",
        "Erythema extending beyond wound margins with warmth",
        "Fever >38.5°C after postoperative day 3",
        "Wound dehiscence or failure to heal"
      ]
    },
    medications: [
      {
        name: "Cefazolin (Ancef)",
        type: "First-generation cephalosporin (surgical prophylaxis)",
        action: "Bactericidal coverage against common skin flora (Staphylococci, Streptococci) for wound infection prevention",
        sideEffects: "Allergic reaction, diarrhea, phlebitis at IV site",
        contra: "Severe penicillin allergy (anaphylaxis - use vancomycin or clindamycin alternative)",
        pearl: "Must be infused WITHIN 60 minutes of surgical incision for maximum tissue concentration; redose for procedures >4 hours."
      }
    ],
    pearls: [
      "Prophylactic antibiotics must be given within 60 minutes of incision - not in the post-op area",
      "Razors cause micro-abrasions that increase SSI risk by 2-3 times compared to clippers or no hair removal",
      "Normothermia maintenance reduces SSI risk by preserving neutrophil function and tissue oxygen delivery"
    ],
    quiz: [
      {
        question: "Surgical prophylactic antibiotics should be administered within what timeframe before incision?",
        options: ["24 hours before surgery", "Within 60 minutes of incision", "Immediately after surgery", "Only if the wound appears contaminated"],
        correct: 1,
        rationale: "Antibiotics must achieve adequate tissue concentration at the time of incision, requiring administration within 60 minutes."
      },
      {
        question: "Hair removal at the surgical site should be performed with:",
        options: ["Razor blade", "Electric clippers", "Depilatory cream always", "Chemical peel"],
        correct: 1,
        rationale: "Clippers reduce micro-abrasion risk compared to razors, which increase SSI rates 2-3 fold."
      },
      {
        question: "Which wound classification has the lowest infection risk?",
        options: ["Class I (clean)", "Class II (clean-contaminated)", "Class III (contaminated)", "Class IV (dirty-infected)"],
        correct: 0,
        rationale: "Class I (clean) wounds have the lowest infection risk (<2%) as no viscus is entered and no break in technique occurred."
      }
    ]
  },
  "needlestick-prevention-rpn": {
    title: "Needlestick Injury Prevention",
    cellular: {
      title: "Occupational Bloodborne Pathogen Exposure Prevention",
      content: "Needlestick and sharps injuries are the primary mechanism of occupational bloodborne pathogen transmission among healthcare workers. Approximately 385,000 sharps injuries occur annually in US hospitals. Hepatitis B virus (HBV) has the highest transmission risk per needlestick (6-30%), followed by hepatitis C virus (HCV) at 1.8%, and HIV at 0.3%. The Needlestick Safety and Prevention Act mandates use of engineered sharps injury prevention devices (safety needles, needleless IV systems). Hollow-bore needles carry higher transmission risk than solid sharps because they can contain larger volumes of blood. Post-exposure prophylaxis (PEP) must be initiated within hours of exposure: HBV immune globulin within 24 hours, HIV PEP ideally within 2 hours. Prevention strategies focus on engineering controls (safety devices), work practice controls (no recapping), and administrative controls (policies and training)."
    },
    riskFactors: [
      "Recapping used needles (most common preventable cause)",
      "Failure to use safety-engineered sharps devices",
      "Overfilled sharps containers creating exposure risk",
      "High-stress clinical situations with rushing and distractions",
      "Inadequate training on safe sharps handling and disposal"
    ],
    diagnostics: [
      "Source patient testing (HBV, HCV, HIV with rapid testing)",
      "Baseline bloodwork of exposed worker (HBV, HCV, HIV, liver function)",
      "Follow-up testing at 6 weeks, 3 months, and 6 months post-exposure",
      "HBV antibody titer to verify immunity status of exposed worker"
    ],
    management: [
      "Immediately flush wound with soap and running water for 5 minutes",
      "Report exposure to supervisor and occupational health immediately",
      "Initiate PEP within recommended timeframes based on source status",
      "Complete all recommended follow-up testing per protocol"
    ],
    nursingActions: [
      "Never recap used needles - activate safety mechanism and dispose immediately",
      "Dispose of sharps at point of use in puncture-resistant containers",
      "Replace sharps containers when three-quarters full, never overfill",
      "Use safety-engineered devices for all procedures involving sharps",
      "Report all needlestick injuries immediately regardless of perceived risk"
    ],
    signs: {
      left: [
        "Consistent use of safety-engineered sharps devices",
        "Sharps containers filled to three-quarter capacity then replaced",
        "Zero needlestick injuries on unit for reporting period",
        "All staff current on HBV vaccination series"
      ],
      right: [
        "Needlestick or sharps injury has occurred",
        "Used needles found recapped or left on trays",
        "Overfilled sharps containers with protruding sharps",
        "Exposed worker anxious about potential seroconversion"
      ]
    },
    medications: [
      {
        name: "Tenofovir/Emtricitabine + Raltegravir (HIV PEP regimen)",
        type: "Antiretroviral post-exposure prophylaxis",
        action: "Three-drug antiretroviral regimen prevents HIV replication and seroconversion after occupational exposure",
        sideEffects: "Nausea, fatigue, headache, diarrhea, renal toxicity",
        contra: "Known HIV-positive status of exposed worker (switch to ART instead)",
        pearl: "HIV PEP must begin ideally within 2 hours (no later than 72 hours) of exposure and continue for 28 days."
      }
    ],
    pearls: [
      "NEVER recap used needles - this is the single most preventable cause of needlestick injuries",
      "HIV PEP effectiveness decreases with every hour of delay - initiate within 2 hours if possible",
      "All healthcare workers should have documented hepatitis B immunity (anti-HBs ≥ 10 mIU/mL)"
    ],
    quiz: [
      {
        question: "The immediate first action after a needlestick injury is to:",
        options: ["Document the incident", "Notify the supervisor", "Wash the wound with soap and running water", "Test the source patient"],
        correct: 2,
        rationale: "Immediate wound cleansing with soap and running water is the first step to reduce infection risk."
      },
      {
        question: "Which bloodborne pathogen has the highest transmission risk per needlestick?",
        options: ["HIV (0.3%)", "Hepatitis C (1.8%)", "Hepatitis B (6-30%)", "All equal risk"],
        correct: 2,
        rationale: "HBV has the highest per-exposure transmission rate at 6-30%, compared to HCV at 1.8% and HIV at 0.3%."
      },
      {
        question: "Sharps containers should be replaced when they are:",
        options: ["Completely full", "Three-quarters full", "Half full", "Only when overflowing"],
        correct: 1,
        rationale: "Replace sharps containers at three-quarters capacity to prevent overfilling and sharps exposure."
      }
    ]
  },
  "biofilm-device-infections-rpn": {
    title: "Biofilm and Device-Related Infections",
    cellular: {
      title: "Biofilm Formation and Device-Associated Infection Pathogenesis",
      content: "Biofilms are organized communities of microorganisms embedded in a self-produced extracellular polymeric substance (EPS) matrix that adheres to surfaces, particularly medical devices. Biofilm formation proceeds through attachment, microcolony formation, maturation, and dispersal phases. Within biofilms, bacteria are 100-1,000 times more resistant to antibiotics compared to planktonic (free-floating) bacteria due to the protective EPS matrix, reduced metabolic activity, and efflux pump upregulation. Common device-associated infections include central line-associated bloodstream infections (CLABSIs), catheter-associated urinary tract infections (CAUTIs), and ventilator-associated pneumonia (VAP). Prevention bundles targeting device insertion, maintenance, and timely removal are the most effective strategies. The CDC estimates that 50-70% of HAIs are related to indwelling medical devices, making device management a critical nursing responsibility."
    },
    riskFactors: [
      "Prolonged indwelling device duration (central lines, urinary catheters, ET tubes)",
      "Break in aseptic technique during device insertion or maintenance",
      "Immunocompromised status reducing ability to fight device-associated biofilm",
      "Contaminated hub or connection point creating entry for organisms",
      "Failure to implement evidence-based prevention bundles"
    ],
    diagnostics: [
      "Blood cultures drawn from line and peripheral site to diagnose CLABSI",
      "Urinalysis and urine culture from catheter for CAUTI diagnosis",
      "Quantitative endotracheal aspirate cultures for VAP",
      "Differential time to positivity comparing central line and peripheral cultures"
    ],
    management: [
      "Implement insertion bundles using evidence-based checklists",
      "Maintain devices according to care bundles (scrub the hub, dressing changes)",
      "Assess daily for device necessity and remove as soon as clinically appropriate",
      "Consider device removal and replacement if device-related infection confirmed"
    ],
    nursingActions: [
      "Perform daily assessment of need for all invasive devices",
      "Scrub central line hubs with alcohol for 15 seconds before each access",
      "Maintain closed catheter drainage systems and keep bag below bladder level",
      "Perform oral care with chlorhexidine for ventilated patients per protocol",
      "Document device insertion date and daily necessity assessment"
    ],
    signs: {
      left: [
        "Clean, dry, intact device insertion sites",
        "Afebrile with normal WBC and negative cultures",
        "Device functioning properly without complications",
        "Dressings intact and changed per protocol schedule"
      ],
      right: [
        "Erythema, purulent drainage, or tenderness at device site",
        "Fever, rigors, or hemodynamic instability with indwelling device",
        "Cloudy urine with positive culture in catheterized patient",
        "New infiltrate on chest X-ray in ventilated patient"
      ]
    },
    medications: [
      {
        name: "Vancomycin IV",
        type: "Glycopeptide antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors; covers MRSA and resistant gram-positives",
        sideEffects: "Red man syndrome (histamine-related flushing with rapid infusion), nephrotoxicity, ototoxicity",
        contra: "Hypersensitivity to vancomycin",
        pearl: "Infuse over at least 60 minutes to prevent red man syndrome; monitor trough levels (target 15-20 mcg/mL for serious infections)."
      }
    ],
    pearls: [
      "Scrub the hub with alcohol for 15 seconds before every central line access - this is the most critical CLABSI prevention step",
      "The single best way to prevent device-related infections is to remove the device as soon as it is no longer needed",
      "Daily assessment of device necessity by the care team is a core bundle element for all device-related infection prevention"
    ],
    quiz: [
      {
        question: "Biofilms make bacteria more resistant to antibiotics primarily because:",
        options: ["Bacteria grow faster in biofilms", "The EPS matrix protects bacteria from antibiotic penetration", "Antibiotics cannot reach the device", "Biofilm bacteria produce more toxins"],
        correct: 1,
        rationale: "The extracellular polymeric substance (EPS) matrix acts as a barrier preventing adequate antibiotic penetration."
      },
      {
        question: "The most effective strategy to prevent device-related infections is to:",
        options: ["Use prophylactic antibiotics continuously", "Remove the device when no longer clinically necessary", "Change devices every 24 hours", "Apply topical antibiotics to insertion sites"],
        correct: 1,
        rationale: "Removing unnecessary devices eliminates the biofilm substrate and is the most effective prevention strategy."
      },
      {
        question: "Before accessing a central venous catheter, the nurse should:",
        options: ["Flush with heparin first", "Scrub the hub with alcohol for 15 seconds", "Apply sterile gloves only", "Cap the line with a sterile cover"],
        correct: 1,
        rationale: "Scrubbing the hub for 15 seconds with alcohol before each access removes contaminants and prevents CLABSI."
      }
    ]
  },
  "environmental-disinfection-rpn": {
    title: "Environmental Cleaning and Disinfection",
    cellular: {
      title: "Environmental Pathogen Survival and Decontamination Science",
      content: "Environmental surfaces in healthcare settings serve as reservoirs for pathogenic microorganisms, contributing to indirect contact transmission. MRSA survives on surfaces for days to weeks, VRE for days to months, C. difficile spores for up to 5 months, and norovirus for up to 2 weeks. High-touch surfaces (bed rails, call lights, bedside tables, doorknobs, light switches, IV pumps) harbor the highest pathogen loads and require more frequent disinfection. The Spaulding classification categorizes medical equipment decontamination: critical items (entering sterile tissue) require sterilization, semi-critical items (contacting mucous membranes) require high-level disinfection, and non-critical items (contacting intact skin) require low-level disinfection. Terminal cleaning of isolation rooms requires enhanced disinfection protocols. Emerging technologies include UV-C light devices and hydrogen peroxide vapor systems for adjunctive terminal disinfection."
    },
    riskFactors: [
      "Inadequate cleaning frequency of high-touch surfaces",
      "Incorrect dilution of disinfectant solutions",
      "Insufficient contact time for disinfectant to kill pathogens",
      "Failure to perform terminal cleaning after patient discharge",
      "Shared equipment not disinfected between patients"
    ],
    diagnostics: [
      "ATP bioluminescence testing for surface cleanliness verification",
      "Fluorescent marker testing to evaluate cleaning thoroughness",
      "Environmental cultures for outbreak investigation",
      "Compliance monitoring of cleaning protocols"
    ],
    management: [
      "Use EPA-registered hospital-grade disinfectants with appropriate contact time",
      "Clean from least contaminated to most contaminated areas",
      "Perform terminal cleaning with enhanced disinfection for isolation rooms",
      "Validate cleaning effectiveness through monitoring programs"
    ],
    nursingActions: [
      "Disinfect shared patient equipment between uses (stethoscopes, glucometers, BP cuffs)",
      "Wipe high-touch surfaces in patient areas at prescribed intervals",
      "Verify appropriate disinfectant is used for specific organisms (sporicidal for C. diff)",
      "Ensure proper contact time is achieved before wiping surfaces dry",
      "Report environmental cleaning concerns to appropriate personnel"
    ],
    signs: {
      left: [
        "Visibly clean patient environment with scheduled disinfection completed",
        "Appropriate disinfectants available at point of care",
        "Staff demonstrate proper disinfection technique and contact time",
        "Low healthcare-associated infection rates on unit"
      ],
      right: [
        "Visibly soiled surfaces and equipment in patient areas",
        "Expired or incorrectly diluted disinfectant solutions",
        "No cleaning log documentation or compliance monitoring",
        "Outbreak of environmental organism (C. diff, norovirus) on unit"
      ]
    },
    medications: [
      {
        name: "Sodium Hypochlorite (Bleach) Solution",
        type: "Sporicidal surface disinfectant",
        action: "Oxidizes microbial proteins and nucleic acids; effective against C. difficile spores at appropriate concentration",
        sideEffects: "Skin and mucous membrane irritation, corrosive to metals, respiratory irritation from fumes",
        contra: "Do not mix with ammonia or other cleaners (produces toxic chloramine gas)",
        pearl: "1:10 bleach dilution is required for C. difficile spore killing; standard quaternary ammonium disinfectants do NOT kill C. diff spores."
      }
    ],
    pearls: [
      "Standard quaternary ammonium disinfectants do NOT kill C. difficile spores - use bleach-based or EPA-registered sporicidal products",
      "Contact time matters more than scrubbing intensity - allow disinfectant to remain wet on the surface for the labeled time",
      "The patient admitted to a room previously occupied by a C. diff or MRSA patient has increased infection risk if terminal cleaning was inadequate"
    ],
    quiz: [
      {
        question: "C. difficile spores on surfaces require disinfection with:",
        options: ["Standard quaternary ammonium cleaner", "Bleach-based sporicidal solution", "Alcohol-based wipes", "Plain soap and water"],
        correct: 1,
        rationale: "C. difficile forms resistant spores that are NOT killed by standard quaternary ammonium disinfectants; sporicidal agents like bleach are required."
      },
      {
        question: "High-touch surfaces in patient rooms include:",
        options: ["Window sills and wall moldings", "Bed rails, call lights, and bedside tables", "Floor under the bed", "Ceiling tiles"],
        correct: 1,
        rationale: "High-touch surfaces (bed rails, call lights, tables) are most frequently contacted and harbor the highest pathogen loads."
      },
      {
        question: "For a disinfectant to be effective, the surface must remain wet for:",
        options: ["5 seconds", "The manufacturer's recommended contact time", "Until the nurse wipes it dry", "1 second is sufficient"],
        correct: 1,
        rationale: "Disinfectants require specific contact time (wet dwell time) as specified by the manufacturer to achieve microbial kill."
      }
    ]
  },
  "outbreak-management-rpn": {
    title: "Outbreak Management",
    cellular: {
      title: "Epidemiological Investigation and Outbreak Control",
      content: "A disease outbreak is defined as the occurrence of cases of disease in excess of normal expectancy for a given population, time, and place. Outbreaks in healthcare settings may involve patients, staff, or visitors and require coordinated response from infection prevention, nursing, administration, and public health authorities. Outbreak investigation follows systematic steps: verify the diagnosis, establish case definition, identify and count cases, orient data by time (epidemic curve), place, and person, develop hypotheses, implement control measures, and evaluate effectiveness. Common healthcare-associated outbreaks involve norovirus gastroenteritis, C. difficile, influenza, MRSA clusters, and scabies. The epidemic curve (epidemiological graph of cases over time) helps identify the outbreak pattern: point source (common exposure), propagated (person-to-person), or continuous source. Nurses play a critical role in surveillance, reporting, implementing control measures, and patient cohorting."
    },
    riskFactors: [
      "Close quarters and shared facilities in healthcare settings",
      "Lapses in hand hygiene and isolation precautions",
      "Introduction of novel pathogen by new admission or visitor",
      "Understaffing leading to cross-contamination between patients",
      "Delayed recognition and reporting of initial cases"
    ],
    diagnostics: [
      "Laboratory confirmation of causative organism in affected patients",
      "Environmental sampling of suspected sources",
      "Staff symptom surveillance and testing as indicated",
      "Epidemiological analysis with attack rate calculations"
    ],
    management: [
      "Implement enhanced infection control measures immediately upon suspicion",
      "Cohort affected patients and assign dedicated staff when possible",
      "Restrict admissions or transfers from affected unit if necessary",
      "Report to public health authorities as required by law"
    ],
    nursingActions: [
      "Report clusters of similar symptoms to charge nurse and infection prevention immediately",
      "Implement enhanced cleaning and isolation precautions per outbreak protocol",
      "Maintain accurate patient and staff illness logs during outbreak",
      "Restrict ill healthcare workers from patient care until cleared",
      "Communicate outbreak status and precautions to patients, families, and staff"
    ],
    signs: {
      left: [
        "Baseline infection rates within expected norms",
        "Timely recognition of initial cases with prompt reporting",
        "Effective control measures implemented with decreasing case count",
        "Outbreak declared over with return to baseline rates"
      ],
      right: [
        "Increasing number of cases above expected baseline",
        "Cases clustering by time, place, or person suggesting transmission",
        "Multiple staff members reporting similar symptoms",
        "Ongoing transmission despite initial control measures"
      ]
    },
    medications: [
      {
        name: "Oral Rehydration Solution (for norovirus outbreak)",
        type: "Electrolyte replacement",
        action: "Replaces fluid and electrolytes lost through vomiting and diarrhea using sodium-glucose co-transport mechanism",
        sideEffects: "Nausea if consumed too rapidly; hypernatremia if improperly mixed",
        contra: "Severe vomiting requiring IV fluids; altered consciousness preventing safe oral intake",
        pearl: "Norovirus is the most common cause of healthcare-associated gastroenteritis outbreaks; alcohol hand rub is ineffective - use soap and water."
      }
    ],
    pearls: [
      "Two or more cases of the same infection linked in time and place should trigger outbreak investigation",
      "The epidemic curve is the most useful tool for understanding the outbreak pattern and timing of transmission",
      "Early recognition and reporting of case clusters is the nurse's most important role in outbreak management"
    ],
    quiz: [
      {
        question: "An outbreak is defined as:",
        options: ["A single case of infectious disease", "Cases exceeding normal expectancy for a population, time, and place", "Any hospital-acquired infection", "A seasonal increase in common cold"],
        correct: 1,
        rationale: "An outbreak is the occurrence of disease cases exceeding what is normally expected in a given population, time, and place."
      },
      {
        question: "When multiple patients on a unit develop diarrhea within 48 hours, the nurse should first:",
        options: ["Wait to see if more cases develop", "Report the cluster to infection prevention immediately", "Start antibiotics empirically", "Transfer patients to other units"],
        correct: 1,
        rationale: "Prompt reporting of case clusters allows early investigation and implementation of control measures."
      },
      {
        question: "During a norovirus outbreak, hand hygiene should be performed with:",
        options: ["Alcohol-based hand rub", "Soap and water with friction", "Hand sanitizer wipes", "Chlorhexidine only"],
        correct: 1,
        rationale: "Norovirus is resistant to alcohol; soap and water with friction is required to mechanically remove viral particles."
      }
    ]
  },
  "bloodborne-pathogen-safety-rpn": {
    title: "Bloodborne Pathogen Safety",
    cellular: {
      title: "Bloodborne Pathogen Transmission and Prevention",
      content: "Bloodborne pathogens are microorganisms present in human blood and other potentially infectious materials (OPIM) that can cause disease in humans. The three primary bloodborne pathogens of concern in healthcare are hepatitis B virus (HBV), hepatitis C virus (HCV), and human immunodeficiency virus (HIV). OSHA's Bloodborne Pathogens Standard (29 CFR 1910.1030) mandates employer protections including exposure control plans, engineering controls, PPE provision, HBV vaccination, and post-exposure evaluation. Blood is the primary exposure source, but OPIM includes semen, vaginal secretions, cerebrospinal fluid, synovial fluid, pleural fluid, peritoneal fluid, amniotic fluid, and any body fluid visibly contaminated with blood. Universal precautions treat ALL blood and OPIM as potentially infectious regardless of the source patient's known infection status. Hepatitis B vaccination provides >95% protection and is required for all healthcare workers with occupational exposure risk."
    },
    riskFactors: [
      "Percutaneous injury (needlestick) with contaminated sharp",
      "Mucous membrane splash exposure to blood or OPIM",
      "Non-intact skin contact with blood or OPIM",
      "Failure to use appropriate PPE during exposure-prone procedures",
      "Unvaccinated status against hepatitis B"
    ],
    diagnostics: [
      "Source patient rapid testing for HBV, HCV, and HIV",
      "Exposed worker baseline HBV surface antibody, HCV antibody, and HIV testing",
      "Follow-up testing per CDC post-exposure protocol at 6 weeks, 3 months, 6 months",
      "Hepatitis B surface antibody titer to confirm immunity"
    ],
    management: [
      "Immediate wound care: wash with soap and water; flush mucous membranes with water",
      "Report exposure to supervisor and occupational health within 1-2 hours",
      "Initiate post-exposure prophylaxis within recommended timeframes",
      "Ensure source patient and exposed worker testing is completed"
    ],
    nursingActions: [
      "Comply with standard precautions for all patient care activities",
      "Verify HBV vaccination status and antibody response",
      "Use safety-engineered sharps devices and dispose properly",
      "Report any blood or body fluid exposure immediately",
      "Complete annual bloodborne pathogen training per OSHA requirements"
    ],
    signs: {
      left: [
        "HBV antibody titer ≥ 10 mIU/mL confirming immunity",
        "Consistent use of standard precautions and PPE",
        "No occupational exposures during reporting period",
        "All staff current on bloodborne pathogen training"
      ],
      right: [
        "Needlestick or sharps injury has occurred",
        "Mucous membrane splash exposure to blood",
        "Source patient positive for HBV, HCV, or HIV",
        "Exposed worker anxiety and need for counseling"
      ]
    },
    medications: [
      {
        name: "Hepatitis B Immune Globulin (HBIG)",
        type: "Passive immunization",
        action: "Provides immediate passive antibody protection against HBV after exposure in non-immune individuals",
        sideEffects: "Injection site pain, headache, fatigue, low-grade fever",
        contra: "Severe allergic reaction to prior HBIG dose",
        pearl: "Must be administered within 24 hours of exposure for maximum effectiveness; given with HBV vaccine series for non-immune exposed workers."
      }
    ],
    pearls: [
      "Hepatitis B vaccination is the most important protection against the most transmissible bloodborne pathogen",
      "All three primary BBPs (HBV, HCV, HIV) are NOT transmitted through casual contact, shared food, or respiratory droplets",
      "Post-exposure testing timeline: baseline, 6 weeks, 3 months, 6 months - ensure follow-up completion"
    ],
    quiz: [
      {
        question: "Which bloodborne pathogen has an effective preventive vaccine?",
        options: ["HIV", "Hepatitis C", "Hepatitis B", "All three have vaccines"],
        correct: 2,
        rationale: "Hepatitis B is the only BBP with an effective vaccine; HBV vaccination is required for all healthcare workers with exposure risk."
      },
      {
        question: "OSHA's Bloodborne Pathogens Standard requires employers to provide which of the following to at-risk employees?",
        options: ["Annual HIV testing", "Hepatitis B vaccination at no cost", "Monthly blood draws", "Prophylactic antibiotics"],
        correct: 1,
        rationale: "OSHA mandates that employers offer HBV vaccination free of charge to all employees with occupational exposure risk."
      },
      {
        question: "After a blood splash to the eyes, the nurse should immediately:",
        options: ["Apply antibiotic ointment to the eyes", "Flush eyes with water or saline for 15 minutes", "Close eyes and wait", "Apply alcohol to the periorbital area"],
        correct: 1,
        rationale: "Mucous membrane exposures require immediate flushing with water or saline to dilute and remove infectious material."
      }
    ]
  }
};
