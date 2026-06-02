import type { LessonContent } from "./types";

export const rnInfectionControlExpansionLessons: Record<string, LessonContent> = {
  "standard-precautions-rn": {
    title: "Standard Precautions: Universal Infection Prevention",
    cellular: {
      title: "Standard Precautions: Scientific Basis and Implementation",
      content: "Standard precautions are infection prevention practices applied to ALL patient care regardless of suspected or confirmed infection status, based on the principle that all blood, body fluids (except sweat), non-intact skin, and mucous membranes may contain transmissible infectious agents. The concept evolved from Universal Precautions (blood and body fluids) and Body Substance Isolation into the current comprehensive approach. The chain of infection requires six links: infectious agent (pathogen), reservoir (where the organism lives), portal of exit (how it leaves the reservoir), mode of transmission (contact, droplet, airborne, vehicle, vector), portal of entry (how it enters the new host), and susceptible host (immunocompromised, chronic disease, extremes of age). Standard precautions interrupt this chain at multiple points: hand hygiene breaks the mode of transmission, PPE prevents portal of entry, and respiratory hygiene/cough etiquette reduces portal of exit. Healthcare-associated infections (HAIs) affect 1 in 31 hospital patients on any given day, causing approximately 99,000 deaths annually in the US. The most common HAIs are catheter-associated UTIs (CAUTI), central line-associated bloodstream infections (CLABSI), surgical site infections (SSI), and ventilator-associated pneumonia (VAP)."
    },
    riskFactors: [
      "Invasive devices: urinary catheters, central venous catheters, mechanical ventilation",
      "Surgical procedures with tissue disruption",
      "Immunosuppression: chemotherapy, transplant, HIV/AIDS, corticosteroids",
      "Extremes of age: neonates and elderly with declining immunity",
      "Prolonged hospitalization increasing exposure to resistant organisms",
      "Poor hand hygiene compliance among healthcare workers",
      "Antibiotic overuse promoting resistant organisms (MRSA, VRE, C. diff)",
      "Chronic diseases: diabetes, renal failure, liver disease"
    ],
    diagnostics: [
      "Surveillance cultures for high-risk patients: MRSA nasal swab, VRE rectal swab per institutional protocol",
      "Monitor HAI rates: CLABSI, CAUTI, SSI, VAP per NHSN (National Healthcare Safety Network) definitions",
      "Hand hygiene compliance auditing using direct observation methodology",
      "Environmental cultures when outbreak investigation indicates environmental reservoir",
      "Antibiogram analysis to guide empiric antibiotic therapy and track resistance patterns",
      "Monitor antibiotic utilization metrics for stewardship programs"
    ],
    management: [
      "Hand hygiene: alcohol-based hand rub (ABHR) or soap and water before and after every patient contact",
      "Use soap and water (NOT ABHR) for: C. diff, visibly soiled hands, after using the restroom",
      "PPE selection based on anticipated exposure: gloves, gown, mask, eye protection",
      "Respiratory hygiene: provide masks and tissues to coughing patients in waiting areas",
      "Sharps safety: never recap needles, use safety-engineered devices, immediately dispose in sharps container",
      "Environmental cleaning: terminal cleaning of rooms, high-touch surface disinfection between patients"
    ],
    nursingActions: [
      "Perform hand hygiene at 5 WHO moments: before patient contact, before aseptic task, after body fluid exposure, after patient contact, after touching patient surroundings",
      "Select appropriate PPE before entering patient area: gloves for potential body fluid contact, gown for splash risk, mask and eye protection for aerosol-generating procedures",
      "Remove PPE in correct sequence: gloves first, hand hygiene, gown, eye protection, mask, hand hygiene",
      "Handle soiled linen with minimal agitation to prevent aerosolization of organisms",
      "Use no-touch technique for wound care and sterile procedures",
      "Properly dispose of sharps immediately after use in designated puncture-resistant containers",
      "Educate patients and families on hand hygiene and infection prevention measures",
      "Report needlestick injuries and body fluid exposures immediately per institutional protocol",
      "Practice daily assessment of necessity for invasive devices: remove catheters and lines as soon as clinically indicated"
    ],
    assessmentFindings: [
      "Signs of HAI: fever, new onset confusion, localized redness/swelling at device sites",
      "CLABSI indicators: fever, chills, erythema or purulence at central line insertion site",
      "CAUTI indicators: fever, new onset confusion in elderly, cloudy/malodorous urine",
      "SSI indicators: wound erythema, warmth, purulent drainage, dehiscence",
      "VAP indicators: new infiltrate on CXR, fever, purulent secretions, declining oxygenation"
    ],
    signs: {
      left: [
        "Hand hygiene compliance as measured by auditing",
        "Proper PPE selection and sequence",
        "Correct sharps disposal in designated containers",
        "Daily assessment of device necessity"
      ],
      right: [
        "CLABSI: fever, bacteremia from central line",
        "CAUTI: fever, pyuria, bacteriuria with catheter",
        "SSI: wound erythema, drainage, dehiscence",
        "VAP: new infiltrate, purulent secretions, fever"
      ]
    },
    medications: [
      { name: "Chlorhexidine Gluconate (CHG)", type: "Antiseptic Agent", action: "Broad-spectrum antimicrobial disrupting cell membranes of gram-positive and gram-negative bacteria, fungi, and some viruses. Persistent residual activity on skin for hours after application", sideEffects: "Skin irritation, allergic contact dermatitis, rare anaphylaxis, ototoxicity (avoid in ears)", contra: "Allergy to CHG, use near ears/eyes, neonates <2 months (limited data)", pearl: "CHG daily bathing of ICU patients reduces CLABSI and MRSA acquisition by 30-40%. Use 2% CHG cloths for daily baths. Allow to air dry for antimicrobial effect. Never use near ears—ototoxic." },
      { name: "Alcohol-Based Hand Rub (ABHR)", type: "Hand Antiseptic", action: "60-95% ethanol or isopropanol denatures proteins of microorganisms on skin. More effective than soap and water for most situations with faster application time", sideEffects: "Skin dryness (emollients in formulation minimize this)", contra: "C. difficile exposure (spores resist alcohol), visibly soiled hands, after using restroom", pearl: "Apply enough product to cover all hand surfaces. Rub for at least 20 seconds until hands are dry. Do NOT wipe off or towel dry. Alcohol does NOT kill C. diff spores—use soap and water instead." }
    ],
    pearls: [
      "Alcohol-based hand rub does NOT kill C. difficile spores—use SOAP AND WATER for known or suspected C. diff patients",
      "The correct PPE removal sequence prevents self-contamination: Gloves → Hand hygiene → Gown → Eye protection → Mask → Hand hygiene",
      "NEVER recap a used needle—this is the most common cause of needlestick injuries",
      "CHG daily bathing in ICU patients reduces CLABSI and MRSA acquisition significantly—it is an evidence-based bundle component",
      "The #1 infection prevention measure is hand hygiene—yet compliance averages only 40-60% among healthcare workers",
      "Remove unnecessary invasive devices daily: 'Do they still need the Foley? Do they still need the central line?' This is the most effective HAI prevention strategy"
    ],
    quiz: [
      { question: "A nurse is caring for a patient with C. difficile infection. Which hand hygiene method is appropriate?", options: ["Alcohol-based hand rub for 20 seconds", "Soap and water for at least 20 seconds", "Either method is equally effective", "Hand hygiene is not necessary if gloves are worn"], correct: 1, rationale: "C. difficile produces spores that are resistant to alcohol. Soap and water with friction is required to physically remove the spores from hands. ABHR is NOT effective against C. diff spores." },
      { question: "In which order should PPE be REMOVED after patient care?", options: ["Mask → Gown → Gloves → Eye protection", "Gloves → Hand hygiene → Gown → Eye protection → Mask → Hand hygiene", "Gown → Gloves → Mask → Eye protection", "Eye protection → Mask → Gloves → Gown"], correct: 1, rationale: "Correct PPE removal: Gloves first (most contaminated), hand hygiene, gown (untie and roll away from body), eye protection, mask (remove by straps/ties), final hand hygiene. This sequence minimizes self-contamination." },
      { question: "What is the most effective nursing intervention to prevent healthcare-associated infections?", options: ["Administering prophylactic antibiotics to all patients", "Performing hand hygiene at the 5 WHO moments", "Wearing gloves for all patient contact", "Using antimicrobial air filtration systems"], correct: 1, rationale: "Hand hygiene is the single most effective measure to prevent HAIs. The 5 WHO moments define when hand hygiene should be performed: before patient contact, before aseptic task, after body fluid exposure, after patient contact, after touching patient surroundings." }
    ]
  },

  "clabsi-prevention-rn": {
    title: "CLABSI Prevention: Central Line Bundle",
    cellular: {
      title: "Central Line-Associated Bloodstream Infection Pathophysiology",
      content: "Central line-associated bloodstream infection (CLABSI) occurs when microorganisms colonize the central venous catheter and enter the bloodstream, causing bacteremia or sepsis. Four pathways of contamination exist: extraluminal migration of skin organisms along the external catheter surface from the insertion site (most common in short-term catheters, usually within 10 days); intraluminal contamination through the catheter hub from manipulation without proper aseptic technique (most common after 10 days); hematogenous seeding from a distant infection site to the catheter tip biofilm; and rarely, contaminated infusate. Staphylococcus epidermidis and Staphylococcus aureus are the most common causative organisms, followed by Enterococcus, Candida, and gram-negative bacilli. Once bacteria adhere to the catheter surface, they produce a glycocalyx biofilm matrix that protects them from antibiotics and host immune defenses, making catheter removal often necessary for cure. CLABSI mortality rates are 12-25%, with each infection adding $46,000 in healthcare costs and 7-10 days of additional hospitalization."
    },
    riskFactors: [
      "Femoral vein insertion site (highest infection risk; subclavian has lowest for non-tunneled catheters)",
      "Prolonged catheter dwell time without daily necessity assessment",
      "Break in aseptic technique during insertion or maintenance",
      "Multiple catheter lumens increasing manipulation frequency",
      "Immunosuppression: neutropenia, transplant, chemotherapy",
      "TPN (total parenteral nutrition) administration (Candida risk)",
      "Frequent blood draws through the catheter",
      "Poor hand hygiene and hub hygiene compliance"
    ],
    diagnostics: [
      "Blood cultures drawn from the catheter AND from a peripheral site simultaneously",
      "Differential time to positivity: catheter blood culture positive ≥2 hours before peripheral suggests CLABSI",
      "Monitor for systemic infection signs: fever, chills, rigors, hypotension",
      "Assess insertion site daily: erythema, tenderness, purulent drainage",
      "CBC with differential: leukocytosis with left shift",
      "Procalcitonin level to differentiate bacterial infection from other causes of fever"
    ],
    management: [
      "Prevention bundle insertion: hand hygiene, maximal sterile barrier, CHG skin prep, optimal site selection, checklist with empowered observer",
      "Prevention bundle maintenance: daily necessity assessment, hub scrubbing, CHG dressing changes, daily CHG bathing",
      "Suspected CLABSI: draw blood cultures (paired sets), initiate empiric antibiotics per protocol",
      "Catheter removal for: confirmed CLABSI with S. aureus, Candida, or persistent bacteremia",
      "Antibiotic lock therapy: may be considered for uncomplicated CLABSI with coagulase-negative staph if catheter salvage needed",
      "Duration of treatment: S. aureus CLABSI requires 4-6 weeks IV antibiotics and echocardiography to rule out endocarditis"
    ],
    nursingActions: [
      "Perform daily assessment of central line necessity: 'Does this patient still need this line today?'",
      "Scrub the hub: disinfect all catheter access ports with 70% alcohol or CHG-alcohol for at least 15 seconds before each access",
      "Allow antiseptic to dry completely before accessing the line",
      "Change CHG-impregnated dressings every 7 days or when soiled, damp, or loose",
      "Change transparent dressings every 7 days and gauze dressings every 2 days",
      "Perform daily CHG bathing for patients with central lines in ICU settings",
      "Use needleless connectors and cap changes per protocol (every 96 hours or per manufacturer)",
      "During insertion: ensure maximal sterile barriers (full drape, cap, mask, sterile gown, sterile gloves for inserter)",
      "Empower nurses to stop the procedure if sterile technique is breached",
      "Document dressing changes, site assessment, and daily necessity assessment"
    ],
    assessmentFindings: [
      "Insertion site: clean and dry with intact transparent dressing (normal)",
      "Signs of local infection: erythema, warmth, tenderness, purulent drainage at insertion site",
      "Systemic signs: fever, chills, rigors occurring during or shortly after line access",
      "Hemodynamic instability: new-onset hypotension in a patient with central line",
      "Positive blood cultures with no other identified source of infection"
    ],
    signs: {
      left: [
        "Clean, dry insertion site with intact dressing",
        "No erythema, tenderness, or drainage",
        "Patient afebrile without systemic signs",
        "Hub accessed with proper scrub technique"
      ],
      right: [
        "Purulent drainage from insertion site",
        "Fever, rigors with line access or flushing",
        "Positive blood cultures without other source",
        "Hemodynamic instability suggesting sepsis"
      ]
    },
    medications: [
      { name: "Vancomycin IV", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis by binding D-alanyl-D-alanine. Empiric coverage for gram-positive organisms (MRSA, coagulase-negative staph) in suspected CLABSI", sideEffects: "Red Man syndrome (histamine-mediated with rapid infusion), nephrotoxicity, ototoxicity", contra: "Known vancomycin allergy (rare)", pearl: "Infuse over at least 60 minutes (1 hour per gram) to prevent Red Man syndrome. Trough level target 15-20 mcg/mL for serious infections. S. aureus CLABSI requires 4-6 weeks of treatment and echocardiography." },
      { name: "Chlorhexidine (CHG) 2% Antiseptic", type: "Insertion Site Antiseptic", action: "Broad-spectrum antimicrobial applied to insertion site for skin antisepsis before central line placement and during dressing changes. CHG-impregnated dressings provide continuous antimicrobial protection", sideEffects: "Contact dermatitis, rare anaphylaxis", contra: "CHG allergy, use in neonates <2 months with caution", pearl: "Apply with friction for 30 seconds, allow to dry completely (2 minutes) before catheter insertion. CHG-impregnated transparent dressings (BioPatch) reduce CLABSI rates when used as part of the maintenance bundle." }
    ],
    pearls: [
      "The central line insertion bundle has FIVE elements: hand hygiene, maximal sterile barriers, CHG skin prep, optimal site selection (subclavian preferred), and a nurse-empowered observer with a checklist",
      "SCRUB THE HUB for at least 15 seconds before every access—this is the most important maintenance intervention",
      "S. aureus CLABSI requires catheter removal, 4-6 weeks of IV antibiotics, AND echocardiography to rule out endocarditis—this is NOT a short-course infection",
      "The nurse has the authority and OBLIGATION to stop the procedure if sterile technique is breached during insertion",
      "Daily necessity assessment is the most effective single intervention: if the patient doesn't need the line, remove it",
      "Red Man syndrome from vancomycin is histamine-mediated (not a true allergy)—slow the infusion rate"
    ],
    quiz: [
      { question: "What is the most effective nursing intervention to prevent CLABSI?", options: ["Prophylactic antibiotic administration", "Daily assessment of central line necessity and prompt removal when no longer needed", "Routine catheter replacement every 7 days", "Using only triple-lumen catheters"], correct: 1, rationale: "Daily assessment of necessity and removal of the line when it is no longer clinically needed is the single most effective CLABSI prevention strategy. Every day the line remains increases infection risk." },
      { question: "Before accessing a central venous catheter port, the nurse should:", options: ["Wipe the port with a dry gauze pad", "Scrub the hub with alcohol or CHG-alcohol for at least 15 seconds", "Flush with heparin before accessing", "Apply povidone-iodine to the insertion site"], correct: 1, rationale: "Hub scrubbing (scrub the hub) with 70% alcohol or CHG-alcohol for at least 15 seconds with friction is essential before every catheter access to prevent intraluminal contamination, the most common CLABSI pathway after 10 days." },
      { question: "During central line insertion, the nurse observes the physician touch the sterile field with ungloved hands. What should the nurse do?", options: ["Note the occurrence and document it after the procedure", "Stop the procedure and request the physician re-establish sterility", "Continue assisting as the procedure is almost complete", "Report the incident after the patient leaves"], correct: 1, rationale: "Nurses are empowered (and obligated) to stop the procedure if sterile technique is breached. This is a critical component of the CLABSI prevention insertion bundle—the checklist observer role includes stopping for breaches." }
    ]
  },

  "cauti-prevention-rn": {
    title: "CAUTI Prevention: Catheter-Associated UTI Bundle",
    cellular: {
      title: "Catheter-Associated Urinary Tract Infection Pathophysiology",
      content: "Catheter-associated urinary tract infection (CAUTI) is the most common healthcare-associated infection, accounting for approximately 75% of all hospital-acquired UTIs. The indwelling urinary catheter bypasses normal host defense mechanisms: the urethral sphincter, urinary flow flushing bacteria, and secretory IgA in urethral mucus. Bacteria colonize the catheter by two routes: extraluminal migration along the external catheter surface from periurethral colonization (most common in women, occurring within 24-48 hours) and intraluminal migration from contamination of the drainage system (inadequate drainage bag maintenance, disconnection of closed system). Within hours of catheter insertion, bacteria adhere to the catheter surface and form biofilm—a structured community of organisms embedded in an extracellular polysaccharide matrix that confers resistance to antibiotics and host immune responses. The biofilm provides a reservoir for ongoing bacteriuria. Escherichia coli is the most common pathogen, followed by Klebsiella, Enterococcus, Pseudomonas, and Candida (especially with antibiotic use). CAUTI risk increases approximately 3-7% per day of catheterization, making duration the single most important modifiable risk factor."
    },
    riskFactors: [
      "Duration of catheterization (risk increases 3-7% per catheter-day)",
      "Female sex (shorter urethra, periurethral colonization)",
      "Diabetes mellitus (glycosuria promoting bacterial growth)",
      "Older age with decreased immune function",
      "Break in closed drainage system (disconnection for any reason)",
      "Catheter insertion outside of sterile technique",
      "Lack of daily assessment of catheter necessity",
      "Inadequate perineal hygiene"
    ],
    diagnostics: [
      "CAUTI definition: catheter >2 days with new-onset fever (>38°C), urgency, frequency, or flank pain AND positive urine culture (≥10^5 CFU/mL with no more than 2 species)",
      "Do NOT culture urine routinely—only when signs/symptoms of infection present",
      "Avoid attributing fever to UTI without other sources being excluded (CAUTI is overdiagnosed)",
      "Pyuria alone does NOT diagnose CAUTI—bacteriuria with catheter is universal after 30 days",
      "Blood cultures if sepsis suspected from urinary source",
      "Monitor for signs of upper tract infection: flank pain, fever, costovertebral angle tenderness"
    ],
    management: [
      "PRIMARY prevention: avoid unnecessary catheter insertion—use alternatives first",
      "Appropriate catheter indications: acute urinary retention, perioperative use, accurate I&O in critically ill, sacral/perineal wounds, comfort care at end of life",
      "NOT appropriate: convenience for nursing care, management of incontinence alone, prolonged immobility alone",
      "Daily catheter necessity assessment: remove as soon as indication resolved",
      "CAUTI treatment: remove or replace catheter BEFORE starting antibiotics (biofilm harbors resistant organisms)",
      "Antibiotic selection based on culture and sensitivity (empiric: fluoroquinolone or cephalosporin per local antibiogram)"
    ],
    nursingActions: [
      "Question every catheter insertion: 'Does this patient have an appropriate indication?'",
      "Insert using sterile technique with aseptic catheter insertion kit",
      "Perform daily assessment: 'Does this patient still need this catheter today?'",
      "Maintain a CLOSED drainage system—never disconnect unless changing the system",
      "Keep drainage bag below the level of the bladder at ALL times",
      "Empty drainage bag when 2/3 full using a clean, individualized collection container",
      "Perform routine meatal hygiene with soap and water during daily bathing (no special antiseptic needed)",
      "Secure catheter to thigh (women) or lower abdomen (men) to prevent traction and urethral trauma",
      "Use catheter alternatives when possible: intermittent catheterization, external condom catheter, bladder scanner for retention",
      "Do NOT routinely irrigate catheters or use antiseptic solutions in the drainage bag"
    ],
    assessmentFindings: [
      "Cloudy, malodorous urine (may represent colonization, not necessarily infection)",
      "New-onset fever without other identifiable source",
      "Suprapubic tenderness or discomfort",
      "New-onset confusion in elderly (altered mental status may be only sign)",
      "Flank pain and costovertebral angle tenderness (upper tract involvement)"
    ],
    signs: {
      left: [
        "Clear, yellow urine with adequate output",
        "Patent catheter without kinking",
        "Drainage bag below bladder level",
        "Secure catheter fixation without traction"
      ],
      right: [
        "Fever with no other identified source",
        "Cloudy, concentrated, or malodorous urine",
        "New-onset confusion (especially in elderly)",
        "Flank pain suggesting pyelonephritis"
      ]
    },
    medications: [
      { name: "Ciprofloxacin", type: "Fluoroquinolone Antibiotic", action: "Inhibits DNA gyrase and topoisomerase IV, bactericidal against gram-negative organisms. Commonly used for complicated UTIs including CAUTI", sideEffects: "Tendon rupture (especially with corticosteroids), QT prolongation, C. diff risk, photosensitivity, CNS effects", contra: "Concurrent tizanidine use, myasthenia gravis (may worsen), children/adolescents (tendon effects)", pearl: "FDA black box warning for tendon rupture, peripheral neuropathy, and CNS effects. Reserve for when benefits outweigh risks. Remove or replace the catheter BEFORE starting antibiotics—biofilm-embedded organisms will persist." },
      { name: "Nitrofurantoin (Macrobid)", type: "Urinary Antiseptic", action: "Damages bacterial DNA by generating reactive oxygen species. Concentrated in urine making it effective for uncomplicated lower UTIs. NOT effective for upper tract infections (does not achieve adequate tissue levels)", sideEffects: "GI upset, pulmonary toxicity (chronic use), peripheral neuropathy, hemolytic anemia in G6PD deficiency", contra: "CrCl <30 mL/min (ineffective), G6PD deficiency, pregnancy at term (36-42 weeks)", pearl: "Only for lower tract UTIs—not CAUTI with systemic symptoms. Take with food to improve absorption and reduce GI effects. Do not use for pyelonephritis—it does not reach therapeutic tissue levels." }
    ],
    pearls: [
      "The BEST way to prevent CAUTI is to NOT insert a catheter in the first place—always consider alternatives",
      "Catheter duration is the SINGLE most important modifiable risk factor—remove as soon as indication resolves",
      "Asymptomatic bacteriuria in a catheterized patient should NOT be treated with antibiotics (it is universal after 30 days and treatment promotes resistance)",
      "ALWAYS remove or replace the catheter BEFORE starting antibiotics for CAUTI—the biofilm on the old catheter harbors resistant organisms",
      "Keep the drainage bag BELOW the bladder at all times—never elevate above the bladder or hang on the bed rail above patient level",
      "Routine catheter irrigation, antiseptic installations, and antimicrobial-coated catheters have NOT been shown to reduce CAUTI in most studies"
    ],
    quiz: [
      { question: "A catheterized patient has cloudy, foul-smelling urine but is afebrile with no other symptoms. What should the nurse do?", options: ["Start empiric antibiotics immediately", "Send a urine culture and start antibiotics while waiting for results", "Ensure adequate hydration and continue to monitor—asymptomatic bacteriuria with a catheter should not be treated", "Remove the catheter and send it for culture"], correct: 2, rationale: "Asymptomatic bacteriuria in a catheterized patient should NOT be treated with antibiotics. Cloudy or malodorous urine without systemic symptoms does not meet CAUTI criteria. Treatment promotes resistance without benefit." },
      { question: "What is the single most important nursing action to prevent CAUTI?", options: ["Using antimicrobial-coated catheters", "Irrigating the catheter daily with antiseptic solution", "Performing daily assessment of catheter necessity and removing when no longer indicated", "Changing the catheter every 14 days"], correct: 2, rationale: "Daily catheter necessity assessment with removal as soon as the indication resolves is the most effective CAUTI prevention strategy. Each day of catheterization increases infection risk by 3-7%." },
      { question: "Before starting antibiotics for suspected CAUTI, the nurse should anticipate which action?", options: ["Irrigating the existing catheter with antibiotic solution", "Removing or replacing the urinary catheter", "Obtaining a CT scan of the abdomen", "Administering a urinary analgesic"], correct: 1, rationale: "The catheter should be removed or replaced BEFORE starting antibiotics for CAUTI. The biofilm on the existing catheter harbors organisms that are protected from antibiotics, making treatment less effective." }
    ]
  },

  "surgical-site-infection-prevention-rn": {
    title: "Surgical Site Infection Prevention: Evidence-Based Bundle",
    cellular: {
      title: "Surgical Site Infection Pathophysiology and Prevention Science",
      content: "Surgical site infections (SSI) result from microbial contamination of the surgical wound, most commonly from the patient's own skin or mucosal flora. The risk is determined by the interaction of three factors: microbial contamination dose, virulence of the organism, and host resistance. Wounds are classified by contamination level: Class I (Clean—2% SSI risk), Class II (Clean-Contaminated—10% risk, GI/GU/respiratory tract entered under controlled conditions), Class III (Contaminated—20% risk, open traumatic wound, gross spillage from GI tract), and Class IV (Dirty-Infected—40% risk, existing infection or perforated viscus). SSI classification includes superficial incisional (skin and subcutaneous tissue), deep incisional (fascia and muscle), and organ/space (any anatomic area opened during surgery). Staphylococcus aureus (including MRSA) is the most common SSI pathogen in clean surgeries, while polymicrobial infections with enteric gram-negatives and anaerobes dominate in contaminated procedures. Biofilm formation on surgical implants (prosthetic joints, mesh) creates persistent infection resistant to antibiotic therapy. The SSI prevention bundle addresses modifiable risk factors: glucose control reduces neutrophil dysfunction; normothermia maintains perfusion and immune function; appropriate antibiotic prophylaxis achieves tissue drug levels before contamination occurs."
    },
    riskFactors: [
      "Wound class III or IV (contaminated or dirty procedures)",
      "Diabetes with perioperative hyperglycemia (blood glucose >180 mg/dL)",
      "Obesity (BMI >30) with increased subcutaneous tissue dead space and poor perfusion",
      "Smoking impairs neutrophil function and tissue oxygenation",
      "Immunosuppression: corticosteroids, chemotherapy, transplant medications",
      "Prolonged operative time exceeding expected duration",
      "Hypothermia (<36°C) during surgery causing vasoconstriction and immune suppression",
      "Improper timing of prophylactic antibiotics"
    ],
    diagnostics: [
      "SSI surveillance using CDC/NHSN definitions and criteria",
      "Wound inspection: erythema >2cm from incision, warmth, tenderness, swelling, purulent drainage",
      "Wound cultures: obtain from deep tissue or aspirate, NOT superficial swab of wound surface",
      "CBC: leukocytosis with left shift indicating systemic response",
      "CRP and procalcitonin trending for treatment response monitoring",
      "CT or ultrasound if deep space infection or abscess suspected"
    ],
    management: [
      "Prophylactic antibiotic within 60 minutes before surgical incision (120 minutes for vancomycin/fluoroquinolones)",
      "Redose antibiotics for prolonged procedures (>4 hours for cefazolin) or significant blood loss",
      "Maintain perioperative glucose <180 mg/dL with insulin protocol",
      "Active warming to maintain core temperature ≥36°C throughout surgery",
      "CHG skin preparation with appropriate hair removal (clipping, NOT shaving)",
      "SSI treatment: open and drain wound, obtain deep cultures, targeted antibiotic therapy"
    ],
    nursingActions: [
      "Administer prophylactic antibiotic within the 60-minute window before incision (verify timing)",
      "Verify pre-operative CHG shower was completed (night before and morning of surgery)",
      "Use clippers (NOT razors) for hair removal at the surgical site if removal is necessary",
      "Monitor and maintain normothermia: forced-air warming blankets, warm IV fluids",
      "Monitor perioperative blood glucose: maintain <180 mg/dL with sliding scale or insulin drip",
      "Assess surgical wound per protocol: redness, drainage, warmth, tenderness, wound approximation",
      "Maintain sterile dressing over wound for 24-48 hours post-operatively unless otherwise ordered",
      "Educate patient on wound care, signs of infection, and when to seek medical attention",
      "Do NOT shave the surgical site—clipping is the only acceptable method of hair removal",
      "Document wound assessment findings and any changes from baseline"
    ],
    assessmentFindings: [
      "Normal healing: well-approximated incision with slight erythema at edges, serous drainage",
      "Superficial SSI: erythema, warmth, pain, purulent drainage from incision within 30 days",
      "Deep SSI: fever, wound dehiscence, deep tissue purulence within 30 days (90 days with implant)",
      "Organ/space SSI: systemic signs with abscess or infection in deep operative area",
      "Gas gangrene: crepitus, severe pain, rapid onset systemic toxicity (emergency)"
    ],
    signs: {
      left: [
        "Normal wound healing: approximated edges, minimal serous drainage",
        "Slight erythema at wound margins (normal inflammatory response)",
        "Dry, intact dressing without strike-through",
        "Patient afebrile with adequate pain control"
      ],
      right: [
        "Spreading erythema >2 cm from incision",
        "Purulent drainage (yellow-green, malodorous)",
        "Wound dehiscence or evisceration",
        "Fever, leukocytosis, increasing pain at wound site"
      ]
    },
    medications: [
      { name: "Cefazolin (Ancef)", type: "First-Generation Cephalosporin", action: "Bactericidal against common skin flora (S. aureus, streptococci). First-line surgical prophylaxis for most clean and clean-contaminated procedures", sideEffects: "Allergic reaction, diarrhea, C. diff risk, injection site phlebitis", contra: "Severe penicillin allergy (anaphylaxis—use vancomycin or clindamycin alternative)", pearl: "Must be administered within 60 minutes before surgical incision. Re-dose every 4 hours during surgery or after 1500 mL blood loss. Weight-based: 2g for <120kg, 3g for ≥120kg. Discontinue within 24 hours post-op—longer courses do NOT reduce SSI." },
      { name: "Mupirocin (Bactroban)", type: "Topical Antibiotic", action: "Inhibits bacterial isoleucyl-tRNA synthetase. Applied intranasally to decolonize MRSA carriers before surgery, reducing SSI risk in colonized patients", sideEffects: "Local irritation, burning sensation at application site", contra: "Allergy to mupirocin or polyethylene glycol base", pearl: "Apply to both nares BID for 5 days pre-operatively in confirmed MRSA carriers. Reduces SSI risk by 50% in cardiac and orthopedic surgery patients. Combined with CHG bathing for maximum decolonization effect." }
    ],
    pearls: [
      "Prophylactic antibiotics must be given WITHIN 60 minutes before incision—too early or too late significantly increases SSI risk",
      "NEVER shave the surgical site—shaving creates microabrasions that promote bacterial colonization. Use CLIPPERS only if hair removal is necessary",
      "Hypothermia (<36°C) increases SSI risk by 300%—maintain normothermia with active warming throughout the perioperative period",
      "Perioperative blood glucose >180 mg/dL impairs neutrophil function—maintain glucose control with insulin protocol",
      "Stop prophylactic antibiotics within 24 hours post-surgery—extended courses do NOT reduce SSI rates but DO promote resistance",
      "Pre-operative CHG bathing (night before and morning of surgery) significantly reduces skin bacterial counts and SSI rates"
    ],
    quiz: [
      { question: "When must prophylactic antibiotics be administered relative to surgical incision?", options: ["2 hours before incision", "Within 60 minutes before incision", "Immediately after incision", "Within 60 minutes after incision"], correct: 1, rationale: "Prophylactic antibiotics must be administered within 60 minutes before surgical incision to achieve adequate tissue drug levels at the time of potential contamination. Exception: vancomycin and fluoroquinolones require 120-minute infusion window." },
      { question: "The nurse is preparing a surgical site. What is the correct method of hair removal?", options: ["Shave with a disposable razor the morning of surgery", "Use electric clippers at the surgical site", "Apply depilatory cream the night before", "Remove hair with adhesive tape"], correct: 1, rationale: "Clipping is the only acceptable method of surgical site hair removal. Shaving creates microabrasions in the skin that promote bacterial colonization and significantly increase SSI risk. If hair does not interfere with the procedure, do not remove it." },
      { question: "Post-operative day 4, a patient's surgical wound shows erythema extending 3 cm from the incision, warmth, and purulent drainage. What classification of SSI is this?", options: ["Normal wound healing", "Superficial incisional SSI", "Deep incisional SSI", "Organ/space SSI"], correct: 1, rationale: "Superficial incisional SSI occurs within 30 days, involving skin and subcutaneous tissue with signs of infection (erythema, warmth, purulent drainage). Deep incisional SSI involves fascia and muscle layers, while organ/space involves the operative cavity." }
    ]
  },

  "vap-prevention-rn": {
    title: "VAP Prevention: Ventilator-Associated Pneumonia Bundle",
    cellular: {
      title: "Ventilator-Associated Pneumonia Pathophysiology",
      content: "Ventilator-associated pneumonia (VAP) develops >48 hours after endotracheal intubation and initiation of mechanical ventilation. The endotracheal tube (ETT) bypasses the natural defense mechanisms of the upper airway: the epiglottis, cough reflex, mucociliary clearance, and secretory IgA. The ETT cuff creates a sealed space above it where oropharyngeal secretions pool, forming a reservoir of pathogen-laden fluid. Microaspiration of these secretions around the cuff into the lower respiratory tract is the primary mechanism of VAP development—even well-inflated cuffs (25-30 cmH2O) do not prevent microscopic leakage through longitudinal folds in the cuff material. Early-onset VAP (within 4 days of intubation) is typically caused by community-acquired organisms (S. pneumoniae, H. influenzae, MSSA), while late-onset VAP (≥5 days) involves multidrug-resistant organisms (MRSA, Pseudomonas aeruginosa, Acinetobacter, ESBL-producing gram-negatives). The oropharyngeal flora shifts dramatically within 48 hours of ICU admission from normal flora to gram-negative bacilli colonization, providing the source organisms for aspiration. Biofilm forms on the inner surface of the ETT, creating a persistent bacterial reservoir that can shed organisms into the lower airway with each breath or suction pass."
    },
    riskFactors: [
      "Duration of mechanical ventilation (risk increases each day)",
      "Supine positioning facilitating aspiration of gastric and oropharyngeal secretions",
      "Reintubation increasing aspiration events",
      "Immunosuppression: corticosteroids, neutropenia, critical illness",
      "Chronic lung disease with impaired defense mechanisms",
      "Large-volume gastric aspiration or enteral feeding with high residuals",
      "Poor oral hygiene allowing bacterial overgrowth in the oropharynx",
      "Sedation reducing cough reflex and promoting aspiration"
    ],
    diagnostics: [
      "Clinical criteria: new or progressive infiltrate on CXR + at least 2 of: fever >38°C, leukocytosis or leukopenia, purulent secretions",
      "Obtain respiratory cultures BEFORE starting antibiotics: endotracheal aspirate or bronchoalveolar lavage (BAL)",
      "Blood cultures to assess for bacteremia",
      "CBC with differential, CRP, procalcitonin for infection trending",
      "Clinical Pulmonary Infection Score (CPIS) for diagnostic guidance",
      "Monitor oxygenation: declining PaO2/FiO2 ratio suggesting new parenchymal disease"
    ],
    management: [
      "VAP Prevention Bundle: head of bed elevation, daily sedation vacation, daily spontaneous breathing trial assessment, DVT prophylaxis, PUD prophylaxis",
      "Oral care with chlorhexidine 0.12% every 12 hours (reduces oropharyngeal colonization)",
      "Subglottic suctioning through specialized ETTs with dorsal suction port",
      "ETT cuff pressure maintenance at 25-30 cmH2O to prevent microaspiration",
      "Daily assessment of readiness to extubate: sedation vacation + spontaneous breathing trial",
      "Empiric antibiotics for suspected VAP based on local antibiogram and adjusted by culture results"
    ],
    nursingActions: [
      "Maintain head of bed elevation at 30-45 degrees at ALL times unless contraindicated",
      "Perform oral care with CHG 0.12% every 12 hours and oral suctioning every 2-4 hours",
      "Monitor ETT cuff pressure every 4-8 hours: maintain 25-30 cmH2O (too low allows aspiration, too high damages tracheal mucosa)",
      "Suction subglottic secretions (if ETT has subglottic port) before deflating cuff or repositioning",
      "Participate in daily sedation vacation and spontaneous breathing trial assessment",
      "Avoid unplanned extubation AND reintubation (both increase VAP risk)",
      "Maintain ventilator circuit: do not routinely change (change only when visibly soiled or malfunctioning)",
      "Drain condensate from ventilator circuit away from patient (toward drainage trap)",
      "Verify enteral feeding tube placement; maintain continuous feeding when tolerated over bolus",
      "Document bundle compliance and trending of clinical parameters"
    ],
    assessmentFindings: [
      "New fever (>38°C) after >48 hours of mechanical ventilation",
      "Increased and purulent tracheal secretions",
      "New or worsening pulmonary infiltrate on chest X-ray",
      "Declining oxygenation: increased FiO2 or PEEP requirements",
      "Leukocytosis or leukopenia"
    ],
    signs: {
      left: [
        "HOB elevated 30-45 degrees",
        "Clear tracheal secretions",
        "Stable or improving oxygenation",
        "Afebrile with normal WBC"
      ],
      right: [
        "New fever with purulent secretions",
        "New infiltrate on chest X-ray",
        "Declining PaO2/FiO2 ratio",
        "Increased ventilator requirements (FiO2, PEEP)"
      ]
    },
    medications: [
      { name: "Chlorhexidine 0.12% Oral Rinse", type: "Oral Antiseptic", action: "Reduces oropharyngeal bacterial colonization, decreasing the inoculum available for microaspiration around the ETT cuff. Part of the VAP prevention bundle", sideEffects: "Tooth staining, altered taste, mucosal irritation", contra: "Known CHG allergy", pearl: "Apply to all oral surfaces using suction toothbrush every 12 hours. Some recent studies have questioned benefit vs harm—follow your institution's current protocol. The oral microbiome disruption debate is ongoing." },
      { name: "Piperacillin-Tazobactam (Zosyn)", type: "Extended-Spectrum Penicillin/Beta-lactamase Inhibitor", action: "Broad-spectrum bactericidal activity against gram-positive, gram-negative (including Pseudomonas), and anaerobic organisms. Common empiric choice for late-onset VAP", sideEffects: "Diarrhea, rash, thrombocytopenia, C. diff risk, seizures at high doses", contra: "Penicillin anaphylaxis", pearl: "Extended infusion (4-hour infusion) improves time above MIC and clinical outcomes compared to standard 30-minute infusion. De-escalate to narrower spectrum once culture and sensitivity results available." }
    ],
    pearls: [
      "Head of bed at 30-45 degrees is the MOST important single VAP prevention measure—supine positioning facilitates aspiration of secretions pooled above the ETT cuff",
      "The ETT cuff does NOT create a perfect seal—microaspiration occurs through longitudinal folds in the cuff material even at proper pressure (25-30 cmH2O)",
      "Do NOT routinely change ventilator circuits—this does not reduce VAP and may increase risk by disrupting the system",
      "Daily sedation vacation + spontaneous breathing trial assessment is essential: the fastest way to prevent VAP is to EXTUBATE the patient",
      "Drain circuit condensate AWAY from the patient (toward the drainage trap)—condensate contains high concentrations of bacteria",
      "Oral care is nursing-driven VAP prevention—oropharyngeal decontamination with CHG and oral suctioning reduce bacterial load available for aspiration"
    ],
    quiz: [
      { question: "What position should the head of bed be maintained at for a mechanically ventilated patient?", options: ["Flat (0 degrees) for hemodynamic stability", "15 degrees for comfort", "30-45 degrees to reduce aspiration risk", "90 degrees (sitting upright)"], correct: 2, rationale: "Head of bed elevation at 30-45 degrees reduces aspiration of oropharyngeal and gastric secretions past the ETT cuff, which is the primary mechanism of VAP. This is the single most important VAP prevention measure." },
      { question: "The nurse checks ETT cuff pressure and finds it at 18 cmH2O. What is the appropriate action?", options: ["This is within normal range, no action needed", "Inflate the cuff to 25-30 cmH2O to prevent microaspiration", "Deflate the cuff completely and reinflate", "Document the finding and continue monitoring"], correct: 1, rationale: "Cuff pressure below 25 cmH2O allows excessive microaspiration of subglottic secretions into the lower airway. The nurse should inflate to 25-30 cmH2O. Pressure above 30 cmH2O can damage tracheal mucosa." },
      { question: "When should ventilator circuits be changed to prevent VAP?", options: ["Every 24 hours", "Every 48 hours", "Every 7 days routinely", "Only when visibly soiled or malfunctioning"], correct: 3, rationale: "Ventilator circuits should NOT be routinely changed on a set schedule. Studies show routine circuit changes do not reduce VAP and may increase risk by breaking the closed system. Change only when visibly contaminated or malfunctioning." }
    ]
  },

  "needle-stick-exposure-rn": {
    title: "Needlestick Injury & Bloodborne Pathogen Exposure",
    cellular: {
      title: "Bloodborne Pathogen Exposure: Risk Assessment and Post-Exposure Prophylaxis",
      content: "Needlestick and sharps injuries expose healthcare workers to bloodborne pathogens, primarily hepatitis B virus (HBV), hepatitis C virus (HCV), and human immunodeficiency virus (HIV). The risk of transmission per percutaneous exposure varies dramatically: HBV is the most infectious at 6-30% risk (depending on HBeAg status of source), HCV at 0.5-1.8%, and HIV at 0.3% for percutaneous and 0.09% for mucous membrane exposure. Factors that increase transmission risk include deep injury, visible blood on the device, device used for arterial or venous access, hollow-bore needle (vs. solid/suture needle), and high viral load in the source patient. The mechanism of viral transmission involves inoculation of infected blood through disrupted skin (needlestick, cut) or contact with mucous membranes (splash to eyes, nose, mouth). HIV targets CD4+ T lymphocytes and macrophages via the gp120-CD4 receptor interaction, establishing infection within 72 hours—the window for post-exposure prophylaxis (PEP) to interrupt viral integration into host DNA. HBV vaccination provides >95% protection with adequate anti-HBs titer (≥10 mIU/mL), making it the most preventable bloodborne occupational infection."
    },
    riskFactors: [
      "Recapping used needles (most common cause of needlestick injuries)",
      "Improper sharps disposal (overfilled containers, needles left in bed linens)",
      "Failure to use safety-engineered sharps devices",
      "Fatigue and rushing during procedures",
      "Hollow-bore needle injuries (higher blood inoculum than solid needles)",
      "Arterial or venous blood exposure (higher viral loads than capillary blood)",
      "Source patient with high viral load (HBV HBeAg+, HIV with detectable viral load)",
      "Unvaccinated HBV status of healthcare worker"
    ],
    diagnostics: [
      "Immediate source patient testing: HIV, HBV (HBsAg), HCV (anti-HCV) with consent or per institutional protocol",
      "Healthcare worker baseline testing: HIV, HBV (anti-HBs titer if vaccinated), HCV, CBC, CMP",
      "Follow-up testing: HIV at 6 weeks, 3 months, 6 months; HCV at 4-6 weeks (HCV RNA) and 4-6 months (anti-HCV)",
      "Assess exposure type: percutaneous (needle, sharp), mucous membrane (splash), or non-intact skin",
      "Determine device type: hollow-bore vs solid, needle gauge, depth of injury",
      "Identify body fluid involved: blood, bloody body fluid, CSF, semen, vaginal secretions"
    ],
    management: [
      "Immediate wound care: wash with soap and water (do NOT squeeze wound). Flush mucous membranes with water or saline",
      "Report exposure immediately to supervisor and occupational health",
      "Source patient testing: rapid HIV test with results within 1 hour for PEP decision-making",
      "HIV PEP: 3-drug ART regimen initiated within 72 hours (ideally within 2 hours). Duration: 28 days",
      "HBV: administer HBIG + HBV vaccine series if unvaccinated and source HBsAg positive",
      "HCV: no PEP available—monitor for seroconversion and treat if infected (DAA therapy cures >95%)"
    ],
    nursingActions: [
      "Wash wound immediately with soap and water for percutaneous exposure—do NOT use bleach, hydrogen peroxide, or squeeze",
      "Flush eyes, nose, or mouth with water or saline for mucous membrane exposure",
      "Report to supervisor and occupational health IMMEDIATELY—do not delay",
      "Complete incident report per institutional policy",
      "Facilitate rapid source patient testing (rapid HIV within 1 hour)",
      "Initiate HIV PEP within 2 hours if indicated—do NOT delay for source results if high-risk exposure",
      "Verify HBV vaccination status and anti-HBs titer of exposed worker",
      "Educate on follow-up testing schedule and importance of completing PEP if started",
      "Provide emotional support—needlestick injuries cause significant anxiety",
      "Prevention focus: use safety-engineered devices, activate safety mechanisms immediately after use, never recap needles"
    ],
    assessmentFindings: [
      "Puncture wound from needlestick or sharp",
      "Mucous membrane splash with blood or body fluid",
      "Non-intact skin contact with potentially infectious material",
      "Anxiety and distress related to potential exposure",
      "Assessment of source patient risk factors: IV drug use, HIV status, sexual history, hepatitis status"
    ],
    signs: {
      left: [
        "Puncture wound at exposure site",
        "Mucous membrane splash documented",
        "Source patient identified and testable",
        "Worker HBV vaccination status confirmed"
      ],
      right: [
        "HIV seroconversion: acute retroviral syndrome (fever, rash, lymphadenopathy 2-4 weeks)",
        "HBV seroconversion: fatigue, jaundice, elevated liver enzymes",
        "HCV seroconversion: usually asymptomatic, elevated ALT at 4-6 weeks",
        "Psychological distress: anxiety, depression, relationship impact"
      ]
    },
    medications: [
      { name: "Tenofovir/Emtricitabine + Raltegravir", type: "HIV Post-Exposure Prophylaxis", action: "3-drug antiretroviral regimen: TDF/FTC (nucleoside reverse transcriptase inhibitors) + raltegravir (integrase strand transfer inhibitor). Blocks HIV reverse transcription and integration into host DNA", sideEffects: "Nausea, diarrhea, fatigue, headache", contra: "Known HIV positive status (PEP is for prevention, not treatment—requires full regimen)", pearl: "Start within 2 hours of exposure, no later than 72 hours. Take for full 28 days. Side effects are common but self-limited. Follow up with HIV testing at 6 weeks, 3 months, 6 months. Compliance is essential for effectiveness." },
      { name: "Hepatitis B Immune Globulin (HBIG)", type: "Passive Immunoprophylaxis", action: "Provides immediate passive immunity with pre-formed anti-HBs antibodies. Given to unvaccinated or non-responding HCWs exposed to HBsAg-positive source", sideEffects: "Injection site pain, headache, nausea, rare anaphylaxis", contra: "IgA deficiency with anti-IgA antibodies (anaphylaxis risk)", pearl: "Administer within 24 hours of exposure (up to 7 days). Give concurrently with first dose of HBV vaccine series at a different injection site. Previously vaccinated HCWs with anti-HBs ≥10 mIU/mL do NOT need HBIG." }
    ],
    pearls: [
      "NEVER recap a used needle—this is the single most common cause of needlestick injuries",
      "HIV PEP must be started within 72 hours, ideally within 2 HOURS—do not wait for source patient test results if exposure is high-risk",
      "Wash with SOAP AND WATER—do NOT use bleach, hydrogen peroxide, or squeeze the wound (these damage tissue and may increase absorption)",
      "HBV vaccination with adequate anti-HBs titer (≥10 mIU/mL) provides >95% protection—verify your titer",
      "There is NO post-exposure prophylaxis for HCV—but direct-acting antivirals cure >95% if seroconversion occurs",
      "Hollw-bore needles used for venipuncture or arterial access carry the HIGHEST risk—these contain the largest blood inoculum"
    ],
    quiz: [
      { question: "A nurse sustains a needlestick from a hollow-bore needle used for venipuncture. What is the FIRST action?", options: ["Report to the charge nurse for incident documentation", "Wash the wound with soap and water immediately", "Apply bleach to the puncture site", "Squeeze the wound to express blood and pathogens"], correct: 1, rationale: "Immediately wash with soap and water. Do NOT use bleach (tissue damage), do NOT squeeze (may increase pathogen absorption). After washing, report immediately and initiate the post-exposure protocol." },
      { question: "HIV post-exposure prophylaxis should ideally be initiated within:", options: ["24 hours of exposure", "2 hours of exposure", "7 days of exposure", "Only after source patient HIV test results return"], correct: 1, rationale: "HIV PEP should ideally be initiated within 2 hours of exposure, and no later than 72 hours. Do not delay waiting for source patient results—start PEP based on risk assessment and adjust based on results." },
      { question: "A healthcare worker with documented HBV vaccination and anti-HBs titer of 85 mIU/mL is exposed to an HBsAg-positive source. What prophylaxis is needed?", options: ["HBIG immediately plus HBV vaccine booster", "HBIG only", "No HBV prophylaxis needed—adequate immunity exists", "Full HBV vaccine series restart"], correct: 2, rationale: "Anti-HBs titer ≥10 mIU/mL indicates adequate immunity from vaccination. No HBV prophylaxis (HBIG or vaccine) is needed. The worker is protected against HBV. HIV and HCV assessment still proceed as indicated." }
    ]
  },

  "isolation-precautions-advanced-rn": {
    title: "Isolation Precautions: Contact, Droplet, Airborne",
    cellular: {
      title: "Transmission-Based Precautions: Evidence and Application",
      content: "Transmission-based precautions are implemented in addition to standard precautions when the route of transmission is not completely interrupted by standard precautions alone. Three categories exist based on the mode of pathogen transmission. Contact precautions prevent transmission of organisms spread by direct (skin-to-skin) or indirect (contaminated surfaces/equipment) contact. The epidemiologically important organisms requiring contact precautions include MRSA, VRE, C. difficile, scabies, and multidrug-resistant gram-negatives. Droplet precautions prevent transmission of pathogens carried in large respiratory droplets (>5 micrometers) generated by coughing, sneezing, or talking that travel up to 3-6 feet before settling due to gravity. Organisms include influenza, pertussis, meningococcal meningitis, and group A streptococcal pharyngitis. Airborne precautions address pathogens carried in airborne droplet nuclei (<5 micrometers) that remain suspended in air currents for extended periods and can travel long distances through ventilation systems. Only three diseases require airborne precautions: tuberculosis, measles (rubeola), and varicella (chickenpox)/disseminated herpes zoster. Airborne isolation requires negative-pressure rooms (airborne infection isolation rooms, AIIR) with 6-12 air changes per hour exhausted to the exterior, and N95 respirators or PAPRs for healthcare workers."
    },
    riskFactors: [
      "MRSA colonization/infection requiring contact precautions",
      "C. difficile infection (contact precautions with soap/water hand hygiene)",
      "Active pulmonary tuberculosis (airborne precautions with N95 respirator)",
      "Measles or varicella in non-immune patients (airborne precautions)",
      "Influenza (droplet precautions)",
      "Meningococcal meningitis (droplet precautions until 24 hours of effective antibiotics)",
      "Pertussis (droplet precautions until 5 days of effective antibiotics)",
      "Multidrug-resistant organisms (MDROs) requiring enhanced contact precautions"
    ],
    diagnostics: [
      "Identify the organism and route of transmission to select appropriate precaution level",
      "TB screening: TST (Mantoux) or IGRA blood test; sputum AFB smear and culture",
      "MRSA screening: nasal swab culture or PCR",
      "C. diff: stool PCR or toxin assay (do NOT test formed stool)",
      "Influenza: rapid antigen, PCR testing",
      "Negative pressure room verification: smoke test or tissue test at door bottom"
    ],
    management: [
      "Contact precautions: gown and gloves for room entry, dedicated equipment, hand hygiene with soap/water for C. diff",
      "Droplet precautions: surgical mask within 3-6 feet of patient, patient wears mask during transport",
      "Airborne precautions: N95 respirator (fit-tested) or PAPR, negative-pressure room, door closed, limit transport",
      "Enhanced contact precautions for C. diff: soap/water hand hygiene (spores resist alcohol), bleach-based environmental cleaning",
      "Discontinuation criteria vary by organism: negative cultures, symptom resolution, completed treatment course",
      "Environmental cleaning: contact precautions require thorough terminal cleaning; C. diff requires bleach-based disinfectant"
    ],
    nursingActions: [
      "Identify correct precaution type and POST signage on the door with required PPE",
      "Don PPE in correct sequence BEFORE entering room: hand hygiene, gown, mask/respirator, eye protection, gloves",
      "Use DEDICATED equipment (stethoscope, BP cuff, thermometer) that stays in the patient's room",
      "Ensure negative-pressure room for airborne precautions: door MUST remain closed, verify pressure indicator",
      "For airborne precautions: don N95 BEFORE entering room, remove AFTER leaving and closing door",
      "Educate patient and visitors on precaution requirements and hand hygiene",
      "Coordinate care to minimize entries and exits from the isolation room",
      "Ensure proper environmental cleaning between patients and at discharge (terminal cleaning)",
      "For C. diff: use SOAP AND WATER for hand hygiene (alcohol does not kill spores) and BLEACH for environmental cleaning",
      "Transport patients on precautions only when necessary: patient wears appropriate mask, receiving area notified"
    ],
    assessmentFindings: [
      "Correct isolation signage posted and visible",
      "PPE available outside the room in dispensers",
      "Dedicated equipment present in the room",
      "Negative-pressure room indicator functioning (for airborne)",
      "Visitor compliance with precaution requirements"
    ],
    signs: {
      left: [
        "Contact: gown + gloves for room entry",
        "Droplet: surgical mask within 3-6 feet",
        "Airborne: N95 respirator + negative pressure room",
        "All: hand hygiene before and after PPE"
      ],
      right: [
        "Breaks in isolation leading to transmission",
        "Incorrect PPE selection for the organism",
        "Failure to use soap/water for C. diff (using ABHR instead)",
        "Door left open in airborne precautions room"
      ]
    },
    medications: [
      { name: "Rifampin + Isoniazid + Pyrazinamide + Ethambutol (RIPE)", type: "Anti-TB Combination Therapy", action: "Four-drug regimen for initial 2 months of active TB treatment. Rifampin and isoniazid are bactericidal, pyrazinamide targets intracellular organisms, ethambutol prevents resistance emergence", sideEffects: "Hepatotoxicity (INH, RIF, PZA), peripheral neuropathy (INH), optic neuritis (EMB), orange body fluids (RIF)", contra: "Severe hepatic disease, optic neuritis (EMB)", pearl: "Airborne precautions until patient has 3 consecutive negative AFB sputum smears collected 8-24 hours apart on effective therapy. Vitamin B6 (pyridoxine) prevents INH-induced peripheral neuropathy. Rifampin turns body fluids orange—counsel patient." },
      { name: "Oseltamivir (Tamiflu)", type: "Neuraminidase Inhibitor", action: "Inhibits influenza neuraminidase enzyme, preventing release of new viral particles from infected cells. Treatment and prophylaxis of influenza A and B", sideEffects: "Nausea, vomiting, headache, rare neuropsychiatric events (children)", contra: "Hypersensitivity to oseltamivir", pearl: "Most effective when started within 48 hours of symptom onset. Treatment: 75mg BID x 5 days. Prophylaxis: 75mg once daily x 7-10 days. Droplet precautions for influenza patients—surgical mask within 3-6 feet." }
    ],
    pearls: [
      "Remember 'My Chicken Hez TB': Measles, Chickenpox (Varicella), Herpes zoster (disseminated), TB = AIRBORNE precautions requiring N95 and negative-pressure room",
      "C. difficile requires SOAP AND WATER (alcohol does not kill spores) AND BLEACH-BASED environmental cleaning",
      "N95 respirators must be FIT-TESTED annually—an unfitted N95 does not provide adequate protection against airborne pathogens",
      "Droplet precautions use a SURGICAL mask—the mask goes on the HEALTHCARE WORKER within 3-6 feet. During transport, the PATIENT wears the mask",
      "Contact precautions require DEDICATED equipment in the room—do not share stethoscopes, BP cuffs, or thermometers between patients",
      "Meningococcal meningitis patients can be removed from droplet precautions after 24 hours of effective antibiotic therapy (ceftriaxone)"
    ],
    quiz: [
      { question: "A patient is admitted with suspected active pulmonary tuberculosis. What type of precautions are required?", options: ["Standard precautions only", "Contact precautions with gown and gloves", "Droplet precautions with surgical mask", "Airborne precautions with N95 respirator in a negative-pressure room"], correct: 3, rationale: "Active pulmonary TB requires airborne precautions: N95 respirator (fit-tested), negative-pressure airborne infection isolation room (AIIR) with door closed, and 6-12 air changes per hour exhausted to the exterior." },
      { question: "For a patient with C. difficile infection, which hand hygiene method should the nurse use?", options: ["Alcohol-based hand rub for at least 20 seconds", "Soap and water for at least 20 seconds", "Either method is acceptable", "Chlorhexidine hand scrub"], correct: 1, rationale: "C. difficile produces spores that are resistant to alcohol. Only soap and water with mechanical friction can physically remove spores from hands. ABHR is NOT effective against C. diff spores." },
      { question: "Which of the following organisms requires DROPLET precautions?", options: ["Tuberculosis", "MRSA", "Influenza", "Varicella (chickenpox)"], correct: 2, rationale: "Influenza is transmitted by large respiratory droplets that travel 3-6 feet. A surgical mask is worn within that distance. TB, measles, and varicella require airborne precautions with N95. MRSA requires contact precautions." }
    ]
  }
};
