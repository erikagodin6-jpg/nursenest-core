import type { ExamQuestion } from "./types";

export const rnInfectiousDiseaseTestbankQuestions: ExamQuestion[] = [
  // ===== BACTERIAL CELL STRUCTURE (40 questions) =====
  {
    q: "A nurse is reviewing Gram stain results showing gram-positive cocci in clusters from a blood culture. Which organism is most likely?",
    o: ["Streptococcus pneumoniae", "Staphylococcus aureus", "Escherichia coli", "Neisseria meningitidis"],
    a: 1,
    r: "Gram-positive cocci in clusters is characteristic of Staphylococcus species. Streptococcus forms chains, E. coli is a gram-negative rod, and Neisseria appears as gram-negative diplococci. Rapid Gram stain identification guides empiric antibiotic selection within 1 hour.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse understands that gram-negative bacteria are more likely to cause severe septic shock than gram-positive bacteria because gram-negative bacteria:",
    o: ["Have thicker peptidoglycan layers", "Release endotoxin (Lipid A of LPS) that triggers massive cytokine storms via TLR4 activation", "Are more resistant to all antibiotics", "Replicate faster than gram-positive organisms"],
    a: 1,
    r: "Lipid A, the endotoxin component of lipopolysaccharide (LPS) in the gram-negative outer membrane, activates TLR4 receptors on macrophages, triggering massive release of pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) leading to vasodilation, DIC, and multi-organ failure. Gram-positive organisms can cause sepsis but endotoxin-mediated shock is characteristic of gram-negative bacteremia.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with a prosthetic knee joint develops chronic low-grade infection with Staphylococcus epidermidis that persists despite appropriate IV antibiotics. What is the most likely explanation?",
    o: ["The patient has developed vancomycin resistance", "Biofilm formation on the prosthetic device protects bacteria from antibiotic penetration and immune clearance", "The antibiotic was given at the wrong dose", "S. epidermidis is inherently resistant to all antibiotics"],
    a: 1,
    r: "S. epidermidis is a prolific biofilm producer on medical devices. Biofilm-embedded bacteria are 100-1000 times more resistant to antibiotics than planktonic bacteria due to the EPS matrix barrier, persister cells, and altered metabolic states. Prosthetic joint infections with biofilm typically require device removal combined with prolonged antibiotic therapy.",
    s: "Infectious Disease"
  },
  {
    q: "Which nursing action is MOST important when caring for a patient with a new central venous catheter to prevent biofilm-related infections?",
    o: ["Administer prophylactic vancomycin", "Perform meticulous aseptic technique during all catheter access and dressing changes per central line bundle", "Flush the catheter with normal saline every 30 minutes", "Apply antibiotic ointment to the catheter insertion site daily"],
    a: 1,
    r: "Prevention of biofilm formation through strict aseptic technique during insertion and maintenance (central line bundle: hand hygiene, maximal barrier precautions, chlorhexidine skin prep, optimal site selection, daily assessment of line necessity) is the most effective strategy. Once biofilm forms, eradication without device removal is extremely difficult.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse explains to a student that vancomycin is ineffective against gram-negative bacteria because:",
    o: ["Gram-negative bacteria lack peptidoglycan", "Vancomycin cannot penetrate the gram-negative outer membrane to reach its peptidoglycan target", "Gram-negative bacteria have efflux pumps specific to vancomycin", "Vancomycin binds to LPS instead of peptidoglycan"],
    a: 1,
    r: "Vancomycin is a large glycopeptide molecule that cannot cross the outer membrane barrier of gram-negative bacteria. Its target (D-Ala-D-Ala of peptidoglycan precursors) exists in gram-negative organisms but is inaccessible. This is why gram-negative infections require antibiotics capable of penetrating or bypassing the outer membrane.",
    s: "Infectious Disease"
  },
  {
    q: "A wound culture report states 'Pseudomonas aeruginosa isolated.' Which clinical findings would the nurse expect? Select all that apply.",
    o: ["Green-blue purulent drainage with a fruity/grape-like odor", "Golden-yellow purulent drainage", "Clear serous drainage only", "Ring-shaped erythematous lesion with central clearing"],
    a: 0,
    r: "Pseudomonas produces pyocyanin (blue-green pigment) giving characteristic green-blue drainage. The fruity or grape-like odor is from 2-aminoacetophenone metabolite. Golden-yellow drainage is characteristic of Staphylococcus. Ring-shaped lesions suggest dermatophyte fungal infection (tinea).",
    s: "Infectious Disease"
  },
  {
    q: "The nurse understands that bacterial capsules contribute to virulence by:",
    o: ["Producing toxins that damage host tissues", "Inhibiting phagocytosis and complement deposition, allowing the organism to evade immune clearance", "Facilitating antibiotic uptake into the bacterial cell", "Enabling horizontal gene transfer between bacteria"],
    a: 1,
    r: "Bacterial capsules are polysaccharide layers that inhibit opsonization by complement and antibodies, preventing recognition and phagocytosis by neutrophils and macrophages. Encapsulated organisms (S. pneumoniae, N. meningitidis, H. influenzae, Klebsiella) are particularly virulent in unvaccinated or asplenic individuals.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse is educating a patient about why soap and water hand hygiene is required for C. difficile instead of alcohol-based hand sanitizer. Which explanation is accurate?",
    o: ["Alcohol-based sanitizer causes skin irritation with C. diff patients", "C. difficile forms endospores that are resistant to alcohol — soap and water with friction physically removes spores", "Hospital policy requires it but either method is equally effective", "C. difficile is a virus that requires soap and water"],
    a: 1,
    r: "C. difficile forms endospores with a multilayered protective coat that is resistant to alcohol, heat, and most chemical disinfectants. Alcohol-based hand sanitizers do NOT kill or remove C. diff spores. Soap and water combined with mechanical friction physically removes spores from hands. Environmental surfaces require bleach-based (sporicidal) cleaning.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is collecting blood cultures. Which action demonstrates proper technique?",
    o: ["Collect one set of blood cultures from one site", "Collect two sets of blood cultures from two separate peripheral venipuncture sites before initiating antibiotics", "Collect cultures after the first dose of antibiotics has been administered", "Collect blood cultures from an existing peripheral IV catheter"],
    a: 1,
    r: "Proper blood culture technique requires: two sets from two separate sites (to differentiate true bacteremia from contamination), collected BEFORE the first antibiotic dose (antibiotics can produce false-negative results). Drawing from existing IV lines increases contamination risk. However, NEVER delay antibiotics in sepsis to obtain cultures.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse is caring for a patient with sepsis who has gram-negative rod bacteremia. The nurse understands that when antibiotics lyse gram-negative bacteria, which risk is increased?",
    o: ["Risk of allergic reaction to antibiotics", "Risk of transient clinical worsening from endotoxin release during bacterial lysis", "Risk of the bacteria becoming gram-positive", "Risk of developing antibiotic allergy"],
    a: 1,
    r: "When gram-negative bacteria are lysed by bactericidal antibiotics, large amounts of LPS/endotoxin are released from the disintegrating cell wall. This endotoxin surge can transiently worsen the inflammatory response, potentially causing a Jarisch-Herxheimer-like reaction with increased fever, rigors, and hemodynamic instability before clinical improvement.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about peptidoglycan is CORRECT?",
    o: ["Peptidoglycan is found only in gram-positive bacteria", "Peptidoglycan is composed of alternating NAG and NAM residues cross-linked by peptide bridges, present in both gram-positive and gram-negative bacteria", "Peptidoglycan is identical to the human cell wall", "Peptidoglycan is the primary component of the gram-negative outer membrane"],
    a: 1,
    r: "Peptidoglycan is present in BOTH gram-positive (thick layer, 20-80 nm) and gram-negative (thin layer, 1-3 nm) bacteria. It consists of N-acetylglucosamine (NAG) and N-acetylmuramic acid (NAM) cross-linked by peptide bridges. Human cells lack peptidoglycan, making it a selective antibiotic target. The gram-negative outer membrane is composed of LPS and phospholipids, not peptidoglycan.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is prioritizing care for four patients. Which patient should be assessed FIRST?",
    o: ["Patient with MRSA wound infection, afebrile, healing well", "Patient with gram-negative bacteremia: temperature 39.5°C, BP 82/48, HR 128, altered mental status", "Patient with uncomplicated UTI on oral antibiotics", "Patient with cellulitis receiving IV antibiotics, improving"],
    a: 1,
    r: "The patient with gram-negative bacteremia showing signs of septic shock (fever, hypotension, tachycardia, altered mental status) requires immediate assessment and intervention. Endotoxin-mediated septic shock from gram-negative bacteremia carries high mortality and requires urgent fluid resuscitation, vasopressors, and antibiotic administration within the Surviving Sepsis bundle timeframes.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse understands that Type III secretion systems in gram-negative bacteria are clinically significant because they:",
    o: ["Produce beta-lactamase enzymes", "Inject virulence proteins directly into host cells, subverting immune responses and promoting tissue invasion", "Enable bacteria to form endospores", "Transfer antibiotic resistance genes between bacteria"],
    a: 1,
    r: "Type III secretion systems (T3SS) are molecular 'needle and syringe' complexes that inject bacterial effector proteins directly into host cells. These proteins manipulate host cell signaling, inhibit phagocytosis, trigger apoptosis, and disrupt immune function. T3SS is found in virulent gram-negative pathogens including Pseudomonas, Salmonella, and Yersinia.",
    s: "Infectious Disease"
  },
  {
    q: "Which organism is associated with ecthyma gangrenosum in a neutropenic patient?",
    o: ["Staphylococcus aureus", "Pseudomonas aeruginosa", "Streptococcus pyogenes", "Candida albicans"],
    a: 1,
    r: "Ecthyma gangrenosum is a necrotic skin lesion (red-to-black with necrotic center) characteristically associated with Pseudomonas aeruginosa bacteremia in immunocompromised, especially neutropenic, patients. It results from bacterial vascular invasion causing thrombosis and tissue necrosis. Its presence warrants immediate anti-pseudomonal therapy and blood cultures.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse delegates tasks to a UAP for a patient on contact precautions for MRSA. Which delegation is appropriate?",
    o: ["Performing the initial wound assessment", "Obtaining vital signs while wearing proper PPE (gown and gloves)", "Administering IV vancomycin", "Evaluating the effectiveness of antibiotic therapy"],
    a: 1,
    r: "Obtaining vital signs is a routine, predictable task within UAP scope. The UAP must be instructed to don proper contact precaution PPE (gown and gloves) before entering the room and perform hand hygiene upon exit. Initial wound assessment, IV medication administration, and therapy evaluation require RN-level assessment and clinical judgment.",
    s: "Infectious Disease"
  },
  {
    q: "Which gram-negative structure serves as the primary barrier to antibiotic entry?",
    o: ["Peptidoglycan layer", "Capsular polysaccharide", "Outer membrane with LPS", "Cell wall teichoic acids"],
    a: 2,
    r: "The outer membrane of gram-negative bacteria, with its LPS outer leaflet and phospholipid inner leaflet, acts as the primary permeability barrier. It restricts entry of hydrophobic antibiotics and large molecules. Antibiotics must enter through porins (hydrophilic channels) or penetrate the lipid bilayer. This barrier is absent in gram-positive bacteria.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse assesses a patient with a urinary catheter who develops a fever, cloudy urine, and positive urine culture. The healthcare provider orders catheter removal and antibiotics. Why is catheter removal important?",
    o: ["Catheters are routinely removed every 48 hours", "Biofilm on the catheter surface harbors organisms that antibiotics cannot effectively penetrate, perpetuating infection", "Catheter removal eliminates urinary frequency", "Removing the catheter allows better urine flow measurement"],
    a: 1,
    r: "Urinary catheters develop biofilm within 24-48 hours of insertion. Biofilm-embedded organisms are protected from both antibiotics and immune clearance. In catheter-associated UTI (CAUTI), removing or replacing the catheter eliminates the biofilm reservoir, and is essential for treatment success alongside appropriate antibiotic therapy.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching about infection prevention. Which statement about bacterial fimbriae is correct?",
    o: ["Fimbriae are structures used for motility", "Fimbriae are hair-like adhesins that enable bacteria to attach to host epithelial surfaces, facilitating colonization and biofilm formation", "Fimbriae produce toxins", "Fimbriae are only found in gram-positive bacteria"],
    a: 1,
    r: "Fimbriae (pili) are thin protein appendages on the bacterial surface that mediate adhesion to host cells. Type 1 pili in E. coli bind uroepithelial receptors (causing UTI), P pili bind kidney epithelium (causing pyelonephritis). Fimbriae also initiate biofilm formation on medical devices. Motility is provided by flagella, not fimbriae.",
    s: "Infectious Disease"
  },
  {
    q: "Which antibiotic combination would be appropriate for empiric coverage of a critically ill patient with suspected gram-negative sepsis and MRSA risk?",
    o: ["Oral amoxicillin and azithromycin", "IV vancomycin and piperacillin-tazobactam", "Oral metronidazole alone", "IV vancomycin alone"],
    a: 1,
    r: "Vancomycin provides MRSA (gram-positive) coverage while piperacillin-tazobactam provides broad gram-negative and anaerobic coverage. This combination addresses the most likely pathogens in hospital-acquired sepsis. Oral antibiotics are inappropriate for critical sepsis. Vancomycin alone lacks gram-negative coverage. De-escalation should occur at 48-72 hours based on culture results.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse draws blood cultures from a patient and the preliminary Gram stain shows gram-positive cocci in chains. Which organism is most likely?",
    o: ["Staphylococcus aureus", "Streptococcus species", "Escherichia coli", "Pseudomonas aeruginosa"],
    a: 1,
    r: "Gram-positive cocci in chains is the characteristic morphology of Streptococcus species (S. pyogenes, S. agalactiae, Enterococcus, viridans group). Staphylococcus appears in clusters, E. coli and Pseudomonas are gram-negative rods. Chain formation results from bacterial division in one plane with cells remaining attached.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with diabetic foot ulcer has a wound culture growing three organisms: S. aureus, E. coli, and Bacteroides fragilis. This is an example of:",
    o: ["Contaminated culture results", "Polymicrobial infection requiring broad-spectrum antibiotic coverage", "Normal wound flora that does not require treatment", "Laboratory error"],
    a: 1,
    r: "Diabetic foot ulcers commonly harbor polymicrobial infections with gram-positive (S. aureus), gram-negative (E. coli), and anaerobic (Bacteroides) organisms. This polymicrobial pattern reflects the mixed environment of chronic wounds. Treatment requires broad-spectrum antibiotics covering all three types, such as piperacillin-tazobactam or ampicillin-sulbactam, plus MRSA coverage if indicated.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with gram-negative bacteremia develops sudden hypotension, tachycardia, and rigors 30 minutes after starting IV ceftriaxone. The nurse should suspect:",
    o: ["Anaphylaxis to ceftriaxone", "Endotoxin release reaction from antibiotic-mediated bacterial lysis", "Cardiogenic shock unrelated to treatment", "Vasovagal response to the IV infusion"],
    a: 1,
    r: "When bactericidal antibiotics lyse gram-negative bacteria, large quantities of endotoxin (LPS/Lipid A) are released from the disintegrating cell walls. This endotoxin surge activates TLR4-mediated inflammatory cascades, potentially causing transient clinical deterioration with hypotension, tachycardia, and rigors (Jarisch-Herxheimer-like reaction). Supportive care with fluid resuscitation and continued antibiotics is appropriate.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about the periplasmic space of gram-negative bacteria is accurate?",
    o: ["It is present in both gram-positive and gram-negative bacteria equally", "It contains beta-lactamase enzymes that can hydrolyze antibiotics before they reach their targets", "It stores genetic material for the bacterium", "It is filled with peptidoglycan"],
    a: 1,
    r: "The periplasmic space between the inner and outer membranes of gram-negative bacteria contains beta-lactamase enzymes that can hydrolyze beta-lactam antibiotics (penicillins, cephalosporins, carbapenems) before they reach their PBP targets on the inner membrane. This is a key resistance mechanism unique to gram-negative organisms.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient with necrotizing fasciitis caused by Group A Streptococcus. Which clinical finding indicates the infection is progressing? Select all that apply.",
    o: ["Pain out of proportion to visible findings, rapidly spreading erythema, crepitus on palpation, and systemic toxicity", "Localized redness without tenderness", "Slow-healing minor scratch", "Mild pruritus at the site"],
    a: 0,
    r: "Necrotizing fasciitis is characterized by pain disproportionate to visible findings (classically the most important early sign), rapid erythema spread (often marked with a pen to track), subcutaneous crepitus (gas production), and systemic toxicity (fever, tachycardia, hypotension). This is a surgical emergency requiring immediate debridement plus high-dose IV penicillin and clindamycin.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse is reviewing a culture report. The sensitivity report shows an MIC of 0.25 mcg/mL for ceftriaxone. This indicates:",
    o: ["The organism is highly resistant to ceftriaxone", "The organism is susceptible to ceftriaxone — only a low concentration is needed to inhibit growth", "The laboratory made an error", "The MIC is too high for treatment"],
    a: 1,
    r: "MIC (minimum inhibitory concentration) is the lowest antibiotic concentration that inhibits visible bacterial growth. A low MIC (0.25 mcg/mL) indicates high susceptibility — the organism is easily killed at achievable drug concentrations. Lower MIC values indicate greater susceptibility. Breakpoint tables define susceptible, intermediate, and resistant categories.",
    s: "Infectious Disease"
  },
  {
    q: "A patient develops sepsis from an indwelling urinary catheter. The nurse's MOST important immediate intervention beyond antibiotic administration is:",
    o: ["Increasing IV fluid rate", "Removing or replacing the urinary catheter (source control)", "Obtaining a CT scan", "Administering antipyretics"],
    a: 1,
    r: "Source control — removing or replacing the infected catheter — is essential in catheter-associated sepsis. Biofilm on the catheter surface continuously seeds bacteria into the bloodstream. Antibiotics alone cannot eradicate biofilm-embedded organisms. Source control (device removal, abscess drainage, debridement) is a fundamental principle of sepsis management alongside antibiotics.",
    s: "Infectious Disease"
  },
  {
    q: "Which factor makes Klebsiella pneumoniae particularly virulent?",
    o: ["It lacks any cell wall structures", "Its prominent polysaccharide capsule inhibits phagocytosis and complement-mediated killing", "It produces exotoxins like C. difficile", "It is only found in immunocompetent patients"],
    a: 1,
    r: "Klebsiella pneumoniae has a prominent mucoid capsule that strongly inhibits phagocytosis and complement deposition. The thick capsule gives colonies a distinctive 'mucoid' appearance on culture plates. Hypervirulent strains (hvKP) have enhanced capsule production and cause invasive infections (liver abscess, meningitis, endophthalmitis) even in immunocompetent hosts.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse assesses four patients with infections. Which requires the MOST immediate intervention?",
    o: ["Patient with cellulitis: temperature 38.0°C, localized erythema, responding to IV antibiotics", "Patient with UTI: cloudy urine, mild dysuria, oral antibiotics started today", "Patient with wound infection: purulent drainage, wound culture pending", "Patient with central line: sudden fever 39.8°C, rigors, hypotension developing"],
    a: 3,
    r: "Sudden fever with rigors and developing hypotension in a patient with a central line suggests catheter-related bloodstream infection (CRBSI) progressing to sepsis. This requires immediate blood cultures (from the line and peripherally), broad-spectrum IV antibiotics within 1 hour, fluid resuscitation, and likely line removal. The other patients have stable or non-emergent infections.",
    s: "Infectious Disease"
  },
  {
    q: "A patient asks why they need to complete the full course of antibiotics even though they feel better. The nurse's best explanation is:",
    o: ["Hospital policy requires it", "Stopping early allows surviving bacteria with partial resistance to repopulate, potentially developing full resistance and causing relapse", "There is no actual benefit to completing the full course", "Antibiotics need to build up to toxic levels to be effective"],
    a: 1,
    r: "Incomplete antibiotic courses allow bacteria with partial or emerging resistance mechanisms to survive and repopulate. These surviving organisms may develop full resistance through continued selection pressure, leading to treatment failure and resistant infections. Additionally, subtherapeutic antibiotic exposure promotes horizontal gene transfer of resistance determinants.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse understands that polymyxins (colistin) are reserved as last-resort antibiotics because:",
    o: ["They are inexpensive and widely available", "They are effective against MDR gram-negative bacteria including CRE but cause significant nephrotoxicity and neurotoxicity due to their mechanism of disrupting cell membranes", "They have no side effects", "They are equally effective as first-line antibiotics with fewer side effects"],
    a: 1,
    r: "Polymyxins bind to LPS/Lipid A in the gram-negative outer membrane, disrupting membrane integrity. While effective against MDR gram-negative organisms including CRE, they also interact with human cell membranes, causing dose-limiting nephrotoxicity (up to 60% of patients) and neurotoxicity. They are reserved for infections with no other treatment options.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the patient's medication list and notes the patient is receiving meropenem. The nurse understands that carbapenems are reserved for:",
    o: ["Uncomplicated urinary tract infections", "Serious infections caused by ESBL-producing organisms or other MDR gram-negative bacteria resistant to standard beta-lactams", "Viral upper respiratory infections", "Mild skin and soft tissue infections"],
    a: 1,
    r: "Carbapenems (meropenem, ertapenem, imipenem) are broad-spectrum antibiotics that resist most beta-lactamases, including ESBLs. They are reserved for serious infections caused by MDR gram-negative organisms. Overuse of carbapenems accelerates the emergence of CRE (carbapenem-resistant Enterobacterales), which are associated with 40-50% mortality.",
    s: "Infectious Disease"
  },
  {
    q: "Which nursing action BEST prevents ventilator-associated pneumonia (VAP) in an intubated patient?",
    o: ["Changing the ventilator circuit daily", "Implementing the VAP bundle: head of bed elevation 30-45°, daily sedation vacation, daily readiness-to-extubate assessment, oral care with chlorhexidine, and DVT/PUD prophylaxis", "Administering prophylactic broad-spectrum antibiotics", "Keeping the endotracheal tube cuff deflated"],
    a: 1,
    r: "The VAP prevention bundle includes: head of bed elevation 30-45° (reduces aspiration), daily sedation vacation and readiness-to-extubate assessment (reduces ventilator days), oral care with chlorhexidine (reduces oropharyngeal colonization), and DVT/PUD prophylaxis. These evidence-based interventions prevent biofilm-forming organisms from causing ventilator-associated pneumonia.",
    s: "Infectious Disease"
  },
  {
    q: "Gram-negative intracellular diplococci found in a cerebrospinal fluid Gram stain most likely represent:",
    o: ["Staphylococcus aureus", "Neisseria meningitidis", "Streptococcus pneumoniae", "Haemophilus influenzae"],
    a: 1,
    r: "Gram-negative intracellular diplococci (kidney-bean shaped pairs found inside neutrophils) is the classic CSF Gram stain appearance of Neisseria meningitidis. S. aureus is gram-positive cocci in clusters, S. pneumoniae is gram-positive lancet-shaped diplococci, and H. influenzae is a gram-negative coccobacillus. This finding in CSF warrants immediate antibiotic therapy and droplet precautions.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is educating a student about the difference between gram-positive and gram-negative organisms. Which statement by the student indicates understanding?",
    o: ["Gram-positive bacteria have a thin peptidoglycan layer and an outer membrane", "Gram-positive bacteria stain purple due to crystal violet retention in the thick peptidoglycan layer, while gram-negative bacteria stain pink because the thin peptidoglycan layer cannot retain the crystal violet after decolorization", "Both gram-positive and gram-negative bacteria have identical cell wall structures", "The Gram stain only works on fungal organisms"],
    a: 1,
    r: "The Gram stain differentiates bacteria based on cell wall structure. Gram-positive bacteria have thick peptidoglycan (20-80 nm) that retains crystal violet dye through the decolorization step, appearing purple. Gram-negative bacteria have thin peptidoglycan (1-3 nm) that loses crystal violet during decolorization and picks up the pink safranin counterstain.",
    s: "Infectious Disease"
  },
  {
    q: "Which patient is at HIGHEST risk for biofilm-related infection?",
    o: ["A patient with no medical devices and intact skin", "A patient with a central venous catheter, urinary catheter, and mechanical heart valve", "A patient recovering from an appendectomy with a well-healing wound", "A patient with seasonal allergies"],
    a: 1,
    r: "Patients with multiple indwelling medical devices are at highest biofilm risk. Biofilm forms on central lines within 24 hours, urinary catheters within 24-48 hours, and prosthetic heart valves can develop endocarditis from biofilm-producing organisms. Each additional device multiplies the biofilm risk surfaces and entry points for infection.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient whose blood cultures grew Enterococcus faecium. The sensitivity report shows resistance to vancomycin (VRE). Which antibiotic does the nurse anticipate?",
    o: ["Higher dose vancomycin", "Cephalexin", "Linezolid or daptomycin", "Metronidazole"],
    a: 2,
    r: "VRE is resistant to vancomycin due to vanA/vanB gene modification of the peptidoglycan precursor target. Treatment options include linezolid (oral and IV) and daptomycin (IV only). Higher-dose vancomycin will not overcome the resistance mechanism. Cephalexin and metronidazole have no activity against VRE.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about beta-lactamase inhibitors is CORRECT?",
    o: ["They directly kill bacteria", "They are combined with beta-lactam antibiotics to protect them from enzymatic degradation by beta-lactamases", "They are a type of antibiotic used alone", "They only work against gram-positive organisms"],
    a: 1,
    r: "Beta-lactamase inhibitors (tazobactam, clavulanate, sulbactam, avibactam) have little intrinsic antibacterial activity. They function by binding to and inhibiting beta-lactamase enzymes, protecting the companion beta-lactam antibiotic from degradation. Examples: piperacillin-tazobactam, amoxicillin-clavulanate, ceftazidime-avibactam.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching about Clostridium perfringens gas gangrene. What structural feature of this organism contributes to environmental cleaning challenges?",
    o: ["Its gram-negative outer membrane", "Its ability to form endospores that resist heat, chemicals, and standard disinfectants", "Its viral capsid structure", "Its production of pyocyanin pigment"],
    a: 1,
    r: "Clostridium species (C. perfringens, C. difficile, C. tetani, C. botulinum) form endospores — dormant structures resistant to heat, alcohol, UV radiation, and many chemical disinfectants. Endospores can persist in the environment for months to years. Environmental decontamination requires sporicidal agents (bleach solutions, hydrogen peroxide vapor).",
    s: "Infectious Disease"
  },
  {
    q: "A patient develops sepsis. The nurse reviews the culture results showing a gram-negative rod resistant to all beta-lactams including carbapenems. The culture report identifies the organism as KPC-producing Klebsiella pneumoniae (CRE). What treatment does the nurse anticipate?",
    o: ["Amoxicillin-clavulanate", "Ceftazidime-avibactam", "Standard-dose meropenem", "Vancomycin"],
    a: 1,
    r: "KPC-producing CRE are resistant to all standard beta-lactams including carbapenems. Ceftazidime-avibactam contains avibactam, a novel beta-lactamase inhibitor that inhibits KPC enzymes, restoring ceftazidime activity. Alternative options include meropenem-vaborbactam or polymyxin-based regimens. Vancomycin has no gram-negative activity.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse identifies that a patient has been growing the same organism from wound cultures for 3 weeks despite appropriate antibiotics. The wound has minimal drainage but persistent low-grade erythema. Which concept best explains this finding?",
    o: ["Antibiotic allergy", "Chronic biofilm infection with persister cells that are metabolically dormant and antibiotic-tolerant", "Laboratory contamination", "Normal wound healing"],
    a: 1,
    r: "Chronic infections that persist despite appropriate antibiotics often indicate biofilm formation. Biofilms contain metabolically dormant 'persister' cells that tolerate antibiotics without being genetically resistant. When antibiotics are stopped, these persisters reactivate and repopulate the biofilm. Treatment often requires debridement (physical biofilm disruption) plus prolonged antibiotic therapy.",
    s: "Infectious Disease"
  },

  // ===== ANTIBIOTIC RESISTANCE (40 questions) =====
  {
    q: "A nurse is caring for a patient with MRSA bacteremia. Which statement about MRSA resistance is CORRECT?",
    o: ["MRSA produces an enzyme that degrades methicillin", "MRSA carries the mecA gene encoding PBP2a, an altered penicillin-binding protein with reduced affinity for ALL beta-lactam antibiotics", "MRSA is only resistant to methicillin specifically", "MRSA resistance can be overcome by giving higher doses of penicillin"],
    a: 1,
    r: "The mecA gene encodes PBP2a, which has low affinity for all beta-lactam antibiotics — not just methicillin. This means MRSA is resistant to all penicillins, cephalosporins, and carbapenems. Higher doses cannot overcome the target modification. Treatment requires non-beta-lactam agents: vancomycin, daptomycin, linezolid, or ceftaroline (a unique anti-MRSA cephalosporin).",
    s: "Infectious Disease"
  },
  {
    q: "The nurse receives a culture report showing 'ESBL-producing E. coli — resistant to ceftriaxone, sensitive to meropenem, nitrofurantoin, and fosfomycin.' For a complicated UTI, which antibiotic does the nurse anticipate?",
    o: ["Ceftriaxone as directed by the patient's preference", "Meropenem for complicated UTI caused by ESBL-producing organism", "Oral amoxicillin for convenience", "IV vancomycin for broad coverage"],
    a: 1,
    r: "ESBL-producing E. coli is resistant to ceftriaxone and other third-generation cephalosporins. For complicated UTI (pyelonephritis, sepsis), carbapenems (meropenem, ertapenem) are the treatment of choice. For uncomplicated lower UTI, nitrofurantoin or fosfomycin may suffice. Vancomycin has no gram-negative activity. Amoxicillin would also be hydrolyzed by the ESBL.",
    s: "Infectious Disease"
  },
  {
    q: "A patient on the medical-surgical unit is identified as colonized with CRE. Which isolation precautions should the nurse implement?",
    o: ["Standard precautions only", "Enhanced contact precautions: gown, gloves, dedicated equipment, private room, enhanced environmental cleaning", "Airborne precautions with negative pressure room", "No precautions needed since the patient is colonized, not infected"],
    a: 1,
    r: "CRE requires enhanced contact precautions even for colonized patients because of its high transmissibility and limited treatment options. This includes gown and gloves, dedicated patient equipment, private room (no cohorting with non-CRE patients), enhanced environmental cleaning, and strict hand hygiene. Active surveillance may be implemented for contacts.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is participating in an antibiotic stewardship round. At 72 hours, the patient has been on IV vancomycin and piperacillin-tazobactam. Cultures grew MSSA (methicillin-sensitive S. aureus). What de-escalation does the nurse anticipate?",
    o: ["Continue both antibiotics for the full 14-day course", "De-escalate to IV nafcillin or cefazolin (narrower-spectrum anti-staphylococcal agent) and discontinue piperacillin-tazobactam", "Switch to oral amoxicillin immediately", "Add a third antibiotic for synergy"],
    a: 1,
    r: "MSSA is susceptible to anti-staphylococcal penicillins (nafcillin, oxacillin) and first-generation cephalosporins (cefazolin), which are more effective against MSSA than vancomycin. De-escalation from vancomycin + pip-tazo to nafcillin/cefazolin alone narrows the spectrum, reduces C. difficile risk, and improves MSSA treatment outcomes. This is a core stewardship principle.",
    s: "Infectious Disease"
  },
  {
    q: "A patient develops profuse watery diarrhea (12 stools/day) on day 5 of clindamycin therapy. The nurse suspects C. difficile infection. Which actions are appropriate? Select all that apply.",
    o: ["Implement contact precautions, use soap and water for hand hygiene, collect stool for C. diff toxin testing, notify the provider, avoid anti-diarrheal medications", "Continue clindamycin and add loperamide for symptom relief", "Switch to alcohol-based hand sanitizer for faster hygiene", "Document findings and reassess in 48 hours without notifying the provider"],
    a: 0,
    r: "C. difficile management requires: contact precautions (gown, gloves, dedicated equipment), soap and water hand hygiene (alcohol doesn't kill spores), stool testing for C. diff toxin, provider notification for antibiotic change to oral vancomycin/fidaxomicin, and AVOIDING anti-diarrheals which trap toxins in the colon and worsen disease.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse understands that horizontal gene transfer by conjugation is the most concerning mechanism of resistance spread because:",
    o: ["It occurs slowly over generations", "It allows direct cell-to-cell transfer of resistance plasmids between bacterial species, potentially creating multidrug-resistant organisms in a single transfer event", "It only occurs in laboratory settings", "It only transfers one gene at a time"],
    a: 1,
    r: "Conjugation involves direct transfer of resistance-carrying plasmids through pili. A single plasmid can carry multiple resistance genes (ESBL + aminoglycoside resistance + fluoroquinolone resistance), creating MDR organisms in one event. Conjugation crosses species barriers (E. coli to Klebsiella), explaining rapid resistance spread in healthcare settings.",
    s: "Infectious Disease"
  },
  {
    q: "A patient is receiving IV vancomycin. The nurse obtains serum vancomycin levels for AUC-guided dosing. What is the target AUC/MIC ratio?",
    o: ["100-200 mg*hr/L", "400-600 mg*hr/L", "800-1000 mg*hr/L", "AUC monitoring is not used for vancomycin"],
    a: 1,
    r: "AUC-guided vancomycin dosing targets an AUC/MIC ratio of 400-600 mg*hr/L, replacing older trough-based monitoring (which targeted 15-20 mcg/mL). This approach more accurately predicts clinical efficacy while reducing nephrotoxicity risk. It requires at least two serum levels for Bayesian pharmacokinetic calculation.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with acute pyelonephritis has a urine culture growing E. coli resistant to ciprofloxacin, trimethoprim-sulfamethoxazole, and ampicillin but sensitive to ceftriaxone and carbapenems. Which antibiotic is the most appropriate first-line choice?",
    o: ["Ciprofloxacin despite resistance", "Ceftriaxone", "Meropenem", "Ampicillin"],
    a: 1,
    r: "When the organism is susceptible to ceftriaxone (a third-generation cephalosporin), it should be used preferentially over carbapenems. Stewardship principles dictate using the narrowest effective antibiotic. Reserving carbapenems for ESBL or MDR organisms preserves them for truly resistant infections. Using fluoroquinolones or ampicillin despite resistance would be ineffective.",
    s: "Infectious Disease"
  },
  {
    q: "Which nursing intervention is MOST important for preventing the development of antibiotic resistance?",
    o: ["Administering the broadest-spectrum antibiotic available", "Administering antibiotics at the prescribed times to maintain therapeutic drug levels above the MIC", "Giving antibiotics only when the patient requests them", "Crushing extended-release antibiotic tablets for faster absorption"],
    a: 1,
    r: "Maintaining consistent antibiotic levels above the MIC is essential for bacterial killing and preventing resistance. Sub-MIC antibiotic concentrations create selection pressure favoring resistant mutants. Timely administration (not early, not late) maintains the pharmacodynamic targets: time above MIC for beta-lactams, peak concentration for aminoglycosides, AUC for vancomycin.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing medication orders for a patient with community-acquired pneumonia. The patient has no MRSA risk factors. The provider has ordered vancomycin empirically. What stewardship concern should the nurse raise?",
    o: ["Vancomycin is always appropriate for pneumonia", "Without MRSA risk factors, empiric vancomycin may be unnecessary — MRSA nasal swab PCR could guide de-escalation", "Vancomycin should be given to all pneumonia patients as prophylaxis", "The concern is that vancomycin should be given at a higher dose"],
    a: 1,
    r: "MRSA nasal swab PCR has a negative predictive value >95% for MRSA pneumonia. Without MRSA risk factors (prior MRSA infection, recent hospitalization, hemodialysis, injection drug use), empiric vancomycin adds nephrotoxicity risk and promotes VRE without benefit. The nurse should advocate for MRSA swab-guided therapy as a stewardship intervention.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about efflux pumps in antibiotic resistance is CORRECT?",
    o: ["Efflux pumps are found only in gram-positive bacteria", "A single efflux pump system can expel multiple antibiotic classes simultaneously, contributing to multidrug resistance", "Efflux pumps break down antibiotics into inactive metabolites", "Efflux pumps are easily overcome by increasing the antibiotic dose"],
    a: 1,
    r: "Efflux pumps are transmembrane protein complexes that actively transport antibiotics out of the cell. Multiple antibiotic classes can be substrates for a single pump family (e.g., MexAB-OprM in Pseudomonas expels beta-lactams, fluoroquinolones, and chloramphenicol). This confers multidrug resistance from a single genetic change. Dose increases may not overcome high-level efflux.",
    s: "Infectious Disease"
  },
  {
    q: "A patient on IV gentamicin has a trough level of 2.5 mcg/mL (therapeutic trough: <1 mcg/mL). What should the nurse do?",
    o: ["Continue the current dose as the drug is working", "Hold the next dose, notify the provider, and monitor renal function — elevated trough indicates drug accumulation and increased nephrotoxicity/ototoxicity risk", "Give the next dose early to maintain levels", "This trough level is within normal limits"],
    a: 1,
    r: "Aminoglycoside trough levels >1 mcg/mL indicate drug accumulation, significantly increasing the risk of irreversible nephrotoxicity and ototoxicity. The nurse should hold the next dose, notify the provider for dose adjustment or extended interval, and monitor renal function (creatinine) and hearing. Extended-interval (once-daily) dosing minimizes trough accumulation.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse is assessing a patient who has been on broad-spectrum antibiotics for 10 days. Which finding most strongly suggests a secondary infection?",
    o: ["Continued improvement in temperature and WBC", "New onset of oral white patches that scrape off, revealing an erythematous base", "Mild injection site redness at the IV site", "Patient reports feeling better overall"],
    a: 1,
    r: "White patches on the oral mucosa that scrape off revealing a red base describes oral candidiasis (thrush), a common secondary infection caused by antibiotic disruption of normal oral flora. Broad-spectrum antibiotic therapy kills protective bacterial flora, allowing Candida albicans overgrowth. Treatment is nystatin swish-and-swallow or fluconazole.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is coordinating care for a patient transitioning from IV to oral antibiotics. Which criteria indicate readiness for IV-to-PO conversion?",
    o: ["Patient is afebrile, tolerating oral intake, clinically improving, and has a functioning GI tract", "Patient continues to have fever but is tolerating oral intake", "Patient has been on IV antibiotics for at least 14 days regardless of clinical status", "IV-to-PO conversion should never occur during hospitalization"],
    a: 0,
    r: "IV-to-oral conversion criteria include: afebrile for ≥24-48 hours, tolerating oral intake, clinically improving (decreasing WBC, resolving infection signs), functioning GI tract, and availability of a bioequivalent oral formulation. Early conversion reduces IV-related complications (phlebitis, CLABSI risk), hospital stay, and cost without compromising outcomes.",
    s: "Infectious Disease"
  },
  {
    q: "Why is fidaxomicin preferred over oral vancomycin for recurrent C. difficile infection?",
    o: ["Fidaxomicin is less expensive", "Fidaxomicin has a narrower spectrum, preserving normal colonic flora and resulting in lower recurrence rates", "Fidaxomicin works faster than vancomycin", "There is no difference between the two medications"],
    a: 1,
    r: "Fidaxomicin has a narrow spectrum of activity focused on C. difficile while sparing normal gut anaerobes. This preserves the protective colonic microbiome, reducing recurrence rates by approximately 50% compared to oral vancomycin. Oral vancomycin disrupts more of the normal flora, potentially facilitating recurrence. Fidaxomicin is preferred for first recurrence or patients at high recurrence risk.",
    s: "Infectious Disease"
  },
  {
    q: "A patient is prescribed piperacillin-tazobactam as a 4-hour extended infusion rather than a standard 30-minute infusion. The patient asks why. The nurse's best explanation is:",
    o: ["It is more convenient for the nursing staff", "The extended infusion keeps the antibiotic level above the effective concentration for a longer time, improving the drug's ability to kill bacteria", "It reduces the risk of allergic reaction", "There is no clinical difference between the two methods"],
    a: 1,
    r: "Piperacillin-tazobactam is a time-dependent antibiotic — its effectiveness depends on how long the drug level stays above the MIC (fT>MIC). Extended 4-hour infusions maintain levels above the MIC for a longer percentage of the dosing interval compared to 30-minute infusions, improving clinical outcomes and cure rates, especially in critically ill patients.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is caring for a patient with VRE colonization of the GI tract. Which statement about VRE is accurate?",
    o: ["VRE can be treated with higher doses of vancomycin", "VRE carries the vanA/vanB gene that modifies the vancomycin binding target, making vancomycin completely ineffective regardless of dose", "VRE is only dangerous in immunocompromised patients", "VRE does not require isolation precautions"],
    a: 1,
    r: "The vanA gene cluster modifies the D-Ala-D-Ala peptidoglycan precursor to D-Ala-D-Lac, reducing vancomycin binding by 1000-fold. No increase in vancomycin dose can overcome this target modification. VRE requires contact precautions (gown, gloves) to prevent transmission. Treatment of active VRE infection requires linezolid or daptomycin.",
    s: "Infectious Disease"
  },
  {
    q: "Which patient scenario represents the greatest risk for developing an antibiotic-resistant infection?",
    o: ["Patient with no prior antibiotic use and intact immune function", "Patient in the ICU for 14 days, on broad-spectrum antibiotics, with central line and urinary catheter", "Patient with seasonal allergies taking over-the-counter antihistamines", "Patient with a healing surgical incision who completed a 5-day antibiotic course 6 months ago"],
    a: 1,
    r: "Multiple risk factors converge: prolonged ICU stay (exposure to resistant organisms), broad-spectrum antibiotics (selection pressure favoring resistant organisms), central line and urinary catheter (biofilm formation sites and infection entry points). The combination of prolonged antibiotic exposure + invasive devices + healthcare environment creates the highest resistance risk.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing procalcitonin levels for a patient with lower respiratory infection. The initial procalcitonin was 3.2 ng/mL. Today (day 5 of antibiotics), it is 0.18 ng/mL. What does this suggest?",
    o: ["The patient needs to change antibiotics", "The declining procalcitonin supports safe antibiotic discontinuation, as levels below 0.25 ng/mL indicate resolution of bacterial infection", "The patient has developed a viral co-infection", "Procalcitonin levels have no clinical significance"],
    a: 1,
    r: "Procalcitonin declines as bacterial infection resolves. A level <0.25 ng/mL supports safe antibiotic discontinuation in lower respiratory infections. Procalcitonin-guided therapy reduces antibiotic exposure by 2-3 days without increasing adverse outcomes. The nurse should communicate this trend to the team during the antibiotic timeout discussion.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with chronic osteomyelitis has been on IV antibiotics for 6 weeks with persistent positive cultures. The infectious disease team recommends surgical debridement. The nurse understands this recommendation because:",
    o: ["Surgery always cures osteomyelitis without antibiotics", "Chronic osteomyelitis involves biofilm formation in bone that cannot be eradicated by antibiotics alone — debridement removes biofilm and necrotic bone", "Surgery is less expensive than prolonged antibiotics", "Debridement is purely cosmetic"],
    a: 1,
    r: "Chronic osteomyelitis involves biofilm formation on dead bone (sequestrum). Biofilm-embedded bacteria are resistant to antibiotic penetration, and avascular necrotic bone prevents antibiotic delivery. Surgical debridement removes the biofilm-colonized sequestrum and necrotic tissue, allowing antibiotics to effectively treat remaining infection. Source control is essential for cure.",
    s: "Infectious Disease"
  },
  {
    q: "A patient on vancomycin develops flushing and pruritus over the upper body during the infusion. The nurse should:",
    o: ["Stop vancomycin permanently and document as an allergy", "Slow the infusion rate and administer diphenhydramine — this is red man syndrome (histamine-mediated), not a true allergy", "Increase the infusion rate to finish faster", "Administer epinephrine immediately"],
    a: 1,
    r: "Red man syndrome is a histamine-mediated reaction from rapid vancomycin infusion, NOT a true allergic reaction. Management: slow the infusion rate (minimum 1 hour, 2 hours for doses >1g) and administer diphenhydramine. Vancomycin can be safely continued. This should NOT be documented as an allergy. Epinephrine is reserved for true anaphylaxis (bronchospasm, hypotension).",
    s: "Infectious Disease"
  },
  {
    q: "Which patient teaching about antibiotic use reflects appropriate stewardship principles?",
    o: ["Save leftover antibiotics for future infections", "Take the full prescribed course even if you feel better, because stopping early promotes resistant bacteria", "Share antibiotics with family members who have similar symptoms", "Request antibiotics for every cold or sore throat"],
    a: 1,
    r: "Completing the full prescribed course ensures all susceptible bacteria are killed, preventing survival and selection of partially resistant organisms. Saving antibiotics, sharing them, or requesting them for viral infections are major drivers of antibiotic resistance. Community education is an essential stewardship component.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is assigned four patients. Which task can be safely delegated to the LPN?",
    o: ["Assessing a new admission with suspected sepsis", "Administering scheduled oral vancomycin to a stable patient with C. difficile", "Initiating the Surviving Sepsis bundle for a deteriorating patient", "Evaluating a patient's response to a new antibiotic regimen"],
    a: 1,
    r: "Administering oral medications to a stable patient is within LPN scope — it is a predictable, routine task. The LPN should be instructed on contact precautions for C. diff. Assessing new admissions, initiating sepsis bundles, and evaluating treatment response require RN-level assessment and clinical judgment.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse calculates the creatinine clearance for a patient receiving vancomycin and finds it has decreased from 85 mL/min to 42 mL/min over the past 3 days. What action is most appropriate?",
    o: ["Continue vancomycin at the current dose since renal function varies normally", "Hold vancomycin and notify the provider — declining renal function indicates nephrotoxicity requiring dose adjustment or alternative therapy", "Increase the vancomycin dose to overcome reduced clearance", "Switch to oral vancomycin to protect the kidneys"],
    a: 1,
    r: "A significant decline in creatinine clearance during vancomycin therapy indicates drug-induced nephrotoxicity. The nurse should hold the next dose and notify the provider urgently. Options include: dose reduction with pharmacokinetic modeling, extended dosing interval, or switching to an alternative agent (daptomycin, linezolid). Monitoring renal function is a critical nursing responsibility during vancomycin therapy.",
    s: "Infectious Disease"
  },
  {
    q: "Which antibiotic class works by concentration-dependent killing?",
    o: ["Beta-lactams (penicillins, cephalosporins)", "Aminoglycosides (gentamicin, tobramycin)", "Macrolides (azithromycin, erythromycin)", "Tetracyclines (doxycycline)"],
    a: 1,
    r: "Aminoglycosides exhibit concentration-dependent killing — higher peak concentrations relative to the MIC (Cmax/MIC >10) result in more effective bacterial killing. This is why once-daily (extended-interval) dosing is preferred: it achieves high peak concentrations for maximal killing while allowing troughs to fall below toxic levels. Beta-lactams are time-dependent; macrolides and tetracyclines are time/AUC-dependent.",
    s: "Infectious Disease"
  },
  {
    q: "The infection preventionist reports a cluster of CRE cases on the unit. Which nursing action is MOST important?",
    o: ["Continue standard precautions for all patients", "Implement enhanced contact precautions for affected patients, enhanced environmental cleaning, and active surveillance cultures for contacts to prevent further transmission", "Restrict all visitors to the unit", "Close the unit to new admissions permanently"],
    a: 1,
    r: "CRE outbreak management requires: enhanced contact precautions for affected patients, enhanced environmental cleaning with EPA-registered disinfectants, active surveillance cultures for contacts (rectal swabs), cohorting of colonized/infected patients with dedicated staff, and hand hygiene compliance monitoring. CRE transmission prevention is critical given the limited treatment options and high mortality.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about carbapenem-resistant Enterobacterales (CRE) is CORRECT?",
    o: ["CRE infections have the same mortality as susceptible infections", "CRE produce carbapenemases (KPC, NDM) that hydrolyze carbapenems — the broadest-spectrum beta-lactams — and carry 40-50% mortality", "CRE can be treated with standard-dose amoxicillin", "CRE is a relatively minor public health concern"],
    a: 1,
    r: "CRE are classified as an 'urgent threat' by the CDC. They produce enzymes (KPC, NDM-1, OXA-48) that destroy carbapenems, the antibiotics of last resort for MDR gram-negative infections. CRE infections carry 40-50% mortality, and treatment options are severely limited to newer agents (ceftazidime-avibactam, meropenem-vaborbactam) or toxic alternatives (polymyxins).",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is preparing to draw vancomycin levels for a patient. The pharmacist requests a pre-dose (trough) level and a level 1-2 hours after the infusion ends. The nurse understands these levels are used for:",
    o: ["Determining if the patient is allergic to vancomycin", "Bayesian pharmacokinetic modeling to calculate AUC and optimize dosing for an AUC/MIC target of 400-600", "Measuring the patient's kidney function directly", "Assessing vancomycin absorption from the GI tract"],
    a: 1,
    r: "Two-level AUC-guided vancomycin dosing requires a pre-dose (trough) and post-infusion (1-2 hours after) level to calculate the AUC using Bayesian pharmacokinetic software. This approach targets an AUC/MIC of 400-600 mg*hr/L, which is more precise than single-trough monitoring for optimizing efficacy and minimizing nephrotoxicity.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is educating a patient prescribed a 7-day course of amoxicillin for sinusitis. The patient asks, 'Can I stop taking it when I feel better in 3 days?' The best nursing response is:",
    o: ["Yes, you can stop whenever you feel better", "No — completing the full 7-day course is important because stopping early allows surviving bacteria with partial resistance to repopulate and potentially develop full resistance", "Take double the dose for 3 days instead", "You should take it for 14 days instead of 7"],
    a: 1,
    r: "Incomplete antibiotic courses leave bacteria with emerging resistance mechanisms alive. These surviving organisms can develop full resistance through continued mutation and selection. Additionally, sub-lethal antibiotic concentrations during treatment taper promote horizontal gene transfer of resistance determinants. Completing the prescribed course maximizes bacterial eradication.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse identifies that a patient's antibiotic has been consistently administered 2 hours late for the past 3 days. This is a stewardship concern because:",
    o: ["The timing of antibiotic administration has no clinical significance", "Delayed administration allows drug levels to fall below the MIC, creating subtherapeutic exposure that promotes bacterial regrowth and resistance development", "Late administration only matters for oral antibiotics", "The patient should receive double doses to compensate"],
    a: 1,
    r: "Timely antibiotic administration is a critical nursing responsibility for stewardship. For time-dependent antibiotics (beta-lactams), delayed doses allow serum levels to fall below the MIC, creating periods of subtherapeutic exposure. Sub-MIC concentrations promote selective pressure favoring resistant mutants and reduce treatment efficacy. Addressing systemic barriers to timely administration is essential.",
    s: "Infectious Disease"
  },
  {
    q: "The nurse is monitoring a patient on linezolid for VRE bacteremia. Which adverse effect requires monitoring beyond 14 days of therapy?",
    o: ["Mild headache", "Thrombocytopenia, peripheral neuropathy, and serotonin syndrome risk (especially with concurrent SSRIs)", "Temporary blue discoloration of urine", "Transient elevation of liver enzymes"],
    a: 1,
    r: "Linezolid causes dose-dependent thrombocytopenia (risk increases significantly after 14 days), peripheral and optic neuropathy with prolonged use, and lactic acidosis (mitochondrial toxicity). Linezolid is also a weak MAO inhibitor, creating serotonin syndrome risk when combined with SSRIs, SNRIs, tramadol, or meperidine. Monitor CBC weekly.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is performing medication reconciliation for a patient with a penicillin allergy documented as 'rash in childhood.' The patient has a wound infection requiring antibiotic therapy. Which consideration is most important?",
    o: ["Avoid all antibiotics related to penicillin permanently", "Assess the allergy history: childhood rash (low-risk) may allow cephalosporin use since cross-reactivity is 1-2%, unlike true anaphylaxis history which requires allergy testing before beta-lactam use", "Give penicillin anyway since it was childhood", "Prescribe only fluoroquinolones for all future infections"],
    a: 1,
    r: "Allergy assessment is essential for stewardship. A childhood rash is often a viral exanthem, not true penicillin allergy. True cross-reactivity between penicillin and cephalosporins is only 1-2% (lower for third/fourth generation). Avoiding all beta-lactams unnecessarily forces use of broader-spectrum or less effective alternatives. Formal allergy testing (skin testing) is recommended for unclear histories.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about antibiotic resistance is MOST accurate?",
    o: ["Antibiotic resistance is a problem that only affects developing countries", "Antibiotic resistance is a global public health crisis driven by overuse and misuse of antibiotics in both human medicine and agriculture, with an estimated 1.27 million deaths annually attributed directly to resistant infections", "Resistance can always be overcome by developing new antibiotics faster than bacteria develop resistance", "Resistance is a natural phenomenon that cannot be influenced by human behavior"],
    a: 1,
    r: "WHO has declared antimicrobial resistance one of the top 10 global public health threats. An estimated 1.27 million deaths were directly attributable to resistant bacterial infections in 2019. While resistance is a natural evolutionary process, overuse/misuse of antibiotics in human medicine and agriculture dramatically accelerates it. The antibiotic pipeline cannot keep pace without stewardship.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse notices a patient's urine culture sensitivity report shows 'intermediate' susceptibility to ciprofloxacin. What does this mean clinically?",
    o: ["The antibiotic will definitely work at standard doses", "The organism may respond to higher doses or concentrated drug levels (as in urine), but susceptibility is uncertain and alternatives should be considered if available", "The organism is completely resistant", "The result is invalid and should be repeated"],
    a: 1,
    r: "'Intermediate' susceptibility means the organism may respond in body sites where the antibiotic achieves high concentrations (urine, bile) but may not be reliably effective at standard doses in the bloodstream. For UTIs, intermediate fluoroquinolone susceptibility may be acceptable since ciprofloxacin concentrates in urine. For bacteremia, an alternative antibiotic showing 'susceptible' should be chosen.",
    s: "Infectious Disease"
  },

  // ===== VACCINE MECHANISMS (40 questions) =====
  {
    q: "A nurse is preparing to administer the MMR vaccine to a 13-month-old child. The child has a runny nose, mild cough, and temperature of 37.6°C. The parent asks if the vaccine should be postponed. What is the nurse's best response?",
    o: ["Yes, all symptoms must resolve before vaccination", "No, mild illness is not a contraindication to vaccination. The vaccine can be safely administered today", "The child should receive only one component of the MMR today", "Give a half-dose of MMR and return for the remainder next week"],
    a: 1,
    r: "Mild acute illness with or without low-grade fever is NOT a contraindication to vaccination. Delaying vaccination for minor symptoms is a common cause of missed immunizations. The AAP, CDC, and WHO all state that children with mild URI symptoms can safely receive vaccines. True contraindications include: anaphylaxis to a previous dose, severe immunocompromise (for live vaccines), and moderate-to-severe acute illness.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is screening patients before influenza vaccination. Which patient should NOT receive the live attenuated influenza vaccine (FluMist)?",
    o: ["A healthy 25-year-old with no medical conditions", "A 30-year-old patient currently receiving chemotherapy for lymphoma", "A 10-year-old with well-controlled asthma", "A 45-year-old healthcare worker"],
    a: 1,
    r: "Live attenuated influenza vaccine (LAIV/FluMist) is contraindicated in immunocompromised patients, including those on chemotherapy. The weakened but living virus can replicate uncontrollably in immunosuppressed patients. This patient should receive the inactivated influenza injection instead. LAIV is also contraindicated in pregnancy, children <2 years, and adults >49 years.",
    s: "Infectious Disease"
  },
  {
    q: "A 28-year-old woman at 30 weeks gestation asks why she needs the Tdap vaccine now. The nurse explains:",
    o: ["Tdap is required by law during pregnancy", "Tdap at 27-36 weeks allows maternal antibodies to cross the placenta, providing passive pertussis protection to the newborn during the critical first months before their own DTaP series begins", "Tdap protects only the mother, not the baby", "Tdap should be given only after delivery"],
    a: 1,
    r: "Tdap vaccination at 27-36 weeks gestation optimizes maternal IgG production during the peak period of transplacental antibody transfer (third trimester). Passive pertussis antibodies protect the newborn during the vulnerable 0-2 month period before they receive their first DTaP dose at 2 months. Pertussis in young infants carries significant morbidity (apnea, pneumonia) and mortality.",
    s: "Infectious Disease"
  },
  {
    q: "A patient develops anaphylaxis within 3 minutes of receiving a vaccine. The nurse's FIRST action should be:",
    o: ["Administer diphenhydramine 50 mg IM", "Administer epinephrine 0.3 mg IM in the anterolateral thigh", "Call the provider for orders", "Start supplemental oxygen"],
    a: 1,
    r: "Epinephrine IM is the FIRST-LINE treatment for anaphylaxis and must be administered IMMEDIATELY without waiting for provider orders. Give 0.01 mg/kg (max 0.5 mg adult, 0.3 mg child) IM in the anterolateral thigh. Diphenhydramine and oxygen are adjuncts given AFTER epinephrine. Delay in epinephrine administration is the primary factor associated with fatal anaphylaxis.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching about mRNA vaccines. Which statement is CORRECT?",
    o: ["mRNA vaccines alter the recipient's DNA permanently", "mRNA vaccines deliver instructions for cells to produce a target antigen protein, triggering an immune response. The mRNA is degraded within hours and never enters the cell nucleus", "mRNA vaccines contain live virus", "mRNA vaccines provide immediate immunity without requiring an immune response"],
    a: 1,
    r: "mRNA vaccines deliver synthetic mRNA encapsulated in lipid nanoparticles. After injection, the mRNA is translated by ribosomes in the cytoplasm (NOT the nucleus) into the target antigen protein. This protein is displayed on cell surfaces, triggering adaptive immune responses. The mRNA is degraded by normal cellular enzymes within hours. mRNA NEVER enters the nucleus and CANNOT alter DNA.",
    s: "Infectious Disease"
  },
  {
    q: "A parent brings a 6-month-old infant for vaccinations. The nurse notes the child received packed red blood cells 2 weeks ago. Which vaccine must be deferred?",
    o: ["DTaP", "IPV (inactivated polio)", "MMR", "Hepatitis B"],
    a: 2,
    r: "Blood products contain passive antibodies that can neutralize live vaccine organisms before they replicate sufficiently to generate an immune response. MMR (live vaccine) must be deferred for 3-6 months after packed RBCs. Inactivated vaccines (DTaP, IPV, hepatitis B) are NOT affected by passive antibodies and can be given on schedule.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering vaccines to a 2-month-old infant. Which injection site is correct for IM administration?",
    o: ["Deltoid muscle", "Vastus lateralis (anterolateral thigh)", "Dorsogluteal (upper outer buttock)", "Ventrogluteal"],
    a: 1,
    r: "The vastus lateralis (anterolateral thigh) is the recommended IM injection site for infants under 12 months. This large, well-developed muscle provides adequate mass for IM injection and avoids sciatic nerve injury risk (gluteal sites). The deltoid is too small in infants. For children ≥12 months with adequate deltoid mass, the deltoid becomes acceptable.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is about to administer a vaccine and discovers the vial has been stored at room temperature for 8 hours instead of the required 2-8°C. What should the nurse do?",
    o: ["Administer the vaccine since it was only out for 8 hours", "Do NOT administer the vaccine — label it, isolate it, contact the manufacturer's stability data, and follow the facility's cold chain break protocol", "Place it back in the refrigerator and use it tomorrow", "Mix it with a properly stored vial"],
    a: 1,
    r: "Temperature excursions can damage vaccines: proteins may denature, adjuvants may be disrupted, and live organisms may become non-viable. The nurse should NOT administer a temperature-compromised vaccine. Follow facility protocol: mark the vial 'DO NOT USE,' document the excursion, consult manufacturer stability data and immunization guidelines, and replace with properly stored vaccine.",
    s: "Infectious Disease"
  },
  {
    q: "A patient asks, 'If I already had COVID-19, why do I need the vaccine?' The nurse's best evidence-based response is:",
    o: ["You don't need the vaccine after natural infection", "Vaccination after natural infection provides hybrid immunity with broader, stronger, and more durable protection than natural infection alone, including better coverage against variants", "The vaccine and natural infection provide identical protection", "Natural infection is always better than vaccination"],
    a: 1,
    r: "Hybrid immunity (natural infection + vaccination) generates broader, more durable immune responses than either alone. Vaccination after infection boosts antibody levels, broadens neutralizing antibody breadth against variants, and enhances memory B and T cell responses. Natural infection alone provides variable and sometimes short-lived immunity depending on disease severity.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the immunization record of a healthcare worker. Which vaccines should the nurse verify for healthcare employment?",
    o: ["Only seasonal influenza", "Hepatitis B (with surface antibody titer confirmation), MMR (2 doses or positive titers), varicella (2 doses or positive titers), Tdap, and annual influenza", "Only childhood vaccines", "No vaccines are required for healthcare workers"],
    a: 1,
    r: "Healthcare workers require verified immunity to: hepatitis B (anti-HBs ≥10 mIU/mL after 3-dose series), measles/mumps/rubella (2 documented doses or positive IgG titers), varicella (2 documented doses or positive IgG titers), Tdap (one dose), and annual influenza vaccination. These requirements protect both the healthcare worker and their vulnerable patients.",
    s: "Infectious Disease"
  },
  {
    q: "A 4-year-old child had a febrile seizure following a previous DTaP vaccination. The parent is concerned about the upcoming DTaP dose. The nurse should advise:",
    o: ["The child should never receive DTaP again", "Febrile seizures after vaccination are benign and do NOT contraindicate future doses. Acetaminophen may be given prophylactically if the provider recommends it", "Switch to Td vaccine instead", "Only the DT component should be given"],
    a: 1,
    r: "Febrile seizures (temperature-related seizures in children 6 months-5 years) after vaccination are benign, self-limited, and do NOT cause brain damage or epilepsy. They are NOT a contraindication to future doses. True contraindications to DTaP include: encephalopathy within 7 days of a previous dose. The parent should be reassured about the benign nature of febrile seizures.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about herd immunity is accurate?",
    o: ["Herd immunity provides 100% protection to everyone in the community", "Herd immunity protects unvaccinated individuals by reducing pathogen circulation when enough of the population is immune, but the threshold varies by pathogen (93-95% for measles)", "Herd immunity can be achieved with 20% vaccination coverage for all diseases", "Herd immunity eliminates the need for individual vaccination"],
    a: 1,
    r: "Herd immunity provides indirect protection to unvaccinated individuals when sufficient population immunity reduces pathogen transmission. The threshold depends on the pathogen's R0 (reproductive number): measles (R0=12-18) requires 93-95%, polio requires 80-86%, and influenza requires 33-44%. Herd immunity protects but does not guarantee individual protection — vaccination remains recommended for all eligible individuals.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is counseling a vaccine-hesitant parent. Which communication approach is MOST effective?",
    o: ["Dismiss the parent's concerns and insist on vaccination", "Use motivational interviewing: acknowledge concerns without judgment, provide evidence-based information in plain language, make a strong personal recommendation, and respect the parent's decision while offering future discussion", "Refuse to provide care until the child is vaccinated", "Provide only written materials without discussing concerns"],
    a: 1,
    r: "Motivational interviewing is the evidence-based approach for vaccine hesitancy: listen empathetically, acknowledge concerns without dismissal, ask permission to share information, provide evidence-based facts addressing specific concerns, make a strong personal recommendation ('I recommend this vaccine because...'), and maintain the relationship for future conversations. Coercive approaches increase resistance.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with egg allergy (history of hives after eating eggs) needs an influenza vaccine. Which is the most appropriate option?",
    o: ["The patient cannot receive any influenza vaccine", "Administer any age-appropriate influenza vaccine — studies show even egg-cultured vaccines are safe for patients with egg allergy limited to hives", "Only the high-dose influenza vaccine is safe", "Give a test dose of 0.1 mL first and wait 30 minutes"],
    a: 1,
    r: "Current CDC/ACIP guidelines state that persons with egg allergy of any severity (including hives) may receive any age-appropriate influenza vaccine. Even egg-cultured vaccines contain negligible egg protein (<1 mcg). No special precautions beyond the standard 15-minute observation period are needed for hives-only egg allergy. Patients with severe anaphylaxis to eggs should receive egg-free alternatives (Flublok, Flucelvax).",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering vaccines to a 12-month-old. The child is due for MMR, varicella, hepatitis A, and PCV13. Can all four vaccines be given today?",
    o: ["No, only two vaccines can be given at one visit", "Yes, multiple vaccines can be safely administered simultaneously at different anatomic sites. This is recommended to improve completion rates", "Only live vaccines can be given together", "Only inactivated vaccines can be given together"],
    a: 1,
    r: "Multiple vaccines can be safely administered simultaneously at different anatomic sites (separate limbs or ≥1 inch apart in the same limb). This is strongly recommended by CDC/ACIP to maximize immunization rates and reduce missed opportunities. Simultaneous administration does not reduce effectiveness or increase adverse events compared to sequential administration.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching about passive immunity. Which is an example of natural passive immunity?",
    o: ["Receiving the measles vaccine", "Maternal IgG antibodies crossing the placenta to the fetus, providing temporary protection for the first 3-6 months of life", "Developing immunity after recovering from chickenpox", "Receiving a tetanus booster"],
    a: 1,
    r: "Natural passive immunity occurs when maternal IgG antibodies cross the placenta (primarily in the third trimester) to the fetus, providing temporary protection against diseases the mother is immune to. This protection wanes over 3-6 months as maternal antibodies are catabolized. Breast milk IgA provides additional mucosal passive protection. Vaccines and natural infection produce active immunity.",
    s: "Infectious Disease"
  },
  {
    q: "What is SIRVA and how can the nurse prevent it?",
    o: ["A systemic vaccine reaction treated with epinephrine", "Shoulder Injury Related to Vaccine Administration — caused by injecting too high on the deltoid, prevented by identifying the correct site 2-3 fingerbreadths below the acromion process", "A normal post-vaccination fever", "A contraindication to future vaccination"],
    a: 1,
    r: "SIRVA occurs when the vaccine is inadvertently injected into the subdeltoid bursa, rotator cuff, or joint capsule due to injection placement too high on the deltoid. This causes persistent shoulder pain, bursitis, and limited ROM. Prevention: palpate the acromion process and inject 2-3 fingerbreadths below it, in the densest part of the deltoid muscle, using appropriate needle length.",
    s: "Infectious Disease"
  },
  {
    q: "A patient asks why they need a booster dose of a vaccine if they already completed the primary series. The nurse's best explanation is:",
    o: ["Booster doses are unnecessary if the primary series was completed", "Booster doses restimulate memory B-cells and T-cells, increasing antibody levels and broadening the immune response to maintain long-term protection as immunity naturally wanes over time", "Boosters are only given if the first doses didn't work", "Boosters contain completely different antigens than the primary series"],
    a: 1,
    r: "Booster doses work by restimulating immunological memory. Memory B-cells in lymphoid tissue rapidly proliferate and differentiate into plasma cells upon antigen re-exposure, producing high-affinity antibodies faster than the primary response. Boosters also drive further affinity maturation and class switching, enhancing protection quality. For some vaccines (tetanus, pertussis), immunity wanes without periodic boosting.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is assessing a child 2 hours after receiving rotavirus vaccine in the clinic. The parent calls reporting the infant has been crying inconsolably, drawing legs to the abdomen, and passed one bloody stool. What should the nurse suspect?",
    o: ["Normal vaccine side effect", "Intussusception — a rare but serious adverse event associated with rotavirus vaccine requiring immediate ED evaluation", "Gastroenteritis unrelated to the vaccine", "Colic"],
    a: 1,
    r: "Intussusception (telescoping of the intestine) is a rare but serious adverse event associated with rotavirus vaccine (risk approximately 1-6 per 100,000 doses). Classic signs: episodic inconsolable crying, drawing legs to abdomen (colicky pain), and 'currant jelly' (bloody mucoid) stool. This is a surgical emergency requiring immediate ED evaluation with air or contrast enema reduction.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing vaccine storage. Which vaccine requires frozen storage?",
    o: ["Hepatitis B", "Influenza (inactivated)", "Varicella (Varivax)", "DTaP"],
    a: 2,
    r: "Varicella vaccine (Varivax) requires frozen storage (-50°C to -15°C) because the live attenuated virus is thermolabile and rapidly loses potency at refrigerator temperatures. Other vaccines requiring freezer storage include MMRV (ProQuad) and certain COVID-19 mRNA vaccines. Most other vaccines are stored at 2-8°C. Accidental freezing of refrigerator-stored vaccines (like DTaP, hepatitis B) can destroy them.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is about to administer the varicella vaccine to a 4-year-old. Which finding would require the nurse to withhold the vaccine?",
    o: ["The child has a mild cold with runny nose", "The child is currently taking daily high-dose prednisone (2 mg/kg) for nephrotic syndrome", "The child had a mild fever after the first varicella dose", "The child ate breakfast 30 minutes ago"],
    a: 1,
    r: "High-dose systemic corticosteroids (≥2 mg/kg/day or ≥20 mg/day of prednisone for ≥14 days) cause immunosuppression sufficient to contraindicate live vaccines. The attenuated varicella virus could cause disseminated vaccine-strain infection in the immunosuppressed child. Wait ≥1 month after steroid discontinuation. Mild illness, prior mild reaction, and recent eating are NOT contraindications.",
    s: "Infectious Disease"
  },
  {
    q: "Which documentation is federally required after vaccine administration?",
    o: ["Only the vaccine name", "Vaccine name, manufacturer, lot number, expiration date, dose, route, site, date, VIS edition date and date given, and administrator's name and title", "Only the date of administration", "Documentation is optional for routine vaccines"],
    a: 1,
    r: "The National Childhood Vaccine Injury Act requires comprehensive documentation for all vaccines: vaccine name, manufacturer, lot number, expiration date, dose, route and anatomic site, date and time, Vaccine Information Statement (VIS) edition date and date provided to the patient, and name/title of the person administering. This must be recorded in both the medical record and immunization registry.",
    s: "Infectious Disease"
  },
  {
    q: "A 65-year-old patient asks about the shingles vaccine. Which type of vaccine is Shingrix?",
    o: ["Live attenuated vaccine", "Recombinant adjuvanted subunit vaccine containing glycoprotein E antigen", "mRNA vaccine", "Inactivated whole virus vaccine"],
    a: 1,
    r: "Shingrix is a recombinant adjuvanted vaccine containing varicella-zoster virus glycoprotein E combined with the AS01B adjuvant system. It is NOT a live vaccine, making it safe for immunocompromised patients (unlike the older Zostavax, which was live attenuated and has been discontinued). Two doses are required, 2-6 months apart. It is >90% effective at preventing herpes zoster.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is assigning care for patients in the immunization clinic. Which task is appropriate to delegate to the UAP?",
    o: ["Administering vaccines", "Screening patients for contraindications", "Measuring and documenting vital signs before vaccination", "Educating patients about vaccine benefits and risks"],
    a: 2,
    r: "Measuring vital signs is a routine, predictable task within UAP scope. Vaccine administration requires nursing assessment and is NOT delegable to UAPs. Screening for contraindications and patient education require clinical judgment and knowledge of vaccination science. Some states allow trained medical assistants to administer vaccines under direct supervision, but UAPs generally cannot.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about conjugate vaccines is CORRECT?",
    o: ["Conjugate vaccines are only for adults", "Conjugate vaccines link polysaccharide antigens to carrier proteins, enabling T-cell-dependent immune responses and memory formation in children under 2 years whose immune systems cannot respond to polysaccharides alone", "Conjugate vaccines contain live organisms", "Conjugate vaccines are less effective than pure polysaccharide vaccines"],
    a: 1,
    r: "Children under 2 years have immature B-cells that cannot mount T-cell-independent responses to polysaccharide antigens. Conjugating the polysaccharide to a protein carrier (CRM197, tetanus toxoid) converts it to a T-cell-dependent antigen, enabling helper T-cell recruitment, B-cell activation, affinity maturation, and immunological memory formation. Examples: PCV13, Hib, meningococcal conjugate.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse notices that two live vaccines were scheduled 14 days apart instead of the required 28-day minimum. What should the nurse do?",
    o: ["Administer both vaccines as scheduled", "The second live vaccine should be repeated because the immune response to the first may have interfered with the second. Wait at least 28 days from the invalid dose to re-administer", "Both vaccines need to be repeated", "No action needed — 14 days is sufficient"],
    a: 1,
    r: "When two live vaccines are given 4-27 days apart (not simultaneously), the first vaccine's immune activation can suppress replication of the second, reducing immunogenicity. The second dose is considered invalid and must be repeated ≥28 days after the invalid dose. If live vaccines are given simultaneously (same day, different sites), both are considered valid.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering hepatitis B vaccine to a newborn. The mother is HBsAg-positive. Which additional intervention is required?",
    o: ["No additional intervention beyond the routine vaccine", "Administer hepatitis B immune globulin (HBIG) within 12 hours of birth in addition to the hepatitis B vaccine, at a separate injection site", "Delay the vaccine until the infant is 2 months old", "Administer only HBIG without the vaccine"],
    a: 1,
    r: "Infants born to HBsAg-positive mothers require BOTH hepatitis B vaccine AND HBIG within 12 hours of birth for post-exposure prophylaxis. The vaccine stimulates active immunity (long-term), while HBIG provides immediate passive antibody protection during the critical early period before the infant's immune system responds to the vaccine. They must be given at different injection sites.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is observing a patient who received a vaccine 20 minutes ago. The patient reports feeling lightheaded and appears pale and diaphoretic. HR is 52 bpm, BP is 96/58. What does the nurse suspect?",
    o: ["Anaphylaxis requiring epinephrine", "Vasovagal syncope — a common post-vaccination response managed by positioning supine with legs elevated", "Cardiogenic shock", "Allergic reaction requiring diphenhydramine"],
    a: 1,
    r: "Vasovagal syncope (fainting) is the most common adverse event after vaccination in adolescents and adults. It presents with lightheadedness, pallor, diaphoresis, bradycardia, and hypotension — distinctly different from anaphylaxis (which presents with urticaria, bronchospasm, angioedema, and tachycardia). Management: position supine, elevate legs, monitor until resolved. Not life-threatening.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is counseling a patient who states, 'I've heard vaccines cause autism.' Which response is MOST appropriate?",
    o: ["There may be a small risk", "Extensive research involving millions of children has consistently found NO link between vaccines and autism. The original study claiming a link was retracted due to fraud, and the author lost his medical license", "We don't know for sure", "I'm not sure, you should ask your doctor"],
    a: 1,
    r: "The original 1998 Lancet study by Andrew Wakefield was retracted in 2010 due to ethical violations and data fraud. Wakefield lost his medical license. Since then, dozens of large-scale studies involving millions of children across multiple countries have found NO association between vaccines (including MMR) and autism. Nurses should provide this evidence-based information clearly and compassionately.",
    s: "Infectious Disease"
  },
  {
    q: "Which patient should receive the pneumococcal conjugate vaccine (PCV20) rather than the pneumococcal polysaccharide vaccine (PPSV23)?",
    o: ["All adults regardless of age or risk factors", "Adults ≥65 years or those 19-64 with certain risk conditions who have not previously received PCV, as current ACIP guidelines recommend conjugate vaccine for enhanced immunogenicity and broader serotype coverage", "Only children under 2 years", "Only immunocompromised patients"],
    a: 1,
    r: "Current ACIP guidelines recommend PCV20 (conjugate) for adults ≥65 and those 19-64 with risk conditions (immunocompromised, chronic disease, CSF leaks, cochlear implants). Conjugate vaccines provide T-cell-dependent responses with better immunological memory compared to polysaccharide vaccines. PCV20 covers the 20 most clinically significant pneumococcal serotypes with a single vaccine.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is preparing to administer vaccines. Which action is essential to prevent vaccine administration errors?",
    o: ["Only verify the vaccine name", "Verify the correct vaccine, dose, route, patient identity using two identifiers, check expiration date, and confirm no contraindications — following the rights of medication administration", "Ask the patient to identify the vaccine", "Visual inspection of the vial is sufficient"],
    a: 1,
    r: "Vaccine administration follows the same medication safety rights: right patient (two identifiers), right vaccine, right dose, right route, right time, right documentation. Additionally: verify expiration date, assess for contraindications/precautions, provide VIS, ensure proper storage, and have emergency equipment available. Errors include wrong vaccine, wrong dose, wrong route, and expired vaccine.",
    s: "Infectious Disease"
  },

  // ===== ADDITIONAL ANTIBIOTIC RESISTANCE (6 questions) =====
  {
    q: "A nurse is caring for a patient with Pseudomonas aeruginosa bacteremia. The provider orders meropenem monotherapy. Two days later, repeat cultures show persistent Pseudomonas now resistant to meropenem. Which resistance mechanism most likely developed?",
    o: ["MRSA-type target modification via mecA gene", "Loss of OprD porin preventing meropenem entry into the cell, combined with possible efflux pump upregulation", "Vancomycin resistance via vanA gene", "Beta-lactamase production specifically targeting meropenem"],
    a: 1,
    r: "Pseudomonas develops carbapenem resistance through OprD porin loss (preventing meropenem entry into the periplasm) and efflux pump upregulation (MexAB-OprM actively pumping meropenem out). This is why combination therapy is recommended for Pseudomonas — monotherapy has a high risk of resistance development. MecA is MRSA-specific, vanA is VRE-specific.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse identifies that three patients on the unit have developed new VRE colonization within 2 weeks. Which infection control action is MOST important?",
    o: ["Continue standard precautions for all patients", "Initiate an infection prevention investigation: implement enhanced contact precautions, assess hand hygiene compliance, perform active surveillance cultures on contacts, and review environmental cleaning practices", "Place all unit patients on airborne precautions", "Close the unit permanently"],
    a: 1,
    r: "A cluster of new VRE colonization suggests horizontal transmission on the unit. An infection prevention investigation should assess: hand hygiene compliance (the most common transmission route), adequacy of contact precautions for known VRE patients, environmental cleaning effectiveness, shared equipment decontamination, and active surveillance cultures to identify additional colonized patients.",
    s: "Infectious Disease"
  },
  {
    q: "A patient with a complicated skin and soft tissue infection has cultures showing MRSA with a vancomycin MIC of 2 mcg/mL (susceptible but at the upper limit). The provider is considering treatment options. The nurse anticipates which discussion?",
    o: ["Standard vancomycin dosing will be adequate regardless of MIC", "With a vancomycin MIC at the upper susceptible range, the provider may consider alternative agents (daptomycin, linezolid) because higher MIC values correlate with worse clinical outcomes even within the 'susceptible' range", "MIC values are irrelevant for treatment decisions", "The infection cannot be treated"],
    a: 1,
    r: "Vancomycin MIC of 2 mcg/mL, while technically susceptible, is associated with higher clinical failure rates (vancomycin MIC creep). Achieving an AUC/MIC of 400-600 with MIC of 2 requires higher doses, increasing nephrotoxicity risk. Many infectious disease specialists recommend alternative agents (daptomycin for bacteremia, linezolid for pneumonia) when vancomycin MIC is ≥2 mcg/mL.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is involved in an antibiotic stewardship initiative. Which data metric BEST demonstrates the program's effectiveness?",
    o: ["Total antibiotic spending reduction", "Decreased days of therapy (DOT) per 1,000 patient-days combined with stable or improved clinical outcomes and decreased C. difficile rates", "Number of antibiotic orders written per shift", "Nurse satisfaction scores"],
    a: 1,
    r: "Days of therapy (DOT) per 1,000 patient-days is the gold-standard metric for stewardship programs. It measures antibiotic utilization intensity. Effective stewardship reduces DOT while maintaining or improving clinical outcomes (mortality, readmission) and reducing adverse events (C. difficile). Cost reduction alone may reflect formulary changes rather than true optimization.",
    s: "Infectious Disease"
  },
  {
    q: "Which statement about daptomycin is CORRECT?",
    o: ["Daptomycin is effective for MRSA pneumonia", "Daptomycin is inactivated by pulmonary surfactant, making it ineffective for pneumonia — it is used for MRSA bacteremia, endocarditis, and skin/soft tissue infections", "Daptomycin can replace vancomycin in all clinical scenarios", "Daptomycin has no significant side effects"],
    a: 1,
    r: "Daptomycin is a lipopeptide antibiotic effective against MRSA and VRE. However, it is inactivated by pulmonary surfactant, making it ineffective for pneumonia. It is used for MRSA bacteremia, endocarditis, and skin/soft tissue infections. Key adverse effects include CPK elevation (rhabdomyolysis), eosinophilic pneumonia, and peripheral neuropathy. Monitor CPK levels weekly.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing an antibiogram. Which statement about antibiograms is CORRECT?",
    o: ["Antibiograms reflect individual patient susceptibility patterns", "Antibiograms are facility-specific cumulative susceptibility reports that guide empiric antibiotic selection based on local resistance patterns — they are updated annually", "Antibiograms are only used by pharmacists", "Antibiograms are identical across all healthcare facilities"],
    a: 1,
    r: "Antibiograms compile cumulative antibiotic susceptibility data for organisms isolated at a specific facility over 12 months. They guide empiric antibiotic selection based on LOCAL resistance patterns, which vary between facilities and regions. For empiric therapy, antibiotics with ≥80% susceptibility on the antibiogram are preferred. Antibiograms are updated annually and are essential stewardship tools.",
    s: "Infectious Disease"
  },

  // ===== ADDITIONAL VACCINE MECHANISMS (9 questions) =====
  {
    q: "A nurse is caring for a patient with HIV. The patient's most recent CD4 count is 150 cells/mm3. Which vaccines can the nurse safely administer?",
    o: ["MMR and varicella (live vaccines)", "Inactivated influenza, pneumococcal (PCV20), and hepatitis B vaccines — live vaccines are contraindicated when CD4 <200", "All vaccines including live vaccines are safe", "No vaccines should be given to HIV patients"],
    a: 1,
    r: "HIV patients with CD4 <200 cells/mm3 are significantly immunocompromised, contraindicting live vaccines (MMR, varicella, live influenza, yellow fever). Inactivated vaccines are safe and recommended, including PCV20, hepatitis B, Tdap, inactivated influenza, and COVID-19 vaccines. When CD4 recovers to >200 on antiretroviral therapy, live vaccines may be reconsidered.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is teaching about the difference between inactivated and live attenuated vaccines. Which statement demonstrates understanding?",
    o: ["Inactivated vaccines cause stronger immunity than live vaccines", "Live attenuated vaccines stimulate both humoral and robust cell-mediated immunity through actual viral replication, producing longer-lasting immunity, while inactivated vaccines primarily stimulate humoral immunity and often require boosters", "Both vaccine types produce identical immune responses", "Inactivated vaccines cannot be given to any immunocompromised patients"],
    a: 1,
    r: "Live attenuated vaccines replicate within host cells, activating both MHC class I (cell-mediated/CTL) and MHC class II (humoral/antibody) pathways, producing comprehensive, long-lasting immunity (often with fewer doses). Inactivated vaccines cannot replicate and primarily activate MHC class II/humoral immunity, requiring multiple doses and boosters. However, inactivated vaccines are safer for immunocompromised patients.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse receives a call from a parent whose 3-year-old was exposed to a child with chickenpox at daycare yesterday. The 3-year-old has not received the varicella vaccine. What post-exposure intervention should the nurse recommend?",
    o: ["No intervention is possible after exposure", "Varicella vaccine administered within 3-5 days of exposure can prevent or significantly modify disease in unvaccinated immunocompetent children", "Administer acyclovir prophylactically for 21 days", "Wait and treat chickenpox if it develops"],
    a: 1,
    r: "Post-exposure varicella vaccination within 3-5 days of exposure is approximately 70-100% effective at preventing varicella or modifying disease severity in unvaccinated immunocompetent individuals. This serves as both post-exposure prophylaxis AND the first dose of the recommended 2-dose series. Varicella immune globulin (VariZIG) is reserved for immunocompromised or pregnant exposed individuals.",
    s: "Infectious Disease"
  },
  {
    q: "A new graduate nurse asks: 'Why do we give multiple vaccines at different sites instead of mixing them in one syringe?' The preceptor's BEST response is:",
    o: ["It's just hospital policy with no scientific basis", "Mixing vaccines in the same syringe can cause chemical incompatibility, reduced immunogenicity, or increased adverse reactions. Each vaccine is formulated and tested for administration as a separate injection. Only manufacturer-approved combinations (e.g., Pediarix) should be given from one syringe", "Mixing is fine if you need to reduce the number of injections", "Separate injections are only for billing purposes"],
    a: 1,
    r: "Vaccines are complex biological products with specific pH, buffering, and adjuvant requirements. Mixing non-approved combinations can cause: chemical reactions that inactivate antigens, precipitation of adjuvants, altered immune responses, and increased local reactions. Only FDA/Health Canada-approved combination vaccines (e.g., Pediarix = DTaP + IPV + Hep B) should be drawn from the same vial.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is reviewing the CDC catch-up immunization schedule for a 7-year-old refugee child with no prior vaccination records. Which principle guides the catch-up schedule?",
    o: ["Start the entire vaccination series from birth doses", "Apply the catch-up schedule: minimum intervals between doses are used to accelerate protection, some vaccines have different formulations for older children (Td instead of DTaP for ≥7 years), and all age-appropriate vaccines should be started simultaneously", "Only one vaccine can be given at each visit", "No vaccines are needed since the child's immune system is mature"],
    a: 1,
    r: "The catch-up schedule uses minimum intervals (shorter than routine schedule intervals) to accelerate immunity. For children ≥7 years, Td/Tdap replaces DTaP (DTaP is not approved for ≥7 years). Multiple vaccines should be given simultaneously at the first visit to maximize protection. The schedule accounts for age-specific formulations and minimum ages for each vaccine.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering the rotavirus vaccine to a 2-month-old infant. Which route of administration is correct?",
    o: ["Intramuscular injection in the vastus lateralis", "Oral administration — rotavirus vaccine is given by mouth, not by injection", "Subcutaneous injection in the upper arm", "Intradermal injection"],
    a: 1,
    r: "Rotavirus vaccine (RotaTeq, Rotarix) is administered ORALLY — it is a live attenuated oral vaccine that stimulates mucosal immunity in the GI tract where rotavirus causes disease. It is the only routinely recommended oral vaccine in the US childhood schedule. The first dose must be given before 15 weeks of age, and the series must be completed by 8 months of age.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is counseling a patient who asks: 'Can vaccines give me the disease they're supposed to prevent?' Which response is MOST accurate?",
    o: ["Yes, all vaccines carry this risk", "Inactivated, subunit, mRNA, and toxoid vaccines CANNOT cause disease because they don't contain live organisms. Live attenuated vaccines contain weakened organisms that very rarely cause mild vaccine-strain illness (e.g., mild varicella rash) but not the full disease, and are contraindicated in immunocompromised patients for this reason", "No vaccine has ever caused any illness", "Only mRNA vaccines can cause disease"],
    a: 1,
    r: "This response accurately distinguishes vaccine types: inactivated/subunit/mRNA/toxoid vaccines cannot replicate and cannot cause disease. Live attenuated vaccines (MMR, varicella, rotavirus) can rarely cause mild vaccine-strain illness (e.g., vaccine-associated varicella rash in ~5% of recipients) but not the full severity of natural disease. The risk of live vaccine complications in immunocompromised patients is the basis for contraindication.",
    s: "Infectious Disease"
  },
  {
    q: "A school nurse is reviewing vaccination compliance for kindergarten entry. A parent provides a religious exemption form declining all vaccines. What is the nurse's MOST appropriate action?",
    o: ["Refuse school enrollment", "Accept the exemption per state/provincial law, document it in the student's file, ensure the parent understands the increased disease risk for their child and others, and develop an exclusion plan for the child if an outbreak occurs at the school", "Administer vaccines without parental consent", "Ignore the exemption and mark the child as vaccinated"],
    a: 1,
    r: "Religious and philosophical exemptions vary by jurisdiction. The nurse should: accept valid exemptions per applicable law, thoroughly document the exemption, provide evidence-based education about disease risks, and create an outbreak management plan (the unvaccinated child may need temporary school exclusion during outbreaks). Respecting the parent's decision while advocating for vaccination is the ethical approach.",
    s: "Infectious Disease"
  },
  {
    q: "A nurse is administering the HPV vaccine (Gardasil 9) to a 12-year-old. The parent asks what the vaccine prevents. The MOST accurate response is:",
    o: ["HPV vaccine prevents all sexually transmitted infections", "Gardasil 9 protects against 9 strains of HPV that cause approximately 90% of cervical cancers, genital warts, and HPV-related anal, oropharyngeal, vulvar, vaginal, and penile cancers. It is recommended for all adolescents starting at age 11-12", "HPV vaccine only prevents genital warts", "HPV vaccine is only for girls"],
    a: 1,
    r: "Gardasil 9 covers HPV types 6, 11 (genital warts), 16, 18, 31, 33, 45, 52, and 58 (cancer-causing strains). It prevents approximately 90% of HPV-related cancers including cervical, anal, oropharyngeal, vulvar, vaginal, and penile cancers. It is recommended for all adolescents (boys AND girls) starting at age 11-12, with catch-up through age 26.",
    s: "Infectious Disease"
  }
];
